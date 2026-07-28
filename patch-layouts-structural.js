const fs = require('fs');
const path = require('path');

const layoutsDir = path.join(__dirname, 'src/components/templates/layouts');
const files = fs.readdirSync(layoutsDir).filter(f => f.endsWith('.tsx'));

const mappings = {
  'ParisianApartmentLayout.tsx': 'parisian-black-tie',
  'ArtDecoTheaterLayout.tsx': 'grand-opera-ballroom',
  'ConstellationNightLayout.tsx': 'moonlit-secret-garden',
  'FashionMagazineLayout.tsx': 'vogue-wedding-editorial',
  'BotanicalCeramicLayout.tsx': 'mediterranean-ceramic-garden',
  'OrientalLaceLayout.tsx': 'ottoman-illumination',
  'FullBleedPhotoLayout.tsx': 'coastal-sunset',
  'ModernArchitectureLayout.tsx': 'aurora-glass',
  'BotanicalFrameLayout.tsx': 'fine-art-botanical-watercolor',
  'CinematicPosterLayout.tsx': 'film-premiere-night',
  'SwissGridCeremonyLayout.tsx': 'minimal-swiss-gallery',
  'RoyalLetterLayout.tsx': 'royal-palace-invitation',
  'HennaVelvetLayout.tsx': 'henna-palace-night',
  'RoyalCircumcisionLayout.tsx': 'prince-ceremony',
  'KidsThematicLayout.tsx': 'storybook-babyshower',
  'ModernEventLayout.tsx': 'future-summit'
};

for (const file of files) {
  if (!mappings[file]) continue;
  const filePath = path.join(layoutsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Find the LAST 'return (' in the file, which is the main component return.
  const returnMatches = [...content.matchAll(/return \s*\(/g)];
  if (returnMatches.length === 0) continue;
  
  const lastMatch = returnMatches[returnMatches.length - 1];
  const returnIndex = lastMatch.index;
  
  const beforeReturn = content.slice(0, returnIndex);
  
  // Find the end of this return statement. Usually it's the last ');' before the final '}'
  const endMatch = content.lastIndexOf(');');
  if (endMatch === -1 || endMatch < returnIndex) continue;
  
  const originalJsx = content.slice(returnIndex + lastMatch[0].length, endMatch);
  
  let altJsx = originalJsx;
  
  // Apply real structural differences
  altJsx = altJsx.replace(/className="([^"]*flex-col[^"]*)"/g, (match, classes) => {
    return `className="${classes.replace('flex-col', 'flex-col-reverse')} flagship-order-reversed"`;
  });
  
  altJsx = altJsx.replace(/\{renderRsvpButton\(\)\}/g, 'TEMP_RSVP_MARKER')
                 .replace(/\{renderGuestBook\(\)\}/g, '{renderRsvpButton()}')
                 .replace(/TEMP_RSVP_MARKER/g, '{renderGuestBook()}');

  altJsx = `<main data-flagship-layout="true" className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-items-center relative z-20">
    <div className="md:col-span-2 w-full flex flex-col items-center order-last md:order-first">${altJsx}</div>
  </main>`;

  const conditionId = file === 'KidsThematicLayout.tsx' 
    ? `['storybook-babyshower', 'storybook-birthday'].includes(wedding?.template_id)`
    : `wedding?.template_id === '${mappings[file]}'`;

  const newReturn = `return ${conditionId} ? (\n    ${altJsx}\n  ) : (\n    ${originalJsx}\n  );`;
  
  const newContent = beforeReturn + newReturn + content.slice(endMatch + 2);
  fs.writeFileSync(filePath, newContent);
  console.log('Patched structurally:', file);
}
