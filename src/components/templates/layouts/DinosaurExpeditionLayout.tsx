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

export default function DinosaurExpeditionLayout({
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
  cardBgColor = '#f5ebe0',
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

  // Sandy earth split offsets (Signature Moment)
  const leftSplitOffset = prefersReducedMotion ? -100 : progress * -120;
  const rightSplitOffset = prefersReducedMotion ? 100 : progress * 120;
  const fossilOpacity = prefersReducedMotion ? 0.9 : Math.min(0.9, progress * 1.5);

  return (
    <div 
      ref={containerRef}
      className="w-full relative overflow-x-hidden font-mono bg-[#f5ebe0] text-[#4a3b32]"
      style={{ height: prefersReducedMotion ? 'auto' : '350vh' }}
      data-testid="layout-dinosaur-expedition"
    >
      {/* Expedition Dig Site Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        {/* Dinosaur Fossil Skeleton (Signature Moment) */}
        <div 
          className="absolute w-72 h-72 rounded-full border border-dashed border-[#b8a390] flex items-center justify-center transition-all duration-300"
          style={{
            opacity: fossilOpacity,
            transform: prefersReducedMotion ? 'scale(1)' : `scale(${0.85 + progress * 0.15})`
          }}
        >
          {/* Skeleton SVG outline */}
          <svg className="w-40 h-40 text-[#a38c7a]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
            {/* Dinosaur tail / spine */}
            <path d="M 10,50 Q 30,30 50,50 T 90,50" strokeLinecap="round" />
            {/* Rib cages */}
            <path d="M 30,42 L 30,58 M 40,38 L 40,62 M 50,42 L 50,58 M 60,45 L 60,55" />
            {/* Head skull */}
            <rect x="15" y="42" width="10" height="8" rx="2" fill="none" />
            <circle cx="18" cy="45" r="1.5" fill="currentColor" />
          </svg>
        </div>

        {/* Topsoil Splitting Layers */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-1/2 bg-[#d5bdaf] transition-transform duration-100 ease-out z-10 border-r border-[#b8a390]"
          style={{
            transform: `translateX(${leftSplitOffset}%)`
          }}
        />
        <div 
          className="absolute right-0 top-0 bottom-0 w-1/2 bg-[#d5bdaf] transition-transform duration-100 ease-out z-10 border-l border-[#b8a390]"
          style={{
            transform: `translateX(${rightSplitOffset}%)`
          }}
        />
      </div>

      {/* Viewport content */}
      <div className={prefersReducedMotion ? 'relative w-full flex flex-col' : 'sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-between z-10'}>

        {/* ----------------- SCENE 1: EXPEDITION START ----------------- */}
        {(prefersReducedMotion || (progress >= 0 && progress < 0.22)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-[#b8a390]/30 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center animate-fade-in z-20"}>
            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
              <span className="text-[10px] tracking-[0.45em] text-[#8a705e] font-bold uppercase mb-6">{eventTitle}</span>
              
              <div className="p-8 bg-[#e3d5ca]/95 rounded-none border-4 border-double border-[#8a705e] shadow-xl max-w-md">
                <h1 className="text-4xl sm:text-5xl font-bold uppercase tracking-widest text-[#4a3b32]" style={{ fontFamily: `"${headingFont}", serif` }}>
                  {wedding.bride_name} <br/>
                  <span className="text-lg opacity-60 block my-3">&</span>
                  {wedding.groom_name}
                </h1>
              </div>
              
              <div className="h-px w-20 bg-[#8a705e]/50 my-8" />
              <p className="text-xs uppercase tracking-[0.3em] text-[#8a705e] font-mono">SCROLL TO EXCAVATE THE SITE</p>
            </div>
          </div>
        )}

        {/* ----------------- SCENE 2: STORY POETRY ----------------- */}
        {(prefersReducedMotion || (progress >= 0.22 && progress < 0.42)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-[#b8a390]/30 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <div className="text-lg sm:text-2xl font-semibold leading-relaxed max-w-xl px-6 italic text-[#4a3b32] bg-[#e3d5ca]/80 p-8 border-2 border-[#b8a390]">
              "{renderQuote()}"
            </div>
          </div>
        )}

        {/* ----------------- SCENE 3: DIG-SITE COORDINATES ----------------- */}
        {(prefersReducedMotion || (progress >= 0.42 && progress < 0.65)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-[#b8a390]/30 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.35em] text-[#8a705e] font-bold uppercase mb-8">DIG-SITE COORDINATES</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl text-sm font-bold mb-8">
              <div className="flex flex-col gap-2 p-6 bg-[#e3d5ca] border-2 border-[#8a705e] shadow-sm">
                <Clock className="w-5 h-5 mx-auto text-[#8a705e] mb-2" />
                <span className="text-[#4a3b32] text-lg">{dateStr}</span>
                <span className="text-[#8a705e]">{timeStr}</span>
              </div>

              <div id="dinosaur-coordinates-plaque" className="flex flex-col gap-2 p-6 bg-[#e3d5ca] border-2 border-[#8a705e] shadow-sm">
                <MapPin className="w-5 h-5 mx-auto text-[#8a705e] mb-2" />
                <span className="text-[#4a3b32] text-lg">{wedding.venue_name || 'Dig Site'}</span>
                {wedding.venue_address && (
                  <span className="text-[#8a705e] leading-normal text-xs">{wedding.venue_address}</span>
                )}
                <span className="text-[10px] text-[#8a705e] mt-1 font-mono tracking-widest uppercase">Grid Sectors: A-4 / Fossil Beds</span>
              </div>
            </div>

            {hasMaps && (
              <button 
                onClick={handleMapClick}
                className="px-6 h-12 border-2 border-[#8a705e] bg-[#e3d5ca] text-[#4a3b32] hover:bg-[#4a3b32] hover:text-[#f5ebe0] font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>EXPEDITION MAP</span>
              </button>
            )}
          </div>
        )}

        {/* ----------------- SCENE 4: GALLERY SCREEN ----------------- */}
        {(prefersReducedMotion || (progress >= 0.65 && progress < 0.85)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-[#b8a390]/30 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.3em] text-[#8a705e] font-bold uppercase mb-8">DISCOVERY CARD</span>
            
            <div className="relative w-full max-w-sm aspect-[4/3] mx-auto overflow-hidden border-4 border-[#8a705e] shadow-2xl bg-[#e3d5ca] p-2">
              {couplePhoto ? (
                <SafeImage 
                  src={couplePhoto} 
                  alt="Dinosaur Expedition" 
                  className="w-full h-full object-cover grayscale opacity-90 contrast-110"
                  isHero={false}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-[#8a705e] bg-[#f5ebe0]">
                  <Heart className="w-12 h-12 mb-2 opacity-35" />
                  <span className="text-[10px] tracking-wider uppercase opacity-55">PORTRAIT</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------- SCENE 5: CONFIRMATION & RSVP ----------------- */}
        {(prefersReducedMotion || (progress >= 0.85 && progress <= 1)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20 overflow-y-auto"}>
            <div id="dinosaur-rsvp" className="w-full max-w-md mx-auto pt-10 pb-6 relative z-10 bg-[#e3d5ca]/95 border-4 border-[#8a705e] p-6 shadow-2xl backdrop-blur-md">
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#8a705e] block mb-4 uppercase font-bold flex items-center justify-center gap-2">
                🦕 T-MINUS TO EXCAVATION DEPLOY
              </span>

              {wedding.wedding_date && (
                <div className="mb-6 scale-90">
                  <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#4a3b32" styleType="elegant" />
                </div>
              )}

              <div className="w-full space-y-6 pt-4 border-t border-dashed border-[#8a705e]">
                {showRsvp && (
                  <div className="w-full [&>button]:w-full [&>button]:h-14 [&>button]:bg-[#4a3b32] [&>button]:text-[#f5ebe0] [&>button]:uppercase [&>button]:tracking-widest [&>button]:text-xs [&>button]:font-black [&>button]:hover:bg-[#8a705e] [&>button]:transition-all [&>button]:duration-300 [&>button]:rounded-none">
                    {renderRsvpButton()}
                  </div>
                )}
                
                <div className="w-full text-[#4a3b32]">
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
