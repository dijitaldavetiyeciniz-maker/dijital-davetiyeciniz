import crypto from 'crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'superadmin_session_token';

function getSuperAdminSecret(): string | null {
  const secret = process.env.SUPERADMIN_SESSION_SECRET || process.env.SUPERADMIN_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      return null;
    }
    // In dev / local test only if not provided
    return process.env.NEXT_PUBLIC_SUPERADMIN_SECRET ? null : (process.env.SUPERADMIN_SECRET || null);
  }
  return secret;
}

/**
 * Creates a signed cryptographic token for Super Admin session
 */
export function signSuperAdminToken(): string | null {
  const secret = getSuperAdminSecret();
  if (!secret) {
    console.error('[SuperAdmin Auth] Cannot sign token: SUPERADMIN_SESSION_SECRET is missing. Fail-closed.');
    return null;
  }

  const timestamp = Date.now().toString();
  const nonce = crypto.randomBytes(16).toString('hex');
  const payload = `superadmin:${timestamp}:${nonce}`;
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  const signature = hmac.digest('hex');
  return `${payload}:${signature}`;
}

/**
 * Validates a signed Super Admin token
 */
export function verifySuperAdminToken(token: string | null | undefined): boolean {
  if (!token) return false;
  const secret = getSuperAdminSecret();
  if (!secret) return false;

  try {
    const parts = token.split(':');
    if (parts.length !== 4) return false;
    const [role, timestampStr, nonce, signature] = parts;
    if (role !== 'superadmin' || !nonce || nonce.length < 16) return false;

    const timestamp = parseInt(timestampStr, 10);
    if (isNaN(timestamp)) return false;

    const now = Date.now();
    // Reject future timestamps beyond 60s clock skew
    if (timestamp > now + 60000) return false;

    // Enforce 12-hour session lifetime
    const maxAge = 12 * 60 * 60 * 1000;
    if (now - timestamp > maxAge) return false;

    const payload = `${role}:${timestampStr}:${nonce}`;
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(payload);
    const expectedSig = hmac.digest('hex');

    const sigBuf = Buffer.from(signature, 'hex');
    const expBuf = Buffer.from(expectedSig, 'hex');

    if (sigBuf.length !== expBuf.length) return false;
    return crypto.timingSafeEqual(sigBuf, expBuf);
  } catch {
    return false;
  }
}

/**
 * Server-side helper to check if the current request has valid Super Admin privileges
 */
export async function isSuperAdminAuthorized(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    return verifySuperAdminToken(token);
  } catch {
    return false;
  }
}

/**
 * Sets the Super Admin cookie in the response
 */
export async function setSuperAdminCookie(): Promise<boolean> {
  const token = signSuperAdminToken();
  if (!token) return false;

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 12, // 12 hours
  });
  return true;
}

/**
 * Clears the Super Admin cookie
 */
export async function clearSuperAdminCookie() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
  } catch {
    // Ignore cookie store errors on teardown
  }
}
