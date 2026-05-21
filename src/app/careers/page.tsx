"use client";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const jobs = [
  { id: "logistics-lead", title: "Head of Logistics", dept: "Operations", loc: "Lagos, Nigeria" },
  { id: "frontend-eng", title: "Senior Frontend Engineer (React/Next)", dept: "Engineering", loc: "Remote (Nigeria)" },
  { id: "customer-success", title: "Customer Success Specialist", dept: "Support", loc: "Lagos, Nigeria" },
];

export default function CareersPage() {
  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "80px 24px" }}>
      <div style={{ marginBottom: "64px" }}>
        <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "2px", color: "#c8782a", textTransform: "uppercase", marginBottom: "16px" }}>Careers</div>
        <h1 style={{ fontSize: "56px", fontWeight: 700, letterSpacing: "-2px", lineHeight: 1.0, marginBottom: "24px" }}>
          Help us fix African retail.
        </h1>
        <p style={{ fontSize: "16px", color: "#666", maxWidth: "500px", lineHeight: 1.6 }}>
          We are a small, intense team obsessed with operations, engineering, and design. If you hate mediocrity, you&apos;ll fit right in.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {jobs.map(job => (
          <Link href={`mailto:careers@zeuria.ng?subject=${job.title}`} key={job.id} style={{ textDecoration: "none" }}>
            <div className="surface-hover" style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              background: "#111", padding: "24px 32px", borderRadius: "12px", cursor: "pointer",
            }}>
              <div>
                <h3 style={{ fontSize: "20px", fontWeight: 600, color: "#fff", marginBottom: "8px" }}>{job.title}</h3>
                <div style={{ fontSize: "13px", color: "#555", display: "flex", gap: "16px" }}>
                  <span>{job.dept}</span>
                  <span>·</span>
                  <span>{job.loc}</span>
                </div>
              </div>
              <div style={{ background: "#222", width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ArrowUpRight size={18} color="#fff" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ marginTop: "64px", padding: "40px", background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "16px", textAlign: "center" }}>
        <h3 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "12px" }}>Don&apos;t see your role?</h3>
        <p style={{ fontSize: "14px", color: "#666", marginBottom: "24px" }}>We&apos;re always looking for exceptional talent. Send us your CV anyway.</p>
        <Link href="mailto:careers@zeuria.ng" className="btn-hover" style={{ background: "#fff", color: "#000", padding: "12px 24px", borderRadius: "8px", fontSize: "14px", fontWeight: 600, textDecoration: "none" }}>
          Email careers@zeuria.ng
        </Link>
      </div>
    </div>
  );
}
