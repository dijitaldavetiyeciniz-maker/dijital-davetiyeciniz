const fs = require('fs');
const file = 'src/app/d/[wedding_id]/admin/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const startIdx = content.indexOf('{/* 2. Giriş Animasyon Tasarımı */}');
const endMarker = '{/* Font Pairs Presets */}';
const endIdx = content.indexOf(endMarker);

if (startIdx !== -1 && endIdx !== -1) {
  // Extract the block
  let block = content.substring(startIdx, endIdx);
  // Remove it from the original place
  content = content.slice(0, startIdx) + '<div className="space-y-6">\n' + content.slice(endIdx);
  
  const animasyonStart = content.indexOf('<h3 className="font-bold text-lg mb-4 text-slate-800">Site Giriş Animasyonu</h3>');
  
  const noteHtml = `
  <div className="mb-6 p-4 bg-amber-50/50 border border-amber-200/50 rounded-xl">
    <p className="text-sm text-amber-800 font-bold flex items-center gap-2"><span>ℹ️</span> Animasyon Ayarları Hakkında</p>
    <p className="text-xs text-amber-700/80 mt-1 leading-relaxed">
      Bu sekmede yer alan ayarlar, davetiyenizin <strong>ilk açılış ekranını</strong> (zarf, kapak tasarımı, arka plan parıltıları) ve <strong>arka plan müziğini</strong> yönetir. Zarf/Mühür modelinizi veya yeni nesil zarfsız kapaklarınızı buradan değiştirebilirsiniz.
    </p>
  </div>\n`;
  
  if (animasyonStart !== -1) {
    // Also remove the old `<div className="space-y-6">` that was wrapped around it improperly
    block = block.replace('<div className="space-y-6">', '');
    
    content = content.slice(0, animasyonStart) + noteHtml + block + content.slice(animasyonStart);
    fs.writeFileSync(file, content);
    console.log('Successfully moved the animation section and added the note.');
  } else {
    console.log('Could not find animasyon tab start.');
  }
} else {
  console.log('Could not find block boundaries.');
}
