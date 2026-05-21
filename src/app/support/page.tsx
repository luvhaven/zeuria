"use client";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "How do I track my order?",
    a: "Once your order ships, you'll receive a tracking link via WhatsApp and email. You can also log into your account and view real-time delivery status from your order history.",
  },
  {
    q: "Do you ship outside Lagos?",
    a: "Yes! We ship nationwide across Nigeria. Delivery to Lagos takes 24–48 hours. Orders to other states arrive within 48–72 hours via our trusted courier partners.",
  },
  {
    q: "Is pay on delivery available?",
    a: "Pay on delivery is available for select locations in Lagos. For other states and high-value orders above ₦500,000, we require full payment before dispatch.",
  },
  {
    q: "What's your return policy?",
    a: "We offer a 7-day return policy on all items. Products must be in original condition with all accessories. Faulty devices qualify for an immediate replacement or full refund.",
  },
  {
    q: "Do you take trade-ins?",
    a: "Zeuria is dedicated exclusively to the distribution of pristine, factory-sealed devices. To maintain this uncompromising standard, we do not accept trade-ins or pre-owned electronics.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        borderBottom: "1px solid #1a1a1a",
        padding: "20px 0",
        cursor: "pointer",
      }}
      onClick={() => setOpen(!open)}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "16px", fontWeight: 400, color: "#fff" }}>{q}</span>
        <span style={{ color: "#555", flexShrink: 0, marginLeft: "16px" }}>
          {open ? <Minus size={16} /> : <Plus size={16} />}
        </span>
      </div>
      {open && (
        <p style={{ marginTop: "14px", fontSize: "14px", color: "#888", lineHeight: 1.7, maxWidth: "640px" }}>
          {a}
        </p>
      )}
    </div>
  );
}

export default function SupportPage() {
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "60px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom: "52px" }}>
        <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "2px", color: "#c8782a", textTransform: "uppercase", marginBottom: "12px" }}>Support</div>
        <h1 style={{ fontSize: "64px", fontWeight: 700, letterSpacing: "-3px", lineHeight: 1.0, marginBottom: "18px" }}>A real human, fast.</h1>
        <p style={{ fontSize: "14px", color: "#666", maxWidth: "520px" }}>
          We don&apos;t do chatbots. Every message goes straight to a{" "}
          <span style={{ color: "#c8782a" }}>person who can actually help</span>.
        </p>
      </div>

      {/* Contact Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "64px" }}>
        {/* WhatsApp */}
        <div style={{ background: "#111", borderRadius: "12px", padding: "20px" }}>
          <div style={{ marginBottom: "16px" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 1.9.528 3.67 1.438 5.18L2 22l4.82-1.438C8.33 21.472 10.1 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" stroke="#c8782a" strokeWidth="1.5"/>
              <path d="M8.5 9.5c.5 1 1.5 2.5 3 3.5 1.5 1 2.5 1.5 3.5 1.5" stroke="#c8782a" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "1.5px", color: "#555", textTransform: "uppercase", marginBottom: "8px" }}>WhatsApp</div>
          <div style={{ fontSize: "17px", fontWeight: 600, color: "#fff", marginBottom: "8px" }}>+234 800 ZEURIA NG</div>
          <div style={{ fontSize: "11px", color: "#555", display: "flex", alignItems: "center", gap: "5px" }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#555" strokeWidth="2"/><path d="M12 6v6l4 2" stroke="#555" strokeWidth="2" strokeLinecap="round"/></svg>
            Avg reply: 4 min
          </div>
        </div>

        {/* Call */}
        <div style={{ background: "#111", borderRadius: "12px", padding: "20px" }}>
          <div style={{ marginBottom: "16px" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M5 4h4l2 5-2.5 1.5c1 2 3 4 5 5L15 13l5 2v4c0 1-1 2-2 2C7 21 3 7 3 6c0-1 1-2 2-2z" stroke="#c8782a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "1.5px", color: "#555", textTransform: "uppercase", marginBottom: "8px" }}>Call</div>
          <div style={{ fontSize: "17px", fontWeight: 600, color: "#fff", marginBottom: "8px" }}>+234 1 888 2872</div>
          <div style={{ fontSize: "11px", color: "#555", display: "flex", alignItems: "center", gap: "5px" }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#555" strokeWidth="2"/><path d="M12 6v6l4 2" stroke="#555" strokeWidth="2" strokeLinecap="round"/></svg>
            Mon–Sat, 9am–8pm
          </div>
        </div>

        {/* Email */}
        <div style={{ background: "#111", borderRadius: "12px", padding: "20px" }}>
          <div style={{ marginBottom: "16px" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="4" width="20" height="16" rx="2" stroke="#c8782a" strokeWidth="1.5"/>
              <path d="M2 8l10 6 10-6" stroke="#c8782a" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "1.5px", color: "#555", textTransform: "uppercase", marginBottom: "8px" }}>Email</div>
          <div style={{ fontSize: "17px", fontWeight: 600, color: "#fff", marginBottom: "8px" }}>hello@zeuria.ng</div>
          <div style={{ fontSize: "11px", color: "#555", display: "flex", alignItems: "center", gap: "5px" }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#555" strokeWidth="2"/><path d="M12 6v6l4 2" stroke="#555" strokeWidth="2" strokeLinecap="round"/></svg>
            We reply same day
          </div>
        </div>

        {/* Showroom */}
        <div style={{ background: "#111", borderRadius: "12px", padding: "20px" }}>
          <div style={{ marginBottom: "16px" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="#c8782a" strokeWidth="1.5"/>
              <circle cx="12" cy="9" r="2.5" stroke="#c8782a" strokeWidth="1.5"/>
            </svg>
          </div>
          <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "1.5px", color: "#555", textTransform: "uppercase", marginBottom: "8px" }}>Showroom</div>
          <div style={{ fontSize: "17px", fontWeight: 600, color: "#fff", marginBottom: "8px" }}>12B Adeola Odeku, VI</div>
          <div style={{ fontSize: "11px", color: "#555", display: "flex", alignItems: "center", gap: "5px" }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#555" strokeWidth="2"/><path d="M12 6v6l4 2" stroke="#555" strokeWidth="2" strokeLinecap="round"/></svg>
            Open 10am–7pm
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: "1px solid #1a1a1a", marginBottom: "64px" }} />

      {/* FAQ Section */}
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "80px" }}>
        <div>
          <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "2px", color: "#555", textTransform: "uppercase", marginBottom: "16px" }}>FAQ</div>
          <h2 style={{ fontSize: "40px", fontWeight: 700, letterSpacing: "-1.5px", lineHeight: 1.1 }}>The usual suspects.</h2>
        </div>

        <div style={{ borderTop: "1px solid #1a1a1a" }}>
          {faqs.map((faq) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </div>
  );
}
