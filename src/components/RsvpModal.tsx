'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { X } from 'lucide-react';

interface RsvpModalProps {
  weddingId: string;
  isOpen: boolean;
  onClose: () => void;
  primaryColor?: string;
}

export default function RsvpModal({ weddingId, isOpen, onClose, primaryColor = '#f43f5e' }: RsvpModalProps) {
  const [guestName, setGuestName] = useState('');
  const [isAttending, setIsAttending] = useState<boolean | null>(null);
  const [guestCount, setGuestCount] = useState<number>(1);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isAttending === null) return alert("Lütfen katılım durumunuzu seçin.");
    
    setIsSubmitting(true);
    const { error } = await supabase.from('rsvps').insert([
      {
        wedding_id: weddingId,
        guest_name: guestName,
        is_attending: isAttending,
        guest_count: isAttending ? guestCount : 0,
        message: message
      }
    ]);

    setIsSubmitting(false);
    if (error) {
      alert("Bir hata oluştu: " + error.message);
    } else {
      // Başarılı kayıttan sonra Telegram bildirimi gönder
      try {
        await fetch('/api/telegram/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            wedding_id: weddingId,
            guest_name: guestName,
            is_attending: isAttending,
            guest_count: isAttending ? guestCount : 0,
            message: message
          })
        });
      } catch (e) {
        console.error("Telegram bildirim hatası", e);
      }

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 3000);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="p-6 text-center text-white relative" style={{ backgroundColor: primaryColor }}>
          <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold font-serif mb-1">LCV Bildirimi</h2>
          <p className="text-white/80 text-sm">Lütfen katılım durumunuzu bize bildirin</p>
        </div>

        <div className="p-8">
          {isSuccess ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Teşekkürler!</h3>
              <p className="text-slate-500">LCV bildiriminiz başarıyla bize ulaştı.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Adınız Soyadınız</label>
                <input 
                  required 
                  type="text" 
                  value={guestName} 
                  onChange={e => setGuestName(e.target.value)} 
                  placeholder="Örn: Ahmet Yılmaz" 
                  className="w-full border border-slate-200 rounded-xl p-4 bg-slate-50 text-slate-900 focus:ring-2 focus:outline-none transition-all"
                  style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Katılım Durumunuz</label>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsAttending(true)}
                    className={`py-3 rounded-xl border-2 font-bold transition-all ${isAttending === true ? 'text-white' : 'border-slate-200 text-slate-500 bg-white hover:bg-slate-50'}`}
                    style={isAttending === true ? { backgroundColor: primaryColor, borderColor: primaryColor } : {}}
                  >
                    Katılıyorum
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsAttending(false)}
                    className={`py-3 rounded-xl border-2 font-bold transition-all ${isAttending === false ? 'border-slate-800 text-slate-800 bg-slate-100' : 'border-slate-200 text-slate-500 bg-white hover:bg-slate-50'}`}
                  >
                    Katılamıyorum
                  </button>
                </div>
              </div>

              {isAttending === true && (
                <div className="animate-in slide-in-from-top-2 fade-in duration-200">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Kaç Kişi Katılacaksınız?</label>
                  <select 
                    value={guestCount} 
                    onChange={e => setGuestCount(Number(e.target.value))}
                    className="w-full border border-slate-200 rounded-xl p-4 bg-slate-50 text-slate-900 focus:outline-none"
                  >
                    <option value={1}>1 Kişi</option>
                    <option value={2}>2 Kişi</option>
                    <option value={3}>3 Kişi</option>
                    <option value={4}>4 Kişi</option>
                    <option value={5}>5 Kişi (veya daha fazla)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Mesajınız (Opsiyonel)</label>
                <textarea 
                  value={message} 
                  onChange={e => setMessage(e.target.value)} 
                  placeholder="Çifte iletmek istediğiniz özel bir notunuz var mı?" 
                  rows={3}
                  className="w-full border border-slate-200 rounded-xl p-4 bg-slate-50 text-slate-900 focus:outline-none"
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-4 text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-all disabled:opacity-50"
                style={{ backgroundColor: primaryColor, boxShadow: `0 10px 15px -3px ${primaryColor}40` }}
              >
                {isSubmitting ? 'Gönderiliyor...' : 'Yanıtı Gönder'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
