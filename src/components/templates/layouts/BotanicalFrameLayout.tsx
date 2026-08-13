'use client';
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Navigation, Info } from 'lucide-react';
import { backgroundDesignRegistry } from '@/lib/registries';
import CountdownTimer from '../../CountdownTimer';

interface LayoutProps {
  cardSurfaceStyle?: React.CSSProperties;
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

export default function BotanicalFrameLayout({ wedding,
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
, selectedBackground, cardSurfaceStyle }: LayoutProps) {
  const brideInitial = wedding.bride_name ? wedding.bride_name.trim().charAt(0) : 'E';
  const groomInitial = wedding.groom_name ? wedding.groom_name.trim().charAt(0) : '';

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isEventPassed, setIsEventPassed] = useState(false);

  useEffect(() => {
    if (!wedding.wedding_date) return;

    const calculateTimeLeft = () => {
      const difference = +new Date(wedding.wedding_date) - +new Date();
      if (difference <= 0) {
        setIsEventPassed(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [wedding.wedding_date]);

  const getGoogleCalendarLink = () => {
    if (!wedding.wedding_date) return '#';
    const startDate = new Date(wedding.wedding_date);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
    const formatCalendarDate = (date: Date) => date.toISOString().replace(/-|:|\.\d\d\d/g, "");
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle + ': ' + wedding.bride_name + ' & ' + wedding.groom_name)}&dates=${formatCalendarDate(startDate)}/${formatCalendarDate(endDate)}&details=${encodeURIComponent(wedding.custom_message || '')}&location=${encodeURIComponent(wedding.venue_name || '')}`;
  };

  const hasMaps = !!wedding.google_maps_url;
  const showRsvp = wedding.show_rsvp !== false;

  if (wedding?.template_id === 'fine-art-botanical-watercolor') {
    return (
      <div className="w-full min-h-screen bg-[#fcfbfa] flex flex-col items-center py-16 px-6 font-serif relative overflow-hidden" style={{ ...(selectedBackground?.background ? { background: selectedBackground.background } : {}), color: textColor }}>
        
        {/* Kağıt Dokusu Katmanı */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply" 
             style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />

        {/* Ana Katmanlı Yüzey */}
        <div className="w-full max-w-4xl relative z-10">
          
          {/* Arkadaki Suluboya / Botanik Süs Katmanı - once sadece
              bulanik renk lekeleri vardi, description'in vaat ettigi
              "el cizimi cicek celenkleri" hissi hic yoktu. Gercek bir
              cicek fotografiyla, kose/kenar cerceve olarak. */}
          <div
            className="absolute -top-16 -left-16 w-72 h-72 rounded-full opacity-[0.22] mix-blend-multiply pointer-events-none"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1496661415325-ef852f9e8e7c?q=80&w=800&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
          <div
            className="absolute -bottom-20 -right-16 w-80 h-80 rounded-full opacity-[0.22] mix-blend-multiply pointer-events-none"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1496661415325-ef852f9e8e7c?q=80&w=800&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center', transform: 'scaleX(-1)' }}
          />

          {/* İsim / Tarih Yüzeyi (Bağımsız Sanat Yüzeyi) */}
          <div className="w-full bg-white/60 backdrop-blur-md border border-emerald-900/10 p-12 md:p-24 shadow-[0_20px_50px_rgba(0,0,0,0.03)] relative mb-12">
            <div className="absolute top-8 left-8 w-12 h-12 border-t border-l border-emerald-800/30" />
            <div className="absolute bottom-8 right-8 w-12 h-12 border-b border-r border-emerald-800/30" />

            <div className="text-center">
              <span className="text-[10px] tracking-[0.3em] uppercase text-emerald-800/60 mb-6 block font-sans">
                {eventTitle}
              </span>
              
              <h1 className="text-5xl md:text-7xl font-light text-emerald-950 mb-4" style={{ fontFamily: `"${headingFont}", serif` }}>
                {wedding.bride_name}
              </h1>
              <div className="text-3xl font-light text-emerald-800/40 italic my-2">ve</div>
              <h1 className="text-5xl md:text-7xl font-light text-emerald-950 mb-12" style={{ fontFamily: `"${headingFont}", serif` }}>
                {wedding.groom_name}
              </h1>

              <div className="inline-block border-b border-emerald-900/20 pb-4 mb-4">
                <p className="text-xl md:text-2xl text-emerald-900 tracking-wide">{dateStr}</p>
                <p className="text-sm text-emerald-800/60 mt-2 font-sans">{timeStr}</p>
              </div>
            </div>
          </div>

          {/* İçerik ve Detay Yüzeyi */}
          <div className="w-full bg-white/40 border border-emerald-900/5 p-8 md:p-16 relative">
            <div className="max-w-xl mx-auto text-center flex flex-col items-center">
              
              <Info className="w-6 h-6 text-emerald-800/40 mb-6" />
              
              <div className="text-sm md:text-base leading-loose italic text-emerald-900/80 mb-12">
                {renderQuote()}
              </div>

              <div className="mb-12">
                <p className="text-[10px] tracking-[0.3em] uppercase text-emerald-800/60 mb-3 font-sans">Mekan</p>
                <p className="text-lg md:text-xl text-emerald-950">{wedding.venue_name}</p>
                {wedding.venue_address && <p className="text-xs text-emerald-800/60 mt-2 font-sans">{wedding.venue_address}</p>}
              </div>

              <div className="w-full mb-12">
                <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#064e3b" styleType="minimal" />
              </div>

              <div className="w-full flex flex-col md:flex-row gap-4 justify-center items-center font-sans">
                {hasMaps && (
                  <button onClick={handleMapClick} className="px-8 py-4 bg-emerald-900/5 hover:bg-emerald-900/10 text-emerald-950 text-xs tracking-[0.2em] uppercase transition-colors">
                    Haritaya Git
                  </button>
                )}
                <div className="w-full md:w-auto min-w-[200px]">
                  {renderRsvpButton()}
                </div>
                <div className="w-full md:w-auto min-w-[200px]">
                  {renderGuestBook()}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // 1. DOĞAL KAĞIT / BOTANİK DOKU VE ZEMİN
  const bgRegistry = backgroundDesignRegistry[wedding.background_design || 'fine-paper-texture'] || { fallbackColor: '#fcfdfa' };

  return (
    <div 
      className="max-w-[550px] mx-auto w-full my-8 relative z-10 animate-fade-in text-emerald-950"
      style={{ ...(selectedBackground?.background ? { background: selectedBackground.background } : {}), fontFamily: `"${bodyFont}", serif` }}
    >
      <div data-testid="invitation-card-surface invitation-content-surface hero-text-surface date-surface venue-surface countdown-surface action-surface" 
        className="relative rounded-[3.5rem] overflow-hidden shadow-[0_20px_50px_rgba(21,128,61,0.15)] p-6 sm:p-10 text-center border flex flex-col items-center justify-between min-h-[640px]"
        style={{ ...cardSurfaceStyle,  borderColor: `${primaryColor}25`, backgroundColor: bgRegistry.fallbackColor || cardBgColor, color: textColor }}
      >
        {/* İnce Keten/Kağıt Noise Doku */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(22,101,52,0.015)_1px,transparent_1px)] bg-[size:14px_14px] pointer-events-none z-0 opacity-60" />

        {/* KÖŞELERDE HAFİF SALLANAN YEŞİL YAPRAK DEKORASYONLARI */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none opacity-30">
          <div className="absolute -top-6 -left-6 text-6xl rotate-[-15deg] animate-pulse duration-[5000ms]">🌿</div>
          <div className="absolute -top-6 -right-6 text-6xl rotate-[75deg] scale-x-[-1] animate-pulse duration-[6000ms]">🌿</div>
          <div className="absolute -bottom-6 -left-6 text-6xl rotate-[195deg] animate-pulse duration-[4000ms]">🌿</div>
          <div className="absolute -bottom-6 -right-6 text-6xl rotate-[105deg] scale-y-[-1] animate-pulse duration-[5000ms]">🌿</div>
        </div>

        {/* Oval Çerçeve Çizgisi */}
        <div className="absolute inset-4 rounded-[3.2rem] pointer-events-none z-0 border-2 border-dashed opacity-30" style={{ borderColor: primaryColor }} />

        {/* GÜVENLİ İÇERİK ALANI */}
        <div className="relative z-10 w-full flex flex-col items-center">
          
          {/* Çiçekli Mini Monogram Rozet */}
          <div className="flex flex-col items-center mb-6 select-none opacity-90">
            <div 
              className="w-12 h-12 rounded-full border border-dashed flex items-center justify-center font-serif text-sm font-semibold relative bg-emerald-50/50"
              style={{ borderColor: primaryColor }}
            >
              <span className="text-[10px] text-green-700/70 absolute -top-2">🌸</span>
              <span style={{ color: primaryColor }}>
                {groomInitial ? `${brideInitial}${groomInitial}` : brideInitial}
              </span>
            </div>
          </div>

          {/* Etkinlik Türü */}
          <h3 className="font-semibold tracking-[0.25em] uppercase text-[10px] mb-4 text-emerald-800">
            {eventTitle}
          </h3>

          {/* İsimler */}
          <div className="w-full mb-6">
            {wedding.bride_parents && (
              <p className="text-[9px] tracking-[0.2em] font-light mb-3 opacity-60 uppercase font-sans">
                {wedding.bride_parents}
              </p>
            )}
            <h1 className="text-3xl sm:text-4xl font-normal leading-tight" style={{ color: primaryColor, fontFamily: `"${headingFont}", serif` }}>
              {wedding.bride_name}
            </h1>
            <div className="my-1.5 text-xs opacity-50 font-sans tracking-widest uppercase">ve</div>
            <h1 className="text-3xl sm:text-4xl font-normal leading-tight" style={{ color: primaryColor, fontFamily: `"${headingFont}", serif` }}>
              {wedding.groom_name}
            </h1>
            {wedding.groom_parents && (
              <p className="text-[9px] tracking-[0.2em] font-light mt-3 opacity-60 uppercase font-sans">
                {wedding.groom_parents}
              </p>
            )}
          </div>

          {/* Davet Mesajı */}
          <div className="my-3 leading-relaxed text-sm max-w-sm italic opacity-90">
            {renderQuote()}
          </div>

          {/* DİKEY GERÇEK ZAMANLI SAYAÇ KUTULARI (Minimal/Ferah) */}
          {wedding.wedding_date && !isEventPassed && (
            <div className="flex justify-center items-center gap-2 sm:gap-3 my-6 font-sans select-none">
              <div className="flex flex-col items-center w-14 sm:w-16 py-2.5 rounded-2xl border border-emerald-900/10 bg-emerald-50/40 backdrop-blur-xs shadow-2xs">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-emerald-800">{timeLeft.days}</span>
                <span className="text-[9px] uppercase tracking-wider opacity-60 text-emerald-900">Gün</span>
              </div>
              <div className="flex flex-col items-center w-14 sm:w-16 py-2.5 rounded-2xl border border-emerald-900/10 bg-emerald-50/40 backdrop-blur-xs shadow-2xs">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-emerald-800">{timeLeft.hours}</span>
                <span className="text-[9px] uppercase tracking-wider opacity-60 text-emerald-900">Saat</span>
              </div>
              <div className="flex flex-col items-center w-14 sm:w-16 py-2.5 rounded-2xl border border-emerald-900/10 bg-emerald-50/40 backdrop-blur-xs shadow-2xs">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-emerald-800">{timeLeft.minutes}</span>
                <span className="text-[9px] uppercase tracking-wider opacity-60 text-emerald-900">Dk</span>
              </div>
              <div className="flex flex-col items-center w-14 sm:w-16 py-2.5 rounded-2xl border border-emerald-900/10 bg-emerald-50/40 backdrop-blur-xs shadow-2xs">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-emerald-800">{timeLeft.seconds}</span>
                <span className="text-[9px] uppercase tracking-wider opacity-60 text-emerald-900">Sn</span>
              </div>
            </div>
          )}

          {isEventPassed && (
            <div className="py-2 px-6 rounded-full border text-xs font-semibold my-6 border-emerald-900/10 text-emerald-800 bg-emerald-50/30">
              🎉 Etkinlik Tarihi Tamamlandı
            </div>
          )}

          {/* Tarih ve Adres */}
          <div className="w-full max-w-sm text-xs font-semibold my-6 space-y-2.5">
            <div className="flex items-center gap-3 py-2.5 px-4 rounded-xl border border-emerald-900/10 bg-emerald-50/20">
              <Calendar className="w-4 h-4 shrink-0 text-emerald-800" />
              <span>{dateStr} <span className="mx-1 opacity-40">|</span> {timeStr}</span>
            </div>

            <div className="flex flex-col items-start gap-1 p-4 rounded-xl border border-emerald-900/10 bg-emerald-50/20 text-left">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 shrink-0 text-emerald-800" />
                <span className="font-bold">{wedding.venue_name || 'Mekan Belirtilmedi'}</span>
              </div>
              {wedding.venue_address && (
                <p className="text-[11px] font-light opacity-80 pl-6 leading-relaxed">{wedding.venue_address}</p>
              )}
            </div>
          </div>

          {/* Oval Butonlar */}
          <div className="w-full max-w-sm flex flex-col gap-3 mt-4">
            {hasMaps && (
              <button 
                type="button"
                onClick={handleMapClick}
                className="w-full h-12 rounded-full border-2 flex items-center justify-between px-6 font-bold text-xs tracking-wider uppercase transition-all duration-300 hover:scale-102 active:scale-98 cursor-pointer focus-visible:ring-2 focus-visible:outline-none bg-emerald-550 border-emerald-700/20 text-emerald-800 hover:bg-emerald-50/20"
                style={{ borderColor: primaryColor }}
              >
                <div className="flex items-center gap-2.5">
                  <Navigation className="w-4 h-4 text-emerald-800" />
                  <span>KONUMA GİT</span>
                </div>
                <span>&rarr;</span>
              </button>
            )}

            {wedding.wedding_date && (
              <a 
                href={getGoogleCalendarLink()}
                target="_blank"
                rel="noreferrer"
                className="w-full h-12 rounded-full border-2 flex items-center justify-between px-6 font-bold text-xs tracking-wider uppercase transition-all duration-300 hover:scale-102 active:scale-98 cursor-pointer focus-visible:ring-2 focus-visible:outline-none bg-emerald-550 border-emerald-700/20 text-emerald-800 hover:bg-emerald-50/20"
                style={{ borderColor: primaryColor }}
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-emerald-800" />
                  <span>TAKVİME EKLE</span>
                </div>
                <span>&rarr;</span>
              </a>
            )}

            {showRsvp && renderRsvpButton()}
          </div>

          {/* Anı Defteri */}
          {renderGuestBook()}
        </div>
      </div>
    </div>
  );
}
