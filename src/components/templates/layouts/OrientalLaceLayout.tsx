
import React from 'react';
import CountdownTimer from '../../CountdownTimer';

export default function OrientalLaceLayout({ wedding, primaryColor, textColor, headingFont, dateStr, renderRsvpButton, renderGuestBook, selectedBackground, cardSurfaceStyle }: any) {
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
