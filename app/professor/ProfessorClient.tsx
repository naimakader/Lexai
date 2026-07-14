"use client";

import { useState } from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

const CASES = [
  { id: "miranda", title: "State v. Miranda" },
  { id: "contract-breach", title: "TechCorp v. DevStudio" },
  { id: "selfdefense", title: "State v. Johnson" },
];

type Props = {
  userId: string;
  profile: any;
  classes: any[];
  members: any[];
  studentSessions: any[];
  assignments: any[];
};

export default function ProfessorClient({
  userId,
  profile,
  classes,
  members,
  studentSessions,
  assignments,
}: Props) {
  const [tab, setTab] = useState<
    "overview" | "students" | "assignments" | "join"
  >("overview");
  const [className, setClassName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>(
    classes[0]?.id || "",
  );
  const [selectedCase, setSelectedCase] = useState(CASES[0].id);
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [localClasses, setLocalClasses] = useState(classes);
  const [localAssignments, setLocalAssignments] = useState(assignments);
  const isProfessor = profile?.role === "professor";

  async function becomeProfessor() {
    setLoading(true);
    await fetch("/api/professor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "become_professor" }),
    });
    setLoading(false);
    window.location.reload();
  }

  async function createClass() {
    if (!className.trim()) return;
    setLoading(true);
    const res = await fetch("/api/professor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create_class", className }),
    });
    const data = await res.json();
    if (data.class) {
      setLocalClasses((prev) => [data.class, ...prev]);
      setSelectedClass(data.class.id);
      setClassName("");
      setMessage(`Class created! Join code: ${data.class.join_code}`);
    }
    setLoading(false);
  }

  async function joinClass() {
    if (!joinCode.trim()) return;
    setLoading(true);
    const res = await fetch("/api/professor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "join_class", joinCode }),
    });
    const data = await res.json();
    if (data.class) {
      setMessage(`Joined class: ${data.class.name}`);
      setJoinCode("");
    } else {
      setMessage("Class not found. Check the code and try again.");
    }
    setLoading(false);
  }

  async function assignCase() {
    if (!selectedClass) return;
    setLoading(true);
    const caseData = CASES.find((c) => c.id === selectedCase);
    const res = await fetch("/api/professor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "assign_case",
        classId: selectedClass,
        caseId: selectedCase,
        caseTitle: caseData?.title,
        dueDate,
      }),
    });
    const data = await res.json();
    if (data.assignment) {
      setLocalAssignments((prev) => [data.assignment, ...prev]);
      setMessage("Case assigned successfully");
      setDueDate("");
    }
    setLoading(false);
  }

  const classStudents = members.filter((m) => m.class_id === selectedClass);
  const classAssignments = localAssignments.filter(
    (a) => a.class_id === selectedClass,
  );

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
            "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 65%)",
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
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link
            href="/dashboard"
            style={{ fontSize: 13, color: "#9CA3AF", textDecoration: "none" }}
          >
            Student view
          </Link>
          <UserButton />
        </div>
      </nav>

      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: 1000,
          margin: "0 auto",
          padding: "3rem 2rem",
        }}
      >
        {/* If not professor yet */}
        {!isProfessor ? (
          <div style={{ maxWidth: 560, margin: "0 auto" }}>
            <div style={{ marginBottom: "3rem" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: "1rem",
                  background: "rgba(99,102,241,0.12)",
                  border: "1px solid rgba(99,102,241,0.3)",
                  color: "#A5B4FC",
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
                    background: "#818CF8",
                    display: "inline-block",
                  }}
                />
                Professor Access
              </span>
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
                Are you a professor?
                <br />
                <em style={{ fontStyle: "italic", color: "#6B7280" }}>
                  Get started here.
                </em>
              </h1>
              <p
                style={{
                  fontSize: 15,
                  color: "#6B7280",
                  lineHeight: 1.7,
                  marginBottom: "2rem",
                }}
              >
                Upgrade your account to professor mode. Create a class, assign
                cases, and track every student's performance.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#F0EEE8",
                    marginBottom: 8,
                  }}
                >
                  🎓 Become a Professor
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: "#6B7280",
                    lineHeight: 1.6,
                    marginBottom: 16,
                  }}
                >
                  Unlock class management, case assignments, and student
                  analytics.
                </p>
                <button
                  onClick={becomeProfessor}
                  disabled={loading}
                  style={{
                    background: "#6366F1",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    padding: "12px 24px",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    width: "100%",
                    opacity: loading ? 0.6 : 1,
                  }}
                >
                  {loading ? "Setting up..." : "Activate professor mode →"}
                </button>
              </div>

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
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#F0EEE8",
                    marginBottom: 8,
                  }}
                >
                  👨‍🎓 Join a Class as Student
                </h3>
                <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 12 }}>
                  Have a join code from your professor? Enter it here.
                </p>
                <div style={{ display: "flex", gap: 10 }}>
                  <input
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    placeholder="Enter join code..."
                    maxLength={6}
                    style={{
                      flex: 1,
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 10,
                      padding: "12px 16px",
                      fontSize: 14,
                      color: "#F0EEE8",
                      fontFamily: "monospace",
                      outline: "none",
                      letterSpacing: "0.1em",
                    }}
                  />
                  <button
                    onClick={joinClass}
                    disabled={loading || !joinCode.trim()}
                    style={{
                      background: "rgba(99,102,241,0.2)",
                      border: "1px solid rgba(99,102,241,0.3)",
                      color: "#818CF8",
                      borderRadius: 10,
                      padding: "12px 20px",
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      opacity: loading || !joinCode.trim() ? 0.5 : 1,
                    }}
                  >
                    Join →
                  </button>
                </div>
                {message && (
                  <p style={{ fontSize: 13, color: "#4ADE80", marginTop: 10 }}>
                    {message}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Professor header */}
            <div style={{ marginBottom: "2rem" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: "1rem",
                  background: "rgba(99,102,241,0.12)",
                  border: "1px solid rgba(99,102,241,0.3)",
                  color: "#A5B4FC",
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
                    background: "#818CF8",
                    display: "inline-block",
                  }}
                />
                Professor Dashboard
              </span>
              <h1
                style={{
                  fontSize: "clamp(2rem,4vw,2.5rem)",
                  fontWeight: 800,
                  color: "#fff",
                  letterSpacing: "-0.04em",
                  lineHeight: 1.1,
                }}
              >
                Your classes,
                <br />
                <em style={{ fontStyle: "italic", color: "#6B7280" }}>
                  counselor.
                </em>
              </h1>
            </div>

            {/* Stats */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: 12,
                marginBottom: "2rem",
              }}
            >
              {[
                { num: localClasses.length, label: "Classes" },
                { num: members.length, label: "Students" },
                { num: localAssignments.length, label: "Assignments" },
                { num: studentSessions.length, label: "Sessions" },
              ].map((s) => (
                <div
                  key={s.label}
                  style={{
                    padding: "1.25rem 1.5rem",
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 14,
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      fontSize: "2rem",
                      fontWeight: 800,
                      color: "#fff",
                      letterSpacing: "-0.04em",
                      lineHeight: 1,
                      marginBottom: 4,
                    }}
                  >
                    {s.num}
                  </span>
                  <span style={{ fontSize: 12, color: "#6B7280" }}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div
              style={{
                display: "flex",
                gap: 4,
                marginBottom: "2rem",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 12,
                padding: 4,
              }}
            >
              {(
                [
                  { key: "overview", label: "📋 Overview" },
                  { key: "students", label: "👨‍🎓 Students" },
                  { key: "assignments", label: "📚 Assignments" },
                  { key: "join", label: "➕ New Class" },
                ] as const
              ).map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  style={{
                    flex: 1,
                    padding: "8px 16px",
                    borderRadius: 9,
                    border: "none",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: "inherit",
                    background:
                      tab === t.key ? "rgba(99,102,241,0.2)" : "transparent",
                    color: tab === t.key ? "#818CF8" : "#6B7280",
                    transition: "all 0.2s",
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Class selector */}
            {localClasses.length > 0 && tab !== "join" && (
              <div
                style={{
                  marginBottom: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    color: "#6B7280",
                    fontFamily: "monospace",
                    whiteSpace: "nowrap",
                  }}
                >
                  VIEWING CLASS:
                </span>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {localClasses.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedClass(c.id)}
                      style={{
                        padding: "6px 14px",
                        borderRadius: 8,
                        cursor: "pointer",
                        fontSize: 13,
                        fontWeight: 600,
                        border: "none",
                        fontFamily: "inherit",
                        background:
                          selectedClass === c.id
                            ? "#6366F1"
                            : "rgba(255,255,255,0.06)",
                        color: selectedClass === c.id ? "#fff" : "#9CA3AF",
                        transition: "all 0.2s",
                      }}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
                {localClasses.find((c) => c.id === selectedClass) && (
                  <div
                    style={{
                      marginLeft: "auto",
                      padding: "6px 14px",
                      borderRadius: 8,
                      background: "rgba(99,102,241,0.1)",
                      border: "1px solid rgba(99,102,241,0.2)",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span style={{ fontSize: 11, color: "#6B7280" }}>
                      Join code:
                    </span>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 800,
                        color: "#818CF8",
                        fontFamily: "monospace",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {
                        localClasses.find((c) => c.id === selectedClass)
                          ?.join_code
                      }
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* OVERVIEW TAB */}
            {tab === "overview" && (
              <div>
                {localClasses.length === 0 ? (
                  <div
                    style={{
                      padding: "3rem",
                      textAlign: "center",
                      background: "rgba(255,255,255,0.02)",
                      border: "1px dashed rgba(255,255,255,0.08)",
                      borderRadius: 16,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 15,
                        color: "#4B5563",
                        marginBottom: 16,
                      }}
                    >
                      No classes yet. Create your first class.
                    </p>
                    <button
                      onClick={() => setTab("join")}
                      style={{
                        background: "#6366F1",
                        color: "#fff",
                        border: "none",
                        borderRadius: 10,
                        padding: "10px 24px",
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      Create a class →
                    </button>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                    }}
                  >
                    {classAssignments.length === 0 ? (
                      <div
                        style={{
                          padding: "2rem",
                          background: "rgba(255,255,255,0.02)",
                          border: "1px dashed rgba(255,255,255,0.08)",
                          borderRadius: 16,
                          textAlign: "center",
                        }}
                      >
                        <p
                          style={{
                            fontSize: 14,
                            color: "#4B5563",
                            marginBottom: 12,
                          }}
                        >
                          No assignments yet for this class.
                        </p>
                        <button
                          onClick={() => setTab("assignments")}
                          style={{
                            background: "rgba(99,102,241,0.15)",
                            border: "1px solid rgba(99,102,241,0.25)",
                            color: "#818CF8",
                            borderRadius: 8,
                            padding: "8px 18px",
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: "pointer",
                            fontFamily: "inherit",
                          }}
                        >
                          Assign a case →
                        </button>
                      </div>
                    ) : (
                      classAssignments.map((a: any) => {
                        const completedBy = studentSessions.filter(
                          (s) =>
                            s.case_title === a.case_title &&
                            classStudents.some(
                              (m) => m.student_id === s.user_id,
                            ),
                        );
                        const avgScore =
                          completedBy.length > 0
                            ? Math.round(
                                completedBy.reduce(
                                  (sum, s) => sum + s.score,
                                  0,
                                ) / completedBy.length,
                              )
                            : 0;

                        return (
                          <div
                            key={a.id}
                            style={{
                              padding: "1.5rem",
                              background: "rgba(255,255,255,0.025)",
                              border: "1px solid rgba(255,255,255,0.07)",
                              borderRadius: 16,
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: 12,
                              }}
                            >
                              <div>
                                <h3
                                  style={{
                                    fontSize: 15,
                                    fontWeight: 700,
                                    color: "#F0EEE8",
                                    margin: "0 0 4px",
                                  }}
                                >
                                  {a.case_title}
                                </h3>
                                {a.due_date && (
                                  <span
                                    style={{ fontSize: 12, color: "#6B7280" }}
                                  >
                                    Due: {a.due_date}
                                  </span>
                                )}
                              </div>
                              {completedBy.length > 0 && (
                                <div
                                  style={{
                                    padding: "4px 12px",
                                    borderRadius: 100,
                                    background: scoreBg(avgScore),
                                    border: `1px solid ${scoreBorder(avgScore)}`,
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: 13,
                                      fontWeight: 700,
                                      color: scoreColor(avgScore),
                                    }}
                                  >
                                    Avg: {avgScore}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 16,
                              }}
                            >
                              <span style={{ fontSize: 13, color: "#6B7280" }}>
                                {completedBy.length} / {classStudents.length}{" "}
                                completed
                              </span>
                              <div
                                style={{
                                  flex: 1,
                                  height: 4,
                                  borderRadius: 2,
                                  background: "rgba(255,255,255,0.06)",
                                  overflow: "hidden",
                                }}
                              >
                                <div
                                  style={{
                                    height: "100%",
                                    borderRadius: 2,
                                    background: "#6366F1",
                                    width:
                                      classStudents.length > 0
                                        ? `${(completedBy.length / classStudents.length) * 100}%`
                                        : "0%",
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            )}

            {/* STUDENTS TAB */}
            {tab === "students" && (
              <div>
                {classStudents.length === 0 ? (
                  <div
                    style={{
                      padding: "3rem",
                      textAlign: "center",
                      background: "rgba(255,255,255,0.02)",
                      border: "1px dashed rgba(255,255,255,0.08)",
                      borderRadius: 16,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 15,
                        color: "#4B5563",
                        marginBottom: 8,
                      }}
                    >
                      No students yet in this class.
                    </p>
                    <p style={{ fontSize: 13, color: "#374151" }}>
                      Share the join code with your students:
                    </p>
                    <div
                      style={{
                        marginTop: 12,
                        display: "inline-block",
                        padding: "8px 20px",
                        borderRadius: 10,
                        background: "rgba(99,102,241,0.1)",
                        border: "1px solid rgba(99,102,241,0.25)",
                        fontSize: 20,
                        fontWeight: 800,
                        color: "#818CF8",
                        fontFamily: "monospace",
                        letterSpacing: "0.15em",
                      }}
                    >
                      {
                        localClasses.find((c) => c.id === selectedClass)
                          ?.join_code
                      }
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    {classStudents.map((member: any) => {
                      const sessions = studentSessions.filter(
                        (s) => s.user_id === member.student_id,
                      );
                      const avgScore =
                        sessions.length > 0
                          ? Math.round(
                              sessions.reduce((sum, s) => sum + s.score, 0) /
                                sessions.length,
                            )
                          : 0;
                      const bestSession =
                        sessions.length > 0
                          ? sessions.reduce(
                              (best, s) => (s.score > best.score ? s : best),
                              sessions[0],
                            )
                          : null;

                      return (
                        <div
                          key={member.id}
                          style={{
                            padding: "1.25rem 1.5rem",
                            background: "rgba(255,255,255,0.025)",
                            border: "1px solid rgba(255,255,255,0.07)",
                            borderRadius: 14,
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
                              background: "rgba(99,102,241,0.15)",
                              border: "1px solid rgba(99,102,241,0.25)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 12,
                              fontWeight: 700,
                              color: "#818CF8",
                              fontFamily: "monospace",
                            }}
                          >
                            {member.student_id.slice(-4).toUpperCase()}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                marginBottom: 4,
                              }}
                            >
                              <span
                                style={{
                                  fontSize: 13,
                                  fontWeight: 600,
                                  color: "#F0EEE8",
                                  fontFamily: "monospace",
                                }}
                              >
                                Student {member.student_id.slice(-6)}
                              </span>
                              <span style={{ fontSize: 11, color: "#4B5563" }}>
                                ·
                              </span>
                              <span style={{ fontSize: 12, color: "#6B7280" }}>
                                {sessions.length} session
                                {sessions.length !== 1 ? "s" : ""}
                              </span>
                            </div>
                            {bestSession && (
                              <span style={{ fontSize: 12, color: "#6B7280" }}>
                                Best case: {bestSession.case_title}
                              </span>
                            )}
                          </div>
                          {sessions.length > 0 && (
                            <div
                              style={{
                                padding: "4px 12px",
                                borderRadius: 100,
                                background: scoreBg(avgScore),
                                border: `1px solid ${scoreBorder(avgScore)}`,
                              }}
                            >
                              <span
                                style={{
                                  fontSize: 13,
                                  fontWeight: 700,
                                  color: scoreColor(avgScore),
                                }}
                              >
                                Avg: {avgScore}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ASSIGNMENTS TAB */}
            {tab === "assignments" && (
              <div>
                {localClasses.length === 0 ? (
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
                      Create a class first before assigning cases.
                    </p>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 16,
                    }}
                  >
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
                        Assign a case to this class
                      </h3>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 12,
                        }}
                      >
                        <select
                          value={selectedCase}
                          onChange={(e) => setSelectedCase(e.target.value)}
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: 10,
                            padding: "12px 16px",
                            fontSize: 14,
                            color: "#F0EEE8",
                            fontFamily: "inherit",
                            outline: "none",
                            cursor: "pointer",
                          }}
                        >
                          {CASES.map((c) => (
                            <option
                              key={c.id}
                              value={c.id}
                              style={{ background: "#111" }}
                            >
                              {c.title}
                            </option>
                          ))}
                        </select>
                        <input
                          type="date"
                          value={dueDate}
                          onChange={(e) => setDueDate(e.target.value)}
                          placeholder="Due date (optional)"
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: 10,
                            padding: "12px 16px",
                            fontSize: 14,
                            color: "#F0EEE8",
                            fontFamily: "inherit",
                            outline: "none",
                          }}
                        />
                        <button
                          onClick={assignCase}
                          disabled={loading}
                          style={{
                            background: "#6366F1",
                            color: "#fff",
                            border: "none",
                            borderRadius: 10,
                            padding: "12px 24px",
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: "pointer",
                            fontFamily: "inherit",
                            opacity: loading ? 0.6 : 1,
                          }}
                        >
                          {loading ? "Assigning..." : "Assign case →"}
                        </button>
                        {message && (
                          <p style={{ fontSize: 13, color: "#4ADE80" }}>
                            {message}
                          </p>
                        )}
                      </div>
                    </div>

                    {classAssignments.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 10,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11,
                            fontFamily: "monospace",
                            color: "#6366F1",
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            fontWeight: 600,
                          }}
                        >
                          Current assignments
                        </span>
                        {classAssignments.map((a: any) => (
                          <div
                            key={a.id}
                            style={{
                              padding: "1rem 1.25rem",
                              background: "rgba(255,255,255,0.025)",
                              border: "1px solid rgba(255,255,255,0.07)",
                              borderRadius: 12,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <div>
                              <span
                                style={{
                                  fontSize: 14,
                                  fontWeight: 600,
                                  color: "#F0EEE8",
                                  display: "block",
                                  marginBottom: 2,
                                }}
                              >
                                {a.case_title}
                              </span>
                              {a.due_date && (
                                <span
                                  style={{ fontSize: 12, color: "#6B7280" }}
                                >
                                  Due: {a.due_date}
                                </span>
                              )}
                            </div>
                            <span
                              style={{
                                fontSize: 11,
                                color: "#4ADE80",
                                background: "rgba(74,222,128,0.1)",
                                border: "1px solid rgba(74,222,128,0.2)",
                                padding: "3px 10px",
                                borderRadius: 100,
                                fontFamily: "monospace",
                              }}
                            >
                              ASSIGNED
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* NEW CLASS TAB */}
            {tab === "join" && (
              <div style={{ maxWidth: 500 }}>
                <div
                  style={{
                    padding: "1.5rem",
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 16,
                    marginBottom: 16,
                  }}
                >
                  <h3
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: "#F0EEE8",
                      marginBottom: 8,
                    }}
                  >
                    Create a new class
                  </h3>
                  <p
                    style={{ fontSize: 13, color: "#6B7280", marginBottom: 16 }}
                  >
                    A unique join code will be generated automatically.
                  </p>
                  <div style={{ display: "flex", gap: 10 }}>
                    <input
                      value={className}
                      onChange={(e) => setClassName(e.target.value)}
                      placeholder="Class name e.g. Law 101"
                      style={{
                        flex: 1,
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 10,
                        padding: "12px 16px",
                        fontSize: 14,
                        color: "#F0EEE8",
                        fontFamily: "inherit",
                        outline: "none",
                      }}
                    />
                    <button
                      onClick={createClass}
                      disabled={loading || !className.trim()}
                      style={{
                        background: "#6366F1",
                        color: "#fff",
                        border: "none",
                        borderRadius: 10,
                        padding: "12px 20px",
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        opacity: loading || !className.trim() ? 0.5 : 1,
                      }}
                    >
                      Create →
                    </button>
                  </div>
                  {message && (
                    <div
                      style={{
                        marginTop: 14,
                        padding: "10px 14px",
                        background: "rgba(74,222,128,0.1)",
                        border: "1px solid rgba(74,222,128,0.2)",
                        borderRadius: 8,
                      }}
                    >
                      <p style={{ fontSize: 13, color: "#4ADE80", margin: 0 }}>
                        {message}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
