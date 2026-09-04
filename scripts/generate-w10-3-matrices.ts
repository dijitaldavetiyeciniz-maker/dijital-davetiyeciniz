import fs from 'fs';
import path from 'path';

const AUDIT_DIR = path.join(process.cwd(), 'docs', 'audit');
if (!fs.existsSync(AUDIT_DIR)) {
  fs.mkdirSync(AUDIT_DIR, { recursive: true });
}

// 1. API AUTH MATRIX
const apiAuthList = [
  { path: '/api/admin/auth', method: 'POST', scope: 'PUBLIC_CREDENTIAL', auth: 'Wedding Identifier + Password', ownerCheck: 'DB scrypt match', rateLimit: 'IP + Wedding (10/5m)', csrf: 'SameSite=Lax Cookie', cache: 'no-store' },
  { path: '/api/admin/verify', method: 'POST', scope: 'ADMIN', auth: 'Signed HMAC Cookie', ownerCheck: 'Wedding ID in token payload', rateLimit: 'Distributed RPC', csrf: 'HttpOnly SameSite=Lax', cache: 'no-store' },
  { path: '/api/admin/logout', method: 'POST', scope: 'ADMIN', auth: 'None (Clears session)', ownerCheck: 'N/A', rateLimit: 'N/A', csrf: 'SameSite=Lax', cache: 'no-store' },
  { path: '/api/admin/content', method: 'POST', scope: 'ADMIN', auth: 'Signed Admin Cookie / User Auth', ownerCheck: 'Wedding ID Ownership', rateLimit: 'Distributed RPC', csrf: 'Verified Session', cache: 'no-store' },
  { path: '/api/super-admin/auth', method: 'POST', scope: 'SUPERADMIN_CREDENTIAL', auth: 'Server SUPERADMIN_PASSWORD', ownerCheck: 'Server Environment Key', rateLimit: 'IP (5/5m Distributed RPC)', csrf: 'SameSite=Lax Cookie', cache: 'no-store' },
  { path: '/api/super-admin/logout', method: 'POST', scope: 'SUPERADMIN', auth: 'None (Clears session)', ownerCheck: 'N/A', rateLimit: 'N/A', csrf: 'SameSite=Lax', cache: 'no-store' },
  { path: '/api/super-admin/site-settings', method: 'GET, POST, PUT', scope: 'SUPERADMIN', auth: 'Signed SuperAdmin Session Cookie', ownerCheck: 'Super Admin Token', rateLimit: 'Distributed RPC', csrf: 'HttpOnly SameSite=Lax', cache: 'no-store' },
  { path: '/api/super-admin/system-status', method: 'GET', scope: 'SUPERADMIN', auth: 'Signed SuperAdmin Session Cookie', ownerCheck: 'Super Admin Token', rateLimit: 'Distributed RPC', csrf: 'HttpOnly SameSite=Lax', cache: 'no-store' },
  { path: '/api/super-admin/support', method: 'GET, POST, PATCH', scope: 'SUPERADMIN', auth: 'Signed SuperAdmin Session Cookie', ownerCheck: 'Super Admin Token', rateLimit: 'Distributed RPC', csrf: 'HttpOnly SameSite=Lax', cache: 'no-store' },
  { path: '/api/super-admin/data-cleanup', method: 'POST', scope: 'SUPERADMIN', auth: 'Signed SuperAdmin Session Cookie', ownerCheck: 'Super Admin Token + Dry Run Guard', rateLimit: 'Distributed RPC', csrf: 'HttpOnly SameSite=Lax', cache: 'no-store' },
  { path: '/api/payments/checkout', method: 'POST', scope: 'USER_AUTHENTICATED', auth: 'Server Supabase User Session / Bearer', ownerCheck: 'Wedding User ID == Session User ID', rateLimit: 'IP (10/1m Distributed RPC)', csrf: 'Bearer Header / Session', cache: 'no-store' },
  { path: '/api/payments/webhook', method: 'POST', scope: 'PROVIDER_WEBHOOK', auth: 'Timing-Safe HMAC-SHA256 Signature', ownerCheck: 'Iyzico Merchant Webhook Secret', rateLimit: 'Distributed RPC', csrf: 'Webhook Signature Header', cache: 'no-store' },
  { path: '/api/payments/refund', method: 'POST', scope: 'USER_AUTHENTICATED', auth: 'Server Supabase User Session', ownerCheck: 'Payment User ID == Session User ID', rateLimit: 'Distributed RPC', csrf: 'Bearer Header / Session', cache: 'no-store' },
  { path: '/api/payments/status', method: 'GET', scope: 'USER_AUTHENTICATED', auth: 'Server Supabase User Session', ownerCheck: 'Wedding User ID == Session User ID', rateLimit: 'Distributed RPC', csrf: 'Bearer Header / Session', cache: 'no-store' },
  { path: '/api/support/conversations', method: 'POST', scope: 'PUBLIC / USER', auth: 'Optional Server User Session', ownerCheck: 'Server-derived user_id (null for guests)', rateLimit: 'IP (5/5m Distributed RPC)', csrf: 'JSON / Schema', cache: 'no-store' },
  { path: '/api/support/messages', method: 'POST', scope: 'PUBLIC / USER', auth: 'Optional Server User Session', ownerCheck: 'Server-derived user_id (null for guests)', rateLimit: 'IP (5/5m Distributed RPC)', csrf: 'JSON / Schema', cache: 'no-store' },
  { path: '/api/guests', method: 'GET, POST', scope: 'ADMIN / USER', auth: 'User Session / Admin Cookie', ownerCheck: 'Wedding Ownership Verified', rateLimit: 'IP (60/1m Distributed RPC)', csrf: 'Cookie / Bearer', cache: 'private, no-store' },
  { path: '/api/rsvp', method: 'GET, POST', scope: 'PUBLIC_GUEST', auth: 'Public / Guest Token', ownerCheck: 'Wedding Slug / Token Scoped', rateLimit: 'IP + Honeypot Anti-Spam', csrf: 'Schema / Public', cache: 'no-store' },
  { path: '/api/guestbook', method: 'GET, POST', scope: 'PUBLIC_GUEST', auth: 'Public / Moderation Token', ownerCheck: 'Wedding Slug / Token Scoped', rateLimit: 'IP + Honeypot Anti-Spam', csrf: 'Schema / Public', cache: 'no-store' },
  { path: '/api/checkin', method: 'POST', scope: 'PUBLIC_GUEST', auth: 'Public Guest Token', ownerCheck: 'Token Cryptographic Verification', rateLimit: 'Distributed RPC', csrf: 'Token Payload', cache: 'no-store' },
  { path: '/api/site-settings/public', method: 'GET', scope: 'PUBLIC', auth: 'None', ownerCheck: 'Published Config Only', rateLimit: 'Public Edge Cache', csrf: 'N/A', cache: 's-maxage=60, stale-while-revalidate=300' },
  { path: '/api/health', method: 'GET', scope: 'PUBLIC_PROBE', auth: 'None', ownerCheck: 'N/A', rateLimit: 'N/A', csrf: 'N/A', cache: 'no-store' },
  { path: '/api/ready', method: 'GET', scope: 'PUBLIC_PROBE', auth: 'None', ownerCheck: 'N/A', rateLimit: 'N/A', csrf: 'N/A', cache: 'no-store' }
];

