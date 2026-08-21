import crypto from 'crypto';
import { cookies } from 'next/headers';

const SUPERADMIN_SECRET = process.env.SUPERADMIN_SECRET || process.env.ADMIN_SECRET || 'super-admin-command-center-secret-2026';
const COOKIE_NAME = 'superadmin_session_token';

/**
 * Creates a signed cryptographic token for Super Admin session
 */
export function signSuperAdminToken(): string {
  const timestamp = Date.now().toString();
  const payload = `superadmin:${timestamp}`;
  const hmac = crypto.createHmac('sha256', SUPERADMIN_SECRET);
  hmac.update(payload);
  const signature = hmac.digest('hex');
  return `${payload}:${signature}`;
}

/**
 * Validates a signed Super Admin token
 */
export function verifySuperAdminToken(token: string | null | undefined): boolean {
  if (!token) return false;
  try {
    const parts = token.split(':');
    if (parts.length !== 3) return false;
    const [role, timestampStr, signature] = parts;
    if (role !== 'superadmin') return false;

    // Check expiration (7 days validity)
    const timestamp = parseInt(timestampStr, 10);
    const maxAge = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - timestamp > maxAge) return false;

    const payload = `${role}:${timestampStr}`;
    const hmac = crypto.createHmac('sha256', SUPERADMIN_SECRET);
    hmac.update(payload);
    const expectedSig = hmac.digest('hex');

    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig));
  } catch (err) {
    return false;
  }
}

/**
 * Server-side helper to check if the current request has valid Super Admin privileges
 */
export async function isSuperAdminAuthorized(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return verifySuperAdminToken(token);
}

/**
 * Sets the Super Admin cookie in the response
 */
export async function setSuperAdminCookie() {
  const cookieStore = await cookies();
  const token = signSuperAdminToken();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  });
}

/**
 * Clears the Super Admin cookie
 */
export async function clearSuperAdminCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
