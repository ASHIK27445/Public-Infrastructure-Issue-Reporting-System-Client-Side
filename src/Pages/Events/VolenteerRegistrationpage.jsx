import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import { format } from "date-fns";
import QRCode from "qrcode";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  CreditCard,
  Package,
  Award,
  CheckCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  ChevronRight,
  User,
  Mail,
  Phone,
  Building,
  Shield,
  Check,
  X,
  QrCode,
  Sparkles,
} from "lucide-react";

/* ─── Constants ─── */
const AGE_GROUPS = [
  { value: "under-18", label: "Under 18 (Student)" },
  { value: "18-25", label: "18 – 25" },
  { value: "26-35", label: "26 – 35" },
  { value: "36+", label: "36 and above" },
];

const SKILL_OPTIONS = [
  { value: "first-aid", label: "First Aid", icon: "Shield" },
  { value: "photography", label: "Photography", icon: "Camera" },
  { value: "driving", label: "Driving", icon: "Car" },
  { value: "cooking", label: "Cooking", icon: "Chef" },
  { value: "social-media", label: "Social Media", icon: "Share" },
  { value: "teaching", label: "Teaching", icon: "Book" },
  { value: "construction", label: "Construction", icon: "Hammer" },
  { value: "medical", label: "Medical", icon: "Heart" },
  { value: "legal", label: "Legal", icon: "Scale" },
  { value: "translation", label: "Translation", icon: "Globe" },
];

const TYPE_LABEL = {
  cleanup: "Cleanup Drive",
  plantation: "Plantation",
  repair: "Repair Work",
  awareness: "Awareness Campaign",
  student: "Student Program",
  meetup: "Community Meetup",
};

const DEMO_EVENT = {
  _id: "demo-event-123",
  title: "Community Cleanup Drive 2026",
  date: new Date("2026-07-15T09:00:00").toISOString(),
  eventType: "cleanup",
  location: { address: "Dhaka University Campus, Shahbagh, Dhaka" },
  maxVolunteers: 50,
  volunteerCount: 35,
  registrationFee: 0,
  equipmentList: ["Gloves", "Trash bags", "Water bottle", "Cap"],
  description:
    "Join us for a community cleanup drive to make Dhaka cleaner and greener!",
  organizer: {
    name: "Green Bangladesh Foundation",
    email: "info@greenbangladesh.org",
  },
};

