-- Migration: PART 1 Security, Soft Delete, Wedding Integrations & RLS Fixes

-- 1. Create wedding_integrations table for server-side secret storage
CREATE TABLE IF NOT EXISTS public.wedding_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    telegram_bot_token TEXT,
    telegram_chat_id TEXT,
    notification_email TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast lookup by wedding_id
CREATE INDEX IF NOT EXISTS idx_wedding_integrations_wedding_id ON public.wedding_integrations(wedding_id);

-- 2. Add soft delete and state columns to weddings if not present
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='weddings' AND column_name='deleted_at') THEN
        ALTER TABLE public.weddings ADD COLUMN deleted_at TIMESTAMPTZ DEFAULT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='weddings' AND column_name='deleted_by') THEN
        ALTER TABLE public.weddings ADD COLUMN deleted_by UUID DEFAULT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='weddings' AND column_name='is_active') THEN
        ALTER TABLE public.weddings ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='weddings' AND column_name='event_timezone') THEN
        ALTER TABLE public.weddings ADD COLUMN event_timezone TEXT DEFAULT 'Europe/Istanbul';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='weddings' AND column_name='view_count') THEN
        ALTER TABLE public.weddings ADD COLUMN view_count INT DEFAULT 0;
    END IF;
END $$;

-- Index for soft delete & slug lookup
CREATE INDEX IF NOT EXISTS idx_weddings_slug ON public.weddings(slug);
CREATE INDEX IF NOT EXISTS idx_weddings_user_id ON public.weddings(user_id);
CREATE INDEX IF NOT EXISTS idx_weddings_deleted_at ON public.weddings(deleted_at);

-- 3. Create public_wedding_view (stripping telegram_bot_token, telegram_chat_id, user_email)
CREATE OR REPLACE VIEW public.public_wedding_view AS
SELECT 
    w.id,
    w.slug,
    w.title,
    w.event_type,
    w.bride_name,
    w.groom_name,
    w.bride_parents,
    w.groom_parents,
    w.wedding_date,
    w.venue_name,
    w.venue_address,
    w.google_maps_url,
    w.custom_message,
    w.template_id,
    w.primary_color,
    w.text_color,
    w.envelope_color,
    w.envelope_flap_type,
    w.seal_type,
    w.seal_color,
    w.entrance_type,
    w.effect_type,
    w.font_family,
    w.names_font_family,
    w.background_image_url,
    w.bride_photo_url,
    w.groom_photo_url,
    w.music_url,
    w.music_autoplay,
    w.show_photos,
    w.show_rsvp,
    w.show_comments,
    w.show_countdown,
    w.is_paid,
    w.is_active,
    w.custom_overrides,
    w.photo_focal_point,
    w.created_at,
    w.updated_at
FROM public.weddings w
WHERE w.deleted_at IS NULL AND w.is_active = true;

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.weddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guestbook_entries ENABLE ROW LEVEL SECURITY;

-- Clear old policies
DROP POLICY IF EXISTS "Weddings Owner Select" ON public.weddings;
DROP POLICY IF EXISTS "Weddings Owner Update" ON public.weddings;
DROP POLICY IF EXISTS "Weddings Owner Delete" ON public.weddings;
DROP POLICY IF EXISTS "Weddings Public Select" ON public.weddings;
DROP POLICY IF EXISTS "Integrations Owner All" ON public.wedding_integrations;
DROP POLICY IF EXISTS "RSVPs Owner All" ON public.rsvps;
DROP POLICY IF EXISTS "RSVPs Public Insert" ON public.rsvps;
DROP POLICY IF EXISTS "Guestbook Owner All" ON public.guestbook_entries;
DROP POLICY IF EXISTS "Guestbook Public Insert" ON public.guestbook_entries;

-- 5. RLS Policies Definition
-- Weddings: Owners can read, update, soft-delete their own record
CREATE POLICY "Weddings Owner Select" ON public.weddings
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id AND deleted_at IS NULL);

CREATE POLICY "Weddings Owner Update" ON public.weddings
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id AND deleted_at IS NULL);

CREATE POLICY "Weddings Owner Delete" ON public.weddings
    FOR DELETE TO authenticated
    USING (auth.uid() = user_id);

-- Weddings: Anon can read active & paid public weddings
CREATE POLICY "Weddings Public Select" ON public.weddings
    FOR SELECT TO anon
    USING (is_paid = true AND deleted_at IS NULL AND is_active = true);

-- Wedding Integrations: STRICTLY restricted to owner only (Anon CANNOT SELECT/INSERT/UPDATE)
CREATE POLICY "Integrations Owner All" ON public.wedding_integrations
    FOR ALL TO authenticated
    USING (wedding_id IN (SELECT id FROM public.weddings WHERE user_id = auth.uid()));

-- RSVPs: Guests can submit RSVP responses, Owners can view/manage
CREATE POLICY "RSVPs Public Insert" ON public.rsvps
    FOR INSERT TO anon, authenticated
    WITH CHECK (wedding_id IN (SELECT id FROM public.weddings WHERE is_paid = true AND deleted_at IS NULL));

CREATE POLICY "RSVPs Owner All" ON public.rsvps
    FOR ALL TO authenticated
    USING (wedding_id IN (SELECT id FROM public.weddings WHERE user_id = auth.uid()));

-- Guestbook: Guests can post wishes, Owners can view/manage
CREATE POLICY "Guestbook Public Insert" ON public.guestbook_entries
    FOR INSERT TO anon, authenticated
    WITH CHECK (wedding_id IN (SELECT id FROM public.weddings WHERE is_paid = true AND deleted_at IS NULL));

CREATE POLICY "Guestbook Owner All" ON public.guestbook_entries
    FOR ALL TO authenticated
    USING (wedding_id IN (SELECT id FROM public.weddings WHERE user_id = auth.uid()));
