import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dijital-davetiyeciniz.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/fiyatlandirma',
          '/sablonlar',
          '/nasil-calisir',
          '/ozellikler',
          '/sss',
          '/iletisim',
          '/demo',
          '/kvkk',
          '/gizlilik-politikasi',
          '/kullanim-kosullari',
          '/cerez-politikasi',
          '/mesafeli-satis',
          '/iptal-ve-iade'
        ],
        disallow: [
          '/dashboard/',
          '/super-admin/',
          '/onboarding/',
          '/dogrula',
          '/giris-yap',
          '/kayit-ol',
          '/api/',
          '/*/admin'
        ]
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`
  };
}
