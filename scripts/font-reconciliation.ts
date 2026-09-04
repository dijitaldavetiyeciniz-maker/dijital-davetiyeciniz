import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// 1. Get fontOptions from W8 commit 262282d
const w8Raw = execSync('git show 262282d:src/data/fontOptions.ts', { encoding: 'utf-8' });
// 2. Get fontOptions from current HEAD
const headRaw = fs.readFileSync(path.join(process.cwd(), 'src', 'data', 'fontOptions.ts'), 'utf-8');

function parseFontList(content: string) {
  const lines = content.split('\n');
  const items: any[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('{') && trimmed.includes('id:') && trimmed.includes('name:')) {
      const idMatch = trimmed.match(/id:\s*['"]([^'"]+)['"]/);
      const nameMatch = trimmed.match(/name:\s*['"]([^'"]+)['"]/);
      const catMatch = trimmed.match(/category:\s*['"]([^'"]+)['"]/);
      const googleMatch = trimmed.match(/googleFontFamily:\s*['"]([^'"]+)['"]/);
      const turkishMatch = trimmed.match(/turkishSupport:\s*(true|false)/);
      if (idMatch && nameMatch) {
        items.push({
          id: idMatch[1],
          name: nameMatch[1],
          category: catMatch ? catMatch[1] : 'unknown',
          googleFontFamily: googleMatch ? googleMatch[1] : '',
          turkishSupport: turkishMatch ? turkishMatch[1] === 'true' : false
        });
      }
    }
  }
  return items;
}

const w8Fonts = parseFontList(w8Raw);
const headFonts = parseFontList(headRaw);

console.log(`W8 Fonts Count: ${w8Fonts.length}`);
console.log(`HEAD Fonts Count: ${headFonts.length}`);

const headIds = new Set(headFonts.map(f => f.id));
const w8Ids = new Set(w8Fonts.map(f => f.id));

const removedFonts = w8Fonts.filter(f => !headIds.has(f.id));
const addedFonts = headFonts.filter(f => !w8Ids.has(f.id));

console.log(`\n--- REMOVED FONTS (${removedFonts.length}) ---`);
removedFonts.forEach((f, idx) => {
  console.log(`${idx + 1}. [${f.category}] id="${f.id}" name="${f.name}" google="${f.googleFontFamily}" turkish=${f.turkishSupport}`);
});

console.log(`\n--- ADDED FONTS (${addedFonts.length}) ---`);
addedFonts.forEach((f, idx) => {
  console.log(`${idx + 1}. [${f.category}] id="${f.id}" name="${f.name}" google="${f.googleFontFamily}" turkish=${f.turkishSupport}`);
});
