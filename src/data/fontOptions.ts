export interface FontOption {
  id: string;
  name: string;
  category: 'elegant-serif' | 'modern-serif' | 'sans-serif' | 'calligraphy' | 'handwriting' | 'luxury' | 'editorial' | 'minimal' | 'playful' | 'romantic';
  googleFontFamily: string;
  sampleText?: string;
  isPopular?: boolean;
  turkishSupport: boolean;
}

export interface FontCategory {
  id: string;
  label: string;
  description: string;
}

export const fontCategories: FontCategory[] = [
  { id: 'all', label: 'Tümü', description: 'Koleksiyondaki tüm seçkin yazı tipleri' },
  { id: 'elegant-serif', label: 'Zarif Klasik Serif', description: 'Geleneksel, asil ve romantik çizgiler' },
  { id: 'modern-serif', label: 'Modern Serif', description: 'Çağdaş dergi ve editoryal şıklık' },
  { id: 'sans-serif', label: 'Modern Sans (Düz)', description: 'Temiz, okunaklı ve minimalist' },
  { id: 'calligraphy', label: 'Kaligrafi & Hat', description: 'Akıcı, sanatsal ve el yazması davetiye hatları' },
  { id: 'handwriting', label: 'Samimi El Yazısı', description: 'Sıcak, doğal ve modern el yazıları' },
  { id: 'luxury', label: 'Lüks & Royal', description: 'Kraliyet sarayı ve yüksek prestij' },
  { id: 'editorial', label: 'Vogue & Editoryal', description: 'Yüksek moda ve başlık odaklı tipografi' },
  { id: 'minimal', label: 'Ultra Minimalist', description: 'Sade, net ve fütüristik' },
  { id: 'playful', label: 'Neşeli & Dinamik', description: 'Doğum günü, parti ve kutlama enerjisi' },
  { id: 'romantic', label: 'Romantik & Masalsı', description: 'Duygusal, masalsı ve büyüleyici dokunuşlar' }
];

