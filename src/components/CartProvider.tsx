"use client";
import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const CART_KEY = "zeuria_cart_v1";

type CartItem = {
  id: string;
  name: string;
  price: string;
  image: string;
  storage: string;
  qty: number;
};

type CartCtx = {
  items: CartItem[];
  count: number;
  open: boolean;
  add: (item: Omit<CartItem, "qty">) => void;
  remove: (id: string, storage: string) => void;
  updateQty: (id: string, storage: string, qty: number) => void;
  toggle: () => void;
  close: () => void;
  clear: () => void;
};

const CartContext = createContext<CartCtx>({
  items: [], count: 0, open: false,
  add: () => { }, remove: () => { }, updateQty: () => { }, toggle: () => { }, close: () => { }, clear: () => { },
});

export function useCart() { return useContext(CartContext); }

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(CART_KEY);
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (mounted) localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items, mounted]);

  const add = useCallback((item: Omit<CartItem, "qty">) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id && i.storage === item.storage);
      if (existing) return prev.map(i => i.id === item.id && i.storage === item.storage ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
    setOpen(true);
  }, []);

  const remove = useCallback((id: string, storage: string) => {
    setItems(prev => prev.filter(i => !(i.id === id && i.storage === storage)));
  }, []);

  const updateQty = useCallback((id: string, storage: string, qty: number) => {
    if (qty <= 0) {
      setItems(prev => prev.filter(i => !(i.id === id && i.storage === storage)));
    } else {
      setItems(prev => prev.map(i => i.id === id && i.storage === storage ? { ...i, qty } : i));
    }
  }, []);

  const clear = useCallback(() => { setItems([]); setOpen(false); }, []);

  const count = items.reduce((s, i) => s + i.qty, 0);

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <CartContext.Provider value={{ items, count, open, add, remove, updateQty, clear, toggle: () => setOpen(o => !o), close: () => setOpen(false) }}>
      {children}
      <AnimatePresence>
        {open && <CartDrawer />}
      </AnimatePresence>
    </CartContext.Provider>
  );
}

function CartDrawer() {
  const { items, remove, updateQty, close, count } = useCart();

  const subtotal = items.reduce((sum, item) => {
    return sum + parseInt(item.price.replace(/[₦,]/g, "")) * item.qty;
  }, 0);
  const shipping = subtotal > 0 && subtotal >= 500000 ? 0 : 5000;
  const total = subtotal + shipping;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
        onClick={close}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)", zIndex: 200 }}
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0,
          width: "min(100vw, 420px)",
          background: "#080808", borderLeft: "1px solid #1a1a1a",
          zIndex: 201, display: "flex", flexDirection: "column",
          paddingTop: "env(safe-area-inset-top, 0px)",
        }}
      >
        {/* Header */}
        <div style={{ padding: "clamp(14px,3vw,20px) clamp(16px,4vw,24px)", borderBottom: "1px solid #141414", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <span style={{ fontSize: "15px", fontWeight: 600, color: "#fff" }}>Your Bag ({count})</span>
          <button onClick={close} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: "22px", lineHeight: 1, padding: "2px 6px", display: "flex", alignItems: "center" }}>×</button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px clamp(14px,4vw,24px)", WebkitOverflowScrolling: "touch" }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "#555" }}>
              <div style={{ fontSize: "44px", marginBottom: "16px" }}>🛍️</div>
              <p style={{ fontSize: "15px", color: "#fff", fontWeight: 500, marginBottom: "8px" }}>Your bag is empty.</p>
              <p style={{ fontSize: "13px" }}>Add something you love.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {items.map((item) => (
                <div key={`${item.id}-${item.storage}`} style={{ display: "flex", gap: "14px", paddingTop: "18px", paddingBottom: "18px", borderBottom: "1px solid #111" }}>
                  {/* Image */}
                  <div style={{ width: "72px", height: "72px", background: "#111", borderRadius: "10px", overflow: "hidden", flexShrink: 0 }}>
                    {item.image && <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "14px", fontWeight: 500, color: "#fff", marginBottom: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</div>
                    {item.storage && <div style={{ fontSize: "12px", color: "#555", marginBottom: "10px" }}>{item.storage}</div>}

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      {/* Qty stepper */}
                      <div style={{ display: "inline-flex", alignItems: "center", border: "1px solid #222", borderRadius: "8px", overflow: "hidden" }}>
                        <button
                          onClick={() => updateQty(item.id, item.storage, item.qty - 1)}
                          style={{ background: "none", border: "none", color: "#888", cursor: "pointer", width: "32px", height: "30px", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}
                        >−</button>
                        <span style={{ fontSize: "13px", color: "#fff", width: "28px", textAlign: "center", display: "block", userSelect: "none" }}>{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, item.storage, item.qty + 1)}
                          style={{ background: "none", border: "none", color: "#888", cursor: "pointer", width: "32px", height: "30px", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}
                        >+</button>
                      </div>

                      {/* Line total */}
                      <span style={{ fontSize: "14px", color: "#c8782a", fontWeight: 600 }}>
                        ₦{(parseInt(item.price.replace(/[₦,]/g, "")) * item.qty).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => remove(item.id, item.storage)}
                    style={{ background: "none", border: "none", color: "#333", cursor: "pointer", fontSize: "18px", alignSelf: "flex-start", lineHeight: 1, padding: "2px", flexShrink: 0, marginTop: "2px" }}
                  >×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer CTA */}
        {items.length > 0 && (
          <div style={{ padding: "clamp(14px,3vw,20px) clamp(14px,4vw,24px)", paddingBottom: "max(clamp(14px,3vw,20px), env(safe-area-inset-bottom))", borderTop: "1px solid #141414", flexShrink: 0 }}>
            {/* Totals */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "13px", color: "#555" }}>Subtotal</span>
                <span style={{ fontSize: "13px", color: "#888" }}>₦{subtotal.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "13px", color: "#555" }}>Delivery</span>
                <span style={{ fontSize: "13px", color: shipping === 0 ? "#22c55e" : "#888" }}>
                  {shipping === 0 ? "FREE" : "₦5,000"}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "10px", borderTop: "1px solid #111" }}>
                <span style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}>Total</span>
                <span style={{ fontSize: "16px", fontWeight: 700, color: "#c8782a" }}>₦{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <Link
              href="/checkout"
              onClick={close}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: "100%", background: "#fff", color: "#000",
                borderRadius: "12px", padding: "16px 20px",
                fontSize: "15px", fontWeight: 700,
                textDecoration: "none", boxSizing: "border-box",
                marginBottom: "10px", letterSpacing: "-0.2px",
              }}
            >
              Checkout · ₦{total.toLocaleString()}
            </Link>

            <button
              onClick={close}
              style={{ width: "100%", background: "transparent", color: "#555", border: "1px solid #1e1e1e", borderRadius: "12px", padding: "13px", fontSize: "13px", cursor: "pointer", fontFamily: "inherit" }}
            >
              Continue shopping
            </button>

            <p style={{ textAlign: "center", fontSize: "11px", color: "#333", marginTop: "12px", letterSpacing: "0.3px" }}>
              🔒 Paystack secured · 24–72hr insured delivery
            </p>
          </div>
        )}
      </motion.div>
    </>
  );
}
