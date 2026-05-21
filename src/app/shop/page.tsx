import ShopPageClient from "@/components/ShopPageClient";
import { getProducts } from "@/lib/data/products";

export const metadata = {
  title: "Shop All | Zeuria",
  description: "Browse the latest flagship devices and accessories from Zeuria.",
};

export default async function ShopPage() {
  const products = await getProducts();
  return <ShopPageClient products={products} />;
}
