import { useState, useEffect } from "react";
import { Link } from "react-router";
import { format, formatDistanceToNow } from "date-fns";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import {
  Award, Users, User, BarChart3, Search, Download, Link2, Check,
  Calendar, School, Linkedin, Sparkles, AlertTriangle,
} from "lucide-react";

/* ─── Constants ─── */
const TYPE_COLOR = {
  cleanup:    { from: "from-sky-500",     to: "to-cyan-500",    text: "text-sky-400" },
  plantation: { from: "from-emerald-500", to: "to-teal-500",    text: "text-emerald-400" },
  repair:     { from: "from-amber-500",   to: "to-orange-500",  text: "text-amber-400" },
  awareness:  { from: "from-violet-500",  to: "to-purple-500",  text: "text-violet-400" },
  student:    { from: "from-pink-500",    to: "to-rose-500",    text: "text-pink-400" },
  meetup:     { from: "from-teal-500",    to: "to-emerald-600", text: "text-teal-400" },
};
const TYPE_LABEL = { cleanup:"Cleanup", plantation:"Plantation", repair:"Repair", awareness:"Awareness", student:"Student Day", meetup:"Meetup" };

/* ═══════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════ */
export default function MyCertificatesPage() {
  const [certs,   setCerts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [filter,  setFilter]  = useState("all");
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    axiosSecure.get('/my-certificates')
      .then((r) => setCerts(r.data.certificates || []))
      .catch(() => setError("fetch-failed"))
      .finally(() => setLoading(false));
  }, [axiosSecure]);

  const filtered = certs.filter((c) => {
    if (filter === "volunteer") return c.role === "Volunteer";
    if (filter === "guest")     return c.role === "Guest";
    return true;
  });

  const typeCount = certs.reduce((acc, c) => {
    acc[c.eventType] = (acc[c.eventType] || 0) + 1;
    return acc;
  }, {});
  const topType = Object.entries(typeCount).sort((a, b) => b[1] - a[1])[0];

  /* ─── Loading ─── */
  if (loading) return (
    <Shell>
      <div className="flex flex-col items-center justify-center min-h-[55vh]">
        <div className="w-10 h-10 border-[3px] border-emerald-500 border-t-transparent rounded-full animate-spin mb-3"/>
        <p className="text-gray-400 text-base">Loading certificates...</p>
      </div>
    </Shell>
  );

  /* ─── Fetch error ─── */
  if (error === "fetch-failed") return (
    <Shell>
      <div className="flex flex-col items-center justify-center min-h-[55vh] text-center">
        <AlertTriangle className="w-14 h-14 text-amber-500 mb-4" />
        <p className="text-gray-400 mb-4">Could not load certificates. Please try again.</p>
        <button onClick={() => window.location.reload()}
          className="px-5 py-2.5 bg-linear-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-base font-semibold hover:scale-105 transition-transform">
          Retry
        </button>
      </div>
    </Shell>
  );

  /* ─── Empty ─── */
  if (certs.length === 0) return (
    <Shell>
      <div className="max-w-3xl mx-auto">
        <PageHeader />
        <div className="text-center py-24 bg-zinc-800 rounded-3xl border border-zinc-700">
          <div className="w-20 h-20 bg-linear-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Award className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">No Certificates Yet</h2>
          <p className="text-gray-400 text-base max-w-xs mx-auto mb-7 leading-relaxed">
            Join a community event, show up on the day, and your certificate will appear here automatically.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link to="/events"
              className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-emerald-500 to-teal-500 text-white rounded-2xl text-base font-semibold hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" /> Browse Events
            </Link>
            <Link to="/ver"
              className="inline-flex items-center gap-2 px-6 py-3 border border-zinc-700 text-gray-300 rounded-2xl text-base font-medium hover:border-emerald-500/50 hover:text-emerald-400 transition-colors">
              <Search className="w-4 h-4" /> Verify a Certificate
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
          <StatsCard icon={<Award className="w-7 h-7" />} label="Total Earned" value={certs.length} color="emerald" />
          <StatsCard icon={<Users className="w-7 h-7" />} label="As Volunteer" value={certs.filter((c) => c.role === "Volunteer").length} color="sky" />
          <StatsCard icon={<User className="w-7 h-7" />} label="As Guest" value={certs.filter((c) => c.role === "Guest").length} color="violet" />
          <StatsCard
            icon={<BarChart3 className="w-7 h-7" />}
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
                className={`px-4 py-2 rounded-xl text-base font-medium transition-all ${
                  filter === tab.id
                    ? "bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20"
                    : "bg-zinc-900 border border-zinc-700 text-gray-400 hover:border-emerald-500/40 hover:text-emerald-400"
                }`}>
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Certificates grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-500 bg-zinc-900 rounded-2xl border border-zinc-700">
            <p className="text-base">No {filter} certificates found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((cert) => (
              <CertificateCard key={cert._id || cert.certId} cert={cert} />
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-10 relative overflow-hidden bg-zinc-800 border border-zinc-700 rounded-2xl p-6 flex items-center justify-between flex-wrap gap-4">
          <div className="absolute inset-0 bg-linear-to-r from-emerald-500/10 to-teal-500/10" />
          <div className="relative">
            <p className="font-semibold text-white">Earn more certificates</p>
            <p className="text-gray-400 text-base mt-0.5">Join upcoming community events in your area</p>
          </div>
          <Link to="/events"
            className="relative px-5 py-2.5 bg-linear-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-base font-semibold hover:scale-105 transition-transform flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Browse Events
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
  const typeLabel = TYPE_LABEL[cert.eventType] || cert.eventType;
  const [copied,  setCopied] = useState(false);

  const verifyUrl = cert.verifyUrl || `${window.location.origin}/verify/${cert.certId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(verifyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative bg-zinc-800 rounded-3xl border border-zinc-700 hover:border-emerald-500/50 transition-all duration-500 hover:scale-[1.02] overflow-hidden">
      {/* Glow on hover */}
      <div className={`absolute inset-0 bg-linear-to-br ${color.from} ${color.to} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

      {/* Top color bar */}
      <div className={`h-1.5 bg-linear-to-r ${color.from} ${color.to}`} />

      <div className="relative p-5">
        {/* Header row */}
        <div className="flex items-center justify-between mb-4">
          <span className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full bg-zinc-800 border border-zinc-700 ${color.text}`}>
            {typeLabel}
          </span>
          <span className={`inline-flex items-center gap-1 text-sm font-bold px-2.5 py-1 rounded-full text-white bg-linear-to-r ${color.from} ${color.to}`}>
            {cert.role}
          </span>
        </div>

        {/* Event title */}
        <h3 className="font-bold text-white text-base leading-snug mb-2 line-clamp-2 group-hover:text-emerald-400 transition-colors">
          {cert.eventTitle}
        </h3>

        {/* Meta */}
        <p className="flex items-center gap-1.5 text-sm text-gray-500 mb-1">
          <Calendar className="w-3.5 h-3.5" /> {format(new Date(cert.eventDate), "dd MMM yyyy")}
        </p>
        {cert.institution && (
          <p className={`flex items-center gap-1.5 text-sm font-medium mb-3 ${color.text}`}>
            <School className="w-3.5 h-3.5" /> {cert.institution}
          </p>
        )}

        {/* Cert ID box */}
        <div className="bg-linear-to-br from-zinc-900 to-zinc-800 rounded-xl px-3 py-2.5 mb-3 border border-zinc-700">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Certificate ID</p>
          <p className="text-sm font-mono font-bold text-gray-200">{cert.certId}</p>
        </div>

        {/* Issued time */}
        <p className="text-[10px] text-gray-500 mb-4">
          Issued {formatDistanceToNow(new Date(cert.issuedAt), { addSuffix: true })}
        </p>

        {/* Action buttons */}
        <div className="flex gap-2 mb-2">
          <Link to={`/verify/${cert.certId}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold border border-zinc-700 text-gray-300 hover:border-emerald-500/50 hover:text-emerald-400 transition-colors">
            <Search className="w-3.5 h-3.5" /> Verify
          </Link>
          {cert.pdfUrl ? (
            <a href={cert.pdfUrl} target="_blank" rel="noreferrer"
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold text-white bg-linear-to-r ${color.from} ${color.to} hover:scale-105 transition-transform`}>
              <Download className="w-3.5 h-3.5" /> Download
            </a>
          ) : (
            <button onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold border border-zinc-700 text-gray-300 hover:border-emerald-500/50 hover:text-emerald-400 transition-colors">
              {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Link2 className="w-3.5 h-3.5" /> Copy Link</>}
            </button>
          )}
        </div>

        {/* LinkedIn button */}
        <a
          href={`https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(cert.eventTitle)}&organizationName=CommunityFix&certId=${cert.certId}&certUrl=${encodeURIComponent(verifyUrl)}`}
          target="_blank" rel="noreferrer"
          className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-sm font-semibold bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 border border-sky-500/20 transition-colors">
          <Linkedin className="w-3.5 h-3.5" /> Add to LinkedIn
        </a>
      </div>

      {/* Bottom color bar */}
      <div className={`h-1 bg-linear-to-r ${color.from} ${color.to} opacity-40`} />
    </div>
  );
}

/* ─── Helpers ─── */
function Shell({ children }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-900 to-zinc-800 relative overflow-hidden py-10 px-4" style={{ fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Fraunces:wght@700;900&display=swap');`}</style>

      {/* Dotted background pattern, matching Features.jsx */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, #10b981 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative">{children}</div>
    </div>
  );
}

function PageHeader() {
  return (
    <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
      <div>
        <div className="inline-block px-4 py-1.5 rounded-full bg-linear-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 mb-3">
          <span className="text-emerald-400 font-semibold text-sm uppercase tracking-wider">My Achievements</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-white">
          My <span className="bg-linear-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Certificates</span>
        </h1>
        <p className="text-gray-400 text-base mt-2">
          Certificates earned through civic participation
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Link to="/ver"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 text-gray-300 text-base font-medium hover:border-emerald-500/50 hover:text-emerald-400 transition-colors">
          <Search className="w-4 h-4" /> Verify a Certificate
        </Link>
        <Link to="/events"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 text-white text-base font-semibold hover:scale-105 transition-transform">
          + Earn More
        </Link>
      </div>
    </div>
  );
}

function StatsCard({ icon, label, value, color, small }) {
  const colors = {
    emerald: "from-emerald-500 to-teal-500",
    sky:     "from-sky-500 to-cyan-500",
    violet:  "from-violet-500 to-purple-500",
    amber:   "from-amber-500 to-orange-500",
  };
  return (
    <div className="group relative bg-zinc-800 border border-zinc-700 hover:border-emerald-500/50 rounded-2xl p-4 transition-all duration-300 overflow-hidden">
      <div className={`absolute inset-0 bg-linear-to-br ${colors[color]} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
      <div className={`relative w-10 h-10 bg-linear-to-br ${colors[color]} rounded-xl flex items-center justify-center text-white mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <p className={`relative font-bold text-white ${small ? "text-base" : "text-2xl"} leading-tight`}>
        {value}
      </p>
      <p className="relative text-sm font-medium text-gray-400 mt-0.5">{label}</p>
    </div>
  );
}