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

export default function MuseumExhibitionLayout(props: LayoutProps) {
  const { wedding, primaryColor, textColor, headingFont, bodyFont, dateStr, timeStr, eventTitle, renderTimer, renderRsvpButton, handleMapClick } = props;
  const frameRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (prefersReducedMotion || !frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
    setTilt({ x: x * 15, y: y * -15 }); // Tilt angle limit
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const coupleName = wedding.bride_name && wedding.groom_name 
    ? `${wedding.bride_name} & ${wedding.groom_name}` 
    : wedding.title;

  return (
    <div className="w-full min-h-screen bg-[#f4efe8] text-[#3e3b37] relative font-sans overflow-x-hidden py-16 selection:bg-amber-100">
      {/* Gallery Wall Background */}
      <div className="absolute inset-x-0 bottom-0 top-[20%] pointer-events-none opacity-40 z-0">
        {/* Subtle base board line */}
        <div className="w-full h-[1px] bg-[#3e3b37]/20 absolute bottom-12" />
        <div className="w-full h-12 bg-[#e6ded3] absolute bottom-0" />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl mx-auto px-6 space-y-20">
        {/* Gallery Tag */}
        <header className="text-center space-y-4">
          <span className="text-[10px] tracking-[0.4em] uppercase text-[#8c8275] border border-[#8c8275]/30 py-1 px-3 rounded-full font-mono bg-white/50">
            {eventTitle || 'EXHIBITION PRESENTATION'}
          </span>
          <h1 className="text-4xl sm:text-5xl font-light tracking-wide max-w-xl leading-tight" style={{ fontFamily: `"${headingFont}", serif` }}>
            {coupleName}
          </h1>
          <p className="text-sm font-mono text-[#8c8275] uppercase tracking-widest">{dateStr} &bull; {timeStr}</p>
        </header>

        {/* Signature Moment: 3D Interactive Exhibition Frame */}
        <section 
          ref={frameRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full max-w-md bg-white border border-[#d2c9be] p-6 shadow-xl transition-transform duration-200 ease-out relative cursor-crosshair z-10"
          style={{
            transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
            boxShadow: '0 20px 40px rgba(0,0,0,0.06)'
          }}
        >
          {/* Internal passe-partout matte border */}
          <div className="border border-[#e6e0d5] bg-[#faf8f5] p-8 flex flex-col items-center text-center space-y-6">
            <div className="w-10 h-10 border border-[#8c8275]/40 rounded-full flex items-center justify-center text-xs text-[#8c8275] font-serif">
              Ex
            </div>
            <h2 className="text-2xl font-light leading-tight font-serif text-[#1a1816]">The Assembly</h2>
            <div className="w-16 h-[1px] bg-[#8c8275]/30" />
            <div className="text-sm italic leading-relaxed text-[#5e5850]">
              {props.renderQuote()}
            </div>
          </div>
          {/* Plaque label below the frame */}
          <div className="mt-4 text-center">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#8c8275]">Gilded Frame Collection</span>
          </div>
        </section>

        {/* Counter Widget */}
        <section className="w-full bg-white border border-[#e6ded3] rounded-2xl p-8 shadow-sm">
          <h3 className="text-xs uppercase tracking-[0.3em] text-[#8c8275] text-center mb-6 font-mono">Time Remaining</h3>
          {renderTimer()}
        </section>

        {/* Details Grid */}
        <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border border-[#e6ded3] rounded-2xl p-8 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-[#8c8275] mr-4" />
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#3e3b37]">Date</h4>
                  <p className="text-xs text-[#5e5850]">{dateStr} at {timeStr}</p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-[#8c8275] mr-4" />
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#3e3b37]">Gallery Room</h4>
                  <p className="text-xs text-[#5e5850]">{wedding.venue_address || 'Museum Wing B Hall'}</p>
                </div>
              </div>
            </div>
            <button 
              onClick={handleMapClick}
              className="w-full py-2.5 rounded-lg border border-[#8c8275]/30 text-[#8c8275] hover:bg-[#8c8275] hover:text-[#f4efe8] transition duration-300 flex items-center justify-center space-x-2 text-xs uppercase tracking-wider font-bold font-mono"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Directions</span>
            </button>
          </div>

          <div className="bg-white border border-[#e6ded3] rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center text-center space-y-6">
            <Heart className="w-8 h-8 text-[#8c8275] animate-pulse" />
            <h4 className="text-lg font-light uppercase tracking-wider text-[#3e3b37]">Exhibition RSVP</h4>
            <p className="text-xs text-[#5e5850] max-w-xs leading-relaxed">Please register your attendance for invitation catalog verification.</p>
            {renderRsvpButton()}
          </div>
        </section>

        {/* Guestbook */}
        <section className="w-full bg-white border border-[#e6ded3] rounded-2xl p-8 shadow-sm">
          <h3 className="text-xs font-bold mb-6 uppercase tracking-widest text-[#8c8275] font-mono">Visitor Guestbook</h3>
          {props.renderGuestBook()}
        </section>
      </div>
    </div>
  );
}
