import { useState, useEffect, useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";

const PRIMARY = "#078FCD";
const PRIMARY_DARK = "#056a99";
const PRIMARY_LIGHT = "#e6f5fb";

// ─── SEED DATA ───────────────────────────────────────────────────────────────
const INITIAL_PROJECTS = [
  {
    id: "p1", company_name: "GreenLeaf Organics", contact_person: "Ravi Menon",
    phone: "+91 9876543210", email: "ravi@greenleaf.in", website: "greenleaf.in",
    plan: "Professional", plan_value: 9999, assigned_to: "Arjun",
    deadline: "2025-07-15", status: "Development",
    project_value: 9999, advance_received: 5000, final_payment_received: 0,
    salary_expense: 2000, domain_cost: 800, hosting_cost: 600, other_expenses: 200,
    domain_name: "greenleaf.in", renewal_date: "2025-08-01", client_email: "ravi@greenleaf.in",
    github_url: "https://github.com/madewebs/greenleaf", preview_url: "https://greenleaf.vercel.app", live_url: "",
    checklist: {
      Requirements: { "Logo Received": true, "Content Received": true, "Images Received": false, "Business Information Received": true },
      Development: { "Homepage Complete": true, "Internal Pages Complete": false, "Responsive Design Complete": false, "Forms Working": false, "SEO Setup Complete": false },
      Testing: { "Mobile Tested": false, "Desktop Tested": false, "Form Tested": false, "Speed Checked": false },
      Deployment: { "Domain Purchased": true, "DNS Configured": false, "SSL Active": false, "Analytics Setup": false, "Website Live": false }
    },
    updates: [{ id: "u1", employee_name: "Arjun", note: "Homepage hero section complete. Working on services page.", created_at: "2025-06-20T10:00:00Z" }],
    created_at: "2025-06-10T08:00:00Z", updated_at: "2025-06-20T10:00:00Z"
  },
  {
    id: "p2", company_name: "TechNova Solutions", contact_person: "Priya Sharma",
    phone: "+91 9123456780", email: "priya@technova.io", website: "technova.io",
    plan: "Premium", plan_value: 15000, assigned_to: "Sneha",
    deadline: "2025-07-01", status: "Review",
    project_value: 15000, advance_received: 15000, final_payment_received: 0,
    salary_expense: 3500, domain_cost: 1200, hosting_cost: 800, other_expenses: 500,
    domain_name: "technova.io", renewal_date: "2025-06-28", client_email: "priya@technova.io",
    github_url: "https://github.com/madewebs/technova", preview_url: "https://technova.vercel.app", live_url: "",
    checklist: {
      Requirements: { "Logo Received": true, "Content Received": true, "Images Received": true, "Business Information Received": true },
      Development: { "Homepage Complete": true, "Internal Pages Complete": true, "Responsive Design Complete": true, "Forms Working": true, "SEO Setup Complete": true },
      Testing: { "Mobile Tested": true, "Desktop Tested": true, "Form Tested": true, "Speed Checked": false },
      Deployment: { "Domain Purchased": true, "DNS Configured": true, "SSL Active": true, "Analytics Setup": false, "Website Live": false }
    },
    updates: [{ id: "u2", employee_name: "Sneha", note: "All dev complete. Sent for client review.", created_at: "2025-06-22T14:00:00Z" }],
    created_at: "2025-05-20T08:00:00Z", updated_at: "2025-06-22T14:00:00Z"
  },
  {
    id: "p3", company_name: "Bloom Boutique", contact_person: "Ananya Nair",
    phone: "+91 9988776655", email: "ananya@bloomboutique.com", website: "bloomboutique.com",
    plan: "Starter", plan_value: 5999, assigned_to: "Rahul",
    deadline: "2025-08-10", status: "Completed",
    project_value: 5999, advance_received: 3000, final_payment_received: 2999,
    salary_expense: 1200, domain_cost: 600, hosting_cost: 400, other_expenses: 100,
    domain_name: "bloomboutique.com", renewal_date: "2026-03-15", client_email: "ananya@bloomboutique.com",
    github_url: "https://github.com/madewebs/bloom", preview_url: "", live_url: "https://bloomboutique.com",
    checklist: {
      Requirements: { "Logo Received": true, "Content Received": true, "Images Received": true, "Business Information Received": true },
      Development: { "Homepage Complete": true, "Internal Pages Complete": true, "Responsive Design Complete": true, "Forms Working": true, "SEO Setup Complete": true },
      Testing: { "Mobile Tested": true, "Desktop Tested": true, "Form Tested": true, "Speed Checked": true },
      Deployment: { "Domain Purchased": true, "DNS Configured": true, "SSL Active": true, "Analytics Setup": true, "Website Live": true }
    },
    updates: [],
    created_at: "2025-04-01T08:00:00Z", updated_at: "2025-05-30T10:00:00Z"
  },
  {
    id: "p4", company_name: "FreshBite Catering", contact_person: "Suresh Kumar",
    phone: "+91 9000112233", email: "suresh@freshbite.in", website: "",
    plan: "Basic", plan_value: 3999, assigned_to: "Arjun",
    deadline: "2025-06-25", status: "Requirements",
    project_value: 3999, advance_received: 2000, final_payment_received: 0,
    salary_expense: 800, domain_cost: 500, hosting_cost: 300, other_expenses: 0,
    domain_name: "freshbite.in", renewal_date: "2025-07-05", client_email: "suresh@freshbite.in",
    github_url: "", preview_url: "", live_url: "",
    checklist: {
      Requirements: { "Logo Received": false, "Content Received": false, "Images Received": false, "Business Information Received": true },
      Development: { "Homepage Complete": false, "Internal Pages Complete": false, "Responsive Design Complete": false, "Forms Working": false, "SEO Setup Complete": false },
      Testing: { "Mobile Tested": false, "Desktop Tested": false, "Form Tested": false, "Speed Checked": false },
      Deployment: { "Domain Purchased": false, "DNS Configured": false, "SSL Active": false, "Analytics Setup": false, "Website Live": false }
    },
    updates: [],
    created_at: "2025-06-18T08:00:00Z", updated_at: "2025-06-18T08:00:00Z"
  }
];

const MONTHLY_DATA = [
  { month: "Jan", revenue: 18998, expenses: 7200, profit: 11798 },
  { month: "Feb", revenue: 24997, expenses: 9100, profit: 15897 },
  { month: "Mar", revenue: 12999, expenses: 5400, profit: 7599 },
  { month: "Apr", revenue: 34996, expenses: 12800, profit: 22196 },
  { month: "May", revenue: 21998, expenses: 8300, profit: 13698 },
  { month: "Jun", revenue: 28997, expenses: 10200, profit: 18797 },
];

const PLANS = [
  { name: "Basic", value: 3999 },
  { name: "Starter", value: 5999 },
  { name: "Professional", value: 9999 },
  { name: "Premium", value: 15000 },
];

const STATUSES = ["Requirements", "Development", "Testing", "Review", "Deployment", "Completed"];
const EMPLOYEES = ["Arjun", "Sneha", "Rahul", "Meera", "Kiran"];

const CHECKLIST_TEMPLATE = {
  Requirements: ["Logo Received", "Content Received", "Images Received", "Business Information Received"],
  Development: ["Homepage Complete", "Internal Pages Complete", "Responsive Design Complete", "Forms Working", "SEO Setup Complete"],
  Testing: ["Mobile Tested", "Desktop Tested", "Form Tested", "Speed Checked"],
  Deployment: ["Domain Purchased", "DNS Configured", "SSL Active", "Analytics Setup", "Website Live"]
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function calcProgress(checklist) {
  let total = 0, done = 0;
  Object.values(checklist).forEach(cat => {
    Object.values(cat).forEach(v => { total++; if (v) done++; });
  });
  return total === 0 ? 0 : Math.round((done / total) * 100);
}

function calcFinancials(p) {
  const expenses = (p.salary_expense || 0) + (p.domain_cost || 0) + (p.hosting_cost || 0) + (p.other_expenses || 0);
  const received = (p.advance_received || 0) + (p.final_payment_received || 0);
  const pending = (p.project_value || 0) - received;
  const profit = (p.project_value || 0) - expenses;
  return { expenses, received, pending, profit };
}

function daysUntil(dateStr) {
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function fmtCurrency(v) {
  return "₹" + Number(v || 0).toLocaleString("en-IN");
}

function progressColor(pct) {
  if (pct < 50) return "#f97316";
  if (pct < 80) return PRIMARY;
  return "#22c55e";
}

function statusColor(s) {
  const map = {
    Requirements: "#f59e0b", Development: PRIMARY, Testing: "#8b5cf6",
    Review: "#ec4899", Deployment: "#06b6d4", Completed: "#22c55e"
  };
  return map[s] || "#6b7280";
}

// ─── CIRCLE PROGRESS ─────────────────────────────────────────────────────────
function CircleProgress({ pct, size = 120, stroke = 10 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  const color = progressColor(pct);
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={circ - dash}
        style={{ transition: "stroke-dashoffset 0.6s ease" }} strokeLinecap="round" />
      <text x={size / 2} y={size / 2 + 2} textAnchor="middle" dominantBaseline="middle"
        style={{ transform: "rotate(90deg)", transformOrigin: `${size / 2}px ${size / 2}px`, fontSize: 20, fontWeight: 700, fill: color }}>
        {pct}%
      </text>
    </svg>
  );
}

// ─── BADGE ───────────────────────────────────────────────────────────────────
function Badge({ label, color }) {
  return (
    <span style={{
      display: "inline-block", padding: "2px 10px", borderRadius: 20, fontSize: 12,
      fontWeight: 600, background: color + "18", color: color, border: `1px solid ${color}40`
    }}>{label}</span>
  );
}

// ─── STAT CARD ───────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color = PRIMARY, sub }) {
  return (
    <div style={{
      background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: "16px 18px",
      display: "flex", flexDirection: "column", gap: 6, boxShadow: "0 1px 4px rgba(0,0,0,0.05)"
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</span>
        <span style={{ fontSize: 20, color, background: color + "15", borderRadius: 8, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</span>
      </div>
      <div style={{ fontSize: 24, fontWeight: 700, color: "#111827" }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "#9ca3af" }}>{sub}</div>}
    </div>
  );
}

// ─── MODAL ───────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children, wide }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000,
      display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "24px 12px", overflowY: "auto"
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: "#fff", borderRadius: 16, width: "100%", maxWidth: wide ? 700 : 540,
        boxShadow: "0 20px 60px rgba(0,0,0,0.18)"
      }}>
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontWeight: 700, fontSize: 17, color: "#111827" }}>{title}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#9ca3af", lineHeight: 1 }}>✕</button>
        </div>
        <div style={{ padding: "20px 24px 24px" }}>{children}</div>
      </div>
    </div>
  );
}

