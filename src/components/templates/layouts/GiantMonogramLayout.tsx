'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Calendar, MapPin } from 'lucide-react';
import { backgroundDesignRegistry } from '@/lib/registries';

interface LayoutProps {
  selectedBackground?: any;
  wedding: any;
  primaryColor: string;
  textColor: string;
  headingFont: string;
  bodyFont: string;
  accentFont: string;
  dateObj: Date;
  dateStr: string;
  timeStr: string;
  eventTitle: string;
  renderTimer: () => React.ReactNode;
  renderRsvpButton: () => React.ReactNode;
  renderGuestBook: () => React.ReactNode;
  renderQuote: () => React.ReactNode;
  handleMapClick: () => void;
  cardBgColor?: string;
  mode?: 'preview' | 'public';
}

export default function GiantMonogramLayout({
  wedding,
  primaryColor,
  textColor,
  headingFont,
  bodyFont,
  accentFont,
  dateObj,
  dateStr,
  timeStr,
  eventTitle,
  renderTimer,
  renderRsvpButton,
  renderGuestBook,
  renderQuote,
  handleMapClick,
  cardBgColor = '#ffffff',
  mode = 'public'
, selectedBackground}: LayoutProps) {
  const dateDay = String(dateObj.getDate()).padStart(2, '0');
  const dateMonth = String(dateObj.getMonth() + 1).padStart(2, '0');
  const dateYear = String(dateObj.getFullYear()).substring(2);

  const brideInitial = wedding.bride_name ? wedding.bride_name.trim().charAt(0) : 'E';
  const groomInitial = wedding.groom_name ? wedding.groom_name.trim().charAt(0) : '';

  const audioUrl = wedding.music_url || '';
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioUrl) {
      audioRef.current = new Audio(audioUrl);
      const audio = audioRef.current;
      
      const onLoadedMetadata = () => setDuration(audio.duration);
      const onTimeUpdate = () => setCurrentTime(audio.currentTime);
      const onEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };

      audio.addEventListener('loadedmetadata', onLoadedMetadata);
      audio.addEventListener('timeupdate', onTimeUpdate);
      audio.addEventListener('ended', onEnded);

      return () => {
        audio.pause();
        audio.removeEventListener('loadedmetadata', onLoadedMetadata);
        audio.removeEventListener('timeupdate', onTimeUpdate);
        audio.removeEventListener('ended', onEnded);
      };
    }
  }, [audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(e => console.log("Audio play blocked: ", e));
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const newTime = Number(e.target.value);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const bgRegistry = backgroundDesignRegistry[wedding.background_design || 'parchment-paper'] || { fallbackColor: '#fafafa' };

  return (
    <div 
      className="max-w-[550px] mx-auto w-full my-8 relative z-10 animate-fade-in"
      style={{ ...(selectedBackground?.background ? { background: selectedBackground.background } : {}), fontFamily: `"${bodyFont}", serif`, color: textColor || '#1e293b' }}
    >
      <div 
        data-testid="invitation-card-surface"
        className="relative rounded-[2.2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-6 sm:p-12 text-center border flex flex-col items-center justify-between min-h-[620px]"
        style={{ borderColor: `${primaryColor}20`, backgroundColor: cardBgColor || bgRegistry.fallbackColor, color: textColor || '#1e293b' }}
      >
        {/* PARALLAX MONOGRAM ALANI */}
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 opacity-[0.05] sm:opacity-[0.08]"
          style={{ color: primaryColor }}
        >
          <span className="text-[16rem] sm:text-[24rem] font-serif font-light leading-none tracking-tighter select-none">
            {groomInitial ? `${brideInitial}${groomInitial}` : brideInitial}
          </span>
        </div>

        {/* Dikey Tarih */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 hidden sm:flex flex-col items-center gap-1 z-10 font-serif opacity-70" style={{ color: primaryColor }}>
          <span className="text-sm font-bold">{dateDay}</span>
          <span className="w-6 h-[1.5px]" style={{ backgroundColor: primaryColor }} />
          <span className="text-xs uppercase tracking-widest">{dateObj.toLocaleDateString('tr-TR', { month: 'short' })}</span>
          <span className="w-6 h-[1.5px]" style={{ backgroundColor: primaryColor }} />
          <span className="text-sm font-bold">{dateYear}</span>
        </div>

        {/* Başlık */}
        <div className="relative z-10 mb-6">
          <h3 className="font-semibold tracking-[0.25em] uppercase text-xs" style={{ color: primaryColor }}>
            {eventTitle}
          </h3>
          <div className="w-12 h-[1.5px] mx-auto mt-3" style={{ backgroundColor: primaryColor }} />
        </div>

        {/* İsimler */}
        <div className="relative z-10 w-full mb-6">
          {wedding.bride_parents && (
            <p className="text-[9px] tracking-[0.2em] font-light mb-3 opacity-60 uppercase font-sans">
              {wedding.bride_parents}
            </p>
          )}
          
          <div className="flex flex-col items-center">
            <h1 className="text-3xl sm:text-4xl font-normal leading-tight" style={{ color: primaryColor, fontFamily: `"${headingFont}", serif` }}>
              {wedding.bride_name}
            </h1>
            
            {wedding.groom_name && (
              <>
                <span className="text-lg my-1 opacity-50 font-serif italic" style={{ fontFamily: `"${accentFont}", cursive` }}>&</span>
                <h1 className="text-3xl sm:text-4xl font-normal leading-tight" style={{ color: primaryColor, fontFamily: `"${headingFont}", serif` }}>
                  {wedding.groom_name}
                </h1>
              </>
            )}
          </div>

          {wedding.groom_parents && (
            <p className="text-[9px] tracking-[0.2em] font-light mt-3 opacity-60 uppercase font-sans">
              {wedding.groom_parents}
            </p>
          )}
        </div>

        {/* Davet Mesajı */}
        <div className="relative z-10 w-full max-w-sm leading-relaxed text-sm italic">
          {renderQuote()}
        </div>

        {/* Sayaç */}
        <div className="relative z-10 w-full my-4">
          {renderTimer()}
        </div>

        {/* Detay Kartları */}
        <div className="relative z-10 w-full max-w-sm space-y-3 text-xs my-6">
          <div className="flex items-center gap-3 py-3 px-4 rounded-2xl border bg-black/2" style={{ borderColor: `${primaryColor}15` }}>
            <Calendar className="w-4 h-4 shrink-0" style={{ color: primaryColor }} />
            <span className="font-semibold">{dateStr} | {timeStr}</span>
          </div>

          <div className="flex flex-col items-start gap-1 p-4 rounded-2xl border bg-black/2 text-left" style={{ borderColor: `${primaryColor}15` }}>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 shrink-0" style={{ color: primaryColor }} />
              <span className="font-bold">{wedding.venue_name || 'Mekan Belirtilmedi'}</span>
            </div>
            {wedding.venue_address && (
              <p className="text-[11px] font-light opacity-80 pl-6 leading-relaxed">{wedding.venue_address}</p>
            )}
          </div>
        </div>

        {/* SES OYNATICI MODÜLÜ */}
        {audioUrl && (
          <div 
            className="relative z-10 w-full max-w-xs border rounded-2xl p-3 flex flex-col gap-2 shadow-xs mb-8"
            style={{ borderColor: `${primaryColor}20`, backgroundColor: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(8px)' }}
          >
            <div className="flex items-center justify-between gap-3">
              <button 
                type="button"
                onClick={togglePlay}
                className="w-9 h-9 rounded-full flex items-center justify-center text-white shadow-md active:scale-90 transition-transform cursor-pointer"
                style={{ backgroundColor: primaryColor }}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 pl-0.5" />}
              </button>

              <div className="flex-1 text-left min-w-0">
                <span className="text-[9px] uppercase font-bold tracking-widest block opacity-70">DAVETİYE MÜZİĞİ</span>
                <span className="text-[10px] font-medium block truncate">{isPlaying ? 'Çalıyor...' : 'Müzik durdu'}</span>
              </div>

              <button 
                type="button"
                onClick={toggleMute}
                className="transition-colors"
                style={{ color: primaryColor }}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <span className="text-[9px] font-mono opacity-60">{formatTime(currentTime)}</span>
              <input 
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleProgressChange}
                className="flex-1 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                style={{ accentColor: primaryColor }}
              />
              <span className="text-[9px] font-mono opacity-60">{formatTime(duration)}</span>
            </div>
          </div>
        )}

        {/* RSVP */}
        <div className="relative z-10 w-full">
          {renderRsvpButton()}
        </div>

        {/* Anı Defteri */}
        <div className="relative z-10 w-full mt-6">
          {renderGuestBook()}
        </div>
      </div>
    </div>
  );
}
