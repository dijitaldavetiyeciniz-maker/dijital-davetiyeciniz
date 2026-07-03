const fs = require('fs');
const path = require('path');

const colors = [
  '#e11d48', '#0284c7', '#7c3aed', '#d97706', '#16a34a', '#dc2626', '#ea580c', '#65a30d',
  '#0d9488', '#2563eb', '#4f46e5', '#9333ea', '#c026d3', '#db2777', '#475569', '#52525b',
  '#000000', '#1c1917', '#78350f', '#831843', '#064e3b', '#1e3a8a', '#312e81'
];
const fonts = ['sans', 'serif', 'mono'];
const categories = ['Modern', 'Klasik', 'Karanlık', 'Minimalist', 'Lüks', 'Doğal'];
const templates = ['template1', 'template2', 'template3', 'template4', 'template5'];
const adjectives = ['Gül', 'Okyanus', 'Lavanta', 'Zümrüt', 'Ateş', 'Zeytin', 'Kahve', 'Pırlanta', 'Safir', 'Vogue', 'Gece', 'Güneş', 'Ay', 'Yıldız', 'Bahar', 'Güz', 'Kış'];
const nouns = ['Rüyası', 'Esintisi', 'Gecesi', 'Dalı', 'Çekirdeği', 'Grisi', 'Siyahı', 'Işıltısı', 'Büyüsü', 'Sessizliği', 'Yankısı', 'Gölgesi', 'Masalı', 'Şiiri', 'Efsanesi'];

const themes = [];
let idCounter = 1;

for (let i = 0; i < 1000; i++) {
  const template = templates[i % templates.length];
  const color = colors[i % colors.length];
  const font = fonts[i % fonts.length];
  const category = categories[i % categories.length];
  const name = `${adjectives[i % adjectives.length]} ${nouns[i % nouns.length]} ${i + 1}`;
  
  themes.push(`  {
    id: 'theme-${idCounter++}',
    name: '${name}',
    category: '${category}',
    template_id: '${template}',
    primary_color: '${color}',
    font_family: '${font}',
    background_image_url: null
  }`);
}

const fileContent = `export interface ThemePreset {
  id: string;
  name: string;
  category: 'Modern' | 'Klasik' | 'Karanlık' | 'Minimalist' | 'Lüks' | 'Doğal';
  template_id: 'template1' | 'template2' | 'template3' | 'template4' | 'template5';
  primary_color: string;
  font_family: 'sans' | 'serif' | 'mono';
  background_image_url: string | null;
}

export const predefinedThemes: ThemePreset[] = [
${themes.join(',\n')}
];
`;

fs.writeFileSync(path.join(__dirname, 'src', 'lib', 'themes.ts'), fileContent);
console.log('Generated 1000 themes!');
