import Link from 'next/link';
import { Sparkles, Globe, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <>
      <footer className="text-center py-8 text-slate-500 text-sm border-t border-slate-100 mt-16 bg-white w-full">
        Sorun veya öneriniz için: <a href="mailto:dijitaldavetiyeciniz@gmail.com" className="text-rose-500 font-medium hover:underline">dijitaldavetiyeciniz@gmail.com</a>
      </footer>
      <footer className="bg-slate-950 text-slate-400 py-16 px-6 border-t border-slate-900 w-full">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-12">
          
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 text-2xl font-bold font-serif text-white mb-6">
              <Sparkles className="w-6 h-6 text-rose-500" />
              Dijital <span className="text-rose-500">Davetiyeciniz</span>
            </div>
            <p className="max-w-md leading-relaxed mb-8">
              En özel gününüzü geleceğin teknolojisiyle birleştirin. Doğayı koruyan, 
              şık ve yönetilebilir dijital davetiyelerle sevdiklerinize unutulmaz bir başlangıç yapın.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Hızlı Menü</h4>
            <ul className="space-y-3">
              <li><Link href="/nasil-calisir" className="hover:text-white transition-colors">Nasıl Çalışır?</Link></li>
              <li><Link href="/ozellikler" className="hover:text-white transition-colors">Özellikler</Link></li>
              <li><Link href="/fiyatlandirma" className="hover:text-white transition-colors">Fiyatlandırma</Link></li>
              <li><Link href="/sss" className="hover:text-white transition-colors">Sıkça Sorulan Sorular</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Yasal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-white transition-colors">Mesafeli Satış Sözleşmesi</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Gizlilik Politikası</a></li>
              <li><a href="#" className="hover:text-white transition-colors">İptal ve İade Şartları</a></li>
              <li><a href="#" className="hover:text-white transition-colors">İletişim</a></li>
            </ul>
          </div>

        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p>© {new Date().getFullYear()} Dijital Davetiyeciniz. Tüm hakları saklıdır.</p>
          <p>Sevgiyle geliştirildi ❤️</p>
        </div>
      </footer>
    </>
  );
}
