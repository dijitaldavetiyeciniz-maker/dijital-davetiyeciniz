import { test, expect } from '@playwright/test';
import crypto from 'crypto';

test.describe('C9 — PAYMENTS, ENTITLEMENTS & OPENING EXPERIENCE 2.0 SUITE', () => {
  const WEBHOOK_SECRET = process.env.IYZICO_WEBHOOK_SECRET || 'iyzico_secret_key_mock';

  test('1. Pricing and Plans API returns all active plan tiers', async ({ page }) => {
    await page.goto('/fiyatlandirma');
    await page.waitForLoadState('domcontentloaded');

    // Verify 3 distinct tier cards are visible
    await expect(page.locator('text=Standart Taslak').first()).toBeVisible();
    await expect(page.locator('text=Premium Paket').first()).toBeVisible();
    await expect(page.locator('text=Kurumsal Paket').first()).toBeVisible();
  });

  test('2. Entitlements engine accurately evaluates Free vs. Premium template access', async () => {
    const { canUseTemplate, canUseOpening, canPublish } = await import('../src/lib/entitlements');

    // Standard free tier
    expect(canUseTemplate('standard', 'template1')).toBe(true);
    expect(canUseTemplate('standard', 'parisian-black-tie')).toBe(false);
    expect(canUseOpening('standard', 'envelope')).toBe(true);
    expect(canUseOpening('standard', 'parisianBlackTie')).toBe(false);

    // Premium tier
    expect(canUseTemplate('premium', 'parisian-black-tie')).toBe(true);
    expect(canUseOpening('premium', 'parisianBlackTie')).toBe(true);

    // Free tier publishing check
    const freeBlocked = canPublish('standard', { is_paid: false, template_id: 'parisian-black-tie' });
    expect(freeBlocked.allowed).toBe(false);
    expect(freeBlocked.error).toContain('Premium pakete dahildir');

    // Premium tier publishing check
    const premiumAllowed = canPublish('premium', { is_paid: false, template_id: 'parisian-black-tie' });
    expect(premiumAllowed.allowed).toBe(true);
  });

  test('3. Historical published invitations retain backwards-compatibility regardless of tier', async () => {
    const { canPublish } = await import('../src/lib/entitlements');

    // Existing paid/published invitation is always allowed to publish updates
    const existingPaid = canPublish('standard', { is_paid: true, template_id: 'parisian-black-tie' });
    expect(existingPaid.allowed).toBe(true);
  });

  test('4. Webhook rejects invalid signatures and accepts verified HMAC-SHA256 signatures', async ({ page }) => {
    const { verifyWebhookSignature } = await import('../src/lib/paymentProvider');

    const samplePayload = JSON.stringify({ payment_id: 'test_pay_1', status: 'SUCCESS' });
    const correctSignature = crypto.createHmac('sha256', WEBHOOK_SECRET).update(samplePayload).digest('hex');
    const fakeSignature = 'bad_signature_0000000000000000000000000000000000000000000000000000000000000000';

    expect(verifyWebhookSignature(samplePayload, correctSignature, WEBHOOK_SECRET)).toBe(true);
    expect(verifyWebhookSignature(samplePayload, fakeSignature, WEBHOOK_SECRET)).toBe(false);
    expect(verifyWebhookSignature(samplePayload, '', WEBHOOK_SECRET)).toBe(false);
  });

  test('5. Checkout initialization creates idempotent pending payment record', async () => {
    const { initializePayment } = await import('../src/lib/paymentProvider');

    const testIdempotency = `idem_test_${Date.now()}`;
    const result1 = await initializePayment({
      userId: '00000000-0000-0000-0000-000000000000',
      userEmail: 'pay.test@example.com',
      amount: 1999,
      planCode: 'premium',
      callbackUrl: 'http://localhost:3000/callback',
      idempotencyKey: testIdempotency
    });

    expect(result1.success).toBe(true);
    expect(result1.paymentId).toBeDefined();

    // Calling again with same idempotency key should return existing record
    const result2 = await initializePayment({
      userId: '00000000-0000-0000-0000-000000000000',
      userEmail: 'pay.test@example.com',
      amount: 1999,
      planCode: 'premium',
      callbackUrl: 'http://localhost:3000/callback',
      idempotencyKey: testIdempotency
    });

    expect(result2.paymentId).toBe(result1.paymentId);
  });

  test('6. Payment success activates user subscription and handles refund lifecycle', async () => {
    const { initializePayment, handlePaymentSuccess, handlePaymentRefund } = await import('../src/lib/paymentProvider');

    const init = await initializePayment({
      userId: '00000000-0000-0000-0000-000000000000',
      userEmail: 'lifecycle.test@example.com',
      amount: 1999,
      planCode: 'premium',
      callbackUrl: 'http://localhost:3000/callback'
    });
    expect(init.success).toBe(true);

    const paymentId = init.paymentId!;

    // Process Success
    const successRes = await handlePaymentSuccess(paymentId, 'provider_tx_123');
    expect(successRes.success).toBe(true);

    // Process Refund
    const refundRes = await handlePaymentRefund(paymentId);
    expect(refundRes.success).toBe(true);
  });

  test('7. Opening Experience 2.0: Template matching engine assigns diverse tailored openings', async () => {
    const { getRecommendedOpeningForTemplate, entranceAnimationTypes } = await import('../src/data/openingAnimations');

    // Verify flagship diversity
    expect(getRecommendedOpeningForTemplate('parisian-black-tie')).toBe('parisianBlackTie');
    expect(getRecommendedOpeningForTemplate('grand-opera')).toBe('grandOpera');
    expect(getRecommendedOpeningForTemplate('moonlit-secret-garden')).toBe('moonlitGarden');
    expect(getRecommendedOpeningForTemplate('vogue-editorial')).toBe('vogueEditorial');
    expect(getRecommendedOpeningForTemplate('mediterranean-ceramic-tile')).toBe('mediterraneanCeramic');
    expect(getRecommendedOpeningForTemplate('ottoman-palace-illumination')).toBe('ottomanIllumination');
    expect(getRecommendedOpeningForTemplate('coastal-sunset-driftwood')).toBe('coastalSunset');
    expect(getRecommendedOpeningForTemplate('aurora-borealis-glassmorphism')).toBe('auroraGlass');
    expect(getRecommendedOpeningForTemplate('fine-art-botanical-watercolor')).toBe('botanicalWatercolor');
    expect(getRecommendedOpeningForTemplate('cinema-vintage-premiere')).toBe('filmPremiere');
    expect(getRecommendedOpeningForTemplate('swiss-international-gallery')).toBe('swissGallery');
    expect(getRecommendedOpeningForTemplate('magical-storybook')).toBe('storybook');
    expect(getRecommendedOpeningForTemplate('tech-summit-grid')).toBe('futureSummit');

    // Verify 8 distinct families exist
    const families = new Set(entranceAnimationTypes.map(a => a.family));
    expect(families.size).toBe(8);
  });
});
