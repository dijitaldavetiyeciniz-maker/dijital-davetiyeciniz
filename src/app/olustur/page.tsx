'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

function CreateForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultTemplateId = searchParams.get('templateId') || 'template1';

  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [slug, setSlug] = useState('');
  const [eventType, setEventType] = useState('Düğün');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        // Oturum yoksa kayıt olmaya veya girişe yönlendir
        router.push('/kayit-ol');
      } else {
        setUser(session.user);
      }
    });
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    // Formatted slug to ensure no spaces and lowercase
    const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');

    // 1. Check if slug exists
    const { data: existingData } = await supabase.from('weddings').select('id').eq('slug', cleanSlug).single();
    if (existingData) {
      setErrorMsg('Bu URL (Link) maalesef başkası tarafından alınmış. Lütfen başka bir URL deneyin.');
      setIsSubmitting(false);
      return;
    }

    // 2. Insert new wedding
    const { error } = await supabase.from('weddings').insert([
      {
        user_id: user?.id,
        bride_name: brideName,
        groom_name: groomName,
        slug: cleanSlug,
        template_id: defaultTemplateId,
        admin_password: password,
        event_type: eventType,
        is_paid: false
      }
    ]);

    setIsSubmitting(false);

    if (!error) {
      // Başarılıysa müşteriyi kendi admin paneline yönlendir
      router.push(`/${cleanSlug}/admin`);
    } else {
      setErrorMsg('Kayıt oluşturulurken bir hata oluştu: ' + error.message);
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-slate-200 shadow-xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Harika! Şimdi Detaylar...</h2>
        <p className="text-slate-500">Davetiyenizi oluşturmak için aşağıdaki temel bilgileri doldurun.</p>
      </div>

      {errorMsg && (
        <div className="bg-rose-50 text-rose-600 p-4 rounded-xl font-medium mb-6">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Gelin / Kadın / Bebek Adı</label>
            <input required type="text" value={brideName} onChange={e=>setBrideName(e.target.value)} placeholder="Örn: Ayşe" className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 focus:ring-2 focus:ring-rose-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Damat / Erkek Adı (Opsiyonel)</label>
            <input type="text" value={groomName} onChange={e=>setGroomName(e.target.value)} placeholder="Örn: Mehmet" className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 focus:ring-2 focus:ring-rose-500 focus:outline-none" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Etkinlik Türü</label>
            <select value={eventType} onChange={e=>setEventType(e.target.value)} className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 focus:ring-2 focus:ring-rose-500 focus:outline-none">
              <option value="Düğün">Düğün</option>
              <option value="Nişan">Nişan</option>
              <option value="Kına">Kına</option>
              <option value="Baby Shower">Baby Shower</option>
              <option value="Doğum Günü">Doğum Günü</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Yönetim Şifreniz</label>
            <input required type="text" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Sonra giriş yapmak için" className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 focus:ring-2 focus:ring-rose-500 focus:outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Davetiye Linkiniz (URL)</label>
          <div className="flex">
            <span className="bg-slate-100 border border-slate-200 border-r-0 px-4 py-3 rounded-l-xl text-slate-500 font-medium">dijitaldavetiye.com/</span>
            <input required type="text" value={slug} onChange={e=>setSlug(e.target.value)} placeholder="ayse-mehmet" className="w-full border border-slate-200 rounded-r-xl p-3 focus:ring-2 focus:ring-rose-500 focus:outline-none" />
          </div>
          <p className="text-xs text-slate-400 mt-2">Bu linki misafirlerinize göndereceksiniz. Lütfen Türkçe karakter kullanmayın.</p>
        </div>

        <div className="pt-4">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-4 bg-rose-500 text-white font-bold rounded-xl shadow-lg hover:bg-rose-600 transition-all disabled:opacity-50 text-lg"
          >
            {isSubmitting ? 'Oluşturuluyor...' : 'Davetiyemi Oluştur & Tasarıma Geç'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <Link href="/sablonlar" className="text-sm font-bold text-slate-500 hover:text-rose-500 transition-colors mb-8 inline-block">
          &larr; Şablon Seçimine Dön
        </Link>
        
        {/* Suspense is required when using useSearchParams in Next.js App Router */}
        <Suspense fallback={<div className="text-center p-20">Yükleniyor...</div>}>
          <CreateForm />
        </Suspense>
      </div>
    </div>
  );
}
