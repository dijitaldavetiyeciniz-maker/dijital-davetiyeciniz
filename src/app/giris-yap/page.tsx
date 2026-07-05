'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, Mail, Lock } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 relative">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-100/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none" />

      <Link href="/" className="flex items-center gap-2 text-2xl font-bold font-serif text-slate-800 mb-8 hover:opacity-85 transition-opacity relative z-10">
        <Sparkles className="w-6 h-6 text-rose-500" />
        Dijital <span className="text-rose-500">Davetiyeciniz</span>
      </Link>

      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 md:p-10 border border-slate-200/60 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-slate-800 mb-2 font-serif">Giriş Yap</h1>
          <p className="text-slate-400 text-sm">Davetiyenizi yönetmek için sisteme giriş yapın.</p>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-2xl text-xs font-semibold mb-6">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">E-posta Adresi</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                required 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 focus:outline-none transition-all duration-200 text-sm autofill:bg-white autofill:text-slate-800 autofill:shadow-[0_0_0_30px_white_inset] [&:-webkit-autofill]:bg-white [&:-webkit-autofill]:text-slate-800"
                placeholder="ornek@mail.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Şifre</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                required 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 focus:outline-none transition-all duration-200 text-sm autofill:bg-white autofill:text-slate-800 autofill:shadow-[0_0_0_30px_white_inset] [&:-webkit-autofill]:bg-white [&:-webkit-autofill]:text-slate-800"
                placeholder="Şifreniz"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-600 transition-all hover:shadow-lg hover:shadow-rose-100 disabled:opacity-50 mt-6 text-sm"
          >
            {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500 border-t border-slate-100 pt-6">
          Hesabınız yok mu? <Link href="/kayit-ol" className="text-rose-500 font-bold hover:underline">Üye Ol</Link>
        </div>
      </div>
    </div>
  );
}
