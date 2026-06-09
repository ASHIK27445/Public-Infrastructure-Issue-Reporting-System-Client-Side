import { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router";
import axios from "axios";
import EventCard from "../Events/EventCard";

/* ─── Constants ─── */
const STATUS_TABS = [
  { value: "upcoming",  label: "Upcoming",  emoji: "🗓️" },
  { value: "ongoing",   label: "Live Now",  emoji: "🔴" },
  { value: "completed", label: "Completed", emoji: "✅" },
];
const TYPE_FILTERS = [
  { value: "",           label: "All Types" },
  { value: "cleanup",    label: "🧹 Cleanup" },
  { value: "plantation", label: "🌳 Plantation" },
  { value: "repair",     label: "🏗️ Repair" },
  { value: "awareness",  label: "📢 Awareness" },
  { value: "student",    label: "🎓 Student" },
  { value: "meetup",     label: "🤝 Meetup" },
];
const SORT_OPTIONS = [
  { value: "date_asc",  label: "Soonest First" },
  { value: "date_desc", label: "Latest First" },
  { value: "popular",   label: "Most Popular" },
];

/* ─── Main Component ─── */
export default function EventsFeed() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [events, setEvents]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);

  // Filters from URL params
  const status   = searchParams.get("status")  || "upcoming";
  const type     = searchParams.get("type")    || "";
  const page     = Number(searchParams.get("page") || 1);
  const sort     = searchParams.get("sort")    || "date_asc";
  const search   = searchParams.get("search") || "";

  const [searchInput, setSearchInput] = useState(search);

  // Current user (for reactions)
  const currentUserId = localStorage.getItem("userId") || null;
  const isAdmin = localStorage.getItem("role") === "admin";

  /* ─── Fetch events ─── */
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ status, page, limit: 9 });
      if (type)   params.set("type", type);
      if (search) params.set("search", search);

      const res = await axios.get(
        `${import.meta.env.VITE_API_MANUAL}/events?${params}`
      );
      let fetched = res.data?.events || [];

      // Client-side sort (since backend may not support all sort types)
      if (sort === "date_desc") {
        fetched = [...fetched].sort((a, b) => new Date(b.date) - new Date(a.date));
      } else if (sort === "popular") {
        fetched = [...fetched].sort(
          (a, b) =>
            (b.interestedCount + b.goingCount) - (a.interestedCount + a.goingCount)
        );
      } else {
        fetched = [...fetched].sort((a, b) => new Date(a.date) - new Date(b.date));
      }

      setEvents(fetched);
      setTotalPages(res.data?.totalPages || 1);
      setTotalEvents(res.data?.total || 0);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  }, [status, type, page, search, sort]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  /* ─── URL param updaters ─── */
  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    next.delete("page"); // reset page on filter change
    setSearchParams(next);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setParam("search", searchInput.trim());
  };

  const setPage = (p) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", p);
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ─── Render ─── */
  return (
    <div className="min-h-screen bg-[#f5f7f2]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Fraunces:wght@600;700;800&display=swap');`}</style>

      {/* ── Hero banner ── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-10 md:py-14">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs font-semibold
                              px-3 py-1.5 rounded-full ring-1 ring-green-200 mb-3">
                🌿 Community Driven
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight"
                style={{ fontFamily: "Fraunces, serif" }}>
                Community Events
              </h1>
              <p className="text-gray-500 mt-2 max-w-lg">
                Join volunteer-driven events to fix local issues together.
                Every hand counts — show up, make a difference.
              </p>
            </div>
            {isAdmin && (
              <Link
                to="/admin/events/create"
                className="inline-flex items-center gap-2 px-5 py-3 bg-green-500 hover:bg-green-600
                           text-white font-semibold rounded-2xl transition-colors shadow-sm text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                Create Event
              </Link>
            )}
          </div>

          {/* ── Search bar ── */}
          <form onSubmit={handleSearch} className="mt-6 flex gap-2 max-w-xl">
            <div className="relative flex-1">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" strokeWidth="2"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search events..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm
                           focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm
                         font-medium transition-colors"
            >
              Search
            </button>
            {search && (
              <button
                type="button"
                onClick={() => { setSearchInput(""); setParam("search", ""); }}
                className="px-3 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-sm transition-colors"
              >
                ✕
              </button>
            )}
          </form>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* ── Status tabs + filters ── */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-7">
          {/* Status tabs */}
          <div className="flex gap-1 bg-white rounded-xl border border-gray-200 p-1 flex-wrap">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setParam("status", tab.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  status === tab.value
                    ? "bg-green-500 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span>{tab.emoji}</span>
                <span>{tab.label}</span>
                {tab.value === "ongoing" && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                )}
              </button>
            ))}
          </div>

          {/* Right side filters */}
          <div className="flex gap-2 ml-auto flex-wrap">
            <select
              value={type}
              onChange={(e) => setParam("type", e.target.value)}
              className="text-sm px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-700
                         focus:outline-none focus:border-green-400"
            >
              {TYPE_FILTERS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => setParam("sort", e.target.value)}
              className="text-sm px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-700
                         focus:outline-none focus:border-green-400"
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Active filters display ── */}
        {(search || type) && (
          <div className="flex items-center gap-2 mb-5 flex-wrap">
            <span className="text-sm text-gray-500">Filtering by:</span>
            {search && (
              <FilterChip label={`"${search}"`} onRemove={() => { setSearchInput(""); setParam("search", ""); }} />
            )}
            {type && (
              <FilterChip label={TYPE_FILTERS.find((f) => f.value === type)?.label} onRemove={() => setParam("type", "")} />
            )}
          </div>
        )}

        {/* ── Result count ── */}
        {!loading && (
          <p className="text-sm text-gray-500 mb-5">
            {totalEvents > 0 ? (
              <><span className="font-semibold text-gray-800">{totalEvents}</span> events found</>
            ) : "No events found"}
          </p>
        )}

        {/* ── Loading skeleton ── */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
                <div className="h-44 bg-gray-100" />
                <div className="p-5 space-y-3">
                  <div className="flex gap-2">
                    <div className="h-5 w-20 bg-gray-100 rounded-full" />
                    <div className="h-5 w-16 bg-gray-100 rounded-full" />
                  </div>
                  <div className="h-5 bg-gray-100 rounded-lg w-3/4" />
                  <div className="h-4 bg-gray-100 rounded-lg w-1/2" />
                  <div className="h-1.5 bg-gray-100 rounded-full" />
                  <div className="flex gap-2 pt-1">
                    <div className="h-9 bg-gray-100 rounded-xl flex-1" />
                    <div className="h-9 bg-gray-100 rounded-xl flex-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Error state ── */}
        {error && !loading && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">⚠️</div>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchEvents}
              className="px-5 py-2.5 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* ── Events grid ── */}
        {!loading && !error && events.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map((event) => (
              <EventCard key={event._id} event={event} currentUserId={currentUserId} />
            ))}
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && !error && events.length === 0 && (
          <div className="text-center py-24">
            <div className="text-6xl mb-5">🌿</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2" style={{ fontFamily: "Fraunces, serif" }}>
              No {status} events yet
            </h3>
            <p className="text-gray-500 mb-6 text-sm max-w-xs mx-auto">
              {status === "upcoming"
                ? "No upcoming events. Check back soon or create one!"
                : `No ${status} events match your filters.`}
            </p>
            {search || type ? (
              <button
                onClick={() => { setSearchInput(""); setSearchParams(new URLSearchParams({ status })); }}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors"
              >
                Clear filters
              </button>
            ) : isAdmin ? (
              <Link
                to="/admin/events/create"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-medium transition-colors"
              >
                Create First Event
              </Link>
            ) : null}
          </div>
        )}

        {/* ── Pagination ── */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <PaginationBtn onClick={() => setPage(1)} disabled={page === 1} label="«" />
            <PaginationBtn onClick={() => setPage(page - 1)} disabled={page === 1} label="‹" />

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "..." ? (
                  <span key={`dot-${i}`} className="px-2 text-gray-400 text-sm">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${
                      p === page
                        ? "bg-green-500 text-white shadow-sm"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

            <PaginationBtn onClick={() => setPage(page + 1)} disabled={page === totalPages} label="›" />
            <PaginationBtn onClick={() => setPage(totalPages)} disabled={page === totalPages} label="»" />
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Small helpers ─── */
function FilterChip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-800 text-xs font-medium
                     px-3 py-1 rounded-full ring-1 ring-green-200">
      {label}
      <button type="button" onClick={onRemove} className="hover:text-red-500 transition-colors">×</button>
    </span>
  );
}

function PaginationBtn({ onClick, disabled, label }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-9 h-9 rounded-xl bg-white border border-gray-200 text-gray-700 text-sm
                 hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
    >
      {label}
    </button>
  );
}