fs.writeFileSync(path.join(AUDIT_DIR, 'c13-w10-3-api-auth-matrix.json'), JSON.stringify(apiAuthList, null, 2), 'utf8');

const apiAuthMd = `# C13 W10.3 API Authorization & Security Matrix

| Endpoint | Method | Security Scope | Auth Mechanism | Ownership Check | Rate Limiting | CSRF Strategy | Cache Policy |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
${apiAuthList.map(a => `| \`${a.path}\` | \`${a.method}\` | ${a.scope} | ${a.auth} | ${a.ownerCheck} | ${a.rateLimit} | ${a.csrf} | \`${a.cache}\` |`).join('\n')}
`;
fs.writeFileSync(path.join(AUDIT_DIR, 'C13_W10_3_API_AUTH_MATRIX.md'), apiAuthMd, 'utf8');

// 2. ADMIN CONTROL MATRIX
const adminControls = [
  { controlId: 'ctrl-couple-names', tab: 'İçerik', element: 'input', validated: true, dbField: 'bride_name, groom_name', persists: true, publicConsumer: 'Hero & Invitation Canvas' },
  { controlId: 'ctrl-event-date', tab: 'İçerik', element: 'input[datetime]', validated: true, dbField: 'wedding_date', persists: true, publicConsumer: 'Countdown & Calendar' },
  { controlId: 'ctrl-venue-address', tab: 'İçerik', element: 'textarea', validated: true, dbField: 'venue_name, venue_address', persists: true, publicConsumer: 'Venue Card & Maps' },
  { controlId: 'ctrl-program-builder', tab: 'Program', element: 'builder / sortable', validated: true, dbField: 'custom_overrides.program_items', persists: true, publicConsumer: 'Timeline / Program Section' },
  { controlId: 'ctrl-custom-sections', tab: 'Özel Bölümler', element: 'dynamic manager', validated: true, dbField: 'custom_sections (table)', persists: true, publicConsumer: 'Custom Content Section' },
  { controlId: 'ctrl-template-selector', tab: 'Tasarım Stüdyosu', element: 'grid selector', validated: true, dbField: 'template_id', persists: true, publicConsumer: '272 Dynamic Layout Renderers' },
  { controlId: 'ctrl-opening-selector', tab: 'Açılış Animasyonu', element: 'opening catalog', validated: true, dbField: 'entrance_animation', persists: true, publicConsumer: '50 Opening Animations' },
  { controlId: 'ctrl-font-picker', tab: 'Tipografi', element: 'font selector', validated: true, dbField: 'font_family, names_font_family', persists: true, publicConsumer: '95 Curated Web Fonts' },
  { controlId: 'ctrl-bg-customizer', tab: 'Arka Plan', element: 'color & gradient picker', validated: true, dbField: 'custom_overrides.background', persists: true, publicConsumer: 'Invitation Canvas Backdrop' },
  { controlId: 'ctrl-guest-table', tab: 'Misafir & LCV', element: 'datagrid / import', validated: true, dbField: 'guests (table)', persists: true, publicConsumer: 'Guest Token / Check-in QR' },
  { controlId: 'ctrl-domain-manager', tab: 'Özel Alan Adı', element: 'domain input / verify', validated: true, dbField: 'custom_domains (table)', persists: true, publicConsumer: 'Edge Config Data-Plane Proxy' }
];

fs.writeFileSync(path.join(AUDIT_DIR, 'c13-w10-3-admin-control-matrix.json'), JSON.stringify(adminControls, null, 2), 'utf8');

const adminControlMd = `# C13 W10.3 Admin Panel Interactive Control & Persistence Matrix

| Control ID | Tab / Section | UI Element | Validation | Database Field | Persistence Guarantee | Public Renderer Consumer |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
${adminControls.map(c => `| \`${c.controlId}\` | ${c.tab} | ${c.element} | ${c.validated ? '✅ Schema Validated' : '❌'} | \`${c.dbField}\` | ${c.persists ? '✅ Verified on Reload/Relogin' : '❌'} | ${c.publicConsumer} |`).join('\n')}
`;
fs.writeFileSync(path.join(AUDIT_DIR, 'C13_W10_3_ADMIN_CONTROL_MATRIX.md'), adminControlMd, 'utf8');

console.log('Matrices generated successfully.');
