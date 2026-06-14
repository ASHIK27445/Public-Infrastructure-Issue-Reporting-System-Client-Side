import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import { format, formatDistanceToNow } from "date-fns";
import { QRCodeCanvas } from "qrcode.react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

/* ─── Constants ─── */
const TYPE_EMOJI = { cleanup:"🧹", plantation:"🌳", repair:"🏗️", awareness:"📢", student:"🎓", meetup:"🤝" };
const STATUS_NEXT = {
  draft:    ["upcoming","cancelled"],
  upcoming: ["ongoing","cancelled"],
  ongoing:  ["completed","cancelled"],
  completed:[], cancelled:[],
};
const PAYMENT_BADGE = {
  "not-required": { bg:"bg-stone-100", text:"text-stone-500", label:"Free" },
  "pending":      { bg:"bg-amber-100", text:"text-amber-700", label:"⏳ Pending" },
  "paid":         { bg:"bg-green-100", text:"text-green-700", label:"✅ Paid" },
  "refunded":     { bg:"bg-blue-100",  text:"text-blue-700",  label:"↩ Refunded" },
};

/* ═══════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════ */
export default function AdminEventManagePage() {
  const { id }     = useParams();
  const navigate   = useNavigate();

  const [data,      setData]      = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState("volunteers");
  const [statusUpdating, setStatusUpdating] = useState(false);
  const axiosSecure = useAxiosSecure()

  const token   = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get(`/admin/events/${id}/manage`);
      setData(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not load event");
    } finally {
      setLoading(false);
    }
  };
  console.log(data)

  useEffect(() => { fetchData(); }, [id]);

  const handleStatusChange = async (newStatus) => {
    const msg = newStatus === "cancelled"
      ? "Cancel event? All paid registrations will be refunded."
      : `Mark as "${newStatus}"?`;
    if (!window.confirm(msg)) return;
    setStatusUpdating(true);
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/admin/events/${id}/status`,
        { status: newStatus }, { headers }
      );
      toast.success(`Status → ${newStatus}`);
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
    finally { setStatusUpdating(false); }
  };

  const handleRemoveVolunteer = async (regId, name) => {
    if (!window.confirm(`Remove ${name}? If they paid, they'll be refunded.`)) return;
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/admin/events/${id}/volunteer/${regId}/remove`,
        {}, { headers }
      );
      toast.success(`${name} removed. Waitlist updated.`);
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || "Remove failed"); }
  };

  /* ─── Loading ─── */
  if (loading) return (
    <Shell>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-[3px] border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </Shell>
  );

  if (!data?.event) return (
    <Shell>
      <div className="text-center py-20 text-stone-500">Event not found.</div>
    </Shell>
  );

  const { event, confirmed, waitlist, donations, stats } = data;
  const available = STATUS_NEXT[event.status] || [];

  return (
    <Shell>
      {/* ── Back + Header ── */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <button onClick={() => navigate("/admin/events")}
            className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 mb-3 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All Events
          </button>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-2xl">{TYPE_EMOJI[event.eventType] || "📅"}</span>
            <h1 className="text-2xl font-bold text-stone-900" style={{ fontFamily:"Fraunces,serif" }}>
              {event.title}
            </h1>
            <StatusPill status={event.status} />
          </div>
          <p className="text-stone-500 text-sm mt-1">
            {format(new Date(event.date), "EEEE, dd MMM yyyy · h:mm a")} · {event.location?.address}
          </p>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <Link to={`/events/${event._id}`}
            className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 text-sm font-medium hover:bg-stone-50 transition-colors">
            👁️ Public Page
          </Link>
          <Link to={`/admin/events/edit/${event._id}`}
            className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 text-sm font-medium hover:bg-stone-50 transition-colors">
            ✏️ Edit
          </Link>
          <Link to={`/admin/events/${event._id}/checkin`}
            className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors">
            📱 QR Check-in
          </Link>
          {available.map((s) => (
            <button key={s} onClick={() => handleStatusChange(s)} disabled={statusUpdating}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 ${
                s==="cancelled" ? "bg-red-50 hover:bg-red-100 text-red-700 border border-red-200"
                : s==="completed" ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
              }`}>
              {statusUpdating ? "..." : s==="ongoing" ? "🔴 Go Live" : s==="completed" ? "✅ Complete" : "❌ Cancel"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
        <MiniStat label="Confirmed"    value={stats.confirmedCount} color="green"  />
        <MiniStat label="Waitlisted"   value={stats.waitlistCount}  color="amber"  />
        <MiniStat label="Attended"     value={stats.attendedCount}  color="blue"   />
        <MiniStat label="Paid"         value={stats.paidCount}      color="purple" />
        <MiniStat label="Pmt Pending"  value={stats.pendingPayment} color="orange" />
        <MiniStat label="Donated"      value={`৳${(stats.totalDonated||0).toLocaleString()}`} color="emerald" />
        <MiniStat label="Comments"     value={stats.commentCount}   color="stone"  />
      </div>

      {/* ── Tabs ── */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-stone-100 overflow-x-auto">
          {[
            { id:"volunteers", label:"Confirmed Volunteers", icon:"✅", count: stats.confirmedCount },
            { id:"waitlist",   label:"Waitlist",             icon:"⏳", count: stats.waitlistCount  },
            { id:"donations",  label:"Donations",            icon:"💰", count: stats.donorCount, show: event.fundGoal > 0 },
            { id:"edit",       label:"Edit Event",           icon:"✏️" },
            { id:"spending",   label:"Spending",             icon:"📊", show: event.status === "completed" },
          ].filter(t => t.show !== false).map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                activeTab===tab.id
                  ? "border-green-500 text-green-600 bg-green-50/50"
                  : "border-transparent text-stone-500 hover:text-stone-700 hover:bg-stone-50"
              }`}>
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${activeTab===tab.id ? "bg-green-100 text-green-700" : "bg-stone-100 text-stone-500"}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="p-6">
          {/* ── Confirmed Volunteers ── */}
          {activeTab === "volunteers" && (
            <VolunteerTable
              volunteers={confirmed}
              eventId={id}
              onRemove={handleRemoveVolunteer}
              showAttended
            />
          )}

          {/* ── Waitlist ── */}
          {activeTab === "waitlist" && (
            <VolunteerTable
              volunteers={waitlist}
              eventId={id}
              onRemove={handleRemoveVolunteer}
              isWaitlist
            />
          )}

          {/* ── Donations ── */}
          {activeTab === "donations" && (
            <DonationsTab
              donations={donations}
              totalDonated={stats.totalDonated}
              fundGoal={event.fundGoal}
            />
          )}
          {console.log(donations)}

          {/* ── Edit Event ── */}
          {activeTab === "edit" && (
            <EditEventForm event={event} onSaved={fetchData} token={token} />
          )}

          {/* ── Spending breakdown ── */}
          {activeTab === "spending" && (
            <SpendingTab
              eventId={id}
              fundRaised={event.fundRaised}
              spendingBreakdown={event.spendingBreakdown}
              onSaved={fetchData}
              token={token}
            />
          )}
        </div>
      </div>
    </Shell>
  );
}

/* ═══════════════════════════════════════
   VOLUNTEER TABLE (confirmed + waitlist)
═══════════════════════════════════════ */
function VolunteerTable({ volunteers, eventId, onRemove, showAttended, isWaitlist }) {
  const [search,   setSearch]   = useState("");
  const [expanded, setExpanded] = useState(null);

  const filtered = volunteers.filter((v) => {
    const q = search.toLowerCase();
    return v.name?.toLowerCase().includes(q) || v.email?.toLowerCase().includes(q) || v.institution?.toLowerCase().includes(q);
  });

  console.log(filtered)

  const exportCSV = () => {
    const rows = [
      ["#","Name","Email","Phone","Institution","Age","Skills","Role","Payment","Attended","Registered"],
      ...filtered.map((v, i) => [
        isWaitlist ? v.waitlistPosition : i+1,
        v.name, v.email, v.phone, v.institution||"", v.ageGroup,
        v.skills?.join("|")||"", v.role, v.paymentStatus,
        v.attended?"Yes":"No",
        format(new Date(v.createdAt),"dd/MM/yyyy HH:mm"),
      ]),
    ];
    const csv  = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type:"text/csv" });
    const a    = document.createElement("a");
    a.href     = URL.createObjectURL(blob);
    a.download = `${isWaitlist?"waitlist":"volunteers"}-${eventId}.csv`;
    a.click();
    toast.success("CSV exported!");
  };

  if (volunteers.length === 0) return (
    <div className="text-center py-16 text-stone-400">
      <div className="text-4xl mb-3">{isWaitlist ? "⏳" : "🙋"}</div>
      <p className="text-sm">{isWaitlist ? "No one on waitlist" : "No confirmed volunteers yet"}</p>
    </div>
  );

  return (
    <div>
      {/* Controls */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, institution..."
          className="flex-1 min-w-50 px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-100" />
        <button onClick={exportCSV}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-200 text-stone-700 text-sm font-medium hover:bg-stone-50 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          Export CSV
        </button>
        <span className="text-xs text-stone-400">{filtered.length} shown</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-stone-100">
        <table className="w-full">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-100">
              {isWaitlist && <Th>#</Th>}
              <Th>Volunteer</Th>
              <Th>Contact</Th>
              <Th>Institution</Th>
              <Th>Skills</Th>
              {!isWaitlist && <Th>Payment</Th>}
              {showAttended && <Th>Attended</Th>}
              <Th>Joined</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {filtered.map((v) => (
              <>
                <tr key={v._id} className="hover:bg-stone-50/60 transition-colors">
                  {isWaitlist && (
                    <Td>
                      <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center">
                        {v.waitlistPosition}
                      </span>
                    </Td>
                  )}
                  <Td>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs shrink-0 overflow-hidden">
                        {v.userPhoto
                          ? <img src={v.userPhoto} alt={v.name} className="w-full h-full object-cover rounded-full" />
                          : v.name?.[0]?.toUpperCase()
                        }
                      </div>
                      <div>
                        <p className="font-medium text-stone-800 text-sm">{v.name}</p>
                        <p className="text-xs text-stone-400 capitalize">{v.role} · {v.ageGroup}</p>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <p className="text-xs text-stone-700">{v.email}</p>
                    <p className="text-xs text-stone-400">{v.phone}</p>
                  </Td>
                  <Td>
                    <p className="text-xs text-stone-700">{v.institution || "—"}</p>
                  </Td>
                  <Td>
                    <div className="flex flex-wrap gap-1">
                      {v.skills?.length > 0
                        ? v.skills.slice(0,3).map((s) => (
                          <span key={s} className="text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded font-medium">{s}</span>
                        ))
                        : <span className="text-xs text-stone-300">—</span>}
                      {v.skills?.length > 3 && <span className="text-[10px] text-stone-400">+{v.skills.length-3}</span>}
                    </div>
                  </Td>
                  {!isWaitlist && (
                    <Td>
                      <PaymentBadge status={v.paymentStatus} />
                    </Td>
                  )}
                  {showAttended && (
                    <Td>
                      {v.attended ? (
                        <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                          ✅ Yes
                        </span>
                      ) : (
                        <span className="text-xs text-stone-300">—</span>
                      )}
                    </Td>
                  )}
                  <Td>
                    <p className="text-xs text-stone-500">{format(new Date(v.createdAt),"dd MMM")}</p>
                    <p className="text-[10px] text-stone-400">{formatDistanceToNow(new Date(v.createdAt), { addSuffix:true })}</p>
                  </Td>
                  <Td>
                    <div className="flex gap-1">
                      <button onClick={() => setExpanded(expanded===v._id ? null : v._id)}
                        title="View QR" className="w-7 h-7 flex items-center justify-center rounded-lg text-stone-400 hover:bg-blue-50 hover:text-blue-600 transition-all text-sm">
                        📱
                      </button>
                      <button onClick={() => onRemove(v._id, v.name)}
                        title="Remove" className="w-7 h-7 flex items-center justify-center rounded-lg text-stone-400 hover:bg-red-50 hover:text-red-500 transition-all text-sm">
                        🗑️
                      </button>
                    </div>
                  </Td>
                </tr>
                {/* Expanded QR row */}
                {expanded === v._id && !isWaitlist && (
                  <tr key={`${v._id}-expanded`} className="bg-blue-50/30">
                    <td colSpan={99} className="px-6 py-4">
                      <div className="flex items-center gap-6 flex-wrap">
                        <div className="bg-white rounded-2xl p-3 border border-stone-200 shadow-sm">
                          <QRCodeCanvas value={v.qrToken} size={100} level="M" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">QR Token</p>
                          <code className="text-xs font-mono bg-stone-100 px-2 py-1 rounded text-stone-600 break-all block max-w-xs">
                            {v.qrToken}
                          </code>
                          <p className="text-xs text-stone-400 mt-1">Used for attendance check-in at the event</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   DONATIONS TAB
═══════════════════════════════════════ */
function DonationsTab({ donations, totalDonated, fundGoal }) {
  const fundPercent = fundGoal > 0 ? Math.min(100, Math.round((totalDonated / fundGoal) * 100)) : 0;

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="bg-linear-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-100">
        <div className="flex justify-between items-end mb-3">
          <div>
            <p className="text-2xl font-bold text-emerald-700">৳{(totalDonated||0).toLocaleString()}</p>
            <p className="text-xs text-emerald-600">{donations.length} donations · Goal: ৳{fundGoal.toLocaleString()}</p>
          </div>
          <p className="text-3xl font-bold text-emerald-200">{fundPercent}%</p>
        </div>
        <div className="h-3 bg-emerald-100 rounded-full overflow-hidden">
          <div className="h-full bg-linear-to-r from-emerald-400 to-teal-500 rounded-full" style={{ width:`${fundPercent}%` }} />
        </div>
      </div>

      {/* Donor table */}
      {donations.length === 0 ? (
        <div className="text-center py-12 text-stone-400 text-sm">No donations yet</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-stone-100">
          <table className="w-full">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100">
                <Th>Donor</Th>
                <Th>Email</Th>
                <Th>Amount</Th>
                <Th>Anonymous</Th>
                <Th>Date</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {donations.map((d) => (
                <tr key={d._id} className="hover:bg-stone-50/50">
                  <Td>
                    <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs overflow-hidden">
                      {d.anonymous
                        ? "?"
                        : d.userPhoto
                          ? <img src={d.userPhoto} alt={d.donorName} className="w-full h-full object-cover rounded-full" />
                          : d.donorName?.[0]?.toUpperCase()
                      }
                    </div>
                      <span className="text-sm font-medium text-stone-800">
                        {d.anonymous ? "Anonymous" : d.donorName}
                      </span>
                    </div>
                  </Td>
                  <Td><span className="text-xs text-stone-500">{d.anonymous ? "—" : (d.donorEmail || "—")}</span></Td>
                  <Td><span className="font-bold text-emerald-700 text-sm">৳{d.amount.toLocaleString()}</span></Td>
                  <Td>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${d.anonymous ? "bg-stone-100 text-stone-600" : "bg-green-100 text-green-700"}`}>
                      {d.anonymous ? "Yes" : "No"}
                    </span>
                  </Td>
                  <Td><span className="text-xs text-stone-500">{format(new Date(d.createdAt),"dd MMM yyyy, h:mm a")}</span></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   EDIT EVENT FORM (inline) — Full Width
═══════════════════════════════════════ */
function EditEventForm({ event, onSaved, token }) {
  const [form, setForm] = useState({
    title:              event.title || "",
    description:        event.description || "",
    date:               event.date ? new Date(event.date).toISOString().slice(0, 16) : "",
    endDate:            event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : "",
    address:            event.location?.address || "",
    organizerContact:   event.organizerContact || "",
    maxVolunteers:      event.maxVolunteers || 50,
    registrationFee:    event.registrationFee || 0,
    fundGoal:           event.fundGoal || 0,
    isTshirt:           event.isTshirt || false,
    isGuestUnlimited:   event.isGuestUnlimited || false,
    guestNumber:        event.guestNumber || 0,
    equipmentList:      (event.equipmentList || []).join(", "),
    coverImage:         event.coverImage || "",
    pinnedAnnouncement: event.pinnedAnnouncement || "",
  });
  const [saving, setSaving] = useState(false);
  const setF = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/admin/events/${event._id}`,
        {
          title:              form.title,
          description:        form.description,
          date:               form.date,
          endDate:            form.endDate || null,
          maxVolunteers:      Number(form.maxVolunteers),
          registrationFee:    Number(form.registrationFee),
          fundGoal:           Number(form.fundGoal),
          isTshirt:           form.isTshirt,
          isGuestUnlimited:   form.isGuestUnlimited,
          guestNumber:        Number(form.guestNumber),
          equipmentList:      form.equipmentList.split(",").map(s => s.trim()).filter(Boolean),
          organizerContact:   form.organizerContact,
          coverImage:         form.coverImage,
          pinnedAnnouncement: form.pinnedAnnouncement,
          location:           { ...event.location, address: form.address },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Event updated!");
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full space-y-4">

      {/* ── Row 1: Basic Info + Schedule + Capacity (3 cols) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Basic Info */}
        <EditSection icon="📋" title="Basic Information" subtitle="Public event details">
          <div className="space-y-3">
            <EField label="Event Title">
              <input type="text" value={form.title}
                onChange={(e) => setF("title", e.target.value)}
                className={ei()} placeholder="e.g. River Cleanup Drive" />
            </EField>
            <EField label="Location / Address">
              <input type="text" value={form.address}
                onChange={(e) => setF("address", e.target.value)}
                className={ei()} placeholder="e.g. Sadarghat, Dhaka" />
            </EField>
            <EField label="Organizer Contact">
              <input type="text" value={form.organizerContact}
                onChange={(e) => setF("organizerContact", e.target.value)}
                className={ei()} placeholder="Phone or email" />
            </EField>
          </div>
        </EditSection>

        {/* Schedule */}
        <EditSection icon="🗓️" title="Schedule" subtitle="Start and end time">
          <div className="space-y-3">
            <EField label="Start Date & Time">
              <input type="datetime-local" value={form.date}
                onChange={(e) => setF("date", e.target.value)} className={ei()} />
            </EField>
            <EField label="End Date & Time">
              <input type="datetime-local" value={form.endDate}
                onChange={(e) => setF("endDate", e.target.value)} className={ei()} />
            </EField>
            <EField label="Cover Image URL">
              <input type="url" value={form.coverImage}
                onChange={(e) => setF("coverImage", e.target.value)}
                className={ei()} placeholder="https://..." />
            </EField>
          </div>
        </EditSection>

        {/* Capacity & Fees */}
        <EditSection icon="⚙️" title="Capacity & Fees" subtitle="Slots and financial config">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <EField label="Max Volunteers">
                <input type="number" min={1} value={form.maxVolunteers}
                  onChange={(e) => setF("maxVolunteers", e.target.value)} className={ei()} />
              </EField>
              <EField label="Guest Slots">
                <input type="number" min={0} value={form.guestNumber}
                  onChange={(e) => setF("guestNumber", e.target.value)}
                  disabled={form.isGuestUnlimited} className={`${ei()} disabled:opacity-50`} />
              </EField>
              <EField label="Reg. Fee (৳)">
                <input type="number" min={0} value={form.registrationFee}
                  onChange={(e) => setF("registrationFee", e.target.value)} className={ei()} />
                {Number(form.registrationFee) === 0 && (
                  <p className="text-[10px] text-emerald-600 mt-1">✓ Free event</p>
                )}
              </EField>
              <EField label="Donation Goal (৳)">
                <input type="number" min={0} value={form.fundGoal}
                  onChange={(e) => setF("fundGoal", e.target.value)} className={ei()} />
                {Number(form.fundGoal) === 0 && (
                  <p className="text-[10px] text-stone-400 mt-1">0 = hide tab</p>
                )}
              </EField>
            </div>
            <div className="flex flex-col gap-2">
              <Toggle label="T-Shirt Registration" desc="Ask for shirt size"
                checked={form.isTshirt} onChange={(v) => setF("isTshirt", v)} />
              <Toggle label="Unlimited Guests" desc="Remove guest cap"
                checked={form.isGuestUnlimited} onChange={(v) => setF("isGuestUnlimited", v)} />
            </div>
          </div>
        </EditSection>
      </div>

      {/* ── Row 2: Cover preview + Equipment + Announcement (3 cols) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Cover preview */}
        <EditSection icon="🖼️" title="Cover Preview" subtitle="Banner image">
          {form.coverImage ? (
            <div className="relative rounded-xl overflow-hidden border border-stone-200 h-36 bg-stone-100">
              <img src={form.coverImage} alt="Cover"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = "none"; }} />
              <span className="absolute bottom-2 right-2 bg-black/40 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">
                Preview
              </span>
            </div>
          ) : (
            <div className="h-36 rounded-xl border-2 border-dashed border-stone-200 flex flex-col items-center justify-center text-stone-300 gap-2">
              <span className="text-3xl">🖼️</span>
              <span className="text-xs">No image URL set</span>
            </div>
          )}
        </EditSection>

        {/* Equipment */}
        <EditSection icon="🎒" title="Equipment List" subtitle="Comma separated items">
          <EField label="Items volunteers should bring">
            <textarea value={form.equipmentList}
              onChange={(e) => setF("equipmentList", e.target.value)}
              rows={3} className={ei()}
              placeholder="e.g. gloves, water bottle, comfortable shoes" />
          </EField>
          {form.equipmentList && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {form.equipmentList.split(",").map(s => s.trim()).filter(Boolean).map((item, i) => (
                <span key={i} className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-medium">
                  {item}
                </span>
              ))}
            </div>
          )}
        </EditSection>

        {/* Pinned Announcement */}
        <EditSection icon="📌" title="Pinned Announcement" subtitle="Highlighted banner on event page">
          <EField label="Announcement text">
            <textarea value={form.pinnedAnnouncement}
              onChange={(e) => setF("pinnedAnnouncement", e.target.value)}
              rows={3} className={ei()}
              placeholder="e.g. Bring your own gloves. Meet at Gate 2." />
          </EField>
          <p className="text-[10px] text-amber-600 mt-2 font-medium">
            ⚠️ Leave empty to hide the banner
          </p>
        </EditSection>
      </div>

      {/* ── Row 3: Description (full width) ── */}
      <EditSection icon="📝" title="Description" subtitle="Full event description shown to volunteers">
        <textarea value={form.description}
          onChange={(e) => setF("description", e.target.value)}
          rows={5} className={ei()}
          placeholder="Describe the event goals, schedule, what volunteers should expect..." />
      </EditSection>

      {/* ── Save bar ── */}
      <div className="flex items-center justify-between py-3 border-t border-stone-100">
        <p className="text-xs text-stone-400">
          Last updated: {format(new Date(event.updatedAt || event.createdAt), "dd MMM yyyy, h:mm a")}
        </p>
        <button onClick={handleSave} disabled={saving}
          className="px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-2xl text-sm font-semibold transition-colors disabled:opacity-60 flex items-center gap-2 shadow-sm shadow-green-200">
          {saving ? <><Spinner /> Saving...</> : "💾 Save Changes"}
        </button>
      </div>
    </div>
  );
}

/* ── Section wrapper ── */
function EditSection({ icon, title, subtitle, children }) {
  return (
    <div className="rounded-2xl border border-stone-100 overflow-hidden">
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-stone-100 bg-stone-50">
        <span className="text-base">{icon}</span>
        <div>
          <p className="text-sm font-semibold text-stone-800">{title}</p>
          {subtitle && <p className="text-[11px] text-stone-400 leading-tight">{subtitle}</p>}
        </div>
      </div>
      <div className="p-4 bg-white">{children}</div>
    </div>
  );
}

/* ── Toggle ── */
function Toggle({ label, desc, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer bg-stone-50 hover:bg-stone-100 transition-colors px-3 py-2 rounded-xl border border-stone-200">
      <div className="relative shrink-0">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
        <div className={`w-8 h-4 rounded-full transition-colors ${checked ? "bg-green-500" : "bg-stone-300"}`} />
        <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-4" : ""}`} />
      </div>
      <div>
        <p className="text-xs font-semibold text-stone-700">{label}</p>
        <p className="text-[10px] text-stone-400">{desc}</p>
      </div>
    </label>
  );
}

