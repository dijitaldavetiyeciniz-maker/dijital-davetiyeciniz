import fs from 'fs';
import path from 'path';

const file = path.join(process.cwd(), 'src/lib/themes.ts');
let content = fs.readFileSync(file, 'utf8');

// Replace all 'layoutStyle: "...",' with 'layoutStyle: "...", layoutMode: "legacy-card",'
content = content.replace(/(layoutStyle:\s*['"][^'"]+['"])(,)/g, '$1, layoutMode: "legacy-card"$2');

// Now update the specific Group 1A templates to full-bleed
const modernTemplates = [
  'cinematic-poster',
  'royal-letter',
  'polaroid-story',
  'constellation-night'
];

modernTemplates.forEach(t => {
  const regex = new RegExp(`(layoutStyle:\\s*['"]${t}['"],\\s*layoutMode:\\s*['"])legacy-card(['"])`, 'g');
  content = content.replace(regex, '$1full-bleed$2');
});

fs.writeFileSync(file, content, 'utf8');
console.log('themes.ts updated!');
