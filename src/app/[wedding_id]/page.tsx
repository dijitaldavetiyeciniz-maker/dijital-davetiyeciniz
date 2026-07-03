import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Template1 from '@/components/templates/Template1';
import Template2 from '@/components/templates/Template2';
import Template3 from '@/components/templates/Template3';
import Template4 from '@/components/templates/Template4';
import Template5 from '@/components/templates/Template5';

// Next.js App Router Page
export default async function WeddingPage({
  params,
}: {
  params: Promise<{ wedding_id: string }>;
}) {
  const { wedding_id } = await params;

  // Supabase'den veriyi çekiyoruz
  const { data: wedding, error } = await supabase
    .from('weddings')
    .select('*')
    .eq('slug', wedding_id)
    .single();

  // Eğer url yanlışsa veya böyle bir düğün yoksa 404 sayfası göster
  if (error || !wedding) {
    notFound();
  }

  // Veritabanından gelen template_id değerine göre uygun şablonu render et.
  switch (wedding.template_id) {
    case 'template1':
      return <Template1 wedding={wedding} />;
    case 'template2':
      return <Template2 wedding={wedding} />;
    case 'template3':
      return <Template3 wedding={wedding} />;
    case 'template4':
      return <Template4 wedding={wedding} />;
    case 'template5':
      return <Template5 wedding={wedding} />;
    default:
      return <Template1 wedding={wedding} />;
  }
}
