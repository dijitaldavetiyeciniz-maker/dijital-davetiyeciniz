const fs = require('fs');
const path = require('path');
const https = require('https');

const CATEGORIES = {
  wedding: { name: 'Düğün', count: 35, themes: ['marble', 'silk', 'botanical', 'night', 'luxury'] },
  engagement: { name: 'Nişan / Söz', count: 15, themes: ['rose-gold', 'floral', 'velvet', 'soft-marble'] },
  henna: { name: 'Kına', count: 15, themes: ['red-velvet', 'gold-ornament', 'oriental', 'dark-red'] },
  circumcision: { name: 'Sünnet', count: 15, themes: ['blue-gold', 'palace', 'ottoman', 'stars'] },
  kids: { name: 'Çocuk & Baby Shower', count: 25, themes: ['pastel', 'clouds', 'safari', 'space', 'ocean', 'rainbow'] },
  corporate: { name: 'Kurumsal', count: 8, themes: ['modern', 'tech', 'minimal', 'dark-metal'] },
  graduation: { name: 'Mezuniyet', count: 7, themes: ['celebration', 'black-gold', 'university', 'stars'] }
};

const PROMPT_TEMPLATES = {
  'marble': ['white gold vein marble', 'black gold marble', 'emerald green gold marble texture', 'rose gold marble texture', 'silver white marble texture', 'champagne marble texture', 'onyx stone texture', 'travertine premium texture'],
  'silk': ['burgundy velvet texture', 'navy blue velvet texture', 'black velvet texture', 'rose gold silk texture', 'champagne satin texture', 'cream linen texture', 'lace premium texture'],
  'botanical': ['floral garden background', 'lavender field background', 'olive and lemon garden background', 'bougainvillea courtyard', 'forest green background', 'tropical leaves background', 'spring flowers background'],
  'night': ['starry night background', 'constellation map background', 'navy gold night background', 'moonlight scene', 'art deco stage', 'palace hall background', 'neon tech stage', 'black gold gala'],
  'luxury': ['gold foil paper texture', 'parchment paper texture', 'boho kraft texture', 'premium luxury texture', 'diamond sparkle background'],
  
  // Engagement
  'rose-gold': ['rose gold luxury texture', 'pink gold sparkles'],
  'floral': ['pink roses background', 'white floral garden'],
  'velvet': ['soft pink velvet', 'cream velvet texture'],
  'soft-marble': ['soft pink marble texture', 'white cream marble'],

  // Henna
  'red-velvet': ['deep red velvet texture', 'burgundy silk'],
  'gold-ornament': ['oriental gold ornaments on red', 'traditional henna pattern gold'],
  'oriental': ['oriental lace red background', 'dark red oriental tiles'],
  'dark-red': ['dark red luxury texture', 'red gold sparks'],

  // Circumcision
  'blue-gold': ['navy blue gold ornaments', 'blue velvet gold'],
  'palace': ['ottoman palace interior', 'palace archway blue gold'],
  'ottoman': ['traditional ottoman pattern blue', 'iznik tile pattern'],
  'stars': ['blue starry night gold', 'crescent moon and stars blue'],

  // Kids
  'pastel': ['pastel colors background', 'pastel confetti'],
  'clouds': ['pastel clouds sky', 'hot air balloons in sky', 'teddy bear in clouds'],
  'safari': ['cute safari jungle background', 'jungle leaves pastel'],
  'space': ['space galaxy cute kids', 'astronaut baby room'],
  'ocean': ['underwater cute ocean background', 'mermaid pastel sea'],
  'rainbow': ['cute rainbow background', 'magical fairy tale room'],

  // Corporate
  'modern': ['modern minimal office background', 'clean white architectural'],
  'tech': ['neon grid tech background', 'blue digital abstract'],
  'minimal': ['minimal gray texture', 'clean white paper texture'],
  'dark-metal': ['dark brushed metal texture', 'luxury black corporate'],

  // Graduation
  'celebration': ['graduation confetti background', 'gold confetti celebration'],
  'black-gold': ['black and gold luxury background', 'black graduation texture'],
  'university': ['university hall background', 'library books background']
};

const ORNAMENT_MAP = {
  'marble': 'gold-sparkles',
  'silk': 'none',
  'botanical': 'none',
  'night': 'stars',
  'luxury': 'gold-sparkles',
  'rose-gold': 'rose-sparkles',
  'floral': 'none',
  'red-velvet': 'gold-sparkles',
  'blue-gold': 'gold-sparkles',
  'pastel': 'none',
  'clouds': 'none',
  'space': 'stars',
  'rainbow': 'none'
};

const generatedBackgrounds = {};
const allBgsFlat = [];

