# C13 W10.3 Host Surface Matrix (Platform vs Custom Domain Isolation)

| Route / Path | Platform Host | Custom Domain | Auth Required | Methods | Rationale / Security Boundary |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/` | ALLOW (Marketing) | REWRITE (Invitation) | No | GET | Custom domain renders tenant invitation; platform renders global marketing |
| `/[slug]` | ALLOW | REWRITE | No | GET | Tenant public invitation landing page |
| `/[slug]/admin` | ALLOW | DENY (403) | Yes (Admin Cookie) | GET, POST | Administration surfaces are platform-only to prevent domain credential spoofing |
| `/admin` | ALLOW | DENY (403) | Yes (Admin Cookie) | GET | Platform admin entry |
| `/super-admin` | ALLOW | DENY (403) | Yes (SuperAdmin Session) | GET, POST | Super Admin command center strictly platform-only |
| `/dashboard` | ALLOW | DENY (403) | Yes (User Session) | GET | User account dashboard platform-only |
| `/giris-yap` | ALLOW | DENY (403) | No | GET | Authentication login platform-only |
| `/kayit-ol` | ALLOW | DENY (403) | No | GET | Registration platform-only |
| `/onboarding` | ALLOW | DENY (403) | Yes (User Session) | GET | Account onboarding platform-only |
| `/odeme` | ALLOW | DENY (403) | Yes (User Session) | GET | Billing checkout platform-only |
| `/api/rsvp` | ALLOW | ALLOW | Rate-Limited / Token | GET, POST | Public guest RSVP submission allowed on custom domain |
| `/api/guestbook` | ALLOW | ALLOW | Rate-Limited | GET, POST | Public guest messages allowed on custom domain |
| `/api/checkin` | ALLOW | ALLOW | Guest Token | POST | QR event check-in allowed on custom domain |
| `/api/site-settings/public` | ALLOW | ALLOW | No | GET | Public branding configuration |
| `/api/health` | ALLOW | ALLOW | No | GET | System health probe |
| `/api/ready` | ALLOW | ALLOW | No | GET | System readiness probe |
| `/api/admin/*` | ALLOW | DENY (403) | Yes (Admin Cookie) | ALL | Privileged admin APIs blocked on custom domains |
| `/api/super-admin/*` | ALLOW | DENY (403) | Yes (SuperAdmin Session) | ALL | Super admin mutations blocked on custom domains |
| `/api/payments/*` | ALLOW | DENY (403) | Yes (User Auth) | ALL | Payment checkouts blocked on custom domains |
| `/api/user/*` | ALLOW | DENY (403) | Yes (User Auth) | ALL | User account APIs blocked on custom domains |
| `/api/support/*` | ALLOW | DENY (403) | Rate-Limited | ALL | Support ticket submission routed via platform |
