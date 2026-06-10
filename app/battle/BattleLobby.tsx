"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const CASES = [
  { id: "miranda", title: "State v. Miranda", type: "Criminal" },
  { id: "contract-breach", title: "TechCorp v. DevStudio", type: "Civil" },
  { id: "selfdefense", title: "State v. Johnson", type: "Criminal" },
];

export default function BattleLobby({ userId }: { userId: string }) {
  const router = useRouter();
  const [tab, setTab] = useState<"create" | "join">("create");
  const [selectedCase, setSelectedCase] = useState("miranda");
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdRoom, setCreatedRoom] = useState<any>(null);

  async function createRoom() {
    setLoading(true);
    setError("");
    const caseData = CASES.find((c) => c.id === selectedCase);
    const res = await fetch("/api/battle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "create_room",
        caseId: selectedCase,
        caseTitle: caseData?.title,
      }),
    });
    const data = await res.json();
    if (data.room) {
      setCreatedRoom(data.room);
    } else {
      setError(data.error || "Failed to create room");
    }
    setLoading(false);
  }

  async function joinRoom() {
    if (!joinCode.trim()) return;
    setLoading(true);
    setError("");
    const res = await fetch("/api/battle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "join_room", joinCode }),
    });
    const data = await res.json();
    if (data.room) {
      router.push(`/battle/${data.room.id}`);
    } else {
      setError(data.error || "Room not found");
    }
    setLoading(false);
  }

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
            "radial-gradient(circle, rgba(239,68,68,0.1) 0%, transparent 65%)",
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
          maxWidth: 640,
          margin: "0 auto",
          padding: "3rem 2rem",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "3rem", textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginBottom: "1rem",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.25)",
              color: "#F87171",
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
                background: "#F87171",
                display: "inline-block",
                animation: "blink 2s infinite",
              }}
            />
            Multiplayer Mode
          </div>
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
            Battle in court.
            <br />
            <em style={{ fontStyle: "italic", color: "#6B7280" }}>
              Against a real opponent.
            </em>
          </h1>
          <p style={{ fontSize: 15, color: "#6B7280", lineHeight: 1.7 }}>
            One player argues defense. The other argues prosecution. The AI
            judge scores both sides in real time.
          </p>
        </div>

        {/* How it works */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 10,
            marginBottom: "2.5rem",
          }}
        >
          {[
            {
              icon: "⚔️",
              label: "Two players",
              desc: "Defense vs Prosecution",
            },
            { icon: "⚖️", label: "AI judge", desc: "Scores both sides live" },
            {
              icon: "🏆",
              label: "Winner declared",
              desc: "After 6+ exchanges",
            },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                padding: "1rem",
                borderRadius: 12,
                textAlign: "center",
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <span
                style={{
                  display: "block",
                  fontSize: "1.5rem",
                  marginBottom: 6,
                }}
              >
                {s.icon}
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#F0EEE8",
                  marginBottom: 3,
                }}
              >
                {s.label}
              </span>
              <span style={{ fontSize: 11, color: "#6B7280" }}>{s.desc}</span>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: 4,
            marginBottom: "1.5rem",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 12,
            padding: 4,
          }}
        >
          {(
            [
              { key: "create", label: "⚔️ Create battle room" },
              { key: "join", label: "🚪 Join with code" },
            ] as const
          ).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                flex: 1,
                padding: "10px 16px",
                borderRadius: 9,
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "inherit",
                background:
                  tab === t.key ? "rgba(239,68,68,0.15)" : "transparent",
                color: tab === t.key ? "#F87171" : "#6B7280",
                transition: "all 0.2s",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Create room */}
        {tab === "create" && !createdRoom && (
          <div
            style={{
              padding: "1.5rem",
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 16,
            }}
          >
            <h3
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#F0EEE8",
                marginBottom: 16,
              }}
            >
              Choose a case to argue
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginBottom: 20,
              }}
            >
              {CASES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCase(c.id)}
                  style={{
                    padding: "14px 16px",
                    borderRadius: 12,
                    cursor: "pointer",
                    border:
                      selectedCase === c.id
                        ? "1px solid rgba(239,68,68,0.4)"
                        : "1px solid rgba(255,255,255,0.07)",
                    background:
                      selectedCase === c.id
                        ? "rgba(239,68,68,0.1)"
                        : "rgba(255,255,255,0.02)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontFamily: "inherit",
                    transition: "all 0.2s",
                  }}
                >
                  <span
                    style={{ fontSize: 14, fontWeight: 600, color: "#F0EEE8" }}
                  >
                    {c.title}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontFamily: "monospace",
                      color: c.type === "Criminal" ? "#FBBF24" : "#818CF8",
                      background:
                        c.type === "Criminal"
                          ? "rgba(251,191,36,0.1)"
                          : "rgba(129,140,248,0.1)",
                      border:
                        c.type === "Criminal"
                          ? "1px solid rgba(251,191,36,0.2)"
                          : "1px solid rgba(129,140,248,0.2)",
                      padding: "2px 8px",
                      borderRadius: 100,
                    }}
                  >
                    {c.type}
                  </span>
                </button>
              ))}
            </div>

            <div
              style={{
                padding: "12px 16px",
                borderRadius: 10,
                background: "rgba(99,102,241,0.07)",
                border: "1px solid rgba(99,102,241,0.15)",
                marginBottom: 16,
              }}
            >
              <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0 }}>
                You will play as{" "}
                <span style={{ color: "#818CF8", fontWeight: 600 }}>
                  Defense
                </span>
                . Your opponent will be{" "}
                <span style={{ color: "#F87171", fontWeight: 600 }}>
                  Prosecution
                </span>
                .
              </p>
            </div>

            <button
              onClick={createRoom}
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                background: "#EF4444",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                opacity: loading ? 0.6 : 1,
                boxShadow: "0 0 30px rgba(239,68,68,0.3)",
              }}
            >
              {loading ? "Creating room..." : "Create battle room →"}
            </button>
            {error && (
              <p style={{ fontSize: 13, color: "#F87171", marginTop: 10 }}>
                {error}
              </p>
            )}
          </div>
        )}

        {/* Room created — waiting for opponent */}
        {tab === "create" && createdRoom && (
          <div
            style={{
              padding: "2rem",
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 16,
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                margin: "0 auto 1.5rem",
                background: "rgba(74,222,128,0.1)",
                border: "1px solid rgba(74,222,128,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.8rem",
              }}
            >
              ⏳
            </div>
            <h3
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#fff",
                marginBottom: 8,
              }}
            >
              Room created!
            </h3>
            <p
              style={{ fontSize: 14, color: "#6B7280", marginBottom: "1.5rem" }}
            >
              Share this code with your opponent. They join and the battle
              begins.
            </p>

            <div
              style={{
                padding: "16px 24px",
                borderRadius: 12,
                marginBottom: "1.5rem",
                background: "rgba(99,102,241,0.1)",
                border: "1px solid rgba(99,102,241,0.25)",
                display: "inline-block",
              }}
            >
              <span
                style={{
                  fontSize: "2.5rem",
                  fontWeight: 800,
                  color: "#818CF8",
                  fontFamily: "monospace",
                  letterSpacing: "0.15em",
                }}
              >
                {createdRoom.join_code}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                onClick={() =>
                  navigator.clipboard.writeText(createdRoom.join_code)
                }
                style={{
                  padding: "12px",
                  background: "rgba(99,102,241,0.15)",
                  border: "1px solid rgba(99,102,241,0.25)",
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#818CF8",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Copy code
              </button>
              <Link
                href={`/battle/${createdRoom.id}`}
                style={{
                  padding: "12px",
                  background: "#EF4444",
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#fff",
                  textDecoration: "none",
                  display: "block",
                  textAlign: "center",
                  boxShadow: "0 0 20px rgba(239,68,68,0.3)",
                }}
              >
                Enter battle room →
              </Link>
            </div>
          </div>
        )}

        {/* Join room */}
        {tab === "join" && (
          <div
            style={{
              padding: "1.5rem",
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 16,
            }}
          >
            <h3
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#F0EEE8",
                marginBottom: 8,
              }}
            >
              Enter the battle code
            </h3>
            <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 16 }}>
              Your opponent created the room and shared a 6-letter code with
              you.
            </p>
            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              <input
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="Enter code..."
                maxLength={6}
                style={{
                  flex: 1,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10,
                  padding: "14px 16px",
                  fontSize: 20,
                  color: "#F0EEE8",
                  fontFamily: "monospace",
                  outline: "none",
                  letterSpacing: "0.15em",
                  textAlign: "center",
                  fontWeight: 800,
                }}
              />
            </div>

            <div
              style={{
                padding: "12px 16px",
                borderRadius: 10,
                background: "rgba(248,113,113,0.07)",
                border: "1px solid rgba(248,113,113,0.15)",
                marginBottom: 16,
              }}
            >
              <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0 }}>
                You will play as{" "}
                <span style={{ color: "#F87171", fontWeight: 600 }}>
                  Prosecution
                </span>
                . Your opponent is{" "}
                <span style={{ color: "#818CF8", fontWeight: 600 }}>
                  Defense
                </span>
                .
              </p>
            </div>

            <button
              onClick={joinRoom}
              disabled={loading || !joinCode.trim()}
              style={{
                width: "100%",
                padding: "14px",
                background: joinCode.trim() ? "#EF4444" : "rgba(239,68,68,0.2)",
                color: joinCode.trim() ? "#fff" : "#6B7280",
                border: "none",
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 700,
                cursor: loading || !joinCode.trim() ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s",
              }}
            >
              {loading ? "Joining..." : "Join battle →"}
            </button>
            {error && (
              <p style={{ fontSize: 13, color: "#F87171", marginTop: 10 }}>
                {error}
              </p>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </main>
  );
}
