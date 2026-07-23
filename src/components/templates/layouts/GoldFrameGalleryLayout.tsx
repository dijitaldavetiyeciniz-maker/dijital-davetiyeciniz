
import React from 'react';
import CountdownTimer from '../../CountdownTimer';

export default function GoldFrameGalleryLayout({ wedding, primaryColor, textColor, headingFont, dateStr, renderRsvpButton, renderGuestBook }: any) {
  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900 text-white p-8 md:p-16 relative">
      <div className="border-[12px] p-6 md:p-12 relative z-10 text-center" style={{ borderColor: '#D4AF37' }}>
        <h3 className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] mb-8">Söz Merasimi</h3>
        <h1 className="text-5xl md:text-7xl font-serif mb-6">{wedding.bride_name} <br/><span className="text-2xl text-[#D4AF37] italic">&</span><br/> {wedding.groom_name}</h1>
        <p className="text-sm opacity-80 mb-12 font-light max-w-md mx-auto leading-relaxed px-4">Evliliğe atacağımız ilk adımda mutluluğumuzu sizinle paylaşmaktan onur duyarız.</p>
        
        <div className="bg-black/40 inline-block p-6 border border-[#D4AF37]/30 mb-12 min-w-[250px]">
          <p className="font-bold text-xl text-[#D4AF37] mb-2">{dateStr}</p>
          <p className="text-sm">{wedding.venue_name}</p>
        </div>
        
        <div className="w-full max-w-md mx-auto">{wedding.wedding_date && <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#D4AF37" styleType="digital" />}</div>
        <div className="mt-10">{renderRsvpButton()}</div>
        <div className="mt-10">{renderGuestBook()}</div>
      </div>
    </div>
  );
}
