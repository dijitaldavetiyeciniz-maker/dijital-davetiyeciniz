import React from 'react';
import { OpeningSemanticContent } from "@/data/eventTypeConfig";

export interface OpeningProps {
  opened: boolean;
  semanticData: OpeningSemanticContent;
  introText?: string;
  animationState?: 'playing' | 'completed-awaiting-interaction' | 'opened';
}
export function MoonlitGardenOpening({ opened, semanticData }: OpeningProps) {
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 z-50 ${opened ? "opacity-0 scale-110 blur-xl pointer-events-none" : "opacity-100 scale-100 blur-0"}`}>
      <div className="absolute inset-0 bg-[#040b16]" />
      <div className="absolute top-[10%] w-64 h-64 rounded-full bg-slate-100/10 blur-[80px]" />
      <div className="absolute bottom-0 w-full h-[40%] bg-gradient-to-t from-[#02050a] to-transparent" />
      <div className="relative z-10 text-center space-y-4 pointer-events-none">
        <div className="w-20 h-20 mx-auto border border-indigo-500/30 rounded-full flex items-center justify-center mb-8">
          <span className="text-indigo-200/80 font-serif text-3xl">{semanticData.monogram}</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-serif text-indigo-50 drop-shadow-lg">{semanticData.primaryName}</h1>
        {semanticData.secondaryName && <p className="text-xl text-indigo-200/50 font-serif italic">ile</p>}
        {semanticData.secondaryName && <h1 className="text-3xl md:text-5xl font-serif text-indigo-50 drop-shadow-lg">{semanticData.secondaryName}</h1>}
        <p className="text-xs tracking-[0.2em] uppercase text-indigo-300/50 mt-8">{semanticData.eventTitle}</p>
      </div>
    </div>
  );
}