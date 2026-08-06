-- Phase 2: RLS Hardening for check_ins and unique constraint

-- Drop existing loose policy
DROP POLICY IF EXISTS "CheckIns Owner All" ON public.check_ins;

-- Create hardened policy
CREATE POLICY "CheckIns Owner All Hardened" ON public.check_ins 
FOR ALL TO authenticated 
USING (
    wedding_id IN (SELECT id FROM public.weddings WHERE user_id = auth.uid())
)
WITH CHECK (
    wedding_id IN (SELECT id FROM public.weddings WHERE user_id = auth.uid())
);

-- Fix race condition for check-ins when event_id is NULL
CREATE UNIQUE INDEX IF NOT EXISTS idx_check_ins_single_event ON public.check_ins(guest_id) WHERE event_id IS NULL;
