'use client';
import { useState, useEffect, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Mail, ArrowRight, RefreshCw, AlertCircle, CheckCircle2, Lock, LogOut, Sparkles } from 'lucide-react';

function VerificationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email') || '';

  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState(emailParam);
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [resendCooldown, setResendCooldown] = useState(60);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        if (!email && session.user.email) {
          setEmail(session.user.email);
        }
      }
    });
  }, [email]);

  // Cooldown countdown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Lütfen e-posta adresinizi belirtin.');
      return;
    }
    if (otpCode.trim().length !== 6) {
      setErrorMsg('Lütfen 6 haneli doğrulama kodunu eksiksiz giriniz.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), code: otpCode.trim() })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMsg('E-posta adresiniz başarıyla doğrulandı! Yönlendiriliyorsunuz...');
        setTimeout(async () => {
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('onboarding_completed')
              .eq('email', email.trim())
              .maybeSingle();

            if (profile && profile.onboarding_completed === true) {
              router.push('/dashboard');
            } else {
              router.push('/onboarding');
            }
          } catch {
            router.push('/onboarding');
          }
        }, 1000);
      } else {
        setErrorMsg(data.error || 'Doğrulama kodu geçersiz veya süresi dolmuş.');
      }
    } catch {
      setErrorMsg('Doğrulama servisine bağlanırken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || !email) return;
    setIsResending(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), userId: user?.id })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMsg('Yeni 6 haneli doğrulama kodu e-posta adresinize gönderildi.');
        setResendCooldown(60);
      } else {
        setErrorMsg(data.error || 'Yeni kod gönderilemedi. Lütfen biraz sonra tekrar deneyin.');
        if (data.retryAfter) {
          setResendCooldown(data.retryAfter);
        }
      }
    } catch {
      setErrorMsg('Kod gönderilirken bağlantı hatası oluştu.');
    } finally {
      setIsResending(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/giris-yap');
  };

  return (
    <div className="w-full max-w-md bg-[#121422]/90 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative z-10 animate-in fade-in zoom-in duration-300">
      {/* Brand & Security Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-rose-500 via-pink-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-rose-500/25">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Zorunlu Güvenlik Doğrulaması
        </div>

        <h1 className="text-2xl font-extrabold text-white font-serif mb-2">
          E-postanızı Doğrulayın
        </h1>
        <p className="text-xs text-slate-400 leading-relaxed">
          Hesabınızı aktifleştirmek ve davetiyelerinizi yönetmek için <strong className="text-rose-300 font-mono">{email || 'e-posta adresinize'}</strong> gönderilen 6 haneli kodu giriniz.
        </p>
        <div className="mt-2 text-[11px] text-slate-500">
          Gönderici: <span className="font-mono text-slate-400">dijitaldavetiyeniz@gmail.com</span>
        </div>
      </div>

      {/* Alert Messages */}
      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-3 animate-in shake">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-3">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Verification Form */}
      <form onSubmit={handleVerify} className="space-y-6">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 text-center">
            6 Haneli Doğrulama Kodu
          </label>
          <div className="relative">
            <input
              type="text"
              maxLength={6}
              required
              data-testid="verification-otp-input"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
              placeholder="••••••"
              className="w-full py-4 text-center font-mono text-3xl tracking-[0.35em] bg-black/40 border border-white/10 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 text-white rounded-2xl focus:outline-none transition-all placeholder:text-slate-600"
              autoFocus
            />
          </div>
          <p className="text-[11px] text-slate-500 text-center mt-2">
            Kod 10 dakika boyunca geçerlidir • Maksimum 5 hatalı deneme hakkı
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading || otpCode.trim().length !== 6}
          data-testid="verify-otp-btn"
          className="w-full py-4 bg-gradient-to-r from-rose-500 via-pink-600 to-indigo-600 hover:opacity-95 text-white font-bold rounded-2xl text-sm shadow-xl shadow-rose-500/25 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Hesabı Doğrula & Başla</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Resend & Cooldown */}
      <div className="mt-8 pt-6 border-t border-white/10 flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={handleResend}
          disabled={isResending || resendCooldown > 0}
          data-testid="resend-otp-btn"
          className="text-xs font-semibold text-slate-300 hover:text-rose-400 transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
          <span>
            {resendCooldown > 0
              ? `Yeniden kod gönder (${resendCooldown}s)`
              : 'Yeni Kod Gönder'}
          </span>
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer mt-2"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Farklı bir hesapla giriş yap</span>
        </button>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-[#0a0a12] flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-rose-500/30">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      <Suspense fallback={<div className="text-white text-sm">Yükleniyor...</div>}>
        <VerificationForm />
      </Suspense>
    </div>
  );
}
