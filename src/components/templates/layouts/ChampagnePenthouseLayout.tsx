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

export default function ChampagnePenthouseLayout({
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
  cardBgColor = '#0f172a',
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

  // Skyline lights (Signature Moment)
  const activeSkylineLights = prefersReducedMotion ? 4 : Math.min(4, Math.floor(progress * 4.5));
  const reflectionY = prefersReducedMotion ? 0 : 50 - progress * 50; // moves reflection line up

  return (
    <div 
      ref={containerRef}
      className="w-full relative overflow-x-hidden font-mono bg-slate-900 text-slate-100 border-t-8 border-cyan-500"
      style={{ height: prefersReducedMotion ? 'auto' : '350vh' }}
      data-testid="layout-penthouse"
    >
      {/* Contemporary glass penthouse backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div className="absolute inset-0 bg-[#0b0f19]" />
        
        {/* City skyline vector & reflection (Signature Moment) */}
        <svg className="absolute w-[80%] h-[75%] max-w-xl text-cyan-400/20" viewBox="0 0 100 100">
          {/* Skyline outline */}
          <path d="M 5,90 L 5,60 L 20,60 L 20,45 L 35,45 L 35,70 L 50,70 L 50,30 L 65,30 L 65,55 L 80,55 L 80,40 L 95,40 L 95,90 Z" fill="none" stroke="currentColor" strokeWidth="1" />
          
          {/* Skyline lights sequentially turning on */}
          {[...Array(4)].map((_, idx) => {
            const lit = idx < activeSkylineLights;
            const cx = 12 + idx * 22;
            const cy = 52 - (idx % 2) * 12;
            return (
              <circle key={idx} cx={cx} cy={cy} r="1.5" fill={lit ? '#22d3ee' : 'none'} className="transition-all duration-300" />
            );
          })}

          {/* Reflection vector lines rising */}
          <line x1="5" y1="92" x2="95" y2="92" stroke="currentColor" strokeWidth="0.5" />
          <line x1="50" y1="92" x2="50" y2={92 - reflectionY * 0.8} stroke="#22d3ee" strokeWidth="1.2" className="transition-all duration-100 ease-out" />
        </svg>
      </div>

      {/* Viewport content */}
      <div className={prefersReducedMotion ? 'relative w-full flex flex-col' : 'sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-between z-10'}>

        {/* ----------------- SCENE 1: PENTHOUSE TITLES ----------------- */}
        {(prefersReducedMotion || (progress >= 0 && progress < 0.22)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-cyan-900/30 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center animate-fade-in z-20"}>
            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
              <span className="text-[10px] tracking-[0.45em] text-cyan-400 font-bold uppercase mb-6">{eventTitle}</span>
              
              <div className="p-8 bg-slate-950/80 backdrop-blur-md border border-cyan-500/25 shadow-2xl max-w-md">
                <h1 className="text-4xl sm:text-5xl font-light uppercase tracking-widest text-slate-100" style={{ fontFamily: `"${headingFont}", serif` }}>
                  {wedding.bride_name} <br/>
                  <span className="text-lg opacity-40 font-light block my-3">&amp;</span>
                  {wedding.groom_name}
                </h1>
              </div>
              
              <div className="h-px w-20 bg-cyan-900/50 my-8" />
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-400 font-mono">SCROLL TO LIGHT PENTHOUSE PATH</p>
            </div>
          </div>
        )}

        {/* ----------------- SCENE 2: PENTHOUSE STATEMENT ----------------- */}
        {(prefersReducedMotion || (progress >= 0.22 && progress < 0.42)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-cyan-900/30 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <div className="text-lg sm:text-2xl font-light leading-relaxed max-w-xl px-6 italic text-slate-200 bg-slate-950/70 p-8 border border-cyan-950/20 shadow-md">
              "{renderQuote()}"
            </div>
          </div>
        )}

        {/* ----------------- SCENE 3: KEYNOTE COORDINATES ----------------- */}
        {(prefersReducedMotion || (progress >= 0.42 && progress < 0.65)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-cyan-900/30 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.35em] text-cyan-400 font-bold uppercase mb-8">PENTHOUSE LOCATION & CODES</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl text-sm font-bold mb-8">
              <div className="flex flex-col gap-2 p-6 bg-slate-950/80 border border-cyan-500/20 shadow-sm">
                <Clock className="w-5 h-5 mx-auto text-cyan-400 mb-2" />
                <span className="text-white text-lg">{dateStr}</span>
                <span className="text-cyan-400">{timeStr}</span>
              </div>

              <div id="penthouse-coordinates-plaque" className="flex flex-col gap-2 p-6 bg-slate-950/80 border border-cyan-500/20 shadow-sm">
                <MapPin className="w-5 h-5 mx-auto text-cyan-400 mb-2" />
                <span className="text-white text-lg">{wedding.venue_name || 'Skyline Penthouse'}</span>
                {wedding.venue_address && (
                  <span className="text-slate-400 leading-normal text-xs">{wedding.venue_address}</span>
                )}
                <span className="text-[10px] text-cyan-450 mt-1 font-mono tracking-widest uppercase">ROOFTOP DECK / SUITE 900</span>
              </div>
            </div>

            {hasMaps && (
              <button 
                onClick={handleMapClick}
                className="px-6 h-12 border border-cyan-500/30 bg-slate-950/60 text-white hover:bg-cyan-500 hover:text-slate-950 font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>VENUE LOCATOR</span>
              </button>
            )}
          </div>
        )}

        {/* ----------------- SCENE 4: GALLERY SCREEN ----------------- */}
        {(prefersReducedMotion || (progress >= 0.65 && progress < 0.85)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-cyan-900/30 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.3em] text-cyan-400 font-bold uppercase mb-8">PENTHOUSE VIEW ATTACHMENT</span>
            
            <div className="relative w-full max-w-sm aspect-[4/3] mx-auto overflow-hidden border-4 border-cyan-500/20 shadow-2xl bg-slate-950 p-2">
              {couplePhoto ? (
                <SafeImage 
                  src={couplePhoto} 
                  alt="Champagne Penthouse" 
                  className="w-full h-full object-cover grayscale opacity-90 contrast-125"
                  isHero={false}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-cyan-500 bg-[#0b0f19]">
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
            <div id="penthouse-rsvp" className="w-full max-w-md mx-auto pt-10 pb-6 relative z-10 bg-slate-950/95 border border-cyan-500/20 p-6 shadow-2xl backdrop-blur-md">
              <span className="text-[10px] font-mono tracking-[0.25em] text-cyan-300 block mb-4 uppercase font-bold flex items-center justify-center gap-2">
                📡 T-MINUS TO SUMMIT START
              </span>

              {wedding.wedding_date && (
                <div className="mb-6 scale-90">
                  <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#22d3ee" styleType="elegant" />
                </div>
              )}

              <div className="w-full space-y-6 pt-4 border-t border-dashed border-cyan-500/20">
                {showRsvp && (
                  <div className="w-full [&>button]:w-full [&>button]:h-14 [&>button]:bg-cyan-500 [&>button]:text-slate-950 [&>button]:uppercase [&>button]:tracking-widest [&>button]:text-xs [&>button]:font-black [&>button]:hover:bg-cyan-400 [&>button]:transition-all [&>button]:duration-300 [&>button]:rounded-none">
                    {renderRsvpButton()}
                  </div>
                )}
                
                <div className="w-full text-slate-100 font-sans">
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
