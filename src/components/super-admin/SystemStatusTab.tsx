'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Activity, CheckCircle2, AlertTriangle, XCircle, 
  RefreshCw, Server, Database, Shield, HardDrive, 
  Cpu, Globe, Radio, Layers, Clock
} from 'lucide-react';

interface ServiceCheck {
  name: string;
  category: 'core' | 'database' | 'storage' | 'integration' | 'network';
  status: 'HEALTHY' | 'DEGRADED' | 'UNAVAILABLE' | 'NOT_CONFIGURED';
  latencyMs?: number;
  message?: string;
  details?: Record<string, any>;
}

export default function SystemStatusTab() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{
    overallStatus: 'HEALTHY' | 'DEGRADED' | 'UNAVAILABLE';
    timestamp: string;
    durationMs: number;
    version: string;
    services: ServiceCheck[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/super-admin/system-status');
      const json = await res.json();
      if (json.success) {
        setData(json);
      } else {
        setError(json.error || 'Sistem durumu alınamadı.');
      }
    } catch (err: any) {
      setError(err.message || 'Sunucuya bağlanılamadı.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const getStatusBadge = (status: ServiceCheck['status']) => {
    switch (status) {
      case 'HEALTHY':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Sağlıklı</span>
          </span>
        );
      case 'DEGRADED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Performans Düşüşü</span>
          </span>
        );
      case 'UNAVAILABLE':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold">
            <XCircle className="w-3.5 h-3.5" />
            <span>Ulaşılamıyor</span>
          </span>
        );
      case 'NOT_CONFIGURED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-500/10 border border-slate-500/20 text-slate-400 text-xs font-bold">
            <span>Yapılandırılmadı</span>
          </span>
        );
    }
  };

  const getCategoryIcon = (category: ServiceCheck['category']) => {
    switch (category) {
      case 'database':
        return <Database className="w-5 h-5 text-indigo-400" />;
      case 'storage':
        return <HardDrive className="w-5 h-5 text-amber-400" />;
      case 'core':
        return <Cpu className="w-5 h-5 text-rose-400" />;
      case 'integration':
        return <Globe className="w-5 h-5 text-blue-400" />;
      default:
        return <Server className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <Activity className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white">Sistem Sağlık & Operasyonel Durum</h2>
              {data && (
                <span className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  data.overallStatus === 'HEALTHY' 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}>
                  {data.overallStatus === 'HEALTHY' ? 'TÜM SERVİSLER AKTİF' : 'KISMİ UYARI'}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" />
              <span>Son Kontrol: {data?.timestamp ? new Date(data.timestamp).toLocaleTimeString('tr-TR') : 'Yükleniyor...'}</span>
              {data?.durationMs && <span className="text-slate-500">({data.durationMs}ms)</span>}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={fetchStatus}
            disabled={loading}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Yeniden Yokla</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.services.map((srv, idx) => (
          <div
            key={idx}
            className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 hover:border-slate-700 transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/50">
                  {getCategoryIcon(srv.category)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{srv.name}</h3>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                    {srv.category}
                  </span>
                </div>
              </div>
              {getStatusBadge(srv.status)}
            </div>

            {srv.message && (
              <p className="text-xs text-slate-400 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/50">
                {srv.message}
              </p>
            )}

            {srv.details && (
              <div className="pt-2 border-t border-slate-800/60 grid grid-cols-2 gap-2 text-[11px]">
                {Object.entries(srv.details).map(([k, v]) => (
                  <div key={k} className="text-slate-400">
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">{k}:</span>
                    <strong className="text-slate-200">{String(v)}</strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
