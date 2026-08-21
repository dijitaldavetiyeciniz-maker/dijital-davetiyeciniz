'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, Mail, Lock, ArrowRight, User, Phone, MapPin, Building, ChevronDown, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneCountryCode, setPhoneCountryCode] = useState('+90');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [city, setCity] = useState('İstanbul');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Phone validator
  const formatPhone = (val: string) => {
    // Only numbers
    const cleaned = val.replace(/\D/g, '');
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    if (cleaned.length <= 8) return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhoneNumber(formatted);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (!firstName.trim() || !lastName.trim()) {
      setIsLoading(false);
      setErrorMsg('Lütfen adınızı ve soyadınızı girin.');
      return;
    }

    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setIsLoading(false);
      setErrorMsg('Lütfen geçerli bir telefon numarası girin (Örn: 555 123 45 67).');
      return;
    }

    const fullPhone = `${phoneCountryCode} ${phoneNumber}`.trim();

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            phone: fullPhone,
            city: city.trim(),
            address: address.trim(),
            country: 'Türkiye'
          }
        }
      });

      if (error) {
        let trMessage = error.message;
        if (error.message.includes('User already registered')) {
          trMessage = 'Bu e-posta adresi ile zaten kayıt olunmuş. Lütfen Giriş Yap sayfasına gidin.';
        } else if (error.message.includes('Password should be at least')) {
          trMessage = 'Şifreniz en az 6 karakter olmalıdır.';
        } else if (error.message.includes('rate limit')) {
          trMessage = 'Çok fazla deneme yaptınız. Lütfen biraz bekleyip tekrar deneyin.';
        } else if (error.message.includes('Email link is invalid')) {
          trMessage = 'E-posta onay linki geçersiz veya süresi dolmuş.';
        }
        setIsLoading(false);
        setErrorMsg(trMessage);
        return;
      }

      // Sync to profiles table
      if (data.user) {
        try {
          await supabase.from('profiles').upsert([
            {
              id: data.user.id,
              email: data.user.email,
              first_name: firstName.trim(),
              last_name: lastName.trim(),
              phone: fullPhone,
              country: 'Türkiye',
              city: city.trim(),
              address: address.trim(),
              created_at: data.user.created_at || new Date().toISOString()
            }
          ], { onConflict: 'id' });
        } catch (syncErr) {
          console.warn('Profile sync optional warning:', syncErr);
        }
      }

      setIsLoading(false);

      if (data.session) {
        router.push('/dashboard');
      } else {
        setSuccessMsg('Kayıt başarılı! E-posta adresinize gelen doğrulama bağlantısına tıklayarak hesabınızı aktif edebilirsiniz.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err.message || 'Kayıt sırasında bir hata oluştu.');
    }
  };

  const turkishCities = [
    'Adana', 'Ankara', 'Antalya', 'Bursa', 'Eskişehir', 'Gaziantep', 'İstanbul', 'İzmir',
    'Kayseri', 'Kocaeli', 'Konya', 'Mersin', 'Muğla', 'Sakarya', 'Samsun', 'Trabzon', 'Diğer'
  ];

  return (
    <div className="min-h-screen bg-[#0a0a12] flex overflow-hidden relative selection:bg-rose-500/30">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-rose-500/20 rounded-full mix-blend-screen filter blur-[120px] opacity-50 animate-pulse pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-pink-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-pulse pointer-events-none" />

      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-5/12 flex-col justify-between p-12 relative z-10 border-r border-white/10 bg-white/5 backdrop-blur-3xl">
        <Link href="/" className="flex items-center gap-2 text-3xl font-bold font-serif text-white hover:opacity-85 transition-opacity w-fit">
          <Sparkles className="w-8 h-8 text-rose-500" />
          Dijital <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600">Davetiyeciniz</span>
        </Link>
        <div className="mb-20">
          <div className="inline-flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 text-rose-400 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
            ✨ Hızlı & Ücretsiz Üyelik
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-6 font-serif leading-tight">
            En Özel Gününüzü <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300">
              Kusursuz Kılın.
            </span>
          </h2>
          <p className="text-slate-400 text-base max-w-md leading-relaxed mb-8">
            2 dakikada hesabınızı oluşturun, 120+ göz alıcı şablon arasından dilediğinizi seçip hemen canlı önizleyin.
          </p>

          <div className="space-y-3">
            {[
              'Kredi kartı gerekmez, ücretsiz tasarım oluşturma',
              'Anlık LCV katılım bildirimleri ve masa planı',
              'Ömür boyu kalıcı dijital hatıra linki'
            ].map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-slate-300 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-slate-500">© 2026 Dijital Davetiyeciniz. Tüm hakları saklıdır.</p>
      </div>

      {/* Right Panel - Register Form */}
      <div className="w-full lg:w-7/12 flex flex-col justify-center items-center p-6 sm:p-10 relative z-10 overflow-y-auto max-h-screen">
        <div className="w-full max-w-xl my-8">
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2 text-3xl font-bold font-serif text-white">
              <Sparkles className="w-8 h-8 text-rose-500" />
              Dijital <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600">Davetiyeciniz</span>
            </Link>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl shadow-rose-500/10 border border-white/10 p-6 sm:p-10 relative overflow-hidden">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2 font-serif">Hesap Oluştur</h1>
              <p className="text-slate-400 text-sm">
                Zaten hesabınız var mı?{' '}
                <Link href="/giris-yap" className="text-rose-400 hover:text-rose-300 font-semibold hover:underline">
                  Giriş Yap
                </Link>
              </p>
            </div>

            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm text-center">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm text-center">
                {successMsg}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-5">
              {/* Ad Soyad */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Ad</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Adınız"
                      className="w-full pl-10 pr-3.5 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder:text-slate-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 focus:outline-none text-sm transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Soyad</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Soyadınız"
                      className="w-full pl-10 pr-3.5 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder:text-slate-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 focus:outline-none text-sm transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* E-posta */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">E-posta Adresi</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@domain.com"
                    className="w-full pl-10 pr-3.5 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder:text-slate-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 focus:outline-none text-sm transition-all"
                  />
                </div>
              </div>

              {/* Telefon Numarası (Ülke kodu destekli) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Telefon Numarası</label>
                <div className="flex gap-2">
                  <div className="relative w-28 shrink-0">
                    <select
                      value={phoneCountryCode}
                      onChange={(e) => setPhoneCountryCode(e.target.value)}
                      className="w-full py-3 px-3 border border-white/10 rounded-xl bg-[#141424] text-white text-sm focus:border-rose-500 focus:outline-none appearance-none cursor-pointer"
                    >
                      <option value="+90">🇹🇷 +90</option>
                      <option value="+49">🇩🇪 +49</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+33">🇫🇷 +33</option>
                      <option value="+31">🇳🇱 +31</option>
                      <option value="+994">🇦🇿 +994</option>
                      <option value="+971">🇦🇪 +971</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <div className="relative flex-1">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      placeholder="555 123 45 67"
                      maxLength={14}
                      className="w-full pl-10 pr-3.5 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder:text-slate-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 focus:outline-none text-sm transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Adres Bilgileri: Şehir & Açık Adres */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Şehir</label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full pl-10 pr-8 py-3 border border-white/10 rounded-xl bg-[#141424] text-white text-sm focus:border-rose-500 focus:outline-none appearance-none cursor-pointer"
                    >
                      {turkishCities.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Açık Adres (İsteğe Bağlı)</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="İlçe / Mahalle / Cadde"
                      className="w-full pl-10 pr-3.5 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder:text-slate-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 focus:outline-none text-sm transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Şifre */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Şifre</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="En az 6 karakter"
                    className="w-full pl-10 pr-3.5 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder:text-slate-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 focus:outline-none text-sm transition-all"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white font-bold py-3.5 rounded-xl hover:opacity-95 transition-all shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 text-sm disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Ücretsiz Hesabımı Oluştur</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-center text-slate-400 leading-relaxed pt-2">
                Kayıt olarak <Link href="/kullanim-kosullari" className="underline hover:text-white">Kullanım Koşulları</Link> ve <Link href="/gizlilik-politikasi" className="underline hover:text-white">Gizlilik Politikası</Link>'nı kabul etmiş olursunuz.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
