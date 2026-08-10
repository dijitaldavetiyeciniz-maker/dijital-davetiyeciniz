'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Printer, Download, Users, Trash2, Edit2, AlertCircle } from 'lucide-react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay
} from '@dnd-kit/core';
import { 
  SortableContext, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import DroppableTable from './DroppableTable';
import DraggableGuest from './DraggableGuest';

interface SeatingTabProps {
  weddingId: string;
}

export default function SeatingTab({ weddingId }: SeatingTabProps) {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  
  const [tables, setTables] = useState<any[]>([]);
  const [guests, setGuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreatingTable, setIsCreatingTable] = useState(false);
  const [newTable, setNewTable] = useState({ name: '', capacity: 8 });

  const computedGuests = useMemo(() => {
    return guests.filter(g => g.rsvp_status === 'attending' || g.rsvp_status === 'undecided').map(g => {
      const adults = 1 + (g.plus_ones_confirmed || g.plus_ones_allowed || 0);
      const children = g.children_count || 0;
      return { ...g, total_seats: adults + children };
    });
  }, [guests]);

  const fetchData = async (eventId: string) => {
    setLoading(true);
    try {
      const tRes = await fetch(`/api/tables?wedding_id=${weddingId}&event_id=${eventId}`);
      if (tRes.ok) {
        setTables(await tRes.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const [eRes, gRes] = await Promise.all([
        fetch(`/api/events?wedding_id=${weddingId}`),
        fetch(`/api/guests?wedding_id=${weddingId}`)
      ]);
      
      if (gRes.ok) {
        setGuests(await gRes.json());
      }

      if (eRes.ok) {
        const evs = await eRes.json();
        setEvents(evs);
        if (evs.length > 0) {
          setSelectedEventId(evs[0].id);
          fetchData(evs[0].id);
        } else {
          setLoading(false);
        }
      }
    };
    init();
  }, [weddingId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
    if (selectedEventId) fetchData(selectedEventId);
  }, [selectedEventId]);

  const handleCreateTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventId) return;
    
    try {
      const res = await fetch('/api/tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wedding_id: weddingId,
          event_id: selectedEventId,
          name: newTable.name,
          capacity: newTable.capacity
        })
      });
      if (res.ok) {
        setIsCreatingTable(false);
        setNewTable({ name: '', capacity: 8 });
        fetchData(selectedEventId);
      } else {
        const d = await res.json();
        alert(d.error || 'Hata');
      }
    } catch(e) {
      alert('Hata');
    }
  };

  const handleDeleteTable = async (id: string) => {
    if(!confirm('Masayı silmek istediğinize emin misiniz? Tüm oturan misafirler boşa düşecektir.')) return;
    try {
      await fetch(`/api/tables/${id}`, { method: 'DELETE' });
      fetchData(selectedEventId);
    } catch(e) {}
  };

  const handleAssign = async (guestId: string, tableId: string, seatCount: number) => {
    try {
      const res = await fetch('/api/seats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wedding_id: weddingId,
          event_id: selectedEventId,
          table_id: tableId,
          guest_id: guestId,
          seat_count: seatCount
        })
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Kapasite aşıldı veya atama başarısız.');
        return false;
      }
      return true;
    } catch (e) {
      alert('Ağ hatası.');
      return false;
    }
  };

  const handleUnassign = async (assignmentId: string) => {
    try {
      const res = await fetch('/api/seats', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignment_id: assignmentId })
      });
      if (res.ok) {
        fetchData(selectedEventId);
      }
    } catch(e) {}
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    
    const guestId = active.id.toString().replace('guest-', '');
    const targetTableId = over.id.toString().replace('table-', '');
    
    if (targetTableId === 'unassigned') {
      // Find assignment
      for (const t of tables) {
        const a = t.guest_seat_assignments?.find((as: any) => as.guest_id === guestId);
        if (a) {
          await handleUnassign(a.id);
          break;
        }
      }
      return;
    }

    const guest = computedGuests.find(g => g.id === guestId);
    if (!guest) return;

    // Direct assignment
    const success = await handleAssign(guestId, targetTableId, guest.total_seats);
    if (success) {
      fetchData(selectedEventId);
    }
  };

  // derived state for unassigned guests
  const assignedGuestIds = new Set(
    tables.flatMap(t => t.guest_seat_assignments?.map((a:any) => a.guest_id) || [])
  );
  
  const unassignedGuests = computedGuests.filter(g => !assignedGuestIds.has(g.id));

  const exportCSV = () => {
    let csv = 'Etkinlik,Masa,Kapasite,Misafir,Davetli Sayisi,Durum\n';
    const evtName = events.find(e => e.id === selectedEventId)?.title || 'Etkinlik';
    
    tables.forEach(t => {
      if (!t.guest_seat_assignments || t.guest_seat_assignments.length === 0) {
         csv += `"${evtName.replace(/"/g, '""')}","${t.name.replace(/"/g, '""')}",${t.capacity},Boş,0,-\n`;
      } else {
        t.guest_seat_assignments.forEach((a: any) => {
          const gName = `${a.guests?.first_name} ${a.guests?.last_name}`;
          csv += `"${evtName.replace(/"/g, '""')}","${t.name.replace(/"/g, '""')}",${t.capacity},"${gName.replace(/"/g, '""')}",${a.seat_count},"${a.guests?.rsvp_status}"\n`;
        });
      }
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "oturma_plani.csv";
    link.click();
  };

  const [activeId, setActiveId] = useState<string | null>(null);

  if (events.length === 0 && !loading) {
    return <div className="p-8 text-center bg-slate-50 border rounded-xl">Önce 'Etkinlikler' sekmesinden bir etkinlik oluşturmalısınız.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Admin Top Bar - HIDDEN IN PRINT */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200 print:hidden">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-800">Oturma Planı</h3>
          <p className="text-sm text-slate-500">Misafirleri sürükleyerek masalara atayabilirsiniz.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <select 
            value={selectedEventId}
            onChange={e => setSelectedEventId(e.target.value)}
            className="px-4 py-2 border rounded-lg font-medium bg-slate-50 text-slate-700"
          >
            {events.map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
          </select>

          <button onClick={() => window.print()} className="flex items-center px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg font-medium transition">
            <Printer className="w-4 h-4 mr-2" /> PDF / Yazdır
          </button>
          
          <button onClick={exportCSV} className="flex items-center px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg font-medium transition">
            <Download className="w-4 h-4 mr-2" /> CSV
          </button>

          <button onClick={() => setIsCreatingTable(true)} className="flex items-center px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium transition">
            <Plus className="w-4 h-4 mr-2" /> Masa Ekle
          </button>
        </div>
      </div>

      {isCreatingTable && (
        <form onSubmit={handleCreateTable} className="bg-white p-6 rounded-xl border border-blue-200 shadow-sm flex items-end gap-4 print:hidden">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-600 mb-1">Masa Adı</label>
            <input required type="text" value={newTable.name} onChange={e => setNewTable({...newTable, name: e.target.value})} className="w-full px-3 py-2 border rounded-md" placeholder="Örn: Aile Masası" />
          </div>
          <div className="w-32">
            <label className="block text-xs font-semibold text-slate-600 mb-1">Kapasite (Kişi)</label>
            <input required type="number" min={1} value={newTable.capacity} onChange={e => setNewTable({...newTable, capacity: parseInt(e.target.value)})} className="w-full px-3 py-2 border rounded-md" />
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700">Kaydet</button>
          <button type="button" onClick={() => setIsCreatingTable(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md font-medium hover:bg-slate-200">İptal</button>
        </form>
      )}

      {/* PRINT HEADER - ONLY VISIBLE IN PRINT */}
      <div className="hidden print:block text-center mb-8">
        <h1 className="text-2xl font-bold text-black">{events.find(e => e.id === selectedEventId)?.title} - Oturma Planı</h1>
        <p className="text-gray-600 mt-2">Toplam Masa: {tables.length}</p>
      </div>

      {/* DND Context */}
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={(e) => setActiveId(e.active.id.toString())}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Left: Unassigned Guests */}
          <div className="lg:col-span-1 print:hidden">
            <DroppableTable id="unassigned" title={`Atanmamış Misafirler (${unassignedGuests.length})`} isSidebar>
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {unassignedGuests.map(g => (
                  <DraggableGuest 
                    key={g.id} 
                    id={`guest-${g.id}`} 
                    guest={g} 
                    tables={tables}
                    onFallbackAssign={(tId) => { handleAssign(g.id, tId, g.total_seats).then(ok => { if (ok) fetchData(selectedEventId); }); }}
                  />
                ))}
                {unassignedGuests.length === 0 && (
                  <div className="text-center p-4 text-sm text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
                    Tüm misafirler atandı!
                  </div>
                )}
              </div>
            </DroppableTable>
          </div>

          {/* Right: Tables Grid */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 print:grid-cols-2 print:block print:w-full">
            {tables.map(table => {
              const currentOccupancy = table.guest_seat_assignments?.reduce((sum:number, a:any) => sum + a.seat_count, 0) || 0;
              const isOver = currentOccupancy > table.capacity;
              
              return (
                <DroppableTable 
                  key={table.id} 
                  id={`table-${table.id}`} 
                  title={table.name} 
                  capacity={table.capacity}
                  occupancy={currentOccupancy}
                  onDelete={() => handleDeleteTable(table.id)}
                >
                  <div className="space-y-2 min-h-[100px]">
                    {table.guest_seat_assignments?.map((a: any) => (
                      <DraggableGuest 
                        key={a.guest_id} 
                        id={`guest-${a.guest_id}`} 
                        guest={{...a.guests, total_seats: a.seat_count}}
                        isAssigned
                        onUnassign={() => handleUnassign(a.id)}
                        tables={tables}
                        onFallbackAssign={(tId) => { handleAssign(a.guest_id, tId, a.seat_count).then(ok => { if (ok) fetchData(selectedEventId); }); }}
                      />
                    ))}
                    {(!table.guest_seat_assignments || table.guest_seat_assignments.length === 0) && (
                      <div className="text-center py-6 text-sm text-slate-400 print:hidden">
                        Misafiri buraya sürükleyin
                      </div>
                    )}
                  </div>
                </DroppableTable>
              );
            })}
          </div>

        </div>

        <DragOverlay>
          {activeId ? (
            <div className="bg-white px-4 py-2 rounded-lg shadow-xl border border-rose-200 text-sm font-medium opacity-90 cursor-grabbing">
              Taşınıyor...
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
