import { getSupabaseAdmin } from './supabase-admin';
import { scrubSecrets } from './logger';

export type FunnelEvent =
  | 'landing_view'
  | 'pricing_view'
  | 'signup_started'
  | 'signup_completed'
  | 'email_verified'
  | 'onboarding_started'
  | 'onboarding_completed'
  | 'invitation_created'
  | 'template_selected'
  | 'opening_selected'
  | 'editor_opened'
  | 'preview_opened'
  | 'publish_started'
  | 'invitation_published'
  | 'upgrade_clicked'
  | 'checkout_started'
  | 'payment_success'
  | 'payment_failed';

export interface AnalyticsPayload {
  eventName: FunnelEvent | string;
  userId?: string | null;
  weddingId?: string | null;
  sessionId?: string | null;
  properties?: Record<string, any>;
}

/**
 * Tracks a privacy-safe product analytics / funnel event
 */
export async function trackEvent(payload: AnalyticsPayload): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseAdmin();
    const safeProps = scrubSecrets(payload.properties || {});

    const { error } = await supabase.from('analytics_events').insert([
      {
        event_name: payload.eventName,
        event_type: payload.eventName,
        user_id: payload.userId || null,
        wedding_id: payload.weddingId || null,
        session_id: payload.sessionId || null,
        properties: safeProps,
        created_at: new Date().toISOString()
      }
    ]);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Aggregates funnel metrics for Super Admin dashboard
 */
export async function getFunnelMetrics(): Promise<Record<string, number>> {
  try {
    const supabase = getSupabaseAdmin();
    const { data: events } = await supabase
      .from('analytics_events')
      .select('event_name, event_type');

    const counts: Record<string, number> = {
      landing_view: 0,
      signup_completed: 0,
      email_verified: 0,
      onboarding_completed: 0,
      invitation_published: 0,
      payment_success: 0
    };

    (events || []).forEach(e => {
      const name = e.event_name || e.event_type;
      if (name && counts[name] !== undefined) {
        counts[name]++;
      }
    });

    return counts;
  } catch {
    return {
      landing_view: 0,
      signup_completed: 0,
      email_verified: 0,
      onboarding_completed: 0,
      invitation_published: 0,
      payment_success: 0
    };
  }
}
