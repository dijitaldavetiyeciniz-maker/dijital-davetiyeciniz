import { test, expect } from '@playwright/test';
import crypto from 'crypto';

const MOCK_SECRET = 'iyzico_secret_key_mock';

function generateSignature(payload: string, secret = MOCK_SECRET): string {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

test.describe('Payment Webhook Signature & Idempotency Tests', () => {

  test('Missing signature header must be rejected with 400', async ({ request }) => {
    const res = await request.post('/api/payments/webhook', {
      data: { test: true },
    });
    expect(res.status()).toBe(400);
    const json = await res.json();
    expect(json.error).toContain('eksik');
  });

  test('Invalid HMAC signature must be rejected with 401', async ({ request }) => {
    const payload = JSON.stringify({ payment_id: 'test-123', amount: 1999 });
    const res = await request.post('/api/payments/webhook', {
      headers: {
        'x-iyzico-signature': 'invalid_signature_hash_123',
        'Content-Type': 'application/json',
      },
      data: payload,
    });
    expect(res.status()).toBe(401);
    const json = await res.json();
    expect(json.error).toContain('Geçersiz');
  });

  test('Valid HMAC signature with payload mismatch or missing wedding_id should be rejected safely', async ({ request }) => {
    const payload = JSON.stringify({ payment_id: 'non_existent_id', wedding_id: 'non_existent', amount: 1999 });
    const signature = generateSignature(payload);

    const res = await request.post('/api/payments/webhook', {
      headers: {
        'x-iyzico-signature': signature,
        'Content-Type': 'application/json',
      },
      data: payload,
    });

    // Should reach DB lookup and return 404 because payment_id doesn't exist
    expect([400, 404]).toContain(res.status());
  });
});
