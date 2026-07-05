import React from "react";

type SpotlightOpeningProps = {
  opened: boolean;
  brideName: string;
  groomName: string;
};

export function SpotlightOpening({
  opened,
  brideName,
  groomName,
}: SpotlightOpeningProps) {
  return (
    <div className={`spotlight-opening-stage ${opened ? "opened" : ""} w-full h-full flex items-center justify-center`}>
      <div className="spotlight-beam" />
      <div className="z-10 text-center select-none text-white p-6">
        <span className="text-[10px] text-amber-300 uppercase tracking-[0.25em] block mb-2">Davetli Listesi Girişi</span>
        <h3 className="font-serif text-2xl md:text-4xl text-white drop-shadow-lg leading-tight">
          {brideName} <span className="text-amber-300">&</span> {groomName}
        </h3>
      </div>
    </div>
  );
}
export default SpotlightOpening;
