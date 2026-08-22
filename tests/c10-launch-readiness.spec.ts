import { test, expect } from '@playwright/test';
import { scrubSecrets, logger, generateCorrelationId } from '../src/lib/logger';
import { trackEvent, getFunnelMetrics } from '../src/lib/analytics';
import { sanitizeErrorMessage } from '../src/lib/errorUtils';
import robots from '../src/app/robots';
import sitemap from '../src/app/sitemap';
import { sendWelcomeEmail, sendPublishConfirmationEmail, sendPaymentReceiptEmail } from '../src/lib/email-service';
import { predefinedThemes } from '../src/lib/themes';
import { getRecommendedOpeningForTemplate, entranceAnimationTypes } from '../src/data/openingAnimations';

test.describe('C10 — Launch Readiness & Production Hardening Suite', () => {

  test('C10-A: Structured Logger scrubs sensitive fields and generates correlation IDs', () => {
    const rawData = {
      user_id: '123-abc',
      password: 'supersecretpassword',
      token: 'jwt.token.here',
      otp: '123456',
      service_role_key: 'sb_secret',
      card_number: '1234-5678-9012-3456',
      nested: {
        access_token: 'nested_secret',
        safe_field: 'public_value'
      }
    };

    const cleaned = scrubSecrets(rawData);
    expect(cleaned.password).toBe('[REDACTED]');
    expect(cleaned.token).toBe('[REDACTED]');
    expect(cleaned.otp).toBe('[REDACTED]');
    expect(cleaned.service_role_key).toBe('[REDACTED]');
    expect(cleaned.card_number).toBe('[REDACTED]');
    expect(cleaned.nested.access_token).toBe('[REDACTED]');
    expect(cleaned.nested.safe_field).toBe('public_value');

    const correlationId = generateCorrelationId();
    expect(correlationId.startsWith('req_')).toBe(true);

    const logEntry = logger.info('TEST_LOG', {
      correlationId,
      meta: rawData
    });
    expect(logEntry.meta?.password).toBe('[REDACTED]');
  });

  test('C10-B: Analytics tracks funnel events without exposing sensitive data', async () => {
    const res = await trackEvent({
      eventName: 'landing_view',
      sessionId: 'sess_test_123',
      properties: {
        device: 'mobile',
        utm_source: 'google',
        password: 'should_be_scrubbed'
      }
    });

    expect(res.success).toBe(true);

    const metrics = await getFunnelMetrics();
    expect(metrics).toBeDefined();
    expect(typeof metrics.landing_view).toBe('number');
  });

  test('C10-C: SEO Robots and Sitemap provide safe indexing rules', () => {
    const robotRules = robots();
    expect(robotRules.rules).toBeDefined();
    const rule = Array.isArray(robotRules.rules) ? robotRules.rules[0] : robotRules.rules;

    // Disallowed private paths
    expect(rule.disallow).toContain('/dashboard/');
    expect(rule.disallow).toContain('/super-admin/');
    expect(rule.disallow).toContain('/onboarding/');
    expect(rule.disallow).toContain('/dogrula');

    // Allowed public paths
    expect(rule.allow).toContain('/');
    expect(rule.allow).toContain('/fiyatlandirma');
    expect(rule.allow).toContain('/sablonlar');

    const sm = sitemap();
    expect(sm.length).toBeGreaterThanOrEqual(10);
    const urls = sm.map(entry => entry.url);
    expect(urls.some(u => u.endsWith('/fiyatlandirma'))).toBe(true);
    expect(urls.some(u => u.includes('/dashboard'))).toBe(false);
    expect(urls.some(u => u.includes('/super-admin'))).toBe(false);
  });

  test('C10-E: Transactional Email lifecycle methods execute successfully', async () => {
    const welcomeRes = await sendWelcomeEmail({
      email: 'test_welcome@example.com',
      name: 'Ayşe Yılmaz'
    });
    expect(welcomeRes.success).toBe(true);

    const publishRes = await sendPublishConfirmationEmail({
      email: 'test_publish@example.com',
      name: 'Mehmet & Ayşe',
      weddingTitle: 'Ayşe & Mehmet Düğün',
      slug: 'ayse-mehmet-dugun'
    });
    expect(publishRes.success).toBe(true);

    const paymentRes = await sendPaymentReceiptEmail({
      email: 'test_payment@example.com',
      name: 'Ayşe Yılmaz',
      planName: 'Her Şey Dahil Premium Paket',
      amount: 1999,
      currency: 'TL'
    });
    expect(paymentRes.success).toBe(true);
  });

  test('C10-G: Error Sanitizer translates database/Postgres errors into Turkish user messages', () => {
    const colError = sanitizeErrorMessage(new Error("Could not find the 'title' column of 'weddings' in the schema cache"));
    expect(colError).toContain('Sunucu veritabanında geçici bir işlem hatası oluştu');

    const authError = sanitizeErrorMessage('JWT expired: token invalid');
    expect(authError).toContain('Oturum süreniz dolmuş olabilir');

    const permissionError = sanitizeErrorMessage('permission denied for table payments');
    expect(permissionError).toContain('yetkiniz bulunmamaktadır');

    const networkError = sanitizeErrorMessage('TypeError: fetch failed');
    expect(networkError).toContain('Sunucuya bağlanılamadı');

    const cleanMsg = sanitizeErrorMessage('Lütfen adınızı girin.');
    expect(cleanMsg).toBe('Lütfen adınızı girin.');
  });

  test('C10-I & C10-D: Template & Opening diversity and lazy-load contracts remain intact', () => {
    const templateIds = Object.keys(predefinedThemes || {});
    expect(templateIds.length).toBe(149);

    const openingCount = entranceAnimationTypes.length;
    expect(openingCount).toBe(39);

    const usageCount: Record<string, number> = {};
    templateIds.forEach(id => {
      const theme = (predefinedThemes as any)[id];
      const resolved = getRecommendedOpeningForTemplate(id, theme?.eventType);
      usageCount[resolved] = (usageCount[resolved] || 0) + 1;
    });

    const uniqueOpeningsUsed = Object.keys(usageCount).length;
    expect(uniqueOpeningsUsed).toBeGreaterThanOrEqual(38);

    // Max reuse per opening remains bounded (<= 8)
    const maxUsage = Math.max(...Object.values(usageCount));
    expect(maxUsage).toBeLessThanOrEqual(8);
  });

});
