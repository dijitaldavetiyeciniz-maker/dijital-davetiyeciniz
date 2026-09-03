import { execSync } from 'child_process';

function runGit(cmd: string): string {
  return execSync(`git ${cmd}`, { encoding: 'utf-8', maxBuffer: 25 * 1024 * 1024 });
}

// Let's analyze commit 262282d, 7086fb4, b672547, and HEAD
for (const commit of ['262282d', '7086fb4', 'b672547', 'HEAD']) {
  console.log(`\n======================================================`);
  console.log(`DETAILED AUDIT FOR COMMIT: ${commit}`);
  console.log(`======================================================`);

  const themesContent = runGit(`show ${commit}:src/lib/themes.ts`);
  
  // We can write it to a temp file and require/import it dynamically or parse it with JSON-like structure
  // Let's extract the exact predefinedThemes array
  const lines = themesContent.split('\n');
  let insidePredefined = false;
  let themeObjects: any[] = [];
  let currentObjStr = '';
  let braceDepth = 0;

  for (const line of lines) {
    if (line.includes('export const predefinedThemes:')) {
      insidePredefined = true;
      continue;
    }
    if (insidePredefined) {
      if (line.trim().startsWith('export ') || line.trim().startsWith('// ---') || line.trim().startsWith('predefinedThemes.forEach')) {
        insidePredefined = false;
        break;
      }
      
      for (const char of line) {
        if (char === '{') {
          braceDepth++;
          currentObjStr += char;
        } else if (char === '}') {
          braceDepth--;
          currentObjStr += char;
          if (braceDepth === 0 && currentObjStr.trim().length > 0) {
            try {
              // Convert JS object to JSON
              const jsonStr = currentObjStr
                .replace(/([a-zA-Z0-9_]+)\s*:/g, '"$1":')
                .replace(/'([^']*)'/g, '"$1"')
                .replace(/,\s*}/g, '}')
                .replace(/,\s*]/g, ']');
              const obj = JSON.parse(jsonStr);
              themeObjects.push(obj);
            } catch {
              // Extract at least id, name, eventType
              const id = currentObjStr.match(/"?id"?\s*:\s*['"]([^'"]+)['"]/)?.[1];
              const name = currentObjStr.match(/"?name"?\s*:\s*['"]([^'"]+)['"]/)?.[1];
              const eventType = currentObjStr.match(/"?eventType"?\s*:\s*['"]([^'"]+)['"]/)?.[1];
              const category = currentObjStr.match(/"?category"?\s*:\s*['"]([^'"]+)['"]/)?.[1];
              if (id) {
                themeObjects.push({ id, name, eventType, category });
              }
            }
            currentObjStr = '';
          }
        } else if (braceDepth > 0) {
          currentObjStr += char;
        }
      }
    }
  }

  const allIds = themeObjects.map(t => t.id);
  const uniqueIds = Array.from(new Set(allIds));
  
  // Categorize by eventType
  const byEventType: Record<string, number> = {};
  themeObjects.forEach(t => {
    const et = t.eventType || 'unknown';
    byEventType[et] = (byEventType[et] || 0) + 1;
  });

  // Unique IDs by eventType
  const uniqueByEventType: Record<string, Set<string>> = {};
  themeObjects.forEach(t => {
    const et = t.eventType || 'unknown';
    if (!uniqueByEventType[et]) uniqueByEventType[et] = new Set();
    uniqueByEventType[et].add(t.id);
  });

  const uniqueEventTypeCounts: Record<string, number> = {};
  for (const k in uniqueByEventType) {
    uniqueEventTypeCounts[k] = uniqueByEventType[k].size;
  }

  console.log(`Total theme objects in predefinedThemes: ${themeObjects.length}`);
  console.log(`Total unique theme IDs: ${uniqueIds.length}`);
  console.log(`Breakdown of objects by eventType:`, byEventType);
  console.log(`Breakdown of unique IDs by eventType:`, uniqueEventTypeCounts);

  // Check fonts
  const fontContent = runGit(`show ${commit}:src/data/fontOptions.ts`);
  const fontLines = fontContent.split('\n');
  const fontNames: string[] = [];
  let inFonts = false;
  for (const line of fontLines) {
    if (line.includes('export const fontOptionsList:')) {
      inFonts = true;
      continue;
    }
    if (inFonts) {
      if (line.trim().startsWith('];')) inFonts = false;
      else {
        const idMatch = line.match(/name:\s*['"]([^'"]+)['"]/);
        if (idMatch) fontNames.push(idMatch[1]);
      }
    }
  }
  console.log(`Font names in fontOptionsList: ${fontNames.length}`);
}
