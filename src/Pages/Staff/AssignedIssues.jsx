import React, { use, useEffect, useState } from 'react';
import { 
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  MoreVertical,
  MapPin,
  TrendingUp,
  Eye,
  User,
  Calendar,
  ThumbsUp,
  RefreshCw,
  Info,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router';
import { AuthContext } from '../AuthProvider/AuthContext';
import useAxiosSecure from '../../Hooks/useAxiosSecure';

const AssignedIssues = () => {
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(null);
  const { mUser, role } = use(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [assignedIssues, setAssignedIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [notification, setNotification] = useState(null);

  const [showCloseReasonModal, setShowCloseReasonModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [closeReason, setCloseReason] = useState('');

  // Status flow configuration
  const statusFlow = {
    'Pending': ['In-Progress'],
    'In-Progress': ['Working'],
    'Working': ['Resolved', 'Closed'],
    'Resolved': ['Closed'],
    'Closed': []
  };

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Fetch assigned issues
  const assignedIssuesFetch = (staffId) => {
    setLoading(true);
    axiosSecure.get(`/assigned-issues/${staffId}`)
      .then(res => {
        setAssignedIssues(res.data);
      })
      .catch(err => {
        console.log(err);
        showNotification('Failed to load issues', 'error');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (role === 'staff' && mUser?._id) {
      assignedIssuesFetch(mUser?._id);
    }
  }, [mUser?._id, role]);

  // Handle status update
  const handleStatusUpdate = async (issueId, currentStatus, newStatus) => {
    const allowedTransitions = statusFlow[currentStatus] || [];
    if (!allowedTransitions.includes(newStatus)) {
      showNotification(`Invalid status transition: ${currentStatus} → ${newStatus}`, 'error');
      return;
    }

    setUpdatingStatus(issueId);
    
    try {
      const response = await axiosSecure.patch(`/update-issue-status/${issueId}`, {
        newStatus: newStatus
      });

      if (response.data.modifiedCount > 0) {
        // Update local state with new status and updatedAt
        setAssignedIssues(prev => prev.map(issue => {
          if (issue._id === issueId) {
            return {
              ...issue,
              status: newStatus,
              updatedAt: new Date().toISOString()
            };
          }
          return issue;
        }));

        showNotification(`Status updated to ${newStatus} successfully!`, 'success');
      } else {
        showNotification('Failed to update status. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      showNotification('Error updating status. Please try again.', 'error');
    } finally {
      setUpdatingStatus(null);
      setStatusDropdownOpen(null);
    }
  };

  // Get next available status options
  const getNextStatusOptions = (currentStatus) => {
    return statusFlow[currentStatus] || [];
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'In-Progress': return 'bg-blue-500/20 text-blue-400';
      case 'Working': return 'bg-purple-500/20 text-purple-400';
      case 'Resolved': return 'bg-emerald-500/20 text-emerald-400';
      case 'Closed': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Pending': return <Clock className="w-3 h-3" />;
      case 'In-Progress': return <AlertCircle className="w-3 h-3" />;
      case 'Working': return <AlertCircle className="w-3 h-3" />;
      case 'Resolved': return <CheckCircle className="w-3 h-3" />;
      case 'Closed': return <XCircle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
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

  const toggleStatusDropdown = (issueId) => {
    setStatusDropdownOpen(statusDropdownOpen === issueId ? null : issueId);
  };

  const getStatusButtonText = (currentStatus) => {
    const nextOptions = getNextStatusOptions(currentStatus);
    if (nextOptions.length === 0) {
      return 'Completed';
    }
    return 'Change Status';
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-zinc-950 to-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-300">Loading your assigned issues...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-950 to-zinc-900">
      {/* Notification */}
      {/* Replace the notification div with this centered version: */}
      {notification && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-xl border shadow-2xl ${
          notification.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          <div className="flex items-center space-x-2">
            {notification.type === 'success' ? 
              <CheckCircle className="w-5 h-5" /> : 
              <AlertCircle className="w-5 h-5" />
            }
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Add this modal near the notification */}
{showCloseReasonModal && selectedIssue && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-2xl border border-zinc-700 p-6 max-w-md w-full mx-4">
      <h3 className="text-xl font-bold text-white mb-2">Reason for Closing</h3>
      <p className="text-gray-400 mb-4">
        Why are you closing issue "{selectedIssue.title}" without resolving it?
      </p>
      
      <textarea
        value={closeReason}
        onChange={(e) => setCloseReason(e.target.value)}
        placeholder="Please provide a reason (e.g., Duplicate issue, Cannot be fixed, Not valid, etc.)"
        className="w-full h-32 p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 mb-4"
        required
      />
      
      <div className="flex space-x-3">
        <button
          onClick={() => {
            setShowCloseReasonModal(false);
            setSelectedIssue(null);
            setCloseReason('');
          }}
          className="flex-1 px-4 py-2 bg-zinc-700 text-gray-300 rounded-lg hover:bg-zinc-600 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            if (!closeReason.trim()) {
              showNotification('Please provide a reason for closing', 'error');
              return;
            }
            
            // First update status to Closed
            handleStatusUpdate(selectedIssue._id, selectedIssue.status, 'Closed');
            
            // Then you might want to save the close reason to backend
            // You can add another API call here if needed
            
            setShowCloseReasonModal(false);
            setSelectedIssue(null);
            setCloseReason('');
            
            // Show additional notification
            showNotification(`Issue closed. Reason: ${closeReason}`, 'info');
          }}
          className="flex-1 px-4 py-2 bg-linear-to-r from-red-500 to-orange-500 text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          Confirm Close
        </button>
      </div>
    </div>
  </div>
)}

      {/* Header */}
      <div className="sticky top-0 z-40 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-full mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">
                Assigned <span className="bg-linear-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Issues</span>
              </h1>
              <p className="text-gray-400 text-sm sm:text-base">Issues assigned to you for resolution</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-2xl">
                <span className="text-white font-bold">{assignedIssues.length}</span>
                <span className="text-gray-400 ml-2">Issues</span>
              </div>
              <button 
                onClick={() => mUser?._id && assignedIssuesFetch(mUser._id)}
                className="p-2 bg-zinc-800 border border-zinc-700 rounded-xl hover:bg-zinc-700 transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Table Container */}
      <div className="max-w-full mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 overflow-hidden">
          {/* Table Header */}
          <div className="p-4 sm:p-6 border-b border-zinc-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  Your Assigned Issues
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm">
                  Click "Change Status" to update issue progress
                </p>
              </div>
              <div className="text-xs text-gray-400">
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <div className="flex items-center">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500 mr-1 sm:mr-2"></div>
                    <span className="text-xs">Pending</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-500 mr-1 sm:mr-2"></div>
                    <span className="text-xs">In-Progress</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-purple-500 mr-1 sm:mr-2"></div>
                    <span className="text-xs">Working</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile scroll indicator */}
          <div className="lg:hidden px-4 py-2 bg-zinc-800/50 border-b border-zinc-700 flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center space-x-2">
              <ChevronLeft className="w-4 h-4" />
              <span>Scroll horizontally</span>
              <ChevronRight className="w-4 h-4" />
            </div>
            <div className="text-gray-400 text-xs">
              Showing {assignedIssues.length} issues
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px] lg:min-w-0">
              <thead>
                <tr className="border-b border-zinc-700">
                  <th className="text-left py-3 px-4 sm:py-4 sm:px-6 text-gray-400 font-medium text-xs sm:text-sm whitespace-nowrap">Issue Details</th>
                  <th className="text-left py-3 px-4 sm:py-4 sm:px-6 text-gray-400 font-medium text-xs sm:text-sm whitespace-nowrap">Category</th>
                  <th className="text-left py-3 px-4 sm:py-4 sm:px-6 text-gray-400 font-medium text-xs sm:text-sm whitespace-nowrap">Status</th>
                  <th className="text-left py-3 px-4 sm:py-4 sm:px-6 text-gray-400 font-medium text-xs sm:text-sm whitespace-nowrap">Priority</th>
                  <th className="text-left py-3 px-4 sm:py-4 sm:px-6 text-gray-400 font-medium text-xs sm:text-sm whitespace-nowrap">Reporter</th>
                  <th className="text-left py-3 px-4 sm:py-4 sm:px-6 text-gray-400 font-medium text-xs sm:text-sm whitespace-nowrap">Updated At</th>
                  <th className="text-left py-3 px-4 sm:py-4 sm:px-6 text-gray-400 font-medium text-xs sm:text-sm whitespace-nowrap">Boosted</th>
                  <th className="text-left py-3 px-4 sm:py-4 sm:px-6 text-gray-400 font-medium text-xs sm:text-sm whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assignedIssues.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-12 px-6 text-center text-gray-400">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
                          <Info className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-2">No Issues Assigned</h3>
                        <p className="text-sm">You don't have any issues assigned to you yet.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  assignedIssues.map((issue) => {
                    const nextStatusOptions = getNextStatusOptions(issue.status);
                    const canChangeStatus = nextStatusOptions.length > 0;
                    
                    return (
                      <tr key={issue._id} className="border-b border-zinc-700 hover:bg-zinc-800/50 transition-colors">
                        {/* Issue Details */}
                        <td className="py-3 px-4 sm:py-4 sm:px-6">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl overflow-hidden flex-shrink-0">
                              <img 
                                src={issue.mainPhoto || 'https://images.unsplash.com/photo-1561144257-e32e8c5d0a8a?w=400'} 
                                alt={issue.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-white text-sm sm:text-base mb-1 truncate">
                                {issue.title}
                              </div>
                              <div className="text-xs sm:text-sm text-gray-400 flex items-center mb-1">
                                <MapPin className="w-3 h-3 mr-1 shrink-0" />
                                <span className="truncate">{issue.location}</span>
                              </div>
                              <div className="flex items-center space-x-3 text-xs text-gray-400">
                                <div className="flex items-center">
                                  <ThumbsUp className="w-3 h-3 mr-1" />
                                  {issue.upvoteCount || 0}
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  {issue.assignedStaff?.assignedAt ? 
                                    new Date(issue.assignedStaff.assignedAt).toLocaleDateString('en-US', { 
                                      month: 'short', 
                                      day: 'numeric' 
                                    }) : 
                                    'N/A'}
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        
                        {/* Category */}
                        <td className="py-3 px-4 sm:py-4 sm:px-6">
                          <span className="px-2 sm:px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-medium whitespace-nowrap">
                            {issue.category}
                          </span>
                        </td>
                        
                        {/* Status */}
                        <td className="py-3 px-4 sm:py-4 sm:px-6">
                          <div className={`inline-flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(issue.status)} whitespace-nowrap`}>
                            {getStatusIcon(issue.status)}
                            <span>{issue.status}</span>
                          </div>
                        </td>
                        
                        {/* Priority */}
                        <td className="py-3 px-4 sm:py-4 sm:px-6">
                          <div className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(issue.priority)} whitespace-nowrap`}>
                            {issue.priority}
                          </div>
                        </td>
                        
                        {/* Reporter */}
                        <td className="py-3 px-4 sm:py-4 sm:px-6">
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-zinc-600 flex-shrink-0">
                              <img 
                                src={issue.reporter?.photoURL || `https://ui-avatars.com/api/?name=${issue.reporter?.name || 'User'}&background=1f2937&color=10b981`} 
                                alt={issue.reporter?.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="text-white text-xs sm:text-sm font-medium truncate">
                                {issue.reporter?.name || 'Unknown'}
                              </div>
                            </div>
                          </div>
                        </td>
                        
                        {/* Updated At */}
                        <td className="py-3 px-4 sm:py-4 sm:px-6">
                          <div className="flex flex-col">
                            <div className="text-gray-300 text-xs sm:text-sm font-medium whitespace-nowrap">
                              {formatDate(issue.updatedAt)}
                            </div>
                            {issue.updatedAt && (
                              <div className="text-xs text-gray-400 whitespace-nowrap">
                                {new Date(issue.updatedAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </div>
                            )}
                          </div>
                        </td>
                        
                        {/* Boosted */}
                        <td className="py-3 px-4 sm:py-4 sm:px-6">
                          {issue.isBoosted ? (
                            <div className="flex items-center space-x-2">
                              <div className="p-1 sm:p-2 bg-linear-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
                                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
                              </div>
                              <div className="text-white text-xs sm:text-sm font-medium whitespace-nowrap">Boosted</div>
                            </div>
                          ) : (
                            <div className="text-gray-400 text-xs sm:text-sm italic whitespace-nowrap">
                              Not Boosted
                            </div>
                          )}
                        </td>
                        
                        {/* Actions */}
                        <td className="py-3 px-4 sm:py-4 sm:px-6">
                          <div className="space-y-2">
                            {/* Status Change Button */}
                            <div className="relative">
                              <button
                                onClick={() => canChangeStatus && toggleStatusDropdown(issue._id)}
                                disabled={!canChangeStatus || updatingStatus === issue._id}
                                className={`w-full flex items-center justify-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-bold transition-all text-xs sm:text-sm ${
                                  canChangeStatus 
                                    ? 'bg-linear-to-r from-blue-500 to-cyan-500 text-white hover:shadow-blue-500/50'
                                    : 'bg-zinc-700 text-gray-400 cursor-not-allowed'
                                } ${updatingStatus === issue._id ? 'opacity-50' : ''}`}
                              >
                                {updatingStatus === issue._id ? (
                                  <>
                                    <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-t-2 border-b-2 border-white"></div>
                                    <span className="truncate">Updating...</span>
                                  </>
                                ) : (
                                  <>
                                    <MoreVertical className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                    <span className="truncate">{getStatusButtonText(issue.status)}</span>
                                  </>
                                )}
                              </button>
                              
                              {/* Dropdown Menu */}
                              {statusDropdownOpen === issue._id && canChangeStatus && (
                                <>
                                  <div 
                                    className="fixed inset-0 z-40"
                                    onClick={() => setStatusDropdownOpen(null)}
                                  />
                                  
                                  <div className="fixed z-50 mt-1 sm:mt-2 w-40 sm:w-48 bg-zinc-800 border border-zinc-700 rounded-xl shadow-2xl">
                                    <div className="py-1">
                                      <div className="px-3 sm:px-4 py-2 border-b border-zinc-700">
                                        <p className="text-xs text-gray-400">Current: <span className="font-bold text-white">{issue.status}</span></p>
                                      </div>
                                      
                                      {nextStatusOptions.includes('In-Progress') && (
                                        <button
                                          onClick={() => handleStatusUpdate(issue._id, issue.status, 'In-Progress')}
                                          className="w-full text-left px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-300 hover:bg-zinc-700 hover:text-white transition-colors flex items-center space-x-2 sm:space-x-3"
                                        >
                                          <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
                                          <span>In-Progress</span>
                                        </button>
                                      )}
                                      
                                      {nextStatusOptions.includes('Working') && (
                                        <button
                                          onClick={() => handleStatusUpdate(issue._id, issue.status, 'Working')}
                                          className="w-full text-left px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-300 hover:bg-zinc-700 hover:text-white transition-colors flex items-center space-x-2 sm:space-x-3"
                                        >
                                          <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500 flex-shrink-0" />
                                          <span>Working</span>
                                        </button>
                                      )}
                                      
                                      {nextStatusOptions.includes('Resolved') && (
                                        <button
                                          onClick={() => handleStatusUpdate(issue._id, issue.status, 'Resolved')}
                                          className="w-full text-left px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-300 hover:bg-zinc-700 hover:text-white transition-colors flex items-center space-x-2 sm:space-x-3"
                                        >
                                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-500 flex-shrink-0" />
                                          <span>Resolved</span>
                                        </button>
                                      )}
                                      
{nextStatusOptions.includes('Closed') && (
  <button
    onClick={() => {
      if (issue.status === 'Working') {
        // If going from Working → Closed, show reason modal
        setSelectedIssue(issue);
        setShowCloseReasonModal(true);
        setStatusDropdownOpen(null);
      } else {
        // If going from Resolved → Closed, no need for reason
        handleStatusUpdate(issue._id, issue.status, 'Closed');
      }
    }}
    className="w-full text-left px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-300 hover:bg-zinc-700 hover:text-white transition-colors flex items-center space-x-2 sm:space-x-3"
  >
    <XCircle className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
    <span>Close Issue</span>
  </button>
)}
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                            
                            {/* View Details Button */}
                            <Link 
                              to={`/issues/${issue._id}`}
                              className="w-full flex items-center justify-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-zinc-700 rounded-xl text-xs sm:text-sm text-gray-300 hover:text-white hover:bg-zinc-600 transition-colors"
                            >
                              <Eye className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span className="truncate">View Details</span>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile scroll indicator footer */}
          <div className="lg:hidden px-4 py-2 bg-zinc-800/50 border-t border-zinc-700 text-center">
            <div className="text-xs text-gray-400">
              Scroll horizontally to see all columns
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignedIssues;