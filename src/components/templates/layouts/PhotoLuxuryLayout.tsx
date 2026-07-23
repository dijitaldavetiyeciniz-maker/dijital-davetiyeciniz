'use client';
import React from 'react';
import { Calendar, MapPin, Navigation, Clock } from 'lucide-react';
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
  const overrides = wedding.custom_overrides || {};
  const focalX = overrides.photoFocalPoint?.x ?? wedding.photo_focal_point?.x ?? 50;
  const focalY = overrides.photoFocalPoint?.y ?? wedding.photo_focal_point?.y ?? 50;
  const objectPosition = `${focalX}% ${focalY}%`;

  // Çift fotoğrafı
  const couplePhoto = wedding.bride_photo_url || wedding.groom_photo_url || wedding.background_image_url || '';

  // Transparan bilgi paneli rengi (Siyah, Bordo, Zümrüt Yeşili lüks varyasyonları)
  let panelBg = 'rgba(255, 255, 255, 0.9)';
  const frameColor = 'linear-gradient(135deg, #dfb76c 0%, #c5a880 50%, #dfb76c 100%)'; // Lüks Altın Varak

  const bgDesign = overrides.backgroundDesign || wedding.background_design || '';
  if (bgDesign === 'emerald-luxury-marble' || bgDesign.includes('emerald') || primaryColor === '#dfb76c') {
    panelBg = 'rgba(2, 44, 34, 0.92)'; // Derin Zümrüt Yeşili
  } else if (bgDesign === 'royal-burgundy-velvet' || bgDesign.includes('burgundy')) {
    panelBg = 'rgba(76, 5, 25, 0.92)'; // Bordo
  } else if (bgDesign === 'royal-black-tie' || bgDesign.includes('black') || wedding.is_dark_mode) {
    panelBg = 'rgba(15, 15, 15, 0.92)'; // Lüks Siyah
  }

  const hasMaps = !!wedding.google_maps_url;
  const showRsvp = wedding.show_rsvp !== false;

  return (
    <div 
      className="max-w-[550px] mx-auto w-full my-8 relative z-10 animate-fade-in text-slate-800"
      style={{ fontFamily: `"${bodyFont}", serif` }}
    >
      <div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] bg-slate-950 border border-white/5">
        
        {/* EN-BOY ORANI KORUNMUŞ FOTOĞRAF ALANI */}
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] overflow-hidden z-0 bg-slate-950">
          {couplePhoto ? (
            <SafeImage 
              src={couplePhoto} 
              alt="Çift Fotoğrafı"
              className="w-full h-full object-cover transition-all duration-700 ease-out hover:scale-105"
              style={{ objectPosition }}
              isHero={true}
            />
          ) : (
            // Lüks Fallback Degradesi
            <div 
              className="w-full h-full flex flex-col items-center justify-center text-center p-6 bg-radial-gradient"
              style={{ 
                background: 'radial-gradient(circle at center, #022c22 0%, #011510 100%)',
                color: '#dfb76c' 
              }}
            >
              <span className="text-5xl sm:text-6xl opacity-35 font-serif font-light mb-4 select-none">
                {groomInitial ? `${brideInitial} & ${groomInitial}` : brideInitial}
              </span>
              <p className="text-xs uppercase tracking-[0.25em] opacity-40 font-sans">Sonsuz Bir Aşk Hikayesi</p>
            </div>
          )}

          {/* Yumuşak Karartıcı Degrade */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none z-10" />
        </div>

        {/* BİLGİ PANELİ VE ALTIN VARAKLI ÇERÇEVE */}
        <div 
          className="relative px-6 sm:px-10 py-12 text-center z-10 flex flex-col items-center justify-between min-h-[400px]"
          style={{ backgroundColor: panelBg, color: panelBg.includes('rgba(255') ? '#1e293b' : '#f8fafc' }}
        >
          {/* Lüks Altın Çerçeve */}
          <div className="absolute inset-4 sm:inset-6 rounded-[1.8rem] pointer-events-none z-0 border border-transparent shadow-[inset_0_0_15px_rgba(223,183,108,0.15)]">
            <div 
              className="absolute inset-0 rounded-[1.8rem] border" 
              style={{ 
                borderImage: `${frameColor} 1`,
                borderWidth: '1.5px',
                boxShadow: '0 0 4px rgba(223,183,108,0.2)'
              }} 
            />
          </div>

          <div className="relative z-10 w-full flex flex-col items-center">
            {/* Çelenkli Monogram */}
            <div className="flex flex-col items-center mb-6 select-none opacity-90">
              <div 
                className="w-14 h-14 rounded-full border-2 flex items-center justify-center font-serif text-base font-bold shadow-xs relative bg-black/10"
                style={{ borderColor: '#dfb76c' }}
              >
                <span className="absolute -top-1.5 text-xs text-[#dfb76c]">🌿</span>
                <span style={{ color: '#dfb76c' }}>
                  {groomInitial ? `${brideInitial}${groomInitial}` : brideInitial}
                </span>
              </div>
            </div>

            {/* Davet Tipi */}
            <h3 className="font-semibold tracking-[0.25em] uppercase text-[10px] mb-4 text-[#dfb76c]">
              {eventTitle}
            </h3>

            {/* İsimler */}
            <div className="w-full mb-6">
              {wedding.bride_parents && (
                <p className="text-[9px] tracking-[0.2em] font-light mb-3 opacity-60 uppercase font-sans">
                  {wedding.bride_parents}
                </p>
              )}
              <h1 
                className="text-3xl sm:text-4xl font-normal leading-snug tracking-wide w-full"
                style={{ color: primaryColor, fontFamily: `"${headingFont}", serif` }}
              >
                {wedding.bride_name}
              </h1>
              <div className="my-1.5 text-sm italic opacity-50" style={{ fontFamily: `"${accentFont}", cursive` }}>
                ve
              </div>
              <h1 
                className="text-3xl sm:text-4xl font-normal leading-snug tracking-wide w-full"
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
            <div className="my-3 leading-relaxed text-sm max-w-sm italic opacity-95">
              {renderQuote()}
            </div>

            {/* Geri Sayım */}
            <div className="w-full my-4 bg-black/10 p-4 rounded-2xl border border-white/5">
              {renderTimer()}
            </div>

            {/* Tarih ve Adres */}
            <div className="w-full max-w-xs text-xs font-semibold my-6 space-y-2">
              <div className="flex items-center gap-3 py-2.5 px-4 rounded-xl border bg-black/10 border-white/5">
                <Calendar className="w-4 h-4 shrink-0" style={{ color: primaryColor }} />
                <span>{dateStr} <span className="mx-1 opacity-40">|</span> {timeStr}</span>
              </div>

              <div className="flex flex-col items-start gap-1 p-4 rounded-xl border bg-black/10 border-white/5 text-left">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 shrink-0" style={{ color: primaryColor }} />
                  <span className="font-bold">{wedding.venue_name || 'Mekan Belirtilmedi'}</span>
                </div>
                {wedding.venue_address && (
                  <span className="text-[11px] font-light opacity-80 pl-6 leading-relaxed">{wedding.venue_address}</span>
                )}
              </div>
            </div>

            {/* RSVP */}
            {showRsvp && renderRsvpButton()}
          </div>
        </div>
      </div>
    </div>
  );
}
