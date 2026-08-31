export type OpeningFamily =
  | 'ELEGANT_CLASSICAL'
  | 'CINEMATIC'
  | 'CULTURAL'
  | 'DESTINATION'
  | 'FANTASY_MYTHOLOGICAL'
  | 'PLAYFUL'
  | 'CORPORATE'
  | 'EDITORIAL_FASHION';

export interface AnimationControlField {
  id: string;
  label: string;
  type: 'select' | 'color' | 'text' | 'range' | 'boolean';
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  defaultValue: any;
  description?: string;
}

export interface AnimationCapabilities {
  supportsColors?: boolean;
  supportsSeal?: boolean;
  supportsSpeed?: boolean;
  supportsText?: boolean;
  supportsIntensity?: boolean;
  customControls: AnimationControlField[];
}

export interface EntranceAnimationType {
  id: string;
  name: string;
  description: string;
  icon: string;
  family: OpeningFamily;
  isPremium?: boolean;
  capabilities?: AnimationCapabilities;
  defaults?: Record<string, any>;
  recommendedSettings?: Record<string, any>;
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
  // 1. ELEGANT & CLASSICAL (6)
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
  {
    id: "book",
    name: "Kitap Açılışı",
    description: "Kitap kapağı açılır, davetiye sayfadan yükselir.",
    icon: "book",
    family: "ELEGANT_CLASSICAL"
  },
  {
    id: "sealOnly",
    name: "🎯 Sadece Mühür",
    description: "Süzülen zarif bir mühür ile açılış başlatılır.",
    icon: "seal",
    family: "ELEGANT_CLASSICAL"
  },

  // 2. CINEMATIC (5)
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
  {
    id: "cinematicText",
    name: "🎬 Sinematik İsimler",
    description: "Karanlık zarif arkaplanda isimler, tıklayınca davetiyeye geçer.",
    icon: "cinematic",
    family: "CINEMATIC"
  },

  // 3. CULTURAL (5)
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

  // 4. DESTINATION & NATURE (5)
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

  // 5. FANTASY & CELESTIAL (3)
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

  // 6. EDITORIAL & FASHION (4)
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
  {
    id: "photoCover",
    name: "📸 Fotoğraf Kapağı",
    description: "Fotoğraflı kapak üzerinde isimler yer alır.",
    icon: "photo",
    family: "EDITORIAL_FASHION"
  },

  // 7. PLAYFUL & CELEBRATION (4)
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

  // 8. CORPORATE & TECH (4)
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
    id: "none",
    name: "Animasyon Yok",
    description: "Açılış ekranı gösterilmez, davetiye doğrudan açılır.",
    icon: "ban",
    family: "EDITORIAL_FASHION"
  },
  {
    id: "cinematic-car-journey",
    name: "🚗 Sinematik Yolculuk (Car Journey)",
    description: "Ufka uzanan bir yolculuk, süzülen premium araç, isimlerin yola yansıması ve derinlik hissi.",
    icon: "cinema",
    family: "CINEMATIC",
    isPremium: true
  },
  {
    id: "celestial-eclipse",
    name: "🌑 Kozmik Tutulma (Celestial Eclipse)",
    description: "Güneş ve ayın hizalanması, parıldayan eclipse halkası ve derin nebula geçişi.",
    icon: "stars",
    family: "FANTASY_MYTHOLOGICAL",
    isPremium: true
  },
  {
    id: "golden-constellation",
    name: "✨ Altın Takımyıldızı (Constellation)",
    description: "Gökyüzündeki yıldızların altın çizgilerle birleşerek çiftin monogramını çizmesi.",
    icon: "stars",
    family: "FANTASY_MYTHOLOGICAL",
    isPremium: true
  },
  {
    id: "art-deco-doors",
    name: "🚪 Gatsby Art-Deco Kapı",
    description: "1920'ler tarzı geometrik altın desenli kapıların kayarak açılması.",
    icon: "door",
    family: "ELEGANT_CLASSICAL",
    isPremium: true
  },
  {
    id: "silk-fabric-reveal",
    name: "💨 İpek Kumaş Süzülmesi",
    description: "Sahneyi kaplayan lüks saten kumaşın rüzgarla savrularak kalkması.",
    icon: "curtain",
    family: "EDITORIAL_FASHION",
    isPremium: true
  },
  {
    id: "luxury-jewelry-box",
    name: "💍 Mücevher Kutusu Açılışı",
    description: "Kadife kaplı şık bir mücevher kutusunun kapağının açılarak ışıltı saçması.",
    icon: "box",
    family: "PLAYFUL",
    isPremium: true
  },
  {
    id: "ocean-pearl-reveal",
    name: "🌊 Okyanus Yakamozu & İnci",
    description: "Deniz yüzeyinde dalgalanan ay ışığı ve açılan sedef içinden çıkan davetiye.",
    icon: "glass",
    family: "DESTINATION",
    isPremium: true
  },
  {
    id: "minimal-architectural-lines",
    name: "📐 Minimal Mimari Çizgiler",
    description: "Matematiksel ince çizgilerin ve kesişim noktalarının geometrik çizimiyle reveal.",
    icon: "minimal",
    family: "EDITORIAL_FASHION",
    isPremium: true
  },
  {
    id: "ottoman-elegance",
    name: "🕌 Saray Tezhibi & Altın Kubbe",
    description: "Geleneksel Osmanlı tezhip motiflerinin sahneyi kaplayarak davetiyeyi çerçevelemesi.",
    icon: "seal",
    family: "CULTURAL",
    isPremium: true
  },
  {
    id: "lantern-night",
    name: "🏮 Fenerli Gece Akışı",
    description: "Karanlık bir gök/gökyüzü üzerinde yükselen veya yanan geleneksel kağıt fenerler.",
    icon: "stars",
    family: "CULTURAL",
    isPremium: true
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

// Openings catalog per event category to guarantee rich diversity without generic default collapse
const WEDDING_OPENING_POOL = [
  'parisianBlackTie', 'grandOpera', 'moonlitGarden', 'vogueEditorial',
  'mediterraneanCeramic', 'ottomanIllumination', 'coastalSunset', 'auroraGlass',
  'botanicalWatercolor', 'filmPremiere', 'swissGallery', 'royalPalace',
  'royalParchment', 'wax-seal-starfield', 'envelope', 'curtain',
  'door', 'gardenGate', 'botanicalBlossom', 'starryNight',
  'spotlight', 'cinematicFilm', 'minimalFade', 'photoCover', 'luxuryBox'
];

const HENNA_OPENING_POOL = [
  'hennaPalace', 'hennaVelvetGate', 'curtain', 'ottomanIllumination', 'royalParchment', 'door'
];

const CIRCUMCISION_OPENING_POOL = [
  'princeCeremony', 'nazarDome', 'royalPalace', 'royalParchment', 'door', 'sealOnly'
];

const BABY_KIDS_POOL = [
  'storybook', 'cloudBalloon', 'teddyBear', 'luxuryBox', 'starryNight'
];

const CORPORATE_POOL = [
  'futureSummit', 'swissGallery', 'spotlight', 'glass', 'mirror', 'cinematicZoom', 'cinematicText'
];

/**
 * Named and Flagship Template Recommendations
 */
export const TEMPLATE_OPENING_RECOMMENDATIONS: Record<string, string> = {
  // Flagship Luxury & Gala (0 - 18)
  '0': 'starryNight',
  '1': 'hennaVelvetGate',
  '2': 'parisianBlackTie',
  '3': 'grandOpera',
  '4': 'moonlitGarden',
  '5': 'vogueEditorial',
  '6': 'mediterraneanCeramic',
  '7': 'ottomanIllumination',
  '8': 'coastalSunset',
  '9': 'auroraGlass',
  '10': 'botanicalWatercolor',
  '11': 'filmPremiere',
  '12': 'swissGallery',
  '13': 'royalPalace',
  '14': 'hennaPalace',
  '15': 'princeCeremony',
  '16': 'storybook',
  '17': 'storybook',
  '18': 'futureSummit',
  '19': 'cinematicFilm',
  '20': 'royalParchment',
  '21': 'photoCover',
  '22': 'starryNight',
  '23': 'cloudBalloon',
  '24': 'teddyBear',
  '25': 'teddyBear',
  '26': 'cloudBalloon',
  '27': 'hennaVelvetGate',
  '28': 'nazarDome',
  '29': 'minimalFade',

  // Named Slugs
  'parisian-black-tie': 'parisianBlackTie',
  'grand-opera': 'grandOpera',
  'royal-gold': 'royalPalace',
  'template1': 'royalParchment',
  'template2': 'wax-seal-starfield',
  'template3': 'nazarDome',
  'template4': 'gardenGate',
  'template5': 'curtain',
  'template6': 'auroraGlass',
  'template7': 'botanicalBlossom',
  'template8': 'door',
  'template9': 'mediterraneanCeramic',
  'template10': 'cinematicFilm',
  'template11': 'minimalFade',
  'template12': 'hennaVelvetGate',
  'template13': 'princeCeremony',
  'template14': 'luxuryBox',
  'template15': 'futureSummit',
  'template16': 'cloudBalloon',

  'moonlit-secret-garden': 'moonlitGarden',
  'fine-art-botanical-watercolor': 'botanicalWatercolor',
  'bohemian-terracotta': 'botanicalBlossom',
  'vogue-editorial': 'vogueEditorial',
  'swiss-international-gallery': 'swissGallery',
  'minimal-paper': 'minimalFade',
  'pure-minimalist': 'minimalFade',
  'mediterranean-ceramic-tile': 'mediterraneanCeramic',
  'coastal-sunset-driftwood': 'coastalSunset',
  'aurora-borealis-glassmorphism': 'auroraGlass',
  'cinema-vintage-premiere': 'filmPremiere',
  'ottoman-palace-illumination': 'ottomanIllumination',
  'bordeaux-velvet-palace': 'hennaPalace',
  'traditional-henna': 'hennaVelvetGate',
  'magical-storybook': 'storybook',
  'cloud-balloon': 'cloudBalloon',
  'teddy-bear-badge': 'teddyBear',
  'tech-summit-grid': 'futureSummit',
  'modern-corporate': 'swissGallery'
};

/**
 * Returns the recommended opening animation for a template ID with event-aware fallback
 */
export function getRecommendedOpeningForTemplate(templateId?: string, eventType?: string): string {
  if (templateId && TEMPLATE_OPENING_RECOMMENDATIONS[templateId]) {
    return TEMPLATE_OPENING_RECOMMENDATIONS[templateId];
  }

  // Deterministic numeric index distribution across category pools
  if (templateId && !isNaN(Number(templateId))) {
    const idx = parseInt(templateId, 10);
    const evt = (eventType || '').toLowerCase();

    if (evt.includes('henna') || evt.includes('kına')) {
      return HENNA_OPENING_POOL[idx % HENNA_OPENING_POOL.length];
    }
    if (evt.includes('circumcision') || evt.includes('sünnet')) {
      return CIRCUMCISION_OPENING_POOL[idx % CIRCUMCISION_OPENING_POOL.length];
    }
    if (evt.includes('baby') || evt.includes('shower') || evt.includes('birthday') || evt.includes('doğum')) {
      return BABY_KIDS_POOL[idx % BABY_KIDS_POOL.length];
    }
    if (evt.includes('corporate') || evt.includes('kurumsal') || evt.includes('seminar') || evt.includes('zirve')) {
      return CORPORATE_POOL[idx % CORPORATE_POOL.length];
    }

    return WEDDING_OPENING_POOL[idx % WEDDING_OPENING_POOL.length];
  }

  // Event category fallback
  const evt = (eventType || '').toLowerCase();
  if (evt.includes('henna') || evt.includes('kına')) return 'hennaVelvetGate';
  if (evt.includes('circumcision') || evt.includes('sünnet')) return 'princeCeremony';
  if (evt.includes('baby') || evt.includes('bebek') || evt.includes('birthday') || evt.includes('doğum')) return 'storybook';
  if (evt.includes('corporate') || evt.includes('kurumsal') || evt.includes('seminar') || evt.includes('zirve')) return 'futureSummit';

  return 'wax-seal-starfield';
}

export function getAnimationCapabilities(animationId: string): AnimationCapabilities {
  const normId = (animationId || '').toLowerCase().replace(/[-_]/g, '');

  if (normId === 'none') {
    return {
      customControls: []
    };
  }

  if (normId === 'cinematiccarjourney') {
    return {
      supportsColors: true,
      supportsSpeed: true,
      supportsText: true,
      supportsIntensity: true,
      customControls: [
        {
          id: 'vehicleType',
          label: 'Araç Tipi',
          type: 'select',
          options: [
            { value: 'classic-convertible', label: 'Klasik Üstü Açık Cadillac' },
            { value: 'retro-vespa', label: 'Nostaljik İtalyan Vespa' },
            { value: 'modern-sport', label: 'Lüks Modern Spor Araç' },
            { value: 'vintage-beetle', label: 'Retro Vosvos' }
          ],
          defaultValue: 'classic-convertible'
        },
        {
          id: 'vehicleColor',
          label: 'Araç Rengi',
          type: 'color',
          defaultValue: '#ef4444',
          description: 'Premium aracın boya rengi'
        },
        {
          id: 'roadAtmosphere',
          label: 'Yol Manzarası',
          type: 'select',
          options: [
            { value: 'coastal-cliff', label: 'Ege Kıyı Şeridi & Deniz' },
            { value: 'forest-highway', label: 'Sonbahar Orman Yolu' },
            { value: 'city-lights', label: 'Retro Şehir Bulvarı' }
          ],
          defaultValue: 'coastal-cliff'
        },
        {
          id: 'dayNightPhase',
          label: 'Günün Saati (Gökyüzü)',
          type: 'select',
          options: [
            { value: 'day', label: 'Açık Mavi Gün Işığı' },
            { value: 'sunset', label: 'Romantik Gün Batımı Kızıllığı' },
            { value: 'night', label: 'Yıldızlı Gece & Yakamoz' }
          ],
          defaultValue: 'sunset'
        },
        {
          id: 'cameraSpeed',
          label: 'Yolculuk Hızı',
          type: 'range',
          min: 1,
          max: 5,
          step: 0.5,
          defaultValue: 3,
          unit: 'x'
        },
        {
          id: 'namesStyle',
          label: 'İsim Gösterim Tarzı',
          type: 'select',
          options: [
            { value: 'road-paint', label: 'Asfalt Üzerine Yazılı' },
            { value: 'sky-constellation', label: 'Gökyüzünde Parlayan' },
            { value: 'billboard', label: 'Retro Yol Panosu Üzerinde' }
          ],
          defaultValue: 'road-paint'
        },
        {
          id: 'lightIntensity',
          label: 'Farlar ve Güneş Işığı Gücü',
          type: 'range',
          min: 10,
          max: 100,
          defaultValue: 70,
          unit: '%'
        }
      ]
    };
  }

  if (normId === 'celestialeclipse') {
    return {
      supportsColors: true,
      supportsIntensity: true,
      customControls: [
        {
          id: 'celestialBodyType',
          label: 'Gök Cism Türü',
          type: 'select',
          options: [
            { value: 'solar', label: 'Güneş Tutulması (Altın Halka)' },
            { value: 'lunar', label: 'Kanlı Ay Tutulması (Kızıl Halka)' }
          ],
          defaultValue: 'solar'
        },
        {
          id: 'eclipseScale',
          label: 'Halka Büyüklüğü',
          type: 'range',
          min: 50,
          max: 150,
          defaultValue: 100,
          unit: '%'
        },
        {
          id: 'glowColor',
          label: 'Tutulma Işıma Rengi',
          type: 'color',
          defaultValue: '#f59e0b'
        },
        {
          id: 'starsDensity',
          label: 'Arka Plan Yıldız Yoğunluğu',
          type: 'range',
          min: 10,
          max: 120,
          defaultValue: 60,
          unit: 'adet'
        }
      ]
    };
  }

  if (normId === 'goldenconstellation') {
    return {
      supportsColors: true,
      supportsSpeed: true,
      customControls: [
        {
          id: 'constellationStyle',
          label: 'Yıldız Çizgi Tarzı',
          type: 'select',
          options: [
            { value: 'geometric-lines', label: 'Keskin Geometrik Çizgiler' },
            { value: 'dust-glow', label: 'Yumuşak Kozmik Toz Akışı' }
          ],
          defaultValue: 'geometric-lines'
        },
        {
          id: 'starSize',
          label: 'Takımyıldız Yıldız Boyutu',
          type: 'range',
          min: 2,
          max: 8,
          defaultValue: 4,
          unit: 'px'
        },
        {
          id: 'lineColor',
          label: 'Bağlantı Çizgi Rengi',
          type: 'color',
          defaultValue: '#fbbf24'
        },
        {
          id: 'lineGlow',
          label: 'Çizgi Parlama Şiddeti',
          type: 'range',
          min: 10,
          max: 100,
          defaultValue: 75,
          unit: '%'
        },
        {
          id: 'monogramInitial',
          label: 'Kozmik Monogram Harfi',
          type: 'text',
          defaultValue: 'M'
        }
      ]
    };
  }

  if (normId === 'artdecodoors') {
    return {
      supportsColors: true,
      customControls: [
        {
          id: 'geometryPattern',
          label: 'Geometrik Motif Stili',
          type: 'select',
          options: [
            { value: 'classic-gatsby', label: '1920 Gatsby Altın Çerçeve' },
            { value: 'retro-diamond', label: 'Baklava & Yelpaze Deseni' }
          ],
          defaultValue: 'classic-gatsby'
        },
        {
          id: 'goldShine',
          label: 'Altın Varak Yansıması',
          type: 'range',
          min: 20,
          max: 100,
          defaultValue: 80,
          unit: '%'
        },
        {
          id: 'doorOpacity',
          label: 'Kapı Cam Opaklığı',
          type: 'range',
          min: 50,
          max: 100,
          defaultValue: 95,
          unit: '%'
        },
        {
          id: 'shineSpeed',
          label: 'Parıldama Hızı',
          type: 'select',
          options: [
            { value: 'slow', label: 'Ağır & Lüks' },
            { value: 'fast', label: 'Hareketli' }
          ],
          defaultValue: 'slow'
        }
      ]
    };
  }

  if (normId === 'silkfabricreveal') {
    return {
      supportsColors: true,
      customControls: [
        {
          id: 'fabricColor',
          label: 'Kumaş Rengi',
          type: 'color',
          defaultValue: '#ec4899'
        },
        {
          id: 'foldDensity',
          label: 'Kırışıklık & Kat Kat Yoğunluğu',
          type: 'range',
          min: 2,
          max: 10,
          defaultValue: 5,
          unit: 'kat'
        },
        {
          id: 'windForce',
          label: 'Rüzgar Savurma Şiddeti',
          type: 'range',
          min: 10,
          max: 100,
          defaultValue: 60,
          unit: '%'
        },
        {
          id: 'sweepDirection',
          label: 'Savrulma Yönü',
          type: 'select',
          options: [
            { value: 'up', label: 'Yukarıya Doğru Süzülerek' },
            { value: 'right', label: 'Sağa Doğru Çekilerek' },
            { value: 'diagonal', label: 'Çapraz Köşeye' }
          ],
          defaultValue: 'up'
        }
      ]
    };
  }

  if (normId === 'luxuryjewelrybox') {
    return {
      supportsColors: true,
      customControls: [
        {
          id: 'boxMaterial',
          label: 'Kutu Dış Kaplaması',
          type: 'select',
          options: [
            { value: 'mahogany-wood', label: 'Koyu Maun Ahşap Dokusu' },
            { value: 'classic-leather', label: 'Lüks Mat Deri' }
          ],
          defaultValue: 'classic-leather'
        },
        {
          id: 'velvetTone',
          label: 'İç Kadife Rengi',
          type: 'color',
          defaultValue: '#881337',
          description: 'Kutunun iç astar rengi'
        },
        {
          id: 'metallicDetails',
          label: 'Menteşe ve Kilit Detayı',
          type: 'select',
          options: [
            { value: 'brass', label: 'Eski Pirinç / Antik Altın' },
            { value: 'platinum', label: 'Gümüş & Platin Kaplama' }
          ],
          defaultValue: 'brass'
        },
        {
          id: 'openSpeed',
          label: 'Kapak Açılış Hızı',
          type: 'range',
          min: 1,
          max: 3,
          step: 0.2,
          defaultValue: 1.8,
          unit: 'saniye'
        },
        {
          id: 'sparkleIntensity',
          label: 'Mücevher Pırıltısı',
          type: 'range',
          min: 0,
          max: 100,
          defaultValue: 75,
          unit: '%'
        }
      ]
    };
  }

  if (normId === 'oceanpearlreveal') {
    return {
      supportsColors: true,
      customControls: [
        {
          id: 'waterTurbulence',
          label: 'Deniz Dalgalanma Gücü',
          type: 'range',
          min: 10,
          max: 100,
          defaultValue: 40,
          unit: '%'
        },
        {
          id: 'causticsIntensity',
          label: 'Yakamoz Işık Yoğunluğu',
          type: 'range',
          min: 0,
          max: 100,
          defaultValue: 70,
          unit: '%'
        },
        {
          id: 'pearlLuster',
          label: 'Sedef / İnci Parlaklığı',
          type: 'range',
          min: 30,
          max: 100,
          defaultValue: 80,
          unit: '%'
        },
        {
          id: 'surfaceWaveSpeed',
          label: 'Dalga Akış Hızı',
          type: 'select',
          options: [
            { value: 'calm', label: 'Sakin Dalgalı Deniz' },
            { value: 'breezy', label: 'Esintili & Akıcı' }
          ],
          defaultValue: 'calm'
        }
      ]
    };
  }

  if (normId === 'minimalarchitecturallines') {
    return {
      supportsColors: true,
      customControls: [
        {
          id: 'lineWeight',
          label: 'Çizgi Kalınlığı',
          type: 'range',
          min: 1,
          max: 5,
          defaultValue: 2,
          unit: 'px'
        },
        {
          id: 'strokeAnimationSpeed',
          label: 'Çizim Hızı',
          type: 'range',
          min: 1,
          max: 4,
          defaultValue: 2.2,
          unit: 's'
        },
        {
          id: 'geometryBaseShape',
          label: 'Ana Geometrik Form',
          type: 'select',
          options: [
            { value: 'grid', label: 'Akademik Mimari Grid Çizgileri' },
            { value: 'isometric', label: 'İzometrik Küp Kesişimleri' },
            { value: 'minimal-arch', label: 'Yaylar ve Daire Katmanları' }
          ],
          defaultValue: 'grid'
        },
        {
          id: 'accentColorTone',
          label: 'Vurgu Çizgisi Rengi',
          type: 'color',
          defaultValue: '#4b5563'
        }
      ]
    };
  }

  if (normId === 'ottomanelegance') {
    return {
      supportsColors: true,
      customControls: [
        {
          id: 'motifDensity',
          label: 'Tezhip Deseni Sıklığı',
          type: 'range',
          min: 10,
          max: 100,
          defaultValue: 70,
          unit: '%'
        },
        {
          id: 'patternType',
          label: 'Geleneksel Motif Türü',
          type: 'select',
          options: [
            { value: 'rumi', label: 'Klasik Rumi Motifleri' },
            { value: 'hatai', label: 'Altın Hatai & Çiçek Varakları' },
            { value: 'seljuk-star', label: 'Selçuklu Geometrik Geçmeleri' }
          ],
          defaultValue: 'rumi'
        },
        {
          id: 'goldGildingStyle',
          label: 'Altın Varak Parlaklık Türü',
          type: 'select',
          options: [
            { value: 'polished', label: 'Parlak Ezme Altın' },
            { value: 'matte-antique', label: 'Mat Matruş Küf Altını' }
          ],
          defaultValue: 'polished'
        },
        {
          id: 'domeScale',
          label: 'Kubbe Motif Ölçeği',
          type: 'range',
          min: 60,
          max: 140,
          defaultValue: 100,
          unit: '%'
        }
      ]
    };
  }

  if (normId === 'lanternnight') {
    return {
      supportsColors: true,
      customControls: [
        {
          id: 'lanternCount',
          label: 'Gökyüzündeki Fener Sayısı',
          type: 'range',
          min: 5,
          max: 30,
          defaultValue: 12,
          unit: 'fener'
        },
        {
          id: 'lanternFlameWarmth',
          label: 'Alev Sıcaklık Rengi',
          type: 'color',
          defaultValue: '#ea580c'
        },
        {
          id: 'floatSpeed',
          label: 'Yükselme Hızı',
          type: 'range',
          min: 5,
          max: 20,
          defaultValue: 10,
          unit: 's'
        },
        {
          id: 'fireflyDensity',
          label: 'Ateş Böceği Işıltısı',
          type: 'range',
          min: 0,
          max: 100,
          defaultValue: 50,
          unit: '%'
        }
      ]
    };
  }

  if (normId === 'waxsealstarfield') {
    return {
      supportsColors: true,
      supportsSeal: true,
      supportsSpeed: true,
      supportsText: true,
      supportsIntensity: true,
      customControls: [
        {
          id: 'envelopeColor',
          label: 'Zarf Rengi',
          type: 'color',
          defaultValue: '#1e293b',
          description: 'Zarf gövdesi ve kapak ana tonu'
        },
        {
          id: 'waxColor',
          label: 'Wax Mühür Rengi',
          type: 'color',
          defaultValue: '#d97706',
          description: '3D metalik wax mühür pigmenti'
        },
        {
          id: 'sealInitial',
          label: 'Mühür Üzerindeki Harf / Monogram',
          type: 'text',
          defaultValue: '',
          description: 'Örn: A&M veya boş bırakın'
        },
        {
          id: 'paperTone',
          label: 'İç Kart Kağıt Dokusu',
          type: 'select',
          options: [
            { value: 'ivory', label: 'Fildişi Dokulu (Ivory)' },
            { value: 'kraft', label: 'Rustik Doğal Kraft' },
            { value: 'marble', label: 'Lüks Mermer Dokusu' },
            { value: 'dark-velvet', label: 'Mat Siyah Kadife' },
            { value: 'linen', label: 'Organik Keten' }
          ],
          defaultValue: 'ivory'
        },
        {
          id: 'openingText',
          label: 'Açılış Karşılama Metni',
          type: 'text',
          defaultValue: 'Davetiyenizi Açmak İçin Dokunun',
          description: 'Mührün altında beliren kılavuz yazı'
        },
        {
          id: 'starDensity',
          label: 'Yıldız Parıltı Miktarı',
          type: 'range',
          min: 20,
          max: 150,
          defaultValue: 70,
          unit: 'adet'
        },
        {
          id: 'celestialBody',
          label: 'Gökyüzü Teması',
          type: 'select',
          options: [
            { value: 'full-moon', label: 'Dolunay & Gümüş Parıltı' },
            { value: 'crescent-star', label: 'Hilal & Takımyıldızı' },
            { value: 'cosmic-nebula', label: 'Kozmik Altın Tozu' }
          ],
          defaultValue: 'crescent-star'
        },
        {
          id: 'sparkleColor',
          label: 'Yıldız Işıltı Tonu',
          type: 'color',
          defaultValue: '#fde047'
        }
      ]
    };
  }

  if (normId.includes('waxseal') || normId.includes('envelope') || normId.includes('zarf') || normId.includes('mühür')) {
    return {
      supportsColors: true,
      supportsSeal: true,
      supportsSpeed: true,
      supportsText: true,
      supportsIntensity: true,
      customControls: [
        {
          id: 'envelopeColor',
          label: 'Zarf Rengi',
          type: 'color',
          defaultValue: '#1e293b',
          description: 'Zarf gövdesi ve kapak ana tonu'
        },
        {
          id: 'waxColor',
          label: 'Wax Mühür Rengi',
          type: 'color',
          defaultValue: '#d97706',
          description: '3D metalik wax mühür pigmenti'
        },
        {
          id: 'sealInitial',
          label: 'Mühür Üzerindeki Harf / Monogram',
          type: 'text',
          defaultValue: '',
          description: 'Örn: A&M veya boş bırakın'
        },
        {
          id: 'paperTone',
          label: 'İç Kart Kağıt Dokusu',
          type: 'select',
          options: [
            { value: 'ivory', label: 'Fildişi Dokulu (Ivory)' },
            { value: 'kraft', label: 'Rustik Doğal Kraft' },
            { value: 'marble', label: 'Lüks Mermer Dokusu' },
            { value: 'dark-velvet', label: 'Mat Siyah Kadife' },
            { value: 'linen', label: 'Organik Keten' }
          ],
          defaultValue: 'ivory'
        },
        {
          id: 'openingText',
          label: 'Açılış Karşılama Metni',
          type: 'text',
          defaultValue: 'Davetiyenizi Açmak İçin Dokunun',
          description: 'Mührün altında beliren kılavuz yazı'
        }
      ]
    };
  }

  if (normId.includes('curtain') || normId.includes('opera') || normId.includes('perde')) {
    return {
      supportsColors: true,
      supportsSpeed: true,
      supportsText: true,
      supportsIntensity: true,
      customControls: [
        {
          id: 'curtainStyle',
          label: 'Perde Kumaş Tipi',
          type: 'select',
          options: [
            { value: 'velvet-royal', label: 'Bordo Kraliyet Kadifesi' },
            { value: 'silk-emerald', label: 'Zümrüt İpek Kumaş' },
            { value: 'noir-minimal', label: 'Minimalist Mat Siyah' },
            { value: 'gold-brocade', label: 'Altın Varaklı Jakar' }
          ],
          defaultValue: 'velvet-royal'
        },
        {
          id: 'curtainColor',
          label: 'Perde Tonu',
          type: 'color',
          defaultValue: '#881337'
        },
        {
          id: 'spotlight',
          label: 'Sahne Projektör Işığı (Spotlight)',
          type: 'boolean',
          defaultValue: true
        },
        {
          id: 'revealSpeed',
          label: 'Perde Açılma Hızı',
          type: 'select',
          options: [
            { value: 'slow', label: 'Görkemli & Yavaş (2.5s)' },
            { value: 'normal', label: 'Dengeli (1.6s)' },
            { value: 'fast', label: 'Dinamik & Hızlı (1.0s)' }
          ],
          defaultValue: 'normal'
        },
        {
          id: 'openingText',
          label: 'Sahne Başlık Yazısı',
          type: 'text',
          defaultValue: 'Perde Açılıyor...'
        }
      ]
    };
  }

  if (normId.includes('door') || normId.includes('gate') || normId.includes('palace') || normId.includes('kapi') || normId.includes('saray')) {
    return {
      supportsColors: true,
      supportsSpeed: true,
      supportsText: true,
      customControls: [
        {
          id: 'gateStyle',
          label: 'Kapı Materyali',
          type: 'select',
          options: [
            { value: 'gold-filigree', label: 'Altın Telkari Saray Kapısı' },
            { value: 'wrought-iron', label: 'Ferforje Bahçe Kemeri' },
            { value: 'antique-wood', label: 'Antik Ahşap Kapı' },
            { value: 'modern-glass', label: 'Modern Şeffaf Cam Kanatlar' }
          ],
          defaultValue: 'gold-filigree'
        },
        {
          id: 'emblemType',
          label: 'Kapı Arması / Tokmak',
          type: 'select',
          options: [
            { value: 'royal-crown', label: 'Kraliyet Tacı' },
            { value: 'vintage-lion', label: 'Aslan Başı Tokmak' },
            { value: 'monogram-crest', label: 'Çift Monogramı' },
            { value: 'none', label: 'Sade & Armasız' }
          ],
          defaultValue: 'royal-crown'
        },
        {
          id: 'beamIntensity',
          label: 'Açılış Işık Hüzmesi',
          type: 'range',
          min: 0,
          max: 100,
          defaultValue: 75,
          unit: '%'
        }
      ]
    };
  }

  if (normId.includes('film') || normId.includes('cinema') || normId.includes('premiere') || normId.includes('gala')) {
    return {
      supportsColors: true,
      supportsSpeed: true,
      supportsText: true,
      customControls: [
        {
          id: 'filmAtmosphere',
          label: 'Film Atmosferi',
          type: 'select',
          options: [
            { value: 'classic-hollywood', label: 'Klasik Hollywood Altın Çağ' },
            { value: 'vintage-sepia', label: 'Nostaljik 8mm Sepya' },
            { value: 'modern-premiere', label: 'Modern Kırmızı Halı Galası' }
          ],
          defaultValue: 'classic-hollywood'
        },
        {
          id: 'projectorLight',
          label: 'Projektör Işık Hüzmesi',
          type: 'boolean',
          defaultValue: true
        },
        {
          id: 'openingTitle',
          label: 'Gala Başlık Yazısı',
          type: 'text',
          defaultValue: 'BÜYÜK GÜNÜN FİLMİ'
        }
      ]
    };
  }

  if (normId.includes('botanical') || normId.includes('blossom') || normId.includes('flower') || normId.includes('petal') || normId.includes('cicek')) {
    return {
      supportsColors: true,
      supportsIntensity: true,
      supportsSpeed: true,
      customControls: [
        {
          id: 'flowerType',
          label: 'Çiçek & Yaprak Türü',
          type: 'select',
          options: [
            { value: 'rose-petals', label: 'Kırmızı & Pembe Gül Yaprakları' },
            { value: 'sakura', label: 'Japon Kiraz Çiçeği (Sakura)' },
            { value: 'olive-leaves', label: 'Ege Zeytin Dalları' },
            { value: 'eucalyptus', label: 'Zarif Okaliptüs Yaprakları' }
          ],
          defaultValue: 'rose-petals'
        },
        {
          id: 'petalDensity',
          label: 'Düşen Yaprak Yoğunluğu',
          type: 'select',
          options: [
            { value: 'subtle', label: 'Hafif & Zarif (10 yaprak)' },
            { value: 'medium', label: 'Dengeli (24 yaprak)' },
            { value: 'rich', label: 'Zengin & Dolgun (40 yaprak)' }
          ],
          defaultValue: 'medium'
        },
        {
          id: 'fallingSpeed',
          label: 'Süzülme Hızı',
          type: 'select',
          options: [
            { value: 'gentle', label: 'Yavaş & Sakin' },
            { value: 'lively', label: 'Dinamik' }
          ],
          defaultValue: 'gentle'
        }
      ]
    };
  }

  if (normId.includes('star') || normId.includes('night') || normId.includes('celestial') || normId.includes('moon') || normId.includes('yildiz')) {
    return {
      supportsColors: true,
      supportsIntensity: true,
      customControls: [
        {
          id: 'starDensity',
          label: 'Yıldız Parıltı Miktarı',
          type: 'range',
          min: 20,
          max: 150,
          defaultValue: 70,
          unit: 'adet'
        },
        {
          id: 'celestialBody',
          label: 'Gökyüzü Teması',
          type: 'select',
          options: [
            { value: 'full-moon', label: 'Dolunay & Gümüş Parıltı' },
            { value: 'crescent-star', label: 'Hilal & Takımyıldızı' },
            { value: 'cosmic-nebula', label: 'Kozmik Altın Tozu' }
          ],
          defaultValue: 'crescent-star'
        },
        {
          id: 'sparkleColor',
          label: 'Yıldız Işıltı Tonu',
          type: 'color',
          defaultValue: '#fde047'
        }
      ]
    };
  }

  if (normId.includes('story') || normId.includes('book') || normId.includes('kitap') || normId.includes('masal')) {
    return {
      supportsColors: true,
      supportsText: true,
      customControls: [
        {
          id: 'bookCoverColor',
          label: 'Kitap Kapağı Rengi',
          type: 'color',
          defaultValue: '#1e3a8a'
        },
        {
          id: 'flipStyle',
          label: 'Sayfa Çevrilme Hareketi',
          type: 'select',
          options: [
            { value: '3d-curl', label: '3D Gerçekçi Sayfa Kıvrılması' },
            { value: 'smooth-open', label: 'Pürüzsüz İki Yana Açılış' }
          ],
          defaultValue: '3d-curl'
        },
        {
          id: 'coverTitle',
          label: 'Kitap Kapağı Başlığı',
          type: 'text',
          defaultValue: 'Bizim Hikayemiz'
        }
      ]
    };
  }

  if (normId.includes('henna') || normId.includes('velvet') || normId.includes('kina')) {
    return {
      supportsColors: true,
      supportsText: true,
      customControls: [
        {
          id: 'velvetTone',
          label: 'Kadife Zemin Tonu',
          type: 'select',
          options: [
            { value: 'bordeaux', label: 'Derin Bordo Kadife' },
            { value: 'emerald', label: 'Zümrüt Yeşili Kadife' },
            { value: 'night-black', label: 'Gece Siyahı & Altın' }
          ],
          defaultValue: 'bordeaux'
        },
        {
          id: 'orientalMotif',
          label: 'Geleneksel Kına Motifi',
          type: 'select',
          options: [
            { value: 'gold-paisley', label: 'Altın Varaklı Şal Deseni' },
            { value: 'ottoman-tulip', label: 'Osmanlı Lalesi & Tezhip' },
            { value: 'moroccan-arch', label: 'Fas Saray Kemeri' }
          ],
          defaultValue: 'gold-paisley'
        },
        {
          id: 'hennaNote',
          label: 'Karşılama Metni',
          type: 'text',
          defaultValue: 'Kına Gecemize Hoş Geldiniz'
        }
      ]
    };
  }

  // Generic fallback for any other animation
  return {
    supportsColors: true,
    supportsSpeed: true,
    supportsText: true,
    customControls: [
      {
        id: 'accentColor',
        label: 'Animasyon Vurgu Rengi',
        type: 'color',
        defaultValue: '#d97706'
      },
      {
        id: 'openingText',
        label: 'Açılış Başlık Metni',
        type: 'text',
        defaultValue: 'Davetiyeyi Görüntüle'
      },
      {
        id: 'animationSpeed',
        label: 'Oynatma Hızı',
        type: 'select',
        options: [
          { value: 'slow', label: 'Yavaş & Zarif' },
          { value: 'normal', label: 'Normal' },
          { value: 'fast', label: 'Hızlı' }
        ],
        defaultValue: 'normal'
      }
    ]
  };
}

export function getAnimationDefaults(animationId: string): Record<string, any> {
  const caps = getAnimationCapabilities(animationId);
  const defaults: Record<string, any> = {};
  for (const ctrl of caps.customControls) {
    defaults[ctrl.id] = ctrl.defaultValue;
  }
  return defaults;
}

