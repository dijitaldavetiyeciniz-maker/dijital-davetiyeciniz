
import React from 'react';
import CountdownTimer from '../../CountdownTimer';

export default function NazarDomeLayout({ wedding, primaryColor, textColor, headingFont, dateStr, renderRsvpButton, renderGuestBook }: any) {
  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-full p-8 shadow-xl border-4 border-blue-600 text-center relative flex flex-col items-center justify-center min-h-[600px] overflow-hidden" style={{ color: textColor }}>
      <div className="absolute inset-0 bg-blue-50 border-[16px] border-white rounded-full"></div>
      <div className="absolute inset-4 bg-white rounded-full shadow-inner border border-blue-100"></div>
      <div className="relative z-10 p-8 w-full">
        <div className="w-16 h-16 mx-auto bg-blue-600 rounded-full border-4 border-white shadow-md flex items-center justify-center mb-6">
          <div className="w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-black rounded-full"></div>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-blue-900 mb-2" style={{ fontFamily: `"${headingFont}", sans-serif` }}>{wedding.bride_name}</h1>
        <p className="text-sm text-blue-600 font-medium mb-8">Sünnet Düğünü</p>
        
        <div className="text-sm font-semibold mb-8">
          <p>{dateStr}</p>
          <p className="text-xs opacity-70 mt-1">{wedding.venue_name}</p>
        </div>
        
        {wedding.wedding_date && <div className="scale-75 origin-top"><CountdownTimer targetDate={wedding.wedding_date} primaryColor="#2563eb" styleType="minimal" /></div>}
        <div className="mt-2 scale-90">{renderRsvpButton()}</div>
        <div className="mt-4 w-full">{renderGuestBook()}</div>
      </div>
    </div>
  );
}
