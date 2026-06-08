import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { format } from "date-fns";

/* ═══════════════════════════════════════════
   WAITLIST MANAGEMENT PANEL
   Used inside Admin Event Management page.
   Props: eventId, eventTitle, maxVolunteers
═══════════════════════════════════════════ */
export default function WaitlistManagementPanel({ eventId, eventTitle, maxVolunteers }) {
  const [volunteers, setVolunteers] = useState([]);
  const [waitlist,   setWaitlist]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [tab,        setTab]        = useState("confirmed"); // confirmed | waitlist | attended
  const [search,     setSearch]     = useState("");

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [confirmedRes, waitlistRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/events/${eventId}/volunteers?waitlisted=false`, { headers }),
        axios.get(`${import.meta.env.VITE_API_URL}/events/${eventId}/waitlist`, { headers }),
      ]);
      setVolunteers(confirmedRes.data?.registrations || []);
      setWaitlist(waitlistRes.data?.waitlist || []);
    } catch {
      toast.error("Could not load volunteer data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, [eventId]);

  /* ── Counts ── */
  const attendedCount = volunteers.filter((v) => v.attended).length;
  const paidCount     = volunteers.filter((v) => v.paymentStatus === "paid").length;
  const pendingCount  = volunteers.filter((v) => v.paymentStatus === "pending").length;

  /* ── Filter by search ── */
  const filtered = (tab === "waitlist" ? waitlist : volunteers).filter((v) => {
    if (tab === "attended" && !v.attended) return false;
    const q = search.toLowerCase();
    return (
      v.name?.toLowerCase().includes(q) ||
      v.email?.toLowerCase().includes(q) ||
      v.institution?.toLowerCase().includes(q)
    );
  });

  /* ── Export CSV ── */
  const exportCSV = () => {
    const data = tab === "waitlist" ? waitlist : volunteers;
    const rows = [
      ["Name","Email","Phone","Institution","Age Group","Skills","Role","Payment","Attended","Registered At"],
      ...data.map((v) => [
        v.name, v.email, v.phone, v.institution, v.ageGroup,
        v.skills?.join("|") || "",
        v.role, v.paymentStatus, v.attended ? "Yes" : "No",
        format(new Date(v.createdAt), "dd/MM/yyyy HH:mm"),
      ]),
    ];
    const csv    = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob   = new Blob([csv], { type: "text/csv" });
    const url    = URL.createObjectURL(blob);
    const a      = document.createElement("a");
    a.href       = url;
    a.download   = `${eventTitle}-${tab}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported!");
  };

  /* ── Render ── */
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
      style={{ fontFamily: "'DM Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');`}</style>

      {/* Header */}
      <div className="p-5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-semibold text-gray-900 text-base">Volunteer Management</h2>
          <p className="text-xs text-gray-400 mt-0.5">{eventTitle}</p>
        </div>
        <button onClick={exportCSV}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200
                     text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          Export CSV
        </button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-100 border-b border-gray-100">
        <StatBox label="Confirmed" value={volunteers.length} max={maxVolunteers} color="green" />
        <StatBox label="Waitlist"  value={waitlist.length}   color="amber" />
        <StatBox label="Attended"  value={attendedCount}     color="blue" />
        <StatBox label="Paid"      value={paidCount} note={pendingCount > 0 ? `${pendingCount} pending` : null} color="purple" />
      </div>

      {/* Tabs + search */}
      <div className="p-4 border-b border-gray-100 flex flex-wrap gap-3 items-center">
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {[
            { id: "confirmed", label: `✅ Confirmed (${volunteers.length})` },
            { id: "waitlist",  label: `⏳ Waitlist (${waitlist.length})` },
            { id: "attended",  label: `🎫 Attended (${attendedCount})` },
          ].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                tab === t.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex-1 min-w-[180px]">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, institution..."
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none
                       focus:border-green-400 focus:ring-1 focus:ring-green-100" />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">
          {search ? `No results for "${search}"` : `No ${tab} registrations yet`}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {tab === "waitlist" && (
                  <Th>#</Th>
                )}
                <Th>Name</Th>
                <Th>Contact</Th>
                <Th>Institution</Th>
                <Th>Skills</Th>
                {tab !== "waitlist" && <Th>Payment</Th>}
                {tab !== "waitlist" && <Th>Attended</Th>}
                <Th>Registered</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((v) => (
                <tr key={v._id} className="hover:bg-gray-50/50 transition-colors">
                  {tab === "waitlist" && (
                    <Td>
                      <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs
                                       font-bold flex items-center justify-center">
                        {v.waitlistPosition}
                      </span>
                    </Td>
                  )}
                  <Td>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{v.name}</p>
                      <p className="text-xs text-gray-400">{v.role}</p>
                    </div>
                  </Td>
                  <Td>
                    <p className="text-xs text-gray-700">{v.email}</p>
                    <p className="text-xs text-gray-400">{v.phone}</p>
                  </Td>
                  <Td>
                    <p className="text-xs text-gray-700">{v.institution || "—"}</p>
                    <p className="text-xs text-gray-400">{v.ageGroup}</p>
                  </Td>
                  <Td>
                    <div className="flex flex-wrap gap-1">
                      {v.skills?.length > 0
                        ? v.skills.slice(0, 3).map((s) => (
                          <span key={s} className="text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded">
                            {s}
                          </span>
                        ))
                        : <span className="text-xs text-gray-300">—</span>
                      }
                    </div>
                  </Td>
                  {tab !== "waitlist" && (
                    <Td>
                      <PaymentBadge status={v.paymentStatus} />
                    </Td>
                  )}
                  {tab !== "waitlist" && (
                    <Td>
                      {v.attended ? (
                        <div>
                          <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                            ✅ Attended
                          </span>
                          {v.attendedAt && (
                            <p className="text-[10px] text-gray-400 mt-1">
                              {format(new Date(v.attendedAt), "h:mm a")}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </Td>
                  )}
                  <Td>
                    <p className="text-xs text-gray-500">
                      {format(new Date(v.createdAt), "dd MMM, h:mm a")}
                    </p>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-100 flex justify-between items-center">
        <p className="text-xs text-gray-400">
          Showing {filtered.length} of {tab === "waitlist" ? waitlist.length : volunteers.length} registrations
        </p>
        <button onClick={fetchAll}
          className="text-xs text-green-600 hover:text-green-700 font-medium flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          Refresh
        </button>
      </div>
    </div>
  );
}

/* ── Small helpers ── */
function StatBox({ label, value, max, color, note }) {
  const colors = {
    green:  "text-green-600",
    amber:  "text-amber-600",
    blue:   "text-blue-600",
    purple: "text-purple-600",
  };
  return (
    <div className="p-4 text-center">
      <p className={`text-2xl font-bold ${colors[color]}`}>{value}</p>
      {max && <p className="text-xs text-gray-400">/ {max}</p>}
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
      {note && <p className="text-[10px] text-amber-500 mt-0.5">{note}</p>}
    </div>
  );
}

function PaymentBadge({ status }) {
  const styles = {
    "not-required": "bg-gray-100 text-gray-500",
    "pending":      "bg-amber-100 text-amber-700",
    "paid":         "bg-green-100 text-green-700",
    "refunded":     "bg-blue-100 text-blue-700",
  };
  const labels = {
    "not-required": "Free",
    "pending":      "⏳ Pending",
    "paid":         "✅ Paid",
    "refunded":     "↩ Refunded",
  };
  return (
    <span className={`text-xs px-2 py-1 rounded-full font-medium ${styles[status] || styles["not-required"]}`}>
      {labels[status] || status}
    </span>
  );
}

function Th({ children }) {
  return <th className="px-4 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{children}</th>;
}
function Td({ children }) {
  return <td className="px-4 py-3 align-top">{children}</td>;
}