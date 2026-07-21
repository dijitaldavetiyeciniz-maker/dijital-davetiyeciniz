export interface BackgroundDesign {
  image: string;
  fallbackColor: string;
  overlay: string;
  size: string;
  position: string;
  repeat: string;
}

export interface ThematicAsset {
  src: string;
  type: 'image' | 'particle' | 'illustration';
  defaultPosition: string;
  width?: number;
  height?: number;
}

export interface AnimationPreset {
  id: string;
  name: string;
  particleCount: number;
  mobileParticleCount: number;
  speed: number;
  opacity: number;
  sizeRange: [number, number];
  reducedMotionFallback: boolean;
}

export interface SealPreset {
  id: string;
  name: string;
  svgPath?: string;
  defaultColor: string;
  styleClass: string;
}

export interface TypographyPreset {
  id: string;
  name: string;
  headingFont: string;
  bodyFont: string;
  accentFont: string;
  lineHeight: number;
  letterSpacing?: string;
}

// 1. ARKA PLAN DOKULARI REGISTRY
export const backgroundDesignRegistry: Record<string, BackgroundDesign> = {
  'white-gold-marble': {
    image: 'https://www.transparenttextures.com/patterns/white-marble.png',
    fallbackColor: '#fcfbf7',
    overlay: 'rgba(255, 255, 255, 0.92)',
    size: 'auto',
    position: 'center',
    repeat: 'repeat'
  },
  'black-gold-velvet': {
    image: 'https://www.transparenttextures.com/patterns/black-thread.png', // Fallback texture
    fallbackColor: '#0a0a0a',
    overlay: 'rgba(0, 0, 0, 0.85)',
    size: 'auto',
    position: 'center',
    repeat: 'repeat'
  },
  'rose-gold-silk': {
    image: 'https://www.transparenttextures.com/patterns/linen.png',
    fallbackColor: '#fff1ec',
    overlay: 'rgba(255, 241, 236, 0.93)',
    size: 'auto',
    position: 'center',
    repeat: 'repeat'
  },
  'minimal-white-paper': {
    image: 'https://www.transparenttextures.com/patterns/paper-fibers.png',
    fallbackColor: '#fafafa',
    overlay: 'rgba(255, 255, 255, 0.97)',
    size: 'auto',
    position: 'center',
    repeat: 'repeat'
  },
  'bohemian-kraft': {
    image: 'https://www.transparenttextures.com/patterns/cardboard-flat.png',
    fallbackColor: '#ecd5b8',
    overlay: 'rgba(236, 213, 184, 0.9)',
    size: 'auto',
    position: 'center',
    repeat: 'repeat'
  },
  'navy-gold-night': {
    image: 'https://www.transparenttextures.com/patterns/dark-matter.png',
    fallbackColor: '#070a12',
    overlay: 'rgba(7, 10, 18, 0.88)',
    size: 'auto',
    position: 'center',
    repeat: 'repeat'
  },
  'pastel-floral': {
    image: 'https://www.transparenttextures.com/patterns/gray-floral-double.png',
    fallbackColor: '#faf0f0',
    overlay: 'rgba(250, 240, 240, 0.94)',
    size: 'auto',
    position: 'center',
    repeat: 'repeat'
  },
  'glass-blur-modern': {
    image: 'https://www.transparenttextures.com/patterns/canvas-paper.png',
    fallbackColor: '#edf2f7',
    overlay: 'rgba(255, 255, 255, 0.72)',
    size: 'auto',
    position: 'center',
    repeat: 'repeat'
  },
  'champagne-gold': {
    image: 'https://www.transparenttextures.com/patterns/gray-floral-double.png',
    fallbackColor: '#fbf9f4',
    overlay: 'rgba(251, 249, 244, 0.92)',
    size: 'auto',
    position: 'center',
    repeat: 'repeat'
  },
  'emerald-marble': {
    image: 'https://www.transparenttextures.com/patterns/white-marble.png',
    fallbackColor: '#042f24',
    overlay: 'rgba(6, 78, 59, 0.9)',
    size: 'auto',
    position: 'center',
    repeat: 'repeat'
  },
  'solid-burgundy': {
    image: 'https://www.transparenttextures.com/patterns/linen.png',
    fallbackColor: '#7f1d1d',
    overlay: 'rgba(127, 29, 29, 0.95)',
    size: 'auto',
    position: 'center',
    repeat: 'repeat'
  }
};

// 2. TEMATİK GÖRSEL ASSET REGISTRY
export const thematicAssetRegistry: Record<string, ThematicAsset> = {
  'mini-crown': {
    src: '/assets/themes/baby-girl/mini-crown.webp',
    type: 'image',
    defaultPosition: 'top-right',
    width: 48,
    height: 48
  },
  'pink-butterfly': {
    src: '/assets/themes/baby-girl/butterfly.webp',
    type: 'particle',
    defaultPosition: 'floating'
  },
  'soft-cloud': {
    src: '/assets/themes/baby-girl/cloud.webp',
    type: 'illustration',
    defaultPosition: 'top-left'
  },
  'nazar-boncugu': {
    src: '/assets/themes/circumcision/nazar-boncugu.webp',
    type: 'image',
    defaultPosition: 'top-center',
    width: 60,
    height: 60
  },
  'mashallah-emblem': {
    src: '/assets/themes/circumcision/mashallah.webp',
    type: 'illustration',
    defaultPosition: 'middle-center'
  },
  'toy-car': {
    src: '/assets/themes/baby-boy/toy-car.webp',
    type: 'image',
    defaultPosition: 'bottom-left'
  },
  'henna-tray': {
    src: '/assets/themes/henna/henna-tray.webp',
    type: 'illustration',
    defaultPosition: 'bottom-center'
  },
  'red-rose-petal': {
    src: '/assets/themes/henna/red-rose-petal.webp',
    type: 'particle',
    defaultPosition: 'falling'
  },
  'eucalyptus-leaf': {
    src: '/assets/themes/wedding/eucalyptus.webp',
    type: 'particle',
    defaultPosition: 'swaying'
  }
};

