import { useState, useEffect } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   GLOBAL CSS
───────────────────────────────────────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Sora:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #03060f; --surface: #080f1e; --card: #0c1628;
    --border: #162040; --border2: #1e2e52;
    --accent: #3b82f6; --accent2: #06b6d4; --violet: #7c3aed;
    --green: #10b981; --amber: #f59e0b; --red: #ef4444;
    --text: #e2e8f0; --muted: #64748b; --subtle: #94a3b8;
    --display: 'Syne', sans-serif; --body: 'Sora', sans-serif;
  }
  body { background: var(--bg); color: var(--text); font-family: var(--body); }
  input, textarea, select {
    font-family: var(--body); background: #0a1525;
    border: 1px solid var(--border2); border-radius: 10px;
    padding: 11px 14px; color: var(--text); font-size: 14px;
    width: 100%; outline: none; transition: border-color .2s; color-scheme: dark;
  }
  input:focus, textarea:focus, select:focus { border-color: var(--accent); }
  textarea { resize: vertical; }
  button { cursor: pointer; font-family: var(--body); }
  a { text-decoration: none; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 99px; }

  @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
  @keyframes spin { to{transform:rotate(360deg)} }
  .fu  { animation: fadeUp .4s cubic-bezier(.16,1,.3,1) both; }
  .fu1 { animation-delay:.06s }
  .fu2 { animation-delay:.12s }
  .fu3 { animation-delay:.18s }
  .fu4 { animation-delay:.24s }
  .hov { transition: transform .18s, box-shadow .18s, border-color .18s; }
  .hov:hover { transform: translateY(-3px); box-shadow: 0 18px 48px rgba(59,130,246,.1); }
  .bp { background:var(--accent); border:none; border-radius:10px; color:#fff; font-weight:600; font-size:14px; padding:11px 22px; transition:background .18s, transform .1s; }
  .bp:hover { background:#2563eb; transform:translateY(-1px); }
  .bs { background:transparent; border:1px solid var(--border2); border-radius:10px; color:var(--subtle); font-size:14px; padding:11px 22px; transition:border-color .18s,color .18s; }
  .bs:hover { border-color:var(--accent); color:var(--accent); }
  .bg { background:var(--green); border:none; border-radius:10px; color:#fff; font-weight:600; font-size:14px; padding:11px 22px; transition:background .18s; }
  .bg:hover { background:#059669; }
  .bv { background:var(--violet); border:none; border-radius:10px; color:#fff; font-weight:600; font-size:14px; padding:11px 22px; transition:background .18s; }
  .bv:hover { background:#6d28d9; }
`;

/* ─────────────────────────────────────────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────────────────────────────────────────── */
const USERS = [
  // Professors
  { id:"p1", name:"Dr. Ananya Rao", email:"ananya@college.edu", role:"professor", avatar:"A" },
  { id:"p2", name:"Dr. Vivek Sharma", email:"vivek@college.edu", role:"professor", avatar:"V" },
  { id:"p3", name:"Dr. Neha Kapoor", email:"neha@college.edu", role:"professor", avatar:"N" },

  // Students
  { id:"s1", name:"Arjun Mehta", email:"arjun@student.edu", role:"student", avatar:"A", groupId:"g1", isGroupLeader:true },
  { id:"s2", name:"Priya Sharma", email:"priya@student.edu", role:"student", avatar:"P", groupId:"g1", isGroupLeader:false },
  { id:"s3", name:"Rohan Verma", email:"rohan@student.edu", role:"student", avatar:"R", groupId:"g2", isGroupLeader:true },
  { id:"s4", name:"Sneha Patel", email:"sneha@student.edu", role:"student", avatar:"S", groupId:null, isGroupLeader:false },
];
const GROUPS = [
  { id:"g1", name:"Team Alpha",   members:["s1","s2"], leaderId:"s1" },
  { id:"g2", name:"Team Horizon", members:["s3"],      leaderId:"s3" },
];
const COURSES = [
  { id:"c1", name:"Advanced React Development", code:"CS401", students:["s1","s2","s3","s4"], color:"#3b82f6" },
  { id:"c2", name:"UI/UX Design Principles",    code:"DS301", students:["s1","s3"],           color:"#7c3aed" },
  { id:"c3", name:"Full Stack Engineering",     code:"CS501", students:["s2","s4"],           color:"#10b981" },
];
const INIT_ASSIGNS = [
  { id:"a1", courseId:"c1", title:"Build a Design System",       description:"Create a comprehensive component library using React and Tailwind CSS. Include buttons, forms, modals, and data-display components with full documentation.",       deadline:"2026-04-28T23:59", oneDriveLink:"https://onedrive.live.com/edit?id=a1", submissionType:"group",      submissions:{ g1:{ acknowledgedBy:"s1", acknowledgedAt:"2026-04-10T14:22", members:["s1","s2"] } } },
  { id:"a2", courseId:"c1", title:"REST API Integration",         description:"Integrate a public REST API into a React app. Implement error handling, loading states, pagination, and caching.",                                                   deadline:"2026-04-15T23:59", oneDriveLink:"https://onedrive.live.com/edit?id=a2", submissionType:"individual", submissions:{ s1:{ acknowledgedBy:"s1", acknowledgedAt:"2026-04-12T09:30" }, s3:{ acknowledgedBy:"s3", acknowledgedAt:"2026-04-13T16:45" } } },
  { id:"a3", courseId:"c1", title:"State Management Deep Dive",   description:"Implement a complex state management solution using Redux Toolkit or Zustand. Build a real-world feature: shopping cart, kanban board, or multi-step form.",         deadline:"2026-05-05T23:59", oneDriveLink:"https://onedrive.live.com/edit?id=a3", submissionType:"individual", submissions:{} },
  { id:"a4", courseId:"c2", title:"Accessibility Audit Report",   description:"Audit 3 popular websites for accessibility issues. Document findings, propose fixes, and implement improvements on a sample page.",                                   deadline:"2026-04-25T23:59", oneDriveLink:"https://onedrive.live.com/edit?id=a4", submissionType:"group",      submissions:{} },
  { id:"a5", courseId:"c3", title:"Dockerize a Node App",         description:"Containerize a Node.js + PostgreSQL application using Docker and Docker Compose. Write comprehensive documentation.",                                                 deadline:"2026-04-20T23:59", oneDriveLink:"",                                          submissionType:"individual", submissions:{ s2:{ acknowledgedBy:"s2", acknowledgedAt:"2026-04-18T11:00" } } },
];

/* ─────────────────────────────────────────────────────────────────────────────
   UTILS
───────────────────────────────────────────────────────────────────────────── */
const fmtDate = d => new Date(d).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}) + " · " + new Date(d).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"});
const isPast  = d => new Date(d) < new Date();
const dLeft   = d => { const ms=new Date(d)-new Date(); if(ms<0) return "Overdue"; const days=Math.floor(ms/86400000); return days===0?`${Math.floor((ms%86400000)/3600000)}h left`:`${days}d left`; };
const aColor  = role => role==="professor" ? "linear-gradient(135deg,#7c3aed,#4f46e5)" : "linear-gradient(135deg,#1d4ed8,#0ea5e9)";

/* ─────────────────────────────────────────────────────────────────────────────
   TINY COMPONENTS
───────────────────────────────────────────────────────────────────────────── */
function Bdg({ label, color="#fff", bg="#1e293b" }) {
  return <span style={{ fontSize:11, fontWeight:700, letterSpacing:".07em", textTransform:"uppercase", color, background:bg, borderRadius:6, padding:"2px 10px", whiteSpace:"nowrap" }}>{label}</span>;
}

function Bar({ value, max, color="#3b82f6" }) {
  const p = max===0?0:Math.round(value/max*100);
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
      <div style={{ flex:1, height:6, background:"#1e293b", borderRadius:99, overflow:"hidden" }}>
        <div style={{ width:`${p}%`, height:"100%", background:color, borderRadius:99, transition:"width .5s ease" }} />
      </div>
      <span style={{ fontSize:12, color:"var(--muted)", minWidth:32, textAlign:"right" }}>{value}/{max}</span>
    </div>
  );
}

function Ring({ pct, size=56, stroke=5, color="#3b82f6" }) {
  const r=(size-stroke)/2, circ=2*Math.PI*r, off=circ-(pct/100)*circ;
  return (
    <svg width={size} height={size} style={{ transform:"rotate(-90deg)", flexShrink:0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1e293b" strokeWidth={stroke}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={off} style={{transition:"stroke-dashoffset .6s ease"}} strokeLinecap="round"/>
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central"
        style={{ fill:"#e2e8f0", fontSize:size/4, fontWeight:700, fontFamily:"Syne,sans-serif", transform:`rotate(90deg)`, transformOrigin:`${size/2}px ${size/2}px` }}>
        {pct}%
      </text>
    </svg>
  );
}

function Toast({ msg, onClose }) {
  useEffect(()=>{ const t=setTimeout(onClose,3500); return()=>clearTimeout(t); },[onClose]);
  const err = msg.startsWith("❌");
  return (
    <div style={{ position:"fixed", top:24, right:24, zIndex:999, background:err?"#1a0505":"#021a0e", border:`1px solid ${err?"var(--red)":"var(--green)"}`, color:err?"#fca5a5":"#6ee7b7", padding:"13px 20px", borderRadius:12, fontSize:14, fontWeight:500, boxShadow:"0 8px 32px rgba(0,0,0,.5)", animation:"fadeUp .3s ease" }}>
      {msg}
    </div>
  );
}

function Spinner() {
  return <div style={{ width:18, height:18, border:"2px solid #1e293b", borderTopColor:"#3b82f6", borderRadius:"50%", animation:"spin .7s linear infinite" }}/>;
}

function Modal({ title, onClose, children, width=520 }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.75)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }} onClick={onClose}>
      <div style={{ background:"#080f1e", border:"1px solid #1e2e52", borderRadius:20, padding:"32px 32px 28px", width:"100%", maxWidth:width, maxHeight:"90vh", overflowY:"auto", boxShadow:"0 30px 80px rgba(0,0,0,.7)", animation:"fadeUp .3s ease" }} onClick={e=>e.stopPropagation()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
          <span style={{ fontFamily:"var(--display)", fontSize:19, fontWeight:700, color:"var(--text)" }}>{title}</span>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"var(--muted)", fontSize:22 }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   AUTH
───────────────────────────────────────────────────────────────────────────── */
function Auth({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [selectedRole, setSelectedRole] = useState(null);
  const [role, setRole] = useState("student");
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--body)", padding:24, position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:-80, left:-80, width:440, height:440, borderRadius:"50%", background:"radial-gradient(circle,rgba(59,130,246,.1) 0%,transparent 70%)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", bottom:-60, right:-60, width:360, height:360, borderRadius:"50%", background:"radial-gradient(circle,rgba(124,58,237,.08) 0%,transparent 70%)", pointerEvents:"none" }}/>

      <div style={{ width:"100%", maxWidth:430 }}>
        <div className="fu" style={{ textAlign:"center", marginBottom:36 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:10, background:"var(--card)", border:"1px solid var(--border)", borderRadius:14, padding:"9px 18px", marginBottom:24 }}>
            <span style={{ fontSize:20 }}>🎓</span>
            <span style={{ fontFamily:"var(--display)", fontWeight:800, fontSize:16 }}>Joincsay</span>
          </div>
          <h1 style={{ fontFamily:"var(--display)", fontSize:"clamp(26px,5vw,40px)", fontWeight:800, color:"var(--text)", lineHeight:1.1 }}>
            {mode==="login"?"Welcome back":"Create account"}
          </h1>
          <p style={{ color:"var(--muted)", marginTop:8, fontSize:14 }}>{mode==="login"?"Sign in to your learning portal":"Join the learning platform"}</p>
        </div>

{mode === "login" && (
  <div className="fu fu1">

    {!selectedRole ? (
      // STEP 1: SELECT ROLE
      <div style={{ display: "grid", gap: 12 }}>
        <button className="bp" onClick={() => setSelectedRole("student")}>
          🎓 Continue as Student
        </button>

        <button className="bv" onClick={() => setSelectedRole("professor")}>
          👩‍🏫 Continue as Professor
        </button>
      </div>
    ) : (
      // STEP 2: SELECT USER
      <div style={{ display: "grid", gap: 10 }}>
        <button
          onClick={() => setSelectedRole(null)}
          style={{ background: "none", border: "none", color: "#94a3b8", fontSize: 13 }}
        >
          ← Back
        </button>

        {USERS.filter(u => u.role === selectedRole).map(u => (
          <button
            key={u.id}
            onClick={() => onLogin(u)}
            className="hov"
            style={{
              background: "#0f172a",
              border: "1px solid #1e293b",
              borderRadius: 14,
              padding: "16px",
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: u.role === "professor" ? "#7c3aed" : "#1d4ed8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
            }}>
              {u.avatar}
            </div>

            <div>
              <div style={{ color: "#fff", fontWeight: 600 }}>{u.name}</div>
              <div style={{ color: "#94a3b8", fontSize: 12 }}>
                {u.role === "professor" ? "Professor" : "Student"}
              </div>
            </div>
          </button>
        ))}
      </div>
    )}
  </div>
)}

        {mode==="register" && (
          <div className="fu fu1" style={{ display:"grid", gap:14 }}>
            <div><label style={{ color:"var(--subtle)", fontSize:13, display:"block", marginBottom:6 }}>Full Name</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"/></div>
            <div><label style={{ color:"var(--subtle)", fontSize:13, display:"block", marginBottom:6 }}>Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@college.edu"/></div>
            <div><label style={{ color:"var(--subtle)", fontSize:13, display:"block", marginBottom:6 }}>Password</label><input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••"/></div>
            <div>
              <label style={{ color:"var(--subtle)", fontSize:13, display:"block", marginBottom:8 }}>Role</label>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                {["student","professor"].map(r=>(
                  <button key={r} onClick={()=>setRole(r)} style={{ padding:"12px", borderRadius:10, border:`1px solid ${role===r?(r==="professor"?"var(--violet)":"var(--accent)"):"var(--border2)"}`, background:role===r?(r==="professor"?"#1e1b4b":"#0c2240"):"transparent", color:role===r?"var(--text)":"var(--muted)", fontWeight:role===r?600:400, fontSize:14, transition:"all .15s" }}>
                    {r==="professor"?"👩‍🏫 Professor":"🎓 Student"}
                  </button>
                ))}
              </div>
            </div>
            {err && <div style={{ color:"var(--red)", fontSize:13, background:"#1a0505", border:"1px solid #7f1d1d", borderRadius:8, padding:"10px 14px" }}>{err}</div>}
            <button className="bp" onClick={()=>{ if(!name.trim()||!email.trim()||!pass.trim()){setErr("All fields required");return;} onLogin({id:"u_"+Date.now(),name:name.trim(),email:email.trim(),role,avatar:name[0].toUpperCase(),groupId:null,isGroupLeader:false}); }} style={{ padding:"13px", width:"100%" }}>Create Account →</button>
          </div>
        )}

        <div className="fu fu2" style={{ textAlign:"center", marginTop:20 }}>
          <button onClick={()=>{setMode(m=>m==="login"?"register":"login");setErr("");}} style={{ background:"none", border:"none", color:"var(--accent)", fontSize:13 }}>
            {mode==="login"?"Don't have an account? Register →":"← Back to sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SIDEBAR
───────────────────────────────────────────────────────────────────────────── */
function Sidebar({ user, page, setPage, onLogout }) {
  const isPr = user.role==="professor";
  const links = isPr
    ? [["dashboard","🏠","Dashboard"],["assignments","📋","Assignments"],["students","👥","Students"]]
    : [["dashboard","🏠","Dashboard"],["assignments","📋","My Assignments"],["groups","🔗","My Group"]];
  return (
    <aside style={{ width:220, flexShrink:0, background:"var(--surface)", borderRight:"1px solid var(--border)", display:"flex", flexDirection:"column", height:"100vh", position:"sticky", top:0, zIndex:50 }}>
      <div style={{ padding:"22px 20px 14px", display:"flex", alignItems:"center", gap:10 }}>
        <span style={{ fontSize:20 }}>🎓</span>
        <span style={{ fontFamily:"var(--display)", fontWeight:800, fontSize:15 }}>Joincsay</span>
      </div>
      <div style={{ padding:"8px 12px", flex:1 }}>
        <p style={{ color:"var(--muted)", fontSize:11, textTransform:"uppercase", letterSpacing:".1em", padding:"6px 8px 10px" }}>Menu</p>
        {links.map(([id,icon,label])=>(
          <button key={id} onClick={()=>setPage(id)} style={{ width:"100%", background:page===id?"var(--card)":"transparent", color:page===id?"var(--text)":"var(--muted)", border:"none", borderRadius:10, padding:"9px 14px", fontSize:13, fontWeight:500, display:"flex", alignItems:"center", gap:8, marginBottom:3, transition:"background .15s,color .15s" }}>
            {icon} {label}
          </button>
        ))}
      </div>
      <div style={{ padding:"16px 20px", borderTop:"1px solid var(--border)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
          <div style={{ width:34, height:34, borderRadius:"50%", background:aColor(user.role), display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:14, flexShrink:0 }}>{user.avatar}</div>
          <div style={{ overflow:"hidden" }}>
            <div style={{ fontSize:13, fontWeight:600, color:"var(--text)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user.name}</div>
            <div style={{ fontSize:11, color:"var(--muted)", textTransform:"capitalize" }}>{user.role}</div>
          </div>
        </div>
        <button className="bs" onClick={onLogout} style={{ width:"100%", fontSize:13, padding:"9px" }}>Sign out</button>
      </div>
    </aside>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ASSIGNMENT FORM
───────────────────────────────────────────────────────────────────────────── */
function AForm({ init, onSave, onClose }) {
  const [f, setF] = useState(init || { title:"", description:"", courseId:COURSES[0].id, deadline:"", oneDriveLink:"", submissionType:"individual" });
  const [loading, setLoading] = useState(false);
  const upd = (k,v) => setF(p=>({...p,[k]:v}));
  async function save() {
    if(!f.title.trim()||!f.deadline) return;
    setLoading(true); await new Promise(r=>setTimeout(r,400)); onSave(f); setLoading(false);
  }
  return (
    <div style={{ display:"grid", gap:14 }}>
      <div>
        <label style={{ color:"var(--subtle)", fontSize:13, display:"block", marginBottom:6 }}>Course *</label>
        <select value={f.courseId} onChange={e=>upd("courseId",e.target.value)}>
          {COURSES.map(c=><option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
        </select>
      </div>
      <div><label style={{ color:"var(--subtle)", fontSize:13, display:"block", marginBottom:6 }}>Title *</label><input value={f.title} onChange={e=>upd("title",e.target.value)} placeholder="e.g. Build a Design System"/></div>
      <div><label style={{ color:"var(--subtle)", fontSize:13, display:"block", marginBottom:6 }}>Description</label><textarea rows={3} value={f.description} onChange={e=>upd("description",e.target.value)} placeholder="Assignment details..."/></div>
      <div><label style={{ color:"var(--subtle)", fontSize:13, display:"block", marginBottom:6 }}>Deadline *</label><input type="datetime-local" value={f.deadline} onChange={e=>upd("deadline",e.target.value)}/></div>
      <div><label style={{ color:"var(--subtle)", fontSize:13, display:"block", marginBottom:6 }}>OneDrive Link</label><input type="url" value={f.oneDriveLink} onChange={e=>upd("oneDriveLink",e.target.value)} placeholder="https://onedrive.live.com/..."/></div>
      <div>
        <label style={{ color:"var(--subtle)", fontSize:13, display:"block", marginBottom:8 }}>Submission Type *</label>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {["individual","group"].map(t=>(
            <button key={t} onClick={()=>upd("submissionType",t)} style={{ padding:"12px", borderRadius:10, border:`1px solid ${f.submissionType===t?"var(--accent)":"var(--border2)"}`, background:f.submissionType===t?"#0c2240":"transparent", color:f.submissionType===t?"var(--text)":"var(--muted)", fontWeight:f.submissionType===t?600:400, fontSize:14, transition:"all .15s" }}>
              {t==="individual"?"👤 Individual":"👥 Group"}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display:"flex", gap:10, marginTop:4 }}>
        <button className="bp" onClick={save} style={{ flex:1, padding:"12px", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>{loading&&<Spinner/>}{init?"Update":"Create"} Assignment</button>
        <button className="bs" onClick={onClose} style={{ padding:"12px 18px" }}>Cancel</button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PROFESSOR — DASHBOARD
───────────────────────────────────────────────────────────────────────────── */
function ProfDash({ assignments }) {
  const students = USERS.filter(u=>u.role==="student");
  const totalSubs = assignments.reduce((s,a)=>s+Object.keys(a.submissions).length,0);
  const totalPoss = assignments.reduce((s,a)=>{
    if(a.submissionType==="group") return s+GROUPS.filter(g=>g.members.some(m=>COURSES.find(c=>c.id===a.courseId)?.students.includes(m))).length;
    return s+(COURSES.find(c=>c.id===a.courseId)?.students.length||0);
  },0);

  return (
    <div style={{ padding:"32px clamp(16px,3vw,40px)", maxWidth:1000, margin:"0 auto" }}>
      <div className="fu" style={{ marginBottom:28 }}>
        <p style={{ color:"var(--muted)", fontSize:13, marginBottom:4, textTransform:"uppercase", letterSpacing:".12em" }}>Overview</p>
        <h2 style={{ fontFamily:"var(--display)", fontSize:28, fontWeight:800, color:"var(--text)" }}>Professor Dashboard</h2>
      </div>
      <div className="fu fu1" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:14, marginBottom:32 }}>
        {[
          {label:"Courses",     value:COURSES.length,    icon:"📚", color:"var(--accent)"},
          {label:"Assignments", value:assignments.length, icon:"📋", color:"var(--violet)"},
          {label:"Students",    value:students.length,   icon:"👥", color:"var(--green)"},
          {label:"Submissions", value:totalSubs,          icon:"✅", color:"var(--amber)"},
        ].map(s=>(
          <div key={s.label} style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:14, padding:"18px 20px" }}>
            <div style={{ fontSize:22, marginBottom:8 }}>{s.icon}</div>
            <div style={{ fontFamily:"var(--display)", fontSize:30, fontWeight:800, color:s.color }}>{s.value}</div>
            <div style={{ color:"var(--muted)", fontSize:12, marginTop:2 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div className="fu fu2" style={{ display:"grid", gap:14 }}>
        {COURSES.map(c=>{
          const ca = assignments.filter(a=>a.courseId===c.id);
          const ts = ca.reduce((s,a)=>s+Object.keys(a.submissions).length,0);
          const tp = ca.reduce((s,a)=>{
            if(a.submissionType==="group") return s+GROUPS.filter(g=>g.members.some(m=>c.students.includes(m))).length;
            return s+c.students.length;
          },0);
          const pct = tp===0?0:Math.round(ts/tp*100);
          return (
            <div key={c.id} className="hov" style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:16, padding:"20px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:20, flexWrap:"wrap" }}>
              <div style={{ display:"flex", alignItems:"center", gap:14, flex:1 }}>
                <div style={{ width:44, height:44, borderRadius:12, background:c.color+"22", border:`1px solid ${c.color}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>📘</div>
                <div>
                  <div style={{ fontFamily:"var(--display)", fontWeight:700, fontSize:16, color:"var(--text)", marginBottom:2 }}>{c.name}</div>
                  <div style={{ color:"var(--muted)", fontSize:12 }}>{c.code} · {c.students.length} students · {ca.length} assignments</div>
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
                <div style={{ minWidth:140 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                    <span style={{ color:"var(--muted)", fontSize:12 }}>Submissions</span>
                    <span style={{ color:pct===100?"var(--green)":"var(--subtle)", fontSize:12, fontWeight:600 }}>{pct}%</span>
                  </div>
                  <Bar value={ts} max={tp} color={c.color}/>
                </div>
                <Ring pct={pct} color={c.color}/>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PROFESSOR — ASSIGNMENTS
───────────────────────────────────────────────────────────────────────────── */
function ProfAssigns({ assignments, setAssignments, showToast }) {
  const [showForm, setShowForm] = useState(false);
  const [editA, setEditA] = useState(null);
  const [detailA, setDetailA] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const students = USERS.filter(u=>u.role==="student");

  function subInfo(a) {
    const course = COURSES.find(c=>c.id===a.courseId);
    if(a.submissionType==="individual") {
      const en = students.filter(s=>course?.students.includes(s.id));
      return { submitted:en.filter(s=>a.submissions[s.id]).length, total:en.length, list:en.map(s=>({...s,sub:a.submissions[s.id],isGroup:false})) };
    }
    const rg = GROUPS.filter(g=>g.members.some(m=>course?.students.includes(m)));
    return { submitted:rg.filter(g=>a.submissions[g.id]).length, total:rg.length, list:rg.map(g=>({...g,sub:a.submissions[g.id],isGroup:true})) };
  }

  function save(form) {
    if(editA) { setAssignments(p=>p.map(a=>a.id===editA.id?{...a,...form}:a)); showToast("✅ Assignment updated!"); }
    else       { setAssignments(p=>[...p,{...form,id:"a_"+Date.now(),submissions:{}}]); showToast("✅ Assignment created!"); }
    setShowForm(false); setEditA(null);
  }

  const list = assignments
    .filter(a=>filter==="all"||(filter==="group"?a.submissionType==="group":a.submissionType==="individual"))
    .filter(a=>a.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ padding:"32px clamp(16px,3vw,40px)", maxWidth:1000, margin:"0 auto" }}>
      <div className="fu" style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:16, marginBottom:24 }}>
        <div>
          <p style={{ color:"var(--muted)", fontSize:13, marginBottom:4, textTransform:"uppercase", letterSpacing:".12em" }}>Manage</p>
          <h2 style={{ fontFamily:"var(--display)", fontSize:28, fontWeight:800, color:"var(--text)" }}>All Assignments</h2>
        </div>
        <button className="bp" onClick={()=>{ setEditA(null); setShowForm(true); }}>+ New Assignment</button>
      </div>
      <div className="fu fu1" style={{ display:"flex", gap:10, marginBottom:18, flexWrap:"wrap" }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍  Search..." style={{ flex:1, minWidth:180 }}/>
        {["all","individual","group"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{ padding:"10px 16px", borderRadius:10, fontSize:13, fontWeight:500, border:"none", background:filter===f?"var(--accent)":"var(--card)", color:filter===f?"#fff":"var(--muted)", transition:"all .15s", textTransform:"capitalize" }}>{f}</button>
        ))}
      </div>
      <div className="fu fu2" style={{ display:"grid", gap:14 }}>
        {list.map(a=>{
          const { submitted, total } = subInfo(a);
          const pct = total===0?0:Math.round(submitted/total*100);
          const course = COURSES.find(c=>c.id===a.courseId);
          return (
            <div key={a.id} style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:16, padding:"22px 26px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", gap:16, flexWrap:"wrap" }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap", marginBottom:6 }}>
                    <span style={{ fontFamily:"var(--display)", fontSize:17, fontWeight:700, color:"var(--text)" }}>{a.title}</span>
                    <Bdg label={a.submissionType==="group"?"👥 Group":"👤 Individual"} bg="#0c1628" color="var(--subtle)"/>
                    {isPast(a.deadline)&&<Bdg label="Past Due" bg="#1a0505" color="#fca5a5"/>}
                    {course&&<span style={{ fontSize:11, color:course.color, background:course.color+"18", borderRadius:6, padding:"2px 8px", fontWeight:600 }}>{course.code}</span>}
                  </div>
                  <p style={{ color:"var(--muted)", fontSize:13, lineHeight:1.6, marginBottom:12, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{a.description}</p>
                  <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
                    <span style={{ color:"var(--muted)", fontSize:12 }}>📅 {fmtDate(a.deadline)}</span>
                    {a.oneDriveLink&&<a href={a.oneDriveLink} target="_blank" rel="noreferrer" style={{ color:"var(--accent)", fontSize:12 }}>📁 OneDrive ↗</a>}
                  </div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:10 }}>
                  <Ring pct={pct} size={52} color={pct===100?"var(--green)":"var(--accent)"}/>
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={()=>setDetailA(a)} className="bs" style={{ padding:"8px 14px", fontSize:12 }}>Details</button>
                    <button onClick={()=>{ setEditA(a); setShowForm(true); }} style={{ padding:"8px 14px", fontSize:12, background:"transparent", border:"1px solid var(--border2)", borderRadius:8, color:"var(--subtle)" }}>Edit ✏️</button>
                  </div>
                </div>
              </div>
              <div style={{ marginTop:14 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                  <span style={{ color:"var(--muted)", fontSize:12 }}>Submission progress</span>
                  <span style={{ color:"var(--subtle)", fontSize:12 }}>{submitted}/{total}</span>
                </div>
                <Bar value={submitted} max={total} color={pct===100?"var(--green)":"var(--accent)"}/>
              </div>
            </div>
          );
        })}
        {list.length===0&&<div style={{ textAlign:"center", padding:"60px", color:"var(--muted)" }}>No assignments found.</div>}
      </div>

      {showForm&&<Modal title={editA?"Edit Assignment":"Create Assignment"} onClose={()=>{setShowForm(false);setEditA(null);}}><AForm init={editA} onSave={save} onClose={()=>{setShowForm(false);setEditA(null);}}/></Modal>}

      {detailA&&(
        <Modal title={detailA.title} onClose={()=>setDetailA(null)} width={580}>
          {(()=>{
            const {list:slist} = subInfo(detailA);
            return (
              <div>
                <p style={{ color:"var(--muted)", fontSize:14, lineHeight:1.7, marginBottom:18 }}>{detailA.description}</p>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
                  <div style={{ background:"#0c1628", borderRadius:10, padding:"12px 14px" }}><div style={{ color:"var(--muted)", fontSize:11, textTransform:"uppercase", letterSpacing:".1em" }}>Deadline</div><div style={{ color:"var(--text)", fontSize:13, marginTop:4 }}>{fmtDate(detailA.deadline)}</div></div>
                  <div style={{ background:"#0c1628", borderRadius:10, padding:"12px 14px" }}><div style={{ color:"var(--muted)", fontSize:11, textTransform:"uppercase", letterSpacing:".1em" }}>Type</div><div style={{ color:"var(--text)", fontSize:13, marginTop:4, textTransform:"capitalize" }}>{detailA.submissionType}</div></div>
                </div>
                <h4 style={{ color:"var(--subtle)", fontSize:12, marginBottom:10, textTransform:"uppercase", letterSpacing:".1em" }}>{detailA.submissionType==="group"?"Group":"Individual"} Submissions</h4>
                <div style={{ display:"grid", gap:8 }}>
                  {slist.map(item=>(
                    <div key={item.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:"#0c1628", borderRadius:10, padding:"12px 14px", border:`1px solid ${item.sub?"#14532d":"var(--border)"}`, flexWrap:"wrap", gap:8 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <div style={{ width:30, height:30, borderRadius:"50%", background:item.isGroup?"#1e1b4b":"#0c2240", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700 }}>{item.name[0]}</div>
                        <div>
                          <div style={{ color:"var(--text)", fontSize:13, fontWeight:500 }}>{item.name}</div>
                          {item.isGroup&&<div style={{ color:"var(--muted)", fontSize:11 }}>{item.members.length} members · Leader: {USERS.find(u=>u.id===item.leaderId)?.name}</div>}
                        </div>
                      </div>
                      {item.sub
                        ? <span style={{ fontSize:12, color:"var(--green)", background:"#052e16", borderRadius:6, padding:"3px 10px", fontWeight:600 }}>✓ {new Date(item.sub.acknowledgedAt).toLocaleDateString("en-IN")}</span>
                        : <span style={{ fontSize:12, color:"#f87171", background:"#1a0505", borderRadius:6, padding:"3px 10px", fontWeight:600 }}>Pending</span>
                      }
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </Modal>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PROFESSOR — STUDENTS
───────────────────────────────────────────────────────────────────────────── */
function ProfStudents({ assignments }) {
  const students = USERS.filter(u=>u.role==="student");
  return (
    <div style={{ padding:"32px clamp(16px,3vw,40px)", maxWidth:900, margin:"0 auto" }}>
      <div className="fu" style={{ marginBottom:28 }}>
        <p style={{ color:"var(--muted)", fontSize:13, marginBottom:4, textTransform:"uppercase", letterSpacing:".12em" }}>Overview</p>
        <h2 style={{ fontFamily:"var(--display)", fontSize:28, fontWeight:800, color:"var(--text)" }}>Students & Groups</h2>
      </div>
      <div className="fu fu1" style={{ display:"grid", gap:12, marginBottom:28 }}>
        {GROUPS.map(g=>{
          const members = USERS.filter(u=>g.members.includes(u.id));
          const leader  = USERS.find(u=>u.id===g.leaderId);
          const gs = assignments.filter(a=>a.submissionType==="group"&&a.submissions[g.id]).length;
          const gt = assignments.filter(a=>a.submissionType==="group").length;
          return (
            <div key={g.id} style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:14, padding:"20px 24px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14, flexWrap:"wrap", gap:10 }}>
                <div>
                  <div style={{ fontFamily:"var(--display)", fontSize:16, fontWeight:700, color:"var(--text)" }}>{g.name}</div>
                  <div style={{ color:"var(--muted)", fontSize:12, marginTop:2 }}>Leader: {leader?.name} · {members.length} members</div>
                </div>
                <div style={{ minWidth:140 }}>
                  <div style={{ color:"var(--green)", fontSize:12, fontWeight:600, marginBottom:4 }}>{gs}/{gt} group submissions</div>
                  <Bar value={gs} max={gt} color="var(--green)"/>
                </div>
              </div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {members.map(m=>(
                  <div key={m.id} style={{ display:"flex", alignItems:"center", gap:8, background:"#0c1628", borderRadius:10, padding:"8px 12px" }}>
                    <div style={{ width:24, height:24, borderRadius:"50%", background:"linear-gradient(135deg,#1d4ed8,#0ea5e9)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700 }}>{m.avatar}</div>
                    <span style={{ fontSize:13, color:"var(--text)" }}>{m.name}</span>
                    {m.id===g.leaderId&&<Bdg label="Leader" bg="#1e1b4b" color="#a5b4fc"/>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div className="fu fu2">
        <h3 style={{ fontFamily:"var(--display)", fontSize:18, fontWeight:700, color:"var(--text)", marginBottom:14 }}>Ungrouped Students</h3>
        {students.filter(s=>!s.groupId).map(s=>{
          const si = assignments.filter(a=>a.submissionType==="individual"&&a.submissions[s.id]).length;
          const st = assignments.filter(a=>a.submissionType==="individual").length;
          return (
            <div key={s.id} style={{ background:"var(--card)", border:"1px solid #7f1d1d", borderRadius:12, padding:"16px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#1d4ed8,#0ea5e9)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700 }}>{s.avatar}</div>
                <div><div style={{ color:"var(--text)", fontWeight:600, fontSize:14 }}>{s.name}</div><div style={{ color:"#f87171", fontSize:12 }}>⚠️ Not in any group</div></div>
              </div>
              <div style={{ minWidth:150 }}>
                <div style={{ color:"var(--muted)", fontSize:12, marginBottom:4 }}>{si}/{st} individual acknowledged</div>
                <Bar value={si} max={st} color="var(--amber)"/>
              </div>
            </div>
          );
        })}
        {students.filter(s=>!s.groupId).length===0&&<p style={{ color:"var(--muted)", fontSize:14 }}>All students are in groups 🎉</p>}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   STUDENT — DASHBOARD
───────────────────────────────────────────────────────────────────────────── */
function StudDash({ user, assignments }) {
  const myCourses = COURSES.filter(c=>c.students.includes(user.id));
  const myGroup   = GROUPS.find(g=>g.members.includes(user.id));
  const myAssigns = assignments.filter(a=>myCourses.some(c=>c.id===a.courseId));
  const submitted = myAssigns.filter(a=>{
    if(a.submissionType==="individual") return !!a.submissions[user.id];
    if(myGroup) return !!a.submissions[myGroup.id];
    return false;
  }).length;
  const pct = myAssigns.length===0?0:Math.round(submitted/myAssigns.length*100);

  return (
    <div style={{ padding:"32px clamp(16px,3vw,40px)", maxWidth:960, margin:"0 auto" }}>
      <div className="fu" style={{ marginBottom:28 }}>
        <p style={{ color:"var(--muted)", fontSize:13 }}>Welcome back,</p>
        <h2 style={{ fontFamily:"var(--display)", fontSize:32, fontWeight:800, color:"var(--text)" }}>{user.name} 👋</h2>
      </div>
      {/* Progress hero */}
      <div className="fu fu1" style={{ background:"linear-gradient(135deg,#0c1a3e,#080f1e)", border:"1px solid #162040", borderRadius:20, padding:"28px 32px", marginBottom:24, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:20 }}>
        <div>
          <div style={{ color:"var(--accent)", fontSize:13, marginBottom:8, fontWeight:500 }}>Your Progress</div>
          <div style={{ fontFamily:"var(--display)", fontSize:44, fontWeight:800, color:"var(--text)", lineHeight:1 }}>{submitted}<span style={{ color:"var(--accent)", fontSize:24 }}>/{myAssigns.length}</span></div>
          <div style={{ color:"var(--muted)", fontSize:14, marginTop:6 }}>assignments acknowledged</div>
          <div style={{ marginTop:14, width:220 }}><Bar value={submitted} max={myAssigns.length} color={pct===100?"var(--green)":"var(--accent)"}/></div>
        </div>
        <Ring pct={pct} size={100} stroke={8} color={pct===100?"var(--green)":"var(--accent)"}/>
      </div>
      {/* Group info */}
      <div className="fu fu2" style={{ marginBottom:24 }}>
        {myGroup?(
          <div style={{ background:"var(--card)", border:"1px solid #14532d", borderRadius:14, padding:"18px 22px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
              <span style={{ fontSize:20 }}>🔗</span>
              <span style={{ fontFamily:"var(--display)", fontSize:15, fontWeight:700, color:"var(--text)" }}>{myGroup.name}</span>
              {user.isGroupLeader&&<Bdg label="You're the Leader" bg="#052e16" color="#86efac"/>}
            </div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {USERS.filter(u=>myGroup.members.includes(u.id)).map(m=>(
                <div key={m.id} style={{ display:"flex", alignItems:"center", gap:6, background:"#0c1628", borderRadius:8, padding:"6px 10px" }}>
                  <div style={{ width:22, height:22, borderRadius:"50%", background:"linear-gradient(135deg,#1d4ed8,#0ea5e9)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700 }}>{m.avatar}</div>
                  <span style={{ fontSize:12, color:"var(--text)" }}>{m.name}</span>
                  {m.id===myGroup.leaderId&&<span style={{ fontSize:10, color:"#a5b4fc" }}>★</span>}
                </div>
              ))}
            </div>
          </div>
        ):(
          <div style={{ background:"#1a0505", border:"1px solid #7f1d1d", borderRadius:14, padding:"18px 22px", display:"flex", gap:12 }}>
            <span style={{ fontSize:20 }}>⚠️</span>
            <div><div style={{ color:"#fca5a5", fontWeight:600, marginBottom:4 }}>You're not in any group</div><div style={{ color:"#f87171", fontSize:13 }}>You cannot submit group assignments. Form or join a group to participate.</div></div>
          </div>
        )}
      </div>
      {/* Courses */}
      <h3 className="fu fu3" style={{ fontFamily:"var(--display)", fontSize:18, fontWeight:700, color:"var(--text)", marginBottom:14 }}>Your Courses</h3>
      <div className="fu fu3" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:14 }}>
        {myCourses.map(c=>{
          const ca = assignments.filter(a=>a.courseId===c.id);
          const cs = ca.filter(a=>{
            if(a.submissionType==="individual") return !!a.submissions[user.id];
            if(myGroup) return !!a.submissions[myGroup.id];
            return false;
          }).length;
          return (
            <div key={c.id} className="hov" style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:14, padding:"20px", borderTop:`3px solid ${c.color}` }}>
              <div style={{ fontFamily:"var(--display)", fontSize:15, fontWeight:700, color:"var(--text)", marginBottom:4 }}>{c.name}</div>
              <div style={{ color:"var(--muted)", fontSize:12, marginBottom:14 }}>{c.code} · {ca.length} assignments</div>
              <Bar value={cs} max={ca.length} color={c.color}/>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   STUDENT — ASSIGNMENTS
───────────────────────────────────────────────────────────────────────────── */
function StudAssigns({ user, assignments, setAssignments, showToast }) {
  const myCourses = COURSES.filter(c=>c.students.includes(user.id));
  const myGroup   = GROUPS.find(g=>g.members.includes(user.id));
  const [ackM, setAckM] = useState(null);
  const [detailA, setDetailA] = useState(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  const allA = assignments.filter(a=>myCourses.some(c=>c.id===a.courseId));

  function status(a) {
    if(a.submissionType==="individual") return a.submissions[user.id]?"submitted":"pending";
    if(!myGroup) return "no-group";
    return a.submissions[myGroup.id]?"submitted":"pending";
  }

  const shown = allA.filter(a=>{
    const s=status(a);
    if(filter==="submitted") return s==="submitted";
    if(filter==="pending")   return s!=="submitted";
    return true;
  });

  function handleAck(a) {
    if(a.submissionType==="group"){
      if(!myGroup){ showToast("❌ You are not in any group. Join a group first."); return; }
      if(!user.isGroupLeader){ showToast("❌ Only the Group Leader can acknowledge group submissions."); return; }
    }
    setAckM(a);
  }

  async function confirmAck() {
    setLoading(true);
    await new Promise(r=>setTimeout(r,500));
    const key = ackM.submissionType==="individual" ? user.id : myGroup.id;
    setAssignments(p=>p.map(a=>a.id!==ackM.id?a:{...a,submissions:{...a.submissions,[key]:{acknowledgedBy:user.id,acknowledgedAt:new Date().toISOString(),members:myGroup?.members}}}));
    setLoading(false); setAckM(null);
    showToast(ackM.submissionType==="group"?"✅ Group submission acknowledged! All members updated.":"✅ Your submission has been acknowledged with a timestamp!");
  }

  return (
    <div style={{ padding:"32px clamp(16px,3vw,40px)", maxWidth:900, margin:"0 auto" }}>
      <div className="fu" style={{ marginBottom:24 }}>
        <p style={{ color:"var(--muted)", fontSize:13, marginBottom:4, textTransform:"uppercase", letterSpacing:".12em" }}>Your Work</p>
        <h2 style={{ fontFamily:"var(--display)", fontSize:28, fontWeight:800, color:"var(--text)" }}>Assignments</h2>
      </div>
      <div className="fu fu1" style={{ display:"flex", gap:8, marginBottom:18 }}>
        {[["all","All"],["pending","Pending"],["submitted","Submitted"]].map(([f,l])=>(
          <button key={f} onClick={()=>setFilter(f)} style={{ padding:"9px 18px", borderRadius:10, fontSize:13, fontWeight:500, border:"none", background:filter===f?"var(--accent)":"var(--card)", color:filter===f?"#fff":"var(--muted)", transition:"all .15s" }}>{l}</button>
        ))}
      </div>
      <div className="fu fu2" style={{ display:"grid", gap:14 }}>
        {shown.map(a=>{
          const s = status(a);
          const course = COURSES.find(c=>c.id===a.courseId);
          const sub = a.submissionType==="individual"?a.submissions[user.id]:myGroup?a.submissions[myGroup.id]:null;
          return (
            <div key={a.id} className="hov" style={{ background:"var(--card)", border:`1px solid ${s==="submitted"?"#14532d":s==="no-group"?"#7f1d1d":"var(--border)"}`, borderRadius:16, padding:"22px 26px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", gap:16, flexWrap:"wrap" }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap", marginBottom:6 }}>
                    <span style={{ fontFamily:"var(--display)", fontSize:16, fontWeight:700, color:"var(--text)" }}>{a.title}</span>
                    <Bdg label={a.submissionType==="group"?"👥 Group":"👤 Individual"} bg="#0c1628" color="var(--subtle)"/>
                    {course&&<span style={{ fontSize:11, color:course.color, background:course.color+"18", borderRadius:6, padding:"2px 8px", fontWeight:600 }}>{course.code}</span>}
                  </div>
                  <p style={{ color:"var(--muted)", fontSize:13, lineHeight:1.6, marginBottom:12, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{a.description}</p>
                  {s==="no-group"&&<div style={{ background:"#1a0505", border:"1px solid #7f1d1d", borderRadius:8, padding:"10px 14px", marginBottom:12, fontSize:13, color:"#fca5a5" }}>⚠️ You are not part of any group. Form or join one to submit this assignment.</div>}
                  {sub&&<div style={{ display:"flex", alignItems:"center", gap:8, background:"#052e16", border:"1px solid #14532d", borderRadius:8, padding:"8px 14px", marginBottom:12 }}><span style={{ color:"var(--green)", fontSize:13 }}>✓ Acknowledged on {new Date(sub.acknowledgedAt).toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short"})}</span></div>}
                  <div style={{ display:"flex", gap:16, flexWrap:"wrap", alignItems:"center" }}>
                    <span style={{ color:"var(--muted)", fontSize:12 }}>📅 {fmtDate(a.deadline)}</span>
                    <span style={{ fontSize:12, fontWeight:600, color:isPast(a.deadline)?"var(--red)":"var(--amber)" }}>{dLeft(a.deadline)}</span>
                    {a.oneDriveLink&&<a href={a.oneDriveLink} target="_blank" rel="noreferrer" style={{ color:"var(--accent)", fontSize:12 }}>📁 OneDrive ↗</a>}
                  </div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:8, alignItems:"flex-end" }}>
                  {s==="submitted"?<span style={{ fontSize:28 }}>✅</span>:s==="no-group"?<span style={{ fontSize:26 }}>⚠️</span>:(
                    <button className="bg" onClick={()=>handleAck(a)} style={{ fontSize:13, padding:"10px 18px" }}>Acknowledge ✓</button>
                  )}
                  <button onClick={()=>setDetailA(a)} className="bs" style={{ fontSize:12, padding:"8px 14px" }}>Details</button>
                </div>
              </div>
            </div>
          );
        })}
        {shown.length===0&&<div style={{ textAlign:"center", padding:"60px", color:"var(--muted)" }}>{filter==="submitted"?"No submissions yet. Start acknowledging! 🚀":"All caught up! 🎉"}</div>}
      </div>

      {ackM&&(
        <Modal title="Confirm Acknowledgement" onClose={()=>setAckM(null)} width={440}>
          <p style={{ color:"var(--subtle)", fontSize:14, lineHeight:1.7, marginBottom:14 }}>Acknowledging: <strong style={{ color:"var(--text)" }}>{ackM.title}</strong></p>
          {ackM.submissionType==="group"&&(
            <div style={{ background:"#0c2240", border:"1px solid #1e3a6e", borderRadius:10, padding:"14px", marginBottom:14 }}>
              <div style={{ color:"var(--accent)", fontSize:13, fontWeight:600, marginBottom:4 }}>👥 Group Submission</div>
              <div style={{ color:"var(--muted)", fontSize:13 }}>As group leader, this acknowledges <strong style={{ color:"var(--text)" }}>{myGroup?.name}</strong> for all members.</div>
            </div>
          )}
          <div style={{ background:"#0c1628", borderRadius:10, padding:"12px 14px", fontSize:12, color:"var(--muted)", marginBottom:20 }}>
            🕐 Timestamp: <strong style={{ color:"var(--text)" }}>{new Date().toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short"})}</strong>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button className="bg" onClick={confirmAck} style={{ flex:1, padding:"12px", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>{loading&&<Spinner/>}Yes, I have submitted ✓</button>
            <button className="bs" onClick={()=>setAckM(null)} style={{ padding:"12px 18px" }}>Cancel</button>
          </div>
        </Modal>
      )}

      {detailA&&(
        <Modal title={detailA.title} onClose={()=>setDetailA(null)}>
          <div style={{ display:"grid", gap:14 }}>
            <p style={{ color:"var(--muted)", fontSize:14, lineHeight:1.7 }}>{detailA.description}</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {[["Deadline",fmtDate(detailA.deadline)],["Time Left",dLeft(detailA.deadline)],["Type",detailA.submissionType],["Status",status(detailA)==="submitted"?"✅ Submitted":"⏳ Pending"]].map(([k,v])=>(
                <div key={k} style={{ background:"#0c1628", borderRadius:10, padding:"12px 14px" }}>
                  <div style={{ color:"var(--muted)", fontSize:11, textTransform:"uppercase", letterSpacing:".1em", marginBottom:4 }}>{k}</div>
                  <div style={{ color:"var(--text)", fontSize:13, textTransform:"capitalize" }}>{v}</div>
                </div>
              ))}
            </div>
            {detailA.oneDriveLink&&<a href={detailA.oneDriveLink} target="_blank" rel="noreferrer" className="bp" style={{ textAlign:"center", display:"block", padding:"12px" }}>📁 Open OneDrive Submission</a>}
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   STUDENT — GROUPS
───────────────────────────────────────────────────────────────────────────── */
function StudGroups({ user, assignments }) {
  const myGroup = GROUPS.find(g=>g.members.includes(user.id));
  const groupA  = myGroup ? assignments.filter(a=>a.submissionType==="group") : [];
  const groupS  = groupA.filter(a=>a.submissions[myGroup?.id]);
  const pct     = groupA.length===0?0:Math.round(groupS.length/groupA.length*100);

  return (
    <div style={{ padding:"32px clamp(16px,3vw,40px)", maxWidth:800, margin:"0 auto" }}>
      <div className="fu" style={{ marginBottom:28 }}>
        <p style={{ color:"var(--muted)", fontSize:13, marginBottom:4, textTransform:"uppercase", letterSpacing:".12em" }}>Collaboration</p>
        <h2 style={{ fontFamily:"var(--display)", fontSize:28, fontWeight:800, color:"var(--text)" }}>My Group</h2>
      </div>
      {!myGroup?(
        <div className="fu fu1" style={{ background:"#1a0505", border:"1px solid #7f1d1d", borderRadius:16, padding:"48px", textAlign:"center" }}>
          <div style={{ fontSize:48, marginBottom:16 }}>🔍</div>
          <div style={{ fontFamily:"var(--display)", fontSize:22, color:"var(--text)", marginBottom:10 }}>You're not in a group yet</div>
          <p style={{ color:"#f87171", fontSize:14, lineHeight:1.7 }}>You are not part of any group. Form or join one to submit group assignments.</p>
        </div>
      ):(
        <>
          <div className="fu fu1" style={{ background:"var(--card)", border:"1px solid #14532d", borderRadius:16, padding:"24px 28px", marginBottom:24 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:16, marginBottom:20 }}>
              <div>
                <div style={{ fontFamily:"var(--display)", fontSize:24, fontWeight:800, color:"var(--text)", marginBottom:4 }}>{myGroup.name}</div>
                <div style={{ color:"var(--muted)", fontSize:13 }}>{myGroup.members.length} members · {groupS.length}/{groupA.length} group assignments done</div>
              </div>
              <Ring pct={pct} size={64} color="var(--green)"/>
            </div>
            <div style={{ display:"grid", gap:10 }}>
              {USERS.filter(u=>myGroup.members.includes(u.id)).map(m=>(
                <div key={m.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:"#0c1628", borderRadius:12, padding:"14px 18px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ width:36, height:36, borderRadius:"50%", background:aColor("student"), display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:14 }}>{m.avatar}</div>
                    <div>
                      <div style={{ color:"var(--text)", fontWeight:600, fontSize:14 }}>{m.name}{m.id===user.id&&<span style={{ color:"var(--accent)", fontSize:11 }}> (you)</span>}</div>
                      <div style={{ color:"var(--muted)", fontSize:12 }}>{m.email}</div>
                    </div>
                  </div>
                  {m.id===myGroup.leaderId&&<Bdg label="⭐ Leader" bg="#052e16" color="#86efac"/>}
                </div>
              ))}
            </div>
          </div>
          <div className="fu fu2">
            <h3 style={{ fontFamily:"var(--display)", fontSize:18, fontWeight:700, color:"var(--text)", marginBottom:14 }}>Group Assignments</h3>
            <div style={{ display:"grid", gap:10 }}>
              {groupA.map(a=>{
                const sub = a.submissions[myGroup.id];
                return (
                  <div key={a.id} style={{ background:"var(--card)", border:`1px solid ${sub?"#14532d":"var(--border)"}`, borderRadius:12, padding:"16px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
                    <div>
                      <div style={{ fontFamily:"var(--display)", fontSize:15, fontWeight:600, color:"var(--text)", marginBottom:2 }}>{a.title}</div>
                      <div style={{ color:"var(--muted)", fontSize:12 }}>📅 {fmtDate(a.deadline)}</div>
                    </div>
                    {sub?(
                      <div style={{ textAlign:"right" }}>
                        <div style={{ color:"var(--green)", fontSize:13, fontWeight:600 }}>✅ Acknowledged</div>
                        <div style={{ color:"var(--muted)", fontSize:11 }}>by {USERS.find(u=>u.id===sub.acknowledgedBy)?.name} · {new Date(sub.acknowledgedAt).toLocaleDateString("en-IN")}</div>
                        <div style={{ color:"var(--green)", fontSize:11 }}>All members: Acknowledged</div>
                      </div>
                    ):(
                      <Bdg label={user.isGroupLeader?"You must acknowledge":"Awaiting leader"} bg={user.isGroupLeader?"#1e1b4b":"#0c1628"} color={user.isGroupLeader?"#a5b4fc":"var(--muted)"}/>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ROOT
───────────────────────────────────────────────────────────────────────────── */
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [assigns, setAssigns] = useState(INIT_ASSIGNS);
  const [toast, setToast] = useState("");

  const isPr = user?.role==="professor";
  const myCourses = user ? COURSES.filter(c=>isPr||c.students.includes(user.id)) : [];

  if (!user) return (
    <>
      <style>{CSS}</style>
      <Auth onLogin={u=>{ setUser(u); setPage("dashboard"); }}/>
    </>
  );

  return (
    <>
      <style>{CSS}</style>
      {toast&&<Toast msg={toast} onClose={()=>setToast("")}/>}
      <div style={{ display:"flex", minHeight:"100vh" }}>
        <Sidebar user={user} page={page} setPage={setPage} onLogout={()=>{ setUser(null); setPage("dashboard"); }}/>
        <main style={{ flex:1, overflowY:"auto" }}>
          {isPr ? (
            page==="dashboard"   ? <ProfDash   assignments={assigns}/> :
            page==="assignments" ? <ProfAssigns assignments={assigns} setAssignments={setAssigns} showToast={setToast}/> :
            page==="students"    ? <ProfStudents assignments={assigns}/> : null
          ) : (
            page==="dashboard"   ? <StudDash   user={user} assignments={assigns}/> :
            page==="assignments" ? <StudAssigns user={user} assignments={assigns} setAssignments={setAssigns} showToast={setToast}/> :
            page==="groups"      ? <StudGroups  user={user} assignments={assigns}/> : null
          )}
        </main>
      </div>
    </>
  );
}
