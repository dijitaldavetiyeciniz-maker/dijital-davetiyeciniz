'use client';

import React, { useState } from 'react';
import { GuestGroup } from './types';
import { Trash2, RefreshCw, Users } from 'lucide-react';

export default function GuestBulkActions({
  selectedCount,
  onAction,
  groups
}: {
  selectedCount: number;
  onAction: (action: string, payload?: any) => void;
  groups: GuestGroup[];
}) {
  const [selectedGroup, setSelectedGroup] = useState<string>('');

  if (selectedCount === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 bg-blue-50 p-3 rounded-md border border-blue-100">
      <span className="text-sm font-medium text-blue-800">{selectedCount} misafir seçili</span>
      <div className="flex-1"></div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 border border-slate-300 rounded-md bg-white pr-1">
          <select 
            value={selectedGroup}
            onChange={e => setSelectedGroup(e.target.value)}
            className="px-2 py-1.5 text-sm bg-transparent outline-none"
          >
            <option value="">Grup Seç</option>
            {groups.map(g => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
          <button 
            onClick={() => {
              if (selectedGroup) {
                onAction('bulk_assign_group', { group_id: selectedGroup });
              } else {
                alert('Lütfen bir grup seçin.');
              }
            }}
            className="flex items-center gap-1 px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm rounded transition-colors"
          >
            <Users className="w-4 h-4" /> Ata
          </button>
        </div>

        <button 
          onClick={() => {
            if (confirm(`Seçili ${selectedCount} misafirin linkini yenilemek istediğinize emin misiniz?`)) {
              onAction('bulk_renew');
            }
          }}
          className="flex items-center gap-1 px-3 py-1.5 bg-orange-100 hover:bg-orange-200 text-orange-700 text-sm rounded-md transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Yenile
        </button>

        <button 
          onClick={() => {
            if (confirm(`Seçili ${selectedCount} misafiri silmek istediğinize emin misiniz?`)) {
              onAction('bulk_delete');
            }
          }}
          className="flex items-center gap-1 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-sm rounded-md transition-colors"
        >
          <Trash2 className="w-4 h-4" /> Sil
        </button>
      </div>
    </div>
  );
}
