
import React from 'react';
import CountdownTimer from '../../CountdownTimer';

export default function OrientalLaceLayout({ wedding, primaryColor, textColor, headingFont, dateStr, renderRsvpButton, renderGuestBook, selectedBackground, cardSurfaceStyle }: any) {
  if (wedding?.template_id === 'ottoman-illumination') {
    return (
      <div className="w-full min-h-[800px] max-w-4xl mx-auto flex flex-col md:flex-row relative shadow-2xl overflow-hidden bg-slate-900 border-8 border-double border-amber-900/50" style={{ ...(selectedBackground?.background ? { background: selectedBackground.background } : {}), color: textColor }}>
        
        {/* Sol/Üst Süsleme ve İsim */}
        <div className="w-full md:w-1/3 p-8 flex flex-col items-center justify-center bg-black/40 border-b md:border-b-0 md:border-r border-amber-500/30 relative">
          <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-amber-500 opacity-60" />
          <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-amber-500 opacity-60" />
          
          <svg className="w-16 h-16 mx-auto mb-8 opacity-90 text-amber-500" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z"/>
          </svg>

          {/* Mobilde normal, Masaüstünde dikey (ama okunabilir) */}
          <h1 className="text-4xl md:text-5xl font-light text-center leading-tight tracking-widest text-amber-500 drop-shadow-md break-words" style={{ fontFamily: `"${headingFont}", serif` }}>
            {wedding.bride_name}
          </h1>
          
          {wedding.groom_name && (
             <div className="mt-6 flex flex-col items-center">
               <span className="text-xl font-serif text-amber-500/50 mb-6">&</span>
               <h1 className="text-4xl md:text-5xl font-light text-center leading-tight tracking-widest text-amber-500 drop-shadow-md break-words" style={{ fontFamily: `"${headingFont}", serif` }}>
                 {wedding.groom_name}
               </h1>
             </div>
          )}
        </div>

        {/* Sağ/Alt İçerik */}
        <div className="w-full md:w-2/3 p-8 sm:p-16 flex flex-col justify-center items-center relative z-10 bg-slate-900/80">
          
          <p className="text-xs tracking-[0.4em] uppercase font-bold mb-8 text-amber-500/80 border-b border-amber-500/30 pb-4 w-full text-center">
            Oryantal Kına Gecesi
          </p>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="flex flex-col items-center justify-center p-6 bg-black/30 rounded-xl border border-amber-500/20 shadow-inner">
              <span className="text-[10px] uppercase tracking-widest text-amber-500/50 mb-2">Tarih & Saat</span>
              <span className="text-lg font-serif text-amber-100 text-center">{dateStr}</span>
            </div>
            <div className="flex flex-col items-center justify-center p-6 bg-black/30 rounded-xl border border-amber-500/20 shadow-inner text-center">
              <span className="text-[10px] uppercase tracking-widest text-amber-500/50 mb-2">Mekan</span>
              <span className="text-sm font-serif text-amber-100">{wedding.venue_name}</span>
            </div>
          </div>

          <div className="w-full max-w-md mx-auto mb-10 text-amber-100">
            {wedding.wedding_date && <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#f59e0b" styleType="minimal" />}
          </div>
          
          <div className="w-full flex flex-col sm:flex-row gap-4 items-center justify-center">
             <div className="w-full sm:w-auto min-w-[200px]">
               {renderRsvpButton()}
             </div>
             <div className="w-full sm:w-auto min-w-[200px]">
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
