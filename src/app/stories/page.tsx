"use client";
import Image from "next/image";
import Link from "next/link";

const stories = [
  { id: "iphone-17-pro-lagos", tag: "FIELD TEST", readTime: "6 MIN READ", image: "/iphone17pro.png", title: "Three days in Lagos with the iPhone 17 Pro.", excerpt: "From a 6am call with Tokyo to a sunset shoot in Lekki — we ran the Pro through a week of Nigerian reality." },
  { id: "iphone-vs-galaxy-2026", tag: "BUYER'S GUIDE", readTime: "8 MIN READ", image: "/galaxy_s26_ultra.png", title: "iPhone vs Galaxy in 2026: who's it really for?", excerpt: "Forget the spec sheet. The honest answer comes down to four lifestyle questions we walk you through." },
  { id: "pixel-nigeria", tag: "LONG READ", readTime: "5 MIN READ", image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80&auto=format", title: "Why Pixel is finally the right Android for Nigeria.", excerpt: "Seven years of updates, on-device Gemini, and a camera that finally gets melanin right." },
];

export default function StoriesPage() {
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "60px 24px" }}>
      <div style={{ marginBottom: "52px" }}>
        <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "2px", color: "#c8782a", textTransform: "uppercase", marginBottom: "12px" }}>Stories</div>
        <h1 style={{ fontSize: "64px", fontWeight: 700, letterSpacing: "-3px", lineHeight: 1.0, marginBottom: "18px" }}>Read before you buy.</h1>
        <p style={{ fontSize: "14px", color: "#666", maxWidth: "540px", lineHeight: 1.7 }}>
          Long-form reviews, side-by-sides, and field notes written by{" "}
          <span style={{ color: "#c8782a" }}>Nigerians who actually use</span> these things.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
        {stories.map((story) => (
          <Link href={`/stories/${story.id}`} key={story.id} style={{ textDecoration: "none" }}>
            <div className="card-hover" style={{ background: "#111", borderRadius: "12px", overflow: "hidden", cursor: "pointer" }}>
              <div style={{ width: "100%", aspectRatio: "4/3", position: "relative", background: "#080808" }}>
                <Image src={story.image} alt={story.title} fill style={{ objectFit: "cover" }} sizes="33vw" />
              </div>
              <div style={{ padding: "20px" }}>
                <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "1px", color: "#555", marginBottom: "12px" }}>
                  {story.tag} · {story.readTime}
                </div>
                <h2 style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "-0.5px", lineHeight: 1.25, color: "#fff", marginBottom: "12px" }}>{story.title}</h2>
                <p style={{ fontSize: "13px", color: "#666", lineHeight: 1.6, marginBottom: "20px" }}>{story.excerpt}</p>
                <div style={{ fontSize: "13px", color: "#888" }}>Read story →</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
