'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Sparkles, Plus, Settings, LogOut, ExternalLink, Heart, Clock, Star, 
  Trash2, RotateCcw, Copy, Share2, Eye, Calendar, MapPin, CheckCircle, AlertTriangle, X
} from 'lucide-react';
import { eventTypeConfigs } from '@/data/eventTypeConfig';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [weddings, setWeddings] = useState<any[]>([]);
  const [trashedWeddings, setTrashedWeddings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'trash'>('active');

  // Modals state
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [permanentDeleteTarget, setPermanentDeleteTarget] = useState<any>(null);
  const [shareTarget, setShareTarget] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchDashboardData = async (userId: string) => {
    // Active weddings (deleted_at IS NULL)
    const { data: activeData } = await supabase
      .from('weddings')
      .select('*')
      .eq('user_id', userId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    // Trashed weddings (deleted_at IS NOT NULL)
    const { data: trashedData } = await supabase
      .from('weddings')
      .select('*')
      .eq('user_id', userId)
      .not('deleted_at', 'is', null)
      .order('deleted_at', { ascending: false });

    if (activeData) setWeddings(activeData);
    if (trashedData) setTrashedWeddings(trashedData);
  };

  useEffect(() => {
    async function getUserAndData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/giris-yap');
        return;
      }
      setUser(session.user);
      await fetchDashboardData(session.user.id);
      setLoading(false);
    }
    getUserAndData();
  }, [router]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/giris-yap');
  };

  // 1. Soft Delete (Çöp Kutusuna Taşı)
  const handleSoftDelete = async () => {
    if (!deleteTarget || !user) return;
    const now = new Date().toISOString();

    const { error } = await supabase
      .from('weddings')
      .update({
        deleted_at: now,
        deleted_by: user.id,
        is_active: false
      })
      .eq('id', deleteTarget.id)
      .eq('user_id', user.id);

    if (!error) {
      showToast(`"${deleteTarget.bride_name || deleteTarget.title || 'Davetiye'}" çöp kutusuna taşındı.`);
      setDeleteTarget(null);
      await fetchDashboardData(user.id);
    }
  };

  // 2. Restore (Geri Yükle)
  const handleRestore = async (wedding: any) => {
    if (!user) return;
    const { error } = await supabase
      .from('weddings')
      .update({
        deleted_at: null,
        deleted_by: null,
        is_active: true
      })
      .eq('id', wedding.id)
      .eq('user_id', user.id);

    if (!error) {
      showToast(`"${wedding.bride_name || wedding.title || 'Davetiye'}" başarıyla geri yüklendi.`);
      await fetchDashboardData(user.id);
    }
  };

  // 3. Permanent Delete (Kalıcı Olarak Sil)
  const handlePermanentDelete = async () => {
    if (!permanentDeleteTarget || !user) return;

    // Clean user sub-data first
    await supabase.from('rsvps').delete().eq('wedding_id', permanentDeleteTarget.id);
    await supabase.from('guestbook_entries').delete().eq('wedding_id', permanentDeleteTarget.id);
    await supabase.from('wedding_integrations').delete().eq('wedding_id', permanentDeleteTarget.id);

    // Delete wedding record
    const { error } = await supabase
      .from('weddings')
      .delete()
      .eq('id', permanentDeleteTarget.id)
      .eq('user_id', user.id);

    if (!error) {
      showToast(`"${permanentDeleteTarget.bride_name || 'Davetiye'}" kalıcı olarak silindi.`);
      setPermanentDeleteTarget(null);
      await fetchDashboardData(user.id);
    }
  };

  // 4. Duplicate (Kopyala)
  const handleDuplicate = async (wedding: any) => {
    if (!user) return;
    const newSlug = `${wedding.slug}-kopya-${Math.floor(Math.random() * 1000)}`;
    const { id, created_at, updated_at, deleted_at, deleted_by, ...copyData } = wedding;

    const newRecord = {
      ...copyData,
      user_id: user.id,
      slug: newSlug,
      title: `${wedding.title || wedding.bride_name || 'Davetiye'} (Kopya)`,
      is_paid: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('weddings').insert(newRecord);
    if (!error) {
      showToast(`Davetiye kopyalandı: ${newSlug}`);
      await fetchDashboardData(user.id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a12] flex items-center justify-center relative overflow-hidden">
        <div className="w-16 h-16 border-4 border-white/10 border-t-rose-500 rounded-full animate-spin relative z-10" />
      </div>
    );
  }

  const publishedCount = weddings.filter(w => w.is_paid).length;
  const pendingCount = weddings.length - publishedCount;

  return (
    <div className="min-h-screen bg-[#0a0a12] text-slate-300 relative overflow-hidden font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[200] bg-rose-500 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in font-bold text-sm">
          <CheckCircle className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

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
            <button onClick={handleLogout} className="text-slate-400 hover:text-rose-500 transition-colors p-2 rounded-xl hover:bg-white/5" title="Çıkış Yap">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="md:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-rose-500/20 to-transparent rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />
            <h1 className="text-3xl font-bold text-white mb-2 font-serif">Hoş Geldiniz</h1>
            <p className="text-slate-400">Davetiyelerinizi ve çöp kutunuzu buradan yönetebilirsiniz.</p>
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

        {/* Tab & Header Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex gap-3 bg-white/5 p-1.5 rounded-2xl border border-white/10">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                activeTab === 'active'
                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Heart className="w-4 h-4" /> Davetiyelerim ({weddings.length})
            </button>
            <button
              onClick={() => setActiveTab('trash')}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                activeTab === 'trash'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Trash2 className="w-4 h-4" /> Çöp Kutusu ({trashedWeddings.length})
            </button>
          </div>

          <Link
            href="/olustur"
            className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-6 py-3 rounded-xl font-bold hover:from-rose-600 hover:to-pink-700 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:shadow-[0_0_30px_rgba(244,63,94,0.5)] group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> Yeni Davetiye Oluştur
          </Link>
        </div>

        {/* 1. AKTİF DAVETİYELER TAB */}
        {activeTab === 'active' && (
          weddings.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 border-dashed p-16 text-center relative overflow-hidden">
              <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-rose-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3 font-serif">Henüz aktif davetiyeniz yok</h2>
              <p className="text-slate-400 mb-8 max-w-md mx-auto text-sm">Hemen yeni bir tasarım seçerek davetiyenizi oluşturun.</p>
              <Link href="/olustur" className="bg-white text-[#0a0a12] px-6 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors inline-block text-sm">
                Yeni Davetiye Oluştur
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {weddings.map(wedding => {
                const eventConfig = eventTypeConfigs[wedding.event_type] || eventTypeConfigs.wedding;
                const displayName = wedding.bride_name || wedding.primary_subject_name || 'Davetiye';

                return (
                  <div key={wedding.id} className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl hover:border-rose-500/40 transition-all flex flex-col justify-between group relative">
                    <div>
                      {/* Top Badges */}
                      <div className="flex justify-between items-center mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${wedding.is_paid ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                          {wedding.is_paid ? 'Yayında' : 'Ödeme Bekliyor'}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono bg-white/5 px-2.5 py-1 rounded-lg">
                          /d/{wedding.slug}
                        </span>
                      </div>

                      {/* Title & Event Type */}
                      <h3 className="text-xl font-bold text-white mb-1 font-serif group-hover:text-rose-400 transition-colors">
                        {displayName} {wedding.groom_name && `& ${wedding.groom_name}`}
                      </h3>
                      <p className="text-xs text-rose-400 font-medium mb-4">{eventConfig.label} Davetiyesi</p>

                      {/* Details Meta */}
                      <div className="text-xs text-slate-400 space-y-1.5 mb-6 bg-black/20 p-3 rounded-xl border border-white/5">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>{wedding.wedding_date || 'Tarih Belirtilmedi'}</span>
                        </div>
                        {wedding.venue_name && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-slate-500" />
                            <span className="truncate">{wedding.venue_name}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 pt-1 border-t border-white/5 text-[11px] text-slate-500">
                          <Eye className="w-3.5 h-3.5" />
                          <span>{wedding.view_count || 0} Görüntülenme</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Bar (Edit, Preview, Share, Duplicate, Delete) */}
                    <div className="space-y-2 pt-2 border-t border-white/5">
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          href={`/d/${wedding.slug}/admin`}
                          className="bg-white/10 text-white py-2.5 rounded-xl font-bold text-xs text-center hover:bg-white/20 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Settings className="w-3.5 h-3.5" /> Düzenle
                        </Link>
                        <a
                          href={`/d/${wedding.slug}`}
                          target="_blank"
                          className="bg-gradient-to-r from-rose-500 to-pink-600 text-white py-2.5 rounded-xl font-bold text-xs text-center hover:from-rose-600 hover:to-pink-700 transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-rose-500/20"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Önizle
                        </a>
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <button
                          onClick={() => setShareTarget(wedding)}
                          className="text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-1 p-1.5 hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <Share2 className="w-3.5 h-3.5" /> Paylaş
                        </button>
                        <button
                          onClick={() => handleDuplicate(wedding)}
                          className="text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-1 p-1.5 hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" /> Kopyala
                        </button>
                        <button
                          onClick={() => setDeleteTarget(wedding)}
                          className="text-rose-400 hover:text-rose-300 text-xs font-semibold flex items-center gap-1 p-1.5 hover:bg-rose-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Sil
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* 2. ÇÖP KUTUSU TAB */}
        {activeTab === 'trash' && (
          trashedWeddings.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 border-dashed p-16 text-center">
              <Trash2 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Çöp kutusu boş</h2>
              <p className="text-slate-400 text-sm">Silinen davetiyeleriniz burada listelenir.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trashedWeddings.map(wedding => (
                <div key={wedding.id} className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-rose-500/20 shadow-2xl relative opacity-85 hover:opacity-100 transition-opacity">
                  <div className="flex justify-between items-center mb-3">
                    <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[11px] font-bold px-3 py-1 rounded-full">
                      Çöp Kutusunda
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">/d/{wedding.slug}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1 font-serif">
                    {wedding.bride_name || wedding.title || 'Davetiye'} {wedding.groom_name && `& ${wedding.groom_name}`}
                  </h3>
                  <p className="text-xs text-slate-400 mb-6">Devre dışı bırakıldı</p>

                  <div className="flex gap-3 pt-3 border-t border-white/10">
                    <button
                      onClick={() => handleRestore(wedding)}
                      className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border border-emerald-500/30 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Geri Yükle
                    </button>
                    <button
                      onClick={() => setPermanentDeleteTarget(wedding)}
                      className="flex-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border border-rose-500/30 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Kalıcı Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </main>

      {/* SOFT DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#12131c] border border-white/10 rounded-3xl max-w-md w-full p-6 shadow-2xl text-center">
            <div className="w-14 h-14 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 font-serif">Davetiyeyi Sil</h3>
            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
              <strong>"{deleteTarget.bride_name || deleteTarget.title || 'Davetiye'}"</strong> davetiyesini silmek istediğinize emin misiniz? Davetiyeniz çöp kutusuna taşınacak ve public bağlantısı devre dışı bırakılacaktır.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 bg-white/10 hover:bg-white/20 text-slate-300 py-3 rounded-xl font-bold text-sm transition-colors"
              >
                Vazgeç
              </button>
              <button
                onClick={handleSoftDelete}
                className="flex-1 bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-rose-500/30"
              >
                Çöp Kutusuna Taşı
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PERMANENT DELETE CONFIRMATION MODAL */}
      {permanentDeleteTarget && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#12131c] border border-rose-500/30 rounded-3xl max-w-md w-full p-6 shadow-2xl text-center">
            <div className="w-14 h-14 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/40">
              <Trash2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 font-serif">Kalıcı Olarak Sil</h3>
            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
              <strong>"{permanentDeleteTarget.bride_name || 'Davetiye'}"</strong> davetiyesini ve tüm misafir yanıtlarını kalıcı olarak silmek üzeresiniz. Bu işlem geri alınamaz!
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setPermanentDeleteTarget(null)}
                className="flex-1 bg-white/10 hover:bg-white/20 text-slate-300 py-3 rounded-xl font-bold text-sm transition-colors"
              >
                Vazgeç
              </button>
              <button
                onClick={handlePermanentDelete}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-rose-600/40"
              >
                Kalıcı Olarak Sil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SHARE MODAL */}
      {shareTarget && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#12131c] border border-white/10 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button onClick={() => setShareTarget(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-white mb-4 font-serif">Davetiye Bağlantısını Paylaş</h3>
            <div className="bg-black/30 p-3 rounded-xl border border-white/10 text-xs font-mono text-slate-300 break-all mb-4">
              {typeof window !== 'undefined' ? `${window.location.origin}/d/${shareTarget.slug}` : `/d/${shareTarget.slug}`}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/d/${shareTarget.slug}`);
                  showToast("Bağlantı panoya kopyalandı!");
                  setShareTarget(null);
                }}
                className="flex-1 bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4" /> Kopyala
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
