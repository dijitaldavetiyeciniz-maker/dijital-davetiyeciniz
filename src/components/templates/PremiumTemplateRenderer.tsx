'use client';
import { useState } from 'react';
import { 
  Sparkles, Calendar, MapPin, Navigation, 
  Heart, Crown, Feather, Infinity, Leaf 
} from 'lucide-react';
import CountdownTimer from '../CountdownTimer';
import RsvpModal from '../RsvpModal';
import FloatingActionBar from '../FloatingActionBar';
import { isColorLight } from '@/lib/colorUtils';

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

// Generate the 50 unique configurations
const getTemplateConfig = (id: string): TemplateConfig => {
  const num = parseInt(id.replace('template', '')) || 1;
  const name = `Premium Davetiye #${num}`;

  // 1-8: Royal Gold (Lüks & Altın)
  if (num <= 8) {
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

  // 9-16: Watercolor Floral (Suluboya & Çiçekli)
  if (num <= 16) {
    const textures: ('watercolor-pink'|'watercolor-blue'|'watercolor-emerald')[] = [
      'watercolor-pink', 'watercolor-blue', 'watercolor-emerald'
    ];
    return {
      id,
      name,
      category: 'Watercolor Floral',
      layout: num % 2 === 0 ? 'full-screen' : 'classic-card',
      cardBg: 'floral-frame',
      bgTexture: textures[num % textures.length],
      borderStyle: 'floral',
      accentIcon: 'leaf',
      textColorMode: 'dark',
    };
  }

  // 17-24: Minimalist Modern (Sade & Modern)
  if (num <= 24) {
    return {
      id,
      name,
      category: 'Minimalist Modern',
      layout: 'minimalist',
      cardBg: 'clear',
      bgTexture: 'none',
      borderStyle: 'none',
      accentIcon: 'infinity',
      textColorMode: 'dark',
    };
  }

  // 25-32: Galactic Neon (Karanlık Mod & Neon)
  if (num <= 32) {
    const layout = num % 2 === 0 ? 'full-screen' : 'classic-card';
    return {
      id,
      name,
      category: 'Galactic Neon',
      layout,
      cardBg: 'dark',
      bgTexture: 'starry-sky',
      borderStyle: 'neon',
      accentIcon: 'heart',
      textColorMode: 'light',
    };
  }

  // 33-40: Vintage Retro (Vintage & Nostaljik)
  if (num <= 40) {
    const layout = num % 2 === 0 ? 'polaroid' : 'classic-card';
    return {
      id,
      name,
      category: 'Vintage Retro',
      layout,
      cardBg: 'paper',
      bgTexture: 'aged-paper',
      borderStyle: 'stitch',
      accentIcon: 'feather',
      textColorMode: 'dark',
    };
  }

  // 41-50: Art Deco (Sanatsal & Avant-Garde)
  const accents: ('crown'|'sparkles'|'infinity')[] = ['crown', 'sparkles', 'infinity'];
  return {
    id,
    name,
    category: 'Art Deco',
    layout: num % 2 === 0 ? 'split-screen' : 'classic-card',
    cardBg: 'gold-border',
    bgTexture: 'geometric-lines',
    borderStyle: 'deco-corners',
    accentIcon: accents[num % accents.length],
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

  const dateObj = wedding.wedding_date ? new Date(wedding.wedding_date) : new Date();
  const dateStr = dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  const eventTitle = wedding.event_type ? `${wedding.event_type} Töreni` : 'Düğün Töreni';

  const primaryColor = wedding.primary_color || '#f43f5e';
  const textColor = wedding.text_color || (config.textColorMode === 'light' ? '#f8fafc' : '#1e293b');
  const textIsLight = isColorLight(textColor);

  // Set typography based on wedding selection
  // sans: Montserrat, serif: Cormorant Garamond, mono: Great Vibes
  const bodyFontClass = wedding.font_family === 'serif' ? 'font-serif' : 'font-sans';
  const nameFontClass = wedding.font_family === 'mono' ? 'font-mono font-normal tracking-normal' : wedding.font_family === 'serif' ? 'font-serif italic font-medium' : 'font-sans font-extrabold tracking-tight';

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
  let bgStyle: React.CSSProperties = {};
  switch (config.bgTexture) {
    case 'none':
      bgStyle = wedding.background_image_url 
        ? { backgroundImage: `url(${wedding.background_image_url})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }
        : { backgroundColor: `${primaryColor}08` };
      break;
    case 'marble':
      bgStyle = wedding.background_image_url
        ? { backgroundImage: `url(${wedding.background_image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : {
            backgroundColor: '#f5f5f7',
            backgroundImage: 'radial-gradient(circle at 0% 0%, rgba(212,175,55,0.06) 0%, transparent 60%), radial-gradient(circle at 100% 100%, rgba(0,0,0,0.03) 0%, transparent 50%)'
          };
      break;
    case 'watercolor-pink':
      bgStyle = wedding.background_image_url
        ? { backgroundImage: `url(${wedding.background_image_url})`, backgroundSize: 'cover' }
        : { backgroundImage: 'linear-gradient(135deg, #fff5f5 0%, #ffe4e6 50%, #fecdd3 100%)' };
      break;
    case 'watercolor-blue':
      bgStyle = wedding.background_image_url
        ? { backgroundImage: `url(${wedding.background_image_url})`, backgroundSize: 'cover' }
        : { backgroundImage: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)' };
      break;
    case 'watercolor-emerald':
      bgStyle = wedding.background_image_url
        ? { backgroundImage: `url(${wedding.background_image_url})`, backgroundSize: 'cover' }
        : { backgroundImage: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)' };
      break;
    case 'aged-paper':
      bgStyle = {
        backgroundColor: '#faf6eb',
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(139,92,26,0.04) 0%, transparent 100%)'
      };
      break;
    case 'geometric-lines':
      bgStyle = {
        backgroundColor: '#fafafa',
        backgroundImage: `radial-gradient(circle at 100% 150%, transparent 24%, #eedfa9 24%, #eedfa9 28%, transparent 28%, transparent),
                          radial-gradient(circle at 0% 150%, transparent 24%, #eedfa9 24%, #eedfa9 28%, transparent 28%, transparent)`
      };
      break;
    case 'starry-sky':
      bgStyle = {
        background: 'linear-gradient(to bottom, #020617, #0f172a, #1e293b)'
      };
      break;
  }

  // Accent SVGs and Icons
  let accentComponent = null;
  const iconStyle = { color: primaryColor, filter: config.textColorMode === 'light' ? `drop-shadow(0 0 8px ${primaryColor})` : 'none' };
  
  switch (config.accentIcon) {
    case 'crown':
      accentComponent = <Crown className="w-8 h-8 mx-auto mb-6" style={iconStyle} />;
      break;
    case 'heart':
      accentComponent = <Heart className="w-8 h-8 mx-auto mb-6 animate-pulse" style={iconStyle} />;
      break;
    case 'sparkles':
      accentComponent = <Sparkles className="w-8 h-8 mx-auto mb-6" style={iconStyle} />;
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
      <div className="absolute top-2 left-2 rotate-0">🌿</div>
      <div className="absolute top-2 right-2 scale-x-[-1]">🌿</div>
      <div className="absolute bottom-2 left-2 scale-y-[-1]">🌿</div>
      <div className="absolute bottom-2 right-2 scale-x-[-1] scale-y-[-1]">🌿</div>
    </div>
  );

  // Custom Neon box-shadow
  const getNeonShadow = () => {
    if (config.borderStyle !== 'neon') return {};
    return {
      boxShadow: `0 0 20px ${primaryColor}20, inset 0 0 15px ${primaryColor}15`,
      borderColor: `${primaryColor}40`,
      borderWidth: '2px'
    };
  };

  return (
    <div 
      className={`min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 pb-28 ${bodyFontClass} relative overflow-hidden`}
      style={{ ...bgStyle, color: textColor }}
    >
      {/* Background Image dark overlay */}
      {wedding.background_image_url && <div className="absolute inset-0 bg-black/40 z-0" />}

      {/* Main card wrapper */}
      <div 
        className={`max-w-[460px] mx-auto w-full rounded-3xl p-8 sm:p-10 text-center relative z-10 border transition-colors ${cardClass} my-8`}
        style={getNeonShadow()}
      >
        {/* Custom borders */}
        {config.borderStyle === 'double-gold' && renderDoubleGoldBorder()}
        {config.borderStyle === 'deco-corners' && renderDecoCorners()}
        {config.borderStyle === 'floral' && renderFloralBorder()}
        {config.borderStyle === 'stitch' && (
          <div className="absolute inset-3 border border-dashed rounded-2xl pointer-events-none z-0 opacity-30" style={{ borderColor: textColor }} />
        )}

        {/* Decorative Top Accent */}
        {accentComponent}

        {/* Event category header */}
        <h3 className="font-semibold tracking-[0.25em] uppercase mb-4 text-xs" style={{ color: primaryColor }}>
          {eventTitle}
        </h3>

        {/* Couple Names */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl mb-8 mt-6 leading-tight flex flex-col items-center gap-1">
          {wedding.bride_parents && (
            <span className="text-[11px] tracking-[0.2em] uppercase font-light opacity-50 mb-2">
              {wedding.bride_parents}
            </span>
          )}
          <span className={`${nameFontClass} block px-4 py-2`}>
            {wedding.bride_name}
          </span>
          <span className="text-2xl my-1 block" style={{ color: primaryColor }}>
            &
          </span>
          <span className={`${nameFontClass} block px-4 py-2`}>
            {wedding.groom_name}
          </span>
          {wedding.groom_parents && (
            <span className="text-[11px] tracking-[0.2em] uppercase font-light opacity-50 mt-2">
              {wedding.groom_parents}
            </span>
          )}
        </h1>

        {/* Custom Love Quote */}
        {wedding.custom_message && (
          <p className="text-base font-light italic mb-8 px-4 leading-relaxed opacity-85">
            "{wedding.custom_message}"
          </p>
        )}

        {/* Event Countdown */}
        {wedding.wedding_date && (
          <CountdownTimer 
            targetDate={wedding.wedding_date} 
            primaryColor={primaryColor} 
            styleType={config.textColorMode === 'light' ? 'neon' : 'glass'} 
          />
        )}

        {/* Date and Location Details */}
        <div className="flex flex-col gap-4 text-sm font-medium mb-10 mt-8 relative z-10">
          <div 
            className="flex items-center justify-center gap-3 py-3 px-4 rounded-xl border shadow-sm" 
            style={{ 
              borderColor: `${primaryColor}20`, 
              backgroundColor: textIsLight ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.7)' 
            }}
          >
            <Calendar className="w-4 h-4" style={{ color: primaryColor }} />
            <span>{dateStr} <span className="mx-2" style={{ color: primaryColor }}>|</span> {timeStr}</span>
          </div>

          <div 
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border shadow-sm" 
            style={{ 
              borderColor: `${primaryColor}20`, 
              backgroundColor: textIsLight ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.7)' 
            }}
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" style={{ color: primaryColor }} />
              <span className="font-bold">{wedding.venue_name || 'Mekan Belirtilmedi'}</span>
            </div>
            {wedding.venue_address && (
              <span className="text-xs font-light px-4 opacity-75">{wedding.venue_address}</span>
            )}
            
            {wedding.google_maps_url && (
              <a 
                href={wedding.google_maps_url} 
                target="_blank" 
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold hover:underline"
                style={{ color: primaryColor }}
              >
                <Navigation className="w-3.5 h-3.5" />
                Haritada Gör
              </a>
            )}
          </div>
        </div>

        {/* RSVP button */}
        <button 
          onClick={() => setIsRsvpOpen(true)}
          className="w-full px-8 py-3.5 text-white rounded-xl font-bold text-base shadow-lg hover:opacity-90 transition-all hover:-translate-y-0.5 active:translate-y-0 relative z-10"
          style={{ 
            backgroundColor: primaryColor, 
            boxShadow: config.textColorMode === 'light' 
              ? `0 0 15px ${primaryColor}80` 
              : `0 8px 20px -4px ${primaryColor}40` 
          }}
        >
          LCV Formunu Doldur
        </button>
      </div>

      {/* Action Bars and Modals */}
      <FloatingActionBar 
        onRsvpClick={() => setIsRsvpOpen(true)} 
        googleMapsUrl={wedding.google_maps_url} 
        primaryColor={primaryColor} 
        styleType={config.textColorMode === 'light' ? 'neon' : 'orbs'}
      />

      <RsvpModal 
        weddingId={wedding.id} 
        isOpen={isRsvpOpen} 
        onClose={() => setIsRsvpOpen(false)} 
        primaryColor={primaryColor} 
      />
    </div>
  );
}
