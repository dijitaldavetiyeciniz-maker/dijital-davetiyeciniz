'use client';
import React from 'react';
import { Calendar, MapPin, Navigation, MoveRight } from 'lucide-react';
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

export default function SplitScreenLayout({
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

  // 1. SPLIT VARYASYONLARI
  // custom_overrides.split_ratio: '50-50' | '60-40' | '40-60'
  const ratio = wedding.custom_overrides?.split_ratio || '50-50';
  
  // custom_overrides.split_photo_side: 'left' | 'right'
  const photoSide = wedding.custom_overrides?.split_photo_side || 'left';

  // custom_overrides.split_mobile_order: 'photo-first' | 'content-first'
  const mobileOrder = wedding.custom_overrides?.split_mobile_order || 'photo-first';

  // Odak Noktası
  const focalX = wedding.photo_focal_point?.x ?? 50;
  const focalY = wedding.photo_focal_point?.y ?? 50;
  const objectPosition = `${focalX}% ${focalY}%`;

  // Çift fotoğrafı
  const couplePhoto = wedding.bride_photo_url || wedding.groom_photo_url || wedding.background_image_url || '';

  // 2. ORANLARA GÖRE CSS GRID COLSPAN HESAPLAMA
  let photoColSpan = 'md:col-span-6';
  let contentColSpan = 'md:col-span-6';

  if (ratio === '60-40') {
    photoColSpan = photoSide === 'left' ? 'md:col-span-7' : 'md:col-span-5';
    contentColSpan = photoSide === 'left' ? 'md:col-span-5' : 'md:col-span-7';
  } else if (ratio === '40-60') {
    photoColSpan = photoSide === 'left' ? 'md:col-span-5' : 'md:col-span-7';
    contentColSpan = photoSide === 'left' ? 'md:col-span-7' : 'md:col-span-5';
  }

  const hasMaps = !!wedding.google_maps_url;
  const showRsvp = wedding.show_rsvp !== false;

  return (
    <div 
      className="max-w-[550px] mx-auto w-full my-8 relative z-10 animate-fade-in font-sans"
      style={{ fontFamily: `"${bodyFont}", serif` }}
    >
      {/* Split Kart Container */}
      <div className="relative rounded-[2.2rem] overflow-hidden shadow-2xl bg-white border border-black/5 min-h-[600px]">
        
        {/* CSS GRID Yapısı (Masaüstünde Split, Mobilde Tek Sütun ve Seçilebilir Sürükleme Sırası) */}
        <div className="grid grid-cols-1 md:grid-cols-12 w-full min-h-[600px]">
          
          {/* FOTOĞRAF BÖLÜMÜ */}
          <div 
            className={`relative w-full min-h-[250px] md:min-h-full overflow-hidden z-0 bg-slate-900 ${photoColSpan} ${
              mobileOrder === 'content-first' ? 'order-2 md:order-none' : 'order-1 md:order-none'
            }`}
          >
            {couplePhoto ? (
              <SafeImage 
                src={couplePhoto} 
                alt="Split Screen Couple"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-103"
                style={{ objectPosition }}
                isHero={true}
              />
            ) : (
              // Fotoğrafsız durumda gösterilecek asimetrik premium fallback
              <div 
                className="w-full h-full flex flex-col items-center justify-center text-center p-8 bg-radial-gradient"
                style={{ 
                  background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)',
                  color: '#dfb76c' 
                }}
              >
                <span className="text-6xl font-serif font-light opacity-30 select-none" aria-hidden="true">
                  {groomInitial ? `${brideInitial}${groomInitial}` : brideInitial}
                </span>
                <span className="text-[9px] uppercase tracking-[0.25em] opacity-40 font-sans mt-2">SPECIAL EDITION</span>
              </div>
            )}
            {/* Split metalik dikey ayırıcı çizgi (Masaüstü için) */}
            <div className={`absolute top-0 bottom-0 w-[1.5px] bg-gradient-to-b from-amber-500/20 via-amber-400 to-amber-500/20 z-10 hidden md:block ${photoSide === 'left' ? 'right-0' : 'left-0'}`} />
          </div>

          {/* DAVET İÇERİK BÖLÜMÜ */}
          <div 
            className={`relative p-8 sm:p-10 flex flex-col justify-between items-center text-center z-10 ${contentColSpan} ${
              mobileOrder === 'content-first' ? 'order-1 md:order-none' : 'order-2 md:order-none'
            }`}
            style={{ backgroundColor: cardBgColor, color: textColor }}
          >
            {/* Güvenli İçerik Katmanı */}
            <div className="w-full flex flex-col items-center">
              {/* Monogram / Logo Süsü */}
              <div className="flex flex-col items-center mb-6 select-none opacity-80">
                <div className="text-xl sm:text-2xl font-serif font-light tracking-[0.2em] uppercase leading-none" style={{ color: primaryColor }}>
                  {groomInitial ? `${brideInitial}•${groomInitial}` : brideInitial}
                </div>
                <div className="w-6 h-[0.5px] mt-1.5 opacity-55" style={{ backgroundColor: primaryColor }} />
              </div>

              {/* Etkinlik Türü */}
              <h3 className="font-semibold tracking-[0.25em] uppercase text-[9px] mb-4 opacity-75" style={{ color: primaryColor }}>
                {eventTitle}
              </h3>

              {/* İsimler */}
              <div className="w-full mb-6">
                {wedding.bride_parents && (
                  <p className="text-[9px] tracking-[0.2em] font-light mb-3 opacity-60 uppercase font-sans">
                    {wedding.bride_parents}
                  </p>
                )}
                <h1 className="text-2xl sm:text-3xl font-light leading-snug tracking-wide" style={{ color: primaryColor, fontFamily: `"${headingFont}", serif` }}>
                  {wedding.bride_name}
                </h1>
                <div className="my-1.5 text-xs italic opacity-50" style={{ fontFamily: `"${accentFont}", cursive` }}>
                  and
                </div>
                <h1 className="text-2xl sm:text-3xl font-light leading-snug tracking-wide" style={{ color: primaryColor, fontFamily: `"${headingFont}", serif` }}>
                  {wedding.groom_name}
                </h1>
                {wedding.groom_parents && (
                  <p className="text-[9px] tracking-[0.2em] font-light mt-3 opacity-60 uppercase font-sans">
                    {wedding.groom_parents}
                  </p>
                )}
              </div>

              {/* Davet Mesajı */}
              <div className="my-2 leading-relaxed text-xs opacity-90 max-w-sm italic">
                {renderQuote()}
              </div>

              {/* Geri Sayım */}
              <div className="w-full my-4">
                {renderTimer()}
              </div>

              {/* Tarih ve Mekan Detayları */}
              <div className="w-full max-w-xs text-xs font-semibold my-6 space-y-2.5">
                <div className="flex items-center gap-3 py-2.5 px-4 rounded-xl border bg-black/5" style={{ borderColor: `${primaryColor}15` }}>
                  <Calendar className="w-4 h-4 shrink-0" style={{ color: primaryColor }} />
                  <span>{dateStr} <span className="mx-1 opacity-45">|</span> {timeStr}</span>
                </div>

                <div className="flex flex-col items-start gap-1 p-4 rounded-xl border bg-black/5 text-left" style={{ borderColor: `${primaryColor}15` }}>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 shrink-0" style={{ color: primaryColor }} />
                    <span className="font-bold">{wedding.venue_name || 'Mekan Belirtilmedi'}</span>
                  </div>
                  {wedding.venue_address && (
                    <p className="text-[11px] font-light opacity-80 pl-6 leading-relaxed text-slate-600">{wedding.venue_address}</p>
                  )}
                </div>
              </div>
            </div>

            {/* BUTON GRUBU (MIN 48PX, ÇENTİK KORUMALI) */}
            <div className="w-full max-w-xs flex flex-col gap-3 mt-4 safe-bottom">
              
              {/* Buton 1: KONUMA GİT */}
              {hasMaps && (
                <button 
                  type="button"
                  onClick={handleMapClick}
                  className="w-full h-12 rounded-full border flex items-center justify-between px-5 font-bold text-xs tracking-wider uppercase transition-all duration-300 hover:scale-102 active:scale-98 cursor-pointer focus-visible:ring-2 focus-visible:outline-none"
                  style={{ 
                    borderColor: `${primaryColor}30`, 
                    color: primaryColor,
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
    </div>
  );
}
