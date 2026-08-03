import crypto from 'crypto';

const SECRET_KEY = process.env.GUEST_TOKEN_SECRET || 'default-insecure-secret-for-dev-only-1234567890';

/**
 * Generates a secure HMAC-based token for a guest.
 * @param guestId The UUID of the guest
 * @param tokenVersion The current token_version of the guest in DB
 * @returns A base64url encoded token string
 */
export function generateGuestToken(guestId: string, tokenVersion: number): string {
  const payload = `${guestId}:${tokenVersion}`;
  const hmac = crypto.createHmac('sha256', SECRET_KEY);
  hmac.update(payload);
  const signature = hmac.digest('base64url');
  
  // Return the full token containing payload and signature
  const tokenPayload = Buffer.from(payload).toString('base64url');
  return `${tokenPayload}.${signature}`;
}

/**
 * Parses and verifies a guest token.
 * Note: This only verifies the mathematical integrity of the token.
 * You MUST still check if the guest exists and if the tokenVersion matches the DB!
 * 
 * @param token The token string from the URL
 * @returns Object with guestId and tokenVersion if valid, null if invalid
 */
export function verifyGuestToken(token: string): { guestId: string; tokenVersion: number } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [encodedPayload, signature] = parts;
    const payload = Buffer.from(encodedPayload, 'base64url').toString('utf8');
    
    // Recompute signature
    const hmac = crypto.createHmac('sha256', SECRET_KEY);
    hmac.update(payload);
    const expectedSignature = hmac.digest('base64url');

    // Prevent timing attacks
    if (signature.length !== expectedSignature.length) return null;
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }

    const payloadParts = payload.split(':');
    if (payloadParts.length !== 2) return null;

    return {
      guestId: payloadParts[0],
      tokenVersion: parseInt(payloadParts[1], 10)
    };
  } catch (error) {
    return null;
  }
}
