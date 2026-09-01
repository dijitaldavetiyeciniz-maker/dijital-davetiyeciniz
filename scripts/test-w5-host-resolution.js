import { NextRequest } from 'next/server';
import { proxy } from '../src/proxy.ts';
import {
  FakeHostResolutionStore,
  getHostResolutionStore,
  publishActiveDomainMapping,
  removeDomainMapping,
} from '../src/lib/host-resolution-store.ts';
import { normalizeHostname, isValidHostname, isPlatformDomain } from '../src/lib/domain-utils.ts';

async function runW5Tests() {
  console.log('=== C13 W5 HOST RESOLUTION DATA PLANE TEST SUITE ===\n');

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

  // --- SECTION 1: PLATFORM & SYSTEM BYPASS ---
  console.log('--- 1. Platform & System Path Bypass ---');

  // Test 1: Platform host bypass
  const reqPlatform = createReq('http://dijitaldavetiyeciniz.com/zeynep-murat', 'dijitaldavetiyeciniz.com');
  const resPlatform = await proxy(reqPlatform);
  assert(
    resPlatform.headers.get('x-middleware-rewrite') === null && !resPlatform.headers.get('x-tenant-id'),
    'Platform production domain request bypasses proxy and continues standard routing'
  );

  // Test 2: Localhost bypass
  const reqLocalhost = createReq('http://localhost:3000/demo-wedding', 'localhost:3000');
  const resLocalhost = await proxy(reqLocalhost);
  assert(
    resLocalhost.headers.get('x-middleware-rewrite') === null,
    'Localhost request bypasses proxy without tenant rewrite'
  );

  // Test 3: Vercel preview host bypass
  const reqVercel = createReq('https://my-app-git-feat.vercel.app/test', 'my-app-git-feat.vercel.app');
  const resVercel = await proxy(reqVercel);
  assert(
    resVercel.headers.get('x-middleware-rewrite') === null,
    '*.vercel.app host requests bypass proxy without tenant rewrite'
  );

  // Test 4: /api route bypass
  const reqApi = createReq('https://davet.ahmet-ayse.com/api/check-ins', 'davet.ahmet-ayse.com');
  const resApi = await proxy(reqApi);
  assert(
    resApi.headers.get('x-middleware-rewrite') === null,
    '/api/* requests on custom domains bypass tenant rewrite to preserve API semantics'
  );

  // Test 5: /_next and static asset bypass
  const reqNext = createReq('https://davet.ahmet-ayse.com/_next/static/chunks/main.js', 'davet.ahmet-ayse.com');
  const reqFavicon = createReq('https://davet.ahmet-ayse.com/favicon.ico', 'davet.ahmet-ayse.com');
  const reqRobots = createReq('https://davet.ahmet-ayse.com/robots.txt', 'davet.ahmet-ayse.com');
  const resNext = await proxy(reqNext);
  const resFavicon = await proxy(reqFavicon);
  const resRobots = await proxy(reqRobots);
  assert(
    resNext.headers.get('x-middleware-rewrite') === null &&
    resFavicon.headers.get('x-middleware-rewrite') === null &&
    resRobots.headers.get('x-middleware-rewrite') === null,
    'Static assets, /_next, favicon.ico, and robots.txt bypass tenant rewrite'
  );

  // --- SECTION 2: CUSTOM DOMAIN RESOLUTION & CANONICAL REWRITE ---
  console.log('\n--- 2. Custom Domain Resolution & Rewrites ---');

  // Seed active domain mappings in shared store
  await store.publish({
    weddingId: 'wedding-uuid-aaa',
    weddingSlug: 'ahmet-ayse',
    hostname: 'davet.ahmet-ayse.com',
    status: 'active',
    publishedAt: new Date().toISOString(),
  });

  await store.publish({
    weddingId: 'wedding-uuid-bbb',
    weddingSlug: 'burak-cemre',
    hostname: 'davet.burak-cemre.org',
    status: 'active',
    publishedAt: new Date().toISOString(),
  });

  // Test 6: Custom Host A -> Wedding A
  const reqHostA = createReq('https://davet.ahmet-ayse.com/', 'davet.ahmet-ayse.com');
  const resHostA = await proxy(reqHostA);
  const rewriteUrlA = resHostA.headers.get('x-middleware-rewrite');
  assert(
    rewriteUrlA?.includes('/ahmet-ayse') &&
    resHostA.headers.get('x-tenant-id') === 'wedding-uuid-aaa' &&
    resHostA.headers.get('x-custom-domain') === 'davet.ahmet-ayse.com',
    'Custom Host A rewrites internally to Wedding A with correct tenant headers'
  );

  // Test 7: Custom Host B -> Wedding B
  const reqHostB = createReq('https://davet.burak-cemre.org/', 'davet.burak-cemre.org');
  const resHostB = await proxy(reqHostB);
  const rewriteUrlB = resHostB.headers.get('x-middleware-rewrite');
  assert(
    rewriteUrlB?.includes('/burak-cemre') &&
    resHostB.headers.get('x-tenant-id') === 'wedding-uuid-bbb' &&
    resHostB.headers.get('x-custom-domain') === 'davet.burak-cemre.org',
    'Custom Host B rewrites internally to Wedding B with correct tenant headers'
  );

  // Test 8: Query string preservation
  const reqQuery = createReq('https://davet.ahmet-ayse.com/?guest=g_12345&table=5', 'davet.ahmet-ayse.com');
  const resQuery = await proxy(reqQuery);
  const rewriteQuery = resQuery.headers.get('x-middleware-rewrite');
  assert(
    rewriteQuery?.includes('guest=g_12345') && rewriteQuery?.includes('table=5'),
    'Query parameters (?guest=g_12345&table=5) are strictly preserved during internal rewrite'
  );

  // Test 9: Public subpath preservation
  const reqSubpath = createReq('https://davet.ahmet-ayse.com/program?view=detail', 'davet.ahmet-ayse.com');
  const resSubpath = await proxy(reqSubpath);
  const rewriteSubpath = resSubpath.headers.get('x-middleware-rewrite');
  assert(
    rewriteSubpath?.includes('/ahmet-ayse/program') && rewriteSubpath?.includes('view=detail'),
    'Public subpaths (/program) and parameters are preserved during internal rewrite'
  );

  // --- SECTION 3: SECURITY, TRUST BOUNDARY & ISOLATION ---
  console.log('\n--- 3. Security, Trust Boundary & Header Spoofing Protection ---');

  // Test 10: Unknown host fails closed (404)
  const reqUnknown = createReq('https://unknown-attacker-domain.com/', 'unknown-attacker-domain.com');
  const resUnknown = await proxy(reqUnknown);
  assert(
    resUnknown.status === 404 && resUnknown.headers.get('x-domain-status') === 'unresolved',
    'Unknown custom domain fails closed with 404 without leaking any default wedding'
  );

  // Test 11: Malformed host fails closed (400)
  const reqMalformed = createReq('https://invalid_host_with_special!chars.com/', 'invalid_host_with_special!chars.com');
  const resMalformed = await proxy(reqMalformed);
  assert(
    resMalformed.status === 400,
    'Malformed host header rejected at trust boundary with 400 Bad Request'
  );

  // Test 12: IP literal host rejected
  const reqIp = createReq('https://198.51.100.42/', '198.51.100.42');
  const resIp = await proxy(reqIp);
  assert(
    resIp.status === 400,
    'IP literal host rejected at trust boundary with 400 Bad Request'
  );

  // Test 13: Custom host /admin restriction
  const reqAdmin = createReq('https://davet.ahmet-ayse.com/admin', 'davet.ahmet-ayse.com');
  const resAdmin = await proxy(reqAdmin);
  assert(
    resAdmin.status === 403 && resAdmin.headers.get('x-domain-status') === 'admin-restricted',
    'Custom host /admin access is denied with 403 (public invitation surface only)'
  );

  // Test 14: Client header spoofing protection (x-tenant-id)
  const reqSpoofTenant = createReq('https://davet.ahmet-ayse.com/', 'davet.ahmet-ayse.com', {
    'x-tenant-id': 'wedding-uuid-SPOOFED-ATTACKER',
  });
  const resSpoofTenant = await proxy(reqSpoofTenant);
  assert(
    resSpoofTenant.headers.get('x-tenant-id') === 'wedding-uuid-aaa',
    'Client-supplied spoofed x-tenant-id header is discarded; authoritative resolved tenant applied'
  );

  // Test 15: Client header spoofing protection (x-custom-domain)
  const reqSpoofDomain = createReq('https://davet.ahmet-ayse.com/', 'davet.ahmet-ayse.com', {
    'x-custom-domain': 'fake.victim.org',
  });
  const resSpoofDomain = await proxy(reqSpoofDomain);
  assert(
    resSpoofDomain.headers.get('x-custom-domain') === 'davet.ahmet-ayse.com',
    'Client-supplied spoofed x-custom-domain header is discarded; authoritative host applied'
  );

  // Test 16: Rewrite loop protection
  const reqLoop = createReq('https://davet.ahmet-ayse.com/ahmet-ayse', 'davet.ahmet-ayse.com', {
    'x-proxy-rewritten': '1',
  });
  const resLoop = await proxy(reqLoop);
  assert(
    resLoop.headers.get('x-middleware-rewrite') === null,
    'Requests with x-proxy-rewritten: 1 bypass proxy to prevent infinite rewrite loops'
  );

  // --- SECTION 4: DOMAIN LIFECYCLE & CACHE INVALIDATION ---
  console.log('\n--- 4. Lifecycle Publication & Cache Invalidation ---');

  // Test 17: Inactive domain cannot be published
  const publishInactiveRes = await store.publish({
    weddingId: 'wedding-uuid-pending',
    weddingSlug: 'pending-wedding',
    hostname: 'pending.example.com',
    status: 'pending',
    publishedAt: new Date().toISOString(),
  });
  assert(
    publishInactiveRes === false,
    'Store strictly rejects publishing inactive or pending domain mappings'
  );

  // Test 18: Active domain publication via helper
  const publishActiveRes = await publishActiveDomainMapping('wedding-uuid-ccc', 'can-cansu', 'davet.can-cansu.com');
  const resNewDomain = await proxy(createReq('https://davet.can-cansu.com/', 'davet.can-cansu.com'));
  assert(
    publishActiveRes === true && resNewDomain.headers.get('x-tenant-id') === 'wedding-uuid-ccc',
    'publishActiveDomainMapping publishes new active domain and enables immediate proxy routing'
  );

  // Test 19: Domain removal invalidation
  await removeDomainMapping('davet.can-cansu.com');
  const resRemovedDomain = await proxy(createReq('https://davet.can-cansu.com/', 'davet.can-cansu.com'));
  assert(
    resRemovedDomain.status === 404,
    'removeDomainMapping removes mapping; subsequent requests immediately fail closed (404)'
  );

  // Test 20: Domain replacement (old fails, new works)
  await publishActiveDomainMapping('wedding-uuid-aaa', 'ahmet-ayse', 'new-brand.ahmet-ayse.com');
  await removeDomainMapping('davet.ahmet-ayse.com');
  const resOld = await proxy(createReq('https://davet.ahmet-ayse.com/', 'davet.ahmet-ayse.com'));
  const resNew = await proxy(createReq('https://new-brand.ahmet-ayse.com/', 'new-brand.ahmet-ayse.com'));
  assert(
    resOld.status === 404 && resNew.headers.get('x-tenant-id') === 'wedding-uuid-aaa',
    'Domain replacement safely deactivates old domain and activates new domain for same wedding'
  );

  // --- SECTION 5: FAULT TOLERANCE & EXACT SEMANTICS ---
  console.log('\n--- 5. Store Failure & Exact Hostname Semantics ---');

  // Test 21: Store failure fails safe (503, no cross-tenant leakage)
  FakeHostResolutionStore.injectError('error.domain.com', 'STORE_UNAVAILABLE');
  const resStoreErr = await proxy(createReq('https://error.domain.com/', 'error.domain.com'));
  assert(
    resStoreErr.status === 503 && !resStoreErr.headers.get('x-tenant-id'),
    'Store unavailable error fails safe with 503 without leaking cross-tenant data'
  );

  // Test 22: Exact hostname semantics for www vs apex (no automatic alias unless registered)
  const resApex = await proxy(createReq('https://ahmet-ayse.com/', 'ahmet-ayse.com'));
  assert(
    resApex.status === 404,
    'Unregistered apex domain fails closed (exact canonical hostname match required)'
  );

  // Test 23: Cross-tenant isolation (Tenant A cannot access Tenant B by manipulating host)
  const resCrossA = await proxy(createReq('https://new-brand.ahmet-ayse.com/burak-cemre', 'new-brand.ahmet-ayse.com'));
  const rewriteCrossA = resCrossA.headers.get('x-middleware-rewrite');
  assert(
    rewriteCrossA?.includes('/ahmet-ayse/burak-cemre'),
    'Cross-tenant request on Host A stays within Tenant A boundary (/ahmet-ayse/burak-cemre)'
  );

  // Test 24: Port normalization in host header (e.g. host:443)
  const resPort = await proxy(createReq('https://new-brand.ahmet-ayse.com:443/', 'new-brand.ahmet-ayse.com:443'));
  assert(
    resPort.headers.get('x-tenant-id') === 'wedding-uuid-aaa',
    'Hostname normalization strips port (:443) and resolves to canonical tenant'
  );

  // Test 25: Platform slug routing preservation (regression check)
  const reqPlatformSlug = createReq('http://dijitaldavetiyeciniz.com/ahmet-ayse', 'dijitaldavetiyeciniz.com');
  const resPlatformSlug = await proxy(reqPlatformSlug);
  assert(
    resPlatformSlug.headers.get('x-middleware-rewrite') === null,
    'Platform slug routing (/ahmet-ayse on platform domain) bypasses custom domain proxy'
  );

  // Test 26: Upper-case hostname normalization in request
  const resUpper = await proxy(createReq('https://NEW-BRAND.AHMET-AYSE.COM/', 'NEW-BRAND.AHMET-AYSE.COM'));
  assert(
    resUpper.headers.get('x-tenant-id') === 'wedding-uuid-aaa',
    'Case-insensitive normalization correctly routes uppercase host requests'
  );

  // --- SECTION 6: SYNTHETIC BENCHMARK ---
  console.log('\n--- 6. Synthetic Latency Benchmark ---');

  const iterations = 1000;
  const latencies = [];

  for (let i = 0; i < iterations; i++) {
    const t0 = performance.now();
    await store.resolve('new-brand.ahmet-ayse.com');
    const t1 = performance.now();
    latencies.push(t1 - t0);
  }

  latencies.sort((a, b) => a - b);
  const p50 = latencies[Math.floor(iterations * 0.5)].toFixed(3);
  const p95 = latencies[Math.floor(iterations * 0.95)].toFixed(3);

  console.log(`[BENCHMARK] Total runs: ${iterations}`);
  console.log(`[BENCHMARK] p50: ${p50}ms`);
  console.log(`[BENCHMARK] p95: ${p95}ms`);

  assert(
    parseFloat(p50) < 5.0 && parseFloat(p95) < 10.0,
    `Host resolution data-plane latency meets sub-5ms performance gate (p50: ${p50}ms, p95: ${p95}ms)`
  );

  console.log(`\n================================`);
  console.log(`W5 TESTS TOTAL: ${passed + failed}`);
  console.log(`W5 PASS: ${passed}`);
  console.log(`W5 FAIL: ${failed}`);
  console.log(`================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runW5Tests().catch(err => {
  console.error(err);
  process.exit(1);
});
