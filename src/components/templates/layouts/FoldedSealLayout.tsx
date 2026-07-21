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
}

export default function FoldedSealLayout({
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
  cardBgColor = '#ffffff'
}: LayoutProps) {
  const dateDay = String(dateObj.getDate()).padStart(2, '0');
  const dateMonth = String(dateObj.getMonth() + 1).padStart(2, '0');
  const dateYear = String(dateObj.getFullYear()).substring(2);

  // Mühür rengini default belirle (Bordo veya gold)
  const sealColor = wedding.seal_color || primaryColor || '#7f1d1d';

  return (
    <div 
      className="max-w-[550px] mx-auto w-full my-8 relative z-10 transition-all duration-700 ease-out animate-fade-in"
      style={{ fontFamily: `"${bodyFont}", serif` }}
    >
      {/* 3D Katlanmış Dış Zarf Kapak Efekti (Derin Gölgeler) */}
      <div className="relative rounded-[2rem] overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] border border-slate-100/10">
        
        {/* Sol Panel: Dikey Büyük Tarih */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-20 bg-black/5 backdrop-blur-xs border-r flex flex-col items-center justify-center z-20" style={{ borderColor: `${primaryColor}20` }}>
          <div className="flex flex-col items-center font-serif text-lg sm:text-xl tracking-widest font-bold opacity-80" style={{ color: primaryColor }}>
            <span className="my-0.5">{dateDay}</span>
            <div className="w-4 h-[1px] my-1.5 opacity-60" style={{ backgroundColor: primaryColor }} />
            <span className="my-0.5">{dateMonth}</span>
            <div className="w-4 h-[1px] my-1.5 opacity-60" style={{ backgroundColor: primaryColor }} />
            <span className="my-0.5">{dateYear}</span>
          </div>
          <div className="mt-8 select-none text-[8px] sm:text-[9px] uppercase tracking-[0.3em] rotate-90 whitespace-nowrap opacity-60 origin-center" style={{ color: textColor }}>
            {eventTitle}
          </div>
        </div>

        {/* Ana İçerik Kartı */}
        <div 
          className="pl-16 sm:pl-20 pr-4 sm:pr-8 py-12 sm:py-16 text-center min-h-[500px] flex flex-col items-center justify-between relative z-10"
          style={{ backgroundColor: cardBgColor, color: textColor }}
        >
          {/* Üst Kısım: Çapraz Katlama Çizgisi Süsü */}
          <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none opacity-20 overflow-hidden">
            <div className="absolute top-0 right-0 w-[150%] h-[150%] border-b border-l rotate-45 transform origin-top-right" style={{ borderColor: primaryColor }} />
          </div>

          <div className="w-full flex flex-col items-center">
            {/* 3D Wax Mühür & Püskül Görsel Kombinasyonu */}
            <div className="relative mb-8 z-20 flex flex-col items-center group select-none">
              {/* Wax Seal Body */}
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center relative cursor-pointer shadow-[0_8px_16px_rgba(0,0,0,0.3),inset_0_-4px_8px_rgba(0,0,0,0.2),inset_0_4px_8px_rgba(255,255,255,0.2)] transition-transform duration-300 group-hover:scale-105 active:scale-95"
                style={{ backgroundColor: sealColor }}
              >
                {/* Outer wax drip texture */}
                <div className="absolute inset-1 rounded-full border border-black/10 opacity-30" />
                <div className="absolute -inset-1 rounded-full border border-white/10 opacity-20" />
                
                {/* Inner Crest Stamp */}
                <div className="w-10 h-10 rounded-full border border-dashed flex items-center justify-center font-serif text-lg font-bold opacity-80" style={{ borderColor: `${primaryColor}60`, color: '#ffffff', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                  {wedding.bride_name ? wedding.bride_name.trim().charAt(0) : 'E'}
                </div>
              </div>

              {/* Sarkan İpeksi Püskül */}
              <div className="w-[3px] h-12 relative flex justify-center mt-[-4px]">
                {/* Rope line */}
                <div className="absolute inset-0 bg-amber-600/90 shadow-2xs" style={{ backgroundColor: sealColor }} />
                {/* Tassel brush head */}
                <div className="absolute bottom-0 w-2.5 h-2.5 rounded-full shadow-xs" style={{ backgroundColor: '#dfb76c' }} />
                {/* Brush strings */}
                <div className="absolute bottom-[-16px] w-3 h-4 bg-gradient-to-b from-[#dfb76c] to-[#bca05c] rounded-b-sm opacity-90 shadow-2xs" />
              </div>
            </div>

            {/* İsimler Bölümü */}
            <div className="w-full mb-6">
              {wedding.bride_parents && (
                <p className="text-[10px] tracking-[0.2em] font-light mb-3 opacity-60 uppercase" style={{ fontFamily: 'sans-serif' }}>
                  {wedding.bride_parents}
                </p>
              )}
              <h1 className="text-2xl sm:text-3xl font-normal tracking-wide" style={{ color: primaryColor, fontFamily: `"${headingFont}", serif` }}>
                {wedding.bride_name}
              </h1>
              <div className="my-2 text-sm italic opacity-60" style={{ fontFamily: `"${accentFont}", cursive` }}>
                &
              </div>
              <h1 className="text-2xl sm:text-3xl font-normal tracking-wide" style={{ color: primaryColor, fontFamily: `"${headingFont}", serif` }}>
                {wedding.groom_name}
              </h1>
              {wedding.groom_parents && (
                <p className="text-[10px] tracking-[0.2em] font-light mt-3 opacity-60 uppercase" style={{ fontFamily: 'sans-serif' }}>
                  {wedding.groom_parents}
                </p>
              )}
            </div>

            {/* Güzel Söz */}
            {renderQuote()}

            {/* Sayaç */}
            {renderTimer()}

            {/* Mekan ve Detaylar */}
            <div className="w-full max-w-sm my-6 space-y-3 text-xs font-medium">
              <div 
                className="flex items-center gap-3 py-2.5 px-4 rounded-xl border bg-black/5" 
                style={{ borderColor: `${primaryColor}15` }}
              >
                <Calendar className="w-4 h-4 shrink-0" style={{ color: primaryColor }} />
                <span>{dateStr} <span className="mx-1" style={{ color: primaryColor }}>|</span> {timeStr}</span>
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
                  <span className="text-[11px] font-light opacity-80 pl-6 leading-relaxed">{wedding.venue_address}</span>
                )}
              </div>
            </div>

            {/* RSVP & Konum Butonları */}
            {renderRsvpButton()}

            {/* Anı Defteri */}
            {renderGuestBook()}
          </div>
        </div>
      </div>
    </div>
  );
}
