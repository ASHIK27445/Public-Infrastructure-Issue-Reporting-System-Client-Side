import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import {
  Download, RefreshCw, Search, CheckCircle2,
  Clock, Users, CreditCard, ArrowUpCircle,
  QrCode, UserMinus, Award, X,
} from "lucide-react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useParams } from "react-router";
import { QRCodeCanvas } from "qrcode.react";


export default function WaitlistManagementPanel({ eventTitle, maxVolunteers }) {
  const { id: eventId } = useParams();

  const [volunteers, setVolunteers] = useState([]);
  const [waitlist,   setWaitlist]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [tab,        setTab]        = useState("confirmed");
  const [search,     setSearch]     = useState("");
  const [qrModal,    setQrModal]    = useState(null);
  const axiosSecure = useAxiosSecure();

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [confirmedRes, waitlistRes] = await Promise.all([
        axiosSecure.get(`/events/${eventId}/volunteers?waitlisted=false`),
        axiosSecure.get(`/events/${eventId}/waitlist`),
      ]);
      setVolunteers(confirmedRes.data?.registrations || []);
      setWaitlist(waitlistRes.data?.waitlist || []);
    } catch {
      toast.error("Could not load volunteer data");
    } finally {
      setLoading(false);
    }
  };

  console.log(volunteers, waitlist)

  useEffect(() => { fetchAll(); }, [eventId]);

  /* ── Counts ── */
  const attendedCount = volunteers.filter((v) => v.attended).length;
  const paidCount     = volunteers.filter((v) => v.paymentStatus === "paid").length;
  const pendingCount  = volunteers.filter((v) => v.paymentStatus === "pending").length;

  /* ── Filtered rows ── */
  const rows = (tab === "waitlist" ? waitlist : volunteers).filter((v) => {
    if (tab === "attended" && !v.attended) return false;
    const q = search.toLowerCase();
    return (
      v.name?.toLowerCase().includes(q) ||
      v.email?.toLowerCase().includes(q) ||
      v.institution?.toLowerCase().includes(q)
    );
  });

  /* ── Export CSV ── */
  const exportCSV = () => {
    const data = tab === "waitlist" ? waitlist : volunteers;
    const rows = [
      ["Name","Email","Phone","Institution","Age Group","Skills","Role","Payment","Attended","Registered At"],
      ...data.map((v) => [
        v.name, v.email, v.phone, v.institution, v.ageGroup,
        v.skills?.join("|") || "",
        v.role, v.paymentStatus, v.attended ? "Yes" : "No",
        format(new Date(v.createdAt), "dd/MM/yyyy HH:mm"),
      ]),
    ];
    const csv  = rows.map((r) => r.map((c) => `"${c ?? ""}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `${eventTitle || "event"}-${tab}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported!");
  };

  /* ── Action handlers (wire to your API) ── */
  const handlePromote   = (reg) => toast.info(`Promote: ${reg.name}`);
  const handleRemove    = (reg) => toast.warn(`Remove: ${reg.name}`);
  const handleCert      = (reg) => toast.success(`Certificate: ${reg.name}`);
  const handleQR = (reg) => {
    setQrModal({ name: reg.name, qrToken: reg.qrToken });
  };

  /* ── Tabs config ── */
  const TABS = [
    { id: "confirmed", label: "Confirmed", count: volunteers.length },
    { id: "waitlist",  label: "Waitlist",  count: waitlist.length   },
    { id: "attended",  label: "Attended",  count: attendedCount     },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">

          {/* ── Header ── */}
          <div className="px-6 py-5 border-b border-zinc-800 flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-base font-semibold text-white">Volunteer management</h2>
              <p className="text-xs text-zinc-500 mt-0.5">{eventTitle || "Event"}</p>
            </div>
            <button
              onClick={exportCSV}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-700
                         bg-transparent text-white text-sm grayBG hover:bg-zinc-800 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>

          {/* ── Stats bar ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-zinc-800 border-b border-zinc-800">
            <StatCell icon={<Users className="w-4 h-4" />} label="Confirmed"
              value={volunteers.length} sub={`/ ${maxVolunteers || "—"} spots`} color="emerald" />
            <StatCell icon={<Clock className="w-4 h-4" />} label="Waitlist"
              value={waitlist.length} color="amber" />
            <StatCell icon={<CheckCircle2 className="w-4 h-4" />} label="Attended"
              value={attendedCount} color="sky" />
            <StatCell icon={<CreditCard className="w-4 h-4" />} label="Paid"
              value={paidCount} sub={pendingCount > 0 ? `${pendingCount} pending` : null}
              subColor="amber" color="violet" />
          </div>

          {/* ── Toolbar ── */}
          <div className="px-4 py-3 border-b border-zinc-800 flex flex-wrap items-center gap-3">
            {/* Tabs */}
            <div className="flex gap-1 bg-zinc-800 rounded-xl p-1">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    tab === t.id
                      ? "bg-zinc-700 text-white shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {t.label}
                  <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${
                    tab === t.id ? "bg-zinc-600 text-zinc-200" : "bg-zinc-700 text-zinc-500"
                  }`}>
                    {t.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="flex-1 min-w-45 relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, institution..."
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-zinc-700 bg-zinc-800
                           text-zinc-200 text-xs placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* ── Table ── */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : rows.length === 0 ? (
            <div className="text-center py-20 text-zinc-600 text-sm">
              {search ? `No results for "${search}"` : `No ${tab} registrations yet`}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-zinc-800 border-b border-zinc-800">
                    {tab === "waitlist" && <Th>#</Th>}
                    <Th>Name</Th>
                    <Th>Contact</Th>
                    <Th>Institution</Th>
                    <Th>Skills</Th>
                    {tab !== "waitlist" && <Th>Payment</Th>}
                    {tab === "attended"  && <Th>Check-in</Th>}
                    {tab === "confirmed" && <Th>Attended</Th>}
                    <Th>Registered</Th>
                    <Th>Actions</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {rows.map((v) => (
                    <tr key={v._id} className="hover:bg-zinc-800/10 transition-colors">

                      {/* Position badge (waitlist only) */}
                      {tab === "waitlist" && (
                        <Td>
                          <span className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-400 text-xs
                                           font-bold flex items-center justify-center border border-amber-500/20">
                            {v.waitlistPosition}
                          </span>
                        </Td>
                      )}

                      {/* Name + role */}
                      <Td>
                        <p className="font-medium text-white text-sm">{v.name}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">{v.role}</p>
                      </Td>

                      {/* Contact */}
                      <Td>
                        <p className="text-xs text-white">{v.email}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">{v.phone}</p>
                      </Td>

                      {/* Institution */}
                      <Td>
                        <p className="text-xs text-zinc-300">{v.institution || "—"}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">{v.ageGroup}</p>
                      </Td>

                      {/* Skills */}
                      <Td>
                        <div className="flex flex-wrap gap-1">
                          {v.skills?.length > 0
                            ? v.skills.slice(0, 3).map((s) => (
                              <span key={s} className="text-[10px] bg-emerald-500/10 text-emerald-400
                                                        border border-emerald-500/20 px-1.5 py-0.5 rounded-full">
                                {s}
                              </span>
                            ))
                            : <span className="text-xs text-zinc-600">—</span>
                          }
                        </div>
                      </Td>

                      {/* Payment (confirmed + attended) */}
                      {tab !== "waitlist" && (
                        <Td><PaymentBadge status={v.paymentStatus} /></Td>
                      )}

                      {/* Check-in time (attended tab) */}
                      {tab === "attended" && (
                        <Td>
                          <span className="inline-flex items-center gap-1 text-xs bg-emerald-500/10
                                           text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" />
                            {v.attendedAt ? format(new Date(v.attendedAt), "h:mm a") : "—"}
                          </span>
                        </Td>
                      )}

                      {/* Attended flag (confirmed tab) */}
                      {tab === "confirmed" && (
                        <Td>
                          {v.attended ? (
                            <div>
                              <span className="inline-flex items-center gap-1 text-xs bg-emerald-500/10
                                               text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                                <CheckCircle2 className="w-3 h-3" /> Yes
                              </span>
                              {v.attendedAt && (
                                <p className="text-[10px] text-zinc-500 mt-1">
                                  {format(new Date(v.attendedAt), "h:mm a")}
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-zinc-600">—</span>
                          )}
                        </Td>
                      )}

                      {/* Registered at */}
                      <Td>
                        <p className="text-xs text-zinc-500">
                          {format(new Date(v.createdAt), "dd MMM, h:mm a")}
                        </p>
                      </Td>

                      {/* Actions */}
                      <Td>
                        <div className="flex flex-wrap gap-1.5">
                          {tab === "waitlist" && (
                            <>
                              <ActionBtn
                                icon={<ArrowUpCircle className="w-3.5 h-3.5" />}
                                label="Promote"
                                color="emerald"
                                onClick={() => handlePromote(v)}
                              />
                              <ActionBtn
                                icon={<QrCode className="w-3.5 h-3.5" />}
                                label="QR"
                                color="sky"
                                onClick={() => handleQR(v)}
                              />
                              <ActionBtn
                                icon={<X className="w-3.5 h-3.5" />}
                                label="Remove"
                                color="red"
                                onClick={() => handleRemove(v)}
                              />
                            </>
                          )}
                          {tab === "confirmed" && (
                            <>
                              <ActionBtn
                                icon={<QrCode className="w-3.5 h-3.5" />}
                                label="QR"
                                color="sky"
                                onClick={() => handleQR(v)}
                              />
                              <ActionBtn
                                icon={<Award className="w-3.5 h-3.5" />}
                                label="Certificate"
                                color="violet"
                                onClick={() => handleCert(v)}
                              />
                              <ActionBtn
                                icon={<UserMinus className="w-3.5 h-3.5" />}
                                label="Remove"
                                color="red"
                                onClick={() => handleRemove(v)}
                              />
                            </>
                          )}
                          {tab === "attended" && (
                            <ActionBtn
                              icon={<Award className="w-3.5 h-3.5" />}
                              label="Certificate"
                              color="violet"
                              onClick={() => handleCert(v)}
                            />
                          )}
                        </div>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── Footer ── */}
          <div className="px-6 py-3 border-t border-zinc-800 flex items-center justify-between">
            <p className="text-xs text-zinc-600">
              Showing {rows.length} of {tab === "waitlist" ? waitlist.length : volunteers.length} registrations
            </p>
            <button
              onClick={fetchAll}
              className="inline-flex items-center gap-1.5 text-xs text-emerald-500 hover:text-emerald-400 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
          </div>
        </div>
      </div>

       {/* QR Modal */}
      {qrModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-sm text-center">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold">{qrModal.name}</h3>
              <button
                onClick={() => setQrModal(null)}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-white rounded-xl p-4 inline-block mb-4">
              <QRCodeCanvas
                value={qrModal.qrToken}
                size={200}
                bgColor="#ffffff"
                fgColor="#111827"
                level="M"
              />
            </div>

            <p className="text-xs text-zinc-500 mb-2">Attendance QR Code</p>
            <code className="block text-[11px] font-mono bg-zinc-800 rounded-lg px-3 py-2 text-zinc-400 break-all mb-5">
              {qrModal.qrToken}
            </code>

            <button
              onClick={() => setQrModal(null)}
              className="w-full py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-sm hover:bg-zinc-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── StatCell ── */
function StatCell({ icon, label, value, sub, color, subColor }) {
  const colors = {
    emerald: "text-emerald-400",
    amber:   "text-amber-400",
    sky:     "text-sky-400",
    violet:  "text-violet-400",
  };
  return (
    <div className="p-4 text-center">
      <div className={`flex items-center justify-center gap-1.5 mb-1 ${colors[color]} opacity-60`}>
        {icon}
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className={`text-2xl font-semibold ${colors[color]}`}>{value}</p>
      {sub     && <p className="text-[11px] text-zinc-500 mt-0.5">{sub}</p>}
      {subColor && <p className={`text-[11px] mt-0.5 ${colors[subColor]}`}>{sub}</p>}
    </div>
  );
}

/* ── PaymentBadge ── */
function PaymentBadge({ status }) {
  const map = {
    "not-required": { cls: "bg-zinc-800 text-zinc-400 border-zinc-700",   label: "Free"      },
    "pending":      { cls: "bg-amber-500/10 text-amber-400 border-amber-500/20",   label: "Pending"   },
    "paid":         { cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", label: "Paid"   },
    "refunded":     { cls: "bg-sky-500/10 text-sky-400 border-sky-500/20", label: "Refunded"  },
  };
  const s = map[status] || map["not-required"];
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${s.cls}`}>
      {s.label}
    </span>
  );
}

/* ── ActionBtn ── */
function ActionBtn({ icon, label, color, onClick }) {
  const colors = {
    emerald: "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10",
    red:     "border-red-500/30 text-red-400 hover:bg-red-500/10",
    violet:  "border-violet-500/30 text-violet-400 hover:bg-violet-500/10",
    sky:     "border-sky-500/30 text-sky-400 hover:bg-sky-500/10",
  };
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-medium
                  transition-colors ${colors[color]}`}
    >
      {icon}
      {label}
    </button>
  );
}

/* ── Table helpers ── */
function Th({ children }) {
  return (
    <th className="px-4 py-2.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider whitespace-nowrap">
      {children}
    </th>
  );
}
function Td({ children }) {
  return <td className="px-4 py-3 align-top">{children}</td>;
}