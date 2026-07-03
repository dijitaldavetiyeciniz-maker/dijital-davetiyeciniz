'use client';
import { useState, useEffect, use } from 'react';
import { supabase } from '@/lib/supabase';
import { Lock, Users, MessageSquare, Paintbrush, CreditCard, Save, Wand2 } from 'lucide-react';
import { getRandomQuote } from '@/lib/aiQuotes';

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
  const [textColor, setTextColor] = useState('#1e293b'); // Yeni eklenen metin rengi
  const [envelopeColor, setEnvelopeColor] = useState('#e6d5c3');
  const [effectType, setEffectType] = useState('');
  const [fontFamily, setFontFamily] = useState('sans');
  const [bgImageUrl, setBgImageUrl] = useState('');
  const [telegramBotToken, setTelegramBotToken] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');
  const [useEnvelope, setUseEnvelope] = useState(true);
  
  // Genel Bilgiler State
  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [brideParents, setBrideParents] = useState('');
  const [groomParents, setGroomParents] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [venueName, setVenueName] = useState('');
  const [venueAddress, setVenueAddress] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  
  const [previewKey, setPreviewKey] = useState(Date.now()); // iframe yenilemek için

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
      if (weddingData.text_color) setTextColor(weddingData.text_color);
      if (weddingData.envelope_color) setEnvelopeColor(weddingData.envelope_color);
      if (weddingData.effect_type) setEffectType(weddingData.effect_type);
      if (weddingData.font_family) setFontFamily(weddingData.font_family);
      if (weddingData.background_image_url) setBgImageUrl(weddingData.background_image_url);
      if (weddingData.telegram_bot_token) setTelegramBotToken(weddingData.telegram_bot_token);
      if (weddingData.telegram_chat_id) setTelegramChatId(weddingData.telegram_chat_id);
      if (weddingData.use_envelope !== undefined && weddingData.use_envelope !== null) setUseEnvelope(weddingData.use_envelope);
      
      // Genel Bilgileri Doldur
      if (weddingData.bride_name) setBrideName(weddingData.bride_name);
      if (weddingData.groom_name) setGroomName(weddingData.groom_name);
      if (weddingData.bride_parents) setBrideParents(weddingData.bride_parents);
      if (weddingData.groom_parents) setGroomParents(weddingData.groom_parents);
      if (weddingData.wedding_date) setWeddingDate(weddingData.wedding_date);
      if (weddingData.venue_name) setVenueName(weddingData.venue_name);
      if (weddingData.venue_address) setVenueAddress(weddingData.venue_address);
      if (weddingData.google_maps_url) setGoogleMapsUrl(weddingData.google_maps_url);
      if (weddingData.custom_message) setCustomMessage(weddingData.custom_message);
      
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
        text_color: textColor,
        envelope_color: envelopeColor,
        effect_type: effectType,
        font_family: fontFamily,
        background_image_url: bgImageUrl,
        telegram_bot_token: telegramBotToken,
        telegram_chat_id: telegramChatId,
        use_envelope: useEnvelope,
        bride_name: brideName,
        groom_name: groomName,
        bride_parents: brideParents,
        groom_parents: groomParents,
        wedding_date: weddingDate,
        venue_name: venueName,
        venue_address: venueAddress,
        google_maps_url: googleMapsUrl,
        custom_message: customMessage
      })
      .eq('id', wedding.id);
      
    if (!error) {
      alert('Tüm ayarlar başarıyla kaydedildi!');
      setPreviewKey(Date.now()); // Iframe'i yenile
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

  function handleAIGenerate() {
    let newQuote = getRandomQuote();
    // Aynı söz gelmesin diye basit bir kontrol
    while (newQuote === customMessage && customMessage.length > 0) {
      newQuote = getRandomQuote();
    }
    setCustomMessage(newQuote);
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
          <div className="grid lg:grid-cols-2 gap-8">
            {/* SOL KOLON: Form ve Ayarlar */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Paintbrush className="w-6 h-6 text-rose-500" /> Tasarım Stüdyosu
              </h2>
              <p className="text-slate-500 mb-8">Bilgilerinizi ve temanızı güncelledikten sonra "Kaydet" butonuna basarak sağdaki önizlemede sonuçları görebilirsiniz.</p>
              
              {/* BÖLÜM 1: GENEL BİLGİLER */}
              <h3 className="font-bold text-lg mb-4 text-slate-800 border-b pb-2">1. Genel Bilgiler</h3>
              <div className="space-y-4 mb-10">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Gelin / Gelin Adayı</label>
                    <input value={brideName} onChange={e=>setBrideName(e.target.value)} type="text" className="w-full border p-2 rounded-lg bg-slate-50 focus:bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Damat / Damat Adayı</label>
                    <input value={groomName} onChange={e=>setGroomName(e.target.value)} type="text" className="w-full border p-2 rounded-lg bg-slate-50 focus:bg-white" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Gelin Anne & Baba</label>
                    <input value={brideParents} onChange={e=>setBrideParents(e.target.value)} type="text" className="w-full border p-2 rounded-lg bg-slate-50 focus:bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Damat Anne & Baba</label>
                    <input value={groomParents} onChange={e=>setGroomParents(e.target.value)} type="text" className="w-full border p-2 rounded-lg bg-slate-50 focus:bg-white" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Tarih ve Saat</label>
                    <input type="datetime-local" value={weddingDate} onChange={e=>setWeddingDate(e.target.value)} className="w-full border p-2 rounded-lg bg-slate-50 focus:bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Mekan Adı</label>
                    <input value={venueName} onChange={e=>setVenueName(e.target.value)} type="text" className="w-full border p-2 rounded-lg bg-slate-50 focus:bg-white" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Açık Adres</label>
                    <input value={venueAddress} onChange={e=>setVenueAddress(e.target.value)} type="text" className="w-full border p-2 rounded-lg bg-slate-50 focus:bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Google Maps Linki</label>
                    <input value={googleMapsUrl} onChange={e=>setGoogleMapsUrl(e.target.value)} type="url" className="w-full border p-2 rounded-lg bg-slate-50 focus:bg-white" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-medium">Çifte Özel Söz / Davet Metni</label>
                    <button onClick={handleAIGenerate} type="button" className="text-xs font-bold text-rose-500 bg-rose-50 px-3 py-1 rounded-full flex items-center gap-1 hover:bg-rose-100 transition-colors">
                      <Wand2 className="w-3 h-3" /> Yapay Zeka ile Yazdır
                    </button>
                  </div>
                  <textarea value={customMessage} onChange={e=>setCustomMessage(e.target.value)} rows={3} className="w-full border p-2 rounded-lg bg-slate-50 focus:bg-white resize-none" />
                </div>
              </div>

              {/* BÖLÜM 2: TEMA SEÇİMİ */}
              <h3 className="font-bold text-lg mb-4 text-slate-800 border-b pb-2">2. Tema ve Renkler (1000+ Seçenek)</h3>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Hazır Şablonlardan Seç</label>
                <div className="max-h-60 overflow-y-auto border rounded-xl p-2 bg-slate-50 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {themes.map(theme => (
                    <button 
                      key={theme.id}
                      onClick={() => applyPreset(theme)}
                      className={`flex flex-col items-center p-2 rounded-lg border transition-all hover:bg-white ${templateId === theme.template_id && primaryColor === theme.primary_color ? 'border-blue-500 shadow-md ring-2 ring-blue-100' : 'border-slate-200'}`}
                    >
                      <div className="w-6 h-6 rounded-full mb-1 shadow-inner" style={{ backgroundColor: theme.primary_color }}></div>
                      <span className="text-[10px] font-bold text-slate-700 text-center line-clamp-1">{theme.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Şablon Düzeni</label>
                    <select value={templateId} onChange={e => setTemplateId(e.target.value)} className="w-full border p-2 rounded-lg bg-slate-50">
                      <option value="template1">Şablon 1 (Cam Efekti)</option>
                      <option value="template2">Şablon 2 (Karanlık Neon)</option>
                      <option value="template3">Şablon 3 (Doğal / Kağıt)</option>
                      <option value="template4">Şablon 4 (Lüks Çerçeve)</option>
                      <option value="template5">Şablon 5 (Minimalist)</option>
                      <option value="template6">Şablon 6 (Romantik Çiçekli)</option>
                      <option value="template7">Şablon 7 (Vintage Polaroid)</option>
                      <option value="template8">Şablon 8 (Altın Varaklı Lüks)</option>
                      <option value="template9">Şablon 9 (Modern Geometrik)</option>
                      <option value="template10">Şablon 10 (Klasik Mektup)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Yazı Tipi (Font)</label>
                    <select value={fontFamily} onChange={e => setFontFamily(e.target.value)} className="w-full border p-2 rounded-lg bg-slate-50">
                      <option value="sans">Modern (Sans-serif)</option>
                      <option value="serif">Zarif (Serif - Tırnaklı)</option>
                      <option value="mono">Farklı (Monospace)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Ana Renk (Tasarım)</label>
                    <div className="flex items-center gap-4">
                      <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="w-12 h-12 rounded cursor-pointer" />
                      <span className="text-slate-500 font-mono text-sm">{primaryColor}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Metin Rengi</label>
                    <div className="flex items-center gap-4">
                      <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="w-12 h-12 rounded cursor-pointer" />
                      <span className="text-slate-500 font-mono text-sm">{textColor}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Arkaplan Görseli</label>
                  <div className="flex flex-col gap-3">
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors">
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" id="file-upload" disabled={isUploading} />
                      <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center gap-1">
                        <span className="font-bold text-slate-700 text-sm">
                          {isUploading ? "Yükleniyor..." : "Bilgisayardan Fotoğraf Yükle"}
                        </span>
                        <span className="text-[10px] text-slate-400">Telegram Bot ile sınırsız depolama</span>
                      </label>
                    </div>
                    <input type="text" value={bgImageUrl} onChange={e => setBgImageUrl(e.target.value)} placeholder="veya manuel URL gir: https://..." className="w-full border p-2 rounded-lg bg-slate-50 text-xs font-mono" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Arkaplan Animasyonu</label>
                  <select value={effectType} onChange={e => setEffectType(e.target.value)} className="w-full border p-2 rounded-lg bg-slate-50">
                    <option value="">Yok (Sade)</option>
                    <option value="bubbles">Uçan Baloncuklar</option>
                    <option value="sparkles">Altın/Gümüş Işıltılar</option>
                    <option value="hearts">Uçan Kalpler</option>
                    <option value="snow">Kar Taneleri</option>
                  </select>
                  <p className="text-xs text-slate-400 mt-1">Sitenin en arkasında sürekli hareket eden zarif animasyonlar.</p>
                </div>
              </div>

              {/* BÖLÜM 3: EKSTRA AYARLAR */}
              <div className="mt-8 pt-6 border-t border-slate-200 space-y-6">
                
                <div>
                  <h3 className="font-bold text-lg mb-4 text-slate-800">Site Giriş Animasyonu</h3>
                  <label className="flex items-center justify-between p-4 bg-slate-50 border rounded-xl cursor-pointer hover:bg-slate-100">
                    <div>
                      <div className="font-bold text-slate-800 text-sm">Zarf Açılış Animasyonu</div>
                      <div className="text-xs text-slate-500 mt-1">Siteye girildiğinde mühürlü bir zarf animasyonu gösterilsin.</div>
                    </div>
                    <div className="relative">
                      <input type="checkbox" className="sr-only" checked={useEnvelope} onChange={e => setUseEnvelope(e.target.checked)} />
                      <div className={`block w-12 h-6 rounded-full transition-colors ${useEnvelope ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${useEnvelope ? 'transform translate-x-6' : ''}`}></div>
                    </div>
                  </label>
                  
                  {useEnvelope && (
                    <div className="mt-4 p-4 bg-slate-50 border rounded-xl">
                      <label className="block text-sm font-medium mb-2">Zarf Gövde Rengi</label>
                      <div className="flex items-center gap-4">
                        <input type="color" value={envelopeColor} onChange={e => setEnvelopeColor(e.target.value)} className="w-12 h-12 rounded cursor-pointer" />
                        <span className="text-slate-500 font-mono text-sm">{envelopeColor}</span>
                        <span className="text-xs text-slate-400 ml-2">(Mühür rengi "Ana Renk" olarak ayarlanmıştır)</span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-4 text-slate-800">Telegram Bildirimleri</h3>
                  <div className="space-y-3">
                    <input type="text" value={telegramBotToken} onChange={e => setTelegramBotToken(e.target.value)} placeholder="Bot Token (Örn: 12345:ABC...)" className="w-full border p-2 rounded-lg bg-slate-50 text-sm" />
                    <input type="text" value={telegramChatId} onChange={e => setTelegramChatId(e.target.value)} placeholder="Chat ID (Örn: -100123...)" className="w-full border p-2 rounded-lg bg-slate-50 text-sm" />
                    <p className="text-[10px] text-slate-400">Grup veya bireysel Telegram sohbetinize LCV kayıtları düşer.</p>
                  </div>
                </div>
              </div>

              <button onClick={handleSaveDesign} className="mt-8 flex items-center justify-center gap-2 w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors shadow-lg">
                <Save className="w-5 h-5" /> Değişiklikleri Kaydet & Önizlemeyi Yenile
              </button>
            </div>

            {/* SAĞ KOLON: Canlı Önizleme */}
            <div className="relative h-[800px] lg:sticky lg:top-8 bg-slate-800 rounded-[3rem] p-4 shadow-2xl hidden lg:block border-4 border-slate-700">
              {/* Telefon Çentiği */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-3xl z-20"></div>
              <div className="w-full h-full bg-slate-50 rounded-[2.2rem] overflow-hidden relative">
                <iframe 
                  key={previewKey} 
                  src={`/${wedding.slug}?t=${previewKey}`} 
                  className="w-full h-full border-0"
                  title="Live Preview"
                />
              </div>
            </div>
            {/* Mobil için önizleme uyarısı */}
            <div className="lg:hidden bg-blue-50 text-blue-600 p-4 rounded-xl text-sm font-medium">
              📱 Canlı önizleme ekranı telefonlarda performans sebebiyle gizlenmiştir. Değişikliklerinizi kaydettikten sonra <a href={`/${wedding.slug}`} target="_blank" className="underline font-bold">buraya tıklayarak</a> sitenize bakabilirsiniz.
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
