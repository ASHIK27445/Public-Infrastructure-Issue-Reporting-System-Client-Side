import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { BookCheck, Brush, Cog, FileText, GraduationCap, HandCoins, Handshake, MapPin, Ribbon, Settings2, TreeDeciduous } from "lucide-react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { use } from "react";
import { AuthContext } from "../AuthProvider/AuthContext";
import './event.css'

const EVENT_TYPES = [
  { value: "cleanup", icon: <Brush size={20} color="black" />,label: "Cleanup Drive", desc: "পরিষ্কার অভিযান" },
  { value: "plantation", icon: <TreeDeciduous size={20} color="green" fill="green" />,label: "Tree Plantation", desc: "বৃক্ষরোপণ" },
  { value: "repair", icon: <Cog size={20} color="red"/>,label: "Repair Work", desc: "মেরামত কাজ" },
  { value: "awareness", icon: <Ribbon size={20} color="blue"/>,label: "Awareness Campaign", desc: "সচেতনতা অভিযান" },
  { value: "student", icon: <GraduationCap size={20} color="black" fill="black"/>,label: "Student Volunteer Day", desc: "ছাত্রবন্ধু দিবস" },
  { value: "meetup", icon: <Handshake size={20} color="black" fill="yellow"/>,label: "Community Meetup", desc: "সামাজিক সমাবেশ" },
];

const SKILL_OPTIONS = [
  "First Aid", "Photography", "Driving", "Cooking", "Social Media",
  "Teaching", "Construction", "Medical", "Legal", "Translation",
];

const STEP_LABELS = ["Basic Info", "Location & Date", "Volunteer Settings", "Funding", "Review"];

