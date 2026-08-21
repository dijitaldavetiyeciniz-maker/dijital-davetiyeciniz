export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Dijital davetiye nedir ve misafirlerime nasıl iletebilirim?',
    answer: 'Dijital davetiye; kağıt israfını önleyen, müzikli, animasyonlu zarf açılışı, mekan yol tarifi ve anlık LCV (katılım bildirimi) toplayabilen modern bir web sitesidir. Oluşturduğunuz size özel bağlantı linkini (örneğin dijitaldavetiyeciniz.com/ayse-mehmet) WhatsApp, SMS, Instagram veya e-posta yoluyla misafirlerinize tek tıkla gönderebilirsiniz.'
  },
  {
    question: 'Davetiyemi oluşturmak ne kadar sürer ve sonradan bilgileri güncelleyebilir miyim?',
    answer: 'Davetiyenizi oluşturmak yalnızca 1-2 dakika sürer. Belirleyeceğiniz yönetim şifreniz veya e-posta hesabınızla istediğiniz zaman panele giriş yaparak tarih, saat, mekan, fotoğraf, müzik, program akışı ve tasarım renklerini dilediğiniz gibi güncelleyebilirsiniz.'
  },
  {
    question: 'LCV (Katılım Bildirimi) ve masa oturma planı nasıl çalışır?',
    answer: 'Misafirleriniz davetiyenizi açtıklarında katılım durumlarını (katılıyor / katılamıyor, kişi sayısı, özel mesaj) anında iletirler. Bu yanıtlar anında yönetim panelinize ve isterseniz bağlı Telegram botunuza bildirim olarak düşer. Ayrıca akıllı oturma planı modülü ile misafirlerinizi masalara yerleştirebilir ve QR kod ile check-in yapabilirsiniz.'
  },
  {
    question: 'Hangi etkinlik türleri için dijital davetiye oluşturabilirim?',
    answer: 'Platformumuz Düğün, Nişan, Kına Gecesi, Söz, Sünnet Düğünü, Baby Shower, Doğum Günü, Mezuniyet, Kurumsal Etkinlik, Lansman ve Özel Partiler dahil tüm davet türlerini destekler. Her etkinlik türü için özel tasarlanmış temalar, arka plan animasyonları ve mühürler bulunmaktadır.'
  },
  {
    question: 'Davetiyem ne kadar süreyle yayında kalır?',
    answer: 'Davetiyeniz etkinlik tarihinizden sonra da hatıra olarak yayında kalmaya devam eder. Misafirlerinizin paylaştığı tebrik mesajlarını, fotoğraf galerisini ve anıları dilediğiniz zaman inceleyebilir veya Excel/CSV formatında bilgisayarınıza indirebilirsiniz.'
  }
];
