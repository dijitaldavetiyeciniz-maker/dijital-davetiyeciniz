import crypto from 'crypto';

function getAdminCookieSecret(): string {
  const dedicatedSecret = process.env.ADMIN_COOKIE_SECRET_V1 || process.env.ADMIN_COOKIE_SECRET;
  if (dedicatedSecret) {
    return dedicatedSecret;
  }
  const fallback = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (fallback) {
    return fallback;
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error('ADMIN_COOKIE_SECRET_V1 is required for production admin cookie signing');
  }
  return 'dev-admin-cookie-signing-secret-minimum-32-bytes-secure';
}

export function signAdminCookie(weddingId: string): string {
  const secret = getAdminCookieSecret();
  const payload = Buffer.from(JSON.stringify({ weddingId, exp: Date.now() + 7 * 24 * 3600 * 1000 })).toString('base64');
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  const signature = hmac.digest('hex');
  return `${payload}.${signature}`;
}

export function verifyAdminCookie(weddingId: string, cookieValue: string): boolean {
  try {
    if (!cookieValue) return false;
    const [payload, signature] = cookieValue.split('.');
    if (!payload || !signature) return false;

    const secret = getAdminCookieSecret();
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(payload);
    const expectedSignature = hmac.digest('hex');

    const sigBuf = Buffer.from(signature, 'hex');
    const expBuf = Buffer.from(expectedSignature, 'hex');

    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      // Check legacy fallback key if rotation is active
      const legacyFallback = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (legacyFallback && legacyFallback !== secret) {
        const legacyHmac = crypto.createHmac('sha256', legacyFallback);
        legacyHmac.update(payload);
        const legacyExpected = legacyHmac.digest('hex');
        const legacyExpBuf = Buffer.from(legacyExpected, 'hex');
        if (sigBuf.length !== legacyExpBuf.length || !crypto.timingSafeEqual(sigBuf, legacyExpBuf)) {
          return false;
        }
      } else {
        return false;
      }
    }

    const data = JSON.parse(Buffer.from(payload, 'base64').toString('utf8'));
    if (data.weddingId === weddingId && data.exp > Date.now()) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
}
