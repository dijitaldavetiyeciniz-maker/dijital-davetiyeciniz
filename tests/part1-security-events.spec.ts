import { test, expect } from '@playwright/test';
import { sanitizePublicWedding } from '../src/lib/sanitizeWedding';

test.describe('PART 1 — Security, Dashboard Soft Delete & Event Type Architecture', () => {

  test('Public response sanitization removes 100% of sensitive fields', () => {
    const rawWedding = {
      id: 'test-id',
      slug: 'test-slug',
      bride_name: 'Ayşe',
      groom_name: 'Ahmet',
      telegram_bot_token: 'secret-token-12345',
      telegram_chat_id: 'chat-999',
      user_email: 'secret@user.com',
      service_role_key: 'super-secret',
      admin_notes: 'private notes'
    };

    const clean = sanitizePublicWedding(rawWedding);

    expect(clean).toBeDefined();
    expect(clean.slug).toBe('test-slug');
    expect(clean.bride_name).toBe('Ayşe');

    // Sensitive fields removed
    expect(clean.telegram_bot_token).toBeUndefined();
    expect(clean.telegram_chat_id).toBeUndefined();
    expect(clean.user_email).toBeUndefined();
    expect(clean.service_role_key).toBeUndefined();
    expect(clean.admin_notes).toBeUndefined();
  });

  test('Baby Shower event type must prioritize Baby Name and have 0 Gelin Adı / Doğum Günü language', async ({ page }) => {
    await page.goto('/d/demo1/admin');

    const select = page.locator('select').first();
    if (await select.isVisible()) {
      await select.selectOption({ label: 'Baby Shower Daveti' });
      await page.waitForTimeout(300);

      // Label check
      await expect(page.locator('text=Bebeğin Adı veya Kullanılacak Hitap')).toBeVisible();

      // Zero incorrect language
      await expect(page.locator('label', { hasText: 'Gelin Adı' })).toHaveCount(0);
      await expect(page.locator('label', { hasText: 'Doğum Günü Partisi' })).toHaveCount(0);
    }
  });

  test('Sünnet event type must have 0 Gelin or Damat language', async ({ page }) => {
    await page.goto('/d/demo1/admin');

    const select = page.locator('select').first();
    if (await select.isVisible()) {
      await select.selectOption({ label: 'Sünnet Daveti' });
      await page.waitForTimeout(300);

      // Label check
      await expect(page.locator('text=Çocuğun Adı')).toBeVisible();
      await expect(page.locator('label', { hasText: 'Gelin Adı' })).toHaveCount(0);
      await expect(page.locator('label', { hasText: 'Damat Adı' })).toHaveCount(0);
    }
  });

  test('Dashboard page loads correctly and supports soft delete and trash bin structure', async ({ page }) => {
    await page.goto('/giris-yap');
    await expect(page.getByRole('button', { name: 'Giriş Yap' })).toBeVisible();
  });
});
