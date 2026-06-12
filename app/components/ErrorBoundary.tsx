"use client";
import { Component, ReactNode } from "react";
import Link from "next/link";
interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error("ErrorBoundary caught:", error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <DefaultError />;
    }
    return this.props.children;
  }
}

function DefaultError() {
  return (
    <div
      style={{
        padding: "2rem",
        background: "rgba(248,113,113,0.06)",
        border: "1px solid rgba(248,113,113,0.2)",
        borderRadius: 16,
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: "rgba(248,113,113,0.1)",
          border: "1px solid rgba(248,113,113,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.4rem",
          margin: "0 auto 1rem",
        }}
      >
        ⚠️
      </div>
      <h3
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: "#F87171",
          marginBottom: 8,
        }}
      >
        Something went wrong
      </h3>
      <p
        style={{
          fontSize: 13,
          color: "#6B7280",
          marginBottom: 16,
          lineHeight: 1.6,
        }}
      >
        An unexpected error occurred. Please refresh the page and try again.
      </p>
      <button
        onClick={() => window.location.reload()}
        style={{
          background: "rgba(248,113,113,0.15)",
          border: "1px solid rgba(248,113,113,0.25)",
          color: "#F87171",
          borderRadius: 8,
          padding: "8px 18px",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        Refresh page
      </button>
    </div>
  );
}

export function AIError({ onRetry }: { onRetry?: () => void }) {
  return (
    <div
      style={{
        padding: "1.25rem 1.5rem",
        background: "rgba(248,113,113,0.06)",
        border: "1px solid rgba(248,113,113,0.15)",
        borderRadius: 14,
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          flexShrink: 0,
          background: "rgba(248,113,113,0.1)",
          border: "1px solid rgba(248,113,113,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1rem",
        }}
      >
        ⚠️
      </div>
      <div style={{ flex: 1 }}>
        <span
          style={{
            display: "block",
            fontSize: 13,
            fontWeight: 600,
            color: "#F87171",
            marginBottom: 3,
          }}
        >
          AI response failed
        </span>
        <span style={{ fontSize: 12, color: "#6B7280" }}>
          The AI could not respond right now. Check your API key or try again.
        </span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            background: "rgba(248,113,113,0.1)",
            border: "1px solid rgba(248,113,113,0.2)",
            color: "#F87171",
            borderRadius: 8,
            padding: "6px 14px",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
            whiteSpace: "nowrap",
          }}
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function SessionLoadError() {
  return (
    <div
      style={{
        padding: "3rem",
        textAlign: "center",
        background: "rgba(248,113,113,0.04)",
        border: "1px dashed rgba(248,113,113,0.15)",
        borderRadius: 16,
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "rgba(248,113,113,0.08)",
          border: "1px solid rgba(248,113,113,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.5rem",
          margin: "0 auto 1.25rem",
        }}
      >
        📂
      </div>
      <h3
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: "#F87171",
          marginBottom: 8,
        }}
      >
        Could not load sessions
      </h3>
      <p
        style={{
          fontSize: 13,
          color: "#6B7280",
          marginBottom: 20,
          lineHeight: 1.6,
        }}
      >
        There was a problem fetching your session history. Check your connection
        and try again.
      </p>
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <button
          onClick={() => window.location.reload()}
          style={{
            background: "rgba(248,113,113,0.1)",
            border: "1px solid rgba(248,113,113,0.2)",
            color: "#F87171",
            borderRadius: 8,
            padding: "8px 18px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Refresh
        </button>
        <Link
          href="/dashboard"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#9CA3AF",
            borderRadius: 8,
            padding: "8px 18px",
            fontSize: 13,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
