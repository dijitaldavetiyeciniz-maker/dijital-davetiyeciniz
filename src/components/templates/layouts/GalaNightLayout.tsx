
import React from 'react';
import CountdownTimer from '../../CountdownTimer';

export default function GalaNightLayout({ wedding, primaryColor, textColor, headingFont, dateStr, timeStr, renderRsvpButton, renderGuestBook, selectedBackground, cardSurfaceStyle }: any) {
  return (
    <div className="w-full max-w-xl mx-auto text-white p-2 sm:p-4" style={{ ...(selectedBackground?.background ? { background: selectedBackground.background } : {}) }}>
      <div data-testid="invitation-card-surface invitation-content-surface hero-text-surface date-surface venue-surface countdown-surface action-surface" className="border border-white/20 p-8 sm:p-12 h-full flex flex-col items-center text-center relative" style={cardSurfaceStyle}>
        <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/50"></div>
        <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/50"></div>
        <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-white/50"></div>
        <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/50"></div>
        
        <h3 className="text-[10px] tracking-[0.5em] uppercase mb-12 text-white/60">Siyah Kravat Gala Daveti</h3>
        <h1 className="text-3xl sm:text-5xl uppercase font-black tracking-tight mb-4">{wedding.bride_name}</h1>
        <div className="text-sm italic text-white/50 my-2 font-serif">ile</div>
        <h1 className="text-3xl sm:text-5xl uppercase font-black tracking-tight mb-16">{wedding.groom_name}</h1>
        
        <div className="w-full max-w-xs grid grid-cols-2 gap-4 text-xs font-bold tracking-widest uppercase mb-16 border-y border-white/20 py-6">
          <div className="text-right border-r border-white/20 pr-4">{dateStr}</div>
          <div className="text-left pl-4">{timeStr}</div>
        </div>
        
        <div className="mb-12">
          <p className="text-lg font-serif italic mb-2 text-white/90">{wedding.venue_name}</p>
          <p className="text-[10px] text-white/40 uppercase tracking-widest">{wedding.venue_address}</p>
        </div>
        
        {wedding.wedding_date && <div className="w-full grayscale opacity-80 mb-8"><CountdownTimer targetDate={wedding.wedding_date} primaryColor="#ffffff" styleType="digital" /></div>}
        <div className="grayscale">{renderRsvpButton()}</div>
        <div className="w-full mt-12">{renderGuestBook()}</div>
      </div>
    </div>
  );
}
