import React from "react";
import { EntranceAnimationStyle } from "@/data/openingAnimations";

type CinematicZoomOpeningProps = {
  opened: boolean;
  brideName: string;
  groomName: string;
  styleConfig: EntranceAnimationStyle;
  introText?: string;
};

export function CinematicZoomOpening({
  opened,
  brideName,
  groomName,
  styleConfig,
  introText,
}: CinematicZoomOpeningProps) {
  const borderStyle = {
    borderColor: `${styleConfig.palette.secondary}80`,
  };

  return (
    <div className={`zoom-opening-stage ${opened ? "opened" : ""} w-full h-full flex items-center justify-center`}>
      <div style={borderStyle} className="zoom-lens-border" />
      <div className="z-10 text-center select-none p-6">
        <h3 
          style={{ color: styleConfig.palette.accent }}
          className="font-serif text-3xl md:text-5xl tracking-widest font-extrabold drop-shadow-md"
        >
          {brideName} & {groomName}
        </h3>
        <p 
          style={{ color: styleConfig.palette.secondary }}
          className="text-[10px] tracking-[0.3em] mt-4 font-bold"
        >
          {introText || "Davetlimizsiniz"}
        </p>
      </div>
    </div>
  );
}

