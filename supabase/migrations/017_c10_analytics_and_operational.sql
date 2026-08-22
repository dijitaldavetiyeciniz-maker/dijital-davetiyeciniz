-- ============================================================
-- Migration 017: C10 Analytics & Operational Foundations
-- ============================================================

-- 1. Enhance Analytics Events Table to support platform-level & invitation-level analytics
DO $$
BEGIN
    -- Make wedding_id nullable so platform-wide events can be tracked
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='analytics_events' AND column_name='wedding_id' AND is_nullable='NO'
    ) THEN
        ALTER TABLE public.analytics_events ALTER COLUMN wedding_id DROP NOT NULL;
    END IF;

    -- Add user_id if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='analytics_events' AND column_name='user_id'
    ) THEN
        ALTER TABLE public.analytics_events ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;

    -- Add event_name if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='analytics_events' AND column_name='event_name'
    ) THEN
        ALTER TABLE public.analytics_events ADD COLUMN event_name TEXT;
    END IF;

    -- Add properties JSONB if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='analytics_events' AND column_name='properties'
    ) THEN
        ALTER TABLE public.analytics_events ADD COLUMN properties JSONB DEFAULT '{}'::jsonb;
    END IF;
END $$;

-- 2. Indexes for efficient funnel queries
CREATE INDEX IF NOT EXISTS idx_analytics_events_name ON public.analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON public.analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON public.analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON public.analytics_events(created_at);

-- 3. RLS Policies
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Analytics Insert Policy" ON public.analytics_events;
CREATE POLICY "Analytics Insert Policy" ON public.analytics_events
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Analytics Service Role Read" ON public.analytics_events;
CREATE POLICY "Analytics Service Role Read" ON public.analytics_events
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- Grants
GRANT INSERT ON public.analytics_events TO anon, authenticated;
GRANT ALL ON public.analytics_events TO service_role;
