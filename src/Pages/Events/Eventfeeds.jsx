import { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router";
import axios from "axios";
import EventCard from "../Events/EventCard";
import {
  Calendar,
  Radio,
  CheckCircle2,
  Search,
  X,
  Plus,
  Leaf,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  TriangleAlert,
  RefreshCw,
} from "lucide-react";
import useAxios from "../../Hooks/useAxios";

/* ─── Constants ─── */
const STATUS_TABS = [
  { value: "upcoming",  label: "Upcoming",  Icon: Calendar },
  { value: "ongoing",   label: "Live Now",  Icon: Radio },
  { value: "completed", label: "Completed", Icon: CheckCircle2 },
];
const TYPE_FILTERS = [
  { value: "",           label: "All Types" },
  { value: "cleanup",    label: "Cleanup" },
  { value: "plantation", label: "Plantation" },
  { value: "repair",     label: "Repair" },
  { value: "awareness",  label: "Awareness" },
  { value: "student",    label: "Student" },
  { value: "meetup",     label: "Meetup" },
];
const SORT_OPTIONS = [
  { value: "date_asc",  label: "Soonest First" },
  { value: "date_desc", label: "Latest First" },
  { value: "popular",   label: "Most Popular" },
];

/* ─── Main Component ─── */
export default function EventsFeed() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [events, setEvents]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);

  // Filters from URL params
  const status = searchParams.get("status") || "upcoming";
  const type   = searchParams.get("type")   || "";
  const page   = Number(searchParams.get("page") || 1);
  const sort   = searchParams.get("sort")   || "date_asc";
  const search = searchParams.get("search") || "";
  const axiosInstance = useAxios()

  const [searchInput, setSearchInput] = useState(search);

  /* ─── Fetch events ─── */
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ status, page, limit: 9 });
      if (type)   params.set("type", type);
      if (search) params.set("search", search);

      const res = await axiosInstance.get(
        `/events?${params}`
      );
      let fetched = res.data?.events || [];

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
    next.delete("page");
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
    <div className="min-h-screen bg-zinc-900">

      {/* ── Hero banner ── */}
      <div className="bg-linear-to-br from-zinc-800 to-zinc-900 border-b border-zinc-700">
        <div className="max-w-6xl mx-auto px-4 py-10 md:py-14">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 text-xs
                              font-semibold px-3 py-1.5 rounded-full ring-1 ring-emerald-500/30 mb-3">
                <Leaf className="w-3 h-3" />
                Community Driven
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                Community Events
              </h1>
              <p className="text-zinc-400 mt-2 max-w-lg text-sm">
                Join volunteer-driven events to fix local issues together.
                Every hand counts — show up, make a difference.
              </p>
            </div>
          </div>

          {/* ── Search bar ── */}
          <form onSubmit={handleSearch} className="mt-6 flex gap-2 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search events..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-800
                           text-white placeholder:text-zinc-500 text-sm
                           focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm
                         font-medium transition-colors"
            >
              Search
            </button>
            {search && (
              <button
                type="button"
                onClick={() => { setSearchInput(""); setParam("search", ""); }}
                className="px-3 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700
                           text-zinc-400 rounded-xl text-sm transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* ── Status tabs + filters ── */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-7">
          {/* Status tabs */}
          <div className="flex gap-1 bg-zinc-800 rounded-xl border border-zinc-700 p-1 flex-wrap">
            {STATUS_TABS.map(({ value, label, Icon }) => (
              <button
                key={value}
                onClick={() => setParam("status", value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  status === value
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-700"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
                {value === "ongoing" && (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                )}
              </button>
            ))}
          </div>

          {/* Right side filters */}
          <div className="flex gap-2 ml-auto flex-wrap items-center">
            <SlidersHorizontal className="w-4 h-4 text-zinc-500" />
            <select
              value={type}
              onChange={(e) => setParam("type", e.target.value)}
              className="text-sm px-3 py-2 rounded-xl border border-zinc-700 bg-zinc-800
                         text-white focus:outline-none focus:border-emerald-500"
            >
              {TYPE_FILTERS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => setParam("sort", e.target.value)}
              className="text-sm px-3 py-2 rounded-xl border border-zinc-700 bg-zinc-800
                         text-white focus:outline-none focus:border-emerald-500"
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
            <span className="text-sm text-zinc-500">Filtering by:</span>
            {search && (
              <FilterChip
                label={`"${search}"`}
                onRemove={() => { setSearchInput(""); setParam("search", ""); }}
              />
            )}
            {type && (
              <FilterChip
                label={TYPE_FILTERS.find((f) => f.value === type)?.label}
                onRemove={() => setParam("type", "")}
              />
            )}
          </div>
        )}

        {/* ── Result count ── */}
        {!loading && (
          <p className="text-sm text-zinc-500 mb-5">
            {totalEvents > 0 ? (
              <><span className="font-semibold text-white">{totalEvents}</span> events found</>
            ) : "No events found"}
          </p>
        )}

        {/* ── Loading skeleton ── */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-2xl border border-zinc-700
                           overflow-hidden animate-pulse"
              >
                <div className="h-44 bg-zinc-700/50" />
                <div className="p-5 space-y-3">
                  <div className="flex gap-2">
                    <div className="h-5 w-20 bg-zinc-700 rounded-full" />
                    <div className="h-5 w-16 bg-zinc-700 rounded-full" />
                  </div>
                  <div className="h-5 bg-zinc-700 rounded-lg w-3/4" />
                  <div className="h-4 bg-zinc-700 rounded-lg w-1/2" />
                  <div className="h-1.5 bg-zinc-700 rounded-full" />
                  <div className="flex gap-2 pt-1">
                    <div className="h-9 bg-zinc-700 rounded-xl flex-1" />
                    <div className="h-9 bg-zinc-700 rounded-xl flex-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Error state ── */}
        {error && !loading && (
          <div className="text-center py-20">
            <div className="flex justify-center mb-4">
              <TriangleAlert className="w-12 h-12 text-zinc-500" />
            </div>
            <p className="text-zinc-400 mb-4">{error}</p>
            <button
              onClick={fetchEvents}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white
                         rounded-xl text-sm font-medium hover:bg-emerald-500 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        )}

        {/* ── Events grid ── */}
        {!loading && !error && events.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && !error && events.length === 0 && (
          <div className="text-center py-24">
            <div className="flex justify-center mb-5">
              <Leaf className="w-14 h-14 text-zinc-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No {status} events yet
            </h3>
            <p className="text-zinc-500 mb-6 text-sm max-w-xs mx-auto">
              {status === "upcoming"
                ? "No upcoming events. Check back soon or create one!"
                : `No ${status} events match your filters.`}
            </p>
            {search || type ? (
              <button
                onClick={() => { setSearchInput(""); setSearchParams(new URLSearchParams({ status })); }}
                className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700
                           text-white rounded-xl text-sm font-medium transition-colors"
              >
                Clear filters
              </button>
            ) :  null}
          </div>
        )}

        {/* ── Pagination ── */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <PaginationBtn onClick={() => setPage(1)} disabled={page === 1}>
              <ChevronsLeft className="w-4 h-4" />
            </PaginationBtn>
            <PaginationBtn onClick={() => setPage(page - 1)} disabled={page === 1}>
              <ChevronLeft className="w-4 h-4" />
            </PaginationBtn>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "..." ? (
                  <span key={`dot-${i}`} className="px-2 text-zinc-600 text-sm">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${
                      p === page
                        ? "bg-emerald-600 text-white"
                        : "bg-zinc-800 border border-zinc-700 text-white hover:bg-zinc-700"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

            <PaginationBtn onClick={() => setPage(page + 1)} disabled={page === totalPages}>
              <ChevronRight className="w-4 h-4" />
            </PaginationBtn>
            <PaginationBtn onClick={() => setPage(totalPages)} disabled={page === totalPages}>
              <ChevronsRight className="w-4 h-4" />
            </PaginationBtn>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Small helpers ─── */
function FilterChip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 text-xs
                     font-medium px-3 py-1 rounded-full ring-1 ring-emerald-500/30">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="hover:text-red-400 transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}

function PaginationBtn({ onClick, disabled, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-400
                 hover:bg-zinc-700 hover:text-white transition-colors
                 disabled:opacity-30 disabled:cursor-not-allowed
                 flex items-center justify-center"
    >
      {children}
    </button>
  );
}