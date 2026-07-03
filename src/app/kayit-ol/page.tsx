'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, Mail, Lock } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      if (data.session) {
        // Başarılıysa doğrudan giriş ekranına veya dashboard'a at
        router.push('/dashboard');
      } else {
        setErrorMsg('Kayıt başarılı! Lütfen e-posta adresinize gelen onay linkine tıklayın. (Spam/Gereksiz kutusunu kontrol etmeyi unutmayın)');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6">
      <Link href="/" className="flex items-center gap-2 text-2xl font-bold font-serif text-slate-800 mb-8 hover:opacity-80 transition-opacity">
        <Sparkles className="w-6 h-6 text-rose-500" />
        Dijital <span className="text-rose-500">Davetiyeciniz</span>
      </Link>

      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Aramıza Katıl</h1>
          <p className="text-slate-500 text-sm">Ücretsiz hesabını oluştur ve davetiyeni tasarlamaya başla.</p>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 text-rose-600 p-4 rounded-xl text-sm font-medium mb-6">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">E-posta Adresi</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                required 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none transition-all"
                placeholder="ornek@mail.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Şifre</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                required 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none transition-all"
                placeholder="En az 6 karakter"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors disabled:opacity-50 mt-4"
          >
            {isLoading ? 'Hesap Oluşturuluyor...' : 'Kayıt Ol'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500">
          Zaten hesabın var mı? <Link href="/giris-yap" className="text-rose-500 font-bold hover:underline">Giriş Yap</Link>
        </div>
      </div>
    </div>
  );
}
