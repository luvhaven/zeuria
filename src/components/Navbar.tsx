"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useCart } from "./CartProvider";
import Image from "next/image";
import type { ProductListItem } from "@/data/products";

const navItems = [
  ["Shop", "/shop"],
  ["iPhone", "/shop/iphone"],
  ["Samsung", "/shop/samsung"],
  ["Pixel", "/shop/pixel"],
  ["Huawei", "/shop/huawei"],
  ["Xiaomi", "/shop/xiaomi"],
  ["Accessories", "/shop/accessories"],
  ["Stories", "/stories"],
  ["Support", "/support"],
];

const icons = {
  search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m16.5 16.5 4 4"></path></svg>',
  user: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
  bag: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>',
  close: '<svg viewBox="0 0 24 24" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
  right: '<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>',
  gift: '<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>',
  volume: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Z"></path><path d="M16 9.5a4 4 0 0 1 0 5"></path><path d="M19 7a8 8 0 0 1 0 10"></path></svg>',
  volumeOff: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Z"></path><path d="m22 9-6 6"></path><path d="m16 9 6 6"></path></svg>',
  sparkle: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"></path><path d="m18 15 .8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8L18 15Z"></path></svg>'
};

export default function Navbar({ products }: { products: ProductListItem[] }) {
  const pathname = usePathname();
  const { count, toggle } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [motionFull, setMotionFull] = useState(true);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const activeLabel = navItems.find(([, href]) => pathname === href || pathname.startsWith(href + '/'))?.[0];

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navMegaProducts = (label: string) => {
    const isAccessoryItem = (cat: string) => ["AUDIO", "WATCH", "POWER", "ACCESSORY"].includes(cat?.toUpperCase() || "");
    let categoryProducts = products.filter(p => !isAccessoryItem(p.category) && p.brand.toLowerCase() === label.toLowerCase()).slice(0, 4);
    if (label.toLowerCase() === "accessories") {
      categoryProducts = products.filter(p => isAccessoryItem(p.category)).slice(0, 4);
    }
    if (label.toLowerCase() === "samsung") {
      const galaxyFamily = products.filter(item => item.brand === "SAMSUNG").slice(0, 6);
      return Array.from(new Map([...categoryProducts, ...galaxyFamily].map(p => [p.id, p])).values()).slice(0, 4);
    }
    return categoryProducts;
  };

  const getMegaBadge = (index: number) => {
    return index === 0 ? "New" : index === 1 ? "Popular" : "Featured";
  };

  return (
    <>
      <header className="site-header">
        <div className="nav-shell">
          <button
            type="button"
            className="menu-toggle"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
            aria-controls="mobile-menu"
            aria-expanded={mobileMenuOpen}
          >
            <span></span><span></span><span></span>
          </button>

          <Link href="/" className="brand" aria-label="Zeuria Nigeria home">
            <span>zeuria</span><sup>&reg;</sup>
          </Link>

          <nav className="primary-nav" aria-label="Primary" onMouseLeave={() => setHoveredLink(null)}>
            {navItems.map(([label, href]) => {
              const isActive = activeLabel === label;
              const megaItems = navMegaProducts(label);
              const hasMega = megaItems.length > 0;

              return (
                <div
                  key={label}
                  className={`nav-entry ${hasMega ? "has-mega" : ""} ${(isActive || hoveredLink === label) ? "is-current" : ""}`}
                  onMouseEnter={() => hasMega && setHoveredLink(label)}
                  onMouseLeave={() => hasMega && setHoveredLink(null)}
                >
                  <Link
                    href={href}
                    className={isActive ? "is-active" : ""}
                    aria-current={isActive ? 'page' : undefined}
                    aria-haspopup={hasMega ? "true" : undefined}
                  >
                    {label}
                  </Link>

                  {/* Mega Menu Dropdown */}
                  {hasMega && (
                    <div className="nav-mega" aria-label={`${label} products`} style={{
                      visibility: hoveredLink === label ? 'visible' : 'hidden',
                      opacity: hoveredLink === label ? 1 : 0,
                      transform: hoveredLink === label ? 'translateY(0)' : 'translateY(10px)',
                      pointerEvents: hoveredLink === label ? 'auto' : 'none'
                    }}>
                      <div className="mega-inner">
                        <Link href={href} className="mega-intro">
                          <span>Explore {label}</span>
                          <strong>View All {label}</strong>
                        </Link>
                        <div className="mega-products">
                          {megaItems.map((product, index) => (
                            <Link key={product.id} href={`/p/${product.id}`} className="mega-product">
                              <span className="mega-image">
                                <Image src={product.image} alt={product.name} fill sizes="160px" style={{ objectFit: 'contain' }} />
                              </span>
                              <em>{getMegaBadge(index)}</em>
                              <strong>{product.name}</strong>
                              <small>{product.price}</small>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="nav-actions" aria-label="Store actions">
            <button type="button" onClick={() => setSoundEnabled(!soundEnabled)} aria-label={soundEnabled ? "Turn bag sound off" : "Turn bag sound on"} title={soundEnabled ? "Sound on" : "Sound off"}>
              <span dangerouslySetInnerHTML={{ __html: soundEnabled ? icons.volume : icons.volumeOff }} />
            </button>
            <button type="button" onClick={() => setMotionFull(!motionFull)} aria-label={motionFull ? "Reduce motion" : "Turn motion on"} title={motionFull ? "Motion on" : "Motion reduced"}>
              <span dangerouslySetInnerHTML={{ __html: icons.sparkle }} style={{ opacity: motionFull ? 1 : 0.5 }} />
            </button>
            <button type="button" aria-label="Search products" title="Search products" onClick={() => setSearchOpen(true)}>
              <span dangerouslySetInnerHTML={{ __html: icons.search }} />
            </button>
            <Link href="/account" aria-label="Account and orders" title="Account and orders">
              <span dangerouslySetInnerHTML={{ __html: icons.user }} />
            </Link>
            <button type="button" aria-label="Shopping cart" title="Shopping cart" onClick={toggle}>
              <span dangerouslySetInnerHTML={{ __html: icons.bag }} />
              <span className="bag-count" data-cart-count hidden={count === 0}>{count}</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="mobile-menu" id="mobile-menu" data-mobile-menu hidden={!mobileMenuOpen} style={{ visibility: mobileMenuOpen ? 'visible' : 'hidden', opacity: mobileMenuOpen ? 1 : 0 }}>
          <button type="button" className="mobile-menu-backdrop" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu"></button>
          <aside className="mobile-menu-panel" role="dialog" aria-modal="true" aria-label="Zeuria mobile navigation">
            <div className="mobile-menu-head">
              <Link href="/" className="brand mobile-menu-logo" aria-label="Zeuria home" onClick={() => setMobileMenuOpen(false)}>
                <span>zeuria</span><sup>&reg;</sup>
              </Link>
              <button type="button" className="mobile-menu-close" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                <span dangerouslySetInnerHTML={{ __html: icons.close }} />
              </button>
            </div>
            <div className="mobile-menu-hero">
              <p className="micro">Menu</p>
              <h2>Premium devices, one tap away.</h2>
              <p>Shop verified phones, request concierge help, or build a gift order without leaving the flow.</p>
            </div>
            <nav className="mobile-menu-links" aria-label="Mobile primary">
              {navItems.map(([label, href], index) => (
                <Link key={href} href={href} className={activeLabel === label ? "is-active" : ""} aria-current={activeLabel === label ? "page" : undefined} data-menu-index={String(index + 1).padStart(2, "0")} onClick={() => setMobileMenuOpen(false)}>
                  <span>{label}</span>
                  <span dangerouslySetInnerHTML={{ __html: icons.right }} />
                </Link>
              ))}
            </nav>
            <section className="mobile-menu-featured" aria-label="Featured products">
              <div>
                <p className="micro">Featured now</p>
                <Link href="/shop" onClick={() => setMobileMenuOpen(false)}>View all <span dangerouslySetInnerHTML={{ __html: icons.right }} /></Link>
              </div>
              {products.slice(0, 3).map(product => (
                <Link key={product.id} href={`/p/${product.id}`} className="mobile-featured-card" onClick={() => setMobileMenuOpen(false)}>
                  <div style={{ position: 'relative', width: 60, height: 60, flexShrink: 0 }}>
                    <Image src={product.image} alt={product.name} fill sizes="60px" style={{ objectFit: 'contain' }} />
                  </div>
                  <span><strong>{product.name}</strong><small>{product.price}</small></span>
                </Link>
              ))}
            </section>
            <div className="mobile-menu-actions">
              <button type="button" onClick={() => { setMobileMenuOpen(false); setSearchOpen(true); }}><span dangerouslySetInnerHTML={{ __html: icons.search }} /><span>Search</span></button>
              <button type="button" onClick={() => { setMobileMenuOpen(false); toggle(); }}><span dangerouslySetInnerHTML={{ __html: icons.bag }} /><span>Bag</span></button>
              <Link href="/account" onClick={() => setMobileMenuOpen(false)}><span dangerouslySetInnerHTML={{ __html: icons.user }} /><span>Account</span></Link>
              <Link href="/checkout" onClick={() => setMobileMenuOpen(false)}><span dangerouslySetInnerHTML={{ __html: icons.gift }} /><span>Gifts</span></Link>
              <button type="button" onClick={() => setSoundEnabled(!soundEnabled)}>
                <span dangerouslySetInnerHTML={{ __html: soundEnabled ? icons.volume : icons.volumeOff }} /><span>Sound</span>
              </button>
              <button type="button" onClick={() => setMotionFull(!motionFull)}>
                <span dangerouslySetInnerHTML={{ __html: icons.sparkle }} /><span>Motion</span>
              </button>
            </div>
          </aside>
        </div>
      </header>

      {/* Basic Search Overlay (Replacing the Zeuria vanilla search panel since it used custom event listeners) */}
      {searchOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 300,
          background: "rgba(0,0,0,0.92)", backdropFilter: "blur(16px)",
          display: "flex", flexDirection: "column", alignItems: "center",
          paddingTop: "15vh"
        }}>
          <button
            onClick={() => setSearchOpen(false)}
            style={{
              position: "absolute", top: "20px", right: "24px",
              background: "rgba(255,255,255,0.08)", border: "none", color: "#fff",
              cursor: "pointer", borderRadius: "50%", width: 36, height: 36,
            }}
          >
            <span dangerouslySetInnerHTML={{ __html: icons.close }} />
          </button>

          <div style={{ width: "100%", maxWidth: "560px", padding: '0 20px' }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #333", paddingBottom: 12 }}>
              <span dangerouslySetInnerHTML={{ __html: icons.search }} style={{ width: 20, fill: '#555' }} />
              <input
                autoFocus
                placeholder="Search phones, accessories..."
                style={{
                  flex: 1, background: "transparent", border: "none",
                  color: "#fff", fontSize: "24px", fontWeight: 300,
                  outline: "none", fontFamily: "inherit"
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
