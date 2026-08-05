import { test, expect } from '@playwright/test';
import { setupPart5Fixture } from './helpers/part5Fixtures';

test.describe('PART 5A - Access Control E2E', () => {
  const isCI = process.env.CI === "true";
  let fixture: any;

  test.beforeAll(async () => {
    fixture = await setupPart5Fixture('access-ctrl');
  });

  test.afterAll(async () => {
    if (fixture) await fixture.cleanup();
  });

  test.beforeEach(async () => {
    if (isCI && !process.env.PART5_TEST_DATABASE_URL) {
      throw new Error("PART5_TEST_DATABASE_URL is required in CI");
    }
  });

  test('Access Control API Flow', async ({ request }) => {
    // Anonymous admin API isteği 401 dönmelidir
    const anonRes = await request.get(`/api/guests?wedding_id=${fixture.weddingId}`);
    expect(anonRes.status()).toBe(401);

    const getRes = await request.get(`/api/guests?wedding_id=${fixture.weddingId}`);
    expect(getRes.status()).toBe(401); // without auth, it must be 401

    // Başka organizer update → 401
    const putRes = await request.post('/api/guests', {
      data: {
        wedding_id: fixture.weddingId,
        guests: [{ first_name: 'Hacker', last_name: 'Man' }]
      }
    });
    expect(putRes.status()).toBe(401);

    // Başka organizer renew → 401
    const renewRes = await request.post(`/api/guests/${fixture.guestId}/renew`);
    expect(renewRes.status()).toBe(401);

    // Başka organizer revoke → 401
    const revokeRes = await request.post(`/api/guests/${fixture.guestId}/revoke`);
    expect(revokeRes.status()).toBe(401);

    // Response’ta SQL hata detayı yok
    const body = await renewRes.text();
    expect(body).not.toContain('SQL');
    expect(body).not.toContain('SELECT');
    expect(body).not.toContain('postgres');

    // Stack trace yok
    expect(body).not.toContain('at async');
    expect(body).not.toContain('node_modules');

    // Service-role veya secret yok
    expect(body).not.toContain('service_role');
    expect(body).not.toContain('ey'); 
  });
});
