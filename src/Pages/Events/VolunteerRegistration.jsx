import { useState, useEffect, use, useMemo } from "react";
import { useParams, useNavigate, Link, useSearchParams } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { QRCodeCanvas } from "qrcode.react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { AuthContext } from "../AuthProvider/AuthContext";
import {
  Trash2, Trees, Wrench, Megaphone, GraduationCap, Handshake,
  Calendar, MapPinned, Ticket, BookCheck, Medal, ChevronLeft,
  Loader2, AlertCircle, XCircle, CheckCircle, CreditCard, Clock,
  UserCheck, Users, UserPlus, Ban, ArrowRight, Mail,
} from "lucide-react";
import useAxios from "../../Hooks/useAxios";

/* ─── Constants ─── */
const AGE_GROUPS = [
  { value: "under-18", label: "Under 18 (Student)" },
  { value: "18-25",    label: "18 – 25" },
  { value: "26-35",    label: "26 – 35" },
  { value: "36+",      label: "36 and above" },
];
const SKILL_OPTIONS = [
  { value: "first-aid",    label: "First Aid" },
  { value: "photography",  label: "Photography" },
  { value: "driving",      label: "Driving" },
  { value: "cooking",      label: "Cooking" },
  { value: "social-media", label: "Social Media" },
  { value: "teaching",     label: "Teaching" },
  { value: "construction", label: "Construction" },
  { value: "medical",      label: "Medical" },
  { value: "legal",        label: "Legal" },
  { value: "translation",  label: "Translation" },
];
const TYPE_ICON = {
  cleanup:    Trash2,
  plantation: Trees,
  repair:     Wrench,
  awareness:  Megaphone,
  student:    GraduationCap,
  meetup:     Handshake,
};

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
export default function VolunteerRegistration() {
  const { id }               = useParams();
  const navigate             = useNavigate();
  const [searchParams]       = useSearchParams();

  const [event, setEvent]               = useState(null);
  const [eventLoading, setEventLoading] = useState(true);
  const [submitting, setSubmitting]     = useState(false);
  const [submitted, setSubmitted]       = useState(false);
  const [result, setResult]             = useState(null);
  const [errors, setErrors]             = useState({});
  const axiosSecure = useAxiosSecure();
  const { user } = use(AuthContext);
  const axiosInstance = useAxios()

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
    axiosInstance.get(`/events/${id}`)
      .then((r) => setEvent(r.data?.event))
      .catch(() => toast.error("Could not load event details"))
      .finally(() => setEventLoading(false));
  }, [id]);

  /* ── Handle Stripe redirect back ── */
  useEffect(() => {
    if (stripeSuccess) {
      const verify = async () => {
        try {
          const res = await axiosInstance.get(
            `/events/${id}/verify-payment/${stripeSuccess}`
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
            toast.success("Payment confirmed! You're all set.");
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
  const setF = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: "" }));
  };
  const toggleSkill = (val) =>
    setF("skills", form.skills.includes(val)
      ? form.skills.filter((s) => s !== val)
      : [...form.skills, val]);

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
    if (event?.isTshirt && !form.tshirtSize)
      e.tshirtSize = "Please select a T-shirt size";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await axiosSecure.post(`/events/${id}/volunteer`, form);
      const reg = res.data?.registration;
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

  //implement later
  /* ── Cancel registration ── */
  const handleCancel = async () => {
    if (!window.confirm("Cancel your registration? If you paid, you'll be refunded.")) return;
    try {
      const token = localStorage.getItem("token");
      await axiosSecure.post(
        `/events/${id}/cancel-registration`,{});
      toast.success("Registration cancelled. Refund (if any) processed in 5–7 days.");
      navigate(`/events/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not cancel registration");
    }
  };

  /* ── Derived ── */
  const spotsLeft = event
    ? Math.max(0, (event.maxVolunteers || 0) - (event.volunteerCount || 0))
    : null;
  const guestSpotsLeft = event?.isGuestUnlimited
    ? null
    : Math.max(0, (event?.guestNumber || 0) - (event?.guestCount || 0));
  const isGuestFull = !event?.isGuestUnlimited && (guestSpotsLeft ?? 0) <= 0;
  const isFull = useMemo(() => {
    if (form.role === "guest") return isGuestFull;
    return spotsLeft !== null && spotsLeft <= 0;
  }, [form.role, spotsLeft, isGuestFull]);
  const isFree     = !event?.registrationFee || event.registrationFee === 0;
  const isPastDate = event ? new Date(event.date) < new Date() : false;
  const EventIcon  = TYPE_ICON[event?.eventType] || Handshake;

  /* ════════════════════════════════════════
     LOADING
  ════════════════════════════════════════ */
  if (eventLoading) return (
    <PageShell>
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-400 text-base">Loading event...</p>
      </div>
    </PageShell>
  );

  /* ════════════════════════════════════════
     NOT FOUND
  ════════════════════════════════════════ */
  if (!event) return (
    <PageShell>
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <AlertCircle className="w-14 h-14 text-yellow-500 mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2" style={{ fontFamily: "Fraunces, serif" }}>
          Event not found
        </h2>
        <Link to="/events"
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-base mt-2">
          <ChevronLeft className="w-4 h-4" />
          Back to events
        </Link>
      </div>
    </PageShell>
  );

  /* ════════════════════════════════════════
     EVENT CLOSED
  ════════════════════════════════════════ */
  if (isPastDate || event.status === "cancelled" || event.status === "completed") return (
    <PageShell>
      <div className="max-w-md mx-auto text-center py-20">
        <div className="flex justify-center mb-4">
          {event.status === "cancelled"
            ? <XCircle className="w-14 h-14 text-red-500" />
            : <CheckCircle className="w-14 h-14 text-green-500" />}
        </div>
        <h2 className="text-xl font-semibold text-white mb-2" style={{ fontFamily: "Fraunces, serif" }}>
          {event.status === "cancelled" ? "Event Cancelled" : "Event Completed"}
        </h2>
        <p className="text-white text-base mb-6">
          This event is no longer accepting registrations.
        </p>
        <Link to="/events"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500 text-white rounded-lg text-base font-semibold hover:bg-blue-600 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Browse Other Events
        </Link>
      </div>
    </PageShell>
  );

  /* ════════════════════════════════════════
     SUCCESS STATE
  ════════════════════════════════════════ */
  if (submitted && result) {
    const isWaitlistedVolunteer = result.status === "waitlisted" && result.role !== "guest";
    const isWaitlistedGuest     = result.status === "waitlisted" && result.role === "guest";
    const isWaitlisted = result.status === "waitlisted"
    
    if (isWaitlisted) return (
        <PageShell>
          <div className="max-w-md mx-auto text-center py-20">
            <Clock className="w-14 h-14 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "Fraunces, serif" }}>
              You're on the Waitlist
            </h2>
            <p className="text-gray-400 text-base mb-2">
              Position <span className="text-white font-semibold">#{result.waitlistPosition}</span>
            </p>
            <p className="text-gray-400 text-sm">
              We'll email you immediately if a spot opens up.
            </p>
            <Link to={`/events/${id}`}
              className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors">
              <ChevronLeft className="w-4 h-4" />
              Back to Event
            </Link>
          </div>
        </PageShell>)

    return (
      <PageShell>
        <div className="max-w-5xl mx-auto w-full">

          {/* Back */}
          <Link to={`/events/${id}`}
            className="flex items-center gap-1.5 text-base text-white hover:text-gray-400 mb-6 transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Back to Event
          </Link>

          <SuccessCard result={result} event={event} isFree={isFree} onCancel={handleCancel} />

          {/* Waitlisted volunteer → guest switch */}
          {isWaitlistedVolunteer && !isGuestFull && (
            <div className="mt-4 rounded-2xl border border-zinc-800 p-5 text-center">
              <p className="text-sm font-semibold text-white mb-1">Guest spots still available!</p>
              <p className="text-sm text-gray-400 mb-3">
                Volunteer spots are full but you can switch to guest and attend the event.
              </p>
              <button
                onClick={() => { setSubmitted(false); setResult(null); setF("role", "guest"); }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-base font-semibold transition-colors">
                Switch to Guest
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Waitlisted guest → volunteer switch */}
          {isWaitlistedGuest && spotsLeft > 0 && (
            <div className="mt-4 rounded-2xl border border-zinc-800 p-5 text-center">
              <p className="text-sm font-semibold text-white mb-1">Volunteer spots available!</p>
              <p className="text-sm text-gray-400 mb-3">
                Guest spots are full but {spotsLeft} volunteer spot{spotsLeft > 1 ? "s are" : " is"} still open.
              </p>
              <button
                onClick={() => { setSubmitted(false); setResult(null); setF("role", "volunteer"); }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-base font-semibold transition-colors">
                Switch to Volunteer
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </PageShell>
    );
  }

  /* ════════════════════════════════════════
     REGISTRATION FORM
  ════════════════════════════════════════ */
  return (
    <PageShell>
      <div className="max-w-2xl mx-auto">

        {/* Back */}
        <button onClick={() => navigate(`/events/${id}`)}
          className="flex items-center gap-1.5 text-base text-white hover:text-gray-400 hover:cursor-pointer mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Back to Event
        </button>

        {/* Event summary */}
        <EventSummaryCard
          event={event}
          spotsLeft={spotsLeft}
          isFull={isFull}
          isFree={isFree}
          guestSpotsLeft={guestSpotsLeft}
          isGuestFull={isGuestFull}
        />

        {/* Cancelled payment notice */}
        {stripeCancelled && (
          <div className="border border-zinc-800 rounded-2xl p-4 mb-5 flex gap-3 text-white text-base">
            <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Payment was cancelled</p>
              <p className="text-sm mt-1 text-gray-400">
                Your spot is reserved for 24 hours. Complete payment below to confirm.
              </p>
            </div>
          </div>
        )}

        {/* Form card */}
        <div className="bg-zinc-950 rounded-3xl border border-zinc-800 shadow-sm overflow-hidden">

          {/* Header */}
          <div className="px-7 pt-7 pb-5 border-b border-zinc-700">
            <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "Fraunces, serif" }}>
              {isFull ? "Join Waitlist" : "Register as Volunteer"}
            </h1>
            <p className="text-white text-base">
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
                  onClick={() => !(r === "guest" && isGuestFull) && setF("role", r)}
                  disabled={r === "guest" && isGuestFull}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-base font-medium border transition-all ${
                    form.role === r
                      ? "bg-blue-500 text-white border-blue-500 shadow-sm"
                      : r === "guest" && isGuestFull
                      ? "bg-zinc-800 text-gray-500 border-zinc-700 cursor-not-allowed"
                      : "bg-zinc-900 text-gray-300 border-zinc-700 hover:border-zinc-500"
                  }`}>
                  {r === "volunteer"
                    ? <><UserCheck className="w-4 h-4" /> Volunteer</>
                    : isGuestFull
                    ? <><Users className="w-4 h-4" /> Guest (Full)</>
                    : <><Users className="w-4 h-4" /> Guest</>}
                </button>
              ))}
              <p className="text-sm text-gray-400 ml-2">
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
                  placeholder="Your full name"
                  className={`${inp(errors.name)} placeholder:text-zinc-500`} />
              </Field>
              <Field label="Email Address" required error={errors.email}>
                <input type="email" value={form.email}
                  onChange={(e) => setF("email", e.target.value)}
                  placeholder="you@example.com"
                  className={`${inp(errors.email)} placeholder:text-zinc-500`} />
              </Field>
            </div>

            {/* Phone */}
            <Field label="Phone Number" required error={errors.phone}>
              <div className="flex">
                <span className="inline-flex items-center px-3.5 py-2.5 border border-r-0 border-zinc-800
                                 bg-gray-50 rounded-l-xl text-base text-black select-none whitespace-nowrap">
                  🇧🇩 +880
                </span>
                <input type="tel" value={form.phone}
                  onChange={(e) => setF("phone", e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className={`${inp(errors.phone)} rounded-l-none border-l-0 placeholder:text-zinc-500`} />
              </div>
            </Field>

            {/* Institution + Age */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Institution / Organization">
                <input type="text" value={form.institution}
                  onChange={(e) => setF("institution", e.target.value)}
                  placeholder="School, college, or org"
                  className={`${inp()} placeholder:text-zinc-500`} />
                <p className="text-sm text-gray-400 mt-1">Certificate sent to your institution too</p>
              </Field>
              <Field label="Age Group">
                <select value={form.ageGroup}
                  onChange={(e) => setF("ageGroup", e.target.value)}
                  className={inp()}>
                  {AGE_GROUPS.map((a) => (
                    <option key={a.value} value={a.value}>{a.label}</option>
                  ))}
                </select>
              </Field>
            </div>

            {/* Skills */}
            <Field label="Your Skills (optional)">
              <p className="text-sm text-gray-400 mb-2.5">Helps organizers assign you suitable tasks</p>
              <div className="flex flex-wrap gap-2">
                {SKILL_OPTIONS.map((skill) => (
                  <button key={skill.value} type="button" onClick={() => toggleSkill(skill.value)}
                    className={`px-3 py-1.5 rounded-full text-base font-medium border transition-all ${
                      form.skills.includes(skill.value)
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-zinc-900 text-gray-300 border-zinc-700 hover:border-blue-400 hover:text-blue-300"
                    }`}>
                    {skill.label}
                  </button>
                ))}
              </div>
            </Field>

            {/* Equipment reminder */}
            {event.equipmentList?.length > 0 && (
              <div className="border border-zinc-800 rounded-2xl p-4">
                <p className="text-base font-medium text-white mb-2 flex items-center gap-2">
                  <BookCheck className="w-4 h-4 text-blue-400" />
                  Please bring on event day:
                </p>
                <div className="flex flex-wrap gap-2">
                  {event.equipmentList.map((item) => (
                    <span key={item}
                      className="text-sm bg-zinc-800 text-gray-300 px-2.5 py-1 rounded-full">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* T-Shirt Size */}
            {event?.isTshirt && (
              <Field label="T-Shirt Size" required error={errors.tshirtSize}>
                <div className="overflow-x-auto rounded-xl border border-zinc-800">
                  <table className="w-full text-base">
                    <thead>
                      <tr className="bg-zinc-900 border-b border-zinc-800">
                        <th className="px-4 py-2.5 text-left text-sm font-semibold text-gray-400 uppercase tracking-wide">Size</th>
                        <th className="px-4 py-2.5 text-left text-sm font-semibold text-gray-400 uppercase tracking-wide">Chest</th>
                        <th className="px-4 py-2.5 text-left text-sm font-semibold text-gray-400 uppercase tracking-wide">Height</th>
                        <th className="px-4 py-2.5 text-left text-sm font-semibold text-gray-400 uppercase tracking-wide">Select</th>
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
                          className={`cursor-pointer transition-colors border-b border-zinc-800 last:border-0 ${
                            form.tshirtSize === row.size
                              ? "bg-blue-500/10"
                              : i % 2 === 0 ? "bg-zinc-950 hover:bg-zinc-900" : "bg-zinc-900/50 hover:bg-zinc-900"
                          }`}>
                          <td className="px-4 py-3 font-semibold text-white">{row.size}</td>
                          <td className="px-4 py-3 text-gray-400">{row.chest}</td>
                          <td className="px-4 py-3 text-gray-400">{row.height}</td>
                          <td className="px-4 py-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                              form.tshirtSize === row.size
                                ? "border-blue-500 bg-blue-500"
                                : "border-zinc-600"
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
                  <p className="text-sm text-blue-400 mt-2 font-medium flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Selected: {form.tshirtSize}
                  </p>
                )}
              </Field>
            )}

            {/* Payment notice */}
            {!isFree && !isFull && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-base text-blue-800 flex gap-3">
                <CreditCard className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold mb-0.5">Registration Fee: ৳{event.registrationFee}</p>
                  <p className="text-sm text-blue-700 leading-relaxed">
                    After submitting, you'll be redirected to a secure Stripe payment page.
                    Your spot is confirmed only after payment. Fee is fully refunded if event is cancelled.
                  </p>
                </div>
              </div>
            )}

            {/* Waitlist notice */}
            {isFull && (
              <div className="border border-zinc-800 rounded-2xl p-4 text-base text-white flex gap-3">
                <Clock className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold mb-0.5">Joining Waitlist</p>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    All {event.maxVolunteers} spots are taken. You'll be added to the waitlist and
                    notified immediately if someone cancels. No payment is taken until you get a spot.
                  </p>
                </div>
              </div>
            )}

            {/* Certificate notice */}
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 text-base text-purple-800 flex gap-3">
              <Medal className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-0.5">Digital Certificate after attendance</p>
                <p className="text-sm text-purple-700 leading-relaxed">
                  Attendees get a verifiable digital certificate sent to their email.
                  {form.institution && " Your institution will also receive a copy."}
                </p>
              </div>
            </div>

            {/* Submit button */}
            <button type="submit" disabled={submitting}
              className="w-full py-3.5 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-semibold
                         text-base transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2.5 mt-2">
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" />
                  {!isFree && !isFull ? "Preparing payment..." : "Submitting..."}
                </>
              ) : isFull ? (
                <><Clock className="w-4 h-4" /> Join Waitlist</>
              ) : !isFree ? (
                <><CreditCard className="w-4 h-4" /> Register & Pay ৳{event.registrationFee}</>
              ) : form.role === "guest" ? (
                <><Users className="w-4 h-4" /> Register as Guest</>
              ) : (
                <><UserCheck className="w-4 h-4" /> Register as Volunteer</>
              )}
            </button>

            <p className="text-sm text-center text-gray-400">
              By registering, you agree to participate responsibly and follow event guidelines.
            </p>
          </form>
        </div>

        {/* Free participate link */}
        <p className="text-center text-base text-gray-400 mt-5">
          Just want to attend?{" "}
          <Link to={`/events/${id}/free-participate`} className="text-blue-400 hover:underline font-medium">
            Free Participation
          </Link>
        </p>
      </div>
    </PageShell>
  );
}

/* ═══════════════════════════════════════════
   SUCCESS CARD
═══════════════════════════════════════════ */
function SuccessCard({ result, event, isFree, onCancel }) {
  const isWaitlisted   = result.waitlisted;
  const paymentPending = result.paymentStatus === "pending" && !isFree;
  const paymentDone    = result.paymentStatus === "paid" || isFree;
  const EventIcon      = TYPE_ICON[event?.eventType] || Handshake;

  return (
    <div className="rounded-3xl border border-zinc-800 overflow-hidden flex flex-col items-center md:flex-row">

      {/* LEFT SIDE */}
      <div className="w-full md:w-105 border-b md:border-b-0 md:border-r border-zinc-800">

        {/* Banner */}
        <div className="py-10 px-8 text-center">
          <div className="text-6xl mb-3 animate-bounce flex justify-center">
            {isWaitlisted
              ? <Clock className="w-10 h-10 text-yellow-400" />
              : <Ticket className="w-10 h-10" />}
          </div>
          <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "Fraunces, serif" }}>
            {isWaitlisted ? "You're on the Waitlist!" : "Registration Confirmed!"}
          </h2>
          <p className="text-white text-base max-w-sm mx-auto">
            {isWaitlisted
              ? `You're #${result.waitlistPosition} on the waitlist. We'll email you the moment a spot opens.`
              : paymentPending
              ? "Spot reserved! Complete payment to confirm."
              : "Your spot is locked in. Check your email for the QR code."}
          </p>
        </div>

        {/* QR Section */}
        <div className="p-7 space-y-5">
          {!isWaitlisted && result.qrToken && (
            <div className="rounded-2xl p-5 border border-zinc-800 text-center">
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
                Your QR Code
              </p>
              <div className="inline-block p-3 bg-white rounded-2xl">
                <QRCodeCanvas
                  value={result.qrToken}
                  size={160}
                  bgColor="#ffffff"
                  fgColor="#111827"
                  level="M"
                  includeMargin={false}
                />
              </div>
              <code className="block text-[11px] font-mono text-white break-all mt-4">
                {result.qrToken}
              </code>
              <p className="text-sm text-gray-400 mt-2 flex items-center justify-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                Also sent to your email
              </p>
            </div>
          )}

          {/* Payment pending */}
          {paymentPending && result.paymentUrl && (
            <div className="border border-zinc-800 rounded-2xl p-5">
              <p className="font-semibold text-white mb-2 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-400" />
                Payment Required — ৳{event.registrationFee}
              </p>
              <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                Your spot is reserved for <strong className="text-white">24 hours</strong>. Complete payment to confirm.
                You'll be refunded in full if the event is cancelled.
              </p>
              <a href={result.paymentUrl}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600
                           text-white rounded-xl text-base font-semibold transition-colors">
                Pay ৳{event.registrationFee} via Stripe
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          )}

          {/* Payment done */}
          {paymentDone && !isWaitlisted && (
            <div className="border border-zinc-800 rounded-2xl p-4 flex items-center gap-3">
              <CheckCircle className="text-green-400 w-5 h-5 shrink-0" />
              <div>
                <p className="font-medium text-white">
                  {isFree ? "Free Registration — No payment needed!" : "Payment Received!"}
                </p>
                <p className="text-sm text-gray-400 mt-0.5">Your spot is fully confirmed.</p>
              </div>
            </div>
          )}

          {/* Cancel option */}
          {!isWaitlisted && (
            <p className="text-center">
              <button onClick={onCancel}
                className="text-sm text-gray-500 hover:text-red-400 underline underline-offset-2 transition-colors">
                Cancel my registration
              </button>
            </p>
          )}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 p-6 space-y-8">

        {/* Event details */}
        <div className="rounded-2xl p-4 border border-zinc-800 space-y-3">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Event Details
          </p>
          <DetailRow icon={TYPE_ICON[event.eventType] || Handshake} text={event.title} bold />
          <DetailRow icon={Calendar} text={format(new Date(event.date), "EEEE, dd MMM yyyy • h:mm a")} />
          <DetailRow icon={MapPinned} text={event.location?.address} />
        </div>

        {/* What's next */}
        <div>
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
            What's Next
          </p>
          <div className="space-y-3">
            {[
              isWaitlisted
                ? "We'll email you immediately if a spot opens up. Keep an eye on your inbox."
                : "Check your email for QR code and event details.",
              paymentPending
                ? `Complete payment of ৳${event.registrationFee} using the button above within 24 hours.`
                : isFree ? "Your spot is confirmed — just show up on time!" : "Your payment is confirmed.",
              "Bring the QR code (phone screen or printed) to the event entrance for check-in.",
              "After attending, you'll receive a digital certificate via email.",
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

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Link to={`/events/${event._id}`}
            className="flex-1 text-center py-2.5 rounded-xl border border-zinc-800 text-white transition">
            View Event
          </Link>
          <Link to="/events"
            className="flex-1 text-center py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold">
            Browse Events
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   EVENT SUMMARY CARD
═══════════════════════════════════════════ */
function EventSummaryCard({ event, spotsLeft, isFull, isFree, guestSpotsLeft, isGuestFull }) {
  const EventIcon = TYPE_ICON[event.eventType] || Handshake;
  return (
    <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-5 mb-5 flex items-start gap-4">
      <div className="shrink-0">
        <EventIcon className="w-10 h-10 text-blue-500" />
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="font-semibold text-white text-base leading-snug mb-1"
          style={{ fontFamily: "Fraunces, serif" }}>
          {event.title}
        </h2>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-base text-white mb-2.5">
          <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {format(new Date(event.date), "dd MMM yyyy, h:mm a")}</span>
          <span className="flex items-center gap-2"><MapPinned className="w-4 h-4" /> {event.location?.address}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {isFull ? (
            <span className="text-sm bg-zinc-800 text-yellow-400 ring-1 ring-zinc-700 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Full — joining waitlist
            </span>
          ) : (
            <span className="text-sm bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
              <BookCheck className="w-3.5 h-3.5" fill="green" color="black" /> {spotsLeft} spots available
            </span>
          )}

          {event?.isGuestUnlimited ? (
            <span className="text-sm bg-blue-50 text-blue-700 ring-1 ring-blue-200 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> Unlimited guests
            </span>
          ) : isGuestFull ? (
            <span className="text-sm bg-zinc-800 text-red-400 ring-1 ring-zinc-700 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
              <Ban className="w-3.5 h-3.5" /> Guest spots full
            </span>
          ) : (
            <span className="text-sm bg-blue-50 text-blue-700 ring-1 ring-blue-200 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> {guestSpotsLeft} guest spots
            </span>
          )}

          {!isFree && (
            <span className="text-sm bg-blue-50 text-blue-700 ring-1 ring-blue-200 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5" /> ৳{event.registrationFee} fee
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   WAITLIST POSITION TRACKER
═══════════════════════════════════════════ */
export function WaitlistTracker({ eventId, email, position, eventTitle }) {
  const [currentPosition, setCurrentPosition] = useState(position);

  useEffect(() => {
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
    <div className="border border-zinc-800 rounded-2xl p-5 text-center">
      <p className="text-sm text-gray-400 uppercase tracking-wide font-semibold mb-1">Waitlist Position</p>
      <p className="text-5xl font-bold text-white mb-1" style={{ fontFamily: "Fraunces, serif" }}>
        #{currentPosition}
      </p>
      <p className="text-base text-gray-400 mb-3">for <strong className="text-white">{eventTitle}</strong></p>
      <p className="text-sm text-gray-500">
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
    <div className="min-h-screen bg-zinc-950 py-10 px-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Fraunces:wght@600;700&display=swap');`}</style>
      <div className="max-w-full mx-auto">{children}</div>
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
      <span className={bold ? "font-semibold" : ""}>{text}</span>
    </div>
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