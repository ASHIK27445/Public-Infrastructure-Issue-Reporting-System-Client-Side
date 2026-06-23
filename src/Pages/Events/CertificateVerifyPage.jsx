import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { format } from "date-fns";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Download,
  Link2,
  Loader2,
  ShieldCheck,
  Calendar,
  MapPin,
  Award,
  Hash,
  Clock,
  Target,
  ArrowRight,
  Medal,
} from "lucide-react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

/* ─── Constants ─── */
const TYPE_COLOR = {
  cleanup:    { primary: "#0ea5e9", accent: "#0284c7", tint: "#f0f9ff" },
  plantation: { primary: "#2D6A4F", accent: "#1B4332", tint: "#f0fdf4" },
  repair:     { primary: "#d97706", accent: "#b45309", tint: "#fffbeb" },
  awareness:  { primary: "#7c3aed", accent: "#6d28d9", tint: "#faf5ff" },
  student:    { primary: "#db2777", accent: "#be185d", tint: "#fdf2f8" },
  meetup:     { primary: "#0d9488", accent: "#0f766e", tint: "#f0fdfa" },
};
const TYPE_LABEL = {
  cleanup: "Cleanup Drive", plantation: "Tree Plantation", repair: "Repair Work",
  awareness: "Awareness Campaign", student: "Student Volunteer Day", meetup: "Community Meetup",
};

