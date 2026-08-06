import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient, createServerServiceRoleClient } from '@/server/supabaseClient';

const tableSchema = z.object({
  name: z.string().min(1).optional(),
  capacity: z.number().min(1).optional()
});

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const tableId = params.id;
    const body = await request.json();
    const validatedData = tableSchema.parse(body);

    const serviceRoleClient = createServerServiceRoleClient();
    
    const { data: table, error: fetchError } = await serviceRoleClient
      .from('seating_tables')
      .select('wedding_id')
      .eq('id', tableId)
      .single();

    if (fetchError || !table) {
      return NextResponse.json({ error: 'Masa bulunamadı' }, { status: 404 });
    }

    const weddingId = table.wedding_id;

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

    const { data, error } = await serviceRoleClient
      .from('seating_tables')
      .update({ ...validatedData, updated_at: new Date().toISOString() })
      .eq('id', tableId)
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
    const tableId = params.id;
    const serviceRoleClient = createServerServiceRoleClient();
    
    const { data: table, error: fetchError } = await serviceRoleClient
      .from('seating_tables')
      .select('wedding_id')
      .eq('id', tableId)
      .single();

    if (fetchError || !table) {
      return NextResponse.json({ error: 'Masa bulunamadı' }, { status: 404 });
    }

    const weddingId = table.wedding_id;

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
      .from('seating_tables')
      .delete()
      .eq('id', tableId);

    if (error) throw error;
    return NextResponse.json({ success: true });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
