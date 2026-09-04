import fs from 'fs';
import path from 'path';

const AUDIT_DIR = path.join(process.cwd(), 'docs', 'audit');
if (!fs.existsSync(AUDIT_DIR)) {
  fs.mkdirSync(AUDIT_DIR, { recursive: true });
}

// 1. C13_W10_3_HOST_SURFACE_MATRIX.md
const hostSurfaceMatrix = `# C13 W10.3 Host Surface Matrix (Platform vs Custom Domain Isolation)

| Route / Path | Platform Host | Custom Domain | Auth Required | Methods | Rationale / Security Boundary |
| :--- | :--- | :--- | :--- | :--- | :--- |
| \`/\` | ALLOW (Marketing) | REWRITE (Invitation) | No | GET | Custom domain renders tenant invitation; platform renders global marketing |
| \`/[slug]\` | ALLOW | REWRITE | No | GET | Tenant public invitation landing page |
| \`/[slug]/admin\` | ALLOW | DENY (403) | Yes (Admin Cookie) | GET, POST | Administration surfaces are platform-only to prevent domain credential spoofing |
| \`/admin\` | ALLOW | DENY (403) | Yes (Admin Cookie) | GET | Platform admin entry |
| \`/super-admin\` | ALLOW | DENY (403) | Yes (SuperAdmin Session) | GET, POST | Super Admin command center strictly platform-only |
| \`/dashboard\` | ALLOW | DENY (403) | Yes (User Session) | GET | User account dashboard platform-only |
| \`/giris-yap\` | ALLOW | DENY (403) | No | GET | Authentication login platform-only |
| \`/kayit-ol\` | ALLOW | DENY (403) | No | GET | Registration platform-only |
| \`/onboarding\` | ALLOW | DENY (403) | Yes (User Session) | GET | Account onboarding platform-only |
| \`/odeme\` | ALLOW | DENY (403) | Yes (User Session) | GET | Billing checkout platform-only |
| \`/api/rsvp\` | ALLOW | ALLOW | Rate-Limited / Token | GET, POST | Public guest RSVP submission allowed on custom domain |
| \`/api/guestbook\` | ALLOW | ALLOW | Rate-Limited | GET, POST | Public guest messages allowed on custom domain |
| \`/api/checkin\` | ALLOW | ALLOW | Guest Token | POST | QR event check-in allowed on custom domain |
| \`/api/site-settings/public\` | ALLOW | ALLOW | No | GET | Public branding configuration |
| \`/api/health\` | ALLOW | ALLOW | No | GET | System health probe |
| \`/api/ready\` | ALLOW | ALLOW | No | GET | System readiness probe |
| \`/api/admin/*\` | ALLOW | DENY (403) | Yes (Admin Cookie) | ALL | Privileged admin APIs blocked on custom domains |
| \`/api/super-admin/*\` | ALLOW | DENY (403) | Yes (SuperAdmin Session) | ALL | Super admin mutations blocked on custom domains |
| \`/api/payments/*\` | ALLOW | DENY (403) | Yes (User Auth) | ALL | Payment checkouts blocked on custom domains |
| \`/api/user/*\` | ALLOW | DENY (403) | Yes (User Auth) | ALL | User account APIs blocked on custom domains |
| \`/api/support/*\` | ALLOW | DENY (403) | Rate-Limited | ALL | Support ticket submission routed via platform |
`;
fs.writeFileSync(path.join(AUDIT_DIR, 'C13_W10_3_HOST_SURFACE_MATRIX.md'), hostSurfaceMatrix, 'utf8');

