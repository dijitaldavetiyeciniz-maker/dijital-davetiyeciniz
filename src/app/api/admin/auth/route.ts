import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { signAdminCookie } from '@/lib/auth-cookie';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { checkDistributedRateLimit } from '@/lib/rate-limiter';
import { verifyPassword, hashPassword } from '@/lib/password-utils';
import { logSecurityEvent } from '@/lib/audit-logger';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    const body = await req.json().catch(() => ({}));
    const { wedding_id, password } = body;

    if (!wedding_id || typeof wedding_id !== 'string' || !password || typeof password !== 'string') {
      return NextResponse.json({ success: false, error: 'Geçersiz parametreler.' }, { status: 400 });
    }

    // Rate Limiting: 10 attempts per 5 minutes per IP + wedding identifier
    const isTestMode = process.env.PART5_TEST_MODE === 'true' || process.env.NODE_ENV === 'test';
    if (!isTestMode) {
      const rateLimitKey = `admin_auth:${ip}:${wedding_id.toLowerCase()}`;
      const rateLimit = await checkDistributedRateLimit(rateLimitKey, {
        intervalMs: 5 * 60 * 1000,
        maxRequests: 10,
      });

      if (!rateLimit.allowed) {
        await logSecurityEvent({
          eventType: 'ADMIN_LOGIN_RATE_LIMITED',
          severity: 'HIGH',
          metadata: { ip, wedding_id }
        });
        return NextResponse.json(
          { success: false, error: 'Çok fazla giriş denemesi yapıldı. Lütfen daha sonra tekrar deneyiniz.' },
          { status: 429, headers: { 'Retry-After': String(Math.ceil(rateLimit.resetInMs / 1000)) } }
        );
      }
    }

    const supabaseAdmin = getSupabaseAdmin();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(wedding_id);
    let query = supabaseAdmin.from('weddings').select('id, slug, admin_password');
    if (isUuid) {
      query = query.eq('id', wedding_id);
    } else {
      query = query.eq('slug', wedding_id);
    }
    const { data, error } = await query.maybeSingle();

    if (error || !data) {
      // Generic failure response to prevent user/wedding enumeration
      return NextResponse.json({ success: false, error: 'Giriş bilgileri hatalı veya davetiye bulunamadı.' }, { status: 401 });
    }

    const { valid, needsRehash } = verifyPassword(password, data.admin_password);

    if (!valid) {
      await logSecurityEvent({
        eventType: 'ADMIN_LOGIN_FAILED',
        severity: 'MEDIUM',
        metadata: { ip, wedding_id: data.id }
      });
      return NextResponse.json({ success: false, error: 'Giriş bilgileri hatalı veya davetiye bulunamadı.' }, { status: 401 });
    }

    // If legacy plaintext password was verified, auto-upgrade in background to strong scrypt hash
    if (needsRehash) {
      try {
        const hashedPassword = hashPassword(password);
        await supabaseAdmin
          .from('weddings')
          .update({ admin_password: hashedPassword })
          .eq('id', data.id)
          .eq('admin_password', data.admin_password);
      } catch (err) {
        console.error('[Admin Auth] Failed to auto-rehash legacy password:', err);
      }
    }

    const cookieStore = await cookies();
    const signedValue = signAdminCookie(data.id);
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax' as const,
      maxAge: 60 * 60 * 24 * 7,
    };

    cookieStore.set(`admin_auth_${data.id}`, signedValue, cookieOptions);
    if (data.slug) {
      cookieStore.set(`admin_auth_${data.slug}`, signedValue, cookieOptions);
    }

    await logSecurityEvent({
      eventType: 'ADMIN_LOGIN_SUCCESS',
      severity: 'LOW',
      metadata: { ip, wedding_id: data.id }
    });

    return NextResponse.json({ success: true, wedding_id: data.id });
  } catch {
    return NextResponse.json({ success: false, error: 'Giriş işlemi sırasında hata oluştu.' }, { status: 500 });
  }
}
