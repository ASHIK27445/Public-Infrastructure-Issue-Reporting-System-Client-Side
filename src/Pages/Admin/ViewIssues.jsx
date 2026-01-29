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
  TrendingUp,
  Check,
  X
} from 'lucide-react';
import { toast } from 'react-toastify';
import useAxiousSecure from '../../Hooks/useAxiosSecure'
import { Link } from 'react-router';

const ViewAllIssues = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [issues, setIssues] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const axiosSecure = useAxiousSecure();

  const issueFetch = () => {
    axiosSecure.get('/allissues')
      .then(res => setIssues(res.data))
      .catch(err => console.log(err))
  }

  // console.log(issues)

  const fetchStaffList = () => {
    axiosSecure.get('/allstaff')
      .then(res => {
        const activeStaff = res.data.filter(staff => !staff.isBlocked)
        setStaffList(activeStaff)
      }).catch(err => console.log(err))
  }

  useEffect(()=> {
    issueFetch()
  }, [issues])
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
      case 'Rejected': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  }

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Critical': return 'bg-red-500/20 text-red-400';
      case 'High': return 'bg-orange-500/20 text-orange-400';
      case 'Normal': return 'bg-emerald-500/20 text-emerald-400';
      case 'Low': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Pending': return <Clock className="w-3 h-3" />;
      case 'In-Progress': return <AlertTriangle className="w-3 h-3" />;
      case 'Resolved': return <CheckCircle className="w-3 h-3" />;
      case 'Closed': return <XCircle className="w-3 h-3" />;
      case 'Rejected': return <X className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  }

  const handleRefresh = () => {
    setRefreshing(true);
    issueFetch()
    setTimeout(() => setRefreshing(false), 1000);
  }

  const openAssignModal = (issueId) => {
    fetchStaffList();
    setSelectedIssueId(issueId)
    setSelectedStaffId('');
    setShowAssignModal(true);
  }

  const handleAssignStaff = () => {
    if (!selectedStaffId) {
      toast.error("Please select a staff member");
      return;
    }

    const selectedStaff = staffList.find(staff => staff._id === selectedStaffId);
    
    const assignData = {
      issueId: selectedIssueId, // issue ID
      staffId: selectedStaffId  // staff ID
    };

    setAssignLoading(true);
    
    axiosSecure.post('/assign-staff', assignData)
        .then(res => {
          toast.success(`Assigned to ${selectedStaff.name}`);
          
          // Update specific issue in issues array
          const updateIssue = res.data.issue

          setIssues(prevIssues =>
            prevIssues.map(issue => 
              issue?._id === updateIssue?._id ? updateIssue
                : issue
            )
          )
          setShowAssignModal(false);
          setSelectedStaffId('');
          setAssignLoading(false);
        })
        .catch(err => {
          toast.error(err.response?.data?.message || "Failed to assign");
          setAssignLoading(false);
        })

  }

  const handleRejectIssue = () => {
  if (!rejectReason.trim()) {
    toast.error("Please provide a reason for rejection")
    return
  }

  setRejectLoading(true);

  const rejectData = {
    issueId: selectedIssueId,
    reason: rejectReason,
    status: 'Rejected'
  }

  axiosSecure.patch('/reject-issue', rejectData)
    .then(res => {
      toast.success("Issue rejected successfully")
      
      // Update issues state
      setIssues(prevIssues => 
        prevIssues.map(issue => 
          issue._id === selectedIssueId 
            ? { 
                ...issue, 
                status: 'Rejected',
                rejectedAt: new Date(),
                rejectReason: rejectReason
              }
            : issue
        )
      );
      
      setShowRejectModal(false)
      setRejectReason('')
      setRejectLoading(false)
    })
    .catch(err => {
      toast.error(err.response?.data?.message || "Failed to reject issue")
      setRejectLoading(false)
    })
  }
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
                  All Issues ({issues?.length})
                </h3>
                <p className="text-sm text-gray-400">
                  Assign staff members to unassigned issues
                </p>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full ">
              <thead>
                <tr className="border-b border-zinc-700">
                  <th className="text-left py-2 px-4 text-gray-400 font-medium text-sm">Issue Details</th>
                  <th className="text-left py-2 px-4 text-gray-400 font-medium text-sm">Category</th>
                  <th className="text-left py-2 px-4 text-gray-400 font-medium text-sm">Status</th>
                  <th className="text-left py-2 px-4 text-gray-400 font-medium text-sm">Priority</th>
                  <th className="text-left py-2 px-4 text-gray-400 font-medium text-sm">Boosted</th>
                  <th className="text-left py-2 px-4 text-gray-400 font-medium text-sm">Assigned Staff</th>
                  <th className="text-left py-2 px-4 text-gray-400 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {issues?.map((issue) => (
                  <tr key={issue?._id} className="border-b border-zinc-700 hover:bg-zinc-800/50 transition-colors">
                    <td className="py-2 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="relative">
                          <div className="w-14 h-14 rounded-xl overflow-hidden">
                            <img 
                              src={issue?.mainPhoto} 
                              alt={issue?.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-white mb-1">
                            {issue?.title}
                          </div>
                          <div className="text-sm text-gray-400">
                            Upvotes: {issue?.upvoteCount}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-2 px-4">
                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-medium">
                        {issue?.category}
                      </span>
                    </td>
                    
                    <td className="py-2 px-4">
                      <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(issue?.status)}`}>
                        {getStatusIcon(issue?.status)}
                        <span>{issue?.status}</span>
                      </div>
                    </td>
                    
                    <td className="py-2 px-4">
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(issue?.priority)}`}>
                        {issue?.priority}
                      </div>
                    </td>
                    
                    <td className="py-2 px-4">
                      {issue?.isBoosted ? (
                        <div className="flex items-center space-x-2">
                          <div className="p-2 bg-linear-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
                            <TrendingUp className="w-4 h-4 text-purple-400" />
                          </div>
                          <div>
                            <div className="text-white text-sm font-medium">Boosted</div>
                            <div className="text-xs text-gray-400">
                              {new Date(issue?.boostedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-400 text-sm italic">
                          Not Boosted
                        </div>
                      )}
                    </td>
                    
                    <td className="py-2 px-4">
                      {issue?.assignInto ? (
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-zinc-600">
                            <img 
                              src={issue?.assignedStaff?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(issue?.assignedStaff?.name || 'Staff')}&background=1f2937&color=10b981&bold=true`} 
                              alt={issue?.assignedStaff?.name || 'Staff'}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="text-white font-medium text-sm">
                              {issue?.assignedStaff?.name || 'Loading...'}
                            </div>
                            <div className="text-xs text-gray-400">
                              {issue?.assignedStaff?.department || ''}
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
                        <Link to={`/issues/${issue?._id}`} className="p-2 bg-zinc-700 rounded-lg text-gray-400 hover:text-white hover:bg-zinc-600 transition-colors">
                          <Eye className="w-4 h-4" />
                        </Link>

                        {/* Staff Assign*/}
                        {!issue?.assignInto && issue?.status === 'Pending' &&(
                          <button 
                          onClick={() => {
                            openAssignModal(issue?._id)
                          }}
                          disabled= {issue?.status === 'Rejected' ? true : false}
                          className={`p-2 bg-linear-to-r ${issue?.status === 'Rejected' ? 'bg-zinc-700 rounded-lg text-gray-400' : 'from-emerald-500/20 to-teal-500/20 rounded-lg text-emerald-400 hover:text-white hover:from-emerald-500/30 hover:to-teal-500/30 transition-colors'}`}>
                            <UserPlus className="w-4 h-4" />
                          </button>
                        )}

                        {/*Issue Rejection*/}
                        {issue?.status === 'Pending' && !issue?.assignInto && (
                          <button 
                            onClick={() => {
                              setSelectedIssueId(issue?._id);
                              setShowRejectModal(true);
                            }}
                            className="p-2 bg-linear-to-r from-red-500/20 to-orange-500/20 rounded-lg text-red-400 hover:text-white hover:from-red-500/30 hover:to-orange-500/30 transition-colors"
                            title="Reject Issue"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/*Open Modals*/}
          {showAssignModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl">
                {/* Modal Header */}
                <div className="p-5 border-b border-zinc-800">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">Assign Staff</h3>
                    <button 
                      onClick={() => setShowAssignModal(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">Select a staff member</p>
                </div>
                
                {/* Staff List */}
                <div className="p-5 max-h-160 overflow-y-auto">
                  <div className="space-y-3">
                    {staffList.map(staff => (
                      <div 
                        key={staff._id}
                        onClick={() => setSelectedStaffId(staff._id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedStaffId === staff._id 
                            ? 'border-emerald-500 bg-emerald-500/10' 
                            : 'border-zinc-700 bg-zinc-800 hover:border-zinc-600'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Profile Image */}
                          <div className="w-12 h-12 rounded-full overflow-hidden border border-zinc-600">
                            <img 
                              src={staff?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(staff?.name)}&background=1f2937&color=10b981`}
                              alt={staff?.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          {/* Staff? Info */}
                          <div className="flex-1">
                            <h4 className="font-bold text-white">{staff?.name}</h4>
                            <p className="text-sm text-gray-400">{staff?.dept}</p>
                            <div className="flex gap-3 mt-1 text-xs">
                              <span className="text-emerald-400">{staff?.assignIssued || 0} assigned</span>
                              <span className="text-blue-400">{staff?.resolvedIssued || 0} resolved</span>
                            </div>
                          </div>
                          
                          {/* Selection Indicator */}
                          {selectedStaffId === staff?._id && (
                            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {staffList.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No active staff members found
                    </div>
                  )}
                </div>
                
                {/* Modal Footer */}
                <div className="p-5 border-t border-zinc-800">
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowAssignModal(false)}
                      className="flex-1 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-gray-300 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleAssignStaff()}
                      disabled={!selectedStaffId || assignLoading}
                      className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg disabled:opacity-50"
                    >
                      {assignLoading ? 'Assigning...' : 'Assign Staff'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reject Issue Modal */}
          {showRejectModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl">
                {/* Modal Header */}
                <div className="p-5 border-b border-zinc-800">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold text-white">Reject Issue</h3>
                      <p className="text-sm text-gray-400 mt-1">Provide reason for rejection</p>
                    </div>
                    <button 
                      onClick={() => {
                        setShowRejectModal(false);
                        setRejectReason('');
                      }}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                {/* Reject Form */}
                <div className="p-5">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Rejection Reason *
                    </label>
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Explain why this issue is being rejected..."
                      className="w-full h-32 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors resize-none"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This reason will be visible to the reporter
                    </p>
                  </div>

                  {/* Warning Message */}
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg mb-4">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm text-red-300 font-medium">Warning</p>
                        <p className="text-xs text-red-400 mt-1">
                          Once rejected, this issue cannot be reopened. The reporter will be notified.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Modal Footer */}
                <div className="p-5 border-t border-zinc-800">
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowRejectModal(false);
                        setRejectReason('');
                      }}
                      className="flex-1 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-gray-300 rounded-lg"
                      disabled={rejectLoading}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleRejectIssue}
                      disabled={!rejectReason.trim() || rejectLoading}
                      className="flex-1 px-4 py-2.5 bg-linear-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white rounded-lg disabled:opacity-50 transition-all"
                    >
                      {rejectLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Rejecting...
                        </span>
                      ) : (
                        'Confirm Reject'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ViewAllIssues;