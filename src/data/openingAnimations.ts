export interface EntranceAnimationType {
  id: string;
  name: string;
  description: string;
  icon: string;
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
  {
    id: "envelope",
    name: "Zarf Açılışı",
    description: "Mühürlü zarf açılır, davetiye kartı zarifçe ortaya çıkar.",
    icon: "envelope",
  },
  {
    id: "curtain",
    name: "Perde Açılışı",
    description: "Perde iki yana açılır, davetiye sahne ışığıyla görünür.",
    icon: "curtain",
  },
  {
    id: "door",
    name: "Kapı Açılışı",
    description: "Karakteristik kapılar açılır, davetiye içeriden ışıkla belirir.",
    icon: "door",
  },
  {
    id: "gardenGate",
    name: "Bahçe Kapısı",
    description: "Bahçe kapısı açılır, davetiye doğa atmosferinde görünür.",
    icon: "garden",
  },
  {
    id: "book",
    name: "Kitap Açılışı",
    description: "Kitap kapağı açılır, davetiye sayfadan yükselir.",
    icon: "book",
  },
  {
    id: "luxuryBox",
    name: "Hediye Kutusu",
    description: "Kutu kapağı açılır, davetiye içinden çıkar.",
    icon: "box",
  },
  {
    id: "glass",
    name: "Cam Reveal",
    description: "Cam yüzey netleşir, davetiye görünür.",
    icon: "glass",
  },
  {
    id: "mirror",
    name: "Ayna Reveal",
    description: "Ayna yansıması netleşir ve davetiye ortaya çıkar.",
    icon: "mirror",
  },
  {
    id: "cinematicZoom",
    name: "Sinematik Zoom",
    description: "Kamera davetiyeye yaklaşır ve görüntü netleşir.",
    icon: "zoom",
  },
  {
    id: "spotlight",
    name: "Spotlight",
    description: "Sahne ışığı davetiyeyi karanlıktan ortaya çıkarır.",
    icon: "spotlight",
  },
  {
    id: "starryNight",
    name: "Yıldızlı Gece",
    description: "Yıldızlar ve ay ışığıyla romantik açılış yapılır.",
    icon: "stars",
  },
  {
    id: "minimalFade",
    name: "Minimal Fade",
    description: "Sade ve hızlı premium geçiş efekti kullanılır.",
    icon: "minimal",
  },
  {
    id: "cinematicText",
    name: "🎬 Sinematik İsimler",
    description: "Karanlık zarif arkaplanda isimler, tıklayınca davetiyeye geçer.",
    icon: "cinematic",
  },
  {
    id: "photoCover",
    name: "📸 Fotoğraf Kapağı",
    description: "Fotoğraflı kapak üzerinde isimler yer alır.",
    icon: "photo",
  },
  {
    id: "sealOnly",
    name: "🎯 Sadece Mühür",
    description: "Süzülen zarif bir mühür ile açılış başlatılır.",
    icon: "seal",
  },
  {
    id: "cloudBaloon",
    name: "☁️ Bulut ve Balon Açılışı",
    description: "Bulutlar, uçan balonlar ve tatlı yıldızlarla sevimli çocuk açılışı.",
    icon: "cloud",
  },
  {
    id: "teddyBear",
    name: "🧸 Sevimli Ayıcık Rozeti",
    description: "Tatlı ayıcık rozeti ve yumuşak bulut parıltısı ile açılış.",
    icon: "teddy",
  },
  {
    id: "cinematicFilm",
    name: "🎬 Sinematik Film Perdesi",
    description: "Film perdesi, projektör ışığı ve afiş reveal ile görkemli açılış.",
    icon: "cinema",
  },
  {
    id: "royalParchment",
    name: "📜 Kraliyet Mektubu & Mühür",
    description: "Kraliyet parşömeni, altın mühür ve kurdele çözülmesi.",
    icon: "royal",
  },
  {
    id: "botanicalBlossom",
    name: "🌿 Çiçekli Bahçe Kapısı",
    description: "Açılan çiçek taçları ve botanik bahçe kapısı reveal.",
    icon: "flower",
  },
  {
    id: "hennaVelvetGate",
    name: "🍷 Bordo Kadife Perde & Gül",
    description: "Bordo kadife perde, oryantal parıltı ve uçuşan gül yaprakları.",
    icon: "henna",
  },
  {
    id: "nazarDome",
    name: "🧿 Nazar Boncuğu & Şehzade Kubbe",
    description: "Maşallah rozeti, nazar boncuğu ve şehzade kubbe açılışı.",
    icon: "nazar",
  },
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
