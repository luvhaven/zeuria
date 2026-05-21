import { createClient } from '@/lib/supabase/server';
import type { ProductListItem, ProductDetail } from '@/data/products';

function formatPrice(price: number) {
  return `₦${price.toLocaleString()}`;
}

function mapProductListItem(p: any): ProductListItem {
  const primaryImage = p.product_images?.find((img: any) => img.is_primary)?.url || p.product_images?.[0]?.url || '';
  return {
    id: p.slug || p.id,
    badge: p.badge || null,
    image: primaryImage,
    brand: p.brand,
    category: p.category,
    name: p.name,
    price: formatPrice(p.price),
    tagline: p.tagline || '',
  };
}

export async function getProducts(): Promise<ProductListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('id, slug, badge, brand, category, name, price, tagline, product_images(url, is_primary)')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data.map(mapProductListItem);
}

export async function getFeaturedProducts(): Promise<ProductListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('id, slug, badge, brand, category, name, price, tagline, product_images(url, is_primary)')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data.map(mapProductListItem);
}

export async function getProductsByBrand(brand: string): Promise<ProductListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('id, slug, badge, brand, category, name, price, tagline, product_images(url, is_primary)')
    .eq('is_active', true)
    .ilike('brand', brand) // Use ilike for case-insensitive match
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data.map(mapProductListItem);
}

export async function getProductBySlug(slug: string): Promise<ProductDetail | null> {
  const supabase = await createClient();
  
  // Try finding by slug first, fallback to id if needed
  const { data: p, error } = await supabase
    .from('products')
    .select('*, product_images(url, is_primary, sort_order)')
    .eq('is_active', true)
    .or(`slug.eq.${slug},id.eq.${slug}`)
    .single();

  if (error || !p) return null;

  // Sort images correctly
  const sortedImages = (p.product_images || []).sort((a: any, b: any) => a.sort_order - b.sort_order);
  const primaryImage = sortedImages.find((img: any) => img.is_primary)?.url || sortedImages[0]?.url || '';

  return {
    id: p.slug || p.id,
    badge: p.badge || null,
    image: primaryImage,
    brand: p.brand,
    category: p.category,
    name: p.name,
    price: formatPrice(p.price),
    images: sortedImages.map((img: any) => img.url),
    colors: p.colors || [],
    storage_options: p.storage_options || [],
    description: p.description || '',
    tagline: p.tagline || '',
    features: p.features || [],
    specs: p.specs || [],
    reviews: [], // Reviews are not yet implemented in DB, defaulting to empty to prevent UI crashes
  };
}
