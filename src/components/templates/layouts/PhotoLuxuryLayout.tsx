'use client';
import React from 'react';
import { Calendar, MapPin, Navigation } from 'lucide-react';

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

export default function PhotoLuxuryLayout({
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

  // Focal point coordinates (Default: 50% 50%)
  const focalX = wedding.photo_focal_point?.x ?? 50;
  const focalY = wedding.photo_focal_point?.y ?? 50;
  const objectPosition = `${focalX}% ${focalY}%`;

  // Çift fotoğrafı
  const couplePhoto = wedding.bride_photo_url || wedding.groom_photo_url || wedding.background_image_url || '';

  // Transparan bilgi paneli stili (Siyah, Bordo, Zümrüt Yeşili)
  const isDarkLayout = wedding.is_dark_mode || false;
  let panelBg = 'rgba(255, 255, 255, 0.9)';
  const frameColor = 'linear-gradient(135deg, #dfb76c 0%, #c5a880 50%, #dfb76c 100%)';

  if (wedding.envelope_bg_color === 'black-gold-velvet') {
    panelBg = 'rgba(15, 15, 15, 0.88)';
  } else if (wedding.envelope_bg_color === 'solid-burgundy') {
    panelBg = 'rgba(69, 10, 10, 0.88)';
  } else if (wedding.envelope_bg_color === 'emerald-marble') {
    panelBg = 'rgba(6, 78, 59, 0.88)';
  } else if (isDarkLayout) {
    panelBg = 'rgba(18, 19, 26, 0.9)';
  }

  return (
    <div 
      className="max-w-[550px] mx-auto w-full my-8 relative z-10 animate-fade-in"
      style={{ fontFamily: `"${bodyFont}", serif` }}
    >
      <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl bg-slate-900 border border-white/5">
        
        {/* ÜST BÖLÜM: EN-BOY ORANI KORUNMUŞ ÇİFT FOTOĞRAFI */}
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] overflow-hidden z-0 bg-slate-950">
          {couplePhoto ? (
            <img 
              src={couplePhoto} 
              alt="Çift Fotoğrafı"
              className="w-full h-full object-cover transition-all duration-500"
              style={{ objectPosition }}
              loading="lazy"
            />
          ) : (
            // Fotoğraf olmadığında gösterilecek şık lüks fallback gradient
            <div 
              className="w-full h-full flex flex-col items-center justify-center text-center p-6 bg-radial-gradient"
              style={{ 
                background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)',
                color: '#dfb76c' 
              }}
            >
              <span className="text-4xl sm:text-6xl opacity-35 font-serif font-light mb-4 select-none">
                {groomInitial ? `${brideInitial} & ${groomInitial}` : brideInitial}
              </span>
              <p className="text-xs uppercase tracking-[0.25em] opacity-40 font-sans">Aşkın En Güzel Hali</p>
            </div>
          )}

          {/* FOTOĞRAFTAN BİLGİ ALANINA GRADIENT GEÇİŞ MASKI */}
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent pointer-events-none z-10" />
        </div>

        {/* ALT BÖLÜM: BİLGİ PANELİ VE ALTIN VARAKLI ÇERÇEVE */}
        <div 
          className="relative px-6 sm:px-10 py-10 text-center z-10 flex flex-col items-center justify-between"
          style={{ backgroundColor: panelBg, color: textColor }}
        >
          {/* Lüks Varak Efektli Çift Hatlı Altın Çerçeve */}
          <div className="absolute inset-4 sm:inset-6 rounded-[1.8rem] pointer-events-none z-0 border border-transparent shadow-[inset_0_0_15px_rgba(223,183,108,0.2)]">
            <div 
              className="absolute inset-0 rounded-[1.8rem] border" 
              style={{ 
                borderImage: `${frameColor} 1`,
                borderWidth: '1.5px',
                boxShadow: '0 0 5px rgba(223,183,108,0.3)'
              }} 
            />
            <div 
              className="absolute inset-1 rounded-[1.6rem] border opacity-45" 
              style={{ 
                borderImage: `${frameColor} 1`,
                borderWidth: '0.5px'
              }} 
            />
          </div>

          <div className="relative z-10 w-full flex flex-col items-center">
            {/* Botanik Çelenk ve Monogram Logosu */}
            <div className="flex flex-col items-center mb-6 select-none opacity-85">
              <div 
                className="w-12 h-12 rounded-full border flex items-center justify-center font-serif text-base font-bold shadow-xs relative"
                style={{ 
                  borderColor: '#dfb76c', 
                  backgroundImage: 'linear-gradient(135deg, rgba(223,183,108,0.1) 0%, rgba(255,255,255,0) 100%)' 
                }}
              >
                {/* 3D Gold Accent Leaf Details around */}
                <span className="absolute -top-1.5 text-xs text-[#dfb76c]">🌿</span>
                <span style={{ color: '#dfb76c' }}>
                  {groomInitial ? `${brideInitial}${groomInitial}` : brideInitial}
                </span>
              </div>
            </div>

            {/* Davet Başlığı */}
            <h3 className="font-semibold tracking-[0.25em] uppercase text-[10px] mb-4 opacity-75" style={{ color: primaryColor }}>
              {eventTitle}
            </h3>

            {/* Gelin ve Damat Adları */}
            <div className="w-full mb-6">
              {wedding.bride_parents && (
                <p className="text-[9px] tracking-[0.2em] font-light mb-3 opacity-60 uppercase font-sans">
                  {wedding.bride_parents}
                </p>
              )}
              <h1 
                className="text-2xl sm:text-3xl font-normal leading-snug tracking-wide w-full"
                style={{ color: primaryColor, fontFamily: `"${headingFont}", serif` }}
              >
                {wedding.bride_name}
              </h1>
              <div className="my-1.5 text-sm italic opacity-55" style={{ fontFamily: `"${accentFont}", cursive` }}>
                and
              </div>
              <h1 
                className="text-2xl sm:text-3xl font-normal leading-snug tracking-wide w-full"
                style={{ color: primaryColor, fontFamily: `"${headingFont}", serif` }}
              >
                {wedding.groom_name}
              </h1>
              {wedding.groom_parents && (
                <p className="text-[9px] tracking-[0.2em] font-light mt-3 opacity-60 uppercase font-sans">
                  {wedding.groom_parents}
                </p>
              )}
            </div>

            {/* Davet Mesajı */}
            {renderQuote()}

            {/* Geri Sayım */}
            {renderTimer()}

            {/* Tarih ve Adres Detayları */}
            <div className="w-full max-w-xs text-xs font-semibold my-6 space-y-2">
              <div 
                className="flex items-center gap-3 py-2.5 px-4 rounded-xl border bg-black/5" 
                style={{ borderColor: `${primaryColor}15` }}
              >
                <Calendar className="w-4 h-4 shrink-0" style={{ color: primaryColor }} />
                <span>{dateStr} <span className="mx-1 opacity-40">|</span> {timeStr}</span>
              </div>

              <div 
                className="flex flex-col items-start gap-1 p-4 rounded-xl border bg-black/5 text-left" 
                style={{ borderColor: `${primaryColor}15` }}
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 shrink-0" style={{ color: primaryColor }} />
                  <span className="font-bold">{wedding.venue_name || 'Mekan Belirtilmedi'}</span>
                </div>
                {wedding.venue_address && (
                  <p className="text-[11px] font-light opacity-80 pl-6 leading-relaxed">{wedding.venue_address}</p>
                )}
              </div>
            </div>

            {/* Buton Grubu */}
            {renderRsvpButton()}

            {/* Anı Defteri */}
            {renderGuestBook()}
          </div>
        </div>
      </div>
    </div>
  );
}
