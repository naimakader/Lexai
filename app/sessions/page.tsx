import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Suspense } from "react";
import { SkeletonSessionCard, skeletonStyles } from "@/app/components/Skeleton";

function SessionsSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {[1, 2, 3].map((i) => (
        <SkeletonSessionCard key={i} />
      ))}
      <style>{skeletonStyles}</style>
    </div>
  );
}

async function SessionsList({ userId }: { userId: string }) {
  const { data: sessions } = await supabase
    .from("sessions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (!sessions || sessions.length === 0) {
    return (
      <div
        style={{
          padding: "3rem",
          textAlign: "center",
          background: "rgba(255,255,255,0.02)",
          border: "1px dashed rgba(255,255,255,0.08)",
          borderRadius: 16,
        }}
      >
        <p style={{ fontSize: 15, color: "#4B5563", marginBottom: 16 }}>
          No sessions yet. Go argue a case first.
        </p>
        <Link
          href="/dashboard"
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#fff",
            textDecoration: "none",
            background: "#6366F1",
            padding: "10px 20px",
            borderRadius: 8,
          }}
        >
          Go to dashboard →
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {sessions.map((session: any) => {
        const scoreColor =
          session.score >= 70
            ? "#4ADE80"
            : session.score >= 40
              ? "#FBBF24"
              : "#F87171";
        const scoreBg =
          session.score >= 70
            ? "rgba(74,222,128,0.1)"
            : session.score >= 40
              ? "rgba(251,191,36,0.1)"
              : "rgba(248,113,113,0.1)";
        const scoreBorder =
          session.score >= 70
            ? "rgba(74,222,128,0.2)"
            : session.score >= 40
              ? "rgba(251,191,36,0.2)"
              : "rgba(248,113,113,0.2)";
        const date = new Date(session.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        const turns = session.score_history?.length || 0;

        return (
          <Link
            key={session.id}
            href={`/sessions/${session.id}`}
            style={{ textDecoration: "none" }}
          >
            <div
              className="session-card"
              style={{
                padding: "1.5rem 2rem",
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 16,
                display: "flex",
                alignItems: "center",
                gap: "1.5rem",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  background: scoreBg,
                  border: `1px solid ${scoreBorder}`,
                }}
              >
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: scoreColor,
                    lineHeight: 1,
                  }}
                >
                  {session.score}
                </span>
                <span
                  style={{
                    fontSize: 9,
                    color: scoreColor,
                    opacity: 0.7,
                    fontFamily: "monospace",
                  }}
                >
                  SCORE
                </span>
              </div>

              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#F0EEE8",
                    letterSpacing: "-0.02em",
                    marginBottom: 4,
                  }}
                >
                  {session.case_title}
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 12, color: "#6B7280" }}>{date}</span>
                  <span style={{ fontSize: 12, color: "#4B5563" }}>·</span>
                  <span style={{ fontSize: 12, color: "#6B7280" }}>
                    {turns} argument{turns !== 1 ? "s" : ""}
                  </span>
                  {session.best_argument && (
                    <>
                      <span style={{ fontSize: 12, color: "#4B5563" }}>·</span>
                      <span style={{ fontSize: 12, color: "#818CF8" }}>
                        Has replay ↗
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  flexShrink: 0,
                  background: "rgba(99,102,241,0.15)",
                  border: "1px solid rgba(99,102,241,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  color: "#818CF8",
                }}
              >
                →
              </div>
            </div>
          </Link>
        );
      })}
      <style>{`
        .session-card:hover {
          border-color: rgba(99,102,241,0.35) !important;
          background: rgba(99,102,241,0.05) !important;
        }
        ${skeletonStyles}
      `}</style>
    </div>
  );
}

export default async function SessionsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <main
      style={{ minHeight: "100vh", background: "#03030A", color: "#F0EEE8" }}
    >
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
            "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 65%)",
        }}
      />

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
          href="/dashboard"
          style={{ fontSize: 13, color: "#6B7280", textDecoration: "none" }}
        >
          ← Back to dashboard
        </Link>
      </nav>

      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: 860,
          margin: "0 auto",
          padding: "3rem 2rem",
        }}
      >
        <div style={{ marginBottom: "3rem" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginBottom: "1rem",
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
            Session History
          </span>
          <h1
            style={{
              fontSize: "clamp(2rem,4vw,3rem)",
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              marginBottom: 12,
            }}
          >
            Your courtroom
            <br />
            <em style={{ fontStyle: "italic", color: "#6B7280" }}>sessions.</em>
          </h1>
          <p style={{ fontSize: 15, color: "#6B7280", lineHeight: 1.7 }}>
            Click any session to replay it and see your argument timeline.
          </p>
        </div>

        <Suspense fallback={<SessionsSkeleton />}>
          <SessionsList userId={userId} />
        </Suspense>
      </div>
    </main>
  );
}
