-- Historical schema reconciliation: Drop deprecated and unused guestbook_entries table.
-- The guestbook feature was refactored to read messages directly from the rsvps table.
DROP TABLE IF EXISTS public.guestbook_entries CASCADE;
