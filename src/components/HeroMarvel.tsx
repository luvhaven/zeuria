"use client";
import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ProductListItem } from "@/data/products";
import { lazy, Suspense } from "react";

const PhoneCanvas3D = lazy(() => import("@/components/PhoneCanvas3D"));

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);
}

interface HeroDevice {
  id: string; name: string; headline: string; sub: string;
  price: string; brand: string; image: string; accent: string; accentRgb: string;
}

const DEFAULT_DEVICES: HeroDevice[] = [
  { id: "iphone-17-pro", name: "iPhone 17 Pro", headline: "Titanium.\nBorn to\nperform.", sub: "The most advanced camera system ever in a smartphone.", price: "₦1,650,000", brand: "APPLE · 2026", image: "/iphone17pro.png", accent: "#C8A46E", accentRgb: "200,164,110" },
  { id: "galaxy-s26-ultra", name: "Galaxy S26 Ultra", headline: "Galaxy AI.\nPower\nredefined.", sub: "Built for the ones who demand everything from everything.", price: "₦1,380,000", brand: "SAMSUNG · ULTRA", image: "/galaxy_s26_ultra.png", accent: "#60A5FA", accentRgb: "96,165,250" },
  { id: "pixel-10-pro", name: "Pixel 10 Pro", headline: "Google AI.\nEvery shot\ncounts.", sub: "Magic Eraser. Night Sight. Shots that feel like memories.", price: "₦1,050,000", brand: "GOOGLE · PRO", image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80&auto=format", accent: "#4ADE80", accentRgb: "74,222,128" },
];

const BASE_TEMPLATES: Record<string, { headline: string; sub: string; accent: string; accentRgb: string }> = {
  "iphone-17-pro": { headline: "Titanium.\nBorn to\nperform.", sub: "The most advanced camera system ever in a smartphone.", accent: "#C8A46E", accentRgb: "200,164,110" },
  "galaxy-s26-ultra": { headline: "Galaxy AI.\nPower\nredefined.", sub: "Built for the ones who demand everything from everything.", accent: "#60A5FA", accentRgb: "96,165,250" },
  "pixel-10-pro": { headline: "Google AI.\nEvery shot\ncounts.", sub: "Magic Eraser. Night Sight. Shots that feel like memories.", accent: "#4ADE80", accentRgb: "74,222,128" },
};

const TICKER = ["24-Hour Lagos Delivery", "100% Genuine Devices", "4.9 ★ Average Rating", "500+ Devices In Stock", "Nigeria's #1 Premium Store", "12-Month Warranty", "Buy Now, Pay Later", "Free Setup & Support"];

export default function HeroMarvel({ items = [] }: { items?: ProductListItem[] }) {
  const heroRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);

  const [devices, setDevices] = useState<HeroDevice[]>(DEFAULT_DEVICES);
  const [active, setActive] = useState(0);
  const [locked, setLocked] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [progress, setProgress] = useState(0);
  const progressRaf = useRef<number>(0);
  const progressStart = useRef<number>(0);
  const INTERVAL = 6000;

  // Touch / swipe support
  const touchStartX = useRef(0);
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 48) advance(diff > 0 ? 1 : -1);
  }, []); // eslint-disable-line

  // Responsive breakpoint
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Map Supabase products → HeroDevice
  useEffect(() => {
    if (!items || items.length === 0) return;
    const mapped = items.map(item => {
      const slug = item.id;
      const template = BASE_TEMPLATES[slug];
      let formattedBrand = item.brand.toUpperCase();
      if (slug.includes("iphone-17-pro")) formattedBrand += " · 2026";
      else if (slug.includes("s26-ultra")) formattedBrand += " · ULTRA";
      else if (slug.includes("pixel-10-pro")) formattedBrand += " · PRO";
      else formattedBrand += " · FEATURED";
      let accent = "#c8782a", accentRgb = "200,120,42";
      if (item.brand.toLowerCase() === "apple") { accent = "#C8A46E"; accentRgb = "200,164,110"; }
      else if (item.brand.toLowerCase() === "samsung") { accent = "#60A5FA"; accentRgb = "96,165,250"; }
      else if (item.brand.toLowerCase() === "google") { accent = "#4ADE80"; accentRgb = "74,222,128"; }
      return { id: slug, name: item.name, headline: template?.headline || item.tagline || item.name, sub: template?.sub || item.tagline || "", price: item.price, brand: formattedBrand, image: item.image, accent: template?.accent || accent, accentRgb: template?.accentRgb || accentRgb };
    });
    const heroSlugs = ["iphone-17-pro", "galaxy-s26-ultra", "pixel-10-pro"];
    const heroItems = mapped.filter(d => heroSlugs.includes(d.id));
    const otherItems = mapped.filter(d => !heroSlugs.includes(d.id));
    const combined = [...heroItems, ...otherItems];
    if (combined.length > 0) setDevices(combined);
  }, [items]);

  const device = devices[active] ?? devices[0] ?? DEFAULT_DEVICES[0];

  // Mouse parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 30, damping: 20 });
  const sy = useSpring(my, { stiffness: 30, damping: 20 });
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    mx.set((e.clientX / window.innerWidth - 0.5) * 18);
    my.set((e.clientY / window.innerHeight - 0.5) * 10);
  }, [mx, my]);

  // Canvas particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const pts = Array.from({ length: 55 }, () => ({
      x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
      r: Math.random() * 1.1 + 0.2, vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
      o: Math.random() * 0.22 + 0.06,
    }));
    let mouse = { x: -999, y: -999 };
    const onMM = (e: MouseEvent) => { mouse = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", onMM);
    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of pts) {
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 100 && d > 0) { p.vx += (dx / d) * 0.1; p.vy += (dy / d) * 0.1; }
        p.vx *= 0.97; p.vy *= 0.97;
        p.x = (p.x + p.vx + canvas.width) % canvas.width;
        p.y = (p.y + p.vy + canvas.height) % canvas.height;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.o})`; ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); window.removeEventListener("mousemove", onMM); };
  }, []);

  // Carousel advance
  const advance = useCallback((d: 1 | -1, fromTimer = false) => {
    if (locked) return;
    if (!fromTimer && timerRef.current) clearInterval(timerRef.current);
    setLocked(true);
    setActive(n => (n + d + devices.length) % devices.length);
    progressStart.current = performance.now();
    setProgress(0);
    setTimeout(() => setLocked(false), 750);
    if (!fromTimer) startTimer();
  }, [locked, devices.length]); // eslint-disable-line

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    progressStart.current = performance.now();
    timerRef.current = setInterval(() => advance(1, true), INTERVAL);
  }, [advance]);

  useEffect(() => {
    startTimer();
    const tick = () => {
      const elapsed = (performance.now() - progressStart.current) % INTERVAL;
      setProgress(elapsed / INTERVAL);
      progressRaf.current = requestAnimationFrame(tick);
    };
    progressRaf.current = requestAnimationFrame(tick);
    return () => { if (timerRef.current) clearInterval(timerRef.current); cancelAnimationFrame(progressRaf.current); };
  }, []); // eslint-disable-line

  // Light sweep
  useEffect(() => {
    if (!sweepRef.current) return;
    gsap.fromTo(sweepRef.current, { x: "-100%", opacity: 0.8 }, { x: "200%", opacity: 0, duration: 1.8, ease: "power2.inOut", delay: 0.8 });
  }, []);

  // SplitText headline
  useGSAP(() => {
    if (!headlineRef.current) return;
    const split = new SplitText(headlineRef.current, { type: "words,chars" });
    gsap.from(split.chars, { opacity: 0, y: 40, rotateX: -70, stagger: 0.016, duration: 0.9, ease: "power4.out", delay: 0.1 });
    return () => split.revert();
  }, { scope: heroRef, dependencies: [active] });

  // Scroll exit (desktop only)
  useGSAP(() => {
    if (!stageRef.current || isMobile) return;
    gsap.to(stageRef.current, {
      opacity: 0, y: -40,
      scrollTrigger: { trigger: heroRef.current, start: "top top", end: "45% top", scrub: true },
    });
  }, { scope: heroRef, dependencies: [isMobile] });

  const magnet = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    gsap.to(e.currentTarget, { x: (e.clientX - r.left - r.width / 2) * 0.28, y: (e.clientY - r.top - r.height / 2) * 0.28, duration: 0.35 });
  };
  const magnetOff = (e: React.MouseEvent<HTMLElement>) => gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.65, ease: "elastic.out(1,0.5)" });

  const CIRC = 2 * Math.PI * 18;

  // ─── MOBILE LAYOUT ─────────────────────────────────────────────────
  if (isMobile) {
    return (
      <section
        ref={heroRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          position: "relative",
          height: "100dvh", // use dvh for perfect mobile fit
          minHeight: 560,
          overflow: "hidden",
          background: "#000",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }} />

        {/* Accent orb */}
        <motion.div
          animate={{ background: `radial-gradient(circle, rgba(${device.accentRgb},0.2) 0%, transparent 75%)` }}
          transition={{ duration: 1.4 }}
          style={{ position: "absolute", inset: 0, filter: "blur(60px)", zIndex: 1, pointerEvents: "none" }}
        />

        {/* Top ticker bar */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, zIndex: 10,
          borderBottom: "1px solid rgba(255,255,255,0.04)",
          background: "rgba(0,0,0,0.4)", backdropFilter: "blur(12px)",
          padding: "env(safe-area-inset-top, 0px) 0 0 0", // handles notch if header is transparent
        }}>
          <div style={{ padding: "8px 0", overflow: "hidden" }}>
            <div style={{ display: "flex", animation: "heroTicker 28s linear infinite", whiteSpace: "nowrap" }}>
              {[...TICKER, ...TICKER].map((item, i) => (
                <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 20, padding: "0 20px" }}>
                  <span style={{ fontSize: 10, color: "#777", letterSpacing: "1.5px", fontWeight: 600, textTransform: "uppercase" }}>{item}</span>
                  <span style={{ width: 2, height: 2, borderRadius: "50%", background: "#444", flexShrink: 0 }} />
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom gradient overlay for text legibility */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "60%",
          background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.8) 35%, transparent 100%)",
          zIndex: 2, pointerEvents: "none",
        }} />

        {/* Main Flex Container */}
        <div style={{ position: "relative", zIndex: 5, flex: 1, display: "flex", flexDirection: "column", paddingBottom: "max(24px, env(safe-area-inset-bottom))" }}>

          {/* Top Image Area: Flexes to fill available space automatically */}
          <div style={{ flex: "1 1 auto", position: "relative", minHeight: 0, marginTop: 45 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={`mob-device-${active}`}
                initial={{ opacity: 0, scale: 1.05, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                style={{ position: "absolute", inset: "20px clamp(20px, 8vw, 40px) 0" }} // Responsive bounding box
              >
                <Image
                  src={device.image} alt={device.name} fill priority
                  style={{
                    objectFit: "contain",
                    objectPosition: "center bottom", // Anchors device nicely above text
                    filter: `drop-shadow(0 20px 40px rgba(0,0,0,0.7)) drop-shadow(0 0 40px rgba(${device.accentRgb}, 0.2))`
                  }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Text Area: Fixed to content size */}
          <div style={{ flex: "0 0 auto", padding: "0 clamp(20px, 6vw, 32px)", paddingTop: 20 }}>
            {/* Brand badge */}
            <AnimatePresence mode="wait">
              <motion.div key={`mob-brand-${active}`}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}
              >
                <span style={{ width: 4, height: 4, borderRadius: "50%", background: device.accent }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2.5px", color: device.accent, textTransform: "uppercase" }}>{device.brand}</span>
              </motion.div>
            </AnimatePresence>

            {/* Headline */}
            <AnimatePresence mode="wait">
              <motion.div key={`mob-hl-${active}`}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, delay: 0.05 }}
              >
                <h1 ref={headlineRef} style={{
                  fontSize: "clamp(36px, 10vw, 54px)", fontWeight: 800, letterSpacing: "-1.5px",
                  lineHeight: 0.95, color: "#fff", whiteSpace: "pre-line", marginBottom: 12,
                }}>
                  {device.headline}
                </h1>
              </motion.div>
            </AnimatePresence>

            {/* Sub */}
            <AnimatePresence mode="wait">
              <motion.p key={`mob-sub-${active}`}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, delay: 0.1 }}
                style={{ fontSize: "clamp(13px, 4vw, 15px)", color: "#aaa", lineHeight: 1.5, marginBottom: 16, fontWeight: 300, maxWidth: "100%" }}
              >
                {device.sub}
              </motion.p>
            </AnimatePresence>

            {/* Price */}
            <AnimatePresence mode="wait">
              <motion.div key={`mob-price-${active}`}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, delay: 0.12 }}
                style={{ marginBottom: 20 }}
              >
                <span style={{ fontSize: 12, color: "#666", marginRight: 6 }}>from</span>
                <span style={{ fontSize: 24, fontWeight: 700, color: device.accent, letterSpacing: "-0.5px" }}>{device.price}</span>
              </motion.div>
            </AnimatePresence>

            {/* CTAs */}
            <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
              <Link href={`/shop/${device.id}`} style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                background: "#fff", color: "#000", padding: "14px 18px", borderRadius: "100px",
                fontSize: 14, fontWeight: 700, textDecoration: "none",
                boxShadow: `0 4px 14px rgba(255,255,255,0.15)`
              }}>
                Shop Now <ArrowUpRight size={16} />
              </Link>
              <Link href="/shop" style={{
                display: "flex", alignItems: "center", justifyContent: "center", padding: "14px 20px",
                border: "1px solid rgba(255,255,255,0.12)", color: "#ccc", borderRadius: "100px",
                fontSize: 14, fontWeight: 500, textDecoration: "none", whiteSpace: "nowrap",
                background: "rgba(255,255,255,0.02)"
              }}>
                Explore
              </Link>
            </div>

            {/* Carousel controls */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
              <button onClick={() => advance(-1)} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#888" }}>
                <ChevronLeft size={16} />
              </button>
              <div style={{ display: "flex", gap: 6 }}>
                {devices.map((_, i) => (
                  <motion.div key={i}
                    animate={{ width: i === active ? 24 : 6, background: i === active ? device.accent : "rgba(255,255,255,0.15)" }}
                    transition={{ duration: 0.3 }}
                    style={{ height: 6, borderRadius: 3, cursor: "pointer" }}
                    onClick={() => i !== active && advance(i > active ? 1 : -1)}
                  />
                ))}
              </div>
              <button onClick={() => advance(1)} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#888" }}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ─── DESKTOP LAYOUT ────────────────────────────────────────────────
  return (
    <section
      ref={heroRef}
      onMouseMove={onMouseMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ position: "relative", height: "100vh", minHeight: "720px", overflow: "hidden", background: "#000", display: "flex", flexDirection: "column" }}
    >
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }} />

      {/* Accent orb */}
      <motion.div
        animate={{ background: `radial-gradient(circle, rgba(${device.accentRgb},0.18) 0%, transparent 68%)` }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
        style={{ position: "absolute", width: 900, height: 900, borderRadius: "50%", top: "50%", right: -200, transform: "translateY(-50%)", filter: "blur(90px)", zIndex: 1, pointerEvents: "none" }}
      />

      {/* Light sweep */}
      <div ref={sweepRef} style={{ position: "absolute", top: 0, left: 0, width: "40%", height: "100%", zIndex: 5, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)", pointerEvents: "none" }} />

      {/* MAIN STAGE */}
      <div ref={stageRef} style={{
        position: "relative", zIndex: 10, flex: 1,
        display: "grid", gridTemplateColumns: "1fr 1fr",
        maxWidth: 1380, width: "100%", margin: "0 auto",
        padding: "0 clamp(24px, 5vw, 64px)", gap: 24, alignItems: "center",
      }}>

        {/* ─── LEFT: Text ─── */}
        <motion.div style={{ x: sx, y: sy, display: "flex", flexDirection: "column", justifyContent: "center" }}>

          <AnimatePresence mode="wait">
            <motion.div key={`brand-${active}`}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}
            >
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "3px", color: device.accent, textTransform: "uppercase" }}>{device.brand}</span>
              <span style={{ width: 24, height: 1, background: `rgba(${device.accentRgb},0.5)` }} />
              <span style={{ fontSize: 10, fontWeight: 400, letterSpacing: "2px", color: "#555", textTransform: "uppercase" }}>ZEURIA NIGERIA</span>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div key={`hl-${active}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }}>
              <h1 ref={headlineRef} style={{
                fontSize: "clamp(52px, 6.5vw, 96px)", fontWeight: 800, letterSpacing: "-4px",
                lineHeight: 0.88, color: "#fff", perspective: "600px", whiteSpace: "pre-line", marginBottom: 0,
              }}>
                {device.headline}
              </h1>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.p key={`sub-${active}`}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.45, delay: 0.08 }}
              style={{ fontSize: "clamp(14px, 1.3vw, 17px)", fontWeight: 300, color: "#666", lineHeight: 1.6, marginTop: 24, marginBottom: 0, maxWidth: 400 }}
            >
              {device.sub}
            </motion.p>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div key={`price-${active}`}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.12 }}
              style={{ marginTop: 28, marginBottom: 40 }}
            >
              <span style={{ fontSize: 13, color: "#555", marginRight: 4 }}>from</span>
              <span style={{ fontSize: 28, fontWeight: 700, color: device.accent, letterSpacing: "-1px" }}>{device.price}</span>
            </motion.div>
          </AnimatePresence>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.45 }}
            style={{ display: "flex", alignItems: "center", gap: 20 }}
          >
            <Link href={`/shop/${device.id}`} onMouseMove={magnet} onMouseLeave={magnetOff}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", color: "#000", padding: "15px 32px", borderRadius: "100px", fontSize: 14, fontWeight: 700, textDecoration: "none", transition: "box-shadow 0.3s" }}
              className="hero-cta-primary"
            >
              Shop Now <ArrowUpRight size={16} />
            </Link>
            <Link href="/shop" onMouseMove={magnet} onMouseLeave={magnetOff}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#555", fontSize: 14, fontWeight: 500, textDecoration: "none", letterSpacing: "0.2px", transition: "color 0.2s" }}
              className="link-hover"
            >
              View all devices →
            </Link>
          </motion.div>
        </motion.div>

        {/* ─── RIGHT: Device Carousel (+ 3D Background) ─── */}
        <motion.div style={{ x: sx, y: sy, position: "relative", height: "80vh", minHeight: 620, display: "flex", alignItems: "center", justifyContent: "center" }}>

          {/* 3D Interactive Phone Canvas (atmospheric backdrop) */}
          <Suspense fallback={null}>
            <PhoneCanvas3D style={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.55, pointerEvents: "none" }} />
          </Suspense>

          {/* Inner spotlight */}
          <motion.div
            animate={{ background: `radial-gradient(ellipse 50% 60% at 50% 50%, rgba(${device.accentRgb},0.09) 0%, transparent 70%)` }}
            transition={{ duration: 1.2 }}
            style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
          />

          {/* Halo ring */}
          <motion.div
            animate={{ borderColor: `rgba(${device.accentRgb},0.12)` }}
            transition={{ duration: 1.2 }}
            style={{ position: "absolute", width: 420, height: 420, borderRadius: "50%", border: "1px solid", top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none" }}
          />

          {/* ─── 3-Device Coverflow Carousel ─── */}
          <div style={{ position: "relative", width: 380, height: 760, perspective: "1400px" }}>
            {devices.map((d, idx) => {
              const n = devices.length;
              let offset = ((idx - active) % n + n) % n;
              if (offset > n / 2) offset -= n;
              const isActive = offset === 0;
              const isLeft = offset === -1;
              const isRight = offset === 1;
              if (Math.abs(offset) > 1) return null;

              return (
                <motion.div key={d.id}
                  animate={{
                    x: isActive ? 0 : isLeft ? -310 : 310,
                    rotateY: isActive ? 0 : isLeft ? 28 : -28,
                    scale: isActive ? 1 : 0.62,
                    opacity: isActive ? 1 : 0.25,
                    z: isActive ? 0 : -200,
                  }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", cursor: isActive ? "default" : "pointer" }}
                  onClick={() => !isActive && advance(isRight ? 1 : -1)}
                >
                  <Image src={d.image} alt={d.name} fill
                    style={{
                      objectFit: "contain",
                      filter: isActive
                        ? `drop-shadow(0 0 70px rgba(${d.accentRgb},0.3)) drop-shadow(0 50px 90px rgba(0,0,0,0.85))`
                        : "none",
                    }}
                    sizes="400px" priority={isActive}
                  />
                </motion.div>
              );
            })}
          </div>

          {/* Ground glow */}
          <motion.div
            animate={{ background: `radial-gradient(ellipse, rgba(${device.accentRgb},0.35) 0%, transparent 70%)` }}
            transition={{ duration: 1.4 }}
            style={{ position: "absolute", bottom: -20, left: "50%", transform: "translateX(-50%)", width: "50%", height: 70, filter: "blur(22px)", pointerEvents: "none" }}
          />

          {/* Product chip */}
          <AnimatePresence mode="wait">
            <motion.div key={`chip-${active}`}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              style={{
                position: "absolute", bottom: 62, left: "50%", transform: "translateX(-50%)",
                background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.08)", borderRadius: 100,
                padding: "10px 20px", display: "flex", alignItems: "center", gap: 10, whiteSpace: "nowrap",
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: device.accent, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: "#888", letterSpacing: "0.5px" }}>{device.name}</span>
              <span style={{ width: 1, height: 12, background: "rgba(255,255,255,0.1)" }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: device.accent }}>{device.price}</span>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 14 }}>
            <button onClick={() => advance(-1)} onMouseMove={magnet} onMouseLeave={magnetOff}
              style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#555" }}>
              <ChevronLeft size={14} />
            </button>
            <svg width={44} height={44} style={{ transform: "rotate(-90deg)" }}>
              <circle cx={22} cy={22} r={18} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={1.5} />
              <motion.circle cx={22} cy={22} r={18} fill="none" stroke={device.accent} strokeWidth={1.8}
                strokeLinecap="round" strokeDasharray={CIRC}
                animate={{ strokeDashoffset: CIRC - progress * CIRC, stroke: device.accent }}
                transition={{ duration: 0.05, ease: "linear" }} />
            </svg>
            <button onClick={() => advance(1)} onMouseMove={magnet} onMouseLeave={magnetOff}
              style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#555" }}>
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Pill indicators */}
          <div style={{ position: "absolute", top: 20, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 5, zIndex: 20 }}>
            {devices.map((_, i) => (
              <motion.div key={i} onClick={() => i !== active && advance(i > active ? 1 : -1)}
                animate={{ width: i === active ? 20 : 5, background: i === active ? device.accent : "rgba(255,255,255,0.15)" }}
                transition={{ duration: 0.3 }}
                style={{ height: 5, borderRadius: 3, cursor: "pointer" }} />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }}
        style={{ position: "absolute", bottom: 52, left: "clamp(24px, 5vw, 64px)", zIndex: 20, display: "flex", alignItems: "center", gap: 10 }}
      >
        <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.2))" }} />
        <span style={{ fontSize: 9, color: "#444", letterSpacing: "3px", textTransform: "uppercase" }}>Scroll to explore</span>
      </motion.div>

      {/* Marquee ticker */}
      <div style={{ position: "relative", zIndex: 20, borderTop: "1px solid rgba(255,255,255,0.05)", padding: "11px 0", overflow: "hidden", flexShrink: 0 }}>
        <div style={{ display: "flex", animation: "heroTicker 32s linear infinite", whiteSpace: "nowrap" }}>
          {[...TICKER, ...TICKER].map((item, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 32, padding: "0 32px" }}>
              <span style={{ fontSize: 11, color: "#444", letterSpacing: "1.5px", fontWeight: 500, textTransform: "uppercase" }}>{item}</span>
              <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#333", flexShrink: 0 }} />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
