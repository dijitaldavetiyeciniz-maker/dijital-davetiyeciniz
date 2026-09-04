import { execSync } from 'child_process';

function runGit(cmd: string): string {
  return execSync(`git ${cmd}`, { encoding: 'utf-8', maxBuffer: 20 * 1024 * 1024 });
}

const w8Commits = ['262282d', '7086fb4', 'b672547', 'HEAD'];

for (const commit of w8Commits) {
  console.log(`\n================ COMMIT: ${commit} ================`);
  
  // Themes
  try {
    const themesContent = runGit(`show ${commit}:src/lib/themes.ts`);
    const lines = themesContent.split('\n');
    let insidePredefined = false;
    const themeIds: string[] = [];
    
    for (const line of lines) {
      if (line.includes('export const predefinedThemes')) {
        insidePredefined = true;
        continue;
      }
      if (insidePredefined) {
        if (line.trim().startsWith('];') || (line.trim().startsWith('export ') && !line.includes('predefinedThemes'))) {
          insidePredefined = false;
          break;
        }
        const idMatch = line.match(/"?id"?:\s*['"]([a-zA-Z0-9_-]+)['"]/);
        if (idMatch && line.includes('id') && !line.includes('seal') && !line.includes('font')) {
          themeIds.push(idMatch[1]);
        }
      }
    }

    console.log(`  [Themes] PredefinedThemes count: ${themeIds.length}`);
    console.log(`  [Themes] Unique Theme IDs: ${new Set(themeIds).size}`);
    console.log(`  [Themes] First 3: ${themeIds.slice(0, 3).join(', ')} ... Last 3: ${themeIds.slice(-3).join(', ')}`);
  } catch (e: any) {
    console.log('  [Themes] Error:', e.message);
  }

  // Fonts
  try {
    const fontContent = runGit(`show ${commit}:src/data/fontOptions.ts`);
    const lines = fontContent.split('\n');
    let insideFonts = false;
    const fontNames: string[] = [];
    let insideCategories = false;
    const categories: string[] = [];

    for (const line of lines) {
      if (line.includes('export const fontOptionsList')) {
        insideFonts = true;
        continue;
      }
      if (insideFonts) {
        if (line.trim().startsWith('];')) {
          insideFonts = false;
        } else {
          const idMatch = line.match(/"?id"?:\s*['"]([^'"]+)['"]/);
          if (idMatch) fontNames.push(idMatch[1]);
        }
      }

      if (line.includes('export const fontCategories')) {
        insideCategories = true;
        continue;
      }
      if (insideCategories) {
        if (line.trim().startsWith('];')) {
          insideCategories = false;
        } else {
          const idMatch = line.match(/"?id"?:\s*['"]([^'"]+)['"]/);
          if (idMatch) categories.push(idMatch[1]);
        }
      }
    }
    console.log(`  [Fonts] fontOptionsList count: ${fontNames.length}, categories count: ${categories.length}`);
  } catch (e: any) {
    console.log('  [Fonts] Error:', e.message);
  }
}
