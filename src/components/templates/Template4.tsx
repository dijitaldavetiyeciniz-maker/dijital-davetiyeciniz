'use client';
import { Calendar, MapPin, Navigation, Crown } from 'lucide-react';
import { useState } from 'react';
import SparklesEffect from '../effects/SparklesEffect';
import CountdownTimer from '../CountdownTimer';
import RsvpModal from '../RsvpModal';
import FloatingActionBar from '../FloatingActionBar';
import { isColorLight } from '@/lib/colorUtils';

interface TemplateProps {
  wedding: any;
}

export default function Template4({ wedding }: TemplateProps) {
  const dateObj = wedding.wedding_date ? new Date(wedding.wedding_date) : new Date();
  const dateStr = dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  const eventTitle = wedding.event_type ? `${wedding.event_type} Töreni` : 'Düğün Töreni';
  
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  
  const primaryColor = wedding.primary_color || '#d4af37';
  const textColor = wedding.text_color || '#1e293b';
  const fontFamilyClass = wedding.font_family === 'sans' ? 'font-sans' : wedding.font_family === 'mono' ? 'font-mono' : 'font-serif';
  const bgImageStyle = wedding.background_image_url ? { backgroundImage: `url(${wedding.background_image_url})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' } : {};

  const textIsLight = isColorLight(textColor);
  const innerBgColor = textIsLight ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.95)';

  return (
    <div 
      className={`min-h-screen flex items-center justify-center p-4 sm:p-8 pb-32 ${fontFamilyClass} relative overflow-hidden`}
      style={{ ...bgImageStyle, backgroundColor: wedding.background_image_url ? 'transparent' : `${primaryColor}20`, color: textColor }}
    >
      <SparklesEffect color={primaryColor} />

      {/* Dış Çerçeve */}
      <div 
        className="w-full max-w-2xl min-h-[90vh] relative z-10 rounded-sm p-2 sm:p-3 shadow-2xl backdrop-blur-sm"
        style={{ backgroundColor: innerBgColor }}
      >
        {/* İç Çift Çerçeve */}
        <div 
          className="w-full h-full border p-1 rounded-sm"
          style={{ borderColor: primaryColor }}
        >
          <div 
            className="w-full h-full border-2 border-dashed rounded-sm px-6 py-16 sm:px-12 flex flex-col items-center justify-center text-center relative"
            style={{ borderColor: `${primaryColor}80` }}
          >
            {/* Köşe Süsleri */}
            <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2" style={{ borderColor: primaryColor }}></div>
            <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2" style={{ borderColor: primaryColor }}></div>
            <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2" style={{ borderColor: primaryColor }}></div>
            <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2" style={{ borderColor: primaryColor }}></div>

            <Crown className="w-12 h-12 mb-8" style={{ color: primaryColor }} />
            
            <h3 className="tracking-[0.4em] uppercase text-xs opacity-80 mb-8 font-light">
              {eventTitle}
            </h3>
            
            <h1 className="text-4xl sm:text-6xl font-normal leading-relaxed mb-6">
              <div className="flex flex-col items-center">
                {wedding.bride_parents && <span className="text-xs sm:text-sm tracking-widest opacity-60 mb-2">{wedding.bride_parents}</span>}
                <span className="italic">{wedding.bride_name}</span>
              </div>
              <div className="my-6 w-16 h-px mx-auto" style={{ backgroundColor: primaryColor }}></div>
              <div className="flex flex-col items-center">
                <span className="italic">{wedding.groom_name}</span>
                {wedding.groom_parents && <span className="text-xs sm:text-sm tracking-widest opacity-60 mt-2">{wedding.groom_parents}</span>}
              </div>
            </h1>
            
            {wedding.custom_message && (
              <p className="text-sm sm:text-base font-light italic mt-8 px-4 opacity-90 max-w-sm mx-auto leading-loose">
                {wedding.custom_message}
              </p>
            )}
            
            {wedding.wedding_date && (
              <div className="mt-12 w-full">
                <CountdownTimer targetDate={wedding.wedding_date} primaryColor={primaryColor} styleType="elegant" />
              </div>
            )}
            
            <div className="flex flex-col w-full gap-6 text-sm font-light mt-16 max-w-sm">
              <div className="flex flex-col items-center justify-center p-4 border" style={{ borderColor: `${primaryColor}40` }}>
                <Calendar className="w-5 h-5 mb-3" style={{ color: primaryColor }} />
                <span className="tracking-widest uppercase mb-1">{dateStr}</span>
                <span className="opacity-70">{timeStr}</span>
              </div>
              
              <div className="flex flex-col items-center justify-center p-4 border" style={{ borderColor: `${primaryColor}40` }}>
                <MapPin className="w-5 h-5 mb-3" style={{ color: primaryColor }} />
                <span className="font-bold tracking-widest uppercase mb-2 text-center">{wedding.venue_name || 'Mekan Belirtilmedi'}</span>
                {wedding.venue_address && (
                  <span className="opacity-70 text-center px-4 mb-4 leading-relaxed">{wedding.venue_address}</span>
                )}
                
                {wedding.google_maps_url && (
                  <a 
                    href={wedding.google_maps_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase hover:opacity-70 transition-opacity"
                    style={{ color: primaryColor }}
                  >
                    <Navigation className="w-3 h-3" />
                    Yol Tarifi Al
                  </a>
                )}
              </div>
            </div>

            <button 
              onClick={() => setIsRsvpOpen(true)}
              className="mt-12 px-10 py-3 uppercase tracking-widest text-xs font-semibold border-2 transition-all hover:bg-white/10"
              style={{ 
                borderColor: primaryColor, 
                color: primaryColor,
                backgroundColor: 'transparent'
              }}
            >
              LCV Gönder
            </button>
          </div>
        </div>
      </div>

      <FloatingActionBar 
        onRsvpClick={() => setIsRsvpOpen(true)} 
        googleMapsUrl={wedding.google_maps_url} 
        primaryColor={primaryColor}
        styleType="pill" 
      />

      <RsvpModal 
        weddingId={wedding.id} 
        isOpen={isRsvpOpen} 
        onClose={() => setIsRsvpOpen(false)} 
        primaryColor={primaryColor} 
      />
    </div>
  );
}
