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

export default function StadiumChampionLayout({
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
  cardBgColor = '#14532d',
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

  // Stadium lights overlay & scoreboard update (Signature Moment)
  const lightsOpacity = prefersReducedMotion ? 0.95 : Math.min(0.95, progress * 1.5);
  const scoreText = prefersReducedMotion || progress > 0.6 ? '10 - 0' : '00 - 00';

  return (
    <div 
      ref={containerRef}
      className="w-full relative overflow-x-hidden font-mono bg-emerald-900 text-emerald-100"
      style={{ height: prefersReducedMotion ? 'auto' : '350vh' }}
      data-testid="layout-stadium-champion"
    >
      {/* Stadium Pitch Grid Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#064e3b]" />
        
        {/* Grass lines pattern */}
        <div className="absolute inset-0 opacity-15"
             style={{
               backgroundImage: 'linear-gradient(180deg, transparent 40%, rgba(255,255,255,0.15) 40%, rgba(255,255,255,0.15) 50%, transparent 50%)',
               backgroundSize: '100% 80px'
             }} 
        />

        {/* Scoreboard and lights (Signature Moment) */}
        <div className="absolute top-12 inset-x-0 flex flex-col items-center z-5">
          {/* Digital Scoreboard Panel */}
          <div className="w-64 p-4 bg-slate-950 border-4 border-slate-800 rounded-lg shadow-2xl flex flex-col items-center">
            <span className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase">CHAMPIONSHIP SCORE</span>
            <div className="text-3xl font-black text-amber-400 my-2 font-mono tracking-widest">
              {scoreText}
            </div>
            <span className="text-[9px] text-slate-400">Match Clock: 90:00</span>
          </div>

          {/* Light Beams overlay */}
          <div 
            className="w-full h-96 bg-radial-gradient from-white/20 to-transparent pointer-events-none transition-opacity duration-300"
            style={{
              opacity: lightsOpacity
            }}
          />
        </div>
      </div>

      {/* Viewport content */}
      <div className={prefersReducedMotion ? 'relative w-full flex flex-col' : 'sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-between z-10'}>

        {/* ----------------- SCENE 1: MATCH ENTRANCE ----------------- */}
        {(prefersReducedMotion || (progress >= 0 && progress < 0.22)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-emerald-800/30 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center animate-fade-in z-20"}>
            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
              <span className="text-[10px] tracking-[0.45em] text-emerald-300 font-bold uppercase mb-6">{eventTitle}</span>
              
              <div className="p-8 bg-slate-950/80 backdrop-blur-md border-4 border-emerald-400 shadow-2xl max-w-md">
                <h1 className="text-4xl sm:text-5xl font-bold uppercase tracking-widest text-white" style={{ fontFamily: `"${headingFont}", serif` }}>
                  {wedding.bride_name} <br/>
                  <span className="text-lg opacity-60 block my-3">&</span>
                  {wedding.groom_name}
                </h1>
              </div>
              
              <div className="h-px w-20 bg-emerald-800/50 my-8" />
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-300 font-mono">SCROLL TO KICK OFF</p>
            </div>
          </div>
        )}

        {/* ----------------- SCENE 2: MATCH QUOTE ----------------- */}
        {(prefersReducedMotion || (progress >= 0.22 && progress < 0.42)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-emerald-800/30 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <div className="text-lg sm:text-2xl font-semibold leading-relaxed max-w-xl px-6 italic text-emerald-50 bg-slate-950/80 p-8 border border-emerald-700 shadow-lg">
              "{renderQuote()}"
            </div>
          </div>
        )}

        {/* ----------------- SCENE 3: STADIUM COORDINATES ----------------- */}
        {(prefersReducedMotion || (progress >= 0.42 && progress < 0.65)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-emerald-800/30 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.35em] text-emerald-300 font-bold uppercase mb-8">MATCHDAY TIMETABLE</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl text-sm font-bold mb-8">
              <div className="flex flex-col gap-2 p-6 bg-slate-950/90 border border-emerald-700 shadow-sm">
                <Clock className="w-5 h-5 mx-auto text-emerald-300 mb-2" />
                <span className="text-white text-lg">{dateStr}</span>
                <span className="text-emerald-300">{timeStr}</span>
              </div>

              <div id="stadium-coordinates-plaque" className="flex flex-col gap-2 p-6 bg-slate-950/90 border border-emerald-700 shadow-sm">
                <MapPin className="w-5 h-5 mx-auto text-emerald-300 mb-2" />
                <span className="text-white text-lg">{wedding.venue_name || 'Champion Stadium'}</span>
                {wedding.venue_address && (
                  <span className="text-slate-350 leading-normal text-xs">{wedding.venue_address}</span>
                )}
                <span className="text-[10px] text-emerald-350 mt-1 font-mono tracking-widest uppercase">Gate: C-3 / Sector 19</span>
              </div>
            </div>

            {hasMaps && (
              <button 
                onClick={handleMapClick}
                className="px-6 h-12 border border-emerald-400 bg-slate-950/70 text-white hover:bg-white hover:text-slate-950 font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>VENUE FINDER</span>
              </button>
            )}
          </div>
        )}

        {/* ----------------- SCENE 4: GALLERY SCREEN ----------------- */}
        {(prefersReducedMotion || (progress >= 0.65 && progress < 0.85)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-emerald-800/30 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.3em] text-emerald-300 font-bold uppercase mb-8">PLAYER CARD PORTRAIT</span>
            
            <div className="relative w-full max-w-sm aspect-[4/3] mx-auto overflow-hidden border-4 border-amber-400 shadow-2xl bg-slate-950 p-2">
              {couplePhoto ? (
                <SafeImage 
                  src={couplePhoto} 
                  alt="Stadium Champion" 
                  className="w-full h-full object-cover opacity-90 contrast-110"
                  isHero={false}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-emerald-500 bg-slate-900">
                  <Heart className="w-12 h-12 mb-2 opacity-35" />
                  <span className="text-[10px] tracking-wider uppercase opacity-55">PORTRAIT</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------- SCENE 5: RSVP ----------------- */}
        {(prefersReducedMotion || (progress >= 0.85 && progress <= 1)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20 overflow-y-auto"}>
            <div id="stadium-rsvp" className="w-full max-w-md mx-auto pt-10 pb-6 relative z-10 bg-slate-950/95 border-4 border-emerald-400 p-6 shadow-2xl backdrop-blur-md">
              <span className="text-[10px] font-mono tracking-[0.25em] text-emerald-300 block mb-4 uppercase font-bold flex items-center justify-center gap-2">
                ⚽ T-MINUS TO MATCH KICKOFF
              </span>

              {wedding.wedding_date && (
                <div className="mb-6 scale-90">
                  <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#fbbf24" styleType="elegant" />
                </div>
              )}

              <div className="w-full space-y-6 pt-4 border-t border-dashed border-emerald-800/35">
                {showRsvp && (
                  <div className="w-full [&>button]:w-full [&>button]:h-14 [&>button]:bg-amber-500 [&>button]:text-slate-950 [&>button]:uppercase [&>button]:tracking-widest [&>button]:text-xs [&>button]:font-black [&>button]:hover:bg-amber-400 [&>button]:transition-all [&>button]:duration-300 [&>button]:rounded-none">
                    {renderRsvpButton()}
                  </div>
                )}
                
                <div className="w-full text-emerald-100 font-sans">
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
