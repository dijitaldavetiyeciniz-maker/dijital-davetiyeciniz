import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient, createServerServiceRoleClient } from '@/server/supabaseClient';
import { verifyGuestToken } from '@/server/guestTokens';

const checkInSchema = z.object({
  token: z.string().optional(),
  guest_id: z.string().uuid().optional(),
  first_name: z.string().optional(), // For Quick Add
  last_name: z.string().optional()   // For Quick Add
}).refine(data => data.token || data.guest_id, {
  message: "Either token or guest_id must be provided"
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const weddingId = searchParams.get('wedding_id');

    if (!weddingId) {
      return NextResponse.json({ error: 'wedding_id gerekli' }, { status: 400 });
    }

    const supabase = await createAdminClient();
    const { data: { session } } = await supabase.auth.getSession();

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

    const { count, error } = await dbClient
      .from('check_ins')
      .select('id', { count: 'exact', head: true })
      .eq('wedding_id', weddingId);

    if (error) throw error;

    return NextResponse.json({ count: count || 0 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = checkInSchema.parse(body);

    const supabase = await createAdminClient();
    const { data: { session } } = await supabase.auth.getSession();
    const serviceRoleClient = createServerServiceRoleClient();

    let guestLookupId: string | null = null;

    // Determine guest ID
    if (validatedData.token) {
      const payload = verifyGuestToken(validatedData.token);
      if (!payload) {
        return NextResponse.json({ error: 'Geçersiz veya süresi dolmuş token' }, { status: 400 });
      }
      
      // Lookup by public_id - token_version'i de aliyoruz, cunku
      // verifyGuestToken sadece imza/sure gecerliligine bakiyor, DB'deki
      // guncel versiyonla eslesip eslesmedigine bakmiyor. Bu kontrol
      // olmadan, "Yenile" ile degistirilmis (artik gecersiz olmasi
      // gereken) eski bir QR kod hala kapida calisirdi.
      const { data: guestData, error: guestError } = await serviceRoleClient
        .from('guests')
        .select('id, wedding_id, token_version')
        .eq('public_id', payload.publicId)
        .is('deleted_at', null)
        .single();

      if (guestError || !guestData) {
        return NextResponse.json({ error: 'Misafir bulunamadı' }, { status: 404 });
      }

      if (guestData.token_version !== payload.tokenVersion) {
        return NextResponse.json({ error: 'Bu QR kod artık geçerli değil (misafirin linki yenilenmiş). Yeni QR kod gerekiyor.' }, { status: 400 });
      }
      
      guestLookupId = guestData.id;
    } else if (validatedData.guest_id) {
      guestLookupId = validatedData.guest_id;
    }

    if (!guestLookupId) {
      return NextResponse.json({ error: 'Misafir kimliği eksik' }, { status: 400 });
    }

    // 1. Önce misafiri ve düğünü service-role ile bul
    const { data: guest, error: lookupError } = await serviceRoleClient
      .from('guests')
      .select('id, wedding_id, first_name, last_name, plus_ones_allowed, plus_ones_confirmed')
      .eq('id', guestLookupId)
      .is('deleted_at', null)
      .single();

    if (lookupError || !guest) {
      return NextResponse.json({ error: 'Misafir bulunamadı veya silinmiş' }, { status: 404 });
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
      console.warn(JSON.stringify({ event: 'audit', action: 'check_ins_post_unauthorized', guest_id: guest.id }));
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    // 3. İş Kararı C (token_revoked_at KONTROLÜ YAPILMIYOR, deleted_at IS NULL ise içeri alıyoruz)
    // Kayıt oluştur
    // RLS korumalı client
    const dbClient = authMethod === 'session' ? supabase : serviceRoleClient;
    const checkedInBy = authMethod === 'session' ? session?.user?.id : null;

    const { data: insertedCheckIn, error: insertError } = await dbClient
      .from('check_ins')
      .insert({
        wedding_id: weddingId,
        guest_id: guest.id,
        checked_in_by: checkedInBy,
        check_in_time: new Date().toISOString()
      })
      .select('id, check_in_time')
      .single();

    if (insertError) {
      if (insertError.code === '23505') { // Postgres Unique Violation
        return NextResponse.json({ 
          success: true, 
          alreadyCheckedIn: true, 
          guest: guest,
          message: `${guest.first_name} ${guest.last_name} zaten giriş yapmış!`
        });
      }
      
      console.error('Check-in insert error:', insertError);
      return NextResponse.json({ error: 'Check-in işlemi başarısız' }, { status: 500 });
    }

    console.info(JSON.stringify({ event: 'audit', action: 'check_ins_success', user: authUserId, guest_id: guest.id }));

    return NextResponse.json({ 
      success: true, 
      alreadyCheckedIn: false,
      guest: guest,
      checkIn: insertedCheckIn 
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Geçersiz veri', details: (error as any).errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
