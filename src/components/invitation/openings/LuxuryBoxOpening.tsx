import React from "react";
import { EntranceAnimationStyle } from "@/data/openingAnimations";

type LuxuryBoxOpeningProps = {
  opened: boolean;
  brideName: string;
  groomName: string;
  styleConfig: EntranceAnimationStyle;
};

export function LuxuryBoxOpening({
  opened,
  brideName,
  groomName,
  styleConfig,
}: LuxuryBoxOpeningProps) {
  const initials = `${brideName.charAt(0) || 'G'}&${groomName.charAt(0) || 'D'}`;

  const lidStyle = {
    background: `linear-gradient(135deg, ${styleConfig.palette.primary}, ${styleConfig.palette.secondary})`,
    border: `1px solid ${styleConfig.palette.accent}`,
  };

  const ribbonStyle = {
    background: styleConfig.palette.accent,
  };

  return (
    <div className={`box-opening-stage ${opened ? "opened" : ""} w-full h-full`}>
      <div 
        style={lidStyle}
        className="box-lid select-none"
      >
        <div style={ribbonStyle} className="box-ribbon box-ribbon-h" />
        <div style={ribbonStyle} className="box-ribbon box-ribbon-v" />
        <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center z-10 shadow-lg">
          <span className="font-serif text-white text-xl font-bold tracking-widest">{initials}</span>
        </div>
      </div>
    </div>
  );
}

