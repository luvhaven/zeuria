"use client";
import Link from "next/link";
import { useState } from "react";

const shopLinks = [
  { href: "/iphone", label: "iPhone", accent: true },
  { href: "/samsung", label: "Samsung", accent: false },
  { href: "/accessories", label: "Accessories", accent: false },
  { href: "/shop", label: "All products", accent: true },
];
const helpLinks = [
  { href: "/support", label: "Support", accent: false },
  { href: "/support#delivery", label: "Delivery & returns", accent: true },
  { href: "/support#warranty", label: "Warranty", accent: false },
  { href: "/support#contact", label: "Contact", accent: false },
];
const companyLinks = [
  { href: "/stories", label: "Stories" },
  { href: "/about", label: "About" },
  { href: "/careers", label: "Careers" },
  { href: "/press", label: "Press" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <footer style={{ borderTop: "1px solid #1a1a1a", paddingTop: "64px", paddingBottom: "32px", padding: "64px 24px 32px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 1fr", gap: "40px", marginBottom: "48px" }}>

          {/* Brand */}
          <div>
            <div style={{ fontSize: "28px", fontWeight: 700, letterSpacing: "-1px", marginBottom: "20px" }}>zeuria</div>
            {submitted ? (
              <p style={{ fontSize: "13px", color: "#c8782a" }}>You&apos;re on the list ✓</p>
            ) : (
              <div style={{ display: "flex" }}>
                <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)}
                  style={{ background: "#111", border: "1px solid #2a2a2a", borderRight: "none", borderRadius: "8px 0 0 8px", color: "#fff", fontSize: "12px", padding: "9px 12px", outline: "none", flex: 1, minWidth: 0, fontFamily: "inherit" }} />
                <button onClick={() => email && setSubmitted(true)} style={{ background: "#fff", color: "#000", border: "none", borderRadius: "0 8px 8px 0", padding: "9px 14px", fontSize: "12px", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit" }}>
                  Notify me
                </button>
              </div>
            )}
          </div>

          {/* Shop */}
          <div>
            <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", color: "#444", textTransform: "uppercase", marginBottom: "16px" }}>Shop</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {shopLinks.map((l) => (
                <Link key={l.href} href={l.href} className="link-hover" style={{ fontSize: "13px", color: l.accent ? "#c8782a" : "#777", transition: "color 0.2s" }}>{l.label}</Link>
              ))}
            </div>
          </div>

          {/* Help */}
          <div>
            <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", color: "#444", textTransform: "uppercase", marginBottom: "16px" }}>Help</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {helpLinks.map((l) => (
                <Link key={l.href} href={l.href} className="link-hover" style={{ fontSize: "13px", color: l.accent ? "#c8782a" : "#777", transition: "color 0.2s" }}>{l.label}</Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", color: "#444", textTransform: "uppercase", marginBottom: "16px" }}>Company</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {companyLinks.map((l) => (
                <Link key={l.href} href={l.href} className="link-hover" style={{ fontSize: "13px", color: "#777", transition: "color 0.2s" }}>{l.label}</Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "12px", color: "#383838" }}>© 2026 Zeuria Devices Ltd. Lagos, Nigeria. RC 0000000.</span>
            <div style={{ display: "flex", gap: "12px" }}>
              <Link href="/legal/terms" style={{ fontSize: "12px", color: "#666", textDecoration: "none" }}>Terms</Link>
              <Link href="/legal/privacy" style={{ fontSize: "12px", color: "#666", textDecoration: "none" }}>Privacy</Link>
              <Link href="/legal/returns" style={{ fontSize: "12px", color: "#666", textDecoration: "none" }}>Returns</Link>
              <Link href="/legal/shipping" style={{ fontSize: "12px", color: "#666", textDecoration: "none" }}>Shipping</Link>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {["Verve", "Mastercard", "Visa", "Paystack"].map((p) => (
              <span key={p} style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#555", border: "1px solid #222", background: "#0a0a0a", padding: "4px 8px", borderRadius: "6px" }}>{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
