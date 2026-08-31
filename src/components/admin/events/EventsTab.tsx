'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Plus, Edit2, Trash2, Globe, ArrowUp, ArrowDown, Users, Sparkles, Check, ChevronDown, ChevronUp, X, Heart, Music, Utensils, Star, Coffee } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export interface ProgramItem {
  id: string;
  time: string;
  title: string;
  description?: string;
  icon?: string;
  orderIndex: number;
}

export interface EventItem {
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
  is_primary?: boolean;
  audience_type?: string;
  special_note?: string;
  is_visible?: boolean;
  order_index?: number;
  program_items?: ProgramItem[];
}

export function parseEventMeta(rawDescription?: string | null) {
  if (!rawDescription) {
    return {
      text: '',
      audience_type: 'all',
      special_note: '',
      is_visible: true,
      order_index: 0,
      program_items: [] as ProgramItem[]
    };
  }

  try {
    if (rawDescription.trim().startsWith('{')) {
      const parsed = JSON.parse(rawDescription);
      return {
        text: parsed.text || '',
        audience_type: parsed.audience_type || 'all',
        special_note: parsed.special_note || parsed.text || '',
        is_visible: parsed.is_visible !== false,
        order_index: parsed.order_index || 0,
        program_items: Array.isArray(parsed.program_items) ? parsed.program_items : []
      };
    }
  } catch (e) {}

  return {
    text: rawDescription,
    audience_type: 'all',
    special_note: rawDescription,
    is_visible: true,
    order_index: 0,
    program_items: [] as ProgramItem[]
  };
}

export function serializeEventMeta(meta: {
  text?: string;
  audience_type?: string;
  special_note?: string;
  is_visible?: boolean;
  order_index?: number;
  program_items?: ProgramItem[];
}) {
  return JSON.stringify({
    text: meta.special_note || meta.text || '',
    audience_type: meta.audience_type || 'all',
    special_note: meta.special_note || '',
    is_visible: meta.is_visible !== false,
    order_index: meta.order_index || 0,
    program_items: meta.program_items || []
  });
}

