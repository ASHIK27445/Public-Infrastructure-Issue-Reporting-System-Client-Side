import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { Html5Qrcode } from "html5-qrcode";
import { format, formatDistanceToNow } from "date-fns";

/* ═══════════════════════════════════════
   DEMO DATA & MOCK API
═══════════════════════════════════════ */
const DEMO_EVENT = {
  _id: "evt_001",
  title: "Community Cleanup Drive 2026",
  date: new Date("2026-06-15T09:00:00"),
  location: "City Park, Downtown",
  organizer: "Green Earth Foundation"
};

const DEMO_VOLUNTEERS = [
  {
    _id: "vol_001",
    name: "Alice Johnson",
    email: "alice@email.com",
    role: "team_lead",
    institution: "MIT",
    skills: ["leadership", "environment"],
    qrToken: "qr_alice_001",
    paymentStatus: "paid"
  },
  {
    _id: "vol_002",
    name: "Bob Smith",
    email: "bob@email.com",
    role: "volunteer",
    institution: "Stanford",
    skills: ["logistics"],
    qrToken: "qr_bob_002",
    paymentStatus: "paid"
  },
  {
    _id: "vol_003",
    name: "Charlie Brown",
    email: "charlie@email.com",
    role: "photographer",
    institution: "UCLA",
    skills: ["photography", "social_media"],
    qrToken: "qr_charlie_003",
    paymentStatus: "pending"
  },
  {
    _id: "vol_004",
    name: "Diana Prince",
    email: "diana@email.com",
    role: "first_aid",
    institution: "Harvard",
    skills: ["medical", "cpr"],
    qrToken: "qr_diana_004",
    paymentStatus: "paid"
  },
  {
    _id: "vol_005",
    name: "Ethan Hunt",
    email: "ethan@email.com",
    role: "volunteer",
    institution: "Yale",
    skills: ["security"],
    qrToken: "qr_ethan_005",
    paymentStatus: "paid"
  }
];

// Simulates the backend state
let mockDatabase = {
  event: DEMO_EVENT,
  volunteers: [...DEMO_VOLUNTEERS],
  checkins: {} // { volunteerId: checkinData }
};

// Helper to reset database (useful for testing)
const resetMockDatabase = () => {
  mockDatabase.checkins = {};
  mockDatabase.volunteers = [...DEMO_VOLUNTEERS];
};

// Mock API functions
const mockGetEventDetail = (eventId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: { event: mockDatabase.event } });
    }, 500);
  });
};

const mockGetCheckinStats = (eventId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const total = mockDatabase.volunteers.length;
      const attendedIds = Object.keys(mockDatabase.checkins);
      const attended = attendedIds.length;
      const pending = total - attended;
      const percentage = total > 0 ? Math.round((attended / total) * 100) : 0;
      
      const attendedVolunteers = attendedIds.map(id => {
        const vol = mockDatabase.volunteers.find(v => v._id === id);
        return {
          ...vol,
          attendedAt: mockDatabase.checkins[id].attendedAt
        };
      }).sort((a, b) => new Date(b.attendedAt) - new Date(a.attendedAt));
      
      const pendingVolunteers = mockDatabase.volunteers.filter(
        v => !mockDatabase.checkins[v._id]
      );
      
      const waitlisted = 0; // For demo purposes

      resolve({
        data: {
          stats: { total, attended, pending, percentage, waitlisted },
          recent: attendedVolunteers,
          pending: pendingVolunteers
        }
      });
    }, 300);
  });
};

