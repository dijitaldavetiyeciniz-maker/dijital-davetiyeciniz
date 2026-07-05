import Link from 'next/link';
import { 
  Sparkles, Heart, Music, Baby, ArrowRight, 
  CheckCircle2, Smartphone, MapPin, Clock, Image as ImageIcon,
  MessageCircle, HelpCircle, ChevronDown, CheckCircle, Globe
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-rose-200 scroll-smooth">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-2xl font-bold font-serif text-slate-800">
            <Sparkles className="w-6 h-6 text-rose-500" />
            Dijital <span className="text-rose-500">Davetiyeciniz</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-bold text-slate-600">
            <a href="#nasil-calisir" className="hover:text-rose-500 transition-colors">Nasıl Çalışır?</a>
            <a href="#ozellikler" className="hover:text-rose-500 transition-colors">Özellikler</a>
            <a href="#fiyatlandirma" className="hover:text-rose-500 transition-colors">Fiyatlandırma</a>
            <a href="#sss" className="hover:text-rose-500 transition-colors">S.S.S.</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/giris-yap" className="text-sm font-bold text-slate-600 hover:text-rose-500 transition-colors hidden sm:block">
              Giriş Yap
            </Link>
            <Link href="/kayit-ol" className="text-sm font-bold bg-slate-900 text-white px-6 py-2.5 rounded-full hover:bg-slate-800 transition-all hover:scale-105 shadow-lg shadow-slate-200">
              Ücretsiz Başla
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 px-6 overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rose-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-rose-100/80 backdrop-blur-sm text-rose-600 px-5 py-2 rounded-full text-sm font-bold mb-8 shadow-sm">
            <Sparkles className="w-4 h-4" /> Yeni Nesil Dijital Davetiye Platformu
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.1]">
            Davetiyenizi <br className="hidden md:block"/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400">
              Dijitale Taşıyın.
            </span>
          </h1>
          
          <p className="text-lg md:text-2xl text-slate-500 mb-10 max-w-3xl mx-auto leading-relaxed">
            Kağıt masrafına son! Düğün, nişan veya baby shower etkinlikleriniz için <strong>dakikalar içinde</strong> çarpıcı bir web sitesi oluşturun, misafirlerinize tek tıkla gönderin.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/kayit-ol" className="bg-rose-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-rose-600 hover:-translate-y-1 transition-all shadow-xl shadow-rose-200/50 flex items-center justify-center gap-2">
              Davetiyeni Oluştur <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/demo-cift" className="bg-white text-slate-800 border-2 border-slate-200 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 hover:-translate-y-1 transition-all flex items-center justify-center">
              Canlı Demoyu İncele
            </Link>
          </div>
          <div className="mt-6 text-sm text-slate-400 font-medium">Kredi kartı gerekmez. Anında tasarımınızı yapın.</div>
        </div>
      </section>

      {/* Nasıl Çalışır? */}
      <section id="nasil-calisir" className="py-24 bg-white px-6 border-y border-slate-100">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Sadece A, B, C Kadar Kolay</h2>
          <p className="text-slate-500 max-w-2xl mx-auto mb-16 text-lg">Hiçbir teknik veya tasarım bilgisine ihtiyacınız yok. Sisteminizi sadece 3 adımda canlıya alın.</p>

          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 bg-slate-100 -z-10"></div>
            
            <div className="bg-slate-50 rounded-3xl p-8 relative">
              <div className="w-16 h-16 bg-white border border-slate-100 shadow-xl rounded-2xl flex items-center justify-center text-2xl font-bold text-slate-800 mx-auto -mt-16 mb-6">1</div>
              <h3 className="text-2xl font-bold mb-3">Şablon Seçin</h3>
              <p className="text-slate-500">Etkinliğinize uygun, profesyonelce tasarlanmış konseptlerimizden birini seçerek başlayın.</p>
            </div>

            <div className="bg-slate-50 rounded-3xl p-8 relative">
              <div className="w-16 h-16 bg-white border border-slate-100 shadow-xl rounded-2xl flex items-center justify-center text-2xl font-bold text-slate-800 mx-auto -mt-16 mb-6">2</div>
              <h3 className="text-2xl font-bold mb-3">Kişiselleştirin</h3>
              <p className="text-slate-500">Yönetim panelinizden fotoğraflarınızı yükleyin, tarih ve konum detaylarınızı ekleyin.</p>
            </div>

            <div className="bg-slate-50 rounded-3xl p-8 relative">
              <div className="w-16 h-16 bg-rose-500 shadow-xl shadow-rose-200 rounded-2xl flex items-center justify-center text-2xl font-bold text-white mx-auto -mt-16 mb-6">3</div>
              <h3 className="text-2xl font-bold mb-3">Paylaşın</h3>
              <p className="text-slate-500">Tek seferlik ödemenizi yapın, size özel URL'nizi tüm sevdiklerinize saniyeler içinde gönderin.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Özellikler Grid */}
      <section id="ozellikler" className="py-24 px-6 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500 rounded-full mix-blend-screen filter blur-[120px] opacity-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-screen filter blur-[120px] opacity-20" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Bir Davetiyeden Çok Daha Fazlası</h2>
            <p className="text-slate-300 max-w-2xl mx-auto text-lg">Özel gününüzde işinizi kolaylaştıracak tüm dijital asistan özelliklerini tek bir sayfaya sığdırdık.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 bg-rose-500/20 text-rose-400 rounded-xl flex items-center justify-center mb-6">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Mobil Uyumlu Tasarım</h3>
              <p className="text-slate-400 leading-relaxed">Tüm telefon, tablet ve bilgisayarlarda kusursuz çalışan, zarf animasyonlu göz alıcı arayüz.</p>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center mb-6">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Harita Entegrasyonu</h3>
              <p className="text-slate-400 leading-relaxed">Misafirlerinizin mekanı ararken kaybolmaması için Google Maps yönlendirmesi ile tek tıkla navigasyon.</p>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center mb-6">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Canlı LCV & Bildirimler</h3>
              <p className="text-slate-400 leading-relaxed">Misafirleriniz katılım durumunu bildirdiği an, Telegram üzerinden cep telefonunuza anında bildirim gelir.</p>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center mb-6">
                <ImageIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Sınırsız Fotoğraf (CDN)</h3>
              <p className="text-slate-400 leading-relaxed">Kendi fotoğraflarınızı sınırsız ve ücretsiz olarak arkaplan yapabileceğiniz özel Telegram altyapısı.</p>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 bg-orange-500/20 text-orange-400 rounded-xl flex items-center justify-center mb-6">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Canlı Geri Sayım</h3>
              <p className="text-slate-400 leading-relaxed">Etkinlik gününüze saniyeler kala heyecanı hissettiren şık ve dinamik geri sayım sayacı.</p>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center mb-6">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Sonsuz Kullanım</h3>
              <p className="text-slate-400 leading-relaxed">Davetiyeniz bir defa yayınlandıktan sonra sonsuza dek size ait olan URL'de hatıra olarak kalır.</p>
            </div>

          </div>
        </div>
      </section>

      {/* Fiyatlandırma */}
      <section id="fiyatlandirma" className="py-24 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Sade ve Şeffaf Fiyatlandırma</h2>
            <p className="text-slate-500 text-lg">Aylık ücret yok, gizli masraf yok. Her şey dahil tek bir paket.</p>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl" />
            
            <div className="flex flex-col md:flex-row gap-12 items-center relative z-10">
              <div className="flex-1 text-center md:text-left">
                <div className="inline-block bg-rose-100 text-rose-600 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
                  Tüm Özellikler Dahil Paketi
                </div>
                <h3 className="text-4xl font-bold mb-2">Limit Yok, Sınır Yok</h3>
                <p className="text-slate-500 mb-8">Etkinlik gününüze kadar ve sonrasında sınırsız kullanım hakkı. Yüzlerce kişiye tek tıkla gönderin.</p>
                
                <div className="flex items-baseline justify-center md:justify-start gap-2 mb-8">
                  <span className="text-6xl font-black text-slate-800">₺499</span>
                  <span className="text-slate-400 font-medium">/ Tek Seferlik</span>
                </div>

                <Link href="/kayit-ol" className="block w-full text-center bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200">
                  Hemen Tasarımını Yap
                </Link>
                <p className="text-xs text-center text-slate-400 mt-4">Tasarımınızı tamamen ücretsiz oluşturup önizleyebilirsiniz. Sadece yayınlarken ödeme yaparsınız.</p>
              </div>

              <div className="flex-1 w-full bg-slate-50 rounded-3xl p-8 border border-slate-100">
                <ul className="space-y-4">
                  {[
                    "Tüm Premium Şablonlara Erişim",
                    "Zarf Açılış Animasyonu",
                    "Mobil ve Masaüstü Kusursuz Görünüm",
                    "Telegram ile Anında LCV Bildirimleri",
                    "Sınırsız Fotoğraf Barındırma",
                    "Google Maps Yönlendirmesi",
                    "Canlı Geri Sayım Aracı",
                    "Ömür Boyu Kalıcı URL"
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SSS */}
      <section id="sss" className="py-24 px-6 bg-white border-y border-slate-100">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-50 rounded-full mb-6">
              <HelpCircle className="w-8 h-8 text-slate-400" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Sıkça Sorulan Sorular</h2>
            <p className="text-slate-500">Aklınıza takılan soruların cevaplarını burada bulabilirsiniz.</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Ödemeyi ne zaman yapıyorum?",
                a: "Hayalinizdeki davetiyeyi oluşturup önizlemesini gördükten sonra, davetiyeyi aktif edip misafirlerinize göndermeye başlamak için tek seferlik ödeme yaparsınız. Önizleme tamamen ücretsizdir."
              },
              {
                q: "Yayınladıktan sonra değişiklik yapabilir miyim?",
                a: "Elbette! Dijital Davetiyeciniz'in en büyük avantajı budur. Davetiyeniz canlıdayken bile yönetim panelinize girip tarih, mekan, arkaplan fotoğrafı veya metinleri saniyeler içinde değiştirebilirsiniz. Linki alan herkes anında güncel halini görür."
              },
              {
                q: "Kağıt davetiye ile birlikte kullanabilir miyim?",
                a: "Kesinlikle. Satın alımdan sonra size özel verilen URL'nizi (örneğin: site.com/ayse-mehmet) QR koda dönüştürüp kağıt davetiyenizin üzerine bastırabilirsiniz."
              },
              {
                q: "Fotoğraflarım veya verilerim silinir mi?",
                a: "Hayır. Gelişmiş Telegram CDN altyapımız sayesinde verileriniz sınırsız ve güvenli bir şekilde saklanır. Etkinliğiniz bittikten sonra bile siteniz dijital bir hatıra olarak yayında kalmaya devam eder."
              },
              {
                q: "LCV (Katılım) bildirimleri nasıl çalışıyor?",
                a: "Yönetim panelinize Telegram bot bilgilerinizi girdiğinizde sistem otomatik olarak bağlanır. Misafirleriniz davetiyenizdeki 'Katılıyorum' formunu doldurduğu an, kendi cep telefonunuza anlık olarak isim ve kişi sayısı mesajı gelir."
              }
            ].map((item, i) => (
              <details key={i} className="group bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between p-6 font-bold cursor-pointer text-slate-800">
                  {item.q}
                  <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-6 text-slate-500 leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Footer */}
      <footer className="text-center py-8 text-slate-500 text-sm border-t border-slate-100 mt-16">
        Sorun veya öneriniz için: <a href="mailto:dijitaldavetiyeciniz@gmail.com" className="text-rose-500 font-medium hover:underline">dijitaldavetiyeciniz@gmail.com</a>
      </footer>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-16 px-6 border-t border-slate-900">
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
              <li><a href="#nasil-calisir" className="hover:text-white transition-colors">Nasıl Çalışır?</a></li>
              <li><a href="#ozellikler" className="hover:text-white transition-colors">Özellikler</a></li>
              <li><a href="#fiyatlandirma" className="hover:text-white transition-colors">Fiyatlandırma</a></li>
              <li><a href="#sss" className="hover:text-white transition-colors">Sıkça Sorulan Sorular</a></li>
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

    </div>
  );
}
