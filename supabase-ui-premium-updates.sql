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
