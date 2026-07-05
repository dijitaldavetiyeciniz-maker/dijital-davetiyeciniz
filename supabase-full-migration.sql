-- ============================================================
-- DİJİTAL DAVETİYECİNİZ - TAM VERİTABANI GÜNCELLEME SCRIPTI
-- Bu dosyayı Supabase SQL Editor'dan toplu çalıştırın.
-- Tüm IF NOT EXISTS kontrolleri sayesinde güvenle tekrar tekrar çalıştırabilirsiniz.
-- ============================================================

-- -------------------------------------------------------
-- 1. WEDDINGS TABLOSU - TEMEL ALANLAR
-- -------------------------------------------------------
ALTER TABLE public.weddings
  ADD COLUMN IF NOT EXISTS event_type TEXT DEFAULT 'Düğün',
  ADD COLUMN IF NOT EXISTS venue_name TEXT,
  ADD COLUMN IF NOT EXISTS venue_address TEXT,
  ADD COLUMN IF NOT EXISTS google_maps_url TEXT,
  ADD COLUMN IF NOT EXISTS custom_message TEXT,
  ADD COLUMN IF NOT EXISTS bride_parents TEXT,
  ADD COLUMN IF NOT EXISTS groom_parents TEXT,
  ADD COLUMN IF NOT EXISTS use_envelope BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS is_paid BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS primary_color TEXT DEFAULT '#f43f5e',
  ADD COLUMN IF NOT EXISTS text_color TEXT,
  ADD COLUMN IF NOT EXISTS envelope_color TEXT,
  ADD COLUMN IF NOT EXISTS font_family TEXT DEFAULT 'Montserrat',
  ADD COLUMN IF NOT EXISTS background_image_url TEXT,
  ADD COLUMN IF NOT EXISTS effect_type TEXT DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS envelope_bg_color TEXT,
  ADD COLUMN IF NOT EXISTS envelope_flap_type TEXT DEFAULT 'classic',
  ADD COLUMN IF NOT EXISTS seal_type TEXT DEFAULT 'heart',
  ADD COLUMN IF NOT EXISTS seal_color TEXT DEFAULT '#c9a84c',
  ADD COLUMN IF NOT EXISTS entrance_type TEXT DEFAULT 'envelope',
  ADD COLUMN IF NOT EXISTS music_url TEXT,
  ADD COLUMN IF NOT EXISTS music_autoplay BOOLEAN DEFAULT true;

-- -------------------------------------------------------
-- 2. WEDDINGS TABLOSU - TOGGLE / MODÜLER ALANLAR
-- -------------------------------------------------------
ALTER TABLE public.weddings
  ADD COLUMN IF NOT EXISTS show_photos BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_rsvp BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_comments BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_countdown BOOLEAN DEFAULT true;

-- -------------------------------------------------------
-- 3. WEDDINGS TABLOSU - ARKA PLAN ANİMASYONU
-- -------------------------------------------------------
ALTER TABLE public.weddings
  ADD COLUMN IF NOT EXISTS background_animation TEXT DEFAULT 'none';

-- -------------------------------------------------------
-- 4. WEDDINGS TABLOSU - PREMIUM UI AYARLARI
-- (countdown_style ve is_dark_mode - HATA VEREN SÜTUNLAR)
-- -------------------------------------------------------
ALTER TABLE public.weddings
  ADD COLUMN IF NOT EXISTS countdown_style TEXT DEFAULT 'glass',
  ADD COLUMN IF NOT EXISTS is_dark_mode BOOLEAN DEFAULT false;

-- -------------------------------------------------------
-- 5. WEDDINGS TABLOSU - FONT ÇİFTLERİ VE TİPOGRAFİ
-- -------------------------------------------------------
ALTER TABLE public.weddings
  ADD COLUMN IF NOT EXISTS names_font_family TEXT,
  ADD COLUMN IF NOT EXISTS quote_font_family TEXT,
  ADD COLUMN IF NOT EXISTS quote_font_size TEXT DEFAULT 'text-sm';

-- -------------------------------------------------------
-- 6. WEDDINGS TABLOSU - TELEGRAM ENTEGRASYONU
-- -------------------------------------------------------
ALTER TABLE public.weddings
  ADD COLUMN IF NOT EXISTS telegram_bot_token TEXT,
  ADD COLUMN IF NOT EXISTS telegram_chat_id TEXT;

-- -------------------------------------------------------
-- 7. WEDDINGS TABLOSU - AUTH / KULLANICI SAHİPLİĞİ
-- -------------------------------------------------------
ALTER TABLE public.weddings
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- -------------------------------------------------------
-- 8. RSVPs TABLOSU - EK ALANLAR
-- -------------------------------------------------------
ALTER TABLE public.rsvps
  ADD COLUMN IF NOT EXISTS child_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT true;

-- -------------------------------------------------------
-- 9. RSVPs TABLOSU - GÜVENLİK POLİTİKALARI (YENİ)
-- -------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'rsvps' AND policyname = 'Allow anonymous update access'
  ) THEN
    EXECUTE 'CREATE POLICY "Allow anonymous update access" ON public.rsvps FOR UPDATE USING (true)';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'rsvps' AND policyname = 'Allow anonymous delete access'
  ) THEN
    EXECUTE 'CREATE POLICY "Allow anonymous delete access" ON public.rsvps FOR DELETE USING (true)';
  END IF;
END $$;

-- weddings tablosu için update politikası
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'weddings' AND policyname = 'Allow anonymous update access'
  ) THEN
    EXECUTE 'CREATE POLICY "Allow anonymous update access" ON public.weddings FOR UPDATE USING (true)';
  END IF;
END $$;

-- -------------------------------------------------------
-- TAMAMLANDI - Supabase schema cache'i otomatik güncellenir.
-- -------------------------------------------------------
