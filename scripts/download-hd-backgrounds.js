const fs = require('fs');
const path = require('path');
const https = require('https');

// Create folders if they don't exist
const publicDir = path.join(__dirname, '..', 'public');
const categories = ['wedding', 'engagement', 'henna', 'circumcision', 'kids', 'corporate', 'graduation'];
categories.forEach(cat => {
  fs.mkdirSync(path.join(publicDir, 'backgrounds', cat), { recursive: true });
});

// Read themes.ts to get all background prompts
const themesPath = path.join(__dirname, '..', 'src', 'lib', 'themes.ts');
let themesContent = fs.readFileSync(themesPath, 'utf8');

// Extract ALL_BACKGROUNDS using a regex or simple eval if we can extract the JSON part
// The backgrounds are in `const ALL_BACKGROUNDS = [...]`
const allBgsMatch = themesContent.match(/"image":\s*"(.*?)"/g);
if (!allBgsMatch) {
  console.error("Could not find any images in themes.ts");
  process.exit(1);
}

const allBgs = [];
const seen = new Set();
allBgsMatch.forEach(m => {
  const url = m.match(/"image":\s*"(.*?)"/)[1];
  if (url.startsWith('/backgrounds/')) {
    if (!seen.has(url)) {
      seen.add(url);
      const name = url.split('/').pop().replace('.webp', '').replace(/-/g, ' ');
      allBgs.push({
        id: url,
        image: url,
        prompt: name
      });
    }
  }
});

console.log(`Found ${allBgs.length} backgrounds to generate in HD.`);

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Status: ${res.statusCode}`));
      }
      const stream = fs.createWriteStream(filepath);
      res.pipe(stream);
      stream.on('finish', () => {
        stream.close();
        resolve();
      });
      stream.on('error', (err) => {
        fs.unlink(filepath, () => reject(err));
      });
    }).on('error', reject);
  });
};

async function generateAll() {
  let count = 0;
  for (const bg of allBgs) {
    if (!bg.image || !bg.prompt) continue;
    
    const filepath = path.join(publicDir, bg.image);
    
    // Skip if file exists and is larger than 0 bytes
    if (fs.existsSync(filepath) && fs.statSync(filepath).size > 0) {
      console.log(`[${count+1}/${allBgs.length}] Skipping existing HD: ${bg.id}`);
      count++;
      continue;
    }
    
    const enhancedPrompt = encodeURIComponent(`high resolution 4k texture, ${bg.prompt}, ultra detailed, premium cinematic background`);
    const seed = Math.floor(Math.random() * 1000000);
    const url = `https://image.pollinations.ai/prompt/${enhancedPrompt}?width=1920&height=1080&nologo=true&seed=${seed}`;
    
    console.log(`[${count+1}/${allBgs.length}] Downloading HD: ${bg.id}...`);
    try {
      await downloadImage(url, filepath);
      console.log(`  -> Saved to ${filepath}`);
    } catch (e) {
      console.error(`  -> Error downloading ${bg.id}: ${e.message}`);
    }
    
    await new Promise(r => setTimeout(r, 1000));
    count++;
  }
  console.log("All backgrounds have been downloaded in 1920x1080 HD!");
}

generateAll();