/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */
export default function CertificateVerifyPage() {
  const { certId }                  = useParams();
  const navigate                    = useNavigate();
  const [state,     setState]       = useState("loading");
  const [cert,      setCert]        = useState(null);
  const [manualId,  setManualId]    = useState("");
  const [searching, setSearching]   = useState(false);
  const [copied,    setCopied]      = useState(false);

  const axiosSecure = useAxiosSecure()

  useEffect(() => {
    if (certId) fetchCert(certId);
    else        setState("idle");
  }, [certId]);

  const fetchCert = async (id) => {
    setState("loading");
    try {
      const res = await axiosSecure.get(`/verify/${id.trim().toUpperCase()}`);
      if (res.data.valid) {
        setCert(res.data.certificate);
        setState("valid");
        navigate(`/ver/${id.trim().toUpperCase()}`, { replace: true }); // ← add this
      } else {
        setState("invalid");
      }
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
  const typeLabel = cert ? (TYPE_LABEL[cert.eventType] || cert.eventType)    : "";

  /* ─── Loading ─── */
  if (state === "loading") return (
    <Shell>
      <div className="flex flex-col items-center justify-center min-h-[52vh] gap-3">
        <Loader2 className="w-8 h-8 text-[#2D6A4F] animate-spin" />
        <p className="text-sm text-[#6B7280]">Verifying certificate…</p>
      </div>
    </Shell>
  );

  /* ─── Valid ─── */
  if (state === "valid" && cert) return (
    <Shell>
      <div className="max-w-2xl mx-auto">

        {/* Status bar */}
        <div className="flex items-center gap-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl px-5 py-4 mb-5">
          <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="text-sm font-semibold text-[#15803D]">Certificate verified</span>
            <span className="text-sm text-[#16A34A] ml-2">
              Issued to <strong>{cert.recipientName}</strong>
            </span>
          </div>
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#15803D] bg-white border border-[#BBF7D0] px-2.5 py-1 rounded-full shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
            Authentic
          </span>
        </div>

        {/* Certificate card */}
        <div className="bg-linear-to-br from-zinc-800 to-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">

          {/* Document header */}
          <div className="flex items-start justify-between px-7 pt-7 pb-6 border-b border-zinc-700">
            <div>
              <p className="text-[11px] font-semibold tracking-widest uppercase text-[#9CA3AF] mb-1">
                Certificate of {cert.role === "Guest" ? "Participation" : "Achievement"}
              </p>
              <h1
                className="text-3xl font-bold text-white leading-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {cert.recipientName}
              </h1>
              {cert.institution && (
                <p className="text-sm text-[#6B7280] mt-1">{cert.institution}</p>
              )}
            </div>
            <div
              className="shrink-0 ml-4 mt-1 flex items-center justify-center w-12 h-12 rounded-full"
              style={{ background: color.tint }}
            >
              <Medal className="w-6 h-6" style={{ color: color.primary }} />
            </div>
          </div>

          {/* Left-rule accent block — the signature detail */}
          <div
            className="mx-7 my-6 pl-4 border-l-[3px] rounded-sm"
            style={{ borderColor: color.primary }}
          >
            <p className="text-[11px] font-semibold tracking-widest uppercase mb-0.5"
              style={{ color: color.accent }}>
              {typeLabel}
            </p>
            <p className="text-base font-semibold text-white">{cert.eventTitle}</p>
            <p className="text-sm text-gray-400 mt-0.5">
              {format(new Date(cert.eventDate), "EEEE, d MMMM yyyy")}
              {cert.eventAddress && <span className="mx-1.5 text-[#D1D5DB]">·</span>}
              {cert.eventAddress}
            </p>
          </div>

          {/* Detail grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-linear-to-br from-zinc-800 to-zinc-900 border-t border-b border-zinc-700">
            {[
              { icon: Award,    label: "Role",           value: cert.role },
              { icon: Hash,     label: "Certificate ID", value: cert.certId, mono: true },
              { icon: Clock,    label: "Issued on",      value: format(new Date(cert.issuedAt), "d MMM yyyy") },
            ].map(({ icon: Icon, label, value, mono }) => (
              <div key={label} className="bg-linear-to-br from-zinc-800 to-zinc-900 px-5 py-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <Icon className="w-3.5 h-3.5 text-[#9CA3AF]" />
                  <p className="text-[11px] font-semibold tracking-wide uppercase text-[#9CA3AF]">{label}</p>
                </div>
                <p className={`text-sm font-semibold text-white leading-snug ${mono ? "font-mono text-xs" : ""}`}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="px-7 py-5 flex flex-wrap gap-2.5">
            {cert.pdfUrl && (
              <a
                href={cert.pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-amber-100 transition-colors"
                style={{ background: color.primary }}
              >
                <Download className="w-4 h-4" />
                Download PDF
              </a>
            )}
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-[#374151] bg-[#F9FAFB] border border-[#E5E7EB] hover:bg-[#F3F4F6] transition-colors"
            >
              <Link2 className="w-4 h-4" />
              {copied ? "Link copied" : "Copy link"}
            </button>
            <a
              href={`https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(cert.eventTitle)}&organizationName=CommunityFix&certUrl=${encodeURIComponent(window.location.href)}&certId=${cert.certId}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0A66C2] hover:bg-[#0958A8] text-amber-100 text-sm font-medium transition-colors"
            >
              Add to LinkedIn
            </a>
          </div>
        </div>

        {/* Verify another */}
        <div className="mt-4 text-center">
          <button
            onClick={() => { setState("idle"); setCert(null); navigate("/ver"); }}
            className="text-sm text-white hover:cursor-pointer transition-colors"
          >
            Verify another certificate
          </button>
        </div>
      </div>
    </Shell>
  );

  /* ─── Invalid ─── */
  if (state === "invalid") return (
    <Shell>
      <div className="max-w-lg mx-auto">
        <StatusCard
          icon={<XCircle className="w-6 h-6 text-[#DC2626]" />}
          bg="bg-[#FEF2F2]"
          border="border-[#FECACA]"
          title="Certificate not found"
          message={
            <>
              No record found for{" "}
              <code className="font-mono text-xs bg-[#FEE2E2] px-1.5 py-0.5 rounded">
                {certId || manualId}
              </code>
              . Please check the ID and try again.
            </>
          }
        />
        <SearchForm value={manualId} onChange={setManualId} onSubmit={handleSearch} loading={searching} />
      </div>
    </Shell>
  );

  /* ─── Error ─── */
  if (state === "error") return (
    <Shell>
      <div className="max-w-lg mx-auto">
        <StatusCard
          icon={<AlertTriangle className="w-6 h-6 text-[#D97706]" />}
          bg="bg-[#FFFBEB]"
          border="border-[#FDE68A]"
          title="Connection error"
          message="Could not reach the verification server. Check your connection and try again."
        />
        <SearchForm value={manualId} onChange={setManualId} onSubmit={handleSearch} loading={searching} />
      </div>
    </Shell>
  );

  /* ─── Idle ─── */
  return (
    <Shell>
      <div className="max-w-lg mx-auto">

        {/* Page heading */}
        <div className="mb-8">
          <div className="flex items-center gap-2.5 mb-4">
            <ShieldCheck className="w-6 h-6 text-emerald-500" />
            <h1 className="text-2xl font-bold text-emerald-500" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Certificate Verification
            </h1>
          </div>
          <p className="text-sm text-white leading-relaxed">
            Confirm the authenticity of any CommunityFix volunteer certificate.
            Enter the certificate ID from the recipient's email to view the full record.
          </p>
        </div>

        <SearchForm value={manualId} onChange={setManualId} onSubmit={handleSearch} loading={searching} />

        {/* How it works */}
        <div className="mt-8 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="px-5 py-3 bg-linear-to-br from-zinc-800 to-zinc-900 border-b border-zinc-800">
            <p className="text-[11px] font-semibold tracking-widest uppercase text-white">How it works</p>
          </div>
          <div>
            {[
              { icon: Search,       step: "01", title: "Enter the ID",      desc: "Paste the certificate ID from the volunteer's email." },
              { icon: Target,       step: "02", title: "Instant lookup",    desc: "Checked against our database in real time." },
              { icon: CheckCircle2, step: "03", title: "View full record",  desc: "See event details, role, and download the PDF." },
            ].map(({ icon: Icon, step, title, desc }) => (
              <div key={step} className="flex items-start gap-4 px-5 py-4 bg-linear-to-br from-zinc-800 to-zinc-900">
                <div className="shrink-0 w-8 h-8 rounded-full bg-[#F0FDF4] flex items-center justify-center mt-0.5">
                  <Icon className="w-4 h-4 text-[#2D6A4F]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="text-xs text-[#9CA3AF] mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Institution note */}
        <p className="mt-5 text-xs text-[#9CA3AF] leading-relaxed px-1">
          This page is publicly accessible. Schools, colleges, and employers can verify
          volunteer certificates without an account.
        </p>
      </div>
    </Shell>
  );
}

/* ─── Shell ─── */
function Shell({ children }) {
  return (
    <div
      className="min-h-screen bg-zinc-900 py-10 px-4"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap');
      `}</style>
      <div className="max-w-2xl mx-auto">
        {/* Nav */}
        <div className="flex items-center justify-between mb-10">
          <Link to="/" className="font-bold text-white text-base tracking-tight hover:text-emerald-500 transition-colors">
            Community<span className="text-emerald-500">Fix</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/dashboard/my-certificates" className="text-sm text-white hover:text-blue-500 transition-colors">
              My Certificates
            </Link>
            <Link
              to="/events"
              className="flex items-center gap-1.5 text-sm font-medium text-emerald-500 ">
              Events
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </nav>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ─── SearchForm ─── */
function SearchForm({ value, onChange, onSubmit, loading }) {
  return (
    <div className="bg-linear-to-br from-zinc-800 to-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm">
      <label className="block text-sm font-semibold text-white mb-3">Certificate ID</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          placeholder="e.g. CERT-2025-A3F9"
          className="flex-1 px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] text-sm font-mono bg-[#F9FAFB]
                     text-[#111827] placeholder-[#D1D5DB] focus:outline-none focus:border-[#2D6A4F]
                     focus:ring-2 focus:ring-[#2D6A4F]/10 uppercase tracking-wide transition"
          autoFocus
        />
        <button
          type="button"
          onClick={onSubmit}
          disabled={loading || !value.trim()}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#2D6A4F] hover:bg-[#1B4332] text-amber-100
                     rounded-lg text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Checking</>
            : <><Search className="w-4 h-4" /> Verify</>
          }
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-2.5">Format: CERT-YYYY-XXXX · Found in your certificate email</p>
    </div>
  );
}

/* ─── StatusCard ─── */
function StatusCard({ icon, bg, border, title, message }) {
  return (
    <div className={`flex items-start gap-4 ${bg} border ${border} rounded-xl p-5 mb-5`}>
      <div className="shrink-0 mt-0.5">{icon}</div>
      <div>
        <p className="text-sm font-semibold text-[#111827] mb-0.5">{title}</p>
        <p className="text-sm text-[#6B7280] leading-relaxed">{message}</p>
      </div>
    </div>
  );
}