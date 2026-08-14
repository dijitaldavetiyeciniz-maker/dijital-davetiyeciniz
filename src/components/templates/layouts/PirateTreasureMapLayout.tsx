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

export default function PirateTreasureMapLayout({
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
  cardBgColor = '#f2e8cf',
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

  // Route drawing length and ship coordinate calculation (Signature Moment)
  const routeDashOffset = prefersReducedMotion ? 0 : 500 - progress * 500;
  
  // Coordinates mapping along the path (X shape sailing)
  const shipX = prefersReducedMotion ? 80 : 15 + progress * 65;
  const shipY = prefersReducedMotion ? 75 : 30 + Math.sin(progress * Math.PI) * 25 + progress * 20;

  return (
    <div 
      ref={containerRef}
      className="w-full relative overflow-x-hidden font-mono bg-[#f4ebd0] text-[#3d3a35]"
      style={{ height: prefersReducedMotion ? 'auto' : '350vh' }}
      data-testid="layout-pirate-treasure"
    >
      {/* Antique Parchment Map Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-[#f2e3c6] via-[#ebe0c5] to-[#decfa8]" />
        
        {/* Animated Sailing Route & Pirate Ship SVG (Signature Moment) */}
        <svg className="absolute w-[80%] h-[75%] max-w-xl text-[#8d7c62]" viewBox="0 0 100 100">
          {/* Compass rose decorative drawing */}
          <circle cx="15" cy="20" r="8" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 1" fill="none" />
          <line x1="15" y1="8" x2="15" y2="32" stroke="currentColor" strokeWidth="0.5" />
          <line x1="3" y1="20" x2="27" y2="20" stroke="currentColor" strokeWidth="0.5" />
          <text x="14" y="6" fontSize="3" fill="currentColor" fontWeight="bold">N</text>

          {/* Dotted Route path */}
          <path 
            id="sailing-path"
            d="M 15,30 Q 50,5 50,55 T 80,75" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeDasharray="4 4"
            style={{
              strokeDashoffset: routeDashOffset
            }}
          />

          {/* Celebration island indicators */}
          <circle cx="50" cy="55" r="3" className="fill-[#bc4749] stroke-currentColor stroke-1" />
          <text x="46" y="62" fontSize="2.5" fill="currentColor">Event Port</text>
          
          {/* The red X marking RSVP */}
          <path d="M 77,72 L 83,78 M 83,72 L 77,78" stroke="#bc4749" strokeWidth="2.5" strokeLinecap="round" />
          
          {/* Sailing Pirate Ship SVG (translates on scroll) */}
          <g transform={`translate(${shipX - 4}, ${shipY - 4}) scale(0.08)`}>
            <path 
              d="M 10,40 Q 30,55 50,40 L 45,20 L 35,15 L 25,20 Z" 
              fill="currentColor" 
            />
            {/* Sails */}
            <path d="M 28,15 L 28,5 L 35,10 Z" fill="#bc4749" />
            <path d="M 38,15 L 38,2 L 48,8 Z" fill="#bc4749" />
          </g>
        </svg>

        {/* Map edges styling */}
        <div className="absolute inset-0 border-[16px] border-double border-[#8d7c62]/20 pointer-events-none" />
      </div>

      {/* Viewport content */}
      <div className={prefersReducedMotion ? 'relative w-full flex flex-col' : 'sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-between z-10'}>

        {/* ----------------- SCENE 1: MAP TITLE ----------------- */}
        {(prefersReducedMotion || (progress >= 0 && progress < 0.22)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-[#8d7c62]/20 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center animate-fade-in z-20"}>
            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
              <span className="text-[10px] tracking-[0.45em] text-[#8d7c62] font-bold uppercase mb-6">{eventTitle}</span>
              
              <div className="p-8 bg-[#f2e3c6]/95 border-4 border-[#8d7c62] shadow-xl max-w-md">
                <h1 className="text-4xl sm:text-5xl font-bold uppercase tracking-widest text-[#5c554a]" style={{ fontFamily: `"${headingFont}", serif` }}>
                  {wedding.bride_name} <br/>
                  <span className="text-lg opacity-60 block my-3">&</span>
                  {wedding.groom_name}
                </h1>
              </div>
              
              <div className="h-px w-20 bg-[#8d7c62]/50 my-8" />
              <p className="text-xs uppercase tracking-[0.3em] text-[#8d7c62] font-mono">SCROLL TO SAIL THE TREASURE PATH</p>
            </div>
          </div>
        )}

        {/* ----------------- SCENE 2: POETRY ----------------- */}
        {(prefersReducedMotion || (progress >= 0.22 && progress < 0.42)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-[#8d7c62]/20 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <div className="text-lg sm:text-2xl font-semibold leading-relaxed max-w-xl px-6 italic text-[#5c554a] bg-[#f2e3c6]/90 p-8 border-2 border-[#8d7c62]">
              "{renderQuote()}"
            </div>
          </div>
        )}

        {/* ----------------- SCENE 3: PORT COORDINATES ----------------- */}
        {(prefersReducedMotion || (progress >= 0.42 && progress < 0.65)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-[#8d7c62]/20 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.35em] text-[#8d7c62] font-bold uppercase mb-8">PORT COORDINATES</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl text-sm font-bold mb-8">
              <div className="flex flex-col gap-2 p-6 bg-[#f2e3c6]/95 border-2 border-[#8d7c62] shadow-sm">
                <Clock className="w-5 h-5 mx-auto text-[#8d7c62] mb-2" />
                <span className="text-[#5c554a] text-lg">{dateStr}</span>
                <span className="text-[#8d7c62]">{timeStr}</span>
              </div>

              <div id="pirate-coordinates-plaque" className="flex flex-col gap-2 p-6 bg-[#f2e3c6]/95 border-2 border-[#8d7c62] shadow-sm">
                <Compass className="w-5 h-5 mx-auto text-[#8d7c62] mb-2" />
                <span className="text-[#5c554a] text-lg">{wedding.venue_name || 'Treasure Port'}</span>
                {wedding.venue_address && (
                  <span className="text-[#8d7c62] leading-normal text-xs">{wedding.venue_address}</span>
                )}
                <span className="text-[10px] text-[#8d7c62] mt-1 font-mono tracking-widest uppercase">Coordinates: 12° N, 74° W</span>
              </div>
            </div>

            {hasMaps && (
              <button 
                onClick={handleMapClick}
                className="px-6 h-12 border-2 border-[#8d7c62] bg-[#f2e3c6]/80 text-[#5c554a] hover:bg-[#5c554a] hover:text-[#f2e8cf] font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                <span>SAIL DIRECTORY</span>
              </button>
            )}
          </div>
        )}

        {/* ----------------- SCENE 4: GALLERY SCREEN ----------------- */}
        {(prefersReducedMotion || (progress >= 0.65 && progress < 0.85)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-[#8d7c62]/20 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.3em] text-[#8d7c62] font-bold uppercase mb-8">TREASURE ALBUM</span>
            
            <div className="relative w-full max-w-sm aspect-[4/3] mx-auto overflow-hidden border-4 border-[#8d7c62] shadow-2xl bg-[#f2e3c6] p-2">
              {couplePhoto ? (
                <SafeImage 
                  src={couplePhoto} 
                  alt="Pirate Treasure" 
                  className="w-full h-full object-cover grayscale opacity-90 contrast-125"
                  isHero={false}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-[#8d7c62] bg-[#f2e8cf]">
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
            <div id="pirate-rsvp" className="w-full max-w-md mx-auto pt-10 pb-6 relative z-10 bg-[#f2e3c6]/95 border-4 border-[#8d7c62] p-6 shadow-2xl backdrop-blur-md">
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#8d7c62] block mb-4 uppercase font-bold flex items-center justify-center gap-2">
                🏴‍☠️ T-MINUS TO SET SAIL
              </span>

              {wedding.wedding_date && (
                <div className="mb-6 scale-90">
                  <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#5c554a" styleType="elegant" />
                </div>
              )}

              <div className="w-full space-y-6 pt-4 border-t border-dashed border-[#8d7c62]">
                {showRsvp && (
                  <div className="w-full [&>button]:w-full [&>button]:h-14 [&>button]:bg-[#bc4749] [&>button]:text-white [&>button]:uppercase [&>button]:tracking-widest [&>button]:text-xs [&>button]:font-black [&>button]:hover:bg-red-800 [&>button]:transition-all [&>button]:duration-300 [&>button]:rounded-none">
                    {renderRsvpButton()}
                  </div>
                )}
                
                <div className="w-full text-[#3d3a35]">
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
