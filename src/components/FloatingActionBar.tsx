'use client';
import { Heart, MapPin, Send } from 'lucide-react';

interface FloatingActionBarProps {
  onRsvpClick: () => void;
  googleMapsUrl?: string | null;
  primaryColor?: string;
}

export default function FloatingActionBar({ onRsvpClick, googleMapsUrl, primaryColor = '#f43f5e' }: FloatingActionBarProps) {
  // Yukarı kaydırma fonksiyonu (Hikayemiz)
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Harita fonksiyonu
  const handleMapClick = () => {
    if (googleMapsUrl) {
      window.open(googleMapsUrl, '_blank');
    } else {
      alert("Harita konumu henüz eklenmedi.");
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] w-[90%] max-w-sm">
      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-full border border-slate-200/50 flex items-center justify-between px-6 py-3">
        
        {/* Hikayemiz Butonu */}
        <button 
          onClick={scrollToTop}
          className="flex flex-col items-center gap-1 group transition-transform hover:scale-110 active:scale-95"
        >
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
            style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
          >
            <Heart className="w-5 h-5 group-hover:fill-current" />
          </div>
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Hikayemiz</span>
        </button>

        {/* Konum Butonu */}
        <button 
          onClick={handleMapClick}
          className="flex flex-col items-center gap-1 group transition-transform hover:scale-110 active:scale-95"
        >
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
            style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
          >
            <MapPin className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Konum</span>
        </button>

        {/* LCV Butonu */}
        <button 
          onClick={onRsvpClick}
          className="flex flex-col items-center gap-1 group transition-transform hover:scale-110 active:scale-95"
        >
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform"
            style={{ backgroundColor: primaryColor, color: '#ffffff', transform: 'translateY(-8px)' }}
          >
            <Send className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mt-[-6px]">LCV</span>
        </button>
        
      </div>
    </div>
  );
}