export default function CreateEvent() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [issues, setIssues] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    eventType: "",
    linkedIssueId: "",
    date: "",
    endDate: "",
    location: { address: "", lat: "", lng: "" },
    maxVolunteers: 50,
    registrationFee: 0,
    equipmentList: [],
    isTshirt: false,
    isGuestUnlimited: false,
    guestNumber: 0,
    organizerContact: "",
    fundGoal: 0,
    coverImage: "",
    pinnedAnnouncement: "",
  });

  const [equipInput, setEquipInput] = useState("");
  const [errors, setErrors] = useState({});
  const axiosSecure = useAxiosSecure()
  const {user, mUser, role} = use(AuthContext)

  // Fetch admin's issues to link
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await axiosSecure.get('/allissues');
        setIssues(res.data || []);
        console.log(res.data)
      } catch {
        // silently fail — linking is optional
      }
    };
    fetchIssues();
  }, []);

  const set = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const setLocation = (field, value) => {
    setForm((prev) => ({
      ...prev,
      location: { ...prev.location, [field]: value },
    }));
  };

  const addEquipment = () => {
    const item = equipInput.trim();
    if (!item) return;
    if (form.equipmentList.includes(item)) return;
    set("equipmentList", [...form.equipmentList, item]);
    setEquipInput("");
  };

  const removeEquipment = (item) => {
    set("equipmentList", form.equipmentList.filter((e) => e !== item));
  };

  // Auto-detect location from browser
  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation("lat", pos.coords.latitude.toFixed(6));
        setLocation("lng", pos.coords.longitude.toFixed(6));
        toast.success("Location detected!");
      },
      () => toast.error("Could not detect location")
    );
  };

  // Step validation
  const validateStep = () => {
    const newErrors = {};
    if (step === 0) {
      if (!form.title.trim()) newErrors.title = "Title is required";
      if (!form.description.trim()) newErrors.description = "Description is required";
      if (!form.eventType) newErrors.eventType = "Please select an event type";
    }
    if (step === 1) {
      if (!form.date) newErrors.date = "Event date is required";
      if (!form.location.address.trim()) newErrors.address = "Address is required";
      if (!form.location.lat || !form.location.lng) newErrors.latLng = "Coordinates are required";
    }
    if (step === 2) {
      if (form.maxVolunteers < 1) newErrors.maxVolunteers = "At least 1 volunteer spot required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) setStep((s) => Math.min(s + 1, 4));
  };
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    if(!user) return;
    if (!(role === 'admin' || (role === 'staff' && mUser?.position === 'super'))) {
      toast.error('You are not authorized.');
      return;
    }
    // if(role === 'admin'){
    //   toast.success('ok')
    //   return
    // }
    setLoading(true);
    try {
      const payload = {
        ...form,
        location: {
          ...form.location,
          lat: parseFloat(form.location.lat),
          lng: parseFloat(form.location.lng),
        },
        maxVolunteers: Number(form.maxVolunteers),
        registrationFee: Number(form.registrationFee),
        fundGoal: Number(form.fundGoal),
        linkedIssueId: form.linkedIssueId || undefined,
      };

      console.log(payload)

      await axiosSecure.post('/events/create', payload
      );

      toast.success("Event created successfully! 🎉");
      navigate("/admin/events");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  const progress = ((step + 1) / STEP_LABELS.length) * 100;

  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-950 to-zinc-900 py-8 px-4">
      <div className="max-w-2xl mx-auto mt-10 mb-20">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
            Create <span className="bg-linear-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Community Event</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Organize a volunteer-driven event to fix community issues together
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {STEP_LABELS.map((label, i) => (
              <span
                key={i}
                className={`text-sm font-medium transition-colors ${
                  i <= step ? "text-green-600" : "text-gray-400"
                }`}
              >
                {label}
              </span>
            ))}
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-2xl border border-zinc-700 shadow-sm overflow-hidden">
          <div className="p-6 md:p-8">

            {/* ── STEP 0: Basic Info ── */}
            {step === 0 && (
              <div className="space-y-6 text-black">
                <SectionTitle icon={FileText} title="Basic Information" />

                <Field label="Event Title" error={errors.title} required>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => set("title", e.target.value)}
                    placeholder="e.g. Uttara Lake Cleanup Drive"
                    className={inputClass(errors.title)}
                  />
                </Field>

                <Field label="Event Type" error={errors.eventType} required>
                  <div className="grid grid-cols-2 gap-3">
                    {EVENT_TYPES.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => set("eventType", type.value)}
                        className={`text-left p-3 rounded-xl border transition-all ${
                          form.eventType === type.value
                            ? "border-green-500 bg-green-50 ring-1 ring-green-500"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}>
                        <div className="flex gap-1 text-base text-black justify-center items-center">{type.icon}{type.label}</div>
                        <div className="text-sm text-gray-500 mt-0.5 text-center">{type.desc}</div>
                      </button>
                    ))}
                  </div>
                  {errors.eventType && <p className="text-red-500 text-sm mt-1">{errors.eventType}</p>}
                </Field>

                <Field label="Description" error={errors.description} required>
                  <textarea
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    placeholder="Describe the event — what will be done, why it matters, what to bring..."
                    rows={4}
                    className={inputClass(errors.description)}
                  />
                  <p className="text-sm text-gray-400 mt-1">{form.description.length}/1000 characters</p>
                </Field>

                <Field label="Link to Existing Issue (optional)">
                  <select
                    value={form.linkedIssueId}
                    onChange={(e) => set("linkedIssueId", e.target.value)}
                    className={inputClass()}
                  >
                    <option value="">— No linked issue —</option>
                    {issues.map((issue) => (
                      <option key={issue._id} value={issue._id}>
                        {issue.title} ({issue.category})
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Cover Image URL (optional)">
                  <input
                    type="url"
                    value={form.coverImage}
                    onChange={(e) => set("coverImage", e.target.value)}
                    placeholder="https://..."
                    className={inputClass()}
                  />
                  {form.coverImage && (
                    <img
                      src={form.coverImage}
                      alt="cover preview"
                      className="mt-2 rounded-lg h-75 w-full object-cover border border-gray-200"
                      onError={(e) => (e.target.style.display = "none")}
                      loading="lazy"
                    />
                  )}
                </Field>
              </div>
            )}

            {/* ── STEP 1: Location & Date ── */}
            {step === 1 && (
              <div className="space-y-6 text-black">
                <SectionTitle icon={MapPin} title="Location & Date" />

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Start Date & Time" error={errors.date} required>
                    <input
                      type="datetime-local"
                      value={form.date}
                      onChange={(e) => set("date", e.target.value)}
                      className={inputClass(errors.date)}
                    />
                  </Field>
                  <Field label="End Date & Time (optional)">
                    <input
                      type="datetime-local"
                      value={form.endDate}
                      onChange={(e) => set("endDate", e.target.value)}
                      className={inputClass()}
                    />
                  </Field>
                </div>

                <Field label="Address" error={errors.address} required>
                  <input
                    type="text"
                    value={form.location.address}
                    onChange={(e) => setLocation("address", e.target.value)}
                    placeholder="e.g. Uttara Sector 7, Dhaka"
                    className={inputClass(errors.address)}
                  />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Latitude" error={errors.latLng} required>
                    <input
                      type="number"
                      step="any"
                      value={form.location.lat}
                      onChange={(e) => setLocation("lat", e.target.value)}
                      placeholder="23.8103"
                      className={inputClass(errors.latLng)}
                    />
                  </Field>
                  <Field label="Longitude">
                    <input
                      type="number"
                      step="any"
                      value={form.location.lng}
                      onChange={(e) => setLocation("lng", e.target.value)}
                      placeholder="90.4125"
                      className={inputClass()}
                    />
                  </Field>
                </div>

                <button
                  type="button"
                  onClick={detectLocation}
                  className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Auto-detect my location
                </button>

                <Field label="Organizer Contact (phone/email)">
                  <input
                    type="text"
                    value={form.organizerContact}
                    onChange={(e) => set("organizerContact", e.target.value)}
                    placeholder="01XXXXXXXXX or admin@communityfix.com"
                    className={inputClass()}
                  />
                </Field>
              </div>
            )}

            {/* ── STEP 2: Volunteer Settings ── */}
            {step === 2 && (
              <div className="space-y-6 text-black">
                <SectionTitle icon={Settings2} title="Volunteer Settings" />

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Max Volunteers" error={errors.maxVolunteers} required>
                    <input
                      type="number"
                      min={1}
                      value={form.maxVolunteers}
                      onChange={(e) => set("maxVolunteers", e.target.value)}
                      className={inputClass(errors.maxVolunteers)}
                    />
                    <p className="text-sm text-gray-400 mt-1">After this, volunteers go to waitlist</p>
                  </Field>

                  <Field label="Registration Fee (৳)">
                    <input
                      type="number"
                      min={0}
                      value={form.registrationFee}
                      onChange={(e) => set("registrationFee", e.target.value)}
                      placeholder="0 = Free"
                      className={inputClass()}
                    />
                    <p className="text-sm text-gray-400 mt-1">0 for free registration</p>
                  </Field>
                </div>

                {form.registrationFee > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                    💡 Registration fee of <strong>৳{form.registrationFee}</strong> will be collected via Stripe.
                    It will go into the event fund and refunded if event is cancelled.
                  </div>
                )}

                <Field label="Equipment / Items Needed">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={equipInput}
                      onChange={(e) => setEquipInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addEquipment())}
                      placeholder="e.g. Gloves, Garbage bags..."
                      className={`${inputClass()} flex-1`}
                    />
                    <button
                      type="button"
                      onClick={addEquipment}
                      className="px-4 py-2.5 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  {form.equipmentList.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {form.equipmentList.map((item) => (
                        <span
                          key={item}
                          className="flex items-center gap-1.5 bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                        >
                          {item}
                          <button
                            type="button"
                            onClick={() => removeEquipment(item)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </Field>

                {/* T-Shirt */}
                <div
                  onClick={() => set("isTshirt", !form.isTshirt)}
                  className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    form.isTshirt
                      ? "border-green-500 bg-green-50 ring-1 ring-green-500"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    form.isTshirt ? "bg-green-500 border-green-500" : "border-gray-300"
                  }`}>
                    {form.isTshirt && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">👕 Provide T-Shirt</p>
                    <p className="text-xs text-gray-400 mt-0.5">Volunteers will be asked to select their size during registration</p>
                  </div>
                </div>

                {/* Guest Settings */}
                <div className="space-y-3">
                  <div
                    onClick={() => set("isGuestUnlimited", !form.isGuestUnlimited)}
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      form.isGuestUnlimited
                        ? "border-green-500 bg-green-50 ring-1 ring-green-500"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                      form.isGuestUnlimited ? "bg-green-500 border-green-500" : "border-gray-300"
                    }`}>
                      {form.isGuestUnlimited && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">👤 Unlimited Guests</p>
                      <p className="text-xs text-gray-400 mt-0.5">No limit on how many guests can register</p>
                    </div>
                  </div>

                  {/* Guest number input — only show if NOT unlimited */}
                  {!form.isGuestUnlimited && (
                    <Field label="Max Guests">
                      <input
                        type="number"
                        min={1}
                        value={form.guestNumber}
                        onChange={(e) => set("guestNumber", Number(e.target.value))}
                        placeholder="e.g. 10"
                        className={inputClass()}
                      />
                      <p className="text-sm text-gray-400 mt-1">After this, guests cannot register</p>
                    </Field>
                  )}
                </div>

                <Field label="Pinned Announcement (optional)">
                  <textarea
                    value={form.pinnedAnnouncement}
                    onChange={(e) => set("pinnedAnnouncement", e.target.value)}
                    placeholder="Important note pinned at the top of the event page..."
                    rows={2}
                    className={inputClass()}
                  />
                </Field>
              </div>
            )}

            {/* ── STEP 3: Funding ── */}
            {step === 3 && (
              <div className="space-y-6 text-black">
                <SectionTitle icon={HandCoins} title="Funding Goal (optional)" />

                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
                  🤝 Allow community members who cannot attend to donate toward this event.
                  Transparent spending breakdown will be published after the event.
                </div>

                <Field label="Funding Goal (৳)">
                  <input
                    type="number"
                    min={0}
                    value={form.fundGoal}
                    onChange={(e) => set("fundGoal", e.target.value)}
                    placeholder="0 = No donation target"
                    className={inputClass()}
                  />
                  <p className="text-sm text-gray-400 mt-1">
                    Leave 0 if you don&apos;t need donations. A progress bar will show on the event page.
                  </p>
                </Field>

                {form.fundGoal > 0 && (
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Preview fundraiser bar</p>
                    <div className="flex justify-between text-sm text-gray-500 mb-1">
                      <span>৳ 0 raised</span>
                      <span>Goal: ৳ {Number(form.fundGoal).toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-400 rounded-full w-0" />
                    </div>
                    <p className="text-sm text-gray-400 mt-2">
                      Donors will see this progress bar and get notified when the event completes.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ── STEP 4: Review ── */}
            {step === 4 && (
              <div className="space-y-5">
                <SectionTitle icon={BookCheck} title="Review & Create" />

                <div className="space-y-3">
                  <ReviewRow label="Title" value={form.title} />
                  <ReviewRow
                    label="Type"
                    value={EVENT_TYPES.find((t) => t.value === form.eventType)?.label}
                  />
                  <ReviewRow label="Date" value={form.date ? new Date(form.date).toLocaleString() : "—"} />
                  <ReviewRow label="Address" value={form.location.address} />
                  <ReviewRow label="Coordinates" value={`${form.location.lat}, ${form.location.lng}`} />
                  <ReviewRow label="Max Volunteers" value={form.maxVolunteers} />
                  <ReviewRow
                    label="Registration Fee"
                    value={form.registrationFee > 0 ? `৳ ${form.registrationFee}` : "Free"}
                  />
                  <ReviewRow
                    label="Funding Goal"
                    value={form.fundGoal > 0 ? `৳ ${Number(form.fundGoal).toLocaleString()}` : "No target"}
                  />
                  {form.equipmentList.length > 0 && (
                    <ReviewRow label="Equipment" value={form.equipmentList.join(", ")} />
                  )}
                  <ReviewRow label="T-Shirt" value={form.isTshirt ? "Yes — size will be collected" : "No"} />
                  <ReviewRow label="Guest Limit" 
                  value={form.isGuestUnlimited ? "Unlimited" : `${form.guestNumber} guests`}/>
                  {form.organizerContact && (
                    <ReviewRow label="Contact" value={form.organizerContact} />
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
                  📢 After creating, nearby citizens will be notified about this event.
                  You can edit details anytime from the Admin Events panel.
                </div>
              </div>
            )}
          </div>

          {/* Footer buttons */}
          <div className="px-6 md:px-8 py-4 border-t border-zinc-700 bg-zinc-900 flex justify-between items-center">
            <button
              type="button"
              onClick={prevStep}
              disabled={step === 0}
              className="px-5 py-2.5 rounded-xl bg-white text-sm font-medium text-gray-700 hover:bg-green-500 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>

            <span className="text-sm text-gray-400">
              Step {step + 1} of {STEP_LABELS.length}
            </span>

            {step < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-5 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm
                           font-medium transition-colors shadow-sm"
              >
                Next →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm
                           font-medium transition-colors shadow-sm disabled:opacity-60 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                    Creating...
                  </>
                ) : (
                  "Create Event"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Helper components ──────────────────────────────────────

function SectionTitle({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <Icon className="w-5 h-5 text-green-500" />
      <h2 className="text-lg font-semibold text-gray-200">
        {title}
      </h2>
    </div>
  );
}

function Field({ label, error, required, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-100 mb-1.5">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

function ReviewRow({ label, value }) {
  return (
    <div className="review-row flex justify-between py-2 border-b border-gray-700 last:border-0">
      <span className="text-sm text-gray-400 w-36 shrink-0">{label}</span>
      <span className="text-sm text-gray-100 text-right">{value || "—"}</span>
    </div>
  );
}

function inputClass(error) {
  return `w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors outline-none
    ${error
      ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-1 focus:ring-red-400"
      : "border-gray-200 bg-white focus:border-green-400 focus:ring-1 focus:ring-green-400"
    }`;
}