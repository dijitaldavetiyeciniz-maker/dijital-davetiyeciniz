export interface ThemePreset {
  id: string;
  name: string;
  category: 'Modern' | 'Klasik' | 'Karanlık' | 'Minimalist' | 'Lüks' | 'Doğal';
  template_id: string;
  primary_color: string;
  text_color?: string;
  font_family: string; // Storing actual Google Font name
  background_image_url: string | null;
  use_envelope?: boolean;
  envelope_color?: string;
  envelope_bg_color?: string;
  envelope_flap_type?: string;
  seal_type?: string;
  seal_color?: string;
  entrance_type?: string;
  effect_type?: string;
}

export const predefinedThemes: ThemePreset[] = [
  {
    id: 'theme-1',
    name: 'Kraliyet Zümrüdü (Lüks & Asil)',
    category: 'Lüks',
    template_id: 'template1', // Royal classic-card
    primary_color: '#dfc384', // Gold
    text_color: '#064e3b', // Deep Emerald
    font_family: 'Cormorant Garamond',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#064e3b',
    envelope_bg_color: 'marble',
    envelope_flap_type: 'rounded',
    seal_type: 'crown',
    seal_color: '#dfc384',
    entrance_type: 'gate',
    effect_type: 'sparkles'
  },
  {
    id: 'theme-2',
    name: 'Gül Rüyası (Romantik Kaligrafi)',
    category: 'Doğal',
    template_id: 'template9', // Watercolor floral
    primary_color: '#be123c', // Deep Rose Red
    text_color: '#334155',
    font_family: 'Great Vibes',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#ffe4e6', // Soft blush pink
    envelope_bg_color: 'linen',
    envelope_flap_type: 'rounded',
    seal_type: 'rose',
    seal_color: '#be123c',
    entrance_type: 'envelope',
    effect_type: 'hearts'
  },
  {
    id: 'theme-3',
    name: 'Gece Yıldızları (Karanlık Galaksi)',
    category: 'Karanlık',
    template_id: 'template25', // Neon template
    primary_color: '#a855f7', // Electric Violet
    text_color: '#f8fafc',
    font_family: 'Montserrat',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#0f172a',
    envelope_bg_color: 'slate',
    envelope_flap_type: 'triangle',
    seal_type: 'sparkles',
    seal_color: '#a855f7',
    entrance_type: 'heart-fade',
    effect_type: 'sparkles'
  },
  {
    id: 'theme-4',
    name: 'Sessiz Lüks (Monokrom Minimalist)',
    category: 'Minimalist',
    template_id: 'template17', // Minimalist layout
    primary_color: '#0f172a', // Midnight Black
    text_color: '#1e293b',
    font_family: 'Outfit',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#ffffff',
    envelope_bg_color: 'linen',
    envelope_flap_type: 'square',
    seal_type: 'monogram',
    seal_color: '#0f172a',
    entrance_type: 'card',
    effect_type: ''
  },
  {
    id: 'theme-5',
    name: 'Toskana Güneşi (Vintage & Ahşap)',
    category: 'Doğal',
    template_id: 'template33', // Vintage template
    primary_color: '#b45309', // Terracotta Amber
    text_color: '#451a03',
    font_family: 'Playfair Display',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#fef3c7', // Sand color
    envelope_bg_color: 'wood',
    envelope_flap_type: 'triangle',
    seal_type: 'leaf',
    seal_color: '#b45309',
    entrance_type: 'ribbon',
    effect_type: 'bubbles'
  },
  {
    id: 'theme-6',
    name: 'Safir Asaleti (Lüks Kadife)',
    category: 'Lüks',
    template_id: 'template41', // Art Deco split-screen
    primary_color: '#dfc384',
    text_color: '#1e3a8a',
    font_family: 'Cinzel',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#1e3a8a', // Sapphire blue envelope
    envelope_bg_color: 'marble',
    envelope_flap_type: 'square',
    seal_type: 'crown',
    seal_color: '#dfc384',
    entrance_type: 'box',
    effect_type: 'sparkles'
  },
  {
    id: 'theme-7',
    name: 'Bahar Esintisi (Zarif Cursive)',
    category: 'Modern',
    template_id: 'template10',
    primary_color: '#db2777', // Soft Magenta Pink
    text_color: '#1e293b',
    font_family: 'Parisienne',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#fdf2f8',
    envelope_bg_color: 'linen',
    envelope_flap_type: 'rounded',
    seal_type: 'rose',
    seal_color: '#db2777',
    entrance_type: 'envelope',
    effect_type: 'bubbles'
  },
  {
    id: 'theme-8',
    name: 'Ege Dalgaları (Sahil & Keten)',
    category: 'Doğal',
    template_id: 'template12',
    primary_color: '#0284c7', // Aegean Blue
    text_color: '#0f172a',
    font_family: 'Dancing Script',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#e0f2fe',
    envelope_bg_color: 'linen',
    envelope_flap_type: 'rounded',
    seal_type: 'leaf',
    seal_color: '#0284c7',
    entrance_type: 'curtain',
    effect_type: 'bubbles'
  },
  {
    id: 'theme-9',
    name: 'İpek Perde Klasik (Bordo Kadife)',
    category: 'Klasik',
    template_id: 'template36',
    primary_color: '#dfc384',
    text_color: '#f8fafc',
    font_family: 'Prata',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#881337', // Velvet Burgundy
    envelope_bg_color: 'marble',
    envelope_flap_type: 'rounded',
    seal_type: 'crown',
    seal_color: '#dfc384',
    entrance_type: 'curtain',
    effect_type: 'sparkles'
  },
  {
    id: 'theme-10',
    name: 'Bohem Kır Düğünü (Eucalyptus)',
    category: 'Doğal',
    template_id: 'template34', // Polaroid
    primary_color: '#065f46', // Sage Green
    text_color: '#2d3748',
    font_family: 'Alex Brush',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#eae6df',
    envelope_bg_color: 'wood',
    envelope_flap_type: 'rounded',
    seal_type: 'leaf',
    seal_color: '#065f46',
    entrance_type: 'ribbon',
    effect_type: ''
  }
];
