'use client';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Mail, Lock, Eye, EyeOff, Sparkles, Heart, ArrowRight,
  Star, CheckCircle
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      setErrorMsg('E-posta veya şifre hatalı.');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a0a14 0%, #0f0f1e 50%, #0a0014 100%)' }}>
      
      {/* Animated background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #e11d48 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #9333ea 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)', filter: 'blur(60px)' }} />
        
        {/* Floating stars */}
        {mounted && Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.5 + 0.1,
              animation: `pulse ${Math.random() * 3 + 2}s ease-in-out infinite`,
              animationDelay: Math.random() * 2 + 's'
            }}
          />
        ))}
      </div>

      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center p-16">
        <div className="relative z-10 text-center max-w-md">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-3 mb-16 group">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #e11d48, #9333ea)' }}>
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">
              Dijital <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right, #fb7185, #a855f7)' }}>Davetiyeciniz</span>
            </span>
          </Link>

          {/* Main message */}
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
            Hayalinizdeki<br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right, #fb7185, #f472b6, #a855f7)' }}>
              Davetiye
            </span>
            <br />Burada.
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed mb-12">
            Dakikalar içinde hazır, zarif animasyonlarla süslenmiş, 
            mobil uyumlu dijital davetiyenizi oluşturun.
          </p>

          {/* Feature list */}
          <div className="space-y-4 text-left">
            {[
              '50+ Premium Şablon',
              'Zarf Açılış Animasyonları',
              'Telegram LCV Bildirimleri',
              'Ömür Boyu Kalıcı Link'
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: 'linear-gradient(135deg, #e11d48, #9333ea)' }}>
                  <CheckCircle className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-slate-300 text-sm font-medium">{f}</span>
              </div>
            ))}
          </div>

          {/* Decorative card preview */}
          <div className="mt-14 relative">
            <div className="rounded-2xl p-6 border backdrop-blur-xl"
              style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-4 h-4 text-rose-400" />
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Örnek Davetiye</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1 font-serif">Elif & Kerem</h3>
              <p className="text-slate-500 text-sm">15 Eylül 2026 · Çırağan Palace</p>
              <div className="mt-4 flex gap-1">
                {['#dfc384','#064e3b','#ffffff'].map((c, i) => (
                  <div key={i} className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right login panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden flex items-center gap-2 justify-center mb-10">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #e11d48, #9333ea)' }}>
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              Dijital <span className="text-rose-400">Davetiyeciniz</span>
            </span>
          </Link>

          {/* Form card */}
          <div className="rounded-3xl p-8 border backdrop-blur-2xl"
            style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}>
            
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Tekrar Hoş Geldiniz</h2>
              <p className="text-slate-400 text-sm">Hesabınıza giriş yapın ve davetiyelerinizi yönetin.</p>
            </div>

            {errorMsg && (
              <div className="rounded-2xl p-4 mb-6 border text-sm font-medium text-rose-300"
                style={{ background: 'rgba(225,29,72,0.1)', borderColor: 'rgba(225,29,72,0.2)' }}>
                ⚠️ {errorMsg}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  E-posta Adresi
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl text-white text-sm outline-none transition-all border focus:border-rose-500/50"
                    style={{ 
                      background: 'rgba(255,255,255,0.05)', 
                      borderColor: 'rgba(255,255,255,0.1)',
                      caretColor: '#e11d48'
                    }}
                    placeholder="ornek@mail.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Şifre
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3.5 rounded-xl text-white text-sm outline-none transition-all border focus:border-rose-500/50"
                    style={{ 
                      background: 'rgba(255,255,255,0.05)', 
                      borderColor: 'rgba(255,255,255,0.1)',
                      caretColor: '#e11d48'
                    }}
                    placeholder="Şifreniz"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-xl text-white font-bold text-sm tracking-wide transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #e11d48 0%, #9333ea 100%)', boxShadow: '0 10px 30px rgba(225,29,72,0.3)' }}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Giriş Yapılıyor...
                  </>
                ) : (
                  <>Giriş Yap <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 text-center border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              <p className="text-sm text-slate-500">
                Hesabınız yok mu?{' '}
                <Link href="/kayit-ol" className="text-rose-400 font-bold hover:text-rose-300 transition-colors">
                  Ücretsiz Üye Ol
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
