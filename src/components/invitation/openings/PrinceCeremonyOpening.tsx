import React from 'react';
import { OpeningSemanticContent } from "@/data/eventTypeConfig";

export interface OpeningProps {
  opened: boolean;
  semanticData: OpeningSemanticContent;
  introText?: string;
  animationState?: 'playing' | 'completed-awaiting-interaction' | 'opened';
}
export function PrinceCeremonyOpening({ opened, semanticData }: OpeningProps) {
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 z-50 ${opened ? "opacity-0 scale-110 blur-xl pointer-events-none" : "opacity-100 scale-100 blur-0"}`}>
      <div className="absolute inset-0 bg-blue-950" />
      <div className="absolute inset-4 border-2 border-blue-400/20 rounded-full pointer-events-none opacity-50 scale-[2]" />
      <div className="relative z-10 text-center space-y-6 pointer-events-none">
        <div className="w-20 h-20 mx-auto bg-blue-800/40 rounded-full flex items-center justify-center border-4 border-white/10 shadow-xl mb-6">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-yellow-500 rounded-full" />
          </div>
        </div>
        <h1 className="text-5xl md:text-6xl font-serif text-blue-100 drop-shadow-lg">{semanticData.primaryName}</h1>
        <p className="text-sm tracking-[0.2em] uppercase text-blue-300/60 mt-4">{semanticData.eventTitle}</p>
      </div>
    </div>
  );
}