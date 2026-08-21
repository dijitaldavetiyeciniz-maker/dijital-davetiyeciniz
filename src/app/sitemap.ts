import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dijital-davetiyeciniz.vercel.app';
  const lastModified = new Date();

  const staticRoutes = [
    '',
    '/sablonlar',
    '/fiyatlandirma',
    '/ozellikler',
    '/nasil-calisir',
    '/sss',
    '/olustur',
    '/kayit-ol',
    '/giris-yap',
    '/gizlilik-politikasi',
    '/kullanim-kosullari',
    '/mesafeli-satis',
    '/iptal-ve-iade',
    '/cerez-politikasi',
    '/kvkk',
    '/acik-riza',
  ];

  return staticRoutes.map(route => ({
    url: `${siteUrl}${route}`,
    lastModified,
    changeFrequency: route === '' || route === '/sablonlar' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route === '/sablonlar' || route === '/olustur' ? 0.9 : 0.7,
  }));
}
