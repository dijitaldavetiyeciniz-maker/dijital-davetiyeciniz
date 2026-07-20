const fs = require('fs');
const file = 'src/app/d/[wedding_id]/admin/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Upgrade main background
content = content.replace(
  'className="min-h-screen bg-slate-50 p-4 md:p-8 text-slate-800"',
  'className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-rose-50/20 to-slate-100 p-4 md:p-8 text-slate-800 selection:bg-rose-200"'
);

// Upgrade panels (Sol Kolon)
content = content.replace(
  'className="bg-white rounded-3xl p-6 lg:p-10 shadow-xl border border-slate-200/60 relative"',
  'className="bg-white/70 backdrop-blur-3xl rounded-[2.5rem] p-6 lg:p-10 shadow-[0_8px_40px_-12px_rgba(225,29,72,0.1)] border border-white/80 relative overflow-hidden"'
);

// Add a decorative glow inside the main panel
content = content.replace(
  '{/* ÜST BİLGİ & TOAST */}',
  '{/* Dekoratif Işıltı */}\n<div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-rose-500/5 to-transparent pointer-events-none" />\n{/* ÜST BİLGİ & TOAST */}'
);

// Upgrade header texts
content = content.replace(
  '<h1 className="text-3xl font-black tracking-tight text-slate-900">Tasarım Stüdyosu</h1>',
  '<h1 className="text-3xl md:text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-rose-800 to-slate-900">Tasarım Stüdyosu ✨</h1>'
);

// Upgrade the generic sections borders
content = content.replaceAll(
  'border-b pb-2',
  'border-b border-rose-100 pb-3'
);

// Upgrade inputs
content = content.replaceAll(
  'bg-slate-50',
  'bg-white/50 backdrop-blur-sm shadow-inner'
);

fs.writeFileSync(file, content);
console.log('Premium styling applied.');
