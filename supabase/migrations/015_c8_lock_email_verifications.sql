-- ============================================================
-- Migration 015: Lock Email Verifications & Delivery Logs Behind Service Role
-- Reverts Migration 014: Completely revokes anon/authenticated direct table access
-- ============================================================

-- 1. Revoke privileges from anon and authenticated
REVOKE ALL ON public.email_verifications FROM anon, authenticated;
REVOKE ALL ON public.email_delivery_logs FROM anon, authenticated;

-- 2. Drop all public/anon/authenticated policies on email_verifications
DROP POLICY IF EXISTS "Allow anon insert email_verifications" ON public.email_verifications;
DROP POLICY IF EXISTS "Allow anon select pending email_verifications" ON public.email_verifications;
DROP POLICY IF EXISTS "Allow anon update email_verifications" ON public.email_verifications;

-- 3. Drop anon delivery log policies
DROP POLICY IF EXISTS "Allow anon insert delivery logs" ON public.email_delivery_logs;

-- 4. Drop anon profile verification override policy
DROP POLICY IF EXISTS "Allow anon verify profile email" ON public.profiles;

-- 5. Ensure RLS is strictly ENABLED
ALTER TABLE public.email_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_delivery_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

-- 6. Strict service_role only policies
DROP POLICY IF EXISTS "Verifications Service Role" ON public.email_verifications;
CREATE POLICY "Verifications Service Role" ON public.email_verifications
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Delivery Logs Service Role" ON public.email_delivery_logs;
CREATE POLICY "Delivery Logs Service Role" ON public.email_delivery_logs
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Security Events Service Role" ON public.security_events;
CREATE POLICY "Security Events Service Role" ON public.security_events
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- 7. Explicit grant to service_role only
GRANT ALL ON public.email_verifications TO service_role;
GRANT ALL ON public.email_delivery_logs TO service_role;
GRANT ALL ON public.security_events TO service_role;
