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

export default function Template7({ wedding }: TemplateProps) {
  const dateObj = wedding.wedding_date ? new Date(wedding.wedding_date) : new Date();
  const dateStr = dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  
  const primaryColor = wedding.primary_color || '#3b82f6';
  const textColor = wedding.text_color || '#1e293b';
  // Vintage often looks good with a serif or handwritten style.
  const fontFamilyClass = wedding.font_family === 'serif' ? 'font-serif' : wedding.font_family === 'mono' ? 'font-mono' : 'font-sans';
  
  // Background texture is solid or a subtle pattern with primaryColor.
  const textIsLight = isColorLight(textColor);
  
  // Polaroid card is always white-ish or dark-ish based on text color for contrast
  const polaroidBg = textIsLight ? '#1e293b' : '#ffffff';

  return (
    <div 
      className={`min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 pb-32 ${fontFamilyClass} relative overflow-hidden`}
      style={{ backgroundColor: `${primaryColor}15`, color: textColor }}
    >
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-20" style={{ 
        backgroundImage: `radial-gradient(circle at center, ${primaryColor} 0%, transparent 70%)` 
      }}></div>

      <div 
        className="max-w-lg w-full relative z-10 shadow-2xl p-4 sm:p-6 pb-12 rotate-[-2deg] transition-transform hover:rotate-0"
        style={{ backgroundColor: polaroidBg }}
      >
        {/* Fotoğraf Alanı */}
        {wedding.background_image_url ? (
          <div 
            className="w-full h-80 sm:h-[400px] bg-cover bg-center mb-8"
            style={{ backgroundImage: `url(${wedding.background_image_url})`, backgroundColor: '#e2e8f0' }}
          ></div>
        ) : (
          <div 
            className="w-full h-80 sm:h-[400px] flex items-center justify-center mb-8"
            style={{ backgroundColor: '#e2e8f0' }}
          >
            <span className="opacity-50 text-slate-800">Görsel Yok</span>
          </div>
        )}

        {/* Polaroid Alt Metin Alanı */}
        <div className="text-center px-4">
          <h1 className="text-4xl sm:text-6xl font-bold mb-4">
            {wedding.bride_name} & {wedding.groom_name}
          </h1>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-sm opacity-80 mb-6">
            <span>{dateStr}</span>
            <span className="hidden sm:inline">•</span>
            <span>{timeStr}</span>
          </div>
          
          {wedding.custom_message && (
            <p className="text-lg font-light italic mb-8 opacity-90">
              "{wedding.custom_message}"
            </p>
          )}

          <div className="w-full border-t border-dashed my-8" style={{ borderColor: `${primaryColor}40` }}></div>
          
          <div className="flex flex-col items-center gap-2 mb-8">
            <MapPin className="w-6 h-6 mb-2" style={{ color: primaryColor }} />
            <span className="font-bold text-lg">{wedding.venue_name || 'Mekan Belirtilmedi'}</span>
            {wedding.venue_address && (
              <span className="opacity-70 text-sm mt-1">{wedding.venue_address}</span>
            )}
            
            {wedding.google_maps_url && (
              <a 
                href={wedding.google_maps_url} 
                target="_blank" 
                rel="noreferrer"
                className="mt-4 flex items-center gap-2 text-xs uppercase tracking-widest font-bold underline"
                style={{ color: primaryColor }}
              >
                <Navigation className="w-3 h-3" />
                Haritaya Git
              </a>
            )}
          </div>
          
          {wedding.wedding_date && (
            <div className="my-8">
              <CountdownTimer targetDate={wedding.wedding_date} primaryColor={primaryColor} styleType="minimal" />
            </div>
          )}

          <button 
            onClick={() => setIsRsvpOpen(true)}
            className="w-full py-4 uppercase tracking-widest text-sm font-bold border-2 transition-all hover:bg-black/5"
            style={{ borderColor: primaryColor, color: primaryColor }}
          >
            Davete Cevap Ver
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
