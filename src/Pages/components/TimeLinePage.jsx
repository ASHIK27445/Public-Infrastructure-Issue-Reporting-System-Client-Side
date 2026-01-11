import React, { useState, useEffect, use } from 'react';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  Flag,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Edit,
  Trash2,
  TrendingUp,
  Shield,
  MessageSquare,
  Eye,
  Share2,
  Bookmark,
  ThumbsUp,
  Activity,
  Loader2,
  Crown,
  Zap,
  Image as ImageIcon,
  FileText,
  Users
} from 'lucide-react';
import { useParams, useNavigate, useOutletContext } from 'react-router';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { AuthContext } from '../AuthProvider/AuthContext';
import { toast } from 'react-toastify';

const IssueDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = use(AuthContext);
  const { citizen } = useOutletContext();

  const [issue, setIssue] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [boosting, setBoosting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchIssueDetails();
    }
  }, [id]);

  const fetchIssueDetails = async () => {
    setLoading(true);
    try {
      const response = await axiosSecure.get(`/issue/${id}/details`);
      if (response.data) {
        setIssue(response.data.issue);
        setTimeline(response.data.timeline);
      }
    } catch (error) {
      console.error('Error fetching issue details:', error);
      toast.error('Failed to load issue details');
      navigate('/dashboard/my-issues');
    } finally {
      setLoading(false);
    }
  };

  const handleBoost = async () => {
    if (issue.isBoosted) {
      toast.info('This issue is already boosted!');
      return;
    }

    if (!window.confirm('Boost this issue to High priority for 100 TK?')) return;

    setBoosting(true);
    try {
      const response = await axiosSecure.post(`/issue/${id}/boost`, {
        amount: 100
      });

      if (response.data.success) {
        toast.success('🚀 Issue boosted successfully!');
        fetchIssueDetails(); // Refresh to show updated data
      }
    } catch (error) {
      console.error('Error boosting issue:', error);
      toast.error('Failed to boost issue. Please try again.');
    } finally {
      setBoosting(false);
    }
  };

  const handleEdit = () => {
    if (issue.status !== 'Pending') {
      toast.error('You can only edit pending issues');
      return;
    }
    navigate(`/dashboard/edit-issue/${id}`);
  };

  const handleDelete = async () => {
    try {
      const response = await axiosSecure.delete(`/issue/${id}`);
      if (response.data.success) {
        toast.success('Issue deleted successfully!');
        navigate('/dashboard/my-issues');
      }
    } catch (error) {
      console.error('Error deleting issue:', error);
      toast.error('Failed to delete issue');
    }
    setShowDeleteModal(false);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'In-Progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Resolved': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Closed': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'High': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Normal': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTimelineIcon = (type) => {
    switch(type) {
      case 'created': return <FileText className="w-4 h-4" />;
      case 'assigned': return <Users className="w-4 h-4" />;
      case 'status_change': return <Activity className="w-4 h-4" />;
      case 'boost': return <TrendingUp className="w-4 h-4" />;
      case 'updated': return <Edit className="w-4 h-4" />;
      case 'comment': return <MessageSquare className="w-4 h-4" />;
      case 'deleted': return <Trash2 className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getTimelineColor = (type) => {
    switch(type) {
      case 'created': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'assigned': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'status_change': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'boost': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'updated': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'comment': return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
      case 'deleted': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getRoleBadge = (role) => {
    switch(role) {
      case 'admin': return <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full border border-red-500/30">Admin</span>;
      case 'staff': return <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/30">Staff</span>;
      case 'citizen': return <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full border border-emerald-500/30">Citizen</span>;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading issue details...</p>
        </div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Issue Not Found</h2>
          <p className="text-gray-400 mb-6">The issue you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/dashboard/my-issues')}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl text-white font-bold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>

            <div className="flex items-center space-x-3">
              {issue.isOwner && issue.status === 'Pending' && (
                <button
                  onClick={handleEdit}
                  className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors"
                  title="Edit Issue"
                >
                  <Edit className="w-5 h-5 text-blue-400" />
                </button>
              )}
              
              {issue.isOwner && (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors"
                  title="Delete Issue"
                >
                  <Trash2 className="w-5 h-5 text-red-400" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Issue Header Card */}
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 overflow-hidden">
              {/* Boosted Badge */}
              {issue.isBoosted && (
                <div className="bg-gradient-to-r from-yellow-600 to-amber-600 px-6 py-3">
                  <div className="flex items-center justify-center space-x-2 text-white">
                    <TrendingUp className="w-5 h-5" />
                    <span className="font-bold">Priority Boosted</span>
                    <Crown className="w-5 h-5" />
                  </div>
                </div>
              )}

              <div className="p-8">
                {/* Title and Badges */}
                <div className="mb-6">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold border ${getStatusColor(issue.status)}`}>
                      {issue.status}
                    </span>
                    <span className={`px-4 py-2 rounded-full text-sm font-bold border ${getPriorityColor(issue.priority)}`}>
                      {issue.priority} Priority
                    </span>
                    <span className="px-4 py-2 rounded-full text-sm font-bold border bg-purple-500/20 text-purple-400 border-purple-500/30">
                      {issue.category}
                    </span>
                  </div>

                  <h1 className="text-4xl font-black text-white mb-4 leading-tight">
                    {issue.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{issue.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(issue.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4" />
                      <span>{issue.views || 0} views</span>
                    </div>
                  </div>
                </div>

                {/* Main Image */}
                {issue.mainPhoto && (
                  <div className="mb-6 rounded-2xl overflow-hidden border border-zinc-700">
                    <img
                      src={issue.mainPhoto}
                      alt={issue.title}
                      className="w-full h-96 object-cover"
                    />
                  </div>
                )}

                {/* Description */}
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-emerald-500" />
                    <span>Description</span>
                  </h2>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {issue.description}
                  </p>
                </div>

                {/* Reporter Info */}
                <div className="border-t border-zinc-700 pt-6">
                  <h3 className="text-sm font-medium text-gray-400 mb-3">Reported By</h3>
                  <div className="flex items-center space-x-4">
                    <img
                      src={issue.reporterPhoto || 'https://via.placeholder.com/150'}
                      alt={issue.reporterName}
                      className="w-12 h-12 rounded-full border-2 border-zinc-700"
                    />
                    <div>
                      <p className="font-bold text-white">{issue.reporterName}</p>
                      <p className="text-sm text-gray-400">{issue.reporterEmail}</p>
                    </div>
                  </div>
                </div>

                {/* Community Engagement */}
                <div className="border-t border-zinc-700 mt-6 pt-6">
                  <div className="flex items-center space-x-6">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors">
                      <ThumbsUp className="w-5 h-5 text-emerald-400" />
                      <span className="text-white font-medium">{issue.upvoteCount || 0}</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors">
                      <Share2 className="w-5 h-5 text-blue-400" />
                      <span className="text-white font-medium">Share</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors">
                      <Bookmark className="w-5 h-5 text-purple-400" />
                      <span className="text-white font-medium">Save</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Section */}
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Activity className="w-6 h-6 text-emerald-500" />
                <h2 className="text-2xl font-black text-white">Issue Timeline</h2>
              </div>

              {timeline.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No timeline entries yet</p>
              ) : (
                <div className="relative">
                  {/* Timeline Line */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500/50 via-teal-500/50 to-transparent"></div>

                  {/* Timeline Items */}
                  <div className="space-y-6">
                    {timeline.map((entry, index) => (
                      <div key={entry._id} className="relative pl-16">
                        {/* Timeline Dot */}
                        <div className={`absolute left-3 top-3 w-6 h-6 rounded-full border-2 ${getTimelineColor(entry.type)} flex items-center justify-center`}>
                          {getTimelineIcon(entry.type)}
                        </div>

                        {/* Timeline Card */}
                        <div className="bg-zinc-800/50 rounded-2xl p-4 border border-zinc-700">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-bold text-white">{entry.action}</h3>
                            <span className="text-xs text-gray-500">
                              {new Date(entry.createdAt).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>

                          <p className="text-gray-300 text-sm mb-3">{entry.message}</p>

                          <div className="flex items-center space-x-2 text-xs">
                            <span className="text-gray-400">by</span>
                            {getRoleBadge(entry.updatedByRole)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* End Marker */}
                  <div className="relative pl-16 mt-8">
                    <div className="absolute left-3 top-0 w-6 h-6 rounded-full border-2 border-zinc-700 bg-zinc-900 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-zinc-600" />
                    </div>
                    <p className="text-gray-500 text-sm">Issue created</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Actions Card */}
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                {/* Boost Button */}
                {!issue.isBoosted && (
                  <button
                    onClick={handleBoost}
                    disabled={boosting}
                    className="w-full px-4 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl text-white font-bold hover:shadow-yellow-500/50 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {boosting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <TrendingUp className="w-5 h-5" />
                        <span>Boost Priority (100৳)</span>
                      </>
                    )}
                  </button>
                )}

                {issue.isBoosted && (
                  <div className="w-full px-4 py-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-yellow-400 font-bold flex items-center justify-center space-x-2">
                    <Crown className="w-5 h-5" />
                    <span>Already Boosted</span>
                  </div>
                )}
              </div>
            </div>

            {/* Staff Info Card */}
            {issue.assignedTo && (
              <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-blue-500" />
                  <span>Assigned Staff</span>
                </h3>
                
                <div className="flex items-center space-x-4">
                  <img
                    src={issue.staffPhoto || 'https://via.placeholder.com/150'}
                    alt={issue.staffName}
                    className="w-12 h-12 rounded-full border-2 border-blue-500"
                  />
                  <div>
                    <p className="font-bold text-white">{issue.staffName}</p>
                    <p className="text-sm text-gray-400">{issue.staffEmail}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Issue Stats */}
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Issue Statistics</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Timeline Events</span>
                  <span className="font-bold text-white">{timeline.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Upvotes</span>
                  <span className="font-bold text-white">{issue.upvoteCount || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Views</span>
                  <span className="font-bold text-white">{issue.views || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 rounded-3xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Delete Issue?</h3>
              <p className="text-gray-400">
                This action cannot be undone. Are you sure you want to delete this issue?
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-6 py-3 bg-zinc-700 rounded-xl text-white font-medium hover:bg-zinc-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 rounded-xl text-white font-bold hover:shadow-red-500/50 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueDetailsPage;