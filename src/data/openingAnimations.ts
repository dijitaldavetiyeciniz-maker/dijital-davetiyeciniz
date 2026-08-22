export type OpeningFamily =
  | 'ELEGANT_CLASSICAL'
  | 'CINEMATIC'
  | 'CULTURAL'
  | 'DESTINATION'
  | 'FANTASY_MYTHOLOGICAL'
  | 'PLAYFUL'
  | 'CORPORATE'
  | 'EDITORIAL_FASHION';

export interface EntranceAnimationType {
  id: string;
  name: string;
  description: string;
  icon: string;
  family: OpeningFamily;
  isPremium?: boolean;
}

export interface EntranceAnimationStyle {
  id: string;
  name: string;
  palette: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    card: string;
    text: string;
  };
  effects: string[];
}

export const entranceAnimationTypes: EntranceAnimationType[] = [
  // 1. ELEGANT & CLASSICAL
  {
    id: "wax-seal-starfield",
    name: "✨ Yıldızlı Gece & Wax Mühür",
    description: "Karanlık yıldızlı gökyüzü, metalik organik wax mühür ve 3D flap açılışı.",
    icon: "stars",
    family: "ELEGANT_CLASSICAL"
  },
  {
    id: "envelope",
    name: "Zarf Açılışı",
    description: "Mühürlü zarf açılır, davetiye kartı zarifçe ortaya çıkar.",
    icon: "envelope",
    family: "ELEGANT_CLASSICAL"
  },
  {
    id: "curtain",
    name: "Perde Açılışı",
    description: "Perde iki yana açılır, davetiye sahne ışığıyla görünür.",
    icon: "curtain",
    family: "ELEGANT_CLASSICAL"
  },
  {
    id: "door",
    name: "Kapı Açılışı",
    description: "Karakteristik kapılar açılır, davetiye içeriden ışıkla belirir.",
    icon: "door",
    family: "ELEGANT_CLASSICAL"
  },
  {
    id: "royalParchment",
    name: "📜 Kraliyet Mektubu & Mühür",
    description: "Kraliyet parşömeni, altın mühür ve kurdele çözülmesi.",
    icon: "royal",
    family: "ELEGANT_CLASSICAL"
  },
  {
    id: "royalPalace",
    name: "👑 Saray Kapısı",
    description: "Arma, altın detay, saray kapısının açılması.",
    icon: "door",
    family: "ELEGANT_CLASSICAL",
    isPremium: true
  },

  // 2. CINEMATIC
  {
    id: "cinematicFilm",
    name: "🎬 Sinematik Film Perdesi",
    description: "Film perdesi, projektör ışığı ve afiş reveal ile görkemli açılış.",
    icon: "cinema",
    family: "CINEMATIC"
  },
  {
    id: "filmPremiere",
    name: "📽️ Gala & Film Şeridi",
    description: "Projektör ışığı, sinematik başlık, gala kartı.",
    icon: "cinema",
    family: "CINEMATIC",
    isPremium: true
  },
  {
    id: "grandOpera",
    name: "🎭 Büyük Opera Sahnesi",
    description: "Kadife perde, sahne ışığı, tiyatro derinliği.",
    icon: "curtain",
    family: "CINEMATIC",
    isPremium: true
  },
  {
    id: "spotlight",
    name: "Spotlight",
    description: "Sahne ışığı davetiyeyi karanlıktan ortaya çıkarır.",
    icon: "spotlight",
    family: "CINEMATIC"
  },
  {
    id: "cinematicZoom",
    name: "Sinematik Zoom",
    description: "Kamera davetiyeye yaklaşır ve görüntü netleşir.",
    icon: "zoom",
    family: "CINEMATIC"
  },

  // 3. CULTURAL
  {
    id: "ottomanIllumination",
    name: "⚜️ Osmanlı Tezhip ve Mühür",
    description: "Altın motifler, mühür, hat sanatı açılışı.",
    icon: "seal",
    family: "CULTURAL",
    isPremium: true
  },
  {
    id: "hennaPalace",
    name: "🍷 Saray Kına Feneri",
    description: "Fenerler, kadife perde, kına tepsisi, altın bordo detaylar.",
    icon: "henna",
    family: "CULTURAL",
    isPremium: true
  },
  {
    id: "hennaVelvetGate",
    name: "🌹 Bordo Kadife Perde & Gül",
    description: "Bordo kadife perde, oryantal parıltı ve uçuşan gül yaprakları.",
    icon: "henna",
    family: "CULTURAL"
  },
  {
    id: "princeCeremony",
    name: "🤴 Şehzade Kubbesi",
    description: "Kubbe, nazar detayı, çocuk isim arması.",
    icon: "nazar",
    family: "CULTURAL",
    isPremium: true
  },
  {
    id: "nazarDome",
    name: "🧿 Nazar Boncuğu & Kubbe",
    description: "Maşallah rozeti, nazar boncuğu ve şehzade kubbe açılışı.",
    icon: "nazar",
    family: "CULTURAL"
  },

  // 4. DESTINATION & NATURE
  {
    id: "coastalSunset",
    name: "🌅 Sahil Gün Batımı & Ufuk",
    description: "Sahil kompozisyonu, ufukta güneş geçişi, kontrollü dalgalar.",
    icon: "glass",
    family: "DESTINATION",
    isPremium: true
  },
  {
    id: "mediterraneanCeramic",
    name: "🏛️ Akdeniz Seramik Kemeri",
    description: "Akdeniz kemeri, kobalt vurgular, katmanlı tamamlanma.",
    icon: "door",
    family: "DESTINATION",
    isPremium: true
  },
  {
    id: "gardenGate",
    name: "Bahçe Kapısı",
    description: "Bahçe kapısı açılır, davetiye doğa atmosferinde görünür.",
    icon: "garden",
    family: "DESTINATION"
  },
  {
    id: "botanicalBlossom",
    name: "🌿 Çiçekli Bahçe Kapısı",
    description: "Açılan çiçek taçları ve botanik bahçe kapısı reveal.",
    icon: "flower",
    family: "DESTINATION"
  },
  {
    id: "botanicalWatercolor",
    name: "🎨 Suluboya Çiçek",
    description: "Pigment yayılımı, organik çerçeve oluşumu.",
    icon: "flower",
    family: "DESTINATION",
    isPremium: true
  },

  // 5. FANTASY & CELESTIAL
  {
    id: "moonlitGarden",
    name: "🌙 Ay Işıklı Gizli Bahçe",
    description: "Ay ışığı, çiçek açılımı, katmanlı gece bahçesi.",
    icon: "garden",
    family: "FANTASY_MYTHOLOGICAL",
    isPremium: true
  },
  {
    id: "auroraGlass",
    name: "🌌 Buzlu Cam Aurora",
    description: "Buzlu cam yüzeyi, yüksek kontrast aurora ışık hareketi.",
    icon: "glass",
    family: "FANTASY_MYTHOLOGICAL",
    isPremium: true
  },
  {
    id: "starryNight",
    name: "Yıldızlı Gece",
    description: "Yıldızlar ve ay ışığıyla romantik açılış yapılır.",
    icon: "stars",
    family: "FANTASY_MYTHOLOGICAL"
  },

  // 6. EDITORIAL & FASHION
  {
    id: "parisianBlackTie",
    name: "🎩 Parisian Black-Tie Spot",
    description: "Kontrollü spot ışığı, ince altın çizgi reveal, monogram.",
    icon: "spotlight",
    family: "EDITORIAL_FASHION",
    isPremium: true
  },
  {
    id: "vogueEditorial",
    name: "💎 Vogue Tipografik Dergi",
    description: "Tipografik blokların kademeli yerleşimi, masthead.",
    icon: "book",
    family: "EDITORIAL_FASHION",
    isPremium: true
  },
  {
    id: "minimalFade",
    name: "Minimal Fade",
    description: "Sade ve hızlı premium geçiş efekti kullanılır.",
    icon: "minimal",
    family: "EDITORIAL_FASHION"
  },

  // 7. PLAYFUL & CELEBRATION
  {
    id: "storybook",
    name: "📖 Masal Kitabı Açılışı",
    description: "Açılan kitap, özgün karakterler, etkinlik türüne göre semantik içerik.",
    icon: "book",
    family: "PLAYFUL",
    isPremium: true
  },
  {
    id: "cloudBalloon",
    name: "☁️ Bulut ve Balon Açılışı",
    description: "Bulutlar, uçan balonlar ve tatlı yıldızlarla sevimli çocuk açılışı.",
    icon: "cloud",
    family: "PLAYFUL"
  },
  {
    id: "teddyBear",
    name: "🧸 Sevimli Ayıcık Rozeti",
    description: "Tatlı ayıcık rozeti ve yumuşak bulut parıltısı ile açılış.",
    icon: "teddy",
    family: "PLAYFUL"
  },
  {
    id: "luxuryBox",
    name: "Hediye Kutusu",
    description: "Kutu kapağı açılır, davetiye içinden çıkar.",
    icon: "box",
    family: "PLAYFUL"
  },

  // 8. CORPORATE & TECH
  {
    id: "futureSummit",
    name: "🌐 Gelecek Zirvesi & Dijital Sahne",
    description: "Grid çizgileri, logo reveal ve dijital konferans sahnesi.",
    icon: "zoom",
    family: "CORPORATE",
    isPremium: true
  },
  {
    id: "swissGallery",
    name: "📐 İsviçre Tipografi & Grid",
    description: "Tipografik hizalama, geometrik açılış, minimal hareket.",
    icon: "minimal",
    family: "CORPORATE",
    isPremium: true
  },
  {
    id: "glass",
    name: "Cam Reveal",
    description: "Cam yüzey netleşir, davetiye görünür.",
    icon: "glass",
    family: "CORPORATE"
  },
  {
    id: "mirror",
    name: "Ayna Reveal",
    description: "Ayna yansıması netleşir ve davetiye ortaya çıkar.",
    icon: "mirror",
    family: "CORPORATE"
  },
  {
    id: "book",
    name: "Kitap Açılışı",
    description: "Kitap kapağı açılır, davetiye sayfadan yükselir.",
    icon: "book",
    family: "ELEGANT_CLASSICAL"
  },
  {
    id: "cinematicText",
    name: "🎬 Sinematik İsimler",
    description: "Karanlık zarif arkaplanda isimler, tıklayınca davetiyeye geçer.",
    icon: "cinematic",
    family: "CINEMATIC"
  },
  {
    id: "photoCover",
    name: "📸 Fotoğraf Kapağı",
    description: "Fotoğraflı kapak üzerinde isimler yer alır.",
    icon: "photo",
    family: "EDITORIAL_FASHION"
  },
  {
    id: "sealOnly",
    name: "🎯 Sadece Mühür",
    description: "Süzülen zarif bir mühür ile açılış başlatılır.",
    icon: "seal",
    family: "ELEGANT_CLASSICAL"
  }
];

export const entranceAnimationStyles: EntranceAnimationStyle[] = [
  {
    id: "black-gold-premium",
    name: "Siyah Gold Premium",
    palette: {
      primary: "#0f0e0e",
      secondary: "#d6a84f",
      accent: "#f8dfac",
      background: "#111111",
      card: "#fff8ec",
      text: "#3a2a18"
    },
    effects: ["goldParticles", "spotlight", "softGlow"]
  },
  {
    id: "rose-gold-romantic",
    name: "Rose Gold Romantik",
    palette: {
      primary: "#f5d7ce",
      secondary: "#c98778",
      accent: "#fff5ef",
      background: "#fff1ec",
      card: "#fffaf6",
      text: "#7a4d46"
    },
    effects: ["rosePetals", "sparkleDust", "softBloom"]
  },
  {
    id: "minimal-white",
    name: "Minimal Beyaz",
    palette: {
      primary: "#ffffff",
      secondary: "#d8c7b2",
      accent: "#f5efe8",
      background: "#faf7f2",
      card: "#ffffff",
      text: "#4a4038"
    },
    effects: ["pearlLight", "softGlow"]
  },
  {
    id: "royal-burgundy",
    name: "Kraliyet Bordo",
    palette: {
      primary: "#5a0f1b",
      secondary: "#d4af5f",
      accent: "#fff1dd",
      background: "#2b0710",
      card: "#fff7eb",
      text: "#4b271f"
    },
    effects: ["goldParticles", "candleLight", "royalLight"]
  },
  {
    id: "bohemian-garden",
    name: "Bohem Bahçe",
    palette: {
      primary: "#d8c7a3",
      secondary: "#8fa17a",
      accent: "#fff8ea",
      background: "#f5eddd",
      card: "#fffaf0",
      text: "#5c4a35"
    },
    effects: ["leafFall", "sunFlare", "warmLight"]
  },
  {
    id: "marble-gold",
    name: "Mermer Gold",
    palette: {
      primary: "#f8f4ee",
      secondary: "#c9a44d",
      accent: "#ffffff",
      background: "#f3eee7",
      card: "#fffdf8",
      text: "#4a3925"
    },
    effects: ["goldDust", "marbleLight", "softGlow"]
  },
  {
    id: "glass-modern",
    name: "Cam Modern",
    palette: {
      primary: "#eaf0f5",
      secondary: "#9baec0",
      accent: "#ffffff",
      background: "#f4f8fb",
      card: "#ffffff",
      text: "#26313a"
    },
    effects: ["glassShimmer", "lightSweep", "pearlLight"]
  },
  {
    id: "pastel-floral",
    name: "Pastel Çiçekli",
    palette: {
      primary: "#f7d8df",
      secondary: "#d9a7b0",
      accent: "#fff7f8",
      background: "#fff3f5",
      card: "#fffafa",
      text: "#6b444c"
    },
    effects: ["rosePetals", "floralBloom", "softGlow"]
  },
  {
    id: "navy-gold",
    name: "Lacivert Gold",
    palette: {
      primary: "#101b36",
      secondary: "#d3aa4c",
      accent: "#fff1cf",
      background: "#081225",
      card: "#fff8ec",
      text: "#302414"
    },
    effects: ["goldParticles", "stars", "spotlight"]
  },
  {
    id: "champagne-gold",
    name: "Şampanya Gold",
    palette: {
      primary: "#ead8bd",
      secondary: "#c99b4e",
      accent: "#fff6e8",
      background: "#f6ead9",
      card: "#fffaf2",
      text: "#5a3d22"
    },
    effects: ["goldDust", "softBloom", "pearlLight"]
  }
];

/**
 * Robust Template -> Opening Matching Engine
 * Guarantees that templates receive tailored, intentional openings without sharing a single generic default.
 */
export const TEMPLATE_OPENING_RECOMMENDATIONS: Record<string, string> = {
  // Flagship Luxury & Gala
  'parisian-black-tie': 'parisianBlackTie',
  'grand-opera': 'grandOpera',
  'royal-gold': 'royalPalace',
  'template1': 'royalParchment',
  'template2': 'wax-seal-starfield',

  // Botanical & Nature
  'moonlit-secret-garden': 'moonlitGarden',
  'fine-art-botanical-watercolor': 'botanicalWatercolor',
  'bohemian-terracotta': 'botanicalBlossom',
  'template4': 'gardenGate',
  'template21': 'gardenGate',

  // Editorial & High Fashion
  'vogue-editorial': 'vogueEditorial',
  'swiss-international-gallery': 'swissGallery',
  'minimal-paper': 'minimalFade',
  'pure-minimalist': 'minimalFade',
  'template11': 'minimalFade',

  // Destination & Coastal
  'mediterranean-ceramic-tile': 'mediterraneanCeramic',
  'coastal-sunset-driftwood': 'coastalSunset',
  'bosphorus-mansion': 'door',
  'template5': 'curtain',

  // Celestial & Glass
  'aurora-borealis-glassmorphism': 'auroraGlass',
  'starry-celestial': 'starryNight',
  'template6': 'auroraGlass',

  // Cinema & Film
  'cinema-vintage-premiere': 'filmPremiere',
  'hollywood-gala': 'cinematicFilm',
  'template10': 'cinematicFilm',

  // Cultural & Traditional
  'ottoman-palace-illumination': 'ottomanIllumination',
  'bordeaux-velvet-palace': 'hennaPalace',
  'traditional-henna': 'hennaVelvetGate',
  'template12': 'hennaVelvetGate',
  'template3': 'nazarDome',
  'template13': 'princeCeremony',
  'template23': 'nazarDome',

  // Playful & Storybook
  'magical-storybook': 'storybook',
  'cloud-balloon': 'cloudBalloon',
  'teddy-bear-badge': 'teddyBear',
  'template16': 'cloudBalloon',

  // Corporate & Tech
  'tech-summit-grid': 'futureSummit',
  'modern-corporate': 'swissGallery',
  'template15': 'futureSummit',
};

/**
 * Returns the recommended opening animation for a template ID with event-aware fallback
 */
export function getRecommendedOpeningForTemplate(templateId?: string, eventType?: string): string {
  if (templateId && TEMPLATE_OPENING_RECOMMENDATIONS[templateId]) {
    return TEMPLATE_OPENING_RECOMMENDATIONS[templateId];
  }

  // Event category fallback
  const evt = (eventType || '').toLowerCase();
  if (evt.includes('henna') || evt.includes('kına')) return 'hennaVelvetGate';
  if (evt.includes('circumcision') || evt.includes('sünnet')) return 'nazarDome';
  if (evt.includes('baby') || evt.includes('bebek') || evt.includes('birthday') || evt.includes('doğum')) return 'cloudBalloon';
  if (evt.includes('corporate') || evt.includes('kurumsal') || evt.includes('seminar') || evt.includes('zirve')) return 'futureSummit';

  return 'wax-seal-starfield';
}
