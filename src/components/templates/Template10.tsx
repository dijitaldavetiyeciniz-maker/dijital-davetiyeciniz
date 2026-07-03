'use client';
import { Calendar, MapPin, Navigation, Feather } from 'lucide-react';
import { useState } from 'react';
import SparklesEffect from '../effects/SparklesEffect';
import CountdownTimer from '../CountdownTimer';
import RsvpModal from '../RsvpModal';
import FloatingActionBar from '../FloatingActionBar';
import { isColorLight } from '@/lib/colorUtils';

interface TemplateProps {
  wedding: any;
}

export default function Template10({ wedding }: TemplateProps) {
  const dateObj = wedding.wedding_date ? new Date(wedding.wedding_date) : new Date();
  const dateStr = dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  const eventTitle = wedding.event_type ? `${wedding.event_type} Daveti` : 'Düğün Daveti';
  
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  
  const primaryColor = wedding.primary_color || '#8c2633'; // Burgonya Kırmızı varsayılan
  const textColor = wedding.text_color || '#333333';
  const fontFamilyClass = wedding.font_family === 'sans' ? 'font-sans' : wedding.font_family === 'mono' ? 'font-mono' : 'font-serif';
  
  const textIsLight = isColorLight(textColor);
  const paperBgColor = textIsLight ? '#1c1917' : '#fefce8'; // Koyu parşömen veya açık krem parşömen

  return (
    <div 
      className={`min-h-screen flex items-center justify-center p-4 sm:p-8 pb-32 ${fontFamilyClass} relative overflow-hidden`}
      style={{ backgroundColor: paperBgColor, color: textColor }}
    >
      {/* Hafif Kağıt Dokusu veya Resim */}
      {wedding.background_image_url ? (
        <div className="absolute inset-0 opacity-10 bg-cover bg-center" style={{ backgroundImage: `url(${wedding.background_image_url})` }}></div>
      ) : (
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]"></div>
      )}
      
      <SparklesEffect color={primaryColor} />

      <div className="max-w-2xl w-full relative z-10 text-center flex flex-col items-center">
        
        {/* Kraliyet / Mektup Başlığı */}
        <div className="w-full flex justify-center mb-8 relative">
          <div className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2" style={{ backgroundColor: `${primaryColor}40` }}></div>
          <div className="px-6 py-2 border-2 relative z-10 flex items-center gap-3" style={{ backgroundColor: paperBgColor, borderColor: primaryColor }}>
            <Feather className="w-5 h-5" style={{ color: primaryColor }} />
            <span className="uppercase tracking-widest text-xs font-semibold">{eventTitle}</span>
            <Feather className="w-5 h-5 scale-x-[-1]" style={{ color: primaryColor }} />
          </div>
        </div>
        
        <h1 className="text-6xl sm:text-7xl font-normal my-10 leading-[1.2] px-4">
          <span className="block italic">{wedding.bride_name}</span>
          <span className="block text-2xl my-4 opacity-50">&</span>
          <span className="block italic">{wedding.groom_name}</span>
        </h1>
        
        {(wedding.bride_parents || wedding.groom_parents) && (
          <div className="flex flex-col gap-4 text-sm opacity-80 italic max-w-sm mx-auto mb-12 border-b pb-8" style={{ borderColor: `${primaryColor}30` }}>
            <p>Aileleri</p>
            <div className="flex justify-between font-medium">
              <span>{wedding.bride_parents}</span>
              <span>{wedding.groom_parents}</span>
            </div>
            <p className="text-xs mt-4">Sizleri bu mutlu günlerinde yanlarında görmekten onur duyarlar.</p>
          </div>
        )}
        
        {wedding.custom_message && (
          <p className="text-lg sm:text-xl font-light italic leading-loose px-8 mb-16 max-w-lg mx-auto">
            {wedding.custom_message}
          </p>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 w-full mt-8 border-t pt-12" style={{ borderColor: `${primaryColor}30` }}>
          <div className="flex flex-col items-center">
            <Calendar className="w-8 h-8 mb-4 opacity-70" style={{ color: primaryColor }} />
            <span className="text-2xl mb-2">{dateStr}</span>
            <span className="text-lg opacity-70 italic">{timeStr}</span>
          </div>
          
          <div className="flex flex-col items-center">
            <MapPin className="w-8 h-8 mb-4 opacity-70" style={{ color: primaryColor }} />
            <span className="text-xl mb-3 leading-relaxed max-w-[200px]">{wedding.venue_name || 'Mekan Belirtilmedi'}</span>
            {wedding.venue_address && (
              <span className="text-sm opacity-60 italic mb-4 max-w-[200px]">{wedding.venue_address}</span>
            )}
            
            {wedding.google_maps_url && (
              <a 
                href={wedding.google_maps_url} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold pb-1 border-b"
                style={{ color: primaryColor, borderColor: primaryColor }}
              >
                <Navigation className="w-3 h-3" />
                Yol Tarifi
              </a>
            )}
          </div>
        </div>
        
        {wedding.wedding_date && (
          <div className="mt-20 mb-8 w-full border-t border-b py-10" style={{ borderColor: `${primaryColor}20` }}>
            <CountdownTimer targetDate={wedding.wedding_date} primaryColor={primaryColor} styleType="elegant" />
          </div>
        )}

        <button 
          onClick={() => setIsRsvpOpen(true)}
          className="mt-12 px-16 py-4 uppercase tracking-[0.2em] text-xs font-bold transition-all hover:-translate-y-1"
          style={{ 
            backgroundColor: primaryColor, 
            color: textIsLight ? '#000' : '#fff',
            boxShadow: `0 15px 30px -10px ${primaryColor}80` 
          }}
        >
          Mühürle & Yanıtla
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
