# C13 W10.3 API Authorization & Security Matrix

| Endpoint | Method | Security Scope | Auth Mechanism | Ownership Check | Rate Limiting | CSRF Strategy | Cache Policy |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/api/admin/auth` | `POST` | PUBLIC_CREDENTIAL | Wedding Identifier + Password | DB scrypt match | IP + Wedding (10/5m) | SameSite=Lax Cookie | `no-store` |
| `/api/admin/verify` | `POST` | ADMIN | Signed HMAC Cookie | Wedding ID in token payload | Distributed RPC | HttpOnly SameSite=Lax | `no-store` |
| `/api/admin/logout` | `POST` | ADMIN | None (Clears session) | N/A | N/A | SameSite=Lax | `no-store` |
| `/api/admin/content` | `POST` | ADMIN | Signed Admin Cookie / User Auth | Wedding ID Ownership | Distributed RPC | Verified Session | `no-store` |
| `/api/super-admin/auth` | `POST` | SUPERADMIN_CREDENTIAL | Server SUPERADMIN_PASSWORD | Server Environment Key | IP (5/5m Distributed RPC) | SameSite=Lax Cookie | `no-store` |
| `/api/super-admin/logout` | `POST` | SUPERADMIN | None (Clears session) | N/A | N/A | SameSite=Lax | `no-store` |
| `/api/super-admin/site-settings` | `GET, POST, PUT` | SUPERADMIN | Signed SuperAdmin Session Cookie | Super Admin Token | Distributed RPC | HttpOnly SameSite=Lax | `no-store` |
| `/api/super-admin/system-status` | `GET` | SUPERADMIN | Signed SuperAdmin Session Cookie | Super Admin Token | Distributed RPC | HttpOnly SameSite=Lax | `no-store` |
| `/api/super-admin/support` | `GET, POST, PATCH` | SUPERADMIN | Signed SuperAdmin Session Cookie | Super Admin Token | Distributed RPC | HttpOnly SameSite=Lax | `no-store` |
| `/api/super-admin/data-cleanup` | `POST` | SUPERADMIN | Signed SuperAdmin Session Cookie | Super Admin Token + Dry Run Guard | Distributed RPC | HttpOnly SameSite=Lax | `no-store` |
| `/api/payments/checkout` | `POST` | USER_AUTHENTICATED | Server Supabase User Session / Bearer | Wedding User ID == Session User ID | IP (10/1m Distributed RPC) | Bearer Header / Session | `no-store` |
| `/api/payments/webhook` | `POST` | PROVIDER_WEBHOOK | Timing-Safe HMAC-SHA256 Signature | Iyzico Merchant Webhook Secret | Distributed RPC | Webhook Signature Header | `no-store` |
| `/api/payments/refund` | `POST` | USER_AUTHENTICATED | Server Supabase User Session | Payment User ID == Session User ID | Distributed RPC | Bearer Header / Session | `no-store` |
| `/api/payments/status` | `GET` | USER_AUTHENTICATED | Server Supabase User Session | Wedding User ID == Session User ID | Distributed RPC | Bearer Header / Session | `no-store` |
| `/api/support/conversations` | `POST` | PUBLIC / USER | Optional Server User Session | Server-derived user_id (null for guests) | IP (5/5m Distributed RPC) | JSON / Schema | `no-store` |
| `/api/support/messages` | `POST` | PUBLIC / USER | Optional Server User Session | Server-derived user_id (null for guests) | IP (5/5m Distributed RPC) | JSON / Schema | `no-store` |
| `/api/guests` | `GET, POST` | ADMIN / USER | User Session / Admin Cookie | Wedding Ownership Verified | IP (60/1m Distributed RPC) | Cookie / Bearer | `private, no-store` |
| `/api/rsvp` | `GET, POST` | PUBLIC_GUEST | Public / Guest Token | Wedding Slug / Token Scoped | IP + Honeypot Anti-Spam | Schema / Public | `no-store` |
| `/api/guestbook` | `GET, POST` | PUBLIC_GUEST | Public / Moderation Token | Wedding Slug / Token Scoped | IP + Honeypot Anti-Spam | Schema / Public | `no-store` |
| `/api/checkin` | `POST` | PUBLIC_GUEST | Public Guest Token | Token Cryptographic Verification | Distributed RPC | Token Payload | `no-store` |
| `/api/site-settings/public` | `GET` | PUBLIC | None | Published Config Only | Public Edge Cache | N/A | `s-maxage=60, stale-while-revalidate=300` |
| `/api/health` | `GET` | PUBLIC_PROBE | None | N/A | N/A | N/A | `no-store` |
| `/api/ready` | `GET` | PUBLIC_PROBE | None | N/A | N/A | N/A | `no-store` |
