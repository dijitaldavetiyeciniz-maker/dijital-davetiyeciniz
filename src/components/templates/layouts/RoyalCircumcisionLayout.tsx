'use client';
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Navigation, Sparkles } from 'lucide-react';
import { backgroundDesignRegistry, thematicAssetRegistry } from '@/lib/registries';

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

export default function RoyalCircumcisionLayout({
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
  cardBgColor = '#0b1329',
  mode = 'public'
}: LayoutProps) {
  
  // 1. SÜNNET VARYANT TESPİTİ
  // custom_overrides.circumcision_variant: 'royal' | 'velvet-nazar' | 'white-marble'
  const variant = wedding.custom_overrides?.circumcision_variant || 'royal';
  const language = wedding.language || 'tr';

  let metalicTextColor = '#dfb76c';
  let metalicBorder = 'linear-gradient(135deg, #dfb76c 0%, #c5a880 50%, #dfb76c 100%)';
  let metalicTextShadow = '0 0 5px rgba(223, 183, 108, 0.4)';
  
  let bgStyle: React.CSSProperties = {};

  // Arka plan texture seçimi
  if (variant === 'white-marble') {
    const bgRegistry = backgroundDesignRegistry['white-gold-marble'] || { image: '', fallbackColor: '#ffffff', overlay: 'rgba(255,255,255,0.92)' };
    bgStyle = {
      backgroundColor: bgRegistry.fallbackColor,
      backgroundImage: bgRegistry.image ? `linear-gradient(${bgRegistry.overlay}, ${bgRegistry.overlay}), url('${bgRegistry.image}')` : undefined,
      color: '#1e293b'
    };
    metalicTextColor = primaryColor || '#1e3a8a'; // Modern mavi monogram için lacivert
    metalicBorder = 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #1e3a8a 100%)';
    metalicTextShadow = 'none';
  } else if (variant === 'velvet-nazar') {
    const bgRegistry = backgroundDesignRegistry['navy-gold-night'] || { image: '', fallbackColor: '#090d16', overlay: 'rgba(9,13,22,0.9)' };
    bgStyle = {
      backgroundColor: bgRegistry.fallbackColor,
      backgroundImage: bgRegistry.image ? `linear-gradient(${bgRegistry.overlay}, ${bgRegistry.overlay}), url('${bgRegistry.image}')` : `radial-gradient(circle at center, #0f1b36 0%, #081225 100%)`,
      color: '#ffffff'
    };
    metalicTextColor = '#3b82f6'; // Mavi
    metalicBorder = 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 50%, #3b82f6 100%)';
  } else {
    // Royal (Varsayılan Kraliyet Mavisi ve Altın Varak)
    const bgRegistry = backgroundDesignRegistry['navy-gold-night'] || { image: '', fallbackColor: '#0b1329', overlay: 'rgba(11,19,41,0.9)' };
    bgStyle = {
      backgroundColor: bgRegistry.fallbackColor,
      backgroundImage: bgRegistry.image ? `linear-gradient(${bgRegistry.overlay}, ${bgRegistry.overlay}), url('${bgRegistry.image}')` : `radial-gradient(circle at center, #1b263b 0%, #0d1b2a 100%)`,
      color: '#ffffff'
    };
  }

  // "Maşallah" Başlık Yazısı Dil Ayarı
  const masallahText = language === 'en' ? 'Mashallah' : 'Maşallah';
  const tagText = language === 'en' ? 'Circumcision Ceremony' : 'Sünnet Merasimi';

  // 2. THEMATIC ASSET REGISTRY ÇAĞRILARI
  const nazarAsset = thematicAssetRegistry['nazar-boncugu'] || { src: '' };
  const hasMaps = !!wedding.google_maps_url;
  const showRsvp = wedding.show_rsvp !== false;

  return (
    <div 
      className="max-w-[550px] mx-auto w-full my-8 relative z-10 animate-fade-in font-sans"
      style={{ fontFamily: `"${bodyFont}", serif`, ...bgStyle }}
    >
      {/* Sünnet Kartı Container */}
      <div 
        className="relative rounded-[2.5rem] overflow-hidden p-6 sm:p-10 text-center border flex flex-col items-center justify-between min-h-[620px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)]"
        style={{ borderColor: `${metalicTextColor}30` }}
      >
        {/* DEKORATİF ASSETLER VE NAZAR BONCUKLARI (pointer-events: none) */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none opacity-20">
          {/* Sol Üst Hilal / Yıldız SVG */}
          <div className="absolute top-8 left-8 rotate-[-15deg]">
            <svg className="w-12 h-12 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
          </div>

          {/* Sağ Üst Nazar Boncuğu (Registry veya Fallback SVG) */}
          <div className="absolute top-12 right-12 rotate-[15deg] motion-safe:animate-pulse">
            {nazarAsset.src ? (
              <img src={nazarAsset.src} alt="Nazar Boncuğu" className="w-12 h-12 object-contain" />
            ) : (
              <svg className="w-12 h-12 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" stroke="#ffffff" strokeWidth="1"/>
                <circle cx="12" cy="12" r="6" fill="#ffffff"/>
                <circle cx="12" cy="12" r="3" fill="#000000"/>
              </svg>
            )}
          </div>
        </div>

        {/* Lüks Metalik Çerçeve */}
        <div className="absolute inset-4 sm:inset-6 rounded-[2rem] pointer-events-none z-0 border border-transparent">
          <div 
            className="absolute inset-0 rounded-[2rem] border" 
            style={{ 
              borderImage: `${metalicBorder} 1`,
              borderWidth: '1.5px',
              filter: variant !== 'white-marble' ? `drop-shadow(0 0 2px ${metalicTextColor}40)` : 'none'
            }} 
          />
        </div>

        {/* GÜVENLİ İÇERİK ALANI */}
        <div className="relative z-10 w-full flex flex-col items-center">
          
          {/* Logo / Mühür ("Maşallah" Amblem Alanı) */}
          <div className="flex flex-col items-center mb-4 select-none">
            <div 
              className="py-1 px-4 rounded-full border text-[11px] font-bold tracking-widest uppercase flex items-center gap-1.5 shadow-sm"
              style={{ 
                borderColor: `${metalicTextColor}50`, 
                color: metalicTextColor,
                backgroundColor: 'rgba(0,0,0,0.05)',
                textShadow: variant !== 'white-marble' ? metalicTextShadow : 'none'
              }}
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>{masallahText}</span>
            </div>
          </div>

          {/* Sünnet Merasimi Başlığı */}
          <h3 className="font-semibold tracking-[0.25em] uppercase text-[10px] mb-4 opacity-75" style={{ color: metalicTextColor }}>
            {tagText}
          </h3>

          {/* Çocuğun İsmi */}
          <div className="w-full mb-6">
            <h1 
              className="text-3xl sm:text-4xl font-normal leading-tight tracking-wide w-full"
              style={{ color: variant === 'white-marble' ? '#1e293b' : '#ffffff', fontFamily: `"${headingFont}", serif` }}
            >
              {wedding.bride_name || 'Sevgili Oğlumuz'}
            </h1>
            
            {/* Anne Baba Detayı */}
            {(wedding.bride_parents || wedding.groom_parents) && (
              <p className="text-[10px] tracking-[0.25em] font-light mt-3 opacity-70 uppercase font-sans">
                {wedding.bride_parents ? `ANNE: ${wedding.bride_parents}` : ''}
                {wedding.groom_parents ? ` • BABA: ${wedding.groom_parents}` : ''}
              </p>
            )}
          </div>

          {/* Davet Notu / Sözü */}
          <div className="my-2 leading-relaxed text-sm">
            {renderQuote()}
          </div>

          {/* Sayaç */}
          <div className="w-full my-4">
            {renderTimer()}
          </div>

          {/* Tarih ve Mekan Detayları */}
          <div className="w-full max-w-sm text-xs font-semibold my-6 space-y-2.5">
            <div className="flex items-center gap-3 py-2.5 px-4 rounded-xl border bg-black/15" style={{ borderColor: `${metalicTextColor}20` }}>
              <Calendar className="w-4 h-4 shrink-0" style={{ color: metalicTextColor }} />
              <span>{dateStr} <span className="mx-1 opacity-40">|</span> {timeStr}</span>
            </div>

            <div className="flex flex-col items-start gap-1 p-4 rounded-xl border bg-black/15 text-left" style={{ borderColor: `${metalicTextColor}20` }}>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 shrink-0" style={{ color: metalicTextColor }} />
                <span className="font-bold">{wedding.venue_name || 'Mekan Belirtilmedi'}</span>
              </div>
              {wedding.venue_address && (
                <p className="text-[11px] font-light opacity-90 pl-6 leading-relaxed">{wedding.venue_address}</p>
              )}
            </div>
          </div>

          {/* OVAL BUTONLAR (MIN 48PX, DOKUNMATİK UYUMLU) */}
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
                  backgroundColor: 'rgba(0, 0, 0, 0.3)'
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
