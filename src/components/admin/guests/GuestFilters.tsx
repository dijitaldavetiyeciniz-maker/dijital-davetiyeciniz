'use client';

import React from 'react';

export default function GuestFilters({ 
  search, 
  setSearch 
}: { 
  search: string, 
  setSearch: (s: string) => void 
}) {
  return (
    <div className="flex items-center space-x-4 bg-white p-4 rounded-md border">
      <div className="flex-1">
        <input 
          type="text" 
          placeholder="İsim veya soyisim ile ara..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-md px-3 py-2 text-sm"
        />
      </div>
      {/* Diğer filtreler (katılımcı durumu vb.) buraya eklenebilir */}
    </div>
  );
}
