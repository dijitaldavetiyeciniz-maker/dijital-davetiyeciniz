import React from "react";
import { EntranceAnimationStyle } from "@/data/openingAnimations";

type MinimalFadeOpeningProps = {
  opened: boolean;
  brideName: string;
  groomName: string;
  styleConfig: EntranceAnimationStyle;
  introText?: string;
};

export function MinimalFadeOpening({
  opened,
  brideName,
  groomName,
  styleConfig,
  introText,
}: MinimalFadeOpeningProps) {
  const initials = `${brideName.charAt(0) || 'G'}${groomName.charAt(0) || 'D'}`;

  const bubbleStyle = {
    borderColor: `${styleConfig.palette.secondary}40`,
    background: styleConfig.palette.accent,
  };

  return (
    <div className={`minimal-opening-stage ${opened ? "opened" : ""} w-full h-full flex items-center justify-center`}>
      <div className="text-center select-none p-6">
        <div 
          style={bubbleStyle}
          className="w-12 h-12 rounded-full border flex items-center justify-center mx-auto mb-4 bg-white/40 shadow-xs"
        >
          <span 
            style={{ color: styleConfig.palette.text }}
            className="font-serif text-sm font-bold tracking-widest"
          >
            {initials}
          </span>
        </div>
        <h3 
          style={{ color: styleConfig.palette.text }}
          className="font-serif text-xl tracking-wide font-semibold"
        >
          {brideName} & {groomName}
        </h3>
        <p 
          style={{ color: styleConfig.palette.secondary }}
          className="text-[10px] tracking-[0.2em] mt-2 font-bold"
        >
          {introText || "Davetlimizsiniz"}
        </p>
      </div>
    </div>
  );
}

