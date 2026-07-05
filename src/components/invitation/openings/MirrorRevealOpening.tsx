import React from "react";

type MirrorRevealOpeningProps = {
  opened: boolean;
  brideName: string;
  groomName: string;
};

export function MirrorRevealOpening({
  opened,
  brideName,
  groomName,
}: MirrorRevealOpeningProps) {
  const initials = `${brideName.charAt(0) || 'G'}&${groomName.charAt(0) || 'D'}`;

  return (
    <div className={`mirror-opening-stage ${opened ? "opened" : ""} w-full h-full`}>
      <div className="mirror-frame flex flex-col items-center justify-center p-6 text-center select-none">
        <span className="text-[10px] text-amber-500/80 uppercase tracking-widest font-semibold mb-2">Mutluluğa Adım</span>
        <div className="w-8 h-[1px] bg-amber-400/50 my-2" />
        <h3 className="font-serif text-[#dfc384] text-xl font-bold my-3 leading-snug">{brideName} & {groomName}</h3>
        <div className="w-8 h-[1px] bg-amber-400/50 my-2" />
        <span className="text-amber-500/80 font-serif text-lg tracking-widest mt-2">{initials}</span>
      </div>
    </div>
  );
}
export default MirrorRevealOpening;
