import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { QRCodeCanvas } from "qrcode.react";
import { BookCheck, Calendar, ChevronLeft, Mail, MapPinned, Medal, Ticket,   
  Trash2, Trees,  Wrench, Megaphone, GraduationCap, Handshake,  Ban, XCircle,
  CheckCircle,
  Loader2,
  AlertCircle} from "lucide-react";

/* ─── Constants ─── */
const TYPE_ICON = {
  cleanup: Trash2,
  plantation: Trees,
  repair: Wrench,
  awareness: Megaphone,
  student: GraduationCap,
  meetup: Handshake,
};

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
export default function FreeParticipateRegistration() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const qrRef       = useRef(null);

  const [event, setEvent]         = useState(null);
  const [eventLoading, setEventLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [result, setResult]         = useState(null);
  const [errors, setErrors]         = useState({});
  

  const [form, setForm] = useState({
    name:  "",
    email: "",
    phone: "",
  });

  /* ── Fetch event ── */
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_MANUAL}/events/${id}`)
      .then((r) => setEvent(r.data?.event))
      .catch(() => toast.error("Could not load event details"))
      .finally(() => setEventLoading(false));
  }, [id]);

  /* helpers */
  const setF = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: "" }));
  };

  /* ── Validation ── */
  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name  = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email";
    if (!form.phone.trim()) e.phone = "Phone is required";
    else if (!/^01[3-9]\d{8}$/.test(form.phone.replace(/\s/g, "")))
      e.phone = "Enter a valid BD number (01XXXXXXXXX)";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_MANUAL}/events/${id}/free-participate`,
        form,
      );
      setResult(res.data.participant);
      setSubmitted(true);
      toast.success(res.data.message || "Registered successfully!");
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed. Please try again.";
      toast.error(msg);
      if (msg.toLowerCase().includes("already registered") || msg.toLowerCase().includes("phone number is already"))
        setErrors({ phone: "This phone number is already registered for this event" });
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Download QR as image ── */
  const handleDownloadQR = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;

    const padding    = 24;
    const qrSize     = canvas.width;
    const totalW     = qrSize + padding * 2;
    const labelH     = 52;
    const totalH     = qrSize + padding * 2 + labelH;

    const offscreen  = document.createElement("canvas");
    offscreen.width  = totalW;
    offscreen.height = totalH;
    const ctx        = offscreen.getContext("2d");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, totalW, totalH);

    ctx.drawImage(canvas, padding, padding);

    ctx.fillStyle = "#111827";
    ctx.font      = "bold 13px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(event?.title || "Event QR", totalW / 2, qrSize + padding * 2 + 16);

    ctx.fillStyle = "#6b7280";
    ctx.font      = "11px sans-serif";
    ctx.fillText("Show at entry for check-in", totalW / 2, qrSize + padding * 2 + 34);

    const link    = document.createElement("a");
    link.download = `qr-${id}.png`;
    link.href     = offscreen.toDataURL("image/png");
    link.click();
  };

  /* ── Derived ── */
  const spotsLeft = event
    ? event.maxFreeParticipate > 0
      ? Math.max(0, event.maxFreeParticipate - (event.freeParticipateCount || 0))
      : null
    : null;
  const isFull    = spotsLeft !== null && spotsLeft <= 0;
  const isPastDate = event ? new Date(event.date) < new Date() : false;
  const EventIcon = TYPE_ICON[event?.eventType] || Handshake;

  /* ════════════════════════════════════════
     LOADING
  ════════════════════════════════════════ */
  if (eventLoading)
    return (
      <PageShell>
        <div className="flex flex-col items-center justify-center py-32 text-center">

          {/* LOADING SPINNER */}
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />

          <p className="text-gray-400 text-base">Loading event...</p>
        </div>
      </PageShell>
    );

  /* ════════════════════════════════════════
    NOT FOUND
  ════════════════════════════════════════ */

  if (!event)
    return (
      <PageShell>
        <div className="flex flex-col items-center justify-center py-32 text-center">

          {/* ICON */}
          <AlertCircle className="w-14 h-14 text-yellow-500 mb-4" />

          {/* TITLE */}
          <h2
            className="text-xl font-semibold text-white mb-2"
            style={{ fontFamily: "Fraunces, serif" }}
          >
            Event not found
          </h2>

          {/* LINK */}
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-base mt-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to events
          </Link>

        </div>
      </PageShell>
    );

  /* ════════════════════════════════════════
     FREE PARTICIPATE NOT ENABLED / CLOSED
  ════════════════════════════════════════ */
  if (
    !event.isFreeParticipate ||
    isPastDate ||
    ["cancelled", "completed"].includes(event.status)
  )
    return (
      <PageShell>
        <div className="max-w-md mx-auto text-center py-20">

          {/* ICON */}
          <div className="flex justify-center mb-4">
            {!event.isFreeParticipate ? (
              <Ban className="w-14 h-14 text-red-500" />
            ) : event.status === "cancelled" ? (
              <XCircle className="w-14 h-14 text-red-500" />
            ) : (
              <CheckCircle className="w-14 h-14 text-green-500" />
            )}
          </div>

          {/* TITLE */}
          <h2
            className="text-xl font-semibold text-white mb-2"
            style={{ fontFamily: "Fraunces, serif" }}
          >
            {!event.isFreeParticipate
              ? "Free Participation Not Available"
              : event.status === "cancelled"
              ? "Event Cancelled"
              : "Event Completed"}
          </h2>

          {/* DESCRIPTION */}
          <p className="text-white text-base mb-6">
            {!event.isFreeParticipate
              ? "This event does not offer free participation."
              : "This event is no longer accepting registrations."}
          </p>

          {/* BACK BUTTON */}
          <Link
            to={`/events/${id}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500 text-white rounded-lg text-base font-semibold hover:bg-blue-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Event
          </Link>

        </div>
      </PageShell>
    );

  /* ════════════════════════════════════════
     SUCCESS STATE
  ════════════════════════════════════════ */
  if (submitted && result) return (
    <PageShell>
      <div className="max-w-5xl mx-auto w-full">

        {/* Back */}
        <Link
          to={`/events/${id}`}
          className="flex items-center gap-1.5 text-base text-white hover:text-gray-400 mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Event
        </Link>

        {/* MAIN CARD */}
        <div className="rounded-3xl border border-zinc-800 overflow-hidden flex flex-col items-center md:flex-row">

          {/* LEFT SIDE (QR) */}
          <div className="w-full md:w-105 border-b md:border-b-0 md:border-r border-zinc-800">

            {/* Banner */}
            <div className="py-10 px-8 text-center">
              <div className="text-6xl mb-3 animate-bounce flex justify-center">
                <Ticket className="w-8 h-8" />
              </div>

              <h2
                className="text-2xl font-bold text-white mb-2"
                style={{ fontFamily: "Fraunces, serif" }}
              >
                You're In!
              </h2>

              <p className="text-white text-base max-w-sm mx-auto">
                Free participation confirmed. Show QR at entrance.
              </p>
            </div>

            {/* QR SECTION */}
            <div className="p-7 space-y-5">

              {result.qrToken && (
                <div className="rounded-2xl p-5 border border-zinc-800 text-center">

                  <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
                    Your QR Code
                  </p>

                  <div
                    ref={qrRef}
                    className="inline-block p-3 bg-white rounded-2xl"
                  >
                    <QRCodeCanvas
                      value={result.qrToken}
                      size={160}
                      bgColor="#ffffff"
                      fgColor="#111827"
                    />
                  </div>

                  <code className="block text-[11px] font-mono text-white break-all mt-4">
                    {result.qrToken}
                  </code>

                  <button
                    onClick={handleDownloadQR}
                    className="mt-4 w-full px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition"
                  >
                    Download QR
                  </button>
                </div>
              )}

              {/* STATUS */}
              <div className="border border-zinc-800 rounded-2xl p-4 flex items-center gap-3">
                <BookCheck className="text-white" />
                <div>
                  <p className="text-white font-medium">
                    Free Participation Confirmed
                  </p>
                  <p className="text-sm text-white">
                    No payment required
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE (DETAILS) */}
          <div className="flex-1 p-6 space-y-8">

            {/* Event Details */}
            <div className="rounded-2xl p-4 border border-zinc-800 space-y-3">
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Event Details
              </p>

              <DetailRow
                icon={TYPE_ICON[event.eventType] || Handshake}
                text={event.title}
                bold
              />

              <DetailRow
                icon={Calendar}
                text={format(new Date(event.date), "EEEE, dd MMM yyyy • h:mm a")}
              />

              <DetailRow
                icon={MapPinned}
                text={event.location?.address}
              />
            </div>

            {/* What's Next */}
            <div>
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                What's Next
              </p>

              <div className="space-y-3">
                {[
                  "Check email for QR code.",
                  "Save/download before event.",
                  "Show QR at entrance.",
                  "Get certificate after attendance.",
                ].map((text, i) => (
                  <div key={i} className="flex gap-3 text-base text-white">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-sm flex items-center justify-center shrink-0 font-semibold mt-0.5">
                      {i + 1}
                    </span>
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3 pt-2">
              <Link
                to={`/events/${event._id}`}
                className="flex-1 text-center py-2.5 rounded-xl border border-zinc-800 text-white  transition"
              >
                View Event
              </Link>

              <Link
                to="/events"
                className="flex-1 text-center py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold"
              >
                Browse Events
              </Link>
            </div>

          </div>
        </div>
      </div>
    </PageShell>
  );

  /* ════════════════════════════════════════
     REGISTRATION FORM
  ════════════════════════════════════════ */
  return (
    <PageShell>
      <div className="max-w-xl mx-auto">

        {/* Back */}
        <button
          onClick={() => navigate(`/events/${id}`)}
          className="flex items-center gap-1.5 text-base text-white hover:cursor-pointer mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4"/>
          Back to Event
        </button>

        {/* Event summary */}
        <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-5 mb-5 flex items-start gap-4">
          <div className="shrink-0">
            <EventIcon className="w-10 h-10 text-blue-500" />
          </div>
          <div className="min-w-0 flex-1">
            <h2
              className="font-semibold text-white text-base leading-snug mb-1"
              style={{ fontFamily: "Fraunces,serif" }}
            >
              {event.title}
            </h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-base text-white mb-2.5">
              <span className="flex items-center gap-2"><Calendar /> {format(new Date(event.date), "dd MMM yyyy, h:mm a")}</span>
              <span className="flex items-center gap-2"><MapPinned /> {event.location?.address}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="flex items-center gap-1 text-sm bg-blue-50 text-blue-700 ring-1 ring-red-200 px-2.5 py-1 rounded-full font-bold">
                <Ticket fill="white" color="blue"/> Free Entry
              </span>
              {spotsLeft !== null && (
                <span className="text-sm bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                  <BookCheck fill="green" color="black"/> {spotsLeft} spots left
                </span>
              )}
              {spotsLeft === null && (
                <span className="text-sm bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                  <BookCheck fill="green" color="black"/> Open entry
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Form card */}
        <div className="bg-zinc-950 rounded-3xl border border-zinc-800 shadow-sm overflow-hidden">

          {/* Header */}
          <div className="px-7 pt-7 pb-5 border-b border-zinc-700">
            <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "Fraunces,serif" }}>
              Free Participation
            </h1>
            <p className="text-white text-base">
              No fee, no account needed — just fill in your details and you're in.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-7 space-y-5">

            {/* Name */}
            <Field label="Full Name" required error={errors.name}>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setF("name", e.target.value)}
                placeholder="Your full name"
                className={`${inp(errors.name)} placeholder:text-zinc-500`}
              />
            </Field>

            {/* Email */}
            <Field label="Email Address" required error={errors.email}>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setF("email", e.target.value)}
                placeholder="you@example.com"
                className={`${inp(errors.email)} placeholder:text-zinc-500`}
              />
              <p className="text-sm text-gray-400 mt-1">QR code will be sent to this email</p>
            </Field>

            {/* Phone */}
            <Field label="Phone Number" required error={errors.phone}>
              <div className="flex">
                <span className="inline-flex items-center px-3.5 py-2.5 border border-r-0 border-zinc-800
                                 bg-gray-50 rounded-l-xl text-base text-black select-none whitespace-nowrap">
                  🇧🇩 +880
                </span>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setF("phone", e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className={`${inp(errors.phone)} rounded-l-none border-l-0 placeholder:text-zinc-500`}
                />
              </div>
            </Field>

            {/* Info notices */}
            <div className="space-y-3">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-base text-blue-800 flex gap-3">
                <span className="text-xl shrink-0"><Ticket color="blue" fill="white" /></span>
                <div>
                  <p className="font-semibold mb-0.5">No Login Required</p>
                  <p className="text-sm text-blue-700 leading-relaxed">
                    Free participation is open to everyone — no account needed.
                    A QR code will be emailed to you for check-in on the day.
                  </p>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 text-base text-purple-800 flex gap-3">
                <span className="text-xl shrink-0"><Medal /></span>
                <div>
                  <p className="font-medium mb-0.5">Digital Certificate after attendance</p>
                  <p className="text-sm text-purple-700 leading-relaxed">
                    Attendees get a verifiable digital certificate sent to their email after the event.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-semibold
                         text-base transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2.5 mt-2"
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4" /> Submitting...</>
              ) : (
                <><Ticket /> Register for Free</>
              )}
            </button>

            <p className="text-sm text-center text-gray-400">
              By registering, you agree to follow event guidelines and code of conduct.
            </p>
          </form>
        </div>

        {/* Already a volunteer? */}
        <p className="text-center text-base text-gray-400 mt-5">
          Want to actively help?{" "}
          <Link to={`/events/${id}/register`} className="text-emerald-600 hover:underline font-medium">
            Register as Volunteer 
          </Link>
        </p>
      </div>
    </PageShell>
  );
}

/* ═══════════════════════════════════════════
   SMALL HELPERS
═══════════════════════════════════════════ */
function PageShell({ children }) {
  return (
    <div className="min-h-screen bg-zinc-950 py-10 px-4" style={{ fontFamily: "'DM Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Fraunces:wght@600;700&display=swap');`}</style>
      <div className="max-full mx-auto">{children}</div>
    </div>
  );
}

function Field({ label, required, error, children }) {
  return (
    <div>
      <label className="block text-base font-medium text-white mb-1.5">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

function DetailRow({ icon: Icon, text, bold }) {
  return (
    <div className="flex items-start gap-2.5 text-base text-white">
      <span className="shrink-0 flex items-center">
        <Icon className="w-5 h-5" />
      </span>

      <span className={bold ? "font-semibold" : ""}>
        {text}
      </span>
    </div>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}

function inp(error) {
  return [
    "w-full px-4 py-2.5 rounded-xl border text-base text-black transition-all outline-none",
    error
      ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100"
      : "border-zinc-800 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100",
  ].join(" ");
}