// ─── INPUT ───────────────────────────────────────────────────────────────────
function Input({ label, value, onChange, type = "text", placeholder, required }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>{label}{required && <span style={{ color: "#ef4444" }}> *</span>}</label>}
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{
          border: "1px solid #d1d5db", borderRadius: 8, padding: "8px 12px", fontSize: 14,
          color: "#111827", background: "#fff", outline: "none", width: "100%", boxSizing: "border-box"
        }} />
    </div>
  );
}

function Select({ label, value, onChange, options, required }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>{label}{required && <span style={{ color: "#ef4444" }}> *</span>}</label>}
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{
          border: "1px solid #d1d5db", borderRadius: 8, padding: "8px 12px", fontSize: 14,
          color: "#111827", background: "#fff", outline: "none", width: "100%", cursor: "pointer"
        }}>
        <option value="">Select...</option>
        {options.map(o => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
      </select>
    </div>
  );
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = () => {
    setLoading(true);
    setTimeout(() => {
      if (email === "abhinchelakkal@gmail.com" && password === "Abhin2004#") {
        onLogin();
      } else {
        setError("Invalid email or password.");
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div style={{
      minHeight: "100vh", background: "linear-gradient(135deg, #f0f9ff 0%, #e6f5fb 100%)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24
    }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 70, height: 70, background: PRIMARY, borderRadius: 18,
            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
            boxShadow: "0 8px 24px rgba(7,143,205,0.35)"
          }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <rect x="4" y="10" width="22" height="22" rx="2" stroke="white" strokeWidth="2.5" fill="none" />
              <path d="M10 10V8a6 6 0 0 1 12 0v2" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M15 22v-6M15 16l-3 3M15 16l3 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", margin: 0 }}>MadeWebs Tracker</h1>
          <p style={{ fontSize: 14, color: "#6b7280", margin: "6px 0 0" }}>Project Operations Dashboard</p>
        </div>

        <div style={{ background: "#fff", borderRadius: 16, padding: 32, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", border: "1px solid #e5e7eb" }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: "0 0 24px" }}>Sign in to your account</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Input label="Email Address" value={email} onChange={setEmail} type="email" placeholder="admin@madewebs.com" />
            <Input label="Password" value={password} onChange={setPassword} type="password" placeholder="••••••••" />
            {error && <div style={{ color: "#ef4444", fontSize: 13, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "8px 12px" }}>{error}</div>}
            <button onClick={handle} disabled={loading} style={{
              background: PRIMARY, color: "#fff", border: "none", borderRadius: 10, padding: "12px",
              fontSize: 15, fontWeight: 600, cursor: "pointer", marginTop: 4,
              opacity: loading ? 0.7 : 1, transition: "all 0.2s"
            }}>
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </div>
        </div>
        <p style={{ textAlign: "center", fontSize: 12, color: "#9ca3af", marginTop: 20 }}>
          Internal MadeWebs tool — no public access
        </p>
      </div>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", icon: "🏠", label: "Dashboard" },
  { id: "projects", icon: "📁", label: "Projects" },
  { id: "finance", icon: "💰", label: "Finance" },
  { id: "domains", icon: "🌐", label: "Domains" },
  { id: "new-project", icon: "➕", label: "New Project" },
];

function Sidebar({ page, setPage, collapsed, setCollapsed }) {
  return (
    <div style={{
      width: collapsed ? 64 : 230, background: "#0f172a", display: "flex", flexDirection: "column",
      height: "100vh", position: "fixed", left: 0, top: 0, zIndex: 100,
      transition: "width 0.25s ease", overflow: "hidden"
    }}>
      <div style={{ padding: "18px 16px 14px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 34, height: 34, background: PRIMARY, borderRadius: 8, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16
        }}>📤</div>
        {!collapsed && (
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>MadeWebs</div>
            <div style={{ color: "#64748b", fontSize: 11 }}>Tracker</div>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} style={{
          marginLeft: "auto", background: "none", border: "none", color: "#64748b",
          cursor: "pointer", fontSize: 18, flexShrink: 0, padding: 0
        }}>☰</button>
      </div>

      <nav style={{ flex: 1, padding: "12px 8px" }}>
        {NAV.map(n => (
          <button key={n.id} onClick={() => setPage(n.id)} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 10px",
            borderRadius: 8, border: "none", cursor: "pointer", marginBottom: 2, textAlign: "left",
            background: page === n.id ? PRIMARY + "22" : "transparent",
            color: page === n.id ? PRIMARY : "#94a3b8", fontWeight: page === n.id ? 600 : 400,
            fontSize: 14, transition: "all 0.15s", whiteSpace: "nowrap"
          }}>
            <span style={{ fontSize: 17, flexShrink: 0 }}>{n.icon}</span>
            {!collapsed && n.label}
          </button>
        ))}
      </nav>

      {!collapsed && (
        <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize: 11, color: "#475569", marginBottom: 2 }}>Logged in as</div>
          <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>abhinchelakkal@gmail.com</div>
        </div>
      )}
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ projects, setPage, setSelectedProject }) {
  const stats = useMemo(() => {
    const active = projects.filter(p => p.status !== "Completed").length;
    const completed = projects.filter(p => p.status === "Completed").length;
    let revenue = 0, expenses = 0, profit = 0, pending = 0;
    projects.forEach(p => {
      const f = calcFinancials(p);
      revenue += p.advance_received + p.final_payment_received;
      expenses += f.expenses;
      profit += f.profit;
      pending += f.pending;
    });
    const pendingReview = projects.filter(p => p.status === "Review").length;
    const domainRenewals = projects.filter(p => p.renewal_date && daysUntil(p.renewal_date) <= 30 && daysUntil(p.renewal_date) > 0).length;
    return { active, completed, revenue, expenses, profit, pending, pendingReview, domainRenewals };
  }, [projects]);

  const upcomingDeadlines = projects
    .filter(p => p.status !== "Completed" && p.deadline)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 5);

  const reviewProjects = projects.filter(p => p.status === "Review");
  const inactiveProjects = projects.filter(p => {
    const days = Math.floor((new Date() - new Date(p.updated_at)) / (1000 * 60 * 60 * 24));
    return days >= 7 && p.status !== "Completed";
  });
  const domainAlerts = projects.filter(p => {
    const days = daysUntil(p.renewal_date);
    return days > 0 && days <= 30;
  }).sort((a, b) => daysUntil(a.renewal_date) - daysUntil(b.renewal_date));

  return (
    <div style={{ padding: "24px", maxWidth: 1200 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: 0 }}>Dashboard</h1>
        <p style={{ color: "#6b7280", fontSize: 14, margin: "4px 0 0" }}>Welcome back — here's what's happening today.</p>
      </div>

      {/* Alerts */}
      {(inactiveProjects.length > 0 || domainAlerts.length > 0) && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
          {inactiveProjects.map(p => (
            <div key={p.id} style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 10, padding: "8px 14px", fontSize: 13, color: "#c2410c", display: "flex", alignItems: "center", gap: 6 }}>
              ⚠️ <strong>{p.company_name}</strong> — inactive for 7+ days
            </div>
          ))}
          {domainAlerts.map(p => (
            <div key={p.id} style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, padding: "8px 14px", fontSize: 13, color: "#1d4ed8", display: "flex", alignItems: "center", gap: 6 }}>
              🌐 <strong>{p.domain_name}</strong> renews in {daysUntil(p.renewal_date)} day{daysUntil(p.renewal_date) !== 1 ? "s" : ""}
            </div>
          ))}
        </div>
      )}

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 14, marginBottom: 28 }}>
        <StatCard label="Active Projects" value={stats.active} icon="📁" color={PRIMARY} />
        <StatCard label="Completed" value={stats.completed} icon="✅" color="#22c55e" />
        <StatCard label="Revenue" value={fmtCurrency(stats.revenue)} icon="💳" color="#8b5cf6" />
        <StatCard label="Expenses" value={fmtCurrency(stats.expenses)} icon="📉" color="#ef4444" />
        <StatCard label="Profit" value={fmtCurrency(stats.profit)} icon="📈" color="#22c55e" />
        <StatCard label="Pending Payment" value={fmtCurrency(stats.pending)} icon="⏳" color="#f59e0b" />
        <StatCard label="Pending Review" value={stats.pendingReview} icon="👁" color="#ec4899" />
        <StatCard label="Domain Renewals" value={stats.domainRenewals} icon="🔄" color="#06b6d4" sub="within 30 days" />
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 18, marginBottom: 28 }}>
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 16px" }}>Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={MONTHLY_DATA}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={PRIMARY} stopOpacity={0.18} />
                  <stop offset="95%" stopColor={PRIMARY} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={v => "₹" + (v / 1000) + "k"} />
              <Tooltip formatter={v => fmtCurrency(v)} contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 13 }} />
              <Area type="monotone" dataKey="revenue" stroke={PRIMARY} strokeWidth={2.5} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 16px" }}>Monthly Profit</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MONTHLY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={v => "₹" + (v / 1000) + "k"} />
              <Tooltip formatter={v => fmtCurrency(v)} contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 13 }} />
              <Bar dataKey="profit" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Lists */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18 }}>
        {/* Upcoming Deadlines */}
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 14px" }}>⏰ Upcoming Deadlines</h3>
          {upcomingDeadlines.length === 0 ? <p style={{ color: "#9ca3af", fontSize: 13 }}>No upcoming deadlines.</p> :
            upcomingDeadlines.map(p => {
              const d = daysUntil(p.deadline);
              return (
                <div key={p.id} onClick={() => { setSelectedProject(p.id); setPage("project"); }}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f3f4f6", cursor: "pointer" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{p.company_name}</div>
                    <div style={{ fontSize: 12, color: "#9ca3af" }}>{fmtDate(p.deadline)}</div>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: d <= 3 ? "#ef4444" : d <= 7 ? "#f59e0b" : "#22c55e" }}>
                    {d <= 0 ? "Overdue" : `${d}d`}
                  </span>
                </div>
              );
            })}
        </div>

        {/* Pending Payments */}
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 14px" }}>💳 Pending Payments</h3>
          {projects.filter(p => calcFinancials(p).pending > 0).map(p => {
            const { pending } = calcFinancials(p);
            return (
              <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f3f4f6" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{p.company_name}</div>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>Value: {fmtCurrency(p.project_value)}</div>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#f59e0b" }}>{fmtCurrency(pending)}</span>
              </div>
            );
          })}
        </div>

        {/* Review Projects */}
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 14px" }}>👁 Waiting Review</h3>
          {reviewProjects.length === 0 ? <p style={{ color: "#9ca3af", fontSize: 13 }}>No projects awaiting review.</p> :
            reviewProjects.map(p => (
              <div key={p.id} onClick={() => { setSelectedProject(p.id); setPage("project"); }}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f3f4f6", cursor: "pointer" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{p.company_name}</div>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>{p.assigned_to}</div>
                </div>
                <Badge label="Review" color="#ec4899" />
              </div>
            ))}
        </div>

        {/* Domain Renewals */}
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 14px" }}>🌐 Domain Renewals</h3>
          {domainAlerts.length === 0 ? <p style={{ color: "#9ca3af", fontSize: 13 }}>No upcoming renewals.</p> :
            domainAlerts.map(p => {
              const d = daysUntil(p.renewal_date);
              return (
                <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f3f4f6" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{p.domain_name}</div>
                    <div style={{ fontSize: 12, color: "#9ca3af" }}>{p.company_name} · {fmtDate(p.renewal_date)}</div>
                  </div>
                  <Badge label={`${d}d`} color={d <= 7 ? "#ef4444" : "#f59e0b"} />
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

// ─── PROJECT LIST ─────────────────────────────────────────────────────────────
function ProjectList({ projects, setPage, setSelectedProject }) {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? projects : projects.filter(p => p.status === filter);

  return (
    <div style={{ padding: 24, maxWidth: 1100 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#111827", margin: 0 }}>Projects</h1>
          <p style={{ fontSize: 14, color: "#6b7280", margin: "4px 0 0" }}>{projects.length} total projects</p>
        </div>
        <button onClick={() => setPage("new-project")} style={{
          background: PRIMARY, color: "#fff", border: "none", borderRadius: 10,
          padding: "10px 18px", fontSize: 14, fontWeight: 600, cursor: "pointer"
        }}>+ New Project</button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {["All", ...STATUSES].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: "pointer",
            background: filter === s ? PRIMARY : "#f3f4f6", color: filter === s ? "#fff" : "#6b7280",
            border: "none", transition: "all 0.15s"
          }}>{s}</button>
        ))}
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {filtered.map(p => {
          const pct = calcProgress(p.checklist);
          const { pending } = calcFinancials(p);
          return (
            <div key={p.id} onClick={() => { setSelectedProject(p.id); setPage("project"); }}
              style={{
                background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: "16px 20px",
                cursor: "pointer", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 16,
                flexWrap: "wrap"
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = PRIMARY}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#e5e7eb"}>
              <CircleProgress pct={pct} size={56} stroke={5} />
              <div style={{ flex: 1, minWidth: 160 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{p.company_name}</div>
                <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>{p.plan} · {p.assigned_to} · Due {fmtDate(p.deadline)}</div>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                <Badge label={p.status} color={statusColor(p.status)} />
                {pending > 0 && <Badge label={"Pending " + fmtCurrency(pending)} color="#f59e0b" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── PROJECT DETAIL ───────────────────────────────────────────────────────────
function ProjectDetail({ project, onUpdate, onBack }) {
  const [p, setP] = useState(project);
  const [editStatus, setEditStatus] = useState(false);
  const [activeTab, setActiveTab] = useState("checklist");

  useEffect(() => { setP(project); }, [project]);

  const pct = calcProgress(p.checklist);
  const fin = calcFinancials(p);

  const toggleTask = (cat, task) => {
    const updated = {
      ...p,
      checklist: {
        ...p.checklist,
        [cat]: { ...p.checklist[cat], [task]: !p.checklist[cat][task] }
      },
      updated_at: new Date().toISOString()
    };
    setP(updated);
    onUpdate(updated);
  };

  const updateField = (field, value) => {
    const updated = { ...p, [field]: value, updated_at: new Date().toISOString() };
    setP(updated);
    onUpdate(updated);
  };

  const employeeLink = `/update/${p.id}`;

  const TABS = ["checklist", "finance", "links", "updates"];

  return (
    <div style={{ padding: 24, maxWidth: 900 }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: PRIMARY, cursor: "pointer", fontSize: 14, marginBottom: 16, padding: 0 }}>← Back to Projects</button>

      {/* Header */}
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: "24px", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 24, flexWrap: "wrap" }}>
          <CircleProgress pct={pct} size={110} stroke={9} />
          <div style={{ flex: 1, minWidth: 200 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#111827", margin: "0 0 8px" }}>{p.company_name}</h1>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
              <Badge label={p.plan} color={PRIMARY} />
              {editStatus ? (
                <select value={p.status} onChange={e => { updateField("status", e.target.value); setEditStatus(false); }}
                  style={{ fontSize: 12, border: "1px solid #d1d5db", borderRadius: 8, padding: "2px 8px", cursor: "pointer" }}>
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              ) : (
                <span onClick={() => setEditStatus(true)} style={{ cursor: "pointer" }}>
                  <Badge label={p.status} color={statusColor(p.status)} />
                </span>
              )}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
              {[
                { label: "Contact", value: p.contact_person },
                { label: "Assigned", value: p.assigned_to },
                { label: "Deadline", value: fmtDate(p.deadline) },
                { label: "Phone", value: p.phone },
                { label: "Email", value: p.email },
                { label: "Website", value: p.website },
              ].map(i => (
                <div key={i.label}>
                  <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 500 }}>{i.label}</div>
                  <div style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{i.value || "—"}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Employee Link */}
        <div style={{ marginTop: 16, background: PRIMARY_LIGHT, border: `1px solid ${PRIMARY}30`, borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 13, color: PRIMARY_DARK, fontWeight: 500 }}>🔗 Employee Update Link:</span>
          <code style={{ fontSize: 12, color: PRIMARY_DARK, background: "#fff", border: `1px solid ${PRIMARY}30`, borderRadius: 6, padding: "2px 8px" }}>{employeeLink}</code>
          <button onClick={() => navigator.clipboard?.writeText(window.location.origin + employeeLink)}
            style={{ background: PRIMARY, color: "#fff", border: "none", borderRadius: 6, padding: "4px 10px", fontSize: 12, cursor: "pointer", marginLeft: "auto" }}>
            Copy Link
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 16, borderBottom: "1px solid #e5e7eb", paddingBottom: 0 }}>
        {[["checklist", "✅ Checklist"], ["finance", "💰 Finance"], ["links", "🔗 Links"], ["updates", "📝 Updates"]].map(([id, label]) => (
          <button key={id} onClick={() => setActiveTab(id)} style={{
            background: "none", border: "none", borderBottom: activeTab === id ? `2px solid ${PRIMARY}` : "2px solid transparent",
            color: activeTab === id ? PRIMARY : "#6b7280", fontWeight: activeTab === id ? 600 : 400,
            fontSize: 14, padding: "8px 16px", cursor: "pointer", marginBottom: -1
          }}>{label}</button>
        ))}
      </div>

      {/* Checklist */}
      {activeTab === "checklist" && (
        <div style={{ display: "grid", gap: 14 }}>
          {Object.entries(p.checklist).map(([cat, tasks]) => {
            const done = Object.values(tasks).filter(Boolean).length;
            const total = Object.values(tasks).length;
            return (
              <div key={cat} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>{cat}</span>
                  <span style={{ fontSize: 13, color: "#6b7280" }}>{done}/{total}</span>
                </div>
                <div style={{ height: 4, background: "#e5e7eb", borderRadius: 99, marginBottom: 14, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(done / total) * 100}%`, background: progressColor((done / total) * 100), borderRadius: 99, transition: "width 0.4s" }} />
                </div>
                <div style={{ display: "grid", gap: 8 }}>
                  {Object.entries(tasks).map(([task, done]) => (
                    <label key={task} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                      <input type="checkbox" checked={done} onChange={() => toggleTask(cat, task)}
                        style={{ width: 16, height: 16, accentColor: PRIMARY, cursor: "pointer" }} />
                      <span style={{ fontSize: 14, color: done ? "#6b7280" : "#111827", textDecoration: done ? "line-through" : "none" }}>{task}</span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Finance */}
      {activeTab === "finance" && (
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 20 }}>
            <StatCard label="Project Value" value={fmtCurrency(p.project_value)} icon="💼" color={PRIMARY} />
            <StatCard label="Advance Received" value={fmtCurrency(p.advance_received)} icon="✅" color="#22c55e" />
            <StatCard label="Final Payment" value={fmtCurrency(p.final_payment_received)} icon="💳" color="#22c55e" />
            <StatCard label="Total Expenses" value={fmtCurrency(fin.expenses)} icon="📉" color="#ef4444" />
            <StatCard label="Pending" value={fmtCurrency(fin.pending)} icon="⏳" color="#f59e0b" />
            <StatCard label="Profit" value={fmtCurrency(fin.profit)} icon="📈" color={fin.profit >= 0 ? "#22c55e" : "#ef4444"} />
          </div>
          <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 18 }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: "#374151", marginBottom: 14 }}>Edit Financial Details</h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
              {[
                ["project_value", "Project Value (₹)"],
                ["advance_received", "Advance Received (₹)"],
                ["final_payment_received", "Final Payment (₹)"],
                ["salary_expense", "Salary Expense (₹)"],
                ["domain_cost", "Domain Cost (₹)"],
                ["hosting_cost", "Hosting Cost (₹)"],
                ["other_expenses", "Other Expenses (₹)"],
              ].map(([field, label]) => (
                <Input key={field} label={label} type="number" value={p[field] || ""} onChange={v => updateField(field, Number(v))} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Links */}
      {activeTab === "links" && (
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 20 }}>
          <div style={{ display: "grid", gap: 12 }}>
            {[
              { label: "GitHub Repository", field: "github_url", icon: "🐙" },
              { label: "Vercel Preview URL", field: "preview_url", icon: "🔮" },
              { label: "Live Website URL", field: "live_url", icon: "🌐" },
            ].map(({ label, field, icon }) => (
              <div key={field} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>{icon}</span>
                <div style={{ flex: 1 }}>
                  <Input label={label} value={p[field] || ""} onChange={v => updateField(field, v)} placeholder="https://..." />
                </div>
                {p[field] && (
                  <a href={p[field]} target="_blank" rel="noreferrer" style={{ marginTop: 20, background: PRIMARY, color: "#fff", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", textDecoration: "none", display: "inline-block" }}>
                    Open ↗
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Updates */}
      {activeTab === "updates" && (
        <div>
          {p.updates.length === 0 ? (
            <div style={{ textAlign: "center", color: "#9ca3af", padding: 40 }}>No updates yet. Share the employee link to get updates.</div>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {p.updates.map(u => (
                <div key={u.id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>{u.employee_name}</span>
                    <span style={{ fontSize: 12, color: "#9ca3af" }}>{new Date(u.created_at).toLocaleString()}</span>
                  </div>
                  <p style={{ fontSize: 14, color: "#374151", margin: 0 }}>{u.note}</p>
                  {u.screenshot_url && <img src={u.screenshot_url} alt="screenshot" style={{ marginTop: 10, maxWidth: "100%", borderRadius: 8, border: "1px solid #e5e7eb" }} />}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── NEW PROJECT FORM ─────────────────────────────────────────────────────────
function NewProjectForm({ onSave, onCancel }) {
  const [form, setForm] = useState({
    company_name: "", contact_person: "", phone: "", email: "", website: "",
    plan: "", plan_value: 0, assigned_to: "", deadline: "",
    project_value: 0, advance_received: 0, final_payment_received: 0,
    salary_expense: 0, domain_cost: 0, hosting_cost: 0, other_expenses: 0,
    domain_name: "", renewal_date: "", client_email: "",
    github_url: "", preview_url: "", live_url: "", status: "Requirements"
  });

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handlePlan = (planName) => {
    const p = PLANS.find(pl => pl.name === planName);
    set("plan", planName);
    set("plan_value", p?.value || 0);
    set("project_value", p?.value || 0);
  };

  const handleSubmit = () => {
    if (!form.company_name || !form.plan || !form.assigned_to) {
      alert("Please fill in Company Name, Plan, and Assigned Employee.");
      return;
    }
    const checklist = {};
    Object.entries(CHECKLIST_TEMPLATE).forEach(([cat, tasks]) => {
      checklist[cat] = {};
      tasks.forEach(t => { checklist[cat][t] = false; });
    });
    const newProject = {
      ...form,
      id: "p" + Date.now(),
      checklist,
      updates: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    onSave(newProject);
  };

  return (
    <div style={{ padding: 24, maxWidth: 760 }}>
      <button onClick={onCancel} style={{ background: "none", border: "none", color: PRIMARY, cursor: "pointer", fontSize: 14, marginBottom: 16, padding: 0 }}>← Back</button>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: "#111827", margin: "0 0 24px" }}>Create New Project</h1>

      <div style={{ display: "grid", gap: 20 }}>
        {/* Client Info */}
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 14px" }}>Client Information</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            <Input label="Company Name" value={form.company_name} onChange={v => set("company_name", v)} required />
            <Input label="Contact Person" value={form.contact_person} onChange={v => set("contact_person", v)} />
            <Input label="Phone" value={form.phone} onChange={v => set("phone", v)} type="tel" />
            <Input label="Email" value={form.email} onChange={v => set("email", v)} type="email" />
            <Input label="Website" value={form.website} onChange={v => set("website", v)} placeholder="example.com" />
          </div>
        </div>

        {/* Project Info */}
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 14px" }}>Project Information</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 6 }}>Plan <span style={{ color: "#ef4444" }}>*</span></label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {PLANS.map(pl => (
                  <button key={pl.name} onClick={() => handlePlan(pl.name)} style={{
                    border: `2px solid ${form.plan === pl.name ? PRIMARY : "#e5e7eb"}`,
                    borderRadius: 8, padding: "8px 10px", background: form.plan === pl.name ? PRIMARY_LIGHT : "#fff",
                    cursor: "pointer", textAlign: "left", color: "#111827"
                  }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: form.plan === pl.name ? PRIMARY : "#111827" }}>{pl.name}</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>₹{pl.value.toLocaleString()}</div>
                  </button>
                ))}
              </div>
            </div>
            <Select label="Assigned Employee" value={form.assigned_to} onChange={v => set("assigned_to", v)} options={EMPLOYEES} required />
            <Input label="Deadline" value={form.deadline} onChange={v => set("deadline", v)} type="date" />
          </div>
        </div>

        {/* Financials */}
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 14px" }}>Financials</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
            <Input label="Project Value (₹)" value={form.project_value} onChange={v => set("project_value", Number(v))} type="number" />
            <Input label="Advance Received (₹)" value={form.advance_received} onChange={v => set("advance_received", Number(v))} type="number" />
          </div>
        </div>

        {/* Domain */}
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 14px" }}>Domain & Links</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            <Input label="Domain Name" value={form.domain_name} onChange={v => set("domain_name", v)} placeholder="example.com" />
            <Input label="Renewal Date" value={form.renewal_date} onChange={v => set("renewal_date", v)} type="date" />
            <Input label="Client Email (for domain alerts)" value={form.client_email} onChange={v => set("client_email", v)} type="email" />
            <Input label="GitHub Repository URL" value={form.github_url} onChange={v => set("github_url", v)} placeholder="https://github.com/..." />
            <Input label="Vercel Preview URL" value={form.preview_url} onChange={v => set("preview_url", v)} placeholder="https://..." />
            <Input label="Live Website URL" value={form.live_url} onChange={v => set("live_url", v)} placeholder="https://..." />
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onCancel} style={{ background: "#f3f4f6", color: "#374151", border: "1px solid #d1d5db", borderRadius: 10, padding: "11px 22px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
          <button onClick={handleSubmit} style={{ background: PRIMARY, color: "#fff", border: "none", borderRadius: 10, padding: "11px 26px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Create Project →</button>
        </div>
      </div>
    </div>
  );
}

// ─── FINANCE PAGE ─────────────────────────────────────────────────────────────
function FinancePage({ projects }) {
  const totals = useMemo(() => {
    let revenue = 0, expenses = 0, profit = 0, pending = 0;
    projects.forEach(p => {
      const f = calcFinancials(p);
      revenue += (p.advance_received || 0) + (p.final_payment_received || 0);
      expenses += f.expenses;
      profit += f.profit;
      pending += f.pending;
    });
    return { revenue, expenses, profit, pending };
  }, [projects]);

  return (
    <div style={{ padding: 24, maxWidth: 1100 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: "#111827", margin: "0 0 6px" }}>Finance</h1>
      <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 24px" }}>Financial overview across all projects</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 28 }}>
        <StatCard label="Total Revenue" value={fmtCurrency(totals.revenue)} icon="💳" color="#8b5cf6" />
        <StatCard label="Total Expenses" value={fmtCurrency(totals.expenses)} icon="📉" color="#ef4444" />
        <StatCard label="Total Profit" value={fmtCurrency(totals.profit)} icon="📈" color="#22c55e" />
        <StatCard label="Pending Payments" value={fmtCurrency(totals.pending)} icon="⏳" color="#f59e0b" />
      </div>

      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
              {["Client", "Plan", "Project Value", "Received", "Pending", "Expenses", "Profit", "Status"].map(h => (
                <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6b7280", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projects.map((p, i) => {
              const f = calcFinancials(p);
              return (
                <tr key={p.id} style={{ borderBottom: "1px solid #f3f4f6", background: i % 2 ? "#fafafa" : "#fff" }}>
                  <td style={{ padding: "12px 14px", fontSize: 13, fontWeight: 600, color: "#111827" }}>{p.company_name}</td>
                  <td style={{ padding: "12px 14px", fontSize: 13, color: "#6b7280" }}>{p.plan}</td>
                  <td style={{ padding: "12px 14px", fontSize: 13, color: "#374151" }}>{fmtCurrency(p.project_value)}</td>
                  <td style={{ padding: "12px 14px", fontSize: 13, color: "#22c55e", fontWeight: 600 }}>{fmtCurrency(f.received)}</td>
                  <td style={{ padding: "12px 14px", fontSize: 13, color: f.pending > 0 ? "#f59e0b" : "#22c55e", fontWeight: 600 }}>{fmtCurrency(f.pending)}</td>
                  <td style={{ padding: "12px 14px", fontSize: 13, color: "#ef4444" }}>{fmtCurrency(f.expenses)}</td>
                  <td style={{ padding: "12px 14px", fontSize: 13, color: f.profit >= 0 ? "#22c55e" : "#ef4444", fontWeight: 700 }}>{fmtCurrency(f.profit)}</td>
                  <td style={{ padding: "12px 14px" }}><Badge label={p.status} color={statusColor(p.status)} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── DOMAINS PAGE ─────────────────────────────────────────────────────────────
function DomainsPage({ projects }) {
  const domains = projects.filter(p => p.domain_name);

  return (
    <div style={{ padding: 24, maxWidth: 900 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: "#111827", margin: "0 0 6px" }}>Domain Renewals</h1>
      <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 24px" }}>Track and manage domain renewal dates. Reminder emails are sent at 30, 7, 5, and 1 day(s) before renewal.</p>

      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
              {["Domain", "Client", "Client Email", "Renewal Date", "Days Left", "Status"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6b7280" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {domains.sort((a, b) => new Date(a.renewal_date) - new Date(b.renewal_date)).map((p, i) => {
              const days = daysUntil(p.renewal_date);
              const urgent = days <= 7 && days > 0;
              const warning = days <= 30 && days > 7;
              const expired = days <= 0;
              const color = expired ? "#ef4444" : urgent ? "#ef4444" : warning ? "#f59e0b" : "#22c55e";
              return (
                <tr key={p.id} style={{ borderBottom: "1px solid #f3f4f6", background: i % 2 ? "#fafafa" : "#fff" }}>
                  <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 600, color: "#111827" }}>🌐 {p.domain_name}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#374151" }}>{p.company_name}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#6b7280" }}>{p.client_email || "—"}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#374151" }}>{fmtDate(p.renewal_date)}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 700, color }}>{expired ? "Expired" : `${days} day${days !== 1 ? "s" : ""}`}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <Badge label={expired ? "Expired" : urgent ? "Urgent" : warning ? "Warning" : "OK"} color={color} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 12, padding: 16, marginTop: 20 }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, color: "#0369a1", margin: "0 0 8px" }}>📧 Email Automation (Resend)</h4>
        <p style={{ fontSize: 13, color: "#0369a1", margin: 0 }}>
          Reminder emails are automatically sent to the client and <strong>madeworkspot@gmail.com</strong> at 30, 7, 5, and 1 day(s) before domain renewal. Powered by Resend + Vercel Cron Jobs.
        </p>
      </div>
    </div>
  );
}

// ─── EMPLOYEE UPDATE PAGE ─────────────────────────────────────────────────────
function EmployeeUpdatePage({ project, onSubmit }) {
  const [note, setNote] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [checklist, setChecklist] = useState(project.checklist);

  const toggleTask = (cat, task) => {
    setChecklist(c => ({ ...c, [cat]: { ...c[cat], [task]: !c[cat][task] } }));
  };

  const pct = calcProgress(checklist);

  const handleSubmit = () => {
    if (!name.trim() || !note.trim()) { alert("Please enter your name and a progress note."); return; }
    onSubmit({ name, note, checklist });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: "#f0f9ff", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 60, marginBottom: 16 }}>✅</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>Update Submitted!</h2>
          <p style={{ color: "#6b7280" }}>Your progress has been saved successfully.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: 24 }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ background: PRIMARY, color: "#fff", borderRadius: 12, padding: "8px 20px", display: "inline-block", fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Employee Update Form</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#111827", margin: "0 0 4px" }}>{project.company_name}</h1>
          <p style={{ color: "#6b7280", fontSize: 14 }}>{project.plan} · Assigned to {project.assigned_to}</p>
        </div>

        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", padding: 24, marginBottom: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <CircleProgress pct={pct} size={100} stroke={8} />
          <p style={{ color: "#6b7280", fontSize: 13, margin: 0 }}>Overall Project Progress</p>
        </div>

        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", padding: 24, marginBottom: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 14 }}>Update Checklist</h3>
          {Object.entries(checklist).map(([cat, tasks]) => (
            <div key={cat} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#6b7280", marginBottom: 8 }}>{cat}</div>
              {Object.entries(tasks).map(([task, done]) => (
                <label key={task} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", marginBottom: 6 }}>
                  <input type="checkbox" checked={done} onChange={() => toggleTask(cat, task)}
                    style={{ width: 16, height: 16, accentColor: PRIMARY }} />
                  <span style={{ fontSize: 14, color: done ? "#9ca3af" : "#374151", textDecoration: done ? "line-through" : "none" }}>{task}</span>
                </label>
              ))}
            </div>
          ))}
        </div>

        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", padding: 24, marginBottom: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 14 }}>Submit Progress Update</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Input label="Your Name" value={name} onChange={setName} placeholder="Enter your name" />
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>Progress Note <span style={{ color: "#ef4444" }}>*</span></label>
              <textarea value={note} onChange={e => setNote(e.target.value)} rows={4} placeholder="Describe what you've done today..."
                style={{ border: "1px solid #d1d5db", borderRadius: 8, padding: "8px 12px", fontSize: 14, color: "#111827", resize: "vertical", fontFamily: "inherit" }} />
            </div>
            <button onClick={handleSubmit} style={{ background: PRIMARY, color: "#fff", border: "none", borderRadius: 10, padding: "12px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
              Submit Update →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [collapsed, setCollapsed] = useState(false);

  const selectedProject = projects.find(p => p.id === selectedProjectId);
  const sideW = collapsed ? 64 : 230;

  const updateProject = (updated) => {
    setProjects(ps => ps.map(p => p.id === updated.id ? updated : p));
  };

  const addProject = (newP) => {
    setProjects(ps => [...ps, newP]);
    setSelectedProjectId(newP.id);
    setPage("project");
  };

  const handleEmployeeSubmit = ({ name, note, checklist }) => {
    if (!selectedProject) return;
    const updated = {
      ...selectedProject,
      checklist,
      updates: [...selectedProject.updates, {
        id: "u" + Date.now(), employee_name: name, note,
        created_at: new Date().toISOString()
      }],
      updated_at: new Date().toISOString()
    };
    updateProject(updated);
  };

  if (!loggedIn) return <LoginPage onLogin={() => setLoggedIn(true)} />;

  // Employee update page (no sidebar)
  if (page === "employee-update" && selectedProject) {
    return <EmployeeUpdatePage project={selectedProject} onSubmit={handleEmployeeSubmit} />;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc", fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif" }}>
      <Sidebar page={page} setPage={(p) => { setPage(p); if (p !== "project") setSelectedProjectId(null); }} collapsed={collapsed} setCollapsed={setCollapsed} />

      <main style={{ marginLeft: sideW, flex: 1, minHeight: "100vh", transition: "margin-left 0.25s ease", overflowX: "hidden" }}>
        {page === "dashboard" && (
          <Dashboard projects={projects} setPage={(p) => setPage(p)} setSelectedProject={setSelectedProjectId} />
        )}
        {page === "projects" && (
          <ProjectList projects={projects} setPage={setPage} setSelectedProject={setSelectedProjectId} />
        )}
        {page === "project" && selectedProject && (
          <ProjectDetail
            project={selectedProject}
            onUpdate={updateProject}
            onBack={() => setPage("projects")}
          />
        )}
        {page === "finance" && <FinancePage projects={projects} />}
        {page === "domains" && <DomainsPage projects={projects} />}
        {page === "new-project" && (
          <NewProjectForm onSave={addProject} onCancel={() => setPage("projects")} />
        )}
      </main>
    </div>
  );
}
