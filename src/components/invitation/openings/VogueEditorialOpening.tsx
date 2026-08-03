import React from 'react';
import { OpeningSemanticContent } from "@/data/eventTypeConfig";

export interface OpeningProps {
  opened: boolean;
  semanticData: OpeningSemanticContent;
  introText?: string;
  animationState?: 'playing' | 'completed-awaiting-interaction' | 'opened';
}
export function VogueEditorialOpening({ opened, semanticData }: OpeningProps) {
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-between transition-all duration-1000 z-50 p-6 md:p-12 ${opened ? "opacity-0 scale-110 blur-xl pointer-events-none" : "opacity-100 scale-100 blur-0"}`}>
      <div className="absolute inset-0 bg-white" />
      <div className="relative z-10 w-full text-center mt-10 pointer-events-none">
        <h2 className="text-[10px] tracking-[0.5em] font-bold text-black uppercase mb-4">{semanticData.eventTitle}</h2>
        <div className="w-full border-b-2 border-black mb-12" />
        <h1 className="text-6xl md:text-8xl font-serif text-black uppercase tracking-tighter leading-none">
          {semanticData.primaryName}
        </h1>
        {semanticData.secondaryName && (
          <h1 className="text-6xl md:text-8xl font-serif text-black uppercase tracking-tighter leading-none mt-2">
            {semanticData.secondaryName}
          </h1>
        )}
      </div>
      <div className="relative z-10 w-full flex justify-between items-end pb-8 pointer-events-none">
        <div className="text-left">
          <p className="text-xs font-bold uppercase tracking-widest text-black">Tarih</p>
          <p className="text-sm font-serif text-black">{semanticData.eventDate}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold uppercase tracking-widest text-black">Özel Sayı</p>
          <p className="text-sm font-serif text-black">No. 1</p>
        </div>
      </div>
    </div>
  );
}