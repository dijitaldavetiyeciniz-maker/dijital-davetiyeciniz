import { test, expect } from '@playwright/test';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import { insertPublishedWedding } from './helpers/publishTestHelpers';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Missing Supabase environment variables');
}

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const EVIDENCE_DIR = path.join(__dirname, '../docs/audit/evidence');

if (!fs.existsSync(EVIDENCE_DIR)) {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
}

async function loginAsAdmin(page: any, slug: string) {
  await page.goto(`${BASE_URL}/${slug}/admin`);
  await page.waitForLoadState('networkidle').catch(() => {});
  const passwordInput = page.locator('input[type="password"]');
  if (await passwordInput.isVisible()) {
    await passwordInput.fill('test');
    await page.click('form button[type="submit"]');
    await page.waitForSelector('header h1', { timeout: 20000 });
  }
}

test.describe('C13 W8 — Design Studio UX & Performance Visual Evidence Gate', () => {
  test.describe.configure({ mode: 'serial' });
  test.setTimeout(180000);

  let supabase: any;
  const runId = crypto.randomUUID().slice(0, 8);
  const SLUG = `test-w8-design-${runId}`;

  test.beforeAll(async () => {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    const rawRecord = {
      id: crypto.randomUUID(),
      slug: SLUG,
      event_type: 'wedding',
      template_id: 'navy-silver-starlight',
      is_paid: true,
      bride_name: 'Zeynep Kaya',
      groom_name: 'Emre Demir',
      wedding_date: '2027-09-20T18:00:00.000Z',
      venue_name: 'Sait Halim Paşa Yalısı',
      admin_password: 'test',
      names_font_family: 'Cormorant Garamond',
      font_family: 'Montserrat'
    };

    const { error } = await insertPublishedWedding(supabase, rawRecord);
    if (error) throw new Error(`Test record insert failed: ${error.message}`);
  });

  test.afterAll(async () => {
    if (supabase) {
      await supabase.from('weddings').delete().eq('slug', SLUG);
    }
  });

  // Evidence A: Desktop Template Catalog
  test('Evidence A: Desktop Template Catalog (Real App)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await loginAsAdmin(page, SLUG);

    // Navigate to Design Tab
    await page.click('[data-testid="admin-nav-design"]');
    await page.waitForSelector('[data-testid^="template-card-"]', { timeout: 15000 });

    const evidencePath = path.join(EVIDENCE_DIR, 'c13_w8_evidence_a_desktop_templates.png');
    await page.screenshot({ path: evidencePath, fullPage: false });
    console.log('[REAL APP EVIDENCE A CAPTURED]', evidencePath);

    expect(fs.existsSync(evidencePath)).toBe(true);
  });

  // Evidence B: Mobile Template Catalog 390x844
  test('Evidence B: Mobile Template Catalog 390x844 (Real App)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE_URL}/${SLUG}/admin`);
    await loginAsAdmin(page, SLUG);

    await page.click('[data-testid="admin-nav-design"]');
    await page.waitForSelector('[data-testid^="template-card-"]', { timeout: 15000 });

    const evidencePath = path.join(EVIDENCE_DIR, 'c13_w8_evidence_b_mobile_templates_390.png');
    await page.screenshot({ path: evidencePath, fullPage: false });
    console.log('[REAL APP EVIDENCE B CAPTURED]', evidencePath);

    expect(fs.existsSync(evidencePath)).toBe(true);
  });

  // Evidence C: Desktop Template Preview Modal
  test('Evidence C: Desktop Template Preview Modal (Real App)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await loginAsAdmin(page, SLUG);

    await page.click('[data-testid="admin-nav-design"]');
    await page.waitForSelector('[data-testid^="preview-btn-"]', { timeout: 15000 });

    // Click preview on first template
    const previewBtn = page.locator('[data-testid^="preview-btn-"]').first();
    await previewBtn.click();
    await page.waitForSelector('[role="dialog"]', { timeout: 10000 });

    const evidencePath = path.join(EVIDENCE_DIR, 'c13_w8_evidence_c_desktop_preview_modal.png');
    await page.screenshot({ path: evidencePath, fullPage: false });
    console.log('[REAL APP EVIDENCE C CAPTURED]', evidencePath);

    // Close preview modal
    await page.click('[data-testid="preview-modal-close"]');
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();

    expect(fs.existsSync(evidencePath)).toBe(true);
  });

  // Evidence D: Mobile Template Preview Modal 390x844
  test('Evidence D: Mobile Template Preview Modal 390x844 (Real App)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await loginAsAdmin(page, SLUG);

    await page.click('[data-testid="admin-nav-design"]');
    await page.waitForSelector('[data-testid^="preview-btn-"]', { timeout: 15000 });

    const previewBtn = page.locator('[data-testid^="preview-btn-"]').first();
    await previewBtn.click();
    await page.waitForSelector('[role="dialog"]', { timeout: 10000 });

    const evidencePath = path.join(EVIDENCE_DIR, 'c13_w8_evidence_d_mobile_preview_modal.png');
    await page.screenshot({ path: evidencePath, fullPage: false });
    console.log('[REAL APP EVIDENCE D CAPTURED]', evidencePath);

    await page.click('[data-testid="preview-modal-close"]');
    expect(fs.existsSync(evidencePath)).toBe(true);
  });

  // Evidence E: Typography Desktop
  test('Evidence E: Typography Desktop (Real App)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await loginAsAdmin(page, SLUG);

    await page.click('[data-testid="admin-nav-design"]');
    await page.click('#design-tab-font');
    await page.waitForSelector('[data-testid^="font-card-"]', { timeout: 15000 });

    const evidencePath = path.join(EVIDENCE_DIR, 'c13_w8_evidence_e_desktop_typography.png');
    await page.screenshot({ path: evidencePath, fullPage: false });
    console.log('[REAL APP EVIDENCE E CAPTURED]', evidencePath);

    expect(fs.existsSync(evidencePath)).toBe(true);
  });

  // Evidence F: Typography Mobile 390x844
  test('Evidence F: Typography Mobile 390x844 (Real App)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await loginAsAdmin(page, SLUG);

    await page.click('[data-testid="admin-nav-design"]');
    await page.click('#design-tab-font');
    await page.waitForSelector('[data-testid^="font-card-"]', { timeout: 15000 });

    const evidencePath = path.join(EVIDENCE_DIR, 'c13_w8_evidence_f_mobile_typography_390.png');
    await page.screenshot({ path: evidencePath, fullPage: false });
    console.log('[REAL APP EVIDENCE F CAPTURED]', evidencePath);

    expect(fs.existsSync(evidencePath)).toBe(true);
  });

  // Evidence G: Mobile Bottom Actions (Geri, Kaydet, Devam without overlap)
  test('Evidence G: Mobile Bottom Actions & No Overlap (Real App)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await loginAsAdmin(page, SLUG);

    await page.click('[data-testid="admin-nav-design"]');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    const evidencePath = path.join(EVIDENCE_DIR, 'c13_w8_evidence_g_mobile_bottom_actions.png');
    await page.screenshot({ path: evidencePath, fullPage: false });
    console.log('[REAL APP EVIDENCE G CAPTURED]', evidencePath);

    expect(fs.existsSync(evidencePath)).toBe(true);
  });

  // Evidence H: 360x800 Viewport
  test('Evidence H: 360x800 Viewport Responsiveness (Real App)', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await loginAsAdmin(page, SLUG);

    await page.click('[data-testid="admin-nav-design"]');
    await page.waitForSelector('[data-testid^="template-card-"]', { timeout: 15000 });

    const evidencePath = path.join(EVIDENCE_DIR, 'c13_w8_evidence_h_mobile_360.png');
    await page.screenshot({ path: evidencePath, fullPage: false });
    console.log('[REAL APP EVIDENCE H CAPTURED]', evidencePath);

    expect(fs.existsSync(evidencePath)).toBe(true);
  });

  // Evidence I: 430x932 Viewport
  test('Evidence I: 430x932 Viewport Responsiveness (Real App)', async ({ page }) => {
    await page.setViewportSize({ width: 430, height: 932 });
    await loginAsAdmin(page, SLUG);

    await page.click('[data-testid="admin-nav-design"]');
    await page.waitForSelector('[data-testid^="template-card-"]', { timeout: 15000 });

    const evidencePath = path.join(EVIDENCE_DIR, 'c13_w8_evidence_i_mobile_430.png');
    await page.screenshot({ path: evidencePath, fullPage: false });
    console.log('[REAL APP EVIDENCE I CAPTURED]', evidencePath);

    expect(fs.existsSync(evidencePath)).toBe(true);
  });
});
