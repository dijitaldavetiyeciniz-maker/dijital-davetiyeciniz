'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SiteHeaderConfig, SiteBrandingConfig } from '@/lib/site-settings';
import { Menu, X, Heart, Sparkles } from 'lucide-react';

interface GlobalHeaderProps {
  headerConfig: SiteHeaderConfig;
  brandingConfig?: SiteBrandingConfig;
}

export default function GlobalHeader({ headerConfig, brandingConfig }: GlobalHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const visibleNavItems = [...(headerConfig.navItems || [])]
    .filter(item => item.isVisible)
    .sort((a, b) => a.order - b.order);

  const brandName = brandingConfig?.siteName || headerConfig.logoText || 'Dijital Davetiyeciniz';
  const logoUrl = brandingConfig?.logoUrl || headerConfig.logoUrl;

  return (
    <header className="w-full bg-white/90 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-slate-900 group">
          {logoUrl ? (
            <img src={logoUrl} alt={brandName} className="h-8 w-auto object-contain" />
          ) : (
            <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition">
              <Heart className="w-4 h-4 fill-current" />
            </div>
          )}
          <span className="tracking-tight font-extrabold">{brandName}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          {visibleNavItems.map(item => (
            <Link
              key={item.id}
              href={item.url}
              className="hover:text-rose-600 transition"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA & Login */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/giris-yap"
            className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition"
          >
            Giriş Yap
          </Link>
          {headerConfig.ctaVisible && (
            <Link
              href={headerConfig.ctaUrl || '/olustur'}
              className="px-4 py-2 text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{headerConfig.ctaText || 'Davetiye Oluştur'}</span>
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition"
          aria-label="Menüyü Aç/Kapat"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col space-y-2 text-sm font-medium text-slate-700">
            {visibleNavItems.map(item => (
              <Link
                key={item.id}
                href={item.url}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-50 hover:text-rose-600 transition"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/giris-yap"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 text-center text-xs font-bold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition"
            >
              Giriş Yap
            </Link>
            {headerConfig.ctaVisible && (
              <Link
                href={headerConfig.ctaUrl || '/olustur'}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-xs font-bold bg-rose-600 text-white rounded-xl shadow-xs hover:bg-rose-700 transition"
              >
                {headerConfig.ctaText || 'Davetiye Oluştur'}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
