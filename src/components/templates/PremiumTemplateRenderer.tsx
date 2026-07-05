'use client';
import { useState, useEffect } from 'react';
import { 
  Sparkles, Calendar, MapPin, Navigation, 
  Heart, Crown, Feather, Infinity, Leaf, Camera, Loader2 
} from 'lucide-react';
import CountdownTimer from '../CountdownTimer';
import RsvpModal from '../RsvpModal';
import { isColorLight } from '@/lib/colorUtils';
import { getBackgroundStyle, isBackgroundLight } from '@/lib/backgrounds';
import { supabase } from '@/lib/supabase';

// Template configuration model
interface TemplateConfig {
  id: string;
  name: string;
  category: string;
  layout: 'classic-card' | 'split-screen' | 'full-screen' | 'minimalist' | 'polaroid';
  cardBg: 'glass' | 'paper' | 'dark' | 'gold-border' | 'floral-frame' | 'clear';
  bgTexture: 'none' | 'marble' | 'watercolor-pink' | 'watercolor-blue' | 'watercolor-emerald' | 'aged-paper' | 'geometric-lines' | 'starry-sky';
  borderStyle: 'none' | 'double-gold' | 'neon' | 'floral' | 'stitch' | 'deco-corners';
  accentIcon: 'crown' | 'heart' | 'sparkles' | 'infinity' | 'feather' | 'leaf' | 'rings';
  textColorMode: 'dark' | 'light' | 'auto';
}

const getTemplateConfig = (id: string): TemplateConfig => {
  const num = parseInt(id.replace('template', '')) || 1;
  const name = `Tasarım #${num}`;

  if (num <= 10) {
    // 1. Royal Gold (Altın Saray)
    const accents: ('crown'|'rings'|'sparkles')[] = ['crown', 'rings', 'sparkles'];
    const textures: ('marble'|'geometric-lines')[] = ['marble', 'geometric-lines'];
    return {
      id,
      name,
      category: 'Royal Gold',
      layout: num % 2 === 0 ? 'full-screen' : 'classic-card',
      cardBg: num % 3 === 0 ? 'paper' : 'gold-border',
      bgTexture: textures[num % textures.length],
      borderStyle: 'double-gold',
      accentIcon: accents[num % accents.length],
      textColorMode: 'dark',
    };
  }

  if (num <= 20) {
    // 2. Watercolor Floral (Suluboya Bahçe)
    const textures: ('watercolor-pink'|'watercolor-blue'|'watercolor-emerald')[] = [
      'watercolor-pink', 'watercolor-blue', 'watercolor-emerald'
    ];
    return {
      id,
      name,
      category: 'Watercolor Floral',
      layout: 'classic-card',
      cardBg: 'floral-frame',
      bgTexture: textures[num % textures.length],
      borderStyle: 'floral',
      accentIcon: 'leaf',
      textColorMode: 'dark',
    };
  }

  if (num <= 30) {
    // 3. Minimalist Modern (Sade & Modern)
    return {
      id,
      name,
      category: 'Minimalist Modern',
      layout: 'minimalist',
      cardBg: 'glass',
      bgTexture: 'none',
      borderStyle: 'none',
      accentIcon: 'infinity',
      textColorMode: 'dark',
    };
  }

  if (num <= 40) {
    // 4. Galactic Neon (Karanlık Mod & Neon)
    return {
      id,
      name,
      category: 'Galactic Neon',
      layout: num % 2 === 0 ? 'full-screen' : 'classic-card',
      cardBg: 'dark',
      bgTexture: 'starry-sky',
      borderStyle: 'neon',
      accentIcon: 'sparkles',
      textColorMode: 'light',
    };
  }

  if (num <= 50) {
    // 5. Vintage Retro (Vintage & Nostaljik)
    return {
      id,
      name,
      category: 'Vintage Retro',
      layout: 'polaroid',
      cardBg: 'paper',
      bgTexture: 'aged-paper',
      borderStyle: 'stitch',
      accentIcon: 'feather',
      textColorMode: 'dark',
    };
  }

  if (num <= 60) {
    // 6. Art Deco (Sanatsal & Avant-Garde)
    const accents: ('crown'|'sparkles'|'infinity')[] = ['crown', 'sparkles', 'infinity'];
    return {
      id,
      name,
      category: 'Art Deco',
      layout: 'split-screen',
      cardBg: 'glass',
      bgTexture: 'geometric-lines',
      borderStyle: 'deco-corners',
      accentIcon: 'rings',
      textColorMode: 'dark',
    };
  }

  if (num <= 70) {
    // 7. Gilded Marble (Altın Damarlı Mermer)
    return {
      id,
      name,
      category: 'Gilded Marble',
      layout: num % 2 === 0 ? 'full-screen' : 'classic-card',
      cardBg: 'gold-border',
      bgTexture: 'marble',
      borderStyle: 'double-gold',
      accentIcon: 'crown',
      textColorMode: 'dark',
    };
  }

  if (num <= 80) {
    // 8. Botanical Line Art (Minimalist Botanik)
    return {
      id,
      name,
      category: 'Botanical Line Art',
      layout: 'minimalist',
      cardBg: 'paper',
      bgTexture: 'none',
      borderStyle: 'none',
      accentIcon: 'leaf',
      textColorMode: 'dark',
    };
  }

  if (num <= 90) {
    // 9. Velvet Night (Mat Siyah Zümrüt)
    return {
      id,
      name,
      category: 'Velvet Night',
      layout: num % 2 === 0 ? 'full-screen' : 'classic-card',
      cardBg: 'dark',
      bgTexture: 'none',
      borderStyle: 'neon',
      accentIcon: 'rings',
      textColorMode: 'light',
    };
  }

  // 10. Boho Sunset (Bohem Günbatımı)
  return {
    id,
    name,
    category: 'Boho Sunset',
    layout: num % 2 === 0 ? 'polaroid' : 'classic-card',
    cardBg: 'paper',
    bgTexture: 'watercolor-pink',
    borderStyle: 'stitch',
    accentIcon: 'leaf',
    textColorMode: 'dark',
  };
};

