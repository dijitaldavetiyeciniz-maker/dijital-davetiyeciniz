const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'components', 'templates');

for (let i = 1; i <= 5; i++) {
  const file = path.join(dir, `Template${i}.tsx`);
  if (!fs.existsSync(file)) continue;
  
  let code = fs.readFileSync(file, 'utf8');

  if (i === 1) {
    code = code.replace('className="max-w-2xl w-full bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-10 text-center relative z-10 border border-white/50"', 'className="max-w-[420px] mx-auto w-full bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 sm:p-10 text-center relative z-10 border border-white/50 my-8"');
  } else if (i === 2) {
    code = code.replace('className="max-w-2xl w-full bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 p-10 text-center relative z-10 shadow-2xl"', 'className="max-w-[420px] mx-auto w-full bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 p-8 sm:p-10 text-center relative z-10 shadow-2xl my-8"');
  } else if (i === 3) {
    code = code.replace('className="max-w-2xl w-full bg-white/90 backdrop-blur-md shadow-xl p-10 text-center relative border-8 z-10"', 'className="max-w-[420px] mx-auto w-full bg-white/90 backdrop-blur-md shadow-2xl p-8 sm:p-10 text-center relative border-8 z-10 my-8"');
  } else if (i === 4) {
    code = code.replace('className="max-w-2xl w-full p-10 text-center relative z-10"', 'className="max-w-[420px] mx-auto w-full p-8 sm:p-10 text-center relative z-10 bg-white/80 backdrop-blur shadow-2xl rounded-sm my-8 border border-amber-200/50"');
  } else if (i === 5) {
    // Template 5 is a bit more complex, need to change layout to strictly vertical
    code = code.replace('className="max-w-4xl mx-auto w-full flex flex-col md:flex-row items-center gap-16 relative z-10"', 'className="max-w-[420px] mx-auto w-full flex flex-col items-center gap-8 relative z-10 bg-white/95 backdrop-blur shadow-2xl p-8 sm:p-10 rounded-2xl my-8 text-center"');
    code = code.replace('className="text-6xl md:text-8xl font-black tracking-tighter mb-4 flex items-center justify-center w-full"', 'className="text-5xl md:text-6xl font-black tracking-tighter mb-4 flex flex-col items-center justify-center w-full gap-2"');
    code = code.replace('className="flex flex-col items-start gap-1"', 'className="flex flex-col items-center gap-1"');
    code = code.replace('className="flex flex-col items-end gap-1"', 'className="flex flex-col items-center gap-1"');
    code = code.replace('<span className="text-slate-300 mx-8">&</span>', '<span className="text-slate-300 text-3xl my-2">&</span>');
    code = code.replace('className="flex items-start gap-4"', 'className="flex flex-col items-center gap-2"'); // Center align map and calendar
    code = code.replace('className="flex items-start gap-4"', 'className="flex flex-col items-center gap-2"'); 
    code = code.replace('className="w-full md:w-96 text-white p-10 flex flex-col justify-center"', 'className="w-full text-white p-8 rounded-xl flex flex-col justify-center"');
  }

  // Ensure outer wrapper wraps padding correctly
  code = code.replace('className={`min-h-screen flex flex-col items-center justify-center p-6 pb-28', 'className={`min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 pb-28');
  code = code.replace('className={`min-h-screen flex flex-col items-center justify-center p-0', 'className={`min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 pb-28');

  fs.writeFileSync(file, code);
  console.log(`Updated Template${i} Layout`);
}
