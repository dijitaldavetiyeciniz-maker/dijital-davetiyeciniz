/**
 * Production Test Guard
 * Strictly prevents automated test runners and fixtures from mutating real production user records.
 */

const TEST_PREFIXES = ['test-', 'c12-', 'c13-', 'e2e-', 'playwright-'];

export function isTestFixtureIdentifier(slugOrId?: string): boolean {
  if (!slugOrId) return false;
  const lower = slugOrId.toLowerCase();
  return TEST_PREFIXES.some(prefix => lower.startsWith(prefix)) || lower.includes('-test-');
}

export function assertTestMutationAllowed(slugOrId?: string): void {
  if (process.env.NODE_ENV === 'test' || process.env.PLAYWRIGHT_TEST === '1') {
    if (!isTestFixtureIdentifier(slugOrId)) {
      throw new Error(
        `[TEST_GUARD_VIOLATION]: Automated test cannot mutate non-fixture production record: "${slugOrId}"`
      );
    }
  }
}
