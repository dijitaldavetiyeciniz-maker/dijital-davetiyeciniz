'use client';
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Navigation, Info, Heart } from 'lucide-react';

interface LayoutProps {
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

export default function BotanicalFrameLayout({
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
}: LayoutProps) {
  const brideInitial = wedding.bride_name ? wedding.bride_name.trim().charAt(0) : 'E';
  const groomInitial = wedding.groom_name ? wedding.groom_name.trim().charAt(0) : '';

  // 1. GERÇEK ZAMANLI DİKEY SAYAÇ HESAPLAMA
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

  // Takvime Ekle (Google Calendar Link Generator)
  const getGoogleCalendarLink = () => {
    if (!wedding.wedding_date) return '#';
    const startDate = new Date(wedding.wedding_date);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // Default: 2 hours event
    const formatCalendarDate = (date: Date) => date.toISOString().replace(/-|:|\.\d\d\d/g, "");
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle + ': ' + wedding.bride_name + ' & ' + wedding.groom_name)}&dates=${formatCalendarDate(startDate)}/${formatCalendarDate(endDate)}&details=${encodeURIComponent(wedding.custom_message || '')}&location=${encodeURIComponent(wedding.venue_name || '')}`;
  };

  const hasMaps = !!wedding.google_maps_url;
  const showRsvp = wedding.show_rsvp !== false;

  return (
    <div 
      className="max-w-[550px] mx-auto w-full my-8 relative z-10 animate-fade-in"
      style={{ fontFamily: `"${bodyFont}", serif` }}
    >
      <div 
        className="relative rounded-[2.5rem] overflow-hidden shadow-2xl p-6 sm:p-10 text-center border flex flex-col items-center justify-between min-h-[620px]"
        style={{ borderColor: `${primaryColor}20`, backgroundColor: cardBgColor, color: textColor }}
      >
        
        {/* KÖŞELERDE DEKORATİF BOTANİK YAPRAKLAR (pointer-events: none ile buton tıklamasını engellemez) */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none opacity-40">
          {/* Top Left Leaf */}
          <div className="absolute -top-6 -left-6 w-32 h-32 text-6xl rotate-[-15deg] motion-safe:animate-pulse">🌿</div>
          {/* Top Right Leaf */}
          <div className="absolute -top-6 -right-6 w-32 h-32 text-6xl rotate-[75deg] scale-x-[-1] motion-safe:animate-pulse">🌿</div>
          {/* Bottom Left Leaf */}
          <div className="absolute -bottom-6 -left-6 w-32 h-32 text-6xl rotate-[195deg] motion-safe:animate-pulse">🌿</div>
          {/* Bottom Right Leaf */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 text-6xl rotate-[105deg] scale-y-[-1] motion-safe:animate-pulse">🌿</div>
        </div>

        {/* İnce Şık Çerçeve (Yeşil veya Altın Varak Eşleşmesi) */}
        <div className="absolute inset-3 rounded-[2.2rem] pointer-events-none z-0 border opacity-40" style={{ borderColor: primaryColor }} />

        {/* GÜVENLİ İÇERİK ALANI (Tüm metinler z-10 katmanında toplanır) */}
        <div className="relative z-10 w-full flex flex-col items-center">
          
          {/* Çiçekli Mini Monogram Rozet */}
          <div className="flex flex-col items-center mb-6 select-none opacity-90">
            <div 
              className="w-11 h-11 rounded-full border border-dashed flex items-center justify-center font-serif text-sm font-semibold relative"
              style={{ borderColor: primaryColor, backgroundColor: 'rgba(0,0,0,0.02)' }}
            >
              <span className="text-[10px] text-green-700/70 absolute -top-2">🌸</span>
              <span style={{ color: primaryColor }}>
                {groomInitial ? `${brideInitial}${groomInitial}` : brideInitial}
              </span>
            </div>
          </div>

          {/* Etkinlik Türü */}
          <h3 className="font-semibold tracking-[0.25em] uppercase text-[10px] mb-4 opacity-75" style={{ color: primaryColor }}>
            {eventTitle}
          </h3>

          {/* İsimler */}
          <div className="w-full mb-6">
            {wedding.bride_parents && (
              <p className="text-[9px] tracking-[0.2em] font-light mb-3 opacity-60 uppercase font-sans">
                {wedding.bride_parents}
              </p>
            )}
            <h1 className="text-2xl sm:text-3xl font-normal leading-tight select-none" style={{ color: primaryColor, fontFamily: `"${headingFont}", serif` }}>
              {wedding.bride_name}
            </h1>
            <div className="my-1.5 text-xs opacity-40 font-sans tracking-widest uppercase">ve</div>
            <h1 className="text-2xl sm:text-3xl font-normal leading-tight select-none" style={{ color: primaryColor, fontFamily: `"${headingFont}", serif` }}>
              {wedding.groom_name}
            </h1>
            {wedding.groom_parents && (
              <p className="text-[9px] tracking-[0.2em] font-light mt-3 opacity-60 uppercase font-sans">
                {wedding.groom_parents}
              </p>
            )}
          </div>

          {/* Davet Sözü */}
          {renderQuote()}

          {/* DİKEY GERÇEK ZAMANLI SAYAÇ KUTULARI */}
          {wedding.wedding_date && !isEventPassed && (
            <div className="flex justify-center items-center gap-2 sm:gap-3 my-6 font-sans select-none">
              {/* Gün */}
              <div className="flex flex-col items-center w-14 sm:w-16 py-2.5 rounded-2xl border shadow-xs" style={{ borderColor: `${primaryColor}15`, backgroundColor: 'rgba(255,255,255,0.6)' }}>
                <span className="text-lg sm:text-xl font-bold tracking-tight" style={{ color: primaryColor }}>{timeLeft.days}</span>
                <span className="text-[9px] uppercase tracking-wider opacity-60">Gün</span>
              </div>
              {/* Saat */}
              <div className="flex flex-col items-center w-14 sm:w-16 py-2.5 rounded-2xl border shadow-xs" style={{ borderColor: `${primaryColor}15`, backgroundColor: 'rgba(255,255,255,0.6)' }}>
                <span className="text-lg sm:text-xl font-bold tracking-tight" style={{ color: primaryColor }}>{timeLeft.hours}</span>
                <span className="text-[9px] uppercase tracking-wider opacity-60">Saat</span>
              </div>
              {/* Dakika */}
              <div className="flex flex-col items-center w-14 sm:w-16 py-2.5 rounded-2xl border shadow-xs" style={{ borderColor: `${primaryColor}15`, backgroundColor: 'rgba(255,255,255,0.6)' }}>
                <span className="text-lg sm:text-xl font-bold tracking-tight" style={{ color: primaryColor }}>{timeLeft.minutes}</span>
                <span className="text-[9px] uppercase tracking-wider opacity-60">Dk</span>
              </div>
              {/* Saniye */}
              <div className="flex flex-col items-center w-14 sm:w-16 py-2.5 rounded-2xl border shadow-xs" style={{ borderColor: `${primaryColor}15`, backgroundColor: 'rgba(255,255,255,0.6)' }}>
                <span className="text-lg sm:text-xl font-bold tracking-tight" style={{ color: primaryColor }}>{timeLeft.seconds}</span>
                <span className="text-[9px] uppercase tracking-wider opacity-60">Sn</span>
              </div>
            </div>
          )}

          {isEventPassed && (
            <div className="py-2.5 px-6 rounded-full border text-xs font-semibold my-6" style={{ borderColor: `${primaryColor}15`, color: primaryColor, backgroundColor: 'rgba(0,0,0,0.02)' }}>
              🎉 Etkinlik Tarihi Tamamlandı
            </div>
          )}

          {/* Tarih ve Adres Bilgileri */}
          <div className="w-full max-w-sm text-xs font-semibold my-6 space-y-2.5">
            <div className="flex items-center gap-3 py-2.5 px-4 rounded-xl border bg-black/5" style={{ borderColor: `${primaryColor}15` }}>
              <Calendar className="w-4 h-4 shrink-0" style={{ color: primaryColor }} />
              <span>{dateStr} <span className="mx-1 opacity-40">|</span> {timeStr}</span>
            </div>

            <div className="flex flex-col items-start gap-1 p-4 rounded-xl border bg-black/5 text-left" style={{ borderColor: `${primaryColor}15` }}>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 shrink-0" style={{ color: primaryColor }} />
                <span className="font-bold">{wedding.venue_name || 'Mekan Belirtilmedi'}</span>
              </div>
              {wedding.venue_address && (
                <p className="text-[11px] font-light opacity-80 pl-6 leading-relaxed">{wedding.venue_address}</p>
              )}
            </div>
          </div>

          {/* DOKUNMATİK UYUMLU OVAL AKSİYON BUTONLARI (MIN 48PX) */}
          <div className="w-full max-w-sm flex flex-col gap-3 font-sans mt-4">
            
            {/* Buton 1: KONUMA GİT */}
            {hasMaps && (
              <button 
                type="button"
                onClick={handleMapClick}
                className="w-full h-12 rounded-full border flex items-center justify-between px-6 font-bold text-xs tracking-wider uppercase transition-all duration-300 hover:scale-102 active:scale-98 cursor-pointer focus-visible:ring-2 focus-visible:outline-none"
                style={{ 
                  borderColor: `${primaryColor}30`, 
                  color: primaryColor,
                  backgroundColor: 'rgba(255, 255, 255, 0.5)'
                }}
              >
                <div className="flex items-center gap-2.5">
                  <Navigation className="w-4 h-4" />
                  <span>KONUMA GİT</span>
                </div>
                <span>&rarr;</span>
              </button>
            )}

            {/* Buton 2: TAKVİME EKLE */}
            {wedding.wedding_date && (
              <a 
                href={getGoogleCalendarLink()}
                target="_blank"
                rel="noreferrer"
                className="w-full h-12 rounded-full border flex items-center justify-between px-6 font-bold text-xs tracking-wider uppercase transition-all duration-300 hover:scale-102 active:scale-98 cursor-pointer focus-visible:ring-2 focus-visible:outline-none"
                style={{ 
                  borderColor: `${primaryColor}30`, 
                  color: primaryColor,
                  backgroundColor: 'rgba(255, 255, 255, 0.5)'
                }}
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4" />
                  <span>TAKVİME EKLE</span>
                </div>
                <span>&rarr;</span>
              </a>
            )}

            {/* Buton 3: HEDİYE BİLGİLERİ (İsteğe bağlı, eğer banka iban bilgisi verilmişse) */}
            {wedding.bank_iban && (
              <div 
                className="w-full p-4 rounded-3xl border text-left text-[11px] leading-relaxed bg-amber-500/5"
                style={{ borderColor: `${primaryColor}15` }}
              >
                <div className="flex items-center gap-2 font-bold mb-1" style={{ color: primaryColor }}>
                  <Info className="w-3.5 h-3.5" />
                  <span>HEDİYE & IBAN BİLGİLERİ</span>
                </div>
                <p className="opacity-90">{wedding.bank_iban}</p>
              </div>
            )}

            {/* Buton 4: KATILIM ANKETİ / LCV BİLDİRİMİ */}
            {showRsvp && renderRsvpButton()}
          </div>

          {/* Anı Defteri */}
          {renderGuestBook()}
        </div>
      </div>
    </div>
  );
}