const mockCheckinByQR = (eventId, qrToken) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const volunteer = mockDatabase.volunteers.find(v => v.qrToken === qrToken);
      
      if (!volunteer) {
        return reject({
          response: {
            data: {
              success: false,
              message: "Invalid QR code. No volunteer found.",
              code: "INVALID_QR"
            }
          }
        });
      }
      
      if (mockDatabase.checkins[volunteer._id]) {
        return reject({
          response: {
            data: {
              success: false,
              message: `${volunteer.name} is already checked in.`,
              code: "ALREADY_CHECKED_IN",
              volunteer: {
                ...volunteer,
                attendedAt: mockDatabase.checkins[volunteer._id].attendedAt
              }
            }
          }
        });
      }
      
      const attendedAt = new Date().toISOString();
      mockDatabase.checkins[volunteer._id] = { attendedAt, method: 'qr' };
      
      resolve({
        data: {
          success: true,
          message: `Welcome, ${volunteer.name}! Check-in confirmed.`,
          volunteer: {
            ...volunteer,
            attendedAt
          }
        }
      });
    }, 800);
  });
};

const mockManualCheckin = (eventId, email) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const volunteer = mockDatabase.volunteers.find(v => 
        v.email.toLowerCase() === email.toLowerCase()
      );
      
      if (!volunteer) {
        return reject({
          response: {
            data: {
              success: false,
              message: "No volunteer found with this email address.",
              code: "NOT_FOUND"
            }
          }
        });
      }
      
      if (mockDatabase.checkins[volunteer._id]) {
        return reject({
          response: {
            data: {
              success: false,
              message: `${volunteer.name} is already checked in.`,
              code: "ALREADY_CHECKED_IN",
              volunteer: {
                ...volunteer,
                attendedAt: mockDatabase.checkins[volunteer._id].attendedAt
              }
            }
          }
        });
      }
      
      const attendedAt = new Date().toISOString();
      mockDatabase.checkins[volunteer._id] = { attendedAt, method: 'manual' };
      
      resolve({
        data: {
          success: true,
          message: `Manual check-in successful for ${volunteer.name}.`,
          volunteer: {
            ...volunteer,
            attendedAt
          }
        }
      });
    }, 600);
  });
};

const mockUndoCheckin = (eventId, registrationId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (mockDatabase.checkins[registrationId]) {
        delete mockDatabase.checkins[registrationId];
        resolve({ data: { success: true } });
      } else {
        reject({ response: { data: { message: "Check-in not found" } } });
      }
    }, 300);
  });
};

