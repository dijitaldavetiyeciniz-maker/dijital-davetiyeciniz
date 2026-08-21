'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { eventJourneyConfigs, getEventJourneyConfig } from '@/data/eventJourneyConfig';
import { isEmailVerified } from '@/lib/auth-guard';
import { Sparkles, Calendar, MapPin, ArrowRight, ArrowLeft, CheckCircle2, Heart, Award, Gift, Compass, ShieldCheck, Flame, Stars } from 'lucide-react';

const eventTypeIcons: Record<string, any> = {
  wedding: Heart,
  engagement: Sparkles,
  henna: Flame,
  circumcision: Award,
  babyshower: Gift,
  birthday: Gift,
  corporate: Compass,
  graduation: Award,
  special: Stars
};

const stylePresets = [
  { id: 'romantic', label: 'Romantik', desc: 'Sıcak tonlar, çiçeksi ve zarif çizgiler', tag: 'romantic', color: 'from-rose-500 to-pink-500' },
  { id: 'modern', label: 'Modern & Şık', desc: 'Temiz tipografi, ferah ve çağdaş estetik', tag: 'modern', color: 'from-indigo-500 to-purple-500' },
  { id: 'minimal', label: 'Minimalist', desc: 'Sade, göz yormayan, asil monokrom detaylar', tag: 'minimal', color: 'from-slate-600 to-slate-800' },
  { id: 'classic', label: 'Klasik & Saray', desc: 'Altın varaklar, kraliyet armaları ve mühürler', tag: 'luxury', color: 'from-amber-500 to-yellow-600' },
  { id: 'cinematic', label: 'Sinematik', desc: 'Koyu zeminler, film afişi havasında derinlik', tag: 'dark', color: 'from-violet-600 to-fuchsia-600' },
  { id: 'natural', label: 'Bohem & Doğa', desc: 'Toprak tonları, pampas ve kır bahçesi', tag: 'boho', color: 'from-emerald-600 to-teal-600' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Wizard Steps: 1 -> 2 -> 3 -> 4
  const [step, setStep] = useState(1);

  // Form State
  const [selectedEventType, setSelectedEventType] = useState('wedding');
  const [primaryName, setPrimaryName] = useState('');
  const [secondaryName, setSecondaryName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('19:00');
  const [venueName, setVenueName] = useState('');
  const [venueAddress, setVenueAddress] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('romantic');
  const [selectedTemplate, setSelectedTemplate] = useState('template1');

  // Verify auth on mount
  useEffect(() => {
    async function checkAuthAndVerification() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/giris-yap');
        return;
      }

      setUser(session.user);

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (!isEmailVerified(session.user, profile)) {
          router.push(`/dogrula?email=${encodeURIComponent(session.user.email || '')}`);
          return;
        }

        if (profile?.onboarding_completed) {
          // If already completed, user can still proceed or visit dashboard
        }
      } catch (err) {
        console.error('Profile check error:', err);
      } finally {
        setLoading(false);
      }
    }
    checkAuthAndVerification();
  }, [router]);

  const currentJourney = getEventJourneyConfig(selectedEventType);
  const subjectLabels = currentJourney.subjectLabels;

  // Recommended templates based on event and style
  const getRecommendedTemplates = () => {
    if (selectedEventType === 'corporate') {
      return [
        { id: 'template2', name: 'Executive Dark', type: 'Kurumsal Gala', color: '#1e1b4b', desc: 'Gece mavisi ve altın detaylar' },
        { id: 'template8', name: 'Modern Summit', type: 'Lansman & Zirve', color: '#0f172a', desc: 'Minimal kurumsal tipografi' },
        { id: 'template15', name: 'Tech Conference', type: 'Seminer', color: '#18181b', desc: 'Çağdaş grid yerleşim' },
      ];
    }
    if (selectedEventType === 'babyshower') {
      return [
        { id: 'template6', name: 'Baby Cloud', type: 'Baby Shower', color: '#f43f5e', desc: 'Pastel pembe ve gökyüzü teması' },
        { id: 'template16', name: 'Little Star', type: 'Hoş Geldin Bebek', color: '#0ea5e9', desc: 'Yumuşak mavi ve yıldızlar' },
        { id: 'template31', name: 'Sweet Carousel', type: 'Kutlama', color: '#a855f7', desc: 'Zarif illüstrasyon ve mühür' },
      ];
    }
    if (selectedEventType === 'henna') {
      return [
        { id: 'template12', name: 'Bordo Sultan', type: 'Kına Gecesi', color: '#881337', desc: 'Asil bordo ve kadife zarf' },
        { id: 'template27', name: 'Gül Suyu & Varak', type: 'Geleneksel Kına', color: '#9f1239', desc: 'Özel oryantal altın motifler' },
        { id: 'template42', name: 'Gece Parıltısı', type: 'Modern Kına', color: '#4c0519', desc: 'Karanlık ve büyüleyici' },
      ];
    }
    if (selectedEventType === 'circumcision') {
      return [
        { id: 'template3', name: 'Şehzade Tacı', type: 'Sünnet Töreni', color: '#0369a1', desc: 'Kraliyet mavisi ve tuğra mühür' },
        { id: 'template13', name: 'Altın Hilal', type: 'Geleneksel Sünnet', color: '#1e3a8a', desc: 'Klasik altın varak tasarımı' },
        { id: 'template23', name: 'Mavi Saray', type: 'Sünnet Düğünü', color: '#0284c7', desc: 'Zarif saray motifi' },
      ];
    }
    // Default Wedding / Engagement / Other
    return [
      { id: 'template1', name: 'Royal Gold & Emerald', type: 'Lüks Düğün', color: '#064e3b', desc: 'Zümrüt yeşili ve parlak altın varak' },
      { id: 'template5', name: 'Rose Petals & Silk', type: 'Romantik Nişan', color: '#be123c', desc: 'Gül yaprakları ve mühürlü zarf' },
      { id: 'template11', name: 'Pure Minimalist Ivory', type: 'Modern Düğün', color: '#1e293b', desc: 'Monokrom sade şıklık' },
      { id: 'template21', name: 'Boho Terracotta', type: 'Kır Düğünü', color: '#c2410c', desc: 'Pampas esintisi ve kraft zarf' },
    ];
  };

  const handleFinishOnboarding = async () => {
    if (!user) return;
    setSubmitting(true);

    try {
      const slug = `davetiye-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
      const combinedDateTime = eventDate ? `${eventDate}T${eventTime || '19:00'}:00` : new Date().toISOString();

      // 1. Initial Draft Payload (Strictly Taslak / is_published: false)
      const baseDraft = {
        user_id: user.id,
        slug,
        title: primaryName && secondaryName ? `${primaryName} & ${secondaryName}` : primaryName || 'Davetiyemiz',
        event_type: selectedEventType,
        bride_name: primaryName.trim(),
        groom_name: secondaryName.trim(),
        wedding_date: combinedDateTime,
        venue_name: venueName.trim() || 'Belirtilmedi',
        venue_address: venueAddress.trim(),
        template_id: selectedTemplate,
        is_paid: true, // Allow initial draft editing
        is_active: true,
        custom_overrides: {
          is_published: false,
          has_unpublished_changes: false,
          draft_revision: 1
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      let newWedding: any = null;
      const { data: fullData, error: fullError } = await supabase
        .from('weddings')
        .insert([{
          ...baseDraft,
          is_published: false,
          published_snapshot: null,
          has_unpublished_changes: false,
          draft_revision: 1
        }])
        .select()
        .single();

      if (fullError) {
        const { data: fbData, error: fbError } = await supabase
          .from('weddings')
          .insert([baseDraft])
          .select()
          .single();
        if (fbError) throw fbError;
        newWedding = fbData;
      } else {
        newWedding = fullData;
      }

      // 2. Mark onboarding completed in profile
      try {
        await supabase
          .from('profiles')
          .update({ onboarding_completed: true, onboarding_step: 4 })
          .eq('id', user.id);
      } catch (profileErr) {
        console.warn('Profile update warning:', profileErr);
      }

      // 3. Create initial version record
      try {
        if (newWedding) {
          await supabase.from('invitation_versions').insert([
            {
              wedding_id: newWedding.id,
              version_number: 1,
              version_type: 'initial_draft',
              is_published: false,
              summary: 'İlk Taslak Kurulumu',
              snapshot: baseDraft,
              created_by: user.id
            }
          ]);
        }
      } catch {}

      // Redirect to Couple Admin Editor
      router.push(`/${newWedding?.slug || slug}/admin`);
    } catch (err: any) {
      alert('Davetiye taslağı oluşturulurken bir hata oluştu: ' + err.message);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center text-white text-sm">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
          <span>Kurulum yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white flex flex-col font-sans selection:bg-rose-500/30">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-rose-600/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[100px]" />
      </div>

      {/* Header with Step Progress */}
      <header className="relative z-10 border-b border-white/10 px-6 py-4 backdrop-blur-xl bg-black/30">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-serif text-lg font-bold">
            <Sparkles className="w-5 h-5 text-rose-500" />
            <span>Dijital Davetiyeniz <span className="text-xs text-rose-400 font-sans uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20">Kurulum</span></span>
          </div>

          {/* Stepper Dots */}
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white ring-4 ring-rose-500/20' :
                  step > s ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400' :
                  'bg-white/5 border border-white/10 text-slate-500'
                }`}>
                  {step > s ? '✓' : s}
                </div>
                {s < 4 && <div className={`w-4 sm:w-8 h-[2px] ${step > s ? 'bg-emerald-500/50' : 'bg-white/10'}`} />}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Main Wizard Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 relative z-10">
        <div className="w-full max-w-3xl bg-[#121424]/90 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-2xl animate-fade-in">
          
          {/* STEP 1: EVENT SELECTION */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 border border-rose-500/20 text-rose-400 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" /> Adım 1 / 4
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white">Ne için davetiye hazırlıyorsunuz?</h1>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                  Etkinlik türünüze özel hazırlanmış animasyonlar, metinler ve özellikler otomatik tanımlanır.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {Object.entries(eventJourneyConfigs).map(([key, item]) => {
                  const Icon = eventTypeIcons[key] || Sparkles;
                  const isSelected = selectedEventType === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedEventType(key)}
                      className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                        isSelected 
                          ? 'bg-rose-500/15 border-rose-500 text-white shadow-lg shadow-rose-500/10 scale-[1.02]' 
                          : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${
                        isSelected ? 'bg-rose-500 text-white' : 'bg-white/10 text-slate-400'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-white">{item.label}</div>
                        <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{item.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-rose-500/25 cursor-pointer"
                >
                  <span>Devam Et</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: EVENT BASICS */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 border border-rose-500/20 text-rose-400 uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5" /> Adım 2 / 4
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">{currentJourney.label} Temel Bilgileri</h2>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                  Davetiyenizin başlığında ve sayaçlarında yer alacak temel bilgileri girin. (Daha sonra dilediğiniz gibi güncelleyebilirsiniz).
                </p>
              </div>

              <div className="space-y-4 pt-2">
                {/* Names / Titles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      {subjectLabels.primaryName}
                    </label>
                    <input
                      type="text"
                      required
                      value={primaryName}
                      onChange={(e) => setPrimaryName(e.target.value)}
                      placeholder={selectedEventType === 'corporate' ? 'Örn: Yıl Sonu Gala Gecesi' : 'Örn: Zeynep'}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-rose-500 focus:outline-none transition-all"
                    />
                  </div>

                  {subjectLabels.secondaryName && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        {subjectLabels.secondaryName}
                      </label>
                      <input
                        type="text"
                        value={secondaryName}
                        onChange={(e) => setSecondaryName(e.target.value)}
                        placeholder="Örn: Emirhan"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-rose-500 focus:outline-none transition-all"
                      />
                    </div>
                  )}
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      {subjectLabels.eventDate}
                    </label>
                    <input
                      type="date"
                      required
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full px-4 py-3 bg-[#181a2e] border border-white/10 rounded-xl text-white text-sm focus:border-rose-500 focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      {subjectLabels.eventTime}
                    </label>
                    <input
                      type="time"
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                      className="w-full px-4 py-3 bg-[#181a2e] border border-white/10 rounded-xl text-white text-sm focus:border-rose-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Venue Name & Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      {subjectLabels.venueName}
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={venueName}
                        onChange={(e) => setVenueName(e.target.value)}
                        placeholder="Örn: Çırağan Sarayı"
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-rose-500 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Şehir / İlçe (Opsiyonel)
                    </label>
                    <input
                      type="text"
                      value={venueAddress}
                      onChange={(e) => setVenueAddress(e.target.value)}
                      placeholder="Örn: Beşiktaş / İstanbul"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-rose-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-3 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-sm font-semibold flex items-center gap-2 border border-white/10 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Geri</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!primaryName.trim()) {
                      alert(`Lütfen ${subjectLabels.primaryName} alanını doldurun.`);
                      return;
                    }
                    setStep(3);
                  }}
                  className="px-6 py-3.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-rose-500/25 cursor-pointer"
                >
                  <span>Devam Et</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: STYLE PREFERENCES */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 border border-rose-500/20 text-rose-400 uppercase tracking-wider">
                  <Compass className="w-3.5 h-3.5" /> Adım 3 / 4
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">Tasarım Tarzınızı Seçin</h2>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                  Beğendiğiniz görsel stili seçin, size en uygun şablonları öne çıkaralım.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {stylePresets.map((style) => {
                  const isSelected = selectedStyle === style.id;
                  return (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setSelectedStyle(style.id)}
                      className={`p-4 rounded-2xl border text-left transition-all flex items-start justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-rose-500/15 border-rose-500 text-white shadow-lg shadow-rose-500/10 scale-[1.01]'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${style.color}`} />
                          <span className="font-bold text-sm text-white">{style.label}</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{style.desc}</p>
                      </div>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-rose-400 shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>

              <div className="pt-6 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-3 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-sm font-semibold flex items-center gap-2 border border-white/10 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Geri</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-6 py-3.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-rose-500/25 cursor-pointer"
                >
                  <span>Şablonları Gör</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: TEMPLATE RECOMMENDATION & DRAFT CREATION */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" /> Son Adım — Şablon Seçimi
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">Size Özel Önerilen Tasarımlar</h2>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                  Davetiyeniz başlangıçta <strong>Taslak</strong> olarak oluşturulur. Canlıya almak için düzenleyicide &quot;Yayınla&quot; butonuna basmanız gerekecektir.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {getRecommendedTemplates().map((tpl) => {
                  const isSelected = selectedTemplate === tpl.id;
                  return (
                    <div
                      key={tpl.id}
                      onClick={() => setSelectedTemplate(tpl.id)}
                      className={`rounded-2xl border p-4 transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-gradient-to-b from-rose-500/20 to-black/40 border-rose-500 ring-2 ring-rose-500/30'
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div>
                        {/* Mock Card Preview Header */}
                        <div 
                          className="h-28 rounded-xl mb-3 flex items-center justify-center relative overflow-hidden border border-white/10"
                          style={{ backgroundColor: tpl.color }}
                        >
                          <div className="text-center px-2">
                            <span className="text-[11px] font-mono uppercase tracking-widest text-white/70 block">{tpl.id}</span>
                            <span className="font-serif text-sm font-bold text-white block mt-0.5">{tpl.name}</span>
                          </div>
                          {isSelected && (
                            <div className="absolute top-2 right-2 bg-rose-500 text-white p-1 rounded-full">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>

                        <div className="font-bold text-sm text-white mb-1">{tpl.name}</div>
                        <div className="text-xs text-slate-400 mb-2">{tpl.desc}</div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTemplate(tpl.id);
                        }}
                        className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-rose-500 text-white'
                            : 'bg-white/10 text-slate-300 hover:bg-white/15'
                        }`}
                      >
                        {isSelected ? 'Seçildi' : 'Seç'}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Davetiyeniz <strong>güvenli taslak</strong> modunda oluşturulacak. Dilediğiniz zaman tüm renkleri, fotoğrafları ve müzikleri değiştirebilirsiniz.</span>
                </div>
              </div>

              <div className="pt-6 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={submitting}
                  className="px-5 py-3 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-sm font-semibold flex items-center gap-2 border border-white/10 cursor-pointer disabled:opacity-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Geri</span>
                </button>

                <button
                  type="button"
                  onClick={handleFinishOnboarding}
                  disabled={submitting}
                  className="px-8 py-4 bg-gradient-to-r from-rose-500 via-pink-600 to-indigo-600 hover:opacity-95 text-white font-bold rounded-2xl text-sm flex items-center gap-2 shadow-xl shadow-rose-500/30 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Taslak Hazırlanıyor...</span>
                    </div>
                  ) : (
                    <>
                      <span>Bununla Başla & Düzenle</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
