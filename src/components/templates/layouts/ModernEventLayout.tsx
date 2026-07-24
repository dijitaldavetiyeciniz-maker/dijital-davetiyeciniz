'use client';
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Navigation, Award, Disc } from 'lucide-react';

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

export default function ModernEventLayout({ wedding,
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
, selectedBackground, cardSurfaceStyle }: LayoutProps) {
  
  // 1. ETKİNLİK VARYANT TESPİTİ
  const presetId = wedding.template_id || '';
  let variant: 'tech-launch' | 'graduation' | 'gala' | 'neon-party' = 'tech-launch';

  if (presetId === 'graduation-ceremony' || eventTitle.includes('Mezuniyet')) {
    variant = 'graduation';
  } else if (presetId === 'modern-tech-event') {
    variant = 'tech-launch';
  } else {
    const overrides = wedding.custom_overrides || {};
    variant = overrides.event_variant || 'tech-launch';
  }

  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const eventTime = dateObj.getTime();
      setIsPast(eventTime - now <= 0);
    }, 1000);
    return () => clearInterval(timer);
  }, [dateObj]);

  // 2. RENK VE GRID TASARIM SİSTEMİ
  let containerBg = 'bg-[#030712] text-white';
  let accentColor = primaryColor || '#06b6d4'; // Cyan
  let categoryLabel = 'TECHNOLOGY LAUNCH';
  let decorativeOverlay: React.ReactNode = null;

  if (variant === 'gala') {
    containerBg = 'bg-[#0b1329] text-white';
    accentColor = '#dfb76c'; // Gold
    categoryLabel = 'AWARDS GALA';
  } else if (variant === 'graduation') {
    containerBg = 'bg-[#0b1329] text-white border-yellow-500/20'; // Lacivert & Altın mezuniyet zemin
    accentColor = '#dfc384'; // Altın
    categoryLabel = 'GRADUATION CEREMONY';
    decorativeOverlay = (
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-25">
        {/* Floating mortarboard caps and diploma scrolls */}
        <div data-testid="invitation-card-surface" className="absolute top-12 left-10 text-3xl animate-bounce duration-[4000ms]" style={cardSurfaceStyle}>🎓</div>
        <div className="absolute top-24 right-10 text-4xl animate-pulse">📜</div>
        <div className="absolute bottom-40 left-8 text-2xl animate-bounce">📜</div>
        <div className="absolute bottom-20 right-12 text-3xl animate-pulse duration-[5000ms]">🎓</div>
      </div>
    );
  } else if (variant === 'neon-party') {
    containerBg = 'bg-[#050508] text-white';
    accentColor = '#ec4899'; // Pink
    categoryLabel = 'AFTER PARTY';
  }

  // 3. VARYANTA ÖZEL VERİ SETLERİ
  const defaultSpeakers: Speaker[] = [
    { name: 'Dr. Ahmet Yılmaz', role: 'AI Specialist', company: 'DeepTech' },
    { name: 'Nesrin Arslan', role: 'UI Engineer', company: 'Platform Inc' }
  ];

  const defaultSponsors: Sponsor[] = [
    { name: 'Google Cloud' }, { name: 'Vercel' }
  ];

  const overrides = wedding.custom_overrides || {};
  const speakers: Speaker[] = overrides.speakers || (variant === 'tech-launch' ? defaultSpeakers : []);
  const sponsors: Sponsor[] = overrides.sponsors || (variant === 'tech-launch' ? defaultSponsors : []);

  const department = overrides.department || 'Bilgisayar Mühendisliği';
  const faculty = overrides.faculty || 'Mühendislik Fakültesi';
  const graduationYear = overrides.graduation_year || '2026';

  const djName = overrides.dj_name || 'DJ Pulse';
  const dressCode = overrides.dress_code || 'Smart Casual / Neon Gold';

  const hasMaps = !!wedding.google_maps_url;
  const showRsvp = wedding.show_rsvp !== false;

  return (
    <div 
      className="max-w-[550px] mx-auto w-full my-8 relative z-10 animate-fade-in font-sans"
      style={{ ...(selectedBackground?.background ? { background: selectedBackground.background } : {}), fontFamily: `"${bodyFont}", sans-serif` }}
    >
      <div 
        className={`relative rounded-[2.5rem] overflow-hidden p-6 sm:p-10 border flex flex-col justify-between min-h-[640px] shadow-2xl transition-all duration-500 ${containerBg}`}
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}
      >
        {decorativeOverlay}

        {/* Kurumsal Mesh Degradesi */}
        {variant !== 'graduation' && (
          <div className="absolute top-0 right-0 w-64 h-64 bg-radial-gradient from-cyan-500/10 to-transparent blur-3xl pointer-events-none z-0" />
        )}

        {/* Üst Kategoriler */}
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

        {/* Başlık ve Büyük Tarih */}
        <div className="text-left w-full mb-6 z-10">
          <div className="flex justify-between items-start gap-4 mb-2">
            <h1 
              className="text-2xl sm:text-3xl font-black leading-tight tracking-tight uppercase"
              style={{ fontFamily: `"${headingFont}", sans-serif` }}
            >
              {wedding.bride_name || 'Lansman Etkinliği'}
            </h1>
            
            <div className="text-right shrink-0 select-none" aria-hidden="true">
              <span className="text-3xl sm:text-4xl font-black tracking-tighter" style={{ color: accentColor }}>
                {String(dateObj.getDate()).padStart(2, '0')}
              </span>
              <span className="block text-[9px] font-mono tracking-widest uppercase opacity-60">
                {dateObj.toLocaleDateString('tr-TR', { month: 'short' })}
              </span>
            </div>
          </div>

          <div className="text-xs opacity-75 font-light leading-relaxed max-w-sm mt-3">
            {renderQuote()}
          </div>
        </div>

        {/* DİNAMİK İÇERİK MODÜLLERİ */}
        
        {/* A. Teknoloji Lansmanı */}
        {variant === 'tech-launch' && (
          <div className="w-full text-left my-6 space-y-5 z-10">
            {speakers.length > 0 && (
              <div>
                <span className="text-[9px] font-mono uppercase tracking-widest opacity-50 block mb-2">KONUŞMACILAR</span>
                <div className="grid grid-cols-1 gap-2">
                  {speakers.map((sp, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl border bg-white/5 border-white/5">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs uppercase" style={{ color: accentColor }}>
                        {sp.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold">{sp.name}</h4>
                        <p className="text-[10px] opacity-60">{sp.role} {sp.company ? `- ${sp.company}` : ''}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {sponsors.length > 0 && (
              <div>
                <span className="text-[9px] font-mono uppercase tracking-widest opacity-50 block mb-1.5">SPONSORLAR</span>
                <div className="flex flex-wrap gap-2 text-[9px] font-semibold opacity-75">
                  {sponsors.map((sp, idx) => (
                    <span key={idx} className="py-1 px-2.5 rounded-md bg-white/5 border border-white/5">{sp.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* B. Mezuniyet Töreni */}
        {variant === 'graduation' && (
          <div className="w-full text-left my-6 space-y-4 z-10">
            <div className="p-4 rounded-2xl border border-yellow-500/20 bg-slate-900/60 text-white">
              <span className="text-[8px] font-sans font-bold tracking-widest uppercase opacity-60 block mb-1">FAKÜLTE & BÖLÜM</span>
              <h4 className="text-sm font-bold text-amber-300">{faculty}</h4>
              <p className="text-xs font-medium opacity-90 mt-0.5">{department}</p>
              <div className="w-8 h-[1px] bg-yellow-500/20 my-2.5" />
              <p className="text-[10px] opacity-75 font-mono uppercase">MEZUNİYET YILI: {graduationYear}</p>
            </div>
          </div>
        )}

        {/* C. Neon Parti */}
        {variant === 'neon-party' && (
          <div className="w-full text-left my-6 space-y-4 z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl border bg-black/40 border-white/5">
                <span className="text-[9px] opacity-40 uppercase tracking-widest block mb-0.5">LINE UP</span>
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <Disc className="w-3.5 h-3.5 animate-spin" style={{ color: accentColor }} />
                  <span>{djName}</span>
                </div>
              </div>
              <div className="p-3 rounded-xl border bg-black/40 border-white/5">
                <span className="text-[9px] opacity-40 uppercase tracking-widest block mb-0.5">DRESS CODE</span>
                <span className="text-xs font-bold text-slate-200">{dressCode}</span>
              </div>
            </div>
          </div>
        )}

        {/* Sayaç */}
        <div className="w-full my-4 z-10 text-center">
          {isPast ? (
            <div className="py-2 px-4 rounded-xl border text-[10px] font-bold inline-block bg-white/5 border-white/5 uppercase tracking-wider text-slate-400">
              Etkinlik Tamamlandı / Event Completed
            </div>
          ) : (
            renderTimer()
          )}
        </div>

        {/* Tarih & Mekan */}
        <div className="w-full max-w-sm text-xs font-semibold my-6 space-y-2.5 text-left mx-auto z-10">
          <div className="flex items-center gap-3 py-2.5 px-4 rounded-xl border bg-black/20 border-white/5">
            <Calendar className="w-4 h-4 shrink-0" style={{ color: accentColor }} />
            <span>{dateStr} <span className="mx-1 opacity-45">|</span> {timeStr}</span>
          </div>

          <div className="flex flex-col items-start gap-1 p-4 rounded-xl border bg-black/20 border-white/5 text-left">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 shrink-0" style={{ color: accentColor }} />
              <span className="font-bold">{wedding.venue_name || 'Mekan Belirtilmedi'}</span>
            </div>
            {wedding.venue_address && (
              <p className="text-[11px] font-light opacity-80 pl-6 leading-relaxed">{wedding.venue_address}</p>
            )}
          </div>
        </div>

        {/* Aksiyonlar */}
        <div className="w-full max-w-sm flex flex-col gap-3 mt-4 mx-auto z-10">
          {hasMaps && (
            <button 
              type="button"
              onClick={handleMapClick}
              className="w-full h-12 rounded-full border flex items-center justify-between px-6 font-bold text-xs tracking-wider uppercase transition-all duration-300 hover:scale-102 active:scale-98 cursor-pointer focus-visible:ring-2 focus-visible:outline-none bg-white/5 border-white/5"
              style={{ borderColor: `${accentColor}40`, color: '#ffffff' }}
            >
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4" style={{ color: accentColor }} />
                <span>KONUMA GİT</span>
              </div>
              <span>&rarr;</span>
            </button>
          )}

          {showRsvp && renderRsvpButton()}
        </div>

        {/* Anı Defteri */}
        {renderGuestBook()}
      </div>
    </div>
  );
}
