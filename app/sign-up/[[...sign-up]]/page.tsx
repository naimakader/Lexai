import { SignUp } from "@clerk/nextjs";
import { clerkDarkTheme } from "@/app/clerk-theme";

export default function SignUpPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#03030A",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
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
          background:
            "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: "2rem",
          position: "relative",
          zIndex: 10,
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
      </div>

      {/* Heading */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "2rem",
          position: "relative",
          zIndex: 10,
        }}
      >
        <h1
          style={{
            fontSize: "1.8rem",
            fontWeight: 800,
            color: "#fff",
            letterSpacing: "-0.03em",
            marginBottom: 8,
          }}
        >
          Create your account
        </h1>
        <p style={{ fontSize: 14, color: "#6B7280" }}>
          Free forever. Start arguing cases in 30 seconds.
        </p>
      </div>

      {/* Clerk component */}
      <div style={{ position: "relative", zIndex: 10 }}>
        <SignUp appearance={clerkDarkTheme} />
      </div>
    </main>
  );
}
