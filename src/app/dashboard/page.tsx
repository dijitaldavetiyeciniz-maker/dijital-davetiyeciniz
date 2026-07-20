'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, Plus, Settings, LogOut, ExternalLink, Heart, Clock, Star } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [weddings, setWeddings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUserAndData() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/giris-yap');
        return;
      }
      
      setUser(session.user);

      const { data: userWeddings } = await supabase
        .from('weddings')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (userWeddings) {
        setWeddings(userWeddings);
      }
      setLoading(false);
    }

    getUserAndData();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/giris-yap');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a12] flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-500/20 rounded-full mix-blend-screen filter blur-[120px] opacity-50 animate-pulse pointer-events-none" />
        <div className="w-16 h-16 border-4 border-white/10 border-t-rose-500 rounded-full animate-spin relative z-10" />
      </div>
    );
  }

  const publishedCount = weddings.filter(w => w.is_paid).length;
  const pendingCount = weddings.length - publishedCount;

  return (
    <div className="min-h-screen bg-[#0a0a12] text-slate-300 relative overflow-hidden font-sans">
      {/* Background Orbs */}
      <div className="fixed top-0 left-0 w-[800px] h-[800px] bg-rose-500/10 rounded-full mix-blend-screen filter blur-[150px] opacity-50 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full mix-blend-screen filter blur-[120px] opacity-40 pointer-events-none" />

      {/* Navbar */}
      <nav className="bg-[#0a0a12]/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold font-serif text-white hover:opacity-85 transition-opacity">
            <Sparkles className="w-6 h-6 text-rose-500" />
            Dijital <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600">Davetiyeciniz</span>
          </Link>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 p-[2px]">
                <div className="w-full h-full rounded-full bg-[#0a0a12] flex items-center justify-center text-white font-bold font-serif text-sm">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
              </div>
              <span className="text-sm font-medium text-slate-300">{user?.email}</span>
            </div>
            <button onClick={handleLogout} className="text-slate-400 hover:text-rose-500 transition-colors p-2 rounded-xl hover:bg-white/5">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="md:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-rose-500/20 to-transparent rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />
            <h1 className="text-3xl font-bold text-white mb-2 font-serif">Hoş Geldiniz</h1>
            <p className="text-slate-400">Davetiyelerinizi buradan yönetebilirsiniz.</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{publishedCount}</div>
              <div className="text-sm text-slate-400">Yayında</div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{pendingCount}</div>
              <div className="text-sm text-slate-400">Ödeme Bekliyor</div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white font-serif flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500" /> Davetiyelerim
          </h2>
          <Link 
            href="/olustur" 
            className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-6 py-3 rounded-xl font-bold hover:from-rose-600 hover:to-pink-700 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:shadow-[0_0_30px_rgba(244,63,94,0.5)] group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> Yeni Oluştur
          </Link>
        </div>

        {weddings.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 border-dashed p-20 text-center relative overflow-hidden">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-rose-500/10 rounded-full blur-[50px]" />
            <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
              <Sparkles className="w-12 h-12 text-rose-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 font-serif relative z-10">Henüz davetiyeniz yok</h2>
            <p className="text-slate-400 mb-10 max-w-md mx-auto relative z-10 text-lg">Hemen şablon galerisinden bir tasarım seçerek ilk davetiyenizi oluşturmaya başlayın.</p>
            <Link 
              href="/olustur" 
              className="bg-white text-[#0a0a12] px-8 py-4 rounded-xl font-bold hover:bg-slate-200 transition-colors inline-block relative z-10"
            >
              Şablonları İncele
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {weddings.map(wedding => (
              <div key={wedding.id} className="bg-white/5 backdrop-blur-xl rounded-3xl p-1 border border-white/10 shadow-2xl hover:border-rose-500/50 transition-all group relative overflow-hidden">
                {/* Card inner background */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="bg-[#0a0a12]/80 backdrop-blur-md rounded-[22px] p-6 h-full flex flex-col relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`px-3 py-1.5 rounded-full text-xs font-bold border ${wedding.is_paid ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                      {wedding.is_paid ? 'Yayında' : 'Ödeme Bekliyor'}
                    </div>
                    <div className="text-xs text-slate-500 font-mono bg-white/5 px-3 py-1.5 rounded-full border border-white/5">/d/{wedding.slug}</div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2 font-serif group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400 transition-colors">
                    {wedding.bride_name} {wedding.groom_name && `& ${wedding.groom_name}`}
                  </h3>
                  <p className="text-rose-400 text-sm mb-8 flex-grow font-medium">{wedding.event_type || 'Düğün'} Davetiyesi</p>

                  <div className="flex gap-3">
                    <Link 
                      href={`/d/${wedding.slug}/admin`}
                      className="flex-1 bg-white/10 text-white py-3 rounded-xl font-bold text-sm text-center hover:bg-white/20 transition-colors flex items-center justify-center gap-2 border border-white/5"
                    >
                      <Settings className="w-4 h-4" /> Düzenle
                    </Link>
                    <a 
                      href={`/d/${wedding.slug}`}
                      target="_blank"
                      className="flex-1 bg-gradient-to-r from-rose-500 to-pink-600 text-white py-3 rounded-xl font-bold text-sm text-center hover:from-rose-600 hover:to-pink-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20"
                    >
                      <ExternalLink className="w-4 h-4" /> Görüntüle
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      <footer className="text-center py-8 text-slate-500 text-sm border-t border-white/10 mt-16 relative z-10 bg-[#0a0a12]/80 backdrop-blur-xl">
        Sorun veya öneriniz için: <a href="mailto:dijitaldavetiyeciniz@gmail.com" className="text-rose-400 font-medium hover:text-rose-300 transition-colors">dijitaldavetiyeciniz@gmail.com</a>
      </footer>
    </div>
  );
}
