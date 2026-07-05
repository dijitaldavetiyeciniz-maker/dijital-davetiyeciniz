export interface EntranceDesignPreset {
  id: string;
  name: string;
  description: string;
  category: "Zarf" | "Perde" | "Sayfa" | "Kozmik" | "Modern";
  premium: boolean;
  animationType: string;
  envelopeStyle: string;
  sealStyle: string;
  backgroundAnimation: string;
  sealInsignia: string;
}

export const entranceAnimations: EntranceDesignPreset[] = [
  {
    id: "royal-gold-envelope",
    name: "Kraliyet Altın Zarfı",
    description: "Krem renkli kadife zarf, altın varaklı kraliyet mühürü ve altın parıltılı arka plan geçişi.",
    category: "Zarf",
    premium: true,
    animationType: "royal-seal-premium",
    envelopeStyle: "luxury-gold-border",
    sealStyle: "gold",
    backgroundAnimation: "golden",
    sealInsignia: "crown"
  },
  {
    id: "burgundy-velvet-envelope",
    name: "Bordo Güllü Kadife Zarf",
    description: "Derin bordo kadife dokulu zarf, gül damgalı wax mühür ve uçuşan gül yaprakları.",
    category: "Zarf",
    premium: true,
    animationType: "romantic-wax-seal",
    envelopeStyle: "velvet-burgundy",
    sealStyle: "burgundy",
    backgroundAnimation: "petals",
    sealInsignia: "rose"
  },
  {
    id: "modern-black-gold",
    name: "Modern Siyah & Gold Zarf",
    description: "Siyah saten zarf gövdesi, minimalist geometrik mühür ve hafif sisli arka plan.",
    category: "Zarf",
    premium: false,
    animationType: "romantic-wax-seal",
    envelopeStyle: "black-premium",
    sealStyle: "black-gold",
    backgroundAnimation: "night",
    sealInsignia: "olive"
  },
  {
    id: "rustic-olive-kraft",
    name: "Doğal Kraft & Zeytin Dalı",
    description: "Samimi kraft dokulu doğal zarf, zeytin dalı motifli yeşil mühür ve dökülen yapraklar.",
    category: "Zarf",
    premium: false,
    animationType: "romantic-wax-seal",
    envelopeStyle: "kraft",
    sealStyle: "rose-gold",
    backgroundAnimation: "none",
    sealInsignia: "olive"
  },
  {
    id: "theater-curtains-red",
    name: "Kırmızı Kadife Sahne Perdesi",
    description: "Kırmızı tiyatro kadife perdeleri ihtişamla iki yana açılır ve davetiye parıldayarak belirir.",
    category: "Perde",
    premium: true,
    animationType: "theater-curtains-red",
    envelopeStyle: "none",
    sealStyle: "none",
    backgroundAnimation: "golden",
    sealInsignia: "none"
  },
  {
    id: "theater-curtains-gold",
    name: "Altın Saten İpek Perde",
    description: "Altın sarısı saten perdeler iki yana süzülerek açılır, inci ışıltılı partiküller eşlik eder.",
    category: "Perde",
    premium: true,
    animationType: "theater-curtains-gold",
    envelopeStyle: "none",
    sealStyle: "none",
    backgroundAnimation: "pearl",
    sealInsignia: "none"
  },
  {
    id: "cosmic-star-portal",
    name: "Kozmik Yıldız Portalı",
    description: "Mistik bir güneş tutulması ve takımyıldız geçişiyle boyut kapısı açılır, yıldızlı gece teması.",
    category: "Kozmik",
    premium: true,
    animationType: "cosmic-star-portal",
    envelopeStyle: "none",
    sealStyle: "none",
    backgroundAnimation: "night",
    sealInsignia: "none"
  },
  {
    id: "luxury-book-page",
    name: "Lüks Düğün Kitabı Sayfası",
    description: "Klasik lacivert-altın kabartmalı anı kitabı kapağı gerçekçi bir şekilde sola doğru çevrilerek açılır.",
    category: "Sayfa",
    premium: true,
    animationType: "book-page-flip",
    envelopeStyle: "none",
    sealStyle: "none",
    backgroundAnimation: "bokeh",
    sealInsignia: "none"
  },
  {
    id: "plexiglass-acrylic-shimmer",
    name: "Akrilik Cam Yansıması",
    description: "Şeffaf modern cam tırnak plakası, üzerinde parıldayan ışık yansımalarıyla eriyerek yok olur.",
    category: "Modern",
    premium: false,
    animationType: "acrylic-shimmer",
    envelopeStyle: "transparent-glass",
    sealStyle: "silver",
    backgroundAnimation: "pearl",
    sealInsignia: "infinity"
  },
  {
    id: "silk-ribbon-untie",
    name: "İpek Kurdele Çözülmesi",
    description: "Fildişi zarfın üzerindeki saten ipek kurdele çözülerek uçar ve davetiye ortaya çıkar.",
    category: "Modern",
    premium: true,
    animationType: "satin-ribbon-unfold",
    envelopeStyle: "classic",
    sealStyle: "gold",
    backgroundAnimation: "golden",
    sealInsignia: "ring"
  },
  {
    id: "romantic-heart-envelope",
    name: "Aşk Düğümü Pembe Zarf",
    description: "Romantik pudra pembesi çiçekli zarf, çift kalp logolu kırmızı mühür ve gül yaprağı fırtınası.",
    category: "Zarf",
    premium: false,
    animationType: "romantic-wax-seal",
    envelopeStyle: "floral",
    sealStyle: "burgundy",
    backgroundAnimation: "petals",
    sealInsignia: "heart"
  },
  {
    id: "minimal-white-infinity",
    name: "Minimal Beyaz & Sonsuzluk",
    description: "Sade temiz beyaz zarf, gümüş renkli sonsuzluk damgalı mühür ve yumuşak ışık küreleri.",
    category: "Zarf",
    premium: false,
    animationType: "romantic-wax-seal",
    envelopeStyle: "minimal-white",
    sealStyle: "silver",
    backgroundAnimation: "pearl",
    sealInsignia: "infinity"
  }
];
