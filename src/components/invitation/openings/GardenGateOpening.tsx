import React from "react";
import { EntranceAnimationStyle } from "@/data/openingAnimations";

type GardenGateOpeningProps = {
  opened: boolean;
  brideName: string;
  groomName: string;
  styleConfig: EntranceAnimationStyle;
};

export function GardenGateOpening({
  opened,
  brideName,
  groomName,
  styleConfig,
}: GardenGateOpeningProps) {
  const initials = `${brideName.charAt(0) || 'G'}${groomName.charAt(0) || 'D'}`;

  const leftGateStyle = {
    borderColor: styleConfig.palette.secondary,
    background: `repeating-linear-gradient(90deg, transparent, transparent 15px, ${styleConfig.palette.primary}18 15px, ${styleConfig.palette.primary}22 18px)`,
  };

  const rightGateStyle = {
    borderColor: styleConfig.palette.secondary,
    background: `repeating-linear-gradient(-90deg, transparent, transparent 15px, ${styleConfig.palette.primary}18 15px, ${styleConfig.palette.primary}22 18px)`,
  };

  return (
    <div className={`garden-gate-stage ${opened ? "opened" : ""} w-full h-full`}>
      <div 
        style={leftGateStyle}
        className="gate-panel-left flex items-center justify-end pr-4 select-none"
      >
        <div 
          style={{ color: styleConfig.palette.accent }}
          className="font-serif text-2xl font-bold opacity-80"
        >
          {initials.charAt(0)}
        </div>
      </div>
      <div 
        style={rightGateStyle}
        className="gate-panel-right flex items-center justify-start pl-4 select-none"
      >
        <div 
          style={{ color: styleConfig.palette.accent }}
          className="font-serif text-2xl font-bold opacity-80"
        >
          {initials.charAt(1)}
        </div>
      </div>
    </div>
  );
}

