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

export default function ApolloSunTempleLayout({
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
  cardBgColor = '#fdfbf7',
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

  // Shadow shift distance based on solar alignment (Signature Moment)
  const shadowOffset = prefersReducedMotion ? 0 : (0.5 - progress) * 80;
  const shadowBlur = prefersReducedMotion ? 6 : Math.abs(0.5 - progress) * 15 + 4;
  const isAligned = prefersReducedMotion || Math.abs(progress - 0.5) < 0.1;

  return (
    <div 
      ref={containerRef}
      className="w-full relative overflow-x-hidden font-serif bg-[#fdfbf7] text-[#5c4033]"
      style={{ height: prefersReducedMotion ? 'auto' : '350vh' }}
      data-testid="layout-apollo-sun-temple"
    >
      {/* Apollo Sun Temple Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#fefcfa] via-[#fffbeb] to-[#faf5e6]" />
        
        {/* Moving Sun Disc (Signature Moment) */}
        {!prefersReducedMotion && (
          <div 
            className="absolute top-16 w-32 h-32 rounded-full bg-amber-100/90 shadow-[0_0_60px_rgba(251,191,36,0.6)] border border-amber-300 transition-all duration-100 ease-out"
            style={{
              left: `${15 + progress * 70}%`,
              opacity: 0.85
            }}
          />
        )}

        {/* Temple Columns Casting Shadows */}
        <div className="absolute inset-y-0 left-0 w-full flex justify-between px-16 pointer-events-none z-10">
          {[...Array(3)].map((_, i) => (
            <div 
              key={i} 
              className="w-8 h-full bg-[#f5efe0] border-x border-[#5c4033]/5 transition-all duration-100 ease-out"
              style={{
                boxShadow: `${shadowOffset}px 0px ${shadowBlur}px rgba(92,64,51,${0.15 + Math.abs(0.5 - progress) * 0.1})`
              }}
            />
          ))}
        </div>
      </div>

      {/* Viewport content */}
      <div className={prefersReducedMotion ? 'relative w-full flex flex-col' : 'sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-between z-10'}>

        {/* ----------------- SCENE 1: TEMPLE COVER ----------------- */}
        {(prefersReducedMotion || (progress >= 0 && progress < 0.22)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-[#5c4033]/10 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center animate-fade-in z-20"}>
            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
              <span className="text-[10px] tracking-[0.45em] text-[#d97706] font-bold uppercase mb-6">{eventTitle}</span>
              
              <div className="p-8 bg-white/80 backdrop-blur-md rounded-none border border-[#d97706]/35 shadow-xl max-w-md">
                <h1 className="text-4xl sm:text-5xl font-light uppercase tracking-widest text-[#78350f]" style={{ fontFamily: `"${headingFont}", serif` }}>
                  {wedding.bride_name} <br/>
                  <span className="text-lg opacity-40 font-light block my-3">&</span>
                  {wedding.groom_name}
                </h1>
              </div>
              
              <div className="h-px w-20 bg-[#d97706]/30 my-8" />
              <p className="text-xs uppercase tracking-[0.3em] text-[#78350f] font-mono">SCROLL TO ALIGN THE SOLAR SHADOWS</p>
            </div>
          </div>
        )}

        {/* ----------------- SCENE 2: POETRY ----------------- */}
        {(prefersReducedMotion || (progress >= 0.22 && progress < 0.42)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-[#5c4033]/10 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <div className="text-xl sm:text-3xl font-light leading-relaxed max-w-xl font-serif px-6 italic text-[#78350f] bg-white/60 backdrop-blur-md p-8 border border-[#d97706]/10 shadow-md">
              "{renderQuote()}"
            </div>
          </div>
        )}

        {/* ----------------- SCENE 3: SUN TEMPLE DETAILS ----------------- */}
        {(prefersReducedMotion || (progress >= 0.42 && progress < 0.65)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-[#5c4033]/10 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.35em] text-[#d97706] font-bold uppercase mb-8">SOLAR TEMPLE COORDINATES</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl text-sm font-semibold mb-8 font-mono">
              <div className="flex flex-col gap-2 p-6 bg-white/80 border border-[#d97706]/10 shadow-sm">
                <Calendar className="w-5 h-5 mx-auto text-[#d97706] mb-2" />
                <span className="text-[#78350f] text-lg">{dateStr}</span>
                <span className="text-[#d97706]">{timeStr}</span>
              </div>

              <div id="apollo-coordinates-plaque" className="flex flex-col gap-2 p-6 bg-white/80 border border-[#d97706]/10 shadow-sm">
                <MapPin className="w-5 h-5 mx-auto text-[#d97706] mb-2" />
                <span className="text-[#78350f] text-lg">{wedding.venue_name || 'Sun Temple'}</span>
                {wedding.venue_address && (
                  <span className="text-slate-600 leading-normal text-xs">{wedding.venue_address}</span>
                )}
                <span className="text-[10px] text-slate-500 mt-1 font-mono tracking-widest uppercase">Solar Zenith: 37.98° N, 23.72° E</span>
              </div>
            </div>

            {hasMaps && (
              <button 
                onClick={handleMapClick}
                className="px-6 h-12 border border-[#d97706]/40 bg-white/80 text-[#d97706] hover:bg-[#d97706] hover:text-white rounded-none font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>TEMPLE DIRECTORY</span>
              </button>
            )}
          </div>
        )}

        {/* ----------------- SCENE 4: GALLERY SCREEN ----------------- */}
        {(prefersReducedMotion || (progress >= 0.65 && progress < 0.85)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-[#5c4033]/10 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.3em] text-[#d97706] font-bold uppercase mb-8">SUN-DISC SNAPSHOT</span>
            
            <div className="relative w-full max-w-sm aspect-[4/3] mx-auto overflow-hidden border-8 border-white shadow-2xl bg-white rounded-none">
              {couplePhoto ? (
                <SafeImage 
                  src={couplePhoto} 
                  alt="Apollo Couple" 
                  className="w-full h-full object-cover"
                  isHero={false}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-[#d97706]/40 bg-[#fdfbf7]">
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
            <div id="apollo-sun-rsvp" className="w-full max-w-md mx-auto pt-10 pb-6 relative z-10 bg-white/95 border border-[#d97706]/20 p-6 shadow-2xl backdrop-blur-md">
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#d97706] block mb-4 uppercase font-bold flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 text-[#d97706]" /> T-MINUS TO SUNLIGHT ALIGNMENT
              </span>

              {wedding.wedding_date && (
                <div className="mb-6 scale-90">
                  <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#d97706" styleType="elegant" />
                </div>
              )}

              <div className="w-full space-y-6 pt-4 border-t border-dashed border-[#d97706]/20">
                {showRsvp && (
                  <div className="w-full [&>button]:w-full [&>button]:h-14 [&>button]:bg-[#d97706] [&>button]:text-white [&>button]:uppercase [&>button]:tracking-widest [&>button]:text-xs [&>button]:font-black [&>button]:hover:bg-amber-700 [&>button]:transition-all [&>button]:duration-300 [&>button]:rounded-none">
                    {renderRsvpButton()}
                  </div>
                )}
                
                <div className="w-full text-slate-800 font-sans">
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
