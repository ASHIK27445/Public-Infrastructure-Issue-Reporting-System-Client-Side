import { useState } from "react";
import { Link } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import { format, formatDistanceToNow, isPast } from "date-fns";

/* ─── Constants ─── */
const TYPE_STYLE = {
  cleanup:    { bg: "bg-sky-50",     text: "text-sky-700",     ring: "ring-sky-200",    emoji: "🧹" },
  plantation: { bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-200",emoji: "🌳" },
  repair:     { bg: "bg-amber-50",   text: "text-amber-700",   ring: "ring-amber-200",  emoji: "🏗️" },
  awareness:  { bg: "bg-violet-50",  text: "text-violet-700",  ring: "ring-violet-200", emoji: "📢" },
  student:    { bg: "bg-pink-50",    text: "text-pink-700",    ring: "ring-pink-200",   emoji: "🎓" },
  meetup:     { bg: "bg-teal-50",    text: "text-teal-700",    ring: "ring-teal-200",   emoji: "🤝" },
};
const TYPE_LABEL = {
  cleanup: "Cleanup Drive", plantation: "Tree Plantation",
  repair: "Repair Work",   awareness: "Awareness",
  student: "Student Day",  meetup: "Meetup",
};
const STATUS_STYLE = {
  upcoming:  "bg-green-100 text-green-700",
  ongoing:   "bg-blue-100 text-blue-700",
  completed: "bg-gray-100 text-gray-500",
  cancelled: "bg-red-100 text-red-600",
  draft:     "bg-yellow-100 text-yellow-700",
};

/* ─── EventCard ─── */
export default function EventCard({ event, currentUserId }) {
  const [userReaction, setUserReaction] = useState(event.userReaction || null);
  const [counts, setCounts] = useState({
    interested: event.interestedCount || 0,
    going: event.goingCount || 0,
  });
  const [reacting, setReacting] = useState(false);

  const typeStyle  = TYPE_STYLE[event.eventType] || TYPE_STYLE.meetup;
  const eventDate  = new Date(event.date);
  const isPastDate = isPast(eventDate);
  const spotsLeft  = (event.maxVolunteers || 0) - (event.volunteerCount || 0);
  const spotsPercent = Math.min(100, ((event.volunteerCount || 0) / (event.maxVolunteers || 1)) * 100);
  const fundPercent  = event.fundGoal > 0
    ? Math.min(100, Math.round(((event.fundRaised || 0) / event.fundGoal) * 100))
    : 0;

  /* ── React handler ── */
  const handleReact = async (type) => {
    if (!currentUserId) { toast.info("Please login to react"); return; }
    if (reacting) return;
    setReacting(true);

    const prevReaction = userReaction;
    const prevCounts   = { ...counts };
    const isSame       = userReaction === type;
    const newReaction  = isSame ? null : type;
    const newCounts    = { ...counts };

    if (prevReaction === "interested") newCounts.interested = Math.max(0, newCounts.interested - 1);
    if (prevReaction === "going")      newCounts.going      = Math.max(0, newCounts.going - 1);
    if (!isSame) {
      if (type === "interested") newCounts.interested++;
      if (type === "going")      newCounts.going++;
    }

    setUserReaction(newReaction);
    setCounts(newCounts);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/events/${event._id}/react`,
        { reaction: isSame ? "not-going" : type },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch {
      setUserReaction(prevReaction);
      setCounts(prevCounts);
      toast.error("Could not save reaction");
    } finally {
      setReacting(false);
    }
  };

  /* ── Render ── */
  return (
    <article className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">

      {/* ── Cover ── */}
      {event.coverImage ? (
        <div className="relative h-44 overflow-hidden">
          <img
            src={event.coverImage}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.target.closest(".relative").className = `relative h-44 ${typeStyle.bg} flex items-center justify-center`; e.target.replaceWith(Object.assign(document.createElement("span"), { className: "text-6xl opacity-50", textContent: typeStyle.emoji })); }}
          />
          {/* linear overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
        </div>
      ) : (
        <div className={`h-44 ${typeStyle.bg} flex items-center justify-center`}>
          <span className="text-6xl opacity-30 select-none">{typeStyle.emoji}</span>
        </div>
      )}

      <div className="p-5">
        {/* ── Top badges ── */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ring-1 ${typeStyle.bg} ${typeStyle.text} ${typeStyle.ring}`}>
            {typeStyle.emoji} {TYPE_LABEL[event.eventType] || event.eventType}
          </span>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLE[event.status] || STATUS_STYLE.upcoming}`}>
            {event.status === "ongoing" ? "🔴 Live now" : event.status}
          </span>
          {event.registrationFee > 0 && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-200">
              ৳{event.registrationFee} fee
            </span>
          )}
          {event.linkedIssueId && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200">
              🔗 Linked issue
            </span>
          )}
        </div>

        {/* ── Title ── */}
        <h3 className="font-semibold text-gray-900 text-base leading-snug mb-3 line-clamp-2"
          style={{ fontFamily: "'Fraunces', serif" }}>
          {event.title}
        </h3>

        {/* ── Date & location ── */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg className="w-3.5 h-3.5 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
              <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" strokeLinecap="round"/>
              <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" strokeLinecap="round"/>
              <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2"/>
            </svg>
            <span className="font-medium text-gray-700">{format(eventDate, "dd MMM yyyy")}</span>
            <span>·</span>
            <span>{format(eventDate, "h:mm a")}</span>
            {!isPastDate && (
              <span className="ml-auto text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">
                {formatDistanceToNow(eventDate, { addSuffix: true })}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg className="w-3.5 h-3.5 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span className="truncate">{event.location?.address || "Location TBD"}</span>
          </div>
        </div>

        {/* ── Volunteer progress ── */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>
              <span className="font-semibold text-gray-800">{event.volunteerCount || 0}</span> volunteers joined
            </span>
            <span>
              {spotsLeft > 0
                ? <><span className="font-semibold text-gray-800">{spotsLeft}</span> spots left</>
                : <span className="text-red-500 font-medium">Full · waitlist open</span>
              }
            </span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                spotsLeft <= 0 ? "bg-red-400" :
                spotsPercent >= 80 ? "bg-amber-400" : "bg-green-400"
              }`}
              style={{ width: `${spotsPercent}%` }}
            />
          </div>
        </div>

        {/* ── Funding bar (if applicable) ── */}
        {event.fundGoal > 0 && (
          <div className="mb-4 bg-emerald-50 rounded-xl p-3 border border-emerald-100">
            <div className="flex justify-between text-xs text-emerald-700 mb-1.5">
              <span>💰 ৳{(event.fundRaised || 0).toLocaleString()} raised</span>
              <span>{fundPercent}% of ৳{event.fundGoal.toLocaleString()}</span>
            </div>
            <div className="h-1.5 bg-emerald-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-emerald-400 to-teal-500 rounded-full transition-all"
                style={{ width: `${fundPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* ── Pinned announcement ── */}
        {event.pinnedAnnouncement && (
          <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-2.5 text-xs text-yellow-900 flex gap-2">
            <span className="shrink-0">📌</span>
            <span>{event.pinnedAnnouncement}</span>
          </div>
        )}

        {/* ── Engagement reactions ── */}
        <div className="flex items-center gap-2 mb-4">
          <ReactionButton
            label="Interested"
            emoji="👋"
            count={counts.interested}
            active={userReaction === "interested"}
            onClick={() => handleReact("interested")}
            activeClass="bg-blue-500 text-white border-blue-500"
            inactiveClass="text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"
          />
          <ReactionButton
            label="Going"
            emoji="✅"
            count={counts.going}
            active={userReaction === "going"}
            onClick={() => handleReact("going")}
            activeClass="bg-green-500 text-white border-green-500"
            inactiveClass="text-gray-600 border-gray-200 hover:border-green-300 hover:text-green-600"
          />
          <span className="text-xs text-gray-400 ml-auto">
            {(counts.interested + counts.going).toLocaleString()} interested
          </span>
        </div>

        {/* ── Action buttons ── */}
        <div className="flex gap-2.5">
          <Link
            to={`/events/${event._id}`}
            className="flex-1 text-center py-2.5 rounded-xl border border-gray-200 text-sm font-medium
                       text-gray-700 hover:bg-gray-50 transition-colors"
          >
            View Details
          </Link>

          {!isPastDate && event.status !== "cancelled" && event.status !== "completed" && (
            spotsLeft > 0 ? (
              <Link
                to={`/events/${event._id}/register`}
                className="flex-1 text-center py-2.5 rounded-xl bg-green-500 hover:bg-green-600
                           text-white text-sm font-semibold transition-colors shadow-sm"
              >
                Join as Volunteer
              </Link>
            ) : (
              <Link
                to={`/events/${event._id}/register`}
                className="flex-1 text-center py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600
                           text-white text-sm font-semibold transition-colors shadow-sm"
              >
                Join Waitlist
              </Link>
            )
          )}

          {event.fundGoal > 0 && !isPastDate && (
            <Link
              to={`/events/${event._id}#donate`}
              className="py-2.5 px-3.5 rounded-xl border border-emerald-300 text-emerald-700 text-sm
                         font-medium hover:bg-emerald-50 transition-colors"
              title="Donate to this event"
            >
              💰
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

/* ─── ReactionButton ─── */
function ReactionButton({ emoji, label, count, active, onClick, activeClass, inactiveClass }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                  border transition-all duration-150 select-none
                  ${active ? activeClass : `bg-white ${inactiveClass}`}`}
    >
      <span>{emoji}</span>
      <span>{label}</span>
      {count > 0 && (
        <span className={`font-semibold ${active ? "text-white/80" : ""}`}>{count}</span>
      )}
    </button>
  );
}