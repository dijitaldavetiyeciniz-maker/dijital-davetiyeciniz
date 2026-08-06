-- Create guest_rsvp_logs table
CREATE TABLE IF NOT EXISTS public.guest_rsvp_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_id UUID NOT NULL REFERENCES public.guests(id) ON DELETE CASCADE,
    old_status TEXT,
    new_status TEXT NOT NULL,
    changed_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.guest_rsvp_logs ENABLE ROW LEVEL SECURITY;

-- Grants
GRANT SELECT, INSERT ON public.guest_rsvp_logs TO anon, authenticated;
GRANT ALL ON public.guest_rsvp_logs TO service_role;

-- Policies
CREATE POLICY "GuestRsvpLogs Owner All" ON public.guest_rsvp_logs 
FOR ALL TO authenticated 
USING (
    guest_id IN (
        SELECT g.id FROM public.guests g 
        JOIN public.weddings w ON g.wedding_id = w.id 
        WHERE w.user_id = auth.uid()
    )
);

CREATE POLICY "Allow public insert for rsvp logs" ON public.guest_rsvp_logs
FOR INSERT TO public
WITH CHECK (true);

-- Trigger function
CREATE OR REPLACE FUNCTION public.log_guest_rsvp_change()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.guest_rsvp_logs (guest_id, old_status, new_status)
    VALUES (NEW.id, OLD.rsvp_status, NEW.rsvp_status);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
DROP TRIGGER IF EXISTS tr_guest_rsvp_change ON public.guests;
CREATE TRIGGER tr_guest_rsvp_change
    AFTER UPDATE ON public.guests
    FOR EACH ROW
    WHEN (OLD.rsvp_status IS DISTINCT FROM NEW.rsvp_status)
    EXECUTE FUNCTION public.log_guest_rsvp_change();
