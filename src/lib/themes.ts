import { BackgroundDesign, ThematicAsset, AnimationPreset, SealPreset, TypographyPreset } from './registries';

export type EventType = 'wedding' | 'engagement' | 'henna' | 'circumcision' | 'baby_shower' | 'birthday' | 'corporate' | 'graduation';

export const eventTypeLabels: Record<EventType, string> = {
  wedding: "Düğün",
  engagement: "Nişan",
  henna: "Kına Gecesi",
  circumcision: "Sünnet Düğünü",
  baby_shower: "Baby Shower",
  birthday: "Doğum Günü",
  corporate: "Kurumsal Etkinlik",
  graduation: "Mezuniyet Töreni",
};

export function mapDbEventTypeToEnum(dbVal: string): EventType {
  const val = (dbVal || '').toLowerCase();
  if (val.includes('düğün') || val.includes('wedding') || val.includes('nikah')) return 'wedding';
  if (val.includes('nişan') || val.includes('engagement') || val.includes('söz')) return 'engagement';
  if (val.includes('kına') || val.includes('henna')) return 'henna';
  if (val.includes('sünnet') || val.includes('circumcision')) return 'circumcision';
  if (val.includes('baby') || val.includes('shower')) return 'baby_shower';
  if (val.includes('doğum') || val.includes('birthday') || val.includes('yaş')) return 'birthday';
  if (val.includes('kurumsal') || val.includes('corporate') || val.includes('lansman') || val.includes('davet') || val.includes('özel')) return 'corporate';
  if (val.includes('mezuniyet') || val.includes('graduation')) return 'graduation';
  return 'wedding'; // default fallback
}

export function mapEnumToDbEventType(enumVal: EventType): string {
  switch (enumVal) {
    case 'wedding': return 'Düğün';
    case 'engagement': return 'Nişan';
    case 'henna': return 'Kına';
    case 'circumcision': return 'Sünnet';
    case 'baby_shower': return 'Baby Shower';
    case 'birthday': return 'Doğum Günü';
    case 'corporate': return 'Kurumsal Etkinlik';
    case 'graduation': return 'Mezuniyet';
    default: return 'Düğün';
  }
}

export interface TemplateColorPalette {
  background: string;
  surface: string;
  surfaceSecondary: string;

  primaryText: string;
  secondaryText: string;
  mutedText: string;

  accent: string;
  accentContrast: string;

  border: string;
  buttonBackground: string;
  buttonText: string;

  countdownBackground: string;
  countdownText: string;

  overlay: string;
}

export interface ColorVariant {
  id: string;
  name: string;
  colorPalette?: TemplateColorPalette;
  thumbnail?: string;
}

export interface ExtendedTemplateDesignSignature {
  composition: string;
  desktopGrid: string;
  mobileFlow: string;
  contentOrder: string[];
  namePlacement: string;
  eventTitlePlacement: string;
  datePlacement: string;
  countdownStyle: string;
  countdownPlacement: string;
  actionPlacement: string;
  actionShape: string;
  venuePresentation: string;
  heroElement: string;
  photoUsage: string;
  openingAnimation: string;
}

export interface TemplateVisualContract {
  id: string;
  desktopComposition: string;
  mobileComposition: string;
  heroElement: string;
  contentOrder: string[];
  countdownDesign: string;
  actionDesign: string;
  openingAnimation: string;
  visualDifferenceFromExistingTemplates: string[];
}

export interface CustomOverrides {
  content?: {
    timelineItems?: any[];
    speakers?: any[];
    sponsors?: any[];
    gallery?: any[];
    customTexts?: Record<string, string>;
    bridePhotoUrl?: string;
    groomPhotoUrl?: string;
    bgImageUrl?: string;
    brideName?: string;
    groomName?: string;
    brideParents?: string;
    groomParents?: string;
    venueName?: string;
    venueAddress?: string;
    googleMapsUrl?: string;
    bankIban?: string;
  };
  design?: {
    layoutStyle?: string;
    backgroundDesign?: string;
  backgroundOptions?: TemplateBackgroundVariant[];
  defaultBackground?: string;
  mediaSupport?: 'none' | 'cover' | 'background';
    colorPalette?: TemplateColorPalette;
    typography?: string;
    sealPreset?: string;
    animationPreset?: string;
    thematicAssets?: string[];
    selectedColorVariantId?: string;
  };
  [key: string]: any;
}

export interface TemplateSimilarityResult {
  templateA: string;
  templateB: string;
  score: number;
  conflictingFields: string[];
}

export function calculateTemplateSimilarity(a: TemplatePreset, b: TemplatePreset): TemplateSimilarityResult {
  let score = 0;
  const conflictingFields: string[] = [];

  const weightMap: Record<string, number> = {
    composition: 15,
    desktopGrid: 10,
    mobileFlow: 10,
    contentOrder: 15, // Arrays need special comparison, handled below
    namePlacement: 10,
    eventTitlePlacement: 5,
    datePlacement: 5,
    countdownStyle: 10,
    countdownPlacement: 5,
    actionPlacement: 5,
    actionShape: 5,
    venuePresentation: 5,
    heroElement: 10,
    photoUsage: 5,
    openingAnimation: 5
  };

  if (a.designSignature && b.designSignature) {
    Object.keys(weightMap).forEach((key) => {
      const aVal = (a.designSignature as any)[key];
      const bVal = (b.designSignature as any)[key];
      
      if (key === 'contentOrder' && Array.isArray(aVal) && Array.isArray(bVal)) {
        if (JSON.stringify(aVal) === JSON.stringify(bVal)) {
          score += weightMap[key];
          conflictingFields.push(key);
        }
      } else if (aVal && bVal && aVal === bVal) {
        score += weightMap[key];
        conflictingFields.push(key);
      }
    });
  }

  // Max score could be > 100 if layoutStyle matches as well, but we scale it roughly.
  if (a.layoutStyle === b.layoutStyle) {
    score += 20;
    conflictingFields.push("layoutStyle");
  }

  // Normalize score out of 100 max
  const maxPossible = Object.values(weightMap).reduce((acc, curr) => acc + curr, 0) + 20;
  const normalizedScore = Math.min(100, Math.round((score / maxPossible) * 100));

  return {
    templateA: a.id,
    templateB: b.id,
    score: normalizedScore,
    conflictingFields
  };
}


export interface TemplateBackgroundVariant {
  id: string;
  name: string;
  preview: string;
  background: string;
  colorPalette?: Partial<TemplateColorPalette>;
}

export interface TemplatePreset {
  id: string;
  name: string;
  thumbnail?: string;
  mobileThumbnail?: string;
  eventType: EventType;
  genderVariant?: 'girl' | 'boy' | 'neutral';
  layoutStyle: string;
  layoutMode?: "full-bleed" | "legacy-card";
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
  backgroundDesign?: string;
  backgroundOptions?: TemplateBackgroundVariant[];
  defaultBackground?: string;
  mediaSupport?: 'none' | 'cover' | 'background';

  thematicAssets?: string[];
  animationPreset?: string;
  sealPreset?: string;

