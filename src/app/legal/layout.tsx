export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "120px 24px", color: "#e5e5e5", lineHeight: 1.8 }}>
      <div className="legal-content">
        {children}
      </div>
      <style>{`
        .legal-content h1 { font-size: 48px; font-weight: 700; letter-spacing: -2px; margin-bottom: 24px; color: #fff; line-height: 1.1; }
        .legal-content h2 { font-size: 24px; font-weight: 600; letter-spacing: -0.5px; margin-top: 64px; margin-bottom: 16px; color: #fff; }
        .legal-content p { font-size: 15px; margin-bottom: 24px; color: #a1a1a6; }
        .legal-content ul { font-size: 15px; color: #a1a1a6; margin-bottom: 24px; padding-left: 20px; }
        .legal-content li { margin-bottom: 12px; }
        .legal-content a { color: #c8782a; text-decoration: none; }
        .legal-content a:hover { text-decoration: underline; }
        .legal-content hr { border: 0; border-top: 1px solid #222; margin: 64px 0; }
        .legal-content .meta { font-size: 13px; color: #666; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 48px; display: block; }
      `}</style>
    </div>
  );
}
