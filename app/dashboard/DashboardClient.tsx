"use client"
import { UserButton } from "@clerk/nextjs"
import Link from "next/link"

const cases = [
  {
    id: "miranda",
    type: "Criminal",
    typeColor: "#FBBF24",
    typeBg: "rgba(251,191,36,0.1)",
    typeBorder: "rgba(251,191,36,0.2)",
    title: "State v. Miranda",
    description: "Your client was interrogated without being informed of his rights. Argue the confession should be suppressed.",
    difficulty: "Beginner",
    diffColor: "#4ADE80",
    diffBg: "rgba(74,222,128,0.1)",
    diffBorder: "rgba(74,222,128,0.2)",
    icon: "⚖️",
  },
  {
    id: "contract-breach",
    type: "Civil",
    typeColor: "#818CF8",
    typeBg: "rgba(129,140,248,0.1)",
    typeBorder: "rgba(129,140,248,0.2)",
    title: "TechCorp v. DevStudio",
    description: "A software company claims your client failed to deliver on time. Defend the breach of contract claim.",
    difficulty: "Intermediate",
    diffColor: "#FBBF24",
    diffBg: "rgba(251,191,36,0.1)",
    diffBorder: "rgba(251,191,36,0.2)",
    icon: "📋",
  },
  {
    id: "selfdefense",
    type: "Criminal",
    typeColor: "#FBBF24",
    typeBg: "rgba(251,191,36,0.1)",
    typeBorder: "rgba(251,191,36,0.2)",
    title: "State v. Johnson",
    description: "Your client is charged with assault. You must prove the act was self-defense under the law.",
    difficulty: "Advanced",
    diffColor: "#F87171",
    diffBg: "rgba(248,113,113,0.1)",
    diffBorder: "rgba(248,113,113,0.2)",
    icon: "🛡️",
  },
]

function CaseCard({ c }: { c: (typeof cases)[0] }) {
  return (
    <Link href={`/case/${c.id}`} style={{ textDecoration: "none" }}>
      <div
        className="case-card"
        style={{
          padding: "1.5rem 2rem",
          background: "rgba(255,255,255,0.025)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 16,
          display: "flex", alignItems: "center", gap: "1.5rem",
          cursor: "pointer", transition: "all 0.2s",
        }}
      >
        <div style={{
          width: 52, height: 52, borderRadius: 14, flexShrink: 0,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.5rem",
        }}>
          {c.icon}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{
              fontSize: 11, fontWeight: 600, fontFamily: "monospace",
              color: c.typeColor, background: c.typeBg,
              border: `1px solid ${c.typeBorder}`,
              padding: "2px 8px", borderRadius: 100,
            }}>
              {c.type}
            </span>
            <span style={{
              fontSize: 11, fontWeight: 600, fontFamily: "monospace",
              color: c.diffColor, background: c.diffBg,
              border: `1px solid ${c.diffBorder}`,
              padding: "2px 8px", borderRadius: 100,
            }}>
              {c.difficulty}
            </span>
          </div>
          <h3 style={{
            fontSize: 16, fontWeight: 700, color: "#F0EEE8",
            letterSpacing: "-0.02em", margin: "0 0 4px",
          }}>
            {c.title}
          </h3>
          <p style={{ fontSize: 13, color: "#9CA3AF", lineHeight: 1.6, margin: 0 }}>
            {c.description}
          </p>
        </div>

        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: "rgba(99,102,241,0.15)",
          border: "1px solid rgba(99,102,241,0.25)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, color: "#818CF8",
        }}>
          →
        </div>
      </div>
    </Link>
  )
}

export default function DashboardClient() {
  return (
    <main style={{ minHeight: "100vh", background: "#03030A", color: "#F0EEE8" }}>

      {/* Glow */}
      <div style={{
        position: "fixed", top: -300, left: "50%", transform: "translateX(-50%)",
        width: 600, height: 600, borderRadius: "50%", pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 65%)",
      }} />

      {/* Grid */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
        backgroundSize: "64px 64px",
      }} />

      {/* NAV */}
      <nav style={{
        position: "relative", zIndex: 20,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "1.25rem 2.5rem",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, background: "#6366F1",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, fontSize: 14, color: "#fff",
          }}>L</div>
          <span style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>
            LexAI
          </span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/sessions" style={{
            fontSize: 13, color: "#9CA3AF", textDecoration: "none",
            padding: "6px 14px", borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.08)",
          }}>
            Sessions
          </Link>
          <Link href="/professor" style={{
            fontSize: 13, color: "#9CA3AF", textDecoration: "none",
            padding: "6px 14px", borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.08)",
          }}>
            Professor
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      <div style={{ position: "relative", zIndex: 10, maxWidth: 900, margin: "0 auto", padding: "3rem 2rem" }}>

        {/* Header */}
        <div style={{ marginBottom: "3rem" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8, marginBottom: "1rem",
            background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)",
            color: "#A5B4FC", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em",
            textTransform: "uppercase", padding: "5px 12px", borderRadius: 100,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "#818CF8", display: "inline-block",
            }} />
            Courtroom Simulator
          </div>
          <h1 style={{
            fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 800, color: "#fff",
            letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: 12,
          }}>
            Choose your case,
            <br />
            <span style={{ fontStyle: "italic", color: "#6B7280" }}>counselor.</span>
          </h1>
          <p style={{ fontSize: 15, color: "#6B7280", maxWidth: 480, lineHeight: 1.7 }}>
            Select a case and argue as the defense. The AI judge and prosecutor respond to every argument you make.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: "3rem" }}>
          {[
            { num: "3", label: "Cases available" },
            { num: "0", label: "Sessions completed" },
            { num: "—", label: "Best score" },
          ].map((s) => (
            <div key={s.label} style={{
              padding: "1.25rem 1.5rem",
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 14,
            }}>
              <span style={{
                display: "block", fontSize: "2rem", fontWeight: 800,
                color: "#fff", letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 4,
              }}>
                {s.num}
              </span>
              <span style={{ fontSize: 12, color: "#6B7280" }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Section label */}
        <span style={{
          display: "block", marginBottom: "1rem",
          fontSize: 11, fontFamily: "monospace", color: "#6366F1",
          letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600,
        }}>
          Available cases
        </span>

        {/* Case cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {cases.map((c) => <CaseCard key={c.id} c={c} />)}
        </div>

        {/* Coming soon */}
        <div style={{
          marginTop: "2rem", padding: "1.25rem 2rem",
          background: "rgba(255,255,255,0.015)",
          border: "1px dashed rgba(255,255,255,0.08)",
          borderRadius: 16, display: "flex", alignItems: "center", gap: "1.5rem",
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14, flexShrink: 0,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.5rem", opacity: 0.4,
          }}>🔒</div>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: "#4B5563", marginBottom: 4 }}>
              More cases coming soon
            </h3>
            <p style={{ fontSize: 13, color: "#374151", margin: 0 }}>
              Roe v. Wade, Brown v. Board of Education, and 200+ more in progress.
            </p>
          </div>
        </div>

        <style>{`
          .case-card:hover {
            border-color: rgba(99,102,241,0.35) !important;
            background: rgba(99,102,241,0.05) !important;
          }
        `}</style>

      </div>
    </main>
  )
}