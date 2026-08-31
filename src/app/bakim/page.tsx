import React from 'react';
import { supabase } from '@/lib/supabase';
import { defaultSiteConfig, SiteMaintenanceConfig } from '@/lib/site-settings';
import { Wrench, Clock, Mail, ShieldAlert, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function MaintenancePage({
  searchParams,
}: {
  searchParams: Promise<{ preview?: string }>;
}) {
  const { preview } = await searchParams;
  const isPreview = preview === 'true';

  let maintenanceConfig: SiteMaintenanceConfig = defaultSiteConfig.maintenance;

  try {
    const { data } = await supabase
      .from('site_settings')
      .select('published_config, draft_config')
      .eq('id', 'global')
      .single();

    if (data) {
      if (isPreview && data.draft_config?.maintenance) {
        maintenanceConfig = data.draft_config.maintenance;
      } else if (data.published_config?.maintenance) {
        maintenanceConfig = data.published_config.maintenance;
      }
    }
  } catch {
    // Fallback to default
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans selection:bg-rose-500/30">
      {/* Subtle Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      {isPreview && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-slate-950 px-4 py-1.5 rounded-full text-xs font-black shadow-xl flex items-center gap-1.5 animate-bounce">
          <Sparkles className="w-3.5 h-3.5" />
          <span>BAKIM MODU ÖNİZLEME (Canlı siteye uygulanmadı)</span>
        </div>
      )}

      <div className="max-w-lg w-full bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-10 text-center relative shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Visual Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shadow-inner">
            <Wrench className="w-8 h-8 animate-pulse" />
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Planlı Bakım & Güncelleme</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {maintenanceConfig.title || 'Kısa Süreli Bakım Çalışması'}
        </h1>

        {/* Description */}
        <p className="text-sm text-slate-400 leading-relaxed">
          {maintenanceConfig.description ||
            'Sizlere daha kesintisiz ve hızlı bir deneyim sunmak amacıyla sistemlerimizde planlı bir altyapı güncellemesi gerçekleştirilmektedir.'}
        </p>

        {/* Estimated Return Box */}
        {maintenanceConfig.estimatedReturn && (
          <div className="p-3.5 bg-slate-800/50 rounded-2xl border border-slate-700/60 flex items-center justify-center gap-2 text-xs font-semibold text-slate-300">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Tahmini Bitiş: {maintenanceConfig.estimatedReturn}</span>
          </div>
        )}

        {/* Support & Contact */}
        <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 space-y-2">
          <p>Acil sorularınız veya teknik destek için bize ulaşabilirsiniz:</p>
          <a
            href={`mailto:${maintenanceConfig.supportEmail || 'destek@dijitaldavetiyeciniz.com'}`}
            className="inline-flex items-center gap-1.5 font-bold text-rose-400 hover:text-rose-300 transition"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>{maintenanceConfig.supportEmail || 'destek@dijitaldavetiyeciniz.com'}</span>
          </a>
        </div>
      </div>

      <p className="mt-8 text-xs text-slate-600">Dijital Davetiyeciniz &copy; 2026</p>
    </div>
  );
}
