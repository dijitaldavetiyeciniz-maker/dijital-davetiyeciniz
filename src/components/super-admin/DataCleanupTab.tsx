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
  Square,
  Activity,
  BarChart3
} from 'lucide-react';

export default function DataCleanupTab() {
  const [summary, setSummary] = useState<any | null>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [typedConfirmation, setTypedConfirmation] = useState<string>('');
  const [typedAnalyticsConfirmation, setTypedAnalyticsConfirmation] = useState<string>('');
  const [showAnalyticsModal, setShowAnalyticsModal] = useState<boolean>(false);
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

  const handleResetAnalytics = async () => {
    if (typedAnalyticsConfirmation !== 'SIFIRLA' && typedAnalyticsConfirmation !== 'RESET') {
      alert('Analitik sıfırlama işlemi için lütfen onay kutusuna "SIFIRLA" yazın.');
      return;
    }

    try {
      const res = await fetch('/api/super-admin/data-cleanup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reset_analytics',
          typed_confirmation: typedAnalyticsConfirmation
        })
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage(data.message);
        setShowAnalyticsModal(false);
        setTypedAnalyticsConfirmation('');
      } else {
        alert(data.error || 'Analitik sıfırlanamadı.');
      }
    } catch (err: any) {
      alert(err.message || 'Sıfırlama hatası.');
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
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <h2 className="text-base font-bold text-slate-900">Veri Temizliği & Canlı Veritabanı Denetimi</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Test kayıtları, yetim veriler ve analitik geçmişini doğrudan canlı veritabanı sorgularıyla güvenle yönetin.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAnalyticsModal(true)}
            className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Analitikleri Sıfırla</span>
          </button>

          <button
            type="button"
            onClick={fetchAuditData}
            disabled={isLoading}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Canlı Verileri Tara</span>
          </button>
        </div>
      </div>

      {/* Action Message Alert */}
      {actionMessage && (
        <div className="p-4 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-2xl text-xs flex items-center gap-2 font-bold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Metrics Cards Grid (100% Live DB values) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Toplam Davetiye</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{summary?.total ?? 0}</p>
          <span className="text-[10px] text-slate-400">Tüm veritabanı satırları</span>
        </div>

        <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 shadow-xs">
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Kayıtlı Üye Davetiyesi</span>
          <p className="text-2xl font-extrabold text-emerald-800 mt-1">{summary?.registeredUserWeddings ?? 0}</p>
          <span className="text-[10px] text-emerald-600">Auth sahibi doğrulanmış</span>
        </div>

        <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-200 shadow-xs">
          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Legacy / Üyeliksiz</span>
          <p className="text-2xl font-extrabold text-blue-800 mt-1">{summary?.legacyUnauthenticatedWeddings ?? 0}</p>
          <span className="text-[10px] text-blue-600">Eski sistem davetiyeleri</span>
        </div>

        <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-200 shadow-xs">
          <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">Kayıtlı Auth Üyesi</span>
          <p className="text-2xl font-extrabold text-purple-800 mt-1">{summary?.totalAuthUsers ?? 0}</p>
          <span className="text-[10px] text-purple-600">auth.users tablosu</span>
        </div>

        <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200 shadow-xs">
          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Test / Fixture</span>
          <p className="text-2xl font-extrabold text-amber-800 mt-1">{summary?.testRecords ?? 0}</p>
          <span className="text-[10px] text-amber-600">Aktif test artığı</span>
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
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Karantinaya Al
            </button>

            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={typedConfirmation}
                onChange={(e) => setTypedConfirmation(e.target.value)}
                placeholder='"SIL" yazın'
                className="px-3 py-1.5 text-xs border border-rose-300 rounded-xl w-24 focus:outline-none focus:ring-1 focus:ring-rose-500 font-bold uppercase"
              />
              <button
                type="button"
                onClick={handleHardDeleteSelected}
                disabled={typedConfirmation !== 'SIL' && typedConfirmation !== 'DELETE'}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition cursor-pointer disabled:opacity-40"
              >
                Kalıcı Sil
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={filteredRecords.length > 0 && selectedIds.length === filteredRecords.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds(filteredRecords.map(r => r.id));
                      } else {
                        setSelectedIds([]);
                      }
                    }}
                    className="rounded text-rose-600"
                  />
                </th>
                <th className="py-3 px-4 font-bold">Slug & Çift</th>
                <th className="py-3 px-4 font-bold">Kategori</th>
                <th className="py-3 px-4 font-bold">Durum</th>
                <th className="py-3 px-4 font-bold">Oluşturulma</th>
                <th className="py-3 px-4 font-bold">Gerekçe / Not</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((rec) => {
                  const isSelected = selectedIds.includes(rec.id);
                  return (
                    <tr key={rec.id} className={`hover:bg-slate-50 transition ${isSelected ? 'bg-rose-50/40' : ''}`}>
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedIds([...selectedIds, rec.id]);
                            } else {
                              setSelectedIds(selectedIds.filter(id => id !== rec.id));
                            }
                          }}
                          className="rounded text-rose-600"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block font-mono">/{rec.slug}</span>
                        <span className="text-[11px] text-slate-500">
                          {rec.bride_name || '-'} & {rec.groom_name || '-'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          rec.category === 'REAL_USER'
                            ? 'bg-emerald-100 text-emerald-800'
                            : rec.category === 'TEST_FIXTURE'
                            ? 'bg-amber-100 text-amber-800'
                            : rec.category === 'QUARANTINED'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {rec.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[11px] font-bold ${rec.is_paid ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {rec.is_paid ? 'Ödendi' : 'Taslak'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                        {new Date(rec.created_at).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-[11px] max-w-xs truncate">
                        {rec.reason || '-'}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400 text-xs">
                    {isLoading ? 'Veriler taranıyor...' : 'Seçilen kriterde kayıt bulunamadı.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analytics Reset Modal */}
      {showAnalyticsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <BarChart3 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">Kullanım Analitiklerini Sıfırla</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Bu işlem test ortamında veya geçmiş dönemde oluşan tüm sayfa görüntüleme ve tıklama analitiklerini sıfırlar.
                <strong> Kullanıcı hesapları, davetiyeler, ödemeler ve denetim (audit) logları kesinlikle silinmez.</strong>
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Onaylamak için <strong>SIFIRLA</strong> yazın:
              </label>
              <input
                type="text"
                value={typedAnalyticsConfirmation}
                onChange={(e) => setTypedAnalyticsConfirmation(e.target.value)}
                placeholder="SIFIRLA"
                className="w-full px-3 py-2 border border-rose-300 rounded-xl text-xs uppercase font-bold focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAnalyticsModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleResetAnalytics}
                disabled={typedAnalyticsConfirmation !== 'SIFIRLA' && typedAnalyticsConfirmation !== 'RESET'}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition cursor-pointer disabled:opacity-40"
              >
                Analitiği Sıfırla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
