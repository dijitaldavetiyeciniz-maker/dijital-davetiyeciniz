'use client';
import React from 'react';
import { Calendar, MapPin, Navigation } from 'lucide-react';
import { backgroundDesignRegistry } from '@/lib/registries';

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

export default function MinimalPaperLayout({
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
  cardBgColor = '#fcfbf7', // Krem rengi kağıt fallback
  mode = 'public'
, selectedBackground}: LayoutProps) {
  const brideInitial = wedding.bride_name ? wedding.bride_name.trim().charAt(0) : 'E';
  const groomInitial = wedding.groom_name ? wedding.groom_name.trim().charAt(0) : '';

  // 1. MİNİMALİST RENK VE TİPOGRAFİ VARYANTLARI
  // custom_overrides.minimal_variant: 'gold' | 'green' | 'black' | 'earth'
  const minimalVariant = wedding.custom_overrides?.minimal_variant || 'gold';

  let accentColor = primaryColor || '#d6a84f'; // Gold default
  let borderLineStyle = 'rgba(214, 168, 79, 0.2)';

  if (minimalVariant === 'green') {
    accentColor = '#164e63'; // Koyu yeşil/cyan
    borderLineStyle = 'rgba(22, 78, 99, 0.2)';
  } else if (minimalVariant === 'black') {
    accentColor = '#0f172a'; // Siyah/lacivert
    borderLineStyle = 'rgba(15, 23, 42, 0.15)';
  } else if (minimalVariant === 'earth') {
    accentColor = '#7c2d12'; // Toprak/kiremit
    borderLineStyle = 'rgba(124, 45, 18, 0.2)';
  }

  // 2. PAMUKLU/KREM KAĞIT DOKUSU (backgroundDesignRegistry üzerinden birincil yükleme)
  const bgRegistry = backgroundDesignRegistry[wedding.background_design || 'white-gold-marble'] || backgroundDesignRegistry['white-gold-marble'];
  
  const backgroundStyle: React.CSSProperties = {
    backgroundColor: bgRegistry.fallbackColor || cardBgColor,
    backgroundImage: bgRegistry.image ? `linear-gradient(${bgRegistry.overlay}, ${bgRegistry.overlay}), url('${bgRegistry.image}')` : undefined,
    backgroundSize: bgRegistry.size,
    backgroundPosition: bgRegistry.position,
    backgroundRepeat: bgRegistry.repeat,
    boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
  };

  const hasMaps = !!wedding.google_maps_url;
  const showRsvp = wedding.show_rsvp !== false;

  return (
    <div 
      className="max-w-[520px] mx-auto w-full my-8 relative z-10 animate-fade-in font-sans"
      style={{ ...(selectedBackground?.background ? { background: selectedBackground.background } : {}), fontFamily: `"${bodyFont}", serif` }}
    >
      {/* İnce Kırık Beyaz / Pamuklu Kağıt Kart Zemin */}
      <div 
        className="relative rounded-[2rem] overflow-hidden p-8 sm:p-14 text-center border flex flex-col items-center justify-between min-h-[600px]"
        style={{ ...backgroundStyle, borderColor: borderLineStyle }}
      >
        
        {/* Güvenli İçerik Katmanı */}
        <div className="relative z-10 w-full flex flex-col items-center">
          
          {/* İnce Altın/Metalik Çizgi Varak Süslemesi */}
          <div className="w-16 h-[1.5px] mb-8" style={{ backgroundColor: accentColor }} />

          {/* Minimalist Monogram Rozet */}
          <div className="flex flex-col items-center mb-6 select-none opacity-80">
            <div 
              className="text-2xl sm:text-3xl font-serif font-light tracking-[0.2em] uppercase leading-none"
              style={{ color: accentColor }}
            >
              {groomInitial ? `${brideInitial}•${groomInitial}` : brideInitial}
            </div>
            <div className="w-8 h-[0.5px] mt-2 opacity-50" style={{ backgroundColor: accentColor }} />
          </div>

          {/* Davet Türü */}
          <h3 className="font-sans font-bold tracking-[0.3em] uppercase text-[9px] mb-6 opacity-60" style={{ color: accentColor }}>
            {eventTitle}
          </h3>

          {/* Gelin & Damat İsimleri (Editoryal Sade Tipografi) */}
          <div className="w-full mb-6">
            {wedding.bride_parents && (
              <p className="text-[9px] tracking-[0.2em] font-light mb-4 opacity-50 uppercase font-sans">
                {wedding.bride_parents}
              </p>
            )}
            <h1 
              className="text-3xl sm:text-4xl font-light leading-snug tracking-wide"
              style={{ color: textColor, fontFamily: `"${headingFont}", serif` }}
            >
              {wedding.bride_name}
            </h1>
            <div className="my-2.5 text-xs opacity-35 font-sans uppercase tracking-[0.35em] font-light">&</div>
            <h1 
              className="text-3xl sm:text-4xl font-light leading-snug tracking-wide"
              style={{ color: textColor, fontFamily: `"${headingFont}", serif` }}
            >
              {wedding.groom_name}
            </h1>
            {wedding.groom_parents && (
              <p className="text-[9px] tracking-[0.2em] font-light mt-4 opacity-50 uppercase font-sans">
                {wedding.groom_parents}
              </p>
            )}
          </div>

          {/* Sade Davet Metni */}
          <div className="my-3 leading-relaxed text-sm font-light italic max-w-sm" style={{ color: textColor }}>
            {renderQuote()}
          </div>

          {/* Geri Sayım Sayacı */}
          <div className="w-full my-4">
            {renderTimer()}
          </div>

          {/* Tarih ve Mekan Detayları */}
          <div className="w-full max-w-xs text-xs my-6 space-y-3 font-light text-slate-700">
            <div className="flex items-center gap-3 py-2 px-3 rounded-lg border bg-slate-50/50" style={{ borderColor: borderLineStyle }}>
              <Calendar className="w-4 h-4 shrink-0" style={{ color: accentColor }} />
              <span className="tracking-wide">{dateStr} | {timeStr}</span>
            </div>

            <div className="flex flex-col items-start gap-1 p-3.5 rounded-lg border bg-slate-50/50 text-left" style={{ borderColor: borderLineStyle }}>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 shrink-0" style={{ color: accentColor }} />
                <span className="font-medium tracking-wide text-slate-800">{wedding.venue_name || 'Mekan Belirtilmedi'}</span>
              </div>
              {wedding.venue_address && (
                <p className="text-[11px] font-light opacity-80 pl-6 leading-relaxed text-slate-600">{wedding.venue_address}</p>
              )}
            </div>
          </div>

          {/* MİNİMAL OVAL AKSİYON BUTONLARI (MIN 48PX) */}
          <div className="w-full max-w-xs flex flex-col gap-3 mt-4">
            
            {/* Buton 1: KONUMA GİT */}
            {hasMaps && (
              <button 
                type="button"
                onClick={handleMapClick}
                className="w-full h-12 rounded-lg border flex items-center justify-between px-5 font-medium text-xs tracking-wider uppercase transition-all duration-300 hover:bg-slate-50 active:scale-98 cursor-pointer focus-visible:ring-1 focus-visible:outline-none"
                style={{ 
                  borderColor: accentColor, 
                  color: accentColor,
                  backgroundColor: 'rgba(255, 255, 255, 0.4)'
                }}
              >
                <span>KONUMA GİT</span>
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
