import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import { format, formatDistanceToNow } from "date-fns";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { use } from "react";
import { AuthContext } from "../AuthProvider/AuthContext";
import { 
  ArrowLeft, 
  RefreshCw, 
  Download, 
  Search, 
  X, 
  ChevronRight,
  Loader2,
  CheckCircle2,
  Clock,
  Mail,
  Users,
  Award,
  Eye,
  FileDown,
  Send,
  AlertCircle,
  Sparkles,
  FilePlusCorner
} from "lucide-react";

/* ═══════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════ */
export default function AdminCertificatesPage() {
  const { id }   = useParams(); // eventId
  const navigate = useNavigate();

  const [eventInfo,   setEventInfo]   = useState(null);
  const [status,      setStatus]      = useState(null);  // { attendedCount, certCount, pending, ready, emailSentCount }
  const [certs,       setCerts]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [generating,  setGenerating]  = useState(false);
  const [polling,     setPolling]     = useState(false);
  const [search,      setSearch]      = useState("");
  const [resending,   setResending]   = useState(null);  // certId being resent
  const axiosSecure = useAxiosSecure()
  const [showSigModal, setShowSigModal] = useState(false);
  const [sigUrl,       setSigUrl]       = useState("");
  const [sigValid,     setSigValid]     = useState(null); // null | true | false
  const [sigChecking,  setSigChecking]  = useState(false);
  const [resendModal, setResendModal] = useState(null)
  const {user} = use(AuthContext)

  const token   = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  /* ── Fetch all data ── */
  const fetchAll = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [statusRes, certsRes, eventRes] = await Promise.allSettled([
        axiosSecure.get(`/admin/events/${id}/certificates/status`),
        axiosSecure.get(`/admin/events/${id}/certificates`),
        axiosSecure.get(`/admin/event/${id}/detail`)
      ]);

      if (statusRes.status === "fulfilled") setStatus(statusRes.value.data);
      if (certsRes.status === "fulfilled")  setCerts(certsRes.value.data.certificates || []);
      if (eventRes.status === "fulfilled")  setEventInfo(eventRes.value.data?.event || null);

    } catch {
      if (!silent) toast.error("Could not load certificate data");
    } finally {
      if (!silent) setLoading(false);
    }
  }, [id, axiosSecure]);

  useEffect(() => {
    if (!user) return
    fetchAll()
  }, [id, user])

  /* ── Generate certificates ── */
  const handleGenerate = async (signatureUrl = "") => {
    setShowSigModal(false)
    const remaining = (status?.attendedCount || 0) - (status?.certCount || 0);
    if (!window.confirm(
      `Generate ${remaining > 0 ? remaining : status?.attendedCount} certificate(s) for attended volunteers?\n\nEmails will be sent automatically after generation.`
    )) return;

    setGenerating(true);
    try {
      const res = await axiosSecure.post(
        `/admin/events/${id}/certificates/generate`,{signatureUrl})
      toast.success(res.data.message);

      // Poll every 5s for up to 3 minutes
      setPolling(true);
      let attempts = 0;
      const interval = setInterval(async () => {
        attempts++;
        await fetchAll(true);
        if (attempts >= 36) {
          clearInterval(interval);
          setPolling(false);
          toast.info("Generation complete or timed out. Check results.");
        }
      }, 5000);

    } catch (err) {
      toast.error(err.response?.data?.message || "Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  /* ── Resend one email ── */
  const handleResend = async (certId, email) => {
    setResendModal(null)
    setResending(certId);
    try {
      await axiosSecure.post(
        `/admin/events/${id}/certificates/${certId}/resend`,{overrideEmail: email})
      toast.success(`Certificate resent to ${email}`);
      fetchAll(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Resend failed");
    } finally {
      setResending(null);
    }
  };

  /* ── Export CSV ── */
  const exportCSV = () => {
    if (certs.length === 0) { toast.info("No certificates to export"); return; }
    const rows = [
      ["Cert ID","Recipient Name","Email","Role","Institution","Event Title","Event Date","Issued On","Email Sent","PDF URL"],
      ...filtered.map((c) => [
        c.certId,
        c.recipientName,
        c.recipientEmail,
        c.role,
        c.institution || "",
        c.eventTitle,
        format(new Date(c.eventDate), "dd/MM/yyyy"),
        format(new Date(c.issuedAt),  "dd/MM/yyyy HH:mm"),
        c.emailSent ? "Yes" : "No",
        c.pdfUrl    || "",
      ]),
    ];
    const csv  = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a    = document.createElement("a");
    a.href     = URL.createObjectURL(blob);
    a.download = `certificates-${id}-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast.success(`${filtered.length} certificates exported!`);
  };

  /* ── Filtered list ── */
  const filtered = certs.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.recipientName?.toLowerCase().includes(q)  ||
      c.recipientEmail?.toLowerCase().includes(q) ||
      c.certId?.toLowerCase().includes(q)         ||
      c.institution?.toLowerCase().includes(q)
    );
  });

  /* ── Derived states ── */
  const allGenerated  = status && status.certCount >= status.attendedCount && status.attendedCount > 0;
  const allEmailed    = certs.length > 0 && certs.every((c) => c.emailSent);
  const emailPending  = certs.filter((c) => !c.emailSent).length;
  const certPercent   = status?.attendedCount > 0
    ? Math.round((status.certCount / status.attendedCount) * 100) : 0;

  /* ─── Loading ─── */
  if (loading) return (
    <Shell>
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-white animate-spin" />
      </div>
    </Shell>
  );

  /* ─── Main render ─── */
  return (
    <Shell>
      {/* ── Back button ── */}
      <button onClick={() => navigate(`/dashboard/admin/events`)}
        className="flex items-center gap-1.5 text-sm text-white hover:cursor-pointer mb-6 transition-colors group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Event Management
      </button>

      {/* ── Page header ── */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <Award className="w-8 h-8 text-white" />
            <h1 className="text-2xl font-bold text-white">
              Certificates
            </h1>
            {polling && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-white/10 text-white/90 px-3 py-1.5 rounded-full font-medium animate-pulse border border-white/10">
                <Loader2 className="w-3 h-3 animate-spin" />
                Generating...
              </span>
            )}
          </div>
          {eventInfo && (
            <p className="text-zinc-400 text-sm">
              {eventInfo.title} · {format(new Date(eventInfo.date), "dd MMM yyyy")}
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => fetchAll()}
            className="px-4 py-2.5 rounded-xl border border-zinc-700 bg-linear-to-b from-zinc-950 to-zinc-900 text-white text-sm font-medium hover:cursor-pointer transition-colors flex items-center gap-1.5">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button onClick={exportCSV} disabled={certs.length === 0}
            className="px-4 py-2.5 rounded-xl border border-zinc-700 bg-linear-to-b from-zinc-950 to-zinc-900 text-white text-sm font-medium hover:cursor-pointer transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* ── Stats cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<Users className="w-5 h-5" />} label="Attended" value={status?.attendedCount || 0} color="blue" />
        <StatCard icon={<Award className="w-5 h-5" />} label="Certs Made" value={status?.certCount || 0} color="green" />
        <StatCard icon={<Clock className="w-5 h-5" />} label="Pending" value={status?.pending || 0} color="amber" />
        <StatCard icon={<Mail className="w-5 h-5" />} label="Emails Sent" value={status?.emailSentCount || 0} color="purple" />
      </div>

      {/* ── Progress bar ── */}
      {status?.attendedCount > 0 && (
        <div className="border border-zinc-700 rounded-2xl p-4 mb-6 shadow-sm bg-linear-to-b from-zinc-950 to-zinc-900">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-white">Certificate generation progress</span>
            <span className="font-bold text-green-400">{certPercent}%</span>
          </div>
          <div className="h-3 bg-zinc-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-700"
              style={{ width: `${certPercent}%` }}
            />
          </div>
          <p className="text-xs text-zinc-500 mt-2">
            {status.certCount} of {status.attendedCount} certificates generated
            {status.emailSentCount > 0 && ` · ${status.emailSentCount} emails sent`}
          </p>
        </div>
      )}

      {/* ── Generate CTA (if not all done) ── */}
      {!allGenerated && (status?.attendedCount || 0) > 0 && (
        <div className="bg-linear-to-b from-zinc-950 to-zinc-900 border border-zinc-700 rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-4 flex-wrap">
            <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center text-2xl shrink-0">
              <FilePlusCorner className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white mb-1">
                {status?.certCount === 0 ? "Ready to Generate Certificates" : "Some Certificates Pending"}
              </h3>
              <p className="text-zinc-400 text-sm mb-4 leading-relaxed">
                <strong className="text-white">{status?.attendedCount}</strong> volunteers attended this event.
                {status?.certCount > 0 && ` ${status.certCount} certificates already generated.`}
                {status?.pending > 0 && ` ${status.pending} remaining.`}
                {" "}Certificates are generated as PDF files and emailed automatically.
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <button onClick={()=> {setShowSigModal(true)}} disabled={generating || polling}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-zinc-900 rounded-2xl font-semibold text-sm transition-colors hover:bg-zinc-200 disabled:opacity-60 shadow-sm">
                  {generating
                    ? <><Loader2 className="w-4 h-4 animate-spin"/> Starting...</>
                    : polling
                    ? <><Loader2 className="w-4 h-4 animate-spin"/> Generating ({status?.certCount || 0}/{status?.attendedCount})...</>
                    : `🏅 Generate ${status?.pending > 0 ? `${status.pending} Remaining` : `All ${status?.attendedCount}`} Certificates`
                  }
                </button>
                {polling && (
                  <p className="text-xs text-zinc-400 font-medium animate-pulse">
                    This may take a few minutes. Page updates automatically.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── All done banner ── */}
      {allGenerated && (
        <div className="bg-linear-to-b from-zinc-950 to-zinc-900 border border-zinc-700 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-green-400" />
          <div>
            <p className="font-semibold text-white text-sm">
              All {status?.certCount} certificates generated!
            </p>
            <p className="text-zinc-400 text-xs mt-0.5">
              {allEmailed
                ? "All emails sent successfully."
                : `${emailPending} email(s) still pending — use Resend button for individual certs.`}
            </p>
          </div>
        </div>
      )}

      {/* ── Event not completed warning ── */}
      {eventInfo && eventInfo.status !== "completed" && (
        <div className="bg-linear-to-b from-zinc-950 to-zinc-900 border border-zinc-700 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400" />
          <p className="text-white text-sm">
            Certificates can only be generated for <strong className="text-white">completed</strong> events.
            Current status: <strong className="text-white">{eventInfo.status}</strong>.
          </p>
        </div>
      )}

      {/* ── Certificates table ── */}
      <div className="border border-zinc-700 rounded-2xl shadow-sm overflow-hidden bg-linear-to-b from-zinc-950 to-zinc-900">
        {/* Table header */}
        <div className="p-4 border-b border-zinc-700 flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-50">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, cert ID..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-zinc-700 bg-zinc-900/50 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20"
            />
          </div>
          {search && (
            <button onClick={() => setSearch("")}
              className="px-3 py-2 text-xs text-zinc-400 hover:text-white border border-zinc-700 rounded-xl hover:bg-zinc-800 transition-colors">
              <X className="w-3 h-3" />
            </button>
          )}
          <span className="text-xs text-zinc-500 ml-auto">
            {filtered.length} / {certs.length} shown
          </span>
        </div>

        {/* Empty state */}
        {certs.length === 0 ? (
          <div className="text-center py-20">
            <Award className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-400 text-sm mb-1">No certificates generated yet</p>
            <p className="text-zinc-500 text-xs">
              {status?.attendedCount > 0
                ? "Click the Generate button above to create certificates."
                : "No volunteers attended this event yet."}
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 text-sm">
            No results for "{search}"
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-700 bg-linear-to-b from-zinc-950 to-zinc-900">
                  <Th>Recipient</Th>
                  <Th>Certificate ID</Th>
                  <Th>Role</Th>
                  <Th>Institution</Th>
                  <Th>Issued</Th>
                  <Th>Email Status</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-700/50">
                {filtered.map((cert) => (
                  <CertRow
                    key={cert._id || cert.certId}
                    cert={cert}
                    eventId={id}
                    onResendClick={(cert) => setResendModal(cert)}
                    resending={resending === cert.certId}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table footer */}
        {certs.length > 0 && (
          <div className="px-5 py-3 border-t border-zinc-700 flex items-center justify-between">
            <p className="text-xs text-zinc-500">
              {certs.filter((c) => c.emailSent).length} of {certs.length} emails sent ·{" "}
              {certs.filter((c) => c.pdfUrl).length} PDFs uploaded
            </p>
            <button onClick={() => fetchAll(true)}
              className="text-xs text-blue-600 hover:cursor-pointer font-medium flex items-center gap-1">
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
          </div>
        )}
      </div>

      {/* signature url model show */}
      {showSigModal && (
        <SignatureModal
          onConfirm={handleGenerate}
          onClose={() => setShowSigModal(false)}
        />
      )}

      {/* resent with custom email modal */}
      {resendModal && (
      <ResendEmailModal
        cert={resendModal}
        onConfirm={handleResend}
        onClose={() => setResendModal(null)}
        sending={resending === resendModal.certId}
      />
    )}

    </Shell>
  );
}

/* ═══════════════════════════════════════
   CERTIFICATE ROW (table row)
═══════════════════════════════════════ */
function CertRow({ cert, eventId, onResendClick, resending }) {
  return (
    <tr className="hover:bg-zinc-800/10 transition-colors">
      {/* Recipient */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-white font-bold text-xs shrink-0">
            {cert.recipientName?.[0]?.toUpperCase() || "?"}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{cert.recipientName}</p>
            <p className="text-xs text-zinc-400">{cert.recipientEmail}</p>
          </div>
        </div>
      </td>

      {/* Cert ID */}
      <td className="px-4 py-3.5">
        <code className="text-xs font-mono font-bold text-white bg-zinc-800 px-2 py-1 rounded">
          {cert.certId}
        </code>
      </td>

      {/* Role */}
      <td className="px-4 py-3.5">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
          cert.role === "Volunteer"
            ? "bg-zinc-800 text-white"
            : "bg-zinc-800/50 text-white"
        }`}>
          {cert.role}
        </span>
      </td>

      {/* Institution */}
      <td className="px-4 py-3.5">
        <span className="text-xs text-zinc-400">{cert.institution || "—"}</span>
      </td>

      {/* Issued */}
      <td className="px-4 py-3.5">
        <p className="text-xs text-white font-medium">
          {format(new Date(cert.issuedAt), "dd MMM yyyy")}
        </p>
        <p className="text-[10px] text-zinc-500">
          {formatDistanceToNow(new Date(cert.issuedAt), { addSuffix: true })}
        </p>
      </td>

      {/* Email status */}
      <td className="px-4 py-3.5">
        {cert.emailSent ? (
          <div>
            <span className="inline-flex items-center gap-1 text-xs text-green-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Sent
            </span>
            {cert.emailSentAt && (
              <p className="text-[10px] text-zinc-500 mt-0.5">
                {format(new Date(cert.emailSentAt), "dd MMM, h:mm a")}
              </p>
            )}
          </div>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs text-amber-400 font-semibold">
            <Clock className="w-3.5 h-3.5" />
            Pending
          </span>
        )}
      </td>

      {/* Actions */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-1.5">
          {/* Verify */}
          <Link to={`/verify/${cert.certId}`}
            title="Verify certificate"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-800 hover:text-white transition-all">
            <Eye className="w-4 h-4" />
          </Link>

          {/* Download PDF */}
          {cert.pdfUrl ? (
            <a href={cert.pdfUrl} target="_blank" rel="noreferrer"
              title="Download PDF"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-800 hover:text-white transition-all">
              <FileDown className="w-4 h-4" />
            </a>
          ) : (
            <span className="w-8 h-8 flex items-center justify-center text-zinc-700" title="PDF not available">
              <FileDown className="w-4 h-4" />
            </span>
          )}

          {/* Resend email */}
          <button
            onClick={() => onResendClick(cert)}
            disabled={resending}
            title="Resend certificate email"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-800 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed">
            {resending ? <Loader2 className="w-3.5 h-3.5 animate-spin"/> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </td>
    </tr>
  );
}

/* ─── Helpers ─── */
function Shell({ children }) {
  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-950 to-zinc-900 py-8 px-4">
      <div className="max-w-6xl mx-auto text-white">{children}</div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  const colors = {
    green:  "border-zinc-700 bg-zinc-900/30 text-green-400",
    blue:   "border-zinc-700 bg-zinc-900/30 text-blue-400",
    amber:  "border-zinc-700 bg-zinc-900/30 text-amber-400",
    purple: "border-zinc-700 bg-zinc-900/30 text-purple-400",
  };
  return (
    <div className={`border ${colors[color]} bg-linear-to-b from-zinc-950 to-zinc-900 rounded-2xl p-4 shadow-sm`}>
      <div className="mb-2">{icon}</div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs font-medium text-zinc-400 mt-0.5">{label}</p>
    </div>
  );
}

function Th({ children }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wide whitespace-nowrap">
      {children}
    </th>
  );
}

function SignatureModal({ onConfirm, onClose }) {
  const [url,      setUrl]      = useState("");
  const [valid,    setValid]    = useState(null);   // null | true | false
  const [checking, setChecking] = useState(false);

  const checkImage = (src) => {
    if (!src.trim()) { setValid(null); return; }
    setChecking(true);
    const img = new Image();
    img.onload  = () => { setValid(true);  setChecking(false); };
    img.onerror = () => { setValid(false); setChecking(false); };
    img.src = src;
  };

  const handleChange = (e) => {
    setUrl(e.target.value);
    setValid(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="border border-zinc-700 rounded-2xl shadow-xl w-full max-w-md p-6 bg-zinc-900">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-white">
              ✍️ Signature
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Paste an image URL to add your signature to the certificate
            </p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* URL Input */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1.5 block">
            Signature Image URL
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={url}
              onChange={handleChange}
              placeholder="https://example.com/signature.png"
              className="flex-1 px-3 py-2.5 rounded-xl border border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20"
            />
            <button
              onClick={() => checkImage(url)}
              disabled={!url.trim() || checking}
              className="px-3 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              {checking ? <Loader2 className="w-4 h-4 animate-spin"/> : "Check"}
            </button>
          </div>
        </div>

        {/* Preview */}
        {valid === true && (
          <div className="mb-4 p-3 bg-zinc-800/50 border border-zinc-700 rounded-xl">
            <p className="text-xs text-green-400 font-semibold mb-2">✅ Valid image — preview:</p>
            <div className="bg-zinc-800 rounded-lg p-3 flex items-center justify-center border border-zinc-700 min-h-20">
              <img src={url} alt="Signature preview"
                className="max-h-17.5 max-w-full object-contain"/>
            </div>
          </div>
        )}

        {valid === false && (
          <div className="mb-4 p-3 bg-zinc-800/50 border border-zinc-700 rounded-xl">
            <p className="text-xs text-red-400 font-semibold">
              ❌ Invalid image URL — signature will be skipped
            </p>
          </div>
        )}

        {/* Info note */}
        <p className="text-xs text-zinc-500 mb-5 leading-relaxed">
          Leave empty to generate certificates without a signature.
          PNG with transparent background works best.
        </p>

        {/* Buttons */}
        <div className="flex gap-2">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-white text-sm font-medium hover:bg-red-500 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => onConfirm(valid === true ? url : "")}
            className="flex-1 py-2.5 rounded-xl bg-white text-zinc-900 text-sm font-semibold transition-colors hover:bg-zinc-200 shadow-sm">
            🏅 Generate Certificates
          </button>
        </div>
      </div>
    </div>
  );
}

function ResendEmailModal({ cert, onConfirm, onClose, sending }) {
  const [email, setEmail] = useState(cert.recipientEmail);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="border border-zinc-700 rounded-2xl shadow-xl w-full max-w-sm p-6 bg-zinc-900">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white">
            📧 Resend Certificate
          </h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-zinc-400 mb-3">{cert.recipientName} · {cert.certId}</p>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 mb-4"
        />

        <div className="flex gap-2">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-white text-sm font-medium hover:bg-red-500 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => onConfirm(cert.certId, email)}
            disabled={!email.trim() || sending}
            className="flex-1 py-2.5 rounded-xl bg-white text-zinc-900 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors">
            {sending ? <><Loader2 className="w-4 h-4 animate-spin"/> Sending...</> : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}