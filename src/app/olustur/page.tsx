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
  const [templateId, setTemplateId] = useState(defaultTemplateId);
  const [venueName, setVenueName] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [venueAddress, setVenueAddress] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [customMessage, setCustomMessage] = useState('');
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

    // Tarih objesine dönüştür (eğer girildiyse)
    const formattedDate = weddingDate ? new Date(weddingDate).toISOString() : null;

    // 2. Insert new wedding
    const { error } = await supabase.from('weddings').insert([
      {
        user_id: user?.id,
        bride_name: brideName,
        groom_name: groomName,
        slug: cleanSlug,
        template_id: templateId,
        admin_password: password,
        event_type: eventType,
        venue_name: venueName,
        wedding_date: formattedDate,
        venue_address: venueAddress,
        google_maps_url: googleMapsUrl,
        custom_message: customMessage,
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
        <h2 className="text-3xl font-bold text-slate-800 mb-2 flex items-center justify-center gap-2">
          <span className="text-rose-500 text-2xl">+</span> Yeni Çift Oluştur
        </h2>
        <p className="text-slate-500">Davetiyenizi oluşturmak için aşağıdaki temel bilgileri doldurun.</p>
      </div>

      {errorMsg && (
        <div className="bg-rose-50 text-rose-600 p-4 rounded-xl font-medium mb-6">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Gelin / Gelin Adayı</label>
            <input required type="text" value={brideName} onChange={e=>setBrideName(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Damat / Damat Adayı</label>
            <input type="text" value={groomName} onChange={e=>setGroomName(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Özel URL (Slug)</label>
            <div className="flex">
              <span className="bg-slate-100 border border-slate-300 border-r-0 px-3 py-2.5 rounded-l-lg text-slate-400 font-medium text-sm flex items-center justify-center">/</span>
              <input required type="text" value={slug} onChange={e=>setSlug(e.target.value)} placeholder="ayse-mehmet" className="w-full border border-slate-300 rounded-r-lg p-2.5 focus:ring-2 focus:ring-rose-500 focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Etkinlik Türü</label>
            <select value={eventType} onChange={e=>setEventType(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none">
                <option value="Düğün">Düğün</option>
                <option value="Nişan">Nişan</option>
                <option value="Kına">Kına</option>
                <option value="Söz">Söz</option>
                <option value="Nikah">Nikah</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Tasarım Şablonu</label>
          <select value={templateId} onChange={e=>setTemplateId(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none">
            <option value="template1">Şablon 1 (Cam Efektli & Modern)</option>
            <option value="template2">Şablon 2 (Neon Işıklı & Karanlık)</option>
            <option value="template3">Şablon 3 (Rustik & Doğa Konseptli)</option>
            <option value="template4">Şablon 4 (Kraliyet Tarzı & Lüks)</option>
            <option value="template5">Şablon 5 (Minimalist & Dergi Tasarımı)</option>
          </select>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mekan Adı</label>
            <input type="text" value={venueName} onChange={e=>setVenueName(e.target.value)} placeholder="Örn: Çırağan Sarayı" className="w-full border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tarih ve Saat</label>
            <input type="datetime-local" value={weddingDate} onChange={e=>setWeddingDate(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Açık Adres</label>
            <input type="text" value={venueAddress} onChange={e=>setVenueAddress(e.target.value)} placeholder="Beşiktaş, İstanbul" className="w-full border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Google Maps Linki</label>
            <input type="url" value={googleMapsUrl} onChange={e=>setGoogleMapsUrl(e.target.value)} placeholder="https://maps.app.goo.gl/..." className="w-full border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Çifte Özel Söz / Davet Metni</label>
          <textarea rows={3} value={customMessage} onChange={e=>setCustomMessage(e.target.value)} placeholder="Hayatımızın en özel gününde..." className="w-full border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none resize-none"></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Çift Yönetim Şifresi</label>
          <input required type="text" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Giriş yapmaları için şifre" className="w-full border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none" />
        </div>

        <div className="pt-2">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#0f172a] text-white font-bold rounded-lg hover:bg-slate-800 transition-all disabled:opacity-50 text-lg"
          >
            {isSubmitting ? 'Oluşturuluyor...' : 'URL ve Site Üret'}
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
