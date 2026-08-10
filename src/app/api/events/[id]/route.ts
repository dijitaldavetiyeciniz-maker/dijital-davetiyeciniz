import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient, createServerServiceRoleClient } from '@/server/supabaseClient';

const eventSchema = z.object({
  type: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  start_time: z.string().datetime().optional(),
  end_time: z.string().datetime().optional().nullable(),
  timezone: z.string().optional(),
  venue_name: z.string().optional().nullable(),
  venue_address: z.string().optional().nullable(),
  google_maps_url: z.string().url().optional().nullable(),
  description: z.string().optional().nullable(),
  is_primary: z.boolean().optional()
});

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const eventId = params.id;
    const body = await request.json();
    const validatedData = eventSchema.parse(body);

    const serviceRoleClient = createServerServiceRoleClient();
    
    // 1. Get the event to find its wedding_id
    const { data: event, error: fetchError } = await serviceRoleClient
      .from('invitation_events')
      .select('wedding_id')
      .eq('id', eventId)
      .single();

    if (fetchError || !event) {
      return NextResponse.json({ error: 'Etkinlik bulunamadı' }, { status: 404 });
    }

    const weddingId = event.wedding_id;

    // 2. Auth Check
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

    // 3. Update
    const { data, error } = await serviceRoleClient
      .from('invitation_events')
      .update({ ...validatedData, updated_at: new Date().toISOString() })
      .eq('id', eventId)
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

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const eventId = params.id;
    const serviceRoleClient = createServerServiceRoleClient();
    
    const { data: event, error: fetchError } = await serviceRoleClient
      .from('invitation_events')
      .select('wedding_id')
      .eq('id', eventId)
      .single();

    if (fetchError || !event) {
      return NextResponse.json({ error: 'Etkinlik bulunamadı' }, { status: 404 });
    }

    const weddingId = event.wedding_id;

    // Auth Check
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

    const { error } = await serviceRoleClient
      .from('invitation_events')
      .delete()
      .eq('id', eventId);

    if (error) throw error;
    return NextResponse.json({ success: true });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
