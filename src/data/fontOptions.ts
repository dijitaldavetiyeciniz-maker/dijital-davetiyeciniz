export interface FontOption {
  id: string;
  name: string;
  category: 'elegant-serif' | 'modern-serif' | 'sans-serif' | 'handwriting' | 'calligraphy' | 'editorial' | 'luxury' | 'minimal' | 'playful';
  googleFontFamily: string;
  sampleText?: string;
  isPopular?: boolean;
}

export interface FontCategory {
  id: string;
  label: string;
  description: string;
}

export const fontCategories: FontCategory[] = [
  { id: 'all', label: 'Tüm Fontlar', description: 'Koleksiyondaki tüm seçkin yazı tipleri' },
  { id: 'elegant-serif', label: 'Zarif Klasik Serif', description: 'Geleneksel, asil ve romantik çizgiler' },
  { id: 'modern-serif', label: 'Modern Serif', description: 'Çağdaş dergi ve editoryal şıklık' },
  { id: 'sans-serif', label: 'Modern & Düz (Sans)', description: 'Temiz, okunaklı ve minimalist' },
  { id: 'calligraphy', label: 'Kaligrafi & Hat', description: 'Akıcı, sanatsal ve el yazması davetiye hatları' },
  { id: 'handwriting', label: 'Samimi El Yazısı', description: 'Sıcak, doğal ve modern el yazıları' },
  { id: 'luxury', label: 'Lüks & Royal', description: 'Kraliyet sarayı ve yüksek prestij' },
  { id: 'editorial', label: 'Vogue & Editoryal', description: 'Yüksek moda ve başlık odaklı tipografi' },
  { id: 'minimal', label: 'Ultra Minimalist', description: 'Sade, net ve fütüristik' },
  { id: 'playful', label: 'Neşeli & Dinamik', description: 'Doğum günü, parti ve kutlama enerjisi' }
];

