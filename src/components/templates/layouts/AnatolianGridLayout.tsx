'use client';
import React, { useRef, useEffect, useState } from 'react';
import { Calendar, MapPin, Navigation, Heart } from 'lucide-react';

interface LayoutProps {
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
  templateId?: string;
}

export default function AnatolianGridLayout(props: LayoutProps) {
  const { wedding, primaryColor, textColor, headingFont, bodyFont, dateStr, timeStr, eventTitle, renderTimer, renderRsvpButton, handleMapClick } = props;
  const starRef = useRef<HTMLDivElement>(null);
  const [assembleProgress, setAssembleProgress] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!starRef.current) return;
      const rect = starRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how close the star is to the center of the viewport (from 0 to 1)
      const elementMiddle = rect.top + rect.height / 2;
      const progress = Math.max(0, Math.min(1, (windowHeight - elementMiddle) / (windowHeight / 2)));
      setAssembleProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const coupleName = wedding.bride_name && wedding.groom_name 
    ? `${wedding.bride_name} & ${wedding.groom_name}` 
    : wedding.title;

  return (
    <div className="w-full min-h-screen bg-[#1c2e36] text-[#e8dfcf] relative font-sans overflow-x-hidden">
      {/* Stone engraved background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-5 z-0">
        <div className="w-full h-full bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl mx-auto px-6 py-16 space-y-24">
        {/* Title */}
        <section className="min-h-[75vh] flex flex-col justify-center items-center text-center space-y-8">
          <span className="text-xs uppercase tracking-[0.4em] text-amber-500 font-mono">{eventTitle || 'DAVETİYE'}</span>
          <h1 className="text-4xl sm:text-6xl font-light tracking-wide max-w-xl leading-tight" style={{ fontFamily: `"${headingFont}", serif` }}>
            {coupleName}
          </h1>
          <div className="w-16 h-[1px] bg-amber-500/50" />
          <p className="text-lg tracking-widest font-mono text-amber-400">
            {dateStr} &bull; {timeStr}
          </p>
        </section>

        {/* Signature Moment: Assembling Seljuk Star */}
        <section ref={starRef} className="w-full flex flex-col items-center py-8">
          <div className="relative w-40 h-40 flex items-center justify-center">
            {/* Left triangle */}
            <div 
              className="absolute w-24 h-24 bg-amber-500/20 border border-amber-500/60 transition-transform duration-100 ease-out"
              style={{
                transform: prefersReducedMotion 
                  ? 'rotate(0deg)' 
                  : `translate(${(1 - assembleProgress) * -50}px, ${(1 - assembleProgress) * -30}px) rotate(${(1 - assembleProgress) * 45}deg)`
              }}
            />
            {/* Right triangle rotated */}
            <div 
              className="absolute w-24 h-24 bg-amber-500/20 border border-amber-500/60 transition-transform duration-100 ease-out"
              style={{
                transform: prefersReducedMotion 
                  ? 'rotate(45deg)' 
                  : `translate(${(1 - assembleProgress) * 50}px, ${(1 - assembleProgress) * 30}px) rotate(${(1 - assembleProgress) * -45 + 45}deg)`
              }}
            />
            <div className="relative z-10 text-amber-500 text-xs font-mono font-bold uppercase tracking-widest">
              SELJUK
            </div>
          </div>
          <p className="text-xs tracking-[0.2em] text-center text-amber-500/70 mt-6 uppercase font-mono">Geometric Harmony</p>
        </section>

        {/* Counter */}
        <section className="w-full bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-md">
          {renderTimer()}
        </section>

        {/* Quote */}
        <section className="w-full text-center italic text-lg leading-relaxed max-w-2xl px-6 opacity-90">
          {props.renderQuote()}
        </section>

        {/* Info Blocks */}
        <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <Calendar className="w-6 h-6 text-amber-500 mr-4" />
                <div>
                  <h3 className="font-bold text-sm">Date</h3>
                  <p className="text-xs opacity-75">{dateStr} — {timeStr}</p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="w-6 h-6 text-amber-500 mr-4" />
                <div>
                  <h3 className="font-bold text-sm">Venue</h3>
                  <p className="text-xs opacity-75">{wedding.venue_address || 'Palace Grand Hall'}</p>
                </div>
              </div>
            </div>
            <button 
              onClick={handleMapClick}
              className="w-full py-3 rounded-xl border border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-black transition duration-300 flex items-center justify-center space-x-2"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Directions</span>
            </button>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-6">
            <Heart className="w-10 h-10 text-amber-500" />
            <h3 className="text-xl font-light">Confirm Your Presence</h3>
            <p className="text-xs opacity-75 max-w-xs leading-relaxed">It would be our honor to celebrate our union with you.</p>
            {renderRsvpButton()}
          </div>
        </section>

        {/* Guestbook */}
        <section className="w-full bg-white/[0.02] border border-white/5 rounded-3xl p-8">
          <h3 className="text-lg font-bold mb-6 text-center text-amber-500">Leave a Message</h3>
          {props.renderGuestBook()}
        </section>
      </div>
    </div>
  );
}
