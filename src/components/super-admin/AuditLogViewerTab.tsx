'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Search, Filter, RefreshCw, Clock, User, Activity } from 'lucide-react';

export default function AuditLogViewerTab() {
  const [logs, setLogs] = useState<any[]>([]);
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchLogs();
  }, [actionFilter]);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (actionFilter !== 'all') params.append('action', actionFilter);

      const res = await fetch(`/api/super-admin/audit-logs?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs || []);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-rose-600" />
            <h2 className="text-base font-bold text-slate-900">Sistem İşlem Geçmişi (Audit Logs)</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Super Admin, güvenlik ve kritik yapılandırma değişikliklerinin zaman damgalı denetim kayıtları.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchLogs}
            disabled={isLoading}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Yenile</span>
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="p-3">Zaman</th>
                <th className="p-3">Kullanıcı / Yetkili</th>
                <th className="p-3">İşlem (Action)</th>
                <th className="p-3">Hedef</th>
                <th className="p-3">Detaylar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400 font-sans">
                    Kayıt bulunamadı.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 text-slate-400 whitespace-nowrap text-[11px]">
                      {new Date(log.created_at).toLocaleString('tr-TR')}
                    </td>
                    <td className="p-3 text-slate-700 font-sans text-xs">
                      {log.actor_email || 'Super Admin'}
                    </td>
                    <td className="p-3 font-bold text-slate-900">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[11px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600 text-[11px]">
                      {log.target_type ? `${log.target_type}:${log.target_id || ''}` : '—'}
                    </td>
                    <td className="p-3 text-slate-500 text-[10px] truncate max-w-[280px]">
                      {JSON.stringify(log.details || {})}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
