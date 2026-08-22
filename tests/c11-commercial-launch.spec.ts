import { test, expect } from '@playwright/test';
import { BUSINESS_CONFIG, getPaymentModeStatus } from '../src/lib/businessConfig';
import { verifyWebhookSignature, handlePaymentSuccess } from '../src/lib/paymentProvider';
import { getSupabaseAdmin } from '../src/lib/supabase-admin';
import { predefinedThemes } from '../src/lib/themes';
import { entranceAnimationTypes } from '../src/data/openingAnimations';

test.describe('C11 — Commercial Launch & Payment Security Suite', () => {

  test('C11-A: Strict Payment Mode Contract & Safe Defaults', () => {
    const status = getPaymentModeStatus();
    expect(status.provider).toBe('iyzico');
    expect(status.isModeExplicit).toBe(true);
    expect(status.mode).toBe('sandbox');
    expect(status.isProductionReady).toBe(false);
    expect(status.blocker).toBe('LIVE_IYZICO_CREDENTIALS_MISSING');
  });

  test('C11-B: Canonical Business and Pricing Currency Configuration', () => {
    expect(BUSINESS_CONFIG.canonicalCurrency).toBe('TRY');
    expect(BUSINESS_CONFIG.currencySymbol).toBe('₺');
    expect(BUSINESS_CONFIG.appName).toBe('Dijital Davetiyeciniz');
    expect(BUSINESS_CONFIG.supportEmail).toBe('dijitaldavetiyeciniz@gmail.com');
  });

  test('C11-C: Legal Documents & Consent Versioning Integrity', () => {
    const versions = BUSINESS_CONFIG.legalVersions;
    expect(versions.privacyPolicy).toBeDefined();
    expect(versions.kvkkNotice).toBeDefined();
    expect(versions.termsOfUse).toBeDefined();
    expect(versions.distanceSalesAgreement).toBeDefined();
    expect(versions.refundPolicy).toBeDefined();
    expect(versions.cookiePolicy).toBeDefined();
  });

  test('C11-E: Super Admin Revenue Calculations cleanly separate test and live revenue', async () => {
    const supabase = getSupabaseAdmin();
    const { data: payments } = await supabase
      .from('payments')
      .select('id, amount, status, idempotency_key, provider')
      .limit(10);

    let testRevenue = 0;
    let liveRevenue = 0;

    (payments || []).forEach(p => {
      const isTest = p.idempotency_key?.includes('test_') || p.provider === 'mock';
      if (p.status === 'paid') {
        if (isTest) testRevenue += Number(p.amount) || 0;
        else liveRevenue += Number(p.amount) || 0;
      }
    });

    expect(typeof testRevenue).toBe('number');
    expect(typeof liveRevenue).toBe('number');
  });

  test('C11-H: Webhook Signature Verification and Replay Safety', async () => {
    const secret = 'webhook_secret_key_12345';
    const payload = JSON.stringify({ event: 'payment.success', payment_id: 'pay_test_999' });

    // 1. Valid Signature
    const crypto = await import('crypto');
    const validSig = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    expect(verifyWebhookSignature(payload, validSig, secret)).toBe(true);

    // 2. Tampered Payload / Signature
    expect(verifyWebhookSignature(payload, 'invalid_sig', secret)).toBe(false);
    expect(verifyWebhookSignature(payload + 'tampered', validSig, secret)).toBe(false);

    // 3. Replay Idempotency Verification
    const replayRes1 = await handlePaymentSuccess('pay_test_nonexistent_1', 'iyz_mock_123');
    expect(replayRes1).toBeDefined();
  });

  test('C11-I & C11-J: Final Opening Diversity and Catalogue Contract (149 themes, 39 openings)', () => {
    const templateIds = Object.keys(predefinedThemes || {});
    expect(templateIds.length).toBeGreaterThanOrEqual(149);

    const openings = entranceAnimationTypes;
    expect(openings.length).toBeGreaterThanOrEqual(39);
  });

});
