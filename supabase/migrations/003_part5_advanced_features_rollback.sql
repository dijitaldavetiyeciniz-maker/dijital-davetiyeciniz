-- Rollback Migration: PART 5 Advanced Features
-- WARNING: This migration drops tables related to Guest Management, Analytics, Check-ins, and Moderation.
-- Data Loss Risk: High. Back up the database before running this rollback.

-- 1. Drop Tables (in correct dependency order)
DROP TABLE IF EXISTS public.check_ins CASCADE;
DROP TABLE IF EXISTS public.analytics_events CASCADE;
DROP TABLE IF EXISTS public.seats CASCADE;
DROP TABLE IF EXISTS public.tables CASCADE;
DROP TABLE IF EXISTS public.guests CASCADE;
DROP TABLE IF EXISTS public.guest_groups CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;

-- 2. Revert column additions in guestbook_entries
DO $$ 
BEGIN 
    ALTER TABLE public.guestbook_entries DROP COLUMN IF EXISTS status;
    ALTER TABLE public.guestbook_entries DROP COLUMN IF EXISTS moderated_by;
    ALTER TABLE public.guestbook_entries DROP COLUMN IF EXISTS moderated_at;
END $$;

-- 3. Revert column additions in weddings
DO $$ 
BEGIN 
    ALTER TABLE public.weddings DROP COLUMN IF EXISTS language;
    ALTER TABLE public.weddings DROP COLUMN IF EXISTS draft_data;
    ALTER TABLE public.weddings DROP COLUMN IF EXISTS published_at;
    ALTER TABLE public.weddings DROP COLUMN IF EXISTS publish_start;
    ALTER TABLE public.weddings DROP COLUMN IF EXISTS publish_end;
    ALTER TABLE public.weddings DROP COLUMN IF EXISTS rsvp_deadline;
    ALTER TABLE public.weddings DROP COLUMN IF EXISTS gallery_open_time;
    ALTER TABLE public.weddings DROP COLUMN IF EXISTS guestbook_close_time;
    ALTER TABLE public.weddings DROP COLUMN IF EXISTS custom_domain;
END $$;

-- 4. Recreate old public_wedding_view (without the new columns)
CREATE OR REPLACE VIEW public.public_wedding_view AS
SELECT 
    w.id,
    w.slug,
    CASE 
        WHEN w.event_type IN ('Düğün', 'Nişan', 'Kına', 'Sünnet') THEN 
            COALESCE(w.bride_name || ' & ' || w.groom_name, w.bride_name, 'Etkinlik')
        ELSE 
            COALESCE(w.bride_name, 'Etkinlik')
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
    w.updated_at
FROM public.weddings w
WHERE w.deleted_at IS NULL AND w.is_active = true;
