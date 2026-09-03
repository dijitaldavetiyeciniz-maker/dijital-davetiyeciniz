import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { setSuperAdminCookie, isSuperAdminAuthorized, clearSuperAdminCookie } from '@/lib/superadmin-auth';
import { checkDistributedRateLimit } from '@/lib/rate-limiter';
import { logSecurityEvent } from '@/lib/audit-logger';

function getSuperAdminPassword(): string | null {
  const pwd = process.env.SUPERADMIN_PASSWORD;
  if (!pwd) {
    if (process.env.NODE_ENV === 'production') {
      return null;
    }
    // Only in non-production development environments if explicitly set
    return process.env.DEV_SUPERADMIN_PASSWORD || null;
  }
  return pwd;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    
    // 1. Distributed Rate Limiting: 5 attempts per 5 minutes per IP
    const isTestMode = process.env.PART5_TEST_MODE === 'true' || process.env.NODE_ENV === 'test';
    if (!isTestMode) {
      const rateLimit = await checkDistributedRateLimit(`superadmin_login:${ip}`, {
        intervalMs: 5 * 60 * 1000,
        maxRequests: 5
      });

      if (!rateLimit.allowed) {
        await logSecurityEvent({
          eventType: 'SUPERADMIN_LOGIN_RATE_LIMITED',
          severity: 'HIGH',
          metadata: { ip }
        });
        return NextResponse.json(
          { success: false, error: 'Çok fazla deneme yapıldı. Lütfen daha sonra tekrar deneyiniz.' },
          { status: 429, headers: { 'Retry-After': String(Math.ceil(rateLimit.resetInMs / 1000)) } }
        );
      }
    }

    const body = await req.json().catch(() => ({}));
    const { password } = body;

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ success: false, error: 'Geçerli bir şifre girilmelidir.' }, { status: 400 });
    }

    const expectedPassword = getSuperAdminPassword();
    if (!expectedPassword) {
      console.error('[SuperAdmin Auth] SUPERADMIN_PASSWORD environment variable is not configured. Failing closed.');
      return NextResponse.json(
        { success: false, error: 'Sistem yapılandırma hatası. Super Admin girişi devre dışı.' },
        { status: 500 }
      );
    }

    // Timing-safe password comparison
    const providedBuf = Buffer.from(password, 'utf8');
    const expectedBuf = Buffer.from(expectedPassword, 'utf8');
    const isMatch = providedBuf.length === expectedBuf.length && crypto.timingSafeEqual(providedBuf, expectedBuf);

    if (!isMatch) {
      await logSecurityEvent({
        eventType: 'SUPERADMIN_LOGIN_FAILED',
        severity: 'MEDIUM',
        metadata: { ip }
      });
      return NextResponse.json({ success: false, error: 'Hatalı şifre.' }, { status: 401 });
    }

    const cookieSuccess = await setSuperAdminCookie();
    if (!cookieSuccess) {
      return NextResponse.json(
        { success: false, error: 'Oturum anahtarı oluşturulamadı. Sistem yöneticisi ile görüşünüz.' },
        { status: 500 }
      );
    }

    await logSecurityEvent({
      eventType: 'SUPERADMIN_LOGIN_SUCCESS',
      severity: 'LOW',
      metadata: { ip }
    });

    return NextResponse.json({ success: true, message: 'Super Admin oturumu başarıyla açıldı.' });
  } catch {
    return NextResponse.json({ success: false, error: 'Giriş işlemi sırasında hata oluştu.' }, { status: 500 });
  }
}

export async function GET() {
  const authorized = await isSuperAdminAuthorized();
  return NextResponse.json({ authenticated: authorized });
}

export async function DELETE() {
  await clearSuperAdminCookie();
  return NextResponse.json({ success: true, message: 'Oturum kapatıldı.' });
}
