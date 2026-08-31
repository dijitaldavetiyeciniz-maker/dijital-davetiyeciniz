import { getSupabaseAdmin } from './supabase-admin';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const memoryRateLimitStore = new Map<string, RateLimitEntry>();

export interface RateLimitOptions {
  intervalMs: number;
  maxRequests: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetInMs: number;
  store: 'distributed_postgres' | 'local_memory';
}

/**
 * Atomic Distributed Rate Limiter
 * Uses PostgreSQL stored procedure / atomic upsert in production to prevent race conditions
 * across multi-instance serverless functions.
 */
export async function checkDistributedRateLimit(
  key: string,
  options: RateLimitOptions = { intervalMs: 60000, maxRequests: 30 }
): Promise<RateLimitResult> {
  const windowSeconds = Math.ceil(options.intervalMs / 1000);

  try {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase.rpc('check_distributed_rate_limit', {
        p_key: key,
        p_max_requests: options.maxRequests,
        p_window_seconds: windowSeconds
      });

      if (!error && data) {
        return {
          allowed: Boolean(data.allowed),
          remaining: Number(data.remaining ?? 0),
          resetInMs: Number(data.reset_in_seconds ?? 0) * 1000,
          store: 'distributed_postgres'
        };
      }
    }
  } catch {
    // Fall back to local memory store if database is initializing or during isolated tests
  }

  // Local sliding window fallback
  const localRes = checkRateLimit(key, options);
  return {
    ...localRes,
    store: 'local_memory'
  };
}

/**
 * Synchronous local sliding window rate limiter for dev, tests, and non-blocking sync checks
 */
export function checkRateLimit(
  key: string,
  options: RateLimitOptions = { intervalMs: 60000, maxRequests: 30 }
): { allowed: boolean; remaining: number; resetInMs: number; store: 'local_memory' } {
  const now = Date.now();
  const entry = memoryRateLimitStore.get(key);

  // Periodically cleanup expired entries
  if (memoryRateLimitStore.size > 5000) {
    for (const [k, v] of memoryRateLimitStore.entries()) {
      if (now > v.resetTime) {
        memoryRateLimitStore.delete(k);
      }
    }
  }

  if (!entry || now > entry.resetTime) {
    memoryRateLimitStore.set(key, {
      count: 1,
      resetTime: now + options.intervalMs
    });
    return {
      allowed: true,
      remaining: options.maxRequests - 1,
      resetInMs: options.intervalMs,
      store: 'local_memory'
    };
  }

  if (entry.count >= options.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetInMs: Math.max(0, entry.resetTime - now),
      store: 'local_memory'
    };
  }

  entry.count += 1;
  return {
    allowed: true,
    remaining: options.maxRequests - entry.count,
    resetInMs: Math.max(0, entry.resetTime - now),
    store: 'local_memory'
  };
}

export function clearRateLimitStore(): void {
  memoryRateLimitStore.clear();
}
