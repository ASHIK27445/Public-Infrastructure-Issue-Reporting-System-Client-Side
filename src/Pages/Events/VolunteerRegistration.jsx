import { useState, useEffect, use } from "react";
import { useParams, useNavigate, Link, useSearchParams } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { QRCodeCanvas } from "qrcode.react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { AuthContext } from "../AuthProvider/AuthContext";

/* ─── Constants ─── */
const AGE_GROUPS = [
  { value: "under-18", label: "Under 18 (Student)" },
  { value: "18-25",    label: "18 – 25" },
  { value: "26-35",    label: "26 – 35" },
  { value: "36+",      label: "36 and above" },
];
const SKILL_OPTIONS = [
  { value: "first-aid",    label: "🩺 First Aid" },
  { value: "photography",  label: "📸 Photography" },
  { value: "driving",      label: "🚗 Driving" },
  { value: "cooking",      label: "🍳 Cooking" },
  { value: "social-media", label: "📱 Social Media" },
  { value: "teaching",     label: "📖 Teaching" },
  { value: "construction", label: "🔨 Construction" },
  { value: "medical",      label: "💊 Medical" },
  { value: "legal",        label: "⚖️ Legal" },
  { value: "translation",  label: "🌐 Translation" },
];
const TYPE_EMOJI = {
  cleanup:"🧹", plantation:"🌳", repair:"🏗️",
  awareness:"📢", student:"🎓", meetup:"🤝",
};

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
export default function VolunteerRegistration() {
  const { id }               = useParams();
  const navigate             = useNavigate();
  const [searchParams]       = useSearchParams();

  const [event, setEvent]           = useState(null);
  const [eventLoading, setEventLoading] = useState(true);
  const [submitting, setSubmitting]  = useState(false);
  const [submitted, setSubmitted]    = useState(false);
  const [result, setResult]          = useState(null);
  const [errors, setErrors]          = useState({});
  const axiosSecure = useAxiosSecure()
  const {user} = use(AuthContext)

  // Check if user just came back from Stripe payment
  const stripeSuccess   = searchParams.get("session_id");
  const stripeCancelled = searchParams.get("cancelled");

  const savedName  = localStorage.getItem("userName")  || "";
  const savedEmail = localStorage.getItem("userEmail") || "";

  const [form, setForm] = useState({
    name:        savedName,
    email:       savedEmail,
    phone:       "",
    institution: "",
    ageGroup:    "18-25",
    skills:      [],
    tshirtSize:  "",
    role:        "volunteer",
  });

  /* ── Fetch event ── */
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_MANUAL}/events/${id}`)
      .then((r) => setEvent(r.data?.event))
      .catch(() => toast.error("Could not load event details"))
      .finally(() => setEventLoading(false));
  }, [id]);

console.log(event)

//   useEffect(() => {
//   // Demo event directly
//   setEvent({
//     _id: "evt_demo_001",
//     title: "Beach Cleanup 2026",
//     date: "2026-07-15T08:00:00.000Z",
//     location: { address: "Cox's Bazar Sea Beach" },
//     maxVolunteers: 20,
//     volunteerCount: 5,
//     registrationFee: 100,
//     eventType: "cleanup",
//     equipmentList: ["Gloves", "Trash Bags"],
//     status: "active",
//   });
//   setEventLoading(false);
// }, []);

  /* ── Handle Stripe redirect back ── */
  useEffect(() => {
    if (stripeSuccess) {
      const verify = async () => {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/events/${id}/verify-payment/${stripeSuccess}`
          );
          if (res.data.paid) {
            setResult({
              qrToken:          res.data.registration.qrToken,
              waitlisted:       false,
              waitlistPosition: null,
              paymentStatus:    "paid",
              paymentDone:      true,
            });
            setSubmitted(true);
            toast.success("Payment confirmed! You're all set. 🎉");
          }
        } catch {
          toast.error("Payment verification failed. Please contact support.");
        }
      };
      verify();
    }
    if (stripeCancelled) {
      toast.info("Payment cancelled. Your spot is reserved for 24 hours.");
    }
  }, [stripeSuccess, stripeCancelled, id]);

  /* helpers */
  const setF = (k, v) => { setForm((p) => ({ ...p, [k]: v })); setErrors((p) => ({ ...p, [k]: "" })); };
  const toggleSkill = (val) =>
    setF("skills", form.skills.includes(val) ? form.skills.filter((s) => s !== val) : [...form.skills, val]);

  /* ── Validation ── */
  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name  = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.phone.trim()) e.phone = "Phone is required";
    else if (!/^01[3-9]\d{8}$/.test(form.phone.replace(/\s/g, "")))
      e.phone = "Enter a valid BD number (01XXXXXXXXX)";
    if (event?.isTshirt && !form.tshirtSize) {
    e.tshirtSize = "Please select a T-shirt size";}
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await axiosSecure.post(
        `/events/${id}/volunteer`,
        form,
      );
      const reg = res.data?.registration;

      // If there's a payment URL → redirect to Stripe
      if (reg?.paymentUrl) {
        toast.info("Redirecting to payment...");
        window.location.href = reg.paymentUrl;
        return;
      }

      setResult(reg);
      setSubmitted(true);
      toast.success(res.data?.message || "Registered successfully!");
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed. Please try again.";
      toast.error(msg);
      if (msg.toLowerCase().includes("already registered"))
        setErrors({ email: "This email is already registered for this event" });
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Handle cancel registration ── */
  const handleCancel = async () => {
    if (!window.confirm("Cancel your registration? If you paid, you'll be refunded.")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/events/${id}/cancel-registration`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Registration cancelled. Refund (if any) will be processed in 5–7 days.");
      navigate(`/events/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not cancel registration");
    }
  };

  /* ── Derived ── */
  const spotsLeft  = event ? Math.max(0, (event.maxVolunteers || 0) - (event.volunteerCount || 0)) : null;
  const isFull     = spotsLeft !== null && spotsLeft <= 0;
  const isFree     = !event?.registrationFee || event.registrationFee === 0;
  const isPastDate = event ? new Date(event.date) < new Date() : false;

  /* ════════════════════════════════════════
     LOADING
  ════════════════════════════════════════ */
  if (eventLoading) return (
    <PageShell>
      <div className="flex flex-col items-center justify-center py-32">
        <div className="w-10 h-10 border-[3px] border-green-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-400 text-sm">Loading event...</p>
      </div>
    </PageShell>
  );

  /* ════════════════════════════════════════
     NOT FOUND
  ════════════════════════════════════════ */
  if (!event) return (
    <PageShell>
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2" style={{ fontFamily: "Fraunces,serif" }}>Event not found</h2>
        <Link to="/events" className="text-green-600 hover:underline text-sm mt-2">← Back to events</Link>
      </div>
    </PageShell>
  );

  /* ════════════════════════════════════════
     EVENT CLOSED
  ════════════════════════════════════════ */
  if (isPastDate || event.status === "cancelled" || event.status === "completed") return (
    <PageShell>
      <div className="max-w-md mx-auto text-center py-20">
        <div className="text-6xl mb-4">{event.status === "cancelled" ? "❌" : "✅"}</div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2" style={{ fontFamily: "Fraunces,serif" }}>
          {event.status === "cancelled" ? "Event Cancelled" : "Event Completed"}
        </h2>
        <p className="text-gray-500 text-sm mb-6">This event is no longer accepting registrations.</p>
        <Link to="/events"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white rounded-xl text-sm font-semibold hover:bg-green-600 transition-colors">
          Browse Other Events
        </Link>
      </div>
    </PageShell>
  );

  /* ════════════════════════════════════════
     SUCCESS STATE
  ════════════════════════════════════════ */
  if (submitted && result) return (
    <PageShell>
      <div className="max-w-lg mx-auto">
        <SuccessCard
          result={result}
          event={event}
          isFree={isFree}
          onCancel={handleCancel}
        />
      </div>
    </PageShell>
  );

  const guestSpotsLeft = event?.isGuestUnlimited
  ? null : Math.max(0, (event?.guestNumber || 0) - (event?.guestCount || 0));
  const isGuestFull = !event?.isGuestUnlimited && guestSpotsLeft <= 0;

  /* ════════════════════════════════════════
     REGISTRATION FORM
  ════════════════════════════════════════ */
  return (
    <PageShell>
      <div className="max-w-2xl mx-auto">

        {/* Back */}
        <button onClick={() => navigate(`/events/${id}`)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Event
        </button>

        {/* Event summary */}
        <EventSummaryCard event={event} spotsLeft={spotsLeft} isFull={isFull} isFree={isFree}
        guestSpotsLeft={guestSpotsLeft} isGuestFull={isGuestFull} />

        {/* Cancelled payment notice */}
        {stripeCancelled && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5 flex gap-3 text-amber-800 text-sm">
            <span className="text-xl shrink-0">⚠️</span>
            <div>
              <p className="font-medium">Payment was cancelled</p>
              <p className="text-xs mt-1 text-amber-700">
                Your spot is reserved for 24 hours. Complete payment below to confirm.
              </p>
            </div>
          </div>
        )}

        {/* Form card */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">

          {/* Header */}
          <div className="px-7 pt-7 pb-5 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900 mb-1" style={{ fontFamily: "Fraunces,serif" }}>
              {isFull ? "Join Waitlist" : "Register as Volunteer"}
            </h1>
            <p className="text-gray-500 text-sm">
              {isFull
                ? "Spots are full. Join the waitlist and we'll notify you immediately if one opens."
                : "Secure your volunteer spot for this event."}
            </p>

            {/* Role toggle */}
            <div className="flex items-center gap-2 mt-5">
              {["volunteer", "guest"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => !( r === "guest" && isGuestFull) && setF("role", r)}
                  disabled={r === "guest" && isGuestFull}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                    form.role === r
                      ? "bg-green-500 text-white border-green-500 shadow-sm"
                      : r === "guest" && isGuestFull
                      ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {r === "volunteer" ? "🙋 Volunteer" : isGuestFull ? "👤 Guest (Full)" : "👤 Guest"}
                </button>
              ))}
              <p className="text-xs text-gray-400 ml-2">
                {form.role === "volunteer" ? "Actively participate in tasks" : "Attend and observe"}
              </p>
            </div>
          </div>

          {/* Form body */}
          <form onSubmit={handleSubmit} className="p-7 space-y-5">

            {/* Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Full Name" required error={errors.name}>
                <input type="text" value={form.name}
                  onChange={(e) => setF("name", e.target.value)}
                  placeholder="Your full name" className={inp(errors.name)} />
              </Field>
              <Field label="Email Address" required error={errors.email}>
                <input type="email" value={form.email}
                  onChange={(e) => setF("email", e.target.value)}
                  placeholder="you@example.com" className={inp(errors.email)} />
              </Field>
            </div>

            {/* Phone */}
            <Field label="Phone Number" required error={errors.phone}>
              <div className="flex">
                <span className="inline-flex items-center px-3.5 py-2.5 border border-r-0 border-gray-200
                                 bg-gray-50 rounded-l-xl text-sm text-gray-500 select-none whitespace-nowrap">
                  🇧🇩 +880
                </span>
                <input type="tel" value={form.phone}
                  onChange={(e) => setF("phone", e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className={`${inp(errors.phone)} rounded-l-none border-l-0`} />
              </div>
            </Field>

            {/* Institution + Age */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Institution / Organization">
                <input type="text" value={form.institution}
                  onChange={(e) => setF("institution", e.target.value)}
                  placeholder="School, college, or org"
                  className={inp()} />
                <p className="text-xs text-gray-400 mt-1">Certificate sent to your institution too</p>
              </Field>
              <Field label="Age Group">
                <select value={form.ageGroup} onChange={(e) => setF("ageGroup", e.target.value)} className={inp()}>
                  {AGE_GROUPS.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
                </select>
              </Field>
            </div>

            {/* Skills */}
            <Field label="Your Skills (optional)">
              <p className="text-xs text-gray-400 mb-2.5">Helps organizers assign you suitable tasks</p>
              <div className="flex flex-wrap gap-2">
                {SKILL_OPTIONS.map((skill) => (
                  <button key={skill.value} type="button" onClick={() => toggleSkill(skill.value)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      form.skills.includes(skill.value)
                        ? "bg-green-500 text-white border-green-500"
                        : "bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:bg-green-50"
                    }`}>
                    {skill.label}
                  </button>
                ))}
              </div>
            </Field>

            {/* Equipment reminder */}
            {event.equipmentList?.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <p className="text-sm font-medium text-blue-800 mb-2">📦 Please bring on event day:</p>
                <div className="flex flex-wrap gap-2">
                  {event.equipmentList.map((item) => (
                    <span key={item} className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">{item}</span>
                  ))}
                </div>
              </div>
            )}

            {/* T-Shirt Size */}
            {event?.isTshirt && (
              <Field label="T-Shirt Size" required error={errors.tshirtSize}>
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Size</th>
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Chest</th>
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Height</th>
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Select</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { size: "S",   chest: `36"`, height: `5'4"` },
                        { size: "M",   chest: `38"`, height: `5'6"` },
                        { size: "L",   chest: `40"`, height: `5'8"` },
                        { size: "XL",  chest: `42"`, height: `5'10"` },
                        { size: "XXL", chest: `44"`, height: `6'0"` },
                      ].map((row, i) => (
                        <tr
                          key={row.size}
                          onClick={() => setF("tshirtSize", row.size)}
                          className={`cursor-pointer transition-colors border-b border-gray-100 last:border-0 ${
                            form.tshirtSize === row.size
                              ? "bg-green-50"
                              : i % 2 === 0 ? "bg-white hover:bg-gray-50" : "bg-gray-50/50 hover:bg-gray-100"
                          }`}
                        >
                          <td className="px-4 py-3 font-semibold text-gray-800">{row.size}</td>
                          <td className="px-4 py-3 text-gray-600">{row.chest}</td>
                          <td className="px-4 py-3 text-gray-600">{row.height}</td>
                          <td className="px-4 py-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                              form.tshirtSize === row.size
                                ? "border-green-500 bg-green-500"
                                : "border-gray-300"
                            }`}>
                              {form.tshirtSize === row.size && (
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {form.tshirtSize && (
                  <p className="text-xs text-green-600 mt-2 font-medium">
                    ✅ Selected: {form.tshirtSize}
                  </p>
                )}
              </Field>
            )}

            {/* Payment notice */}
            {!isFree && !isFull && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
                <p className="font-semibold mb-1 flex items-center gap-2">
                  <span>💳</span> Registration Fee: ৳{event.registrationFee}
                </p>
                <p className="text-xs text-amber-700 leading-relaxed">
                  After submitting, you'll be redirected to a secure Stripe payment page.
                  Your spot is confirmed only after payment. Fee is fully refunded if event is cancelled.
                </p>
              </div>
            )}

            {/* Waitlist notice */}
            {isFull && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
                <p className="font-semibold mb-1">⏳ Joining Waitlist</p>
                <p className="text-xs text-amber-700 leading-relaxed">
                  All {event.maxVolunteers} spots are taken. You'll be added to the waitlist and
                  notified immediately if someone cancels. No payment is taken until you get a spot.
                </p>
              </div>
            )}

            {/* Certificate notice */}
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 text-sm text-purple-800 flex gap-3">
              <span className="text-xl shrink-0">🏅</span>
              <div>
                <p className="font-medium mb-0.5">Digital Certificate after attendance</p>
                <p className="text-xs text-purple-700 leading-relaxed">
                  Attendees get a verifiable digital certificate sent to their email.
                  {form.institution && " Your institution will also receive a copy."}
                </p>
              </div>
            </div>

            {/* Submit button */}
            <button type="submit" disabled={submitting}
              className="w-full py-3.5 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-semibold
                         text-base transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2.5 mt-2">
              {submitting ? (
                <><Spinner /> {!isFree && !isFull ? "Preparing payment..." : "Submitting..."}</>
              ) : (
                <>
                  {isFull
                    ? "⏳ Join Waitlist"
                    : !isFree
                    ? `💳 Register & Pay ৳${event.registrationFee}`
                    : form.role === "guest"
                    ? "👤 Register as Guest"
                    : "🙋 Register as Volunteer"}
                </>
              )}
            </button>

            <p className="text-xs text-center text-gray-400">
              By registering, you agree to participate responsibly and follow event guidelines.
            </p>
          </form>
        </div>
      </div>
    </PageShell>
  );
}

/* ═══════════════════════════════════════════
   SUCCESS CARD
═══════════════════════════════════════════ */
function SuccessCard({ result, event, isFree, onCancel }) {
  const isWaitlisted    = result.waitlisted;
  const paymentPending  = result.paymentStatus === "pending" && !isFree;
  const paymentDone     = result.paymentStatus === "paid" || isFree;

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">

      {/* Banner */}
      <div className={`py-10 px-8 text-center ${isWaitlisted ? "bg-amber-50" : "bg-linear-to-br from-green-50 to-emerald-50"}`}>
        <div className="text-6xl mb-3 animate-bounce">{isWaitlisted ? "⏳" : "🎉"}</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "Fraunces,serif" }}>
          {isWaitlisted ? "You're on the Waitlist!" : "Registration Confirmed!"}
        </h2>
        <p className="text-gray-500 text-sm max-w-sm mx-auto">
          {isWaitlisted
            ? `You're #${result.waitlistPosition} on the waitlist. We'll email you the moment a spot opens.`
            : paymentPending
            ? "Spot reserved! Complete payment to confirm."
            : "Your spot is locked in. Check your email for the QR code."}
        </p>
      </div>

      <div className="p-7 space-y-5">

        {/* QR Code */}
        {!isWaitlisted && result.qrToken && (
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 text-center">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
              Your Attendance QR Code
            </p>
            <div className="inline-block p-3 bg-white rounded-2xl border border-gray-200 shadow-sm mb-3">
              <QRCodeCanvas
                value={result.qrToken}
                size={160}
                bgColor="#ffffff"
                fgColor="#111827"
                level="M"
                includeMargin={false}
              />
            </div>
            <p className="text-xs text-gray-500 mb-2">
              Show this QR at the event entrance for attendance check-in
            </p>
            <code className="block text-[11px] font-mono bg-gray-100 rounded-lg px-3 py-2 text-gray-500 break-all">
              {result.qrToken}
            </code>
            <p className="text-xs text-gray-400 mt-2">
              📧 Also sent to your email. Screenshot or print this just in case.
            </p>
          </div>
        )}

        {/* Payment pending */}
        {paymentPending && result.paymentUrl && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <p className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
              <span>💳</span> Payment Required — ৳{event.registrationFee}
            </p>
            <p className="text-xs text-amber-700 mb-4 leading-relaxed">
              Your spot is reserved for <strong>24 hours</strong>. Complete payment to confirm. 
              You'll be refunded in full if the event is cancelled.
            </p>
            <a href={result.paymentUrl}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600
                         text-white rounded-xl text-sm font-semibold transition-colors">
              Pay ৳{event.registrationFee} via Stripe →
            </a>
          </div>
        )}

        {/* Payment done */}
        {paymentDone && !isWaitlisted && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-medium text-green-800 text-sm">
                {isFree ? "Free Registration — No payment needed!" : "Payment Received!"}
              </p>
              <p className="text-xs text-green-700 mt-0.5">Your spot is fully confirmed.</p>
            </div>
          </div>
        )}

        {/* Event details */}
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-2.5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Event Details</p>
          <DetailRow icon={TYPE_EMOJI[event.eventType] || "🤝"} text={event.title} bold />
          <DetailRow icon="🗓️" text={format(new Date(event.date), "EEEE, dd MMM yyyy • h:mm a")} />
          <DetailRow icon="📍" text={event.location?.address} />
        </div>

        {/* Next steps */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">What's Next</p>
          <div className="space-y-3">
            {[
              isWaitlisted
                ? "We'll email you immediately if a spot opens up. Keep an eye on your inbox."
                : "Check your email for QR code and event details.",
              paymentPending
                ? `Complete payment of ৳${event.registrationFee} using the button above within 24 hours.`
                : isFree ? "Your spot is confirmed — just show up on time!" : "Your payment is confirmed ✅",
              "Bring the QR code (phone screen or printed) to the event entrance for check-in.",
              "After attending, you'll receive a digital certificate via email.",
            ].map((text, i) => (
              <div key={i} className="flex gap-3 text-sm text-gray-600">
                <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 text-xs flex items-center justify-center shrink-0 font-semibold mt-0.5">
                  {i + 1}
                </span>
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Link to={`/events/${event._id}`}
            className="flex-1 text-center py-2.5 rounded-xl border border-gray-200 text-sm font-medium
                       text-gray-700 hover:bg-gray-50 transition-colors">
            View Event
          </Link>
          <Link to="/events"
            className="flex-1 text-center py-2.5 rounded-xl bg-green-500 hover:bg-green-600
                       text-white text-sm font-semibold transition-colors">
            Browse Events
          </Link>
        </div>

        {/* Cancel option */}
        {!isWaitlisted && (
          <p className="text-center">
            <button onClick={onCancel}
              className="text-xs text-gray-400 hover:text-red-500 underline underline-offset-2 transition-colors">
              Cancel my registration
            </button>
          </p>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   EVENT SUMMARY CARD (top of form)
═══════════════════════════════════════════ */
function EventSummaryCard({ event, spotsLeft, isFull, isFree, guestSpotsLeft, isGuestFull }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-5 flex items-start gap-4">
      <div className="text-4xl shrink-0">{TYPE_EMOJI[event.eventType] || "🤝"}</div>
      <div className="min-w-0 flex-1">
        <h2 className="font-semibold text-gray-900 text-base leading-snug mb-1"
          style={{ fontFamily: "Fraunces,serif" }}>
          {event.title}
        </h2>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mb-2.5">
          <span>🗓️ {format(new Date(event.date), "dd MMM yyyy, h:mm a")}</span>
          <span>📍 {event.location?.address}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {isFull ? (
            <span className="text-xs bg-amber-50 text-amber-700 ring-1 ring-amber-200 px-2.5 py-1 rounded-full font-medium">
              ⚠️ Full — joining waitlist
            </span>
          ) : (
            <span className="text-xs bg-green-50 text-green-700 ring-1 ring-green-200 px-2.5 py-1 rounded-full font-medium">
              ✅ {spotsLeft} spots available
            </span>
          )}

          {/* Guest badge */}
          {event?.isGuestUnlimited ? (
            <span className="text-xs bg-blue-50 text-blue-700 ring-1 ring-blue-200 px-2.5 py-1 rounded-full font-medium">
              👤 Unlimited guests
            </span>
          ) : isGuestFull ? (
            <span className="text-xs bg-red-50 text-red-700 ring-1 ring-red-200 px-2.5 py-1 rounded-full font-medium">
              👤 Guest spots full
            </span>
          ) : (
            <span className="text-xs bg-blue-50 text-blue-700 ring-1 ring-blue-200 px-2.5 py-1 rounded-full font-medium">
              👤 {guestSpotsLeft} guest spots
            </span>
          )}


          {!isFree && (
            <span className="text-xs bg-blue-50 text-blue-700 ring-1 ring-blue-200 px-2.5 py-1 rounded-full font-medium">
              💳 ৳{event.registrationFee} fee
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   WAITLIST POSITION TRACKER
   Show on dashboard / event page
═══════════════════════════════════════════ */
export function WaitlistTracker({ eventId, email, position, eventTitle }) {
  const [currentPosition, setCurrentPosition] = useState(position);

  useEffect(() => {
    // Poll every 60 seconds for position updates
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/events/${eventId}/waitlist-position?email=${email}`
        );
        setCurrentPosition(res.data?.position ?? currentPosition);
      } catch {
        // silent
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [eventId, email, currentPosition]);

  if (!currentPosition) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center">
      <p className="text-xs text-amber-600 uppercase tracking-wide font-semibold mb-1">Waitlist Position</p>
      <p className="text-5xl font-bold text-amber-600 mb-1" style={{ fontFamily: "Fraunces,serif" }}>
        #{currentPosition}
      </p>
      <p className="text-sm text-amber-700 mb-3">for <strong>{eventTitle}</strong></p>
      <p className="text-xs text-amber-600">
        We'll email you the moment a spot opens. Position updates in real time.
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SMALL HELPERS
═══════════════════════════════════════════ */
function PageShell({ children }) {
  return (
    <div className="min-h-screen bg-[#f5f7f2] py-10 px-4" style={{ fontFamily: "'DM Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Fraunces:wght@600;700&display=swap');`}</style>
      <div className="max-w-2xl mx-auto">{children}</div>
    </div>
  );
}

function Field({ label, required, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

function DetailRow({ icon, text, bold }) {
  return (
    <div className="flex items-start gap-2.5 text-sm text-gray-700">
      <span className="text-base shrink-0">{icon}</span>
      <span className={bold ? "font-semibold" : ""}>{text}</span>
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

function inp(error) {
  return [
    "w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none",
    error
      ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100"
      : "border-gray-200 bg-white focus:border-green-400 focus:ring-2 focus:ring-green-100",
  ].join(" ");
}