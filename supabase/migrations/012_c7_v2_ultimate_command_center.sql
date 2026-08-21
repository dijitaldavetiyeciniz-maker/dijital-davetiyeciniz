-- ============================================================
-- C7 V2 — SUPER ADMIN ULTIMATE COMMAND CENTER MIGRATION
-- Email Verifications, Security Events, Delivery Logs, Internal Notes, Feature Flags
-- ============================================================

-- 1. Email Verifications Table (Stores ONLY code_hash, NEVER raw OTP)
CREATE TABLE IF NOT EXISTS public.email_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NULL,
    email TEXT NOT NULL,
    code_hash TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- 'pending', 'verified', 'expired', 'too_many_attempts'
    attempt_count INT DEFAULT 0,
    resend_count INT DEFAULT 0,
    expires_at TIMESTAMPTZ NOT NULL,
    verified_at TIMESTAMPTZ NULL,
    last_sent_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_verifications_email ON public.email_verifications(email);
CREATE INDEX IF NOT EXISTS idx_verifications_status ON public.email_verifications(status);
CREATE INDEX IF NOT EXISTS idx_verifications_expires_at ON public.email_verifications(expires_at);

-- 2. Email Delivery Logs (Tracking delivery success/failure without secrets)
CREATE TABLE IF NOT EXISTS public.email_delivery_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient TEXT NOT NULL,
    email_type TEXT NOT NULL, -- 'verification_otp', 'contact_notification', 'system_alert'
    status TEXT NOT NULL DEFAULT 'sent', -- 'sent', 'failed', 'retried'
    provider_message_id TEXT NULL,
    error_message TEXT NULL,
    sent_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_delivery_logs_recipient ON public.email_delivery_logs(recipient);
CREATE INDEX IF NOT EXISTS idx_delivery_logs_status ON public.email_delivery_logs(status);
CREATE INDEX IF NOT EXISTS idx_delivery_logs_sent_at ON public.email_delivery_logs(sent_at);

-- 3. Security Events Table
CREATE TABLE IF NOT EXISTS public.security_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL, -- 'USER_REGISTERED', 'EMAIL_VERIFICATION_SENT', 'EMAIL_VERIFIED', 'LOGIN_SUCCESS', 'LOGIN_FAILED', etc.
    actor_id TEXT NULL,
    actor_email TEXT NULL,
    ip_address TEXT NULL,
    user_agent TEXT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_security_events_type ON public.security_events(event_type);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON public.security_events(created_at);

-- 4. User Internal Notes Table (Staff-only notes on members)
CREATE TABLE IF NOT EXISTS public.user_internal_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    note TEXT NOT NULL,
    author_email TEXT DEFAULT 'Super Admin',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_notes_user_id ON public.user_internal_notes(user_id);

-- 5. Extend platform_settings with operational feature controls
ALTER TABLE public.platform_settings 
ADD COLUMN IF NOT EXISTS allow_signup BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS allow_invitation_creation BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS contact_form_enabled BOOLEAN DEFAULT true;

-- Update defaults
UPDATE public.platform_settings 
SET 
  allow_signup = COALESCE(allow_signup, true),
  allow_invitation_creation = COALESCE(allow_invitation_creation, true),
  contact_form_enabled = COALESCE(contact_form_enabled, true)
WHERE id = 'default';

-- ============================================================
-- RLS Security Policies
-- ============================================================
ALTER TABLE public.email_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_delivery_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_internal_notes ENABLE ROW LEVEL SECURITY;

-- Email Verifications: Only backend service_role can read/write full table
DROP POLICY IF EXISTS "Verifications Service Role" ON public.email_verifications;
CREATE POLICY "Verifications Service Role" ON public.email_verifications
    FOR ALL TO service_role
    USING (true);

-- User Internal Notes: Only service_role
DROP POLICY IF EXISTS "Notes Service Role" ON public.user_internal_notes;
CREATE POLICY "Notes Service Role" ON public.user_internal_notes
    FOR ALL TO service_role
    USING (true);

-- Delivery Logs: Only service_role
DROP POLICY IF EXISTS "Delivery Logs Service Role" ON public.email_delivery_logs;
CREATE POLICY "Delivery Logs Service Role" ON public.email_delivery_logs
    FOR ALL TO service_role
    USING (true);

-- Security Events: Only service_role
DROP POLICY IF EXISTS "Security Events Service Role" ON public.security_events;
CREATE POLICY "Security Events Service Role" ON public.security_events
    FOR ALL TO service_role
    USING (true);

-- Grants
GRANT ALL ON public.email_verifications TO service_role;
GRANT ALL ON public.email_delivery_logs TO service_role;
GRANT ALL ON public.security_events TO service_role;
GRANT ALL ON public.user_internal_notes TO service_role;
