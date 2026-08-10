'use client';

import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { GripVertical, X } from 'lucide-react';

interface Props {
  id: string;
  guest: any;
  isAssigned?: boolean;
  tables: any[];
  onUnassign?: () => void;
  onFallbackAssign?: (tableId: string) => void;
}

export default function DraggableGuest({ id, guest, isAssigned, tables, onUnassign, onFallbackAssign }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id,
    data: { guest }
  });

  const [showDropdown, setShowDropdown] = useState(false);

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 50,
  } : undefined;

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`relative flex items-center justify-between p-2.5 rounded-lg border text-sm transition-all print:border-none print:p-1 print:text-black
        ${isDragging ? 'bg-rose-50 border-rose-300 opacity-80 scale-105 shadow-md' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}
      `}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0" {...listeners} {...attributes}>
        <GripVertical className="w-4 h-4 text-slate-400 shrink-0 cursor-grab print:hidden" />
        <div className="truncate flex-1">
          <span className="font-semibold text-slate-800 print:text-black block truncate">
            {guest.first_name} {guest.last_name}
          </span>
          <span className="text-[10px] text-slate-500 print:hidden uppercase font-bold tracking-wider">
            {guest.rsvp_status === 'attending' ? 'Katılıyor' : guest.rsvp_status === 'undecided' ? 'Kararsız' : ''}
          </span>
        </div>
        <span className="text-xs bg-white border border-slate-200 px-1.5 py-0.5 rounded font-medium shrink-0 print:border-none print:p-0 print:bg-transparent print:text-black">
          {guest.total_seats} Kişi
        </span>
      </div>
      
      {/* Fallback & Controls - HIDDEN IN PRINT */}
      <div className="flex items-center gap-1 ml-2 shrink-0 print:hidden relative">
        {!isAssigned && onFallbackAssign && (
          <div className="relative">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowDropdown(!showDropdown); }}
              className="px-2 py-1 text-xs bg-white border border-slate-200 rounded hover:bg-slate-50 text-slate-600"
            >
              Ata
            </button>
            {showDropdown && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-slate-200 shadow-xl rounded-md z-[100] max-h-48 overflow-y-auto">
                <div className="p-1.5 border-b bg-slate-50 text-[10px] font-bold text-slate-500 uppercase">Masa Seçin</div>
                {tables.map(t => (
                  <button 
                    key={t.id}
                    onClick={() => { setShowDropdown(false); onFallbackAssign(t.id); }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-rose-50 text-slate-700"
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        
        {isAssigned && onUnassign && (
          <button 
            onClick={onUnassign}
            className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition"
            title="Masadan Kaldır"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
