import { useState } from "react";

// ── Mock Data ──────────────────────────────────────────────────────────────
const USERS = {
  students: [
    { id: 1, name: "Arjun Mehta", email: "arjun@student.com", role: "student" },
    { id: 2, name: "Priya Sharma", email: "priya@student.com", role: "student" },
  ],
  admin: { id: 99, name: "Prof. Rao", email: "rao@admin.com", role: "admin" },
};

const INITIAL_ASSIGNMENTS = [
  {
    id: 1,
    title: "React Component Design",
    description: "Build a reusable card component with Tailwind CSS.",
    dueDate: "2026-04-10",
    createdBy: 99,
    submissions: {
      1: { status: "submitted", driveLink: "https://drive.google.com/file1", submittedAt: "2026-04-05" },
    },
  },
  {
    id: 2,
    title: "REST API Integration",
    description: "Fetch and display data from a public API with error handling.",
    dueDate: "2026-04-15",
    createdBy: 99,
    submissions: {},
  },
  {
    id: 3,
    title: "State Management with Redux",
    description: "Implement a shopping cart using Redux Toolkit.",
    dueDate: "2026-04-20",
    createdBy: 99,
    submissions: {
      2: { status: "submitted", driveLink: "https://drive.google.com/file3", submittedAt: "2026-04-04" },
    },
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────
function getStatusColor(status) {
  if (status === "submitted") return "#22c55e";
  return "#f59e0b";
}

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function isPastDue(dueDate) {
  return new Date(dueDate) < new Date();
}

// ── Progress Bar ───────────────────────────────────────────────────────────
function ProgressBar({ value, max, color }) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100);
  return (
    <div style={{ background: "#1e293b", borderRadius: 99, height: 8, overflow: "hidden", width: "100%" }}>
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          background: color || "#6366f1",
          borderRadius: 99,
          transition: "width 0.6s cubic-bezier(.4,0,.2,1)",
        }}
      />
    </div>
  );
}

// ── Badge ──────────────────────────────────────────────────────────────────
function Badge({ label, color, bg }) {
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.07em",
        textTransform: "uppercase",
        color: color || "#fff",
        background: bg || "#334155",
        borderRadius: 6,
        padding: "2px 10px",
      }}
    >
      {label}
    </span>
  );
}

