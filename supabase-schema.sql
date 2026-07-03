-- 1. Weddings (Düğünler) Tablosu
-- Bu tablo her bir müşteriyi (çifti) temsil eder.
CREATE TABLE public.weddings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL, -- URL için kullanılacak (örn: ayse-mehmet)
    bride_name TEXT NOT NULL,
    groom_name TEXT NOT NULL,
    wedding_date TIMESTAMP WITH TIME ZONE,
    template_id TEXT DEFAULT 'template1', -- Tasarım şablonu
    admin_password TEXT NOT NULL, -- Çiftin paneline girmek için şifresi
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. RSVPs (LCV / Katılım Durumları) Tablosu
-- Bu tablo, misafirlerin verdiği yanıtları tutar. Hangi düğüne ait olduğunu "wedding_id" ile anlarız.
CREATE TABLE public.rsvps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    wedding_id UUID REFERENCES public.weddings(id) ON DELETE CASCADE NOT NULL,
    guest_name TEXT NOT NULL,
    is_attending BOOLEAN NOT NULL,
    guest_count INTEGER DEFAULT 1,
    message TEXT,
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
