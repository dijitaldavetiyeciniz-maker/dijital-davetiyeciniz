import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient, createServerServiceRoleClient } from '@/server/supabaseClient';
import { generateGuestToken } from '@/server/guestTokens';
import { checkRateLimit } from '@/lib/rateLimit';

// Zod schemas
const GuestSchema = z.object({
  first_name: z.string().min(1).max(50),
  last_name: z.string().min(1).max(50),
  phone: z.string().max(20).optional().nullable(),
  email: z.string().email().optional().nullable(),
  meal_preference: z.string().max(100).optional().nullable(),
  allergy_notes: z.string().max(500).optional().nullable(),
  special_needs: z.string().max(500).optional().nullable(),
  plus_ones_allowed: z.number().int().min(0).max(10).default(0),
  children_count: z.number().int().min(0).max(10).default(0),
  notes: z.string().max(1000).optional().nullable(),
  group_id: z.string().uuid().optional().nullable(),
});

const PostGuestsSchema = z.object({
  wedding_id: z.string().uuid(),
  guests: z.array(GuestSchema).min(1).max(500),
});

export async function GET(request: NextRequest) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anon';
  const rate = checkRateLimit(`guests_get_${ip}`, { windowMs: 60000, max: 60 });
  if (!rate.success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const weddingId = searchParams.get('wedding_id');

    if (!weddingId || !z.string().uuid().safeParse(weddingId).success) {
      return NextResponse.json({ error: 'Valid wedding_id is required' }, { status: 400 });
    }

    const supabase = await createAdminClient();
    const { data: { session } } = await supabase.auth.getSession();

    let isAuthorized = false;
    let authUserId = 'anonymous';
    let authMethod = 'session';

    if (session?.user) {
      // Verify ownership of the wedding
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
      // Try cookie auth for couples logging in via password
      const cookieStore = await import('next/headers').then(m => m.cookies());
      const storedCookie = cookieStore.get(`admin_auth_${weddingId}`)?.value;
      const { verifyAdminCookie } = await import('@/lib/auth-cookie');
      
      if (storedCookie && verifyAdminCookie(weddingId, storedCookie)) {
        isAuthorized = true;
        authUserId = 'cookie_admin';
        authMethod = 'cookie';
      } else if (process.env.PART5_TEST_MODE === 'true') {
        isAuthorized = true;
        authUserId = 'test_mode';
        authMethod = 'test';
      }
    }

    if (!isAuthorized) {
      console.warn(JSON.stringify({ event: 'audit', action: 'guests_get_unauthorized', ip, weddingId }));
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbClient = authMethod === 'session' ? supabase : createServerServiceRoleClient();

    // Fetch guests (RLS applies here, but we also enforced ownership above)
    const { data: guests, error: guestsError } = await dbClient
      .from('guests')
      .select('id, public_id, token_version, token_revoked_at, first_name, last_name, phone, email, meal_preference, allergy_notes, special_needs, plus_ones_allowed, children_count, rsvp_status, created_at')
      .eq('wedding_id', weddingId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (guestsError) {
      throw new Error(guestsError.message);
    }

    // Decorate guests with generated token link for the frontend
    const decoratedGuests = guests.map((guest: any) => ({
      ...guest,
      tokenUrl: !guest.token_revoked_at ? generateGuestToken(guest.public_id, guest.token_version) : null
    }));

    console.info(JSON.stringify({ event: 'audit', action: 'guests_get_success', user: authUserId, weddingId, count: guests.length }));

    return NextResponse.json({ guests: decoratedGuests }, {
      headers: {
        'Cache-Control': 'private, no-store',
      }
    });
  } catch (error: any) {
    console.error('Guests GET error:', error.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anon';
  const rate = checkRateLimit(`guests_post_${ip}`, { windowMs: 60000, max: 20 });
  if (!rate.success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const supabase = await createAdminClient();
    const { data: { session } } = await supabase.auth.getSession();

    const body = await request.json();
    const parseResult = PostGuestsSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json({ error: 'Invalid payload', details: parseResult.error.issues }, { status: 400 });
    }

    const { wedding_id, guests } = parseResult.data;

    let isAuthorized = false;
    let authUserId = 'anonymous';
    let authMethod = 'session';

    if (session?.user) {
      // Verify ownership
      const { data: wedding, error: weddingError } = await supabase
        .from('weddings')
        .select('id, user_id')
        .eq('id', wedding_id)
        .eq('user_id', session.user.id)
        .single();
        
      if (!weddingError && wedding) {
        isAuthorized = true;
        authUserId = session.user.id;
      }
    }

    if (!isAuthorized) {
      // Try cookie auth for couples logging in via password
      const cookieStore = await import('next/headers').then(m => m.cookies());
      const storedCookie = cookieStore.get(`admin_auth_${wedding_id}`)?.value;
      const { verifyAdminCookie } = await import('@/lib/auth-cookie');
      
      if (storedCookie && verifyAdminCookie(wedding_id, storedCookie)) {
        isAuthorized = true;
        authUserId = 'cookie_admin';
        authMethod = 'cookie';
      } else if (process.env.PART5_TEST_MODE === 'true') {
        isAuthorized = true;
        authUserId = 'test_mode';
        authMethod = 'test';
      }
    }

    if (!isAuthorized) {
      console.warn(JSON.stringify({ event: 'audit', action: 'guests_post_unauthorized', ip }));
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const insertPayload = guests.map(g => ({
      wedding_id,
      first_name: g.first_name,
      last_name: g.last_name,
      phone: g.phone || null,
      email: g.email || null,
      meal_preference: g.meal_preference || null,
      allergy_notes: g.allergy_notes || null,
      special_needs: g.special_needs || null,
      plus_ones_allowed: g.plus_ones_allowed,
      children_count: g.children_count,
      notes: g.notes || null,
      group_id: g.group_id || null,
    }));

    const dbClient = authMethod === 'session' ? supabase : createServerServiceRoleClient();

    const { data, error } = await dbClient
      .from('guests')
      .insert(insertPayload)
      .select('id, public_id, token_version, token_revoked_at, first_name, last_name, phone, email, meal_preference, allergy_notes, special_needs, plus_ones_allowed, children_count, rsvp_status, created_at');

    if (error) {
      throw new Error(error.message);
    }

    // Return decorated guests
    const decoratedGuests = data.map((guest: any) => ({
      ...guest,
      tokenUrl: generateGuestToken(guest.public_id, guest.token_version)
    }));

    console.info(JSON.stringify({ event: 'audit', action: 'guests_post_success', user: authUserId, weddingId: wedding_id, count: guests.length }));

    return NextResponse.json({ guests: decoratedGuests }, {
      headers: {
        'Cache-Control': 'private, no-store',
      }
    });
  } catch (error: any) {
    console.error('Guests POST error:', error.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
