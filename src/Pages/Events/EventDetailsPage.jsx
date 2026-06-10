import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate, useSearchParams } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import { format, formatDistanceToNow, isPast, differenceInDays, differenceInHours } from "date-fns";
import { QRCodeCanvas } from "qrcode.react";
import { Shirt } from "lucide-react";

/* ─── Constants ─── */
const TYPE_META = {
  cleanup:    { emoji: "🧹", label: "Cleanup Drive",        color: "sky" },
  plantation: { emoji: "🌳", label: "Tree Plantation",       color: "emerald" },
  repair:     { emoji: "🏗️", label: "Repair Work",           color: "amber" },
  awareness:  { emoji: "📢", label: "Awareness Campaign",    color: "violet" },
  student:    { emoji: "🎓", label: "Student Volunteer Day", color: "pink" },
  meetup:     { emoji: "🤝", label: "Community Meetup",      color: "teal" },
};
const COLOR_MAP = {
  sky:     { bg: "bg-sky-50",     text: "text-sky-700",     ring: "ring-sky-200",     dot: "bg-sky-400"     },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-200", dot: "bg-emerald-400" },
  amber:   { bg: "bg-amber-50",   text: "text-amber-700",   ring: "ring-amber-200",   dot: "bg-amber-400"   },
  violet:  { bg: "bg-violet-50",  text: "text-violet-700",  ring: "ring-violet-200",  dot: "bg-violet-400"  },
  pink:    { bg: "bg-pink-50",    text: "text-pink-700",    ring: "ring-pink-200",    dot: "bg-pink-400"    },
  teal:    { bg: "bg-teal-50",    text: "text-teal-700",    ring: "ring-teal-200",    dot: "bg-teal-400"    },
};

