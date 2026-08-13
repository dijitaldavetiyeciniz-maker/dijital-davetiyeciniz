'use client';
import React, { useRef, useEffect, useState } from 'react';
import { Calendar, MapPin, Navigation, Music } from 'lucide-react';

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

export default function ObsidianSoundboardLayout(props: LayoutProps) {
  const { wedding, primaryColor, textColor, headingFont, bodyFont, dateStr, timeStr, eventTitle, renderTimer, renderRsvpButton, handleMapClick } = props;
  const boardRef = useRef<HTMLDivElement>(null);
  const [sliderVal, setSliderVal] = useState(50);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  const coupleName = wedding.bride_name && wedding.groom_name 
    ? `${wedding.bride_name} & ${wedding.groom_name}` 
    : wedding.title;

  return (
    <div className="w-full min-h-screen bg-[#0f0f12] text-[#00ffcc] relative font-mono overflow-x-hidden p-6 selection:bg-[#00ffcc]/20">
      {/* Soundboard lines background */}
      <div className="absolute inset-0 pointer-events-none opacity-5 z-0">
        <div className="w-full h-full bg-[linear-gradient(rgba(0,255,200,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,200,0.1)_1px,transparent_1px)] [background-size:30px_30px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl mx-auto space-y-16 py-12">
        {/* Header */}
        <header className="text-center space-y-6">
          <span className="text-[10px] tracking-[0.4em] uppercase text-[#00ffcc] border border-[#00ffcc]/35 py-1 px-3 rounded-full bg-[#00ffcc]/5">
            {eventTitle || 'BROADCAST RECEIVER'}
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter uppercase text-white" style={{ fontFamily: `"${headingFont}", sans-serif` }}>
            {coupleName}
          </h1>
          <p className="text-sm text-[#00ffcc]/85 uppercase tracking-widest">{dateStr} &bull; {timeStr}</p>
        </header>

        {/* Signature Moment: Interactive Slider / Visualizer */}
        <section 
          ref={boardRef}
          className="w-full max-w-md bg-[#16161c] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden flex flex-col space-y-8"
        >
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <span className="text-xs uppercase text-white/50 tracking-wider">Soundboard Ctrl v1.0</span>
            <div className="w-3 h-3 rounded-full bg-[#00ffcc] animate-ping" />
          </div>

          {/* Equalizer Bars */}
          <div className="flex justify-around items-end h-20 px-4">
            {[40, 70, 50, 90, 60, 80, 50, 75, 45, 95].map((val, idx) => (
              <div 
                key={idx} 
                className="w-2.5 bg-[#00ffcc] rounded-t transition-all duration-300"
                style={{
                  height: prefersReducedMotion ? `${val * 0.7}%` : `${Math.max(10, Math.min(100, val * (sliderVal / 50)))}%`
                }}
              />
            ))}
          </div>

          {/* Controller Slider knob */}
          <div className="flex flex-col space-y-3">
            <div className="flex justify-between text-xs text-white/50">
              <span>FREQUENCY TUNER</span>
              <span>{sliderVal} MHz</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={sliderVal} 
              onChange={(e) => setSliderVal(Number(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00ffcc]"
            />
          </div>
        </section>

        {/* Counter */}
        <section className="w-full border border-white/10 rounded-3xl p-8 bg-[#16161c]/80 backdrop-blur-md">
          <h3 className="text-xs uppercase tracking-[0.3em] text-[#00ffcc] text-center mb-6">TIME TO BROADCAST</h3>
          {renderTimer()}
        </section>

        {/* Console Message */}
        <section className="w-full bg-[#16161c]/90 border border-white/10 rounded-2xl p-6 font-mono text-sm leading-relaxed text-white">
          <span className="text-[#00ffcc]">&gt; </span>{props.renderQuote()}
        </section>

        {/* Details Grid */}
        <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border border-white/10 rounded-3xl p-8 bg-[#16161c]/80 backdrop-blur-md flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-[#00ffcc] mr-4" />
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-white">Date</h4>
                  <p className="text-xs opacity-75">{dateStr} at {timeStr}</p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-[#00ffcc] mr-4" />
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-white">Station Address</h4>
                  <p className="text-xs opacity-75">{wedding.venue_address || 'Studio Room 4B'}</p>
                </div>
              </div>
            </div>
            <button 
              onClick={handleMapClick}
              className="w-full py-2.5 rounded-lg border border-[#00ffcc]/35 text-[#00ffcc] hover:bg-[#00ffcc] hover:text-black transition duration-300 flex items-center justify-center space-x-2 text-xs uppercase tracking-wider font-bold"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Directions</span>
            </button>
          </div>

          <div className="border border-white/10 rounded-3xl p-8 bg-[#16161c]/80 backdrop-blur-md flex flex-col items-center justify-center text-center space-y-6">
            <Music className="w-8 h-8 text-[#00ffcc] animate-pulse" />
            <h4 className="text-lg font-bold uppercase tracking-wider text-white">Confirm Receiver</h4>
            <p className="text-xs opacity-75 max-w-xs leading-relaxed">Submit RSVP form below to finalize network access permissions.</p>
            {renderRsvpButton()}
          </div>
        </section>

        {/* Guestbook */}
        <section className="w-full border border-white/10 rounded-3xl p-8 bg-[#16161c]/80 backdrop-blur-md">
          <h3 className="text-xs font-bold mb-6 uppercase tracking-widest text-[#00ffcc]">Message Logs</h3>
          {props.renderGuestBook()}
        </section>
      </div>
    </div>
  );
}
