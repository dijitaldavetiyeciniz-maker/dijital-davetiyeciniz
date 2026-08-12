
import React from 'react';
import CountdownTimer from '../../CountdownTimer';

export default function OrientalLaceLayout({ wedding, primaryColor, textColor, headingFont, dateStr, renderRsvpButton, renderGuestBook, selectedBackground, cardSurfaceStyle }: any) {
  if (wedding?.template_id === 'ottoman-illumination') {
    return (
      <div 
        className="w-full min-h-[800px] max-w-4xl mx-auto flex flex-col md:flex-row relative shadow-2xl overflow-hidden border-8 border-double border-amber-900/50" 
        style={{ 
          color: textColor,
          backgroundImage: 'url("https://images.unsplash.com/photo-1573504816327-07f3bf7accac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8Ymx1ZSUyMG1vc2FpYyUyMHRpbGUlMjB0ZXh0dXJlfGVufDB8fHx8MTc4NjU0MDE3N3ww&ixlib=rb-4.1.0&q=80&w=1080")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-slate-950/80 mix-blend-multiply z-0"></div>
        
        {/* Sol/Üst Süsleme ve İsim */}
        <div className="w-full md:w-1/3 p-12 flex flex-col items-center justify-center bg-black/60 border-b-8 md:border-b-0 md:border-r-8 border-amber-600 relative z-10 backdrop-blur-sm">
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none mix-blend-color-dodge"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1545873509-33e944ca7655?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8Z29sZCUyMGxlYWYlMjB0ZXh0dXJlfGVufDB8fHx8MTc4NjU0MDE1NHww&ixlib=rb-4.1.0&q=80&w=1080")',
              backgroundSize: 'cover'
            }}
          ></div>
          <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-amber-500 opacity-80" />
          <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-amber-500 opacity-80" />
          
          <svg className="w-20 h-20 mx-auto mb-8 opacity-90 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z"/>
            <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>

          {/* Mobilde normal, Masaüstünde dikey (ama okunabilir) */}
          <h1 className="text-4xl md:text-5xl font-light text-center leading-tight tracking-widest text-amber-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] break-words" style={{ fontFamily: `"${headingFont}", serif` }}>
            {wedding.bride_name}
          </h1>
          
          {wedding.groom_name && (
             <div className="mt-6 flex flex-col items-center">
               <span className="text-xl font-serif text-amber-500/70 mb-6 drop-shadow-md">&</span>
               <h1 className="text-4xl md:text-5xl font-light text-center leading-tight tracking-widest text-amber-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] break-words" style={{ fontFamily: `"${headingFont}", serif` }}>
                 {wedding.groom_name}
               </h1>
             </div>
          )}
        </div>

        {/* Sağ/Alt İçerik */}
        <div className="w-full md:w-2/3 p-8 sm:p-16 flex flex-col justify-center items-center relative z-10 bg-slate-900/70 backdrop-blur-md">
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1545873509-33e944ca7655?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8Z29sZCUyMGxlYWYlMjB0ZXh0dXJlfGVufDB8fHx8MTc4NjU0MDE1NHww&ixlib=rb-4.1.0&q=80&w=1080")',
              backgroundSize: 'cover'
            }}
          ></div>
          
          <p className="text-sm tracking-[0.4em] uppercase font-bold mb-8 text-amber-400 border-b border-amber-500/50 pb-4 w-full text-center drop-shadow-md">
            Saray Tezhip Sanatı
          </p>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="flex flex-col items-center justify-center p-6 bg-black/40 rounded-xl border border-amber-500/30 shadow-[0_0_15px_rgba(0,0,0,0.5)] backdrop-blur-sm relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
              <span className="text-[10px] uppercase tracking-widest text-amber-400/70 mb-2 font-semibold">Tarih & Saat</span>
              <span className="text-xl font-serif text-amber-50 text-center drop-shadow-md">{dateStr}</span>
            </div>
            <div className="flex flex-col items-center justify-center p-6 bg-black/40 rounded-xl border border-amber-500/30 shadow-[0_0_15px_rgba(0,0,0,0.5)] backdrop-blur-sm relative overflow-hidden text-center">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
              <span className="text-[10px] uppercase tracking-widest text-amber-400/70 mb-2 font-semibold">Mekan</span>
              <span className="text-base font-serif text-amber-50 drop-shadow-md">{wedding.venue_name}</span>
            </div>
          </div>

          <div className="w-full max-w-md mx-auto mb-10 text-amber-50 drop-shadow-md">
            {wedding.wedding_date && <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#fbbf24" styleType="minimal" />}
          </div>
          
          <div className="w-full flex flex-col sm:flex-row gap-4 items-center justify-center relative z-20">
             <div className="w-full sm:w-auto min-w-[200px] drop-shadow-lg">
               {renderRsvpButton()}
             </div>
             <div className="w-full sm:w-auto min-w-[200px] drop-shadow-lg">
               {renderGuestBook()}
             </div>
          </div>
          
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto p-6 sm:p-12 relative shadow-lg" style={{ ...(selectedBackground?.background ? { background: selectedBackground.background } : {}), color: textColor }}>
      <div data-testid="invitation-card-surface invitation-content-surface hero-text-surface date-surface venue-surface countdown-surface action-surface" className="absolute inset-4 border-2 border-dotted pointer-events-none rounded-xl opacity-30" style={{ ...cardSurfaceStyle,  borderColor: primaryColor }}></div>
      <div className="absolute inset-6 border border-solid pointer-events-none rounded-lg opacity-20" style={{ borderColor: primaryColor }}></div>
      <div className="text-center relative z-10 py-12">
        <svg className="w-20 h-20 mx-auto mb-6 opacity-90" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1" style={{ color: primaryColor }}>
          <circle cx="50" cy="50" r="40"/>
          <path d="M50 10 Q60 50 50 90 Q40 50 50 10Z"/>
          <path d="M10 50 Q50 60 90 50 Q50 40 10 50Z"/>
        </svg>
        <h1 className="text-5xl font-light mb-4" style={{ fontFamily: `"${headingFont}", serif` }}>{wedding.bride_name}</h1>
        <p className="text-[10px] tracking-widest uppercase font-bold mb-10" style={{ color: primaryColor }}>Oryantal Kına Gecesi</p>
        
        <div className="grid grid-cols-2 gap-4 mb-10 text-sm">
          <div className="border-r border-slate-200 pr-4 text-right">
            <p className="font-bold">Tarih</p>
            <p className="opacity-70">{dateStr}</p>
          </div>
          <div className="pl-4 text-left">
            <p className="font-bold">Mekan</p>
            <p className="opacity-70">{wedding.venue_name}</p>
          </div>
        </div>
        
        {wedding.wedding_date && <CountdownTimer targetDate={wedding.wedding_date} primaryColor={primaryColor} styleType="glass" />}
        <div className="mt-8">{renderRsvpButton()}</div>
        <div className="mt-8">{renderGuestBook()}</div>
      </div>
    </div>
  );
}
