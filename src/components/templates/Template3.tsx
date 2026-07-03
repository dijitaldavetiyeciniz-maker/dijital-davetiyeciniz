'use client';
import { Calendar, MapPin, Navigation } from 'lucide-react';
import { useState } from 'react';
import CountdownTimer from '../CountdownTimer';
import RsvpModal from '../RsvpModal';
import FloatingActionBar from '../FloatingActionBar';

interface TemplateProps {
  wedding: any;
}

export default function Template3({ wedding }: TemplateProps) {
  const dateObj = wedding.wedding_date ? new Date(wedding.wedding_date) : new Date();
  const dateStr = dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  const eventTitle = wedding.event_type ? `${wedding.event_type} Töreni` : 'Düğün Töreni';
  
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  
  const primaryColor = wedding.primary_color || '#7C8964';
  const textColor = wedding.text_color || '#2d3748';
  const fontFamilyClass = wedding.font_family === 'sans' ? 'font-sans' : wedding.font_family === 'mono' ? 'font-mono' : 'font-serif';
  
  // Magazine style uses a solid background for content.
  // The image is displayed as a hero header if it exists.
  // We'll calculate a light/dark bg based on text color to ensure contrast.
  // If text is dark (e.g. #000), background is paper white (#fafaf9).
  // If text is light (e.g. #fff), background is deep charcoal (#1c1917).
  const isTextLight = parseInt(textColor.replace('#',''), 16) > 0x888888;
  const paperBgColor = isTextLight ? '#1c1917' : '#fafaf9';

  return (
    <div 
      className={`min-h-screen flex flex-col items-center p-0 pb-32 ${fontFamilyClass} relative overflow-hidden`}
      style={{ backgroundColor: paperBgColor, color: textColor }}
    >
      {/* Hero Image Section */}
      {wedding.background_image_url && (
        <div className="w-full h-[50vh] md:h-[65vh] relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${wedding.background_image_url})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}

      {/* Magazine Content Section */}
      <div className={`w-full max-w-3xl px-6 sm:px-12 py-16 text-center ${wedding.background_image_url ? '-mt-24 relative z-10' : 'mt-12'}`}>
        <div 
          className="bg-inherit w-full rounded-tr-[4rem] rounded-bl-[4rem] p-8 md:p-16 border shadow-2xl"
          style={{ backgroundColor: paperBgColor, borderColor: `${primaryColor}30` }}
        >
          <div className="w-12 h-1 mx-auto mb-10" style={{ backgroundColor: primaryColor }}></div>
          
          <h3 className="tracking-[0.2em] uppercase text-xs sm:text-sm opacity-60 mb-6 font-semibold">
            {eventTitle}
          </h3>
          
          <h1 className="text-5xl md:text-7xl font-normal leading-tight mb-4">
            <div className="flex flex-col items-center">
              {wedding.bride_parents && <span className="text-xs tracking-widest opacity-50 mb-3 italic">{wedding.bride_parents}</span>}
              <span className="mb-2">{wedding.bride_name}</span>
            </div>
            <span className="text-3xl font-light italic my-4 block" style={{ color: primaryColor }}>ve</span>
            <div className="flex flex-col items-center">
              <span className="mt-2">{wedding.groom_name}</span>
              {wedding.groom_parents && <span className="text-xs tracking-widest opacity-50 mt-5 italic">{wedding.groom_parents}</span>}
            </div>
          </h1>

          <div className="w-12 h-1 mx-auto mt-10 mb-12" style={{ backgroundColor: primaryColor }}></div>
          
          {wedding.custom_message && (
            <p className="text-lg md:text-xl font-light italic mb-12 px-4 leading-relaxed opacity-80 border-l-4 border-r-4 py-4" style={{ borderColor: `${primaryColor}40` }}>
              {wedding.custom_message}
            </p>
          )}
          
          {wedding.wedding_date && (
            <div className="my-16 border-y py-12" style={{ borderColor: `${primaryColor}20` }}>
              <h4 className="text-xs uppercase tracking-widest opacity-60 mb-8">Zaman Çizelgesi</h4>
              <CountdownTimer targetDate={wedding.wedding_date} primaryColor={primaryColor} styleType="minimal" />
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-base font-light mb-12 mt-6 text-left">
            <div className="flex flex-col gap-3 p-6 rounded-2xl" style={{ backgroundColor: `${primaryColor}08` }}>
              <div className="flex items-center gap-3 border-b pb-4 mb-2" style={{ borderColor: `${primaryColor}20` }}>
                <Calendar className="w-5 h-5" style={{ color: primaryColor }} />
                <span className="font-semibold tracking-wider uppercase text-sm">Tarih & Saat</span>
              </div>
              <span className="text-lg">{dateStr}</span>
              <span className="opacity-70">{timeStr}</span>
            </div>
            
            <div className="flex flex-col gap-3 p-6 rounded-2xl" style={{ backgroundColor: `${primaryColor}08` }}>
              <div className="flex items-center gap-3 border-b pb-4 mb-2" style={{ borderColor: `${primaryColor}20` }}>
                <MapPin className="w-5 h-5" style={{ color: primaryColor }} />
                <span className="font-semibold tracking-wider uppercase text-sm">Konum</span>
              </div>
              <span className="text-lg">{wedding.venue_name || 'Mekan Belirtilmedi'}</span>
              
              {wedding.venue_address && (
                <span className="opacity-70 text-sm leading-relaxed">{wedding.venue_address}</span>
              )}
              
              {wedding.google_maps_url && (
                <a 
                  href={wedding.google_maps_url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider hover:underline"
                  style={{ color: primaryColor }}
                >
                  <Navigation className="w-4 h-4" />
                  Haritada Görüntüle
                </a>
              )}
            </div>
          </div>

          <button 
            onClick={() => setIsRsvpOpen(true)}
            className="px-12 py-4 rounded-full font-semibold tracking-widest uppercase text-sm transition-all hover:-translate-y-1"
            style={{ 
              backgroundColor: primaryColor, 
              color: isTextLight ? '#000' : '#fff',
              boxShadow: `0 10px 25px -5px ${primaryColor}60`
            }}
          >
            LCV Formunu Doldur
          </button>
        </div>
      </div>

      <FloatingActionBar 
        onRsvpClick={() => setIsRsvpOpen(true)} 
        googleMapsUrl={wedding.google_maps_url} 
        primaryColor={primaryColor}
        styleType="minimal" 
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
