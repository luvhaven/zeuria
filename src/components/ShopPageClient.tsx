"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { ProductListItem } from "@/data/products";
import QuickAddButton from "@/components/QuickAddButton";
import { SlidersHorizontal, X } from "lucide-react";

const categories = ["All", "iPhone", "Samsung", "Pixel", "Huawei", "Xiaomi", "Accessories"];

const isAccessory = (cat: string) => ["AUDIO", "WATCH", "POWER", "ACCESSORY"].includes(cat?.toUpperCase() || "");

export default function ShopPageClient({ products }: { products: ProductListItem[] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [filterOpen, setFilterOpen] = useState(false);

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
    return 0;
  });

  return (
    <>
      {/* Mobile filter sheet */}
      <AnimatePresence>
        {filterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setFilterOpen(false)}
              style={{ position: "fixed", inset: 0, zIndex: 199, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
            />
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              style={{
                position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200,
                background: "#0d0d0d", borderRadius: "20px 20px 0 0",
                border: "1px solid rgba(255,255,255,0.08)",
                padding: "20px 20px max(28px, env(safe-area-inset-bottom))",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <span style={{ fontSize: 16, fontWeight: 600, color: "#fff" }}>Filter & Sort</span>
                <button onClick={() => setFilterOpen(false)} style={{ background: "rgba(255,255,255,0.08)", border: "none", color: "#fff", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <X size={16} />
                </button>
              </div>
              <div style={{ fontSize: 10, letterSpacing: "2px", color: "#555", textTransform: "uppercase", marginBottom: 12 }}>Category</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
                {categories.map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)}
                    style={{
                      background: activeCategory === cat ? "#fff" : "transparent",
                      color: activeCategory === cat ? "#000" : "#888",
                      border: `1px solid ${activeCategory === cat ? "#fff" : "#333"}`,
                      borderRadius: 30, padding: "8px 18px", fontSize: 13,
                      fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
                    }}
                  >{cat}</button>
                ))}
              </div>
              <div style={{ fontSize: 10, letterSpacing: "2px", color: "#555", textTransform: "uppercase", marginBottom: 12 }}>Sort by</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {[{ v: "featured", l: "Featured" }, { v: "price_asc", l: "Price: Low to High" }, { v: "price_desc", l: "Price: High to Low" }].map(opt => (
                  <button key={opt.v} onClick={() => setSortBy(opt.v)}
                    style={{
                      background: sortBy === opt.v ? "rgba(200,120,42,0.1)" : "transparent",
                      border: `1px solid ${sortBy === opt.v ? "rgba(200,120,42,0.3)" : "rgba(255,255,255,0.06)"}`,
                      color: sortBy === opt.v ? "#c8782a" : "#888",
                      borderRadius: 10, padding: "12px 16px", fontSize: 13, fontWeight: 500,
                      cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                    }}
                  >{opt.l}</button>
                ))}
              </div>
              <button onClick={() => setFilterOpen(false)}
                style={{
                  width: "100%", marginTop: 20, background: "#fff", color: "#000",
                  border: "none", borderRadius: 12, padding: "14px", fontSize: 14,
                  fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                }}
              >Apply — {sortedProducts.length} products</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div style={{
        maxWidth: "var(--max-w, 1380px)",
        margin: "0 auto",
        padding: "clamp(96px, 12vh, 140px) clamp(16px, 5vw, 64px) clamp(60px, 8vw, 100px)",
      }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 style={{
            fontSize: "clamp(36px, 7vw, 72px)", fontWeight: 800,
            letterSpacing: "clamp(-2px, -0.04em, -3px)", marginBottom: "clamp(20px, 4vw, 36px)",
            lineHeight: 0.96,
          }}>
            Shop <span style={{ color: "#c8782a" }}>{activeCategory}</span>
          </h1>

          {/* Desktop: inline filter + sort */}
          <div className="desktop-only" style={{
            justifyContent: "space-between", alignItems: "flex-start",
            flexWrap: "wrap", gap: "16px", marginBottom: "clamp(24px, 4vw, 48px)",
          }}>
            {/* Category pills */}
            <div style={{ display: "flex", gap: "8px", overflowX: "auto", scrollbarWidth: "none", paddingBottom: "4px", flexWrap: "wrap" }}>
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  style={{
                    background: activeCategory === cat ? "#fff" : "transparent",
                    color: activeCategory === cat ? "#000" : "#999",
                    border: "1px solid", borderColor: activeCategory === cat ? "#fff" : "#333",
                    borderRadius: "30px", padding: "8px 20px", fontSize: "13px",
                    fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap",
                    fontFamily: "inherit", transition: "all 0.2s",
                  }}
                >{cat}</button>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", flexShrink: 0 }}>
              <span style={{ fontSize: "13px", color: "#555" }}>{sortedProducts.length} products</span>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                style={{
                  background: "#111", color: "#fff", border: "1px solid #333",
                  borderRadius: "10px", padding: "9px 16px", fontSize: "13px",
                  outline: "none", cursor: "pointer", fontFamily: "inherit",
                }}
              >
                <option value="featured">Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Mobile: compact bar */}
          <div className="mobile-only" style={{
            justifyContent: "space-between", alignItems: "center",
            marginBottom: "20px", gap: 10,
          }}>
            <span style={{ fontSize: 13, color: "#555" }}>{sortedProducts.length} items</span>
            <button onClick={() => setFilterOpen(true)}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                background: "#111", border: "1px solid #333",
                borderRadius: 10, padding: "9px 16px", fontSize: 13,
                fontWeight: 500, color: "#fff", cursor: "pointer", fontFamily: "inherit",
              }}
            >
              <SlidersHorizontal size={14} /> Filter & Sort
            </button>
          </div>

          {/* Mobile scroll-category strip (shown in addition to filter fab) */}
          <div className="mobile-only" style={{
            gap: 8, overflowX: "auto", scrollbarWidth: "none",
            marginBottom: 20, paddingBottom: 4, WebkitOverflowScrolling: "touch",
          } as React.CSSProperties}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                style={{
                  background: activeCategory === cat ? "#fff" : "transparent",
                  color: activeCategory === cat ? "#000" : "#888",
                  border: "1px solid", borderColor: activeCategory === cat ? "#fff" : "#2a2a2a",
                  borderRadius: "30px", padding: "7px 16px", fontSize: "12px",
                  fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap",
                  fontFamily: "inherit", flexShrink: 0, transition: "all 0.2s",
                }}
              >{cat}</button>
            ))}
          </div>
        </motion.div>

        {/* Product Grid */}
        <motion.div layout style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(clamp(160px, 28vw, 300px), 1fr))",
          gap: "clamp(12px, 2vw, 24px)",
        }}>
          <AnimatePresence>
            {sortedProducts.map(p => (
              <motion.div
                key={p.id} layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.28 }}
              >
                <Link href={`/shop/${p.id}`} style={{ textDecoration: "none" }}>
                  <div className="card-hover" style={{
                    background: "#0d0d0d", borderRadius: "clamp(12px, 2vw, 20px)",
                    overflow: "hidden", position: "relative",
                    border: "1px solid rgba(255,255,255,0.06)",
                    transition: "border-color 0.3s",
                  }}>
                    {p.badge && (
                      <div style={{
                        position: "absolute", top: "10px", left: "10px", zIndex: 2,
                        background: "rgba(0,0,0,0.8)", border: "1px solid rgba(200,120,42,0.3)",
                        borderRadius: "6px", padding: "3px 8px",
                        fontSize: "9px", fontWeight: 700, letterSpacing: "0.8px", color: "#c8782a",
                      }}>{p.badge}</div>
                    )}
                    <div style={{ width: "100%", aspectRatio: "1 / 1", position: "relative", background: "#080808" }}>
                      <Image
                        src={p.image} alt={p.name} fill
                        style={{ objectFit: "contain", padding: "clamp(20px, 5vw, 40px)" }}
                        sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, 25vw"
                      />
                    </div>
                    <div style={{ padding: "clamp(14px, 2.5vw, 24px)" }}>
                      <div style={{ fontSize: "9px", color: "#555", letterSpacing: "0.8px", marginBottom: "6px", textTransform: "uppercase" }}>
                        {p.brand} · {p.category}
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
                        <span style={{ fontSize: "clamp(13px, 2vw, 17px)", fontWeight: 600, color: "#fff", lineHeight: 1.2 }}>{p.name}</span>
                        <span style={{ fontSize: "clamp(12px, 1.5vw, 14px)", color: "#c8782a", fontWeight: 700, flexShrink: 0 }}>{p.price}</span>
                      </div>
                      <QuickAddButton product={p} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {sortedProducts.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 24px" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: "#fff", marginBottom: 8 }}>No products found</div>
            <div style={{ fontSize: 14, color: "#555" }}>Try a different category</div>
          </div>
        )}
      </div>
    </>
  );
}
