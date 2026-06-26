import { useState } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";
import { format, formatDistanceToNow, isPast } from "date-fns";
import {
  CalendarDays,
  MapPin,
  Users,
  Wallet,
  Pin,
  Radio,
  Link2,
  Hand,
  Check,
  Banknote,
  Wrench,
  Megaphone,
  GraduationCap,
  UsersRound,
  Sprout,
  Brush,
  HandCoins,
} from "lucide-react";
import useAxios from "../../Hooks/useAxios";

/* ─── Constants ─── */
const TYPE_CONFIG = {
  cleanup:    { bg: "bg-sky-500/10",     text: "text-sky-400",     ring: "ring-sky-500/30",     iconFill: 'blue' , iconColor:'blue', Icon: Brush },
  plantation: { bg: "bg-emerald-500/10", text: "text-emerald-400", ring: "ring-emerald-500/30", iconFill: 'green' , iconColor:'green', Icon: Sprout },
  repair:     { bg: "bg-amber-500/10",   text: "text-amber-400",   ring: "ring-amber-500/30",   iconFill: 'red' , iconColor:'red', Icon: Wrench },
  awareness:  { bg: "bg-violet-500/10",  text: "text-violet-400",  ring: "ring-violet-500/30",  iconFill: 'violet' , iconColor:'violet', Icon: Megaphone },
  student:    { bg: "bg-pink-500/10",    text: "text-pink-400",    ring: "ring-pink-500/30",    Icon: GraduationCap },
  meetup:     { bg: "bg-teal-500/10",    text: "text-teal-400",    ring: "ring-teal-500/30",    Icon: UsersRound },
};
const TYPE_LABEL = {
  cleanup: "Cleanup Drive", plantation: "Tree Plantation",
  repair: "Repair Work",   awareness: "Awareness",
  student: "Student Day",  meetup: "Meetup",
};
const STATUS_STYLE = {
  upcoming:  "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30",
  ongoing:   "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/30",
  completed: "bg-zinc-700 text-white",
  cancelled: "bg-red-500/10 text-red-400 ring-1 ring-red-500/30",
  draft:     "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/30",
};

