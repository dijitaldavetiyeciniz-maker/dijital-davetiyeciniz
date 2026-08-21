'use client';
import { useState, useEffect, use, useMemo, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { getSmartAutoMatch } from '@/lib/autoMatch';
import { mapEnumToDbEventType } from '@/lib/themes';
import { getEventTypeConfig } from '@/data/eventTypeConfig';
import PremiumTemplateRenderer from '@/components/templates/PremiumTemplateRenderer';
import WeddingClientWrapper from '@/components/invitation/WeddingClientWrapper';
import { Heart, Upload, Link as LinkIcon, Download, Smartphone, Share2, Sparkles, MapPin, Search, Grid, Eye, CheckCircle2, Navigation, Wand2, Calendar, Clock, Lock, ShieldAlert, Monitor, Type, Palette, ArrowRight, Save, Shield, Settings, Info, Music, StopCircle, RefreshCw, X, Users, MessageSquare, Paintbrush, CreditCard, Copy, ExternalLink, Tablet, Trash2, Check, Volume2, VolumeX, QrCode } from 'lucide-react';
import SafeImage from '@/components/ui/SafeImage';
import { getRandomQuote } from '@/lib/aiQuotes';
import { entranceAnimationTypes, entranceAnimationStyles } from '@/data/openingAnimations';
import { envelopeStyles } from '@/data/envelopeStyles';
import { sealStyles } from '@/data/sealStyles';
import { getInitials } from '@/utils/getInitials';
import EventsTab from '@/components/admin/events/EventsTab';
import EventsTimeline from '@/components/invitation/EventsTimeline';
import { getEventJourneyConfig } from '@/data/eventJourneyConfig';
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dijital-davetiyeciniz.vercel.app';

function getTemplatePreset(id: string) {
  const num = parseInt(id.replace('template', '')) || 1;
  const base = {
    template_id: id,
    background_image_url: null,
  };
  
  if (num <= 10) {
    // 1. Royal Gold (Altın Saray)
    return {
      ...base,
      primary_color: '#dfc384',
      text_color: '#064e3b',
      font_family: 'Cormorant Garamond',
      envelope_bg_color: 'marble-white',
      use_envelope: true,
      envelope_color: '#064e3b',
      envelope_flap_type: 'rounded',
      seal_type: 'crown',
      seal_color: '#dfc384',
      entrance_type: 'gate',
      effect_type: 'sparkles'
    };
  } else if (num <= 20) {
    // 2. Watercolor Floral (Suluboya Bahçe)
    return {
      ...base,
      primary_color: '#be123c',
      text_color: '#334155',
      font_family: 'Great Vibes',
      envelope_bg_color: 'solid-blush',
      use_envelope: true,
      envelope_color: '#ffe4e6',
      envelope_flap_type: 'rounded',
      seal_type: 'rose',
      seal_color: '#be123c',
      entrance_type: 'envelope',
      effect_type: 'hearts'
    };
  } else if (num <= 30) {
    // 3. Minimalist Modern (Sade & Modern)
    return {
      ...base,
      primary_color: '#0f172a',
      text_color: '#1e293b',
      font_family: 'Outfit',
      envelope_bg_color: 'solid-ivory',
      use_envelope: true,
      envelope_color: '#ffffff',
      envelope_flap_type: 'square',
      seal_type: 'monogram',
      seal_color: '#0f172a',
      entrance_type: 'card',
      effect_type: ''
    };
  } else if (num <= 40) {
    // 4. Galactic Neon (Karanlık & Neon)
    return {
      ...base,
      primary_color: '#a855f7',
      text_color: '#f8fafc',
      font_family: 'Montserrat',
      envelope_bg_color: 'solid-midnight',
      use_envelope: true,
      envelope_color: '#0f172a',
      envelope_flap_type: 'triangle',
      seal_type: 'sparkles',
      seal_color: '#a855f7',
      entrance_type: 'heart-fade',
      effect_type: 'sparkles'
    };
  } else if (num <= 50) {
    // 5. Vintage Retro (Vintage Nostaljik)
    return {
      ...base,
      primary_color: '#b45309',
      text_color: '#451a03',
      font_family: 'Playfair Display',
      envelope_bg_color: 'paper-kraft',
      use_envelope: true,
      envelope_color: '#fef3c7',
      envelope_flap_type: 'triangle',
      seal_type: 'leaf',
      seal_color: '#b45309',
      entrance_type: 'ribbon',
      effect_type: 'bubbles'
    };
  } else if (num <= 60) {
    // 6. Art Deco (Sanatsal Geometri)
    return {
      ...base,
      primary_color: '#dfc384',
      text_color: '#1e3a8a',
      font_family: 'Cinzel',
      envelope_bg_color: 'marble-black',
      use_envelope: true,
      envelope_color: '#1e3a8a',
      envelope_flap_type: 'square',
      seal_type: 'crown',
      seal_color: '#dfc384',
      entrance_type: 'box',
      effect_type: 'sparkles'
    };
  } else if (num <= 70) {
    // 7. Gilded Marble (Altın Damarlı Mermer)
    return {
      ...base,
      primary_color: '#dfc384',
      text_color: '#111827',
      font_family: 'Cormorant Garamond',
      envelope_bg_color: 'marble-white',
      use_envelope: true,
      envelope_color: '#111827',
      envelope_flap_type: 'rounded',
      seal_type: 'crown',
      seal_color: '#dfc384',
      entrance_type: 'curtain',
      effect_type: 'sparkles'
    };
  } else if (num <= 80) {
    // 8. Botanical Line Art (Minimalist Botanik)
    return {
      ...base,
      primary_color: '#15803d',
      text_color: '#1e293b',
      font_family: 'Playfair Display',
      envelope_bg_color: 'solid-sage',
      use_envelope: true,
      envelope_color: '#e2e8f0',
      envelope_flap_type: 'square',
      seal_type: 'leaf',
      seal_color: '#15803d',
      entrance_type: 'gate',
      effect_type: 'leaves'
    };
  } else if (num <= 90) {
    // 9. Velvet Night (Mat Siyah Zümrüt)
    return {
      ...base,
      primary_color: '#dfc384',
      text_color: '#ffffff',
      font_family: 'Cinzel',
      envelope_bg_color: 'marble-black',
      use_envelope: true,
      envelope_color: '#111111',
      envelope_flap_type: 'triangle',
      seal_type: 'monogram',
      seal_color: '#dfc384',
      entrance_type: 'wax-press',
      effect_type: 'sparkles'
    };
  } else {
    // 10. Boho Sunset (Bohem Günbatımı)
    return {
      ...base,
      primary_color: '#c2410c',
      text_color: '#4a2f22',
      font_family: 'Playfair Display',
      envelope_bg_color: 'paper-kraft',
      use_envelope: true,
      envelope_color: '#ffedd5',
      envelope_flap_type: 'rounded',
      seal_type: 'heart',
      seal_color: '#c2410c',
      entrance_type: 'ribbon',
      effect_type: 'leaves'
    };
  }
}

const templateNames = [
  "Altın Saray", "Neon Gece", "Organik Keten", "Kraliyet Aynası", "Sessiz Şıklık",
  "Suluboya Bahçe", "Retro Polaroid", "Gatsby Işıltısı", "Geometrik Aşk", "Mühürlü Mektup",
  "Zümrüt Şiiri", "Gül Yaprağı", "Toskana Esintisi", "Deniz Masalı", "Safir Büyüsü",
  "Lavanta Bahçesi", "Fildişi Zarafet", "Kraft Defter", "Kuzey Işıkları", "Çöl Sıcağı",
  "Kardelen Beyazı", "Dantel Düşü", "Modern Kübist", "Ege Rüzgarı", "Işıltılı Gece",
  "Eskimiş Parşömen", "Asil Kadife", "Temiz Levha", "Bahçe Kemeri", "Platin Lüks",
  "İnci Tanesi", "Sonsuz Aşk", "Zeytin Dalı", "Güz Yaprakları", "Gizemli Orman",
  "Yakamoz Işıltısı", "Monogram Şıklık", "Daktilo Şiiri", "Cam Fanus", "Altın Çerçeve",
  "Rustik Kütük", "Gül Suyu", "Retro Disk", "Yıldız Tozu", "Monokrom Çizgi",
  "Eski Mektup", "Lüks Mermer", "Kır Düğünü", "Minimal Çizgi", "Asil Bordo",
  "Papatya Demeti", "Bahar Dalı", "Gold Varak", "Monako Sarayı", "Retro Vintage",
  "Bohem Düş", "Sonsuz Düğüm", "Gece Mavisi", "Cam Efekti", "Zümrüt Yeşili",
  "Gilded Marble", "Altın Damar", "Mermer Dokusu", "Altın Yaprak", "Lüks Mermer Saray",
  "Asimetrik Varak", "Beyaz Altın Mermer", "Siyah Premium Mermer", "Zümrüt Mermer", "Rose Gold Mermer",
  "Botanical Line Art", "Minimalist Botanik", "Zarif Yaprak", "Altın Yaprak Çizgisi", "Siyah Yaprak Sanatı",
  "Krem Dokulu Kağıt", "Asil Minimalist", "Modern Botanik", "Sade Dal", "Bohem Yapraklar",
  "Velvet Night", "Premium Mat Siyah", "Koyu Zümrüt Kadife", "Siyah Kadife", "Gece Parıltısı",
  "White Gold Monogram", "Asil Monogram", "Derin Zümrüt", "Mat Bordo Kadife", "Kraliyet Kadifesi",
  "Boho Pampas & Sunset", "Bohem Günbatımı", "Kurutulmuş Pampas", "Terracotta Sulu Boya", "Modern Kır Havası",
  "Doğal Kraft Düşü", "Palmiye Rüzgarı", "Sıcak Terracotta", "Pampas Esintisi", "Günbatımı Renkleri"
];

const categoryMap: Record<string, number[]> = {
  wedding: [1, 4, 10, 11, 13, 17, 21, 22, 26, 29, 30, 32, 35, 39, 46, 48, 51, 52, 53, 54, 57, 61, 62, 63, 64, 65, 71, 72, 73, 77, 81, 82, 85, 91, 92, 95],
  engagement: [5, 9, 12, 14, 24, 32, 34, 40, 47, 55, 56, 58, 66, 67, 74, 75, 83, 84, 86, 93, 94],
  henna: [12, 27, 42, 50, 58, 59, 60, 68, 69, 87, 88, 89],
  babyshower: [6, 16, 31, 42, 44, 56, 70, 78, 90, 96, 97],
  birthday: [2, 7, 18, 25, 36, 41, 43, 44, 49, 56, 57, 79, 80, 90, 98, 99],
  corporate: [2, 8, 15, 19, 23, 28, 37, 43, 45, 54, 60, 77, 80, 81, 82, 85],
  minimal: [3, 5, 7, 9, 17, 19, 20, 21, 22, 23, 24, 28, 31, 33, 37, 38, 39, 45, 49, 55, 63, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 86],
  luxury: [1, 4, 8, 11, 15, 25, 27, 30, 36, 40, 47, 50, 51, 52, 53, 61, 62, 63, 64, 65, 66, 67, 81, 82, 83, 84, 85, 86, 87, 88, 89],
  bohemian: [3, 6, 10, 13, 14, 16, 18, 20, 26, 29, 33, 34, 35, 38, 41, 46, 48, 56, 60, 71, 78, 80, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100]
};

export default function CoupleAdminPage({
  params,
}: {
  params: Promise<{ wedding_id: string }>;
}) {
  const { wedding_id } = use(params);
  
  const [wedding, setWedding] = useState<any>(null);
  const [rsvps, setRsvps] = useState<any[]>([]);
  const [rsvpToDelete, setRsvpToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [passwordInput, setPasswordInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [activeTab, setActiveTab] = useState<'info' | 'events' | 'design' | 'content' | 'special' | 'preview' | 'share' | 'settings' | 'rsvps' | 'guests'>('info');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [subEvents, setSubEvents] = useState<any[]>([]);

  // Event-specific dynamic states
  const [isWomenOnly, setIsWomenOnly] = useState<'yes' | 'no'>('no');
  const [hennaNote, setHennaNote] = useState('');
  const [isBabyNameKnown, setIsBabyNameKnown] = useState<'yes' | 'no'>('no');
  const [babyNameInput, setBabyNameInput] = useState('');
  const [isRegistrationRequired, setIsRegistrationRequired] = useState<'yes' | 'no'>('no');
  const [registrationNote, setRegistrationNote] = useState('');
  const [hasAgeLimit, setHasAgeLimit] = useState<'yes' | 'no'>('no');
  const [ageLimitNote, setAgeLimitNote] = useState('');
  const [hasAfterParty, setHasAfterParty] = useState<'yes' | 'no'>('no');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'attending' | 'not-attending'>('all');
  const [showResumeBanner, setShowResumeBanner] = useState(true);
  const [previewKey, setPreviewKey] = useState(Date.now()); // iframe yenilemek için
  
  // Tasarım Adımı State
  const [templateId, setTemplateId] = useState('template1');
  const latestTemplateIdRef = useRef<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState('#f43f5e');
  const [textColor, setTextColor] = useState('#1e293b'); // Yeni eklenen metin rengi
  const [cardBgColor, setCardBgColor] = useState('#ffffff'); // Kart Zemin Rengi
  const [cardOpacity, setCardOpacity] = useState(90); // Kart Opaklığı (0-100)
  const [cardBlur, setCardBlur] = useState(0); // Kart Bulanıklığı (px)
  const [sceneBackgroundColor, setSceneBackgroundColor] = useState('#f8f7f4'); // Dış Sahne Rengi
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({}); // Validasyon hataları
  const [envelopeColor, setEnvelopeColor] = useState('#e6d5c3');
  const [envelopeBgColor, setEnvelopeBgColor] = useState('slate');
  const [envelopeFlapType, setEnvelopeFlapType] = useState('triangle');
  const [sealType, setSealType] = useState('sparkles');
  const [sealColor, setSealColor] = useState('#9f1239');
  const [entranceType, setEntranceType] = useState('envelope');
  const [effectType, setEffectType] = useState('');
  const [fontFamily, setFontFamily] = useState('sans');
  const [namesFontFamily, setNamesFontFamily] = useState('');
  const [bgImageUrl, setBgImageUrl] = useState('');
  const [telegramBotToken, setTelegramBotToken] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');
  const [useEnvelope, setUseEnvelope] = useState(true);
  const [musicUrl, setMusicUrl] = useState('');
  const [musicAutoplay, setMusicAutoplay] = useState(true);
  
  // Modüller & Bileşen Yönetimi (Aç/Kapat) State
  const [showPhotos, setShowPhotos] = useState(true);
  const [showRsvp, setShowRsvp] = useState(true);
  const [showComments, setShowComments] = useState(true);
  const [showCountdown, setShowCountdown] = useState(true);
  const [backgroundAnimation, setBackgroundAnimation] = useState('none');
  const [entranceAnimation, setEntranceAnimation] = useState('royal-seal-premium');
  const [envelopeStyle, setEnvelopeStyle] = useState('classic');
  const [sealStyle, setSealStyle] = useState('burgundy');
  const [userChangedOpeningType, setUserChangedOpeningType] = useState(false);
  const [isAnimationModalOpen, setIsAnimationModalOpen] = useState(false);


  
  // Premium UI/UX States
  const [countdownStyle, setCountdownStyle] = useState('glass');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAudioUploading, setIsAudioUploading] = useState(false);
  const [customOverrides, setCustomOverrides] = useState<any>({});
  const [photoFocalPoint, setPhotoFocalPoint] = useState<{x: number, y: number}>({ x: 50, y: 50 });

  // Dynamically managed fields for custom layouts
  const [newTimelineDate, setNewTimelineDate] = useState('');
  const [newTimelineTitle, setNewTimelineTitle] = useState('');
  const [newTimelineDesc, setNewTimelineDesc] = useState('');
  const [newTimelineIcon, setNewTimelineIcon] = useState('heart');
  const [newSpeakerName, setNewSpeakerName] = useState('');
  const [newSpeakerRole, setNewSpeakerRole] = useState('');
  const [newSpeakerCompany, setNewSpeakerCompany] = useState('');
  const [newSponsorName, setNewSponsorName] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [previewDevice, setPreviewDevice] = useState<'iphone' | 'android' | 'tablet'>('iphone');
  const [activeRsvpSubTab, setActiveRsvpSubTab] = useState<'list' | 'comments'>('list');
  const [activeMainTab, setActiveMainTab] = useState<'genel'|'tema'|'animasyon'|'moduller'|'entegrasyonlar'>('genel');
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [templateCategory, setTemplateCategory] = useState('all');
  const [templateSearch, setTemplateSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(12);
  const [showManualTelegram, setShowManualTelegram] = useState(false);
  const [showPaletteMenu, setShowPaletteMenu] = useState(false);

  const designPalettes = [
    { name: 'Lüks Mermer & Altın', primary: '#d6a84f', text: '#0f0e0e', font: 'Cormorant Garamond', animation: 'goldParticles', envelope: 'marble-white', seal: 'gold', bg: 'linear-gradient(135deg,#080706,#2a1f0a)' },
    { name: 'Rose Gold Nişan', primary: '#c77dff', text: '#2d0036', font: 'Playfair Display', animation: 'rosePetals', envelope: 'rose-gold', seal: 'rose-gold', bg: 'linear-gradient(135deg,#ffe4e6,#fce7f3)' },
    { name: 'Minimalist Beyaz', primary: '#1e293b', text: '#1e293b', font: 'Outfit', animation: 'none', envelope: 'solid-ivory', seal: 'minimal', bg: '#ffffff' },
    { name: 'Bohem Kır', primary: '#c2410c', text: '#4a2f22', font: 'Playfair Display', animation: 'sakura', envelope: 'paper-kraft', seal: 'heart', bg: 'linear-gradient(135deg,#fef3c7,#fed7aa)' },
    { name: 'Siyah Premium', primary: '#d6a84f', text: '#ffffff', font: 'Cinzel', animation: 'goldParticles', envelope: 'marble-black', seal: 'crown', bg: 'linear-gradient(135deg,#0a0a0a,#1a1a2e)' },
    { name: 'Bordo Kına', primary: '#fbbf24', text: '#fff7ed', font: 'Cormorant Garamond', animation: 'pearlSparkle', envelope: 'solid-burgundy', seal: 'crown', bg: 'linear-gradient(135deg,#7f1d1d,#991b1b)' },
    { name: 'Pastel Baby Shower', primary: '#f43f5e', text: '#334155', font: 'Nunito', animation: 'hearts', envelope: 'solid-blush', seal: 'heart', bg: 'linear-gradient(135deg,#fce7f3,#e0f2fe)' },
    { name: 'Lavanta Bahçesi', primary: '#7c3aed', text: '#2d1b69', font: 'Playfair Display', animation: 'bokehLights', envelope: 'solid-lavender', seal: 'flower', bg: 'linear-gradient(135deg,#ede9fe,#ddd6fe)' },
  ];



  
  // Genel Bilgiler State
  const [eventType, setEventType] = useState('Düğün');
  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [brideParents, setBrideParents] = useState('');
  const [groomParents, setGroomParents] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [venueName, setVenueName] = useState('');
  const [venueAddress, setVenueAddress] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [quoteFontFamily, setQuoteFontFamily] = useState('');
  const [quoteFontSize, setQuoteFontSize] = useState('text-sm');
  const [isCopied, setIsCopied] = useState(false);
  const [themes, setThemes] = useState<any[]>([]);
  
  // Live preview data — reflects current state instantly without DB roundtrip
  const liveWeddingData = useMemo(() => {
    const activeTheme = themes.find(t => t.id === templateId || t.template_id === templateId);
    return {
      ...wedding,
      event_type: eventType,
      template_id: templateId,
      primary_color: primaryColor,
      text_color: textColor,
      envelope_color: envelopeColor,
      
      
      envelope_flap_type: envelopeFlapType,
      seal_type: sealType,
      seal_color: sealColor,
      entrance_type: entranceType,
      effect_type: effectType,
      font_family: fontFamily,
      names_font_family: namesFontFamily,
      use_envelope: useEnvelope,
      show_photos: showPhotos,
      show_rsvp: showRsvp,
      show_comments: showComments,
      show_countdown: showCountdown,
      background_animation: backgroundAnimation,
      entrance_animation: entranceAnimation,
      envelope_style: envelopeStyle,
      seal_style: sealStyle,
      countdown_style: countdownStyle,
      is_dark_mode: isDarkMode,
      custom_overrides: {
        ...customOverrides,
        design: {
          ...customOverrides?.design,
          cardBgColor,
          cardOpacity,
          cardBlur,
          sceneBackgroundColor,
        },
        layoutStyle: customOverrides?.layoutStyle || activeTheme?.layoutStyle || 'monogram',
        backgroundDesign: customOverrides?.design?.backgroundDesign || customOverrides?.backgroundDesign || activeTheme?.backgroundDesign || '',
        thematicAssets: customOverrides?.thematicAssets || activeTheme?.thematicAssets || [],
        animationPreset: customOverrides?.animationPreset || activeTheme?.animationPreset || '',
        sealPreset: customOverrides?.sealPreset || activeTheme?.sealPreset || '',
      },
      photo_focal_point: photoFocalPoint,
      layout_style: customOverrides?.layoutStyle || activeTheme?.layoutStyle || 'monogram',
    };
  }, [
    wedding, templateId, primaryColor, textColor, envelopeColor,
    envelopeFlapType, sealType, sealColor,
    entranceType, effectType, fontFamily, namesFontFamily, useEnvelope,
    showPhotos, showRsvp, showComments, showCountdown, backgroundAnimation,
    entranceAnimation, envelopeStyle, sealStyle, countdownStyle, isDarkMode, eventType,
    customOverrides, photoFocalPoint, themes, cardBgColor, cardOpacity, cardBlur, sceneBackgroundColor
  ]);

  const completionStatus = useMemo(() => {
    if (!wedding) return { percent: 0, nextStep: 'info' as const, steps: { info: false, events: false, design: false, content: false, special: false, preview: false, share: false } };
    const eType = (eventType || 'wedding').toLowerCase();
    let infoComplete = false;
    if (['wedding', 'engagement', 'düğün', 'nişan'].includes(eType)) {
      infoComplete = !!(brideName?.trim() && groomName?.trim() && weddingDate && venueName?.trim());
    } else if (['corporate', 'kurumsal'].includes(eType)) {
      infoComplete = !!(brideName?.trim() && groomName?.trim() && weddingDate && venueName?.trim());
    } else {
      infoComplete = !!(brideName?.trim() && weddingDate && venueName?.trim());
    }
    const eventsComplete = subEvents.length > 0;
    const designComplete = !!templateId;
    const contentComplete = !!(customMessage?.trim() || bgImageUrl || showPhotos);
    const specialComplete = !!(musicUrl || googleMapsUrl || subEvents.some(e => e.description));
    const previewComplete = infoComplete && designComplete;
    const shareComplete = wedding.is_paid || false;
    const completedList = [infoComplete, eventsComplete, designComplete, contentComplete, specialComplete, previewComplete, shareComplete];
    const completedCount = completedList.filter(Boolean).length;
    const percent = Math.round((completedCount / 7) * 100);

    let nextStep: 'info' | 'events' | 'design' | 'content' | 'special' | 'preview' | 'share' | 'settings' = 'info';
    if (!infoComplete) nextStep = 'info';
    else if (!eventsComplete) nextStep = 'events';
    else if (!designComplete) nextStep = 'design';
    else if (!contentComplete) nextStep = 'content';
    else if (!specialComplete) nextStep = 'special';
    else if (!previewComplete) nextStep = 'preview';
    else nextStep = 'share';

    return { percent, nextStep, steps: { info: infoComplete, events: eventsComplete, design: designComplete, content: contentComplete, special: specialComplete, preview: previewComplete, share: shareComplete } };
  }, [wedding, eventType, brideName, groomName, weddingDate, venueName, subEvents, templateId, customMessage, bgImageUrl, showPhotos, musicUrl, googleMapsUrl, customOverrides, isWomenOnly, hennaNote, isBabyNameKnown, babyNameInput, isRegistrationRequired, registrationNote, hasAgeLimit, ageLimitNote, hasAfterParty]);

  const [isUploading, setIsUploading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    // Hazır temaları yükle
    import('@/lib/themes').then(module => {
      setThemes(module.predefinedThemes);
    });

    async function loadData() {
      // 1. Düğün bilgilerini çek
      const { data: weddingData, error } = await supabase
        .from('weddings')
        .select('*')
        .eq('slug', wedding_id)
        .single();
        
      if (error || !weddingData) {
        setLoading(false);
        return;
      }
      setWedding(weddingData);
      
      // 2. Mevcut kullanıcının (Auth) oturumunu kontrol et
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('is_email_verified')
            .eq('id', session.user.id)
            .maybeSingle();

          if (profile && profile.is_email_verified === false && !session.user.email_confirmed_at) {
            window.location.href = `/dogrula?email=${encodeURIComponent(session.user.email || '')}`;
            return;
          }
        } catch {}
      }
      
      let isAuth = false;
      if (session?.user?.id && session.user.id === weddingData.user_id) {
        setIsOwner(true);
        isAuth = true;
      } else {
        try {
          const res = await fetch('/api/admin/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ wedding_id: weddingData.id })
          });
          const data = await res.json();
          isAuth = data.authenticated;
        } catch(e) {
          console.error(e);
        }
      }

      if (isAuth) {
        setIsAuthenticated(true);
        fetchRsvps(weddingData.id);
      } else {
        setIsAuthenticated(false);
      }
      
      if (weddingData.template_id) setTemplateId(weddingData.template_id);
      if (weddingData.primary_color) setPrimaryColor(weddingData.primary_color);
      if (weddingData.text_color) setTextColor(weddingData.text_color);
      if (weddingData.envelope_color) setEnvelopeColor(weddingData.envelope_color);
      const bgDesign = weddingData.background_design || weddingData.envelope_bg_color;
      if (bgDesign) setEnvelopeBgColor(bgDesign);
      if (weddingData.envelope_flap_type) setEnvelopeFlapType(weddingData.envelope_flap_type);
      if (weddingData.seal_type) setSealType(weddingData.seal_type);
      if (weddingData.seal_color) setSealColor(weddingData.seal_color);
      else if (weddingData.primary_color) setSealColor(weddingData.primary_color);
      if (weddingData.entrance_type) setEntranceType(weddingData.entrance_type);
      if (weddingData.effect_type) setEffectType(weddingData.effect_type);
      if (weddingData.font_family) setFontFamily(weddingData.font_family);
      if (weddingData.names_font_family) setNamesFontFamily(weddingData.names_font_family);
      if (weddingData.background_image_url) setBgImageUrl(weddingData.background_image_url);
      if (weddingData.telegram_bot_token) setTelegramBotToken(weddingData.telegram_bot_token);
      if (weddingData.telegram_chat_id) setTelegramChatId(weddingData.telegram_chat_id);
      if (weddingData.use_envelope !== undefined && weddingData.use_envelope !== null) setUseEnvelope(weddingData.use_envelope);
      if (weddingData.music_url) setMusicUrl(weddingData.music_url);
      if (weddingData.music_autoplay !== undefined && weddingData.music_autoplay !== null) setMusicAutoplay(weddingData.music_autoplay);
      
      // Modüller & Bileşen Yönetimi (Aç/Kapat) Yükleme
      if (weddingData.show_photos !== undefined && weddingData.show_photos !== null) setShowPhotos(weddingData.show_photos);
      if (weddingData.show_rsvp !== undefined && weddingData.show_rsvp !== null) setShowRsvp(weddingData.show_rsvp);
      if (weddingData.show_comments !== undefined && weddingData.show_comments !== null) setShowComments(weddingData.show_comments);
      if (weddingData.show_countdown !== undefined && weddingData.show_countdown !== null) setShowCountdown(weddingData.show_countdown);
      if (weddingData.background_animation) setBackgroundAnimation(weddingData.background_animation);
      if (weddingData.entrance_animation) setEntranceAnimation(weddingData.entrance_animation);
      if (weddingData.envelope_style) setEnvelopeStyle(weddingData.envelope_style);
      if (weddingData.seal_style) setSealStyle(weddingData.seal_style);
      if (weddingData.countdown_style) setCountdownStyle(weddingData.countdown_style);
      if (weddingData.is_dark_mode !== undefined && weddingData.is_dark_mode !== null) setIsDarkMode(weddingData.is_dark_mode);
      if (weddingData.custom_overrides) {
        const co = weddingData.custom_overrides;
        setCustomOverrides(co);
        if (co.design?.cardBgColor) setCardBgColor(co.design.cardBgColor);
        if (co.design?.cardOpacity !== undefined) setCardOpacity(co.design.cardOpacity);
        if (co.design?.sceneBackgroundColor) setSceneBackgroundColor(co.design.sceneBackgroundColor);
        if (co.design?.cardBlur !== undefined) setCardBlur(co.design.cardBlur);
        
        // Hydrate event-specific dynamic states
        if (co.isWomenOnly) setIsWomenOnly(co.isWomenOnly);
        if (co.hennaNote) setHennaNote(co.hennaNote);
        if (co.isBabyNameKnown) setIsBabyNameKnown(co.isBabyNameKnown);
        if (co.babyName) setBabyNameInput(co.babyName);
        if (co.isRegistrationRequired) setIsRegistrationRequired(co.isRegistrationRequired);
        if (co.registrationNote) setRegistrationNote(co.registrationNote);
        if (co.hasAgeLimit) setHasAgeLimit(co.hasAgeLimit);
        if (co.ageLimitNote) setAgeLimitNote(co.ageLimitNote);
        if (co.hasAfterParty) setHasAfterParty(co.hasAfterParty);
      }
      if (weddingData.photo_focal_point) setPhotoFocalPoint(weddingData.photo_focal_point);
      
      

      // Genel Bilgileri Doldur
      if (weddingData.event_type) setEventType(weddingData.event_type);
      if (weddingData.bride_name) setBrideName(weddingData.bride_name);
      if (weddingData.groom_name) setGroomName(weddingData.groom_name);
      if (weddingData.bride_parents) setBrideParents(weddingData.bride_parents);
      if (weddingData.groom_parents) setGroomParents(weddingData.groom_parents);
      if (weddingData.wedding_date) setWeddingDate(weddingData.wedding_date);
      if (weddingData.venue_name) setVenueName(weddingData.venue_name);
      if (weddingData.venue_address) setVenueAddress(weddingData.venue_address);
      if (weddingData.google_maps_url) setGoogleMapsUrl(weddingData.google_maps_url);
      if (weddingData.custom_message) setCustomMessage(weddingData.custom_message);
      if (weddingData.quote_font_family) setQuoteFontFamily(weddingData.quote_font_family);
      if (weddingData.quote_font_size) setQuoteFontSize(weddingData.quote_font_size);
      
      setLoading(false);
    }
    loadData();
  }, [wedding_id]);

  // Gerçek Zamanlı Auto-Save Motoru KALDIRILDI - Kullanıcı sadece Kaydet butonu ile kaydedecek.

  async function fetchRsvps(weddingId: string) {
    const { data } = await supabase
      .from('rsvps')
      .select('*')
      .eq('wedding_id', weddingId)
      .order('created_at', { ascending: false });
    if (data) setRsvps(data);
  }

  async function toggleMessageApproval(rsvpId: string, approved: boolean) {
    const { error } = await supabase
      .from('rsvps')
      .update({ is_approved: approved })
      .eq('id', rsvpId);

    if (!error) {
      setRsvps(prev => prev.map(r => r.id === rsvpId ? { ...r, is_approved: approved } : r));
      setToastMessage(approved ? 'Mesaj onaylandı.' : 'Mesaj kaldırıldı.');
      setTimeout(() => setToastMessage(''), 2500);
      setPreviewKey(Date.now());
    } else {
      alert("Hata oluştu: " + error.message);
    }
  }

  async function handleDeleteRsvp(rsvpId: string) {
    const { error } = await supabase
      .from('rsvps')
      .delete()
      .eq('id', rsvpId);

    if (!error) {
      setRsvps(prev => prev.filter(r => r.id !== rsvpId));
      setRsvpToDelete(null);
      setToastMessage('Katılımcı kaydı silindi.');
      setTimeout(() => setToastMessage(''), 2500);
      setPreviewKey(Date.now());
    } else {
      alert("Hata oluştu: " + error.message);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!wedding) return;

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wedding_id: wedding.id, password: passwordInput })
      });
      const data = await res.json();
      
      if (data.success) {
        setIsAuthenticated(true);
        fetchRsvps(wedding.id);
      } else {
        setErrorMsg('Şifre hatalı. Lütfen tekrar deneyin.');
      }
    } catch (e) {
      setErrorMsg('Giriş yapılırken bir hata oluştu.');
    }
  }

  async function handleSaveDesign() {
    // Zorunlu alan validasyonu (Etkinlik türüne duyarlı)
    const errors: Record<string, string> = {};
    const isCorporate = eventType === 'corporate' || eventType === 'Kurumsal' || eventType === 'Özel Davet';
    
    if (!isCorporate && !brideName?.trim() && !groomName?.trim()) {
      errors.brideName = 'İsim / Kişi adı girilmesi zorunludur.';
    }
    if (!weddingDate) {
      errors.weddingDate = 'Etkinlik tarihi ve saati zorunludur.';
    }
    if (!venueName?.trim()) {
      errors.venueName = 'Mekan adı zorunludur.';
    }
    if (!templateId) {
      errors.templateId = 'Şablon seçimi zorunludur.';
    }
    if (!eventType) {
      errors.eventType = 'Etkinlik türü seçimi zorunludur.';
    }

    setFieldErrors(errors);

    const errorKeys = Object.keys(errors);
    if (errorKeys.length > 0) {
      if (errors.brideName || errors.weddingDate || errors.venueName || errors.eventType) {
        setActiveMainTab('genel');
      } else if (errors.templateId) {
        setActiveMainTab('tema');
      }

      setTimeout(() => {
        const firstKey = errorKeys[0];
        const el = document.getElementById(`field-${firstKey}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.focus();
        }
      }, 150);

      alert('⚠️ Lütfen aşağıdaki eksik alanları tamamlayın:\n\n• ' + Object.values(errors).join('\n• '));
      return;
    }

    const payload: any = {
      template_id: latestTemplateIdRef.current || templateId,
      primary_color: primaryColor,
      text_color: textColor,
      envelope_color: envelopeColor,
      
      envelope_flap_type: envelopeFlapType,
      seal_type: sealType,
      seal_color: sealColor,
      entrance_type: entranceType,
      effect_type: effectType,
      font_family: fontFamily,
      names_font_family: namesFontFamily,
      background_image_url: bgImageUrl,
      telegram_bot_token: telegramBotToken,
      telegram_chat_id: telegramChatId,
      use_envelope: useEnvelope,
      event_type: eventType,
      bride_name: brideName,
      groom_name: groomName,
      bride_parents: brideParents,
      groom_parents: groomParents,
      wedding_date: weddingDate,
      venue_name: venueName,
      venue_address: venueAddress,
      google_maps_url: googleMapsUrl,
      custom_message: customMessage,
      quote_font_family: quoteFontFamily,
      quote_font_size: quoteFontSize,
      music_url: musicUrl,
      music_autoplay: musicAutoplay,
      show_photos: showPhotos,
      show_rsvp: showRsvp,
      show_comments: showComments,
      show_countdown: showCountdown,
      background_animation: backgroundAnimation,
      entrance_animation: entranceAnimation,
      envelope_style: envelopeStyle,
      seal_style: sealStyle,
      countdown_style: countdownStyle,
      is_dark_mode: isDarkMode,
      custom_overrides: {
        ...customOverrides,
        design: {
          ...customOverrides?.design,
          sceneBackgroundColor,
          cardBgColor,
          cardOpacity,
          cardBlur,
          cardSurface: {
            color: cardBgColor,
            opacity: cardOpacity,
            blur: cardBlur,
          }
        }
      },
      photo_focal_point: photoFocalPoint
    };

    const attemptSave = async () => {
      return supabase.from('weddings').update(payload).eq('id', wedding.id);
    };

    try {
      let { error } = await attemptSave();

      // "Failed to fetch" gibi ağ seviyesi hatalar genelde anlıktır (Wi-Fi
      // kesintisi, sunucunun o an meşgul olması vb.) - kullanıcının işini
      // kaybetmemesi için bir kez daha deniyoruz, sonra pes ediyoruz.
      if (error && /fetch/i.test(error.message || '')) {
        await new Promise((r) => setTimeout(r, 1500));
        ({ error } = await attemptSave());
      }

      if (!error) {
        alert('✅ Tüm ayarlar başarıyla kaydedildi!');
        setPreviewKey(Date.now()); // Iframe'i yenile
      } else {
        alert(
          'Hata oluştu: ' + error.message +
          ' | code=' + (error as any).code +
          ' | details=' + (error as any).details +
          ' | hint=' + (error as any).hint +
          ' | payloadBytes=' + JSON.stringify(payload).length
        );
      }
    } catch (err: any) {
      // supabase-js bazı ağ hatalarını fırlatabilir (return etmek yerine) -
      // bunu da yakalayıp aynı diyalogda gösteriyoruz ki CI logunda kaybolmasın.
      alert(
        'Hata oluştu (catch): ' + (err?.message || String(err)) +
        ' | name=' + err?.name +
        ' | cause=' + JSON.stringify(err?.cause) +
        ' | payloadBytes=' + JSON.stringify(payload).length
      );
    }
  }

  function handleApplySmartAutoMatch(customType?: string) {
    const targetType = customType || eventType;
    const match = getSmartAutoMatch(targetType);
    
    if (match.template_id) setTemplateId(match.template_id);
    if (match.primary_color) setPrimaryColor(match.primary_color);
    if (match.text_color) setTextColor(match.text_color);
    if (match.envelope_bg_color) setEnvelopeBgColor(match.envelope_bg_color);
    if (match.envelope_color) setEnvelopeColor(match.envelope_color);
    if (match.seal_style) setSealStyle(match.seal_style);
    if (match.font_family) setFontFamily(match.font_family);
    if (match.names_font_family) setNamesFontFamily(match.names_font_family);
    if (match.background_animation) setBackgroundAnimation(match.background_animation);
    
    setCustomOverrides((prev: any) => ({
      ...(prev || {}),
      ...match.custom_overrides
    }));

    alert(`'${targetType}' türüne en uygun önerilen kombinasyon başarıyla uygulandı! Lütfen kaydetmeyi unutmayın.`);
  }

  const addTimelineItem = () => {
    if (!newTimelineTitle.trim()) {
      alert('Başlık boş bırakılamaz.');
      return;
    }
    const current = customOverrides.timeline_items || [];
    const newItem = {
      id: String(Date.now()),
      date: newTimelineDate,
      title: newTimelineTitle,
      description: newTimelineDesc,
      icon: newTimelineIcon
    };
    setCustomOverrides((prev: any) => ({
      ...prev,
      timeline_items: [...current, newItem]
    }));
    setNewTimelineDate('');
    setNewTimelineTitle('');
    setNewTimelineDesc('');
  };

  const removeTimelineItem = (id: string) => {
    const current = customOverrides.timeline_items || [];
    const filtered = current.filter((item: any) => item.id !== id);
    setCustomOverrides((prev: any) => ({
      ...prev,
      timeline_items: filtered
    }));
  };

  const addSpeaker = () => {
    if (!newSpeakerName.trim() || !newSpeakerRole.trim()) {
      alert('Konuşmacı adı ve unvanı zorunludur.');
      return;
    }
    const current = customOverrides.speakers || [];
    const newItem = {
      name: newSpeakerName,
      role: newSpeakerRole,
      company: newSpeakerCompany
    };
    setCustomOverrides((prev: any) => ({
      ...prev,
      speakers: [...current, newItem]
    }));
    setNewSpeakerName('');
    setNewSpeakerRole('');
    setNewSpeakerCompany('');
  };

  const removeSpeaker = (idx: number) => {
    const current = customOverrides.speakers || [];
    const filtered = current.filter((_: any, i: number) => i !== idx);
    setCustomOverrides((prev: any) => ({
      ...prev,
      speakers: filtered
    }));
  };

  const addSponsor = () => {
    if (!newSponsorName.trim()) {
      alert('Sponsor adı giriniz.');
      return;
    }
    const current = customOverrides.sponsors || [];
    const newItem = { name: newSponsorName };
    setCustomOverrides((prev: any) => ({
      ...prev,
      sponsors: [...current, newItem]
    }));
    setNewSponsorName('');
  };

  const removeSponsor = (idx: number) => {
    const current = customOverrides.sponsors || [];
    const filtered = current.filter((_: any, i: number) => i !== idx);
    setCustomOverrides((prev: any) => ({
      ...prev,
      sponsors: filtered
    }));
  };

  function applyPreset(theme: any, selectedVariant?: any) {
    if (!window.confirm('Bu şablonu uygulamak istediğinize emin misiniz?')) return;
    
    const newTemplateId = theme.template_id || theme.id;
    latestTemplateIdRef.current = newTemplateId;
    setTemplateId(newTemplateId);
    
    // Choose active color palette (Selected variant or theme default colorPalette)
    const palette = selectedVariant?.colorPalette || theme.colorPalette;
    
    if (palette) {
      if (palette.background) setEnvelopeBgColor(palette.background);
      if (palette.primaryText) setPrimaryColor(palette.accent || palette.primaryText);
      if (palette.secondaryText) setTextColor(palette.primaryText || palette.secondaryText);
      if (palette.border) setSealColor(palette.accent || palette.border);
    } else {
      setPrimaryColor(theme.primary_color);
      if (theme.text_color) setTextColor(theme.text_color);
      if (theme.recommendedBackgroundDesign) {
        setEnvelopeBgColor(theme.recommendedBackgroundDesign);
      } else if (theme.envelope_bg_color) {
        setEnvelopeBgColor(theme.envelope_bg_color);
      }
    }

    setFontFamily(theme.font_family);
    if (theme.names_font_family) setNamesFontFamily(theme.names_font_family);
    setBgImageUrl(theme.background_image_url || '');
    if (theme.use_envelope !== undefined) setUseEnvelope(theme.use_envelope);
    if (theme.envelope_color) setEnvelopeColor(theme.envelope_color);
    
    // update eventType state mapping English enum to DB value
    if (theme.eventType) {
      setEventType(mapEnumToDbEventType(theme.eventType));
    }
    
    // PRESERVE CONTENT OVERRIDES, RESET DESIGN OVERRIDES
    setCustomOverrides((prev: any) => {
      const preservedContent = prev?.content || {
        timelineItems: prev?.timelineItems || [],
        speakers: prev?.speakers || [],
        sponsors: prev?.sponsors || [],
        gallery: prev?.gallery || [],
        customTexts: prev?.customTexts || {},
      };

      return {
        content: preservedContent,
        design: {
          layoutStyle: theme.layoutStyle,
          backgroundDesign: theme.defaultBackground || theme.backgroundDesign || theme.recommendedBackgroundDesign || '',
          colorPalette: palette || theme.colorPalette || null,
          thematicAssets: theme.thematicAssets || [],
          animationPreset: theme.animationPreset || theme.recommendedBackgroundAnimation || '',
          sealPreset: theme.sealPreset || theme.seal_type || '',
          selectedColorVariantId: selectedVariant?.id || '',
        },
        // top-level backward compatibility keys:
        layoutStyle: theme.layoutStyle,
        thematicAssets: theme.thematicAssets || [],
        animationPreset: theme.animationPreset || theme.recommendedBackgroundAnimation || '',
        sealPreset: theme.sealPreset || theme.seal_type || '',
        timelineItems: preservedContent.timelineItems,
        speakers: preservedContent.speakers,
        sponsors: preservedContent.sponsors,
      };
    });

    if (theme.envelope_flap_type) setEnvelopeFlapType(theme.envelope_flap_type);
    if (theme.seal_type) setSealType(theme.seal_type);
    if (theme.seal_color) setSealColor(theme.seal_color);
    if (theme.entrance_type) setEntranceType(theme.entrance_type);
    if (theme.effect_type !== undefined) setEffectType(theme.effect_type || '');

    if (theme.recommendedOpeningType) {
      setEntranceAnimation(theme.recommendedOpeningType);
      setUserChangedOpeningType(false);
    }
    if (theme.recommendedOpeningStyle) {
      setEnvelopeStyle(theme.recommendedOpeningStyle);
    }
    if (theme.recommendedBackgroundAnimation) {
      setBackgroundAnimation(theme.recommendedBackgroundAnimation);
    }
    if (theme.recommendedSeal || theme.sealPreset) {
      setSealType(theme.recommendedSeal || theme.sealPreset || '');
    }
  }

  function resetOpeningToRecommended() {
    const activeTheme = themes.find(t => t.template_id === templateId) || themes[0];
    if (activeTheme) {
      if (activeTheme.recommendedOpeningType) setEntranceAnimation(activeTheme.recommendedOpeningType);
      if (activeTheme.recommendedOpeningStyle) setEnvelopeStyle(activeTheme.recommendedOpeningStyle);
      if (activeTheme.recommendedBackgroundDesign) setEnvelopeBgColor(activeTheme.recommendedBackgroundDesign);
      if (activeTheme.recommendedBackgroundAnimation) setBackgroundAnimation(activeTheme.recommendedBackgroundAnimation);
      if (activeTheme.recommendedSeal || activeTheme.sealPreset) setSealType(activeTheme.recommendedSeal || activeTheme.sealPreset || '');
      setUserChangedOpeningType(false);
    }
  }

  function handleReplayAnimation() {
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem('preview_envelope_opened');
    }
    setPreviewKey(Date.now());
  }

  const handleExportCSV = () => {
    if (rsvps.length === 0) return;
    const BOM = '\uFEFF';
    const headers = 'Davetli Adı,Durum,Yetişkin Sayısı,Çocuk Sayısı,Özel Mesaj\n';
    const csvContent = rsvps.map(r => 
      `"${(r.guest_name || '').replace(/"/g, '""')}","${r.is_attending ? 'Katılıyor' : 'Katılamıyor'}",${r.is_attending ? r.guest_count : 0},${r.is_attending ? (r.child_count || 0) : 0},"${(r.message || '').replace(/"/g, '""')}"`
    ).join('\n');
    
    const blob = new Blob([BOM + headers + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${wedding?.slug || 'davetli'}-lcv-listesi.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRsvps = rsvps.filter(rsvp => {
    const name = rsvp.guest_name || '';
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' 
      ? true 
      : filterStatus === 'attending' 
        ? rsvp.is_attending 
        : !rsvp.is_attending;
    return matchesSearch && matchesStatus;
  });

  function handleAIGenerate() {
    let newQuote = getRandomQuote();
    // Aynı söz gelmesin diye basit bir kontrol
    while (newQuote === customMessage && customMessage.length > 0) {
      newQuote = getRandomQuote();
    }
    setCustomMessage(newQuote);
  }

  const [isConnectingTelegram, setIsConnectingTelegram] = useState(false);
  const [telegramStatusMsg, setTelegramStatusMsg] = useState('');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [verifiedBotName, setVerifiedBotName] = useState('');
  const [telegramWizardStep, setTelegramWizardStep] = useState<1 | 2 | 3>(1);

  // Token doğrulama + webhook kayıt
  const handleValidateToken = async () => {
    if (!telegramBotToken || !telegramBotToken.includes(':')) {
      setTelegramStatusMsg('❌ Lütfen geçerli bir Bot Token girin. (Örn: 123456:ABC-def...)');
      return;
    }

    setIsConnectingTelegram(true);
    setTelegramStatusMsg('🔄 Token doğrulanıyor...');

    try {
      const res = await fetch('/api/telegram/setwebhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wedding_id: wedding.id, bot_token: telegramBotToken })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setTelegramStatusMsg('❌ ' + (data.error || 'Token doğrulanamadı.'));
        setIsConnectingTelegram(false);
        return;
      }

      setVerifiedBotName(data.bot_name || data.bot_username || 'Bot');
      setTelegramStatusMsg('✅ Bot doğrulandı! Adım 2\'ye geçin.');
      setTelegramWizardStep(2);

      if (data.webhook_warning) {
        console.warn('Webhook uyarısı:', data.webhook_warning);
      }

    } catch (err) {
      setTelegramStatusMsg('❌ Bağlantı hatası. İnternet bağlantınızı kontrol edin.');
    }

    setIsConnectingTelegram(false);
  };

  // Grubun /bagla komutunu dinle (polling)
  const handleStartBaglaPolling = () => {
    setTelegramWizardStep(3);
    setTelegramStatusMsg('⏳ Grubunuzdan /bagla komutu bekleniyor...');
    setIsConnectingTelegram(true);

    const interval = setInterval(async () => {
      const { data: updatedWedding } = await supabase
        .from('weddings')
        .select('telegram_chat_id')
        .eq('id', wedding.id)
        .single();

      if (updatedWedding?.telegram_chat_id) {
        setTelegramChatId(updatedWedding.telegram_chat_id);
        setIsConnectingTelegram(false);
        setTelegramStatusMsg('');
        clearInterval(interval);
      }
    }, 3000);

    setTimeout(() => {
      clearInterval(interval);
      setIsConnectingTelegram(current => {
        if (current) setTelegramStatusMsg('⏱️ Zaman aşımı. Gruba /bagla yazdığınızdan emin olun ve tekrar deneyin.');
        return false;
      });
    }, 300000);
  };

  // Eski uyumluluk — artık kullanılmıyor ama referans kırılmaması için bırakıldı
  const handleConnectTelegram = handleValidateToken;

  const handleDisconnectTelegram = async () => {
    if (!confirm('Telegram bağlantısını kesmek istediğinize emin misiniz?')) return;
    try {
      const { error } = await supabase
        .from('weddings')
        .update({ telegram_bot_token: null, telegram_chat_id: null })
        .eq('id', wedding.id);

      if (!error) {
        setTelegramBotToken('');
        setTelegramChatId('');
        setTelegramStatusMsg('Telegram bağlantısı kesildi.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendTestNotification = async () => {
    setIsSendingTest(true);
    try {
      const res = await fetch('/api/telegram/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wedding_id: wedding.id,
          guest_name: 'Test Davetlisi',
          is_attending: true,
          guest_count: 1,
          message: 'Bu bir test bildirimidir. Telegram bağlantınız başarıyla çalışıyor! 🎉'
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('Test bildirimi gönderildi.');
      } else {
        alert('Test bildirimi gönderilemedi: ' + (data.error || 'Bilinmeyen hata'));
      }
    } catch (err) {
      console.error(err);
      alert('Test bildirimi gönderilirken bir hata oluştu.');
    }
    setIsSendingTest(false);
  };

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    
    if (!telegramChatId) {
      alert("Lütfen önce Telegram bağlantısını kurun.");
      return;
    }

    const file = e.target.files[0];
    setIsUploading(true);

    const formData = new FormData();
    formData.append('photo', file);
    formData.append('wedding_id', wedding.id);

    try {
      const res = await fetch('/api/telegram/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (data.success) {
        // Dosya yüklendi, Proxy URL'sini oluştur ve arkaplan kutusuna yerleştir
        const proxyUrl = `/api/image?file_id=${data.file_id}&wedding_id=${wedding.id}`;
        setBgImageUrl(proxyUrl);
        alert("Fotoğraf başarıyla Telegram'a yüklendi! Lütfen 'Kaydet' butonuna basmayı unutmayın.");
      } else {
        alert("Yükleme başarısız: " + data.error);
      }
    } catch (err) {
      alert("Bir hata oluştu.");
    }
    
    setIsUploading(false);
  }

  async function handleAudioUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    
    if (!telegramChatId) {
      alert("Lütfen önce Telegram bağlantısını kurun.");
      return;
    }

    const file = e.target.files[0];
    setIsAudioUploading(true);

    const formData = new FormData();
    formData.append('audio', file);
    formData.append('wedding_id', wedding.id);

    try {
      const res = await fetch('/api/telegram/uploadAudio', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (data.success) {
        const proxyUrl = `/api/image?file_id=${data.file_id}&wedding_id=${wedding.id}`;
        setMusicUrl(proxyUrl);
        alert("Müzik dosyası başarıyla Telegram'a yüklendi! Lütfen 'Kaydet' butonuna basmayı unutmayın.");
      } else {
        alert("Yükleme başarısız: " + data.error);
      }
    } catch (err) {
      alert("Bir hata oluştu.");
    }
    
    setIsAudioUploading(false);
  }

  if (!wedding) return <div className="p-10 text-center">Böyle bir düğün bulunamadı.</div>;

  if (wedding.deleted_at || wedding.is_active === false) {
    return (
      <div className="min-h-screen bg-[#0a0a12] text-white flex items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md w-full bg-white/5 border border-rose-500/30 p-8 rounded-3xl backdrop-blur-xl">
          <div className="w-16 h-16 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/30">
            <Trash2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold font-serif mb-2 text-white">Bu Davetiye Çöp Kutusunda</h1>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            Bu davetiye silinmiş veya erişime kapatılmıştır. Davetiyenizi düzenlemek için lütfen ana panelinizden (Dashboard) geri yükleyin.
          </p>
          <a href="/dashboard" className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-6 py-3 rounded-xl font-bold text-sm inline-block shadow-lg shadow-rose-500/30 hover:opacity-90 transition-opacity">
            Dashboard'a Dön
          </a>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white/50 backdrop-blur-sm shadow-inner flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 text-center border border-slate-100">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Tasarım Paneli</h1>
          <p className="text-slate-500 mb-8">Oluşturduğunuz davetiyeyi düzenlemek için şifrenizi girin. (Veya <a href="/giris-yap" className="text-rose-500 hover:underline font-bold">Giriş Yaparak</a> şifresiz erişin).</p>
          
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              value={passwordInput}
              onChange={e => setPasswordInput(e.target.value)}
              placeholder="Şifre"
              className="w-full border p-3 rounded-xl mb-4 text-center text-lg tracking-widest"
              autoFocus
            />
            {errorMsg && <p className="text-red-500 text-sm mb-4">{errorMsg}</p>}
            <button type="submit" className="w-full bg-rose-500 text-white font-bold py-3 rounded-xl hover:bg-rose-600 transition-colors">
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
    );
  }

  async function handleSave(newPayloadPart?: any, silent = false) {
    if (!silent) setSaveStatus('saving');

    const overridesPayload = {
      ...(customOverrides || {}),
      isWomenOnly,
      hennaNote,
      isBabyNameKnown,
      babyName: babyNameInput,
      isRegistrationRequired,
      registrationNote,
      hasAgeLimit,
      ageLimitNote,
      hasAfterParty,
      ...(newPayloadPart?.custom_overrides || {})
    };

    const payload: any = {
      template_id: latestTemplateIdRef.current || templateId,
      primary_color: primaryColor,
      text_color: textColor,
      envelope_color: envelopeColor,
      envelope_flap_type: envelopeFlapType,
      seal_type: sealType,
      seal_color: sealColor,
      entrance_type: entranceType,
      effect_type: effectType,
      font_family: fontFamily,
      names_font_family: namesFontFamily,
      background_image_url: bgImageUrl,
      telegram_bot_token: telegramBotToken,
      telegram_chat_id: telegramChatId,
      use_envelope: useEnvelope,
      event_type: eventType,
      bride_name: brideName,
      groom_name: groomName,
      bride_parents: brideParents,
      groom_parents: groomParents,
      wedding_date: weddingDate,
      venue_name: venueName,
      venue_address: venueAddress,
      google_maps_url: googleMapsUrl,
      custom_message: customMessage,
      quote_font_family: quoteFontFamily,
      quote_font_size: quoteFontSize,
      music_url: musicUrl,
      music_autoplay: musicAutoplay,
      show_photos: showPhotos,
      show_rsvp: showRsvp,
      show_comments: showComments,
      show_countdown: showCountdown,
      background_animation: backgroundAnimation,
      entrance_animation: entranceAnimation,
      envelope_style: envelopeStyle,
      seal_style: sealStyle,
      countdown_style: countdownStyle,
      is_dark_mode: isDarkMode,
      photo_focal_point: photoFocalPoint,
      ...newPayloadPart,
      custom_overrides: overridesPayload
    };

    try {
      const { error } = await supabase.from('weddings').update(payload).eq('id', wedding.id);
      
      if (error) {
        if (!silent) {
          setSaveStatus('error');
          alert('Hata oluştu: ' + error.message);
        }
        return false;
      }

      // Sync sub events notes and data
      const primaryEv = subEvents.find((e: any) => e.is_primary) || subEvents[0];
      for (const ev of subEvents) {
        let noteToSync: string | undefined = undefined;
        
        // 1. Kına event note
        if (ev.type === 'kına') {
          if (isWomenOnly === 'yes') {
            noteToSync = hennaNote || "Kına gecemiz kadınlara özeldir.";
          } else {
            noteToSync = "";
          }
        }
        // 2. After Party event note
        else if (ev.type === 'after_party') {
          if (hasAfterParty === 'yes') {
            noteToSync = ageLimitNote || "Etkinliğimiz 18 yaş ve üzeridir.";
          } else {
            noteToSync = "";
          }
        }
        
        const isPrimary = ev.id === primaryEv?.id;
        const eventPayload: any = {};
        
        if (isPrimary) {
          eventPayload.start_time = weddingDate;
          eventPayload.venue_name = venueName;
          eventPayload.venue_address = venueAddress;
          eventPayload.google_maps_url = googleMapsUrl;
          
          // Also sync corporate or special notes to primary event if applicable
          const et = (eventType || 'wedding').toLowerCase();
          if (et === 'corporate' && isRegistrationRequired === 'yes') {
            noteToSync = registrationNote || "Katılım için ön kayıt gereklidir.";
          } else if (et === 'special' && hasAgeLimit === 'yes') {
            noteToSync = ageLimitNote || "Etkinliğimiz 18 yaş ve üzeridir.";
          }
        }
        
        if (noteToSync !== undefined) {
          eventPayload.description = noteToSync;
        }

        if (Object.keys(eventPayload).length > 0) {
          await supabase.from('invitation_events').update(eventPayload).eq('id', ev.id);
          setSubEvents((prev: any) => prev.map((evt: any) => evt.id === ev.id ? { ...evt, ...eventPayload } : evt));
        }
      }

      if (!silent) {
        setSaveStatus('saved');
        setToastMessage('✅ Değişiklikler kaydedildi!');
        setTimeout(() => setToastMessage(''), 2500);
      }
      setPreviewKey(Date.now());
      return true;
    } catch (e: any) {
      if (!silent) {
        setSaveStatus('error');
        alert('Hata oluştu (catch): ' + e.message);
      }
      return false;
    }
  }



  const stepLabels: Record<string, string> = {
    info: 'Bilgiler',
    events: 'Etkinlik',
    design: 'Tasarım',
    content: 'İçerik',
    special: 'Özel İçerikler',
    preview: 'Önizleme',
    share: 'Paylaşım',
    settings: 'Ayarlar'
  };

  return (
    <div className="min-w-0 min-h-screen bg-slate-50 p-4 md:p-8 text-slate-800">
      
      {toastMessage && (
        <div className="fixed top-4 right-4 z-[250] bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="fixed bottom-4 right-4 z-[100] hidden md:flex items-center gap-2 bg-white px-4 py-2.5 rounded-full shadow-lg border text-xs font-semibold">
        {saveStatus === 'saving' ? (
          <span className="text-rose-500">Kaydediliyor...</span>
        ) : saveStatus === 'saved' ? (
          <span className="text-emerald-600">Değişiklikler Kaydedildi</span>
        ) : (
          <span className="text-slate-500">Otomatik Kaydedilir</span>
        )}
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SOL: Navigation Stepper (Desktop Sidebar) */}
        <div className="hidden lg:block lg:col-span-3 flex flex-col gap-4">
          <div className="bg-white p-5 rounded-2xl border shadow-xs space-y-6 sticky top-8 text-left">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Davetiyem (%{completionStatus.percent})</h2>
            <nav className="flex flex-col gap-1">
              {['info', 'events', 'design', 'content', 'special', 'preview', 'share'].map((step, idx) => {
                const isActive = activeTab === step;
                const isCompleted = completionStatus.steps[step as keyof typeof completionStatus.steps];
                return (
                  <button
                    key={step}
                    data-testid={`admin-nav-${step}`}
                    onClick={() => setActiveTab(step as any)}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-bold cursor-pointer w-full ${isActive ? 'bg-rose-50/50 border-rose-200 text-rose-600' : 'bg-transparent border-transparent hover:bg-slate-50 text-slate-600'}`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${isActive ? 'bg-rose-500 text-white' : isCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100'}`}>
                      {isCompleted ? '✓' : idx + 1}
                    </span>
                    <span>{stepLabels[step]}</span>
                  </button>
                );
              })}
            </nav>
            <div className="border-t pt-4">
              <button onClick={() => setActiveTab('settings')} className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold text-slate-600 w-full hover:bg-slate-50 cursor-pointer ${activeTab === 'settings' ? 'bg-slate-100' : ''}`}>
                <Settings className="w-4 h-4" />
                <span>Genel Ayarlar</span>
              </button>
            </div>
          </div>
        </div>

        {/* ORTA: Form ve İçerik Panel */}
        <div className="lg:col-span-5 flex flex-col gap-6 text-left">
          
          <header className="bg-white p-6 rounded-2xl border shadow-xs flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-slate-800 truncate max-w-[200px]">
                {brideName || 'Etkinlik'} {groomName ? `& ${groomName}` : ''}
              </h1>
              <p className="text-slate-400 text-[10px] mt-0.5">Davetiye Hazırlama Stüdyosu</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleSave()} 
                className="text-xs font-bold px-3 py-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                Kaydet
              </button>
              <button onClick={() => setIsAuthenticated(false)} className="text-xs font-semibold px-3 py-1.5 bg-slate-100 rounded-lg hover:bg-slate-200 cursor-pointer">
                Çıkış
              </button>
            </div>
          </header>

          {showResumeBanner && completionStatus.steps.info && activeTab === 'info' && (
            <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center justify-between shadow-xs">
              <div className="flex flex-col gap-0.5">
                <p className="text-xs font-bold text-rose-950">Kaldığınız Yerden Devam Edin</p>
                <p className="text-[10px] text-rose-800">Bilgiler adımı zaten tamamlanmış. Sonraki adıma geçebilirsiniz.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveTab(completionStatus.nextStep);
                    setShowResumeBanner(false);
                  }}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-bold shadow-xs transition cursor-pointer"
                >
                  Devam Et
                </button>
                <button
                  onClick={() => setShowResumeBanner(false)}
                  className="text-xs text-rose-400 hover:text-rose-600 p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Tab 0: BİLGİLER */}
          {activeTab === 'info' && (
            <div className="bg-white p-6 rounded-2xl shadow-xs border space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-800">📝 Genel Bilgiler</h3>
                <p className="text-xs text-slate-400 mt-1">Davetiyenizin türünü seçin ve temel katılım detaylarını doldurun.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Davetiye Türü</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'wedding', label: 'Düğün', icon: '💍' },
                    { id: 'engagement', label: 'Nişan', icon: '🍷' },
                    { id: 'henna', label: 'Kına', icon: '💃' },
                    { id: 'circumcision', label: 'Sünnet', icon: '👑' },
                    { id: 'babyshower', label: 'Bebek', icon: '👶' },
                    { id: 'birthday', label: 'Doğum Günü', icon: '🎂' },
                    { id: 'corporate', label: 'Kurumsal', icon: '🏢' },
                    { id: 'graduation', label: 'Mezuniyet', icon: '🎓' },
                    { id: 'special', label: 'Özel', icon: '🌟' }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setEventType(item.id);
                        handleApplySmartAutoMatch(item.id);
                      }}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition cursor-pointer ${eventType === item.id ? 'border-rose-500 bg-rose-50/20 text-rose-700 font-bold' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}
                    >
                      <span className="text-lg mb-1">{item.icon}</span>
                      <span className="text-[10px]">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Question Inputs */}
              {(() => {
                const config = getEventJourneyConfig(eventType);
                return (
                  <div className="space-y-4 pt-4 border-t">
                    {config.questionGroups.map(group => (
                      <div key={group.id} className="space-y-3">
                        <h4 className="font-bold text-[10px] text-slate-400 uppercase tracking-widest">{group.title}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {group.questions.map(q => {
                            if (q.visibleWhen) {
                              const val = q.visibleWhen.fieldId === 'is_women_only' ? isWomenOnly :
                                          q.visibleWhen.fieldId === 'is_baby_name_known' ? isBabyNameKnown :
                                          q.visibleWhen.fieldId === 'is_registration_required' ? isRegistrationRequired :
                                          q.visibleWhen.fieldId === 'has_age_limit' ? hasAgeLimit : null;
                              if (val !== q.visibleWhen.value) return null;
                            }

                            return (
                              <div key={q.id} className={`\${q.type === 'textarea' ? 'sm:col-span-2' : ''} space-y-1`}>
                                <label className="block text-[11px] font-semibold text-slate-600">{q.label} {q.priority === 'required' && <span className="text-rose-500">*</span>}</label>
                                
                                {q.type === 'text' && (
                                  <input 
                                    type="text" 
                                    id={`field-${q.id}`}
                                    value={
                                      q.id === 'bride_name' ? brideName :
                                      q.id === 'groom_name' ? groomName :
                                      q.id === 'bride_parents' ? brideParents :
                                      q.id === 'groom_parents' ? groomParents :
                                      q.id === 'venue_name' ? venueName :
                                      q.id === 'dress_code' ? (customOverrides.dress_code || '') :
                                      q.id === 'baby_name' ? babyNameInput : ''
                                    }
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      if (q.id === 'bride_name') setBrideName(val);
                                      else if (q.id === 'groom_name') setGroomName(val);
                                      else if (q.id === 'bride_parents') setBrideParents(val);
                                      else if (q.id === 'groom_parents') setGroomParents(val);
                                      else if (q.id === 'venue_name') setVenueName(val);
                                      else if (q.id === 'dress_code') setCustomOverrides((prev: any) => ({ ...prev, dress_code: val }));
                                      else if (q.id === 'baby_name') setBabyNameInput(val);
                                    }}
                                    placeholder={q.placeholder}
                                    className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-none"
                                  />
                                )}

                                {q.type === 'textarea' && (
                                  <textarea 
                                    id={`field-${q.id}`}
                                    rows={2}
                                    value={
                                      q.id === 'venue_address' ? venueAddress :
                                      q.id === 'henna_note' ? hennaNote :
                                      q.id === 'registration_note' ? registrationNote :
                                      q.id === 'age_limit_note' ? ageLimitNote : ''
                                    }
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      if (q.id === 'venue_address') setVenueAddress(val);
                                      else if (q.id === 'henna_note') setHennaNote(val);
                                      else if (q.id === 'registration_note') setRegistrationNote(val);
                                      else if (q.id === 'age_limit_note') setAgeLimitNote(val);
                                    }}
                                    placeholder={q.placeholder}
                                    className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-none resize-none"
                                  />
                                )}

                                {q.type === 'date' && (
                                  <input 
                                    type="datetime-local" 
                                    id={`field-${q.id}`}
                                    value={weddingDate}
                                    onChange={(e) => setWeddingDate(e.target.value)}
                                    className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-none"
                                  />
                                )}

                                {q.type === 'location' && (
                                  <input 
                                    type="url" 
                                    id={`field-${q.id}`}
                                    value={googleMapsUrl}
                                    onChange={(e) => setGoogleMapsUrl(e.target.value)}
                                    placeholder="https://goo.gl/maps/..."
                                    className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-none"
                                  />
                                )}

                                {q.type === 'yesno' && (
                                  <div className="flex gap-2">
                                    {['yes', 'no'].map(opt => {
                                      const val = q.id === 'is_women_only' ? isWomenOnly :
                                                  q.id === 'is_baby_name_known' ? isBabyNameKnown :
                                                  q.id === 'is_registration_required' ? isRegistrationRequired :
                                                  q.id === 'has_age_limit' ? hasAgeLimit :
                                                  q.id === 'has_after_party' ? hasAfterParty :
                                                  (customOverrides[q.id] || 'no');
                                      const isSel = val === opt;
                                      return (
                                        <button
                                          key={opt}
                                          type="button"
                                          role="radio"
                                          aria-checked={isSel}
                                          onClick={() => {
                                            if (q.id === 'is_women_only') {
                                              setIsWomenOnly(opt as any);
                                              if (opt === 'yes') setHennaNote(q.suggestion || 'Kına gecemiz kadınlara özeldir.');
                                            } else if (q.id === 'is_baby_name_known') {
                                              setIsBabyNameKnown(opt as any);
                                            } else if (q.id === 'is_registration_required') {
                                              setIsRegistrationRequired(opt as any);
                                              if (opt === 'yes') setRegistrationNote(q.suggestion || 'Katılım için ön kayıt gereklidir.');
                                            } else if (q.id === 'has_age_limit') {
                                              setHasAgeLimit(opt as any);
                                              if (opt === 'yes') setAgeLimitNote(q.suggestion || 'Etkinliğimiz 18 yaş ve üzeridir.');
                                            } else if (q.id === 'has_after_party') {
                                              setHasAfterParty(opt as any);
                                            } else {
                                              setCustomOverrides((prev: any) => ({ ...prev, [q.id]: opt }));
                                            }
                                          }}
                                          className={`flex-1 py-1.5 rounded-lg border text-[10px] font-bold cursor-pointer transition ${isSel ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-600'}`}
                                        >
                                          {opt === 'yes' ? 'Evet' : 'Hayır'}
                                        </button>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button onClick={() => handleSave()} className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold hover:bg-slate-200 cursor-pointer">Kaydet</button>
                <button onClick={async () => { const ok = await handleSave(undefined, true); if (ok) setActiveTab('events'); }} className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 flex items-center gap-1 shadow-xs cursor-pointer">
                  <span>Devam</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Tab 1: ETKİNLİK PROGRAMI */}
          {activeTab === 'events' && (
            <div className="bg-white p-6 rounded-2xl shadow-xs border space-y-6">
              <EventsTab weddingId={wedding.id} />
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button onClick={() => setActiveTab('info')} className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold hover:bg-slate-200 cursor-pointer">Geri</button>
                <button onClick={() => setActiveTab('design')} className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 flex items-center gap-1 shadow-xs cursor-pointer">
                  <span>Devam</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: TASARIM */}
          {activeTab === 'design' && (
            <div className="bg-white p-6 rounded-2xl shadow-xs border space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-800">🎨 Tasarım Editörü</h3>
                <p className="text-xs text-slate-400 mt-1">Davetiyenizin görselliğini, renklerini, yazı tiplerini ve zarf stillerini yapılandırın.</p>
              </div>

              {/* Discovery gallery list */}
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Şablon ara..." 
                    value={templateSearch} 
                    onChange={e => setTemplateSearch(e.target.value)} 
                    className="flex-1 px-3 py-1.5 text-xs border rounded-lg bg-white"
                  />
                  <select 
                    value={templateCategory} 
                    onChange={e => setTemplateCategory(e.target.value)} 
                    className="border rounded-lg text-xs bg-white px-2"
                  >
                    <option value="all">Tüm Kategoriler</option>
                    <option value="wedding">Düğün</option>
                    <option value="henna">Kına</option>
                    <option value="corporate">Kurumsal</option>
                  </select>
                </div>

                <div className="max-h-[300px] overflow-y-auto grid grid-cols-2 gap-3 p-2 bg-slate-50 rounded-xl">
                  {themes.filter(theme => {
                    const matchesSearch = !templateSearch || theme.name?.toLowerCase().includes(templateSearch.toLowerCase());
                    const matchesCat = templateCategory === 'all' || theme.eventType === templateCategory;
                    return matchesSearch && matchesCat;
                  }).map(theme => {
                    const isActive = templateId === theme.id;
                    return (
                      <button
                        key={theme.id}
                        data-testid={`template-${theme.id}`}
                        onClick={() => { setTemplateId(theme.id); latestTemplateIdRef.current = theme.id; }}
                        className={`p-3 bg-white border rounded-xl text-left text-xs font-bold cursor-pointer transition ${isActive ? 'border-rose-500 shadow-sm ring-1 ring-rose-300' : 'border-slate-200'}`}
                      >
                        <div className="truncate">{theme.name}</div>
                        <div className="text-[9px] text-slate-400 font-medium capitalize mt-0.5">{theme.category || 'Premium'}</div>
                        {isActive && <span className="text-[10px] text-rose-600 block mt-1 font-semibold">Uygulandı</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Fonts & Colors */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Vurgu Rengi</label>
                  <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="w-full h-8 rounded-lg cursor-pointer border" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Yazı Tipi</label>
                  <select value={fontFamily} onChange={e => setFontFamily(e.target.value)} className="w-full border p-1.5 text-xs bg-white rounded-lg">
                    <option value="sans">Modern (Sans-Serif)</option>
                    <option value="serif">Klasik (Serif)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button onClick={() => setActiveTab('events')} className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold hover:bg-slate-200 cursor-pointer">Geri</button>
                <button onClick={() => handleSave()} className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold hover:bg-slate-200 cursor-pointer">Kaydet</button>
                <button onClick={async () => { await handleSave(undefined, true); setActiveTab('content'); }} className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 flex items-center gap-1 shadow-xs cursor-pointer">
                  <span>Devam</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: İÇERİK */}
          {activeTab === 'content' && (
            <div className="bg-white p-6 rounded-2xl shadow-xs border space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-800">✍️ Davetiye İçerikleri</h3>
                <p className="text-xs text-slate-400 mt-1">Kapak görseli, fotoğraf galerisi ve davet metnini yapılandırın.</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-500">FOTOĞRAFLARI GÖSTER</span>
                  <input type="checkbox" checked={showPhotos} onChange={e => setShowPhotos(e.target.checked)} className="rounded text-rose-500" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">ÖZEL DAVET MESAJI</label>
                  <textarea rows={3} value={customMessage} onChange={e => setCustomMessage(e.target.value)} placeholder="Misafirlerinize özel not..." className="w-full border p-2 text-xs bg-white rounded-lg resize-none" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button onClick={() => setActiveTab('design')} className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold hover:bg-slate-200 cursor-pointer">Geri</button>
                <button onClick={async () => { await handleSave(undefined, true); setActiveTab('special'); }} className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 flex items-center gap-1 shadow-xs cursor-pointer">
                  <span>Devam</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Tab 4: ÖZEL İÇERİKLER */}
          {activeTab === 'special' && (
            <div className="bg-white p-6 rounded-2xl shadow-xs border space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-800">🧩 Özel Entegrasyonlar & Notlar</h3>
                <p className="text-xs text-slate-400 mt-1">Müzik, harita ve etkinliklere özel notlarınızı yönetin.</p>
              </div>

              {/* Event Specific Notes */}
              <div className="bg-slate-50 p-4 rounded-xl border space-y-3">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Etkinlik Notları</h4>
                {subEvents.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Program eklenmemiş.</p>
                ) : (
                  <div className="space-y-2">
                    {subEvents.map(event => (
                      <div key={event.id} className="space-y-1 p-2 bg-white rounded-lg border">
                        <span className="text-xs font-bold block text-slate-700 capitalize">{event.title} ({event.type})</span>
                        <input
                          type="text"
                          value={event.description || ''}
                          onChange={async (e) => {
                            const val = e.target.value;
                            setSubEvents((prev: any) => prev.map((evt: any) => evt.id === event.id ? { ...evt, description: val } : evt));
                            await fetch(`/api/events/${event.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ description: val }) });
                          }}
                          placeholder="Etkinlik notu girin..."
                          className="w-full border rounded px-2 py-1 text-xs bg-slate-50/50"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Music & Location */}
              <div className="grid grid-cols-1 gap-3 pt-3 border-t">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Spotify / MP3 Arka Plan Müziği</label>
                  <input type="url" value={musicUrl} onChange={e => setMusicUrl(e.target.value)} placeholder="Spotify veya MP3 linki..." className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-white" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Google Harita Konum Linki</label>
                  <input type="url" value={googleMapsUrl} onChange={e => setGoogleMapsUrl(e.target.value)} placeholder="https://goo.gl/maps/..." className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-white" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button onClick={() => setActiveTab('content')} className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold hover:bg-slate-200 cursor-pointer">Geri</button>
                <button onClick={async () => { await handleSave(undefined, true); setActiveTab('preview'); }} className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 flex items-center gap-1 shadow-xs cursor-pointer">
                  <span>Devam</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Tab 5: ÖNİZLEME */}
          {activeTab === 'preview' && (
            <div className="bg-white p-6 rounded-2xl shadow-xs border space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-800">👁️ Kalite Kontrolü</h3>
                <p className="text-xs text-slate-400 mt-1">Eksik ve hatalı alanları kontrol listesinden inceleyin.</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border space-y-2.5 text-xs">
                {[
                  { id: 'info', label: 'Genel Bilgiler', isOk: completionStatus.steps.info },
                  { id: 'events', label: 'Etkinlik Programı', isOk: completionStatus.steps.events },
                  { id: 'design', label: 'Tasarım Teması', isOk: completionStatus.steps.design }
                ].map(item => (
                  <div key={item.id} className="flex justify-between items-center">
                    <span className="font-semibold text-slate-600">{item.label}</span>
                    {item.isOk ? (
                      <span className="text-emerald-600 font-bold">✓ Tamamlandı</span>
                    ) : (
                      <button onClick={() => setActiveTab(item.id as any)} className="text-rose-500 font-bold hover:underline cursor-pointer">⚠️ Düzelt</button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button onClick={() => setActiveTab('special')} className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold hover:bg-slate-200 cursor-pointer">Geri</button>
                <button onClick={async () => { await handleSave(undefined, true); setActiveTab('share'); }} className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 flex items-center gap-1 shadow-xs cursor-pointer">
                  <span>Devam</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Tab 6: PAYLAŞIM */}
          {activeTab === 'share' && (
            <div className="bg-white p-6 rounded-2xl shadow-xs border space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-800">🔗 Bağlantı Paylaşımı</h3>
                <p className="text-xs text-slate-400 mt-1">Davetiyenizi yayınlayın ve bağlantısını kopyalayın.</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border space-y-2">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Davetiye Adresi</span>
                <div className="flex gap-2">
                  <input type="text" readOnly value={`${BASE_URL}/${wedding.slug}`} className="flex-1 border px-2.5 py-1.5 rounded-lg text-xs bg-slate-100 font-mono text-slate-600" />
                  <button
                    onClick={() => { navigator.clipboard.writeText(`${BASE_URL}/${wedding.slug}`); setToastMessage("📋 Kopyalandı!"); setTimeout(() => setToastMessage(''), 2000); }}
                    className="px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 cursor-pointer"
                  >
                    Kopyala
                  </button>
                </div>
              </div>

              <div className="flex justify-center border p-5 rounded-2xl bg-white shadow-2xs">
                <div className="flex flex-col items-center gap-3">
                  <QrCode className="w-24 h-24 text-slate-800" />
                  <span className="text-xs text-slate-400 font-semibold">QR Kodu Okutarak İnceleyin</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 7: AYARLAR */}
          {activeTab === 'settings' && (
            <div className="bg-white p-6 rounded-2xl shadow-xs border space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-800">🔧 Genel Ayarlar</h3>
                <p className="text-xs text-slate-400 mt-1">Admin parolanını ve sistem parametrelerini düzenleyin.</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border max-w-xs space-y-2">
                <label className="text-xs font-semibold text-slate-600 block">Şifre Değiştir</label>
                <input type="password" placeholder="Yeni parolanız..." className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-none" />
                <button onClick={() => alert("Simüle edildi.")} className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold cursor-pointer">Şifreyi Güncelle</button>
              </div>
            </div>
          )}

          {/* Backwards-compatibility tabs */}
          {activeTab === 'rsvps' && (
            <div className="bg-white p-6 rounded-2xl border text-left">
              <h3 className="text-sm font-bold text-slate-800">LCV Yanıtları</h3>
              <table className="w-full text-left mt-3 text-xs border-collapse">
                <thead>
                  <tr className="border-b text-slate-400 font-bold uppercase"><th className="pb-2">Davetli</th><th className="pb-2">Durum</th></tr>
                </thead>
                <tbody>
                  {rsvps.map(r => (
                    <tr key={r.id} className="border-b"><td className="py-2">{r.guest_name}</td><td className="py-2">{r.is_attending ? 'Katılıyor' : 'Katılamıyor'}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

        {/* SAĞ: Canlı Önizleme (Sürekli Görünür ve Aktif) */}
        <div className="hidden lg:block lg:col-span-4 relative text-left">
          <div className="sticky top-8 flex flex-col gap-3">
            <div className="flex justify-between items-center bg-slate-800 text-white px-4 py-2.5 rounded-2xl shadow-md border border-slate-700">
              <span className="text-[11px] font-bold tracking-wider text-slate-300">📱 Önizleme</span>
              <div className="flex gap-1 bg-slate-900/50 p-1 rounded-xl">
                {['iphone', 'android', 'tablet'].map(device => (
                  <button
                    key={device}
                    onClick={() => setPreviewDevice(device as any)}
                    className={`p-1.5 rounded-lg text-xs transition cursor-pointer capitalize ${previewDevice === device ? 'bg-rose-500 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                  >
                    {device[0]}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex w-full justify-center">
              <div className={`relative h-[650px] w-full bg-slate-800 rounded-[2.5rem] p-3 shadow-2xl border-4 border-slate-700 transition-all ${previewDevice === 'iphone' ? 'max-w-[320px]' : previewDevice === 'android' ? 'max-w-[360px]' : 'max-w-[480px]'}`}>
                <div className="w-full h-full bg-white rounded-[1.8rem] overflow-y-auto overflow-x-hidden relative">
                  {wedding && liveWeddingData ? (
                    <WeddingClientWrapper key={previewKey} wedding={liveWeddingData} mode="preview">
                      <PremiumTemplateRenderer wedding={liveWeddingData} templateId={templateId} mode="preview" />
                      {subEvents && subEvents.length > 0 && (
                        <EventsTimeline events={subEvents} primaryColor={primaryColor} textColor={textColor} />
                      )}
                    </WeddingClientWrapper>
                  ) : (
                    <div className="flex items-center justify-center h-full text-xs text-slate-400">Yükleniyor...</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {rsvpToDelete && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/65 p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full text-center border">
            <h3 className="text-sm font-bold text-slate-800 mb-1">Kaydı Sil</h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">Davetli kaydı kalıcı olarak silinecektir.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setRsvpToDelete(null)} className="flex-1 py-2 border rounded-xl text-xs font-semibold hover:bg-slate-50 cursor-pointer">Vazgeç</button>
              <button onClick={() => handleDeleteRsvp(rsvpToDelete)} className="flex-1 py-2 bg-rose-500 text-white text-xs font-semibold rounded-xl hover:bg-rose-600 cursor-pointer">Sil</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

