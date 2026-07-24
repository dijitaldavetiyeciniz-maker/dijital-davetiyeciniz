-- Migration: PART 2 Payments, Plan Tiers & Timezone Schema

-- 1. Create Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    provider TEXT NOT NULL DEFAULT 'iyzico',
    provider_payment_id TEXT,
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'TRY',
    status TEXT NOT NULL DEFAULT 'pending', -- pending, processing, paid, failed, cancelled, refunded, partially_refunded
    idempotency_key TEXT UNIQUE,
    paid_at TIMESTAMPTZ,
    refunded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for payments
CREATE INDEX IF NOT EXISTS idx_payments_wedding_id ON public.payments(wedding_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_idempotency_key ON public.payments(idempotency_key);

-- 2. Add plan_tier to weddings if not present
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='weddings' AND column_name='plan_tier') THEN
        ALTER TABLE public.weddings ADD COLUMN plan_tier TEXT DEFAULT 'standard';
    END IF;
END $$;

-- 3. Enable RLS on Payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Payments Owner Select" ON public.payments;
DROP POLICY IF EXISTS "Payments Owner Insert" ON public.payments;

CREATE POLICY "Payments Owner Select" ON public.payments
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Payments Owner Insert" ON public.payments
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);
