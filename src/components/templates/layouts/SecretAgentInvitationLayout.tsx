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

export default function SecretAgentInvitationLayout({
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
  cardBgColor = '#f5ebd0',
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

  // Redacted overlay scale (Signature Moment)
  // Decrypts (scales out) on scroll
  const redactionOpacity = prefersReducedMotion ? 0 : Math.max(0, 1 - progress * 1.8);
  const stampOpacity = prefersReducedMotion ? 0.95 : Math.min(0.95, progress * 1.5);

  return (
    <div 
      ref={containerRef}
      className="w-full relative overflow-x-hidden font-mono bg-[#f4ebd0] text-[#3d3a35] border-t-8 border-[#a94442]"
      style={{ height: prefersReducedMotion ? 'auto' : '350vh' }}
      data-testid="layout-secret-agent"
    >
      {/* Classified Folder Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div className="absolute inset-0 bg-[#ebe0c5]" />
        
        {/* TOP SECRET red rubber stamp (Signature Moment) */}
        <div 
          className="absolute border-4 border-dashed border-[#a94442] text-[#a94442] font-black uppercase text-xl px-6 py-2 rotate-[-12deg] z-5 transition-opacity duration-300"
          style={{
            opacity: stampOpacity
          }}
        >
          TOP SECRET // CLASSIFIED
        </div>
      </div>

      {/* Viewport content */}
      <div className={prefersReducedMotion ? 'relative w-full flex flex-col' : 'sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-between z-10'}>

        {/* ----------------- SCENE 1: DOSSIER HEADER ----------------- */}
        {(prefersReducedMotion || (progress >= 0 && progress < 0.22)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-[#decfa8] py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center animate-fade-in z-20"}>
            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
              <span className="text-[10px] tracking-[0.45em] text-[#a94442] font-bold uppercase mb-6">{eventTitle}</span>
              
              <div className="p-8 bg-[#f2e3c6]/95 border-2 border-[#3d3a35] shadow-xl max-w-md">
                <h1 className="text-4xl sm:text-5xl font-bold uppercase tracking-widest text-[#5c554a]" style={{ fontFamily: `"${headingFont}", serif` }}>
                  {wedding.bride_name} <br/>
                  <span className="text-lg opacity-60 block my-3">&amp;</span>
                  {wedding.groom_name}
                </h1>
              </div>
              
              <div className="h-px w-20 bg-[#3d3a35]/50 my-8" />
              <p className="text-xs uppercase tracking-[0.3em] text-[#a94442] font-mono">SCROLL TO DECRYPT REDACTED DATA</p>
            </div>
          </div>
        )}

        {/* ----------------- SCENE 2: POETRY BRIEFING ----------------- */}
        {(prefersReducedMotion || (progress >= 0.22 && progress < 0.42)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-[#decfa8] py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <div className="text-lg sm:text-2xl font-semibold leading-relaxed max-w-xl px-6 italic text-[#5c554a] bg-[#f2e3c6]/90 p-8 border-2 border-[#3d3a35] relative">
              {/* Redacted bar (Signature Moment) */}
              <div 
                className="absolute inset-x-8 inset-y-12 bg-[#2c2620] z-10 transition-opacity duration-300"
                style={{
                  opacity: redactionOpacity
                }}
              />
              "{renderQuote()}"
            </div>
          </div>
        )}

        {/* ----------------- SCENE 3: MISSION COORDINATES ----------------- */}
        {(prefersReducedMotion || (progress >= 0.42 && progress < 0.65)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-[#decfa8] py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.35em] text-[#a94442] font-bold uppercase mb-8">MISSION COORDINATES & CODES</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl text-sm font-bold mb-8">
              <div className="flex flex-col gap-2 p-6 bg-[#f2e3c6] border border-[#3d3a35] shadow-sm">
                <Clock className="w-5 h-5 mx-auto text-[#a94442] mb-2" />
                <span className="text-[#5c554a] text-lg">{dateStr}</span>
                <span className="text-[#a94442]">{timeStr}</span>
              </div>

              <div id="agent-coordinates-plaque" className="flex flex-col gap-2 p-6 bg-[#f2e3c6] border border-[#3d3a35] shadow-sm">
                <MapPin className="w-5 h-5 mx-auto text-[#a94442] mb-2" />
                <span className="text-[#5c554a] text-lg">{wedding.venue_name || 'Briefing Room'}</span>
                {wedding.venue_address && (
                  <span className="text-[#8d7c62] leading-normal text-xs">{wedding.venue_address}</span>
                )}
                <span className="text-[9px] text-[#a94442] mt-1 font-mono tracking-widest uppercase">Target Coordinates: 41° N, 28° E</span>
              </div>
            </div>

            {hasMaps && (
              <button 
                onClick={handleMapClick}
                className="px-6 h-12 border border-[#3d3a35] bg-[#f2e3c6] text-[#5c554a] hover:bg-[#5c554a] hover:text-[#f4ebd0] font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>EXHIBIT TARGET</span>
              </button>
            )}
          </div>
        )}

        {/* ----------------- SCENE 4: GALLERY SCREEN ----------------- */}
        {(prefersReducedMotion || (progress >= 0.65 && progress < 0.85)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-[#decfa8] py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.3em] text-[#a94442] font-bold uppercase mb-8">TELEMETRY ALBUM</span>
            
            <div className="relative w-full max-w-sm aspect-[4/3] mx-auto overflow-hidden border-4 border-[#3d3a35] shadow-2xl bg-[#f2e3c6] p-2">
              {couplePhoto ? (
                <SafeImage 
                  src={couplePhoto} 
                  alt="Secret Agent" 
                  className="w-full h-full object-cover grayscale opacity-90 contrast-125"
                  isHero={false}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-[#8d7c62] bg-[#f4ebd0]">
                  <Heart className="w-12 h-12 mb-2 opacity-35" />
                  <span className="text-[10px] tracking-wider uppercase opacity-55">PORTRAIT</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------- SCENE 5: RSVP GUESTBOOK ----------------- */}
        {(prefersReducedMotion || (progress >= 0.85 && progress <= 1)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20 overflow-y-auto"}>
            <div id="agent-rsvp" className="w-full max-w-md mx-auto pt-10 pb-6 relative z-10 bg-[#f2e3c6]/95 border-4 border-[#3d3a35] p-6 shadow-2xl backdrop-blur-md">
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#a94442] block mb-4 uppercase font-bold flex items-center justify-center gap-2">
                🔒 T-MINUS TO MISSION START
              </span>

              {wedding.wedding_date && (
                <div className="mb-6 scale-90">
                  <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#3d3a35" styleType="elegant" />
                </div>
              )}

              <div className="w-full space-y-6 pt-4 border-t border-dashed border-[#3d3a35]">
                {showRsvp && (
                  <div className="w-full [&>button]:w-full [&>button]:h-14 [&>button]:bg-[#a94442] [&>button]:text-white [&>button]:uppercase [&>button]:tracking-widest [&>button]:text-xs [&>button]:font-black [&>button]:hover:bg-red-800 [&>button]:transition-all [&>button]:duration-300 [&>button]:rounded-none">
                    {renderRsvpButton()}
                  </div>
                )}
                
                <div className="w-full text-[#3d3a35]">
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
