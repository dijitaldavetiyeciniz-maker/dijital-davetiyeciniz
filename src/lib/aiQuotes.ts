export const weddingQuotes = [
  "Birbirimiz için yaratıldığımızı anladığımız o ilk andan beri, hayatımızın geri kalanını birlikte geçirmek için sabırsızlanıyoruz. Bu özel günümüzde sizleri de aramızda görmekten mutluluk duyarız.",
  "Biz, hayatı birlikte paylaşmaya, aynı yolda omuz omuza yürümeye ve sonsuz bir sevgiyle birbirimize bağlanmaya evet diyoruz. Gelin bu en güzel 'Evet'imize şahitlik edin.",
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

export const guestAttendingMessages = [
  "Canım arkadaşlarım {bride} & {groom}, hayatınızın bu en mutlu gününde yanınızda olmaktan çok büyük gurur ve mutluluk duyuyorum. Sevginiz hep bugünkü gibi taze kalsın, bir ömür boyu mutluluklar!",
  "Bu harika aşk masalının en güzel sayfasına şahitlik etmek için sabırsızlanıyorum. Bir ömür boyu birbirinize sevgiyle bakmanız dileğiyle!",
  "Yolunuz hep çiçeklerle, sevgiyle ve kahkahalarla dolu olsun. Evliliğinizin size sağlık, huzur ve bolca şans getirmesini dilerim. Sonsuz mutluluklar!",
  "İki güzel kalbin bir araya gelmesiyle başlayan bu yolculukta her şey gönlünüzce olsun. Bu özel günde yanınızda olmak benim için harika bir his. Tebrik ederim!",
  "Bir ömür boyu sürecek ortaklığınızın ilk gününde yanınızda olmaktan çok mutluyum. Aşkınız daim, yuvanız huzur dolsun.",
  "Sevginizin ömür boyu bir bahar gibi taze ve çiçekli kalması dileğiyle. Tebrik ederim, mutluluğunuz sonsuz olsun! {guest}",
  "Hayatın tüm güzelliklerini, neşesini ve huzurunu birlikte paylaşacağınız harika bir evlilik dilerim. Ömür boyu mutluluklar!",
  "Gözlerinizdeki bu güzel ışığın hiç sönmemesi dileğiyle. Evliliğinizi en içten dileklerimle tebrik eder, sonsuz mutluluklar dilerim.",
  "Bir ömür aynı yastıkta, sevgiyle ve saygıyla kocaman bir hayat yaşamanız dileğiyle. Tebrikler, her şey gönlünüzce olsun!",
  "Aşkınızın büyüklüğüne ve bu güzel birleşime şahit olmak harika olacak. Yuvanız neşeyle dolsun, sonsuz sevgiler!"
];

export const guestNotAttendingMessages = [
  "Çok istememe rağmen bu özel günde yanınızda olamayacağım için üzgünüm. Ancak kalbim sizinle. {bride} & {groom}, bir ömür boyu sonsuz mutluluklar dilerim!",
  "Fiziken orada olamasam da, bu mutlu gününüzün coşkusunu yürekten paylaşıyorum. Sevginiz bir ömür boyu eksilmesin, her şey gönlünüzce olsun!",
  "Bu anlamlı güne katılamadığım için üzgünüm. Yuvanızın hep neşeyle ve sevgiyle dolmasını dilerim. Tebrikler, sonsuz mutluluklar!",
  "Yeni hayatınızın başlangıcında yanınızda olamasam da en içten dileklerimi gönderiyorum. Her gününüz birbirinizi daha çok severek geçsin.",
  "Özel nedenlerden ötürü düğün töreninizde bulunamayacağım, ancak sevgimin ve dualarımın sizinle olduğunu bilmenizi isterim. Ömür boyu mutluluklar!",
  "Bu eşsiz başlangıçta yanınızda olamadığım için üzgünüm. Bir ömür boyu huzur, neşe ve sevgi dolu bir yaşam dilerim. Tebrikler! {guest}"
];

export const getRandomGuestMessage = (isAttending: boolean, guestName: string, brideName: string, groomName: string) => {
  const pool = isAttending ? guestAttendingMessages : guestNotAttendingMessages;
  const raw = pool[Math.floor(Math.random() * pool.length)];
  return raw
    .replace(/{bride}/g, brideName || 'Gelin')
    .replace(/{groom}/g, groomName || 'Damat')
    .replace(/{guest}/g, guestName ? `- ${guestName}` : '');
};
