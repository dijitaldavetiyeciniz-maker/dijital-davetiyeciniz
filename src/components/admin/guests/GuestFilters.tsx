'use client';

import React from 'react';
import { GuestGroup } from './types';

export default function GuestFilters({ 
  search, 
  setSearch,
  rsvpFilter,
  setRsvpFilter,
  groupFilter,
  setGroupFilter,
  groups
}: { 
  search: string, 
  setSearch: (s: string) => void,
  rsvpFilter: string,
  setRsvpFilter: (s: string) => void,
  groupFilter: string,
  setGroupFilter: (s: string) => void,
  groups: GuestGroup[]
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-md border">
      <div className="flex-1">
        <input 
          type="text" 
          placeholder="İsim veya soyisim ile ara..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-md px-3 py-2 text-sm"
        />
      </div>
      <div className="w-full sm:w-48">
        <select 
          value={groupFilter}
          onChange={(e) => setGroupFilter(e.target.value)}
          className="w-full border rounded-md px-3 py-2 text-sm"
        >
          <option value="all">Tüm Gruplar</option>
          {groups.map(g => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
      </div>
      <div className="w-full sm:w-48">
        <select 
          value={rsvpFilter}
          onChange={(e) => setRsvpFilter(e.target.value)}
          className="w-full border rounded-md px-3 py-2 text-sm"
        >
          <option value="all">Tüm RSVP Durumları</option>
          <option value="attending">Katılıyor</option>
          <option value="not_attending">Katılmıyor</option>
          <option value="undecided">Kararsız</option>
          <option value="pending">Bekliyor</option>
        </select>
      </div>
    </div>
  );
}
