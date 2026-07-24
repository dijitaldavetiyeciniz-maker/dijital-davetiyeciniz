/**
 * Server-Side Rate Limiting & Spam Protection Module
 */

interface RateLimitStore {
  count: number;
  resetTime: number;
}

const memoryStore = new Map<string, RateLimitStore>();

export interface RateLimitConfig {
  windowMs: number; // e.g. 60000 (1 minute)
  max: number;      // e.g. 5 requests per window
}

/**
 * Checks rate limit for a given key (e.g. IP + endpoint)
 */
export function checkRateLimit(key: string, config: RateLimitConfig = { windowMs: 60000, max: 10 }): { success: boolean; limit: number; remaining: number; reset: number } {
  const now = Date.now();
  const record = memoryStore.get(key);

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

  // Honeypot check: bot field 'website' or 'fax' must be EMPTY
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
