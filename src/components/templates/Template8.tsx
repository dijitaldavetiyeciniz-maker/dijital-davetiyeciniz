'use client';
import { Calendar, MapPin, Navigation } from 'lucide-react';
import CountdownTimer from '../CountdownTimer';

interface TemplateProps {
  wedding: any;
}

export default function Template8({ wedding }: TemplateProps) {
  const dateObj = wedding.wedding_date ? new Date(wedding.wedding_date) : new Date();
  const dateStr = dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

  const primaryColor = wedding.primary_color || '#d4af37'; // gold
  const fontFamilyClass = wedding.font_family === 'serif' ? 'font-serif' : wedding.font_family === 'mono' ? 'font-mono' : 'font-sans';
  const bgImageStyle = wedding.background_image_url ? { backgroundImage: `url(${wedding.background_image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {};

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 pb-28 bg-[#111] text-white ${fontFamilyClass} relative`}>
      {wedding.background_image_url && <div className="absolute inset-0 opacity-40" style={bgImageStyle} />}

      <div 
        className="max-w-[420px] mx-auto w-full bg-[#1a1a1a]/95 backdrop-blur-md shadow-2xl p-2 text-center relative z-10 my-8 rounded-sm"
        style={{ border: `1px solid ${primaryColor}` }}
      >
        <div className="border border-dashed p-8" style={{ borderColor: primaryColor + '80' }}>
          <h1 className="text-4xl font-normal mb-8 flex flex-col gap-2 items-center tracking-widest" style={{ color: primaryColor }}>
            {wedding.bride_parents && <span className="text-[10px] tracking-widest text-white/50 uppercase">{wedding.bride_parents}</span>}
            <span>{wedding.bride_name}</span>
            <span className="text-xl text-white/30 font-light italic">&</span>
            <span>{wedding.groom_name}</span>
            {wedding.groom_parents && <span className="text-[10px] tracking-widest text-white/50 uppercase mt-2">{wedding.groom_parents}</span>}
          </h1>

          <div className="w-12 h-px mx-auto mb-6" style={{ backgroundColor: primaryColor }}></div>

          <p className="text-white/70 mb-8 text-sm font-light leading-relaxed px-2">
            {wedding.custom_message || 'Hayatımızı birleştirdiğimiz bu özel günümüzde sizleri de aramızda görmekten onur duyarız.'}
          </p>
          
          {wedding.wedding_date && (
            <div className="mb-8 p-4 rounded bg-white/5" style={{ border: `1px solid ${primaryColor}30` }}>
              <CountdownTimer targetDate={wedding.wedding_date} />
            </div>
          )}
          
          <div className="space-y-6 text-sm font-light">
            <div className="flex flex-col items-center gap-2">
              <Calendar className="w-5 h-5" style={{ color: primaryColor }} />
              <div className="tracking-widest uppercase">{dateStr}</div>
              <div className="text-white/50">{timeStr}</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <MapPin className="w-5 h-5" style={{ color: primaryColor }} />
              <div className="tracking-widest uppercase">{wedding.venue_name || 'Mekan Belirtilmedi'}</div>
              <div className="text-white/50">{wedding.venue_address}</div>
              {wedding.google_maps_url && (
                <a href={wedding.google_maps_url} target="_blank" rel="noreferrer" className="mt-2 text-xs uppercase tracking-widest hover:underline flex items-center gap-2" style={{ color: primaryColor }}>
                  <Navigation className="w-3 h-3" /> Haritaya Git
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
