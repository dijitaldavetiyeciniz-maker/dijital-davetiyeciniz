/**
 * Production Test Guard
 * Strictly protects production PostgreSQL / Supabase databases from automated test pollutions
 * and prevents accidental mutation of real user records.
 */

const TEST_PREFIXES = ['test-', 'c12-', 'c13-', 'e2e-', 'playwright-'];

export function isTestFixtureIdentifier(slugOrId?: string): boolean {
  if (!slugOrId) return false;
  const lower = slugOrId.toLowerCase();
  return TEST_PREFIXES.some(prefix => lower.startsWith(prefix)) || lower.includes('-test-');
}

export function isProductionDatabaseTarget(urlOrRef?: string): boolean {
  const target = (urlOrRef || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '').toLowerCase();
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
