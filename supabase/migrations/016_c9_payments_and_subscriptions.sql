-- ============================================================
-- Migration 016: C9 Payments, Plans & Subscriptions Foundation
-- ============================================================

-- 1. Create Plans Table
CREATE TABLE IF NOT EXISTS public.plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    currency TEXT NOT NULL DEFAULT 'TRY',
    billing_type TEXT NOT NULL DEFAULT 'one_time', -- 'one_time', 'monthly', 'yearly'
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INT NOT NULL DEFAULT 0,
    features JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create User Subscriptions Table
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES public.plans(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'active', -- active, pending, canceled, expired, failed
    provider_customer_id TEXT,
    provider_subscription_id TEXT,
    started_at TIMESTAMPTZ DEFAULT now(),
    current_period_start TIMESTAMPTZ DEFAULT now(),
    current_period_end TIMESTAMPTZ,
    canceled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON public.user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_plans_code ON public.plans(code);
CREATE INDEX IF NOT EXISTS idx_plans_is_active ON public.plans(is_active);

-- 3. Enhance Payments Table with plan_id and metadata if missing
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='payments' AND column_name='plan_id') THEN
        ALTER TABLE public.payments ADD COLUMN plan_id UUID REFERENCES public.plans(id) ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='payments' AND column_name='metadata') THEN
        ALTER TABLE public.payments ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='current_plan_tier') THEN
        ALTER TABLE public.profiles ADD COLUMN current_plan_tier TEXT DEFAULT 'standard';
    END IF;
END $$;

-- 4. Seed Canonical Plans (Idempotent)
INSERT INTO public.plans (code, name, description, price, currency, billing_type, is_active, sort_order, features)
VALUES 
    (
        'standard',
        'Standart Taslak Paketi',
        'Tüm şablonları ücretsiz oluşturun ve önizleyin.',
        0.00,
        'TRY',
        'one_time',
        true,
        1,
        '{"max_photos": 10, "max_audio_mb": 5, "allowed_templates": "standard", "allow_custom_domain": false, "allow_remove_watermark": false, "allow_qr_checkin": false, "allow_corporate_modules": false}'::jsonb
    ),
    (
        'premium',
        'Her Şey Dahil Premium Paket',
        '120+ Şablon, özel açılış animasyonları, anlık LCV ve sınırsız yayın.',
        1999.00,
        'TRY',
        'one_time',
        true,
        2,
        '{"max_photos": 50, "max_audio_mb": 15, "allowed_templates": "all", "allow_custom_domain": true, "allow_remove_watermark": true, "allow_qr_checkin": true, "allow_corporate_modules": false}'::jsonb
    ),
    (
        'corporate',
        'Kurumsal Etkinlik Paketi',
        'Çoklu etkinlik akışları, VIP masa planı, özel alan adı ve kurumsal paneller.',
        4999.00,
        'TRY',
        'one_time',
        true,
        3,
        '{"max_photos": 200, "max_audio_mb": 50, "allowed_templates": "all", "allow_custom_domain": true, "allow_remove_watermark": true, "allow_qr_checkin": true, "allow_corporate_modules": true}'::jsonb
    )
ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    features = EXCLUDED.features,
    is_active = EXCLUDED.is_active,
    sort_order = EXCLUDED.sort_order;

-- 5. RLS Security Configuration
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Plans: Public readable, service_role full
DROP POLICY IF EXISTS "Plans Public Read" ON public.plans;
CREATE POLICY "Plans Public Read" ON public.plans
    FOR SELECT TO anon, authenticated
    USING (is_active = true);

DROP POLICY IF EXISTS "Plans Service Role" ON public.plans;
CREATE POLICY "Plans Service Role" ON public.plans
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- User Subscriptions: Owner read, service_role full
DROP POLICY IF EXISTS "Subscriptions Owner Select" ON public.user_subscriptions;
CREATE POLICY "Subscriptions Owner Select" ON public.user_subscriptions
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Subscriptions Service Role" ON public.user_subscriptions;
CREATE POLICY "Subscriptions Service Role" ON public.user_subscriptions
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- Payments: Owner select/insert, service_role full
DROP POLICY IF EXISTS "Payments Owner Select" ON public.payments;
CREATE POLICY "Payments Owner Select" ON public.payments
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Payments Service Role" ON public.payments;
CREATE POLICY "Payments Service Role" ON public.payments
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- Grants
GRANT SELECT ON public.plans TO anon, authenticated;
GRANT SELECT ON public.user_subscriptions TO authenticated;
GRANT SELECT, INSERT ON public.payments TO authenticated;
GRANT ALL ON public.plans TO service_role;
GRANT ALL ON public.user_subscriptions TO service_role;
GRANT ALL ON public.payments TO service_role;
