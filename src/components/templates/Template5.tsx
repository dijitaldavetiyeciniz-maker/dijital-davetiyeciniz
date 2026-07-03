'use client';
import { Calendar, MapPin, ArrowRight, Navigation } from 'lucide-react';
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

export default function Template5({ wedding }: TemplateProps) {
  const dateObj = wedding.wedding_date ? new Date(wedding.wedding_date) : new Date();
  const dateStr = dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

  const primaryColor = wedding.primary_color || '#000000'; // default black
  const fontFamilyClass = wedding.font_family === 'serif' ? 'font-serif' : wedding.font_family === 'mono' ? 'font-mono' : 'font-sans';
  const bgImageStyle = wedding.background_image_url ? { backgroundImage: `url(${wedding.background_image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {};

  const [isRsvpOpen, setIsRsvpOpen] = useState(false);

  return (
    <div 
      className={`min-h-screen flex flex-col justify-center p-6 pb-28 text-zinc-900 ${fontFamilyClass} relative`}
      style={{ ...bgImageStyle, backgroundColor: wedding.background_image_url ? 'transparent' : '#fafafa' }} // zinc-50
    >
      {/* Hafif Açık Overlay (Eğer resim varsa) */}
      {wedding.background_image_url && <div className="absolute inset-0 bg-white/70 backdrop-blur-md" />}

      <div className="max-w-[420px] mx-auto w-full flex flex-col items-center gap-8 relative z-10 bg-white/95 backdrop-blur shadow-2xl p-8 sm:p-10 rounded-2xl my-8 text-center">
        
        <div className="flex-1">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 flex flex-col items-center justify-center w-full gap-2" style={{ color: primaryColor }}>
            <div className="flex flex-col items-center gap-1">
              {wedding.bride_parents && <span className="text-xl md:text-3xl tracking-widest opacity-60 font-light block mb-2">{wedding.bride_parents}</span>}
              <span>{wedding.bride_name}</span>
            </div>
            <span className="text-slate-300 text-3xl my-2">&</span>
            <div className="flex flex-col items-center gap-1">
              <span>{wedding.groom_name}</span>
              {wedding.groom_parents && <span className="text-xl md:text-3xl tracking-widest opacity-60 font-light block mt-2">{wedding.groom_parents}</span>}
            </div>
          </h1>
          <p className="text-xl text-zinc-600 font-medium mb-10 max-w-sm">
            {wedding.custom_message || 'Hayatımızın en özel gününde sizleri de aramızda görmekten mutluluk duyarız.'}
          </p>
          
          {wedding.wedding_date && (
            <div className="mb-10 max-w-xs">
              <CountdownTimer targetDate={wedding.wedding_date} />
            </div>
          )}
          
          <div className="space-y-6 mb-12">
            <div className="flex flex-col items-center gap-2">
              <Calendar className="w-6 h-6 mt-1" style={{ color: primaryColor }} />
              <div>
                <div className="font-bold text-lg">{dateStr}</div>
                <div className="text-zinc-500">{timeStr}</div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <MapPin className="w-6 h-6 mt-1" style={{ color: primaryColor }} />
              <div>
                <div className="font-bold text-lg">{wedding.venue_name || 'Mekan Belirtilmedi'}</div>
                {wedding.venue_address && (
                  <div className="text-zinc-500">{wedding.venue_address}</div>
                )}
                {wedding.google_maps_url && (
                  <a 
                    href={wedding.google_maps_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-2 text-sm font-bold hover:underline transition-colors"
                    style={{ color: primaryColor }}
                  >
                    <Navigation className="w-4 h-4" />
                    Haritada Gör
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full text-white p-8 rounded-xl flex flex-col justify-center" style={{ backgroundColor: primaryColor }}>
          <h2 className="text-2xl font-bold mb-8">Sen de Gel.</h2>
          <p className="text-white/80 mb-8">
            Lütfen katılım durumunuzu aşağıdaki butona tıklayarak bize bildirin.
          </p>
          <button 
            onClick={() => setIsRsvpOpen(true)}
            className="flex items-center justify-between w-full p-4 bg-white font-bold hover:bg-zinc-100 transition-colors group"
            style={{ color: primaryColor }}
          >
            <span>LCV Formu</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>

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
