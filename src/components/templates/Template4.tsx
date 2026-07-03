'use client';
import { Sparkles, Calendar, MapPin, Crown, Navigation } from 'lucide-react';
import { useState } from 'react';
import CountdownTimer from '../CountdownTimer';
import RsvpModal from '../RsvpModal';
import FloatingActionBar from '../FloatingActionBar';

interface TemplateProps {
  wedding: {
    id: string;
    bride_name: string;
    groom_name: string;
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

export default function Template4({ wedding }: TemplateProps) {
  const dateObj = wedding.wedding_date ? new Date(wedding.wedding_date) : new Date();
  const dateStr = dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  
  const eventTitle = wedding.event_type ? `${wedding.event_type} TÖRENİ` : 'DÜĞÜN TÖRENİ';
  
  const primaryColor = wedding.primary_color || '#d97706'; // default amber-600
  const fontFamilyClass = wedding.font_family === 'sans' ? 'font-sans' : wedding.font_family === 'mono' ? 'font-mono' : 'font-serif';
  const bgImageStyle = wedding.background_image_url ? { backgroundImage: `url(${wedding.background_image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {};
  
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);

  return (
    <div 
      className={`min-h-screen flex flex-col items-center justify-center p-6 pb-28 text-slate-900 ${fontFamilyClass} relative`}
      style={{ ...bgImageStyle, backgroundColor: wedding.background_image_url ? 'transparent' : '#ffffff' }}
    >
      {/* Beyaz Overlay (Arkaplan resmi varsa) */}
      {wedding.background_image_url && <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />}

      <div className="max-w-2xl w-full p-10 text-center relative z-10">
        <div 
          className="absolute inset-0 border-[1px] m-2 rounded-t-full pointer-events-none opacity-50" 
          style={{ borderColor: primaryColor }}
        />
        <div 
          className="absolute inset-0 border-[1px] m-4 rounded-t-full pointer-events-none" 
          style={{ borderColor: primaryColor }}
        />
        
        <Crown className="w-12 h-12 mx-auto mb-6 relative z-10" style={{ color: primaryColor }} />
        
        <h3 
          className="font-serif tracking-[0.4em] uppercase mb-6 text-sm relative z-10 font-bold"
          style={{ color: primaryColor }}
        >
          {eventTitle}
        </h3>
        
        <h1 className="text-5xl md:text-6xl text-slate-900 mb-8 relative z-10 uppercase tracking-widest leading-tight">
          {wedding.bride_name} <br/> 
          <span className="text-3xl py-2 inline-block" style={{ color: primaryColor }}>ile</span> 
          <br/> {wedding.groom_name}
        </h1>
        
        {wedding.custom_message && (
          <p className="text-lg text-slate-600 font-light italic mb-8 px-4 leading-relaxed relative z-10">
            "{wedding.custom_message}"
          </p>
        )}
        
        <div className="w-24 h-px mx-auto mb-8 relative z-10" style={{ backgroundColor: primaryColor }} />
        
        {wedding.wedding_date && (
          <div className="mb-8 relative z-10">
            <CountdownTimer targetDate={wedding.wedding_date} />
          </div>
        )}
        
        <div className="flex flex-col gap-6 text-lg mb-10 relative z-10">
          <div>
            <div className="text-sm tracking-widest uppercase mb-1 font-bold" style={{ color: primaryColor }}>Tarih</div>
            <div className="text-xl">{dateStr}</div>
            <div className="text-slate-500 text-base">{timeStr}</div>
          </div>
          <div>
            <div className="text-sm tracking-widest uppercase mb-1 font-bold" style={{ color: primaryColor }}>Mekan</div>
            <div className="text-xl font-bold">{wedding.venue_name || 'Mekan Belirtilmedi'}</div>
            {wedding.venue_address && (
              <div className="text-slate-500 text-base mt-1 px-8">{wedding.venue_address}</div>
            )}
            
            {wedding.google_maps_url && (
              <a 
                href={wedding.google_maps_url} 
                target="_blank" 
                rel="noreferrer"
                className="mt-3 inline-flex items-center justify-center gap-2 text-sm font-bold hover:underline transition-colors"
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
          className="w-full px-12 py-4 bg-slate-900 rounded-none tracking-widest uppercase hover:bg-slate-800 transition-colors relative z-10 border"
          style={{ color: primaryColor, borderColor: primaryColor }}
        >
          Katılım Bildirimi (LCV)
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
