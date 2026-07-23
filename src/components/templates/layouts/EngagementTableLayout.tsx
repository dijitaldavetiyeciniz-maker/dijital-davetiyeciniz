
import React from 'react';
import CountdownTimer from '../../CountdownTimer';

export default function EngagementTableLayout({ wedding, primaryColor, textColor, headingFont, dateStr, timeStr, renderRsvpButton, renderGuestBook }: any) {
  return (
    <div className="w-full max-w-xl mx-auto bg-[#FFF5F3] text-slate-800 shadow-lg border p-2 relative" style={{ borderColor: primaryColor }}>
      <div className="border border-dashed p-10 flex flex-col items-center text-center" style={{ borderColor: primaryColor }}>
        <h3 className="text-xs uppercase tracking-widest font-bold opacity-60 mb-8">Nişan Merasimi & Yemek</h3>
        <h1 className="text-4xl sm:text-5xl mb-4" style={{ fontFamily: `"${headingFont}", serif`, color: primaryColor }}>{wedding.bride_name}</h1>
        <div className="text-lg opacity-50 italic font-serif my-2">&</div>
        <h1 className="text-4xl sm:text-5xl mb-12" style={{ fontFamily: `"${headingFont}", serif`, color: primaryColor }}>{wedding.groom_name}</h1>
        
        <div className="w-full border-t border-b py-6 mb-10 flex justify-between items-center text-sm" style={{ borderColor: primaryColor }}>
          <div className="w-1/3 text-right pr-4 border-r" style={{ borderColor: `${primaryColor}40` }}>{dateStr}</div>
          <div className="w-1/3 font-bold">{timeStr}</div>
          <div className="w-1/3 text-left pl-4 border-l" style={{ borderColor: `${primaryColor}40` }}>{wedding.venue_name}</div>
        </div>
        
        {wedding.wedding_date && <CountdownTimer targetDate={wedding.wedding_date} primaryColor={primaryColor} styleType="minimal" />}
        <div className="mt-8">{renderRsvpButton()}</div>
        <div className="mt-8 w-full">{renderGuestBook()}</div>
      </div>
    </div>
  );
}
