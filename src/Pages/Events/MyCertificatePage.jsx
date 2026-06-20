import { useState, useEffect } from "react";
import { Link } from "react-router";
import axios from "axios";
import { format, formatDistanceToNow } from "date-fns";

/* ─── Constants ─── */
const TYPE_COLOR = {
  cleanup:    { primary: "#0ea5e9", light: "#e0f2fe", accent: "#0284c7" },
  plantation: { primary: "#16a34a", light: "#dcfce7", accent: "#15803d" },
  repair:     { primary: "#d97706", light: "#fef3c7", accent: "#b45309" },
  awareness:  { primary: "#7c3aed", light: "#ede9fe", accent: "#6d28d9" },
  student:    { primary: "#db2777", light: "#fce7f3", accent: "#be185d" },
  meetup:     { primary: "#0d9488", light: "#ccfbf1", accent: "#0f766e" },
};
const TYPE_EMOJI  = { cleanup:"🧹", plantation:"🌳", repair:"🏗️", awareness:"📢", student:"🎓", meetup:"🤝" };
const TYPE_LABEL  = { cleanup:"Cleanup", plantation:"Plantation", repair:"Repair", awareness:"Awareness", student:"Student Day", meetup:"Meetup" };

/* ═══════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════ */
export default function MyCertificatesPage() {
  const [certs,   setCerts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [filter,  setFilter]  = useState("all"); // all | volunteer | guest

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setError("not-logged-in");
      setLoading(false);
      return;
    }
    axios
      .get(`${import.meta.env.VITE_API_URL}/my-certificates`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => setCerts(r.data.certificates || []))
      .catch(() => setError("fetch-failed"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = certs.filter((c) => {
    if (filter === "volunteer") return c.role === "Volunteer";
    if (filter === "guest")     return c.role === "Guest";
    return true;
  });

  /* ─── type breakdown for stats ─── */
  const typeCount = certs.reduce((acc, c) => {
    acc[c.eventType] = (acc[c.eventType] || 0) + 1;
    return acc;
  }, {});
  const topType = Object.entries(typeCount).sort((a, b) => b[1] - a[1])[0];

  /* ─── Loading ─── */
  if (loading) return (
    <Shell>
      <div className="flex flex-col items-center justify-center min-h-[55vh]">
        <div className="w-10 h-10 border-[3px] border-green-500 border-t-transparent rounded-full animate-spin mb-3"/>
        <p className="text-stone-400 text-sm">Loading certificates...</p>
      </div>
    </Shell>
  );

  // /* ─── Not logged in ─── */
  // if (error === "not-logged-in") return (
  //   <Shell>
  //     <div className="flex flex-col items-center justify-center min-h-[55vh] text-center">
  //       <div className="text-6xl mb-4">🔒</div>
  //       <h2 className="text-xl font-bold text-stone-800 mb-2" style={{ fontFamily:"Fraunces,serif" }}>
  //         Login Required
  //       </h2>
  //       <p className="text-stone-500 text-sm mb-6 max-w-xs">
  //         Please login to view your certificates.
  //       </p>
  //       <Link to="/login"
  //         className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-2xl text-sm font-semibold transition-colors">
  //         Login
  //       </Link>
  //     </div>
  //   </Shell>
  // );

  /* ─── Fetch error ─── */
  // if (error === "fetch-failed") return (
  //   <Shell>
  //     <div className="flex flex-col items-center justify-center min-h-[55vh] text-center">
  //       <div className="text-6xl mb-4">⚠️</div>
  //       <p className="text-stone-600 mb-4">Could not load certificates. Please try again.</p>
  //       <button onClick={() => window.location.reload()}
  //         className="px-5 py-2.5 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors">
  //         Retry
  //       </button>
  //     </div>
  //   </Shell>
  // );

  /* ─── Empty ─── */
  if (certs.length === 0) return (
    <Shell>
      <div className="max-w-3xl mx-auto">
        <PageHeader />
        <div className="text-center py-24 bg-white rounded-3xl border border-stone-200 shadow-sm">
          <div className="text-7xl mb-5">🏅</div>
          <h2 className="text-2xl font-bold text-stone-800 mb-2" style={{ fontFamily:"Fraunces,serif" }}>
            No Certificates Yet
          </h2>
          <p className="text-stone-500 text-sm max-w-xs mx-auto mb-6 leading-relaxed">
            Join a community event, show up on the day, and your certificate will appear here automatically.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link to="/events"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-2xl text-sm font-semibold transition-colors">
              🌿 Browse Events
            </Link>
            <Link to="/verify"
              className="inline-flex items-center gap-2 px-6 py-3 border border-stone-200 text-stone-700 rounded-2xl text-sm font-medium hover:bg-stone-50 transition-colors">
              🔍 Verify a Certificate
            </Link>
          </div>
        </div>
      </div>
    </Shell>
  );

  /* ─── Main view ─── */
  return (
    <Shell>
      <div className="max-w-4xl mx-auto">
        <PageHeader />

        {/* Stats cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatsCard
            icon="🏅"
            label="Total Earned"
            value={certs.length}
            color="green"
          />
          <StatsCard
            icon="🙋"
            label="As Volunteer"
            value={certs.filter((c) => c.role === "Volunteer").length}
            color="blue"
          />
          <StatsCard
            icon="👤"
            label="As Guest"
            value={certs.filter((c) => c.role === "Guest").length}
            color="purple"
          />
          <StatsCard
            icon={topType ? (TYPE_EMOJI[topType[0]] || "🤝") : "📊"}
            label="Top Event Type"
            value={topType ? (TYPE_LABEL[topType[0]] || topType[0]) : "—"}
            color="amber"
            small
          />
        </div>

        {/* Filter tabs */}
        {certs.length > 0 && (
          <div className="flex gap-2 mb-6">
            {[
              { id: "all",       label: `All (${certs.length})` },
              { id: "volunteer", label: `Volunteer (${certs.filter(c=>c.role==="Volunteer").length})` },
              { id: "guest",     label: `Guest (${certs.filter(c=>c.role==="Guest").length})` },
            ].map((tab) => (
              <button key={tab.id} onClick={() => setFilter(tab.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  filter === tab.id
                    ? "bg-green-500 text-white shadow-sm"
                    : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50"
                }`}>
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Certificates grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-stone-400 bg-white rounded-2xl border border-stone-200">
            <p className="text-sm">No {filter} certificates found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((cert) => (
              <CertificateCard key={cert._id || cert.certId} cert={cert} />
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-10 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="font-semibold text-green-800">Earn more certificates</p>
            <p className="text-green-600 text-sm mt-0.5">Join upcoming community events in your area</p>
          </div>
          <Link to="/events"
            className="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
            🌿 Browse Events →
          </Link>
        </div>
      </div>
    </Shell>
  );
}

/* ═══════════════════════════════════════
   CERTIFICATE CARD
═══════════════════════════════════════ */
function CertificateCard({ cert }) {
  const color     = TYPE_COLOR[cert.eventType] || TYPE_COLOR.meetup;
  const emoji     = TYPE_EMOJI[cert.eventType] || "🤝";
  const typeLabel = TYPE_LABEL[cert.eventType] || cert.eventType;
  const [copied,  setCopied] = useState(false);

  const verifyUrl = cert.verifyUrl || `${window.location.origin}/verify/${cert.certId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(verifyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
      {/* Top color bar */}
      <div className="h-2" style={{ background: `linear-gradient(90deg,${color.primary},${color.accent})` }}/>

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{ background: color.light, color: color.accent }}>
            <span>{emoji}</span>{typeLabel}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full text-white"
            style={{ background: color.primary }}>
            {cert.role}
          </span>
        </div>

        {/* Event title */}
        <h3 className="font-bold text-stone-900 text-sm leading-snug mb-1.5 line-clamp-2"
          style={{ fontFamily:"Fraunces,serif" }}>
          {cert.eventTitle}
        </h3>

        {/* Meta */}
        <p className="text-xs text-stone-400 mb-1">
          🗓️ {format(new Date(cert.eventDate), "dd MMM yyyy")}
        </p>
        {cert.institution && (
          <p className="text-xs font-medium mb-3" style={{ color: color.accent }}>
            🏫 {cert.institution}
          </p>
        )}

        {/* Cert ID box */}
        <div className="bg-stone-50 rounded-xl px-3 py-2.5 mb-3 border border-stone-100">
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-0.5">Certificate ID</p>
          <p className="text-xs font-mono font-bold text-stone-700">{cert.certId}</p>
        </div>

        {/* Issued time */}
        <p className="text-[10px] text-stone-400 mb-4">
          Issued {formatDistanceToNow(new Date(cert.issuedAt), { addSuffix: true })}
        </p>

        {/* Action buttons */}
        <div className="flex gap-2 mb-2">
          <Link to={`/verify/${cert.certId}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors">
            🔍 Verify
          </Link>
          {cert.pdfUrl ? (
            <a href={cert.pdfUrl} target="_blank" rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-white transition-colors"
              style={{ background: color.primary }}>
              ⬇️ Download
            </a>
          ) : (
            <button onClick={handleCopy}
              className="flex-1 py-2 rounded-xl text-xs font-semibold border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors">
              {copied ? "✅ Copied!" : "🔗 Copy Link"}
            </button>
          )}
        </div>

        {/* LinkedIn button */}
        <a
          href={`https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(cert.eventTitle)}&organizationName=CommunityFix&certId=${cert.certId}&certUrl=${encodeURIComponent(verifyUrl)}`}
          target="_blank" rel="noreferrer"
          className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100 transition-colors">
          💼 Add to LinkedIn
        </a>
      </div>

      {/* Bottom color bar */}
      <div className="h-1.5" style={{ background: `linear-gradient(90deg,${color.primary}40,${color.accent},${color.primary}40)` }}/>
    </div>
  );
}

/* ─── Helpers ─── */
function Shell({ children }) {
  return (
    <div className="min-h-screen bg-[#f5f4f0] py-8 px-4" style={{ fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Fraunces:wght@700;900&display=swap');`}</style>
      {children}
    </div>
  );
}

function PageHeader() {
  return (
    <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
      <div>
        <h1 className="text-3xl font-bold text-stone-900" style={{ fontFamily:"Fraunces,serif" }}>
          My Certificates
        </h1>
        <p className="text-stone-500 text-sm mt-1">
          Certificates earned through civic participation
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Link to="/verify"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-700 text-sm font-medium hover:bg-stone-50 transition-colors">
          🔍 Verify a Certificate
        </Link>
        <Link to="/events"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-colors">
          + Earn More
        </Link>
      </div>
    </div>
  );
}

function StatsCard({ icon, label, value, color, small }) {
  const colors = {
    green:  "from-green-50  to-green-100/30  border-green-200/60  text-green-700",
    blue:   "from-blue-50   to-blue-100/30   border-blue-200/60   text-blue-700",
    purple: "from-purple-50 to-purple-100/30 border-purple-200/60 text-purple-700",
    amber:  "from-amber-50  to-amber-100/30  border-amber-200/60  text-amber-700",
  };
  return (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-2xl p-4 shadow-sm`}>
      <div className="text-2xl mb-2">{icon}</div>
      <p className={`font-bold ${small ? "text-sm" : "text-2xl"} leading-tight`}
        style={{ fontFamily: small ? "'DM Sans',sans-serif" : "Fraunces,serif" }}>
        {value}
      </p>
      <p className="text-xs font-medium opacity-70 mt-0.5">{label}</p>
    </div>
  );
}