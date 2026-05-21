import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/ProductDetailClient";
import { getProductBySlug, getProductsByBrand } from "@/lib/data/products";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  
  if (!product) return { title: "Not Found" };
  
  return {
    title: `${product.name} | Zeuria`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Fetch related products (same brand, excluding current)
  const brandProducts = await getProductsByBrand(product.brand);
  const related = brandProducts.filter((p) => p.id !== product.id).slice(0, 3);

  return <ProductDetailClient product={product} related={related} />;
}
