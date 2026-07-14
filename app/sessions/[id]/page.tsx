import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import Link from "next/link";

export default async function SessionReplayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { id } = await params;
  const { data: session } = await supabaseAdmin
    .from("sessions")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (!session) redirect("/sessions");

  const scoreHistory = session.score_history || [];
  const bestScore =
    scoreHistory.length > 0
      ? Math.max(...scoreHistory.map((s: any) => s.score))
      : 0;
  const bestTurn = scoreHistory.find((s: any) => s.score === bestScore);

  const scoreColor = (score: number) =>
    score >= 70 ? "#4ADE80" : score >= 40 ? "#FBBF24" : "#F87171";
  const scoreBg = (score: number) =>
    score >= 70
      ? "rgba(74,222,128,0.1)"
      : score >= 40
        ? "rgba(251,191,36,0.1)"
        : "rgba(248,113,113,0.1)";
  const scoreBorder = (score: number) =>
    score >= 70
      ? "rgba(74,222,128,0.2)"
      : score >= 40
        ? "rgba(251,191,36,0.2)"
        : "rgba(248,113,113,0.2)";

  const caseIdMap: Record<string, string> = {
    "State v. Miranda": "miranda",
    "TechCorp v. DevStudio": "contract-breach",
    "State v. Johnson": "selfdefense",
  };

  const date = new Date(session.created_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

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
          href="/sessions"
          style={{ fontSize: 13, color: "#6B7280", textDecoration: "none" }}
        >
          ← Back to sessions
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
        <div style={{ marginBottom: "2.5rem" }}>
          <span
            style={{ fontSize: 12, color: "#6B7280", fontFamily: "monospace" }}
          >
            {date}
          </span>
          <h1
            style={{
              fontSize: "clamp(1.8rem,3.5vw,2.8rem)",
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              margin: "8px 0 12px",
            }}
          >
            {session.case_title}
          </h1>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: scoreBg(session.score),
                border: `1px solid ${scoreBorder(session.score)}`,
                padding: "4px 12px",
                borderRadius: 100,
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: scoreColor(session.score),
                }}
              >
                Final score: {session.score}
              </span>
            </div>
            <span style={{ fontSize: 13, color: "#6B7280" }}>
              {scoreHistory.length} arguments made
            </span>
            <span style={{ fontSize: 13, color: "#6B7280" }}>
              Best score: {bestScore}
            </span>
          </div>
        </div>

        {/* Score Graph */}
        {scoreHistory.length > 0 && (
          <div
            style={{
              marginBottom: "2.5rem",
              padding: "1.5rem",
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 16,
            }}
          >
            <span
              style={{
                display: "block",
                fontSize: 11,
                fontFamily: "monospace",
                color: "#6366F1",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontWeight: 600,
                marginBottom: "1.25rem",
              }}
            >
              Score progression
            </span>

            <div
              style={{
                position: "relative",
                height: 120,
                marginBottom: "1rem",
              }}
            >
              {[25, 50, 75].map((line) => (
                <div
                  key={line}
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: `${line}%`,
                    height: 1,
                    background: "rgba(255,255,255,0.04)",
                  }}
                />
              ))}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 6,
                  padding: "0 4px",
                }}
              >
                {scoreHistory.map((entry: any, i: number) => {
                  const isBest = entry.score === bestScore;
                  const color = scoreColor(entry.score);
                  const isWitness = entry.mode === "witness";
                  return (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 4,
                        height: "100%",
                        justifyContent: "flex-end",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 10,
                          fontFamily: "monospace",
                          color,
                          fontWeight: 700,
                        }}
                      >
                        {entry.score}
                      </span>
                      <div
                        style={{
                          width: "100%",
                          borderRadius: "4px 4px 0 0",
                          height: `${entry.score}%`,
                          background: isBest ? color : `${color}55`,
                          border: isBest
                            ? `1px solid ${color}`
                            : isWitness
                              ? "1px solid rgba(52,211,153,0.3)"
                              : "none",
                          position: "relative",
                        }}
                      >
                        {isBest && (
                          <div
                            style={{
                              position: "absolute",
                              top: -22,
                              left: "50%",
                              transform: "translateX(-50%)",
                              background: "#6366F1",
                              color: "#fff",
                              fontSize: 8,
                              fontWeight: 700,
                              fontFamily: "monospace",
                              padding: "2px 5px",
                              borderRadius: 4,
                              whiteSpace: "nowrap",
                            }}
                          >
                            BEST
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "flex", gap: 6, padding: "0 4px" }}>
              {scoreHistory.map((entry: any, i: number) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    textAlign: "center",
                    fontSize: 10,
                    fontFamily: "monospace",
                    color: entry.mode === "witness" ? "#34D399" : "#4B5563",
                  }}
                >
                  {entry.mode === "witness" ? "W" : "T"}
                  {i + 1}
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 2,
                    background: "#818CF8",
                  }}
                />
                <span style={{ fontSize: 11, color: "#6B7280" }}>
                  Defense turn
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 2,
                    background: "#34D399",
                  }}
                />
                <span style={{ fontSize: 11, color: "#6B7280" }}>
                  Witness turn
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Best argument */}
        {bestTurn && (
          <div
            style={{
              marginBottom: "2.5rem",
              padding: "1.5rem",
              background: "rgba(99,102,241,0.07)",
              border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: 16,
            }}
          >
            <div style={{ marginBottom: 10 }}>
              <span
                style={{
                  fontSize: 11,
                  fontFamily: "monospace",
                  fontWeight: 700,
                  color: "#818CF8",
                  background: "rgba(99,102,241,0.15)",
                  border: "1px solid rgba(99,102,241,0.3)",
                  padding: "3px 10px",
                  borderRadius: 100,
                }}
              >
                ⭐ BEST ARGUMENT — Turn {bestTurn.turn} · Score {bestTurn.score}
              </span>
            </div>
            <p
              style={{
                fontSize: 14,
                color: "#E5E7EB",
                lineHeight: 1.7,
                margin: 0,
                fontStyle: "italic",
              }}
            >
              "{bestTurn.argument}"
            </p>
          </div>
        )}

        {/* Timeline */}
        {scoreHistory.length > 0 && (
          <>
            <span
              style={{
                display: "block",
                fontSize: 11,
                fontFamily: "monospace",
                color: "#6366F1",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontWeight: 600,
                marginBottom: "1.5rem",
              }}
            >
              Argument timeline
            </span>

            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {scoreHistory.map((entry: any, i: number) => {
                const isBest = entry.score === bestScore;
                const color = scoreColor(entry.score);
                const bg = scoreBg(entry.score);
                const border = scoreBorder(entry.score);
                const isPositive = entry.delta >= 0;
                const isWitness = entry.mode === "witness";

                return (
                  <div key={i} style={{ display: "flex", gap: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        marginRight: 16,
                      }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          fontWeight: 700,
                          fontFamily: "monospace",
                          background: isWitness ? "rgba(52,211,153,0.1)" : bg,
                          border: isWitness
                            ? "1px solid rgba(52,211,153,0.25)"
                            : `1px solid ${border}`,
                          color: isWitness ? "#34D399" : color,
                          zIndex: 1,
                        }}
                      >
                        {i + 1}
                      </div>
                      {i < scoreHistory.length - 1 && (
                        <div
                          style={{
                            width: 1,
                            flex: 1,
                            background: "rgba(255,255,255,0.06)",
                            minHeight: 24,
                          }}
                        />
                      )}
                    </div>

                    <div
                      style={{
                        flex: 1,
                        marginBottom: i < scoreHistory.length - 1 ? 16 : 0,
                        padding: "1.25rem",
                        background: isBest
                          ? "rgba(99,102,241,0.07)"
                          : isWitness
                            ? "rgba(52,211,153,0.04)"
                            : "rgba(255,255,255,0.025)",
                        border: `1px solid ${
                          isBest
                            ? "rgba(99,102,241,0.25)"
                            : isWitness
                              ? "rgba(52,211,153,0.15)"
                              : "rgba(255,255,255,0.07)"
                        }`,
                        borderRadius: 14,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: 8,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 11,
                              color: "#6B7280",
                              fontFamily: "monospace",
                            }}
                          >
                            Turn {entry.turn}
                          </span>
                          {isWitness && (
                            <span
                              style={{
                                fontSize: 10,
                                fontWeight: 700,
                                fontFamily: "monospace",
                                color: "#34D399",
                                background: "rgba(52,211,153,0.1)",
                                border: "1px solid rgba(52,211,153,0.25)",
                                padding: "2px 8px",
                                borderRadius: 100,
                              }}
                            >
                              🎤 WITNESS
                            </span>
                          )}
                          {isBest && (
                            <span
                              style={{
                                fontSize: 10,
                                fontWeight: 700,
                                fontFamily: "monospace",
                                color: "#818CF8",
                                background: "rgba(99,102,241,0.15)",
                                border: "1px solid rgba(99,102,241,0.3)",
                                padding: "2px 8px",
                                borderRadius: 100,
                              }}
                            >
                              ⭐ BEST
                            </span>
                          )}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          {entry.delta !== 0 && (
                            <span
                              style={{
                                fontSize: 11,
                                fontFamily: "monospace",
                                fontWeight: 600,
                                color: isPositive ? "#4ADE80" : "#F87171",
                              }}
                            >
                              {isPositive ? "+" : ""}
                              {entry.delta}
                            </span>
                          )}
                          <div
                            style={{
                              padding: "3px 10px",
                              borderRadius: 100,
                              background: bg,
                              border: `1px solid ${border}`,
                              fontSize: 12,
                              fontWeight: 700,
                              color,
                              fontFamily: "monospace",
                            }}
                          >
                            {entry.score}
                          </div>
                        </div>
                      </div>
                      <p
                        style={{
                          fontSize: 13,
                          color: "#D1D5DB",
                          lineHeight: 1.65,
                          margin: 0,
                        }}
                      >
                        "{entry.argument}"
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {scoreHistory.length === 0 && (
          <div
            style={{
              padding: "2rem",
              textAlign: "center",
              background: "rgba(255,255,255,0.02)",
              border: "1px dashed rgba(255,255,255,0.08)",
              borderRadius: 16,
            }}
          >
            <p style={{ fontSize: 14, color: "#4B5563" }}>
              This session was saved before score tracking was added. Play a new
              session to see the full timeline.
            </p>
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: "2.5rem",
            flexWrap: "wrap",
          }}
        >
          <Link
            href={`/sessions/${session.id}/share`}
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#fff",
              textDecoration: "none",
              background: "#6366F1",
              padding: "10px 20px",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              gap: 6,
              boxShadow: "0 0 20px rgba(99,102,241,0.4)",
            }}
          >
            🔗 Share session
          </Link>
          <Link
            href={`/case/${caseIdMap[session.case_title] || "miranda"}`}
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#fff",
              textDecoration: "none",
              background: "rgba(255,255,255,0.06)",
              padding: "10px 20px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            Argue this case again →
          </Link>
          <Link
            href="/sessions"
            style={{
              fontSize: 13,
              color: "#6B7280",
              textDecoration: "none",
              padding: "10px 20px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            All sessions
          </Link>
        </div>
      </div>
    </main>
  );
}
