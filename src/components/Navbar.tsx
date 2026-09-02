'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, ArrowRight } from 'lucide-react';
import { defaultSiteConfig, SiteHeaderConfig } from '@/lib/site-settings';

interface NavbarProps {
  initialConfig?: SiteHeaderConfig;
}

export default function Navbar({ initialConfig }: NavbarProps) {
  const [headerConfig, setHeaderConfig] = useState<SiteHeaderConfig>(initialConfig || defaultSiteConfig.header);

  useEffect(() => {
    if (!initialConfig) {
      fetch('/api/site-settings/public')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.settings?.header) {
            setHeaderConfig(data.settings.header);
          }
        })
        .catch(() => {});
    }
  }, [initialConfig]);

  const visibleNavItems = (headerConfig.navItems || defaultSiteConfig.header.navItems)
    .filter(item => item.isVisible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <header className="sticky top-0 w-full bg-white/90 backdrop-blur-xl z-50 border-b border-slate-100/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 text-2xl font-bold font-serif text-slate-900 hover:opacity-90 transition-opacity">
          {headerConfig.logoUrl ? (
            <div className="relative w-10 h-10 overflow-hidden rounded-xl">
              <Image
                src={headerConfig.logoUrl}
                alt={headerConfig.logoText || 'Dijital Davetiyeciniz'}
                fill
                className="object-contain"
                sizes="40px"
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-600 text-white flex items-center justify-center shadow-md shadow-rose-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
          )}
          <span>
            {headerConfig.logoText || 'Dijital Davetiyeciniz'}
          </span>
        </Link>

        {/* Navigation Links */}
        <nav aria-label="Ana Menü" className="hidden lg:flex items-center gap-8 text-sm font-bold text-slate-600">
          {visibleNavItems.map(item => (
            <Link
              key={item.id || item.url}
              href={item.url}
              className="hover:text-rose-500 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA Actions */}
        <div className="flex items-center gap-3">
          <Link 
            href="/giris-yap" 
            className="hidden sm:inline-flex text-xs font-bold text-slate-700 hover:text-rose-600 px-4 py-2 rounded-xl hover:bg-slate-50 transition-all"
          >
            Giriş Yap
          </Link>
          {headerConfig.ctaVisible !== false && (
            <Link 
              href={headerConfig.ctaUrl || '/olustur'} 
              className="inline-flex items-center gap-2 text-xs md:text-sm font-extrabold bg-gradient-to-r from-rose-500 via-pink-500 to-indigo-600 text-white px-5 md:px-6 py-2.5 md:py-3 rounded-full hover:shadow-lg hover:shadow-rose-500/25 transition-all hover:scale-105"
            >
              <span>{headerConfig.ctaText || 'Davetiyeni Oluştur'}</span>
              <ArrowRight className="w-4 h-4 hidden sm:inline" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
