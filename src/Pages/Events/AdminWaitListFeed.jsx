import { useState, useEffect, use } from "react";
import { useNavigate } from "react-router";
import { format } from "date-fns";
import { toast } from "react-toastify";
import {
  Clock, RefreshCw, Search, Users, Calendar,
  MapPin, ChevronRight, ArrowRight
} from "lucide-react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { AuthContext } from "../AuthProvider/AuthContext";

const TYPE_META = {
  cleanup:    { emoji: "🧹", label: "Cleanup Drive" },
  plantation: { emoji: "🌳", label: "Tree Plantation" },
  repair:     { emoji: "🏗️", label: "Repair Work" },
  awareness:  { emoji: "📢", label: "Awareness Campaign" },
  student:    { emoji: "🎓", label: "Student Volunteer Day" },
  meetup:     { emoji: "🤝", label: "Community Meetup" },
};

export default function AdminWaitlistFeed() {
  const [waitlists, setWaitlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const axiosSecure = useAxiosSecure();
  const { user } = use(AuthContext);
  const navigate = useNavigate();

  const fetchWaitlists = async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get("/admin/waitlists");
      setWaitlists(res.data?.waitlists || []);
    } catch {
      toast.error("Could not load waitlist data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchWaitlists();
  }, [user]);

  const filtered = waitlists.filter((w) => {
    const q = search.toLowerCase();
    return (
      w.event?.title?.toLowerCase().includes(q) ||
      w.event?.location?.address?.toLowerCase().includes(q)
    );
  });

  const totalWaiting = waitlists.reduce((sum, w) => sum + w.waitlistCount, 0);

  return (
    <div className="min-h-screen bg-zinc-950 py-8 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Clock className="w-6 h-6 text-amber-400" />
              Waitlist Feed
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              {totalWaiting} people waiting across {waitlists.length} events
            </p>
          </div>
          <button
            onClick={fetchWaitlists}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 border border-zinc-700
                       text-zinc-300 text-sm hover:bg-zinc-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by event name or location..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700
                       text-zinc-200 text-sm placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-zinc-500">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">
              {search ? `No results for "${search}"` : "No events with waitlisted registrations"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((w) => {
              const meta = TYPE_META[w.event?.eventType] || { emoji: "🤝", label: "Event" };
              const spotsLeft = Math.max(0, (w.event?.maxVolunteers || 0) - (w.event?.volunteerCount || 0));

              return (
                <div key={w.eventId}
                  className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5 flex items-center justify-between gap-4 hover:border-zinc-700 transition-colors">

                  {/* Left: Event info */}
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                      <span className="text-xl">{meta.emoji}</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-white text-sm truncate">
                        {w.event?.title}
                      </h3>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                        <span className="text-xs text-zinc-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {w.event?.date && format(new Date(w.event.date), "dd MMM yyyy, h:mm a")}
                        </span>
                        {w.event?.location?.address && (
                          <span className="text-xs text-zinc-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {w.event.location.address}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {w.waitlistCount} waiting
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded-full flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {w.event?.volunteerCount}/{w.event?.maxVolunteers} filled
                        </span>
                        {spotsLeft === 0 && (
                          <span className="text-xs px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full">
                            Full
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Button */}
                  <button
                    onClick={() => navigate(`/admin/events/${w.event?._id}/manage`)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600
                               text-white text-sm font-medium transition-colors shrink-0"
                  >
                    View Details
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        {!loading && filtered.length > 0 && (
          <p className="text-center text-xs text-zinc-600 mt-6">
            Showing {filtered.length} of {waitlists.length} events with waitlists
          </p>
        )}
      </div>
    </div>
  );
}