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

export default function LittleCaptainLayout({
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

  // Nautical sail path progress (Signature Moment)
  const sailOffset = prefersReducedMotion ? 0 : 250 - progress * 250;
  const shipX = prefersReducedMotion ? 85 : 20 + progress * 65;

  return (
    <div 
      ref={containerRef}
      className="w-full relative overflow-x-hidden font-mono bg-[#0f172a] text-sky-100"
      style={{ height: prefersReducedMotion ? 'auto' : '350vh' }}
      data-testid="layout-little-captain"
    >
      {/* Nautical Sea Charts Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a]" />
        
        {/* Yacht / ship wheel silhouettes and maps */}
        <div className="absolute inset-0 opacity-15 flex items-center justify-center">
          <svg className="w-80 h-80 text-sky-400" viewBox="0 0 100 100">
            {/* Steering wheel */}
            <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <circle cx="50" cy="50" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
            {[...Array(8)].map((_, i) => (
              <line key={i} x1="50" y1="50" x2="50" y2="20" stroke="currentColor" strokeWidth="1.5" transform={`rotate(${i * 45} 50 50)`} />
            ))}
          </svg>
        </div>

        {/* Sailing Route Path (Signature Moment) */}
        <svg className="absolute inset-x-0 bottom-16 h-32 w-full text-sky-300 pointer-events-none" viewBox="0 0 100 20">
          <path 
            d="M 10,10 Q 50,0 90,10" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="0.8" 
            strokeDasharray="3 3"
            style={{
              strokeDashoffset: sailOffset
            }}
          />
          {/* Port and Harbor nodes */}
          <circle cx="10" cy="10" r="1.5" fill="currentColor" />
          <circle cx="90" cy="10" r="1.5" fill="currentColor" />
          
          {/* Captain Ship Icon sailing on path */}
          <g transform={`translate(${shipX - 3}, 7) scale(0.06)`} fill="currentColor">
            <path d="M 10,40 Q 30,55 50,40 L 45,20 L 35,15 L 25,20 Z" />
            <path d="M 28,15 L 28,5 L 35,10 Z" fill="#f43f5e" />
          </g>
        </svg>
      </div>

      {/* Viewport content */}
      <div className={prefersReducedMotion ? 'relative w-full flex flex-col' : 'sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-between z-10'}>

        {/* ----------------- SCENE 1: CAPTAIN INTRO ----------------- */}
        {(prefersReducedMotion || (progress >= 0 && progress < 0.22)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-sky-900/30 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center animate-fade-in z-20"}>
            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
              <span className="text-[10px] tracking-[0.45em] text-sky-400 font-bold uppercase mb-6">{eventTitle}</span>
              
              <div className="p-8 bg-slate-900/95 border-2 border-sky-400 shadow-2xl max-w-md rounded-none">
                <h1 className="text-4xl sm:text-5xl font-light uppercase tracking-widest text-slate-100" style={{ fontFamily: `"${headingFont}", serif` }}>
                  {wedding.bride_name} <br/>
                  <span className="text-lg opacity-40 font-light block my-3">&</span>
                  {wedding.groom_name}
                </h1>
              </div>
              
              <div className="h-px w-20 bg-sky-900/50 my-8" />
              <p className="text-xs uppercase tracking-[0.3em] text-sky-400 font-mono">SCROLL TO SAIL TO HARBOR</p>
            </div>
          </div>
        )}

        {/* ----------------- SCENE 2: SEA LOG QUOTE ----------------- */}
        {(prefersReducedMotion || (progress >= 0.22 && progress < 0.42)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-sky-900/30 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <div className="text-xl sm:text-3xl font-light leading-relaxed max-w-xl font-serif px-6 italic text-slate-150 bg-slate-950/70 backdrop-blur-md p-8 border border-sky-900/20 shadow-md">
              "{renderQuote()}"
            </div>
          </div>
        )}

        {/* ----------------- SCENE 3: PORT COORDINATES ----------------- */}
        {(prefersReducedMotion || (progress >= 0.42 && progress < 0.65)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-sky-900/30 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.35em] text-sky-400 font-bold uppercase mb-8">PORT HARBOR COORDINATES</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl text-sm font-semibold mb-8 font-mono">
              <div className="flex flex-col gap-2 p-6 bg-slate-950/80 border border-sky-900/20 shadow-sm">
                <Clock className="w-5 h-5 mx-auto text-sky-400 mb-2" />
                <span className="text-white text-lg">{dateStr}</span>
                <span className="text-sky-400">{timeStr}</span>
              </div>

              <div id="captain-coordinates-plaque" className="flex flex-col gap-2 p-6 bg-slate-950/80 border border-sky-900/20 shadow-sm">
                <MapPin className="w-5 h-5 mx-auto text-sky-400 mb-2" />
                <span className="text-white text-lg">{wedding.venue_name || 'Captain Harbor'}</span>
                {wedding.venue_address && (
                  <span className="text-slate-400 leading-normal text-xs">{wedding.venue_address}</span>
                )}
                <span className="text-[10px] text-sky-450 mt-1 font-mono tracking-widest uppercase">Location: 40° N, 29° E</span>
              </div>
            </div>

            {hasMaps && (
              <button 
                onClick={handleMapClick}
                className="px-6 h-12 border border-sky-400 bg-slate-950/60 text-white hover:bg-white hover:text-slate-950 rounded-none font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>HARBOR CHART</span>
              </button>
            )}
          </div>
        )}

        {/* ----------------- SCENE 4: GALLERY SCREEN ----------------- */}
        {(prefersReducedMotion || (progress >= 0.65 && progress < 0.85)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-sky-900/30 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.3em] text-sky-400 font-bold uppercase mb-8">CAPTAIN PORTRAIT</span>
            
            <div className="relative w-full max-w-sm aspect-[4/3] mx-auto overflow-hidden border border-sky-900 shadow-2xl bg-slate-950 p-2">
              {couplePhoto ? (
                <SafeImage 
                  src={couplePhoto} 
                  alt="Little Captain" 
                  className="w-full h-full object-cover grayscale opacity-90 contrast-125"
                  isHero={false}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-sky-500 bg-[#0f172a]">
                  <Heart className="w-12 h-12 mb-2 opacity-35" />
                  <span className="text-[10px] tracking-wider uppercase opacity-55">PORTRAIT</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------- SCENE 5: BOARDING RSVP ----------------- */}
        {(prefersReducedMotion || (progress >= 0.85 && progress <= 1)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20 overflow-y-auto"}>
            <div id="captain-rsvp" className="w-full max-w-md mx-auto pt-10 pb-6 relative z-10 bg-slate-950/95 border border-sky-900/35 p-6 shadow-2xl backdrop-blur-md">
              <span className="text-[10px] font-mono tracking-[0.25em] text-sky-400 block mb-4 uppercase font-bold flex items-center justify-center gap-2">
                🚢 BOARDING PASS CONFIRMATION
              </span>

              {wedding.wedding_date && (
                <div className="mb-6 scale-90">
                  <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#38bdf8" styleType="elegant" />
                </div>
              )}

              <div className="w-full space-y-6 pt-4 border-t border-dashed border-sky-900/35">
                {showRsvp && (
                  <div className="w-full [&>button]:w-full [&>button]:h-14 [&>button]:bg-sky-500 [&>button]:text-slate-950 [&>button]:uppercase [&>button]:tracking-widest [&>button]:text-xs [&>button]:font-black [&>button]:hover:bg-sky-400 [&>button]:transition-all [&>button]:duration-300 [&>button]:rounded-none">
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
