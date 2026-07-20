'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, Mail, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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
    <div className="min-h-screen bg-[#0a0a12] flex overflow-hidden relative">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-rose-500/20 rounded-full mix-blend-screen filter blur-[120px] opacity-50 animate-pulse pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-pink-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-pulse pointer-events-none" />

      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative z-10 border-r border-white/10 bg-white/5 backdrop-blur-3xl">
        <Link href="/" className="flex items-center gap-2 text-3xl font-bold font-serif text-white hover:opacity-85 transition-opacity w-fit">
          <Sparkles className="w-8 h-8 text-rose-500" />
          Dijital <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600">Davetiyeciniz</span>
        </Link>
        <div className="mb-20">
          <h2 className="text-5xl font-extrabold text-white mb-6 font-serif leading-tight">
            Premium <br/> Dijital Davetiye <br/> Deneyimi.
          </h2>
          <p className="text-slate-400 text-lg max-w-md">
            Özel anlarınızı en şık ve zarif şekilde sevdiklerinizle paylaşın.
          </p>
        </div>
      </div>

      {/* Right Panel - Login */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 relative z-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex justify-center mb-10">
            <Link href="/" className="flex items-center gap-2 text-3xl font-bold font-serif text-white">
              <Sparkles className="w-8 h-8 text-rose-500" />
              Dijital <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600">Davetiyeciniz</span>
            </Link>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl shadow-rose-500/10 border border-white/10 p-8 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-rose-500/20 to-transparent rounded-bl-full pointer-events-none" />
            
            <div className="text-center mb-8 relative z-10">
              <h1 className="text-3xl font-extrabold text-white mb-2 font-serif">Tekrar Hoş Geldiniz</h1>
              <p className="text-slate-400 text-sm">Davetiyelerinizi yönetmek için giriş yapın.</p>
            </div>

            {errorMsg && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-2xl text-xs font-semibold mb-6 backdrop-blur-sm">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6 relative z-10">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">E-posta Adresi</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                  <input 
                    required 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/20 focus:outline-none transition-all duration-300 text-sm"
                    placeholder="ornek@mail.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Şifre</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                  <input 
                    required 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/20 focus:outline-none transition-all duration-300 text-sm"
                    placeholder="Şifreniz"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl font-bold hover:from-rose-600 hover:to-pink-700 transition-all hover:shadow-[0_0_20px_rgba(244,63,94,0.4)] disabled:opacity-50 mt-2 text-sm flex items-center justify-center gap-2 group"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Giriş Yapılıyor...
                  </span>
                ) : (
                  <>Giriş Yap <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-slate-400 border-t border-white/10 pt-6">
              Hesabınız yok mu? <Link href="/kayit-ol" className="text-rose-400 font-bold hover:text-rose-300 hover:underline transition-colors">Üye Ol</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
