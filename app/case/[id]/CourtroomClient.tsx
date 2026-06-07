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

      // Save session to Supabase
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
    score >= 70 ? "bg-green-500" : score >= 40 ? "bg-yellow-500" : "bg-red-500";

  return (
    <main className="min-h-screen bg-[#0a0a0b] flex flex-col">
      {/* Top bar */}
      <div className="border-b border-white/10 bg-[#111114] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-gray-500 hover:text-white text-sm transition-colors"
          >
            ← Back
          </Link>
          <div>
            <h1 className="text-white font-semibold text-sm">
              {caseData.title}
            </h1>
            <p className="text-gray-500 text-xs">{caseData.description}</p>
          </div>
        </div>
        <span className="text-xs font-mono text-yellow-500/80 bg-yellow-500/10 border border-yellow-500/20 px-2 py-1 rounded-full">
          {caseData.type}
        </span>
      </div>

      {/* Personas */}
      <div className="grid grid-cols-3 border-b border-white/10">
        {[
          { label: "Judge", role: "JDG", color: "text-yellow-400" },
          { label: "Prosecution", role: "PRO", color: "text-red-400" },
          { label: "You · Defense", role: "YOU", color: "text-blue-400" },
        ].map((p) => (
          <div
            key={p.label}
            className="flex flex-col items-center py-3 bg-[#111114]"
          >
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-mono mb-1">
              <span className={p.color}>{p.role}</span>
            </div>
            <span className="text-xs text-gray-400">{p.label}</span>
          </div>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-4 max-w-3xl w-full mx-auto">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono flex-shrink-0 border border-white/10
                ${msg.role === "judge" ? "bg-yellow-500/10 text-yellow-400" : ""}
                ${msg.role === "prosecution" ? "bg-red-500/10 text-red-400" : ""}
                ${msg.role === "user" ? "bg-blue-500/10 text-blue-400" : ""}
              `}
            >
              {msg.role === "judge"
                ? "JDG"
                : msg.role === "prosecution"
                  ? "PRO"
                  : "YOU"}
            </div>
            <div className="flex flex-col gap-1 max-w-[80%]">
              <span className="text-xs text-gray-600 uppercase tracking-wider font-mono">
                {msg.role === "judge"
                  ? "Judge"
                  : msg.role === "prosecution"
                    ? "Prosecution"
                    : "You · Defense"}
              </span>
              <div
                className={`px-4 py-3 rounded-xl text-sm leading-relaxed
                  ${
                    msg.role === "user"
                      ? "bg-blue-500/10 border border-blue-500/20 text-blue-100"
                      : "bg-[#111114] border border-white/10 text-gray-300"
                  }
                `}
              >
                {msg.content}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-yellow-500/10 border border-white/10 flex items-center justify-center text-xs font-mono text-yellow-400">
              JDG
            </div>
            <div className="bg-[#111114] border border-white/10 px-4 py-3 rounded-xl flex gap-1 items-center">
              <span
                className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <span
                className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Score bar */}
      <div className="border-t border-white/10 bg-[#111114] px-6 py-3">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-xs font-mono text-gray-500">
              Argument Strength
            </span>
            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${scoreColor}`}
                style={{ width: `${score}%` }}
              />
            </div>
            <span className="text-xs font-mono text-gray-400 w-6 text-right">
              {score}
            </span>
          </div>
          <p className="text-xs text-gray-600 italic">{feedback}</p>
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-white/10 bg-[#0a0a0b] px-4 py-4">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendArgument()}
            placeholder="Type your legal argument..."
            className="flex-1 bg-[#111114] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-white/30 transition-colors"
          />
          <button
            onClick={sendArgument}
            disabled={loading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-3 rounded-xl text-sm font-medium transition-colors"
          >
            Submit ↗
          </button>
        </div>
      </div>
    </main>
  );
}
