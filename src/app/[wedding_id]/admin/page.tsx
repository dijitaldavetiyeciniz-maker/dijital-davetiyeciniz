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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [activeTab, setActiveTab] = useState<'rsvps' | 'design' | 'payment'>('rsvps');
  
  // Tasarım Stüdyosu State
  const [templateId, setTemplateId] = useState('template1');
  const [primaryColor, setPrimaryColor] = useState('#f43f5e');
  const [fontFamily, setFontFamily] = useState('sans');
  const [bgImageUrl, setBgImageUrl] = useState('');
  const [telegramBotToken, setTelegramBotToken] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [themes, setThemes] = useState<any[]>([]);

  useEffect(() => {
    // Hazır temaları yükle
    import('@/lib/themes').then(module => {
      setThemes(module.predefinedThemes);
    });

    async function loadData() {
      // 1. Düğün bilgilerini çek
      const { data: weddingData, error } = await supabase
        .from('weddings')
        .select('*')
        .eq('slug', wedding_id)
        .single();
        
      if (error || !weddingData) {
        setLoading(false);
        return;
      }
      setWedding(weddingData);
      
      // 2. Mevcut kullanıcının (Auth) oturumunu kontrol et
      const { data: { session } } = await supabase.auth.getSession();
      
      // Eğer giren kişi bu davetiyenin sahibiyse, şifre sormadan içeri al!
      if (session?.user?.id && session.user.id === weddingData.user_id) {
        setIsOwner(true);
        setIsAuthenticated(true);
        fetchRsvps(weddingData.id);
      }
      
      if (weddingData.template_id) setTemplateId(weddingData.template_id);
      if (weddingData.primary_color) setPrimaryColor(weddingData.primary_color);
      if (weddingData.font_family) setFontFamily(weddingData.font_family);
      if (weddingData.background_image_url) setBgImageUrl(weddingData.background_image_url);
      if (weddingData.telegram_bot_token) setTelegramBotToken(weddingData.telegram_bot_token);
      if (weddingData.telegram_chat_id) setTelegramChatId(weddingData.telegram_chat_id);
      
      setLoading(false);
    }
    loadData();
  }, [wedding_id]);

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
      setIsAuthenticated(true);
      fetchRsvps(wedding.id);
    } else {
      setErrorMsg('Şifre hatalı. Lütfen tekrar deneyin.');
    }
  }

  async function handleSaveDesign() {
    const { error } = await supabase
      .from('weddings')
      .update({
        template_id: templateId,
        primary_color: primaryColor,
        font_family: fontFamily,
        background_image_url: bgImageUrl,
        telegram_bot_token: telegramBotToken,
        telegram_chat_id: telegramChatId
      })
      .eq('id', wedding.id);
      
    if (!error) {
      alert('Tasarım ayarları başarıyla kaydedildi!');
    } else {
      alert('Hata oluştu: ' + error.message);
    }
  }

  function applyPreset(theme: any) {
    setTemplateId(theme.template_id);
    setPrimaryColor(theme.primary_color);
    setFontFamily(theme.font_family);
    setBgImageUrl(theme.background_image_url || '');
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    
    if (!telegramBotToken || !telegramChatId) {
      alert("Lütfen önce sayfanın altından Telegram Bot Token ve Chat ID bilgilerinizi girip 'Kaydet' butonuna basın.");
      return;
    }

    const file = e.target.files[0];
    setIsUploading(true);

    const formData = new FormData();
    formData.append('photo', file);
    formData.append('wedding_id', wedding.id);

    try {
      const res = await fetch('/api/telegram/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (data.success) {
        // Dosya yüklendi, Proxy URL'sini oluştur ve arkaplan kutusuna yerleştir
        const proxyUrl = `/api/image?file_id=${data.file_id}&wedding_id=${wedding.id}`;
        setBgImageUrl(proxyUrl);
        alert("Fotoğraf başarıyla Telegram'a yüklendi! Lütfen 'Kaydet' butonuna basmayı unutmayın.");
      } else {
        alert("Yükleme başarısız: " + data.error);
      }
    } catch (err) {
      alert("Bir hata oluştu.");
    }
    
    setIsUploading(false);
  }

  if (loading) return <div className="p-10 text-center">Yükleniyor...</div>;
  if (!wedding) return <div className="p-10 text-center">Böyle bir düğün bulunamadı.</div>;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 text-center border border-slate-100">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Tasarım Paneli</h1>
          <p className="text-slate-500 mb-8">Oluşturduğunuz davetiyeyi düzenlemek için şifrenizi girin. (Veya <a href="/giris-yap" className="text-rose-500 hover:underline font-bold">Giriş Yaparak</a> şifresiz erişin).</p>
          
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
            <p className="text-slate-500">Müşteri Oluşturma ve Yönetim Paneli</p>
          </div>
          <button onClick={() => setIsAuthenticated(false)} className="text-sm font-medium text-slate-500 hover:text-slate-800">Çıkış Yap</button>
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
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Paintbrush className="w-6 h-6 text-rose-500" /> Tasarım Stüdyosu
            </h2>
            <p className="text-slate-500 mb-8">Premium temalardan birini tek tıkla seçebilir veya aşağıdan kendi özel renk ve fontunuzu belirleyebilirsiniz.</p>
            
            {/* HAZIR TEMALAR */}
            <div className="mb-10">
              <h3 className="font-bold text-lg mb-4 text-slate-800">1. Premium Temalar (Tek Tıkla Uygula)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {themes.map(theme => (
                  <button 
                    key={theme.id}
                    onClick={() => applyPreset(theme)}
                    className="flex flex-col items-center p-3 rounded-xl border-2 transition-all hover:shadow-md text-left"
                    style={{ borderColor: primaryColor === theme.primary_color && templateId === theme.template_id ? theme.primary_color : '#e2e8f0' }}
                  >
                    <div className="w-10 h-10 rounded-full mb-2 shadow-inner" style={{ backgroundColor: theme.primary_color }}></div>
                    <span className="text-xs font-bold text-slate-700 text-center line-clamp-1">{theme.name}</span>
                    <span className="text-[10px] text-slate-400 mt-1">{theme.category}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-slate-200 mb-10 w-full" />

            <h3 className="font-bold text-lg mb-6 text-slate-800">2. İnce Ayarlar (Manuel Tasarım)</h3>
            <div className="space-y-6 max-w-lg">
              
              <div>
                <label className="block text-sm font-medium mb-2">Ana Şablon Yapısı</label>
                <select value={templateId} onChange={e => setTemplateId(e.target.value)} className="w-full border p-3 rounded-xl bg-slate-50">
                  <option value="template1">Şablon 1: Cam Efektli (Soft)</option>
                  <option value="template2">Şablon 2: Karanlık (Neon Işıklı)</option>
                  <option value="template3">Şablon 3: Rustik (Doğa Konseptli)</option>
                  <option value="template4">Şablon 4: Lüks (Kraliyet Tarzı)</option>
                  <option value="template5">Şablon 5: Minimalist (Modern Vogue)</option>
                </select>
              </div>

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
                <label className="block text-sm font-medium mb-2">Arkaplan Görseli</label>
                
                <div className="flex flex-col gap-4">
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileUpload} 
                      className="hidden" 
                      id="file-upload" 
                      disabled={isUploading}
                    />
                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center gap-2">
                      <div className="w-12 h-12 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                      </div>
                      <span className="font-bold text-slate-700">
                        {isUploading ? "Yükleniyor (Lütfen bekleyin)..." : "Bilgisayardan Fotoğraf Seç (Ücretsiz)"}
                      </span>
                      <span className="text-xs text-slate-400">Telegram Bot üzerinden 0 maliyetle sınırsız barındırma</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="h-px bg-slate-200 flex-1"></div>
                    <span className="text-xs text-slate-400 font-bold uppercase">VEYA MANUEL LİNK GİRİN</span>
                    <div className="h-px bg-slate-200 flex-1"></div>
                  </div>

                  <input type="text" value={bgImageUrl} onChange={e => setBgImageUrl(e.target.value)} placeholder="https://resim-linki.com/foto.jpg" className="w-full border p-3 rounded-xl bg-slate-50 text-sm font-mono" />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-500" /> Telegram Bildirimleri (Opsiyonel)
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      Telegram Bot Token 
                      <a href="https://core.telegram.org/bots/features#botfather" target="_blank" className="w-5 h-5 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center text-xs font-bold hover:bg-slate-300" title="BotFather üzerinden bot oluşturmayı öğrenin">?</a>
                    </label>
                    <input type="text" value={telegramBotToken} onChange={e => setTelegramBotToken(e.target.value)} placeholder="123456789:ABCdefGHIjklmNOPqrstUVwxyZ" className="w-full border p-3 rounded-xl bg-slate-50" />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      Telegram Grup ID (Chat ID)
                      <a href="https://stackoverflow.com/questions/32423837/telegram-bot-how-to-get-a-group-chat-id" target="_blank" className="w-5 h-5 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center text-xs font-bold hover:bg-slate-300" title="Grup ID'nizi nasıl bulacağınızı öğrenin">?</a>
                    </label>
                    <input type="text" value={telegramChatId} onChange={e => setTelegramChatId(e.target.value)} placeholder="-100123456789" className="w-full border p-3 rounded-xl bg-slate-50" />
                    <p className="text-xs text-slate-400 mt-2">LCV (Katılım) bildirimlerinin ve fotoğrafların anında kendi Telegram grubunuza düşmesi için doldurun.</p>
                  </div>
                </div>
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
