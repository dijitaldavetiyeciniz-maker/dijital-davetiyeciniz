'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Sparkles, Plus, ExternalLink, Settings, Edit, Trash2, X, Lock, Shield, Database, Users, CheckCircle } from 'lucide-react';

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
  const [userEmail, setUserEmail] = useState('');

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
    setUserEmail(w.user_email || '');
  }

  function handleCancelEdit() {
    setEditingId(null);
    setBrideName(''); setGroomName(''); setBrideParents(''); setGroomParents(''); setSlug(''); setPassword('');
    setWeddingDate(''); setVenueName(''); setVenueAddress(''); setGoogleMapsUrl(''); setCustomMessage('');
    setUserEmail('');
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
      custom_message: customMessage,
      user_email: userEmail
    };

    if (editingId) {
      const { error } = await supabase.from('weddings').update(payload).eq('id', editingId);
      if (!error) {
        alert('Düğün Başarıyla Güncellendi!');
        fetchWeddings();
        handleCancelEdit();
      } else {
        alert('Hata: ' + error.message);
      }
    } else {
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
      <div className="min-h-screen bg-[#0a0a12] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Orbs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/20 rounded-full mix-blend-screen filter blur-[120px] opacity-50 animate-pulse pointer-events-none" />
        
        <div className="bg-white/5 backdrop-blur-2xl rounded-3xl shadow-2xl w-full max-w-md p-10 text-center border border-white/10 relative z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-3xl pointer-events-none" />
          
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-8 text-white shadow-lg shadow-indigo-500/30">
            <Shield className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3 font-serif">Yönetim Merkezi</h1>
          <p className="text-slate-400 mb-10 text-sm">Sisteme erişmek için yetkili şifresini girin.</p>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            if (adminPasswordInput === 'admin123') setIsAuthenticated(true);
            else alert('Hatalı şifre!');
          }}>
            <div className="relative mb-6">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="password" 
                value={adminPasswordInput}
                onChange={e => setAdminPasswordInput(e.target.value)}
                placeholder="Admin Şifresi"
                className="w-full pl-12 pr-4 py-4 border border-white/10 rounded-xl text-center text-xl tracking-[0.3em] bg-white/5 text-white placeholder:text-white/20 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all backdrop-blur-sm"
                autoFocus
              />
            </div>
            <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-4 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25">
              Sisteme Giriş Yap
            </button>
          </form>
        </div>
      </div>
    );
  }

  const publishedCount = weddings.filter(w => w.is_paid).length;
  const pendingCount = weddings.length - publishedCount;

  return (
    <div className="min-h-screen bg-[#0a0a12] text-slate-300 relative overflow-hidden font-sans">
      {/* Background Orbs */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-indigo-500/10 rounded-full mix-blend-screen filter blur-[150px] opacity-40 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-rose-500/10 rounded-full mix-blend-screen filter blur-[120px] opacity-30 pointer-events-none" />

      <div className="max-w-[1400px] mx-auto p-6 md:p-8 relative z-10">
        
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white font-serif">Süper Admin Paneli</h1>
              <p className="text-slate-400 text-sm">Tüm davetiyeleri yönetin ve yapılandırın</p>
            </div>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <div className="bg-[#0a0a12]/50 border border-white/5 px-6 py-3 rounded-2xl flex items-center gap-3">
              <Database className="w-5 h-5 text-indigo-400" />
              <div>
                <div className="text-2xl font-bold text-white leading-none">{weddings.length}</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500">Toplam</div>
              </div>
            </div>
            <div className="bg-[#0a0a12]/50 border border-white/5 px-6 py-3 rounded-2xl flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="text-2xl font-bold text-white leading-none">{publishedCount}</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500">Yayında</div>
              </div>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Çift Ekleme / Düzenleme Formu - Sol Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-white/5 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 sticky top-8 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-white flex items-center gap-3 font-serif">
                  {editingId ? (
                    <><Edit className="w-6 h-6 text-indigo-400" /> Düzenle</>
                  ) : (
                    <><Plus className="w-6 h-6 text-rose-400" /> Yeni Ekle</>
                  )}
                </h2>
                {editingId && (
                  <button onClick={handleCancelEdit} className="text-slate-400 hover:text-white bg-white/5 p-2 rounded-xl hover:bg-white/10 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Gelin / Adayı</label>
                    <input required value={brideName} onChange={e=>setBrideName(e.target.value)} type="text" className="w-full bg-[#0a0a12]/50 border border-white/10 p-3 rounded-xl text-white focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Damat / Adayı</label>
                    <input required value={groomName} onChange={e=>setGroomName(e.target.value)} type="text" className="w-full bg-[#0a0a12]/50 border border-white/10 p-3 rounded-xl text-white focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Gelin Ailesi</label>
                    <input value={brideParents} onChange={e=>setBrideParents(e.target.value)} type="text" className="w-full bg-[#0a0a12]/50 border border-white/10 p-3 rounded-xl text-white focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm outline-none placeholder:text-slate-600" placeholder="İsimler" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Damat Ailesi</label>
                    <input value={groomParents} onChange={e=>setGroomParents(e.target.value)} type="text" className="w-full bg-[#0a0a12]/50 border border-white/10 p-3 rounded-xl text-white focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm outline-none placeholder:text-slate-600" placeholder="İsimler" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">URL Slug</label>
                    <div className="flex">
                      <span className="bg-[#0a0a12] border border-white/10 border-r-0 px-3 py-3 rounded-l-xl text-slate-500 text-sm flex items-center">/</span>
                      <input required value={slug} onChange={e=>setSlug(e.target.value)} type="text" className="w-full bg-[#0a0a12]/50 border border-white/10 p-3 rounded-r-xl text-white focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm outline-none" placeholder="isim" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Tür</label>
                    <select value={eventType} onChange={e=>setEventType(e.target.value)} className="w-full bg-[#0a0a12]/50 border border-white/10 p-3 rounded-xl text-white focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm outline-none appearance-none">
                      <option value="Düğün">Düğün</option>
                      <option value="Nişan">Nişan</option>
                      <option value="Kına">Kına</option>
                      <option value="Söz">Söz</option>
                      <option value="Nikah">Nikah</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Şablon</label>
                  <select value={templateId} onChange={e=>setTemplateId(e.target.value)} className="w-full bg-[#0a0a12]/50 border border-white/10 p-3 rounded-xl text-white focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm outline-none appearance-none">
                    <option value="template1">Şablon 1 (Zarif & Romantik)</option>
                    <option value="template2">Şablon 2 (Modern & Gece)</option>
                    <option value="template3">Şablon 3 (Rustik & Doğal)</option>
                    <option value="template4">Şablon 4 (Klasik & Kraliyet)</option>
                    <option value="template5">Şablon 5 (Minimalist)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Mekan Adı</label>
                    <input value={venueName} onChange={e=>setVenueName(e.target.value)} type="text" className="w-full bg-[#0a0a12]/50 border border-white/10 p-3 rounded-xl text-white focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Tarih</label>
                    <input type="datetime-local" value={weddingDate} onChange={e=>setWeddingDate(e.target.value)} className="w-full bg-[#0a0a12]/50 border border-white/10 p-3 rounded-xl text-white focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm outline-none [color-scheme:dark]" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Adres</label>
                    <input value={venueAddress} onChange={e=>setVenueAddress(e.target.value)} type="text" className="w-full bg-[#0a0a12]/50 border border-white/10 p-3 rounded-xl text-white focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Harita URL</label>
                    <input value={googleMapsUrl} onChange={e=>setGoogleMapsUrl(e.target.value)} type="text" className="w-full bg-[#0a0a12]/50 border border-white/10 p-3 rounded-xl text-white focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Özel Mesaj</label>
                  <textarea value={customMessage} onChange={e=>setCustomMessage(e.target.value)} className="w-full bg-[#0a0a12]/50 border border-white/10 p-3 rounded-xl text-white focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm outline-none resize-none" rows={2} />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Kullanıcı E-posta</label>
                  <input value={userEmail} onChange={e=>setUserEmail(e.target.value)} type="email" className="w-full bg-[#0a0a12]/50 border border-white/10 p-3 rounded-xl text-white focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm outline-none" />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Yönetim Şifresi</label>
                  <input required value={password} onChange={e=>setPassword(e.target.value)} type="text" className="w-full bg-[#0a0a12]/50 border border-white/10 p-3 rounded-xl text-white focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm outline-none" />
                </div>

                <button type="submit" className={`w-full text-white font-bold py-4 rounded-xl transition-all shadow-lg mt-6 ${editingId ? 'bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 shadow-indigo-500/20' : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-emerald-500/20'}`}>
                  {editingId ? 'Değişiklikleri Kaydet' : 'Oluştur ve Ekle'}
                </button>
              </form>
            </div>
          </div>

          {/* Mevcut Çiftler Listesi */}
          <div className="lg:col-span-8">
            <h2 className="text-xl font-bold text-white mb-6 font-serif flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" /> Kayıtlı Davetiyeler
            </h2>
            
            <div className="grid gap-4">
              {loading ? (
                <div className="flex justify-center p-12">
                  <div className="w-10 h-10 border-4 border-white/10 border-t-indigo-500 rounded-full animate-spin" />
                </div>
              ) : weddings.map((w: any) => (
                <div key={w.id} className={`bg-white/5 backdrop-blur-xl p-6 rounded-3xl border transition-all ${editingId === w.id ? 'border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.2)]' : 'border-white/10 hover:border-white/20'}`}>
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-xl text-white font-serif">
                          {w.bride_name} <span className="text-rose-500">&</span> {w.groom_name}
                        </h3>
                        {w.user_email && (
                          <span className="text-xs font-medium bg-white/10 px-2 py-1 rounded text-slate-300">
                            {w.user_email}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className="text-xs bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 px-3 py-1 rounded-full font-medium">{w.event_type || 'Düğün'}</span>
                        <span className="text-xs bg-white/5 border border-white/10 text-slate-400 px-3 py-1 rounded-full">{w.template_id}</span>
                        {!w.is_paid ? 
                          <span className="text-xs bg-amber-500/20 border border-amber-500/30 text-amber-400 px-3 py-1 rounded-full font-medium">Ödeme Bekliyor</span> :
                          <span className="text-xs bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full font-medium">Yayında</span>
                        }
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <a href={`/d/${w.slug}`} target="_blank" className="bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                          Siteye Git <ExternalLink className="w-4 h-4" />
                        </a>
                        <button 
                          onClick={() => togglePaymentStatus(w.id, w.is_paid, w.slug)}
                          className={`text-sm font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${w.is_paid ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20' : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30'}`}
                        >
                          {w.is_paid ? 'Ödemeyi İptal Et' : 'Yayına Al (Onayla)'}
                        </button>
                        <a href={`/d/${w.slug}/admin`} target="_blank" className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                          Müşteri Paneli
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-4 w-full md:w-auto border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
                      <div className="text-right w-full">
                        <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">URL Slug</div>
                        <div className="font-mono bg-[#0a0a12] border border-white/10 px-3 py-2 rounded-lg text-sm text-slate-300 w-full md:w-auto text-center md:text-right">/{w.slug}</div>
                      </div>
                      <div className="flex items-center gap-2 w-full justify-end">
                        <button onClick={() => handleEditClick(w)} className="p-2.5 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 rounded-xl transition-colors border border-indigo-500/20 flex-1 md:flex-none flex justify-center" title="Düzenle">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDelete(w.id)} className="p-2.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl transition-colors border border-red-500/20 flex-1 md:flex-none flex justify-center" title="Sil">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
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