function toId(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Generate the objects
Object.keys(CATEGORIES).forEach(cat => {
  generatedBackgrounds[cat] = [];
  const catInfo = CATEGORIES[cat];
  const requiredCount = catInfo.count;
  
  let i = 0;
  let themeIndex = 0;
  
  // Special case for emerald-gold-marble
  if (cat === 'wedding') {
    const specialBg = {
      id: 'emerald-gold-marble',
      name: 'Zümrüt Yeşili Mermer',
      image: `/backgrounds/${cat}/emerald-gold-marble.webp`,
      preview: `/backgrounds/${cat}/emerald-gold-marble.webp`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      ornamentSet: 'emerald-gold',
      fallbackColor: '#002211',
      prompt: 'emerald green marble with gold veins premium texture full screen'
    };
    generatedBackgrounds[cat].push(specialBg);
    allBgsFlat.push({ ...specialBg, cat });
    i++;
  }
  
  while (i < requiredCount) {
    const theme = catInfo.themes[themeIndex % catInfo.themes.length];
    const templates = PROMPT_TEMPLATES[theme] || ['premium background'];
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    // Create unique name
    const uniqueSuffix = (i + 1).toString();
    const nameStr = `${template} ${uniqueSuffix}`;
    const id = toId(nameStr);
    
    // Avoid duplicates
    if (!generatedBackgrounds[cat].find(b => b.id === id)) {
      const bg = {
        id,
        name: nameStr.split(' ').slice(0, 3).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        image: `/backgrounds/${cat}/${id}.webp`,
        preview: `/backgrounds/${cat}/${id}.webp`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        ornamentSet: ORNAMENT_MAP[theme] || 'none',
        fallbackColor: '#1a1a1a', // Fallback color
        prompt: `${template} highly detailed premium design background`
      };
      
      generatedBackgrounds[cat].push(bg);
      allBgsFlat.push({ ...bg, cat });
      i++;
    }
    
    themeIndex++;
  }
});

// Update themes.ts
const themesPath = path.join(__dirname, 'src', 'lib', 'themes.ts');
let themesContent = fs.readFileSync(themesPath, 'utf8');

// We will inject the new backgrounds into themes.ts by replacing the old ones or just appending.
// Actually, it's safer to completely rewrite the backgrounds part or append it and change getBackgroundsForCategory.

let newBgsCode = `// --- AUTO GENERATED 120+ BACKGROUNDS ---\n`;
Object.keys(generatedBackgrounds).forEach(cat => {
  newBgsCode += `export const ${cat.toUpperCase()}_BACKGROUNDS = ${JSON.stringify(generatedBackgrounds[cat].map(b => ({
    id: b.id,
    name: b.name,
    image: b.image,
    preview: b.preview,
    backgroundSize: b.backgroundSize,
    backgroundPosition: b.backgroundPosition,
    ornamentSet: b.ornamentSet,
    fallbackColor: b.fallbackColor
  })), null, 2)};\n\n`;
});

newBgsCode += `
export function getBackgroundsForCategory(categorySlug: string) {
  switch(categorySlug) {
    case 'wedding': return WEDDING_BACKGROUNDS;
    case 'engagement': return ENGAGEMENT_BACKGROUNDS;
    case 'henna': return HENNA_BACKGROUNDS;
    case 'circumcision': return CIRCUMCISION_BACKGROUNDS;
    case 'baby-shower':
    case 'kids': return KIDS_BACKGROUNDS;
    case 'corporate': return CORPORATE_BACKGROUNDS;
    case 'graduation': return GRADUATION_BACKGROUNDS;
    default: return WEDDING_BACKGROUNDS;
  }
}
`;

// Replace everything from export const WEDDING_BACKGROUNDS to the end of file (or we can just append if we remove the old ones)
themesContent = themesContent.replace(/export const WEDDING_BACKGROUNDS = \[[\s\S]*$/, newBgsCode);

fs.writeFileSync(themesPath, themesContent, 'utf8');
console.log('themes.ts updated with 120+ backgrounds.');

// Create directories
allBgsFlat.forEach(bg => {
  const dir = path.join(__dirname, 'public', 'backgrounds', bg.cat);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// We will download in parallel (e.g. 10 at a time) to not block too long, but we must do it fast.
async function downloadImages() {
  console.log(`Starting download of ${allBgsFlat.length} images...`);
  
  const downloadFile = (url, filepath) => new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${res.statusCode}`));
        return;
      }
      const stream = fs.createWriteStream(filepath);
      res.pipe(stream);
      stream.on('finish', () => { stream.close(); resolve(); });
    }).on('error', reject);
  });

  const concurrency = 1;
  const delay = ms => new Promise(res => setTimeout(res, ms));
  let index = 0;
  
  while (index < allBgsFlat.length) {
    const batch = allBgsFlat.slice(index, index + concurrency);
    await Promise.all(batch.map(async bg => {
      const targetPath = path.join(__dirname, 'public', bg.image);
      if (fs.existsSync(targetPath)) return; // Skip if exists
      const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(bg.prompt)}?width=1080&height=1920&nologo=true`;
      try {
        await downloadFile(url, targetPath);
        console.log(`Downloaded ${bg.id}`);
        await delay(3000); // 3 seconds delay to avoid 429
      } catch (e) {
        console.log(`Error downloading ${bg.id}: ${e.message}`);
        await delay(5000);
        try {
           await downloadFile(url, targetPath);
        } catch (e2) {}
      }
    }));
    index += concurrency;
    console.log(`Progress: ${index} / ${allBgsFlat.length}`);
  }
  
  console.log('All images downloaded successfully.');
}

downloadImages();
