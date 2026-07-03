import { Sparkles, Calendar, MapPin, Navigation } from 'lucide-react';
import CountdownTimer from '../CountdownTimer';

interface TemplateProps {
  wedding: {
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

export default function Template1({ wedding }: TemplateProps) {
  const dateObj = wedding.wedding_date ? new Date(wedding.wedding_date) : new Date();
  const dateStr = dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  
  const eventTitle = wedding.event_type ? `${wedding.event_type} Töreni` : 'Düğün Töreni';
  
  // Dinamik Tasarım Değişkenleri
  const primaryColor = wedding.primary_color || '#f43f5e'; // Default Rose-500
  const fontFamilyClass = wedding.font_family === 'serif' ? 'font-serif' : wedding.font_family === 'mono' ? 'font-mono' : 'font-sans';
  const bgImageStyle = wedding.background_image_url ? { backgroundImage: `url(${wedding.background_image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {};

  return (
    <div 
      className={`min-h-screen flex flex-col items-center justify-center p-6 text-slate-800 ${fontFamilyClass} relative overflow-hidden`}
      style={{ ...bgImageStyle, backgroundColor: wedding.background_image_url ? 'transparent' : `${primaryColor}15` }}
    >
      {/* Koyu Overlay (Sadece arkaplan resmi varsa) */}
      {wedding.background_image_url && <div className="absolute inset-0 bg-black/40" />}

      {/* Arkaplan Süslemeleri (Eğer resim yoksa göster) */}
      {!wedding.background_image_url && (
        <>
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" style={{ backgroundColor: primaryColor }} />
          <div className="absolute -bottom-8 right-20 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000" style={{ backgroundColor: primaryColor }} />
        </>
      )}

      <div className="max-w-2xl w-full bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-10 text-center relative z-10 border border-white/50">
        <Sparkles className="w-8 h-8 mx-auto mb-6" style={{ color: primaryColor }} />
        
        <h3 className="font-medium tracking-widest uppercase mb-4 text-sm" style={{ color: primaryColor }}>
          {eventTitle}
        </h3>
        
        <h1 className="text-5xl md:text-7xl font-bold text-slate-800 mb-8 mt-4 leading-tight">
          {wedding.bride_name} <br/> <span className="text-3xl" style={{ color: primaryColor }}>&</span> <br/> {wedding.groom_name}
        </h1>
        
        {/* Özel Söz / Mesaj */}
        {wedding.custom_message && (
          <p className="text-lg text-slate-600 font-light italic mb-8 px-4 leading-relaxed">
            "{wedding.custom_message}"
          </p>
        )}
        
        {/* Geri Sayım Sayacı */}
        {wedding.wedding_date && (
          <CountdownTimer targetDate={wedding.wedding_date} />
        )}
        
        <div className="flex flex-col gap-5 text-lg font-medium text-slate-700 mb-10 mt-6">
          <div className="flex items-center justify-center gap-3 bg-white py-3 rounded-xl border shadow-sm" style={{ borderColor: `${primaryColor}30` }}>
            <Calendar className="w-5 h-5" style={{ color: primaryColor }} />
            <span>{dateStr} <span className="mx-2" style={{ color: `${primaryColor}70` }}>|</span> {timeStr}</span>
          </div>
          
          <div className="flex flex-col items-center justify-center gap-2 bg-white p-4 rounded-xl border shadow-sm" style={{ borderColor: `${primaryColor}30` }}>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5" style={{ color: primaryColor }} />
              <span className="font-bold">{wedding.venue_name || 'Mekan Belirtilmedi'}</span>
            </div>
            {wedding.venue_address && (
              <span className="text-sm text-slate-500 font-light px-8">{wedding.venue_address}</span>
            )}
            
            {wedding.google_maps_url && (
              <a 
                href={wedding.google_maps_url} 
                target="_blank" 
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-2 text-sm font-bold hover:underline"
                style={{ color: primaryColor }}
              >
                <Navigation className="w-4 h-4" />
                Haritada Gör
              </a>
            )}
          </div>
        </div>

        <button 
          className="w-full px-8 py-4 text-white rounded-xl font-bold text-lg shadow-lg hover:opacity-90 transition-all hover:-translate-y-1"
          style={{ backgroundColor: primaryColor, boxShadow: `0 10px 15px -3px ${primaryColor}40` }}
        >
          LCV Formunu Doldur
        </button>
      </div>
    </div>
  );
}
