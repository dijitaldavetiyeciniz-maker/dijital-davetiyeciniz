import React from "react";

type BookOpeningProps = {
  opened: boolean;
  brideName: string;
  groomName: string;
  eventDate?: string;
  theme: string;
};

export function BookOpening({
  opened,
  brideName,
  groomName,
  eventDate,
  theme,
}: BookOpeningProps) {
  return (
    <div className={`book-opening-stage ${opened ? "opened" : ""} w-full h-full`}>
      <div className={`book-opening-cover book-theme-${theme} select-none`}>
        <span className="text-[10px] uppercase tracking-[0.25em] opacity-80 mb-2">Düğün Davetiyesi</span>
        <div className="w-12 h-[1px] bg-[#dfc384] my-3" />
        <h3 className="font-serif text-2xl text-center leading-snug my-2">
          {brideName} <br /> & <br /> {groomName}
        </h3>
        <div className="w-12 h-[1px] bg-[#dfc384] my-3" />
        {eventDate && <span className="text-xs font-serif tracking-wider opacity-90">{eventDate}</span>}
      </div>
    </div>
  );
}
export default BookOpening;
