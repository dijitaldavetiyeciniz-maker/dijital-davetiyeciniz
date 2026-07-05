-- Davetiyedeki modüler alanların (Fotoğraf, LCV, Geri Sayım, Anı Defteri) açılıp kapatılması için gerekli sütunlar
ALTER TABLE public.weddings
ADD COLUMN IF NOT EXISTS show_photos BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS show_rsvp BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS show_comments BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS show_countdown BOOLEAN DEFAULT true;
