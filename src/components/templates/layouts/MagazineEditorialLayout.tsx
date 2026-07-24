'use client';
import React from 'react';
import { Calendar, MapPin, Navigation } from 'lucide-react';
import SafeImage from '@/components/ui/SafeImage';

interface LayoutProps {
  cardSurfaceStyle?: React.CSSProperties;
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

export default function MagazineEditorialLayout({ wedding,
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
  cardBgColor = '#ffffff',
  mode = 'public'
, selectedBackground, cardSurfaceStyle }: LayoutProps) {
  const brideInitial = wedding.bride_name ? wedding.bride_name.trim().charAt(0) : 'E';
  const groomInitial = wedding.groom_name ? wedding.groom_name.trim().charAt(0) : '';

  const hasMaps = !!wedding.google_maps_url;
  const showRsvp = wedding.show_rsvp !== false;

  // 1. VARYANT TESPİTİ
  // custom_overrides.editorial_variant: 'fashion' | 'newspaper' | 'luxury'
  const variant = wedding.custom_overrides?.editorial_variant || 'fashion';

  // Masthead Metni (Örn: "THE WEDDING EDITION", "SPECIAL DAY")
  const mastheadText = wedding.custom_overrides?.masthead_text || 'THE WEDDING EDITION';

  // Focal Point
  const focalX = wedding.photo_focal_point?.x ?? 50;
  const focalY = wedding.photo_focal_point?.y ?? 50;
  const objectPosition = `${focalX}% ${focalY}%`;

  // Fotoğraf varlığı
  const couplePhoto = wedding.bride_photo_url || wedding.groom_photo_url || wedding.background_image_url || '';

  // 2. VARYANT RENK VE TASARIM STİLLERİ
  let containerBg = 'bg-[#fcfbf9]';
  let titleColor = primaryColor || '#0f172a';
  let borderLine = 'border-slate-200';
  const fontSelection = `font-serif`;

  if (variant === 'newspaper') {
    containerBg = 'bg-[#f8f6f0]'; // Gazete saman kağıdı rengi
    titleColor = '#000000';
    borderLine = 'border-black/40';
  } else if (variant === 'luxury') {
    containerBg = 'bg-[#0f172a]'; // Koyu lüks lacivert/siyah
    titleColor = primaryColor || '#dfb76c';
    borderLine = 'border-white/10';
  }

  return (
    <div 
      className="max-w-[550px] mx-auto w-full my-8 relative z-10 animate-fade-in font-sans"
      style={{ ...(selectedBackground?.background ? { background: selectedBackground.background } : {}), fontFamily: `"${bodyFont}", serif` }}
    >
      {/* Dergi Kapağı Kartı (Asimetrik CSS Grid Yapısı) */}
      <div data-testid="invitation-card-surface invitation-content-surface hero-text-surface date-surface venue-surface countdown-surface action-surface" 
        className={`relative rounded-[2rem] overflow-hidden p-6 sm:p-10 border flex flex-col justify-between min-h-[640px] shadow-2xl transition-colors duration-500 ${containerBg}`}
        style={{ ...cardSurfaceStyle,  borderColor: variant === 'luxury' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', color: textColor }}
      >
        
        {/* MASTHEAD (Dergi Başlığı Edisyonu - En Üst Alan) */}
        <div className="w-full border-b pb-4 mb-6 flex justify-between items-end" style={{ borderColor: variant === 'luxury' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
          <span 
            className="text-[10px] font-sans font-bold tracking-[0.35em] uppercase select-none opacity-60"
            style={{ color: titleColor }}
          >
            {mastheadText}
          </span>
          <span className="text-[9px] font-mono opacity-50 uppercase tracking-widest">
            {dateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </span>
        </div>

        {/* ORTA BÖLÜM: ASİMETRİK GRID (FOTOĞRAF VE METİN BLOKLARI) */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 w-full items-start">
          
          {/* Asimetrik Sol Blok: Fotoğraf veya Büyük Fallback Monogram */}
          <div className="sm:col-span-7 relative aspect-[4/5] sm:aspect-auto sm:h-[320px] rounded-2xl overflow-hidden bg-slate-900 border border-black/5 z-10">
            {couplePhoto ? (
              <SafeImage 
                src={couplePhoto} 
                alt="Editorial Couple"
                className="w-full h-full object-cover"
                style={{ objectPosition }}
                isHero={true}
              />
            ) : (
              // Fotoğraf olmadığında gösterilecek modern fallback monogram
              <div 
                className="w-full h-full flex flex-col items-center justify-center text-center p-6"
                style={{ 
                  background: variant === 'luxury' ? 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)' : 'radial-gradient(circle at center, #f1ece4 0%, #e5ded4 100%)',
                  color: titleColor 
                }}
              >
                <span className="text-6xl font-serif font-light mb-2 opacity-30 select-none" aria-hidden="true">
                  {groomInitial ? `${brideInitial}${groomInitial}` : brideInitial}
                </span>
                <span className="text-[8px] uppercase tracking-[0.3em] opacity-40 font-sans">Special Day Issue</span>
              </div>
            )}
            {/* Fotoğraf üstü dergi kapağı metin yerleşimi */}
            <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-xs text-white py-1 px-3 rounded-md text-[9px] font-bold tracking-widest uppercase">
              COUPLE OF THE YEAR
            </div>
          </div>

          {/* Asimetrik Sağ Blok: Dev Tarih Rakamları ve İsimler */}
          <div className="sm:col-span-5 flex flex-col justify-between h-full text-left font-serif z-10">
            
            {/* Dev Tarih Rakamı */}
            <div className="mb-4 select-none opacity-80" aria-hidden="true">
              <span className="text-5xl sm:text-6xl font-light tracking-tighter" style={{ color: titleColor }}>
                {String(dateObj.getDate()).padStart(2, '0')}
              </span>
              <span className="text-xs uppercase tracking-widest pl-2 font-sans align-super">
                {dateObj.toLocaleDateString('tr-TR', { month: 'short' })}
              </span>
            </div>

            {/* İsimler (Modern asimetrik yerleşim) */}
            <div className="space-y-1 my-2">
              <h1 
                className="text-2xl sm:text-3xl font-normal leading-tight tracking-tight uppercase"
                style={{ color: titleColor, fontFamily: `"${headingFont}", serif` }}
              >
                {wedding.bride_name}
              </h1>
              <div className="h-[1px] w-8 my-2" style={{ backgroundColor: titleColor }} />
              <h1 
                className="text-2xl sm:text-3xl font-normal leading-tight tracking-tight uppercase"
                style={{ color: titleColor, fontFamily: `"${headingFont}", serif` }}
              >
                {wedding.groom_name}
              </h1>
            </div>

            {/* Aile İsimleri */}
            {(wedding.bride_parents || wedding.groom_parents) && (
              <div className="mt-3 font-sans text-[9px] tracking-widest uppercase opacity-60 leading-relaxed">
                {wedding.bride_parents && <p>{wedding.bride_parents}</p>}
                {wedding.groom_parents && <p>{wedding.groom_parents}</p>}
              </div>
            )}
          </div>
        </div>

        {/* ALT BÖLÜM: DAVET METNİ, SAAT VE MEKAN BİLGİLERİ */}
        <div className="w-full mt-6 pt-6 border-t" style={{ borderColor: variant === 'luxury' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
          {/* Davet Mesajı (Tırnak Süsü ile) */}
          <div className="text-xs italic leading-relaxed opacity-90 max-w-md mb-6 font-light">
            {renderQuote()}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left text-xs font-semibold">
            {/* Tarih / Saat */}
            <div className="flex items-center gap-3 py-2 px-3 rounded-lg border bg-black/5" style={{ borderColor: variant === 'luxury' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
              <Calendar className="w-4 h-4 shrink-0" style={{ color: titleColor }} />
              <span>{dateStr} | {timeStr}</span>
            </div>

            {/* Mekan */}
            <div className="flex flex-col gap-1 p-3 rounded-lg border bg-black/5" style={{ borderColor: variant === 'luxury' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 shrink-0" style={{ color: titleColor }} />
                <span className="font-bold">{wedding.venue_name || 'Mekan Belirtilmedi'}</span>
              </div>
              {wedding.venue_address && (
                <p className="text-[11px] font-light opacity-80 pl-6 leading-relaxed">{wedding.venue_address}</p>
              )}
            </div>
          </div>
        </div>

        {/* AKSİYON BUTONLARI (MIN 48PX) */}
        <div className="w-full max-w-sm flex flex-col gap-3 mt-6 mx-auto font-sans">
          
          {/* Buton 1: KONUMA GİT */}
          {hasMaps && (
            <button 
              type="button"
              onClick={handleMapClick}
              className="w-full h-12 rounded-lg border flex items-center justify-between px-5 font-bold text-xs tracking-wider uppercase transition-all duration-300 hover:scale-102 active:scale-98 cursor-pointer focus-visible:ring-1 focus-visible:outline-none"
              style={{ 
                borderColor: titleColor, 
                color: variant === 'luxury' ? '#ffffff' : '#000000',
                backgroundColor: variant === 'luxury' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'
              }}
            >
              <span>KONUMA GİT</span>
              <span>&rarr;</span>
            </button>
          )}

          {/* Buton 2: KATILIM ANKETİ / LCV BİLDİRİMİ */}
          {showRsvp && renderRsvpButton()}
        </div>

        {/* Geri Sayım ve Anı Defteri */}
        <div className="w-full mt-6">
          {renderTimer()}
          {renderGuestBook()}
        </div>
      </div>
    </div>
  );
}
