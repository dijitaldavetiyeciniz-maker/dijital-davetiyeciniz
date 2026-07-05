-- Arka plan animasyonu sütunu ekle
ALTER TABLE public.weddings
ADD COLUMN IF NOT EXISTS background_animation TEXT DEFAULT 'none';
