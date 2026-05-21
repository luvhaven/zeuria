import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartProvider from "@/components/CartProvider";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Toaster } from "react-hot-toast";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const { data } = await supabase.from('site_settings').select('key, value');
  const settings: Record<string, string> = {};
  if (data) data.forEach(d => { if (d.value) settings[d.key] = d.value; });

  const siteName = settings.site_name || "Zeuria";
  const tagLine = settings.site_tagline || "The Smartest Way to Buy a Premium Phone in Nigeria";

  return {
    title: {
      default: `${siteName} – ${tagLine}`,
      template: `%s | ${siteName}`,
    },
    description: "Buy 100% genuine iPhones, Samsung, Pixel, Huawei & Xiaomi phones in Nigeria. Fast 24–72hr delivery, fully insured transit, and a world-class buying experience.",
    keywords: ["buy iphone nigeria", "buy samsung nigeria", "pixel phone nigeria", "premium phones nigeria", "zeuria", "buy phone online nigeria"],
    authors: [{ name: siteName }],
    creator: `${siteName} Devices Ltd`,
    publisher: `${siteName} Devices Ltd`,
    metadataBase: new URL("https://zeuria.com"),
    openGraph: {
      title: `${siteName} – ${tagLine}`,
      description: "100% genuine phones. 24–72hr insured delivery. iPhone, Samsung, Pixel & more.",
      siteName: siteName,
      locale: "en_NG",
      type: "website",
      images: [{ url: settings.og_image_url || "/og-default.jpg", width: 1200, height: 630, alt: `${siteName} – Premium Phones in Nigeria` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteName} – Premium Phones in Nigeria`,
      description: "100% genuine phones. 24–72hr insured delivery.",
    },
    robots: { index: true, follow: true },
    icons: { icon: settings.favicon_url || "/favicon.ico", apple: "/apple-touch-icon.png" },
    manifest: "/site.webmanifest",
  };
}

import { getProducts } from "@/lib/data/products";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Zeuria",
    url: "https://zeuria.com",
    logo: "https://zeuria.com/logo.png",
    description: "100% genuine iPhones, Samsung & more. Delivered insured to your door in 24–72 hours.",
    address: { "@type": "PostalAddress", addressLocality: "Lagos", addressCountry: "NG" },
    contactPoint: { "@type": "ContactPoint", email: "hello@zeuria.com", contactType: "customer support" },
    sameAs: ["https://instagram.com/zeuria", "https://twitter.com/zeuria"],
  };

  const products = await getProducts();

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;1,14..32,300;1,14..32,400&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <SmoothScroll>
          <CartProvider>
            <Navbar products={products} />
            <main>{children}</main>
            <Footer />
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: { background: '#111', color: '#fff', border: '1px solid #222', fontSize: '13px', borderRadius: '10px' },
                success: { iconTheme: { primary: '#22c55e', secondary: '#000' } },
                error: { iconTheme: { primary: '#ef4444', secondary: '#000' } },
              }}
            />
          </CartProvider>
        </SmoothScroll>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </body>
    </html>
  );
}
