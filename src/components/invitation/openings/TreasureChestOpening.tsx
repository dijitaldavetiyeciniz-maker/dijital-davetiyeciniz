import React from "react";
import { EntranceAnimationStyle } from "@/data/openingAnimations";

type TreasureChestOpeningProps = {
  opened: boolean;
  brideName: string;
  groomName: string;
  styleConfig: EntranceAnimationStyle;
};

export function TreasureChestOpening({
  opened,
  brideName,
  groomName,
  styleConfig,
}: TreasureChestOpeningProps) {
  const initials = `${brideName.charAt(0) || 'G'}${groomName.charAt(0) || 'D'}`;

  const lidStyle = {
    background: `linear-gradient(to bottom, ${styleConfig.palette.primary}, ${styleConfig.palette.secondary})`,
    border: `4px solid ${styleConfig.palette.accent}`,
  };

  return (
    <div className={`chest-opening-stage ${opened ? "opened" : ""} w-full h-full`}>
      <div 
        style={lidStyle}
        className="chest-lid select-none flex items-center justify-center"
      >
        <div 
          style={{ borderColor: styleConfig.palette.accent }}
          className="w-10 h-10 rounded-full border-2 flex items-center justify-center bg-black/30 mt-6 shadow-lg"
        >
          <span 
            style={{ color: styleConfig.palette.accent }}
            className="font-serif text-sm font-bold"
          >
            {initials}
          </span>
        </div>
      </div>
    </div>
  );
}

