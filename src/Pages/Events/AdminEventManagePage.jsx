import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { format, formatDistanceToNow } from "date-fns";
import { QRCodeCanvas } from "qrcode.react";
import { toast } from "react-toastify";

/* ─── Constants ─── */
const TYPE_EMOJI = { cleanup: "🧹", plantation: "🌳", repair: "🏗️", awareness: "📢", student: "🎓", meetup: "🤝" };
const STATUS_NEXT = {
  draft: ["upcoming", "cancelled"],
  upcoming: ["ongoing", "cancelled"],
  ongoing: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};
const PAYMENT_BADGE = {
  "not-required": { bg: "bg-stone-100", text: "text-stone-500", label: "Free" },
  "pending": { bg: "bg-amber-100", text: "text-amber-700", label: "⏳ Pending" },
  "paid": { bg: "bg-green-100", text: "text-green-700", label: "✅ Paid" },
  "refunded": { bg: "bg-blue-100", text: "text-blue-700", label: "↩ Refunded" },
};

/* ─── MOCK DATA GENERATORS ─── */
const generateMockEvent = (id) => {
  const now = new Date();
  const eventDate = new Date(now.getTime() + 2 * 86400000);
  
  return {
    _id: id,
    title: "Riverbank Cleanup Drive",
    eventType: "cleanup",
    description: "Join us for a massive cleanup effort along the Buriganga riverbank. Together we can restore the beauty of our river!",
    date: eventDate.toISOString(),
    endDate: new Date(eventDate.getTime() + 3 * 3600000).toISOString(),
    location: { address: "Buriganga River, Dhaka" },
    coverImage: null,
    maxVolunteers: 50,
    registrationFee: 0,
    fundGoal: 15000,
    fundRaised: 8700,
    organizerContact: "cleanup@eco.org, +8801712345678",
    pinnedAnnouncement: "Please bring your own water bottle and gloves. We'll provide trash bags and masks.",
    status: "upcoming",
    spendingBreakdown: [],
  };
};

const generateMockVolunteers = (eventId) => {
  return [
    {
      _id: "reg_1",
      name: "Rahim Ahmed",
      email: "rahim@example.com",
      phone: "+8801712345678",
      institution: "University of Dhaka",
      ageGroup: "18-25",
      skills: ["organizing", "first-aid"],
      role: "volunteer",
      paymentStatus: "paid",
      attended: false,
      qrToken: `qr_${eventId}_reg_1_${Date.now()}`,
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      waitlistPosition: null,
    },
    {
      _id: "reg_2",
      name: "Fatema Begum",
      email: "fatema@example.com",
      phone: "+8801912345678",
      institution: "BUET",
      ageGroup: "18-25",
      skills: ["photography", "social-media"],
      role: "team-lead",
      paymentStatus: "paid",
      attended: false,
      qrToken: `qr_${eventId}_reg_2_${Date.now()}`,
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      waitlistPosition: null,
    },
    {
      _id: "reg_3",
      name: "Shahin Khan",
      email: "shahin@example.com",
      phone: "+8801512345678",
      institution: "Jahangirnagar University",
      ageGroup: "26-35",
      skills: ["logistics"],
      role: "volunteer",
      paymentStatus: "pending",
      attended: false,
      qrToken: `qr_${eventId}_reg_3_${Date.now()}`,
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      waitlistPosition: null,
    },
    {
      _id: "reg_4",
      name: "Nusrat Jahan",
      email: "nusrat@example.com",
      phone: "+8801612345678",
      institution: "North South University",
      ageGroup: "18-25",
      skills: ["public-speaking", "organizing"],
      role: "coordinator",
      paymentStatus: "paid",
      attended: true,
      qrToken: `qr_${eventId}_reg_4_${Date.now()}`,
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
      waitlistPosition: null,
    },
    {
      _id: "reg_5",
      name: "Kamal Hossain",
      email: "kamal@example.com",
      phone: "+8801712345670",
      institution: "Independent University",
      ageGroup: "18-25",
      skills: ["design"],
      role: "volunteer",
      paymentStatus: "paid",
      attended: false,
      qrToken: `qr_${eventId}_reg_5_${Date.now()}`,
      createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      waitlistPosition: null,
    },
    {
      _id: "reg_6",
      name: "Sumaiya Akter",
      email: "sumaiya@example.com",
      phone: "+8801912345670",
      institution: "BRAC University",
      ageGroup: "18-25",
      skills: [],
      role: "volunteer",
      paymentStatus: "pending",
      attended: false,
      qrToken: `qr_${eventId}_reg_6_${Date.now()}`,
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      waitlistPosition: null,
    },
  ];
};

