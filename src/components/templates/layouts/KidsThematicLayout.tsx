'use client';
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Navigation, Gift, Sparkles } from 'lucide-react';
import { thematicAssetRegistry } from '@/lib/registries';

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
  const brideInitial = wedding.bride_name ? wedding.bride_name.trim().charAt(0) : '👶';

  // 1. VARYANT BELİRLEME (Öncelik: genderVariant, custom_overrides, en son metin taraması fallback)
  const eventTypeRaw = (wedding.event_type || '').toLowerCase();
  const overrides = wedding.custom_overrides || {};
  const genderVariant = overrides.gender_variant || wedding.gender_variant || '';

  let variant: 'girl' | 'boy' | 'neutral' = 'neutral';
  let badgeText = 'Hoş Geldin Bebek';

  if (genderVariant === 'girl' || genderVariant === 'kiz') {
    variant = 'girl';
  } else if (genderVariant === 'boy' || genderVariant === 'erkek') {
    variant = 'boy';
  } else if (genderVariant === 'neutral') {
    variant = 'neutral';
  } else {
    // Geriye dönük metin taraması fallback
    if (eventTypeRaw.includes('girl') || eventTypeRaw.includes('kiz') || eventTypeRaw.includes('kina')) {
      variant = 'girl';
    } else if (eventTypeRaw.includes('boy') || eventTypeRaw.includes('erkek') || eventTypeRaw.includes('sunnet')) {
      variant = 'boy';
    }
  }

  // Badge Text Kararı
  if (eventTypeRaw.includes('birthday') || eventTypeRaw.includes('dogum')) {
    badgeText = 'İyi ki Doğdun';
  } else if (eventTypeRaw.includes('shower')) {
    badgeText = 'Baby Shower';
  }

  if (overrides.kids_age) {
    badgeText = `${overrides.kids_age} Yaşında!`;
  } else if (eventTypeRaw.includes('birthday') || eventTypeRaw.includes('dogum')) {
    badgeText = '1 Yaşında!';
  }

  // 2. VARYANT RENK VE STİLLERİ
  let kidThemeColor = primaryColor || '#f472b6'; // Default pink
  let kidBgGradient = 'from-pink-50 via-rose-50 to-pink-100';
  let cardShadow = 'shadow-pink-200/50';

  if (variant === 'boy') {
    kidThemeColor = primaryColor || '#60a5fa'; // Blue
    kidBgGradient = 'from-blue-50 via-sky-50 to-blue-100';
    cardShadow = 'shadow-blue-200/50';
  } else if (variant === 'neutral') {
    kidThemeColor = primaryColor || '#34d399'; // Mint/Green
    kidBgGradient = 'from-teal-50 via-amber-50 to-emerald-100';
    cardShadow = 'shadow-emerald-200/50';
  }

  // 3. ASSET REGISTRY YÜKLEMESİ VE FALLBACK'LER
  const hasMaps = !!wedding.google_maps_url;
  const showRsvp = wedding.show_rsvp !== false;

  return (
    <div 
      className="max-w-[550px] mx-auto w-full my-8 relative z-10 animate-fade-in font-sans"
      style={{ fontFamily: `"${bodyFont}", sans-serif` }}
    >
      {/* Çocuk Konseptine Özel Yumuşak Bulut & Balon Degradeli Zemin Kartı */}
      <div 
        className={`relative rounded-[3rem] overflow-hidden shadow-2xl p-8 sm:p-12 text-center border flex flex-col items-center justify-between min-h-[600px] ${cardShadow}`}
        style={{ borderColor: `${kidThemeColor}25`, backgroundColor: cardBgColor, color: textColor }}
      >
        
        {/* ARKA PLAN DEKORATİF RESİMLER (pointer-events: none) */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none opacity-[0.12]">
          {variant === 'girl' && (
            <>
              {/* Sol Üst Taç SVG */}
              <div className="absolute top-8 left-8 rotate-[-12deg] motion-safe:animate-bounce">
                <svg className="w-12 h-12 text-pink-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2 22h20v-2H2v2zm1-4h18V9l-4 4-5-8-5 8-4-4v9z"/>
                </svg>
              </div>
              {/* Sağ Üst Kelebek/Kalp SVG */}
              <div className="absolute top-16 right-10 rotate-[15deg] motion-safe:animate-pulse">
                <svg className="w-10 h-10 text-rose-300" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              {/* Sol Alt Yıldız SVG */}
              <div className="absolute bottom-16 left-12 motion-safe:animate-bounce">
                <svg className="w-8 h-8 text-rose-200" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
              </div>
              {/* Sağ Alt Çiçek SVG */}
              <div className="absolute bottom-12 right-12 rotate-[45deg]">
                <svg className="w-12 h-12 text-pink-300" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </div>
            </>
          )}

          {variant === 'boy' && (
            <>
              {/* Sol Üst Bulut SVG */}
              <div className="absolute top-10 left-8 motion-safe:animate-pulse">
                <svg className="w-14 h-10 text-sky-200" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
                </svg>
              </div>
              {/* Sağ Üst Balon SVG */}
              <div className="absolute top-12 right-12 rotate-[10deg] motion-safe:animate-bounce">
                <svg className="w-8 h-12 text-blue-300" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a6 6 0 00-6 6c0 3.6 3.5 6.4 5.3 7.7a1 1 0 001.4 0c1.8-1.3 5.3-4.1 5.3-7.7A6 6 0 0012 2zm0 13c-.3 0-.5-.1-.7-.2C9.5 13.5 7 11.2 7 8a5 5 0 0110 0c0 3.2-2.5 5.5-4.3 6.8-.2.1-.4.2-.7.2z"/>
                </svg>
              </div>
              {/* Sol Alt Yıldız SVG */}
              <div className="absolute bottom-16 left-12 motion-safe:animate-pulse">
                <svg className="w-8 h-8 text-sky-200" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
              </div>
            </>
          )}

          {variant === 'neutral' && (
            <>
              {/* Sol Üst Gökkuşağı/Yıldız SVG */}
              <div className="absolute top-8 left-8 motion-safe:animate-pulse">
                <svg className="w-12 h-12 text-emerald-200" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                </svg>
              </div>
              {/* Sağ Üst Bulut SVG */}
              <div className="absolute top-16 right-12 rotate-[10deg]">
                <svg className="w-12 h-10 text-amber-200" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
                </svg>
              </div>
            </>
          )}
        </div>

        {/* GÜVENLİ İÇERİK ALANI (Tüm metinler z-10 katmanında toplanır) */}
        <div className="relative z-10 w-full flex flex-col items-center">
          
          {/* Sevimli Başlık Rozeti ("1 Yaşında!", "Hoş Geldin Bebek" vb.) */}
          <div className="flex flex-col items-center mb-6 select-none">
            <div 
              className="py-1.5 px-5 rounded-full border text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 shadow-xs"
              style={{ 
                borderColor: `${kidThemeColor}40`, 
                color: kidThemeColor, 
                backgroundColor: `${kidThemeColor}08` 
              }}
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>{badgeText}</span>
            </div>
          </div>

          {/* Etkinlik Başlığı */}
          <h3 className="font-semibold tracking-[0.25em] uppercase text-[10px] mb-4 opacity-75" style={{ color: kidThemeColor }}>
            {eventTitle}
          </h3>

          {/* Çocuğun İsmi */}
          <div className="w-full mb-6">
            <h1 
              className="text-3xl sm:text-4xl font-normal leading-tight tracking-wide w-full"
              style={{ color: kidThemeColor, fontFamily: `"${headingFont}", cursive` }}
            >
              {wedding.bride_name || 'Bebeğimiz'}
            </h1>
            
            {/* Eğer anne-baba adı girilmişse detay olarak göster */}
            {(wedding.bride_parents || wedding.groom_parents) && (
              <p className="text-[10px] tracking-[0.25em] font-light mt-3 opacity-60 uppercase font-sans">
                {wedding.bride_parents ? `ANNE: ${wedding.bride_parents}` : ''} 
                {wedding.groom_parents ? ` • BABA: ${wedding.groom_parents}` : ''}
              </p>
            )}
          </div>

          {/* Özlü Söz veya Davet Metni */}
          {renderQuote()}

          {/* Sayaç */}
          <div className="w-full my-4">
            {renderTimer()}
          </div>

          {/* Tarih ve Adres Kartları */}
          <div className="w-full max-w-sm text-xs font-semibold my-6 space-y-2.5">
            <div className="flex items-center gap-3 py-3 px-5 rounded-2xl border bg-black/2" style={{ borderColor: `${kidThemeColor}15` }}>
              <Calendar className="w-4 h-4 shrink-0" style={{ color: kidThemeColor }} />
              <span>{dateStr} <span className="mx-1 opacity-40">|</span> {timeStr}</span>
            </div>

            <div className="flex flex-col items-start gap-1 p-4 rounded-2xl border bg-black/2 text-left" style={{ borderColor: `${kidThemeColor}15` }}>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 shrink-0" style={{ color: kidThemeColor }} />
                <span className="font-bold">{wedding.venue_name || 'Mekan Belirtilmedi'}</span>
              </div>
              {wedding.venue_address && (
                <p className="text-[11px] font-light opacity-80 pl-6 leading-relaxed">{wedding.venue_address}</p>
              )}
            </div>
          </div>

          {/* DOKUNMATİK UYUMLU SEVİMLİ OVAL BUTONLAR (MIN 48PX) */}
          <div className="w-full max-w-sm flex flex-col gap-3 mt-4">
            
            {/* Buton 1: KONUMA GİT */}
            {hasMaps && (
              <button 
                type="button"
                onClick={handleMapClick}
                className="w-full h-12 rounded-full border flex items-center justify-between px-6 font-bold text-xs tracking-wider uppercase transition-all duration-300 hover:scale-102 active:scale-98 cursor-pointer focus-visible:ring-2 focus-visible:outline-none"
                style={{ 
                  borderColor: `${kidThemeColor}30`, 
                  color: kidThemeColor,
                  backgroundColor: 'rgba(255, 255, 255, 0.5)'
                }}
              >
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4" />
                  <span>KONUMA GİT</span>
                </div>
                <span>&rarr;</span>
              </button>
            )}

            {/* Buton 2: HEDİYE / BEBEK İHTİYAÇ LİSTESİ BİLGİSİ */}
            {wedding.bank_iban && (
              <div 
                className="w-full p-4 rounded-3xl border text-left text-[11px] leading-relaxed bg-amber-500/5"
                style={{ borderColor: `${kidThemeColor}15` }}
              >
                <div className="flex items-center gap-2 font-bold mb-1" style={{ color: kidThemeColor }}>
                  <Gift className="w-4 h-4 shrink-0" />
                  <span>HEDİYE & BEBEK LİSTESİ</span>
                </div>
                <p className="opacity-90">{wedding.bank_iban}</p>
              </div>
            )}

            {/* Buton 3: KATILIM ANKETİ / LCV BİLDİRİMİ */}
            {showRsvp && renderRsvpButton()}
          </div>

          {/* Anı Defteri */}
          {renderGuestBook()}
        </div>
      </div>
    </div>
  );
}
