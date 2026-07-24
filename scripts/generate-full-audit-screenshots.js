const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function run() {
  const outputDir = path.join(__dirname, '../test-results/full-audit');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });

  const page = await context.newPage();

  console.log('Capturing audit screenshots...');

  // 1. Homepage / Public Demo
  try {
    await page.goto('http://localhost:3000/demo', { waitUntil: 'networkidle', timeout: 15000 });
    await page.screenshot({ path: path.join(outputDir, 'public-demo.png'), fullPage: true });
  } catch (e) {
    console.log('Demo fallback:', e.message);
  }

  // 2. Admin Main & Sections
  try {
    await page.goto('http://localhost:3000/d/demo-wedding/admin', { waitUntil: 'networkidle', timeout: 15000 });
    await page.screenshot({ path: path.join(outputDir, 'admin-main.png') });

    // Mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: path.join(outputDir, 'mobile-preview.png') });
    await page.setViewportSize({ width: 1280, height: 800 });
  } catch (e) {
    console.log('Admin screenshot fallback:', e.message);
  }

  // 3. Template Showcase
  try {
    await page.goto('http://localhost:3000/admin/template-showcase', { waitUntil: 'networkidle', timeout: 15000 });
    await page.screenshot({ path: path.join(outputDir, 'template-selection.png') });
  } catch (e) {
    console.log('Template showcase fallback:', e.message);
  }

  // 4. Public Invitation
  try {
    await page.goto('http://localhost:3000/d/demo-wedding', { waitUntil: 'networkidle', timeout: 15000 });
    await page.screenshot({ path: path.join(outputDir, 'public-invitation.png'), fullPage: true });

    // Mobile Public
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: path.join(outputDir, 'mobile-public.png'), fullPage: true });
  } catch (e) {
    console.log('Public page screenshot fallback:', e.message);
  }

  await browser.close();
  console.log('Audit screenshots generated in test-results/full-audit/');
}

run();
