import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const caseTitle = searchParams.get("case") || "State v. Miranda";
  const score = searchParams.get("score") || "0";
  const bestArgument = searchParams.get("best") || "No argument recorded";
  const turns = searchParams.get("turns") || "0";

  const scoreNum = parseInt(score);
  const scoreColor =
    scoreNum >= 70 ? "#4ADE80" : scoreNum >= 40 ? "#FBBF24" : "#F87171";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#03030A",
        padding: "60px",
        fontFamily: "sans-serif",
        position: "relative",
      }}
    >
      {/* Background grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          display: "flex",
        }}
      />

      {/* Top glow */}
      <div
        style={{
          position: "absolute",
          top: -200,
          left: "50%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 65%)",
          display: "flex",
        }}
      />

      {/* Logo row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 40,
          position: "relative",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: "#6366F1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 20,
            color: "#fff",
          }}
        >
          L
        </div>
        <span
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: "#fff",
            letterSpacing: "-1px",
          }}
        >
          LexAI
        </span>
        <div
          style={{
            marginLeft: "auto",
            background: "rgba(99,102,241,0.15)",
            border: "1px solid rgba(99,102,241,0.3)",
            color: "#A5B4FC",
            fontSize: 13,
            fontWeight: 600,
            padding: "6px 16px",
            borderRadius: 100,
            display: "flex",
            alignItems: "center",
          }}
        >
          AI Courtroom Simulator
        </div>
      </div>

      {/* Case title */}
      <div
        style={{
          fontSize: 13,
          color: "#6366F1",
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: 12,
          position: "relative",
        }}
      >
        Session Result
      </div>

      <div
        style={{
          fontSize: 42,
          fontWeight: 800,
          color: "#FFFFFF",
          letterSpacing: "-2px",
          lineHeight: 1.1,
          marginBottom: 32,
          position: "relative",
        }}
      >
        {caseTitle}
      </div>

      {/* Stats row */}
      <div
        style={{
          display: "flex",
          gap: 16,
          marginBottom: 40,
          position: "relative",
        }}
      >
        {/* Score */}
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${scoreColor}40`,
            borderRadius: 16,
            padding: "20px 28px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <span
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: scoreColor,
              lineHeight: 1,
            }}
          >
            {score}
          </span>
          <span
            style={{
              fontSize: 12,
              color: "#6B7280",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Final Score
          </span>
        </div>

        {/* Turns */}
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            padding: "20px 28px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <span
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1,
            }}
          >
            {turns}
          </span>
          <span
            style={{
              fontSize: 12,
              color: "#6B7280",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Arguments
          </span>
        </div>

        {/* Rating */}
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            padding: "20px 28px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <span
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1,
            }}
          >
            {scoreNum >= 80
              ? "A"
              : scoreNum >= 65
                ? "B"
                : scoreNum >= 50
                  ? "C"
                  : "D"}
          </span>
          <span
            style={{
              fontSize: 12,
              color: "#6B7280",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Grade
          </span>
        </div>
      </div>

      {/* Best argument */}
      <div
        style={{
          background: "rgba(99,102,241,0.08)",
          border: "1px solid rgba(99,102,241,0.2)",
          borderRadius: 16,
          padding: "20px 24px",
          position: "relative",
          marginBottom: 32,
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: "#818CF8",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 8,
            display: "flex",
          }}
        >
          ⭐ Best Argument
        </div>
        <div
          style={{
            fontSize: 18,
            color: "#E5E7EB",
            lineHeight: 1.5,
            fontStyle: "italic",
            display: "-webkit-box",
          }}
        >
          "
          {bestArgument.length > 120
            ? bestArgument.slice(0, 120) + "..."
            : bestArgument}
          "
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        <span style={{ fontSize: 16, color: "#4B5563" }}>lexai.vercel.app</span>
        <span style={{ fontSize: 14, color: "#374151" }}>
          Practice law. Win cases. Free.
        </span>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}
