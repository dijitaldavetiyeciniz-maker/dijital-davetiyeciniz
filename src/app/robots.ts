import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dijital-davetiyeciniz.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/super-admin/',
          '/*/admin/',
          '/dashboard/',
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
