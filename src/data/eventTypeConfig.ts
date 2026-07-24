export interface EventTypeConfig {
  id: string;
  label: string;
  description: string;
  primarySubjectLabel: string;
  primarySubjectPlaceholder: string;
  secondarySubjectLabel?: string;
  secondarySubjectPlaceholder?: string;
  motherLabel?: string;
  fatherLabel?: string;
  hostLabels?: string;
  requiredFields: string[];
  optionalFields: string[];
  defaultTitle: string;
  defaultMessage: string;
  countdownLabel: string;
  rsvpQuestion: string;
  recommendedTemplates: string[];
  recommendedAnimations: string[];
  allowedModules: string[];
  metadataLabels: {
    heroTitle: string;
    parentsTitle?: string;
    datePrefix: string;
    venuePrefix: string;
  };
  previewPlaceholders: {
    primaryName: string;
    secondaryName?: string;
    title: string;
    parents?: string;
  };
}

export const eventTypeConfigs: Record<string, EventTypeConfig> = {
  wedding: {
    id: "wedding",
    label: "Düğün",
    description: "Klasik ve lüks düğün davetiyeleri",
    primarySubjectLabel: "Gelin Adı",
    primarySubjectPlaceholder: "Örn. Elif",
    secondarySubjectLabel: "Damat Adı",
    secondarySubjectPlaceholder: "Örn. Kerem",
    motherLabel: "Gelin Ailesi",
    fatherLabel: "Damat Ailesi",
    hostLabels: "Aileler",
    requiredFields: ["primary_subject_name", "secondary_subject_name", "wedding_date", "venue_name"],
    optionalFields: ["bride_parents", "groom_parents", "venue_address", "google_maps_url", "custom_message"],
    defaultTitle: "Düğün Davetiyesi",
    defaultMessage: "Bu mutlu günümüzde sizleri de aramızda görmekten onur duyarız.",
    countdownLabel: "DÜĞÜNE KALAN SÜRE",
    rsvpQuestion: "Düğünümüze katılabilecek misiniz?",
    recommendedTemplates: ["royal-gold", "split-screen-modern", "botanical-ceramic", "cinematic-film-poster"],
    recommendedAnimations: ["envelope", "royalParchment", "curtain", "cinematicFilm"],
    allowedModules: ["rsvp", "guestbook", "gallery", "timeline", "map", "countdown"],
    metadataLabels: {
      heroTitle: "Düğünümüze Davetlisiniz",
      parentsTitle: "AİLELERİMİZ",
      datePrefix: "Düğün Tarihi",
      venuePrefix: "Düğün Mekânı",
    },
    previewPlaceholders: {
      primaryName: "Elif",
      secondaryName: "Kerem",
      title: "EVLENİYORUZ",
      parents: "Yılmaz & Kaya Aileleri",
    },
  },

  engagement: {
    id: "engagement",
    label: "Nişan & Söz",
    description: "Nişan ve söz merasimleri için şık davetiye",
    primarySubjectLabel: "Gelin / Birinci Kişi",
    primarySubjectPlaceholder: "Örn. Zeynep",
    secondarySubjectLabel: "Damat / İkinci Kişi",
    secondarySubjectPlaceholder: "Örn. Burak",
    motherLabel: "Kız Tarafı Ailesi",
    fatherLabel: "Erkek Tarafı Ailesi",
    hostLabels: "Ailelerimiz",
    requiredFields: ["primary_subject_name", "secondary_subject_name", "wedding_date", "venue_name"],
    optionalFields: ["bride_parents", "groom_parents", "venue_address", "google_maps_url", "custom_message"],
    defaultTitle: "Nişan Davetiyesi",
    defaultMessage: "Evliliğe giden ilk adımımızda siz sevdiklerimizi yanımızda görmekten mutluluk duyarız.",
    countdownLabel: "NİŞANA KALAN SÜRE",
    rsvpQuestion: "Nişan törenimize katılabilecek misiniz?",
    recommendedTemplates: ["lavender-garden", "minimal-paper", "folded-seal", "emerald-elegance"],
    recommendedAnimations: ["envelope", "gardenGate", "glass"],
    allowedModules: ["rsvp", "guestbook", "gallery", "timeline", "map", "countdown"],
    metadataLabels: {
      heroTitle: "Nişanımıza Davetlisiniz",
      parentsTitle: "AİLELERİMİZ",
      datePrefix: "Tören Tarihi",
      venuePrefix: "Tören Mekânı",
    },
    previewPlaceholders: {
      primaryName: "Zeynep",
      secondaryName: "Burak",
      title: "NİŞANLANANLAR",
    },
  },

  henna: {
    id: "henna",
    label: "Kına Gecesi",
    description: "Geleneksel ve modern kına gecesi davetiyeleri",
    primarySubjectLabel: "Gelin Adayı / Kına Sahibi",
    primarySubjectPlaceholder: "Örn. Selin",
    secondarySubjectLabel: "Partner / Damat Adayı (İsteğe Bağlı)",
    secondarySubjectPlaceholder: "Örn. Mert",
    hostLabels: "Kına Sahibi",
    requiredFields: ["primary_subject_name", "wedding_date", "venue_name"],
    optionalFields: ["secondary_subject_name", "venue_address", "google_maps_url", "custom_message"],
    defaultTitle: "Kına Gecesi Davetiyesi",
    defaultMessage: "Kına gecemde meşk edip doyasıya eğlenmeye hepinizi bekliyorum!",
    countdownLabel: "KINA GECESİNE KALAN SÜRE",
    rsvpQuestion: "Kına gecemize katılabilecek misiniz?",
    recommendedTemplates: ["henna-velvet", "henna-tray", "oriental-lace", "velvet-curtain"],
    recommendedAnimations: ["hennaVelvetGate", "curtain", "envelope"],
    allowedModules: ["rsvp", "guestbook", "gallery", "map", "countdown"],
    metadataLabels: {
      heroTitle: "Kına Geceme Davetlisiniz",
      datePrefix: "Kına Tarihi",
      venuePrefix: "Kına Mekânı",
    },
    previewPlaceholders: {
      primaryName: "Selin",
      secondaryName: "Mert",
      title: "KINA GECESİ",
    },
  },

  circumcision: {
    id: "circumcision",
    label: "Sünnet Töreni",
    description: "Sünnet düğünü ve merasimleri için özel şablonlar",
    primarySubjectLabel: "Çocuğun Adı",
    primarySubjectPlaceholder: "Örn. Emir",
    motherLabel: "Anne Adı",
    fatherLabel: "Baba Adı",
    hostLabels: "Anne & Baba",
    requiredFields: ["primary_subject_name", "wedding_date", "venue_name"],
    optionalFields: ["mother_name", "father_or_partner_name", "venue_address", "google_maps_url", "custom_message"],
    defaultTitle: "Sünnet Düğünü Davetiyesi",
    defaultMessage: "Oğlumuzun erkekliğe ilk adım attığı bu özel günde sizleri aramızda görmekten kıvanç duyarız.",
    countdownLabel: "SÜNNET DÜĞÜNÜNE KALAN SÜRE",
    rsvpQuestion: "Sünnet törenimize katılabilecek misiniz?",
    recommendedTemplates: ["royal-circumcision", "prince-throne-room", "nazar-dome-layout"],
    recommendedAnimations: ["nazarDome", "royalParchment", "sealOnly"],
    allowedModules: ["rsvp", "guestbook", "gallery", "map", "countdown"],
    metadataLabels: {
      heroTitle: "Sünnet Düğünümüze Davetlisiniz",
      parentsTitle: "ANNE & BABA",
      datePrefix: "Tören Tarihi",
      venuePrefix: "Tören Mekânı",
    },
    previewPlaceholders: {
      primaryName: "Emir",
      title: "SÜNNET DÜĞÜNÜ",
      parents: "Ayşe & Ahmet Yılmaz",
    },
  },

  babyshower: {
    id: "babyshower",
    label: "Baby Shower",
    description: "Bebeği karşılama ve cinsiyet partileri",
    primarySubjectLabel: "Bebeğin Adı veya Kullanılacak Hitap",
    primarySubjectPlaceholder: "Örn. Defne, Baby Yılmaz veya Bebeğimiz",
    motherLabel: "Anne Adı",
    fatherLabel: "Baba / Eş Adı (İsteğe Bağlı)",
    hostLabels: "Ev Sahipleri",
    requiredFields: ["primary_subject_name", "wedding_date", "venue_name"],
    optionalFields: ["mother_name", "father_or_partner_name", "venue_address", "google_maps_url", "custom_message"],
    defaultTitle: "Bebeğimizi Birlikte Karşılayalım",
    defaultMessage: "Aramıza katılması heyecanla beklenen minik mucizemiz için düzenlediğimiz kutlamaya davetlisiniz!",
    countdownLabel: "BABY SHOWER'A KALAN SÜRE",
    rsvpQuestion: "Baby Shower kutlamamıza katılabilecek misiniz?",
    recommendedTemplates: ["kids-mavi-ayicik", "kids-pembe-prenses", "kids-safari-macera"],
    recommendedAnimations: ["cloudBalloon", "teddyBear", "sealOnly"],
    allowedModules: ["rsvp", "guestbook", "gallery", "map", "countdown"],
    metadataLabels: {
      heroTitle: "Baby Shower Kutlamamıza Davetlisiniz",
      parentsTitle: "ANNE & BABA",
      datePrefix: "Etkinlik Tarihi",
      venuePrefix: "Etkinlik Mekânı",
    },
    previewPlaceholders: {
      primaryName: "Defne",
      title: "BABY SHOWER",
      parents: "Anne: Merve Yılmaz",
    },
  },

  birthday: {
    id: "birthday",
    label: "Doğum Günü",
    description: "Yetişkin ve çocuk doğum günü kutlamaları",
    primarySubjectLabel: "Doğum Günü Sahibinin Adı",
    primarySubjectPlaceholder: "Örn. Arda",
    secondarySubjectLabel: "Yaşı (İsteğe Bağlı)",
    secondarySubjectPlaceholder: "Örn. 5 Yaşında",
    hostLabels: "Ev Sahibi / Ailesi",
    requiredFields: ["primary_subject_name", "wedding_date", "venue_name"],
    optionalFields: ["secondary_subject_name", "venue_address", "google_maps_url", "custom_message"],
    defaultTitle: "Doğum Günü Kutlaması",
    defaultMessage: "Yeni yaşımı sevdiklerimle birlikte kutlamak istiyorum. Sen de katıl ve neşemize neşe kat!",
    countdownLabel: "DOĞUM GÜNÜNE KALAN SÜRE",
    rsvpQuestion: "Doğum günü partimize katılabilecek misiniz?",
    recommendedTemplates: ["kids-safari-macera", "kids-uzay-astronot", "cocktail-menu"],
    recommendedAnimations: ["cloudBalloon", "teddyBear", "spotlight"],
    allowedModules: ["rsvp", "guestbook", "gallery", "map", "countdown"],
    metadataLabels: {
      heroTitle: "Doğum Günü Partime Davetlisiniz",
      datePrefix: "Parti Tarihi",
      venuePrefix: "Parti Mekânı",
    },
    previewPlaceholders: {
      primaryName: "Arda",
      secondaryName: "5. Yaş Partisi",
      title: "DOĞUM GÜNÜ KUTLAMASI",
    },
  },

  corporate: {
    id: "corporate",
    label: "Kurumsal Etkinlik & Lansman",
    description: "Şirket lansmanları, gala, konuşmacı ve kurumsal davetler",
    primarySubjectLabel: "Etkinlik Başlığı / Konusu",
    primarySubjectPlaceholder: "Örn. 2026 Yıl Sonu Gala & Lansman",
    secondarySubjectLabel: "Kurum / Şirket Adı",
    secondarySubjectPlaceholder: "Örn. Antigravity Teknoloji A.Ş.",
    hostLabels: "Düzenleyen Şirket / Kurum",
    requiredFields: ["primary_subject_name", "secondary_subject_name", "wedding_date", "venue_name"],
    optionalFields: ["venue_address", "google_maps_url", "custom_message"],
    defaultTitle: "Kurumsal Etkinlik Davetiyesi",
    defaultMessage: "Şirketimizin vizyon toplantısı ve gala gecesinde siz değerli ortaklarımızı aramızda görmekten memnuniyet duyarız.",
    countdownLabel: "ETKİNLİĞE KALAN SÜRE",
    rsvpQuestion: "Kurumsal etkinliğimize katılım sağlayacak mısınız?",
    recommendedTemplates: ["modern-architecture", "swiss-grid-ceremony", "fashion-editorial", "gala-night"],
    recommendedAnimations: ["cinematicFilm", "spotlight", "elevator"],
    allowedModules: ["rsvp", "guestbook", "timeline", "map", "countdown"],
    metadataLabels: {
      heroTitle: "Kurumsal Etkinliğimize Davetlisiniz",
      datePrefix: "Etkinlik Tarihi",
      venuePrefix: "Etkinlik Mekânı",
    },
    previewPlaceholders: {
      primaryName: "Yıllık Gala Gecesi",
      secondaryName: "Antigravity A.Ş.",
      title: "KURUMSAL ETKİNLİK",
    },
  },

  graduation: {
    id: "graduation",
    label: "Mezuniyet",
    description: "Okul, lise ve üniversite mezuniyet kutlamaları",
    primarySubjectLabel: "Mezun Adı",
    primarySubjectPlaceholder: "Örn. Canan Yılmaz",
    secondarySubjectLabel: "Okul / Üniversite & Bölüm",
    secondarySubjectPlaceholder: "Örn. İTÜ Bilgisayar Mühendisliği",
    hostLabels: "Mezun Ailesi / Organizasyon",
    requiredFields: ["primary_subject_name", "wedding_date", "venue_name"],
    optionalFields: ["secondary_subject_name", "venue_address", "google_maps_url", "custom_message"],
    defaultTitle: "Mezuniyet Kutlaması Davetiyesi",
    defaultMessage: "Zorlu egitim maratonunun ardından mezuniyet heyecanımı birlikte paylaşmak üzere davetlisiniz!",
    countdownLabel: "MEZUNİYETE KALAN SÜRE",
    rsvpQuestion: "Mezuniyet kutlamamıza katılabilecek misiniz?",
    recommendedTemplates: ["minimal-paper", "swiss-grid-ceremony", "modern-event"],
    recommendedAnimations: ["spotlight", "cinematicText", "minimalFade"],
    allowedModules: ["rsvp", "guestbook", "gallery", "map", "countdown"],
    metadataLabels: {
      heroTitle: "Mezuniyet Törenime Davetlisiniz",
      datePrefix: "Tören Tarihi",
      venuePrefix: "Tören Mekânı",
    },
    previewPlaceholders: {
      primaryName: "Canan Yılmaz",
      secondaryName: "İTÜ Bilgisayar Müh.",
      title: "MEZUNİYET KUTLAMASI",
    },
  },
};