const generateMockWaitlist = (eventId) => {
  return [
    {
      _id: "wait_1",
      name: "Hasan Miah",
      email: "hasan@example.com",
      phone: "+8801712345679",
      institution: "Uttara University",
      ageGroup: "18-25",
      skills: ["volunteering"],
      role: "volunteer",
      paymentStatus: "not-required",
      attended: false,
      qrToken: "",
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      waitlistPosition: 1,
    },
    {
      _id: "wait_2",
      name: "Tania Sultana",
      email: "tania@example.com",
      phone: "+8801912345679",
      institution: "Eastern University",
      ageGroup: "26-35",
      skills: ["mentoring"],
      role: "volunteer",
      paymentStatus: "not-required",
      attended: false,
      qrToken: "",
      createdAt: new Date(Date.now() - 12 * 3600000).toISOString(),
      waitlistPosition: 2,
    },
    {
      _id: "wait_3",
      name: "Rafiqul Islam",
      email: "rafiq@example.com",
      phone: "+8801512345679",
      institution: "AIUB",
      ageGroup: "18-25",
      skills: ["technical"],
      role: "volunteer",
      paymentStatus: "not-required",
      attended: false,
      qrToken: "",
      createdAt: new Date(Date.now() - 6 * 3600000).toISOString(),
      waitlistPosition: 3,
    },
  ];
};

