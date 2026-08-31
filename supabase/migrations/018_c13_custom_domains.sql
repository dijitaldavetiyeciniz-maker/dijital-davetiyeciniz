-- =========================================================================
-- C13 — Multi-Tenant Custom Domains Architecture Migration
-- =========================================================================

-- 1. Create custom_domains table as Authoritative Source of Truth
CREATE TABLE IF NOT EXISTS public.custom_domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    hostname TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verifying', 'active', 'error', 'removing')),
    verification_token TEXT DEFAULT NULL,
    verified_at TIMESTAMPTZ DEFAULT NULL,
    verification_error TEXT DEFAULT NULL,
    ssl_status TEXT NOT NULL DEFAULT 'pending' CHECK (ssl_status IN ('pending', 'active', 'error')),
    provider TEXT NOT NULL DEFAULT 'vercel',
    provider_domain_id TEXT DEFAULT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT check_custom_domains_hostname_canonical CHECK (
        hostname = LOWER(RTRIM(TRIM(hostname), '.')) AND length(hostname) > 0
    )
);

-- Unique constraint: A domain can only be bound to one wedding across the entire system
CREATE UNIQUE INDEX IF NOT EXISTS idx_custom_domains_hostname_unique 
ON public.custom_domains(hostname);

-- Partial unique constraint: At most one primary domain per wedding
CREATE UNIQUE INDEX IF NOT EXISTS idx_custom_domains_primary_per_wedding 
ON public.custom_domains(wedding_id) 
WHERE (is_primary = true);

-- Foreign key lookup index
CREATE INDEX IF NOT EXISTS idx_custom_domains_wedding_id 
ON public.custom_domains(wedding_id);

-- Host resolution routing index for W5 proxy fast lookup
CREATE INDEX IF NOT EXISTS idx_custom_domains_active_lookup 
ON public.custom_domains(hostname, status);

-- 2. Automatic updated_at trigger
CREATE OR REPLACE FUNCTION update_custom_domains_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_custom_domains_updated_at ON public.custom_domains;
CREATE TRIGGER trg_custom_domains_updated_at
BEFORE UPDATE ON public.custom_domains
FOR EACH ROW EXECUTE FUNCTION update_custom_domains_updated_at();

-- 3. One-Time Safe Legacy Backfill from weddings.custom_domain
DO $$
DECLARE
    duplicate_count INTEGER;
    duplicate_domain TEXT;
BEGIN
    -- Check for duplicate legacy domain assignments before backfilling
    SELECT LOWER(RTRIM(TRIM(custom_domain), '.')), COUNT(*)
    INTO duplicate_domain, duplicate_count
    FROM public.weddings
    WHERE custom_domain IS NOT NULL AND TRIM(custom_domain) <> ''
    GROUP BY LOWER(RTRIM(TRIM(custom_domain), '.'))
    HAVING COUNT(*) > 1
    LIMIT 1;

    IF duplicate_count > 1 THEN
        RAISE EXCEPTION 'Legacy custom_domain duplicate detected for hostname: "%". Resolve duplicate domains before applying migration.', duplicate_domain;
    END IF;
END $$;

INSERT INTO public.custom_domains (
    wedding_id,
    hostname,
    status,
    ssl_status,
    provider,
    is_primary
)
SELECT
    w.id,
    LOWER(RTRIM(TRIM(w.custom_domain), '.')),
    'pending',
    'pending',
    'vercel',
    true
FROM public.weddings w
WHERE w.custom_domain IS NOT NULL
  AND TRIM(w.custom_domain) <> ''
ON CONFLICT (hostname) DO NOTHING;

-- 4. Unidirectional Compatibility Mirror Trigger (custom_domains -> weddings.custom_domain)
-- Reflects active primary domain on legacy weddings.custom_domain column
CREATE OR REPLACE FUNCTION sync_wedding_custom_domain_mirror()
RETURNS TRIGGER AS $$
DECLARE
    target_wedding_id UUID;
    canonical_domain TEXT;
BEGIN
    IF (TG_OP = 'DELETE') THEN
        target_wedding_id := OLD.wedding_id;
    ELSE
        target_wedding_id := NEW.wedding_id;
    END IF;

    -- Resolve the active primary domain for this wedding
    SELECT hostname INTO canonical_domain
    FROM public.custom_domains
    WHERE wedding_id = target_wedding_id
      AND is_primary = true
      AND status = 'active'
    LIMIT 1;

    -- Update compatibility mirror on weddings table
    UPDATE public.weddings
    SET custom_domain = canonical_domain
    WHERE id = target_wedding_id
      AND (custom_domain IS DISTINCT FROM canonical_domain);

    IF (TG_OP = 'DELETE') THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_sync_wedding_custom_domain_mirror ON public.custom_domains;
CREATE TRIGGER trg_sync_wedding_custom_domain_mirror
AFTER INSERT OR UPDATE OR DELETE ON public.custom_domains
FOR EACH ROW EXECUTE FUNCTION sync_wedding_custom_domain_mirror();

-- 5. Row Level Security Policies
ALTER TABLE public.custom_domains ENABLE ROW LEVEL SECURITY;

-- Public can only resolve active domains for routing
DROP POLICY IF EXISTS "Public can resolve active custom domains" ON public.custom_domains;
CREATE POLICY "Public can resolve active custom domains"
ON public.custom_domains
FOR SELECT
USING (status = 'active');

-- Service role has full administrative access
DROP POLICY IF EXISTS "Service role has full access to custom_domains" ON public.custom_domains;
CREATE POLICY "Service role has full access to custom_domains"
ON public.custom_domains
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
