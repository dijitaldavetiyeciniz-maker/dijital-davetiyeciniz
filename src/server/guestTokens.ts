import "server-only";
import { supabase } from "@/lib/supabase";
import { generateGuestTokenCore, verifyGuestTokenCore, GuestTokenPayload } from "@/lib/security/guestTokenCore";

export type { GuestTokenPayload };

const getSecretKey = () => {
  const secret = process.env.GUEST_TOKEN_SECRET_V1;
  if (!secret) throw new Error('GUEST_TOKEN_SECRET_V1 is not configured');
  return secret;
};

const KEY_VERSION = parseInt(process.env.GUEST_TOKEN_ACTIVE_KEY_VERSION || '1', 10);

export type PublicGuestContext = {
  displayName: string;
  groupDisplayName?: string;
  allowedPlusOnes?: number;
  allowedChildren?: number;
  rsvpStatus?: "attending" | "not_attending" | "undecided";
  tableLabel?: string;
};

export function generateGuestToken(publicId: string, tokenVersion: number, expiresAt?: number): string {
  return generateGuestTokenCore(publicId, tokenVersion, getSecretKey(), KEY_VERSION, expiresAt);
}

export function verifyGuestToken(token: string): GuestTokenPayload | null {
  return verifyGuestTokenCore(token, getSecretKey());
}

export type TokenDiagnostic = 
  | 'invalid_token'
  | 'guest_not_found'
  | 'token_version_mismatch'
  | 'token_revoked'
  | 'token_expired'
  | 'guest_deleted'
  | 'wedding_not_found'
  | 'wedding_slug_mismatch'
  | 'unknown_error';

export async function resolveGuestTokenDetailed(token: string, weddingSlug: string): Promise<{ resolved: PublicGuestContext | null; diagnostic?: { reason: TokenDiagnostic } }> {
  const payload = verifyGuestToken(token);
  if (!payload) return { resolved: null, diagnostic: { reason: 'invalid_token' } };

  try {
    const { data: guest, error } = await supabase
      .from('guests')
      .select('id, wedding_id, token_version, token_revoked_at, token_expires_at, deleted_at, first_name, last_name, plus_ones_allowed, children_count, rsvp_status')
      .eq('public_id', payload.publicId)
      .single();

    if (error || !guest) return { resolved: null, diagnostic: { reason: 'guest_not_found' } };

    if (guest.deleted_at) return { resolved: null, diagnostic: { reason: 'guest_deleted' } };
    if (guest.token_revoked_at) return { resolved: null, diagnostic: { reason: 'token_revoked' } };
    if (guest.token_expires_at && new Date(guest.token_expires_at).getTime() <= Date.now()) return { resolved: null, diagnostic: { reason: 'token_expired' } };
    if (guest.token_version !== payload.tokenVersion) return { resolved: null, diagnostic: { reason: 'token_version_mismatch' } };

    const { data: wedding, error: weddingError } = await supabase
      .from('weddings')
      .select('slug, is_active, deleted_at')
      .eq('id', guest.wedding_id)
      .single();
      
    if (weddingError || !wedding || wedding.deleted_at || !wedding.is_active) return { resolved: null, diagnostic: { reason: 'wedding_not_found' } };
    if (wedding.slug !== weddingSlug) return { resolved: null, diagnostic: { reason: 'wedding_slug_mismatch' } };

    return {
      resolved: {
        displayName: [guest.first_name, guest.last_name].filter(Boolean).join(' '),
        allowedPlusOnes: guest.plus_ones_allowed || 0,
        allowedChildren: guest.children_count || 0,
        rsvpStatus: guest.rsvp_status as any,
      }
    };
  } catch (error) {
    console.error('Error resolving guest token:', error);
    return { resolved: null, diagnostic: { reason: 'unknown_error' } };
  }
}

export async function resolveGuestToken(token: string, weddingSlug: string): Promise<PublicGuestContext | null> {
  const { resolved } = await resolveGuestTokenDetailed(token, weddingSlug);
  return resolved;
}

export async function renewGuestToken(guestId: string): Promise<string | null> {
  try {
    const { data: guest, error } = await supabase
      .from('guests')
      .select('public_id, token_version')
      .eq('id', guestId)
      .single();
      
    if (error || !guest) return null;
    
    const nextVersion = (guest.token_version || 0) + 1;
    
    const { data: updatedGuest, error: updateError } = await supabase
      .from('guests')
      .update({
        token_version: nextVersion,
        token_revoked_at: null,
      })
      .eq('id', guestId)
      .select('public_id, token_version')
      .single();
      
    if (updateError || !updatedGuest) return null;
    
    return generateGuestToken(updatedGuest.public_id, updatedGuest.token_version);
  } catch {
    return null;
  }
}

export async function revokeGuestToken(guestId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('guests')
      .update({
        token_revoked_at: new Date().toISOString()
      })
      .eq('id', guestId);
      
    return !error;
  } catch {
    return false;
  }
}
