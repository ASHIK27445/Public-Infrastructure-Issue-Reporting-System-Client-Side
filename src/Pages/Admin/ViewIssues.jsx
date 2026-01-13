import React, { useEffect, useState } from 'react';
import { 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  XCircle,
  RefreshCw,
  Eye,
  UserPlus,
  TrendingUp
} from 'lucide-react';
import useAxiousSecure from '../../Hooks/useAxiosSecure'

const ViewAllIssues = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [issues, setIssues] = useState([])
  const axiosSecure = useAxiousSecure()
  const issueFetch = () => {
    axiosSecure.get('/allissues')
      .then(res => setIssues(res.data))
      .catch(err => console.log(err))
  }

  useEffect(()=> {
    issueFetch()
  }, [issueFetch])
  // Mock data for issues
  // const issues = [
  //   {
  //     _id: '1',
  //     title: 'Pothole on Main Street',
  //     category: 'Road & Traffic',
  //     status: 'Pending',
  //     priority: 'High',
  //     assignedStaff: null,
  //     location: 'Main Street, Downtown',
  //     createdAt: '2024-01-10',
  //     upvoteCount: 25,
  //     mainPhoto: 'https://images.unsplash.com/photo-1561144257-e32e8c5d0a8a?w=400',
  //     isBoosted: true,
  //     boostedUntil: '2024-02-10'
  //   },
  //   {
  //     _id: '2',
  //     title: 'Street Light Not Working',
  //     category: 'Streetlight',
  //     status: 'In-Progress',
  //     priority: 'Normal',
  //     assignedStaff: {
  //       _id: 's1',
  //       name: 'John Technician',
  //       department: 'Electricity'
  //     },
  //     location: 'Maple Avenue',
  //     createdAt: '2024-01-12',
  //     upvoteCount: 15,
  //     mainPhoto: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w-400',
  //     isBoosted: false,
  //     boostedUntil: null
  //   },
  //   {
  //     _id: '3',
  //     title: 'Water Pipe Leak',
  //     category: 'Water Supply',
  //     status: 'Pending',
  //     priority: 'Critical',
  //     assignedStaff: null,
  //     location: 'River Road',
  //     createdAt: '2024-01-14',
  //     upvoteCount: 42,
  //     mainPhoto: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400',
  //     isBoosted: true,
  //     boostedUntil: '2024-02-14'
  //   },
  //   {
  //     _id: '4',
  //     title: 'Garbage Not Collected',
  //     category: 'Sanitation',
  //     status: 'Resolved',
  //     priority: 'Normal',
  //     assignedStaff: {
  //       _id: 's2',
  //       name: 'Sarah Cleaner',
  //       department: 'Sanitation'
  //     },
  //     location: 'Park Lane',
  //     createdAt: '2024-01-08',
  //     upvoteCount: 8,
  //     mainPhoto: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400',
  //     isBoosted: false,
  //     boostedUntil: null
  //   },
  //   {
  //     _id: '5',
  //     title: 'Broken Playground Equipment',
  //     category: 'Parks & Recreation',
  //     status: 'Pending',
  //     priority: 'Normal',
  //     assignedStaff: null,
  //     location: 'City Park',
  //     createdAt: '2024-01-15',
  //     upvoteCount: 12,
  //     mainPhoto: 'https://images.unsplash.com/photo-1541692641319-981cc79ee10a?w=400',
  //     isBoosted: true,
  //     boostedUntil: '2024-02-15'
  //   }
  // ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'In-Progress': return 'bg-blue-500/20 text-blue-400';
      case 'Resolved': return 'bg-emerald-500/20 text-emerald-400';
      case 'Closed': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Critical': return 'bg-red-500/20 text-red-400';
      case 'High': return 'bg-orange-500/20 text-orange-400';
      case 'Normal': return 'bg-emerald-500/20 text-emerald-400';
      case 'Low': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Pending': return <Clock className="w-3 h-3" />;
      case 'In-Progress': return <AlertTriangle className="w-3 h-3" />;
      case 'Resolved': return <CheckCircle className="w-3 h-3" />;
      case 'Closed': return <XCircle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-950 to-zinc-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                All <span className="bg-linear-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Issues</span>
              </h1>
              <p className="text-gray-400">Manage and assign issues to staff members</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 bg-zinc-800 border border-zinc-700 rounded-2xl text-gray-400 hover:text-white hover:bg-zinc-700 transition-colors disabled:opacity-50"
                title="Refresh"
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Issues Table */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 overflow-hidden">
          {/* Table Header */}
          <div className="p-6 border-b border-zinc-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">
                  All Issues ({issues.length})
                </h3>
                <p className="text-sm text-gray-400">
                  Assign staff members to unassigned issues
                </p>
              </div>
            </div>
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
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Assigned Staff</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((issue) => (
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
                      <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(issue.status)}`}>
                        {getStatusIcon(issue.status)}
                        <span>{issue.status}</span>
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
                          <div className="p-2 bg-linear-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
                            <TrendingUp className="w-4 h-4 text-purple-400" />
                          </div>
                          <div>
                            <div className="text-white text-sm font-medium">Boosted</div>
                            <div className="text-xs text-gray-400">
                              Until: {new Date(issue.boostedUntil).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-400 text-sm italic">
                          Not Boosted
                        </div>
                      )}
                    </td>
                    
                    <td className="py-4 px-6">
                      {issue.assignedStaff ? (
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-zinc-600">
                            <img 
                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(issue.assignedStaff.name)}&background=1f2937&color=10b981&bold=true`} 
                              alt={issue.assignedStaff.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="text-white font-medium text-sm">
                              {issue.assignedStaff.name}
                            </div>
                            <div className="text-xs text-gray-400">
                              {issue.assignedStaff.department}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-400 italic text-sm">
                          No staff assigned
                        </div>
                      )}
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 bg-zinc-700 rounded-lg text-gray-400 hover:text-white hover:bg-zinc-600 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {/* Only show assign button if no staff is assigned */}
                        {!issue.assignedStaff && (
                          <button className="p-2 bg-linear-to-r from-emerald-500/20 to-teal-500/20 rounded-lg text-emerald-400 hover:text-white hover:from-emerald-500/30 hover:to-teal-500/30 transition-colors">
                            <UserPlus className="w-4 h-4" />
                          </button>
                        )}
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

export default ViewAllIssues;