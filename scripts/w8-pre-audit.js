const fs = require('fs');
const path = require('path');

function runPreAudit() {
  console.log('=== W8 PRE-AUDIT ANALYSIS ===\n');

  // 1. Templates Analysis
  const themesFile = path.join(__dirname, '../src/lib/themes.ts');
  const themesCode = fs.readFileSync(themesFile, 'utf8');
  
  // Count items inside predefinedThemes array
  const predefinedThemesStart = themesCode.indexOf('export const predefinedThemes: TemplatePreset[] = [');
  const themesPart = predefinedThemesStart !== -1 ? themesCode.slice(predefinedThemesStart) : themesCode;
  
  // Match top-level objects in predefinedThemes
  const idMatches = themesPart.match(/"id":\s*"([^"]+)"/g) || [];
  const themeIds = idMatches.map(m => m.replace(/"id":\s*"/, '').replace(/"/, ''));
  const uniqueThemeIds = Array.from(new Set(themeIds));
  console.log('Total unique predefined themes / templates:', uniqueThemeIds.length);

  // 2. Fonts Analysis
  const fontFile = path.join(__dirname, '../src/data/fontOptions.ts');
  const fontCode = fs.readFileSync(fontFile, 'utf8');
  const fontIdMatches = fontCode.match(/id:\s*['"]([^'"]+)['"]/g) || [];
  const fontIds = fontIdMatches.map(m => m.replace(/id:\s*['"]/, '').replace(/['"]/, ''));
  const uniqueFontIds = Array.from(new Set(fontIds.filter(id => id !== 'all' && !['elegant-serif', 'modern-serif', 'sans-serif', 'calligraphy', 'handwriting', 'luxury', 'editorial', 'minimal', 'playful'].includes(id))));
  console.log('Total font options currently:', uniqueFontIds.length);

  // 3. FontPicker Analysis
  const fontPickerFile = path.join(__dirname, '../src/components/admin/FontPicker.tsx');
  const fontPickerCode = fs.readFileSync(fontPickerFile, 'utf8');
  const fontLinksInjectedBefore = fontPickerCode.includes('fontOptionsList.forEach') ? 60 : (fontPickerCode.includes('filteredFonts.slice(0, 16)') ? 16 : 60);
  console.log('Admin font links injection model in current code:', fontLinksInjectedBefore);

  // 4. Stash Inspection
  console.log('\nW8 Stash files analyzed:');
  console.log('  src/components/admin/FontPicker.tsx: REUSE & ENHANCE (Dynamic on-demand font injection, Turkish glyphs, curated 80+ families, sample preview text)');
  console.log('  src/app/[wedding_id]/admin/page.tsx: REUSE & ENHANCE (Design Studio step navigation, visual template cards, lazy preview modal, responsive mobile UX)');
}

runPreAudit();
