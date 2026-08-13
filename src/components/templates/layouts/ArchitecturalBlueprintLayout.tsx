'use client';
import React, { useRef, useEffect, useState } from 'react';
import { Calendar, MapPin, Navigation, Award } from 'lucide-react';

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

export default function ArchitecturalBlueprintLayout(props: LayoutProps) {
  const { wedding, primaryColor, textColor, headingFont, bodyFont, dateStr, timeStr, eventTitle, renderTimer, renderRsvpButton, handleMapClick } = props;
  const blueprintRef = useRef<SVGSVGElement>(null);
  const [dashOffset, setDashOffset] = useState(1000);
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
      if (!blueprintRef.current || prefersReducedMotion) return;
      const rect = blueprintRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / windowHeight));
      setDashOffset(Math.round((1 - progress) * 1000));
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prefersReducedMotion]);

  const coupleName = wedding.bride_name && wedding.groom_name 
    ? `${wedding.bride_name} & ${wedding.groom_name}` 
    : wedding.title;

  return (
    <div className="w-full min-h-screen bg-[#0d1b2a] text-[#e0e1dd] relative font-mono overflow-x-hidden selection:bg-cyan-500/30">
      {/* Blueprint Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-10 z-0">
        <div className="w-full h-full bg-[linear-gradient(rgba(0,180,216,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(0,180,216,0.15)_1px,transparent_1px)] [background-size:40px_40px]" />
        <div className="w-full h-full bg-[linear-gradient(rgba(0,180,216,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,180,216,0.05)_1px,transparent_1px)] [background-size:10px_10px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl mx-auto px-6 py-16 space-y-24">
        {/* Title */}
        <section className="min-h-[75vh] flex flex-col justify-center items-center text-center space-y-8">
          <span className="text-xs uppercase tracking-[0.5em] text-[#00b4d8] border border-[#00b4d8]/40 py-1.5 px-4 rounded-md">
            {eventTitle || 'CONFERENCE INVITATION'}
          </span>
          <h1 className="text-4xl sm:text-6xl font-black leading-tight tracking-tight uppercase" style={{ fontFamily: `"${headingFont}", sans-serif` }}>
            {coupleName}
          </h1>
          <div className="w-24 h-[1px] bg-[#00b4d8]/50" />
          <p className="text-lg tracking-wider text-cyan-400 font-mono">
            {dateStr} &bull; {timeStr}
          </p>
        </section>

        {/* Signature Moment: Drawing Blueprint Draft */}
        <section className="w-full flex flex-col items-center py-6 border border-[#00b4d8]/30 rounded-3xl p-8 bg-[#0d1b2a]/95 backdrop-blur-md">
          <h2 className="text-xs uppercase tracking-[0.3em] text-[#00b4d8] mb-6">Technical Outline Draft</h2>
          <svg 
            ref={blueprintRef}
            width="280" 
            height="180" 
            viewBox="0 0 280 180" 
            fill="none" 
            stroke="#00b4d8" 
            strokeWidth="1.5" 
            className="opacity-80"
          >
            {/* Building blueprint outlines */}
            <rect 
              x="20" 
              y="20" 
              width="240" 
              height="140" 
              strokeDasharray="1000" 
              strokeDashoffset={prefersReducedMotion ? 0 : dashOffset} 
            />
            <line 
              x1="20" 
              y1="90" 
              x2="260" 
              y2="90" 
              strokeDasharray="1000" 
              strokeDashoffset={prefersReducedMotion ? 0 : dashOffset} 
            />
            <circle 
              cx="140" 
              cy="90" 
              r="40" 
              strokeDasharray="1000" 
              strokeDashoffset={prefersReducedMotion ? 0 : dashOffset} 
            />
            {/* Dimensions lines */}
            <path d="M10,20 L10,160 M5,20 L15,20 M5,160 L15,160" stroke="#00b4d8" opacity="0.5" />
            <path d="M20,170 L260,170 M20,165 L20,175 M260,165 L260,175" stroke="#00b4d8" opacity="0.5" />
          </svg>
          <span className="text-[10px] uppercase tracking-widest text-[#00b4d8]/70 mt-4">Draft Section 10A</span>
        </section>

        {/* Counter */}
        <section className="w-full border border-white/10 rounded-3xl p-8 bg-[#0d1b2a]/80 backdrop-blur-md">
          {renderTimer()}
        </section>

        {/* Info Blocks */}
        <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border border-white/10 rounded-3xl p-8 bg-[#0d1b2a]/80 backdrop-blur-md flex flex-col justify-between space-y-6">
            <div className="space-y-4 font-mono">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-cyan-400 mr-4" />
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-wider">Date & Time</h3>
                  <p className="text-xs opacity-75">{dateStr} at {timeStr}</p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-cyan-400 mr-4" />
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-wider">Venue Location</h3>
                  <p className="text-xs opacity-75">{wedding.venue_address || 'Palazzo Arch Hall'}</p>
                </div>
              </div>
            </div>
            <button 
              onClick={handleMapClick}
              className="w-full py-3 rounded-xl border border-cyan-400/40 text-cyan-400 hover:bg-cyan-400 hover:text-[#0d1b2a] transition duration-300 flex items-center justify-center space-x-2 text-xs uppercase tracking-widest font-bold"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Directions</span>
            </button>
          </div>

          <div className="border border-white/10 rounded-3xl p-8 bg-[#0d1b2a]/80 backdrop-blur-md flex flex-col items-center justify-center text-center space-y-6">
            <Award className="w-10 h-10 text-cyan-400" />
            <h3 className="text-lg font-bold uppercase tracking-wider">Confirm Ticket</h3>
            <p className="text-xs opacity-75 max-w-xs leading-relaxed font-mono">Please register your ticket by completing the attendance RSVP below.</p>
            {renderRsvpButton()}
          </div>
        </section>

        {/* Guestbook */}
        <section className="w-full border border-white/10 rounded-3xl p-8 bg-[#0d1b2a]/80 backdrop-blur-md">
          <h3 className="text-xs font-bold mb-6 uppercase tracking-widest text-[#00b4d8]">Attendee Board</h3>
          {props.renderGuestBook()}
        </section>
      </div>
    </div>
  );
}
