import React from 'react';
import { OpeningSemanticContent } from "@/data/eventTypeConfig";

export interface OpeningProps {
  opened: boolean;
  semanticData: OpeningSemanticContent;
  introText?: string;
  animationState?: 'playing' | 'completed-awaiting-interaction' | 'opened';
}
export function SwissGalleryOpening({ opened, semanticData }: OpeningProps) {
  return (
    <div className={`absolute inset-0 flex flex-col items-start justify-end transition-all duration-1000 z-50 p-8 md:p-16 ${opened ? "opacity-0 scale-110 blur-xl pointer-events-none" : "opacity-100 scale-100 blur-0"}`}>
      <div className="absolute inset-0 bg-[#f4f4f4]" />
      <div className="absolute inset-0 grid grid-cols-4 gap-4 pointer-events-none">
        <div className="border-l border-black/5 h-full" />
        <div className="border-l border-black/5 h-full" />
        <div className="border-l border-black/5 h-full" />
        <div className="border-l border-black/5 h-full" />
      </div>
      <div className="relative z-10 text-left pointer-events-none max-w-2xl">
        <h1 className="text-6xl md:text-8xl font-sans font-bold text-black tracking-tighter leading-[0.9] uppercase">
          {semanticData.primaryName}
          {semanticData.secondaryName && <br />}
          {semanticData.secondaryName && semanticData.secondaryName}
        </h1>
        <div className="flex gap-12 mt-12">
          <div>
            <p className="text-[10px] font-bold text-black uppercase mb-1">Event</p>
            <p className="text-sm text-black">{semanticData.eventTitle}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-black uppercase mb-1">Date</p>
            <p className="text-sm text-black">{semanticData.eventDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
}