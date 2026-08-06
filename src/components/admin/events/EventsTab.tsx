'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Plus, Edit2, Trash2, Globe } from 'lucide-react';

interface Event {
  id: string;
  wedding_id: string;
  type: string;
  title: string;
  start_time: string;
  end_time?: string | null;
  timezone: string;
  venue_name?: string | null;
  venue_address?: string | null;
  google_maps_url?: string | null;
  description?: string | null;
}

export default function EventsTab({ weddingId }: { weddingId: string }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Partial<Event>>({
    type: 'düğün',
    timezone: 'Europe/Istanbul',
    title: ''
  });

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/events?wedding_id=${weddingId}`);
      const data = await res.json();
      if (res.ok) setEvents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
    fetchEvents();
  }, [weddingId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isNew = !currentEvent.id;
      const url = isNew ? '/api/events' : `/api/events/${currentEvent.id}`;
      const method = isNew ? 'POST' : 'PUT';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...currentEvent, wedding_id: weddingId })
      });
      
      if (!res.ok) {
        const d = await res.json();
        alert(d.error || 'Hata oluştu');
        return;
      }
      
      setIsEditing(false);
      setCurrentEvent({ type: 'düğün', timezone: 'Europe/Istanbul', title: '' });
      fetchEvents();
    } catch (err) {
      alert('Beklenmedik bir hata oluştu');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu etkinliği silmek istediğinize emin misiniz? (Bağlı masa ve oturma planları da silinir)')) return;
    try {
      const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
      if (res.ok) fetchEvents();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Yükleniyor...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Program ve Etkinlikler</h3>
          <p className="text-sm text-slate-500">Düğün, Kına, After Party gibi tüm program akışınızı buradan yönetebilirsiniz.</p>
        </div>
        <button 
          onClick={() => {
            setCurrentEvent({ type: 'düğün', timezone: 'Europe/Istanbul', title: '' });
            setIsEditing(true);
          }}
          className="flex items-center px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition"
        >
          <Plus className="w-4 h-4 mr-2" />
          Yeni Etkinlik
        </button>
      </div>

      {isEditing && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-rose-200 mb-6">
          <h4 className="text-md font-bold mb-4">{currentEvent.id ? 'Etkinliği Düzenle' : 'Yeni Etkinlik Ekle'}</h4>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Başlık (Örn: Ana Düğün Töreni)</label>
                <input required type="text" value={currentEvent.title || ''} onChange={e => setCurrentEvent({...currentEvent, title: e.target.value})} className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Tür</label>
                <select value={currentEvent.type || 'düğün'} onChange={e => setCurrentEvent({...currentEvent, type: e.target.value})} className="w-full px-3 py-2 border rounded-md bg-white">
                  <option value="düğün">Düğün</option>
                  <option value="kına">Kına</option>
                  <option value="nişan">Nişan</option>
                  <option value="after_party">After Party</option>
                  <option value="diğer">Diğer</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Başlangıç Zamanı</label>
                <input required type="datetime-local" value={currentEvent.start_time ? new Date(new Date(currentEvent.start_time).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''} onChange={e => setCurrentEvent({...currentEvent, start_time: new Date(e.target.value).toISOString()})} className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Bitiş Zamanı (Opsiyonel)</label>
                <input type="datetime-local" value={currentEvent.end_time ? new Date(new Date(currentEvent.end_time).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''} onChange={e => setCurrentEvent({...currentEvent, end_time: e.target.value ? new Date(e.target.value).toISOString() : null})} className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Zaman Dilimi (Timezone)</label>
                <input required type="text" value={currentEvent.timezone || 'Europe/Istanbul'} onChange={e => setCurrentEvent({...currentEvent, timezone: e.target.value})} className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Mekân Adı</label>
                <input type="text" value={currentEvent.venue_name || ''} onChange={e => setCurrentEvent({...currentEvent, venue_name: e.target.value})} className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Açık Adres</label>
                <textarea rows={2} value={currentEvent.venue_address || ''} onChange={e => setCurrentEvent({...currentEvent, venue_address: e.target.value})} className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Google Haritalar Linki (URL)</label>
                <input type="url" value={currentEvent.google_maps_url || ''} onChange={e => setCurrentEvent({...currentEvent, google_maps_url: e.target.value})} className="w-full px-3 py-2 border rounded-md" placeholder="https://goo.gl/maps/..." />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Ekstra Açıklama</label>
                <textarea rows={2} value={currentEvent.description || ''} onChange={e => setCurrentEvent({...currentEvent, description: e.target.value})} className="w-full px-3 py-2 border rounded-md" />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition">
                İptal
              </button>
              <button type="submit" className="px-4 py-2 bg-rose-600 text-white rounded-lg font-medium hover:bg-rose-700 transition">
                Kaydet
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {events.length === 0 && !isEditing && (
          <div className="col-span-2 p-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">Henüz bir etkinlik eklemediniz.</p>
            <p className="text-sm text-slate-400 mt-1">Takvim ve lokasyon bilgilerini oluşturmak için yeni etkinlik ekleyin.</p>
          </div>
        )}
        
        {events.map(ev => (
          <div key={ev.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 relative group hover:border-rose-300 transition">
            <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => { setCurrentEvent(ev); setIsEditing(true); }} className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(ev.id)} className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <span className="inline-block px-2.5 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded-full mb-3 capitalize">
              {ev.type}
            </span>
            <h4 className="text-lg font-bold text-slate-800">{ev.title}</h4>
            
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
                <div>
                  <span className="font-semibold block">{new Date(ev.start_time).toLocaleString('tr-TR')}</span>
                  {ev.end_time && <span className="text-xs text-slate-500">Bitiş: {new Date(ev.end_time).toLocaleString('tr-TR')}</span>}
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Globe className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
                <span className="text-xs">{ev.timezone}</span>
              </div>
              {ev.venue_name && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
                  <div>
                    <span className="font-semibold block">{ev.venue_name}</span>
                    {ev.venue_address && <span className="text-xs text-slate-500 block mt-0.5">{ev.venue_address}</span>}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