export const fontOptionsList: FontOption[] = [
  // 1. Zarif Klasik Serif (10)
  { id: 'Cormorant Garamond', name: 'Cormorant Garamond', category: 'elegant-serif', googleFontFamily: 'Cormorant+Garamond:wght@400;600;700', isPopular: true, turkishSupport: true },
  { id: 'Playfair Display', name: 'Playfair Display', category: 'elegant-serif', googleFontFamily: 'Playfair+Display:ital,wght@0,400;0,700;1,400', isPopular: true, turkishSupport: true },
  { id: 'Prata', name: 'Prata', category: 'elegant-serif', googleFontFamily: 'Prata', isPopular: true, turkishSupport: true },
  { id: 'Marcellus', name: 'Marcellus', category: 'elegant-serif', googleFontFamily: 'Marcellus', turkishSupport: true },
  { id: 'Bodoni Moda', name: 'Bodoni Moda', category: 'elegant-serif', googleFontFamily: 'Bodoni+Moda:ital,wght@0,400;0,700;1,400', turkishSupport: true },
  { id: 'Cormorant', name: 'Cormorant', category: 'elegant-serif', googleFontFamily: 'Cormorant:wght@400;600;700', turkishSupport: true },
  { id: 'Castoro', name: 'Castoro', category: 'elegant-serif', googleFontFamily: 'Castoro:ital@0;1', turkishSupport: true },
  { id: 'Cinzel Decorative', name: 'Cinzel Decorative', category: 'elegant-serif', googleFontFamily: 'Cinzel+Decorative:wght@700', isPopular: true, turkishSupport: true },
  { id: 'Oranienbaum', name: 'Oranienbaum', category: 'elegant-serif', googleFontFamily: 'Oranienbaum', turkishSupport: true },
  { id: 'Gilda Display', name: 'Gilda Display', category: 'elegant-serif', googleFontFamily: 'Gilda+Display', turkishSupport: true },

  // 2. Modern Serif (10)
  { id: 'Lora', name: 'Lora', category: 'modern-serif', googleFontFamily: 'Lora:ital,wght@0,400;0,600;1,400', isPopular: true, turkishSupport: true },
  { id: 'Merriweather', name: 'Merriweather', category: 'modern-serif', googleFontFamily: 'Merriweather:wght@300;400;700', turkishSupport: true },
  { id: 'EB Garamond', name: 'EB Garamond', category: 'modern-serif', googleFontFamily: 'EB+Garamond:ital,wght@0,400;0,600;1,400', turkishSupport: true },
  { id: 'Spectral', name: 'Spectral', category: 'modern-serif', googleFontFamily: 'Spectral:wght@400;600', turkishSupport: true },
  { id: 'DM Serif Display', name: 'DM Serif Display', category: 'modern-serif', googleFontFamily: 'DM+Serif+Display:ital@0;1', isPopular: true, turkishSupport: true },
  { id: 'PT Serif', name: 'PT Serif', category: 'modern-serif', googleFontFamily: 'PT+Serif:wght@400;700', turkishSupport: true },
  { id: 'Libre Baskerville', name: 'Libre Baskerville', category: 'modern-serif', googleFontFamily: 'Libre+Baskerville:ital,wght@0,400;0,700;1,400', turkishSupport: true },
  { id: 'Vollkorn', name: 'Vollkorn', category: 'modern-serif', googleFontFamily: 'Vollkorn:ital,wght@0,400;0,600;1,400', turkishSupport: true },
  { id: 'Frank Ruhl Libre', name: 'Frank Ruhl Libre', category: 'modern-serif', googleFontFamily: 'Frank+Ruhl+Libre:wght@400;700', turkishSupport: true },
  { id: 'Faustina', name: 'Faustina', category: 'modern-serif', googleFontFamily: 'Faustina:ital,wght@0,400;0,600;1,400', turkishSupport: true },

  // 3. Sans-Serif (10)
  { id: 'Montserrat', name: 'Montserrat', category: 'sans-serif', googleFontFamily: 'Montserrat:wght@300;400;600;700', isPopular: true, turkishSupport: true },
  { id: 'Outfit', name: 'Outfit', category: 'sans-serif', googleFontFamily: 'Outfit:wght@300;400;600;700', isPopular: true, turkishSupport: true },
  { id: 'Inter', name: 'Inter', category: 'sans-serif', googleFontFamily: 'Inter:wght@300;400;600;700', isPopular: true, turkishSupport: true },
  { id: 'Plus Jakarta Sans', name: 'Plus Jakarta Sans', category: 'sans-serif', googleFontFamily: 'Plus+Jakarta+Sans:wght@400;600;700', turkishSupport: true },
  { id: 'Poppins', name: 'Poppins', category: 'sans-serif', googleFontFamily: 'Poppins:wght@300;400;600', isPopular: true, turkishSupport: true },
  { id: 'Raleway', name: 'Raleway', category: 'sans-serif', googleFontFamily: 'Raleway:wght@300;400;600', turkishSupport: true },
  { id: 'Nunito', name: 'Nunito', category: 'sans-serif', googleFontFamily: 'Nunito:wght@300;400;600;700', turkishSupport: true },
  { id: 'Rubik', name: 'Rubik', category: 'sans-serif', googleFontFamily: 'Rubik:wght@300;400;500;700', turkishSupport: true },
  { id: 'Work Sans', name: 'Work Sans', category: 'sans-serif', googleFontFamily: 'Work+Sans:wght@300;400;600', turkishSupport: true },
  { id: 'Be Vietnam Pro', name: 'Be Vietnam Pro', category: 'sans-serif', googleFontFamily: 'Be+Vietnam+Pro:wght@300;400;600', turkishSupport: true },

  // 4. Kaligrafi & Hat (10)
  { id: 'Great Vibes', name: 'Great Vibes', category: 'calligraphy', googleFontFamily: 'Great+Vibes', isPopular: true, turkishSupport: true },
  { id: 'Alex Brush', name: 'Alex Brush', category: 'calligraphy', googleFontFamily: 'Alex+Brush', isPopular: true, turkishSupport: true },
  { id: 'Pinyon Script', name: 'Pinyon Script', category: 'calligraphy', googleFontFamily: 'Pinyon+Script', isPopular: true, turkishSupport: true },
  { id: 'Allura', name: 'Allura', category: 'calligraphy', googleFontFamily: 'Allura', turkishSupport: true },
  { id: 'Italianno', name: 'Italianno', category: 'calligraphy', googleFontFamily: 'Italianno', turkishSupport: true },
  { id: 'Sacramento', name: 'Sacramento', category: 'calligraphy', googleFontFamily: 'Sacramento', turkishSupport: true },
  { id: 'Tangerine', name: 'Tangerine', category: 'calligraphy', googleFontFamily: 'Tangerine:wght@400;700', turkishSupport: true },
  { id: 'Rouge Script', name: 'Rouge Script', category: 'calligraphy', googleFontFamily: 'Rouge+Script', turkishSupport: true },
  { id: 'Marck Script', name: 'Marck Script', category: 'calligraphy', googleFontFamily: 'Marck+Script', turkishSupport: true },
  { id: 'Petit Formal Script', name: 'Petit Formal Script', category: 'calligraphy', googleFontFamily: 'Petit+Formal+Script', turkishSupport: true },

  // 5. Samimi El Yazısı (10)
  { id: 'Caveat', name: 'Caveat', category: 'handwriting', googleFontFamily: 'Caveat:wght@400;600;700', isPopular: true, turkishSupport: true },
  { id: 'Dancing Script', name: 'Dancing Script', category: 'handwriting', googleFontFamily: 'Dancing+Script:wght@400;700', isPopular: true, turkishSupport: true },
  { id: 'Parisienne', name: 'Parisienne', category: 'handwriting', googleFontFamily: 'Parisienne', isPopular: true, turkishSupport: true },
  { id: 'Courgette', name: 'Courgette', category: 'handwriting', googleFontFamily: 'Courgette', turkishSupport: true },
  { id: 'Kaushan Script', name: 'Kaushan Script', category: 'handwriting', googleFontFamily: 'Kaushan+Script', turkishSupport: true },
  { id: 'Kalam', name: 'Kalam', category: 'handwriting', googleFontFamily: 'Kalam:wght@300;400;700', turkishSupport: true },
  { id: 'Satisfy', name: 'Satisfy', category: 'handwriting', googleFontFamily: 'Satisfy', turkishSupport: true },
  { id: 'Yellowtail', name: 'Yellowtail', category: 'handwriting', googleFontFamily: 'Yellowtail', turkishSupport: true },
  { id: 'Bad Script', name: 'Bad Script', category: 'handwriting', googleFontFamily: 'Bad+Script', turkishSupport: true },
  { id: 'Patrick Hand', name: 'Patrick Hand', category: 'handwriting', googleFontFamily: 'Patrick+Hand', turkishSupport: true },

  // 6. Lüks & Royal (9)
  { id: 'Cinzel', name: 'Cinzel', category: 'luxury', googleFontFamily: 'Cinzel:wght@400;600;700', isPopular: true, turkishSupport: true },
  { id: 'Italiana', name: 'Italiana', category: 'luxury', googleFontFamily: 'Italiana', isPopular: true, turkishSupport: true },
  { id: 'Forum', name: 'Forum', category: 'luxury', googleFontFamily: 'Forum', turkishSupport: true },
  { id: 'Tenor Sans', name: 'Tenor Sans', category: 'luxury', googleFontFamily: 'Tenor+Sans', turkishSupport: true },
  { id: 'Unna', name: 'Unna', category: 'luxury', googleFontFamily: 'Unna:ital,wght@0,400;0,700;1,400', turkishSupport: true },
  { id: 'Vidaloka', name: 'Vidaloka', category: 'luxury', googleFontFamily: 'Vidaloka', turkishSupport: true },
  { id: 'Bellefair', name: 'Bellefair', category: 'luxury', googleFontFamily: 'Bellefair', turkishSupport: true },
  { id: 'Radley', name: 'Radley', category: 'luxury', googleFontFamily: 'Radley:ital@0;1', turkishSupport: true },
  { id: 'Julius Sans One', name: 'Julius Sans One', category: 'luxury', googleFontFamily: 'Julius+Sans+One', turkishSupport: true },

  // 7. Vogue & Editoryal (8)
  { id: 'Syne', name: 'Syne', category: 'editorial', googleFontFamily: 'Syne:wght@400;700;800', isPopular: true, turkishSupport: true },
  { id: 'Cormorant Infant', name: 'Cormorant Infant', category: 'editorial', googleFontFamily: 'Cormorant+Infant:ital,wght@0,400;0,600;1,400', turkishSupport: true },
  { id: 'Rozha One', name: 'Rozha One', category: 'editorial', googleFontFamily: 'Rozha+One', turkishSupport: true },
  { id: 'Yeseva One', name: 'Yeseva One', category: 'editorial', googleFontFamily: 'Yeseva+One', isPopular: true, turkishSupport: true },
  { id: 'Federo', name: 'Federo', category: 'editorial', googleFontFamily: 'Federo', turkishSupport: true },
  { id: 'DM Serif Text', name: 'DM Serif Text', category: 'editorial', googleFontFamily: 'DM+Serif+Text:ital@0;1', turkishSupport: true },
  { id: 'Belleza', name: 'Belleza', category: 'editorial', googleFontFamily: 'Belleza', turkishSupport: true },
  { id: 'Sorts Mill Goudy', name: 'Sorts Mill Goudy', category: 'editorial', googleFontFamily: 'Sorts+Mill+Goudy:ital@0;1', turkishSupport: true },

  // 8. Ultra Minimalist (10)
  { id: 'Manrope', name: 'Manrope', category: 'minimal', googleFontFamily: 'Manrope:wght@300;400;600', isPopular: true, turkishSupport: true },
  { id: 'Space Grotesk', name: 'Space Grotesk', category: 'minimal', googleFontFamily: 'Space+Grotesk:wght@400;600', turkishSupport: true },
  { id: 'DM Sans', name: 'DM Sans', category: 'minimal', googleFontFamily: 'DM+Sans:wght@400;500;700', isPopular: true, turkishSupport: true },
  { id: 'Jost', name: 'Jost', category: 'minimal', googleFontFamily: 'Jost:wght@300;400;600', turkishSupport: true },
  { id: 'Epilogue', name: 'Epilogue', category: 'minimal', googleFontFamily: 'Epilogue:wght@300;400;600', turkishSupport: true },
  { id: 'Cabin', name: 'Cabin', category: 'minimal', googleFontFamily: 'Cabin:wght@400;600', turkishSupport: true },
  { id: 'Urbanist', name: 'Urbanist', category: 'minimal', googleFontFamily: 'Urbanist:wght@300;400;600;700', turkishSupport: true },
  { id: 'Sora', name: 'Sora', category: 'minimal', googleFontFamily: 'Sora:wght@300;400;600', turkishSupport: true },
  { id: 'Albert Sans', name: 'Albert Sans', category: 'minimal', googleFontFamily: 'Albert+Sans:wght@300;400;600', turkishSupport: true },
  { id: 'Lexend', name: 'Lexend', category: 'minimal', googleFontFamily: 'Lexend:wght@300;400;600', turkishSupport: true },

  // 9. Neşeli & Dinamik (10)
  { id: 'Fredoka', name: 'Fredoka', category: 'playful', googleFontFamily: 'Fredoka:wght@400;600;700', isPopular: true, turkishSupport: true },
  { id: 'Pacifico', name: 'Pacifico', category: 'playful', googleFontFamily: 'Pacifico', isPopular: true, turkishSupport: true },
  { id: 'Quicksand', name: 'Quicksand', category: 'playful', googleFontFamily: 'Quicksand:wght@400;600;700', turkishSupport: true },
  { id: 'Comfortaa', name: 'Comfortaa', category: 'playful', googleFontFamily: 'Comfortaa:wght@400;700', turkishSupport: true },
  { id: 'Amatic SC', name: 'Amatic SC', category: 'playful', googleFontFamily: 'Amatic+SC:wght@700', turkishSupport: true },
  { id: 'Caveat Brush', name: 'Caveat Brush', category: 'playful', googleFontFamily: 'Caveat+Brush', turkishSupport: true },
  { id: 'Sniglet', name: 'Sniglet:wght@800', category: 'playful', googleFontFamily: 'Sniglet:wght@800', turkishSupport: true },
  { id: 'Concert One', name: 'Concert One', category: 'playful', googleFontFamily: 'Concert+One', turkishSupport: true },
  { id: 'Chewy', name: 'Chewy', category: 'playful', googleFontFamily: 'Chewy', turkishSupport: true },
  { id: 'Baloo 2', name: 'Baloo 2', category: 'playful', googleFontFamily: 'Baloo+2:wght@400;600;700', turkishSupport: true },

  // 10. Romantik & Masalsı (8)
  { id: 'Rochester', name: 'Rochester', category: 'romantic', googleFontFamily: 'Rochester', isPopular: true, turkishSupport: true },
  { id: 'WindSong', name: 'WindSong:wght@500', category: 'romantic', googleFontFamily: 'WindSong:wght@500', turkishSupport: true },
  { id: 'Elsie', name: 'Elsie', category: 'romantic', googleFontFamily: 'Elsie:wght@400;900', turkishSupport: true },
  { id: 'Berkshire Swash', name: 'Berkshire Swash', category: 'romantic', googleFontFamily: 'Berkshire+Swash', turkishSupport: true },
  { id: 'Fondamento', name: 'Fondamento', category: 'romantic', googleFontFamily: 'Fondamento:ital@0;1', turkishSupport: true },
  { id: 'MonteCarlo', name: 'MonteCarlo', category: 'romantic', googleFontFamily: 'MonteCarlo', turkishSupport: true },
  { id: 'Lovers Quarrel', name: 'Lovers Quarrel', category: 'romantic', googleFontFamily: 'Lovers+Quarrel', turkishSupport: true },
  { id: 'Meow Script', name: 'Meow Script', category: 'romantic', googleFontFamily: 'Meow+Script', turkishSupport: true }
];

export function getFontFamilyUrl(fontName: string): string {
  const font = fontOptionsList.find(f => f.id.toLowerCase() === fontName.toLowerCase() || f.name.toLowerCase() === fontName.toLowerCase());
  const query = font ? font.googleFontFamily : `${fontName.replace(/ /g, '+')}:wght@400;600;700`;
  return `https://fonts.googleapis.com/css2?family=${query}&display=swap`;
}
