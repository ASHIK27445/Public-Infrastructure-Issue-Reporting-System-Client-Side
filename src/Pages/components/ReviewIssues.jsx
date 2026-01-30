import React, { useEffect, useState } from 'react';
import { 
  Eye,
  Check,
  X,
  AlertCircle,
  Filter,
  User,
  Clock,
  Calendar,
  MapPin,
  RefreshCw,
  AlertTriangle,
  Search
} from 'lucide-react';
import { Link } from 'react-router';
import useAxiosSecure from '../../Hooks/useAxiosSecure';

const ReviewIssues = () => {
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [reviewIssues, setReviewIssues] = useState([])
  const axiosSecure = useAxiosSecure()

  //for pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [search, setSearch] = useState('')
  const [isReviewedFilter, setIsReviewedFilter] = useState('')


  useEffect(()=>{
    axiosSecure.get( `/review-issues?page=${currentPage}&isReviewed=${isReviewedFilter}&search=${search}`)
        .then(res=> {
            console.log(res.data)
            setReviewIssues(res.data.result)
            setTotalItems(res.data.total)
            setTotalPages(Math.ceil(res.data.total/8))
        }).catch(err=> console.log(err))
  }, [axiosSecure, currentPage, isReviewedFilter, search])
  
  const openApproveModal = (issueId) => {
    setSelectedIssueId(issueId);
    setShowApproveModal(true);
  };

  const openRejectModal = (issueId) => {
    setSelectedIssueId(issueId);
    setShowRejectModal(true);
  };

  const handleIssuesReview = () => {
    if (!selectedIssueId) return
    const issue = reviewIssues.find(i => i._id === selectedIssueId)
    if (!issue) return

    setActionLoading(true)
    const newReviewValue = !issue?.isReviewed

    axiosSecure.patch(`/update-review/${selectedIssueId}`, {isReviewed: newReviewValue})
        .then(res => {
            console.log(res.data)
            if(res.data.modifiedCount > 0){
              setReviewIssues(prev=> prev.map(i=> 
                i._id === selectedIssueId ? {...i, isReviewed: newReviewValue} : i))
            }
            setShowApproveModal(false)
            setShowRejectModal(false)
        }).catch(err => console.log(err))
          .finally(()=> setActionLoading(false))
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-950 to-zinc-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                Review <span className="bg-linear-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Issues</span>
              </h1>
              <p className="text-gray-400">Review and approve or reject submitted issues</p>
            </div>
            
            <div className="flex items-center space-x-4">
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <span className="text-gray-300 font-medium">Filter by:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setIsReviewedFilter('')
                }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${isReviewedFilter === '' ? 'bg-blue-500 text-white' : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'}`}
              >
                All Issues
              </button>
              <button
                onClick={() => setIsReviewedFilter('true')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${isReviewedFilter === 'true' ? 'bg-emerald-500 text-white' : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'}`}
              >
                Reviewed
              </button>
              <button
                onClick={() => setIsReviewedFilter('false')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${isReviewedFilter === 'false' ? 'bg-yellow-500 text-white' : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'}`}
              >
                Not Reviewed
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search issues..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
            </div>
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
                  Issues for Review ({totalItems})
                </h3>
                <p className="text-sm text-gray-400">
                  Review submitted issues and take action
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
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Submitted Date</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {
                  reviewIssues.length > 0 ?
                (reviewIssues.map((issue) => (
                    <tr key={issue._id} className="border-b border-zinc-700 hover:bg-zinc-800/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <div className="w-14 h-14 rounded-xl overflow-hidden">
                              <img 
                                src={issue?.mainPhoto} 
                                alt={issue.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold text-white mb-1">
                              {issue.title}
                            </div>
                            <div className="text-sm text-gray-400 flex items-center gap-2">
                              <MapPin className="w-3 h-3" />
                              {issue.location}
                            </div>
                            <div className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                              {issue.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-medium">
                          {issue.category}
                        </span>
                      </td>
                      
                      <td className="py-4 px-6">
                        <div className="text-gray-300 text-sm flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          {new Date(issue.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          {/* View Button */}
                          <Link 
                            to={`/issues/${issue._id}`} 
                            className="p-2 bg-zinc-700 rounded-lg text-gray-400 hover:text-white hover:bg-zinc-600 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          {issue?.isReviewed === false && (
                            <button 
                              onClick={() => openApproveModal(issue._id)}
                              className="p-2 bg-linear-to-r from-emerald-500/20 to-teal-500/20 rounded-lg text-emerald-400 hover:text-white hover:from-emerald-500/30 hover:to-teal-500/30 transition-colors"
                              title="Approve Issue"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}

                          {issue?.isReviewed === true && (
                            <button 
                              onClick={() => openRejectModal(issue._id)}
                              className="p-2 bg-linear-to-r from-red-500/20 to-orange-500/20 rounded-lg text-red-400 hover:text-white hover:from-red-500/30 hover:to-orange-500/30 transition-colors"
                              title="Reject Issue"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))) : (    
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-gray-400">
                      No reviewed issues found.
                    </td>
                  </tr>)
                }

              </tbody>
            </table>

            {/* Windowed Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-6 border-t border-zinc-700">
                {/* Info */}
                <div className="text-sm text-gray-400">
                  Page {currentPage} of {totalPages}
                </div>

                {/* Page Buttons */}
                <div className="flex items-center gap-2">
                  {/* Previous */}
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-zinc-800 text-gray-300 rounded-lg hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {/* First page */}
                  <button
                    onClick={() => setCurrentPage(1)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      currentPage === 1
                        ? 'bg-blue-500 text-white'
                        : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
                    }`}
                  >
                    1
                  </button>

                  {/* Left ellipsis */}
                  {currentPage > 4 && <span className="px-2 text-gray-400">…</span>}

                  {/* Pages around current */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(pageNum => pageNum > 1 && pageNum < totalPages)
                    .filter(pageNum => Math.abs(pageNum - currentPage) <= 2)
                    .map(pageNum => (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium ${
                          currentPage === pageNum
                            ? 'bg-blue-500 text-white'
                            : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}

                  {/* Right ellipsis */}
                  {currentPage < totalPages - 3 && <span className="px-2 text-gray-400">…</span>}

                  {/* Last page */}
                  {totalPages > 1 && (
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        currentPage === totalPages
                          ? 'bg-blue-500 text-white'
                          : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
                      }`}
                    >
                      {totalPages}
                    </button>
                  )}

                  {/* Next */}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-zinc-800 text-gray-300 rounded-lg hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* Approve Confirmation Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-5 border-b border-zinc-800">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Approve Issue</h3>
                <button 
                  onClick={() => setShowApproveModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-400 mt-1">Are you sure you want to approve this issue?</p>
            </div>
            
            <div className="p-5">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg mb-4">
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-emerald-300 font-medium">Approval Notice</p>
                    <p className="text-xs text-emerald-400 mt-1">
                      Once approved, this issue will be visible to all users and can be assigned to staff members.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-5 border-t border-zinc-800">
              <div className="flex gap-3">
                <button
                  onClick={() => setShowApproveModal(false)}
                  className="flex-1 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-gray-300 rounded-lg"
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleIssuesReview}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2.5 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg disabled:opacity-50 transition-all"
                >
                  {actionLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Approving...
                    </span>
                  ) : (
                    'Confirm Approve'
                  )}
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
            <div className="p-5 border-b border-zinc-800">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-white">Reject Issue</h3>
                </div>
                <button 
                  onClick={() => {
                    setShowRejectModal(false);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-5">
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg mb-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-red-300 font-medium">Warning</p>
                    <p className="text-xs text-red-400 mt-1">
                      Once Rejected, this means citizen can ban for it.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-5 border-t border-zinc-800">
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                  }}
                  className="flex-1 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-gray-300 rounded-lg"
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleIssuesReview}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2.5 bg-linear-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white rounded-lg disabled:opacity-50 transition-all"
                >
                  {actionLoading ? (
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
  );
};

export default ReviewIssues;