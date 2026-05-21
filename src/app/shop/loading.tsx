export default function Loading() {
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "60px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" }}>
        <div>
          <div style={{ width: "60px", height: "12px", background: "#111", borderRadius: "4px", marginBottom: "12px", animation: "pulse 1.5s infinite" }} />
          <div style={{ width: "200px", height: "48px", background: "#111", borderRadius: "8px", animation: "pulse 1.5s infinite" }} />
        </div>
        <div style={{ width: "150px", height: "40px", background: "#111", borderRadius: "8px", animation: "pulse 1.5s infinite" }} />
      </div>
      
      {/* Filters Skeleton */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "32px", overflowX: "auto", paddingBottom: "8px" }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={{ width: "80px", height: "36px", background: "#111", borderRadius: "20px", flexShrink: 0, animation: "pulse 1.5s infinite" }} />
        ))}
      </div>

      <div className="grid-shop" style={{ display: "grid", gap: "16px" }}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} style={{ background: "#111", borderRadius: "12px", overflow: "hidden" }}>
            <div style={{ width: "100%", aspectRatio: "4/5", background: "#0a0a0a", animation: "pulse 1.5s infinite" }} />
            <div style={{ padding: "16px 18px 18px" }}>
              <div style={{ width: "100px", height: "10px", background: "#1a1a1a", borderRadius: "4px", marginBottom: "8px", animation: "pulse 1.5s infinite" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "16px" }}>
                <div style={{ width: "140px", height: "18px", background: "#222", borderRadius: "4px", animation: "pulse 1.5s infinite" }} />
                <div style={{ width: "60px", height: "14px", background: "#222", borderRadius: "4px", animation: "pulse 1.5s infinite" }} />
              </div>
              <div style={{ width: "100%", height: "40px", background: "#222", borderRadius: "8px", animation: "pulse 1.5s infinite" }} />
            </div>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
