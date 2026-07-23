import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ShowcaseLab from '@/components/admin/ShowcaseLab';

export const metadata = {
  title: 'Template Showcase Lab',
};

export default async function TemplateShowcasePage({ searchParams }: { searchParams: { standalone?: string } }) {
  const { data: { session } } = await supabase.auth.getSession();
  
  // If not logged in, only allow access if strictly in dev mode AND the feature flag is enabled
  const isDevBypass = process.env.NODE_ENV === 'development' && process.env.ENABLE_TEMPLATE_SHOWCASE === 'true';
  
  if (!session && !isDevBypass) {
    redirect('/giris-yap');
  }

  const standaloneId = searchParams?.standalone;

  return <ShowcaseLab standaloneId={standaloneId} />;
}
