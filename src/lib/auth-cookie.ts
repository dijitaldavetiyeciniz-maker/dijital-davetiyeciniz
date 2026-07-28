import crypto from 'crypto';

const SECRET = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'default-secret-key-12345';

export function signAdminCookie(weddingId: string): string {
  const payload = Buffer.from(JSON.stringify({ weddingId, exp: Date.now() + 7 * 24 * 3600 * 1000 })).toString('base64');
  const hmac = crypto.createHmac('sha256', SECRET);
  hmac.update(payload);
  const signature = hmac.digest('hex');
  return `${payload}.${signature}`;
}

export function verifyAdminCookie(weddingId: string, cookieValue: string): boolean {
  try {
    if (!cookieValue) return false;
    const [payload, signature] = cookieValue.split('.');
    if (!payload || !signature) return false;

    const hmac = crypto.createHmac('sha256', SECRET);
    hmac.update(payload);
    const expectedSignature = hmac.digest('hex');

    if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      const data = JSON.parse(Buffer.from(payload, 'base64').toString('utf8'));
      if (data.weddingId === weddingId && data.exp > Date.now()) {
        return true;
      }
    }
  } catch (e) {
    return false;
  }
  return false;
}
