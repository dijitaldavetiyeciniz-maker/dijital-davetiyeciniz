-- 1. Weddings (Düğünler) Tablosu
-- Bu tablo her bir müşteriyi (çifti) temsil eder.
CREATE TABLE IF NOT EXISTS public.weddings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL, -- URL için kullanılacak (örn: ayse-mehmet)
    bride_name TEXT NOT NULL,
    groom_name TEXT NOT NULL,
    wedding_date TIMESTAMP WITH TIME ZONE,
    template_id TEXT DEFAULT 'template1', -- Tasarım şablonu
    admin_password TEXT NOT NULL, -- Çiftin paneline girmek için şifresi
    bride_photo_url TEXT,
    groom_photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. RSVPs (LCV / Katılım Durumları) Tablosu
-- Bu tablo, misafirlerin verdiği yanıtları tutar. Hangi düğüne ait olduğunu "wedding_id" ile anlarız.
CREATE TABLE IF NOT EXISTS public.rsvps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    wedding_id UUID REFERENCES public.weddings(id) ON DELETE CASCADE NOT NULL,
    guest_name TEXT NOT NULL,
    is_attending BOOLEAN NOT NULL,
    guest_count INTEGER DEFAULT 1,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- 3. Guestbook Entries
CREATE TABLE IF NOT EXISTS public.guestbook_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    wedding_id UUID REFERENCES public.weddings(id) ON DELETE CASCADE NOT NULL,
    guest_name TEXT NOT NULL,
    message TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- İzinler (Row Level Security - RLS)
-- Şimdilik herkesin okuyup yazabilmesi için açık bırakıyoruz, ileride güvenliği artıracağız.
ALTER TABLE public.weddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access" ON public.weddings FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert access" ON public.weddings FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous read access" ON public.rsvps FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert access" ON public.rsvps FOR INSERT WITH CHECK (true);

-- Örnek bir veri (Test Düğünü) ekleyelim:
INSERT INTO public.weddings (slug, bride_name, groom_name, admin_password, template_id) 
VALUES ('test-dugun', 'Ayşe', 'Mehmet', '123456', 'template1');

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

-- Yeni özellikler için mevcut weddings tablosunu güncelliyoruz

ALTER TABLE public.weddings
ADD COLUMN IF NOT EXISTS event_type TEXT DEFAULT 'Düğün',
ADD COLUMN IF NOT EXISTS venue_name TEXT DEFAULT 'Modern Sanatlar Merkezi',
ADD COLUMN IF NOT EXISTS venue_address TEXT DEFAULT 'İstanbul',
ADD COLUMN IF NOT EXISTS google_maps_url TEXT,
ADD COLUMN IF NOT EXISTS custom_message TEXT,
ADD COLUMN IF NOT EXISTS bride_parents TEXT,
ADD COLUMN IF NOT EXISTS groom_parents TEXT,
ADD COLUMN IF NOT EXISTS use_envelope BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS is_paid BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS primary_color TEXT,
ADD COLUMN IF NOT EXISTS text_color TEXT,
ADD COLUMN IF NOT EXISTS envelope_color TEXT,
ADD COLUMN IF NOT EXISTS font_family TEXT,
ADD COLUMN IF NOT EXISTS background_image_url TEXT,
ADD COLUMN IF NOT EXISTS effect_type TEXT,
ADD COLUMN IF NOT EXISTS envelope_bg_color TEXT,
ADD COLUMN IF NOT EXISTS envelope_flap_type TEXT,
ADD COLUMN IF NOT EXISTS seal_type TEXT,
ADD COLUMN IF NOT EXISTS seal_color TEXT,
ADD COLUMN IF NOT EXISTS entrance_type TEXT DEFAULT 'envelope',
ADD COLUMN IF NOT EXISTS music_url TEXT,
ADD COLUMN IF NOT EXISTS music_autoplay BOOLEAN DEFAULT true;

-- Geri sayım sayacı stili ve Koyu Mod desteği için gerekli sütunlar
ALTER TABLE public.weddings
ADD COLUMN IF NOT EXISTS countdown_style TEXT DEFAULT 'glass',
ADD COLUMN IF NOT EXISTS is_dark_mode BOOLEAN DEFAULT false;

-- LCV Lüks Paneli için çocuk sayısı sütunu
ALTER TABLE public.rsvps
ADD COLUMN IF NOT EXISTS child_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT true;

-- Kullanıcı e-postası kolonu ve güncellemesi
ALTER TABLE public.weddings ADD COLUMN IF NOT EXISTS user_email TEXT;
UPDATE public.weddings w
SET user_email = u.email
FROM auth.users u
WHERE w.user_id = u.id AND w.user_email IS NULL;

-- Giriş animasyonları (romantic-wax-seal, royal-seal-premium, vb.) sütunları
ALTER TABLE public.weddings ADD COLUMN IF NOT EXISTS entrance_animation TEXT DEFAULT 'royal-seal-premium';
ALTER TABLE public.weddings ADD COLUMN IF NOT EXISTS envelope_style TEXT DEFAULT 'classic';
ALTER TABLE public.weddings ADD COLUMN IF NOT EXISTS seal_style TEXT DEFAULT 'burgundy';
ALTER TABLE public.weddings ADD COLUMN IF NOT EXISTS background_animation TEXT DEFAULT 'golden';

-- Daha önce çalıştırılan SQL kodlarına ek olarak:

-- weddings tablosuna user_id eklenmesi
ALTER TABLE weddings ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Mevcut satırlar için user_id boş (NULL) kalacak, bu sorun değil.

-- Program Akışı modülü için gerekli sütunlar
ALTER TABLE public.weddings
ADD COLUMN IF NOT EXISTS show_program BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS program_timeline JSONB DEFAULT '[]'::jsonb;

-- Telegram Bot Entegrasyonu İçin Gerekli Sütunlar
ALTER TABLE weddings ADD COLUMN IF NOT EXISTS telegram_bot_token TEXT;
ALTER TABLE weddings ADD COLUMN IF NOT EXISTS telegram_chat_id TEXT;

-- ============================================================
-- DİJİTAL DAVETİYECİNİZ - ŞABLON SİSTEMİ V2 MİGRATION SCRIPTI
-- Bu dosyayı Supabase SQL Editor'dan çalıştırın.
-- ============================================================

ALTER TABLE public.weddings
  ADD COLUMN IF NOT EXISTS custom_overrides JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS photo_focal_point JSONB DEFAULT '{"x": 50, "y": 50}'::jsonb;

-- Geriye dönük uyumluluk için varsayılan değerleri atayalım (Eğer null ise)
UPDATE public.weddings 
SET custom_overrides = '{}'::jsonb 
WHERE custom_overrides IS NULL;

UPDATE public.weddings 
SET photo_focal_point = '{"x": 50, "y": 50}'::jsonb 
WHERE photo_focal_point IS NULL;

-- Arka plan animasyonu sütunu ekle
ALTER TABLE public.weddings
ADD COLUMN IF NOT EXISTS background_animation TEXT DEFAULT 'none';

