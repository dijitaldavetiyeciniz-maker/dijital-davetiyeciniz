import React from 'react';
import { OpeningSemanticContent } from "@/data/eventTypeConfig";

export interface OpeningProps {
  opened: boolean;
  semanticData: OpeningSemanticContent;
  introText?: string;
  animationState?: 'playing' | 'completed-awaiting-interaction' | 'opened';
  wedding?: any;
}
export function GrandOperaOpening({ opened, semanticData }: OpeningProps) {
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 z-50 ${opened ? "opacity-0 scale-110 blur-xl pointer-events-none" : "opacity-100 scale-100 blur-0"}`}>
      {/* Red Velvet Curtain Background */}
      <div className="absolute inset-0 bg-red-950" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90" />
      <div className="absolute inset-0 flex">
        <div className="w-1/2 h-full bg-gradient-to-r from-red-900/40 to-transparent shadow-[inset_-20px_0_50px_rgba(0,0,0,0.5)]" />
        <div className="w-1/2 h-full bg-gradient-to-l from-red-900/40 to-transparent shadow-[inset_20px_0_50px_rgba(0,0,0,0.5)]" />
      </div>
      <div className="relative z-10 text-center space-y-6 pointer-events-none p-10 border border-amber-900/30 bg-black/40 backdrop-blur-sm rounded-sm">
        <div className="text-amber-600/80 text-6xl mb-6">🎭</div>
        <h1 className="text-4xl md:text-6xl font-serif text-amber-500 drop-shadow-2xl">{semanticData.primaryName}</h1>
        {semanticData.secondaryName && <h1 className="text-4xl md:text-6xl font-serif text-amber-500 drop-shadow-2xl">{semanticData.secondaryName}</h1>}
        <p className="text-sm tracking-[0.3em] uppercase text-amber-200/50 pt-4 border-t border-amber-900/50">{semanticData.eventTitle}</p>
      </div>
    </div>
  );
}