export const fontOptionsList: FontOption[] = [
  // 1. Elegant Serif
  { id: 'Cormorant Garamond', name: 'Cormorant Garamond', category: 'elegant-serif', googleFontFamily: 'Cormorant+Garamond:wght@400;600;700', isPopular: true },
  { id: 'Playfair Display', name: 'Playfair Display', category: 'elegant-serif', googleFontFamily: 'Playfair+Display:ital,wght@0,400;0,700;1,400', isPopular: true },
  { id: 'Prata', name: 'Prata', category: 'elegant-serif', googleFontFamily: 'Prata' },
  { id: 'Marcellus', name: 'Marcellus', category: 'elegant-serif', googleFontFamily: 'Marcellus' },
  { id: 'Bodoni Moda', name: 'Bodoni Moda', category: 'elegant-serif', googleFontFamily: 'Bodoni+Moda:ital,wght@0,400;0,700;1,400' },

  // 2. Modern Serif
  { id: 'Lora', name: 'Lora', category: 'modern-serif', googleFontFamily: 'Lora:ital,wght@0,400;0,600;1,400', isPopular: true },
  { id: 'Merriweather', name: 'Merriweather', category: 'modern-serif', googleFontFamily: 'Merriweather:wght@300;400;700' },
  { id: 'EB Garamond', name: 'EB Garamond', category: 'modern-serif', googleFontFamily: 'EB+Garamond:ital,wght@0,400;0,600;1,400' },
  { id: 'Spectral', name: 'Spectral', category: 'modern-serif', googleFontFamily: 'Spectral:wght@400;600' },
  { id: 'DM Serif Display', name: 'DM Serif Display', category: 'modern-serif', googleFontFamily: 'DM+Serif+Display:ital@0;1' },

  // 3. Sans-Serif
  { id: 'Montserrat', name: 'Montserrat', category: 'sans-serif', googleFontFamily: 'Montserrat:wght@300;400;600;700', isPopular: true },
  { id: 'Outfit', name: 'Outfit', category: 'sans-serif', googleFontFamily: 'Outfit:wght@300;400;600;700', isPopular: true },
  { id: 'Inter', name: 'Inter', category: 'sans-serif', googleFontFamily: 'Inter:wght@300;400;600;700', isPopular: true },
  { id: 'Plus Jakarta Sans', name: 'Plus Jakarta Sans', category: 'sans-serif', googleFontFamily: 'Plus+Jakarta+Sans:wght@400;600;700' },
  { id: 'Poppins', name: 'Poppins', category: 'sans-serif', googleFontFamily: 'Poppins:wght@300;400;600' },
  { id: 'Raleway', name: 'Raleway', category: 'sans-serif', googleFontFamily: 'Raleway:wght@300;400;600' },

  // 4. Calligraphy
  { id: 'Great Vibes', name: 'Great Vibes', category: 'calligraphy', googleFontFamily: 'Great+Vibes', isPopular: true },
  { id: 'Alex Brush', name: 'Alex Brush', category: 'calligraphy', googleFontFamily: 'Alex+Brush', isPopular: true },
  { id: 'Pinyon Script', name: 'Pinyon Script', category: 'calligraphy', googleFontFamily: 'Pinyon+Script' },
  { id: 'Allura', name: 'Allura', category: 'calligraphy', googleFontFamily: 'Allura' },
  { id: 'Italianno', name: 'Italianno', category: 'calligraphy', googleFontFamily: 'Italianno' },
  { id: 'Sacramento', name: 'Sacramento', category: 'calligraphy', googleFontFamily: 'Sacramento' },

  // 5. Handwriting
  { id: 'Caveat', name: 'Caveat', category: 'handwriting', googleFontFamily: 'Caveat:wght@400;600;700', isPopular: true },
  { id: 'Dancing Script', name: 'Dancing Script', category: 'handwriting', googleFontFamily: 'Dancing+Script:wght@400;700', isPopular: true },
  { id: 'Parisienne', name: 'Parisienne', category: 'handwriting', googleFontFamily: 'Parisienne' },
  { id: 'Courgette', name: 'Courgette', category: 'handwriting', googleFontFamily: 'Courgette' },
  { id: 'Kaushan Script', name: 'Kaushan Script', category: 'handwriting', googleFontFamily: 'Kaushan+Script' },

  // 6. Luxury & Royal
  { id: 'Cinzel', name: 'Cinzel', category: 'luxury', googleFontFamily: 'Cinzel:wght@400;600;700', isPopular: true },
  { id: 'Cinzel Decorative', name: 'Cinzel Decorative', category: 'luxury', googleFontFamily: 'Cinzel+Decorative:wght@700', isPopular: true },
  { id: 'Italiana', name: 'Italiana', category: 'luxury', googleFontFamily: 'Italiana' },
  { id: 'Forum', name: 'Forum', category: 'luxury', googleFontFamily: 'Forum' },
  { id: 'Tenor Sans', name: 'Tenor Sans', category: 'luxury', googleFontFamily: 'Tenor+Sans' },

  // 7. Editorial & High Fashion
  { id: 'Syne', name: 'Syne', category: 'editorial', googleFontFamily: 'Syne:wght@400;700;800' },
  { id: 'Cinzel', name: 'Cinzel Editorial', category: 'editorial', googleFontFamily: 'Cinzel:wght@600;800' },
  { id: 'Bodoni Moda', name: 'Bodoni Haute', category: 'editorial', googleFontFamily: 'Bodoni+Moda:ital,wght@1,600;1,800' },

  // 8. Minimalist
  { id: 'Manrope', name: 'Manrope', category: 'minimal', googleFontFamily: 'Manrope:wght@300;400;600' },
  { id: 'Space Grotesk', name: 'Space Grotesk', category: 'minimal', googleFontFamily: 'Space+Grotesk:wght@400;600' },
  { id: 'DM Sans', name: 'DM Sans', category: 'minimal', googleFontFamily: 'DM+Sans:wght@400;500;700' },

  // 9. Playful & Dynamic
  { id: 'Fredoka', name: 'Fredoka', category: 'playful', googleFontFamily: 'Fredoka:wght@400;600;700', isPopular: true },
  { id: 'Pacifico', name: 'Pacifico', category: 'playful', googleFontFamily: 'Pacifico' },
  { id: 'Quicksand', name: 'Quicksand', category: 'playful', googleFontFamily: 'Quicksand:wght@400;600;700' },
  { id: 'Comfortaa', name: 'Comfortaa', category: 'playful', googleFontFamily: 'Comfortaa:wght@400;700' },
  { id: 'Amatic SC', name: 'Amatic SC', category: 'playful', googleFontFamily: 'Amatic+SC:wght@700' }
];

export function getFontFamilyUrl(fontName: string): string {
  const font = fontOptionsList.find(f => f.id.toLowerCase() === fontName.toLowerCase() || f.name.toLowerCase() === fontName.toLowerCase());
  const query = font ? font.googleFontFamily : `${fontName.replace(/ /g, '+')}:wght@400;600;700`;
  return `https://fonts.googleapis.com/css2?family=${query}&display=swap`;
}
