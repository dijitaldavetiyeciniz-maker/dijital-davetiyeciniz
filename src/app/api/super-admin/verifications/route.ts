import { NextResponse } from 'next/server';
import { isSuperAdminAuthorized } from '@/lib/superadmin-auth';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { sendVerificationEmail, normalizeEmail } from '@/lib/email-service';

export async function GET(req: Request) {
  const authorized = await isSuperAdminAuthorized();
  if (!authorized) {
    return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const search = normalizeEmail(searchParams.get('search') || '');
    const status = searchParams.get('status') || 'all';
    const supabase = getSupabaseAdmin();

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

    const map = new Map<string, any>();
    verifications.forEach((v: any) => {
      const { code, raw_otp, otp, code_hash, ...safeV } = v;
      map.set(normalizeEmail(safeV.email), safeV);
    });

    let list = Array.from(map.values());

    if (search) {
      list = list.filter(v => normalizeEmail(v.email).includes(search));
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

    const supabase = getSupabaseAdmin();
    // Record audit log
    try {
      await supabase.from('super_admin_audit_logs').insert([
        {
          action: 'verification_code_resent_by_admin',
          actor_email: 'Super Admin',
          details: { email: normalizeEmail(email) }
        }
      ]);
    } catch {}

    return NextResponse.json({
      success: true,
      message: `${email} adresine yeni doğrulama kodu başarıyla gönderildi.`
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
