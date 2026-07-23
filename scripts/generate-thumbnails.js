const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Run this script against a locally running dev server (e.g. localhost:3000)
// Make sure `npm run dev` is running before starting this script.

async function run() {
  console.log("Reading templates from themes.ts...");
  const themesPath = path.join(__dirname, '..', 'src', 'lib', 'themes.ts');
  const themesContent = fs.readFileSync(themesPath, 'utf8');
  
  // Extract all template IDs. 
  // We can just match `id: "some-id",`
  const matches = [...themesContent.matchAll(/id:\s*['"]([^'"]+)['"]/g)];
  // Filter out non-template ids like backgroundOptions ids
  // The first match is usually "wedding", "engagement" etc. 
  // We can just extract all "template_id"s or "id"s of templates.
  // A better way is to hit the API or just extract the predefinedThemes block.
  
  // To be perfectly accurate, we just read from the UI or API.
  // Since we only need the templates, let's just parse the file carefully.
  // Or we can just import the themes file! (but we need ts-node)
  
  // Let's use simple regex for `export const predefinedThemes: TemplatePreset[] = [...]`
  const themesBlock = themesContent.substring(themesContent.indexOf('export const predefinedThemes'));
  const ids = [...themesBlock.matchAll(/"id":\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
  
  // Remove duplicates
  const uniqueIds = [...new Set(ids)];
  
  console.log(`Found ${uniqueIds.length} potential IDs. We will try to screenshot all of them.`);
  
  const browser = await chromium.launch();
  
  const destDir = path.join(__dirname, '..', 'public', 'templates', 'thumbnails');
  fs.mkdirSync(destDir, { recursive: true });

  const desktopContext = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  
  const mobileContext = await browser.newContext({
    viewport: { width: 375, height: 812 },
    isMobile: true
  });

  const desktopPage = await desktopContext.newPage();
  const mobilePage = await mobileContext.newPage();

  // We need to take a screenshot of /demo/[id] or /d/preview?template_id=[id]
  for(let i = 0; i < uniqueIds.length; i++) {
    const id = uniqueIds[i];
    console.log(`[${i+1}/${uniqueIds.length}] Screenshotting ${id}...`);
    try {
      const url = `http://localhost:3000/demo/TEST-WEDDING?preview=true&template_id=${id}`; // Replace with actual preview route
      
      // Desktop
      await desktopPage.goto(url, { waitUntil: 'networkidle' });
      await desktopPage.screenshot({ path: path.join(destDir, `${id}.jpeg`), type: 'jpeg', quality: 80 });
      
      // Mobile
      await mobilePage.goto(url, { waitUntil: 'networkidle' });
      await mobilePage.screenshot({ path: path.join(destDir, `${id}-mobile.jpeg`), type: 'jpeg', quality: 80 });
      
    } catch (e) {
      console.log(`Failed to screenshot ${id}: ${e.message}`);
    }
  }

  await browser.close();
  console.log("Done generating thumbnails!");
}

run().catch(console.error);
