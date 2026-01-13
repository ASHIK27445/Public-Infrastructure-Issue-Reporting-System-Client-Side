import React, { useState, useEffect, use } from 'react';
import { NavLink, useParams } from 'react-router';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  AlertTriangle, 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  CheckCircle,
  TrendingUp,
  ThumbsUp,
  Shield,
  Phone,
  Mail,
  Check,
  FileText,
  Send,
  Flag,
  Loader2
} from 'lucide-react';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { AuthContext } from '../AuthProvider/AuthContext';

const IssueDetailsPage = () => {
  const {role} = use(AuthContext)
  const [comment, setComment] = useState('');
  const [upvoting, setUpvoting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [issue, setIssue] = useState([])
  const axiosSecure = useAxiosSecure()
  const {id} = useParams()

useEffect(()=>{
  axiosSecure.get(`/detailIssues/${id}`)
    .then(res =>{
      setIssue(res.data)
    })
    .catch(err =>{console.log(err)})
})


  // Demo timeline data
  const timeline = [
    {
      id: 1,
      type: 'created',
      title: 'Issue Reported',
      description: 'Issue was initially reported by citizen',
      role: 'Citizen',
      updatedBy: 'John Doe',
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      type: 'assigned',
      title: 'Assigned to Department',
      description: 'Issue assigned to Public Works Department',
      role: 'Admin',
      updatedBy: 'System Admin',
      createdAt: '2024-01-15T14:15:00Z'
    },
    {
      id: 3,
      type: 'status_change',
      title: 'Status Updated',
      description: 'Issue marked as In Progress',
      role: 'Staff',
      updatedBy: 'Sarah Johnson',
      createdAt: '2024-01-16T09:45:00Z'
    },
    {
      id: 4,
      type: 'boost',
      title: 'Priority Boosted',
      description: 'Issue priority boosted to High through payment',
      role: 'Citizen',
      updatedBy: 'John Doe',
      createdAt: '2024-01-16T11:30:00Z'
    },
    {
      id: 5,
      type: 'comment',
      title: 'New Comment',
      description: 'Road crew dispatched for inspection',
      role: 'Staff',
      updatedBy: 'Sarah Johnson',
      createdAt: '2024-01-17T08:20:00Z'
    }
  ];
  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved': return 'from-emerald-500 to-teal-500';
      case 'In Progress': return 'from-blue-500 to-cyan-500';
      case 'Pending': return 'from-yellow-500 to-amber-500';
      case 'Closed': return 'from-gray-500 to-slate-500';
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

  const getTimelineIcon = (type) => {
    switch (type) {
      case 'created': return <User className="w-5 h-5 text-emerald-500" />;
      case 'assigned': return <Shield className="w-5 h-5 text-blue-500" />;
      case 'status_change': return <CheckCircle className="w-5 h-5 text-amber-500" />;
      case 'boost': return <TrendingUp className="w-5 h-5 text-purple-500" />;
      case 'comment': return <Send className="w-5 h-5 text-gray-400" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  // Demo functions
  const handleUpvote = () => {
    setUpvoting(true);
    setTimeout(() => {
      setUpvoting(false);
      alert('Demo: Issue upvoted! (Functionality disabled in demo)');
    }, 1000);
  };

  const handleBoost = () => {
    const confirmed = window.confirm(
      'Demo: Boost this issue to High Priority for 100 Tk?\n\n' +
      'Boosted issues appear above normal issues and get faster resolution.\n\n' +
      '(Payment functionality disabled in demo)'
    );
    
    if (confirmed) {
      alert('Demo: Issue boosted to High Priority! (Functionality disabled in demo)');
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirm(false);
    alert('Demo: Issue deleted! (Functionality disabled in demo)');
  };

  const handleEdit = () => {
    alert('Demo: Edit functionality (Disabled in demo)');
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    alert(`Demo: Comment posted: "${comment}"\n(Functionality disabled in demo)`);
    setComment('');
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-950 to-zinc-900">

      {/* Header */}
      {role === 'admin' &&
      <div className="sticky top-0 z-40 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4">

          <div className="flex items-center justify-between">
            <NavLink
              to="/all-issues"
              className="inline-flex items-center space-x-3 text-gray-400 hover:text-white transition-colors group">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Issues</span>
            </NavLink>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleEdit}
                className="flex items-center space-x-2 px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 rounded-xl text-white font-bold hover:shadow-blue-500/50 transition-all"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-linear-to-r from-red-500 to-orange-500 rounded-xl text-white font-bold hover:shadow-red-500/50 transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>

        </div>
      </div>
      }

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Issue Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Issue Header */}
            <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-8">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className={`px-4 py-2 bg-linear-to-r ${getPriorityColor(issue?.priority)} rounded-full font-bold text-white text-sm`}>
                  {issue?.priority} Priority
                </div>
                <div className={`px-4 py-2 bg-linear-to-r ${getStatusColor(issue?.status)} rounded-full font-bold text-white text-sm flex items-center space-x-2`}>
                  <CheckCircle className="w-4 h-4" />
                  <span>{issue?.status}</span>
                </div>
                {issue?.isBoosted && (
                  <div className="px-4 py-2 bg-linear-to-r from-purple-500 to-pink-500 rounded-full font-bold text-white text-sm flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>Boosted</span>
                  </div>
                )}
              </div>

              <h1 className="text-4xl font-black text-white mb-4">{issue?.title}</h1>
              
              <div className="flex items-center space-x-6 text-gray-400 mb-8">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>{new Date(issue?.createdAt).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-emerald-500" />
                  <span>{issue?.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>{issue?.category}</span>
                </div>
              </div>

              {/* Issue Image */}
              <div className="relative h-96 rounded-2xl overflow-hidden mb-8">
                <img
                  src={issue?.mainPhoto}
                  alt={issue?.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-zinc-900 via-transparent to-transparent" />
                <div className="absolute bottom-4 right-4 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
                  Demo Image
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center space-x-3">
                  <FileText className="w-6 h-6 text-emerald-500" />
                  <span>Issue Description</span>
                </h3>
                <div className="bg-zinc-800/50 rounded-2xl p-6">
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                    {issue?.description}
                  </p>
                  <div className="mt-4 text-sm text-gray-500">
                    (This is demo content. All functionality is disabled.)
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-zinc-800/50 rounded-2xl p-4 text-center">
                  <div className="text-3xl font-black text-emerald-500 mb-2">{issue?.upvoteCount}</div>
                  <div className="text-sm text-gray-400">Upvotes</div>
                </div>
                <div className="bg-zinc-800/50 rounded-2xl p-4 text-center">
                  <div className="text-3xl font-black text-blue-500 mb-2">{issue?.views}</div>
                  <div className="text-sm text-gray-400">Views</div>
                </div>
                <div className="bg-zinc-800/50 rounded-2xl p-4 text-center">
                  <div className="text-3xl font-black text-amber-500 mb-2">{issue?.comments}</div>
                  <div className="text-sm text-gray-400">Comments</div>
                </div>
                <div className="bg-zinc-800/50 rounded-2xl p-4 text-center">
                  <div className="text-3xl font-black text-purple-500 mb-2">
                    {issue.isBoosted ? 'Yes' : 'No'}
                  </div>
                  <div className="text-sm text-gray-400">Priority Boost</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleUpvote}
                  disabled={upvoting}
                  className={`flex items-center space-x-3 px-6 py-3 rounded-2xl font-bold transition-all ${
                    issue.userUpvoted
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-zinc-800 text-white hover:bg-zinc-700'
                  } ${upvoting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {upvoting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <ThumbsUp className="w-5 h-5" />
                  )}
                  <span>Upvote</span>
                  <span className="bg-zinc-900 px-3 py-1 rounded-full text-sm">
                    {issue?.upvotes}
                  </span>
                </button>

                <button
                  onClick={handleBoost}
                  className="group flex items-center space-x-3 px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-white hover:shadow-purple-500/50 transition-all"
                >
                  <TrendingUp className="w-5 h-5" />
                  <span>Boost Priority</span>
                  <span className="flex items-center space-x-1 bg-purple-800 px-3 py-1 rounded-full text-sm">
                    <span>100 Tk</span>
                  </span>
                </button>

                <button 
                  onClick={() => alert('Demo: Report issue functionality')}
                  className="flex items-center space-x-3 px-6 py-3 bg-zinc-800 rounded-2xl text-white font-bold hover:bg-zinc-700 transition-all"
                >
                  <Flag className="w-5 h-5" />
                  <span>Report Issue</span>
                </button>
              </div>
            </div>

            {/* Staff Information */}
            {issue.assignedStaff && (
              <div className="bg-linear-to-br from-blue-900/20 to-cyan-900/20 rounded-3xl border border-blue-500/30 p-8">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                  <Shield className="w-6 h-6 text-blue-500" />
                  <span>Assigned Staff</span>
                </h3>
                
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-500/50">
                      <img
                        src={issue.assignedStaff.avatar}
                        alt={issue.assignedStaff.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-white mb-2">{issue.assignedStaff.name}</h4>
                    <div className="text-blue-400 font-medium mb-3">{issue.assignedStaff.department}</div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">{issue.assignedStaff.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">{issue.assignedStaff.email}</span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-400">
                      Assigned on {new Date(issue.assignedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Comment Section */}
            <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Add Comment</h3>
              
              <form onSubmit={handleCommentSubmit}>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add your comment or update about this issue... (Demo mode)"
                  className="w-full h-32 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none mb-4"
                />
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    Demo Mode - Comments are simulated
                  </div>
                  <button
                    type="submit"
                    className="flex items-center space-x-2 px-6 py-3 bg-linear-to-r from-emerald-500 to-teal-500 rounded-2xl text-white font-bold hover:shadow-emerald-500/50 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>Post Comment</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Timeline & Reporter */}
          <div className="space-y-8">
            {/* Reporter Information */}
            <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-3">
                <User className="w-5 h-5 text-emerald-500" />
                <span>Reporter</span>
              </h3>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden">
                  <img
                    src={issue?.reporterPhoto}
                    alt={issue.reporterName}
                    className="w-full h-full object-cover"
                  />
                </div>
                {
                  console.log(issue)
                }
                <div>
                  <div className="font-bold text-white">{issue?.reporterName}</div>
                  <div className="text-sm text-emerald-400">Verified Citizen</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm text-gray-400">
                  <span className="text-white">Member since:</span>{' '}
                  {new Date(issue.reporterJoined).toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-400">
                  <span className="text-white">Issues reported:</span>{' '}
                  {issue.reporterIssues}
                </div>
                <div className="text-sm text-gray-400">
                  <span className="text-white">Success rate:</span>{' '}
                  {issue.reporterSuccessRate}%
                </div>
              </div>
            </div>

            {/* Timeline Section */}
            <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-3">
                <Clock className="w-5 h-5 text-amber-500" />
                <span>Issue Timeline</span>
              </h3>
              
              <div className="space-y-6">
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-emerald-500/20" />
                  
                  {timeline.map((entry, index) => (
                    <div key={entry.id} className="relative pl-16 pb-6">
                      {/* Icon */}
                      <div className="absolute left-4 top-0 w-10 h-10 bg-zinc-900 border-2 border-emerald-500/30 rounded-full flex items-center justify-center">
                        {getTimelineIcon(entry.type)}
                      </div>
                      
                      {/* Content */}
                      <div className="bg-zinc-800/50 rounded-2xl p-4 border border-zinc-700">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-bold text-white">{entry.title}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(entry.createdAt).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </div>
                        
                        {entry.description && (
                          <p className="text-sm text-gray-400 mb-3">{entry.description}</p>
                        )}
                        
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2">
                            <div className={`px-2 py-1 rounded-full ${
                              entry.role === 'Admin' ? 'bg-red-500/20 text-red-400' :
                              entry.role === 'Staff' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-emerald-500/20 text-emerald-400'
                            }`}>
                              {entry.role}
                            </div>
                            <span className="text-gray-500">by {entry.updatedBy}</span>
                          </div>
                          <div className="text-gray-500">
                            {new Date(entry.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-linear-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Delete Issue</h3>
              <p className="text-gray-400">
                Demo Mode: This would delete the issue in production.
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-6 py-3 bg-zinc-700 rounded-2xl text-white font-bold hover:bg-zinc-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-6 py-3 bg-linear-to-r from-red-500 to-orange-500 rounded-2xl text-white font-bold hover:shadow-red-500/50 transition-all"
              >
                Delete (Demo)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueDetailsPage;