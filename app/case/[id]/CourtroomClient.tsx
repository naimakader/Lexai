"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { AIError } from "@/app/components/ErrorBoundary";

type Message = {
  role: "judge" | "prosecution" | "user" | "witness";
  content: string;
};

type WitnessMessage = {
  role: "witness" | "user";
  content: string;
};

type ScoreEntry = {
  turn: number;
  score: number;
  argument: string;
  delta: number;
  mode: "defense" | "witness";
};

type CaseData = {
  title: string;
  type: string;
  description: string;
  facts: string;
  witness: {
    name: string;
    role: string;
    testimony: string;
  };
};

type Mode = "defense" | "witness";

function MessageBubble({ msg }: { msg: Message | WitnessMessage }) {
  const isUser = msg.role === "user";
  const config: Record<
    string,
    {
      abbr: string;
      label: string;
      color: string;
      bg: string;
      border: string;
      bubbleRadius: string;
    }
  > = {
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
    witness: {
      abbr: "WIT",
      label: "WITNESS",
      color: "#34D399",
      bg: "rgba(52,211,153,0.08)",
      border: "rgba(52,211,153,0.18)",
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
  const [mode, setMode] = useState<Mode>("defense");
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
  const [witnessMessages, setWitnessMessages] = useState<WitnessMessage[]>([
    {
      role: "witness",
      content: `I swear to tell the truth. My name is ${caseData.witness.name}, I am the ${caseData.witness.role}. ${caseData.witness.testimony}`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(
    "Present your opening argument to begin.",
  );
  const [scoreHistory, setScoreHistory] = useState<ScoreEntry[]>([]);
  const [contradiction, setContradiction] = useState(false);
  const [aiError, setAiError] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const witnessBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mode === "defense")
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    if (mode === "witness")
      witnessBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, witnessMessages, mode]);

  async function sendArgument() {
    if (!input.trim() || loading) return;
    setAiError(false);
    if (mode === "defense") {
      await sendDefenseArgument();
    } else {
      await sendWitnessQuestion();
    }
  }

  async function sendDefenseArgument() {
    const userMessage: Message = { role: "user", content: input };
    const currentInput = input;
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

      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      if (!data.judgeResponse) throw new Error("Invalid response");

      const newEntry: ScoreEntry = {
        turn: scoreHistory.length + 1,
        score: data.score,
        argument: currentInput,
        delta: data.scoreDelta || 0,
        mode: "defense",
      };

      const updatedHistory = [...scoreHistory, newEntry];
      const updatedMessages: Message[] = [
        ...messages,
        userMessage,
        { role: "judge", content: data.judgeResponse },
        { role: "prosecution", content: data.prosecutionResponse },
      ];

      const bestArgument = updatedHistory.reduce(
        (best, entry) => (entry.score > (best?.score ?? 0) ? entry : best),
        updatedHistory[0],
      );

      setMessages(updatedMessages);
      setScore(data.score);
      setFeedback(data.feedback);
      setScoreHistory(updatedHistory);

      await supabase.from("sessions").upsert({
        user_id: userId,
        case_title: caseData.title,
        messages: updatedMessages,
        score: data.score,
        score_history: updatedHistory,
        best_argument: bestArgument?.argument || "",
        completed: true,
      });
    } catch (err) {
      console.error(err);
      setAiError(true);
      setMessages((prev) => prev.filter((m) => m.content !== input));
    } finally {
      setLoading(false);
    }
  }

  async function sendWitnessQuestion() {
    const userMessage: WitnessMessage = { role: "user", content: input };
    const currentInput = input;
    setWitnessMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/witness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseData,
          witnessMessages: [...witnessMessages, userMessage],
          userId,
        }),
      });

      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      if (!data.witnessResponse) throw new Error("Invalid response");

      const newEntry: ScoreEntry = {
        turn: scoreHistory.length + 1,
        score: data.score,
        argument: currentInput,
        delta: data.scoreDelta || 0,
        mode: "witness",
      };

      const updatedHistory = [...scoreHistory, newEntry];
      const updatedWitnessMessages: WitnessMessage[] = [
        ...witnessMessages,
        userMessage,
        { role: "witness", content: data.witnessResponse },
      ];

      setWitnessMessages(updatedWitnessMessages);
      setScore(data.score);
      setFeedback(data.feedback);
      setScoreHistory(updatedHistory);
      setContradiction(data.contradiction || false);

      await supabase.from("sessions").upsert({
        user_id: userId,
        case_title: caseData.title,
        messages,
        score: data.score,
        score_history: updatedHistory,
        best_argument:
          updatedHistory.reduce(
            (best, entry) => (entry.score > (best?.score ?? 0) ? entry : best),
            updatedHistory[0],
          )?.argument || "",
        completed: true,
      });
    } catch (err) {
      console.error(err);
      setAiError(true);
      setWitnessMessages((prev) => prev.filter((m) => m.content !== input));
    } finally {
      setLoading(false);
      setTimeout(() => setContradiction(false), 3000);
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
            href="/dashboard"
            style={{ fontSize: 13, color: "#6B7280", textDecoration: "none" }}
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
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link
            href="/sessions"
            style={{
              fontSize: 12,
              color: "#818CF8",
              textDecoration: "none",
              background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.2)",
              padding: "5px 12px",
              borderRadius: 8,
            }}
          >
            Session history ↗
          </Link>
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
      </div>

      {/* MODE TABS */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: "12px 2rem",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          background: "rgba(255,255,255,0.015)",
        }}
      >
        <button
          onClick={() => setMode("defense")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 18px",
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "inherit",
            background:
              mode === "defense" ? "rgba(99,102,241,0.2)" : "transparent",
            color: mode === "defense" ? "#818CF8" : "#6B7280",
            outline:
              mode === "defense"
                ? "1px solid rgba(99,102,241,0.35)"
                : "1px solid transparent",
            transition: "all 0.2s",
          }}
        >
          <span>⚖️</span> Defense Mode
        </button>
        <button
          onClick={() => setMode("witness")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 18px",
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "inherit",
            background:
              mode === "witness" ? "rgba(52,211,153,0.15)" : "transparent",
            color: mode === "witness" ? "#34D399" : "#6B7280",
            outline:
              mode === "witness"
                ? "1px solid rgba(52,211,153,0.3)"
                : "1px solid transparent",
            transition: "all 0.2s",
          }}
        >
          <span>🎤</span> Cross-Examine Witness
        </button>

        {mode === "witness" && (
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              borderRadius: 10,
              background: "rgba(52,211,153,0.08)",
              border: "1px solid rgba(52,211,153,0.2)",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#34D399",
              }}
            />
            <span style={{ fontSize: 12, color: "#34D399", fontWeight: 600 }}>
              {caseData.witness.name} · {caseData.witness.role}
            </span>
          </div>
        )}
      </div>

      {/* PERSONAS — defense mode only */}
      {mode === "defense" && (
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
                borderRight:
                  i < 2 ? "1px solid rgba(255,255,255,0.07)" : "none",
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
      )}

      {/* WITNESS BANNER */}
      {mode === "witness" && (
        <div
          style={{
            position: "relative",
            zIndex: 10,
            padding: "14px 2rem",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            background: "rgba(52,211,153,0.04)",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 10,
              fontFamily: "monospace",
              fontWeight: 700,
              color: "#34D399",
              background: "rgba(52,211,153,0.1)",
              border: "1px solid rgba(52,211,153,0.25)",
            }}
          >
            WIT
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
              {caseData.witness.name}
            </span>
            <span style={{ fontSize: 12, color: "#6B7280" }}>
              {caseData.witness.role} · On the stand · Ask questions to find
              contradictions
            </span>
          </div>
          {contradiction && (
            <div
              style={{
                marginLeft: "auto",
                padding: "6px 16px",
                borderRadius: 100,
                background: "rgba(248,113,113,0.15)",
                border: "1px solid rgba(248,113,113,0.3)",
                fontSize: 12,
                fontWeight: 700,
                color: "#F87171",
                animation: "pulse 0.5s ease",
              }}
            >
              ⚡ CONTRADICTION CAUGHT — Score bonus!
            </div>
          )}
        </div>
      )}

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
          gap: 20,
          maxWidth: 780,
          width: "100%",
          margin: "0 auto",
        }}
      >
        {mode === "defense" &&
          messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}

        {mode === "witness" &&
          witnessMessages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}

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
                color: mode === "witness" ? "#34D399" : "#FBBF24",
                background:
                  mode === "witness"
                    ? "rgba(52,211,153,0.08)"
                    : "rgba(251,191,36,0.08)",
                border:
                  mode === "witness"
                    ? "1px solid rgba(52,211,153,0.18)"
                    : "1px solid rgba(251,191,36,0.18)",
              }}
            >
              {mode === "witness" ? "WIT" : "JDG"}
            </div>
            <div
              style={{
                padding: "14px 18px",
                borderRadius: "4px 14px 14px 14px",
                background:
                  mode === "witness"
                    ? "rgba(52,211,153,0.06)"
                    : "rgba(251,191,36,0.06)",
                border:
                  mode === "witness"
                    ? "1px solid rgba(52,211,153,0.15)"
                    : "1px solid rgba(251,191,36,0.15)",
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

        {/* AI Error */}
        {aiError && (
          <AIError
            onRetry={() => {
              setAiError(false);
              setInput("");
            }}
          />
        )}

        <div ref={mode === "defense" ? bottomRef : witnessBottomRef} />
      </div>

      {/* SCORE BAR */}
      <div
        style={{
          position: "relative",
          zIndex: 20,
          borderTop: "1px solid rgba(255,255,255,0.07)",
          background: "rgba(3,3,10,0.9)",
          backdropFilter: "blur(12px)",
          padding: "12px 2rem",
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
              {mode === "witness"
                ? "Cross-Examination Score"
                : "Argument Strength"}
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
              border:
                mode === "witness"
                  ? "1px solid rgba(52,211,153,0.2)"
                  : "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12,
              padding: "0 16px",
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendArgument()}
              placeholder={
                mode === "witness"
                  ? `Ask ${caseData.witness.name} a question...`
                  : "Type your legal argument..."
              }
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
                loading || !input.trim()
                  ? "rgba(99,102,241,0.3)"
                  : mode === "witness"
                    ? "#059669"
                    : "#6366F1",
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
            {mode === "witness" ? "Ask ↗" : "Submit ↗"}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        input::placeholder { color: #374151; }
      `}</style>
    </main>
  );
}
