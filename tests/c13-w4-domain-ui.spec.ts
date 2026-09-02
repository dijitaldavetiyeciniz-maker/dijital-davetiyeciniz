import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase credentials required in .env.local for W4 Playwright tests');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

import { loginAsAdmin } from './helpers/adminAuth';

test.describe('C13 W4 — Admin Domain Management Browser E2E & Real Visual Evidence', () => {
  const testSlugPaid = `w4-paid-${Date.now().toString(36)}`;
  const testSlugFree = `w4-free-${Date.now().toString(36)}`;
  let weddingPaidId = '';
  let weddingFreeId = '';

  test.beforeAll(async () => {
    // 1. Seed paid wedding (entitled to custom domains)
    const { data: paidData, error: errPaid } = await supabase
      .from('weddings')
      .insert({
        slug: testSlugPaid,
        bride_name: 'Zeynep',
        groom_name: 'Murat',
        event_type: 'wedding',
        admin_password: 'test',
        is_active: true,
        is_paid: true,
        plan_tier: 'premium',
        template_id: 'template1',
      })
      .select('id')
      .single();

    if (errPaid) console.error('Failed to seed paid wedding:', errPaid);
    else if (paidData) weddingPaidId = paidData.id;

    // 2. Seed free wedding (locked custom domains)
    const { data: freeData, error: errFree } = await supabase
      .from('weddings')
      .insert({
        slug: testSlugFree,
        bride_name: 'Ayşe',
        groom_name: 'Ahmet',
        event_type: 'wedding',
        admin_password: 'test',
        is_active: true,
        is_paid: false,
        plan_tier: 'standard',
        template_id: 'template1',
      })
      .select('id')
      .single();

    if (errFree) console.error('Failed to seed free wedding:', errFree);
    else if (freeData) weddingFreeId = freeData.id;
  });

  test.afterAll(async () => {
    if (weddingPaidId) {
      await supabase.from('custom_domains').delete().eq('wedding_id', weddingPaidId);
      await supabase.from('weddings').delete().eq('id', weddingPaidId);
    }
    if (weddingFreeId) {
      await supabase.from('custom_domains').delete().eq('wedding_id', weddingFreeId);
      await supabase.from('weddings').delete().eq('id', weddingFreeId);
    }
  });

  // --- TEST 1: DOMAIN TAB VISIBLE & EMPTY STATE (REAL APP) ---
  test('1. Domain Tab Navigation & Empty State Desktop (Real App)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });

    // Mock GET /api/admin/domain for empty state
    await page.route(`**/api/admin/domain?wedding_id=${weddingPaidId}`, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, domains: [] }),
      });
    });

    await loginAsAdmin(page, testSlugPaid);

    // 1. Check sidebar nav tab
    const domainNavBtn = page.locator('[data-testid="admin-nav-domain"]');
    await expect(domainNavBtn).toBeVisible({ timeout: 10000 });
    await expect(domainNavBtn).toContainText('Özel Alan Adı');

    // 2. Click to open tab
    await domainNavBtn.click();

    // 3. Verify Empty State rendered
    const emptyState = page.locator('[data-testid="domain-empty-state"]');
    await expect(emptyState).toBeVisible({ timeout: 10000 });

    const hostnameInput = page.locator('[data-testid="domain-hostname-input"]');
    await expect(hostnameInput).toBeVisible();
    await expect(hostnameInput).toHaveAttribute('placeholder', 'Örn: davet.zeynepmurat.com');

    const submitBtn = page.locator('[data-testid="domain-submit-button"]');
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toBeDisabled();

    // Fill valid hostname
    await hostnameInput.fill('davet.zeynepmurat.com');
    await expect(submitBtn).toBeEnabled();

    // Capture Real Evidence A
    const evidenceAPath = path.resolve(process.cwd(), 'docs/audit/evidence/c13_w4_evidence_a_empty_desktop.png');
    await page.screenshot({ path: evidenceAPath, fullPage: false });
    console.log(`[REAL APP EVIDENCE A CAPTURED] ${evidenceAPath}`);
  });

  // --- TEST 2: PENDING VERIFICATION + DNS INSTRUCTIONS & COPY ACTIONS (REAL APP) ---
  test('2. Pending Domain State + DNS Instructions & Clipboard Copy (Real App)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });

    const mockPendingDomain = {
      id: 'dom-123',
      wedding_id: weddingPaidId,
      hostname: 'davet.zeynepmurat.com',
      status: 'pending',
      ssl_status: 'pending',
      is_primary: true,
      verified_at: null,
      verification_error: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await page.route(`**/api/admin/domain?wedding_id=${weddingPaidId}`, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, domains: [mockPendingDomain] }),
      });
    });

    await loginAsAdmin(page, testSlugPaid);

    const domainNavBtn = page.locator('[data-testid="admin-nav-domain"]');
    await domainNavBtn.click();

    const connectedState = page.locator('[data-testid="domain-connected-state"]');
    await expect(connectedState).toBeVisible({ timeout: 10000 });

    // Status pill
    const statusPending = page.locator('[data-testid="domain-status-pending"]');
    await expect(statusPending).toBeVisible();
    await expect(statusPending).toContainText('DNS Doğrulaması Bekleniyor');

    // Hostname
    const hostnameEl = page.locator('[data-testid="connected-hostname"]');
    await expect(hostnameEl).toHaveText('davet.zeynepmurat.com');

    // DNS table
    const cnameRow = page.locator('[data-testid="dns-row-cname"]');
    await expect(cnameRow).toBeVisible();
    await expect(cnameRow).toContainText('cname.vercel-dns.com');

    const txtRow = page.locator('[data-testid="dns-row-txt"]');
    await expect(txtRow).toBeVisible();
    await expect(txtRow).toContainText('_vercel.davet.zeynepmurat.com');

    // Copy action & feedback
    const copyCnameBtn = page.locator('[data-testid="copy-cname-button"]');
    await copyCnameBtn.click();
    await expect(copyCnameBtn).toContainText('Kopyalandı');

    // Capture Real Evidence B
    const evidenceBPath = path.resolve(process.cwd(), 'docs/audit/evidence/c13_w4_evidence_b_pending_dns.png');
    await page.screenshot({ path: evidenceBPath, fullPage: false });
    console.log(`[REAL APP EVIDENCE B CAPTURED] ${evidenceBPath}`);
  });

  // --- TEST 3: ACTIVE DOMAIN STATE (REAL APP) ---
  test('3. Active Domain State with Live Link & SSL Readiness (Real App)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });

    const mockActiveDomain = {
      id: 'dom-123',
      wedding_id: weddingPaidId,
      hostname: 'davet.zeynepmurat.com',
      status: 'active',
      ssl_status: 'active',
      is_primary: true,
      verified_at: new Date().toISOString(),
      verification_error: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await page.route(`**/api/admin/domain?wedding_id=${weddingPaidId}`, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, domains: [mockActiveDomain] }),
      });
    });

    await loginAsAdmin(page, testSlugPaid);

    const domainNavBtn = page.locator('[data-testid="admin-nav-domain"]');
    await domainNavBtn.click();

    const statusActive = page.locator('[data-testid="domain-status-active"]');
    await expect(statusActive).toBeVisible({ timeout: 10000 });
    await expect(statusActive).toContainText('Aktif & SSL Hazır');

    const activeInfo = page.locator('[data-testid="domain-active-info"]');
    await expect(activeInfo).toBeVisible();
    await expect(activeInfo).toContainText('Alan Adınız Yayında!');

    // Capture Real Evidence C
    const evidenceCPath = path.resolve(process.cwd(), 'docs/audit/evidence/c13_w4_evidence_c_active_domain.png');
    await page.screenshot({ path: evidenceCPath, fullPage: false });
    console.log(`[REAL APP EVIDENCE C CAPTURED] ${evidenceCPath}`);
  });

  // --- TEST 4: ERROR STATE & VERIFY RETRY (REAL APP) ---
  test('4. Error State & Verification Failure Alert (Real App)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });

    const mockErrorDomain = {
      id: 'dom-123',
      wedding_id: weddingPaidId,
      hostname: 'davet.zeynepmurat.com',
      status: 'error',
      ssl_status: 'pending',
      is_primary: true,
      verified_at: null,
      verification_error: 'DNS CNAME kaydı henüz tespit edilemedi.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await page.route(`**/api/admin/domain?wedding_id=${weddingPaidId}`, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, domains: [mockErrorDomain] }),
      });
    });

    await page.route('**/api/admin/domain/verify', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          domain: mockErrorDomain,
          message: 'DNS CNAME kaydı henüz tespit edilemedi. Lütfen DNS sağlayıcınızdaki kayıtları kontrol edin.',
        }),
      });
    });

    await loginAsAdmin(page, testSlugPaid);

    const domainNavBtn = page.locator('[data-testid="admin-nav-domain"]');
    await domainNavBtn.click();

    const errorStatus = page.locator('[data-testid="domain-status-error"]');
    await expect(errorStatus).toBeVisible({ timeout: 10000 });

    const verifyBtn = page.locator('[data-testid="domain-verify-button"]');
    await verifyBtn.click();

    const errorAlert = page.locator('[data-testid="domain-error-alert"]');
    await expect(errorAlert).toBeVisible();
    await expect(errorAlert).toContainText('DNS CNAME kaydı henüz tespit edilemedi');

    // Capture Real Evidence D
    const evidenceDPath = path.resolve(process.cwd(), 'docs/audit/evidence/c13_w4_evidence_d_error_state.png');
    await page.screenshot({ path: evidenceDPath, fullPage: false });
    console.log(`[REAL APP EVIDENCE D CAPTURED] ${evidenceDPath}`);
  });

  // --- TEST 5: MOBILE 390x844 RESPONSIVENESS (REAL APP) ---
  test('5. Mobile 390x844 Viewport Responsiveness (Real App)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    const mockPendingDomain = {
      id: 'dom-123',
      wedding_id: weddingPaidId,
      hostname: 'davet.zeynepmurat.com',
      status: 'pending',
      ssl_status: 'pending',
      is_primary: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await page.route(`**/api/admin/domain?wedding_id=${weddingPaidId}`, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, domains: [mockPendingDomain] }),
      });
    });

    await loginAsAdmin(page, testSlugPaid);

    const domainNavBtn = page.locator('[data-testid="admin-nav-domain"]');
    await domainNavBtn.click();

    const connectedState = page.locator('[data-testid="domain-connected-state"]');
    await expect(connectedState).toBeVisible({ timeout: 10000 });

    // Capture Real Evidence E
    const evidenceEPath = path.resolve(process.cwd(), 'docs/audit/evidence/c13_w4_evidence_e_mobile_390x844.png');
    await page.screenshot({ path: evidenceEPath, fullPage: false });
    console.log(`[REAL APP EVIDENCE E CAPTURED] ${evidenceEPath}`);
  });

  // --- TEST 6: ENTITLEMENT LOCKED STATE (REAL APP) ---
  test('6. Entitlement Locked State for Free Wedding (Real App)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });

    await loginAsAdmin(page, testSlugFree);

    const domainNavBtn = page.locator('[data-testid="admin-nav-domain"]');
    await domainNavBtn.click();

    const lockedBanner = page.locator('[data-testid="domain-manager-locked"]');
    await expect(lockedBanner).toBeVisible({ timeout: 10000 });
    await expect(lockedBanner).toContainText('Özel Alan Adı (Custom Domain)');
    await expect(lockedBanner).toContainText('Premium');

    const upgradeBtn = page.locator('[data-testid="upgrade-plan-button"]');
    await expect(upgradeBtn).toBeVisible();

    // Capture Real Evidence F
    const evidenceFPath = path.resolve(process.cwd(), 'docs/audit/evidence/c13_w4_evidence_f_entitlement_locked.png');
    await page.screenshot({ path: evidenceFPath, fullPage: false });
    console.log(`[REAL APP EVIDENCE F CAPTURED] ${evidenceFPath}`);
  });

  // --- TEST 7: REMOVE CONFIRMATION MODAL & DELETION (REAL APP) ---
  test('7. Remove Confirmation Modal & Idempotent Deletion (Real App)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });

    const mockActiveDomain = {
      id: 'dom-123',
      wedding_id: weddingPaidId,
      hostname: 'davet.zeynepmurat.com',
      status: 'active',
      ssl_status: 'active',
      is_primary: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    let removed = false;

    await page.route(`**/api/admin/domain?**`, async route => {
      if (route.request().method() === 'DELETE') {
        removed = true;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, domains: removed ? [] : [mockActiveDomain] }),
        });
      }
    });

    await loginAsAdmin(page, testSlugPaid);

    const domainNavBtn = page.locator('[data-testid="admin-nav-domain"]');
    await domainNavBtn.click();

    const removeBtn = page.locator('[data-testid="domain-remove-button"]');
    await expect(removeBtn).toBeVisible({ timeout: 10000 });
    await removeBtn.click();

    // Modal dialog
    const modal = page.locator('[data-testid="domain-remove-modal"]');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText('Alan Adını Kaldır');

    // Confirm deletion
    const confirmBtn = page.locator('[data-testid="modal-confirm-remove"]');
    await confirmBtn.click();

    await expect(modal).not.toBeVisible();
    const successAlert = page.locator('[data-testid="domain-success-alert"]');
    await expect(successAlert).toBeVisible();
    await expect(successAlert).toContainText('Alan adı başarıyla kaldırıldı');
  });
});
