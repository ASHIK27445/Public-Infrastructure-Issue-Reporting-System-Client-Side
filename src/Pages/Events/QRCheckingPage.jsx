import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import { Html5Qrcode } from "html5-qrcode";
import { format, formatDistanceToNow } from "date-fns";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import {
  ArrowLeft,
  Camera,
  QrCode,
  User,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Mail,
  Calendar,
  MapPin,
  Award,
  ChevronRight,
  UserCheck,
  UserX,
  Loader2,
  Scan,
  Smartphone,
  Check,
  X,
  RotateCcw,
  Eye,
  EyeOff,
  List,
  UserPlus,
} from "lucide-react";

/* ═══════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════ */
export default function QRCheckinPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("scanner");

  // Scanner states
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [scannerReady, setScannerReady] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  // Manual check-in
  const [manualEmail, setManualEmail] = useState("");
  const [manualLoading, setManualLoading] = useState(false);
  const [manualResult, setManualResult] = useState(null);

  const scannerRef = useRef(null);
  const html5QrRef = useRef(null);
  const resultTimerRef = useRef(null);
  const axiosSecure = useAxiosSecure();

  /* ── Fetch event info ── */
  useEffect(() => {
    axiosSecure
      .get(`/admin/event/${id}/detail`)
      .then((r) => setEvent(r.data?.event))
      .catch(() => toast.error("Could not load event"))
      .finally(() => setLoading(false));
  }, [id]);

  /* ── Fetch live stats ── */
  const fetchStats = useCallback(async () => {
    try {
      const res = await axiosSecure.get(`/events/${id}/checkin/stats`);
      setStatsData(res.data);
    } catch {
      /* silent */
    }
  }, [id]);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 15000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  /* ════════════════════════════════════
     SCANNER LIFECYCLE
  ════════════════════════════════════ */
  const startScanner = useCallback(async () => {
    if (html5QrRef.current) return;
    setCameraError(null);
    setScannerReady(false);

    await new Promise((resolve) => setTimeout(resolve, 100));

    const qrReaderElement = document.getElementById("qr-reader");
    if (!qrReaderElement) {
      setCameraError("Scanner element not found. Please try again.");
      return;
    }

    try {
      const html5Qr = new Html5Qrcode("qr-reader");
      html5QrRef.current = html5Qr;

      await html5Qr.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 260, height: 260 },
          aspectRatio: 1.0,
          disableFlip: false,
        },
        onScanSuccess,
        () => {}
      );
      setScanning(true);
      setScannerReady(true);
    } catch (err) {
      console.error("Camera error:", err);
      setCameraError(
        err.name === "NotAllowedError"
          ? "Camera permission denied. Please allow camera access and try again."
          : err.name === "NotFoundError"
          ? "No camera found on this device."
          : `Camera error: ${err.message}`
      );
      html5QrRef.current = null;
    }
  }, [id]);

  const stopScanner = useCallback(async () => {
    if (html5QrRef.current) {
      try {
        await html5QrRef.current.stop();
        html5QrRef.current.clear();
      } catch {
        /* ignore */
      }
      html5QrRef.current = null;
    }
    setScanning(false);
    setScannerReady(false);
  }, []);

  useEffect(() => {
    if (activeTab === "scanner") {
      const timer = setTimeout(() => {
        startScanner();
      }, 150);
      return () => clearTimeout(timer);
    } else {
      stopScanner();
    }
  }, [activeTab, startScanner, stopScanner]);

  useEffect(() => {
    return () => {
      stopScanner();
      if (resultTimerRef.current) clearTimeout(resultTimerRef.current);
    };
  }, [stopScanner]);

  /* ── QR scan success handler ── */
  const onScanSuccess = useCallback(
    async (decodedText) => {
      if (processing) return;
      setProcessing(true);

      if (html5QrRef.current) {
        try {
          await html5QrRef.current.pause(true);
        } catch {
          /* ignore */
        }
      }

      try {
        const res = await axiosSecure.post(`/events/${id}/checkin`, {
          qrToken: decodedText,
        });
        setScanResult({ ...res.data, type: "success" });
        fetchStats();
      } catch (err) {
        const errData = err.response?.data;
        setScanResult({
          success: false,
          type: errData?.code === "ALREADY_CHECKED_IN" ? "warning" : "error",
          message: errData?.message || "Check-in failed",
          code: errData?.code,
          volunteer: errData?.volunteer,
        });
      } finally {
        setProcessing(false);
        if (resultTimerRef.current) clearTimeout(resultTimerRef.current);
        resultTimerRef.current = setTimeout(async () => {
          setScanResult(null);
          if (html5QrRef.current) {
            try {
              await html5QrRef.current.resume();
            } catch {
              /* ignore */
            }
          }
        }, 4000);
      }
    },
    [id, processing, fetchStats]
  );

  /* ── Manual check-in ── */
  const handleManualCheckin = async (e) => {
    e.preventDefault();
    if (!manualEmail.trim()) return;
    setManualLoading(true);
    setManualResult(null);
    try {
      const res = await axiosSecure.post(`/events/${id}/checkin/manual`, {
        email: manualEmail.trim(),
      });
      setManualResult({ ...res.data, type: "success" });
      setManualEmail("");
      fetchStats();
      toast.success(res.data.message);
    } catch (err) {
      const errData = err.response?.data;
      setManualResult({
        success: false,
        type: errData?.code === "ALREADY_CHECKED_IN" ? "warning" : "error",
        message: errData?.message || "Check-in failed",
        code: errData?.code,
        volunteer: errData?.volunteer,
      });
    } finally {
      setManualLoading(false);
    }
  };

  /* ── Undo check-in ── */
  const handleUndo = async (regId, name) => {
    if (!window.confirm(`Undo check-in for ${name}?`)) return;
    try {
      await axiosSecure.delete(`/events/${id}/checkin/${regId}`);
      toast.success(`Check-in undone for ${name}`);
      fetchStats();
    } catch {
      toast.error("Undo failed");
    }
  };

  /* ─────────────────── RENDER ─────────────────── */
  if (loading)
    return (
      <Shell>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        </div>
      </Shell>
    );

  const attended = statsData?.stats?.attended || 0;
  const total = statsData?.stats?.total || 0;
  const pending = statsData?.stats?.pending || 0;
  const percentage = statsData?.stats?.percentage || 0;
  const freeParticipants = statsData?.stats?.freeParticipants || 0;
  const freeParticipantsPending = statsData?.freeParticipantsPending || [];
