import type { MetadataRoute } from 'next';
import { getProducts } from '@/lib/data/products';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://zeuria.com';
  const products = await getProducts();

  const productPages = products.map(p => ({
    url: `${base}/shop/${p.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const staticPages = [
    '/', '/shop', '/iphone', '/samsung', '/pixel', '/huawei', '/xiaomi',
    '/accessories', '/stories', '/about', '/careers', '/support', '/press',
    '/legal/terms', '/legal/privacy', '/legal/returns', '/legal/shipping',
  ].map(path => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: (path === '/' ? 'daily' : 'weekly') as 'daily' | 'weekly',
    priority: path === '/' ? 1 : 0.7,
  }));

  return [...staticPages, ...productPages];
}
