-- 004_part5a_guest_security_rollback.sql

DROP INDEX IF EXISTS public.idx_guests_public_id;

ALTER TABLE public.guests
DROP COLUMN IF EXISTS public_id,
DROP COLUMN IF EXISTS token_revoked_at,
DROP COLUMN IF EXISTS token_expires_at,
DROP COLUMN IF EXISTS deleted_at;

ALTER TABLE public.guests DROP CONSTRAINT IF EXISTS guests_token_version_check;
