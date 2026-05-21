import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getProducts } from "@/lib/data/products";
import QuickAddButton from "@/components/QuickAddButton";

const isAccessory = (cat: string) => ["AUDIO", "WATCH", "POWER", "ACCESSORY"].includes(cat?.toUpperCase() || "");

export const metadata = {
  title: "Accessories | Zeuria",
  description: "Earbuds, chargers, watches. Everything to complete the setup.",
};

export default async function AccessoriesPage() {
  const allProducts = await getProducts();
  const accessories = allProducts.filter(p => isAccessory(p.category));
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "60px 24px" }}>
      <div style={{ marginBottom: "48px" }}>
        <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "2px", color: "#c8782a", textTransform: "uppercase", marginBottom: "12px" }}>Accessories</div>
        <h1 style={{ fontSize: "64px", fontWeight: 700, letterSpacing: "-3px", lineHeight: 1.0, marginBottom: "16px" }}>The extras.</h1>
        <p style={{ fontSize: "14px", color: "#999" }}>Earbuds, chargers, watches. Everything to complete the setup.</p>
      </div>
      <div className="grid-brand" style={{ display: "grid", gap: "16px" }}>
        {accessories.map((p) => (
          <Link href={`/shop/${p.id}`} key={p.id} style={{ textDecoration: "none" }}>
            <div className="card-hover" style={{ background: "#111", borderRadius: "12px", overflow: "hidden", position: "relative", cursor: "pointer" }}>
              <div className="arrow-reveal" style={{ position: "absolute", top: "12px", right: "12px", zIndex: 2 }}><ArrowUpRight size={14} color="#fff" /></div>
              <div style={{ width: "100%", aspectRatio: "1/1", position: "relative", background: "#080808" }}>
                <Image src={p.image} alt={p.name} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 50vw, 33vw" />
              </div>
              <div style={{ padding: "14px 16px 16px" }}>
                <div style={{ fontSize: "9px", color: "#999", letterSpacing: "0.8px", marginBottom: "4px" }}>{p.brand} · {p.category}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: "15px", fontWeight: 500, color: "#fff" }}>{p.name}</span>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "8px", color: "#888" }}>FROM</div>
                    <span style={{ fontSize: "12px", color: "#c8782a", fontWeight: 500 }}>{p.price}</span>
                  </div>
                </div>
                <QuickAddButton product={p} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
