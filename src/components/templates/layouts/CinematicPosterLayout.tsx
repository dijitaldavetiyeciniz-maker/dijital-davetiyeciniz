'use client';
import React from 'react';
import { Calendar, MapPin, Ticket, Sparkles, Film, Navigation, Clock } from 'lucide-react';
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

export default function CinematicPosterLayout({
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
  cardBgColor = '#05070a',
  mode = 'public'
}: LayoutProps) {
  const brideInitial = wedding.bride_name ? wedding.bride_name.trim().charAt(0) : 'E';
  const groomInitial = wedding.groom_name ? wedding.groom_name.trim().charAt(0) : '';

  const overrides = wedding.custom_overrides || {};
  const focalX = overrides.photoFocalPoint?.x ?? wedding.photo_focal_point?.x ?? 50;
  const focalY = overrides.photoFocalPoint?.y ?? wedding.photo_focal_point?.y ?? 50;
  const objectPosition = `${focalX}% ${focalY}%`;

  const couplePhoto = wedding.bride_photo_url || wedding.groom_photo_url || wedding.background_image_url || '';

  const mainBg = cardBgColor || '#05070a';
  
  const hasMaps = !!wedding.google_maps_url;
  const showRsvp = wedding.show_rsvp !== false;

  return (
    <div 
      className="min-h-screen w-full bg-slate-950 text-white font-sans flex flex-col lg:flex-row overflow-hidden relative"
      style={{ fontFamily: `"${bodyFont}", sans-serif`, backgroundColor: mainBg }}
      data-testid="layout-cinematic-poster"
    >
      {/* SİNEMATİK ÜST BAR */}
      <div className="absolute top-0 inset-x-0 w-full bg-gradient-to-r from-red-950/80 via-black to-red-950/80 py-2 px-6 flex items-center justify-between border-b border-red-500/20 text-[9px] sm:text-xs font-mono tracking-[0.3em] text-red-400 select-none z-50">
        <div className="flex items-center gap-2 font-bold">
          <Film className="w-4 h-4 animate-pulse" />
          <span>DIRECTOR'S CUT PREMIERE</span>
        </div>
        <span>{dateObj.getFullYear()}</span>
      </div>

      {/* SOL TARAF: DEV SİNEMA AFİŞİ (HERO GÖRSELİ) */}
      <div className="relative w-full lg:w-1/2 min-h-[60vh] lg:min-h-screen pt-10 lg:pt-0">
        {couplePhoto ? (
          <SafeImage 
            src={couplePhoto} 
            alt="Film Afişi Görseli"
            className="w-full h-full object-cover"
            style={{ objectPosition }}
            isHero={true}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-slate-950 via-slate-900 to-black text-center text-red-400 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.15)_0%,transparent_70%)] pointer-events-none" />
            <Film className="w-24 h-24 opacity-30 mb-4 animate-pulse" />
            <span className="text-6xl lg:text-8xl font-serif font-black tracking-widest text-slate-100 opacity-60">
              {groomInitial ? `${brideInitial} & ${groomInitial}` : brideInitial}
            </span>
            <p className="text-xs font-mono tracking-[0.4em] uppercase text-red-400/80 mt-6">SİNEMATİK AŞK HİKAYESİ</p>
          </div>
        )}

        {/* Gölgeler ve Vignette Efektleri */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-[#05070a]/20 to-transparent pointer-events-none lg:bg-gradient-to-r lg:from-[#05070a]/10 lg:via-[#05070a]/30 lg:to-[#05070a]" />
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />
      </div>

      {/* SAĞ TARAF: FİLM KÜNYESİ VE DETAYLAR */}
      <div className="relative w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-16 lg:py-24 z-10 bg-[#05070a] lg:bg-transparent -mt-16 lg:mt-0 pt-20 lg:pt-24 min-h-[50vh]">
        
        {/* Cast/Family */}
        {(wedding.bride_parents || wedding.groom_parents) && (
          <div className="text-[10px] sm:text-xs font-mono tracking-[0.25em] opacity-60 uppercase text-slate-300 mb-6 select-none border-l-2 border-red-500 pl-4">
            PRODUCED BY {wedding.bride_parents ? `${wedding.bride_parents.toUpperCase()}` : ''} 
            {wedding.groom_parents ? ` & ${wedding.groom_parents.toUpperCase()}` : ''}
          </div>
        )}

        {/* Dev Afiş Başlığı (İsimler) */}
        <div className="flex flex-col gap-2">
          <h1 
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter uppercase leading-none text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
            style={{ fontFamily: `"${headingFont}", sans-serif`, color: primaryColor || '#ffffff' }}
          >
            {wedding.bride_name}
          </h1>

          <div className="flex items-center gap-4 my-2 opacity-80 w-full sm:w-3/4">
            <span className="text-sm font-mono tracking-[0.3em] text-red-400 font-bold uppercase shrink-0">FEATURING</span>
            <div className="h-[2px] w-full bg-gradient-to-r from-red-500 to-transparent" />
          </div>

          <h1 
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter uppercase leading-none text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
            style={{ fontFamily: `"${headingFont}", sans-serif`, color: primaryColor || '#ffffff' }}
          >
            {wedding.groom_name}
          </h1>
        </div>

        {/* Etkinlik Türü & Vizyon Tarihi */}
        <div className="inline-flex self-start mt-8 py-2 px-6 rounded-none bg-red-950/40 border-l-4 border-red-500 text-[10px] sm:text-xs font-mono tracking-[0.2em] uppercase text-red-100 backdrop-blur-sm">
          {eventTitle} <span className="mx-3 opacity-50">|</span> RELEASE DATE: {dateStr}
        </div>

        {/* Film Sloganı / Davet Mesajı */}
        <div className="mt-8 mb-4 text-base sm:text-lg text-slate-300 italic border-l-2 border-white/20 pl-6 leading-relaxed max-w-xl" style={{ fontFamily: `"${accentFont}", serif` }}>
          "{renderQuote()}"
        </div>

        {/* Digital Timer */}
        <div className="w-full max-w-md my-8 p-6 rounded-xl bg-black/60 border border-white/10 shadow-2xl backdrop-blur-md relative overflow-hidden group hover:border-red-500/50 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl group-hover:bg-red-500/20 transition-colors" />
          <span className="text-[10px] font-mono tracking-[0.2em] text-red-400 block mb-4 uppercase font-bold flex items-center gap-2">
            <Clock className="w-4 h-4" /> VİZYONA KALAN SÜRE
          </span>
          <div className="relative z-10">
            {renderTimer()}
          </div>
        </div>

        {/* Tarih & Mekan Detayları */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl text-sm font-semibold mb-10 font-mono">
          <div className="flex flex-col gap-2 p-5 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors">
            <div className="flex items-center gap-3 text-red-400 mb-1">
              <Calendar className="w-5 h-5" />
              <span className="tracking-wider">GÖSTERİM ZAMANI</span>
            </div>
            <span className="text-white text-lg">{dateStr}</span>
            <span className="text-slate-400">{timeStr}</span>
          </div>

          <div className="flex flex-col gap-2 p-5 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors">
            <div className="flex items-center gap-3 text-red-400 mb-1">
              <MapPin className="w-5 h-5" />
              <span className="tracking-wider">LOKASYON</span>
            </div>
            <span className="text-white text-lg">{wedding.venue_name || 'Sinema Salonu Belirtilmedi'}</span>
            {wedding.venue_address && (
              <span className="text-slate-400 leading-tight">{wedding.venue_address}</span>
            )}
          </div>
        </div>

        {/* AKSİYON BUTONLARI */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl">
          {hasMaps && (
            <button 
              type="button"
              onClick={handleMapClick}
              className="flex-1 h-14 rounded-none border border-red-500/40 bg-red-950/20 text-red-200 hover:bg-red-900/60 hover:text-white hover:border-red-500 flex items-center justify-center gap-3 font-bold text-sm tracking-[0.2em] uppercase transition-all duration-300 group"
            >
              <Navigation className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
              <span>SALON NAVİGASYON</span>
            </button>
          )}

          {showRsvp && (
            <div className="flex-1 cinematic-rsvp-container flex items-center justify-center child-w-full">
              {renderRsvpButton()}
            </div>
          )}
        </div>

        {/* Anı Defteri */}
        <div className="mt-12 max-w-2xl">
          {renderGuestBook()}
        </div>
        
      </div>
    </div>
  );
}
