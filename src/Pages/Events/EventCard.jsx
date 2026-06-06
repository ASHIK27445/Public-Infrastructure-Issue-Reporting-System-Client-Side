import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import { format, formatDistanceToNow, isPast, isToday, isTomorrow } from "date-fns";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock,
  Heart,
  Share2,
  Bookmark,
  MessageCircle,
  Send,
  MoreHorizontal,
  Sparkles,
  Zap,
  TrendingUp,
  PartyPopper,
  Eye,
  UserPlus,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Play,
  ImageIcon,
  Smile,
  ThumbsUp,
  CalendarCheck
} from "lucide-react";

const EVENT_COLORS = {
  cleanup:    { primary: "#3b82f6", soft: "#eff6ff", text: "#1e40af" },
  plantation: { primary: "#10b981", soft: "#ecfdf5", text: "#065f46" },
  repair:     { primary: "#f59e0b", soft: "#fffbeb", text: "#92400e" },
  awareness:  { primary: "#8b5cf6", soft: "#f5f3ff", text: "#5b21b6" },
  student:    { primary: "#ec4899", soft: "#fdf2f8", text: "#9d174d" },
  meetup:     { primary: "#06b6d4", soft: "#ecfeff", text: "#155e75" },
};

export function EventCard({ event, currentUserId, isListView = false }) {
  const [reaction, setReaction] = useState(event.userReaction || null);
  const [counts, setCounts] = useState({
    interested: event.interestedCount || 0,
    going: event.goingCount || 0,
    likes: event.likesCount || 0,
  });
  const [reacting, setReacting] = useState(false);
  const [isSaved, setIsSaved] = useState(event.isSaved || false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [rippleEffect, setRippleEffect] = useState({ show: false, x: 0, y: 0 });
  const cardRef = useRef(null);
  const shareMenuRef = useRef(null);

  useEffect(() => {
    setAnimateIn(true);
    const timer = setTimeout(() => setAnimateIn(false), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(e.target)) {
        setShowShareMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const colors = EVENT_COLORS[event.eventType] || EVENT_COLORS.cleanup;
  const eventDate = new Date(event.date);
  const isUpcoming = !isPast(eventDate);
  const daysLeft = Math.ceil((eventDate - new Date()) / (1000 * 60 * 60 * 24));
  const spotsLeft = event.maxVolunteers - event.volunteerCount;
  const spotPercentage = (event.volunteerCount / event.maxVolunteers) * 100;
  const fundPercent = event.fundGoal > 0
    ? Math.min(100, Math.round((event.fundRaised / event.fundGoal) * 100))
    : 0;

  const getDateDisplay = () => {
    if (isToday(eventDate)) return { text: "Today", urgent: true };
    if (isTomorrow(eventDate)) return { text: "Tomorrow", urgent: true };
    if (daysLeft <= 7) return { text: `${daysLeft} days left`, urgent: daysLeft <= 3 };
    return { text: format(eventDate, "MMM d"), urgent: false };
  };

  const dateDisplay = getDateDisplay();

  const handleReact = async (type) => {
    if (!currentUserId) {
      toast.info("Please login to interact");
      return;
    }
    if (reacting) return;
    
    // Ripple effect
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setRippleEffect({ 
        show: true, 
        x: rect.width / 2, 
        y: rect.height / 2 
      });
      setTimeout(() => setRippleEffect({ show: false, x: 0, y: 0 }), 600);
    }

    setReacting(true);
    const prev = reaction;
    const prevCounts = { ...counts };

    const newCounts = { ...counts };
    if (prev === "interested") newCounts.interested--;
    if (prev === "going") newCounts.going--;
    if (type !== prev) {
      if (type === "interested") newCounts.interested++;
      if (type === "going") newCounts.going++;
    }
    setReaction(type === prev ? null : type);
    setCounts(newCounts);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/events/${event._id}/react`,
        { reaction: type === prev ? "not-going" : type },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(
        type === prev ? "Response removed" : `You're ${type}!`,
        { 
          icon: type === "going" ? "🎉" : "👋",
          style: { background: '#1f2937', color: '#fff', border: '1px solid #374151' }
        }
      );
    } catch {
      setReaction(prev);
      setCounts(prevCounts);
      toast.error("Failed to save response");
    } finally {
      setReacting(false);
    }
  };

  const handleShare = (platform) => {
    const url = `${window.location.origin}/events/${event._id}`;
    const text = `Check out this event: ${event.title}`;
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
      copy: null,
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
    setShowShareMenu(false);
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        group relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden
        transition-all duration-300 cursor-pointer
        hover:border-zinc-700 hover:shadow-2xl hover:shadow-black/50
        hover:-translate-y-1
        ${isListView ? 'flex gap-6' : 'flex flex-col'}
        ${animateIn ? 'animate-card-in' : ''}
      `}
      style={{
        '--accent-color': colors.primary,
        '--accent-soft': colors.soft,
        '--accent-text': colors.text,
      }}
    >
      {/* Ripple Effect */}
      {rippleEffect.show && (
        <div 
          className="absolute bg-white/20 rounded-full animate-ripple pointer-events-none z-10"
          style={{
            left: rippleEffect.x - 100,
            top: rippleEffect.y - 100,
            width: 200,
            height: 200,
          }}
        />
      )}

      {/* Image Section */}
      <div className={`relative ${isListView ? 'w-72 shrink-0' : 'w-full'} overflow-hidden bg-zinc-800`}>
        {event.coverImage ? (
          <>
            <div 
              className="relative aspect-[16/10] cursor-pointer overflow-hidden"
              onClick={() => setShowFullImage(true)}
            >
              <img
                src={event.coverImage}
                alt={event.title}
                className="w-full h-full object-cover transition-all duration-700
                  group-hover:scale-110 group-hover:rotate-1"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-zinc-900/20 to-transparent
                opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Image hover overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 
                group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                  <Eye className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="aspect-[16/10] bg-zinc-800 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `radial-gradient(circle at 20% 50%, ${colors.primary} 0%, transparent 50%)`,
              }}
            />
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-zinc-700/50 backdrop-blur-sm 
                flex items-center justify-center border border-zinc-600/50
                group-hover:scale-110 transition-transform duration-500">
                <Calendar className="w-10 h-10 text-zinc-400" />
              </div>
            </div>
          </div>
        )}

        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {isUpcoming && daysLeft <= 7 && (
            <div className={`
              px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur-md
              border flex items-center gap-1.5
              ${daysLeft <= 3 
                ? 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse' 
                : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
              }
            `}>
              <Zap className="w-3 h-3" />
              {daysLeft === 0 ? "Today!" : `${daysLeft}d`}
            </div>
          )}
          {event.status === "ongoing" && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold
              bg-red-500/20 text-red-400 border border-red-500/30 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              LIVE
            </div>
          )}
          {event.registrationFee > 0 && (
            <div className="px-2.5 py-1 rounded-full text-[11px] font-bold
              bg-zinc-800/80 backdrop-blur-md text-zinc-300 border border-zinc-700/50">
              ৳{event.registrationFee}
            </div>
          )}
        </div>

        {/* Top Right Actions */}
        <div className="absolute top-3 right-3 flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsSaved(!isSaved);
              toast.success(isSaved ? "Removed" : "Saved!", { 
                style: { background: '#1f2937', color: '#fff', border: '1px solid #374151' }
              });
            }}
            className={`
              p-2 rounded-lg backdrop-blur-md transition-all duration-300
              hover:scale-110 active:scale-95
              ${isSaved 
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                : 'bg-black/30 text-white/80 hover:bg-black/50 border border-white/10'
              }
            `}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
          <div className="relative" ref={shareMenuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowShareMenu(!showShareMenu);
              }}
              className="p-2 rounded-lg backdrop-blur-md bg-black/30 text-white/80
                hover:bg-black/50 border border-white/10 transition-all duration-300
                hover:scale-110 active:scale-95"
            >
              <Share2 className="w-4 h-4" />
            </button>
            
            {/* Share Menu */}
            {showShareMenu && (
              <div className="absolute right-0 top-12 w-56 bg-zinc-800 border border-zinc-700 
                rounded-xl shadow-2xl shadow-black/50 backdrop-blur-xl overflow-hidden z-50
                animate-slide-down">
                <div className="p-2">
                  <button onClick={() => handleShare('facebook')} 
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-200
                      hover:bg-zinc-700 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Share2 className="w-4 h-4 text-blue-400" />
                    </div>
                    Share on Facebook
                  </button>
                  <button onClick={() => handleShare('twitter')} 
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-200
                      hover:bg-zinc-700 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center">
                      <Send className="w-4 h-4 text-sky-400" />
                    </div>
                    Share on Twitter
                  </button>
                  <button onClick={() => handleShare('whatsapp')} 
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-200
                      hover:bg-zinc-700 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-green-400" />
                    </div>
                    Share on WhatsApp
                  </button>
                  <button onClick={() => handleShare('copy')} 
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-200
                      hover:bg-zinc-700 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-zinc-600/50 flex items-center justify-center">
                      <ChevronRight className="w-4 h-4 text-zinc-400" />
                    </div>
                    Copy link
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Attendee Avatars */}
        {event.recentAttendees && event.recentAttendees.length > 0 && (
          <div className="absolute bottom-3 left-3 flex items-center">
            <div className="flex -space-x-2">
              {event.recentAttendees.slice(0, 3).map((attendee, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-zinc-900 overflow-hidden
                  ring-2 ring-white/10 hover:scale-110 transition-transform">
                  <img src={attendee.avatar} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
              {event.attendeeCount > 3 && (
                <div className="w-8 h-8 rounded-full bg-zinc-700 border-2 border-zinc-900 
                  flex items-center justify-center text-[10px] font-bold text-zinc-300
                  ring-2 ring-white/10">
                  +{event.attendeeCount - 3}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className={`flex-1 p-5 flex flex-col ${isListView ? '' : ''}`}>
        {/* Event Type & Date */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: colors.primary }}
            />
            <span className="text-[12px] font-medium text-zinc-400 uppercase tracking-wider">
              {event.eventType}
            </span>
          </div>
          <span className={`text-[12px] font-bold ${
            dateDisplay.urgent ? 'text-red-400' : 'text-zinc-500'
          }`}>
            {dateDisplay.text}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-zinc-100 
          transition-colors leading-snug">
          {event.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-2 mb-4 text-sm text-zinc-400">
          <MapPin className="w-4 h-4 shrink-0" style={{ color: colors.primary }} />
          <span className="truncate">{event.location?.address}</span>
        </div>

        {/* Capacity Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-zinc-500" />
              <span className="text-[13px] text-zinc-400 font-medium">
                <span className="text-white">{event.volunteerCount}</span>
                <span className="text-zinc-600">/{event.maxVolunteers}</span>
              </span>
            </div>
            <span className={`text-[12px] font-bold ${
              spotsLeft <= 5 ? 'text-amber-400 animate-pulse' : 'text-zinc-500'
            }`}>
              {spotsLeft === 0 ? 'Full' : `${spotsLeft} spots`}
            </span>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{ 
                width: `${spotPercentage}%`,
                backgroundColor: colors.primary,
                boxShadow: `0 0 10px ${colors.primary}40`
              }}
            />
          </div>
        </div>

        {/* Funding Progress */}
        {event.fundGoal > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] text-zinc-500">Funding</span>
              <span className="text-[12px] font-bold" style={{ color: colors.primary }}>
                {fundPercent}%
              </span>
            </div>
            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{ 
                  width: `${fundPercent}%`,
                  background: `linear-gradient(90deg, ${colors.primary}, ${colors.primary}80)`,
                }}
              />
            </div>
          </div>
        )}

        {/* Announcement */}
        {event.pinnedAnnouncement && (
          <div className="mb-4 p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50
            relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: colors.primary }} />
            <p className="text-[12px] text-zinc-300 leading-relaxed pl-2">
              {event.pinnedAnnouncement}
            </p>
          </div>
        )}

        <div className="flex-1" />

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-auto">
          {/* Interested Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleReact("interested");
            }}
            disabled={reacting}
            className={`
              flex-1 flex items-center justify-center gap-2 py-3 rounded-xl
              text-sm font-semibold transition-all duration-300
              active:scale-95
              ${reaction === "interested"
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-750 border border-zinc-700 hover:border-zinc-600'
              }
            `}
          >
            <ThumbsUp className={`w-4 h-4 ${reaction === "interested" ? 'animate-bounce' : ''}`} />
            <span>Interested</span>
            {counts.interested > 0 && (
              <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                reaction === "interested" ? 'bg-blue-400/30' : 'bg-zinc-700'
              }`}>
                {counts.interested}
              </span>
            )}
          </button>

          {/* Going Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleReact("going");
            }}
            disabled={reacting || spotsLeft === 0}
            className={`
              flex-1 flex items-center justify-center gap-2 py-3 rounded-xl
              text-sm font-semibold transition-all duration-300
              active:scale-95
              ${reaction === "going"
                ? 'text-white shadow-lg'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-750 border border-zinc-700 hover:border-zinc-600'
              }
              ${spotsLeft === 0 && reaction !== "going" 
                ? 'opacity-50 cursor-not-allowed' 
                : ''
              }
            `}
            style={reaction === "going" ? { 
              backgroundColor: colors.primary,
              boxShadow: `0 4px 15px ${colors.primary}40`
            } : {}}
          >
            <CalendarCheck className={`w-4 h-4 ${reaction === "going" ? 'animate-bounce' : ''}`} />
            <span>{spotsLeft === 0 && reaction !== "going" ? 'Full' : 'Going'}</span>
            {counts.going > 0 && (
              <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                reaction === "going" ? 'bg-white/20' : 'bg-zinc-700'
              }`}>
                {counts.going}
              </span>
            )}
          </button>
        </div>

        {/* View Details */}
        <Link
          to={`/events/${event._id}`}
          onClick={(e) => e.stopPropagation()}
          className="mt-3 w-full flex items-center justify-between px-4 py-3 rounded-xl
            bg-zinc-800/50 border border-zinc-800 group-hover:border-zinc-700
            text-sm font-medium text-zinc-400 group-hover:text-white
            transition-all duration-300"
        >
          <span>View event details</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Full Image Modal */}
      {showFullImage && event.coverImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4
            animate-fade-in cursor-pointer"
          onClick={() => setShowFullImage(false)}
        >
          <img 
            src={event.coverImage} 
            alt={event.title}
            className="max-w-full max-h-[90vh] object-contain rounded-2xl animate-scale-in"
          />
          <button 
            onClick={() => setShowFullImage(false)}
            className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 
              transition-colors text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Custom Animations */}
      <style>{`
        @keyframes cardIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes ripple {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(4); opacity: 0; }
        }
        @keyframes slideDown {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes scaleIn {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-card-in { animation: cardIn 0.6s ease-out; }
        .animate-ripple { animation: ripple 0.6s ease-out; }
        .animate-slide-down { animation: slideDown 0.2s ease-out; }
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        .animate-scale-in { animation: scaleIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}

// Rich Demo Data
export const DEMO_EVENTS = [
  {
    _id: "evt_1",
    title: "Beach Cleanup & Sunset Party",
    eventType: "cleanup",
    status: "upcoming",
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    location: { address: "Laboni Point, Cox's Bazar" },
    coverImage: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800&q=80",
    maxVolunteers: 50,
    volunteerCount: 34,
    registrationFee: 0,
    fundGoal: 10000,
    fundRaised: 7500,
    interestedCount: 128,
    goingCount: 45,
    likesCount: 256,
    userReaction: null,
    isSaved: false,
    pinnedAnnouncement: "Meet at Laboni Point at 6 AM. Gloves & bags provided. Stay for the sunset celebration! 🎉",
    organizer: { name: "Green Bangladesh", avatar: "https://i.pravatar.cc/150?img=1" },
    recentAttendees: [
      { avatar: "https://i.pravatar.cc/150?img=11" },
      { avatar: "https://i.pravatar.cc/150?img=12" },
      { avatar: "https://i.pravatar.cc/150?img=13" },
      { avatar: "https://i.pravatar.cc/150?img=14" },
    ],
    attendeeCount: 34,
  },
  {
    _id: "evt_2",
    title: "Urban Forest Festival 2024",
    eventType: "plantation",
    status: "upcoming",
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    location: { address: "Ramna Park, Shahbagh, Dhaka" },
    coverImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80",
    maxVolunteers: 30,
    volunteerCount: 27,
    registrationFee: 100,
    fundGoal: 50000,
    fundRaised: 42000,
    interestedCount: 245,
    goingCount: 89,
    likesCount: 432,
    userReaction: "interested",
    isSaved: true,
    pinnedAnnouncement: null,
    organizer: { name: "Eco Warriors BD", avatar: "https://i.pravatar.cc/150?img=2" },
    recentAttendees: [
      { avatar: "https://i.pravatar.cc/150?img=15" },
      { avatar: "https://i.pravatar.cc/150?img=16" },
    ],
    attendeeCount: 27,
  },
  {
    _id: "evt_3",
    title: "Community Street Repair Day",
    eventType: "repair",
    status: "ongoing",
    date: new Date().toISOString(),
    location: { address: "Mirpur-10, Dhaka" },
    coverImage: "https://images.unsplash.com/photo-1590650151155-3b62c5a0c8c1?w=800&q=80",
    maxVolunteers: 20,
    volunteerCount: 18,
    registrationFee: 0,
    fundGoal: 0,
    fundRaised: 0,
    interestedCount: 67,
    goingCount: 28,
    likesCount: 124,
    userReaction: "going",
    isSaved: false,
    pinnedAnnouncement: "Tools and materials provided. Join anytime during the day!",
    organizer: { name: "Community Fix BD", avatar: "https://i.pravatar.cc/150?img=3" },
    recentAttendees: [
      { avatar: "https://i.pravatar.cc/150?img=17" },
      { avatar: "https://i.pravatar.cc/150?img=18" },
      { avatar: "https://i.pravatar.cc/150?img=19" },
    ],
    attendeeCount: 18,
  },
  {
    _id: "evt_4",
    title: "Climate Action Rally 2024",
    eventType: "awareness",
    status: "upcoming",
    date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    location: { address: "Shahbagh Square, Dhaka" },
    coverImage: "https://images.unsplash.com/photo-1570095378004-ce65d6c2d5bb?w=800&q=80",
    maxVolunteers: 100,
    volunteerCount: 98,
    registrationFee: 0,
    fundGoal: 20000,
    fundRaised: 18500,
    interestedCount: 567,
    goingCount: 234,
    likesCount: 891,
    userReaction: null,
    isSaved: false,
    pinnedAnnouncement: "Wear green! Bring your own placards. We provide paint & materials.",
    organizer: { name: "Youth for Climate", avatar: "https://i.pravatar.cc/150?img=4" },
    recentAttendees: [
      { avatar: "https://i.pravatar.cc/150?img=20" },
      { avatar: "https://i.pravatar.cc/150?img=21" },
      { avatar: "https://i.pravatar.cc/150?img=22" },
      { avatar: "https://i.pravatar.cc/150?img=23" },
    ],
    attendeeCount: 98,
  },
  {
    _id: "evt_5",
    title: "Tech for Good Hackathon",
    eventType: "meetup",
    status: "upcoming",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    location: { address: "Gulshan Tech Hub, Dhaka" },
    coverImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    maxVolunteers: 15,
    volunteerCount: 12,
    registrationFee: 200,
    fundGoal: 0,
    fundRaised: 0,
    interestedCount: 89,
    goingCount: 34,
    likesCount: 178,
    userReaction: "going",
    isSaved: true,
    pinnedAnnouncement: null,
    organizer: { name: "Dev Community BD", avatar: "https://i.pravatar.cc/150?img=5" },
    recentAttendees: [
      { avatar: "https://i.pravatar.cc/150?img=24" },
    ],
    attendeeCount: 12,
  },
  {
    _id: "evt_6",
    title: "Campus Green Day Celebration",
    eventType: "student",
    status: "upcoming",
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    location: { address: "Dhaka University Campus" },
    coverImage: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80",
    maxVolunteers: 200,
    volunteerCount: 156,
    registrationFee: 50,
    fundGoal: 30000,
    fundRaised: 22000,
    interestedCount: 456,
    goingCount: 178,
    likesCount: 645,
    userReaction: "interested",
    isSaved: false,
    pinnedAnnouncement: "Join us for a day of green activities, music, and food! Registration includes t-shirt.",
    organizer: { name: "DU Green Club", avatar: "https://i.pravatar.cc/150?img=6" },
    recentAttendees: [
      { avatar: "https://i.pravatar.cc/150?img=25" },
      { avatar: "https://i.pravatar.cc/150?img=26" },
      { avatar: "https://i.pravatar.cc/150?img=27" },
    ],
    attendeeCount: 156,
  }
];

// Event Card Grid Component
export default function EventCardDemo() {
  const [viewMode, setViewMode] = useState('grid');
  
  return (
    <div className="min-h-screen bg-zinc-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
              Discover Events
            </h1>
            <p className="text-zinc-500 text-sm">
              Find and join amazing community events near you
            </p>
          </div>
          <div className="flex items-center gap-2 bg-zinc-900 rounded-xl p-1 border border-zinc-800">
            <button 
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'grid' ? 'bg-zinc-800 text-white' : 'text-zinc-400'
              }`}
            >
              Grid
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'list' ? 'bg-zinc-800 text-white' : 'text-zinc-400'
              }`}
            >
              List
            </button>
          </div>
        </div>

        {/* Events Grid */}
        <div className={`grid gap-4 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {DEMO_EVENTS.map((event) => (
            <EventCard 
              key={event._id} 
              event={event} 
              currentUserId="user_1"
              isListView={viewMode === 'list'}
            />
          ))}
        </div>
      </div>
    </div>
  );
}