'use client';

import React, { useState, useEffect } from 'react';
import { Guest, GuestGroup } from './types';
import GuestTable from './GuestTable';
import GuestFilters from './GuestFilters';
import GuestFormDialog from './GuestFormDialog';
import GuestImportDialog from './GuestImportDialog';
import GuestExportDialog from './GuestExportDialog';
import GuestBulkActions from './GuestBulkActions';
import GroupManagementDialog from './GroupManagementDialog';

export default function GuestManagementTab({ weddingId }: { weddingId: string }) {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [groups, setGroups] = useState<GuestGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [rsvpFilter, setRsvpFilter] = useState('all');
  const [groupFilter, setGroupFilter] = useState('all');
  const [selectedGuests, setSelectedGuests] = useState<string[]>([]);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | undefined>(undefined);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isGroupManageOpen, setIsGroupManageOpen] = useState(false);

  const fetchGuestsAndGroups = async () => {
    setLoading(true);
    try {
      const [guestsRes, groupsRes] = await Promise.all([
        fetch(`/api/guests?wedding_id=${weddingId}`),
        fetch(`/api/guest-groups?wedding_id=${weddingId}`)
      ]);
      
      if (guestsRes.ok) {
        const data = await guestsRes.json();
        setGuests(data.guests);
      }
      
      if (groupsRes.ok) {
        const data = await groupsRes.json();
        setGroups(data.groups);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    fetchGuestsAndGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weddingId]);


  const handleRenew = async (guestId: string) => {
    try {
      const res = await fetch(`/api/guests/${guestId}/renew`, { method: 'POST' });
      if (res.ok) {
        fetchGuestsAndGroups();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRevoke = async (guestId: string) => {
    try {
      const res = await fetch(`/api/guests/${guestId}/revoke`, { method: 'POST' });
      if (res.ok) {
        fetchGuestsAndGroups();
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
        fetchGuestsAndGroups();
      } else {
        alert('Misafir silinirken bir hata oluştu.');
      }
    } catch (e) {
      console.error(e);
      alert('Misafir silinirken bir hata oluştu.');
    }
  };

  const handleToggleSelect = (guestId: string) => {
    setSelectedGuests(prev => 
      prev.includes(guestId) ? prev.filter(id => id !== guestId) : [...prev, guestId]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedGuests.length === filteredGuests.length && filteredGuests.length > 0) {
      setSelectedGuests([]);
    } else {
      setSelectedGuests(filteredGuests.map(g => g.id));
    }
  };

  const handleBulkAction = async (action: string, payload?: any) => {
    if (selectedGuests.length === 0) return;
    
    try {
      const res = await fetch('/api/guests/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wedding_id: weddingId,
          guest_ids: selectedGuests,
          action,
          ...payload
        })
      });

      if (res.ok) {
        setSelectedGuests([]); // İşlem bitince seçimi temizle
        fetchGuestsAndGroups();
      } else {
        alert('Toplu işlem sırasında bir hata oluştu.');
      }
    } catch (e) {
      console.error(e);
      alert('Toplu işlem sırasında bir hata oluştu.');
    }
  };

  const filteredGuests = guests.filter(g => {
    const matchSearch = `${g.first_name} ${g.last_name}`.toLowerCase().includes(search.toLowerCase());
    
    // RSVP Durumu: (Eğer g.rsvp_status null/undefined ise db'de 'pending' demektir)
    const currentRsvp = g.rsvp_status || 'pending';
    const matchRsvp = rsvpFilter === 'all' || currentRsvp === rsvpFilter;

    const matchGroup = groupFilter === 'all' || g.group_id === groupFilter;

    return matchSearch && matchRsvp && matchGroup;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-xl font-semibold">Misafir Yönetimi</h2>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setIsGroupManageOpen(true)} className="px-4 py-2 border rounded-md text-sm bg-slate-50">Gruplar</button>
          <button onClick={() => setIsImportOpen(true)} className="px-4 py-2 border rounded-md text-sm">İçe Aktar (CSV/XLSX)</button>
          <button onClick={() => setIsExportOpen(true)} className="px-4 py-2 border rounded-md text-sm">Dışa Aktar</button>
          <button onClick={() => {
            setEditingGuest(undefined);
            setIsFormOpen(true);
          }} className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm">+ Yeni Misafir</button>
        </div>
      </div>
      
      <GuestFilters 
        search={search} 
        setSearch={setSearch} 
        rsvpFilter={rsvpFilter}
        setRsvpFilter={setRsvpFilter}
        groupFilter={groupFilter}
        setGroupFilter={setGroupFilter}
        groups={groups}
      />
      
      <GuestBulkActions 
        selectedCount={selectedGuests.length}
        onAction={handleBulkAction}
        groups={groups}
      />

      {loading ? (
        <div className="text-center py-10">Yükleniyor...</div>
      ) : (
        <GuestTable 
          guests={filteredGuests} 
          onRenew={handleRenew} 
          onRevoke={handleRevoke} 
          onEdit={handleEdit}
          onDelete={handleDelete}
          selectedGuests={selectedGuests}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
        />
      )}

      {isFormOpen && (
        <GuestFormDialog 
          weddingId={weddingId} 
          initialData={editingGuest}
          groups={groups}
          onClose={() => {
            setIsFormOpen(false);
            setEditingGuest(undefined);
          }} 
          onSuccess={() => { 
            setIsFormOpen(false); 
            setEditingGuest(undefined);
            fetchGuestsAndGroups(); 
          }} 
        />
      )}

      {isImportOpen && (
        <GuestImportDialog 
          weddingId={weddingId} 
          onClose={() => setIsImportOpen(false)} 
          onSuccess={() => { setIsImportOpen(false); fetchGuestsAndGroups(); }} 
        />
      )}

      {isExportOpen && (
        <GuestExportDialog 
          guests={guests} 
          onClose={() => setIsExportOpen(false)} 
        />
      )}

      {isGroupManageOpen && (
        <GroupManagementDialog 
          weddingId={weddingId} 
          onClose={() => setIsGroupManageOpen(false)} 
          onGroupsChanged={() => fetchGuestsAndGroups()} 
        />
      )}
    </div>
  );
}
