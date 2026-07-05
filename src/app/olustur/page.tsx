'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Sparkles, Link as LinkIcon, KeyRound, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';

function CreateForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultTemplateId = searchParams.get('templateId') || 'template1';

  // State Variables
  const [eventType, setEventType] = useState('Düğün');
  const [slug, setSlug] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Password Visibility States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status & Validation States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [user, setUser] = useState<any>(null);
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [isSlugAvailable, setIsSlugAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/kayit-ol');
      } else {
        setUser(session.user);
      }
    });
  }, [router]);

  // Turkish char normalizer & Slug generator helper
  const convertTurkishToEnglishSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/ç/g, 'c')
      .replace(/ğ/g, 'g')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ş/g, 's')
      .replace(/ü/g, 'u')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-');
  };

  const handleSlugChange = async (val: string) => {
    const cleanVal = convertTurkishToEnglishSlug(val);
    setSlug(cleanVal);

    if (cleanVal.length < 3) {
      setIsSlugAvailable(null);
      return;
    }

    setIsCheckingSlug(true);
    try {
      const { data, error } = await supabase
        .from('weddings')
        .select('id')
        .eq('slug', cleanVal)
        .maybeSingle();

      if (error) {
        console.error('Error checking slug:', error);
      }

      if (data) {
        setIsSlugAvailable(false);
      } else {
        setIsSlugAvailable(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsCheckingSlug(false);
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    const cleanSlug = slug.trim().toLowerCase();

    // 1. Password Match Validation
    if (password !== confirmPassword) {
      setErrorMsg('Belirlediğiniz şifreler birbiriyle uyuşmuyor. Lütfen kontrol edin.');
      setIsSubmitting(false);
      return;
    }

    if (password.length < 4) {
      setErrorMsg('Şifreniz en az 4 karakterden oluşmalıdır.');
      setIsSubmitting(false);
      return;
    }

    // 2. Slug Check Validation
    const { data: existingData } = await supabase
      .from('weddings')
      .select('id')
      .eq('slug', cleanSlug)
      .maybeSingle();

    if (existingData) {
      setErrorMsg('Bu link daha önce alınmış. Lütfen farklı bir link deneyin.');
      setIsSlugAvailable(false);
      setIsSubmitting(false);
      return;
    }

    // Insert Default Values into DB
    const { error } = await supabase.from('weddings').insert([
      {
        user_id: user?.id,
        user_email: user?.email,
        bride_name: 'Gelin',
        groom_name: 'Damat',
        bride_parents: '',
        groom_parents: '',
        slug: cleanSlug,
        template_id: defaultTemplateId,
        admin_password: password,
        event_type: eventType,
        venue_name: '',
        wedding_date: null,
        venue_address: '',
        google_maps_url: '',
        custom_message: '',
        is_paid: false
      }
    ]);

    setIsSubmitting(false);

    if (!error) {
      router.push(`/d/${cleanSlug}/admin`);
    } else {
      setErrorMsg('Kayıt oluşturulurken bir hata oluştu: ' + error.message);
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-slate-100 shadow-2xl relative overflow-hidden">
      {/* Decorative Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-rose-400 via-pink-500 to-indigo-500"></div>

      <div className="text-center mb-10 pt-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-50 text-rose-500 rounded-full mb-4 shadow-inner">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-800 mb-2 font-serif">
          Yeni Davetiyeni Oluştur
        </h2>
        <p className="text-slate-500 text-sm">
          Sadece 3 adımda sitenizi hazırlayın, detayları daha sonra yönetim panelinden istediğiniz gibi düzenleyebilirsiniz.
        </p>
      </div>

      {errorMsg && (
        <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl font-medium mb-8 text-sm flex items-start gap-2 border border-rose-100">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* STEP A: EVENT TYPE */}
        <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100/80">
          <label className="block text-base font-bold text-slate-800 mb-2">
            A. Etkinlik türünüz nedir?
          </label>
          <p className="text-xs text-slate-400 mb-4">Size en uygun tasarımsal ön ayarları hazırlamamıza yardımcı olur.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              'Düğün', 'Nişan', 'Kına', 'Söz', 'Baby Shower', 
              'Doğum Günü', 'Kurumsal Etkinlik', 'Açılış / Lansman', 'Diğer'
            ].map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setEventType(type)}
                className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${
                  eventType === type 
                    ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-200' 
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* STEP B: SLUG URL */}
        <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100/80">
          <label className="block text-base font-bold text-slate-800 mb-1.5 flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-slate-400" /> B. Davetiyenizin linki ne olsun?
          </label>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            Bu alan, misafirlerinizle paylaşacağınız özel davetiye bağlantısıdır. Örneğin: <span className="font-semibold text-slate-700">ayse-mehmet</span>
          </p>

          <div className="relative">
            <div className="flex rounded-xl shadow-sm border border-slate-200 overflow-hidden bg-white focus-within:ring-2 focus-within:ring-rose-500 focus-within:border-transparent transition-all">
              <span className="bg-slate-100 px-4 py-3 text-slate-500 font-mono text-sm border-r border-slate-200 select-none flex items-center">
                https://dijital-davetiyeciniz.vercel.app/d/
              </span>
              <input
                required
                type="text"
                value={slug}
                onChange={e => handleSlugChange(e.target.value)}
                placeholder="gelin-damat"
                className="flex-1 px-4 py-3 bg-white font-mono text-sm focus:outline-none text-slate-800"
              />
            </div>

            {/* Realtime Slug Availability Feedback */}
            <div className="mt-3 flex items-center justify-between px-1">
              <p className="text-[11px] text-slate-400">
                Türkçe karakterler otomatik dönüştürülür.
              </p>
              {slug && (
                <div className="text-xs font-semibold">
                  {isCheckingSlug ? (
                    <span className="text-slate-400">Kontrol ediliyor...</span>
                  ) : isSlugAvailable === true ? (
                    <span className="text-emerald-600 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Link Müsait
                    </span>
                  ) : isSlugAvailable === false ? (
                    <span className="text-rose-600 flex items-center gap-1 font-bold">
                      <AlertCircle className="w-3.5 h-3.5" /> Bu link daha önce alınmış.
                    </span>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* STEP C: MANAGEMENT PASSWORD */}
        <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100/80">
          <label className="block text-base font-bold text-slate-800 mb-1.5 flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-slate-400" /> C. Yönetim paneli şifrenizi belirleyin
          </label>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            Bu şifreyle davetiyenizi daha sonra düzenleyebilir, LCV listesini ve ayarları yönetebilirsiniz.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Yönetim Şifresi</label>
              <div className="relative">
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="En az 4 karakter"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 pr-10 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Şifreyi Tekrar Girin</label>
              <div className="relative">
                <input
                  required
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Şifreyi onaylayın"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 pr-10 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
          {password && confirmPassword && (
            <div className="mt-3 px-1">
              {password === confirmPassword ? (
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Şifreler uyuşuyor
                </span>
              ) : (
                <span className="text-[11px] text-rose-500 font-semibold flex items-center gap-1">
                  ⚠️ Şifreler henüz uyuşmuyor
                </span>
              )}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button 
            type="submit" 
            disabled={isSubmitting || isSlugAvailable === false || isCheckingSlug}
            className="w-full py-4 bg-slate-900 text-white font-extrabold rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50 text-base shadow-lg shadow-slate-200 flex items-center justify-center gap-2"
          >
            {isSubmitting ? 'Davetiyeniz Hazırlanıyor...' : 'Kurulumu Tamamla & Tasarıma Başla →'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <Link href="/dashboard" className="text-sm font-bold text-slate-500 hover:text-rose-500 transition-colors mb-8 inline-block flex items-center gap-1.5">
          &larr; Yönetim Paneline Dön
        </Link>
        
        {/* Suspense is required when using useSearchParams in Next.js App Router */}
        <Suspense fallback={<div className="text-center p-20 text-slate-500">Yükleniyor...</div>}>
          <CreateForm />
        </Suspense>
      </div>
    </div>
  );
}
