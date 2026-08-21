'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Shield, Sparkles, Mail, Phone, RefreshCw } from 'lucide-react';

const PLATFORM_ROUTES = [
  '/', '/olustur', '/kayit-ol', '/giris-yap', '/dashboard', 
  '/sablonlar', '/fiyatlandirma', '/ozellikler', '/nasil-calisir', 
  '/sss', '/iletisim', '/gizlilik-politikasi', '/kullanim-kosullari'
];

export default function MaintenanceGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [maintenance, setMaintenance] = useState<{
    enabled: boolean;
    scope: 'platform' | 'full';
    message: string;
    contact_email?: string;
    contact_phone?: string;
  } | null>(null);

  useEffect(() => {
    // Super admin routes are never blocked
    if (pathname?.startsWith('/super-admin') || pathname?.startsWith('/api')) {
      return;
    }

    fetch('/api/super-admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings?.maintenance_enabled) {
          setMaintenance({
            enabled: true,
            scope: data.settings.maintenance_scope || 'platform',
            message: data.settings.maintenance_message || 'Sistemlerimizde kısa süreli bir bakım çalışması gerçekleştirilmektedir.',
            contact_email: data.settings.contact_email || 'dijitaldavetiyeciniz@gmail.com',
            contact_phone: data.settings.contact_phone || '+90 555 000 0000'
          });
        } else {
          setMaintenance(null);
        }
      })
      .catch(() => {});
  }, [pathname]);

  // Bypass if super admin
  if (pathname?.startsWith('/super-admin') || pathname?.startsWith('/api')) {
    return <>{children}</>;
  }

  // Check if current route should be blocked under maintenance
  if (maintenance && maintenance.enabled) {
    const isPlatformRoute = PLATFORM_ROUTES.includes(pathname || '/');
    
    // In 'platform' scope (default), public invitation URLs like /[slug] continue to work!
    if (maintenance.scope === 'platform' && !isPlatformRoute) {
      return <>{children}</>;
    }

    // Otherwise show premium maintenance screen
    return (
      <div className="min-h-screen bg-[#07070f] text-slate-200 flex flex-col items-center justify-center p-6 text-center font-sans selection:bg-rose-500/30 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-500/10 rounded-full mix-blend-screen filter blur-[150px] opacity-40 animate-pulse pointer-events-none" />

        <div className="max-w-lg w-full bg-[#0f111e]/90 border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl backdrop-blur-2xl relative z-10 space-y-6">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto text-white shadow-lg shadow-amber-500/20">
            <Sparkles className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-300 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            ⚙️ Sistem Bakım Çalışması
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white font-serif">
            Kısa Bir Mola Veriyoruz
          </h1>

          <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
            {maintenance.message}
          </p>

          <div className="pt-4 border-t border-white/10 space-y-3 text-xs text-slate-400">
            <p>Acil durumlar ve sorularınız için bize ulaşabilirsiniz:</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-slate-200">
              {maintenance.contact_email && (
                <a href={`mailto:${maintenance.contact_email}`} className="flex items-center gap-1.5 hover:text-rose-400">
                  <Mail className="w-3.5 h-3.5 text-rose-400" />
                  <span>{maintenance.contact_email}</span>
                </a>
              )}
              {maintenance.contact_phone && (
                <a href={`tel:${maintenance.contact_phone}`} className="flex items-center gap-1.5 hover:text-emerald-400">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{maintenance.contact_phone}</span>
                </a>
              )}
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
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
