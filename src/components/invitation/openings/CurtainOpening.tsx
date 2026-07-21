import React from "react";
import { EntranceAnimationStyle } from "@/data/openingAnimations";
import { DoorOpening } from "./DoorOpening";

type CurtainOpeningProps = {
  opened: boolean;
  doorOpened?: boolean;
  brideName: string;
  groomName: string;
  styleConfig: EntranceAnimationStyle;
};

export function CurtainOpening({
  opened,
  doorOpened = false,
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
    <div className="relative w-full h-full">
      {/* Door behind the curtain */}
      <div className="absolute inset-0 z-10">
        <DoorOpening 
          opened={doorOpened}
          brideName={brideName}
          groomName={groomName}
          styleConfig={styleConfig}
        />
      </div>

      {/* Curtain panels on top */}
      <div className={`curtain-opening-stage ${opened ? "opened" : ""} w-full h-full absolute inset-0 z-20 pointer-events-none`}>
        <div 
          style={leftCurtainStyle}
          className="curtain-opening-left flex items-center justify-end pr-8 select-none pointer-events-auto"
        >
          <span className="font-serif text-2xl md:text-4xl text-white text-right leading-tight drop-shadow-lg">
            {brideName}
          </span>
        </div>
        <div 
          style={rightCurtainStyle}
          className="curtain-opening-right flex items-center justify-start pl-8 select-none pointer-events-auto"
        >
          <span className="font-serif text-2xl md:text-4xl text-white text-left leading-tight drop-shadow-lg">
            {groomName}
          </span>
        </div>
      </div>
    </div>
  );
}

