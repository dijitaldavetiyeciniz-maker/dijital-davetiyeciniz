'use client';
import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Navigation, Compass, Moon, Star, Sparkles } from 'lucide-react';
import { getReadableTextColor, WCAG_MIN_RATIO, checkTemplateContrast } from '@/lib/colorUtils';
import SafeImage from '@/components/ui/SafeImage';

interface LayoutProps {
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
  cardBlur?: number;
  cardSurfaceStyle?: React.CSSProperties;
  mode?: 'preview' | 'public';
}

export default function ConstellationNightLayout({
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
  cardBgColor = '#030712',
  cardBlur = 0,
  cardSurfaceStyle,
  mode = 'public'
, selectedBackground}: LayoutProps) {
  const themeCyan = primaryColor || '#38bdf8';
  const mainBg = cardBgColor || '#030712';
  
  const latitude = `${dateObj.getDate()}°${(dateObj.getMonth() + 1) * 4}'N`;
  const longitude = `${dateObj.getFullYear() % 100}°${(dateObj.getHours() || 12) * 2}'E`;

  const hasMaps = !!wedding.google_maps_url;
  const showRsvp = wedding.show_rsvp !== false;

  const [stars, setStars] = useState<{top: string, left: string, size: string, opacity: number, animDelay: string, animDur: string}[]>([]);

  useEffect(() => {
    // Generate stars on client to avoid hydration mismatch
    const generatedStars = [...Array(50)].map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 3 + 1}px`,
      opacity: Math.random() * 0.8 + 0.2,
      animDelay: `${Math.random() * 5}s`,
      animDur: `${Math.random() * 3 + 2}s`
    }));
    setStars(generatedStars);
  }, []);

  return (
    <div 
      className="min-h-screen w-full relative overflow-x-hidden flex"
      style={{ ...(selectedBackground?.background ? { background: selectedBackground.background } : {}), fontFamily: `"${bodyFont}", sans-serif`,
        ...cardSurfaceStyle,
        backgroundImage: 'radial-gradient(circle at 50% 0%, #0f1b3d 0%, #030712 80%)',
        color: textColor || '#f0f9ff'
      }}
      data-testid="layout-constellation-night"
    >
      {/* Background Star Map */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none opacity-60">
        <svg className="absolute inset-0 w-full h-full stroke-sky-300/20 fill-none" preserveAspectRatio="xMidYMid slice">
          <path d="M100,150 L200,80 L350,120 L400,250 L300,350 L150,300 Z" strokeWidth="0.5" strokeDasharray="4 4" />
          <path d="M200,80 L300,150 L400,250" strokeWidth="0.5" strokeDasharray="4 4" />
          <path d="M800,200 L950,100 L1100,250 L1000,400 L850,350 Z" strokeWidth="0.5" strokeDasharray="4 4" />
          <path d="M800,600 L900,500 L1050,550 L1150,700 L950,750 Z" strokeWidth="0.5" strokeDasharray="4 4" />
          <path d="M200,700 L300,600 L450,650 L500,800 L350,850 Z" strokeWidth="0.5" strokeDasharray="4 4" />
          {/* Connecting lines across the screen */}
          <path d="M400,250 L800,200" strokeWidth="0.3" strokeDasharray="2 6" />
          <path d="M300,600 L800,600" strokeWidth="0.3" strokeDasharray="2 6" />
        </svg>

        {/* Twinkling stars */}
        {stars.map((star, i) => (
          <div 
            key={i} 
            className="absolute rounded-full bg-white"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
              animation: `pulse ${star.animDur} infinite alternate`,
              animationDelay: star.animDelay
            }}
          />
        ))}
      </div>

      {/* Main Layout Container */}
      <div className="relative z-10 w-full min-h-screen flex flex-col lg:flex-row items-center justify-center p-6 md:p-12 lg:p-24 gap-12 lg:gap-24">
        
        {/* Left Column: Title & Intro */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 lg:space-y-12">
          
          <div className="flex items-center gap-3 py-2 px-6 rounded-full bg-sky-950/40 border border-sky-400/30 text-xs md:text-sm font-mono tracking-[0.3em] uppercase text-sky-300 shadow-[0_0_20px_rgba(56,189,248,0.2)] backdrop-blur-md">
            <Compass className="w-4 h-4 md:w-5 md:h-5" />
            <span>{latitude} {longitude}</span>
          </div>

          <div className="space-y-6 w-full">
            <h3 className="font-semibold tracking-[0.3em] uppercase text-sm md:text-base text-sky-400/80">
              {eventTitle}
            </h3>
            
            <div className="relative w-full flex flex-col items-center lg:items-start">
              <h1 
                className="text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tight leading-none drop-shadow-[0_0_30px_rgba(56,189,248,0.4)]"
                style={{ color: themeCyan, fontFamily: `"${headingFont}", serif` }}
              >
                {wedding.bride_name}
              </h1>
              
              {wedding.groom_name && (
                <>
                  <div 
                    className="text-5xl md:text-7xl italic opacity-50 font-serif my-4 md:my-6 lg:ml-24" 
                    style={{ fontFamily: `"${accentFont}", cursive` }}
                  >
                    &
                  </div>
                  <h1 
                    className="text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tight leading-none drop-shadow-[0_0_30px_rgba(56,189,248,0.4)] lg:ml-32"
                    style={{ color: themeCyan, fontFamily: `"${headingFont}", serif` }}
                  >
                    {wedding.groom_name}
                  </h1>
                </>
              )}
            </div>
          </div>

          <div className="text-lg md:text-xl font-light text-sky-200/80 max-w-lg leading-relaxed italic border-l-2 border-sky-500/30 pl-6 py-2 bg-sky-950/10 rounded-r-2xl backdrop-blur-sm">
            {renderQuote()}
          </div>

        </div>

        {/* Right Column: Floating Info Panels & Orbiting Timer */}
        <div className="w-full lg:w-1/2 relative flex flex-col items-center justify-center space-y-8">
          
          {/* Orbiting Timer Panel */}
          <div className="relative w-full max-w-md group my-8 lg:my-0">
            {/* Orbital Rings */}
            <div className="absolute inset-[-40px] md:inset-[-60px] border border-sky-500/10 rounded-full" style={{ animation: 'spin 20s linear infinite' }} />
            <div className="absolute inset-[-60px] md:inset-[-90px] border border-sky-400/10 rounded-full" style={{ animation: 'spin 30s linear infinite reverse' }} />
            
            <div className="relative z-10 w-full p-8 md:p-10 rounded-[2.5rem] bg-slate-900/60 backdrop-blur-xl border border-sky-400/20 shadow-[0_0_50px_rgba(3,105,161,0.25)] flex flex-col items-center justify-center text-center">
              <Moon className="absolute top-6 right-6 w-6 h-6 text-sky-300/40" />
              <Sparkles className="absolute bottom-6 left-6 w-5 h-5 text-sky-300/40" />
              <span className="text-[10px] md:text-xs font-mono tracking-[0.2em] text-sky-400 block mb-6 uppercase bg-sky-950/60 py-1.5 px-4 rounded-full border border-sky-400/10">
                Yıldızların Altında Buluşmaya Kalan
              </span>
              <div className="transform md:scale-110 origin-center transition-transform duration-700 hover:scale-125">
                {renderTimer()}
              </div>
            </div>
          </div>

          {/* Details Panels */}
          <div className="w-full max-w-md grid grid-cols-1 gap-5">
            <div className="p-6 rounded-[2rem] bg-sky-950/40 backdrop-blur-lg border border-sky-400/15 flex items-center gap-5 hover:bg-sky-900/50 hover:border-sky-400/30 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
              <div className="w-14 h-14 rounded-full bg-sky-900/60 flex items-center justify-center flex-shrink-0 border border-sky-400/20 shadow-inner">
                <Calendar className="w-6 h-6 text-sky-300" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-semibold text-lg md:text-xl text-sky-50">{dateStr}</span>
                <span className="text-sky-300/80 text-sm md:text-base mt-0.5">{timeStr}</span>
              </div>
            </div>

            <div className="p-6 rounded-[2rem] bg-sky-950/40 backdrop-blur-lg border border-sky-400/15 flex items-start gap-5 hover:bg-sky-900/50 hover:border-sky-400/30 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
              <div className="w-14 h-14 rounded-full bg-sky-900/60 flex items-center justify-center flex-shrink-0 border border-sky-400/20 shadow-inner mt-1">
                <MapPin className="w-6 h-6 text-sky-300" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-semibold text-lg md:text-xl text-sky-50">{wedding.venue_name || 'Mekan Belirtilmedi'}</span>
                {wedding.venue_address && (
                  <span className="text-sky-300/80 text-sm md:text-base mt-1.5 leading-relaxed">{wedding.venue_address}</span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="w-full max-w-md flex flex-col gap-5 mt-2">
            {hasMaps && (
              <button 
                type="button"
                onClick={handleMapClick}
                className="group relative w-full h-16 rounded-[2rem] overflow-hidden bg-sky-950/50 border border-sky-400/30 hover:border-sky-300/60 transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-sky-600/20 via-sky-400/20 to-sky-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex items-center justify-between px-8 h-full text-sky-50 font-medium tracking-wide text-sm md:text-base uppercase">
                  <div className="flex items-center gap-4">
                    <Navigation className="w-5 h-5 text-sky-400 group-hover:animate-pulse" />
                    <span>Gökyüzü Konumu</span>
                  </div>
                  <Star className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity group-hover:text-sky-300" />
                </div>
              </button>
            )}

            {showRsvp && (
              <div className="w-full rounded-[2rem] bg-gradient-to-r from-sky-600/20 via-sky-300/20 to-sky-600/20 p-[2px] backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.2)] overflow-hidden">
                <div className="w-full h-full bg-slate-950/80 rounded-[calc(2rem-2px)]">
                  {renderRsvpButton()}
                </div>
              </div>
            )}
          </div>

          {/* Guestbook */}
          <div className="w-full max-w-md mt-6">
            <div className="p-2 rounded-[2rem] bg-sky-950/20 backdrop-blur-sm border border-sky-400/10">
              {renderGuestBook()}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

