const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, 'src', 'components', 'templates');

// Helper to add textColor to props interface
const typeReplacer = `interface TemplateProps {
  wedding: any;
}`;

function updateTemplate(num, timerStyle, buttonStyle, effectComponent) {
  const filePath = path.join(templatesDir, `Template${num}.tsx`);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');

  // Inject imports if needed
  if (effectComponent === 'BubblesEffect' && !content.includes('BubblesEffect')) {
    content = content.replace("import CountdownTimer", "import BubblesEffect from '../effects/BubblesEffect';\nimport CountdownTimer");
  }
  if (effectComponent === 'SparklesEffect' && !content.includes('SparklesEffect')) {
    content = content.replace("import CountdownTimer", "import SparklesEffect from '../effects/SparklesEffect';\nimport CountdownTimer");
  }

  // Inject text color variable
  if (!content.includes('const textColor')) {
    const primaryColorLine = "const primaryColor = wedding.primary_color";
    content = content.replace(/const primaryColor = .*?;/, (match) => {
      return match + "\n  const textColor = wedding.text_color || '#1e293b';";
    });
  }

  // Apply textColor to main container
  content = content.replace(/<div[^>]*className="\`?min-h-screen[^>]*>/, (match) => {
    let m = match.replace(/text-slate-\d+/g, '').replace(/text-white/g, '');
    if (m.includes('style={{')) {
      return m.replace('style={{', 'style={{ color: textColor, ');
    } else {
      return m.replace('>', ' style={{ color: textColor }}>');
    }
  });

  // Apply timer style
  content = content.replace(/<CountdownTimer targetDate=\{wedding\.wedding_date\} \/>/, '<CountdownTimer targetDate={wedding.wedding_date} primaryColor={primaryColor} styleType="' + timerStyle + '" />');

  // Apply button style
  if (content.includes('FloatingActionBar')) {
    content = content.replace(/<FloatingActionBar[^>]*\/>/s, (match) => {
      if (match.includes('styleType')) return match;
      return match.replace('/>', ' styleType="' + buttonStyle + '" />');
    });
  }

  // Inject Effect
  if (effectComponent === 'BubblesEffect') {
    content = content.replace('{wedding.background_image_url && <div className="absolute inset-0 bg-black/40" />}', '{wedding.background_image_url && <div className="absolute inset-0 bg-black/40" />}\n      <BubblesEffect />');
    content = content.replace('{wedding.background_image_url && <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" />}', '{wedding.background_image_url && <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" />}\n      <BubblesEffect />');
  }
  if (effectComponent === 'SparklesEffect') {
    content = content.replace('{wedding.background_image_url && <div className="absolute inset-0 opacity-40"', '<SparklesEffect color={primaryColor} />\n      {wedding.background_image_url && <div className="absolute inset-0 opacity-40"');
    content = content.replace('{wedding.background_image_url && <div className="absolute inset-0 opacity-10"', '<SparklesEffect color={primaryColor} />\n      {wedding.background_image_url && <div className="absolute inset-0 opacity-10"');
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated Template ' + num);
}

// T1: Cam (glass / orbs / bubbles)
updateTemplate(1, 'glass', 'orbs', 'BubblesEffect');
// T2: Neon (neon / neon / sparkles)
updateTemplate(2, 'neon', 'neon', 'SparklesEffect');
// T3: Doğal (minimal / minimal / none)
updateTemplate(3, 'minimal', 'minimal', 'none');
// T4: Lüks (elegant / pill / sparkles)
updateTemplate(4, 'elegant', 'pill', 'SparklesEffect');
// T5: Minimalist (minimal / minimal / none)
updateTemplate(5, 'minimal', 'minimal', 'none');
// T6: Çiçekli (glass / orbs / bubbles)
updateTemplate(6, 'glass', 'orbs', 'BubblesEffect');
// T7: Polaroid (minimal / minimal / none)
updateTemplate(7, 'minimal', 'minimal', 'none');
// T8: Altın (elegant / pill / sparkles)
updateTemplate(8, 'elegant', 'pill', 'SparklesEffect');
// T9: Geometrik (neon / neon / none) // neon timer fits well with sharp edges sometimes, let's use glass for T9
updateTemplate(9, 'glass', 'neon', 'none');
// T10: Mektup (elegant / pill / sparkles)
updateTemplate(10, 'elegant', 'pill', 'SparklesEffect');
