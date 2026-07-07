import React from "react";
import { EntranceAnimationStyle } from "@/data/openingAnimations";

type GlassRevealOpeningProps = {
  opened: boolean;
  brideName: string;
  groomName: string;
  styleConfig: EntranceAnimationStyle;
  introText?: string;
};

export function GlassRevealOpening({
  opened,
  brideName,
  groomName,
  styleConfig,
  introText,
}: GlassRevealOpeningProps) {
  const initials = `${brideName.charAt(0) || 'G'}&${groomName.charAt(0) || 'D'}`;

  const borderStyle = {
    borderColor: `${styleConfig.palette.secondary}40`,
    background: `${styleConfig.palette.primary}12`,
    boxShadow: `0 30px 60px ${styleConfig.palette.primary}20, inset 0 0 20px ${styleConfig.palette.accent}30`,
  };

  return (
    <div className={`glass-opening-stage ${opened ? "opened" : ""} w-full h-full flex items-center justify-center`}>
      <div 
        style={borderStyle}
        className="w-[280px] h-[360px] rounded-3xl border backdrop-blur-md flex flex-col items-center justify-center p-6 text-center select-none"
      >
        <span 
          style={{ color: styleConfig.palette.secondary }}
          className="text-[10px] tracking-widest font-bold mb-2"
        >
          {introText || "Modern Davetiye"}
        </span>
        <div style={{ backgroundColor: styleConfig.palette.secondary }} className="w-10 h-[1px] my-2 opacity-30" />
        <h3 
          style={{ color: styleConfig.palette.text }}
          className="font-serif text-xl font-bold my-3 leading-snug"
        >
          {brideName} ve {groomName}
        </h3>
        <div style={{ backgroundColor: styleConfig.palette.secondary }} className="w-10 h-[1px] my-2 opacity-30" />
        <span 
          style={{ color: styleConfig.palette.secondary }}
          className="font-serif text-lg tracking-widest mt-2"
        >
          {initials}
        </span>
      </div>
    </div>
  );
}
export default GlassRevealOpening;
