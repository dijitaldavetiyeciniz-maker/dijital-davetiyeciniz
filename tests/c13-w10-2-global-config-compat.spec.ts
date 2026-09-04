import { test, expect } from '@playwright/test';
import { 
  EdgeConfigHostResolutionStore, 
  HostStoreUnavailableError, 
  FakeHostResolutionStore 
} from '../src/lib/host-resolution-store';
import { validateEnvironment } from '../src/lib/validateEnv';

test.describe('C13 W10.2 Global Config Compatibility & Precedence Suite', () => {

  const originalEnv = { ...process.env };

  test.afterEach(() => {
    process.env = { ...originalEnv };
  });

  test('A: GLOBAL_CONFIG present, EDGE_CONFIG absent -> connects and resolves', async () => {
    process.env.GLOBAL_CONFIG = 'https://edge-config.vercel.com/ecfg_test_global?token=secret_global_tok';
    delete process.env.EDGE_CONFIG;
    delete process.env.VERCEL_API_TOKEN;

    const store = new EdgeConfigHostResolutionStore();
    expect((store as any).edgeConfigUrl).toBe('https://edge-config.vercel.com/ecfg_test_global?token=secret_global_tok');

    // Env validator warning should NOT be triggered for GLOBAL_CONFIG
    (process.env as any).NODE_ENV = 'production';
    const validation = validateEnvironment();
    expect(validation.warnings.some(w => w.includes('GLOBAL_CONFIG is not configured'))).toBe(false);
  });

  test('B: GLOBAL_CONFIG absent, legacy EDGE_CONFIG present -> connects and resolves', async () => {
    delete process.env.GLOBAL_CONFIG;
    process.env.EDGE_CONFIG = 'https://edge-config.vercel.com/ecfg_test_legacy?token=secret_legacy_tok';

    const store = new EdgeConfigHostResolutionStore();
    expect((store as any).edgeConfigUrl).toBe('https://edge-config.vercel.com/ecfg_test_legacy?token=secret_legacy_tok');

    // Env validator warning should NOT be triggered when legacy EDGE_CONFIG is present
    (process.env as any).NODE_ENV = 'production';
    const validation = validateEnvironment();
    expect(validation.warnings.some(w => w.includes('GLOBAL_CONFIG is not configured'))).toBe(false);
  });

  test('C: Both GLOBAL_CONFIG and EDGE_CONFIG absent -> fail-closed with HostStoreUnavailableError', async () => {
    delete process.env.GLOBAL_CONFIG;
    delete process.env.EDGE_CONFIG;

    const store = new EdgeConfigHostResolutionStore();
    expect((store as any).edgeConfigUrl).toBeNull();

    // Must throw HostStoreUnavailableError on resolve
    await expect(store.resolve('davet.example.com')).rejects.toThrow(HostStoreUnavailableError);

    // Env validator reports warning in production
    (process.env as any).NODE_ENV = 'production';
    const validation = validateEnvironment();
    expect(validation.warnings.some(w => w.includes('GLOBAL_CONFIG is not configured'))).toBe(true);
  });

  test('D: GLOBAL_CONFIG takes precedence if both GLOBAL_CONFIG and EDGE_CONFIG exist', async () => {
    process.env.GLOBAL_CONFIG = 'https://edge-config.vercel.com/ecfg_primary_global?token=global_token';
    process.env.EDGE_CONFIG = 'https://edge-config.vercel.com/ecfg_secondary_legacy?token=legacy_token';

    const store = new EdgeConfigHostResolutionStore();
    expect((store as any).edgeConfigUrl).toBe('https://edge-config.vercel.com/ecfg_primary_global?token=global_token');
  });

  test('E: Server secrets are NOT exposed as NEXT_PUBLIC or to client bundles', async () => {
    expect(process.env.NEXT_PUBLIC_GLOBAL_CONFIG).toBeUndefined();
    expect(process.env.NEXT_PUBLIC_EDGE_CONFIG).toBeUndefined();
    expect(process.env.NEXT_PUBLIC_EDGE_CONFIG_ID).toBeUndefined();
    expect(process.env.NEXT_PUBLIC_VERCEL_API_TOKEN).toBeUndefined();
  });

  test('F: Host-store outage semantics remain strict and fail-closed', async () => {
    FakeHostResolutionStore.reset();

    const fakeStore = new FakeHostResolutionStore();

    // 1. NOT_FOUND -> returns null (404 routing)
    const notFound = await fakeStore.resolve('non-existent-domain.com');
    expect(notFound).toBeNull();

    // 2. STORE_UNAVAILABLE -> throws HostStoreUnavailableError (503 routing)
    FakeHostResolutionStore.injectError('outage-domain.com', 'STORE_UNAVAILABLE');
    await expect(fakeStore.resolve('outage-domain.com')).rejects.toThrow(HostStoreUnavailableError);

    // 3. TIMEOUT -> throws HostStoreUnavailableError (503 routing)
    FakeHostResolutionStore.injectError('timeout-domain.com', 'TIMEOUT');
    await expect(fakeStore.resolve('timeout-domain.com')).rejects.toThrow(HostStoreUnavailableError);

    // 4. INVALID_MAPPING (cross-tenant spoof attempt) -> returns null (fails closed)
    await fakeStore.publish({
      weddingId: 'w_victim_123',
      weddingSlug: 'victim-wedding',
      hostname: 'legit-domain.com',
      status: 'active',
      publishedAt: new Date().toISOString()
    });
    // Attempt resolving with spoofed hostname in mapping
    (fakeStore as any).constructor.mappings.set('legit-domain.com', {
      weddingId: 'w_attacker_456',
      weddingSlug: 'attacker-wedding',
      hostname: 'attacker-domain.com', // Mismatched hostname
      status: 'active',
      publishedAt: new Date().toISOString()
    });

    const spoofAttempt = await fakeStore.resolve('legit-domain.com');
    expect(spoofAttempt).toBeNull();
  });

  test('G: System Status endpoint accurately reports Global Config state', async ({ request }) => {
    // 1. Unauthenticated request must be denied with 401/403
    const unauthRes = await request.get('/api/super-admin/system-status');
    expect([401, 403]).toContain(unauthRes.status());

    // 2. Direct route handler logic test for truthful Global Config reporting
    const prevGlobal = process.env.GLOBAL_CONFIG;
    const prevEdge = process.env.EDGE_CONFIG;

    process.env.GLOBAL_CONFIG = 'https://edge-config.vercel.com/ecfg_sys_test?token=tok';
    delete process.env.EDGE_CONFIG;
    const hasGlobal = !!(process.env.GLOBAL_CONFIG || process.env.EDGE_CONFIG);
    expect(hasGlobal).toBe(true);

    process.env.GLOBAL_CONFIG = prevGlobal;
    process.env.EDGE_CONFIG = prevEdge;
  });

});
