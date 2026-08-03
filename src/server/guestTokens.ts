import "server-only";
import crypto from "crypto";
import { supabase } from "@/lib/supabase";

const SECRET_KEY = process.env.GUEST_TOKEN_SECRET_V1 || 'development_secret_only_do_not_use_in_prod';
const KEY_VERSION = parseInt(process.env.GUEST_TOKEN_ACTIVE_KEY_VERSION || '1', 10);

export type GuestTokenPayload = {
  publicId: string;
  tokenVersion: number;
  expiresAt?: number;
  keyVersion: number;
};

export type PublicGuestContext = {
  displayName: string;
  groupDisplayName?: string;
  allowedPlusOnes?: number;
  allowedChildren?: number;
  rsvpStatus?: "attending" | "not_attending" | "undecided";
  tableLabel?: string;
};

export function generateGuestToken(publicId: string, tokenVersion: number, expiresAt?: number): string {
  const payload: GuestTokenPayload = {
    publicId,
    tokenVersion,
    keyVersion: KEY_VERSION,
  };
  if (expiresAt) payload.expiresAt = expiresAt;

  const payloadStr = JSON.stringify(payload);
  const base64Payload = Buffer.from(payloadStr).toString('base64url');
  
  const hmac = crypto.createHmac('sha256', SECRET_KEY);
  hmac.update(payloadStr);
  const signature = hmac.digest('base64url');
  
  return `${base64Payload}.${signature}`;
}

export function verifyGuestToken(token: string): GuestTokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [encodedPayload, signature] = parts;
    const payloadStr = Buffer.from(encodedPayload, 'base64url').toString('utf8');
    
    // Check signature
    const hmac = crypto.createHmac('sha256', SECRET_KEY);
    hmac.update(payloadStr);
    const expectedSignature = hmac.digest('base64url');

    // Constant-time comparison
    if (signature.length !== expectedSignature.length) return null;
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }

    const payload = JSON.parse(payloadStr) as GuestTokenPayload;

    // Validate payload fields
    if (!payload.publicId || typeof payload.tokenVersion !== 'number') return null;
    if (payload.expiresAt && payload.expiresAt < Date.now()) return null;

    return payload;
  } catch (error) {
    return null;
  }
}

export async function resolveGuestToken(token: string, weddingId: string): Promise<PublicGuestContext | null> {
  const payload = verifyGuestToken(token);
  if (!payload) return null;

  try {
    const { data: guest, error } = await supabase
      .from('guests')
      .select('id, wedding_id, token_version, token_revoked_at, token_expires_at, deleted_at, first_name, last_name, plus_ones_allowed, children_count, rsvp_status')
      .eq('public_id', payload.publicId)
      .single();

    if (error || !guest) return null;

    // Security constraints
    if (guest.wedding_id !== weddingId) return null;
    if (guest.deleted_at) return null;
    if (guest.token_revoked_at) return null;
    if (guest.token_expires_at && new Date(guest.token_expires_at).getTime() < Date.now()) return null;
    if (guest.token_version !== payload.tokenVersion) return null;

    // We can also fetch wedding status if necessary
    const { data: wedding, error: weddingError } = await supabase
      .from('weddings')
      .select('is_active, deleted_at')
      .eq('id', weddingId)
      .single();
      
    if (weddingError || !wedding) return null;
    if (wedding.deleted_at || !wedding.is_active) return null;

    // Map to safe public context
    return {
      displayName: `${guest.first_name} ${guest.last_name}`,
      allowedPlusOnes: guest.plus_ones_allowed || 0,
      allowedChildren: guest.children_count || 0,
      rsvpStatus: guest.rsvp_status as any,
    };
  } catch (error) {
    console.error('Error resolving guest token:', error);
    return null;
  }
}

export async function renewGuestToken(guestId: string): Promise<string | null> {
  // Finds the guest by their true ID, increments token_version, clears revoked/expires, and returns new token
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
