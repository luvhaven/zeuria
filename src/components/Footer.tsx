"use client";
import Link from "next/link";
import { useState } from "react";

const shopLinks = [
  { href: "/brands/iphone", label: "iPhone", accent: true },
  { href: "/brands/samsung", label: "Samsung", accent: false },
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
    <footer style={{
      borderTop: "1px solid #1a1a1a",
      padding: "clamp(40px, 8vw, 72px) clamp(16px, 5vw, 64px) max(clamp(24px, 4vw, 40px), env(safe-area-inset-bottom))",
    }}>
      <div style={{ maxWidth: "var(--max-w, 1380px)", margin: "0 auto" }}>

        {/* Main grid – 4-col desktop → 2-col tablet → 1-col mobile */}
        <div className="footer-grid" style={{ marginBottom: "clamp(32px, 6vw, 56px)" }}>

          {/* Brand column */}
          <div style={{ gridColumn: "1 / -1" }} className="footer-brand-col">
            {/* Inner wrap so on larger screens brand stays in col 1 */}
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              <div style={{ fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 700, letterSpacing: "-1px", marginBottom: "clamp(14px, 3vw, 20px)", color: "#fff" }}>
                zeuria<span style={{ fontSize: 10, color: "#c8782a", marginLeft: 2, verticalAlign: "super" }}>®</span>
              </div>
              <p style={{ fontSize: 12, color: "#444", lineHeight: 1.7, maxWidth: 260, marginBottom: "clamp(16px, 3vw, 24px)" }}>
                Nigeria&apos;s most trusted premium device store. Factory-sealed. 24h Lagos delivery.
              </p>
              {submitted ? (
                <p style={{ fontSize: "13px", color: "#c8782a" }}>You&apos;re on the list ✓</p>
              ) : (
                <div style={{ display: "flex", maxWidth: 300 }}>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{
                      background: "#111", border: "1px solid #2a2a2a", borderRight: "none",
                      borderRadius: "8px 0 0 8px", color: "#fff", fontSize: "12px",
                      padding: "10px 12px", outline: "none", flex: 1, minWidth: 0, fontFamily: "inherit",
                    }}
                  />
                  <button
                    onClick={() => email && setSubmitted(true)}
                    style={{
                      background: "#fff", color: "#000", border: "none", borderRadius: "0 8px 8px 0",
                      padding: "10px 14px", fontSize: "12px", fontWeight: 600, cursor: "pointer",
                      whiteSpace: "nowrap", fontFamily: "inherit", flexShrink: 0,
                    }}
                  >
                    Notify me
                  </button>
                </div>
              )}
            </div>
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

        {/* Bottom bar */}
        <div style={{
          borderTop: "1px solid #1a1a1a", paddingTop: "clamp(16px, 3vw, 24px)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: "clamp(12px, 2vw, 16px)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "clamp(8px, 2vw, 16px)", flexWrap: "wrap" }}>
            <span style={{ fontSize: "clamp(10px, 1.5vw, 12px)", color: "#383838" }}>© 2026 Zeuria Devices Ltd. Lagos, Nigeria.</span>
            <div style={{ display: "flex", gap: "clamp(8px, 1.5vw, 12px)", flexWrap: "wrap" }}>
              {[
                { href: "/legal/terms", label: "Terms" },
                { href: "/legal/privacy", label: "Privacy" },
                { href: "/legal/returns", label: "Returns" },
                { href: "/legal/shipping", label: "Shipping" },
              ].map(({ href, label }) => (
                <Link key={href} href={href} style={{ fontSize: "clamp(10px, 1.5vw, 12px)", color: "#666", textDecoration: "none" }}>{label}</Link>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
            {["Verve", "Mastercard", "Visa", "Paystack"].map((p) => (
              <span key={p} style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#555", border: "1px solid #222", background: "#0a0a0a", padding: "4px 8px", borderRadius: "6px" }}>{p}</span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .footer-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr 1fr 1fr;
          gap: 40px;
        }
        .footer-brand-col {
          grid-column: 1;
        }
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 28px;
          }
          .footer-brand-col {
            grid-column: 1 / -1;
          }
        }
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }
          .footer-brand-col {
            grid-column: 1 / -1;
          }
        }
      `}</style>
    </footer>
  );
}