export default function EventsTab({ weddingId }: { weddingId: string }) {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditingModal, setIsEditingModal] = useState(false);
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  // Form State
  const [currentEvent, setCurrentEvent] = useState<Partial<EventItem>>({
    type: 'düğün',
    timezone: 'Europe/Istanbul',
    title: '',
    audience_type: 'all',
    special_note: '',
    is_visible: true,
    program_items: []
  });

  // Sub-program item modal state
  const [isProgModalOpen, setIsProgModalOpen] = useState(false);
  const [currentProgItem, setCurrentProgItem] = useState<Partial<ProgramItem>>({
    time: '19:00',
    title: '',
    description: '',
    icon: 'sparkles'
  });

  const fetchEvents = async () => {
    try {
      setLoading(true);
      let rawList: any[] = [];
      const res = await fetch(`/api/events?wedding_id=${weddingId}`);
      if (res.ok) {
        rawList = await res.json();
      } else {
        const { data } = await supabase
          .from('invitation_events')
          .select('*')
          .eq('wedding_id', weddingId)
          .order('start_time', { ascending: true });
        if (data) rawList = data;
      }

      if (Array.isArray(rawList)) {
        const enriched = rawList.map((ev: any) => {
          const meta = parseEventMeta(ev.description);
          return {
            ...ev,
            audience_type: meta.audience_type,
            special_note: meta.special_note,
            is_visible: meta.is_visible,
            order_index: meta.order_index,
            program_items: meta.program_items
          };
        });
        setEvents(enriched);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [weddingId]);

  const handleOpenNewEvent = () => {
    setCurrentEvent({
      type: 'düğün',
      timezone: 'Europe/Istanbul',
      title: '',
      start_time: new Date().toISOString(),
      venue_name: '',
      venue_address: '',
      google_maps_url: '',
      audience_type: 'all',
      special_note: '',
      is_visible: true,
      program_items: []
    });
    setIsEditingModal(true);
  };

  const handleEditEvent = (ev: EventItem) => {
    setCurrentEvent({ ...ev });
    setIsEditingModal(true);
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEvent.title?.trim()) {
      alert('Lütfen etkinlik başlığı girin.');
      return;
    }

    try {
      const isNew = !currentEvent.id;
      const url = isNew ? '/api/events' : `/api/events/${currentEvent.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const serializedDesc = serializeEventMeta({
        audience_type: currentEvent.audience_type,
        special_note: currentEvent.special_note,
        is_visible: currentEvent.is_visible,
        order_index: currentEvent.order_index || 0,
        program_items: currentEvent.program_items || []
      });

      const payload = {
        wedding_id: weddingId,
        type: currentEvent.type || 'düğün',
        title: currentEvent.title,
        start_time: currentEvent.start_time || new Date().toISOString(),
        end_time: currentEvent.end_time || null,
        timezone: currentEvent.timezone || 'Europe/Istanbul',
        venue_name: currentEvent.venue_name || null,
        venue_address: currentEvent.venue_address || null,
        google_maps_url: currentEvent.google_maps_url || null,
        description: serializedDesc,
        is_primary: !!currentEvent.is_primary
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const d = await res.json();
        alert(d.error || 'Hata oluştu');
        return;
      }

      setIsEditingModal(false);
      fetchEvents();
    } catch (err) {
      alert('Beklenmedik bir hata oluştu');
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Bu etkinliği silmek istediğinize emin misiniz? (Tüm program maddeleri ve bağlı oturma planları silinecektir)')) return;
    try {
      const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
      if (res.ok) fetchEvents();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMoveEvent = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === events.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...events];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;
    setEvents(reordered);
  };

  // Program Items Management
  const handleAddProgramItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProgItem.title?.trim()) {
      alert('Lütfen program maddesi başlığı girin.');
      return;
    }

    const currentList = currentEvent.program_items || [];
    const newItem: ProgramItem = {
      id: currentProgItem.id || `prog-${Date.now()}`,
      time: currentProgItem.time || '19:00',
      title: currentProgItem.title || '',
      description: currentProgItem.description || '',
      icon: currentProgItem.icon || 'sparkles',
      orderIndex: currentList.length
    };

    setCurrentEvent({
      ...currentEvent,
      program_items: [...currentList, newItem]
    });

    setIsProgModalOpen(false);
    setCurrentProgItem({ time: '19:00', title: '', description: '', icon: 'sparkles' });
  };

  const handleDeleteProgItem = (itemId: string) => {
    const updated = (currentEvent.program_items || []).filter(p => p.id !== itemId);
    setCurrentEvent({ ...currentEvent, program_items: updated });
  };

  const handleMoveProgItem = (index: number, direction: 'up' | 'down') => {
    const list = [...(currentEvent.program_items || [])];
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === list.length - 1) return;

    const target = direction === 'up' ? index - 1 : index + 1;
    const temp = list[index];
    list[index] = list[target];
    list[target] = temp;
    setCurrentEvent({ ...currentEvent, program_items: list });
  };

  if (loading) return <div className="p-8 text-center text-slate-500 text-xs">Etkinlikler yükleniyor...</div>;

  return (
    <div className="space-y-4 text-left">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-800">📅 Etkinlikler & Program Akışı</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Düğün, Kına, Nikâh, Mevlit gibi tüm etkinliklerinizi ve her birinin detaylı saat akışını oluşturun.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenNewEvent}
          className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Etkinlik Ekle</span>
        </button>
      </div>

      {/* Events List */}
      {events.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h4 className="text-xs font-bold text-slate-600 mb-1">Henüz etkinlik eklenmemiş</h4>
          <p className="text-[11px] text-slate-400 max-w-sm mx-auto mb-3">
            Davetiyenizde birden fazla etkinlik (örn: Nikâh, Kokteyl, Yemek, Kına Gecesi) ve saat akışı gösterebilirsiniz.
          </p>
          <button
            type="button"
            onClick={handleOpenNewEvent}
            className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:underline cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> İlk Etkinliğinizi Ekleyin
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((ev, idx) => {
            const isExpanded = expandedEventId === null || expandedEventId === ev.id;
            const progItems = ev.program_items || [];

            return (
              <div
                key={ev.id}
                data-testid={`event-card-${ev.id}`}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition overflow-hidden"
              >
                <div className="p-4 flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 uppercase">
                        {ev.type}
                      </span>
                      <h4 className="text-xs font-bold text-slate-800 truncate">{ev.title}</h4>
                      {ev.audience_type && ev.audience_type !== 'all' && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {ev.audience_type === 'women' ? 'Kadınlar Arasında' :
                           ev.audience_type === 'family' ? 'Aile İçi' :
                           ev.audience_type === 'men' ? 'Erkekler Arasında' : ev.audience_type}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
                      {ev.start_time && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {new Date(ev.start_time).toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' })}
                        </span>
                      )}
                      {ev.venue_name && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {ev.venue_name}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400">
                        {progItems.length} Program Maddesi
                      </span>
                    </div>

                    {ev.special_note && (
                      <p className="text-[11px] text-purple-900 bg-purple-50/50 px-2 py-1 rounded-lg mt-2 border border-purple-100">
                        💬 <span className="font-semibold">Özel Not:</span> {ev.special_note}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleMoveEvent(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 disabled:opacity-30 cursor-pointer"
                      title="Yukarı Taşı"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveEvent(idx, 'down')}
                      disabled={idx === events.length - 1}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 disabled:opacity-30 cursor-pointer"
                      title="Aşağı Taşı"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpandedEventId(isExpanded ? null : ev.id)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 cursor-pointer"
                      title={isExpanded ? 'Akışı Kapat' : 'Akışı Gör'}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditEvent(ev)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-indigo-600 cursor-pointer"
                      title="Düzenle"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteEvent(ev.id)}
                      className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 cursor-pointer"
                      title="Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Expanded Program Items Stream */}
                {isExpanded && (
                  <div className="bg-slate-50/80 p-4 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Program Akışı ({ev.title})
                      </span>
                    </div>

                    {progItems.length === 0 ? (
                      <p className="text-xs text-slate-400 italic py-1">Bu etkinlik için henüz program akışı girilmemiş.</p>
                    ) : (
                      <div className="space-y-1.5">
                        {progItems.map((p, pIdx) => (
                          <div
                            key={p.id}
                            className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md text-[11px]">
                                {p.time}
                              </span>
                              <div>
                                <span className="font-bold text-slate-800">{p.title}</span>
                                {p.description && (
                                  <p className="text-[10px] text-slate-400">{p.description}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Main Event Editor Modal */}
      {isEditingModal && (
        <div className="fixed inset-0 z-[300] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">
                {currentEvent.id ? 'Etkinliği Düzenle' : 'Yeni Etkinlik Ekle'}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditingModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Etkinlik Adı <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    data-testid="event-title-input"
                    placeholder="Örn: Nikâh Töreni, Kına Gecesi, Yemek"
                    value={currentEvent.title || ''}
                    onChange={e => setCurrentEvent({ ...currentEvent, title: e.target.value })}
                    className="w-full px-3 py-2 text-xs border rounded-xl bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Etkinlik Türü</label>
                  <select
                    value={currentEvent.type || 'düğün'}
                    onChange={e => setCurrentEvent({ ...currentEvent, type: e.target.value })}
                    className="w-full p-2 text-xs border rounded-xl bg-white"
                  >
                    <option value="düğün">Düğün</option>
                    <option value="kına">Kına</option>
                    <option value="nişan">Nişan</option>
                    <option value="nikâh">Nikâh Töreni</option>
                    <option value="kokteyl">Kokteyl</option>
                    <option value="yemek">Yemek</option>
                    <option value="after_party">After Party</option>
                    <option value="mevlit">Mevlit</option>
                    <option value="konvoy">Konvoy</option>
                    <option value="sünnet">Sünnet</option>
                    <option value="diğer">Diğer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Başlangıç Tarih & Saati</label>
                  <input
                    type="datetime-local"
                    value={currentEvent.start_time ? new Date(new Date(currentEvent.start_time).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''}
                    onChange={e => setCurrentEvent({ ...currentEvent, start_time: new Date(e.target.value).toISOString() })}
                    className="w-full px-3 py-2 text-xs border rounded-xl bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Bitiş Saati (Opsiyonel)</label>
                  <input
                    type="datetime-local"
                    value={currentEvent.end_time ? new Date(new Date(currentEvent.end_time).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''}
                    onChange={e => setCurrentEvent({ ...currentEvent, end_time: e.target.value ? new Date(e.target.value).toISOString() : null })}
                    className="w-full px-3 py-2 text-xs border rounded-xl bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mekân Adı</label>
                  <input
                    type="text"
                    placeholder="Örn: Yalı Rıhtımı / Kır Bahçesi"
                    value={currentEvent.venue_name || ''}
                    onChange={e => setCurrentEvent({ ...currentEvent, venue_name: e.target.value })}
                    className="w-full px-3 py-2 text-xs border rounded-xl bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Katılımcı Kitlesi</label>
                  <select
                    data-testid="event-audience-select"
                    value={currentEvent.audience_type || 'all'}
                    onChange={e => setCurrentEvent({ ...currentEvent, audience_type: e.target.value })}
                    className="w-full p-2 text-xs border rounded-xl bg-white"
                  >
                    <option value="all">Herkes (Genel Katılım)</option>
                    <option value="women">Kadınlar Arasında</option>
                    <option value="men">Erkekler Arasında</option>
                    <option value="family">Aile İçi</option>
                    <option value="kids">Çocuklar & Aile</option>
                    <option value="special">Özel Davetli Grubu</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mekân Açık Adresi</label>
                <textarea
                  rows={2}
                  placeholder="Mekanın tam adresi..."
                  value={currentEvent.venue_address || ''}
                  onChange={e => setCurrentEvent({ ...currentEvent, venue_address: e.target.value })}
                  className="w-full px-3 py-2 text-xs border rounded-xl bg-white resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Google Haritalar Linki (URL)</label>
                <input
                  type="url"
                  placeholder="https://maps.app.goo.gl/..."
                  value={currentEvent.google_maps_url || ''}
                  onChange={e => setCurrentEvent({ ...currentEvent, google_maps_url: e.target.value })}
                  className="w-full px-3 py-2 text-xs border rounded-xl bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Misafirlere Gösterilecek Özel Bilgi / Not
                </label>
                <input
                  type="text"
                  data-testid="event-special-note-input"
                  placeholder="Örn: Kına gecemiz kadınlar arasında gerçekleştirilecektir. / Vale hizmeti mevcuttur."
                  value={currentEvent.special_note || ''}
                  onChange={e => setCurrentEvent({ ...currentEvent, special_note: e.target.value })}
                  className="w-full px-3 py-2 text-xs border rounded-xl bg-white"
                />
              </div>

              {/* Program Items inside this Event */}
              <div className="border-t border-slate-100 pt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">
                    Saat Akışı & Program Maddeleri (Örn: 19:00 Karşılama)
                  </label>
                  <button
                    type="button"
                    data-testid="event-add-prog-btn"
                    onClick={() => setIsProgModalOpen(true)}
                    className="text-[11px] font-bold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> + Program Maddesi Ekle
                  </button>
                </div>

                {(currentEvent.program_items || []).length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic bg-slate-50 p-2.5 rounded-xl">
                    Henüz program maddesi eklenmedi. Yukarıdaki butona basarak saat akışı ekleyebilirsiniz.
                  </p>
                ) : (
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {(currentEvent.program_items || []).map((p, pIdx) => (
                      <div
                        key={p.id}
                        className="bg-slate-50 p-2 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-rose-600 bg-white px-2 py-0.5 rounded border text-[11px]">
                            {p.time}
                          </span>
                          <span className="font-bold text-slate-700">{p.title}</span>
                          {p.description && <span className="text-slate-400 text-[10px]">({p.description})</span>}
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleMoveProgItem(pIdx, 'up')}
                            disabled={pIdx === 0}
                            className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveProgItem(pIdx, 'down')}
                            disabled={pIdx === (currentEvent.program_items?.length || 1) - 1}
                            className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProgItem(p.id)}
                            className="p-1 text-rose-500 hover:text-rose-700 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditingModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  data-testid="event-save-modal-btn"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  Etkinliği Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Program Item Inner Modal */}
      {isProgModalOpen && (
        <div className="fixed inset-0 z-[400] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-3 text-left">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-xs font-bold text-slate-800">+ Program Akış Maddesi</h4>
              <button
                type="button"
                onClick={() => setIsProgModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddProgramItem} className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Saat (Örn: 19:00)</label>
                <input
                  type="text"
                  required
                  placeholder="19:00"
                  value={currentProgItem.time || ''}
                  onChange={e => setCurrentProgItem({ ...currentProgItem, time: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Başlık</label>
                <input
                  type="text"
                  required
                  data-testid="event-prog-title-input"
                  placeholder="Örn: Misafir Karşılama / Kına Merasimi"
                  value={currentProgItem.title || ''}
                  onChange={e => setCurrentProgItem({ ...currentProgItem, title: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Kısa Açıklama (Opsiyonel)</label>
                <input
                  type="text"
                  placeholder="Örn: Fuaye alanında kokteyl ikramı"
                  value={currentProgItem.description || ''}
                  onChange={e => setCurrentProgItem({ ...currentProgItem, description: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsProgModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  data-testid="event-prog-save-btn"
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                >
                  Maddeyi Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
