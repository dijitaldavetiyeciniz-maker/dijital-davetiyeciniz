'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Sparkles, Plus, ExternalLink, Settings } from 'lucide-react';

export default function SuperAdminPage() {
  const [weddings, setWeddings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [slug, setSlug] = useState('');
  const [templateId, setTemplateId] = useState('template1');
  const [password, setPassword] = useState('');
  const [weddingDate, setWeddingDate] = useState('');

  useEffect(() => {
    fetchWeddings();
  }, []);

  async function fetchWeddings() {
    const { data, error } = await supabase.from('weddings').select('*').order('created_at', { ascending: false });
    if (data) setWeddings(data);
    setLoading(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from('weddings').insert([
      {
        bride_name: brideName,
        groom_name: groomName,
        slug: slug,
        template_id: templateId,
        admin_password: password,
        wedding_date: weddingDate ? new Date(weddingDate).toISOString() : null,
      }
    ]);

    if (!error) {
      alert('Yeni Düğün Başarıyla Oluşturuldu!');
      fetchWeddings();
      // Reset form
      setBrideName(''); setGroomName(''); setSlug(''); setPassword('');
    } else {
      alert('Hata: ' + error.message);
    }
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
          
          {/* Yeni Çift Ekleme Formu */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-rose-500" />
              Yeni Çift Oluştur
            </h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Gelin Adı</label>
                  <input required value={brideName} onChange={e=>setBrideName(e.target.value)} type="text" className="w-full border p-2 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Damat Adı</label>
                  <input required value={groomName} onChange={e=>setGroomName(e.target.value)} type="text" className="w-full border p-2 rounded-lg" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Özel URL (Slug)</label>
                <div className="flex">
                  <span className="bg-slate-100 border border-r-0 px-3 py-2 rounded-l-lg text-slate-500 text-sm">/</span>
                  <input required value={slug} onChange={e=>setSlug(e.target.value)} type="text" placeholder="ayse-mehmet" className="w-full border p-2 rounded-r-lg" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tasarım Şablonu</label>
                <select value={templateId} onChange={e=>setTemplateId(e.target.value)} className="w-full border p-2 rounded-lg">
                  <option value="template1">Şablon 1 (Zarif & Romantik)</option>
                  <option value="template2">Şablon 2 (Modern & Gece)</option>
                  <option value="template3">Şablon 3 (Rustik & Doğal)</option>
                  <option value="template4">Şablon 4 (Klasik & Kraliyet)</option>
                  <option value="template5">Şablon 5 (Minimalist)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Düğün Tarihi</label>
                <input type="datetime-local" value={weddingDate} onChange={e=>setWeddingDate(e.target.value)} className="w-full border p-2 rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Çift Yönetim Şifresi</label>
                <input required value={password} onChange={e=>setPassword(e.target.value)} type="text" placeholder="Giriş yapmaları için şifre" className="w-full border p-2 rounded-lg" />
              </div>

              <button type="submit" className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors mt-4">
                URL ve Site Üret
              </button>
            </form>
          </div>

          {/* Mevcut Çiftler Listesi */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-bold mb-6">Aktif Düğünler ({weddings.length})</h2>
            
            <div className="grid gap-4">
              {loading ? <p>Yükleniyor...</p> : weddings.map((w: any) => (
                <div key={w.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{w.bride_name} & {w.groom_name}</h3>
                    <p className="text-sm text-slate-500 mb-2">Şablon: {w.template_id}</p>
                    <div className="flex gap-4">
                      <a href={`/${w.slug}`} target="_blank" className="text-blue-500 text-sm font-medium flex items-center gap-1 hover:underline">
                        Siteye Git <ExternalLink className="w-4 h-4" />
                      </a>
                      <a href={`/${w.slug}/admin`} target="_blank" className="text-rose-500 text-sm font-medium flex items-center gap-1 hover:underline">
                        Müşteri Paneli (Şifre: {w.admin_password})
                      </a>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">URL Slug</div>
                    <div className="font-mono bg-slate-100 px-2 py-1 rounded text-sm mt-1">/{w.slug}</div>
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
