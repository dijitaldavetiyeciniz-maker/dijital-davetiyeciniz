import React from "react";

type OpeningProps = {
  opened: boolean;
  brideName: string;
  groomName?: string;
  eventDate?: string;
  introText?: string;
};

export function BotanicalBlossomOpening({ opened, brideName, groomName, eventDate, introText }: OpeningProps) {
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 select-none ${opened ? "opacity-0 scale-110 blur-xl pointer-events-none" : "opacity-100 scale-100"}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-950 opacity-95" />
      
      <div className="relative z-10 text-center p-8 bg-emerald-950/70 border border-emerald-500/30 backdrop-blur-md rounded-3xl shadow-2xl max-w-sm mx-4">
        <div className="w-16 h-16 mx-auto mb-4 bg-emerald-900/80 border border-emerald-400 text-emerald-300 rounded-full flex items-center justify-center text-3xl shadow-md">
          🌿
        </div>
        <span className="text-xs font-serif tracking-[0.3em] uppercase text-emerald-300 mb-2 block">
          {introText || "Doğanın Kucağında"}
        </span>
        <h2 className="text-3xl font-serif text-emerald-50 my-2">
          {brideName} {groomName ? `& ${groomName}` : ''}
        </h2>
        {eventDate && (
          <p className="text-xs font-sans text-emerald-200 tracking-widest mt-4 border-t border-emerald-800 pt-3">
            {eventDate}
          </p>
        )}
      </div>
    </div>
  );
}