  colorPalette?: TemplateColorPalette;
  colorVariants?: ColorVariant[];
  designSignature?: ExtendedTemplateDesignSignature;
  visualContract?: TemplateVisualContract;
  requiredAssets?: string[];

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


export const COMMON_BACKGROUNDS = {
  MARBLE_LIGHT: {
    id: 'marble-light',
    name: 'Beyaz Altın Mermer',
    preview: '/backgrounds/marble-gold-light.png',
    background: 'url(/backgrounds/marble-gold-light.png)',
    colorPalette: { background: '#ffffff', surface: '#ffffff', primaryText: '#1f2937', secondaryText: '#4b5563' }
  },
  MARBLE_DARK: {
    id: 'marble-dark',
    name: 'Siyah Altın Mermer',
    preview: '/backgrounds/marble-gold-dark.png',
    background: 'url(/backgrounds/marble-gold-dark.png)',
    colorPalette: { background: '#111827', surface: '#1f2937', primaryText: '#f3f4f6', secondaryText: '#9ca3af', surfaceSecondary: '#374151' }
  },
  MARBLE_SAGE: {
    id: 'marble-sage',
    name: 'Zümrüt Yeşili Mermer',
    preview: '/backgrounds/marble-gold-sage.png',
    background: 'url(/backgrounds/marble-gold-sage.png)',
    colorPalette: { background: '#064e3b', surface: '#065f46', primaryText: '#ecfdf5', secondaryText: '#a7f3d0' }
  },
  CANVAS_PAPER: {
    id: 'canvas-paper',
    name: 'Kanvas Kağıt',
    preview: '/backgrounds/canvas-paper.png',
    background: 'url(/backgrounds/canvas-paper.png) repeat',
    colorPalette: { background: '#fdfbf7' }
  },
  CARDBOARD: {
    id: 'cardboard-flat',
    name: 'Kraft Kağıt',
    preview: '/backgrounds/cardboard-flat.png',
    background: 'url(/backgrounds/cardboard-flat.png)',
    colorPalette: { background: '#d4bfa5', primaryText: '#4a3f35', secondaryText: '#6b5c51' }
  },
  LINEN: {
    id: 'linen',
    name: 'Keten Kumaş',
    preview: '/backgrounds/linen.png',
    background: 'url(/backgrounds/linen.png)',
    colorPalette: { background: '#f5f5f5' }
  },
  NIGHT_SKY: {
    id: 'night-sky',
    name: 'Koyu Gece Gökyüzü',
    preview: 'linear-gradient(to bottom, #020617, #0f172a)',
    background: 'linear-gradient(to bottom, #020617, #0f172a)',
    colorPalette: { background: '#020617', primaryText: '#ffffff', secondaryText: '#cbd5e1', surface: '#0f172a' }
  },
  SOFT_PINK: {
    id: 'soft-pink',
    name: 'Pastel Pembe',
    preview: 'linear-gradient(to bottom right, #fdf2f8, #fbcfe8)',
    background: 'linear-gradient(to bottom right, #fdf2f8, #fbcfe8)',
    colorPalette: { background: '#fdf2f8', primaryText: '#831843' }
  },
  ROYAL_VELVET: {
    id: 'royal-velvet',
    name: 'Kraliyet Kadifesi',
    preview: 'linear-gradient(135deg, #4c0519 0%, #7f1d1d 100%)',
    background: 'linear-gradient(135deg, #4c0519 0%, #7f1d1d 100%)',
    colorPalette: { background: '#4c0519', primaryText: '#fef2f2', secondaryText: '#fca5a5' }
  },
  MINIMAL_WHITE: {
    id: 'minimal-white',
    name: 'Saf Beyaz',
    preview: '#ffffff',
    background: '#ffffff',
    colorPalette: { background: '#ffffff', primaryText: '#000000', secondaryText: '#4b5563' }
  }
};

export const predefinedThemes: TemplatePreset[] = [
  {
    "id": "cinematic-poster",
    "name": "Sinematik Film Afişi",
    "thumbnail": "/templates/thumbnails/cinematic-poster.webp",
    "mobileThumbnail": "/templates/thumbnails/cinematic-poster-mobile.webp",
    "eventType": "wedding",
    "layoutStyle": "cinematic-poster",
    "layoutMode": "full-bleed",
    "category": "Lüks",
    "primary_color": "#ef4444",
    "text_color": "#ffffff",
    "font_family": "Montserrat",
    "names_font_family": "Cinzel",
    "background_image_url": null,
    "use_envelope": true,
    "envelope_color": "#18181b",
    "envelope_bg_color": "dark-cinema-vignette",
    "envelope_flap_type": "gold-monogram",
    "seal_type": "film-strip",
    "seal_color": "#dc2626",
    "recommendedOpeningType": "envelope",
    "recommendedOpeningStyle": "dark-luxury-gold",
    "recommendedBackgroundDesign": "dark-cinema-vignette",
    "recommendedBackgroundAnimation": "cinematicCurtain",
    "backgroundDesign": "dark-cinema-vignette",
    "thematicAssets": [
      "film-reel",
      "light-leak",
      "ticket-stub"
    ],
    "animationPreset": "curtain-fade",
    "sealPreset": "film-strip",
    "designSignature": {
      "composition": "poster",
      "desktopGrid": "split-right-heavy",
      "mobileFlow": "vertical-stack",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "top-aligned-poster",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "digital",
      "countdownPlacement": "above-action",
      "actionPlacement": "ticket-row",
      "actionShape": "coupon-stub",
      "venuePresentation": "movie-credit-block",
      "heroElement": "photo",
      "photoUsage": "full-bleed-background",
      "openingAnimation": "curtain-fade"
    },
    "colorVariants": [
      {
        "id": "red-carpet",
        "name": "Kırmızı Halı & Siyah"
      },
      {
        "id": "gold-premiere",
        "name": "Altın Gala Premier"
      }
    ],
    "visualContract": {
      "id": "cinematic-poster",
      "desktopComposition": "Full-screen couple photo hero, movie poster typography, credits block for parents/details, ticket-style RSVP, film curtain animation",
      "mobileComposition": "Vertical cinematic poster, cinema ticket RSVP button at bottom",
      "heroElement": "photo",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "countdownDesign": "digital-strip",
      "actionDesign": "ticket-coupon",
      "openingAnimation": "curtain-fade",
      "visualDifferenceFromExistingTemplates": [
        "Full-width poster typography",
        "Cast/crew credit line for parents",
        "Barcoded movie coupon LCV button"
      ]
    },
    "mediaSupport": "none"
  },
  {
    "id": "royal-letter",
    "name": "Kraliyet Mektubu",
    "thumbnail": "/templates/thumbnails/royal-letter.webp",
    "mobileThumbnail": "/templates/thumbnails/royal-letter-mobile.webp",
    "eventType": "wedding",
    "layoutStyle": "royal-letter",
    "layoutMode": "full-bleed",
    "category": "Klasik",
    "primary_color": "#78350f",
    "text_color": "#1c1917",
    "font_family": "Playfair Display",
    "names_font_family": "Great Vibes",
    "background_image_url": null,
    "use_envelope": true,
    "envelope_color": "#f5f5f4",
    "envelope_bg_color": "parchment-gold-royal",
    "envelope_flap_type": "gold-crest",
    "seal_type": "crown",
    "seal_color": "#78350f",
    "recommendedOpeningType": "envelope",
    "recommendedOpeningStyle": "royal-gold-crest",
    "recommendedBackgroundDesign": "parchment-gold-royal",
    "recommendedBackgroundAnimation": "waxSealBreak",
    "backgroundDesign": "parchment-gold-royal",
    "thematicAssets": [
      "wax-seal-crest",
      "silk-ribbon",
      "tassel-drop"
    ],
    "animationPreset": "letter-unroll",
    "sealPreset": "crown",
    "designSignature": {
      "composition": "folded",
      "desktopGrid": "centered-scroll",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "wax-seal",
        "royal-decree-header",
        "names",
        "calligraphy-quote",
        "pocketwatch-timer",
        "venue-scroll",
        "royal-stamp-rsvp",
        "guestbook"
      ],
      "namePlacement": "centered-calligraphy",
      "eventTitlePlacement": "top-crest",
      "datePlacement": "vertical-left",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "stamp-circle",
      "venuePresentation": "parchment-inset",
      "heroElement": "seal",
      "photoUsage": "none",
      "openingAnimation": "letter-unroll"
    },
    "colorVariants": [
      {
        "id": "royal-gold",
        "name": "Altın Parşömen"
      },
      {
        "id": "royal-blue-gold",
        "name": "Kraliyet Laciverti & Altın"
      }
    ],
    "visualContract": {
      "id": "royal-letter",
      "desktopComposition": "Folded vintage parchment unrolling texture, side vertical date, 3D wax seal with ribbon & tassel, calligraphic royal decree text",
      "mobileComposition": "Vertical unrolled royal decree, gold leaf filigree borders",
      "heroElement": "seal",
      "contentOrder": [
        "wax-seal",
        "royal-decree-header",
        "names",
        "calligraphy-quote",
        "pocketwatch-timer",
        "venue-scroll",
        "royal-stamp-rsvp",
        "guestbook"
      ],
      "countdownDesign": "pocketwatch",
      "actionDesign": "royal-stamp",
      "openingAnimation": "letter-unroll",
      "visualDifferenceFromExistingTemplates": [
        "3D wax seal with hanging tassel",
        "Royal decree filigree framing",
        "Unrolling scroll animation"
      ]
    },
    "mediaSupport": "background",
    "backgroundOptions": [COMMON_BACKGROUNDS.ROYAL_VELVET, COMMON_BACKGROUNDS.MARBLE_LIGHT, COMMON_BACKGROUNDS.MARBLE_DARK, COMMON_BACKGROUNDS.LINEN],
    "defaultBackground": "royal-velvet"
  },
  {
    "id": "polaroid-story",
    "name": "Polaroid Aşk Hikâyesi",
    "thumbnail": "/templates/thumbnails/polaroid-story.webp",
    "mobileThumbnail": "/templates/thumbnails/polaroid-story-mobile.webp",
    "eventType": "wedding",
    "layoutStyle": "polaroid-story",
    "layoutMode": "full-bleed",
    "category": "Doğal",
    "primary_color": "#e11d48",
    "text_color": "#1c1917",
    "font_family": "Inter",
    "names_font_family": "Caveat",
    "background_image_url": null,
    "use_envelope": true,
    "envelope_color": "#fafaf9",
    "envelope_bg_color": "craft-paper-polaroid",
    "envelope_flap_type": "heart",
    "seal_type": "camera-pin",
    "seal_color": "#e11d48",
    "recommendedOpeningType": "envelope",
    "recommendedOpeningStyle": "romantic-blush-rose",
    "recommendedBackgroundDesign": "craft-paper-polaroid",
    "recommendedBackgroundAnimation": "polaroidDrop",
    "backgroundDesign": "craft-paper-polaroid",
    "thematicAssets": [
      "polaroid-frame",
      "scotch-tape",
      "paperclip"
    ],
    "animationPreset": "polaroid-drop",
    "sealPreset": "camera-pin",
    "designSignature": {
      "composition": "timeline",
      "desktopGrid": "scattered-collage",
      "mobileFlow": "stacked-cards",
      "contentOrder": [
        "polaroid-hero",
        "names",
        "handwritten-date",
        "story-milestones-timeline",
        "polaroid-timer",
        "photo-rsvp-button",
        "guestbook"
      ],
      "namePlacement": "polaroid-caption",
      "eventTitlePlacement": "hidden",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "scattered",
      "actionPlacement": "inline",
      "actionShape": "polaroid-button",
      "venuePresentation": "polaroid-map",
      "heroElement": "photo",
      "photoUsage": "polaroid-frames",
      "openingAnimation": "polaroid-drop"
    },
    "colorVariants": [
      {
        "id": "vintage-rose",
        "name": "Vintage Rose & Beyaz"
      },
      {
        "id": "olive-wood",
        "name": "Zeytin Yeşili & Ahşap"
      }
    ],
    "visualContract": {
      "id": "polaroid-story",
      "desktopComposition": "Scattered angled polaroid photos, paperclips, scotch tape, handwritten notes, timeline below, polaroid drop animation",
      "mobileComposition": "Stacked polaroid cards, handwritten date, pin-card timer",
      "heroElement": "photo",
      "contentOrder": [
        "polaroid-hero",
        "names",
        "handwritten-date",
        "story-milestones-timeline",
        "polaroid-timer",
        "photo-rsvp-button",
        "guestbook"
      ],
      "countdownDesign": "photo-pins",
      "actionDesign": "polaroid-card",
      "openingAnimation": "polaroid-drop",
      "visualDifferenceFromExistingTemplates": [
        "Scotch tape & paperclip accents",
        "Handwritten font caption on photo frame",
        "Interactive love story timeline"
      ]
    },
    "mediaSupport": "cover"
  },
  {
    "id": "constellation-night",
    "name": "Gece Yıldızları Altında",
    "thumbnail": "/templates/thumbnails/constellation-night.webp",
    "mobileThumbnail": "/templates/thumbnails/constellation-night-mobile.webp",
    "eventType": "wedding",
    "layoutStyle": "constellation-night",
    "layoutMode": "full-bleed",
    "category": "Karanlık",
    "primary_color": "#38bdf8",
    "text_color": "#ffffff",
    "font_family": "Outfit",
    "names_font_family": "Cormorant Garamond",
    "background_image_url": null,
    "use_envelope": true,
    "envelope_color": "#030712",
    "envelope_bg_color": "celestial-deep-space",
    "envelope_flap_type": "star-moon",
    "seal_type": "star",
    "seal_color": "#38bdf8",
    "recommendedOpeningType": "envelope",
    "recommendedOpeningStyle": "dark-space-celestial",
    "recommendedBackgroundDesign": "celestial-deep-space",
    "recommendedBackgroundAnimation": "starDust",
    "backgroundDesign": "celestial-deep-space",
    "thematicAssets": [
      "constellation-map",
      "star-dust",
      "moon-phase"
    ],
    "animationPreset": "constellation-draw",
    "sealPreset": "star",
    "designSignature": {
      "composition": "asymmetric",
      "desktopGrid": "floating-panels",
      "mobileFlow": "glass-cards-stack",
      "contentOrder": [
        "constellation-hero",
        "names",
        "coordinates-date",
        "star-map-venue",
        "glass-timer",
        "glow-button-rsvp",
        "guestbook"
      ],
      "namePlacement": "floating-center",
      "eventTitlePlacement": "below-names",
      "datePlacement": "floating",
      "countdownStyle": "bubbles",
      "countdownPlacement": "floating-bottom",
      "actionPlacement": "bottom-bar",
      "actionShape": "glow-pill",
      "venuePresentation": "glassmorphic-card",
      "heroElement": "illustration",
      "photoUsage": "glass-inset",
      "openingAnimation": "constellation-draw"
    },
    "colorVariants": [
      {
        "id": "midnight-cyan",
        "name": "Gece Yarısı Siyan Mavi"
      },
      {
        "id": "starlight-gold",
        "name": "Yıldız Işığı Altın"
      }
    ],
    "visualContract": {
      "id": "constellation-night",
      "desktopComposition": "Star map background, sky coordinate date, glassmorphism cards, stardust particles animation",
      "mobileComposition": "Deep space celestial grid, shining star dust, glass cards",
      "heroElement": "illustration",
      "contentOrder": [
        "star-map",
        "celestial-title",
        "coordinate-date",
        "constellation-quote",
        "stardust-timer",
        "glass-location",
        "shining-rsvp-button",
        "guestbook"
      ],
      "countdownDesign": "stardust-bubbles",
      "actionDesign": "shining-glass-pill",
      "openingAnimation": "constellation-draw",
      "visualDifferenceFromExistingTemplates": [
        "Star map & constellation SVG overlay",
        "Coordinate-style date display",
        "Shining stardust bubble timer"
      ]
    },
    "mediaSupport": "none"
  },
  {
    "id": "clouds-above",
    "name": "Bulutların Üzerinde",
    "thumbnail": "/templates/thumbnails/clouds-above.webp",
    "eventType": "baby_shower",
    "layoutStyle": "kids-thematic",
    "layoutMode": "full-bleed",
    "backgroundDesign": "pastel-clouds",
    "category": "Çocuk",
    "primary_color": "#38bdf8",
    "text_color": "#0f172a",
    "font_family": "Outfit",
    "background_image_url": null,
    "use_envelope": true,
    "envelope_color": "#e0f2fe",
    "envelope_bg_color": "solid-blush",
    "envelope_flap_type": "heart",
    "seal_type": "heart",
    "seal_color": "#38bdf8",
    "recommendedOpeningType": "envelope",
    "recommendedOpeningStyle": "rose-gold-romantic",
    "recommendedBackgroundDesign": "solid-blush",
    "recommendedBackgroundAnimation": "rosePetals",
    "thematicAssets": [
      "cloud-left",
      "cloud-right",
      "balloons",
      "stars"
    ],
    "animationPreset": "balloon-rise",
    "sealPreset": "heart",
    "palette": {
      "background": "#f0f9ff",
      "card": "#ffffff",
      "primary": "#0284c7",
      "secondary": "#38bdf8",
      "accent": "#e0f2fe",
      "text": "#0f172a",
      "mutedText": "#0369a1"
    },
    "typography": {
      "heading": "Outfit",
      "body": "Inter",
      "accent": "Allura"
    },
    "visualDetails": {
      "border": "soft-round-border",
      "seal": "wax-heart",
      "cardShape": "rounded-2xl",
      "texture": "silk-paper"
    },
    "designSignature": {
      "composition": "premium-upgraded",
      "desktopGrid": "flexible",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "hero",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "rounded",
      "venuePresentation": "cards",
      "heroElement": "photo",
      "photoUsage": "background",
      "openingAnimation": "fade"
    },
    "colorVariants": [
      {
        "id": "clouds-above-var-1",
        "name": "Standart"
      },
      {
        "id": "clouds-above-var-2",
        "name": "Gece Modu"
      }
    ],
    "mediaSupport": "background",
    "backgroundOptions": [COMMON_BACKGROUNDS.SOFT_PINK, COMMON_BACKGROUNDS.CANVAS_PAPER, COMMON_BACKGROUNDS.MINIMAL_WHITE],
    "defaultBackground": "soft-pink"
  },
  {
    "id": "little-racer",
    "name": "Küçük Yarışçı",
    "thumbnail": "/templates/thumbnails/little-racer.webp",
    "eventType": "birthday",
    "layoutStyle": "kids-thematic",
    "layoutMode": "full-bleed",
    "backgroundDesign": "playful-checkered",
    "category": "Çocuk",
    "primary_color": "#ef4444",
    "text_color": "#1e293b",
    "font_family": "Outfit",
    "background_image_url": null,
    "use_envelope": true,
    "envelope_color": "#f8fafc",
    "envelope_bg_color": "minimal-white-paper",
    "envelope_flap_type": "square",
    "seal_type": "minimal-monogram",
    "seal_color": "#ef4444",
    "recommendedOpeningType": "minimalFade",
    "recommendedOpeningStyle": "minimal-white",
    "recommendedBackgroundDesign": "minimal-white-paper",
    "recommendedBackgroundAnimation": "pearlLight",
    "thematicAssets": [
      "race-car",
      "checkered-flag",
      "trophy"
    ],
    "animationPreset": "car-drift",
    "sealPreset": "monogram",
    "palette": {
      "background": "#f1f5f9",
      "card": "#ffffff",
      "primary": "#ef4444",
      "secondary": "#cbd5e1",
      "accent": "#f8fafc",
      "text": "#1e293b",
      "mutedText": "#64748b"
    },
    "typography": {
      "heading": "Outfit",
      "body": "Inter",
      "accent": "Allura"
    },
    "visualDetails": {
      "border": "racing-stripe-border",
      "seal": "checkered-seal",
      "cardShape": "sharp-corners",
      "texture": "fine-paper"
    },
    "designSignature": {
      "composition": "premium-upgraded",
      "desktopGrid": "flexible",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "hero",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "rounded",
      "venuePresentation": "cards",
      "heroElement": "photo",
      "photoUsage": "background",
      "openingAnimation": "fade"
    },
    "colorVariants": [
      {
        "id": "little-racer-var-1",
        "name": "Standart"
      },
      {
        "id": "little-racer-var-2",
        "name": "Gece Modu"
      }
    ],
    "mediaSupport": "background",
    "backgroundOptions": [COMMON_BACKGROUNDS.SOFT_PINK, COMMON_BACKGROUNDS.CANVAS_PAPER, COMMON_BACKGROUNDS.MINIMAL_WHITE],
    "defaultBackground": "soft-pink"
  },
  {
    "id": "blue-bear",
    "name": "Mavi Ayıcık",
    "thumbnail": "/templates/thumbnails/blue-bear.webp",
    "eventType": "baby_shower",
    "layoutStyle": "kids-thematic",
    "layoutMode": "full-bleed",
    "backgroundDesign": "cute-bear-bg",
    "category": "Çocuk",
    "primary_color": "#60a5fa",
    "text_color": "#1e3a8a",
    "font_family": "Outfit",
    "background_image_url": null,
    "use_envelope": true,
    "envelope_color": "#eff6ff",
    "envelope_bg_color": "solid-blush",
    "envelope_flap_type": "round",
    "seal_type": "bear-seal",
    "seal_color": "#60a5fa",
    "recommendedOpeningType": "envelope",
    "recommendedOpeningStyle": "minimal-white",
    "recommendedBackgroundDesign": "solid-blush",
    "recommendedBackgroundAnimation": "none",
    "thematicAssets": [
      "cute-bear",
      "crescent-moon",
      "star-cluster"
    ],
    "animationPreset": "swaying-star",
    "sealPreset": "bear-wax",
    "palette": {
      "background": "#eff6ff",
      "card": "#ffffff",
      "primary": "#1d4ed8",
      "secondary": "#93c5fd",
      "accent": "#eff6ff",
      "text": "#1e3a8a",
      "mutedText": "#2563eb"
    },
    "typography": {
      "heading": "Outfit",
      "body": "Inter",
      "accent": "Allura"
    },
    "visualDetails": {
      "border": "soft-cloud-border",
      "seal": "bear-face-wax",
      "cardShape": "rounded-3xl",
      "texture": "felt-paper"
    },
    "designSignature": {
      "composition": "premium-upgraded",
      "desktopGrid": "flexible",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "hero",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "rounded",
      "venuePresentation": "cards",
      "heroElement": "photo",
      "photoUsage": "background",
      "openingAnimation": "fade"
    },
    "colorVariants": [
      {
        "id": "blue-bear-var-1",
        "name": "Standart"
      },
      {
        "id": "blue-bear-var-2",
        "name": "Gece Modu"
      }
    ],
    "mediaSupport": "background",
    "backgroundOptions": [COMMON_BACKGROUNDS.SOFT_PINK, COMMON_BACKGROUNDS.CANVAS_PAPER, COMMON_BACKGROUNDS.MINIMAL_WHITE],
    "defaultBackground": "soft-pink"
  },
  {
    "id": "pink-princess",
    "name": "Pembe Prenses",
    "thumbnail": "/templates/thumbnails/pink-princess.webp",
    "eventType": "birthday",
    "layoutStyle": "kids-thematic",
    "layoutMode": "full-bleed",
    "backgroundDesign": "royal-castle-bg",
    "category": "Çocuk",
    "primary_color": "#ec4899",
    "text_color": "#4c0519",
    "font_family": "Outfit",
    "background_image_url": null,
    "use_envelope": true,
    "envelope_color": "#fdf2f8",
    "envelope_bg_color": "solid-blush",
    "envelope_flap_type": "heart",
    "seal_type": "crown",
    "seal_color": "#ec4899",
    "recommendedOpeningType": "envelope",
    "recommendedOpeningStyle": "rose-gold-romantic",
    "recommendedBackgroundDesign": "solid-blush",
    "recommendedBackgroundAnimation": "rosePetals",
    "thematicAssets": [
      "princess-castle",
      "golden-tiara",
      "butterfly-pink"
    ],
    "animationPreset": "sparkle-glow",
    "sealPreset": "crown",
    "palette": {
      "background": "#fdf2f8",
      "card": "#ffffff",
      "primary": "#db2777",
      "secondary": "#fbcfe8",
      "accent": "#fdf2f8",
      "text": "#4c0519",
      "mutedText": "#be185d"
    },
    "typography": {
      "heading": "Outfit",
      "body": "Inter",
      "accent": "Allura"
    },
    "visualDetails": {
      "border": "gold-tiara-border",
      "seal": "tiara-wax",
      "cardShape": "rounded-3xl",
      "texture": "glitter-paper"
    },
    "designSignature": {
      "composition": "premium-upgraded",
      "desktopGrid": "flexible",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "hero",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "rounded",
      "venuePresentation": "cards",
      "heroElement": "photo",
      "photoUsage": "background",
      "openingAnimation": "fade"
    },
    "colorVariants": [
      {
        "id": "pink-princess-var-1",
        "name": "Standart"
      },
      {
        "id": "pink-princess-var-2",
        "name": "Gece Modu"
      }
    ],
    "mediaSupport": "background",
    "backgroundOptions": [COMMON_BACKGROUNDS.SOFT_PINK, COMMON_BACKGROUNDS.CANVAS_PAPER, COMMON_BACKGROUNDS.MINIMAL_WHITE],
    "defaultBackground": "soft-pink"
  },
  {
    "id": "velvet-henna",
    "name": "Bordo Kadife Kına",
    "thumbnail": "/templates/thumbnails/velvet-henna.webp",
    "eventType": "henna",
    "layoutStyle": "velvet-curtain",
    "layoutMode": "full-bleed",
    "backgroundDesign": "royal-burgundy-velvet",
    "category": "Klasik",
    "primary_color": "#be123c",
    "text_color": "#fff7ed",
    "font_family": "Cormorant Garamond",
    "background_image_url": null,
    "use_envelope": true,
    "envelope_color": "#5c0618",
    "envelope_bg_color": "velvet-burgundy",
    "envelope_flap_type": "triangle",
    "seal_type": "monogram",
    "seal_color": "#dfc384",
    "recommendedOpeningType": "curtain",
    "recommendedOpeningStyle": "royal-burgundy",
    "recommendedBackgroundDesign": "velvet-burgundy",
    "recommendedBackgroundAnimation": "goldParticles",
    "thematicAssets": [
      "henna-plate",
      "lace-border",
      "rose-petals"
    ],
    "animationPreset": "petal-rain",
    "sealPreset": "crest",
    "palette": {
      "background": "#4c0519",
      "card": "#881337",
      "primary": "#dfc384",
      "secondary": "#fbbf24",
      "accent": "#fff7ed",
      "text": "#fff7ed",
      "mutedText": "#fecdd3"
    },
    "typography": {
      "heading": "Playfair Display",
      "body": "Cormorant Garamond",
      "accent": "Great Vibes"
    },
    "visualDetails": {
      "border": "gold-foil-lace",
      "seal": "wax-seal",
      "cardShape": "luxury-rounded",
      "texture": "dark-velvet"
    },
    "designSignature": {
      "composition": "premium-upgraded",
      "desktopGrid": "flexible",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "hero",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "rounded",
      "venuePresentation": "cards",
      "heroElement": "photo",
      "photoUsage": "background",
      "openingAnimation": "fade"
    },
    "colorVariants": [
      {
        "id": "velvet-henna-var-1",
        "name": "Standart"
      },
      {
        "id": "velvet-henna-var-2",
        "name": "Gece Modu"
      },
      {
        "id": "henna-velvet-bordo",
        "name": "Bordo Kadife Kına"
      }
    ],
    "mediaSupport": "background",
    "backgroundOptions": [COMMON_BACKGROUNDS.ROYAL_VELVET, COMMON_BACKGROUNDS.MARBLE_LIGHT, COMMON_BACKGROUNDS.MARBLE_DARK, COMMON_BACKGROUNDS.LINEN],
    "defaultBackground": "royal-velvet"
  },
  {
    "id": "nazar-circumcision",
    "name": "Nazar Boncuklu Maşallah",
    "thumbnail": "/templates/thumbnails/nazar-circumcision.webp",
    "eventType": "circumcision",
    "layoutStyle": "botanical-ceramic",
    "layoutMode": "full-bleed",
    "backgroundDesign": "royal-navy-velvet",
    "category": "Lüks",
    "primary_color": "#1d4ed8",
    "text_color": "#fffbeb",
    "font_family": "Playfair Display",
    "background_image_url": null,
    "use_envelope": true,
    "envelope_color": "#1e293b",
    "envelope_bg_color": "gold-edge",
    "envelope_flap_type": "pointed-oval",
    "seal_type": "crown",
    "seal_color": "#d4af37",
    "recommendedOpeningType": "royalHall",
    "recommendedOpeningStyle": "navy-gold",
    "recommendedBackgroundDesign": "gold-edge",
    "recommendedBackgroundAnimation": "goldParticles",
    "thematicAssets": [
      "evil-eye",
      "shahi-dome",
      "crescent-gold"
    ],
    "animationPreset": "star-twinkle",
    "sealPreset": "crown",
    "palette": {
      "background": "#0f172a",
      "card": "#1e293b",
      "primary": "#fbbf24",
      "secondary": "#60a5fa",
      "accent": "#fffbeb",
      "text": "#fffbeb",
      "mutedText": "#94a3b8"
    },
    "typography": {
      "heading": "Playfair Display",
      "body": "Lora",
      "accent": "Great Vibes"
    },
    "visualDetails": {
      "border": "royal-gold-border",
      "seal": "gold-seal",
      "cardShape": "arched-dome",
      "texture": "velvet-paper"
    },
    "designSignature": {
      "composition": "premium-upgraded",
      "desktopGrid": "flexible",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "hero",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "rounded",
      "venuePresentation": "cards",
      "heroElement": "photo",
      "photoUsage": "background",
      "openingAnimation": "fade"
    },
    "colorVariants": [
      {
        "id": "nazar-circumcision-var-1",
        "name": "Standart"
      },
      {
        "id": "nazar-circumcision-var-2",
        "name": "Gece Modu"
      }
    ],
    "mediaSupport": "background",
    "backgroundOptions": [COMMON_BACKGROUNDS.MARBLE_LIGHT, COMMON_BACKGROUNDS.MARBLE_DARK, COMMON_BACKGROUNDS.MARBLE_SAGE, COMMON_BACKGROUNDS.MINIMAL_WHITE, COMMON_BACKGROUNDS.CANVAS_PAPER],
    "defaultBackground": "marble-light"
  },
  {
    "id": "folded-tassel-linen",
    "name": "Püsküllü Keten Düğün",
    "thumbnail": "/templates/thumbnails/folded-tassel-linen.webp",
    "eventType": "wedding",
    "layoutStyle": "fabric-press",
    "layoutMode": "full-bleed",
    "backgroundDesign": "textured-linen",
    "category": "Minimalist",
    "primary_color": "#78350f",
    "text_color": "#1e293b",
    "font_family": "Montserrat",
    "background_image_url": null,
    "use_envelope": true,
    "envelope_color": "#ecd5b8",
    "envelope_bg_color": "kraft-natural",
    "envelope_flap_type": "square",
    "seal_type": "double-initials",
    "seal_color": "#78350f",
    "recommendedOpeningType": "book",
    "recommendedOpeningStyle": "bohemian-garden",
    "recommendedBackgroundDesign": "kraft-natural",
    "recommendedBackgroundAnimation": "none",
    "thematicAssets": [
      "hanging-tassel",
      "wax-seal-wax",
      "gold-threads"
    ],
    "animationPreset": "tassel-swing",
    "sealPreset": "monogram",
    "palette": {
      "background": "#fafaf9",
      "card": "#f5f5f4",
      "primary": "#78350f",
      "secondary": "#d6d3d1",
      "accent": "#f5f5f4",
      "text": "#1e293b",
      "mutedText": "#57534e"
    },
    "typography": {
      "heading": "Montserrat",
      "body": "Inter",
      "accent": "Allura"
    },
    "visualDetails": {
      "border": "linen-border",
      "seal": "hand-pressed-wax",
      "cardShape": "clean-rectangle",
      "texture": "linen-paper"
    },
    "designSignature": {
      "composition": "premium-upgraded",
      "desktopGrid": "flexible",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "hero",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "rounded",
      "venuePresentation": "cards",
      "heroElement": "photo",
      "photoUsage": "background",
      "openingAnimation": "fade"
    },
    "colorVariants": [
      {
        "id": "folded-tassel-linen-var-1",
        "name": "Standart"
      },
      {
        "id": "folded-tassel-linen-var-2",
        "name": "Gece Modu"
      }
    ],
    "mediaSupport": "background",
    "backgroundOptions": [COMMON_BACKGROUNDS.MINIMAL_WHITE, COMMON_BACKGROUNDS.CANVAS_PAPER, COMMON_BACKGROUNDS.LINEN],
    "defaultBackground": "minimal-white"
  },
  {
    "id": "photo-luxury-emerald",
    "name": "Fotoğraflı Lüks Düğün",
    "thumbnail": "/templates/thumbnails/photo-luxury-emerald.webp",
    "eventType": "wedding",
    "layoutStyle": "photo-luxury",
    "layoutMode": "full-bleed",
    "backgroundDesign": "emerald-luxury-marble",
    "category": "Lüks",
    "primary_color": "#dfb76c",
    "text_color": "#022c22",
    "font_family": "Playfair Display",
    "background_image_url": null,
    "use_envelope": true,
    "envelope_color": "#064e3b",
    "envelope_bg_color": "marble-texture",
    "envelope_flap_type": "triangle",
    "seal_type": "crown",
    "seal_color": "#dfb76c",
    "recommendedOpeningType": "door",
    "recommendedOpeningStyle": "marble-gold",
    "recommendedBackgroundDesign": "marble-texture",
    "recommendedBackgroundAnimation": "goldParticles",
    "thematicAssets": [
      "luxury-frame",
      "gold-foils"
    ],
    "animationPreset": "zoom-in-frame",
    "sealPreset": "royal-seal",
    "palette": {
      "background": "#022c22",
      "card": "#064e3b",
      "primary": "#dfb76c",
      "secondary": "#6ee7b7",
      "accent": "#f0fdf4",
      "text": "#f0fdf4",
      "mutedText": "#a7f3d0"
    },
    "typography": {
      "heading": "Playfair Display",
      "body": "Lora",
      "accent": "Great Vibes"
    },
    "visualDetails": {
      "border": "gold-foil-baroque",
      "seal": "crown-wax",
      "cardShape": "arched-dome",
      "texture": "marble"
    },
    "designSignature": {
      "composition": "premium-upgraded",
      "desktopGrid": "flexible",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "hero",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "rounded",
      "venuePresentation": "cards",
      "heroElement": "photo",
      "photoUsage": "background",
      "openingAnimation": "fade"
    },
    "colorVariants": [
      {
        "id": "photo-luxury-emerald-var-1",
        "name": "Standart"
      },
      {
        "id": "photo-luxury-emerald-var-2",
        "name": "Gece Modu"
      }
    ],
    "mediaSupport": "cover"
  },
  {
    "id": "botanical-garden",
    "name": "Botanik Bahçe",
    "thumbnail": "/templates/thumbnails/botanical-garden.webp",
    "eventType": "wedding",
    "layoutStyle": "botanical-frame",
    "layoutMode": "full-bleed",
    "backgroundDesign": "fine-paper-texture",
    "category": "Doğal",
    "primary_color": "#15803d",
    "text_color": "#1e293b",
    "font_family": "Lora",
    "background_image_url": null,
    "use_envelope": true,
    "envelope_color": "#f0fdf4",
    "envelope_bg_color": "kraft-natural",
    "envelope_flap_type": "triangle",
    "seal_type": "leaf",
    "seal_color": "#15803d",
    "recommendedOpeningType": "book",
    "recommendedOpeningStyle": "bohemian-garden",
    "recommendedBackgroundDesign": "kraft-natural",
    "recommendedBackgroundAnimation": "leaves",
    "thematicAssets": [
      "eucalyptus-leaf",
      "flower-watercolor",
      "greenery-corner"
    ],
    "animationPreset": "leaf-flutter",
    "sealPreset": "leaf-wax",
    "palette": {
      "background": "#fcfdfa",
      "card": "#ffffff",
      "primary": "#166534",
      "secondary": "#bbf7d0",
      "accent": "#f0fdf4",
      "text": "#1e293b",
      "mutedText": "#15803d"
    },
    "typography": {
      "heading": "Lora",
      "body": "Inter",
      "accent": "Allura"
    },
    "visualDetails": {
      "border": "botanical-leaf-frame",
      "seal": "leaf-pressed-seal",
      "cardShape": "oval-frame",
      "texture": "fine-paper"
    },
    "designSignature": {
      "composition": "premium-upgraded",
      "desktopGrid": "flexible",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "hero",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "rounded",
      "venuePresentation": "cards",
      "heroElement": "photo",
      "photoUsage": "background",
      "openingAnimation": "fade"
    },
    "colorVariants": [
      {
        "id": "botanical-garden-var-1",
        "name": "Standart"
      },
      {
        "id": "botanical-garden-var-2",
        "name": "Gece Modu"
      },
      {
        "id": "baby-girl-butterfly",
        "name": "Pastel Kelebek Bahçesi"
      }
    ],
    "mediaSupport": "background",
    "backgroundOptions": [COMMON_BACKGROUNDS.CANVAS_PAPER, COMMON_BACKGROUNDS.CARDBOARD, COMMON_BACKGROUNDS.LINEN, COMMON_BACKGROUNDS.MARBLE_SAGE],
    "defaultBackground": "canvas-paper"
  },
  {
    "id": "giant-monogram-classic",
    "name": "Dev Monogram",
    "thumbnail": "/templates/thumbnails/giant-monogram.webp",
    "eventType": "wedding",
    "layoutStyle": "monogram-media",
    "layoutMode": "full-bleed",
    "backgroundDesign": "parchment-paper",
    "category": "Minimalist",
    "primary_color": "#111111",
    "text_color": "#333333",
    "font_family": "Montserrat",
    "background_image_url": null,
    "use_envelope": true,
    "envelope_color": "#f8fafc",
    "envelope_bg_color": "minimal-white-paper",
    "envelope_flap_type": "square",
    "seal_type": "monogram-wax",
    "seal_color": "#111111",
    "recommendedOpeningType": "minimalFade",
    "recommendedOpeningStyle": "minimal-white",
    "recommendedBackgroundDesign": "minimal-white-paper",
    "recommendedBackgroundAnimation": "none",
    "thematicAssets": [
      "large-initial-monogram",
      "wax-seal-crest"
    ],
    "animationPreset": "monogram-parallax",
    "sealPreset": "monogram",
    "palette": {
      "background": "#fafafa",
      "card": "#ffffff",
      "primary": "#111111",
      "secondary": "#e2e8f0",
      "accent": "#f8fafc",
      "text": "#333333",
      "mutedText": "#64748b"
    },
    "typography": {
      "heading": "Cinzel",
      "body": "Montserrat",
      "accent": "Great Vibes"
    },
    "visualDetails": {
      "border": "minimal-line-border",
      "seal": "crest-pressed-seal",
      "cardShape": "clean-rectangle",
      "texture": "parchment"
    },
    "designSignature": {
      "composition": "premium-upgraded",
      "desktopGrid": "flexible",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "hero",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "rounded",
      "venuePresentation": "cards",
      "heroElement": "photo",
      "photoUsage": "background",
      "openingAnimation": "fade"
    },
    "colorVariants": [
      {
        "id": "giant-monogram-classic-var-1",
        "name": "Standart"
      },
      {
        "id": "giant-monogram-classic-var-2",
        "name": "Gece Modu"
      }
    ],
    "mediaSupport": "background",
    "backgroundOptions": [COMMON_BACKGROUNDS.MINIMAL_WHITE, COMMON_BACKGROUNDS.CANVAS_PAPER, COMMON_BACKGROUNDS.LINEN],
    "defaultBackground": "minimal-white"
  },
  {
    "id": "modern-tech-event",
    "name": "Modern Teknoloji Lansmanı",
    "thumbnail": "/templates/thumbnails/modern-tech-event.webp",
    "eventType": "corporate",
    "layoutStyle": "modern-event",
    "layoutMode": "full-bleed",
    "backgroundDesign": "neon-dark-mesh",
    "category": "Modern",
    "primary_color": "#06b6d4",
    "text_color": "#f8fafc",
    "font_family": "Outfit",
    "background_image_url": null,
    "use_envelope": true,
    "envelope_color": "#0f172a",
    "envelope_bg_color": "glass-effect",
    "envelope_flap_type": "square",
    "seal_type": "minimal-monogram",
    "seal_color": "#06b6d4",
    "recommendedOpeningType": "elevator",
    "recommendedOpeningStyle": "glass-modern",
    "recommendedBackgroundDesign": "glass-effect",
    "recommendedBackgroundAnimation": "neonGradient",
    "thematicAssets": [
      "neon-grid",
      "tech-orbs"
    ],
    "animationPreset": "neon-pulse",
    "sealPreset": "neon",
    "palette": {
      "background": "#030712",
      "card": "#1f2937",
      "primary": "#06b6d4",
      "secondary": "#3b82f6",
      "accent": "#f8fafc",
      "text": "#f8fafc",
      "mutedText": "#9ca3af"
    },
    "typography": {
      "heading": "Outfit",
      "body": "Inter",
      "accent": "Outfit"
    },
    "visualDetails": {
      "border": "neon-stroke",
      "seal": "glowing-ring",
      "cardShape": "modern-rounded",
      "texture": "dark-mesh"
    },
    "designSignature": {
      "composition": "premium-upgraded",
      "desktopGrid": "flexible",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "hero",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "rounded",
      "venuePresentation": "cards",
      "heroElement": "photo",
      "photoUsage": "background",
      "openingAnimation": "fade"
    },
    "colorVariants": [
      {
        "id": "modern-tech-event-var-1",
        "name": "Standart"
      },
      {
        "id": "modern-tech-event-var-2",
        "name": "Gece Modu"
      }
    ],
    "mediaSupport": "background",
    "backgroundOptions": [COMMON_BACKGROUNDS.MINIMAL_WHITE, COMMON_BACKGROUNDS.CANVAS_PAPER, COMMON_BACKGROUNDS.LINEN],
    "defaultBackground": "minimal-white"
  },
  {
    "id": "graduation-ceremony",
    "name": "Mezuniyet Töreni",
    "thumbnail": "/templates/thumbnails/graduation-ceremony.webp",
    "eventType": "graduation",
    "layoutStyle": "modern-event",
    "layoutMode": "full-bleed",
    "backgroundDesign": "navy-gold-stars",
    "category": "Modern",
    "primary_color": "#dfc384",
    "text_color": "#ffffff",
    "font_family": "Outfit",
    "background_image_url": null,
    "use_envelope": true,
    "envelope_color": "#0b1329",
    "envelope_bg_color": "gold-edge",
    "envelope_flap_type": "triangle",
    "seal_type": "graduation-cap",
    "seal_color": "#dfc384",
    "recommendedOpeningType": "royalHall",
    "recommendedOpeningStyle": "navy-gold",
    "recommendedBackgroundDesign": "gold-edge",
    "recommendedBackgroundAnimation": "goldParticles",
    "thematicAssets": [
      "mortarboard-cap",
      "diploma-scroll",
      "confetti-gold"
    ],
    "animationPreset": "mortarboard-toss",
    "sealPreset": "cap-wax",
    "palette": {
      "background": "#0b1329",
      "card": "#1c2541",
      "primary": "#dfc384",
      "secondary": "#3a506b",
      "accent": "#ffffff",
      "text": "#ffffff",
      "mutedText": "#8b9bb4"
    },
    "typography": {
      "heading": "Outfit",
      "body": "Inter",
      "accent": "Outfit"
    },
    "visualDetails": {
      "border": "gold-confetti-border",
      "seal": "cap-pressed-seal",
      "cardShape": "modern-rounded",
      "texture": "fine-paper"
    },
    "designSignature": {
      "composition": "premium-upgraded",
      "desktopGrid": "flexible",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "hero",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "rounded",
      "venuePresentation": "cards",
      "heroElement": "photo",
      "photoUsage": "background",
      "openingAnimation": "fade"
    },
    "colorVariants": [
      {
        "id": "graduation-ceremony-var-1",
        "name": "Standart"
      },
      {
        "id": "graduation-ceremony-var-2",
        "name": "Gece Modu"
      }
    ],
    "mediaSupport": "background",
    "backgroundOptions": [COMMON_BACKGROUNDS.MINIMAL_WHITE, COMMON_BACKGROUNDS.CANVAS_PAPER, COMMON_BACKGROUNDS.LINEN],
    "defaultBackground": "minimal-white"
  },
  {
    "id": "royal-black-tie",
    "name": "Royal Black Tie",
    "category": "Lüks",
    "eventType": "wedding",
    "primary_color": "#d6a84f",
    "text_color": "#0f0e0e",
    "font_family": "Cormorant Garamond",
    "background_image_url": null,
    "use_envelope": true,
    "envelope_color": "#080706",
    "envelope_bg_color": "black-gold-velvet",
    "envelope_flap_type": "triangle",
    "seal_type": "crown",
    "seal_color": "#d6a84f",
    "recommendedOpeningType": "door",
    "recommendedOpeningStyle": "black-gold-premium",
    "recommendedBackgroundDesign": "black-gold-velvet",
    "recommendedBackgroundAnimation": "goldParticles",
    "layoutStyle": "gala-night",
    "layoutMode": "full-bleed",
    "palette": {
      "background": "#080706",
      "card": "#fff8ec",
      "primary": "#0f0e0e",
      "secondary": "#d6a84f",
      "accent": "#f8dfac",
      "text": "#2f2418",
      "mutedText": "#7c6a55"
    },
    "typography": {
      "heading": "Playfair Display",
      "body": "Cormorant Garamond",
      "accent": "Great Vibes"
    },
    "visualDetails": {
      "border": "gold-thin-frame",
      "seal": "gold-monogram",
      "cardShape": "rounded-luxury",
      "texture": "dark-velvet"
    },
    "thumbnail": "/templates/thumbnails/royal-black-tie.webp",
    "designSignature": {
      "composition": "premium-upgraded",
      "desktopGrid": "flexible",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "hero",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "rounded",
      "venuePresentation": "cards",
      "heroElement": "photo",
      "photoUsage": "background",
      "openingAnimation": "fade"
    },
    "colorVariants": [
      {
        "id": "royal-black-tie-var-1",
        "name": "Standart"
      },
      {
        "id": "royal-black-tie-var-2",
        "name": "Gece Modu"
      }
    ],
    "mediaSupport": "none"
  },
  {
    "id": "rose-gold-romance",
    "name": "Rose Gold Romance",
    "category": "Doğal",
    "eventType": "wedding",
    "primary_color": "#c98778",
    "text_color": "#70463f",
    "font_family": "Lora",
    "background_image_url": null,
    "use_envelope": true,
    "envelope_color": "#fff1ec",
    "envelope_bg_color": "rose-gold-silk",
    "envelope_flap_type": "rounded",
    "seal_type": "rose",
    "seal_color": "#c98778",
    "recommendedOpeningType": "envelope",
    "recommendedOpeningStyle": "rose-gold-romantic",
    "recommendedBackgroundDesign": "rose-gold-silk",
    "recommendedBackgroundAnimation": "rosePetals",
    "layoutStyle": "botanical-frame",
    "layoutMode": "full-bleed",
    "palette": {
      "background": "#fff1ec",
      "card": "#ffffff",
      "primary": "#c98778",
      "secondary": "#eeded8",
      "accent": "#fdf6f3",
      "text": "#70463f",
      "mutedText": "#a3817a"
    },
    "typography": {
      "heading": "Playfair Display",
      "body": "Lora",
      "accent": "Allura"
    },
    "visualDetails": {
      "border": "soft-rose-frame",
      "seal": "rose-gold",
      "cardShape": "soft-rounded",
      "texture": "silk-paper"
    },
    "thumbnail": "/templates/thumbnails/rose-gold-romance.webp",
    "designSignature": {
      "composition": "premium-upgraded",
      "desktopGrid": "flexible",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "hero",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "rounded",
      "venuePresentation": "cards",
      "heroElement": "photo",
      "photoUsage": "background",
      "openingAnimation": "fade"
    },
    "colorVariants": [
      {
        "id": "rose-gold-romance-var-1",
        "name": "Standart"
      },
      {
        "id": "rose-gold-romance-var-2",
        "name": "Gece Modu"
      }
    ],
    "mediaSupport": "background",
    "backgroundOptions": [COMMON_BACKGROUNDS.CANVAS_PAPER, COMMON_BACKGROUNDS.CARDBOARD, COMMON_BACKGROUNDS.LINEN, COMMON_BACKGROUNDS.MARBLE_SAGE],
    "defaultBackground": "canvas-paper"
  },
  {
    "id": "parisian-ivory",
    "name": "Parisian Ivory",
    "category": "Klasik",
    "eventType": "wedding",
    "primary_color": "#8c765c",
    "text_color": "#2e261f",
    "font_family": "Playfair Display",
    "background_image_url": null,
    "use_envelope": true,
    "envelope_color": "#faf6ee",
    "envelope_bg_color": "minimal-white-paper",
    "envelope_flap_type": "classic",
    "seal_type": "floral",
    "seal_color": "#8c765c",
    "recommendedOpeningType": "envelope",
    "recommendedOpeningStyle": "minimal-white",
    "recommendedBackgroundDesign": "minimal-white-paper",
    "recommendedBackgroundAnimation": "pearlLight",
    "layoutStyle": "parisian-apartment",
    "layoutMode": "full-bleed",
    "palette": {
      "background": "#faf6ee",
      "card": "#ffffff",
      "primary": "#8c765c",
      "secondary": "#f3ede0",
      "accent": "#fbf9f4",
      "text": "#2e261f",
      "mutedText": "#695d52"
    },
    "typography": {
      "heading": "Playfair Display",
      "body": "Cormorant Garamond",
      "accent": "Parisienne"
    },
    "visualDetails": {
      "border": "minimal-line",
      "seal": "gold-seal",
      "cardShape": "clean-rectangle",
      "texture": "fine-paper"
    },
    "thumbnail": "/templates/thumbnails/parisian-ivory.webp",
    "designSignature": {
      "composition": "premium-upgraded",
      "desktopGrid": "flexible",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "hero",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "rounded",
      "venuePresentation": "cards",
      "heroElement": "photo",
      "photoUsage": "background",
      "openingAnimation": "fade"
    },
    "colorVariants": [
      {
        "id": "parisian-ivory-var-1",
        "name": "Standart"
      },
      {
        "id": "parisian-ivory-var-2",
        "name": "Gece Modu"
      }
    ],
    "mediaSupport": "background",
    "backgroundOptions": [COMMON_BACKGROUNDS.ROYAL_VELVET, COMMON_BACKGROUNDS.MARBLE_LIGHT, COMMON_BACKGROUNDS.MARBLE_DARK, COMMON_BACKGROUNDS.LINEN],
    "defaultBackground": "royal-velvet"
  },
  {
    "id": "bohemian-kraft-wedding",
    "name": "Bohemian Kraft",
    "category": "Doğal",
    "eventType": "wedding",
    "primary_color": "#a3704c",
    "text_color": "#3d2b1f",
    "font_family": "Inter",
    "background_image_url": null,
    "use_envelope": true,
    "envelope_color": "#ecd5b8",
    "envelope_bg_color": "bohemian-kraft",
    "envelope_flap_type": "rounded",
    "seal_type": "olive",
    "seal_color": "#a3704c",
    "recommendedOpeningType": "gardenGate",
    "recommendedOpeningStyle": "bohemian-garden",
    "recommendedBackgroundDesign": "bohemian-kraft",
    "recommendedBackgroundAnimation": "leafFall",
    "layoutStyle": "story-timeline",
    "layoutMode": "full-bleed",
    "palette": {
      "background": "#f8f4ee",
      "card": "#faf9f5",
      "primary": "#a3704c",
      "secondary": "#ecd5b8",
      "accent": "#f2eae0",
      "text": "#3d2b1f",
      "mutedText": "#7a604e"
    },
    "typography": {
      "heading": "Outfit",
      "body": "Inter",
      "accent": "Allura"
    },
    "visualDetails": {
      "border": "botanical-frame",
      "seal": "olive-wax",
      "cardShape": "rough-edges",
      "texture": "kraft"
    },
    "thumbnail": "/templates/thumbnails/bohemian-kraft-wedding.webp",
    "designSignature": {
      "composition": "premium-upgraded",
      "desktopGrid": "flexible",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "hero",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "rounded",
      "venuePresentation": "cards",
      "heroElement": "photo",
      "photoUsage": "background",
      "openingAnimation": "fade"
    },
    "colorVariants": [
      {
        "id": "bohemian-kraft-wedding-var-1",
        "name": "Standart"
      },
      {
        "id": "bohemian-kraft-wedding-var-2",
        "name": "Gece Modu"
      }
    ],
    "mediaSupport": "none"
  },
  {
    "id": "minimal-white-wedding",
    "name": "Minimal White Ceremony",
    "category": "Minimalist",
    "eventType": "wedding",
    "primary_color": "#333333",
    "text_color": "#111111",
    "font_family": "Outfit",
    "background_image_url": null,
    "use_envelope": true,
    "envelope_color": "#ffffff",
    "envelope_bg_color": "minimal-white-paper",
    "envelope_flap_type": "classic",
    "seal_type": "infinity",
    "seal_color": "#333333",
    "recommendedOpeningType": "minimalFade",
    "recommendedOpeningStyle": "minimal-white",
    "recommendedBackgroundDesign": "minimal-white-paper",
    "recommendedBackgroundAnimation": "pearlLight",
    "layoutStyle": "swiss-grid",
    "layoutMode": "full-bleed",
    "palette": {
      "background": "#fafafa",
      "card": "#ffffff",
      "primary": "#111111",
      "secondary": "#eaeaea",
      "accent": "#f5f5f5",
      "text": "#222222",
      "mutedText": "#777777"
    },
    "typography": {
      "heading": "Outfit",
      "body": "Inter",
      "accent": "Parisienne"
    },
    "visualDetails": {
      "border": "minimal-line",
      "seal": "silver-seal",
      "cardShape": "clean-rectangle",
      "texture": "fine-paper"
    },
    "thumbnail": "/templates/thumbnails/minimal-white-wedding.webp",
    "designSignature": {
      "composition": "premium-upgraded",
      "desktopGrid": "flexible",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "hero",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "rounded",
      "venuePresentation": "cards",
      "heroElement": "photo",
      "photoUsage": "background",
      "openingAnimation": "fade"
    },
    "colorVariants": [
      {
        "id": "minimal-white-wedding-var-1",
        "name": "Standart"
      },
      {
        "id": "minimal-white-wedding-var-2",
        "name": "Gece Modu"
      }
    ],
    "mediaSupport": "background",
    "backgroundOptions": [COMMON_BACKGROUNDS.MINIMAL_WHITE, COMMON_BACKGROUNDS.CANVAS_PAPER, COMMON_BACKGROUNDS.LINEN],
    "defaultBackground": "minimal-white"
  },
  {
    "id": "luxury-marble-gold",
    "name": "Luxury Marble Gold",
    "category": "Lüks",
    "eventType": "wedding",
    "primary_color": "#dfb76c",
    "text_color": "#2a251b",
    "font_family": "Playfair Display",
    "background_image_url": null,
    "use_envelope": true,
    "envelope_color": "#f5efe1",
    "envelope_bg_color": "white-gold-marble",
    "envelope_flap_type": "pointed",
    "seal_type": "crown",
    "seal_color": "#dfb76c",
    "recommendedOpeningType": "door",
    "recommendedOpeningStyle": "marble-gold",
    "recommendedBackgroundDesign": "white-gold-marble",
    "recommendedBackgroundAnimation": "goldParticles",
    "layoutStyle": "marble-column",
    "layoutMode": "full-bleed",
    "palette": {
      "background": "#fcfbf7",
      "card": "#ffffff",
      "primary": "#2a251b",
      "secondary": "#dfb76c",
      "accent": "#f2ecd9",
      "text": "#2a251b",
      "mutedText": "#665d4c"
    },
    "typography": {
      "heading": "Playfair Display",
      "body": "Lora",
      "accent": "Great Vibes"
    },
    "visualDetails": {
      "border": "geometric-gold",
      "seal": "gold-crown",
      "cardShape": "rounded-luxury",
      "texture": "marble"
    },
    "thumbnail": "/templates/thumbnails/luxury-marble-gold.webp",
    "designSignature": {
      "composition": "premium-upgraded",
      "desktopGrid": "flexible",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "hero",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "rounded",
      "venuePresentation": "cards",
      "heroElement": "photo",
      "photoUsage": "background",
      "openingAnimation": "fade"
    },
    "colorVariants": [
      {
        "id": "luxury-marble-gold-var-1",
        "name": "Standart"
      },
      {
        "id": "luxury-marble-gold-var-2",
        "name": "Gece Modu"
      }
    ],
    "mediaSupport": "background",
    "backgroundOptions": [COMMON_BACKGROUNDS.MARBLE_LIGHT, COMMON_BACKGROUNDS.MARBLE_DARK, COMMON_BACKGROUNDS.MARBLE_SAGE, COMMON_BACKGROUNDS.MINIMAL_WHITE, COMMON_BACKGROUNDS.CANVAS_PAPER],
    "defaultBackground": "marble-light"
  },
  {
    "id": "moonlight-wedding",
    "name": "Moonlight Wedding",
    "category": "Modern",
    "eventType": "wedding",
    "primary_color": "#c29cf0",
    "text_color": "#0f172a",
    "font_family": "Outfit",
    "background_image_url": null,
    "use_envelope": true,
    "envelope_color": "#0b0f19",
    "envelope_bg_color": "navy-gold-night",
    "envelope_flap_type": "triangle",
    "seal_type": "ring",
    "seal_color": "#c29cf0",
    "recommendedOpeningType": "starryNight",
    "recommendedOpeningStyle": "navy-gold",
    "recommendedBackgroundDesign": "navy-gold-night",
    "recommendedBackgroundAnimation": "stars",
    "layoutStyle": "constellation-night",
    "layoutMode": "full-bleed",
    "palette": {
      "background": "#070a13",
      "card": "#ffffff",
      "primary": "#c29cf0",
      "secondary": "#181e2b",
      "accent": "#0b0f19",
      "text": "#0f172a",
      "mutedText": "#475569"
    },
    "typography": {
      "heading": "Outfit",
      "body": "Inter",
      "accent": "Allura"
    },
    "visualDetails": {
      "border": "starlight-frame",
      "seal": "indigo-moon",
      "cardShape": "rounded-luxury",
      "texture": "dark-space"
    },
    "thumbnail": "/templates/thumbnails/moonlight-wedding.webp",
    "designSignature": {
      "composition": "premium-upgraded",
      "desktopGrid": "flexible",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "hero",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "rounded",
      "venuePresentation": "cards",
      "heroElement": "photo",
      "photoUsage": "background",
      "openingAnimation": "fade"
    },
    "colorVariants": [
      {
        "id": "moonlight-wedding-var-1",
        "name": "Standart"
      },
      {
        "id": "moonlight-wedding-var-2",
        "name": "Gece Modu"
      }
    ],
    "mediaSupport": "none"
  },
  {
    "id": "garden-of-roses",
    "name": "Garden of Roses",
    "category": "Doğal",
    "eventType": "wedding",
    "primary_color": "#d48888",
    "text_color": "#3d2222",
    "font_family": "Lora",
    "background_image_url": null,
    "use_envelope": true,
    "envelope_color": "#fdf3f3",
    "envelope_bg_color": "pastel-floral",
    "envelope_flap_type": "rounded",
    "seal_type": "rose",
    "seal_color": "#d48888",
    "recommendedOpeningType": "envelope",
    "recommendedOpeningStyle": "pastel-floral",
    "recommendedBackgroundDesign": "pastel-floral",
    "recommendedBackgroundAnimation": "rosePetals",
    "layoutStyle": "botanical-frame",
    "layoutMode": "full-bleed",
    "palette": {
      "background": "#faf0f0",
      "card": "#ffffff",
      "primary": "#d48888",
      "secondary": "#f7dcd9",
      "accent": "#faf3f3",
      "text": "#3d2222",
      "mutedText": "#7a5151"
    },
    "typography": {
      "heading": "Playfair Display",
      "body": "Lora",
      "accent": "Parisienne"
    },
    "visualDetails": {
      "border": "watercolor-frame",
      "seal": "rose-seal",
      "cardShape": "soft-rounded",
      "texture": "silk-paper"
    },
    "thumbnail": "/templates/thumbnails/garden-of-roses.webp",
    "designSignature": {
      "composition": "premium-upgraded",
      "desktopGrid": "flexible",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "hero",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "rounded",
      "venuePresentation": "cards",
      "heroElement": "photo",
      "photoUsage": "background",
      "openingAnimation": "fade"
    },
    "colorVariants": [
      {
        "id": "garden-of-roses-var-1",
        "name": "Standart"
      },
      {
        "id": "garden-of-roses-var-2",
        "name": "Gece Modu"
      }
    ],
    "mediaSupport": "background",
    "backgroundOptions": [COMMON_BACKGROUNDS.CANVAS_PAPER, COMMON_BACKGROUNDS.CARDBOARD, COMMON_BACKGROUNDS.LINEN, COMMON_BACKGROUNDS.MARBLE_SAGE],
    "defaultBackground": "canvas-paper"
  },
  {
    "id": "champagne-reception",
    "name": "Champagne Reception",
    "category": "Lüks",
    "eventType": "wedding",
    "primary_color": "#d4af37",
    "text_color": "#332c1c",
    "font_family": "Cormorant Garamond",
    "background_image_url": null,
    "use_envelope": true,
    "envelope_color": "#fbf9f4",
    "envelope_bg_color": "champagne-gold",
    "envelope_flap_type": "classic",
    "seal_type": "crown",
    "seal_color": "#d4af37",
    "recommendedOpeningType": "luxuryBox",
    "recommendedOpeningStyle": "champagne-gold",
    "recommendedBackgroundDesign": "champagne-gold",
    "recommendedBackgroundAnimation": "goldParticles",
    "layoutStyle": "cocktail-menu",
    "layoutMode": "full-bleed",
    "palette": {
      "background": "#fcfbfa",
      "card": "#ffffff",
      "primary": "#332c1c",
      "secondary": "#d4af37",
      "accent": "#f2ecd9",
      "text": "#332c1c",
      "mutedText": "#6b5e43"
    },
    "typography": {
      "heading": "Playfair Display",
      "body": "Cormorant Garamond",
      "accent": "Great Vibes"
    },
    "visualDetails": {
      "border": "geometric-gold",
      "seal": "gold-crest",
      "cardShape": "royal-rounded",
      "texture": "metallic"
    },
    "thumbnail": "/templates/thumbnails/champagne-reception.webp",
    "designSignature": {
      "composition": "premium-upgraded",
      "desktopGrid": "flexible",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "hero",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "rounded",
      "venuePresentation": "cards",
      "heroElement": "photo",
      "photoUsage": "background",
      "openingAnimation": "fade"
    },
    "colorVariants": [
      {
        "id": "champagne-reception-var-1",
        "name": "Standart"
      },
      {
        "id": "champagne-reception-var-2",
        "name": "Gece Modu"
      }
    ],
    "mediaSupport": "background",
    "backgroundOptions": [COMMON_BACKGROUNDS.MARBLE_LIGHT, COMMON_BACKGROUNDS.MARBLE_DARK, COMMON_BACKGROUNDS.MARBLE_SAGE, COMMON_BACKGROUNDS.MINIMAL_WHITE, COMMON_BACKGROUNDS.CANVAS_PAPER],
    "defaultBackground": "marble-light"
  },
  {
    "id": "classic-ivory-wedding",
    "name": "Classic Ivory Wedding",
    "category": "Klasik",
    "eventType": "wedding",
    "primary_color": "#7a6855",
    "text_color": "#2a241e",
    "font_family": "Playfair Display",
    "background_image_url": null,
    "use_envelope": true,
    "envelope_color": "#fdfbf7",
    "envelope_bg_color": "minimal-white-paper",
    "envelope_flap_type": "classic",
    "seal_type": "floral",
    "seal_color": "#7a6855",
    "recommendedOpeningType": "envelope",
    "recommendedOpeningStyle": "minimal-white",
    "recommendedBackgroundDesign": "minimal-white-paper",
    "recommendedBackgroundAnimation": "pearlLight",
    "layoutStyle": "full-bleed",
    "layoutMode": "full-bleed",
    "palette": {
      "background": "#fcfbf7",
      "card": "#ffffff",
      "primary": "#7a6855",
      "secondary": "#eae4d9",
      "accent": "#f5f0e6",
      "text": "#2a241e",
      "mutedText": "#5c5044"
    },
    "typography": {
      "heading": "Playfair Display",
      "body": "Lora",
      "accent": "Parisienne"
    },
    "visualDetails": {
      "border": "minimal-line",
      "seal": "ivory-seal",
      "cardShape": "clean-rectangle",
      "texture": "fine-paper"
    },
    "thumbnail": "/templates/thumbnails/classic-ivory-wedding.webp",
    "designSignature": {
      "composition": "premium-upgraded",
      "desktopGrid": "flexible",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "hero",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "rounded",
      "venuePresentation": "cards",
      "heroElement": "photo",
      "photoUsage": "background",
      "openingAnimation": "fade"
    },
    "colorVariants": [
      {
        "id": "classic-ivory-wedding-var-1",
        "name": "Standart"
      },
      {
        "id": "classic-ivory-wedding-var-2",
        "name": "Gece Modu"
      }
    ],
    "mediaSupport": "none"
  },
  {
    "id": "velvet-burgundy-night",
    "name": "Velvet Burgundy Night",
    "category": "Lüks",
    "eventType": "wedding",
    "primary_color": "#c5a880",
    "text_color": "#fcfbf9",
    "font_family": "Cormorant Garamond",
    "background_image_url": null,
    "use_envelope": true,
    "envelope_color": "#4a0512",
    "envelope_bg_color": "black-gold-velvet",
    "envelope_flap_type": "triangle",
    "seal_type": "crown",
    "seal_color": "#c5a880",
    "recommendedOpeningType": "curtain",
    "recommendedOpeningStyle": "royal-burgundy",
    "recommendedBackgroundDesign": "black-gold-velvet",
    "recommendedBackgroundAnimation": "goldParticles",
    "layoutStyle": "constellation-night",
    "layoutMode": "full-bleed",
    "palette": {
      "background": "#2b020a",
      "card": "#4a0512",
      "primary": "#c5a880",
      "secondary": "#6b071a",
      "accent": "#8f0d25",
      "text": "#fbf8f5",
      "mutedText": "#dfc0ad"
    },
    "typography": {
      "heading": "Playfair Display",
      "body": "Cormorant Garamond",
      "accent": "Great Vibes"
    },
    "visualDetails": {
      "border": "double-gold",
      "seal": "royal-crest",
      "cardShape": "royal-rounded",
      "texture": "dark-velvet"
    },
    "thumbnail": "/templates/thumbnails/velvet-burgundy-night.webp",
    "designSignature": {
      "composition": "premium-upgraded",
      "desktopGrid": "flexible",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "hero",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "rounded",
      "venuePresentation": "cards",
      "heroElement": "photo",
      "photoUsage": "background",
      "openingAnimation": "fade"
    },
    "colorVariants": [
      {
        "id": "velvet-burgundy-night-var-1",
        "name": "Standart"
      },
      {
        "id": "velvet-burgundy-night-var-2",
        "name": "Gece Modu"
      }
    ],
    "mediaSupport": "none"
  },
  {
    "id": "wax-seal-royal",
    "name": "Mühürlü Kraliyet Daveti",
    "category": "Lüks",
    "eventType": "wedding",
    "primary_color": "#dfb76c",
    "text_color": "#1e293b",
    "font_family": "Cormorant Garamond",
    "background_image_url": null,
    "use_envelope": true,
    "envelope_color": "#7f1d1d",
    "envelope_bg_color": "solid-burgundy",
    "envelope_flap_type": "triangle",
    "seal_type": "crown",
    "seal_color": "#dfb76c",
    "recommendedOpeningType": "envelope",
    "recommendedOpeningStyle": "royal-burgundy",
    "recommendedBackgroundDesign": "solid-burgundy",
    "recommendedBackgroundAnimation": "goldParticles",
    "layoutStyle": "royal-letter",
    "layoutMode": "full-bleed",
    "palette": {
      "background": "#7f1d1d",
      "card": "#ffffff",
      "primary": "#1e293b",
      "secondary": "#dfb76c",
      "accent": "#fef2f2",
      "text": "#1e293b",
      "mutedText": "#64748b"
    },
    "typography": {
      "heading": "Cinzel",
      "body": "Cormorant Garamond",
      "accent": "Great Vibes"
    },
    "visualDetails": {
      "border": "double-gold",
      "seal": "gold-crest",
      "cardShape": "royal-rounded",
      "texture": "linen"
    },
    "thumbnail": "/templates/thumbnails/wax-seal-royal.webp",
    "designSignature": {
      "composition": "premium-upgraded",
      "desktopGrid": "flexible",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "hero",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "rounded",
      "venuePresentation": "cards",
      "heroElement": "photo",
      "photoUsage": "background",
      "openingAnimation": "fade"
    },
    "colorVariants": [
      {
        "id": "wax-seal-royal-var-1",
        "name": "Standart"
      },
      {
        "id": "wax-seal-royal-var-2",
        "name": "Gece Modu"
      }
    ],
    "mediaSupport": "background",
    "backgroundOptions": [COMMON_BACKGROUNDS.MARBLE_LIGHT, COMMON_BACKGROUNDS.MARBLE_DARK, COMMON_BACKGROUNDS.MARBLE_SAGE, COMMON_BACKGROUNDS.MINIMAL_WHITE, COMMON_BACKGROUNDS.CANVAS_PAPER],
    "defaultBackground": "marble-light"
  },
  {
    "id": "henna-traditional",
    "name": "Geleneksel Kına Tepsisi",
    "category": "Klasik",
    "eventType": "henna",
    "primary_color": "#d97706",
    "text_color": "#451a03",
    "font_family": "Cormorant Garamond",
    "background_image_url": null,
    "use_envelope": true,
    "envelope_color": "#9a3412",
    "envelope_bg_color": "solid-burgundy",
    "envelope_flap_type": "classic",
    "seal_type": "crown",
    "seal_color": "#d97706",
    "recommendedOpeningType": "door",
    "recommendedOpeningStyle": "royal-burgundy",
    "recommendedBackgroundDesign": "solid-burgundy",
    "recommendedBackgroundAnimation": "goldParticles",
    "layoutStyle": "henna-tray",
    "layoutMode": "full-bleed",
    "palette": {
      "background": "#7c2d12",
      "card": "#fffbeb",
      "primary": "#451a03",
      "secondary": "#d97706",
      "accent": "#fde68a",
      "text": "#451a03",
      "mutedText": "#b45309"
    },
    "typography": {
      "heading": "Cinzel",
      "body": "Cormorant Garamond",
      "accent": "Great Vibes"
    },
    "visualDetails": {
      "border": "baroque-pattern",
      "seal": "gold-crest",
      "cardShape": "royal-rounded",
      "texture": "fine-paper"
    },
    "thumbnail": "/templates/thumbnails/henna-traditional.webp",
    "designSignature": {
      "composition": "premium-upgraded",
      "desktopGrid": "flexible",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "hero",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "rounded",
      "venuePresentation": "cards",
      "heroElement": "photo",
      "photoUsage": "background",
      "openingAnimation": "fade"
    },
    "colorVariants": [
      {
        "id": "henna-traditional-var-1",
        "name": "Standart"
      },
      {
        "id": "henna-traditional-var-2",
        "name": "Gece Modu"
      }
    ],
    "mediaSupport": "background",
    "backgroundOptions": [COMMON_BACKGROUNDS.ROYAL_VELVET, COMMON_BACKGROUNDS.MARBLE_LIGHT, COMMON_BACKGROUNDS.MARBLE_DARK, COMMON_BACKGROUNDS.LINEN],
    "defaultBackground": "royal-velvet"
  },
  {
    "id": "henna-candle",
    "name": "Mum Işığında Kına",
    "category": "Doğal",
    "eventType": "henna",
    "primary_color": "#f59e0b",
    "text_color": "#fef3c7",
    "font_family": "Lora",
    "background_image_url": null,
    "use_envelope": true,
    "envelope_color": "#451a03",
    "envelope_bg_color": "black-gold-velvet",
    "envelope_flap_type": "rounded",
    "seal_type": "rose",
    "seal_color": "#f59e0b",
    "recommendedOpeningType": "envelope",
    "recommendedOpeningStyle": "black-gold-premium",
    "recommendedBackgroundDesign": "black-gold-velvet",
    "recommendedBackgroundAnimation": "goldParticles",
    "layoutStyle": "candle-corridor",
    "layoutMode": "full-bleed",
    "palette": {
      "background": "#1c1917",
      "card": "#292524",
      "primary": "#f59e0b",
      "secondary": "#44403c",
      "accent": "#78716c",
      "text": "#fef3c7",
      "mutedText": "#d97706"
    },
    "typography": {
      "heading": "Playfair Display",
      "body": "Lora",
      "accent": "Allura"
    },
    "visualDetails": {
      "border": "watercolor-frame",
      "seal": "rose-seal",
      "cardShape": "soft-rounded",
      "texture": "dark-velvet"
    },
    "thumbnail": "/templates/thumbnails/henna-candle.webp",
    "designSignature": {
      "composition": "premium-upgraded",
      "desktopGrid": "flexible",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "hero",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "rounded",
      "venuePresentation": "cards",
      "heroElement": "photo",
      "photoUsage": "background",
      "openingAnimation": "fade"
    },
    "colorVariants": [
      {
        "id": "henna-candle-var-1",
        "name": "Standart"
      },
      {
        "id": "henna-candle-var-2",
        "name": "Gece Modu"
      }
    ],
    "mediaSupport": "background",
    "backgroundOptions": [COMMON_BACKGROUNDS.ROYAL_VELVET, COMMON_BACKGROUNDS.MARBLE_LIGHT, COMMON_BACKGROUNDS.MARBLE_DARK, COMMON_BACKGROUNDS.LINEN],
    "defaultBackground": "royal-velvet"
  },
  {
    "id": "henna-lace",
    "name": "Oryantal Altın Dantel",
    "category": "Lüks",
    "eventType": "henna",
    "primary_color": "#dfa857",
    "text_color": "#ffffff",
    "font_family": "Cinzel",
    "background_image_url": null,
    "use_envelope": true,
    "envelope_color": "#000000",
    "envelope_bg_color": "black-gold-velvet",
    "envelope_flap_type": "triangle",
    "seal_type": "crown",
    "seal_color": "#dfa857",
    "recommendedOpeningType": "door",
    "recommendedOpeningStyle": "black-gold-premium",
    "recommendedBackgroundDesign": "black-gold-velvet",
    "recommendedBackgroundAnimation": "goldParticles",
    "layoutStyle": "oriental-lace",
    "layoutMode": "full-bleed",
    "palette": {
      "background": "#0a0a0a",
      "card": "#111111",
      "primary": "#dfa857",
      "secondary": "#262626",
      "accent": "#404040",
      "text": "#ffffff",
      "mutedText": "#d4d4d4"
    },
    "typography": {
      "heading": "Cinzel",
      "body": "Cormorant Garamond",
      "accent": "Great Vibes"
    },
    "visualDetails": {
      "border": "baroque-pattern",
      "seal": "gold-crest",
      "cardShape": "rounded-luxury",
      "texture": "dark-velvet"
    },
    "thumbnail": "/templates/thumbnails/henna-lace.webp",
    "designSignature": {
      "composition": "premium-upgraded",
      "desktopGrid": "flexible",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "hero",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "rounded",
      "venuePresentation": "cards",
      "heroElement": "photo",
      "photoUsage": "background",
      "openingAnimation": "fade"
    },
    "colorVariants": [
      {
        "id": "henna-lace-var-1",
        "name": "Standart"
      },
      {
        "id": "henna-lace-var-2",
        "name": "Gece Modu"
      }
    ],
    "mediaSupport": "background",
    "backgroundOptions": [COMMON_BACKGROUNDS.MARBLE_LIGHT, COMMON_BACKGROUNDS.MARBLE_DARK, COMMON_BACKGROUNDS.MARBLE_SAGE, COMMON_BACKGROUNDS.MINIMAL_WHITE, COMMON_BACKGROUNDS.CANVAS_PAPER],
    "defaultBackground": "marble-light"
  },
  {
    "id": "henna-luxury-red",
    "name": "Siyah ve Bordo Lüks Kına",
    "category": "Karanlık",
    "eventType": "henna",
    "primary_color": "#e11d48",
    "text_color": "#ffe4e6",
    "font_family": "Cormorant Garamond",
    "background_image_url": null,
    "use_envelope": true,
    "envelope_color": "#1e1b4b",
    "envelope_bg_color": "black-gold-velvet",
    "envelope_flap_type": "triangle",
    "seal_type": "crown",
    "seal_color": "#e11d48",
    "recommendedOpeningType": "curtain",
    "recommendedOpeningStyle": "royal-burgundy",
    "recommendedBackgroundDesign": "black-gold-velvet",
    "recommendedBackgroundAnimation": "rosePetals",
    "layoutStyle": "black-gala",
    "layoutMode": "full-bleed",
    "palette": {
      "background": "#090514",
      "card": "#1c0a1a",
      "primary": "#e11d48",
      "secondary": "#31102f",
      "accent": "#4a1545",
      "text": "#ffe4e6",
      "mutedText": "#f43f5e"
    },
    "typography": {
      "heading": "Cinzel",
      "body": "Cormorant Garamond",
      "accent": "Great Vibes"
    },
    "visualDetails": {
      "border": "double-gold",
      "seal": "gold-crest",
      "cardShape": "royal-rounded",
      "texture": "dark-velvet"
    },
    "thumbnail": "/templates/thumbnails/henna-luxury-red.webp",
    "designSignature": {
      "composition": "premium-upgraded",
      "desktopGrid": "flexible",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "hero",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "rounded",
      "venuePresentation": "cards",
      "heroElement": "photo",
      "photoUsage": "background",
      "openingAnimation": "fade"
    },
    "colorVariants": [
      {
        "id": "henna-luxury-red-var-1",
        "name": "Standart"
      },
      {
        "id": "henna-luxury-red-var-2",
        "name": "Gece Modu"
      }
    ],
    "mediaSupport": "background",
    "backgroundOptions": [COMMON_BACKGROUNDS.NIGHT_SKY, COMMON_BACKGROUNDS.MARBLE_DARK, COMMON_BACKGROUNDS.ROYAL_VELVET],
    "defaultBackground": "night-sky"
  },
  {
    "id": "circumcision-royal",
    "name": "Şehzade Sünnet Daveti",
    "category": "Lüks",
    "eventType": "circumcision",
    "primary_color": "#d4af37",
    "text_color": "#fffbeb",
    "font_family": "Cinzel",
    "background_image_url": null,
    "use_envelope": true,
    "envelope_color": "#1e3a8a",
    "envelope_bg_color": "navy-gold-night",
    "envelope_flap_type": "triangle",
    "seal_type": "crown",
    "seal_color": "#d4af37",
    "recommendedOpeningType": "door",
    "recommendedOpeningStyle": "navy-gold",
    "recommendedBackgroundDesign": "navy-gold-night",
    "recommendedBackgroundAnimation": "goldParticles",
    "layoutStyle": "prince-throne-room",
    "layoutMode": "full-bleed",
    "palette": {
      "background": "#0f172a",
      "card": "#1e3a8a",
      "primary": "#d4af37",
      "secondary": "#1e40af",
      "accent": "#3b82f6",
      "text": "#fffbeb",
      "mutedText": "#93c5fd"
    },
    "typography": {
      "heading": "Cinzel",
      "body": "Cormorant Garamond",
      "accent": "Great Vibes"
    },
    "visualDetails": {
      "border": "geometric-gold",
      "seal": "gold-crown",
      "cardShape": "royal-rounded",
      "texture": "dark-space"
    },
    "thumbnail": "/templates/thumbnails/circumcision-royal.webp",
    "designSignature": {
      "composition": "premium-upgraded",
      "desktopGrid": "flexible",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "hero",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "rounded",
      "venuePresentation": "cards",
      "heroElement": "photo",
      "photoUsage": "background",
      "openingAnimation": "fade"
    },
    "colorVariants": [
      {
        "id": "circumcision-royal-var-1",
        "name": "Standart"
      },
      {
        "id": "circumcision-royal-var-2",
        "name": "Gece Modu"
      }
    ],
    "mediaSupport": "background",
    "backgroundOptions": [COMMON_BACKGROUNDS.MARBLE_LIGHT, COMMON_BACKGROUNDS.MARBLE_DARK, COMMON_BACKGROUNDS.MARBLE_SAGE, COMMON_BACKGROUNDS.MINIMAL_WHITE, COMMON_BACKGROUNDS.CANVAS_PAPER],
    "defaultBackground": "marble-light"
  },
  {
    "id": "circumcision-nazar",
    "name": "Nazar Boncuklu Maşallah",
    "category": "Klasik",
    "eventType": "circumcision",
    "primary_color": "#3b82f6",
    "text_color": "#1e3a8a",
    "font_family": "Inter",
    "background_image_url": null,
    "use_envelope": true,
    "envelope_color": "#eff6ff",
    "envelope_bg_color": "minimal-white-paper",
    "envelope_flap_type": "classic",
    "seal_type": "ring",
    "seal_color": "#3b82f6",
    "recommendedOpeningType": "envelope",
    "recommendedOpeningStyle": "minimal-white",
    "recommendedBackgroundDesign": "minimal-white-paper",
    "recommendedBackgroundAnimation": "pearlLight",
    "layoutStyle": "nazar-dome",
    "layoutMode": "full-bleed",
    "palette": {
      "background": "#f8fafc",
      "card": "#ffffff",
      "primary": "#3b82f6",
      "secondary": "#dbeafe",
      "accent": "#eff6ff",
      "text": "#1e3a8a",
      "mutedText": "#60a5fa"
    },
    "typography": {
      "heading": "Playfair Display",
      "body": "Inter",
      "accent": "Parisienne"
    },
    "visualDetails": {
      "border": "minimal-line",
      "seal": "blue-seal",
      "cardShape": "soft-rounded",
      "texture": "fine-paper"
    },
    "thumbnail": "/templates/thumbnails/circumcision-nazar.webp",
    "designSignature": {
      "composition": "premium-upgraded",
      "desktopGrid": "flexible",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "hero",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "rounded",
      "venuePresentation": "cards",
      "heroElement": "photo",
      "photoUsage": "background",
      "openingAnimation": "fade"
    },
    "colorVariants": [
      {
        "id": "circumcision-nazar-var-1",
        "name": "Standart"
      },
      {
        "id": "circumcision-nazar-var-2",
        "name": "Gece Modu"
      }
    ],
    "mediaSupport": "background",
    "backgroundOptions": [COMMON_BACKGROUNDS.ROYAL_VELVET, COMMON_BACKGROUNDS.MARBLE_LIGHT, COMMON_BACKGROUNDS.MARBLE_DARK, COMMON_BACKGROUNDS.LINEN],
    "defaultBackground": "royal-velvet"
  },
  {
    "id": "circumcision-velvet",
    "name": "Lacivert Kadife Sünnet",
    "category": "Lüks",
    "eventType": "circumcision",
    "primary_color": "#f59e0b",
    "text_color": "#fef3c7",
    "font_family": "Cormorant Garamond",
    "background_image_url": null,
    "use_envelope": true,
    "envelope_color": "#0f172a",
    "envelope_bg_color": "navy-gold-night",
    "envelope_flap_type": "triangle",
    "seal_type": "crown",
    "seal_color": "#f59e0b",
    "recommendedOpeningType": "door",
    "recommendedOpeningStyle": "navy-gold",
    "recommendedBackgroundDesign": "navy-gold-night",
    "recommendedBackgroundAnimation": "goldParticles",
    "layoutStyle": "velvet-theater",
    "layoutMode": "full-bleed",
    "palette": {
      "background": "#0b0f19",
      "card": "#0f172a",
      "primary": "#f59e0b",
      "secondary": "#1e293b",
      "accent": "#334155",
      "text": "#fef3c7",
      "mutedText": "#cbd5e1"
    },
    "typography": {
      "heading": "Cinzel",
      "body": "Cormorant Garamond",
      "accent": "Great Vibes"
    },
    "visualDetails": {
      "border": "double-gold",
      "seal": "gold-crest",
      "cardShape": "royal-rounded",
      "texture": "dark-space"
    },
    "thumbnail": "/templates/thumbnails/circumcision-velvet.webp",
    "designSignature": {
      "composition": "premium-upgraded",
      "desktopGrid": "flexible",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "hero",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "rounded",
      "venuePresentation": "cards",
      "heroElement": "photo",
      "photoUsage": "background",
      "openingAnimation": "fade"
    },
    "colorVariants": [
      {
        "id": "circumcision-velvet-var-1",
        "name": "Standart"
      },
      {
        "id": "circumcision-velvet-var-2",
        "name": "Gece Modu"
      }
    ],
    "mediaSupport": "background",
    "backgroundOptions": [COMMON_BACKGROUNDS.MARBLE_LIGHT, COMMON_BACKGROUNDS.MARBLE_DARK, COMMON_BACKGROUNDS.MARBLE_SAGE, COMMON_BACKGROUNDS.MINIMAL_WHITE, COMMON_BACKGROUNDS.CANVAS_PAPER],
    "defaultBackground": "marble-light"
  },
  {
    "id": "circumcision-ottoman",
    "name": "Osmanlı Sarayı Sünnet",
    "category": "Klasik",
    "eventType": "circumcision",
    "primary_color": "#dfa857",
    "text_color": "#451a03",
    "font_family": "Cinzel",
    "background_image_url": null,
    "use_envelope": true,
    "envelope_color": "#7c2d12",
    "envelope_bg_color": "solid-burgundy",
    "envelope_flap_type": "pointed",
    "seal_type": "crown",
    "seal_color": "#dfa857",
    "recommendedOpeningType": "curtain",
    "recommendedOpeningStyle": "royal-burgundy",
    "recommendedBackgroundDesign": "solid-burgundy",
    "recommendedBackgroundAnimation": "goldParticles",
    "layoutStyle": "ottoman-garden",
    "layoutMode": "full-bleed",
    "palette": {
      "background": "#450a0a",
      "card": "#fffbeb",
      "primary": "#451a03",
      "secondary": "#dfa857",
      "accent": "#fde68a",
      "text": "#451a03",
      "mutedText": "#9a3412"
    },
    "typography": {
      "heading": "Cinzel",
      "body": "Cormorant Garamond",
      "accent": "Great Vibes"
    },
    "visualDetails": {
      "border": "baroque-pattern",
      "seal": "gold-crest",
      "cardShape": "royal-rounded",
      "texture": "fine-paper"
    },
    "thumbnail": "/templates/thumbnails/circumcision-ottoman.webp",
    "designSignature": {
      "composition": "premium-upgraded",
      "desktopGrid": "flexible",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "hero",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "rounded",
      "venuePresentation": "cards",
      "heroElement": "photo",
      "photoUsage": "background",
      "openingAnimation": "fade"
    },
    "colorVariants": [
      {
        "id": "circumcision-ottoman-var-1",
        "name": "Standart"
      },
      {
        "id": "circumcision-ottoman-var-2",
        "name": "Gece Modu"
      }
    ],
    "mediaSupport": "background",
    "backgroundOptions": [COMMON_BACKGROUNDS.ROYAL_VELVET, COMMON_BACKGROUNDS.MARBLE_LIGHT, COMMON_BACKGROUNDS.MARBLE_DARK, COMMON_BACKGROUNDS.LINEN],
    "defaultBackground": "royal-velvet"
  },
  {
    "id": "circumcision-crown",
    "name": "Altın Taçlı Sünnet",
    "category": "Lüks",
    "eventType": "circumcision",
    "primary_color": "#d4af37",
    "text_color": "#1e293b",
    "font_family": "Cormorant Garamond",
    "background_image_url": null,
    "use_envelope": true,
    "envelope_color": "#ffffff",
    "envelope_bg_color": "white-gold-marble",
    "envelope_flap_type": "triangle",
    "seal_type": "crown",
    "seal_color": "#d4af37",
    "recommendedOpeningType": "envelope",
    "recommendedOpeningStyle": "minimal-white",
    "recommendedBackgroundDesign": "white-gold-marble",
    "recommendedBackgroundAnimation": "goldParticles",
    "layoutStyle": "crown-crest",
    "layoutMode": "full-bleed",
    "palette": {
      "background": "#fafafa",
      "card": "#ffffff",
      "primary": "#1e293b",
      "secondary": "#d4af37",
      "accent": "#f1f5f9",
      "text": "#1e293b",
      "mutedText": "#64748b"
    },
    "typography": {
      "heading": "Cinzel",
      "body": "Cormorant Garamond",
      "accent": "Great Vibes"
    },
    "visualDetails": {
      "border": "geometric-gold",
      "seal": "gold-crown",
      "cardShape": "rounded-luxury",
      "texture": "marble"
    },
    "thumbnail": "/templates/thumbnails/circumcision-crown.webp",
    "designSignature": {
      "composition": "premium-upgraded",
      "desktopGrid": "flexible",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "hero",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "rounded",
      "venuePresentation": "cards",
      "heroElement": "photo",
      "photoUsage": "background",
      "openingAnimation": "fade"
    },
    "colorVariants": [
      {
        "id": "circumcision-crown-var-1",
        "name": "Standart"
      },
      {
        "id": "circumcision-crown-var-2",
        "name": "Gece Modu"
      }
    ],
    "mediaSupport": "background",
    "backgroundOptions": [COMMON_BACKGROUNDS.MARBLE_LIGHT, COMMON_BACKGROUNDS.MARBLE_DARK, COMMON_BACKGROUNDS.MARBLE_SAGE, COMMON_BACKGROUNDS.MINIMAL_WHITE, COMMON_BACKGROUNDS.CANVAS_PAPER],
    "defaultBackground": "marble-light"
  },
  {
    "id": "circumcision-modern",
    "name": "Modern Mavi Monogram",
    "category": "Modern",
    "eventType": "circumcision",
    "primary_color": "#2563eb",
    "text_color": "#1e293b",
    "font_family": "Outfit",
    "background_image_url": null,
    "use_envelope": true,
    "envelope_color": "#f8fafc",
    "envelope_bg_color": "minimal-white-paper",
    "envelope_flap_type": "rounded",
    "seal_type": "ring",
    "seal_color": "#2563eb",
    "recommendedOpeningType": "minimalFade",
    "recommendedOpeningStyle": "minimal-white",
    "recommendedBackgroundDesign": "minimal-white-paper",
    "recommendedBackgroundAnimation": "pearlLight",
    "layoutStyle": "modern-geometric-monogram",
    "layoutMode": "full-bleed",
    "palette": {
      "background": "#f1f5f9",
      "card": "#ffffff",
      "primary": "#1e293b",
      "secondary": "#2563eb",
      "accent": "#dbeafe",
      "text": "#1e293b",
      "mutedText": "#64748b"
    },
    "typography": {
      "heading": "Outfit",
      "body": "Inter",
      "accent": "Allura"
    },
    "visualDetails": {
      "border": "minimal-line",
      "seal": "silver-seal",
      "cardShape": "clean-rectangle",
      "texture": "fine-paper"
    },
    "thumbnail": "/templates/thumbnails/circumcision-modern.webp",
    "designSignature": {
      "composition": "premium-upgraded",
      "desktopGrid": "flexible",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "hero",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "rounded",
      "venuePresentation": "cards",
      "heroElement": "photo",
      "photoUsage": "background",
      "openingAnimation": "fade"
    },
    "colorVariants": [
      {
        "id": "circumcision-modern-var-1",
        "name": "Standart"
      },
      {
        "id": "circumcision-modern-var-2",
        "name": "Gece Modu"
      }
    ],
    "mediaSupport": "background",
    "backgroundOptions": [COMMON_BACKGROUNDS.ROYAL_VELVET, COMMON_BACKGROUNDS.MARBLE_LIGHT, COMMON_BACKGROUNDS.MARBLE_DARK, COMMON_BACKGROUNDS.LINEN],
    "defaultBackground": "royal-velvet"
  },
  {
    "id": "baby-girl-princess",
    "name": "Pembe Prenses Sarayı",
    "category": "Çocuk",
    "eventType": "baby_shower",
    "genderVariant": "girl",
    "primary_color": "#ec4899",
    "text_color": "#831843",
    "font_family": "Inter",
    "background_image_url": null,
    "use_envelope": true,
    "envelope_color": "#fce7f3",
    "envelope_bg_color": "rose-gold-silk",
    "envelope_flap_type": "rounded",
    "seal_type": "heart",
    "seal_color": "#ec4899",
    "recommendedOpeningType": "envelope",
    "recommendedOpeningStyle": "rose-gold-romantic",
    "recommendedBackgroundDesign": "rose-gold-silk",
    "recommendedBackgroundAnimation": "rosePetals",
    "layoutStyle": "fashion-editorial",
    "layoutMode": "full-bleed",
    "palette": {
      "background": "#fdf2f8",
      "card": "#ffffff",
      "primary": "#ec4899",
      "secondary": "#fce7f3",
      "accent": "#fdf2f8",
      "text": "#831843",
      "mutedText": "#db2777"
    },
    "typography": {
      "heading": "Outfit",
      "body": "Inter",
      "accent": "Parisienne"
    },
    "visualDetails": {
      "border": "watercolor-frame",
      "seal": "rose-seal",
      "cardShape": "soft-rounded",
      "texture": "silk-paper"
    },
    "thumbnail": "/templates/thumbnails/baby-girl-princess.webp",
    "designSignature": {
      "composition": "premium-upgraded",
      "desktopGrid": "flexible",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "hero",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "rounded",
      "venuePresentation": "cards",
      "heroElement": "photo",
      "photoUsage": "background",
      "openingAnimation": "fade"
    },
    "colorVariants": [
      {
        "id": "baby-girl-princess-var-1",
        "name": "Standart"
      },
      {
        "id": "baby-girl-princess-var-2",
        "name": "Gece Modu"
      },
      {
        "id": "baby-girl-fashion",
        "name": "Parıltılı Moda Bebek Partisi"
      }
    ],
    "mediaSupport": "background",
    "backgroundOptions": [COMMON_BACKGROUNDS.SOFT_PINK, COMMON_BACKGROUNDS.CANVAS_PAPER, COMMON_BACKGROUNDS.MINIMAL_WHITE],
    "defaultBackground": "soft-pink"
  },
  {
    "id": "baby-girl-crown",
    "name": "Taçlı Küçük Prenses",
    "category": "Çocuk",
    "eventType": "baby_shower",
    "genderVariant": "girl",
    "primary_color": "#f43f5e",
    "text_color": "#881337",
    "font_family": "Inter",
    "background_image_url": null,
    "use_envelope": true,
    "envelope_color": "#ffe4e6",
    "envelope_bg_color": "rose-gold-silk",
    "envelope_flap_type": "triangle",
    "seal_type": "crown",
    "seal_color": "#f43f5e",
    "recommendedOpeningType": "envelope",
    "recommendedOpeningStyle": "rose-gold-romantic",
    "recommendedBackgroundDesign": "rose-gold-silk",
    "recommendedBackgroundAnimation": "rosePetals",
    "layoutStyle": "crown-jewel-box",
    "layoutMode": "full-bleed",
    "palette": {
      "background": "#fff1f2",
      "card": "#ffffff",
      "primary": "#f43f5e",
      "secondary": "#ffe4e6",
      "accent": "#fff1f2",
      "text": "#881337",
      "mutedText": "#e11d48"
    },
    "typography": {
      "heading": "Outfit",
      "body": "Inter",
      "accent": "Parisienne"
    },
    "visualDetails": {
      "border": "watercolor-frame",
      "seal": "rose-seal",
      "cardShape": "soft-rounded",
      "texture": "silk-paper"
    },
    "thumbnail": "/templates/thumbnails/baby-girl-crown.webp",
    "designSignature": {
      "composition": "premium-upgraded",
      "desktopGrid": "flexible",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "hero",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "rounded",
      "venuePresentation": "cards",
      "heroElement": "photo",
      "photoUsage": "background",
      "openingAnimation": "fade"
    },
    "colorVariants": [
      {
        "id": "baby-girl-crown-var-1",
        "name": "Standart"
      },
      {
        "id": "baby-girl-crown-var-2",
        "name": "Gece Modu"
      },
      {
        "id": "baby-girl-toy",
        "name": "Pembe Oyuncak Dünyası"
      }
    ],
    "mediaSupport": "background",
    "backgroundOptions": [COMMON_BACKGROUNDS.SOFT_PINK, COMMON_BACKGROUNDS.CANVAS_PAPER, COMMON_BACKGROUNDS.MINIMAL_WHITE],
    "defaultBackground": "soft-pink"
  },
  {
    "id": "baby-girl-clouds",
    "name": "Masal Bulutları",
    "category": "Çocuk",
    "eventType": "baby_shower",
    "genderVariant": "girl",
    "primary_color": "#f472b6",
    "text_color": "#4c0519",
    "font_family": "Inter",
    "background_image_url": null,
    "use_envelope": true,
    "envelope_color": "#fdf2f8",
    "envelope_bg_color": "rose-gold-silk",
    "envelope_flap_type": "rounded",
    "seal_type": "heart",
    "seal_color": "#f472b6",
    "recommendedOpeningType": "envelope",
    "recommendedOpeningStyle": "rose-gold-romantic",
    "recommendedBackgroundDesign": "rose-gold-silk",
    "recommendedBackgroundAnimation": "rosePetals",
    "layoutStyle": "storybook",
    "layoutMode": "full-bleed",
    "palette": {
      "background": "#fff5f5",
      "card": "#ffffff",
      "primary": "#f472b6",
      "secondary": "#ffe4e6",
      "accent": "#fff5f5",
      "text": "#4c0519",
      "mutedText": "#db2777"
    },
    "typography": {
      "heading": "Outfit",
      "body": "Inter",
      "accent": "Parisienne"
    },
    "visualDetails": {
      "border": "watercolor-frame",
      "seal": "rose-seal",
      "cardShape": "soft-rounded",
      "texture": "silk-paper"
    },
    "thumbnail": "/templates/thumbnails/baby-girl-clouds.webp",
    "designSignature": {
      "composition": "premium-upgraded",
      "desktopGrid": "flexible",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "hero",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "rounded",
      "venuePresentation": "cards",
      "heroElement": "photo",
      "photoUsage": "background",
      "openingAnimation": "fade"
    },
    "colorVariants": [
      {
        "id": "baby-girl-clouds-var-1",
        "name": "Standart"
      },
      {
        "id": "baby-girl-clouds-var-2",
        "name": "Gece Modu"
      }
    ],
    "mediaSupport": "none"
  },
  {
    "id": "baby-boy-racer",
    "name": "Küçük Yarışçı",
    "category": "Çocuk",
    "eventType": "birthday",
    "genderVariant": "boy",
    "primary_color": "#2563eb",
    "text_color": "#1e3a8a",
    "font_family": "Inter",
    "background_image_url": null,
    "use_envelope": true,
    "envelope_color": "#dbeafe",
    "envelope_bg_color": "minimal-white-paper",
    "envelope_flap_type": "rounded",
    "seal_type": "ring",
    "seal_color": "#2563eb",
    "recommendedOpeningType": "envelope",
    "recommendedOpeningStyle": "minimal-white",
    "recommendedBackgroundDesign": "minimal-white-paper",
    "recommendedBackgroundAnimation": "snowFall",
    "layoutStyle": "kids-thematic",
    "layoutMode": "full-bleed",
    "palette": {
      "background": "#eff6ff",
      "card": "#ffffff",
      "primary": "#2563eb",
      "secondary": "#dbeafe",
      "accent": "#eff6ff",
      "text": "#1e3a8a",
      "mutedText": "#3b82f6"
    },
    "typography": {
      "heading": "Outfit",
      "body": "Inter",
      "accent": "Allura"
    },
    "visualDetails": {
      "border": "watercolor-frame",
      "seal": "silver-seal",
      "cardShape": "soft-rounded",
      "texture": "fine-paper"
    },
    "thumbnail": "/templates/thumbnails/baby-boy-racer.webp",
    "designSignature": {
      "composition": "premium-upgraded",
      "desktopGrid": "flexible",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "hero",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "rounded",
      "venuePresentation": "cards",
      "heroElement": "photo",
      "photoUsage": "background",
      "openingAnimation": "fade"
    },
    "colorVariants": [
      {
        "id": "baby-boy-racer-var-1",
        "name": "Standart"
      },
      {
        "id": "baby-boy-racer-var-2",
        "name": "Gece Modu"
      },
      {
        "id": "baby-boy-bear",
        "name": "Mavi Ayıcık"
      },
      {
        "id": "baby-boy-safari",
        "name": "Safari Bebek"
      },
      {
        "id": "baby-boy-sailor",
        "name": "Denizci Çocuk"
      }
    ],
    "mediaSupport": "background",
    "backgroundOptions": [COMMON_BACKGROUNDS.SOFT_PINK, COMMON_BACKGROUNDS.CANVAS_PAPER, COMMON_BACKGROUNDS.MINIMAL_WHITE],
    "defaultBackground": "soft-pink"
  },
  {
    "id": "baby-boy-clouds",
    "name": "Bulutların Üzerinde",
    "category": "Çocuk",
    "eventType": "birthday",
    "genderVariant": "boy",
    "primary_color": "#38bdf8",
    "text_color": "#0369a1",
    "font_family": "Inter",
    "background_image_url": null,
    "use_envelope": true,
    "envelope_color": "#e0f2fe",
    "envelope_bg_color": "minimal-white-paper",
    "envelope_flap_type": "rounded",
    "seal_type": "heart",
    "seal_color": "#38bdf8",
    "recommendedOpeningType": "envelope",
    "recommendedOpeningStyle": "minimal-white",
    "recommendedBackgroundDesign": "minimal-white-paper",
    "recommendedBackgroundAnimation": "pearlLight",
    "layoutStyle": "hot-air-balloon",
    "layoutMode": "full-bleed",
    "palette": {
      "background": "#f0f9ff",
      "card": "#ffffff",
      "primary": "#38bdf8",
      "secondary": "#e0f2fe",
      "accent": "#f0f9ff",
      "text": "#0369a1",
      "mutedText": "#0284c7"
    },
    "typography": {
      "heading": "Outfit",
      "body": "Inter",
      "accent": "Allura"
    },
    "visualDetails": {
      "border": "watercolor-frame",
      "seal": "silver-seal",
      "cardShape": "soft-rounded",
      "texture": "fine-paper"
    },
    "thumbnail": "/templates/thumbnails/baby-boy-clouds.webp",
    "designSignature": {
      "composition": "premium-upgraded",
      "desktopGrid": "flexible",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "hero",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "rounded",
      "venuePresentation": "cards",
      "heroElement": "photo",
      "photoUsage": "background",
      "openingAnimation": "fade"
    },
    "colorVariants": [
      {
        "id": "baby-boy-clouds-var-1",
        "name": "Standart"
      },
      {
        "id": "baby-boy-clouds-var-2",
        "name": "Gece Modu"
      }
    ],
    "mediaSupport": "none"
  },
  {
    "id": "baby-boy-space",
    "name": "Uzay Macerası",
    "category": "Çocuk",
    "eventType": "birthday",
    "genderVariant": "boy",
    "primary_color": "#6366f1",
    "text_color": "#312e81",
    "font_family": "Inter",
    "background_image_url": null,
    "use_envelope": true,
    "envelope_color": "#e0e7ff",
    "envelope_bg_color": "navy-gold-night",
    "envelope_flap_type": "triangle",
    "seal_type": "crown",
    "seal_color": "#6366f1",
    "recommendedOpeningType": "envelope",
    "recommendedOpeningStyle": "navy-gold",
    "recommendedBackgroundDesign": "navy-gold-night",
    "recommendedBackgroundAnimation": "stars",
    "layoutStyle": "kids-thematic",
    "layoutMode": "full-bleed",
    "palette": {
      "background": "#070a13",
      "card": "#0f172a",
      "primary": "#6366f1",
      "secondary": "#1e1b4b",
      "accent": "#2e1065",
      "text": "#e0e7ff",
      "mutedText": "#818cf8"
    },
    "typography": {
      "heading": "Outfit",
      "body": "Inter",
      "accent": "Allura"
    },
    "visualDetails": {
      "border": "watercolor-frame",
      "seal": "silver-seal",
      "cardShape": "soft-rounded",
      "texture": "dark-space"
    },
    "thumbnail": "/templates/thumbnails/baby-boy-space.webp",
    "designSignature": {
      "composition": "premium-upgraded",
      "desktopGrid": "flexible",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "hero",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "rounded",
      "venuePresentation": "cards",
      "heroElement": "photo",
      "photoUsage": "background",
      "openingAnimation": "fade"
    },
    "colorVariants": [
      {
        "id": "baby-boy-space-var-1",
        "name": "Standart"
      },
      {
        "id": "baby-boy-space-var-2",
        "name": "Gece Modu"
      }
    ],
    "mediaSupport": "background",
    "backgroundOptions": [COMMON_BACKGROUNDS.SOFT_PINK, COMMON_BACKGROUNDS.CANVAS_PAPER, COMMON_BACKGROUNDS.MINIMAL_WHITE],
    "defaultBackground": "soft-pink"
  },
  {
    "id": "engagement-blush",
    "name": "Pudra ve Rose Gold Nişan",
    "category": "Doğal",
    "eventType": "engagement",
    "primary_color": "#db2777",
    "text_color": "#831843",
    "font_family": "Lora",
    "background_image_url": null,
    "use_envelope": true,
    "envelope_color": "#fce7f3",
    "envelope_bg_color": "rose-gold-silk",
    "envelope_flap_type": "rounded",
    "seal_type": "rose",
    "seal_color": "#db2777",
    "recommendedOpeningType": "envelope",
    "recommendedOpeningStyle": "rose-gold-romantic",
    "recommendedBackgroundDesign": "rose-gold-silk",
    "recommendedBackgroundAnimation": "rosePetals",
    "layoutStyle": "engagement-table",
    "layoutMode": "full-bleed",
    "palette": {
      "background": "#fff1ec",
      "card": "#ffffff",
      "primary": "#db2777",
      "secondary": "#eeded8",
      "accent": "#fdf6f3",
      "text": "#831843",
      "mutedText": "#c98778"
    },
    "typography": {
      "heading": "Playfair Display",
      "body": "Lora",
      "accent": "Parisienne"
    },
    "visualDetails": {
      "border": "soft-rose-frame",
      "seal": "rose-seal",
      "cardShape": "soft-rounded",
      "texture": "silk-paper"
    },
    "thumbnail": "/templates/thumbnails/engagement-blush.webp",
    "designSignature": {
      "composition": "premium-upgraded",
      "desktopGrid": "flexible",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "hero",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "rounded",
      "venuePresentation": "cards",
      "heroElement": "photo",
      "photoUsage": "background",
      "openingAnimation": "fade"
    },
    "colorVariants": [
      {
        "id": "engagement-blush-var-1",
        "name": "Standart"
      },
      {
        "id": "engagement-blush-var-2",
        "name": "Gece Modu"
      }
    ],
    "mediaSupport": "background",
    "backgroundOptions": [COMMON_BACKGROUNDS.CANVAS_PAPER, COMMON_BACKGROUNDS.CARDBOARD, COMMON_BACKGROUNDS.LINEN, COMMON_BACKGROUNDS.MARBLE_SAGE],
    "defaultBackground": "canvas-paper"
  },
  {
    "id": "engagement-emerald",
    "name": "Zümrüt Yeşili Söz",
    "category": "Lüks",
    "eventType": "engagement",
    "primary_color": "#dfb76c",
    "text_color": "#064e3b",
    "font_family": "Cormorant Garamond",
    "background_image_url": null,
    "use_envelope": true,
    "envelope_color": "#064e3b",
    "envelope_bg_color": "emerald-marble",
    "envelope_flap_type": "pointed",
    "seal_type": "crown",
    "seal_color": "#dfb76c",
    "recommendedOpeningType": "door",
    "recommendedOpeningStyle": "black-gold-premium",
    "recommendedBackgroundDesign": "emerald-marble",
    "recommendedBackgroundAnimation": "goldParticles",
    "layoutStyle": "emerald-elegance",
    "layoutMode": "full-bleed",
    "palette": {
      "background": "#042f24",
      "card": "#ffffff",
      "primary": "#064e3b",
      "secondary": "#dfb76c",
      "accent": "#0d5c47",
      "text": "#064e3b",
      "mutedText": "#447b6a"
    },
    "typography": {
      "heading": "Cinzel",
      "body": "Cormorant Garamond",
      "accent": "Great Vibes"
    },
    "visualDetails": {
      "border": "double-gold",
      "seal": "gold-crown",
      "cardShape": "royal-rounded",
      "texture": "marble"
    },
    "thumbnail": "/templates/thumbnails/engagement-emerald.webp",
    "designSignature": {
      "composition": "premium-upgraded",
      "desktopGrid": "flexible",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "hero",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "rounded",
      "venuePresentation": "cards",
      "heroElement": "photo",
      "photoUsage": "background",
      "openingAnimation": "fade"
    },
    "colorVariants": [
      {
        "id": "engagement-emerald-var-1",
        "name": "Standart"
      },
      {
        "id": "engagement-emerald-var-2",
        "name": "Gece Modu"
      }
    ],
    "mediaSupport": "background",
    "backgroundOptions": [COMMON_BACKGROUNDS.MARBLE_LIGHT, COMMON_BACKGROUNDS.MARBLE_DARK, COMMON_BACKGROUNDS.MARBLE_SAGE, COMMON_BACKGROUNDS.MINIMAL_WHITE, COMMON_BACKGROUNDS.CANVAS_PAPER],
    "defaultBackground": "marble-light"
  },
  {
    "id": "engagement-minimal",
    "name": "Minimal Bej Nişan",
    "category": "Minimalist",
    "eventType": "engagement",
    "primary_color": "#7c6953",
    "text_color": "#3e3429",
    "font_family": "Outfit",
    "background_image_url": null,
    "use_envelope": true,
    "envelope_color": "#f5f0e6",
    "envelope_bg_color": "minimal-white-paper",
    "envelope_flap_type": "classic",
    "seal_type": "infinity",
    "seal_color": "#7c6953",
    "recommendedOpeningType": "minimalFade",
    "recommendedOpeningStyle": "minimal-white",
    "recommendedBackgroundDesign": "minimal-white-paper",
    "recommendedBackgroundAnimation": "pearlLight",
    "layoutStyle": "minimal-ceremony",
    "layoutMode": "full-bleed",
    "palette": {
      "background": "#fcfaf7",
      "card": "#ffffff",
      "primary": "#3e3429",
      "secondary": "#ebe2d3",
      "accent": "#f5eee0",
      "text": "#3e3429",
      "mutedText": "#7e6b56"
    },
    "typography": {
      "heading": "Outfit",
      "body": "Inter",
      "accent": "Parisienne"
    },
    "visualDetails": {
      "border": "minimal-line",
      "seal": "beige-seal",
      "cardShape": "clean-rectangle",
      "texture": "fine-paper"
    },
    "thumbnail": "/templates/thumbnails/engagement-minimal.webp",
    "designSignature": {
      "composition": "premium-upgraded",
      "desktopGrid": "flexible",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "hero",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "rounded",
      "venuePresentation": "cards",
      "heroElement": "photo",
      "photoUsage": "background",
      "openingAnimation": "fade"
    },
    "colorVariants": [
      {
        "id": "engagement-minimal-var-1",
        "name": "Standart"
      },
      {
        "id": "engagement-minimal-var-2",
        "name": "Gece Modu"
      }
    ],
    "mediaSupport": "background",
    "backgroundOptions": [COMMON_BACKGROUNDS.MINIMAL_WHITE, COMMON_BACKGROUNDS.CANVAS_PAPER, COMMON_BACKGROUNDS.LINEN],
    "defaultBackground": "minimal-white"
  },
  {
    "id": "engagement-family",
    "name": "Çiçekli Aile Daveti",
    "category": "Klasik",
    "eventType": "engagement",
    "primary_color": "#a3704c",
    "text_color": "#3d2b1f",
    "font_family": "Lora",
    "background_image_url": null,
    "use_envelope": true,
    "envelope_color": "#faf6ee",
    "envelope_bg_color": "minimal-white-paper",
    "envelope_flap_type": "classic",
    "seal_type": "floral",
    "seal_color": "#a3704c",
    "recommendedOpeningType": "envelope",
    "recommendedOpeningStyle": "minimal-white",
    "recommendedBackgroundDesign": "minimal-white-paper",
    "recommendedBackgroundAnimation": "pearlLight",
    "layoutStyle": "floral-family",
    "layoutMode": "full-bleed",
    "palette": {
      "background": "#faf6ee",
      "card": "#ffffff",
      "primary": "#a3704c",
      "secondary": "#f3ede0",
      "accent": "#fbf9f4",
      "text": "#3d2b1f",
      "mutedText": "#695d52"
    },
    "typography": {
      "heading": "Playfair Display",
      "body": "Lora",
      "accent": "Parisienne"
    },
    "visualDetails": {
      "border": "minimal-line",
      "seal": "gold-seal",
      "cardShape": "clean-rectangle",
      "texture": "fine-paper"
    },
    "thumbnail": "/templates/thumbnails/engagement-family.webp",
    "designSignature": {
      "composition": "premium-upgraded",
      "desktopGrid": "flexible",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "hero",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "rounded",
      "venuePresentation": "cards",
      "heroElement": "photo",
      "photoUsage": "background",
      "openingAnimation": "fade"
    },
    "colorVariants": [
      {
        "id": "engagement-family-var-1",
        "name": "Standart"
      },
      {
        "id": "engagement-family-var-2",
        "name": "Gece Modu"
      }
    ],
    "mediaSupport": "background",
    "backgroundOptions": [COMMON_BACKGROUNDS.ROYAL_VELVET, COMMON_BACKGROUNDS.MARBLE_LIGHT, COMMON_BACKGROUNDS.MARBLE_DARK, COMMON_BACKGROUNDS.LINEN],
    "defaultBackground": "royal-velvet"
  },
  {
    "id": "engagement-gold-frame",
    "name": "Altın Çerçeveli Söz",
    "category": "Lüks",
    "eventType": "engagement",
    "primary_color": "#d4af37",
    "text_color": "#1a1a1a",
    "font_family": "Cinzel",
    "background_image_url": null,
    "use_envelope": true,
    "envelope_color": "#111111",
    "envelope_bg_color": "black-gold-velvet",
    "envelope_flap_type": "triangle",
    "seal_type": "crown",
    "seal_color": "#d4af37",
    "recommendedOpeningType": "door",
    "recommendedOpeningStyle": "black-gold-premium",
    "recommendedBackgroundDesign": "black-gold-velvet",
    "recommendedBackgroundAnimation": "goldParticles",
    "layoutStyle": "gold-frame-gallery",
    "layoutMode": "full-bleed",
    "palette": {
      "background": "#0a0a0a",
      "card": "#ffffff",
      "primary": "#1a1a1a",
      "secondary": "#d4af37",
      "accent": "#e6cc80",
      "text": "#1a1a1a",
      "mutedText": "#5c5c5c"
    },
    "typography": {
      "heading": "Cinzel",
      "body": "Cormorant Garamond",
      "accent": "Great Vibes"
    },
    "visualDetails": {
      "border": "geometric-gold",
      "seal": "royal-seal",
      "cardShape": "rounded-luxury",
      "texture": "marble"
    },
    "thumbnail": "/templates/thumbnails/engagement-gold-frame.webp",
    "designSignature": {
      "composition": "premium-upgraded",
      "desktopGrid": "flexible",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "hero",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "rounded",
      "venuePresentation": "cards",
      "heroElement": "photo",
      "photoUsage": "background",
      "openingAnimation": "fade"
    },
    "colorVariants": [
      {
        "id": "engagement-gold-frame-var-1",
        "name": "Standart"
      },
      {
        "id": "engagement-gold-frame-var-2",
        "name": "Gece Modu"
      }
    ],
    "mediaSupport": "background",
    "backgroundOptions": [COMMON_BACKGROUNDS.MARBLE_LIGHT, COMMON_BACKGROUNDS.MARBLE_DARK, COMMON_BACKGROUNDS.MARBLE_SAGE, COMMON_BACKGROUNDS.MINIMAL_WHITE, COMMON_BACKGROUNDS.CANVAS_PAPER],
    "defaultBackground": "marble-light"
  },
  {
    "id": "engagement-lavender",
    "name": "Lavanta Bahçesi Nişan",
    "category": "Doğal",
    "eventType": "engagement",
    "primary_color": "#8b5cf6",
    "text_color": "#4c1d95",
    "font_family": "Lora",
    "background_image_url": null,
    "use_envelope": true,
    "envelope_color": "#f5f3ff",
    "envelope_bg_color": "pastel-floral",
    "envelope_flap_type": "rounded",
    "seal_type": "floral",
    "seal_color": "#8b5cf6",
    "recommendedOpeningType": "envelope",
    "recommendedOpeningStyle": "pastel-floral",
    "recommendedBackgroundDesign": "pastel-floral",
    "recommendedBackgroundAnimation": "rosePetals",
    "layoutStyle": "lavender-garden",
    "layoutMode": "full-bleed",
    "palette": {
      "background": "#faf8ff",
      "card": "#ffffff",
      "primary": "#8b5cf6",
      "secondary": "#ddd6fe",
      "accent": "#ede9fe",
      "text": "#4c1d95",
      "mutedText": "#7c3aed"
    },
    "typography": {
      "heading": "Playfair Display",
      "body": "Lora",
      "accent": "Parisienne"
    },
    "visualDetails": {
      "border": "watercolor-frame",
      "seal": "lavender-flower",
      "cardShape": "soft-rounded",
      "texture": "silk-paper"
    },
    "thumbnail": "/templates/thumbnails/engagement-lavender.webp",
    "designSignature": {
      "composition": "premium-upgraded",
      "desktopGrid": "flexible",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "hero",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "rounded",
      "venuePresentation": "cards",
      "heroElement": "photo",
      "photoUsage": "background",
      "openingAnimation": "fade"
    },
    "colorVariants": [
      {
        "id": "engagement-lavender-var-1",
        "name": "Standart"
      },
      {
        "id": "engagement-lavender-var-2",
        "name": "Gece Modu"
      }
    ],
    "mediaSupport": "background",
    "backgroundOptions": [COMMON_BACKGROUNDS.CANVAS_PAPER, COMMON_BACKGROUNDS.CARDBOARD, COMMON_BACKGROUNDS.LINEN, COMMON_BACKGROUNDS.MARBLE_SAGE],
    "defaultBackground": "canvas-paper"
  },
  {
    "id": "modern-architecture",
    "name": "Modern Mimari Düğün",
    "layoutStyle": "modern-architecture",
    "layoutMode": "full-bleed",
    "eventType": "wedding",
    "category": "Modern",
    "background_image_url": null,
    "primary_color": "#1e293b",
    "font_family": "Inter",
    "recommendedOpeningType": "slide-up",
    "recommendedOpeningStyle": "minimal",
    "recommendedBackgroundDesign": "minimal-white-paper",
    "recommendedBackgroundAnimation": "none",
    "palette": {
      "background": "#f8fafc",
      "card": "#ffffff",
      "primary": "#0f172a",
      "secondary": "#64748b",
      "accent": "#e2e8f0",
      "text": "#0f172a",
      "mutedText": "#64748b"
    },
    "thumbnail": "/templates/thumbnails/modern-architecture.webp",
    "designSignature": {
      "composition": "premium-upgraded",
      "desktopGrid": "flexible",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "hero",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "rounded",
      "venuePresentation": "cards",
      "heroElement": "photo",
      "photoUsage": "background",
      "openingAnimation": "fade"
    },
    "colorVariants": [
      {
        "id": "modern-architecture-var-1",
        "name": "Standart"
      },
      {
        "id": "modern-architecture-var-2",
        "name": "Gece Modu"
      }
    ],
    "mediaSupport": "background",
    "backgroundOptions": [COMMON_BACKGROUNDS.MINIMAL_WHITE, COMMON_BACKGROUNDS.CANVAS_PAPER, COMMON_BACKGROUNDS.LINEN],
    "defaultBackground": "minimal-white"
  },
  {
    "id": "botanical-ceramic",
    "name": "Botanik Seramik",
    "layoutStyle": "botanical-frame",
    "layoutMode": "full-bleed",
    "eventType": "wedding",
    "category": "Doğal",
    "background_image_url": null,
    "primary_color": "#166534",
    "font_family": "Cormorant Garamond",
    "recommendedOpeningType": "fade-in",
    "recommendedOpeningStyle": "classic",
    "recommendedBackgroundDesign": "watercolor-wash",
    "recommendedBackgroundAnimation": "none",
    "palette": {
      "background": "#f0fdf4",
      "card": "#ffffff",
      "primary": "#14532d",
      "secondary": "#22c55e",
      "accent": "#dcfce7",
      "text": "#14532d",
      "mutedText": "#15803d"
    },
    "thumbnail": "/templates/thumbnails/botanical-ceramic.webp",
    "designSignature": {
      "composition": "premium-upgraded",
      "desktopGrid": "flexible",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "hero",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "rounded",
      "venuePresentation": "cards",
      "heroElement": "photo",
      "photoUsage": "background",
      "openingAnimation": "fade"
    },
    "colorVariants": [
      {
        "id": "botanical-ceramic-var-1",
        "name": "Standart"
      },
      {
        "id": "botanical-ceramic-var-2",
        "name": "Gece Modu"
      }
    ],
    "mediaSupport": "background",
    "backgroundOptions": [COMMON_BACKGROUNDS.CANVAS_PAPER, COMMON_BACKGROUNDS.CARDBOARD, COMMON_BACKGROUNDS.LINEN, COMMON_BACKGROUNDS.MARBLE_SAGE],
    "defaultBackground": "canvas-paper"
  },
  {
    "id": "luxury-hotel",
    "name": "Lüks Otel Davetiyesi",
    "layoutStyle": "photo-luxury",
    "layoutMode": "full-bleed",
    "eventType": "wedding",
    "category": "Lüks",
    "background_image_url": null,
    "primary_color": "#b45309",
    "font_family": "Playfair Display",
    "recommendedOpeningType": "fade-in",
    "recommendedOpeningStyle": "luxury",
    "recommendedBackgroundDesign": "marble-gold",
    "recommendedBackgroundAnimation": "none",
    "palette": {
      "background": "#fffbeb",
      "card": "#ffffff",
      "primary": "#92400e",
      "secondary": "#d97706",
      "accent": "#fef3c7",
      "text": "#451a03",
      "mutedText": "#78350f"
    },
    "thumbnail": "/templates/thumbnails/luxury-hotel.webp",
    "designSignature": {
      "composition": "premium-upgraded",
      "desktopGrid": "flexible",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "hero",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "rounded",
      "venuePresentation": "cards",
      "heroElement": "photo",
      "photoUsage": "background",
      "openingAnimation": "fade"
    },
    "colorVariants": [
      {
        "id": "luxury-hotel-var-1",
        "name": "Standart"
      },
      {
        "id": "luxury-hotel-var-2",
        "name": "Gece Modu"
      }
    ],
    "mediaSupport": "cover"
  },
  {
    "id": "destination-boarding-pass",
    "name": "Destination Wedding",
    "layoutStyle": "full-bleed",
    "layoutMode": "full-bleed",
    "eventType": "wedding",
    "category": "Modern",
    "background_image_url": null,
    "primary_color": "#0369a1",
    "font_family": "Space Grotesk",
    "recommendedOpeningType": "slide-left",
    "recommendedOpeningStyle": "minimal",
    "recommendedBackgroundDesign": "minimal-white-paper",
    "recommendedBackgroundAnimation": "none",
    "palette": {
      "background": "#f0f9ff",
      "card": "#ffffff",
      "primary": "#075985",
      "secondary": "#0284c7",
      "accent": "#e0f2fe",
      "text": "#082f49",
      "mutedText": "#0369a1"
    },
    "thumbnail": "/templates/thumbnails/destination-boarding-pass.webp",
    "designSignature": {
      "composition": "premium-upgraded",
      "desktopGrid": "flexible",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "hero",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "rounded",
      "venuePresentation": "cards",
      "heroElement": "photo",
      "photoUsage": "background",
      "openingAnimation": "fade"
    },
    "colorVariants": [
      {
        "id": "destination-boarding-pass-var-1",
        "name": "Standart"
      },
      {
        "id": "destination-boarding-pass-var-2",
        "name": "Gece Modu"
      }
    ],
    "mediaSupport": "none"
  },
  {
    "id": "fashion-magazine",
    "name": "Moda Dergisi Editoryal",
    "layoutStyle": "full-bleed",
    "layoutMode": "full-bleed",
    "eventType": "wedding",
    "category": "Lüks",
    "background_image_url": null,
    "primary_color": "#000000",
    "font_family": "Bodoni Moda",
    "recommendedOpeningType": "fade-in",
    "recommendedOpeningStyle": "minimal",
    "recommendedBackgroundDesign": "minimal-white-paper",
    "recommendedBackgroundAnimation": "none",
    "palette": {
      "background": "#ffffff",
      "card": "#ffffff",
      "primary": "#000000",
      "secondary": "#333333",
      "accent": "#f5f5f5",
      "text": "#000000",
      "mutedText": "#666666"
    },
    "thumbnail": "/templates/thumbnails/fashion-magazine.webp",
    "designSignature": {
      "composition": "premium-upgraded",
      "desktopGrid": "flexible",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "hero",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "rounded",
      "venuePresentation": "cards",
      "heroElement": "photo",
      "photoUsage": "background",
      "openingAnimation": "fade"
    },
    "colorVariants": [
      {
        "id": "fashion-magazine-var-1",
        "name": "Standart"
      },
      {
        "id": "fashion-magazine-var-2",
        "name": "Gece Modu"
      }
    ],
    "mediaSupport": "none"
  },
  {
    "id": "art-deco-theater",
    "name": "Art Deco Tiyatro Gecesi",
    "layoutStyle": "full-bleed",
    "layoutMode": "full-bleed",
    "eventType": "wedding",
    "category": "Karanlık",
    "background_image_url": null,
    "primary_color": "#eab308",
    "font_family": "Josefin Sans",
    "recommendedOpeningType": "fade-in",
    "recommendedOpeningStyle": "luxury",
    "recommendedBackgroundDesign": "starlight-dust",
    "recommendedBackgroundAnimation": "gold-sparkles",
    "palette": {
      "background": "#020617",
      "card": "#0f172a",
      "primary": "#ca8a04",
      "secondary": "#eab308",
      "accent": "#1e293b",
      "text": "#f8fafc",
      "mutedText": "#94a3b8"
    },
    "thumbnail": "/templates/thumbnails/art-deco-theater.webp",
    "designSignature": {
      "composition": "premium-upgraded",
      "desktopGrid": "flexible",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "hero",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "rounded",
      "venuePresentation": "cards",
      "heroElement": "photo",
      "photoUsage": "background",
      "openingAnimation": "fade"
    },
    "colorVariants": [
      {
        "id": "art-deco-theater-var-1",
        "name": "Standart"
      },
      {
        "id": "art-deco-theater-var-2",
        "name": "Gece Modu"
      }
    ],
    "mediaSupport": "none"
  },
  {
    "id": "mediterranean-garden",
    "name": "Akdeniz Çini Bahçesi",
    "layoutStyle": "botanical-frame",
    "layoutMode": "full-bleed",
    "eventType": "wedding",
    "category": "Doğal",
    "background_image_url": null,
    "primary_color": "#2563eb",
    "font_family": "Lora",
    "recommendedOpeningType": "fade-in",
    "recommendedOpeningStyle": "classic",
    "recommendedBackgroundDesign": "watercolor-wash",
    "recommendedBackgroundAnimation": "none",
    "palette": {
      "background": "#eff6ff",
      "card": "#ffffff",
      "primary": "#1d4ed8",
      "secondary": "#3b82f6",
      "accent": "#dbeafe",
      "text": "#1e3a8a",
      "mutedText": "#2563eb"
    },
    "thumbnail": "/templates/thumbnails/mediterranean-garden.webp",
    "designSignature": {
      "composition": "premium-upgraded",
      "desktopGrid": "flexible",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "hero",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "rounded",
      "venuePresentation": "cards",
      "heroElement": "photo",
      "photoUsage": "background",
      "openingAnimation": "fade"
    },
    "colorVariants": [
      {
        "id": "mediterranean-garden-var-1",
        "name": "Standart"
      },
      {
        "id": "mediterranean-garden-var-2",
        "name": "Gece Modu"
      }
    ],
    "mediaSupport": "background",
    "backgroundOptions": [COMMON_BACKGROUNDS.CANVAS_PAPER, COMMON_BACKGROUNDS.CARDBOARD, COMMON_BACKGROUNDS.LINEN, COMMON_BACKGROUNDS.MARBLE_SAGE],
    "defaultBackground": "canvas-paper"
  },
  {
    "id": "minimal-typographic",
    "name": "Minimal Tipografik Galeri",
    "layoutStyle": "minimal-paper",
    "layoutMode": "full-bleed",
    "eventType": "wedding",
    "category": "Minimalist",
    "background_image_url": null,
    "primary_color": "#171717",
    "font_family": "Space Grotesk",
    "recommendedOpeningType": "slide-up",
    "recommendedOpeningStyle": "minimal",
    "recommendedBackgroundDesign": "minimal-white-paper",
    "recommendedBackgroundAnimation": "none",
    "palette": {
      "background": "#ffffff",
      "card": "#f5f5f5",
      "primary": "#0a0a0a",
      "secondary": "#404040",
      "accent": "#e5e5e5",
      "text": "#000000",
      "mutedText": "#525252"
    },
    "thumbnail": "/templates/thumbnails/minimal-typographic.webp",
    "designSignature": {
      "composition": "premium-upgraded",
      "desktopGrid": "flexible",
      "mobileFlow": "vertical-scroll",
      "contentOrder": [
        "hero-photo",
        "title",
        "release-date",
        "credits-cast",
        "movie-quote",
        "cinema-timer",
        "ticket-rsvp",
        "guestbook"
      ],
      "namePlacement": "hero",
      "eventTitlePlacement": "above-names",
      "datePlacement": "hero",
      "countdownStyle": "cards",
      "countdownPlacement": "inline-text",
      "actionPlacement": "inline",
      "actionShape": "rounded",
      "venuePresentation": "cards",
      "heroElement": "photo",
      "photoUsage": "background",
      "openingAnimation": "fade"
    },
    "colorVariants": [
      {
        "id": "minimal-typographic-var-1",
        "name": "Standart"
      },
      {
        "id": "minimal-typographic-var-2",
        "name": "Gece Modu"
      }
    ],
    "mediaSupport": "background",
    "backgroundOptions": [COMMON_BACKGROUNDS.MINIMAL_WHITE, COMMON_BACKGROUNDS.CANVAS_PAPER, COMMON_BACKGROUNDS.LINEN],
    "defaultBackground": "minimal-white"
  }
];
