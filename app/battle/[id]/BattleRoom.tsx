"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type BattleMessage = {
  role: "defense" | "prosecution" | "judge";
  content: string;
  userId: string;
  timestamp: string;
};

export default function BattleRoom({
  room: initialRoom,
  userId,
}: {
  room: any;
  userId: string;
}) {
  const [room, setRoom] = useState(initialRoom);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const isPlayer1 = room.player1_id === userId;
  const myRole = isPlayer1 ? room.player1_role : room.player2_role;
  const opponentRole = myRole === "defense" ? "prosecution" : "defense";
  const myScore =
    myRole === "defense" ? room.player1_score : room.player2_score;
  const opponentScore =
    myRole === "defense" ? room.player2_score : room.player1_score;
  const messages: BattleMessage[] = room.messages || [];
  const isWaiting = room.status === "waiting";
  const isCompleted = room.status === "completed";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Supabase Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel(`battle_room_${room.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "battle_rooms",
          filter: `id=eq.${room.id}`,
        },
        (payload) => {
          setRoom(payload.new);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [room.id]);

  async function sendMessage() {
    if (!input.trim() || loading || isWaiting || isCompleted) return;
    setLoading(true);
    const currentInput = input;
    setInput("");

    const res = await fetch("/api/battle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "send_message",
        roomId: room.id,
        message: currentInput,
        role: myRole,
      }),
    });

    const data = await res.json();
    if (data.feedback) setFeedback(data.feedback);
    setLoading(false);
  }

  const roleColor = (role: string) => {
    if (role === "judge") return "#FBBF24";
    if (role === "defense") return "#818CF8";
    return "#F87171";
  };

  const roleBg = (role: string) => {
    if (role === "judge") return "rgba(251,191,36,0.08)";
    if (role === "defense") return "rgba(99,102,241,0.1)";
    return "rgba(248,113,113,0.08)";
  };

  const roleBorder = (role: string) => {
    if (role === "judge") return "rgba(251,191,36,0.18)";
    if (role === "defense") return "rgba(99,102,241,0.25)";
    return "rgba(248,113,113,0.18)";
  };

  const roleAbbr = (role: string) => {
    if (role === "judge") return "JDG";
    if (role === "defense") return "DEF";
    return "PRO";
  };

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

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#03030A",
        color: "#F0EEE8",
        display: "flex",
        flexDirection: "column",
      }}
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
          backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      {/* TOP BAR */}
      <div
        style={{
          position: "relative",
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1rem 2rem",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(3,3,10,0.8)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link
            href="/battle"
            style={{ fontSize: 13, color: "#6B7280", textDecoration: "none" }}
          >
            ← Leave
          </Link>
          <div
            style={{
              width: 1,
              height: 20,
              background: "rgba(255,255,255,0.08)",
            }}
          />
          <div>
            <h1
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#F0EEE8",
                margin: 0,
              }}
            >
              {room.case_title}
            </h1>
            <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>
              Multiplayer battle · You are {myRole}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              padding: "4px 12px",
              borderRadius: 100,
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.25)",
              fontSize: 11,
              fontWeight: 700,
              color: "#F87171",
              fontFamily: "monospace",
              letterSpacing: "0.06em",
            }}
          >
            ⚔️ BATTLE
          </div>
          <div
            style={{
              padding: "4px 12px",
              borderRadius: 100,
              background: isWaiting
                ? "rgba(251,191,36,0.1)"
                : isCompleted
                  ? "rgba(74,222,128,0.1)"
                  : "rgba(74,222,128,0.1)",
              border: `1px solid ${isWaiting ? "rgba(251,191,36,0.2)" : "rgba(74,222,128,0.2)"}`,
              fontSize: 11,
              fontWeight: 700,
              color: isWaiting ? "#FBBF24" : "#4ADE80",
              fontFamily: "monospace",
            }}
          >
            {isWaiting ? "WAITING" : isCompleted ? "ENDED" : "LIVE"}
          </div>
        </div>
      </div>

      {/* SCOREBOARD */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          background: "rgba(255,255,255,0.015)",
        }}
      >
        {/* My score */}
        <div
          style={{
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            borderRight: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 10,
              fontFamily: "monospace",
              fontWeight: 700,
              color: roleColor(myRole),
              background: roleBg(myRole),
              border: `1px solid ${roleBorder(myRole)}`,
            }}
          >
            {roleAbbr(myRole)}
          </div>
          <div>
            <span
              style={{
                display: "block",
                fontSize: 12,
                color: "#6B7280",
                marginBottom: 2,
              }}
            >
              You · {myRole}
            </span>
            <div
              style={{
                display: "inline-flex",
                padding: "2px 10px",
                borderRadius: 100,
                background: scoreBg(myScore),
                border: `1px solid ${scoreBorder(myScore)}`,
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: scoreColor(myScore),
                }}
              >
                {myScore}
              </span>
            </div>
          </div>
        </div>

        {/* VS */}
        <div
          style={{
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 800, color: "#374151" }}>
            VS
          </span>
        </div>

        {/* Opponent score */}
        <div
          style={{
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 12,
            borderLeft: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div style={{ textAlign: "right" }}>
            <span
              style={{
                display: "block",
                fontSize: 12,
                color: "#6B7280",
                marginBottom: 2,
              }}
            >
              Opponent · {opponentRole}
            </span>
            {room.player2_id ? (
              <div
                style={{
                  display: "inline-flex",
                  padding: "2px 10px",
                  borderRadius: 100,
                  background: scoreBg(opponentScore),
                  border: `1px solid ${scoreBorder(opponentScore)}`,
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: scoreColor(opponentScore),
                  }}
                >
                  {opponentScore}
                </span>
              </div>
            ) : (
              <span
                style={{ fontSize: 12, color: "#4B5563", fontStyle: "italic" }}
              >
                Not joined yet
              </span>
            )}
          </div>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 10,
              fontFamily: "monospace",
              fontWeight: 700,
              color: roleColor(opponentRole),
              background: roleBg(opponentRole),
              border: `1px solid ${roleBorder(opponentRole)}`,
            }}
          >
            {roleAbbr(opponentRole)}
          </div>
        </div>
      </div>

      {/* WAITING STATE */}
      {isWaiting && (
        <div
          style={{
            position: "relative",
            zIndex: 10,
            padding: "1.5rem 2rem",
            background: "rgba(251,191,36,0.05)",
            borderBottom: "1px solid rgba(251,191,36,0.15)",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#FBBF24",
              animation: "blink 1.5s infinite",
            }}
          />
          <div>
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#FBBF24",
                display: "block",
                marginBottom: 2,
              }}
            >
              Waiting for opponent to join
            </span>
            <span style={{ fontSize: 12, color: "#92400E" }}>
              Share this code:{" "}
              <span
                style={{
                  fontFamily: "monospace",
                  fontWeight: 800,
                  color: "#FBBF24",
                  letterSpacing: "0.12em",
                  fontSize: 14,
                }}
              >
                {room.join_code}
              </span>
            </span>
          </div>
        </div>
      )}

      {/* WINNER BANNER */}
      {isCompleted &&
        (() => {
          const defenseWon = room.player1_score > room.player2_score;
          const iWon =
            (myRole === "defense" && defenseWon) ||
            (myRole === "prosecution" && !defenseWon);
          return (
            <div
              style={{
                position: "relative",
                zIndex: 10,
                padding: "1.5rem 2rem",
                background: iWon
                  ? "rgba(74,222,128,0.08)"
                  : "rgba(248,113,113,0.08)",
                borderBottom: `1px solid ${iWon ? "rgba(74,222,128,0.2)" : "rgba(248,113,113,0.2)"}`,
                textAlign: "center",
              }}
            >
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: iWon ? "#4ADE80" : "#F87171",
                }}
              >
                {iWon
                  ? "🏆 You won the case!"
                  : "⚖️ Your opponent won this round."}
              </span>
            </div>
          );
        })()}

      {/* MESSAGES */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          position: "relative",
          zIndex: 10,
          padding: "2rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          maxWidth: 780,
          width: "100%",
          margin: "0 auto",
        }}
      >
        {messages.length === 0 && !isWaiting && (
          <div style={{ textAlign: "center", padding: "3rem 0" }}>
            <p style={{ fontSize: 15, color: "#4B5563" }}>
              Both players are ready. Make your opening argument.
            </p>
          </div>
        )}

        {messages.map((msg, i) => {
          const isMe = msg.userId === userId;
          const isJudge = msg.role === "judge";

          if (isJudge) {
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
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
                    fontSize: 9,
                    fontFamily: "monospace",
                    fontWeight: 700,
                    color: "#FBBF24",
                    background: "rgba(251,191,36,0.08)",
                    border: "1px solid rgba(251,191,36,0.18)",
                  }}
                >
                  JDG
                </div>
                <div style={{ flex: 1 }}>
                  <span
                    style={{
                      fontSize: 10,
                      fontFamily: "monospace",
                      color: "#4B5563",
                      display: "block",
                      marginBottom: 4,
                      letterSpacing: "0.06em",
                    }}
                  >
                    JUDGE
                  </span>
                  <div
                    style={{
                      padding: "12px 16px",
                      borderRadius: "4px 14px 14px 14px",
                      background: "rgba(251,191,36,0.07)",
                      border: "1px solid rgba(251,191,36,0.15)",
                      fontSize: 14,
                      lineHeight: 1.7,
                      color: "#E5E7EB",
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
                flexDirection: isMe ? "row-reverse" : "row",
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
                  fontSize: 9,
                  fontFamily: "monospace",
                  fontWeight: 700,
                  color: roleColor(msg.role),
                  background: roleBg(msg.role),
                  border: `1px solid ${roleBorder(msg.role)}`,
                }}
              >
                {roleAbbr(msg.role)}
              </div>
              <div
                style={{
                  maxWidth: "75%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: isMe ? "flex-end" : "flex-start",
                  gap: 4,
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontFamily: "monospace",
                    color: "#4B5563",
                    letterSpacing: "0.06em",
                  }}
                >
                  {isMe ? "YOU" : "OPPONENT"} · {msg.role.toUpperCase()}
                </span>
                <div
                  style={{
                    padding: "12px 16px",
                    borderRadius: isMe
                      ? "14px 4px 14px 14px"
                      : "4px 14px 14px 14px",
                    background: roleBg(msg.role),
                    border: `1px solid ${roleBorder(msg.role)}`,
                    fontSize: 14,
                    lineHeight: 1.7,
                    color: "#E5E7EB",
                  }}
                >
                  {msg.content}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div style={{ display: "flex", gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 9,
                fontFamily: "monospace",
                fontWeight: 700,
                color: "#FBBF24",
                background: "rgba(251,191,36,0.08)",
                border: "1px solid rgba(251,191,36,0.18)",
              }}
            >
              JDG
            </div>
            <div
              style={{
                padding: "14px 18px",
                borderRadius: "4px 14px 14px 14px",
                background: "rgba(251,191,36,0.06)",
                border: "1px solid rgba(251,191,36,0.15)",
                display: "flex",
                gap: 5,
                alignItems: "center",
              }}
            >
              {[0, 150, 300].map((delay) => (
                <span
                  key={delay}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#6B7280",
                    display: "inline-block",
                    animation: "bounce 1s infinite",
                    animationDelay: `${delay}ms`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* FEEDBACK */}
      {feedback && (
        <div
          style={{
            position: "relative",
            zIndex: 20,
            borderTop: "1px solid rgba(255,255,255,0.07)",
            background: "rgba(3,3,10,0.9)",
            backdropFilter: "blur(12px)",
            padding: "10px 2rem",
          }}
        >
          <div style={{ maxWidth: 780, margin: "0 auto" }}>
            <p
              style={{
                fontSize: 12,
                color: "#4B5563",
                fontStyle: "italic",
                margin: 0,
              }}
            >
              💡 {feedback}
            </p>
          </div>
        </div>
      )}

      {/* INPUT */}
      <div
        style={{
          position: "relative",
          zIndex: 20,
          borderTop: "1px solid rgba(255,255,255,0.07)",
          background: "rgba(3,3,10,0.95)",
          backdropFilter: "blur(12px)",
          padding: "1rem 1.5rem",
        }}
      >
        <div
          style={{ maxWidth: 780, margin: "0 auto", display: "flex", gap: 12 }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              background: "rgba(255,255,255,0.04)",
              border:
                isWaiting || isCompleted
                  ? "1px solid rgba(255,255,255,0.04)"
                  : myRole === "defense"
                    ? "1px solid rgba(99,102,241,0.2)"
                    : "1px solid rgba(248,113,113,0.2)",
              borderRadius: 12,
              padding: "0 16px",
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder={
                isWaiting
                  ? "Waiting for opponent to join..."
                  : isCompleted
                    ? "Battle has ended"
                    : `Argue as ${myRole}...`
              }
              disabled={isWaiting || isCompleted}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                fontSize: 14,
                color: "#F0EEE8",
                padding: "14px 0",
                fontFamily: "inherit",
                opacity: isWaiting || isCompleted ? 0.4 : 1,
              }}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim() || isWaiting || isCompleted}
            style={{
              background:
                loading || !input.trim() || isWaiting || isCompleted
                  ? "rgba(239,68,68,0.2)"
                  : "#EF4444",
              color:
                loading || !input.trim() || isWaiting || isCompleted
                  ? "#6B7280"
                  : "#fff",
              border: "none",
              borderRadius: 12,
              padding: "14px 24px",
              fontSize: 14,
              fontWeight: 600,
              cursor:
                loading || !input.trim() || isWaiting || isCompleted
                  ? "not-allowed"
                  : "pointer",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
              fontFamily: "inherit",
            }}
          >
            Argue ↗
          </button>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        input::placeholder { color: #374151; }
        input:disabled::placeholder { color: #1F2937; }
      `}</style>
    </main>
  );
}
