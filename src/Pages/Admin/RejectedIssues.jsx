import React from 'react';
import { 
  XCircle,
  Clock,
  AlertTriangle,
  MapPin,
  Calendar,
  User,
  TrendingUp
} from 'lucide-react';

const RejectedIssues = () => {
  // Mock data for rejected issues
  const rejectedIssues = [
    {
      _id: '1',
      title: 'Noisy Construction at Night',
      category: 'Building & Construction',
      status: 'Rejected',
      rejectionReason: 'Working hours are within permitted time limits',
      priority: 'Normal',
      location: '123 Construction St',
      createdAt: '2024-01-05',
      upvoteCount: 8,
      mainPhoto: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400',
      isBoosted: false
    },
    {
      _id: '2',
      title: 'Too Many Pigeons in Park',
      category: 'Parks & Recreation',
      status: 'Rejected',
      rejectionReason: 'Wildlife management is not within city jurisdiction',
      priority: 'Low',
      location: 'Central Park',
      createdAt: '2024-01-08',
      upvoteCount: 3,
      mainPhoto: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
      isBoosted: false
    },
    {
      _id: '3',
      title: 'Neighbors Dog Barks Too Much',
      category: 'Public Safety',
      status: 'Rejected',
      rejectionReason: 'Residential noise complaints require direct neighbor resolution',
      priority: 'Normal',
      location: '456 Residential Ave',
      createdAt: '2024-01-12',
      upvoteCount: 5,
      mainPhoto: 'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=400',
      isBoosted: false
    },
    {
      _id: '4',
      title: 'Tree Too Tall on Private Property',
      category: 'Other',
      status: 'Rejected',
      rejectionReason: 'Private property vegetation management is owner responsibility',
      priority: 'Low',
      location: '789 Private Lane',
      createdAt: '2024-01-15',
      upvoteCount: 2,
      mainPhoto: 'https://images.unsplash.com/photo-1517191434949-5e90cd67d2b6?w=400',
      isBoosted: true,
      boostedUntil: '2024-02-15'
    }
  ];

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Critical': return 'bg-red-500/20 text-red-400';
      case 'High': return 'bg-orange-500/20 text-orange-400';
      case 'Normal': return 'bg-emerald-500/20 text-emerald-400';
      case 'Low': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
              Rejected <span className="bg-gradient-to-r from-red-500 to-rose-500 bg-clip-text text-transparent">Issues</span>
            </h1>
            <p className="text-gray-400">Issues that have been rejected by the system</p>
          </div>
        </div>
      </div>

      {/* Rejected Issues Table */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 overflow-hidden">
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
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Issue Details</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Category</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Status</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Priority</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Boosted</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Rejection Reason</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Reported Date</th>
                </tr>
              </thead>
              <tbody>
                {rejectedIssues.map((issue) => (
                  <tr key={issue._id} className="border-b border-zinc-700 hover:bg-zinc-800/50 transition-colors">
                    <td className="py-4 px-6">
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
                    
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-medium">
                        {issue.category}
                      </span>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400">
                        <XCircle className="w-3 h-3" />
                        <span>Rejected</span>
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(issue.priority)}`}>
                        {issue.priority}
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      {issue.isBoosted ? (
                        <div className="flex items-center space-x-2">
                          <div className="p-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
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
                    
                    <td className="py-4 px-6">
                      <div className="max-w-xs">
                        <div className="text-sm text-gray-300">
                          {issue.rejectionReason}
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-400 flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                        {new Date(issue.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RejectedIssues;