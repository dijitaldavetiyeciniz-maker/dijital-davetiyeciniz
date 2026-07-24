import React from "react";

type OpeningProps = {
  opened: boolean;
  brideName: string;
  groomName?: string;
  eventDate?: string;
  introText?: string;
};

export function NazarDomeOpening({ opened, brideName, groomName, eventDate, introText }: OpeningProps) {
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 select-none ${opened ? "opacity-0 scale-110 blur-xl pointer-events-none" : "opacity-100 scale-100"}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950 via-indigo-950 to-slate-950" />
      
      <div className="relative z-10 text-center p-8 bg-blue-950/80 border-2 border-yellow-400/50 backdrop-blur-md rounded-3xl shadow-[0_0_50px_rgba(59,130,246,0.3)] max-w-sm mx-4">
        <div className="w-16 h-16 mx-auto mb-4 bg-yellow-400/20 border-2 border-yellow-400 text-yellow-300 rounded-full flex items-center justify-center text-3xl shadow-lg">
          🧿
        </div>
        <span className="text-xs font-bold tracking-[0.3em] uppercase text-yellow-400 mb-2 block">
          {introText || "Maşallah - Sünnet Töreni"}
        </span>
        <h2 className="text-3xl font-bold text-white my-2">
          {brideName} {groomName ? `& ${groomName}` : ''}
        </h2>
        {eventDate && (
          <p className="text-xs font-mono text-yellow-200 tracking-widest mt-4 border-t border-yellow-400/30 pt-3">
            {eventDate}
          </p>
        )}
      </div>
    </div>
  );
}
