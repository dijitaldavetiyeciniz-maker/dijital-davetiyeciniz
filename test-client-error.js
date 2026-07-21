const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

  console.log('Navigating to http://localhost:3001/ ...');
  try {
    await page.goto('http://localhost:3001/', { waitUntil: 'networkidle0' });
    console.log('Homepage loaded successfully.');
  } catch (e) {
    console.log('Navigation to homepage failed:', e);
  }

  console.log('Navigating to http://localhost:3001/d/elif-kerem ...');
  try {
    await page.goto('http://localhost:3001/d/elif-kerem', { waitUntil: 'networkidle0' });
    console.log('Demo page loaded successfully.');
  } catch (e) {
    console.log('Navigation to demo page failed:', e);
  }

  await browser.close();
})();
