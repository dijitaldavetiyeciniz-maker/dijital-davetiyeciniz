'use client';
import { Calendar, MapPin, Navigation } from 'lucide-react';
import { useState } from 'react';
import SparklesEffect from '../effects/SparklesEffect';
import CountdownTimer from '../CountdownTimer';
import RsvpModal from '../RsvpModal';
import FloatingActionBar from '../FloatingActionBar';
import { isColorLight } from '@/lib/colorUtils';

interface TemplateProps {
  wedding: any;
}

export default function Template8({ wedding }: TemplateProps) {
  const dateObj = wedding.wedding_date ? new Date(wedding.wedding_date) : new Date();
  const dateStr = dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  const eventTitle = wedding.event_type ? `${wedding.event_type}` : 'Davet';
  
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  
  const primaryColor = wedding.primary_color || '#d4af37';
  const textColor = wedding.text_color || '#ffffff';
  const fontFamilyClass = wedding.font_family === 'sans' ? 'font-sans' : wedding.font_family === 'mono' ? 'font-mono' : 'font-serif';
  
  const textIsLight = isColorLight(textColor);
  const bgColor = textIsLight ? '#0a0a0a' : '#f8f8f8';
  const bgImageStyle = wedding.background_image_url ? { backgroundImage: `url(${wedding.background_image_url})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' } : {};

  return (
    <div 
      className={`min-h-screen flex flex-col items-center justify-center p-6 pb-32 ${fontFamilyClass} relative overflow-hidden`}
      style={{ ...bgImageStyle, backgroundColor: wedding.background_image_url ? 'transparent' : bgColor, color: textColor }}
    >
      {wedding.background_image_url && <div className={`absolute inset-0 ${textIsLight ? 'bg-black/80' : 'bg-white/80'}`} />}
      <SparklesEffect color={primaryColor} />

      <div className="max-w-3xl w-full relative z-10 my-10 flex flex-col items-center text-center">
        
        {/* Lüks Varaklı İç Kart */}
        <div 
          className="w-full border-t-4 border-b-4 py-16 px-4 sm:px-12 relative"
          style={{ borderColor: primaryColor }}
        >
          {/* İnce iç çizgiler */}
          <div className="absolute top-2 left-0 right-0 border-t border-dashed opacity-50" style={{ borderColor: primaryColor }}></div>
          <div className="absolute bottom-2 left-0 right-0 border-b border-dashed opacity-50" style={{ borderColor: primaryColor }}></div>

          <div className="w-16 h-16 mx-auto mb-10 border-4 rotate-45 flex items-center justify-center" style={{ borderColor: primaryColor }}>
            <div className="w-12 h-12 border border-dashed" style={{ borderColor: primaryColor }}></div>
          </div>
          
          <h3 className="tracking-[0.5em] uppercase text-xs mb-8 opacity-80">
            {eventTitle}
          </h3>
          
          <h1 className="text-6xl sm:text-8xl font-normal leading-none mb-12">
            <span className="block italic">{wedding.bride_name}</span>
            <span className="block text-3xl my-6" style={{ color: primaryColor }}>&</span>
            <span className="block italic">{wedding.groom_name}</span>
          </h1>

          {(wedding.bride_parents || wedding.groom_parents) && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-16 mb-12 text-sm tracking-widest uppercase opacity-70">
              {wedding.bride_parents && <span>{wedding.bride_parents}</span>}
              {wedding.groom_parents && <span>{wedding.groom_parents}</span>}
            </div>
          )}
          
          {wedding.custom_message && (
            <div className="relative py-8 my-8">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px" style={{ backgroundColor: primaryColor }}></div>
              <p className="text-lg font-light leading-relaxed max-w-lg mx-auto opacity-90">
                {wedding.custom_message}
              </p>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-px" style={{ backgroundColor: primaryColor }}></div>
            </div>
          )}
          
          {wedding.wedding_date && (
            <div className="my-16">
              <CountdownTimer targetDate={wedding.wedding_date} primaryColor={primaryColor} styleType="elegant" />
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 mt-16 text-sm tracking-widest uppercase">
            <div className="flex flex-col items-center">
              <Calendar className="w-6 h-6 mb-4" style={{ color: primaryColor }} />
              <span className="font-bold mb-2">{dateStr}</span>
              <span className="opacity-70">{timeStr}</span>
            </div>
            
            <div className="flex flex-col items-center">
              <MapPin className="w-6 h-6 mb-4" style={{ color: primaryColor }} />
              <span className="font-bold mb-2">{wedding.venue_name || 'Mekan Belirtilmedi'}</span>
              {wedding.venue_address && (
                <span className="opacity-70 text-[10px] leading-relaxed max-w-[200px] mb-4">{wedding.venue_address}</span>
              )}
              
              {wedding.google_maps_url && (
                <a 
                  href={wedding.google_maps_url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold transition-opacity hover:opacity-70"
                  style={{ color: primaryColor }}
                >
                  <Navigation className="w-3 h-3" />
                  Konuma Git
                </a>
              )}
            </div>
          </div>
        </div>

        <button 
          onClick={() => setIsRsvpOpen(true)}
          className="mt-16 px-16 py-5 tracking-[0.3em] uppercase text-sm font-bold transition-all hover:bg-black/10"
          style={{ 
            border: `2px solid ${primaryColor}`, 
            color: textIsLight ? '#000' : '#fff',
            backgroundColor: primaryColor
          }}
        >
          Katılım Durumu
        </button>
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
