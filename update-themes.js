const fs = require('fs');

const file = 'src/lib/themes.ts';
let content = fs.readFileSync(file, 'utf8');

const layoutMapping = {
  'royal-black-tie': 'centered',
  'rose-gold-romance': 'centered',
  'parisian-ivory': 'asymmetric',
  'ottoman-burgundy': 'circular',
  'bohemian-garden': 'botanical-border',
  'minimal-white-ceremony': 'minimal-card',
  'luxury-marble-gold': 'asymmetric',
  'moonlight-wedding': 'centered',
  'garden-of-roses': 'botanical-border',
  'champagne-reception': 'circular',
  'classic-ivory-wedding': 'centered',
  'velvet-burgundy-night': 'asymmetric',
  'modern-glass-wedding': 'minimal-card',
  'santorini-blue': 'asymmetric',
  'golden-palace': 'circular',
  'lavender-garden': 'botanical-border',
  'autumn-romance': 'botanical-border',
  'winter-pearl': 'minimal-card',
  'black-velvet-luxury': 'circular',
};

// Use regex to insert layoutStyle right before palette: {
for (const [id, layout] of Object.entries(layoutMapping)) {
  const regex = new RegExp(`(id:\\s*'${id}'.*?recommendedBackgroundAnimation:\\s*'.*?',\\n)(\\s*)(palette:)`, 's');
  content = content.replace(regex, `$1$2layoutStyle: '${layout}',\n$2$3`);
}

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully updated themes.ts with layoutStyle');
