"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, User, ShoppingBag, X, Menu, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "./CartProvider";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { ProductListItem } from "@/data/products";

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/brands/iphone", label: "iPhone" },
  { href: "/brands/samsung", label: "Samsung" },
  { href: "/brands/pixel", label: "Pixel" },
  { href: "/brands/huawei", label: "Huawei" },
  { href: "/brands/xiaomi", label: "Xiaomi" },
  { href: "/accessories", label: "Accessories" },
  { href: "/stories", label: "Stories" },
  { href: "/support", label: "Support" },
];

export default function Navbar({ products }: { products: ProductListItem[] }) {
  const allProducts = products.map(p => ({
    id: p.id, name: p.name, href: `/shop/${p.id}`,
    brand: p.brand, image: p.image, badge: p.badge, category: p.category,
  }));

  const isAccessory = (cat: string) => ["AUDIO", "WATCH", "POWER", "ACCESSORY"].includes(cat?.toUpperCase() || "");

  const categoryMap: Record<string, string[]> = {
    iPhone: products.filter(p => p.brand === "APPLE" && !isAccessory(p.category)).map(p => p.id),
    Samsung: products.filter(p => p.brand === "SAMSUNG" && !isAccessory(p.category)).map(p => p.id),
    Pixel: products.filter(p => p.brand === "GOOGLE" && !isAccessory(p.category)).map(p => p.id),
    Huawei: products.filter(p => p.brand === "HUAWEI" && !isAccessory(p.category)).map(p => p.id),
    Xiaomi: products.filter(p => p.brand === "XIAOMI" && !isAccessory(p.category)).map(p => p.id),
    Accessories: products.filter(p => isAccessory(p.category)).map(p => p.id),
  };

  const pathname = usePathname();
  const { count, toggle } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  // Prevent body scroll when menus are open
  useEffect(() => {
    if (mobileMenuOpen || searchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen, searchOpen]);

  // Hide mega menu on scroll
  useEffect(() => {
    const h = () => setHoveredLink(null);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const results = query.length > 1
    ? allProducts.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.brand.toLowerCase().includes(query.toLowerCase())
    )
    : [];

  return (
    <>
      <nav
        onMouseLeave={() => setHoveredLink(null)}
        style={{
          position: "sticky", top: 0, zIndex: 100,
          background: hoveredLink ? "#000" : "rgba(0,0,0,0.7)",
          backdropFilter: hoveredLink ? "none" : "saturate(180%) blur(20px)",
          borderBottom: hoveredLink ? "none" : "1px solid rgba(255,255,255,0.08)",
          height: "var(--nav-h, 56px)",
          display: "flex", alignItems: "center",
          padding: "0 clamp(12px, 3vw, 24px)",
          transition: "background 0.3s ease, border-bottom 0.3s ease",
        }}
      >
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          width: "100%", maxWidth: "var(--max-w, 1380px)", margin: "0 auto",
        }}>

          {/* Left: Hamburger (mobile) + Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "clamp(8px, 2vw, 16px)" }}>
            <button
              aria-label="Open menu"
              className="mobile-only"
              onClick={() => setMobileMenuOpen(true)}
              style={{
                background: "none", border: "none", color: "#fff", cursor: "pointer",
                display: "flex", alignItems: "center", padding: "6px",
                borderRadius: "8px", transition: "background 0.2s",
              }}
            >
              <Menu size={20} strokeWidth={1.5} />
            </button>
            <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0 }}>
              <span style={{ fontSize: "clamp(18px, 3vw, 22px)", fontWeight: 600, letterSpacing: "-1.2px", color: "#fff" }}>zeuria</span>
              <span style={{ fontSize: "10px", fontWeight: 500, color: "#c8782a", marginLeft: "3px", position: "relative", top: "-4px" }}>®</span>
            </Link>
          </div>

          {/* Center: Desktop Nav Links */}
          <div className="desktop-only" style={{ alignItems: "center", gap: "clamp(16px, 2vw, 24px)", position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="link-hover"
                  onMouseEnter={() => setHoveredLink(link.label)}
                  style={{
                    fontSize: "12px",
                    color: isActive || hoveredLink === link.label ? "#fff" : hoveredLink ? "#888" : "#a1a1a6",
                    fontWeight: isActive || hoveredLink === link.label ? 500 : 400,
                    transition: "color 0.2s", textDecoration: "none", whiteSpace: "nowrap",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right: Icons */}
          <div style={{ display: "flex", alignItems: "center", gap: "clamp(8px, 1.5vw, 12px)" }}>
            <button
              aria-label="Search products"
              onClick={() => setSearchOpen(true)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#a1a1a6", display: "flex", transition: "color 0.2s", padding: "6px" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={e => (e.currentTarget.style.color = "#a1a1a6")}
            >
              <Search size={18} strokeWidth={1.5} />
            </button>
            <Link
              href="/account"
              aria-label="Your account"
              style={{ color: "#a1a1a6", display: "flex", transition: "color 0.2s", padding: "6px" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={e => (e.currentTarget.style.color = "#a1a1a6")}
            >
              <User size={18} strokeWidth={1.5} />
            </Link>
            <button
              aria-label={`Shopping bag, ${count} items`}
              onClick={toggle}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#a1a1a6", display: "flex", position: "relative", transition: "color 0.2s", padding: "6px" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={e => (e.currentTarget.style.color = "#a1a1a6")}
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {count > 0 && (
                <span style={{
                  position: "absolute", top: "2px", right: "2px",
                  background: "#c8782a", color: "#fff", borderRadius: "50%",
                  width: "15px", height: "15px", fontSize: "9px", fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: "1.5px solid rgba(0,0,0,0.8)",
                }}>{count > 9 ? "9+" : count}</span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mega Menu Tray (Desktop) ── */}
      <AnimatePresence>
        {hoveredLink && !["Stories", "Support", "Shop"].includes(hoveredLink) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 320 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            onMouseEnter={() => setHoveredLink(hoveredLink)}
            onMouseLeave={() => setHoveredLink(null)}
            style={{
              position: "fixed", top: "var(--nav-h, 56px)", left: 0, right: 0, zIndex: 99,
              background: "rgba(0,0,0,0.9)", backdropFilter: "saturate(180%) blur(30px)",
              borderBottom: "1px solid rgba(255,255,255,0.08)", overflow: "hidden",
            }}
          >
            <div style={{ maxWidth: "var(--max-w, 1380px)", margin: "0 auto", padding: "36px clamp(16px, 5vw, 64px)", display: "flex", gap: "40px" }}>
              <div style={{ width: "200px", flexShrink: 0 }}>
                <div style={{ fontSize: "11px", color: "#888", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "16px" }}>Explore {hoveredLink}</div>
                <Link
                  href={hoveredLink === "Accessories" ? "/accessories" : `/brands/${hoveredLink.toLowerCase()}`}
                  style={{ fontSize: "22px", fontWeight: 600, color: "#fff", textDecoration: "none" }}
                >
                  View All {hoveredLink}
                </Link>
              </div>
              <div style={{ display: "flex", gap: "24px", flex: 1, overflow: "hidden" }}>
                {allProducts.filter(p => categoryMap[hoveredLink]?.includes(p.id)).slice(0, 4).map((p, i) => (
                  <Link key={p.href} href={p.href} style={{ textDecoration: "none", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", minWidth: 0 }}>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 + i * 0.05 }}
                      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", width: "100%" }}
                    >
                      <div style={{ width: "100%", height: "130px", position: "relative" }}>
                        <Image src={p.image} alt={p.name} fill style={{ objectFit: "contain" }} />
                      </div>
                      <div style={{ textAlign: "center" }}>
                        {p.badge && <div style={{ fontSize: "9px", color: "#c8782a", fontWeight: 700, letterSpacing: "1px", marginBottom: "4px" }}>{p.badge}</div>}
                        <div style={{ fontSize: "13px", fontWeight: 500, color: "#fff" }}>{p.name}</div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Dim overlay when mega menu open ── */}
      <AnimatePresence>
        {hoveredLink && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ position: "fixed", inset: 0, top: "var(--nav-h, 56px)", zIndex: 98, background: "rgba(0,0,0,0.5)", pointerEvents: "none" }}
          />
        )}
      </AnimatePresence>

      {/* ── Mobile Full-Screen Menu ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            style={{
              position: "fixed", inset: 0, zIndex: 200,
              background: "rgba(8,8,8,0.98)", backdropFilter: "blur(24px)",
              display: "flex", flexDirection: "column",
              paddingTop: "env(safe-area-inset-top, 0px)",
              paddingBottom: "max(32px, env(safe-area-inset-bottom))",
            }}
          >
            {/* Header */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "16px clamp(16px, 5vw, 28px)", borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}>
              <Link href="/" onClick={() => setMobileMenuOpen(false)} style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
                <span style={{ fontSize: "22px", fontWeight: 600, letterSpacing: "-1.2px", color: "#fff" }}>zeuria</span>
                <span style={{ fontSize: "10px", fontWeight: 500, color: "#c8782a", marginLeft: "3px", position: "relative", top: "-4px" }}>®</span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                style={{
                  background: "rgba(255,255,255,0.06)", border: "none", color: "#fff",
                  cursor: "pointer", borderRadius: "50%", width: 36, height: 36,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Search bar inside mobile menu */}
            <div style={{ padding: "16px clamp(16px, 5vw, 28px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "rgba(255,255,255,0.05)", borderRadius: 12,
                padding: "10px 16px", border: "1px solid rgba(255,255,255,0.08)",
              }}>
                <Search size={16} strokeWidth={1.5} color="#555" />
                <input
                  placeholder="Search devices..."
                  onClick={() => { setMobileMenuOpen(false); setTimeout(() => setSearchOpen(true), 200); }}
                  readOnly
                  style={{
                    background: "none", border: "none", outline: "none", color: "#888",
                    fontSize: 14, fontFamily: "inherit", flex: 1, cursor: "pointer",
                  }}
                />
              </div>
            </div>

            {/* Nav Links */}
            <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
              {navLinks.map((link, i) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "clamp(14px, 3vw, 18px) clamp(16px, 5vw, 28px)",
                        fontSize: "clamp(17px, 4vw, 20px)",
                        color: isActive ? "#fff" : "#888",
                        fontWeight: isActive ? 600 : 400,
                        textDecoration: "none",
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                        transition: "color 0.2s, background 0.2s",
                      }}
                    >
                      {link.label}
                      <ChevronRight size={16} color={isActive ? "#c8782a" : "#333"} />
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Footer actions */}
            <div style={{ padding: "clamp(16px, 4vw, 24px) clamp(16px, 5vw, 28px)", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 12 }}>
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12, padding: "12px 16px", fontSize: 13, fontWeight: 500,
                  color: "#ccc", textDecoration: "none",
                }}
              >
                <User size={15} /> Account
              </Link>
              <button
                onClick={() => { setMobileMenuOpen(false); toggle(); }}
                style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  background: "#fff", border: "none", borderRadius: 12,
                  padding: "12px 16px", fontSize: 13, fontWeight: 700, color: "#000", cursor: "pointer",
                  fontFamily: "inherit", position: "relative",
                }}
              >
                <ShoppingBag size={15} /> Bag
                {count > 0 && (
                  <span style={{
                    background: "#c8782a", color: "#fff", borderRadius: "50%", width: 16, height: 16,
                    fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center",
                  }}>{count}</span>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Search Overlay ── */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "fixed", inset: 0, zIndex: 300,
              background: "rgba(0,0,0,0.92)", backdropFilter: "blur(16px)",
              display: "flex", flexDirection: "column", alignItems: "center",
              paddingTop: "clamp(80px, 15vh, 140px)",
              paddingLeft: "clamp(16px, 5vw, 40px)",
              paddingRight: "clamp(16px, 5vw, 40px)",
            }}
          >
            <button
              onClick={() => { setSearchOpen(false); setQuery(""); }}
              aria-label="Close search"
              style={{
                position: "absolute", top: "clamp(14px, 3vw, 20px)", right: "clamp(14px, 3vw, 24px)",
                background: "rgba(255,255,255,0.08)", border: "none", color: "#fff",
                cursor: "pointer", borderRadius: "50%", width: 36, height: 36,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "transform 0.3s",
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "rotate(90deg)"}
              onMouseLeave={e => e.currentTarget.style.transform = "rotate(0deg)"}
            >
              <X size={18} />
            </button>

            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.08, ease: "easeOut" }}
              style={{ width: "100%", maxWidth: "560px" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #333", paddingBottom: 12 }}>
                <Search size={20} strokeWidth={1.5} color="#555" style={{ flexShrink: 0 }} />
                <input
                  autoFocus
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search phones, accessories..."
                  style={{
                    flex: 1, background: "transparent", border: "none",
                    color: "#fff", fontSize: "clamp(22px, 5vw, 28px)",
                    fontWeight: 300, padding: "4px 0", outline: "none",
                    fontFamily: "inherit", caretColor: "#c8782a",
                  }}
                />
                {query && (
                  <button onClick={() => setQuery("")} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", display: "flex" }}>
                    <X size={16} />
                  </button>
                )}
              </div>

              {results.length > 0 && (
                <motion.div
                  initial="hidden" animate="visible"
                  variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
                  style={{ marginTop: "20px" }}
                >
                  {results.slice(0, 8).map(r => (
                    <motion.div key={r.href} variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}>
                      <Link
                        href={r.href}
                        onClick={() => { setSearchOpen(false); setQuery(""); }}
                        style={{
                          display: "flex", justifyContent: "space-between", alignItems: "center",
                          padding: "clamp(12px, 2vw, 14px) 0",
                          borderBottom: "1px solid #1a1a1a", textDecoration: "none",
                        }}
                      >
                        <span style={{ fontSize: "clamp(14px, 2vw, 16px)", fontWeight: 400, color: "#fff" }}>{r.name}</span>
                        <span style={{ fontSize: "12px", color: "#555", flexShrink: 0, marginLeft: 12 }}>{r.brand}</span>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              )}
              {query.length > 1 && results.length === 0 && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: "24px", color: "#555", fontSize: "14px" }}>
                  No results for &quot;{query}&quot;
                </motion.p>
              )}
              {!query && (
                <div style={{ marginTop: 24 }}>
                  <div style={{ fontSize: 10, color: "#444", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 12 }}>Popular</div>
                  {["iPhone 17 Pro", "Galaxy S26 Ultra", "Pixel 10 Pro"].map(term => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      style={{
                        display: "block", width: "100%", textAlign: "left", background: "none", border: "none",
                        color: "#777", fontSize: 14, padding: "10px 0", cursor: "pointer",
                        borderBottom: "1px solid #1a1a1a", fontFamily: "inherit",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                      onMouseLeave={e => (e.currentTarget.style.color = "#777")}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
