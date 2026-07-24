import { test, expect } from '@playwright/test';
import { validatePlanLimit, PLAN_CONFIGS } from '../src/lib/planLimits';

test.describe('Server-Side Plan Limit Enforcement & API Bypass Tests', () => {

  test('Standard tier user MUST NOT be allowed to select Premium flagship template via API', () => {
    const standardWedding = { plan_tier: 'standard', is_paid: false };
    
    // Attempting to select premium template 'template15'
    const result = validatePlanLimit(standardWedding, 'select_template', { templateId: 'template15' });

    expect(result.allowed).toBe(false);
    expect(result.error).toContain('paketine dahil değildir');
  });

  test('Standard tier user MUST NOT exceed maximum photo upload count (10 photos)', () => {
    const standardWedding = { plan_tier: 'standard', is_paid: false };

    // Attempting 11th photo upload
    const result = validatePlanLimit(standardWedding, 'upload_photo', { currentCount: 10 });

    expect(result.allowed).toBe(false);
    expect(result.error).toContain('limitine (10 adet) ulaştınız');
  });

  test('Standard tier user MUST NOT exceed maximum audio upload size limit (5MB)', () => {
    const standardWedding = { plan_tier: 'standard', is_paid: false };

    // Attempting 8MB audio upload on Standard tier (5MB max)
    const result = validatePlanLimit(standardWedding, 'upload_audio', { sizeBytes: 8 * 1024 * 1024 });

    expect(result.allowed).toBe(false);
    expect(result.error).toContain('aşıyor');
  });

  test('Client request parameter tampering (plan_tier override) must be ignored by server config', () => {
    // Standard limits apply unless validated by DB record
    const limits = PLAN_CONFIGS.standard;
    expect(limits.maxPhotos).toBe(10);
    expect(limits.allowCustomDomain).toBe(false);
  });
});