/* ═══════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════ */
export default function QRCheckinPageDemo() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [event,      setEvent]      = useState(null);
  const [statsData,  setStatsData]  = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [activeTab,  setActiveTab]  = useState("scanner"); // scanner | manual | recent | pending

  // Scanner states
  const [scanning,       setScanning]       = useState(false);
  const [scanResult,     setScanResult]     = useState(null); // { success, message, volunteer, code }
  const [processing,     setProcessing]     = useState(false);
  const [scannerReady,   setScannerReady]   = useState(false);
  const [cameraError,    setCameraError]    = useState(null);

  // Manual check-in
  const [manualEmail,    setManualEmail]    = useState("");
  const [manualLoading,  setManualLoading]  = useState(false);
  const [manualResult,   setManualResult]   = useState(null);

  const scannerRef   = useRef(null);
  const html5QrRef   = useRef(null);
  const resultTimerRef = useRef(null);

  /* ── Fetch event info ── */
  useEffect(() => {
    mockGetEventDetail(id)
      .then((r) => setEvent(r.data?.event))
      .catch(() => toast.error("Could not load event"))
      .finally(() => setLoading(false));
    
    // Reset demo data on mount
    resetMockDatabase();
  }, [id]);

  /* ── Fetch live stats ── */
  const fetchStats = useCallback(async () => {
    try {
      const res = await mockGetCheckinStats(id);
      setStatsData(res.data);
    } catch { /* silent */ }
  }, [id]);

  useEffect(() => {
    fetchStats();
    // Auto-refresh stats every 5 seconds for demo
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  /* ════════════════════════════════════
     SCANNER LIFECYCLE
  ════════════════════════════════════ */
    const startScanner = useCallback(async () => {
        if (html5QrRef.current) return;
        setCameraError(null);
        setScannerReady(false);

        // Wait for DOM to render the qr-reader element
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const qrReaderElement = document.getElementById("qr-reader");
        if (!qrReaderElement) {
        setCameraError("Scanner element not found. Please try again.");
        return;
        }

        try {
        const html5Qr = new Html5Qrcode("qr-reader");
        html5QrRef.current = html5Qr;

        await html5Qr.start(
            { facingMode: "environment" }, // rear camera
            {
            fps:            10,
            qrbox:          { width: 260, height: 260 },
            aspectRatio:    1.0,
            disableFlip:    false,
            },
            onScanSuccess,
            () => {} // ignore scan errors (noise)
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
      } catch { /* ignore */ }
      html5QrRef.current = null;
    }
    setScanning(false);
    setScannerReady(false);
  }, []);

  // Auto-start scanner when on scanner tab
useEffect(() => {
    if (activeTab === "scanner") {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        startScanner();
      }, 150);
      return () => clearTimeout(timer);
    } else {
      stopScanner();
    }
    return () => { stopScanner(); };
  }, [activeTab]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanner();
      if (resultTimerRef.current) clearTimeout(resultTimerRef.current);
    };
  }, []);

  /* ── QR scan success handler ── */
  const onScanSuccess = useCallback(async (decodedText) => {
    if (processing) return; // prevent double-scan
    setProcessing(true);

    // Pause scanner briefly to avoid re-trigger
    if (html5QrRef.current) {
      try { await html5QrRef.current.pause(true); } catch { /* ignore */ }
    }

    try {
      const res = await mockCheckinByQR(id, decodedText);
      setScanResult({ ...res.data, type: "success" });
      fetchStats();
    } catch (err) {
      const errData = err.response?.data;
      setScanResult({
        success:   false,
        type:      errData?.code === "ALREADY_CHECKED_IN" ? "warning" : "error",
        message:   errData?.message || "Check-in failed",
        code:      errData?.code,
        volunteer: errData?.volunteer,
      });
    } finally {
      setProcessing(false);
      // Auto-clear result and resume scanner after 4 seconds
      if (resultTimerRef.current) clearTimeout(resultTimerRef.current);
      resultTimerRef.current = setTimeout(async () => {
        setScanResult(null);
        if (html5QrRef.current) {
          try { await html5QrRef.current.resume(); } catch { /* ignore */ }
        }
      }, 4000);
    }
  }, [id, processing, fetchStats]);

  /* ── Manual check-in ── */
  const handleManualCheckin = async (e) => {
    e.preventDefault();
    if (!manualEmail.trim()) return;
    setManualLoading(true);
    setManualResult(null);
    try {
      const res = await mockManualCheckin(id, manualEmail.trim());
      setManualResult({ ...res.data, type: "success" });
      setManualEmail("");
      fetchStats();
      toastDemo(`${res.data.volunteer.name} checked in successfully!`);
    } catch (err) {
      const errData = err.response?.data;
      setManualResult({
        success: false,
        type:    errData?.code === "ALREADY_CHECKED_IN" ? "warning" : "error",
        message: errData?.message || "Check-in failed",
        code:    errData?.code,
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
      await mockUndoCheckin(id, regId);
      toastDemo(`Check-in undone for ${name}`);
      fetchStats();
    } catch { toastDemo("Undo failed"); }
  };

  /* ─────────────────── RENDER ─────────────────── */
  if (loading) return (
    <Shell dark>
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-[3px] border-green-400 border-t-transparent rounded-full animate-spin" />
      </div>
    </Shell>
  );

  const attended   = statsData?.stats?.attended   || 0;
  const total      = statsData?.stats?.total       || 0;
  const pending    = statsData?.stats?.pending     || 0;
  const percentage = statsData?.stats?.percentage  || 0;

  return (
    <Shell dark>
      {/* ── Top bar ── */}
      <div className="sticky top-0 z-20 bg-gray-950/95 backdrop-blur-sm border-b border-gray-800 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          <button onClick={() => { stopScanner(); navigate(`/admin/events/${id}/manage`); }}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
            Back
          </button>
          <div className="text-center flex-1 min-w-0">
            <p className="text-white font-semibold text-sm truncate">{event?.title || "Event Check-in"}</p>
            <p className="text-gray-400 text-xs">{event ? format(new Date(event.date), "dd MMM yyyy · h:mm a") : ""}</p>
          </div>
          <div className="text-right">
            <p className="text-green-400 font-bold text-lg leading-none">{attended}<span className="text-gray-500 text-sm font-normal">/{total}</span></p>
            <p className="text-gray-500 text-xs">checked in</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5">

        {/* ── Live progress bar ── */}
        <div className="mb-5">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span className="text-green-400 font-medium">{attended} attended</span>
            <span>{percentage}% · {pending} remaining</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-700"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* ── Stats cards ── */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <DarkStatCard label="Attended"  value={attended}   color="green"  />
          <DarkStatCard label="Remaining" value={pending}    color="amber"  />
          <DarkStatCard label="Waitlist"  value={statsData?.stats?.waitlisted || 0} color="gray" />
        </div>

        {/* ── Tab bar ── */}
        <div className="flex gap-1 bg-gray-900 rounded-2xl p-1 mb-5">
          {[
            { id:"scanner", label:"📷 Scanner" },
            { id:"manual",  label:"⌨️ Manual"  },
            { id:"recent",  label:"✅ Recent",  count: statsData?.recent?.length },
            { id:"pending", label:"⏳ Pending", count: pending },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-green-500 text-white shadow-sm"
                  : "text-gray-400 hover:text-gray-200"
              }`}>
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab===tab.id ? "bg-white/20" : "bg-gray-700 text-gray-400"}`}>
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
            {/* Demo QR Codes Reference */}
            <div className="bg-blue-950/30 border border-blue-900/50 rounded-2xl p-4">
              <p className="text-blue-300 text-xs font-medium mb-2">🎯 Demo QR Codes (scan to test):</p>
              <div className="space-y-1 text-xs text-blue-400/80">
                <p>• Alice: <code className="text-white bg-blue-900/50 px-2 py-0.5 rounded">qr_alice_001</code></p>
                <p>• Bob: <code className="text-white bg-blue-900/50 px-2 py-0.5 rounded">qr_bob_002</code></p>
                <p>• Charlie: <code className="text-white bg-blue-900/50 px-2 py-0.5 rounded">qr_charlie_003</code></p>
                <p>• Diana: <code className="text-white bg-blue-900/50 px-2 py-0.5 rounded">qr_diana_004</code></p>
                <p>• Ethan: <code className="text-white bg-blue-900/50 px-2 py-0.5 rounded">qr_ethan_005</code></p>
              </div>
              <p className="text-blue-500/60 text-[10px] mt-2">Generate QR codes containing these tokens to test the scanner</p>
            </div>

            {/* Camera permission error */}
            {cameraError && (
              <div className="bg-red-900/40 border border-red-700 rounded-2xl p-5 text-center">
                <div className="text-4xl mb-3">📷</div>
                <p className="text-red-300 text-sm mb-4">{cameraError}</p>
                <button onClick={startScanner}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-colors">
                  Try Again
                </button>
              </div>
            )}

            {/* QR Scanner viewport */}
            {!cameraError && (
              <div className="relative rounded-3xl overflow-hidden bg-gray-900 border border-gray-800">
                {/* Scanner div — html5-qrcode mounts here */}
                <div id="qr-reader" className="w-full" style={{ minHeight: "320px" }} />

                {/* Overlay frame */}
                {scannerReady && !scanResult && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="relative w-64 h-64">
                      {/* Corner frames */}
                      {["top-0 left-0","top-0 right-0","bottom-0 left-0","bottom-0 right-0"].map((pos, i) => (
                        <div key={i} className={`absolute w-8 h-8 border-green-400 ${pos} ${
                          i<2 ? "border-t-2" : "border-b-2"
                        } ${
                          i%2===0 ? "border-l-2" : "border-r-2"
                        }`} />
                      ))}
                      {/* Scan line animation */}
                      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-[scanline_2s_ease-in-out_infinite]" />
                    </div>
                  </div>
                )}

                {/* Loading overlay */}
                {!scannerReady && !cameraError && (
                  <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center">
                    <div className="w-10 h-10 border-[3px] border-green-500 border-t-transparent rounded-full animate-spin mb-3" />
                    <p className="text-gray-400 text-sm">Starting camera...</p>
                  </div>
                )}

                {/* Processing overlay */}
                {processing && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="w-10 h-10 border-[3px] border-green-400 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}

                {/* RESULT OVERLAY */}
                {scanResult && (
                  <div className={`absolute inset-0 flex items-center justify-center p-6 ${
                    scanResult.type === "success"  ? "bg-green-900/95"
                    : scanResult.type === "warning"? "bg-amber-900/95"
                    : "bg-red-900/95"
                  }`}>
                    <div className="text-center w-full">
                      <div className={`text-7xl mb-4 ${scanResult.type==="success" ? "animate-bounce" : ""}`}>
                        {scanResult.type==="success" ? "✅" : scanResult.type==="warning" ? "⚠️" : "❌"}
                      </div>
                      <p className={`text-xl font-bold mb-2 ${
                        scanResult.type==="success" ? "text-green-300"
                        : scanResult.type==="warning" ? "text-amber-300"
                        : "text-red-300"
                      }`}>
                        {scanResult.type==="success" ? "Check-in Successful!" : scanResult.type==="warning" ? "Already Checked In" : "Check-in Failed"}
                      </p>

                      {scanResult.volunteer && (
                        <div className="bg-white/10 rounded-2xl p-4 mt-3 text-left space-y-1.5">
                          <p className="text-white font-semibold text-lg">{scanResult.volunteer.name}</p>
                          <p className="text-gray-300 text-sm capitalize">
                            {scanResult.volunteer.role}
                            {scanResult.volunteer.institution ? ` · ${scanResult.volunteer.institution}` : ""}
                          </p>
                          {scanResult.type==="success" && scanResult.volunteer.attendedAt && (
                            <p className="text-green-300 text-xs">
                              Checked in at {format(new Date(scanResult.volunteer.attendedAt), "h:mm:ss a")}
                            </p>
                          )}
                          {scanResult.type==="warning" && scanResult.volunteer.attendedAt && (
                            <p className="text-amber-300 text-xs">
                              Previously checked in {formatDistanceToNow(new Date(scanResult.volunteer.attendedAt), { addSuffix:true })}
                            </p>
                          )}
                          {scanResult.volunteer.skills?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {scanResult.volunteer.skills?.map((s) => (
                                <span key={s} className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full">{s}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {scanResult.type==="error" && !scanResult.volunteer && (
                        <p className="text-red-300 text-sm mt-2">{scanResult.message}</p>
                      )}

                      <p className="text-gray-400 text-xs mt-4">Scanner resuming automatically...</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Scanner controls */}
            <div className="flex gap-3">
              {!scanning ? (
                <button onClick={startScanner}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-semibold text-sm transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9V5a2 2 0 012-2h4M3 15v4a2 2 0 002 2h4M15 3h4a2 2 0 012 2v4M15 21h4a2 2 0 002-2v-4"/>
                  </svg>
                  Start Camera
                </button>
              ) : (
                <button onClick={stopScanner}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold text-sm transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="6" width="12" height="12" rx="2"/>
                  </svg>
                  Stop Camera
                </button>
              )}
              <button onClick={fetchStats}
                className="px-4 py-3 rounded-2xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                Refresh
              </button>
            </div>

            <p className="text-center text-xs text-gray-600">
              Point camera at volunteer's QR code · Auto-confirms in real time
            </p>
          </div>
        )}

        {/* ════════════════════════════════════
            MANUAL CHECK-IN TAB
        ════════════════════════════════════ */}
        {activeTab === "manual" && (
          <div className="space-y-5">
            <div className="bg-gray-900 rounded-3xl border border-gray-800 p-6">
              <h2 className="text-white font-semibold mb-1">Manual Check-in</h2>
              <p className="text-gray-500 text-sm mb-5">
                Use when QR code is unavailable or camera doesn't work.
              </p>

              {/* Demo emails reference */}
              <div className="bg-blue-950/30 border border-blue-900/50 rounded-xl p-3 mb-4">
                <p className="text-blue-300 text-xs font-medium mb-1">📧 Demo emails for testing:</p>
                <p className="text-blue-400/70 text-xs">
                  alice@email.com · bob@email.com · charlie@email.com · diana@email.com · ethan@email.com
                </p>
              </div>

              <form onSubmit={handleManualCheckin} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
                    Volunteer Email Address
                  </label>
                  <input
                    type="email"
                    value={manualEmail}
                    onChange={(e) => { setManualEmail(e.target.value); setManualResult(null); }}
                    placeholder="volunteer@email.com"
                    className="w-full px-4 py-3 rounded-2xl bg-gray-800 border border-gray-700 text-white
                               placeholder:text-gray-600 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-sm"
                    autoComplete="off"
                    autoFocus
                  />
                </div>

                <button type="submit" disabled={manualLoading || !manualEmail.trim()}
                  className="w-full py-3 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-semibold
                             text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {manualLoading ? <><DarkSpinner/> Checking in...</> : "✅ Check In Volunteer"}
                </button>
              </form>

              {/* Manual result */}
              {manualResult && (
                <div className={`mt-4 rounded-2xl p-4 ${
                  manualResult.type==="success"  ? "bg-green-900/50 border border-green-700"
                  : manualResult.type==="warning"? "bg-amber-900/50 border border-amber-700"
                  : "bg-red-900/50 border border-red-700"
                }`}>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">
                      {manualResult.type==="success" ? "✅" : manualResult.type==="warning" ? "⚠️" : "❌"}
                    </span>
                    <div>
                      <p className={`font-semibold text-sm ${
                        manualResult.type==="success" ? "text-green-300"
                        : manualResult.type==="warning" ? "text-amber-300"
                        : "text-red-300"
                      }`}>
                        {manualResult.message}
                      </p>
                      {manualResult.volunteer && (
                        <div className="mt-2 space-y-0.5">
                          <p className="text-white text-sm font-medium">{manualResult.volunteer.name}</p>
                          <p className="text-gray-400 text-xs capitalize">{manualResult.volunteer.role}</p>
                          {manualResult.volunteer.attendedAt && (
                            <p className="text-gray-400 text-xs">
                              at {format(new Date(manualResult.volunteer.attendedAt), "h:mm:ss a")}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════
            RECENT CHECK-INS TAB
        ════════════════════════════════════ */}
        {activeTab === "recent" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-white font-semibold">Recent Check-ins</h2>
              <button onClick={fetchStats}
                className="text-xs text-green-400 hover:text-green-300 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                Refresh
              </button>
            </div>

            {!statsData?.recent?.length ? (
              <div className="text-center py-16 text-gray-600">
                <div className="text-4xl mb-3">🎫</div>
                <p className="text-sm">No check-ins yet</p>
              </div>
            ) : (
              statsData.recent.map((v, i) => (
                <CheckinCard key={v._id || i} volunteer={v} type="recent" onUndo={handleUndo} />
              ))
            )}
          </div>
        )}

        {/* ════════════════════════════════════
            PENDING (NOT YET CHECKED IN) TAB
        ════════════════════════════════════ */}
        {activeTab === "pending" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-white font-semibold">Not Yet Checked In</h2>
              <span className="text-xs text-amber-400 font-medium">{pending} remaining</span>
            </div>

            {!statsData?.pending?.length ? (
              <div className="text-center py-16 text-gray-600">
                <div className="text-4xl mb-3">🎉</div>
                <p className="text-sm text-green-400 font-medium">Everyone has checked in!</p>
              </div>
            ) : (
              statsData.pending.map((v, i) => (
                <CheckinCard key={v._id || i} volunteer={v} type="pending"
                  onManualCheckin={(email) => {
                    setManualEmail(email);
                    setActiveTab("manual");
                  }}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* Scanline animation CSS */}
      <style>{`
        @keyframes scanline {
          0%   { transform: translateY(0); opacity: 1; }
          50%  { transform: translateY(260px); opacity: 0.5; }
          100% { transform: translateY(0); opacity: 1; }
        }
        #qr-reader video { border-radius: 24px !important; }
        #qr-reader__scan_region { border-radius: 24px !important; }
        #qr-reader__dashboard { display: none !important; }
      `}</style>
    </Shell>
  );
}

/* ═══════════════════════════════════════
   CHECK-IN CARD (recent / pending)
═══════════════════════════════════════ */
function CheckinCard({ volunteer, type, onUndo, onManualCheckin }) {
  return (
    <div className={`rounded-2xl border p-4 flex items-center gap-3 ${
      type==="recent"
        ? "bg-green-950/40 border-green-900"
        : "bg-gray-900 border-gray-800"
    }`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
        type==="recent" ? "bg-green-900 text-green-300" : "bg-gray-800 text-gray-400"
      }`}>
        {volunteer.name?.[0]?.toUpperCase() || "?"}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-white text-sm truncate">{volunteer.name}</p>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-500 capitalize">{volunteer.role}</span>
          {volunteer.institution && (
            <span className="text-xs text-gray-600 truncate">· {volunteer.institution}</span>
          )}
          {type==="pending" && volunteer.paymentStatus === "pending" && (
            <span className="text-[10px] bg-amber-900/50 text-amber-400 px-2 py-0.5 rounded-full">
              ⚠️ Payment pending
            </span>
          )}
        </div>
        {type==="recent" && volunteer.attendedAt && (
          <p className="text-xs text-green-500 mt-0.5">
            {format(new Date(volunteer.attendedAt), "h:mm:ss a")} ·{" "}
            {formatDistanceToNow(new Date(volunteer.attendedAt), { addSuffix: true })}
          </p>
        )}
      </div>

      {type==="recent" && onUndo && volunteer._id && (
        <button onClick={() => onUndo(volunteer._id, volunteer.name)}
          title="Undo check-in"
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:bg-red-900/40 hover:text-red-400 transition-all text-sm">
          ↩
        </button>
      )}
      {type==="pending" && onManualCheckin && (
        <button onClick={() => onManualCheckin(volunteer.email)}
          className="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-green-900/50 text-gray-400 hover:text-green-400 text-xs font-medium transition-all">
          Check In
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   SMALL HELPERS
═══════════════════════════════════════ */
function Shell({ children, dark }) {
  return (
    <div className={`min-h-screen ${dark ? "bg-gray-950" : "bg-[#f5f4f0]"}`}
      style={{ fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');`}</style>
      {children}
    </div>
  );
}

function DarkStatCard({ label, value, color }) {
  const colors = {
    green:  "from-green-950/80  to-green-900/30  border-green-900/50  text-green-400",
    amber:  "from-amber-950/80  to-amber-900/30  border-amber-900/50  text-amber-400",
    gray:   "from-gray-900      to-gray-800/30   border-gray-800      text-gray-400",
  };
  return (
    <div className={`bg-gradient-to-br ${colors[color]||colors.gray} border rounded-2xl p-4 text-center`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs opacity-70 mt-0.5">{label}</p>
    </div>
  );
}

function DarkSpinner() {
  return (
    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
    </svg>
  );
}

// Simple toast function (replaces react-toastify)
function toastDemo(message) {
  // Create a simple toast notification
  const toast = document.createElement('div');
  toast.className = 'fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-3 rounded-xl shadow-lg text-sm z-50 animate-bounce';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}