export function getEventTypeConfig(eventType?: string): EventTypeConfig {
  const normalized = (eventType || "wedding").toLowerCase().trim();
  return eventTypeConfigs[normalized] || eventTypeConfigs.wedding;
}

/**
 * Returns primary subject display name based on event type and data object
 */
export function getPrimarySubjectName(wedding: any): string {
  if (!wedding) return "";
  const config = getEventTypeConfig(wedding.event_type);

  if (wedding.primary_subject_name) return wedding.primary_subject_name;

  if (config.id === "babyshower") {
    return wedding.baby_name || wedding.bride_name || "Bebeğimiz";
  }
  if (config.id === "circumcision") {
    return wedding.child_name || wedding.bride_name || "Oğlumuz";
  }
  if (config.id === "corporate") {
    return wedding.event_title || wedding.bride_name || "Kurumsal Etkinlik";
  }
  if (config.id === "birthday" || config.id === "graduation") {
    return wedding.bride_name || "";
  }
  if (config.id === "henna") {
    return wedding.bride_name || "";
  }

  // Default wedding & engagement fallback
  return wedding.bride_name || "";
}

/**
 * Returns secondary subject display name based on event type and data object
 */
export function getSecondarySubjectName(wedding: any): string {
  if (!wedding) return "";
  const config = getEventTypeConfig(wedding.event_type);

  if (wedding.secondary_subject_name) return wedding.secondary_subject_name;

  if (config.id === "babyshower" || config.id === "circumcision") {
    return wedding.mother_name || wedding.groom_name || "";
  }
  if (config.id === "corporate") {
    return wedding.company_name || wedding.groom_name || "";
  }
  if (config.id === "henna" || config.id === "birthday" || config.id === "graduation") {
    return wedding.groom_name || "";
  }

  return wedding.groom_name || "";
}
