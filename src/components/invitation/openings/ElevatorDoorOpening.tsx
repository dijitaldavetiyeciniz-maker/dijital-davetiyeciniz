import React from "react";
import { EntranceAnimationStyle } from "@/data/openingAnimations";

type ElevatorDoorOpeningProps = {
  opened: boolean;
  brideName: string;
  groomName: string;
  styleConfig: EntranceAnimationStyle;
};

export function ElevatorDoorOpening({
  opened,
  brideName,
  groomName,
  styleConfig,
}: ElevatorDoorOpeningProps) {
  const initials = `${brideName.charAt(0) || 'G'}${groomName.charAt(0) || 'D'}`;

  const leftDoorStyle = {
    background: `linear-gradient(90deg, ${styleConfig.palette.secondary}, ${styleConfig.palette.primary} 50%, ${styleConfig.palette.secondary})`,
    borderRight: `1px solid ${styleConfig.palette.accent}`,
  };

  const rightDoorStyle = {
    background: `linear-gradient(-90deg, ${styleConfig.palette.secondary}, ${styleConfig.palette.primary} 50%, ${styleConfig.palette.secondary})`,
    borderLeft: `1px solid ${styleConfig.palette.accent}`,
  };

  return (
    <div className={`elevator-opening-stage ${opened ? "opened" : ""} w-full h-full`}>
      <div 
        style={leftDoorStyle}
        className="elevator-door-left flex items-center justify-end pr-8 select-none"
      >
        <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-black/10">
          <span className="font-sans text-white text-sm font-bold">{initials.charAt(0)}</span>
        </div>
      </div>
      <div 
        style={rightDoorStyle}
        className="elevator-door-right flex items-center justify-start pl-8 select-none"
      >
        <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-black/10">
          <span className="font-sans text-white text-sm font-bold">{initials.charAt(1)}</span>
        </div>
      </div>
    </div>
  );
}
export default ElevatorDoorOpening;
