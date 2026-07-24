
import React from 'react';
import CountdownTimer from '../../CountdownTimer';
import { GlassWater } from 'lucide-react';

export default function CocktailMenuLayout({ wedding, primaryColor, textColor, headingFont, dateStr, timeStr, renderRsvpButton, renderGuestBook, selectedBackground, cardSurfaceStyle }: any) {
  return (
    <div className="w-full max-w-md mx-auto text-[#F3E5D8] p-6 shadow-2xl my-8 border-8 border-double" style={{ ...(selectedBackground?.background ? { background: selectedBackground.background } : {}), borderColor: primaryColor }}>
      <div data-testid="invitation-card-surface" className="flex justify-center mb-8 mt-4" style={cardSurfaceStyle}><GlassWater size={40} style={{ color: primaryColor }} /></div>
      <h3 className="text-center text-xs tracking-[0.4em] uppercase mb-12 opacity-80">Şampanya & Kokteyl</h3>
      <h1 className="text-4xl text-center mb-10" style={{ fontFamily: `"${headingFont}", serif` }}>{wedding.bride_name} & {wedding.groom_name}</h1>
      
      <div className="space-y-6 text-sm font-serif mb-12">
        <div className="flex justify-between items-end">
          <span>Karşılama</span>
          <span className="flex-grow border-b border-dotted mx-2 border-[#F3E5D8]/30 mb-1"></span>
          <span>{timeStr}</span>
        </div>
        <div className="flex justify-between items-end">
          <span>Tarih</span>
          <span className="flex-grow border-b border-dotted mx-2 border-[#F3E5D8]/30 mb-1"></span>
          <span>{dateStr}</span>
        </div>
        <div className="flex justify-between items-end">
          <span>Mekan</span>
          <span className="flex-grow border-b border-dotted mx-2 border-[#F3E5D8]/30 mb-1"></span>
          <span>{wedding.venue_name}</span>
        </div>
      </div>
      
      <div className="p-4 border border-[#F3E5D8]/20 bg-black/20 text-center mb-8">
        <p className="text-xs opacity-70 italic">Kıyafet Kodu: Kokteyl Şıklığı</p>
      </div>
      
      {wedding.wedding_date && <CountdownTimer targetDate={wedding.wedding_date} primaryColor={primaryColor} styleType="minimal" />}
      <div className="mt-8 flex justify-center scale-90">{renderRsvpButton()}</div>
      <div className="mt-8">{renderGuestBook()}</div>
    </div>
  );
}
