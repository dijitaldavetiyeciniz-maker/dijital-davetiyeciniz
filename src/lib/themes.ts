export interface ThemePreset {
  id: string;
  name: string;
  category: 'Modern' | 'Klasik' | 'Karanlık' | 'Minimalist' | 'Lüks' | 'Doğal';
  template_id: 'template1' | 'template2' | 'template3' | 'template4' | 'template5';
  primary_color: string;
  font_family: 'sans' | 'serif' | 'mono';
  background_image_url: string | null;
}

export const predefinedThemes: ThemePreset[] = [
  // ---------------- TEMPLATE 1 (Cam Efektli Modern / Görselli) ----------------
  {
    id: 't1-001',
    name: 'Gül Kurusu Romantizmi',
    category: 'Modern',
    template_id: 'template1',
    primary_color: '#e11d48', // rose-600
    font_family: 'sans',
    background_image_url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2000&auto=format&fit=crop'
  },
  {
    id: 't1-002',
    name: 'Okyanus Esintisi',
    category: 'Modern',
    template_id: 'template1',
    primary_color: '#0284c7', // sky-600
    font_family: 'serif',
    background_image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop'
  },
  {
    id: 't1-003',
    name: 'Lavanta Rüyası',
    category: 'Modern',
    template_id: 'template1',
    primary_color: '#7c3aed', // violet-600
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 't1-004',
    name: 'Sonbahar Yaprakları',
    category: 'Doğal',
    template_id: 'template1',
    primary_color: '#d97706', // amber-600
    font_family: 'serif',
    background_image_url: 'https://images.unsplash.com/photo-1476820865390-c52aeebb9891?q=80&w=2000&auto=format&fit=crop'
  },

  // ---------------- TEMPLATE 2 (Karanlık / Neon Glow) ----------------
  {
    id: 't2-001',
    name: 'Gece Yarısı Mavisi',
    category: 'Karanlık',
    template_id: 'template2',
    primary_color: '#3b82f6', // blue-500
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 't2-002',
    name: 'Karanlık Orkide',
    category: 'Karanlık',
    template_id: 'template2',
    primary_color: '#a855f7', // purple-500
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 't2-003',
    name: 'Zümrüt Gecesi',
    category: 'Karanlık',
    template_id: 'template2',
    primary_color: '#10b981', // emerald-500
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 't2-004',
    name: 'Sıcak Ateş Böceği',
    category: 'Karanlık',
    template_id: 'template2',
    primary_color: '#f97316', // orange-500
    font_family: 'sans',
    background_image_url: null
  },

  // ---------------- TEMPLATE 3 (Rustik / Doğal / Kağıt Dokusu) ----------------
  {
    id: 't3-001',
    name: 'Bohem Zeytin Dalı',
    category: 'Doğal',
    template_id: 'template3',
    primary_color: '#4d7c0f', // lime-700
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 't3-002',
    name: 'Kahve Çekirdeği',
    category: 'Rustik',
    template_id: 'template3',
    primary_color: '#78350f', // amber-900
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 't3-003',
    name: 'Kurutulmuş Gül',
    category: 'Doğal',
    template_id: 'template3',
    primary_color: '#9f1239', // rose-900
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 't3-004',
    name: 'Soft Şeftali',
    category: 'Minimalist',
    template_id: 'template3',
    primary_color: '#c2410c', // orange-700
    font_family: 'sans',
    background_image_url: null
  },

  // ---------------- TEMPLATE 4 (Lüks / Kraliyet / Çerçeveli) ----------------
  {
    id: 't4-001',
    name: 'Kraliyet Altını',
    category: 'Lüks',
    template_id: 'template4',
    primary_color: '#d97706', // amber-600
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 't4-002',
    name: 'Pırlanta Grisi',
    category: 'Lüks',
    template_id: 'template4',
    primary_color: '#475569', // slate-600
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 't4-003',
    name: 'Lüks Bordo',
    category: 'Lüks',
    template_id: 'template4',
    primary_color: '#831843', // pink-900
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 't4-004',
    name: 'Safir Mavisi',
    category: 'Lüks',
    template_id: 'template4',
    primary_color: '#1d4ed8', // blue-700
    font_family: 'serif',
    background_image_url: null
  },

  // ---------------- TEMPLATE 5 (Minimalist / Dergi / Modern Siyah-Beyaz) ----------------
  {
    id: 't5-001',
    name: 'Vogue Siyahı',
    category: 'Minimalist',
    template_id: 'template5',
    primary_color: '#000000', // black
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 't5-002',
    name: 'Vogue Beyazı (Soft)',
    category: 'Minimalist',
    template_id: 'template5',
    primary_color: '#52525b', // zinc-600
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 't5-003',
    name: 'Lacivert Elegans',
    category: 'Minimalist',
    template_id: 'template5',
    primary_color: '#0f172a', // slate-900
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 't5-004',
    name: 'Kızıl Minimalizm',
    category: 'Minimalist',
    template_id: 'template5',
    primary_color: '#7f1d1d', // red-900
    font_family: 'serif',
    background_image_url: null
  }
];