console.log(statsData)
  return (
    <Shell>
      {/* ── Header ── */}
      <div className="sticky top-0 z-20 bg-linear-to-br from-zinc-900 to-zinc-800   backdrop-blur-sm border-b border-gray-100 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          <button
            onClick={() => {
              stopScanner();
              navigate(`/dashboard/admin/events/${id}/manage`);
            }}
            className="flex items-center gap-2 text-sm text-white hover:cursor-pointer transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back</span>
          </button>

          <div className="text-center flex-1 min-w-0">
            <p className="font-semibold text-white text-sm truncate">
              {event?.title || "Event Check-in"}
            </p>
            <p className="text-gray-500 text-xs flex items-center justify-center gap-2">
              <Calendar className="w-3 h-3" />
              {event ? format(new Date(event.date), "dd MMM yyyy · h:mm a") : ""}
            </p>
          </div>

          <div className="text-right">
            <p className="text-blue-600 font-bold text-lg leading-none">
              {attended}
              <span className="text-gray-400 text-sm font-normal">
                /{total + freeParticipants}
              </span>
            </p>
            <p className="text-gray-500 text-xs">checked in</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5">
        {/* ── Progress ── */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span className="text-blue-600 font-medium">
              {attended} attended
            </span>
            <span>
              {percentage}% · {pending + freeParticipants} remaining
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-700"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <StatCard
            icon={CheckCircle}
            label="Attended"
            value={attended}
            color="blue"
          />
          <StatCard
            icon={Clock}
            label="Remaining"
            value={pending + freeParticipants}
            color="amber"
          />
          <StatCard
            icon={Users}
            label="Waitlist"
            value={statsData?.stats?.waitlisted || 0}
            color="gray"
          />
          <StatCard 
          icon={UserPlus} 
          label="Free Participants" 
          value={freeParticipants} 
          color="emerald" />
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 bg-zinc-800 rounded-xl p-1 mb-6">
          {[
            { id: "scanner", label: "Scan", icon: Scan },
            { id: "manual", label: "Manual", icon: UserPlus },
            {
              id: "recent",
              label: "Recent",
              icon: CheckCircle,
              count: statsData?.recent?.length,
            },
            {
              id: "pending",
              label: "Pending",
              icon: Clock,
              count: pending + freeParticipants,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.count > 0 && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    activeTab === tab.id
                      ? "bg-blue-50 text-blue-600"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ════════════════════════════════════
            SCANNER TAB
        ════════════════════════════════════ */}
        {activeTab === "scanner" && (
          <div className="space-y-4">
            {cameraError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <Camera className="w-12 h-12 text-red-400 mx-auto mb-3" />
                <p className="text-red-600 text-sm mb-4">{cameraError}</p>
                <button
                  onClick={startScanner}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {!cameraError && (
              <div className="relative rounded-xl overflow-hidden bg-zinc-700 border border-zinc-700">
                <div id="qr-reader" className="w-full" style={{ minHeight: "320px" }} />

                {scannerReady && !scanResult && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="relative w-64 h-64">
                      {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map(
                        (pos, i) => (
                          <div
                            key={i}
                            className={`absolute w-8 h-8 border-blue-400 ${pos} ${
                              i < 2 ? "border-t-2" : "border-b-2"
                            } ${i % 2 === 0 ? "border-l-2" : "border-r-2"}`}
                          />
                        )
                      )}
                      <div className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-transparent via-blue-400 to-transparent animate-scanline" />
                    </div>
                  </div>
                )}

                {!scannerReady && !cameraError && (
                  <div className="absolute inset-0 bg-zinc-700 flex flex-col items-center justify-center">
                    <Loader2 className="w-10 h-10 text-blue-400 animate-spin mb-3" />
                    <p className="text-gray-400 text-sm">Starting camera...</p>
                  </div>
                )}

                {processing && (
                  <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center">
                    <Loader2 className="w-10 h-10 text-white animate-spin" />
                  </div>
                )}

                {scanResult && (
                  <div
                    className={`absolute inset-0 flex items-center justify-center p-6 ${
                      scanResult.type === "success"
                        ? "bg-green-500/95"
                        : scanResult.type === "warning"
                        ? "bg-amber-500/95"
                        : "bg-red-500/95"
                    }`}
                  >
                    <div className="text-center w-full text-white">
                      <div className="text-7xl mb-4">
                        {scanResult.type === "success" ? (
                          <CheckCircle className="w-20 h-20 mx-auto" />
                        ) : scanResult.type === "warning" ? (
                          <AlertCircle className="w-20 h-20 mx-auto" />
                        ) : (
                          <XCircle className="w-20 h-20 mx-auto" />
                        )}
                      </div>
                      <p className="text-xl font-bold mb-2">
                        {scanResult.type === "success"
                          ? "Check-in Successful!"
                          : scanResult.type === "warning"
                          ? "Already Checked In"
                          : "Check-in Failed"}
                      </p>

                      {scanResult.volunteer && (
                        <div className="bg-white/10 rounded-xl p-4 mt-3 text-left space-y-1.5">
                          <p className="font-semibold text-lg">
                            {scanResult.volunteer.name}
                          </p>
                          <p className="text-sm text-white/80 capitalize">
                            {scanResult.volunteer.role}
                            {scanResult.volunteer.institution
                              ? ` · ${scanResult.volunteer.institution}`
                              : ""}
                          </p>
                          {scanResult.type === "success" &&
                            scanResult.volunteer.attendedAt && (
                              <p className="text-xs text-green-200">
                                Checked in at{" "}
                                {format(
                                  new Date(scanResult.volunteer.attendedAt),
                                  "h:mm:ss a"
                                )}
                              </p>
                            )}
                          {scanResult.type === "warning" &&
                            scanResult.volunteer.attendedAt && (
                              <p className="text-xs text-amber-200">
                                Previously checked in{" "}
                                {formatDistanceToNow(
                                  new Date(scanResult.volunteer.attendedAt),
                                  { addSuffix: true }
                                )}
                              </p>
                            )}
                        </div>
                      )}

                      <p className="text-xs text-white/70 mt-4">
                        Scanner resuming automatically...
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3">
              {!scanning ? (
                <button
                  onClick={startScanner}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors"
                >
                  <Camera className="w-5 h-5" />
                  Start Camera
                </button>
              ) : (
                <button
                  onClick={stopScanner}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium text-sm transition-colors"
                >
                  <X className="w-5 h-5" />
                  Stop Camera
                </button>
              )}
              <button
                onClick={fetchStats}
                className="px-4 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <p className="text-center text-xs text-gray-400">
              Point camera at volunteer's QR code · Auto-confirms in real time
            </p>
          </div>
        )}

        {/* ════════════════════════════════════
            MANUAL CHECK-IN TAB
        ════════════════════════════════════ */}
        {activeTab === "manual" && (
          <div className="bg-linear-to-br from-zinc-900 to-zinc-800 border border-zinc-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-1">
              <UserPlus className="w-5 h-5 text-blue-500" />
              <h2 className="font-semibold text-white">Manual Check-in</h2>
            </div>
            <p className="text-gray-500 text-sm mb-5">
              Use when QR code is unavailable or camera doesn't work.
            </p>

            <form onSubmit={handleManualCheckin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-white uppercase tracking-wide mb-2">
                  Volunteer Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white" />
                  <input
                    type="email"
                    value={manualEmail}
                    onChange={(e) => {
                      setManualEmail(e.target.value);
                      setManualResult(null);
                    }}
                    placeholder="volunteer@email.com"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 text-white placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm"
                    autoComplete="off"
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={manualLoading || !manualEmail.trim()}
                className="w-full py-3 rounded-lg bg-linear-to-br from-emerald-500 to-teal-500 hover:cursor-pointer text-white font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {manualLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Checking in...
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4 text-white" />
                    Check In Volunteer
                  </>
                )}
              </button>
            </form>

            {manualResult && (
              <div
                className={`mt-4 rounded-lg p-4 ${
                  manualResult.type === "success"
                    ? "bg-linear-to-br from-zinc-900 to-zinc-800  border border-green-200"
                    : manualResult.type === "warning"
                    ? "bg-amber-50 border border-amber-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  {manualResult.type === "success" ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  ) : manualResult.type === "warning" ? (
                    <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  )}
                  <div>
                    <p
                      className={`font-medium text-sm ${
                        manualResult.type === "success"
                          ? "text-green-700"
                          : manualResult.type === "warning"
                          ? "text-amber-700"
                          : "text-red-700"
                      }`}
                    >
                      {manualResult.message}
                    </p>
                    {manualResult.volunteer && (
                      <div className="mt-2 space-y-0.5">
                        <p className="text-white text-sm font-medium">
                          {manualResult.volunteer.name}
                        </p>
                        <p className="text-gray-500 text-xs capitalize">
                          {manualResult.volunteer.role}
                        </p>
                        {manualResult.volunteer.attendedAt && (
                          <p className="text-gray-400 text-xs">
                            at{" "}
                            {format(
                              new Date(manualResult.volunteer.attendedAt),
                              "h:mm:ss a"
                            )}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════
            RECENT CHECK-INS TAB
        ════════════════════════════════════ */}
        {activeTab === "recent" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold text-white">Recent Check-ins</h2>
              <button
                onClick={fetchStats}
                className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh
              </button>
            </div>

            {!statsData?.recent?.length ? (
              <div className="text-center py-12 text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No check-ins yet</p>
              </div>
            ) : (
              statsData.recent.map((v, i) => (
                <CheckinCard
                  key={v._id || i}
                  volunteer={v}
                  type="recent"
                  onUndo={handleUndo}
                />
              ))
            )}
          </div>
        )}

        {/* ════════════════════════════════════
            PENDING TAB
        ════════════════════════════════════ */}
        {activeTab === "pending" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold text-white">Not Yet Checked In</h2>
              <span className="text-xs text-amber-600 font-medium">
                {pending + freeParticipants} remaining
              </span>
            </div>

            {pending + freeParticipants === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-sm text-green-600 font-medium">Everyone has checked in!</p>
              </div>
            ) : (
              <>
                {statsData?.pending?.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      Volunteers · {statsData.pending.length}
                    </p>
                    {statsData.pending.map((v, i) => (
                      <CheckinCard
                        key={v._id || i}
                        volunteer={v}
                        type="pending"
                        onManualCheckin={(email) => {
                          setManualEmail(email);
                          setActiveTab("manual");
                        }}
                      />
                    ))}
                  </div>
                )}

                {freeParticipantsPending.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      Free Participants · {freeParticipantsPending.length}
                    </p>
                    {freeParticipantsPending.map((p, i) => (
                      <CheckinCard
                        key={p._id || i}
                        volunteer={p}
                        type="pending"
                        isFreeParticipant
                        onManualCheckin={(email) => {
                          setManualEmail(email);
                          setActiveTab("manual");
                        }}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes scanline {
          0% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(260px); opacity: 0.5; }
          100% { transform: translateY(0); opacity: 1; }
        }
        #qr-reader video { border-radius: 12px !important; }
        #qr-reader__scan_region { border-radius: 12px !important; }
        #qr-reader__dashboard { display: none !important; }
      `}</style>
    </Shell>
  );
}

/* ═══════════════════════════════════════
   CHECK-IN CARD
═══════════════════════════════════════ */
function CheckinCard({ volunteer, type, onUndo, onManualCheckin, isFreeParticipant }) {
  return (
    <div
      className={`rounded-lg border p-4 flex items-center gap-3 transition-all ${
        type === "recent"
          ? "bg-linear-to-br from-zinc-900 to-zinc-800 border-zinc-700"
          : "bg-linear-to-br from-zinc-900 to-zinc-800 border-gray-200 hover:border-blue-200"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm shrink-0 ${
          type === "recent" ? "bg-green-100 text-blue-700" : "bg-gray-100 text-gray-600"
        }`}
      >
        {volunteer.name?.[0]?.toUpperCase() || "?"}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-white text-sm truncate">{volunteer.name}</p>
          {isFreeParticipant && (
            <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full shrink-0">
              Participant
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {isFreeParticipant ? (
            <span className="text-xs text-gray-500">{volunteer.phone || volunteer.email}</span>
          ) : (
            <>
              <span className="text-xs text-gray-500 capitalize">{volunteer.role}</span>
              {volunteer.institution && (
                <span className="text-xs text-gray-400 truncate">· {volunteer.institution}</span>
              )}
            </>
          )}
          {type === "pending" && volunteer.paymentStatus === "pending" && (
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
              Payment pending
            </span>
          )}
        </div>

        {type === "recent" && volunteer.attendedAt && (
          <p className="text-xs text-blue-600 mt-0.5">
            {format(new Date(volunteer.attendedAt), "h:mm:ss a")} ·{" "}
            {formatDistanceToNow(new Date(volunteer.attendedAt), { addSuffix: true })}
          </p>
        )}
      </div>

      {type === "recent" && onUndo && volunteer._id && (
        <button
          onClick={() => onUndo(volunteer._id, volunteer.name)}
          title="Undo check-in"
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      )}
      {type === "pending" && onManualCheckin && (
        <button
          onClick={() => onManualCheckin(volunteer.email)}
          className="px-3 py-1.5 rounded-lg bg-linear-to-br from-zinc-900 to-zinc-800 hover:cursor-pointer text-blue-600 text-xs font-medium transition-all"
        >
          Check In
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   HELPERS
═══════════════════════════════════════ */
function Shell({ children }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-900 to-zinc-800 " style={{ fontFamily: "Inter, sans-serif" }}>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');`}
      </style>
      {children}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    blue: "bg-blue-50 border-blue-200 text-white",
    amber: "bg-amber-50 border-amber-200 text-white",
    emerald: "bg-emerald-50 border-emerald-200 text-white",
    gray: "bg-gray-50 border-gray-200 text-white",
  };

  return (
    <div className={`bg-linear-to-br from-zinc-900 to-zinc-800  border rounded-xl p-4 text-center ${colors[color]}`}>
      <Icon className="w-5 h-5 mx-auto mb-1 opacity-70" />
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs opacity-70 mt-0.5">{label}</p>
    </div>
  );
}