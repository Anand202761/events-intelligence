import { useState, useEffect } from "react";

// ── Change this to your GitHub raw URL after you push ──────────────────────
const EVENTS_JSON_URL =
  "https://raw.githubusercontent.com/Anand202761/events-intelligence/main/data/events.json";
// ───────────────────────────────────────────────────────────────────────────

const TRACKED_SITES = [
  { name: "IISc Bangalore",  url: "https://iisc.ac.in" },
  { name: "IISER Pune",      url: "https://iiserpune.ac.in" },
  { name: "IISER Kolkata",   url: "https://iiserkol.ac.in" },
  { name: "IISER Bhopal",    url: "https://iiserb.ac.in" },
  { name: "IISER Mohali",    url: "https://iisermohali.ac.in" },
  { name: "IIT Madras",      url: "https://iitm.ac.in" },
  { name: "IIT Bombay",      url: "https://iitb.ac.in" },
  { name: "IIT Delhi",       url: "https://iitd.ac.in" },
  { name: "IIT Kanpur",      url: "https://iitk.ac.in" },
  { name: "IIT Kharagpur",   url: "https://iitkgp.ac.in" },
];

const TYPE_COLORS = {
  INTERN:   { bg: "#d4f7e0", text: "#1a7a45" },
  WORKSHOP: { bg: "#fde8c8", text: "#b05a00" },
  CONF:     { bg: "#dce8ff", text: "#1a3d8a" },
  PAPER:    { bg: "#f5d6ff", text: "#7a1aaa" },
  WEBINAR:  { bg: "#d6f0ff", text: "#006b99" },
  HACK:     { bg: "#ffe0e0", text: "#a00000" },
  REP:      { bg: "#e8f5e9", text: "#2e7d32" },
  SEMINAR:  { bg: "#fff9c4", text: "#7a6500" },
};

const QUOTES = [
  "Science is the poetry of reality.",
  "Biology is the study of complicated things that give the appearance of having been designed.",
  "The science of today is the technology of tomorrow.",
  "In every walk with nature, one receives far more than he seeks.",
];

const FILTERS = [
  "all", "internship", "workshop", "conference",
  "webinar", "seminar", "hackathon", "paper presentation", "research exposure",
];

/* ─── tiny helper ─── */
function daysUntil(dateStr) {
  if (!dateStr) return null;
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / 86400000);
}

