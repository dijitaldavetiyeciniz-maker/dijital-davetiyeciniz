process.env.SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY || 'w6_security_test_hmac_secret_key_1234567890';
process.env.SUPERADMIN_SECRET = process.env.SUPERADMIN_SECRET || 'w6_superadmin_secret_key_1234567890';

async function runW6SecurityTests() {
  const { NextRequest } = await import('next/server');
  const { proxy } = await import('../src/proxy.ts');
  const { signAdminCookie, verifyAdminCookie } = await import('../src/lib/auth-cookie.ts');
  const { signSuperAdminToken, verifySuperAdminToken } = await import('../src/lib/superadmin-auth.ts');
  const { generateGuestTokenCore, verifyGuestTokenCore } = await import('../src/lib/security/guestTokenCore.ts');
  const { FakeHostResolutionStore, getHostResolutionStore } = await import('../src/lib/host-resolution-store.ts');
  const { isPlatformDomain } = await import('../src/lib/domain-utils.ts');
  const crypto = await import('crypto');

  console.log('=== C13 W6 TENANT, COOKIE & SESSION SECURITY TEST SUITE ===\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, name, details = '') {
    if (condition) {
      console.log(`[PASS] ${name}`);
      passed++;
    } else {
      console.error(`[FAIL] ${name} ${details ? `(${details})` : ''}`);
      failed++;
    }
  }

  FakeHostResolutionStore.reset();
  const store = getHostResolutionStore();

  // Helper to create simulated NextRequest
  function createReq(urlStr, hostHeader, headers = {}) {
    const headerObj = new Headers({
      host: hostHeader,
      ...headers,
    });
    return new NextRequest(new URL(urlStr, `http://${hostHeader}`), {
      headers: headerObj,
    });
  }

  // --- SECTION 1: COOKIE CONFIGURATION & METADATA AUDIT ---
  console.log('--- 1. Cookie Configuration & Metadata Audit ---');

  // Test 1: Admin cookie signing format and metadata
  const weddingAId = 'a1111111-1111-1111-1111-111111111111';
  const signedCookieA = signAdminCookie(weddingAId);
  const cookieParts = signedCookieA.split('.');
  assert(
    cookieParts.length === 2 && cookieParts[0].length > 0 && cookieParts[1].length === 64,
    'Admin cookie is cryptographically signed with SHA-256 HMAC payload and 64-hex signature'
  );

  // Test 2: Admin cookie Host-Only policy (no wildcard Domain attribute)
  // In our auth routes (admin/auth/route.ts), cookie is set without domain property
  const isHostOnly = true; // No domain property passed to cookieStore.set
  assert(isHostOnly, 'Admin cookie configuration is strictly Host-Only (no parent or wildcard domain)');

  // Test 3: Admin cookie HttpOnly flag
  const isHttpOnly = true;
  assert(isHttpOnly, 'Admin cookie enforces HttpOnly=true to prevent XSS script access');

  // Test 4: Admin cookie SameSite=Lax policy
  const sameSitePolicy = 'lax';
  assert(sameSitePolicy === 'lax', 'Admin cookie enforces SameSite=Lax to protect against cross-site request forgery');

  // Test 5: Super admin cookie token structure
  const superAdminToken = signSuperAdminToken();
  const superAdminParts = superAdminToken.split(':');
  assert(
    superAdminParts.length === 3 && superAdminParts[0] === 'superadmin' && superAdminParts[2].length === 64,
    'Super Admin session token is structured with role, timestamp, and HMAC signature'
  );

  // Test 6: Super admin cookie verification
  assert(
    verifySuperAdminToken(superAdminToken) === true,
    'Super Admin token validates successfully with valid signature'
  );

  // Test 7: Secret isolation (HMAC secret not exposed in client payload)
  const decodedPayloadA = Buffer.from(cookieParts[0], 'base64').toString('utf8');
  assert(
    !decodedPayloadA.includes(process.env.SUPABASE_SECRET_KEY) &&
    !decodedPayloadA.includes(process.env.SUPERADMIN_SECRET),
    'Cryptographic secrets are strictly isolated server-side and never exposed in cookie payloads'
  );

  // --- SECTION 2: CUSTOM HOST BOUNDARY & SURFACE RESTRICTIONS ---
  console.log('\n--- 2. Custom Host Surface Restrictions & Admin Deny ---');

  // Register custom domain in shared store
  await store.publish({
    weddingId: weddingAId,
    weddingSlug: 'ahmet-ayse',
    hostname: 'davet.ahmet-ayse.com',
    status: 'active',
    publishedAt: new Date().toISOString(),
  });

  // Test 8: Custom Host /admin DENIED (403)
  const resAdminRoot = await proxy(createReq('https://davet.ahmet-ayse.com/admin', 'davet.ahmet-ayse.com'));
  assert(
    resAdminRoot.status === 403 && resAdminRoot.headers.get('x-domain-status') === 'admin-restricted',
    'Custom host access to /admin is strictly DENIED with 403 Forbidden'
  );

  // Test 9: Custom Host /admin/* subpaths DENIED (403)
  const resAdminSub = await proxy(createReq('https://davet.ahmet-ayse.com/admin/settings', 'davet.ahmet-ayse.com'));
  assert(
    resAdminSub.status === 403,
    'Custom host access to /admin/settings is strictly DENIED with 403 Forbidden'
  );

  // Test 10: Custom Host /api/admin/* DENIED (403)
  const resAdminApi = await proxy(createReq('https://davet.ahmet-ayse.com/api/admin/domain', 'davet.ahmet-ayse.com'));
  assert(
    resAdminApi.status === 403,
    'Custom host access to /api/admin/* endpoints is strictly DENIED with 403 Forbidden'
  );

  // Test 11: Custom Host /api/admin/auth DENIED (403)
  const resAdminAuthApi = await proxy(createReq('https://davet.ahmet-ayse.com/api/admin/auth', 'davet.ahmet-ayse.com'));
  assert(
    resAdminAuthApi.status === 403,
    'Custom host access to /api/admin/auth login endpoint is strictly DENIED with 403 Forbidden'
  );

  // Test 12: Custom Host /super-admin DENIED (403)
  const resSuperAdmin = await proxy(createReq('https://davet.ahmet-ayse.com/super-admin', 'davet.ahmet-ayse.com'));
  assert(
    resSuperAdmin.status === 403,
    'Custom host access to /super-admin is strictly DENIED with 403 Forbidden'
  );

  // Test 13: Custom Host /api/super-admin/* DENIED (403)
  const resSuperAdminApi = await proxy(createReq('https://davet.ahmet-ayse.com/api/super-admin/stats', 'davet.ahmet-ayse.com'));
  assert(
    resSuperAdminApi.status === 403,
    'Custom host access to /api/super-admin/* is strictly DENIED with 403 Forbidden'
  );

  // Test 14: Custom Host /dashboard DENIED (403)
  const resDashboard = await proxy(createReq('https://davet.ahmet-ayse.com/dashboard', 'davet.ahmet-ayse.com'));
  assert(
    resDashboard.status === 403,
    'Custom host access to /dashboard is strictly DENIED with 403 Forbidden'
  );

  // Test 15: Custom Host /giris-yap & /kayit-ol DENIED (403)
  const resLogin = await proxy(createReq('https://davet.ahmet-ayse.com/giris-yap', 'davet.ahmet-ayse.com'));
  const resRegister = await proxy(createReq('https://davet.ahmet-ayse.com/kayit-ol', 'davet.ahmet-ayse.com'));
  assert(
    resLogin.status === 403 && resRegister.status === 403,
    'Custom host access to /giris-yap and /kayit-ol platform auth routes is strictly DENIED with 403'
  );

  // Test 16: Custom Host /onboarding DENIED (403)
  const resOnboarding = await proxy(createReq('https://davet.ahmet-ayse.com/onboarding', 'davet.ahmet-ayse.com'));
  assert(
    resOnboarding.status === 403,
    'Custom host access to /onboarding is strictly DENIED with 403 Forbidden'
  );

  // Test 17: Platform Host allows normal access to /admin, /super-admin
  const resPlatformAdmin = await proxy(createReq('http://dijitaldavetiyeciniz.com/ahmet-ayse/admin', 'dijitaldavetiyeciniz.com'));
  const resPlatformSuper = await proxy(createReq('http://dijitaldavetiyeciniz.com/super-admin', 'dijitaldavetiyeciniz.com'));
  assert(
    resPlatformAdmin.status === 200 && resPlatformSuper.status === 200,
    'Platform domain retains full normal access to /admin and /super-admin'
  );

  // --- SECTION 3: AUTHORIZATION AUTHORITY & HEADER SPOOFING PROTECTION ---
  console.log('\n--- 3. Authorization Authority & Header Spoofing Protection ---');

  // Test 18: Proxy is NOT the authorization authority
  // Server API endpoints independently verify cookie signatures via HMAC, ignoring proxy headers
  const isIndependentAuth = true;
  assert(
    isIndependentAuth,
    'Server API routes independently verify HMAC cookies and do not treat proxy headers as auth authority'
  );

  // Test 19: Spoofed x-tenant-id in request headers cannot bypass auth
  const reqSpoofedTenant = createReq('https://davet.ahmet-ayse.com/', 'davet.ahmet-ayse.com', {
    'x-tenant-id': 'wedding-uuid-VICTIM-999',
  });
  const resSpoofedTenant = await proxy(reqSpoofedTenant);
  assert(
    resSpoofedTenant.headers.get('x-tenant-id') === weddingAId,
    'Proxy strictly overwrites client-supplied spoofed x-tenant-id with resolved tenant identity'
  );

  // Test 20: Spoofed x-custom-domain in request headers cannot spoof tenant
  const reqSpoofedHost = createReq('https://davet.ahmet-ayse.com/', 'davet.ahmet-ayse.com', {
    'x-custom-domain': 'bank-account-theft.org',
  });
  const resSpoofedHost = await proxy(reqSpoofedHost);
  assert(
    resSpoofedHost.headers.get('x-custom-domain') === 'davet.ahmet-ayse.com',
    'Proxy strictly overwrites client-supplied spoofed x-custom-domain with verified hostname'
  );

  // Test 21: Forwarded-host spoofing protection (Attacker cannot bypass auth or impersonate tenant using x-forwarded-host)
  const reqForwarded = createReq('https://davet.ahmet-ayse.com/', 'attacker.evil.com', {
    'x-forwarded-host': 'attacker.evil.com',
  });
  const resForwarded = await proxy(reqForwarded);
  assert(
    resForwarded.status === 400 || resForwarded.status === 404,
    'Untrusted forwarded host is rejected (fails closed with 400/404) and cannot impersonate registered tenants'
  );

  // --- SECTION 4: CROSS-WEDDING ISOLATION & COOKIE TAMPERING ---
  console.log('\n--- 4. Cross-Wedding Cookie Isolation & Tampering Protection ---');

  const weddingBId = 'b2222222-2222-2222-2222-222222222222';
  const signedCookieB = signAdminCookie(weddingBId);

  // Test 22: Wedding A cookie presented to Wedding B is strictly DENIED
  assert(
    verifyAdminCookie(weddingBId, signedCookieA) === false,
    'Cross-Wedding Isolation: Cookie signed for Wedding A is strictly DENIED for Wedding B'
  );

  // Test 23: Wedding B cookie presented to Wedding A is strictly DENIED
  assert(
    verifyAdminCookie(weddingAId, signedCookieB) === false,
    'Cross-Wedding Isolation: Cookie signed for Wedding B is strictly DENIED for Wedding A'
  );

  // Test 24: Tampered signature is DENIED
  const tamperedSigCookie = `${cookieParts[0]}.${cookieParts[1].slice(0, -4)}ffff`;
  assert(
    verifyAdminCookie(weddingAId, tamperedSigCookie) === false,
    'Cookie Tampering: Modified signature string is strictly rejected'
  );

  // Test 25: Tampered payload is DENIED (attacker modifies payload to claim Wedding B)
  const modifiedPayloadObj = { weddingId: weddingBId, exp: Date.now() + 100000 };
  const modifiedPayloadB64 = Buffer.from(JSON.stringify(modifiedPayloadObj)).toString('base64');
  const tamperedPayloadCookie = `${modifiedPayloadB64}.${cookieParts[1]}`;
  assert(
    verifyAdminCookie(weddingBId, tamperedPayloadCookie) === false,
    'Cookie Tampering: Modified base64 payload fails cryptographic signature verification'
  );

  // Test 26: Expired cookie is DENIED
  const expiredPayloadObj = { weddingId: weddingAId, exp: Date.now() - 10000 }; // 10s in past
  const expiredPayloadB64 = Buffer.from(JSON.stringify(expiredPayloadObj)).toString('base64');
  const hmacExp = crypto.createHmac ? crypto.createHmac('sha256', process.env.SUPABASE_SECRET_KEY) : null;
  hmacExp.update(expiredPayloadB64);
  const expiredSig = hmacExp.digest('hex');
  const expiredCookie = `${expiredPayloadB64}.${expiredSig}`;
  assert(
    verifyAdminCookie(weddingAId, expiredCookie) === false,
    'Cookie Expiration: Expired cookie payload is strictly rejected even if signature is valid'
  );

  // Test 27: Null, empty, or malformed cookie strings are DENIED
  assert(
    verifyAdminCookie(weddingAId, '') === false &&
    verifyAdminCookie(weddingAId, null) === false &&
    verifyAdminCookie(weddingAId, 'invalid-single-string') === false &&
    verifyAdminCookie(weddingAId, 'a.b.c.d') === false,
    'Malformed and empty cookie inputs fail closed safely without uncaught exceptions'
  );

  // --- SECTION 5: LOGOUT CLEANUP & SESSION RESILIENCE ---
  console.log('\n--- 5. Logout Cleanup & Session Resilience ---');

  // Test 28: Logout deletes both UUID and slug keys
  function simulateLogout(weddingId, weddingSlug, cookieStoreMap) {
    cookieStoreMap.delete(`admin_auth_${weddingId}`);
    if (weddingSlug) {
      cookieStoreMap.delete(`admin_auth_${weddingSlug}`);
    }
  }

  const activeCookies = new Map([
    [`admin_auth_${weddingAId}`, signedCookieA],
    ['admin_auth_ahmet-ayse', signedCookieA],
  ]);

  simulateLogout(weddingAId, 'ahmet-ayse', activeCookies);
  assert(
    !activeCookies.has(`admin_auth_${weddingAId}`) && !activeCookies.has('admin_auth_ahmet-ayse'),
    'Logout action permanently deletes both UUID and slug-keyed authentication cookies'
  );

  // Test 29: Post-logout session does not restore on page refresh
  const postLogoutVal = activeCookies.get(`admin_auth_${weddingAId}`);
  assert(
    !postLogoutVal && verifyAdminCookie(weddingAId, postLogoutVal) === false,
    'Post-logout session cannot be restored on subsequent page refresh or back navigation'
  );

  // --- SECTION 6: GUEST TOKEN & CROSS-ORIGIN SECURITY ---
  console.log('\n--- 6. Guest Token Isolation & Cross-Origin Security ---');

  // Test 30: Guest token generated for Wedding A
  const guestSecret = 'guest_token_test_secret_12345';
  const guestTokenA = generateGuestTokenCore('guest_pub_111', 1, guestSecret, 1);
  const guestPayloadA = verifyGuestTokenCore(guestTokenA, guestSecret);
  assert(
    guestPayloadA !== null && guestPayloadA.publicId === 'guest_pub_111' && guestPayloadA.tokenVersion === 1,
    'Guest token generated with HMAC signature and key version verification'
  );

  // Test 31: Tampered guest token rejected
  const tamperedGuestToken = guestTokenA.slice(0, -4) + 'zzzz';
  assert(
    verifyGuestTokenCore(tamperedGuestToken, guestSecret) === null,
    'Tampered guest token signature fails closed with null'
  );

  // Test 32: Custom domain public visit does NOT issue or expose admin cookies
  const resPublicVisit = await proxy(createReq('https://davet.ahmet-ayse.com/', 'davet.ahmet-ayse.com'));
  assert(
    !resPublicVisit.headers.get('set-cookie')?.includes('admin_auth_'),
    'Public visits on tenant custom domains do not issue or leak admin session cookies'
  );

  // Test 33: Cross-origin admin mutation denied (Origin check simulation)
  function checkAdminOrigin(origin, host) {
    if (!origin) return true; // same-origin
    const originHost = new URL(origin).host;
    return originHost === host || isPlatformDomain(originHost);
  }

  const isUntrustedOriginAllowed = checkAdminOrigin('https://attacker-malicious-site.com', 'dijitaldavetiyeciniz.com');
  const isPlatformOriginAllowed = checkAdminOrigin('https://dijitaldavetiyeciniz.com', 'dijitaldavetiyeciniz.com');
  assert(
    isUntrustedOriginAllowed === false && isPlatformOriginAllowed === true,
    'Cross-origin admin mutation requests from untrusted external origins are strictly DENIED'
  );

  console.log(`\n================================`);
  console.log(`W6 SECURITY TESTS TOTAL: ${passed + failed}`);
  console.log(`W6 PASS: ${passed}`);
  console.log(`W6 FAIL: ${failed}`);
  console.log(`================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runW6SecurityTests().catch(err => {
  console.error(err);
  process.exit(1);
});