/* ─── EventCard ─── */
export default function EventCard({ event }) {
  const [userReaction, setUserReaction] = useState(event.userReaction || null);
  const [counts, setCounts] = useState({
    interested: event.interestedCount || 0,
    going: event.goingCount || 0,
  });
  const [reacting, setReacting] = useState(false);
  const axiosInstance = useAxios()

  const typeConfig  = TYPE_CONFIG[event.eventType] || TYPE_CONFIG.meetup;
  const TypeIcon    = typeConfig.Icon;
  const TypeIconColor = typeConfig.iconColor;
  const TypeIconFill = typeConfig.iconFill
  const eventDate   = new Date(event.date);
  const isPastDate  = isPast(eventDate);
  const spotsLeft   = (event.maxVolunteers || 0) - (event.volunteerCount || 0);
  const spotsPercent = Math.min(100, ((event.volunteerCount || 0) / (event.maxVolunteers || 1)) * 100);
  const fundPercent  = event.fundGoal > 0
    ? Math.min(100, Math.round(((event.fundRaised || 0) / event.fundGoal) * 100))
    : 0;

  /* ── React handler ── */
  const handleReact = async (type) => {
    // if (!currentUserId) { toast.info("Please login to react"); return; }
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

    //implement later
    try {
      await axiosInstance.post(
        `/events/${event._id}/react`,
        { reaction: isSame ? "not-going" : type },
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
    <article className="group bg-linear-to-br from-zinc-800 to-zinc-900 rounded-2xl border border-zinc-700
                        overflow-hidden hover:-translate-y-0.5 hover:border-zinc-600
                        transition-all duration-200">

      {/* ── Cover ── */}
      {event.coverImage ? (
        <div className="relative h-44 overflow-hidden">
          <img
            src={event.coverImage}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              const wrapper = e.target.closest(".relative");
              wrapper.className = `relative h-44 ${typeConfig.bg} flex items-center justify-center`;
              e.target.remove();
              const icon = document.createElement("div");
              icon.className = "opacity-20";
              wrapper.appendChild(icon);
            }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
        </div>
      ) : (
        <div className={`h-44 ${typeConfig.bg} flex items-center justify-center`}>
          <TypeIcon className={`w-14 h-14 opacity-20 ${typeConfig.text}`} />
        </div>
      )}

      <div className="p-5">
        {/* ── Top badges ── */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1
                            rounded-full ring-1 ${typeConfig.bg} ${typeConfig.text} ${typeConfig.ring}`}>
            <TypeIcon className="w-3 h-3" fill={TypeIconFill} color={TypeIconColor} />
            {TYPE_LABEL[event.eventType] || event.eventType}
          </span>

          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full
                            ${STATUS_STYLE[event.status] || STATUS_STYLE.upcoming}`}>
            {event.status === "ongoing" && (
              <Radio className="w-3 h-3 animate-pulse" />
            )}
            {event.status === "ongoing" ? "Live Now" : event.status}
          </span>

          {event.registrationFee > 0 && (
            <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full
                             bg-zinc-700 text-white ring-1 ring-red-500/30">
              <Wallet className="w-3 h-3"/>
              ৳{event.registrationFee} fee
            </span>
          )}

          {event.linkedIssueId && (
            <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full
                             bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/30">
              <Link2 className="w-3 h-3" />
              Linked issue
            </span>
          )}
        </div>

        {/* ── Title ── */}
        <h3 className="font-semibold text-white text-base leading-snug mb-3 line-clamp-2">
          {event.title}
        </h3>

        {/* ── Date & location ── */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-sm text-white">
            <CalendarDays className="w-3.5 h-3.5 shrink-0 text-zinc-500" />
            <span className="font-medium text-white">{format(eventDate, "dd MMM yyyy")}</span>
            <span className="text-zinc-600">·</span>
            <span>{format(eventDate, "h:mm a")}</span>
            {!isPastDate && (
              <span className="ml-auto text-xs text-emerald-400 font-medium bg-emerald-500/10
                               px-2 py-0.5 rounded-full ring-1 ring-emerald-500/20">
                {formatDistanceToNow(eventDate, { addSuffix: true })}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-white">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-zinc-500" />
            <span className="truncate">{event.location?.address || "Location TBD"}</span>
          </div>
        </div>

        {/* ── Volunteer progress ── */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-zinc-500 mb-1.5">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span className="font-semibold text-white">{event.volunteerCount || 0}</span> joined
            </span>
            <span>
              {spotsLeft > 0 ? (
                <><span className="font-semibold text-white">{spotsLeft}</span> spots left</>
              ) : (
                <span className="text-red-400 font-medium">Full · waitlist open</span>
              )}
            </span>
          </div>
          <div className="h-1.5 bg-zinc-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                spotsLeft <= 0 ? "bg-red-500" :
                spotsPercent >= 80 ? "bg-amber-500" : "bg-emerald-500"
              }`}
              style={{ width: `${spotsPercent}%` }}
            />
          </div>
        </div>

        {/* ── Funding bar ── */}
        {event.fundGoal > 0 && (
          <div className="mb-4 bg-emerald-500/5 rounded-xl p-3 border border-emerald-500/20">
            <div className="flex justify-between text-xs text-emerald-400 mb-1.5">
              <span className="flex items-center gap-1">
                <Banknote className="w-3.5 h-3.5" />
                ৳{(event.fundRaised || 0).toLocaleString()} raised
              </span>
              <span>{fundPercent}% of ৳{event.fundGoal.toLocaleString()}</span>
            </div>
            <div className="h-1.5 bg-zinc-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-emerald-500 to-teal-500 rounded-full transition-all"
                style={{ width: `${fundPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* ── Pinned announcement ── */}
        {event.pinnedAnnouncement && (
          <div className="mb-4 bg-red-500/15 border border-red-500/20 rounded-xl px-3 py-2.5
                          text-xs text-white flex gap-2 items-start">
            <Pin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-red" fill="red" color="red"/>
            <span>{event.pinnedAnnouncement}</span>
          </div>
        )}

        {/* ── Engagement reactions ── */}
        <div className="flex items-center gap-2 mb-4">
          <ReactionButton
            Icon={Hand}
            label="Interested"
            count={counts.interested}
            active={userReaction === "interested"}
            onClick={() => handleReact("interested")}
            activeClass="bg-blue-600 text-white border-blue-600"
            inactiveClass="text-white hover:cursor-pointer border-zinc-800 hover:border-blue-500/50 hover:text-blue-400"
          />
          <ReactionButton
            Icon={Check}
            label="Going"
            count={counts.going}
            active={userReaction === "going"}
            onClick={() => handleReact("going")}
            activeClass="bg-emerald-600 text-white border-emerald-600"
            inactiveClass="text-white hover:cursor-pointer border-zinc-800 hover:border-emerald-500/50 hover:text-emerald-400"
          />
          <span className="text-xs text-zinc-600 ml-auto">
            {(counts.interested + counts.going).toLocaleString()} interested
          </span>
        </div>

        {/* ── Action buttons ── */}
        <div className="flex gap-2.5">
          <Link
            to={`/events/${event._id}`}
            className="flex-1 text-center py-2.5 rounded-xl border bg-zinc-700 border-zinc-700 text-sm font-medium
                       text-white hover:bg-zinc-600 hover:cursor-pointer transition-colors"
          >
            View Details
          </Link>

          {!isPastDate && event.status !== "cancelled" && event.status !== "completed" && (
            spotsLeft > 0 ? (
              <Link
                to={`/events/${event._id}/register`}
                className="flex-1 text-center py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500
                           text-white text-sm font-semibold transition-colors"
              >
                Join as Volunteer
              </Link>
            ) : (
              <Link
                to={`/events/${event._id}/register`}
                className="flex-1 text-center py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500
                           text-white text-sm font-semibold transition-colors"
              >
                Join Waitlist
              </Link>
            )
          )}

          {event.fundGoal > 0 && !isPastDate && (
            <Link
              to={`/events/${event._id}#donate`}
              className="py-2.5 px-2.5 rounded-xl border border-zinc-700 text-white text-sm
                         font-medium bg-zinc-700 hover:text-emerald-400 transition-colors"
              title="Donate to this event"
            >
              <HandCoins className="w-5 h-5" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

/* ─── ReactionButton ─── */
function ReactionButton({ Icon, label, count, active, onClick, activeClass, inactiveClass }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                  border transition-all duration-150 select-none
                  ${active ? activeClass : `bg-transparent ${inactiveClass}`}`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{label}</span>
      {count > 0 && (
        <span className={`font-semibold ${active ? "opacity-80" : ""}`}>{count}</span>
      )}
    </button>
  );
}