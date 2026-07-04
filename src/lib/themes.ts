export interface ThemePreset {
  id: string;
  name: string;
  category: 'Modern' | 'Klasik' | 'Karanlık' | 'Minimalist' | 'Lüks' | 'Doğal';
  template_id: string;
  primary_color: string;
  text_color?: string;
  font_family: 'sans' | 'serif' | 'mono';
  background_image_url: string | null;
  use_envelope?: boolean;
  envelope_color?: string;
  envelope_bg_color?: string;
  envelope_flap_type?: string;
  seal_type?: string;
  seal_color?: string;
  effect_type?: string;
}

export const predefinedThemes: ThemePreset[] = [
  {
    id: 'theme-1',
    name: 'Kraliyet Zümrüdü (Zarif & Lüks)',
    category: 'Lüks',
    template_id: 'template1',
    primary_color: '#d4af37', // Gold
    text_color: '#064e3b', // Deep Emerald
    font_family: 'serif',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#064e3b', // Emerald Envelope
    envelope_bg_color: 'marble',
    envelope_flap_type: 'rounded',
    seal_type: 'crown',
    seal_color: '#d4af37',
    effect_type: 'sparkles'
  },
  {
    id: 'theme-2',
    name: 'Gül Rüyası (Romantik Kaligrafi)',
    category: 'Doğal',
    template_id: 'template9', // Floral template
    primary_color: '#be123c', // Deep Rose Red
    text_color: '#334155',
    font_family: 'mono', // Calligraphy
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#ffe4e6', // Soft blush pink
    envelope_bg_color: 'linen',
    envelope_flap_type: 'rounded',
    seal_type: 'rose',
    seal_color: '#be123c',
    effect_type: 'hearts'
  },
  {
    id: 'theme-3',
    name: 'Gece Yıldızları (Karanlık Neon)',
    category: 'Karanlık',
    template_id: 'template25', // Neon template
    primary_color: '#a855f7', // Electric Violet
    text_color: '#f8fafc',
    font_family: 'sans',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#0f172a', // Midnight slate
    envelope_bg_color: 'slate',
    envelope_flap_type: 'triangle',
    seal_type: 'sparkles',
    seal_color: '#a855f7',
    effect_type: 'sparkles'
  },
  {
    id: 'theme-4',
    name: 'Sessiz Lüks (Monokrom Minimal)',
    category: 'Minimalist',
    template_id: 'template17', // Minimalist template
    primary_color: '#0f172a', // Midnight Black
    text_color: '#1e293b',
    font_family: 'sans',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#ffffff', // Pure white envelope
    envelope_bg_color: 'linen',
    envelope_flap_type: 'square',
    seal_type: 'monogram',
    seal_color: '#0f172a',
    effect_type: ''
  },
  {
    id: 'theme-5',
    name: 'Toskana Güneşi (Organik & Sıcak)',
    category: 'Doğal',
    template_id: 'template33', // Vintage paper layout
    primary_color: '#b45309', // Terracotta Amber
    text_color: '#451a03',
    font_family: 'serif',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#fef3c7', // Soft Sand
    envelope_bg_color: 'wood',
    envelope_flap_type: 'triangle',
    seal_type: 'leaf',
    seal_color: '#b45309',
    effect_type: 'bubbles'
  },
  {
    id: 'theme-6',
    name: 'Safir Asaleti (Royal Blue)',
    category: 'Lüks',
    template_id: 'template41', // Art Deco split-screen
    primary_color: '#dfc384', // Pale gold
    text_color: '#1e3a8a', // Deep sapphire blue
    font_family: 'serif',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#1e3a8a',
    envelope_bg_color: 'marble',
    envelope_flap_type: 'square',
    seal_type: 'crown',
    seal_color: '#dfc384',
    effect_type: 'sparkles'
  },
  {
    id: 'theme-7',
    name: 'Bahar Bahçesi (Soft Pastel)',
    category: 'Modern',
    template_id: 'template10', // Floral letter
    primary_color: '#db2777', // Soft Magenta Pink
    text_color: '#1e293b',
    font_family: 'mono',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#fdf2f8',
    envelope_bg_color: 'linen',
    envelope_flap_type: 'rounded',
    seal_type: 'rose',
    seal_color: '#db2777',
    effect_type: 'bubbles'
  },
  {
    id: 'theme-8',
    name: 'Bohem Esintisi (Sage & Sand)',
    category: 'Doğal',
    template_id: 'template34', // Polaroid layout
    primary_color: '#065f46', // Sage Green
    text_color: '#2d3748',
    font_family: 'serif',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#eae6df',
    envelope_bg_color: 'wood',
    envelope_flap_type: 'rounded',
    seal_type: 'leaf',
    seal_color: '#065f46',
    effect_type: ''
  },
  {
    id: 'theme-9',
    name: 'Lavanta Düşü (Zarif Kaligrafi)',
    category: 'Klasik',
    template_id: 'template6',
    primary_color: '#7c3aed', // Lavender Violet
    text_color: '#2e1065',
    font_family: 'mono',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#f5f3ff',
    envelope_bg_color: 'linen',
    envelope_flap_type: 'rounded',
    seal_type: 'heart',
    seal_color: '#7c3aed',
    effect_type: 'bubbles'
  },
  {
    id: 'theme-10',
    name: 'Kardelen Beyazı (Minimalist White)',
    category: 'Minimalist',
    template_id: 'template18',
    primary_color: '#1e293b',
    text_color: '#334155',
    font_family: 'sans',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#f8fafc',
    envelope_bg_color: 'marble',
    envelope_flap_type: 'square',
    seal_type: 'monogram',
    seal_color: '#475569',
    effect_type: 'snow'
  },
  {
    id: 'theme-11',
    name: 'Eskiz Defteri (Kraft & Çömlek)',
    category: 'Doğal',
    template_id: 'template35',
    primary_color: '#9a3412', // Terracotta
    text_color: '#431407',
    font_family: 'serif',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#fed7aa', // Kraft paper beige
    envelope_bg_color: 'wood',
    envelope_flap_type: 'triangle',
    seal_type: 'leaf',
    seal_color: '#9a3412',
    effect_type: ''
  },
  {
    id: 'theme-12',
    name: 'Bordo Aşkı (Lüks Kadife)',
    category: 'Lüks',
    template_id: 'template2',
    primary_color: '#dfc384',
    text_color: '#f8fafc',
    font_family: 'serif',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#881337', // Deep burgundy
    envelope_bg_color: 'marble',
    envelope_flap_type: 'rounded',
    seal_type: 'crown',
    seal_color: '#dfc384',
    effect_type: 'sparkles'
  },
  {
    id: 'theme-13',
    name: 'Nordik Gri (Clean Slate)',
    category: 'Modern',
    template_id: 'template19',
    primary_color: '#0f172a',
    text_color: '#334155',
    font_family: 'sans',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#e2e8f0',
    envelope_bg_color: 'concrete',
    envelope_flap_type: 'square',
    seal_type: 'sparkles',
    seal_color: '#475569',
    effect_type: ''
  },
  {
    id: 'theme-14',
    name: 'Büyülü Bahçe (Zümrüt & Gül)',
    category: 'Doğal',
    template_id: 'template11',
    primary_color: '#be123c',
    text_color: '#064e3b',
    font_family: 'mono',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#fdf2f8',
    envelope_bg_color: 'linen',
    envelope_flap_type: 'rounded',
    seal_type: 'rose',
    seal_color: '#be123c',
    effect_type: 'hearts'
  },
  {
    id: 'theme-15',
    name: 'Altın Varak (Luxury Gatsby)',
    category: 'Lüks',
    template_id: 'template8',
    primary_color: '#d4af37',
    text_color: '#1e293b',
    font_family: 'serif',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#1e293b', // Black gold theme
    envelope_bg_color: 'marble',
    envelope_flap_type: 'rounded',
    seal_type: 'crown',
    seal_color: '#d4af37',
    effect_type: 'sparkles'
  },
  {
    id: 'theme-16',
    name: 'Ege Esintisi (Mavi & Beyaz)',
    category: 'Klasik',
    template_id: 'template12',
    primary_color: '#0284c7', // Aegean Blue
    text_color: '#0f172a',
    font_family: 'sans',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#e0f2fe',
    envelope_bg_color: 'linen',
    envelope_flap_type: 'rounded',
    seal_type: 'leaf',
    seal_color: '#0284c7',
    effect_type: 'bubbles'
  },
  {
    id: 'theme-17',
    name: 'Vintage Parşömen (Klasik Mektup)',
    category: 'Klasik',
    template_id: 'template36',
    primary_color: '#7c2d12', // Sepia
    text_color: '#431407',
    font_family: 'serif',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#fed7aa',
    envelope_bg_color: 'wood',
    envelope_flap_type: 'triangle',
    seal_type: 'feather',
    seal_color: '#7c2d12',
    effect_type: ''
  },
  {
    id: 'theme-18',
    name: 'Kozmik Gece (Aşkın Işıltısı)',
    category: 'Karanlık',
    template_id: 'template26',
    primary_color: '#ec4899', // Pink neon
    text_color: '#f8fafc',
    font_family: 'mono',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#030712',
    envelope_bg_color: 'slate',
    envelope_flap_type: 'triangle',
    seal_type: 'heart',
    seal_color: '#ec4899',
    effect_type: 'hearts'
  },
  {
    id: 'theme-19',
    name: 'Çöl Güneşi (Sıcak & Minimal)',
    category: 'Minimalist',
    template_id: 'template20',
    primary_color: '#ea580c', // Orange
    text_color: '#27272a',
    font_family: 'sans',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#ffedd5',
    envelope_bg_color: 'wood',
    envelope_flap_type: 'square',
    seal_type: 'monogram',
    seal_color: '#ea580c',
    effect_type: ''
  },
  {
    id: 'theme-20',
    name: 'Kış Masalı (Silver & Snow)',
    category: 'Lüks',
    template_id: 'template42',
    primary_color: '#94a3b8', // Silver
    text_color: '#1e293b',
    font_family: 'serif',
    background_image_url: null,
    use_envelope: true,
    envelope_color: '#f1f5f9',
    envelope_bg_color: 'concrete',
    envelope_flap_type: 'square',
    seal_type: 'sparkles',
    seal_color: '#475569',
    effect_type: 'snow'
  }
];
