import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import axios from "axios";
import { format } from "date-fns";

const TYPE_COLOR = {
  cleanup:    { primary: "#0ea5e9", light: "#e0f2fe", accent: "#0284c7" },
  plantation: { primary: "#16a34a", light: "#dcfce7", accent: "#15803d" },
  repair:     { primary: "#d97706", light: "#fef3c7", accent: "#b45309" },
  awareness:  { primary: "#7c3aed", light: "#ede9fe", accent: "#6d28d9" },
  student:    { primary: "#db2777", light: "#fce7f3", accent: "#be185d" },
  meetup:     { primary: "#0d9488", light: "#ccfbf1", accent: "#0f766e" },
};
const TYPE_LABEL = {
  cleanup: "Cleanup Drive", plantation: "Tree Plantation", repair: "Repair Work",
  awareness: "Awareness Campaign", student: "Student Volunteer Day", meetup: "Community Meetup",
};
const TYPE_EMOJI = {
  cleanup: "🧹", plantation: "🌳", repair: "🏗️",
  awareness: "📢", student: "🎓", meetup: "🤝",
};

/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */
export default function CertificateVerifyPage() {
  const { certId }               = useParams();
  const navigate                 = useNavigate();
  const [state,     setState]    = useState("loading"); // loading|valid|invalid|idle|error
  const [cert,      setCert]     = useState(null);
  const [manualId,  setManualId] = useState("");
  const [searching, setSearching] = useState(false);
  const [copied,    setCopied]   = useState(false);

  useEffect(() => {
    if (certId) fetchCert(certId);
    else        setState("idle");
  }, [certId]);

  const fetchCert = async (id) => {
    setState("loading");
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/verify/${id.trim().toUpperCase()}`);
      if (res.data.valid) { setCert(res.data.certificate); setState("valid"); }
      else                { setState("invalid"); }
    } catch (err) {
      setState(err.response?.status === 404 ? "invalid" : "error");
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!manualId.trim()) return;
    setSearching(true);
    await fetchCert(manualId.trim());
    setSearching(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const color     = cert ? (TYPE_COLOR[cert.eventType] || TYPE_COLOR.meetup) : TYPE_COLOR.plantation;
  const typeLabel = cert ? (TYPE_LABEL[cert.eventType] || cert.eventType)   : "";
  const emoji     = cert ? (TYPE_EMOJI[cert.eventType] || "🤝")             : "";

  /* ─── Loading ─── */
  if (state === "loading") return (
    <Shell>
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-[3px] border-green-500 border-t-transparent rounded-full animate-spin mb-4"/>
        <p className="text-stone-400 text-sm">Verifying certificate...</p>
      </div>
    </Shell>
  );

  /* ─── Valid ─── */
  if (state === "valid" && cert) return (
    <Shell>
      <div className="max-w-2xl mx-auto">

        {/* Verified banner */}
        <div className="flex items-center gap-4 bg-green-50 border border-green-200 rounded-3xl p-5 mb-6">
          <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shrink-0 shadow-sm">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <div>
            <p className="font-bold text-green-800 text-lg leading-tight">Certificate Verified ✓</p>
            <p className="text-green-600 text-sm mt-0.5">
              This is an authentic CommunityFix certificate issued to <strong>{cert.recipientName}</strong>.
            </p>
          </div>
        </div>

        {/* Certificate card */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden mb-5">
          {/* Colored top bar */}
          <div className="h-3" style={{ background: `linear-gradient(90deg,${color.primary},${color.accent},${color.primary})` }}/>

          <div className="p-8">
            {/* Type badge + authentic badge */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full"
                style={{ background: color.light, color: color.accent }}>
                <span className="text-base">{emoji}</span>
                {typeLabel}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-green-100 text-green-700 ring-1 ring-green-200">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/>
                Authentic
              </span>
            </div>

            {/* Certificate heading */}
            <div className="text-center pb-6 mb-6 border-b border-stone-100">
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3">
                Certificate of {cert.role === "Guest" ? "Participation" : "Achievement"}
              </p>
              <h1 className="text-4xl font-bold text-stone-900 mb-3 leading-tight"
                style={{ fontFamily: "Fraunces, serif" }}>
                {cert.recipientName}
              </h1>
              {cert.institution && (
                <p className="text-sm font-semibold mb-3" style={{ color: color.accent }}>
                  {cert.institution}
                </p>
              )}
              <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold text-white"
                style={{ background: color.primary }}>
                {cert.role}
              </span>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-7">
              <DetailBox icon="🎯" label="Event"          value={cert.eventTitle} />
              <DetailBox icon="🗓️" label="Date"
                value={format(new Date(cert.eventDate), "EEEE, dd MMMM yyyy")} />
              {cert.eventAddress && (
                <DetailBox icon="📍" label="Location"     value={cert.eventAddress} />
              )}
              <DetailBox icon="🏅" label="Role"           value={cert.role} />
              <DetailBox icon="📋" label="Certificate ID" value={cert.certId} mono />
              <DetailBox icon="✅" label="Issued On"
                value={format(new Date(cert.issuedAt), "dd MMMM yyyy")} />
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              {cert.pdfUrl && (
                <a href={cert.pdfUrl} target="_blank" rel="noreferrer"
                  className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 rounded-2xl text-white font-semibold text-sm transition-colors shadow-sm"
                  style={{ background: color.primary }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                  </svg>
                  Download PDF
                </a>
              )}

              <button onClick={handleCopyLink}
                className="flex-1 min-w-[130px] flex items-center justify-center gap-2 py-3 rounded-2xl border border-stone-200 text-stone-700 font-medium text-sm hover:bg-stone-50 transition-colors">
                {copied ? "✅ Copied!" : "🔗 Copy Link"}
              </button>

              <a href={`https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(cert.eventTitle)}&organizationName=CommunityFix&certUrl=${encodeURIComponent(window.location.href)}&certId=${cert.certId}`}
                target="_blank" rel="noreferrer"
                className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors">
                💼 Add to LinkedIn
              </a>
            </div>
          </div>

          {/* Colored bottom bar */}
          <div className="h-2" style={{ background: `linear-gradient(90deg,${color.primary}60,${color.accent},${color.primary}60)` }}/>
        </div>

        {/* Verify another */}
        <p className="text-center">
          <button onClick={() => { setState("idle"); setCert(null); navigate("/verify"); }}
            className="text-sm text-stone-400 hover:text-stone-700 underline underline-offset-2 transition-colors">
            Verify another certificate
          </button>
        </p>
      </div>
    </Shell>
  );

  /* ─── Invalid ─── */
  if (state === "invalid") return (
    <Shell>
      <div className="max-w-lg mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center mb-6">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-xl font-bold text-red-800 mb-2" style={{ fontFamily:"Fraunces,serif" }}>
            Certificate Not Found
          </h2>
          <p className="text-red-600 text-sm leading-relaxed">
            No certificate found for <code className="font-mono bg-red-100 px-2 py-0.5 rounded text-xs">{certId || manualId}</code>.
            Please double-check the ID and try again.
          </p>
        </div>
        <SearchForm
          value={manualId}
          onChange={setManualId}
          onSubmit={handleSearch}
          loading={searching}
        />
      </div>
    </Shell>
  );

  /* ─── Error ─── */
  if (state === "error") return (
    <Shell>
      <div className="max-w-lg mx-auto">
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8 text-center mb-6">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-amber-800 mb-2" style={{ fontFamily:"Fraunces,serif" }}>
            Something went wrong
          </h2>
          <p className="text-amber-700 text-sm">Could not reach the verification server. Please try again.</p>
        </div>
        <SearchForm value={manualId} onChange={setManualId} onSubmit={handleSearch} loading={searching} />
      </div>
    </Shell>
  );

  /* ─── Idle (no certId in URL) ─── */
  return (
    <Shell>
      <div className="max-w-lg mx-auto">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-5 shadow-sm">
            <span className="text-4xl">🏅</span>
          </div>
          <h1 className="text-3xl font-bold text-stone-900 mb-3" style={{ fontFamily:"Fraunces,serif" }}>
            Verify Certificate
          </h1>
          <p className="text-stone-500 text-sm max-w-sm mx-auto leading-relaxed">
            Enter a CommunityFix certificate ID to instantly verify its authenticity.
            Schools, colleges, and employers can use this page.
          </p>
        </div>

        <SearchForm value={manualId} onChange={setManualId} onSubmit={handleSearch} loading={searching} />

        {/* How it works */}
        <div className="mt-10 grid grid-cols-3 gap-5 text-center">
          {[
            { icon:"🔍", label:"Enter ID",      desc:"Paste the certificate ID from the email" },
            { icon:"⚡", label:"Instant check", desc:"Verified against our database in real time" },
            { icon:"✅", label:"Confirmed",     desc:"View full details and download PDF" },
          ].map((item) => (
            <div key={item.label}>
              <div className="text-3xl mb-2">{item.icon}</div>
              <p className="text-sm font-semibold text-stone-700">{item.label}</p>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Info note */}
        <div className="mt-8 bg-stone-50 border border-stone-200 rounded-2xl p-4 text-sm text-stone-500">
          <p className="font-medium text-stone-700 mb-1">For institutions</p>
          <p className="text-xs leading-relaxed">
            Enter the certificate ID provided by the student/volunteer to instantly confirm
            their participation in a CommunityFix community event. This verification page
            is publicly accessible.
          </p>
        </div>
      </div>
    </Shell>
  );
}

/* ─── Helpers ─── */
function Shell({ children }) {
  return (
    <div className="min-h-screen bg-[#f5f4f0] py-10 px-4" style={{ fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Fraunces:wght@700;900&display=swap');`}</style>
      <div className="max-w-2xl mx-auto">
        {/* Nav */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="font-bold text-stone-800 text-lg hover:text-stone-600 transition-colors">
            Community<span className="text-green-500">Fix</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/my-certificates" className="text-sm text-stone-500 hover:text-stone-800 transition-colors">
              My Certificates
            </Link>
            <Link to="/events" className="text-sm text-stone-500 hover:text-stone-800 transition-colors">
              Events
            </Link>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

function SearchForm({ value, onChange, onSubmit, loading }) {
  return (
    <form onSubmit={onSubmit} className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
      <label className="block text-sm font-semibold text-stone-700 mb-2">Certificate ID</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          placeholder="e.g. CERT-2025-A3F9"
          className="flex-1 px-4 py-3 rounded-xl border border-stone-200 text-sm font-mono
                     focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 uppercase"
          autoFocus
        />
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-semibold
                     transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading
            ? <><Spinner/> Checking...</>
            : "🔍 Verify"
          }
        </button>
      </div>
      <p className="text-xs text-stone-400 mt-2">
        Certificate IDs look like: CERT-2025-A3F9 · Found in your certificate email
      </p>
    </form>
  );
}

function DetailBox({ icon, label, value, mono }) {
  return (
    <div className="bg-stone-50 rounded-2xl p-4">
      <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1.5">
        <span className="mr-1">{icon}</span>{label}
      </p>
      <p className={`text-sm font-semibold text-stone-800 leading-snug ${mono ? "font-mono text-xs" : ""}`}>
        {value}
      </p>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
    </svg>
  );
}