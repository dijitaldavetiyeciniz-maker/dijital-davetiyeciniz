-- 004_part5a_guest_security.sql
-- Implements secure public_id, token tracking, and soft deletes for guests

-- Add new secure columns to guests table
ALTER TABLE public.guests
ADD COLUMN IF NOT EXISTS public_id UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
ADD COLUMN IF NOT EXISTS token_revoked_at TIMESTAMPTZ NULL,
ADD COLUMN IF NOT EXISTS token_expires_at TIMESTAMPTZ NULL,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ NULL;

-- Ensure token_version is strictly positive
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.check_constraints
        WHERE constraint_name = 'guests_token_version_check'
    ) THEN
        ALTER TABLE public.guests ADD CONSTRAINT guests_token_version_check CHECK (token_version > 0);
    END IF;
END $$;

-- Drop is_revoked column if it exists, since we use token_revoked_at now
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'guests' AND column_name = 'is_revoked'
    ) THEN
        ALTER TABLE public.guests DROP COLUMN is_revoked;
    END IF;
END $$;

-- Index for public_id to allow fast lookups by token payload
CREATE INDEX IF NOT EXISTS idx_guests_public_id ON public.guests(public_id);
