'use client';

import React from 'react';
import Link from 'next/link';
import { SiteFooterConfig } from '@/lib/site-settings';
import { Heart, Mail, Phone, Globe } from 'lucide-react';

interface GlobalFooterProps {
  footerConfig: SiteFooterConfig;
}

export default function GlobalFooter({ footerConfig }: GlobalFooterProps) {
  if (!footerConfig.enabled) {
    // Preserved minimal legal footer if full footer is disabled
    return (
      <footer className="w-full bg-slate-900 text-slate-400 py-6 px-4 text-center text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
          <p>{footerConfig.copyrightText || '© 2026 Dijital Davetiyeciniz. Tüm hakları saklıdır.'}</p>
          <div className="flex gap-4 text-slate-400 text-xs">
            <Link href="/kvkk" className="hover:text-white transition">KVKK</Link>
            <Link href="/gizlilik-politikasi" className="hover:text-white transition">Gizlilik</Link>
            <Link href="/kullanim-kosullari" className="hover:text-white transition">Şartlar</Link>
            <Link href="/cerez-politikasi" className="hover:text-white transition">Çerezler</Link>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="w-full bg-slate-950 text-slate-300 pt-12 pb-8 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Description */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2 font-bold text-lg text-white">
              <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center">
                <Heart className="w-4 h-4 fill-current" />
              </div>
              <span>{footerConfig.logoText || 'Dijital Davetiyeciniz'}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {footerConfig.description}
            </p>
            {footerConfig.contactEmail && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Mail className="w-3.5 h-3.5 text-rose-500" />
                <a href={`mailto:${footerConfig.contactEmail}`} className="hover:text-white transition">
                  {footerConfig.contactEmail}
                </a>
              </div>
            )}
            {footerConfig.contactPhone && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Phone className="w-3.5 h-3.5 text-rose-500" />
                <a href={`tel:${footerConfig.contactPhone}`} className="hover:text-white transition">
                  {footerConfig.contactPhone}
                </a>
              </div>
            )}
          </div>

          {/* Col 2: Hızlı Bağlantılar */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Keşfedin</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/sablonlar" className="hover:text-white transition">Düğün Şablonları</Link></li>
              <li><Link href="/fiyatlandirma" className="hover:text-white transition">Paketler & Fiyatlar</Link></li>
              <li><Link href="/nasil-calisir" className="hover:text-white transition">Nasıl Çalışır?</Link></li>
              <li><Link href="/ozellikler" className="hover:text-white transition">Özellikler & LCV</Link></li>
            </ul>
          </div>

          {/* Col 3: Yardım & Destek */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Destek</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/sss" className="hover:text-white transition">Sıkça Sorulan Sorular</Link></li>
              <li><Link href="/iletisim" className="hover:text-white transition">Bize Ulaşın</Link></li>
              <li><Link href="/demo" className="hover:text-white transition">Örnek Davetiyeler</Link></li>
              <li><Link href="/hesap-silme" className="hover:text-white transition">Hesap Yönetimi</Link></li>
            </ul>
          </div>

          {/* Col 4: Yasal & Sosyal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Yasal Bilgiler</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/kvkk" className="hover:text-white transition">KVKK Aydınlatma Metni</Link></li>
              <li><Link href="/gizlilik-politikasi" className="hover:text-white transition">Gizlilik Politikası</Link></li>
              <li><Link href="/kullanim-kosullari" className="hover:text-white transition">Kullanım Koşulları</Link></li>
              <li><Link href="/cerez-politikasi" className="hover:text-white transition">Çerez Politikası</Link></li>
              <li><Link href="/mesafeli-satis" className="hover:text-white transition">Mesafeli Satış Sözleşmesi</Link></li>
            </ul>

            {/* Social Icons */}
            <div className="flex gap-3 pt-2">
              {footerConfig.socialLinks?.instagram && (
                <a href={footerConfig.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-900 hover:bg-rose-600 hover:text-white text-slate-400 transition" aria-label="Instagram">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
              )}
              {footerConfig.socialLinks?.facebook && (
                <a href={footerConfig.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-900 hover:bg-rose-600 hover:text-white text-slate-400 transition" aria-label="Facebook">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.667 5H18V0h-3.808C10.597 0 9 1.583 9 4.615V8z"/></svg>
                </a>
              )}
              {footerConfig.socialLinks?.twitter && (
                <a href={footerConfig.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-900 hover:bg-rose-600 hover:text-white text-slate-400 transition" aria-label="Twitter">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              )}
              {footerConfig.socialLinks?.youtube && (
                <a href={footerConfig.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-900 hover:bg-rose-600 hover:text-white text-slate-400 transition" aria-label="YouTube">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>{footerConfig.copyrightText || '© 2026 Dijital Davetiyeciniz. Tüm hakları saklıdır.'}</p>
          <p className="text-[11px] text-slate-600">{footerConfig.companyName || 'Dijital Davetiyeciniz'}</p>
        </div>
      </div>
    </footer>
  );
}
