'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import { GuestGroup } from './types';

export default function GroupManagementDialog({ 
  weddingId, 
  onClose,
  onGroupsChanged
}: { 
  weddingId: string;
  onClose: () => void;
  onGroupsChanged: () => void;
}) {
  const [groups, setGroups] = useState<GuestGroup[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newGroupName, setNewGroupName] = useState('');
  const [adding, setAdding] = useState(false);
  
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/guest-groups?wedding_id=${weddingId}`);
      if (res.ok) {
        const data = await res.json();
        setGroups(data.groups);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weddingId]);

  const handleAddGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    setAdding(true);
    
    try {
      const res = await fetch('/api/guest-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wedding_id: weddingId, name: newGroupName.trim() })
      });
      
      if (res.ok) {
        setNewGroupName('');
        fetchGroups();
        onGroupsChanged();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const handleUpdateGroup = async (id: string) => {
    if (!editingName.trim()) return;
    
    try {
      const res = await fetch(`/api/guest-groups/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editingName.trim() })
      });
      
      if (res.ok) {
        setEditingGroupId(null);
        fetchGroups();
        onGroupsChanged();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteGroup = async (id: string) => {
    if (!confirm('Bu grubu silmek istediğinize emin misiniz? Gruptaki misafirler silinmez, sadece gruptan çıkarılırlar.')) {
      return;
    }
    
    try {
      const res = await fetch(`/api/guest-groups/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchGroups();
        onGroupsChanged();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Grupları Yönet</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        
        <form onSubmit={handleAddGroup} className="flex gap-2 mb-6">
          <input 
            type="text" 
            value={newGroupName} 
            onChange={(e) => setNewGroupName(e.target.value)} 
            placeholder="Yeni grup adı (Örn: Aile, İş Arkadaşları)" 
            className="flex-1 p-2 border rounded-md text-sm"
            required
            disabled={adding}
          />
          <button 
            type="submit" 
            disabled={adding || !newGroupName.trim()} 
            className="px-3 py-2 bg-blue-600 text-white rounded-md flex items-center justify-center disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
          </button>
        </form>

        <div className="flex-1 overflow-y-auto min-h-[200px]">
          {loading ? (
            <div className="text-center py-4 text-slate-500 text-sm">Yükleniyor...</div>
          ) : groups.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm bg-slate-50 rounded border border-dashed">
              Henüz hiç grup oluşturulmamış.
            </div>
          ) : (
            <ul className="space-y-2">
              {groups.map(group => (
                <li key={group.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50 transition-colors">
                  {editingGroupId === group.id ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input 
                        type="text" 
                        value={editingName} 
                        onChange={(e) => setEditingName(e.target.value)}
                        className="flex-1 p-1.5 border rounded text-sm"
                        autoFocus
                      />
                      <button onClick={() => handleUpdateGroup(group.id)} className="p-1.5 text-green-600 hover:bg-green-100 rounded">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => setEditingGroupId(null)} className="p-1.5 text-slate-500 hover:bg-slate-200 rounded">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium text-slate-700">{group.name}</span>
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => {
                            setEditingGroupId(group.id);
                            setEditingName(group.name);
                          }} 
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Düzenle"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteGroup(group.id)} 
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-slate-900 text-white rounded-md text-sm">
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