/* ─── Main Component ─── */
export default function VolunteerRegistrationPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [eventLoading, setEventLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});
  const [qrCodeUrl, setQrCodeUrl] = useState(null);

  const savedName = localStorage.getItem("userName") || "";
  const savedEmail = localStorage.getItem("userEmail") || "";

  const [form, setForm] = useState({
    name: savedName || "Demo User",
    email: savedEmail || "demo@example.com",
    phone: "01712345678",
    institution: "University of Dhaka",
    ageGroup: "18-25",
    skills: ["first-aid", "photography"],
    role: "volunteer",
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_MANUAL}/events/${id}`
        );
        setEvent(res.data?.event);
      } catch {
        // setEvent(DEMO_EVENT);
        toast.info("Showing demo event - API not connected");
      } finally {
        setEventLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const generateQRCode = async (token) => {
    try {
      const url = await QRCode.toDataURL(token, {
        width: 200,
        margin: 2,
        color: { dark: "#10b981", light: "#09090b" },
      });
      setQrCodeUrl(url);
    } catch (err) {
      console.error("QR generation failed:", err);
    }
  };

  const setF = (key, val) => {
    setForm((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key]: "" }));
  };

  const toggleSkill = (val) => {
    setF(
      "skills",
      form.skills.includes(val)
        ? form.skills.filter((s) => s !== val)
        : [...form.skills, val]
    );
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    else if (!/^01[3-9]\d{8}$/.test(form.phone.replace(/\s/g, "")))
      e.phone = "Enter a valid BD phone number";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      let res;
      try {
        res = await axios.post(
          `${import.meta.env.VITE_API_URL}/events/${id}/volunteer`,
          form,
          { headers }
        );
      } catch {
        await new Promise((r) => setTimeout(r, 1500));
        const isWaitlisted = Math.random() > 0.7;
        res = {
          data: {
            registration: {
              qrToken: isWaitlisted
                ? null
                : `EVT-${Date.now().toString(36).toUpperCase()}-${Math.random()
                    .toString(36)
                    .substring(2, 8)
                    .toUpperCase()}`,
              waitlisted: isWaitlisted,
              waitlistPosition: isWaitlisted
                ? Math.floor(Math.random() * 10) + 1
                : null,
            },
            message: isWaitlisted
              ? "Added to waitlist"
              : "Registration successful!",
          },
        };
      }
      const registration = res.data?.registration;
      setResult(registration);
      if (registration?.qrToken) await generateQRCode(registration.qrToken);
      setSubmitted(true);
      toast.success(res.data?.message || "Registered successfully!");
      const registrations = JSON.parse(
        localStorage.getItem("registrations") || "[]"
      );
      registrations.push({
        eventId: id,
        ...form,
        ...registration,
        registeredAt: new Date().toISOString(),
      });
      localStorage.setItem("registrations", JSON.stringify(registrations));
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      toast.error(msg);
      if (msg.toLowerCase().includes("already registered"))
        setErrors({ email: "This email is already registered for this event" });
    } finally {
      setSubmitting(false);
    }
  };

  const spotsLeft = event
    ? (event.maxVolunteers || 0) - (event.volunteerCount || 0)
    : null;
  const isFull = spotsLeft !== null && spotsLeft <= 0;
  const isFree = !event?.registrationFee || event.registrationFee === 0;

  /* ─── Loading ─── */
  if (eventLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 border-2 border-zinc-700 border-t-emerald-500 rounded-full animate-spin mx-auto" />
          <p className="text-zinc-400 text-sm tracking-wide">
            Loading event details...
          </p>
        </div>
      </div>
    );
  }

  /* ─── Not Found ─── */
  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-7 h-7 text-amber-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Event not found</h2>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to events
          </Link>
        </div>
      </div>
    );
  }

  /* ─── SUCCESS STATE ─── */
  if (submitted && result) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900 py-10 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Demo badge */}
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-2 bg-zinc-800/80 border border-zinc-700 text-zinc-400 text-xs font-medium px-4 py-1.5 rounded-full">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Demo Mode — No real registration
            </span>
          </div>

          <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 overflow-hidden shadow-2xl">
            {/* Banner */}
            <div
              className={`px-8 py-10 ${
                result.waitlisted
                  ? "bg-gradient-to-r from-amber-500/20 to-orange-500/10 border-b border-amber-500/20"
                  : "bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border-b border-emerald-500/20"
              }`}
            >
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 ${
                  result.waitlisted
                    ? "bg-amber-500/20 border border-amber-500/30"
                    : "bg-emerald-500/20 border border-emerald-500/30"
                }`}
              >
                {result.waitlisted ? (
                  <Clock className="w-8 h-8 text-amber-400" />
                ) : (
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                )}
              </div>
              <h2 className="text-2xl font-black text-white text-center mb-2">
                {result.waitlisted
                  ? "You're on the Waitlist"
                  : "Registration Confirmed"}
              </h2>
              <p
                className={`text-center text-sm ${
                  result.waitlisted ? "text-amber-300/80" : "text-emerald-300/80"
                }`}
              >
                {result.waitlisted
                  ? `You are #${result.waitlistPosition} in line. We will notify you when a spot opens.`
                  : "Your spot is secured. Here is everything you need to know."}
              </p>
            </div>

            <div className="p-8 space-y-5">
              {/* QR Code */}
              {!result.waitlisted && qrCodeUrl && (
                <div className="bg-zinc-800/60 border border-zinc-700 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <QrCode className="w-4 h-4 text-emerald-400" />
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
                      Attendance QR Code
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-4">
                    <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-700">
                      <img
                        src={qrCodeUrl}
                        alt="QR Code"
                        className="w-44 h-44"
                      />
                    </div>
                    <p className="text-xs text-zinc-500 font-mono bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 break-all text-center">
                      {result.qrToken}
                    </p>
                    <div className="flex items-start gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-3 w-full">
                      <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-emerald-300/80">
                        Save this QR code or take a screenshot. You will need
                        it for check-in at the event.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Event Summary */}
              <div className="bg-zinc-800/60 border border-zinc-700 rounded-2xl p-6 space-y-3">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">
                  Event Details
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="font-bold text-white text-sm">
                    {event.title}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-zinc-400 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-zinc-700/60 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  {format(new Date(event.date), "EEEE, MMMM d, yyyy")} at{" "}
                  {format(new Date(event.date), "h:mm a")}
                </div>
                <div className="flex items-center gap-3 text-zinc-400 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-zinc-700/60 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  {event.location?.address}
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-zinc-800/60 border border-zinc-700 rounded-2xl p-6">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">
                  What's Next
                </p>
                <div className="space-y-3">
                  {[
                    result.waitlisted
                      ? "Keep an eye on your email for waitlist updates."
                      : "Save your QR code — you will need it for check-in.",
                    "Arrive 15 minutes early for registration.",
                    event.equipmentList?.length > 0
                      ? `Bring: ${event.equipmentList.join(", ")}`
                      : null,
                    "You will receive a digital certificate via email after the event.",
                  ]
                    .filter(Boolean)
                    .map((text, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xs font-bold text-emerald-400 shrink-0 mt-0.5">
                          {i + 1}
                        </div>
                        <span className="text-zinc-300 text-sm">{text}</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <Link
                  to={`/events/${id}`}
                  className="text-center py-2.5 px-4 rounded-xl border border-zinc-700 text-zinc-300 text-sm font-medium hover:bg-zinc-800 transition-colors"
                >
                  View Event
                </Link>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setResult(null);
                    setQrCodeUrl(null);
                  }}
                  className="text-center py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors"
                >
                  Register Again
                </button>
                <Link
                  to="/events"
                  className="text-center py-2.5 px-4 rounded-xl border border-zinc-700 text-zinc-300 text-sm font-medium hover:bg-zinc-800 transition-colors"
                >
                  Browse Events
                </Link>
              </div>

              <div className="text-center pt-2 border-t border-zinc-800">
                <button
                  onClick={() => {
                    localStorage.removeItem("registrations");
                    toast.success("Demo registrations cleared!");
                  }}
                  className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
                >
                  Clear demo registrations
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ─── REGISTRATION FORM ─── */
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900">
      {/* Sticky header */}
      <div className="sticky top-0 z-40 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white">
              {isFull ? "Join " : "Volunteer "}
              <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                {isFull ? "Waitlist" : "Registration"}
              </span>
            </h1>
            <p className="text-zinc-400 text-sm mt-0.5">
              {isFull
                ? "All spots are taken, but you can join the waitlist"
                : "Fill out the form below to secure your spot"}
            </p>
          </div>
          <button
            onClick={() => navigate(`/events/${id}`)}
            className="p-2 bg-zinc-800 border border-zinc-700 rounded-2xl text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* Demo mode banner */}
        <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <p className="font-semibold text-amber-300 text-sm">
              Demo Mode Active
            </p>
            <p className="text-xs text-amber-400/70 mt-0.5">
              This is a demo registration form. No real data will be submitted.
            </p>
          </div>
        </div>

        {/* Event summary card */}
        <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-full font-medium border border-emerald-500/20">
                  {TYPE_LABEL[event.eventType] || "Community Event"}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mb-3">
                {event.title}
              </h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-zinc-400 text-sm">
                  <Calendar className="w-4 h-4 text-zinc-500 shrink-0" />
                  {format(new Date(event.date), "EEEE, MMMM d, yyyy")} at{" "}
                  {format(new Date(event.date), "h:mm a")}
                </div>
                <div className="flex items-center gap-2 text-zinc-400 text-sm">
                  <MapPin className="w-4 h-4 text-zinc-500 shrink-0" />
                  {event.location?.address}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {isFull ? (
                  <span className="inline-flex items-center gap-1.5 text-xs bg-red-500/10 text-red-400 px-3 py-1 rounded-full font-medium border border-red-500/20">
                    <AlertTriangle className="w-3 h-3" />
                    Full — Waitlist Available
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full font-medium border border-emerald-500/20">
                    <CheckCircle className="w-3 h-3" />
                    {spotsLeft} spots remaining
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 text-xs bg-zinc-700/60 text-zinc-300 px-3 py-1 rounded-full font-medium border border-zinc-600">
                  <Users className="w-3 h-3" />
                  {event.volunteerCount}/{event.maxVolunteers} registered
                </span>
                {!isFree && (
                  <span className="inline-flex items-center gap-1.5 text-xs bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full font-medium border border-purple-500/20">
                    <CreditCard className="w-3 h-3" />
                    {"\u09F3"}{event.registrationFee} fee
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 overflow-hidden">
          {/* Role selector */}
          <div className="p-6 border-b border-zinc-700/60">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">
              Registration Type
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  value: "volunteer",
                  label: "Volunteer",
                  desc: "Active participant",
                  icon: <Users className="w-4 h-4" />,
                },
                {
                  value: "guest",
                  label: "Guest",
                  desc: "Observer only",
                  icon: <User className="w-4 h-4" />,
                },
              ].map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setF("role", role.value)}
                  className={`flex items-center gap-3 py-3 px-4 rounded-xl border-2 text-left transition-all ${
                    form.role === role.value
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                      : "border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      form.role === role.value
                        ? "bg-emerald-500/20"
                        : "bg-zinc-700"
                    }`}
                  >
                    {role.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white">
                      {role.label}
                    </div>
                    <div className="text-xs opacity-60">{role.desc}</div>
                  </div>
                  {form.role === role.value && (
                    <Check className="w-4 h-4 ml-auto text-emerald-400" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Personal Information */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-zinc-700/60">
                <User className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">
                  Personal Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DarkField
                  label="Full Name"
                  required
                  error={errors.name}
                  icon={<User className="w-4 h-4" />}
                >
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setF("name", e.target.value)}
                    placeholder="Enter your full name"
                    className={darkInputClass(errors.name)}
                  />
                </DarkField>

                <DarkField
                  label="Email Address"
                  required
                  error={errors.email}
                  icon={<Mail className="w-4 h-4" />}
                >
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setF("email", e.target.value)}
                    placeholder="you@example.com"
                    className={darkInputClass(errors.email)}
                  />
                </DarkField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DarkField
                  label="Phone Number"
                  required
                  error={errors.phone}
                  icon={<Phone className="w-4 h-4" />}
                >
                  <div className="flex rounded-xl overflow-hidden border-2 border-zinc-700 focus-within:border-emerald-500 transition-colors">
                    <span className="inline-flex items-center px-4 bg-zinc-700/60 text-zinc-400 text-sm font-medium border-r border-zinc-600">
                      +880
                    </span>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setF("phone", e.target.value)}
                      placeholder="1XXXXXXXXX"
                      className="flex-1 bg-zinc-800/60 text-white px-4 py-3 text-sm outline-none placeholder-zinc-600"
                    />
                  </div>
                  {errors.phone && <ErrorMsg text={errors.phone} />}
                </DarkField>

                <DarkField label="Age Group" icon={<Users className="w-4 h-4" />}>
                  <select
                    value={form.ageGroup}
                    onChange={(e) => setF("ageGroup", e.target.value)}
                    className={darkInputClass()}
                  >
                    {AGE_GROUPS.map((g) => (
                      <option key={g.value} value={g.value}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                </DarkField>
              </div>

              <DarkField
                label="Institution / Organization"
                icon={<Building className="w-4 h-4" />}
              >
                <input
                  type="text"
                  value={form.institution}
                  onChange={(e) => setF("institution", e.target.value)}
                  placeholder="Your school, college, or organization"
                  className={darkInputClass()}
                />
              </DarkField>
            </section>

            {/* Skills */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-zinc-700/60">
                <Award className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">
                  Skills & Expertise
                </h3>
              </div>
              <p className="text-xs text-zinc-500">
                Select the skills you can contribute (optional)
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {SKILL_OPTIONS.map((skill) => (
                  <button
                    key={skill.value}
                    type="button"
                    onClick={() => toggleSkill(skill.value)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-all border ${
                      form.skills.includes(skill.value)
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm shadow-emerald-500/10"
                        : "bg-zinc-800/60 text-zinc-400 border-zinc-700 hover:border-zinc-600 hover:text-zinc-300"
                    }`}
                  >
                    {skill.label}
                  </button>
                ))}
              </div>
            </section>

            {/* Equipment Reminder */}
            {event.equipmentList?.length > 0 && (
              <div className="flex items-start gap-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5">
                <Package className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-300 text-sm mb-2">
                    Please Bring
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {event.equipmentList.map((item) => (
                      <span
                        key={item}
                        className="bg-blue-500/10 text-blue-300 px-3 py-1 rounded-full text-xs font-medium border border-blue-500/20"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Payment Notice */}
            {!isFree && (
              <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5">
                <CreditCard className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-300 text-sm mb-1">
                    Registration Fee: {"\u09F3"}{event.registrationFee}
                  </p>
                  <p className="text-xs text-amber-400/70">
                    Payment link will be sent to your email after registration.
                    Your spot is reserved for 24 hours pending payment.
                  </p>
                </div>
              </div>
            )}

            {/* Certificate Notice */}
            <div className="flex items-start gap-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl p-5">
              <Award className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-purple-300 text-sm mb-1">
                  Digital Certificate
                </p>
                <p className="text-xs text-purple-400/70">
                  You will receive a verifiable digital certificate after
                  attending the event.
                </p>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-emerald-900/30"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {isFull
                    ? "Join Waitlist"
                    : form.role === "volunteer"
                    ? "Register as Volunteer"
                    : "Register as Guest"}
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-xs text-center text-zinc-600">
              By registering, you agree to participate responsibly and follow
              event guidelines.
            </p>
          </form>
        </div>

        {/* Quick demo actions */}
        <div className="text-center space-y-3 pb-8">
          <p className="text-xs text-zinc-600 uppercase tracking-widest">
            Demo Quick Actions
          </p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => {
                setForm({
                  name: "Demo User",
                  email: "demo@example.com",
                  phone: "01712345678",
                  institution: "University of Dhaka",
                  ageGroup: "18-25",
                  skills: ["first-aid", "photography"],
                  role: "volunteer",
                });
                toast.success("Demo data loaded!");
              }}
              className="text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 px-4 py-2 rounded-xl hover:bg-zinc-700 transition-colors"
            >
              Load Demo Data
            </button>
            <button
              onClick={() => {
                setForm({
                  name: "",
                  email: "",
                  phone: "",
                  institution: "",
                  ageGroup: "18-25",
                  skills: [],
                  role: "volunteer",
                });
                toast.success("Form cleared!");
              }}
              className="text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 px-4 py-2 rounded-xl hover:bg-zinc-700 transition-colors"
            >
              Clear Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Helper Components ─── */
function DarkField({ label, required, error, icon, children }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-wide">
        {icon && (
          <span className="text-zinc-500">{icon}</span>
        )}
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {error && <ErrorMsg text={error} />}
    </div>
  );
}

function ErrorMsg({ text }) {
  return (
    <p className="flex items-center gap-1.5 text-red-400 text-xs mt-1">
      <X className="w-3 h-3" />
      {text}
    </p>
  );
}

function darkInputClass(error) {
  return `w-full px-4 py-3 rounded-xl border-2 bg-zinc-800/60 text-white text-sm transition-all outline-none placeholder-zinc-600 ${
    error
      ? "border-red-500/60 focus:border-red-500"
      : "border-zinc-700 focus:border-emerald-500"
  }`;
}