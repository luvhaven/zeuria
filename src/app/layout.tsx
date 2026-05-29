import type { Metadata, Viewport } from "next";
import { Inter_Tight, Fraunces } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartProvider from "@/components/CartProvider";
import { SmoothScroll } from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import TransitionLayout from "@/components/TransitionLayout";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import { Toaster } from "react-hot-toast";
import { ViewTransitions } from "next-view-transitions";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const interTight = Inter_Tight({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"], display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], weight: ["400", "500"], display: "swap" });

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#020303",
};

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
    <ViewTransitions>
      <html lang="en" className={`${interTight.style.fontFamily} ${fraunces.style.fontFamily}`}>
        <head>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
          <style dangerouslySetInnerHTML={{
            __html: `
            :root {
              --sans: ${interTight.style.fontFamily}, ui-sans-serif, system-ui, -apple-system, sans-serif;
              --serif: ${fraunces.style.fontFamily}, Georgia, serif;
            }
          `}} />
        </head>
        <body>
          <SmoothScroll>
            <CartProvider>
              <AnalyticsProvider />
              <Navbar products={products} />
              <TransitionLayout>
                <main>{children}</main>
              </TransitionLayout>
              <Footer />
              <Toaster
                position="bottom-left"
                toastOptions={{
                  style: {
                    background: 'var(--panel)',
                    color: 'var(--text)',
                    border: '1px solid var(--line)',
                    borderRadius: '16px',
                    fontSize: '13px',
                    fontFamily: 'var(--sans)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
                    padding: '12px 16px',
                  },
                  success: { iconTheme: { primary: 'var(--gold)', secondary: '#000' } },
                  error: { iconTheme: { primary: '#ef4444', secondary: '#000' } },
                }}
              />
            </CartProvider>
            <CustomCursor />
          </SmoothScroll>
        </body>
      </html>
    </ViewTransitions>
  );
}
