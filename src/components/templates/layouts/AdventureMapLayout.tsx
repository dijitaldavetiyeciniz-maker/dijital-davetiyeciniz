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

export default function AdventureMapLayout({
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
  cardBgColor = '#f5ebe0',
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

  // Hike trail animation drawing (Signature Moment)
  const trailDashOffset = prefersReducedMotion ? 0 : 500 - progress * 500;
  const hikerX = prefersReducedMotion ? 80 : 15 + progress * 65;
  const hikerY = prefersReducedMotion ? 70 : 40 - Math.sin(progress * Math.PI) * 20 + progress * 30;

  return (
    <div 
      ref={containerRef}
      className="w-full relative overflow-x-hidden font-mono bg-[#f5f2eb] text-[#5c5346]"
      style={{ height: prefersReducedMotion ? 'auto' : '350vh' }}
      data-testid="layout-adventure-map"
    >
      {/* Topographic Contour Map Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div className="absolute inset-0 bg-[#f3efe3]" />
        
        {/* Topographic line contours */}
        <svg className="absolute inset-0 w-full h-full text-[#e6decb] opacity-75" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
          <path d="M -10,30 Q 30,10 50,40 T 110,20 M -10,40 Q 30,20 50,50 T 110,30 M -10,50 Q 30,30 50,60 T 110,40" />
          {/* Mountain Peak silhouettes */}
          <polygon points="10,95 25,60 40,95" />
          <polygon points="35,95 55,50 75,95" />
          <polygon points="65,95 80,65 95,95" />
        </svg>

        {/* Trail path and Hiker marker (Signature Moment) */}
        <svg className="absolute w-[85%] h-[75%] max-w-xl text-[#8d7e68]" viewBox="0 0 100 100">
          <path 
            id="hike-path"
            d="M 15,40 Q 50,20 50,60 T 80,70" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeDasharray="4 4"
            style={{
              strokeDashoffset: trailDashOffset
            }}
          />
          {/* Checkpoint flags */}
          <circle cx="50" cy="60" r="2.5" className="fill-[#b8860b] stroke-currentColor stroke-1" />
          <text x="46" y="66" fontSize="2.5" fill="currentColor">Basecamp</text>
          
          <polygon points="78,70 82,65 82,75" fill="#a94442" />
          <text x="75" y="78" fontSize="2.5" fill="currentColor">Summit RSVP</text>

          {/* Compass Rose icon */}
          <circle cx="85" cy="20" r="6" stroke="currentColor" strokeWidth="0.5" fill="none" />
          <line x1="85" y1="12" x2="85" y2="28" stroke="currentColor" strokeWidth="0.5" />
          <line x1="77" y1="20" x2="93" y2="20" stroke="currentColor" strokeWidth="0.5" />

          {/* Miniature Hiker SVG (scales on scroll) */}
          <g transform={`translate(${hikerX - 2.5}, ${hikerY - 5}) scale(0.06)`} fill="currentColor">
            <circle cx="50" cy="20" r="10" />
            <path d="M 40,32 L 60,32 L 55,60 L 45,60 Z" />
            <line x1="42" y1="60" x2="42" y2="85" stroke="currentColor" strokeWidth="6" />
            <line x1="58" y1="60" x2="58" y2="85" stroke="currentColor" strokeWidth="6" />
          </g>
        </svg>
      </div>

      {/* Viewport content */}
      <div className={prefersReducedMotion ? 'relative w-full flex flex-col' : 'sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-between z-10'}>

        {/* ----------------- SCENE 1: COVER ----------------- */}
        {(prefersReducedMotion || (progress >= 0 && progress < 0.22)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-[#fadfa6]/30 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center animate-fade-in z-20"}>
            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
              <span className="text-[10px] tracking-[0.45em] text-[#8d7e68] font-bold uppercase mb-6">{eventTitle}</span>
              
              <div className="p-8 bg-[#f3efe3]/95 border-4 border-[#8d7e68] shadow-xl max-w-md">
                <h1 className="text-4xl sm:text-5xl font-bold uppercase tracking-widest text-[#5c5346]" style={{ fontFamily: `"${headingFont}", serif` }}>
                  {wedding.bride_name} <br/>
                  <span className="text-lg opacity-60 block my-3">&</span>
                  {wedding.groom_name}
                </h1>
              </div>
              
              <div className="h-px w-20 bg-[#8d7e68]/50 my-8" />
              <p className="text-xs uppercase tracking-[0.3em] text-[#8d7e68] font-mono">SCROLL TO TRACE THE RIDGE TRAIL</p>
            </div>
          </div>
        )}

        {/* ----------------- SCENE 2: POETRY ----------------- */}
        {(prefersReducedMotion || (progress >= 0.22 && progress < 0.42)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-[#fadfa6]/30 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <div className="text-lg sm:text-2xl font-semibold leading-relaxed max-w-xl px-6 italic text-[#5c5346] bg-[#f3efe3]/90 p-8 border-2 border-[#8d7e68]">
              "{renderQuote()}"
            </div>
          </div>
        )}

        {/* ----------------- SCENE 3: CAMPSITE COORDINATES ----------------- */}
        {(prefersReducedMotion || (progress >= 0.42 && progress < 0.65)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-[#fadfa6]/30 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.35em] text-[#8d7e68] font-bold uppercase mb-8">CAMPSITE DETAILS</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl text-sm font-bold mb-8">
              <div className="flex flex-col gap-2 p-6 bg-[#f3efe3]/95 border-2 border-[#8d7e68] shadow-sm">
                <Clock className="w-5 h-5 mx-auto text-[#8d7e68] mb-2" />
                <span className="text-[#5c5346] text-lg">{dateStr}</span>
                <span className="text-[#8d7e68]">{timeStr}</span>
              </div>

              <div id="adventure-coordinates-plaque" className="flex flex-col gap-2 p-6 bg-[#f3efe3]/95 border-2 border-[#8d7e68] shadow-sm">
                <MapPin className="w-5 h-5 mx-auto text-[#8d7e68] mb-2" />
                <span className="text-[#5c5346] text-lg">{wedding.venue_name || 'Adventure Camp'}</span>
                {wedding.venue_address && (
                  <span className="text-[#8d7e68] leading-normal text-xs">{wedding.venue_address}</span>
                )}
                <span className="text-[10px] text-[#8d7e68] mt-1 font-mono tracking-widest uppercase">Grid: Ridge Line / Basecamp 3</span>
              </div>
            </div>

            {hasMaps && (
              <button 
                onClick={handleMapClick}
                className="px-6 h-12 border-2 border-[#8d7e68] bg-[#f3efe3]/80 text-[#5c5346] hover:bg-[#5c5346] hover:text-[#f5f2eb] font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>EXPEDITION COMPASS</span>
              </button>
            )}
          </div>
        )}

        {/* ----------------- SCENE 4: GALLERY SCREEN ----------------- */}
        {(prefersReducedMotion || (progress >= 0.65 && progress < 0.85)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-[#fadfa6]/30 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.3em] text-[#8d7e68] font-bold uppercase mb-8">EXPEDITION ALBUM</span>
            
            <div className="relative w-full max-w-sm aspect-[4/3] mx-auto overflow-hidden border-4 border-[#8d7e68] shadow-2xl bg-[#f3efe3] p-2">
              {couplePhoto ? (
                <SafeImage 
                  src={couplePhoto} 
                  alt="Adventure Map" 
                  className="w-full h-full object-cover grayscale opacity-90 contrast-120"
                  isHero={false}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-[#8d7e68] bg-[#f5f2eb]">
                  <Heart className="w-12 h-12 mb-2 opacity-35" />
                  <span className="text-[10px] tracking-wider uppercase opacity-55">PORTRAIT</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------- SCENE 5: CONFIRMATION & RSVP ----------------- */}
        {(prefersReducedMotion || (progress >= 0.85 && progress <= 1)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20 overflow-y-auto"}>
            <div id="adventure-rsvp" className="w-full max-w-md mx-auto pt-10 pb-6 relative z-10 bg-[#f3efe3]/95 border-4 border-[#8d7e68] p-6 shadow-2xl backdrop-blur-md">
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#8d7e68] block mb-4 uppercase font-bold flex items-center justify-center gap-2">
                🏕️ T-MINUS TO SUMMIT ARRIVAL
              </span>

              {wedding.wedding_date && (
                <div className="mb-6 scale-90">
                  <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#5c5346" styleType="elegant" />
                </div>
              )}

              <div className="w-full space-y-6 pt-4 border-t border-dashed border-[#8d7e68]">
                {showRsvp && (
                  <div className="w-full [&>button]:w-full [&>button]:h-14 [&>button]:bg-[#8d7e68] [&>button]:text-[#f3efe3] [&>button]:uppercase [&>button]:tracking-widest [&>button]:text-xs [&>button]:font-black [&>button]:hover:bg-[#5c5346] [&>button]:transition-all [&>button]:duration-300 [&>button]:rounded-none">
                    {renderRsvpButton()}
                  </div>
                )}
                
                <div className="w-full text-[#5c5346]">
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
