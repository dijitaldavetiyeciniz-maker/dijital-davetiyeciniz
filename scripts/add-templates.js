import fs from 'fs';
import path from 'path';

const file = path.join(process.cwd(), 'src/lib/themes.ts');
let content = fs.readFileSync(file, 'utf8');

const newTemplates = `
  // --- GRUP 1B YENI SABLONLAR ---
  {
    id: "modern-architecture",
    name: "Modern Mimari Düğün",
    layoutStyle: "modern-architecture",
    layoutMode: "full-bleed",
    eventType: "wedding",
    category: "Modern",
    background_image_url: null,
    primary_color: "#1e293b",
    font_family: "Inter",
    recommendedOpeningType: "slide-up",
    recommendedOpeningStyle: "minimal",
    recommendedBackgroundDesign: "minimal-white-paper",
    recommendedBackgroundAnimation: "none",
    palette: {
      background: "#f8fafc",
      card: "#ffffff",
      primary: "#0f172a",
      secondary: "#64748b",
      accent: "#e2e8f0",
      text: "#0f172a",
      mutedText: "#64748b"
    }
  },
  {
    id: "botanical-ceramic",
    name: "Botanik Seramik",
    layoutStyle: "botanical-ceramic",
    layoutMode: "full-bleed",
    eventType: "wedding",
    category: "Doğal",
    background_image_url: null,
    primary_color: "#166534",
    font_family: "Cormorant Garamond",
    recommendedOpeningType: "fade-in",
    recommendedOpeningStyle: "classic",
    recommendedBackgroundDesign: "watercolor-wash",
    recommendedBackgroundAnimation: "none",
    palette: {
      background: "#f0fdf4",
      card: "#ffffff",
      primary: "#14532d",
      secondary: "#22c55e",
      accent: "#dcfce7",
      text: "#14532d",
      mutedText: "#15803d"
    }
  },
  {
    id: "luxury-hotel",
    name: "Lüks Otel Davetiyesi",
    layoutStyle: "luxury-hotel",
    layoutMode: "full-bleed",
    eventType: "wedding",
    category: "Lüks",
    background_image_url: null,
    primary_color: "#b45309",
    font_family: "Playfair Display",
    recommendedOpeningType: "fade-in",
    recommendedOpeningStyle: "luxury",
    recommendedBackgroundDesign: "marble-gold",
    recommendedBackgroundAnimation: "none",
    palette: {
      background: "#fffbeb",
      card: "#ffffff",
      primary: "#92400e",
      secondary: "#d97706",
      accent: "#fef3c7",
      text: "#451a03",
      mutedText: "#78350f"
    }
  },
  {
    id: "destination-boarding-pass",
    name: "Destination Wedding",
    layoutStyle: "destination-boarding-pass",
    layoutMode: "full-bleed",
    eventType: "wedding",
    category: "Modern",
    background_image_url: null,
    primary_color: "#0369a1",
    font_family: "Space Grotesk",
    recommendedOpeningType: "slide-left",
    recommendedOpeningStyle: "minimal",
    recommendedBackgroundDesign: "minimal-white-paper",
    recommendedBackgroundAnimation: "none",
    palette: {
      background: "#f0f9ff",
      card: "#ffffff",
      primary: "#075985",
      secondary: "#0284c7",
      accent: "#e0f2fe",
      text: "#082f49",
      mutedText: "#0369a1"
    }
  },

  // --- GRUP 1C YENI SABLONLAR ---
  {
    id: "fashion-magazine",
    name: "Moda Dergisi Editoryal",
    layoutStyle: "fashion-magazine",
    layoutMode: "full-bleed",
    eventType: "wedding",
    category: "Lüks",
    background_image_url: null,
    primary_color: "#000000",
    font_family: "Bodoni Moda",
    recommendedOpeningType: "fade-in",
    recommendedOpeningStyle: "minimal",
    recommendedBackgroundDesign: "minimal-white-paper",
    recommendedBackgroundAnimation: "none",
    palette: {
      background: "#ffffff",
      card: "#ffffff",
      primary: "#000000",
      secondary: "#333333",
      accent: "#f5f5f5",
      text: "#000000",
      mutedText: "#666666"
    }
  },
  {
    id: "art-deco-theater",
    name: "Art Deco Tiyatro Gecesi",
    layoutStyle: "art-deco-theater",
    layoutMode: "full-bleed",
    eventType: "wedding",
    category: "Karanlık",
    background_image_url: null,
    primary_color: "#eab308",
    font_family: "Josefin Sans",
    recommendedOpeningType: "fade-in",
    recommendedOpeningStyle: "luxury",
    recommendedBackgroundDesign: "starlight-dust",
    recommendedBackgroundAnimation: "gold-sparkles",
    palette: {
      background: "#020617",
      card: "#0f172a",
      primary: "#ca8a04",
      secondary: "#eab308",
      accent: "#1e293b",
      text: "#f8fafc",
      mutedText: "#94a3b8"
    }
  },
  {
    id: "mediterranean-garden",
    name: "Akdeniz Çini Bahçesi",
    layoutStyle: "mediterranean-garden",
    layoutMode: "full-bleed",
    eventType: "wedding",
    category: "Doğal",
    background_image_url: null,
    primary_color: "#2563eb",
    font_family: "Lora",
    recommendedOpeningType: "fade-in",
    recommendedOpeningStyle: "classic",
    recommendedBackgroundDesign: "watercolor-wash",
    recommendedBackgroundAnimation: "none",
    palette: {
      background: "#eff6ff",
      card: "#ffffff",
      primary: "#1d4ed8",
      secondary: "#3b82f6",
      accent: "#dbeafe",
      text: "#1e3a8a",
      mutedText: "#2563eb"
    }
  },
  {
    id: "minimal-typographic",
    name: "Minimal Tipografik Galeri",
    layoutStyle: "minimal-typographic",
    layoutMode: "full-bleed",
    eventType: "wedding",
    category: "Minimalist",
    background_image_url: null,
    primary_color: "#171717",
    font_family: "Space Grotesk",
    recommendedOpeningType: "slide-up",
    recommendedOpeningStyle: "minimal",
    recommendedBackgroundDesign: "minimal-white-paper",
    recommendedBackgroundAnimation: "none",
    palette: {
      background: "#ffffff",
      card: "#f5f5f5",
      primary: "#0a0a0a",
      secondary: "#404040",
      accent: "#e5e5e5",
      text: "#000000",
      mutedText: "#525252"
    }
  }
`;

content = content.replace(/\];\s*$/, newTemplates + '\n];\n');

fs.writeFileSync(file, content, 'utf8');
console.log('themes.ts updated with 8 new templates!');
