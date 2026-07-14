"use client";
import { useState } from "react";
import Link from "next/link";
export default function ShareClient({ session }: { session: any }) {
  const [copied, setCopied] = useState(false);
  const scoreHistory = session.score_history || [];
  const turns = scoreHistory.length;
  const scoreNum = session.score;
  const scoreColor =
    scoreNum >= 70 ? "#4ADE80" : scoreNum >= 40 ? "#FBBF24" : "#F87171";
  const scoreBg =
    scoreNum >= 70
      ? "rgba(74,222,128,0.1)"
      : scoreNum >= 40
        ? "rgba(251,191,36,0.1)"
        : "rgba(248,113,113,0.1)";
  const scoreBorder =
    scoreNum >= 70
      ? "rgba(74,222,128,0.25)"
      : scoreNum >= 40
        ? "rgba(251,191,36,0.25)"
        : "rgba(248,113,113,0.25)";
  const grade =
    scoreNum >= 80 ? "A" : scoreNum >= 65 ? "B" : scoreNum >= 50 ? "C" : "D";
  const gradeLabel =
    scoreNum >= 80
      ? "Excellent"
      : scoreNum >= 65
        ? "Good"
        : scoreNum >= 50
          ? "Average"
          : "Needs Work";
  const bestArgument = session.best_argument || "No argument recorded";

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/sessions/${session.id}/share`
      : "";

  const ogImageUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/api/og?case=${encodeURIComponent(session.case_title)}&score=${scoreNum}&best=${encodeURIComponent(bestArgument)}&turns=${turns}`
      : "";

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`I just argued ${session.case_title} on LexAI and scored ${scoreNum}/100. Free AI courtroom simulator for law students.`)}&url=${encodeURIComponent(shareUrl)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  async function copyLink() {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const date = new Date(session.created_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main
      style={{ minHeight: "100vh", background: "#03030A", color: "#F0EEE8" }}
    >
      {/* Glow */}
      <div
        style={{
          position: "fixed",
          top: -300,
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 600,
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 0,
          background:
            "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 65%)",
        }}
      />

      {/* Grid */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Nav */}
      <nav
        style={{
          position: "relative",
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.25rem 2.5rem",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "#6366F1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 14,
              color: "#fff",
            }}
          >
            L
          </div>
          <span
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.03em",
            }}
          >
            LexAI
          </span>
        </Link>
        <Link
          href={`/sessions/${session.id}`}
          style={{ fontSize: 13, color: "#6B7280", textDecoration: "none" }}
        >
          ← Back to session
        </Link>
      </nav>

      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: 760,
          margin: "0 auto",
          padding: "3rem 2rem",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginBottom: "1.25rem",
              background: "rgba(99,102,241,0.12)",
              border: "1px solid rgba(99,102,241,0.3)",
              color: "#A5B4FC",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "5px 12px",
              borderRadius: 100,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#818CF8",
                display: "inline-block",
              }}
            />
            Session Complete
          </div>
          <h1
            style={{
              fontSize: "clamp(2rem,4vw,3rem)",
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              marginBottom: 10,
            }}
          >
            {session.case_title}
          </h1>
          <p style={{ fontSize: 14, color: "#6B7280" }}>{date}</p>
        </div>

        {/* Share card */}
        <div
          style={{
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20,
            overflow: "hidden",
            marginBottom: "2rem",
            boxShadow:
              "0 0 60px rgba(99,102,241,0.15), 0 40px 80px rgba(0,0,0,0.5)",
          }}
        >
          {/* Card header */}
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              padding: "16px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 7,
                  background: "#6366F1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: 12,
                  color: "#fff",
                }}
              >
                L
              </div>
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: "#fff",
                  letterSpacing: "-0.02em",
                }}
              >
                LexAI
              </span>
            </div>
            <span
              style={{
                fontSize: 11,
                color: "#A5B4FC",
                fontWeight: 600,
                background: "rgba(99,102,241,0.12)",
                border: "1px solid rgba(99,102,241,0.25)",
                padding: "3px 10px",
                borderRadius: 100,
                letterSpacing: "0.06em",
              }}
            >
              AI COURTROOM SIMULATOR
            </span>
          </div>

          <div style={{ padding: "2rem" }}>
            <div
              style={{
                fontSize: 11,
                color: "#6366F1",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Session Result
            </div>
            <h2
              style={{
                fontSize: "clamp(1.5rem,3vw,2.2rem)",
                fontWeight: 800,
                color: "#fff",
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                marginBottom: "1.5rem",
              }}
            >
              {session.case_title}
            </h2>

            {/* Stats */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 12,
                marginBottom: "1.5rem",
              }}
            >
              <div
                style={{
                  padding: "1.25rem",
                  borderRadius: 14,
                  textAlign: "center",
                  background: scoreBg,
                  border: `1px solid ${scoreBorder}`,
                }}
              >
                <span
                  style={{
                    display: "block",
                    fontSize: "2.2rem",
                    fontWeight: 800,
                    color: scoreColor,
                    lineHeight: 1,
                    marginBottom: 4,
                  }}
                >
                  {scoreNum}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: scoreColor,
                    opacity: 0.8,
                    fontFamily: "monospace",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                  }}
                >
                  FINAL SCORE
                </span>
              </div>
              <div
                style={{
                  padding: "1.25rem",
                  borderRadius: 14,
                  textAlign: "center",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <span
                  style={{
                    display: "block",
                    fontSize: "2.2rem",
                    fontWeight: 800,
                    color: "#fff",
                    lineHeight: 1,
                    marginBottom: 4,
                  }}
                >
                  {turns}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: "#6B7280",
                    fontFamily: "monospace",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                  }}
                >
                  ARGUMENTS
                </span>
              </div>
              <div
                style={{
                  padding: "1.25rem",
                  borderRadius: 14,
                  textAlign: "center",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <span
                  style={{
                    display: "block",
                    fontSize: "2.2rem",
                    fontWeight: 800,
                    color: "#fff",
                    lineHeight: 1,
                    marginBottom: 4,
                  }}
                >
                  {grade}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: "#6B7280",
                    fontFamily: "monospace",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                  }}
                >
                  {gradeLabel.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Best argument */}
            <div
              style={{
                padding: "1.25rem 1.5rem",
                background: "rgba(99,102,241,0.07)",
                border: "1px solid rgba(99,102,241,0.2)",
                borderRadius: 14,
                marginBottom: "1.5rem",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: "#818CF8",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                ⭐ Best Argument
              </div>
              <p
                style={{
                  fontSize: 14,
                  color: "#E5E7EB",
                  lineHeight: 1.7,
                  fontStyle: "italic",
                  margin: 0,
                }}
              >
                "
                {bestArgument.length > 160
                  ? bestArgument.slice(0, 160) + "..."
                  : bestArgument}
                "
              </p>
            </div>

            {/* Score bar */}
            <div style={{ marginBottom: "0.5rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 6,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontFamily: "monospace",
                    color: "#4B5563",
                    whiteSpace: "nowrap",
                  }}
                >
                  Overall Performance
                </span>
                <div
                  style={{
                    flex: 1,
                    height: 6,
                    borderRadius: 3,
                    background: "rgba(255,255,255,0.06)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      borderRadius: 3,
                      width: `${scoreNum}%`,
                      background: scoreColor,
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontFamily: "monospace",
                    fontWeight: 700,
                    color: scoreColor,
                  }}
                >
                  {scoreNum}/100
                </span>
              </div>
            </div>
          </div>

          {/* Card footer */}
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              padding: "12px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <span style={{ fontSize: 12, color: "#4B5563" }}>
              lexai.vercel.app
            </span>
            <span style={{ fontSize: 12, color: "#374151" }}>
              Practice law. Win cases. Free.
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <button
            onClick={copyLink}
            style={{
              width: "100%",
              padding: "16px",
              background: copied ? "rgba(74,222,128,0.15)" : "#6366F1",
              border: copied ? "1px solid rgba(74,222,128,0.3)" : "none",
              borderRadius: 14,
              cursor: "pointer",
              fontSize: 15,
              fontWeight: 700,
              color: copied ? "#4ADE80" : "#fff",
              fontFamily: "inherit",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {copied ? "✓ Link copied!" : "🔗 Copy share link"}
          </button>

          <Link
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              width: "100%",
              padding: "16px",
              background: "rgba(10,102,194,0.15)",
              border: "1px solid rgba(10,102,194,0.3)",
              borderRadius: 14,
              fontSize: 15,
              fontWeight: 700,
              color: "#60A5FA",
              fontFamily: "inherit",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            📤 Share on LinkedIn
          </Link>

          <Link
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              width: "100%",
              padding: "16px",
              background: "rgba(29,161,242,0.1)",
              border: "1px solid rgba(29,161,242,0.25)",
              borderRadius: 14,
              fontSize: 15,
              fontWeight: 700,
              color: "#60A5FA",
              fontFamily: "inherit",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            🐦 Share on Twitter
          </Link>

          <Link
            href={ogImageUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              width: "100%",
              padding: "16px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 14,
              fontSize: 15,
              fontWeight: 600,
              color: "#9CA3AF",
              fontFamily: "inherit",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            🖼 Preview share image
          </Link>
        </div>

        {/* Bottom links */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: "2rem",
            justifyContent: "center",
          }}
        >
          <Link
            href={`/sessions/${session.id}`}
            style={{
              fontSize: 13,
              color: "#6B7280",
              textDecoration: "none",
              padding: "10px 20px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            View replay timeline
          </Link>
          <Link
            href="/dashboard"
            style={{
              fontSize: 13,
              color: "#6B7280",
              textDecoration: "none",
              padding: "10px 20px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
