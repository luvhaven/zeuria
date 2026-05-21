"use client";
import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const storiesData: Record<string, { title: string; image: string; tag: string; date: string; content: React.ReactNode }> = {
  "iphone-17-pro-lagos": {
    title: "Three days in Lagos with the iPhone 17 Pro.",
    image: "/iphone17pro.png",
    tag: "FIELD TEST",
    date: "May 12, 2026",
    content: (
      <>
        <p>Lagos is a city that tests technology. It tests the battery life when you&apos;re stuck in traffic on the Third Mainland Bridge, it tests the screen brightness under the relentless afternoon sun, and it tests the camera when you&apos;re trying to capture the chaotic beauty of an evening market.</p>
        <p>For the past 72 hours, we left our chargers at home and relied entirely on Apple&apos;s new A19 Pro chip.</p>
        <h3>The Battery Reality</h3>
        <p>Apple claims a two-day battery life. In Lagos, with Google Maps routing, constant WhatsApp business calls, and patchy 5G switching, a phone usually dies by 4 PM. The iPhone 17 Pro hit 20% at 11 PM on day one. That alone is a reason to upgrade.</p>
        <h3>Low Light Photography</h3>
        <p>The 48MP Fusion Camera doesn&apos;t just capture light; it seems to invent it. We took shots in a dimly lit lounge in Victoria Island, and the depth of field looked like it came from a dedicated mirrorless camera.</p>
      </>
    )
  },
  "iphone-vs-galaxy-2026": {
    title: "iPhone vs Galaxy in 2026: who's it really for?",
    image: "/galaxy_s26_ultra.png",
    tag: "BUYER'S GUIDE",
    date: "April 28, 2026",
    content: (
      <>
        <p>The spec sheets will tell you that both phones are mathematical miracles. But you don&apos;t buy a spec sheet. You buy a workflow.</p>
        <p>If your life runs on seamless integration—if your laptop is a Mac and your watch says Apple—the iPhone 17 Pro is the obvious choice. But if you view your phone as a pocket computer, a canvas, or a productivity hub, the Galaxy S26 Ultra remains unchallenged.</p>
        <h3>The S Pen factor</h3>
        <p>It&apos;s not a gimmick. Signing documents on the go without printing, marking up architectural plans on site, or simply taking a quick note during a meeting. The S Pen is the reason the Ultra exists.</p>
      </>
    )
  },
  "pixel-nigeria": {
    title: "Why Pixel is finally the right Android for Nigeria.",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=1200&q=80&auto=format",
    tag: "LONG READ",
    date: "April 15, 2026",
    content: (
      <>
        <p>For years, Google&apos;s Pixel felt like a phone designed for Silicon Valley, not the global south. But the Pixel 10 Pro changes the narrative completely.</p>
        <h3>On-Device AI that actually works offline</h3>
        <p>When the network drops, most AI features die. Gemini Nano runs locally on the Tensor G5 chip, meaning transcription, translation, and text summarization work perfectly without an internet connection.</p>
        <h3>Real Tone Camera</h3>
        <p>The tech industry has a long history of failing to capture darker skin tones accurately. Google&apos;s Real Tone algorithm finally gets it right. No washed-out highlights, no unnatural contrast—just you, exactly as you look.</p>
      </>
    )
  }
};

export default function StoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const story = storiesData[id];
  if (!story) notFound();

  return (
    <article style={{ paddingBottom: "120px" }}>
      {/* Hero */}
      <div style={{ position: "relative", width: "100%", height: "60vh", minHeight: "400px", background: "#080808" }}>
        <Image src={story.image} alt={story.title} fill style={{ objectFit: "cover", opacity: 0.7 }} sizes="100vw" priority />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #000 0%, transparent 100%)" }} />
        <div style={{ position: "absolute", bottom: "0", left: "0", right: "0", padding: "60px 24px" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "20px" }}>
              <span style={{ background: "#fff", color: "#000", padding: "4px 10px", borderRadius: "4px", fontSize: "10px", fontWeight: 700, letterSpacing: "1px" }}>{story.tag}</span>
              <span style={{ fontSize: "12px", color: "#aaa" }}>{story.date}</span>
            </div>
            <h1 style={{ fontSize: "48px", fontWeight: 700, letterSpacing: "-1.5px", lineHeight: 1.1, textShadow: "0 4px 24px rgba(0,0,0,0.5)" }}>{story.title}</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ 
          fontSize: "18px", color: "#ccc", lineHeight: 1.8,
          display: "flex", flexDirection: "column", gap: "24px",
        }}>
          <style>{`
            article h3 { color: #fff; font-size: 24px; font-weight: 600; margin-top: 24px; margin-bottom: -8px; }
          `}</style>
          {story.content}
        </div>

        {/* Author Bio */}
        <div style={{ marginTop: "80px", paddingTop: "40px", borderTop: "1px solid #1a1a1a", display: "flex", gap: "20px", alignItems: "center" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#222" }} />
          <div>
            <div style={{ fontSize: "11px", fontWeight: 600, color: "#c8782a", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Written by</div>
            <div style={{ fontSize: "16px", fontWeight: 500, color: "#fff" }}>The Zeuria Editorial Team</div>
          </div>
        </div>

        {/* Back */}
        <div style={{ marginTop: "60px", textAlign: "center" }}>
          <Link href="/stories" className="btn-hover" style={{ background: "#111", color: "#fff", padding: "14px 24px", borderRadius: "8px", fontSize: "14px", textDecoration: "none" }}>
            ← Back to all stories
          </Link>
        </div>
      </div>
    </article>
  );
}
