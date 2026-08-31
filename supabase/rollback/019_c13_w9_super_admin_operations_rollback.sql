-- ============================================================
-- C13 W9 — SUPER ADMIN PLATFORM CONTROL CENTER ROLLBACK
-- Rollback: 019_c13_w9_super_admin_operations_rollback.sql
-- ============================================================

DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.entitlement_overrides CASCADE;
DROP TABLE IF EXISTS public.support_impersonation_sessions CASCADE;
DROP TABLE IF EXISTS public.support_messages CASCADE;
DROP TABLE IF EXISTS public.support_conversations CASCADE;
DROP TABLE IF EXISTS public.site_settings CASCADE;

ALTER TABLE public.weddings
DROP COLUMN IF EXISTS is_quarantined,
DROP COLUMN IF EXISTS quarantined_at,
DROP COLUMN IF EXISTS deleted_at,
DROP COLUMN IF EXISTS deleted_by,
DROP COLUMN IF EXISTS deletion_reason;
