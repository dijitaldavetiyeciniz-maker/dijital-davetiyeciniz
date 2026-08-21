import { NextResponse } from 'next/server';
import { isSuperAdminAuthorized } from '@/lib/superadmin-auth';
import { supabase } from '@/lib/supabase';
import { sendVerificationEmail, getLocalVerifications } from '@/lib/email-service';

export async function GET(req: Request) {
  const authorized = await isSuperAdminAuthorized();
  if (!authorized) {
    return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const search = (searchParams.get('search') || '').trim().toLowerCase();
    const status = searchParams.get('status') || 'all';

    let verifications: any[] = [];
    try {
      const { data, error } = await supabase
        .from('email_verifications')
        .select('id, user_id, email, status, attempt_count, resend_count, expires_at, verified_at, last_sent_at, created_at')
        .order('created_at', { ascending: false });

      if (!error && data) {
        verifications = data;
      }
    } catch {}

    // Merge with local fallback cache to ensure completeness
    const localCache = getLocalVerifications();
    const localEntries = Object.values(localCache).map((item: any) => ({
      id: item.id || item.email,
      user_id: item.user_id || null,
      email: item.email,
      status: item.status || 'pending',
      attempt_count: item.attempt_count || 0,
      resend_count: item.resend_count || 0,
      expires_at: item.expires_at,
      verified_at: item.verified_at || null,
      last_sent_at: item.last_sent_at || item.created_at,
      created_at: item.created_at
    }));

    const map = new Map<string, any>();
    verifications.forEach((v: any) => {
      const { code, raw_otp, otp, code_hash, ...safeV } = v;
      map.set(safeV.email.toLowerCase(), safeV);
    });
    localEntries.forEach((item: any) => {
      if (!map.has(item.email.toLowerCase())) {
        map.set(item.email.toLowerCase(), item);
      }
    });

    let list = Array.from(map.values());

    if (search) {
      list = list.filter(v => v.email?.toLowerCase().includes(search));
    }

    if (status !== 'all') {
      list = list.filter(v => v.status === status);
    }

    return NextResponse.json({ success: true, verifications: list });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const authorized = await isSuperAdminAuthorized();
  if (!authorized) {
    return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
  }

  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'E-posta adresi gereklidir.' }, { status: 400 });
    }

    const result = await sendVerificationEmail({ email });
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Record audit log
    await supabase.from('super_admin_audit_logs').insert([
      {
        action: 'verification_code_resent_by_admin',
        actor_email: 'Super Admin',
        details: { email }
      }
    ]);

    return NextResponse.json({
      success: true,
      message: `${email} adresine yeni doğrulama kodu başarıyla gönderildi.`
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
