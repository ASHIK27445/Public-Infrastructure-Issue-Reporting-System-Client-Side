import { useState, useEffect, useCallback, use } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import { format, formatDistanceToNow } from "date-fns";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { AuthContext } from "../AuthProvider/AuthContext";

/* ─── Constants ─── */
const TYPE_EMOJI = {
  cleanup:"🧹", plantation:"🌳", repair:"🏗️",
  awareness:"📢", student:"🎓", meetup:"🤝",
};
const TYPE_LABEL = {
  cleanup:"Cleanup", plantation:"Plantation", repair:"Repair",
  awareness:"Awareness", student:"Student Day", meetup:"Meetup",
};
const STATUS_STYLE = {
  upcoming:  { bg:"bg-green-100",  text:"text-green-700",  dot:"bg-green-500",  label:"Upcoming"  },
  ongoing:   { bg:"bg-blue-100",   text:"text-blue-700",   dot:"bg-blue-500",   label:"🔴 Live"   },
  completed: { bg:"bg-stone-100",  text:"text-stone-600",  dot:"bg-stone-400",  label:"Completed" },
  cancelled: { bg:"bg-red-100",    text:"text-red-700",    dot:"bg-red-500",    label:"Cancelled" },
  draft:     { bg:"bg-yellow-100", text:"text-yellow-700", dot:"bg-yellow-500", label:"Draft"     },
};

