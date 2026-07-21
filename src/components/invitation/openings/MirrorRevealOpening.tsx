import React from "react";
import { EntranceAnimationStyle } from "@/data/openingAnimations";

type MirrorRevealOpeningProps = {
  opened: boolean;
  brideName: string;
  groomName: string;
  styleConfig: EntranceAnimationStyle;
};

export function MirrorRevealOpening({
  opened,
  brideName,
  groomName,
  styleConfig,
}: MirrorRevealOpeningProps) {
  const initials = `${brideName.charAt(0) || 'G'}&${groomName.charAt(0) || 'D'}`;

  const frameStyle = {
    background: `${styleConfig.palette.accent}20`,
    borderColor: styleConfig.palette.secondary,
    boxShadow: `0 20px 50px rgba(0,0,0,0.3), inset 0 0 30px ${styleConfig.palette.secondary}40`,
  };

  return (
    <div className={`mirror-opening-stage ${opened ? "opened" : ""} w-full h-full`}>
      <div 
        style={frameStyle}
        className="mirror-frame flex flex-col items-center justify-center p-6 text-center select-none"
      >
        <span 
          style={{ color: styleConfig.palette.secondary }}
          className="text-[10px] uppercase tracking-widest font-semibold mb-2"
        >
          Mutluluğa Adım
        </span>
        <div style={{ backgroundColor: styleConfig.palette.secondary }} className="w-8 h-[1px] my-2 opacity-40" />
        <h3 
          style={{ color: styleConfig.palette.text }}
          className="font-serif text-xl font-bold my-3 leading-snug"
        >
          {brideName} & {groomName}
        </h3>
        <div style={{ backgroundColor: styleConfig.palette.secondary }} className="w-8 h-[1px] my-2 opacity-40" />
        <span 
          style={{ color: styleConfig.palette.accent }}
          className="font-serif text-lg tracking-widest mt-2"
        >
          {initials}
        </span>
      </div>
    </div>
  );
}

