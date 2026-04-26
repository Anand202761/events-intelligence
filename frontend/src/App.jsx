import { useState, useEffect, useRef } from "react";

const EVENTS_JSON_URL =
  "https://raw.githubusercontent.com/Anand202761/events-intelligence/main/data/events.json";

const TRACKED_SITES = [
  { name: "IISc Bangalore",   url: "https://iisc.ac.in" },
  { name: "IISc Events",      url: "https://iisc.ac.in/events/" },
  { name: "IISc MRDG",        url: "https://mrdg.iisc.ac.in/" },
  { name: "IISER Pune",       url: "https://iiserpune.ac.in" },
  { name: "IISER Pune Bio",   url: "https://www.iiserpune.ac.in/research/department/biology" },
  { name: "IISER Kolkata",    url: "https://iiserkol.ac.in" },
  { name: "IISER Bhopal",     url: "https://iiserb.ac.in" },
  { name: "IISER Mohali",     url: "https://iisermohali.ac.in" },
  { name: "IIT Madras",       url: "https://iitm.ac.in" },
  { name: "IIT Madras BT",    url: "https://biotech.iitm.ac.in/" },
  { name: "IIT Bombay Bio",   url: "https://www.bio.iitb.ac.in/" },
  { name: "IIT Delhi DBEB",   url: "https://dbeb.iitd.ac.in/" },
  { name: "IIT Kanpur BSBE",  url: "https://www.iitk.ac.in/bsbe/" },
  { name: "IIT KGP BioTech",  url: "https://www.iitkgp.ac.in/department/BT" },
  { name: "NCBS Bangalore",   url: "https://www.ncbs.res.in/" },
  { name: "InStem",           url: "https://www.instem.res.in/" },
];

const TYPE_META = {
  INTERN:   { color: "#00e5a0", bg: "rgba(0,229,160,0.12)", label: "Internship" },
  WORKSHOP: { color: "#ff9f43", bg: "rgba(255,159,67,0.12)", label: "Workshop" },
  CONF:     { color: "#54a0ff", bg: "rgba(84,160,255,0.12)", label: "Conference" },
  PAPER:    { color: "#cd84ff", bg: "rgba(205,132,255,0.12)", label: "Paper" },
  WEBINAR:  { color: "#48dbfb", bg: "rgba(72,219,251,0.12)", label: "Webinar" },
  HACK:     { color: "#ff6b6b", bg: "rgba(255,107,107,0.12)", label: "Hackathon" },
  REP:      { color: "#1dd1a1", bg: "rgba(29,209,161,0.12)", label: "Research" },
  SEMINAR:  { color: "#feca57", bg: "rgba(254,202,87,0.12)", label: "Seminar" },
};

const FILTERS = ["all","internship","workshop","conference","webinar","seminar","hackathon","paper presentation","research exposure"];
const QUOTES  = [
  "Science is the poetry of reality.",
  "The science of today is the technology of tomorrow.",
  "Biology is the study of life's most beautiful complexity.",
  "In every living cell lies an entire universe waiting to be explored.",
];

function daysUntil(d) {
  if (!d) return null;
  return Math.ceil((new Date(d) - new Date()) / 86400000);
}

