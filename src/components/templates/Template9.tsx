'use client';
import { Calendar, MapPin, Navigation } from 'lucide-react';
import CountdownTimer from '../CountdownTimer';

interface TemplateProps {
  wedding: any;
}

export default function Template9({ wedding }: TemplateProps) {
  const dateObj = wedding.wedding_date ? new Date(wedding.wedding_date) : new Date();
  const dateStr = dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

  const primaryColor = wedding.primary_color || '#14b8a6'; // teal
  const fontFamilyClass = wedding.font_family === 'serif' ? 'font-serif' : wedding.font_family === 'mono' ? 'font-mono' : 'font-sans';
  const bgImageStyle = wedding.background_image_url ? { backgroundImage: `url(${wedding.background_image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {};

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 pb-28 text-slate-800 ${fontFamilyClass} relative`} style={{ backgroundColor: '#f1f5f9' }}>
      {wedding.background_image_url && <div className="absolute inset-0 opacity-20 grayscale" style={bgImageStyle} />}

      <div className="max-w-[420px] mx-auto w-full relative z-10 my-8">
        <div className="absolute top-4 left-4 w-full h-full" style={{ backgroundColor: primaryColor }}></div>
        <div className="bg-white p-8 sm:p-10 relative z-10 border-2 border-slate-900 shadow-xl">
          
          <div className="flex justify-between items-end mb-10 border-b-4 border-slate-900 pb-4">
            <h1 className="text-4xl font-black uppercase leading-none tracking-tighter text-slate-900">
              {wedding.bride_name} <br/> <span style={{ color: primaryColor }}>&</span> <br/> {wedding.groom_name}
            </h1>
          </div>

          {(wedding.bride_parents || wedding.groom_parents) && (
            <div className="grid grid-cols-2 gap-4 text-xs font-bold uppercase tracking-widest text-slate-500 mb-8">
              <div>{wedding.bride_parents}</div>
              <div className="text-right">{wedding.groom_parents}</div>
            </div>
          )}

          <p className="text-slate-700 mb-10 text-sm font-medium leading-relaxed border-l-4 pl-4" style={{ borderColor: primaryColor }}>
            {wedding.custom_message || 'Birlikte yeni bir hayata adım atarken sizleri de aramızda görmek istiyoruz.'}
          </p>
          
          {wedding.wedding_date && (
            <div className="mb-10 bg-slate-900 text-white p-4">
              <CountdownTimer targetDate={wedding.wedding_date} />
            </div>
          )}
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-slate-100 border border-slate-900">
                <Calendar className="w-5 h-5 text-slate-900" />
              </div>
              <div>
                <div className="font-black text-sm uppercase">{dateStr}</div>
                <div className="text-slate-500 font-bold">{timeStr}</div>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-2 bg-slate-100 border border-slate-900">
                <MapPin className="w-5 h-5 text-slate-900" />
              </div>
              <div>
                <div className="font-black text-sm uppercase">{wedding.venue_name || 'Mekan Belirtilmedi'}</div>
                <div className="text-slate-500 font-bold text-xs mt-1">{wedding.venue_address}</div>
                {wedding.google_maps_url && (
                  <a href={wedding.google_maps_url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs font-black uppercase hover:underline" style={{ color: primaryColor }}>
                    Haritada Gör ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
