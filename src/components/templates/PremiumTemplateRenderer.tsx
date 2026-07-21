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
import { predefinedThemes } from '@/lib/themes';
import BackgroundAnimation from '../BackgroundAnimation';
import { backgroundDesignRegistry } from '@/lib/registries';
import FoldedSealLayout from './layouts/FoldedSealLayout';
import GiantMonogramLayout from './layouts/GiantMonogramLayout';
import PhotoLuxuryLayout from './layouts/PhotoLuxuryLayout';
import BotanicalFrameLayout from './layouts/BotanicalFrameLayout';
import KidsThematicLayout from './layouts/KidsThematicLayout';
import HennaVelvetLayout from './layouts/HennaVelvetLayout';
import RoyalCircumcisionLayout from './layouts/RoyalCircumcisionLayout';

interface TemplateProps {
  wedding: any;
  templateId: string;
  mode?: 'preview' | 'public';
}

export default function PremiumTemplateRenderer({ wedding, templateId, mode = 'public' }: TemplateProps) {
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
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

  const dateObj = (() => {
    if (!wedding.wedding_date) return new Date();
    const d = new Date(wedding.wedding_date);
    return isNaN(d.getTime()) ? new Date() : d;
  })();
  const dateStr = dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  const eventTitle = wedding.event_type || 'Düğün Töreni';

  // Load the concept configuration
  const themeConfig = predefinedThemes.find(t => t.id === templateId) || predefinedThemes[0];
  const palette = themeConfig.palette || {
    background: '#faf7f2',
    card: '#ffffff',
    primary: '#111111',
    secondary: '#d8c7b2',
    accent: '#f5efe8',
    text: '#3f3832',
    mutedText: '#7b7066'
  };

  const isDarkModeActive = !!wedding.is_dark_mode;
  const overrides = wedding.custom_overrides || {};
  const primaryColor = overrides.primary_color || wedding.primary_color || palette.secondary;
  const textColor = isDarkModeActive ? '#f8fafc' : (overrides.text_color || wedding.text_color || palette.text);
  const cardBgColor = isDarkModeActive ? '#12131a' : palette.card;
  const mutedTextColor = isDarkModeActive ? '#94a3b8' : palette.mutedText;

  const bgIsLight = isDarkModeActive ? false : isColorLight(palette.background);
  const textIsLight = isDarkModeActive ? true : isColorLight(textColor);

  const headingFont = overrides.names_font_family || wedding.names_font_family || themeConfig.typography?.heading || 'Playfair Display';
  const bodyFont = overrides.font_family || wedding.font_family || themeConfig.typography?.body || 'Cormorant Garamond';
  const accentFont = themeConfig.typography?.accent || 'Great Vibes';

  const fontUrl = `https://fonts.googleapis.com/css2?family=${bodyFont.replace(/ /g, '+')}:ital,wght@0,300;0,400;0,500;0,700;1,300&display=swap`;
  const namesFontUrl = `https://fonts.googleapis.com/css2?family=${headingFont.replace(/ /g, '+')}:ital,wght@0,300;0,400;0,500;0,700;1,300&display=swap`;
  const accentFontUrl = `https://fonts.googleapis.com/css2?family=${accentFont.replace(/ /g, '+')}&display=swap`;

  const hexToRgba = (hex: string, alpha: number) => {
    let c = hex.replace('#', '');
    if (c.length === 3) {
      c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
    }
    const r = parseInt(c.substring(0, 2), 16) || 255;
    const g = parseInt(c.substring(2, 4), 16) || 255;
    const b = parseInt(c.substring(4, 6), 16) || 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  let cardStyles: React.CSSProperties = {
    borderColor: `${primaryColor}25`,
    fontFamily: `"${bodyFont}", serif`
  };

  const cardBgColorRaw = cardBgColor || '#ffffff';
  const cardOpacity = 0.94;
  const cardRgba = hexToRgba(cardBgColorRaw, cardOpacity);

  const svgNoise = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.055'/%3E%3C/svg%3E`;

  const txtId = overrides.background_design || wedding.background_design || overrides.envelope_bg_color || wedding.envelope_bg_color || themeConfig.visualDetails?.texture || 'minimal-white-paper';
  const registryBg = backgroundDesignRegistry[txtId] || backgroundDesignRegistry['minimal-white-paper'];

  if (isDarkModeActive) {
    cardStyles.backgroundImage = `url("${svgNoise}"), radial-gradient(circle at center, #1b1c22 0%, #0d0d12 100%)`;
    cardStyles.color = '#fff8ec';
    cardStyles.borderColor = 'rgba(214, 168, 79, 0.35)';
  } else {
    cardStyles.backgroundColor = registryBg.fallbackColor;
    cardStyles.backgroundImage = `url("${svgNoise}"), linear-gradient(${cardRgba}, ${cardRgba}), url('${registryBg.image}')`;
    cardStyles.backgroundBlendMode = 'overlay';
    cardStyles.backgroundSize = registryBg.size;
    cardStyles.backgroundPosition = registryBg.position;
    cardStyles.backgroundRepeat = registryBg.repeat;
  }

  const handleGuestPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    if (mode === 'preview') {
      alert("Önizleme Modu: Fotoğraf yükleme simülasyonu başarılı! (Gerçek yükleme için davetiyeyi kaydedip yayındaki sayfadan yükleme yapın.) 📸❤️");
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
    setIsMapModalOpen(true);
  };

  // Dynamically compile paper texture styling
  let backgroundStyles: React.CSSProperties = {
    backgroundColor: isDarkModeActive ? '#090a0f' : registryBg.fallbackColor,
    backgroundImage: wedding.background_image_url 
      ? `url(${wedding.background_image_url})` 
      : `linear-gradient(${registryBg.overlay}, ${registryBg.overlay}), url('${registryBg.image}')`,
    backgroundSize: wedding.background_image_url ? 'cover' : registryBg.size,
    backgroundPosition: wedding.background_image_url ? 'center' : registryBg.position,
    backgroundRepeat: wedding.background_image_url ? 'no-repeat' : registryBg.repeat,
    color: isDarkModeActive ? '#f8fafc' : textColor
  };

  // Get card border styling
  const renderCardBorder = () => {
    const borderType = themeConfig.visualDetails?.border;
    if (borderType === 'gold-thin-frame') {
      return <div className="absolute inset-3 border border-double rounded-2xl pointer-events-none z-0 opacity-60" style={{ borderColor: primaryColor, borderWidth: '2px' }} />;
    } else if (borderType === 'double-gold') {
      return <div className="absolute inset-2 border-4 border-double rounded-[2rem] pointer-events-none z-0 opacity-70" style={{ borderColor: primaryColor }} />;
    } else if (borderType === 'soft-rose-frame') {
      return <div className="absolute inset-4 border rounded-3xl pointer-events-none z-0 opacity-40" style={{ borderColor: `${primaryColor}aa`, borderStyle: 'solid' }} />;
    } else if (borderType === 'minimal-line') {
      return <div className="absolute inset-4 border rounded-none pointer-events-none z-0 opacity-30" style={{ borderColor: `${textColor}40`, borderWidth: '1px' }} />;
    } else if (borderType === 'baroque-pattern') {
      return (
        <div className="absolute inset-4 pointer-events-none z-0 opacity-30">
          <div className="absolute top-0 left-0 w-8 h-8 border-t border-l" style={{ borderColor: primaryColor }} />
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r" style={{ borderColor: primaryColor }} />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l" style={{ borderColor: primaryColor }} />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r" style={{ borderColor: primaryColor }} />
        </div>
      );
    } else if (borderType === 'botanical-frame') {
      return (
        <div className="absolute inset-0 pointer-events-none z-0 opacity-25 text-lg select-none">
          <div className="absolute top-3 left-3">🌿</div>
          <div className="absolute top-3 right-3 scale-x-[-1]">🌿</div>
          <div className="absolute bottom-3 left-3 scale-y-[-1]">🌿</div>
          <div className="absolute bottom-3 right-3 scale-x-[-1] scale-y-[-1]">🌿</div>
        </div>
      );
    } else if (borderType === 'geometric-gold') {
      return (
        <div className="absolute inset-3 border rounded-[2rem] pointer-events-none z-0 opacity-40" style={{ borderColor: primaryColor, borderWidth: '1px' }}>
          <div className="absolute -inset-1 border rounded-[2.1rem]" style={{ borderColor: primaryColor, borderWidth: '0.5px' }} />
        </div>
      );
    } else if (borderType === 'starlight-frame') {
      return (
        <div className="absolute inset-2 rounded-2xl pointer-events-none z-0 opacity-30" style={{ 
          boxShadow: `0 0 15px ${primaryColor}40, inset 0 0 10px ${primaryColor}20`,
          border: `1px solid ${primaryColor}` 
        }} />
      );
    } else if (borderType === 'watercolor-frame') {
      return <div className="absolute inset-4 border border-dashed rounded-3xl pointer-events-none z-0 opacity-40" style={{ borderColor: `${primaryColor}80` }} />;
    } else if (borderType === 'modern-frame') {
      return <div className="absolute inset-3 border-l-2 pointer-events-none z-0 opacity-50" style={{ borderColor: primaryColor }} />;
    }
    return null;
  };

  // Card classes for shapes
  let cardShapeClass = 'rounded-3xl shadow-xl';
  const shape = themeConfig.visualDetails?.cardShape;
  if (shape === 'rounded-luxury') {
    cardShapeClass = 'rounded-[2.2rem] shadow-2xl';
  } else if (shape === 'soft-rounded') {
    cardShapeClass = 'rounded-2xl shadow-lg';
  } else if (shape === 'clean-rectangle') {
    cardShapeClass = 'rounded-none shadow-sm border-y';
  } else if (shape === 'elegant-curve') {
    cardShapeClass = 'rounded-[3rem] shadow-2xl';
  } else if (shape === 'royal-rounded') {
    cardShapeClass = 'rounded-[1.8rem] shadow-xl';
  } else if (shape === 'rough-edges') {
    cardShapeClass = 'rounded-[0.5rem] shadow-md border-dashed';
  }

  // Monogram rendering
  const brideInitial = wedding.bride_name ? wedding.bride_name.trim().charAt(0) : 'E';
  const groomInitial = wedding.groom_name ? wedding.groom_name.trim().charAt(0) : '';

  const renderMonogram = () => (
    <div className="flex flex-col items-center justify-center my-12 opacity-80 text-center select-none z-10 relative">
      <div className="flex items-center justify-center font-serif text-3xl font-light opacity-90" style={{ color: primaryColor }}>
        {groomInitial ? `${brideInitial} & ${groomInitial}` : brideInitial}
      </div>
      <div className="w-16 h-[1px] opacity-35 my-2" style={{ backgroundColor: primaryColor }} />
      <span className="text-[10px] uppercase tracking-[0.25em]" style={{ color: textColor, opacity: 0.6 }}>
        {eventTitle}
      </span>
    </div>
  );

  // Program timeline simulation
  // Program timeline simulation (Disabled per request)
  const renderProgramTimeline = () => {
    return null;
  };

  // Sub-renderers
  const renderHeader = () => (
    <h3 className="font-semibold tracking-[0.25em] uppercase mb-4 text-xs relative z-10" style={{ color: primaryColor }}>
      {eventTitle}
    </h3>
  );

  const renderNames = () => (
    <div className="w-full flex flex-col items-center justify-center" style={{ overflow: 'visible' }}>
      <h1 
        className="text-2xl sm:text-3xl md:text-4xl mb-6 mt-4 font-normal select-none relative z-10 w-full text-center"
        style={{ color: textColor, fontFamily: `"${headingFont}", cursive, serif`, overflow: 'visible', lineHeight: 1.5, whiteSpace: 'nowrap' }}
      >
        {wedding.bride_parents && (
          <span 
            className="text-[10px] tracking-[0.25em] font-light mb-4 block"
            style={{ color: textColor, opacity: 0.6, fontFamily: 'Inter, system-ui, sans-serif', whiteSpace: 'normal' }}
          >
            {wedding.bride_parents}
          </span>
        )}
        <span className="block">
          {wedding.bride_name}
        </span>
      {wedding.groom_name && (
        <>
          <span className="text-sm my-2 block text-center" style={{ color: primaryColor, fontFamily: 'Inter, system-ui, sans-serif' }}>
            &
          </span>
          <span className="block">
            {wedding.groom_name}
          </span>
        </>
      )}
      {wedding.groom_parents && (
        <span 
          className="text-[10px] tracking-[0.25em] font-light mt-3 block text-center"
          style={{ color: textColor, opacity: 0.6, fontFamily: 'Inter, system-ui, sans-serif', whiteSpace: 'normal' }}
        >
          {wedding.groom_parents}
        </span>
      )}
    </h1>
    </div>
  );

  const renderQuote = () => wedding.custom_message && (
    <p 
      className="font-light italic mb-8 px-4 leading-relaxed text-sm relative z-10"
      style={{ 
        color: textColor, 
        opacity: 0.9,
        fontFamily: `"${bodyFont}", serif`
      }}
    >
      "{wedding.custom_message}"
    </p>
  );

  const renderTimer = () => wedding.wedding_date && wedding.show_countdown !== false && (
    <div className="my-6 relative z-10">
      <CountdownTimer 
        targetDate={wedding.wedding_date} 
        primaryColor={primaryColor} 
        styleType={wedding.countdown_style || 'glass'} 
      />
    </div>
  );

  const renderDetails = () => (
    <div className="flex flex-col gap-4 text-sm font-medium mb-10 mt-6 relative z-10 font-sans" style={{ color: textColor }}>
      <div 
        className="flex items-center justify-center gap-3 py-3 px-4 rounded-xl border shadow-xs" 
        style={{ 
          borderColor: `${primaryColor}20`, 
          backgroundColor: textIsLight ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.7)',
          color: textColor
        }}
      >
        <Calendar className="w-4 h-4" style={{ color: primaryColor }} />
        <span suppressHydrationWarning>{dateStr} <span className="mx-2" style={{ color: primaryColor }}>|</span> {timeStr}</span>
      </div>

      <div 
        className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border shadow-xs" 
        style={{ 
          borderColor: `${primaryColor}20`, 
          backgroundColor: textIsLight ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.7)',
          color: textColor
        }}
      >
        <div className="flex items-center justify-center gap-2">
          <MapPin className="w-4 h-4 shrink-0" style={{ color: primaryColor }} />
          <span className="font-bold" style={{ color: textColor }}>{wedding.venue_name || 'Mekan Belirtilmedi'}</span>
        </div>
        {wedding.venue_address && (
          <span className="text-xs font-light px-4 opacity-80" style={{ color: textColor }}>{wedding.venue_address}</span>
        )}
      </div>
    </div>
  );

  const renderRsvpButton = () => {
    const showRsvp = wedding.show_rsvp !== false;
    const showPhotos = wedding.show_photos !== false;

    return (
      <div className="w-full mt-10 mb-6 flex flex-col items-center gap-6 relative z-10 font-sans">
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
            className="flex flex-col items-center gap-2 group transition-transform active:scale-95 cursor-pointer"
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
              className="flex flex-col items-center gap-2 group transition-transform active:scale-95 cursor-pointer"
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
                className="text-[10px] font-bold tracking-[0.15em] uppercase opacity-80"
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
        <div className="w-12 h-[1px] bg-slate-200 mx-auto mb-6"></div>
        <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-center mb-6" style={{ color: textColor }}>
          ✍️ ANI DEFTERİ
        </h3>
        
        <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
          {guestMessages.map((msg, idx) => (
            <div 
              key={idx} 
              className="p-4 rounded-2xl border bg-white/40 backdrop-blur-sm shadow-2xs transition-all hover:bg-white/60"
              style={{ borderColor: `${primaryColor}20` }}
            >
              <div className="flex justify-between items-center mb-1.5">
                <span className="font-bold text-xs" style={{ color: textColor }}>{msg.guest_name}</span>
                <span className="text-[9px] opacity-50" style={{ color: textColor }}>
                  {(() => {
                    const d = new Date(msg.created_at);
                    return isNaN(d.getTime()) ? '' : d.toLocaleDateString('tr-TR');
                  })()}
                </span>
              </div>
              <p className="text-xs italic leading-relaxed opacity-95" style={{ color: textColor }}>
                "{msg.message}"
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMonogramDivider = () => {
    return (
      <div className="flex items-center justify-center space-x-3 my-4 relative z-10 opacity-80">
        <div className="w-12 h-[1px]" style={{ backgroundColor: primaryColor }}></div>
        <div className="text-sm font-serif italic" style={{ color: primaryColor }}>&</div>
        <div className="w-12 h-[1px]" style={{ backgroundColor: primaryColor }}></div>
      </div>
    );
  };

  const renderContextualDecorations = () => {
    const eventTypeStr = eventTitle.toLowerCase();
    const isSunnet = eventTypeStr.includes('sünnet');
    const isKina = eventTypeStr.includes('kına') || eventTypeStr.includes('henna');
    const isBaby = eventTypeStr.includes('baby') || eventTypeStr.includes('doğum') || eventTypeStr.includes('yaş');

    if (isSunnet) {
      return (
        <div className="absolute top-0 left-0 w-full flex justify-center -mt-8 z-20 pointer-events-none">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg border-2" style={{ borderColor: primaryColor }}>
            <span className="text-3xl">🧿</span>
          </div>
        </div>
      );
    }
    
    if (isKina) {
      return (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-10">
          <svg className="absolute -top-16 -left-16 w-64 h-64" viewBox="0 0 200 200" fill={primaryColor}>
            <path d="M100,0 C120,40 160,40 200,60 C160,80 160,120 140,160 C100,180 60,180 0,200 C40,160 40,120 20,80 C60,60 60,20 100,0 Z" />
          </svg>
          <svg className="absolute -bottom-16 -right-16 w-64 h-64" viewBox="0 0 200 200" fill={primaryColor}>
            <path d="M100,0 C120,40 160,40 200,60 C160,80 160,120 140,160 C100,180 60,180 0,200 C40,160 40,120 20,80 C60,60 60,20 100,0 Z" />
          </svg>
        </div>
      );
    }
    
    if (isBaby) {
      return (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-30 text-4xl">
          <div className="absolute top-10 left-10 animate-pulse">☁️</div>
          <div className="absolute top-40 right-10 text-2xl animate-bounce">⭐</div>
          <div className="absolute bottom-20 left-20 text-3xl">🧸</div>
        </div>
      );
    }
    
    return null;
  };



  const renderMonogramLayout = () => (
    <div className={`max-w-[500px] mx-auto w-full p-8 sm:p-12 text-center relative z-10 border shadow-2xl my-8 flex flex-col items-center ${cardShapeClass}`} style={{ ...cardStyles, overflow: 'visible' }}>
      {renderContextualDecorations()}
      {renderCardBorder()}
      <div className="mb-4 z-10 text-4xl font-light italic" style={{ color: primaryColor, fontFamily: `"${headingFont}", serif` }}>
        {groomInitial ? `${brideInitial}&${groomInitial}` : brideInitial}
      </div>
      <div className="w-16 h-[1px] my-6 opacity-50" style={{ backgroundColor: primaryColor }} />
      {renderHeader()}
      {renderNames()}
      {renderQuote()}
      {renderTimer()}
      {renderDetails()}
      {renderProgramTimeline()}
      {renderRsvpButton()}
      {renderGuestBook()}
    </div>
  );

  const renderAsymmetricLayout = () => (
    <div className={`max-w-[500px] mx-auto w-full p-8 sm:p-12 text-left relative z-10 border shadow-2xl my-8 flex flex-col ${cardShapeClass}`} style={{ ...cardStyles, overflow: 'visible' }}>
      {renderContextualDecorations()}
      {renderCardBorder()}
      <div className="w-full flex justify-between items-start mb-12 relative z-10">
        <div>
          <h3 className="font-semibold tracking-[0.2em] uppercase text-xs opacity-70" style={{ color: textColor }}>{eventTitle}</h3>
          <div className="w-8 h-[2px] my-3" style={{ backgroundColor: primaryColor }} />
        </div>
        <div className="text-right border px-4 py-2 rounded-t-full" style={{ borderColor: `${primaryColor}40` }}>
          <div className="text-3xl font-light" style={{ color: primaryColor, fontFamily: `"${headingFont}", serif` }}>
            {dateObj.getDate()}
          </div>
          <div className="text-[10px] uppercase tracking-widest opacity-70 font-semibold" style={{ color: textColor }}>
            {dateObj.toLocaleDateString('tr-TR', { month: 'short' })}
          </div>
        </div>
      </div>
      
      <div className="relative z-10 mb-8 mt-4 w-full flex flex-col items-center" style={{ overflow: 'visible' }}>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-normal w-full text-center" style={{ color: textColor, fontFamily: `"${headingFont}", serif`, overflow: 'visible', lineHeight: 1.5, whiteSpace: 'nowrap' }}>
          {wedding.bride_name}
        </h1>
        {wedding.groom_name && (
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-normal mt-2 w-full text-center" style={{ color: textColor, fontFamily: `"${headingFont}", serif`, overflow: 'visible', lineHeight: 1.5, whiteSpace: 'nowrap' }}>
            <span className="text-sm mr-2 opacity-50" style={{ color: primaryColor, fontFamily: 'sans-serif' }}>&</span>
            {wedding.groom_name}
          </h1>
        )}
      </div>
      
      {renderQuote()}
      {renderTimer()}
      
      <div className="mt-8 pt-8 border-t relative z-10" style={{ borderColor: `${primaryColor}40` }}>
        {renderDetails()}
      </div>
      {renderRsvpButton()}
      {renderGuestBook()}
    </div>
  );

  const renderEditorialLayout = () => (
    <div className="max-w-[600px] mx-auto w-full py-16 px-4 sm:px-8 text-center relative z-10 flex flex-col items-center bg-white shadow-xl my-8">
      {renderContextualDecorations()}
      
      <div className="w-full text-center border-b pb-4 mb-10" style={{ borderColor: `${primaryColor}30` }}>
        <h3 className="font-bold tracking-[0.3em] uppercase text-[10px]" style={{ color: textColor }}>{eventTitle}</h3>
        <div className="text-xs tracking-[0.2em] uppercase mt-2 opacity-60" style={{ color: textColor }}>
          VOL I. — {dateObj.getFullYear()}
        </div>
      </div>
      
      <div className="w-full mb-12 text-center" style={{ overflow: 'visible' }}>
        <h1 className="text-3xl sm:text-4xl md:text-5xl leading-tight font-black uppercase tracking-tight" style={{ color: textColor, fontFamily: `"${headingFont}", sans-serif`, overflow: 'visible', whiteSpace: 'nowrap' }}>
          {wedding.bride_name}
          {wedding.groom_name && (
            <>
              <br/>
              <span className="text-lg my-2 block opacity-40 lowercase font-light italic" style={{ fontFamily: `"${accentFont}", serif`, whiteSpace: 'nowrap' }}>and</span>
              {wedding.groom_name}
            </>
          )}
        </h1>
      </div>
      
      <div className="w-full border p-6 my-8 text-left" style={{ borderColor: `${primaryColor}20`, backgroundColor: `rgba(0,0,0,0.02)` }}>
        <div className="flex items-center gap-4 mb-4">
          <div className="text-4xl font-light" style={{ color: primaryColor }}>{dateObj.getDate()}</div>
          <div>
            <div className="text-xs font-bold uppercase tracking-widest" style={{ color: textColor }}>{dateObj.toLocaleDateString('tr-TR', { month: 'long' })}</div>
            <div className="text-xs opacity-60" style={{ color: textColor }}>{dateObj.getFullYear()}</div>
          </div>
        </div>
        {renderQuote()}
      </div>

      {renderTimer()}
      {renderDetails()}
      {renderRsvpButton()}
      {renderGuestBook()}
    </div>
  );

  const renderOrientalLayout = () => (
    <div className={`max-w-[500px] mx-auto w-full p-6 sm:p-10 text-center relative z-10 border shadow-2xl my-8 flex flex-col items-center ${cardShapeClass}`} style={{ ...cardStyles, overflow: 'visible' }}>
      {renderContextualDecorations()}
      {renderCardBorder()}
      
      <div className="w-full max-w-[320px] aspect-square mx-auto rounded-t-full border-2 flex flex-col items-center justify-center relative z-10 mb-10 p-6 shadow-inner" style={{ borderColor: `${primaryColor}80`, backgroundColor: `rgba(0,0,0,0.05)` }}>
        <div className="absolute inset-2 rounded-t-full border border-dashed opacity-50" style={{ borderColor: primaryColor }} />
        <div className="scale-90 flex flex-col items-center w-full text-center" style={{ overflow: 'visible' }}>
          {renderHeader()}
          <h1 className="text-xl sm:text-2xl font-normal mt-4 w-full text-center" style={{ color: textColor, fontFamily: `"${headingFont}", serif`, overflow: 'visible', lineHeight: 1.5, whiteSpace: 'nowrap' }}>
            {wedding.bride_name}
          </h1>
          {wedding.groom_name && (
            <>
              <span className="text-base my-2 opacity-80 block" style={{ color: primaryColor, fontFamily: `"${accentFont}", cursive` }}>and</span>
              <h1 className="text-xl sm:text-2xl font-normal w-full text-center" style={{ color: textColor, fontFamily: `"${headingFont}", serif`, overflow: 'visible', lineHeight: 1.5, whiteSpace: 'nowrap' }}>
                {wedding.groom_name}
              </h1>
            </>
          )}
        </div>
      </div>

      {renderQuote()}
      {renderTimer()}
      
      <div className="w-full rounded-2xl p-6 relative z-10 border" style={{ borderColor: `${primaryColor}30`, backgroundColor: `rgba(0,0,0,0.02)` }}>
        <div className="text-2xl mb-4 font-light italic" style={{ color: primaryColor, fontFamily: `"${headingFont}", serif` }}>{dateStr}</div>
        {renderDetails()}
      </div>
      
      {renderRsvpButton()}
      {renderGuestBook()}
    </div>
  );

  const renderFullBleedLayout = () => (
    <div className="w-full min-h-screen py-20 px-4 sm:px-8 text-center relative z-10 flex flex-col items-center justify-center">
      {renderContextualDecorations()}
      
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center w-full" style={{ overflow: 'visible' }}>
        {renderHeader()}
        
        <h1 className="text-2xl sm:text-3xl md:text-4xl my-12 font-normal w-full text-center" style={{ color: textColor, fontFamily: `"${headingFont}", serif`, overflow: 'visible', lineHeight: 1.5, whiteSpace: 'nowrap' }}>
          {wedding.bride_name}
          {wedding.groom_name && (
            <>
              <span className="text-base opacity-50 font-sans mx-2" style={{ color: primaryColor }}>x</span>
              {wedding.groom_name}
            </>
          )}
        </h1>
        
        <div className="w-24 h-[2px] mx-auto my-10" style={{ backgroundColor: primaryColor }} />
        
        <div className="text-xl md:text-2xl font-light tracking-widest mb-12 uppercase" style={{ color: textColor }}>
          {dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>

        {renderQuote()}
        {renderTimer()}
        <div className="w-full max-w-md mx-auto mt-8">
          {renderDetails()}
        </div>
        {renderRsvpButton()}
        {renderGuestBook()}
      </div>
    </div>
  );

  const renderLayout = () => {
    const layoutStyle = themeConfig.layoutStyle || 'monogram';
    switch (layoutStyle) {
      case 'asymmetric': return renderAsymmetricLayout();
      case 'full-bleed': return renderFullBleedLayout();
      case 'editorial': return renderEditorialLayout();
      case 'oriental': return renderOrientalLayout();
      case 'folded-seal':
        return (
          <FoldedSealLayout 
            wedding={wedding}
            primaryColor={primaryColor}
            textColor={textColor}
            headingFont={headingFont}
            bodyFont={bodyFont}
            accentFont={accentFont}
            dateObj={dateObj}
            dateStr={dateStr}
            timeStr={timeStr}
            eventTitle={eventTitle}
            renderTimer={renderTimer}
            renderRsvpButton={renderRsvpButton}
            renderGuestBook={renderGuestBook}
            renderQuote={renderQuote}
            handleMapClick={handleMapClick}
            cardBgColor={cardBgColor}
          />
        );
      case 'monogram-media':
        return (
          <GiantMonogramLayout 
            wedding={wedding}
            primaryColor={primaryColor}
            textColor={textColor}
            headingFont={headingFont}
            bodyFont={bodyFont}
            accentFont={accentFont}
            dateObj={dateObj}
            dateStr={dateStr}
            timeStr={timeStr}
            eventTitle={eventTitle}
            renderTimer={renderTimer}
            renderRsvpButton={renderRsvpButton}
            renderGuestBook={renderGuestBook}
            renderQuote={renderQuote}
            handleMapClick={handleMapClick}
            cardBgColor={cardBgColor}
            mode={mode}
          />
        );
      case 'photo-luxury':
        return (
          <PhotoLuxuryLayout 
            wedding={wedding}
            primaryColor={primaryColor}
            textColor={textColor}
            headingFont={headingFont}
            bodyFont={bodyFont}
            accentFont={accentFont}
            dateObj={dateObj}
            dateStr={dateStr}
            timeStr={timeStr}
            eventTitle={eventTitle}
            renderTimer={renderTimer}
            renderRsvpButton={renderRsvpButton}
            renderGuestBook={renderGuestBook}
            renderQuote={renderQuote}
            handleMapClick={handleMapClick}
            cardBgColor={cardBgColor}
            mode={mode}
          />
        );
      case 'botanical-frame':
        return (
          <BotanicalFrameLayout 
            wedding={wedding}
            primaryColor={primaryColor}
            textColor={textColor}
            headingFont={headingFont}
            bodyFont={bodyFont}
            accentFont={accentFont}
            dateObj={dateObj}
            dateStr={dateStr}
            timeStr={timeStr}
            eventTitle={eventTitle}
            renderTimer={renderTimer}
            renderRsvpButton={renderRsvpButton}
            renderGuestBook={renderGuestBook}
            renderQuote={renderQuote}
            handleMapClick={handleMapClick}
            cardBgColor={cardBgColor}
            mode={mode}
          />
        );
      case 'kids-thematic':
        return (
          <KidsThematicLayout 
            wedding={wedding}
            primaryColor={primaryColor}
            textColor={textColor}
            headingFont={headingFont}
            bodyFont={bodyFont}
            accentFont={accentFont}
            dateObj={dateObj}
            dateStr={dateStr}
            timeStr={timeStr}
            eventTitle={eventTitle}
            renderTimer={renderTimer}
            renderRsvpButton={renderRsvpButton}
            renderGuestBook={renderGuestBook}
            renderQuote={renderQuote}
            handleMapClick={handleMapClick}
            cardBgColor={cardBgColor}
            mode={mode}
          />
        );
      case 'henna-velvet':
        return (
          <HennaVelvetLayout 
            wedding={wedding}
            primaryColor={primaryColor}
            textColor={textColor}
            headingFont={headingFont}
            bodyFont={bodyFont}
            accentFont={accentFont}
            dateObj={dateObj}
            dateStr={dateStr}
            timeStr={timeStr}
            eventTitle={eventTitle}
            renderTimer={renderTimer}
            renderRsvpButton={renderRsvpButton}
            renderGuestBook={renderGuestBook}
            renderQuote={renderQuote}
            handleMapClick={handleMapClick}
            cardBgColor={cardBgColor}
            mode={mode}
          />
        );
      case 'royal-circumcision':
        return (
          <RoyalCircumcisionLayout 
            wedding={wedding}
            primaryColor={primaryColor}
            textColor={textColor}
            headingFont={headingFont}
            bodyFont={bodyFont}
            accentFont={accentFont}
            dateObj={dateObj}
            dateStr={dateStr}
            timeStr={timeStr}
            eventTitle={eventTitle}
            renderTimer={renderTimer}
            renderRsvpButton={renderRsvpButton}
            renderGuestBook={renderGuestBook}
            renderQuote={renderQuote}
            handleMapClick={handleMapClick}
            cardBgColor={cardBgColor}
            mode={mode}
          />
        );
      case 'monogram':
      default:
        return renderMonogramLayout();
    }
  };

  // Render the core layout

  const backgroundDesign = overrides.background_design || wedding.background_design || overrides.envelope_bg_color || wedding.envelope_bg_color || "rose-gold-silk";

  return (
    <div 
      className={`min-h-screen w-full relative flex flex-col items-center justify-center p-4 sm:p-6 pb-28 invitation-page bg-design-${backgroundDesign} ${isDarkModeActive ? 'dark-mode' : ''}`}
      style={{ ...backgroundStyles, overflowX: 'clip' }}
    >
      <BackgroundAnimation type={overrides.background_animation || wedding.background_animation} />
      <link href={fontUrl} rel="stylesheet" />
      <link href={namesFontUrl} rel="stylesheet" />
      <link href={accentFontUrl} rel="stylesheet" />

      {wedding.background_image_url && (
        <div className="absolute inset-0 bg-black/45 z-0 pointer-events-none" />
      )}

      {/* Main Premium Invitation Card Box */}
      {renderLayout()}

      {/* RSVP Modal */}
      <RsvpModal 
        weddingId={wedding.id} 
        isOpen={isRsvpOpen} 
        onClose={() => setIsRsvpOpen(false)} 
        primaryColor={primaryColor} 
        brideName={wedding.bride_name}
        groomName={wedding.groom_name}
        mode={mode}
      />

      {/* Travel directions Yandex/Google Maps Dialog */}
      {isMapModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-sans">
          <div 
            className="w-full max-w-sm rounded-3xl p-6 relative border shadow-2xl transition-all scale-up bg-white text-slate-800"
            style={{ 
              borderColor: `${primaryColor}30`,
              backgroundColor: cardBgColor || '#ffffff',
              color: textColor
            }}
          >
            <button 
              type="button"
              onClick={() => setIsMapModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <h3 className="font-serif font-bold text-lg mb-2 text-center" style={{ color: textColor }}>🗺️ Yol Tarifi Al</h3>
            <p className="text-xs text-slate-500 text-center mb-6">Lütfen yol tarifi almak istediğiniz harita uygulamasını seçin.</p>

            <div className="flex flex-col gap-3">
              {wedding.google_maps_url && (
                <a 
                  href={wedding.google_maps_url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-2xl border text-sm font-bold transition-all hover:scale-102 hover:shadow-xs active:scale-98"
                  style={{ 
                    borderColor: `${primaryColor}20`,
                    backgroundColor: 'rgba(0,0,0,0.02)',
                    color: textColor
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Navigation className="w-4 h-4" style={{ color: primaryColor }} />
                    <span>Google Haritalar</span>
                  </div>
                  <span className="text-xs opacity-50">&rarr;</span>
                </a>
              )}

              <a 
                href={`https://maps.apple.com/?q=${encodeURIComponent(wedding.venue_name || 'Düğün Mekanı')}`} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between p-3.5 rounded-2xl border text-sm font-bold transition-all hover:scale-102 hover:shadow-xs active:scale-98"
                style={{ 
                  borderColor: `${primaryColor}20`,
                  backgroundColor: 'rgba(0,0,0,0.02)',
                  color: textColor
                }}
              >
                <div className="flex items-center gap-3">
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 170 170" fill="currentColor" style={{ color: primaryColor }}>
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.14-1.92-14.38-6.14-3.57-2.92-7.55-7.79-11.96-14.59-4.83-7.58-8.8-16.27-11.92-26.06-3.12-9.79-4.68-19.12-4.68-28 0-14.18 3.86-25.59 11.58-34.25 7.73-8.66 17.2-13 28.43-13 5.46 0 11.39 1.5 17.79 4.49 6.4 2.99 10.97 4.49 13.72 4.49 2.5 0 6.64-1.35 12.42-4.04 5.78-2.69 11.45-3.95 17-3.79 16.2.63 28.53 6.94 36.98 18.91-14.49 8.76-21.57 20.89-21.22 36.4.35 12.16 4.96 22.28 13.84 30.38 8.88 8.1 19.34 12.44 31.42 13.04.47 5 .94 9.5 1.42 13.5zM119.22 19.25c0 7.82-2.8 15.11-8.41 21.88-5.61 6.77-12.63 10.87-21.05 12.29.12-1.3.18-2.6.18-3.9 0-7.39 2.76-14.54 8.27-21.46 5.51-6.92 12.38-11.23 20.61-12.92 0 .5.1.7.1 1.2 0 1.25.1 2.37.3 2.91z"/>
                  </svg>
                  <span>Apple Haritalar</span>
                </div>
                <span className="text-xs opacity-50">&rarr;</span>
              </a>

              <a 
                href={`https://yandex.com.tr/maps/?text=${encodeURIComponent((wedding.venue_name || '') + ' ' + (wedding.venue_address || ''))}`} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between p-3.5 rounded-2xl border text-sm font-bold transition-all hover:scale-102 hover:shadow-xs active:scale-98"
                style={{ 
                  borderColor: `${primaryColor}20`,
                  backgroundColor: 'rgba(0,0,0,0.02)',
                  color: textColor
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[13px] font-black italic tracking-tighter shrink-0" style={{ color: primaryColor }}>Y</span>
                  <span>Yandex Haritalar</span>
                </div>
                <span className="text-xs opacity-50">&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
