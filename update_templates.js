const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'components', 'templates');

for (let i = 1; i <= 5; i++) {
  const file = path.join(dir, `Template${i}.tsx`);
  if (!fs.existsSync(file)) continue;
  
  let code = fs.readFileSync(file, 'utf8');

  // Add to interface
  if (!code.includes('bride_parents: string | null;')) {
    code = code.replace(/groom_name: string;/, 'groom_name: string;\n    bride_parents: string | null;\n    groom_parents: string | null;');
  }

  // Update h1 block
  const h1Regex = /(<h1[^>]*>)([\s\S]*?)(<\/h1>)/;
  
  code = code.replace(h1Regex, (match, p1, p2, p3) => {
    // If already updated, skip
    if (p2.includes('bride_parents')) return match;
    
    // Check if it's Template5 which uses inline names
    if (i === 5) {
      return `${p1}
            <div className="flex flex-col items-start gap-1">
              {wedding.bride_parents && <span className="text-xl md:text-3xl tracking-widest opacity-60 font-light block mb-2">{wedding.bride_parents}</span>}
              <span>{wedding.bride_name}</span>
            </div>
            <span className="text-slate-300 mx-8">&</span>
            <div className="flex flex-col items-end gap-1">
              <span>{wedding.groom_name}</span>
              {wedding.groom_parents && <span className="text-xl md:text-3xl tracking-widest opacity-60 font-light block mt-2">{wedding.groom_parents}</span>}
            </div>
          ${p3}`.replace('className="text-6xl md:text-8xl font-black tracking-tighter mb-4"', 'className="text-6xl md:text-8xl font-black tracking-tighter mb-4 flex items-center justify-center w-full"');
    }
    
    return `${p1}
          <div className="flex flex-col items-center">
            {wedding.bride_parents && <span className="text-sm md:text-xl tracking-widest opacity-80 font-light mb-2">{wedding.bride_parents}</span>}
            <span>{wedding.bride_name}</span>
          </div>
          <span className="text-3xl my-2 mx-auto block text-center" style={{ color: primaryColor }}>&</span>
          <div className="flex flex-col items-center">
            <span>{wedding.groom_name}</span>
            {wedding.groom_parents && <span className="text-sm md:text-xl tracking-widest opacity-80 font-light mt-2">{wedding.groom_parents}</span>}
          </div>
        ${p3}`;
  });

  fs.writeFileSync(file, code);
  console.log(`Updated Template${i}.tsx`);
}
