const fs = require('fs');
const path = require('path');
const filePath = path.join(process.cwd(), 'src/lib/themes.ts');
let content = fs.readFileSync(filePath, 'utf-8');

const mapping = {
  'parisian-black-tie': 'parisianBlackTie',
  'grand-opera-ballroom': 'grandOpera',
  'moonlit-garden-gala': 'moonlitGarden',
  'vogue-editorial-wedding': 'vogueEditorial',
  'mediterranean-ceramic-villa': 'mediterraneanCeramic',
  'ottoman-illumination-palace': 'ottomanIllumination',
  'coastal-sunset-resort': 'coastalSunset',
  'aurora-glass-pavilion': 'auroraGlass',
  'botanical-watercolor-garden': 'botanicalWatercolor',
  'film-premiere-gala': 'filmPremiere',
  'swiss-gallery-modern': 'swissGallery',
  'royal-palace-ceremony': 'royalPalace',
  'henna-velvet-palace': 'hennaPalace',
  'prince-ceremony-dome': 'princeCeremony',
  'storybook-baby-shower': 'storybook',
  'future-summit': 'futureSummit'
};

for (const [id, animation] of Object.entries(mapping)) {
  const regex = new RegExp(`id:\\s*['"\`]${id}['"\`][^}]*?recommendedOpeningType:\\s*['"\`][^'"\`]+['"\`]`, 'g');
  content = content.replace(regex, (match) => {
     return match.replace(/recommendedOpeningType:\s*['"\`][^'"\`]+['"\`]/, `recommendedOpeningType: "${animation}"`);
  });
}

fs.writeFileSync(filePath, content);
console.log('Patched themes.ts successfully');
