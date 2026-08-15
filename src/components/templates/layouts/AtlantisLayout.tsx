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

export default function AtlantisLayout({
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
  cardBgColor = '#062f4f',
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

  // Activation metrics based on scroll depth (Signature Moment)
  const isActivated = prefersReducedMotion || progress >= 0.7;
  const lightRayOpacity = prefersReducedMotion ? 0.35 : progress * 0.5;

  return (
    <div 
      ref={containerRef}
      className="w-full relative overflow-x-hidden font-serif bg-cyan-950 text-cyan-100"
      style={{ height: prefersReducedMotion ? 'auto' : '350vh' }}
      data-testid="layout-atlantis"
    >
      {/* Underwater Lost Palace Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#083344] via-[#164e63] to-[#0f172a]" />
        
        {/* Descending Light Rays (Signature Moment) */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-cyan-400/20 via-transparent to-transparent transition-opacity duration-300"
          style={{
            opacity: lightRayOpacity,
            transform: prefersReducedMotion ? 'none' : `translateY(${progress * 40}px) scaleY(${0.8 + progress * 0.4})`
          }}
        />

        {/* Ancient column ruins appearing under water */}
        <div 
          className="absolute bottom-0 inset-x-0 h-72 bg-contain bg-bottom bg-no-repeat transition-all duration-500 pointer-events-none"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1000")',
            filter: isActivated ? 'brightness(0.9) contrast(1.1) hue-rotate(15deg)' : 'brightness(0.2) contrast(0.8)',
            opacity: 0.15 + (prefersReducedMotion ? 0.2 : progress * 0.3)
          }}
        />
      </div>

      {/* Viewport content */}
      <div className={prefersReducedMotion ? 'relative w-full flex flex-col' : 'sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-between z-10'}>

        {/* ----------------- SCENE 1: DEEP ABYSS COVER ----------------- */}
        {(prefersReducedMotion || (progress >= 0 && progress < 0.22)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-cyan-900/20 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center animate-fade-in z-20"}>
            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
              <span className="text-[10px] tracking-[0.45em] text-cyan-300 font-bold uppercase mb-6">{eventTitle}</span>
              
              <div className="p-8 bg-cyan-950/80 backdrop-blur-md rounded-none border border-cyan-800 shadow-2xl max-w-md">
                <h1 className="text-4xl sm:text-5xl font-light uppercase tracking-widest text-cyan-100" style={{ fontFamily: `"${headingFont}", serif` }}>
                  {wedding.bride_name} <br/>
                  <span className="text-lg opacity-40 font-light block my-3">&</span>
                  {wedding.groom_name}
                </h1>
              </div>
              
              <div className="h-px w-20 bg-cyan-850 my-8" />
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-400 font-mono">SCROLL TO DESCEND INTO THE RUINS</p>
            </div>
          </div>
        )}

        {/* ----------------- SCENE 2: UNDERWATER STORY ----------------- */}
        {(prefersReducedMotion || (progress >= 0.22 && progress < 0.42)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-cyan-900/20 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <div className="text-xl sm:text-3xl font-light leading-relaxed max-w-xl font-serif px-6 italic text-cyan-200 bg-cyan-950/70 backdrop-blur-md p-8 border border-cyan-800 shadow-md">
              "{renderQuote()}"
            </div>
          </div>
        )}

        {/* ----------------- SCENE 3: RUINS COORDINATES ----------------- */}
        {(prefersReducedMotion || (progress >= 0.42 && progress < 0.65)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-cyan-900/20 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.35em] text-cyan-300 font-bold uppercase mb-8">RUINS DEPTH COORDINATES</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl text-sm font-semibold mb-8 font-mono">
              <div className="flex flex-col gap-2 p-6 bg-cyan-950/80 border border-cyan-800 shadow-sm">
                <Calendar className="w-5 h-5 mx-auto text-cyan-300 mb-2" />
                <span className="text-white text-lg">{dateStr}</span>
                <span className="text-cyan-400">{timeStr}</span>
              </div>

              <div id="atlantis-coordinates-plaque" className="flex flex-col gap-2 p-6 bg-cyan-950/80 border border-cyan-800 shadow-sm">
                <MapPin className="w-5 h-5 mx-auto text-cyan-300 mb-2" />
                <span className="text-white text-lg">{wedding.venue_name || 'Atlantis Ruins'}</span>
                {wedding.venue_address && (
                  <span className="text-cyan-400 leading-normal text-xs">{wedding.venue_address}</span>
                )}
                <span className="text-[10px] text-cyan-400 mt-1 font-mono tracking-widest uppercase">Depth: -450m / Atlantic Ridge</span>
              </div>
            </div>

            {hasMaps && (
              <button 
                onClick={handleMapClick}
                className="px-6 h-12 border border-cyan-800 bg-cyan-950/60 text-white hover:bg-white hover:text-cyan-950 font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>MAPS LOCATION</span>
              </button>
            )}
          </div>
        )}

        {/* ----------------- SCENE 4: GALLERY SCREEN ----------------- */}
        {(prefersReducedMotion || (progress >= 0.65 && progress < 0.85)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-cyan-900/20 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.3em] text-cyan-300 font-bold uppercase mb-8">UNDERWATER ALBUM</span>
            
            <div className="relative w-full max-w-sm aspect-[4/3] mx-auto overflow-hidden border border-cyan-800 shadow-2xl bg-cyan-950">
              {couplePhoto ? (
                <SafeImage 
                  src={couplePhoto} 
                  alt="Atlantis Couple" 
                  className="w-full h-full object-cover opacity-80"
                  isHero={false}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-cyan-500 bg-cyan-900">
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
            <div id="atlantis-rsvp" className="w-full max-w-md mx-auto pt-10 pb-6 relative z-10 bg-cyan-950/95 border border-cyan-850 p-6 shadow-2xl backdrop-blur-md">
              <span className="text-[10px] font-mono tracking-[0.25em] text-cyan-300 block mb-4 uppercase font-bold flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 text-cyan-300" /> T-MINUS TO PALACE AWAKENING
              </span>

              {wedding.wedding_date && (
                <div className="mb-6 scale-90">
                  <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#06b6d4" styleType="elegant" />
                </div>
              )}

              <div className="w-full space-y-6 pt-4 border-t border-dashed border-cyan-850">
                {showRsvp && (
                  <div className="w-full [&>button]:w-full [&>button]:h-14 [&>button]:bg-cyan-500 [&>button]:text-cyan-950 [&>button]:uppercase [&>button]:tracking-widest [&>button]:text-xs [&>button]:font-black [&>button]:hover:bg-cyan-400 [&>button]:transition-all [&>button]:duration-300 [&>button]:rounded-none">
                    {renderRsvpButton()}
                  </div>
                )}
                
                <div className="w-full text-cyan-100 font-sans">
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
