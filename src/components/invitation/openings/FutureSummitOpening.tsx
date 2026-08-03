import React from 'react';
import { OpeningSemanticContent } from "@/data/eventTypeConfig";

export interface OpeningProps {
  opened: boolean;
  semanticData: OpeningSemanticContent;
  introText?: string;
  animationState?: 'playing' | 'completed-awaiting-interaction' | 'opened';
}
export function FutureSummitOpening({ opened, semanticData }: OpeningProps) {
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 z-50 ${opened ? "opacity-0 scale-110 blur-xl pointer-events-none" : "opacity-100 scale-100 blur-0"}`}>
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="relative z-10 text-center space-y-6 pointer-events-none">
        <div className="w-16 h-16 mx-auto bg-white mb-8 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.5)]">
          <span className="text-black font-black text-2xl">{semanticData.monogram}</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-sans font-black text-white tracking-tighter uppercase">{semanticData.eventTitle}</h1>
        <p className="text-sm tracking-[0.3em] uppercase text-white/50">{semanticData.companyName || semanticData.primaryName}</p>
        <p className="text-xs font-mono text-white/40 mt-8">{semanticData.eventDate}</p>
      </div>
    </div>
  );
}