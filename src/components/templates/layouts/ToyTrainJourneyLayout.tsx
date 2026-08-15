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

export default function ToyTrainJourneyLayout({
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
  cardBgColor = '#fdf4e3',
  selectedBackground,
  cardSurfaceStyle
}: LayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { progress } = useSceneProgress(containerRef, 5);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      mediaQuery.removeEventListener('change', listener);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const couplePhoto = wedding.bride_photo_url || wedding.groom_photo_url || wedding.background_image_url || '';
  const showRsvp = wedding.show_rsvp !== false;
  const hasMaps = !!wedding.google_maps_url;

  // Train offset and rail carriage scrolling (Signature Moment)
  // On desktop, we translate the train horizontally; on mobile, it remains static or vertical
  const trainTranslateX = prefersReducedMotion || isMobile ? 0 : progress * 80; // in %

  return (
    <div 
      ref={containerRef}
      className="w-full relative overflow-x-hidden font-mono bg-[#fdf4e3] text-[#78350f]"
      style={{ height: prefersReducedMotion || isMobile ? 'auto' : '350vh' }}
      data-testid="layout-toy-train"
    >
      {/* Railway Track Background */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-end pb-32">
        <div className="absolute inset-0 bg-gradient-to-b from-[#fdf6e2] via-[#fcf0d3] to-[#fadfa6]" />
        
        {/* Railway line */}
        <div className="w-full h-4 bg-stone-700/25 relative">
          {/* Sleepers */}
          <div className="absolute inset-x-0 -top-2 h-8 bg-repeat-x opacity-40"
               style={{
                 backgroundImage: 'linear-gradient(90deg, #57534e 6px, transparent 6px)',
                 backgroundSize: '24px 100%'
               }} 
          />
        </div>

        {/* Rolling Toy Train SVG (Signature Moment) */}
        {!isMobile && (
          <div 
            className="absolute bottom-[114px] w-24 h-16 transition-all duration-100 ease-out z-10"
            style={{
              left: `${trainTranslateX}%`
            }}
          >
            <svg className="w-full h-full text-red-600" viewBox="0 0 100 100" fill="currentColor">
              {/* Locomotive */}
              <rect x="20" y="40" width="60" height="30" rx="3" />
              <rect x="55" y="20" width="20" height="25" />
              {/* Chimney */}
              <rect x="25" y="25" width="8" height="15" />
              {/* Wheels */}
              <circle cx="35" cy="75" r="10" className="fill-stone-800" />
              <circle cx="65" cy="75" r="10" className="fill-stone-800" />
              {/* Windows */}
              <rect x="60" y="25" width="10" height="12" fill="#fff" opacity="0.8" />
            </svg>
          </div>
        )}
      </div>

      {/* Viewport content */}
      <div className={prefersReducedMotion || isMobile ? 'relative w-full flex flex-col' : 'sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-between z-10'}>

        {/* ----------------- STATION 1: WELCOME WAGON ----------------- */}
        {(prefersReducedMotion || isMobile || (progress >= 0 && progress < 0.22)) && (
          <div className={prefersReducedMotion || isMobile ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-[#fadfa6] py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center animate-fade-in z-20"}>
            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
              <span className="text-[10px] tracking-[0.45em] text-[#d97706] font-bold uppercase mb-6">{eventTitle}</span>
              
              <div className="p-8 bg-[#fffbeb] rounded-3xl border-4 border-dashed border-[#d97706] shadow-xl max-w-md">
                <h1 className="text-4xl sm:text-5xl font-bold uppercase tracking-widest text-[#78350f]" style={{ fontFamily: `"${headingFont}", serif` }}>
                  {wedding.bride_name} <br/>
                  <span className="text-lg opacity-60 block my-3">&</span>
                  {wedding.groom_name}
                </h1>
              </div>
              
              <div className="h-px w-20 bg-[#d97706]/50 my-8" />
              <p className="text-xs uppercase tracking-[0.3em] text-[#d97706] font-mono">SCROLL TO ROLL THE WAGON</p>
            </div>
          </div>
        )}

        {/* ----------------- STATION 2: capítulo del tren ----------------- */}
        {(prefersReducedMotion || isMobile || (progress >= 0.22 && progress < 0.42)) && (
          <div className={prefersReducedMotion || isMobile ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-[#fadfa6] py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <div className="text-lg sm:text-2xl font-bold leading-relaxed max-w-xl px-6 italic text-[#78350f] bg-[#fffbeb]/90 p-8 rounded-3xl border-2 border-[#d97706]">
              "{renderQuote()}"
            </div>
          </div>
        )}

        {/* ----------------- STATION 3: STATION DEPARTURE ----------------- */}
        {(prefersReducedMotion || isMobile || (progress >= 0.42 && progress < 0.65)) && (
          <div className={prefersReducedMotion || isMobile ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-[#fadfa6] py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.35em] text-[#d97706] font-bold uppercase mb-8">STATION TIMETABLE</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl text-sm font-bold mb-8">
              <div className="flex flex-col gap-2 p-6 bg-[#fffbeb] border-2 border-[#d97706] rounded-2xl shadow-sm">
                <Clock className="w-5 h-5 mx-auto text-[#d97706] mb-2" />
                <span className="text-[#78350f] text-lg">{dateStr}</span>
                <span className="text-[#d97706]">{timeStr}</span>
              </div>

              <div id="train-coordinates-plaque" className="flex flex-col gap-2 p-6 bg-[#fffbeb] border-2 border-[#d97706] rounded-2xl shadow-sm">
                <MapPin className="w-5 h-5 mx-auto text-[#d97706] mb-2" />
                <span className="text-[#78350f] text-lg">{wedding.venue_name || 'Railway Station'}</span>
                {wedding.venue_address && (
                  <span className="text-slate-600 leading-normal text-xs">{wedding.venue_address}</span>
                )}
                <span className="text-[10px] text-[#d97706] mt-1 font-mono tracking-widest uppercase">Platform: 9 / North Station</span>
              </div>
            </div>

            {hasMaps && (
              <button 
                onClick={handleMapClick}
                className="px-6 h-12 border-2 border-[#d97706] bg-[#fffbeb] text-[#78350f] hover:bg-[#78350f] hover:text-white rounded-2xl font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>STATION LOCATOR</span>
              </button>
            )}
          </div>
        )}

        {/* ----------------- STATION 4: PORTRAIT CARRIAGE ----------------- */}
        {(prefersReducedMotion || isMobile || (progress >= 0.65 && progress < 0.85)) && (
          <div className={prefersReducedMotion || isMobile ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-[#fadfa6] py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.3em] text-[#d97706] font-bold uppercase mb-8">PORTRAIT WAGON</span>
            
            <div className="relative w-full max-w-sm aspect-[4/3] mx-auto overflow-hidden border-4 border-[#d97706] shadow-2xl bg-[#fffbeb] p-2 rounded-[2.5rem]">
              {couplePhoto ? (
                <SafeImage 
                  src={couplePhoto} 
                  alt="Train Journey" 
                  className="w-full h-full object-cover rounded-2xl"
                  isHero={false}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-[#d97706] bg-[#fdf4e3]">
                  <Heart className="w-12 h-12 mb-2 opacity-35" />
                  <span className="text-[10px] tracking-wider uppercase opacity-55">PORTRAIT</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------- STATION 5: TERMINUS & RSVP ----------------- */}
        {(prefersReducedMotion || isMobile || (progress >= 0.85 && progress <= 1)) && (
          <div className={prefersReducedMotion || isMobile ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20 overflow-y-auto"}>
            <div id="train-rsvp" className="w-full max-w-md mx-auto pt-10 pb-6 relative z-10 bg-[#fffbeb]/95 border-4 border-[#d97706] p-6 shadow-2xl backdrop-blur-md rounded-[2.5rem]">
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#d97706] block mb-4 uppercase font-bold flex items-center justify-center gap-2">
                🚂 T-MINUS TO ARRIVAL
              </span>

              {wedding.wedding_date && (
                <div className="mb-6 scale-90">
                  <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#78350f" styleType="elegant" />
                </div>
              )}

              <div className="w-full space-y-6 pt-4 border-t border-dashed border-[#d97706]">
                {showRsvp && (
                  <div className="w-full [&>button]:w-full [&>button]:h-14 [&>button]:bg-[#78350f] [&>button]:text-[#fdf4e3] [&>button]:uppercase [&>button]:tracking-widest [&>button]:text-xs [&>button]:font-black [&>button]:hover:bg-[#d97706] [&>button]:transition-all [&>button]:duration-300 [&>button]:rounded-2xl">
                    {renderRsvpButton()}
                  </div>
                )}
                
                <div className="w-full text-[#78350f]">
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