/* ── Section wrapper ── */
function Section({ icon, title, subtitle, children }) {
  return (
    <div className="rounded-2xl border border-stone-100 bg-stone-50/40 overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-stone-100 bg-white">
        <span className="text-lg">{icon}</span>
        <div>
          <p className="text-sm font-semibold text-stone-800">{title}</p>
          {subtitle && <p className="text-[11px] text-stone-400 leading-tight">{subtitle}</p>}
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

/* ═══════════════════════════════════════
   SPENDING TAB (after event completed)
═══════════════════════════════════════ */
function SpendingTab({ eventId, fundRaised, spendingBreakdown, onSaved, token }) {
  const [items,  setItems]  = useState(spendingBreakdown || []);
  const [saving, setSaving] = useState(false);

  const addItem    = ()   => setItems((p) => [...p, { label:"", amount:"" }]);
  const removeItem = (i)  => setItems((p) => p.filter((_,idx) => idx !== i));
  const setItem    = (i, k, v) => setItems((p) => p.map((item, idx) => idx===i ? { ...item, [k]:v } : item));

  const totalSpent = items.reduce((s, i) => s + (Number(i.amount) || 0), 0);
  const remaining  = (fundRaised||0) - totalSpent;

  const handleSave = async () => {
    const valid = items.filter((i) => i.label.trim() && Number(i.amount) > 0);
    if (valid.length !== items.length) { toast.error("All items need a label and amount"); return; }
    setSaving(true);
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/admin/events/${eventId}/spending`,
        { spendingBreakdown: valid.map((i) => ({ label: i.label, amount: Number(i.amount) })) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Spending breakdown saved!");
      onSaved();
    } catch (err) { toast.error(err.response?.data?.message || "Save failed"); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-5 max-w-xl">
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-emerald-700">Total Raised</p>
          <p className="text-xl font-bold text-emerald-800">৳{(fundRaised||0).toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-emerald-700">Remaining</p>
          <p className={`text-xl font-bold ${remaining < 0 ? "text-red-600" : "text-emerald-800"}`}>
            ৳{remaining.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input type="text" value={item.label} onChange={(e) => setItem(i,"label",e.target.value)}
              placeholder="e.g. Gloves & bags" className={`${ei()} flex-1`} />
            <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden bg-white">
              <span className="px-2 text-stone-400 text-sm">৳</span>
              <input type="number" min={0} value={item.amount} onChange={(e) => setItem(i,"amount",e.target.value)}
                placeholder="Amount" className="py-2.5 pr-3 text-sm focus:outline-none w-28" />
            </div>
            <button onClick={() => removeItem(i)}
              className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-red-50 text-stone-400 hover:text-red-500 transition-all">
              ✕
            </button>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <div className="flex justify-between text-sm font-semibold border-t border-stone-200 pt-3">
          <span className="text-stone-600">Total Spent</span>
          <span className="text-stone-800">৳{totalSpent.toLocaleString()}</span>
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={addItem}
          className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-sm font-medium hover:bg-stone-50 transition-colors flex items-center gap-2">
          + Add Item
        </button>
        <button onClick={handleSave} disabled={saving}
          className="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-60 flex items-center gap-2">
          {saving ? <><Spinner/> Saving...</> : "💾 Save Breakdown"}
        </button>
      </div>

      <p className="text-xs text-stone-400">
        This breakdown will be publicly visible to donors on the event page.
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════
   SMALL HELPERS
═══════════════════════════════════════ */
function Shell({ children }) {
  return (
    <div className="min-h-screen bg-[#f5f4f0] py-8 px-4" style={{ fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Fraunces:wght@700&display=swap');`}</style>
      <div className="max-w-7xl mx-auto">{children}</div>
    </div>
  );
}

function StatusPill({ status }) {
  const s = { upcoming:{bg:"bg-green-100",text:"text-green-700"}, ongoing:{bg:"bg-blue-100",text:"text-blue-700"}, completed:{bg:"bg-stone-100",text:"text-stone-600"}, cancelled:{bg:"bg-red-100",text:"text-red-700"}, draft:{bg:"bg-yellow-100",text:"text-yellow-700"} };
  const c = s[status] || s.upcoming;
  return <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${c.bg} ${c.text} capitalize`}>{status==="ongoing"?"🔴 Live":status}</span>;
}

function MiniStat({ label, value, color }) {
  const colors = { green:"bg-green-50 text-green-700", amber:"bg-amber-50 text-amber-700", blue:"bg-blue-50 text-blue-700", purple:"bg-purple-50 text-purple-700", orange:"bg-orange-50 text-orange-700", emerald:"bg-emerald-50 text-emerald-700", stone:"bg-stone-50 text-stone-600" };
  return (
    <div className={`rounded-2xl p-3 text-center ${colors[color]||colors.stone}`}>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-[10px] font-medium opacity-70 mt-0.5 leading-tight">{label}</p>
    </div>
  );
}

function PaymentBadge({ status }) {
  const b = PAYMENT_BADGE[status] || PAYMENT_BADGE["not-required"];
  return <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${b.bg} ${b.text}`}>{b.label}</span>;
}

function EField({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-stone-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function ei() {
  return "w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100";
}

function Th({ children }) {
  return <th className="px-4 py-2.5 text-left text-xs font-semibold text-stone-400 uppercase tracking-wide whitespace-nowrap">{children}</th>;
}
function Td({ children }) {
  return <td className="px-4 py-3 align-top">{children}</td>;
}
function Spinner() {
  return <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>;
}