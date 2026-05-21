import HomePageClient from "@/components/HomePageClient";
import { getFeaturedProducts } from "@/lib/data/products";

export const metadata = {
  title: "Zeuria | Premium Technology Distributor",
  description: "Zeuria is dedicated exclusively to the distribution of pristine, factory-sealed devices. The future of tech, delivered in Lagos.",
};

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  // Top 4 featured items power the "New Arrivals" section
  const arrivals = featured.slice(0, 4);

  return <HomePageClient arrivals={arrivals} featured={featured} />;
}