interface TemplateProps {
  wedding: any;
  templateId: string;
}

export default function PremiumTemplateRenderer({ wedding, templateId }: TemplateProps) {
  const config = getTemplateConfig(templateId);
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [guestMessages, setGuestMessages] = useState<any[]>([]);

  useEffect(() => {
    async function fetchGuestMessages() {
      if (wedding.show_comments !== false) {
        const { data, error } = await supabase
          .from('rsvps')
          .select('guest_name, message, created_at')
          .eq('wedding_id', wedding.id)
          .eq('is_attending', true)
          .not('message', 'is', null)
          .neq('message', '')
          .neq('is_approved', false)
          .order('created_at', { ascending: false });

        if (data && !error) {
          setGuestMessages(data);
        }
      }
    }
    fetchGuestMessages();
  }, [wedding.id, wedding.show_comments]);

  const dateObj = wedding.wedding_date ? new Date(wedding.wedding_date) : new Date();
  const dateStr = dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  const eventTitle = wedding.event_type || 'Düğün Töreni';

  const primaryColor = wedding.primary_color || '#f43f5e';
  const bgType = wedding.background_image_url || config.bgTexture || 'solid-ivory';
  const bgIsLight = isBackgroundLight(bgType);
  const textColor = wedding.text_color || (bgIsLight ? '#1e293b' : '#f8fafc');
  const textIsLight = isColorLight(textColor);

  const handleGuestPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
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
        alert("Fotoğrafınız gelin ve damadın ortak albümüne başarıyla gönderildi! 📸❤️");
      } else {
        alert("Fotoğraf gönderilemedi: " + data.error);
      }
    } catch (err) {
      alert("Yükleme sırasında hata oluştu.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleMapClick = () => {
    if (wedding.google_maps_url) {
      window.open(wedding.google_maps_url, '_blank');
    } else {
      alert("Harita konumu henüz eklenmedi.");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const telegramConfigured = !!wedding.telegram_bot_token && !!wedding.telegram_chat_id;

  // Dynamic Google Font
  const fontFamily = wedding.font_family || 'Montserrat';
  const fontUrl = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, '+')}:ital,wght@0,300;0,400;0,500;0,700;1,300&display=swap`;

  const namesFontFamily = wedding.names_font_family || fontFamily;
  const namesFontUrl = `https://fonts.googleapis.com/css2?family=${namesFontFamily.replace(/ /g, '+')}:ital,wght@0,300;0,400;0,500;0,700;1,300&display=swap`;

  const quoteFontFamily = wedding.quote_font_family || fontFamily;
  const quoteFontUrl = `https://fonts.googleapis.com/css2?family=${quoteFontFamily.replace(/ /g, '+')}:ital,wght@0,300;0,400;0,500;0,700;1,300&display=swap`;

  // Couple names monogram
  const brideInitial = wedding.bride_name ? wedding.bride_name.trim().charAt(0) : 'G';
  const groomInitial = wedding.groom_name ? wedding.groom_name.trim().charAt(0) : 'D';

  // Card Background definitions
  let cardClass = '';
  switch (config.cardBg) {
    case 'glass':
      cardClass = textIsLight ? 'bg-black/40 backdrop-blur-lg border-white/10 shadow-2xl' : 'bg-white/80 backdrop-blur-md border-white/50 shadow-2xl';
      break;
    case 'paper':
      cardClass = 'bg-[#faf9f6] border-[#e6e4dc] shadow-xl relative before:absolute before:inset-0 before:bg-[radial-gradient(#000_1px,transparent_1px)] before:[background-size:16px_16px] before:opacity-[0.015] before:pointer-events-none before:rounded-3xl';
      break;
    case 'dark':
      cardClass = 'bg-slate-900/90 backdrop-blur-md border-slate-800 shadow-2xl';
      break;
    case 'gold-border':
      cardClass = 'bg-white border-[#dfc384] border-[3px] shadow-2xl';
      break;
    case 'floral-frame':
      cardClass = 'bg-white/95 border-rose-100 shadow-2xl relative overflow-hidden';
      break;
    case 'clear':
      cardClass = 'border-transparent shadow-none bg-transparent';
      break;
  }

  // Background Textures
  const bgStyle = getBackgroundStyle(wedding.envelope_bg_color, wedding.background_image_url, primaryColor);

  // Accent SVGs and Icons
  let accentComponent = null;
  const iconStyle = { color: primaryColor, filter: config.textColorMode === 'light' ? `drop-shadow(0 0 8px ${primaryColor})` : 'none' };
  
  switch (config.accentIcon) {
    case 'crown':
      accentComponent = <Crown className="w-8 h-8 mx-auto mb-6 animate-bounce" style={iconStyle} />;
      break;
    case 'heart':
      accentComponent = <Heart className="w-8 h-8 mx-auto mb-6 animate-pulse fill-rose-500/20" style={iconStyle} />;
      break;
    case 'sparkles':
      accentComponent = <Sparkles className="w-8 h-8 mx-auto mb-6 animate-spin" style={iconStyle} />;
      break;
    case 'infinity':
      accentComponent = <Infinity className="w-8 h-8 mx-auto mb-6" style={iconStyle} />;
      break;
    case 'feather':
      accentComponent = <Feather className="w-8 h-8 mx-auto mb-6" style={iconStyle} />;
      break;
    case 'leaf':
      accentComponent = <Leaf className="w-8 h-8 mx-auto mb-6" style={iconStyle} />;
      break;
    case 'rings':
      accentComponent = (
        <svg className="w-12 h-12 mx-auto mb-6" viewBox="0 0 100 60" fill="none" style={iconStyle}>
          <circle cx="35" cy="30" r="22" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="65" cy="30" r="22" stroke="currentColor" strokeWidth="2.5" />
        </svg>
      );
      break;
  }

  // Double border SVG helper
  const renderDoubleGoldBorder = () => (
    <div className="absolute inset-2 border border-double rounded-2xl pointer-events-none z-0 opacity-40 border-[3px]" style={{ borderColor: '#dfc384' }} />
  );

  // Geometric corners deco
  const renderDecoCorners = () => (
    <div className="absolute inset-4 pointer-events-none z-0 opacity-45">
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2" style={{ borderColor: '#dfc384' }} />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2" style={{ borderColor: '#dfc384' }} />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2" style={{ borderColor: '#dfc384' }} />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2" style={{ borderColor: '#dfc384' }} />
    </div>
  );

  // Floral borders SVG helper
  const renderFloralBorder = () => (
    <div className="absolute inset-0 pointer-events-none z-0 opacity-20">
      <div className="absolute top-2 left-2">🌿</div>
      <div className="absolute top-2 right-2 scale-x-[-1]">🌿</div>
      <div className="absolute bottom-2 left-2 scale-y-[-1]">🌿</div>
      <div className="absolute bottom-2 right-2 scale-x-[-1] scale-y-[-1]">🌿</div>
    </div>
  );

  const getNeonShadow = () => {
    if (config.borderStyle !== 'neon') return {};
    return {
      boxShadow: `0 0 20px ${primaryColor}20, inset 0 0 15px ${primaryColor}15`,
      borderColor: `${primaryColor}40`,
      borderWidth: '2px'
    };
  };

  // Shared inner components
  const renderHeader = () => (
    <h3 className="font-semibold tracking-[0.25em] uppercase mb-4 text-xs" style={{ color: primaryColor }}>
      {eventTitle}
    </h3>
  );

  const renderNames = () => (
    <h1 
      className="text-4xl md:text-5xl lg:text-6xl mb-6 mt-4 leading-tight font-normal select-none"
      style={{ color: textColor, fontFamily: `"${namesFontFamily}", cursive, serif` }}
    >
      {wedding.bride_parents && (
        <span 
          className="text-[10px] tracking-[0.25em] uppercase font-light mb-2 block"
          style={{ color: textColor, opacity: 0.6, fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          {wedding.bride_parents}
        </span>
      )}
      <span className="block px-2">
        {wedding.bride_name}
      </span>
      <span className="text-xl my-2 block" style={{ color: primaryColor, fontFamily: 'Inter, system-ui, sans-serif' }}>
        &
      </span>
      <span className="block px-2">
        {wedding.groom_name}
      </span>
      {wedding.groom_parents && (
        <span 
          className="text-[10px] tracking-[0.25em] uppercase font-light mt-2 block"
          style={{ color: textColor, opacity: 0.6, fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          {wedding.groom_parents}
        </span>
      )}
    </h1>
  );

  const renderQuote = () => wedding.custom_message && (
    <p 
      className={`font-light italic mb-8 px-4 leading-relaxed ${wedding.quote_font_size || 'text-sm'}`}
      style={{ 
        color: textColor, 
        opacity: 0.85,
        fontFamily: wedding.quote_font_family ? `"${wedding.quote_font_family}", sans-serif` : undefined
      }}
    >
      "{wedding.custom_message}"
    </p>
  );

  const renderTimer = () => wedding.wedding_date && wedding.show_countdown !== false && (
    <div className="my-6">
      <CountdownTimer 
        targetDate={wedding.wedding_date} 
        primaryColor={primaryColor} 
        styleType={wedding.countdown_style || (config.textColorMode === 'light' ? 'neon' : 'glass')} 
      />
    </div>
  );

  const renderDetails = () => (
    <div className="flex flex-col gap-4 text-sm font-medium mb-10 mt-6 relative z-10 font-sans" style={{ color: textColor }}>
      <div 
        className="flex items-center justify-center gap-3 py-3 px-4 rounded-xl border shadow-sm" 
        style={{ 
          borderColor: `${primaryColor}20`, 
          backgroundColor: textIsLight ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.7)',
          color: textColor
        }}
      >
        <Calendar className="w-4 h-4" style={{ color: primaryColor }} />
        <span>{dateStr} <span className="mx-2" style={{ color: primaryColor }}>|</span> {timeStr}</span>
      </div>

      <div 
        className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border shadow-sm animate-fade-in" 
        style={{ 
          borderColor: `${primaryColor}20`, 
          backgroundColor: textIsLight ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.7)',
          color: textColor
        }}
      >
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" style={{ color: primaryColor }} />
          <span className="font-bold" style={{ color: textColor }}>{wedding.venue_name || 'Mekan Belirtilmedi'}</span>
        </div>
        {wedding.venue_address && (
          <span className="text-xs font-light px-4 opacity-75" style={{ color: textColor }}>{wedding.venue_address}</span>
        )}
        
        {wedding.google_maps_url && (
          <div className="mt-4 w-full flex flex-col gap-2">
            <span className="text-[10px] uppercase tracking-widest opacity-60 text-center mb-1">Yol Tarifi Al</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 px-2 w-full">
              <a 
                href={wedding.google_maps_url} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-[11px] font-bold transition-all hover:scale-102 hover:shadow-xs"
                style={{ 
                  borderColor: `${primaryColor}30`,
                  backgroundColor: textIsLight ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.03)',
                  color: textColor
                }}
              >
                <Navigation className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                <span>Google Harita</span>
              </a>
              <a 
                href={`https://maps.apple.com/?q=${encodeURIComponent(wedding.venue_name || 'Düğün Mekanı')}`} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-[11px] font-bold transition-all hover:scale-102 hover:shadow-xs"
                style={{ 
                  borderColor: `${primaryColor}30`,
                  backgroundColor: textIsLight ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.03)',
                  color: textColor
                }}
              >
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 170 170" fill="currentColor" style={{ color: primaryColor }}>
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.14-1.92-14.38-6.14-3.57-2.92-7.55-7.79-11.96-14.59-4.83-7.58-8.8-16.27-11.92-26.06-3.12-9.79-4.68-19.12-4.68-28 0-14.18 3.86-25.59 11.58-34.25 7.73-8.66 17.2-13 28.43-13 5.46 0 11.39 1.5 17.79 4.49 6.4 2.99 10.97 4.49 13.72 4.49 2.5 0 6.64-1.35 12.42-4.04 5.78-2.69 11.45-3.95 17-3.79 16.2.63 28.53 6.94 36.98 18.91-14.49 8.76-21.57 20.89-21.22 36.4.35 12.16 4.96 22.28 13.84 30.38 8.88 8.1 19.34 12.44 31.42 13.04.47 5 .94 9.5 1.42 13.5zM119.22 19.25c0 7.82-2.8 15.11-8.41 21.88-5.61 6.77-12.63 10.87-21.05 12.29.12-1.3.18-2.6.18-3.9 0-7.39 2.76-14.54 8.27-21.46 5.51-6.92 12.38-11.23 20.61-12.92 0 .5.1.7.1 1.2 0 1.25.1 2.37.3 2.91z"/>
                </svg>
                <span>Apple Harita</span>
              </a>
              <a 
                href={`https://yandex.com.tr/maps/?text=${encodeURIComponent((wedding.venue_name || '') + ' ' + (wedding.venue_address || ''))}`} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-[11px] font-bold transition-all hover:scale-102 hover:shadow-xs"
                style={{ 
                  borderColor: `${primaryColor}30`,
                  backgroundColor: textIsLight ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.03)',
                  color: textColor
                }}
              >
                <span className="text-[13px] font-black italic tracking-tighter shrink-0" style={{ color: primaryColor }}>Y</span>
                <span>Yandex Harita</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderRsvpButton = () => {
    const showRsvp = wedding.show_rsvp !== false;
    const showPhotos = wedding.show_photos !== false;

    // If both RSVP and Photo sharing are disabled, we might only show location, and if not even that, we show nothing.
    return (
      <div className="w-full mt-10 mb-6 flex flex-col items-center gap-6 relative z-10 font-sans">
        {/* LÜTFEN KATILIM DURUMUNUZU BİLDİRİNİZ */}
        {showRsvp && (
          <div 
            className="px-6 py-2.5 rounded-full border text-[11px] font-bold tracking-[0.2em] uppercase max-w-sm text-center select-none"
            style={{ 
              borderColor: `${primaryColor}60`, 
              color: textColor,
              backgroundColor: textIsLight ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'
            }}
          >
            LÜTFEN KATILIM DURUMUNUZU BİLDİRİNİZ
          </div>
        )}

        {/* Buttons Grid */}
        <div className="flex justify-center items-start gap-8 md:gap-12 mt-2">
          {/* Button 1: KONUM */}
          <button 
            onClick={handleMapClick}
            className="flex flex-col items-center gap-2 group transition-transform active:scale-95"
          >
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center border shadow-md bg-white hover:bg-slate-50 transition-colors"
              style={{ borderColor: `${primaryColor}20`, color: primaryColor }}
            >
              <MapPin className="w-6 h-6" />
            </div>
            <span 
              className="text-[10px] font-bold tracking-[0.15em] uppercase opacity-80"
              style={{ color: textColor }}
            >
              KONUM
            </span>
          </button>

          {/* Button 2: LCV/KATILIM */}
          {showRsvp && (
            <button 
              onClick={() => setIsRsvpOpen(true)}
              className="flex flex-col items-center gap-2 group transition-transform active:scale-95"
            >
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: primaryColor }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span 
                className="text-[10px] font-bold tracking-[0.15em] uppercase animate-pulse opacity-80"
                style={{ color: textColor }}
              >
                LCV/KATILIM
              </span>
            </button>
          )}

          {/* Button 3: FOTOĞRAF YÜKLE */}
          {showPhotos && (
            <div className="flex flex-col items-center">
              <input 
                type="file" 
                accept="image/*" 
                id="inline-photo-upload" 
                className="hidden" 
                onChange={handleGuestPhotoUpload} 
                disabled={isUploading}
              />
              <label 
                htmlFor="inline-photo-upload" 
                className="flex flex-col items-center gap-2 group cursor-pointer transition-transform active:scale-95"
              >
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center border shadow-md bg-white hover:bg-slate-50 transition-colors"
                  style={{ borderColor: `${primaryColor}20`, color: primaryColor }}
                >
                  {isUploading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <Camera className="w-6 h-6" />
                  )}
                </div>
                <span 
                  className="text-[10px] font-bold tracking-[0.15em] uppercase text-center max-w-[80px] opacity-80"
                  style={{ color: textColor }}
                >
                  FOTOĞRAF YÜKLE
                </span>
              </label>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Guest Book Section (Anı Defteri)
  const renderGuestBook = () => {
    if (wedding.show_comments === false || guestMessages.length === 0) return null;
    
    return (
      <div className="w-full mt-10 mb-6 relative z-10 font-sans text-left px-2">
        <div className="w-12 h-[1px] bg-rose-300 mx-auto mb-6"></div>
        <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-center mb-6" style={{ color: textColor }}>
          ✍️ ANI DEFTERİ
        </h3>
        
        <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-rose-200">
          {guestMessages.map((msg, idx) => (
            <div 
              key={idx} 
              className="p-4 rounded-2xl border bg-white/50 backdrop-blur-sm shadow-sm transition-all hover:bg-white/70"
              style={{ borderColor: `${primaryColor}20` }}
            >
              <div className="flex justify-between items-center mb-1.5">
                <span className="font-bold text-xs" style={{ color: textColor }}>{msg.guest_name}</span>
                <span className="text-[9px] text-slate-400">
                  {new Date(msg.created_at).toLocaleDateString('tr-TR')}
                </span>
              </div>
              <p className="text-xs italic text-slate-600 leading-relaxed">
                "{msg.message}"
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 1. LAYOUT: CLASSIC CARD (Ortalanmış Kart)
  const renderClassicCardLayout = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 pb-28 relative z-10 w-full">
      <div 
        className={`max-w-[460px] mx-auto w-full rounded-3xl p-8 sm:p-10 text-center relative z-10 border transition-colors ${cardClass} my-8`}
        style={getNeonShadow()}
      >
        {config.borderStyle === 'double-gold' && renderDoubleGoldBorder()}
        {config.borderStyle === 'deco-corners' && renderDecoCorners()}
        {config.borderStyle === 'floral' && renderFloralBorder()}
        {config.borderStyle === 'stitch' && (
          <div className="absolute inset-3 border border-dashed rounded-2xl pointer-events-none z-0 opacity-30" style={{ borderColor: textColor }} />
        )}

        {accentComponent}
        {renderHeader()}
        {renderNames()}
        {renderQuote()}
        {renderTimer()}
        {renderDetails()}
        {renderRsvpButton()}
        {renderGuestBook()}
      </div>
    </div>
  );

  // 2. LAYOUT: SPLIT SCREEN (İkiye Bölünmüş Ekran)
  const renderSplitScreenLayout = () => (
    <div className="min-h-screen flex flex-col lg:flex-row relative z-10 w-full">
      {/* Sol Resim/Tasarım Kolonu */}
      <div 
        className="w-full lg:w-1/2 min-h-[40vh] lg:min-h-screen flex flex-col items-center justify-center p-8 text-center relative overflow-hidden"
        style={{
          backgroundImage: wedding.background_image_url ? `url(${wedding.background_image_url})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: `${primaryColor}15`
        }}
      >
        {wedding.background_image_url && <div className="absolute inset-0 bg-black/30 z-0" />}
        <div className="relative z-10 text-white p-6 backdrop-blur-sm bg-black/20 rounded-2xl border border-white/10 max-w-sm">
          <Crown className="w-10 h-10 mx-auto text-[#dfc384] mb-4" />
          <h1 className="text-4xl md:text-5xl font-normal leading-tight">
            {wedding.bride_name} <span className="block text-2xl my-1 text-[#dfc384]">&</span> {wedding.groom_name}
          </h1>
          <p className="text-xs uppercase tracking-widest text-white/70 mt-3 font-sans">Biz Evleniyoruz</p>
        </div>
      </div>

      {/* Sağ Detaylar Kolonu */}
      <div className="w-full lg:w-1/2 min-h-screen bg-white/95 flex flex-col items-center justify-center p-8 sm:p-12 lg:p-16 pb-28 text-center">
        <div className="max-w-[420px] w-full text-slate-800">
          {accentComponent}
          {renderHeader()}
          {renderQuote()}
          {renderTimer()}
          {renderDetails()}
          {renderRsvpButton()}
          {renderGuestBook()}
        </div>
      </div>
    </div>
  );

  // 3. LAYOUT: FULL SCREEN (Kart Sınırı Olmadan)
  const renderFullScreenLayout = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 sm:p-12 pb-28 text-center relative z-10 w-full max-w-[500px] mx-auto">
      {config.borderStyle === 'deco-corners' && renderDecoCorners()}
      {config.borderStyle === 'double-gold' && (
        <div className="absolute inset-4 border-2 border-double rounded-3xl pointer-events-none z-0 opacity-25" style={{ borderColor: '#dfc384' }} />
      )}
      
      <div className="relative z-10 py-10 w-full">
        {accentComponent}
        {renderHeader()}
        {renderNames()}
        {renderQuote()}
        {renderTimer()}
        {renderDetails()}
        {renderRsvpButton()}
        {renderGuestBook()}
      </div>
    </div>
  );

  // 4. LAYOUT: MINIMALIST (Fashion / Asil Dikey Çizgiler)
  const renderMinimalistLayout = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 sm:p-10 pb-28 text-center relative z-10 w-full max-w-[480px] mx-auto">
      {/* Minimal monogram badge at the top */}
      <div className="border border-slate-300 w-16 h-16 rounded-full flex items-center justify-center mb-8 mx-auto font-serif text-slate-800 text-lg font-light">
        {brideInitial}{groomInitial}
      </div>

      <div className="w-full flex flex-col text-slate-800">
        <span className="text-[10px] tracking-[0.3em] uppercase text-slate-400 font-light mb-4 block font-sans">
          Mektup Davet
        </span>
        
        {renderNames()}
        <div className="w-8 h-[1px] bg-slate-400 mx-auto my-6"></div>
        {renderQuote()}
        {renderTimer()}

        <div className="w-full h-px bg-slate-200 my-8"></div>

        {renderDetails()}
        {renderRsvpButton()}
        {renderGuestBook()}
      </div>
    </div>
  );

  // 5. LAYOUT: POLAROID (Fotoğraf Kartı)
  const renderPolaroidLayout = () => {
    const showPhotos = wedding.show_photos !== false;
    return (
      <div className="min-h-screen flex flex-col items-center p-4 sm:p-8 pb-28 relative z-10 w-full max-w-[480px] mx-auto">
        {/* Polaroid Photo Frame */}
        {showPhotos && (
          <div className="bg-white p-4 sm:p-5 pb-8 sm:pb-12 shadow-2xl rounded-sm border border-slate-200 rotate-1 max-w-[360px] w-full my-8 transform hover:rotate-0 transition-transform duration-300">
            <div 
              className="w-full aspect-square bg-slate-200 rounded-sm mb-4 relative overflow-hidden flex items-center justify-center"
              style={{
                backgroundImage: wedding.background_image_url ? `url(${wedding.background_image_url})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {!wedding.background_image_url && (
                <div className="text-center p-6 text-slate-400">
                  <Heart className="w-12 h-12 mx-auto mb-2 opacity-30 text-rose-400 fill-rose-100" />
                  <span className="text-xs tracking-wider font-sans">Düğün Fotoğrafı</span>
                </div>
              )}
            </div>
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl text-slate-800" style={{ fontFamily: `"${fontFamily}", cursive` }}>
                {wedding.bride_name} & {wedding.groom_name}
              </h2>
              <span className="text-[10px] text-slate-400 tracking-widest block mt-1 font-sans">{dateStr}</span>
            </div>
          </div>
        )}

        {/* Details Box */}
        <div className="w-full bg-white/80 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-200/50 text-center text-slate-800">
          {!showPhotos && (
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl text-slate-800 font-normal tracking-wide" style={{ fontFamily: `"${fontFamily}", sans-serif` }}>
                {wedding.bride_name} & {wedding.groom_name}
              </h2>
              <div className="w-12 h-[1px] bg-rose-300 mx-auto my-4"></div>
              <span className="text-xs text-slate-400 tracking-widest block mt-1 font-sans">{dateStr}</span>
            </div>
          )}
          {renderQuote()}
          {renderTimer()}
          {renderDetails()}
          {renderRsvpButton()}
        </div>
      </div>
    );
  };

  // Route layouts
  let layoutComponent = renderClassicCardLayout();
  switch (config.layout) {
    case 'split-screen':
      layoutComponent = renderSplitScreenLayout();
      break;
    case 'full-screen':
      layoutComponent = renderFullScreenLayout();
      break;
    case 'minimalist':
      layoutComponent = renderMinimalistLayout();
      break;
    case 'polaroid':
      layoutComponent = renderPolaroidLayout();
      break;
  }

  return (
    <div 
      className="min-h-screen w-full relative overflow-x-hidden"
      style={{ ...bgStyle, fontFamily: `"${fontFamily}", sans-serif` }}
    >
      {/* Dynamically inject the stylesheet of selected Google Font */}
      <link href={fontUrl} rel="stylesheet" />
      {wedding.names_font_family && (
        <link href={namesFontUrl} rel="stylesheet" />
      )}
      {wedding.quote_font_family && (
        <link href={quoteFontUrl} rel="stylesheet" />
      )}

      {wedding.background_image_url && config.layout !== 'split-screen' && (
        <div className="absolute inset-0 bg-black/45 z-0 pointer-events-none" />
      )}

      {/* Render selected Layout */}
      {layoutComponent}

      {/* Modals */}
      <RsvpModal 
        weddingId={wedding.id} 
        isOpen={isRsvpOpen} 
        onClose={() => setIsRsvpOpen(false)} 
        primaryColor={primaryColor} 
        brideName={wedding.bride_name}
        groomName={wedding.groom_name}
      />
    </div>
  );
}
