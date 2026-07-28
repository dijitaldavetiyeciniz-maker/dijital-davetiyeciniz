const fs = require('fs');
const path = require('path');
const pixelmatch = require('pixelmatch');
const { PNG } = require('pngjs');
const sharp = require('sharp');

const AUDIT_DIR = path.join(process.cwd(), 'test-results/flagship-visual-audit');

async function run() {
  if (!fs.existsSync(AUDIT_DIR)) {
    console.log("No audit dir found.");
    return;
  }
  const files = fs.readdirSync(AUDIT_DIR).filter(f => f.endsWith('.png') && !f.includes('contact-sheet'));
  
  const mobileFiles = files.filter(f => f.includes('mobile'));
  const desktopFiles = files.filter(f => f.includes('desktop'));

  console.log(`Found ${mobileFiles.length} mobile and ${desktopFiles.length} desktop screenshots.`);

  async function compareGroup(groupFiles, type) {
    let maxSimilarity = 0;
    let mostSimilarPair = [];
    let exactDuplicates = 0;
    let nearDuplicates = 0;
    
    // Create contact sheet
    if (groupFiles.length > 0) {
      const images = [];
      for (const file of groupFiles) {
        const id = file.replace(`-${type}.png`, '');
        const img = await sharp(path.join(AUDIT_DIR, file)).toBuffer();
        
        const svgWidth = type === 'mobile' ? 390 : 1440;
        const svgLabel = `
          <svg width="${svgWidth}" height="50">
            <rect width="100%" height="100%" fill="black" />
            <text x="50%" y="30" font-size="24" font-family="Arial" fill="white" text-anchor="middle">${id}</text>
          </svg>
        `;
        const label = await sharp(Buffer.from(svgLabel)).png().toBuffer();
        
        const combined = await sharp({
          create: {
            width: type === 'mobile' ? 390 : 1440,
            height: (type === 'mobile' ? 844 : 900) + 50,
            channels: 4,
            background: { r: 255, g: 255, b: 255, alpha: 1 }
          }
        })
        .composite([
          { input: await sharp(img).resize({ width: type === 'mobile' ? 390 : 1440, height: type === 'mobile' ? 844 : 900, fit: 'cover' }).toBuffer(), top: 0, left: 0 },
          { input: label, top: type === 'mobile' ? 844 : 900, left: 0 }
        ])
        .png()
        .toBuffer();
        
        images.push(combined);
      }
      
      const width = type === 'mobile' ? 390 : 1440;
      const height = (type === 'mobile' ? 844 : 900) + 50;
      const cols = type === 'mobile' ? 6 : 3;
      const rows = Math.ceil(images.length / cols);
      
      const sheet = sharp({
        create: {
          width: cols * width,
          height: rows * height,
          channels: 4,
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        }
      });
      
      const composites = images.map((img, i) => ({
        input: img,
        top: Math.floor(i / cols) * height,
        left: (i % cols) * width
      }));
      
      await sheet.composite(composites).toFile(path.join(AUDIT_DIR, `contact-sheet-${type}.png`));
    }

    for (let i = 0; i < groupFiles.length; i++) {
      for (let j = i + 1; j < groupFiles.length; j++) {
        // resize to standard dimension before diff
        const stdWidth = type === 'mobile' ? 390 : 1440;
        const stdHeight = type === 'mobile' ? 844 : 900;
        
        const buf1 = await sharp(path.join(AUDIT_DIR, groupFiles[i])).resize({width: stdWidth, height: stdHeight, fit: 'cover'}).toBuffer();
        const buf2 = await sharp(path.join(AUDIT_DIR, groupFiles[j])).resize({width: stdWidth, height: stdHeight, fit: 'cover'}).toBuffer();
        
        const img1 = PNG.sync.read(buf1);
        const img2 = PNG.sync.read(buf2);
        
        const pm = typeof pixelmatch === 'function' ? pixelmatch : pixelmatch.default;
        const diffPixels = pm(img1.data, img2.data, null, stdWidth, stdHeight, { threshold: 0.1 });
        
        const totalPixels = stdWidth * stdHeight;
        const diffRatio = diffPixels / totalPixels;
        const similarity = 1 - diffRatio;
        
        if (similarity === 1) exactDuplicates++;
        if (similarity > 0.98) nearDuplicates++;
        
        if (similarity > maxSimilarity) {
          maxSimilarity = similarity;
          mostSimilarPair = [groupFiles[i], groupFiles[j]];
        }
        
        if (similarity >= 0.95) {
          console.log(`[NEAR DUPLICATE] ${groupFiles[i]} and ${groupFiles[j]}: ${(similarity * 100).toFixed(2)}%`);
        }
      }
    }
    return { maxSimilarity, mostSimilarPair, exactDuplicates, nearDuplicates };
  }

  const mobileRes = await compareGroup(mobileFiles, 'mobile');
  const desktopRes = await compareGroup(desktopFiles, 'desktop');

  console.log('\n--- PERCEPTUAL VISUAL SIMILARITY REPORT ---');
  console.log(`Mobile Exact Duplicates: ${mobileRes.exactDuplicates}`);
  console.log(`Mobile Near Duplicates (>98%): ${mobileRes.nearDuplicates}`);
  console.log(`Highest Mobile Similarity: ${(mobileRes.maxSimilarity * 100).toFixed(2)}% between ${mobileRes.mostSimilarPair.join(' and ')}`);
  
  console.log(`Desktop Exact Duplicates: ${desktopRes.exactDuplicates}`);
  console.log(`Desktop Near Duplicates (>98%): ${desktopRes.nearDuplicates}`);
  console.log(`Highest Desktop Similarity: ${(desktopRes.maxSimilarity * 100).toFixed(2)}% between ${desktopRes.mostSimilarPair.join(' and ')}`);
}

run().catch(console.error);
