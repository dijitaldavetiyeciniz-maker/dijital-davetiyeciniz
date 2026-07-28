const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  console.log('Starting browser...');
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('Navigating to admin...');
  await page.goto('http://localhost:3000/d/flagship-audit-test-slug/admin');
  
  await page.waitForTimeout(2000);
  
  const pwdInput = page.locator('input[type="password"]');
  if (await pwdInput.isVisible()) {
    console.log('Filling password...');
    await pwdInput.fill('demo');
    await page.click('button:has-text("Giriş Yap")');
    await page.waitForTimeout(2000);
  }

  console.log('Clicking Tasarım Stüdyosu...');
  const studioBtn = page.locator('button:has-text("Tasarım Stüdyosu")').first();
  if (await studioBtn.isVisible()) {
    await studioBtn.click();
  } else {
    console.log('Studio button not visible');
  }
  
  await page.waitForTimeout(1000);
  
  console.log('Clicking Şablon & Tema...');
  await page.click('button:has-text("Şablon & Tema")').catch(() => console.log('Tab not found'));
  
  await page.waitForTimeout(2000);
  
  console.log('Taking screenshot...');
  await page.screenshot({ path: 'debug-admin.png' });
  
  const testids = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[data-testid^="template-"]'))
      .map(el => el.getAttribute('data-testid'));
  });
  console.log('Available testids:', testids.length, testids.slice(0, 5));
  
  await browser.close();
})();
