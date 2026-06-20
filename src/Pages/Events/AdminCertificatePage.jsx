import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import { format, formatDistanceToNow } from "date-fns";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { use } from "react";
import { AuthContext } from "../AuthProvider/AuthContext";

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
    // console.log(eventInfo,certs, status)

  useEffect(() => {
    if (!user) return
    fetchAll()
  }, [id, user])
  /* ── Generate certificates ── */
  const handleGenerate = async () => {
    const remaining = (status?.attendedCount || 0) - (status?.certCount || 0);
    if (!window.confirm(
      `Generate ${remaining > 0 ? remaining : status?.attendedCount} certificate(s) for attended volunteers?\n\nEmails will be sent automatically after generation.`
    )) return;

    setGenerating(true);
    try {
      const res = await axiosSecure.post(
        `/admin/events/${id}/certificates/generate`,{})
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
    if (!window.confirm(`Resend certificate email to ${email}?`)) return;
    setResending(certId);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/events/${id}/certificates/${certId}/resend`,
        {}, { headers }
      );
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
        <div className="w-10 h-10 border-[3px] border-green-500 border-t-transparent rounded-full animate-spin"/>
      </div>
    </Shell>
  );

  /* ─── Main render ─── */
  return (
    <Shell>
      {/* ── Back button ── */}
      <button onClick={() => navigate(`/admin/events/${id}/manage`)}
        className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 mb-6 transition-colors group">
        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
        </svg>
        Back to Event Management
      </button>

      {/* ── Page header ── */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <span className="text-3xl">🏅</span>
            <h1 className="text-2xl font-bold text-stone-900" style={{ fontFamily:"Fraunces,serif" }}>
              Certificates
            </h1>
            {polling && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full font-medium animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"/>
                Generating...
              </span>
            )}
          </div>
          {eventInfo && (
            <p className="text-stone-500 text-sm">
              {eventInfo.title} · {format(new Date(eventInfo.date), "dd MMM yyyy")}
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => fetchAll()}
            className="px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-700 text-sm font-medium hover:bg-stone-50 transition-colors flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Refresh
          </button>
          <button onClick={exportCSV} disabled={certs.length === 0}
            className="px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-700 text-sm font-medium hover:bg-stone-50 transition-colors flex items-center gap-1.5 disabled:opacity-40">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* ── Stats cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard icon="✅" label="Attended"     value={status?.attendedCount || 0} color="blue"   />
        <StatCard icon="🏅" label="Certs Made"   value={status?.certCount     || 0} color="green"  />
        <StatCard icon="⏳" label="Pending"      value={status?.pending       || 0} color="amber"  />
        <StatCard icon="📧" label="Emails Sent"  value={status?.emailSentCount|| 0} color="purple" />
      </div>

      {/* ── Progress bar ── */}
      {status?.attendedCount > 0 && (
        <div className="bg-white rounded-2xl border border-stone-200 p-4 mb-6 shadow-sm">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-stone-700">Certificate generation progress</span>
            <span className="font-bold text-green-600">{certPercent}%</span>
          </div>
          <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-700"
              style={{ width: `${certPercent}%` }}
            />
          </div>
          <p className="text-xs text-stone-400 mt-2">
            {status.certCount} of {status.attendedCount} certificates generated
            {status.emailSentCount > 0 && ` · ${status.emailSentCount} emails sent`}
          </p>
        </div>
      )}

      {/* ── Generate CTA (if not all done) ── */}
      {!allGenerated && (status?.attendedCount || 0) > 0 && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50/50 border border-green-200 rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-4 flex-wrap">
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-2xl shrink-0">
              🚀
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-green-800 mb-1">
                {status?.certCount === 0 ? "Ready to Generate Certificates" : "Some Certificates Pending"}
              </h3>
              <p className="text-green-700 text-sm mb-4 leading-relaxed">
                <strong>{status?.attendedCount}</strong> volunteers attended this event.
                {status?.certCount > 0 && ` ${status.certCount} certificates already generated.`}
                {status?.pending > 0 && ` ${status.pending} remaining.`}
                {" "}Certificates are generated as PDF files and emailed automatically.
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <button onClick={handleGenerate} disabled={generating || polling}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-semibold text-sm transition-colors disabled:opacity-60 shadow-sm">
                  {generating
                    ? <><Spinner/> Starting...</>
                    : polling
                    ? <><Spinner/> Generating ({status?.certCount || 0}/{status?.attendedCount})...</>
                    : `🏅 Generate ${status?.pending > 0 ? `${status.pending} Remaining` : `All ${status?.attendedCount}`} Certificates`
                  }
                </button>
                {polling && (
                  <p className="text-xs text-green-600 font-medium animate-pulse">
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
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <span className="text-2xl">🎉</span>
          <div>
            <p className="font-semibold text-green-800 text-sm">
              All {status?.certCount} certificates generated!
            </p>
            <p className="text-green-600 text-xs mt-0.5">
              {allEmailed
                ? "All emails sent successfully."
                : `${emailPending} email(s) still pending — use Resend button for individual certs.`}
            </p>
          </div>
        </div>
      )}

      {/* ── Event not completed warning ── */}
      {eventInfo && eventInfo.status !== "completed" && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <p className="text-amber-800 text-sm">
            Certificates can only be generated for <strong>completed</strong> events.
            Current status: <strong>{eventInfo.status}</strong>.
          </p>
        </div>
      )}

      {/* ── Certificates table ── */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        {/* Table header */}
        <div className="p-4 border-b border-stone-100 flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" strokeWidth="2"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, cert ID..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-100"
            />
          </div>
          {search && (
            <button onClick={() => setSearch("")}
              className="px-3 py-2 text-xs text-stone-500 hover:text-stone-700 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors">
              ✕ Clear
            </button>
          )}
          <span className="text-xs text-stone-400 ml-auto">
            {filtered.length} / {certs.length} shown
          </span>
        </div>

        {/* Empty state */}
        {certs.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🏅</div>
            <p className="text-stone-500 text-sm mb-1">No certificates generated yet</p>
            <p className="text-stone-400 text-xs">
              {status?.attendedCount > 0
                ? "Click the Generate button above to create certificates."
                : "No volunteers attended this event yet."}
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-stone-400 text-sm">
            No results for &quot;{search}&quot;
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-100">
                  <Th>Recipient</Th>
                  <Th>Certificate ID</Th>
                  <Th>Role</Th>
                  <Th>Institution</Th>
                  <Th>Issued</Th>
                  <Th>Email Status</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {filtered.map((cert) => (
                  <CertRow
                    key={cert._id || cert.certId}
                    cert={cert}
                    eventId={id}
                    onResend={handleResend}
                    resending={resending === cert.certId}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table footer */}
        {certs.length > 0 && (
          <div className="px-5 py-3 border-t border-stone-100 flex items-center justify-between">
            <p className="text-xs text-stone-400">
              {certs.filter((c) => c.emailSent).length} of {certs.length} emails sent ·{" "}
              {certs.filter((c) => c.pdfUrl).length} PDFs uploaded
            </p>
            <button onClick={() => fetchAll(true)}
              className="text-xs text-green-600 hover:text-green-700 font-medium flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              Refresh
            </button>
          </div>
        )}
      </div>
    </Shell>
  );
}

/* ═══════════════════════════════════════
   CERTIFICATE ROW (table row)
═══════════════════════════════════════ */
function CertRow({ cert, eventId, onResend, resending }) {
  return (
    <tr className="hover:bg-stone-50/60 transition-colors">
      {/* Recipient */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs shrink-0">
            {cert.recipientName?.[0]?.toUpperCase() || "?"}
          </div>
          <div>
            <p className="text-sm font-semibold text-stone-800">{cert.recipientName}</p>
            <p className="text-xs text-stone-400">{cert.recipientEmail}</p>
          </div>
        </div>
      </td>

      {/* Cert ID */}
      <td className="px-4 py-3.5">
        <code className="text-xs font-mono font-bold text-stone-700 bg-stone-100 px-2 py-1 rounded">
          {cert.certId}
        </code>
      </td>

      {/* Role */}
      <td className="px-4 py-3.5">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
          cert.role === "Volunteer"
            ? "bg-green-100 text-green-700"
            : "bg-blue-100 text-blue-700"
        }`}>
          {cert.role}
        </span>
      </td>

      {/* Institution */}
      <td className="px-4 py-3.5">
        <span className="text-xs text-stone-500">{cert.institution || "—"}</span>
      </td>

      {/* Issued */}
      <td className="px-4 py-3.5">
        <p className="text-xs text-stone-600 font-medium">
          {format(new Date(cert.issuedAt), "dd MMM yyyy")}
        </p>
        <p className="text-[10px] text-stone-400">
          {formatDistanceToNow(new Date(cert.issuedAt), { addSuffix: true })}
        </p>
      </td>

      {/* Email status */}
      <td className="px-4 py-3.5">
        {cert.emailSent ? (
          <div>
            <span className="inline-flex items-center gap-1 text-xs text-green-600 font-semibold">
              ✅ Sent
            </span>
            {cert.emailSentAt && (
              <p className="text-[10px] text-stone-400 mt-0.5">
                {format(new Date(cert.emailSentAt), "dd MMM, h:mm a")}
              </p>
            )}
          </div>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs text-amber-600 font-semibold">
            ⏳ Pending
          </span>
        )}
      </td>

      {/* Actions */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-1.5">
          {/* Verify */}
          <Link to={`/verify/${cert.certId}`}
            title="Verify certificate"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-400 hover:bg-blue-50 hover:text-blue-600 transition-all text-sm">
            🔍
          </Link>

          {/* Download PDF */}
          {cert.pdfUrl ? (
            <a href={cert.pdfUrl} target="_blank" rel="noreferrer"
              title="Download PDF"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-400 hover:bg-green-50 hover:text-green-600 transition-all text-sm">
              ⬇️
            </a>
          ) : (
            <span className="w-8 h-8 flex items-center justify-center text-stone-200 text-sm" title="PDF not available">
              ⬇️
            </span>
          )}

          {/* Resend email */}
          <button
            onClick={() => onResend(cert.certId, cert.recipientEmail)}
            disabled={resending}
            title="Resend certificate email"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-400 hover:bg-amber-50 hover:text-amber-600 transition-all text-sm disabled:opacity-40 disabled:cursor-not-allowed">
            {resending ? <MiniSpinner/> : "📧"}
          </button>
        </div>
      </td>
    </tr>
  );
}

/* ─── Helpers ─── */
function Shell({ children }) {
  return (
    <div className="min-h-screen bg-[#f5f4f0] py-8 px-4" style={{ fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Fraunces:wght@700&display=swap');`}</style>
      <div className="max-w-6xl mx-auto">{children}</div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  const colors = {
    green:  "from-green-50  to-green-100/40  border-green-200/70  text-green-700",
    blue:   "from-blue-50   to-blue-100/40   border-blue-200/70   text-blue-700",
    amber:  "from-amber-50  to-amber-100/40  border-amber-200/70  text-amber-700",
    purple: "from-purple-50 to-purple-100/40 border-purple-200/70 text-purple-700",
  };
  return (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-2xl p-4 shadow-sm`}>
      <div className="text-2xl mb-2">{icon}</div>
      <p className="text-2xl font-bold" style={{ fontFamily:"Fraunces,serif" }}>{value}</p>
      <p className="text-xs font-medium opacity-70 mt-0.5">{label}</p>
    </div>
  );
}

function Th({ children }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-semibold text-stone-400 uppercase tracking-wide whitespace-nowrap">
      {children}
    </th>
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

function MiniSpinner() {
  return (
    <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
    </svg>
  );
}