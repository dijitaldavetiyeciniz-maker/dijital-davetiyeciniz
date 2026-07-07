export interface ThemePreset {
  id: string;
  name: string;
  category: 'Modern' | 'Klasik' | 'Karanlık' | 'Minimalist' | 'Lüks' | 'Doğal';
  template_id: string;
  primary_color: string;
  text_color?: string;
  font_family: string;
  background_image_url: string | null;
  use_envelope?: boolean;
  envelope_color?: string;
  envelope_bg_color?: string;
  envelope_flap_type?: string;
  seal_type?: string;
  seal_color?: string;
  entrance_type?: string;
  effect_type?: string;
  // Recommended options
  recommendedOpeningType: string;
  recommendedOpeningStyle: string;
  recommendedBackgroundDesign: string;
  recommendedBackgroundAnimation: string;
  // Concept Details
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
}

export const predefinedThemes: ThemePreset[] = [
  {
    id: 'royal-black-tie',
    name: 'Royal Black Tie',
    category: 'Lüks',
    template_id: 'royal-black-tie',
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
    template_id: 'rose-gold-romance',
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
    template_id: 'parisian-ivory',
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
    id: 'ottoman-burgundy',
    name: 'Ottoman Burgundy',
    category: 'Klasik',
    template_id: 'ottoman-burgundy',
    primary_color: '#d4b26f',
    text_color: '#420311',
    font_family: 'Cinzel',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#420311',
    envelope_bg_color: 'black-gold-velvet',
    envelope_flap_type: 'triangle',
    seal_type: 'monogram',
    seal_color: '#d4b26f',
    recommendedOpeningType: 'curtain',
    recommendedOpeningStyle: 'royal-burgundy',
    recommendedBackgroundDesign: 'black-gold-velvet',
    recommendedBackgroundAnimation: 'goldParticles',
    palette: {
      background: '#2b020a',
      card: '#ffffff',
      primary: '#420311',
      secondary: '#d4b26f',
      accent: '#ffd98f',
      text: '#420311',
      mutedText: '#874c58'
    },
    typography: {
      heading: 'Cinzel',
      body: 'Cormorant Garamond',
      accent: 'Great Vibes'
    },
    visualDetails: {
      border: 'baroque-pattern',
      seal: 'burgundy-seal',
      cardShape: 'royal-rounded',
      texture: 'fine-paper'
    }
  },
  {
    id: 'bohemian-garden',
    name: 'Bohemian Garden',
    category: 'Doğal',
    template_id: 'bohemian-garden',
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
    id: 'minimal-white-ceremony',
    name: 'Minimal White Ceremony',
    category: 'Minimalist',
    template_id: 'minimal-white-ceremony',
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
    template_id: 'luxury-marble-gold',
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
    template_id: 'moonlight-wedding',
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
    template_id: 'garden-of-roses',
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
    template_id: 'champagne-reception',
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
    template_id: 'classic-ivory-wedding',
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
    template_id: 'velvet-burgundy-night',
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
    id: 'modern-glass-wedding',
    name: 'Modern Glass Wedding',
    category: 'Modern',
    template_id: 'modern-glass-wedding',
    primary_color: '#8493a8',
    text_color: '#0f172a',
    font_family: 'Outfit',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#ffffff',
    envelope_bg_color: 'glass-blur-modern',
    envelope_flap_type: 'rounded',
    seal_type: 'ring',
    seal_color: '#8493a8',
    recommendedOpeningType: 'glass',
    recommendedOpeningStyle: 'glass-modern',
    recommendedBackgroundDesign: 'glass-blur-modern',
    recommendedBackgroundAnimation: 'pearlLight',
    palette: {
      background: '#edf2f7',
      card: 'rgba(255, 255, 255, 0.85)',
      primary: '#0f172a',
      secondary: '#cbd5e1',
      accent: '#f8fafc',
      text: '#0f172a',
      mutedText: '#475569'
    },
    typography: {
      heading: 'Outfit',
      body: 'Inter',
      accent: 'Parisienne'
    },
    visualDetails: {
      border: 'minimal-line',
      seal: 'glass-seal',
      cardShape: 'soft-rounded',
      texture: 'canvas'
    }
  },
  {
    id: 'santorini-blue',
    name: 'Santorini Blue',
    category: 'Modern',
    template_id: 'santorini-blue',
    primary_color: '#1e40af',
    text_color: '#1e3a8a',
    font_family: 'Inter',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#ffffff',
    envelope_bg_color: 'white-gold-marble',
    envelope_flap_type: 'rounded',
    seal_type: 'olive',
    seal_color: '#1e40af',
    recommendedOpeningType: 'envelope',
    recommendedOpeningStyle: 'minimal-white',
    recommendedBackgroundDesign: 'white-gold-marble',
    recommendedBackgroundAnimation: 'pearlLight',
    palette: {
      background: '#f0f4f8',
      card: '#ffffff',
      primary: '#1e40af',
      secondary: '#dbeafe',
      accent: '#eff6ff',
      text: '#1e3a8a',
      mutedText: '#3b82f6'
    },
    typography: {
      heading: 'Playfair Display',
      body: 'Inter',
      accent: 'Allura'
    },
    visualDetails: {
      border: 'minimal-line',
      seal: 'blue-seal',
      cardShape: 'rough-edges',
      texture: 'canvas'
    }
  },
  {
    id: 'golden-palace',
    name: 'Golden Palace',
    category: 'Lüks',
    template_id: 'golden-palace',
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
    id: 'lavender-garden',
    name: 'Lavender Garden',
    category: 'Doğal',
    template_id: 'lavender-garden',
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
  },
  {
    id: 'autumn-romance',
    name: 'Autumn Romance',
    category: 'Doğal',
    template_id: 'autumn-romance',
    primary_color: '#c2410c',
    text_color: '#431407',
    font_family: 'Lora',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#fff7ed',
    envelope_bg_color: 'bohemian-kraft',
    envelope_flap_type: 'rounded',
    seal_type: 'leaf',
    seal_color: '#c2410c',
    recommendedOpeningType: 'gardenGate',
    recommendedOpeningStyle: 'bohemian-garden',
    recommendedBackgroundDesign: 'bohemian-kraft',
    recommendedBackgroundAnimation: 'leafFall',
    palette: {
      background: '#fffbf7',
      card: '#ffffff',
      primary: '#c2410c',
      secondary: '#ffedd5',
      accent: '#fed7aa',
      text: '#431407',
      mutedText: '#9a3412'
    },
    typography: {
      heading: 'Playfair Display',
      body: 'Lora',
      accent: 'Allura'
    },
    visualDetails: {
      border: 'botanical-frame',
      seal: 'autumn-leaf',
      cardShape: 'rough-edges',
      texture: 'kraft'
    }
  },
  {
    id: 'winter-pearl',
    name: 'Winter Pearl',
    category: 'Minimalist',
    template_id: 'winter-pearl',
    primary_color: '#475569',
    text_color: '#0f172a',
    font_family: 'Outfit',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#ffffff',
    envelope_bg_color: 'minimal-white-paper',
    envelope_flap_type: 'classic',
    seal_type: 'ring',
    seal_color: '#475569',
    recommendedOpeningType: 'minimalFade',
    recommendedOpeningStyle: 'minimal-white',
    recommendedBackgroundDesign: 'minimal-white-paper',
    recommendedBackgroundAnimation: 'snowFall',
    palette: {
      background: '#f8fafc',
      card: '#ffffff',
      primary: '#0f172a',
      secondary: '#e2e8f0',
      accent: '#f1f5f9',
      text: '#0f172a',
      mutedText: '#64748b'
    },
    typography: {
      heading: 'Outfit',
      body: 'Inter',
      accent: 'Parisienne'
    },
    visualDetails: {
      border: 'minimal-line',
      seal: 'silver-ring',
      cardShape: 'clean-rectangle',
      texture: 'fine-paper'
    }
  },
  {
    id: 'black-velvet-luxury',
    name: 'Black Velvet Luxury',
    category: 'Lüks',
    template_id: 'black-velvet-luxury',
    primary_color: '#dfa857',
    text_color: '#f8fafc',
    font_family: 'Cormorant Garamond',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#080808',
    envelope_bg_color: 'black-gold-velvet',
    envelope_flap_type: 'triangle',
    seal_type: 'crown',
    seal_color: '#dfa857',
    recommendedOpeningType: 'door',
    recommendedOpeningStyle: 'black-gold-premium',
    recommendedBackgroundDesign: 'black-gold-velvet',
    recommendedBackgroundAnimation: 'goldParticles',
    palette: {
      background: '#040404',
      card: '#0c0c0c',
      primary: '#dfa857',
      secondary: '#1a1a1a',
      accent: '#262626',
      text: '#f8fafc',
      mutedText: '#cba36f'
    },
    typography: {
      heading: 'Playfair Display',
      body: 'Cormorant Garamond',
      accent: 'Great Vibes'
    },
    visualDetails: {
      border: 'double-gold',
      seal: 'gold-crest',
      cardShape: 'rounded-luxury',
      texture: 'dark-velvet'
    }
  },
  {
    id: 'soft-blush-ceremony',
    name: 'Soft Blush Ceremony',
    category: 'Minimalist',
    template_id: 'soft-blush-ceremony',
    primary_color: '#a37c72',
    text_color: '#3d2520',
    font_family: 'Inter',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#fff0ec',
    envelope_bg_color: 'rose-gold-silk',
    envelope_flap_type: 'rounded',
    seal_type: 'heart',
    seal_color: '#a37c72',
    recommendedOpeningType: 'glass',
    recommendedOpeningStyle: 'minimal-white',
    recommendedBackgroundDesign: 'rose-gold-silk',
    recommendedBackgroundAnimation: 'rosePetals',
    palette: {
      background: '#faf2f0',
      card: '#ffffff',
      primary: '#3d2520',
      secondary: '#ffdcd4',
      accent: '#fff2f0',
      text: '#3d2520',
      mutedText: '#7e625d'
    },
    typography: {
      heading: 'Outfit',
      body: 'Inter',
      accent: 'Parisienne'
    },
    visualDetails: {
      border: 'soft-rose-frame',
      seal: 'rose-monogram',
      cardShape: 'soft-rounded',
      texture: 'silk-paper'
    }
  },
  {
    id: 'emerald-royal',
    name: 'Emerald Royal',
    category: 'Lüks',
    template_id: 'emerald-royal',
    primary_color: '#d4af37',
    text_color: '#064e3b',
    font_family: 'Cormorant Garamond',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#064e3b',
    envelope_bg_color: 'black-gold-velvet',
    envelope_flap_type: 'pointed',
    seal_type: 'crown',
    seal_color: '#d4af37',
    recommendedOpeningType: 'door',
    recommendedOpeningStyle: 'black-gold-premium',
    recommendedBackgroundDesign: 'black-gold-velvet',
    recommendedBackgroundAnimation: 'goldParticles',
    palette: {
      background: '#042f24',
      card: '#ffffff',
      primary: '#064e3b',
      secondary: '#d4af37',
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
    id: 'cappadocia-sunset',
    name: 'Cappadocia Sunset',
    category: 'Doğal',
    template_id: 'cappadocia-sunset',
    primary_color: '#d97706',
    text_color: '#451a03',
    font_family: 'Lora',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#fef3c7',
    envelope_bg_color: 'bohemian-kraft',
    envelope_flap_type: 'rounded',
    seal_type: 'olive',
    seal_color: '#d97706',
    recommendedOpeningType: 'gardenGate',
    recommendedOpeningStyle: 'bohemian-garden',
    recommendedBackgroundDesign: 'bohemian-kraft',
    recommendedBackgroundAnimation: 'leafFall',
    palette: {
      background: '#fffbf0',
      card: '#ffffff',
      primary: '#451a03',
      secondary: '#fef3c7',
      accent: '#fde68a',
      text: '#451a03',
      mutedText: '#92400e'
    },
    typography: {
      heading: 'Playfair Display',
      body: 'Lora',
      accent: 'Allura'
    },
    visualDetails: {
      border: 'botanical-frame',
      seal: 'sunset-leaf',
      cardShape: 'rough-edges',
      texture: 'kraft'
    }
  },
  {
    id: 'istanbul-bosphorus',
    name: 'Istanbul Bosphorus',
    category: 'Lüks',
    template_id: 'istanbul-bosphorus',
    primary_color: '#cca43b',
    text_color: '#0f172a',
    font_family: 'Cinzel',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#0f172a',
    envelope_bg_color: 'navy-gold-night',
    envelope_flap_type: 'pointed',
    seal_type: 'crown',
    seal_color: '#cca43b',
    recommendedOpeningType: 'royalHall',
    recommendedOpeningStyle: 'navy-gold',
    recommendedBackgroundDesign: 'navy-gold-night',
    recommendedBackgroundAnimation: 'goldParticles',
    palette: {
      background: '#090f1e',
      card: '#ffffff',
      primary: '#0f172a',
      secondary: '#cca43b',
      accent: '#1e293b',
      text: '#0f172a',
      mutedText: '#475569'
    },
    typography: {
      heading: 'Cinzel',
      body: 'Cormorant Garamond',
      accent: 'Great Vibes'
    },
    visualDetails: {
      border: 'geometric-gold',
      seal: 'bosphorus-seal',
      cardShape: 'rounded-luxury',
      texture: 'marble'
    }
  },
  {
    id: 'elegant-beige-ceremony',
    name: 'Elegant Beige Ceremony',
    category: 'Minimalist',
    template_id: 'elegant-beige-ceremony',
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
  }
];
