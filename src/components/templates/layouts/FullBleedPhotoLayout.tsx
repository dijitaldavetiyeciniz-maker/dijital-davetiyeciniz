'use client';
import React from 'react';
import { Calendar, MapPin, Navigation, Ticket, Sparkles, MoveRight } from 'lucide-react';
import { getReadableTextColor, WCAG_MIN_RATIO, checkTemplateContrast } from '@/lib/colorUtils';
import SafeImage from '@/components/ui/SafeImage';

interface LayoutProps {
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

export default function FullBleedPhotoLayout({
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
  cardBgColor = '#ffffff',
  mode = 'public'
}: LayoutProps) {
  const brideInitial = wedding.bride_name ? wedding.bride_name.trim().charAt(0) : 'E';
  const groomInitial = wedding.groom_name ? wedding.groom_name.trim().charAt(0) : '';

  // 1. İÇERİK YERLEŞİM BİÇİMİ
  // custom_overrides.fullbleed_position: 'bottom-center' | 'left-cinematic' | 'right-monogram'
  const position = wedding.custom_overrides?.fullbleed_position || 'bottom-center';

  // Odak Noktası (Focal Point)
  const focalX = wedding.photo_focal_point?.x ?? 50;
  const focalY = wedding.photo_focal_point?.y ?? 50;
  const objectPosition = `${focalX}% ${focalY}%`;

  // Çift fotoğrafı
  const couplePhoto = wedding.bride_photo_url || wedding.groom_photo_url || wedding.background_image_url || '';

  // Fotoğraf kontrast durumuna göre metin renk ayarı (Açık veya Koyu varyant eşleşmesi)
  const isDarkText = wedding.custom_overrides?.fullbleed_dark_text || false;
  const displayTextColor = isDarkText ? '#0f172a' : '#ffffff';
  const overlayColorClass = isDarkText 
    ? 'bg-gradient-to-t from-white/95 via-white/40 to-transparent' 
    : 'bg-gradient-to-t from-black/90 via-black/35 to-transparent';

  const hasMaps = !!wedding.google_maps_url;
  const showRsvp = wedding.show_rsvp !== false;

  return (
    <div 
      className="max-w-[550px] mx-auto w-full my-8 relative z-10 animate-fade-in font-sans"
      style={{ ...(selectedBackground?.background ? { background: selectedBackground.background } : {}), fontFamily: `"${bodyFont}", serif` }}
    >
      {/* FULL-BLEED KART (Ekranı kaplayan dikey fotoğraf veya şık fallback) */}
      <div className="relative rounded-[2.5rem] overflow-hidden min-h-[660px] sm:min-h-[720px] flex flex-col justify-end bg-slate-950 border border-white/5 shadow-2xl">
        
        {/* Full-bleed Görsel Katmanı */}
        {couplePhoto ? (
          <div className="absolute inset-0 z-0">
            <SafeImage 
              src={couplePhoto} 
              alt="Full Bleed Couple"
              className="w-full h-full object-cover transition-transform duration-[12000ms] ease-out motion-safe:scale-105 motion-safe:hover:scale-100"
              style={{ objectPosition }}
              isHero={true}
            />
            {/* Fotoğraf üstü gradient koruması (metin okunabilirliği için) */}
            <div className={`absolute inset-0 z-10 pointer-events-none transition-opacity ${overlayColorClass}`} />
          </div>
        ) : (
          // Fotoğraf bulunmadığında premium fallback zemin tasarımı
          <div 
            className="absolute inset-0 z-0 flex flex-col items-center justify-center text-center p-8 bg-radial-gradient"
            style={{ 
              background: 'radial-gradient(circle at center, #1b263b 0%, #0d1b2a 100%)',
              color: '#dfb76c' 
            }}
          >
            <span className="text-7xl font-serif font-light opacity-30 select-none" aria-hidden="true">
              {groomInitial ? `${brideInitial}${groomInitial}` : brideInitial}
            </span>
            <p className="text-[10px] tracking-[0.3em] opacity-40 uppercase font-sans mt-4">Love is eternal</p>
          </div>
        )}

        {/* 2. POZİSYON BAZLI İÇERİK BLOKLARI (Safe Area ve Çentik Korumalı) */}
        <div 
          className={`relative z-20 w-full px-6 sm:px-10 pb-10 pt-28 flex flex-col justify-end min-h-[450px] text-left`}
          style={{ 
            color: displayTextColor,
            paddingBottom: 'calc(2.5rem + env(safe-area-inset-bottom))'
          }}
        >
          
          {/* VARYANT 1: ALT MERKEZ BİLGİ PANELİ */}
          {position === 'bottom-center' && (
            <div className="w-full text-center flex flex-col items-center">
              {/* Monogram Rozet */}
              <div 
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center font-serif text-sm mb-4 bg-black/20 backdrop-blur-xs select-none"
                style={{ borderColor: primaryColor }}
              >
                <span style={{ color: primaryColor }}>
                  {groomInitial ? `${brideInitial}${groomInitial}` : brideInitial}
                </span>
              </div>

              {/* İsimler */}
              <h1 className="text-3xl sm:text-4xl font-normal leading-tight tracking-wide" style={{ fontFamily: `"${headingFont}", serif` }}>
                {wedding.bride_name} & {wedding.groom_name}
              </h1>

              {/* Davet Mesajı */}
              <div className="my-4 leading-relaxed text-xs opacity-90 max-w-sm italic">
                {renderQuote()}
              </div>
            </div>
          )}

          {/* VARYANT 2: SOL HİZALI SİNEMATİK BAŞLIK ALANI */}
          {position === 'left-cinematic' && (
            <div className="w-full text-left flex flex-col items-start border-l-2 pl-4 mb-4" style={{ borderColor: primaryColor }}>
              <span className="text-[10px] font-sans font-bold tracking-[0.3em] uppercase opacity-75 mb-2" style={{ color: primaryColor }}>
                {eventTitle}
              </span>
              <h1 className="text-3xl sm:text-4xl font-normal leading-none tracking-tight uppercase" style={{ fontFamily: `"${headingFont}", serif` }}>
                {wedding.bride_name}
              </h1>
              <span className="text-sm font-serif italic my-1 opacity-50">&</span>
              <h1 className="text-3xl sm:text-4xl font-normal leading-none tracking-tight uppercase" style={{ fontFamily: `"${headingFont}", serif` }}>
                {wedding.groom_name}
              </h1>
            </div>
          )}

          {/* VARYANT 3: SAĞ ALT MONOGRAM VE ETKİNLİK BİLGİSİ */}
          {position === 'right-monogram' && (
            <div className="w-full text-right flex flex-col items-end pr-2">
              <span className="text-[9px] font-mono opacity-65 tracking-widest mb-1 select-none" aria-hidden="true">
                {groomInitial ? `${brideInitial} • ${groomInitial}` : brideInitial}
              </span>
              <h1 className="text-2xl sm:text-3xl font-light uppercase tracking-wide" style={{ fontFamily: `"${headingFont}", serif` }}>
                {wedding.bride_name} & {wedding.groom_name}
              </h1>
              <div className="w-8 h-[1px] my-3" style={{ backgroundColor: primaryColor }} />
            </div>
          )}

          {/* ORTAK ALAN: TARİH, SAAT VE MEKAN KARTI (Fotoğraf üzerinde kontrastlı) */}
          <div className="w-full mt-6 space-y-2.5 text-xs font-semibold">
            {/* Tarih Saat */}
            <div className="flex items-center gap-3 py-3 px-4 rounded-2xl border bg-black/40 backdrop-blur-xs border-white/10">
              <Calendar className="w-4 h-4 shrink-0 text-white" />
              <span className="text-white">{dateStr} | {timeStr}</span>
            </div>

            {/* Adres */}
            <div className="flex flex-col items-start gap-1 p-4 rounded-2xl border bg-black/40 backdrop-blur-xs border-white/10 text-left">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 shrink-0 text-white" />
                <span className="font-bold text-white">{wedding.venue_name || 'Mekan Belirtilmedi'}</span>
              </div>
              {wedding.venue_address && (
                <p className="text-[11px] font-light opacity-80 pl-6 leading-relaxed text-slate-100">{wedding.venue_address}</p>
              )}
            </div>
          </div>

          {/* AKSİYON BUTONLARI (MIN 48PX, ÇENTİK KORUMALI) */}
          <div className="w-full flex flex-col gap-3 mt-6 pb-2 safe-bottom">
            {/* Buton 1: KONUMA GİT */}
            {hasMaps && (
              <button 
                type="button"
                onClick={handleMapClick}
                className="w-full h-12 rounded-full border flex items-center justify-between px-6 font-bold text-xs tracking-wider uppercase transition-all duration-300 hover:bg-white/15 active:scale-98 cursor-pointer focus-visible:ring-2 focus-visible:outline-none bg-black/30 backdrop-blur-xs text-white border-white/20"
              >
                <span>KONUMA GİT</span>
                <span>&rarr;</span>
              </button>
            )}

            {/* Buton 2: KATILIM ANKETİ / LCV BİLDİRİMİ */}
            {showRsvp && renderRsvpButton()}
          </div>

          {/* Geri Sayım ve Defter Modülleri */}
          <div className="w-full mt-6 text-white">
            {renderTimer()}
            {renderGuestBook()}
          </div>
        </div>
      </div>
    </div>
  );
}
