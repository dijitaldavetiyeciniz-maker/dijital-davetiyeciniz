-- ============================================================
-- C7 — SUPER ADMIN COMMAND CENTER MIGRATION
-- Profiles, Contact Messages, Platform Settings, Super Admin Audit Logs
-- ============================================================

-- 1. Profiles Table (syncs user metadata like name, phone, address)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    country TEXT DEFAULT 'Türkiye',
    city TEXT,
    address TEXT,
    is_suspended BOOLEAN DEFAULT false,
    suspension_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at);

-- 2. Contact Messages Table (public inquiries & support inbox)
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new', -- 'new', 'read', 'archived'
    ip_hash TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages(created_at);

-- 3. Platform Settings Singleton Table
CREATE TABLE IF NOT EXISTS public.platform_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    maintenance_enabled BOOLEAN DEFAULT false,
    maintenance_scope TEXT DEFAULT 'platform', -- 'platform' (homepage/dash), 'full' (all including invitations)
    maintenance_message TEXT DEFAULT 'Sistemlerimizde kısa süreli bir bakım çalışması gerçekleştirilmektedir. Anlayışınız için teşekkür ederiz.',
    maintenance_until TIMESTAMPTZ NULL,
    announcement_enabled BOOLEAN DEFAULT false,
    announcement_message TEXT DEFAULT '',
    announcement_type TEXT DEFAULT 'info', -- 'info', 'maintenance', 'important'
    contact_email TEXT DEFAULT 'dijitaldavetiyeciniz@gmail.com',
    contact_phone TEXT DEFAULT '+90 555 000 0000',
    contact_address TEXT DEFAULT 'Levent, Büyükdere Cad. No: 199, Şişli / İstanbul',
    updated_at TIMESTAMPTZ DEFAULT now(),
    updated_by TEXT
);

-- Insert default row if not exists
INSERT INTO public.platform_settings (id, maintenance_enabled, contact_email, contact_phone, contact_address)
VALUES ('default', false, 'dijitaldavetiyeciniz@gmail.com', '+90 555 000 0000', 'Levent, Büyükdere Cad. No: 199, Şişli / İstanbul')
ON CONFLICT (id) DO NOTHING;

-- 4. Super Admin Audit Logs Table
CREATE TABLE IF NOT EXISTS public.super_admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action TEXT NOT NULL, -- e.g. 'maintenance_enabled', 'maintenance_disabled', 'settings_updated', 'user_suspended'
    actor_email TEXT DEFAULT 'Super Admin',
    details JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.super_admin_audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.super_admin_audit_logs(created_at);

-- ============================================================
-- Row Level Security (RLS) Policies
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.super_admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view and edit their own profile
DROP POLICY IF EXISTS "Profiles Owner Read" ON public.profiles;
CREATE POLICY "Profiles Owner Read" ON public.profiles
    FOR SELECT TO authenticated
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Profiles Owner Update" ON public.profiles;
CREATE POLICY "Profiles Owner Update" ON public.profiles
    FOR UPDATE TO authenticated
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Profiles Owner Insert" ON public.profiles;
CREATE POLICY "Profiles Owner Insert" ON public.profiles
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = id);

-- Contact Messages: Anyone can submit (INSERT), but NO anonymous or normal user SELECT
DROP POLICY IF EXISTS "Contact Messages Public Insert" ON public.contact_messages;
CREATE POLICY "Contact Messages Public Insert" ON public.contact_messages
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

-- Platform Settings: Public can read non-sensitive platform status
DROP POLICY IF EXISTS "Platform Settings Public Select" ON public.platform_settings;
CREATE POLICY "Platform Settings Public Select" ON public.platform_settings
    FOR SELECT TO anon, authenticated
    USING (true);

-- Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO service_role;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT SELECT ON public.platform_settings TO anon, authenticated;
