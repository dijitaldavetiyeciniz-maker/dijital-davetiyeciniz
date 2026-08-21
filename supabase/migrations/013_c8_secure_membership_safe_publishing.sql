-- ============================================================
-- C8 — SECURE MEMBERSHIP & SAFE PUBLISHING FOUNDATION
-- Draft/Publish Separation, Version History, Autosave, Onboarding State
-- ============================================================

-- 1. Extend weddings table with C8 Draft/Publish and Versioning columns
DO $$ 
BEGIN 
    -- Is Published flag (separates draft from live public state)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='weddings' AND column_name='is_published') THEN
        ALTER TABLE public.weddings ADD COLUMN is_published BOOLEAN DEFAULT false;
    END IF;

    -- Published Snapshot (immutable copy of live public version)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='weddings' AND column_name='published_snapshot') THEN
        ALTER TABLE public.weddings ADD COLUMN published_snapshot JSONB DEFAULT NULL;
    END IF;

    -- Draft Data (working copy during editing before publishing)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='weddings' AND column_name='draft_data') THEN
        ALTER TABLE public.weddings ADD COLUMN draft_data JSONB DEFAULT NULL;
    END IF;

    -- Draft Revision counter (for optimistic concurrency protection)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='weddings' AND column_name='draft_revision') THEN
        ALTER TABLE public.weddings ADD COLUMN draft_revision INT DEFAULT 1;
    END IF;

    -- Published Version Number
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='weddings' AND column_name='published_version_number') THEN
        ALTER TABLE public.weddings ADD COLUMN published_version_number INT DEFAULT 0;
    END IF;

    -- Has Unpublished Changes indicator
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='weddings' AND column_name='has_unpublished_changes') THEN
        ALTER TABLE public.weddings ADD COLUMN has_unpublished_changes BOOLEAN DEFAULT false;
    END IF;

    -- Onboarding state tracking
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='onboarding_completed') THEN
        ALTER TABLE public.profiles ADD COLUMN onboarding_completed BOOLEAN DEFAULT false;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='onboarding_step') THEN
        ALTER TABLE public.profiles ADD COLUMN onboarding_step INT DEFAULT 1;
    END IF;
END $$;

-- 2. Create invitation_versions table for Immutable Version History
CREATE TABLE IF NOT EXISTS public.invitation_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    version_type TEXT NOT NULL DEFAULT 'published', -- 'initial_draft', 'published', 'manual_snapshot', 'restored'
    is_published BOOLEAN DEFAULT false,
    summary TEXT NULL,
    snapshot JSONB NOT NULL,
    created_by UUID NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_invitation_versions_wedding_id ON public.invitation_versions(wedding_id);
CREATE INDEX IF NOT EXISTS idx_invitation_versions_version_number ON public.invitation_versions(wedding_id, version_number);
CREATE INDEX IF NOT EXISTS idx_invitation_versions_created_at ON public.invitation_versions(created_at);

-- 3. RLS Security for invitation_versions
ALTER TABLE public.invitation_versions ENABLE ROW LEVEL SECURITY;

-- Owner can select versions of their own weddings
DROP POLICY IF EXISTS "Owners can view invitation versions" ON public.invitation_versions;
CREATE POLICY "Owners can view invitation versions" ON public.invitation_versions
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.weddings w 
            WHERE w.id = invitation_versions.wedding_id 
              AND w.user_id = auth.uid()
        )
    );

-- Owner can create new versions for their weddings
DROP POLICY IF EXISTS "Owners can create invitation versions" ON public.invitation_versions;
CREATE POLICY "Owners can create invitation versions" ON public.invitation_versions
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.weddings w 
            WHERE w.id = invitation_versions.wedding_id 
              AND w.user_id = auth.uid()
        )
    );

-- Service role full access
DROP POLICY IF EXISTS "Service role full access on versions" ON public.invitation_versions;
CREATE POLICY "Service role full access on versions" ON public.invitation_versions
    FOR ALL TO service_role
    USING (true);

GRANT ALL ON public.invitation_versions TO service_role;
GRANT SELECT, INSERT ON public.invitation_versions TO authenticated;
