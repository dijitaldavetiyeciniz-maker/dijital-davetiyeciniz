
import React from 'react';
import CountdownTimer from '../../CountdownTimer';

export default function VelvetTheaterLayout({ wedding, primaryColor, textColor, headingFont, dateStr, renderRsvpButton, renderGuestBook, selectedBackground, cardSurfaceStyle }: any) {
  return (
    <div className="w-full max-w-md mx-auto text-white p-4 shadow-2xl overflow-hidden rounded-[3rem] border border-blue-900/50 relative" style={{ ...(selectedBackground?.background ? { background: selectedBackground.background } : {}) }}>
      <div data-testid="invitation-card-surface invitation-content-surface hero-text-surface date-surface venue-surface countdown-surface action-surface" className="absolute top-0 left-0 w-full h-32 bg-blue-900/30 blur-2xl" style={cardSurfaceStyle}></div>
      <div className="relative z-10 text-center py-12 px-6">
        <h3 className="text-[10px] tracking-widest uppercase text-blue-300 font-bold mb-4">Sünnet Töreni</h3>
        <h1 className="text-4xl text-blue-50 font-bold mb-10" style={{ fontFamily: `"${headingFont}", serif` }}>{wedding.bride_name}</h1>
        <p className="text-sm opacity-80 mb-8 italic">Mutluluğumuzu paylaşmanız dileğiyle...</p>
        
        <div className="bg-slate-900/80 p-6 rounded-2xl border border-blue-900/50 mb-10 backdrop-blur-md">
          <p className="font-bold text-lg text-blue-200 mb-2">{dateStr}</p>
          <p className="text-sm text-blue-100">{wedding.venue_name}</p>
        </div>
        
        {wedding.wedding_date && <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#60A5FA" styleType="digital" />}
        <div className="mt-8">{renderRsvpButton()}</div>
        <div className="mt-8">{renderGuestBook()}</div>
      </div>
    </div>
  );
}
