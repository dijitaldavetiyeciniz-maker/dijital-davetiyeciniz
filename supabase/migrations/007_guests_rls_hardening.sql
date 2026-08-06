-- Drop existing loose policies if they exist (except the baseline public ones that we need)
DROP POLICY IF EXISTS "Guests Owner All" ON public.guests;
DROP POLICY IF EXISTS "GuestGroups Owner All" ON public.guest_groups;

-- Create hardened policies for guests table
-- Only allow authenticated users to perform ALL actions (SELECT, INSERT, UPDATE, DELETE) 
-- on guests if they own the associated wedding.
CREATE POLICY "Guests Owner All Hardened" ON public.guests 
FOR ALL TO authenticated 
USING (
    wedding_id IN (SELECT id FROM public.weddings WHERE user_id = auth.uid())
)
WITH CHECK (
    wedding_id IN (SELECT id FROM public.weddings WHERE user_id = auth.uid())
);

-- Create hardened policies for guest_groups table
-- Only allow authenticated users to perform ALL actions (SELECT, INSERT, UPDATE, DELETE)
-- on guest_groups if they own the associated wedding.
CREATE POLICY "GuestGroups Owner All Hardened" ON public.guest_groups 
FOR ALL TO authenticated 
USING (
    wedding_id IN (SELECT id FROM public.weddings WHERE user_id = auth.uid())
)
WITH CHECK (
    wedding_id IN (SELECT id FROM public.weddings WHERE user_id = auth.uid())
);
