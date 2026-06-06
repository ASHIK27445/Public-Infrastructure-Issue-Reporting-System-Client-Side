import { useState } from "react";
import { Sparkles, Loader2, ChevronDown, ChevronUp, MessageSquare, ThumbsUp, AlertTriangle } from "lucide-react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

export default function AICommentSummary({ comments = [], issueTitle = "" }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [requested, setRequested] = useState(false);
  const [requestCooldown, setRequestCooldown] = useState(false);
  const axiosSecure = useAxiosSecure();

  const getAllCommentsWithReplies = () => {
    const all = [];
    
    comments.forEach(comment => {
      if (!comment.isToxic && comment.commentText?.trim()) {
        all.push({
          name: comment.commenterName || "User",
          text: comment.commentText,
          type: "comment",
          timestamp: comment.commentedAt
        });
        
        if (comment.replies && Array.isArray(comment.replies)) {
          comment.replies.forEach(reply => {
            if (!reply.isToxic && reply.repliedText?.trim()) {
              all.push({
                name: reply.replierName || "User",
                text: reply.repliedText,
                type: "reply",
                timestamp: reply.repliedAt
              });
            }
          });
        }
      }
    });
    
    return all.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  };

  const validComments = comments.filter((c) => !c.isToxic && c.commentText?.trim());
  const allInteractions = getAllCommentsWithReplies();
  const mainCommentCount = validComments.length;
  const replyCount = allInteractions.length - mainCommentCount;

  if (allInteractions.length < 2) return null;

  async function generateSummary() {
    if (requested || requestCooldown) return;
    if (allInteractions.length < 2) return;
    
    setRequested(true);
    setLoading(true);
    setError(null);
    setSummary(null);

    try {
      const res = await axiosSecure.post("/comment-summary", {
        issueTitle,
        comments: allInteractions,
        totalComments: mainCommentCount,
        totalReplies: replyCount
      });
      
      if (res.data.queued) {
        setError("Request queued. Please wait a moment...");
        setTimeout(() => {
          setRequested(false);
          setLoading(false);
          generateSummary();
        }, 2000);
        return;
      }
      
      setSummary(res.data);
      setRequestCooldown(true);
      setTimeout(() => setRequestCooldown(false), 30000);
      
    } catch (error) {
      if (error.response?.status === 429) {
        setError("AI service is busy. Please try again in a minute.");
        setTimeout(() => {
          setRequested(false);
          setRequestCooldown(false);
        }, 60000);
      } else {
        setError("Analysis failed. Please try again.");
        setRequested(false);
      }
    } finally {
      setLoading(false);
    }
  }

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

  const sentimentStyle = {
    positive: "bg-emerald-500/20 text-emerald-400",
    negative: "bg-red-500/20 text-red-400",
    mixed: "bg-zinc-600/50 text-gray-400",
  };

  const dotColor = { complaint: "bg-red-500", request: "bg-blue-500", impact: "bg-emerald-500" };

  return (
    <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-xl">
            <Sparkles className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-bold text-white">AI Analysis</h3>
            <p className="text-xs text-gray-400">
              {mainCommentCount} comments · {replyCount} replies · {allInteractions.length} total
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {summary && (
            <button onClick={() => setCollapsed(!collapsed)} className="p-2 text-gray-400 hover:text-white hover:bg-zinc-700/50 rounded-xl transition-colors">
              {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          )}
          {!summary && (
            <button
              onClick={generateSummary}
              disabled={loading || requestCooldown}
              className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-emerald-600 to-teal-600 
                hover:from-emerald-500 hover:to-teal-500 disabled:opacity-60 rounded-xl text-white text-sm 
                font-medium transition-all"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /><span>Analyzing...</span></>
              ) : requestCooldown ? (
                <><span>Please wait...</span></>
              ) : (
                <><Sparkles className="w-4 h-4" /><span>Generate Summary</span></>
              )}
            </button>
          )}
          {summary && (
            <button 
              onClick={() => { setSummary(null); setCollapsed(false); setRequested(false); }} 
              className="px-3 py-1 text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
          <p className="text-red-400 text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            {error}
          </p>
        </div>
      )}

      {/* Summary Content */}
      {summary && !collapsed && (
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { num: allInteractions.length, label: "Total", icon: MessageSquare, color: "text-white" },
              { num: summary.sentiment_breakdown.negative, label: "Negative", icon: AlertTriangle, color: "text-red-400" },
              { num: summary.sentiment_breakdown.positive, label: "Positive", icon: ThumbsUp, color: "text-emerald-400" },
            ].map((s) => (
              <div key={s.label} className="bg-zinc-900/50 rounded-2xl p-4 border border-zinc-700">
                <div className="flex items-center gap-2 mb-2">
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                  <span className="text-xs text-gray-500">{s.label}</span>
                </div>
                <p className={`text-2xl font-bold ${s.color}`}>{s.num}</p>
              </div>
            ))}
          </div>

          {/* Summary Card */}
          <div className="bg-zinc-900/50 rounded-2xl p-5 border border-zinc-700">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${sentimentStyle[summary.overall_sentiment]}`}>
                {summary.overall_sentiment}
              </span>
              <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${urgencyStyle[summary.urgency_level]}`}>
                {summary.urgency_level} Urgency
              </span>
            </div>

            {/* Summary Text */}
            <p className="text-gray-300 text-sm leading-relaxed mb-4">{summary.summary}</p>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="h-2 rounded-full overflow-hidden flex bg-zinc-700">
                <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${posW}%` }} />
                <div className="h-full bg-zinc-500 transition-all duration-500" style={{ width: `${neuW}%` }} />
                <div className="h-full bg-red-500 transition-all duration-500" style={{ width: `${negW}%` }} />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span className="text-emerald-400">Positive {posW}%</span>
                <span className="text-zinc-400">Neutral {neuW}%</span>
                <span className="text-red-400">Negative {negW}%</span>
              </div>
            </div>
          </div>

          {/* Key Points & Top Concern */}
          <div className="grid grid-cols-2 gap-4">
            {/* Key Points */}
            <div className="bg-zinc-900/50 rounded-2xl p-5 border border-zinc-700">
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">Key Points</h4>
              <div className="space-y-3">
                {(summary.key_points || []).map((p, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${dotColor[p.type] || "bg-blue-500"}`} />
                    <div>
                      <p className="text-sm text-gray-300 leading-relaxed">{p.text}</p>
                      <p className="text-[10px] text-gray-600 uppercase mt-0.5">{p.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Concern */}
            <div className="bg-zinc-900/50 rounded-2xl p-5 border border-zinc-700 flex flex-col justify-center">
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Top Concern</h4>
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                <p className="text-white font-medium leading-relaxed">{summary.top_concern}</p>
              </div>
            </div>
          </div>

          {/* Recommendation */}
          <div className="bg-zinc-900/50 rounded-2xl p-5 border border-amber-500/30">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-medium text-amber-400 uppercase tracking-wide">Recommendation</h4>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">{summary.authority_recommendation}</p>
          </div>
        </div>
      )}

      {/* Collapsed View */}
      {summary && collapsed && (
        <div className="flex flex-wrap gap-2 mt-1">
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${sentimentStyle[summary.overall_sentiment]}`}>
            {summary.overall_sentiment}
          </span>
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${urgencyStyle[summary.urgency_level]}`}>
            {summary.urgency_level} Urgency
          </span>
        </div>
      )}
    </div>
  );
}