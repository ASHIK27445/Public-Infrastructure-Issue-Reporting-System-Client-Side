import { useState, useEffect } from "react";
import { Sparkles, Loader2, Trophy, AlertTriangle, TrendingUp, Users, CheckCircle, Clock } from "lucide-react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

/**
 * StaffPerformanceInsights
 * Place on Admin dashboard page.
 * Fetches staff analytics from /admin/analytics then sends to AI.
 */
export default function StaffPerformanceInsights() {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    axiosSecure.get("/staff/all-performance")
      .then((res) => setStaffList(res.data || []))
      .catch(() => setStaffList(DEMO_DATA))
      .finally(() => setLoading(false));
  }, []);

  async function runAIAnalysis() {
    setAiLoading(true);
    try {
      const res = await axiosSecure.post("/api/ai/staff-insights", { staffList });
      setAiResult(res.data);
    } catch {
      setAiResult(null);
    } finally {
      setAiLoading(false);
    }
  }

  const totalResolved = staffList.reduce((s, x) => s + (x.resolvedCount || 0), 0);
  const avgRate = staffList.length
    ? Math.round(staffList.reduce((s, x) => s + (x.successRate || 0), 0) / staffList.length)
    : 0;
  const totalOverdue = staffList.reduce((s, x) => s + (x.overdueCount || 0), 0);

  const getRateBadge = (rate) => {
    if (rate >= 90) return { label: "Excellent", cls: "bg-emerald-500/20 text-emerald-400" };
    if (rate >= 75) return { label: "Good", cls: "bg-blue-500/20 text-blue-400" };
    if (rate >= 60) return { label: "Average", cls: "bg-yellow-500/20 text-yellow-400" };
    return { label: "Poor", cls: "bg-red-500/20 text-red-400" };
  };

  const getBarColor = (rate) => {
    if (rate >= 90) return "bg-emerald-500";
    if (rate >= 75) return "bg-blue-500";
    if (rate >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const insightDot = { positive: "bg-emerald-500", warning: "bg-yellow-500", action: "bg-purple-500" };
  const healthStyle = {
    Good: "bg-emerald-500/20 text-emerald-400",
    Average: "bg-yellow-500/20 text-yellow-400",
    Poor: "bg-red-500/20 text-red-400",
  };

  const sorted = [...staffList].sort((a, b) => (b.resolvedCount || 0) - (a.resolvedCount || 0));

  return (
    <div className="bg-linear-to-br from-zinc-800 to-zinc-900 min-h-screen border border-zinc-700 p-6 md:p-12 lg:p-16">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-emerald-500" />
          Staff Performance Insights
        </h3>
        {loading && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["overview", "performance", "ai"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all border ${
              activeTab === tab
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                : "border-zinc-600 text-gray-400 hover:border-zinc-500"
            }`}
          >
            {tab === "overview" ? "Overview" : tab === "performance" ? "Performance" : "AI Insights"}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: <CheckCircle className="w-4 h-4" />, num: totalResolved, label: "এই মাসে Resolved", color: "text-emerald-400" },
              { icon: <Users className="w-4 h-4" />, num: `${avgRate}%`, label: "গড় Success Rate", color: "text-blue-400" },
              { icon: <AlertTriangle className="w-4 h-4" />, num: totalOverdue, label: "Overdue Issues", color: "text-red-400" },
            ].map((s) => (
              <div key={s.label} className="bg-zinc-900/50 rounded-2xl p-4 text-center border border-zinc-700">
                <div className={`flex justify-center mb-1 ${s.color}`}>{s.icon}</div>
                <p className={`text-2xl font-black ${s.color}`}>{s.num}</p>
                <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
              <Trophy className="w-3.5 h-3.5 text-yellow-500" /> এই মাসের সেরা Staff
            </p>
            {sorted.slice(0, 5).map((staff, i) => {
              const medal = ["🥇", "🥈", "🥉"][i] || "";
              const badge = getRateBadge(staff.successRate || 0);
              return (
                <div key={staff._id || i} className="flex items-center gap-3 py-2.5 border-b border-zinc-700 last:border-0">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-zinc-700 shrink-0">
                    {staff.photoURL ? (
                      <img src={staff.photoURL} alt={staff.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm font-bold text-gray-300">
                        {medal || staff.name?.[0]}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{staff.name}</p>
                    <p className="text-sm text-gray-400">{staff.department} · {staff.resolvedCount || 0} resolved</p>
                  </div>
                  <span className={`text-sm font-bold px-2.5 py-0.5 rounded-full ${badge.cls}`}>
                    {staff.successRate || 0}%
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* PERFORMANCE TAB */}
      {activeTab === "performance" && (
        <div className="space-y-3">
          <p className="text-sm text-gray-500 uppercase tracking-wide mb-3">Resolution Rate — সকল Staff</p>
          {sorted.map((staff, i) => {
            const rate = staff.successRate || 0;
            const badge = getRateBadge(rate);
            return (
              <div key={staff._id || i} className="flex items-center gap-3 py-2 border-b border-zinc-700 last:border-0">
                <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-sm font-bold text-gray-300 shrink-0">
                  {staff.name?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white mb-1">{staff.name}</p>
                  <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${getBarColor(rate)}`} style={{ width: `${rate}%` }} />
                  </div>
                </div>
                <span className="text-sm text-gray-400 w-8 text-right">{rate}%</span>
                <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${badge.cls}`}>{badge.label}</span>
              </div>
            );
          })}

          <div className="mt-4 pt-4 border-t border-zinc-700">
            <p className="text-sm text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" /> গড় সমাধান সময় (দিন)
            </p>
            {sorted.map((staff, i) => (
              <div key={i} className="flex items-center gap-3 py-1.5">
                <p className="text-sm text-gray-400 w-28 truncate">{staff.name}</p>
                <div className="flex-1 h-2 bg-zinc-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${getBarColor(100 - (staff.avgResolutionDays || 5) * 10)}`}
                    style={{ width: `${Math.min(100, (staff.avgResolutionDays || 3) * 12)}%` }}
                  />
                </div>
                <span className="text-sm text-gray-400 w-12 text-right">{(staff.avgResolutionDays || 0).toFixed(1)}d</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI TAB */}
      {activeTab === "ai" && (
        <div>
          {!aiResult && (
            <button
              onClick={runAIAnalysis}
              disabled={aiLoading}
              className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-60 rounded-xl text-white text-sm font-bold transition-all mb-4"
            >
              {aiLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /><span>AI বিশ্লেষণ হচ্ছে...</span></>
              ) : (
                <><Sparkles className="w-4 h-4" /><span>AI দিয়ে বিশ্লেষণ করুন</span></>
              )}
            </button>
          )}

          {aiResult && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className={`text-sm font-bold px-3 py-1 rounded-full ${healthStyle[aiResult.overall_health] || "bg-blue-500/20 text-blue-400"}`}>
                  Team Health: {aiResult.overall_health}
                </span>
                <span className={`text-sm font-bold px-3 py-1 rounded-full ${aiResult.workload_balance === "Balanced" ? "bg-emerald-500/20 text-emerald-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                  {aiResult.workload_balance === "Balanced" ? "সুষম কাজের বণ্টন" : "অসুষম কাজের বণ্টন"}
                </span>
              </div>

              <div className="bg-zinc-900/50 rounded-2xl p-4 border border-zinc-700">
                <p className="text-sm text-gray-300 leading-relaxed">{aiResult.summary}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-zinc-900/50 rounded-2xl p-4 border-l-2 border-l-emerald-500 border border-zinc-700">
                  <p className="text-sm text-emerald-400 font-bold mb-1">⭐ সেরা Performer</p>
                  <p className="text-sm font-bold text-white">{aiResult.top_performer?.name}</p>
                  <p className="text-sm text-gray-400 mt-1">{aiResult.top_performer?.reason}</p>
                </div>
                <div className="bg-zinc-900/50 rounded-2xl p-4 border-l-2 border-l-red-500 border border-zinc-700">
                  <p className="text-sm text-red-400 font-bold mb-1">⚠ মনোযোগ দরকার</p>
                  <p className="text-sm font-bold text-white">{aiResult.needs_attention?.name}</p>
                  <p className="text-sm text-gray-400 mt-1">{aiResult.needs_attention?.issue}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">মূল পর্যবেক্ষণ</p>
                <div className="space-y-2">
                  {(aiResult.insights || []).map((ins, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${insightDot[ins.type] || "bg-blue-500"}`} />
                      <p className="text-sm text-gray-300 leading-relaxed">{ins.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-purple-900/20 rounded-2xl p-4 border border-purple-500/30">
                <p className="text-sm text-purple-400 font-bold mb-1">Admin সুপারিশ</p>
                <p className="text-sm text-gray-300 leading-relaxed">{aiResult.recommendation}</p>
              </div>

              <button onClick={() => setAiResult(null)} className="text-sm text-gray-500 hover:text-gray-300">
                পুনরায় বিশ্লেষণ করুন
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Demo fallback data if API fails
const DEMO_DATA = [
  { name: "Rafiq Hossain", department: "Infrastructure", resolvedCount: 31, successRate: 97, avgResolutionDays: 1.8, overdueCount: 0 },
  { name: "Nusrat Jahan", department: "Sanitation", resolvedCount: 28, successRate: 92, avgResolutionDays: 2.1, overdueCount: 1 },
  { name: "Kamal Uddin", department: "Electrical", resolvedCount: 25, successRate: 88, avgResolutionDays: 2.9, overdueCount: 1 },
  { name: "Rina Islam", department: "Safety", resolvedCount: 21, successRate: 75, avgResolutionDays: 3.8, overdueCount: 3 },
  { name: "Sabbir Ahmed", department: "Roads", resolvedCount: 14, successRate: 52, avgResolutionDays: 6.5, overdueCount: 8 },
];