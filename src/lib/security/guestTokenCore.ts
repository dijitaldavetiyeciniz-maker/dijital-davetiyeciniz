import crypto from 'crypto';

export type GuestTokenPayload = {
  publicId: string;
  tokenVersion: number;
  expiresAt?: number;
  keyVersion: number;
};

export function generateGuestTokenCore(
  publicId: string, 
  tokenVersion: number, 
  secretKey: string,
  keyVersion: number,
  expiresAt?: number
): string {
  if (!secretKey) throw new Error('Secret key is required for token generation');
  
  const payload: GuestTokenPayload = {
    publicId,
    tokenVersion,
    keyVersion,
  };
  if (expiresAt) payload.expiresAt = expiresAt;

  const payloadStr = JSON.stringify(payload);
  const base64Payload = Buffer.from(payloadStr).toString('base64url');
  
  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(payloadStr);
  const signature = hmac.digest('base64url');
  
  return `${base64Payload}.${signature}`;
}

export function verifyGuestTokenCore(token: string, secretKey: string): GuestTokenPayload | null {
  if (!secretKey) throw new Error('Secret key is required for token verification');
  try {
    // Length check for basic sanity to avoid excessive string ops
    if (token.length > 512) return null;
    
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [encodedPayload, signature] = parts;
    const payloadStr = Buffer.from(encodedPayload, 'base64url').toString('utf8');
    
    const hmac = crypto.createHmac('sha256', secretKey);
    hmac.update(payloadStr);
    const expectedSignature = hmac.digest('base64url');

    if (signature.length !== expectedSignature.length) return null;
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }

    const payload = JSON.parse(payloadStr) as GuestTokenPayload;

    if (!payload.publicId || typeof payload.tokenVersion !== 'number' || typeof payload.keyVersion !== 'number') return null;
    if (payload.expiresAt && payload.expiresAt < Date.now()) return null;

    return payload;
  } catch (error) {
    return null;
  }
}
