"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { motion, useScroll, useTransform, useMotionValueEvent, useInView } from "framer-motion";
import { Star, ShoppingBag, ArrowUpRight, Check, ChevronDown } from "lucide-react";
import type { ProductDetail, ProductListItem } from "@/data/products";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(useGSAP, ScrollTrigger);

function FadeUp({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} style={style}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

function PdpLabel({ title }: { title: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: "clamp(24px, 4vw, 40px)" }}>
      <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
      <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: "3px", color: "#444", textTransform: "uppercase" }}>{title}</span>
    </div>
  );
}

export default function ProductDetailClient({ product, related }: { product: ProductDetail; related: ProductListItem[] }) {
  const { add } = useCart();
  const [selectedStorage, setSelectedStorage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [showBuyBar, setShowBuyBar] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const container = useRef(null);

  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.25], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  useMotionValueEvent(scrollYProgress, "change", v => setShowBuyBar(v > 0.25));

  useGSAP(() => {
    gsap.utils.toArray<HTMLElement>(".feature-parallax").forEach(img => {
      gsap.to(img, {
        yPercent: 28, ease: "none",
        scrollTrigger: { trigger: img.parentElement!, start: "top bottom", end: "bottom top", scrub: true }
      });
    });
    gsap.utils.toArray<HTMLElement>(".pdp-reveal").forEach(el => {
      gsap.fromTo(el, { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none reverse" }
        });
    });
  }, { scope: container });

  const availableStorages = product.storage_options && product.storage_options.length > 0
    ? product.storage_options
    : ["Standard"];

  const TRUST = [
    { icon: "→", label: "24h Lagos Delivery", sub: "Order before 2 PM, get it today" },
    { icon: "◈", label: "12-Month Warranty", sub: "Full manufacturer coverage" },
    { icon: "◇", label: "7-Day Easy Returns", sub: "No questions asked" },
    { icon: "◉", label: "100% Genuine & Sealed", sub: "Factory-sealed, never refurbished" },
  ];

  const FAQS = [
    { q: "Is this brand new and sealed?", a: "Yes. Zeuria exclusively sells factory-sealed, brand new devices. Never refurbished, never open-box." },
    { q: "Do you offer warranty?", a: "Every device includes a minimum 12-month manufacturer warranty, with Zeuria assisting on all claims." },
    { q: "Can I pay on delivery?", a: "Pay on Delivery is available within Lagos. Other states require upfront payment before dispatch." },
    { q: "How long does delivery take?", a: "Lagos: within 24 hours. Nationwide: 48–72 hours via our secure logistics partners." },
    { q: "Do you accept trade-ins?", a: "Zeuria is dedicated exclusively to factory-sealed devices. We do not accept trade-ins or pre-owned electronics." },
  ];

  return (
    <div ref={container} style={{ background: "#000", color: "#fff", minHeight: "100vh", overflowX: "hidden" }}>

      {/* ═══ HERO ═══ */}
      <section style={{ position: "relative", height: "100svh", minHeight: 560, display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        <motion.div style={{ position: "absolute", inset: "-5%", y: heroY }}>
          <Image src={product.images?.[0] || product.image} alt={product.name} fill
            style={{ objectFit: "cover", filter: "brightness(0.4)" }} priority />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.97) 100%)" }} />
        </motion.div>

        <motion.div style={{
          position: "relative", zIndex: 2, width: "100%",
          maxWidth: "var(--max-w, 1380px)", margin: "0 auto",
          padding: "0 clamp(16px, 5vw, 64px) clamp(40px, 8vw, 80px)",
          opacity: heroOpacity,
        }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
            <div style={{ fontSize: 10, letterSpacing: "3px", color: "#c8782a", fontWeight: 700, textTransform: "uppercase", marginBottom: 16 }}>
              {product.brand} · {product.category}
            </div>
            <h1 style={{
              fontSize: "clamp(40px, 8vw, 110px)", fontWeight: 800,
              letterSpacing: "clamp(-2px, -0.04em, -5px)",
              lineHeight: 0.9, marginBottom: "clamp(16px, 3vw, 24px)", maxWidth: 900,
            }}>
              {product.name}
            </h1>
            <p style={{ fontSize: "clamp(14px, 2vw, 18px)", fontWeight: 300, color: "rgba(255,255,255,0.6)", maxWidth: 480, lineHeight: 1.65 }}>
              {product.tagline}
            </p>
          </motion.div>
        </motion.div>

        {/* Scroll cue — desktop only */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          style={{
            position: "absolute", right: "clamp(16px, 5vw, 64px)", bottom: "clamp(24px, 5vw, 48px)",
            zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          }}>
          <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.3))" }} />
          <span style={{ fontSize: 9, color: "#555", letterSpacing: "3px", textTransform: "uppercase" }}>Scroll</span>
        </motion.div>
      </section>

      {/* ═══ TRUST STRIP ═══ */}
      <section style={{ borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{
          maxWidth: "var(--max-w, 1380px)", margin: "0 auto",
          padding: "0 clamp(16px, 5vw, 64px)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))",
        }}>
          {TRUST.map((t, i) => (
            <div key={t.label} className="pdp-trust-item"
              style={{
                borderRight: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none",
                borderBottom: "none",
                paddingRight: i < 3 ? "clamp(12px, 2.5vw, 28px)" : 0,
                paddingLeft: i > 0 ? "clamp(12px, 2.5vw, 28px)" : 0,
              }}>
              <div className="pdp-trust-icon">
                <span style={{ fontSize: 14, color: "#c8782a" }}>{t.icon}</span>
              </div>
              <div>
                <div style={{ fontSize: "clamp(11px, 1.5vw, 13px)", fontWeight: 600, color: "#fff", marginBottom: 3 }}>{t.label}</div>
                <div style={{ fontSize: "clamp(10px, 1.2vw, 11px)", color: "#555", letterSpacing: "0.3px" }}>{t.sub}</div>
              </div>
            </div>
          ))}
        </div>
        {/* Mobile trust: vertical list */}
        <style>{`
          @media (max-width: 600px) {
            .pdp-trust-strip-inner {
              grid-template-columns: 1fr !important;
            }
            .pdp-trust-item {
              border-right: none !important;
              border-bottom: 1px solid rgba(255,255,255,0.05) !important;
              padding-left: 0 !important;
              padding-right: 0 !important;
            }
            .pdp-trust-item:last-child { border-bottom: none !important; }
          }
        `}</style>
      </section>

      {/* ═══ PURCHASE SECTION ═══ */}
      <section style={{
        maxWidth: "var(--max-w, 1380px)", margin: "0 auto",
        padding: "clamp(48px, 8vw, 100px) clamp(16px, 5vw, 64px)",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
        gap: "clamp(32px, 5vw, 80px)",
        alignItems: "start",
      }}>

        {/* LEFT: Product image */}
        <div style={{ position: "sticky", top: 80 }}>
          <div style={{
            background: "#060606", border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: "clamp(16px, 3vw, 28px)", overflow: "hidden",
            aspectRatio: "1", position: "relative",
          }}>
            <Image src={product.image} alt={product.name} fill
              style={{ objectFit: "contain", padding: "clamp(24px, 5vw, 48px)" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, paddingLeft: 4 }}>
            <div style={{ display: "flex", gap: 2 }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#c8782a" color="#c8782a" />)}
            </div>
            <span style={{ fontSize: 12, color: "#555" }}>4.9 · 128 reviews</span>
          </div>
        </div>

        {/* RIGHT: Config */}
        <div>
          <div style={{ fontSize: 10, letterSpacing: "3px", color: "#c8782a", fontWeight: 700, textTransform: "uppercase", marginBottom: 14 }}>{product.brand}</div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, letterSpacing: "-2px", lineHeight: 0.95, marginBottom: 14 }}>{product.name}</h2>
          <div style={{ fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 700, color: "#c8782a", letterSpacing: "-1px", marginBottom: 24 }}>{product.price}</div>
          <p style={{ fontSize: "clamp(13px, 1.5vw, 15px)", fontWeight: 300, color: "#666", lineHeight: 1.7, marginBottom: 40 }}>{product.description}</p>

          {/* Color */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 11, letterSpacing: "2px", color: "#555", fontWeight: 600, textTransform: "uppercase", marginBottom: 12 }}>Finish</div>
            <div style={{ display: "flex", gap: 10 }}>
              {product.colors.map((c: string, i: number) => (
                <button key={i} className={`pdp-color-swatch ${selectedColor === i ? "active" : ""}`}
                  style={{ background: c }} onClick={() => setSelectedColor(i)} />
              ))}
            </div>
          </div>

          {/* Storage */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ fontSize: 11, letterSpacing: "2px", color: "#555", fontWeight: 600, textTransform: "uppercase", marginBottom: 12 }}>Storage</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 10 }}>
              {availableStorages.map((s: string, i: number) => (
                <button key={s} className={`pdp-storage-btn ${selectedStorage === i ? "active" : ""}`}
                  onClick={() => setSelectedStorage(i)}>{s}</button>
              ))}
            </div>
          </div>

          {/* Add to bag */}
          <div style={{
            background: "#060606", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "clamp(12px, 2vw, 20px)", padding: "clamp(20px, 3vw, 28px)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div>
                <div style={{ fontSize: "clamp(16px, 2.5vw, 19px)", fontWeight: 700, letterSpacing: "-0.5px" }}>{product.price}</div>
                <div style={{ fontSize: 11, color: "#555", marginTop: 3 }}>VAT & delivery included</div>
              </div>
              <div style={{
                fontSize: 10, letterSpacing: "1.5px", color: "#c8782a", fontWeight: 700,
                background: "rgba(200,164,110,0.08)", border: "1px solid rgba(200,164,110,0.2)",
                borderRadius: 100, padding: "6px 12px", textTransform: "uppercase", whiteSpace: "nowrap",
              }}>Only 3 left</div>
            </div>
            <button className="pdp-add-btn"
              onClick={() => add({ id: product.id, name: product.name, price: product.price, image: product.image, storage: availableStorages[selectedStorage] })}>
              <ShoppingBag size={16} /> Add to Bag
            </button>
            <p style={{ fontSize: 11, color: "#444", textAlign: "center", marginTop: 14, letterSpacing: "0.3px" }}>
              Delivered within 24–72 hours across Nigeria
            </p>
          </div>
        </div>
      </section>

      {/* ═══ STATEMENT ═══ */}
      <section style={{
        padding: "clamp(40px, 6vw, 72px) clamp(16px, 5vw, 64px) clamp(48px, 8vw, 80px)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}>
        <div className="pdp-reveal" style={{ maxWidth: "var(--max-w, 1380px)", margin: "0 auto" }}>
          <h2 style={{
            fontSize: "clamp(36px, 7vw, 96px)", fontWeight: 800,
            letterSpacing: "clamp(-2px, -0.04em, -4px)",
            lineHeight: 0.9, color: "#fff", maxWidth: 900,
          }}>
            {product.tagline || "Brilliance in every detail."}
          </h2>
          <p style={{ fontSize: "clamp(13px, 1.5vw, 17px)", fontWeight: 300, color: "#555", marginTop: "clamp(16px, 3vw, 28px)", maxWidth: 500, lineHeight: 1.7 }}>
            Designed to push the boundaries of what a {product.category.toLowerCase()} can do.
          </p>
        </div>
      </section>

      {/* ═══ FEATURE BLOCKS ═══ */}
      <section style={{
        padding: "0 clamp(16px, 5vw, 64px) clamp(60px, 8vw, 100px)",
        maxWidth: "var(--max-w, 1380px)", margin: "0 auto",
      }}>
        <FadeUp><PdpLabel title="Key features" /></FadeUp>

        {product.features.map((f: { full?: boolean; image?: string; title: string; body: string; dark?: boolean }, i: number) => {
          if (f.full) return (
            <FadeUp key={i} delay={0.04}>
              <div className="pdp-feature-full">
                <div className="feature-parallax" style={{ position: "absolute", top: "-20%", left: 0, right: 0, bottom: "-20%", zIndex: 0 }}>
                  <Image src={f.image!} alt={f.title} fill style={{ objectFit: "cover" }} sizes="100vw" />
                </div>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 55%)", zIndex: 1 }} />
                <div style={{ position: "relative", zIndex: 2, padding: "clamp(28px, 5vw, 56px)" }}>
                  <h3 style={{ fontSize: "clamp(24px, 4vw, 56px)", fontWeight: 800, letterSpacing: "-2px", marginBottom: 12 }}>{f.title}</h3>
                  <p style={{ fontSize: "clamp(13px, 1.5vw, 16px)", fontWeight: 300, color: "rgba(255,255,255,0.65)", maxWidth: 520, lineHeight: 1.65 }}>{f.body}</p>
                </div>
              </div>
            </FadeUp>
          );
          return (
            <FadeUp key={i} delay={0.04}>
              <div className="pdp-feature-card"
                style={{
                  background: f.dark ? "#060606" : "#f5f5f0", color: f.dark ? "#fff" : "#000",
                  gridTemplateColumns: f.image ? undefined : "1fr",
                }}>
                <div style={{ padding: "clamp(32px, 5vw, 64px) clamp(24px, 4vw, 56px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <h3 style={{ fontSize: "clamp(22px, 3vw, 44px)", fontWeight: 800, letterSpacing: "-1.5px", lineHeight: 1.05, marginBottom: 16 }}>{f.title}</h3>
                  <p style={{ fontSize: "clamp(13px, 1.5vw, 16px)", fontWeight: 300, color: f.dark ? "#666" : "#777", lineHeight: 1.7, maxWidth: 380 }}>{f.body}</p>
                </div>
                {f.image && (
                  <div style={{ position: "relative", minHeight: "clamp(220px, 35vw, 380px)", overflow: "hidden" }}>
                    <Image src={f.image} alt={f.title} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 50vw" />
                  </div>
                )}
              </div>
            </FadeUp>
          );
        })}
      </section>

      {/* ═══ SPECS ═══ */}
      <section style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "clamp(48px, 8vw, 100px) clamp(16px, 5vw, 64px)" }}>
        <div style={{ maxWidth: "var(--max-w, 1380px)", margin: "0 auto" }}>
          <FadeUp><PdpLabel title="Technical specs" /></FadeUp>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(clamp(180px, 25vw, 260px), 1fr))", gap: "clamp(8px, 1.5vw, 12px)" }}>
            {product.specs.map((s: { label: string; value: string }, i: number) => (
              <FadeUp key={i} delay={i * 0.04}>
                <div className="pdp-spec-card">
                  <span style={{ fontSize: 9, letterSpacing: "2.5px", color: "#555", fontWeight: 700, textTransform: "uppercase" }}>{s.label}</span>
                  <span style={{ fontSize: "clamp(18px, 2.5vw, 24px)", fontWeight: 700, letterSpacing: "-0.8px", color: "#fff", lineHeight: 1.2 }}>{s.value}</span>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ REVIEWS ═══ */}
      <section style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "clamp(48px, 8vw, 100px) clamp(16px, 5vw, 64px)" }}>
        <div style={{ maxWidth: "var(--max-w, 1380px)", margin: "0 auto" }}>
          <FadeUp>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "clamp(32px, 5vw, 56px)", flexWrap: "wrap", gap: 16 }}>
              <div>
                <PdpLabel title="Customer reviews" />
                <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
                  <span style={{ fontSize: "clamp(48px, 8vw, 64px)", fontWeight: 800, letterSpacing: "-4px", color: "#fff" }}>4.9</span>
                  <div>
                    <div style={{ display: "flex", gap: 3 }}>
                      {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#c8782a" color="#c8782a" />)}
                    </div>
                    <div style={{ fontSize: 11, color: "#555", marginTop: 4, letterSpacing: "0.3px" }}>128 verified reviews</div>
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))", gap: "clamp(10px, 2vw, 14px)" }}>
            {product.reviews.map((r: { name: string; rating: number; text: string; date: string }, i: number) => (
              <FadeUp key={i} delay={i * 0.06}>
                <div className="pdp-review-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, gap: 8 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{r.name}</div>
                      <div style={{ display: "flex", gap: 2, marginTop: 5 }}>
                        {[...Array(r.rating)].map((_, s) => <Star key={s} size={11} fill="#c8782a" color="#c8782a" />)}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
                      <Check size={10} color="#4ade80" />
                      <span style={{ fontSize: 10, color: "#4ade80", letterSpacing: "1px" }}>VERIFIED</span>
                    </div>
                  </div>
                  <p style={{ fontSize: "clamp(13px, 1.5vw, 14px)", fontWeight: 300, color: "#888", lineHeight: 1.65 }}>&ldquo;{r.text}&rdquo;</p>
                  <div style={{ fontSize: 10, color: "#444", marginTop: 14, letterSpacing: "0.5px" }}>{r.date}</div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "clamp(48px, 8vw, 100px) clamp(16px, 5vw, 64px)" }}>
        <div style={{ maxWidth: "clamp(560px, 65vw, 840px)", margin: "0 auto" }}>
          <FadeUp><PdpLabel title="Frequently asked" /></FadeUp>
          {FAQS.map((faq, i) => (
            <FadeUp key={i} delay={i * 0.05}>
              <div className="pdp-faq-item" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
                  <span style={{ fontSize: "clamp(14px, 1.8vw, 16px)", fontWeight: 600, color: "#fff", letterSpacing: "-0.3px" }}>{faq.q}</span>
                  <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.3 }} style={{ flexShrink: 0 }}>
                    <ChevronDown size={16} color="#555" />
                  </motion.div>
                </div>
                <motion.div initial={false}
                  animate={{ height: openFaq === i ? "auto" : 0, opacity: openFaq === i ? 1 : 0 }}
                  style={{ overflow: "hidden" }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
                  <p style={{ fontSize: "clamp(13px, 1.5vw, 14px)", fontWeight: 300, color: "#666", lineHeight: 1.7, paddingTop: 14 }}>{faq.a}</p>
                </motion.div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ═══ RELATED ═══ */}
      {related.length > 0 && (
        <section style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "clamp(48px, 8vw, 100px) clamp(16px, 5vw, 64px)" }}>
          <div style={{ maxWidth: "var(--max-w, 1380px)", margin: "0 auto" }}>
            <FadeUp>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "clamp(24px, 4vw, 48px)", flexWrap: "wrap", gap: 12 }}>
                <PdpLabel title={`More from ${product.brand}`} />
                <Link href="/shop" style={{ fontSize: 12, color: "#555", textDecoration: "none", display: "flex", alignItems: "center", gap: 5, letterSpacing: "0.5px", transition: "color 0.2s" }}>
                  View all <ArrowUpRight size={12} />
                </Link>
              </div>
            </FadeUp>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(240px, 100%), 1fr))",
              gap: "clamp(10px, 2vw, 14px)",
            }}>
              {related.map((p: ProductListItem, i: number) => (
                <FadeUp key={p.id} delay={i * 0.07}>
                  <Link href={`/shop/${p.id}`} className="pdp-related-card">
                    <div style={{ aspectRatio: "1", position: "relative", background: "#0a0a0a" }}>
                      <Image src={p.image} alt={p.name} fill style={{ objectFit: "contain", padding: "clamp(16px, 3vw, 32px)" }} sizes="(max-width: 768px) 50vw, 33vw" />
                    </div>
                    <div style={{ padding: "clamp(14px, 2vw, 22px)" }}>
                      <div style={{ fontSize: 9, letterSpacing: "2px", color: "#555", fontWeight: 700, textTransform: "uppercase", marginBottom: 6 }}>{p.brand}</div>
                      <div style={{ fontSize: "clamp(13px, 1.5vw, 16px)", fontWeight: 600, color: "#fff", marginBottom: 6, letterSpacing: "-0.3px" }}>{p.name}</div>
                      <div style={{ fontSize: "clamp(13px, 1.5vw, 15px)", fontWeight: 700, color: "#c8782a", letterSpacing: "-0.5px" }}>{p.price}</div>
                    </div>
                  </Link>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ STICKY BUY BAR ═══ */}
      <motion.div className="pdp-sticky-bar"
        initial={{ y: 100 }} animate={{ y: showBuyBar ? 0 : 100 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
        <div style={{ display: "flex", alignItems: "center", gap: "clamp(10px, 2vw, 16px)", minWidth: 0 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8, background: "#0a0a0a",
            border: "1px solid rgba(255,255,255,0.07)", position: "relative", overflow: "hidden", flexShrink: 0,
          }}>
            <Image src={product.image} alt={product.name} fill style={{ objectFit: "contain", padding: 4 }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: "clamp(12px, 1.5vw, 14px)", fontWeight: 600, color: "#fff", letterSpacing: "-0.3px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{product.name}</div>
            <div style={{ fontSize: "clamp(11px, 1.2vw, 12px)", color: "#c8782a", fontWeight: 700 }}>{product.price}</div>
          </div>
        </div>
        <button
          onClick={() => add({ id: product.id, name: product.name, price: product.price, image: product.image, storage: availableStorages[selectedStorage] })}
          style={{
            background: "#fff", color: "#000", border: "none", borderRadius: "100px",
            padding: "clamp(10px, 1.5vw, 12px) clamp(18px, 3vw, 28px)",
            fontSize: "clamp(12px, 1.2vw, 13px)", fontWeight: 700, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 7, fontFamily: "inherit", flexShrink: 0, whiteSpace: "nowrap",
          }}
        >
          <ShoppingBag size={14} /> Add to Bag
        </button>
      </motion.div>
    </div>
  );
}