/* ══════════════════════════════════════
   ANIMATED DNA BACKGROUND (canvas)
══════════════════════════════════════ */
function DNACanvas() {
  const ref = useRef();
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let frame, t = 0;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.4 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.008;

      // Floating particles
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 210, 150, ${p.alpha})`;
        ctx.fill();
      });

      // DNA helix strands on right side
      const hx = canvas.width - 80;
      for (let i = 0; i < 40; i++) {
        const y = (i / 40) * canvas.height;
        const wave = Math.sin(t + i * 0.4) * 30;

        // Strand 1
        ctx.beginPath();
        ctx.arc(hx + wave, y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,229,160,${0.15 + Math.abs(Math.sin(t + i * 0.4)) * 0.2})`;
        ctx.fill();

        // Strand 2
        ctx.beginPath();
        ctx.arc(hx - wave, y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(84,160,255,${0.15 + Math.abs(Math.cos(t + i * 0.4)) * 0.2})`;
        ctx.fill();

        // Rungs
        if (i % 3 === 0) {
          ctx.beginPath();
          ctx.moveTo(hx + wave, y);
          ctx.lineTo(hx - wave, y);
          ctx.strokeStyle = `rgba(150,150,255,0.08)`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      frame = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none" }} />;
}

/* ══════════════════════════════════════
   MAIN APP
══════════════════════════════════════ */
export default function App() {
  const [page, setPage]       = useState("home");
  const [events, setEvents]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("all");
  const [search, setSearch]   = useState("");
  const [mounted, setMounted] = useState(false);
  const [lastScan, setLastScan] = useState("—");
  const [quote] = useState(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredEvent, setHoveredEvent] = useState(null);

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
    fetch(EVENTS_JSON_URL)
      .then(r => r.json())
      .then(data => {
        setEvents(data);
        if (data[0]?.scanned_at) {
          setLastScan(new Date(data[0].scanned_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) + " IST");
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = events.filter(e =>
    (filter === "all" || e.category === filter) &&
    (e.title.toLowerCase().includes(search.toLowerCase()) || e.institute.toLowerCase().includes(search.toLowerCase()))
  );
  const urgent = events.filter(e => { const d = daysUntil(e.lastDay); return d !== null && d <= 7 && d >= 0; });

  /* ── inject global styles ── */
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      body { background: #020b14; overflow-x: hidden; }
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: rgba(0,229,160,0.3); border-radius: 2px; }

      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(24px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes pulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(0,229,160,0.4); }
        50%       { box-shadow: 0 0 0 8px rgba(0,229,160,0); }
      }
      @keyframes shimmer {
        0%   { background-position: -200% center; }
        100% { background-position: 200% center; }
      }
      @keyframes spin {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50%       { transform: translateY(-6px); }
      }
      .fade-up { animation: fadeUp 0.5s ease both; }
      .card-3d {
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        transform-style: preserve-3d;
      }
      .card-3d:hover {
        transform: translateY(-4px) rotateX(2deg);
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const css = {
    app: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #020b14 0%, #05111f 40%, #020d1a 100%)",
      fontFamily: "'Space Grotesk', sans-serif",
      color: "#e2f0ff",
      position: "relative",
      opacity: mounted ? 1 : 0,
      transition: "opacity 0.6s",
    },

    /* ─ sidebar ─ */
    sidebar: {
      position: "fixed", left: 0, top: 0,
      width: "72px", height: "100vh", zIndex: 50,
      display: "flex", flexDirection: "column",
      alignItems: "center", paddingTop: "28px", gap: "6px",
      background: "rgba(2,11,20,0.8)",
      borderRight: "1px solid rgba(0,229,160,0.08)",
      backdropFilter: "blur(20px)",
    },
    logo: {
      fontSize: "26px", marginBottom: "20px",
      animation: "float 3s ease-in-out infinite",
    },
    navBtn: (active) => ({
      width: "46px", height: "46px", borderRadius: "14px",
      border: active ? "1px solid rgba(0,229,160,0.5)" : "1px solid transparent",
      background: active
        ? "linear-gradient(135deg, rgba(0,229,160,0.15), rgba(0,229,160,0.05))"
        : "transparent",
      boxShadow: active ? "0 0 20px rgba(0,229,160,0.15), inset 0 1px 0 rgba(255,255,255,0.05)" : "none",
      cursor: "pointer", fontSize: "20px",
      display: "flex", alignItems: "center", justifyContent: "center",
      transition: "all 0.2s ease",
      transform: active ? "scale(1.05)" : "scale(1)",
    }),

    /* ─ main ─ */
    main: {
      marginLeft: "72px",
      padding: "40px 40px 60px",
      maxWidth: "1100px",
      position: "relative", zIndex: 1,
    },

    /* ─ header ─ */
    eyebrow: {
      fontSize: "10px", letterSpacing: "5px",
      textTransform: "uppercase",
      color: "rgba(0,229,160,0.6)", marginBottom: "10px",
      fontFamily: "'JetBrains Mono', monospace",
    },
    greeting: {
      fontSize: "38px", fontWeight: "700", lineHeight: 1.1,
      background: "linear-gradient(135deg, #ffffff 0%, #00e5a0 50%, #54a0ff 100%)",
      backgroundSize: "200% auto",
      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
      animation: "shimmer 4s linear infinite",
      marginBottom: "8px",
    },
    quote: {
      fontSize: "13px", color: "rgba(255,255,255,0.3)",
      fontStyle: "italic", lineHeight: 1.5,
    },

    /* ─ stat cards ─ */
    grid: {
      display: "grid", gridTemplateColumns: "repeat(4,1fr)",
      gap: "16px", margin: "32px 0 40px",
    },
    statCard: (accent, isHovered) => ({
      background: isHovered
        ? `linear-gradient(135deg, rgba(${accent},0.12), rgba(${accent},0.04))`
        : "rgba(255,255,255,0.025)",
      border: `1px solid rgba(${accent},${isHovered ? 0.4 : 0.15})`,
      borderRadius: "20px", padding: "24px",
      cursor: "pointer",
      position: "relative", overflow: "hidden",
      transition: "all 0.25s ease",
      transform: isHovered ? "translateY(-6px) scale(1.02)" : "translateY(0) scale(1)",
      boxShadow: isHovered
        ? `0 20px 40px rgba(${accent},0.15), 0 0 0 1px rgba(${accent},0.2), inset 0 1px 0 rgba(255,255,255,0.05)`
        : "0 4px 20px rgba(0,0,0,0.3)",
    }),
    statGlow: (accent) => ({
      position: "absolute", top: "-30px", right: "-30px",
      width: "100px", height: "100px", borderRadius: "50%",
      background: `radial-gradient(circle, rgba(${accent},0.15) 0%, transparent 70%)`,
      pointerEvents: "none",
    }),
    statNum: (color) => ({
      fontSize: "42px", fontWeight: "700", lineHeight: 1,
      color, marginBottom: "8px",
      fontFamily: "'JetBrains Mono', monospace",
      textShadow: `0 0 30px ${color}44`,
    }),
    statLabel: {
      fontSize: "10px", letterSpacing: "3px",
      textTransform: "uppercase", color: "rgba(255,255,255,0.35)",
      fontFamily: "'JetBrains Mono', monospace",
    },

    /* ─ section label ─ */
    sectionLabel: {
      fontSize: "10px", letterSpacing: "4px",
      textTransform: "uppercase",
      color: "rgba(0,229,160,0.5)",
      marginBottom: "16px",
      fontFamily: "'JetBrains Mono', monospace",
      display: "flex", alignItems: "center", gap: "10px",
    },
    sectionLine: {
      flex: 1, height: "1px",
      background: "linear-gradient(90deg, rgba(0,229,160,0.3), transparent)",
    },

    /* ─ event cards ─ */
    eventCard: (urgent, hovered) => ({
      background: hovered
        ? "rgba(255,255,255,0.05)"
        : "rgba(255,255,255,0.02)",
      border: `1px solid ${urgent ? "rgba(255,107,107,0.3)" : hovered ? "rgba(0,229,160,0.25)" : "rgba(255,255,255,0.06)"}`,
      borderRadius: "16px", padding: "18px 22px",
      marginBottom: "10px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      cursor: "pointer",
      transition: "all 0.2s ease",
      transform: hovered ? "translateX(4px)" : "translateX(0)",
      boxShadow: hovered ? "0 8px 32px rgba(0,0,0,0.3), -3px 0 0 rgba(0,229,160,0.4)" : "none",
      position: "relative",
    }),
    eventTitle: {
      fontSize: "14px", fontWeight: "500",
      color: "#e2f0ff", marginBottom: "5px", lineHeight: 1.3,
    },
    eventMeta: {
      fontSize: "11px", color: "rgba(255,255,255,0.35)",
      fontFamily: "'JetBrains Mono', monospace",
      display: "flex", alignItems: "center", gap: "8px",
    },

    /* ─ tags ─ */
    typeTag: (type) => ({
      padding: "4px 10px", borderRadius: "8px",
      fontSize: "10px", fontWeight: "600", letterSpacing: "1px",
      background: TYPE_META[type]?.bg || "rgba(255,255,255,0.1)",
      color: TYPE_META[type]?.color || "#fff",
      border: `1px solid ${TYPE_META[type]?.color || "#fff"}33`,
      whiteSpace: "nowrap",
      textTransform: "uppercase",
      fontFamily: "'JetBrains Mono', monospace",
    }),
    deadlineTag: (d) => ({
      padding: "4px 10px", borderRadius: "8px",
      fontSize: "10px", fontWeight: "600", letterSpacing: "1px",
      background: d <= 3 ? "rgba(255,107,107,0.15)" : d <= 7 ? "rgba(255,159,67,0.15)" : "rgba(255,255,255,0.05)",
      color: d <= 3 ? "#ff6b6b" : d <= 7 ? "#ff9f43" : "rgba(255,255,255,0.35)",
      border: `1px solid ${d <= 3 ? "rgba(255,107,107,0.3)" : d <= 7 ? "rgba(255,159,67,0.3)" : "transparent"}`,
      whiteSpace: "nowrap",
      fontFamily: "'JetBrains Mono', monospace",
    }),

    /* ─ search ─ */
    searchWrap: {
      position: "relative", display: "inline-block",
      marginBottom: "20px",
    },
    searchInput: {
      width: "320px", padding: "12px 18px 12px 44px",
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "14px", color: "#e2f0ff",
      fontSize: "13px", outline: "none",
      fontFamily: "'Space Grotesk', sans-serif",
      transition: "all 0.2s",
    },
    searchIcon: {
      position: "absolute", left: "16px", top: "50%",
      transform: "translateY(-50%)",
      color: "rgba(255,255,255,0.25)", fontSize: "14px",
      pointerEvents: "none",
    },

    /* ─ filter pills ─ */
    filterRow: { display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" },
    filterPill: (active) => ({
      padding: "7px 16px", borderRadius: "50px",
      border: active ? "1px solid rgba(0,229,160,0.6)" : "1px solid rgba(255,255,255,0.08)",
      background: active
        ? "linear-gradient(135deg, rgba(0,229,160,0.2), rgba(0,229,160,0.05))"
        : "rgba(255,255,255,0.03)",
      color: active ? "#00e5a0" : "rgba(255,255,255,0.4)",
      fontSize: "11px", letterSpacing: "1.5px",
      cursor: "pointer", textTransform: "uppercase",
      transition: "all 0.15s ease",
      fontFamily: "'JetBrains Mono', monospace",
      boxShadow: active ? "0 0 15px rgba(0,229,160,0.15)" : "none",
    }),

    /* ─ page title ─ */
    pageTitle: {
      fontSize: "28px", fontWeight: "700",
      color: "#e2f0ff", marginBottom: "4px",
    },
    pageSub: {
      fontSize: "10px", color: "rgba(255,255,255,0.25)",
      letterSpacing: "3px", textTransform: "uppercase",
      fontFamily: "'JetBrains Mono', monospace",
      marginBottom: "28px",
    },

    /* ─ site cards ─ */
    siteCard: (hovered) => ({
      background: hovered ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
      border: `1px solid ${hovered ? "rgba(0,229,160,0.2)" : "rgba(255,255,255,0.06)"}`,
      borderRadius: "14px", padding: "16px 22px",
      marginBottom: "8px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      transition: "all 0.2s",
      transform: hovered ? "translateX(4px)" : "none",
    }),
    siteDot: {
      width: "7px", height: "7px", borderRadius: "50%",
      background: "#00e5a0",
      boxShadow: "0 0 8px #00e5a0",
      marginRight: "14px",
      animation: "pulse 2s infinite",
      flexShrink: 0,
    },
    visitBtn: (hovered) => ({
      padding: "6px 14px", borderRadius: "10px",
      background: hovered ? "rgba(0,229,160,0.15)" : "rgba(255,255,255,0.04)",
      border: `1px solid ${hovered ? "rgba(0,229,160,0.4)" : "rgba(255,255,255,0.08)"}`,
      color: hovered ? "#00e5a0" : "rgba(255,255,255,0.3)",
      fontSize: "11px", cursor: "pointer",
      transition: "all 0.15s",
      fontFamily: "'JetBrains Mono', monospace",
    }),

    /* ─ empty state ─ */
    empty: {
      textAlign: "center", padding: "60px 20px",
      color: "rgba(255,255,255,0.2)",
    },

    /* ─ loading ─ */
    loader: {
      display: "flex", alignItems: "center", justifyContent: "center",
      height: "100vh", flexDirection: "column", gap: "20px",
    },
    loaderRing: {
      width: "48px", height: "48px", borderRadius: "50%",
      border: "3px solid rgba(0,229,160,0.1)",
      borderTop: "3px solid #00e5a0",
      animation: "spin 0.8s linear infinite",
    },
    loaderText: {
      fontSize: "10px", letterSpacing: "4px",
      color: "rgba(0,229,160,0.5)", textTransform: "uppercase",
      fontFamily: "'JetBrains Mono', monospace",
    },
  };

  if (loading) return (
    <div style={{ ...css.app, opacity: 1 }}>
      <DNACanvas />
      <div style={css.loader}>
        <div style={{ fontSize: "36px", animation: "float 2s ease-in-out infinite" }}>🧬</div>
        <div style={css.loaderRing} />
        <div style={css.loaderText}>Loading events…</div>
      </div>
    </div>
  );

  return (
    <div style={css.app}>
      <DNACanvas />

      {/* SIDEBAR */}
      <nav style={css.sidebar}>
        <div style={css.logo}>🧬</div>
        {[
          { id: "home",   icon: "🏠" },
          { id: "events", icon: "📅" },
          { id: "sites",  icon: "🌐" },
        ].map(({ id, icon }) => (
          <button key={id} style={css.navBtn(page === id)}
            onClick={() => setPage(id)} title={id}>
            {icon}
          </button>
        ))}
      </nav>

      <main style={css.main}>

        {/* ══ HOME ══ */}
        {page === "home" && (
          <div style={{ animation: "fadeUp 0.5s ease both" }}>
            <div style={css.eyebrow}>// events · intelligence · system</div>
            <div style={css.greeting}>Welcome, Anand 👋</div>
            <p style={css.quote}>"{quote}"</p>

            <div style={css.grid}>
              {[
                { label: "Total Events", value: events.length, accent: "0,229,160",   color: "#00e5a0", id: "events" },
                { label: "Sites Tracked", value: TRACKED_SITES.length, accent: "84,160,255", color: "#54a0ff", id: "sites" },
                { label: "Urgent ≤ 7d",  value: urgent.length, accent: "255,107,107", color: "#ff6b6b", id: "events" },
                { label: "Last Scan",     value: null, accent: "205,132,255", color: "#cd84ff", id: null },
              ].map((card, i) => (
                <div key={i}
                  style={css.statCard(card.accent, hoveredCard === i)}
                  onMouseEnter={() => setHoveredCard(i)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => card.id && setPage(card.id)}>
                  <div style={css.statGlow(card.accent)} />
                  {card.value !== null
                    ? <div style={css.statNum(card.color)}>{card.value}</div>
                    : <div style={{ fontSize: "13px", color: card.color, fontFamily: "'JetBrains Mono',monospace", marginBottom: "8px", lineHeight: 1.4 }}>{lastScan}</div>
                  }
                  <div style={css.statLabel}>{card.label}</div>
                </div>
              ))}
            </div>

            {urgent.length > 0 && (
              <>
                <div style={css.sectionLabel}>
                  ⚡ Closing Soon
                  <div style={css.sectionLine} />
                </div>
                {urgent.map((e, i) => {
                  const d = daysUntil(e.lastDay);
                  return (
                    <div key={i}
                      style={{ ...css.eventCard(true, hoveredEvent === `u${i}`), animationDelay: `${i * 0.05}s` }}
                      className="fade-up"
                      onMouseEnter={() => setHoveredEvent(`u${i}`)}
                      onMouseLeave={() => setHoveredEvent(null)}
                      onClick={() => window.open(e.url, "_blank")}>
                      <div style={{ flex: 1 }}>
                        <div style={css.eventTitle}>{e.title}</div>
                        <div style={css.eventMeta}>
                          <span>{e.institute}</span>
                          {e.lastDay && <><span style={{ opacity: 0.3 }}>·</span><span>deadline {e.lastDay}</span></>}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center", flexShrink: 0 }}>
                        <span style={css.typeTag(e.type)}>{e.type}</span>
                        {d !== null && <span style={css.deadlineTag(d)}>{d}d left</span>}
                        <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "18px" }}>↗</span>
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {urgent.length === 0 && (
              <div style={{ ...css.sectionLabel, color: "rgba(0,229,160,0.4)" }}>
                ✅ No urgent deadlines right now
                <div style={css.sectionLine} />
              </div>
            )}

            {events.length > 0 && (
              <>
                <div style={{ ...css.sectionLabel, marginTop: "32px" }}>
                  🔬 Recent Finds
                  <div style={css.sectionLine} />
                </div>
                {events.slice(0, 4).map((e, i) => {
                  const d = daysUntil(e.lastDay);
                  return (
                    <div key={i}
                      style={{ ...css.eventCard(false, hoveredEvent === `r${i}`), animationDelay: `${i * 0.07}s` }}
                      className="fade-up"
                      onMouseEnter={() => setHoveredEvent(`r${i}`)}
                      onMouseLeave={() => setHoveredEvent(null)}
                      onClick={() => window.open(e.url, "_blank")}>
                      <div style={{ flex: 1 }}>
                        <div style={css.eventTitle}>{e.title}</div>
                        <div style={css.eventMeta}><span>{e.institute}</span></div>
                      </div>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center", flexShrink: 0 }}>
                        <span style={css.typeTag(e.type)}>{e.type}</span>
                        {d !== null && d >= 0 && <span style={css.deadlineTag(d)}>{d}d left</span>}
                        <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "18px" }}>↗</span>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}

        {/* ══ EVENTS ══ */}
        {page === "events" && (
          <div style={{ animation: "fadeUp 0.4s ease both" }}>
            <div style={css.pageTitle}>📅 Active Events</div>
            <div style={css.pageSub}>Biotechnology · {filtered.length} results found</div>

            <div style={css.searchWrap}>
              <span style={css.searchIcon}>🔍</span>
              <input
                style={css.searchInput}
                placeholder="Search events or institutes…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div style={css.filterRow}>
              {FILTERS.map(f => (
                <button key={f} style={css.filterPill(filter === f)}
                  onClick={() => setFilter(f)}>{f}</button>
              ))}
            </div>

            {filtered.length === 0 && (
              <div style={css.empty}>
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔬</div>
                <div>No events found. Try a different filter.</div>
              </div>
            )}

            {filtered.map((e, i) => {
              const d = daysUntil(e.lastDay);
              return (
                <div key={i}
                  style={{ ...css.eventCard(d !== null && d <= 7, hoveredEvent === i), animationDelay: `${i * 0.04}s` }}
                  className="fade-up"
                  onMouseEnter={() => setHoveredEvent(i)}
                  onMouseLeave={() => setHoveredEvent(null)}
                  onClick={() => window.open(e.url, "_blank")}>
                  <div style={{ flex: 1 }}>
                    <div style={css.eventTitle}>{e.title}</div>
                    <div style={css.eventMeta}>
                      <span>{e.institute}</span>
                      {e.lastDay && <><span style={{ opacity: 0.3 }}>·</span><span>last day: {e.lastDay}</span></>}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", flexShrink: 0 }}>
                    <span style={css.typeTag(e.type)}>{e.type}</span>
                    {d !== null && d >= 0 && <span style={css.deadlineTag(d)}>{d}d left</span>}
                    <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "18px" }}>↗</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ══ SITES ══ */}
        {page === "sites" && (
          <div style={{ animation: "fadeUp 0.4s ease both" }}>
            <div style={css.pageTitle}>🌐 Sites Tracked</div>
            <div style={css.pageSub}>Scanning daily via GitHub Actions · {TRACKED_SITES.length} sites</div>

            {TRACKED_SITES.map((site, i) => (
              <div key={i}
                style={css.siteCard(hoveredEvent === `s${i}`)}
                className="fade-up"
                onMouseEnter={() => setHoveredEvent(`s${i}`)}
                onMouseLeave={() => setHoveredEvent(null)}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div style={css.siteDot} />
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: "500" }}>{site.name}</div>
                    <div style={{ fontSize: "11px", color: "rgba(84,160,255,0.6)", fontFamily: "'JetBrains Mono',monospace" }}>{site.url}</div>
                  </div>
                </div>
                <button
                  style={css.visitBtn(hoveredEvent === `s${i}`)}
                  onClick={() => window.open(site.url, "_blank")}>
                  Visit ↗
                </button>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
