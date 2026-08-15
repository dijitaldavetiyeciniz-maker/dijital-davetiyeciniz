const fs = require('fs');
const path = require('path');

const matrixPath = path.join(__dirname, '../design_matrix.json');
const themesPath = path.join(__dirname, '../src/lib/themes.ts');

if (!fs.existsSync(matrixPath)) {
  console.error("Error: design_matrix.json not found.");
  process.exit(1);
}

const matrix = JSON.parse(fs.readFileSync(matrixPath, 'utf8'));
const plannedThemes = matrix.plannedThemes || [];

// Read existing themes to check for ID collisions
let existingIds = [];
if (fs.existsSync(themesPath)) {
  const content = fs.readFileSync(themesPath, 'utf8');
  // Simple regex search for IDs in themes.ts
  const matches = content.match(/"id":\s*"([^"]+)"/g) || [];
  existingIds = matches.map(m => m.replace(/"id":\s*"/, '').replace(/"/, ''));
}

let hasErrors = false;
let hasWarnings = false;

console.log(`Starting validation of ${plannedThemes.length} planned templates...\n`);

// Stat trackers
const layoutReuse = {};
const openingReuse = {};
const signatureReuse = {};
const categoriesCount = {};
const prioritiesCount = { Locked: 0, Stretch: 0 };
const scoreDistribution = { RED: 0, YELLOW: 0, GREEN: 0, EXCEPTIONAL: 0 };

const seenIds = new Set();

plannedThemes.forEach(theme => {
  // Check 1: Required fields
  const requiredFields = [
    'id', 'name', 'category', 'collection', 'layoutFamily', 'heroComposition',
    'visualLanguage', 'typographyFamily', 'backgroundType', 'photoTreatment',
    'decorativeLanguage', 'contentFlow', 'openingAnimation', 'openingFamily',
    'motionLanguage', 'signatureMoment', 'priority', 'similarTemplate', 'differences', 'status'
  ];
  
  const missing = requiredFields.filter(f => !theme[f]);
  if (missing.length > 0) {
    console.error(`❌ [REJECT] Theme ${theme.id || 'unknown'} is missing fields: ${missing.join(', ')}`);
    hasErrors = true;
  }

  // Check 2: Duplicate ID within planned
  if (seenIds.has(theme.id)) {
    console.error(`❌ [REJECT] Duplicate template ID found in plan: ${theme.id}`);
    hasErrors = true;
  }
  seenIds.add(theme.id);

  // Check 3: ID Collision with existing themes (if not in planned completed)
  let isCompleted = false;
  if (existingIds.includes(theme.id)) {
    isCompleted = true;
    if (theme.status !== 'IMPLEMENTED' && theme.status !== 'EXISTING' && theme.status !== 'MERGED') {
      console.error(`❌ [REJECT] Theme "${theme.id}" is implemented in themes.ts but status in matrix is "${theme.status}" (IMPLEMENTED_TEMPLATE_REPLANNED).`);
      hasErrors = true;
    }
  } else {
    if (theme.status === 'IMPLEMENTED' || theme.status === 'EXISTING') {
      console.error(`❌ [REJECT] Theme "${theme.id}" has status "${theme.status}" but is NOT found in themes.ts.`);
      hasErrors = true;
    }
  }

  // Check 4: Difference Score
  const score = theme.differenceScore;
  let status = 'GREEN / UNIQUE';
  if (score <= 3) {
    status = 'RED / REJECT';
    console.error(`❌ [REJECT] Theme "${theme.id}" difference score is too low (${score}/10). Must be >= 4.`);
    hasErrors = true;
    scoreDistribution.RED++;
  } else if (score <= 5) {
    status = 'YELLOW / REVIEW';
    console.log(`⚠️ [WARNING] Theme "${theme.id}" has borderline difference score (${score}/10).`);
    hasWarnings = true;
    scoreDistribution.YELLOW++;
  } else if (score <= 8) {
    scoreDistribution.GREEN++;
  } else {
    status = 'EXCEPTIONAL';
    scoreDistribution.EXCEPTIONAL++;
  }

  if (isCompleted) {
    console.log(`✅ [COMPLETED] Theme "${theme.id}" is correctly implemented in themes.ts.`);
  }

  // Stats aggregation
  layoutReuse[theme.layoutFamily] = (layoutReuse[theme.layoutFamily] || 0) + 1;
  openingReuse[theme.openingFamily] = (openingReuse[theme.openingFamily] || 0) + 1;
  signatureReuse[theme.signatureMoment] = (signatureReuse[theme.signatureMoment] || 0) + 1;
  categoriesCount[theme.category] = (categoriesCount[theme.category] || 0) + 1;
  prioritiesCount[theme.priority] = (prioritiesCount[theme.priority] || 0) + 1;
});

// Check 5: Overuse threshold warnings (e.g. any single layout used > 8 times in new presets, except common ones)
Object.entries(layoutReuse).forEach(([layout, count]) => {
  if (count > 8 && layout !== 'Cinematic Scroll' && layout !== 'Story Chapters') {
    console.log(`⚠️ [WARNING] Layout family "${layout}" might be overused in new designs (${count} occurrences).`);
    hasWarnings = true;
  }
});

Object.entries(openingReuse).forEach(([op, count]) => {
  if (count > 10 && op !== 'envelope') {
    console.log(`⚠️ [WARNING] Opening family "${op}" might be overused in new designs (${count} occurrences).`);
    hasWarnings = true;
  }
});

console.log("\n--- Validation Statistics Summary ---");
console.log(`Total Planned Templates: ${plannedThemes.length}`);
console.log(`Locked (Tier 1): ${prioritiesCount.Locked}`);
console.log(`Stretch (Tier 2): ${prioritiesCount.Stretch}`);
console.log("\nDifference Score Distribution:");
console.log(JSON.stringify(scoreDistribution, null, 2));

console.log("\nCategory Distribution:");
console.log(JSON.stringify(categoriesCount, null, 2));

console.log("\nTop 5 Layout Families (New):");
console.log(Object.entries(layoutReuse).sort((a,b)=>b[1]-a[1]).slice(0, 5));

console.log("\nTop 5 Opening Families (New):");
console.log(Object.entries(openingReuse).sort((a,b)=>b[1]-a[1]).slice(0, 5));

console.log("\nTop 5 Signature Mechanisms (New):");
console.log(Object.entries(signatureReuse).sort((a,b)=>b[1]-a[1]).slice(0, 5));

if (hasErrors) {
  console.log("\n❌ RESULT: REJECT. Code compilation check or difference validation failed.");
  process.exit(1);
} else if (hasWarnings) {
  console.log("\n⚠️ RESULT: PASS (with warnings). Review proposed designs before Faz C.");
  process.exit(0);
} else {
  console.log("\n✅ RESULT: PASS. All checks successful. Ready for Faz C.");
  process.exit(0);
}
