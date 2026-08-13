'use client';
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Sparkles, Navigation, Heart } from 'lucide-react';

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

export default function JapaneseFoldingScreenLayout(props: LayoutProps) {
  const { wedding, primaryColor, textColor, headingFont, bodyFont, dateStr, timeStr, eventTitle, renderTimer, renderRsvpButton, handleMapClick } = props;
  const [unfolded, setUnfolded] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    if (mediaQuery.matches) {
      setUnfolded(true);
    } else {
      const timer = setTimeout(() => setUnfolded(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  const coupleName = wedding.bride_name && wedding.groom_name 
    ? `${wedding.bride_name} & ${wedding.groom_name}` 
    : wedding.title;

  return (
    <div className="w-full min-h-screen bg-[#111111] text-[#e5d5b7] py-12 px-4 relative font-sans overflow-x-hidden flex items-center justify-center">
      {/* 3D Perspective Container for Screen Folding panels */}
      <div 
        className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-0 border border-amber-600/40 shadow-2xl relative z-10 transition-all duration-1000 ease-out origin-center"
        style={{
          perspective: '1500px',
        }}
      >
        {/* Panel 1: Left */}
        <div 
          className="bg-[#241d13] border-r border-amber-600/30 p-8 flex flex-col justify-center items-center text-center space-y-6 transition-transform duration-1000 ease-out"
          style={{
            transform: unfolded && !prefersReducedMotion ? 'rotateY(10deg)' : 'rotateY(90deg)',
            transformOrigin: 'left center',
            backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.4) 0%, rgba(255,255,255,0.03) 100%)'
          }}
        >
          <span className="text-xs uppercase tracking-[0.4em] text-amber-500 font-mono">{eventTitle || 'Welcome'}</span>
          <h1 className="text-3xl font-light leading-tight tracking-wide" style={{ fontFamily: `"${headingFont}", serif` }}>
            {coupleName}
          </h1>
          <div className="w-12 h-[1px] bg-amber-500/40" />
          <p className="text-sm tracking-widest font-mono text-amber-400">
            {dateStr} &bull; {timeStr}
          </p>
          <div className="pt-6 w-full scale-90">
            {renderTimer()}
          </div>
        </div>

        {/* Panel 2: Center */}
        <div 
          className="bg-[#2a2216] border-r border-amber-600/30 p-8 flex flex-col justify-center items-center text-center space-y-6 transition-transform duration-1000 ease-out"
          style={{
            transform: unfolded && !prefersReducedMotion ? 'rotateY(-5deg)' : 'rotateY(90deg)',
            transformOrigin: 'center center',
            backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.2) 100%)'
          }}
        >
          <div className="italic text-base leading-relaxed max-w-xs py-4">
            {props.renderQuote()}
          </div>
          <div className="w-16 h-[2px] bg-amber-500/40" />
          <div className="flex flex-col space-y-4 items-center">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-amber-500" />
              <span className="text-xs tracking-wider">{dateStr}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-amber-500" />
              <span className="text-xs tracking-wider">{wedding.venue_address || 'Japanese Zen Gardens'}</span>
            </div>
          </div>
          <button 
            onClick={handleMapClick}
            className="px-6 py-2.5 rounded-lg border border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-black transition duration-300 text-xs tracking-wider"
          >
            Get Map Directions
          </button>
        </div>

        {/* Panel 3: Right */}
        <div 
          className="bg-[#241d13] p-8 flex flex-col justify-center items-center text-center space-y-6 transition-transform duration-1000 ease-out"
          style={{
            transform: unfolded && !prefersReducedMotion ? 'rotateY(-10deg)' : 'rotateY(90deg)',
            transformOrigin: 'right center',
            backgroundImage: 'linear-gradient(to left, rgba(0,0,0,0.4) 0%, rgba(255,255,255,0.03) 100%)'
          }}
        >
          <Heart className="w-8 h-8 text-amber-500 animate-pulse" />
          <h3 className="text-lg tracking-wider font-light">Confirm Your Presence</h3>
          <p className="text-xs opacity-75 max-w-xs leading-relaxed">It would be our honor to have you witness our special celebration.</p>
          <div className="scale-90">
            {renderRsvpButton()}
          </div>
          <div className="w-full pt-4">
            {props.renderGuestBook()}
          </div>
        </div>
      </div>
    </div>
  );
}
