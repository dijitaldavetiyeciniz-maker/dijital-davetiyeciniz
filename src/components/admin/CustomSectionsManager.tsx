'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Edit2, ArrowUp, ArrowDown, Eye, EyeOff, Layout, Check, Sparkles, X } from 'lucide-react';

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  imageUrl?: string;
  buttonText?: string;
  buttonUrl?: string;
  alignment: 'left' | 'center' | 'right';
  isVisible: boolean;
  orderIndex: number;
}

interface CustomSectionsManagerProps {
  customSections: CustomSectionItem[];
  onChange: (sections: CustomSectionItem[]) => void;
  activeSectionsOrder?: string[];
  onOrderChange?: (order: string[]) => void;
}

export default function CustomSectionsManager({
  customSections = [],
  onChange,
  activeSectionsOrder,
  onOrderChange
}: CustomSectionsManagerProps) {
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<CustomSectionItem>>({
    alignment: 'center',
    isVisible: true,
    title: '',
    content: ''
  });

  const handleOpenNew = () => {
    setEditingItem({
      id: `custom-sec-${Date.now()}`,
      title: '',
      subtitle: '',
      content: '',
      alignment: 'center',
      isVisible: true,
      orderIndex: customSections.length
    });
    setIsEditingModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem.title?.trim()) {
      alert('Lütfen bölüm başlığı girin.');
      return;
    }

    const existingIndex = customSections.findIndex(s => s.id === editingItem.id);
    let updated: CustomSectionItem[];

    if (existingIndex >= 0) {
      updated = customSections.map((item, idx) => idx === existingIndex ? { ...item, ...editingItem } as CustomSectionItem : item);
    } else {
      const newItem: CustomSectionItem = {
        id: editingItem.id || `custom-sec-${Date.now()}`,
        title: editingItem.title || 'Özel Bölüm',
        subtitle: editingItem.subtitle || '',
        content: editingItem.content || '',
        imageUrl: editingItem.imageUrl || '',
        buttonText: editingItem.buttonText || '',
        buttonUrl: editingItem.buttonUrl || '',
        alignment: editingItem.alignment || 'center',
        isVisible: editingItem.isVisible !== false,
        orderIndex: customSections.length
      };
      updated = [...customSections, newItem];
    }

    onChange(updated);
    setIsEditingModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Bu özel bölümü silmek istediğinize emin misiniz?')) return;
    onChange(customSections.filter(s => s.id !== id));
  };

  const handleToggleVisible = (id: string) => {
    onChange(customSections.map(s => s.id === id ? { ...s, isVisible: !s.isVisible } : s));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === customSections.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const items = [...customSections];
    const temp = items[index];
    items[index] = items[targetIndex];
    items[targetIndex] = temp;
    onChange(items);
  };

  return (
    <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Layout className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">Özel İçerik Bölümleri & Modüller</h4>
            <p className="text-[11px] text-slate-400">Davetiyenize dilediğiniz başlıkta serbest içerik blokları ekleyin</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenNew}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Özel Bölüm Ekle</span>
        </button>
      </div>

      {/* List of Custom Sections */}
      {customSections.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <p className="text-xs text-slate-500 mb-2">Henüz özel bir bölüm eklenmemiş.</p>
          <p className="text-[11px] text-slate-400 max-w-sm mx-auto mb-3">
            Örn: "Önemli Otopark Bilgilendirmesi", "Konaklama Rehberi" veya "Şehir Dışından Gelecek Misafirler İçin Notlar" gibi serbest bölümler oluşturabilirsiniz.
          </p>
          <button
            type="button"
            onClick={handleOpenNew}
            className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 hover:underline cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> İlk Özel Bölümünüzü Ekleyin
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {customSections.map((sec, idx) => (
            <div
              key={sec.id}
              data-testid={`custom-section-item-${sec.id}`}
              className={`p-3 rounded-xl border transition flex items-center justify-between gap-3 ${
                sec.isVisible ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-50 border-slate-200 opacity-60'
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800 truncate">{sec.title}</span>
                  {!sec.isVisible && (
                    <span className="text-[9px] font-semibold px-1.5 py-0.2 bg-slate-200 text-slate-600 rounded">
                      Gizli
                    </span>
                  )}
                </div>
                {sec.subtitle && (
                  <p className="text-[10px] text-slate-400 truncate">{sec.subtitle}</p>
                )}
                <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">{sec.content}</p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleMove(idx, 'up')}
                  disabled={idx === 0}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 disabled:opacity-30 cursor-pointer"
                  title="Yukarı Taşı"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(idx, 'down')}
                  disabled={idx === customSections.length - 1}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 disabled:opacity-30 cursor-pointer"
                  title="Aşağı Taşı"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleVisible(sec.id)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 cursor-pointer"
                  title={sec.isVisible ? 'Gizle' : 'Göster'}
                >
                  {sec.isVisible ? <Eye className="w-3.5 h-3.5 text-emerald-600" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(sec);
                    setIsEditingModalOpen(true);
                  }}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 cursor-pointer"
                  title="Düzenle"
                >
                  <Edit2 className="w-3.5 h-3.5 text-indigo-600" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(sec.id)}
                  className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 cursor-pointer"
                  title="Sil"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isEditingModalOpen && (
        <div className="fixed inset-0 z-[300] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">
                {editingItem.id && customSections.some(s => s.id === editingItem.id) ? 'Özel Bölümü Düzenle' : 'Yeni Özel Bölüm Ekle'}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditingModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bölüm Başlığı <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  data-testid="custom-sec-title"
                  placeholder="Örn: Önemli Bilgilendirme / Ulaşım Rehberi"
                  value={editingItem.title || ''}
                  onChange={e => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs border rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Alt Başlık (Opsiyonel)</label>
                <input
                  type="text"
                  data-testid="custom-sec-subtitle"
                  placeholder="Örn: Misafirlerimizin dikkatine"
                  value={editingItem.subtitle || ''}
                  onChange={e => setEditingItem({ ...editingItem, subtitle: e.target.value })}
                  className="w-full px-3 py-2 text-xs border rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  İçerik Metni <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  data-testid="custom-sec-content"
                  placeholder="Misafirlerinizle paylaşmak istediğiniz tüm detayları buraya yazabilirsiniz..."
                  value={editingItem.content || ''}
                  onChange={e => setEditingItem({ ...editingItem, content: e.target.value })}
                  className="w-full px-3 py-2 text-xs border rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Buton Yazısı (Opsiyonel)</label>
                  <input
                    type="text"
                    placeholder="Örn: Konum Aç / Detaylar"
                    value={editingItem.buttonText || ''}
                    onChange={e => setEditingItem({ ...editingItem, buttonText: e.target.value })}
                    className="w-full px-3 py-2 text-xs border rounded-xl bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Buton Bağlantısı (URL)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={editingItem.buttonUrl || ''}
                    onChange={e => setEditingItem({ ...editingItem, buttonUrl: e.target.value })}
                    className="w-full px-3 py-2 text-xs border rounded-xl bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Metin Hizalaması</label>
                  <select
                    value={editingItem.alignment || 'center'}
                    onChange={e => setEditingItem({ ...editingItem, alignment: e.target.value as any })}
                    className="w-full p-2 text-xs border rounded-xl bg-white"
                  >
                    <option value="center">Ortalı</option>
                    <option value="left">Sola Dayalı</option>
                    <option value="right">Sağa Dayalı</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="sec-vis-check"
                    checked={editingItem.isVisible !== false}
                    onChange={e => setEditingItem({ ...editingItem, isVisible: e.target.checked })}
                    className="rounded text-teal-600 focus:ring-teal-500"
                  />
                  <label htmlFor="sec-vis-check" className="text-xs text-slate-700 cursor-pointer">
                    Davetiyede Gösterilsin
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditingModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  data-testid="custom-sec-save-btn"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  Bölümü Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
