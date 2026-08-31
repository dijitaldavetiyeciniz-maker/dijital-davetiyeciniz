interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export interface RateLimitOptions {
  intervalMs: number;
  maxRequests: number;
}

/**
 * In-memory sliding window rate limiter for API endpoints
 * @param key Unique key combining category and identifier (e.g. `auth:${ip}`)
 * @param options maxRequests and intervalMs
 * @returns { allowed: boolean, remaining: number, resetInMs: number }
 */
export function checkRateLimit(
  key: string,
  options: RateLimitOptions = { intervalMs: 60000, maxRequests: 30 }
): { allowed: boolean; remaining: number; resetInMs: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  // Periodically cleanup expired entries
  if (rateLimitStore.size > 5000) {
    for (const [k, v] of rateLimitStore.entries()) {
      if (now > v.resetTime) {
        rateLimitStore.delete(k);
      }
    }
  }

  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + options.intervalMs
    });
    return {
      allowed: true,
      remaining: options.maxRequests - 1,
      resetInMs: options.intervalMs
    };
  }

  if (entry.count >= options.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetInMs: Math.max(0, entry.resetTime - now)
    };
  }

  entry.count += 1;
  return {
    allowed: true,
    remaining: options.maxRequests - entry.count,
    resetInMs: Math.max(0, entry.resetTime - now)
  };
}

export function clearRateLimitStore(): void {
  rateLimitStore.clear();
}
