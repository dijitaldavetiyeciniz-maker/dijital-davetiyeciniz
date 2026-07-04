'use client';
import { useState } from 'react';
import { Heart, MapPin, Send, Camera, Loader2 } from 'lucide-react';

interface FloatingActionBarProps {
  onRsvpClick: () => void;
  googleMapsUrl?: string | null;
  primaryColor?: string;
  styleType?: 'pill' | 'orbs' | 'neon' | 'minimal';
  weddingId?: string;
  telegramConfigured?: boolean;
}

export default function FloatingActionBar({ 
  onRsvpClick, 
  googleMapsUrl, 
  primaryColor = '#f43f5e',
  styleType = 'pill',
  weddingId,
  telegramConfigured = false
}: FloatingActionBarProps) {
  const [isUploading, setIsUploading] = useState(false);

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

  const handleGuestPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    if (!weddingId || !telegramConfigured) {
      alert("Bu davetiye için fotoğraf paylaşım özelliği aktif değil.");
      return;
    }
    const file = e.target.files[0];
    setIsUploading(true);

    const formData = new FormData();
    formData.append('photo', file);
    formData.append('wedding_id', weddingId);

    try {
      const res = await fetch('/api/telegram/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        alert("Fotoğrafınız gelin ve damadın ortak albümüne başarıyla gönderildi! 📸❤️");
      } else {
        alert("Fotoğraf gönderilemedi: " + data.error);
      }
    } catch (err) {
      alert("Yükleme sırasında hata oluştu.");
    } finally {
      setIsUploading(false);
    }
  };

  // 1. STYLE: ORBS (Floating circular buttons at bottom center with labels)
  if (styleType === 'orbs') {
    return (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] flex items-end gap-5 bg-white/95 backdrop-blur-md px-6 py-3.5 rounded-[2rem] shadow-2xl border border-slate-200/50">
        <button onClick={scrollToTop} className="flex flex-col items-center gap-1.5 group hover:scale-105 active:scale-95 transition-all">
          <div className="w-12 h-12 rounded-full shadow-md flex items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors" style={{ color: primaryColor }}>
            <Heart className="w-5 h-5 group-hover:fill-current" />
          </div>
          <span className="text-[10px] font-bold text-slate-500 tracking-wider">Hikayemiz</span>
        </button>

        <button onClick={handleMapClick} className="flex flex-col items-center gap-1.5 group hover:scale-105 active:scale-95 transition-all">
          <div className="w-12 h-12 rounded-full shadow-md flex items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors" style={{ color: primaryColor }}>
            <MapPin className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold text-slate-500 tracking-wider">Konum</span>
        </button>

        {telegramConfigured && (
          <div className="flex flex-col items-center gap-1.5">
            <input 
              type="file" 
              accept="image/*" 
              id="orbs-photo-upload" 
              className="hidden" 
              onChange={handleGuestPhotoUpload} 
              disabled={isUploading}
            />
            <label htmlFor="orbs-photo-upload" className="flex flex-col items-center gap-1.5 group hover:scale-105 active:scale-95 transition-all cursor-pointer">
              <div className="w-12 h-12 rounded-full shadow-md flex items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors" style={{ color: primaryColor }}>
                {isUploading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Camera className="w-5 h-5" />
                )}
              </div>
              <span className="text-[10px] font-bold text-slate-500 tracking-wider">Foto Paylaş</span>
            </label>
          </div>
        )}

        <button onClick={onRsvpClick} className="flex flex-col items-center gap-1.5 group hover:scale-105 active:scale-95 transition-all">
          <div className="w-12 h-12 rounded-full shadow-md flex items-center justify-center transition-colors text-white" style={{ backgroundColor: primaryColor }}>
            <Send className="w-5 h-5 ml-0.5" />
          </div>
          <span className="text-[10px] font-bold text-slate-500 tracking-wider">Katılım Formu</span>
        </button>
      </div>
    );
  }

  // 2. STYLE: NEON (Black/Neon layout at bottom center with neon glow labels)
  if (styleType === 'neon') {
    return (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] flex items-end gap-5 bg-black/85 backdrop-blur-md px-6 py-3.5 rounded-[2rem] shadow-2xl border border-white/10" style={{ boxShadow: `0 10px 30px ${primaryColor}15` }}>
        <button onClick={scrollToTop} className="flex flex-col items-center gap-1.5 group hover:scale-105 active:scale-95 transition-all">
          <div className="w-12 h-12 rounded-full border-2 bg-black/50 backdrop-blur flex items-center justify-center transition-all" style={{ borderColor: primaryColor, color: primaryColor, boxShadow: `0 0 10px ${primaryColor}30` }}>
            <Heart className="w-5 h-5 group-hover:fill-current" />
          </div>
          <span className="text-[10px] font-bold text-slate-400 tracking-wider">Hikayemiz</span>
        </button>

        <button onClick={handleMapClick} className="flex flex-col items-center gap-1.5 group hover:scale-105 active:scale-95 transition-all">
          <div className="w-12 h-12 rounded-full border-2 bg-black/50 backdrop-blur flex items-center justify-center transition-all" style={{ borderColor: primaryColor, color: primaryColor, boxShadow: `0 0 10px ${primaryColor}30` }}>
            <MapPin className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold text-slate-400 tracking-wider">Konum</span>
        </button>

        {telegramConfigured && (
          <div className="flex flex-col items-center gap-1.5">
            <input 
              type="file" 
              accept="image/*" 
              id="neon-photo-upload" 
              className="hidden" 
              onChange={handleGuestPhotoUpload} 
              disabled={isUploading}
            />
            <label htmlFor="neon-photo-upload" className="flex flex-col items-center gap-1.5 group hover:scale-105 active:scale-95 transition-all cursor-pointer">
              <div className="w-12 h-12 rounded-full border-2 bg-black/50 backdrop-blur flex items-center justify-center transition-all" style={{ borderColor: primaryColor, color: primaryColor, boxShadow: `0 0 10px ${primaryColor}30` }}>
                {isUploading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Camera className="w-5 h-5" />
                )}
              </div>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider">Foto Paylaş</span>
            </label>
          </div>
        )}

        <button onClick={onRsvpClick} className="flex flex-col items-center gap-1.5 group hover:scale-105 active:scale-95 transition-all">
          <div className="w-12 h-12 rounded-full flex items-center justify-center transition-colors text-white" style={{ backgroundColor: primaryColor, boxShadow: `0 0 15px ${primaryColor}` }}>
            <Send className="w-5 h-5 ml-0.5" />
          </div>
          <span className="text-[10px] font-bold text-slate-400 tracking-wider">Katılım Formu</span>
        </button>
      </div>
    );
  }

  // 3. STYLE: MINIMAL (Full-width tab bar at bottom)
  if (styleType === 'minimal') {
    return (
      <div className="fixed bottom-0 left-0 w-full z-[90] bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <div className="max-w-md mx-auto flex justify-around p-3">
          <button onClick={scrollToTop} className="flex flex-col items-center gap-1 opacity-75 hover:opacity-100 transition-opacity" style={{ color: primaryColor }}>
            <Heart className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Hikayemiz</span>
          </button>
          
          <button onClick={handleMapClick} className="flex flex-col items-center gap-1 opacity-75 hover:opacity-100 transition-opacity" style={{ color: primaryColor }}>
            <MapPin className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Konum</span>
          </button>

          {telegramConfigured && (
            <div className="flex flex-col items-center">
              <input 
                type="file" 
                accept="image/*" 
                id="minimal-photo-upload" 
                className="hidden" 
                onChange={handleGuestPhotoUpload} 
                disabled={isUploading}
              />
              <label htmlFor="minimal-photo-upload" className="flex flex-col items-center gap-1 opacity-75 hover:opacity-100 transition-opacity cursor-pointer" style={{ color: primaryColor }}>
                {isUploading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Camera className="w-5 h-5" />
                )}
                <span className="text-[10px] font-bold uppercase tracking-widest">Foto Paylaş</span>
              </label>
            </div>
          )}

          <button onClick={onRsvpClick} className="flex flex-col items-center gap-1 opacity-100 hover:scale-105 transition-transform" style={{ color: primaryColor }}>
            <Send className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Katılım Formu</span>
          </button>
        </div>
      </div>
    );
  }

  // 4. STYLE: PILL (Default Pill container)
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] w-[90%] max-w-sm">
      <div className="bg-white/95 backdrop-blur-md shadow-2xl rounded-full border border-slate-200/50 flex items-center justify-between px-6 py-3">
        <button onClick={scrollToTop} className="flex flex-col items-center gap-1 group transition-transform hover:scale-105 active:scale-95">
          <div className="w-10 h-10 rounded-full flex items-center justify-center transition-colors" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
            <Heart className="w-5 h-5 group-hover:fill-current" />
          </div>
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Hikayemiz</span>
        </button>

        <button onClick={handleMapClick} className="flex flex-col items-center gap-1 group transition-transform hover:scale-105 active:scale-95">
          <div className="w-10 h-10 rounded-full flex items-center justify-center transition-colors" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
            <MapPin className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Konum</span>
        </button>

        {telegramConfigured && (
          <div className="flex flex-col items-center gap-1">
            <input 
              type="file" 
              accept="image/*" 
              id="pill-photo-upload" 
              className="hidden" 
              onChange={handleGuestPhotoUpload} 
              disabled={isUploading}
            />
            <label htmlFor="pill-photo-upload" className="flex flex-col items-center gap-1 group transition-transform hover:scale-105 active:scale-95 cursor-pointer">
              <div className="w-10 h-10 rounded-full flex items-center justify-center transition-colors" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
                {isUploading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Camera className="w-5 h-5" />
                )}
              </div>
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Foto Paylaş</span>
            </label>
          </div>
        )}

        <button onClick={onRsvpClick} className="flex flex-col items-center gap-1 group transition-transform hover:scale-105 active:scale-95">
          <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform text-white" style={{ backgroundColor: primaryColor, transform: 'translateY(-8px)' }}>
            <Send className="w-5 h-5 ml-0.5" />
          </div>
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mt-[-6px]">Katılım</span>
        </button>
      </div>
    </div>
  );
}
