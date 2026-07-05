const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fghafzgfkkjraeopberz.supabase.co';
const supabaseAnonKey = 'sb_publishable_zZSgJpBJZDTIuemzkNonIA_m_RNaP9W';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const demoWeddings = [
  {
    slug: 'elif-kerem',
    bride_name: 'Elif Yılmaz',
    groom_name: 'Kerem Arslan',
    bride_parents: 'Ayşe & Mehmet Yılmaz',
    groom_parents: 'Fatma & Ahmet Arslan',
    wedding_date: '2026-09-12T19:30:00.000Z',
    venue_name: 'Çırağan Palace Kempinski',
    venue_address: 'Beşiktaş, İstanbul',
    event_type: 'Düğün',
    template_id: 'template1',
    primary_color: '#dfc384',
    text_color: '#064e3b',
    envelope_bg_color: 'marble-white',
    envelope_color: '#064e3b',
    seal_color: '#dfc384',
    seal_type: 'crown',
    effect_type: 'sparkles',
    custom_message: 'Hayatımızın en anlamlı gününde, sevgimizi ve mutluluğumuzu bizimle paylaşmanızdan onur duyarız.',
    admin_password: 'demo',
    is_paid: true
  },
  {
    slug: 'zeynep-mert',
    bride_name: 'Zeynep Kaya',
    groom_name: 'Mert Demir',
    bride_parents: 'Merve & Hasan Kaya',
    groom_parents: 'Sibel & Orhan Demir',
    wedding_date: '2026-09-20T18:00:00.000Z',
    venue_name: 'Polonezköy Garden',
    venue_address: 'Polonezköy, Beykoz, İstanbul',
    event_type: 'Düğün',
    template_id: 'template3',
    primary_color: '#0f766e',
    text_color: '#111827',
    envelope_bg_color: 'linen-cream',
    envelope_color: '#fef3c7',
    seal_color: '#0f766e',
    seal_type: 'leaf',
    effect_type: 'leaves',
    custom_message: 'Doğanın kucağında, sevgimizi sonsuzluğa taşırken sizleri de aramızda görmeyi çok isteriz.',
    admin_password: 'demo',
    is_paid: true
  },
  {
    slug: 'derya-can',
    bride_name: 'Derya',
    groom_name: 'Can',
    bride_parents: 'Gönül & İsmail',
    groom_parents: 'Nermin & Bülent',
    wedding_date: '2026-10-18T20:00:00.000Z',
    venue_name: 'The Marmara Taksim',
    venue_address: 'Taksim, Beyoğlu, İstanbul',
    event_type: 'Nişan',
    template_id: 'template42',
    primary_color: '#db2777',
    text_color: '#1e293b',
    envelope_bg_color: 'solid-blush',
    envelope_color: '#fce7f3',
    seal_color: '#db2777',
    seal_type: 'heart',
    effect_type: 'hearts',
    custom_message: 'Birlikteliğe adım atacağımız bu mutlu günümüzde, siz değerli dostlarımızı yanımızda görmek bizleri onurlandıracaktır.',
    admin_password: 'demo',
    is_paid: true
  },
  {
    slug: 'asli-kina',
    bride_name: "Aslı'nın Kına Gecesi",
    groom_name: '',
    bride_parents: '',
    groom_parents: '',
    wedding_date: '2026-08-22T20:30:00.000Z',
    venue_name: 'Grand Cevahir Hotel',
    venue_address: 'Şişli, İstanbul',
    event_type: 'Kına',
    template_id: 'template27',
    primary_color: '#991b1b',
    text_color: '#fef08a',
    envelope_bg_color: 'velvet-burgundy',
    envelope_color: '#991b1b',
    seal_color: '#dfc384',
    seal_type: 'rose',
    effect_type: 'confetti',
    custom_message: 'Kına geceme katılarak mutluluğumu paylaşmaya, beraber eğlenmeye ne dersiniz?',
    admin_password: 'demo',
    is_paid: true
  },
  {
    slug: 'asya-bebek',
    bride_name: 'Asya Bebek Geliyor',
    groom_name: '',
    bride_parents: 'Merve & Salih Yılmaz',
    groom_parents: '',
    wedding_date: '2026-11-15T14:00:00.000Z',
    venue_name: 'Divan İstanbul',
    venue_address: 'Şişli, İstanbul',
    event_type: 'Baby Shower',
    template_id: 'template42',
    primary_color: '#f43f5e',
    text_color: '#334155',
    envelope_bg_color: 'solid-blush',
    envelope_color: '#ffe4e6',
    seal_color: '#f43f5e',
    seal_type: 'sparkles',
    effect_type: 'stars',
    custom_message: 'Hayatımıza renk katacak olan Asya bebeğin gelişini neşe içinde kutluyoruz!',
    admin_password: 'demo',
    is_paid: true
  },
  {
    slug: 'atlas-lansman',
    bride_name: 'Atlas Innovation Night',
    groom_name: '',
    bride_parents: '',
    groom_parents: '',
    wedding_date: '2026-09-25T19:00:00.000Z',
    venue_name: 'İstanbul Fişekhane',
    venue_address: 'Zeytinburnu, İstanbul',
    event_type: 'Kurumsal Etkinlik',
    template_id: 'template2',
    primary_color: '#6366f1',
    text_color: '#ffffff',
    envelope_bg_color: 'velvet-navy',
    envelope_color: '#0f172a',
    seal_color: '#6366f1',
    seal_type: 'sparkles',
    effect_type: 'sparkles',
    custom_message: 'Geleceğin teknolojilerini tanıttığımız bu özel lansman gecesinde siz değerli iş ortaklarımızı aramızda görmekten memnuniyet duyarız.',
    admin_password: 'demo',
    is_paid: true
  }
];

async function seed() {
  console.log('Seeding demo weddings...');
  for (const item of demoWeddings) {
    // Delete existing to override
    await supabase.from('weddings').delete().eq('slug', item.slug);
    
    // Insert new
    const { data, error } = await supabase.from('weddings').insert([item]);
    if (error) {
      console.error(`Failed seeding ${item.slug}:`, error.message);
    } else {
      console.log(`Successfully seeded ${item.slug}`);
    }
  }
  console.log('Done!');
}

seed();
