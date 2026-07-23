
import React from 'react';
import CountdownTimer from '../../CountdownTimer';

export default function FabricPressLayout({ wedding, primaryColor, textColor, headingFont, dateStr, renderRsvpButton, renderGuestBook }: any) {
  return (
    <div className="w-full max-w-lg mx-auto bg-[#EBE7E0] p-12 shadow-md relative overflow-hidden" style={{ color: textColor }}>
      {/* Fabric Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/linen.png")' }}></div>
      <div className="absolute top-0 left-0 w-full h-8 bg-black/5 blur-md"></div>
      
      <div className="relative z-10 text-center border p-8 bg-[#F4F1EB] shadow-sm" style={{ borderColor: primaryColor }}>
        <div className="w-12 h-12 mx-auto border-2 rounded-full flex items-center justify-center mb-8" style={{ borderColor: primaryColor }}>
          <span className="text-xl font-serif italic" style={{ color: primaryColor }}>{wedding.bride_name[0]}{wedding.groom_name?.[0]}</span>
        </div>
        <h1 className="text-3xl font-normal tracking-wide mb-6 uppercase" style={{ fontFamily: `"${headingFont}", serif` }}>{wedding.bride_name} <br/><span className="text-sm lowercase italic opacity-60">ve</span><br/> {wedding.groom_name}</h1>
        <p className="text-xs tracking-widest uppercase mb-8 border-y py-3" style={{ borderColor: `${primaryColor}40` }}>{dateStr}</p>
        <p className="font-serif italic mb-8">Düğün törenimizde sizleri de aramızda görmekten mutluluk duyarız.</p>
        <div className="text-sm font-bold uppercase tracking-wider mb-2">{wedding.venue_name}</div>
        <div className="text-xs opacity-70 mb-10">{wedding.venue_address}</div>
        
        {wedding.wedding_date && <CountdownTimer targetDate={wedding.wedding_date} primaryColor={primaryColor} styleType="elegant" />}
        <div className="mt-8">{renderRsvpButton()}</div>
      </div>
      <div className="mt-8 relative z-10">{renderGuestBook()}</div>
    </div>
  );
}
