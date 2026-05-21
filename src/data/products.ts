// Single source of truth for all Zeuria product data.
// Every page imports from here — no duplicates.

export type ProductListItem = {
  id: string;
  badge: string | null;
  image: string;
  brand: string;
  category: string;
  name: string;
  price: string;
  tagline?: string;
};

export type ProductDetail = ProductListItem & {
  images: string[];
  colors: string[];
  storage_options?: string[];
  description: string;
  tagline: string;
  features: { title: string; body: string; image?: string; dark?: boolean; full?: boolean }[];
  specs: { label: string; value: string }[];
  reviews: { name: string; rating: number; text: string; date: string }[];
};



export const storageOptions = ["128GB", "256GB", "512GB", "1TB"];
