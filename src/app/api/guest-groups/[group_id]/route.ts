import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient, createServerServiceRoleClient } from '@/server/supabaseClient';

const updateGroupSchema = z.object({
  name: z.string().min(1, 'Grup adı boş olamaz').max(100)
});

export async function PUT(request: NextRequest, props: { params: Promise<{ group_id: string }> }) {
  try {
    const { group_id } = await props.params;
    const body = await request.json();
    const { name } = updateGroupSchema.parse(body);

    const supabase = await createAdminClient();
    const { data: { session } } = await supabase.auth.getSession();

    // Önce grubu bul ve wedding_id'sini al
    const { data: group, error: groupError } = await supabase
      .from('guest_groups')
      .select('id, wedding_id')
      .eq('id', group_id)
      .single();

    if (groupError || !group) {
      return NextResponse.json({ error: 'Grup bulunamadı' }, { status: 404 });
    }

    const weddingId = group.wedding_id;

    // Yetki kontrolü (Session veya Cookie)
    let isAuthorized = false;
    let authMethod = 'session';

    if (session?.user) {
      const { data: wedding } = await supabase
        .from('weddings')
        .select('id, user_id')
        .eq('id', weddingId)
        .eq('user_id', session.user.id)
        .single();
      
      if (wedding) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      const cookieStore = await import('next/headers').then(m => m.cookies());
      const storedCookie = cookieStore.get(`admin_auth_${weddingId}`)?.value;
      const { verifyAdminCookie } = await import('@/lib/auth-cookie');
      
      if (storedCookie && verifyAdminCookie(weddingId, storedCookie)) {
        isAuthorized = true;
        authMethod = 'cookie';
      }
    }

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const dbClient = authMethod === 'session' ? supabase : createServerServiceRoleClient();

    const { data: updatedGroup, error: updateError } = await dbClient
      .from('guest_groups')
      .update({ name, updated_at: new Date().toISOString() })
      .eq('id', group_id)
      .select('id, wedding_id, name, created_at, updated_at')
      .single();

    if (updateError) throw updateError;

    return NextResponse.json({ group: updatedGroup });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Geçersiz veri', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ group_id: string }> }) {
  try {
    const { group_id } = await props.params;

    const supabase = await createAdminClient();
    const { data: { session } } = await supabase.auth.getSession();

    const { data: group, error: groupError } = await supabase
      .from('guest_groups')
      .select('id, wedding_id')
      .eq('id', group_id)
      .single();

    if (groupError || !group) {
      return NextResponse.json({ error: 'Grup bulunamadı' }, { status: 404 });
    }

    const weddingId = group.wedding_id;

    let isAuthorized = false;
    let authMethod = 'session';

    if (session?.user) {
      const { data: wedding } = await supabase
        .from('weddings')
        .select('id, user_id')
        .eq('id', weddingId)
        .eq('user_id', session.user.id)
        .single();
      
      if (wedding) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      const cookieStore = await import('next/headers').then(m => m.cookies());
      const storedCookie = cookieStore.get(`admin_auth_${weddingId}`)?.value;
      const { verifyAdminCookie } = await import('@/lib/auth-cookie');
      
      if (storedCookie && verifyAdminCookie(weddingId, storedCookie)) {
        isAuthorized = true;
        authMethod = 'cookie';
      }
    }

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const dbClient = authMethod === 'session' ? supabase : createServerServiceRoleClient();

    const { error: deleteError } = await dbClient
      .from('guest_groups')
      .delete()
      .eq('id', group_id);

    if (deleteError) throw deleteError;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
