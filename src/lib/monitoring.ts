/**
 * Monitoring and Error Tracking Module
 * Scrubs sensitive tokens, passwords, and user details before logging or sending error reports.
 */

export interface ErrorReportOptions {
  context?: string;
  userId?: string;
  weddingId?: string;
  meta?: Record<string, any>;
}

export function scrubSecrets(data: any): any {
  if (!data || typeof data !== 'object') return data;
  
  const clean = Array.isArray(data) ? [...data] : { ...data };

  for (const key of Object.keys(clean)) {
    const lowerKey = key.toLowerCase();
    if (
      lowerKey.includes('token') ||
      lowerKey.includes('password') ||
      lowerKey.includes('secret') ||
      lowerKey.includes('key') ||
      lowerKey.includes('email')
    ) {
      clean[key] = '[REDACTED]';
    } else if (typeof clean[key] === 'object') {
      clean[key] = scrubSecrets(clean[key]);
    }
  }

  return clean;
}

export function captureException(error: Error | any, options: ErrorReportOptions = {}) {
  const safeMeta = scrubSecrets(options.meta || {});
  
  // Format clean log
  console.error(`[MONITORING ERROR] ${options.context || 'General'}:`, {
    message: error?.message || String(error),
    stack: error?.stack,
    userId: options.userId,
    weddingId: options.weddingId,
    meta: safeMeta,
    timestamp: new Date().toISOString(),
  });
}
