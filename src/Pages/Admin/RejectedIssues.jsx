import React, { useEffect, useState } from 'react';
import useAxiousSecure from '../../Hooks/useAxiosSecure'
import { 
  XCircle,
  MapPin,
  Calendar,
  TrendingUp,
  AlarmClock,
} from 'lucide-react';

const RejectedIssues = () => {
  const [rejectedIssues, setRejectedIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const axiosSecure = useAxiousSecure()

  const issueFetch = () => {
    setLoading(true)
    axiosSecure.get('/allissues')
      .then(res => {
        // Filter only rejected issues
        const rejectedIssues = res.data.filter(issue => issue.status === 'Rejected')
        setRejectedIssues(rejectedIssues);
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      });
  }

  useEffect(()=> {
    issueFetch()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-zinc-950 to-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <div className="flex space-x-2 justify-center mb-6">
            <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
            <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
          <p className="text-gray-300 text-lg font-medium">Loading rejected issues</p>
        </div>
      </div>
    )
  }

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Critical': return 'bg-red-500/20 text-red-400';
      case 'High': return 'bg-orange-500/20 text-orange-400';
      case 'Normal': return 'bg-emerald-500/20 text-emerald-400';
      case 'Low': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const ExpandableText = ({ text, maxLength = 50, className = "" }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!text) return <span className="text-gray-500 italic">No text</span>;
  
  const shouldTruncate = text.length > maxLength;
  const displayText = isExpanded || !shouldTruncate 
    ? text 
    : text.substring(0, maxLength) + '...';
  
  return (
    <div className={`${className}`}>
      <div className="text-sm text-gray-300 whitespace-pre-line">
        {displayText}
      </div>
      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-1 text-xs text-emerald-500 hover:text-emerald-400 transition-colors"
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
};
  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-950 to-zinc-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
              Rejected <span className="bg-linear-to-r from-red-500 to-rose-500 bg-clip-text text-transparent">Issues</span>
            </h1>
            <p className="text-gray-400">Issues that have been rejected by the system</p>
          </div>
        </div>
      </div>

      {/* Rejected Issues Table */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 overflow-hidden">
          {/* Table Header */}
          <div className="p-6 border-b border-zinc-700">
            <h3 className="text-xl font-bold text-white">
              Rejected Issues ({rejectedIssues.length})
            </h3>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-700">
                  <th className="text-left py-2 px-4 text-gray-400 font-medium text-sm">Issue Details</th>
                  <th className="text-left py-2 px-4 text-gray-400 font-medium text-sm">Category</th>
                  <th className="text-left py-2 px-4 text-gray-400 font-medium text-sm">Priority</th>
                  <th className="text-left py-2 px-4 text-gray-400 font-medium text-sm">Boosted</th>
                  <th className="text-left py-2 px-4 text-gray-400 font-medium text-sm">Reported Date</th>
                  <th className="text-left py-2 px-4 text-gray-400 font-medium text-sm">Rejection Reason</th>
                  <th className="text-left py-2 px-4 text-gray-400 font-medium text-sm">Rejection Date</th>
                </tr>
              </thead>
              <tbody>
                {rejectedIssues.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center">
                      <div className="text-gray-400">
                        <XCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">No rejected issues found</p>
                        <p className="text-sm mt-1">All issues are currently active or resolved</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                rejectedIssues.map((issue) => (
                  <tr key={issue._id} className="border-b border-zinc-700 hover:bg-zinc-800/50 transition-colors">
                    <td className="py-4 pr-2 pl-3">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-14 h-14 rounded-xl overflow-hidden">
                            <img 
                              src={issue.mainPhoto} 
                              alt={issue.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-white mb-1">
                            {issue.title}
                          </div>
                          <div className="text-sm text-gray-400 flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {issue.location}
                          </div>
                          <div className="text-sm text-gray-400">
                            Upvotes: {issue.upvoteCount}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-4 px-2">
                      <div className="text-center px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-medium">
                        {issue.category}
                      </div>
                    </td>
                    
                    <td className="py-4 px-2">
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(issue.priority)}`}>
                        {issue.priority}
                      </div>
                    </td>
                    
                    <td className="py-4 px-2">
                      {issue.isBoosted ? (
                        <div className="flex items-center space-x-2">
                          <div className="p-2 bg-linear-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
                            <TrendingUp className="w-4 h-4 text-purple-400" />
                          </div>
                          <div className="text-white text-sm font-medium">Boosted</div>
                        </div>
                      ) : (
                        <div className="text-gray-400 text-sm italic">
                          Not Boosted
                        </div>
                      )}
                    </td>
                    
                    <td className="py-4 px-1">
                      {issue?.createdAt ? (
                        <>
                          <div className="text-sm text-gray-400 flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                            {new Date(issue.createdAt).toLocaleDateString()}
                          </div>

                          <div className="text-sm text-gray-400 flex items-center mt-1">
                            <AlarmClock className="w-4 h-4 mr-2 text-gray-500" />
                            {new Date(issue.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true,
                            })}
                          </div>
                        </>
                      ) : (
                        <span className="text-gray-500 italic text-sm">None</span>
                      )}
                    </td>

                    <td className="py-4 px-2">
                      <div className="max-w-xs">
                        <div className="text-sm text-gray-400 mb-1">
                          Rejected By: {issue?.rejectedBy || 'System'}
                        </div>
                        <ExpandableText 
                          text={issue.rejectedReason}
                          maxLength={60}
                          className="text-sm text-gray-300"
                        />
                      </div>
                    </td>

                    <td className="py-4 px-2">
                      {issue?.rejectedAt ? (
                        <>
                          <div className="text-sm text-gray-400 flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                            {new Date(issue.rejectedAt).toLocaleDateString()}
                          </div>

                          <div className="text-sm text-gray-400 flex items-center mt-1">
                            <AlarmClock className="w-4 h-4 mr-2 text-gray-500" />
                            {new Date(issue.rejectedAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true,
                            })}
                          </div>
                        </>
                      ) : (
                        <span className="text-gray-500 italic text-sm">None</span>
                      )}
                    </td>

                  </tr>
                ))
              )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RejectedIssues;