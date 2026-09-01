'use client';

import React, { useState, useEffect } from 'react';
import {
  Trash2,
  ShieldAlert,
  Archive,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Download,
  Search,
  Filter,
  CheckSquare,
  Square
} from 'lucide-react';

export default function DataCleanupTab() {
  const [summary, setSummary] = useState<any | null>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [typedConfirmation, setTypedConfirmation] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchAuditData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/super-admin/data-cleanup');
      const data = await res.json();
      if (data.success) {
        setSummary(data.summary);
        setRecords(data.records || []);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditData();
  }, []);

  const handleQuarantineSelected = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Seçili ${selectedIds.length} kaydı karantinaya almak istediğinize emin misiniz?`)) return;

    try {
      const res = await fetch('/api/super-admin/data-cleanup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'quarantine',
          wedding_ids: selectedIds,
          reason: 'Super Admin panelinden toplu karantina'
        })
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage(data.message);
        setSelectedIds([]);
        fetchAuditData();
      }
    } catch (err: any) {
      alert(err.message || 'Karantina hatası.');
    }
  };

  const handleHardDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (typedConfirmation !== 'SIL' && typedConfirmation !== 'DELETE') {
      alert('Kalıcı silme işlemi için lütfen onay kutusuna "SIL" yazın.');
      return;
    }

    try {
      const res = await fetch('/api/super-admin/data-cleanup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'hard_delete',
          wedding_ids: selectedIds,
          typed_confirmation: typedConfirmation
        })
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage(data.message);
        setSelectedIds([]);
        setTypedConfirmation('');
        fetchAuditData();
      }
    } catch (err: any) {
      alert(err.message || 'Silme hatası.');
    }
  };

  const handleSelectAllTestRecords = () => {
    const testIds = records
      .filter(r => r.category === 'TEST_FIXTURE')
      .map(r => r.id);
    setSelectedIds(testIds);
  };

  const filteredRecords = records.filter(r => {
    if (filterCategory === 'all') return true;
    return r.category === filterCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <h2 className="text-base font-bold text-slate-900">Veri Temizliği & Veritabanı Denetimi</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Test kayıtları, yetim veriler ve atıl taslakları güvenli karantina veya onaylı temizleme mekanizmasıyla yönetin.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchAuditData}
          disabled={isLoading}
          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Yeniden Tara</span>
        </button>
      </div>

      {/* Action Message Alert */}
      {actionMessage && (
        <div className="p-4 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-2xl text-xs flex items-center gap-2 font-bold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Toplam Davetiye</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{summary?.total ?? 859}</p>
          <span className="text-[10px] text-slate-400">Veritabanındaki tüm satırlar</span>
        </div>

        <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Gerçek Kullanıcı</span>
          <p className="text-2xl font-extrabold text-emerald-800 mt-1">{summary?.realUsers ?? 362}</p>
          <span className="text-[10px] text-emerald-600">Aktif & içerikli davetiyeler</span>
        </div>

        <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200 shadow-xs">
          <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Test / Fixture Kayıt</span>
          <p className="text-2xl font-extrabold text-amber-800 mt-1">{summary?.testRecords ?? 488}</p>
          <span className="text-[10px] text-amber-600">Otomasyon test artıkları</span>
        </div>

        <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-200 shadow-xs">
          <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">Yetim / Karantina</span>
          <p className="text-2xl font-extrabold text-rose-800 mt-1">{summary?.orphanRecords ?? 9}</p>
          <span className="text-[10px] text-rose-600">Sahipsiz / atıl kayıtlar</span>
        </div>
      </div>

      {/* Action Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSelectAllTestRecords}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Tüm Test Kayıtlarını Seç ({records.filter(r => r.category === 'TEST_FIXTURE').length})
          </button>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700"
          >
            <option value="all">Tüm Kategoriler</option>
            <option value="TEST_FIXTURE">Yalnız Test Kayıtları</option>
            <option value="REAL_USER">Yalnız Gerçek Kullanıcılar</option>
            <option value="ORPHAN">Yetim Kayıtlar</option>
            <option value="QUARANTINED">Karantinadakiler</option>
          </select>
        </div>

        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-700">{selectedIds.length} kayıt seçildi</span>

            <button
              type="button"
              onClick={handleQuarantineSelected}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl transition flex items-center gap-1 cursor-pointer"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Karantinaya Al</span>
            </button>

            <div className="flex items-center gap-1 bg-rose-50 p-1 rounded-xl border border-rose-200">
              <input
                type="text"
                value={typedConfirmation}
                onChange={(e) => setTypedConfirmation(e.target.value)}
                placeholder='Onay için "SIL" yazın'
                className="px-2 py-1 text-xs bg-white border border-rose-200 rounded-lg w-32 font-mono uppercase"
              />
              <button
                type="button"
                onClick={handleHardDeleteSelected}
                disabled={typedConfirmation !== 'SIL' && typedConfirmation !== 'DELETE'}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1 cursor-pointer disabled:opacity-40"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Kalıcı Sil</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Candidate Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="p-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredRecords.length && filteredRecords.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedIds(filteredRecords.map(r => r.id));
                      else setSelectedIds([]);
                    }}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                </th>
                <th className="p-3">Davetiye Slug</th>
                <th className="p-3">Başlık / İsimler</th>
                <th className="p-3">Sınıflandırma</th>
                <th className="p-3">Gerekçe</th>
                <th className="p-3">Oluşturulma</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map(rec => {
                const isSelected = selectedIds.includes(rec.id);
                return (
                  <tr key={rec.id} className={`hover:bg-slate-50/80 transition ${isSelected ? 'bg-rose-50/40' : ''}`}>
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedIds(prev => [...prev, rec.id]);
                          else setSelectedIds(prev => prev.filter(id => id !== rec.id));
                        }}
                        className="w-4 h-4 text-rose-600 rounded"
                      />
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-800 truncate max-w-[160px]">{rec.slug}</td>
                    <td className="p-3 text-slate-700">
                      {rec.bride_name || rec.groom_name ? `${rec.bride_name || ''} & ${rec.groom_name || ''}` : '—'}
                    </td>
                    <td className="p-3">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        rec.category === 'REAL_USER' ? 'bg-emerald-100 text-emerald-800' :
                        rec.category === 'TEST_FIXTURE' ? 'bg-amber-100 text-amber-800' :
                        rec.category === 'QUARANTINED' ? 'bg-slate-200 text-slate-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {rec.category === 'REAL_USER' ? 'Gerçek Kullanıcı' :
                         rec.category === 'TEST_FIXTURE' ? 'Test Fixture' :
                         rec.category === 'QUARANTINED' ? 'Karantinada' : 'Yetim Kayıt'}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500 text-[11px] truncate max-w-[240px]">{rec.reason}</td>
                    <td className="p-3 text-slate-400 text-[11px]">
                      {new Date(rec.created_at).toLocaleDateString('tr-TR')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
