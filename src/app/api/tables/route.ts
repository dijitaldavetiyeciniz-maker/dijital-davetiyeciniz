import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient, createServerServiceRoleClient } from '@/server/supabaseClient';

const tableSchema = z.object({
  wedding_id: z.string().uuid(),
  event_id: z.string().uuid(),
  name: z.string().min(1),
  capacity: z.number().min(1).default(8)
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const weddingId = searchParams.get('wedding_id');
    const eventId = searchParams.get('event_id');
    
    if (!weddingId) {
      return NextResponse.json({ error: 'wedding_id gerekli' }, { status: 400 });
    }

    const supabase = await createAdminClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    let isAuthorized = false;
    if (session?.user) {
      const { data: wedding } = await supabase
        .from('weddings')
        .select('id')
        .eq('id', weddingId)
        .eq('user_id', session.user.id)
        .single();
      if (wedding) isAuthorized = true;
    }

    if (!isAuthorized) {
      const cookieStore = await import('next/headers').then(m => m.cookies());
      const storedCookie = cookieStore.get(`admin_auth_${weddingId}`)?.value;
      const { verifyAdminCookie } = await import('@/lib/auth-cookie');
      if (storedCookie && verifyAdminCookie(weddingId, storedCookie)) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const serviceRoleClient = createServerServiceRoleClient();
    
    let query = serviceRoleClient
      .from('seating_tables')
      .select('*, guest_seat_assignments(*, guests(id, first_name, last_name, rsvp_status))')
      .eq('wedding_id', weddingId)
      .order('created_at', { ascending: true });
      
    if (eventId) {
      query = query.eq('event_id', eventId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return NextResponse.json(data);

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = tableSchema.parse(body);
    const weddingId = validatedData.wedding_id;

    const supabase = await createAdminClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    let isAuthorized = false;
    if (session?.user) {
      const { data: wedding } = await supabase
        .from('weddings')
        .select('id')
        .eq('id', weddingId)
        .eq('user_id', session.user.id)
        .single();
      if (wedding) isAuthorized = true;
    }

    if (!isAuthorized) {
      const cookieStore = await import('next/headers').then(m => m.cookies());
      const storedCookie = cookieStore.get(`admin_auth_${weddingId}`)?.value;
      const { verifyAdminCookie } = await import('@/lib/auth-cookie');
      if (storedCookie && verifyAdminCookie(weddingId, storedCookie)) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const serviceRoleClient = createServerServiceRoleClient();
    const { data, error } = await serviceRoleClient
      .from('seating_tables')
      .insert(validatedData)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);

  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Geçersiz veri', details: err.issues }, { status: 400 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
