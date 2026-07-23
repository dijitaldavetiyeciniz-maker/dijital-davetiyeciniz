'use client';
import React from 'react';
import { Calendar, MapPin, ArrowDownRight } from 'lucide-react';
import { getReadableTextColor } from '@/lib/colorUtils';
import SafeImage from '@/components/ui/SafeImage';

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
}

export default function ModernArchitectureLayout({
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
  cardBgColor = '#F4F4F0',
  mode = 'public'
}: LayoutProps) {
  const couplePhoto = wedding.bride_photo_url || wedding.groom_photo_url || wedding.background_image_url || '';
  
  const overrides = wedding.custom_overrides || {};
  const focalX = overrides.photoFocalPoint?.x ?? wedding.photo_focal_point?.x ?? 50;
  const focalY = overrides.photoFocalPoint?.y ?? wedding.photo_focal_point?.y ?? 50;
  const objectPosition = `${focalX}% ${focalY}%`;

  const mainBg = cardBgColor || '#F4F4F0';
  const contrastText = textColor || getReadableTextColor(mainBg, '#000000', '#ffffff');
  const accent = primaryColor || '#E85D04';

  const hasMaps = !!wedding.google_maps_url;
  const showRsvp = wedding.show_rsvp !== false;

  return (
    <div 
      className="min-h-screen w-full relative overflow-hidden flex flex-col md:grid md:grid-cols-12"
      style={{ backgroundColor: mainBg, color: contrastText, fontFamily: `"${bodyFont}", sans-serif` }}
      data-testid="layout-modern-architecture"
    >
      {/* BAUHAUS GEOMETRIC DECORATIONS */}
      <div 
        className="hidden md:block absolute top-[10%] left-[45%] w-32 h-32 rounded-full mix-blend-multiply opacity-80 z-0 pointer-events-none transition-transform duration-1000 hover:scale-110"
        style={{ backgroundColor: accent }}
      />
      <div 
        className="hidden md:block absolute bottom-[5%] right-[35%] w-48 h-48 mix-blend-multiply opacity-20 z-0 pointer-events-none"
        style={{ backgroundColor: contrastText }}
      />

      {/* LEFT CONTENT PANEL (7 cols) */}
      <div className="w-full md:col-span-7 md:order-1 flex flex-col justify-between z-10 p-6 md:p-16 lg:p-20 relative border-r-2" style={{ borderColor: `${contrastText}20` }}>
        
        {/* Top Header / Bauhaus Grid Line */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4 pb-8 border-b-4" style={{ borderColor: contrastText }}>
          <div className="text-xs font-black tracking-[0.4em] uppercase flex items-center gap-3">
             <span className="w-4 h-4 bg-black block" style={{ backgroundColor: accent }}></span>
             {eventTitle}
          </div>
          <div className="text-xs font-bold tracking-widest flex items-center gap-2 uppercase">
            <Calendar className="w-4 h-4" style={{ color: accent }} />
            {dateStr}
          </div>
        </div>

        {/* MASSIVE TYPOGRAPHY */}
        <div className="flex flex-col justify-center flex-1 py-12 md:py-24 relative z-10">
          <div className="relative">
             <div 
                className="absolute -top-16 -left-4 text-[12rem] lg:text-[16rem] opacity-5 font-black leading-none pointer-events-none select-none hidden md:block"
                style={{ fontFamily: `"${headingFont}", sans-serif` }}
             >
                {new Date(dateObj).getDate()}
             </div>
             
             <h1 
               className="text-[4rem] md:text-[6rem] lg:text-[8rem] font-black uppercase leading-[0.85] tracking-tighter mix-blend-difference z-20 relative break-words"
               style={{ fontFamily: `"${headingFont}", sans-serif`, color: accent }}
             >
               <span className="block pr-4">{wedding.bride_name}</span>
               <span className="block text-3xl md:text-6xl font-light tracking-widest my-2 opacity-50" style={{ color: contrastText }}>+</span>
               <span className="block pl-4 md:pl-12" style={{ color: contrastText }}>{wedding.groom_name}</span>
             </h1>
          </div>
          
          <div className="mt-12 max-w-md border-l-4 pl-6 md:pl-8 py-2 relative" style={{ borderColor: accent }}>
             <div 
               className="text-lg md:text-2xl font-medium leading-relaxed" 
               style={{ fontFamily: `"${accentFont}", sans-serif` }}
             >
                {renderQuote()}
             </div>
          </div>
        </div>

        {/* BOTTOM METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 pt-8 border-t-2 mt-auto" style={{ borderColor: `${contrastText}20` }}>
           
           <div className="flex flex-col gap-4">
              <span className="text-[10px] tracking-[0.3em] uppercase font-black opacity-60">Venue</span>
              <div className="flex items-start gap-3">
                 <MapPin className="w-6 h-6 shrink-0 mt-0.5" style={{ color: accent }} />
                 <div>
                    <div className="font-black text-xl uppercase tracking-wide">{wedding.venue_name || 'Bauhaus Gallery'}</div>
                    <div className="text-sm font-medium opacity-70 mt-1 uppercase tracking-wider">{wedding.venue_address}</div>
                 </div>
              </div>
           </div>

           <div className="flex flex-col gap-4">
              <span className="text-[10px] tracking-[0.3em] uppercase font-black opacity-60">Time</span>
              <div className="font-black text-2xl tracking-widest">{timeStr}</div>
           </div>

        </div>

      </div>

      {/* RIGHT IMAGE PANEL (5 cols) */}
      <div className="w-full h-[60vh] md:h-screen md:col-span-5 md:order-2 relative z-10 flex flex-col">
        {/* Massive photo */}
        <div className="flex-1 relative overflow-hidden bg-neutral-200">
          {couplePhoto ? (
            <SafeImage
              src={couplePhoto}
              alt="Couple"
              className="w-full h-full object-cover transition-transform duration-1000 ease-in-out hover:scale-[1.05]"
              style={{ objectPosition, filter: 'contrast(1.1) saturate(1.2)' }}
              isHero={true}
            />
          ) : (
            <div className="w-full h-full bg-neutral-300 flex items-center justify-center">
               <span className="text-neutral-500 font-bold tracking-widest uppercase">Visual Asset</span>
            </div>
          )}

          {/* Architectural Color Blocks on Image */}
          <div className="absolute top-0 right-0 w-16 h-1/3 mix-blend-multiply" style={{ backgroundColor: accent }} />
          <div className="absolute bottom-0 left-0 w-1/2 h-16 mix-blend-overlay" style={{ backgroundColor: contrastText }} />
        </div>

        {/* Right Panel Bottom Section (RSVP / Actions) */}
        <div className="p-6 md:p-12 border-t-4 bg-white/5 backdrop-blur-sm flex flex-col gap-8" style={{ borderColor: accent }}>
           
           <div className="w-full flex flex-col sm:flex-row md:flex-col gap-6 justify-between">
             {showRsvp && (
                <div className="flex-1">
                   <span className="text-[10px] tracking-[0.3em] uppercase font-black opacity-60 block mb-3">Participation</span>
                   <div className="font-bold">
                     {renderRsvpButton()}
                   </div>
                </div>
             )}

             {hasMaps && (
                <button 
                   onClick={handleMapClick}
                   className="group flex items-center justify-center sm:justify-start gap-4 transition-all hover:opacity-80 flex-1 md:mt-4"
                >
                   <div className="w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors group-hover:bg-black group-hover:text-white" style={{ borderColor: contrastText }}>
                      <ArrowDownRight className="w-5 h-5 group-hover:rotate-[-45deg] transition-transform duration-300" style={{ color: accent }} />
                   </div>
                   <span className="text-sm font-black tracking-[0.2em] uppercase">Directions</span>
                </button>
             )}
           </div>

           {/* Guestbook & Timer */}
           <div className="space-y-6 pt-6 border-t border-dashed" style={{ borderColor: `${contrastText}40` }}>
              <div className="w-full">
                 <span className="text-[10px] tracking-[0.3em] uppercase font-black opacity-60 block mb-3">T-Minus</span>
                 {renderTimer()}
              </div>
              <div className="w-full">
                 {renderGuestBook()}
              </div>
           </div>
           
        </div>
      </div>
      
    </div>
  );
}
