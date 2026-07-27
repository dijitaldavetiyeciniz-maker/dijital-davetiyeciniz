import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const AUDIT_DIR = path.join(process.cwd(), 'test-results/flagship-visual-audit');

const FLAGSHIP_IDS = [
  'parisian-black-tie',
  'grand-opera-ballroom',
  'moonlit-secret-garden',
  'vogue-wedding-editorial',
  'mediterranean-ceramic-garden',
  'ottoman-illumination',
  'coastal-sunset',
  'aurora-glass',
  'fine-art-botanical-watercolor',
  'film-premiere-night',
  'minimal-swiss-gallery',
  'royal-palace-invitation',
  'henna-palace-night',
  'prince-ceremony',
  'storybook-babyshower',
  'storybook-birthday',
  'future-summit',
];

const TEST_SLUG = 'flagship-audit-test-slug';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fghafzgfkkjraeopberz.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_zZSgJpBJZDTIuemzkNonIA_m_RNaP9W';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

test.describe('PART 3 — 20-Step Flagship Visual Audit', () => {
  // Use sequential mode because we are persisting state on the same test wedding
  test.describe.configure({ mode: 'serial' });

  test.beforeAll(async () => {
    if (!fs.existsSync(AUDIT_DIR)) {
      fs.mkdirSync(AUDIT_DIR, { recursive: true });
    } else {
      // Clean up previous run
      fs.readdirSync(AUDIT_DIR).forEach(f => fs.unlinkSync(path.join(AUDIT_DIR, f)));
    }

    // Step 1: İzole test davetiyesi oluştur
    await supabase.from('weddings').delete().eq('slug', TEST_SLUG);
    
    await supabase.from('weddings').insert([{
      slug: TEST_SLUG,
      bride_name: 'Zeynep Su Nazlıcan',
      groom_name: 'Muhammed Emirhan Alparslan',
      wedding_date: '2026-09-12T19:30:00.000Z',
      venue_name: 'İstanbul Boğazı Uluslararası Davet ve Organizasyon Merkezi',
      event_type: 'Düğün',
      template_id: 'template1',
      admin_password: 'demo',
      is_paid: true,
      custom_overrides: {
        content: {
          brideName: 'Zeynep Su Nazlıcan',
          groomName: 'Muhammed Emirhan Alparslan',
          venueName: 'İstanbul Boğazı Uluslararası Davet ve Organizasyon Merkezi'
        }
      }
    }]);
  });

  test.afterAll(async () => {
    await supabase.from('weddings').delete().eq('slug', TEST_SLUG);
  });

  for (const tplId of FLAGSHIP_IDS) {
    test(`Flagship End-to-End Persistence and DOM Check: ${tplId}`, async ({ page, browser }) => {
      test.setTimeout(120000); // Give enough time for persistence and loading

      // Targeted dialog management
      page.on('dialog', async dialog => {
        const msg = dialog.message();
        if (msg.includes('Bu şablonu uygulamak istediğinize emin misiniz')) {
          await dialog.accept();
        } else if (msg.includes('başarıyla kaydedildi')) {
          await dialog.accept();
        } else {
          console.error('Unexpected dialog:', msg);
          try { await dialog.dismiss(); } catch (e) {}
          throw new Error('Unexpected dialog: ' + msg);
        }
      });

      // Step 2: /d/[wedding_id]/admin rotasını aç
      await page.goto(`/d/${TEST_SLUG}/admin`);
      await page.waitForLoadState('networkidle');

      // Login or Dashboard step
      const pwdInput = page.locator('input[type="password"]');
      const studioBtn = page.locator('button:has-text("Tasarım Stüdyosu")').first();
      
      // Wait for either login input or the studio button
      await Promise.any([
        pwdInput.waitFor({ state: 'visible', timeout: 15000 }),
        studioBtn.waitFor({ state: 'visible', timeout: 15000 })
      ]).catch(() => {});

      if (await pwdInput.isVisible()) {
        await pwdInput.fill('demo');
        await page.click('button:has-text("Giriş Yap")');
        await studioBtn.waitFor({ state: 'visible', timeout: 15000 });
      }

      // Step 3: Şablonu gerçek portal kataloğundan seç
      await studioBtn.click();
      
      // Click the 'Şablon & Tema' tab to reveal the gallery
      await page.click('button:has-text("Şablon & Tema")');
      
      try {
        await page.waitForSelector(`[data-testid="template-${tplId}"]`, { state: 'visible', timeout: 5000 });
      } catch (e) {
        console.error(`Could not find [data-testid="template-${tplId}"]. Printing available testids:`);
        const availableTemplates = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('[data-testid^="template-"]'))
            .map(el => el.getAttribute('data-testid'));
        });
        console.error(availableTemplates);
        throw e;
      }
      
      await page.click(`[data-testid="template-${tplId}"]`);
      
      // Wait for actual DOM state update (No timeouts!)
      await page.waitForSelector(`[data-testid="template-${tplId}"]:has-text("Uygulandı")`, { state: 'visible', timeout: 5000 });
      
      // Step 6: Save isteğini gerçekleştir
      await page.click('button:has-text("Değişiklikleri Kaydet & Önizlemeyi Yenile")');
      await page.waitForLoadState('networkidle');
      
      // Wait a moment for iframe to reload in real portal
      await page.waitForTimeout(2000);

      // Verify persistence in DB
      const { data: weddingDb } = await supabase.from('weddings').select('template_id, custom_overrides').eq('slug', TEST_SLUG).single();
      expect(weddingDb?.template_id).toBe(tplId);

      // Step 11: Admin dashboard'ın kendisinin de seçilen template ile senkron kalıp kalmadığına bak (Reload ile)
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Assert session is NOT lost on reload
      const pwdInputAfterReload = page.locator('input[type="password"]');
      expect(await pwdInputAfterReload.isVisible(), 'Session was lost on reload!').toBe(false);

      const studioBtnReload = page.locator('button:has-text("Tasarım Stüdyosu")').first();
      await Promise.any([
        studioBtnReload.waitFor({ state: 'visible', timeout: 15000 })
      ]).catch(() => {});
      
      if (await studioBtnReload.isVisible()) {
        await studioBtnReload.click();
      }

      // Step 12: Yeni ve temiz browser context oluştur
      const publicContext = await browser.newContext();
      const publicPage = await publicContext.newPage();
      
      // Step 13: /d/[slug] public rotasını aç
      await publicPage.goto(`/d/${TEST_SLUG}`);
      await publicPage.waitForLoadState('networkidle');
      await publicPage.waitForTimeout(1500); // Allow fonts and images

      // Dismiss envelope if it exists
      await publicPage.click('body').catch(() => {});
      await publicPage.waitForTimeout(1500);

      // Step 15: Public renderer'ın beklenen layout componentini kullandığını doğrula
      const root = publicPage.locator('[data-template-id]').first();
      await root.waitFor({ state: 'attached', timeout: 5000 });
      
      const actualTplId = await root.getAttribute('data-template-id');
      const actualLayoutId = await root.getAttribute('data-layout-id');
      
      expect(actualTplId, `Template ID mismatch on Public route! Expected: ${tplId}, got: ${actualTplId}`).toBe(tplId);
      expect(actualLayoutId, `Layout ID is missing or invalid on Public route!`).toBeTruthy();
      expect(actualLayoutId).not.toBe('default-fallback'); // Default fallback not allowed!

      // Step 20: Bundan sonra screenshot al (Mobil)
      await publicPage.setViewportSize({ width: 390, height: 844 });
      await publicPage.waitForTimeout(500); // allow layout adjustment
      await publicPage.screenshot({ path: path.join(AUDIT_DIR, `${tplId}-mobile-390x844.png`), fullPage: false });

      // Desktop screenshot
      await publicPage.setViewportSize({ width: 1440, height: 900 });
      await publicPage.waitForTimeout(500);
      await publicPage.screenshot({ path: path.join(AUDIT_DIR, `${tplId}-desktop-1440x900.png`), fullPage: false });

      // Step 14: Gerçek Uzun İçerik ve Piksel Testi (Check for horizontal overflow)
      const scrollWidth = await publicPage.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await publicPage.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth, `Horizontal overflow detected on template ${tplId}`).toBeLessThanOrEqual(clientWidth + 5);

      await publicContext.close();
    });
  }

  test('Verify zero exact duplicate screenshots across all generated audit PNGs', () => {
    const files = fs.readdirSync(AUDIT_DIR).filter(f => f.endsWith('.png'));
    // We expect 34 files (17 mobile, 17 desktop)
    expect(files.length).toBe(34);

    const hashes = new Set<string>();

    for (const f of files) {
      const buf = fs.readFileSync(path.join(AUDIT_DIR, f));
      const hash = crypto.createHash('sha256').update(buf).digest('hex');

      expect(hashes.has(hash), `Duplicate screenshot detected for file: ${f}`).toBe(false);
      hashes.add(hash);
    }
  });

  test('Şablon kaydetme race condition (Hızlı seçim ve kaydetme)', async ({ page, browser }) => {
    test.setTimeout(60000);
    
    // Dialog handler
    page.on('dialog', async dialog => {
      const msg = dialog.message();
      if (msg.includes('Bu şablonu uygulamak') || msg.includes('başarıyla kaydedildi')) {
        await dialog.accept();
      } else {
        await dialog.dismiss();
      }
    });

    // 1. Admin rotasını aç
    await page.goto(`/d/${TEST_SLUG}/admin`);
    await page.waitForLoadState('networkidle');

    // Login if necessary
    const pwdInput = page.locator('input[type="password"]');
    const studioBtn = page.locator('button:has-text("Tasarım Stüdyosu")').first();
    
    await Promise.any([
      pwdInput.waitFor({ state: 'visible', timeout: 15000 }),
      studioBtn.waitFor({ state: 'visible', timeout: 15000 })
    ]).catch(() => {});

    if (await pwdInput.isVisible()) {
      await pwdInput.fill('demo');
      await page.click('button:has-text("Giriş Yap")');
    }

    // 2. Tasarım Stüdyosu'na geç ve şablon sekmesini aç
    await studioBtn.waitFor({ state: 'visible', timeout: 15000 });
    await studioBtn.click();
    await page.click('button:has-text("Şablon & Tema")');
    
    // A şablonu (template1) ve B şablonu (template2)
    const templateA = 'parisian-black-tie';
    const templateB = 'grand-opera-ballroom';
    
    await page.waitForSelector(`[data-testid="template-${templateA}"]`, { state: 'visible' });
    
    // 3. A şablonunu seç
    await page.click(`[data-testid="template-${templateA}"]`);
    
    // 4. Hemen B şablonunu seç
    await page.click(`[data-testid="template-${templateB}"]`);
    
    // 5. Beklemeden kaydet
    await page.click('button:has-text("Değişiklikleri Kaydet & Önizlemeyi Yenile")');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // 6. Veritabanında B şablonunun kayıtlı olduğunu doğrula
    const { data: weddingDb } = await supabase.from('weddings').select('template_id').eq('slug', TEST_SLUG).single();
    expect(weddingDb?.template_id, 'Race condition: Eski template kaydedildi!').toBe(templateB);
    
    // 7. Sayfayı yenile
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // 8. B şablonunun seçili olduğunu doğrula
    await studioBtn.click();
    await page.click('button:has-text("Şablon & Tema")');
    const selectedTemplate = page.locator(`[data-testid="template-${templateB}"]:has-text("Uygulandı")`);
    await expect(selectedTemplate).toBeVisible();

    // 9. Public rotada B şablonunun render edildiğini doğrula
    const publicContext = await browser.newContext();
    const publicPage = await publicContext.newPage();
    await publicPage.goto(`/d/${TEST_SLUG}`);
    await publicPage.waitForLoadState('networkidle');
    
    // Dismiss envelope if it exists
    await publicPage.waitForTimeout(500);
    await publicPage.click('body').catch(() => {});
    await publicPage.waitForTimeout(1500);
    
    const root = publicPage.locator('[data-template-id]').first();
    await root.waitFor({ state: 'attached', timeout: 5000 });
    expect(await root.getAttribute('data-template-id')).toBe(templateB);
    
    await publicContext.close();
  });
});
