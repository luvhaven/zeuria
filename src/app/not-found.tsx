import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ maxWidth: "600px", margin: "120px auto", padding: "0 24px", textAlign: "center" }}>
      <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "2px", color: "#c8782a", textTransform: "uppercase", marginBottom: "16px" }}>Error 404</div>
      <h1 style={{ fontSize: "48px", fontWeight: 700, letterSpacing: "-1.5px", lineHeight: 1.1, marginBottom: "24px" }}>
        We couldn&apos;t find that page.
      </h1>
      <p style={{ fontSize: "16px", color: "#666", marginBottom: "40px", lineHeight: 1.6 }}>
        The device or page you&apos;re looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
        <Link href="/" className="btn-hover" style={{ background: "#fff", color: "#000", padding: "14px 28px", borderRadius: "8px", fontSize: "14px", fontWeight: 600, textDecoration: "none" }}>
          Go Home
        </Link>
        <Link href="/shop" className="btn-hover" style={{ background: "transparent", color: "#fff", border: "1px solid #333", padding: "14px 28px", borderRadius: "8px", fontSize: "14px", fontWeight: 500, textDecoration: "none" }}>
          Shop All
        </Link>
      </div>
    </div>
  );
}
