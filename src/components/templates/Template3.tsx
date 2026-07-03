'use client';
import { Sparkles, Calendar, MapPin, Leaf, Navigation } from 'lucide-react';
import { useState } from 'react';
import CountdownTimer from '../CountdownTimer';
import RsvpModal from '../RsvpModal';
import FloatingActionBar from '../FloatingActionBar';

interface TemplateProps {
  wedding: {
    id: string;
    bride_name: string;
    groom_name: string;
    bride_parents: string | null;
    groom_parents: string | null;
    wedding_date: string | null;
    event_type: string | null;
    venue_name: string | null;
    venue_address: string | null;
    google_maps_url: string | null;
    custom_message: string | null;
    primary_color: string | null;
    font_family: string | null;
    background_image_url: string | null;
  };
}

export default function Template3({ wedding }: TemplateProps) {
  const dateObj = wedding.wedding_date ? new Date(wedding.wedding_date) : new Date();
  const dateStr = dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  
  const primaryColor = wedding.primary_color || '#7C8964'; // default olive green
  const fontFamilyClass = wedding.font_family === 'sans' ? 'font-sans' : wedding.font_family === 'mono' ? 'font-mono' : 'font-serif';
  const bgImageStyle = wedding.background_image_url ? { backgroundImage: `url(${wedding.background_image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {};
  
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);

  return (
    <div 
      className={`min-h-screen flex flex-col items-center justify-center p-6 pb-28 text-[#4A3B32] ${fontFamilyClass} relative`}
      style={{ ...bgImageStyle, backgroundColor: wedding.background_image_url ? 'transparent' : '#F4F1EA' }}
    >
      {/* Hafif Overlay (Eğer resim varsa) */}
      {wedding.background_image_url && <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" />}

      <div 
        className="max-w-2xl w-full bg-white/90 backdrop-blur-md shadow-xl p-10 text-center relative border-8 z-10"
        style={{ borderColor: `${primaryColor}30` }}
      >
        <Leaf className="w-10 h-10 mx-auto mb-6" style={{ color: primaryColor }} />
        
        <h3 className="italic mb-6 text-xl" style={{ color: primaryColor }}>
          {wedding.custom_message || 'Birlikte yeni bir hayata...'}
        </h3>
        
        <h1 className="text-6xl md:text-8xl text-[#4A3B32] mb-10 tracking-widest leading-tight">
          <div className="flex flex-col items-center">
            {wedding.bride_parents && <span className="text-sm md:text-xl tracking-widest opacity-80 font-light mb-2">{wedding.bride_parents}</span>}
            <span>{wedding.bride_name}</span>
          </div>
          <span className="text-3xl my-2 mx-auto block text-center" style={{ color: primaryColor }}>&</span>
          <div className="flex flex-col items-center">
            <span>{wedding.groom_name}</span>
            {wedding.groom_parents && <span className="text-sm md:text-xl tracking-widest opacity-80 font-light mt-2">{wedding.groom_parents}</span>}
          </div>
        </h1>
        
        {wedding.wedding_date && (
          <div className="mb-10">
            <CountdownTimer targetDate={wedding.wedding_date} />
          </div>
        )}
        
        <div className="flex flex-col gap-5 text-lg mb-12">
          <div className="flex items-center justify-center gap-2">
            <Calendar className="w-5 h-5 text-[#8D7B68]" />
            <span>{dateStr} - {timeStr}</span>
          </div>
          
          <div className="flex flex-col items-center justify-center gap-1">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#8D7B68]" />
              <span className="font-bold">{wedding.venue_name || 'Mekan Belirtilmedi'}</span>
            </div>
            {wedding.venue_address && (
              <span className="text-sm text-[#8D7B68] px-8 mt-1">{wedding.venue_address}</span>
            )}
            
            {wedding.google_maps_url && (
              <a 
                href={wedding.google_maps_url} 
                target="_blank" 
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-sm font-bold hover:underline transition-colors"
                style={{ color: primaryColor }}
              >
                <Navigation className="w-4 h-4" />
                Haritada Gör
              </a>
            )}
          </div>
        </div>

        <button 
          onClick={() => setIsRsvpOpen(true)}
          className="w-full px-10 py-4 text-white rounded-none text-lg transition-colors border-2 hover:bg-opacity-90"
          style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
        >
          Davete Yanıt Ver (LCV)
        </button>
      </div>

      <FloatingActionBar 
        onRsvpClick={() => setIsRsvpOpen(true)} 
        googleMapsUrl={wedding.google_maps_url} 
        primaryColor={primaryColor} 
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
