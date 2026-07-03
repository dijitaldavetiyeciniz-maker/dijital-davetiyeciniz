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
  {
    id: 'theme-1',
    name: 'Gül Rüyası 1',
    category: 'Modern',
    template_id: 'template1',
    primary_color: '#e11d48',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-2',
    name: 'Okyanus Esintisi 2',
    category: 'Klasik',
    template_id: 'template2',
    primary_color: '#0284c7',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-3',
    name: 'Lavanta Gecesi 3',
    category: 'Karanlık',
    template_id: 'template3',
    primary_color: '#7c3aed',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-4',
    name: 'Zümrüt Dalı 4',
    category: 'Minimalist',
    template_id: 'template4',
    primary_color: '#d97706',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-5',
    name: 'Ateş Çekirdeği 5',
    category: 'Lüks',
    template_id: 'template5',
    primary_color: '#16a34a',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-6',
    name: 'Zeytin Grisi 6',
    category: 'Doğal',
    template_id: 'template1',
    primary_color: '#dc2626',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-7',
    name: 'Kahve Siyahı 7',
    category: 'Modern',
    template_id: 'template2',
    primary_color: '#ea580c',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-8',
    name: 'Pırlanta Işıltısı 8',
    category: 'Klasik',
    template_id: 'template3',
    primary_color: '#65a30d',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-9',
    name: 'Safir Büyüsü 9',
    category: 'Karanlık',
    template_id: 'template4',
    primary_color: '#0d9488',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-10',
    name: 'Vogue Sessizliği 10',
    category: 'Minimalist',
    template_id: 'template5',
    primary_color: '#2563eb',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-11',
    name: 'Gece Yankısı 11',
    category: 'Lüks',
    template_id: 'template1',
    primary_color: '#4f46e5',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-12',
    name: 'Güneş Gölgesi 12',
    category: 'Doğal',
    template_id: 'template2',
    primary_color: '#9333ea',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-13',
    name: 'Ay Masalı 13',
    category: 'Modern',
    template_id: 'template3',
    primary_color: '#c026d3',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-14',
    name: 'Yıldız Şiiri 14',
    category: 'Klasik',
    template_id: 'template4',
    primary_color: '#db2777',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-15',
    name: 'Bahar Efsanesi 15',
    category: 'Karanlık',
    template_id: 'template5',
    primary_color: '#475569',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-16',
    name: 'Güz Rüyası 16',
    category: 'Minimalist',
    template_id: 'template1',
    primary_color: '#52525b',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-17',
    name: 'Kış Esintisi 17',
    category: 'Lüks',
    template_id: 'template2',
    primary_color: '#000000',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-18',
    name: 'Gül Gecesi 18',
    category: 'Doğal',
    template_id: 'template3',
    primary_color: '#1c1917',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-19',
    name: 'Okyanus Dalı 19',
    category: 'Modern',
    template_id: 'template4',
    primary_color: '#78350f',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-20',
    name: 'Lavanta Çekirdeği 20',
    category: 'Klasik',
    template_id: 'template5',
    primary_color: '#831843',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-21',
    name: 'Zümrüt Grisi 21',
    category: 'Karanlık',
    template_id: 'template1',
    primary_color: '#064e3b',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-22',
    name: 'Ateş Siyahı 22',
    category: 'Minimalist',
    template_id: 'template2',
    primary_color: '#1e3a8a',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-23',
    name: 'Zeytin Işıltısı 23',
    category: 'Lüks',
    template_id: 'template3',
    primary_color: '#312e81',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-24',
    name: 'Kahve Büyüsü 24',
    category: 'Doğal',
    template_id: 'template4',
    primary_color: '#e11d48',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-25',
    name: 'Pırlanta Sessizliği 25',
    category: 'Modern',
    template_id: 'template5',
    primary_color: '#0284c7',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-26',
    name: 'Safir Yankısı 26',
    category: 'Klasik',
    template_id: 'template1',
    primary_color: '#7c3aed',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-27',
    name: 'Vogue Gölgesi 27',
    category: 'Karanlık',
    template_id: 'template2',
    primary_color: '#d97706',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-28',
    name: 'Gece Masalı 28',
    category: 'Minimalist',
    template_id: 'template3',
    primary_color: '#16a34a',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-29',
    name: 'Güneş Şiiri 29',
    category: 'Lüks',
    template_id: 'template4',
    primary_color: '#dc2626',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-30',
    name: 'Ay Efsanesi 30',
    category: 'Doğal',
    template_id: 'template5',
    primary_color: '#ea580c',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-31',
    name: 'Yıldız Rüyası 31',
    category: 'Modern',
    template_id: 'template1',
    primary_color: '#65a30d',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-32',
    name: 'Bahar Esintisi 32',
    category: 'Klasik',
    template_id: 'template2',
    primary_color: '#0d9488',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-33',
    name: 'Güz Gecesi 33',
    category: 'Karanlık',
    template_id: 'template3',
    primary_color: '#2563eb',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-34',
    name: 'Kış Dalı 34',
    category: 'Minimalist',
    template_id: 'template4',
    primary_color: '#4f46e5',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-35',
    name: 'Gül Çekirdeği 35',
    category: 'Lüks',
    template_id: 'template5',
    primary_color: '#9333ea',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-36',
    name: 'Okyanus Grisi 36',
    category: 'Doğal',
    template_id: 'template1',
    primary_color: '#c026d3',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-37',
    name: 'Lavanta Siyahı 37',
    category: 'Modern',
    template_id: 'template2',
    primary_color: '#db2777',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-38',
    name: 'Zümrüt Işıltısı 38',
    category: 'Klasik',
    template_id: 'template3',
    primary_color: '#475569',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-39',
    name: 'Ateş Büyüsü 39',
    category: 'Karanlık',
    template_id: 'template4',
    primary_color: '#52525b',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-40',
    name: 'Zeytin Sessizliği 40',
    category: 'Minimalist',
    template_id: 'template5',
    primary_color: '#000000',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-41',
    name: 'Kahve Yankısı 41',
    category: 'Lüks',
    template_id: 'template1',
    primary_color: '#1c1917',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-42',
    name: 'Pırlanta Gölgesi 42',
    category: 'Doğal',
    template_id: 'template2',
    primary_color: '#78350f',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-43',
    name: 'Safir Masalı 43',
    category: 'Modern',
    template_id: 'template3',
    primary_color: '#831843',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-44',
    name: 'Vogue Şiiri 44',
    category: 'Klasik',
    template_id: 'template4',
    primary_color: '#064e3b',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-45',
    name: 'Gece Efsanesi 45',
    category: 'Karanlık',
    template_id: 'template5',
    primary_color: '#1e3a8a',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-46',
    name: 'Güneş Rüyası 46',
    category: 'Minimalist',
    template_id: 'template1',
    primary_color: '#312e81',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-47',
    name: 'Ay Esintisi 47',
    category: 'Lüks',
    template_id: 'template2',
    primary_color: '#e11d48',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-48',
    name: 'Yıldız Gecesi 48',
    category: 'Doğal',
    template_id: 'template3',
    primary_color: '#0284c7',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-49',
    name: 'Bahar Dalı 49',
    category: 'Modern',
    template_id: 'template4',
    primary_color: '#7c3aed',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-50',
    name: 'Güz Çekirdeği 50',
    category: 'Klasik',
    template_id: 'template5',
    primary_color: '#d97706',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-51',
    name: 'Kış Grisi 51',
    category: 'Karanlık',
    template_id: 'template1',
    primary_color: '#16a34a',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-52',
    name: 'Gül Siyahı 52',
    category: 'Minimalist',
    template_id: 'template2',
    primary_color: '#dc2626',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-53',
    name: 'Okyanus Işıltısı 53',
    category: 'Lüks',
    template_id: 'template3',
    primary_color: '#ea580c',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-54',
    name: 'Lavanta Büyüsü 54',
    category: 'Doğal',
    template_id: 'template4',
    primary_color: '#65a30d',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-55',
    name: 'Zümrüt Sessizliği 55',
    category: 'Modern',
    template_id: 'template5',
    primary_color: '#0d9488',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-56',
    name: 'Ateş Yankısı 56',
    category: 'Klasik',
    template_id: 'template1',
    primary_color: '#2563eb',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-57',
    name: 'Zeytin Gölgesi 57',
    category: 'Karanlık',
    template_id: 'template2',
    primary_color: '#4f46e5',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-58',
    name: 'Kahve Masalı 58',
    category: 'Minimalist',
    template_id: 'template3',
    primary_color: '#9333ea',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-59',
    name: 'Pırlanta Şiiri 59',
    category: 'Lüks',
    template_id: 'template4',
    primary_color: '#c026d3',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-60',
    name: 'Safir Efsanesi 60',
    category: 'Doğal',
    template_id: 'template5',
    primary_color: '#db2777',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-61',
    name: 'Vogue Rüyası 61',
    category: 'Modern',
    template_id: 'template1',
    primary_color: '#475569',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-62',
    name: 'Gece Esintisi 62',
    category: 'Klasik',
    template_id: 'template2',
    primary_color: '#52525b',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-63',
    name: 'Güneş Gecesi 63',
    category: 'Karanlık',
    template_id: 'template3',
    primary_color: '#000000',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-64',
    name: 'Ay Dalı 64',
    category: 'Minimalist',
    template_id: 'template4',
    primary_color: '#1c1917',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-65',
    name: 'Yıldız Çekirdeği 65',
    category: 'Lüks',
    template_id: 'template5',
    primary_color: '#78350f',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-66',
    name: 'Bahar Grisi 66',
    category: 'Doğal',
    template_id: 'template1',
    primary_color: '#831843',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-67',
    name: 'Güz Siyahı 67',
    category: 'Modern',
    template_id: 'template2',
    primary_color: '#064e3b',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-68',
    name: 'Kış Işıltısı 68',
    category: 'Klasik',
    template_id: 'template3',
    primary_color: '#1e3a8a',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-69',
    name: 'Gül Büyüsü 69',
    category: 'Karanlık',
    template_id: 'template4',
    primary_color: '#312e81',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-70',
    name: 'Okyanus Sessizliği 70',
    category: 'Minimalist',
    template_id: 'template5',
    primary_color: '#e11d48',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-71',
    name: 'Lavanta Yankısı 71',
    category: 'Lüks',
    template_id: 'template1',
    primary_color: '#0284c7',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-72',
    name: 'Zümrüt Gölgesi 72',
    category: 'Doğal',
    template_id: 'template2',
    primary_color: '#7c3aed',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-73',
    name: 'Ateş Masalı 73',
    category: 'Modern',
    template_id: 'template3',
    primary_color: '#d97706',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-74',
    name: 'Zeytin Şiiri 74',
    category: 'Klasik',
    template_id: 'template4',
    primary_color: '#16a34a',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-75',
    name: 'Kahve Efsanesi 75',
    category: 'Karanlık',
    template_id: 'template5',
    primary_color: '#dc2626',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-76',
    name: 'Pırlanta Rüyası 76',
    category: 'Minimalist',
    template_id: 'template1',
    primary_color: '#ea580c',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-77',
    name: 'Safir Esintisi 77',
    category: 'Lüks',
    template_id: 'template2',
    primary_color: '#65a30d',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-78',
    name: 'Vogue Gecesi 78',
    category: 'Doğal',
    template_id: 'template3',
    primary_color: '#0d9488',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-79',
    name: 'Gece Dalı 79',
    category: 'Modern',
    template_id: 'template4',
    primary_color: '#2563eb',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-80',
    name: 'Güneş Çekirdeği 80',
    category: 'Klasik',
    template_id: 'template5',
    primary_color: '#4f46e5',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-81',
    name: 'Ay Grisi 81',
    category: 'Karanlık',
    template_id: 'template1',
    primary_color: '#9333ea',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-82',
    name: 'Yıldız Siyahı 82',
    category: 'Minimalist',
    template_id: 'template2',
    primary_color: '#c026d3',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-83',
    name: 'Bahar Işıltısı 83',
    category: 'Lüks',
    template_id: 'template3',
    primary_color: '#db2777',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-84',
    name: 'Güz Büyüsü 84',
    category: 'Doğal',
    template_id: 'template4',
    primary_color: '#475569',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-85',
    name: 'Kış Sessizliği 85',
    category: 'Modern',
    template_id: 'template5',
    primary_color: '#52525b',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-86',
    name: 'Gül Yankısı 86',
    category: 'Klasik',
    template_id: 'template1',
    primary_color: '#000000',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-87',
    name: 'Okyanus Gölgesi 87',
    category: 'Karanlık',
    template_id: 'template2',
    primary_color: '#1c1917',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-88',
    name: 'Lavanta Masalı 88',
    category: 'Minimalist',
    template_id: 'template3',
    primary_color: '#78350f',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-89',
    name: 'Zümrüt Şiiri 89',
    category: 'Lüks',
    template_id: 'template4',
    primary_color: '#831843',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-90',
    name: 'Ateş Efsanesi 90',
    category: 'Doğal',
    template_id: 'template5',
    primary_color: '#064e3b',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-91',
    name: 'Zeytin Rüyası 91',
    category: 'Modern',
    template_id: 'template1',
    primary_color: '#1e3a8a',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-92',
    name: 'Kahve Esintisi 92',
    category: 'Klasik',
    template_id: 'template2',
    primary_color: '#312e81',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-93',
    name: 'Pırlanta Gecesi 93',
    category: 'Karanlık',
    template_id: 'template3',
    primary_color: '#e11d48',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-94',
    name: 'Safir Dalı 94',
    category: 'Minimalist',
    template_id: 'template4',
    primary_color: '#0284c7',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-95',
    name: 'Vogue Çekirdeği 95',
    category: 'Lüks',
    template_id: 'template5',
    primary_color: '#7c3aed',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-96',
    name: 'Gece Grisi 96',
    category: 'Doğal',
    template_id: 'template1',
    primary_color: '#d97706',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-97',
    name: 'Güneş Siyahı 97',
    category: 'Modern',
    template_id: 'template2',
    primary_color: '#16a34a',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-98',
    name: 'Ay Işıltısı 98',
    category: 'Klasik',
    template_id: 'template3',
    primary_color: '#dc2626',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-99',
    name: 'Yıldız Büyüsü 99',
    category: 'Karanlık',
    template_id: 'template4',
    primary_color: '#ea580c',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-100',
    name: 'Bahar Sessizliği 100',
    category: 'Minimalist',
    template_id: 'template5',
    primary_color: '#65a30d',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-101',
    name: 'Güz Yankısı 101',
    category: 'Lüks',
    template_id: 'template1',
    primary_color: '#0d9488',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-102',
    name: 'Kış Gölgesi 102',
    category: 'Doğal',
    template_id: 'template2',
    primary_color: '#2563eb',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-103',
    name: 'Gül Masalı 103',
    category: 'Modern',
    template_id: 'template3',
    primary_color: '#4f46e5',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-104',
    name: 'Okyanus Şiiri 104',
    category: 'Klasik',
    template_id: 'template4',
    primary_color: '#9333ea',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-105',
    name: 'Lavanta Efsanesi 105',
    category: 'Karanlık',
    template_id: 'template5',
    primary_color: '#c026d3',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-106',
    name: 'Zümrüt Rüyası 106',
    category: 'Minimalist',
    template_id: 'template1',
    primary_color: '#db2777',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-107',
    name: 'Ateş Esintisi 107',
    category: 'Lüks',
    template_id: 'template2',
    primary_color: '#475569',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-108',
    name: 'Zeytin Gecesi 108',
    category: 'Doğal',
    template_id: 'template3',
    primary_color: '#52525b',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-109',
    name: 'Kahve Dalı 109',
    category: 'Modern',
    template_id: 'template4',
    primary_color: '#000000',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-110',
    name: 'Pırlanta Çekirdeği 110',
    category: 'Klasik',
    template_id: 'template5',
    primary_color: '#1c1917',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-111',
    name: 'Safir Grisi 111',
    category: 'Karanlık',
    template_id: 'template1',
    primary_color: '#78350f',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-112',
    name: 'Vogue Siyahı 112',
    category: 'Minimalist',
    template_id: 'template2',
    primary_color: '#831843',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-113',
    name: 'Gece Işıltısı 113',
    category: 'Lüks',
    template_id: 'template3',
    primary_color: '#064e3b',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-114',
    name: 'Güneş Büyüsü 114',
    category: 'Doğal',
    template_id: 'template4',
    primary_color: '#1e3a8a',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-115',
    name: 'Ay Sessizliği 115',
    category: 'Modern',
    template_id: 'template5',
    primary_color: '#312e81',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-116',
    name: 'Yıldız Yankısı 116',
    category: 'Klasik',
    template_id: 'template1',
    primary_color: '#e11d48',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-117',
    name: 'Bahar Gölgesi 117',
    category: 'Karanlık',
    template_id: 'template2',
    primary_color: '#0284c7',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-118',
    name: 'Güz Masalı 118',
    category: 'Minimalist',
    template_id: 'template3',
    primary_color: '#7c3aed',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-119',
    name: 'Kış Şiiri 119',
    category: 'Lüks',
    template_id: 'template4',
    primary_color: '#d97706',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-120',
    name: 'Gül Efsanesi 120',
    category: 'Doğal',
    template_id: 'template5',
    primary_color: '#16a34a',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-121',
    name: 'Okyanus Rüyası 121',
    category: 'Modern',
    template_id: 'template1',
    primary_color: '#dc2626',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-122',
    name: 'Lavanta Esintisi 122',
    category: 'Klasik',
    template_id: 'template2',
    primary_color: '#ea580c',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-123',
    name: 'Zümrüt Gecesi 123',
    category: 'Karanlık',
    template_id: 'template3',
    primary_color: '#65a30d',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-124',
    name: 'Ateş Dalı 124',
    category: 'Minimalist',
    template_id: 'template4',
    primary_color: '#0d9488',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-125',
    name: 'Zeytin Çekirdeği 125',
    category: 'Lüks',
    template_id: 'template5',
    primary_color: '#2563eb',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-126',
    name: 'Kahve Grisi 126',
    category: 'Doğal',
    template_id: 'template1',
    primary_color: '#4f46e5',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-127',
    name: 'Pırlanta Siyahı 127',
    category: 'Modern',
    template_id: 'template2',
    primary_color: '#9333ea',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-128',
    name: 'Safir Işıltısı 128',
    category: 'Klasik',
    template_id: 'template3',
    primary_color: '#c026d3',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-129',
    name: 'Vogue Büyüsü 129',
    category: 'Karanlık',
    template_id: 'template4',
    primary_color: '#db2777',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-130',
    name: 'Gece Sessizliği 130',
    category: 'Minimalist',
    template_id: 'template5',
    primary_color: '#475569',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-131',
    name: 'Güneş Yankısı 131',
    category: 'Lüks',
    template_id: 'template1',
    primary_color: '#52525b',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-132',
    name: 'Ay Gölgesi 132',
    category: 'Doğal',
    template_id: 'template2',
    primary_color: '#000000',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-133',
    name: 'Yıldız Masalı 133',
    category: 'Modern',
    template_id: 'template3',
    primary_color: '#1c1917',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-134',
    name: 'Bahar Şiiri 134',
    category: 'Klasik',
    template_id: 'template4',
    primary_color: '#78350f',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-135',
    name: 'Güz Efsanesi 135',
    category: 'Karanlık',
    template_id: 'template5',
    primary_color: '#831843',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-136',
    name: 'Kış Rüyası 136',
    category: 'Minimalist',
    template_id: 'template1',
    primary_color: '#064e3b',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-137',
    name: 'Gül Esintisi 137',
    category: 'Lüks',
    template_id: 'template2',
    primary_color: '#1e3a8a',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-138',
    name: 'Okyanus Gecesi 138',
    category: 'Doğal',
    template_id: 'template3',
    primary_color: '#312e81',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-139',
    name: 'Lavanta Dalı 139',
    category: 'Modern',
    template_id: 'template4',
    primary_color: '#e11d48',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-140',
    name: 'Zümrüt Çekirdeği 140',
    category: 'Klasik',
    template_id: 'template5',
    primary_color: '#0284c7',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-141',
    name: 'Ateş Grisi 141',
    category: 'Karanlık',
    template_id: 'template1',
    primary_color: '#7c3aed',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-142',
    name: 'Zeytin Siyahı 142',
    category: 'Minimalist',
    template_id: 'template2',
    primary_color: '#d97706',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-143',
    name: 'Kahve Işıltısı 143',
    category: 'Lüks',
    template_id: 'template3',
    primary_color: '#16a34a',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-144',
    name: 'Pırlanta Büyüsü 144',
    category: 'Doğal',
    template_id: 'template4',
    primary_color: '#dc2626',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-145',
    name: 'Safir Sessizliği 145',
    category: 'Modern',
    template_id: 'template5',
    primary_color: '#ea580c',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-146',
    name: 'Vogue Yankısı 146',
    category: 'Klasik',
    template_id: 'template1',
    primary_color: '#65a30d',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-147',
    name: 'Gece Gölgesi 147',
    category: 'Karanlık',
    template_id: 'template2',
    primary_color: '#0d9488',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-148',
    name: 'Güneş Masalı 148',
    category: 'Minimalist',
    template_id: 'template3',
    primary_color: '#2563eb',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-149',
    name: 'Ay Şiiri 149',
    category: 'Lüks',
    template_id: 'template4',
    primary_color: '#4f46e5',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-150',
    name: 'Yıldız Efsanesi 150',
    category: 'Doğal',
    template_id: 'template5',
    primary_color: '#9333ea',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-151',
    name: 'Bahar Rüyası 151',
    category: 'Modern',
    template_id: 'template1',
    primary_color: '#c026d3',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-152',
    name: 'Güz Esintisi 152',
    category: 'Klasik',
    template_id: 'template2',
    primary_color: '#db2777',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-153',
    name: 'Kış Gecesi 153',
    category: 'Karanlık',
    template_id: 'template3',
    primary_color: '#475569',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-154',
    name: 'Gül Dalı 154',
    category: 'Minimalist',
    template_id: 'template4',
    primary_color: '#52525b',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-155',
    name: 'Okyanus Çekirdeği 155',
    category: 'Lüks',
    template_id: 'template5',
    primary_color: '#000000',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-156',
    name: 'Lavanta Grisi 156',
    category: 'Doğal',
    template_id: 'template1',
    primary_color: '#1c1917',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-157',
    name: 'Zümrüt Siyahı 157',
    category: 'Modern',
    template_id: 'template2',
    primary_color: '#78350f',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-158',
    name: 'Ateş Işıltısı 158',
    category: 'Klasik',
    template_id: 'template3',
    primary_color: '#831843',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-159',
    name: 'Zeytin Büyüsü 159',
    category: 'Karanlık',
    template_id: 'template4',
    primary_color: '#064e3b',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-160',
    name: 'Kahve Sessizliği 160',
    category: 'Minimalist',
    template_id: 'template5',
    primary_color: '#1e3a8a',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-161',
    name: 'Pırlanta Yankısı 161',
    category: 'Lüks',
    template_id: 'template1',
    primary_color: '#312e81',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-162',
    name: 'Safir Gölgesi 162',
    category: 'Doğal',
    template_id: 'template2',
    primary_color: '#e11d48',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-163',
    name: 'Vogue Masalı 163',
    category: 'Modern',
    template_id: 'template3',
    primary_color: '#0284c7',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-164',
    name: 'Gece Şiiri 164',
    category: 'Klasik',
    template_id: 'template4',
    primary_color: '#7c3aed',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-165',
    name: 'Güneş Efsanesi 165',
    category: 'Karanlık',
    template_id: 'template5',
    primary_color: '#d97706',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-166',
    name: 'Ay Rüyası 166',
    category: 'Minimalist',
    template_id: 'template1',
    primary_color: '#16a34a',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-167',
    name: 'Yıldız Esintisi 167',
    category: 'Lüks',
    template_id: 'template2',
    primary_color: '#dc2626',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-168',
    name: 'Bahar Gecesi 168',
    category: 'Doğal',
    template_id: 'template3',
    primary_color: '#ea580c',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-169',
    name: 'Güz Dalı 169',
    category: 'Modern',
    template_id: 'template4',
    primary_color: '#65a30d',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-170',
    name: 'Kış Çekirdeği 170',
    category: 'Klasik',
    template_id: 'template5',
    primary_color: '#0d9488',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-171',
    name: 'Gül Grisi 171',
    category: 'Karanlık',
    template_id: 'template1',
    primary_color: '#2563eb',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-172',
    name: 'Okyanus Siyahı 172',
    category: 'Minimalist',
    template_id: 'template2',
    primary_color: '#4f46e5',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-173',
    name: 'Lavanta Işıltısı 173',
    category: 'Lüks',
    template_id: 'template3',
    primary_color: '#9333ea',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-174',
    name: 'Zümrüt Büyüsü 174',
    category: 'Doğal',
    template_id: 'template4',
    primary_color: '#c026d3',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-175',
    name: 'Ateş Sessizliği 175',
    category: 'Modern',
    template_id: 'template5',
    primary_color: '#db2777',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-176',
    name: 'Zeytin Yankısı 176',
    category: 'Klasik',
    template_id: 'template1',
    primary_color: '#475569',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-177',
    name: 'Kahve Gölgesi 177',
    category: 'Karanlık',
    template_id: 'template2',
    primary_color: '#52525b',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-178',
    name: 'Pırlanta Masalı 178',
    category: 'Minimalist',
    template_id: 'template3',
    primary_color: '#000000',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-179',
    name: 'Safir Şiiri 179',
    category: 'Lüks',
    template_id: 'template4',
    primary_color: '#1c1917',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-180',
    name: 'Vogue Efsanesi 180',
    category: 'Doğal',
    template_id: 'template5',
    primary_color: '#78350f',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-181',
    name: 'Gece Rüyası 181',
    category: 'Modern',
    template_id: 'template1',
    primary_color: '#831843',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-182',
    name: 'Güneş Esintisi 182',
    category: 'Klasik',
    template_id: 'template2',
    primary_color: '#064e3b',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-183',
    name: 'Ay Gecesi 183',
    category: 'Karanlık',
    template_id: 'template3',
    primary_color: '#1e3a8a',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-184',
    name: 'Yıldız Dalı 184',
    category: 'Minimalist',
    template_id: 'template4',
    primary_color: '#312e81',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-185',
    name: 'Bahar Çekirdeği 185',
    category: 'Lüks',
    template_id: 'template5',
    primary_color: '#e11d48',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-186',
    name: 'Güz Grisi 186',
    category: 'Doğal',
    template_id: 'template1',
    primary_color: '#0284c7',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-187',
    name: 'Kış Siyahı 187',
    category: 'Modern',
    template_id: 'template2',
    primary_color: '#7c3aed',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-188',
    name: 'Gül Işıltısı 188',
    category: 'Klasik',
    template_id: 'template3',
    primary_color: '#d97706',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-189',
    name: 'Okyanus Büyüsü 189',
    category: 'Karanlık',
    template_id: 'template4',
    primary_color: '#16a34a',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-190',
    name: 'Lavanta Sessizliği 190',
    category: 'Minimalist',
    template_id: 'template5',
    primary_color: '#dc2626',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-191',
    name: 'Zümrüt Yankısı 191',
    category: 'Lüks',
    template_id: 'template1',
    primary_color: '#ea580c',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-192',
    name: 'Ateş Gölgesi 192',
    category: 'Doğal',
    template_id: 'template2',
    primary_color: '#65a30d',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-193',
    name: 'Zeytin Masalı 193',
    category: 'Modern',
    template_id: 'template3',
    primary_color: '#0d9488',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-194',
    name: 'Kahve Şiiri 194',
    category: 'Klasik',
    template_id: 'template4',
    primary_color: '#2563eb',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-195',
    name: 'Pırlanta Efsanesi 195',
    category: 'Karanlık',
    template_id: 'template5',
    primary_color: '#4f46e5',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-196',
    name: 'Safir Rüyası 196',
    category: 'Minimalist',
    template_id: 'template1',
    primary_color: '#9333ea',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-197',
    name: 'Vogue Esintisi 197',
    category: 'Lüks',
    template_id: 'template2',
    primary_color: '#c026d3',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-198',
    name: 'Gece Gecesi 198',
    category: 'Doğal',
    template_id: 'template3',
    primary_color: '#db2777',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-199',
    name: 'Güneş Dalı 199',
    category: 'Modern',
    template_id: 'template4',
    primary_color: '#475569',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-200',
    name: 'Ay Çekirdeği 200',
    category: 'Klasik',
    template_id: 'template5',
    primary_color: '#52525b',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-201',
    name: 'Yıldız Grisi 201',
    category: 'Karanlık',
    template_id: 'template1',
    primary_color: '#000000',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-202',
    name: 'Bahar Siyahı 202',
    category: 'Minimalist',
    template_id: 'template2',
    primary_color: '#1c1917',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-203',
    name: 'Güz Işıltısı 203',
    category: 'Lüks',
    template_id: 'template3',
    primary_color: '#78350f',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-204',
    name: 'Kış Büyüsü 204',
    category: 'Doğal',
    template_id: 'template4',
    primary_color: '#831843',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-205',
    name: 'Gül Sessizliği 205',
    category: 'Modern',
    template_id: 'template5',
    primary_color: '#064e3b',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-206',
    name: 'Okyanus Yankısı 206',
    category: 'Klasik',
    template_id: 'template1',
    primary_color: '#1e3a8a',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-207',
    name: 'Lavanta Gölgesi 207',
    category: 'Karanlık',
    template_id: 'template2',
    primary_color: '#312e81',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-208',
    name: 'Zümrüt Masalı 208',
    category: 'Minimalist',
    template_id: 'template3',
    primary_color: '#e11d48',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-209',
    name: 'Ateş Şiiri 209',
    category: 'Lüks',
    template_id: 'template4',
    primary_color: '#0284c7',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-210',
    name: 'Zeytin Efsanesi 210',
    category: 'Doğal',
    template_id: 'template5',
    primary_color: '#7c3aed',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-211',
    name: 'Kahve Rüyası 211',
    category: 'Modern',
    template_id: 'template1',
    primary_color: '#d97706',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-212',
    name: 'Pırlanta Esintisi 212',
    category: 'Klasik',
    template_id: 'template2',
    primary_color: '#16a34a',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-213',
    name: 'Safir Gecesi 213',
    category: 'Karanlık',
    template_id: 'template3',
    primary_color: '#dc2626',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-214',
    name: 'Vogue Dalı 214',
    category: 'Minimalist',
    template_id: 'template4',
    primary_color: '#ea580c',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-215',
    name: 'Gece Çekirdeği 215',
    category: 'Lüks',
    template_id: 'template5',
    primary_color: '#65a30d',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-216',
    name: 'Güneş Grisi 216',
    category: 'Doğal',
    template_id: 'template1',
    primary_color: '#0d9488',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-217',
    name: 'Ay Siyahı 217',
    category: 'Modern',
    template_id: 'template2',
    primary_color: '#2563eb',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-218',
    name: 'Yıldız Işıltısı 218',
    category: 'Klasik',
    template_id: 'template3',
    primary_color: '#4f46e5',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-219',
    name: 'Bahar Büyüsü 219',
    category: 'Karanlık',
    template_id: 'template4',
    primary_color: '#9333ea',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-220',
    name: 'Güz Sessizliği 220',
    category: 'Minimalist',
    template_id: 'template5',
    primary_color: '#c026d3',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-221',
    name: 'Kış Yankısı 221',
    category: 'Lüks',
    template_id: 'template1',
    primary_color: '#db2777',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-222',
    name: 'Gül Gölgesi 222',
    category: 'Doğal',
    template_id: 'template2',
    primary_color: '#475569',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-223',
    name: 'Okyanus Masalı 223',
    category: 'Modern',
    template_id: 'template3',
    primary_color: '#52525b',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-224',
    name: 'Lavanta Şiiri 224',
    category: 'Klasik',
    template_id: 'template4',
    primary_color: '#000000',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-225',
    name: 'Zümrüt Efsanesi 225',
    category: 'Karanlık',
    template_id: 'template5',
    primary_color: '#1c1917',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-226',
    name: 'Ateş Rüyası 226',
    category: 'Minimalist',
    template_id: 'template1',
    primary_color: '#78350f',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-227',
    name: 'Zeytin Esintisi 227',
    category: 'Lüks',
    template_id: 'template2',
    primary_color: '#831843',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-228',
    name: 'Kahve Gecesi 228',
    category: 'Doğal',
    template_id: 'template3',
    primary_color: '#064e3b',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-229',
    name: 'Pırlanta Dalı 229',
    category: 'Modern',
    template_id: 'template4',
    primary_color: '#1e3a8a',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-230',
    name: 'Safir Çekirdeği 230',
    category: 'Klasik',
    template_id: 'template5',
    primary_color: '#312e81',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-231',
    name: 'Vogue Grisi 231',
    category: 'Karanlık',
    template_id: 'template1',
    primary_color: '#e11d48',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-232',
    name: 'Gece Siyahı 232',
    category: 'Minimalist',
    template_id: 'template2',
    primary_color: '#0284c7',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-233',
    name: 'Güneş Işıltısı 233',
    category: 'Lüks',
    template_id: 'template3',
    primary_color: '#7c3aed',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-234',
    name: 'Ay Büyüsü 234',
    category: 'Doğal',
    template_id: 'template4',
    primary_color: '#d97706',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-235',
    name: 'Yıldız Sessizliği 235',
    category: 'Modern',
    template_id: 'template5',
    primary_color: '#16a34a',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-236',
    name: 'Bahar Yankısı 236',
    category: 'Klasik',
    template_id: 'template1',
    primary_color: '#dc2626',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-237',
    name: 'Güz Gölgesi 237',
    category: 'Karanlık',
    template_id: 'template2',
    primary_color: '#ea580c',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-238',
    name: 'Kış Masalı 238',
    category: 'Minimalist',
    template_id: 'template3',
    primary_color: '#65a30d',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-239',
    name: 'Gül Şiiri 239',
    category: 'Lüks',
    template_id: 'template4',
    primary_color: '#0d9488',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-240',
    name: 'Okyanus Efsanesi 240',
    category: 'Doğal',
    template_id: 'template5',
    primary_color: '#2563eb',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-241',
    name: 'Lavanta Rüyası 241',
    category: 'Modern',
    template_id: 'template1',
    primary_color: '#4f46e5',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-242',
    name: 'Zümrüt Esintisi 242',
    category: 'Klasik',
    template_id: 'template2',
    primary_color: '#9333ea',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-243',
    name: 'Ateş Gecesi 243',
    category: 'Karanlık',
    template_id: 'template3',
    primary_color: '#c026d3',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-244',
    name: 'Zeytin Dalı 244',
    category: 'Minimalist',
    template_id: 'template4',
    primary_color: '#db2777',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-245',
    name: 'Kahve Çekirdeği 245',
    category: 'Lüks',
    template_id: 'template5',
    primary_color: '#475569',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-246',
    name: 'Pırlanta Grisi 246',
    category: 'Doğal',
    template_id: 'template1',
    primary_color: '#52525b',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-247',
    name: 'Safir Siyahı 247',
    category: 'Modern',
    template_id: 'template2',
    primary_color: '#000000',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-248',
    name: 'Vogue Işıltısı 248',
    category: 'Klasik',
    template_id: 'template3',
    primary_color: '#1c1917',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-249',
    name: 'Gece Büyüsü 249',
    category: 'Karanlık',
    template_id: 'template4',
    primary_color: '#78350f',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-250',
    name: 'Güneş Sessizliği 250',
    category: 'Minimalist',
    template_id: 'template5',
    primary_color: '#831843',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-251',
    name: 'Ay Yankısı 251',
    category: 'Lüks',
    template_id: 'template1',
    primary_color: '#064e3b',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-252',
    name: 'Yıldız Gölgesi 252',
    category: 'Doğal',
    template_id: 'template2',
    primary_color: '#1e3a8a',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-253',
    name: 'Bahar Masalı 253',
    category: 'Modern',
    template_id: 'template3',
    primary_color: '#312e81',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-254',
    name: 'Güz Şiiri 254',
    category: 'Klasik',
    template_id: 'template4',
    primary_color: '#e11d48',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-255',
    name: 'Kış Efsanesi 255',
    category: 'Karanlık',
    template_id: 'template5',
    primary_color: '#0284c7',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-256',
    name: 'Gül Rüyası 256',
    category: 'Minimalist',
    template_id: 'template1',
    primary_color: '#7c3aed',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-257',
    name: 'Okyanus Esintisi 257',
    category: 'Lüks',
    template_id: 'template2',
    primary_color: '#d97706',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-258',
    name: 'Lavanta Gecesi 258',
    category: 'Doğal',
    template_id: 'template3',
    primary_color: '#16a34a',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-259',
    name: 'Zümrüt Dalı 259',
    category: 'Modern',
    template_id: 'template4',
    primary_color: '#dc2626',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-260',
    name: 'Ateş Çekirdeği 260',
    category: 'Klasik',
    template_id: 'template5',
    primary_color: '#ea580c',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-261',
    name: 'Zeytin Grisi 261',
    category: 'Karanlık',
    template_id: 'template1',
    primary_color: '#65a30d',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-262',
    name: 'Kahve Siyahı 262',
    category: 'Minimalist',
    template_id: 'template2',
    primary_color: '#0d9488',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-263',
    name: 'Pırlanta Işıltısı 263',
    category: 'Lüks',
    template_id: 'template3',
    primary_color: '#2563eb',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-264',
    name: 'Safir Büyüsü 264',
    category: 'Doğal',
    template_id: 'template4',
    primary_color: '#4f46e5',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-265',
    name: 'Vogue Sessizliği 265',
    category: 'Modern',
    template_id: 'template5',
    primary_color: '#9333ea',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-266',
    name: 'Gece Yankısı 266',
    category: 'Klasik',
    template_id: 'template1',
    primary_color: '#c026d3',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-267',
    name: 'Güneş Gölgesi 267',
    category: 'Karanlık',
    template_id: 'template2',
    primary_color: '#db2777',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-268',
    name: 'Ay Masalı 268',
    category: 'Minimalist',
    template_id: 'template3',
    primary_color: '#475569',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-269',
    name: 'Yıldız Şiiri 269',
    category: 'Lüks',
    template_id: 'template4',
    primary_color: '#52525b',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-270',
    name: 'Bahar Efsanesi 270',
    category: 'Doğal',
    template_id: 'template5',
    primary_color: '#000000',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-271',
    name: 'Güz Rüyası 271',
    category: 'Modern',
    template_id: 'template1',
    primary_color: '#1c1917',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-272',
    name: 'Kış Esintisi 272',
    category: 'Klasik',
    template_id: 'template2',
    primary_color: '#78350f',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-273',
    name: 'Gül Gecesi 273',
    category: 'Karanlık',
    template_id: 'template3',
    primary_color: '#831843',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-274',
    name: 'Okyanus Dalı 274',
    category: 'Minimalist',
    template_id: 'template4',
    primary_color: '#064e3b',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-275',
    name: 'Lavanta Çekirdeği 275',
    category: 'Lüks',
    template_id: 'template5',
    primary_color: '#1e3a8a',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-276',
    name: 'Zümrüt Grisi 276',
    category: 'Doğal',
    template_id: 'template1',
    primary_color: '#312e81',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-277',
    name: 'Ateş Siyahı 277',
    category: 'Modern',
    template_id: 'template2',
    primary_color: '#e11d48',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-278',
    name: 'Zeytin Işıltısı 278',
    category: 'Klasik',
    template_id: 'template3',
    primary_color: '#0284c7',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-279',
    name: 'Kahve Büyüsü 279',
    category: 'Karanlık',
    template_id: 'template4',
    primary_color: '#7c3aed',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-280',
    name: 'Pırlanta Sessizliği 280',
    category: 'Minimalist',
    template_id: 'template5',
    primary_color: '#d97706',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-281',
    name: 'Safir Yankısı 281',
    category: 'Lüks',
    template_id: 'template1',
    primary_color: '#16a34a',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-282',
    name: 'Vogue Gölgesi 282',
    category: 'Doğal',
    template_id: 'template2',
    primary_color: '#dc2626',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-283',
    name: 'Gece Masalı 283',
    category: 'Modern',
    template_id: 'template3',
    primary_color: '#ea580c',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-284',
    name: 'Güneş Şiiri 284',
    category: 'Klasik',
    template_id: 'template4',
    primary_color: '#65a30d',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-285',
    name: 'Ay Efsanesi 285',
    category: 'Karanlık',
    template_id: 'template5',
    primary_color: '#0d9488',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-286',
    name: 'Yıldız Rüyası 286',
    category: 'Minimalist',
    template_id: 'template1',
    primary_color: '#2563eb',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-287',
    name: 'Bahar Esintisi 287',
    category: 'Lüks',
    template_id: 'template2',
    primary_color: '#4f46e5',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-288',
    name: 'Güz Gecesi 288',
    category: 'Doğal',
    template_id: 'template3',
    primary_color: '#9333ea',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-289',
    name: 'Kış Dalı 289',
    category: 'Modern',
    template_id: 'template4',
    primary_color: '#c026d3',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-290',
    name: 'Gül Çekirdeği 290',
    category: 'Klasik',
    template_id: 'template5',
    primary_color: '#db2777',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-291',
    name: 'Okyanus Grisi 291',
    category: 'Karanlık',
    template_id: 'template1',
    primary_color: '#475569',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-292',
    name: 'Lavanta Siyahı 292',
    category: 'Minimalist',
    template_id: 'template2',
    primary_color: '#52525b',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-293',
    name: 'Zümrüt Işıltısı 293',
    category: 'Lüks',
    template_id: 'template3',
    primary_color: '#000000',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-294',
    name: 'Ateş Büyüsü 294',
    category: 'Doğal',
    template_id: 'template4',
    primary_color: '#1c1917',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-295',
    name: 'Zeytin Sessizliği 295',
    category: 'Modern',
    template_id: 'template5',
    primary_color: '#78350f',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-296',
    name: 'Kahve Yankısı 296',
    category: 'Klasik',
    template_id: 'template1',
    primary_color: '#831843',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-297',
    name: 'Pırlanta Gölgesi 297',
    category: 'Karanlık',
    template_id: 'template2',
    primary_color: '#064e3b',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-298',
    name: 'Safir Masalı 298',
    category: 'Minimalist',
    template_id: 'template3',
    primary_color: '#1e3a8a',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-299',
    name: 'Vogue Şiiri 299',
    category: 'Lüks',
    template_id: 'template4',
    primary_color: '#312e81',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-300',
    name: 'Gece Efsanesi 300',
    category: 'Doğal',
    template_id: 'template5',
    primary_color: '#e11d48',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-301',
    name: 'Güneş Rüyası 301',
    category: 'Modern',
    template_id: 'template1',
    primary_color: '#0284c7',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-302',
    name: 'Ay Esintisi 302',
    category: 'Klasik',
    template_id: 'template2',
    primary_color: '#7c3aed',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-303',
    name: 'Yıldız Gecesi 303',
    category: 'Karanlık',
    template_id: 'template3',
    primary_color: '#d97706',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-304',
    name: 'Bahar Dalı 304',
    category: 'Minimalist',
    template_id: 'template4',
    primary_color: '#16a34a',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-305',
    name: 'Güz Çekirdeği 305',
    category: 'Lüks',
    template_id: 'template5',
    primary_color: '#dc2626',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-306',
    name: 'Kış Grisi 306',
    category: 'Doğal',
    template_id: 'template1',
    primary_color: '#ea580c',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-307',
    name: 'Gül Siyahı 307',
    category: 'Modern',
    template_id: 'template2',
    primary_color: '#65a30d',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-308',
    name: 'Okyanus Işıltısı 308',
    category: 'Klasik',
    template_id: 'template3',
    primary_color: '#0d9488',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-309',
    name: 'Lavanta Büyüsü 309',
    category: 'Karanlık',
    template_id: 'template4',
    primary_color: '#2563eb',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-310',
    name: 'Zümrüt Sessizliği 310',
    category: 'Minimalist',
    template_id: 'template5',
    primary_color: '#4f46e5',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-311',
    name: 'Ateş Yankısı 311',
    category: 'Lüks',
    template_id: 'template1',
    primary_color: '#9333ea',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-312',
    name: 'Zeytin Gölgesi 312',
    category: 'Doğal',
    template_id: 'template2',
    primary_color: '#c026d3',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-313',
    name: 'Kahve Masalı 313',
    category: 'Modern',
    template_id: 'template3',
    primary_color: '#db2777',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-314',
    name: 'Pırlanta Şiiri 314',
    category: 'Klasik',
    template_id: 'template4',
    primary_color: '#475569',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-315',
    name: 'Safir Efsanesi 315',
    category: 'Karanlık',
    template_id: 'template5',
    primary_color: '#52525b',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-316',
    name: 'Vogue Rüyası 316',
    category: 'Minimalist',
    template_id: 'template1',
    primary_color: '#000000',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-317',
    name: 'Gece Esintisi 317',
    category: 'Lüks',
    template_id: 'template2',
    primary_color: '#1c1917',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-318',
    name: 'Güneş Gecesi 318',
    category: 'Doğal',
    template_id: 'template3',
    primary_color: '#78350f',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-319',
    name: 'Ay Dalı 319',
    category: 'Modern',
    template_id: 'template4',
    primary_color: '#831843',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-320',
    name: 'Yıldız Çekirdeği 320',
    category: 'Klasik',
    template_id: 'template5',
    primary_color: '#064e3b',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-321',
    name: 'Bahar Grisi 321',
    category: 'Karanlık',
    template_id: 'template1',
    primary_color: '#1e3a8a',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-322',
    name: 'Güz Siyahı 322',
    category: 'Minimalist',
    template_id: 'template2',
    primary_color: '#312e81',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-323',
    name: 'Kış Işıltısı 323',
    category: 'Lüks',
    template_id: 'template3',
    primary_color: '#e11d48',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-324',
    name: 'Gül Büyüsü 324',
    category: 'Doğal',
    template_id: 'template4',
    primary_color: '#0284c7',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-325',
    name: 'Okyanus Sessizliği 325',
    category: 'Modern',
    template_id: 'template5',
    primary_color: '#7c3aed',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-326',
    name: 'Lavanta Yankısı 326',
    category: 'Klasik',
    template_id: 'template1',
    primary_color: '#d97706',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-327',
    name: 'Zümrüt Gölgesi 327',
    category: 'Karanlık',
    template_id: 'template2',
    primary_color: '#16a34a',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-328',
    name: 'Ateş Masalı 328',
    category: 'Minimalist',
    template_id: 'template3',
    primary_color: '#dc2626',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-329',
    name: 'Zeytin Şiiri 329',
    category: 'Lüks',
    template_id: 'template4',
    primary_color: '#ea580c',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-330',
    name: 'Kahve Efsanesi 330',
    category: 'Doğal',
    template_id: 'template5',
    primary_color: '#65a30d',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-331',
    name: 'Pırlanta Rüyası 331',
    category: 'Modern',
    template_id: 'template1',
    primary_color: '#0d9488',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-332',
    name: 'Safir Esintisi 332',
    category: 'Klasik',
    template_id: 'template2',
    primary_color: '#2563eb',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-333',
    name: 'Vogue Gecesi 333',
    category: 'Karanlık',
    template_id: 'template3',
    primary_color: '#4f46e5',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-334',
    name: 'Gece Dalı 334',
    category: 'Minimalist',
    template_id: 'template4',
    primary_color: '#9333ea',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-335',
    name: 'Güneş Çekirdeği 335',
    category: 'Lüks',
    template_id: 'template5',
    primary_color: '#c026d3',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-336',
    name: 'Ay Grisi 336',
    category: 'Doğal',
    template_id: 'template1',
    primary_color: '#db2777',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-337',
    name: 'Yıldız Siyahı 337',
    category: 'Modern',
    template_id: 'template2',
    primary_color: '#475569',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-338',
    name: 'Bahar Işıltısı 338',
    category: 'Klasik',
    template_id: 'template3',
    primary_color: '#52525b',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-339',
    name: 'Güz Büyüsü 339',
    category: 'Karanlık',
    template_id: 'template4',
    primary_color: '#000000',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-340',
    name: 'Kış Sessizliği 340',
    category: 'Minimalist',
    template_id: 'template5',
    primary_color: '#1c1917',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-341',
    name: 'Gül Yankısı 341',
    category: 'Lüks',
    template_id: 'template1',
    primary_color: '#78350f',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-342',
    name: 'Okyanus Gölgesi 342',
    category: 'Doğal',
    template_id: 'template2',
    primary_color: '#831843',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-343',
    name: 'Lavanta Masalı 343',
    category: 'Modern',
    template_id: 'template3',
    primary_color: '#064e3b',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-344',
    name: 'Zümrüt Şiiri 344',
    category: 'Klasik',
    template_id: 'template4',
    primary_color: '#1e3a8a',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-345',
    name: 'Ateş Efsanesi 345',
    category: 'Karanlık',
    template_id: 'template5',
    primary_color: '#312e81',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-346',
    name: 'Zeytin Rüyası 346',
    category: 'Minimalist',
    template_id: 'template1',
    primary_color: '#e11d48',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-347',
    name: 'Kahve Esintisi 347',
    category: 'Lüks',
    template_id: 'template2',
    primary_color: '#0284c7',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-348',
    name: 'Pırlanta Gecesi 348',
    category: 'Doğal',
    template_id: 'template3',
    primary_color: '#7c3aed',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-349',
    name: 'Safir Dalı 349',
    category: 'Modern',
    template_id: 'template4',
    primary_color: '#d97706',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-350',
    name: 'Vogue Çekirdeği 350',
    category: 'Klasik',
    template_id: 'template5',
    primary_color: '#16a34a',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-351',
    name: 'Gece Grisi 351',
    category: 'Karanlık',
    template_id: 'template1',
    primary_color: '#dc2626',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-352',
    name: 'Güneş Siyahı 352',
    category: 'Minimalist',
    template_id: 'template2',
    primary_color: '#ea580c',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-353',
    name: 'Ay Işıltısı 353',
    category: 'Lüks',
    template_id: 'template3',
    primary_color: '#65a30d',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-354',
    name: 'Yıldız Büyüsü 354',
    category: 'Doğal',
    template_id: 'template4',
    primary_color: '#0d9488',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-355',
    name: 'Bahar Sessizliği 355',
    category: 'Modern',
    template_id: 'template5',
    primary_color: '#2563eb',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-356',
    name: 'Güz Yankısı 356',
    category: 'Klasik',
    template_id: 'template1',
    primary_color: '#4f46e5',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-357',
    name: 'Kış Gölgesi 357',
    category: 'Karanlık',
    template_id: 'template2',
    primary_color: '#9333ea',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-358',
    name: 'Gül Masalı 358',
    category: 'Minimalist',
    template_id: 'template3',
    primary_color: '#c026d3',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-359',
    name: 'Okyanus Şiiri 359',
    category: 'Lüks',
    template_id: 'template4',
    primary_color: '#db2777',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-360',
    name: 'Lavanta Efsanesi 360',
    category: 'Doğal',
    template_id: 'template5',
    primary_color: '#475569',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-361',
    name: 'Zümrüt Rüyası 361',
    category: 'Modern',
    template_id: 'template1',
    primary_color: '#52525b',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-362',
    name: 'Ateş Esintisi 362',
    category: 'Klasik',
    template_id: 'template2',
    primary_color: '#000000',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-363',
    name: 'Zeytin Gecesi 363',
    category: 'Karanlık',
    template_id: 'template3',
    primary_color: '#1c1917',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-364',
    name: 'Kahve Dalı 364',
    category: 'Minimalist',
    template_id: 'template4',
    primary_color: '#78350f',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-365',
    name: 'Pırlanta Çekirdeği 365',
    category: 'Lüks',
    template_id: 'template5',
    primary_color: '#831843',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-366',
    name: 'Safir Grisi 366',
    category: 'Doğal',
    template_id: 'template1',
    primary_color: '#064e3b',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-367',
    name: 'Vogue Siyahı 367',
    category: 'Modern',
    template_id: 'template2',
    primary_color: '#1e3a8a',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-368',
    name: 'Gece Işıltısı 368',
    category: 'Klasik',
    template_id: 'template3',
    primary_color: '#312e81',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-369',
    name: 'Güneş Büyüsü 369',
    category: 'Karanlık',
    template_id: 'template4',
    primary_color: '#e11d48',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-370',
    name: 'Ay Sessizliği 370',
    category: 'Minimalist',
    template_id: 'template5',
    primary_color: '#0284c7',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-371',
    name: 'Yıldız Yankısı 371',
    category: 'Lüks',
    template_id: 'template1',
    primary_color: '#7c3aed',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-372',
    name: 'Bahar Gölgesi 372',
    category: 'Doğal',
    template_id: 'template2',
    primary_color: '#d97706',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-373',
    name: 'Güz Masalı 373',
    category: 'Modern',
    template_id: 'template3',
    primary_color: '#16a34a',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-374',
    name: 'Kış Şiiri 374',
    category: 'Klasik',
    template_id: 'template4',
    primary_color: '#dc2626',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-375',
    name: 'Gül Efsanesi 375',
    category: 'Karanlık',
    template_id: 'template5',
    primary_color: '#ea580c',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-376',
    name: 'Okyanus Rüyası 376',
    category: 'Minimalist',
    template_id: 'template1',
    primary_color: '#65a30d',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-377',
    name: 'Lavanta Esintisi 377',
    category: 'Lüks',
    template_id: 'template2',
    primary_color: '#0d9488',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-378',
    name: 'Zümrüt Gecesi 378',
    category: 'Doğal',
    template_id: 'template3',
    primary_color: '#2563eb',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-379',
    name: 'Ateş Dalı 379',
    category: 'Modern',
    template_id: 'template4',
    primary_color: '#4f46e5',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-380',
    name: 'Zeytin Çekirdeği 380',
    category: 'Klasik',
    template_id: 'template5',
    primary_color: '#9333ea',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-381',
    name: 'Kahve Grisi 381',
    category: 'Karanlık',
    template_id: 'template1',
    primary_color: '#c026d3',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-382',
    name: 'Pırlanta Siyahı 382',
    category: 'Minimalist',
    template_id: 'template2',
    primary_color: '#db2777',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-383',
    name: 'Safir Işıltısı 383',
    category: 'Lüks',
    template_id: 'template3',
    primary_color: '#475569',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-384',
    name: 'Vogue Büyüsü 384',
    category: 'Doğal',
    template_id: 'template4',
    primary_color: '#52525b',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-385',
    name: 'Gece Sessizliği 385',
    category: 'Modern',
    template_id: 'template5',
    primary_color: '#000000',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-386',
    name: 'Güneş Yankısı 386',
    category: 'Klasik',
    template_id: 'template1',
    primary_color: '#1c1917',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-387',
    name: 'Ay Gölgesi 387',
    category: 'Karanlık',
    template_id: 'template2',
    primary_color: '#78350f',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-388',
    name: 'Yıldız Masalı 388',
    category: 'Minimalist',
    template_id: 'template3',
    primary_color: '#831843',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-389',
    name: 'Bahar Şiiri 389',
    category: 'Lüks',
    template_id: 'template4',
    primary_color: '#064e3b',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-390',
    name: 'Güz Efsanesi 390',
    category: 'Doğal',
    template_id: 'template5',
    primary_color: '#1e3a8a',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-391',
    name: 'Kış Rüyası 391',
    category: 'Modern',
    template_id: 'template1',
    primary_color: '#312e81',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-392',
    name: 'Gül Esintisi 392',
    category: 'Klasik',
    template_id: 'template2',
    primary_color: '#e11d48',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-393',
    name: 'Okyanus Gecesi 393',
    category: 'Karanlık',
    template_id: 'template3',
    primary_color: '#0284c7',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-394',
    name: 'Lavanta Dalı 394',
    category: 'Minimalist',
    template_id: 'template4',
    primary_color: '#7c3aed',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-395',
    name: 'Zümrüt Çekirdeği 395',
    category: 'Lüks',
    template_id: 'template5',
    primary_color: '#d97706',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-396',
    name: 'Ateş Grisi 396',
    category: 'Doğal',
    template_id: 'template1',
    primary_color: '#16a34a',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-397',
    name: 'Zeytin Siyahı 397',
    category: 'Modern',
    template_id: 'template2',
    primary_color: '#dc2626',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-398',
    name: 'Kahve Işıltısı 398',
    category: 'Klasik',
    template_id: 'template3',
    primary_color: '#ea580c',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-399',
    name: 'Pırlanta Büyüsü 399',
    category: 'Karanlık',
    template_id: 'template4',
    primary_color: '#65a30d',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-400',
    name: 'Safir Sessizliği 400',
    category: 'Minimalist',
    template_id: 'template5',
    primary_color: '#0d9488',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-401',
    name: 'Vogue Yankısı 401',
    category: 'Lüks',
    template_id: 'template1',
    primary_color: '#2563eb',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-402',
    name: 'Gece Gölgesi 402',
    category: 'Doğal',
    template_id: 'template2',
    primary_color: '#4f46e5',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-403',
    name: 'Güneş Masalı 403',
    category: 'Modern',
    template_id: 'template3',
    primary_color: '#9333ea',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-404',
    name: 'Ay Şiiri 404',
    category: 'Klasik',
    template_id: 'template4',
    primary_color: '#c026d3',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-405',
    name: 'Yıldız Efsanesi 405',
    category: 'Karanlık',
    template_id: 'template5',
    primary_color: '#db2777',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-406',
    name: 'Bahar Rüyası 406',
    category: 'Minimalist',
    template_id: 'template1',
    primary_color: '#475569',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-407',
    name: 'Güz Esintisi 407',
    category: 'Lüks',
    template_id: 'template2',
    primary_color: '#52525b',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-408',
    name: 'Kış Gecesi 408',
    category: 'Doğal',
    template_id: 'template3',
    primary_color: '#000000',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-409',
    name: 'Gül Dalı 409',
    category: 'Modern',
    template_id: 'template4',
    primary_color: '#1c1917',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-410',
    name: 'Okyanus Çekirdeği 410',
    category: 'Klasik',
    template_id: 'template5',
    primary_color: '#78350f',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-411',
    name: 'Lavanta Grisi 411',
    category: 'Karanlık',
    template_id: 'template1',
    primary_color: '#831843',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-412',
    name: 'Zümrüt Siyahı 412',
    category: 'Minimalist',
    template_id: 'template2',
    primary_color: '#064e3b',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-413',
    name: 'Ateş Işıltısı 413',
    category: 'Lüks',
    template_id: 'template3',
    primary_color: '#1e3a8a',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-414',
    name: 'Zeytin Büyüsü 414',
    category: 'Doğal',
    template_id: 'template4',
    primary_color: '#312e81',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-415',
    name: 'Kahve Sessizliği 415',
    category: 'Modern',
    template_id: 'template5',
    primary_color: '#e11d48',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-416',
    name: 'Pırlanta Yankısı 416',
    category: 'Klasik',
    template_id: 'template1',
    primary_color: '#0284c7',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-417',
    name: 'Safir Gölgesi 417',
    category: 'Karanlık',
    template_id: 'template2',
    primary_color: '#7c3aed',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-418',
    name: 'Vogue Masalı 418',
    category: 'Minimalist',
    template_id: 'template3',
    primary_color: '#d97706',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-419',
    name: 'Gece Şiiri 419',
    category: 'Lüks',
    template_id: 'template4',
    primary_color: '#16a34a',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-420',
    name: 'Güneş Efsanesi 420',
    category: 'Doğal',
    template_id: 'template5',
    primary_color: '#dc2626',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-421',
    name: 'Ay Rüyası 421',
    category: 'Modern',
    template_id: 'template1',
    primary_color: '#ea580c',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-422',
    name: 'Yıldız Esintisi 422',
    category: 'Klasik',
    template_id: 'template2',
    primary_color: '#65a30d',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-423',
    name: 'Bahar Gecesi 423',
    category: 'Karanlık',
    template_id: 'template3',
    primary_color: '#0d9488',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-424',
    name: 'Güz Dalı 424',
    category: 'Minimalist',
    template_id: 'template4',
    primary_color: '#2563eb',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-425',
    name: 'Kış Çekirdeği 425',
    category: 'Lüks',
    template_id: 'template5',
    primary_color: '#4f46e5',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-426',
    name: 'Gül Grisi 426',
    category: 'Doğal',
    template_id: 'template1',
    primary_color: '#9333ea',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-427',
    name: 'Okyanus Siyahı 427',
    category: 'Modern',
    template_id: 'template2',
    primary_color: '#c026d3',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-428',
    name: 'Lavanta Işıltısı 428',
    category: 'Klasik',
    template_id: 'template3',
    primary_color: '#db2777',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-429',
    name: 'Zümrüt Büyüsü 429',
    category: 'Karanlık',
    template_id: 'template4',
    primary_color: '#475569',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-430',
    name: 'Ateş Sessizliği 430',
    category: 'Minimalist',
    template_id: 'template5',
    primary_color: '#52525b',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-431',
    name: 'Zeytin Yankısı 431',
    category: 'Lüks',
    template_id: 'template1',
    primary_color: '#000000',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-432',
    name: 'Kahve Gölgesi 432',
    category: 'Doğal',
    template_id: 'template2',
    primary_color: '#1c1917',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-433',
    name: 'Pırlanta Masalı 433',
    category: 'Modern',
    template_id: 'template3',
    primary_color: '#78350f',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-434',
    name: 'Safir Şiiri 434',
    category: 'Klasik',
    template_id: 'template4',
    primary_color: '#831843',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-435',
    name: 'Vogue Efsanesi 435',
    category: 'Karanlık',
    template_id: 'template5',
    primary_color: '#064e3b',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-436',
    name: 'Gece Rüyası 436',
    category: 'Minimalist',
    template_id: 'template1',
    primary_color: '#1e3a8a',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-437',
    name: 'Güneş Esintisi 437',
    category: 'Lüks',
    template_id: 'template2',
    primary_color: '#312e81',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-438',
    name: 'Ay Gecesi 438',
    category: 'Doğal',
    template_id: 'template3',
    primary_color: '#e11d48',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-439',
    name: 'Yıldız Dalı 439',
    category: 'Modern',
    template_id: 'template4',
    primary_color: '#0284c7',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-440',
    name: 'Bahar Çekirdeği 440',
    category: 'Klasik',
    template_id: 'template5',
    primary_color: '#7c3aed',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-441',
    name: 'Güz Grisi 441',
    category: 'Karanlık',
    template_id: 'template1',
    primary_color: '#d97706',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-442',
    name: 'Kış Siyahı 442',
    category: 'Minimalist',
    template_id: 'template2',
    primary_color: '#16a34a',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-443',
    name: 'Gül Işıltısı 443',
    category: 'Lüks',
    template_id: 'template3',
    primary_color: '#dc2626',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-444',
    name: 'Okyanus Büyüsü 444',
    category: 'Doğal',
    template_id: 'template4',
    primary_color: '#ea580c',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-445',
    name: 'Lavanta Sessizliği 445',
    category: 'Modern',
    template_id: 'template5',
    primary_color: '#65a30d',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-446',
    name: 'Zümrüt Yankısı 446',
    category: 'Klasik',
    template_id: 'template1',
    primary_color: '#0d9488',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-447',
    name: 'Ateş Gölgesi 447',
    category: 'Karanlık',
    template_id: 'template2',
    primary_color: '#2563eb',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-448',
    name: 'Zeytin Masalı 448',
    category: 'Minimalist',
    template_id: 'template3',
    primary_color: '#4f46e5',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-449',
    name: 'Kahve Şiiri 449',
    category: 'Lüks',
    template_id: 'template4',
    primary_color: '#9333ea',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-450',
    name: 'Pırlanta Efsanesi 450',
    category: 'Doğal',
    template_id: 'template5',
    primary_color: '#c026d3',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-451',
    name: 'Safir Rüyası 451',
    category: 'Modern',
    template_id: 'template1',
    primary_color: '#db2777',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-452',
    name: 'Vogue Esintisi 452',
    category: 'Klasik',
    template_id: 'template2',
    primary_color: '#475569',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-453',
    name: 'Gece Gecesi 453',
    category: 'Karanlık',
    template_id: 'template3',
    primary_color: '#52525b',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-454',
    name: 'Güneş Dalı 454',
    category: 'Minimalist',
    template_id: 'template4',
    primary_color: '#000000',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-455',
    name: 'Ay Çekirdeği 455',
    category: 'Lüks',
    template_id: 'template5',
    primary_color: '#1c1917',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-456',
    name: 'Yıldız Grisi 456',
    category: 'Doğal',
    template_id: 'template1',
    primary_color: '#78350f',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-457',
    name: 'Bahar Siyahı 457',
    category: 'Modern',
    template_id: 'template2',
    primary_color: '#831843',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-458',
    name: 'Güz Işıltısı 458',
    category: 'Klasik',
    template_id: 'template3',
    primary_color: '#064e3b',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-459',
    name: 'Kış Büyüsü 459',
    category: 'Karanlık',
    template_id: 'template4',
    primary_color: '#1e3a8a',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-460',
    name: 'Gül Sessizliği 460',
    category: 'Minimalist',
    template_id: 'template5',
    primary_color: '#312e81',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-461',
    name: 'Okyanus Yankısı 461',
    category: 'Lüks',
    template_id: 'template1',
    primary_color: '#e11d48',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-462',
    name: 'Lavanta Gölgesi 462',
    category: 'Doğal',
    template_id: 'template2',
    primary_color: '#0284c7',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-463',
    name: 'Zümrüt Masalı 463',
    category: 'Modern',
    template_id: 'template3',
    primary_color: '#7c3aed',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-464',
    name: 'Ateş Şiiri 464',
    category: 'Klasik',
    template_id: 'template4',
    primary_color: '#d97706',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-465',
    name: 'Zeytin Efsanesi 465',
    category: 'Karanlık',
    template_id: 'template5',
    primary_color: '#16a34a',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-466',
    name: 'Kahve Rüyası 466',
    category: 'Minimalist',
    template_id: 'template1',
    primary_color: '#dc2626',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-467',
    name: 'Pırlanta Esintisi 467',
    category: 'Lüks',
    template_id: 'template2',
    primary_color: '#ea580c',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-468',
    name: 'Safir Gecesi 468',
    category: 'Doğal',
    template_id: 'template3',
    primary_color: '#65a30d',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-469',
    name: 'Vogue Dalı 469',
    category: 'Modern',
    template_id: 'template4',
    primary_color: '#0d9488',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-470',
    name: 'Gece Çekirdeği 470',
    category: 'Klasik',
    template_id: 'template5',
    primary_color: '#2563eb',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-471',
    name: 'Güneş Grisi 471',
    category: 'Karanlık',
    template_id: 'template1',
    primary_color: '#4f46e5',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-472',
    name: 'Ay Siyahı 472',
    category: 'Minimalist',
    template_id: 'template2',
    primary_color: '#9333ea',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-473',
    name: 'Yıldız Işıltısı 473',
    category: 'Lüks',
    template_id: 'template3',
    primary_color: '#c026d3',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-474',
    name: 'Bahar Büyüsü 474',
    category: 'Doğal',
    template_id: 'template4',
    primary_color: '#db2777',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-475',
    name: 'Güz Sessizliği 475',
    category: 'Modern',
    template_id: 'template5',
    primary_color: '#475569',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-476',
    name: 'Kış Yankısı 476',
    category: 'Klasik',
    template_id: 'template1',
    primary_color: '#52525b',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-477',
    name: 'Gül Gölgesi 477',
    category: 'Karanlık',
    template_id: 'template2',
    primary_color: '#000000',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-478',
    name: 'Okyanus Masalı 478',
    category: 'Minimalist',
    template_id: 'template3',
    primary_color: '#1c1917',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-479',
    name: 'Lavanta Şiiri 479',
    category: 'Lüks',
    template_id: 'template4',
    primary_color: '#78350f',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-480',
    name: 'Zümrüt Efsanesi 480',
    category: 'Doğal',
    template_id: 'template5',
    primary_color: '#831843',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-481',
    name: 'Ateş Rüyası 481',
    category: 'Modern',
    template_id: 'template1',
    primary_color: '#064e3b',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-482',
    name: 'Zeytin Esintisi 482',
    category: 'Klasik',
    template_id: 'template2',
    primary_color: '#1e3a8a',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-483',
    name: 'Kahve Gecesi 483',
    category: 'Karanlık',
    template_id: 'template3',
    primary_color: '#312e81',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-484',
    name: 'Pırlanta Dalı 484',
    category: 'Minimalist',
    template_id: 'template4',
    primary_color: '#e11d48',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-485',
    name: 'Safir Çekirdeği 485',
    category: 'Lüks',
    template_id: 'template5',
    primary_color: '#0284c7',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-486',
    name: 'Vogue Grisi 486',
    category: 'Doğal',
    template_id: 'template1',
    primary_color: '#7c3aed',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-487',
    name: 'Gece Siyahı 487',
    category: 'Modern',
    template_id: 'template2',
    primary_color: '#d97706',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-488',
    name: 'Güneş Işıltısı 488',
    category: 'Klasik',
    template_id: 'template3',
    primary_color: '#16a34a',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-489',
    name: 'Ay Büyüsü 489',
    category: 'Karanlık',
    template_id: 'template4',
    primary_color: '#dc2626',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-490',
    name: 'Yıldız Sessizliği 490',
    category: 'Minimalist',
    template_id: 'template5',
    primary_color: '#ea580c',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-491',
    name: 'Bahar Yankısı 491',
    category: 'Lüks',
    template_id: 'template1',
    primary_color: '#65a30d',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-492',
    name: 'Güz Gölgesi 492',
    category: 'Doğal',
    template_id: 'template2',
    primary_color: '#0d9488',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-493',
    name: 'Kış Masalı 493',
    category: 'Modern',
    template_id: 'template3',
    primary_color: '#2563eb',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-494',
    name: 'Gül Şiiri 494',
    category: 'Klasik',
    template_id: 'template4',
    primary_color: '#4f46e5',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-495',
    name: 'Okyanus Efsanesi 495',
    category: 'Karanlık',
    template_id: 'template5',
    primary_color: '#9333ea',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-496',
    name: 'Lavanta Rüyası 496',
    category: 'Minimalist',
    template_id: 'template1',
    primary_color: '#c026d3',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-497',
    name: 'Zümrüt Esintisi 497',
    category: 'Lüks',
    template_id: 'template2',
    primary_color: '#db2777',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-498',
    name: 'Ateş Gecesi 498',
    category: 'Doğal',
    template_id: 'template3',
    primary_color: '#475569',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-499',
    name: 'Zeytin Dalı 499',
    category: 'Modern',
    template_id: 'template4',
    primary_color: '#52525b',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-500',
    name: 'Kahve Çekirdeği 500',
    category: 'Klasik',
    template_id: 'template5',
    primary_color: '#000000',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-501',
    name: 'Pırlanta Grisi 501',
    category: 'Karanlık',
    template_id: 'template1',
    primary_color: '#1c1917',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-502',
    name: 'Safir Siyahı 502',
    category: 'Minimalist',
    template_id: 'template2',
    primary_color: '#78350f',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-503',
    name: 'Vogue Işıltısı 503',
    category: 'Lüks',
    template_id: 'template3',
    primary_color: '#831843',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-504',
    name: 'Gece Büyüsü 504',
    category: 'Doğal',
    template_id: 'template4',
    primary_color: '#064e3b',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-505',
    name: 'Güneş Sessizliği 505',
    category: 'Modern',
    template_id: 'template5',
    primary_color: '#1e3a8a',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-506',
    name: 'Ay Yankısı 506',
    category: 'Klasik',
    template_id: 'template1',
    primary_color: '#312e81',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-507',
    name: 'Yıldız Gölgesi 507',
    category: 'Karanlık',
    template_id: 'template2',
    primary_color: '#e11d48',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-508',
    name: 'Bahar Masalı 508',
    category: 'Minimalist',
    template_id: 'template3',
    primary_color: '#0284c7',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-509',
    name: 'Güz Şiiri 509',
    category: 'Lüks',
    template_id: 'template4',
    primary_color: '#7c3aed',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-510',
    name: 'Kış Efsanesi 510',
    category: 'Doğal',
    template_id: 'template5',
    primary_color: '#d97706',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-511',
    name: 'Gül Rüyası 511',
    category: 'Modern',
    template_id: 'template1',
    primary_color: '#16a34a',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-512',
    name: 'Okyanus Esintisi 512',
    category: 'Klasik',
    template_id: 'template2',
    primary_color: '#dc2626',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-513',
    name: 'Lavanta Gecesi 513',
    category: 'Karanlık',
    template_id: 'template3',
    primary_color: '#ea580c',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-514',
    name: 'Zümrüt Dalı 514',
    category: 'Minimalist',
    template_id: 'template4',
    primary_color: '#65a30d',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-515',
    name: 'Ateş Çekirdeği 515',
    category: 'Lüks',
    template_id: 'template5',
    primary_color: '#0d9488',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-516',
    name: 'Zeytin Grisi 516',
    category: 'Doğal',
    template_id: 'template1',
    primary_color: '#2563eb',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-517',
    name: 'Kahve Siyahı 517',
    category: 'Modern',
    template_id: 'template2',
    primary_color: '#4f46e5',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-518',
    name: 'Pırlanta Işıltısı 518',
    category: 'Klasik',
    template_id: 'template3',
    primary_color: '#9333ea',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-519',
    name: 'Safir Büyüsü 519',
    category: 'Karanlık',
    template_id: 'template4',
    primary_color: '#c026d3',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-520',
    name: 'Vogue Sessizliği 520',
    category: 'Minimalist',
    template_id: 'template5',
    primary_color: '#db2777',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-521',
    name: 'Gece Yankısı 521',
    category: 'Lüks',
    template_id: 'template1',
    primary_color: '#475569',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-522',
    name: 'Güneş Gölgesi 522',
    category: 'Doğal',
    template_id: 'template2',
    primary_color: '#52525b',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-523',
    name: 'Ay Masalı 523',
    category: 'Modern',
    template_id: 'template3',
    primary_color: '#000000',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-524',
    name: 'Yıldız Şiiri 524',
    category: 'Klasik',
    template_id: 'template4',
    primary_color: '#1c1917',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-525',
    name: 'Bahar Efsanesi 525',
    category: 'Karanlık',
    template_id: 'template5',
    primary_color: '#78350f',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-526',
    name: 'Güz Rüyası 526',
    category: 'Minimalist',
    template_id: 'template1',
    primary_color: '#831843',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-527',
    name: 'Kış Esintisi 527',
    category: 'Lüks',
    template_id: 'template2',
    primary_color: '#064e3b',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-528',
    name: 'Gül Gecesi 528',
    category: 'Doğal',
    template_id: 'template3',
    primary_color: '#1e3a8a',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-529',
    name: 'Okyanus Dalı 529',
    category: 'Modern',
    template_id: 'template4',
    primary_color: '#312e81',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-530',
    name: 'Lavanta Çekirdeği 530',
    category: 'Klasik',
    template_id: 'template5',
    primary_color: '#e11d48',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-531',
    name: 'Zümrüt Grisi 531',
    category: 'Karanlık',
    template_id: 'template1',
    primary_color: '#0284c7',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-532',
    name: 'Ateş Siyahı 532',
    category: 'Minimalist',
    template_id: 'template2',
    primary_color: '#7c3aed',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-533',
    name: 'Zeytin Işıltısı 533',
    category: 'Lüks',
    template_id: 'template3',
    primary_color: '#d97706',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-534',
    name: 'Kahve Büyüsü 534',
    category: 'Doğal',
    template_id: 'template4',
    primary_color: '#16a34a',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-535',
    name: 'Pırlanta Sessizliği 535',
    category: 'Modern',
    template_id: 'template5',
    primary_color: '#dc2626',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-536',
    name: 'Safir Yankısı 536',
    category: 'Klasik',
    template_id: 'template1',
    primary_color: '#ea580c',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-537',
    name: 'Vogue Gölgesi 537',
    category: 'Karanlık',
    template_id: 'template2',
    primary_color: '#65a30d',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-538',
    name: 'Gece Masalı 538',
    category: 'Minimalist',
    template_id: 'template3',
    primary_color: '#0d9488',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-539',
    name: 'Güneş Şiiri 539',
    category: 'Lüks',
    template_id: 'template4',
    primary_color: '#2563eb',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-540',
    name: 'Ay Efsanesi 540',
    category: 'Doğal',
    template_id: 'template5',
    primary_color: '#4f46e5',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-541',
    name: 'Yıldız Rüyası 541',
    category: 'Modern',
    template_id: 'template1',
    primary_color: '#9333ea',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-542',
    name: 'Bahar Esintisi 542',
    category: 'Klasik',
    template_id: 'template2',
    primary_color: '#c026d3',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-543',
    name: 'Güz Gecesi 543',
    category: 'Karanlık',
    template_id: 'template3',
    primary_color: '#db2777',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-544',
    name: 'Kış Dalı 544',
    category: 'Minimalist',
    template_id: 'template4',
    primary_color: '#475569',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-545',
    name: 'Gül Çekirdeği 545',
    category: 'Lüks',
    template_id: 'template5',
    primary_color: '#52525b',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-546',
    name: 'Okyanus Grisi 546',
    category: 'Doğal',
    template_id: 'template1',
    primary_color: '#000000',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-547',
    name: 'Lavanta Siyahı 547',
    category: 'Modern',
    template_id: 'template2',
    primary_color: '#1c1917',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-548',
    name: 'Zümrüt Işıltısı 548',
    category: 'Klasik',
    template_id: 'template3',
    primary_color: '#78350f',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-549',
    name: 'Ateş Büyüsü 549',
    category: 'Karanlık',
    template_id: 'template4',
    primary_color: '#831843',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-550',
    name: 'Zeytin Sessizliği 550',
    category: 'Minimalist',
    template_id: 'template5',
    primary_color: '#064e3b',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-551',
    name: 'Kahve Yankısı 551',
    category: 'Lüks',
    template_id: 'template1',
    primary_color: '#1e3a8a',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-552',
    name: 'Pırlanta Gölgesi 552',
    category: 'Doğal',
    template_id: 'template2',
    primary_color: '#312e81',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-553',
    name: 'Safir Masalı 553',
    category: 'Modern',
    template_id: 'template3',
    primary_color: '#e11d48',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-554',
    name: 'Vogue Şiiri 554',
    category: 'Klasik',
    template_id: 'template4',
    primary_color: '#0284c7',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-555',
    name: 'Gece Efsanesi 555',
    category: 'Karanlık',
    template_id: 'template5',
    primary_color: '#7c3aed',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-556',
    name: 'Güneş Rüyası 556',
    category: 'Minimalist',
    template_id: 'template1',
    primary_color: '#d97706',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-557',
    name: 'Ay Esintisi 557',
    category: 'Lüks',
    template_id: 'template2',
    primary_color: '#16a34a',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-558',
    name: 'Yıldız Gecesi 558',
    category: 'Doğal',
    template_id: 'template3',
    primary_color: '#dc2626',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-559',
    name: 'Bahar Dalı 559',
    category: 'Modern',
    template_id: 'template4',
    primary_color: '#ea580c',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-560',
    name: 'Güz Çekirdeği 560',
    category: 'Klasik',
    template_id: 'template5',
    primary_color: '#65a30d',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-561',
    name: 'Kış Grisi 561',
    category: 'Karanlık',
    template_id: 'template1',
    primary_color: '#0d9488',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-562',
    name: 'Gül Siyahı 562',
    category: 'Minimalist',
    template_id: 'template2',
    primary_color: '#2563eb',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-563',
    name: 'Okyanus Işıltısı 563',
    category: 'Lüks',
    template_id: 'template3',
    primary_color: '#4f46e5',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-564',
    name: 'Lavanta Büyüsü 564',
    category: 'Doğal',
    template_id: 'template4',
    primary_color: '#9333ea',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-565',
    name: 'Zümrüt Sessizliği 565',
    category: 'Modern',
    template_id: 'template5',
    primary_color: '#c026d3',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-566',
    name: 'Ateş Yankısı 566',
    category: 'Klasik',
    template_id: 'template1',
    primary_color: '#db2777',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-567',
    name: 'Zeytin Gölgesi 567',
    category: 'Karanlık',
    template_id: 'template2',
    primary_color: '#475569',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-568',
    name: 'Kahve Masalı 568',
    category: 'Minimalist',
    template_id: 'template3',
    primary_color: '#52525b',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-569',
    name: 'Pırlanta Şiiri 569',
    category: 'Lüks',
    template_id: 'template4',
    primary_color: '#000000',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-570',
    name: 'Safir Efsanesi 570',
    category: 'Doğal',
    template_id: 'template5',
    primary_color: '#1c1917',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-571',
    name: 'Vogue Rüyası 571',
    category: 'Modern',
    template_id: 'template1',
    primary_color: '#78350f',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-572',
    name: 'Gece Esintisi 572',
    category: 'Klasik',
    template_id: 'template2',
    primary_color: '#831843',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-573',
    name: 'Güneş Gecesi 573',
    category: 'Karanlık',
    template_id: 'template3',
    primary_color: '#064e3b',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-574',
    name: 'Ay Dalı 574',
    category: 'Minimalist',
    template_id: 'template4',
    primary_color: '#1e3a8a',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-575',
    name: 'Yıldız Çekirdeği 575',
    category: 'Lüks',
    template_id: 'template5',
    primary_color: '#312e81',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-576',
    name: 'Bahar Grisi 576',
    category: 'Doğal',
    template_id: 'template1',
    primary_color: '#e11d48',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-577',
    name: 'Güz Siyahı 577',
    category: 'Modern',
    template_id: 'template2',
    primary_color: '#0284c7',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-578',
    name: 'Kış Işıltısı 578',
    category: 'Klasik',
    template_id: 'template3',
    primary_color: '#7c3aed',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-579',
    name: 'Gül Büyüsü 579',
    category: 'Karanlık',
    template_id: 'template4',
    primary_color: '#d97706',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-580',
    name: 'Okyanus Sessizliği 580',
    category: 'Minimalist',
    template_id: 'template5',
    primary_color: '#16a34a',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-581',
    name: 'Lavanta Yankısı 581',
    category: 'Lüks',
    template_id: 'template1',
    primary_color: '#dc2626',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-582',
    name: 'Zümrüt Gölgesi 582',
    category: 'Doğal',
    template_id: 'template2',
    primary_color: '#ea580c',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-583',
    name: 'Ateş Masalı 583',
    category: 'Modern',
    template_id: 'template3',
    primary_color: '#65a30d',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-584',
    name: 'Zeytin Şiiri 584',
    category: 'Klasik',
    template_id: 'template4',
    primary_color: '#0d9488',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-585',
    name: 'Kahve Efsanesi 585',
    category: 'Karanlık',
    template_id: 'template5',
    primary_color: '#2563eb',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-586',
    name: 'Pırlanta Rüyası 586',
    category: 'Minimalist',
    template_id: 'template1',
    primary_color: '#4f46e5',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-587',
    name: 'Safir Esintisi 587',
    category: 'Lüks',
    template_id: 'template2',
    primary_color: '#9333ea',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-588',
    name: 'Vogue Gecesi 588',
    category: 'Doğal',
    template_id: 'template3',
    primary_color: '#c026d3',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-589',
    name: 'Gece Dalı 589',
    category: 'Modern',
    template_id: 'template4',
    primary_color: '#db2777',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-590',
    name: 'Güneş Çekirdeği 590',
    category: 'Klasik',
    template_id: 'template5',
    primary_color: '#475569',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-591',
    name: 'Ay Grisi 591',
    category: 'Karanlık',
    template_id: 'template1',
    primary_color: '#52525b',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-592',
    name: 'Yıldız Siyahı 592',
    category: 'Minimalist',
    template_id: 'template2',
    primary_color: '#000000',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-593',
    name: 'Bahar Işıltısı 593',
    category: 'Lüks',
    template_id: 'template3',
    primary_color: '#1c1917',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-594',
    name: 'Güz Büyüsü 594',
    category: 'Doğal',
    template_id: 'template4',
    primary_color: '#78350f',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-595',
    name: 'Kış Sessizliği 595',
    category: 'Modern',
    template_id: 'template5',
    primary_color: '#831843',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-596',
    name: 'Gül Yankısı 596',
    category: 'Klasik',
    template_id: 'template1',
    primary_color: '#064e3b',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-597',
    name: 'Okyanus Gölgesi 597',
    category: 'Karanlık',
    template_id: 'template2',
    primary_color: '#1e3a8a',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-598',
    name: 'Lavanta Masalı 598',
    category: 'Minimalist',
    template_id: 'template3',
    primary_color: '#312e81',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-599',
    name: 'Zümrüt Şiiri 599',
    category: 'Lüks',
    template_id: 'template4',
    primary_color: '#e11d48',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-600',
    name: 'Ateş Efsanesi 600',
    category: 'Doğal',
    template_id: 'template5',
    primary_color: '#0284c7',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-601',
    name: 'Zeytin Rüyası 601',
    category: 'Modern',
    template_id: 'template1',
    primary_color: '#7c3aed',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-602',
    name: 'Kahve Esintisi 602',
    category: 'Klasik',
    template_id: 'template2',
    primary_color: '#d97706',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-603',
    name: 'Pırlanta Gecesi 603',
    category: 'Karanlık',
    template_id: 'template3',
    primary_color: '#16a34a',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-604',
    name: 'Safir Dalı 604',
    category: 'Minimalist',
    template_id: 'template4',
    primary_color: '#dc2626',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-605',
    name: 'Vogue Çekirdeği 605',
    category: 'Lüks',
    template_id: 'template5',
    primary_color: '#ea580c',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-606',
    name: 'Gece Grisi 606',
    category: 'Doğal',
    template_id: 'template1',
    primary_color: '#65a30d',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-607',
    name: 'Güneş Siyahı 607',
    category: 'Modern',
    template_id: 'template2',
    primary_color: '#0d9488',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-608',
    name: 'Ay Işıltısı 608',
    category: 'Klasik',
    template_id: 'template3',
    primary_color: '#2563eb',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-609',
    name: 'Yıldız Büyüsü 609',
    category: 'Karanlık',
    template_id: 'template4',
    primary_color: '#4f46e5',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-610',
    name: 'Bahar Sessizliği 610',
    category: 'Minimalist',
    template_id: 'template5',
    primary_color: '#9333ea',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-611',
    name: 'Güz Yankısı 611',
    category: 'Lüks',
    template_id: 'template1',
    primary_color: '#c026d3',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-612',
    name: 'Kış Gölgesi 612',
    category: 'Doğal',
    template_id: 'template2',
    primary_color: '#db2777',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-613',
    name: 'Gül Masalı 613',
    category: 'Modern',
    template_id: 'template3',
    primary_color: '#475569',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-614',
    name: 'Okyanus Şiiri 614',
    category: 'Klasik',
    template_id: 'template4',
    primary_color: '#52525b',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-615',
    name: 'Lavanta Efsanesi 615',
    category: 'Karanlık',
    template_id: 'template5',
    primary_color: '#000000',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-616',
    name: 'Zümrüt Rüyası 616',
    category: 'Minimalist',
    template_id: 'template1',
    primary_color: '#1c1917',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-617',
    name: 'Ateş Esintisi 617',
    category: 'Lüks',
    template_id: 'template2',
    primary_color: '#78350f',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-618',
    name: 'Zeytin Gecesi 618',
    category: 'Doğal',
    template_id: 'template3',
    primary_color: '#831843',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-619',
    name: 'Kahve Dalı 619',
    category: 'Modern',
    template_id: 'template4',
    primary_color: '#064e3b',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-620',
    name: 'Pırlanta Çekirdeği 620',
    category: 'Klasik',
    template_id: 'template5',
    primary_color: '#1e3a8a',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-621',
    name: 'Safir Grisi 621',
    category: 'Karanlık',
    template_id: 'template1',
    primary_color: '#312e81',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-622',
    name: 'Vogue Siyahı 622',
    category: 'Minimalist',
    template_id: 'template2',
    primary_color: '#e11d48',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-623',
    name: 'Gece Işıltısı 623',
    category: 'Lüks',
    template_id: 'template3',
    primary_color: '#0284c7',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-624',
    name: 'Güneş Büyüsü 624',
    category: 'Doğal',
    template_id: 'template4',
    primary_color: '#7c3aed',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-625',
    name: 'Ay Sessizliği 625',
    category: 'Modern',
    template_id: 'template5',
    primary_color: '#d97706',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-626',
    name: 'Yıldız Yankısı 626',
    category: 'Klasik',
    template_id: 'template1',
    primary_color: '#16a34a',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-627',
    name: 'Bahar Gölgesi 627',
    category: 'Karanlık',
    template_id: 'template2',
    primary_color: '#dc2626',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-628',
    name: 'Güz Masalı 628',
    category: 'Minimalist',
    template_id: 'template3',
    primary_color: '#ea580c',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-629',
    name: 'Kış Şiiri 629',
    category: 'Lüks',
    template_id: 'template4',
    primary_color: '#65a30d',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-630',
    name: 'Gül Efsanesi 630',
    category: 'Doğal',
    template_id: 'template5',
    primary_color: '#0d9488',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-631',
    name: 'Okyanus Rüyası 631',
    category: 'Modern',
    template_id: 'template1',
    primary_color: '#2563eb',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-632',
    name: 'Lavanta Esintisi 632',
    category: 'Klasik',
    template_id: 'template2',
    primary_color: '#4f46e5',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-633',
    name: 'Zümrüt Gecesi 633',
    category: 'Karanlık',
    template_id: 'template3',
    primary_color: '#9333ea',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-634',
    name: 'Ateş Dalı 634',
    category: 'Minimalist',
    template_id: 'template4',
    primary_color: '#c026d3',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-635',
    name: 'Zeytin Çekirdeği 635',
    category: 'Lüks',
    template_id: 'template5',
    primary_color: '#db2777',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-636',
    name: 'Kahve Grisi 636',
    category: 'Doğal',
    template_id: 'template1',
    primary_color: '#475569',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-637',
    name: 'Pırlanta Siyahı 637',
    category: 'Modern',
    template_id: 'template2',
    primary_color: '#52525b',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-638',
    name: 'Safir Işıltısı 638',
    category: 'Klasik',
    template_id: 'template3',
    primary_color: '#000000',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-639',
    name: 'Vogue Büyüsü 639',
    category: 'Karanlık',
    template_id: 'template4',
    primary_color: '#1c1917',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-640',
    name: 'Gece Sessizliği 640',
    category: 'Minimalist',
    template_id: 'template5',
    primary_color: '#78350f',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-641',
    name: 'Güneş Yankısı 641',
    category: 'Lüks',
    template_id: 'template1',
    primary_color: '#831843',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-642',
    name: 'Ay Gölgesi 642',
    category: 'Doğal',
    template_id: 'template2',
    primary_color: '#064e3b',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-643',
    name: 'Yıldız Masalı 643',
    category: 'Modern',
    template_id: 'template3',
    primary_color: '#1e3a8a',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-644',
    name: 'Bahar Şiiri 644',
    category: 'Klasik',
    template_id: 'template4',
    primary_color: '#312e81',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-645',
    name: 'Güz Efsanesi 645',
    category: 'Karanlık',
    template_id: 'template5',
    primary_color: '#e11d48',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-646',
    name: 'Kış Rüyası 646',
    category: 'Minimalist',
    template_id: 'template1',
    primary_color: '#0284c7',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-647',
    name: 'Gül Esintisi 647',
    category: 'Lüks',
    template_id: 'template2',
    primary_color: '#7c3aed',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-648',
    name: 'Okyanus Gecesi 648',
    category: 'Doğal',
    template_id: 'template3',
    primary_color: '#d97706',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-649',
    name: 'Lavanta Dalı 649',
    category: 'Modern',
    template_id: 'template4',
    primary_color: '#16a34a',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-650',
    name: 'Zümrüt Çekirdeği 650',
    category: 'Klasik',
    template_id: 'template5',
    primary_color: '#dc2626',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-651',
    name: 'Ateş Grisi 651',
    category: 'Karanlık',
    template_id: 'template1',
    primary_color: '#ea580c',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-652',
    name: 'Zeytin Siyahı 652',
    category: 'Minimalist',
    template_id: 'template2',
    primary_color: '#65a30d',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-653',
    name: 'Kahve Işıltısı 653',
    category: 'Lüks',
    template_id: 'template3',
    primary_color: '#0d9488',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-654',
    name: 'Pırlanta Büyüsü 654',
    category: 'Doğal',
    template_id: 'template4',
    primary_color: '#2563eb',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-655',
    name: 'Safir Sessizliği 655',
    category: 'Modern',
    template_id: 'template5',
    primary_color: '#4f46e5',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-656',
    name: 'Vogue Yankısı 656',
    category: 'Klasik',
    template_id: 'template1',
    primary_color: '#9333ea',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-657',
    name: 'Gece Gölgesi 657',
    category: 'Karanlık',
    template_id: 'template2',
    primary_color: '#c026d3',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-658',
    name: 'Güneş Masalı 658',
    category: 'Minimalist',
    template_id: 'template3',
    primary_color: '#db2777',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-659',
    name: 'Ay Şiiri 659',
    category: 'Lüks',
    template_id: 'template4',
    primary_color: '#475569',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-660',
    name: 'Yıldız Efsanesi 660',
    category: 'Doğal',
    template_id: 'template5',
    primary_color: '#52525b',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-661',
    name: 'Bahar Rüyası 661',
    category: 'Modern',
    template_id: 'template1',
    primary_color: '#000000',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-662',
    name: 'Güz Esintisi 662',
    category: 'Klasik',
    template_id: 'template2',
    primary_color: '#1c1917',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-663',
    name: 'Kış Gecesi 663',
    category: 'Karanlık',
    template_id: 'template3',
    primary_color: '#78350f',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-664',
    name: 'Gül Dalı 664',
    category: 'Minimalist',
    template_id: 'template4',
    primary_color: '#831843',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-665',
    name: 'Okyanus Çekirdeği 665',
    category: 'Lüks',
    template_id: 'template5',
    primary_color: '#064e3b',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-666',
    name: 'Lavanta Grisi 666',
    category: 'Doğal',
    template_id: 'template1',
    primary_color: '#1e3a8a',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-667',
    name: 'Zümrüt Siyahı 667',
    category: 'Modern',
    template_id: 'template2',
    primary_color: '#312e81',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-668',
    name: 'Ateş Işıltısı 668',
    category: 'Klasik',
    template_id: 'template3',
    primary_color: '#e11d48',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-669',
    name: 'Zeytin Büyüsü 669',
    category: 'Karanlık',
    template_id: 'template4',
    primary_color: '#0284c7',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-670',
    name: 'Kahve Sessizliği 670',
    category: 'Minimalist',
    template_id: 'template5',
    primary_color: '#7c3aed',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-671',
    name: 'Pırlanta Yankısı 671',
    category: 'Lüks',
    template_id: 'template1',
    primary_color: '#d97706',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-672',
    name: 'Safir Gölgesi 672',
    category: 'Doğal',
    template_id: 'template2',
    primary_color: '#16a34a',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-673',
    name: 'Vogue Masalı 673',
    category: 'Modern',
    template_id: 'template3',
    primary_color: '#dc2626',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-674',
    name: 'Gece Şiiri 674',
    category: 'Klasik',
    template_id: 'template4',
    primary_color: '#ea580c',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-675',
    name: 'Güneş Efsanesi 675',
    category: 'Karanlık',
    template_id: 'template5',
    primary_color: '#65a30d',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-676',
    name: 'Ay Rüyası 676',
    category: 'Minimalist',
    template_id: 'template1',
    primary_color: '#0d9488',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-677',
    name: 'Yıldız Esintisi 677',
    category: 'Lüks',
    template_id: 'template2',
    primary_color: '#2563eb',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-678',
    name: 'Bahar Gecesi 678',
    category: 'Doğal',
    template_id: 'template3',
    primary_color: '#4f46e5',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-679',
    name: 'Güz Dalı 679',
    category: 'Modern',
    template_id: 'template4',
    primary_color: '#9333ea',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-680',
    name: 'Kış Çekirdeği 680',
    category: 'Klasik',
    template_id: 'template5',
    primary_color: '#c026d3',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-681',
    name: 'Gül Grisi 681',
    category: 'Karanlık',
    template_id: 'template1',
    primary_color: '#db2777',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-682',
    name: 'Okyanus Siyahı 682',
    category: 'Minimalist',
    template_id: 'template2',
    primary_color: '#475569',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-683',
    name: 'Lavanta Işıltısı 683',
    category: 'Lüks',
    template_id: 'template3',
    primary_color: '#52525b',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-684',
    name: 'Zümrüt Büyüsü 684',
    category: 'Doğal',
    template_id: 'template4',
    primary_color: '#000000',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-685',
    name: 'Ateş Sessizliği 685',
    category: 'Modern',
    template_id: 'template5',
    primary_color: '#1c1917',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-686',
    name: 'Zeytin Yankısı 686',
    category: 'Klasik',
    template_id: 'template1',
    primary_color: '#78350f',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-687',
    name: 'Kahve Gölgesi 687',
    category: 'Karanlık',
    template_id: 'template2',
    primary_color: '#831843',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-688',
    name: 'Pırlanta Masalı 688',
    category: 'Minimalist',
    template_id: 'template3',
    primary_color: '#064e3b',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-689',
    name: 'Safir Şiiri 689',
    category: 'Lüks',
    template_id: 'template4',
    primary_color: '#1e3a8a',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-690',
    name: 'Vogue Efsanesi 690',
    category: 'Doğal',
    template_id: 'template5',
    primary_color: '#312e81',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-691',
    name: 'Gece Rüyası 691',
    category: 'Modern',
    template_id: 'template1',
    primary_color: '#e11d48',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-692',
    name: 'Güneş Esintisi 692',
    category: 'Klasik',
    template_id: 'template2',
    primary_color: '#0284c7',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-693',
    name: 'Ay Gecesi 693',
    category: 'Karanlık',
    template_id: 'template3',
    primary_color: '#7c3aed',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-694',
    name: 'Yıldız Dalı 694',
    category: 'Minimalist',
    template_id: 'template4',
    primary_color: '#d97706',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-695',
    name: 'Bahar Çekirdeği 695',
    category: 'Lüks',
    template_id: 'template5',
    primary_color: '#16a34a',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-696',
    name: 'Güz Grisi 696',
    category: 'Doğal',
    template_id: 'template1',
    primary_color: '#dc2626',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-697',
    name: 'Kış Siyahı 697',
    category: 'Modern',
    template_id: 'template2',
    primary_color: '#ea580c',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-698',
    name: 'Gül Işıltısı 698',
    category: 'Klasik',
    template_id: 'template3',
    primary_color: '#65a30d',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-699',
    name: 'Okyanus Büyüsü 699',
    category: 'Karanlık',
    template_id: 'template4',
    primary_color: '#0d9488',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-700',
    name: 'Lavanta Sessizliği 700',
    category: 'Minimalist',
    template_id: 'template5',
    primary_color: '#2563eb',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-701',
    name: 'Zümrüt Yankısı 701',
    category: 'Lüks',
    template_id: 'template1',
    primary_color: '#4f46e5',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-702',
    name: 'Ateş Gölgesi 702',
    category: 'Doğal',
    template_id: 'template2',
    primary_color: '#9333ea',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-703',
    name: 'Zeytin Masalı 703',
    category: 'Modern',
    template_id: 'template3',
    primary_color: '#c026d3',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-704',
    name: 'Kahve Şiiri 704',
    category: 'Klasik',
    template_id: 'template4',
    primary_color: '#db2777',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-705',
    name: 'Pırlanta Efsanesi 705',
    category: 'Karanlık',
    template_id: 'template5',
    primary_color: '#475569',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-706',
    name: 'Safir Rüyası 706',
    category: 'Minimalist',
    template_id: 'template1',
    primary_color: '#52525b',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-707',
    name: 'Vogue Esintisi 707',
    category: 'Lüks',
    template_id: 'template2',
    primary_color: '#000000',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-708',
    name: 'Gece Gecesi 708',
    category: 'Doğal',
    template_id: 'template3',
    primary_color: '#1c1917',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-709',
    name: 'Güneş Dalı 709',
    category: 'Modern',
    template_id: 'template4',
    primary_color: '#78350f',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-710',
    name: 'Ay Çekirdeği 710',
    category: 'Klasik',
    template_id: 'template5',
    primary_color: '#831843',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-711',
    name: 'Yıldız Grisi 711',
    category: 'Karanlık',
    template_id: 'template1',
    primary_color: '#064e3b',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-712',
    name: 'Bahar Siyahı 712',
    category: 'Minimalist',
    template_id: 'template2',
    primary_color: '#1e3a8a',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-713',
    name: 'Güz Işıltısı 713',
    category: 'Lüks',
    template_id: 'template3',
    primary_color: '#312e81',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-714',
    name: 'Kış Büyüsü 714',
    category: 'Doğal',
    template_id: 'template4',
    primary_color: '#e11d48',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-715',
    name: 'Gül Sessizliği 715',
    category: 'Modern',
    template_id: 'template5',
    primary_color: '#0284c7',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-716',
    name: 'Okyanus Yankısı 716',
    category: 'Klasik',
    template_id: 'template1',
    primary_color: '#7c3aed',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-717',
    name: 'Lavanta Gölgesi 717',
    category: 'Karanlık',
    template_id: 'template2',
    primary_color: '#d97706',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-718',
    name: 'Zümrüt Masalı 718',
    category: 'Minimalist',
    template_id: 'template3',
    primary_color: '#16a34a',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-719',
    name: 'Ateş Şiiri 719',
    category: 'Lüks',
    template_id: 'template4',
    primary_color: '#dc2626',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-720',
    name: 'Zeytin Efsanesi 720',
    category: 'Doğal',
    template_id: 'template5',
    primary_color: '#ea580c',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-721',
    name: 'Kahve Rüyası 721',
    category: 'Modern',
    template_id: 'template1',
    primary_color: '#65a30d',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-722',
    name: 'Pırlanta Esintisi 722',
    category: 'Klasik',
    template_id: 'template2',
    primary_color: '#0d9488',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-723',
    name: 'Safir Gecesi 723',
    category: 'Karanlık',
    template_id: 'template3',
    primary_color: '#2563eb',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-724',
    name: 'Vogue Dalı 724',
    category: 'Minimalist',
    template_id: 'template4',
    primary_color: '#4f46e5',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-725',
    name: 'Gece Çekirdeği 725',
    category: 'Lüks',
    template_id: 'template5',
    primary_color: '#9333ea',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-726',
    name: 'Güneş Grisi 726',
    category: 'Doğal',
    template_id: 'template1',
    primary_color: '#c026d3',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-727',
    name: 'Ay Siyahı 727',
    category: 'Modern',
    template_id: 'template2',
    primary_color: '#db2777',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-728',
    name: 'Yıldız Işıltısı 728',
    category: 'Klasik',
    template_id: 'template3',
    primary_color: '#475569',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-729',
    name: 'Bahar Büyüsü 729',
    category: 'Karanlık',
    template_id: 'template4',
    primary_color: '#52525b',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-730',
    name: 'Güz Sessizliği 730',
    category: 'Minimalist',
    template_id: 'template5',
    primary_color: '#000000',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-731',
    name: 'Kış Yankısı 731',
    category: 'Lüks',
    template_id: 'template1',
    primary_color: '#1c1917',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-732',
    name: 'Gül Gölgesi 732',
    category: 'Doğal',
    template_id: 'template2',
    primary_color: '#78350f',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-733',
    name: 'Okyanus Masalı 733',
    category: 'Modern',
    template_id: 'template3',
    primary_color: '#831843',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-734',
    name: 'Lavanta Şiiri 734',
    category: 'Klasik',
    template_id: 'template4',
    primary_color: '#064e3b',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-735',
    name: 'Zümrüt Efsanesi 735',
    category: 'Karanlık',
    template_id: 'template5',
    primary_color: '#1e3a8a',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-736',
    name: 'Ateş Rüyası 736',
    category: 'Minimalist',
    template_id: 'template1',
    primary_color: '#312e81',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-737',
    name: 'Zeytin Esintisi 737',
    category: 'Lüks',
    template_id: 'template2',
    primary_color: '#e11d48',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-738',
    name: 'Kahve Gecesi 738',
    category: 'Doğal',
    template_id: 'template3',
    primary_color: '#0284c7',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-739',
    name: 'Pırlanta Dalı 739',
    category: 'Modern',
    template_id: 'template4',
    primary_color: '#7c3aed',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-740',
    name: 'Safir Çekirdeği 740',
    category: 'Klasik',
    template_id: 'template5',
    primary_color: '#d97706',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-741',
    name: 'Vogue Grisi 741',
    category: 'Karanlık',
    template_id: 'template1',
    primary_color: '#16a34a',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-742',
    name: 'Gece Siyahı 742',
    category: 'Minimalist',
    template_id: 'template2',
    primary_color: '#dc2626',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-743',
    name: 'Güneş Işıltısı 743',
    category: 'Lüks',
    template_id: 'template3',
    primary_color: '#ea580c',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-744',
    name: 'Ay Büyüsü 744',
    category: 'Doğal',
    template_id: 'template4',
    primary_color: '#65a30d',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-745',
    name: 'Yıldız Sessizliği 745',
    category: 'Modern',
    template_id: 'template5',
    primary_color: '#0d9488',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-746',
    name: 'Bahar Yankısı 746',
    category: 'Klasik',
    template_id: 'template1',
    primary_color: '#2563eb',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-747',
    name: 'Güz Gölgesi 747',
    category: 'Karanlık',
    template_id: 'template2',
    primary_color: '#4f46e5',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-748',
    name: 'Kış Masalı 748',
    category: 'Minimalist',
    template_id: 'template3',
    primary_color: '#9333ea',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-749',
    name: 'Gül Şiiri 749',
    category: 'Lüks',
    template_id: 'template4',
    primary_color: '#c026d3',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-750',
    name: 'Okyanus Efsanesi 750',
    category: 'Doğal',
    template_id: 'template5',
    primary_color: '#db2777',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-751',
    name: 'Lavanta Rüyası 751',
    category: 'Modern',
    template_id: 'template1',
    primary_color: '#475569',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-752',
    name: 'Zümrüt Esintisi 752',
    category: 'Klasik',
    template_id: 'template2',
    primary_color: '#52525b',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-753',
    name: 'Ateş Gecesi 753',
    category: 'Karanlık',
    template_id: 'template3',
    primary_color: '#000000',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-754',
    name: 'Zeytin Dalı 754',
    category: 'Minimalist',
    template_id: 'template4',
    primary_color: '#1c1917',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-755',
    name: 'Kahve Çekirdeği 755',
    category: 'Lüks',
    template_id: 'template5',
    primary_color: '#78350f',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-756',
    name: 'Pırlanta Grisi 756',
    category: 'Doğal',
    template_id: 'template1',
    primary_color: '#831843',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-757',
    name: 'Safir Siyahı 757',
    category: 'Modern',
    template_id: 'template2',
    primary_color: '#064e3b',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-758',
    name: 'Vogue Işıltısı 758',
    category: 'Klasik',
    template_id: 'template3',
    primary_color: '#1e3a8a',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-759',
    name: 'Gece Büyüsü 759',
    category: 'Karanlık',
    template_id: 'template4',
    primary_color: '#312e81',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-760',
    name: 'Güneş Sessizliği 760',
    category: 'Minimalist',
    template_id: 'template5',
    primary_color: '#e11d48',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-761',
    name: 'Ay Yankısı 761',
    category: 'Lüks',
    template_id: 'template1',
    primary_color: '#0284c7',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-762',
    name: 'Yıldız Gölgesi 762',
    category: 'Doğal',
    template_id: 'template2',
    primary_color: '#7c3aed',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-763',
    name: 'Bahar Masalı 763',
    category: 'Modern',
    template_id: 'template3',
    primary_color: '#d97706',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-764',
    name: 'Güz Şiiri 764',
    category: 'Klasik',
    template_id: 'template4',
    primary_color: '#16a34a',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-765',
    name: 'Kış Efsanesi 765',
    category: 'Karanlık',
    template_id: 'template5',
    primary_color: '#dc2626',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-766',
    name: 'Gül Rüyası 766',
    category: 'Minimalist',
    template_id: 'template1',
    primary_color: '#ea580c',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-767',
    name: 'Okyanus Esintisi 767',
    category: 'Lüks',
    template_id: 'template2',
    primary_color: '#65a30d',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-768',
    name: 'Lavanta Gecesi 768',
    category: 'Doğal',
    template_id: 'template3',
    primary_color: '#0d9488',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-769',
    name: 'Zümrüt Dalı 769',
    category: 'Modern',
    template_id: 'template4',
    primary_color: '#2563eb',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-770',
    name: 'Ateş Çekirdeği 770',
    category: 'Klasik',
    template_id: 'template5',
    primary_color: '#4f46e5',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-771',
    name: 'Zeytin Grisi 771',
    category: 'Karanlık',
    template_id: 'template1',
    primary_color: '#9333ea',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-772',
    name: 'Kahve Siyahı 772',
    category: 'Minimalist',
    template_id: 'template2',
    primary_color: '#c026d3',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-773',
    name: 'Pırlanta Işıltısı 773',
    category: 'Lüks',
    template_id: 'template3',
    primary_color: '#db2777',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-774',
    name: 'Safir Büyüsü 774',
    category: 'Doğal',
    template_id: 'template4',
    primary_color: '#475569',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-775',
    name: 'Vogue Sessizliği 775',
    category: 'Modern',
    template_id: 'template5',
    primary_color: '#52525b',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-776',
    name: 'Gece Yankısı 776',
    category: 'Klasik',
    template_id: 'template1',
    primary_color: '#000000',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-777',
    name: 'Güneş Gölgesi 777',
    category: 'Karanlık',
    template_id: 'template2',
    primary_color: '#1c1917',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-778',
    name: 'Ay Masalı 778',
    category: 'Minimalist',
    template_id: 'template3',
    primary_color: '#78350f',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-779',
    name: 'Yıldız Şiiri 779',
    category: 'Lüks',
    template_id: 'template4',
    primary_color: '#831843',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-780',
    name: 'Bahar Efsanesi 780',
    category: 'Doğal',
    template_id: 'template5',
    primary_color: '#064e3b',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-781',
    name: 'Güz Rüyası 781',
    category: 'Modern',
    template_id: 'template1',
    primary_color: '#1e3a8a',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-782',
    name: 'Kış Esintisi 782',
    category: 'Klasik',
    template_id: 'template2',
    primary_color: '#312e81',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-783',
    name: 'Gül Gecesi 783',
    category: 'Karanlık',
    template_id: 'template3',
    primary_color: '#e11d48',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-784',
    name: 'Okyanus Dalı 784',
    category: 'Minimalist',
    template_id: 'template4',
    primary_color: '#0284c7',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-785',
    name: 'Lavanta Çekirdeği 785',
    category: 'Lüks',
    template_id: 'template5',
    primary_color: '#7c3aed',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-786',
    name: 'Zümrüt Grisi 786',
    category: 'Doğal',
    template_id: 'template1',
    primary_color: '#d97706',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-787',
    name: 'Ateş Siyahı 787',
    category: 'Modern',
    template_id: 'template2',
    primary_color: '#16a34a',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-788',
    name: 'Zeytin Işıltısı 788',
    category: 'Klasik',
    template_id: 'template3',
    primary_color: '#dc2626',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-789',
    name: 'Kahve Büyüsü 789',
    category: 'Karanlık',
    template_id: 'template4',
    primary_color: '#ea580c',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-790',
    name: 'Pırlanta Sessizliği 790',
    category: 'Minimalist',
    template_id: 'template5',
    primary_color: '#65a30d',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-791',
    name: 'Safir Yankısı 791',
    category: 'Lüks',
    template_id: 'template1',
    primary_color: '#0d9488',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-792',
    name: 'Vogue Gölgesi 792',
    category: 'Doğal',
    template_id: 'template2',
    primary_color: '#2563eb',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-793',
    name: 'Gece Masalı 793',
    category: 'Modern',
    template_id: 'template3',
    primary_color: '#4f46e5',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-794',
    name: 'Güneş Şiiri 794',
    category: 'Klasik',
    template_id: 'template4',
    primary_color: '#9333ea',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-795',
    name: 'Ay Efsanesi 795',
    category: 'Karanlık',
    template_id: 'template5',
    primary_color: '#c026d3',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-796',
    name: 'Yıldız Rüyası 796',
    category: 'Minimalist',
    template_id: 'template1',
    primary_color: '#db2777',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-797',
    name: 'Bahar Esintisi 797',
    category: 'Lüks',
    template_id: 'template2',
    primary_color: '#475569',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-798',
    name: 'Güz Gecesi 798',
    category: 'Doğal',
    template_id: 'template3',
    primary_color: '#52525b',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-799',
    name: 'Kış Dalı 799',
    category: 'Modern',
    template_id: 'template4',
    primary_color: '#000000',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-800',
    name: 'Gül Çekirdeği 800',
    category: 'Klasik',
    template_id: 'template5',
    primary_color: '#1c1917',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-801',
    name: 'Okyanus Grisi 801',
    category: 'Karanlık',
    template_id: 'template1',
    primary_color: '#78350f',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-802',
    name: 'Lavanta Siyahı 802',
    category: 'Minimalist',
    template_id: 'template2',
    primary_color: '#831843',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-803',
    name: 'Zümrüt Işıltısı 803',
    category: 'Lüks',
    template_id: 'template3',
    primary_color: '#064e3b',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-804',
    name: 'Ateş Büyüsü 804',
    category: 'Doğal',
    template_id: 'template4',
    primary_color: '#1e3a8a',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-805',
    name: 'Zeytin Sessizliği 805',
    category: 'Modern',
    template_id: 'template5',
    primary_color: '#312e81',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-806',
    name: 'Kahve Yankısı 806',
    category: 'Klasik',
    template_id: 'template1',
    primary_color: '#e11d48',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-807',
    name: 'Pırlanta Gölgesi 807',
    category: 'Karanlık',
    template_id: 'template2',
    primary_color: '#0284c7',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-808',
    name: 'Safir Masalı 808',
    category: 'Minimalist',
    template_id: 'template3',
    primary_color: '#7c3aed',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-809',
    name: 'Vogue Şiiri 809',
    category: 'Lüks',
    template_id: 'template4',
    primary_color: '#d97706',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-810',
    name: 'Gece Efsanesi 810',
    category: 'Doğal',
    template_id: 'template5',
    primary_color: '#16a34a',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-811',
    name: 'Güneş Rüyası 811',
    category: 'Modern',
    template_id: 'template1',
    primary_color: '#dc2626',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-812',
    name: 'Ay Esintisi 812',
    category: 'Klasik',
    template_id: 'template2',
    primary_color: '#ea580c',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-813',
    name: 'Yıldız Gecesi 813',
    category: 'Karanlık',
    template_id: 'template3',
    primary_color: '#65a30d',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-814',
    name: 'Bahar Dalı 814',
    category: 'Minimalist',
    template_id: 'template4',
    primary_color: '#0d9488',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-815',
    name: 'Güz Çekirdeği 815',
    category: 'Lüks',
    template_id: 'template5',
    primary_color: '#2563eb',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-816',
    name: 'Kış Grisi 816',
    category: 'Doğal',
    template_id: 'template1',
    primary_color: '#4f46e5',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-817',
    name: 'Gül Siyahı 817',
    category: 'Modern',
    template_id: 'template2',
    primary_color: '#9333ea',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-818',
    name: 'Okyanus Işıltısı 818',
    category: 'Klasik',
    template_id: 'template3',
    primary_color: '#c026d3',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-819',
    name: 'Lavanta Büyüsü 819',
    category: 'Karanlık',
    template_id: 'template4',
    primary_color: '#db2777',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-820',
    name: 'Zümrüt Sessizliği 820',
    category: 'Minimalist',
    template_id: 'template5',
    primary_color: '#475569',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-821',
    name: 'Ateş Yankısı 821',
    category: 'Lüks',
    template_id: 'template1',
    primary_color: '#52525b',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-822',
    name: 'Zeytin Gölgesi 822',
    category: 'Doğal',
    template_id: 'template2',
    primary_color: '#000000',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-823',
    name: 'Kahve Masalı 823',
    category: 'Modern',
    template_id: 'template3',
    primary_color: '#1c1917',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-824',
    name: 'Pırlanta Şiiri 824',
    category: 'Klasik',
    template_id: 'template4',
    primary_color: '#78350f',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-825',
    name: 'Safir Efsanesi 825',
    category: 'Karanlık',
    template_id: 'template5',
    primary_color: '#831843',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-826',
    name: 'Vogue Rüyası 826',
    category: 'Minimalist',
    template_id: 'template1',
    primary_color: '#064e3b',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-827',
    name: 'Gece Esintisi 827',
    category: 'Lüks',
    template_id: 'template2',
    primary_color: '#1e3a8a',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-828',
    name: 'Güneş Gecesi 828',
    category: 'Doğal',
    template_id: 'template3',
    primary_color: '#312e81',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-829',
    name: 'Ay Dalı 829',
    category: 'Modern',
    template_id: 'template4',
    primary_color: '#e11d48',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-830',
    name: 'Yıldız Çekirdeği 830',
    category: 'Klasik',
    template_id: 'template5',
    primary_color: '#0284c7',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-831',
    name: 'Bahar Grisi 831',
    category: 'Karanlık',
    template_id: 'template1',
    primary_color: '#7c3aed',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-832',
    name: 'Güz Siyahı 832',
    category: 'Minimalist',
    template_id: 'template2',
    primary_color: '#d97706',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-833',
    name: 'Kış Işıltısı 833',
    category: 'Lüks',
    template_id: 'template3',
    primary_color: '#16a34a',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-834',
    name: 'Gül Büyüsü 834',
    category: 'Doğal',
    template_id: 'template4',
    primary_color: '#dc2626',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-835',
    name: 'Okyanus Sessizliği 835',
    category: 'Modern',
    template_id: 'template5',
    primary_color: '#ea580c',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-836',
    name: 'Lavanta Yankısı 836',
    category: 'Klasik',
    template_id: 'template1',
    primary_color: '#65a30d',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-837',
    name: 'Zümrüt Gölgesi 837',
    category: 'Karanlık',
    template_id: 'template2',
    primary_color: '#0d9488',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-838',
    name: 'Ateş Masalı 838',
    category: 'Minimalist',
    template_id: 'template3',
    primary_color: '#2563eb',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-839',
    name: 'Zeytin Şiiri 839',
    category: 'Lüks',
    template_id: 'template4',
    primary_color: '#4f46e5',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-840',
    name: 'Kahve Efsanesi 840',
    category: 'Doğal',
    template_id: 'template5',
    primary_color: '#9333ea',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-841',
    name: 'Pırlanta Rüyası 841',
    category: 'Modern',
    template_id: 'template1',
    primary_color: '#c026d3',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-842',
    name: 'Safir Esintisi 842',
    category: 'Klasik',
    template_id: 'template2',
    primary_color: '#db2777',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-843',
    name: 'Vogue Gecesi 843',
    category: 'Karanlık',
    template_id: 'template3',
    primary_color: '#475569',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-844',
    name: 'Gece Dalı 844',
    category: 'Minimalist',
    template_id: 'template4',
    primary_color: '#52525b',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-845',
    name: 'Güneş Çekirdeği 845',
    category: 'Lüks',
    template_id: 'template5',
    primary_color: '#000000',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-846',
    name: 'Ay Grisi 846',
    category: 'Doğal',
    template_id: 'template1',
    primary_color: '#1c1917',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-847',
    name: 'Yıldız Siyahı 847',
    category: 'Modern',
    template_id: 'template2',
    primary_color: '#78350f',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-848',
    name: 'Bahar Işıltısı 848',
    category: 'Klasik',
    template_id: 'template3',
    primary_color: '#831843',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-849',
    name: 'Güz Büyüsü 849',
    category: 'Karanlık',
    template_id: 'template4',
    primary_color: '#064e3b',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-850',
    name: 'Kış Sessizliği 850',
    category: 'Minimalist',
    template_id: 'template5',
    primary_color: '#1e3a8a',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-851',
    name: 'Gül Yankısı 851',
    category: 'Lüks',
    template_id: 'template1',
    primary_color: '#312e81',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-852',
    name: 'Okyanus Gölgesi 852',
    category: 'Doğal',
    template_id: 'template2',
    primary_color: '#e11d48',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-853',
    name: 'Lavanta Masalı 853',
    category: 'Modern',
    template_id: 'template3',
    primary_color: '#0284c7',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-854',
    name: 'Zümrüt Şiiri 854',
    category: 'Klasik',
    template_id: 'template4',
    primary_color: '#7c3aed',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-855',
    name: 'Ateş Efsanesi 855',
    category: 'Karanlık',
    template_id: 'template5',
    primary_color: '#d97706',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-856',
    name: 'Zeytin Rüyası 856',
    category: 'Minimalist',
    template_id: 'template1',
    primary_color: '#16a34a',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-857',
    name: 'Kahve Esintisi 857',
    category: 'Lüks',
    template_id: 'template2',
    primary_color: '#dc2626',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-858',
    name: 'Pırlanta Gecesi 858',
    category: 'Doğal',
    template_id: 'template3',
    primary_color: '#ea580c',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-859',
    name: 'Safir Dalı 859',
    category: 'Modern',
    template_id: 'template4',
    primary_color: '#65a30d',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-860',
    name: 'Vogue Çekirdeği 860',
    category: 'Klasik',
    template_id: 'template5',
    primary_color: '#0d9488',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-861',
    name: 'Gece Grisi 861',
    category: 'Karanlık',
    template_id: 'template1',
    primary_color: '#2563eb',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-862',
    name: 'Güneş Siyahı 862',
    category: 'Minimalist',
    template_id: 'template2',
    primary_color: '#4f46e5',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-863',
    name: 'Ay Işıltısı 863',
    category: 'Lüks',
    template_id: 'template3',
    primary_color: '#9333ea',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-864',
    name: 'Yıldız Büyüsü 864',
    category: 'Doğal',
    template_id: 'template4',
    primary_color: '#c026d3',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-865',
    name: 'Bahar Sessizliği 865',
    category: 'Modern',
    template_id: 'template5',
    primary_color: '#db2777',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-866',
    name: 'Güz Yankısı 866',
    category: 'Klasik',
    template_id: 'template1',
    primary_color: '#475569',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-867',
    name: 'Kış Gölgesi 867',
    category: 'Karanlık',
    template_id: 'template2',
    primary_color: '#52525b',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-868',
    name: 'Gül Masalı 868',
    category: 'Minimalist',
    template_id: 'template3',
    primary_color: '#000000',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-869',
    name: 'Okyanus Şiiri 869',
    category: 'Lüks',
    template_id: 'template4',
    primary_color: '#1c1917',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-870',
    name: 'Lavanta Efsanesi 870',
    category: 'Doğal',
    template_id: 'template5',
    primary_color: '#78350f',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-871',
    name: 'Zümrüt Rüyası 871',
    category: 'Modern',
    template_id: 'template1',
    primary_color: '#831843',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-872',
    name: 'Ateş Esintisi 872',
    category: 'Klasik',
    template_id: 'template2',
    primary_color: '#064e3b',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-873',
    name: 'Zeytin Gecesi 873',
    category: 'Karanlık',
    template_id: 'template3',
    primary_color: '#1e3a8a',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-874',
    name: 'Kahve Dalı 874',
    category: 'Minimalist',
    template_id: 'template4',
    primary_color: '#312e81',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-875',
    name: 'Pırlanta Çekirdeği 875',
    category: 'Lüks',
    template_id: 'template5',
    primary_color: '#e11d48',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-876',
    name: 'Safir Grisi 876',
    category: 'Doğal',
    template_id: 'template1',
    primary_color: '#0284c7',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-877',
    name: 'Vogue Siyahı 877',
    category: 'Modern',
    template_id: 'template2',
    primary_color: '#7c3aed',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-878',
    name: 'Gece Işıltısı 878',
    category: 'Klasik',
    template_id: 'template3',
    primary_color: '#d97706',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-879',
    name: 'Güneş Büyüsü 879',
    category: 'Karanlık',
    template_id: 'template4',
    primary_color: '#16a34a',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-880',
    name: 'Ay Sessizliği 880',
    category: 'Minimalist',
    template_id: 'template5',
    primary_color: '#dc2626',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-881',
    name: 'Yıldız Yankısı 881',
    category: 'Lüks',
    template_id: 'template1',
    primary_color: '#ea580c',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-882',
    name: 'Bahar Gölgesi 882',
    category: 'Doğal',
    template_id: 'template2',
    primary_color: '#65a30d',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-883',
    name: 'Güz Masalı 883',
    category: 'Modern',
    template_id: 'template3',
    primary_color: '#0d9488',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-884',
    name: 'Kış Şiiri 884',
    category: 'Klasik',
    template_id: 'template4',
    primary_color: '#2563eb',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-885',
    name: 'Gül Efsanesi 885',
    category: 'Karanlık',
    template_id: 'template5',
    primary_color: '#4f46e5',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-886',
    name: 'Okyanus Rüyası 886',
    category: 'Minimalist',
    template_id: 'template1',
    primary_color: '#9333ea',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-887',
    name: 'Lavanta Esintisi 887',
    category: 'Lüks',
    template_id: 'template2',
    primary_color: '#c026d3',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-888',
    name: 'Zümrüt Gecesi 888',
    category: 'Doğal',
    template_id: 'template3',
    primary_color: '#db2777',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-889',
    name: 'Ateş Dalı 889',
    category: 'Modern',
    template_id: 'template4',
    primary_color: '#475569',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-890',
    name: 'Zeytin Çekirdeği 890',
    category: 'Klasik',
    template_id: 'template5',
    primary_color: '#52525b',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-891',
    name: 'Kahve Grisi 891',
    category: 'Karanlık',
    template_id: 'template1',
    primary_color: '#000000',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-892',
    name: 'Pırlanta Siyahı 892',
    category: 'Minimalist',
    template_id: 'template2',
    primary_color: '#1c1917',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-893',
    name: 'Safir Işıltısı 893',
    category: 'Lüks',
    template_id: 'template3',
    primary_color: '#78350f',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-894',
    name: 'Vogue Büyüsü 894',
    category: 'Doğal',
    template_id: 'template4',
    primary_color: '#831843',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-895',
    name: 'Gece Sessizliği 895',
    category: 'Modern',
    template_id: 'template5',
    primary_color: '#064e3b',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-896',
    name: 'Güneş Yankısı 896',
    category: 'Klasik',
    template_id: 'template1',
    primary_color: '#1e3a8a',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-897',
    name: 'Ay Gölgesi 897',
    category: 'Karanlık',
    template_id: 'template2',
    primary_color: '#312e81',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-898',
    name: 'Yıldız Masalı 898',
    category: 'Minimalist',
    template_id: 'template3',
    primary_color: '#e11d48',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-899',
    name: 'Bahar Şiiri 899',
    category: 'Lüks',
    template_id: 'template4',
    primary_color: '#0284c7',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-900',
    name: 'Güz Efsanesi 900',
    category: 'Doğal',
    template_id: 'template5',
    primary_color: '#7c3aed',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-901',
    name: 'Kış Rüyası 901',
    category: 'Modern',
    template_id: 'template1',
    primary_color: '#d97706',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-902',
    name: 'Gül Esintisi 902',
    category: 'Klasik',
    template_id: 'template2',
    primary_color: '#16a34a',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-903',
    name: 'Okyanus Gecesi 903',
    category: 'Karanlık',
    template_id: 'template3',
    primary_color: '#dc2626',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-904',
    name: 'Lavanta Dalı 904',
    category: 'Minimalist',
    template_id: 'template4',
    primary_color: '#ea580c',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-905',
    name: 'Zümrüt Çekirdeği 905',
    category: 'Lüks',
    template_id: 'template5',
    primary_color: '#65a30d',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-906',
    name: 'Ateş Grisi 906',
    category: 'Doğal',
    template_id: 'template1',
    primary_color: '#0d9488',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-907',
    name: 'Zeytin Siyahı 907',
    category: 'Modern',
    template_id: 'template2',
    primary_color: '#2563eb',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-908',
    name: 'Kahve Işıltısı 908',
    category: 'Klasik',
    template_id: 'template3',
    primary_color: '#4f46e5',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-909',
    name: 'Pırlanta Büyüsü 909',
    category: 'Karanlık',
    template_id: 'template4',
    primary_color: '#9333ea',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-910',
    name: 'Safir Sessizliği 910',
    category: 'Minimalist',
    template_id: 'template5',
    primary_color: '#c026d3',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-911',
    name: 'Vogue Yankısı 911',
    category: 'Lüks',
    template_id: 'template1',
    primary_color: '#db2777',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-912',
    name: 'Gece Gölgesi 912',
    category: 'Doğal',
    template_id: 'template2',
    primary_color: '#475569',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-913',
    name: 'Güneş Masalı 913',
    category: 'Modern',
    template_id: 'template3',
    primary_color: '#52525b',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-914',
    name: 'Ay Şiiri 914',
    category: 'Klasik',
    template_id: 'template4',
    primary_color: '#000000',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-915',
    name: 'Yıldız Efsanesi 915',
    category: 'Karanlık',
    template_id: 'template5',
    primary_color: '#1c1917',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-916',
    name: 'Bahar Rüyası 916',
    category: 'Minimalist',
    template_id: 'template1',
    primary_color: '#78350f',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-917',
    name: 'Güz Esintisi 917',
    category: 'Lüks',
    template_id: 'template2',
    primary_color: '#831843',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-918',
    name: 'Kış Gecesi 918',
    category: 'Doğal',
    template_id: 'template3',
    primary_color: '#064e3b',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-919',
    name: 'Gül Dalı 919',
    category: 'Modern',
    template_id: 'template4',
    primary_color: '#1e3a8a',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-920',
    name: 'Okyanus Çekirdeği 920',
    category: 'Klasik',
    template_id: 'template5',
    primary_color: '#312e81',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-921',
    name: 'Lavanta Grisi 921',
    category: 'Karanlık',
    template_id: 'template1',
    primary_color: '#e11d48',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-922',
    name: 'Zümrüt Siyahı 922',
    category: 'Minimalist',
    template_id: 'template2',
    primary_color: '#0284c7',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-923',
    name: 'Ateş Işıltısı 923',
    category: 'Lüks',
    template_id: 'template3',
    primary_color: '#7c3aed',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-924',
    name: 'Zeytin Büyüsü 924',
    category: 'Doğal',
    template_id: 'template4',
    primary_color: '#d97706',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-925',
    name: 'Kahve Sessizliği 925',
    category: 'Modern',
    template_id: 'template5',
    primary_color: '#16a34a',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-926',
    name: 'Pırlanta Yankısı 926',
    category: 'Klasik',
    template_id: 'template1',
    primary_color: '#dc2626',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-927',
    name: 'Safir Gölgesi 927',
    category: 'Karanlık',
    template_id: 'template2',
    primary_color: '#ea580c',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-928',
    name: 'Vogue Masalı 928',
    category: 'Minimalist',
    template_id: 'template3',
    primary_color: '#65a30d',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-929',
    name: 'Gece Şiiri 929',
    category: 'Lüks',
    template_id: 'template4',
    primary_color: '#0d9488',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-930',
    name: 'Güneş Efsanesi 930',
    category: 'Doğal',
    template_id: 'template5',
    primary_color: '#2563eb',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-931',
    name: 'Ay Rüyası 931',
    category: 'Modern',
    template_id: 'template1',
    primary_color: '#4f46e5',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-932',
    name: 'Yıldız Esintisi 932',
    category: 'Klasik',
    template_id: 'template2',
    primary_color: '#9333ea',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-933',
    name: 'Bahar Gecesi 933',
    category: 'Karanlık',
    template_id: 'template3',
    primary_color: '#c026d3',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-934',
    name: 'Güz Dalı 934',
    category: 'Minimalist',
    template_id: 'template4',
    primary_color: '#db2777',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-935',
    name: 'Kış Çekirdeği 935',
    category: 'Lüks',
    template_id: 'template5',
    primary_color: '#475569',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-936',
    name: 'Gül Grisi 936',
    category: 'Doğal',
    template_id: 'template1',
    primary_color: '#52525b',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-937',
    name: 'Okyanus Siyahı 937',
    category: 'Modern',
    template_id: 'template2',
    primary_color: '#000000',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-938',
    name: 'Lavanta Işıltısı 938',
    category: 'Klasik',
    template_id: 'template3',
    primary_color: '#1c1917',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-939',
    name: 'Zümrüt Büyüsü 939',
    category: 'Karanlık',
    template_id: 'template4',
    primary_color: '#78350f',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-940',
    name: 'Ateş Sessizliği 940',
    category: 'Minimalist',
    template_id: 'template5',
    primary_color: '#831843',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-941',
    name: 'Zeytin Yankısı 941',
    category: 'Lüks',
    template_id: 'template1',
    primary_color: '#064e3b',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-942',
    name: 'Kahve Gölgesi 942',
    category: 'Doğal',
    template_id: 'template2',
    primary_color: '#1e3a8a',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-943',
    name: 'Pırlanta Masalı 943',
    category: 'Modern',
    template_id: 'template3',
    primary_color: '#312e81',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-944',
    name: 'Safir Şiiri 944',
    category: 'Klasik',
    template_id: 'template4',
    primary_color: '#e11d48',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-945',
    name: 'Vogue Efsanesi 945',
    category: 'Karanlık',
    template_id: 'template5',
    primary_color: '#0284c7',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-946',
    name: 'Gece Rüyası 946',
    category: 'Minimalist',
    template_id: 'template1',
    primary_color: '#7c3aed',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-947',
    name: 'Güneş Esintisi 947',
    category: 'Lüks',
    template_id: 'template2',
    primary_color: '#d97706',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-948',
    name: 'Ay Gecesi 948',
    category: 'Doğal',
    template_id: 'template3',
    primary_color: '#16a34a',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-949',
    name: 'Yıldız Dalı 949',
    category: 'Modern',
    template_id: 'template4',
    primary_color: '#dc2626',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-950',
    name: 'Bahar Çekirdeği 950',
    category: 'Klasik',
    template_id: 'template5',
    primary_color: '#ea580c',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-951',
    name: 'Güz Grisi 951',
    category: 'Karanlık',
    template_id: 'template1',
    primary_color: '#65a30d',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-952',
    name: 'Kış Siyahı 952',
    category: 'Minimalist',
    template_id: 'template2',
    primary_color: '#0d9488',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-953',
    name: 'Gül Işıltısı 953',
    category: 'Lüks',
    template_id: 'template3',
    primary_color: '#2563eb',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-954',
    name: 'Okyanus Büyüsü 954',
    category: 'Doğal',
    template_id: 'template4',
    primary_color: '#4f46e5',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-955',
    name: 'Lavanta Sessizliği 955',
    category: 'Modern',
    template_id: 'template5',
    primary_color: '#9333ea',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-956',
    name: 'Zümrüt Yankısı 956',
    category: 'Klasik',
    template_id: 'template1',
    primary_color: '#c026d3',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-957',
    name: 'Ateş Gölgesi 957',
    category: 'Karanlık',
    template_id: 'template2',
    primary_color: '#db2777',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-958',
    name: 'Zeytin Masalı 958',
    category: 'Minimalist',
    template_id: 'template3',
    primary_color: '#475569',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-959',
    name: 'Kahve Şiiri 959',
    category: 'Lüks',
    template_id: 'template4',
    primary_color: '#52525b',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-960',
    name: 'Pırlanta Efsanesi 960',
    category: 'Doğal',
    template_id: 'template5',
    primary_color: '#000000',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-961',
    name: 'Safir Rüyası 961',
    category: 'Modern',
    template_id: 'template1',
    primary_color: '#1c1917',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-962',
    name: 'Vogue Esintisi 962',
    category: 'Klasik',
    template_id: 'template2',
    primary_color: '#78350f',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-963',
    name: 'Gece Gecesi 963',
    category: 'Karanlık',
    template_id: 'template3',
    primary_color: '#831843',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-964',
    name: 'Güneş Dalı 964',
    category: 'Minimalist',
    template_id: 'template4',
    primary_color: '#064e3b',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-965',
    name: 'Ay Çekirdeği 965',
    category: 'Lüks',
    template_id: 'template5',
    primary_color: '#1e3a8a',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-966',
    name: 'Yıldız Grisi 966',
    category: 'Doğal',
    template_id: 'template1',
    primary_color: '#312e81',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-967',
    name: 'Bahar Siyahı 967',
    category: 'Modern',
    template_id: 'template2',
    primary_color: '#e11d48',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-968',
    name: 'Güz Işıltısı 968',
    category: 'Klasik',
    template_id: 'template3',
    primary_color: '#0284c7',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-969',
    name: 'Kış Büyüsü 969',
    category: 'Karanlık',
    template_id: 'template4',
    primary_color: '#7c3aed',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-970',
    name: 'Gül Sessizliği 970',
    category: 'Minimalist',
    template_id: 'template5',
    primary_color: '#d97706',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-971',
    name: 'Okyanus Yankısı 971',
    category: 'Lüks',
    template_id: 'template1',
    primary_color: '#16a34a',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-972',
    name: 'Lavanta Gölgesi 972',
    category: 'Doğal',
    template_id: 'template2',
    primary_color: '#dc2626',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-973',
    name: 'Zümrüt Masalı 973',
    category: 'Modern',
    template_id: 'template3',
    primary_color: '#ea580c',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-974',
    name: 'Ateş Şiiri 974',
    category: 'Klasik',
    template_id: 'template4',
    primary_color: '#65a30d',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-975',
    name: 'Zeytin Efsanesi 975',
    category: 'Karanlık',
    template_id: 'template5',
    primary_color: '#0d9488',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-976',
    name: 'Kahve Rüyası 976',
    category: 'Minimalist',
    template_id: 'template1',
    primary_color: '#2563eb',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-977',
    name: 'Pırlanta Esintisi 977',
    category: 'Lüks',
    template_id: 'template2',
    primary_color: '#4f46e5',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-978',
    name: 'Safir Gecesi 978',
    category: 'Doğal',
    template_id: 'template3',
    primary_color: '#9333ea',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-979',
    name: 'Vogue Dalı 979',
    category: 'Modern',
    template_id: 'template4',
    primary_color: '#c026d3',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-980',
    name: 'Gece Çekirdeği 980',
    category: 'Klasik',
    template_id: 'template5',
    primary_color: '#db2777',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-981',
    name: 'Güneş Grisi 981',
    category: 'Karanlık',
    template_id: 'template1',
    primary_color: '#475569',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-982',
    name: 'Ay Siyahı 982',
    category: 'Minimalist',
    template_id: 'template2',
    primary_color: '#52525b',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-983',
    name: 'Yıldız Işıltısı 983',
    category: 'Lüks',
    template_id: 'template3',
    primary_color: '#000000',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-984',
    name: 'Bahar Büyüsü 984',
    category: 'Doğal',
    template_id: 'template4',
    primary_color: '#1c1917',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-985',
    name: 'Güz Sessizliği 985',
    category: 'Modern',
    template_id: 'template5',
    primary_color: '#78350f',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-986',
    name: 'Kış Yankısı 986',
    category: 'Klasik',
    template_id: 'template1',
    primary_color: '#831843',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-987',
    name: 'Gül Gölgesi 987',
    category: 'Karanlık',
    template_id: 'template2',
    primary_color: '#064e3b',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-988',
    name: 'Okyanus Masalı 988',
    category: 'Minimalist',
    template_id: 'template3',
    primary_color: '#1e3a8a',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-989',
    name: 'Lavanta Şiiri 989',
    category: 'Lüks',
    template_id: 'template4',
    primary_color: '#312e81',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-990',
    name: 'Zümrüt Efsanesi 990',
    category: 'Doğal',
    template_id: 'template5',
    primary_color: '#e11d48',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-991',
    name: 'Ateş Rüyası 991',
    category: 'Modern',
    template_id: 'template1',
    primary_color: '#0284c7',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-992',
    name: 'Zeytin Esintisi 992',
    category: 'Klasik',
    template_id: 'template2',
    primary_color: '#7c3aed',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-993',
    name: 'Kahve Gecesi 993',
    category: 'Karanlık',
    template_id: 'template3',
    primary_color: '#d97706',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-994',
    name: 'Pırlanta Dalı 994',
    category: 'Minimalist',
    template_id: 'template4',
    primary_color: '#16a34a',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-995',
    name: 'Safir Çekirdeği 995',
    category: 'Lüks',
    template_id: 'template5',
    primary_color: '#dc2626',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-996',
    name: 'Vogue Grisi 996',
    category: 'Doğal',
    template_id: 'template1',
    primary_color: '#ea580c',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-997',
    name: 'Gece Siyahı 997',
    category: 'Modern',
    template_id: 'template2',
    primary_color: '#65a30d',
    font_family: 'sans',
    background_image_url: null
  },
  {
    id: 'theme-998',
    name: 'Güneş Işıltısı 998',
    category: 'Klasik',
    template_id: 'template3',
    primary_color: '#0d9488',
    font_family: 'serif',
    background_image_url: null
  },
  {
    id: 'theme-999',
    name: 'Ay Büyüsü 999',
    category: 'Karanlık',
    template_id: 'template4',
    primary_color: '#2563eb',
    font_family: 'mono',
    background_image_url: null
  },
  {
    id: 'theme-1000',
    name: 'Yıldız Sessizliği 1000',
    category: 'Minimalist',
    template_id: 'template5',
    primary_color: '#4f46e5',
    font_family: 'sans',
    background_image_url: null
  }
];
