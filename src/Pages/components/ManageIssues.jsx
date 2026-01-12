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
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { useOutletContext, useNavigate } from 'react-router';
import { toast } from 'react-toastify';

const ManageIssues = () => {
  const { user } = use(AuthContext);
  const axiosSecure = useAxiosSecure();
  const {citizen} = useOutletContext();
  const navigate = useNavigate();
  
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
  
  // Edit Modal States (from MyIssuePage)
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingIssue, setEditingIssue] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  const statuses = ['Pending', 'In-Progress', 'Resolved', 'Closed'];
  const priorities = ['Critical', 'High', 'Normal', 'Low'];
  const categories = [
    'Road & Traffic',
    'Water Supply',
    'Electricity',
    'Sanitation',
    'Public Safety',
    'Parks & Recreation',
    'Building & Construction',
    'Streetlight',
    'Pothole',
    'Water Leak',
    'Garbage',
    'Footpath',
    'Other'
  ];

  useEffect(() => {
    if (citizen?._id) {
      fetchIssues();
    }
  }, [citizen?._id]);

  useEffect(() => {
    if (issues.length > 0) {
      filterIssues();
    } else {
      setFilteredIssues([]);
    }
  }, [issues, searchTerm, filters]);

  const fetchIssues = async () => {
    if (!citizen?._id) return;
    
    setLoading(true);
    try {
      // Logic from MyIssuePage - fetch user's own issues
      const response = await axiosSecure.get(`/myissues/${citizen._id}`);
      if (response.data) {
        setIssues(response.data);
        setFilteredIssues(response.data);
      }
    } catch (error) {
      console.error('Error fetching issues:', error);
      toast.error('Failed to load issues');
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

  // Edit logic from MyIssuePage
  const handleEditClick = (issue) => {
    // Only allow edit if status is Pending
    if (issue.status !== 'Pending') {
      toast.error('You can only edit pending issues');
      return;
    }
    setEditingIssue(issue);
    setShowEditModal(true);
  };

  // Edit submit logic from MyIssuePage
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingIssue) return;
    
    setEditLoading(true);
    
    try {
      const formData = new FormData(e.target);
      const updatedData = {
        title: formData.get('title'),
        description: formData.get('description'),
        category: formData.get('category'),
        location: formData.get('location'),
      };
      
      // Update in database
      const response = await axiosSecure.patch(
        `/issue/${editingIssue._id}`,
        updatedData
      );
      
      // Update in UI instantly
      setIssues(issues.map(issue =>
        issue._id === editingIssue._id
          ? { ...issue, ...updatedData }
          : issue
      ));
      
      toast.success('Issue updated successfully!');
      setShowEditModal(false);
      setEditingIssue(null);
      
    } catch (error) {
      toast.error('Failed to update issue');
      console.error(error);
    } finally {
      setEditLoading(false);
    }
  };

  // Delete logic from MyIssuePage
  const handleDelete = async (issueId) => {
    if (!window.confirm('Are you sure you want to delete this issue?')) return;
    
    try {
      await axiosSecure.delete(`/issue/${issueId}`);
      
      // Remove from UI instantly
      setIssues(issues.filter(issue => issue._id !== issueId));
      
      toast.success('Issue deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete issue');
      console.error(error);
    }
  };

  // View details logic from MyIssuePage
  const handleViewDetails = (issueId) => {
    navigate(`/issues/${issueId}`);
  };

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

  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-950 to-zinc-900">
      {/* Header - Same Theme */}
      <div className="sticky top-0 z-40 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                My <span className="bg-linear-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Issues</span>
              </h1>
              <p className="text-gray-400">View and manage your reported issues</p>
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
              
              <button 
                onClick={() => navigate('/report-issue')}
                className="px-6 py-3 bg-linear-to-r from-emerald-500 to-teal-500 rounded-2xl text-white font-bold hover:shadow-emerald-500/50 transition-all"
              >
                + New Issue
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters - Same Theme */}
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

        {/* Filter Panel - Same Theme */}
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
                          ? 'bg-linear-to-r from-emerald-500 to-teal-500 text-white'
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
                          ? 'bg-linear-to-r from-emerald-500 to-teal-500 text-white'
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
                          ? 'bg-linear-to-r from-emerald-500 to-teal-500 text-white'
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
                  className="px-4 py-2 bg-linear-to-r from-gray-700 to-slate-700 rounded-xl text-white font-medium hover:from-gray-600 hover:to-slate-600 transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Table Section - Same Theme */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading issues...</p>
          </div>
        ) : (
          <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 overflow-hidden">
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
                              </div>
                              <div>
                                <div className="font-bold text-white mb-1">
                                  {issue.title || 'Untitled Issue'}
                                </div>
                                <div className="text-sm text-gray-400 flex items-center">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {issue.location || 'No location specified'}
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
                                onClick={() => handleViewDetails(issue._id)}
                                className="p-2 bg-zinc-700 rounded-lg text-gray-400 hover:text-white hover:bg-zinc-600 transition-colors"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              
                              <button 
                                onClick={() => handleEditClick(issue)}
                                disabled={issue.status !== 'Pending'}
                                className="p-2 bg-zinc-700 rounded-lg text-gray-400 hover:text-white hover:bg-zinc-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title={issue.status !== 'Pending' ? 'Can only edit pending issues' : 'Edit issue'}
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              
                              <button 
                                onClick={() => handleDelete(issue._id)}
                                className="p-2 bg-zinc-700 rounded-lg text-gray-400 hover:text-red-400 hover:bg-zinc-600 transition-colors"
                                title="Delete Issue"
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
                                  <div>
                                    <h4 className="text-lg font-bold text-white mb-4">Issue Description</h4>
                                    <p className="text-gray-300 leading-relaxed">
                                      {issue.description || 'No description provided.'}
                                    </p>
                                    <div className="mt-6">
                                      <h5 className="text-sm font-medium text-gray-400 mb-3">Quick Stats</h5>
                                      <div className="grid grid-cols-3 gap-4">
                                        <div className="text-center">
                                          <div className="text-2xl font-black text-emerald-500">{issue.upvoteCount || 0}</div>
                                          <div className="text-xs text-gray-400">Upvotes</div>
                                        </div>
                                      </div>
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

      {/* Edit Issue Modal - From MyIssuePage with Same Theme */}
      {showEditModal && editingIssue && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-linear-to-br from-zinc-800 to-zinc-900 border border-zinc-700 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-zinc-700">
              <h3 className="text-2xl font-bold text-white">Edit Issue</h3>
              <p className="text-gray-400 text-sm mt-1">Update your issue details</p>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-6">
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    Title
                  </label>
                  <input 
                    type="text" 
                    name="title"
                    defaultValue={editingIssue.title}
                    className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    required
                  />
                </div>
                
                {/* Description */}
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea 
                    name="description"
                    defaultValue={editingIssue.description}
                    className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    rows="4"
                    required
                  />
                </div>
                
                {/* Category */}
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    Category
                  </label>
                  <select 
                    name="category"
                    defaultValue={editingIssue.category}
                    className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                {/* Location */}
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    Location
                  </label>
                  <input 
                    type="text" 
                    name="location"
                    defaultValue={editingIssue.location}
                    className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    required
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-4 mt-8 pt-6 border-t border-zinc-700">
                <button 
                  type="button" 
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingIssue(null);
                  }}
                  disabled={editLoading}
                  className="flex-1 px-6 py-3 bg-zinc-700 rounded-xl text-white font-medium hover:bg-zinc-600 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={editLoading}
                  className="flex-1 px-6 py-3 bg-linear-to-r from-emerald-500 to-teal-500 rounded-xl text-white font-bold hover:shadow-emerald-500/50 transition-all disabled:opacity-50"
                >
                  {editLoading ? 'Updating...' : 'Update Issue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageIssues;