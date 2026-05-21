"use client";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const news = [
  { date: "May 10, 2026", title: "Zeuria announces 24-hour delivery guarantee for all flagship devices in Lagos.", pub: "TechCabal" },
  { date: "Feb 22, 2026", title: "How Zeuria is building the Apple Store experience for Nigeria.", pub: "Benjamin Dada" },
  { date: "Nov 04, 2025", title: "Zeuria secures exclusive partnership for Google Pixel distribution.", pub: "Zeuria Press Release" },
];

export default function PressPage() {
  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "80px 24px" }}>
      <div style={{ marginBottom: "64px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "2px", color: "#c8782a", textTransform: "uppercase", marginBottom: "16px" }}>Press</div>
          <h1 style={{ fontSize: "56px", fontWeight: 700, letterSpacing: "-2px", lineHeight: 1.0 }}>
            In the news.
          </h1>
        </div>
        <Link href="mailto:press@zeuria.ng" className="link-hover" style={{ fontSize: "14px", color: "#888", textDecoration: "none" }}>
          Contact PR →
        </Link>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {news.map((item, i) => (
          <a href="#" key={i} className="surface-hover" style={{ textDecoration: "none", display: "flex", padding: "32px 0", borderTop: "1px solid #1a1a1a", borderBottom: i === news.length - 1 ? "1px solid #1a1a1a" : "none" }}>
            <div style={{ width: "150px", fontSize: "13px", color: "#555", flexShrink: 0 }}>{item.date}</div>
            <div style={{ flex: 1, paddingRight: "48px" }}>
              <h3 style={{ fontSize: "20px", fontWeight: 500, color: "#fff", marginBottom: "8px", lineHeight: 1.4 }}>{item.title}</h3>
              <div style={{ fontSize: "13px", color: "#c8782a" }}>{item.pub}</div>
            </div>
            <div style={{ alignSelf: "center", color: "#555" }}>
              <ArrowUpRight size={20} />
            </div>
          </a>
        ))}
      </div>
      
      <div style={{ marginTop: "80px", display: "flex", gap: "24px" }}>
        <div style={{ flex: 1, background: "#111", padding: "32px", borderRadius: "12px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>Brand Assets</h3>
          <p style={{ fontSize: "13px", color: "#666", marginBottom: "20px" }}>Logos, wordmarks, and product photography for media use.</p>
          <button className="btn-hover" style={{ background: "#fff", color: "#000", border: "none", padding: "10px 16px", borderRadius: "6px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Download Kit (.zip)</button>
        </div>
        <div style={{ flex: 1, background: "#111", padding: "32px", borderRadius: "12px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>Press Enquiries</h3>
          <p style={{ fontSize: "13px", color: "#666", marginBottom: "20px" }}>For interviews, quotes, or media partnerships.</p>
          <Link href="mailto:press@zeuria.ng" className="link-hover" style={{ fontSize: "13px", color: "#fff", fontWeight: 500, textDecoration: "none" }}>press@zeuria.ng</Link>
        </div>
      </div>
    </div>
  );
}
