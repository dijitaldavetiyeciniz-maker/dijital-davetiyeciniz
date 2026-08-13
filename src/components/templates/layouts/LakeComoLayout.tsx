'use client';
import React, { useRef, useEffect, useState } from 'react';
import { Calendar, MapPin, Navigation, Compass, Heart, Clock } from 'lucide-react';
import { useSceneProgress } from '@/hooks/useSceneProgress';
import CountdownTimer from '../../CountdownTimer';
import SafeImage from '@/components/ui/SafeImage';

interface LayoutProps {
  cardSurfaceStyle?: React.CSSProperties;
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

export default function LakeComoLayout({
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
  cardBgColor = '#0f303f',
  selectedBackground,
  cardSurfaceStyle
}: LayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { progress } = useSceneProgress(containerRef, 5);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  const couplePhoto = wedding.bride_photo_url || wedding.groom_photo_url || wedding.background_image_url || '';
  const showRsvp = wedding.show_rsvp !== false;
  const hasMaps = !!wedding.google_maps_url;

  return (
    <div 
      ref={containerRef}
      className="w-full relative overflow-x-hidden font-serif bg-[#0f303f] text-[#f5f8f8]"
      style={{ height: prefersReducedMotion ? 'auto' : '350vh' }}
      data-testid="layout-lake-como"
    >
      {/* Lake Como Palazzo Columns & Waterfront View Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Sky/Lake Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0e2430] via-[#0f303f] to-[#05131a]" />

        {/* Lake View Panning Horizontally behind Palazzo Columns (Signature Moment) */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 transition-transform duration-100 ease-out"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1549880180-250962140b6e?q=80&w=1000")',
            transform: prefersReducedMotion ? 'none' : `scale(1.15) translateX(${progress * -50}px)`
          }}
        />

        {/* Palazzo Columns Frame */}
        {!prefersReducedMotion && (
          <div className="absolute inset-0 flex justify-between px-10 pointer-events-none z-10">
            <div className="w-8 h-full bg-[#fcfbf9]/15 border-r border-[#ffffff]/10 shadow-[5px_0_15px_rgba(0,0,0,0.3)]" />
            <div className="w-8 h-full bg-[#fcfbf9]/15 border-l border-[#ffffff]/10 shadow-[-5px_0_15px_rgba(0,0,0,0.3)]" />
          </div>
        )}
      </div>

      {/* Viewport content */}
      <div className={prefersReducedMotion ? 'relative w-full flex flex-col' : 'sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-between z-10'}>

        {/* ----------------- SCENE 1: PALAZZO COVER ----------------- */}
        {(prefersReducedMotion || (progress >= 0 && progress < 0.22)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-sky-950/20 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center animate-fade-in z-20"}>
            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
              <span className="text-[10px] tracking-[0.45em] text-[#d4af37] font-bold uppercase mb-6">{eventTitle}</span>
              
              <div className="p-8 bg-[#0e2430]/85 border border-[#d4af37]/30 shadow-2xl rounded-none max-w-md">
                <h1 className="text-4xl sm:text-5xl font-light uppercase tracking-widest text-[#f5f8f8]" style={{ fontFamily: `"${headingFont}", serif` }}>
                  {wedding.bride_name} <br/>
                  <span className="text-lg opacity-40 font-light block my-3">&</span>
                  {wedding.groom_name}
                </h1>
              </div>
              
              <div className="h-px w-20 bg-[#d4af37]/35 my-8" />
              <p className="text-xs uppercase tracking-[0.3em] text-[#d4af37] font-mono">SCROLL THROUGH THE GRAND HOTEL</p>
            </div>
          </div>
        )}

        {/* ----------------- SCENE 2: POETRY WASH ----------------- */}
        {(prefersReducedMotion || (progress >= 0.22 && progress < 0.42)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-sky-950/20 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <div className="text-xl sm:text-3xl font-light leading-relaxed max-w-xl font-serif px-6 italic text-[#f5f8f8] bg-[#0e2430]/70 backdrop-blur-md p-8 border border-[#d4af37]/20">
              "{renderQuote()}"
            </div>
          </div>
        )}

