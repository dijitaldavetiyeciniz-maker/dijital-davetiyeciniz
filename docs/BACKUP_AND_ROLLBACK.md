# Backup, Migration & Rollback Procedures

## 1. Database Backup Procedure
- Daily automated WAL-G / pg_dump backups configured on Supabase Dashboard.
- Pre-migration manual snapshot command:
  ```bash
  supabase db dump --data-only -f supabase/backups/backup_$(date +%Y%m%d_%H%M%S).sql
  ```

## 2. Migration Rollback Procedure
- If a migration fails in Staging or Production:
  1. Identify migration timestamp ID in `supabase/migrations/`.
  2. Execute corresponding revert script in `supabase/migrations/reverts/`.
  3. Flush schema cache:
     ```sql
     NOTIFY pgrst, 'reload schema';
     ```

## 3. Storage & Asset Rollback
- Media files in `wedding-photos` bucket follow immutable UUID naming patterns.
- Orphaned or failed upload logs are persisted in `failed_uploads` table for automated retry or cleanup.

## 4. Deployment Rollback Procedure
- Next.js deployments on Vercel/Netlify support instant one-click rollback to the previous green commit hash (`6776f3f`).
