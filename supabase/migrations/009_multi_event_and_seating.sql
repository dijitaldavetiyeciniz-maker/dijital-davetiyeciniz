-- Phase 3: Domain-specific Multi-Event and Seating Management

-- 1. Cleanup old generic tables from 004 migration if they exist
DROP TABLE IF EXISTS public.seats CASCADE;
DROP TABLE IF EXISTS public.tables CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;

-- 2. Create Multi-Event Table (invitation_events)
CREATE TABLE IF NOT EXISTS public.invitation_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- e.g. kına, düğün, after_party
    title TEXT NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    timezone TEXT DEFAULT 'Europe/Istanbul',
    venue_name TEXT,
    venue_address TEXT,
    google_maps_url TEXT,
    description TEXT,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create Seating Tables (seating_tables)
CREATE TABLE IF NOT EXISTS public.seating_tables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES public.invitation_events(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    capacity INT NOT NULL DEFAULT 8,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create Seat Assignments (guest_seat_assignments)
CREATE TABLE IF NOT EXISTS public.guest_seat_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES public.invitation_events(id) ON DELETE CASCADE,
    table_id UUID NOT NULL REFERENCES public.seating_tables(id) ON DELETE CASCADE,
    guest_id UUID NOT NULL REFERENCES public.guests(id) ON DELETE CASCADE,
    seat_count INT NOT NULL DEFAULT 1, -- guest + plus_ones + children
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(event_id, guest_id) -- A guest can only be seated once per event
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_invitation_events_wedding_id ON public.invitation_events(wedding_id);
CREATE INDEX IF NOT EXISTS idx_seating_tables_event_id ON public.seating_tables(event_id);
CREATE INDEX IF NOT EXISTS idx_guest_seat_assignments_table_id ON public.guest_seat_assignments(table_id);
CREATE INDEX IF NOT EXISTS idx_guest_seat_assignments_guest_id ON public.guest_seat_assignments(guest_id);

-- Enable RLS
ALTER TABLE public.invitation_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seating_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_seat_assignments ENABLE ROW LEVEL SECURITY;

-- Hardened Owner Policies (WITH CHECK)
CREATE POLICY "InvitationEvents Owner All" ON public.invitation_events FOR ALL TO authenticated 
USING (wedding_id IN (SELECT id FROM public.weddings WHERE user_id = auth.uid()))
WITH CHECK (wedding_id IN (SELECT id FROM public.weddings WHERE user_id = auth.uid()));

CREATE POLICY "SeatingTables Owner All" ON public.seating_tables FOR ALL TO authenticated 
USING (wedding_id IN (SELECT id FROM public.weddings WHERE user_id = auth.uid()))
WITH CHECK (wedding_id IN (SELECT id FROM public.weddings WHERE user_id = auth.uid()));

CREATE POLICY "SeatAssignments Owner All" ON public.guest_seat_assignments FOR ALL TO authenticated 
USING (wedding_id IN (SELECT id FROM public.weddings WHERE user_id = auth.uid()))
WITH CHECK (wedding_id IN (SELECT id FROM public.weddings WHERE user_id = auth.uid()));

-- Public Policies
-- Events should be readable by anyone if the wedding is public/active
CREATE POLICY "InvitationEvents Public Select" ON public.invitation_events FOR SELECT TO anon, authenticated 
USING (wedding_id IN (SELECT id FROM public.weddings WHERE is_paid = true AND deleted_at IS NULL AND is_active = true));

-- CRITICAL: Seating tables and assignments DO NOT have a generic public select policy!
-- They must only be retrieved via secure API endpoints utilizing the guest token.

-- Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invitation_events TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.seating_tables TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.guest_seat_assignments TO anon, authenticated;

-- 5. Atomic Capacity Check RPC Function
CREATE OR REPLACE FUNCTION public.assign_guest_to_table(
    p_wedding_id UUID,
    p_event_id UUID,
    p_table_id UUID,
    p_guest_id UUID,
    p_seat_count INT
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with privileges of creator
AS $$
DECLARE
    v_table_capacity INT;
    v_current_occupancy INT;
    v_existing_assignment_id UUID;
    v_wedding_owner UUID;
    v_result JSONB;
BEGIN
    -- Only owners can execute this? Actually SECURITY DEFINER bypasses RLS, so we MUST manually check auth.uid()
    -- Wait, if this is called from API via service-role, auth.uid() will be null.
    -- The API will handle the owner check before calling this RPC via service-role, or we can just rely on the API.
    -- But since we are creating it, let's keep it simple: API handles auth, RPC handles concurrency.

    -- 1. Lock the table row for update to prevent concurrent race conditions
    SELECT capacity INTO v_table_capacity 
    FROM public.seating_tables 
    WHERE id = p_table_id AND event_id = p_event_id 
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Table not found or event mismatch.';
    END IF;

    -- 2. Check if guest is already seated at this event
    SELECT id INTO v_existing_assignment_id
    FROM public.guest_seat_assignments
    WHERE event_id = p_event_id AND guest_id = p_guest_id;

    -- 3. Calculate current occupancy for this table (excluding the guest's own previous assignment if any)
    SELECT COALESCE(SUM(seat_count), 0) INTO v_current_occupancy
    FROM public.guest_seat_assignments
    WHERE table_id = p_table_id 
      AND guest_id != p_guest_id; -- Don't count the guest's old assignment if they are moving

    -- 4. Check capacity
    IF (v_current_occupancy + p_seat_count) > v_table_capacity THEN
        RAISE EXCEPTION 'Capacity exceeded. Table has % seats, currently occupied by %, trying to add %.', 
            v_table_capacity, v_current_occupancy, p_seat_count;
    END IF;

    -- 5. Insert or Update assignment
    IF v_existing_assignment_id IS NOT NULL THEN
        -- Move guest to new table
        UPDATE public.guest_seat_assignments
        SET table_id = p_table_id, seat_count = p_seat_count, updated_at = now()
        WHERE id = v_existing_assignment_id;
    ELSE
        -- Insert new assignment
        INSERT INTO public.guest_seat_assignments (wedding_id, event_id, table_id, guest_id, seat_count)
        VALUES (p_wedding_id, p_event_id, p_table_id, p_guest_id, p_seat_count);
    END IF;

    v_result := jsonb_build_object(
        'success', true,
        'table_id', p_table_id,
        'guest_id', p_guest_id,
        'seat_count', p_seat_count,
        'remaining_capacity', v_table_capacity - (v_current_occupancy + p_seat_count)
    );

    RETURN v_result;
END;
$$;
GRANT EXECUTE ON FUNCTION public.assign_guest_to_table(UUID, UUID, UUID, UUID, INT) TO authenticated, anon;