// ── Modal ──────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#0f172a", border: "1px solid #334155", borderRadius: 18,
          padding: 32, minWidth: 340, maxWidth: 500, width: "100%", position: "relative",
          boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#f1f5f9", fontWeight: 700 }}>{title}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#64748b", fontSize: 22, cursor: "pointer" }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Login Screen ───────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [selected, setSelected] = useState(null);
  const allUsers = [...USERS.students, USERS.admin];
  return (
    <div style={{
      minHeight: "100vh", background: "#060c18",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif", padding: 24,
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;700&display=swap" rel="stylesheet" />
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{ fontSize: 13, letterSpacing: "0.25em", color: "#6366f1", textTransform: "uppercase", marginBottom: 12 }}>Joincsay · Internship Portal</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px,6vw,56px)", color: "#f1f5f9", margin: 0, lineHeight: 1.1 }}>
          Assignment<br /><span style={{ color: "#6366f1" }}>Dashboard</span>
        </h1>
        <p style={{ color: "#64748b", marginTop: 16, fontSize: 15 }}>Sign in to view your assignments</p>
      </div>
      <div style={{ display: "grid", gap: 14, width: "100%", maxWidth: 380 }}>
        {allUsers.map((u) => (
          <button
            key={u.id}
            onClick={() => onLogin(u)}
            style={{
              background: selected?.id === u.id ? "#1e1b4b" : "#0f172a",
              border: `1px solid ${selected?.id === u.id ? "#6366f1" : "#1e293b"}`,
              borderRadius: 14, padding: "18px 24px", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 16, transition: "all 0.2s",
            }}
          >
            <div style={{
              width: 42, height: 42, borderRadius: "50%",
              background: u.role === "admin" ? "#7c3aed" : "#1d4ed8",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 700, fontSize: 16, flexShrink: 0,
            }}>
              {u.name[0]}
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ color: "#f1f5f9", fontWeight: 600, fontSize: 15 }}>{u.name}</div>
              <div style={{ color: "#64748b", fontSize: 12 }}>{u.role === "admin" ? "Professor / Admin" : "Student"}</div>
            </div>
            <div style={{ marginLeft: "auto", color: "#475569", fontSize: 20 }}>→</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Student View ───────────────────────────────────────────────────────────
function StudentView({ user, assignments, onSubmit }) {
  const [submitModal, setSubmitModal] = useState(null);
  const [driveLink, setDriveLink] = useState("");
  const [toast, setToast] = useState("");

  const myAssignments = assignments.map((a) => ({
    ...a,
    mySubmission: a.submissions[user.id] || null,
  }));

  const submitted = myAssignments.filter((a) => a.mySubmission).length;
  const total = myAssignments.length;

  function handleSubmit() {
    if (!driveLink.trim()) return;
    onSubmit(submitModal.id, user.id, driveLink.trim());
    setSubmitModal(null);
    setDriveLink("");
    setToast("✅ Assignment submitted successfully!");
    setTimeout(() => setToast(""), 3000);
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", background: "#060c18", color: "#f1f5f9" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;700&display=swap" rel="stylesheet" />

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 24, right: 24, background: "#052e16", border: "1px solid #22c55e",
          color: "#86efac", padding: "12px 20px", borderRadius: 12, zIndex: 200, fontSize: 14, fontWeight: 500,
        }}>{toast}</div>
      )}

      {/* Header */}
      <header style={{
        borderBottom: "1px solid #1e293b", padding: "20px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(6,12,24,0.95)", position: "sticky", top: 0, zIndex: 10,
      }}>
        <div>
          <span style={{ fontSize: 11, letterSpacing: "0.2em", color: "#6366f1", textTransform: "uppercase" }}>Joincsay · Student</span>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#f1f5f9", marginTop: 2 }}>My Assignments</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            background: "#1d4ed8", borderRadius: "50%", width: 36, height: 36,
            display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14,
          }}>{user.name[0]}</div>
          <span style={{ color: "#cbd5e1", fontSize: 14 }}>{user.name}</span>
        </div>
      </header>

      <main style={{ padding: "32px clamp(16px,4vw,48px)", maxWidth: 900, margin: "0 auto" }}>
        {/* Progress card */}
        <div style={{
          background: "linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)",
          border: "1px solid #312e81", borderRadius: 20, padding: "28px 32px", marginBottom: 32,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ color: "#a5b4fc", fontSize: 13, marginBottom: 6 }}>Overall Progress</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, color: "#f1f5f9" }}>
                {submitted}<span style={{ color: "#6366f1", fontSize: 22 }}>/{total}</span>
              </div>
              <div style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>assignments submitted</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: submitted === total ? "#22c55e" : "#f59e0b" }}>
                {total === 0 ? 0 : Math.round((submitted / total) * 100)}%
              </div>
              <div style={{ color: "#64748b", fontSize: 12 }}>completion rate</div>
            </div>
          </div>
          <div style={{ marginTop: 20 }}>
            <ProgressBar value={submitted} max={total} color={submitted === total ? "#22c55e" : "#6366f1"} />
          </div>
        </div>

        {/* Assignment cards */}
        <div style={{ display: "grid", gap: 16 }}>
          {myAssignments.map((a) => {
            const past = isPastDue(a.dueDate);
            const done = !!a.mySubmission;
            return (
              <div key={a.id} style={{
                background: "#0f172a", border: `1px solid ${done ? "#14532d" : past ? "#7f1d1d" : "#1e293b"}`,
                borderRadius: 16, padding: "24px 28px",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.4)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: "#f1f5f9" }}>{a.title}</span>
                      {done
                        ? <Badge label="Submitted" bg="#14532d" color="#86efac" />
                        : past
                          ? <Badge label="Past Due" bg="#7f1d1d" color="#fca5a5" />
                          : <Badge label="Pending" bg="#78350f" color="#fcd34d" />
                      }
                    </div>
                    <p style={{ color: "#94a3b8", fontSize: 14, margin: "0 0 12px", lineHeight: 1.6 }}>{a.description}</p>
                    <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                      <span style={{ color: "#64748b", fontSize: 13 }}>📅 Due: <span style={{ color: past && !done ? "#f87171" : "#94a3b8" }}>{formatDate(a.dueDate)}</span></span>
                      {done && <span style={{ color: "#64748b", fontSize: 13 }}>✅ Submitted: <span style={{ color: "#86efac" }}>{formatDate(a.mySubmission.submittedAt)}</span></span>}
                    </div>
                  </div>
                  <div>
                    {done ? (
                      <a href={a.mySubmission.driveLink} target="_blank" rel="noreferrer"
                        style={{
                          display: "inline-block", padding: "10px 20px", background: "#064e3b",
                          border: "1px solid #065f46", borderRadius: 10, color: "#6ee7b7",
                          fontSize: 13, fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap",
                        }}>
                        View Submission ↗
                      </a>
                    ) : (
                      <button
                        onClick={() => setSubmitModal(a)}
                        style={{
                          padding: "10px 20px", background: "#1e1b4b", border: "1px solid #6366f1",
                          borderRadius: 10, color: "#a5b4fc", fontSize: 13, fontWeight: 600,
                          cursor: "pointer", whiteSpace: "nowrap", transition: "background 0.2s",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#312e81"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "#1e1b4b"}
                      >
                        Submit →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Submit Modal */}
      {submitModal && (
        <Modal title={`Submit: ${submitModal.title}`} onClose={() => setSubmitModal(null)}>
          <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>{submitModal.description}</p>
          <label style={{ color: "#94a3b8", fontSize: 13, display: "block", marginBottom: 8 }}>Google Drive Link *</label>
          <input
            type="url"
            placeholder="https://drive.google.com/..."
            value={driveLink}
            onChange={(e) => setDriveLink(e.target.value)}
            style={{
              width: "100%", boxSizing: "border-box", background: "#1e293b", border: "1px solid #334155",
              borderRadius: 10, padding: "12px 16px", color: "#f1f5f9", fontSize: 14, outline: "none",
              marginBottom: 20,
            }}
          />
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={handleSubmit}
              style={{
                flex: 1, padding: "12px", background: "#4f46e5", border: "none",
                borderRadius: 10, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer",
              }}
            >Confirm Submit</button>
            <button
              onClick={() => setSubmitModal(null)}
              style={{
                padding: "12px 20px", background: "transparent", border: "1px solid #334155",
                borderRadius: 10, color: "#94a3b8", fontSize: 14, cursor: "pointer",
              }}
            >Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Admin View ─────────────────────────────────────────────────────────────
function AdminView({ user, assignments, students, onAddAssignment }) {
  const [tab, setTab] = useState("overview");
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", dueDate: "" });
  const [toast, setToast] = useState("");
  const [expandedAssignment, setExpandedAssignment] = useState(null);

  const totalSubs = assignments.reduce((sum, a) => sum + Object.keys(a.submissions).length, 0);
  const totalPossible = assignments.length * students.length;

  function handleAdd() {
    if (!form.title.trim() || !form.dueDate) return;
    onAddAssignment({ ...form, createdBy: user.id });
    setShowAddModal(false);
    setForm({ title: "", description: "", dueDate: "" });
    setToast("✅ Assignment created!");
    setTimeout(() => setToast(""), 3000);
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", background: "#060c18", color: "#f1f5f9" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;700&display=swap" rel="stylesheet" />

      {toast && (
        <div style={{
          position: "fixed", top: 24, right: 24, background: "#052e16", border: "1px solid #22c55e",
          color: "#86efac", padding: "12px 20px", borderRadius: 12, zIndex: 200, fontSize: 14, fontWeight: 500,
        }}>{toast}</div>
      )}

      <header style={{
        borderBottom: "1px solid #1e293b", padding: "20px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
        background: "rgba(6,12,24,0.95)", position: "sticky", top: 0, zIndex: 10,
      }}>
        <div>
          <span style={{ fontSize: 11, letterSpacing: "0.2em", color: "#7c3aed", textTransform: "uppercase" }}>Joincsay · Admin</span>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#f1f5f9", marginTop: 2 }}>Management Panel</div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              padding: "10px 20px", background: "#7c3aed", border: "none",
              borderRadius: 10, color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer",
            }}
          >+ New Assignment</button>
          <div style={{
            background: "#7c3aed", borderRadius: "50%", width: 36, height: 36,
            display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14,
          }}>{user.name[0]}</div>
          <span style={{ color: "#cbd5e1", fontSize: 14 }}>{user.name}</span>
        </div>
      </header>

      <main style={{ padding: "32px clamp(16px,4vw,48px)", maxWidth: 1000, margin: "0 auto" }}>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: 16, marginBottom: 32 }}>
          {[
            { label: "Total Assignments", value: assignments.length, color: "#6366f1" },
            { label: "Total Students", value: students.length, color: "#0ea5e9" },
            { label: "Submissions Received", value: totalSubs, color: "#22c55e" },
            { label: "Submission Rate", value: `${totalPossible === 0 ? 0 : Math.round((totalSubs / totalPossible) * 100)}%`, color: "#f59e0b" },
          ].map((s) => (
            <div key={s.label} style={{
              background: "#0f172a", border: "1px solid #1e293b", borderRadius: 16, padding: "20px 24px",
            }}>
              <div style={{ color: "#64748b", fontSize: 12, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.label}</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Assignments list */}
        <div style={{ marginBottom: 16, display: "flex", gap: 10, alignItems: "center" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#f1f5f9", margin: 0 }}>All Assignments</h2>
        </div>
        <div style={{ display: "grid", gap: 14 }}>
          {assignments.map((a) => {
            const subCount = Object.keys(a.submissions).length;
            const expanded = expandedAssignment === a.id;
            return (
              <div key={a.id} style={{
                background: "#0f172a", border: "1px solid #1e293b", borderRadius: 16, overflow: "hidden",
              }}>
                <div
                  style={{ padding: "22px 28px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}
                  onClick={() => setExpandedAssignment(expanded ? null : a.id)}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: "#f1f5f9", marginBottom: 4 }}>{a.title}</div>
                    <div style={{ color: "#64748b", fontSize: 13 }}>Due: {formatDate(a.dueDate)} · {subCount}/{students.length} submitted</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ minWidth: 120 }}>
                      <ProgressBar value={subCount} max={students.length} color="#22c55e" />
                      <div style={{ color: "#64748b", fontSize: 11, marginTop: 4, textAlign: "right" }}>
                        {students.length === 0 ? 0 : Math.round((subCount / students.length) * 100)}% done
                      </div>
                    </div>
                    <span style={{ color: "#475569", fontSize: 18 }}>{expanded ? "▲" : "▼"}</span>
                  </div>
                </div>
                {expanded && (
                  <div style={{ borderTop: "1px solid #1e293b", padding: "20px 28px", background: "#060c18" }}>
                    <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>{a.description}</p>
                    <div style={{ display: "grid", gap: 10 }}>
                      {students.map((s) => {
                        const sub = a.submissions[s.id];
                        return (
                          <div key={s.id} style={{
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                            padding: "12px 16px", background: "#0f172a", borderRadius: 10,
                            border: `1px solid ${sub ? "#14532d" : "#2d1515"}`, flexWrap: "wrap", gap: 10,
                          }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{
                                width: 32, height: 32, borderRadius: "50%", background: "#1d4ed8",
                                display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13,
                              }}>{s.name[0]}</div>
                              <span style={{ color: "#cbd5e1", fontSize: 14 }}>{s.name}</span>
                            </div>
                            <div style={{ display: "flex", align: "center", gap: 10 }}>
                              {sub ? (
                                <>
                                  <Badge label="Submitted" bg="#14532d" color="#86efac" />
                                  <span style={{ color: "#64748b", fontSize: 12 }}>on {formatDate(sub.submittedAt)}</span>
                                  <a href={sub.driveLink} target="_blank" rel="noreferrer"
                                    style={{ color: "#60a5fa", fontSize: 12, textDecoration: "none" }}>View ↗</a>
                                </>
                              ) : (
                                <Badge label="Not Submitted" bg="#450a0a" color="#fca5a5" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {showAddModal && (
        <Modal title="Create New Assignment" onClose={() => setShowAddModal(false)}>
          {[
            { label: "Title *", key: "title", type: "text", placeholder: "e.g. Build a REST API" },
            { label: "Description", key: "description", type: "textarea", placeholder: "Assignment details..." },
            { label: "Due Date *", key: "dueDate", type: "date", placeholder: "" },
          ].map((f) => (
            <div key={f.key} style={{ marginBottom: 18 }}>
              <label style={{ color: "#94a3b8", fontSize: 13, display: "block", marginBottom: 6 }}>{f.label}</label>
              {f.type === "textarea" ? (
                <textarea
                  rows={3}
                  placeholder={f.placeholder}
                  value={form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  style={{
                    width: "100%", boxSizing: "border-box", background: "#1e293b", border: "1px solid #334155",
                    borderRadius: 10, padding: "12px 16px", color: "#f1f5f9", fontSize: 14, outline: "none", resize: "vertical",
                  }}
                />
              ) : (
                <input
                  type={f.type}
                  placeholder={f.placeholder}
                  value={form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  style={{
                    width: "100%", boxSizing: "border-box", background: "#1e293b", border: "1px solid #334155",
                    borderRadius: 10, padding: "12px 16px", color: "#f1f5f9", fontSize: 14, outline: "none",
                    colorScheme: "dark",
                  }}
                />
              )}
            </div>
          ))}
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={handleAdd}
              style={{
                flex: 1, padding: "12px", background: "#7c3aed", border: "none",
                borderRadius: 10, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer",
              }}
            >Create Assignment</button>
            <button
              onClick={() => setShowAddModal(false)}
              style={{
                padding: "12px 20px", background: "transparent", border: "1px solid #334155",
                borderRadius: 10, color: "#94a3b8", fontSize: 14, cursor: "pointer",
              }}
            >Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── App Root ───────────────────────────────────────────────────────────────
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS);

  function handleSubmit(assignmentId, studentId, driveLink) {
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === assignmentId
          ? {
              ...a,
              submissions: {
                ...a.submissions,
                [studentId]: { status: "submitted", driveLink, submittedAt: new Date().toISOString().split("T")[0] },
              },
            }
          : a
      )
    );
  }

  function handleAddAssignment(data) {
    setAssignments((prev) => [
      ...prev,
      { id: Date.now(), title: data.title, description: data.description, dueDate: data.dueDate, createdBy: data.createdBy, submissions: {} },
    ]);
  }

  if (!currentUser) return <LoginScreen onLogin={setCurrentUser} />;

  if (currentUser.role === "admin") {
    return (
      <AdminView
        user={currentUser}
        assignments={assignments}
        students={USERS.students}
        onAddAssignment={handleAddAssignment}
      />
    );
  }

  return (
    <StudentView
      user={currentUser}
      assignments={assignments}
      onSubmit={handleSubmit}
    />
  );
}
