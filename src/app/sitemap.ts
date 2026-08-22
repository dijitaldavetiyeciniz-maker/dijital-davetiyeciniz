import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dijital-davetiyeciniz.vercel.app';
  const now = new Date().toISOString();

  const publicRoutes = [
    { url: `${baseUrl}`, priority: 1.0, changeFrequency: 'daily' as const },
    { url: `${baseUrl}/fiyatlandirma`, priority: 0.9, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/sablonlar`, priority: 0.9, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/nasil-calisir`, priority: 0.8, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/ozellikler`, priority: 0.8, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/sss`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/iletisim`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/demo`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/kvkk`, priority: 0.3, changeFrequency: 'yearly' as const },
    { url: `${baseUrl}/gizlilik-politikasi`, priority: 0.3, changeFrequency: 'yearly' as const },
    { url: `${baseUrl}/kullanim-kosullari`, priority: 0.3, changeFrequency: 'yearly' as const },
    { url: `${baseUrl}/cerez-politikasi`, priority: 0.3, changeFrequency: 'yearly' as const },
    { url: `${baseUrl}/mesafeli-satis`, priority: 0.3, changeFrequency: 'yearly' as const },
    { url: `${baseUrl}/iptal-ve-iade`, priority: 0.3, changeFrequency: 'yearly' as const }
  ];

  return publicRoutes.map(r => ({
    url: r.url,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority
  }));
}
