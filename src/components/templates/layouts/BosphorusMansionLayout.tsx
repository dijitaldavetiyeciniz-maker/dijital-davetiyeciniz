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

export default function BosphorusMansionLayout({
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
  cardBgColor = '#0b1329',
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
  const events = wedding.invitation_events || [];

  return (
    <div 
      ref={containerRef}
      className="w-full relative overflow-x-hidden font-serif bg-[#0b1329] text-[#f8fafc]"
      style={{ height: prefersReducedMotion ? 'auto' : '350vh' }}
      data-testid="layout-bosphorus-mansion"
    >
      {/* Symmetrical Waterfront Mansion Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Sky / Sea gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1e293b] via-[#0f172a] to-[#020617]" />
        
        {/* Bosphorus bridge light vector outline */}
        <div className="absolute bottom-24 inset-x-0 h-32 opacity-20 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-sky-400/40 via-transparent to-transparent pointer-events-none" />
        
        {/* Waterfront sea ripples */}
        {!prefersReducedMotion && (
          <div 
            className="absolute inset-0 opacity-10 transition-transform duration-100 ease-out"
            style={{
              backgroundImage: 'radial-gradient(2px 2px at 40px 60px, #38bdf8, rgba(0,0,0,0)), radial-gradient(3px 3px at 120px 220px, #fbbf24, rgba(0,0,0,0))',
              backgroundSize: '240px 240px',
              transform: `translateY(-${progress * 60}px)`
            }}
          />
        )}
      </div>

      {/* Sticky viewport container */}
      <div className={prefersReducedMotion ? 'relative w-full flex flex-col' : 'sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-between z-10'}>

        {/* ----------------- SCENE 1: MANSION FACADE & DOORS ----------------- */}
        {(prefersReducedMotion || (progress >= 0 && progress < 0.22)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-sky-950/20 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center animate-fade-in z-20"}>
            
            {/* Sliding Symmetrical Mansion Glass Doors (Signature Moment) */}
            {!prefersReducedMotion && (
              <div className="absolute inset-0 flex pointer-events-none z-10">
                {/* Left Door */}
                <div 
                  className="w-1/2 h-full bg-[#1c1917] border-r-4 border-[#d4af37]/60 flex items-center justify-end pr-8 transition-transform duration-100 ease-out shadow-[10px_0_30px_rgba(0,0,0,0.5)]"
                  style={{ transform: `translateX(-${progress * 450}%)` }}
                >
                  {/* Decorative Ottoman Woodwork Patterns */}
                  <div className="w-12 h-64 border border-[#d4af37]/20 rounded-md opacity-30" />
                </div>
                {/* Right Door */}
                <div 
                  className="w-1/2 h-full bg-[#1c1917] border-l-4 border-[#d4af37]/60 flex items-center justify-start pl-8 transition-transform duration-100 ease-out shadow-[-10px_0_30px_rgba(0,0,0,0.5)]"
                  style={{ transform: `translateX(${progress * 450}%)` }}
                >
                  <div className="w-12 h-64 border border-[#d4af37]/20 rounded-md opacity-30" />
                </div>
              </div>
            )}

            <div className="relative z-20 max-w-xl mx-auto flex flex-col items-center">
              <span className="text-[10px] tracking-[0.45em] text-[#d4af37] font-bold uppercase mb-6">{eventTitle}</span>
              <h1 className="text-4xl sm:text-6xl font-light tracking-widest text-[#f8fafc] uppercase leading-tight" style={{ fontFamily: `"${headingFont}", serif` }}>
                {wedding.bride_name} <br/>
                <span className="text-xl font-serif italic text-[#d4af37] block my-4">+</span>
                {wedding.groom_name}
              </h1>
              <div className="h-px w-20 bg-[#d4af37]/40 my-8" />
              <p className="text-xs uppercase tracking-[0.3em] text-[#f8fafc]/60 font-mono">SCROLL TO ENTER THE WATERFRONT MANSION</p>
            </div>
          </div>
        )}

        {/* ----------------- SCENE 2: THE QUOTE / WELCOME ----------------- */}
        {(prefersReducedMotion || (progress >= 0.22 && progress < 0.42)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-sky-950/20 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <div className="text-xl sm:text-3xl italic text-[#f8fafc]/90 leading-relaxed max-w-2xl px-6 font-serif border-y border-[#d4af37]/20 py-8">
              "{renderQuote()}"
            </div>
          </div>
        )}

        {/* ----------------- SCENE 3: EVENT DETAILS & PROGRAM ----------------- */}
        {(prefersReducedMotion || (progress >= 0.42 && progress < 0.65)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-sky-950/20 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.35em] text-[#d4af37] font-bold uppercase mb-8">MANSION INVITATION DETAILS</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl text-sm font-semibold mb-8 font-mono">
              <div className="flex flex-col gap-2 p-6 rounded-2xl border border-[#d4af37]/20 bg-[#0f172a]/80 backdrop-blur-md">
                <Calendar className="w-5 h-5 mx-auto text-[#d4af37] mb-2" />
                <span className="text-white text-lg">{dateStr}</span>
                <span className="text-sky-300">{timeStr}</span>
              </div>

              <div id="mansion-location-plaque" className="flex flex-col gap-2 p-6 rounded-2xl border border-[#d4af37]/20 bg-[#0f172a]/80 backdrop-blur-md">
                <MapPin className="w-5 h-5 mx-auto text-[#d4af37] mb-2" />
                <span className="text-white text-lg">{wedding.venue_name || 'Waterfront Mansion'}</span>
                {wedding.venue_address && (
                  <span className="text-sky-300/80 leading-normal text-xs">{wedding.venue_address}</span>
                )}
              </div>
            </div>

            {hasMaps && (
              <button 
                onClick={handleMapClick}
                className="px-6 h-12 border border-[#d4af37]/40 bg-[#0f172a]/40 text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0b1329] rounded-none font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>MAPS DIRECTION</span>
              </button>
            )}
          </div>
        )}

        {/* ----------------- SCENE 4: FLOATING MANSION FRAME PHOTO ----------------- */}
        {(prefersReducedMotion || (progress >= 0.65 && progress < 0.85)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-sky-950/20 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.3em] text-[#d4af37] font-bold uppercase mb-8">MANSION HALLWAY PORTRAIT</span>
            
            <div className="relative w-full max-w-sm aspect-[4/3] mx-auto rounded-none overflow-hidden border-8 border-[#1c1917] shadow-2xl bg-neutral-950">
              {couplePhoto ? (
                <SafeImage 
                  src={couplePhoto} 
                  alt="Mansion Couple" 
                  className="w-full h-full object-cover"
                  isHero={false}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-[#d4af37]/60 bg-[#0b1329]/40">
                  <Heart className="w-12 h-12 mb-2 opacity-50 animate-pulse" />
                  <span className="text-[10px] tracking-wider uppercase">PORTRAIT IMAGE</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------- SCENE 5: RSVP STUB & MULTI-EVENT ----------------- */}
        {(prefersReducedMotion || (progress >= 0.85 && progress <= 1)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20 overflow-y-auto"}>
            <div className="w-full max-w-md mx-auto pt-10 pb-6 relative z-10 bg-[#0f172a]/90 border border-[#d4af37]/20 rounded-none p-6 shadow-2xl backdrop-blur-md">
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#d4af37] block mb-4 uppercase font-bold flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 text-[#d4af37]" /> MANSION RECEPTION COUNTDOWN
              </span>

              {wedding.wedding_date && (
                <div className="mb-6 scale-90">
                  <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#d4af37" styleType="elegant" />
                </div>
              )}

              {/* Rendering Multiple Events inside the layout for verification */}
              {events.length > 0 && (
                <div className="w-full border-t border-[#d4af37]/20 pt-4 mb-6 text-left space-y-4">
                  <span className="text-[10px] tracking-widest text-[#d4af37] font-bold uppercase block mb-2">Mansion Program Events</span>
                  {events.map((evt: any) => (
                    <div key={evt.id} className="border-l border-[#d4af37]/40 pl-3">
                      <h4 className="text-xs font-bold uppercase text-white">{evt.title}</h4>
                      <p className="text-[10px] text-sky-300 font-mono mt-1">
                        {new Date(evt.start_time).toLocaleDateString('tr-TR')} - {new Date(evt.start_time).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {evt.venue_name && <p className="text-[10px] text-slate-400 mt-0.5">{evt.venue_name}</p>}
                    </div>
                  ))}
                </div>
              )}

              <div className="w-full space-y-6 pt-4 border-t border-dashed border-[#d4af37]/20">
                {showRsvp && (
                  <div className="w-full [&>button]:w-full [&>button]:h-14 [&>button]:bg-[#d4af37] [&>button]:text-[#0b1329] [&>button]:uppercase [&>button]:tracking-widest [&>button]:text-xs [&>button]:font-black [&>button]:hover:bg-amber-400 [&>button]:transition-all [&>button]:duration-300 [&>button]:rounded-none">
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
