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

export default function Template9({ wedding }: TemplateProps) {
  const dateObj = wedding.wedding_date ? new Date(wedding.wedding_date) : new Date();
  const dateStr = dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  const eventTitle = wedding.event_type ? `${wedding.event_type}` : 'Düğün';
  
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  
  const primaryColor = wedding.primary_color || '#14b8a6';
  const textColor = wedding.text_color || '#000000';
  const fontFamilyClass = wedding.font_family === 'serif' ? 'font-serif' : wedding.font_family === 'mono' ? 'font-mono' : 'font-sans';
  
  const textIsLight = isColorLight(textColor);
  const bgColor = textIsLight ? '#171717' : '#f5f5f5';
  
  return (
    <div 
      className={`min-h-screen flex flex-col items-center p-6 sm:p-12 pb-32 ${fontFamilyClass} relative overflow-hidden`}
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      
      {/* Geometrik Arkaplan Şekilleri */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full mix-blend-multiply opacity-20 filter blur-3xl" style={{ backgroundColor: primaryColor }}></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] mix-blend-multiply opacity-20 filter blur-3xl" style={{ backgroundColor: primaryColor }}></div>

      <div className="max-w-4xl w-full relative z-10 flex flex-col md:flex-row gap-8 items-center mt-8">
        
        {/* Sol - Görsel Bloğu */}
        <div className="w-full md:w-1/2 relative">
          <div 
            className="absolute top-4 left-4 w-full h-full border-4"
            style={{ borderColor: primaryColor }}
          ></div>
          <div 
            className="relative w-full aspect-[4/5] bg-cover bg-center z-10 border-4 shadow-xl"
            style={{ 
              backgroundImage: wedding.background_image_url ? `url(${wedding.background_image_url})` : 'none', 
              backgroundColor: textIsLight ? '#262626' : '#e5e5e5',
              borderColor: bgColor
            }}
          >
            {!wedding.background_image_url && (
              <div className="w-full h-full flex items-center justify-center opacity-50 font-bold uppercase tracking-widest">
                Görsel Yok
              </div>
            )}
          </div>
        </div>

        {/* Sağ - Metin Bloğu */}
        <div className="w-full md:w-1/2 flex flex-col items-start p-4 md:pl-12">
          
          <div className="inline-block px-4 py-1 border-2 mb-6 font-bold uppercase tracking-widest text-xs" style={{ borderColor: primaryColor, color: primaryColor }}>
            {eventTitle}
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-black uppercase leading-[0.9] tracking-tighter mb-8 break-words">
            <span className="block">{wedding.bride_name}</span>
            <span className="block my-2" style={{ color: primaryColor }}>&</span>
            <span className="block">{wedding.groom_name}</span>
          </h1>
          
          {(wedding.bride_parents || wedding.groom_parents) && (
            <div className="flex flex-col gap-1 mb-8 opacity-70 text-sm font-semibold tracking-widest uppercase border-l-4 pl-4" style={{ borderColor: primaryColor }}>
              {wedding.bride_parents && <span>{wedding.bride_parents}</span>}
              {wedding.groom_parents && <span>{wedding.groom_parents}</span>}
            </div>
          )}
          
          {wedding.custom_message && (
            <div 
              className="p-6 mb-8 border-r-4 shadow-lg"
              style={{ backgroundColor: textIsLight ? '#262626' : '#ffffff', borderColor: primaryColor }}
            >
              <p className="text-lg font-medium italic">
                "{wedding.custom_message}"
              </p>
            </div>
          )}

        </div>
      </div>

      {/* Alt Bilgi Bölümü */}
      <div className="max-w-4xl w-full mt-16 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="border-4 p-8 flex flex-col" style={{ borderColor: textIsLight ? '#404040' : '#d4d4d4', backgroundColor: textIsLight ? '#171717' : '#f5f5f5' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2" style={{ backgroundColor: primaryColor, color: textIsLight ? '#000' : '#fff' }}>
              <Calendar className="w-6 h-6" />
            </div>
            <span className="font-bold uppercase tracking-widest text-sm">Zaman Çizelgesi</span>
          </div>
          
          <div className="text-3xl font-black mb-1">{dateStr}</div>
          <div className="text-xl opacity-70 font-bold mb-8">{timeStr}</div>
          
          {wedding.wedding_date && (
            <div className="mt-auto">
              <CountdownTimer targetDate={wedding.wedding_date} primaryColor={primaryColor} styleType="glass" />
            </div>
          )}
        </div>

        <div className="border-4 p-8 flex flex-col" style={{ borderColor: textIsLight ? '#404040' : '#d4d4d4', backgroundColor: textIsLight ? '#171717' : '#f5f5f5' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2" style={{ backgroundColor: primaryColor, color: textIsLight ? '#000' : '#fff' }}>
              <MapPin className="w-6 h-6" />
            </div>
            <span className="font-bold uppercase tracking-widest text-sm">Konum Bilgisi</span>
          </div>
          
          <div className="text-2xl font-black mb-4 uppercase">{wedding.venue_name || 'Mekan Belirtilmedi'}</div>
          {wedding.venue_address && (
            <div className="text-base opacity-80 font-medium mb-6 leading-relaxed">{wedding.venue_address}</div>
          )}
          
          <div className="mt-auto flex flex-col gap-4">
            {wedding.google_maps_url && (
              <a 
                href={wedding.google_maps_url} 
                target="_blank" 
                rel="noreferrer"
                className="w-full text-center py-4 border-2 font-bold uppercase tracking-widest text-sm transition-all hover:bg-black/5"
                style={{ borderColor: primaryColor, color: primaryColor }}
              >
                Yol Tarifi Al
              </a>
            )}
            
            <button 
              onClick={() => setIsRsvpOpen(true)}
              className="w-full text-center py-4 font-black uppercase tracking-widest text-sm transition-transform hover:translate-x-1 hover:-translate-y-1"
              style={{ backgroundColor: primaryColor, color: textIsLight ? '#000' : '#fff', boxShadow: `-6px 6px 0px ${textIsLight ? '#404040' : '#d4d4d4'}` }}
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
        styleType="neon" 
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
