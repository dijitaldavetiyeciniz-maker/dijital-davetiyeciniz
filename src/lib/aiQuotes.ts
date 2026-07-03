export const weddingQuotes = [
  "Birbirimiz için yaratıldığımızı anladığımız o ilk andan beri, hayatımızın geri kalanını birlikte geçirmek için sabırsızlanıyoruz. Bu özel günümüzde sizleri de aramızda görmekten mutluluk duyarız.",
  "Biz, hayatı birlikte paylaşmaya, aynı yolda omuz omuza yürümeye ve sonsuz bir sevgiyle birbirimize bağlanmaya evet diyoruz. Gelin bu en güzel "Evet"imize şahitlik edin.",
  "İyi günde, kötü günde, hastalıkta ve sağlıkta birbirimize destek olmaya söz verdiğimiz bu anlamlı günde, sevdiklerimizle birlikte olmak en büyük dileğimiz.",
  "Gözlerimizin ilk karşılaştığı o an, kalbimizde başlayan bu eşsiz hikayenin sonsuzluğa uzanacağı gündeyiz. En mutlu günümüzü birlikte kutlayalım.",
  "Hayatımızın en önemli imzasını atarken, sevgiyle ördüğümüz bu yuvada ilk adımlarımızı atarken siz kıymetli dostlarımızı da yanımızda istiyoruz.",
  "Aşk tesadüfleri sever, ama biz tesadüfleri aşıp kaderimizi birleştiriyoruz. Evlilik yolculuğumuzun ilk adımında bize eşlik eder misiniz?",
  "Zamanın bile durmasını istediğimiz bu anı, sonsuza kadar hatırlamak için siz sevdiklerimizle paylaşmak istiyoruz.",
  "Sadece ellerimizi değil, kalplerimizi, hayallerimizi ve geleceğimizi de birleştirdiğimiz bu özel günümüzde sizleri de aramızda görmekten onur duyacağız.",
  "Biz küçük bir masal yazmaya başladık, bu masalın en güzel bölümünü birlikte okumaya ne dersiniz?",
  "Birlikte gülmekten, birlikte hayal kurmaktan ve birlikte yaşlanmaktan asla vazgeçmeyeceğiz. Aşkımızı kutladığımız bu günde sizleri de bekliyoruz.",
  "Gökyüzündeki yıldızlar kadar parlak, denizler kadar derin aşkımızı resmiyete döktüğümüz bu özel anı, en sevdiklerimizle paylaşmak istiyoruz.",
  "Evet demek hiç bu kadar anlamlı olmamıştı. Kalplerimizin birleştiği bu büyük günde sizleri de şahitlik etmeye davet ediyoruz.",
  "Hayatın tüm güzelliklerini birlikte keşfetmek, zorlukları birlikte aşmak için yola çıkıyoruz. Bu ilk adımımızda bizimle olun.",
  "Biz bir ömür boyu mutluluğa bilet aldık. Bu özel yolculuğumuzda siz de bizimle gelir misiniz?",
  "Aşkımızın en tatlı telaşı, hayatımızın en güzel başlangıcı... Düğün törenimizde sizleri de aramızda görmekten mutluluk duyacağız."
];

export const getRandomQuote = () => {
  return weddingQuotes[Math.floor(Math.random() * weddingQuotes.length)];
};
