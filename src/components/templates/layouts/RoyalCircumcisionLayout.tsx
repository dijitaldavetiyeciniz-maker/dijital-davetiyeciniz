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
  
  const language = wedding.language || 'tr';
  const themeColor = primaryColor || '#dfb76c'; // Gold

  const masallahText = language === 'en' ? 'Mashallah' : 'Maşallah';
  const tagText = language === 'en' ? 'Circumcision Ceremony' : 'Sünnet Merasimi';

  // 1. NAZAR BONCUĞU & KRALİYET DEKORASYONU (Lacivert/Altın/Beyaz Palet)
  const bgRegistry = backgroundDesignRegistry[wedding.background_design || 'royal-navy-velvet'] || backgroundDesignRegistry['royal-navy-velvet'] || { fallbackColor: '#0b1329' };
  
  const backgroundStyle: React.CSSProperties = {
    backgroundColor: bgRegistry.fallbackColor || cardBgColor,
    backgroundImage: `radial-gradient(circle at center, rgba(15, 32, 67, 0.98) 0%, rgba(7, 15, 35, 1) 100%)`,
    boxShadow: 'inset 0 0 100px rgba(0,0,0,0.6)'
  };

  const hasMaps = !!wedding.google_maps_url;
  const showRsvp = wedding.show_rsvp !== false;

  return (
    <div 
      className="max-w-[550px] mx-auto w-full my-8 relative z-10 animate-fade-in font-sans text-white"
      style={{ ...(selectedBackground?.background ? { background: selectedBackground.background } : {}), fontFamily: `"${bodyFont}", serif` }}
    >
      {/* Nazar Boncuklu Maşallah Sünnet Davetiye Kartı */}
      <div 
        className="relative rounded-[2.5rem] overflow-hidden p-6 sm:p-10 text-center border flex flex-col items-center justify-between min-h-[640px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)]"
        style={{ ...backgroundStyle, borderColor: `${themeColor}35` }}
      >
        
        {/* PARILTILI NAZAR BONCUĞU ANİMASYON KATMANI (pointer-events: none) */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none opacity-40">
          {/* Uçuşan nazar boncukları ve parıltılar */}
          <div className="absolute top-12 left-10 text-2xl animate-pulse">🧿</div>
          <div className="absolute top-24 right-12 text-3xl animate-bounce duration-[4000ms]">🧿</div>
          <div className="absolute bottom-40 left-8 text-xl animate-pulse duration-[3000ms]">✨</div>
          <div className="absolute bottom-20 right-8 text-2xl animate-bounce">🧿</div>
        </div>

        {/* Kraliyet Altın Varak Köşe Çerçevesi */}
        <div className="absolute inset-4 sm:inset-6 rounded-[2rem] pointer-events-none z-0 border border-double"
             style={{ borderColor: `${themeColor}40`, borderWidth: '3px' }} />

        {/* İÇERİK ALANI */}
        <div className="relative z-10 w-full flex flex-col items-center">
          
          {/* Kocaman "Maşallah" Rozeti Amblemi */}
          <div className="flex flex-col items-center mb-6 select-none">
            <div 
              className="py-2 px-6 rounded-full border-2 text-[12px] font-extrabold tracking-[0.2em] uppercase flex items-center gap-2 shadow-lg bg-blue-900/60 text-amber-300 animate-pulse"
              style={{ borderColor: themeColor }}
            >
              <span>{masallahText}</span>
            </div>
          </div>

          {/* Sünnet Merasimi Etiket */}
          <h3 className="font-semibold tracking-[0.25em] uppercase text-[10px] mb-4 text-sky-300">
            {tagText}
          </h3>

          {/* Çocuğun İsmi (Büyük Hilalli Tören Kompozisyonu) */}
          <div className="w-full mb-6 relative">
            <div className="absolute -top-6 inset-x-0 flex justify-center text-4xl opacity-10 select-none text-sky-400">☪️</div>
            <h1 
              className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-wide w-full z-10 relative"
              style={{ color: '#ffffff', fontFamily: `"${headingFont}", serif`, textShadow: `0 0 10px ${themeColor}50` }}
            >
              {wedding.bride_name || 'Sevgili Oğlumuz'}
            </h1>
            
            {/* Anne Baba Detayı */}
            {(wedding.bride_parents || wedding.groom_parents) && (
              <p className="text-[10px] tracking-[0.25em] font-light mt-3 opacity-80 uppercase font-sans text-sky-200">
                {wedding.bride_parents ? `ANNE: ${wedding.bride_parents}` : ''}
                {wedding.groom_parents ? ` • BABA: ${wedding.groom_parents}` : ''}
              </p>
            )}
          </div>

          {/* Davet Sözü */}
          <div className="my-3 leading-relaxed text-sm max-w-sm text-slate-100">
            {renderQuote()}
          </div>

          {/* Mavi-Altın Sayaç Tasarımı */}
          <div className="w-full my-6 bg-gradient-to-r from-blue-950/80 via-slate-900/80 to-blue-950/80 p-4 rounded-3xl border border-blue-500/20 shadow-inner">
            <span className="text-[9px] font-bold tracking-widest text-amber-300 block mb-2">MERASİME KALAN SÜRE</span>
            {renderTimer()}
          </div>

          {/* Bilgi Kartları */}
          <div className="w-full max-w-sm text-xs font-semibold my-6 space-y-2.5">
            <div className="flex items-center gap-3 py-3 px-5 rounded-2xl border bg-blue-950/50" style={{ borderColor: `${themeColor}20` }}>
              <Calendar className="w-4 h-4 shrink-0 text-amber-300" />
              <span>{dateStr} <span className="mx-1 opacity-40">|</span> {timeStr}</span>
            </div>

            <div className="flex flex-col items-start gap-1 p-4 rounded-2xl border bg-blue-950/50 text-left" style={{ borderColor: `${themeColor}20` }}>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 shrink-0 text-amber-300" />
                <span className="font-bold">{wedding.venue_name || 'Mekan Belirtilmedi'}</span>
              </div>
              {wedding.venue_address && (
                <p className="text-[11px] font-light opacity-90 pl-6 leading-relaxed text-slate-200">{wedding.venue_address}</p>
              )}
            </div>
          </div>

          {/* Oval Dokunmatik Butonlar */}
          <div className="w-full max-w-sm flex flex-col gap-3 mt-4">
            {hasMaps && (
              <button 
                type="button"
                onClick={handleMapClick}
                className="w-full h-12 rounded-full border-2 flex items-center justify-between px-6 font-bold text-xs tracking-wider uppercase transition-all duration-300 hover:scale-102 active:scale-98 cursor-pointer focus-visible:ring-2 focus-visible:outline-none bg-blue-900/40 text-amber-300"
                style={{ borderColor: themeColor }}
              >
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4" />
                  <span>KONUMA GİT</span>
                </div>
                <span>&rarr;</span>
              </button>
            )}

            {showRsvp && renderRsvpButton()}
          </div>

          {/* Anı Defteri */}
          {renderGuestBook()}
        </div>
      </div>
    </div>
  );
}
