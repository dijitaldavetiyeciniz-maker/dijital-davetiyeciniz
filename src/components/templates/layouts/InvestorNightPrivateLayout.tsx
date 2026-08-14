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

export default function InvestorNightPrivateLayout({
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

  // Market data line progress (Signature Moment)
  const lineDashOffset = prefersReducedMotion ? 0 : 300 - progress * 300;
  const sealScale = prefersReducedMotion ? 1 : 0.75 + progress * 0.25;

  return (
    <div 
      ref={containerRef}
      className="w-full relative overflow-x-hidden font-serif bg-slate-950 text-stone-200 border-t-8 border-amber-500"
      style={{ height: prefersReducedMotion ? 'auto' : '350vh' }}
      data-testid="layout-investor-night"
    >
      {/* Editorial Dossier Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div className="absolute inset-0 bg-[#090d16]" />
        
        {/* Market index chart lines (Signature Moment) */}
        <svg className="absolute w-[80%] h-[75%] max-w-xl text-amber-500/20" viewBox="0 0 100 100">
          <path 
            d="M 5,80 L 25,60 L 45,70 L 65,40 L 85,15" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeDasharray="4 4"
            style={{
              strokeDashoffset: lineDashOffset,
              strokeDasharray: '300'
            }}
          />
          {/* Index nodes */}
          <circle cx="25" cy="60" r="2" fill="currentColor" />
          <circle cx="65" cy="40" r="2" fill="currentColor" />
          
          {/* Gold Monogram Seal (reveals on progress) */}
          <g transform={`translate(85, 15) scale(${sealScale})`} className="text-amber-500">
            <circle cx="0" cy="0" r="6" fill="#090d16" stroke="currentColor" strokeWidth="1" />
            <text x="-2.5" y="2" fontSize="5" fontWeight="bold" fill="currentColor">i</text>
          </g>
        </svg>
      </div>

      {/* Viewport content */}
      <div className={prefersReducedMotion ? 'relative w-full flex flex-col' : 'sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-between z-10'}>

        {/* ----------------- SCENE 1: DOSSIER TITLE ----------------- */}
        {(prefersReducedMotion || (progress >= 0 && progress < 0.22)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-amber-500/20 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center animate-fade-in z-20"}>
            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
              <span className="text-[10px] tracking-[0.45em] text-amber-500 font-bold uppercase mb-6">{eventTitle}</span>
              
              <div className="p-8 bg-slate-900/90 border-2 border-amber-500 shadow-2xl max-w-md rounded-none">
                <h1 className="text-4xl sm:text-5xl font-bold uppercase tracking-widest text-slate-100" style={{ fontFamily: `"${headingFont}", serif` }}>
                  {wedding.bride_name} <br/>
                  <span className="text-lg opacity-40 font-light block my-3">&</span>
                  {wedding.groom_name}
                </h1>
              </div>
              
              <div className="h-px w-20 bg-amber-500/30 my-8" />
              <p className="text-xs uppercase tracking-[0.3em] text-amber-500 font-mono">SCROLL TO UNLOCK BRIEFING</p>
            </div>
          </div>
        )}

        {/* ----------------- SCENE 2: INVESTOR STATEMENT ----------------- */}
        {(prefersReducedMotion || (progress >= 0.22 && progress < 0.42)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-amber-500/20 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <div className="text-lg sm:text-2xl font-light leading-relaxed max-w-xl px-6 italic text-slate-200 bg-slate-900/80 p-8 border border-amber-500/20 shadow-md">
              "{renderQuote()}"
            </div>
          </div>
        )}

        {/* ----------------- SCENE 3: PORTFOLIO COORDINATES ----------------- */}
        {(prefersReducedMotion || (progress >= 0.42 && progress < 0.65)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-amber-500/20 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.35em] text-amber-500 font-bold uppercase mb-8">EVENT METRICS & FORUM VENUE</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl text-sm font-semibold mb-8 font-mono">
              <div className="flex flex-col gap-2 p-6 bg-slate-900/90 border border-amber-500/20 shadow-sm">
                <Clock className="w-5 h-5 mx-auto text-amber-500 mb-2" />
                <span className="text-white text-lg">{dateStr}</span>
                <span className="text-amber-400">{timeStr}</span>
              </div>

              <div id="investor-coordinates-plaque" className="flex flex-col gap-2 p-6 bg-slate-900/90 border border-amber-500/20 shadow-sm">
                <MapPin className="w-5 h-5 mx-auto text-amber-500 mb-2" />
                <span className="text-white text-lg">{wedding.venue_name || 'Briefing Room'}</span>
                {wedding.venue_address && (
                  <span className="text-slate-400 leading-normal text-xs">{wedding.venue_address}</span>
                )}
                <span className="text-[10px] text-amber-550 mt-1 font-mono tracking-widest uppercase">Grid: Sector A / Suite 800</span>
              </div>
            </div>

            {hasMaps && (
              <button 
                onClick={handleMapClick}
                className="px-6 h-12 border border-amber-500/30 bg-slate-900/60 text-white hover:bg-amber-500 hover:text-slate-950 font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>EXHIBIT GEOGRAPHY</span>
              </button>
            )}
          </div>
        )}

        {/* ----------------- SCENE 4: GALLERY SCREEN ----------------- */}
        {(prefersReducedMotion || (progress >= 0.65 && progress < 0.85)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-amber-500/20 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.3em] text-amber-500 font-bold uppercase mb-8">PORTFOLIO DEPICTION</span>
            
            <div className="relative w-full max-w-sm aspect-[4/3] mx-auto overflow-hidden border-4 border-amber-500/30 shadow-2xl bg-slate-900 p-2">
              {couplePhoto ? (
                <SafeImage 
                  src={couplePhoto} 
                  alt="Investor Night" 
                  className="w-full h-full object-cover grayscale opacity-90 contrast-125"
                  isHero={false}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-amber-500 bg-[#0f172a]">
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
            <div id="investor-rsvp" className="w-full max-w-md mx-auto pt-10 pb-6 relative z-10 bg-slate-900/95 border border-amber-500/20 p-6 shadow-2xl backdrop-blur-md">
              <span className="text-[10px] font-mono tracking-[0.25em] text-amber-300 block mb-4 uppercase font-bold flex items-center justify-center gap-2">
                🔒 MEMBERS ARCHIVE ACCESS TIMER
              </span>

              {wedding.wedding_date && (
                <div className="mb-6 scale-90">
                  <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#f59e0b" styleType="elegant" />
                </div>
              )}

              <div className="w-full space-y-6 pt-4 border-t border-dashed border-amber-500/20">
                {showRsvp && (
                  <div className="w-full [&>button]:w-full [&>button]:h-14 [&>button]:bg-amber-500 [&>button]:text-slate-950 [&>button]:uppercase [&>button]:tracking-widest [&>button]:text-xs [&>button]:font-black [&>button]:hover:bg-amber-400 [&>button]:transition-all [&>button]:duration-300 [&>button]:rounded-none">
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
