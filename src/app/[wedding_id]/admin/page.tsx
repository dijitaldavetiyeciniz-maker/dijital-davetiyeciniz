'use client';
import { useState, useEffect, use } from 'react';
import { supabase } from '@/lib/supabase';
import { Lock, Users, MessageSquare } from 'lucide-react';

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

  useEffect(() => {
    fetchWedding();
  }, []);

  async function fetchWedding() {
    const { data } = await supabase
      .from('weddings')
      .select('*')
      .eq('slug', wedding_id)
      .single();
    if (data) setWedding(data);
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
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{wedding.bride_name} & {wedding.groom_name}</h1>
            <p className="text-slate-500">Müşteri Yönetim Paneli</p>
          </div>
          <button onClick={() => setIsAuthed(false)} className="text-sm font-medium text-slate-500 hover:text-slate-800">Çıkış Yap</button>
        </header>

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
    </div>
  );
}
