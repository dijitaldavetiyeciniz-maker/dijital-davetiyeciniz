import React from "react";
import { EntranceAnimationStyle } from "@/data/openingAnimations";

type SpotlightOpeningProps = {
  opened: boolean;
  brideName: string;
  groomName: string;
  styleConfig: EntranceAnimationStyle;
  introText?: string;
};

export function SpotlightOpening({
  opened,
  brideName,
  groomName,
  styleConfig,
  introText,
}: SpotlightOpeningProps) {
  const beamStyle = {
    background: `linear-gradient(to bottom, ${styleConfig.palette.secondary}66, transparent)`,
  };

  return (
    <div className={`spotlight-opening-stage ${opened ? "opened" : ""} w-full h-full flex items-center justify-center`}>
      <div style={beamStyle} className="spotlight-beam" />
      <div className="z-10 text-center select-none p-6">
        <span 
          style={{ color: styleConfig.palette.accent }}
          className="text-[10px] tracking-[0.25em] block mb-2 font-bold"
        >
          {introText || "Davetlimizsiniz"}
        </span>
        <h3 
          style={{ color: styleConfig.palette.text || '#ffffff' }}
          className="font-serif text-2xl md:text-4xl drop-shadow-lg leading-tight"
        >
          {brideName} <span style={{ color: styleConfig.palette.secondary }}>&</span> {groomName}
        </h3>
      </div>
    </div>
  );
}

