"use client";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { ProductListItem } from "@/data/products";

export default function HomePageClient({ arrivals, featured = [] }: { arrivals: ProductListItem[]; featured?: ProductListItem[] }) {
  const isLocal = typeof window !== 'undefined' ? window.location.hostname === 'localhost' : false;

  return (
    <div className="home-page-container">
      {/* ─── Hero Section ─── */}
      <section className="home-hero" style={{ "--hero-accent": "#c8782a", "--hero-glow": "rgba(200, 120, 42, 0.22)" } as React.CSSProperties}>
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="hero-kicker"><span>Apple &middot; Pro</span><i></i><em>Zeuria Nigeria</em></p>
            <h1>
              <span className="hero-line">Titanium.</span>
              <span className="hero-line">In your <em>pocket.</em></span>
            </h1>
            <p className="hero-lede">True flagship power, professional-grade cameras, and all-day battery life, built for the pace of Lagos.</p>
            <div className="hero-price-line">
              <span>from</span>
              <strong>₦1,650,000</strong>
            </div>
            <div className="hero-actions">
              <Link href="/p/iphone-17-pro" className="button button-light">Shop iPhone 17 Pro <ArrowUpRight size={14} /></Link>
              <Link href="/shop" className="hero-text-link">View all devices <ArrowUpRight size={14} /></Link>
            </div>
            <div className="hero-stats">
              <div><strong>24h</strong><span>Lagos delivery</span></div>
              <div><strong>1yr</strong><span>Warranty</span></div>
              <div><strong>100%</strong><span>Verified stock</span></div>
            </div>
          </div>
          <div className="hero-stage">
            <div className="hero-visuals">
              <Link href="/p/iphone-17-pro" className="hero-slide is-active">
                <Image src="/iphone-17-pro-card.png" alt="iPhone 17 Pro" width={600} height={600} priority style={{ objectFit: 'contain' }} />
              </Link>
            </div>
            <Link href="/p/iphone-17-pro" className="hero-product-pill">
              <span></span>
              <strong>iPhone 17 Pro</strong>
              <em>₦1,650,000</em>
            </Link>
            <div className="hero-controls">
              <button type="button" aria-label="Previous featured product"><ArrowUpRight size={14} style={{ transform: 'rotate(-135deg)' }} /></button>
              <button type="button" aria-label="Next featured product"><ArrowUpRight size={14} style={{ transform: 'rotate(45deg)' }} /></button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Signal Strip ─── */}
      <section className="signal-strip" aria-label="Zeuria benefits">
        <div className="signal-track">
          <div className="signal-group">
            <span className="signal-item">Apple</span>
            <span className="signal-item">Samsung</span>
            <span className="signal-item">Google</span>
            <span className="signal-item">Huawei</span>
            <span className="signal-item">Xiaomi</span>
            <span className="signal-item">Guaranteed Genuine</span>
          </div>
          <div className="signal-group" aria-hidden="true">
            <span className="signal-item">Apple</span>
            <span className="signal-item">Samsung</span>
            <span className="signal-item">Google</span>
            <span className="signal-item">Huawei</span>
            <span className="signal-item">Xiaomi</span>
            <span className="signal-item">Guaranteed Genuine</span>
          </div>
        </div>
      </section>

      {/* ─── Category Row ─── */}
      <section className="container category-row" aria-label="Shop by category">
        <Link href="/shop/iphone" className="category-tile">
          <strong>A-Series Silicon</strong>
          <h3>iPhone</h3>
          <ArrowUpRight size={16} />
        </Link>
        <Link href="/shop/samsung" className="category-tile">
          <strong>Snapdragon Elite</strong>
          <h3>Galaxy</h3>
          <ArrowUpRight size={16} />
        </Link>
        <Link href="/shop/pixel" className="category-tile">
          <strong>Tensor &middot; Gemini</strong>
          <h3>Pixel</h3>
          <ArrowUpRight size={16} />
        </Link>
        <Link href="/shop/huawei" className="category-tile">
          <strong>XMAGE &middot; Harmony</strong>
          <h3>Huawei</h3>
          <ArrowUpRight size={16} />
        </Link>
        <Link href="/shop/xiaomi" className="category-tile">
          <strong>Leica-style optics</strong>
          <h3>Xiaomi</h3>
          <ArrowUpRight size={16} />
        </Link>
        <Link href="/shop/accessories" className="category-tile">
          <strong>Sound &middot; Power &middot; Wear</strong>
          <h3>Accessories</h3>
          <ArrowUpRight size={16} />
        </Link>
      </section>

      {/* ─── Featured Products ─── */}
      <section className="container home-section">
        <div className="section-heading">
          <div>
            <p className="micro">The shelf</p>
            <h2>Featured this week.</h2>
          </div>
          <Link href="/shop">See everything <ArrowUpRight size={14} /></Link>
        </div>
        <div className="featured-grid">
          {arrivals.map(item => (
            <Link key={item.id} href={`/p/${item.id}`} className="product-card mini-card">
              <div className="product-card-image">
                <Image src={item.image} alt={item.name} fill style={{ objectFit: 'contain' }} sizes="(max-width: 768px) 50vw, 300px" />
                {item.badge && <span className="product-badge">{item.badge}</span>}
              </div>
              <div className="product-card-meta">
                <p className="micro">{item.brand} &middot; {item.category}</p>
                <h3>{item.name}</h3>
                <strong>{item.price}</strong>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Why Zeuria ─── */}
      <section className="why-band">
        <div className="container">
          <p className="micro">Why Zeuria</p>
          <h2>Built for Nigeria.<br /><span>Held to a higher bar.</span></h2>
          <div className="promise-grid">
            <div className="promise-card">
              <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: '1.2em', height: '1.2em', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5 }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
              <h3>1-year warranty, no fine print.</h3>
              <p>Every device ships with a written 12-month warranty. Faulty out of the box? We swap it the same day in Lagos.</p>
            </div>
            <div className="promise-card">
              <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: '1.2em', height: '1.2em', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5 }}><path d="M3 6h12v10H3z" /><path d="M15 10h4l2 3v3h-6z" /><circle cx="7" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></svg>
              <h3>Nationwide, in days not weeks.</h3>
              <p>24 hours in Lagos, 48 in Abuja and Port Harcourt, 72 anywhere else. Track every step over WhatsApp.</p>
            </div>
            <div className="promise-card">
              <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: '1.2em', height: '1.2em', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5 }}><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" /><path d="m18 15 .8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8L18 15Z" /></svg>
              <h3>Genuine. Verifiable. Always.</h3>
              <p>We publish the IMEI of every device before it leaves our warehouse. Check it on Apple's or Samsung's site yourself.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Spotlight ─── */}
      <section className="container spotlight">
        <Image src="/home-spotlight-galaxy.png" alt="Galaxy S26 Ultra on a blue studio set" width={800} height={400} style={{ objectFit: 'cover' }} />
        <div>
          <p className="eyebrow">Spotlight</p>
          <h2>The phone for people who do too much.</h2>
          <p>200MP main sensor, 6.9-inch QHD+ Dynamic AMOLED 3x, S Pen loaded in. Galaxy AI live-translates calls in Yoruba, Igbo, Hausa, Pidgin. This is the workhorse, dressed for dinner.</p>
          <Link href="/shop/samsung" className="button button-dark">See the Galaxy S26 Ultra <ArrowUpRight size={14} /></Link>
        </div>
      </section>

      {/* ─── Metrics ─── */}
      <section className="container metrics" aria-label="Zeuria metrics">
        <div><strong>12,400+</strong><span>Orders fulfilled</span></div>
        <div><strong>36</strong><span>Cities served</span></div>
        <div><strong>4.9&#9733;</strong><span>Customer rating</span></div>
        <div><strong>27hrs</strong><span>Avg. delivery</span></div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="container final-cta">
        <h2>Your next phone is waiting.</h2>
        <p>Browse the shelf. Pay how you want. We'll handle the rest.</p>
        <Link href="/shop" className="button button-light">Start shopping <ArrowUpRight size={14} /></Link>
      </section>
    </div>
  );
}