/* ════════════════════════════════════════════
   APP
════════════════════════════════════════════ */
export default function App() {
  const [page, setPage]         = useState("home");
  const [events, setEvents]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [filter, setFilter]     = useState("all");
  const [search, setSearch]     = useState("");
  const [visible, setVisible]   = useState(false);
  const [quote]                  = useState(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  const [lastScan, setLastScan] = useState("—");

  /* fetch events.json */
  useEffect(() => {
    fetch(EVENTS_JSON_URL)
      .then(r => { if (!r.ok) throw new Error("Fetch failed"); return r.json(); })
      .then(data => {
        setEvents(data);
        if (data.length > 0 && data[0].scanned_at) {
          const d = new Date(data[0].scanned_at);
          setLastScan(d.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) + " IST");
        }
        setLoading(false);
        setTimeout(() => setVisible(true), 80);
      })
      .catch(e => { setError(e.message); setLoading(false); setTimeout(() => setVisible(true), 80); });
  }, []);

  /* derived */
  const filtered = events.filter(e => {
    const matchF = filter === "all" || e.category === filter;
    const matchS = e.title.toLowerCase().includes(search.toLowerCase()) ||
                   e.institute.toLowerCase().includes(search.toLowerCase());
    return matchF && matchS;
  });

  const urgentEvents = events.filter(e => {
    const d = daysUntil(e.lastDay);
    return d !== null && d <= 7 && d >= 0;
  });

  /* ── styles ── */
  const S = {
    app: {
      minHeight: "100vh",
      background: "linear-gradient(135deg,#0a0f1e 0%,#0d1b2a 50%,#0a1628 100%)",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      color: "#e8f4f8",
      opacity: visible ? 1 : 0,
      transition: "opacity 0.5s ease",
    },
    sidebar: {
      position: "fixed", left: 0, top: 0,
      width: "64px", height: "100vh",
      background: "rgba(255,255,255,0.04)",
      borderRight: "1px solid rgba(255,255,255,0.08)",
      display: "flex", flexDirection: "column",
      alignItems: "center", paddingTop: "24px",
      gap: "8px", zIndex: 100, backdropFilter: "blur(10px)",
    },
    sBtn: (active) => ({
      width: "44px", height: "44px", borderRadius: "12px",
      border: "none", cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "20px",
      background: active ? "rgba(100,200,255,0.2)" : "transparent",
      boxShadow: active ? "0 0 0 1px rgba(100,200,255,0.4)" : "none",
      transition: "all 0.2s",
    }),
    main: { marginLeft: "64px", padding: "32px 36px" },
    eyebrow: {
      fontSize: "11px", letterSpacing: "4px",
      textTransform: "uppercase", color: "rgba(100,200,255,0.7)",
      marginBottom: "6px",
    },
    greeting: {
      fontSize: "30px", fontWeight: "700",
      background: "linear-gradient(90deg,#ffffff,#64c8ff)",
      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
      marginBottom: "6px",
    },
    quoteText: { fontSize: "13px", color: "rgba(255,255,255,0.38)", fontStyle: "italic" },
    grid: {
      display: "grid", gridTemplateColumns: "repeat(4,1fr)",
      gap: "16px", margin: "28px 0 36px",
    },
    card: (accent) => ({
      background: "rgba(255,255,255,0.04)",
      border: `1px solid ${accent}33`, borderRadius: "16px",
      padding: "20px", cursor: "pointer",
      transition: "transform 0.15s, box-shadow 0.15s",
      position: "relative", overflow: "hidden",
    }),
    cardLine: (accent) => ({
      position: "absolute", top: 0, left: 0, right: 0,
      height: "2px", background: accent,
    }),
    cardNum: (color) => ({
      fontSize: "36px", fontWeight: "700",
      lineHeight: 1, marginBottom: "6px", color,
    }),
    cardLabel: {
      fontSize: "11px", letterSpacing: "2px",
      textTransform: "uppercase", color: "rgba(255,255,255,0.4)",
    },
    sectionLabel: {
      fontSize: "11px", letterSpacing: "4px",
      textTransform: "uppercase", color: "rgba(100,200,255,0.6)",
      marginBottom: "14px",
    },
    eCard: (urgent) => ({
      background: "rgba(255,255,255,0.03)",
      border: `1px solid ${urgent ? "rgba(255,100,100,0.3)" : "rgba(255,255,255,0.07)"}`,
      borderRadius: "14px", padding: "16px 20px",
      marginBottom: "10px", display: "flex",
      alignItems: "center", justifyContent: "space-between",
      cursor: "pointer", transition: "background 0.15s",
    }),
    eTitle: { fontSize: "14px", fontWeight: "600", marginBottom: "4px" },
    eInst:  { fontSize: "11px", color: "rgba(255,255,255,0.4)", letterSpacing: "1px" },
    tag: (type) => ({
      padding: "3px 10px", borderRadius: "6px",
      fontSize: "10px", fontWeight: "700", letterSpacing: "1px",
      background: TYPE_COLORS[type]?.bg || "#eee",
      color:      TYPE_COLORS[type]?.text || "#333",
      whiteSpace: "nowrap",
    }),
    deadline: (d) => ({
      fontSize: "11px", padding: "4px 10px", borderRadius: "8px",
      background: d <= 7 ? "rgba(255,80,80,0.15)" : "rgba(255,255,255,0.07)",
      color:      d <= 7 ? "#ff6464" : "rgba(255,255,255,0.4)",
      whiteSpace: "nowrap",
    }),
    pageTitle: { fontSize: "24px", fontWeight: "700", marginBottom: "4px" },
    pageSub:   { fontSize: "12px", color: "rgba(255,255,255,0.3)", marginBottom: "26px", letterSpacing: "1px" },
    searchBox: {
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "10px", padding: "10px 16px",
      color: "#fff", fontSize: "13px", width: "280px",
      outline: "none", marginBottom: "16px", display: "block",
    },
    filterRow: { display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" },
    fBtn: (active) => ({
      padding: "6px 14px", borderRadius: "20px",
      border: active ? "1px solid rgba(100,200,255,0.6)" : "1px solid rgba(255,255,255,0.1)",
      background: active ? "rgba(100,200,255,0.15)" : "transparent",
      color: active ? "#64c8ff" : "rgba(255,255,255,0.5)",
      fontSize: "11px", letterSpacing: "1px",
      cursor: "pointer", textTransform: "uppercase", transition: "all 0.15s",
    }),
    siteRow: {
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: "12px", padding: "14px 20px",
      marginBottom: "8px", display: "flex",
      alignItems: "center", justifyContent: "space-between",
    },
    dot: {
      width: "6px", height: "6px", borderRadius: "50%",
      background: "#4cff9f", marginRight: "12px",
      boxShadow: "0 0 6px #4cff9f", display: "inline-block",
    },
  };

  /* ── loading / error ── */
  if (loading) return (
    <div style={{ ...S.app, display: "flex", alignItems: "center", justifyContent: "center", opacity: 1 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "40px", marginBottom: "16px" }}>🧬</div>
        <div style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "3px", fontSize: "12px" }}>LOADING EVENTS…</div>
      </div>
    </div>
  );

  /* ═══════════════ RENDER ═══════════════ */
  return (
    <div style={S.app}>

      {/* SIDEBAR */}
      <div style={S.sidebar}>
        <span style={{ fontSize: "22px", marginBottom: "12px" }}>🧬</span>
        <button style={S.sBtn(page === "home")}   onClick={() => setPage("home")}   title="Home">🏠</button>
        <button style={S.sBtn(page === "events")} onClick={() => setPage("events")} title="Events">📅</button>
        <button style={S.sBtn(page === "sites")}  onClick={() => setPage("sites")}  title="Sites Tracked">🌐</button>
      </div>

      <div style={S.main}>

        {/* ══ HOME ══ */}
        {page === "home" && (
          <>
            <div style={S.eyebrow}>Events Intelligence System · Biotechnology</div>
            <div style={S.greeting}>Welcome, Anand 👋</div>
            <div style={S.quoteText}>"{quote}"</div>

            {error && (
              <div style={{ margin: "16px 0", padding: "12px 16px", borderRadius: "10px",
                background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.3)",
                fontSize: "13px", color: "#ff8080" }}>
                ⚠ Could not load live events — showing cached/empty data.<br/>
                <span style={{ fontSize: "11px", opacity: 0.6 }}>{error}</span>
              </div>
            )}

            <div style={S.grid}>
              <div style={S.card("#64c8ff")} onClick={() => setPage("events")}>
                <div style={S.cardLine("#64c8ff")} />
                <div style={S.cardNum("#64c8ff")}>{events.length}</div>
                <div style={S.cardLabel}>Total Events</div>
              </div>
              <div style={S.card("#4cff9f")} onClick={() => setPage("sites")}>
                <div style={S.cardLine("#4cff9f")} />
                <div style={S.cardNum("#4cff9f")}>{TRACKED_SITES.length}</div>
                <div style={S.cardLabel}>Sites Tracked</div>
              </div>
              <div style={S.card("#ff9f64")} onClick={() => setPage("events")}>
                <div style={S.cardLine("#ff9f64")} />
                <div style={S.cardNum("#ff9f64")}>{urgentEvents.length}</div>
                <div style={S.cardLabel}>Urgent · ≤ 7 days</div>
              </div>
              <div style={S.card("#c864ff")}>
                <div style={S.cardLine("#c864ff")} />
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", marginBottom: "4px" }}>Last Scan</div>
                <div style={{ fontSize: "13px", fontWeight: "600", color: "#c864ff" }}>{lastScan}</div>
                <div style={S.cardLabel}>GitHub Actions</div>
              </div>
            </div>

            {urgentEvents.length > 0 && (
              <>
                <div style={S.sectionLabel}>⚡ Urgent — Closing Soon</div>
                {urgentEvents.map((e, i) => {
                  const d = daysUntil(e.lastDay);
                  return (
                    <div key={i} style={S.eCard(true)} onClick={() => window.open(e.url, "_blank")}>
                      <div>
                        <div style={S.eTitle}>{e.title}</div>
                        <span style={S.eInst}>{e.institute}</span>
                      </div>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <span style={S.tag(e.type)}>{e.type}</span>
                        {d !== null && <span style={S.deadline(d)}>{d}d left</span>}
                        <span>↗</span>
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {urgentEvents.length === 0 && events.length > 0 && (
              <div style={S.sectionLabel}>✅ No urgent deadlines right now</div>
            )}
          </>
        )}

        {/* ══ EVENTS ══ */}
        {page === "events" && (
          <>
            <div style={S.pageTitle}>📅 Active Events</div>
            <div style={S.pageSub}>BIOTECHNOLOGY · {filtered.length} RESULTS</div>

            <input
              style={S.searchBox}
              placeholder="🔍  Search events or institutes…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

            <div style={S.filterRow}>
              {FILTERS.map(f => (
                <button key={f} style={S.fBtn(filter === f)} onClick={() => setFilter(f)}>{f}</button>
              ))}
            </div>

            {filtered.length === 0 && (
              <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "14px", marginTop: "32px" }}>
                No events match your search.
              </div>
            )}

            {filtered.map((e, i) => {
              const d = daysUntil(e.lastDay);
              return (
                <div key={i} style={S.eCard(d !== null && d <= 7)}
                  onClick={() => window.open(e.url, "_blank")}>
                  <div style={{ flex: 1 }}>
                    <div style={S.eTitle}>{e.title}</div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "4px" }}>
                      <span style={S.eInst}>{e.institute}</span>
                      {e.lastDay && (
                        <>
                          <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "11px" }}>·</span>
                          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>
                            Last day: {e.lastDay}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <span style={S.tag(e.type)}>{e.type}</span>
                    {d !== null && <span style={S.deadline(d)}>{d}d left</span>}
                    <span style={{ fontSize: "16px", color: "rgba(255,255,255,0.4)" }}>↗</span>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* ══ SITES ══ */}
        {page === "sites" && (
          <>
            <div style={S.pageTitle}>🌐 Sites Tracked</div>
            <div style={S.pageSub}>SCANNING DAILY VIA GITHUB ACTIONS · {TRACKED_SITES.length} SITES</div>

            {TRACKED_SITES.map((site, i) => (
              <div key={i} style={S.siteRow}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span style={S.dot} />
                  <div>
                    <div style={{ fontSize: "14px" }}>{site.name}</div>
                    <div style={{ fontSize: "11px", color: "rgba(100,200,255,0.5)" }}>{site.url}</div>
                  </div>
                </div>
                <button
                  onClick={() => window.open(site.url, "_blank")}
                  style={{ background: "rgba(100,200,255,0.1)", border: "1px solid rgba(100,200,255,0.2)",
                    color: "#64c8ff", borderRadius: "8px", padding: "5px 12px",
                    fontSize: "11px", cursor: "pointer" }}>
                  Visit ↗
                </button>
              </div>
            ))}
          </>
        )}

      </div>
    </div>
  );
}
