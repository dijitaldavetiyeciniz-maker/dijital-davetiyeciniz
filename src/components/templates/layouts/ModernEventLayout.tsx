'use client';
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Navigation, Award, Users, Ticket, Disc } from 'lucide-react';

interface Speaker {
  name: string;
  role: string;
  company?: string;
  avatarUrl?: string;
}

interface Sponsor {
  name: string;
  logoUrl?: string;
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

export default function ModernEventLayout({
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
  cardBgColor = '#090d16',
  mode = 'public'
}: LayoutProps) {
  
  // 1. ETKİNLİK VARYANT TESPİTİ
  // custom_overrides.event_variant: 'tech-launch' | 'gala' | 'graduation' | 'neon-party'
  const variant = wedding.custom_overrides?.event_variant || 'tech-launch';

  // Sayaç Gelişmiş Tarih Kontrolü (Negatif Değer Göstermeme / Tamamlanma Durumu)
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const eventTime = dateObj.getTime();
      if (eventTime - now <= 0) {
        setIsPast(true);
      } else {
        setIsPast(false);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [dateObj]);

  // 2. VARYANT RENK VE TASARIM PALETLERİ
  let containerBg = 'bg-[#0f172a] text-white';
  let accentColor = primaryColor || '#10b981'; // Neon yeşil
  let accentGradient = 'from-emerald-400 to-teal-500';
  let categoryLabel = 'TECHNOLOGY LAUNCH';

  if (variant === 'gala') {
    containerBg = 'bg-[#0b1329] text-white';
    accentColor = '#dfb76c'; // Altın
    accentGradient = 'from-amber-400 to-yellow-600';
    categoryLabel = 'AWARDS GALA';
  } else if (variant === 'graduation') {
    containerBg = 'bg-[#f8fafc] text-slate-800'; // Açık kurumsal bej/gri
    accentColor = '#1e3a8a'; // Lacivert
    accentGradient = 'from-blue-700 to-indigo-900';
    categoryLabel = 'GRADUATION CEREMONY';
  } else if (variant === 'neon-party') {
    containerBg = 'bg-[#050508] text-white';
    accentColor = '#ec4899'; // Neon pembe
    accentGradient = 'from-pink-500 to-purple-600';
    categoryLabel = 'AFTER PARTY';
  }

  // 3. VARYANT BAZLI VERİ MODÜLLERİ (Sponsorlar, Konuşmacılar, Mezuniyet Bilgileri)
  const defaultSpeakers: Speaker[] = [
    { name: 'Dr. Ahmet Yılmaz', role: 'AI Researcher', company: 'TechCorp' },
    { name: 'Elif Kaya', role: 'Lead Developer', company: 'SoftLabs' }
  ];

  const defaultSponsors: Sponsor[] = [
    { name: 'Intel' }, { name: 'Google' }
  ];

  const speakers: Speaker[] = wedding.custom_overrides?.speakers || (variant === 'tech-launch' ? defaultSpeakers : []);
  const sponsors: Sponsor[] = wedding.custom_overrides?.sponsors || (variant === 'tech-launch' ? defaultSponsors : []);

  const department = wedding.custom_overrides?.department || 'Bilgisayar Mühendisliği';
  const faculty = wedding.custom_overrides?.faculty || 'Mühendislik Fakültesi';
  const graduationYear = wedding.custom_overrides?.graduation_year || '2026';

  const djName = wedding.custom_overrides?.dj_name || 'DJ Pulse';
  const dressCode = wedding.custom_overrides?.dress_code || 'Smart Casual / Neon Accessories';
  const ageLimit = wedding.custom_overrides?.age_limit || '18+ Only';

  const hasMaps = !!wedding.google_maps_url;
  const showRsvp = wedding.show_rsvp !== false;

  return (
    <div 
      className="max-w-[550px] mx-auto w-full my-8 relative z-10 animate-fade-in font-sans"
      style={{ fontFamily: `"${bodyFont}", sans-serif` }}
    >
      {/* Etkinlik Kartı */}
      <div 
        className={`relative rounded-[2.5rem] overflow-hidden p-6 sm:p-10 border flex flex-col justify-between min-h-[640px] shadow-2xl transition-all duration-500 ${containerBg}`}
        style={{ borderColor: variant === 'graduation' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.05)' }}
      >
        
        {/* Neon veya Işık Efektleri (pointer-events: none, mobilde azaltılmış) */}
        {variant !== 'graduation' && (
          <div className="absolute top-0 right-0 w-64 h-64 bg-radial-gradient from-teal-500/10 to-transparent blur-3xl pointer-events-none z-0" />
        )}

        {/* 1. ÜST ETİKET VE KATEGORİ ALANI */}
        <div className="w-full flex justify-between items-center mb-6 z-10">
          <span 
            className="text-[9px] font-mono tracking-[0.3em] font-bold py-1 px-3 rounded-full border border-current select-none"
            style={{ color: accentColor }}
          >
            {categoryLabel}
          </span>
          <span className="text-[10px] font-semibold opacity-60">
            {dateObj.toLocaleDateString('tr-TR', { year: 'numeric' })}
          </span>
        </div>

        {/* 2. ETKİNLİK ADI VE DEV TARİH */}
        <div className="text-left w-full mb-6 z-10">
          <div className="flex justify-between items-start gap-4 mb-2">
            <h1 
              className="text-3xl sm:text-4xl font-black leading-tight tracking-tight uppercase"
              style={{ fontFamily: `"${headingFont}", sans-serif` }}
            >
              {wedding.bride_name || 'Lansman Etkinliği'}
            </h1>
            
            {/* Dev Tarih Rakamı */}
            <div className="text-right shrink-0 select-none" aria-hidden="true">
              <span className="text-4xl sm:text-5xl font-black tracking-tighter" style={{ color: accentColor }}>
                {String(dateObj.getDate()).padStart(2, '0')}
              </span>
              <span className="block text-[10px] font-mono tracking-widest uppercase opacity-60">
                {dateObj.toLocaleDateString('tr-TR', { month: 'short' })}
              </span>
            </div>
          </div>

          <p className="text-xs opacity-75 font-light leading-relaxed max-w-sm mt-3">
            {renderQuote()}
          </p>
        </div>

        {/* 3. VARYANT BAZLI DİNAMİK İÇERİK BÖLÜMÜ */}
        
        {/* VARYANT A: TEKNOLOJİ LANSMANI (Konuşmacılar & Sponsorlar) */}
        {variant === 'tech-launch' && (
          <div className="w-full text-left my-6 space-y-5 z-10">
            {speakers.length > 0 && (
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest opacity-50 block mb-2">Speakers</span>
                <div className="grid grid-cols-1 gap-2.5">
                  {speakers.map((sp, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl border bg-black/10 border-white/5">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs uppercase" style={{ color: accentColor }}>
                        {sp.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold">{sp.name}</h4>
                        <p className="text-[10px] opacity-60">{sp.role} {sp.company ? `at ${sp.company}` : ''}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {sponsors.length > 0 && (
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest opacity-50 block mb-1.5">Sponsors</span>
                <div className="flex flex-wrap gap-2 text-[10px] font-semibold opacity-70">
                  {sponsors.map((sp, idx) => (
                    <span key={idx} className="py-1 px-2.5 rounded-md bg-black/20 border border-white/5">{sp.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* VARYANT B: KURUMSAL GALA (Ödül Töreni / Konuklar) */}
        {variant === 'gala' && (
          <div className="w-full text-left my-6 space-y-4 z-10">
            <div className="flex items-center gap-3 p-4 rounded-2xl border bg-black/15 border-white/5">
              <Award className="w-8 h-8 shrink-0" style={{ color: accentColor }} />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider">Gala Gecesi Programı</h4>
                <p className="text-[10px] opacity-75 mt-0.5 leading-relaxed">Ödül töreni, kokteyl ve protokol konuşmalarını kapsayan gala programına teşrifleriniz beklenmektedir.</p>
              </div>
            </div>
          </div>
        )}

        {/* VARYANT C: MEZUNİYET TÖRENİ */}
        {variant === 'graduation' && (
          <div className="w-full text-left my-6 space-y-3.5 z-10">
            <div className="p-4 rounded-2xl border bg-slate-100/50 border-slate-200/50 text-slate-800">
              <span className="text-[9px] font-sans font-bold tracking-widest uppercase opacity-55 block mb-1">FACULTY & DEPARTMENT</span>
              <h4 className="text-xs font-bold">{faculty}</h4>
              <p className="text-xs font-medium opacity-80 mt-0.5">{department}</p>
              <div className="w-8 h-[1px] bg-slate-300 my-2.5" />
              <p className="text-[10px] opacity-75 font-mono uppercase">Mezuniyet Yılı: {graduationYear}</p>
            </div>
          </div>
        )}

        {/* VARYANT D: NEON PARTİ / AFTER PARTY */}
        {variant === 'neon-party' && (
          <div className="w-full text-left my-6 space-y-3.5 z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl border bg-black/35 border-white/5">
                <span className="text-[9px] opacity-40 uppercase tracking-widest block mb-0.5">Line Up</span>
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <Disc className="w-3.5 h-3.5 animate-spin" style={{ color: accentColor }} />
                  <span>{djName}</span>
                </div>
              </div>
              <div className="p-3 rounded-xl border bg-black/35 border-white/5">
                <span className="text-[9px] opacity-40 uppercase tracking-widest block mb-0.5">Dress Code</span>
                <span className="text-xs font-bold text-slate-200">{dressCode}</span>
              </div>
            </div>
            <div className="py-1.5 px-3 rounded-lg bg-red-950/20 border border-red-500/10 text-center text-[10px] font-bold text-red-400">
              🚨 Admittance: {ageLimit}
            </div>
          </div>
        )}

        {/* 4. SAYAÇ VEYA SÜRE BİLGİSİ */}
        <div className="w-full my-4 z-10 text-center">
          {isPast ? (
            <div className="py-2.5 px-4 rounded-xl border text-xs font-bold inline-block bg-black/10 border-white/10 uppercase tracking-wider text-slate-400">
              Etkinlik Tamamlandı / Event Completed
            </div>
          ) : (
            renderTimer()
          )}
        </div>

        {/* 5. TARİH, SAAT VE MEKAN DETAYLARI */}
        <div className="w-full max-w-sm text-xs font-semibold my-6 space-y-2.5 text-left mx-auto z-10">
          <div className="flex items-center gap-3 py-2.5 px-4 rounded-xl border bg-black/5" style={{ borderColor: variant === 'graduation' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.05)' }}>
            <Calendar className="w-4 h-4 shrink-0" style={{ color: accentColor }} />
            <span>{dateStr} <span className="mx-1 opacity-45">|</span> {timeStr}</span>
          </div>

          <div className="flex flex-col items-start gap-1 p-4 rounded-xl border bg-black/5 text-left" style={{ borderColor: variant === 'graduation' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.05)' }}>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 shrink-0" style={{ color: accentColor }} />
              <span className="font-bold">{wedding.venue_name || 'Mekan Belirtilmedi'}</span>
            </div>
            {wedding.venue_address && (
              <p className="text-[11px] font-light opacity-80 pl-6 leading-relaxed">{wedding.venue_address}</p>
            )}
          </div>
        </div>

        {/* AKSİYON BUTONLARI (MIN 48PX, ÇENTİK KORUMALI) */}
        <div className="w-full max-w-sm flex flex-col gap-3 mt-4 mx-auto z-10 font-sans">
          {/* Buton 1: KONUMA GİT */}
          {hasMaps && (
            <button 
              type="button"
              onClick={handleMapClick}
              className="w-full h-12 rounded-full border flex items-center justify-between px-6 font-bold text-xs tracking-wider uppercase transition-all duration-300 hover:scale-102 active:scale-98 cursor-pointer focus-visible:ring-2 focus-visible:outline-none"
              style={{ 
                borderColor: `${accentColor}40`, 
                color: variant === 'graduation' ? '#1e3a8a' : '#ffffff',
                backgroundColor: variant === 'graduation' ? 'rgba(0, 0, 0, 0.03)' : 'rgba(255, 255, 255, 0.04)'
              }}
            >
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4" />
                <span>KONUMA GİT</span>
              </div>
              <span>&rarr;</span>
            </button>
          )}

          {/* Buton 2: KATILIM ANKETİ / LCV BİLDİRİMİ */}
          {showRsvp && renderRsvpButton()}
        </div>

        {/* Anı Defteri */}
        <div className="w-full mt-6 z-10">
          {renderGuestBook()}
        </div>
      </div>
    </div>
  );
}
