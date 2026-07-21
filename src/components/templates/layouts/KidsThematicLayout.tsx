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

  // 1. VARYANT BELİRLEME (Kız, Erkek, Nötr)
  // event_type values can be: 'baby_shower_girl', 'baby_shower_boy', 'birthday_girl', 'birthday_boy', etc.
  const eventTypeRaw = (wedding.event_type || '').toLowerCase();
  
  let variant: 'girl' | 'boy' | 'neutral' = 'neutral';
  let badgeText = 'Hoş Geldin Bebek';

  if (eventTypeRaw.includes('girl') || eventTypeRaw.includes('kiz') || eventTypeRaw.includes('kina')) {
    variant = 'girl';
    badgeText = eventTypeRaw.includes('birthday') ? 'İyi ki Doğdun' : 'Baby Shower';
  } else if (eventTypeRaw.includes('boy') || eventTypeRaw.includes('erkek') || eventTypeRaw.includes('sunnet')) {
    variant = 'boy';
    badgeText = eventTypeRaw.includes('birthday') ? 'İyi ki Doğdun' : 'Baby Shower';
  } else {
    // Default neutral configurations
    if (eventTypeRaw.includes('birthday')) badgeText = 'İyi ki Doğdun';
    else if (eventTypeRaw.includes('shower')) badgeText = 'Baby Shower';
  }

  // Özel rozet metni (örneğin yaş bilgisi girilmişse)
  if (wedding.custom_overrides?.kids_age) {
    badgeText = `${wedding.custom_overrides.kids_age} Yaşında!`;
  } else if (eventTypeRaw.includes('birthday')) {
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
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none opacity-25">
          {variant === 'girl' && (
            <>
              {/* Sol Üst Taç / Kelebek Fallback */}
              <div className="absolute top-8 left-8 text-5xl rotate-[-12deg] motion-safe:animate-bounce">👑</div>
              {/* Sağ Üst Kelebek */}
              <div className="absolute top-16 right-10 text-4xl rotate-[15deg] motion-safe:animate-pulse">🦋</div>
              {/* Sol Alt Yıldız */}
              <div className="absolute bottom-16 left-12 text-3xl motion-safe:animate-bounce">⭐</div>
              {/* Sağ Alt Pastel Çiçek */}
              <div className="absolute bottom-12 right-12 text-5xl rotate-[45deg]">🌸</div>
            </>
          )}

          {variant === 'boy' && (
            <>
              {/* Sol Üst Bulut Fallback */}
              <div className="absolute top-10 left-8 text-5xl motion-safe:animate-pulse">☁️</div>
              {/* Sağ Üst Uçan Balon */}
              <div className="absolute top-12 right-12 text-5xl rotate-[10deg] motion-safe:animate-bounce">🎈</div>
              {/* Sol Alt Oyuncak Araba */}
              <div className="absolute bottom-20 left-10 text-4xl rotate-[-5deg]">🚗</div>
              {/* Sağ Alt Roket / Yıldız */}
              <div className="absolute bottom-12 right-14 text-4xl rotate-[35deg] motion-safe:animate-pulse">🚀</div>
            </>
          )}

          {variant === 'neutral' && (
            <>
              {/* Sol Üst Gökkuşağı Fallback */}
              <div className="absolute top-8 left-8 text-5xl motion-safe:animate-pulse">🌈</div>
              {/* Sağ Üst Sevimli Hayvan / Tavşan */}
              <div className="absolute top-16 right-12 text-5xl rotate-[10deg]">🐰</div>
              {/* Sol Alt Bulut */}
              <div className="absolute bottom-16 left-14 text-4xl">☁️</div>
              {/* Sağ Alt Yaprak / Doğa */}
              <div className="absolute bottom-10 right-10 text-5xl rotate-[-25deg]">🌿</div>
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
