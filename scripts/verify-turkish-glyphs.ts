import https from 'https';

const removedFonts = [
  { id: 'Rouge Script', name: 'Rouge Script', google: 'Rouge+Script' },
  { id: 'Petit Formal Script', name: 'Petit Formal Script', google: 'Petit+Formal+Script' },
  { id: 'Yellowtail', name: 'Yellowtail', google: 'Yellowtail' },
  { id: 'Bad Script', name: 'Bad Script', google: 'Bad+Script' },
  { id: 'Patrick Hand', name: 'Patrick Hand', google: 'Patrick+Hand' },
  { id: 'Unna', name: 'Unna', google: 'Unna' },
  { id: 'Vidaloka', name: 'Vidaloka', google: 'Vidaloka' },
  { id: 'Radley', name: 'Radley', google: 'Radley' },
  { id: 'Julius Sans One', name: 'Julius Sans One', google: 'Julius+Sans+One' },
  { id: 'Rozha One', name: 'Rozha One', google: 'Rozha+One' },
  { id: 'Federo', name: 'Federo', google: 'Federo' },
  { id: 'Belleza', name: 'Belleza', google: 'Belleza' },
  { id: 'Sorts Mill Goudy', name: 'Sorts Mill Goudy', google: 'Sorts+Mill+Goudy' },
  { id: 'Caveat Brush', name: 'Caveat Brush', google: 'Caveat+Brush' },
  { id: 'Sniglet', name: 'Sniglet', google: 'Sniglet' },
  { id: 'Concert One', name: 'Concert One', google: 'Concert+One' }
];

async function checkTurkishSupport(font: any): Promise<boolean> {
  return new Promise((resolve) => {
    // Request Google Fonts CSS with latin-ext subset and turkish characters
    const url = `https://fonts.googleapis.com/css2?family=${font.google}&text=%C3%A7%C3%87%C4%9F%C4%9E%C4%B1%C4%B0%C3%B6%C3%96%C5%9F%C5%9E%C3%BC%C3%9C`;
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        // If Google fonts returns empty body or fallback without glyphs, it doesn't support them
        const hasGlyphs = data.includes('@font-face') && !data.includes('/* [0] */') && data.length > 200;
        resolve(hasGlyphs);
      });
    }).on('error', () => resolve(false));
  });
}

async function run() {
  console.log('Testing removed fonts against Google Fonts Turkish subset API...');
  for (const f of removedFonts) {
    const supported = await checkTurkishSupport(f);
    console.log(`- ${f.name} (${f.google}): Turkish Subset Supported = ${supported ? 'YES' : 'NO (Missing Turkish Glyphs)'}`);
  }
}

run();
