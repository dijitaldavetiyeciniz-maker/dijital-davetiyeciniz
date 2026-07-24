'use client';
import React from 'react';
import { PlaneTakeoff, PlaneLanding, Plane, Calendar, MapPin, Navigation, Ticket, Map, QrCode } from 'lucide-react';
import { getReadableTextColor, WCAG_MIN_RATIO, checkTemplateContrast } from '@/lib/colorUtils';
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

export default function DestinationBoardingPassLayout({ wedding,
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
, selectedBackground, cardSurfaceStyle }: LayoutProps) {
  const overrides = wedding.custom_overrides || {};
  const focalX = overrides.photoFocalPoint?.x ?? wedding.photo_focal_point?.x ?? 50;
  const focalY = overrides.photoFocalPoint?.y ?? wedding.photo_focal_point?.y ?? 50;
  const objectPosition = `${focalX}% ${focalY}%`;

  const couplePhoto = wedding.bride_photo_url || wedding.groom_photo_url || wedding.background_image_url || '';
  
  const mainBg = cardBgColor || '#ffffff';
  const brandColor = primaryColor || '#2563eb';

  const hasMaps = !!wedding.google_maps_url;
  const showRsvp = wedding.show_rsvp !== false;

  const originCode = wedding.bride_name ? wedding.bride_name.substring(0, 3).toUpperCase() : 'BRD';
  const destCode = wedding.groom_name ? wedding.groom_name.substring(0, 3).toUpperCase() : 'GRM';

  return (
    <div 
      className="min-h-screen w-full relative flex items-center justify-center p-4 md:p-12 overflow-hidden"
      style={{ ...(selectedBackground?.background ? { background: selectedBackground.background } : {}), fontFamily: `"${bodyFont}", sans-serif`, color: textColor || '#1e293b' }}
      data-testid="layout-destination-boarding-pass"
    >
      {/* Background Map Pattern */}
      <div data-testid="invitation-card-surface" className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ ...cardSurfaceStyle, 
        backgroundImage: `radial-gradient(${brandColor} 2px, transparent 2px)`,
        backgroundSize: '30px 30px'
      }} />

      {/* Main Boarding Pass Container */}
      <div data-testid="invitation-card-surface" className="relative w-full max-w-[1100px] flex flex-col md:flex-row rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] bg-white z-10 overflow-hidden transform transition-all duration-700 hover:scale-[1.01]">
        
        {/* Left / Main Section */}
        <div className="flex-1 relative flex flex-col">
          {/* Top Header / Airline Brand */}
          <div className="h-16 md:h-20 w-full flex items-center justify-between px-6 md:px-10 text-white" style={{ backgroundColor: brandColor }}>
            <div className="flex items-center gap-3">
              <PlaneTakeoff className="w-6 h-6 md:w-8 md:h-8" />
              <span className="font-bold tracking-widest uppercase text-sm md:text-lg opacity-90">Love Airlines</span>
            </div>
            <div className="text-right">
              <p className="text-[10px] md:text-xs font-mono tracking-widest opacity-75 uppercase">First Class</p>
              <p className="font-bold tracking-widest text-sm md:text-base">{eventTitle}</p>
            </div>
          </div>

          <div className="flex-1 p-6 md:p-10 flex flex-col md:flex-row gap-8 relative">
            {/* Background Stamp */}
            <div className="absolute top-10 right-10 opacity-5 pointer-events-none transform rotate-12">
              <Map className="w-64 h-64" />
            </div>

            {/* Photo Section */}
            {couplePhoto && (
              <div className="w-full md:w-64 h-64 md:h-auto rounded-2xl overflow-hidden shrink-0 shadow-lg relative z-10 border-4 border-white">
                <SafeImage 
                  src={couplePhoto} 
                  alt="Couple"
                  className="w-full h-full object-cover"
                  style={{ objectPosition }}
                  isHero={true}
                />
              </div>
            )}

            {/* Flight Details */}
            <div className="flex-1 flex flex-col justify-center relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex-1 flex flex-col items-center">
                  <h2 className="text-4xl md:text-6xl font-black" style={{ fontFamily: `"${headingFont}", sans-serif`, color: textColor || '#1e293b' }}>{originCode}</h2>
                  <div className="w-16 h-[2px] bg-slate-200 mt-2 mb-4" />
                  <p className="text-xs tracking-widest uppercase opacity-60 font-bold" style={{ color: textColor || '#1e293b' }}>Origin</p>
                  <p className="text-sm md:text-base font-semibold" style={{ color: textColor || '#1e293b' }}>{wedding.bride_name}</p>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center relative">
                  <div className="w-full h-[2px] border-t-2 border-dashed border-slate-200 absolute top-1/2 -translate-y-1/2 z-0" />
                  <div className="bg-white px-4 relative z-10 text-slate-300">
                    <Plane className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: primaryColor }} />
                  </div>
                </div>

                <div className="flex-1 flex flex-col items-end text-right z-10">
                  <h2 className="text-4xl md:text-6xl font-black" style={{ fontFamily: `"${headingFont}", sans-serif`, color: textColor || '#1e293b' }}>{destCode}</h2>
                  <div className="w-16 h-[2px] bg-slate-200 mt-2 mb-4" />
                  <p className="text-xs tracking-widest uppercase opacity-60 font-bold" style={{ color: textColor || '#1e293b' }}>Destination</p>
                  <p className="text-sm md:text-base font-semibold" style={{ color: textColor || '#1e293b' }}>{wedding.groom_name}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-12 w-full max-w-md mx-auto text-center border-t border-b border-slate-100 py-6">
                <div>
                  <p className="text-[10px] tracking-widest uppercase opacity-50 font-bold mb-1" style={{ color: textColor || '#1e293b' }}>Date</p>
                  <p className="font-bold text-sm md:text-base" style={{ color: textColor || '#1e293b' }}>{dateStr}</p>
                </div>
                <div className="border-l border-r border-slate-100">
                  <p className="text-[10px] tracking-widest uppercase opacity-50 font-bold mb-1" style={{ color: textColor || '#1e293b' }}>Boarding Time</p>
                  <p className="font-bold text-sm md:text-base" style={{ color: textColor || '#1e293b' }}>{timeStr}</p>
                </div>
                <div>
                  <p className="text-[10px] tracking-widest uppercase opacity-50 font-bold mb-1" style={{ color: textColor || '#1e293b' }}>Gate / Venue</p>
                  <p className="font-bold text-sm md:text-base truncate" style={{ color: textColor || '#1e293b' }}>{wedding.venue_name || 'TBD'}</p>
                </div>
              </div>

              {/* Quote & RSVP */}
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                <div className="flex-1 text-sm italic text-slate-500 border-l-4 pl-4" style={{ borderLeftColor: brandColor }}>
                  {renderQuote()}
                </div>
                {showRsvp && (
                  <div className="shrink-0 w-full md:w-auto">
                    {renderRsvpButton()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Perforated Line (Dashed separator) */}
        <div className="hidden md:flex flex-col items-center justify-center relative w-8">
          <div className="absolute top-0 bottom-0 w-[2px] bg-transparent border-l-2 border-dashed border-slate-300" />
          <div className="w-8 h-8 rounded-full bg-[#f0f4f8] absolute -top-4 shadow-inner" />
          <div className="w-8 h-8 rounded-full bg-[#f0f4f8] absolute -bottom-4 shadow-inner" />
        </div>
        
        {/* Mobile Perforated Line */}
        <div className="md:hidden flex items-center justify-center relative h-8 w-full">
          <div className="absolute left-0 right-0 h-[2px] bg-transparent border-t-2 border-dashed border-slate-300" />
          <div className="w-8 h-8 rounded-full bg-[#f0f4f8] absolute -left-4 shadow-inner" />
          <div className="w-8 h-8 rounded-full bg-[#f0f4f8] absolute -right-4 shadow-inner" />
        </div>

        {/* Right / Stub Section */}
        <div className="w-full md:w-80 bg-slate-50 flex flex-col relative">
          <div className="h-16 md:h-20 w-full flex items-center justify-center px-6" style={{ backgroundColor: brandColor }}>
            <span className="font-bold tracking-widest uppercase text-white opacity-90 text-sm md:text-base">Boarding Pass</span>
          </div>
          
          <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-black text-slate-800" style={{ fontFamily: `"${headingFont}", sans-serif` }}>
                  {wedding.bride_name} & {wedding.groom_name}
                </h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm font-medium text-slate-700 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                  <Calendar className="w-4 h-4" style={{ color: brandColor }} />
                  <span>{dateStr}</span>
                </div>
                <div className="flex items-start gap-3 text-sm font-medium text-slate-700 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: brandColor }} />
                  <div className="flex flex-col gap-1">
                    <span>{wedding.venue_name || 'Location TBA'}</span>
                    {wedding.venue_address && (
                      <span className="text-xs text-slate-500 font-normal">{wedding.venue_address}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              {hasMaps && (
                <button 
                  onClick={handleMapClick}
                  className="w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-bold text-white transition-all hover:opacity-90 shadow-md mb-6"
                  style={{ backgroundColor: brandColor }}
                >
                  <Navigation className="w-4 h-4" />
                  GET DIRECTIONS
                </button>
              )}

              <div className="flex flex-col items-center space-y-2">
                <QrCode className="w-24 h-24 text-slate-800" />
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-mono">Scan for details</p>
              </div>
            </div>
            
            <div className="mt-6">
              {renderTimer()}
            </div>
          </div>
        </div>

      </div>

      {/* Render Guestbook below if available */}
      <div className="absolute top-[200vh] invisible pointer-events-none">
        {/* We place it off-screen or inside a modal normally. In a full bleed layout, we can stack it below or use it. Let's put it as a separate block at bottom. */}
      </div>
      
      <div className="relative z-10 w-full max-w-[1100px] mt-8">
        {renderGuestBook()}
      </div>
    </div>
  );
}
