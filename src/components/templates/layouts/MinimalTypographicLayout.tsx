'use client';
import React from 'react';
import { Calendar, MapPin, Navigation, ArrowRight } from 'lucide-react';
import SafeImage from '@/components/ui/SafeImage';

interface LayoutProps {\n  selectedBackground?: any;
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

export default function MinimalTypographicLayout({
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
  cardBgColor = '#ffffff',
  mode = 'public'
, selectedBackground}: LayoutProps) {
  const couplePhoto = wedding.bride_photo_url || wedding.groom_photo_url || wedding.background_image_url || '';
  const mainBg = cardBgColor || '#ffffff';
  
  const overrides = wedding.custom_overrides || {};
  const focalX = overrides.photoFocalPoint?.x ?? wedding.photo_focal_point?.x ?? 50;
  const focalY = overrides.photoFocalPoint?.y ?? wedding.photo_focal_point?.y ?? 50;
  const objectPosition = `${focalX}% ${focalY}%`;

  const hasMaps = !!wedding.google_maps_url;
  const showRsvp = wedding.show_rsvp !== false;

  return (
    <div 
      className="min-h-screen w-full relative flex flex-col justify-between overflow-x-hidden font-sans selection:bg-current selection:text-white"
      style={{ ...(selectedBackground?.background ? { background: selectedBackground.background } : {}), backgroundColor: mainBg, color: textColor || '#111', fontFamily: `"${bodyFont}", sans-serif` }}
    >
      {/* Structural Grid lines for Swiss aesthetic */}
      <div className="absolute inset-0 pointer-events-none grid grid-cols-4 lg:grid-cols-12 gap-4 px-6 lg:px-12 opacity-[0.04]">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-full border-l border-current hidden lg:block" />
        ))}
      </div>

      {/* Top Header */}
      <header className="w-full px-6 py-8 lg:px-12 flex flex-row justify-between items-start text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold z-10 border-b border-current/10">
         <div className="opacity-70 max-w-[200px] sm:max-w-none">{eventTitle}</div>
         <div className="text-right opacity-70 leading-relaxed">{dateStr} <br /> {timeStr}</div>
      </header>

      {/* Main Grid Content */}
      <main className="flex-grow w-full grid grid-cols-1 lg:grid-cols-12 gap-8 px-6 lg:px-12 py-12 lg:py-24 z-10">
        
        {/* Massive Typography Section - Left Side */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col justify-center relative">
          
          <h1 
            className="text-[16vw] lg:text-[11vw] font-black tracking-tighter uppercase leading-[0.85] z-20"
            style={{ fontFamily: `"${headingFont}", sans-serif`, color: primaryColor || 'inherit' }}
          >
            {/* Bride Name */}
            <div className="hover:translate-x-8 transition-transform duration-700 ease-out cursor-default origin-left">
              <span className="block">{wedding.bride_name}</span>
            </div>
            
            {/* Ampersand */}
            <div className="text-[12vw] lg:text-[8vw] font-light opacity-30 my-4 lg:my-0 lg:ml-32 hover:translate-x-12 transition-transform duration-700 ease-out cursor-default">
              &amp;
            </div>
            
            {/* Groom Name */}
            <div className="hover:translate-x-8 transition-transform duration-700 ease-out cursor-default origin-left">
              <span className="block">{wedding.groom_name}</span>
            </div>
          </h1>

          {/* Quote Block - integrated structurally into the text grid */}
          <div className="mt-16 lg:mt-24 max-w-sm text-sm leading-loose tracking-widest uppercase opacity-80 font-medium border-l-[2px] border-current pl-6 ml-1 lg:ml-2">
            {renderQuote()}
          </div>
        </div>

        {/* Media & Details Section - Right Side */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-16 lg:mt-0 mt-16 z-20">
          
          {couplePhoto && (
            <div className="w-full aspect-[3/4] lg:aspect-[4/5] overflow-hidden relative group">
              <div className="absolute inset-0 bg-current opacity-10 group-hover:opacity-0 transition-opacity duration-700 z-10 pointer-events-none" />
              <SafeImage 
                src={couplePhoto} 
                alt="Couple"
                className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]"
                style={{ objectPosition }}
                isHero={true}
              />
            </div>
          )}

          {/* Detailed Info Blocks */}
          <div className="flex flex-col gap-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8 text-sm uppercase tracking-widest font-bold">
              <div>
                <div className="text-[10px] opacity-50 mb-3 border-b border-current/20 pb-2">Date & Time</div>
                <p className="flex items-center gap-2"><Calendar className="w-4 h-4 opacity-50"/> {dateStr}</p>
                <p className="opacity-70 mt-1 ml-6">{timeStr}</p>
              </div>

              <div>
                <div className="text-[10px] opacity-50 mb-3 border-b border-current/20 pb-2">Location</div>
                <p className="flex items-start gap-2"><MapPin className="w-4 h-4 opacity-50 mt-0.5"/> {wedding.venue_name || 'Venue TBA'}</p>
                {wedding.venue_address && (
                  <p className="opacity-70 mt-2 text-xs leading-relaxed normal-case tracking-normal font-sans font-medium ml-6">{wedding.venue_address}</p>
                )}
              </div>
            </div>

            {hasMaps && (
              <button 
                onClick={handleMapClick}
                className="group flex items-center justify-between w-full py-5 border-y border-current/20 hover:border-current transition-colors text-xs tracking-[0.2em] uppercase font-black"
              >
                <span>Navigate to Venue</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-3 transition-transform" />
              </button>
            )}

            <div className="flex flex-col gap-8 w-full mt-4">
              {showRsvp && (
                <div className="w-full">
                  {renderRsvpButton()}
                </div>
              )}
              
              <div className="w-full bg-current/5 p-6 rounded-none border border-current/10">
                <div className="text-[10px] uppercase tracking-[0.2em] opacity-50 mb-4 font-bold text-center">Countdown</div>
                {renderTimer()}
              </div>

              <div className="w-full">
                {renderGuestBook()}
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-6 py-6 lg:px-12 border-t border-current/10 text-[10px] uppercase tracking-[0.3em] font-bold opacity-60 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
        <span>&copy; {dateObj.getFullYear()} Minimalist Form</span>
        <span>A Premium Typographic Experience</span>
      </footer>
    </div>
  );
}
