import React from 'react';
import { OpeningSemanticContent } from "@/data/eventTypeConfig";

export interface OpeningProps {
  opened: boolean;
  semanticData: OpeningSemanticContent;
  introText?: string;
  animationState?: 'playing' | 'completed-awaiting-interaction' | 'opened';
}
export function OttomanIlluminationOpening({ opened, semanticData }: OpeningProps) {
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 z-50 ${opened ? "opacity-0 scale-110 blur-xl pointer-events-none" : "opacity-100 scale-100 blur-0"}`}>
      <div className="absolute inset-0 bg-[#0d1512]" />
      <div className="absolute inset-2 border-[4px] border-double border-emerald-900/50 pointer-events-none" />
      <div className="relative z-10 text-center space-y-6 pointer-events-none p-12 bg-[#0d1512]/80 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="w-24 h-24 mx-auto bg-emerald-900/20 rotate-45 flex items-center justify-center border border-emerald-500/30 mb-8">
          <div className="rotate-[-45deg] text-emerald-500 font-serif text-2xl">{semanticData.monogram}</div>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif text-emerald-50 drop-shadow-md">{semanticData.primaryName}</h1>
        {semanticData.secondaryName && <p className="text-lg text-emerald-500/80 font-serif">ve</p>}
        {semanticData.secondaryName && <h1 className="text-4xl md:text-5xl font-serif text-emerald-50 drop-shadow-md">{semanticData.secondaryName}</h1>}
        <div className="w-32 h-[1px] bg-emerald-800/50 mx-auto mt-6" />
        <p className="text-xs tracking-[0.2em] text-emerald-600/70">{semanticData.eventTitle}</p>
      </div>
    </div>
  );
}