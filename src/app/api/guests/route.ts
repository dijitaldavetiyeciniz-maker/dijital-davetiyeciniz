import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { verifyAdminCookie } from '@/lib/auth-cookie';
import { generateGuestToken } from '@/lib/guestTokens';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const weddingId = searchParams.get('wedding_id');

    if (!weddingId) {
      return NextResponse.json({ error: 'wedding_id is required' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const storedCookie = cookieStore.get(`admin_auth_${weddingId}`)?.value;

    if (!storedCookie || !verifyAdminCookie(weddingId, storedCookie)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch guests
    const { data: guests, error: guestsError } = await supabase
      .from('guests')
      .select('*')
      .eq('wedding_id', weddingId)
      .order('created_at', { ascending: false });

    if (guestsError) {
      return NextResponse.json({ error: guestsError.message }, { status: 500 });
    }

    // Decorate guests with generated token link for the frontend
    const decoratedGuests = guests.map(guest => ({
      ...guest,
      // generate token on the fly so admin can copy it
      tokenUrl: !guest.is_revoked ? generateGuestToken(guest.id, guest.token_version) : null
    }));

    return NextResponse.json({ guests: decoratedGuests });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { wedding_id, guests } = body;

    if (!wedding_id || !guests || !Array.isArray(guests)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const storedCookie = cookieStore.get(`admin_auth_${wedding_id}`)?.value;

    if (!storedCookie || !verifyAdminCookie(wedding_id, storedCookie)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const insertPayload = guests.map((g: any) => ({
      wedding_id,
      first_name: g.first_name,
      last_name: g.last_name,
      phone: g.phone || null,
      email: g.email || null,
      meal_preference: g.meal_preference || null,
      allergy_notes: g.allergy_notes || null,
      special_needs: g.special_needs || null,
      plus_ones_allowed: g.plus_ones_allowed || 0,
      children_count: g.children_count || 0,
      notes: g.notes || null,
    }));

    const { data, error } = await supabase
      .from('guests')
      .insert(insertPayload)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Return decorated guests
    const decoratedGuests = data.map(guest => ({
      ...guest,
      tokenUrl: !guest.is_revoked ? generateGuestToken(guest.id, guest.token_version) : null
    }));

    return NextResponse.json({ guests: decoratedGuests });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
