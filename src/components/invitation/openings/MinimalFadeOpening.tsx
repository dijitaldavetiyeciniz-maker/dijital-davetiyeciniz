import React from "react";

type MinimalFadeOpeningProps = {
  opened: boolean;
  brideName: string;
  groomName: string;
  theme: string;
};

export function MinimalFadeOpening({
  opened,
  brideName,
  groomName,
  theme,
}: MinimalFadeOpeningProps) {
  const initials = `${brideName.charAt(0) || 'G'}${groomName.charAt(0) || 'D'}`;

  return (
    <div className={`minimal-opening-stage minimal-theme-${theme} ${opened ? "opened" : ""} w-full h-full flex items-center justify-center`}>
      <div className="text-center select-none p-6">
        <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center mx-auto mb-4 bg-white/40 shadow-xs">
          <span className="font-serif text-slate-800 text-sm font-bold tracking-widest">{initials}</span>
        </div>
        <h3 className="font-serif text-slate-800 text-xl tracking-wide font-semibold">
          {brideName} & {groomName}
        </h3>
        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mt-2">Düğün Davetiye Girişi</p>
      </div>
    </div>
  );
}
export default MinimalFadeOpening;