        {/* ----------------- SCENE 3: GRAND HOTEL DETAILS ----------------- */}
        {(prefersReducedMotion || (progress >= 0.42 && progress < 0.65)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-sky-950/20 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.35em] text-[#d4af37] font-bold uppercase mb-8">GRAND HOTEL VISTA DETAILS</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl text-sm font-semibold mb-8 font-mono">
              <div className="flex flex-col gap-2 p-6 rounded-none border border-[#d4af37]/20 bg-[#0e2430]/90">
                <Calendar className="w-5 h-5 mx-auto text-[#d4af37] mb-2" />
                <span className="text-[#f5f8f8] text-lg">{dateStr}</span>
                <span className="text-[#d4af37]">{timeStr}</span>
              </div>

              <div id="como-hotel-plaque" className="flex flex-col gap-2 p-6 rounded-none border border-[#d4af37]/20 bg-[#0e2430]/90">
                <MapPin className="w-5 h-5 mx-auto text-[#d4af37] mb-2" />
                <span className="text-[#f5f8f8] text-lg">{wedding.venue_name || 'Lake Como Hotel'}</span>
                {wedding.venue_address && (
                  <span className="text-[#f5f8f8]/80 leading-normal text-xs">{wedding.venue_address}</span>
                )}
              </div>
            </div>

            {hasMaps && (
              <button 
                onClick={handleMapClick}
                className="px-6 h-12 border border-[#d4af37]/40 bg-[#0e2430]/60 text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0e2430] rounded-none font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>HOTEL DIRECTORY</span>
              </button>
            )}
          </div>
        )}

        {/* ----------------- SCENE 4: PALAZZO ALBUM ----------------- */}
        {(prefersReducedMotion || (progress >= 0.65 && progress < 0.85)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-sky-950/20 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.3em] text-[#d4af37] font-bold uppercase mb-8">PALAZZO SNAPSHOT</span>
            
            <div className="relative w-full max-w-sm aspect-[4/3] mx-auto rounded-none border border-[#d4af37]/35 shadow-2xl bg-[#0e2430] p-2">
              <div className="w-full h-full border border-[#d4af37]/20 overflow-hidden relative">
                {couplePhoto ? (
                  <SafeImage 
                    src={couplePhoto} 
                    alt="Lake Como Couple" 
                    className="w-full h-full object-cover"
                    isHero={false}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-[#d4af37]/50 bg-[#0e2430]/60">
                    <Heart className="w-12 h-12 mb-2 opacity-35" />
                    <span className="text-[10px] tracking-wider uppercase opacity-55">PORTRAIT PANEL</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ----------------- SCENE 5: CONFIRMATION RSVP ----------------- */}
        {(prefersReducedMotion || (progress >= 0.85 && progress <= 1)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20 overflow-y-auto"}>
            
            {/* Confirmation styled RSVP Plaque */}
            <div id="como-hotel-confirmation" className="w-full max-w-md mx-auto pt-10 pb-6 relative z-10 bg-[#0e2430]/95 border border-[#d4af37]/35 rounded-none p-6 shadow-2xl backdrop-blur-md">
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#d4af37] block mb-4 uppercase font-bold flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 text-[#d4af37]" /> T-MINUS TO GALA
              </span>

              {wedding.wedding_date && (
                <div className="mb-6 scale-90">
                  <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#d4af37" styleType="elegant" />
                </div>
              )}

              <div className="w-full space-y-6 pt-4 border-t border-dashed border-[#d4af37]/20">
                {showRsvp && (
                  <div className="w-full [&>button]:w-full [&>button]:h-14 [&>button]:bg-[#d4af37] [&>button]:text-[#0e2430] [&>button]:uppercase [&>button]:tracking-widest [&>button]:text-xs [&>button]:font-black [&>button]:hover:bg-yellow-505 [&>button]:transition-all [&>button]:duration-300 [&>button]:rounded-none">
                    {renderRsvpButton()}
                  </div>
                )}
                
                <div className="w-full text-slate-800">
                  {renderGuestBook()}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
