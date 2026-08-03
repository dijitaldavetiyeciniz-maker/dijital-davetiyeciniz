import React from 'react';
import { OpeningSemanticContent } from "@/data/eventTypeConfig";

export interface OpeningProps {
  opened: boolean;
  semanticData: OpeningSemanticContent;
  introText?: string;
  animationState?: 'playing' | 'completed-awaiting-interaction' | 'opened';
}
export function ParisianBlackTieOpening({ opened, semanticData }: OpeningProps) {
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 z-50 ${opened ? "opacity-0 scale-110 blur-xl pointer-events-none" : "opacity-100 scale-100 blur-0"}`}>
      <div className="absolute inset-0 bg-[#0a0a0a]" />
      {/* Spotlight Effect */}
      <div className="absolute top-[-20%] left-[50%] translate-x-[-50%] w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.15),transparent_50%)] pointer-events-none" />
      <div className="relative z-10 flex flex-col items-center space-y-8 pointer-events-none w-full max-w-md px-6">
        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-amber-500/80 to-transparent mb-4" />
        <h1 className="text-5xl md:text-7xl font-serif font-light tracking-widest text-white drop-shadow-lg text-center uppercase">
          {semanticData.primaryName}
          {semanticData.secondaryName && <span className="block text-2xl md:text-3xl mt-4 text-amber-500/80 font-serif italic">&</span>}
          {semanticData.secondaryName && <span className="block mt-4">{semanticData.secondaryName}</span>}
        </h1>
        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-amber-500/80 to-transparent mt-4" />
        <p className="text-xs tracking-[0.4em] uppercase text-white/50">{semanticData.eventTitle}</p>
        <p className="text-[10px] tracking-[0.2em] text-white/40 font-mono mt-8">{semanticData.eventDate}</p>
      </div>
    </div>
  );
}