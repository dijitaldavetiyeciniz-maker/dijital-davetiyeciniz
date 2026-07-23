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
  cardBgColor = '#fcfbfa'
, selectedBackground}: LayoutProps) {
  const dateDay = String(dateObj.getDate()).padStart(2, '0');
  const dateMonth = String(dateObj.getMonth() + 1).padStart(2, '0');
  const dateYear = String(dateObj.getFullYear()).substring(2);

  const sealColor = wedding.seal_color || primaryColor || '#78350f'; // Kraft Brown/Gold
  const showRsvp = wedding.show_rsvp !== false;

  // 1. GERÇEKÇİ KRAFT / KETEN KAĞIT DOKUSU
  const bgRegistry = backgroundDesignRegistry[wedding.background_design || 'textured-linen'] || { fallbackColor: '#fbf9f6' };

  return (
    <div 
      className="max-w-[550px] mx-auto w-full my-8 relative z-10 transition-all duration-700 ease-out animate-fade-in text-slate-800"
      style={{ ...(selectedBackground?.background ? { background: selectedBackground.background } : {}), fontFamily: `"${bodyFont}", serif` }}
    >
      {/* Çapraz Katlanmış Davetiye ve 3D Gölgeli Kenarlar */}
      <div 
        className="relative rounded-[2rem] overflow-hidden shadow-[0_30px_70px_-15px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.4)] border border-amber-900/10 flex flex-col md:flex-row items-stretch"
        style={{ backgroundColor: bgRegistry.fallbackColor || cardBgColor }}
      >
        {/* Keten Noise Dokusu */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none z-0 opacity-60" />

        {/* Sol Panel: Dikey Büyük Tarih ve İskambil Çizgileri */}
        <div className="w-20 md:w-24 bg-amber-900/5 border-r border-amber-900/10 flex flex-col items-center justify-center py-8 z-10 relative">
          <div className="flex flex-col items-center font-serif text-xl tracking-widest font-bold" style={{ color: primaryColor }}>
            <span>{dateDay}</span>
            <div className="w-5 h-[1.5px] my-2 bg-amber-900/20" />
            <span>{dateMonth}</span>
            <div className="w-5 h-[1.5px] my-2 bg-amber-900/20" />
            <span>{dateYear}</span>
          </div>
          <div className="mt-12 select-none text-[9px] uppercase tracking-[0.3em] rotate-90 whitespace-nowrap opacity-60 origin-center text-amber-900 font-bold">
            {eventTitle}
          </div>
        </div>

        {/* Ana İçerik Kartı */}
        <div 
          className="flex-1 px-6 sm:px-10 py-12 sm:py-16 text-center flex flex-col items-center justify-between relative z-10"
          style={{ color: textColor }}
        >
          {/* Çapraz Katlama Çizgisi Süsü */}
          <div className="absolute top-0 right-0 w-28 h-28 pointer-events-none opacity-20 overflow-hidden">
            <div className="absolute top-0 right-0 w-[140%] h-[140%] border-b border-l border-amber-900/30 rotate-45 transform origin-top-right" />
          </div>

          <div className="w-full flex flex-col items-center">
            {/* 3D Wax Mühür & Püskül Kombinasyonu */}
            <div className="relative mb-8 z-20 flex flex-col items-center group select-none">
              {/* Wax Seal Body */}
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center relative cursor-pointer shadow-[0_10px_20px_rgba(120,53,15,0.35),inset_0_-4px_8px_rgba(0,0,0,0.2),inset_0_4px_8px_rgba(255,255,255,0.3)] transition-transform duration-300 group-hover:scale-105 active:scale-95 bg-amber-950"
                style={{ backgroundColor: sealColor }}
              >
                {/* Inner Crest Stamp */}
                <div className="w-10 h-10 rounded-full border border-dashed border-amber-300/40 flex items-center justify-center font-serif text-lg font-bold text-amber-100/90 text-shadow-md">
                  {wedding.bride_name ? wedding.bride_name.trim().charAt(0) : 'W'}
                </div>
              </div>

              {/* Sarkan Püskül */}
              <div className="w-[3px] h-14 relative flex justify-center mt-[-4px]">
                <div className="absolute inset-0 bg-amber-900/60 shadow-2xs" style={{ backgroundColor: sealColor }} />
                <div className="absolute bottom-0 w-3 h-3 rounded-full shadow-xs bg-amber-600" />
                <div className="absolute bottom-[-16px] w-3.5 h-5 bg-gradient-to-b from-amber-600 to-amber-800 rounded-b-xs opacity-90 shadow-xs" />
              </div>
            </div>

            {/* İsimler Bölümü */}
            <div className="w-full mb-6">
              {wedding.bride_parents && (
                <p className="text-[10px] tracking-[0.2em] font-light mb-3 opacity-60 uppercase font-sans">
                  {wedding.bride_parents}
                </p>
              )}
              <h1 className="text-3xl sm:text-4xl font-normal tracking-wide" style={{ color: primaryColor, fontFamily: `"${headingFont}", serif` }}>
                {wedding.bride_name}
              </h1>
              <div className="my-2 text-sm italic opacity-60" style={{ fontFamily: `"${accentFont}", cursive` }}>
                &
              </div>
              <h1 className="text-3xl sm:text-4xl font-normal tracking-wide" style={{ color: primaryColor, fontFamily: `"${headingFont}", serif` }}>
                {wedding.groom_name}
              </h1>
              {wedding.groom_parents && (
                <p className="text-[10px] tracking-[0.2em] font-light mt-3 opacity-60 uppercase font-sans">
                  {wedding.groom_parents}
                </p>
              )}
            </div>

            {/* Davet Metni */}
            <div className="text-slate-700 my-3 leading-relaxed text-sm italic max-w-sm">
              {renderQuote()}
            </div>

            {/* Sayaç */}
            <div className="w-full my-4 bg-amber-900/5 p-4 rounded-2xl border border-amber-900/10">
              <span className="text-[9px] font-bold tracking-widest text-amber-800 block mb-1">Geri Sayım</span>
              {renderTimer()}
            </div>

            {/* Mekan ve Detaylar */}
            <div className="w-full max-w-sm my-6 space-y-3 text-xs font-medium">
              <div className="flex items-center gap-3 py-2.5 px-4 rounded-xl border border-amber-900/10 bg-amber-900/5">
                <Calendar className="w-4 h-4 shrink-0 text-amber-800" />
                <span>{dateStr} <span className="mx-1 text-amber-900/30">|</span> {timeStr}</span>
              </div>

              <div className="flex flex-col items-start gap-1 p-4 rounded-xl border border-amber-900/10 bg-amber-900/5 text-left">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 shrink-0 text-amber-800" />
                  <span className="font-bold">{wedding.venue_name || 'Mekan Belirtilmedi'}</span>
                </div>
                {wedding.venue_address && (
                  <span className="text-[11px] font-light opacity-80 pl-6 leading-relaxed text-slate-600">{wedding.venue_address}</span>
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
