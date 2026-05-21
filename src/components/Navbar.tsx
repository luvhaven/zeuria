"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, User, ShoppingBag, X, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "./CartProvider";
import { motion, AnimatePresence } from "framer-motion";

import Image from "next/image";

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

import type { ProductListItem } from "@/data/products";

export default function Navbar({ products }: { products: ProductListItem[] }) {
  const allProducts = products.map(p => ({ id: p.id, name: p.name, href: `/shop/${p.id}`, brand: p.brand, image: p.image, badge: p.badge, category: p.category }));
  
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

  // Hide mega menu if scrolling
  useEffect(() => {
    const handleScroll = () => setHoveredLink(null);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const results = query.length > 1
    ? allProducts.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.brand.toLowerCase().includes(query.toLowerCase()))
    : [];

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <nav 
        onMouseLeave={() => setHoveredLink(null)}
        style={{
        position: "sticky", top: 0, zIndex: 100,
        background: hoveredLink ? "#000" : "rgba(0,0,0,0.7)", 
        backdropFilter: hoveredLink ? "none" : "saturate(180%) blur(20px)",
        borderBottom: hoveredLink ? "none" : "1px solid rgba(255,255,255,0.08)", height: "56px",
        display: "flex", alignItems: "center", padding: "0 24px",
        transition: "background 0.3s ease, border-bottom 0.3s ease"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", maxWidth: "1200px", margin: "0 auto" }}>

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button aria-label="Open menu" className="mobile-only" onClick={() => setMobileMenuOpen(true)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", alignItems: "center" }}>
              <Menu size={20} strokeWidth={1.5} />
            </button>
            <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
              <span style={{ fontSize: "22px", fontWeight: 600, letterSpacing: "-1.2px", color: "#fff" }}>zeuria</span>
              <span style={{ fontSize: "10px", fontWeight: 500, color: "#c8782a", marginLeft: "4px", position: "relative", top: "-4px" }}>®</span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="desktop-only" style={{ alignItems: "center", gap: "24px" }}>
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className="link-hover" 
                  onMouseEnter={() => setHoveredLink(link.label)}
                  style={{
                    fontSize: "12px", color: isActive || hoveredLink === link.label ? "#fff" : (hoveredLink ? "#888" : "#a1a1a6"),
                    fontWeight: isActive || hoveredLink === link.label ? 500 : 400, transition: "color 0.2s", textDecoration: "none"
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Icons */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button aria-label="Search products" onClick={() => setSearchOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", color: "#a1a1a6", display: "flex", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")} onMouseLeave={e => (e.currentTarget.style.color = "#a1a1a6")}>
              <Search size={18} strokeWidth={1.5} />
            </button>
            <Link href="/account" aria-label="Your account" style={{ color: "#a1a1a6", display: "flex", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")} onMouseLeave={e => (e.currentTarget.style.color = "#a1a1a6")}>
              <User size={18} strokeWidth={1.5} />
            </Link>
            <button aria-label="Shopping bag" onClick={toggle} style={{ background: "none", border: "none", cursor: "pointer", color: "#a1a1a6", display: "flex", position: "relative", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")} onMouseLeave={e => (e.currentTarget.style.color = "#a1a1a6")}>
              <ShoppingBag size={18} strokeWidth={1.5} />
              {count > 0 && (
                <span style={{ position: "absolute", top: "-4px", right: "-6px", background: "#c8782a", color: "#fff", borderRadius: "50%", width: "16px", height: "16px", fontSize: "10px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid rgba(0,0,0,0.8)" }}>{count}</span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mega Menu Tray */}
      <AnimatePresence>
        {hoveredLink && !["Stories", "Support", "Shop"].includes(hoveredLink) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 350 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onMouseEnter={() => setHoveredLink(hoveredLink)}
            onMouseLeave={() => setHoveredLink(null)}
            style={{
              position: "fixed", top: "56px", left: 0, right: 0, zIndex: 99,
              background: "rgba(0,0,0,0.85)", backdropFilter: "saturate(180%) blur(30px)",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              overflow: "hidden"
            }}
          >
            <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px", display: "flex", gap: "40px" }}>
              <div style={{ width: "200px" }}>
                <div style={{ fontSize: "11px", color: "#888", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "16px" }}>Explore {hoveredLink}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <Link href={hoveredLink === "Accessories" ? "/accessories" : `/brands/${hoveredLink.toLowerCase()}`} style={{ fontSize: "24px", fontWeight: 600, color: "#fff", textDecoration: "none" }}>View All {hoveredLink}</Link>
                </div>
              </div>
              <div style={{ display: "flex", gap: "24px", flex: 1 }}>
                {allProducts.filter(p => categoryMap[hoveredLink]?.includes(p.id)).slice(0, 4).map((p, i) => (
                  <Link key={p.href} href={p.href} style={{ textDecoration: "none", flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + (i * 0.05) }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                      <div style={{ width: "100%", height: "140px", position: "relative" }}>
                        <Image src={p.image} alt={p.name} fill style={{ objectFit: "contain" }} />
                      </div>
                      <div style={{ textAlign: "center" }}>
                        {p.badge && <div style={{ fontSize: "9px", color: "#c8782a", fontWeight: 700, letterSpacing: "1px", marginBottom: "4px" }}>{p.badge}</div>}
                        <div style={{ fontSize: "14px", fontWeight: 500, color: "#fff" }}>{p.name}</div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen dim overlay when Mega Menu is open */}
      <AnimatePresence>
        {hoveredLink && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
            style={{ position: "fixed", inset: 0, top: "56px", zIndex: 98, background: "rgba(0,0,0,0.5)", pointerEvents: "none" }}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(10,10,10,0.95)", backdropFilter: "blur(20px)", display: "flex", flexDirection: "column", padding: "24px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
              <Link href="/" onClick={() => setMobileMenuOpen(false)} style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
                <span style={{ fontSize: "22px", fontWeight: 600, letterSpacing: "-1.2px", color: "#fff" }}>zeuria</span>
                <span style={{ fontSize: "10px", fontWeight: 500, color: "#c8782a", marginLeft: "4px", position: "relative", top: "-4px" }}>®</span>
              </Link>
              <button onClick={() => setMobileMenuOpen(false)} style={{ background: "none", border: "none", color: "#888", cursor: "pointer" }}>
                <X size={24} />
              </button>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {navLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                return (
                  <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} style={{
                    fontSize: "24px", color: isActive ? "#fff" : "#888",
                    fontWeight: isActive ? 600 : 400, textDecoration: "none",
                    borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "16px"
                  }}>{link.label}</Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }} 
            animate={{ opacity: 1, backdropFilter: "blur(12px)" }} 
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.4 }}
            style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.85)", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "120px" }}
          >
            <button onClick={() => { setSearchOpen(false); setQuery(""); }} style={{ position: "absolute", top: "20px", right: "24px", background: "none", border: "none", color: "#888", cursor: "pointer", transition: "transform 0.3s ease" }}
              onMouseEnter={e => e.currentTarget.style.transform = "rotate(90deg)"} onMouseLeave={e => e.currentTarget.style.transform = "rotate(0deg)"}>
              <X size={24} />
            </button>
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              style={{ width: "100%", maxWidth: "560px", padding: "0 24px" }}
            >
              <input
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search phones, accessories..."
                style={{
                  width: "100%", background: "transparent", border: "none",
                  borderBottom: "1px solid #333", color: "#fff", fontSize: "28px",
                  fontWeight: 300, padding: "12px 0", outline: "none",
                  fontFamily: "inherit", caretColor: "#c8782a",
                }}
              />
              {results.length > 0 && (
                <motion.div 
                  initial="hidden" animate="visible"
                  variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                  style={{ marginTop: "24px" }}
                >
                  {results.map((r, i) => (
                    <motion.div 
                      key={r.href}
                      variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}
                    >
                      <Link href={r.href} onClick={() => { setSearchOpen(false); setQuery(""); }}
                        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #1a1a1a", textDecoration: "none" }}>
                        <span style={{ fontSize: "16px", fontWeight: 400, color: "#fff" }}>{r.name}</span>
                        <span style={{ fontSize: "12px", color: "#555" }}>{r.brand}</span>
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
