
import React from 'react';
import CountdownTimer from '../../CountdownTimer';

export default function HennaTrayLayout({ wedding, primaryColor, textColor, headingFont, dateStr, renderRsvpButton, renderGuestBook }: any) {
  return (
    <div className="w-full max-w-sm mx-auto p-4 flex flex-col items-center text-center">
      <div className="w-64 h-64 rounded-full border-[12px] flex flex-col items-center justify-center shadow-xl mb-8 bg-[#800020] text-[#FFD700]" style={{ borderColor: primaryColor }}>
        <h3 className="text-[10px] tracking-widest uppercase mb-2">KINA</h3>
        <h1 className="text-3xl" style={{ fontFamily: `"${headingFont}", serif` }}>{wedding.bride_name}</h1>
      </div>
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full -mt-20 pt-24 relative z-[-1]" style={{ color: textColor }}>
        <p className="font-bold text-lg mb-4 text-[#800020]">{dateStr}</p>
        <div className="text-sm mb-6 pb-6 border-b border-red-100">
          <p className="font-bold">{wedding.venue_name}</p>
          <p className="text-xs opacity-70 mt-1">{wedding.venue_address}</p>
        </div>
        {wedding.wedding_date && <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#800020" styleType="minimal" />}
        <div className="mt-6">{renderRsvpButton()}</div>
        <div className="mt-6">{renderGuestBook()}</div>
      </div>
    </div>
  );
}
