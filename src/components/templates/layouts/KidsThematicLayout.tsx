'use client';
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Navigation, Gift, Sparkles } from 'lucide-react';

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

export default function KidsThematicLayout({ wedding,
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
  // 1. VARYANT BELİRLEME
  const presetId = wedding.template_id || '';
  let variant: 'clouds-above' | 'little-racer' | 'blue-bear' | 'pink-princess' | 'storybook-birthday' | 'neutral' = 'neutral';
  
  if (presetId === 'clouds-above') {
    variant = 'clouds-above';
  } else if (presetId === 'little-racer') {
    variant = 'little-racer';
  } else if (presetId === 'blue-bear') {
    variant = 'blue-bear';
  } else if (presetId === 'pink-princess') {
    variant = 'pink-princess';
  } else if (presetId === 'storybook-birthday') {
    variant = 'storybook-birthday';
  } else if (presetId === 'storybook-babyshower') {
    variant = 'blue-bear'; // Default for baby shower if no gender
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
    cardStyle += ' border-sky-100 shadow-sky-100/50';
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
    cardStyle += ' text-white border-red-500/20 shadow-red-500/10 font-mono';
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
    cardStyle += ' border-blue-100 shadow-blue-100/40';
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
    cardStyle += ' border-pink-100 shadow-pink-100/40';
    backgroundDecoration = (
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-[0.2]">
        <div className="absolute top-12 left-10 text-4xl animate-bounce duration-[4000ms]">🏰</div>
        <div className="absolute top-20 right-8 text-3xl animate-pulse">👑</div>
        <div className="absolute bottom-24 left-8 text-3xl">🦋</div>
        <div className="absolute bottom-16 right-10 text-4xl animate-bounce duration-[5000ms]">🌸</div>
      </div>
    );
  } else if (variant === 'storybook-birthday') {
    themeColor = primaryColor || '#f59e0b'; // Doğum Günü Sarısı
    cardStyle += ' border-amber-200 shadow-amber-200/40';
    backgroundDecoration = (
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-[0.3]">
        <div className="absolute top-10 left-8 text-5xl animate-bounce duration-[3000ms]">🎉</div>
        <div className="absolute top-12 right-12 text-4xl animate-pulse">🎈</div>
        <div className="absolute bottom-20 left-10 text-4xl animate-bounce duration-[4500ms]">🎁</div>
        <div className="absolute bottom-16 right-8 text-3xl">🎊</div>
      </div>
    );
  }

  const hasMaps = !!wedding.google_maps_url;
  const showRsvp = wedding.show_rsvp !== false;

  if (presetId === 'storybook-birthday') {
    return (
      <div className="max-w-5xl mx-auto w-full my-8 relative z-10 animate-fade-in font-sans" style={{ ...(selectedBackground?.background ? { background: selectedBackground.background } : {}), fontFamily: `"${bodyFont}", sans-serif` }}>
        <div data-testid="invitation-card-surface" className="rounded-3xl p-6 sm:p-12 shadow-2xl bg-white border border-rose-100 flex flex-col md:flex-row gap-8">
          
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-rose-50 rounded-2xl relative overflow-hidden">
            <div className="absolute top-4 left-4 text-4xl animate-bounce">🎊</div>
            <div className="absolute bottom-4 right-4 text-4xl animate-pulse">🎉</div>
            <div className="py-2 px-6 rounded-full bg-rose-200 text-rose-700 font-black tracking-widest uppercase mb-6 shadow-sm border border-rose-300 transform -rotate-2">
              <Sparkles className="w-4 h-4 inline-block mr-2" />
              {badgeText}
            </div>
            <h1 className="text-5xl sm:text-7xl font-black text-rose-600 mb-6 drop-shadow-md" style={{ fontFamily: `"${headingFont}", cursive` }}>
              {wedding.bride_name}
            </h1>
            <h3 className="font-bold tracking-widest uppercase text-xs text-rose-800 bg-white px-4 py-2 rounded-lg shadow-sm">
              {eventTitle}
            </h3>
          </div>

          <div className="flex-1 flex flex-col justify-center space-y-6">
            <div className="text-center italic text-slate-600 px-4">
              {renderQuote()}
            </div>
            
            <div className="w-full bg-slate-900 text-white p-6 rounded-2xl shadow-inner">
              <span className="text-[10px] font-bold tracking-widest text-slate-400 block mb-3 uppercase text-center">Geri Sayım</span>
              {renderTimer()}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-rose-50 p-4 rounded-xl border border-rose-100 flex flex-col items-center text-center">
                <Calendar className="w-6 h-6 text-rose-500 mb-2" />
                <span className="font-black text-rose-900">{dateStr}</span>
                <span className="text-xs text-rose-600">{timeStr}</span>
              </div>
              <div className="bg-rose-50 p-4 rounded-xl border border-rose-100 flex flex-col items-center text-center">
                <MapPin className="w-6 h-6 text-rose-500 mb-2" />
                <span className="font-black text-rose-900">{wedding.venue_name}</span>
                {wedding.venue_address && <span className="text-[10px] text-rose-600 mt-1">{wedding.venue_address}</span>}
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
              {hasMaps && (
                <button onClick={handleMapClick} className="w-full h-12 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
                  <Navigation className="w-4 h-4" /> HARİTADA GÖSTER
                </button>
              )}
              {wedding.bank_iban && (
                <div className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 text-center">
                  <Gift className="w-4 h-4 mx-auto mb-2 text-slate-400" />
                  <strong>HEDİYE & IBAN:</strong> <br/> {wedding.bank_iban}
                </div>
              )}
              {showRsvp && renderRsvpButton()}
              {renderGuestBook()}
            </div>
          </div>

        </div>
      </div>
    );
  }

  if (presetId === 'storybook-babyshower') {
    return (
      <div className="max-w-[480px] mx-auto w-full my-8 relative z-10 animate-fade-in font-sans" style={{ ...(selectedBackground?.background ? { background: selectedBackground.background } : {}), fontFamily: `"${bodyFont}", sans-serif` }}>
        <div data-testid="invitation-card-surface" className="rounded-[40px] p-8 sm:p-10 shadow-xl bg-sky-50 border-4 border-white flex flex-col relative overflow-hidden">
          
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-sky-100 to-transparent pointer-events-none" />
          
          <div className="relative z-10 w-full flex flex-col items-center text-center">
            <svg className="w-16 h-16 text-sky-400 mb-4 opacity-80 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
               <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
            </svg>
            
            <h3 className="font-medium tracking-[0.3em] uppercase text-xs mb-2 text-sky-600">
              {eventTitle}
            </h3>
            
            <h1 className="text-4xl sm:text-5xl font-light text-sky-900 mb-2 w-full" style={{ fontFamily: `"${headingFont}", serif` }}>
              {wedding.bride_name}
            </h1>
            
            {(wedding.bride_parents || wedding.groom_parents) && (
              <p className="text-[10px] tracking-widest text-sky-600/70 uppercase mb-6">
                {wedding.bride_parents ? `ANNE: ${wedding.bride_parents}` : ''}
              </p>
            )}

            <div className="w-full h-px bg-sky-200 my-4" />

            <div className="my-4 text-sm text-sky-800 leading-relaxed max-w-sm">
              {renderQuote()}
            </div>

            <div className="w-full flex flex-col space-y-3 mt-4 mb-8">
              <div className="flex items-center justify-between py-3 px-5 bg-white rounded-full border border-sky-100 shadow-sm text-sky-900 text-sm">
                <span className="font-bold">{dateStr}</span>
                <Calendar className="w-4 h-4 text-sky-400" />
                <span className="font-bold">{timeStr}</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-white rounded-2xl border border-sky-100 shadow-sm text-sky-900">
                <MapPin className="w-5 h-5 text-sky-400 mb-2" />
                <span className="font-bold text-sm">{wedding.venue_name}</span>
                {wedding.venue_address && <span className="text-[10px] mt-1 opacity-70">{wedding.venue_address}</span>}
              </div>
            </div>

            <div className="w-full bg-white/50 p-5 rounded-3xl border border-sky-100 mb-6">
              <span className="text-[9px] font-bold tracking-widest text-sky-500 block mb-2 uppercase">Heyecanla Bekliyoruz</span>
              {renderTimer()}
            </div>

            <div className="w-full flex flex-col gap-3">
              {hasMaps && (
                <button onClick={handleMapClick} className="w-full h-12 bg-sky-100 hover:bg-sky-200 text-sky-700 rounded-full font-bold text-xs flex items-center justify-center gap-2 transition-all">
                  <Navigation className="w-4 h-4" /> YOL TARİFİ AL
                </button>
              )}
              {wedding.bank_iban && (
                <div className="w-full p-4 bg-sky-50/50 rounded-2xl text-xs text-sky-800 text-center border border-sky-100">
                  <Gift className="w-4 h-4 mx-auto mb-1 text-sky-400" />
                  <strong>İHTİYAÇ LİSTESİ:</strong> <br/> {wedding.bank_iban}
                </div>
              )}
              <div className="mt-2 w-full">{showRsvp && renderRsvpButton()}</div>
              <div className="w-full">{renderGuestBook()}</div>
            </div>
            
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="max-w-[550px] mx-auto w-full my-8 relative z-10 animate-fade-in font-sans"
      style={{ ...(selectedBackground?.background ? { background: selectedBackground.background } : {}), fontFamily: `"${bodyFont}", sans-serif` }}
    >
      <div data-testid="invitation-card-surface invitation-content-surface hero-text-surface date-surface venue-surface countdown-surface action-surface" 
        className={cardStyle}
        style={{ ...cardSurfaceStyle,  backgroundColor: cardBgColor, borderColor: `${themeColor}25`, color: textColor || (variant === 'little-racer' ? '#ffffff' : '#334155') }}
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
