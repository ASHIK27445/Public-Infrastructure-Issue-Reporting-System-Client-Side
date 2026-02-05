import React, { useState, useEffect } from 'react';
import { NavLink, useOutletContext } from 'react-router';
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  DollarSign,
  BarChart3,
  PieChart,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  MapPin,
  Shield,
  Activity,
  Eye,
  FileText,
  MessageCircle,
  Star,
  Target,
  Zap,
  Filter,
  Download,
  MoreVertical,
  ChevronRight,
  ChevronUp
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { toast } from 'react-toastify';
import useAxiosSecure from '../../Hooks/useAxiosSecure'
import { useQuery } from '@tanstack/react-query'
import ChartLoading from './ChartLoading';
const CitizenDashboard = () => {
  const {citizen} = useOutletContext()
  const [stats, setStats] = useState(null);
  const [recentIssues, setRecentIssues] = useState([]);
  const [loading, setLoading] = useState(false)
  const [range, setRange] = useState('30d')
  const axiosSecure = useAxiosSecure()
  const [categoryDistribution, setCategoryDistribution] = useState([])
  const [priorityDistribution, setPriorityDistribution] = useState([])
  const [resolutionTimeData, setResolutionTimeData] = useState([])
  const [userAchievementStates, setUserAchievementStates] = useState([])

  useEffect(() => {
    fetchDashboardData()
    recentIssueFetch()
  }, [range])

  const fetchDashboardData = async () => {
    setLoading(true)
    axiosSecure.get(`/user/stats?range=${range}`)
      .then(res=> {
        // console.log(res.data)
        setLoading(false)
        setStats(res.data)
        setCategoryDistribution(res.data.categoryDistribution)
        setPriorityDistribution(res.data.priorityDistribution)
        setResolutionTimeData(res.data.resolutionTimeData)
      })
  }

  const recentIssueFetch = () => {
    // setLoading(true)
    axiosSecure.get('/user/dashboard/recent-issues')
      .then(res => {
        // console.log(res.data)
        setRecentIssues(res.data.result)
        setUserAchievementStates(res.data.dashboardQuickStats)
        // setLoading(false)
      }).catch(err=> toast.error(err))
  }

  const { data: issuesOverTimeData, isLoading: loadingIssues } = useQuery({
    queryKey: ['issues-over-time', range],
    queryFn: async () => {
      const res = await axiosSecure.get(`/user/issues-over-time?range=${range}`)
      return res.data
    },
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5
  })

  const statCards = [
    {
      title: 'Total Issues',
      value: stats?.totalIssues || 0,
      change: stats?.totalIssuesPercentage
      ? `${stats.totalIssuesPercentage > 0 ? '+' : ''}${stats.totalIssuesPercentage}%`
      : '0%',
      trend: stats?.totalIssuesPercentage >= 0 ? 'up' : 'down',
      icon: <AlertTriangle className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500',
      linear: 'bg-linear-to-br'
    },
    {
      title: 'Pending Issues',
      value: stats?.pendingIssues || 0,
      change: stats?.pendingIssuesPercentage
      ? `${stats.pendingIssuesPercentage > 0 ? '+' : ''}${stats.pendingIssuesPercentage}%`
      : '0%',
      trend: stats?.pendingIssuesPercentage >= 0 ? 'up' : 'down',
      icon: <Clock className="w-6 h-6" />,
      color: 'from-amber-500 to-yellow-500',
      linear: 'bg-linear-to-br'
    },
    {
      title: 'In Progress',
      value: stats?.inProgressIssues || 0,
      change: '+8%',
      trend: 'up',
      icon: <Activity className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500',
      linear: 'bg-linear-to-br'
    },
    {
      title: 'Resolved',
      value: stats?.resolvedIssues || 0,
      change: stats?.resolvedIssuePercentage ? 
      `${stats?.resolvedIssuePercentage > 0 ? '+' : ''}${stats?.resolvedIssuePercentage}%`
      : '0%',
      trend: stats?.resolvedIssuePercentage > 0 ? 'up' : 'down',
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'from-emerald-500 to-teal-500',
      linear: 'bg-linear-to-br'
    },
    {
      title: 'Total Payments',
      value: `৳${(stats?.totalPayments || 0).toLocaleString()}`,
      change: stats?.paymentPercentage
      ? `${stats?.paymentPercentage > 0 ? '+' : ''}${stats?.paymentPercentage}%`
      : '0%',
      trend: stats?.paymentPercentage >= 0 ? 'up' : 'down',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500',
      linear: 'bg-linear-to-br'
    },
    {
      title: 'Success Rate',
      value: `${stats?.successRate || 0}%`,
      change: stats?.successRatePercentage ? 
      `${stats?.successRatePercentage > 0 ? '+' : ''}${stats?.successRatePercentage}%`
      : '0%',
      trend: stats?.successRatePercentage > 0 ? 'up' : 'down',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'from-cyan-500 to-blue-500',
      linear: 'bg-linear-to-br'
    }
  ]

  const getStatusColor = (status) => {
    switch(status) {
      case 'Resolved': return 'from-emerald-500 to-teal-500'
      case 'In-Progress': return 'from-blue-500 to-cyan-500'
      case 'Pending': return 'from-amber-500 to-yellow-500'
      case 'Working': return 'from-violet-500 to-pink-500'
      case 'Rejected': return 'from-red-500 to-rose-500'
      default: return 'from-gray-500 to-slate-500'
    }
  }

  const moneySave = () => {
    const issueCount = userAchievementStates?.issueCount || 0
    const issueSubmitSave = issueCount * 350
    const resolvedIssueCount = userAchievementStates?.resolvedCount
    const resolvedSaved = resolvedIssueCount * 1050
    const rejectCount = userAchievementStates?.rejectCount
    const rejectSaved = rejectCount * 320

    const totalSaved = issueSubmitSave + resolvedSaved + rejectSaved

    if(totalSaved>=1000){
      return `${(totalSaved / 1000).toFixed(1)}k`
    }

    return totalSaved
   }

  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-950 to-zinc-900">
      <title>CommunityFix - Dashboard</title>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                Citizen <span className="bg-linear-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Dashboard</span>
              </h1>
              <p className="text-gray-400">Track your reported issues and community impact</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
              <select
                value={range}
                onChange={(e) => setRange(e.target.value)}
                className="appearance-none px-4 py-2 pl-10 bg-zinc-800 border border-zinc-700 rounded-2xl text-white text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="3m">Last 3 Months</option>
                <option value="1y">Last Year</option>
              </select>
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              
              <button onClick={() => window.print()} className="p-2 bg-zinc-800 border border-zinc-700 rounded-2xl text-gray-400 hover:text-white hover:bg-zinc-700 transition-colors">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div 
              key={index} 
              className="group relative bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-6 hover:border-emerald-500/50 transition-all duration-500"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${stat.linear} ${stat.color} text-white`}>
                  {stat.icon}
                </div>
                <div className={`flex items-center space-x-1 text-sm font-medium px-2 py-1 rounded-full ${
                  stat.trend === 'up' 
                    ? 'bg-emerald-500/20 text-emerald-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
              
              <div className="text-3xl font-black text-white mb-2">
                {stat.value}
              </div>
              
              <div className="text-sm text-gray-400">
                {stat.title}
              </div>
              
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="w-5 h-5 text-emerald-500" />
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">

          {/* Issues Over Time Chart */}
          <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Issues Over Time</h3>
                <p className="text-sm text-gray-400">Monthly reported vs resolved issues</p>
              </div>
              <BarChart3 className="w-6 h-6 text-emerald-500" />
            </div>
            <div className="h-80">
              {/* {console.log(issuesOverTimeData)} */}
            { loading ? <ChartLoading/> : 
                  !issuesOverTimeData || issuesOverTimeData.length === 0 ? 
                  (<div className="h-full flex flex-col items-center justify-center text-gray-500">
                    <BarChart3 className="w-12 h-12 mb-4" />
                    <p>No data available for the selected time range</p>
                  </div>) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={issuesOverTimeData.map(item => ({
                        // Transform 'label' to 'month' for the chart
                        month: item.label,
                        reported: item.reported || 0,
                        resolved: item.resolved || 0
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="month" 
                        stroke="#9ca3af"
                        tick={{ fill: '#9ca3af' }}
                      />
                      <YAxis 
                        stroke="#9ca3af"
                        tick={{ fill: '#9ca3af' }}
                      />
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: '#1f2937',
                          borderColor: '#374151',
                          borderRadius: '12px',
                          color: 'white'
                        }}
                        labelStyle={{ color: '#d1d5db' }}
                      />
                      <Legend 
                      />
                      <Bar 
                        dataKey="reported" 
                        name="Reported Issues" 
                        fill="#10b981" 
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar 
                        dataKey="resolved" 
                        name="Resolved Issues" 
                        fill="#3b82f6" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>)
            }
            </div>
          </div>

          {/* Category Distribution Chart */}
          <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Category Distribution</h3>
                <p className="text-sm text-gray-400">Breakdown by issue categories</p>
              </div>
              <PieChart className="w-6 h-6 text-emerald-500" />
            </div>
            <div className="h-80">
              {loading ? <ChartLoading/> : 
                !categoryDistribution || categoryDistribution.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <PieChart className="w-16 h-16 mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No Category Data</p>
                  <p className="text-sm text-gray-500">You haven't reported any issues yet</p>
                </div>) : (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [value, 'Issues']}
                      contentStyle={{ 
                        backgroundColor: 'white',
                        borderColor: '#374151',
                        borderRadius: '12px'
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Additional Charts Row */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">

          {/* Priority Distribution */}
          <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Priority Distribution</h3>
                <p className="text-sm text-gray-400">Issues by priority level</p>
              </div>
              <Target className="w-6 h-6 text-emerald-500" />
            </div>
            
            <div className="h-64">
              {loading ? <ChartLoading/> : 
              !priorityDistribution || priorityDistribution.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <Target className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No Priority Data</p>
                <p className="text-sm text-gray-500">No issues with priority levels yet</p>
              </div>) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="priority" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#F5F5F5',
                      borderColor: '#374151',
                      borderRadius: '12px',
                      color: 'black'
                    }}
                  />
                  <Bar 
                    dataKey="issues" 
                    name="Number of Issues"
                    radius={[4, 4, 0, 0]}
                  >
                    {priorityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>)}
            </div>
          </div>

          {/* Average Resolution Time */}
          <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Resolution Time</h3>
                <p className="text-sm text-gray-400">Average days to resolve by category</p>
              </div>
              <Clock className="w-6 h-6 text-emerald-500" />
            </div>
            
          <div className="h-64">
            {loading ? <ChartLoading/> :
            !resolutionTimeData || resolutionTimeData.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <Clock className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No Resolution Data</p>
              <p className="text-sm text-gray-500 text-center max-w-sm">
                Resolution time data will appear here when issues are resolved
              </p>
            </div>) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={resolutionTimeData}
                margin={{ top: 20, right: 40, left: 40, bottom: 40 }} // Add left margin
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="category" stroke="#9ca3af" />
                <YAxis 
                  stroke="#9ca3af" 
                  label={{ 
                    value: 'Days', 
                    angle: -90, 
                    position: 'insideLeft',
                    offset: -5 // Adjust offset
                  }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937',
                    borderColor: '#374151',
                    borderRadius: '12px'
                  }}
                  formatter={(value) => [value, 'Days']}
                />
                <Line 
                  type="monotone" 
                  dataKey="avgTime" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>)}
          </div>
          </div>
        </div>

        {/* Recent Issues Table */}
        <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 overflow-hidden mb-8">
          <div className="p-6 border-b border-zinc-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Recent Issues</h3>
                <p className="text-sm text-gray-400">Your latest reported issues</p>
              </div>
              <NavLink
                to="/dashboard/dashboard/manageissues"
                className="flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <span>View All</span>
                <ChevronRight className="w-4 h-4" />
              </NavLink>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-700">
                  <th className="text-left py-2 px-2 text-gray-400 font-medium text-sm">Issue</th>
                  <th className="text-left py-2 px-2 text-gray-400 font-medium text-sm">View & Upvotes</th>
                  <th className="text-left py-2 px-2 text-gray-400 font-medium text-sm">Category</th>
                  <th className="text-left py-2 px-2 text-gray-400 font-medium text-sm">Status</th>
                  <th className="text-left py-2 px-2 text-gray-400 font-medium text-sm">Priority</th>
                  <th className="text-left py-2 px-2 text-gray-400 font-medium text-sm">Created</th>
                  <th className="text-left py-2 px-2 text-gray-400 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentIssues.map((issue) => (
                  <tr key={issue._id} className="border-b border-zinc-700 hover:bg-zinc-800/50 transition-colors">
                    <td className="py-2 px-2">
                      <div className="flex items-center space-x-1">
                        <div className="w-10 h-10 rounded-xl overflow-hidden">
                          <img 
                            src={issue.mainPhoto} 
                            alt={issue.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium text-white">{issue.title}</div>
                          <div className="text-xs text-gray-400 flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {issue.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-2">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center">
                            <div className="flex items-center space-x-1">
                              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                <ChevronUp className="w-3 h-3 text-emerald-400" />
                              </div>
                              <span className="text-sm text-white font-medium">
                                {issue?.upvoteCount || 0}
                              </span>
                              <span className="text-xs text-gray-400">Upvotes</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                              <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                                <Eye className="w-3 h-3 text-blue-400" />
                              </div>
                              <span className="text-sm text-white font-medium">
                                {issue?.viewsCount || 0}
                              </span>
                              <span className="text-xs text-gray-400">Views</span>
                            </div>
                          </div>
                        </div>
                    </td>
                    <td className="py-2 px-2">
                      <span className="py-1 px-1 text-emerald-400 rounded-full text-xs font-medium">
                        {issue.category}
                      </span>
                    </td>
                    <td className="py-2 px-2">
                      <div className={`inline-flex items-center space-x-2 px-2 py-1 rounded-full text-xs font-bold bg-linear-to-r ${getStatusColor(issue.status)} text-white`}>
                        {issue.status === 'Resolved' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        <span>{issue.status}</span>
                      </div>
                    </td>
                    <td className="py-2 px-2">
                      <div className={`px-2 py-1 rounded-full text-center text-xs font-bold ${
                        issue.priority === 'High' ? 'bg-red-500/20 text-red-400' :
                        issue.priority === 'Normal' ? 'bg-emerald-500/20 text-emerald-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {issue.priority}
                      </div>
                    </td>
                    <td className="py-2 px-2 text-gray-300 text-sm">
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-2">
                      <div className="flex items-center space-x-2">
                        <NavLink
                          to={`/issues/${issue?._id}`}
                          className="p-2 bg-zinc-700 rounded-lg text-gray-400 hover:text-white hover:bg-zinc-600 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </NavLink>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-6 border-t border-zinc-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Showing {Math.min(5, recentIssues.length)} of {recentIssues.length} issues
              </div>
              <NavLink
                to="/dashboard/dashboard/addissues"
                className="flex items-center space-x-2 px-4 py-2 bg-linear-to-r from-emerald-500 to-teal-500 rounded-xl text-white font-bold hover:shadow-emerald-500/50 transition-all"
              >
                <FileText className="w-4 h-4" />
                <span>Report New Issue</span>
              </NavLink>
            </div>
          </div>
        </div>

        {/* Achievements & Insights */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Achievements */}
          <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-6">
            {/* {console.log(userAchievementStates)} */}
            <h3 className="text-xl font-bold text-white mb-6">Your Achievements</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: 'First Report', earned: citizen?.issueCount > 0, icon: <Star className="w-5 h-5" /> },
                { title: '5 Issues Reported', earned: citizen?.issueCount >= 5 , icon: <Target className="w-5 h-5" /> },
                { title: 'Community Hero', earned: citizen?.solvedIssue >= 5 && citizen?.issueCount >= 6, icon: <Shield className="w-5 h-5" /> },
                { title: 'Fast Resolver',earned: userAchievementStates?.smallAvgResolutionDay <= 10 , icon: <Zap className="w-5 h-5" /> },
                { title: 'Top Contributor', earned: userAchievementStates.mostUpvotes> 100, icon: <Users className="w-5 h-5" /> },
                { title: 'Perfect Record', 
                  earned: citizen?.solvedIssue >= 10 && citizen.issueCount >= 10 && userAchievementStates.mostViewsIssue>49 && userAchievementStates.mostUpvotes> 49, 
                  icon: <CheckCircle className="w-5 h-5" /> },
              ].map((achievement, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-2xl border ${
                    achievement.earned 
                      ? 'bg-emerald-500/10 border-emerald-500/30' 
                      : 'bg-zinc-800/50 border-zinc-700'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`p-2 rounded-xl ${
                      achievement.earned 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'bg-zinc-700 text-gray-400'
                    }`}>
                      {achievement.icon}
                    </div>
                    <div className={`font-medium ${
                      achievement.earned ? 'text-white' : 'text-gray-400'
                    }`}>
                      {achievement.title}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {achievement.earned ? 'Achieved' : 'In Progress'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Insights */}
          <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-6">
            <h3 className="text-xl font-bold text-white mb-6">Quick Insights</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/30">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <div>
                    <div className="font-medium text-white">Resolution Rate</div>
                    <div className="text-sm text-gray-400">Higher than city average</div>
                  </div>
                </div>
                {/* {console.log(userAchievementStates, userAchievementStates.issueCount, userAchievementStates.rejectCount)} */}
                <div className="text-2xl font-black text-emerald-400">
                  {(() => {
                    const value = ((userAchievementStates?.issueCount - (userAchievementStates?.rejectCount || 0)) / 
                                  userAchievementStates?.issueCount * 100);
                    
                    return isNaN(value) || !isFinite(value) ? 0 : value.toFixed(2);
                  })()}%
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-blue-500/10 rounded-2xl border border-blue-500/30">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="font-medium text-white">Avg. resolved time </div>
                    <div className="text-sm text-gray-400">Faster than average</div>
                  </div>
                </div>
                <div className="text-2xl font-black text-blue-400">{userAchievementStates?.smallAvgResolutionDay || 0}d</div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-purple-500/10 rounded-2xl border border-purple-500/30">
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="font-medium text-white">Money Saved</div>
                    <div className="text-sm text-gray-400">Estimated community impact</div>
                  </div>
                </div>
                <div className="text-2xl font-black text-purple-400">৳{moneySave()}</div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-amber-500/10 rounded-2xl border border-amber-500/30">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-amber-400" />
                  <div>
                    <div className="font-medium text-white">Community Rank</div>
                    <div className="text-sm text-gray-400">Top 15% of reporters</div>
                  </div>
                </div>
                <div className="text-2xl font-black text-amber-400">#42</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default CitizenDashboard;