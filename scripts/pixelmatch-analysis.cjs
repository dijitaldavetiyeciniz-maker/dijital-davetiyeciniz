'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');

// pixelmatch may be an ES module default export wrapped
const pm = typeof pixelmatch === 'function' ? pixelmatch : pixelmatch.default;

const AUDIT_DIR = path.join(__dirname, '..', 'test-results', 'flagship-visual-audit');

const allFiles = fs.readdirSync(AUDIT_DIR).filter(f => f.endsWith('.png') && !f.startsWith('contact-sheet'));
const mobileFiles = allFiles.filter(f => f.includes('mobile')).sort();
const desktopFiles = allFiles.filter(f => f.includes('desktop')).sort();

console.log('Mobile files:', mobileFiles.length);
console.log('Desktop files:', desktopFiles.length);

function loadPNG(filePath) {
  const data = fs.readFileSync(filePath);
  const png = PNG.sync.read(data);
  return png;
}

function computeSimilarities(files) {
  const pngs = files.map(f => {
    try {
      const png = loadPNG(path.join(AUDIT_DIR, f));
      const buf = fs.readFileSync(path.join(AUDIT_DIR, f));
      const hash = crypto.createHash('sha256').update(buf).digest('hex');
      return { name: f, png, size: buf.length, hash, width: png.width, height: png.height };
    } catch (e) {
      return { name: f, png: null, error: e.message };
    }
  });

  const pairs = [];
  for (let i = 0; i < pngs.length; i++) {
    for (let j = i + 1; j < pngs.length; j++) {
      const a = pngs[i];
      const b = pngs[j];
      if (!a.png || !b.png) {
        pairs.push({ a: a.name, b: b.name, similarity: null, note: 'load error' });
        continue;
      }
      // Ensure same dimensions for comparison
      if (a.png.width !== b.png.width || a.png.height !== b.png.height) {
        pairs.push({ a: a.name, b: b.name, similarity: null, note: `dim mismatch ${a.png.width}x${a.png.height} vs ${b.png.width}x${b.png.height}` });
        continue;
      }
      const total = a.png.width * a.png.height;
      const diff = new PNG({ width: a.png.width, height: a.png.height });
      const mismatched = pm(a.png.data, b.png.data, diff.data, a.png.width, a.png.height, { threshold: 0.1 });
      const mismatchRatio = mismatched / total;
      const similarity = (1 - mismatchRatio) * 100;
      pairs.push({ a: a.name, b: b.name, similarity: parseFloat(similarity.toFixed(4)), mismatched, total });
    }
  }

  pairs.sort((x, y) => (y.similarity || 0) - (x.similarity || 0));
  return { pairs, pngs };
}

console.log('\n=== MOBILE ANALYSIS ===');
const { pairs: mobilePairs, pngs: mobilePNGs } = computeSimilarities(mobileFiles);
console.log('\nFile details:');
mobilePNGs.forEach(f => {
  if (f.png) {
    console.log(`  ${f.name}: ${f.width}x${f.height} ${f.size} bytes SHA:${f.hash.slice(0,16)}...`);
  } else {
    console.log(`  ${f.name}: ERROR ${f.error}`);
  }
});

const validMobilePairs = mobilePairs.filter(p => p.similarity !== null);
console.log('\nTop 10 most similar mobile pairs:');
validMobilePairs.slice(0, 10).forEach(p => {
  console.log(`  ${p.similarity.toFixed(2)}% | ${p.a} vs ${p.b}`);
});
const mHighest = validMobilePairs[0]?.similarity;
const mLowest = validMobilePairs[validMobilePairs.length - 1]?.similarity;
const m98 = validMobilePairs.filter(p => p.similarity >= 98).length;
const m9598 = validMobilePairs.filter(p => p.similarity >= 95 && p.similarity < 98).length;
console.log(`\nHighest mobile similarity: ${mHighest?.toFixed(2)}%`);
console.log(`Lowest mobile similarity: ${mLowest?.toFixed(2)}%`);
console.log(`>= 98% pairs: ${m98}`);
console.log(`95-98% pairs: ${m9598}`);

console.log('\n=== DESKTOP ANALYSIS ===');
const { pairs: desktopPairs, pngs: desktopPNGs } = computeSimilarities(desktopFiles);
console.log('\nFile details:');
desktopPNGs.forEach(f => {
  if (f.png) {
    console.log(`  ${f.name}: ${f.width}x${f.height} ${f.size} bytes SHA:${f.hash.slice(0,16)}...`);
  } else {
    console.log(`  ${f.name}: ERROR ${f.error}`);
  }
});

const validDesktopPairs = desktopPairs.filter(p => p.similarity !== null);
console.log('\nTop 10 most similar desktop pairs:');
validDesktopPairs.slice(0, 10).forEach(p => {
  console.log(`  ${p.similarity.toFixed(2)}% | ${p.a} vs ${p.b}`);
});
const dHighest = validDesktopPairs[0]?.similarity;
const dLowest = validDesktopPairs[validDesktopPairs.length - 1]?.similarity;
const d98 = validDesktopPairs.filter(p => p.similarity >= 98).length;
const d9598 = validDesktopPairs.filter(p => p.similarity >= 95 && p.similarity < 98).length;
console.log(`\nHighest desktop similarity: ${dHighest?.toFixed(2)}%`);
console.log(`Lowest desktop similarity: ${dLowest?.toFixed(2)}%`);
console.log(`>= 98% pairs: ${d98}`);
console.log(`95-98% pairs: ${d9598}`);

// SHA-256 duplicate check
console.log('\n=== EXACT DUPLICATE CHECK ===');
const allPNGFiles = [...mobilePNGs, ...desktopPNGs];
const hashSet = new Set();
let duplicates = 0;
allPNGFiles.forEach(f => {
  if (!f.hash) return;
  if (hashSet.has(f.hash)) {
    console.log(`DUPLICATE: ${f.name} hash ${f.hash.slice(0,16)}`);
    duplicates++;
  }
  hashSet.add(f.hash);
});
console.log(`Total exact duplicates: ${duplicates}`);

// Single-color check (if all pixels are same color, likely blank)
console.log('\n=== BLANK/SINGLE-COLOR CHECK ===');
allPNGFiles.forEach(f => {
  if (!f.png) return;
  const data = f.png.data;
  const r0 = data[0], g0 = data[1], b0 = data[2];
  let isSingleColor = true;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i] !== r0 || data[i+1] !== g0 || data[i+2] !== b0) {
      isSingleColor = false;
      break;
    }
  }
  if (isSingleColor) console.log(`SINGLE-COLOR: ${f.name} (${r0},${g0},${b0})`);
});
console.log('Single-color check complete.');
