export default function Loading() {
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "60px 24px" }}>
      <div style={{ marginBottom: "48px" }}>
        <div style={{ width: "60px", height: "12px", background: "#111", borderRadius: "4px", marginBottom: "12px", animation: "pulse 1.5s infinite" }} />
        <div style={{ width: "250px", height: "64px", background: "#111", borderRadius: "8px", marginBottom: "16px", animation: "pulse 1.5s infinite" }} />
        <div style={{ width: "300px", height: "16px", background: "#111", borderRadius: "4px", animation: "pulse 1.5s infinite" }} />
      </div>
      <div className="grid-brand" style={{ display: "grid", gap: "16px" }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} style={{ background: "#111", borderRadius: "12px", overflow: "hidden" }}>
            <div style={{ width: "100%", aspectRatio: "1/1", background: "#0a0a0a", animation: "pulse 1.5s infinite" }} />
            <div style={{ padding: "14px 16px 16px" }}>
              <div style={{ width: "100px", height: "10px", background: "#1a1a1a", borderRadius: "4px", marginBottom: "6px", animation: "pulse 1.5s infinite" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ width: "140px", height: "16px", background: "#222", borderRadius: "4px", animation: "pulse 1.5s infinite" }} />
                <div style={{ width: "60px", height: "12px", background: "#222", borderRadius: "4px", animation: "pulse 1.5s infinite" }} />
              </div>
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
