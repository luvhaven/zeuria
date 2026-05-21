"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { ProductListItem } from "@/data/products";
import QuickAddButton from "@/components/QuickAddButton";

const categories = ["All", "iPhone", "Samsung", "Pixel", "Huawei", "Xiaomi", "Accessories"];

const isAccessory = (cat: string) => ["AUDIO", "WATCH", "POWER", "ACCESSORY"].includes(cat?.toUpperCase() || "");

export default function ShopPageClient({ products }: { products: ProductListItem[] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");

  const filteredProducts = products.filter(p => {
    if (activeCategory === "All") return true;
    if (activeCategory === "Accessories") return isAccessory(p.category);
    if (activeCategory === "iPhone") return p.brand === "APPLE" && !isAccessory(p.category);
    if (activeCategory === "Samsung") return p.brand === "SAMSUNG" && !isAccessory(p.category);
    if (activeCategory === "Pixel") return p.brand === "GOOGLE" && !isAccessory(p.category);
    if (activeCategory === "Huawei") return p.brand === "HUAWEI" && !isAccessory(p.category);
    if (activeCategory === "Xiaomi") return p.brand === "XIAOMI" && !isAccessory(p.category);
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const pA = parseInt(a.price.replace(/[₦,]/g, ""));
    const pB = parseInt(b.price.replace(/[₦,]/g, ""));
    if (sortBy === "price_asc") return pA - pB;
    if (sortBy === "price_desc") return pB - pA;
    return 0; // featured
  });

  return (
    <div style={{ maxWidth: "1200px", margin: "120px auto 80px", padding: "0 24px" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 style={{ fontSize: "56px", fontWeight: 700, letterSpacing: "-2px", marginBottom: "32px" }}>
          Shop <span style={{ color: "#c8782a" }}>{activeCategory}</span>
        </h1>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "20px", marginBottom: "40px" }}>
          {/* Filters */}
          <div style={{ display: "flex", gap: "12px", overflowX: "auto", scrollbarWidth: "none", paddingBottom: "4px" }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  background: activeCategory === cat ? "#fff" : "transparent",
                  color: activeCategory === cat ? "#000" : "#999",
                  border: "1px solid",
                  borderColor: activeCategory === cat ? "#fff" : "#333",
                  borderRadius: "30px", padding: "8px 20px", fontSize: "14px",
                  fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap",
                  fontFamily: "inherit", transition: "all 0.2s"
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span style={{ fontSize: "13px", color: "#666" }}>{sortedProducts.length} products</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                background: "#111", color: "#fff", border: "1px solid #333", 
                borderRadius: "8px", padding: "8px 16px", fontSize: "13px", 
                outline: "none", cursor: "pointer", fontFamily: "inherit"
              }}
            >
              <option value="featured">Featured</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Grid */}
      <motion.div layout style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
        <AnimatePresence>
          {sortedProducts.map(p => (
            <motion.div 
              key={p.id} layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Link href={`/shop/${p.id}`} style={{ textDecoration: "none" }}>
                <div className="card-hover" style={{ background: "#111", borderRadius: "16px", overflow: "hidden", position: "relative", border: "1px solid #1a1a1a" }}>
                  {p.badge && (
                    <div style={{ position: "absolute", top: "14px", left: "14px", background: "rgba(0,0,0,0.7)", border: "1px solid #333", borderRadius: "4px", padding: "3px 8px", fontSize: "10px", fontWeight: 600, letterSpacing: "0.8px", color: "#fff", zIndex: 2 }}>
                      {p.badge}
                    </div>
                  )}
                  <div style={{ width: "100%", aspectRatio: "1/1", position: "relative", background: "#080808" }}>
                    <Image src={p.image} alt={p.name} fill style={{ objectFit: "contain", padding: "40px" }} sizes="(max-width: 768px) 100vw, 33vw" />
                  </div>
                  <div style={{ padding: "24px" }}>
                    <div style={{ fontSize: "10px", color: "#999", letterSpacing: "0.8px", marginBottom: "8px" }}>{p.brand} · {p.category}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontSize: "18px", fontWeight: 600, color: "#fff" }}>{p.name}</span>
                      <span style={{ fontSize: "14px", color: "#c8782a", fontWeight: 500 }}>{p.price}</span>
                    </div>
                    <QuickAddButton product={p} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
