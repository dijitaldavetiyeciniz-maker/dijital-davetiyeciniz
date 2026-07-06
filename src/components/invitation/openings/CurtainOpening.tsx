import React from "react";
import { EntranceAnimationStyle } from "@/data/openingAnimations";

type CurtainOpeningProps = {
  opened: boolean;
  brideName: string;
  groomName: string;
  styleConfig: EntranceAnimationStyle;
};

export function CurtainOpening({
  opened,
  brideName,
  groomName,
  styleConfig,
}: CurtainOpeningProps) {
  // Use inline style to dynamically theme curtains
  const leftCurtainStyle = {
    background: `linear-gradient(90deg, ${styleConfig.palette.primary}, ${styleConfig.palette.secondary} 60%, ${styleConfig.palette.accent} 95%, ${styleConfig.palette.primary} 99%)`,
  };

  const rightCurtainStyle = {
    background: `linear-gradient(-90deg, ${styleConfig.palette.primary}, ${styleConfig.palette.secondary} 60%, ${styleConfig.palette.accent} 95%, ${styleConfig.palette.primary} 99%)`,
  };

  return (
    <div className={`curtain-opening-stage ${opened ? "opened" : ""} w-full h-full`}>
      <div 
        style={leftCurtainStyle}
        className="curtain-opening-left flex items-center justify-end pr-8 select-none"
      >
        <span className="font-serif text-2xl md:text-4xl text-white text-right leading-tight drop-shadow-lg">
          {brideName}
        </span>
      </div>
      <div 
        style={rightCurtainStyle}
        className="curtain-opening-right flex items-center justify-start pl-8 select-none"
      >
        <span className="font-serif text-2xl md:text-4xl text-white text-left leading-tight drop-shadow-lg">
          {groomName}
        </span>
      </div>
    </div>
  );
}
export default CurtainOpening;
