-- ============================================================
-- C13 W9 — SUPER ADMIN PLATFORM CONTROL CENTER & OPERATIONS
-- Migration: 019_c13_w9_super_admin_operations.sql
-- ============================================================

-- 1. Global Site Settings Table (Draft & Published configuration store)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'global',
    draft_config JSONB NOT NULL DEFAULT '{}'::jsonb,
    published_config JSONB NOT NULL DEFAULT '{}'::jsonb,
    version INT NOT NULL DEFAULT 1,
    is_published BOOLEAN NOT NULL DEFAULT true,
    published_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    updated_by TEXT DEFAULT 'Super Admin'
);

-- Seed default initial site_settings if not exists
INSERT INTO public.site_settings (id, draft_config, published_config, version, is_published, published_at)
VALUES (
    'global',
    '{
      "branding": {
        "siteName": "Dijital Davetiyeciniz",
        "logoUrl": "",
        "darkLogoUrl": "",
        "lightLogoUrl": "",
        "mobileLogoUrl": "",
        "faviconUrl": "",
        "primaryBrandColor": "#e11d48",
        "accentBrandColor": "#d4af37",
        "defaultShareImage": ""
      },
      "announcement": {
        "enabled": false,
        "text": "Yeni Premium Davetiye Şablonlarımız Yayında — Hemen İnceleyin",
        "ctaText": "Şablonları Gör",
        "ctaUrl": "/sablonlar",
        "openInNewTab": false,
        "tone": "rose",
        "textColor": "#ffffff",
        "dismissible": true,
        "showOnMobile": true,
        "showOnDesktop": true
      },
      "header": {
        "logoText": "Dijital Davetiyeciniz",
        "logoUrl": "",
        "navItems": [
          { "id": "nav-templates", "label": "Şablonlar", "url": "/sablonlar", "isVisible": true, "order": 1 },
          { "id": "nav-pricing", "label": "Fiyatlandırma", "url": "/fiyatlandirma", "isVisible": true, "order": 2 },
          { "id": "nav-how", "label": "Nasıl Çalışır?", "url": "/nasil-calisir", "isVisible": true, "order": 3 },
          { "id": "nav-faq", "label": "S.S.S.", "url": "/sss", "isVisible": true, "order": 4 },
          { "id": "nav-contact", "label": "İletişim", "url": "/iletisim", "isVisible": true, "order": 5 }
        ],
        "ctaVisible": true,
        "ctaText": "Davetiye Oluştur",
        "ctaUrl": "/olustur"
      },
      "footer": {
        "enabled": true,
        "logoText": "Dijital Davetiyeciniz",
        "description": "Hayalinizdeki dijital düğün, nişan ve kına davetiyesini dakikalar içinde oluşturun, misafirlerinizle anında paylaşın.",
        "companyName": "Dijital Davetiyeciniz Ltd. Şti.",
        "contactEmail": "destek@dijitaldavetiyeciniz.com",
        "contactPhone": "+90 (850) 000 00 00",
        "copyrightText": "© 2026 Dijital Davetiyeciniz. Tüm hakları saklıdır.",
        "socialLinks": {
          "instagram": "https://instagram.com",
          "facebook": "https://facebook.com",
          "twitter": "https://twitter.com",
          "youtube": ""
        },
        "legalLinks": {
          "kvkk": "/kvkk",
          "privacy": "/gizlilik-politikasi",
          "terms": "/kullanim-kosullari",
          "cookies": "/cerez-politikasi"
        }
      },
      "homepage": {
        "heroHeadline": "Hayatınızın En Özel Gününü Dijital Zarafetle Duyurun",
        "heroSubtitle": "Dakikalar içinde lüks dijital davetiyenizi tasarlayın; müzik, yol tarifi, LCV ve özel açılış animasyonlarıyla misafirlerinizi büyüleyin.",
        "heroCtaText": "Hemen Ücretsiz Başlayın",
        "heroCtaUrl": "/olustur",
        "heroVisualUrl": "",
        "sections": [
          { "id": "hero", "name": "Hero Alanı", "isVisible": true, "order": 1 },
          { "id": "templates-showcase", "name": "Popüler Şablonlar", "isVisible": true, "order": 2 },
          { "id": "features", "name": "Özellikler", "isVisible": true, "order": 3 },
          { "id": "how-it-works", "name": "Nasıl Çalışır?", "isVisible": true, "order": 4 },
          { "id": "testimonials", "name": "Mutlu Çiftler", "isVisible": true, "order": 5 },
          { "id": "faq", "name": "Sıkça Sorulan Sorular", "isVisible": true, "order": 6 },
          { "id": "final-cta", "name": "Alt Çağrı Alanı", "isVisible": true, "order": 7 }
        ]
      },
      "maintenance": {
        "enabled": false,
        "title": "Kısa Süreli Bakım Çalışması",
        "description": "Sizlere daha kesintisiz bir deneyim sunmak amacıyla altyapımızı güncelliyoruz. Çok yakında tekrar yayındayız.",
        "estimatedReturn": "Yaklaşık 30 dakika",
        "supportEmail": "destek@dijitaldavetiyeciniz.com",
        "visualUrl": ""
      },
      "support": {
        "enabled": true,
        "allowGuestTickets": true,
        "categories": ["Genel Soru", "Ödeme & Planlar", "Tasarım & Şablon", "Özel Alan Adı", "Teknik Destek"],
        "operatingHours": "Hafta içi 09:00 - 18:00"
      }
    }'::jsonb,
    '{
      "branding": {
        "siteName": "Dijital Davetiyeciniz",
        "logoUrl": "",
        "darkLogoUrl": "",
        "lightLogoUrl": "",
        "mobileLogoUrl": "",
        "faviconUrl": "",
        "primaryBrandColor": "#e11d48",
        "accentBrandColor": "#d4af37",
        "defaultShareImage": ""
      },
      "announcement": {
        "enabled": false,
        "text": "Yeni Premium Davetiye Şablonlarımız Yayında — Hemen İnceleyin",
        "ctaText": "Şablonları Gör",
        "ctaUrl": "/sablonlar",
        "openInNewTab": false,
        "tone": "rose",
        "textColor": "#ffffff",
        "dismissible": true,
        "showOnMobile": true,
        "showOnDesktop": true
      },
      "header": {
        "logoText": "Dijital Davetiyeciniz",
        "logoUrl": "",
        "navItems": [
          { "id": "nav-templates", "label": "Şablonlar", "url": "/sablonlar", "isVisible": true, "order": 1 },
          { "id": "nav-pricing", "label": "Fiyatlandırma", "url": "/fiyatlandirma", "isVisible": true, "order": 2 },
          { "id": "nav-how", "label": "Nasıl Çalışır?", "url": "/nasil-calisir", "isVisible": true, "order": 3 },
          { "id": "nav-faq", "label": "S.S.S.", "url": "/sss", "isVisible": true, "order": 4 },
          { "id": "nav-contact", "label": "İletişim", "url": "/iletisim", "isVisible": true, "order": 5 }
        ],
        "ctaVisible": true,
        "ctaText": "Davetiye Oluştur",
        "ctaUrl": "/olustur"
      },
      "footer": {
        "enabled": true,
        "logoText": "Dijital Davetiyeciniz",
        "description": "Hayalinizdeki dijital düğün, nişan ve kına davetiyesini dakikalar içinde oluşturun, misafirlerinizle anında paylaşın.",
        "companyName": "Dijital Davetiyeciniz Ltd. Şti.",
        "contactEmail": "destek@dijitaldavetiyeciniz.com",
        "contactPhone": "+90 (850) 000 00 00",
        "copyrightText": "© 2026 Dijital Davetiyeciniz. Tüm hakları saklıdır.",
        "socialLinks": {
          "instagram": "https://instagram.com",
          "facebook": "https://facebook.com",
          "twitter": "https://twitter.com",
          "youtube": ""
        },
        "legalLinks": {
          "kvkk": "/kvkk",
          "privacy": "/gizlilik-politikasi",
          "terms": "/kullanim-kosullari",
          "cookies": "/cerez-politikasi"
        }
      },
      "homepage": {
        "heroHeadline": "Hayatınızın En Özel Gününü Dijital Zarafetle Duyurun",
        "heroSubtitle": "Dakikalar içinde lüks dijital davetiyenizi tasarlayın; müzik, yol tarifi, LCV ve özel açılış animasyonlarıyla misafirlerinizi büyüleyin.",
        "heroCtaText": "Hemen Ücretsiz Başlayın",
        "heroCtaUrl": "/olustur",
        "heroVisualUrl": "",
        "sections": [
          { "id": "hero", "name": "Hero Alanı", "isVisible": true, "order": 1 },
          { "id": "templates-showcase", "name": "Popüler Şablonlar", "isVisible": true, "order": 2 },
          { "id": "features", "name": "Özellikler", "isVisible": true, "order": 3 },
          { "id": "how-it-works", "name": "Nasıl Çalışır?", "isVisible": true, "order": 4 },
          { "id": "testimonials", "name": "Mutlu Çiftler", "isVisible": true, "order": 5 },
          { "id": "faq", "name": "Sıkça Sorulan Sorular", "isVisible": true, "order": 6 },
          { "id": "final-cta", "name": "Alt Çağrı Alanı", "isVisible": true, "order": 7 }
        ]
      },
      "maintenance": {
        "enabled": false,
        "title": "Kısa Süreli Bakım Çalışması",
        "description": "Sizlere daha kesintisiz bir deneyim sunmak amacıyla altyapımızı güncelliyoruz. Çok yakında tekrar yayındayız.",
        "estimatedReturn": "Yaklaşık 30 dakika",
        "supportEmail": "destek@dijitaldavetiyeciniz.com",
        "visualUrl": ""
      },
      "support": {
        "enabled": true,
        "allowGuestTickets": true,
        "categories": ["Genel Soru", "Ödeme & Planlar", "Tasarım & Şablon", "Özel Alan Adı", "Teknik Destek"],
        "operatingHours": "Hafta içi 09:00 - 18:00"
      }
    }'::jsonb,
    1,
    true,
    now()
)
ON CONFLICT (id) DO NOTHING;

