'use client';
import { useState, useEffect, use } from 'react';
import { supabase } from '@/lib/supabase';
import { Lock, Users, MessageSquare, Paintbrush, CreditCard, Save } from 'lucide-react';

export default function CoupleAdminPage({
  params,
}: {
  params: Promise<{ wedding_id: string }>;
}) {
  const { wedding_id } = use(params);
  
  const [wedding, setWedding] = useState<any>(null);
  const [rsvps, setRsvps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [passwordInput, setPasswordInput] = useState('');
  const [isAuthed, setIsAuthed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [activeTab, setActiveTab] = useState<'rsvps' | 'design' | 'payment'>('rsvps');
  
  // Tasarım Stüdyosu State
  const [primaryColor, setPrimaryColor] = useState('#f43f5e');
  const [fontFamily, setFontFamily] = useState('sans');
  const [bgImageUrl, setBgImageUrl] = useState('');

  useEffect(() => {
    fetchWedding();
  }, []);

  async function fetchWedding() {
    const { data } = await supabase
      .from('weddings')
      .select('*')
      .eq('slug', wedding_id)
      .single();
    if (data) {
      setWedding(data);
      if (data.primary_color) setPrimaryColor(data.primary_color);
      if (data.font_family) setFontFamily(data.font_family);
      if (data.background_image_url) setBgImageUrl(data.background_image_url);
    }
    setLoading(false);
  }

  async function fetchRsvps(weddingId: string) {
    const { data } = await supabase
      .from('rsvps')
      .select('*')
      .eq('wedding_id', weddingId)
      .order('created_at', { ascending: false });
    if (data) setRsvps(data);
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (wedding && passwordInput === wedding.admin_password) {
      setIsAuthed(true);
      fetchRsvps(wedding.id);
    } else {
      setErrorMsg('Şifre hatalı. Lütfen tekrar deneyin.');
    }
  }

  async function handleSaveDesign() {
    const { error } = await supabase
      .from('weddings')
      .update({
        primary_color: primaryColor,
        font_family: fontFamily,
        background_image_url: bgImageUrl
      })
      .eq('id', wedding.id);
      
    if (!error) {
      alert('Tasarım ayarları başarıyla kaydedildi!');
    } else {
      alert('Hata oluştu: ' + error.message);
    }
  }

  if (loading) return <div className="p-10 text-center">Yükleniyor...</div>;
  if (!wedding) return <div className="p-10 text-center">Böyle bir düğün bulunamadı.</div>;

  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
          <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold mb-2">{wedding.bride_name} & {wedding.groom_name}</h1>
          <p className="text-slate-500 mb-8">Lütfen yönetim paneli şifrenizi girin.</p>
          
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              value={passwordInput}
              onChange={e => setPasswordInput(e.target.value)}
              placeholder="Şifre"
              className="w-full border p-3 rounded-xl mb-4 text-center text-lg tracking-widest"
              autoFocus
            />
            {errorMsg && <p className="text-red-500 text-sm mb-4">{errorMsg}</p>}
            <button className="w-full bg-rose-500 text-white font-bold py-3 rounded-xl hover:bg-rose-600 transition-colors">
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
    );
  }

  const totalGuests = rsvps.filter(r => r.is_attending).reduce((sum, curr) => sum + curr.guest_count, 0);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{wedding.bride_name} & {wedding.groom_name}</h1>
            <p className="text-slate-500">Müşteri Yönetim Paneli</p>
          </div>
          <button onClick={() => setIsAuthed(false)} className="text-sm font-medium text-slate-500 hover:text-slate-800">Çıkış Yap</button>
        </header>
        
        {/* Sekmeler (Tabs) */}
        <div className="flex border-b border-slate-200 mb-8 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('rsvps')} 
            className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 whitespace-nowrap ${activeTab === 'rsvps' ? 'border-rose-500 text-rose-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <Users className="w-4 h-4" /> Gelen Yanıtlar (LCV)
          </button>
          <button 
            onClick={() => setActiveTab('design')} 
            className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 whitespace-nowrap ${activeTab === 'design' ? 'border-rose-500 text-rose-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <Paintbrush className="w-4 h-4" /> Tasarım Stüdyosu
          </button>
          <button 
            onClick={() => setActiveTab('payment')} 
            className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 whitespace-nowrap ${activeTab === 'payment' ? 'border-rose-500 text-rose-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <CreditCard className="w-4 h-4" /> Ödeme & Yayınlama
            {!wedding.is_paid && <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse ml-1"></span>}
          </button>
        </div>

        {activeTab === 'rsvps' && (
          <div>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-slate-500 text-sm">Kesin Gelecek Kişi Sayısı</div>
                  <div className="text-2xl font-bold">{totalGuests} Kişi</div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-slate-500 text-sm">Gelen LCV Yanıtı</div>
                  <div className="text-2xl font-bold">{rsvps.length} Yanıt</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="p-4 font-medium text-slate-500">İsim Soyisim</th>
                    <th className="p-4 font-medium text-slate-500">Durum</th>
                    <th className="p-4 font-medium text-slate-500">Kişi</th>
                    <th className="p-4 font-medium text-slate-500">Mesaj</th>
                  </tr>
                </thead>
                <tbody>
                  {rsvps.length === 0 && (
                    <tr><td colSpan={4} className="p-8 text-center text-slate-500">Henüz LCV yanıtı yok.</td></tr>
                  )}
                  {rsvps.map(rsvp => (
                    <tr key={rsvp.id} className="border-b border-slate-100 last:border-0">
                      <td className="p-4 font-medium">{rsvp.guest_name}</td>
                      <td className="p-4">
                        {rsvp.is_attending ? 
                          <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">Katılacak</span> : 
                          <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-sm font-medium">Katılamayacak</span>
                        }
                      </td>
                      <td className="p-4 text-slate-600">{rsvp.is_attending ? rsvp.guest_count : '-'}</td>
                      <td className="p-4 text-slate-500 text-sm">{rsvp.message || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'design' && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Paintbrush className="w-6 h-6 text-rose-500" /> Tasarım Stüdyosu
            </h2>
            <p className="text-slate-500 mb-8">Davetiyenizin renklerini, yazı tiplerini ve fotoğraflarını buradan değiştirebilirsiniz.</p>
            
            <div className="space-y-6 max-w-lg">
              <div>
                <label className="block text-sm font-medium mb-2">Tema Ana Rengi</label>
                <div className="flex items-center gap-4">
                  <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="w-14 h-14 rounded cursor-pointer" />
                  <span className="text-slate-500 font-mono">{primaryColor}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Yazı Tipi (Font Ailesi)</label>
                <select value={fontFamily} onChange={e => setFontFamily(e.target.value)} className="w-full border p-3 rounded-xl bg-slate-50">
                  <option value="sans">Modern (Sans-serif)</option>
                  <option value="serif">Zarif (Serif - Tırnaklı)</option>
                  <option value="mono">Farklı (Monospace)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Arkaplan Görsel Linki (Opsiyonel)</label>
                <input type="text" value={bgImageUrl} onChange={e => setBgImageUrl(e.target.value)} placeholder="https://resim-linki.com/foto.jpg" className="w-full border p-3 rounded-xl bg-slate-50" />
                <p className="text-xs text-slate-400 mt-2">Düz renk yerine kendi fotoğrafınızı arkaplan yapmak için resminizin internet linkini buraya yapıştırın.</p>
              </div>

              <button onClick={handleSaveDesign} className="mt-8 flex items-center justify-center gap-2 w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors">
                <Save className="w-5 h-5" /> Değişiklikleri Kaydet ve Yayınla
              </button>
            </div>
          </div>
        )}

        {activeTab === 'payment' && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center max-w-2xl mx-auto">
            {wedding.is_paid ? (
              <div>
                <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">Davetiyeniz Yayında!</h2>
                <p className="text-slate-500 mb-6">Ödemeniz onaylanmıştır. Davetiyenizi sevdiklerinize gönderebilirsiniz.</p>
                <a href={`/${wedding.slug}`} target="_blank" className="inline-block px-8 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors">
                  Davetiyeyi Görüntüle
                </a>
              </div>
            ) : (
              <div>
                <div className="w-20 h-20 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Lock className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Siteyi Canlıya Almak İçin Ödeme Gerekiyor</h2>
                <p className="text-slate-500 mb-8 leading-relaxed">
                  Tasarımınızı tamamladınız! Davetiyenizi misafirlerinize gönderebilmek için aşağıdaki IBAN hesabına ödemenizi gerçekleştirip WhatsApp üzerinden dekont iletmeniz gerekmektedir.
                </p>
                
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-left mb-8">
                  <h3 className="font-bold text-slate-800 mb-4 border-b pb-2">Banka Bilgileri</h3>
                  <div className="space-y-2">
                    <p><span className="text-slate-500">Banka:</span> Enpara / QNB Finansbank</p>
                    <p><span className="text-slate-500">Alıcı:</span> Dijital Davetiyeciniz Yazılım Hizmetleri</p>
                    <p><span className="text-slate-500">IBAN:</span> <span className="font-mono bg-white px-2 py-1 border rounded">TR12 3456 7890 0000 0000 0000 00</span></p>
                    <p><span className="text-slate-500">Açıklama:</span> <strong className="text-rose-500">{wedding.slug}</strong> (Ödeme açıklamasına mutlaka bunu yazın)</p>
                  </div>
                </div>

                <a href={`https://wa.me/905555555555?text=Merhaba, %20${wedding.slug}%20isimli%20davetiyemin%20ödemesini%20yaptım.%20Dekontu%20iletiyorum.`} target="_blank" className="inline-block px-8 py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors shadow-lg shadow-green-200">
                  WhatsApp'tan Bildir
                </a>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
