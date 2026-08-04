-- Migration: PART 5 Advanced Features (Guest Management, Multi-Event, Analytics, Moderation)

-- 1. Modify Weddings table with new columns for Part 5
DO $$ 
BEGIN 
    -- Multi-language
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='weddings' AND column_name='language') THEN
        ALTER TABLE public.weddings ADD COLUMN language TEXT DEFAULT 'tr';
    END IF;
    -- Autosave / Draft Support
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='weddings' AND column_name='draft_data') THEN
        ALTER TABLE public.weddings ADD COLUMN draft_data JSONB DEFAULT NULL;
    END IF;
    -- Scheduled Publish
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='weddings' AND column_name='published_at') THEN
        ALTER TABLE public.weddings ADD COLUMN published_at TIMESTAMPTZ DEFAULT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='weddings' AND column_name='publish_start') THEN
        ALTER TABLE public.weddings ADD COLUMN publish_start TIMESTAMPTZ DEFAULT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='weddings' AND column_name='publish_end') THEN
        ALTER TABLE public.weddings ADD COLUMN publish_end TIMESTAMPTZ DEFAULT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='weddings' AND column_name='rsvp_deadline') THEN
        ALTER TABLE public.weddings ADD COLUMN rsvp_deadline TIMESTAMPTZ DEFAULT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='weddings' AND column_name='gallery_open_time') THEN
        ALTER TABLE public.weddings ADD COLUMN gallery_open_time TIMESTAMPTZ DEFAULT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='weddings' AND column_name='guestbook_close_time') THEN
        ALTER TABLE public.weddings ADD COLUMN guestbook_close_time TIMESTAMPTZ DEFAULT NULL;
    END IF;
    -- Agency/Premium Features
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='weddings' AND column_name='custom_domain') THEN
        ALTER TABLE public.weddings ADD COLUMN custom_domain TEXT UNIQUE DEFAULT NULL;
    END IF;
END $$;

-- Update View to include new columns
CREATE OR REPLACE VIEW public.public_wedding_view AS
SELECT 
    w.id,
    w.slug,
    CASE 
        WHEN w.event_type IN ('wedding', 'engagement', 'henna') THEN 
            concat_ws(' & ', nullif(w.bride_name, ''), nullif(w.groom_name, ''))
        WHEN w.event_type = 'circumcision' THEN 
            COALESCE(NULLIF(w.bride_name, ''), 'Sünnet Daveti')
        ELSE 
            COALESCE(NULLIF(w.bride_name, ''), 'Etkinlik')
    END AS title,
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
    w.updated_at,
    w.language,
    w.published_at,
    w.publish_start,
    w.publish_end,
    w.rsvp_deadline,
    w.gallery_open_time,
    w.guestbook_close_time,
    w.custom_domain
FROM public.weddings w
WHERE w.deleted_at IS NULL AND w.is_active = true 
  AND (w.publish_start IS NULL OR w.publish_start <= now())
  AND (w.publish_end IS NULL OR w.publish_end >= now());

-- 2. Modify guestbook_entries for Moderation
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='guestbook_entries' AND column_name='status') THEN
        ALTER TABLE public.guestbook_entries ADD COLUMN status TEXT DEFAULT 'pending'; -- pending, approved, rejected
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='guestbook_entries' AND column_name='moderated_by') THEN
        ALTER TABLE public.guestbook_entries ADD COLUMN moderated_by UUID REFERENCES auth.users(id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='guestbook_entries' AND column_name='moderated_at') THEN
        ALTER TABLE public.guestbook_entries ADD COLUMN moderated_at TIMESTAMPTZ DEFAULT NULL;
    END IF;
END $$;

-- 3. Create Multi-Event Table
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- e.g. kına, düğün, after_party, brunch
    title TEXT NOT NULL,
    event_date TIMESTAMPTZ NOT NULL,
    event_timezone TEXT DEFAULT 'Europe/Istanbul',
    venue_name TEXT,
    venue_address TEXT,
    google_maps_url TEXT,
    description TEXT,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create Guest Management Tables
