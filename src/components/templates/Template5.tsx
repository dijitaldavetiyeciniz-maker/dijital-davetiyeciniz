'use client';
import { Calendar, MapPin, Navigation } from 'lucide-react';
import { useState } from 'react';
import CountdownTimer from '../CountdownTimer';
import RsvpModal from '../RsvpModal';
import FloatingActionBar from '../FloatingActionBar';
import { isColorLight } from '@/lib/colorUtils';

interface TemplateProps {
  wedding: any;
}

export default function Template5({ wedding }: TemplateProps) {
  const dateObj = wedding.wedding_date ? new Date(wedding.wedding_date) : new Date();
  const dateStr = dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  const eventTitle = wedding.event_type ? `${wedding.event_type}` : 'Düğün';
  
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  
  const primaryColor = wedding.primary_color || '#000000';
  const textColor = wedding.text_color || '#000000';
  const fontFamilyClass = wedding.font_family === 'serif' ? 'font-serif' : wedding.font_family === 'mono' ? 'font-mono' : 'font-sans';
  
  // Minimalist Asymmetric - Half image, Half text.
  // We need a solid background for the text side based on textColor.
  const textIsLight = isColorLight(textColor);
  const textSideBgColor = textIsLight ? '#111827' : '#ffffff';

  return (
    <div 
      className={`min-h-screen flex flex-col lg:flex-row ${fontFamilyClass} relative overflow-hidden`}
      style={{ backgroundColor: textSideBgColor, color: textColor }}
    >
      {/* Sol / Üst Taraf - Görsel */}
      {wedding.background_image_url ? (
        <div 
          className="w-full lg:w-1/2 h-[40vh] lg:h-screen bg-cover bg-center"
          style={{ backgroundImage: `url(${wedding.background_image_url})` }}
        />
      ) : (
        <div 
          className="w-full lg:w-1/2 h-[40vh] lg:h-screen flex items-center justify-center opacity-30"
          style={{ backgroundColor: primaryColor }}
        >
          <span className="tracking-widest uppercase text-sm">Görsel Yok</span>
        </div>
      )}

      {/* Sağ / Alt Taraf - İçerik */}
      <div className="w-full lg:w-1/2 min-h-[60vh] lg:h-screen overflow-y-auto pb-32 lg:pb-12 custom-scrollbar">
        <div className="max-w-xl mx-auto p-8 sm:p-16 lg:p-24 flex flex-col justify-center min-h-full">
          
          <div className="w-8 h-8 mb-12" style={{ backgroundColor: primaryColor }}></div>
          
          <h3 className="tracking-widest uppercase text-xs opacity-60 mb-4">
            {eventTitle}
          </h3>
          
          <h1 className="text-5xl sm:text-7xl font-bold leading-none mb-10 tracking-tight">
            <span className="block mb-2">{wedding.bride_name}</span>
            <span className="block opacity-30 text-3xl my-2">&</span>
            <span className="block">{wedding.groom_name}</span>
          </h1>

          {(wedding.bride_parents || wedding.groom_parents) && (
            <div className="flex flex-col gap-2 mb-12 opacity-70 text-sm tracking-wider">
              {wedding.bride_parents && <span>{wedding.bride_parents}</span>}
              {wedding.groom_parents && <span>{wedding.groom_parents}</span>}
            </div>
          )}
          
          {wedding.custom_message && (
            <p className="text-lg sm:text-2xl font-light italic mb-16 leading-relaxed opacity-90 border-l-2 pl-6" style={{ borderColor: primaryColor }}>
              "{wedding.custom_message}"
            </p>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 mb-16">
            <div>
              <h4 className="text-xs tracking-widest uppercase opacity-50 mb-4">Ne Zaman</h4>
              <div className="flex flex-col gap-1 text-lg">
                <span className="font-medium">{dateStr}</span>
                <span className="opacity-70">{timeStr}</span>
              </div>
            </div>
            
            <div>
              <h4 className="text-xs tracking-widest uppercase opacity-50 mb-4">Nerede</h4>
              <div className="flex flex-col gap-1 text-lg">
                <span className="font-medium">{wedding.venue_name || 'Mekan Belirtilmedi'}</span>
                {wedding.venue_address && <span className="text-sm opacity-70 mt-2">{wedding.venue_address}</span>}
                {wedding.google_maps_url && (
                  <a 
                    href={wedding.google_maps_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase mt-4 hover:opacity-70 transition-opacity"
                    style={{ color: primaryColor }}
                  >
                    <Navigation className="w-3 h-3" />
                    Haritada Gör
                  </a>
                )}
              </div>
            </div>
          </div>
          
          {wedding.wedding_date && (
            <div className="mb-16">
              <CountdownTimer targetDate={wedding.wedding_date} primaryColor={primaryColor} styleType="minimal" />
            </div>
          )}
          
          <button 
            onClick={() => setIsRsvpOpen(true)}
            className="w-full sm:w-auto px-12 py-5 uppercase tracking-widest text-xs font-bold transition-all hover:opacity-80"
            style={{ 
              backgroundColor: primaryColor, 
              color: textIsLight ? '#000' : '#fff'
            }}
          >
            LCV ONAYLA
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
