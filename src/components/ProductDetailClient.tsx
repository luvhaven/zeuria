"use client";
import { useState, use, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
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
  const inView = useInView(ref, { once: true, margin: "-80px" });
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
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 40 }}>
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
      gsap.to(img, { yPercent: 28, ease: "none",
        scrollTrigger: { trigger: img.parentElement!, start: "top bottom", end: "bottom top", scrub: true } });
    });
    gsap.utils.toArray<HTMLElement>(".pdp-reveal").forEach(el => {
      gsap.fromTo(el, { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none reverse" } });
    });
  }, { scope: container });

  const availableStorages = product.storage_options && product.storage_options.length > 0
    ? product.storage_options
    : ["Standard"];

  const TRUST = [
    { icon: "→", label: "24h Lagos Delivery", sub: "Order before 2 PM, get it today" },
    { icon: "◈", label: "Zeuria 12-Month Warranty", sub: "Full manufacturer coverage" },
    { icon: "◇", label: "7-Day Easy Returns", sub: "No questions asked" },
    { icon: "◉", label: "100% Genuine & Sealed", sub: "Factory-sealed, never refurbished" },
  ];

  const FAQS = [
    { q: "Is this brand new and sealed?", a: "Yes. Zeuria exclusively sells factory-sealed, brand new devices. Never refurbished, never open-box." },
    { q: "Do you offer warranty?", a: "Every device includes a minimum 12-month manufacturer warranty, with Zeuria assisting on all claims." },
    { q: "Can I pay on delivery?", a: "Pay on Delivery is available within Lagos. Other states require upfront payment before dispatch." },
    { q: "How long does delivery take?", a: "Lagos: within 24 hours. Nationwide: 48–72 hours via our secure logistics partners." },
    { q: "Do you accept trade-ins?", a: "Zeuria is dedicated exclusively to the distribution of pristine, factory-sealed devices. To maintain this uncompromising standard, we do not accept trade-ins or pre-owned electronics." },
  ];

  return (
    <div ref={container} style={{ background: "#000", color: "#fff", minHeight: "100vh", overflowX: "hidden" }}>

      {/* ═══ HERO ═══ */}
      <section style={{ position: "relative", height: "100vh", minHeight: 700, display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        {/* Parallax BG */}
        <motion.div style={{ position: "absolute", inset: "-5%", y: heroY }}>
          <Image src={product.images?.[0] || product.image} alt={product.name} fill
            style={{ objectFit: "cover", filter: "brightness(0.45)" }} priority />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.95) 100%)" }} />
        </motion.div>

        {/* Hero copy — bottom-left anchored */}
        <motion.div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 1380, margin: "0 auto", padding: "0 64px 72px", opacity: heroOpacity }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
            <div style={{ fontSize: 10, letterSpacing: "3px", color: "#c8782a", fontWeight: 700, textTransform: "uppercase", marginBottom: 18 }}>
              {product.brand} · {product.category}
            </div>
            <h1 style={{ fontSize: "clamp(56px, 8vw, 110px)", fontWeight: 800, letterSpacing: "-5px", lineHeight: 0.88, marginBottom: 24, maxWidth: 900 }}>
              {product.name}
            </h1>
            <p style={{ fontSize: "clamp(16px, 2vw, 20px)", fontWeight: 300, color: "rgba(255,255,255,0.6)", maxWidth: 520, lineHeight: 1.6 }}>
              {product.tagline}
            </p>
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          style={{ position: "absolute", right: 64, bottom: 48, zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{ width: 1, height: 48, background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.3))" }} />
          <span style={{ fontSize: 9, color: "#555", letterSpacing: "3px", textTransform: "uppercase" }}>Scroll</span>
        </motion.div>
      </section>

      {/* ═══ TRUST STRIP ═══ */}
      <section style={{ borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 1380, margin: "0 auto", padding: "0 64px", display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
          {TRUST.map((t, i) => (
            <div key={t.label} className="pdp-trust-item"
              style={{ borderRight: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none", paddingRight: i < 3 ? 28 : 0, paddingLeft: i > 0 ? 28 : 0 }}>
              <div className="pdp-trust-icon">
                <span style={{ fontSize: 14, color: "#c8782a" }}>{t.icon}</span>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 3 }}>{t.label}</div>
                <div style={{ fontSize: 11, color: "#555", letterSpacing: "0.3px" }}>{t.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ PURCHASE SECTION ═══ */}
      <section style={{ maxWidth: 1380, margin: "0 auto", padding: "100px 64px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>

        {/* LEFT: Product image — sticky */}
        <div style={{ position: "sticky", top: 100 }}>
          <div style={{ background: "#060606", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 28, overflow: "hidden", aspectRatio: "1", position: "relative" }}>
            <Image src={product.image} alt={product.name} fill style={{ objectFit: "contain", padding: 48 }} />
          </div>
          {/* Rating below image */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 20, paddingLeft: 4 }}>
            <div style={{ display: "flex", gap: 2 }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={13} fill="#c8782a" color="#c8782a" />)}
            </div>
            <span style={{ fontSize: 12, color: "#555" }}>4.9 · 128 reviews</span>
          </div>
        </div>

        {/* RIGHT: Config */}
        <div>
          <div style={{ fontSize: 10, letterSpacing: "3px", color: "#c8782a", fontWeight: 700, textTransform: "uppercase", marginBottom: 16 }}>{product.brand}</div>
          <h2 style={{ fontSize: "clamp(32px, 3.5vw, 48px)", fontWeight: 800, letterSpacing: "-2px", lineHeight: 0.95, marginBottom: 16 }}>{product.name}</h2>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#c8782a", letterSpacing: "-1px", marginBottom: 28 }}>{product.price}</div>
          <p style={{ fontSize: 15, fontWeight: 300, color: "#666", lineHeight: 1.7, marginBottom: 48 }}>{product.description}</p>

          {/* Color */}
          <div style={{ marginBottom: 36 }}>
            <div style={{ fontSize: 11, letterSpacing: "2px", color: "#555", fontWeight: 600, textTransform: "uppercase", marginBottom: 14 }}>Finish</div>
            <div style={{ display: "flex", gap: 10 }}>
              {product.colors.map((c: string, i: number) => (
                <button key={i} className={`pdp-color-swatch ${selectedColor === i ? "active" : ""}`}
                  style={{ background: c }} onClick={() => setSelectedColor(i)} />
              ))}
            </div>
          </div>

          {/* Storage */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontSize: 11, letterSpacing: "2px", color: "#555", fontWeight: 600, textTransform: "uppercase", marginBottom: 14 }}>Storage</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px,1fr))", gap: 10 }}>
              {availableStorages.map((s: string, i: number) => (
                <button key={s} className={`pdp-storage-btn ${selectedStorage === i ? "active" : ""}`}
                  onClick={() => setSelectedStorage(i)}>{s}</button>
              ))}
            </div>
          </div>

          {/* Add to bag box */}
          <div style={{ background: "#060606", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "28px 28px 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: "-0.5px" }}>{product.price}</div>
                <div style={{ fontSize: 11, color: "#555", marginTop: 3 }}>VAT & delivery included</div>
              </div>
              <div style={{ fontSize: 10, letterSpacing: "1.5px", color: "#c8782a", fontWeight: 700, background: "rgba(200,164,110,0.08)", border: "1px solid rgba(200,164,110,0.2)", borderRadius: 100, padding: "6px 12px", textTransform: "uppercase" }}>
                Only 3 left
              </div>
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
      <section style={{ padding: "60px 64px 80px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="pdp-reveal" style={{ maxWidth: 1380, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(48px, 7vw, 96px)", fontWeight: 800, letterSpacing: "-4px", lineHeight: 0.9, color: "#fff", maxWidth: 900 }}>
            {product.tagline || "Brilliance in every detail."}
          </h2>
          <p style={{ fontSize: 17, fontWeight: 300, color: "#555", marginTop: 28, maxWidth: 500, lineHeight: 1.7 }}>
            Designed to push the boundaries of what a {product.category.toLowerCase()} can do.
          </p>
        </div>
      </section>

      {/* ═══ FEATURE BLOCKS ═══ */}
      <section style={{ padding: "0 64px 100px", maxWidth: 1380, margin: "0 auto" }}>
        <FadeUp><PdpLabel title="Key features" /></FadeUp>

        {product.features.map((f: any, i: number) => {
          if (f.full) return (
            <FadeUp key={i} delay={0.04}>
              <div className="pdp-feature-full">
                <div className="feature-parallax" style={{ position: "absolute", top: "-20%", left: 0, right: 0, bottom: "-20%", zIndex: 0 }}>
                  <Image src={f.image} alt={f.title} fill style={{ objectFit: "cover" }} sizes="100vw" />
                </div>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 55%)", zIndex: 1 }} />
                <div style={{ position: "relative", zIndex: 2, padding: "48px 56px" }}>
                  <h3 style={{ fontSize: "clamp(32px, 4vw, 56px)", fontWeight: 800, letterSpacing: "-2px", marginBottom: 14 }}>{f.title}</h3>
                  <p style={{ fontSize: 16, fontWeight: 300, color: "rgba(255,255,255,0.65)", maxWidth: 520, lineHeight: 1.65 }}>{f.body}</p>
                </div>
              </div>
            </FadeUp>
          );
          return (
            <FadeUp key={i} delay={0.04}>
              <div className="pdp-feature-card" style={{ background: f.dark ? "#060606" : "#f5f5f0", color: f.dark ? "#fff" : "#000", gridTemplateColumns: f.image ? "1fr 1fr" : "1fr" }}>
                <div style={{ padding: "64px 56px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <h3 style={{ fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 800, letterSpacing: "-1.5px", lineHeight: 1.05, marginBottom: 18 }}>{f.title}</h3>
                  <p style={{ fontSize: 16, fontWeight: 300, color: f.dark ? "#666" : "#777", lineHeight: 1.7, maxWidth: 380 }}>{f.body}</p>
                </div>
                {f.image && (
                  <div style={{ position: "relative", minHeight: 380, overflow: "hidden" }}>
                    <Image src={f.image} alt={f.title} fill style={{ objectFit: "cover" }} sizes="50vw" />
                  </div>
                )}
              </div>
            </FadeUp>
          );
        })}
      </section>

      {/* ═══ SPECS ═══ */}
      <section style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "100px 64px" }}>
        <div style={{ maxWidth: 1380, margin: "0 auto" }}>
          <FadeUp><PdpLabel title="Technical specs" /></FadeUp>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px,1fr))", gap: 12 }}>
            {product.specs.map((s: any, i: number) => (
              <FadeUp key={i} delay={i * 0.04}>
                <div className="pdp-spec-card">
                  <span style={{ fontSize: 9, letterSpacing: "2.5px", color: "#555", fontWeight: 700, textTransform: "uppercase" }}>{s.label}</span>
                  <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.8px", color: "#fff", lineHeight: 1.2 }}>{s.value}</span>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ REVIEWS ═══ */}
      <section style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "100px 64px" }}>
        <div style={{ maxWidth: 1380, margin: "0 auto" }}>
          <FadeUp>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 56 }}>
              <div>
                <PdpLabel title="Customer reviews" />
                <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
                  <span style={{ fontSize: 64, fontWeight: 800, letterSpacing: "-4px", color: "#fff" }}>4.9</span>
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px,1fr))", gap: 14 }}>
            {product.reviews.map((r: any, i: number) => (
              <FadeUp key={i} delay={i * 0.06}>
                <div className="pdp-review-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{r.name}</div>
                      <div style={{ display: "flex", gap: 2, marginTop: 5 }}>
                        {[...Array(r.rating)].map((_, s) => <Star key={s} size={11} fill="#c8782a" color="#c8782a" />)}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <Check size={10} color="#4ade80" />
                      <span style={{ fontSize: 10, color: "#4ade80", letterSpacing: "1px" }}>VERIFIED</span>
                    </div>
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 300, color: "#888", lineHeight: 1.65 }}>&ldquo;{r.text}&rdquo;</p>
                  <div style={{ fontSize: 10, color: "#444", marginTop: 16, letterSpacing: "0.5px" }}>{r.date}</div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "100px 64px" }}>
        <div style={{ maxWidth: 840, margin: "0 auto" }}>
          <FadeUp><PdpLabel title="Frequently asked" /></FadeUp>
          {FAQS.map((faq, i) => (
            <FadeUp key={i} delay={i * 0.05}>
              <div className="pdp-faq-item" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 16, fontWeight: 600, color: "#fff", letterSpacing: "-0.3px" }}>{faq.q}</span>
                  <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <ChevronDown size={16} color="#555" />
                  </motion.div>
                </div>
                <motion.div initial={false}
                  animate={{ height: openFaq === i ? "auto" : 0, opacity: openFaq === i ? 1 : 0 }}
                  style={{ overflow: "hidden" }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
                  <p style={{ fontSize: 14, fontWeight: 300, color: "#666", lineHeight: 1.7, paddingTop: 14 }}>{faq.a}</p>
                </motion.div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ═══ RELATED ═══ */}
      {related.length > 0 && (
        <section style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "100px 64px" }}>
          <div style={{ maxWidth: 1380, margin: "0 auto" }}>
            <FadeUp>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 48 }}>
                <PdpLabel title={`More from ${product.brand}`} />
                <Link href="/shop" style={{ fontSize: 12, color: "#555", textDecoration: "none", display: "flex", alignItems: "center", gap: 5, letterSpacing: "0.5px", transition: "color 0.2s" }}>
                  View all <ArrowUpRight size={12} />
                </Link>
              </div>
            </FadeUp>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
              {related.map((p: any, i: number) => (
                <FadeUp key={p.id} delay={i * 0.07}>
                  <Link href={`/shop/${p.id}`} className="pdp-related-card">
                    <div style={{ aspectRatio: "1", position: "relative", background: "#0a0a0a" }}>
                      <Image src={p.image} alt={p.name} fill style={{ objectFit: "contain", padding: 32 }} sizes="33vw" />
                    </div>
                    <div style={{ padding: "20px 22px 22px" }}>
                      <div style={{ fontSize: 9, letterSpacing: "2px", color: "#555", fontWeight: 700, textTransform: "uppercase", marginBottom: 6 }}>{p.brand}</div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 8, letterSpacing: "-0.3px" }}>{p.name}</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#c8782a", letterSpacing: "-0.5px" }}>{p.price}</div>
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
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.07)", position: "relative", overflow: "hidden" }}>
            <Image src={product.image} alt={product.name} fill style={{ objectFit: "contain", padding: 4 }} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", letterSpacing: "-0.3px" }}>{product.name}</div>
            <div style={{ fontSize: 12, color: "#c8782a", fontWeight: 700 }}>{product.price}</div>
          </div>
        </div>
        <button onClick={() => add({ id: product.id, name: product.name, price: product.price, image: product.image, storage: availableStorages[selectedStorage] })}
          style={{ background: "#fff", color: "#000", border: "none", borderRadius: "100px", padding: "11px 28px", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 7, fontFamily: "inherit" }}>
          <ShoppingBag size={14} /> Add to Bag
        </button>
      </motion.div>
    </div>
  );
}
