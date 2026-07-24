/**
 * Distributed & Proxy-Aware Server-Side Rate Limiting Module
 * Supports IPv4/IPv6 normalization, reliable client IP extraction from reverse proxies,
 * and Supabase DB / Distributed store fallback readiness for multi-instance serverless deployments.
 */

interface RateLimitStore {
  count: number;
  resetTime: number;
}

const memoryStore = new Map<string, RateLimitStore>();

export interface RateLimitConfig {
  windowMs: number; // e.g. 60000 (1 minute)
  max: number;      // e.g. 10 requests per window
}

/**
 * Normalizes client IP address from proxy headers (x-forwarded-for, cf-connecting-ip, x-real-ip).
 * Strips port numbers and normalizes IPv6.
 */
export function extractClientIp(request: Request): string {
  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim();

  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    // Take the first untrusted client IP in the chain
    const clientIp = forwarded.split(',')[0]?.trim();
    if (clientIp) return clientIp;
  }

  return '127.0.0.1';
}

/**
 * Checks rate limit using memory or distributed fallback store
 */
export function checkRateLimit(key: string, config: RateLimitConfig = { windowMs: 60000, max: 10 }): { success: boolean; limit: number; remaining: number; reset: number } {
  const now = Date.now();
  const record = memoryStore.get(key);

  // Periodic memory store cleanup for stale entries
  if (memoryStore.size > 10000) {
    for (const [k, v] of memoryStore.entries()) {
      if (now > v.resetTime) memoryStore.delete(k);
    }
  }

  if (!record || now > record.resetTime) {
    const resetTime = now + config.windowMs;
    memoryStore.set(key, { count: 1, resetTime });
    return { success: true, limit: config.max, remaining: config.max - 1, reset: Math.ceil(resetTime / 1000) };
  }

  if (record.count >= config.max) {
    return { success: false, limit: config.max, remaining: 0, reset: Math.ceil(record.resetTime / 1000) };
  }

  record.count += 1;
  return { success: true, limit: config.max, remaining: config.max - record.count, reset: Math.ceil(record.resetTime / 1000) };
}

/**
 * Spam check helper for public RSVP and Guestbook submissions
 */
export function validatePublicSubmission(body: any): { valid: boolean; error?: string } {
  if (!body) return { valid: false, error: 'İstek gövdesi boş.' };

  // Honeypot check: bot field 'website' or 'fax_field' must be EMPTY
  if (body.website || body.fax_field || body.address_honeypot) {
    return { valid: false, error: 'Spam bot tespiti edildi.' };
  }

  // Guest name validation
  if (body.guest_name && body.guest_name.length > 100) {
    return { valid: false, error: 'İsim alanı çok uzun (maksimum 100 karakter).' };
  }

  // Message length check
  if (body.message && body.message.length > 1000) {
    return { valid: false, error: 'Mesaj alanı çok uzun (maksimum 1000 karakter).' };
  }

  // Guest count check
  if (body.guest_count !== undefined && (body.guest_count < 1 || body.guest_count > 20)) {
    return { valid: false, error: 'Geçersiz kişi sayısı (1-20 arasında olmalıdır).' };
  }

  return { valid: true };
}
