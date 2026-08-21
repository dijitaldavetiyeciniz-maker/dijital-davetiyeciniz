export interface Question {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'yesno' | 'select' | 'date' | 'time' | 'location' | 'toggle';
  priority: 'required' | 'recommended' | 'optional';
  options?: string[];
  placeholder?: string;
  helperText?: string;
  suggestion?: string; // Auto-filling note or value suggestion
  visibleWhen?: {
    fieldId: string;
    value: any;
  };
}

export interface QuestionGroup {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

export interface EventJourneyConfig {
  id: string;
  label: string;
  description: string;
  subjectLabels: {
    primaryName: string;
    secondaryName?: string;
    primaryParents?: string;
    secondaryParents?: string;
    eventDate: string;
    eventTime: string;
    venueName: string;
    venueAddress: string;
  };
  questionGroups: QuestionGroup[];
  templateStyleSuggestions: string[];
  recommendedSpecialContents: string[];
  programPresets: string[];
  noteSuggestions: string[];
  helperCopy?: string;
  validationMessages?: Record<string, string>;
}

export const eventJourneyConfigs: Record<string, EventJourneyConfig> = {
  wedding: {
    id: "wedding",
    label: "Düğün",
    description: "Klasik ve lüks düğün davetiyeleri",
    subjectLabels: {
      primaryName: "Gelin Adı",
      secondaryName: "Damat Adı",
      primaryParents: "Gelin Ailesi (Anne & Baba)",
      secondaryParents: "Damat Ailesi (Anne & Baba)",
      eventDate: "Düğün Tarihi",
      eventTime: "Düğün Saati",
      venueName: "Mekân Adı",
      venueAddress: "Mekân Adresi",
    },
    questionGroups: [
      {
        id: "couple_info",
        title: "Çift Bilgileri",
        description: "Gelin ve damat bilgilerini girin",
        questions: [
          { id: "bride_name", label: "Gelin Adı", type: "text", priority: "required", placeholder: "Örn. Elif" },
          { id: "groom_name", label: "Damat Adı", type: "text", priority: "required", placeholder: "Örn. Kerem" },
          { id: "bride_parents", label: "Gelin Ailesi", type: "text", priority: "optional", placeholder: "Örn. Ayşe & Mehmet Kaya" },
          { id: "groom_parents", label: "Damat Ailesi", type: "text", priority: "optional", placeholder: "Örn. Fatma & Ali Yılmaz" },
        ]
      },
      {
        id: "event_details",
        title: "Tören Detayları",
        description: "Düğün töreninin yeri ve zamanı",
        questions: [
          { id: "wedding_date", label: "Düğün Tarihi ve Saati", type: "date", priority: "required" },
          { id: "venue_name", label: "Mekân Adı", type: "text", priority: "required", placeholder: "Örn. Swissôtel The Bosphorus" },
          { id: "venue_address", label: "Açık Adres", type: "textarea", priority: "recommended", placeholder: "Örn. Vişnezade Mah. Acısu Sok. No:19, Beşiktaş/İstanbul" },
          { id: "google_maps_url", label: "Google Haritalar Linki (Konum)", type: "location", priority: "recommended", placeholder: "https://goo.gl/maps/..." },
        ]
      },
      {
        id: "sub_events",
        title: "Ek Etkinlikler",
        description: "Törenden ayrı diğer etkinlik planları",
        questions: [
          { id: "has_nikah", label: "Ayrı bir nikah töreni olacak mı?", type: "yesno", priority: "optional" },
          { id: "has_after_party", label: "After Party yapılacak mı?", type: "yesno", priority: "optional" },
          { id: "has_henna_link", label: "Kına gecesi de davetiyede görünsün mü?", type: "yesno", priority: "optional" }
        ]
      }
    ],
    templateStyleSuggestions: ["classic", "luxury", "romantic", "editorial"],
    recommendedSpecialContents: ["program", "music", "location", "iban"],
    programPresets: ["Karşılama", "Nikah Töreni", "Fotoğraf Çekimi", "Yemek İkramı", "İlk Dans", "Pasta Kesimi", "Eğlence", "After Party"],
    noteSuggestions: [
      "Mutluluğumuzu paylaşmaya tüm sevdiklerimizi bekleriz.",
      "Bu özel günümüzde yanımızda olmanız bize onur verecektir."
    ]
  },

  engagement: {
    id: "engagement",
    label: "Nişan & Söz",
    description: "Söz ve nişan töreni davetiyeleri",
    subjectLabels: {
      primaryName: "Gelin / Birinci Kişi",
      secondaryName: "Damat / İkinci Kişi",
      primaryParents: "Kız Tarafı Ailesi",
      secondaryParents: "Erkek Tarafı Ailesi",
      eventDate: "Tören Tarihi",
      eventTime: "Tören Saati",
      venueName: "Mekân Adı",
      venueAddress: "Mekân Adresi",
    },
    questionGroups: [
      {
        id: "couple_info",
        title: "Nişanlanan Çift",
        questions: [
          { id: "bride_name", label: "Gelin / Birinci Kişi", type: "text", priority: "required", placeholder: "Örn. Zeynep" },
          { id: "groom_name", label: "Damat / İkinci Kişi", type: "text", priority: "required", placeholder: "Örn. Burak" },
          { id: "bride_parents", label: "Kız Tarafı Ailesi", type: "text", priority: "optional", placeholder: "Örn. Merve & Ahmet Şahin" },
          { id: "groom_parents", label: "Erkek Tarafı Ailesi", type: "text", priority: "optional", placeholder: "Örn. Zeliha & Hasan Demir" }
        ]
      },
      {
        id: "event_details",
        title: "Tören Bilgileri",
        questions: [
          { id: "wedding_date", label: "Nişan Tarihi ve Saati", type: "date", priority: "required" },
          { id: "venue_name", label: "Mekân Adı", type: "text", priority: "required", placeholder: "Örn. Sunset Restaurant" },
          { id: "venue_address", label: "Açık Adres", type: "textarea", priority: "recommended", placeholder: "Örn. Ulus Parkı, Kuruçeşme/İstanbul" },
          { id: "google_maps_url", label: "Google Haritalar Konumu", type: "location", priority: "recommended" }
        ]
      },
      {
        id: "customization",
        title: "Tören Akışı",
        questions: [
          { id: "has_rings", label: "Yüzük töreni saati belirtmek ister misiniz?", type: "yesno", priority: "optional" }
        ]
      }
    ],
    templateStyleSuggestions: ["romantic", "elegant", "floral", "minimal"],
    recommendedSpecialContents: ["music", "location", "iban"],
    programPresets: ["Misafir Karşılama", "Yüzük Seremonisi", "İkram & Kokteyl", "Fotoğraf Çekimi", "Müzik & Eğlence"],
    noteSuggestions: [
      "Evliliğe giden ilk adımımızda siz sevdiklerimizi yanımızda görmekten mutluluk duyarız."
    ]
  },

  henna: {
    id: "henna",
    label: "Kına Gecesi",
    description: "Geleneksel ve modern kına geceleri",
    subjectLabels: {
      primaryName: "Gelin Adayı",
      secondaryName: "Damat Adayı (İsteğe Bağlı)",
      eventDate: "Kına Tarihi",
      eventTime: "Kına Saati",
      venueName: "Kına Salonu",
      venueAddress: "Salon Adresi",
    },
    questionGroups: [
      {
        id: "henna_host",
        title: "Kına Bilgileri",
        questions: [
          { id: "bride_name", label: "Gelin Adayı", type: "text", priority: "required", placeholder: "Örn. Selin" },
          { id: "groom_name", label: "Damat Adayı (İsteğe Bağlı)", type: "text", priority: "optional", placeholder: "Örn. Mert" },
        ]
      },
      {
        id: "event_details",
        title: "Tarih & Mekân",
        questions: [
          { id: "wedding_date", label: "Kına Tarihi ve Saati", type: "date", priority: "required" },
          { id: "venue_name", label: "Kına Salonu", type: "text", priority: "required", placeholder: "Örn. Çırağan Sarayı Kına Salonu" },
          { id: "venue_address", label: "Açık Adres", type: "textarea", priority: "recommended" },
          { id: "google_maps_url", label: "Konum Linki", type: "location", priority: "recommended" }
        ]
      },
      {
        id: "restrictions",
        title: "Kına Konsepti & Notlar",
        questions: [
          { id: "is_women_only", label: "Kına gecesi yalnızca kadınlara mı özel?", type: "yesno", priority: "recommended", suggestion: "Kına gecemiz kadınlara özeldir." },
          {
            id: "henna_note",
            label: "Kına gecesi özel davet notu",
            type: "textarea",
            priority: "recommended",
            placeholder: "Kına gecemiz kadınlara özeldir.",
            visibleWhen: { fieldId: "is_women_only", value: "yes" }
          },
          { id: "dress_code", label: "Kına konsepti kıyafet kodu var mı?", type: "text", priority: "optional", placeholder: "Örn. Kırmızı & Altın Sarı Konsept" }
        ]
      }
    ],
    templateStyleSuggestions: ["cultural", "traditional", "henna", "luxury"],
    recommendedSpecialContents: ["program", "music", "location"],
    programPresets: ["Misafir Karşılama", "Gelin Girişi", "Kına Seremonisi", "İkramlar", "Dans & Eğlence"],
    noteSuggestions: [
      "Kına gecemiz kadınlara özeldir.",
      "Bu özel gecede yalnızca kadın misafirlerimizi aramızda görmekten mutluluk duyarız.",
      "Kına gecemde meşk edip doyasıya eğlenmeye hepinizi bekliyorum!"
    ]
  },

  circumcision: {
    id: "circumcision",
    label: "Sünnet Töreni",
    description: "Sünnet düğünü ve mevlidi davetiyeleri",
    subjectLabels: {
      primaryName: "Çocuğun Adı",
      primaryParents: "Anne & Baba İsimleri",
      eventDate: "Sünnet Tarihi",
      eventTime: "Sünnet Saati",
      venueName: "Tören Mekânı",
      venueAddress: "Tören Adresi",
    },
    questionGroups: [
      {
        id: "child_info",
        title: "Sünnet Sahibi",
        questions: [
          { id: "bride_name", label: "Çocuğun Adı", type: "text", priority: "required", placeholder: "Örn. Emir" },
          { id: "bride_parents", label: "Anne & Baba İsimleri", type: "text", priority: "recommended", placeholder: "Örn. Ayşe & Ahmet Yılmaz" }
        ]
      },
      {
        id: "event_details",
        title: "Tören Bilgileri",
        questions: [
          { id: "wedding_date", label: "Tören Tarihi ve Saati", type: "date", priority: "required" },
          { id: "venue_name", label: "Tören Mekânı", type: "text", priority: "required", placeholder: "Örn. Grand Otel Salonu" },
          { id: "venue_address", label: "Açık Adres", type: "textarea", priority: "recommended" },
          { id: "google_maps_url", label: "Konum Linki", type: "location", priority: "recommended" }
        ]
      },
      {
        id: "customization",
        title: "Merasim Türü",
        questions: [
          { id: "has_mevlit", label: "Yemekli mevlit veya konvoy akışı olacak mı?", type: "yesno", priority: "optional" }
        ]
      }
    ],
    templateStyleSuggestions: ["traditional", "royal", "playful", "modern"],
    recommendedSpecialContents: ["program", "location", "iban"],
    programPresets: ["Sünnet Konvoyu", "Mevlit Okutulması", "Yemek İkramı", "Sünnet Tahtı Seremonisi", "Eğlence"],
    noteSuggestions: [
      "Oğlumuzun erkekliğe ilk adım attığı bu özel günde sizleri aramızda görmekten kıvanç duyarız."
    ]
  },

  babyshower: {
    id: "babyshower",
    label: "Baby Shower",
    description: "Cinsiyet partisi ve bebek partileri",
    subjectLabels: {
      primaryName: "Bebeğin Adı / Hitap",
      primaryParents: "Ev Sahibi / Anne Adı",
      eventDate: "Parti Tarihi",
      eventTime: "Parti Saati",
      venueName: "Mekân Adı",
      venueAddress: "Mekân Adresi",
    },
    questionGroups: [
      {
        id: "baby_info",
        title: "Bebek & Anne",
        questions: [
          { id: "bride_name", label: "Bebeğin Adı / Hitap", type: "text", priority: "required", placeholder: "Örn. Defne veya Bebeğimiz" },
          { id: "bride_parents", label: "Anne Adı", type: "text", priority: "required", placeholder: "Örn. Merve Kaya" },
          { id: "groom_parents", label: "Baba Adı (Opsiyonel)", type: "text", priority: "optional", placeholder: "Örn. Caner Kaya" }
        ]
      },
      {
        id: "event_details",
        title: "Etkinlik Detayları",
        questions: [
          { id: "wedding_date", label: "Parti Tarihi ve Saati", type: "date", priority: "required" },
          { id: "venue_name", label: "Mekân Adı", type: "text", priority: "required", placeholder: "Örn. Merve'nin Evi veya Joy Garden" },
          { id: "venue_address", label: "Açık Adres", type: "textarea", priority: "recommended" },
          { id: "google_maps_url", label: "Harita Linki", type: "location", priority: "recommended" }
        ]
      },
      {
        id: "party_theme",
        title: "Parti Konsepti",
        questions: [
          { id: "has_kids_welcome", label: "Çocuk misafir katılımı uygun mu?", type: "yesno", priority: "optional" },
          { id: "gift_note_type", label: "Hediye kaydı notu eklemek ister misiniz?", type: "yesno", priority: "optional" }
        ]
      }
    ],
    templateStyleSuggestions: ["soft", "pastel", "playful", "botanical"],
    recommendedSpecialContents: ["music", "location"],
    programPresets: ["Misafir Karşılama", "Bebek Oyunları & Aktivite", "Cinsiyet Açıklama", "Pasta Kesimi", "Hediye Açılışı", "Fotoğraf Çekimi"],
    noteSuggestions: [
      "Aramıza katılacak minik mucizemizi sevdiklerimizle karşılamak için sabırsızlanıyoruz.",
      "Hediye yerine güzel dileklerinizi bekliyoruz.",
      "Etkinliğimiz yetişkinlere özel planlanmıştır."
    ]
  },

  birthday: {
    id: "birthday",
    label: "Doğum Günü",
    description: "Çocuk veya yetişkin doğum günleri",
    subjectLabels: {
      primaryName: "Doğum Günü Sahibi",
      secondaryName: "Yeni Yaşı",
      eventDate: "Kutlama Tarihi",
      eventTime: "Kutlama Saati",
      venueName: "Mekân Adı",
      venueAddress: "Mekân Adresi",
    },
    questionGroups: [
      {
        id: "birthday_person",
        title: "Doğum Günü Sahibi",
        questions: [
          { id: "bride_name", label: "Doğum Günü Sahibi Adı", type: "text", priority: "required", placeholder: "Örn. Arda" },
          { id: "groom_name", label: "Yeni Yaşı (Opsiyonel)", type: "text", priority: "optional", placeholder: "Örn. 5 veya 30" },
          { id: "is_kids_birthday", label: "Çocuk doğum günü partisi mi?", type: "yesno", priority: "recommended" }
        ]
      },
      {
        id: "event_details",
        title: "Kutlama Detayları",
        questions: [
          { id: "wedding_date", label: "Kutlama Tarihi ve Saati", type: "date", priority: "required" },
          { id: "venue_name", label: "Kutlama Mekânı", type: "text", priority: "required", placeholder: "Örn. Happy Kids Oyun Alanı" },
          { id: "venue_address", label: "Açık Adres", type: "textarea", priority: "recommended" },
          { id: "google_maps_url", label: "Konum Linki", type: "location", priority: "recommended" }
        ]
      },
      {
        id: "theme_info",
        title: "Konsept & Tema",
        questions: [
          { id: "birthday_theme", label: "Parti Konsepti / Teması var mı?", type: "text", priority: "optional", placeholder: "Örn. Safari, Uzay veya Maskeli Balo" }
        ]
      }
    ],
    templateStyleSuggestions: ["playful", "modern", "minimal", "cocktail"],
    recommendedSpecialContents: ["program", "music", "location"],
    programPresets: ["Misafir Karşılama", "Oyunlar & Eğlence", "Pasta Üfleme Seremonisi", "İkram Servisi", "Fotoğraf & Vedalaşma"],
    noteSuggestions: [
      "Yeni yaşımı sevdiklerimle birlikte kutlamak istiyorum. Sen de katıl ve neşemize neşe kat!",
      "Minik misafirlerimizin konsept kıyafetlerle katılmasını rica ederiz."
    ]
  },

  corporate: {
    id: "corporate",
    label: "Kurumsal Etkinlik",
    description: "Şirket lansmanı, seminer ve gala geceleri",
    subjectLabels: {
      primaryName: "Etkinlik Adı",
      secondaryName: "Kurum / Şirket",
      eventDate: "Etkinlik Tarihi",
      eventTime: "Etkinlik Saati",
      venueName: "Etkinlik Mekânı",
      venueAddress: "Mekân Adresi",
    },
    questionGroups: [
      {
        id: "org_info",
        title: "Etkinlik Sahibi",
        questions: [
          { id: "bride_name", label: "Etkinlik Adı / Başlığı", type: "text", priority: "required", placeholder: "Örn. 2026 Teknoloji Zirvesi" },
          { id: "groom_name", label: "Düzenleyen Şirket / Kurum", type: "text", priority: "required", placeholder: "Örn. Antigravity Teknoloji" },
        ]
      },
      {
        id: "event_details",
        title: "Zaman & Mekân",
        questions: [
          { id: "wedding_date", label: "Etkinlik Tarihi ve Saati", type: "date", priority: "required" },
          { id: "venue_name", label: "Mekân Adı", type: "text", priority: "required", placeholder: "Örn. Wyndham Grand Levent" },
          { id: "venue_address", label: "Açık Adres", type: "textarea", priority: "recommended" },
          { id: "google_maps_url", label: "Konum Linki", type: "location", priority: "recommended" }
        ]
      },
      {
        id: "registration",
        title: "Kayıt & Katılım",
        questions: [
          { id: "is_registration_required", label: "Katılım için kayıt zorunlu mu?", type: "yesno", priority: "recommended", suggestion: "Katılım için ön kayıt gereklidir." },
          { id: "has_dress_code", label: "Kıyafet Kodu (Dress Code) var mı?", type: "text", priority: "optional", placeholder: "Örn. Business Formal / Black Tie" }
        ]
      }
    ],
    templateStyleSuggestions: ["corporate", "minimal", "modern", "tech"],
    recommendedSpecialContents: ["program", "location"],
    programPresets: ["Kayıt & Karşılama", "Açılış Konuşması", "Ana Sunumlar", "Panel Töreni", "Networking & Kokteyl", "Kapanış"],
    noteSuggestions: [
      "Katılım için ön kayıt gereklidir.",
      "Şirketimizin bu özel buluşmasında sizleri de aramızda görmekten memnuniyet duyarız."
    ]
  },

  graduation: {
    id: "graduation",
    label: "Mezuniyet",
    description: "Okul ve fakülte mezuniyet törenleri",
    subjectLabels: {
      primaryName: "Mezun / Grup Adı",
      secondaryName: "Okul / Bölüm",
      eventDate: "Tören Tarihi",
      eventTime: "Tören Saati",
      venueName: "Tören Mekânı",
      venueAddress: "Mekân Adresi",
    },
    questionGroups: [
      {
        id: "grad_info",
        title: "Mezuniyet Detayı",
        questions: [
          { id: "bride_name", label: "Mezun Adı / Sınıf Adı", type: "text", priority: "required", placeholder: "Örn. Canan Yılmaz veya İTÜ 2026 Mezunları" },
          { id: "groom_name", label: "Okul & Bölüm Adı", type: "text", priority: "required", placeholder: "Örn. İTÜ Bilgisayar Mühendisliği" }
        ]
      },
      {
        id: "event_details",
        title: "Tören & Kutlama",
        questions: [
          { id: "wedding_date", label: "Tören Tarihi ve Saati", type: "date", priority: "required" },
          { id: "venue_name", label: "Mekân Adı", type: "text", priority: "required", placeholder: "Örn. İTÜ Ayazağa Yerleşkesi" },
          { id: "venue_address", label: "Açık Adres", type: "textarea", priority: "recommended" },
          { id: "google_maps_url", label: "Konum Linki", type: "location", priority: "recommended" }
        ]
      },
      {
        id: "ceremony_details",
        title: "Kutlama & Kıyafet",
        questions: [
          { id: "has_after_ceremony", label: "Kep töreninden sonra mezuniyet balosu var mı?", type: "yesno", priority: "optional" }
        ]
      }
    ],
    templateStyleSuggestions: ["editorial", "classic", "modern", "celebratory"],
    recommendedSpecialContents: ["program", "location"],
    programPresets: ["Misafir Karşılama", "Kep ve Cübbe Dağıtımı", "Mezuniyet Resmi Töreni", "Kep Fırlatma", "Mezuniyet Kokteyli & Balosu"],
    noteSuggestions: [
      "Zorlu eğitim maratonunun ardından bu mutlu anımızı paylaşmak üzere tüm sevdiklerimizi bekleriz."
    ]
  },

  special: {
    id: "special",
    label: "Özel Etkinlik",
    description: "Diğer her türlü kutlama, yemek ve davet",
    subjectLabels: {
      primaryName: "Etkinlik Adı",
      secondaryName: "Ev Sahibi / Konu",
      eventDate: "Etkinlik Tarihi",
      eventTime: "Etkinlik Saati",
      venueName: "Etkinlik Mekânı",
      venueAddress: "Mekân Adresi",
    },
    questionGroups: [
      {
        id: "special_info",
        title: "Etkinlik Tanımı",
        questions: [
          { id: "bride_name", label: "Etkinlik Adı / Başlığı", type: "text", priority: "required", placeholder: "Örn. Altın Yıl Dönümü Yemeği" },
          { id: "groom_name", label: "Kimin İçin / Konusu (Opsiyonel)", type: "text", priority: "optional", placeholder: "Örn. Nalan & Ahmet" }
        ]
      },
      {
        id: "event_details",
        title: "Tarih & Mekân",
        questions: [
          { id: "wedding_date", label: "Etkinlik Tarihi ve Saati", type: "date", priority: "required" },
          { id: "venue_name", label: "Mekân Adı", type: "text", priority: "required", placeholder: "Örn. Bosphorus Palace Restaurant" },
          { id: "venue_address", label: "Açık Adres", type: "textarea", priority: "recommended" },
          { id: "google_maps_url", label: "Konum Harita Linki", type: "location", priority: "recommended" }
        ]
      },
      {
        id: "restrictions",
        title: "Önemli Notlar & Yaş",
        questions: [
          { id: "has_age_limit", label: "Etkinlikte yaş sınırı var mı?", type: "yesno", priority: "optional" },
          { id: "is_exclusive_group", label: "Katılımcı grubuna özel ek not eklemek ister misiniz?", type: "yesno", priority: "optional" }
        ]
      }
    ],
    templateStyleSuggestions: ["minimal", "modern", "editorial", "classic"],
    recommendedSpecialContents: ["music", "location"],
    programPresets: ["Karşılama & Kokteyl", "Etkinlik Başlangıcı", "Yemek & Sunumlar", "Kutlama & Canlı Müzik", "Kapanış"],
    noteSuggestions: [
      "Bu özel davetimizde sizleri aramızda görmekten mutluluk duyarız.",
      "Etkinliğimiz yalnızca davetlilere özeldir."
    ]
  }
};

export function getEventJourneyConfig(eventType?: string): EventJourneyConfig {
  const normalized = (eventType || "wedding").toLowerCase().trim();
  // Map typical Turkish inputs to match db values
  const typeMap: Record<string, string> = {
    "düğün": "wedding",
    "nişan": "engagement",
    "nişan & söz": "engagement",
    "kına": "henna",
    "kına gecesi": "henna",
    "sünnet": "circumcision",
    "sünnet töreni": "circumcision",
    "sünnet düğünü": "circumcision",
    "baby shower": "babyshower",
    "doğum günü": "birthday",
    "kurumsal": "corporate",
    "kurumsal etkinlik": "corporate",
    "mezuniyet": "graduation",
    "özel etkinlik": "special",
    "özel davet": "special"
  };
  const resolvedKey = typeMap[normalized] || normalized;
  return eventJourneyConfigs[resolvedKey] || eventJourneyConfigs.wedding;
}