-- 2. Real Support System Tables (Conversations & Messages)
CREATE TABLE IF NOT EXISTS public.support_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NULL,
    wedding_id UUID NULL,
    guest_email TEXT NULL,
    guest_name TEXT NULL,
    subject TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Genel Soru',
    status TEXT NOT NULL DEFAULT 'open', -- 'open', 'waiting_admin', 'waiting_user', 'resolved', 'closed'
    priority TEXT NOT NULL DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
    assigned_to TEXT NULL,
    unread_admin BOOLEAN NOT NULL DEFAULT true,
    unread_user BOOLEAN NOT NULL DEFAULT false,
    last_message_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_support_conv_user ON public.support_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_support_conv_wedding ON public.support_conversations(wedding_id);
CREATE INDEX IF NOT EXISTS idx_support_conv_status ON public.support_conversations(status);
CREATE INDEX IF NOT EXISTS idx_support_conv_unread ON public.support_conversations(unread_admin);
CREATE INDEX IF NOT EXISTS idx_support_conv_last_msg ON public.support_conversations(last_message_at);

CREATE TABLE IF NOT EXISTS public.support_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.support_conversations(id) ON DELETE CASCADE,
    sender_type TEXT NOT NULL, -- 'user', 'guest', 'admin', 'system'
    sender_id TEXT NULL,
    sender_name TEXT NOT NULL,
    message TEXT NOT NULL,
    attachment_url TEXT NULL,
    attachment_name TEXT NULL,
    attachment_size INT NULL,
    attachment_mime TEXT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    read_at TIMESTAMPTZ NULL
);

