'use client';
import { Heart, MapPin, Send } from 'lucide-react';

interface FloatingActionBarProps {
  onRsvpClick: () => void;
  googleMapsUrl?: string | null;
  primaryColor?: string;
  styleType?: 'pill' | 'orbs' | 'neon' | 'minimal';
}

export default function FloatingActionBar({ 
  onRsvpClick, 
  googleMapsUrl, 
  primaryColor = '#f43f5e',
  styleType = 'pill'
}: FloatingActionBarProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMapClick = () => {
    if (googleMapsUrl) {
      window.open(googleMapsUrl, '_blank');
    } else {
      alert("Harita konumu henüz eklenmedi.");
    }
  };

  if (styleType === 'orbs') {
    return (
      <div className="fixed bottom-6 right-6 z-[90] flex flex-col gap-4 items-end">
        <button onClick={scrollToTop} className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center bg-white/90 backdrop-blur hover:scale-110 transition-transform group" style={{ color: primaryColor }}>
          <Heart className="w-5 h-5 group-hover:fill-current" />
        </button>
        <button onClick={handleMapClick} className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center bg-white/90 backdrop-blur hover:scale-110 transition-transform" style={{ color: primaryColor }}>
          <MapPin className="w-5 h-5" />
        </button>
        <button onClick={onRsvpClick} className="w-14 h-14 rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform" style={{ backgroundColor: primaryColor, color: '#fff' }}>
          <Send className="w-6 h-6" />
        </button>
      </div>
    );
  }

  if (styleType === 'neon') {
    return (
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[90] flex gap-6">
        <button onClick={scrollToTop} className="w-12 h-12 rounded-full border-2 bg-black/50 backdrop-blur flex items-center justify-center hover:scale-110 transition-transform" style={{ borderColor: primaryColor, color: primaryColor, boxShadow: `0 0 15px ${primaryColor}50` }}>
          <Heart className="w-5 h-5" />
        </button>
        <button onClick={handleMapClick} className="w-12 h-12 rounded-full border-2 bg-black/50 backdrop-blur flex items-center justify-center hover:scale-110 transition-transform" style={{ borderColor: primaryColor, color: primaryColor, boxShadow: `0 0 15px ${primaryColor}50` }}>
          <MapPin className="w-5 h-5" />
        </button>
        <button onClick={onRsvpClick} className="w-14 h-14 rounded-full flex items-center justify-center hover:scale-110 transition-transform animate-pulse" style={{ backgroundColor: primaryColor, color: '#fff', boxShadow: `0 0 20px ${primaryColor}` }}>
          <Send className="w-6 h-6 ml-1" />
        </button>
      </div>
    );
  }

  if (styleType === 'minimal') {
    return (
      <div className="fixed bottom-0 left-0 w-full z-[90] bg-white/95 backdrop-blur border-t border-slate-200">
        <div className="max-w-md mx-auto flex justify-around p-3">
          <button onClick={scrollToTop} className="flex flex-col items-center gap-1 opacity-70 hover:opacity-100 transition-opacity" style={{ color: primaryColor }}>
            <Heart className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Hikaye</span>
          </button>
          <button onClick={handleMapClick} className="flex flex-col items-center gap-1 opacity-70 hover:opacity-100 transition-opacity" style={{ color: primaryColor }}>
            <MapPin className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Harita</span>
          </button>
          <button onClick={onRsvpClick} className="flex flex-col items-center gap-1 opacity-100 hover:scale-105 transition-transform" style={{ color: primaryColor }}>
            <Send className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">LCV</span>
          </button>
        </div>
      </div>
    );
  }

  // Pill style (default)
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] w-[90%] max-w-sm">
      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-full border border-slate-200/50 flex items-center justify-between px-6 py-3">
        <button onClick={scrollToTop} className="flex flex-col items-center gap-1 group transition-transform hover:scale-110 active:scale-95">
          <div className="w-10 h-10 rounded-full flex items-center justify-center transition-colors" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
            <Heart className="w-5 h-5 group-hover:fill-current" />
          </div>
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Hikayemiz</span>
        </button>

        <button onClick={handleMapClick} className="flex flex-col items-center gap-1 group transition-transform hover:scale-110 active:scale-95">
          <div className="w-10 h-10 rounded-full flex items-center justify-center transition-colors" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
            <MapPin className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Konum</span>
        </button>

        <button onClick={onRsvpClick} className="flex flex-col items-center gap-1 group transition-transform hover:scale-110 active:scale-95">
          <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform" style={{ backgroundColor: primaryColor, color: '#ffffff', transform: 'translateY(-8px)' }}>
            <Send className="w-5 h-5 ml-1" />
          </div>
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mt-[-6px]">LCV</span>
        </button>
      </div>
    </div>
  );
}
