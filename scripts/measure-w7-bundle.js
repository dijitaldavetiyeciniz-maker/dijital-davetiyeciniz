const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function getChunkStats(chunks) {
  let totalRaw = 0;
  let totalGzip = 0;
  const chunkDetails = [];

  const uniqueChunks = Array.from(new Set(chunks));
  for (const chunkRel of uniqueChunks) {
    const cleanPath = chunkRel.startsWith('/_next/') ? chunkRel.slice('/_next/'.length) : chunkRel;
    const fullPath = path.join('.next', cleanPath);
    if (fs.existsSync(fullPath)) {
      const buf = fs.readFileSync(fullPath);
      const rawSize = buf.length;
      const gzipSize = zlib.gzipSync(buf).length;
      totalRaw += rawSize;
      totalGzip += gzipSize;
      chunkDetails.push({ chunk: chunkRel, rawSize, gzipSize });
    }
  }

  return {
    rawKB: parseFloat((totalRaw / 1024).toFixed(2)),
    gzipKB: parseFloat((totalGzip / 1024).toFixed(2)),
    chunks: chunkDetails,
  };
}

function analyzeManifest(manifestPath) {
  if (!fs.existsSync(manifestPath)) return null;
  const content = fs.readFileSync(manifestPath, 'utf8');
  
  // Extract RSC manifest
  const match = content.match(/globalThis\.__RSC_MANIFEST\["[^"]+"\]\s*=\s*(\{.*?\});/s);
  if (!match) return null;
  
  const manifestData = JSON.parse(match[1]);
  const initialChunks = new Set();
  const asyncChunks = new Map();

  // Root main files from build-manifest
  const buildManifest = JSON.parse(fs.readFileSync('.next/build-manifest.json', 'utf8'));
  for (const rootFile of buildManifest.rootMainFiles || []) {
    initialChunks.add(`/_next/${rootFile}`);
  }
  for (const poly of buildManifest.polyfillFiles || []) {
    initialChunks.add(`/_next/${poly}`);
  }

  if (manifestData.clientModules) {
    console.log(`Total clientModules in ${path.basename(manifestPath)}:`, Object.keys(manifestData.clientModules).length);
    const openingKeys = Object.keys(manifestData.clientModules).filter(k => k.includes('openings') || k.includes('EntranceAnimation'));
    console.log('Opening keys:', openingKeys);
    for (const [modPath, modInfo] of Object.entries(manifestData.clientModules)) {
      if (modInfo.chunks) {
        if (modInfo.async) {
          asyncChunks.set(modPath, modInfo.chunks);
        } else {
          for (const ch of modInfo.chunks) {
            initialChunks.add(ch);
          }
        }
      }
    }
  }

  return {
    initial: getChunkStats(Array.from(initialChunks)),
    asyncModules: asyncChunks,
  };
}

const publicStats = analyzeManifest('.next/server/app/[wedding_id]/page_client-reference-manifest.js');
const adminStats = analyzeManifest('.next/server/app/[wedding_id]/admin/page_client-reference-manifest.js');

console.log('=== C13 W7 OPENING PERFORMANCE BUNDLE MEASUREMENTS ===');
console.log('Public Route Initial JS:');
console.log(`  Raw: ${publicStats.initial.rawKB} KB (Baseline: 842.15 KB, Delta: ${(publicStats.initial.rawKB - 842.15).toFixed(2)} KB)`);
console.log(`  Gzip: ${publicStats.initial.gzipKB} KB (Baseline: 246.30 KB, Delta: ${(publicStats.initial.gzipKB - 246.30).toFixed(2)} KB)`);

console.log('\nAdmin Route Initial JS:');
console.log(`  Raw: ${adminStats.initial.rawKB} KB (Baseline: 1184.60 KB, Delta: ${(adminStats.initial.rawKB - 1184.60).toFixed(2)} KB)`);
console.log(`  Gzip: ${adminStats.initial.gzipKB} KB (Baseline: 348.90 KB, Delta: ${(adminStats.initial.gzipKB - 348.90).toFixed(2)} KB)`);

console.log('\nAsync Dynamic Modules Found:', publicStats.asyncModules.size);
for (const [mod, chs] of publicStats.asyncModules.entries()) {
  if (mod.includes('openings/')) {
    const modName = mod.split('openings/')[1];
    const stats = getChunkStats(chs);
    console.log(`  - ${modName}: ${stats.rawKB} KB (gzip: ${stats.gzipKB} KB, chunks: ${chs.join(', ')})`);
  }
}
