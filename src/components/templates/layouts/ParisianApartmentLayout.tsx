
import React from 'react';
import { Calendar, MapPin, Wine } from 'lucide-react';
import CountdownTimer from '../../CountdownTimer';

export default function ParisianApartmentLayout({ wedding, primaryColor, textColor, headingFont, bodyFont, dateStr, timeStr, renderRsvpButton, renderGuestBook, selectedBackground, cardSurfaceStyle }: any) {
  return (
    <div className="w-full max-w-2xl mx-auto min-h-screen p-4 sm:p-8 flex flex-col items-center" style={{ ...(selectedBackground?.background ? { background: selectedBackground.background } : {}) }}>
      <div data-testid="invitation-card-surface invitation-content-surface hero-text-surface date-surface venue-surface countdown-surface action-surface" className="w-full h-full border-x-4 border-t-8 border-b-4 rounded-t-[5rem] p-8 flex flex-col items-center relative overflow-hidden" style={{ ...cardSurfaceStyle,  borderColor: primaryColor }}>
        {/* Balcony Grill SVG */}
        <div className="absolute bottom-0 w-full h-32 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2px)', backgroundSize: '10px 10px' }}></div>
        <h3 className="uppercase tracking-[0.3em] text-xs font-bold mb-12 mt-8" style={{ color: primaryColor }}>Une Soirée Élégante</h3>
        <h1 className="text-4xl md:text-6xl text-center leading-tight mb-8" style={{ fontFamily: `"${headingFont}", serif`, color: textColor }}>
          {wedding.bride_name} <br/><span className="text-xl italic opacity-70">&</span><br/> {wedding.groom_name}
        </h1>
        <div className="w-px h-24 my-6" style={{ backgroundColor: primaryColor }}></div>
        <div className="text-center font-serif text-lg mb-12" style={{ color: textColor }}>
          <p>{dateStr}</p>
          <p className="opacity-70 text-sm mt-2">{timeStr}</p>
        </div>
        <div className="bg-white/80 backdrop-blur p-6 border rounded-xl shadow-sm text-center w-full max-w-sm z-10" style={{ borderColor: primaryColor }}>
          <MapPin className="mx-auto mb-2 w-5 h-5" style={{ color: primaryColor }}/>
          <h4 className="font-bold">{wedding.venue_name}</h4>
          <p className="text-xs opacity-70 mt-1">{wedding.venue_address}</p>
        </div>
        {wedding.wedding_date && <div className="mt-12 w-full"><CountdownTimer targetDate={wedding.wedding_date} primaryColor={primaryColor} styleType="minimal" /></div>}
        <div className="mt-8 z-10">{renderRsvpButton()}</div>
        <div className="w-full mt-8">{renderGuestBook()}</div>
      </div>
    </div>
  );
}
