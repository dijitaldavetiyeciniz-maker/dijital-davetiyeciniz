import React from "react";
import { EntranceAnimationStyle } from "@/data/openingAnimations";

type RoyalHallOpeningProps = {
  opened: boolean;
  brideName: string;
  groomName: string;
  styleConfig: EntranceAnimationStyle;
};

export function RoyalHallOpening({
  opened,
  brideName,
  groomName,
  styleConfig,
}: RoyalHallOpeningProps) {
  const initials = `${brideName.charAt(0) || 'G'}&${groomName.charAt(0) || 'D'}`;

  const containerStyle = {
    background: `radial-gradient(circle, ${styleConfig.palette.primary}, ${styleConfig.palette.background})`,
  };

  const gridStyle = {
    borderColor: `${styleConfig.palette.secondary}30`,
    boxShadow: `inset 0 0 100px ${styleConfig.palette.secondary}40`,
  };

  return (
    <div 
      style={containerStyle}
      className={`hall-opening-stage ${opened ? "opened" : ""} w-full h-full flex items-center justify-center`}
    >
      <div style={gridStyle} className="hall-perspective-grid" />
      <div className="z-10 text-center select-none p-6">
        <h4 
          style={{ color: styleConfig.palette.secondary }}
          className="text-[10px] uppercase tracking-[0.3em] mb-4"
        >
          Görkemli Kraliyet Salonu
        </h4>
        <h3 
          style={{ color: styleConfig.palette.accent }}
          className="font-serif text-3xl drop-shadow-lg leading-tight font-extrabold"
        >
          {brideName} <span style={{ color: styleConfig.palette.secondary }}>&</span> {groomName}
        </h3>
        <div style={{ backgroundColor: styleConfig.palette.secondary }} className="w-16 h-[1px] mx-auto my-4 opacity-50" />
        <span 
          style={{ color: styleConfig.palette.secondary }}
          className="text-sm tracking-[0.2em] block"
        >
          {initials}
        </span>
      </div>
    </div>
  );
}
export default RoyalHallOpening;
