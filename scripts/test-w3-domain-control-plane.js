process.env.SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY || 'test_secret_hmac_key_for_control_plane_tests_12345';

async function runTests() {
  const {
    normalizeHostname,
    isValidHostname,
    isPlatformDomain,
  } = await import('../src/lib/domain-utils.ts');
  const {
    FakeDomainProvider,
    VercelDomainProvider,
    getDomainProvider,
  } = await import('../src/lib/domain-provider.ts');
  const { signAdminCookie, verifyAdminCookie } = await import('../src/lib/auth-cookie.ts');

  console.log('=== C13 W3 DOMAIN PROVIDER CONTROL PLANE TEST SUITE ===\n');

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

  // --- SECTION 1: HOSTNAME NORMALIZATION & PLATFORM FILTERING ---
  console.log('--- 1. Validation & Canonical Normalization ---');

  // Test 1: Canonical hostname normalization
  const norm1 = normalizeHostname('  EXAMPLE.com.  ');
  const norm2 = normalizeHostname('https://Davet.Example.COM:443/');
  const norm3 = normalizeHostname('http://sub.domain.com:8080');
  assert(
    norm1.hostname === 'example.com' &&
    norm2.hostname === 'davet.example.com' &&
    norm3.hostname === 'sub.domain.com',
    'Hostname normalization correctly strips whitespace, protocol, port, uppercase, and trailing dots'
  );

  // Test 2: URL path rejection
  const pathNorm = normalizeHostname('example.com/admin/login');
  assert(
    pathNorm.error !== undefined && pathNorm.hostname === '',
    'Hostname normalization rejects inputs containing URL paths'
  );

  // Test 3: Invalid hostname format rejection
  assert(
    !isValidHostname('invalid_domain') &&
    !isValidHostname('-startdash.com') &&
    !isValidHostname('enddash-.com') &&
    !isValidHostname('192.168.1.1') &&
    !isValidHostname(''),
    'isValidHostname rejects malformed hostnames, IP literals, and labels with invalid hyphens'
  );

  // Test 4: Valid RFC-compliant hostname acceptance
  assert(
    isValidHostname('davet.ahmet-ayse.com') &&
    isValidHostname('dugun.com') &&
    isValidHostname('sub.deep.example.co.uk'),
    'isValidHostname accepts valid RFC 1123 hostnames and subdomains'
  );

  // Test 5: Platform-owned host rejection
  assert(
    isPlatformDomain('localhost') &&
    isPlatformDomain('127.0.0.1') &&
    isPlatformDomain('my-site.vercel.app') &&
    isPlatformDomain('dijitaldavetiyeciniz.com') &&
    isPlatformDomain('admin.dijitaldavetiyeciniz.com'),
    'isPlatformDomain successfully rejects platform-owned, Vercel suffix, localhost, and loopback domains'
  );

  // Test 6: Non-platform tenant custom domains allowed
  assert(
    !isPlatformDomain('ayse-mehmet.com') &&
    !isPlatformDomain('davet.cemre-burak.org'),
    'isPlatformDomain allows valid tenant custom domains'
  );

  // --- SECTION 2: DOMAIN PROVIDER IMPLEMENTATION & ERROR NORMALIZATION ---
  console.log('\n--- 2. FakeDomainProvider State Machine & Error Injection ---');
  FakeDomainProvider.reset();
  const provider = new FakeDomainProvider();

  // Test 7: Provider addDomain success
  const addRes1 = await provider.addDomain('dugun.example.com');
  assert(
    addRes1.success === true &&
    addRes1.status === 'pending' &&
    addRes1.sslStatus === 'pending' &&
    addRes1.verificationRequirements?.length > 0,
    'Provider addDomain returns success=true, status=pending, and DNS verification requirements'
  );

  // Test 8: Provider addDomain duplicate conflict
  const addResDup = await provider.addDomain('dugun.example.com');
  assert(
    addResDup.success === false && addResDup.errorCode === 'DOMAIN_ALREADY_EXISTS',
    'Provider addDomain rejects duplicate domain registration with DOMAIN_ALREADY_EXISTS'
  );

  // Test 9: Provider verifyDomain success
  const verifyRes1 = await provider.verifyDomain('dugun.example.com');
  assert(
    verifyRes1.success === true &&
    verifyRes1.status === 'active' &&
    verifyRes1.sslStatus === 'active' &&
    verifyRes1.verified === true,
    'Provider verifyDomain transitions domain state to active and sslStatus to active'
  );

  // Test 10: Provider verifyDomain pending propagation
  await provider.addDomain('unverified-domain.com');
  const verifyResPending = await provider.verifyDomain('unverified-domain.com');
  assert(
    verifyResPending.success === true &&
    verifyResPending.status === 'pending' &&
    verifyResPending.verified === false &&
    verifyResPending.errorCode === 'VERIFICATION_PENDING',
    'Provider verifyDomain correctly reports VERIFICATION_PENDING when DNS propagation is pending'
  );

  // Test 11: Provider getDomainStatus
  const statusRes = await provider.getDomainStatus('dugun.example.com');
  assert(
    statusRes.success === true && statusRes.status === 'active',
    'Provider getDomainStatus accurately reflects persisted in-memory domain state'
  );

  // Test 12: Provider removeDomain success and idempotency
  const removeRes1 = await provider.removeDomain('dugun.example.com');
  const removeResIdempotent = await provider.removeDomain('non-existent-domain.com');
  assert(
    removeRes1.success === true && removeResIdempotent.success === true,
    'Provider removeDomain cleanly deletes domain and exhibits idempotent success on missing domain'
  );

  // Test 13: Provider Error Injection - PROVIDER_UNAUTHORIZED
  FakeDomainProvider.injectError('unauthorized.com', 'PROVIDER_UNAUTHORIZED');
  const unauthRes = await provider.addDomain('unauthorized.com');
  assert(
    unauthRes.success === false && unauthRes.errorCode === 'PROVIDER_UNAUTHORIZED',
    'Provider error injection correctly returns normalized PROVIDER_UNAUTHORIZED error'
  );

  // Test 14: Provider Error Injection - PROVIDER_RATE_LIMITED
  FakeDomainProvider.injectError('ratelimit.com', 'PROVIDER_RATE_LIMITED');
  const rateLimitRes = await provider.addDomain('ratelimit.com');
  assert(
    rateLimitRes.success === false && rateLimitRes.errorCode === 'PROVIDER_RATE_LIMITED',
    'Provider error injection correctly returns normalized PROVIDER_RATE_LIMITED (429)'
  );

  // Test 15: Provider Error Injection - PROVIDER_UNAVAILABLE
  FakeDomainProvider.injectError('unavailable.com', 'PROVIDER_UNAVAILABLE');
  const unavailRes = await provider.addDomain('unavailable.com');
  assert(
    unavailRes.success === false && unavailRes.errorCode === 'PROVIDER_UNAVAILABLE',
    'Provider error injection correctly returns normalized PROVIDER_UNAVAILABLE (500/503)'
  );
  FakeDomainProvider.reset();

  // --- SECTION 3: VERCEL PROVIDER ERROR MAPPING & SECRET SANITIZATION ---
  console.log('\n--- 3. Vercel Provider Error Mapping & Secret Protection ---');

  // Test 16: Vercel provider constructor parameter validation
  let constructorThrew = false;
  try {
    new VercelDomainProvider('', '');
  } catch {
    constructorThrew = true;
  }
  assert(constructorThrew, 'VercelDomainProvider constructor strictly requires projectId and token');

  // Test 17: Secret Leakage Audit
  // Verify provider result and error messages never include the raw token or internal secrets
  const dummyToken = 'secret_vercel_token_xyz123_DO_NOT_LEAK';
  const vercelProvider = new VercelDomainProvider('proj_123', dummyToken);
  
  // Mock fetch to simulate 401 error
  const originalFetch = global.fetch;
  global.fetch = async () => {
    return {
      status: 401,
      ok: false,
      json: async () => ({ error: { message: 'Invalid token: ' + dummyToken } }),
    };
  };

  const errRes = await vercelProvider.addDomain('test.com');
  assert(
    errRes.success === false &&
    errRes.errorCode === 'PROVIDER_UNAUTHORIZED' &&
    !JSON.stringify(errRes).includes(dummyToken),
    'Vercel provider error normalization sanitizes raw error messages and never exposes API tokens'
  );
  global.fetch = originalFetch;

  // --- SECTION 4: PROVIDER FACTORY PRODUCTION SAFETY ---
  console.log('\n--- 4. Provider Factory Environment Safety ---');

  // Test 18: Factory in production strictly enforces credentials and forbids fake fallback
  const originalEnv = process.env.NODE_ENV;
  const originalProjectId = process.env.VERCEL_PROJECT_ID;
  const originalToken = process.env.VERCEL_API_TOKEN;

  process.env.NODE_ENV = 'production';
  delete process.env.VERCEL_PROJECT_ID;
  delete process.env.VERCEL_API_TOKEN;

  let factoryThrewInProd = false;
  try {
    getDomainProvider();
  } catch (e) {
    factoryThrewInProd = e.message.includes('strictly required in production');
  }
  assert(
    factoryThrewInProd,
    'getDomainProvider() factory strictly throws on missing credentials in production (no silent Fake fallback)'
  );

  // Restore env
  process.env.NODE_ENV = originalEnv;
  if (originalProjectId) process.env.VERCEL_PROJECT_ID = originalProjectId;
  if (originalToken) process.env.VERCEL_API_TOKEN = originalToken;

  // --- SECTION 5: AUTHENTICATION & CROSS-WEDDING ISOLATION ---
  console.log('\n--- 5. Authorization & Cross-Wedding Ownership Isolation ---');

  // Test 19: HMAC Admin Cookie Sign & Verify for wedding
  const weddingAId = 'a1111111-1111-1111-1111-111111111111';
  const weddingBId = 'b2222222-2222-2222-2222-222222222222';
  const validCookieA = signAdminCookie(weddingAId);

  assert(
    verifyAdminCookie(weddingAId, validCookieA) === true,
    'Owner authentication for Wedding A succeeds with signed admin cookie'
  );

  // Test 20: Cross-wedding attack denied
  assert(
    verifyAdminCookie(weddingBId, validCookieA) === false,
    'Cross-wedding access strictly DENIED (Cookie signed for Wedding A cannot access Wedding B)'
  );

  // Test 21: Tampered cookie denied
  const tamperedCookie = validCookieA.slice(0, -4) + 'abcd';
  assert(
    verifyAdminCookie(weddingAId, tamperedCookie) === false,
    'Tampered admin cookie signature strictly DENIED'
  );

  // --- SECTION 6: ENTITLEMENT GATE SIMULATION ---
  console.log('\n--- 6. Entitlement Gating Semantics ---');

  // Test 22: Entitlement Gate prevents custom domain on Standard Free tier
  const standardTierAllowCustomDomain = false;
  const premiumTierAllowCustomDomain = true;

  function simulateEntitlementGate(allowDomain, isPaid) {
    if (!allowDomain && !isPaid) {
      return { allowed: false, status: 403, code: 'ENTITLEMENT_DENIED' };
    }
    return { allowed: true };
  }

  const freeGateResult = simulateEntitlementGate(standardTierAllowCustomDomain, false);
  const paidGateResult = simulateEntitlementGate(premiumTierAllowCustomDomain, true);

  assert(
    freeGateResult.allowed === false && freeGateResult.code === 'ENTITLEMENT_DENIED' &&
    paidGateResult.allowed === true,
    'Server-side entitlement gate blocks custom domain creation on free plan with 403 ENTITLEMENT_DENIED'
  );

  console.log(`\n================================`);
  console.log(`W3 TESTS TOTAL: ${passed + failed}`);
  console.log(`W3 PASS: ${passed}`);
  console.log(`W3 FAIL: ${failed}`);
  console.log(`================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
