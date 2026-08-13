'use client';
import React, { useRef, useEffect, useState } from 'react';
import { Calendar, MapPin, Navigation, Compass, Heart, MessageSquare } from 'lucide-react';
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

export default function CinematicGardenJourneyLayout({
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
  cardBgColor = '#1e3f20',
  selectedBackground,
  cardSurfaceStyle
}: LayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { progress, activeScene } = useSceneProgress(containerRef, 5);
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

  // Visual grade color styles representing daylight -> sunset -> night
  // Scene 1-2: daylight green/gold (#2d5a27 -> #3d7a36)
  // Scene 3-4: sunset amber (#b25e15 -> #8c3e07)
  // Scene 5: night indigo (#0b1d33 -> #050b14)
  const bgGradient = prefersReducedMotion
    ? 'linear-gradient(to bottom, #2d5a27, #8c3e07, #0b1d33)'
    : progress < 0.4
    ? 'linear-gradient(to bottom, #112a13, #224c25)'
    : progress < 0.75
    ? 'linear-gradient(to bottom, #3d2309, #5e3205)'
    : 'linear-gradient(to bottom, #091724, #030a10)';

  return (
    <div 
      ref={containerRef}
      className="w-full relative select-none font-sans"
      style={{ height: prefersReducedMotion ? 'auto' : '350vh', background: bgGradient, transition: 'background 0.8s ease' }}
      data-testid="layout-cinematic-garden-journey"
    >
      {/* Sticky viewport for animation tracking */}
      <div className={prefersReducedMotion ? 'relative w-full' : 'sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-between z-10'}>
        
        {/* Dynamic Sunlight / Glow overlays */}
        {!prefersReducedMotion && (
          <div 
            className="absolute inset-0 pointer-events-none transition-opacity duration-1000 z-10 mix-blend-screen"
            style={{
              backgroundImage: progress < 0.4 
                ? 'radial-gradient(circle at 80% 20%, rgba(251, 191, 36, 0.25) 0%, transparent 60%)' // Daylight sun
                : progress < 0.75
                ? 'radial-gradient(circle at 50% 30%, rgba(249, 115, 22, 0.35) 0%, transparent 70%)' // Golden sunset
                : 'radial-gradient(circle at 20% 10%, rgba(125, 211, 252, 0.15) 0%, transparent 50%)', // Lunar glow
            }}
          />
        )}

        {/* Global decorative floral overlay elements */}
        <div className="absolute inset-0 pointer-events-none z-10 opacity-15 overflow-hidden">
          <svg className="absolute -top-10 -left-10 w-48 h-48 text-emerald-300" fill="currentColor" viewBox="0 0 100 100">
            <path d="M30 20 C 40 40, 20 60, 40 80 C 60 70, 70 80, 80 50 C 60 40, 50 20, 30 20 Z" />
          </svg>
          <svg className="absolute -bottom-10 -right-10 w-64 h-64 text-amber-500" fill="currentColor" viewBox="0 0 100 100">
            <path d="M20 30 C 40 20, 60 40, 80 30 C 70 60, 80 70, 50 80 C 40 60, 20 50, 20 30 Z" />
          </svg>
        </div>

        {/* ----------------- SCENE 1: ENTRANCE ----------------- */}
        {(prefersReducedMotion || (progress >= 0 && progress < 0.22)) && (
          <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center animate-fade-in z-20">
            {/* Parallax foliage framing elements */}
            {!prefersReducedMotion && (
              <>
                <div 
                  className="absolute left-0 top-0 bottom-0 w-1/3 bg-gradient-to-r from-black/40 to-transparent pointer-events-none transition-transform duration-500"
                  style={{ transform: `translateX(-${progress * 250}%)` }}
                >
                  <div className="w-full h-full opacity-35 bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-emerald-800 via-transparent to-transparent" />
                </div>
                <div 
                  className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-black/40 to-transparent pointer-events-none transition-transform duration-500"
                  style={{ transform: `translateX(${progress * 250}%)` }}
                >
                  <div className="w-full h-full opacity-35 bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-emerald-800 via-transparent to-transparent" />
                </div>
              </>
            )}

            <span className="text-[10px] tracking-[0.4em] text-emerald-300 font-bold uppercase mb-4 animate-pulse">{eventTitle}</span>
            <div className="text-4xl sm:text-6xl font-light tracking-wide max-w-xl text-emerald-100 leading-tight select-text" style={{ fontFamily: `"${headingFont}", serif` }}>
              {wedding.bride_name} <span className="text-2xl font-serif italic text-emerald-300/60 block my-2">&</span> {wedding.groom_name}
            </div>
            <div className="h-px w-20 bg-emerald-500/30 my-8" />
            <p className="text-xs uppercase tracking-[0.25em] text-emerald-200/80 font-mono">
              SCROLL DOWN TO ENTER THE GARDEN
            </p>
          </div>
        )}

        {/* ----------------- SCENE 2: NAMES REVEAL & QUOTE ----------------- */}
        {(prefersReducedMotion || (progress >= 0.22 && progress < 0.45)) && (
          <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20">
            <div className="relative w-36 h-36 mb-6">
              {/* Blooming Flower SVG */}
              <svg 
                className="w-full h-full text-emerald-400 opacity-80" 
                viewBox="0 0 100 100"
                style={{
                  transform: prefersReducedMotion ? 'scale(1)' : `scale(${0.5 + (progress - 0.22) * 2}) rotate(${(progress - 0.22) * 90}deg)`,
                  transition: 'transform 0.3s ease-out'
                }}
              >
                <path d="M50 0 C55 20 65 30 80 30 C65 35 55 45 50 60 C45 45 35 35 20 30 C35 30 45 20 50 0 Z" fill="currentColor" />
                <path d="M50 40 C52 45 58 48 65 48 C58 50 52 52 50 65 C48 52 42 50 35 48 C42 48 48 45 50 40 Z" fill="#fbbf24" />
              </svg>
            </div>
            
            <div className="text-2xl sm:text-4xl italic text-amber-100/90 leading-relaxed max-w-xl font-serif px-6 drop-shadow-md">
              "{renderQuote()}"
            </div>
          </div>
        )}

        {/* ----------------- SCENE 3: EVENT DETAILS ----------------- */}
        {(prefersReducedMotion || (progress >= 0.45 && progress < 0.68)) && (
          <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20">
            <span className="text-[10px] tracking-[0.3em] text-amber-400 font-bold uppercase mb-8">EVENT INFORMATION</span>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl text-sm font-semibold mb-10 font-mono">
              <div className="flex flex-col gap-2 p-6 rounded-2xl border border-amber-500/20 bg-amber-950/20 backdrop-blur-md hover:border-amber-400/40 transition-colors">
                <Calendar className="w-6 h-6 mx-auto text-amber-400 mb-2" />
                <span className="text-amber-100 text-lg uppercase">{dateStr}</span>
                <span className="text-amber-300/80">{timeStr}</span>
              </div>

              <div className="flex flex-col gap-2 p-6 rounded-2xl border border-amber-500/20 bg-amber-950/20 backdrop-blur-md hover:border-amber-400/40 transition-colors">
                <MapPin className="w-6 h-6 mx-auto text-amber-400 mb-2" />
                <span className="text-amber-100 text-lg uppercase">{wedding.venue_name || 'Garden Venue'}</span>
                {wedding.venue_address && (
                  <span className="text-amber-300/80 leading-normal text-xs">{wedding.venue_address}</span>
                )}
              </div>
            </div>

            {hasMaps && (
              <button 
                onClick={handleMapClick}
                className="px-8 h-12 border border-amber-500/40 bg-amber-950/40 text-amber-200 hover:bg-amber-500 hover:text-amber-950 rounded-full font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>GARDEN DIRECTIONS</span>
              </button>
            )}
          </div>
        )}

        {/* ----------------- SCENE 4: FLOATING MEDIA GALLERY ----------------- */}
        {(prefersReducedMotion || (progress >= 0.68 && progress < 0.85)) && (
          <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20">
            <span className="text-[10px] tracking-[0.3em] text-emerald-400 font-bold uppercase mb-8">MEMORY LEAVES</span>
            
            {/* Hanging photo frames */}
            <div className="relative w-full max-w-sm aspect-[4/3] mx-auto bg-stone-900/60 rounded-2xl border-4 border-emerald-950/40 p-3 shadow-2xl backdrop-blur-md">
              <div className="w-full h-full rounded-lg overflow-hidden relative">
                {couplePhoto ? (
                  <SafeImage 
                    src={couplePhoto} 
                    alt="Garden Couple" 
                    className="w-full h-full object-cover"
                    isHero={false}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-emerald-300 bg-emerald-950/20">
                    <Heart className="w-12 h-12 mb-2 opacity-50 animate-pulse" />
                    <span className="text-[10px] tracking-wider uppercase opacity-55">OUR HAPPY MOMENTS</span>
                  </div>
                )}
              </div>
              {/* Virtual strings hanging the trellis photo */}
              <div className="absolute -top-10 left-1/4 w-0.5 h-10 bg-emerald-500/40" />
              <div className="absolute -top-10 right-1/4 w-0.5 h-10 bg-emerald-500/40" />
            </div>
          </div>
        )}

        {/* ----------------- SCENE 5: RSVP & LANTERN WISHES ----------------- */}
        {(prefersReducedMotion || (progress >= 0.85 && progress <= 1)) && (
          <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20 overflow-y-auto">
            {/* Hanging Lantern SVGs */}
            {!prefersReducedMotion && (
              <div className="absolute top-10 left-0 w-full flex justify-around pointer-events-none z-10">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center animate-bounce" style={{ animationDelay: `${i * 300}ms`, animationDuration: '4s' }}>
                    <div className="w-0.5 h-14 bg-amber-400/30" />
                    <div className="w-6 h-10 rounded-t-full rounded-b-md bg-gradient-to-b from-amber-300 to-amber-500/30 border border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.6)]" />
                  </div>
                ))}
              </div>
            )}

            <div className="w-full max-w-md mx-auto pt-16 pb-10">
              {wedding.wedding_date && (
                <div className="mb-8 scale-90">
                  <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#f59e0b" styleType="elegant" />
                </div>
              )}

              <div className="w-full space-y-6">
                {showRsvp && (
                  <div className="w-full [&>button]:w-full [&>button]:h-14 [&>button]:bg-amber-500 [&>button]:text-amber-950 [&>button]:uppercase [&>button]:tracking-widest [&>button]:text-xs [&>button]:font-black [&>button]:hover:bg-amber-400 [&>button]:transition-all [&>button]:duration-300 [&>button]:rounded-full [&>button]:shadow-lg">
                    {renderRsvpButton()}
                  </div>
                )}
                
                <div className="w-full mt-6">
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
