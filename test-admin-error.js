const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

  console.log('Navigating to http://localhost:3001/d/elif-kerem/admin ...');
  try {
    await page.goto('http://localhost:3001/d/elif-kerem/admin', { waitUntil: 'networkidle0' });
    console.log('Admin page loaded successfully.');
  } catch (e) {
    console.log('Navigation to admin page failed:', e);
  }

  await browser.close();
})();