/* ═══════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════ */
export default function AdminEventsPage() {
  const navigate       = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [stats,    setStats]    = useState(null);
  const [events,   setEvents]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [total,    setTotal]    = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [deleting, setDeleting] = useState(null);

  const status = searchParams.get("status") || "all";
  const type   = searchParams.get("type")   || "all";
  const page   = Number(searchParams.get("page") || 1);
  const search = searchParams.get("search") || "";
  const [searchInput, setSearchInput] = useState(search);
  const axiosSecure = useAxiosSecure()
  const {user} = use(AuthContext)

  const token   = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  /* ── Fetch stats ── */
  useEffect(() => {
    if(!user)return;
    axiosSecure.get('/admin/events/stats')
      .then((r) => setStats(r.data))
      .catch(() => toast.error("Could not load stats"))
      .finally(() => setStatsLoading(false));
  }, [user]);


  /* ── Fetch events ── */
  const fetchEvents = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (status !== "all") params.set("status", status);
      if (type   !== "all") params.set("type",   type);
      if (search)           params.set("search", search);

      const res = await axiosSecure.get(`/admin/events?${params}`);
      setEvents(res.data.events || []);
      setTotal(res.data.total || 0);
      setTotalPages(res.data.totalPages || 1);
    } catch { toast.error("Could not load events"); }
    finally   { setLoading(false); }
  }, [status, type, page, search, user]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  /* ── Helpers ── */
  const setParam = (key, val) => {
    const next = new URLSearchParams(searchParams);
    if (val && val !== "all") next.set(key, val); else next.delete(key);
    next.delete("page");
    setSearchParams(next);
  };
  const setPage = (p) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", p);
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setParam("search", searchInput.trim());
  };

  const handleStatusChange = async (eventId, newStatus) => {
    const confirmMsg = newStatus === "cancelled"
      ? "Cancel this event? All paid registrations will be refunded."
      : `Change status to "${newStatus}"?`;
    if (!window.confirm(confirmMsg)) return;
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/admin/events/${eventId}/status`,
        { status: newStatus }, { headers }
      );
      toast.success(`Status → ${newStatus}`);
      fetchEvents();
    } catch (err) { toast.error(err.response?.data?.message || "Update failed"); }
  };

  const handleDelete = async (eventId, title) => {
    if (!window.confirm(`Delete "${title}"? This will remove all registrations, donations and comments. This cannot be undone.`)) return;
    setDeleting(eventId);
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/admin/events/${eventId}`, { headers });
      toast.success("Event deleted");
      fetchEvents();
    } catch (err) { toast.error(err.response?.data?.message || "Delete failed"); }
    finally { setDeleting(null); }
  };

  /* ─────────── RENDER ─────────── */
  return (
    <div className="min-h-screen bg-[#f5f4f0]" style={{ fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Fraunces:wght@600;700;800&display=swap');`}</style>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-stone-900" style={{ fontFamily:"Fraunces,serif" }}>
              Event Management
            </h1>
            <p className="text-stone-500 text-sm mt-1">
              Manage all community events, volunteers, and donations
            </p>
          </div>
          <Link to="/admin/events/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-600
                       text-white font-semibold rounded-2xl transition-colors shadow-sm text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/>
            </svg>
            Create Event
          </Link>
        </div>

        {/* ── Stats overview ── */}
        {statsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-stone-200 p-5 animate-pulse">
                <div className="h-8 bg-stone-100 rounded-lg w-16 mb-2"/>
                <div className="h-4 bg-stone-100 rounded w-24"/>
              </div>
            ))}
          </div>
        ) : stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard icon="🗓️" label="Total Events"  value={stats.overview.totalEvents}    color="stone"  />
            <StatCard icon="🔴" label="Live Now"       value={stats.overview.ongoingCount}   color="blue"   />
            <StatCard icon="✅" label="Upcoming"       value={stats.overview.upcomingCount}  color="green"  />
            <StatCard icon="🎉" label="Completed"      value={stats.overview.completedCount} color="purple" />
            <StatCard icon="🙋" label="Volunteers"     value={stats.overview.totalVolunteers}  color="green"  />
            <StatCard icon="⏳" label="Waitlisted"     value={stats.overview.totalWaitlisted}  color="amber"  />
            <StatCard icon="💰" label="Total Donated"  value={`৳${(stats.overview.totalDonated||0).toLocaleString()}`} color="emerald" />
            <StatCard icon="❌" label="Cancelled"      value={stats.overview.cancelledCount} color="red"    />
            <StatCard icon="🎟️" label="Free Participants" value={stats.overview.totalParticipants || 0} color="teal" />
          </div>
        )}

        {/* ── Type breakdown mini chart ── */}
        {stats?.typeBreakdown?.length > 0 && (
          <div className="bg-white rounded-2xl border border-stone-200 p-5 mb-6">
            <h3 className="text-sm font-semibold text-stone-500 mb-4">Events by Type</h3>
            <div className="flex gap-3 flex-wrap">
              {stats.typeBreakdown.map((t) => (
                <button key={t._id} onClick={() => setParam("type", t._id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all ${
                    type === t._id
                      ? "bg-green-500 text-white border-green-500"
                      : "bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-300"
                  }`}>
                  <span>{TYPE_EMOJI[t._id] || "📅"}</span>
                  <span className="font-medium">{TYPE_LABEL[t._id] || t._id}</span>
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${type === t._id ? "bg-white/20" : "bg-stone-200 text-stone-600"}`}>
                    {t.count}
                  </span>
                </button>
              ))}
              {type !== "all" && (
                <button onClick={() => setParam("type", "all")}
                  className="text-xs text-stone-400 hover:text-red-500 transition-colors px-2">
                  ✕ Clear
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Filters row ── */}
        <div className="flex flex-wrap gap-3 mb-5 items-center">
          {/* Status tabs */}
          <div className="flex gap-1 bg-white rounded-xl border border-stone-200 p-1">
            {["all","upcoming","ongoing","completed","cancelled","draft"].map((s) => (
              <button key={s} onClick={() => setParam("status", s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                  status === s
                    ? "bg-green-500 text-white shadow-sm"
                    : "text-stone-500 hover:text-stone-700 hover:bg-stone-50"
                }`}>
                {s === "all" ? "All" : s === "ongoing" ? "🔴 Live" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2 ml-auto">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" strokeWidth="2"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35"/>
              </svg>
              <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search events..."
                className="pl-9 pr-4 py-2 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:border-green-400 w-56" />
            </div>
            <button type="submit"
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-medium transition-colors">
              Search
            </button>
            {search && (
              <button type="button" onClick={() => { setSearchInput(""); setParam("search", ""); }}
                className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl text-sm transition-colors">
                ✕
              </button>
            )}
          </form>
        </div>

        {/* Result count */}
        {!loading && (
          <p className="text-sm text-stone-500 mb-4">
            <span className="font-semibold text-stone-800">{total}</span> events found
          </p>
        )}

        {/* ── Events table ── */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-[3px] border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🌿</div>
              <p className="text-stone-500 text-sm">No events found</p>
              {(search || status !== "all" || type !== "all") && (
                <button onClick={() => setSearchParams(new URLSearchParams())}
                  className="mt-3 text-sm text-green-600 hover:underline">
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-100">
                    <Th>Event</Th>
                    <Th>Type</Th>
                    <Th>Date</Th>
                    <Th>Volunteers</Th>
                    <Th>Donations</Th>
                    <Th>Status</Th>
                    <Th>Actions</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {events.map((event) => (
                    <EventRow
                      key={event._id}
                      event={event}
                      onStatusChange={handleStatusChange}
                      onDelete={handleDelete}
                      deleting={deleting === event._id}
                      navigate={navigate}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Pagination ── */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <PageBtn onClick={() => setPage(1)}      disabled={page===1}         label="«" />
            <PageBtn onClick={() => setPage(page-1)} disabled={page===1}         label="‹" />
            {Array.from({ length: totalPages }, (_, i) => i+1)
              .filter((p) => p===1 || p===totalPages || Math.abs(p-page)<=1)
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx-1] > 1) acc.push("…");
                acc.push(p); return acc;
              }, [])
              .map((p, i) => p === "…"
                ? <span key={`d${i}`} className="px-2 text-stone-400 text-sm">…</span>
                : <button key={p} onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${
                      p===page ? "bg-green-500 text-white shadow-sm" : "bg-white border border-stone-200 text-stone-700 hover:bg-stone-50"
                    }`}>{p}</button>
              )}
            <PageBtn onClick={() => setPage(page+1)} disabled={page===totalPages} label="›" />
            <PageBtn onClick={() => setPage(totalPages)} disabled={page===totalPages} label="»" />
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   EVENT ROW
═══════════════════════════════════════ */
function EventRow({ event, onStatusChange, onDelete, deleting, navigate }) {
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const st     = STATUS_STYLE[event.status] || STATUS_STYLE.upcoming;
  const date   = new Date(event.date);
  const isPast = date < new Date();

  const nextStatuses = {
    draft:     ["upcoming","cancelled"],
    upcoming:  ["ongoing","cancelled"],
    ongoing:   ["completed","cancelled"],
    completed: [],
    cancelled: [],
  };
  const available = nextStatuses[event.status] || [];

  return (
    <tr className="hover:bg-stone-50/70 transition-colors group">
      {/* Event name */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          {event.coverImage ? (
            <img src={event.coverImage} alt="" className="w-10 h-10 rounded-xl object-cover shrink-0 border border-stone-100"
              onError={(e) => { e.target.style.display="none"; }} />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-xl shrink-0">
              {TYPE_EMOJI[event.eventType] || "📅"}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-semibold text-stone-900 text-sm truncate max-w-[180px]">{event.title}</p>
            <p className="text-xs text-stone-400 truncate max-w-[180px]">{event.location?.address}</p>
          </div>
        </div>
      </td>

      {/* Type */}
      <td className="px-4 py-3.5">
        <span className="text-xs text-stone-600 bg-stone-100 px-2.5 py-1 rounded-full font-medium">
          {TYPE_EMOJI[event.eventType]} {TYPE_LABEL[event.eventType] || event.eventType}
        </span>
      </td>

      {/* Date */}
      <td className="px-4 py-3.5">
        <p className="text-sm text-stone-700 font-medium">{format(date, "dd MMM yyyy")}</p>
        <p className="text-xs text-stone-400">
          {isPast ? formatDistanceToNow(date, { addSuffix: true }) : `in ${formatDistanceToNow(date)}`}
        </p>
      </td>

      {/* Volunteers */}
      <td className="px-4 py-3.5">
        <div className="text-sm">
          <span className="font-bold text-stone-800">{event.volunteerCount || 0}</span>
          <span className="text-stone-400">/{event.maxVolunteers} volunteers</span>
        </div>
        {event.guestCount > 0 && (
          <p className="text-xs text-blue-600">{event.guestCount} guests</p>
        )}
        {event.freeParticipantCount > 0 && (
          <p className="text-xs text-purple-600">{event.freeParticipantCount} free participants</p>
        )}
        {event.waitlistCount > 0 && (
          <p className="text-xs text-amber-600">{event.waitlistCount} waiting</p>
        )}
      </td>

      {/* Donations */}
      <td className="px-4 py-3.5">
        {event.fundGoal > 0 ? (
          <div>
            <p className="text-sm font-bold text-emerald-700">
              ৳{(event.donationStats?.totalDonated || 0).toLocaleString()}
            </p>
            <p className="text-xs text-stone-400">
              of ৳{event.fundGoal.toLocaleString()}
            </p>
          </div>
        ) : (
          <span className="text-xs text-stone-300">—</span>
        )}
      </td>

      {/* Status */}
      <td className="px-4 py-3.5 relative">
        <div className="relative inline-block">
          <button onClick={() => available.length > 0 && setStatusMenuOpen(!statusMenuOpen)}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full ${st.bg} ${st.text} ${available.length > 0 ? "cursor-pointer hover:opacity-80" : "cursor-default"} transition-opacity`}>
            <span className={`w-1.5 h-1.5 rounded-full ${st.dot} ${event.status==="ongoing" ? "animate-pulse" : ""}`}/>
            {st.label}
            {available.length > 0 && <span className="opacity-60">▾</span>}
          </button>

          {statusMenuOpen && available.length > 0 && (
            <div className="absolute left-0 top-8 z-30 bg-white border border-stone-200 rounded-2xl shadow-xl py-1 min-w-[140px]">
              {available.map((s) => (
                <button key={s} onClick={() => { setStatusMenuOpen(false); onStatusChange(event._id, s); }}
                  className={`w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-stone-50 transition-colors capitalize ${
                    s==="cancelled" ? "text-red-600" : s==="completed" ? "text-blue-600" : "text-green-600"
                  }`}>
                  {s==="ongoing" ? "🔴 Mark Live" : s==="completed" ? "✅ Complete" : s==="cancelled" ? "❌ Cancel" : `→ ${s}`}
                </button>
              ))}
              <button onClick={() => setStatusMenuOpen(false)}
                className="w-full text-left px-4 py-2 text-xs text-stone-400 hover:bg-stone-50 border-t border-stone-100">
                Close
              </button>
            </div>
          )}
        </div>
      </td>

      {/* Actions */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-1.5">
          <ActionBtn onClick={() => navigate(`/events/${event._id}`)} title="View public page" icon="👁️" />
          <ActionBtn onClick={() => navigate(`/admin/events/${event._id}/manage`)} title="Manage volunteers" icon="⚙️" color="blue" />
          <ActionBtn onClick={() => navigate(`/admin/events/edit/${event._id}`)} title="Edit event" icon="✏️" color="amber" />
          <ActionBtn
            onClick={() => onDelete(event._id, event.title)}
            title="Delete event"
            icon={deleting ? "⏳" : "🗑️"}
            color="red"
            disabled={deleting}
          />
        </div>
      </td>
    </tr>
  );
}

/* ═══════════════════════════════════════
   SMALL HELPERS
═══════════════════════════════════════ */
function StatCard({ icon, label, value, color }) {
  const colors = {
    stone:   "from-stone-50  to-stone-100/50  text-stone-700",
    blue:    "from-blue-50   to-blue-100/50   text-blue-700",
    green:   "from-green-50  to-green-100/50  text-green-700",
    purple:  "from-purple-50 to-purple-100/50 text-purple-700",
    amber:   "from-amber-50  to-amber-100/50  text-amber-700",
    emerald: "from-emerald-50 to-emerald-100/50 text-emerald-700",
    red:     "from-red-50    to-red-100/50    text-red-700",
    teal: "from-teal-50 to-teal-100/50 text-teal-700"
  };
  return (
    <div className={`bg-gradient-to-br ${colors[color] || colors.stone} border border-white rounded-2xl p-5 shadow-sm`}>
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-2xl font-bold" style={{ fontFamily:"Fraunces,serif" }}>{value}</div>
      <div className="text-xs font-medium opacity-70 mt-0.5">{label}</div>
    </div>
  );
}

function ActionBtn({ onClick, title, icon, color, disabled }) {
  const colors = {
    blue:  "hover:bg-blue-50  hover:text-blue-600",
    amber: "hover:bg-amber-50 hover:text-amber-600",
    red:   "hover:bg-red-50   hover:text-red-600",
  };
  return (
    <button onClick={onClick} title={title} disabled={disabled}
      className={`w-8 h-8 flex items-center justify-center rounded-lg text-stone-400 transition-all text-base
                  ${colors[color] || "hover:bg-stone-100 hover:text-stone-700"}
                  disabled:opacity-40 disabled:cursor-not-allowed`}>
      {icon}
    </button>
  );
}

function Th({ children }) {
  return <th className="px-4 py-3 text-left text-xs font-semibold text-stone-400 uppercase tracking-wide whitespace-nowrap">{children}</th>;
}

function PageBtn({ onClick, disabled, label }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="w-9 h-9 rounded-xl bg-white border border-stone-200 text-stone-600 text-sm hover:bg-stone-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
      {label}
    </button>
  );
}