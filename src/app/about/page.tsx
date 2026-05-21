"use client";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "80px 24px" }}>
      <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "2px", color: "#c8782a", textTransform: "uppercase", marginBottom: "16px" }}>About Zeuria</div>
      <h1 style={{ fontSize: "56px", fontWeight: 700, letterSpacing: "-2px", lineHeight: 1.0, marginBottom: "40px" }}>
        We thought buying a phone should feel as premium as the phone itself.
      </h1>

      <div style={{ width: "100%", aspectRatio: "16/9", position: "relative", background: "#111", borderRadius: "16px", overflow: "hidden", marginBottom: "64px" }}>
        <Image src="https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=1200&q=80&auto=format" alt="Zeuria Office" fill style={{ objectFit: "cover" }} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "32px", fontSize: "16px", color: "#888", lineHeight: 1.7 }}>
        <p>
          <strong style={{ color: "#fff" }}>It started with a simple frustration.</strong> In Nigeria, getting a flagship device usually meant one of two things: navigating chaotic tech markets hoping you don&apos;t get sold a refurbished unit, or waiting three weeks for a relative coming from the UK or US.
        </p>
        <p>
          We didn&apos;t understand why the retail experience in Lagos couldn&apos;t match the unboxing experience of a new iPhone.
        </p>
        <p>
          So we built Zeuria. A curated, highly-vetted supply chain paired with a logistics network that can deliver a factory-sealed, warranty-backed device to your door in under 72 hours—and often the very next day in Lagos.
        </p>
        
        <h2 style={{ fontSize: "28px", fontWeight: 700, color: "#fff", letterSpacing: "-1px", marginTop: "32px", marginBottom: "16px" }}>The Zeuria Guarantee</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          <div style={{ background: "#111", padding: "24px", borderRadius: "12px" }}>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "#fff", marginBottom: "8px" }}>Zero Refurbs</div>
            <div style={{ fontSize: "13px" }}>Every device is brand new, sealed, and traceable directly to the manufacturer.</div>
          </div>
          <div style={{ background: "#111", padding: "24px", borderRadius: "12px" }}>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "#fff", marginBottom: "8px" }}>No Excuses Delivery</div>
            <div style={{ fontSize: "13px" }}>If we say it arrives Tuesday, it arrives Tuesday. Fully insured in transit.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
