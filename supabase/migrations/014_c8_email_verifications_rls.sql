-- ============================================================
-- Migration 014: Email Verification Serverless RLS Hardening
-- Allows serverless API routes to insert, query, and verify OTP tokens
-- ============================================================

ALTER TABLE public.email_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_delivery_logs ENABLE ROW LEVEL SECURITY;

-- 1. Email Verifications policies for API / Serverless operations
DROP POLICY IF EXISTS "Allow anon insert email_verifications" ON public.email_verifications;
CREATE POLICY "Allow anon insert email_verifications" ON public.email_verifications
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon select pending email_verifications" ON public.email_verifications;
CREATE POLICY "Allow anon select pending email_verifications" ON public.email_verifications
    FOR SELECT TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Allow anon update email_verifications" ON public.email_verifications;
CREATE POLICY "Allow anon update email_verifications" ON public.email_verifications
    FOR UPDATE TO anon, authenticated
    USING (true);

-- 2. Delivery logs insertion
DROP POLICY IF EXISTS "Allow anon insert delivery logs" ON public.email_delivery_logs;
CREATE POLICY "Allow anon insert delivery logs" ON public.email_delivery_logs
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

-- 3. Profiles email verification update
DROP POLICY IF EXISTS "Allow anon verify profile email" ON public.profiles;
CREATE POLICY "Allow anon verify profile email" ON public.profiles
    FOR UPDATE TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Grants
GRANT ALL ON public.email_verifications TO anon, authenticated, service_role;
GRANT ALL ON public.email_delivery_logs TO anon, authenticated, service_role;
