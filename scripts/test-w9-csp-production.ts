/**
 * W9.2 Production CSP Safety Verification Test
 */

import assert from 'assert';
import nextConfig from '../next.config';

console.log('\n--- W9.2 CSP Production Safety & Minimization Test ---\n');

async function testCsp() {
  (process.env as any).NODE_ENV = 'production';
  const headersList = await nextConfig.headers();

  const globalHeaderObj = headersList.find((h: any) => h.source === '/:path*');
  assert.ok(globalHeaderObj, 'Global header rule /:path* must exist');

  const cspHeader = globalHeaderObj.headers.find((h: any) => h.key === 'Content-Security-Policy');
  assert.ok(cspHeader, 'Content-Security-Policy header must exist');

  const cspValue = cspHeader.value;
  console.log('PRODUCTION CSP VALUE:\n', cspValue, '\n');

  // Assertions for Production CSP Safety
  assert.strictEqual(
    cspValue.includes("'unsafe-eval'"),
    false,
    "Production CSP MUST NOT contain 'unsafe-eval'"
  );
  console.log("✓ PRODUCTION_CSP_UNSAFE_EVAL_ASSERTION: PASS ('unsafe-eval' strictly removed)");

  assert.strictEqual(
    cspValue.includes("script-src 'self' 'unsafe-inline' https://apis.google.com;"),
    true,
    "Production CSP script-src must be minimal ('self', 'unsafe-inline', https://apis.google.com)"
  );
  console.log('✓ CSP_SCRIPT_SOURCES: PASS (Minimal verified sources)');

  assert.strictEqual(
    cspValue.includes('script-src') && cspValue.split('script-src')[1].split(';')[0].includes('*.supabase.co'),
    false,
    "*.supabase.co must be removed from script-src (bundled in npm, no remote script tags)"
  );
  console.log('✓ CSP_UNUSED_SOURCES_REMOVED: PASS (*.supabase.co removed from script-src)');

  assert.ok(
    cspValue.includes("connect-src 'self' https://*.supabase.co wss://*.supabase.co"),
    'connect-src must contain Supabase REST and WebSocket endpoints'
  );
  console.log('✓ CSP_CONNECT_SOURCES: PASS (Supabase endpoints verified)');

  assert.ok(
    cspValue.includes("frame-ancestors 'self'"),
    "frame-ancestors must be 'self'"
  );
  console.log("✓ FRAME_ANCESTORS: PASS ('self' enforced)");

  console.log('\n============================================================');
  console.log('ALL W9.2 PRODUCTION CSP SAFETY ASSERTIONS PASSED! (100%)');
  console.log('============================================================\n');
}

testCsp();
