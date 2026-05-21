"use client";

import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/components/CartProvider";

type Product = {
  id: string;
  name: string;
  price: string;
  image: string;
  category: string;
};

function getDefaultStorage(category: string): string {
  const cat = (category ?? "").toUpperCase();
  if (["AUDIO", "WATCH", "POWER", "ACCESSORY"].includes(cat)) return "";
  if (cat === "TABLET") return "128GB";
  return "256GB";
}

export default function QuickAddButton({ product, variant = "card" }: { product: Product; variant?: "card" | "compact" }) {
  const { add } = useCart();
  const [state, setState] = useState<"idle" | "added">("idle");
  const [hover, setHover] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (state === "added") return;

    add({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      storage: getDefaultStorage(product.category),
    });

    setState("added");
    setTimeout(() => setState("idle"), 1800);
  };

  if (variant === "compact") {
    // Small "+" pill button for tight spaces
    return (
      <button
        onClick={handleAdd}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        title={state === "added" ? "Added!" : "Add to Bag"}
        style={{
          width: "34px",
          height: "34px",
          borderRadius: "50%",
          border: state === "added"
            ? "1px solid rgba(34,197,94,0.4)"
            : hover ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(255,255,255,0.12)",
          background: state === "added"
            ? "rgba(34,197,94,0.12)"
            : hover ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.04)",
          color: state === "added" ? "#22c55e" : "#fff",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
          transform: hover && state !== "added" ? "scale(1.08)" : "scale(1)",
        }}
      >
        {state === "added"
          ? <Check size={14} strokeWidth={2.5} />
          : <ShoppingBag size={14} strokeWidth={1.8} />
        }
      </button>
    );
  }

  // Full-width card footer button
  return (
    <button
      onClick={handleAdd}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        padding: "11px 16px",
        borderRadius: "10px",
        border: state === "added"
          ? "1px solid rgba(34,197,94,0.35)"
          : hover ? "1px solid rgba(255,255,255,0.25)" : "1px solid rgba(255,255,255,0.08)",
        background: state === "added"
          ? "rgba(34,197,94,0.1)"
          : hover ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.03)",
        color: state === "added" ? "#22c55e" : hover ? "#fff" : "#888",
        fontSize: "12px",
        fontWeight: 600,
        letterSpacing: "0.3px",
        cursor: state === "added" ? "default" : "pointer",
        fontFamily: "inherit",
        transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
        marginTop: "12px",
        boxSizing: "border-box",
      }}
    >
      {state === "added"
        ? <><Check size={13} strokeWidth={2.5} /> Added to bag</>
        : <><ShoppingBag size={13} strokeWidth={1.8} /> Add to Bag</>
      }
    </button>
  );
}