/* ═══════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════ */
export default function EventDetailPage() {
  const { id }           = useParams();
  const navigate         = useNavigate();
  const [searchParams]   = useSearchParams();
  const commentInputRef  = useRef(null);
  const donateRef        = useRef(null);

  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about"); // about | volunteers | donors | comments

  // user info from localStorage
  const currentUserId = localStorage.getItem("userId");
  const isAdmin       = localStorage.getItem("role") === "admin";
  const token         = localStorage.getItem("token");

  // scroll to donate section if ?donate=true
  useEffect(() => {
    if (searchParams.get("donated") === "true") {
      toast.success("🎉 Thank you for your donation!");
    }
    if (searchParams.get("donate") === "true") {
      setTimeout(() => donateRef.current?.scrollIntoView({ behavior: "smooth" }), 600);
    }
  }, [searchParams]);

  /* ── fetch ── */
  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_MANUAL}/events/${id}`,
      );
      setData(res.data);
    } catch (err) {
      console.warn("API failed, using demo data:", err.message);
      
      // // Default/Demo data structure
      // const demoData = {
      //   event: {
      //     _id: id || "demo-event-001",
      //     title: "🌿 Community Cleanup Drive",
      //     description: "Join us for a community cleanup event! We'll be cleaning the local park and surrounding areas. All equipment will be provided. Let's work together to keep our neighborhood clean and beautiful! 🌱\n\nWe'll meet at the main entrance of Central Park at 9 AM. The event will include:\n- Gloves and trash bags provided\n- Free refreshments for volunteers\n- Certificate of participation\n- Great networking opportunity",
      //     eventType: "cleanup",
      //     date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      //     endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
      //     status: "upcoming",
      //     location: {
      //       address: "Central Park, Main Street, Dhaka",
      //       lat: 23.8103,
      //       lng: 90.4125
      //     },
      //     maxVolunteers: 50,
      //     registrationFee: 0,
      //     fundGoal: 10000,
      //     fundRaised: 4500,
      //     interestedCount: 23,
      //     goingCount: 15,
      //     coverImage: null,
      //     linkedIssueId: {
      //       _id: "issue-001",
      //       title: "Park Maintenance Needed"
      //     },
      //     organizerContact: "organizer@example.com",
      //     pinnedAnnouncement: "Bring water bottles and wear comfortable shoes!",
      //     equipmentList: ["Gloves", "Trash bags", "First aid kit", "Water bottles"],
      //     createdBy: {
      //       name: "Community Action Team",
      //       _id: "admin-001"
      //     },
      //     spendingBreakdown: [
      //       { label: "Equipment", amount: 3000 },
      //       { label: "Refreshments", amount: 1000 },
      //       { label: "Promotion", amount: 500 }
      //     ]
      //   },
      //   donations: [
      //     {
      //       _id: "don-1",
      //       amount: 1000,
      //       donorName: "John Doe",
      //       anonymous: false,
      //       createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      //     },
      //     {
      //       _id: "don-2",
      //       amount: 500,
      //       donorName: "Jane Smith",
      //       anonymous: false,
      //       createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      //     },
      //     {
      //       _id: "don-3",
      //       amount: 250,
      //       donorName: "Anonymous",
      //       anonymous: true,
      //       createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
      //     }
      //   ],
      //   comments: [
      //     {
      //       _id: "cmt-1",
      //       text: "Looking forward to this event! 🌟",
      //       userId: { name: "Sarah Johnson", _id: "user-1" },
      //       createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      //       likes: ["user-2", "user-3"],
      //       pinned: false,
      //       replies: [
      //         {
      //           _id: "reply-1",
      //           text: "Me too! Bringing my whole family!",
      //           userId: { name: "Mike Brown", _id: "user-2" },
      //           createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      //         }
      //       ]
      //     },
      //     {
      //       _id: "cmt-2",
      //       text: "Will there be parking available?",
      //       userId: { name: "Emily Chen", _id: "user-4" },
      //       createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      //       likes: [],
      //       pinned: false,
      //       replies: []
      //     }
      //   ],
      //   volunteerStats: {
      //     confirmedCount: 32,
      //     event?.waitlistCount: 8
      //   },
      //   userReaction: null,
      //   userRegistration: null
      // };

      // // If the user is logged in, add a demo registration for them
      // if (currentUserId) {
      //   demoData.userRegistration = {
      //     _id: "reg-demo-001",
      //     waitlisted: false,
      //     paymentStatus: "completed",
      //     role: "volunteer",
      //     attended: false,
      //     qrToken: "demo-qr-token-12345",
      //     waitlistPosition: null
      //   };
      // }

      // setData(demoData);
      toast.info("Showing demo data (API unavailable)");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchDetail(); }, [id]);

  /* ────────────── LOADING ────────────── */
  if (loading) return (
    <Shell>
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-[3px] border-green-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-stone-400 text-sm">Loading event...</p>
      </div>
    </Shell>
  );

  if (!data?.event) return (
    <Shell>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="text-7xl mb-4">🌿</div>
        <h2 className="text-2xl font-bold text-stone-800 mb-2">Event not found</h2>
        <Link to="/events" className="text-green-600 hover:underline text-sm mt-2">← Back to events</Link>
      </div>
    </Shell>
  );

  const { event, donations, comments, userReaction, userRegistration } = data;
  console.log(data)
  const typeMeta  = TYPE_META[event.eventType]   || TYPE_META.meetup;
  const colorCls  = COLOR_MAP[typeMeta.color]    || COLOR_MAP.teal;
  const eventDate = new Date(event.date);
  const isUpcoming = !isPast(eventDate);
  const isCancelled = event.status === "cancelled";
  const isCompleted = event.status === "completed";
  const volunteerCount = event?.volunteerCount
  const spotsLeft   = Math.max(0, (event.maxVolunteers || 0) - (event?.volunteerCount || 0));
  const spotsPercent = Math.min(100, ((event?.volunteerCount || 0) / (event.maxVolunteers || 1)) * 100);
  const fundPercent  = event.fundGoal > 0
    ? Math.min(100, Math.round(((event.fundRaised || 0) / event.fundGoal) * 100))
    : 0;
  const daysLeft = isUpcoming ? differenceInDays(eventDate, new Date()) : 0;
  const hoursLeft = isUpcoming ? differenceInHours(eventDate, new Date()) : 0;

  /* ────────────── RENDER ────────────── */
  return (
    <Shell>
      {/* ── Back ── */}
      <button onClick={() => navigate("/events")}
        className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 mb-6 transition-colors group">
        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Events
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ════ LEFT: Main content (2/3) ════ */}
        <div className="lg:col-span-2 space-y-5">

          {/* ── Hero card ── */}
          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
            {/* Cover */}
            {event.coverImage ? (
              <div className="relative h-56 md:h-72 lg:h-88 overflow-hidden">
                <img src={event.coverImage} alt={event.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.closest(".relative").className = `relative h-56 md:h-72 ${colorCls.bg} flex items-center justify-center`; e.target.replaceWith(Object.assign(document.createElement("span"), { className:"text-8xl opacity-20 select-none", textContent: typeMeta.emoji })); }} />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
                {/* Status overlay */}
                <div className="absolute top-4 right-4">
                  <StatusBadge status={event.status} />
                </div>
                {/* Countdown on cover */}
                {isUpcoming && (
                  <div className="absolute bottom-4 left-4">
                    <CountdownPill daysLeft={daysLeft} hoursLeft={hoursLeft} />
                  </div>
                )}
              </div>
            ) : (
              <div className={`h-56 md:h-72 ${colorCls.bg} flex items-center justify-center relative`}>
                <span className="text-8xl opacity-20 select-none">{typeMeta.emoji}</span>
                <div className="absolute top-4 right-4"><StatusBadge status={event.status} /></div>
                {isUpcoming && (
                  <div className="absolute bottom-4 left-4">
                    <CountdownPill daysLeft={daysLeft} hoursLeft={hoursLeft} />
                  </div>
                )}
              </div>
            )}

            <div className="p-6 md:p-8">
              {/* Type badge */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ring-1 ${colorCls.bg} ${colorCls.text} ${colorCls.ring}`}>
                  {typeMeta.emoji} {typeMeta.label}
                </span>
                {event.linkedIssueId && (
                  <Link to={`/detailIssues/${event.linkedIssueId._id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ring-1 bg-indigo-50 text-indigo-700 ring-indigo-200 hover:bg-indigo-100 transition-colors">
                    🔗 Linked: {event.linkedIssueId.title}
                  </Link>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-stone-900 leading-tight mb-4"
                style={{ fontFamily: "Fraunces, serif" }}>
                {event.title}
              </h1>

              {/* Quick info row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                <InfoChip icon="🗓️" label="Date & Time"
                  value={format(eventDate, "EEEE, dd MMM yyyy")}
                  sub={format(eventDate, "h:mm a") + (event.endDate ? ` – ${format(new Date(event.endDate),"h:mm a")}` : "")} />
                <InfoChip icon="📍" label="Location" value={event.location?.address}
                  sub={event.location?.lat ? `${event.location.lat}, ${event.location.lng}` : null} />
                {event.organizerContact && (
                  <InfoChip icon="📞" label="Organizer" value={event.createdBy?.name || "Admin"} sub={event.organizerContact} />
                )}
                {event.registrationFee > 0 && (
                  <InfoChip icon="💳" label="Registration Fee" value={`৳${event.registrationFee}`} sub="Refunded if event cancelled" />
                )}
              </div>

              {/* Pinned announcement */}
              {event.pinnedAnnouncement && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-5 flex gap-3">
                  <span className="text-xl shrink-0">📌</span>
                  <div>
                    <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wide mb-1">Pinned Announcement</p>
                    <p className="text-sm text-yellow-800 leading-relaxed">{event.pinnedAnnouncement}</p>
                  </div>
                </div>
              )}

              {/* Reaction buttons */}
              <ReactionBar
                eventId={event._id}
                initialReaction={userReaction}
                interestedCount={event.interestedCount}
                goingCount={event.goingCount}
                currentUserId={currentUserId}
                onRefresh={fetchDetail}
              />
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
            <div className="flex border-b border-stone-100 overflow-x-auto">
              {[
                { id: "about",     label: "About",     icon: "📋" },
                { id: "volunteers",label: "Volunteers", icon: "👥", count: volunteerCount },
                { id: "donors",    label: "Donors",     icon: "💰", count: donations?.length, show: event.fundGoal > 0 },
                { id: "comments",  label: "Discussion", icon: "💬", count: comments?.length },
              ].filter(t => t.show !== false).map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                    activeTab === tab.id
                      ? "border-green-500 text-green-600 bg-green-50/50"
                      : "border-transparent text-stone-500 hover:text-stone-700 hover:bg-stone-50"
                  }`}>
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                      activeTab === tab.id ? "bg-green-100 text-green-700" : "bg-stone-100 text-stone-500"
                    }`}>{tab.count}</span>
                  )}
                </button>
              ))}
            </div>

            <div className="p-6">
              {/* ── About tab ── */}
              {activeTab === "about" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-stone-400 uppercase tracking-wide mb-3">About This Event</h3>
                    <p className="text-stone-700 leading-relaxed text-[15px] whitespace-pre-line">{event.description}</p>
                  </div>

                  {event.equipmentList?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-stone-400 uppercase tracking-wide mb-3">📦 Bring With You</h3>
                      <div className="flex flex-wrap gap-2">
                        {event.equipmentList.map((item) => (
                          <span key={item} className="flex items-center gap-1.5 bg-stone-100 text-stone-700 text-sm px-3 py-1.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Map embed */}
                  {event.location?.lat && event.location?.lng && (
                    <div>
                      <h3 className="text-sm font-semibold text-stone-400 uppercase tracking-wide mb-3">📍 Location</h3>
                      <div className="rounded-2xl overflow-hidden border border-stone-200 h-48">
                        <iframe
                          title="Event location"
                          src={`https://www.openstreetmap.org/export/embed.html?bbox=${event.location.lng - 0.01},${event.location.lat - 0.01},${parseFloat(event.location.lng) + 0.01},${parseFloat(event.location.lat) + 0.01}&layer=mapnik&marker=${event.location.lat},${event.location.lng}`}
                          className="w-full h-full border-0"
                          loading="lazy"
                        />
                      </div>
                      <a href={`https://www.google.com/maps?q=${event.location.lat},${event.location.lng}`}
                        target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-green-600 hover:text-green-700 mt-2 font-medium">
                        Open in Google Maps →
                      </a>
                    </div>
                  )}

                  {/* Organizer */}
                  {event.createdBy && (
                    <div>
                      <h3 className="text-sm font-semibold text-stone-400 uppercase tracking-wide mb-3">👤 Organizer</h3>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm">
                          {event.createdBy.name?.[0]?.toUpperCase() || "A"}
                        </div>
                        <div>
                          <p className="font-medium text-stone-800 text-sm">{event.createdBy.name}</p>
                          {event.organizerContact && (
                            <p className="text-xs text-stone-400">{event.organizerContact}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Volunteers tab ── */}
              {activeTab === "volunteers" && (
                <VolunteersTab
                  confirmedCount={event?.volunteerCount || 0}
                  waitlistCount={event?.waitlistCount || 0}
                  maxVolunteers={event.maxVolunteers}
                  spotsPercent={spotsPercent}
                  spotsLeft={spotsLeft}
                  eventId={event._id}
                  isAdmin={isAdmin}
                />
              )}

              {/* ── Donors tab ── */}
              {activeTab === "donors" && event.fundGoal > 0 && (
                <DonorsTab
                  donations={donations}
                  fundRaised={event.fundRaised}
                  fundGoal={event.fundGoal}
                  fundPercent={fundPercent}
                  spendingBreakdown={event.spendingBreakdown}
                />
              )}

              {/* ── Comments/Discussion tab ── */}
              {activeTab === "comments" && (
                <CommentsTab
                  eventId={event._id}
                  comments={comments}
                  currentUserId={currentUserId}
                  isAdmin={isAdmin}
                  token={token}
                  inputRef={commentInputRef}
                  onCommentAdded={fetchDetail}
                />
              )}
            </div>
          </div>
        </div>

        {/* ════ RIGHT: Sidebar (1/3) ════ */}
        <div className="space-y-4">

          {/* ── User registration status card ── */}
          {userRegistration && (
            <UserRegistrationCard
              registration={userRegistration}
              event={event}
              isFree={!event.registrationFee}
            />
          )}

          {/* ── Register / Waitlist CTA ── */}
          {!userRegistration && !isCancelled && !isCompleted && (
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
              <h3 className="font-bold text-stone-900 mb-1" style={{ fontFamily:"Fraunces,serif" }}>
                {spotsLeft > 0 ? "Join This Event" : "Join Waitlist"}
              </h3>
              <p className="text-xs text-stone-400 mb-4">
                {spotsLeft > 0
                  ? `${spotsLeft} spots remaining out of ${event.maxVolunteers}`
                  : `All ${event.maxVolunteers} spots filled. ${event?.waitlistCount || 0} on waitlist.`}
              </p>

              {/* Progress bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-stone-400 mb-1.5">
                  <span>{volunteerCount || 0} joined</span>
                  <span>{event.maxVolunteers} max</span>
                </div>
                <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-700 ${
                    spotsLeft <= 0 ? "bg-red-400" : spotsPercent >= 80 ? "bg-amber-400" : "bg-green-400"
                  }`} style={{ width: `${spotsPercent}%` }} />
                </div>
              </div>

              {event.registrationFee > 0 && (
                <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 rounded-xl px-3 py-2 mb-4">
                  <span>💳</span>
                  <span>Registration fee: <strong>৳{event.registrationFee}</strong></span>
                </div>
              )}

              <Link to={`/events/${event._id}/register`}
                className={`block w-full text-center py-3 rounded-2xl font-semibold text-sm transition-colors ${
                  spotsLeft > 0
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-amber-500 hover:bg-amber-600 text-white"
                }`}>
                {spotsLeft > 0 ? "🙋 Register as Volunteer" : "⏳ Join Waitlist"}
              </Link>

              {!currentUserId && (
                <p className="text-xs text-center text-stone-400 mt-2">
                  <Link to="/login" className="text-green-600 hover:underline">Login</Link> to register faster
                </p>
              )}
            </div>
          )}

          {/* ── Donation card ── */}
          {event.fundGoal > 0 && !isCancelled && (
            <div ref={donateRef} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">💚</span>
                <h3 className="font-bold text-stone-900 text-sm" style={{ fontFamily:"Fraunces,serif" }}>Support This Event</h3>
              </div>
              <p className="text-xs text-stone-500 mb-4 leading-relaxed">
                Can't make it? Donate to help fund equipment and supplies.
              </p>

              {/* Funding progress */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-stone-500 mb-1.5">
                  <span className="font-semibold text-stone-700">৳{(event.fundRaised || 0).toLocaleString()} raised</span>
                  <span>{fundPercent}%</span>
                </div>
                <div className="h-2.5 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-linear-to-r from-emerald-400 to-teal-500 rounded-full transition-all"
                    style={{ width: `${fundPercent}%` }} />
                </div>
                <p className="text-xs text-stone-400 mt-1.5">Goal: ৳{event.fundGoal.toLocaleString()}</p>
              </div>

              <DonationForm eventId={event._id} onDonated={fetchDetail} />
            </div>
          )}

          {/* ── Event stats card ── */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
            <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-4">Event Stats</h3>
            <div className="space-y-3">
              <StatRow icon="👋" label="Interested" value={event.interestedCount || 0} />
              <StatRow icon="✅" label="Going"      value={event.goingCount      || 0} />
              <StatRow icon="🙋" label="Volunteers" value={volunteerCount || 0} />
              <StatRow icon="⏳" label="Waitlisted" value={event?.waitlistCount  || 0} />
              {event.fundGoal > 0 && (
                <StatRow icon="💰" label="Donations" value={`৳${(event.fundRaised||0).toLocaleString()}`} />
              )}
              <StatRow icon="💬" label="Comments"  value={comments?.length || 0} />
            </div>
          </div>

          {/* ── Admin quick actions ── */}
          {isAdmin && (
            <AdminQuickActions event={event} onRefresh={fetchDetail} token={token} />
          )}

          {/* ── Guest List ── */}
          {data?.registrationInfo?.filter(r => r.role === "guest").length > 0 && (
            <GuestSection guests={data.registrationInfo.filter(r => r.role === "guest")} />
          )}

          {/* ── Volunteer List ── */}
          {data?.registrationInfo?.filter(r => r.role === "volunteer").length > 0 && (
            <VolunteerSection volunteers={data.registrationInfo.filter(r => r.role === "volunteer")} />
          )}

          {/* ── Share card ── */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
            <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-3">Share Event</h3>
            <div className="flex gap-2">
              <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors">
                🔗 Copy Link
              </button>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank" rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium transition-colors">
                📘 Facebook
              </a>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

/* ═══════════════════════════════════════
   REACTION BAR
═══════════════════════════════════════ */
function ReactionBar({ eventId, initialReaction, interestedCount, goingCount, currentUserId, onRefresh }) {
  const [reaction, setReaction] = useState(initialReaction);
  const [counts,   setCounts]   = useState({ interested: interestedCount || 0, going: goingCount || 0 });
  const [loading,  setLoading]  = useState(false);

  const handleReact = async (type) => {
    if (!currentUserId) { toast.info("Please login to react"); return; }
    if (loading) return;
    setLoading(true);
    const prev      = reaction;
    const prevCounts = { ...counts };
    const isSame    = reaction === type;
    const nc        = { ...counts };
    if (prev === "interested") nc.interested = Math.max(0, nc.interested - 1);
    if (prev === "going")      nc.going      = Math.max(0, nc.going      - 1);
    if (!isSame) {
      if (type === "interested") nc.interested++;
      if (type === "going")      nc.going++;
    }
    setReaction(isSame ? null : type);
    setCounts(nc);
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${import.meta.env.VITE_API_URL}/events/${eventId}/react`,
        { reaction: isSame ? "not-going" : type },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch {
      setReaction(prev);
      setCounts(prevCounts);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {[
        { type: "interested", emoji: "👋", label: "Interested", count: counts.interested, activeClass: "bg-blue-500 text-white border-blue-500" },
        { type: "going",      emoji: "✅", label: "Going",      count: counts.going,      activeClass: "bg-green-500 text-white border-green-500" },
      ].map((r) => (
        <button key={r.type} onClick={() => handleReact(r.type)}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all select-none ${
            reaction === r.type
              ? r.activeClass
              : "bg-white text-stone-600 border-stone-200 hover:border-stone-300"
          }`}>
          <span>{r.emoji}</span>
          <span>{r.label}</span>
          {r.count > 0 && (
            <span className={`text-xs font-bold ${reaction === r.type ? "opacity-80" : "text-stone-400"}`}>
              {r.count}
            </span>
          )}
        </button>
      ))}
      <span className="text-xs text-stone-400 ml-auto">
        {(counts.interested + counts.going)} people interested
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════
   VOLUNTEERS TAB
═══════════════════════════════════════ */
function VolunteersTab({ confirmedCount, waitlistCount, maxVolunteers, spotsPercent, spotsLeft, eventId, isAdmin }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        <VolStatBox label="Confirmed" value={confirmedCount} color="green" />
        <VolStatBox label="Waitlisted" value={waitlistCount} color="amber" />
        <VolStatBox label="Spots Left" value={spotsLeft} color={spotsLeft <= 0 ? "red" : "blue"} />
      </div>

      <div>
        <div className="flex justify-between text-xs text-stone-500 mb-2">
          <span>{confirmedCount} / {maxVolunteers} spots filled</span>
          <span>{Math.round(spotsPercent)}%</span>
        </div>
        <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-700 ${
            spotsLeft <= 0 ? "bg-linear-to-r from-red-400 to-rose-500"
            : spotsPercent >= 80 ? "bg-linear-to-r from-amber-400 to-orange-400"
            : "bg-linear-to-r from-green-400 to-emerald-500"
          }`} style={{ width: `${spotsPercent}%` }} />
        </div>
      </div>

      <div className="bg-stone-50 rounded-2xl p-4 text-center text-sm text-stone-500">
        {confirmedCount === 0
          ? "No volunteers yet. Be the first to join! 🌱"
          : `${confirmedCount} ${confirmedCount === 1 ? "volunteer has" : "volunteers have"} signed up for this event.`}
        {event?.waitlistCount > 0 && (
          <p className="text-amber-600 font-medium mt-1">{event?.waitlistCount} on waitlist</p>
        )}
      </div>

      {isAdmin && (
        <Link to={`/admin/events/${eventId}/manage`}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-medium transition-colors">
          ⚙️ Manage Volunteers →
        </Link>
      )}
    </div>
  );
}

function GuestSection({ guests }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? guests : guests.slice(0, 5);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
      <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-4">
        👤 Guests ({guests.length})
      </h3>

      <div className="flex flex-wrap gap-2">
        {visible.map((guest) => (
          <div key={guest._id} className="relative group">
            {/* Avatar */}
            {guest.userPhoto ? (
              <img
                src={guest.userPhoto}
                alt={guest.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm cursor-pointer"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm border-2 border-white shadow-sm cursor-pointer">
                {guest.name?.[0]?.toUpperCase()}
              </div>
            )}

            {/* Hover name tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-zinc-800 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              <p className="flex justify-center items-center gap-1">{guest.name}
                {guest?.tshirtSize && (
                <span className="text-white flex justify-center items-center gap-1">(<Shirt size={10} fill="yellow"/> {guest?.tshirtSize})</span>
              )}
              </p>

              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-800" />
            </div>
          </div>
        ))}
      </div>

      {guests.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-3 text-xs text-green-600 hover:text-green-700 font-medium transition-colors"
        >
          {showAll ? "Show less ↑" : `See more (${guests.length - 5} more) →`}
        </button>
      )}
    </div>
  );
}

function VolunteerSection({ volunteers }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? volunteers : volunteers.slice(0, 5);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
      <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-4">
        🙋 Volunteers ({volunteers.length})
      </h3>

      <div className="flex flex-wrap gap-2">
        {visible.map((vol) => (
          <div key={vol._id} className="relative group">
            {vol.userPhoto ? (
              <img
                src={vol.userPhoto}
                alt={vol.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm cursor-pointer"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm border-2 border-white shadow-sm cursor-pointer">
                {vol.name?.[0]?.toUpperCase()}
              </div>
            )}

            {/* Hover tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-zinc-800 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              <p className="flex justify-center items-center gap-1">{vol.name}
                {vol?.tshirtSize && (
                <span className="text-white flex justify-center items-center gap-1">(<Shirt size={10} fill="blue"/> {vol?.tshirtSize})</span>
              )}
              </p>
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-800" />
            </div>
          </div>
        ))}
      </div>

      {volunteers.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-3 text-xs text-green-600 hover:text-green-700 font-medium transition-colors"
        >
          {showAll ? "Show less ↑" : `See more (${volunteers.length - 5} more) →`}
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   DONORS TAB
═══════════════════════════════════════ */
function DonorsTab({ donations, fundRaised, fundGoal, fundPercent, spendingBreakdown }) {
  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="bg-linear-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-100">
        <div className="flex justify-between items-end mb-3">
          <div>
            <p className="text-2xl font-bold text-emerald-700">৳{(fundRaised || 0).toLocaleString()}</p>
            <p className="text-xs text-emerald-600">raised of ৳{fundGoal.toLocaleString()} goal</p>
          </div>
          <p className="text-3xl font-bold text-emerald-300">{fundPercent}%</p>
        </div>
        <div className="h-3 bg-emerald-100 rounded-full overflow-hidden">
          <div className="h-full bg-linear-to-r from-emerald-400 to-teal-500 rounded-full transition-all"
            style={{ width: `${fundPercent}%` }} />
        </div>
        <p className="text-xs text-emerald-600 mt-2">{donations?.length || 0} donors · Thank you! 💚</p>
      </div>

      {/* Donor list */}
      {donations?.length > 0 ? (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wide">Recent Donors</h4>
          {donations.map((d, i) => (
            <div key={i} className="flex items-center justify-between py-2.5 border-b border-stone-50 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-bold">
                  {d.anonymous ? "?" : d.donorName?.[0]?.toUpperCase() || "?"}
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-800">
                    {d.anonymous ? "Anonymous" : d.donorName}
                  </p>
                  <p className="text-xs text-stone-400">
                    {formatDistanceToNow(new Date(d.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <span className="text-sm font-bold text-emerald-600">৳{d.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-stone-400 text-sm">
          Be the first to donate! 💚
        </div>
      )}

      {/* Spending breakdown */}
      {spendingBreakdown?.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-3">💰 Spending Breakdown</h4>
          <div className="space-y-2">
            {spendingBreakdown.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-stone-600">{item.label}</span>
                <span className="font-semibold text-stone-800">৳{item.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   COMMENTS TAB
═══════════════════════════════════════ */
function CommentsTab({ eventId, comments, currentUserId, isAdmin, token, inputRef, onCommentAdded }) {
  const [text,        setText]        = useState("");
  const [replyTo,     setReplyTo]     = useState(null); // { id, name }
  const [submitting,  setSubmitting]  = useState(false);
  const [localComments, setLocalComments] = useState(comments || []);

  useEffect(() => { setLocalComments(comments || []); }, [comments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    if (!currentUserId) { toast.info("Please login to comment"); return; }
    setSubmitting(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/events/${eventId}/comments`,
        { text: text.trim(), parentId: replyTo?.id || null },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newComment = res.data.comment;
      if (replyTo) {
        setLocalComments((prev) =>
          prev.map((c) =>
            c._id === replyTo.id ? { ...c, replies: [...(c.replies || []), newComment] } : c
          )
        );
      } else {
        setLocalComments((prev) => [newComment, ...prev]);
      }
      setText("");
      setReplyTo(null);
      toast.success("Comment posted!");
    } catch { toast.error("Could not post comment"); }
    finally  { setSubmitting(false); }
  };

  const handleDelete = async (commentId, parentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/events/comments/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (parentId) {
        setLocalComments((prev) => prev.map((c) =>
          c._id === parentId ? { ...c, replies: c.replies.filter((r) => r._id !== commentId) } : c
        ));
      } else {
        setLocalComments((prev) => prev.filter((c) => c._id !== commentId));
      }
      toast.success("Deleted");
    } catch { toast.error("Could not delete"); }
  };

  const handlePin = async (commentId) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/events/comments/${commentId}/pin`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLocalComments((prev) => prev.map((c) =>
        c._id === commentId ? { ...c, pinned: res.data.pinned } : c
      ));
    } catch { toast.error("Could not pin"); }
  };

  return (
    <div className="space-y-5">
      {/* Comment input */}
      {currentUserId ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          {replyTo && (
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 text-xs text-blue-700">
              <span>↩ Replying to <strong>{replyTo.name}</strong></span>
              <button type="button" onClick={() => setReplyTo(null)} className="ml-auto text-blue-400 hover:text-red-500">✕</button>
            </div>
          )}
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs shrink-0">
              {(localStorage.getItem("userName") || "U")[0]?.toUpperCase()}
            </div>
            <div className="flex-1">
              <textarea ref={inputRef} value={text} onChange={(e) => setText(e.target.value)}
                placeholder={replyTo ? `Reply to ${replyTo.name}...` : "Write a comment, ask a question, share thoughts..."}
                rows={3} maxLength={1000}
                className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm resize-none
                           focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100" />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-stone-400">{text.length}/1000</span>
                <button type="submit" disabled={submitting || !text.trim()}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-medium
                             transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                  {submitting ? <><Spinner /> Posting...</> : "Post Comment"}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="text-center py-4 bg-stone-50 rounded-2xl">
          <p className="text-stone-500 text-sm">
            <Link to="/login" className="text-green-600 font-medium hover:underline">Login</Link> to join the discussion
          </p>
        </div>
      )}

      {/* Comments list */}
      {localComments.length === 0 ? (
        <div className="text-center py-10 text-stone-400 text-sm">
          <div className="text-4xl mb-2">💬</div>
          No comments yet. Start the conversation!
        </div>
      ) : (
        <div className="space-y-4">
          {localComments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
              token={token}
              onDelete={(cId) => handleDelete(cId, null)}
              onDeleteReply={(rId) => handleDelete(rId, comment._id)}
              onPin={() => handlePin(comment._id)}
              onReply={(id, name) => {
                setReplyTo({ id, name });
                inputRef?.current?.focus();
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   COMMENT ITEM
═══════════════════════════════════════ */
function CommentItem({ comment, currentUserId, isAdmin, token, onDelete, onDeleteReply, onPin, onReply }) {
  const [likeCount, setLikeCount] = useState(comment.likes?.length || 0);
  const [liked,     setLiked]     = useState(comment.likes?.map(String).includes(currentUserId));

  const handleLike = async () => {
    if (!currentUserId) { toast.info("Login to like"); return; }
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/events/comments/${comment._id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLiked(res.data.liked);
      setLikeCount(res.data.likeCount);
    } catch { /* silent */ }
  };

  const isOwner = comment.userId?._id === currentUserId || comment.userId === currentUserId;

  return (
    <div className={`rounded-2xl p-4 ${comment.pinned ? "bg-yellow-50 border border-yellow-200" : "bg-stone-50"}`}>
      {comment.pinned && (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-yellow-700 mb-2">
          <span>📌</span> Pinned by Admin
        </div>
      )}
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs shrink-0">
          {comment.userId?.name?.[0]?.toUpperCase() || "?"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-semibold text-stone-800 text-sm">{comment.userId?.name || "User"}</span>
            <span className="text-xs text-stone-400">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
          </div>
          <p className="text-sm text-stone-700 leading-relaxed">{comment.text}</p>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <button onClick={handleLike}
              className={`flex items-center gap-1 text-xs transition-colors ${liked ? "text-red-500" : "text-stone-400 hover:text-red-400"}`}>
              <span>{liked ? "❤️" : "🤍"}</span>
              <span>{likeCount > 0 ? likeCount : ""}</span>
            </button>
            <button onClick={() => onReply(comment._id, comment.userId?.name)}
              className="text-xs text-stone-400 hover:text-green-600 transition-colors">
              ↩ Reply
            </button>
            {isAdmin && (
              <button onClick={onPin}
                className="text-xs text-stone-400 hover:text-yellow-600 transition-colors">
                {comment.pinned ? "📌 Unpin" : "📌 Pin"}
              </button>
            )}
            {(isOwner || isAdmin) && (
              <button onClick={() => onDelete(comment._id)}
                className="text-xs text-stone-400 hover:text-red-500 transition-colors ml-auto">
                🗑 Delete
              </button>
            )}
          </div>

          {/* Replies */}
          {comment.replies?.length > 0 && (
            <div className="mt-3 space-y-3 pl-3 border-l-2 border-stone-200">
              {comment.replies.map((reply) => (
                <div key={reply._id} className="flex gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-stone-200 flex items-center justify-center text-stone-600 font-bold text-[10px] shrink-0">
                    {reply.userId?.name?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-stone-700 text-xs">{reply.userId?.name || "User"}</span>
                      <span className="text-[10px] text-stone-400">
                        {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">{reply.text}</p>
                    {(reply.userId?._id === currentUserId || isAdmin) && (
                      <button onClick={() => onDeleteReply(reply._id)}
                        className="text-[10px] text-stone-300 hover:text-red-400 mt-1 transition-colors">
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   DONATION FORM (in sidebar)
═══════════════════════════════════════ */
function DonationForm({ eventId, onDonated }) {
  const [amount,    setAmount]    = useState("");
  const [name,      setName]      = useState(localStorage.getItem("userName") || "");
  const [email,     setEmail]     = useState(localStorage.getItem("userEmail") || "");
  const [anon,      setAnon]      = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [showForm,  setShowForm]  = useState(false);

  const PRESETS = [100, 500, 1000, 2000];

  const handleDonate = async () => {
    if (!amount || Number(amount) < 10) { toast.error("Minimum donation is ৳10"); return; }
    if (!email.trim()) { toast.error("Email is required for receipt"); return; }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/events/${eventId}/donate`,
        { amount: Number(amount), donorName: name || "Supporter", donorEmail: email, anonymous: anon },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      if (res.data.paymentUrl) {
        toast.info("Redirecting to payment...");
        window.location.href = res.data.paymentUrl;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Donation failed");
    } finally {
      setLoading(false);
    }
  };

  if (!showForm) return (
    <button onClick={() => setShowForm(true)}
      className="w-full py-2.5 rounded-2xl bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600
                 text-white font-semibold text-sm transition-all shadow-sm">
      💚 Donate to This Event
    </button>
  );

  return (
    <div className="space-y-3">
      {/* Preset amounts */}
      <div className="grid grid-cols-4 gap-1.5">
        {PRESETS.map((p) => (
          <button key={p} onClick={() => setAmount(String(p))}
            className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
              amount === String(p)
                ? "bg-emerald-500 text-white border-emerald-500"
                : "bg-white text-stone-600 border-stone-200 hover:border-emerald-300"
            }`}>
            ৳{p}
          </button>
        ))}
      </div>

      <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
        placeholder="Custom amount (৳)"
        className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />

      {!localStorage.getItem("userId") && (
        <>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Your name (optional)"
            className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-emerald-400" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Email for receipt *"
            className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-emerald-400" />
        </>
      )}

      <label className="flex items-center gap-2 text-xs text-stone-500 cursor-pointer select-none">
        <input type="checkbox" checked={anon} onChange={(e) => setAnon(e.target.checked)}
          className="rounded border-stone-300 text-emerald-500 focus:ring-emerald-400" />
        Donate anonymously
      </label>

      <div className="flex gap-2">
        <button onClick={() => setShowForm(false)}
          className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-600 text-xs font-medium hover:bg-stone-50 transition-colors">
          Cancel
        </button>
        <button onClick={handleDonate} disabled={loading || !amount}
          className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold
                     transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5">
          {loading ? <><Spinner /> Processing...</> : `Donate ৳${amount || "—"}`}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   USER REGISTRATION STATUS CARD
═══════════════════════════════════════ */
function UserRegistrationCard({ registration, event, isFree }) {
  const isWaitlisted   = registration.waitlisted;
  const paymentPending = registration.paymentStatus === "pending" && !isFree;

  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${
      isWaitlisted ? "bg-amber-50 border-amber-200" : "bg-green-50 border-green-200"
    }`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{isWaitlisted ? "⏳" : "✅"}</span>
        <h3 className="font-bold text-stone-900 text-sm">
          {isWaitlisted ? `Waitlist #${registration.waitlistPosition}` : "You're Registered!"}
        </h3>
      </div>

      {isWaitlisted ? (
        <p className="text-xs text-amber-700 leading-relaxed mb-3">
          You're #{registration.waitlistPosition} on the waitlist. We'll email you immediately if a spot opens up.
        </p>
      ) : paymentPending ? (
        <p className="text-xs text-amber-700 mb-3">⚠️ Payment pending — check your email for payment link.</p>
      ) : (
        <p className="text-xs text-green-700 mb-3">
          Your spot is confirmed as a <strong>{registration.role}</strong>.
          {registration.attended && " ✅ Attendance marked!"}
        </p>
      )}

      {/* QR code */}
      {!isWaitlisted && registration.qrToken && !registration.attended && (
        <div className="bg-white rounded-xl p-3 border border-green-200 text-center">
          <p className="text-xs text-stone-500 mb-2">Your QR for check-in</p>
          <div className="inline-block p-2 bg-white rounded-lg">
            <QRCodeCanvas value={registration.qrToken} size={100} level="M" />
          </div>
        </div>
      )}

      {registration.attended && (
        <div className="flex items-center gap-2 bg-green-100 rounded-xl px-3 py-2 text-xs text-green-700 font-medium">
          <span>🏅</span> Attendance recorded — certificate coming soon!
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   ADMIN QUICK ACTIONS
═══════════════════════════════════════ */
function AdminQuickActions({ event, onRefresh, token }) {
  const [updating, setUpdating] = useState(false);

  const updateStatus = async (status) => {
    if (!window.confirm(`Change status to "${status}"?`)) return;
    setUpdating(true);
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/events/${event._id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Status updated to ${status}`);
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  const nextStatuses = {
    draft:     ["upcoming", "cancelled"],
    upcoming:  ["ongoing",  "cancelled"],
    ongoing:   ["completed","cancelled"],
    completed: [],
    cancelled: [],
  };

  const available = nextStatuses[event.status] || [];

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
      <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-3">⚙️ Admin Actions</h3>
      <div className="space-y-2">
        <Link to={`/admin/events/${event._id}/manage`}
          className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-medium transition-colors">
          👥 Manage Volunteers
        </Link>
        {available.map((s) => (
          <button key={s} onClick={() => updateStatus(s)} disabled={updating}
            className={`flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 ${
              s === "cancelled" ? "bg-red-50 hover:bg-red-100 text-red-700"
              : s === "completed" ? "bg-blue-50 hover:bg-blue-100 text-blue-700"
              : "bg-green-50 hover:bg-green-100 text-green-700"
            }`}>
            {s === "ongoing" ? "🔴 Mark as Ongoing" : s === "completed" ? "✅ Mark as Completed" : s === "cancelled" ? "❌ Cancel Event" : `→ ${s}`}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   SMALL HELPERS
═══════════════════════════════════════ */
function Shell({ children }) {
  return (
    <div className="min-h-screen bg-[#f5f4f0] py-8 px-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Fraunces:wght@600;700;800&display=swap');`}</style>
      <div className="max-w-6xl mx-auto">{children}</div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    upcoming:  "bg-green-500/90  text-white",
    ongoing:   "bg-blue-500/90   text-white animate-pulse",
    completed: "bg-stone-500/80  text-white",
    cancelled: "bg-red-500/90    text-white",
    draft:     "bg-yellow-400/90 text-stone-900",
  };
  const labels = {
    upcoming: "Upcoming", ongoing: "🔴 Live", completed: "Completed", cancelled: "Cancelled", draft: "Draft",
  };
  return (
    <span className={`text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm ${styles[status] || styles.upcoming}`}>
      {labels[status] || status}
    </span>
  );
}

function CountdownPill({ daysLeft, hoursLeft }) {
  const text = daysLeft > 1 ? `${daysLeft} days to go`
    : daysLeft === 1 ? "Tomorrow!"
    : hoursLeft > 0 ? `${hoursLeft}h to go`
    : "Starting soon!";
  return (
    <span className="text-xs font-bold bg-white/90 backdrop-blur-sm text-green-700 px-3 py-1.5 rounded-full shadow-sm">
      ⏳ {text}
    </span>
  );
}

function InfoChip({ icon, label, value, sub }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 bg-stone-50 rounded-2xl p-3.5">
      <span className="text-lg shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-medium text-stone-800 leading-snug">{value}</p>
        {sub && <p className="text-xs text-stone-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function StatRow({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-sm text-stone-500">
        <span>{icon}</span>{label}
      </span>
      <span className="text-sm font-bold text-stone-800">{value}</span>
    </div>
  );
}

function VolStatBox({ label, value, color }) {
  const colors = { green:"text-green-600 bg-green-50", amber:"text-amber-600 bg-amber-50", blue:"text-blue-600 bg-blue-50", red:"text-red-500 bg-red-50" };
  return (
    <div className={`rounded-2xl p-3 text-center ${colors[color]}`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs font-medium opacity-80 mt-0.5">{label}</p>
    </div>
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