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

export default function CosmicGardenLayout({
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
  cardBgColor = '#022c22',
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

  // Botanical node growth dimensions based on scroll progress (Signature Moment)
  const branchHeight = prefersReducedMotion ? 120 : progress * 150;
  const blossomScale = prefersReducedMotion ? 1 : progress > 0.4 ? (progress - 0.4) * 1.6 : 0;

  return (
    <div 
      ref={containerRef}
      className="w-full relative overflow-x-hidden font-serif bg-emerald-950 text-emerald-100"
      style={{ height: prefersReducedMotion ? 'auto' : '350vh' }}
      data-testid="layout-cosmic-garden"
    >
      {/* Bioluminescent Cosmic Flora Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Navy/Emerald space gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#022c22] via-[#091e3a] to-[#042f2e]" />
        
        {/* Star Constellation growing vines (Signature Moment) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-full h-full max-w-xl max-h-xl text-teal-400/30 opacity-70" viewBox="0 0 200 200">
            {/* Main trunk node */}
            <circle cx="100" cy="100" r="4" className="fill-teal-300" />
            
            {/* Vine paths growing out */}
            <line x1="100" y1="100" x2="100" y2={100 - branchHeight} stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
            <line x1="100" y1="100" x2={100 - branchHeight * 0.5} y2={100 + branchHeight * 0.5} stroke="currentColor" strokeWidth="1.5" />
            <line x1="100" y1="100" x2={100 + branchHeight * 0.5} y2={100 + branchHeight * 0.5} stroke="currentColor" strokeWidth="1.5" />
            
            {/* Blooming flower nodes at the tips */}
            {blossomScale > 0 && (
              <>
                <circle cx="100" cy={100 - branchHeight} r={6 * blossomScale} className="fill-pink-400/60 stroke-teal-300 stroke-2 animate-pulse" />
                <circle cx={100 - branchHeight * 0.5} cy={100 + branchHeight * 0.5} r={4 * blossomScale} className="fill-purple-400/60 stroke-teal-300" />
                <circle cx={100 + branchHeight * 0.5} cy={100 + branchHeight * 0.5} r={4 * blossomScale} className="fill-purple-400/60 stroke-teal-300" />
              </>
            )}
          </svg>
        </div>
      </div>

      {/* Viewport content */}
      <div className={prefersReducedMotion ? 'relative w-full flex flex-col' : 'sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-between z-10'}>

        {/* ----------------- SCENE 1: BIOLUMINESCENT COVER ----------------- */}
        {(prefersReducedMotion || (progress >= 0 && progress < 0.22)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-teal-900/20 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center animate-fade-in z-20"}>
            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
              <span className="text-[10px] tracking-[0.45em] text-teal-300 font-bold uppercase mb-6">{eventTitle}</span>
              
              <div className="p-8 bg-emerald-950/80 backdrop-blur-md rounded-full border border-teal-500/20 shadow-2xl max-w-md">
                <h1 className="text-4xl sm:text-5xl font-light uppercase tracking-widest text-emerald-100" style={{ fontFamily: `"${headingFont}", serif` }}>
                  {wedding.bride_name} <br/>
                  <span className="text-lg opacity-40 font-light block my-3">&</span>
                  {wedding.groom_name}
                </h1>
              </div>
              
              <div className="h-px w-20 bg-teal-800/30 my-8" />
              <p className="text-xs uppercase tracking-[0.3em] text-teal-300/80 font-mono">SCROLL TO BLOOM THE STELLAR VINES</p>
            </div>
          </div>
        )}

        {/* ----------------- SCENE 2: POETIC DETAILS ----------------- */}
        {(prefersReducedMotion || (progress >= 0.22 && progress < 0.42)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-teal-900/20 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <div className="text-xl sm:text-3xl font-light leading-relaxed max-w-xl font-serif px-6 italic text-emerald-100 bg-[#091e3a]/60 backdrop-blur-md p-8 rounded-3xl border border-teal-500/10 shadow-md">
              "{renderQuote()}"
            </div>
          </div>
        )}

        {/* ----------------- SCENE 3: BIOLUMINESCENT DETAILS ----------------- */}
        {(prefersReducedMotion || (progress >= 0.42 && progress < 0.65)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-teal-900/20 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.35em] text-teal-300 font-bold uppercase mb-8">COSMIC BIO-COORDINATES</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl text-sm font-semibold mb-8 font-mono">
              <div className="flex flex-col gap-2 p-6 rounded-3xl border border-teal-500/10 bg-[#091e3a]/80 backdrop-blur-md shadow-sm">
                <Calendar className="w-5 h-5 mx-auto text-teal-300 mb-2" />
                <span className="text-emerald-100 text-lg">{dateStr}</span>
                <span className="text-teal-400">{timeStr}</span>
              </div>

              <div id="cosmic-details-plaque" className="flex flex-col gap-2 p-6 rounded-3xl border border-teal-500/10 bg-[#091e3a]/80 backdrop-blur-md shadow-sm">
                <MapPin className="w-5 h-5 mx-auto text-teal-300 mb-2" />
                <span className="text-emerald-100 text-lg">{wedding.venue_name || 'Cosmic Glasshouse'}</span>
                {wedding.venue_address && (
                  <span className="text-emerald-300/80 leading-normal text-xs">{wedding.venue_address}</span>
                )}
              </div>
            </div>

            {hasMaps && (
              <button 
                onClick={handleMapClick}
                className="px-6 h-12 border border-teal-500/30 bg-emerald-950/60 text-teal-200 hover:bg-teal-400 hover:text-emerald-950 rounded-full font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>GLASS HOUSE DIRECTORY</span>
              </button>
            )}
          </div>
        )}

        {/* ----------------- SCENE 4: GALLERY SCREEN ----------------- */}
        {(prefersReducedMotion || (progress >= 0.65 && progress < 0.85)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-teal-900/20 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.3em] text-teal-300 font-bold uppercase mb-8">BOTANICAL CONSTELLATION</span>
            
            {/* Floating botanical constellation frames */}
            <div id="cosmic-gallery-frame" className="relative w-full max-w-sm aspect-[4/3] mx-auto rounded-[3rem] overflow-hidden border-4 border-teal-500/30 p-2 shadow-2xl bg-emerald-950">
              <div className="w-full h-full rounded-[2.5rem] overflow-hidden relative">
                {couplePhoto ? (
                  <SafeImage 
                    src={couplePhoto} 
                    alt="Cosmic Couple" 
                    className="w-full h-full object-cover"
                    isHero={false}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-teal-300 bg-emerald-900/20">
                    <Heart className="w-12 h-12 mb-2 opacity-35" />
                    <span className="text-[10px] tracking-wider uppercase opacity-55">PORTRAIT</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ----------------- SCENE 5: RSVP ----------------- */}
        {(prefersReducedMotion || (progress >= 0.85 && progress <= 1)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20 overflow-y-auto"}>
            <div id="cosmic-rsvp" className="w-full max-w-md mx-auto pt-10 pb-6 relative z-10 bg-[#091e3a]/90 border border-teal-500/20 rounded-[3rem] p-6 shadow-2xl backdrop-blur-md">
              <span className="text-[10px] font-mono tracking-[0.25em] text-teal-300 block mb-4 uppercase font-bold flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 text-teal-300" /> T-MINUS TO BIO-BLOOM
              </span>

              {wedding.wedding_date && (
                <div className="mb-6 scale-90">
                  <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#2dd4bf" styleType="elegant" />
                </div>
              )}

              <div className="w-full space-y-6 pt-4 border-t border-dashed border-teal-500/20">
                {showRsvp && (
                  <div className="w-full [&>button]:w-full [&>button]:h-14 [&>button]:bg-teal-400 [&>button]:text-emerald-950 [&>button]:uppercase [&>button]:tracking-widest [&>button]:text-xs [&>button]:font-black [&>button]:hover:bg-teal-300 [&>button]:transition-all [&>button]:duration-300 [&>button]:rounded-full">
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
