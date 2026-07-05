'use client';
import { useState, useEffect, use } from 'react';
import { supabase } from '@/lib/supabase';
import { Lock, Users, MessageSquare, Paintbrush, CreditCard, Save, Wand2, Music, Copy, ExternalLink, Share2 } from 'lucide-react';
import { getRandomQuote } from '@/lib/aiQuotes';

function getTemplatePreset(id: string) {
  const num = parseInt(id.replace('template', '')) || 1;
  const base = {
    template_id: id,
    background_image_url: null,
  };
  
  if (num <= 8) {
    // Royal Gold
    return {
      ...base,
      primary_color: '#dfc384',
      text_color: '#064e3b',
      font_family: 'Cormorant Garamond',
      envelope_bg_color: 'marble-white',
      use_envelope: true,
      envelope_color: '#064e3b',
      envelope_flap_type: 'rounded',
      seal_type: 'crown',
      seal_color: '#dfc384',
      entrance_type: 'gate',
      effect_type: 'sparkles'
    };
  } else if (num <= 16) {
    // Watercolor Floral
    return {
      ...base,
      primary_color: '#be123c',
      text_color: '#334155',
      font_family: 'Great Vibes',
      envelope_bg_color: 'solid-blush',
      use_envelope: true,
      envelope_color: '#ffe4e6',
      envelope_flap_type: 'rounded',
      seal_type: 'rose',
      seal_color: '#be123c',
      entrance_type: 'envelope',
      effect_type: 'hearts'
    };
  } else if (num <= 24) {
    // Minimalist Modern
    return {
      ...base,
      primary_color: '#0f172a',
      text_color: '#1e293b',
      font_family: 'Outfit',
      envelope_bg_color: 'solid-ivory',
      use_envelope: true,
      envelope_color: '#ffffff',
      envelope_flap_type: 'square',
      seal_type: 'monogram',
      seal_color: '#0f172a',
      entrance_type: 'card',
      effect_type: ''
    };
  } else if (num <= 32) {
    // Galactic Neon
    return {
      ...base,
      primary_color: '#a855f7',
      text_color: '#f8fafc',
      font_family: 'Montserrat',
      envelope_bg_color: 'solid-midnight',
      use_envelope: true,
      envelope_color: '#0f172a',
      envelope_flap_type: 'triangle',
      seal_type: 'sparkles',
      seal_color: '#a855f7',
      entrance_type: 'heart-fade',
      effect_type: 'sparkles'
    };
  } else if (num <= 40) {
    // Vintage Retro
    return {
      ...base,
      primary_color: '#b45309',
      text_color: '#451a03',
      font_family: 'Playfair Display',
      envelope_bg_color: 'paper-kraft',
      use_envelope: true,
      envelope_color: '#fef3c7',
      envelope_flap_type: 'triangle',
      seal_type: 'leaf',
      seal_color: '#b45309',
      entrance_type: 'ribbon',
      effect_type: 'bubbles'
    };
  } else {
    // Art Deco / Royal
    return {
      ...base,
      primary_color: '#dfc384',
      text_color: '#1e3a8a',
      font_family: 'Cinzel',
      envelope_bg_color: 'marble-black',
      use_envelope: true,
      envelope_color: '#1e3a8a',
      envelope_flap_type: 'square',
      seal_type: 'crown',
      seal_color: '#dfc384',
      entrance_type: 'box',
      effect_type: 'sparkles'
    };
  }
}

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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'attending' | 'not-attending'>('all');
  const [previewKey, setPreviewKey] = useState(Date.now()); // iframe yenilemek için
  
  // Tasarım Stüdyosu State
  const [templateId, setTemplateId] = useState('template1');
  const [primaryColor, setPrimaryColor] = useState('#f43f5e');
  const [textColor, setTextColor] = useState('#1e293b'); // Yeni eklenen metin rengi
  const [envelopeColor, setEnvelopeColor] = useState('#e6d5c3');
  const [envelopeBgColor, setEnvelopeBgColor] = useState('slate');
  const [envelopeFlapType, setEnvelopeFlapType] = useState('triangle');
  const [sealType, setSealType] = useState('sparkles');
  const [sealColor, setSealColor] = useState('#9f1239');
  const [entranceType, setEntranceType] = useState('envelope');
  const [effectType, setEffectType] = useState('');
  const [fontFamily, setFontFamily] = useState('sans');
  const [namesFontFamily, setNamesFontFamily] = useState('');
  const [bgImageUrl, setBgImageUrl] = useState('');
  const [telegramBotToken, setTelegramBotToken] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');
  const [useEnvelope, setUseEnvelope] = useState(true);
  const [musicUrl, setMusicUrl] = useState('');
  const [musicAutoplay, setMusicAutoplay] = useState(true);
  
  // Genel Bilgiler State
  const [eventType, setEventType] = useState('Düğün');
  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [brideParents, setBrideParents] = useState('');
  const [groomParents, setGroomParents] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [venueName, setVenueName] = useState('');
  const [venueAddress, setVenueAddress] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [quoteFontFamily, setQuoteFontFamily] = useState('');
  const [quoteFontSize, setQuoteFontSize] = useState('text-sm');
  const [isCopied, setIsCopied] = useState(false);
  

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
      if (weddingData.envelope_bg_color) setEnvelopeBgColor(weddingData.envelope_bg_color);
      if (weddingData.envelope_flap_type) setEnvelopeFlapType(weddingData.envelope_flap_type);
      if (weddingData.seal_type) setSealType(weddingData.seal_type);
      if (weddingData.seal_color) setSealColor(weddingData.seal_color);
      else if (weddingData.primary_color) setSealColor(weddingData.primary_color);
      if (weddingData.entrance_type) setEntranceType(weddingData.entrance_type);
      if (weddingData.effect_type) setEffectType(weddingData.effect_type);
      if (weddingData.font_family) setFontFamily(weddingData.font_family);
      if (weddingData.names_font_family) setNamesFontFamily(weddingData.names_font_family);
      if (weddingData.background_image_url) setBgImageUrl(weddingData.background_image_url);
      if (weddingData.telegram_bot_token) setTelegramBotToken(weddingData.telegram_bot_token);
      if (weddingData.telegram_chat_id) setTelegramChatId(weddingData.telegram_chat_id);
      if (weddingData.use_envelope !== undefined && weddingData.use_envelope !== null) setUseEnvelope(weddingData.use_envelope);
      if (weddingData.music_url) setMusicUrl(weddingData.music_url);
      if (weddingData.music_autoplay !== undefined && weddingData.music_autoplay !== null) setMusicAutoplay(weddingData.music_autoplay);
      
      // Genel Bilgileri Doldur
      if (weddingData.event_type) setEventType(weddingData.event_type);
      if (weddingData.bride_name) setBrideName(weddingData.bride_name);
      if (weddingData.groom_name) setGroomName(weddingData.groom_name);
      if (weddingData.bride_parents) setBrideParents(weddingData.bride_parents);
      if (weddingData.groom_parents) setGroomParents(weddingData.groom_parents);
      if (weddingData.wedding_date) setWeddingDate(weddingData.wedding_date);
      if (weddingData.venue_name) setVenueName(weddingData.venue_name);
      if (weddingData.venue_address) setVenueAddress(weddingData.venue_address);
      if (weddingData.google_maps_url) setGoogleMapsUrl(weddingData.google_maps_url);
      if (weddingData.custom_message) setCustomMessage(weddingData.custom_message);
      if (weddingData.quote_font_family) setQuoteFontFamily(weddingData.quote_font_family);
      if (weddingData.quote_font_size) setQuoteFontSize(weddingData.quote_font_size);
      
      setLoading(false);
    }
    loadData();
  }, [wedding_id]);

  // Gerçek Zamanlı Auto-Save Motoru (Debounce)
  useEffect(() => {
    if (loading || !wedding?.id) return;

    const timer = setTimeout(async () => {
      await supabase
        .from('weddings')
        .update({
          template_id: templateId,
          primary_color: primaryColor,
          text_color: textColor,
          envelope_color: envelopeColor,
          envelope_bg_color: envelopeBgColor,
          envelope_flap_type: envelopeFlapType,
          seal_type: sealType,
          seal_color: sealColor,
          entrance_type: entranceType,
          effect_type: effectType,
          font_family: fontFamily,
          names_font_family: namesFontFamily,
          quote_font_family: quoteFontFamily,
          quote_font_size: quoteFontSize,
          use_envelope: useEnvelope
        })
        .eq('id', wedding.id);

      setPreviewKey(Date.now()); // Canlı Önizleme İframe'ini Tazele
    }, 800);

    return () => clearTimeout(timer);
  }, [
    templateId, primaryColor, textColor, envelopeColor, 
    envelopeBgColor, envelopeFlapType, sealType, sealColor, 
    entranceType, effectType, fontFamily, namesFontFamily, useEnvelope,
    quoteFontFamily, quoteFontSize
  ]);

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
        envelope_bg_color: envelopeBgColor,
        envelope_flap_type: envelopeFlapType,
        seal_type: sealType,
        seal_color: sealColor,
        entrance_type: entranceType,
        effect_type: effectType,
        font_family: fontFamily,
        names_font_family: namesFontFamily,
        background_image_url: bgImageUrl,
        telegram_bot_token: telegramBotToken,
        telegram_chat_id: telegramChatId,
        use_envelope: useEnvelope,
        event_type: eventType,
        bride_name: brideName,
        groom_name: groomName,
        bride_parents: brideParents,
        groom_parents: groomParents,
        wedding_date: weddingDate,
        venue_name: venueName,
        venue_address: venueAddress,
        google_maps_url: googleMapsUrl,
        custom_message: customMessage,
        quote_font_family: quoteFontFamily,
        quote_font_size: quoteFontSize,
        music_url: musicUrl,
        music_autoplay: musicAutoplay
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
    if (theme.text_color) setTextColor(theme.text_color);
    setFontFamily(theme.font_family);
    setBgImageUrl(theme.background_image_url || '');
    if (theme.use_envelope !== undefined) setUseEnvelope(theme.use_envelope);
    if (theme.envelope_color) setEnvelopeColor(theme.envelope_color);
    if (theme.envelope_bg_color) setEnvelopeBgColor(theme.envelope_bg_color);
    if (theme.envelope_flap_type) setEnvelopeFlapType(theme.envelope_flap_type);
    if (theme.seal_type) setSealType(theme.seal_type);
    if (theme.seal_color) setSealColor(theme.seal_color);
    if (theme.entrance_type) setEntranceType(theme.entrance_type);
    if (theme.effect_type !== undefined) setEffectType(theme.effect_type || '');
  }

  function handleReplayAnimation() {
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem('preview_envelope_opened');
    }
    setPreviewKey(Date.now());
  }

  const handleExportCSV = () => {
    if (rsvps.length === 0) return;
    const BOM = '\uFEFF';
    const headers = 'Davetli Adı,Durum,Kişi Sayısı,Özel Mesaj\n';
    const csvContent = rsvps.map(r => 
      `"${(r.guest_name || '').replace(/"/g, '""')}","${r.is_attending ? 'Katılıyor' : 'Katılamıyor'}",${r.is_attending ? r.guest_count : 0},"${(r.message || '').replace(/"/g, '""')}"`
    ).join('\n');
    
    const blob = new Blob([BOM + headers + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${wedding?.slug || 'davetli'}-lcv-listesi.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRsvps = rsvps.filter(rsvp => {
    const name = rsvp.guest_name || '';
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' 
      ? true 
      : filterStatus === 'attending' 
        ? rsvp.is_attending 
        : !rsvp.is_attending;
    return matchesSearch && matchesStatus;
  });

  function handleAIGenerate() {
    let newQuote = getRandomQuote();
    // Aynı söz gelmesin diye basit bir kontrol
    while (newQuote === customMessage && customMessage.length > 0) {
      newQuote = getRandomQuote();
    }
    setCustomMessage(newQuote);
  }

  const [isConnectingTelegram, setIsConnectingTelegram] = useState(false);
  const [telegramStatusMsg, setTelegramStatusMsg] = useState('');
  const [isSendingTest, setIsSendingTest] = useState(false);

  const handleConnectTelegram = async () => {
    try {
      setTelegramStatusMsg('Bağlantı linki oluşturuluyor...');
      const newInviteToken = crypto.randomUUID();
      
      const { error: updateError } = await supabase
        .from('weddings')
        .update({ telegram_bot_token: newInviteToken })
        .eq('id', wedding.id);

      if (updateError) {
        setTelegramStatusMsg('Bağlantı token\'ı oluşturulurken hata oluştu.');
        return;
      }

      setTelegramBotToken(newInviteToken);

      // Open Telegram link in a new tab
      const telegramLink = `https://t.me/DijitalDavetiyecinizBot?start=${newInviteToken}`;
      window.open(telegramLink, '_blank');

      setIsConnectingTelegram(true);
      setTelegramStatusMsg('Lütfen Telegram botunu açıp "Başlat" butonuna tıklayın. Bekleniyor...');

      // Start polling for chat_id
      const interval = setInterval(async () => {
        const { data: updatedWedding } = await supabase
          .from('weddings')
          .select('telegram_chat_id')
          .eq('id', wedding.id)
          .single();

        if (updatedWedding && updatedWedding.telegram_chat_id) {
          setTelegramChatId(updatedWedding.telegram_chat_id);
          setIsConnectingTelegram(false);
          setTelegramStatusMsg('Telegram başarıyla bağlandı. LCV bildirimleri bu hesaba gönderilecek.');
          clearInterval(interval);
        }
      }, 3000);

      // Auto-clear interval after 5 minutes to avoid infinite loop
      setTimeout(() => {
        clearInterval(interval);
        setIsConnectingTelegram(current => {
          if (current) {
            setTelegramStatusMsg('Bağlantı zaman aşımına uğradı. Lütfen tekrar deneyin.');
          }
          return false;
        });
      }, 300000);

    } catch (err) {
      console.error(err);
      setTelegramStatusMsg('Bağlantı başlatılamadı.');
    }
  };

  const handleDisconnectTelegram = async () => {
    if (!confirm('Telegram bağlantısını kesmek istediğinize emin misiniz?')) return;
    try {
      const { error } = await supabase
        .from('weddings')
        .update({ telegram_bot_token: null, telegram_chat_id: null })
        .eq('id', wedding.id);

      if (!error) {
        setTelegramBotToken('');
        setTelegramChatId('');
        setTelegramStatusMsg('Telegram bağlantısı kesildi.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendTestNotification = async () => {
    setIsSendingTest(true);
    try {
      const res = await fetch('/api/telegram/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wedding_id: wedding.id,
          guest_name: 'Test Davetlisi',
          is_attending: true,
          guest_count: 1,
          message: 'Bu bir test bildirimidir. Telegram bağlantınız başarıyla çalışıyor! 🎉'
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('Test bildirimi gönderildi.');
      } else {
        alert('Test bildirimi gönderilemedi: ' + (data.error || 'Bilinmeyen hata'));
      }
    } catch (err) {
      console.error(err);
      alert('Test bildirimi gönderilirken bir hata oluştu.');
    }
    setIsSendingTest(false);
  };

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    
    if (!telegramChatId) {
      alert("Lütfen önce Telegram bağlantısını kurun.");
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
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 text-slate-800">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8">
        
        {/* SOL KOLON: İçerik, Sekmeler ve Ayarlar */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <span>🎉</span> {wedding.bride_name} & {wedding.groom_name}
              </h1>
              <p className="text-slate-500 text-xs mt-1">Davetiye Yönetim ve Tasarım Paneli</p>
            </div>
            <button onClick={() => setIsAuthenticated(false)} className="text-xs font-semibold px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all">
              Çıkış Yap
            </button>
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

            {/* LCV guest list search & filters */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
              <div className="flex gap-2 w-full sm:w-auto">
                <input 
                  type="text" 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)} 
                  placeholder="Davetli ara..." 
                  className="border px-4 py-2 rounded-xl text-sm w-full sm:w-64 bg-white"
                />
                <select 
                  value={filterStatus} 
                  onChange={e => setFilterStatus(e.target.value as any)} 
                  className="border px-4 py-2 rounded-xl text-sm bg-white"
                >
                  <option value="all">Tüm Liste</option>
                  <option value="attending">Katılanlar</option>
                  <option value="not-attending">Katılamayanlar</option>
                </select>
              </div>
              <button 
                onClick={handleExportCSV} 
                className="w-full sm:w-auto px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Save className="w-4 h-4" /> Excel / CSV İndir
              </button>
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
                  {filteredRsvps.length === 0 && (
                    <tr><td colSpan={4} className="p-8 text-center text-slate-500">Eşleşen LCV yanıtı bulunamadı.</td></tr>
                  )}
                  {filteredRsvps.map(rsvp => (
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
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Paintbrush className="w-6 h-6 text-rose-500" /> Tasarım Stüdyosu
              </h2>
              <p className="text-slate-500 mb-8">Bilgilerinizi ve temanızı güncelledikten sonra "Kaydet" butonuna basarak sağdaki önizlemede sonuçları görebilirsiniz.</p>
              
              {/* BÖLÜM 1: GENEL BİLGİLER */}
              <h3 className="font-bold text-lg mb-4 text-slate-800 border-b pb-2">1. Genel Bilgiler</h3>
              <div className="space-y-4 mb-10">
                <div>
                  <label className="block text-sm font-medium mb-1">Davet / Etkinlik Türü</label>
                  <select 
                    value={eventType} 
                    onChange={e => setEventType(e.target.value)}
                    className="w-full border p-2 rounded-lg bg-slate-50 focus:bg-white text-sm"
                  >
                    <option value="Düğün">Düğün Daveti</option>
                    <option value="Kına">Kına Daveti</option>
                    <option value="Nişan">Nişan Daveti</option>
                    <option value="Nikah">Nikah Daveti</option>
                    <option value="Sünnet">Sünnet Daveti</option>
                    <option value="Baby Shower">Baby Shower Daveti</option>
                    <option value="Bekarlığa Veda">Bekarlığa Veda Daveti</option>
                    <option value="Doğum Günü">Doğum Günü Daveti</option>
                    <option value="Özel Davet">Özel Davet</option>
                  </select>
                </div>

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
                    <input value={brideParents} onChange={e=>setBrideParents(e.target.value)} type="text" className="w-full border p-2 rounded-lg bg-slate-50 focus:bg-white" autoCapitalize="none" autoCorrect="off" style={{ textTransform: 'none' }} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Damat Anne & Baba</label>
                    <input value={groomParents} onChange={e=>setGroomParents(e.target.value)} type="text" className="w-full border p-2 rounded-lg bg-slate-50 focus:bg-white" autoCapitalize="none" autoCorrect="off" style={{ textTransform: 'none' }} />
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

                {/* Davet Metni Font Ayrıntıları */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">Davet Metni Yazı Tipi (Font)</label>
                    <select 
                      value={quoteFontFamily} 
                      onChange={e => setQuoteFontFamily(e.target.value)} 
                      className="w-full border p-2 rounded-lg bg-slate-50 text-xs focus:bg-white"
                    >
                      <option value="">Şablon Yazı Tipi (Varsayılan)</option>
                      <optgroup label="Romantik El Yazısı (Kaligrafi)">
                        <option value="Great Vibes">Great Vibes</option>
                        <option value="Parisienne">Parisienne</option>
                        <option value="Alex Brush">Alex Brush</option>
                        <option value="Dancing Script">Dancing Script</option>
                        <option value="Arizonia">Arizonia</option>
                        <option value="Pinyon Script">Pinyon Script</option>
                      </optgroup>
                      <optgroup label="Zarif & Şık (Serif)">
                        <option value="Cormorant Garamond">Cormorant Garamond</option>
                        <option value="Playfair Display">Playfair Display</option>
                        <option value="Cinzel">Cinzel</option>
                        <option value="Italiana">Italiana</option>
                      </optgroup>
                      <optgroup label="Modern & Sade (Sans-serif)">
                        <option value="Montserrat">Montserrat</option>
                        <option value="Outfit">Outfit</option>
                        <option value="Inter">Inter</option>
                      </optgroup>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">Davet Metni Büyüklüğü (Boyut)</label>
                    <select 
                      value={quoteFontSize} 
                      onChange={e => setQuoteFontSize(e.target.value)} 
                      className="w-full border p-2 rounded-lg bg-slate-50 text-xs focus:bg-white"
                    >
                      <option value="text-xs">Küçük (12px)</option>
                      <option value="text-sm">Orta (14px - Varsayılan)</option>
                      <option value="text-base">Standart (16px)</option>
                      <option value="text-lg">Büyük (18px)</option>
                      <option value="text-xl">Çok Büyük (20px)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* BÖLÜM 2: TEMA SEÇİMİ */}
              <h3 className="font-bold text-lg mb-4 text-slate-800 border-b pb-2">2. Şablon & Tema Seçimi</h3>

              {/* UNIFIED TEMPLATE GRID — 50 templates + DB custom themes */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Şablon Seç <span className="text-slate-400 font-normal text-xs">(Renk, yazı tipi ve tasarım otomatik uygulanır — istersen sonradan değiştirebilirsin)</span>
                </label>

                {/* DB Custom Themes row (if any) */}
                {themes.length > 0 && (
                  <div className="mb-3">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">⭐ Özel Hazır Şablonlar</p>
                    <div className="max-h-40 overflow-y-auto border rounded-xl p-2 bg-slate-50 grid grid-cols-2 sm:grid-cols-3 gap-2">
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
                )}

                {/* All 50 premium templates as clickable cards */}
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">🎨 50 Premium Şablon</p>
                <div className="max-h-72 overflow-y-auto border rounded-xl p-2 bg-slate-50 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(() => {
                    const templateNames = [
                      "Altın Saray", "Neon Gece", "Organik Keten", "Kraliyet Aynası",
                      "Sessiz Şıklık", "Suluboya Bahçe", "Retro Polaroid", "Gatsby Işıltısı",
                      "Geometrik Aşk", "Mühürlü Mektup", "Zümrüt Şiiri", "Gül Yaprağı",
                      "Toskana Esintisi", "Deniz Masalı", "Safir Büyüsü", "Lavanta Bahçesi",
                      "Fildişi Zarafet", "Kraft Defter", "Kuzey Işıkları", "Çöl Sıcağı",
                      "Kardelen Beyazı", "Dantel Düşü", "Modern Kübist", "Ege Rüzgarı",
                      "Işıltılı Gece", "Eskimiş Parşömen", "Asil Kadife", "Temiz Levha",
                      "Bahçe Kemeri", "Platin Lüks", "İnci Tanesi", "Sonsuz Aşk",
                      "Zeytin Dalı", "Güz Yaprakları", "Gizemli Orman", "Yakamoz Işıltısı",
                      "Monogram Şıklık", "Daktilo Şiiri", "Cam Fanus", "Altın Çerçeve",
                      "Rustik Kütük", "Gül Suyu", "Retro Disk", "Yıldız Tozu",
                      "Monokrom Çizgi", "Eski Mektup", "Lüks Mermer", "Kır Düğünü",
                      "Minimal Çizgi", "Asil Bordo"
                    ];
                    return Array.from({ length: 50 }, (_, i) => {
                      const num = i + 1;
                      const tId = `template${num}`;
                      const preset = getTemplatePreset(tId);
                      const isActive = templateId === tId;
                      return (
                        <button
                          key={tId}
                          onClick={() => {
                            setTemplateId(tId);
                            applyPreset(preset);
                          }}
                          className={`flex flex-col items-center p-2 rounded-lg border transition-all hover:bg-white hover:shadow-md active:scale-95 ${isActive ? 'border-blue-500 shadow-md ring-2 ring-blue-100 bg-white' : 'border-slate-200'}`}
                        >
                          <div className="w-full h-5 rounded-md mb-1 shadow-inner flex items-center justify-center gap-1 overflow-hidden">
                            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: preset.primary_color || '#f43f5e' }}></div>
                            <div className="flex-1 h-1.5 rounded-full opacity-30" style={{ backgroundColor: preset.primary_color || '#f43f5e' }}></div>
                          </div>
                          <span className="text-[9px] font-bold text-slate-700 text-center leading-tight">{templateNames[i]}</span>
                          <span className="text-[8px] text-slate-400">#{num}</span>
                          {isActive && <span className="text-[8px] text-blue-600 font-bold mt-0.5">✓ Seçili</span>}
                        </button>
                      );
                    });
                  })()}
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <label className="block text-sm font-medium mb-2">
                      ✍️ İsimler Yazı Tipi 
                      <span className="text-slate-400 font-normal ml-1 text-xs">(Gelin & Damat)</span>
                    </label>
                    <select value={namesFontFamily || fontFamily} onChange={e => setNamesFontFamily(e.target.value)} className="w-full border p-2 rounded-lg bg-slate-50 text-sm">
                      <optgroup label="Romantik El Yazısı (Kaligrafi)">
                        <option value="Great Vibes">Great Vibes</option>
                        <option value="Parisienne">Parisienne</option>
                        <option value="Alex Brush">Alex Brush</option>
                        <option value="Dancing Script">Dancing Script</option>
                        <option value="Allura">Allura</option>
                        <option value="Arizonia">Arizonia</option>
                        <option value="Pinyon Script">Pinyon Script</option>
                        <option value="Sacramento">Sacramento</option>
                        <option value="Tangerine">Tangerine</option>
                        <option value="Yellowtail">Yellowtail</option>
                        <option value="Italianno">Italianno</option>
                        <option value="Monsieur La Doulaise">Monsieur La Doulaise</option>
                      </optgroup>
                      <optgroup label="Zarif & Şık (Serif)">
                        <option value="Cormorant Garamond">Cormorant Garamond</option>
                        <option value="Playfair Display">Playfair Display</option>
                        <option value="Cinzel">Cinzel</option>
                        <option value="Italiana">Italiana</option>
                        <option value="Bodoni Moda">Bodoni Moda</option>
                        <option value="Cinzel Decorative">Cinzel Decorative</option>
                      </optgroup>
                      <optgroup label="Modern & Sade (Sans-serif)">
                        <option value="Montserrat">Montserrat</option>
                        <option value="Inter">Inter</option>
                        <option value="Outfit">Outfit</option>
                        <option value="Raleway">Raleway</option>
                        <option value="Poppins">Poppins</option>
                      </optgroup>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      📝 Genel Yazı Tipi
                      <span className="text-slate-400 font-normal ml-1 text-xs">(Tarih, Mekan, Detaylar)</span>
                    </label>
                    <select value={fontFamily} onChange={e => setFontFamily(e.target.value)} className="w-full border p-2 rounded-lg bg-slate-50 text-sm">
                      <optgroup label="Romantik El Yazısı (Kaligrafi)">
                        <option value="Great Vibes">Great Vibes</option>
                        <option value="Parisienne">Parisienne</option>
                        <option value="Alex Brush">Alex Brush</option>
                        <option value="Dancing Script">Dancing Script</option>
                        <option value="Allura">Allura</option>
                        <option value="Arizonia">Arizonia</option>
                        <option value="Pinyon Script">Pinyon Script</option>
                        <option value="Sacramento">Sacramento</option>
                        <option value="Tangerine">Tangerine</option>
                        <option value="Yellowtail">Yellowtail</option>
                        <option value="Yesteryear">Yesteryear</option>
                        <option value="Playball">Playball</option>
                        <option value="Clicker Script">Clicker Script</option>
                        <option value="Italianno">Italianno</option>
                        <option value="Herr Von Muellerhoff">Herr Von Muellerhoff</option>
                        <option value="Monsieur La Doulaise">Monsieur La Doulaise</option>
                        <option value="Niconne">Niconne</option>
                        <option value="Marck Script">Marck Script</option>
                      </optgroup>
                      <optgroup label="Zarif & Şık (Serif)">
                        <option value="Cormorant Garamond">Cormorant Garamond</option>
                        <option value="Playfair Display">Playfair Display</option>
                        <option value="Cinzel">Cinzel</option>
                        <option value="Italiana">Italiana</option>
                        <option value="Bodoni Moda">Bodoni Moda</option>
                        <option value="Prata">Prata</option>
                        <option value="Cardo">Cardo</option>
                        <option value="Oranienbaum">Oranienbaum</option>
                        <option value="Cinzel Decorative">Cinzel Decorative</option>
                      </optgroup>
                      <optgroup label="Modern & Sade (Sans-serif)">
                        <option value="Montserrat">Montserrat</option>
                        <option value="Inter">Inter</option>
                        <option value="Outfit">Outfit</option>
                        <option value="League Spartan">League Spartan</option>
                        <option value="Lato">Lato</option>
                        <option value="Raleway">Raleway</option>
                        <option value="Quicksand">Quicksand</option>
                        <option value="Josefin Sans">Josefin Sans</option>
                        <option value="Poppins">Poppins</option>
                      </optgroup>
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
                    <input type="text" value={bgImageUrl} onChange={e => setBgImageUrl(e.target.value)} placeholder="veya manuel URL gir: https://..." className="w-full border p-2 rounded-lg bg-white text-slate-700 text-xs font-mono placeholder:text-slate-400" />
                  </div>
                </div>

                {/* Birleşik Arka Plan (Zemin Tasarımı) */}
                <div>
                  <label className="block text-sm font-medium mb-2">Arka Plan (Zemin Tasarımı)</label>
                  <select value={envelopeBgColor} onChange={e => setEnvelopeBgColor(e.target.value)} className="w-full border p-2 rounded-lg bg-slate-50 text-sm">
                    <optgroup label="Mermer Desenler">
                      <option value="marble-white">Beyaz Altın Damarlı Mermer</option>
                      <option value="marble-black">Siyah Nero Marquina Mermer</option>
                      <option value="marble-green">Zümrüt Yeşil Orman Mermer</option>
                      <option value="marble-rose">Pembe Oniks Saray Mermeri</option>
                    </optgroup>
                    <optgroup label="Kumaş & Dokular">
                      <option value="linen-cream">Krem Rengi Doğal Keten</option>
                      <option value="linen-sage">Adaçayı Yeşili Premium Keten</option>
                      <option value="linen-rose">Gül Kurusu Dokulu Keten</option>
                      <option value="velvet-navy">Gece Mavisi Lüks Kadife</option>
                      <option value="velvet-burgundy">Bordo Lüks Saray Kadifesi</option>
                      <option value="silk-ivory">Fildişi İpek Parıltısı</option>
                    </optgroup>
                    <optgroup label="Sanatsal Kağıtlar">
                      <option value="paper-kraft">Doğal Kraft Ambalaj Kağıdı</option>
                      <option value="paper-parchment">Eskitilmiş Vintage Parşömen</option>
                      <option value="paper-cotton">El Yapımı Dokulu Pamuk Kağıt</option>
                      <option value="paper-pressed">Yaprak Baskılı Özel Davet Kağıdı</option>
                    </optgroup>
                    <optgroup label="Taş & Ahşap">
                      <option value="terrazzo-beige">İtalyan Mozaik (Terrazzo) Krem</option>
                      <option value="concrete-grey">Endüstriyel Ham Gri Beton</option>
                      <option value="concrete-dark">Antrasit Koyu Beton zemin</option>
                      <option value="wood-rustic">Ahşap Masa (Rustik)</option>
                      <option value="wood-walnut">Ceviz Ağacı Masa (Koyu)</option>
                      <option value="wood-oak">Meşe Masa (Doğal)</option>
                    </optgroup>
                    <optgroup label="Pastel Renkler">
                      <option value="solid-champagne">Şampanya Pastel</option>
                      <option value="solid-sage">Adaçayı Pastel</option>
                      <option value="solid-dustyrose">Gül Kurusu Pastel</option>
                      <option value="solid-terracotta">Kiremit Terracotta Pastel</option>
                      <option value="solid-midnight">Gece Mavisi Pastel</option>
                      <option value="solid-darkslate">Antrasit Koyu</option>
                      <option value="solid-ivory">Fildişi Sade</option>
                      <option value="solid-blush">Narin Pembe Pastel</option>
                      <option value="solid-mint">Nane Yeşili Pastel</option>
                      <option value="solid-lavender">Zarif Lavanta Pastel</option>
                      <option value="solid-gold">Mat Klasik Altın</option>
                      <option value="solid-crimson">Koyu Kan Kırmızı</option>
                      <option value="solid-teal">Derin Okyanus Yeşili</option>
                      <option value="solid-plum">Koyu Mürdüm / Erik</option>
                      <option value="solid-sand">Çöl Kumu Pastel</option>
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Arkaplan Animasyonu</label>
                  <select value={effectType} onChange={e => setEffectType(e.target.value)} className="w-full border p-2 rounded-lg bg-slate-50">
                    <option value="">Yok (Sade)</option>
                    <option value="sakura">🌸 Uçan Kiraz Çiçekleri (Sakura)</option>
                    <option value="leaves">🍁 Dökülen Sonbahar Yaprakları</option>
                    <option value="stars">✨ Parlayan Gece Yıldızları</option>
                    <option value="fireflies">💡 Işıldayan Ateş Böcekleri</option>
                    <option value="rain">🌧️ Romantik Yağmur Damlaları</option>
                    <option value="confetti">🎉 Altın Konfeti Yağmuru</option>
                    <option value="bubbles">🫧 Uçan Baloncuklar</option>
                    <option value="sparkles">✨ Altın/Gümüş Işıltılar</option>
                    <option value="hearts">❤️ Uçan Kalpler</option>
                    <option value="snow">❄️ Kar Taneleri</option>
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
                    <div className="mt-4 p-4 bg-slate-50 border rounded-xl space-y-4 text-left">
                      {/* Giriş Animasyonu Türü */}
                      <div>
                        <label className="block text-sm font-semibold mb-1.5 text-slate-700">Açılış Animasyonu Türü</label>
                        <select value={entranceType} onChange={e => setEntranceType(e.target.value)} className="w-full border p-2 rounded-lg bg-white text-sm">
                          <option value="envelope">✉️ 3D Mühürlü Zarf</option>
                          <option value="ribbon">🎀 Kurdeleli Premium Zarf</option>
                          <option value="box">🎁 Lüks Hediye Kutusu</option>
                          <option value="curtain">🎭 İpek Sahne Perdesi</option>
                          <option value="gate">🏰 Saray / Bahçe Kapısı</option>
                          <option value="card">🎴 Sade Tebrik Kartı (Süzülme)</option>
                          <option value="heart-fade">❤️ Büyük Kalp Patlaması</option>
                          <option value="flower-bloom">🌸 Çiçek Bahçesi (Açılış)</option>
                          <option value="wax-seal-press">🏷️ Kraliyet Mühür Basımı</option>
                          <option value="glass-shatter">💎 Elmas Cam Kırılması</option>
                        </select>
                      </div>

                      {/* Zarf Gövde Rengi */}
                      <div>
                        <label className="block text-sm font-semibold mb-1.5 text-slate-700">Zarf / Kutu Gövde Rengi</label>
                        <div className="flex items-center gap-4">
                          <input type="color" value={envelopeColor} onChange={e => setEnvelopeColor(e.target.value)} className="w-12 h-12 rounded cursor-pointer" />
                          <span className="text-slate-500 font-mono text-sm">{envelopeColor}</span>
                          <span className="text-xs text-slate-400 ml-2">(Zarf veya kutunun dış kapak rengi)</span>
                        </div>
                      </div>

                      {/* Kapak Şekli */}
                      <div>
                        <label className="block text-sm font-semibold mb-1.5 text-slate-700">Zarf Kapak Şekli</label>
                        <select value={envelopeFlapType} onChange={e => setEnvelopeFlapType(e.target.value)} className="w-full border p-2 rounded-lg bg-white text-sm">
                          <option value="triangle">📐 Klasik Üçgen Kapak</option>
                          <option value="rounded">🟢 Modern Yuvarlak (Curved) Kapak</option>
                          <option value="square">➖ Modern Düz Kesim Kapak</option>
                          <option value="trapezoid">⬡ Yamuk Kesim Kapak</option>
                          <option value="wavy">🌊 Dalgalı Dalga Kesim</option>
                          <option value="pointed-oval">🌰 Badem Oval Kapak</option>
                          <option value="asymmetric">📐 Asimetrik Modern Kesim</option>
                          <option value="double-curve">⚜️ Barok Çift Kavis</option>
                          <option value="heart">❤️ Zarif Kalp Kesimi</option>
                        </select>
                      </div>

                      {/* Mühür Damgası */}
                      <div>
                        <label className="block text-sm font-semibold mb-1.5 text-slate-700">Mühür Damgası (Motif)</label>
                        <select value={sealType} onChange={e => setSealType(e.target.value)} className="w-full border p-2 rounded-lg bg-white text-sm">
                          <option value="sparkles">✨ Işıltı Damgası</option>
                          <option value="heart">❤️ Romantik Kalp Damgası</option>
                          <option value="rose">🌹 Gül Damgası</option>
                          <option value="monogram">🔠 Baş Harfler (Monogram - {brideName.charAt(0) || 'G'}&{groomName.charAt(0) || 'D'})</option>
                          <option value="crown">👑 Kraliyet Tacı Damgası</option>
                          <option value="leaf">🌿 Zarif Yaprak Damgası</option>
                        </select>
                      </div>

                      {/* Mühür Rengi */}
                      <div>
                        <label className="block text-sm font-semibold mb-1.5 text-slate-700">Mühür Rengi</label>
                        <div className="flex items-center gap-4">
                          <input type="color" value={sealColor} onChange={e => setSealColor(e.target.value)} className="w-12 h-12 rounded cursor-pointer" />
                          <span className="text-slate-500 font-mono text-sm">{sealColor}</span>
                          <span className="text-xs text-slate-400 ml-2">(Mühürün 3D mum rengi)</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* BÖLÜM 2.5: ARKA PLAN MÜZİK AYARLARI */}
                <div className="pt-6 border-t border-slate-200">
                  <h3 className="font-bold text-lg mb-4 text-slate-800 flex items-center gap-2">
                    <Music className="w-5 h-5 text-rose-500" /> Arka Plan Müzik Ayarları
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1.5 text-slate-700">Müzik Şarkısı / Melodi Seçimi</label>
                      <select 
                        value={musicUrl} 
                        onChange={e => setMusicUrl(e.target.value)} 
                        className="w-full border p-2 rounded-lg bg-white text-sm"
                      >
                        <option value="">Müzik Yok (Sessiz)</option>
                        <option value="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3">🎵 Romantik Melodi 1</option>
                        <option value="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3">🎻 Düğün Valsi</option>
                        <option value="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3">🎸 Yumuşak Akustik</option>
                        <option value="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3">🏛️ Klasik Orkestral</option>
                        <option value="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3">✨ Neşeli Melodi</option>
                        <option value="custom">🔗 Özel MP3 Bağlantısı (URL)...</option>
                      </select>
                      {musicUrl && musicUrl !== '' && musicUrl !== 'custom' && (
                        <div className="mt-2 flex items-center gap-2">
                          <audio controls src={musicUrl} className="w-full h-8 rounded-lg" preload="none" />
                        </div>
                      )}
                    </div>

                    {(musicUrl === 'custom' || (musicUrl !== '' && !musicUrl.includes('soundhelix.com'))) && (
                      <div>
                        <label className="block text-sm font-semibold mb-1 text-slate-700">Özel MP3 Bağlantısı (Direct MP3 URL)</label>
                        <input 
                          type="text" 
                          value={musicUrl === 'custom' ? '' : musicUrl} 
                          onChange={e => setMusicUrl(e.target.value)} 
                          placeholder="https://örnek.com/muzik.mp3" 
                          className="w-full border p-2 rounded-lg bg-slate-50 text-xs font-mono" 
                        />
                        <p className="text-[10px] text-slate-400 mt-1">Gireceğiniz bağlantının doğrudan bir .mp3 dosyasına gitmesi gerekir.</p>
                      </div>
                    )}

                    <label className="flex items-center justify-between p-3 bg-slate-50 border rounded-xl cursor-pointer hover:bg-slate-100 mt-2">
                      <div>
                        <div className="font-bold text-slate-800 text-xs">Müziği Otomatik Başlat</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">Zarf veya kapı açıldığı anda melodi otomatik çalsın.</div>
                      </div>
                      <div className="relative">
                        <input type="checkbox" className="sr-only" checked={musicAutoplay} onChange={e => setMusicAutoplay(e.target.checked)} />
                        <div className={`block w-10 h-5 rounded-full transition-colors ${musicAutoplay ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                        <div className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform ${musicAutoplay ? 'transform translate-x-5' : ''}`}></div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-6 text-slate-700">
                  <h3 className="font-serif font-bold text-lg text-slate-800 mb-1 flex items-center gap-2">
                    <span>📨</span> Telegram Bildirimlerini Bağla
                  </h3>
                  <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                    Misafirleriniz LCV formunu doldurduğunda telefonunuza anlık Telegram bildirimi gelsin.
                  </p>

                  <div className="bg-white border border-slate-100 rounded-xl p-4 mb-5 shadow-sm text-xs">
                    <h4 className="font-bold text-slate-700 mb-3 uppercase tracking-wider text-[10px]">Bağlantı Adımları</h4>
                    <ol className="space-y-2.5 text-slate-600">
                      <li className="flex gap-2">
                        <span className="font-bold text-rose-500 shrink-0">1.</span>
                        <span><strong>Telegram ile Bağlan</strong> butonuna tıklayın.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold text-rose-500 shrink-0">2.</span>
                        <span>Açılan Telegram ekranında <strong>Başlat</strong> butonuna basın.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold text-rose-500 shrink-0">3.</span>
                        <span>Panele dönün ve <strong>Test Bildirimi Gönder</strong> butonuyla bağlantıyı kontrol edin.</span>
                      </li>
                    </ol>
                  </div>

                  <div className="bg-rose-50/70 border border-rose-100 rounded-xl p-3 text-xs text-rose-700 mb-6 flex items-start gap-2">
                    <span className="text-base leading-none">⚠️</span>
                    <div>
                      <strong>Uyarı Notu:</strong> Chat ID bilmenize gerek yok. Sistem bağlantıyı otomatik yapar.
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="space-y-4">
                    {telegramChatId ? (
                      <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-xl text-xs font-semibold flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-500 text-lg">✓</span>
                          <span>Telegram başarıyla bağlandı. LCV bildirimleri bu hesaba gönderilecek.</span>
                        </div>
                        <button 
                          onClick={handleDisconnectTelegram}
                          className="text-[10px] text-rose-600 hover:text-rose-700 font-bold uppercase tracking-wider hover:underline"
                        >
                          Bağlantıyı Kes
                        </button>
                      </div>
                    ) : (
                      <div className="bg-amber-50 border border-amber-100 text-amber-800 p-4 rounded-xl text-xs font-semibold">
                        ⚠️ Henüz Telegram bağlantısı kurulmamış.
                      </div>
                    )}

                    {telegramStatusMsg && (
                      <div className="bg-slate-100 text-slate-700 p-3 rounded-lg text-xs font-mono break-words">
                        {telegramStatusMsg}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3">
                      {!telegramChatId && (
                        <button
                          onClick={handleConnectTelegram}
                          disabled={isConnectingTelegram}
                          className="flex-1 py-3 px-4 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-100"
                        >
                          <span>💬</span> {isConnectingTelegram ? 'Telegram Bekleniyor...' : 'Telegram ile Bağlan'}
                        </button>
                      )}

                      {telegramChatId && (
                        <button
                          onClick={handleSendTestNotification}
                          disabled={isSendingTest}
                          className="flex-1 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-slate-100"
                        >
                          <span>🔔</span> {isSendingTest ? 'Test Bildirimi Gönderiliyor...' : 'Test Bildirimi Gönder'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <button onClick={handleSaveDesign} className="mt-8 flex items-center justify-center gap-2 w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors shadow-lg">
                <Save className="w-5 h-5" /> Değişiklikleri Kaydet & Önizlemeyi Yenile
              </button>
          </div>
        )}

        {activeTab === 'payment' && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center max-w-2xl mx-auto">
            {wedding.is_paid ? (
              <div>
                <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-2xl font-bold mb-2 text-slate-800">Davetiyeniz Yayında! 🎉</h2>
                <p className="text-slate-500 text-sm mb-6">Ödemeniz onaylanmıştır. Paylaşım linkinizi kopyalayarak misafirlerinize gönderebilirsiniz.</p>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left mb-6">
                  <p className="font-bold text-slate-700 text-xs mb-1.5 flex items-center gap-1">
                    <Share2 className="w-4 h-4 text-emerald-600" /> Davetiye Paylaşım Bağlantınız:
                  </p>
                  <div className="flex gap-2">
                    <input 
                      readOnly 
                      type="text" 
                      value={`https://dijital-davetiyeciniz.vercel.app/d/${wedding.slug}`} 
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-700 font-bold" 
                    />
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(`https://dijital-davetiyeciniz.vercel.app/d/${wedding.slug}`);
                        setIsCopied(true);
                        setTimeout(() => setIsCopied(false), 2000);
                      }}
                      className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 rounded-xl transition-all flex items-center gap-1 shrink-0"
                    >
                      {isCopied ? 'Kopyalandı!' : <><Copy className="w-3.5 h-3.5" /> Kopyala</>}
                    </button>
                  </div>
                </div>

                <a 
                  href={`/d/${wedding.slug}`} 
                  target="_blank" 
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-100 text-sm"
                >
                  Davetiyeyi Yeni Sekmede Aç <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ) : (
              <div>
                <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Lock className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold mb-2 text-slate-800">Davetiyenizi Yayına Alın</h2>
                <p className="text-slate-500 text-xs mb-6 max-w-md mx-auto leading-relaxed">
                  Tasarımınızı oluşturup dilediğiniz gibi özelleştirebilirsiniz. Sitenizi misafirlerinize açmak için ödemenizi gerçekleştirip onay almanız gerekmektedir.
                </p>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-left mb-6">
                  <p className="font-bold text-amber-800 text-xs mb-1.5">🔗 Davetiye Linkiniz (Taslak):</p>
                  <div className="flex gap-2">
                    <input 
                      readOnly 
                      type="text" 
                      value={`https://dijital-davetiyeciniz.vercel.app/d/${wedding.slug}`} 
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-500" 
                    />
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(`https://dijital-davetiyeciniz.vercel.app/d/${wedding.slug}`);
                        setIsCopied(true);
                        setTimeout(() => setIsCopied(false), 2000);
                      }}
                      className="bg-slate-850 hover:bg-slate-750 text-white text-xs font-semibold px-4 rounded-xl transition-all flex items-center gap-1 shrink-0"
                    >
                      {isCopied ? 'Kopyalandı!' : <><Copy className="w-3.5 h-3.5" /> Kopyala</>}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                    ⚠️ Bu link şu an ödeme onaylanmadığı için dışarıdan erişime kapalıdır, sadece bu panelde sağdaki Canlı Önizleme ekranında çalışır.
                  </p>
                </div>

                {/* Lock Action Button */}
                <button 
                  disabled 
                  className="w-full py-4 bg-slate-100 border border-slate-200 text-slate-500 font-bold rounded-xl text-xs cursor-not-allowed mb-6 flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" /> Davetiyenizi önizleyebilirsiniz. Yayına almak için ödeme gereklidir.
                </button>
                
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-left mb-6 text-xs">
                  <h3 className="font-bold text-slate-800 mb-3 border-b pb-2">Banka Hesap Bilgileri</h3>
                  <div className="space-y-1.5 text-slate-600">
                    <p><span className="text-slate-400 font-medium">Banka:</span> Enpara / QNB Finansbank</p>
                    <p><span className="text-slate-400 font-medium">Alıcı:</span> Dijital Davetiyeciniz Yazılım Hizmetleri</p>
                    <p><span className="text-slate-400 font-medium">IBAN:</span> <span className="font-mono bg-white px-2 py-0.5 border rounded">TR12 3456 7890 0000 0000 0000 00</span></p>
                    <p><span className="text-slate-400 font-medium">Açıklama:</span> <strong className="text-rose-500">{wedding.slug}</strong> (Lütfen ödeme açıklamasında tam olarak bu kodu belirtin)</p>
                  </div>
                </div>

                <a 
                  href={`https://wa.me/905555555555?text=Merhaba, %20${wedding.slug}%20isimli%20davetiyemin%20ödemesini%20yaptım.%20Dekontu%20iletiyorum.`} 
                  target="_blank" 
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors shadow-lg shadow-green-100 text-sm w-full"
                >
                  Dekont Gönder & Aktivasyon İste
                </a>
              </div>
            )}
          </div>
        )}
      </div> {/* SOL KOLON KAPANIŞ */}

      {/* SAĞ KOLON: Canlı Önizleme (Sürekli Görünür ve Aktif) */}
      <div className="lg:col-span-5 xl:col-span-4 relative">
        <div className="relative h-[850px] lg:sticky lg:top-8 flex flex-col gap-3">
          <div className="flex justify-between items-center bg-slate-800 text-white px-6 py-2.5 rounded-2xl shadow-md border border-slate-700">
            <span className="text-xs font-bold tracking-wider text-slate-300 flex items-center gap-1.5">
              📱 Canlı Önizleme
              {!wedding.is_paid && <span className="bg-amber-500 text-slate-900 font-bold px-2 py-0.5 rounded-full text-[9px] uppercase animate-pulse">Önizleme Modu</span>}
            </span>
            <button 
              onClick={handleReplayAnimation}
              className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
            >
              <Wand2 className="w-3.5 h-3.5" /> Yenile
            </button>
          </div>
          <div className="relative h-[800px] w-full bg-slate-800 rounded-[3rem] p-4 shadow-2xl border-4 border-slate-700">
            {/* Telefon Çentiği */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-3xl z-20"></div>
            <div className="w-full h-full bg-slate-50 rounded-[2.2rem] overflow-hidden relative">
              <iframe 
                key={previewKey} 
                src={`/d/${wedding.slug}?preview=true&t=${previewKey}`} 
                className="w-full h-full border-0"
                title="Live Preview"
              />
            </div>
          </div>
          {/* Mobil için önizleme uyarısı */}
          <div className="lg:hidden bg-blue-50 text-blue-600 p-4 rounded-xl text-sm font-medium">
            📱 Canlı önizleme ekranı telefonlarda performans sebebiyle gizlenmiştir. Değişikliklerinizi kaydettikten sonra <a href={`/d/${wedding.slug}?preview=true`} target="_blank" className="underline font-bold">buraya tıklayarak</a> sitenize bakabilirsiniz.
          </div>
        </div>
      </div>

    </div> {/* GRID KAPANIŞ */}
  </div>
  );
}

