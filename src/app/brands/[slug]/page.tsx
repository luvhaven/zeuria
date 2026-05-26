import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getProductsByBrand } from "@/lib/data/products";
import QuickAddButton from "@/components/QuickAddButton";
import { notFound } from "next/navigation";

const isAccessory = (cat: string) => ["AUDIO", "WATCH", "POWER", "ACCESSORY"].includes(cat?.toUpperCase() || "");

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const brand = params.slug.charAt(0).toUpperCase() + params.slug.slice(1);
  return {
    title: `${brand} | Zeuria`,
    description: `Engineered by ${brand}. Sold in Naira.`,
  };
}

export default async function BrandPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const brandSlug = params.slug;
  const allProducts = await getProductsByBrand(brandSlug.toUpperCase());

  if (!allProducts || allProducts.length === 0) {
    notFound();
  }

  const brandPhones = allProducts.filter(p => !isAccessory(p.category));
  const brandName = brandSlug.charAt(0).toUpperCase() + brandSlug.slice(1);

  return (
    <div style={{ maxWidth: "var(--max-w, 1380px)", margin: "0 auto", padding: "clamp(64px, 10vw, 96px) clamp(16px, 5vw, 64px)" }}>
      <div style={{ marginBottom: "clamp(32px, 5vw, 64px)" }}>
        <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "2px", color: "#c8782a", textTransform: "uppercase", marginBottom: "12px" }}>
          {brandName}
        </div>
        <h1 style={{ fontSize: "clamp(48px, 8vw, 80px)", fontWeight: 800, letterSpacing: "clamp(-2px, -0.04em, -4px)", lineHeight: 1.0, marginBottom: "16px" }}>
          {brandName}.
        </h1>
        <p style={{ fontSize: "clamp(14px, 2vw, 16px)", color: "#999" }}>
          Engineered by <span style={{ color: "#ccc" }}>{brandName}</span>. Sold in <span style={{ color: "#ccc" }}>Naira</span>.
        </p>
      </div>
      <div className="grid-brand" style={{ display: "grid", gap: "16px" }}>
        {brandPhones.map((p) => (
          <Link href={`/shop/${p.id}`} key={p.id} style={{ textDecoration: "none" }}>
            <div className="card-hover" style={{ background: "#111", borderRadius: "12px", overflow: "hidden", position: "relative", cursor: "pointer" }}>
              {p.badge && (
                <div style={{ position: "absolute", top: "12px", left: "12px", background: "rgba(0,0,0,0.7)", border: "1px solid #333", borderRadius: "4px", padding: "3px 8px", fontSize: "9px", fontWeight: 600, letterSpacing: "0.8px", color: "#fff", zIndex: 2 }}>
                  {p.badge}
                </div>
              )}
              <div className="arrow-reveal" style={{ position: "absolute", top: "12px", right: "12px", zIndex: 2 }}>
                <ArrowUpRight size={14} color="#fff" />
              </div>
              <div style={{ width: "100%", aspectRatio: "1/1", position: "relative", background: "#080808" }}>
                <Image src={p.image} alt={p.name} fill priority={true} style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <div style={{ padding: "14px 16px 16px" }}>
                <div style={{ fontSize: "9px", color: "#999", letterSpacing: "0.8px", marginBottom: "4px" }}>
                  {p.brand} · {p.category}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: "15px", fontWeight: 500, color: "#fff" }}>{p.name}</span>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "8px", color: "#888" }}>FROM</div>
                    <span style={{ fontSize: "12px", color: "#c8782a", fontWeight: 500 }}>{p.price}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
