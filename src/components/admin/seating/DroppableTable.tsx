'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Trash2 } from 'lucide-react';

interface Props {
  id: string;
  title: string;
  capacity?: number;
  occupancy?: number;
  isSidebar?: boolean;
  onDelete?: () => void;
  children: React.ReactNode;
}

export default function DroppableTable({ id, title, capacity, occupancy = 0, isSidebar, onDelete, children }: Props) {
  const { isOver, setNodeRef } = useDroppable({ id });

  const isOverCapacity = capacity && occupancy > capacity;

  if (isSidebar) {
    return (
      <div 
        ref={setNodeRef} 
        className={`bg-white rounded-xl shadow-sm border p-4 h-full ${isOver ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200'}`}
      >
        <h4 className="font-bold text-slate-800 mb-4 pb-2 border-b">{title}</h4>
        {children}
      </div>
    );
  }

  return (
    <div 
      ref={setNodeRef}
      className={`bg-white rounded-xl shadow-sm border p-4 transition-colors print:border-black print:shadow-none print:break-inside-avoid
        ${isOver ? 'border-blue-400 bg-blue-50/50' : 'border-slate-200'}
        ${isOverCapacity ? 'border-red-400 bg-red-50/30' : ''}
      `}
    >
      <div className="flex justify-between items-center mb-4 pb-2 border-b print:border-black">
        <h4 className="font-bold text-slate-800 print:text-black">{title}</h4>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-semibold px-2 py-1 rounded-md print:bg-transparent print:text-black print:p-0 ${
            isOverCapacity ? 'bg-red-100 text-red-700' : 
            occupancy === capacity ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
          }`}>
            {occupancy} / {capacity}
          </span>
          {onDelete && (
            <button onClick={onDelete} className="text-slate-400 hover:text-red-500 print:hidden transition">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}