// 2. C13_W10_3_SECURITY_FINDINGS.md
const securityFindings = `# C13 W10.3 Security Findings & Remediation Log

| Finding ID | Severity | File | Category | Description | Root Cause | Remediation / Fix Applied | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **SEC-P0-01** | **P0** | \`src/app/api/super-admin/auth/route.ts\` | Auth Bypass | Hardcoded \`admin123\` fallback password accepted and \`NEXT_PUBLIC_SUPERADMIN_PASSWORD\` checked. | Legacy developer testing fallback. | Removed \`admin123\`, removed public env vars, enforced timing-safe string comparison and fail-closed missing secret check. | **RESOLVED** |
| **SEC-P0-02** | **P0** | \`src/lib/superadmin-auth.ts\` | Session Security | Hardcoded literal secret fallback \`'super-admin-command-center-secret-2026'\` and unbounded session timestamp. | Default fallback in token signing. | Removed default secret; added random session nonce, 60s max clock skew, 12h validity, and timing-safe HMAC validation. | **RESOLVED** |
| **SEC-P0-03** | **P0** | \`src/proxy.ts\` | Boundary Bypass | External client sending \`x-proxy-rewritten: 1\` could bypass custom domain classification. | Trusting incoming loop prevention header before normalization. | Stripped client-supplied headers (\`x-proxy-rewritten\`, \`x-tenant-id\`, \`x-custom-domain\`) and enforced internal route validation. | **RESOLVED** |
| **SEC-P0-04** | **P0** | \`src/proxy.ts\` | Policy Exposure | Blanket \`pathname.startsWith('/api/')\` bypass allowed all APIs on custom domains except admin. | Overly permissive default API policy. | Implemented strict deny-by-default custom domain API policy with explicit public allowlist. | **RESOLVED** |
| **SEC-P0-05** | **P0** | \`src/app/api/admin/auth/route.ts\` | Credential Storage | Admin password comparison performed direct plaintext comparison (\`===\`). | Legacy DB schema comparison without hash abstraction. | Implemented scrypt cryptographic hashing (\`password-utils.ts\`), dual-mode verifier with auto-upgrade on login, and zero plaintext writes. | **RESOLVED** |
| **SEC-P0-06** | **P0** | \`src/lib/auth-cookie.ts\` | Key Separation | Reusing \`SUPABASE_SERVICE_ROLE_KEY\` for admin cookie HMAC signing. | Shared secret across different trust domains. | Introduced dedicated \`ADMIN_COOKIE_SECRET_V1\` with key rotation support and fail-closed production validation. | **RESOLVED** |
| **SEC-P0-07** | **P0** | \`src/lib/paymentProvider.ts\` | Fake Billing | Silent fallback to \`_testPaymentStore\` and fake checkout URL generation when DB/provider missing in production. | Test store active unconditionally. | Disabled in-memory test store in production; enforced \`503 BILLING_NOT_CONFIGURED\` when live credentials missing. | **RESOLVED** |
| **SEC-P0-08** | **P0** | \`src/app/api/payments/checkout/route.ts\` | Identity Spoof | Request body \`user_id\` accepted as authoritative billing identity; zero UUID fallback. | Missing server session requirement. | Derived user identity strictly from verified server auth session; verified wedding ownership before checkout. | **RESOLVED** |
| **SEC-P0-09** | **P0** | \`src/app/api/payments/webhook/route.ts\` | Webhook Security | Fallback secret \`'iyzico_secret_key_mock'\` used if env secret missing. | Test fallback in production webhook route. | Removed mock fallback; fails closed in production; timing-safe signature comparison enforced. | **RESOLVED** |
| **SEC-P0-10** | **P0** | \`src/lib/rateLimit.ts\` | Rate Limiting | In-memory rate limiting imported in production payment/guest routes. | Duplicate limiter architecture. | Consolidated all production endpoints to \`checkDistributedRateLimit\` (Postgres RPC / fail-closed). | **RESOLVED** |
| **SEC-P1-11** | **P1** | \`src/components/StickyWhatsAppCTA.tsx\` | Dead / Fake Data | WhatsApp widget with fake phone \`+90555...\` present in codebase. | Obsolete feature not fully removed. | Deleted \`StickyWhatsAppCTA.tsx\` and cleaned all WhatsApp production references. | **RESOLVED** |
| **SEC-P1-12** | **P1** | \`src/app/layout.tsx\` | SEO / Data Truth | Fake Levent address, 24/7 hours, fake phone, and \`google-site-verification-token\` in metadata. | Hardcoded initial template placeholders. | Removed fake LocalBusiness schema; emitted clean Organization/WebSite schema; dynamic verification metadata. | **RESOLVED** |
| **SEC-P1-13** | **P1** | \`src/app/page.tsx\` | CMS Hydration Flash | Entire homepage was client component fetching published settings in \`useEffect\`. | Initial CSR architecture. | Converted homepage to Server Component with published CMS SSR; eliminated external texture dependencies. | **RESOLVED** |
| **SEC-P1-14** | **P1** | \`next.config.ts\` | Build Suppression | \`typescript.ignoreBuildErrors: true\` suppressed build failures. | Legacy build bypass. | Removed build error suppression; natural compilation enforced. | **RESOLVED** |
| **SEC-P1-15** | **P1** | \`src/app/api/health/route.ts\` | Health Accuracy | Endpoint returned \`healthy: true\` unconditionally and hardcoded stale version \`1.0.0-c13.w9\`. | Static health response. | Updated to evaluate environment validity dynamically and reflect \`1.0.0-c13.w10.3\`. | **RESOLVED** |
`;
fs.writeFileSync(path.join(AUDIT_DIR, 'C13_W10_3_SECURITY_FINDINGS.md'), securityFindings, 'utf8');

console.log('Generated Host Surface Matrix and Security Findings.');
