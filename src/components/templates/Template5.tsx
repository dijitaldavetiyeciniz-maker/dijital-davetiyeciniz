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

      <div className="max-w-4xl mx-auto w-full flex flex-col md:flex-row items-center gap-16 relative z-10">
        
        <div className="flex-1">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4" style={{ color: primaryColor }}>
            {wedding.bride_name}.<br/>
            {wedding.groom_name}.
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
            <div className="flex items-start gap-4">
              <Calendar className="w-6 h-6 mt-1" style={{ color: primaryColor }} />
              <div>
                <div className="font-bold text-lg">{dateStr}</div>
                <div className="text-zinc-500">{timeStr}</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
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

        <div className="w-full md:w-96 text-white p-10 flex flex-col justify-center" style={{ backgroundColor: primaryColor }}>
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