const generateMockDonations = () => {
  return [
    {
      _id: "don_1",
      donorName: "Anonymous Donor",
      donorEmail: null,
      amount: 5000,
      anonymous: true,
      createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    },
    {
      _id: "don_2",
      donorName: "Green Bangladesh Foundation",
      donorEmail: "contact@greenbd.org",
      amount: 2500,
      anonymous: false,
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    },
    {
      _id: "don_3",
      donorName: "Rahim Ahmed",
      donorEmail: "rahim@example.com",
      amount: 1200,
      anonymous: false,
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
  ];
};

/* ═══════════════════════════════════════
   MAIN PAGE (MOCK VERSION)
═══════════════════════════════════════ */
export default function AdminEventManagePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("volunteers");
  const [statusUpdating, setStatusUpdating] = useState(false);

  // Mock data state - simulate backend updates
  const [mockEvent, setMockEvent] = useState(null);
  const [mockConfirmed, setMockConfirmed] = useState([]);
  const [mockWaitlist, setMockWaitlist] = useState([]);
  const [mockDonations, setMockDonations] = useState([]);
  const [mockStats, setMockStats] = useState({});

  const loadMockData = () => {
    const event = generateMockEvent(id);
    const confirmed = generateMockVolunteers(id);
    const waitlist = generateMockWaitlist(id);
    const donations = generateMockDonations();

    const confirmedCount = confirmed.length;
    const waitlistCount = waitlist.length;
    const attendedCount = confirmed.filter(v => v.attended).length;
    const paidCount = confirmed.filter(v => v.paymentStatus === "paid").length;
    const pendingPayment = confirmed.filter(v => v.paymentStatus === "pending").length;
    const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0);
    const donorCount = donations.length;
    const commentCount = 0;

    setMockEvent(event);
    setMockConfirmed(confirmed);
    setMockWaitlist(waitlist);
    setMockDonations(donations);
    setMockStats({
      confirmedCount,
      waitlistCount,
      attendedCount,
      paidCount,
      pendingPayment,
      totalDonated,
      donorCount,
      commentCount,
    });
    setData({ event, confirmed, waitlist, donations, stats: {
      confirmedCount, waitlistCount, attendedCount, paidCount, pendingPayment, totalDonated, donorCount, commentCount
    }});
    setLoading(false);
  };

  useEffect(() => {
    loadMockData();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    const msg = newStatus === "cancelled"
      ? "Cancel event? All paid registrations will be refunded."
      : `Mark as "${newStatus}"?`;
    if (!window.confirm(msg)) return;
    setStatusUpdating(true);
    
    // Mock API call
    setTimeout(() => {
      if (mockEvent) {
        setMockEvent({ ...mockEvent, status: newStatus });
        setData(prev => ({ ...prev, event: { ...prev.event, status: newStatus } }));
        toast.success(`Status → ${newStatus}`);
      }
      setStatusUpdating(false);
    }, 500);
  };

  const handleRemoveVolunteer = async (regId, name) => {
    if (!window.confirm(`Remove ${name}? If they paid, they'll be refunded.`)) return;
    
    // Mock removal
    const isWaitlistRemoved = mockWaitlist.some(w => w._id === regId);
    if (isWaitlistRemoved) {
      const newWaitlist = mockWaitlist.filter(w => w._id !== regId);
      setMockWaitlist(newWaitlist);
      setMockStats(prev => ({ ...prev, waitlistCount: newWaitlist.length }));
    } else {
      const newConfirmed = mockConfirmed.filter(v => v._id !== regId);
      setMockConfirmed(newConfirmed);
      setMockStats(prev => ({ ...prev, confirmedCount: newConfirmed.length }));
    }
    
    setData(prev => ({
      ...prev,
      confirmed: mockConfirmed.filter(v => v._id !== regId),
      waitlist: mockWaitlist.filter(w => w._id !== regId),
      stats: { ...prev.stats, confirmedCount: mockConfirmed.length - 1, waitlistCount: mockWaitlist.length }
    }));
    
    toast.success(`${name} removed.`);
  };

  const handleUpdateEvent = (updatedEvent) => {
    setMockEvent(updatedEvent);
    setData(prev => ({ ...prev, event: updatedEvent }));
    toast.success("Event updated successfully!");
  };

  const handleUpdateSpending = (spendingItems) => {
    setMockEvent(prev => ({ ...prev, spendingBreakdown: spendingItems }));
    setData(prev => ({ ...prev, event: { ...prev.event, spendingBreakdown: spendingItems } }));
    toast.success("Spending breakdown saved!");
  };

  if (loading) return (
    <Shell>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-[3px] border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </Shell>
  );

  if (!mockEvent) return (
    <Shell>
      <div className="text-center py-20 text-stone-500">Event not found.</div>
    </Shell>
  );

  const available = STATUS_NEXT[mockEvent.status] || [];

  return (
    <Shell>
      {/* Back + Header */}
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
            <span className="text-2xl">{TYPE_EMOJI[mockEvent.eventType] || "📅"}</span>
            <h1 className="text-2xl font-bold text-stone-900" style={{ fontFamily: "Fraunces, serif" }}>
              {mockEvent.title}
            </h1>
            <StatusPill status={mockEvent.status} />
          </div>
          <p className="text-stone-500 text-sm mt-1">
            {format(new Date(mockEvent.date), "EEEE, dd MMM yyyy · h:mm a")} · {mockEvent.location?.address}
          </p>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <Link to={`/events/${mockEvent._id}`}
            className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 text-sm font-medium hover:bg-stone-50 transition-colors">
            👁️ Public Page
          </Link>
          <Link to={`/admin/events/edit/${mockEvent._id}`}
            className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 text-sm font-medium hover:bg-stone-50 transition-colors">
            ✏️ Edit
          </Link>
          <button onClick={() => alert("QR Check-in Page (Demo)")}
            className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors">
            📱 QR Check-in
          </button>
          {available.map((s) => (
            <button key={s} onClick={() => handleStatusChange(s)} disabled={statusUpdating}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 ${
                s === "cancelled" ? "bg-red-50 hover:bg-red-100 text-red-700 border border-red-200"
                : s === "completed" ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
              }`}>
              {statusUpdating ? "..." : s === "ongoing" ? "🔴 Go Live" : s === "completed" ? "✅ Complete" : "❌ Cancel"}
            </button>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
        <MiniStat label="Confirmed" value={mockStats.confirmedCount} color="green" />
        <MiniStat label="Waitlisted" value={mockStats.waitlistCount} color="amber" />
        <MiniStat label="Attended" value={mockStats.attendedCount} color="blue" />
        <MiniStat label="Paid" value={mockStats.paidCount} color="purple" />
        <MiniStat label="Pmt Pending" value={mockStats.pendingPayment} color="orange" />
        <MiniStat label="Donated" value={`৳${(mockStats.totalDonated || 0).toLocaleString()}`} color="emerald" />
        <MiniStat label="Comments" value={mockStats.commentCount} color="stone" />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-stone-100 overflow-x-auto">
          {[
            { id: "volunteers", label: "Confirmed Volunteers", icon: "✅", count: mockStats.confirmedCount },
            { id: "waitlist", label: "Waitlist", icon: "⏳", count: mockStats.waitlistCount },
            { id: "donations", label: "Donations", icon: "💰", count: mockStats.donorCount, show: mockEvent.fundGoal > 0 },
            { id: "edit", label: "Edit Event", icon: "✏️" },
            { id: "spending", label: "Spending", icon: "📊", show: mockEvent.status === "completed" },
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
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? "bg-green-100 text-green-700" : "bg-stone-100 text-stone-500"}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === "volunteers" && (
            <VolunteerTable
              volunteers={mockConfirmed}
              eventId={mockEvent._id}
              onRemove={handleRemoveVolunteer}
              showAttended
            />
          )}

          {activeTab === "waitlist" && (
            <VolunteerTable
              volunteers={mockWaitlist}
              eventId={mockEvent._id}
              onRemove={handleRemoveVolunteer}
              isWaitlist
            />
          )}

          {activeTab === "donations" && (
            <DonationsTab
              donations={mockDonations}
              totalDonated={mockStats.totalDonated}
              fundGoal={mockEvent.fundGoal}
            />
          )}

          {activeTab === "edit" && (
            <EditEventForm event={mockEvent} onSaved={handleUpdateEvent} />
          )}

          {activeTab === "spending" && (
            <SpendingTab
              eventId={mockEvent._id}
              fundRaised={mockEvent.fundRaised}
              spendingBreakdown={mockEvent.spendingBreakdown || []}
              onSaved={handleUpdateSpending}
            />
          )}
        </div>
      </div>
    </Shell>
  );
}

/* ═══════════════════════════════════════
   VOLUNTEER TABLE
═══════════════════════════════════════ */
function VolunteerTable({ volunteers, eventId, onRemove, showAttended, isWaitlist }) {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);

  const filtered = volunteers.filter((v) => {
    const q = search.toLowerCase();
    return v.name?.toLowerCase().includes(q) || v.email?.toLowerCase().includes(q) || v.institution?.toLowerCase().includes(q);
  });

  const exportCSV = () => {
    const rows = [
      ["#", "Name", "Email", "Phone", "Institution", "Age", "Skills", "Role", "Payment", "Attended", "Registered"],
      ...filtered.map((v, i) => [
        isWaitlist ? v.waitlistPosition : i + 1,
        v.name, v.email, v.phone, v.institution || "", v.ageGroup,
        v.skills?.join("|") || "", v.role, v.paymentStatus,
        v.attended ? "Yes" : "No",
        format(new Date(v.createdAt), "dd/MM/yyyy HH:mm"),
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${isWaitlist ? "waitlist" : "volunteers"}-${eventId}.csv`;
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
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, institution..."
          className="flex-1 min-w-[200px] px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-100" />
        <button onClick={exportCSV}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-200 text-stone-700 text-sm font-medium hover:bg-stone-50 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV
        </button>
        <span className="text-xs text-stone-400">{filtered.length} shown</span>
      </div>

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
              <React.Fragment key={v._id}>
                <tr className="hover:bg-stone-50/60 transition-colors">
                  {isWaitlist && (
                    <Td>
                      <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center">
                        {v.waitlistPosition}
                      </span>
                    </Td>
                  )}
                  <Td>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs shrink-0">
                        {v.name?.[0]?.toUpperCase()}
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
                        ? v.skills.slice(0, 3).map((s) => (
                          <span key={s} className="text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded font-medium">{s}</span>
                        ))
                        : <span className="text-xs text-stone-300">—</span>}
                      {v.skills?.length > 3 && <span className="text-[10px] text-stone-400">+{v.skills.length - 3}</span>}
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
                    <p className="text-xs text-stone-500">{format(new Date(v.createdAt), "dd MMM")}</p>
                    <p className="text-[10px] text-stone-400">{formatDistanceToNow(new Date(v.createdAt), { addSuffix: true })}</p>
                  </Td>
                  <Td>
                    <div className="flex gap-1">
                      {!isWaitlist && (
                        <button onClick={() => setExpanded(expanded === v._id ? null : v._id)}
                          title="View QR" className="w-7 h-7 flex items-center justify-center rounded-lg text-stone-400 hover:bg-blue-50 hover:text-blue-600 transition-all text-sm">
                          📱
                        </button>
                      )}
                      <button onClick={() => onRemove(v._id, v.name)}
                        title="Remove" className="w-7 h-7 flex items-center justify-center rounded-lg text-stone-400 hover:bg-red-50 hover:text-red-500 transition-all text-sm">
                        🗑️
                      </button>
                    </div>
                  </Td>
                </tr>
                {expanded === v._id && !isWaitlist && (
                  <tr className="bg-blue-50/30">
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
              </React.Fragment>
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
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-100">
        <div className="flex justify-between items-end mb-3">
          <div>
            <p className="text-2xl font-bold text-emerald-700">৳{(totalDonated || 0).toLocaleString()}</p>
            <p className="text-xs text-emerald-600">{donations.length} donations · Goal: ৳{fundGoal.toLocaleString()}</p>
          </div>
          <p className="text-3xl font-bold text-emerald-200">{fundPercent}%</p>
        </div>
        <div className="h-3 bg-emerald-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full" style={{ width: `${fundPercent}%` }} />
        </div>
      </div>

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
                      <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                        {d.anonymous ? "?" : d.donorName?.[0]?.toUpperCase()}
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
                  <Td><span className="text-xs text-stone-500">{format(new Date(d.createdAt), "dd MMM yyyy, h:mm a")}</span></Td>
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
   EDIT EVENT FORM
═══════════════════════════════════════ */
function EditEventForm({ event, onSaved }) {
  const [form, setForm] = useState({
    title: event.title || "",
    description: event.description || "",
    date: event.date ? new Date(event.date).toISOString().slice(0, 16) : "",
    endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : "",
    maxVolunteers: event.maxVolunteers || 50,
    registrationFee: event.registrationFee || 0,
    fundGoal: event.fundGoal || 0,
    organizerContact: event.organizerContact || "",
    coverImage: event.coverImage || "",
    pinnedAnnouncement: event.pinnedAnnouncement || "",
    address: event.location?.address || "",
  });
  const [saving, setSaving] = useState(false);

  const setF = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    setTimeout(() => {
      const updatedEvent = {
        ...event,
        title: form.title,
        description: form.description,
        date: form.date,
        endDate: form.endDate || undefined,
        maxVolunteers: Number(form.maxVolunteers),
        registrationFee: Number(form.registrationFee),
        fundGoal: Number(form.fundGoal),
        organizerContact: form.organizerContact,
        coverImage: form.coverImage,
        pinnedAnnouncement: form.pinnedAnnouncement,
        location: { ...event.location, address: form.address },
      };
      onSaved(updatedEvent);
      setSaving(false);
    }, 500);
  };

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <EField label="Event Title">
          <input type="text" value={form.title} onChange={(e) => setF("title", e.target.value)} className={ei()} />
        </EField>
        <EField label="Address">
          <input type="text" value={form.address} onChange={(e) => setF("address", e.target.value)} className={ei()} />
        </EField>
        <EField label="Start Date & Time">
          <input type="datetime-local" value={form.date} onChange={(e) => setF("date", e.target.value)} className={ei()} />
        </EField>
        <EField label="End Date & Time">
          <input type="datetime-local" value={form.endDate} onChange={(e) => setF("endDate", e.target.value)} className={ei()} />
        </EField>
        <EField label="Max Volunteers">
          <input type="number" min={1} value={form.maxVolunteers} onChange={(e) => setF("maxVolunteers", e.target.value)} className={ei()} />
        </EField>
        <EField label="Registration Fee (৳)">
          <input type="number" min={0} value={form.registrationFee} onChange={(e) => setF("registrationFee", e.target.value)} className={ei()} />
        </EField>
        <EField label="Fund Goal (৳)">
          <input type="number" min={0} value={form.fundGoal} onChange={(e) => setF("fundGoal", e.target.value)} className={ei()} />
        </EField>
        <EField label="Organizer Contact">
          <input type="text" value={form.organizerContact} onChange={(e) => setF("organizerContact", e.target.value)} className={ei()} />
        </EField>
      </div>
      <EField label="Cover Image URL">
        <input type="url" value={form.coverImage} onChange={(e) => setF("coverImage", e.target.value)} className={ei()} />
        {form.coverImage && (
          <img src={form.coverImage} alt="preview" className="mt-2 h-28 w-full object-cover rounded-xl border border-stone-200"
            onError={(e) => e.target.style.display = "none"} />
        )}
      </EField>
      <EField label="Pinned Announcement">
        <textarea value={form.pinnedAnnouncement} onChange={(e) => setF("pinnedAnnouncement", e.target.value)}
          rows={2} placeholder="Important note shown at the top of the event page..."
          className={ei()} />
      </EField>
      <EField label="Description">
        <textarea value={form.description} onChange={(e) => setF("description", e.target.value)}
          rows={5} className={ei()} />
      </EField>

      <button onClick={handleSave} disabled={saving}
        className="px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-2xl text-sm font-semibold transition-colors disabled:opacity-60 flex items-center gap-2">
        {saving ? <><Spinner /> Saving...</> : "💾 Save Changes"}
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════
   SPENDING TAB
═══════════════════════════════════════ */
function SpendingTab({ eventId, fundRaised, spendingBreakdown, onSaved }) {
  const [items, setItems] = useState(spendingBreakdown || []);
  const [saving, setSaving] = useState(false);

  const addItem = () => setItems((p) => [...p, { label: "", amount: "" }]);
  const removeItem = (i) => setItems((p) => p.filter((_, idx) => idx !== i));
  const setItem = (i, k, v) => setItems((p) => p.map((item, idx) => idx === i ? { ...item, [k]: v } : item));

  const totalSpent = items.reduce((s, i) => s + (Number(i.amount) || 0), 0);
  const remaining = (fundRaised || 0) - totalSpent;

  const handleSave = async () => {
    const valid = items.filter((i) => i.label.trim() && Number(i.amount) > 0);
    if (valid.length !== items.length && items.length > 0) {
      toast.error("All items need a label and amount");
      return;
    }
    setSaving(true);
    setTimeout(() => {
      onSaved(valid);
      setSaving(false);
    }, 500);
  };

  return (
    <div className="space-y-5 max-w-xl">
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-emerald-700">Total Raised</p>
          <p className="text-xl font-bold text-emerald-800">৳{(fundRaised || 0).toLocaleString()}</p>
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
            <input type="text" value={item.label} onChange={(e) => setItem(i, "label", e.target.value)}
              placeholder="e.g. Gloves & bags" className={`${ei()} flex-1`} />
            <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden bg-white">
              <span className="px-2 text-stone-400 text-sm">৳</span>
              <input type="number" min={0} value={item.amount} onChange={(e) => setItem(i, "amount", e.target.value)}
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
          {saving ? <><Spinner /> Saving...</> : "💾 Save Breakdown"}
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
    <div className="min-h-screen bg-[#f5f4f0] py-8 px-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Fraunces:wght@700&display=swap');`}</style>
      <div className="max-w-7xl mx-auto">{children}</div>
    </div>
  );
}

function StatusPill({ status }) {
  const s = {
    upcoming: { bg: "bg-green-100", text: "text-green-700" },
    ongoing: { bg: "bg-blue-100", text: "text-blue-700" },
    completed: { bg: "bg-stone-100", text: "text-stone-600" },
    cancelled: { bg: "bg-red-100", text: "text-red-700" },
    draft: { bg: "bg-yellow-100", text: "text-yellow-700" }
  };
  const c = s[status] || s.upcoming;
  return <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${c.bg} ${c.text} capitalize`}>{status === "ongoing" ? "🔴 Live" : status}</span>;
}

function MiniStat({ label, value, color }) {
  const colors = {
    green: "bg-green-50 text-green-700",
    amber: "bg-amber-50 text-amber-700",
    blue: "bg-blue-50 text-blue-700",
    purple: "bg-purple-50 text-purple-700",
    orange: "bg-orange-50 text-orange-700",
    emerald: "bg-emerald-50 text-emerald-700",
    stone: "bg-stone-50 text-stone-600"
  };
  return (
    <div className={`rounded-2xl p-3 text-center ${colors[color] || colors.stone}`}>
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
  return (
    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}