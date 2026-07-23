const fs = require('fs');
const path = 'c:/Users/a.tagman/Desktop/Siteler/Platform/saas/src/app/d/[wedding_id]/admin/page.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/\r\n/g, '\n');

// Chunk 1
let target1 = `  const [cardBgColor, setCardBgColor] = useState('#ffffff'); // Kart Zemin Rengi\n  const [cardOpacity, setCardOpacity] = useState(90); // Kart Şeffaflığı (0-100)`;
let rep1 = `  const [cardBgColor, setCardBgColor] = useState('#ffffff'); // Kart Zemin Rengi\n  const [cardOpacity, setCardOpacity] = useState(90); // Kart Şeffaflığı (0-100)\n  const [sceneBackgroundColor, setSceneBackgroundColor] = useState('#f8f7f4');\n  const [cardBlur, setCardBlur] = useState(0);`;
content = content.replace(target1, rep1);

// Chunk 2
let target2 = `        design: {\n          ...customOverrides?.design,\n          cardBgColor,\n          cardOpacity\n        },`;
let rep2 = `        design: {\n          ...customOverrides?.design,\n          cardBgColor,\n          cardOpacity,\n          sceneBackgroundColor,\n          cardBlur,\n        },`;
content = content.replace(target2, rep2);

// Chunk 4
let target4 = `  async function handleSaveDesign() {\n    const payload: any = {`;
let rep4 = `  async function handleSaveDesign() {\n    // Zorunlu alan validasyonu\n    const validationErrors: string[] = [];\n    if (!brideName?.trim() && !groomName?.trim()) validationErrors.push('İsim veya isimler (Gelin/Damat)');\n    if (!weddingDate) validationErrors.push('Etkinlik tarihi');\n    if (!venueName?.trim()) validationErrors.push('Mekan adı');\n    if (!templateId) validationErrors.push('Şablon seçimi');\n    if (!eventType) validationErrors.push('Etkinlik türü');\n\n    if (validationErrors.length > 0) {\n      const msg = 'Lütfen aşağıdaki zorunlu alanları doldurun:\\n\\n• ' + validationErrors.join('\\n• ');\n      alert(msg);\n      return;\n    }\n\n    const payload: any = {`;
content = content.replace(target4, rep4);

content = content.replace(/\n/g, '\r\n');
fs.writeFileSync(path, content, 'utf8');
console.log('remaining chunks applied.');
