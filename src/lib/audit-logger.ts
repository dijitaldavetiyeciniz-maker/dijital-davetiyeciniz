import { supabase } from './supabase';

export interface AuditLogEntry {
  actorType?: 'super_admin' | 'wedding_owner' | 'system';
  actorId?: string;
  actorEmail?: string;
  action: string;
  targetType?: string;
  targetId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  status?: 'success' | 'failed' | 'denied';
}

/**
 * Logs high-level administrative or security events without sensitive secrets
 */
export async function logAuditEvent(entry: AuditLogEntry): Promise<void> {
  try {
    // Sanitize details: strip password, secrets, token keys
    const sanitizedDetails = { ...(entry.details || {}) };
    const sensitiveKeys = ['password', 'secret', 'token', 'apiKey', 'creditCard'];
    for (const key of Object.keys(sanitizedDetails)) {
      if (sensitiveKeys.some(s => key.toLowerCase().includes(s.toLowerCase()))) {
        sanitizedDetails[key] = '[REDACTED]';
      }
    }

    await supabase.from('audit_logs').insert({
      actor_type: entry.actorType || 'super_admin',
      actor_id: entry.actorId || null,
      actor_email: entry.actorEmail || 'superadmin@dijitaldavetiyeciniz.com',
      action: entry.action,
      target_type: entry.targetType || null,
      target_id: entry.targetId || null,
      details: sanitizedDetails,
      ip_address: entry.ipAddress || null,
      user_agent: entry.userAgent || null,
      status: entry.status || 'success'
    });
  } catch {
    // Audit logging failure must not crash the primary flow
  }
}
