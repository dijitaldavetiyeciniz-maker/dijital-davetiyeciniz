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
  // Recommended animations
  recommendedOpeningType?: string;
  recommendedOpeningStyle?: string;
  recommendedBackgroundAnimation?: string;
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
    envelope_bg_color: 'marble',
    envelope_flap_type: 'triangle',
    seal_type: 'crown',
    seal_color: '#d6a84f',
    recommendedOpeningType: 'door',
    recommendedOpeningStyle: 'black-gold-premium',
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
    envelope_bg_color: 'linen',
    envelope_flap_type: 'rounded',
    seal_type: 'rose',
    seal_color: '#c98778',
    recommendedOpeningType: 'envelope',
    recommendedOpeningStyle: 'rose-gold-romantic',
    recommendedBackgroundAnimation: 'rosePetals',
    palette: {
      background: '#fff1ec',
      card: '#fffaf6',
      primary: '#f5d7ce',
      secondary: '#c98778',
      accent: '#fff5ef',
      text: '#70463f',
      mutedText: '#9c746d'
    },
    typography: {
      heading: 'Cormorant Garamond',
      body: 'Lora',
      accent: 'Allura'
    },
    visualDetails: {
      border: 'soft-rose-frame',
      seal: 'rose-gold-wax',
      cardShape: 'soft-rounded',
      texture: 'silk-paper'
    }
  },
  {
    id: 'parisian-ivory',
    name: 'Parisian Ivory',
    category: 'Klasik',
    template_id: 'parisian-ivory',
    primary_color: '#c5a880',
    text_color: '#2d2926',
    font_family: 'Lora',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#fcfaf6',
    envelope_bg_color: 'marble',
    envelope_flap_type: 'rounded',
    seal_type: 'crown',
    seal_color: '#c5a880',
    recommendedOpeningType: 'curtain',
    recommendedOpeningStyle: 'champagne-gold',
    recommendedBackgroundAnimation: 'pearlLight',
    palette: {
      background: '#fcfaf6',
      card: '#ffffff',
      primary: '#ffffff',
      secondary: '#c5a880',
      accent: '#eadeca',
      text: '#2d2926',
      mutedText: '#6e655f'
    },
    typography: {
      heading: 'Playfair Display',
      body: 'Lora',
      accent: 'Parisienne'
    },
    visualDetails: {
      border: 'double-gold',
      seal: 'classic-seal',
      cardShape: 'elegant-curve',
      texture: 'damask'
    }
  },
  {
    id: 'ottoman-burgundy',
    name: 'Ottoman Burgundy',
    category: 'Lüks',
    template_id: 'ottoman-burgundy',
    primary_color: '#800f2f',
    text_color: '#dfc384',
    font_family: 'Cormorant Garamond',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#38030f',
    envelope_bg_color: 'marble',
    envelope_flap_type: 'triangle',
    seal_type: 'crown',
    seal_color: '#dfc384',
    recommendedOpeningType: 'curtain',
    recommendedOpeningStyle: 'royal-burgundy',
    recommendedBackgroundAnimation: 'goldParticles',
    palette: {
      background: '#38030f',
      card: '#fffcf7',
      primary: '#800f2f',
      secondary: '#dfc384',
      accent: '#ffddb0',
      text: '#dfc384',
      mutedText: '#a48f65'
    },
    typography: {
      heading: 'Cinzel',
      body: 'Cormorant Garamond',
      accent: 'Great Vibes'
    },
    visualDetails: {
      border: 'baroque-pattern',
      seal: 'royal-wax',
      cardShape: 'royal-rounded',
      texture: 'dark-velvet'
    }
  },
  {
    id: 'bohemian-garden',
    name: 'Bohemian Garden',
    category: 'Doğal',
    template_id: 'bohemian-garden',
    primary_color: '#8fa17a',
    text_color: '#4a3925',
    font_family: 'Lato',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#f3eee7',
    envelope_bg_color: 'wood',
    envelope_flap_type: 'rounded',
    seal_type: 'leaf',
    seal_color: '#8fa17a',
    recommendedOpeningType: 'gardenGate',
    recommendedOpeningStyle: 'bohemian-garden',
    recommendedBackgroundAnimation: 'leafFall',
    palette: {
      background: '#f3eee7',
      card: '#ffffff',
      primary: '#ffffff',
      secondary: '#8fa17a',
      accent: '#d8c7a3',
      text: '#4a3925',
      mutedText: '#7a6750'
    },
    typography: {
      heading: 'Playfair Display',
      body: 'Lato',
      accent: 'Dancing Script'
    },
    visualDetails: {
      border: 'botanical-frame',
      seal: 'leaf-wax',
      cardShape: 'rough-edges',
      texture: 'kraft'
    }
  },
  {
    id: 'minimal-white-ceremony',
    name: 'Minimal White Ceremony',
    category: 'Minimalist',
    template_id: 'minimal-white-ceremony',
    primary_color: '#111111',
    text_color: '#3f3832',
    font_family: 'Inter',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#ffffff',
    envelope_bg_color: 'linen',
    envelope_flap_type: 'square',
    seal_type: 'monogram',
    seal_color: '#111111',
    recommendedOpeningType: 'minimalFade',
    recommendedOpeningStyle: 'minimal-white',
    recommendedBackgroundAnimation: 'pearlLight',
    palette: {
      background: '#faf7f2',
      card: '#ffffff',
      primary: '#ffffff',
      secondary: '#d8c7b2',
      accent: '#f5efe8',
      text: '#3f3832',
      mutedText: '#7b7066'
    },
    typography: {
      heading: 'Libre Baskerville',
      body: 'Inter',
      accent: 'Cormorant Garamond'
    },
    visualDetails: {
      border: 'minimal-line',
      seal: 'silver-monogram',
      cardShape: 'clean-rectangle',
      texture: 'fine-paper'
    }
  },
  {
    id: 'luxury-marble-gold',
    name: 'Luxury Marble Gold',
    category: 'Lüks',
    template_id: 'luxury-marble-gold',
    primary_color: '#c9a44d',
    text_color: '#4a3925',
    font_family: 'Montserrat',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#f1ede6',
    envelope_bg_color: 'marble',
    envelope_flap_type: 'square',
    seal_type: 'crown',
    seal_color: '#c9a44d',
    recommendedOpeningType: 'door',
    recommendedOpeningStyle: 'marble-gold',
    recommendedBackgroundAnimation: 'goldParticles',
    palette: {
      background: '#f1ede6',
      card: '#fffdf8',
      primary: '#ffffff',
      secondary: '#c9a44d',
      accent: '#e8e2d5',
      text: '#4a3925',
      mutedText: '#856f54'
    },
    typography: {
      heading: 'Cinzel',
      body: 'Montserrat',
      accent: 'Great Vibes'
    },
    visualDetails: {
      border: 'geometric-gold',
      seal: 'gold-wax',
      cardShape: 'rounded-luxury',
      texture: 'marble'
    }
  },
  {
    id: 'moonlight-wedding',
    name: 'Moonlight Wedding',
    category: 'Karanlık',
    template_id: 'moonlight-wedding',
    primary_color: '#d3aa4c',
    text_color: '#fff1cf',
    font_family: 'Lora',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#081225',
    envelope_bg_color: 'slate',
    envelope_flap_type: 'triangle',
    seal_type: 'sparkles',
    seal_color: '#d3aa4c',
    recommendedOpeningType: 'starryNight',
    recommendedOpeningStyle: 'navy-gold',
    recommendedBackgroundAnimation: 'stars',
    palette: {
      background: '#081225',
      card: '#0f1b36',
      primary: '#0f1b36',
      secondary: '#d3aa4c',
      accent: '#1e293b',
      text: '#fff1cf',
      mutedText: '#a4b1c9'
    },
    typography: {
      heading: 'Montserrat',
      body: 'Lora',
      accent: 'Arizonia'
    },
    visualDetails: {
      border: 'starlight-frame',
      seal: 'silver-seal',
      cardShape: 'soft-rounded',
      texture: 'dark-space'
    }
  },
  {
    id: 'garden-of-roses',
    name: 'Garden of Roses',
    category: 'Doğal',
    template_id: 'garden-of-roses',
    primary_color: '#d9a7b0',
    text_color: '#6b444c',
    font_family: 'Cormorant Garamond',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#fff3f5',
    envelope_bg_color: 'linen',
    envelope_flap_type: 'rounded',
    seal_type: 'rose',
    seal_color: '#d9a7b0',
    recommendedOpeningType: 'envelope',
    recommendedOpeningStyle: 'pastel-floral',
    recommendedBackgroundAnimation: 'rosePetals',
    palette: {
      background: '#fff3f5',
      card: '#fffafa',
      primary: '#fff3f5',
      secondary: '#d9a7b0',
      accent: '#f7d8df',
      text: '#6b444c',
      mutedText: '#9a757c'
    },
    typography: {
      heading: 'Lora',
      body: 'Cormorant Garamond',
      accent: 'Allura'
    },
    visualDetails: {
      border: 'watercolor-frame',
      seal: 'rose-seal',
      cardShape: 'elegant-curve',
      texture: 'canvas'
    }
  },
  {
    id: 'champagne-reception',
    name: 'Champagne Reception',
    category: 'Modern',
    template_id: 'champagne-reception',
    primary_color: '#c99b4e',
    text_color: '#5a3d22',
    font_family: 'Inter',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#f6ead9',
    envelope_bg_color: 'linen',
    envelope_flap_type: 'rounded',
    seal_type: 'monogram',
    seal_color: '#c99b4e',
    recommendedOpeningType: 'curtain',
    recommendedOpeningStyle: 'champagne-gold',
    recommendedBackgroundAnimation: 'goldParticles',
    palette: {
      background: '#f6ead9',
      card: '#fffaf2',
      primary: '#f6ead9',
      secondary: '#c99b4e',
      accent: '#ead8bd',
      text: '#5a3d22',
      mutedText: '#8f7762'
    },
    typography: {
      heading: 'Outfit',
      body: 'Inter',
      accent: 'Parisienne'
    },
    visualDetails: {
      border: 'modern-frame',
      seal: 'satin-seal',
      cardShape: 'rounded-luxury',
      texture: 'metallic'
    }
  }
];
