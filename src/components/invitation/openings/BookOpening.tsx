import React from "react";
import { EntranceAnimationStyle } from "@/data/openingAnimations";

type BookOpeningProps = {
  opened: boolean;
  brideName: string;
  groomName: string;
  eventDate?: string;
  styleConfig: EntranceAnimationStyle;
  introText?: string;
};

export function BookOpening({
  opened,
  brideName,
  groomName,
  eventDate,
  styleConfig,
  introText,
}: BookOpeningProps) {
  const bookStyle = {
    background: `linear-gradient(135deg, ${styleConfig.palette.primary}, ${styleConfig.palette.secondary})`,
    borderColor: styleConfig.palette.accent,
    color: styleConfig.palette.accent,
  };

  const lineStyle = {
    backgroundColor: styleConfig.palette.accent,
  };

  return (
    <div className={`book-opening-stage ${opened ? "opened" : ""} w-full h-full`}>
      <div 
        style={bookStyle}
        className="book-opening-cover select-none"
      >
        <span className="text-[10px] tracking-[0.25em] opacity-80 mb-2">{introText || "Davetlisiniz"}</span>
        <div style={lineStyle} className="w-12 h-[1px] my-3" />
        <h3 className="font-serif text-2xl text-center leading-snug my-2">
          {brideName} <br /> & <br /> {groomName}
        </h3>
        <div style={lineStyle} className="w-12 h-[1px] my-3" />
        {eventDate && <span className="text-xs font-serif tracking-wider opacity-90">{eventDate}</span>}
      </div>
    </div>
  );
}

