'use client';
import React from 'react';
import { Calendar, MapPin, Navigation, Leaf, Flower2, Sparkles } from 'lucide-react';
import { getReadableTextColor, WCAG_MIN_RATIO, checkTemplateContrast } from '@/lib/colorUtils';
import SafeImage from '@/components/ui/SafeImage';

interface LayoutProps {
  selectedBackground?: any;
  wedding: any;
  primaryColor: string;
  textColor: string;
  headingFont: string;
  bodyFont: string;
  accentFont: string;
  dateObj: Date;
  dateStr: string;
  timeStr: string;
  eventTitle: string;
  renderTimer: () => React.ReactNode;
  renderRsvpButton: () => React.ReactNode;
  renderGuestBook: () => React.ReactNode;
  renderQuote: () => React.ReactNode;
  handleMapClick: () => void;
  cardBgColor?: string;
  mode?: 'preview' | 'public';
}

export default function BotanicalCeramicLayout({
  wedding,
  primaryColor,
  textColor,
  headingFont,
  bodyFont,
  accentFont,
  dateObj,
  dateStr,
  timeStr,
  eventTitle,
  renderTimer,
  renderRsvpButton,
  renderGuestBook,
  renderQuote,
  handleMapClick,
  cardBgColor = '#fdfbf7',
  mode = 'public'
, selectedBackground}: LayoutProps) {
  const overrides = wedding.custom_overrides || {};
  const focalX = overrides.photoFocalPoint?.x ?? wedding.photo_focal_point?.x ?? 50;
  const focalY = overrides.photoFocalPoint?.y ?? wedding.photo_focal_point?.y ?? 50;
  const objectPosition = `${focalX}% ${focalY}%`;

  const couplePhoto = wedding.bride_photo_url || wedding.groom_photo_url || wedding.background_image_url || '';

  const mainBg = cardBgColor || '#fdfbf7';
  const computedTextColor = getReadableTextColor(mainBg, textColor || '#2f4f4f', '#1a2e2e');
  const accentColor = primaryColor || '#698B69';

  checkTemplateContrast('botanical-ceramic', 'Main Title', accentColor, mainBg, WCAG_MIN_RATIO.LARGE_HEADING);

  const hasMaps = !!wedding.google_maps_url;
  const showRsvp = wedding.show_rsvp !== false;

  return (
    <div 
      className="min-h-screen w-full flex flex-col lg:flex-row relative z-10 animate-fade-in"
      style={{ ...(selectedBackground?.background ? { background: selectedBackground.background } : {}), fontFamily: `"${bodyFont}", sans-serif`, backgroundColor: mainBg, color: computedTextColor }}
      data-testid="layout-botanical-ceramic"
    >
      {/* Left Column: Botanical & Image */}
      <div className="w-full lg:w-1/2 relative min-h-[50vh] lg:min-h-screen flex items-center justify-center p-6 lg:p-12 overflow-hidden bg-[#f4f1eb]">
        {/* Ceramic/Tile subtle background pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm20 20h20v20H20V20zM0 20h20v20H0V20z' fill='%23000' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px'
          }}
        />
        
        {/* Decorative Floral Accents */}
        <Leaf className="absolute top-8 left-8 w-12 h-12 opacity-10" style={{ color: accentColor }} />
        <Flower2 className="absolute bottom-8 right-8 w-16 h-16 opacity-10" style={{ color: accentColor }} />
        <Leaf className="absolute top-1/4 right-4 w-8 h-8 opacity-10 -scale-x-100 rotate-45" style={{ color: accentColor }} />

        {/* Arch Photo Container */}
        <div className="relative w-full max-w-md aspect-[3/4] z-10">
          <div className="absolute inset-0 border-[1px] border-solid rounded-t-full rounded-b-3xl translate-x-3 translate-y-3 opacity-30" style={{ borderColor: accentColor }} />
          <div className="absolute inset-0 border-[1px] border-solid rounded-t-full rounded-b-3xl -translate-x-3 -translate-y-3 opacity-30" style={{ borderColor: accentColor }} />
          
          <div className="w-full h-full rounded-t-full rounded-b-3xl overflow-hidden relative shadow-2xl bg-white/50 backdrop-blur-sm border-4 border-white">
            {couplePhoto ? (
              <SafeImage 
                src={couplePhoto} 
                alt="Couple"
                className="w-full h-full object-cover"
                style={{ objectPosition }}
                isHero={true}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-black/5 text-center relative">
                <Flower2 className="w-16 h-16 opacity-20 mb-4" style={{ color: accentColor }} />
                <span className="text-2xl font-serif opacity-40" style={{ fontFamily: `"${headingFont}", serif` }}>
                  Görsel Bekleniyor
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Details & Typography */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-16 xl:p-24 bg-[#fdfbf7] relative">
        <div className="max-w-xl w-full flex flex-col items-center text-center space-y-10 relative z-10">
          
          {/* Header */}
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-[0.3em] opacity-60 font-semibold" style={{ color: accentColor }}>
              {eventTitle}
            </span>
            <div className="flex justify-center mb-6">
              <Leaf className="w-5 h-5 opacity-40" style={{ color: accentColor }} />
            </div>
            
            <h1 
              className="text-5xl lg:text-7xl font-medium leading-tight"
              style={{ fontFamily: `"${headingFont}", serif`, color: accentColor }}
            >
              {wedding.bride_name} <br/> 
              <span className="italic opacity-70 text-4xl lg:text-6xl">&amp;</span> <br/> 
              {wedding.groom_name}
            </h1>
          </div>

          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-current to-transparent opacity-20" />

          {/* Quote */}
          <div className="text-sm lg:text-base leading-relaxed italic opacity-80 px-4" style={{ fontFamily: `"${accentFont}", serif` }}>
            {renderQuote()}
          </div>

          {/* Date & Time */}
          <div className="space-y-4">
            <div className="text-xl lg:text-2xl font-medium tracking-wide uppercase" style={{ color: accentColor }}>
              {dateStr}
            </div>
            <div className="flex items-center justify-center gap-2 text-sm opacity-70 font-medium tracking-widest uppercase">
              <Calendar className="w-4 h-4" />
              <span>{timeStr}</span>
            </div>
          </div>

          {/* Location */}
          <div className="bg-black/5 rounded-2xl p-6 lg:p-8 w-full backdrop-blur-sm border border-black/5">
            <div className="flex items-center justify-center gap-2 mb-3" style={{ color: accentColor }}>
              <MapPin className="w-5 h-5" />
              <span className="font-semibold tracking-wider uppercase text-sm">{wedding.venue_name || 'Mekan Belirtilmedi'}</span>
            </div>
            {wedding.venue_address && (
              <p className="text-sm opacity-75 max-w-md mx-auto leading-relaxed">{wedding.venue_address}</p>
            )}
            
            {hasMaps && (
              <button 
                type="button"
                onClick={handleMapClick}
                className="mt-6 mx-auto flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all hover:opacity-80"
                style={{ backgroundColor: accentColor, color: '#fff' }}
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Yol Tarifi Al</span>
              </button>
            )}
          </div>

          {/* Timer */}
          <div className="w-full max-w-sm pt-4">
            <span className="text-[10px] tracking-[0.2em] uppercase opacity-50 block mb-4">Büyük Güne Kalan</span>
            <div className="p-4 rounded-xl border border-black/5 bg-white/50 shadow-sm">
              {renderTimer()}
            </div>
          </div>

          {/* RSVP Button */}
          {showRsvp && (
            <div className="pt-6 w-full max-w-xs mx-auto">
              {renderRsvpButton()}
            </div>
          )}

          {/* Guestbook */}
          <div className="w-full pt-8 border-t border-black/5">
            {renderGuestBook()}
          </div>
          
        </div>
      </div>
    </div>
  );
}
