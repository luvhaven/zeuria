import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/account/dashboard', '/api/'],
      },
    ],
    sitemap: 'https://zeuria.com/sitemap.xml',
  };
}
