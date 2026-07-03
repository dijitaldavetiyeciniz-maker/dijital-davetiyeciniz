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
ADD COLUMN IF NOT EXISTS effect_type TEXT;
