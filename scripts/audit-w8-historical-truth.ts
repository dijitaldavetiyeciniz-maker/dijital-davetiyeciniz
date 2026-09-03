import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

function runGit(cmd: string): string {
  return execSync(`git ${cmd}`, { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 });
}

console.log('====================================================');
console.log('C13 W10.3.2 HISTORICAL TRUTH AUDIT');
console.log('====================================================');

const w8Commits = ['262282d', '7086fb4', 'b672547', 'HEAD'];

for (const commit of w8Commits) {
  console.log(`\n--- Inspecting Commit: ${commit} ---`);
  try {
    // 1. Check themes.ts
    const themesContent = runGit(`show ${commit}:src/lib/themes.ts`);
    const themeMatches = [...themesContent.matchAll(/id:\s*['"]([a-zA-Z0-9_-]+)['"]/g)].map(m => m[1]);
    const uniqueThemes = new Set(themeMatches);
    
    // Check predefinedThemes array specifically
    const predefinedMatch = themesContent.match(/export const predefinedThemes: ThemePreset\[\] = \[([\s\S]*?)\];/);
    let predefinedCount = 0;
    if (predefinedMatch) {
      const ids = [...predefinedMatch[1].matchAll(/id:\s*['"]([a-zA-Z0-9_-]+)['"]/g)].map(m => m[1]);
      predefinedCount = ids.length;
    }

    console.log(`  [Themes] Total id matches: ${themeMatches.length}`);
    console.log(`  [Themes] Unique IDs: ${uniqueThemes.size}`);
    console.log(`  [Themes] PredefinedThemes count: ${predefinedCount}`);

    // 2. Check fontOptions.ts
    let fontMatches: string[] = [];
    let uniqueFonts = new Set<string>();
    let categoryMatches: string[] = [];
    try {
      const fontContent = runGit(`show ${commit}:src/data/fontOptions.ts`);
      fontMatches = [...fontContent.matchAll(/id:\s*['"]([a-zA-Z0-9_-]+)['"]/g)].map(m => m[1]);
      uniqueFonts = new Set(fontMatches);
      categoryMatches = [...fontContent.matchAll(/category:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
    } catch {
      console.log('  [Fonts] src/data/fontOptions.ts not found in this commit, searching other paths...');
    }
    console.log(`  [Fonts] Total font IDs: ${fontMatches.length}, Unique fonts: ${uniqueFonts.size}, Categories: ${new Set(categoryMatches).size}`);

    // 3. Check openingAnimations.ts
    let openingCount = 0;
    try {
      const openingContent = runGit(`show ${commit}:src/data/openingAnimations.ts`);
      const openings = [...openingContent.matchAll(/id:\s*['"]([a-zA-Z0-9_-]+)['"]/g)].map(m => m[1]);
      openingCount = openings.length;
    } catch {
      console.log('  [Openings] src/data/openingAnimations.ts not found in this commit');
    }
    console.log(`  [Openings] Total opening animations: ${openingCount}`);

  } catch (err: any) {
    console.error(`  Error inspecting commit ${commit}:`, err.message);
  }
}

// Search for where 272 and 95 appear in git grep
console.log('\n--- Searching historical text references for "272" ---');
try {
  const grep272 = runGit('grep "272"');
  console.log(grep272);
} catch (e) {
  console.log('No direct matches for "272" in current working tree.');
}

console.log('\n--- Searching historical text references for "95" fonts ---');
try {
  const grep95 = runGit('grep "95"');
  console.log(grep95);
} catch (e) {
  console.log('No direct matches for "95" in current working tree.');
}
