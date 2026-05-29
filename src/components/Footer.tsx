"use client";
import Link from "next/link";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'footer' }),
      });
    } catch { }
    setSubmitted(true);
  };

  return (
    <footer className="footer">
      <div className="footer-inner">
        <section className="footer-news">
          <Link href="/" className="footer-logo">
            <span>zeuria</span><sup>&reg;</sup>
          </Link>
          <p>Nigeria&apos;s most beautiful place to buy a phone.<br />Delivered in 24-72 hours.</p>

          {submitted ? (
            <p style={{ color: "var(--accent-gold)", marginTop: "1rem" }}>Thanks! You&apos;re on the list.</p>
          ) : (
            <form className="notify-form" onSubmit={handleSubmit}>
              <label className="sr-only" htmlFor="notify-email">Email address</label>
              <input
                id="notify-email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <button type="submit">Notify me</button>
            </form>
          )}
        </section>

        <section className="footer-links">
          <div>
            <h2>Shop</h2>
            <Link href="/shop/iphone">iPhone</Link>
            <Link href="/shop/samsung">Samsung</Link>
            <Link href="/shop/pixel">Pixel</Link>
            <Link href="/shop/huawei">Huawei</Link>
            <Link href="/shop/xiaomi">Xiaomi</Link>
            <Link href="/shop/accessories">Accessories</Link>
            <Link href="/shop">All products</Link>
          </div>
          <div>
            <h2>Help</h2>
            <Link href="/support">Support</Link>
            <Link href="/trust">Delivery & returns</Link>
            <Link href="/trust">Warranty</Link>
            <Link href="/support">Contact</Link>
          </div>
          <div>
            <h2>Company</h2>
            <Link href="/stories">Stories</Link>
            <Link href="/support">About</Link>
            <Link href="/support">Careers</Link>
            <Link href="/support">Press</Link>
          </div>
        </section>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 Zeuria Devices Ltd. Lagos, Nigeria. RC 0000000.</p>
        <p>Verve <span>Mastercard</span> <span>Visa</span> <span>Paystack</span> <span>Bank Transfer</span></p>
      </div>
    </footer>
  );
}
