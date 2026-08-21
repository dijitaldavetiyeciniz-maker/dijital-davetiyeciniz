'use client';
import { useState } from 'react';
import { MessageCircle, Phone, X, Sparkles } from 'lucide-react';

export default function StickyWhatsAppCTA() {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = '+905550000000'; // Platform destek hattı
  const whatsappMessage = encodeURIComponent('Merhaba, Dijital Davetiye hakkında detaylı bilgi ve destek almak istiyorum.');

  return (
    <aside aria-label="Canlı Destek ve İletişim" className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expanded Quick Contact Card */}
      {isOpen && (
        <div className="mb-3 bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-2xl p-5 w-72 sm:w-80 text-slate-800 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold">Canlı Destek</h4>
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Çevrimiçi
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Kapat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            Davetiyenizi hazırlarken sorularınız mı var? Ekibimizle WhatsApp veya telefon üzerinden hemen iletişime geçebilirsiniz.
          </p>

          <div className="space-y-2">
            <a
              href={`https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp ile Mesaj Gönder
            </a>
            <a
              href={`tel:${phoneNumber}`}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
            >
              <Phone className="w-3.5 h-3.5" /> Bizi Arayın
            </a>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold px-4 py-3.5 rounded-full shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/40 transition-all hover:scale-105"
        aria-label="WhatsApp Canlı Destek"
      >
        <div className="relative">
          <MessageCircle className="w-5 h-5 fill-current" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full flex items-center justify-center">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
          </span>
        </div>
        <span className="text-xs tracking-wide hidden sm:inline-block font-semibold">
          {isOpen ? 'Kapat' : 'Canlı Destek & WhatsApp'}
        </span>
      </button>
    </aside>
  );
}
