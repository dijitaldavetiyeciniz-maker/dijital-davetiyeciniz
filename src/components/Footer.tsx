'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Mail, Phone } from 'lucide-react';
import { defaultSiteConfig, SiteFooterConfig } from '@/lib/site-settings';

interface FooterProps {
  initialConfig?: SiteFooterConfig;
}

export default function Footer({ initialConfig }: FooterProps) {
  const [footerConfig, setFooterConfig] = useState<SiteFooterConfig>(initialConfig || defaultSiteConfig.footer);

  useEffect(() => {
    if (!initialConfig) {
      fetch('/api/site-settings/public')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.settings?.footer) {
            setFooterConfig(data.settings.footer);
          }
        })
        .catch(() => {});
    }
  }, [initialConfig]);

  if (footerConfig.enabled === false) {
    return null;
  }

  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 px-6 border-t border-slate-900 w-full font-sans mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
        
        {/* Brand Column */}
        <div className="lg:col-span-2">
          <Link href="/" className="flex items-center gap-2.5 text-2xl font-bold font-serif text-white mb-5 hover:opacity-90 transition-opacity">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-600 text-white flex items-center justify-center shadow-md shadow-rose-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <span>
              {footerConfig.logoText || 'Dijital Davetiyeciniz'}
            </span>
          </Link>
          <p className="text-sm leading-relaxed mb-6 max-w-sm text-slate-400">
            {footerConfig.description || 'Hayalinizdeki dijital düğün, nişan ve kına davetiyesini dakikalar içinde oluşturun, misafirlerinizle anında paylaşın.'}
          </p>
          <div className="space-y-2 text-xs text-slate-400">
            {footerConfig.contactEmail && (
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-rose-500" />
                <a href={`mailto:${footerConfig.contactEmail}`} className="hover:text-white transition-colors">
                  {footerConfig.contactEmail}
                </a>
              </div>
            )}
            {footerConfig.contactPhone && (
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-rose-500" />
                <span>{footerConfig.contactPhone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Keşfet (İç Linkleme) */}
        <div>
          <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-5">Keşfet</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href="/sablonlar" className="hover:text-rose-400 transition-colors">120+ Şablon Kataloğu</Link></li>
            <li><Link href="/olustur" className="hover:text-rose-400 transition-colors">Davetiye Oluştur</Link></li>
            <li><Link href="/ozellikler" className="hover:text-rose-400 transition-colors">Platform Özellikleri</Link></li>
            <li><Link href="/nasil-calisir" className="hover:text-rose-400 transition-colors">Nasıl Çalışır?</Link></li>
            <li><Link href="/fiyatlandirma" className="hover:text-rose-400 transition-colors">Fiyatlandırma Paketleri</Link></li>
          </ul>
        </div>

        {/* Etkinlik Türleri */}
        <div>
          <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-5">Etkinlikler</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href="/sablonlar?category=wedding" className="hover:text-rose-400 transition-colors">Düğün Davetiyeleri</Link></li>
            <li><Link href="/sablonlar?category=engagement" className="hover:text-rose-400 transition-colors">Nişan & Söz Davetiyesi</Link></li>
            <li><Link href="/sablonlar?category=henna" className="hover:text-rose-400 transition-colors">Kına Gecesi Temaları</Link></li>
            <li><Link href="/sablonlar?category=babyshower" className="hover:text-rose-400 transition-colors">Baby Shower & Doğum Günü</Link></li>
            <li><Link href="/sablonlar?category=corporate" className="hover:text-rose-400 transition-colors">Kurumsal Davetler & Gala</Link></li>
          </ul>
        </div>

        {/* Yasal & Sözleşmeler */}
        <div>
          <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-5">Yasal</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href={footerConfig.legalLinks?.privacy || "/gizlilik-politikasi"} className="hover:text-rose-400 transition-colors">Gizlilik Politikası</Link></li>
            <li><Link href={footerConfig.legalLinks?.kvkk || "/kvkk"} className="hover:text-rose-400 transition-colors">KVKK Aydınlatma Metni</Link></li>
            <li><Link href={footerConfig.legalLinks?.cookies || "/cerez-politikasi"} className="hover:text-rose-400 transition-colors">Çerez Politikası</Link></li>
            <li><Link href="/mesafeli-satis" className="hover:text-rose-400 transition-colors">Mesafeli Satış Sözleşmesi</Link></li>
            <li><Link href="/iptal-ve-iade" className="hover:text-rose-400 transition-colors">İptal ve İade Koşulları</Link></li>
            <li><Link href={footerConfig.legalLinks?.terms || "/kullanim-kosullari"} className="hover:text-rose-400 transition-colors">Kullanım Koşulları</Link></li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>{footerConfig.copyrightText || `© ${new Date().getFullYear()} Dijital Davetiyeciniz. Tüm hakları saklıdır.`}</p>
        <p className="flex items-center gap-1">
          <span>Doğa dostu, kağıtsız dijital gelecek</span>
        </p>
      </div>
    </footer>
  );
}
