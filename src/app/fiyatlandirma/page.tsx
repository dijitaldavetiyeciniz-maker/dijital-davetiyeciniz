import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { CheckCircle2, ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Şeffaf Fiyatlandırma | Dijital Davetiyeciniz',
  description: 'Aylık aidat yok, sürpriz yok. 120+ şablon, müzik, zarf animasyonu, LCV ve oturma planı dahil tek seferlik şeffaf paket fiyatı.',
  alternates: {
    canonical: '/fiyatlandirma',
  },
};

export default function FiyatlandirmaPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-rose-200 flex flex-col">
      <Navbar />

      <main className="pt-28 pb-20 px-6 max-w-6xl mx-auto w-full flex-grow">
        <Breadcrumbs items={[{ name: 'Fiyatlandırma', url: '/fiyatlandirma' }]} />

        {/* Header */}
        <div className="text-center my-12">
          <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-100 text-rose-500 px-4 py-1.5 rounded-full text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tek Seferlik Ödeme • Ömür Boyu Yayında</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 font-serif">
            Şeffaf Paket Fiyatları
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Gizli aidat yok. Davetiyenizi ücretsiz hazırlayın, istediğiniz paketi seçerek tek seferlik ödemeyle hemen yayınlayın.
          </p>
        </div>

        {/* 3-Tier Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 items-stretch">
          {/* 1. Standart Taslak */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="inline-block bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold mb-4">
                Ücretsiz Taslak
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2 font-serif">Standart Taslak</h3>
              <p className="text-slate-500 text-xs mb-6">
                Tüm temel özelliklerle davetiyenizi oluşturun ve önizleyin.
              </p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black text-slate-900">₺0</span>
                <span className="text-slate-400 font-semibold text-xs">/ Ücretsiz</span>
              </div>
              <ul className="space-y-3 mb-8 text-xs text-slate-600">
                {[
                  "Temel Şablonlar & Tasarım",
                  "10 Adet Fotoğraf Yükleme",
                  "5MB Ses Dosyası",
                  "Önizleme & Taslak Düzenleme",
                  "Misafir Listesi Oluşturma"
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href="/olustur"
              className="w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-800 py-3 px-4 rounded-xl font-bold text-sm transition-colors block"
            >
              Ücretsiz Başla
            </Link>
          </div>

          {/* 2. Premium (Featured) */}
          <div className="bg-white rounded-3xl border-2 border-rose-500 p-8 shadow-xl relative overflow-hidden flex flex-col justify-between transform md:-translate-y-2">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-rose-500 to-pink-500 text-white text-[10px] font-extrabold uppercase tracking-wider py-1 px-4 rounded-bl-xl">
              En Çok Tercih Edilen
            </div>
            <div>
              <div className="inline-block bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-xs font-bold mb-4">
                Her Şey Dahil
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2 font-serif">Premium Paket</h3>
              <p className="text-slate-500 text-xs mb-6">
                Tüm sinematik açılışlar, LCV ve sınırsız yayın dahil.
              </p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black text-slate-900">₺1.999</span>
                <span className="text-slate-400 font-semibold text-xs">/ Tek Seferlik</span>
              </div>
              <ul className="space-y-3 mb-8 text-xs text-slate-700">
                {[
                  "120+ Premium & Flagship Şablon",
                  "Tüm Sinematik & Zarf Açılışları",
                  "50 Adet Yüksek Çözünürlüklü Fotoğraf",
                  "15MB Özel Arka Plan Müziği",
                  "Canlı LCV & Telegram Bildirimleri",
                  "Masa Oturma Planı & QR Check-in",
                  "Özel Alan Adı (Custom Domain) Desteği",
                  "Ömür Boyu Kesintisiz Yayın"
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="font-medium">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href="/olustur"
              className="w-full text-center bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white py-3.5 px-4 rounded-xl font-bold text-sm transition-all shadow-md shadow-rose-500/20 block"
            >
              Hemen Davetiye Oluştur
            </Link>
          </div>

          {/* 3. Kurumsal Paket */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="inline-block bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold mb-4">
                Kurumsal & Gala
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2 font-serif">Kurumsal Paket</h3>
              <p className="text-slate-500 text-xs mb-6">
                Kongre, zirve, gala ve büyük organizasyonlar için.
              </p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black text-slate-900">₺4.999</span>
                <span className="text-slate-400 font-semibold text-xs">/ Tek Seferlik</span>
              </div>
              <ul className="space-y-3 mb-8 text-xs text-slate-600">
                {[
                  "Tüm Premium Özellikler",
                  "200 Fotoğraf & 50MB Müzik",
                  "Çoklu Etkinlik Program Akışı",
                  "VIP Masa & Salon Oturma Planı",
                  "Marka Filigranını Kaldırma",
                  "Öncelikli 7/24 Destek"
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href="/olustur?type=corporate"
              className="w-full text-center bg-slate-900 hover:bg-slate-800 text-white py-3 px-4 rounded-xl font-bold text-sm transition-colors block"
            >
              Kurumsal Başla
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
