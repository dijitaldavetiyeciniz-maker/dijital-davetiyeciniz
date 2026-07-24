import React from "react";

type OpeningProps = {
  opened: boolean;
  brideName: string;
  groomName?: string;
  eventDate?: string;
  introText?: string;
};

export function RoyalParchmentOpening({ opened, brideName, groomName, eventDate, introText }: OpeningProps) {
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 select-none ${opened ? "opacity-0 scale-110 blur-xl pointer-events-none" : "opacity-100 scale-100"}`}>
      <div className="absolute inset-0 bg-[#0f0e0e]" />
      
      <div className="relative z-10 text-center p-8 bg-[#181614] border-2 border-amber-500/50 rounded-2xl shadow-[0_0_40px_rgba(214,168,79,0.2)] max-w-sm mx-4">
        <div className="w-16 h-16 mx-auto mb-4 bg-amber-950/80 border-2 border-amber-500 text-amber-400 rounded-full flex items-center justify-center text-3xl shadow-lg">
          📜
        </div>
        <span className="text-xs font-serif tracking-[0.3em] uppercase text-amber-400 mb-2 block">
          {introText || "Kraliyet Davetiyesi"}
        </span>
        <h2 className="text-3xl font-serif text-amber-100 my-2">
          {brideName} {groomName ? `& ${groomName}` : ''}
        </h2>
        {eventDate && (
          <p className="text-xs font-serif text-amber-300 tracking-widest mt-4 border-t border-amber-800/60 pt-3">
            {eventDate}
          </p>
        )}
      </div>
    </div>
  );
}
