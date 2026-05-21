"use client";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import type { ProductListItem } from "@/data/products";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroMarvel from "@/components/HeroMarvel";
import { ArrowUpRight } from "lucide-react";
import QuickAddButton from "@/components/QuickAddButton";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

/* ─── Fade-up wrapper ─────────────────────────────── */
function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

/* ─── Section label ───────────────────────────────── */
function SectionLabel({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="section-label">
      <div className="section-label-line" />
      <span className="section-label-title">{title}</span>
      {action && <>{action}</>}
    </div>
  );
}

/* ─── Celestial Gifting ───────────────────────────── */
function CelestialGiftSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Reveal animation
    gsap.fromTo(".celestial-content", 
      { opacity: 0, y: 50 }, 
      { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: containerRef.current, start: "top 60%" } }
    );

    // Canvas stars
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const stars = Array.from({ length: 150 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      alpha: Math.random(),
    }));

    let mouseX = width / 2;
    let mouseY = height / 2;

    const onMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      
      // Move orb
      gsap.to(orbRef.current, { x: mouseX, y: mouseY, duration: 0.6, ease: "power2.out" });
    };

    containerRef.current?.addEventListener("mousemove", onMouseMove);

    let rafId: number;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      stars.forEach(s => {
        // Parallax slightly away from mouse
        const dx = mouseX - s.x;
        const dy = mouseY - s.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 200) {
          s.x -= (dx / dist) * 0.5;
          s.y -= (dy / dist) * 0.5;
        }

        s.x += s.speedX;
        s.y += s.speedY;

        if (s.x < 0) s.x = width;
        if (s.x > width) s.x = 0;
        if (s.y < 0) s.y = height;
        if (s.y > height) s.y = 0;

        ctx.fillStyle = `rgba(255,255,255,${s.alpha * 0.8})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      });
      rafId = requestAnimationFrame(render);
    };
    render();

    return () => {
      containerRef.current?.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="celestial-container">
      <canvas ref={canvasRef} className="celestial-canvas" />
      <div ref={orbRef} className="celestial-orb" />
      
      <div className="celestial-content">
        <div className="celestial-box">
          <Image src="/iphone17pro.png" alt="Gift" width={80} height={80} style={{ objectFit: "contain", zIndex: 2 }} />
        </div>
        <div style={{ fontSize: 10, letterSpacing: "4px", color: "#c8782a", fontWeight: 700, textTransform: "uppercase", marginBottom: 20 }}>
          Zeuria Gifting
        </div>
        <h2 style={{ fontSize: "clamp(48px, 6vw, 84px)", fontWeight: 800, letterSpacing: "-3px", lineHeight: 0.95, color: "#fff", marginBottom: 24 }}>
          Wrap the future<br />in starlight.
        </h2>
        <p style={{ fontSize: 16, fontWeight: 300, color: "rgba(255,255,255,0.6)", maxWidth: 460, margin: "0 auto", lineHeight: 1.7 }}>
          Surprise someone special with the ultimate technology. Select any device, add a personalized celestial note, and we'll handle the magic.
        </p>
        <Link href="/shop" style={{ textDecoration: "none" }}>
          <button className="celestial-btn">
            Send a Gift <ArrowUpRight size={14} />
          </button>
        </Link>
      </div>
    </section>
  );
}

/* ─── Page ────────────────────────────────────────── */
export default function HomePageClient({ arrivals, featured = [] }: { arrivals: ProductListItem[]; featured?: ProductListItem[] }) {
  const container = useRef(null);
  const parallaxSection = useRef(null);
  const parallaxImage = useRef(null);
  const statSection = useRef(null);

  useGSAP(() => {
    // Parallax lifestyle section
    if (parallaxSection.current && parallaxImage.current) {
      gsap.to(parallaxImage.current, {
        yPercent: 18, ease: "none",
        scrollTrigger: { trigger: parallaxSection.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    }
    // Ecosystem images parallax
    gsap.utils.toArray<HTMLElement>(".eco-img-parallax").forEach(img => {
      gsap.fromTo(img, { y: 40 }, {
        y: -30, ease: "none",
        scrollTrigger: { trigger: img.closest(".eco-card")!, start: "top bottom", end: "bottom top", scrub: true },
      });
    });
    // Stat counters animate up
    gsap.utils.toArray<HTMLElement>(".stat-number").forEach(el => {
      gsap.from(el, {
        textContent: 0,
        duration: 1.5,
        ease: "power2.out",
        snap: { textContent: 1 },
        scrollTrigger: { trigger: statSection.current, start: "top 75%", toggleActions: "play none none none" },
      });
    });
  }, { scope: container });

  return (
    <div ref={container} style={{ background: "#000" }}>
      {/* ══════════════════════════════════════ HERO ══ */}
      <HeroMarvel items={featured} />

      {/* ═══════════════════════════ 01 · NEW ARRIVALS ══ */}
      <section style={{ padding: "120px 0 80px", overflow: "hidden" }}>
        <div style={{ maxWidth: 1380, margin: "0 auto", padding: "0 64px 0" }}>
          <FadeUp>
            <SectionLabel title="New Arrivals"
              action={<Link href="/shop" className="section-view-all">All devices <ArrowUpRight size={12} /></Link>} />
          </FadeUp>
        </div>

        {/* Horizontal scroll cards */}
        <div className="hide-scrollbar" style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 8, paddingLeft: "max(64px, calc((100vw - 1380px) / 2 + 64px))", paddingRight: 40, cursor: "grab" }}>
          {arrivals.map((item, i) => (
            <motion.div key={item.id}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}>
              <Link href={`/shop/${item.id}`} className="arrival-card">
                {/* Image */}
                <div style={{ width: "100%", aspectRatio: "1", position: "relative", background: "#0d0d0d", overflow: "hidden" }}>
                  <div className="arrival-img" style={{ position: "absolute", inset: 0 }}>
                    <Image src={item.image} alt={item.name} fill style={{ objectFit: "cover" }} sizes="300px" />
                  </div>
                  {item.badge && (
                    <div style={{ position: "absolute", top: 14, left: 14, fontSize: 9, fontWeight: 700, letterSpacing: "2px", color: "#c8782a", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)", padding: "5px 10px", borderRadius: "100px", border: "1px solid rgba(200,164,110,0.2)" }}>
                      {item.badge}
                    </div>
                  )}
                </div>
                {/* Meta */}
                <div style={{ padding: "20px 22px 22px" }}>
                  <div style={{ fontSize: 9, letterSpacing: "2.5px", color: "#555", fontWeight: 600, textTransform: "uppercase", marginBottom: 6 }}>{item.brand} · {item.category}</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 10, letterSpacing: "-0.3px" }}>{item.name}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: "#c8782a", letterSpacing: "-0.5px" }}>{item.price}</span>
                  </div>
                  <QuickAddButton product={item} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════ 02 · CATEGORIES ══ */}
      <section style={{ maxWidth: 1380, margin: "0 auto", padding: "80px 64px" }}>
        <FadeUp delay={0.1}>
          <SectionLabel title="Shop by category" />
        </FadeUp>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
          {[
            { label: "iPhone", href: "/iphone", sub: "from ₦1,140,000", idx: "→" },
            { label: "Samsung", href: "/samsung", sub: "from ₦900,000", idx: "→" },
            { label: "Pixel", href: "/pixel", sub: "from ₦1,050,000", idx: "→" },
            { label: "Accessories", href: "/accessories", sub: "from ₦45,000", idx: "→" },
          ].map((cat, i) => (
            <FadeUp key={cat.href} delay={i * 0.07}>
              <Link href={cat.href} className="cat-tile">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <span style={{ fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-0.5px" }}>{cat.label}</span>
                  <span style={{ fontSize: 16, color: "#444", marginTop: 2 }}>{cat.idx}</span>
                </div>
                <div style={{ fontSize: 11, color: "#444", letterSpacing: "0.5px", fontWeight: 400 }}>{cat.sub}</div>
              </Link>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════ 03 · ECOSYSTEM ══ */}
      <section style={{ maxWidth: 1380, margin: "0 auto", padding: "20px 64px 100px" }}>
        <FadeUp delay={0.1}>
          <SectionLabel title="Device ecosystems" />
        </FadeUp>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

          {/* Apple */}
          <FadeUp delay={0.05}>
            <Link href="/iphone" className="eco-card">
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(145deg, #0a0907 0%, #050505 100%)" }} />
              {/* Background number */}
              <div style={{ position: "absolute", right: -20, bottom: -40, fontSize: 220, fontWeight: 900, color: "rgba(255,255,255,0.02)", lineHeight: 1, userSelect: "none", fontFamily: "inherit" }}>A</div>
              <div style={{ position: "relative", zIndex: 2, padding: "44px 44px 0" }}>
                <div style={{ fontSize: 10, letterSpacing: "3px", color: "#c8782a", fontWeight: 700, marginBottom: 16, textTransform: "uppercase" }}>Apple · iPhone</div>
                <h3 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-1.5px", lineHeight: 1, color: "#fff", marginBottom: 10 }}>The Apple<br />Ecosystem.</h3>
                <p style={{ fontSize: 15, fontWeight: 300, color: "#555", lineHeight: 1.6, maxWidth: 280 }}>Seamless integration across every device you own.</p>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 24, fontSize: 12, color: "#666", letterSpacing: "0.5px" }}>
                  Explore iPhones <ArrowUpRight size={12} />
                </div>
              </div>
              <div className="eco-img-parallax eco-device" style={{ position: "absolute", bottom: -30, right: 24, width: 240, height: 480 }}>
                <Image src="https://images.unsplash.com/photo-1592899677974-c48ebf8ee204?w=600&q=80&auto=format" alt="Apple" fill style={{ objectFit: "cover", borderRadius: 16, opacity: 0.9 }} sizes="260px" />
              </div>
            </Link>
          </FadeUp>

          {/* Samsung */}
          <FadeUp delay={0.12}>
            <Link href="/samsung" className="eco-card">
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(145deg, #04080f 0%, #020408 100%)" }} />
              <div style={{ position: "absolute", right: -20, bottom: -40, fontSize: 220, fontWeight: 900, color: "rgba(96,165,250,0.04)", lineHeight: 1, userSelect: "none", fontFamily: "inherit" }}>S</div>
              <div style={{ position: "relative", zIndex: 2, padding: "44px 44px 0" }}>
                <div style={{ fontSize: 10, letterSpacing: "3px", color: "#60A5FA", fontWeight: 700, marginBottom: 16, textTransform: "uppercase" }}>Samsung · Galaxy</div>
                <h3 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-1.5px", lineHeight: 1, color: "#fff", marginBottom: 10 }}>Galaxy<br />Connected.</h3>
                <p style={{ fontSize: 15, fontWeight: 300, color: "#555", lineHeight: 1.6, maxWidth: 280 }}>Galaxy AI built into every moment of your day.</p>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 24, fontSize: 12, color: "#666", letterSpacing: "0.5px" }}>
                  Explore Galaxy <ArrowUpRight size={12} />
                </div>
              </div>
              <div className="eco-img-parallax eco-device" style={{ position: "absolute", bottom: -30, right: 24, width: 240, height: 480 }}>
                <Image src="https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?w=600&q=80&auto=format" alt="Samsung" fill style={{ objectFit: "cover", borderRadius: 16, opacity: 0.9 }} sizes="260px" />
              </div>
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ═══════════════════════ 04 · TRUST NUMBERS ══ */}
      <section ref={statSection} style={{ borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "72px 64px" }}>
        <div style={{ maxWidth: 1380, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 32 }}>
          {[
            { num: "5000", suffix: "+", label: "Happy Nigerians" },
            { num: "500", suffix: "+", label: "Devices in stock" },
            { num: "24", suffix: "h", label: "Lagos delivery" },
            { num: "4.9", suffix: "★", label: "Average rating" },
          ].map((s, i) => (
            <FadeUp key={s.label} delay={i * 0.08}>
              <div style={{ borderRight: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none", paddingRight: 32 }}>
                <div style={{ fontSize: 52, fontWeight: 800, letterSpacing: "-3px", color: "#fff", lineHeight: 1 }}>
                  <span className="stat-number">{s.num}</span>
                  <span style={{ color: "#c8782a" }}>{s.suffix}</span>
                </div>
                <div style={{ fontSize: 12, color: "#444", marginTop: 10, letterSpacing: "1px", fontWeight: 400, textTransform: "uppercase" }}>{s.label}</div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ══════════════════ 05 · LIFESTYLE PARALLAX ══ */}
      <section ref={parallaxSection} style={{ position: "relative", height: "75vh", minHeight: 560, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <div ref={parallaxImage} style={{ position: "absolute", top: "-20%", left: 0, right: 0, bottom: "-20%", zIndex: 0 }}>
          <Image src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=2000&q=80&auto=format" alt="Tech Lifestyle" fill style={{ objectFit: "cover" }} sizes="100vw" />
        </div>
        {/* Overlays */}
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.8) 0%, transparent 60%)", zIndex: 2 }} />

        {/* Content — left-aligned editorial */}
        <div style={{ position: "relative", zIndex: 3, maxWidth: 1380, width: "100%", padding: "0 64px" }}>
          <FadeUp>
            <div style={{ fontSize: 10, letterSpacing: "3px", color: "#c8782a", fontWeight: 700, textTransform: "uppercase", marginBottom: 24 }}>Our Promise</div>
            <h2 style={{ fontSize: "clamp(44px, 6vw, 80px)", fontWeight: 800, letterSpacing: "-3px", lineHeight: 0.9, color: "#fff", marginBottom: 28, maxWidth: 700 }}>
              Technology<br />that defines you.
            </h2>
            <p style={{ fontSize: 16, fontWeight: 300, color: "rgba(255,255,255,0.5)", maxWidth: 420, lineHeight: 1.7, marginBottom: 40 }}>
              Curated exclusively for those who demand the best. Zeuria delivers the world's most advanced devices to your door in Lagos.
            </p>
            <Link href="/stories" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, color: "#fff", fontWeight: 500, textDecoration: "none", letterSpacing: "0.5px", borderBottom: "1px solid rgba(255,255,255,0.3)", paddingBottom: 4, transition: "border-color 0.2s" }}>
              Discover our philosophy <ArrowUpRight size={13} />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ══════════════════════ CELESTIAL GIFTING ══ */}
      <CelestialGiftSection />

      {/* ══════════════════════ 06 · READ & RESEARCH ══ */}
      <section style={{ maxWidth: 1380, margin: "0 auto", padding: "100px 64px" }}>
        <FadeUp delay={0.1}>
          <SectionLabel title="Read before you buy" action={<Link href="/stories" className="section-view-all">All stories <ArrowUpRight size={12} /></Link>} />
        </FadeUp>

        {/* Magazine asymmetric grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16 }}>
          {/* Large left story */}
          <FadeUp delay={0.05}>
            <Link href="/stories/iphone-17-pro-lagos" className="story-card-lg">
              <div style={{ aspectRatio: "4/3", position: "relative", overflow: "hidden" }}>
                <div className="story-img-inner" style={{ position: "absolute", inset: 0 }}>
                  <Image src="/iphone17pro.png" alt="iPhone 17 Pro Lagos" fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 60vw" />
                </div>
                {/* Gradient overlay */}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 55%)" }} />
                {/* Text overlay */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "28px 32px" }}>
                  <div style={{ fontSize: 9, letterSpacing: "2.5px", color: "#c8782a", fontWeight: 700, marginBottom: 10, textTransform: "uppercase" }}>Field Test · 6 Min Read</div>
                  <h3 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.8px", color: "#fff", lineHeight: 1.2 }}>Three days in Lagos with the iPhone 17 Pro.</h3>
                </div>
              </div>
            </Link>
          </FadeUp>

          {/* Right column — two small stories */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { id: "iphone-vs-galaxy-2026", tag: "Buyer's Guide · 8 Min", title: "iPhone vs Galaxy in 2026: who's it really for?", image: "/galaxy_s26_ultra.png" },
              { id: "pixel-nigeria", tag: "Long Read · 5 Min", title: "Why Pixel is finally the right Android for Nigeria.", image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=80&auto=format" },
            ].map((s, i) => (
              <FadeUp key={s.id} delay={0.1 + i * 0.07} className="story-card-sm" >
                <Link href={`/stories/${s.id}`} className="story-card-sm" style={{ flex: 1 }}>
                  {/* Thumbnail */}
                  <div style={{ width: 88, height: 88, flexShrink: 0, borderRadius: 12, overflow: "hidden", position: "relative", background: "#111" }}>
                    <div className="story-img-inner" style={{ position: "absolute", inset: 0 }}>
                      <Image src={s.image} alt={s.title} fill style={{ objectFit: "cover" }} sizes="88px" />
                    </div>
                  </div>
                  {/* Text */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 9, letterSpacing: "2px", color: "#555", fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>{s.tag}</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "#fff", lineHeight: 1.35, letterSpacing: "-0.3px" }}>{s.title}</div>
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ 07 · NEWSLETTER ══ */}
      <section style={{ maxWidth: 1380, margin: "0 auto", padding: "0 64px 140px" }}>
        <FadeUp>
          <div style={{
            background: "#060606",
            border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: 28,
            padding: "72px 72px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            alignItems: "center",
          }}>
            {/* Left: copy */}
            <div>
              <h2 style={{ fontSize: "clamp(36px, 4vw, 56px)", fontWeight: 800, letterSpacing: "-2.5px", lineHeight: 0.92, color: "#fff", marginBottom: 18 }}>
                Stay ahead<br />of the drop.
              </h2>
              <p style={{ fontSize: 15, fontWeight: 300, color: "#555", lineHeight: 1.7, maxWidth: 360 }}>
                Be the first to know when new devices land at Zeuria. No spam — just launches, deals, and what's next.
              </p>
              <div style={{ fontSize: 11, color: "#333", marginTop: 20, letterSpacing: "0.5px" }}>Join 2,400+ Zeuria insiders</div>
            </div>

            {/* Right: form */}
            <div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  aria-label="Email for newsletter"
                  style={{
                    background: "#0d0d0d",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 12,
                    padding: "18px 22px",
                    color: "#fff",
                    fontSize: 14,
                    fontFamily: "inherit",
                    outline: "none",
                    letterSpacing: "0.2px",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={e => (e.target.style.borderColor = "rgba(200,164,110,0.4)")}
                  onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
                />
                <button 
                  onClick={() => alert("Thanks for subscribing! Check your email for confirmation.")}
                  style={{
                  background: "#fff",
                  color: "#000",
                  border: "none",
                  borderRadius: 12,
                  padding: "17px 32px",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  letterSpacing: "0.2px",
                  transition: "opacity 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                >
                  Subscribe <ArrowUpRight size={15} />
                </button>
              </div>
              <p style={{ fontSize: 11, color: "#333", marginTop: 14, letterSpacing: "0.3px" }}>Unsubscribe anytime. No spam, ever.</p>
            </div>
          </div>
        </FadeUp>
      </section>
    </div>
  );
}
