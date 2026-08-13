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

export default function MoroccanRiadLayout({
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
  cardBgColor = '#3b1c1c',
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
      className="w-full relative overflow-x-hidden font-serif bg-[#3b1c1c] text-[#fdf4e3]"
      style={{ height: prefersReducedMotion ? 'auto' : '350vh' }}
      data-testid="layout-moroccan-riad"
    >
      {/* Moroccan Courtyard Tiles & Archway Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2e1313] via-[#3b1c1c] to-[#1c0808]" />
        
        {/* Zellige mosaic patterns overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://images.unsplash.com/photo-1599809275671-b5941cabc7a5?q=80&w=1000')] bg-repeat bg-center" />

        {/* Hanging copper lanterns lighting up sequentially (Signature Moment) */}
        {!prefersReducedMotion && (
          <div className="absolute inset-0 z-10">
            {/* Lantern 1: Foreground */}
            <div 
              className="absolute top-10 left-[15%] w-10 h-24 border border-amber-500/20 bg-amber-950/20 rounded-full flex flex-col items-center justify-end pb-3 transition-opacity duration-300"
              style={{ opacity: progress > 0.15 ? 0.9 : 0.2 }}
            >
              <div className="w-4 h-4 bg-amber-400 rounded-full blur-[8px] animate-pulse" />
            </div>
            
            {/* Lantern 2: Midground */}
            <div 
              className="absolute top-16 right-[20%] w-8 h-20 border border-amber-500/20 bg-amber-950/20 rounded-full flex flex-col items-center justify-end pb-2.5 transition-opacity duration-300"
              style={{ opacity: progress > 0.45 ? 0.9 : 0.2 }}
            >
              <div className="w-3.5 h-3.5 bg-amber-400 rounded-full blur-[6px] animate-pulse" />
            </div>

            {/* Lantern 3: Background */}
            <div 
              className="absolute top-24 left-[40%] w-6 h-16 border border-amber-500/20 bg-amber-950/20 rounded-full flex flex-col items-center justify-end pb-2 transition-opacity duration-300"
              style={{ opacity: progress > 0.75 ? 0.9 : 0.2 }}
            >
              <div className="w-2.5 h-2.5 bg-amber-400 rounded-full blur-[4px]" />
            </div>
          </div>
        )}
      </div>

      {/* Viewport content */}
      <div className={prefersReducedMotion ? 'relative w-full flex flex-col' : 'sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-between z-10'}>

        {/* ----------------- SCENE 1: RIAD ARCH TITLE ----------------- */}
        {(prefersReducedMotion || (progress >= 0 && progress < 0.22)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-rose-950/20 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center animate-fade-in z-20"}>
            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
              <span className="text-[10px] tracking-[0.4em] text-amber-500 font-bold uppercase mb-6">{eventTitle}</span>
              
              {/* Intricate Moroccan Arch Border */}
              <div className="p-8 border border-amber-500/30 rounded-[3rem] bg-[#2e1313]/40 backdrop-blur-sm">
                <h1 className="text-4xl sm:text-6xl font-light uppercase tracking-widest text-[#fdf4e3]" style={{ fontFamily: `"${headingFont}", serif` }}>
                  {wedding.bride_name} <br/>
                  <span className="text-lg opacity-40 font-light block my-4">+</span>
                  {wedding.groom_name}
                </h1>
              </div>
              
              <div className="h-px w-20 bg-amber-500/30 my-8" />
              <p className="text-xs uppercase tracking-[0.3em] text-amber-500/70 font-mono">SCROLL THROUGH THE RIAD COURTYARD</p>
            </div>
          </div>
        )}

        {/* ----------------- SCENE 2: STORY QUOTE ----------------- */}
        {(prefersReducedMotion || (progress >= 0.22 && progress < 0.42)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-rose-950/20 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <div className="text-xl sm:text-3xl font-light leading-relaxed max-w-xl font-serif px-6 italic text-amber-100">
              "{renderQuote()}"
            </div>
          </div>
        )}

        {/* ----------------- SCENE 3: DETAILS STUB ----------------- */}
        {(prefersReducedMotion || (progress >= 0.42 && progress < 0.65)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-rose-950/20 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.35em] text-amber-500 font-bold uppercase mb-8">COURTYARD DETAILS</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl text-sm font-semibold mb-8 font-mono">
              <div className="flex flex-col gap-2 p-6 rounded-2xl border border-amber-500/20 bg-[#2e1313]/80">
                <Calendar className="w-5 h-5 mx-auto text-amber-500 mb-2" />
                <span className="text-[#fdf4e3] text-lg">{dateStr}</span>
                <span className="text-amber-300">{timeStr}</span>
              </div>

              <div className="flex flex-col gap-2 p-6 rounded-2xl border border-amber-500/20 bg-[#2e1313]/80">
                <MapPin className="w-5 h-5 mx-auto text-amber-500 mb-2" />
                <span className="text-[#fdf4e3] text-lg">{wedding.venue_name || 'Riad Courtyard'}</span>
                {wedding.venue_address && (
                  <span className="text-amber-300/80 leading-normal text-xs">{wedding.venue_address}</span>
                )}
              </div>
            </div>

            {hasMaps && (
              <button 
                onClick={handleMapClick}
                className="px-6 h-12 border border-amber-500/40 bg-amber-950/40 text-amber-200 hover:bg-amber-500 hover:text-[#3b1c1c] rounded-none font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>COURTYARD DIRECTORY</span>
              </button>
            )}
          </div>
        )}

        {/* ----------------- SCENE 4: GALLERY CELL ----------------- */}
        {(prefersReducedMotion || (progress >= 0.65 && progress < 0.85)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-rose-950/20 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.3em] text-amber-500 font-bold uppercase mb-8">COURTYARD PHOTOGRAPHY</span>
            
            <div className="relative w-full max-w-sm aspect-[4/3] mx-auto rounded-none overflow-hidden border border-amber-500/20 shadow-2xl bg-[#2e1313]">
              {couplePhoto ? (
                <SafeImage 
                  src={couplePhoto} 
                  alt="Moroccan Couple" 
                  className="w-full h-full object-cover"
                  isHero={false}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-amber-300/50 bg-[#2e1313]/60">
                  <Heart className="w-12 h-12 mb-2 opacity-35" />
                  <span className="text-[10px] tracking-wider uppercase opacity-55">PORTRAIT PANEL</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------- SCENE 5: COURTYARD INVITATION PLAQUE RSVP ----------------- */}
        {(prefersReducedMotion || (progress >= 0.85 && progress <= 1)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20 overflow-y-auto"}>
            
            {/* Custom Plaque Styled RSVP */}
            <div id="moroccan-rsvp-plaque" className="w-full max-w-md mx-auto pt-10 pb-6 relative z-10 bg-[#2e1313]/95 border border-amber-500/30 rounded-[2.5rem] p-6 shadow-2xl backdrop-blur-md">
              <span className="text-[10px] font-mono tracking-[0.25em] text-amber-500 block mb-4 uppercase font-bold flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" /> T-MINUS TO RECEPTION
              </span>

              {wedding.wedding_date && (
                <div className="mb-6 scale-90">
                  <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#f59e0b" styleType="elegant" />
                </div>
              )}

              <div className="w-full space-y-6 pt-4 border-t border-dashed border-amber-500/20">
                {showRsvp && (
                  <div className="w-full [&>button]:w-full [&>button]:h-14 [&>button]:bg-amber-500 [&>button]:text-[#3b1c1c] [&>button]:uppercase [&>button]:tracking-widest [&>button]:text-xs [&>button]:font-black [&>button]:hover:bg-amber-400 [&>button]:transition-all [&>button]:duration-300 [&>button]:rounded-none">
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
