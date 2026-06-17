import { useState, useEffect, useCallback, use } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import { format, formatDistanceToNow } from "date-fns";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import {
  Plus, Eye, Settings2, Pencil, Trash2, Loader2,
  Search, X, ChevronDown, Radio, CheckCircle2,
  XCircle, Clock, Users, Wallet, CalendarDays,
  Leaf, TrendingUp, Ban, Ticket, Brush, TreeDeciduous, Wrench, 
  Megaphone, GraduationCap, Handshake
} from "lucide-react";
import { AuthContext } from "../AuthProvider/AuthContext";
import './event.css'

/* ─── Constants ─── */
const TYPE_ICON = {
  cleanup:   Brush,
  plantation: TreeDeciduous,
  repair:    Wrench,
  awareness: Megaphone,
  student:   GraduationCap,
  meetup:    Handshake,
}

const TYPE_LABEL = {
  cleanup:"Cleanup", plantation:"Plantation", repair:"Repair",
  awareness:"Awareness", student:"Student Day", meetup:"Meetup",
};
const STATUS_STYLE = {
  upcoming:  {  text:"text-green-700",  dot:"bg-green-500",  label:"Upcoming"  },
  ongoing: {  text:"text-blue-700", dot:"bg-blue-500", label:"Live" },
  completed: {  text:"text-stone-600",  dot:"bg-stone-400",  label:"Completed" },
  cancelled: {   text:"text-red-700",    dot:"bg-red-500",    label:"Cancelled" },
  draft:     { text:"text-yellow-700", dot:"bg-yellow-500", label:"Draft"     },
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
    if (!user) return;
    const isCancel = newStatus === "cancelled";
    const msg = isCancel
      ? "Cancel this event? All paid registrations will be refunded."
      : `Change status to "${newStatus}"?`;

    toast.info(
      <div className="space-y-2">
        <p className="text-sm font-medium text-black">{msg}</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss();
              try {
                await axiosSecure.patch(`/admin/events/${eventId}/status`, { status: newStatus });
                toast.success(`Status → ${newStatus}`);
                fetchEvents();
              } catch (err) { toast.error(err.response?.data?.message || "Update failed"); }
            }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold text-white ${isCancel ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}>
            {isCancel ? "Yes, Cancel" : "Confirm"}
          </button>
          <button onClick={() => toast.dismiss()}
            className="px-3 py-1 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700">
            Dismiss
          </button>
        </div>
      </div>,
      { autoClose: false, closeButton: false, closeOnClick: false }
    );
  };

  const handleDelete = async (eventId, title) => {
    toast.warn(
      <div className="space-y-2">
        <p className="text-sm font-medium text-black">Delete <span className="font-bold">"{title}"</span>?</p>
        <p className="text-xs text-stone-500">Removes all registrations, donations and comments. Cannot be undone.</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss();
              setDeleting(eventId);
              try {
                await axios.delete(`${import.meta.env.VITE_API_URL}/admin/events/${eventId}`, { headers });
                toast.success("Event deleted");
                fetchEvents();
              } catch (err) { toast.error(err.response?.data?.message || "Delete failed"); }
              finally { setDeleting(null); }
            }}
            className="px-3 py-1 rounded-lg text-xs font-semibold text-white bg-red-500 hover:bg-red-600">
            Yes, Delete
          </button>
          <button onClick={() => toast.dismiss()}
            className="px-3 py-1 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700">
            Cancel
          </button>
        </div>
      </div>,
      { autoClose: false, closeButton: false, closeOnClick: false }
    );
  };

  /* ─────────── RENDER ─────────── */
  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-950 to-zinc-900">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Fraunces:wght@600;700;800&display=swap');`}</style>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-black text-white" >
              Event <span className="bg-linear-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Management</span>
            </h1>
            <p className="text-stone-500 text-sm mt-1">
              Manage all community events, volunteers, and donations
            </p>
          </div>
          <div>
            <Link to="/dashboard/admin/create-events"
              className="inline-flex items-center gap-2 px-5 mr-2 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-2xl transition-colors shadow-sm text-sm">
              <Plus size={16} strokeWidth={2.5} />
              Create Event
            </Link>
            <Link to="/dashboard/admin/waitlist-feed"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-2xl transition-colors shadow-sm text-sm">
              WaitList Feed
            </Link>
          </div>
        </div>

        {/* STATS SECTION */}
        {statsLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-2xl border border-zinc-700 p-5 animate-pulse shadow-sm"
              >
                <div className="h-8 w-12 bg-stone-100 rounded-md mb-3" />
                <div className="h-4 w-20 bg-stone-100 rounded" />
              </div>
            ))}
          </div>
        ) : (
          stats && (
            <div className="grid grid-cols-2 items-center justify-center sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
              
              <StatCard
                icon={CalendarDays}
                label="Total Events"
                value={stats.overview.totalEvents}
                color="stone"
              />

              <StatCard
                icon={Radio}
                label="Live Now"
                value={stats.overview.ongoingCount}
                color="blue"
              />

              <StatCard
                icon={CheckCircle2}
                label="Upcoming"
                value={stats.overview.upcomingCount}
                color="green"
              />

              <StatCard
                icon={TrendingUp}
                label="Completed"
                value={stats.overview.completedCount}
                color="purple"
              />

              <StatCard
                icon={Users}
                label="Volunteers"
                value={stats.overview.totalVolunteers}
                color="green"
              />

              <StatCard
                icon={Clock}
                label="Waitlisted"
                value={stats.overview.totalWaitlisted}
                color="amber"
              />

              <StatCard
                icon={Wallet}
                label="Total Donated"
                value={`৳${(stats.overview.totalDonated || 0).toLocaleString()}`}
                color="emerald"
              />

              <StatCard
                icon={Ban}
                label="Cancelled"
                value={stats.overview.cancelledCount}
                color="red"
              />

              <StatCard
                icon={Ticket}
                label="Free Participants"
                value={stats.overview.totalParticipants || 0}
                color="teal"
              />
            </div>
          )
        )}

        {/* ── Type breakdown mini chart ── */}
        {stats?.typeBreakdown?.length > 0 && (
          <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-2xl border border-zinc-700 p-5 mb-6">
            <h3 className="text-sm font-semibold text-white mb-4">Events by Type</h3>
            <div className="flex gap-3 flex-wrap">
              {stats.typeBreakdown.map((t) => {
                const TIcon = TYPE_ICON[t._id];
                return (
                  <button key={t._id} onClick={() => setParam("type", t._id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all ${
                      type === t._id
                        ? "bg-emerald-500 text-white border-emerald-500"
                        : "bg-zinc-800 text-white border-zinc-700 hover:border-zinc-800"
                    }`}>
                    {TIcon && <TIcon size={14} />}
                    <span className="font-medium">{TYPE_LABEL[t._id] || t._id}</span>
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${type === t._id ? "bg-white text-gray-700 border-zinc-800" : "bg-zinc-700 text-white"}`}>
                      {t.count}
                    </span>
                  </button>
                );
              })}
              {type !== "all" && (
                <button onClick={() => setParam("type", "all")}
                  className="flex items-center gap-1 text-xs text-stone-400 hover:text-red-500 transition-colors px-2">
                  <X size={12} /> Clear
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Filters row ── */}
        <div className="flex flex-wrap gap-3 mb-5 items-center">
          {/* Status tabs */}
          <div className="flex gap-1 bg-linear-to-br from-zinc-800 to-zinc-900 rounded-xl border border-zinc-700 p-1">
            {["all","upcoming","ongoing","completed","cancelled","draft"].map((s) => (
              <button key={s} onClick={() => setParam("status", s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                  status === s
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "text-stone-500 hover:text-stone-700 hover:bg-stone-50"
                }`}>
                {s === "all" ? "All" : s === "ongoing" ? "Live" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2 ml-auto">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search events..."
                className="pl-9 pr-4 py-2 rounded-xl border border-zinc-700 bg-linear-to-br from-zinc-800 to-zinc-900 text-sm focus:outline-none focus:border-emerald-400 w-56" />
            </div>
            <button type="submit"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition-colors">
              Search
            </button>
            {search && (
              <button type="button" onClick={() => { setSearchInput(""); setParam("search", ""); }}
                className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl text-sm transition-colors flex items-center">
                <X size={14} />
              </button>
            )}
          </form>
        </div>

        {/* Result count */}
        {!loading && (
          <p className="text-sm text-stone-500 mb-4">
            <span className="font-semibold text-white">{total}</span> events found
          </p>
        )}

        {/* ── Events table ── */}
        <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-2xl border border-zinc-700 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-[3px] border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-20">
              <Leaf size={40} className="text-stone-300 mx-auto mb-4" />
              <p className="text-stone-500 text-sm">No events found</p>
              {(search || status !== "all" || type !== "all") && (
                <button onClick={() => setSearchParams(new URLSearchParams())}
                  className="mt-3 text-sm text-emerald-600 hover:underline">
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-zinc-800 border-b border-b-zinc-700">
                    <Th>Event</Th>
                    <Th>Type</Th>
                    <Th>Date</Th>
                    <Th>Volunteers</Th>
                    <Th>Donations</Th>
                    <Th>Status</Th>
                    <Th>Actions</Th>
                  </tr>
                </thead>
                <tbody>
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
                      p===page ? "bg-green-500 text-white shadow-sm" : "bg-linear-to-br from-zinc-800 to-zinc-900 border border-zinc-700 text-stone-700 hover:bg-stone-50"
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
    <tr className=" transition-colors group border-b border-b-zinc-700">
      {/* Event name */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          {event.coverImage ? (
            <img src={event.coverImage} alt="" className="w-10 h-10 rounded-xl object-cover shrink-0 border border-zinc-700"
              onError={(e) => { e.target.style.display="none"; }} />
          ) : (() => {
            const TIcon = TYPE_ICON[event.eventType];
            return (
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                {TIcon ? <TIcon size={18} className="text-emerald-600" /> : <CalendarDays size={18} className="text-emerald-600" />}
              </div>
            );
          })()}
          <div className="min-w-0">
            <p className="font-semibold text-white text-sm truncate max-w-45">{event.title}</p>
            <p className="text-xs text-stone-400 truncate max-w-45">{event.location?.address}</p>
          </div>
        </div>
      </td>

      {/* Type */}
      <td className="px-4 py-3.5">
        {(() => {
          const TIcon = TYPE_ICON[event.eventType];
          return (
            <span className="inline-flex items-center gap-1.5 text-xs text-white bg-transparent px-2.5 py-1 rounded-full font-medium">
              {TIcon && <TIcon size={12} />}
              {TYPE_LABEL[event.eventType] || event.eventType}
            </span>
          );
        })()}
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
          <span className="font-bold text-white">{event.volunteerCount || 0}</span>
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
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full ${st.text} ${available.length > 0 ? "cursor-pointer hover:opacity-80" : "cursor-default"} transition-opacity`}>
            <span className={`w-1.5 h-1.5 rounded-full ${st.dot} ${event.status==="ongoing" ? "animate-pulse" : ""}`}/>
            {st.label}
            {available.length > 0 && <ChevronDown size={11} className="opacity-60" />}
          </button>

          {statusMenuOpen && available.length > 0 && (
            <div className="absolute left-0 top-8 z-30 bg-linear-to-br from-zinc-800 to-zinc-900 border border-zinc-700 rounded-2xl shadow-xl py-1 min-w-35">
              {available.map((s) => (
                <button key={s} onClick={() => { setStatusMenuOpen(false); onStatusChange(event._id, s); }}
                  className={`w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-zinc-600 transition-colors flex items-center gap-2 ${
                    s==="cancelled" ? "text-red-600" : s==="completed" ? "text-blue-600" : "text-green-600"
                  }`}>
                  {s==="ongoing"   && <Radio size={12} />}
                  {s==="completed" && <CheckCircle2 size={12} />}
                  {s==="cancelled" && <XCircle size={12} />}
                  {s==="ongoing" ? "Mark Live" : s==="completed" ? "Complete" : s==="cancelled" ? "Cancel" : `→ ${s}`}
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
        <ActionBtn onClick={() => navigate(`/events/${event._id}`)}              
        title="View public page"  icon={Eye}                              />
        <ActionBtn onClick={() => navigate(`/dashboard/admin/events/${event._id}/manage`)} 
        title="Manage volunteers" icon={Settings2} color="blue"          />
        <ActionBtn onClick={() => navigate(`/dashboard/admin/events/edit/${event._id}`)}   
        title="Edit event"        icon={Pencil}    color="amber"         />
        <ActionBtn onClick={() => onDelete(event._id, event.title)}              
        title="Delete event" icon={deleting ? Loader2 : Trash2} color="red" 
        disabled={deleting} spinning={deleting} />
        </div>
      </td>
    </tr>
  );
}

/* ═══════════════════════════════════════
   SMALL HELPERS
═══════════════════════════════════════ */
const StatCard = ({ icon: Icon, label, value, color }) => {
  return (
    <div className="flex flex-col justify-center items-center h-full group bg-linear-to-br from-zinc-800 to-zinc-900 border border-zinc-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-xl text-${color}-600`}>
          <Icon size={18} />
        </div>
      </div>

      <div className="text-2xl font-semibold text-white">
        {value}
      </div>

      <div className="text-sm text-stone-500 mt-1">
        {label}
      </div>
    </div>
  );
};

function ActionBtn({ onClick, title, icon: Icon, color, disabled, spinning }) {
  const colors = {
    blue:  "hover:bg-blue-50  hover:text-blue-600",
    amber: "hover:bg-amber-50 hover:text-amber-600",
    red:   "hover:bg-red-50   hover:text-red-600",
  };
  return (
    <button onClick={onClick} title={title} disabled={disabled}
      className={`w-8 h-8 flex items-center justify-center rounded-lg text-stone-400 transition-all
                  ${colors[color] || "hover:bg-stone-100 hover:text-stone-700"}
                  disabled:opacity-40 disabled:cursor-not-allowed`}>
      <Icon size={16} className={spinning ? "animate-spin" : ""} />
    </button>
  );
}

function Th({ children }) {
  return <th className="px-4 py-3 text-left text-xs border-b border-b-zinc-700 font-semibold text-stone-400 uppercase tracking-wide whitespace-nowrap">{children}</th>;
}

function PageBtn({ onClick, disabled, label }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="w-9 h-9 rounded-xl bg-linear-to-br from-zinc-800 to-zinc-900 border border-zinc-700 text-white text-sm hover:bg-zinc-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
      {label}
    </button>
  );
}