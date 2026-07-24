import React from "react";

type OpeningProps = {
  opened: boolean;
  brideName: string;
  groomName?: string;
  eventDate?: string;
  introText?: string;
};

export function HennaVelvetGateOpening({ opened, brideName, groomName, eventDate, introText }: OpeningProps) {
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 select-none ${opened ? "opacity-0 scale-110 blur-xl pointer-events-none" : "opacity-100 scale-100"}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-[#3f0712] via-[#2c050d] to-[#1a0308]" />
      
      <div className="relative z-10 text-center p-8 bg-[#4c0b18]/80 border-2 border-amber-500/50 backdrop-blur-md rounded-3xl shadow-[0_0_50px_rgba(251,191,36,0.2)] max-w-sm mx-4">
        <div className="w-16 h-16 mx-auto mb-4 bg-amber-500/20 border-2 border-amber-400 text-amber-300 rounded-full flex items-center justify-center text-3xl shadow-lg">
          🍷
        </div>
        <span className="text-xs font-serif tracking-[0.3em] uppercase text-amber-300 mb-2 block">
          {introText || "Kına Gecesi Daveti"}
        </span>
        <h2 className="text-3xl font-serif text-amber-100 my-2">
          {brideName} {groomName ? `& ${groomName}` : ''}
        </h2>
        {eventDate && (
          <p className="text-xs font-serif text-amber-200 tracking-widest mt-4 border-t border-amber-500/30 pt-3">
            {eventDate}
          </p>
        )}
      </div>
    </div>
  );
}
