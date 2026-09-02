'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Sparkles, Mail, RefreshCw, Wrench, Clock, ShieldAlert } from 'lucide-react';
import { SiteMaintenanceConfig, defaultSiteConfig } from '@/lib/site-settings';

export default function MaintenanceGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [maintenance, setMaintenance] = useState<SiteMaintenanceConfig>(defaultSiteConfig.maintenance);

  useEffect(() => {
    // Super admin, API routes, and static assets are never blocked
    if (
      pathname?.startsWith('/super-admin') ||
      pathname?.startsWith('/api') ||
      pathname?.startsWith('/_next') ||
      pathname === '/bakim'
    ) {
      return;
    }

    fetch('/api/site-settings/public')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings?.maintenance) {
          setMaintenance(data.settings.maintenance);
        }
      })
      .catch(() => {});
  }, [pathname]);

  // Bypass if super admin or system route
  if (
    pathname?.startsWith('/super-admin') ||
    pathname?.startsWith('/api') ||
    pathname?.startsWith('/_next') ||
    pathname === '/bakim'
  ) {
    return <>{children}</>;
  }

  // Check if maintenance is actively turned on
  if (maintenance && maintenance.enabled) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center font-sans selection:bg-rose-500/30 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-lg w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl backdrop-blur-2xl relative z-10 space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center mx-auto text-rose-400 shadow-inner">
            <Wrench className="w-8 h-8 animate-pulse" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Sistem Bakım Modu</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white font-serif">
            {maintenance.title || 'Kısa Süreli Bakım Çalışması'}
          </h1>

          <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
            {maintenance.description || 'Sizlere daha kesintisiz bir deneyim sunmak amacıyla altyapımızı güncelliyoruz. Çok yakında tekrar yayındayız.'}
          </p>

          {maintenance.estimatedReturn && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700/50 text-xs text-amber-300 font-medium">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Tahmini Tamamlanma: <strong>{maintenance.estimatedReturn}</strong></span>
            </div>
          )}

          <div className="pt-4 border-t border-slate-800 space-y-3 text-xs text-slate-400">
            <p>Acil durumlar ve sorularınız için bize e-posta ile ulaşabilirsiniz:</p>
            <div className="flex items-center justify-center gap-2 text-slate-200">
              <Mail className="w-4 h-4 text-rose-400" />
              <a
                href={`mailto:${maintenance.supportEmail || 'destek@dijitaldavetiyeciniz.com'}`}
                className="hover:text-rose-400 font-semibold transition-colors"
              >
                {maintenance.supportEmail || 'destek@dijitaldavetiyeciniz.com'}
              </a>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm hover:shadow"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sayfayı Yenile</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
