'use client';

import React, { useState, useEffect } from 'react';
import { Guest } from './types';
import GuestTable from './GuestTable';
import GuestFilters from './GuestFilters';
import GuestFormDialog from './GuestFormDialog';
import GuestImportDialog from './GuestImportDialog';
import GuestExportDialog from './GuestExportDialog';
import GuestBulkActions from './GuestBulkActions';

export default function GuestManagementTab({ weddingId }: { weddingId: string }) {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | undefined>(undefined);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const fetchGuests = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/guests?wedding_id=${weddingId}`);
      if (res.ok) {
        const data = await res.json();
        setGuests(data.guests);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    fetchGuests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weddingId]);


  const handleRenew = async (guestId: string) => {
    try {
      const res = await fetch(`/api/guests/${guestId}/renew`, { method: 'POST' });
      if (res.ok) {
        fetchGuests();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRevoke = async (guestId: string) => {
    try {
      const res = await fetch(`/api/guests/${guestId}/revoke`, { method: 'POST' });
      if (res.ok) {
        fetchGuests();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleEdit = (guest: Guest) => {
    setEditingGuest(guest);
    setIsFormOpen(true);
  };

  const handleDelete = async (guestId: string) => {
    try {
      const res = await fetch(`/api/guests/${guestId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchGuests();
      } else {
        alert('Misafir silinirken bir hata oluştu.');
      }
    } catch (e) {
      console.error(e);
      alert('Misafir silinirken bir hata oluştu.');
    }
  };

  const filteredGuests = guests.filter(g => 
    `${g.first_name} ${g.last_name}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-xl font-semibold">Misafir Yönetimi</h2>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setIsImportOpen(true)} className="px-4 py-2 border rounded-md text-sm">İçe Aktar (CSV/XLSX)</button>
          <button onClick={() => setIsExportOpen(true)} className="px-4 py-2 border rounded-md text-sm">Dışa Aktar</button>
          <button onClick={() => {
            setEditingGuest(undefined);
            setIsFormOpen(true);
          }} className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm">+ Yeni Misafir</button>
        </div>
      </div>
      
      <GuestFilters search={search} setSearch={setSearch} />
      
      <GuestBulkActions />

      {loading ? (
        <div className="text-center py-10">Yükleniyor...</div>
      ) : (
        <GuestTable 
          guests={filteredGuests} 
          onRenew={handleRenew} 
          onRevoke={handleRevoke} 
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {isFormOpen && (
        <GuestFormDialog 
          weddingId={weddingId} 
          initialData={editingGuest}
          onClose={() => {
            setIsFormOpen(false);
            setEditingGuest(undefined);
          }} 
          onSuccess={() => { 
            setIsFormOpen(false); 
            setEditingGuest(undefined);
            fetchGuests(); 
          }} 
        />
      )}

      {isImportOpen && (
        <GuestImportDialog 
          weddingId={weddingId} 
          onClose={() => setIsImportOpen(false)} 
          onSuccess={() => { setIsImportOpen(false); fetchGuests(); }} 
        />
      )}

      {isExportOpen && (
        <GuestExportDialog 
          guests={guests} 
          onClose={() => setIsExportOpen(false)} 
        />
      )}
    </div>
  );
}
