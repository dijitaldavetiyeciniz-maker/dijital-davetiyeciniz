-- =========================================================================
-- Rollback for 018_c13_custom_domains.sql
-- =========================================================================

-- 1. Drop Triggers and Functions
DROP TRIGGER IF EXISTS trg_sync_wedding_custom_domain_mirror ON public.custom_domains;
DROP FUNCTION IF EXISTS sync_wedding_custom_domain_mirror();

DROP TRIGGER IF EXISTS trg_custom_domains_updated_at ON public.custom_domains;
DROP FUNCTION IF EXISTS update_custom_domains_updated_at();

-- 2. Drop RLS Policies
DROP POLICY IF EXISTS "Public can resolve active custom domains" ON public.custom_domains;
DROP POLICY IF EXISTS "Service role has full access to custom_domains" ON public.custom_domains;

-- 3. Drop Table (and its indexes/constraints)
-- Note: weddings.custom_domain legacy column is deliberately preserved for C12 backwards compatibility.
DROP TABLE IF EXISTS public.custom_domains CASCADE;