CREATE INDEX IF NOT EXISTS idx_support_msg_conv ON public.support_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_support_msg_created ON public.support_messages(created_at);

-- 3. Technical Support Impersonation Sessions Table
CREATE TABLE IF NOT EXISTS public.support_impersonation_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_hash TEXT NOT NULL UNIQUE,
    super_admin_email TEXT NOT NULL,
    target_user_id TEXT NULL,
    target_wedding_id TEXT NULL,
    reason TEXT NOT NULL,
    access_level TEXT NOT NULL DEFAULT 'read_only', -- 'read_only', 'full_support'
    expires_at TIMESTAMPTZ NOT NULL,
    is_revoked BOOLEAN NOT NULL DEFAULT false,
    revoked_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_impersonation_token ON public.support_impersonation_sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_impersonation_expires ON public.support_impersonation_sessions(expires_at);

-- 4. Controlled Entitlement Overrides Table
CREATE TABLE IF NOT EXISTS public.entitlement_overrides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    feature_key TEXT NOT NULL, -- e.g. 'custom_domain', 'vip_templates', 'unlimited_guests', 'custom_music'
    override_value JSONB NOT NULL DEFAULT 'true'::jsonb,
    reason TEXT NOT NULL,
    granted_by TEXT NOT NULL DEFAULT 'Super Admin',
    expires_at TIMESTAMPTZ NULL, -- NULL = permanent override
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_overrides_wedding ON public.entitlement_overrides(wedding_id);
CREATE INDEX IF NOT EXISTS idx_overrides_feature ON public.entitlement_overrides(feature_key);

