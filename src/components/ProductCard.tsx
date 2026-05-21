"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ProductListItem } from "@/data/products";

export default function ProductCard({ product, large = false }: { product: ProductListItem; large?: boolean }) {
  return (
    <Link href={`/shop/${product.id}`} style={{ display: "block", textDecoration: "none" }}>
      <div
        className="card-hover"
        style={{
          background: "#111",
          borderRadius: "12px",
          overflow: "hidden",
          position: "relative",
          cursor: "pointer",
          aspectRatio: large ? "4/5" : "1/1",
        }}
      >
        {product.badge && (
          <div style={{
            position: "absolute", top: "14px", left: "14px",
            background: "rgba(0,0,0,0.7)", border: "1px solid #333",
            borderRadius: "4px", padding: "3px 8px", fontSize: "10px",
            fontWeight: 600, letterSpacing: "0.8px", color: "#fff", zIndex: 2,
          }}>
            {product.badge}
          </div>
        )}

        <div className="arrow-reveal" style={{
          position: "absolute", top: "14px", right: "14px", zIndex: 2,
        }}>
          <ArrowUpRight size={16} color="#fff" />
        </div>

        <div style={{ width: "100%", height: "70%", position: "relative", background: "#0a0a0a" }}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority={true}
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>

        <div style={{ padding: "14px 16px 16px" }}>
          <div style={{ fontSize: "10px", color: "#999", letterSpacing: "0.8px", marginBottom: "4px" }}>
            {product.brand} · {product.category}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontSize: "15px", fontWeight: 500, color: "#fff" }}>{product.name}</span>
            <div>
              <div style={{ fontSize: "9px", color: "#888", textAlign: "right", marginBottom: "1px" }}>FROM</div>
              <span style={{ fontSize: "13px", color: "#c8782a", fontWeight: 500 }}>{product.price}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
