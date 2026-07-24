
import React from 'react';
import CountdownTimer from '../../CountdownTimer';

export default function VelvetCurtainLayout({ wedding, primaryColor, textColor, headingFont, dateStr, renderRsvpButton, renderGuestBook, selectedBackground, cardSurfaceStyle }: any) {
  return (
    <div className="w-full max-w-md mx-auto text-[#e8d5b5] shadow-2xl overflow-hidden rounded-t-[10rem] border-4" style={{ ...(selectedBackground?.background ? { background: selectedBackground.background } : {}), borderColor: primaryColor }}>
      <div data-testid="invitation-card-surface invitation-content-surface hero-text-surface date-surface venue-surface countdown-surface action-surface" className="p-8 pt-20 flex flex-col items-center text-center relative z-10" style={cardSurfaceStyle}>
        <svg className="w-16 h-16 mb-6 opacity-80" viewBox="0 0 24 24" fill="currentColor" style={{ color: primaryColor }}><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        <h3 className="text-xs font-bold tracking-[0.3em] uppercase mb-8">Kına Gecesi</h3>
        <h1 className="text-4xl mb-8" style={{ fontFamily: `"${headingFont}", serif` }}>{wedding.bride_name}</h1>
        <p className="text-sm font-light italic mb-8 opacity-90 px-4">"Kınamıza bekleriz, bu mutlu günümüzde yanımızda olun."</p>
        <div className="w-24 h-px mb-8" style={{ backgroundColor: primaryColor }}></div>
        <p className="font-bold text-lg mb-2">{dateStr}</p>
        <p className="text-xs uppercase tracking-widest opacity-80">{wedding.venue_name}</p>
        
        <div className="mt-12 w-full">{wedding.wedding_date && <CountdownTimer targetDate={wedding.wedding_date} primaryColor={primaryColor} styleType="elegant" />}</div>
        <div className="mt-8">{renderRsvpButton()}</div>
        <div className="mt-8 w-full">{renderGuestBook()}</div>
      </div>
    </div>
  );
}