// 3. ANİMASYON PRESET REGISTRY
export const animationPresetRegistry: Record<string, AnimationPreset> = {
  'rosePetals': {
    id: 'rosePetals',
    name: '🌹 Gül Yaprakları',
    particleCount: 30,
    mobileParticleCount: 12,
    speed: 1.5,
    opacity: 0.8,
    sizeRange: [12, 24],
    reducedMotionFallback: true
  },
  'goldParticles': {
    id: 'goldParticles',
    name: '✨ Altın Tozları',
    particleCount: 40,
    mobileParticleCount: 15,
    speed: 2.0,
    opacity: 0.9,
    sizeRange: [4, 8],
    reducedMotionFallback: false
  },
  'pearlLight': {
    id: 'pearlLight',
    name: '⚪ İnci Işıltısı',
    particleCount: 20,
    mobileParticleCount: 8,
    speed: 1.0,
    opacity: 0.6,
    sizeRange: [8, 16],
    reducedMotionFallback: false
  },
  'leafFall': {
    id: 'leafFall',
    name: '🌿 Yaprak Dökümü',
    particleCount: 25,
    mobileParticleCount: 10,
    speed: 1.2,
    opacity: 0.75,
    sizeRange: [14, 28],
    reducedMotionFallback: true
  },
  'stars': {
    id: 'stars',
    name: '🌌 Yıldızlar',
    particleCount: 50,
    mobileParticleCount: 20,
    speed: 0.5,
    opacity: 0.9,
    sizeRange: [2, 5],
    reducedMotionFallback: false
  },
  'snowFall': {
    id: 'snowFall',
    name: '❄️ Kar Taneleri',
    particleCount: 35,
    mobileParticleCount: 15,
    speed: 1.8,
    opacity: 0.85,
    sizeRange: [6, 14],
    reducedMotionFallback: true
  },
  'none': {
    id: 'none',
    name: 'Yok',
    particleCount: 0,
    mobileParticleCount: 0,
    speed: 0,
    opacity: 0,
    sizeRange: [0, 0],
    reducedMotionFallback: false
  }
};

// 4. WAX MÜHÜR PRESET REGISTRY
export const sealPresetRegistry: Record<string, SealPreset> = {
  'gold-monogram': {
    id: 'gold-monogram',
    name: 'Altın Baş Harfli Mühür',
    defaultColor: '#dfb76c',
    styleClass: 'seal-gold-monogram'
  },
  'rose-gold': {
    id: 'rose-gold',
    name: 'Rose Gold Mühür',
    defaultColor: '#c98778',
    styleClass: 'seal-rose-gold'
  },
  'burgundy-seal': {
    id: 'burgundy-seal',
    name: 'Bordo Klasik Mühür',
    defaultColor: '#7f1d1d',
    styleClass: 'seal-burgundy'
  },
  'olive-wax': {
    id: 'olive-wax',
    name: 'Zeytin Dalı Mühür',
    defaultColor: '#808000',
    styleClass: 'seal-olive'
  },
  'royal-crest': {
    id: 'royal-crest',
    name: 'Kraliyet Taçlı Mühür',
    defaultColor: '#dfa857',
    styleClass: 'seal-royal'
  },
  'silver-seal': {
    id: 'silver-seal',
    name: 'Gümüş Minimal Mühür',
    defaultColor: '#cbd5e1',
    styleClass: 'seal-silver'
  }
};

// 5. TİPOGRAFİ PRESET REGISTRY
export const typographyPresetRegistry: Record<string, TypographyPreset> = {
  'luxury-serif': {
    id: 'luxury-serif',
    name: 'Lüks Serif (Cinzel / Cormorant)',
    headingFont: 'Cinzel',
    bodyFont: 'Cormorant Garamond',
    accentFont: 'Great Vibes',
    lineHeight: 1.5
  },
  'romantic-script': {
    id: 'romantic-script',
    name: 'Romantik Script (Playfair / Lora)',
    headingFont: 'Playfair Display',
    bodyFont: 'Lora',
    accentFont: 'Parisienne',
    lineHeight: 1.4
  },
  'modern-sans': {
    id: 'modern-sans',
    name: 'Modern Sans (Outfit / Inter)',
    headingFont: 'Outfit',
    bodyFont: 'Inter',
    accentFont: 'Allura',
    lineHeight: 1.6
  },
  'playful-kids': {
    id: 'playful-kids',
    name: 'Eğlenceli Çocuk (Nunito / Quicksand)',
    headingFont: 'Quicksand',
    bodyFont: 'Nunito',
    accentFont: 'Pacifico',
    lineHeight: 1.4
  }
};
