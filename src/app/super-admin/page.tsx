'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Sparkles, Plus, ExternalLink, Settings, Edit, Trash2, X } from 'lucide-react';

export default function SuperAdminPage() {
  const [weddings, setWeddings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [brideParents, setBrideParents] = useState('');
  const [groomParents, setGroomParents] = useState('');
  const [slug, setSlug] = useState('');
  const [templateId, setTemplateId] = useState('template1');
  const [password, setPassword] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  
  // Yeni Alanlar
  const [eventType, setEventType] = useState('Düğün');
  const [venueName, setVenueName] = useState('');
  const [venueAddress, setVenueAddress] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [customMessage, setCustomMessage] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchWeddings();
    }
  }, [isAuthenticated]);

  async function fetchWeddings() {
    const { data, error } = await supabase.from('weddings').select('*').order('created_at', { ascending: false });
    if (data) setWeddings(data);
    setLoading(false);
  }

  async function togglePaymentStatus(id: string, currentStatus: boolean, slug: string) {
    setWeddings(prevWeddings => 
      prevWeddings.map(w => w.id === id ? { ...w, is_paid: !currentStatus } : w)
    );

    const { data, error } = await supabase
      .from('weddings')
      .update({ is_paid: !currentStatus })
      .eq('id', id)
      .select();
    
    if (error || !data || data.length === 0) {
      setWeddings(prevWeddings => 
        prevWeddings.map(w => w.id === id ? { ...w, is_paid: currentStatus } : w)
      );
      alert("Güvenlik Engeli (RLS): Supabase'de güncelleme izniniz yok. Lütfen Supabase SQL Editor'den UPDATE iznini açın.");
    } else if (!currentStatus) {
      window.open(`/${slug}`, '_blank');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Bu davetiyeyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz!')) return;
    
    const { error } = await supabase.from('weddings').delete().eq('id', id);
    if (error) {
      alert('Silinirken hata oluştu: ' + error.message);
    } else {
      fetchWeddings();
    }
  }

  function handleEditClick(w: any) {
    setEditingId(w.id);
    setBrideName(w.bride_name || '');
    setGroomName(w.groom_name || '');
    setBrideParents(w.bride_parents || '');
    setGroomParents(w.groom_parents || '');
    setSlug(w.slug || '');
    setTemplateId(w.template_id || 'template1');
    setPassword(w.admin_password || '');
    setWeddingDate(w.wedding_date ? new Date(w.wedding_date).toISOString().slice(0, 16) : '');
    setEventType(w.event_type || 'Düğün');
    setVenueName(w.venue_name || '');
    setVenueAddress(w.venue_address || '');
    setGoogleMapsUrl(w.google_maps_url || '');
    setCustomMessage(w.custom_message || '');
  }

  function handleCancelEdit() {
    setEditingId(null);
    setBrideName(''); setGroomName(''); setBrideParents(''); setGroomParents(''); setSlug(''); setPassword('');
    setWeddingDate(''); setVenueName(''); setVenueAddress(''); setGoogleMapsUrl(''); setCustomMessage('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    const payload = {
      bride_name: brideName,
      groom_name: groomName,
      bride_parents: brideParents,
      groom_parents: groomParents,
      slug: slug,
      template_id: templateId,
      admin_password: password,
      wedding_date: weddingDate ? new Date(weddingDate).toISOString() : null,
      event_type: eventType,
      venue_name: venueName,
      venue_address: venueAddress,
      google_maps_url: googleMapsUrl,
      custom_message: customMessage
    };

    if (editingId) {
      // Güncelle
      const { error } = await supabase.from('weddings').update(payload).eq('id', editingId);
      if (!error) {
        alert('Düğün Başarıyla Güncellendi!');
        fetchWeddings();
        handleCancelEdit();
      } else {
        alert('Hata: ' + error.message);
      }
    } else {
      // Yeni Ekle
      const { error } = await supabase.from('weddings').insert([
        { ...payload, is_paid: false }
      ]);
      if (!error) {
        alert('Yeni Düğün Başarıyla Oluşturuldu!');
        fetchWeddings();
        handleCancelEdit();
      } else {
        alert('Hata: ' + error.message);
      }
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 text-center border border-slate-100">
          <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 text-white">
            <Settings className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Süper Admin Girişi</h1>
          <p className="text-slate-500 mb-8">Devam etmek için yönetici şifresini girin.</p>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            if (adminPasswordInput === 'admin123') setIsAuthenticated(true);
            else alert('Hatalı şifre!');
          }}>
            <input 
              type="password" 
              value={adminPasswordInput}
              onChange={e => setAdminPasswordInput(e.target.value)}
              placeholder="Şifre"
              className="w-full border p-3 rounded-xl mb-4 text-center text-lg tracking-widest"
              autoFocus
            />
            <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors">
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Süper Admin Paneli</h1>
              <p className="text-slate-500">Dijital Davetiyeciniz Yönetim Merkezi</p>
            </div>
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Çift Ekleme / Düzenleme Formu */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 self-start sticky top-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                {editingId ? <Edit className="w-5 h-5 text-blue-500" /> : <Plus className="w-5 h-5 text-rose-500" />}
                {editingId ? 'Çift Bilgilerini Düzenle' : 'Yeni Çift Oluştur'}
              </h2>
              {editingId && (
                <button onClick={handleCancelEdit} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Gelin / Gelin Adayı</label>
                  <input required value={brideName} onChange={e=>setBrideName(e.target.value)} type="text" className="w-full border p-2 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Damat / Damat Adayı</label>
                  <input required value={groomName} onChange={e=>setGroomName(e.target.value)} type="text" className="w-full border p-2 rounded-lg" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Gelin Anne & Baba</label>
                  <input value={brideParents} onChange={e=>setBrideParents(e.target.value)} type="text" placeholder="Fatma & Ali Yılmaz" className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Damat Anne & Baba</label>
                  <input value={groomParents} onChange={e=>setGroomParents(e.target.value)} type="text" placeholder="Ayşe & Veli Kaya" className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Özel URL (Slug)</label>
                  <div className="flex">
                    <span className="bg-slate-100 border border-r-0 px-3 py-2 rounded-l-lg text-slate-500 text-sm">/</span>
                    <input required value={slug} onChange={e=>setSlug(e.target.value)} type="text" placeholder="ayse-mehmet" className="w-full border p-2 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Etkinlik Türü</label>
                  <select value={eventType} onChange={e=>setEventType(e.target.value)} className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="Düğün">Düğün</option>
                    <option value="Nişan">Nişan</option>
                    <option value="Kına">Kına</option>
                    <option value="Söz">Söz</option>
                    <option value="Nikah">Nikah</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tasarım Şablonu</label>
                <select value={templateId} onChange={e=>setTemplateId(e.target.value)} className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="template1">Şablon 1 (Zarif & Romantik)</option>
                  <option value="template2">Şablon 2 (Modern & Gece)</option>
                  <option value="template3">Şablon 3 (Rustik & Doğal)</option>
                  <option value="template4">Şablon 4 (Klasik & Kraliyet)</option>
                  <option value="template5">Şablon 5 (Minimalist)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Mekan Adı</label>
                  <input value={venueName} onChange={e=>setVenueName(e.target.value)} type="text" placeholder="Çırağan Sarayı" className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tarih ve Saat</label>
                  <input type="datetime-local" value={weddingDate} onChange={e=>setWeddingDate(e.target.value)} className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Açık Adres</label>
                  <input value={venueAddress} onChange={e=>setVenueAddress(e.target.value)} type="text" placeholder="Beşiktaş, İstanbul" className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Google Maps Linki</label>
                  <input value={googleMapsUrl} onChange={e=>setGoogleMapsUrl(e.target.value)} type="text" placeholder="https://maps.app.goo.gl/..." className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Çifte Özel Söz / Davet Metni</label>
                <textarea value={customMessage} onChange={e=>setCustomMessage(e.target.value)} placeholder="Hayatımızın en özel gününde..." className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows={2} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Çift Yönetim Şifresi</label>
                <input required value={password} onChange={e=>setPassword(e.target.value)} type="text" placeholder="Giriş yapmaları için şifre" className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <button type="submit" className={`w-full text-white font-bold py-3 rounded-lg transition-colors mt-4 ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-900 hover:bg-slate-800'}`}>
                {editingId ? 'Değişiklikleri Kaydet' : 'URL ve Site Üret'}
              </button>
            </form>
          </div>

          {/* Mevcut Çiftler Listesi */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-bold mb-6">Aktif Düğünler ({weddings.length})</h2>
            
            <div className="grid gap-4">
              {loading ? <p>Yükleniyor...</p> : weddings.map((w: any) => (
                <div key={w.id} className={`bg-white p-6 rounded-2xl shadow-sm border flex items-center justify-between transition-colors ${editingId === w.id ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200'}`}>
                  <div>
                    <h3 className="font-bold text-lg">{w.bride_name} & {w.groom_name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded font-medium">{w.event_type || 'Düğün'}</span>
                      <span className="text-sm text-slate-500">Şablon: {w.template_id}</span>
                      {!w.is_paid ? 
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded font-medium">Ödeme Bekliyor</span> :
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-medium">Ödendi</span>
                      }
                    </div>
                    <div className="flex gap-4">
                      <a href={`/d/${w.slug}`} target="_blank" className="text-blue-500 text-sm font-medium flex items-center gap-1 hover:underline">
                        Siteye Git <ExternalLink className="w-4 h-4" />
                      </a>
                      <button 
                        onClick={() => togglePaymentStatus(w.id, w.is_paid, w.slug)}
                        className={`text-sm font-bold px-3 py-1 rounded border transition-colors ${w.is_paid ? 'border-orange-500 text-orange-500 hover:bg-orange-50' : 'bg-emerald-500 text-white hover:bg-emerald-600'}`}
                      >
                        {w.is_paid ? 'Ödemeyi İptal Et' : 'Ödemeyi Onayla (Yayına Al)'}
                      </button>
                      <a href={`/d/${w.slug}/admin`} target="_blank" className="text-rose-500 text-sm font-medium flex items-center gap-1 hover:underline">
                        Müşteri Paneli
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-3">
                    <div className="text-right">
                      <div className="text-xs text-slate-400">URL Slug</div>
                      <div className="font-mono bg-slate-100 px-2 py-1 rounded text-sm mt-1">/{w.slug}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEditClick(w)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Düzenle">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(w.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Sil">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
