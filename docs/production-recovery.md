# Production Operational & Disaster Recovery Runbook

## 1. System Architecture & Critical Datastores
- **Frontend & Serverless Edge**: Next.js 16 (App Router) on Vercel Production.
- **Database & Storage**: Supabase PostgreSQL + Row Level Security (RLS) + Storage Buckets.
- **Email Service**: Nodemailer over authenticated SMTP (service-role delivery auditing).
- **Payment Provider**: Iyzico Payment Gateway (Sandbox / Live Provider Abstraction with HMAC-SHA256 Webhook Verification).

---

## 2. Critical Database Tables Catalog
| Table Name | Purpose | Retention Policy | Backup Priority |
| :--- | :--- | :--- | :--- |
| `weddings` | Core invitation state, drafts, published snapshots, configurations | Permanent | Tier 1 (Critical) |
| `invitation_versions` | Immutable revision history and published snapshots | Permanent | Tier 1 (Critical) |
| `plans` | Canonical pricing tiers and feature entitlement configurations | Permanent | Tier 1 (Critical) |
| `user_subscriptions` | Active user memberships and billing period states | Permanent | Tier 1 (Critical) |
| `payments` | Financial transactions, idempotency keys, and refund logs | Permanent | Tier 1 (Critical) |
| `profiles` | User accounts, phone numbers, addresses, verification states | Permanent | Tier 1 (Critical) |
| `email_verifications` | OTP hashes, expiration, rate limiting counters | 30-day rolling purge | Tier 2 |
| `email_delivery_logs` | Audit trail for sent transactional emails | 90-day retention | Tier 2 |
| `security_events` | Security audit events and authentication alerts | Permanent | Tier 2 |
| `analytics_events` | Anonymized product funnel and conversion events | 180-day retention | Tier 3 |

---

## 3. Database Backup & Recovery Procedures
1. **Automated Backups**: Supabase performs daily physical backups and Point-In-Time Recovery (PITR) for Pro tiers.
2. **Manual Snapshot Export (Pre-Major Release)**:
   ```bash
   npx supabase db dump -f supabase/backups/snapshot_pre_deploy.sql --data-only
   ```
3. **Restoring to a Target Point in Time**:
   - Navigate to Supabase Dashboard -> Database -> Backups -> PITR.
   - Select the target timestamp prior to the incident and initiate restore.
   - Verify table integrity:
     ```sql
     SELECT count(*) FROM public.weddings WHERE is_published = true;
     SELECT count(*) FROM public.payments WHERE status = 'paid';
     ```

---

## 4. Migration & Schema Rollback Strategy
- All migrations are forward-compatible and numbered sequentially (`001` through `017`).
- Never delete or alter historical applied migrations.
- To rollback an unexpected schema defect:
  1. Prepare a new compensation migration (e.g. `018_revert_feature.sql`).
  2. Verify migration list and dry run:
     ```bash
     npx supabase migration list
     npx supabase db push --dry-run
     ```
  3. Apply migration:
     ```bash
     npx supabase db push --yes
     ```

---

## 5. Security Credentials Rotation Policy
In the event of suspected credential compromise:
1. **Supabase Service Role Key**: Rotate key in Supabase Dashboard -> API Settings -> Regenerate. Immediately update Vercel environment variables and trigger redeployment.
2. **SMTP App Password**: Generate new Google App Password -> Update `SMTP_PASS` in Vercel Production -> Trigger redeploy.
3. **Iyzico Webhook Secret**: Rotate webhook secret in Iyzico Merchant Portal -> Update `IYZICO_WEBHOOK_SECRET` in Vercel.
4. **Audit**: Inspect `security_events` table for unauthorized activities during the window.