-- 5. Soft-Delete & Quarantine Support on Weddings Table
ALTER TABLE public.weddings
ADD COLUMN IF NOT EXISTS is_quarantined BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS quarantined_at TIMESTAMPTZ NULL,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ NULL,
ADD COLUMN IF NOT EXISTS deleted_by TEXT NULL,
ADD COLUMN IF NOT EXISTS deletion_reason TEXT NULL;

CREATE INDEX IF NOT EXISTS idx_weddings_quarantine ON public.weddings(is_quarantined);
CREATE INDEX IF NOT EXISTS idx_weddings_deleted_at ON public.weddings(deleted_at);

-- 6. Unified Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_type TEXT NOT NULL DEFAULT 'super_admin', -- 'super_admin', 'wedding_owner', 'system'
    actor_id TEXT NULL,
    actor_email TEXT NULL,
    action TEXT NOT NULL, -- e.g. 'site.settings.published', 'user.suspended', 'wedding.quarantined', 'impersonation.started'
    target_type TEXT NULL, -- 'user', 'wedding', 'domain', 'support', 'settings'
    target_id TEXT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT NULL,
    user_agent TEXT NULL,
    status TEXT NOT NULL DEFAULT 'success', -- 'success', 'failed', 'denied'
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_target ON public.audit_logs(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON public.audit_logs(created_at);

-- ============================================================
-- Row Level Security (RLS) Policies
-- ============================================================
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_impersonation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entitlement_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Site Settings: Public can read published configuration; only service_role can update
DROP POLICY IF EXISTS "Public Read Published Settings" ON public.site_settings;
CREATE POLICY "Public Read Published Settings" ON public.site_settings
    FOR SELECT TO anon, authenticated
    USING (is_published = true);

DROP POLICY IF EXISTS "Service Role Settings Manage" ON public.site_settings;
CREATE POLICY "Service Role Settings Manage" ON public.site_settings
    FOR ALL TO service_role
    USING (true);

-- Support Conversations & Messages: Protected service role and user access
DROP POLICY IF EXISTS "Service Role Support Conv Manage" ON public.support_conversations;
CREATE POLICY "Service Role Support Conv Manage" ON public.support_conversations
    FOR ALL TO service_role
    USING (true);

DROP POLICY IF EXISTS "Service Role Support Msg Manage" ON public.support_messages;
CREATE POLICY "Service Role Support Msg Manage" ON public.support_messages
    FOR ALL TO service_role
    USING (true);

-- Audit Logs & Impersonations: Strictly service_role
DROP POLICY IF EXISTS "Service Role Audit Logs" ON public.audit_logs;
CREATE POLICY "Service Role Audit Logs" ON public.audit_logs
    FOR ALL TO service_role
    USING (true);

DROP POLICY IF EXISTS "Service Role Impersonations" ON public.support_impersonation_sessions;
CREATE POLICY "Service Role Impersonations" ON public.support_impersonation_sessions
    FOR ALL TO service_role
    USING (true);

DROP POLICY IF EXISTS "Service Role Overrides" ON public.entitlement_overrides;
CREATE POLICY "Service Role Overrides" ON public.entitlement_overrides
    FOR ALL TO service_role
    USING (true);
