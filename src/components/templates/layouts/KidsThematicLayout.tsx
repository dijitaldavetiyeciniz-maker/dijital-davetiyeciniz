'use client';
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Navigation, Gift, Sparkles } from 'lucide-react';

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

export default function KidsThematicLayout({
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
  // 1. VARYANT BELİRLEME
  const presetId = wedding.template_id || '';
  let variant: 'clouds-above' | 'little-racer' | 'blue-bear' | 'pink-princess' | 'neutral' = 'neutral';
  
  if (presetId === 'clouds-above') {
    variant = 'clouds-above';
  } else if (presetId === 'little-racer') {
    variant = 'little-racer';
  } else if (presetId === 'blue-bear') {
    variant = 'blue-bear';
  } else if (presetId === 'pink-princess') {
    variant = 'pink-princess';
  } else {
    // Fallback parsing
    const overrides = wedding.custom_overrides || {};
    const gender = (overrides.gender_variant || wedding.gender_variant || '').toLowerCase();
    if (gender === 'girl' || gender === 'kiz') {
      variant = 'pink-princess';
    } else if (gender === 'boy' || gender === 'erkek') {
      variant = 'blue-bear';
    } else {
      variant = 'clouds-above'; // default
    }
  }

  // 2. VARYANTA ÖZEL PARAMETRELER
  let themeColor = primaryColor || '#38bdf8';
  let badgeText = 'Hoş Geldin Bebek';
  let cardStyle = 'rounded-[3rem] p-8 sm:p-12 border shadow-2xl relative overflow-hidden flex flex-col items-center justify-between min-h-[600px] transition-all';
  let backgroundDecoration: React.ReactNode = null;
  let customCounterStyle = '';

  const eventTypeRaw = (wedding.event_type || '').toLowerCase();
  if (eventTypeRaw.includes('birthday') || eventTypeRaw.includes('dogum')) {
    badgeText = 'İyi ki Doğdun';
  } else if (eventTypeRaw.includes('shower')) {
    badgeText = 'Baby Shower';
  }

  const overrides = wedding.custom_overrides || {};
  if (overrides.kids_age) {
    badgeText = `${overrides.kids_age} Yaşında!`;
  }

  if (variant === 'clouds-above') {
    themeColor = primaryColor || '#38bdf8'; // Gök Mavisi
    cardStyle += ' bg-gradient-to-b from-[#f0f9ff] to-white border-sky-100 shadow-sky-100/50';
    backgroundDecoration = (
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-[0.25]">
        {/* Floating clouds */}
        <div className="absolute top-12 left-6 animate-pulse duration-[3000ms]">
          <svg className="w-16 h-10 text-sky-300" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
          </svg>
        </div>
        <div className="absolute top-20 right-8 animate-bounce duration-[4000ms]">
          <svg className="w-12 h-8 text-sky-200" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
          </svg>
        </div>
        {/* Balloon rising */}
        <div className="absolute bottom-16 right-10 animate-bounce duration-[5000ms]">
          <span className="text-4xl">🎈</span>
        </div>
        <div className="absolute bottom-32 left-8 animate-pulse duration-[6000ms]">
          <span className="text-3xl">☁️</span>
        </div>
      </div>
    );
  } else if (variant === 'little-racer') {
    themeColor = primaryColor || '#ef4444'; // Yarışçı Kırmızısı
    cardStyle += ' bg-[#1e293b] text-white border-red-500/20 shadow-red-500/10 font-mono';
    backgroundDecoration = (
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-[0.15]">
        {/* Racetrack checkered lanes */}
        <div className="absolute inset-x-0 top-0 h-4 bg-[radial-gradient(#ffffff_20%,transparent_20%)] bg-[length:16px_16px]" />
        <div className="absolute inset-x-0 bottom-0 h-4 bg-[radial-gradient(#ffffff_20%,transparent_20%)] bg-[length:16px_16px]" />
        {/* Racing icons */}
        <div className="absolute top-16 left-10 animate-pulse">
          <span className="text-4xl">🏎️</span>
        </div>
        <div className="absolute bottom-20 right-10 animate-bounce">
          <span className="text-4xl">🏁</span>
        </div>
      </div>
    );
    customCounterStyle = 'racer-counter';
  } else if (variant === 'blue-bear') {
    themeColor = primaryColor || '#60a5fa'; // Yumuşak Mavi
    cardStyle += ' bg-gradient-to-b from-[#eff6ff] to-[#f8fafc] border-blue-100 shadow-blue-100/40';
    backgroundDecoration = (
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-[0.2]">
        <div className="absolute top-16 left-8 text-4xl animate-bounce duration-[6000ms]">🧸</div>
        <div className="absolute top-8 right-12 text-4xl animate-pulse">🌙</div>
        <div className="absolute bottom-24 left-10 text-3xl">⭐</div>
        <div className="absolute bottom-16 right-12 text-3xl animate-bounce">⭐</div>
      </div>
    );
  } else if (variant === 'pink-princess') {
    themeColor = primaryColor || '#ec4899'; // Prenses Pembesi
    cardStyle += ' bg-gradient-to-b from-[#fdf2f8] to-white border-pink-100 shadow-pink-100/40';
    backgroundDecoration = (
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-[0.2]">
        <div className="absolute top-12 left-10 text-4xl animate-bounce duration-[4000ms]">🏰</div>
        <div className="absolute top-20 right-8 text-3xl animate-pulse">👑</div>
        <div className="absolute bottom-24 left-8 text-3xl">🦋</div>
        <div className="absolute bottom-16 right-10 text-4xl animate-bounce duration-[5000ms]">🌸</div>
      </div>
    );
  }

  const hasMaps = !!wedding.google_maps_url;
  const showRsvp = wedding.show_rsvp !== false;

  return (
    <div 
      className="max-w-[550px] mx-auto w-full my-8 relative z-10 animate-fade-in font-sans"
      style={{ ...(selectedBackground?.background ? { background: selectedBackground.background } : {}), fontFamily: `"${bodyFont}", sans-serif` }}
    >
      <div 
        className={cardStyle}
        style={{ borderColor: `${themeColor}25`, color: variant === 'little-racer' ? '#ffffff' : textColor }}
      >
        {backgroundDecoration}

        {/* GÜVENLİ İÇERİK ALANI */}
        <div className="relative z-10 w-full flex flex-col items-center">
          
          {/* Rozet */}
          <div className="flex flex-col items-center mb-6 select-none">
            <div 
              className="py-1.5 px-5 rounded-full border text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 shadow-xs"
              style={{ 
                borderColor: `${themeColor}40`, 
                color: themeColor, 
                backgroundColor: `${themeColor}08` 
              }}
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>{badgeText}</span>
            </div>
          </div>

          {/* Başlık */}
          <h3 className="font-semibold tracking-[0.25em] uppercase text-[10px] mb-4 opacity-75 animate-pulse" style={{ color: themeColor }}>
            {eventTitle}
          </h3>

          {/* Çocuğun İsmi */}
          <div className="w-full mb-6">
            <h1 
              className="text-4xl sm:text-5xl font-normal leading-tight tracking-wide w-full"
              style={{ color: themeColor, fontFamily: `"${headingFont}", cursive` }}
            >
              {wedding.bride_name || 'Bebeğimiz'}
            </h1>
            
            {/* Anne Baba Detayı */}
            {(wedding.bride_parents || wedding.groom_parents) && (
              <p className="text-[9px] tracking-[0.25em] font-light mt-3 opacity-60 uppercase font-sans">
                {wedding.bride_parents ? `ANNE: ${wedding.bride_parents}` : ''} 
                {wedding.groom_parents ? ` • BABA: ${wedding.groom_parents}` : ''}
              </p>
            )}
          </div>

          {/* Davet Metni */}
          <div className="my-2 select-text max-w-sm text-center">
            {renderQuote()}
          </div>

          {/* Sayaç Paneli */}
          <div className={`w-full my-6 p-4 rounded-3xl ${variant === 'little-racer' ? 'bg-black/40 border border-red-500/30' : 'bg-white/40 backdrop-blur-xs border border-white/50'}`}>
            <span className="text-[9px] font-bold tracking-widest text-slate-400 block mb-2">KALAN SÜRE</span>
            {renderTimer()}
          </div>

          {/* Bilgi Kartları */}
          {variant === 'little-racer' ? (
            /* Pit-stop / Bilet Görünümü */
            <div className="w-full max-w-sm my-6 space-y-3 font-mono text-left">
              <div className="p-4 rounded-xl border border-red-500/20 bg-black/60 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-red-600 text-[8px] font-bold px-2 py-0.5 rounded-bl">PIT ENTRY</div>
                <div className="text-xs font-bold text-red-500 mb-1">🏁 TARİH & SAAT</div>
                <div className="text-sm font-semibold">{dateStr} - {timeStr}</div>
              </div>
              <div className="p-4 rounded-xl border border-red-500/20 bg-black/60 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-red-600 text-[8px] font-bold px-2 py-0.5 rounded-bl">PADDOCK</div>
                <div className="text-xs font-bold text-red-500 mb-1">📍 ETKİNLİK MEKANI</div>
                <div className="text-sm font-bold">{wedding.venue_name || 'Pit Stop Belirtilmedi'}</div>
                {wedding.venue_address && <div className="text-[10px] opacity-75 mt-1">{wedding.venue_address}</div>}
              </div>
            </div>
          ) : (
            /* Klasik Sevebil Kartlar */
            <div className="w-full max-w-sm text-xs font-semibold my-6 space-y-2.5">
              <div className="flex items-center gap-3 py-3 px-5 rounded-2xl border bg-white/50 backdrop-blur-xs" style={{ borderColor: `${themeColor}15` }}>
                <Calendar className="w-4 h-4 shrink-0" style={{ color: themeColor }} />
                <span>{dateStr} <span className="mx-1 opacity-40">|</span> {timeStr}</span>
              </div>

              <div className="flex flex-col items-start gap-1 p-4 rounded-2xl border bg-white/50 backdrop-blur-xs text-left" style={{ borderColor: `${themeColor}15` }}>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 shrink-0" style={{ color: themeColor }} />
                  <span className="font-bold">{wedding.venue_name || 'Mekan Belirtilmedi'}</span>
                </div>
                {wedding.venue_address && (
                  <p className="text-[11px] font-light opacity-80 pl-6 leading-relaxed">{wedding.venue_address}</p>
                )}
              </div>
            </div>
          )}

          {/* Aksiyon Butonları */}
          <div className="w-full max-w-sm flex flex-col gap-3 mt-4">
            {hasMaps && (
              <button 
                type="button"
                onClick={handleMapClick}
                className={`w-full h-12 rounded-full border flex items-center justify-between px-6 font-bold text-xs tracking-wider uppercase transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer focus-visible:ring-2 focus-visible:outline-none ${variant === 'little-racer' ? 'bg-red-600 border-red-700 text-white hover:bg-red-700' : 'bg-white/80 hover:bg-white text-slate-800'}`}
                style={variant === 'little-racer' ? {} : { borderColor: `${themeColor}30`, color: themeColor }}
              >
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4" />
                  <span>{variant === 'little-racer' ? 'GPS / NAVİGASYON' : 'KONUMA GİT'}</span>
                </div>
                <span>&rarr;</span>
              </button>
            )}

            {wedding.bank_iban && (
              <div 
                className={`w-full p-4 rounded-3xl border text-left text-[10px] leading-relaxed ${variant === 'little-racer' ? 'bg-black/60 border-red-500/20 text-white' : 'bg-amber-500/5'}`}
                style={variant === 'little-racer' ? {} : { borderColor: `${themeColor}15` }}
              >
                <div className="flex items-center gap-2 font-bold mb-1" style={{ color: themeColor }}>
                  <Gift className="w-4 h-4 shrink-0" />
                  <span>{variant === 'clouds-above' ? 'BEBEK İHTİYAÇ LİSTESİ' : 'HEDİYE & IBAN'}</span>
                </div>
                <p className="opacity-90">{wedding.bank_iban}</p>
              </div>
            )}

            {showRsvp && renderRsvpButton()}
          </div>

          {/* Anı Defteri */}
          <div className="w-full mt-6">
            {renderGuestBook()}
          </div>
        </div>
      </div>
    </div>
  );
}
