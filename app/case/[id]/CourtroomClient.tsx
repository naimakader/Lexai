"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
type Message = {
  role: "judge" | "prosecution" | "user";
  content: string;
};

type CaseData = {
  title: string;
  type: string;
  description: string;
  facts: string;
};

function Message({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";

  const config = {
    judge: {
      abbr: "JDG",
      label: "JUDGE",
      color: "#FBBF24",
      bg: "rgba(251,191,36,0.08)",
      border: "rgba(251,191,36,0.18)",
      bubbleRadius: "4px 14px 14px 14px",
    },
    prosecution: {
      abbr: "PRO",
      label: "PROSECUTION",
      color: "#F87171",
      bg: "rgba(248,113,113,0.08)",
      border: "rgba(248,113,113,0.18)",
      bubbleRadius: "4px 14px 14px 14px",
    },
    user: {
      abbr: "YOU",
      label: "YOU · DEFENSE",
      color: "#818CF8",
      bg: "rgba(99,102,241,0.12)",
      border: "rgba(99,102,241,0.28)",
      bubbleRadius: "14px 4px 14px 14px",
    },
  };

  const c = config[msg.role];

  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        flexDirection: isUser ? "row-reverse" : "row",
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
          color: c.color,
          background: c.bg,
          border: `1px solid ${c.border}`,
        }}
      >
        {c.abbr}
      </div>
      <div
        style={{
          maxWidth: "78%",
          display: "flex",
          flexDirection: "column",
          alignItems: isUser ? "flex-end" : "flex-start",
          gap: 4,
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontFamily: "monospace",
            color: "#4B5563",
            letterSpacing: "0.06em",
            fontWeight: 600,
          }}
        >
          {c.label}
        </span>
        <div
          style={{
            padding: "12px 16px",
            borderRadius: c.bubbleRadius,
            background: c.bg,
            border: `1px solid ${c.border}`,
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

export default function CourtroomClient({
  caseData,
  caseId,
  userId,
}: {
  caseData: CaseData;
  caseId: string;
  userId: string;
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "judge",
      content: `Court is now in session. This is the case of ${caseData.title}. Counselor, you are representing the defense. Please present your opening argument.`,
    },
    {
      role: "prosecution",
      content: `Your Honor, the facts of this case are clear. ${caseData.facts} The prosecution is confident in its position.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(
    "Present your opening argument to begin.",
  );
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendArgument() {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/courtroom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId,
          caseData,
          messages: [...messages, userMessage],
          userId,
        }),
      });

      const data = await res.json();

      const updatedMessages: Message[] = [
        ...messages,
        userMessage,
        { role: "judge", content: data.judgeResponse },
        { role: "prosecution", content: data.prosecutionResponse },
      ];

      setMessages(updatedMessages);
      setScore(data.score);
      setFeedback(data.feedback);

      await supabase.from("sessions").upsert({
        user_id: userId,
        case_title: caseData.title,
        messages: updatedMessages,
        score: data.score,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const scoreColor =
    score >= 70 ? "#4ADE80" : score >= 40 ? "#FBBF24" : "#F87171";
  const scoreBg =
    score >= 70
      ? "rgba(74,222,128,0.15)"
      : score >= 40
        ? "rgba(251,191,36,0.15)"
        : "rgba(248,113,113,0.15)";

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
            "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 65%)",
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

      {/* ── TOP BAR ── */}
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
            href="/dashboard"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              color: "#6B7280",
              textDecoration: "none",
            }}
          >
            ← Back
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
                letterSpacing: "-0.01em",
              }}
            >
              {caseData.title}
            </h1>
            <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>
              {caseData.description}
            </p>
          </div>
        </div>
        <span
          style={{
            fontSize: 11,
            fontFamily: "monospace",
            fontWeight: 600,
            color: "#FBBF24",
            background: "rgba(251,191,36,0.1)",
            border: "1px solid rgba(251,191,36,0.2)",
            padding: "3px 10px",
            borderRadius: 100,
          }}
        >
          {caseData.type}
        </span>
      </div>

      {/* ── PERSONAS ── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          background: "rgba(255,255,255,0.015)",
        }}
      >
        {[
          {
            label: "Judge",
            abbr: "JDG",
            color: "#FBBF24",
            bg: "rgba(251,191,36,0.1)",
            border: "rgba(251,191,36,0.2)",
            desc: "AI · Presiding",
          },
          {
            label: "Prosecution",
            abbr: "PRO",
            color: "#F87171",
            bg: "rgba(248,113,113,0.1)",
            border: "rgba(248,113,113,0.2)",
            desc: "AI · Opposing",
          },
          {
            label: "You · Defense",
            abbr: "YOU",
            color: "#818CF8",
            bg: "rgba(99,102,241,0.12)",
            border: "rgba(99,102,241,0.25)",
            desc: "Your role",
          },
        ].map((p, i) => (
          <div
            key={p.label}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              padding: "14px 12px",
              borderRight: i < 2 ? "1px solid rgba(255,255,255,0.07)" : "none",
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
                fontSize: 10,
                fontFamily: "monospace",
                fontWeight: 700,
                color: p.color,
                background: p.bg,
                border: `1px solid ${p.border}`,
              }}
            >
              {p.abbr}
            </div>
            <div>
              <span
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#F0EEE8",
                }}
              >
                {p.label}
              </span>
              <span style={{ fontSize: 11, color: "#4B5563" }}>{p.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── MESSAGES ── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          position: "relative",
          zIndex: 10,
          padding: "2rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: 20,
          maxWidth: 780,
          width: "100%",
          margin: "0 auto",
        }}
      >
        {messages.map((msg, i) => (
          <Message key={i} msg={msg} />
        ))}

        {/* Typing indicator */}
        {loading && (
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
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

      {/* ── SCORE BAR ── */}
      <div
        style={{
          position: "relative",
          zIndex: 20,
          borderTop: "1px solid rgba(255,255,255,0.07)",
          background: "rgba(3,3,10,0.9)",
          backdropFilter: "blur(12px)",
          padding: "12px 2rem",
          maxWidth: "100%",
        }}
      >
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
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
              Argument Strength
            </span>
            <div
              style={{
                flex: 1,
                height: 6,
                borderRadius: 3,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.06)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  borderRadius: 3,
                  width: `${score}%`,
                  background: scoreColor,
                  transition: "width 0.7s ease, background 0.4s",
                }}
              />
            </div>
            <div
              style={{
                minWidth: 42,
                padding: "2px 8px",
                borderRadius: 6,
                textAlign: "center",
                background: scoreBg,
                border: `1px solid ${scoreColor}40`,
                fontSize: 12,
                fontFamily: "monospace",
                fontWeight: 700,
                color: scoreColor,
              }}
            >
              {score}
            </div>
          </div>
          <p
            style={{
              fontSize: 12,
              color: "#4B5563",
              fontStyle: "italic",
              margin: 0,
            }}
          >
            {feedback}
          </p>
        </div>
      </div>

      {/* ── INPUT ── */}
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
          style={{
            maxWidth: 780,
            margin: "0 auto",
            display: "flex",
            gap: 12,
            alignItems: "center",
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12,
              padding: "0 16px",
              transition: "border-color 0.2s",
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendArgument()}
              placeholder="Type your legal argument..."
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                fontSize: 14,
                color: "#F0EEE8",
                padding: "14px 0",
                fontFamily: "inherit",
              }}
            />
          </div>
          <button
            onClick={sendArgument}
            disabled={loading || !input.trim()}
            style={{
              background:
                loading || !input.trim() ? "rgba(99,102,241,0.3)" : "#6366F1",
              color: loading || !input.trim() ? "#6B7280" : "#fff",
              border: "none",
              borderRadius: 12,
              padding: "14px 24px",
              fontSize: 14,
              fontWeight: 600,
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
              fontFamily: "inherit",
            }}
          >
            Submit ↗
          </button>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        input::placeholder { color: #374151; }
      `}</style>
    </main>
  );
}
