const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const AUDIT_DIR = path.join(__dirname, '..', 'test-results', 'flagship-visual-audit');

async function createContactSheet(type, cols, width, height) {
  const files = fs.readdirSync(AUDIT_DIR)
    .filter(f => f.includes(`-${type}-`) && f.endsWith('.png') && !f.includes('contact-sheet'));
  
  if (files.length === 0) {
    console.log(`No ${type} files found.`);
    return;
  }

  const rows = Math.ceil(files.length / cols);
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { margin: 0; background: #f0f0f0; padding: 20px; font-family: sans-serif; }
        .grid { display: grid; grid-template-columns: repeat(${cols}, 1fr); gap: 20px; }
        .item { background: white; padding: 10px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; }
        img { max-width: 100%; height: auto; border: 1px solid #ccc; }
        .title { margin-top: 10px; font-size: 14px; color: #333; word-break: break-all; }
      </style>
    </head>
    <body>
      <div class="grid">
        ${files.map(f => `
          <div class="item">
            <img src="file://${path.join(AUDIT_DIR, f).replace(/\\/g, '/')}" />
            <div class="title">${f.replace(`-${type}-`, '\n').replace('.png', '')}</div>
          </div>
        `).join('')}
      </div>
    </body>
    </html>
  `;
  
  const htmlPath = path.join(AUDIT_DIR, `temp-${type}.html`);
  fs.writeFileSync(htmlPath, html);
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Set viewport large enough for the grid
  await page.setViewportSize({ width: cols * (width + 40) + 40, height: rows * (height + 60) + 40 });
  await page.goto(`file://${htmlPath.replace(/\\/g, '/')}`);
  
  // Wait for images to load
  await page.waitForLoadState('networkidle');
  
  await page.screenshot({ path: path.join(AUDIT_DIR, `contact-sheet-${type}.png`), fullPage: true });
  
  await browser.close();
  fs.unlinkSync(htmlPath);
  
  console.log(`Generated contact-sheet-${type}.png`);
}

async function run() {
  await createContactSheet('mobile', 6, 390, 844);
  await createContactSheet('desktop', 4, 1440, 900);
}

run().catch(console.error);
