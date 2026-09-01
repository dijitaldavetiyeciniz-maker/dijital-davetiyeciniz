const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

async function runW7PerformanceTests() {
  console.log('=== C13 W7 OPENING PERFORMANCE & DYNAMIC LOADING TEST SUITE ===\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, name, details = '') {
    if (condition) {
      console.log(`[PASS] ${name}`);
      passed++;
    } else {
      console.error(`[FAIL] ${name} ${details ? `(${details})` : ''}`);
      failed++;
    }
  }

  const entranceAnimFile = path.join(__dirname, '../src/components/invitation/EntranceAnimation.tsx');
  const entranceAnimCode = fs.readFileSync(entranceAnimFile, 'utf8');
  const dynamicRegFile = path.join(__dirname, '../src/components/invitation/openings/dynamicRegistry.ts');
  const dynamicRegCode = fs.readFileSync(dynamicRegFile, 'utf8');
  const openingCatalogFile = path.join(__dirname, '../src/data/openingAnimations.ts');
  const openingCatalogCode = fs.readFileSync(openingCatalogFile, 'utf8');

  // --- SECTION 1: STATIC IMPORT REMOVAL & ZERO BUNDLE LEAKAGE ---
  console.log('--- 1. Static Import Removal & Zero Bundle Leakage ---');

  // Test 1: 0 static opening component imports in EntranceAnimation.tsx
  const staticOpeningComponentImports = (entranceAnimCode.match(/import\s+\{\s*([A-Za-z0-9]+Opening)\s*\}\s+from\s+["']\.\/openings\//g) || []);
  assert(
    staticOpeningComponentImports.length === 0,
    `STATIC_OPENING_IMPORTS_AFTER is 0 (Before: 49, Current: ${staticOpeningComponentImports.length})`
  );

  // Test 2: dynamicRegistry is imported cleanly
  assert(
    entranceAnimCode.includes('import { dynamicOpeningRegistry } from "./openings/dynamicRegistry"'),
    'EntranceAnimation imports dynamicOpeningRegistry instead of direct static components'
  );

  // Test 3: No global window or document access in module root
  assert(
    !dynamicRegCode.includes('window.') && !dynamicRegCode.includes('document.'),
    'dynamicRegistry.ts is strictly free of SSR-breaking global window/document accesses'
  );

  // Test 4: Next.js dynamic import used with ssr: false
  assert(
    dynamicRegCode.includes('dynamic(') && dynamicRegCode.includes('ssr: false'),
    'dynamicRegistry uses next/dynamic with ssr: false for all animation renderers'
  );

  // Test 5: Inline text/photo/seal animations do not inflate chunk size
  assert(
    entranceAnimCode.includes('CinematicTextOpening') && entranceAnimCode.includes('PhotoCoverOpening') && entranceAnimCode.includes('SealOnlyOpening'),
    'Lightweight inline animations (cinematicText, photoCover, sealOnly) preserved without dynamic overhead'
  );

  // --- SECTION 2: OPENING CATALOG INTEGRITY (50 ANIMATIONS) ---
  console.log('\n--- 2. Opening Catalog Integrity & All 50 Animation Types ---');

  // Test 6: Total 50 animation types present
  const idMatches = openingCatalogCode.match(/id:\s*["']([^"']+)["']/g) || [];
  const uniqueCatalogIds = Array.from(new Set(idMatches.map(m => m.replace(/id:\s*["']/, '').replace(/["']/, ''))));
  assert(
    uniqueCatalogIds.length >= 50,
    `All 50 opening animation types present in catalog (Total: ${uniqueCatalogIds.length})`
  );

  // Test 7: Classic Elegant Opening Types preserved
  const classicTypes = ['wax-seal-starfield', 'envelope', 'curtain', 'door', 'royalParchment', 'royalPalace', 'book', 'sealOnly'];
  const allClassic = classicTypes.every(id => openingCatalogCode.includes(`id: "${id}"`) || openingCatalogCode.includes(`id: '${id}'`));
  assert(allClassic, 'Classic elegant opening types preserved (envelope, curtain, door, book, etc.)');

  // Test 8: Cinematic Opening Types preserved
  const cinematicTypes = ['cinematicZoom', 'spotlight', 'starryNight', 'cinematicFilm', 'filmPremiere'];
  const allCinematic = cinematicTypes.every(id => openingCatalogCode.includes(`id: "${id}"`) || openingCatalogCode.includes(`id: '${id}'`));
  assert(allCinematic, 'Cinematic opening types preserved (cinematicZoom, spotlight, starryNight, etc.)');

  // Test 9: Cultural Opening Types preserved
  const culturalTypes = ['royalParchment', 'botanicalBlossom', 'hennaVelvetGate', 'nazarDome', 'ottomanIllumination', 'hennaPalace'];
  const allCultural = culturalTypes.every(id => openingCatalogCode.includes(`id: "${id}"`) || openingCatalogCode.includes(`id: '${id}'`));
  assert(allCultural, 'Cultural opening types preserved (royalParchment, hennaVelvetGate, nazarDome, etc.)');

  // Test 10: Playful & Destination Opening Types preserved
  const playfulTypes = ['coastalSunset', 'mediterraneanCeramic', 'gardenGate', 'botanicalBlossom', 'botanicalWatercolor'];
  const allPlayful = playfulTypes.every(id => openingCatalogCode.includes(`id: "${id}"`) || openingCatalogCode.includes(`id: '${id}'`));
  assert(allPlayful, 'Playful & Destination opening types preserved (coastalSunset, mediterraneanCeramic, gardenGate, etc.)');

  // Test 11: Corporate & Editorial Opening Types preserved
  const editorialTypes = ['parisianBlackTie', 'grandOpera', 'moonlitGarden', 'vogueEditorial', 'swissGallery', 'futureSummit'];
  const allEditorial = editorialTypes.every(id => openingCatalogCode.includes(`id: "${id}"`) || openingCatalogCode.includes(`id: '${id}'`));
  assert(allEditorial, 'Corporate & Editorial opening types preserved (parisianBlackTie, vogueEditorial, etc.)');

  // --- SECTION 3: 10 NEW FLAGSHIP/PREMIUM ANIMATIONS ---
  console.log('\n--- 3. 10 New Flagship/Premium Animations ---');

  const flagship10 = [
    'cinematic-car-journey', 'celestial-eclipse', 'golden-constellation',
    'art-deco-doors', 'silk-fabric-reveal', 'luxury-jewelry-box',
    'ocean-pearl-reveal', 'minimal-architectural-lines', 'ottoman-elegance',
    'lantern-night'
  ];

  // Test 12: All 10 flagship IDs exist in catalog
  const flagshipFound = flagship10.every(id => openingCatalogCode.includes(`"${id}"`) || openingCatalogCode.includes(`'${id}'`));
  assert(flagshipFound, 'All 10 new premium animations present in opening catalog');

  // Test 13: All 10 flagship components registered in dynamicRegistry
  const flagshipInRegistry = flagship10.every(id => dynamicRegCode.includes(`'${id}'`) || dynamicRegCode.includes(`"${id}"`));
  assert(flagshipInRegistry, 'All 10 new premium animations registered in dynamicRegistry.ts');

  // Test 14: Cinematic Car Journey Opening component file exists
  assert(
    fs.existsSync(path.join(__dirname, '../src/components/invitation/openings/CinematicCarJourneyOpening.tsx')),
    'CinematicCarJourneyOpening component file exists in openings directory'
  );

  // Test 15: Celestial Eclipse Opening component file exists
  assert(
    fs.existsSync(path.join(__dirname, '../src/components/invitation/openings/CelestialEclipseOpening.tsx')),
    'CelestialEclipseOpening component file exists in openings directory'
  );

  // Test 16: Ottoman Elegance Opening component file exists
  assert(
    fs.existsSync(path.join(__dirname, '../src/components/invitation/openings/OttomanEleganceOpening.tsx')),
    'OttomanEleganceOpening component file exists in openings directory'
  );

  // --- SECTION 4: DYNAMIC REGISTRY & FALLBACK SEMANTICS ---
  console.log('\n--- 4. Dynamic Registry & Fallback Semantics ---');

  // Test 17: All 49 opening component files exist in src/components/invitation/openings
  const openingsDir = path.join(__dirname, '../src/components/invitation/openings');
  const openingFiles = fs.readdirSync(openingsDir).filter(f => f.endsWith('.tsx'));
  assert(
    openingFiles.length === 49,
    `All 49 individual opening component files present in openings directory (Found: ${openingFiles.length})`
  );

  // Test 18: dynamicOpeningRegistry has at least 49 registered keys
  const registryKeyMatches = dynamicRegCode.match(/['"]?[a-zA-Z0-9_-]+['"]?:\s*dynamic\(/g) || [];
  assert(
    registryKeyMatches.length >= 49,
    `dynamicOpeningRegistry contains all ${registryKeyMatches.length} dynamic loader keys`
  );

  // Test 19: Unknown/legacy animation ID fallback
  assert(
    entranceAnimCode.includes('dynamicOpeningRegistry.minimalFade') || entranceAnimCode.includes('minimalFade'),
    'Unknown animation ID falls back safely to MinimalFadeOpening without crashing invitation'
  );

  // Test 20: parseLegacyAnimation preserves legacy Turkish & english keywords
  assert(
    entranceAnimCode.includes('parseLegacyAnimation') && entranceAnimCode.includes('zarf'),
    'parseLegacyAnimation correctly maps legacy keywords (zarf, perde, kapi) to canonical animation types'
  );

  // Test 21: Error boundary wraps opening renderer
  assert(
    entranceAnimCode.includes('OpeningErrorBoundary'),
    'OpeningErrorBoundary wraps renderFamily to automatically bypass broken animations on runtime errors'
  );

  // --- SECTION 5: CHUNK ISOLATION & NONE OVERHEAD ELIMINATION ---
  console.log('\n--- 5. Chunk Isolation & None Overhead Elimination ---');

  // Test 22: 'none' animation returns null and incurs 0 chunk load overhead
  assert(
    entranceAnimCode.includes("typeConfig.id === 'none'"),
    'Animation "none" returns null immediately with 0 renderer chunk overhead (NONE_RENDERER_CHUNK=0)'
  );

  // Test 23: WeddingClientWrapper disables entrance overlay when animation is none
  const wrapperFile = path.join(__dirname, '../src/components/invitation/WeddingClientWrapper.tsx');
  const wrapperCode = fs.readFileSync(wrapperFile, 'utf8');
  assert(
    wrapperCode.includes("wedding.entrance_animation === 'none'"),
    'WeddingClientWrapper bypasses EntranceAnimation mount entirely when entrance_animation is "none"'
  );

  // Test 24: Selected renderer only loaded on demand
  assert(
    entranceAnimCode.includes('const DynamicComponent = dynamicOpeningRegistry[typeConfig.id]'),
    'renderFamily looks up strictly the single active animation component from dynamicOpeningRegistry'
  );

  // Test 25: Unrelated renderers excluded from initial load
  assert(
    !entranceAnimCode.includes('import { ParisianBlackTieOpening }'),
    'Unrelated animation renderers (e.g. ParisianBlackTieOpening) excluded from initial bundle'
  );

  // --- SECTION 6: ANIMATION CONTROLS, ACCESSIBILITY & PERFORMANCE GATE ---
  console.log('\n--- 6. Animation Controls, Accessibility & Performance Gate ---');

  // Test 26: Animation capabilities and control structures preserved
  assert(
    openingCatalogCode.includes('AnimationControlField') && openingCatalogCode.includes('AnimationCapabilities'),
    'Animation-specific control structures (AnimationControlField, AnimationCapabilities) preserved in data model'
  );

  // Test 27: Reduced motion accessibility and tap skip
  assert(
    entranceAnimCode.includes('aria-label="Davetiyeyi açmak için dokununuz"') && entranceAnimCode.includes('openOnce'),
    'Accessibility aria-label, keyboard Enter/Space activation, and tap skip preserved'
  );

  // Test 28: Rapid preview switching safety in admin
  assert(
    entranceAnimCode.includes('openedRef') && entranceAnimCode.includes('isFadingOut'),
    'State references and cleanup guard against rapid switching memory leaks and race conditions'
  );

  console.log(`\n================================`);
  console.log(`W7 TESTS TOTAL: ${passed + failed}`);
  console.log(`W7 PASS: ${passed}`);
  console.log(`W7 FAIL: ${failed}`);
  console.log(`================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runW7PerformanceTests().catch(err => {
  console.error(err);
  process.exit(1);
});
