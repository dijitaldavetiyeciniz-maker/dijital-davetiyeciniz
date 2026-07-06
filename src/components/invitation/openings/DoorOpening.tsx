import React from "react";
import { EntranceAnimationStyle } from "@/data/openingAnimations";

type DoorOpeningProps = {
  opened: boolean;
  brideName: string;
  groomName: string;
  styleConfig: EntranceAnimationStyle;
};

export function DoorOpening({
  opened,
  brideName,
  groomName,
  styleConfig,
}: DoorOpeningProps) {
  const initials = `${brideName.charAt(0) || 'G'}&${groomName.charAt(0) || 'D'}`;

  const leftDoorStyle = {
    background: `linear-gradient(90deg, ${styleConfig.palette.primary}, ${styleConfig.palette.secondary})`,
    borderRight: `2px solid ${styleConfig.palette.accent}`,
  };

  const rightDoorStyle = {
    background: `linear-gradient(-90deg, ${styleConfig.palette.primary}, ${styleConfig.palette.secondary})`,
    borderLeft: `2px solid ${styleConfig.palette.accent}`,
  };

  return (
    <div className={`door-opening-stage ${opened ? "opened" : ""} w-full h-full`}>
      <div 
        style={leftDoorStyle}
        className="door-panel-left flex items-center justify-end pr-6 select-none"
      >
        <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center bg-black/10">
          <span className="font-serif text-xl text-white font-bold">{initials.charAt(0)}</span>
        </div>
      </div>
      <div 
        style={rightDoorStyle}
        className="door-panel-right flex items-center justify-start pl-6 select-none"
      >
        <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center bg-black/10">
          <span className="font-serif text-xl text-white font-bold">{initials.slice(-1)}</span>
        </div>
      </div>
    </div>
  );
}
export default DoorOpening;
