import React, { useState, useEffect, use } from 'react';
import { 
  Filter, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  XCircle,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  MapPin,
  Calendar,
  User,
  ChevronDown,
  Loader2,
  Shield,
  ArrowUpDown,
  RefreshCw
} from 'lucide-react';
import { AuthContext } from '../AuthProvider/AuthContext';
import useAxios from '../../Hooks/useAxios';

const ManageIssues = () => {
  const { user } = use(AuthContext);
  const axiosInstance = useAxios();
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const statuses = ['Pending', 'In Progress', 'Resolved', 'Closed'];
  const priorities = ['Critical', 'High', 'Normal', 'Low'];
  const categories = [
    'Road & Traffic',
    'Water Supply',
    'Electricity',
    'Sanitation',
    'Public Safety',
    'Parks & Recreation',
    'Building & Construction',
    'Other'
  ];

  useEffect(() => {
    if (user?.email) {
      fetchIssues();
    }
  }, [user]);

  useEffect(() => {
    if (issues.length > 0) {
      filterIssues();
    }
  }, [issues, searchTerm, filters]);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/manageissues/${user?.email}`);
      if (response.data) {
        setIssues(response.data);
        setFilteredIssues(response.data);
      }
    } catch (error) {
      console.error('Error fetching issues:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterIssues = () => {
    let result = [...issues];

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(issue => 
        issue.title?.toLowerCase().includes(term) ||
        issue.description?.toLowerCase().includes(term) ||
        issue.location?.toLowerCase().includes(term)
      );
    }

    // Apply filters
    if (filters.status) {
      result = result.filter(issue => issue.status === filters.status);
    }
    if (filters.priority) {
      result = result.filter(issue => issue.priority === filters.priority);
    }
    if (filters.category) {
      result = result.filter(issue => issue.category === filters.category);
    }

    setFilteredIssues(result);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchIssues();
  };

  const handleStatusChange = async (issueId, newStatus) => {
    try {
      const response = await axiosInstance.patch(`/issues/${issueId}/status`, {
        status: newStatus,
        updatedBy: user?.email
      });

      if (response.data.success) {
        // Update local state
        setIssues(prev => prev.map(issue => 
          issue._id === issueId ? { ...issue, status: newStatus } : issue
        ));
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (issueId) => {
    if (window.confirm('Are you sure you want to delete this issue?')) {
      try {
        const response = await axiosInstance.delete(`/issues/${issueId}`);
        if (response.data.success) {
          setIssues(prev => prev.filter(issue => issue._id !== issueId));
        }
      } catch (error) {
        console.error('Error deleting issue:', error);
      }
    }
  };

  const handleBoost = async (issueId) => {
    if (window.confirm('Boost this issue for 100 Tk?')) {
      try {
        const response = await axiosInstance.post(`/issues/${issueId}/boost`, {
          userId: user?.uid,
          amount: 100
        });

        if (response.data.success) {
          setIssues(prev => prev.map(issue => 
            issue._id === issueId ? { 
              ...issue, 
              priority: 'High',
              isBoosted: true,
              boostedAt: new Date().toISOString()
            } : issue
          ));
        }
      } catch (error) {
        console.error('Error boosting issue:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'In Progress': return 'bg-blue-500/20 text-blue-400';
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
      case 'In Progress': return <AlertTriangle className="w-3 h-3" />;
      case 'Resolved': return <CheckCircle className="w-3 h-3" />;
      case 'Closed': return <XCircle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                Manage <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Issues</span>
              </h1>
              <p className="text-gray-400">View and manage all reported issues</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 bg-zinc-800 border border-zinc-700 rounded-2xl text-gray-400 hover:text-white hover:bg-zinc-700 transition-colors disabled:opacity-50"
                title="Refresh"
              >
                {refreshing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <RefreshCw className="w-5 h-5" />
                )}
              </button>
              
              <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl text-white font-bold hover:shadow-emerald-500/50 transition-all">
                + New Issue
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search issues by title, location, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-zinc-800 border border-zinc-700 rounded-2xl text-white hover:bg-zinc-700 transition-colors"
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-2xl p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Status Filter */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-3">
                  Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {statuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilters(prev => ({ 
                        ...prev, 
                        status: prev.status === status ? '' : status 
                      }))}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center space-x-2 ${
                        filters.status === status
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                          : 'bg-zinc-700 text-gray-300 hover:bg-zinc-600'
                      }`}
                    >
                      {getStatusIcon(status)}
                      <span>{status}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority Filter */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-3">
                  Priority
                </label>
                <div className="flex flex-wrap gap-2">
                  {priorities.map((priority) => (
                    <button
                      key={priority}
                      onClick={() => setFilters(prev => ({ 
                        ...prev, 
                        priority: prev.priority === priority ? '' : priority 
                      }))}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        filters.priority === priority
                          ? `bg-gradient-to-r ${getPriorityColor(priority).replace('bg-', 'from-').replace('/20', '').replace(' text', ' to')} text-white`
                          : 'bg-zinc-700 text-gray-300 hover:bg-zinc-600'
                      }`}
                    >
                      {priority}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-3">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setFilters(prev => ({ 
                        ...prev, 
                        category: prev.category === category ? '' : category 
                      }))}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        filters.category === category
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                          : 'bg-zinc-700 text-gray-300 hover:bg-zinc-600'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            {(filters.status || filters.priority || filters.category) && (
              <div className="mt-6 pt-6 border-t border-zinc-700">
                <button
                  onClick={() => setFilters({ status: '', priority: '', category: '' })}
                  className="px-4 py-2 bg-gradient-to-r from-gray-700 to-slate-700 rounded-xl text-white font-medium hover:from-gray-600 hover:to-slate-600 transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Table Section */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading issues...</p>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 overflow-hidden">
            {/* Table Header */}
            <div className="p-6 border-b border-zinc-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    All Issues ({filteredIssues.length})
                  </h3>
                  <p className="text-sm text-gray-400">
                    Showing {filteredIssues.length} of {issues.length} issues
                  </p>
                </div>
                <div className="text-sm text-gray-400">
                  Updated just now
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-700">
                    <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Issue Details</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Status</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Priority</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Category</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Reported</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIssues.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-20 text-center">
                        <AlertTriangle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <h4 className="text-lg font-bold text-white mb-2">No Issues Found</h4>
                        <p className="text-gray-400">Try adjusting your search or filters</p>
                      </td>
                    </tr>
                  ) : (
                    filteredIssues.map((issue) => (
                      <React.Fragment key={issue._id}>
                        <tr className="border-b border-zinc-700 hover:bg-zinc-800/50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-4">
                              <div className="relative">
                                <div className="w-14 h-14 rounded-xl overflow-hidden">
                                  <img 
                                    src={issue.mainPhoto || 'https://via.placeholder.com/200'} 
                                    alt={issue.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                {issue.isBoosted && (
                                  <div className="absolute -top-2 -right-2">
                                    <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                      <TrendingUp className="w-3 h-3 text-white" />
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-bold text-white mb-1">
                                  {issue.title || 'Untitled Issue'}
                                </div>
                                <div className="text-sm text-gray-400 flex items-center">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {issue.location || 'No location specified'}
                                </div>
                                <div className="text-xs text-gray-500 flex items-center mt-1">
                                  <User className="w-3 h-3 mr-1" />
                                  {user?.displayName || 'Anonymous'}
                                </div>
                              </div>
                            </div>
                          </td>
                          
                          <td className="py-4 px-6">
                            <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(issue.status)}`}>
                              {getStatusIcon(issue.status)}
                              <span>{issue.status || 'Pending'}</span>
                            </div>
                          </td>
                          
                          <td className="py-4 px-6">
                            <div className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(issue.priority)}`}>
                              {issue.priority || 'Normal'}
                            </div>
                          </td>
                          
                          <td className="py-4 px-6">
                            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-medium">
                              {issue.category || 'Other'}
                            </span>
                          </td>
                          
                          <td className="py-4 px-6 text-gray-300 text-sm">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                              {issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : 'Unknown'}
                            </div>
                          </td>
                          
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-2">
                              <button 
                                onClick={() => setExpandedRow(expandedRow === issue._id ? null : issue._id)}
                                className="p-2 bg-zinc-700 rounded-lg text-gray-400 hover:text-white hover:bg-zinc-600 transition-colors"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              
                              <button className="p-2 bg-zinc-700 rounded-lg text-gray-400 hover:text-white hover:bg-zinc-600 transition-colors">
                                <Edit className="w-4 h-4" />
                              </button>
                              
                              <button 
                                onClick={() => handleDelete(issue._id)}
                                className="p-2 bg-zinc-700 rounded-lg text-gray-400 hover:text-red-400 hover:bg-zinc-600 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Expanded Details Row */}
                        {expandedRow === issue._id && (
                          <tr className="bg-zinc-800/30">
                            <td colSpan="6" className="px-6 py-4">
                              <div className="bg-zinc-800/50 rounded-2xl p-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                  {/* Left Column */}
                                  <div>
                                    <h4 className="text-lg font-bold text-white mb-4">Issue Description</h4>
                                    <p className="text-gray-300 leading-relaxed">
                                      {issue.description || 'No description provided.'}
                                    </p>
                                    <div className="mt-6">
                                      <h5 className="text-sm font-medium text-gray-400 mb-3">Quick Stats</h5>
                                      <div className="grid grid-cols-3 gap-4">
                                        <div className="text-center">
                                          <div className="text-2xl font-black text-emerald-500">{issue.upvotes || 0}</div>
                                          <div className="text-xs text-gray-400">Upvotes</div>
                                        </div>
                                        <div className="text-center">
                                          <div className="text-2xl font-black text-blue-500">{issue.views || 0}</div>
                                          <div className="text-xs text-gray-400">Views</div>
                                        </div>
                                        <div className="text-center">
                                          <div className="text-2xl font-black text-purple-500">{issue.comments || 0}</div>
                                          <div className="text-xs text-gray-400">Comments</div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Right Column */}
                                  <div>
                                    <h4 className="text-lg font-bold text-white mb-4">Quick Actions</h4>
                                    <div className="space-y-3">
                                      <div className="relative">
                                        <button className="w-full flex items-center justify-between p-3 bg-zinc-700 rounded-xl hover:bg-zinc-600 transition-colors group">
                                          <div className="flex items-center space-x-3">
                                            <Clock className="w-4 h-4 text-yellow-400" />
                                            <span className="text-white">Change Status</span>
                                          </div>
                                          <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-emerald-400" />
                                        </button>
                                        
                                        {/* Status Dropdown */}
                                        <div className="absolute right-0 mt-2 w-48 bg-zinc-800 border border-zinc-700 rounded-xl shadow-2xl z-10 hidden group-hover:block">
                                          <div className="p-2 space-y-1">
                                            {statuses.map((status) => (
                                              <button
                                                key={status}
                                                onClick={() => handleStatusChange(issue._id, status)}
                                                className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-zinc-700 transition-colors text-white"
                                              >
                                                <span>{status}</span>
                                                {issue.status === status && (
                                                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                                                )}
                                              </button>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <button 
                                        onClick={() => handleBoost(issue._id)}
                                        disabled={issue.isBoosted}
                                        className="w-full flex items-center justify-between p-3 bg-zinc-700 rounded-xl hover:bg-zinc-600 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        <div className="flex items-center space-x-3">
                                          <TrendingUp className={`w-4 h-4 ${issue.isBoosted ? 'text-purple-400' : 'text-purple-400'}`} />
                                          <span className={`${issue.isBoosted ? 'text-gray-400' : 'text-white'}`}>
                                            {issue.isBoosted ? 'Already Boosted' : 'Boost Priority'}
                                          </span>
                                        </div>
                                        <span className="text-xs text-emerald-400">100 Tk</span>
                                      </button>
                                      
                                      <button className="w-full flex items-center justify-between p-3 bg-zinc-700 rounded-xl hover:bg-zinc-600 transition-colors group">
                                        <div className="flex items-center space-x-3">
                                          <Shield className="w-4 h-4 text-blue-400" />
                                          <span className="text-white">Assign to Staff</span>
                                        </div>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageIssues;