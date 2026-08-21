'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2, Clock, Sparkles, AlertCircle } from 'lucide-react';

export default function IletisimPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [contactFormEnabled, setContactFormEnabled] = useState(true);
  const [contactInfo, setContactInfo] = useState({
    email: 'dijitaldavetiyeciniz@gmail.com',
    phone: '+90 (555) 000 00 00',
    address: 'Levent, Büyükdere Cad. No: 199, Şişli / İstanbul'
  });

  useEffect(() => {
    fetch('/api/super-admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings) {
          if (data.settings.contact_form_enabled === false) {
            setContactFormEnabled(false);
          }
          if (data.settings.contact_email) {
            setContactInfo({
              email: data.settings.contact_email,
              phone: data.settings.contact_phone || '+90 (555) 000 00 00',
              address: data.settings.contact_address || 'Levent, Büyükdere Cad. No: 199, Şişli / İstanbul'
            });
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setStatus({ type: 'success', text: data.message || 'Mesajınız başarıyla iletildi.' });
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        setStatus({ type: 'error', text: data.error || 'Mesaj gönderilemedi. Lütfen tekrar deneyin.' });
      }
    } catch (err: any) {
      setStatus({ type: 'error', text: 'Bağlantı hatası oluştu. Lütfen daha sonra tekrar deneyin.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-rose-200 flex flex-col">
      <Navbar />

      <main className="pt-28 pb-20 px-6 max-w-6xl mx-auto w-full flex-grow">
        <Breadcrumbs items={[{ name: 'İletişim & Destek', url: '/iletisim' }]} />

        {/* Header */}
        <div className="text-center my-12">
          <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-100 text-rose-500 px-4 py-1.5 rounded-full text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>7/24 Destek & Bilgi Merkezi</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 font-serif">
            Bizimle İletişime Geçin
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Özel tasarım talepleriniz, kurumsal iş birlikleri veya aklınıza takılan her türlü soru için bize her an ulaşabilirsiniz.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10 mb-16">
          {/* Sol Kolon: İletişim Bilgi Kartları */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mb-5">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-1 font-serif">E-posta Destek</h3>
              <p className="text-xs text-slate-500 mb-3">Tüm sorularınızı ortalama 1 saat içinde yanıtlıyoruz.</p>
              <a href={`mailto:${contactInfo.email}`} className="text-rose-600 font-semibold hover:underline text-sm break-all">
                {contactInfo.email}
              </a>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-5">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-1 font-serif">Telefon & WhatsApp</h3>
              <p className="text-xs text-slate-500 mb-3">Hafta içi ve hafta sonu kesintisiz destek hattı.</p>
              <a href={`https://wa.me/${contactInfo.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-emerald-600 font-semibold hover:underline text-sm">
                {contactInfo.phone}
              </a>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-5">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-1 font-serif">Ofis Adresimiz</h3>
              <p className="text-xs text-slate-500 mb-2">Merkez Operasyon Stüdyosu</p>
              <p className="text-slate-700 text-sm font-medium leading-relaxed">
                {contactInfo.address}
              </p>
            </div>
          </div>

          {/* Sağ Kolon: Mesaj Formu */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xl">
            {!contactFormEnabled ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-2">
                  <AlertCircle className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 font-serif">İletişim Formumuz Geçici Olarak Kapalıdır</h2>
                <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
                  Sorularınız ve acil destek talepleriniz için doğrudan <strong className="text-slate-700">{contactInfo.email}</strong> e-posta adresimizden bize ulaşabilirsiniz.
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-slate-900 mb-2 font-serif">Bize Mesaj Gönderin</h2>
                <p className="text-slate-500 text-sm mb-8">
                  Formu doldurun, uzman ekibimiz en kısa sürede sizinle iletişime geçsin.
                </p>

                {status && (
                  <div className={`mb-6 p-4 rounded-2xl text-sm flex items-center gap-3 ${
                    status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {status.type === 'success' && <CheckCircle2 className="w-5 h-5 shrink-0" />}
                    <span>{status.text}</span>
                  </div>
                )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Adınız Soyadınız *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Örn: Ayşe Yılmaz"
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    E-posta Adresiniz *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="ornek@domain.com"
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Telefon Numarası (İsteğe Bağlı)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+90 555 123 45 67"
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Konu *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Örn: Özel Tasarım / Teknik Destek"
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Mesajınız *
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Mesajınızı detaylı şekilde buraya yazabilirsiniz..."
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-rose-500/25 transition-all hover:scale-[1.02] disabled:opacity-50 cursor-pointer text-sm"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Mesajı Gönder</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
            </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
