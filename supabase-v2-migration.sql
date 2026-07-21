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
