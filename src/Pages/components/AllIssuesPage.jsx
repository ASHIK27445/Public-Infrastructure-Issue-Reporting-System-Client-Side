import React, { useState, useEffect, use } from 'react';
import { NavLink } from 'react-router';
import { 
  Search, 
  Filter, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  ThumbsUp,
  Eye,
  ArrowUp,
  ArrowDown,
  Loader2,
  Calendar,
  Circle
} from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import useAxiosSecure from '../../Hooks/useAxiosSecure'
import { AuthContext } from '../AuthProvider/AuthContext';
const AllIssuesPage = () => {
  const {mUser, user, role} = use(AuthContext)
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    priority: '',
    sortBy: 'priority'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [upvoting, setUpvoting] = useState({});
  const axiosSecure = useAxiosSecure()
  const [hasUpvoted, setHasUpvoted] = useState({})
  const [page, setPage] = useState(1)
  const [limit] = useState(8)
  const [hasMore, setHasMore] = useState(true)

  const allissuesFetch = () => {
    setLoading(true);
    axios.get(`http://localhost:3000/allissues?page=${page}&limit=${limit}`)
      .then(res => {
        setIssues(res.data);
        setFilteredIssues(res.data);
        setHasMore(res.data.length === limit)
      })
      .catch(err => {
        console.error(err);
        toast.error('Failed to fetch issues');
      })
      .finally(() => setLoading(false));
  }

  const upvotesFetch = () => {
    if(!mUser?._id) return;

    axios.get('http://localhost:3000/all-upvotes')
     .then(res => {
      // console.log(res.data);
      const upvoteMap = {}
      res.data.forEach(issue=> {
        upvoteMap[issue?._id] = !!issue.upvoteUsers[mUser._id]
      })
      setHasUpvoted(upvoteMap)
     })
  }


  useEffect(() => {
    allissuesFetch();
    upvotesFetch()
  }, [page, mUser]);

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

  const statuses = ['Pending', 'In-Progress', 'Resolved', 'Rejected', 'Working', 'Closed'];
  const priorities = ['Low', 'Normal', 'High', 'Critical'];

  // Filter and search issues
  useEffect(() => {
    let result = [...issues];

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(issue => 
        issue.title.toLowerCase().includes(term) ||
        issue.description.toLowerCase().includes(term) ||
        issue.location.toLowerCase().includes(term) ||
        issue.category.toLowerCase().includes(term)
      );
    }

    // Apply filters
    if (filters.category) result = result.filter(issue => issue.category === filters.category);
    if (filters.status) result = result.filter(issue => issue.status === filters.status);
    if (filters.priority) result = result.filter(issue => issue.priority === filters.priority);

    // Apply sorting
    switch (filters.sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'upvotes':
        result.sort((a, b) => b.upvoteCount - a.upvoteCount);
        break;
      case 'priority':
        const priorityOrder = { 'Critical': 4, 'High': 3, 'Normal': 2, 'Low': 1 };
        result.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
        break;
      default:
        break;
    }

    setFilteredIssues(result);
  }, [issues, searchTerm, filters]);

  const handleUpvote = (issue) => {
    if(!user){
      toast("login first")
      return;
    }
    if(role === 'staff'){
      toast("Staff can't give vote")
      return;
    }
    if(issue?.assgnInto === null){
      toast("The issue is not assigned yet.")
      return
    }
    if(issue?.status === 'Rejected'){
      toast("You can't upvote. Status Rejected")
      return
    }
    setUpvoting(prev => ({ ...prev, [issue._id]: true }))
    axiosSecure.post(`/upvote/${issue._id}`)
      .then((res)=> {
        if(res.data.success){
          setHasUpvoted(prev => ({ ...prev, [issue._id]: res.data.hasUpvoted }))
          setIssues(prevIssues =>
              prevIssues.map(i =>
                i._id === issue._id
                  ? { ...i, upvoteCount: res.data.upvoteCount }
                  : i
              )
            )
          setUpvoting(prev => ({ ...prev, [issue._id]: false }))
        }
      }).catch(err => console.log(err))
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: prev[key] === value ? '' : value }));
  };

  const clearFilters = () => {
    setFilters({ category: '', status: '', priority: '', sortBy: 'priority' });
    setSearchTerm('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved': return 'from-emerald-500 to-teal-500';
      case 'In-Progress': return 'from-blue-500 to-cyan-500';
      case 'Pending': return 'from-yellow-500 to-amber-500';
      case 'Closed': return 'from-gray-500 to-slate-500';
      case 'Rejected': return 'from-red-500 to-rose-500';
      case 'Working': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'from-red-500 to-orange-500';
      case 'High': return 'from-orange-500 to-yellow-500';
      case 'Normal': return 'from-emerald-500 to-teal-500';
      case 'Low': return 'from-blue-500 to-cyan-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Resolved': return <CheckCircle className="w-4 h-4" />;
      case 'In Progress': return <Clock className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-950 to-zinc-900">
      {/* Header */}
      <div className="bg-linear-to-r from-emerald-900/30 to-teal-900/30 border-b border-emerald-500/20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-4">
            All <span className="bg-linear-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Issues</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Browse, search, and filter community-reported infrastructure issues.
            Upvote important issues to help prioritize them.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <Circle className="w-4 h-4 text-emerald-500 fill-emerald-500" />
              <span>Already upvoted</span>
            </div>

            <div className="flex items-center gap-2">
              <Circle className="w-4 h-4 text-zinc-400 fill-zinc-400" />
              <span>Available for upvote</span>
            </div>

            <div className="flex items-center gap-2">
              <Circle className="w-4 h-4 text-red-500 fill-red-500" />
              <span>Rejected issue (Upvote disabled)</span>
            </div>

            <div className="flex items-center gap-2">
              <Circle className="w-4 h-4 text-blue-500 fill-blue-500" />
              <span>Your reported issue</span>
            </div>
          </div>
          
        </div>
        
      </div>

      {/* Search & Filters */}
      <div className="sticky top-0 z-40 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, description, location, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-zinc-800 border border-zinc-700 rounded-2xl text-white hover:bg-zinc-700 transition-colors"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
              {Object.values(filters).filter(v => v).length > 0 && (
                <span className="px-2 py-1 bg-emerald-500 text-xs rounded-full">
                  {Object.values(filters).filter(v => v).length}
                </span>
              )}
            </button>

            {(searchTerm || Object.values(filters).filter(v => v).length > 0) && (
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-linear-to-r from-gray-700 to-slate-700 rounded-2xl text-white hover:from-gray-600 hover:to-slate-600 transition-all"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 p-6 bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Category */}
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-3">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => handleFilterChange('category', cat)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          filters.category === cat ? 'bg-linear-to-r from-emerald-500 to-teal-500 text-white' : 'bg-zinc-700 text-gray-300 hover:bg-zinc-600'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-3">Status</label>
                  <div className="flex flex-wrap gap-2">
                    {statuses.map(status => (
                      <button
                        key={status}
                        onClick={() => handleFilterChange('status', status)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center space-x-2 transition-all ${
                          filters.status === status ? 'bg-linear-to-r from-emerald-500 to-teal-500 text-white' : 'bg-zinc-700 text-gray-300 hover:bg-zinc-600'
                        }`}
                      >
                        {getStatusIcon(status)}
                        <span>{status}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-3">Priority</label>
                  <div className="flex flex-wrap gap-2">
                    {priorities.map(priority => (
                      <button
                        key={priority}
                        onClick={() => handleFilterChange('priority', priority)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          filters.priority === priority ? `bg-linear-to-r ${getPriorityColor(priority)} text-white` : 'bg-zinc-700 text-gray-300 hover:bg-zinc-600'
                        }`}
                      >
                        {priority}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-3">Sort By</label>
                  <div className="space-y-2">
                    {[
                      { value: 'newest', label: 'Newest First', icon: <ArrowDown className="w-4 h-4" /> },
                      { value: 'oldest', label: 'Oldest First', icon: <ArrowUp className="w-4 h-4" /> },
                      { value: 'upvotes', label: 'Most Upvoted', icon: <ThumbsUp className="w-4 h-4" /> },
                      { value: 'priority', label: 'Priority Level', icon: <AlertTriangle className="w-4 h-4" /> }
                    ].map(option => (
                      <button
                        key={option.value}
                        onClick={() => handleFilterChange('sortBy', option.value)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                          filters.sortBy === option.value ? 'bg-linear-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-zinc-700 text-gray-300 hover:bg-zinc-600'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {option.icon}
                          <span>{option.label}</span>
                        </div>
                        {filters.sortBy === option.value && <div className="w-2 h-2 bg-emerald-500 rounded-full" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results & Loading */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between text-gray-400">
          <div>
            Showing <span className="text-white font-bold">{filteredIssues.length}</span> of{' '}
            <span className="text-white font-bold">{issues.length}</span> issues
          </div>
          <div className="text-sm">{loading ? 'Loading...' : 'Updated just now'}</div>
        </div>
      </div>

      {loading ? (
        <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center space-y-6">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
          <div className="text-gray-400">Loading issues...</div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-6 py-8 pb-20">
          {filteredIssues.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <AlertTriangle className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">No issues found</h3>
              <p>{searchTerm || Object.values(filters).some(f => f) ? 'Try adjusting your search or filters' : 'No issues have been reported yet'}</p>
              <button onClick={clearFilters} className="px-6 py-3 bg-linear-to-r from-emerald-500 to-teal-500 rounded-2xl text-white font-bold mt-4">
                Clear Search & Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 auto-rows-fr">
              {filteredIssues.map(issue => (
                <div key={issue._id} className="group relative bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl overflow-hidden border border-zinc-700 hover:border-emerald-500/50 transition-all duration-500 hover:scale-105 h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden shrink-0">
                    <img src={issue.mainPhoto} alt={issue.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-linear-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
                    <div className={`absolute top-4 right-4 px-4 py-2 bg-linear-to-r ${getStatusColor(issue.status)} rounded-full flex items-center space-x-2 shadow-lg`}>
                      {getStatusIcon(issue.status)}
                      <span className="text-white font-bold text-xs">{issue.status}</span>
                    </div>
                    <div className={`absolute top-4 left-4 px-4 py-2 bg-linear-to-r ${getPriorityColor(issue.priority)} rounded-full shadow-lg`}>
                      <span className="text-white font-bold text-xs">{issue.priority}</span>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <div className="mb-3">
                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-medium">{issue.category}</span>
                    </div>
                    <div className='flex flex-col grow'>
                      <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-emerald-400 transition-colors">{issue.title}</h3>
                    </div>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{issue.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-emerald-500" />
                        <span className="line-clamp-1">{issue.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mb-6">
                      <div className="w-6 h-6 rounded-full overflow-hidden">
                        <img src={issue.reporterPhoto} alt={issue.reporterName} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs text-gray-400">Reported by {issue.reporterName}</span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-zinc-700 mt-auto">
                    <button
                        onClick={() => handleUpvote(issue)}
                        disabled={
                          upvoting[issue._id] || issue.reportBy === mUser?._id || issue.status === 'Rejected'
                        }
                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                      issue.status === 'Rejected'
                        ? 'bg-linear-to-r from-red-500 to-rose-500 text-red-300 border border-red-500/30 cursor-not-allowed'
                        : issue.reportBy === mUser?._id
                        ? 'bg-blue-700 text-blue-200 border border-blue-500/30 cursor-not-allowed'
                        : hasUpvoted[issue._id]
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 '
                        : 'bg-zinc-700 text-gray-300 hover:bg-zinc-600 hover:text-white cursor-pointer'
                    }`}
                        title={
                          issue.reportBy === mUser?._id
                            ? "You cannot upvote your own issue"
                            : issue.status === 'Rejected'
                            ? "Cannot upvote a rejected issue"
                            : ""
                        }
                      >
                        {upvoting[issue._id] ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <ThumbsUp className="w-4 h-4" />
                        )}
                        <span className="font-bold">{issue.upvoteCount}</span>
                    </button>

                      <NavLink to={`/issues/${issue._id}`} className="group/btn flex items-center space-x-2 px-4 py-2 bg-linear-to-r from-emerald-500 to-teal-500 rounded-xl text-white font-bold text-sm hover:shadow-emerald-500/50 transition-all">
                        <span>View Details</span>
                        <Eye className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                      </NavLink>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex justify-center items-center space-x-2 mt-7 pb-10">
        {Array.from({ length: hasMore ? page + 1 : page }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => setPage(num)}
            className={`px-4 py-2 rounded-xl border ${
              page === num ? 'bg-emerald-500 text-white' : 'bg-zinc-700 text-gray-300 hover:bg-zinc-600'
            }`}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AllIssuesPage;
