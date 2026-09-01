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
  { id: 'Merriweather', name: 'Merriweather', category: 'modern-serif', googleFontFamily: 'Merriweather:wght@300;400;700', isPopular: true, turkishSupport: true },
  { id: 'EB Garamond', name: 'EB Garamond', category: 'modern-serif', googleFontFamily: 'EB+Garamond:ital,wght@0,400;0,600;1,400', turkishSupport: true },
  { id: 'Spectral', name: 'Spectral', category: 'modern-serif', googleFontFamily: 'Spectral:wght@400;600', turkishSupport: true },
  { id: 'DM Serif Display', name: 'DM Serif Display', category: 'modern-serif', googleFontFamily: 'DM+Serif+Display:ital@0;1', turkishSupport: true },
  { id: 'Cinzel', name: 'Cinzel', category: 'modern-serif', googleFontFamily: 'Cinzel:wght@400;600;700', isPopular: true, turkishSupport: true },
  { id: 'Newsreader', name: 'Newsreader', category: 'modern-serif', googleFontFamily: 'Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,700;1,6..72,400', turkishSupport: true },
  { id: 'Fraunces', name: 'Fraunces', category: 'modern-serif', googleFontFamily: 'Fraunces:opsz,wght@9..144,400;9..144,700', turkishSupport: true },
  { id: 'Vollkorn', name: 'Vollkorn', category: 'modern-serif', googleFontFamily: 'Vollkorn:ital,wght@0,400;0,700;1,400', turkishSupport: true },
  { id: 'Frank Ruhl Libre', name: 'Frank Ruhl Libre', category: 'modern-serif', googleFontFamily: 'Frank+Ruhl+Libre:wght@400;700', turkishSupport: true },

  // 3. Modern Sans-Serif (10)
  { id: 'Montserrat', name: 'Montserrat', category: 'sans-serif', googleFontFamily: 'Montserrat:wght@300;400;600;700', isPopular: true, turkishSupport: true },
  { id: 'Outfit', name: 'Outfit', category: 'sans-serif', googleFontFamily: 'Outfit:wght@300;400;600;700', isPopular: true, turkishSupport: true },
  { id: 'Inter', name: 'Inter', category: 'sans-serif', googleFontFamily: 'Inter:wght@300;400;600;700', isPopular: true, turkishSupport: true },
  { id: 'Plus Jakarta Sans', name: 'Plus Jakarta Sans', category: 'sans-serif', googleFontFamily: 'Plus+Jakarta+Sans:wght@400;600;700', isPopular: true, turkishSupport: true },
  { id: 'Poppins', name: 'Poppins', category: 'sans-serif', googleFontFamily: 'Poppins:wght@300;400;600', isPopular: true, turkishSupport: true },
  { id: 'Raleway', name: 'Raleway', category: 'sans-serif', googleFontFamily: 'Raleway:wght@300;400;600', turkishSupport: true },
  { id: 'Nunito', name: 'Nunito', category: 'sans-serif', googleFontFamily: 'Nunito:wght@400;600;700', turkishSupport: true },
  { id: 'Urbanist', name: 'Urbanist', category: 'sans-serif', googleFontFamily: 'Urbanist:wght@400;600;700', turkishSupport: true },
  { id: 'Quicksand', name: 'Quicksand', category: 'sans-serif', googleFontFamily: 'Quicksand:wght@400;600;700', turkishSupport: true },
  { id: 'Jost', name: 'Jost', category: 'sans-serif', googleFontFamily: 'Jost:wght@400;600;700', turkishSupport: true },

  // 4. Kaligrafi & Hat (8)
  { id: 'Great Vibes', name: 'Great Vibes', category: 'calligraphy', googleFontFamily: 'Great+Vibes', isPopular: true, turkishSupport: true },
  { id: 'Alex Brush', name: 'Alex Brush', category: 'calligraphy', googleFontFamily: 'Alex+Brush', isPopular: true, turkishSupport: true },
  { id: 'Pinyon Script', name: 'Pinyon Script', category: 'calligraphy', googleFontFamily: 'Pinyon+Script', turkishSupport: true },
  { id: 'Allura', name: 'Allura', category: 'calligraphy', googleFontFamily: 'Allura', turkishSupport: true },
  { id: 'Italianno', name: 'Italianno', category: 'calligraphy', googleFontFamily: 'Italianno', turkishSupport: true },
  { id: 'Sacramento', name: 'Sacramento', category: 'calligraphy', googleFontFamily: 'Sacramento', turkishSupport: true },
  { id: 'Tangerine', name: 'Tangerine:wght@700', category: 'calligraphy', googleFontFamily: 'Tangerine:wght@700', isPopular: true, turkishSupport: true },
  { id: 'Monsieur La Doulaise', name: 'Monsieur La Doulaise', category: 'calligraphy', googleFontFamily: 'Monsieur+La+Doulaise', turkishSupport: true },

  // 5. Samimi El Yazısı (8)
  { id: 'Caveat', name: 'Caveat', category: 'handwriting', googleFontFamily: 'Caveat:wght@400;600;700', isPopular: true, turkishSupport: true },
  { id: 'Dancing Script', name: 'Dancing Script', category: 'handwriting', googleFontFamily: 'Dancing+Script:wght@400;700', isPopular: true, turkishSupport: true },
  { id: 'Parisienne', name: 'Parisienne', category: 'handwriting', googleFontFamily: 'Parisienne', turkishSupport: true },
  { id: 'Courgette', name: 'Courgette', category: 'handwriting', googleFontFamily: 'Courgette', turkishSupport: true },
  { id: 'Kaushan Script', name: 'Kaushan Script', category: 'handwriting', googleFontFamily: 'Kaushan+Script', turkishSupport: true },
  { id: 'Satisfy', name: 'Satisfy', category: 'handwriting', googleFontFamily: 'Satisfy', isPopular: true, turkishSupport: true },
  { id: 'Marck Script', name: 'Marck Script', category: 'handwriting', googleFontFamily: 'Marck+Script', turkishSupport: true },
  { id: 'Kalam', name: 'Kalam', category: 'handwriting', googleFontFamily: 'Kalam:wght@400;700', turkishSupport: true },

  // 6. Lüks & Royal (6)
  { id: 'Italiana', name: 'Italiana', category: 'luxury', googleFontFamily: 'Italiana', isPopular: true, turkishSupport: true },
  { id: 'Forum', name: 'Forum', category: 'luxury', googleFontFamily: 'Forum', isPopular: true, turkishSupport: true },
  { id: 'Tenor Sans', name: 'Tenor Sans', category: 'luxury', googleFontFamily: 'Tenor+Sans', turkishSupport: true },
  { id: 'Cormorant Upright', name: 'Cormorant Upright:wght@600;700', category: 'luxury', googleFontFamily: 'Cormorant+Upright:wght@600;700', turkishSupport: true },
  { id: 'Bellefair', name: 'Bellefair', category: 'luxury', googleFontFamily: 'Bellefair', turkishSupport: true },
  { id: 'Castoro Titling', name: 'Castoro Titling', category: 'luxury', googleFontFamily: 'Castoro+Titling', turkishSupport: true },

  // 7. Vogue & Editoryal (6)
  { id: 'Syne', name: 'Syne', category: 'editorial', googleFontFamily: 'Syne:wght@400;700;800', isPopular: true, turkishSupport: true },
  { id: 'Cinzel Decorative Bold', name: 'Cinzel Decorative:wght@900', category: 'editorial', googleFontFamily: 'Cinzel+Decorative:wght@900', turkishSupport: true },
  { id: 'Bodoni Moda Italic', name: 'Bodoni Moda:ital,wght@1,700', category: 'editorial', googleFontFamily: 'Bodoni+Moda:ital,wght@1,700', isPopular: true, turkishSupport: true },
  { id: 'Playfair Display SC', name: 'Playfair Display SC:wght@700', category: 'editorial', googleFontFamily: 'Playfair+Display+SC:wght@700', turkishSupport: true },
  { id: 'Cormorant SC', name: 'Cormorant SC:wght@600;700', category: 'editorial', googleFontFamily: 'Cormorant+SC:wght@600;700', turkishSupport: true },
  { id: 'Yeseva One', name: 'Yeseva One', category: 'editorial', googleFontFamily: 'Yeseva+One', turkishSupport: true },

  // 8. Ultra Minimalist (6)
  { id: 'Manrope', name: 'Manrope', category: 'minimal', googleFontFamily: 'Manrope:wght@300;400;600', isPopular: true, turkishSupport: true },
  { id: 'Space Grotesk', name: 'Space Grotesk', category: 'minimal', googleFontFamily: 'Space+Grotesk:wght@400;600', isPopular: true, turkishSupport: true },
  { id: 'DM Sans', name: 'DM Sans', category: 'minimal', googleFontFamily: 'DM+Sans:wght@400;500;700', turkishSupport: true },
  { id: 'Epilogue', name: 'Epilogue', category: 'minimal', googleFontFamily: 'Epilogue:wght@400;600;700', turkishSupport: true },
  { id: 'Sora', name: 'Sora', category: 'minimal', googleFontFamily: 'Sora:wght@400;600;700', turkishSupport: true },
  { id: 'Lexend', name: 'Lexend', category: 'minimal', googleFontFamily: 'Lexend:wght@400;600', turkishSupport: true },

  // 9. Neşeli & Dinamik (6)
  { id: 'Fredoka', name: 'Fredoka', category: 'playful', googleFontFamily: 'Fredoka:wght@400;600;700', isPopular: true, turkishSupport: true },
  { id: 'Pacifico', name: 'Pacifico', category: 'playful', googleFontFamily: 'Pacifico', isPopular: true, turkishSupport: true },
  { id: 'Comfortaa', name: 'Comfortaa', category: 'playful', googleFontFamily: 'Comfortaa:wght@400;700', turkishSupport: true },
  { id: 'Amatic SC', name: 'Amatic SC:wght@700', category: 'playful', googleFontFamily: 'Amatic+SC:wght@700', turkishSupport: true },
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
