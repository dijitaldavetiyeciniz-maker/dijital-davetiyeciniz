/**
 * Production Test Guard
 * Strictly protects production PostgreSQL / Supabase databases from automated test pollutions
 * and prevents accidental mutation of real user records while allowing isolated local CI test suites.
 */

const TEST_PREFIXES = [
  'test-',
  'c12-',
  'c13-',
  'e2e-',
  'playwright-',
  'part5-',
  'guest-mgmt-',
  'checkin-',
  'access-ctrl-',
  'fixture-'
];

export function isTestFixtureIdentifier(slugOrId?: string): boolean {
  if (!slugOrId) return false;
  const lower = slugOrId.toLowerCase();
  return (
    TEST_PREFIXES.some(prefix => lower.startsWith(prefix)) ||
    lower.includes('-test-') ||
    lower.includes('fixture') ||
    lower.startsWith('test')
  );
}

export function isProductionDatabaseTarget(urlOrRef?: string): boolean {
  const target = (urlOrRef || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '').toLowerCase();
  // Local/CI targets are never production
  if (target.includes('127.0.0.1') || target.includes('localhost') || target.includes('54321') || target.includes('54322')) {
    return false;
  }
  // Known production project identifiers
  return target.includes('production') || target.includes('dijitaldavetiyeciniz') || process.env.VERCEL_ENV === 'production';
}

export function assertTestMutationAllowed(slugOrId?: string, dbTarget?: string): void {
  const isTestRunner = process.env.NODE_ENV === 'test' || process.env.PLAYWRIGHT_TEST === '1' || process.env.CI === '1';

  if (isTestRunner) {
    if (!isTestFixtureIdentifier(slugOrId)) {
      throw new Error(
        `[TEST_GUARD_VIOLATION]: Automated test cannot mutate non-fixture production record: "${slugOrId}"`
      );
    }

    if (isProductionDatabaseTarget(dbTarget) && !isTestFixtureIdentifier(slugOrId)) {
      throw new Error(
        `[TEST_GUARD_VIOLATION]: Production database write attempt BLOCKED for test fixture: "${slugOrId}"`
      );
    }
  }
}
