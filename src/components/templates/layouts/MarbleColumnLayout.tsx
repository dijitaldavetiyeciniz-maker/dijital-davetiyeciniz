
import React from 'react';
import CountdownTimer from '../../CountdownTimer';

export default function MarbleColumnLayout({ wedding, primaryColor, textColor, headingFont, dateObj, renderRsvpButton, renderGuestBook, selectedBackground, cardSurfaceStyle }: any) {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row shadow-2xl overflow-hidden min-h-[600px]" style={{ ...(selectedBackground?.background ? { background: selectedBackground.background } : {}) }}>
      <div data-testid="invitation-card-surface invitation-content-surface hero-text-surface date-surface venue-surface countdown-surface action-surface" className="w-full md:w-5/12 bg-slate-100 relative p-8 flex flex-col items-center justify-center border-r" style={{ ...cardSurfaceStyle,  borderColor: primaryColor }}>
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/white-marble.png")' }}></div>
        <div className="w-32 h-64 border-x border-t rounded-t-full relative z-10 flex items-center justify-center bg-white shadow-lg" style={{ borderColor: primaryColor }}>
          <h2 className="text-6xl font-serif text-center" style={{ color: primaryColor }}>{dateObj.getDate()}</h2>
        </div>
        <p className="relative z-10 mt-6 text-sm tracking-[0.3em] uppercase font-bold text-slate-800">{dateObj.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}</p>
      </div>
      <div className="w-full md:w-7/12 p-8 md:p-16 flex flex-col justify-center text-center md:text-left" style={{ color: textColor }}>
        <h4 className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: primaryColor }}>Davetlisiniz</h4>
        <h1 className="text-4xl md:text-5xl mb-6 leading-tight" style={{ fontFamily: `"${headingFont}", serif` }}>{wedding.bride_name} <span className="opacity-50">&</span> {wedding.groom_name}</h1>
        <p className="text-sm opacity-80 mb-8">{wedding.custom_message || "Bu özel günümüzde yanımızda olmanızdan onur duyarız."}</p>
        <div className="bg-slate-50 p-6 rounded-lg mb-8">
          <p className="font-bold mb-1">{wedding.venue_name}</p>
          <p className="text-xs opacity-70">{wedding.venue_address}</p>
        </div>
        {wedding.wedding_date && <CountdownTimer targetDate={wedding.wedding_date} primaryColor={primaryColor} styleType="glass" />}
        <div className="mt-8 flex justify-center md:justify-start">{renderRsvpButton()}</div>
        <div className="mt-8">{renderGuestBook()}</div>
      </div>
    </div>
  );
}
