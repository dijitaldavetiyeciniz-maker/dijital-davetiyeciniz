import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Template1 from '@/components/templates/Template1';

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
  // İleride buraya Template2, Template3 eklenebilir.
  if (wedding.template_id === 'template1') {
    return <Template1 wedding={wedding} />;
  }

  // Eğer bilinmeyen bir şablon girilmişse varsayılan olarak Template1 göster.
  return <Template1 wedding={wedding} />;
}
