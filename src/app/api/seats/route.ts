import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient, createServerServiceRoleClient } from '@/server/supabaseClient';

const assignSchema = z.object({
  wedding_id: z.string().uuid(),
  event_id: z.string().uuid(),
  table_id: z.string().uuid(),
  guest_id: z.string().uuid(),
  seat_count: z.number().min(1).default(1)
});

const unassignSchema = z.object({
  assignment_id: z.string().uuid()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = assignSchema.parse(body);
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
    
    // Call the RPC for atomic check
    const { data, error } = await serviceRoleClient.rpc('assign_guest_to_table', {
      p_wedding_id: validatedData.wedding_id,
      p_event_id: validatedData.event_id,
      p_table_id: validatedData.table_id,
      p_guest_id: validatedData.guest_id,
      p_seat_count: validatedData.seat_count
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);

  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Geçersiz veri', details: err.issues }, { status: 400 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = unassignSchema.parse(body);

    const serviceRoleClient = createServerServiceRoleClient();
    
    const { data: assignment, error: fetchError } = await serviceRoleClient
      .from('guest_seat_assignments')
      .select('wedding_id')
      .eq('id', validatedData.assignment_id)
      .single();

    if (fetchError || !assignment) {
      return NextResponse.json({ error: 'Atama bulunamadı' }, { status: 404 });
    }

    const weddingId = assignment.wedding_id;

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
      .from('guest_seat_assignments')
      .delete()
      .eq('id', validatedData.assignment_id);

    if (error) throw error;
    return NextResponse.json({ success: true });

  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Geçersiz veri', details: err.issues }, { status: 400 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
