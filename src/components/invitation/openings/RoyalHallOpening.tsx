import React from "react";

type RoyalHallOpeningProps = {
  opened: boolean;
  brideName: string;
  groomName: string;
};

export function RoyalHallOpening({
  opened,
  brideName,
  groomName,
}: RoyalHallOpeningProps) {
  const initials = `${brideName.charAt(0) || 'G'}&${groomName.charAt(0) || 'D'}`;

  return (
    <div className={`hall-opening-stage ${opened ? "opened" : ""} w-full h-full flex items-center justify-center`}>
      <div className="hall-perspective-grid" />
      <div className="z-10 text-center select-none text-white p-6">
        <h4 className="text-[10px] text-amber-400 uppercase tracking-[0.3em] mb-4">Görkemli Kraliyet Salonu</h4>
        <h3 className="font-serif text-3xl text-white drop-shadow-lg leading-tight font-extrabold">
          {brideName} <span className="text-amber-400">&</span> {groomName}
        </h3>
        <div className="w-16 h-[1px] bg-amber-400/50 mx-auto my-4" />
        <span className="text-sm tracking-[0.2em] text-slate-300 block">{initials}</span>
      </div>
    </div>
  );
}
export default RoyalHallOpening;
