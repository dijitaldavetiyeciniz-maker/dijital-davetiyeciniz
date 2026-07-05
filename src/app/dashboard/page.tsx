'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, Plus, Settings, LogOut, ExternalLink } from 'lucide-react';

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

      // Kullanıcının davetiyelerini çek
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
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Yükleniyor...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold font-serif text-slate-800">
            <Sparkles className="w-5 h-5 text-rose-500" />
            Dijital <span className="text-rose-500">Davetiyeciniz</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 hidden md:block">{user?.email}</span>
            <button onClick={handleLogout} className="text-slate-500 hover:text-rose-500 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Kontrol Paneli</h1>
            <p className="text-slate-500">Davetiyelerinizi buradan yönetebilirsiniz.</p>
          </div>
          <Link 
            href="/olustur" 
            className="bg-rose-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-rose-600 transition-colors flex items-center gap-2 shadow-lg shadow-rose-200"
          >
            <Plus className="w-5 h-5" /> Yeni Davetiye Oluştur
          </Link>
        </div>

        {weddings.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 border-dashed p-16 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-slate-300" />
            </div>
            <h2 className="text-2xl font-bold text-slate-700 mb-2">Henüz davetiyeniz yok</h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">Hemen şablon galerisinden bir tasarım seçerek ilk davetiyenizi oluşturmaya başlayın.</p>
            <Link 
              href="/olustur" 
              className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors inline-block"
            >
              Şablonları İncele
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {weddings.map(wedding => (
              <div key={wedding.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${wedding.is_paid ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                    {wedding.is_paid ? 'Yayında' : 'Ödeme Bekliyor'}
                  </div>
                  <div className="text-xs text-slate-400 font-mono">/d/{wedding.slug}</div>
                </div>
                
                <h3 className="text-xl font-bold text-slate-800 mb-1">{wedding.bride_name} {wedding.groom_name && `& ${wedding.groom_name}`}</h3>
                <p className="text-slate-500 text-sm mb-6 flex-grow">{wedding.event_type || 'Düğün'} Davetiyesi</p>

                <div className="flex gap-2">
                  <Link 
                    href={`/d/${wedding.slug}/admin`}
                    className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-bold text-sm text-center hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Settings className="w-4 h-4" /> Oluştur / Düzenle
                  </Link>
                  <a 
                    href={`/d/${wedding.slug}`}
                    target="_blank"
                    className="flex-1 bg-rose-50 text-rose-600 py-3 rounded-xl font-bold text-sm text-center hover:bg-rose-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" /> Görüntüle
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <footer className="text-center py-8 text-slate-500 text-sm border-t border-slate-100 mt-16">
        Sorun veya öneriniz için: <a href="mailto:dijitaldavetiyeciniz@gmail.com" className="text-rose-500 font-medium hover:underline">dijitaldavetiyeciniz@gmail.com</a>
      </footer>
    </div>
  );
}
