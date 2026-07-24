# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: part1-security-events.spec.ts >> PART 1 — Security, Dashboard Soft Delete & Event Type Architecture >> Sünnet event type must have 0 Gelin or Damat language
- Location: tests\part1-security-events.spec.ts:50:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/d/demo1/admin
Call log:
  - navigating to "http://localhost:3000/d/demo1/admin", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { sanitizePublicWedding } from '../src/lib/sanitizeWedding';
  3  | 
  4  | test.describe('PART 1 — Security, Dashboard Soft Delete & Event Type Architecture', () => {
  5  | 
  6  |   test('Public response sanitization removes 100% of sensitive fields', () => {
  7  |     const rawWedding = {
  8  |       id: 'test-id',
  9  |       slug: 'test-slug',
  10 |       bride_name: 'Ayşe',
  11 |       groom_name: 'Ahmet',
  12 |       telegram_bot_token: 'secret-token-12345',
  13 |       telegram_chat_id: 'chat-999',
  14 |       user_email: 'secret@user.com',
  15 |       service_role_key: 'super-secret',
  16 |       admin_notes: 'private notes'
  17 |     };
  18 | 
  19 |     const clean = sanitizePublicWedding(rawWedding);
  20 | 
  21 |     expect(clean).toBeDefined();
  22 |     expect(clean.slug).toBe('test-slug');
  23 |     expect(clean.bride_name).toBe('Ayşe');
  24 | 
  25 |     // Sensitive fields removed
  26 |     expect(clean.telegram_bot_token).toBeUndefined();
  27 |     expect(clean.telegram_chat_id).toBeUndefined();
  28 |     expect(clean.user_email).toBeUndefined();
  29 |     expect(clean.service_role_key).toBeUndefined();
  30 |     expect(clean.admin_notes).toBeUndefined();
  31 |   });
  32 | 
  33 |   test('Baby Shower event type must prioritize Baby Name and have 0 Gelin Adı / Doğum Günü language', async ({ page }) => {
  34 |     await page.goto('/d/demo1/admin');
  35 | 
  36 |     const select = page.locator('select').first();
  37 |     if (await select.isVisible()) {
  38 |       await select.selectOption({ label: 'Baby Shower Daveti' });
  39 |       await page.waitForTimeout(300);
  40 | 
  41 |       // Label check
  42 |       await expect(page.locator('text=Bebeğin Adı veya Kullanılacak Hitap')).toBeVisible();
  43 | 
  44 |       // Zero incorrect language
  45 |       await expect(page.locator('label', { hasText: 'Gelin Adı' })).toHaveCount(0);
  46 |       await expect(page.locator('label', { hasText: 'Doğum Günü Partisi' })).toHaveCount(0);
  47 |     }
  48 |   });
  49 | 
  50 |   test('Sünnet event type must have 0 Gelin or Damat language', async ({ page }) => {
> 51 |     await page.goto('/d/demo1/admin');
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/d/demo1/admin
  52 | 
  53 |     const select = page.locator('select').first();
  54 |     if (await select.isVisible()) {
  55 |       await select.selectOption({ label: 'Sünnet Daveti' });
  56 |       await page.waitForTimeout(300);
  57 | 
  58 |       // Label check
  59 |       await expect(page.locator('text=Çocuğun Adı')).toBeVisible();
  60 |       await expect(page.locator('label', { hasText: 'Gelin Adı' })).toHaveCount(0);
  61 |       await expect(page.locator('label', { hasText: 'Damat Adı' })).toHaveCount(0);
  62 |     }
  63 |   });
  64 | 
  65 |   test('Dashboard page loads correctly and supports soft delete and trash bin structure', async ({ page }) => {
  66 |     await page.goto('/giris-yap');
  67 |     await expect(page.getByRole('button', { name: 'Giriş Yap' })).toBeVisible();
  68 |   });
  69 | 
  70 |   test('Soft delete screen blocks admin route if wedding is inactive or trashed', async ({ page }) => {
  71 |     await page.goto('/d/demo1/admin');
  72 |     const body = page.locator('body');
  73 |     await expect(body).toBeVisible();
  74 |   });
  75 | });
  76 | 
```