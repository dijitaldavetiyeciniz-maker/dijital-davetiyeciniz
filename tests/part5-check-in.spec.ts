import { test, expect } from '@playwright/test';
import { getAdminCookie, part5Setup, seedPart5Data } from './helpers/part5Fixtures';

test.describe('Part 5 - Check-in Flow', () => {
  let weddingId: string;
  let adminCookie: any;
  let adminHeaders: any;
  let guests: any[];

  test.beforeAll(async () => {
    const data = await part5Setup();
    weddingId = data.weddingId;
    adminCookie = await getAdminCookie(weddingId, data.pin);
    
    adminHeaders = {
      'Cookie': `${adminCookie.name}=${adminCookie.value}`
    };

    const seeded = await seedPart5Data(weddingId);
    guests = seeded.guests;
  });

  test('Guest cannot check-in without auth', async ({ request }) => {
    const res = await request.post('/api/check-ins', {
      data: { guest_id: guests[0].id }
    });
    expect(res.status()).toBe(401);
  });

  test('Authorized admin can check-in a guest and cannot duplicate check-in', async ({ request }) => {
    // 1. Initial Check-in
    const res = await request.post('/api/check-ins', {
      headers: adminHeaders,
      data: { guest_id: guests[0].id }
    });
    
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.alreadyCheckedIn).toBe(false);
    expect(data.checkIn).toBeDefined();

    // 2. Duplicate Check-in
    const res2 = await request.post('/api/check-ins', {
      headers: adminHeaders,
      data: { guest_id: guests[0].id }
    });
    
    expect(res2.status()).toBe(200);
    const data2 = await res2.json();
    expect(data2.success).toBe(true);
    expect(data2.alreadyCheckedIn).toBe(true);
  });

  test('Revoked guest can still be checked in physically', async ({ request }) => {
    // Revoke guest[1]
    const revokeRes = await request.post(`/api/guests/${guests[1].id}/revoke`, {
      headers: adminHeaders
    });
    expect(revokeRes.status()).toBe(200);

    // Try check-in
    const checkinRes = await request.post('/api/check-ins', {
      headers: adminHeaders,
      data: { guest_id: guests[1].id }
    });

    // Should succeed because Option C dictates ignoring revocation for physical checkin
    expect(checkinRes.status()).toBe(200);
    const data = await checkinRes.json();
    expect(data.success).toBe(true);
  });

  test('Quick Add creates guest and checks in seamlessly', async ({ request }) => {
    // 1. Create Guest
    const createRes = await request.post('/api/guests', {
      headers: adminHeaders,
      data: {
        wedding_id: weddingId,
        first_name: 'Hızlı',
        last_name: 'Eklenen',
        rsvp_status: 'attending'
      }
    });
    
    expect(createRes.status()).toBe(200);
    const createData = await createRes.json();
    const newGuestId = createData.guest.id;

    // 2. Check-in
    const checkinRes = await request.post('/api/check-ins', {
      headers: adminHeaders,
      data: { guest_id: newGuestId }
    });

    expect(checkinRes.status()).toBe(200);
    const checkinData = await checkinRes.json();
    expect(checkinData.success).toBe(true);
    expect(checkinData.guest.first_name).toBe('Hızlı');
  });
});
