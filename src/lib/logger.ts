import crypto from 'crypto';

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'SECURITY';

export interface StructuredLog {
  level: LogLevel;
  event: string;
  route?: string;
  correlationId?: string;
  userId?: string;
  weddingId?: string;
  status?: number | string;
  durationMs?: number;
  errorCode?: string;
  message?: string;
  meta?: Record<string, any>;
  timestamp: string;
}

const REDACTED_KEYS = [
  'password',
  'admin_password',
  'token',
  'access_token',
  'refresh_token',
  'secret',
  'otp',
  'code_hash',
  'smtp_pass',
  'service_role_key',
  'authorization',
  'card',
  'cvv'
];

/**
 * Deeply scrubs sensitive keys and secrets from objects before logging
 */
export function scrubSecrets(data: any): any {
  if (!data || typeof data !== 'object') return data;

  if (Array.isArray(data)) {
    return data.map(item => scrubSecrets(item));
  }

  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    const lower = key.toLowerCase();
    const isSensitive = REDACTED_KEYS.some(k => lower.includes(k));

    if (isSensitive) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = scrubSecrets(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

export function generateCorrelationId(): string {
  return `req_${crypto.randomUUID().slice(0, 8)}`;
}

class Logger {
  private log(level: LogLevel, event: string, data: Partial<StructuredLog> = {}) {
    const entry: StructuredLog = {
      level,
      event,
      route: data.route,
      correlationId: data.correlationId || generateCorrelationId(),
      userId: data.userId,
      weddingId: data.weddingId,
      status: data.status,
      durationMs: data.durationMs,
      errorCode: data.errorCode,
      message: data.message,
      meta: scrubSecrets(data.meta || {}),
      timestamp: new Date().toISOString(),
    };

    const formatted = `[${entry.timestamp}] [${entry.level}] [${entry.event}] correlationId=${entry.correlationId}${entry.route ? ` route=${entry.route}` : ''}${entry.status ? ` status=${entry.status}` : ''}${entry.message ? ` msg="${entry.message}"` : ''}`;

    if (level === 'ERROR') {
      console.error(formatted, entry.meta);
    } else if (level === 'WARN') {
      console.warn(formatted, entry.meta);
    } else if (level === 'SECURITY') {
      console.warn(`[SECURITY AUDIT] ${formatted}`, entry.meta);
    } else {
      console.log(formatted, entry.meta);
    }

    return entry;
  }

  info(event: string, data?: Partial<StructuredLog>) {
    return this.log('INFO', event, data);
  }

  warn(event: string, data?: Partial<StructuredLog>) {
    return this.log('WARN', event, data);
  }

  error(event: string, data?: Partial<StructuredLog>) {
    return this.log('ERROR', event, data);
  }

  security(event: string, data?: Partial<StructuredLog>) {
    return this.log('SECURITY', event, data);
  }
}

export const logger = new Logger();
