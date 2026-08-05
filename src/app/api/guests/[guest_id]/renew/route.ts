import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient, createServerServiceRoleClient } from '@/server/supabaseClient';
import { renewGuestToken } from '@/server/guestTokens';
import { checkRateLimit } from '@/lib/rateLimit';

export async function POST(request: NextRequest, { params }: { params: Promise<{ guest_id: string }> }) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anon';
  const rate = checkRateLimit(`guests_renew_${ip}`, { windowMs: 60000, max: 20 });
  if (!rate.success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const { guest_id } = await params;
    const guestId = guest_id;
    if (!z.string().uuid().safeParse(guestId).success) {
      return NextResponse.json({ error: 'Invalid guest ID' }, { status: 400 });
    }

    const supabase = await createAdminClient();
    const { data: { session } } = await supabase.auth.getSession();

    let isAuthorized = false;
    let authUserId = 'anonymous';
    let weddingId = null;

    // We need to fetch the guest first to get the wedding_id
    const { data: guest, error: guestError } = await supabase
      .from('guests')
      .select('id, wedding_id, public_id')
      .eq('id', guestId)
      .single();

    if (guestError || !guest) {
      return NextResponse.json({ error: 'Guest not found' }, { status: 404 });
    }
    weddingId = guest.wedding_id;

    if (session?.user) {
      const { data: wedding, error: weddingError } = await supabase
        .from('weddings')
        .select('id, user_id')
        .eq('id', weddingId)
        .eq('user_id', session.user.id)
        .single();
      
      if (!weddingError && wedding) {
        isAuthorized = true;
        authUserId = session.user.id;
      }
    }

    if (!isAuthorized) {
      const cookieStore = await import('next/headers').then(m => m.cookies());
      const storedCookie = cookieStore.get(`admin_auth_${weddingId}`)?.value;
      const { verifyAdminCookie } = await import('@/lib/auth-cookie');
      
      if (storedCookie && verifyAdminCookie(weddingId, storedCookie)) {
        isAuthorized = true;
        authUserId = 'cookie_admin';
      }
    }

    if (!isAuthorized) {
      console.warn(JSON.stringify({ event: 'audit', action: 'guests_renew_unauthorized', ip }));
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Currently renewGuestToken uses a service role client internally!
    const tokenUrl = await renewGuestToken(guestId);
    if (!tokenUrl) {
      throw new Error('Failed to renew token');
    }

    console.info(JSON.stringify({ event: 'audit', action: 'guests_renew_success', user: authUserId, guestId }));
    
    return NextResponse.json({ success: true, tokenUrl }, {
      headers: {
        'Cache-Control': 'private, no-store',
      }
    });
  } catch (error: any) {
    console.error('Guests renew error:', error.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
