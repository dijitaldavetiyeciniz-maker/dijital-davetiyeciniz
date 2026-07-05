import React from "react";

type GlassRevealOpeningProps = {
  opened: boolean;
  brideName: string;
  groomName: string;
};

export function GlassRevealOpening({
  opened,
  brideName,
  groomName,
}: GlassRevealOpeningProps) {
  const initials = `${brideName.charAt(0) || 'G'}&${groomName.charAt(0) || 'D'}`;

  return (
    <div className={`glass-opening-stage ${opened ? "opened" : ""} w-full h-full flex items-center justify-center`}>
      <div className="w-[280px] h-[360px] rounded-3xl bg-white/20 border border-white/40 backdrop-blur-md shadow-2xl flex flex-col items-center justify-center p-6 text-center select-none">
        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-2">Modern Davetiye</span>
        <div className="w-10 h-[1px] bg-slate-300 my-2" />
        <h3 className="font-serif text-slate-800 text-xl font-bold my-3 leading-snug">{brideName} ve {groomName}</h3>
        <div className="w-10 h-[1px] bg-slate-300 my-2" />
        <span className="text-slate-400 font-serif text-lg tracking-widest mt-2">{initials}</span>
      </div>
    </div>
  );
}
export default GlassRevealOpening;
