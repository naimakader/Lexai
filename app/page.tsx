"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Home() {
  return (
    <main
      style={{
        background: "#03030A",
        color: "#F0EEE8",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      {/* SUBTLE GRID */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      {/* TOP GLOW */}
      <div
        style={{
          position: "fixed",
          top: -350,
          left: "50%",
          transform: "translateX(-50%)",
          width: 700,
          height: 700,
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 0,
          background:
            "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 65%)",
        }}
      />

      {/* ── NAV ── */}
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
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
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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

        <div style={{ display: "flex", gap: "2rem" }}>
          {["Features", "Cases", "About"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              style={{ fontSize: 13, color: "#9CA3AF", textDecoration: "none" }}
            >
              {item}
            </Link>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link
            href="/sign-in"
            style={{
              fontSize: 13,
              color: "#9CA3AF",
              textDecoration: "none",
              padding: "6px 14px",
            }}
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#fff",
              textDecoration: "none",
              background: "#6366F1",
              padding: "8px 18px",
              borderRadius: 8,
            }}
          >
            Start free →
          </Link>
        </div>
      </motion.nav>

      {/* ── HERO ── */}
      <section
        style={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          padding: "5rem 2.5rem 4rem",
        }}
      >
        <motion.div
          custom={0}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginBottom: "2rem",
            background: "rgba(99,102,241,0.12)",
            border: "1px solid rgba(99,102,241,0.3)",
            color: "#A5B4FC",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            padding: "6px 14px",
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
          AI-Powered Legal Training Platform
        </motion.div>

        <motion.h1
          custom={1}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          style={{
            fontSize: "clamp(3rem,7vw,5.5rem)",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.04em",
            color: "#FFFFFF",
            marginBottom: "1.5rem",
          }}
        >
          Win in court.
          <br />
          <span
            style={{
              fontStyle: "italic",
              background: "linear-gradient(135deg,#818CF8 0%,#C084FC 60%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Practice first.
          </span>
        </motion.h1>

        <motion.p
          custom={2}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          style={{
            fontSize: "1.15rem",
            color: "#9CA3AF",
            lineHeight: 1.75,
            fontWeight: 400,
            maxWidth: 500,
            margin: "0 auto 2.5rem",
          }}
        >
          Argue real landmark cases against an AI judge and prosecutor. Get
          scored on every argument.{" "}
          <span style={{ color: "#F0EEE8", fontWeight: 500 }}>
            Completely free.
          </span>
        </motion.p>

        <motion.div
          custom={3}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: "4rem",
          }}
        >
          <Link
            href="/sign-up"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 15,
              fontWeight: 600,
              color: "#fff",
              textDecoration: "none",
              background: "#6366F1",
              padding: "14px 32px",
              borderRadius: 12,
              boxShadow: "0 0 40px rgba(99,102,241,0.45)",
            }}
          >
            Enter the courtroom →
          </Link>
          <Link
            href="/dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontSize: 15,
              color: "#9CA3AF",
              textDecoration: "none",
              padding: "14px 24px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            Browse cases ↗
          </Link>
        </motion.div>

        {/* APP PREVIEW */}
        <motion.div
          custom={4}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          style={{
            maxWidth: 740,
            margin: "0 auto",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 18,
            overflow: "hidden",
            boxShadow:
              "0 0 80px rgba(99,102,241,0.15), 0 60px 100px rgba(0,0,0,0.6)",
          }}
        >
          {/* Window bar */}
          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#FF5F57",
              }}
            />
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#FFBD2E",
              }}
            />
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#28CA41",
              }}
            />
            <div
              style={{
                marginLeft: 10,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 6,
                padding: "3px 12px",
                fontSize: 11,
                fontFamily: "monospace",
                color: "#6B7280",
              }}
            >
              lexai.app/case/miranda
            </div>
          </div>

          <div style={{ padding: "1.5rem" }}>
            {/* Personas */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 8,
                marginBottom: "1.25rem",
              }}
            >
              {[
                {
                  label: "Judge",
                  abbr: "JDG",
                  color: "#FBBF24",
                  bg: "rgba(251,191,36,0.1)",
                  border: "rgba(251,191,36,0.2)",
                },
                {
                  label: "Prosecution",
                  abbr: "PRO",
                  color: "#F87171",
                  bg: "rgba(248,113,113,0.1)",
                  border: "rgba(248,113,113,0.2)",
                },
                {
                  label: "You · Defense",
                  abbr: "YOU",
                  color: "#818CF8",
                  bg: "rgba(99,102,241,0.12)",
                  border: "rgba(99,102,241,0.25)",
                },
              ].map((p) => (
                <div
                  key={p.label}
                  style={{
                    padding: "10px 8px",
                    borderRadius: 10,
                    textAlign: "center",
                    background: p.bg,
                    border: `1px solid ${p.border}`,
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontFamily: "monospace",
                      fontWeight: 700,
                      color: p.color,
                      marginBottom: 2,
                    }}
                  >
                    {p.abbr}
                  </span>
                  <span style={{ fontSize: 11, color: "#9CA3AF" }}>
                    {p.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Messages */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                marginBottom: "1.25rem",
              }}
            >
              {[
                {
                  who: "JUDGE",
                  abbr: "JDG",
                  color: "#FBBF24",
                  bg: "rgba(251,191,36,0.07)",
                  border: "rgba(251,191,36,0.15)",
                  align: "left",
                  text: "Court is in session. Counselor, present your opening argument on the admissibility of the confession.",
                },
                {
                  who: "PROSECUTION",
                  abbr: "PRO",
                  color: "#F87171",
                  bg: "rgba(248,113,113,0.07)",
                  border: "rgba(248,113,113,0.15)",
                  align: "left",
                  text: "Your Honor, the confession was voluntary. The defendant was fully coherent and under no duress.",
                },
                {
                  who: "YOU · DEFENSE",
                  abbr: "YOU",
                  color: "#818CF8",
                  bg: "rgba(99,102,241,0.12)",
                  border: "rgba(99,102,241,0.25)",
                  align: "right",
                  text: "Your Honor, the confession must be suppressed — my client was never read his Miranda rights before interrogation began.",
                },
              ].map((msg, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 10,
                    flexDirection:
                      msg.align === "right" ? "row-reverse" : "row",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 9,
                      fontFamily: "monospace",
                      fontWeight: 700,
                      background: msg.bg,
                      color: msg.color,
                      border: `1px solid ${msg.border}`,
                    }}
                  >
                    {msg.abbr}
                  </div>
                  <div
                    style={{
                      maxWidth: "78%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems:
                        msg.align === "right" ? "flex-end" : "flex-start",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: "monospace",
                        color: "#6B7280",
                        marginBottom: 4,
                        letterSpacing: "0.04em",
                      }}
                    >
                      {msg.who}
                    </span>
                    <div
                      style={{
                        padding: "10px 14px",
                        borderRadius:
                          msg.align === "right"
                            ? "12px 4px 12px 12px"
                            : "4px 12px 12px 12px",
                        background: msg.bg,
                        border: `1px solid ${msg.border}`,
                        fontSize: 13,
                        lineHeight: 1.65,
                        color: "#E5E7EB",
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Score */}
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 10,
                padding: "12px 14px",
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 6,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontFamily: "monospace",
                    color: "#6B7280",
                    whiteSpace: "nowrap",
                  }}
                >
                  Argument Strength
                </span>
                <div
                  style={{
                    flex: 1,
                    height: 5,
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: 3,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: "78%",
                      height: "100%",
                      background: "#4ADE80",
                      borderRadius: 3,
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontFamily: "monospace",
                    fontWeight: 700,
                    color: "#4ADE80",
                    minWidth: 20,
                    textAlign: "right",
                  }}
                >
                  78
                </span>
              </div>
              <span
                style={{ fontSize: 11, color: "#6B7280", fontStyle: "italic" }}
              >
                Strong Fifth Amendment invocation — cite Miranda v. Arizona
                (1966) directly for full impact.
              </span>
            </div>

            {/* Input */}
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 10,
                padding: "10px 14px",
              }}
            >
              <span style={{ fontSize: 13, color: "#374151", flex: 1 }}>
                Type your legal argument...
              </span>
              <span
                style={{
                  background: "rgba(99,102,241,0.25)",
                  color: "#A5B4FC",
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "5px 12px",
                  borderRadius: 6,
                }}
              >
                Submit ↗
              </span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── STATS ── */}
      <motion.section
        id="cases"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          margin: "0 2.5rem",
          position: "relative",
          zIndex: 10,
        }}
      >
        {[
          {
            num: "1.8M",
            label: "Law students worldwide",
            sub: "with no affordable practice tool",
          },
          {
            num: "$500",
            label: "Per hour coaching fee",
            sub: "that most students cannot afford",
          },
          {
            num: "200+",
            label: "Real landmark cases",
            sub: "loaded and ready to argue",
          },
        ].map((s, i) => (
          <div
            key={s.label}
            style={{
              padding: "2.5rem 2rem",
              textAlign: "center",
              borderRight: i < 2 ? "1px solid rgba(255,255,255,0.07)" : "none",
            }}
          >
            <span
              style={{
                display: "block",
                fontSize: "2.8rem",
                fontWeight: 800,
                color: "#fff",
                letterSpacing: "-0.04em",
                lineHeight: 1,
                marginBottom: 6,
              }}
            >
              {s.num}
            </span>
            <span
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 600,
                color: "#F0EEE8",
                marginBottom: 3,
              }}
            >
              {s.label}
            </span>
            <span style={{ fontSize: 12, color: "#6B7280" }}>{s.sub}</span>
          </div>
        ))}
      </motion.section>

      {/* ── FEATURES ── */}
      <section
        id="features"
        style={{ padding: "5rem 2.5rem", position: "relative", zIndex: 10 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          style={{ marginBottom: "3rem" }}
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
              marginBottom: 12,
            }}
          >
            Why LexAI
          </span>
          <h2
            style={{
              fontSize: "clamp(1.8rem,3.5vw,2.8rem)",
              fontWeight: 800,
              color: "#FFFFFF",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
            }}
          >
            Built for how lawyers
            <br />
            <em style={{ fontStyle: "italic", color: "#6B7280" }}>
              actually learn.
            </em>
          </h2>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
            gap: 12,
          }}
        >
          {[
            {
              icon: "⚖️",
              title: "Real landmark cases",
              desc: "200+ Supreme Court cases with full facts and precedents. Argue both sides.",
              color: "#FBBF24",
            },
            {
              icon: "🤖",
              title: "3 AI personas",
              desc: "Strict judge, aggressive prosecutor, hostile witness — each adapts to your arguments.",
              color: "#818CF8",
            },
            {
              icon: "📊",
              title: "Live scoring",
              desc: "Every argument rated on logic, precedent, and persuasiveness in real time.",
              color: "#4ADE80",
            },
            {
              icon: "💾",
              title: "Session history",
              desc: "Every session saved. Replay transcripts and track your improvement over time.",
              color: "#F472B6",
            },
            {
              icon: "🎓",
              title: "Professor tools",
              desc: "Assign cases to students and grade sessions from a dedicated dashboard.",
              color: "#FB923C",
            },
            {
              icon: "⚡",
              title: "Instant feedback",
              desc: "The judge responds in seconds with specific, actionable legal coaching.",
              color: "#22D3EE",
            },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.45 }}
              style={{
                padding: "1.25rem",
                borderRadius: 14,
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <span
                style={{
                  fontSize: "1.4rem",
                  display: "block",
                  marginBottom: 12,
                }}
              >
                {f.icon}
              </span>
              <h3
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#F0EEE8",
                  marginBottom: 6,
                  letterSpacing: "-0.01em",
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  fontSize: 13,
                  color: "#9CA3AF",
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIAL ── */}
      <motion.section
        id="about"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{
          padding: "2rem 2.5rem 4rem",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          style={{
            maxWidth: 640,
            margin: "0 auto",
            padding: "3rem",
            background: "rgba(99,102,241,0.07)",
            border: "1px solid rgba(99,102,241,0.2)",
            borderRadius: 20,
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "clamp(1.2rem,2vw,1.6rem)",
              fontWeight: 300,
              lineHeight: 1.65,
              color: "#E5E7EB",
              marginBottom: "1.5rem",
            }}
          >
            "I practiced the Miranda case 12 times before my moot court finals.
            <span
              style={{ fontStyle: "italic", color: "#fff", fontWeight: 500 }}
            >
              {" "}
              I won."
            </span>
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "#6366F1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              S
            </div>
            <div style={{ textAlign: "left" }}>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#F0EEE8",
                  margin: 0,
                }}
              >
                Sarah K.
              </p>
              <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>
                3L · Harvard Law School
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── CTA ── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{
          padding: "4rem 2.5rem 6rem",
          textAlign: "center",
          position: "relative",
          zIndex: 10,
        }}
      >
        <h2
          style={{
            fontSize: "clamp(2.5rem,5vw,4.5rem)",
            fontWeight: 800,
            color: "#fff",
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
            marginBottom: "1rem",
          }}
        >
          Your first case
          <br />
          <em style={{ fontStyle: "italic", color: "#6B7280" }}>starts now.</em>
        </h2>
        <p style={{ fontSize: 15, color: "#6B7280", marginBottom: "2rem" }}>
          Free forever. No credit card. No download.
        </p>
        <Link
          href="/sign-up"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 16,
            fontWeight: 700,
            color: "#fff",
            textDecoration: "none",
            background: "#6366F1",
            padding: "16px 36px",
            borderRadius: 14,
            boxShadow: "0 0 60px rgba(99,102,241,0.5)",
          }}
        >
          Enter the courtroom →
        </Link>
      </motion.section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          position: "relative",
          zIndex: 10,
          borderTop: "1px solid rgba(255,255,255,0.07)",
          padding: "1.5rem 2.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              background: "#6366F1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            L
          </div>
          <span style={{ fontSize: 13, color: "#6B7280" }}>LexAI</span>
        </div>
        <span style={{ fontSize: 12, color: "#374151" }}>
          Built by Naima · 2026
        </span>
        <div style={{ display: "flex", gap: 24 }}>
          <Link
            href="#"
            style={{ fontSize: 12, color: "#374151", textDecoration: "none" }}
          >
            Privacy
          </Link>
          <Link
            href="#"
            style={{ fontSize: 12, color: "#374151", textDecoration: "none" }}
          >
            Terms
          </Link>
        </div>
      </footer>
    </main>
  );
}