CREATE TABLE IF NOT EXISTS public.guest_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.guests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    group_id UUID REFERENCES public.guest_groups(id) ON DELETE SET NULL,
    token_version INT DEFAULT 1,
    is_revoked BOOLEAN DEFAULT false,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    rsvp_status TEXT DEFAULT 'pending', -- pending, attending, not_attending, undecided
    meal_preference TEXT,
    allergy_notes TEXT,
    special_needs TEXT,
    plus_ones_allowed INT DEFAULT 0,
    plus_ones_confirmed INT DEFAULT 0,
    children_count INT DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Create Seating Arrangement Tables
CREATE TABLE IF NOT EXISTS public.tables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    capacity INT NOT NULL DEFAULT 8,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.seats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_id UUID NOT NULL REFERENCES public.tables(id) ON DELETE CASCADE,
    guest_id UUID NOT NULL REFERENCES public.guests(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(table_id, guest_id)
);

-- 6. Create Check-in and Analytics Tables
CREATE TABLE IF NOT EXISTS public.check_ins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    guest_id UUID NOT NULL REFERENCES public.guests(id) ON DELETE CASCADE,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    checked_in_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    check_in_time TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(guest_id, event_id)
);

CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    session_id TEXT, -- anonyized session hash
    event_type TEXT NOT NULL, -- view, rsvp, map_click, calendar_add, photo_upload, share, music_play
    device_type TEXT, -- mobile, tablet, desktop
    language TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Index creation
CREATE INDEX IF NOT EXISTS idx_events_wedding_id ON public.events(wedding_id);
CREATE INDEX IF NOT EXISTS idx_guests_wedding_id ON public.guests(wedding_id);
-- Removed idx_guests_secure_token as it is no longer needed
CREATE INDEX IF NOT EXISTS idx_check_ins_wedding_id ON public.check_ins(wedding_id);
CREATE INDEX IF NOT EXISTS idx_analytics_wedding_id ON public.analytics_events(wedding_id);
CREATE INDEX IF NOT EXISTS idx_tables_wedding_id ON public.tables(wedding_id);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Policies for Owner access
CREATE POLICY "Events Owner All" ON public.events FOR ALL TO authenticated USING (wedding_id IN (SELECT id FROM public.weddings WHERE user_id = auth.uid()));
CREATE POLICY "GuestGroups Owner All" ON public.guest_groups FOR ALL TO authenticated USING (wedding_id IN (SELECT id FROM public.weddings WHERE user_id = auth.uid()));
CREATE POLICY "Guests Owner All" ON public.guests FOR ALL TO authenticated USING (wedding_id IN (SELECT id FROM public.weddings WHERE user_id = auth.uid()));
CREATE POLICY "Tables Owner All" ON public.tables FOR ALL TO authenticated USING (wedding_id IN (SELECT id FROM public.weddings WHERE user_id = auth.uid()));
CREATE POLICY "Seats Owner All" ON public.seats FOR ALL TO authenticated USING (table_id IN (SELECT id FROM public.tables WHERE wedding_id IN (SELECT id FROM public.weddings WHERE user_id = auth.uid())));
CREATE POLICY "CheckIns Owner All" ON public.check_ins FOR ALL TO authenticated USING (wedding_id IN (SELECT id FROM public.weddings WHERE user_id = auth.uid()));
CREATE POLICY "Analytics Owner Select" ON public.analytics_events FOR SELECT TO authenticated USING (wedding_id IN (SELECT id FROM public.weddings WHERE user_id = auth.uid()));

-- Policies for Public/Guest access
CREATE POLICY "Events Public Select" ON public.events FOR SELECT TO anon, authenticated USING (wedding_id IN (SELECT id FROM public.weddings WHERE is_paid = true AND deleted_at IS NULL AND is_active = true));
-- Removed insecure Guests Public Select by Token policy
CREATE POLICY "Analytics Public Insert" ON public.analytics_events FOR INSERT TO anon, authenticated WITH CHECK (wedding_id IN (SELECT id FROM public.weddings WHERE deleted_at IS NULL));

-- Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.guest_groups TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.guests TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tables TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.seats TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.check_ins TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.analytics_events TO anon, authenticated;
GRANT SELECT ON public.public_wedding_view TO anon, authenticated;
