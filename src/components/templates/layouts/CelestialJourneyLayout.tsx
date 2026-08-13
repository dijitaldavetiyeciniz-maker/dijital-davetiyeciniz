'use client';
import React, { useRef, useEffect, useState } from 'react';
import { Calendar, MapPin, Navigation, Orbit, Star, Clock } from 'lucide-react';
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

export default function CelestialJourneyLayout({
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
  cardBgColor = '#030712',
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

  const brideInitial = wedding.bride_name ? wedding.bride_name.trim().charAt(0) : 'E';
  const groomInitial = wedding.groom_name ? wedding.groom_name.trim().charAt(0) : '';

  return (
    <div 
      ref={containerRef}
      className="w-full relative overflow-x-hidden font-sans bg-[#030712] text-white"
      style={{ height: prefersReducedMotion ? 'auto' : '350vh' }}
      data-testid="layout-cinematic-celestial"
    >
      {/* Dynamic Star Dust Canvas Background Layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,#091d33_0%,#030712_70%)]" />
        
        {/* Star elements shifting depths */}
        {!prefersReducedMotion && (
          <>
            <div 
              className="absolute inset-0 opacity-40 transition-transform duration-100 ease-out"
              style={{
                backgroundImage: 'radial-gradient(1.5px 1.5px at 20px 30px, #fff, rgba(0,0,0,0)), radial-gradient(2px 2px at 80px 150px, #fff, rgba(0,0,0,0)), radial-gradient(1px 1px at 150px 260px, #fff, rgba(0,0,0,0))',
                backgroundSize: '300px 300px',
                transform: `translateY(-${progress * 80}px)`
              }}
            />
            <div 
              className="absolute inset-0 opacity-20 transition-transform duration-100 ease-out"
              style={{
                backgroundImage: 'radial-gradient(2px 2px at 50px 80px, #38bdf8, rgba(0,0,0,0)), radial-gradient(1px 1px at 200px 120px, #fff, rgba(0,0,0,0)), radial-gradient(3px 3px at 280px 380px, #e879f9, rgba(0,0,0,0))',
                backgroundSize: '400px 400px',
                transform: `translateY(-${progress * 150}px) scale(${1 + progress * 0.1})`
              }}
            />
          </>
        )}
      </div>

      {/* Sticky layout container */}
      <div className={prefersReducedMotion ? 'relative w-full' : 'sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-between z-10'}>
        
        {/* ----------------- SCENE 1: CONSTELLATION ASSEMBLE ----------------- */}
        {(prefersReducedMotion || (progress >= 0 && progress < 0.22)) && (
          <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center animate-fade-in z-20">
            {/* Glowing Space Monogram */}
            <div className="relative w-28 h-28 mb-8 border border-sky-500/20 rounded-full flex items-center justify-center bg-sky-950/10 backdrop-blur-md">
              {/* Star constellation lines mapping monogram */}
              {!prefersReducedMotion && (
                <svg className="absolute inset-0 w-full h-full text-sky-400 opacity-60" viewBox="0 0 100 100">
                  <line x1="50" y1="10" x2="20" y2="50" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="20" y1="50" x2="50" y2="90" stroke="currentColor" strokeWidth="1" />
                  <line x1="50" y1="90" x2="80" y2="50" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="80" y1="50" x2="50" y2="10" stroke="currentColor" strokeWidth="1" />
                  <circle cx="50" cy="10" r="3" fill="#fff" className="animate-ping" />
                  <circle cx="20" cy="50" r="3" fill="#fff" />
                  <circle cx="50" cy="90" r="3" fill="#fff" />
                  <circle cx="80" cy="50" r="3" fill="#fff" />
                </svg>
              )}
              <span className="text-3xl font-serif tracking-widest text-sky-200">
                {groomInitial ? `${brideInitial}${groomInitial}` : brideInitial}
              </span>
            </div>

            <span className="text-[10px] tracking-[0.4em] text-sky-400 font-bold uppercase mb-4">{eventTitle}</span>
            <h1 className="text-4xl sm:text-6xl font-light uppercase tracking-widest leading-none text-white" style={{ fontFamily: `"${headingFont}", serif` }}>
              {wedding.bride_name} <br/>
              <span className="text-lg opacity-40 font-light block my-4">+</span>
              {wedding.groom_name}
            </h1>
            <div className="h-[2px] w-20 bg-sky-500/20 my-8" />
            <p className="text-xs uppercase tracking-[0.3em] text-sky-300/60 font-mono">SCROLL THROUGH THE CONSTELLATIONS</p>
          </div>
        )}

        {/* ----------------- SCENE 2: INTERSTELLAR QUOTE ----------------- */}
        {(prefersReducedMotion || (progress >= 0.22 && progress < 0.42)) && (
          <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20">
            <div className="text-xl sm:text-3xl font-light leading-relaxed max-w-xl font-serif px-6 italic text-sky-100 drop-shadow-md">
              "{renderQuote()}"
            </div>
            <div className="flex justify-center mt-6 gap-2">
              <Star className="w-3 h-3 text-sky-400 animate-pulse" />
              <Star className="w-3 h-3 text-sky-400 animate-pulse delay-75" />
              <Star className="w-3 h-3 text-sky-400 animate-pulse delay-150" />
            </div>
          </div>
        )}

        {/* ----------------- SCENE 3: ORBIT METRICS (DETAILS) ----------------- */}
        {(prefersReducedMotion || (progress >= 0.42 && progress < 0.65)) && (
          <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20">
            <span className="text-[10px] tracking-[0.3em] text-sky-400 font-bold uppercase mb-8">COORDINATE MAPPING</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl text-sm font-semibold mb-10 font-mono">
              <div className="flex flex-col gap-2 p-6 rounded-2xl border border-sky-500/20 bg-sky-950/20 backdrop-blur-md hover:border-sky-400/40 transition-colors">
                <Calendar className="w-5 h-5 mx-auto text-sky-400 mb-2" />
                <span className="text-white text-lg">{dateStr}</span>
                <span className="text-sky-300/80">{timeStr}</span>
              </div>

              <div className="flex flex-col gap-2 p-6 rounded-2xl border border-sky-500/20 bg-sky-950/20 backdrop-blur-md hover:border-sky-400/40 transition-colors">
                <MapPin className="w-5 h-5 mx-auto text-sky-400 mb-2" />
                <span className="text-white text-lg">{wedding.venue_name || 'Starlight Arena'}</span>
                {wedding.venue_address && (
                  <span className="text-sky-300/80 leading-normal text-xs">{wedding.venue_address}</span>
                )}
              </div>
            </div>

            {hasMaps && (
              <button 
                onClick={handleMapClick}
                className="px-6 h-12 border border-sky-500/40 bg-sky-950/40 text-sky-200 hover:bg-sky-400 hover:text-sky-950 rounded-full font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                <span>LAUNCH NAVIGATION</span>
              </button>
            )}
          </div>
        )}

        {/* ----------------- SCENE 4: FLOATING STAR DUST PHOTO ----------------- */}
        {(prefersReducedMotion || (progress >= 0.65 && progress < 0.85)) && (
          <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20">
            <span className="text-[10px] tracking-[0.3em] text-sky-400 font-bold uppercase mb-8">CELESTIAL PHOTO MATRIX</span>
            
            <div className="relative w-full max-w-sm aspect-[4/3] mx-auto rounded-2xl overflow-hidden border-2 border-sky-500/20 shadow-[0_0_35px_rgba(56,189,248,0.15)] bg-slate-950">
              {couplePhoto ? (
                <SafeImage 
                  src={couplePhoto} 
                  alt="Celestial Couple" 
                  className="w-full h-full object-cover opacity-80"
                  isHero={false}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-sky-300/60 bg-sky-950/20">
                  <Orbit className="w-12 h-12 mb-2 opacity-50 animate-spin-slow" />
                  <span className="text-[10px] tracking-wider uppercase">ORBITING IMAGES</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------- SCENE 5: PLANET HORIZON RSVP ----------------- */}
        {(prefersReducedMotion || (progress >= 0.85 && progress <= 1)) && (
          <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20 overflow-y-auto">
            {/* Glowing horizon planet curve representation */}
            <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[150%] aspect-square rounded-full bg-gradient-to-t from-sky-950 via-sky-900/20 to-transparent border-t border-sky-400/40 opacity-45 pointer-events-none z-0" />

            <div className="w-full max-w-md mx-auto pt-10 pb-6 relative z-10 bg-slate-950/45 border border-sky-500/10 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
              <span className="text-[10px] font-mono tracking-[0.25em] text-sky-400 block mb-4 uppercase font-bold flex items-center justify-center gap-2">
                <Clock className="w-4 h-4" /> T-MINUS TO LAUNCH
              </span>

              {wedding.wedding_date && (
                <div className="mb-6 scale-90">
                  <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#38bdf8" styleType="elegant" />
                </div>
              )}

              <div className="w-full space-y-6 pt-4 border-t border-dashed border-sky-500/20">
                {showRsvp && (
                  <div className="w-full [&>button]:w-full [&>button]:h-14 [&>button]:bg-sky-500 [&>button]:text-sky-950 [&>button]:uppercase [&>button]:tracking-widest [&>button]:text-xs [&>button]:font-black [&>button]:hover:bg-sky-400 [&>button]:transition-all [&>button]:duration-300 [&>button]:rounded-full [&>button]:shadow-[0_0_20px_rgba(56,189,248,0.4)]">
                    {renderRsvpButton()}
                  </div>
                )}
                
                <div className="w-full">
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
