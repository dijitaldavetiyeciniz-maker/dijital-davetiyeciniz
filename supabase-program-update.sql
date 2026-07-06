-- Program Akışı modülü için gerekli sütunlar
ALTER TABLE public.weddings
ADD COLUMN IF NOT EXISTS show_program BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS program_timeline JSONB DEFAULT '[]'::jsonb;
