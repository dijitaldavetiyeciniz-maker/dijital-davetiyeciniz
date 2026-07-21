import { BackgroundDesign, ThematicAsset, AnimationPreset, SealPreset, TypographyPreset } from './registries';

export type EventType = 'Düğün' | 'Nişan' | 'Kına' | 'Söz' | 'Baby Shower' | 'Doğum Günü' | 'Kurumsal Etkinlik' | 'Açılış / Lansman' | 'Diğer';

export interface TemplatePreset {
  id: string;
  name: string;
  eventType: EventType | 'all';
  genderVariant?: 'girl' | 'boy' | 'neutral';
  layoutStyle: 'monogram' | 'asymmetric' | 'editorial' | 'oriental' | 'full-bleed' | 'folded-seal' | 'monogram-media' | 'photo-luxury' | 'botanical-frame' | 'kids-thematic' | 'henna-velvet' | 'royal-circumcision' | 'split-screen' | 'story-timeline' | 'modern-event';
  category: 'Modern' | 'Klasik' | 'Karanlık' | 'Minimalist' | 'Lüks' | 'Doğal' | 'Çocuk';
  
  background_image_url: string | null;
  primary_color: string;
  text_color?: string;
  font_family: string;
  names_font_family?: string;

  use_envelope?: boolean;
  envelope_color?: string;
  envelope_bg_color?: string;
  envelope_flap_type?: string;
  seal_type?: string;
  seal_color?: string;
  entrance_type?: string;
  effect_type?: string;

  recommendedOpeningType: string;
  recommendedOpeningStyle: string;
  recommendedBackgroundDesign: string;
  recommendedBackgroundAnimation: string;

  palette?: {
    background: string;
    card: string;
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    mutedText: string;
  };
  typography?: {
    heading: string;
    body: string;
    accent: string;
  };
  visualDetails?: {
    border: string;
    seal: string;
    cardShape: string;
    texture: string;
  };

  enabledModules?: {
    countdown: boolean;
    audioPlayer: boolean;
    gallery: boolean;
    location: boolean;
    rsvp: boolean;
  };
}

// Alias for backward compatibility
export type ThemePreset = TemplatePreset;

