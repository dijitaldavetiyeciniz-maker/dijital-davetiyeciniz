import React from "react";

type CinematicZoomOpeningProps = {
  opened: boolean;
  brideName: string;
  groomName: string;
};

export function CinematicZoomOpening({
  opened,
  brideName,
  groomName,
}: CinematicZoomOpeningProps) {
  return (
    <div className={`zoom-opening-stage ${opened ? "opened" : ""} w-full h-full flex items-center justify-center`}>
      <div className="zoom-lens-border" />
      <div className="z-10 text-center select-none text-white p-6">
        <h3 className="font-serif text-3xl md:text-5xl tracking-widest font-extrabold text-[#dfc384] drop-shadow-md">
          {brideName} & {groomName}
        </h3>
        <p className="text-[10px] uppercase tracking-[0.3em] text-slate-300 mt-4">Düğün Davetine Giriş</p>
      </div>
    </div>
  );
}
export default CinematicZoomOpening;
