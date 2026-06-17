import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import { format, formatDistanceToNow } from "date-fns";
import { QRCodeCanvas } from "qrcode.react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import {
  ClipboardList, Calendar, Settings2, Image, Package,
  Pin, FileText, Save, Loader2, Eye, EyeOff, Download, QrCode, Trash2, Clock, Users,
  Ticket, ArrowLeft, Globe, Pencil, ScanQrCode, Radio, CheckCircle2,
  XCircle, Plus, X, Brush, TreeDeciduous, Wrench, Megaphone, ListChecks, Star,
  GraduationCap, Handshake, CalendarDays, Wallet, BarChart2
} from "lucide-react";

/* ─── Constants ─── */
const TYPE_ICON = {
  cleanup:   Brush,
  plantation: TreeDeciduous,
  repair:    Wrench,
  awareness: Megaphone,
  student:   GraduationCap,
  meetup:    Handshake,
};

const STATUS_NEXT = {
  draft:    ["upcoming","cancelled"],
  upcoming: ["ongoing","cancelled"],
  ongoing:  ["completed","cancelled"],
  completed:[], cancelled:[],
};
const PAYMENT_BADGE = {
  "not-required": { bg:"bg-zinc-700", text:"text-white", label:"Free"     },
  "pending":      { bg:"bg-amber-100", text:"text-amber-700", label:"Pending"  },
  "paid":         { bg:"bg-green-100", text:"text-green-700", label:"Paid"     },
  "refunded":     { bg:"bg-blue-100",  text:"text-blue-700",  label:"Refunded" },
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
    const isCancel = newStatus === "cancelled";
    const msg = isCancel
      ? "Cancel event? All paid registrations will be refunded."
      : `Mark event as "${newStatus}"?`;

    toast.info(
      <div className="space-y-2">
        <p className="text-sm font-medium text-stone-800">{msg}</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss();
              setStatusUpdating(true);
              try {
                await axiosSecure.patch(`/admin/events/${id}/status`, { status: newStatus });
                toast.success(`Status → ${newStatus}`);
                fetchData();
              } catch (err) {
                toast.error(err.response?.data?.message || "Failed");
              } finally {
                setStatusUpdating(false);
              }
            }}
            className={`px-3 py-1 rounded-lg text-sm font-semibold text-white transition-colors ${
              isCancel ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {isCancel ? "Yes, Cancel" : "Confirm"}
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="px-3 py-1 rounded-lg text-sm font-semibold bg-zinc-700 hover:bg-stone-200 text-white transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeButton: false,
        closeOnClick: false,
      }
    );
  };

  const handleRemoveVolunteer = async (regId, name) => {
    toast.warn(
      <div className="space-y-2">
        <p className="text-sm font-medium text-stone-800">Remove <span className="font-bold">{name}</span>?</p>
        <p className="text-sm text-black">If they paid, they'll be refunded automatically.</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss();
              try {
                await axios.patch(
                  `${import.meta.env.VITE_API_URL}/admin/events/${id}/volunteer/${regId}/remove`,
                  {}, { headers }
                );
                toast.success(`${name} removed. Waitlist updated.`);
                fetchData();
              } catch (err) {
                toast.error(err.response?.data?.message || "Remove failed");
              }
            }}
            className="px-3 py-1 rounded-lg text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors"
          >
            Yes, Remove
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="px-3 py-1 rounded-lg text-sm font-semibold bg-zinc-700 hover:bg-stone-500 text-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeButton: false,
        closeOnClick: false,
      }
    );
  };

  /* ─── Loading ─── */
  if (loading) return (
    <Shell>
      <div className="animate-pulse space-y-6">

        {/* Header skeleton */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-3">
            <div className="h-3 bg-zinc-800 rounded-full w-20" />
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-zinc-800 rounded-full" />
              <div className="h-7 bg-zinc-800 rounded-xl w-64" />
              <div className="h-6 bg-zinc-800 rounded-full w-20" />
            </div>
            <div className="h-3 bg-zinc-800 rounded-full w-80" />
          </div>
          <div className="flex gap-2">
            <div className="h-9 bg-zinc-800 rounded-xl w-28" />
            <div className="h-9 bg-zinc-800 rounded-xl w-20" />
            <div className="h-9 bg-zinc-800 rounded-xl w-28" />
            <div className="h-9 bg-zinc-800 rounded-xl w-24" />
          </div>
        </div>

        {/* Stats bar skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="bg-zinc-700 rounded-2xl p-3 space-y-2">
              <div className="h-6 bg-zinc-700 rounded-lg w-10 mx-auto" />
              <div className="h-2.5 bg-zinc-700 rounded-full w-14 mx-auto" />
            </div>
          ))}
        </div>

        {/* Tabs + Table skeleton */}
        <div className="bg-zinc-700 rounded-2xl border border-zinc-700 overflow-hidden">
          {/* Tab bar */}
          <div className="flex gap-1 px-4 py-3 border-b border-zinc-700">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-8 bg-zinc-500 rounded-lg w-32" />
            ))}
          </div>

          {/* Table rows */}
          <div className="p-6 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-8 h-8 bg-zinc-500 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-zinc-500 rounded-full w-40" />
                  <div className="h-2.5 bg-zinc-500 rounded-full w-24" />
                </div>
                <div className="h-3 bg-zinc-500 rounded-full w-28" />
                <div className="h-3 bg-zinc-500 rounded-full w-20" />
                <div className="h-6 bg-zinc-500 rounded-full w-16" />
                <div className="h-3 bg-zinc-500 rounded-full w-12" />
                <div className="flex gap-1">
                  <div className="w-7 h-7 bg-zinc-500 rounded-lg" />
                  <div className="w-7 h-7 bg-zinc-500 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );

  if (!data?.event) return (
    <Shell>
      <div className="text-center py-20 text-white">Event not found.</div>
    </Shell>
  );

  const { event, confirmed, waitlist, donations, freeParticipants, stats } = data;
  const available = STATUS_NEXT[event.status] || [];

  return (
    <Shell>
      {/* ── Back + Header ── */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <button onClick={() => navigate("/dashboard/admin/events")}
            className="flex items-center gap-1.5 text-sm text-white hover:text-stone-800 mb-3 transition-colors">
            <ArrowLeft size={15} />
            All Events
          </button>
          <div className="flex items-center gap-3 flex-wrap">
            {(() => { const TIcon = TYPE_ICON[event.eventType]; return TIcon ? <TIcon size={22} className="text-white" /> : <CalendarDays size={22} className="text-white" />; })()}
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily:"Fraunces,serif" }}>
              {event.title}
            </h1>
            <StatusPill status={event.status} />
          </div>
          <p className="text-white text-sm mt-1">
            {format(new Date(event.date), "EEEE, dd MMM yyyy · h:mm a")} · {event.location?.address}
          </p>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <Link to={`/events/${event._id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-stone-200 text-white text-sm font-medium hover:bg-stone-50 transition-colors">
            <Globe size={14} /> Public Page
          </Link>
          <button
            onClick={() => setActiveTab("edit")}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-stone-200 text-white text-sm font-medium hover:bg-stone-50 transition-colors">
            <Pencil size={14} /> Edit
          </button>
          <Link to={`/admin/events/${event._id}/checkin`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors">
            <ScanQrCode size={14} /> QR Check-in
          </Link>
          {available.map((s) => (
            <button key={s} onClick={() => handleStatusChange(s)} disabled={statusUpdating}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 ${
                s==="cancelled" ? "bg-red-50 hover:bg-red-100 text-red-700 border border-red-200"
                : s==="completed" ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
              }`}>
              {statusUpdating ? <Loader2 size={14} className="animate-spin" /> : (
                s==="ongoing" ? <><Radio size={14} /> Go Live</> :
                s==="completed" ? <><CheckCircle2 size={14} /> Complete</> :
                <><XCircle size={14} /> Cancel</>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div className={`grid grid-cols-2 sm:grid-cols-4 ${event.isFreeParticipate ? 'grid-cols-3  sm:grid-cols-5 lg:grid-cols-8' : 'grid-cols-2  sm:grid-cols-4 lg:grid-cols-7'} gap-3 mb-6`}>
        <MiniStat label="Confirmed"    value={stats.confirmedCount} color="green"  />
        <MiniStat label="Waitlisted"   value={stats.waitlistCount}  color="amber"  />
        <MiniStat label="Attended"     value={stats.attendedCount}  color="blue"   />
        <MiniStat label="Paid"         value={stats.paidCount}      color="purple" />
        <MiniStat label="Pmt Pending"  value={stats.pendingPayment} color="orange" />
        <MiniStat label="Donated"      value={`৳${(stats.totalDonated||0).toLocaleString()}`} color="emerald" />
        <MiniStat label="Comments"     value={stats.commentCount}   color="stone"  />
        {event.isFreeParticipate && (
          <MiniStat label="Free Parts." value={stats.freeParticipantCount} color="violet" />
        )}
      </div>

      {/* ── Tabs ── */}
      <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-2xl border border-zinc-800 shadow-sm overflow-hidden">
        <div className="flex border-b border-zinc-700 overflow-x-auto">
        {[
          { id:"volunteers", label:"Confirmed Volunteers", icon:<CheckCircle2 size={18} />, count: stats.confirmedCount },
          { id:"waitlist",   label:"Waitlist",             icon:<Clock size={18} />,        count: stats.waitlistCount  },
          { id:"donations",  label:"Donations",            icon:<Wallet size={18} />,       count: stats.donorCount, show: event.fundGoal > 0 },
          { id:"free",       label:"Free Participants",    icon:<Ticket size={18} />,       count: stats.freeParticipantCount, show: event.isFreeParticipate },
          { id:"edit",       label:"Edit Event",           icon:<Pencil size={18} />        },
          { id:"spending",   label:"Spending",             icon:<BarChart2 size={18} />,    show: event.status === "completed" },
        ].filter(t => t.show !== false).map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3.5 lg:py-5 text-sm lg:text-base font-medium whitespace-nowrap border-b-2 transition-all ${
              activeTab===tab.id
                ? "border-emerald-500 text-emerald-600 bg-zinc-700"
                : "border-transparent text-white hover:text-white mix hover:bg-zinc-800"
            }`}>
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span className={`text-sm font-bold px-1.5 py-0.5 rounded-full ${activeTab===tab.id ? "bg-emerald-100 text-emerald-700" : "bg-zinc-700 text-white"}`}>
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

          {/* ── Free Participants ── */}
          {activeTab === "free" && (
            <FreeParticipantsTab
              participants={freeParticipants}
              eventId={id}
              onRefresh={fetchData}
              axiosSecure={axiosSecure}
            />
          )}

          {/* ── Edit Event ── */}
          {activeTab === "edit" && (
            <EditEventForm event={event} onSaved={fetchData} axiosSecure={axiosSecure} />
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
      <div className="flex justify-center mb-3">
        {isWaitlist
          ? <Clock size={36} className="text-stone-300" />
          : <Users size={36} className="text-stone-300" />
        }
      </div>
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
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-zinc-700 text-white text-sm font-medium hover:bg-stone-50 transition-colors">
          <Download size={14} />
          Export CSV
        </button>
        <span className="text-sm text-white">{filtered.length} shown</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-zinc-700">
        <table className="w-full">
          <thead>
            <tr className="bg-zinc-700 border-b border-zinc-700">
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
                <tr key={v?._id} className="mix hover:bg-zinc-800 transition-colors">
                  {isWaitlist && (
                    <Td>
                      <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-sm font-bold flex items-center justify-center">
                        {v.waitlistPosition}
                      </span>
                    </Td>
                  )}
                  <Td>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm shrink-0 overflow-hidden">
                        {v.userPhoto
                          ? <img src={v.userPhoto} alt={v.name} className="w-full h-full object-cover rounded-full" />
                          : v.name?.[0]?.toUpperCase()
                        }
                      </div>
                      <div>
                        <p className="font-medium text-white text-sm">{v.name}</p>
                        <p className="text-sm text-stone-400 capitalize">{v.role} · {v.ageGroup}</p>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <p className="text-sm text-white">{v.email}</p>
                    <p className="text-sm text-stone-400">{v.phone}</p>
                  </Td>
                  <Td>
                    <p className="text-sm text-white">{v.institution || "—"}</p>
                  </Td>
                  <Td>
                    <div className="flex flex-wrap gap-1">
                      {v.skills?.length > 0
                        ? v.skills.slice(0,3).map((s) => (
                          <span key={s} className="text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded font-medium">{s}</span>
                        ))
                        : <span className="text-sm text-stone-300">—</span>}
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
                        <span className="inline-flex items-center gap-1 text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                          <CheckCircle2 size={11} /> Yes
                        </span>
                      ) : (
                        <span className="text-sm text-stone-300">—</span>
                      )}
                    </Td>
                  )}
                  <Td>
                    <p className="text-sm text-white">{format(new Date(v.createdAt),"dd MMM")}</p>
                    <p className="text-[10px] text-stone-400">{formatDistanceToNow(new Date(v.createdAt), { addSuffix:true })}</p>
                  </Td>
                  <Td>
                    <div className="flex gap-1">
                      <button onClick={() => setExpanded(expanded===v._id ? null : v._id)}
                        title="View QR"
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-white hover:bg-blue-50 hover:text-blue-600 transition-all">
                        <QrCode size={14} />
                      </button>
                      <button onClick={() => onRemove(v._id, v.name)}
                        title="Remove"
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-stone-400 hover:bg-red-50 hover:text-red-500 transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </Td>
                </tr>

                {/* Expanded QR row */}
                {expanded === v._id && !isWaitlist && (
                  <tr key={`${v._id}-expanded`} className="bg-zinc-700">
                    <td colSpan={99} className="px-6 py-4">
                      <div className="flex items-center gap-6 flex-wrap">
                        <div className="bg-white rounded-2xl p-3 border border-zinc-800 shadow-sm">
                          <QRCodeCanvas value={v.qrToken} size={100} level="M" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-white uppercase tracking-wide">QR Token</p>
                          <code className="text-sm font-mono bg-transparent px-2 py-1 rounded text-white break-all block max-w-xs">
                            {v.qrToken}
                          </code>
                          <p className="text-sm text-stone-400 mt-1">Used for attendance check-in at the event</p>
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
            <p className="text-sm text-emerald-600">{donations.length} donations · Goal: ৳{fundGoal.toLocaleString()}</p>
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
        <div className="overflow-x-auto rounded-2xl border border-zinc-700">
          <table className="w-full">
            <thead>
              <tr className="bg-stone-50 border-b border-zinc-700">
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
                    <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm overflow-hidden">
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
                  <Td><span className="text-sm text-white">{d.anonymous ? "—" : (d.donorEmail || "—")}</span></Td>
                  <Td><span className="font-bold text-emerald-700 text-sm">৳{d.amount.toLocaleString()}</span></Td>
                  <Td>
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${d.anonymous ? "bg-zinc-700 text-stone-600" : "bg-green-100 text-green-700"}`}>
                      {d.anonymous ? "Yes" : "No"}
                    </span>
                  </Td>
                  <Td><span className="text-sm text-white">{format(new Date(d.createdAt),"dd MMM yyyy, h:mm a")}</span></Td>
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
   FREE PARTICIPANTS TAB
═══════════════════════════════════════ */
function FreeParticipantsTab({ participants, eventId, onRefresh, axiosSecure }) {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);

  const token   = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const filtered = participants.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.name?.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q) ||
      p.phone?.includes(q)
    );
  });

  const handleRemove = (participantId, name) => {
    toast.warn(
      <div className="space-y-2">
        <p className="text-sm font-medium text-stone-800">Remove <span className="font-bold">{name}</span>?</p>
        <p className="text-sm text-white">This free participant will be permanently removed.</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss();
              try {
                await axiosSecure.delete(
                  `/admin/events/${eventId}/free-participant/${participantId}`);
                toast.success(`${name} removed.`);
                onRefresh();
              } catch (err) {
                console.log(err)
                toast.error(err.response?.data?.message || "Remove failed");
              }
            }}
            className="px-3 py-1 rounded-lg text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors"
          >
            Yes, Remove
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="px-3 py-1 rounded-lg text-sm font-semibold bg-gray-700 text-white hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>,
      { autoClose: false, closeButton: false, closeOnClick: false }
    );
  };

  const exportCSV = () => {
    const rows = [
      ["#", "Name", "Email", "Phone", "Attended", "Registered"],
      ...filtered.map((p, i) => [
        i + 1, p.name, p.email, p.phone,
        p.attended ? "Yes" : "No",
        format(new Date(p.createdAt), "dd/MM/yyyy HH:mm"),
      ]),
    ];
    const csv  = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a    = document.createElement("a");
    a.href     = URL.createObjectURL(blob);
    a.download = `free-participants-${eventId}.csv`;
    a.click();
    toast.success("CSV exported!");
  };

  if (participants.length === 0) return (
    <div className="text-center py-16 text-stone-400">
      <div className="flex justify-center mb-3">
        <Ticket size={36} className="text-stone-300" />
      </div>
      <p className="text-sm">No free participants yet</p>
    </div>
  );

  return (
    <div>
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <input type="text" value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, phone..."
          className="flex-1 min-w-50 px-3 py-2 rounded-xl border border-zinc-700 text-sm focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-100" />
        <button onClick={exportCSV}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-zinc-700 text-white text-sm font-medium hover:mix transition-colors">
          <Download size={14} />
          Export CSV
        </button>
        <span className="text-sm text-white">{filtered.length} shown</span>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-zinc-700">
        <table className="w-full">
          <thead>
            <tr className="mix border-b border-zinc-700">
              <Th>#</Th>
              <Th>Name</Th>
              <Th>Contact</Th>
              <Th>Attended</Th>
              <Th>Registered</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {filtered.map((p, i) => (
              <>
                <tr key={p._id} className="mix hover:bg-zinc-800 transition-colors">
                  <Td>
                    <span className="w-6 h-6 rounded-full bg-zinc-700 text-white text-sm font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-sm shrink-0">
                        {p.name?.[0]?.toUpperCase()}
                      </div>
                      <p className="text-sm font-medium text-white">{p.name}</p>
                    </div>
                  </Td>
                  <Td>
                    <p className="text-sm text-white">{p.email}</p>
                    <p className="text-sm text-stone-400">{p.phone}</p>
                  </Td>
                  <Td>
                    {p.attended ? (
                      <span className="inline-flex items-center gap-1 text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                        <CheckCircle2 size={11} /> Yes
                      </span>
                    ) : (
                      <span className="text-sm text-stone-300">—</span>
                    )}
                  </Td>
                  <Td>
                    <p className="text-sm text-white">{format(new Date(p.createdAt), "dd MMM")}</p>
                    <p className="text-[10px] text-stone-400">{formatDistanceToNow(new Date(p.createdAt), { addSuffix: true })}</p>
                  </Td>
                  <Td>
                    <div className="flex gap-1">
                      <button onClick={() => setExpanded(expanded === p._id ? null : p._id)}
                        title="View QR"
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-white hover:bg-white hover:text-blue-600 transition-all">
                        <QrCode size={14} />
                      </button>
                      <button onClick={() => handleRemove(p._id, p.name)}
                        title="Remove"
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-stone-400 hover:bg-red-50 hover:text-red-500 transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </Td>
                </tr>

                {expanded === p._id && (
                  <tr key={`${p._id}-expanded`} className="bg-zinc-800">
                    <td colSpan={99} className="px-6 py-4">
                      <div className="flex items-center gap-6 flex-wrap">
                        <div className="bg-white rounded-2xl p-3 border border-zinc-800 shadow-sm">
                          <QRCodeCanvas value={p.qrToken} size={100} level="M" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-white uppercase tracking-wide">QR Token</p>
                          <code className="text-sm font-mono bg-zinc-700 px-2 py-1 rounded text-white break-all block max-w-xs">
                            {p.qrToken}
                          </code>
                          <p className="text-sm text-stone-400 mt-1">Used for attendance check-in at the event</p>
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
   EDIT EVENT FORM (inline) — Full Width
═══════════════════════════════════════ */
function EditEventForm({ event, onSaved, axiosSecure }) {
  const toLocalInput = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const offset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - offset).toISOString().slice(0, 16);
  }

  const [form, setForm] = useState({
    title:              event.title || "",
    description:        event.description || "",
    date:               toLocalInput(event.date),
    endDate:            toLocalInput(event.endDate),
    address:            event.location?.address || "",
    organizerContact:   event.organizerContact || "",
    maxVolunteers:      event.maxVolunteers || 50,
    registrationFee:    event.registrationFee || 0,
    fundGoal:           event.fundGoal || 0,
    isTshirt:           event.isTshirt || false,
    isGuestUnlimited:   event.isGuestUnlimited || false,
    guestNumber:        event.guestNumber || 0,
    isFreeParticipate:  event.isFreeParticipate || false,
    maxFreeParticipate: event.maxFreeParticipate || 0,
    equipmentList:      (event.equipmentList || []).join(", "),
    coverImage:         event.coverImage || "",
    pinnedAnnouncement: event.pinnedAnnouncement || "",
    hasEventLogs:     event.hasEventLogs     || false,
    eventLogs:        event.eventLogs        || [],
    hasSpecialGuests: event.hasSpecialGuests || false,
    specialGuests:    event.specialGuests    || [],
  });
  const [saving, setSaving] = useState(false);
  const setF = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await axiosSecure.patch(
        `/admin/events/${event._id}`,
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
          isFreeParticipate:  form.isFreeParticipate,
          maxFreeParticipate: Number(form.maxFreeParticipate),
          equipmentList:      form.equipmentList.split(",").map(s => s.trim()).filter(Boolean),
          organizerContact:   form.organizerContact,
          coverImage:         form.coverImage,
          pinnedAnnouncement: form.pinnedAnnouncement,
          location:           { ...event.location, address: form.address },
          hasEventLogs:     form.hasEventLogs,
          eventLogs:        form.eventLogs,
          hasSpecialGuests: form.hasSpecialGuests,
          specialGuests:    form.specialGuests,
        }
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

      {/* ── Row 1: Basic Info + Schedule + Capacity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <EditSection icon={ClipboardList} title="Basic Information" subtitle="Public event details">
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

        <EditSection icon={Calendar} title="Schedule" subtitle="Start and end time">
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

        <EditSection icon={Settings2} title="Capacity & Fees" subtitle="Slots and financial config">
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
                  <p className="text-[10px] text-emerald-600 mt-1">Free event</p>
                )}
              </EField>
              <EField label="Donation Goal (৳)">
                <input type="number" min={0} value={form.fundGoal}
                  onChange={(e) => setF("fundGoal", e.target.value)} className={ei()} />
                {Number(form.fundGoal) === 0 && (
                  <p className="text-[10px] text-stone-400 mt-1">0 = hide tab</p>
                )}
              </EField>
              <EField label="Max Free Participants">
                <input type="number" min={0} value={form.maxFreeParticipate}
                  onChange={(e) => setF("maxFreeParticipate", e.target.value)}
                  disabled={!form.isFreeParticipate} className={`${ei()} disabled:opacity-50`} />
                {form.isFreeParticipate && Number(form.maxFreeParticipate) === 0 && (
                  <p className="text-[10px] text-emerald-600 mt-1">0 = unlimited</p>
                )}
              </EField>
            </div>

            <div className="flex flex-col gap-2">
              <Toggle label="T-Shirt Registration" desc="Ask for shirt size"
                checked={form.isTshirt} onChange={(v) => setF("isTshirt", v)} />
              <Toggle label="Unlimited Guests" desc="Remove guest cap"
                checked={form.isGuestUnlimited} onChange={(v) => setF("isGuestUnlimited", v)} />
              <Toggle label="Free Participation" desc="Anyone can join without login"
                checked={form.isFreeParticipate} onChange={(v) => setF("isFreeParticipate", v)} />
            </div>
          </div>
        </EditSection>
      </div>

      {/* ── Row 2: Cover preview + Equipment + Announcement ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <EditSection icon={Image} title="Cover Preview" subtitle="Banner image">
          {form.coverImage ? (
            <div className="relative rounded-xl overflow-hidden border border-zinc-700 h-36 bg-zinc-700">
              <img src={form.coverImage} alt="Cover"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = "none"; }} />
              <span className="absolute bottom-2 right-2 bg-zinc-800 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm flex items-center gap-1">
                <Eye size={10} /> Preview
              </span>
            </div>
          ) : (
            <div className="h-36 rounded-xl border-2 border-dashed border-zinc-700 flex flex-col items-center justify-center gap-2">
              <EyeOff size={28} />
              <span className="text-sm">No image URL set</span>
            </div>
          )}
        </EditSection>

        <EditSection icon={Package} title="Equipment List" subtitle="Comma separated items">
          <EField label="Items volunteers should bring">
            <textarea value={form.equipmentList}
              onChange={(e) => setF("equipmentList", e.target.value)}
              rows={3} className={ei()}
              placeholder="e.g. gloves, water bottle, comfortable shoes" />
          </EField>
          {form.equipmentList && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {form.equipmentList.split(",").map(s => s.trim()).filter(Boolean).map((item, i) => (
                <span key={i} className="text-[10px] bg-zinc-700 text-white px-2 py-0.5 rounded-full font-medium">
                  {item}
                </span>
              ))}
            </div>
          )}
        </EditSection>

        <EditSection icon={Pin} title="Pinned Announcement" subtitle="Highlighted banner on event page">
          <EField label="Announcement text">
            <textarea value={form.pinnedAnnouncement}
              onChange={(e) => setF("pinnedAnnouncement", e.target.value)}
              rows={3} className={ei()}
              placeholder="e.g. Bring your own gloves. Meet at Gate 2." />
          </EField>
          <p className="text-[10px] text-amber-600 mt-2 font-medium">
            Leave empty to hide the banner
          </p>
        </EditSection>
      </div>

      {/* ── Row 3: Description ── */}
      <EditSection icon={FileText} title="Description" subtitle="Full event description shown to volunteers">
        <textarea value={form.description}
          onChange={(e) => setF("description", e.target.value)}
          rows={5} className={ei()}
          placeholder="Describe the event goals, schedule, what volunteers should expect..." />
      </EditSection>

      {/* ── Row 4: Event Logs + Special Guests ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Event Logs */}
        <EditSection icon={ListChecks} title="Event Timeline / Logs" subtitle="Schedule of what happens during the event">
          <div className="space-y-3">
            <Toggle
              label="Enable Event Timeline"
              desc="Show a timeline of activities on the event page"
              checked={form.hasEventLogs}
              onChange={(v) => setF("hasEventLogs", v)}
            />

            {form.hasEventLogs && (
              <div className="space-y-2 mt-2 text-black">
                {form.eventLogs.map((log, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <div className="flex flex-col gap-1.5 flex-1">
                      <input
                        type="time"
                        value={log.time || ""}
                        onChange={(e) => {
                          const updated = [...form.eventLogs];
                          updated[i] = { ...updated[i], time: e.target.value };
                          setF("eventLogs", updated);
                        }}
                        className={ei()}
                      />
                      <input
                        type="text"
                        value={log.title || ""}
                        placeholder="e.g. Opening Ceremony"
                        onChange={(e) => {
                          const updated = [...form.eventLogs];
                          updated[i] = { ...updated[i], title: e.target.value };
                          setF("eventLogs", updated);
                        }}
                        className={ei()}
                      />
                      <input
                        type="text"
                        value={log.description || ""}
                        placeholder="Short description (optional)"
                        onChange={(e) => {
                          const updated = [...form.eventLogs];
                          updated[i] = { ...updated[i], description: e.target.value };
                          setF("eventLogs", updated);
                        }}
                        className={ei()}
                      />
                    </div>
                    <button
                      onClick={() => setF("eventLogs", form.eventLogs.filter((_, idx) => idx !== i))}
                      className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-zinc-800 text-stone-400 hover:text-red-500 transition-all mt-1 shrink-0">
                      <X size={14} />
                    </button>
                  </div>
                ))}

                {/* ── Add + Remove All ── */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setF("eventLogs", [...form.eventLogs, { time: "", title: "", description: "" }])}
                    className="flex-1 flex items-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-zinc-800 text-white text-sm font-medium mix hover:bg-white hover:text-black transition-colors justify-center">
                    <Plus size={13} /> Add Timeline Entry
                  </button>
                  {form.eventLogs.length > 0 && (
                    <button
                      onClick={() => setF("eventLogs", [])}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-red-200 text-red-400 text-sm font-medium hover:bg-red-50 transition-colors justify-center shrink-0">
                      <Trash2 size={13} /> Remove All
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </EditSection>

        {/* Special Guests */}
        <EditSection icon={Star} title="Special Guests" subtitle="Notable attendees or speakers">
          <div className="space-y-3">
            <Toggle
              label="Enable Special Guests"
              desc="Show guest profiles on the event page"
              checked={form.hasSpecialGuests}
              onChange={(v) => setF("hasSpecialGuests", v)}
            />

            {form.hasSpecialGuests && (
              <div className="space-y-3 mt-2">
                {form.specialGuests.map((guest, i) => (
                  <div key={i} className="bg-stone-50 rounded-xl p-3 space-y-2">

                    {/* Remove button */}
                    <div className="flex justify-end">
                      <button
                        onClick={() => setF("specialGuests", form.specialGuests.filter((_, idx) => idx !== i))}
                        className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-red-50 text-stone-300 hover:text-red-500 transition-all">
                        <X size={12} />
                      </button>
                    </div>

                    <input type="text" value={guest.name || ""} placeholder="Guest name *"
                      onChange={(e) => {
                        const updated = [...form.specialGuests];
                        updated[i] = { ...updated[i], name: e.target.value };
                        setF("specialGuests", updated);
                      }}
                      className={ei()} />
                    <input type="text" value={guest.designation || ""} placeholder="Designation / Title"
                      onChange={(e) => {
                        const updated = [...form.specialGuests];
                        updated[i] = { ...updated[i], designation: e.target.value };
                        setF("specialGuests", updated);
                      }}
                      className={ei()} />
                    <input type="text" value={guest.organization || ""} placeholder="Organization / Institution"
                      onChange={(e) => {
                        const updated = [...form.specialGuests];
                        updated[i] = { ...updated[i], organization: e.target.value };
                        setF("specialGuests", updated);
                      }}
                      className={ei()} />
                    <input type="url" value={guest.photo || ""} placeholder="Photo URL (optional)"
                      onChange={(e) => {
                        const updated = [...form.specialGuests];
                        updated[i] = { ...updated[i], photo: e.target.value };
                        setF("specialGuests", updated);
                      }}
                      className={ei()} />
                    <label className="flex items-center gap-2 cursor-pointer">
                      <div className="relative shrink-0">
                        <input type="checkbox" checked={guest.isMainGuest || false}
                          onChange={(e) => {
                            const updated = [...form.specialGuests];
                            updated[i] = { ...updated[i], isMainGuest: e.target.checked };
                            setF("specialGuests", updated);
                          }}
                          className="sr-only" />
                        <div className={`w-8 h-4 rounded-full transition-colors ${guest.isMainGuest ? "bg-amber-500" : "bg-stone-300"}`} />
                        <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${guest.isMainGuest ? "translate-x-4" : ""}`} />
                      </div>
                      <span className="text-sm font-medium text-stone-600">Chief / Main Guest</span>
                    </label>
                  </div>
                ))}

                {/* ── Add + Remove All ── */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setF("specialGuests", [...form.specialGuests, { name: "", designation: "", organization: "", photo: "", isMainGuest: false }])}
                    className="flex-1 flex items-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-stone-300 text-white text-sm font-medium hover:bg-stone-50 transition-colors justify-center">
                    <Plus size={13} /> Add Guest
                  </button>
                  {form.specialGuests.length > 0 && (
                    <button
                      onClick={() => setF("specialGuests", [])}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-red-200 text-red-400 text-sm font-medium hover:bg-red-50 transition-colors justify-center shrink-0">
                      <Trash2 size={14} /> Remove All
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </EditSection>
      </div>

      {/* ── Save bar ── */}
      <div className="flex items-center justify-between py-3 border-t border-zinc-700">
        <p className="text-sm text-stone-400">
          Last updated: {format(new Date(event.updatedAt || event.createdAt), "dd MMM yyyy, h:mm a")}
        </p>
        <button onClick={handleSave} disabled={saving}
          className="px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-2xl text-sm font-semibold transition-colors disabled:opacity-60 flex items-center gap-2 shadow-sm shadow-green-200">
          {saving
            ? <><Loader2 size={14} className="animate-spin" /> Saving...</>
            : <><Save size={14} /> Save Changes</>
          }
        </button>
      </div>
    </div>
  );
}

/* ── Section wrapper ── */
function EditSection({ icon: Icon, title, subtitle, children }) {
  return (
    <div className="rounded-2xl border border-zinc-700 overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-700 bg-zinc-700">
        
        <div className="w-7 h-7 flex items-center justify-center rounded-md bg-zinc-700">
          <Icon size={15} className="text-white" />
        </div>

        <div>
          <p className="text-sm font-semibold text-white">{title}</p>
          {subtitle && (
            <p className="text-[11px] text-stone-400 leading-tight">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div className="p-4 bg-zinc-700 text-black">{children}</div>
    </div>
  );
}

/* ── Toggle ── */
function Toggle({ label, desc, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer bg-zinc-700 mix hover:bg-zinc-800 transition-colors px-3 py-2 rounded-xl border border-zinc-700">
      <div className="relative shrink-0 border border-white rounded-full">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
        <div className={`w-8 h-4 rounded-full transition-colors ${checked ? "bg-green-500" : "bg-stone-300"}`} />
        <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-4" : ""}`} />
      </div>
      <div>
        <p className="text-sm font-semibold text-white">{label}</p>
        <p className="text-[10px] text-stone-400">{desc}</p>
      </div>
    </label>
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
              <X size={14} />
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
          className="px-4 py-2.5 rounded-xl border border-stone-200 text-white text-sm font-medium hover:bg-stone-50 transition-colors flex items-center gap-2">
          <Plus size={14} /> Add Item
        </button>
        <button onClick={handleSave} disabled={saving}
          className="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-60 flex items-center gap-2">
          {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : <><Save size={14} /> Save Breakdown</>}
        </button>
      </div>

      <p className="text-sm text-stone-400">
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
    <div className="min-h-screen bg-linear-to-b from-zinc-950 to-zinc-900 py-8 px-4" style={{ fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Fraunces:wght@700&display=swap');`}</style>
      <div className="max-w-7xl mx-auto">{children}</div>
    </div>
  );
}

function StatusPill({ status }) {
  const s = {
    upcoming:  { bg:"bg-green-100",  text:"text-green-700"  },
    ongoing:   { bg:"bg-blue-100",   text:"text-blue-700"   },
    completed: { bg:"bg-zinc-700",  text:"text-stone-600"  },
    cancelled: { bg:"bg-red-100",    text:"text-red-700"    },
    draft:     { bg:"bg-yellow-100", text:"text-yellow-700" },
  };
  const c = s[status] || s.upcoming;
  return (
    <span className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full ${c.bg} ${c.text} capitalize`}>
      {status === "ongoing" && <Radio size={10} className="animate-pulse" />}
      {status === "ongoing" ? "Live" : status}
    </span>
  );
}

function MiniStat({ label, value, color }) {
  const colors = { green:"bg-green-50 text-green-600", amber:"bg-amber-50 text-amber-600", blue:"bg-blue-50 text-blue-600", purple:"bg-purple-50 text-purple-600", orange:"bg-orange-50 text-orange-600", emerald:"bg-emerald-50 text-emerald-600", stone:"bg-stone-50 text-stone-600", violet: "bg-violet-50 text-violet-600" };
  return (
    <div className={`bg-linear-to-br from-zinc-800 to-zinc-900 border-zinc-700 rounded-2xl p-3 text-center ${colors[color]||colors.stone}`}>
      <p className="text-xl lg:text-2xl font-bold">{value}</p>
      <p className="text-[10px] lg:text-sm font-medium opacity-70 mt-0.5 leading-tight">{label}</p>
    </div>
  );
}

function PaymentBadge({ status }) {
  const b = PAYMENT_BADGE[status] || PAYMENT_BADGE["not-required"];
  return <span className={`text-sm font-medium px-2.5 py-1 rounded-full ${b.bg} ${b.text}`}>{b.label}</span>;
}

function EField({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-white mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function ei() {
  return "w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100";
}

function Th({ children }) {
  return <th className="px-4 py-2.5 text-left text-sm font-semibold text-white uppercase tracking-wide whitespace-nowrap">{children}</th>;
}
function Td({ children }) {
  return <td className="px-4 py-3 align-top">{children}</td>;
}
function Spinner() {
  return <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>;
}