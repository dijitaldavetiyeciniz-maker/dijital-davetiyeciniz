import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient, createServerServiceRoleClient } from '@/server/supabaseClient';

const guestUpdateSchema = z.object({
  first_name: z.string().min(2, 'Ad en az 2 karakter olmalıdır'),
  last_name: z.string().min(2, 'Soyad en az 2 karakter olmalıdır'),
  phone: z.string().optional().nullable(),
  email: z.string().email('Geçerli bir e-posta adresi giriniz').optional().nullable(),
  meal_preference: z.string().optional().nullable(),
  allergy_notes: z.string().optional().nullable(),
  special_needs: z.string().optional().nullable(),
  plus_ones_allowed: z.number().int().min(0).default(0),
  children_count: z.number().int().min(0).default(0),
  rsvp_status: z.enum(['attending', 'not_attending', 'undecided']).optional().nullable(),
  notes: z.string().optional().nullable(),
  group_id: z.string().uuid().optional().nullable()
});

export async function PUT(request: NextRequest, props: { params: Promise<{ guest_id: string }> }) {
  try {
    const { guest_id } = await props.params;
    const body = await request.json();
    const validatedData = guestUpdateSchema.parse(body);

    const supabase = await createAdminClient();
    const { data: { session } } = await supabase.auth.getSession();

    // 1. Önce misafiri bul ve wedding_id'sini al
    const { data: guest, error: guestError } = await supabase
      .from('guests')
      .select('id, wedding_id')
      .eq('id', guest_id)
      .is('deleted_at', null)
      .single();

    if (guestError || !guest) {
      return NextResponse.json({ error: 'Misafir bulunamadı' }, { status: 404 });
    }

    const weddingId = guest.wedding_id;

    // 2. Yetki kontrolü (Session veya Cookie)
    let isAuthorized = false;
    let authUserId = 'anonymous';
    let authMethod = 'session';

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
        authMethod = 'cookie';
      }
    }

    if (!isAuthorized) {
      console.warn(JSON.stringify({ event: 'audit', action: 'guests_put_unauthorized', guest_id }));
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    // 3. Güncelleme işlemi (Cookie auth için RLS'i bypass eden client)
    const dbClient = authMethod === 'session' ? supabase : createServerServiceRoleClient();

    const { data: updatedGuest, error: updateError } = await dbClient
      .from('guests')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString()
      })
      .eq('id', guest_id)
      .select('id, public_id, first_name, last_name, phone, email, meal_preference, allergy_notes, special_needs, plus_ones_allowed, children_count, rsvp_status, created_at, updated_at')
      .single();

    if (updateError) {
      console.error('Update guest error:', updateError);
      throw new Error('Misafir güncellenemedi');
    }

    console.info(JSON.stringify({ event: 'audit', action: 'guests_put_success', user: authUserId, guest_id }));

    return NextResponse.json({ guest: updatedGuest });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Geçersiz veri', details: (error as any).errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ guest_id: string }> }) {
  try {
    const { guest_id } = await props.params;

    const supabase = await createAdminClient();
    const { data: { session } } = await supabase.auth.getSession();

    const { data: guest, error: guestError } = await supabase
      .from('guests')
      .select('id, wedding_id')
      .eq('id', guest_id)
      .is('deleted_at', null)
      .single();

    if (guestError || !guest) {
      return NextResponse.json({ error: 'Misafir bulunamadı' }, { status: 404 });
    }

    const weddingId = guest.wedding_id;

    let isAuthorized = false;
    let authUserId = 'anonymous';
    let authMethod = 'session';

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
        authMethod = 'cookie';
      }
    }

    if (!isAuthorized) {
      console.warn(JSON.stringify({ event: 'audit', action: 'guests_delete_unauthorized', guest_id }));
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    // Soft delete (Cookie auth için RLS'i bypass eden client)
    const dbClient = authMethod === 'session' ? supabase : createServerServiceRoleClient();

    const { error: deleteError } = await dbClient
      .from('guests')
      .update({
        deleted_at: new Date().toISOString()
      })
      .eq('id', guest_id);

    if (deleteError) {
      console.error('Delete guest error:', deleteError);
      throw new Error('Misafir silinemedi');
    }

    console.info(JSON.stringify({ event: 'audit', action: 'guests_delete_success', user: authUserId, guest_id }));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
