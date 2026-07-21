'use client';
import React from 'react';
import { Calendar, MapPin, Navigation, Info } from 'lucide-react';

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

export default function HennaVelvetLayout({
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
  cardBgColor = '#3f0712', // Koyu bordo kadife fallback rengi
  mode = 'public'
}: LayoutProps) {
  
  // 1. KINA GEÇİŞ VE VARYANT TESPİTİ
  // custom_overrides.henna_variant: 'rose-gold' | 'gold' | 'copper'
  const hennaVariant = wedding.custom_overrides?.henna_variant || 'gold';
  const language = wedding.language || 'tr';

  // Metalik renk geçişleri (Gradient)
  let metalicBorder = 'linear-gradient(135deg, #dfb76c 0%, #c5a880 50%, #dfb76c 100%)'; // Gold
  let metalicTextColor = '#dfb76c';
  let metalicTextShadow = '0 0 5px rgba(223, 183, 108, 0.4)';

  if (hennaVariant === 'rose-gold') {
    metalicBorder = 'linear-gradient(135deg, #c98778 0%, #e2b3a8 50%, #c98778 100%)';
    metalicTextColor = '#e2b3a8';
    metalicTextShadow = '0 0 5px rgba(226, 179, 168, 0.4)';
  } else if (hennaVariant === 'copper') {
    metalicBorder = 'linear-gradient(135deg, #b87333 0%, #dca373 50%, #b87333 100%)';
    metalicTextColor = '#dca373';
    metalicTextShadow = '0 0 5px rgba(220, 163, 115, 0.4)';
  }

  // Dil seçimine göre başlık
  const titleText = language === 'en' ? 'Henna Night' : 'Kına Gecesi';

  // 2. KADİFE ARKA PLAN DOKU FALLBACK (Eğer görsel yüklenmezse)
  const backgroundStyle: React.CSSProperties = {
    backgroundColor: cardBgColor,
    backgroundImage: `radial-gradient(circle at center, rgba(127, 29, 29, 0.95) 0%, rgba(63, 7, 18, 0.98) 100%)`,
    boxShadow: 'inset 0 0 100px rgba(0,0,0,0.8)'
  };

  const hasMaps = !!wedding.google_maps_url;
  const showRsvp = wedding.show_rsvp !== false;

  return (
    <div 
      className="max-w-[550px] mx-auto w-full my-8 relative z-10 animate-fade-in font-sans"
      style={{ fontFamily: `"${bodyFont}", serif` }}
    >
      {/* Kadife Görünümlü Lüks Kına Kartı */}
      <div 
        className="relative rounded-[2.5rem] overflow-hidden p-6 sm:p-10 text-center border flex flex-col items-center justify-between min-h-[620px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)]"
        style={{ ...backgroundStyle, borderColor: `${metalicTextColor}30` }}
      >
        
        {/* KADİFE NOISE OVERLAY */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none z-0 opacity-40" />

        {/* ORYANTAL DANTEL VE SÜSLEMELER (pointer-events: none) */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none opacity-20">
          {/* Top Lace Border (SVG) */}
          <div className="absolute top-0 inset-x-0 h-10 flex justify-center text-rose-300">
            <svg className="w-full h-8" viewBox="0 0 100 10" preserveAspectRatio="none" fill="currentColor">
              <path d="M0 0c5 5 10 5 15 0s10-5 15 0 10 5 15 0 10-5 15 0 10 5 15 0 10-5 15 0 10 5 15 0 10-5 15 0h10V0H0z"/>
            </svg>
          </div>
          {/* Sol Alt Kına Tepsisi Süsü SVG */}
          <div className="absolute bottom-6 left-6 rotate-[-15deg]">
            <svg className="w-16 h-16 text-rose-400" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1" fill="none"/>
              <circle cx="12" cy="12" r="6" fill="currentColor"/>
            </svg>
          </div>
          {/* Sağ Alt Kına El Motifi SVG */}
          <div className="absolute bottom-6 right-6 rotate-[15deg]">
            <svg className="w-14 h-14 text-rose-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8 6 4 9 4 13c0 4.4 3.6 8 8 8s8-3.6 8-8c0-4-4-7-8-11zm0 15c-2.2 0-4-1.8-4-4 0-1.8 1.5-3.5 4-6 2.5 2.5 4 4.2 4 6 0 2.2-1.8 4-4 4z"/>
            </svg>
          </div>
        </div>

        {/* İnce Şık Metalik Varak Çerçeve */}
        <div className="absolute inset-4 sm:inset-6 rounded-[2rem] pointer-events-none z-0 border border-transparent shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
          <div 
            className="absolute inset-0 rounded-[2rem] border" 
            style={{ 
              borderImage: `${metalicBorder} 1`,
              borderWidth: '1.5px',
              filter: `drop-shadow(0 0 2px ${metalicTextColor}40)`
            }} 
          />
        </div>

        {/* GÜVENLİ İÇERİK ALANI */}
        <div className="relative z-10 w-full flex flex-col items-center">
          
          {/* Logo / Mühür Rozeti */}
          <div className="flex flex-col items-center mb-4 select-none">
            <div 
              className="w-12 h-12 rounded-full border flex items-center justify-center font-serif text-lg font-bold shadow-md relative bg-rose-950"
              style={{ borderColor: metalicTextColor, color: metalicTextColor, textShadow: metalicTextShadow }}
            >
              👑
            </div>
          </div>

          {/* Kına Gecesi / Henna Night Logo Başlığı */}
          <h2 
            className="text-2xl sm:text-3xl font-normal tracking-[0.2em] uppercase mb-4"
            style={{ color: metalicTextColor, fontFamily: `"${headingFont}", serif`, textShadow: metalicTextShadow }}
          >
            {titleText}
          </h2>

          {/* Gelin İsmi */}
          <div className="w-full mb-6">
            <h1 
              className="text-3xl sm:text-4xl font-normal leading-tight tracking-wide w-full"
              style={{ color: '#ffffff', fontFamily: `"${headingFont}", serif` }}
            >
              {wedding.bride_name}
            </h1>
            {wedding.bride_parents && (
              <p className="text-[9px] tracking-[0.2em] font-light mt-3 opacity-75 uppercase font-sans text-rose-200">
                {wedding.bride_parents}
              </p>
            )}
          </div>

          {/* Davet Mesajı */}
          <div className="text-white/95 my-2 leading-relaxed text-sm">
            {renderQuote()}
          </div>

          {/* Geri Sayım */}
          <div className="w-full my-4">
            {renderTimer()}
          </div>

          {/* Tarih ve Mekan Detayları */}
          <div className="w-full max-w-sm text-xs font-semibold my-6 space-y-2.5 text-white">
            <div className="flex items-center gap-3 py-2.5 px-4 rounded-xl border bg-black/35" style={{ borderColor: `${metalicTextColor}20` }}>
              <Calendar className="w-4 h-4 shrink-0" style={{ color: metalicTextColor }} />
              <span>{dateStr} <span className="mx-1 opacity-40">|</span> {timeStr}</span>
            </div>

            <div className="flex flex-col items-start gap-1 p-4 rounded-xl border bg-black/35 text-left" style={{ borderColor: `${metalicTextColor}20` }}>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 shrink-0" style={{ color: metalicTextColor }} />
                <span className="font-bold">{wedding.venue_name || 'Mekan Belirtilmedi'}</span>
              </div>
              {wedding.venue_address && (
                <p className="text-[11px] font-light opacity-90 pl-6 leading-relaxed text-rose-100">{wedding.venue_address}</p>
              )}
            </div>
          </div>

          {/* OVAL AKSİYON BUTONLARI (MIN 48PX, METALİK GRADİENT) */}
          <div className="w-full max-w-sm flex flex-col gap-3 mt-4">
            
            {/* Buton 1: KONUMA GİT */}
            {hasMaps && (
              <button 
                type="button"
                onClick={handleMapClick}
                className="w-full h-12 rounded-full border flex items-center justify-between px-6 font-bold text-xs tracking-wider uppercase transition-all duration-300 hover:scale-102 active:scale-98 cursor-pointer focus-visible:ring-2 focus-visible:outline-none"
                style={{ 
                  borderImage: `${metalicBorder} 1`,
                  borderWidth: '1.5px',
                  color: metalicTextColor,
                  backgroundColor: 'rgba(0, 0, 0, 0.4)'
                }}
              >
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4" />
                  <span>KONUMA GİT</span>
                </div>
                <span>&rarr;</span>
              </button>
            )}

            {/* Buton 2: KATILIM ANKETİ / LCV BİLDİRİMİ */}
            {showRsvp && renderRsvpButton()}
          </div>

          {/* Anı Defteri */}
          {renderGuestBook()}
        </div>
      </div>
    </div>
  );
}
