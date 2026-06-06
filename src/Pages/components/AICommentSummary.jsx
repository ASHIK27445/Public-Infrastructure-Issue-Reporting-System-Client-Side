import { useState } from "react";
import { Sparkles, Loader2, ChevronDown, ChevronUp } from "lucide-react";

/**
 * AICommentSummary — CommunityFix dark theme compatible
 * Props:
 *   comments: Array<{ commentText: string, commenterName: string, isToxic: boolean }>
 *   issueTitle: string
 */
export default function AICommentSummary({ comments = [], issueTitle = "" }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  const validComments = comments.filter((c) => !c.isToxic && c.commentText?.trim());

  async function generateSummary() {
    if (validComments.length < 2) return;
    setLoading(true);
    setError(null);
    setSummary(null);

    const prompt = `You are an AI analyst for CommunityFix, a civic issue reporting platform in Bangladesh.
Analyze these ${validComments.length} citizen comments about the issue: "${issueTitle || "Community Issue"}"

Comments:
${validComments.map((c, i) => `${i + 1}. [${c.commenterName || "User"}]: ${c.commentText}`).join("\n")}

Respond ONLY with a JSON object (no markdown, no backticks):
{
  "overall_sentiment": "positive" or "negative" or "mixed",
  "sentiment_breakdown": { "positive": number, "negative": number, "neutral": number },
  "summary": "2-3 sentence overall summary in Bengali",
  "key_points": [
    { "type": "complaint", "text": "Bengali text" },
    { "type": "complaint", "text": "Bengali text" },
    { "type": "request", "text": "Bengali text" },
    { "type": "impact", "text": "Bengali text" }
  ],
  "urgency_level": "Low" or "Medium" or "High" or "Critical",
  "top_concern": "The single most mentioned concern in Bengali (1 sentence)",
  "authority_recommendation": "What authority should do, in Bengali (1 sentence)"
}`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const raw = data.content.map((i) => i.text || "").join("");
      const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
      setSummary(parsed);
    } catch {
      setError("বিশ্লেষণে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }

  if (validComments.length < 2) return null;

  const total = summary
    ? (summary.sentiment_breakdown.positive +
        summary.sentiment_breakdown.negative +
        summary.sentiment_breakdown.neutral) || 1
    : 1;

  const posW = summary ? Math.round((summary.sentiment_breakdown.positive / total) * 100) : 0;
  const negW = summary ? Math.round((summary.sentiment_breakdown.negative / total) * 100) : 0;
  const neuW = summary ? 100 - posW - negW : 0;

  const urgencyStyle = {
    Low: "bg-emerald-500/20 text-emerald-400",
    Medium: "bg-yellow-500/20 text-yellow-400",
    High: "bg-orange-500/20 text-orange-400",
    Critical: "bg-red-500/20 text-red-400",
  };
  const urgencyBn = { Low: "কম জরুরি", Medium: "মাঝারি", High: "জরুরি", Critical: "অতি জরুরি" };

  const sentimentStyle = {
    positive: "bg-emerald-500/20 text-emerald-400",
    negative: "bg-red-500/20 text-red-400",
    mixed: "bg-zinc-600/50 text-gray-400",
  };
  const sentimentBn = { positive: "ইতিবাচক", negative: "নেতিবাচক", mixed: "মিশ্র" };

  const dotColor = {
    complaint: "bg-red-500",
    request: "bg-blue-500",
    impact: "bg-emerald-500",
  };

  return (
    <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-6 mb-6">
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="font-bold text-white text-sm">AI Comment Analysis</p>
            <p className="text-xs text-gray-400">{validComments.length}টি কমেন্টের স্বয়ংক্রিয় বিশ্লেষণ</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {summary && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-gray-400 hover:text-white p-1 transition-colors"
            >
              {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          )}
          {!summary && (
            <button
              onClick={generateSummary}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-60 rounded-xl text-white text-xs font-bold transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>বিশ্লেষণ হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Summary</span>
                </>
              )}
            </button>
          )}
          {summary && (
            <button
              onClick={() => { setSummary(null); setCollapsed(false); }}
              className="text-xs text-gray-500 hover:text-gray-300 px-2 py-1 transition-colors"
            >
              বন্ধ
            </button>
          )}
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {summary && !collapsed && (
        <div className="space-y-4 mt-2">
          {/* Stat cards */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { num: validComments.length, label: "মোট কমেন্ট", color: "text-white" },
              { num: summary.sentiment_breakdown.negative, label: "নেতিবাচক", color: "text-red-400" },
              { num: summary.sentiment_breakdown.positive, label: "ইতিবাচক", color: "text-emerald-400" },
            ].map((s) => (
              <div key={s.label} className="bg-zinc-900/60 rounded-2xl p-3 text-center border border-zinc-700">
                <p className={`text-2xl font-black ${s.color}`}>{s.num}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Summary + sentiment badges */}
          <div className="bg-zinc-900/50 rounded-2xl p-4 border border-zinc-700">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${sentimentStyle[summary.overall_sentiment]}`}>
                {sentimentBn[summary.overall_sentiment]}
              </span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${urgencyStyle[summary.urgency_level]}`}>
                {urgencyBn[summary.urgency_level]}
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-3">{summary.summary}</p>
            <div className="h-2 rounded-full overflow-hidden flex bg-zinc-700">
              <div className="h-full bg-emerald-500 transition-all" style={{ width: `${posW}%` }} />
              <div className="h-full bg-zinc-500 transition-all" style={{ width: `${neuW}%` }} />
              <div className="h-full bg-red-500 transition-all" style={{ width: `${negW}%` }} />
            </div>
            <div className="flex gap-4 mt-1.5 text-xs text-gray-500">
              <span><span className="text-emerald-500">■</span> ইতিবাচক {posW}%</span>
              <span><span className="text-zinc-400">■</span> নিরপেক্ষ {neuW}%</span>
              <span><span className="text-red-500">■</span> নেতিবাচক {negW}%</span>
            </div>
          </div>

          {/* Key points */}
          <div className="bg-zinc-900/50 rounded-2xl p-4 border border-zinc-700">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">মূল বিষয়গুলো</p>
            <div className="space-y-2.5">
              {(summary.key_points || []).map((p, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${dotColor[p.type] || "bg-blue-500"}`} />
                  <p className="text-sm text-gray-300 leading-relaxed">{p.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-zinc-700">
              <p className="text-xs text-gray-500 mb-1">সবচেয়ে উল্লেখিত সমস্যা</p>
              <p className="text-sm font-bold text-white">{summary.top_concern}</p>
            </div>
          </div>

          {/* Authority recommendation */}
          <div className="bg-amber-900/20 rounded-2xl p-4 border border-amber-500/30">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-amber-400">⚠</span>
              <p className="text-xs font-bold text-amber-400 uppercase tracking-wide">কর্তৃপক্ষের জন্য সুপারিশ</p>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">{summary.authority_recommendation}</p>
          </div>
        </div>
      )}

      {summary && collapsed && (
        <div className="flex flex-wrap gap-2 mt-1">
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${sentimentStyle[summary.overall_sentiment]}`}>
            {sentimentBn[summary.overall_sentiment]}
          </span>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${urgencyStyle[summary.urgency_level]}`}>
            {urgencyBn[summary.urgency_level]}
          </span>
          <span className="text-xs text-gray-500 px-2 py-1 truncate max-w-xs">— {summary.top_concern}</span>
        </div>
      )}
    </div>
  );
}