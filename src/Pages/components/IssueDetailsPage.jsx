import React, { useState, useEffect, use } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router';
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
  Loader2,
  CircleX,
  Loader,
  Pickaxe,
  CircleCheckBig,
  BookmarkCheck,
  SquarePen,
  OctagonX,
  MessageSquare
} from 'lucide-react';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { AuthContext } from '../AuthProvider/AuthContext';
import { toast} from "react-toastify"
import axios from 'axios';
import CommentSection from './CommentSection';

const IssueDetailsPage = () => {
  const {role, user, mUser, mLoading} = use(AuthContext)
  const [upvoting, setUpvoting] = useState(false)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [issue, setIssue] = useState([])
  const axiosSecure = useAxiosSecure()
  const {id} = useParams()
  const [count, setCount] = useState(0)
  const [viewCount, setViewCount] = useState(issue?.viewsCount)
  const [hasUpvoted, setHasUpvoted] = useState(false)
  const [timelines, setTimeline] = useState({})
  const [loading, setLoading] = useState(true)
  const isOwnIssue = issue?.reportBy === mUser?._id

  // State for report modal
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportType, setReportType] = useState('')
  const [reportDetails, setReportDetails] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [reportLoading, setReportLoading] = useState(false)

  //State for comment section
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState([])
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [commentLoading, setCommentLoading] = useState(false)
  const [replyLoading, setReplyLoading] = useState(false)
  const [commentDeleteLaoding, setCommentDeleteLaoding] = useState(false)
  const [showAllComments, setShowAllComments] = useState(false)
  const commentsToShow = showAllComments ? comments : comments.slice(0,3)


  const fetchAllData = async() =>{
    setLoading(true)
    try{
      const [issueResponse, upvotesRes, timelineResponse] = await Promise.all([
        axiosSecure.get(`/detailIssues/${id}`),
        axiosSecure.get(`/upvote-info/${id}`),
        axiosSecure.get(`/timeline/${id}`) ])
        
        setIssue(issueResponse.data)
        setCount(upvotesRes.data.count || 0);
        setTimeline(timelineResponse.data)
    }catch (err){
      console.log(err)
      toast('Failed to load the data.')
    }finally{
      setLoading(false)
    }
  }

  // console.log(mUser?._id)
  // console.log(hasUpvoted)
  useEffect(()=> {
    fetchAllData()
    if(mUser?._id) {
    axiosSecure.get(`/upvote-info/${id}?userId=${mUser?._id}`)
      .then(res=> {
        setCount(res.data.count || 0);
        setHasUpvoted(res.data.hasUpvoted || false)
      } )
    }

  }, [axiosSecure, id, mUser?._id])

  //view Count useEffect
  useEffect(() => {
    if(!id) return;
    
    const viewedIssues = JSON.parse(sessionStorage.getItem('viewedIssues') || '[]')

    if(viewedIssues.includes(id)) return

    const timer = setTimeout(() => {
      axios.post(`http://localhost:3000/view-count/${id}`)
        .then(res => {
          console.log('View counted', res.data, res.data.viewsCount)
          setViewCount(res.data.viewsCount)
          viewedIssues.push(id);
          sessionStorage.setItem("viewedIssues", JSON.stringify(viewedIssues))
        })
        .catch(err => console.log(err));
    }, 5000);

    // cleanup if user leaves early
    return () => clearTimeout(timer);
  }, [id])

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved': return 'from-emerald-500 to-teal-500';
      case 'In-Progress': return 'from-blue-500 to-cyan-500';
      case 'Pending': return 'from-yellow-500 to-amber-500';
      case 'Working': return 'from-purple-500 to-pink-500';
      case 'Closed': return 'from-gray-500 to-slate-500';
      case 'Rejected': return 'from-red-500 to-rose-500'
      default: return 'from-gray-500 to-slate-500';
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'from-red-700 to-red-400';
      case 'High': return 'from-orange-500 to-yellow-500';
      case 'Normal': return 'from-emerald-500 to-teal-500';
      case 'Low': return 'from-blue-300 to-cyan-300';
      case 'Support': return 'from-blue-700 to-cyan-700';
      case 'Boosted High': return 'from-rose-700 to-red-700'
      default: return 'from-gray-500 to-slate-500';
    }
  }

  const getTimelineIcon = (type) => {
    switch (type) {
      case 'created': return <User className="w-5 h-5 text-amber-700" />;
      case 'assigned': return <Shield className="w-5 h-5 text-blue-500" />;
      case 'In-Progress': return <Loader className="w-5 h-5 text-amber-500" />;
      case 'Working': return <Pickaxe className="w-5 h-5 text-purple-500" />;
      case 'Resolved': return <CircleCheckBig className="w-5 h-5 text-green-600" />;
      case 'Closed': return <BookmarkCheck className={`w-5 h-5 ${issue?.closeNote ? 'text-red-500' : 'text-white'}`} />;
      case 'boost': return <TrendingUp className="w-5 h-5 text-pink-500" />;
      case 'comment': return <Send className="w-5 h-5 text-gray-400" />;
      case 'rejected': return <CircleX className="w-5 h-5 text-red-600"/>;
      case 'issue-updated': return <SquarePen className='w-5 h-5 text-cyan-600'/>;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  }

  const handleUpvote = () => {
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
    setUpvoting(true)
    axiosSecure.post(`/upvote/${issue._id}`)
      .then((res)=> {
        if(res.data.success){
          setHasUpvoted(res.data.hasUpvoted)
          setCount(res.data.upvoteCount || 0)
          setUpvoting(false)
        }
      }).catch(err => console.log(err))
  }

  // console.log(isOwnIssue, issue?._id)
  // console.log('Boost Request Payload:', { type: 'normal_boost', issueId: issue?._id });

  const handleBoost = () => {
    if(!isOwnIssue && !issue?.id){
      toast.error("You can't boost other issues.")
      return
    }
      setPaymentLoading(true)
      axiosSecure.post('/create-checkout-session', {type: 'normal_boost', issueId: issue?._id})
      .then(res => {
        console.log(res.data)
        window.location.href = res.data.sessionURL
      }).catch(err=> {
        console.log(err)
        toast.error(err)
      })
        .finally(()=> setPaymentLoading(false))
  }

    const handleBoostCritical = () => {
    if(!isOwnIssue && !issue?.id){
      toast.error("You can't boost other issues.")
      return
    }
    if(issue?.boostType === 'high_boost'){
      toast.error("Already Boosted!")
      return
    }
      setPaymentLoading(true)
      axiosSecure.post('/create-checkout-session', {type: 'high_boost', issueId: issue?._id})
      .then(res => {
        console.log(res.data)
        window.location.href = res.data.sessionURL
      }).catch(err=> {
        console.log(err)
        toast.error(err)
      })
        .finally(()=> setPaymentLoading(false))
  }

  const handleDelete = () => {
    setShowDeleteConfirm(false);
    alert('Demo: Issue deleted! (Functionality disabled in demo)');
  }

  const handleEdit = () => {
    alert('Demo: Edit functionality (Disabled in demo)');
  }

  const successRate = () =>{
    const issueCount = issue?.reporterIssueCount
    const rejectIssueCount = issue?.reportRejectedIssueCount ? issue?.reportRejectedIssueCount : 0

    const successRate = ((issueCount - rejectIssueCount)/issueCount) * 100

    return successRate
  }

  const handleReportSubmit = (e) => {
    e.preventDefault()
    if(!user){
      toast.error('login first')
      return
    }
    if(role !== 'citizen' || isOwnIssue){
      toast.error('You cannot report the issue.')
      return
    }
    if(!issue?._id || !mUser?._id) return
    
    const reportData = {
      reportType,
      reportDetails,
      isAnonymous,
      reporterId: mUser?._id,
      reporterName: isAnonymous ? 'Anonymous' : mUser?.name,
    }
    console.log(reportData)
    setReportLoading(true)
    axiosSecure.post(`/report-issue/${issue._id}`, reportData)
      .then(res => {
        console.log(res.data)
        setReportLoading(false)
        if(res.data.success){
          setShowReportModal(false)
          setReportType('')
          setReportDetails('')
          setIsAnonymous(false)
          setShowSuccessModal(true)
        }
        if(res.data.error){
          toast.error(res.data.message)
        }
      }).catch(err => toast.error(err) )

  }

  //Comment Section
  const fetchComment = () => {
    axiosSecure.get(`/comments/${id}`)
      .then(res => {
        setComments(res.data)
      }).catch(err=> console.log(err))
  }

  useEffect(()=> {
    if(!id) return

    const pollingInterval = setInterval(()=> {
      fetchComment()
    }, 1200)

    return () => clearInterval(pollingInterval)
  }, [id])

  const handleAddComment = (e) => {
    e.preventDefault()

    if(!user || !commentText.trim()) return

    setCommentLoading(true)
    axiosSecure.post(`/comments/${id}`,{
      commentText: commentText.trim()
    }).then(res => {
      console.log(res.data)
      if(res.data.success){
        setCommentText('')
        fetchComment()
      }
      setCommentLoading(false)
    }).catch(err=> toast.error(err))
  }

  const handleAddReply = (commentId) => {
    if(!user || !replyText.trim()) return

    setReplyLoading(true)
    axiosSecure.post(`/comments/reply/${commentId}`, {
      replyText: replyText.trim()
    }).then(res=>{
      console.log(res.data)
      if(res.data.success){
        setReplyText('')
        setReplyingTo(null)
        fetchComment()
      }
      setReplyLoading(false)
    }).catch(err=> toast.error(err))
  }

  const handleDeleteComment = (commentId) => {
    setCommentDeleteLaoding(true)
    axiosSecure.delete(`/comments/${commentId}`)
      .then(res=> {
        if (res.data.success) {
          fetchComment()
          setCommentDeleteLaoding(false)
        }
      })
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          {/* Clean spinner */}
          <div className="inline-flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-emerald-500/20 rounded-full" />
            <div className="absolute w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
          
          {/* Subtle text */}
          <div>
            <p className="text-gray-300 text-sm font-medium">Loading Issue</p>
            <p className="text-gray-500 text-xs mt-1">This will just take a moment</p>
          </div>
        </div>
      </div>
    );
  }

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
              <div className='flex justify-between'>
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
                <div>
                  {/* {console.log(issue?.status !== 'Rejected', issue?.boostType === 'high_boost')} */}
                {(issue?.status !== 'Rejected' && issue?.boostType !== 'high_boost' ) &&(
                  (isOwnIssue && count>10)? (
                    <div 
                    onClick={handleBoostCritical}
                    disabled={paymentLoading}
                    className={`flex gap-1 cursor-pointer px-4 py-2 bg-linear-to-r ${getPriorityColor('Boosted High')} rounded-full font-bold text-white text-sm`}>
                    {paymentLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>High Boost Priority</span>
                      </>
                    )}
                    </div>) : (
                    <div className={`cursor-pointer px-4 py-2 bg-linear-to-r ${getPriorityColor('Support')} rounded-full font-bold text-white text-sm`}>
                      Support
                    </div>)
                )}

                </div>
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
                  loading='lazy'
                />
                <div className="absolute inset-0 bg-linear-to-t from-zinc-900 via-transparent to-transparent" />
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
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-zinc-800/50 rounded-2xl p-4 text-center">
                  <div className={`text-3xl font-black mb-2 ${issue?.status === 'Rejected' ? 'text-red-500' : 'text-emerald-500'}`}>{count}</div>
                  <div className="text-sm text-gray-400">Upvotes</div>
                </div>
                <div className="bg-zinc-800/50 rounded-2xl p-4 text-center">
                  <div className="text-3xl font-black text-blue-500 mb-2">{viewCount || issue?.viewsCount || 0}</div>
                  <div className="text-sm text-gray-400">Views</div>
                </div>
                <div className="bg-zinc-800/50 rounded-2xl p-4 text-center">
                  <div className="text-3xl font-black text-amber-500 mb-2">{comments.length || 0}</div>
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
                {issue?.status === 'Rejected' ?
                  <button
                    disabled={true}
                    className='flex items-center space-x-3 px-6 py-3 rounded-2xl font-bold transition-allbg-emerald-500/20 bg-linear-to-r from-red-900 to-rose-900 text-red-300 border border-red-500/30 cursor-not-allowed'>
                    <OctagonX className="w-5 h-5 animate-pulse text-red-300" />
                    <span>Upvote</span>
                    <span className="bg-red-900 border border- border-red-500 text-red-200 px-3 py-1 rounded-full text-sm">{count}</span>
                  </button> :
                  <button
                    onClick={handleUpvote}
                    disabled={upvoting || isOwnIssue}
                    className={`flex items-center space-x-3 px-6 py-3 rounded-2xl font-bold transition-all ${
                      hasUpvoted || isOwnIssue
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-not-allowed'
                        : 'bg-zinc-800 text-white hover:bg-zinc-700 cursor-pointer'
                    }`}
                    title={isOwnIssue ? "You cannot upvote your own issue" : ""}
                  >
                    {upvoting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <ThumbsUp className="w-5 h-5" />
                    )}
                    <span>Upvote</span>
                    <span className="bg-zinc-900 px-3 py-1 rounded-full text-sm">{count}</span>
                  </button>
                }

  
                {/* Boost Button */}
                {issue?.status === 'Rejected' ? (
                  // Case 0: Issue is rejected 
                  <button
                    disabled
                    className="flex items-center space-x-3 px-6 py-3 bg-linear-to-r from-red-900 to-rose-900 rounded-2xl font-bold text-white border border-red-500/30 cursor-not-allowed"
                    title="This issue has been rejected"
                  >
                    <TrendingUp className="w-5 h-5 text-red-400" />
                    <span className="text-red-300">Cannot Boost</span>
                    <span className="flex items-center space-x-1 bg-red-900/50 px-3 py-1 rounded-full text-sm border border-red-500/30">
                      <span className="text-red-300">Rejected</span>
                    </span>
                  </button>
                ) : issue?.isBoosted ? (
                  // Case 1: Issue already boosted
                  <button
                    disabled
                    className="flex items-center space-x-3 px-6 py-3 bg-linear-to-r from-purple-900 to-pink-900 rounded-2xl font-bold text-white border border-purple-500/30 cursor-not-allowed"
                  >
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                    <span className="text-purple-300">Issue Boosted</span>
                    <span className="flex items-center space-x-1 bg-purple-900/50 px-3 py-1 rounded-full text-sm border border-purple-500/30">
                      <span className="text-purple-300">✓</span>
                    </span>
                  </button>
                ) : isOwnIssue ? (
                  // Case 2: User's own issue (can boost) 
                  <button
                    onClick={handleBoost}
                    disabled={paymentLoading}
                    className={`group flex items-center space-x-3 px-6 py-3 rounded-2xl font-bold transition-all ${
                      paymentLoading 
                        ? 'bg-purple-700 cursor-not-allowed' 
                        : 'bg-linear-to-r from-purple-600 to-pink-600 hover:shadow-purple-500/50'
                    }`}
                  >
                    {paymentLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <TrendingUp className="w-5 h-5" />
                        <span>Boost Priority</span>
                        <span className="flex items-center space-x-1 bg-purple-800 px-3 py-1 rounded-full text-sm">
                          <span>100 Tk</span>
                        </span>
                      </>
                    )}
                  </button>
                ) : (
                  // Case 3: Not user's issue - Blue color
                  <button
                    disabled
                    className="flex items-center space-x-3 px-6 py-3 bg-linear-to-r from-blue-900 to-cyan-900 rounded-2xl font-bold text-white cursor-not-allowed border border-blue-500/30"
                    title="You can only boost your own issues"
                  >
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    <span className="text-blue-300">Not Boosted</span>
                    <span className="flex items-center space-x-1 bg-blue-900/50 px-3 py-1 rounded-full text-sm border border-blue-500/30">
                      <span className="text-blue-300">N/A</span>
                    </span>
                  </button>
                )}

                <button 
                  onClick={()=> setShowReportModal(true)}
                  className="flex items-center space-x-3 px-6 py-3 bg-zinc-800 rounded-2xl text-white font-bold hover:bg-zinc-700 transition-all"
                >
                  <Flag className="w-5 h-5" />
                  <span>Flag Issue</span>
                  {role === 'admin' || role === 'staff' && (
                    <span className="flex items-center space-x-1 bg-red-900/50 px-3 py-1 rounded-full text-sm border border-blue-500/30">
                      <span className="text-white">{issue?.reportCount || 0}</span>
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Staff Information */}
            {user && issue.assignedStaff && (
              <div className="bg-linear-to-br from-blue-900/20 to-cyan-900/20 rounded-3xl border border-blue-500/30 p-8">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                  <Shield className="w-6 h-6 text-blue-500" />
                  <span>Assigned Staff</span>
                </h3>
                
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-500/50">
                      <img
                        src={issue.assignedStaff.photoURL}
                        alt={issue.assignedStaff.name}
                        className="w-full h-full object-cover"
                        loading='lazy'
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
                        <span className="text-gray-300">{issue.assignedStaff.tel}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">{issue.assignedStaff.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400 text-sm">Assign By {issue.assignedStaff.assignBy}</span>
                      </div>
                      <div className="text-sm text-gray-400">
                      Assigned on{" "}
                      {new Date(issue.assignedStaff.assignedAt).toLocaleDateString()}{" "}
                      {new Date(issue.assignedStaff.assignedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* Comment Section */}
            <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-8 mt-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                <MessageSquare className="w-6 h-6 text-emerald-500" />
                <span>Comments ({comments.length})</span>
              </h3>

              {/* Comment Form*/}
              {user && (
                <form onSubmit={handleAddComment} className="mb-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700 shrink-0">
                      {user.photoURL ? (
                        <img 
                          src={user.photoURL} 
                          alt={user.displayName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white">
                          <User className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Write your comment..."
                        className="w-full h-24 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-2xl text-white placeholder-gray-500 resize-none focus:outline-none focus:border-emerald-500"
                      />
                      <div className="flex justify-between items-center mt-3">
                        <div className="text-sm text-gray-400">
                          Comments are automatically checked for inappropriate content
                        </div>
                        <button
                          type="submit"
                          disabled={!commentText.trim() || commentLoading}
                          className="flex items-center space-x-2 px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50"
                        >
                          {commentLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              <span>Post Comment</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              )}

              {/* Comments List */}
              <div className="mt-8">
                {comments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No comments yet. Be the first to comment!</p>
                  </div>
                ) : (
                  <>
                    {commentsToShow.map((comment) => (
                      <CommentSection
                        key={comment._id}
                        comment={comment}
                        mUser={mUser}
                        role={role}
                        replyingTo={replyingTo}
                        replyText={replyText}
                        replyLoading={replyLoading}
                        onDeleteComment={handleDeleteComment}
                        onReplyClick={(commentId) =>
                          setReplyingTo(replyingTo === commentId ? null : commentId)
                        }
                        onReplyTextChange={setReplyText}
                        onReplySubmit={handleAddReply}
                        formatDate={formatDate}
                        commentDeleteLaoding={commentDeleteLaoding}
                      />
                    ))}

                    {/* Toggle Button */}
                    {comments.length > 3 && (
                      <button
                        onClick={() => setShowAllComments(!showAllComments)}
                        className="text-blue-400 text-sm mt-2 hover:underline"
                      >
                        {showAllComments
                          ? 'Collapse comments'
                          : `View all ${comments.length - 3} comments`}
                      </button>
                    )}
                  </>
                )}
              </div>

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
                    loading='lazy'
                  />
                </div>
                {/* {
                  console.log(issue)
                } */}
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
                  {new Date(issue.createdAt).toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-400">
                  <span className="text-white">Success rate:</span>{' '}
                  {successRate().toFixed(2)}%
                </div>
              </div>
            </div>


            {/*Timeline Section*/}
            <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-3">
                <Clock className="w-5 h-5 text-amber-500" />
                <span>Issue Timeline</span>
              </h3>
              
              <div className="space-y-6">
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-emerald-500/20" />
                  
                    <div className="relative pl-16 pb-6">
                      {/* Icon */}
                      <div className="absolute left-4 top-0 w-10 h-10 bg-zinc-900 border-2 border-emerald-500/30 rounded-full flex items-center justify-center">
                        {getTimelineIcon('created')}
                      </div>
                      
                      {/* Content */}
                      <div className="bg-zinc-800/50 rounded-2xl p-4 border border-zinc-700">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-bold text-white">Issue Reported</div>
                          <div className="text-xs text-gray-500">
                            {new Date(timelines.issueCreatedAt).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </div>
                        
  
                        <p className="text-sm text-gray-400 mb-3">Issue was initially reported by {timelines.issueCreatorRole}</p>
                        
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2">
                            <div className={`px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400
                            }`}>
                              {timelines.issueCreatorRole}
                            </div>
                            <span className="text-gray-500">by {timelines.issueCreatedBy}</span>
                          </div>
                          <div className="text-gray-500">
                            {new Date(timelines.issueCreatedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                  {timelines?.changes?.map((entry, index) => (
                    <div key={index} className="relative pl-16 pb-6">
                      {/* Icon */}
                      <div className="absolute left-4 top-0 w-10 h-10 bg-zinc-900 border-2 border-emerald-500/30 rounded-full flex items-center justify-center">
                        {getTimelineIcon(entry.type)}
                      </div>
                      
                      {/* Content */}
                      <div className="bg-zinc-800/50 rounded-2xl p-4 border border-zinc-700">
                        <div className="flex items-center justify-between mb-2">
                          <div className={`font-bold ${entry.type === 'rejected' ? 'text-red-500' : 'text-white'}`}>
                            {entry.title}</div>
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
                              entry.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                              entry.role === 'staff' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-emerald-500/20 text-emerald-400'
                            }`}>
                              {entry.role}
                            </div>
                            <span className="text-gray-500">by {
                              entry.updatedBy === 'admin' ? 'System Admin' : entry.updatedBy
                              }</span>
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

      {/*Report issue modal*/}
      {  showReportModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-8 max-w-lg w-full">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
              <Flag className="w-6 h-6 text-amber-500" />
              <span>Report This Issue</span>
            </h3>
            
            {/* Report Form */}
            <form onSubmit={handleReportSubmit} className="space-y-6">
              {/* Report Type */}
              <div>
                <label className="block text-white mb-3">What's wrong with this issue?</label>
                <select 
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-2xl text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="">Select a reason</option>
                  <option value="false-info">False or Misleading Information</option>
                  <option value="spam">Spam or Advertisement</option>
                  <option value="duplicate">Duplicate Issue</option>
                  <option value="resolved">Already Resolved</option>
                  <option value="inappropriate">Inappropriate Content</option>
                  <option value="privacy">Privacy Concern</option>
                  <option value="other">Other Issues</option>
                </select>
              </div>
              
              {/* Details */}
              <div>
                <label className="block text-white mb-3">Please provide details</label>
                <textarea
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Explain what's wrong with this issue..."
                  className="w-full h-32 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-2xl text-white placeholder-gray-500 resize-none"
                  rows="4"
                />
              </div>
              
              {/* Anonymity Option */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-5 h-5 rounded bg-zinc-800 border-zinc-700"
                />
                <label htmlFor="anonymous" className="text-gray-300">
                  Report anonymously (your identity will be hidden)
                </label>
              </div>
              
              {/* Buttons */}
              <div className="flex space-x-4 pt-4">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 px-6 py-3 bg-zinc-700 rounded-2xl text-white font-bold hover:bg-zinc-600"
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={!reportType || !reportDetails || reportLoading}
                  className="flex-1 px-6 py-3 bg-linear-to-r from-amber-500 to-orange-500 rounded-2xl text-white font-bold hover:shadow-amber-500/50 disabled:opacity-50 flex items-center justify-center">
                  {reportLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Report'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>)
      }

      {/*Report Success Modal */}
      {  showSuccessModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-linear-to-br from-emerald-900/20 to-teal-900/20 border border-emerald-500/30 rounded-3xl p-8 text-center">
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Report Submitted!</h3>
            <p className="text-gray-300 mb-6">
              Thank you for helping us improve the platform. 
              Our team will review your report within 24 hours.
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="px-6 py-3 bg-emerald-500 rounded-2xl text-white font-bold"
            >
              Continue
            </button>
          </div>
        </div>
        )
      }
    </div>
  );
};

export default IssueDetailsPage;