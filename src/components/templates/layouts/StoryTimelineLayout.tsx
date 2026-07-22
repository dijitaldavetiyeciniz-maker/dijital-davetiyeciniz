'use client';
import React from 'react';
import { Calendar, MapPin, Navigation, Heart, Star, Sparkles, Map } from 'lucide-react';

interface TimelineItem {
  id: string;
  date?: string;
  title: string;
  description?: string;
  imageUrl?: string;
  icon?: string;
  location?: string;
}

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

export default function StoryTimelineLayout({
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
  
  // 1. DİNAMİK TIMELINE VERİLERİ (Custom Overrides veya Fallback Varsayılan Aşamalar)
  const defaultTimelineItems: TimelineItem[] = [
    {
      id: '1',
      date: '12.04.2023',
      title: 'Tanışma / First Meet',
      description: 'Gözlerimizin ilk kesiştiği o unutulmaz an...',
      icon: 'heart'
    },
    {
      id: '2',
      date: '18.06.2023',
      title: 'İlk Buluşma / First Date',
      description: 'Zamanın nasıl akıp gittiğini anlayamadığımız o heyecan dolu ilk gün.',
      icon: 'sparkles'
    },
    {
      id: '3',
      date: '14.02.2024',
      title: 'Evlilik Teklifi / Proposal',
      description: 'Bir ömür boyu beraber yürümeye "Evet" dediğimiz o mutlu an!',
      icon: 'star'
    },
    {
      id: '4',
      date: '05.05.2024',
      title: 'Nişan Günü / Engagement',
      description: 'Sözlerimizi yüzüklerimizle taçlandırdık.',
      icon: 'heart'
    },
    {
      id: '5',
      date: dateStr,
      title: 'Düğün Günü / Wedding Day',
      description: 'Şimdi ise bu güzel hikayemizi sonsuzluğa taşıyoruz. Sizleri de bekleriz!',
      icon: 'sparkles'
    }
  ];

  const hasCustomItems = !!wedding.custom_overrides?.timeline_items && wedding.custom_overrides.timeline_items.length > 0;
  
  if (!hasCustomItems && mode === 'public') {
    return (
      <div 
        className="max-w-[550px] mx-auto w-full my-8 relative z-10 animate-fade-in font-sans"
        style={{ fontFamily: `"${bodyFont}", serif` }}
      >
        <div 
          className="relative rounded-[2.5rem] overflow-hidden p-6 sm:p-10 border flex flex-col items-center justify-between min-h-[400px] shadow-2xl bg-[#faf9f6]"
          style={{ borderColor: 'rgba(0,0,0,0.05)', color: textColor }}
        >
          <div className="text-center w-full mb-8">
            <span className="text-[10px] font-sans font-bold tracking-[0.3em] uppercase opacity-60" style={{ color: primaryColor }}>
              WELCOME
            </span>
            <h1 
              className="text-3xl sm:text-4xl font-normal tracking-wide mt-2" 
              style={{ color: primaryColor, fontFamily: `"${headingFont}", serif` }}
            >
              {wedding.bride_name} & {wedding.groom_name}
            </h1>
            <div className="w-12 h-[1px] bg-slate-300 mx-auto mt-4" />
          </div>

          <div className="my-2 leading-relaxed text-sm font-light italic max-w-sm text-center">
            {renderQuote()}
          </div>

          <div className="w-full mt-8 pt-8 border-t border-slate-200/60">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left text-xs font-semibold">
              <div className="flex items-center gap-3 py-2.5 px-4 rounded-xl border bg-black/5" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                <Calendar className="w-4 h-4 shrink-0" style={{ color: primaryColor }} />
                <span>{dateStr} | {timeStr}</span>
              </div>
              <div className="flex flex-col gap-1 p-3.5 rounded-xl border bg-black/5">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 shrink-0" style={{ color: primaryColor }} />
                  <span className="font-bold">{wedding.venue_name || 'Mekan Belirtilmedi'}</span>
                </div>
                {wedding.venue_address && (
                  <p className="text-[11px] font-light opacity-80 pl-6 leading-relaxed text-slate-600">{wedding.venue_address}</p>
                )}
              </div>
            </div>
          </div>

          <div className="w-full max-w-sm flex flex-col gap-3 mt-6">
            {hasMaps && (
              <button 
                type="button"
                onClick={handleMapClick}
                className="w-full h-12 rounded-full border flex items-center justify-between px-6 font-bold text-xs tracking-wider uppercase transition-all duration-300 hover:bg-slate-50 active:scale-98 cursor-pointer focus-visible:ring-2 focus-visible:outline-none"
                style={{ 
                  borderColor: `${primaryColor}40`, 
                  color: primaryColor,
                  backgroundColor: 'rgba(255, 255, 255, 0.4)'
                }}
              >
                <span>KONUMA GİT</span>
                <span>&rarr;</span>
              </button>
            )}
            {showRsvp && renderRsvpButton()}
          </div>

          <div className="w-full mt-6">
            {renderTimer()}
            {renderGuestBook()}
          </div>
        </div>
      </div>
    );
  }

  const timelineItems: TimelineItem[] = hasCustomItems ? wedding.custom_overrides.timeline_items : defaultTimelineItems;

  // 2. TIMELINE STİLİ (Metalik, Botanik, Minimal)
  // custom_overrides.timeline_style: 'metallic' | 'botanical' | 'minimal'
  const timelineStyle = wedding.custom_overrides?.timeline_style || 'metallic';

  let lineColor = 'bg-amber-400';
  let badgeBorder = 'border-amber-400';
  let activeIconColor = 'text-amber-500';

  if (timelineStyle === 'botanical') {
    lineColor = 'bg-emerald-600';
    badgeBorder = 'border-emerald-600';
    activeIconColor = 'text-emerald-600';
  } else if (timelineStyle === 'minimal') {
    lineColor = 'bg-slate-900';
    badgeBorder = 'border-slate-900';
    activeIconColor = 'text-slate-900';
  }

  const hasMaps = !!wedding.google_maps_url;
  const showRsvp = wedding.show_rsvp !== false;

  return (
    <div 
      className="max-w-[550px] mx-auto w-full my-8 relative z-10 animate-fade-in font-sans"
      style={{ fontFamily: `"${bodyFont}", serif` }}
    >
      {/* Zaman Tüneli Kartı */}
      <div 
        className="relative rounded-[2.5rem] overflow-hidden p-6 sm:p-10 border flex flex-col items-center justify-between min-h-[640px] shadow-2xl bg-[#faf9f6]"
        style={{ borderColor: 'rgba(0,0,0,0.05)', color: textColor }}
      >
        
        {/* Başlık Alanı */}
        <div className="text-center w-full mb-8">
          <span className="text-[10px] font-sans font-bold tracking-[0.3em] uppercase opacity-60" style={{ color: primaryColor }}>
            OUR LOVE STORY
          </span>
          <h1 
            className="text-3xl sm:text-4xl font-normal tracking-wide mt-2" 
            style={{ color: primaryColor, fontFamily: `"${headingFont}", serif` }}
          >
            {wedding.bride_name} & {wedding.groom_name}
          </h1>
          <div className="w-12 h-[1px] bg-slate-300 mx-auto mt-4" />
        </div>

        {/* DİKEY ZAMAN ÇİZGELGESİ AKIŞI */}
        <div className="relative w-full my-6 flex flex-col items-center">
          
          {/* Merkez Çizgi (Dikey Hat - pointer-events: none) */}
          <div className={`absolute top-0 bottom-0 w-[2px] pointer-events-none z-0 opacity-40 ${lineColor}`} />

          {/* Timeline Kartları */}
          <div className="w-full space-y-8 z-10 relative">
            {timelineItems.map((item, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div 
                  key={item.id} 
                  className={`flex flex-col md:flex-row items-center w-full justify-between ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Sol/Sağ Boş Alan Dolgusu (Masaüstü için) */}
                  <div className="hidden md:block w-5/12" />

                  {/* Merkez Rozet/Simge */}
                  <div 
                    className={`w-10 h-10 rounded-full border-2 bg-white flex items-center justify-center z-20 shrink-0 shadow-sm ${badgeBorder}`}
                  >
                    {item.icon === 'star' ? (
                      <Star className={`w-4 h-4 ${activeIconColor}`} />
                    ) : item.icon === 'sparkles' ? (
                      <Sparkles className={`w-4 h-4 ${activeIconColor}`} />
                    ) : (
                      <Heart className={`w-4 h-4 ${activeIconColor}`} />
                    )}
                  </div>

                  {/* Hikaye Kartı */}
                  <div className="w-full md:w-5/12 mt-4 md:mt-0 bg-white p-5 rounded-2xl border border-black/5 shadow-xs text-left relative">
                    {/* Tarih Rozeti */}
                    {item.date && (
                      <span className="text-[10px] font-mono opacity-50 uppercase tracking-widest block mb-1">
                        {item.date}
                      </span>
                    )}

                    {/* Başlık */}
                    <h4 className="text-sm font-bold tracking-tight text-slate-800 font-sans mb-2">
                      {item.title}
                    </h4>

                    {/* Açıklama */}
                    {item.description && (
                      <p className="text-xs text-slate-600 leading-relaxed font-light mb-3">
                        {item.description}
                      </p>
                    )}

                    {/* Adım Fotoğrafı */}
                    {item.imageUrl && (
                      <div className="w-full h-32 rounded-lg overflow-hidden mb-3 bg-slate-100">
                        <img 
                          src={item.imageUrl} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}

                    {/* Konum Bilgisi */}
                    {item.location && (
                      <div className="flex items-center gap-1.5 text-[10px] font-sans text-slate-500 font-medium mt-1">
                        <Map className="w-3.5 h-3.5" />
                        <span>{item.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* ALT BÖLÜM: ORTAK MODÜLLER (Zamanlayıcı, Harita vb.) */}
        <div className="w-full mt-8 pt-8 border-t border-slate-200/60">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left text-xs font-semibold">
            {/* Tarih / Saat */}
            <div className="flex items-center gap-3 py-2.5 px-4 rounded-xl border bg-black/5" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
              <Calendar className="w-4 h-4 shrink-0" style={{ color: primaryColor }} />
              <span>{dateStr} | {timeStr}</span>
            </div>

            {/* Mekan */}
            <div className="flex flex-col gap-1 p-3.5 rounded-xl border bg-black/5" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 shrink-0" style={{ color: primaryColor }} />
                <span className="font-bold">{wedding.venue_name || 'Mekan Belirtilmedi'}</span>
              </div>
              {wedding.venue_address && (
                <p className="text-[11px] font-light opacity-80 pl-6 leading-relaxed text-slate-600">{wedding.venue_address}</p>
              )}
            </div>
          </div>
        </div>

        {/* AKSİYON BUTONLARI (MIN 48PX) */}
        <div className="w-full max-w-sm flex flex-col gap-3 mt-6">
          {/* Buton 1: KONUMA GİT */}
          {hasMaps && (
            <button 
              type="button"
              onClick={handleMapClick}
              className="w-full h-12 rounded-full border flex items-center justify-between px-6 font-bold text-xs tracking-wider uppercase transition-all duration-300 hover:bg-slate-50 active:scale-98 cursor-pointer focus-visible:ring-2 focus-visible:outline-none"
              style={{ 
                borderColor: `${primaryColor}40`, 
                color: primaryColor,
                backgroundColor: 'rgba(255, 255, 255, 0.4)'
              }}
            >
              <span>KONUMA GİT</span>
              <span>&rarr;</span>
            </button>
          )}

          {/* Buton 2: KATILIM ANKETİ / LCV BİLDİRİMİ */}
          {showRsvp && renderRsvpButton()}
        </div>

        {/* Geri Sayım ve Defter */}
        <div className="w-full mt-6">
          {renderTimer()}
          {renderGuestBook()}
        </div>
      </div>
    </div>
  );
}
