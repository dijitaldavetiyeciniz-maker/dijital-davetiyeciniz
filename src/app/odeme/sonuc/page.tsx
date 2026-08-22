'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Clock, XCircle, ArrowRight, RefreshCw, Home } from 'lucide-react';

function PaymentResultContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status') || 'paid';
  const paymentId = searchParams.get('payment_id');
  const planTier = searchParams.get('plan') || 'Premium Paket';

  if (status === 'paid') {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Ödemeniz Başarıyla Alındı!</h1>
          <p className="text-slate-400 text-sm mb-6">
            <strong>{planTier}</strong> üyeliğiniz ve tüm ayrıcalıklı özellikler hesabınıza başarıyla tanımlandı.
          </p>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 mb-6 text-left text-xs space-y-2">
            <div className="flex justify-between text-slate-400">
              <span>İşlem Durumu:</span>
              <span className="text-emerald-400 font-semibold">Onaylandı</span>
            </div>
            {paymentId && (
              <div className="flex justify-between text-slate-400">
                <span>Referans Kodu:</span>
                <span className="font-mono text-slate-300">{paymentId.slice(0, 12)}...</span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-rose-500/20"
            >
              <span>Paneline Git ve Davetiyeni Tasarla</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-3 px-6 rounded-xl transition-colors text-sm"
            >
              <Home className="w-4 h-4" />
              <span>Ana Sayfaya Dön</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Clock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Ödemeniz Doğrulanıyor</h1>
          <p className="text-slate-400 text-sm mb-6">
            Banka onay süreci devam etmektedir. Onay tamamlandığında paketiniz otomatik olarak aktif edilecektir.
          </p>
          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-medium py-3.5 px-6 rounded-xl transition-colors"
            >
              <span>Paneli Kontrol Et</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl">
        <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Ödeme Tamamlanamadı</h1>
        <p className="text-slate-400 text-sm mb-6">
          Ödeme işlemi bankanız veya ödeme sağlayıcısı tarafından onaylanmadı. Kart bilgilerinizi ve limitinizi kontrol ederek tekrar deneyebilirsiniz.
        </p>
        <div className="space-y-3">
          <Link
            href="/fiyatlandirma"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-rose-500/20"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Fiyatlandırmaya Dön ve Tekrar Dene</span>
          </Link>
          <Link
            href="/iletisim"
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-3 px-6 rounded-xl transition-colors text-sm"
          >
            <span>Destek Ekibi ile İletişime Geç</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Yükleniyor...</div>}>
      <PaymentResultContent />
    </Suspense>
  );
}