export const predefinedThemes: TemplatePreset[] = [
  // ============================================================
  // KATEGORİ: DÜĞÜN (EN AZ 12 ADET)
  // ============================================================
  {
    id: 'royal-black-tie',
    name: 'Royal Black Tie',
    category: 'Lüks',
    eventType: 'Düğün',
    primary_color: '#d6a84f',
    text_color: '#0f0e0e',
    font_family: 'Cormorant Garamond',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#080706',
    envelope_bg_color: 'black-gold-velvet',
    envelope_flap_type: 'triangle',
    seal_type: 'crown',
    seal_color: '#d6a84f',
    recommendedOpeningType: 'door',
    recommendedOpeningStyle: 'black-gold-premium',
    recommendedBackgroundDesign: 'black-gold-velvet',
    recommendedBackgroundAnimation: 'goldParticles',
    layoutStyle: 'monogram',
    palette: {
      background: '#080706',
      card: '#fff8ec',
      primary: '#0f0e0e',
      secondary: '#d6a84f',
      accent: '#f8dfac',
      text: '#2f2418',
      mutedText: '#7c6a55'
    },
    typography: {
      heading: 'Playfair Display',
      body: 'Cormorant Garamond',
      accent: 'Great Vibes'
    },
    visualDetails: {
      border: 'gold-thin-frame',
      seal: 'gold-monogram',
      cardShape: 'rounded-luxury',
      texture: 'dark-velvet'
    }
  },
  {
    id: 'rose-gold-romance',
    name: 'Rose Gold Romance',
    category: 'Doğal',
    eventType: 'Düğün',
    primary_color: '#c98778',
    text_color: '#70463f',
    font_family: 'Lora',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#fff1ec',
    envelope_bg_color: 'rose-gold-silk',
    envelope_flap_type: 'rounded',
    seal_type: 'rose',
    seal_color: '#c98778',
    recommendedOpeningType: 'envelope',
    recommendedOpeningStyle: 'rose-gold-romantic',
    recommendedBackgroundDesign: 'rose-gold-silk',
    recommendedBackgroundAnimation: 'rosePetals',
    layoutStyle: 'monogram',
    palette: {
      background: '#fff1ec',
      card: '#ffffff',
      primary: '#c98778',
      secondary: '#eeded8',
      accent: '#fdf6f3',
      text: '#70463f',
      mutedText: '#a3817a'
    },
    typography: {
      heading: 'Playfair Display',
      body: 'Lora',
      accent: 'Allura'
    },
    visualDetails: {
      border: 'soft-rose-frame',
      seal: 'rose-gold',
      cardShape: 'soft-rounded',
      texture: 'silk-paper'
    }
  },
  {
    id: 'parisian-ivory',
    name: 'Parisian Ivory',
    category: 'Klasik',
    eventType: 'Düğün',
    primary_color: '#8c765c',
    text_color: '#2e261f',
    font_family: 'Playfair Display',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#faf6ee',
    envelope_bg_color: 'minimal-white-paper',
    envelope_flap_type: 'classic',
    seal_type: 'floral',
    seal_color: '#8c765c',
    recommendedOpeningType: 'envelope',
    recommendedOpeningStyle: 'minimal-white',
    recommendedBackgroundDesign: 'minimal-white-paper',
    recommendedBackgroundAnimation: 'pearlLight',
    layoutStyle: 'asymmetric',
    palette: {
      background: '#faf6ee',
      card: '#ffffff',
      primary: '#8c765c',
      secondary: '#f3ede0',
      accent: '#fbf9f4',
      text: '#2e261f',
      mutedText: '#695d52'
    },
    typography: {
      heading: 'Playfair Display',
      body: 'Cormorant Garamond',
      accent: 'Parisienne'
    },
    visualDetails: {
      border: 'minimal-line',
      seal: 'gold-seal',
      cardShape: 'clean-rectangle',
      texture: 'fine-paper'
    }
  },
  {
    id: 'bohemian-kraft-wedding',
    name: 'Bohemian Kraft',
    category: 'Doğal',
    eventType: 'Düğün',
    primary_color: '#a3704c',
    text_color: '#3d2b1f',
    font_family: 'Inter',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#ecd5b8',
    envelope_bg_color: 'bohemian-kraft',
    envelope_flap_type: 'rounded',
    seal_type: 'olive',
    seal_color: '#a3704c',
    recommendedOpeningType: 'gardenGate',
    recommendedOpeningStyle: 'bohemian-garden',
    recommendedBackgroundDesign: 'bohemian-kraft',
    recommendedBackgroundAnimation: 'leafFall',
    layoutStyle: 'full-bleed',
    palette: {
      background: '#f8f4ee',
      card: '#faf9f5',
      primary: '#a3704c',
      secondary: '#ecd5b8',
      accent: '#f2eae0',
      text: '#3d2b1f',
      mutedText: '#7a604e'
    },
    typography: {
      heading: 'Outfit',
      body: 'Inter',
      accent: 'Allura'
    },
    visualDetails: {
      border: 'botanical-frame',
      seal: 'olive-wax',
      cardShape: 'rough-edges',
      texture: 'kraft'
    }
  },
  {
    id: 'minimal-white-wedding',
    name: 'Minimal White Ceremony',
    category: 'Minimalist',
    eventType: 'Düğün',
    primary_color: '#333333',
    text_color: '#111111',
    font_family: 'Outfit',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#ffffff',
    envelope_bg_color: 'minimal-white-paper',
    envelope_flap_type: 'classic',
    seal_type: 'infinity',
    seal_color: '#333333',
    recommendedOpeningType: 'minimalFade',
    recommendedOpeningStyle: 'minimal-white',
    recommendedBackgroundDesign: 'minimal-white-paper',
    recommendedBackgroundAnimation: 'pearlLight',
    layoutStyle: 'editorial',
    palette: {
      background: '#fafafa',
      card: '#ffffff',
      primary: '#111111',
      secondary: '#eaeaea',
      accent: '#f5f5f5',
      text: '#222222',
      mutedText: '#777777'
    },
    typography: {
      heading: 'Outfit',
      body: 'Inter',
      accent: 'Parisienne'
    },
    visualDetails: {
      border: 'minimal-line',
      seal: 'silver-seal',
      cardShape: 'clean-rectangle',
      texture: 'fine-paper'
    }
  },
  {
    id: 'luxury-marble-gold',
    name: 'Luxury Marble Gold',
    category: 'Lüks',
    eventType: 'Düğün',
    primary_color: '#dfb76c',
    text_color: '#2a251b',
    font_family: 'Playfair Display',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#f5efe1',
    envelope_bg_color: 'white-gold-marble',
    envelope_flap_type: 'pointed',
    seal_type: 'crown',
    seal_color: '#dfb76c',
    recommendedOpeningType: 'door',
    recommendedOpeningStyle: 'marble-gold',
    recommendedBackgroundDesign: 'white-gold-marble',
    recommendedBackgroundAnimation: 'goldParticles',
    layoutStyle: 'asymmetric',
    palette: {
      background: '#fcfbf7',
      card: '#ffffff',
      primary: '#2a251b',
      secondary: '#dfb76c',
      accent: '#f2ecd9',
      text: '#2a251b',
      mutedText: '#665d4c'
    },
    typography: {
      heading: 'Playfair Display',
      body: 'Lora',
      accent: 'Great Vibes'
    },
    visualDetails: {
      border: 'geometric-gold',
      seal: 'gold-crown',
      cardShape: 'rounded-luxury',
      texture: 'marble'
    }
  },
  {
    id: 'moonlight-wedding',
    name: 'Moonlight Wedding',
    category: 'Modern',
    eventType: 'Düğün',
    primary_color: '#c29cf0',
    text_color: '#0f172a',
    font_family: 'Outfit',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#0b0f19',
    envelope_bg_color: 'navy-gold-night',
    envelope_flap_type: 'triangle',
    seal_type: 'ring',
    seal_color: '#c29cf0',
    recommendedOpeningType: 'starryNight',
    recommendedOpeningStyle: 'navy-gold',
    recommendedBackgroundDesign: 'navy-gold-night',
    recommendedBackgroundAnimation: 'stars',
    layoutStyle: 'monogram',
    palette: {
      background: '#070a13',
      card: '#ffffff',
      primary: '#c29cf0',
      secondary: '#181e2b',
      accent: '#0b0f19',
      text: '#0f172a',
      mutedText: '#475569'
    },
    typography: {
      heading: 'Outfit',
      body: 'Inter',
      accent: 'Allura'
    },
    visualDetails: {
      border: 'starlight-frame',
      seal: 'indigo-moon',
      cardShape: 'rounded-luxury',
      texture: 'dark-space'
    }
  },
  {
    id: 'garden-of-roses',
    name: 'Garden of Roses',
    category: 'Doğal',
    eventType: 'Düğün',
    primary_color: '#d48888',
    text_color: '#3d2222',
    font_family: 'Lora',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#fdf3f3',
    envelope_bg_color: 'pastel-floral',
    envelope_flap_type: 'rounded',
    seal_type: 'rose',
    seal_color: '#d48888',
    recommendedOpeningType: 'envelope',
    recommendedOpeningStyle: 'pastel-floral',
    recommendedBackgroundDesign: 'pastel-floral',
    recommendedBackgroundAnimation: 'rosePetals',
    layoutStyle: 'full-bleed',
    palette: {
      background: '#faf0f0',
      card: '#ffffff',
      primary: '#d48888',
      secondary: '#f7dcd9',
      accent: '#faf3f3',
      text: '#3d2222',
      mutedText: '#7a5151'
    },
    typography: {
      heading: 'Playfair Display',
      body: 'Lora',
      accent: 'Parisienne'
    },
    visualDetails: {
      border: 'watercolor-frame',
      seal: 'rose-seal',
      cardShape: 'soft-rounded',
      texture: 'silk-paper'
    }
  },
  {
    id: 'champagne-reception',
    name: 'Champagne Reception',
    category: 'Lüks',
    eventType: 'Düğün',
    primary_color: '#d4af37',
    text_color: '#332c1c',
    font_family: 'Cormorant Garamond',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#fbf9f4',
    envelope_bg_color: 'champagne-gold',
    envelope_flap_type: 'classic',
    seal_type: 'crown',
    seal_color: '#d4af37',
    recommendedOpeningType: 'luxuryBox',
    recommendedOpeningStyle: 'champagne-gold',
    recommendedBackgroundDesign: 'champagne-gold',
    recommendedBackgroundAnimation: 'goldParticles',
    layoutStyle: 'oriental',
    palette: {
      background: '#fcfbfa',
      card: '#ffffff',
      primary: '#332c1c',
      secondary: '#d4af37',
      accent: '#f2ecd9',
      text: '#332c1c',
      mutedText: '#6b5e43'
    },
    typography: {
      heading: 'Playfair Display',
      body: 'Cormorant Garamond',
      accent: 'Great Vibes'
    },
    visualDetails: {
      border: 'geometric-gold',
      seal: 'gold-crest',
      cardShape: 'royal-rounded',
      texture: 'metallic'
    }
  },
  {
    id: 'classic-ivory-wedding',
    name: 'Classic Ivory Wedding',
    category: 'Klasik',
    eventType: 'Düğün',
    primary_color: '#7a6855',
    text_color: '#2a241e',
    font_family: 'Playfair Display',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#fdfbf7',
    envelope_bg_color: 'minimal-white-paper',
    envelope_flap_type: 'classic',
    seal_type: 'floral',
    seal_color: '#7a6855',
    recommendedOpeningType: 'envelope',
    recommendedOpeningStyle: 'minimal-white',
    recommendedBackgroundDesign: 'minimal-white-paper',
    recommendedBackgroundAnimation: 'pearlLight',
    layoutStyle: 'monogram',
    palette: {
      background: '#fcfbf7',
      card: '#ffffff',
      primary: '#7a6855',
      secondary: '#eae4d9',
      accent: '#f5f0e6',
      text: '#2a241e',
      mutedText: '#5c5044'
    },
    typography: {
      heading: 'Playfair Display',
      body: 'Lora',
      accent: 'Parisienne'
    },
    visualDetails: {
      border: 'minimal-line',
      seal: 'ivory-seal',
      cardShape: 'clean-rectangle',
      texture: 'fine-paper'
    }
  },
  {
    id: 'velvet-burgundy-night',
    name: 'Velvet Burgundy Night',
    category: 'Lüks',
    eventType: 'Düğün',
    primary_color: '#c5a880',
    text_color: '#fcfbf9',
    font_family: 'Cormorant Garamond',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#4a0512',
    envelope_bg_color: 'black-gold-velvet',
    envelope_flap_type: 'triangle',
    seal_type: 'crown',
    seal_color: '#c5a880',
    recommendedOpeningType: 'curtain',
    recommendedOpeningStyle: 'royal-burgundy',
    recommendedBackgroundDesign: 'black-gold-velvet',
    recommendedBackgroundAnimation: 'goldParticles',
    layoutStyle: 'asymmetric',
    palette: {
      background: '#2b020a',
      card: '#4a0512',
      primary: '#c5a880',
      secondary: '#6b071a',
      accent: '#8f0d25',
      text: '#fbf8f5',
      mutedText: '#dfc0ad'
    },
    typography: {
      heading: 'Playfair Display',
      body: 'Cormorant Garamond',
      accent: 'Great Vibes'
    },
    visualDetails: {
      border: 'double-gold',
      seal: 'royal-crest',
      cardShape: 'royal-rounded',
      texture: 'dark-velvet'
    }
  },
  {
    id: 'wax-seal-royal',
    name: 'Mühürlü Kraliyet Daveti',
    category: 'Lüks',
    eventType: 'Düğün',
    primary_color: '#dfb76c',
    text_color: '#1e293b',
    font_family: 'Cormorant Garamond',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#7f1d1d',
    envelope_bg_color: 'solid-burgundy',
    envelope_flap_type: 'triangle',
    seal_type: 'crown',
    seal_color: '#dfb76c',
    recommendedOpeningType: 'envelope',
    recommendedOpeningStyle: 'royal-burgundy',
    recommendedBackgroundDesign: 'solid-burgundy',
    recommendedBackgroundAnimation: 'goldParticles',
    layoutStyle: 'folded-seal',
    palette: {
      background: '#7f1d1d',
      card: '#ffffff',
      primary: '#1e293b',
      secondary: '#dfb76c',
      accent: '#fef2f2',
      text: '#1e293b',
      mutedText: '#64748b'
    },
    typography: {
      heading: 'Cinzel',
      body: 'Cormorant Garamond',
      accent: 'Great Vibes'
    },
    visualDetails: {
      border: 'double-gold',
      seal: 'gold-crest',
      cardShape: 'royal-rounded',
      texture: 'linen'
    }
  },

  // ============================================================
  // KATEGORİ: KINA (EN AZ 6 ADET)
  // ============================================================
  {
    id: 'henna-velvet-bordo',
    name: 'Bordo Kadife Kına',
    category: 'Lüks',
    eventType: 'Kına',
    primary_color: '#fbbf24',
    text_color: '#fff7ed',
    font_family: 'Cormorant Garamond',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#7f1d1d',
    envelope_bg_color: 'solid-burgundy',
    envelope_flap_type: 'triangle',
    seal_type: 'crown',
    seal_color: '#fbbf24',
    recommendedOpeningType: 'curtain',
    recommendedOpeningStyle: 'royal-burgundy',
    recommendedBackgroundDesign: 'solid-burgundy',
    recommendedBackgroundAnimation: 'rosePetals',
    layoutStyle: 'henna-velvet',
    palette: {
      background: '#7f1d1d',
      card: '#450a0a',
      primary: '#fbbf24',
      secondary: '#991b1b',
      accent: '#fef3c7',
      text: '#fff7ed',
      mutedText: '#fca5a5'
    },
    typography: {
      heading: 'Cinzel',
      body: 'Cormorant Garamond',
      accent: 'Great Vibes'
    },
    visualDetails: {
      border: 'double-gold',
      seal: 'gold-crest',
      cardShape: 'royal-rounded',
      texture: 'dark-velvet'
    }
  },
  {
    id: 'henna-rose-gold',
    name: 'Rose Gold Henna Night',
    category: 'Modern',
    eventType: 'Kına',
    primary_color: '#fb7185',
    text_color: '#4c0519',
    font_family: 'Lora',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#ffe4e6',
    envelope_bg_color: 'rose-gold-silk',
    envelope_flap_type: 'rounded',
    seal_type: 'rose',
    seal_color: '#fb7185',
    recommendedOpeningType: 'envelope',
    recommendedOpeningStyle: 'rose-gold-romantic',
    recommendedBackgroundDesign: 'rose-gold-silk',
    recommendedBackgroundAnimation: 'rosePetals',
    layoutStyle: 'monogram',
    palette: {
      background: '#fff1ec',
      card: '#ffffff',
      primary: '#fb7185',
      secondary: '#ffe4e6',
      accent: '#fff5f5',
      text: '#4c0519',
      mutedText: '#9f1239'
    },
    typography: {
      heading: 'Playfair Display',
      body: 'Lora',
      accent: 'Parisienne'
    },
    visualDetails: {
      border: 'soft-rose-frame',
      seal: 'rose-seal',
      cardShape: 'soft-rounded',
      texture: 'silk-paper'
    }
  },
  {
    id: 'henna-traditional',
    name: 'Geleneksel Kına Tepsisi',
    category: 'Klasik',
    eventType: 'Kına',
    primary_color: '#d97706',
    text_color: '#451a03',
    font_family: 'Cormorant Garamond',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#9a3412',
    envelope_bg_color: 'solid-burgundy',
    envelope_flap_type: 'classic',
    seal_type: 'crown',
    seal_color: '#d97706',
    recommendedOpeningType: 'door',
    recommendedOpeningStyle: 'royal-burgundy',
    recommendedBackgroundDesign: 'solid-burgundy',
    recommendedBackgroundAnimation: 'goldParticles',
    layoutStyle: 'oriental',
    palette: {
      background: '#7c2d12',
      card: '#fffbeb',
      primary: '#451a03',
      secondary: '#d97706',
      accent: '#fde68a',
      text: '#451a03',
      mutedText: '#b45309'
    },
    typography: {
      heading: 'Cinzel',
      body: 'Cormorant Garamond',
      accent: 'Great Vibes'
    },
    visualDetails: {
      border: 'baroque-pattern',
      seal: 'gold-crest',
      cardShape: 'royal-rounded',
      texture: 'fine-paper'
    }
  },
  {
    id: 'henna-candle',
    name: 'Mum Işığında Kına',
    category: 'Doğal',
    eventType: 'Kına',
    primary_color: '#f59e0b',
    text_color: '#fef3c7',
    font_family: 'Lora',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#451a03',
    envelope_bg_color: 'black-gold-velvet',
    envelope_flap_type: 'rounded',
    seal_type: 'rose',
    seal_color: '#f59e0b',
    recommendedOpeningType: 'envelope',
    recommendedOpeningStyle: 'black-gold-premium',
    recommendedBackgroundDesign: 'black-gold-velvet',
    recommendedBackgroundAnimation: 'goldParticles',
    layoutStyle: 'full-bleed',
    palette: {
      background: '#1c1917',
      card: '#292524',
      primary: '#f59e0b',
      secondary: '#44403c',
      accent: '#78716c',
      text: '#fef3c7',
      mutedText: '#d97706'
    },
    typography: {
      heading: 'Playfair Display',
      body: 'Lora',
      accent: 'Allura'
    },
    visualDetails: {
      border: 'watercolor-frame',
      seal: 'rose-seal',
      cardShape: 'soft-rounded',
      texture: 'dark-velvet'
    }
  },
  {
    id: 'henna-lace',
    name: 'Oryantal Altın Dantel',
    category: 'Lüks',
    eventType: 'Kına',
    primary_color: '#dfa857',
    text_color: '#ffffff',
    font_family: 'Cinzel',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#000000',
    envelope_bg_color: 'black-gold-velvet',
    envelope_flap_type: 'triangle',
    seal_type: 'crown',
    seal_color: '#dfa857',
    recommendedOpeningType: 'door',
    recommendedOpeningStyle: 'black-gold-premium',
    recommendedBackgroundDesign: 'black-gold-velvet',
    recommendedBackgroundAnimation: 'goldParticles',
    layoutStyle: 'oriental',
    palette: {
      background: '#0a0a0a',
      card: '#111111',
      primary: '#dfa857',
      secondary: '#262626',
      accent: '#404040',
      text: '#ffffff',
      mutedText: '#d4d4d4'
    },
    typography: {
      heading: 'Cinzel',
      body: 'Cormorant Garamond',
      accent: 'Great Vibes'
    },
    visualDetails: {
      border: 'baroque-pattern',
      seal: 'gold-crest',
      cardShape: 'rounded-luxury',
      texture: 'dark-velvet'
    }
  },
  {
    id: 'henna-luxury-red',
    name: 'Siyah ve Bordo Lüks Kına',
    category: 'Karanlık',
    eventType: 'Kına',
    primary_color: '#e11d48',
    text_color: '#ffe4e6',
    font_family: 'Cormorant Garamond',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#1e1b4b',
    envelope_bg_color: 'black-gold-velvet',
    envelope_flap_type: 'triangle',
    seal_type: 'crown',
    seal_color: '#e11d48',
    recommendedOpeningType: 'curtain',
    recommendedOpeningStyle: 'royal-burgundy',
    recommendedBackgroundDesign: 'black-gold-velvet',
    recommendedBackgroundAnimation: 'rosePetals',
    layoutStyle: 'henna-velvet',
    palette: {
      background: '#090514',
      card: '#1c0a1a',
      primary: '#e11d48',
      secondary: '#31102f',
      accent: '#4a1545',
      text: '#ffe4e6',
      mutedText: '#f43f5e'
    },
    typography: {
      heading: 'Cinzel',
      body: 'Cormorant Garamond',
      accent: 'Great Vibes'
    },
    visualDetails: {
      border: 'double-gold',
      seal: 'gold-crest',
      cardShape: 'royal-rounded',
      texture: 'dark-velvet'
    }
  },

  // ============================================================
  // KATEGORİ: SÜNNET (EN AZ 6 ADET)
  // ============================================================
  {
    id: 'circumcision-royal',
    name: 'Şehzade Sünnet Daveti',
    category: 'Lüks',
    eventType: 'Sünnet',
    primary_color: '#d4af37',
    text_color: '#fffbeb',
    font_family: 'Cinzel',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#1e3a8a',
    envelope_bg_color: 'navy-gold-night',
    envelope_flap_type: 'triangle',
    seal_type: 'crown',
    seal_color: '#d4af37',
    recommendedOpeningType: 'door',
    recommendedOpeningStyle: 'navy-gold',
    recommendedBackgroundDesign: 'navy-gold-night',
    recommendedBackgroundAnimation: 'goldParticles',
    layoutStyle: 'royal-circumcision',
    palette: {
      background: '#0f172a',
      card: '#1e3a8a',
      primary: '#d4af37',
      secondary: '#1e40af',
      accent: '#3b82f6',
      text: '#fffbeb',
      mutedText: '#93c5fd'
    },
    typography: {
      heading: 'Cinzel',
      body: 'Cormorant Garamond',
      accent: 'Great Vibes'
    },
    visualDetails: {
      border: 'geometric-gold',
      seal: 'gold-crown',
      cardShape: 'royal-rounded',
      texture: 'dark-space'
    }
  },
  {
    id: 'circumcision-nazar',
    name: 'Nazar Boncuklu Maşallah',
    category: 'Klasik',
    eventType: 'Sünnet',
    primary_color: '#3b82f6',
    text_color: '#1e3a8a',
    font_family: 'Inter',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#eff6ff',
    envelope_bg_color: 'minimal-white-paper',
    envelope_flap_type: 'classic',
    seal_type: 'ring',
    seal_color: '#3b82f6',
    recommendedOpeningType: 'envelope',
    recommendedOpeningStyle: 'minimal-white',
    recommendedBackgroundDesign: 'minimal-white-paper',
    recommendedBackgroundAnimation: 'pearlLight',
    layoutStyle: 'monogram',
    palette: {
      background: '#f8fafc',
      card: '#ffffff',
      primary: '#3b82f6',
      secondary: '#dbeafe',
      accent: '#eff6ff',
      text: '#1e3a8a',
      mutedText: '#60a5fa'
    },
    typography: {
      heading: 'Playfair Display',
      body: 'Inter',
      accent: 'Parisienne'
    },
    visualDetails: {
      border: 'minimal-line',
      seal: 'blue-seal',
      cardShape: 'soft-rounded',
      texture: 'fine-paper'
    }
  },
  {
    id: 'circumcision-velvet',
    name: 'Lacivert Kadife Sünnet',
    category: 'Lüks',
    eventType: 'Sünnet',
    primary_color: '#f59e0b',
    text_color: '#fef3c7',
    font_family: 'Cormorant Garamond',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#0f172a',
    envelope_bg_color: 'navy-gold-night',
    envelope_flap_type: 'triangle',
    seal_type: 'crown',
    seal_color: '#f59e0b',
    recommendedOpeningType: 'door',
    recommendedOpeningStyle: 'navy-gold',
    recommendedBackgroundDesign: 'navy-gold-night',
    recommendedBackgroundAnimation: 'goldParticles',
    layoutStyle: 'royal-circumcision',
    palette: {
      background: '#0b0f19',
      card: '#0f172a',
      primary: '#f59e0b',
      secondary: '#1e293b',
      accent: '#334155',
      text: '#fef3c7',
      mutedText: '#cbd5e1'
    },
    typography: {
      heading: 'Cinzel',
      body: 'Cormorant Garamond',
      accent: 'Great Vibes'
    },
    visualDetails: {
      border: 'double-gold',
      seal: 'gold-crest',
      cardShape: 'royal-rounded',
      texture: 'dark-space'
    }
  },
  {
    id: 'circumcision-ottoman',
    name: 'Osmanlı Sarayı Sünnet',
    category: 'Klasik',
    eventType: 'Sünnet',
    primary_color: '#dfa857',
    text_color: '#451a03',
    font_family: 'Cinzel',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#7c2d12',
    envelope_bg_color: 'solid-burgundy',
    envelope_flap_type: 'pointed',
    seal_type: 'crown',
    seal_color: '#dfa857',
    recommendedOpeningType: 'curtain',
    recommendedOpeningStyle: 'royal-burgundy',
    recommendedBackgroundDesign: 'solid-burgundy',
    recommendedBackgroundAnimation: 'goldParticles',
    layoutStyle: 'oriental',
    palette: {
      background: '#450a0a',
      card: '#fffbeb',
      primary: '#451a03',
      secondary: '#dfa857',
      accent: '#fde68a',
      text: '#451a03',
      mutedText: '#9a3412'
    },
    typography: {
      heading: 'Cinzel',
      body: 'Cormorant Garamond',
      accent: 'Great Vibes'
    },
    visualDetails: {
      border: 'baroque-pattern',
      seal: 'gold-crest',
      cardShape: 'royal-rounded',
      texture: 'fine-paper'
    }
  },
  {
    id: 'circumcision-crown',
    name: 'Altın Taçlı Sünnet',
    category: 'Lüks',
    eventType: 'Sünnet',
    primary_color: '#d4af37',
    text_color: '#1e293b',
    font_family: 'Cormorant Garamond',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#ffffff',
    envelope_bg_color: 'white-gold-marble',
    envelope_flap_type: 'triangle',
    seal_type: 'crown',
    seal_color: '#d4af37',
    recommendedOpeningType: 'envelope',
    recommendedOpeningStyle: 'minimal-white',
    recommendedBackgroundDesign: 'white-gold-marble',
    recommendedBackgroundAnimation: 'goldParticles',
    layoutStyle: 'monogram',
    palette: {
      background: '#fafafa',
      card: '#ffffff',
      primary: '#1e293b',
      secondary: '#d4af37',
      accent: '#f1f5f9',
      text: '#1e293b',
      mutedText: '#64748b'
    },
    typography: {
      heading: 'Cinzel',
      body: 'Cormorant Garamond',
      accent: 'Great Vibes'
    },
    visualDetails: {
      border: 'geometric-gold',
      seal: 'gold-crown',
      cardShape: 'rounded-luxury',
      texture: 'marble'
    }
  },
  {
    id: 'circumcision-modern',
    name: 'Modern Mavi Monogram',
    category: 'Modern',
    eventType: 'Sünnet',
    primary_color: '#2563eb',
    text_color: '#1e293b',
    font_family: 'Outfit',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#f8fafc',
    envelope_bg_color: 'minimal-white-paper',
    envelope_flap_type: 'rounded',
    seal_type: 'ring',
    seal_color: '#2563eb',
    recommendedOpeningType: 'minimalFade',
    recommendedOpeningStyle: 'minimal-white',
    recommendedBackgroundDesign: 'minimal-white-paper',
    recommendedBackgroundAnimation: 'pearlLight',
    layoutStyle: 'editorial',
    palette: {
      background: '#f1f5f9',
      card: '#ffffff',
      primary: '#1e293b',
      secondary: '#2563eb',
      accent: '#dbeafe',
      text: '#1e293b',
      mutedText: '#64748b'
    },
    typography: {
      heading: 'Outfit',
      body: 'Inter',
      accent: 'Allura'
    },
    visualDetails: {
      border: 'minimal-line',
      seal: 'silver-seal',
      cardShape: 'clean-rectangle',
      texture: 'fine-paper'
    }
  },

  // ============================================================
  // KATEGORİ: KIZ ÇOCUK & BABY SHOWER (EN AZ 6 ADET)
  // ============================================================
  {
    id: 'baby-girl-princess',
    name: 'Pembe Prenses Sarayı',
    category: 'Çocuk',
    eventType: 'Baby Shower',
    genderVariant: 'girl',
    primary_color: '#ec4899',
    text_color: '#831843',
    font_family: 'Inter',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#fce7f3',
    envelope_bg_color: 'rose-gold-silk',
    envelope_flap_type: 'rounded',
    seal_type: 'heart',
    seal_color: '#ec4899',
    recommendedOpeningType: 'envelope',
    recommendedOpeningStyle: 'rose-gold-romantic',
    recommendedBackgroundDesign: 'rose-gold-silk',
    recommendedBackgroundAnimation: 'rosePetals',
    layoutStyle: 'kids-thematic',
    palette: {
      background: '#fdf2f8',
      card: '#ffffff',
      primary: '#ec4899',
      secondary: '#fce7f3',
      accent: '#fdf2f8',
      text: '#831843',
      mutedText: '#db2777'
    },
    typography: {
      heading: 'Outfit',
      body: 'Inter',
      accent: 'Parisienne'
    },
    visualDetails: {
      border: 'watercolor-frame',
      seal: 'rose-seal',
      cardShape: 'soft-rounded',
      texture: 'silk-paper'
    }
  },
  {
    id: 'baby-girl-butterfly',
    name: 'Pastel Kelebek Bahçesi',
    category: 'Çocuk',
    eventType: 'Doğum Günü',
    genderVariant: 'girl',
    primary_color: '#a855f7',
    text_color: '#581c87',
    font_family: 'Inter',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#f3e8ff',
    envelope_bg_color: 'pastel-floral',
    envelope_flap_type: 'rounded',
    seal_type: 'floral',
    seal_color: '#a855f7',
    recommendedOpeningType: 'envelope',
    recommendedOpeningStyle: 'pastel-floral',
    recommendedBackgroundDesign: 'pastel-floral',
    recommendedBackgroundAnimation: 'rosePetals',
    layoutStyle: 'kids-thematic',
    palette: {
      background: '#faf5ff',
      card: '#ffffff',
      primary: '#a855f7',
      secondary: '#f3e8ff',
      accent: '#faf5ff',
      text: '#581c87',
      mutedText: '#9333ea'
    },
    typography: {
      heading: 'Outfit',
      body: 'Inter',
      accent: 'Allura'
    },
    visualDetails: {
      border: 'watercolor-frame',
      seal: 'rose-seal',
      cardShape: 'soft-rounded',
      texture: 'silk-paper'
    }
  },
  {
    id: 'baby-girl-crown',
    name: 'Taçlı Küçük Prenses',
    category: 'Çocuk',
    eventType: 'Baby Shower',
    genderVariant: 'girl',
    primary_color: '#f43f5e',
    text_color: '#881337',
    font_family: 'Inter',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#ffe4e6',
    envelope_bg_color: 'rose-gold-silk',
    envelope_flap_type: 'triangle',
    seal_type: 'crown',
    seal_color: '#f43f5e',
    recommendedOpeningType: 'envelope',
    recommendedOpeningStyle: 'rose-gold-romantic',
    recommendedBackgroundDesign: 'rose-gold-silk',
    recommendedBackgroundAnimation: 'rosePetals',
    layoutStyle: 'kids-thematic',
    palette: {
      background: '#fff1f2',
      card: '#ffffff',
      primary: '#f43f5e',
      secondary: '#ffe4e6',
      accent: '#fff1f2',
      text: '#881337',
      mutedText: '#e11d48'
    },
    typography: {
      heading: 'Outfit',
      body: 'Inter',
      accent: 'Parisienne'
    },
    visualDetails: {
      border: 'watercolor-frame',
      seal: 'rose-seal',
      cardShape: 'soft-rounded',
      texture: 'silk-paper'
    }
  },
  {
    id: 'baby-girl-toy',
    name: 'Pembe Oyuncak Dünyası',
    category: 'Çocuk',
    eventType: 'Doğum Günü',
    genderVariant: 'girl',
    primary_color: '#db2777',
    text_color: '#700d3d',
    font_family: 'Inter',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#fce7f3',
    envelope_bg_color: 'rose-gold-silk',
    envelope_flap_type: 'rounded',
    seal_type: 'heart',
    seal_color: '#db2777',
    recommendedOpeningType: 'envelope',
    recommendedOpeningStyle: 'rose-gold-romantic',
    recommendedBackgroundDesign: 'rose-gold-silk',
    recommendedBackgroundAnimation: 'rosePetals',
    layoutStyle: 'kids-thematic',
    palette: {
      background: '#fff1f2',
      card: '#ffffff',
      primary: '#db2777',
      secondary: '#fce7f3',
      accent: '#fff1f2',
      text: '#700d3d',
      mutedText: '#be185d'
    },
    typography: {
      heading: 'Outfit',
      body: 'Inter',
      accent: 'Allura'
    },
    visualDetails: {
      border: 'watercolor-frame',
      seal: 'rose-seal',
      cardShape: 'soft-rounded',
      texture: 'silk-paper'
    }
  },
  {
    id: 'baby-girl-clouds',
    name: 'Masal Bulutları',
    category: 'Çocuk',
    eventType: 'Baby Shower',
    genderVariant: 'girl',
    primary_color: '#f472b6',
    text_color: '#4c0519',
    font_family: 'Inter',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#fdf2f8',
    envelope_bg_color: 'rose-gold-silk',
    envelope_flap_type: 'rounded',
    seal_type: 'heart',
    seal_color: '#f472b6',
    recommendedOpeningType: 'envelope',
    recommendedOpeningStyle: 'rose-gold-romantic',
    recommendedBackgroundDesign: 'rose-gold-silk',
    recommendedBackgroundAnimation: 'rosePetals',
    layoutStyle: 'kids-thematic',
    palette: {
      background: '#fff5f5',
      card: '#ffffff',
      primary: '#f472b6',
      secondary: '#ffe4e6',
      accent: '#fff5f5',
      text: '#4c0519',
      mutedText: '#db2777'
    },
    typography: {
      heading: 'Outfit',
      body: 'Inter',
      accent: 'Parisienne'
    },
    visualDetails: {
      border: 'watercolor-frame',
      seal: 'rose-seal',
      cardShape: 'soft-rounded',
      texture: 'silk-paper'
    }
  },
  {
    id: 'baby-girl-fashion',
    name: 'Parıltılı Moda Bebek Partisi',
    category: 'Çocuk',
    eventType: 'Doğum Günü',
    genderVariant: 'girl',
    primary_color: '#f43f5e',
    text_color: '#4c0519',
    font_family: 'Inter',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#ffe4e6',
    envelope_bg_color: 'rose-gold-silk',
    envelope_flap_type: 'triangle',
    seal_type: 'crown',
    seal_color: '#f43f5e',
    recommendedOpeningType: 'envelope',
    recommendedOpeningStyle: 'rose-gold-romantic',
    recommendedBackgroundDesign: 'rose-gold-silk',
    recommendedBackgroundAnimation: 'goldParticles',
    layoutStyle: 'kids-thematic',
    palette: {
      background: '#fff1f2',
      card: '#ffffff',
      primary: '#f43f5e',
      secondary: '#ffe4e6',
      accent: '#fff1f2',
      text: '#4c0519',
      mutedText: '#e11d48'
    },
    typography: {
      heading: 'Outfit',
      body: 'Inter',
      accent: 'Allura'
    },
    visualDetails: {
      border: 'watercolor-frame',
      seal: 'rose-seal',
      cardShape: 'soft-rounded',
      texture: 'silk-paper'
    }
  },

  // ============================================================
  // KATEGORİ: ERKEK ÇOCUK & BABY SHOWER (EN AZ 6 ADET)
  // ============================================================
  {
    id: 'baby-boy-racer',
    name: 'Küçük Yarışçı',
    category: 'Çocuk',
    eventType: 'Doğum Günü',
    genderVariant: 'boy',
    primary_color: '#2563eb',
    text_color: '#1e3a8a',
    font_family: 'Inter',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#dbeafe',
    envelope_bg_color: 'minimal-white-paper',
    envelope_flap_type: 'rounded',
    seal_type: 'ring',
    seal_color: '#2563eb',
    recommendedOpeningType: 'envelope',
    recommendedOpeningStyle: 'minimal-white',
    recommendedBackgroundDesign: 'minimal-white-paper',
    recommendedBackgroundAnimation: 'snowFall',
    layoutStyle: 'kids-thematic',
    palette: {
      background: '#eff6ff',
      card: '#ffffff',
      primary: '#2563eb',
      secondary: '#dbeafe',
      accent: '#eff6ff',
      text: '#1e3a8a',
      mutedText: '#3b82f6'
    },
    typography: {
      heading: 'Outfit',
      body: 'Inter',
      accent: 'Allura'
    },
    visualDetails: {
      border: 'watercolor-frame',
      seal: 'silver-seal',
      cardShape: 'soft-rounded',
      texture: 'fine-paper'
    }
  },
  {
    id: 'baby-boy-bear',
    name: 'Mavi Ayıcık',
    category: 'Çocuk',
    eventType: 'Baby Shower',
    genderVariant: 'boy',
    primary_color: '#60a5fa',
    text_color: '#1e3a8a',
    font_family: 'Inter',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#eff6ff',
    envelope_bg_color: 'minimal-white-paper',
    envelope_flap_type: 'rounded',
    seal_type: 'heart',
    seal_color: '#60a5fa',
    recommendedOpeningType: 'envelope',
    recommendedOpeningStyle: 'minimal-white',
    recommendedBackgroundDesign: 'minimal-white-paper',
    recommendedBackgroundAnimation: 'pearlLight',
    layoutStyle: 'kids-thematic',
    palette: {
      background: '#f8fafc',
      card: '#ffffff',
      primary: '#60a5fa',
      secondary: '#dbeafe',
      accent: '#eff6ff',
      text: '#1e3a8a',
      mutedText: '#2563eb'
    },
    typography: {
      heading: 'Outfit',
      body: 'Inter',
      accent: 'Parisienne'
    },
    visualDetails: {
      border: 'watercolor-frame',
      seal: 'silver-seal',
      cardShape: 'soft-rounded',
      texture: 'fine-paper'
    }
  },
  {
    id: 'baby-boy-clouds',
    name: 'Bulutların Üzerinde',
    category: 'Çocuk',
    eventType: 'Doğum Günü',
    genderVariant: 'boy',
    primary_color: '#38bdf8',
    text_color: '#0369a1',
    font_family: 'Inter',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#e0f2fe',
    envelope_bg_color: 'minimal-white-paper',
    envelope_flap_type: 'rounded',
    seal_type: 'heart',
    seal_color: '#38bdf8',
    recommendedOpeningType: 'envelope',
    recommendedOpeningStyle: 'minimal-white',
    recommendedBackgroundDesign: 'minimal-white-paper',
    recommendedBackgroundAnimation: 'pearlLight',
    layoutStyle: 'kids-thematic',
    palette: {
      background: '#f0f9ff',
      card: '#ffffff',
      primary: '#38bdf8',
      secondary: '#e0f2fe',
      accent: '#f0f9ff',
      text: '#0369a1',
      mutedText: '#0284c7'
    },
    typography: {
      heading: 'Outfit',
      body: 'Inter',
      accent: 'Allura'
    },
    visualDetails: {
      border: 'watercolor-frame',
      seal: 'silver-seal',
      cardShape: 'soft-rounded',
      texture: 'fine-paper'
    }
  },
  {
    id: 'baby-boy-space',
    name: 'Uzay Macerası',
    category: 'Çocuk',
    eventType: 'Doğum Günü',
    genderVariant: 'boy',
    primary_color: '#6366f1',
    text_color: '#312e81',
    font_family: 'Inter',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#e0e7ff',
    envelope_bg_color: 'navy-gold-night',
    envelope_flap_type: 'triangle',
    seal_type: 'crown',
    seal_color: '#6366f1',
    recommendedOpeningType: 'envelope',
    recommendedOpeningStyle: 'navy-gold',
    recommendedBackgroundDesign: 'navy-gold-night',
    recommendedBackgroundAnimation: 'stars',
    layoutStyle: 'kids-thematic',
    palette: {
      background: '#070a13',
      card: '#0f172a',
      primary: '#6366f1',
      secondary: '#1e1b4b',
      accent: '#2e1065',
      text: '#e0e7ff',
      mutedText: '#818cf8'
    },
    typography: {
      heading: 'Outfit',
      body: 'Inter',
      accent: 'Allura'
    },
    visualDetails: {
      border: 'watercolor-frame',
      seal: 'silver-seal',
      cardShape: 'soft-rounded',
      texture: 'dark-space'
    }
  },
  {
    id: 'baby-boy-safari',
    name: 'Safari Bebek',
    category: 'Çocuk',
    eventType: 'Baby Shower',
    genderVariant: 'boy',
    primary_color: '#10b981',
    text_color: '#064e3b',
    font_family: 'Inter',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#d1fae5',
    envelope_bg_color: 'bohemian-kraft',
    envelope_flap_type: 'rounded',
    seal_type: 'olive',
    seal_color: '#10b981',
    recommendedOpeningType: 'envelope',
    recommendedOpeningStyle: 'bohemian-garden',
    recommendedBackgroundDesign: 'bohemian-kraft',
    recommendedBackgroundAnimation: 'leafFall',
    layoutStyle: 'kids-thematic',
    palette: {
      background: '#f0fdf4',
      card: '#ffffff',
      primary: '#10b981',
      secondary: '#d1fae5',
      accent: '#f0fdf4',
      text: '#064e3b',
      mutedText: '#059669'
    },
    typography: {
      heading: 'Outfit',
      body: 'Inter',
      accent: 'Allura'
    },
    visualDetails: {
      border: 'watercolor-frame',
      seal: 'olive-wax',
      cardShape: 'soft-rounded',
      texture: 'kraft'
    }
  },
  {
    id: 'baby-boy-sailor',
    name: 'Denizci Çocuk',
    category: 'Çocuk',
    eventType: 'Doğum Günü',
    genderVariant: 'boy',
    primary_color: '#1d4ed8',
    text_color: '#1e3a8a',
    font_family: 'Inter',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#eff6ff',
    envelope_bg_color: 'minimal-white-paper',
    envelope_flap_type: 'classic',
    seal_type: 'ring',
    seal_color: '#1d4ed8',
    recommendedOpeningType: 'envelope',
    recommendedOpeningStyle: 'minimal-white',
    recommendedBackgroundDesign: 'minimal-white-paper',
    recommendedBackgroundAnimation: 'pearlLight',
    layoutStyle: 'kids-thematic',
    palette: {
      background: '#f8fafc',
      card: '#ffffff',
      primary: '#1d4ed8',
      secondary: '#dbeafe',
      accent: '#eff6ff',
      text: '#1e3a8a',
      mutedText: '#3b82f6'
    },
    typography: {
      heading: 'Outfit',
      body: 'Inter',
      accent: 'Allura'
    },
    visualDetails: {
      border: 'watercolor-frame',
      seal: 'silver-seal',
      cardShape: 'soft-rounded',
      texture: 'fine-paper'
    }
  },

  // ============================================================
  // KATEGORİ: NİŞAN & SÖZ (EN AZ 6 ADET)
  // ============================================================
  {
    id: 'engagement-blush',
    name: 'Pudra ve Rose Gold Nişan',
    category: 'Doğal',
    eventType: 'Nişan',
    primary_color: '#db2777',
    text_color: '#831843',
    font_family: 'Lora',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#fce7f3',
    envelope_bg_color: 'rose-gold-silk',
    envelope_flap_type: 'rounded',
    seal_type: 'rose',
    seal_color: '#db2777',
    recommendedOpeningType: 'envelope',
    recommendedOpeningStyle: 'rose-gold-romantic',
    recommendedBackgroundDesign: 'rose-gold-silk',
    recommendedBackgroundAnimation: 'rosePetals',
    layoutStyle: 'monogram',
    palette: {
      background: '#fff1ec',
      card: '#ffffff',
      primary: '#db2777',
      secondary: '#eeded8',
      accent: '#fdf6f3',
      text: '#831843',
      mutedText: '#c98778'
    },
    typography: {
      heading: 'Playfair Display',
      body: 'Lora',
      accent: 'Parisienne'
    },
    visualDetails: {
      border: 'soft-rose-frame',
      seal: 'rose-seal',
      cardShape: 'soft-rounded',
      texture: 'silk-paper'
    }
  },
  {
    id: 'engagement-emerald',
    name: 'Zümrüt Yeşili Söz',
    category: 'Lüks',
    eventType: 'Söz',
    primary_color: '#dfb76c',
    text_color: '#064e3b',
    font_family: 'Cormorant Garamond',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#064e3b',
    envelope_bg_color: 'emerald-marble',
    envelope_flap_type: 'pointed',
    seal_type: 'crown',
    seal_color: '#dfb76c',
    recommendedOpeningType: 'door',
    recommendedOpeningStyle: 'black-gold-premium',
    recommendedBackgroundDesign: 'emerald-marble',
    recommendedBackgroundAnimation: 'goldParticles',
    layoutStyle: 'asymmetric',
    palette: {
      background: '#042f24',
      card: '#ffffff',
      primary: '#064e3b',
      secondary: '#dfb76c',
      accent: '#0d5c47',
      text: '#064e3b',
      mutedText: '#447b6a'
    },
    typography: {
      heading: 'Cinzel',
      body: 'Cormorant Garamond',
      accent: 'Great Vibes'
    },
    visualDetails: {
      border: 'double-gold',
      seal: 'gold-crown',
      cardShape: 'royal-rounded',
      texture: 'marble'
    }
  },
  {
    id: 'engagement-minimal',
    name: 'Minimal Bej Nişan',
    category: 'Minimalist',
    eventType: 'Nişan',
    primary_color: '#7c6953',
    text_color: '#3e3429',
    font_family: 'Outfit',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#f5f0e6',
    envelope_bg_color: 'minimal-white-paper',
    envelope_flap_type: 'classic',
    seal_type: 'infinity',
    seal_color: '#7c6953',
    recommendedOpeningType: 'minimalFade',
    recommendedOpeningStyle: 'minimal-white',
    recommendedBackgroundDesign: 'minimal-white-paper',
    recommendedBackgroundAnimation: 'pearlLight',
    layoutStyle: 'editorial',
    palette: {
      background: '#fcfaf7',
      card: '#ffffff',
      primary: '#3e3429',
      secondary: '#ebe2d3',
      accent: '#f5eee0',
      text: '#3e3429',
      mutedText: '#7e6b56'
    },
    typography: {
      heading: 'Outfit',
      body: 'Inter',
      accent: 'Parisienne'
    },
    visualDetails: {
      border: 'minimal-line',
      seal: 'beige-seal',
      cardShape: 'clean-rectangle',
      texture: 'fine-paper'
    }
  },
  {
    id: 'engagement-family',
    name: 'Çiçekli Aile Daveti',
    category: 'Klasik',
    eventType: 'Söz',
    primary_color: '#a3704c',
    text_color: '#3d2b1f',
    font_family: 'Lora',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#faf6ee',
    envelope_bg_color: 'minimal-white-paper',
    envelope_flap_type: 'classic',
    seal_type: 'floral',
    seal_color: '#a3704c',
    recommendedOpeningType: 'envelope',
    recommendedOpeningStyle: 'minimal-white',
    recommendedBackgroundDesign: 'minimal-white-paper',
    recommendedBackgroundAnimation: 'pearlLight',
    layoutStyle: 'asymmetric',
    palette: {
      background: '#faf6ee',
      card: '#ffffff',
      primary: '#a3704c',
      secondary: '#f3ede0',
      accent: '#fbf9f4',
      text: '#3d2b1f',
      mutedText: '#695d52'
    },
    typography: {
      heading: 'Playfair Display',
      body: 'Lora',
      accent: 'Parisienne'
    },
    visualDetails: {
      border: 'minimal-line',
      seal: 'gold-seal',
      cardShape: 'clean-rectangle',
      texture: 'fine-paper'
    }
  },
  {
    id: 'engagement-gold-frame',
    name: 'Altın Çerçeveli Söz',
    category: 'Lüks',
    eventType: 'Söz',
    primary_color: '#d4af37',
    text_color: '#1a1a1a',
    font_family: 'Cinzel',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#111111',
    envelope_bg_color: 'black-gold-velvet',
    envelope_flap_type: 'triangle',
    seal_type: 'crown',
    seal_color: '#d4af37',
    recommendedOpeningType: 'door',
    recommendedOpeningStyle: 'black-gold-premium',
    recommendedBackgroundDesign: 'black-gold-velvet',
    recommendedBackgroundAnimation: 'goldParticles',
    layoutStyle: 'oriental',
    palette: {
      background: '#0a0a0a',
      card: '#ffffff',
      primary: '#1a1a1a',
      secondary: '#d4af37',
      accent: '#e6cc80',
      text: '#1a1a1a',
      mutedText: '#5c5c5c'
    },
    typography: {
      heading: 'Cinzel',
      body: 'Cormorant Garamond',
      accent: 'Great Vibes'
    },
    visualDetails: {
      border: 'geometric-gold',
      seal: 'royal-seal',
      cardShape: 'rounded-luxury',
      texture: 'marble'
    }
  },
  {
    id: 'engagement-lavender',
    name: 'Lavanta Bahçesi Nişan',
    category: 'Doğal',
    eventType: 'Nişan',
    primary_color: '#8b5cf6',
    text_color: '#4c1d95',
    font_family: 'Lora',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#f5f3ff',
    envelope_bg_color: 'pastel-floral',
    envelope_flap_type: 'rounded',
    seal_type: 'floral',
    seal_color: '#8b5cf6',
    recommendedOpeningType: 'envelope',
    recommendedOpeningStyle: 'pastel-floral',
    recommendedBackgroundDesign: 'pastel-floral',
    recommendedBackgroundAnimation: 'rosePetals',
    layoutStyle: 'full-bleed',
    palette: {
      background: '#faf8ff',
      card: '#ffffff',
      primary: '#8b5cf6',
      secondary: '#ddd6fe',
      accent: '#ede9fe',
      text: '#4c1d95',
      mutedText: '#7c3aed'
    },
    typography: {
      heading: 'Playfair Display',
      body: 'Lora',
      accent: 'Parisienne'
    },
    visualDetails: {
      border: 'watercolor-frame',
      seal: 'lavender-flower',
      cardShape: 'soft-rounded',
      texture: 'silk-paper'
    }
  }
];
