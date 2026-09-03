import { getSupabaseAdmin } from './supabase-admin';

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

export interface SecurityEventEntry {
  eventType: string;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  actorEmail?: string;
  metadata?: Record<string, any>;
}

/**
 * Logs high-level administrative or security events without sensitive secrets
 */
export async function logAuditEvent(entry: AuditLogEntry): Promise<void> {
  try {
    const supabase = getSupabaseAdmin();
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
    // Audit logging failure must not crash primary flow
  }
}

/**
 * Logs classified security events to security_events table
 */
export async function logSecurityEvent(entry: SecurityEventEntry): Promise<void> {
  try {
    const supabase = getSupabaseAdmin();
    await supabase.from('security_events').insert({
      event_type: entry.eventType,
      actor_email: entry.actorEmail || 'system',
      details: entry.metadata || {},
      created_at: new Date().toISOString()
    });
  } catch {
    // Fail silently to avoid breaking caller
  }
}
