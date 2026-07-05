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
