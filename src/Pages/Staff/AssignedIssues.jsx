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
  ThumbsUp
} from 'lucide-react';
import { Link } from 'react-router';
import { AuthContext } from '../AuthProvider/AuthContext';
import useAxiosSecure from '../../Hooks/useAxiosSecure';

const AssignedIssues = () => {
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(null);
  const {mUser,user, role} = use(AuthContext)
  const axiosSecure = useAxiosSecure()
  const [assignedIssues, setAssignedIssues] = useState([])
  const [loading, setLoading] = useState(true)

  //Check Authorized Assigned User
    const assignedIssuesFetch = (staffId) => {
        setLoading(true)
        axiosSecure.get(`/assigned-issues/${staffId}`)
            .then(res => {
                setAssignedIssues(res.data)
            })
            .catch(err => console.log(err))
            .finally(()=> setLoading(false))
    }

  useEffect(()=>{
    if(role === 'staff' && mUser?._id){
        assignedIssuesFetch(mUser?._id)
    }
  }, [mUser?._id, role])

//   // Mock data for assigned issues
//   const assignedIssues = [
//     {
//       _id: '1',
//       title: 'Large Pothole on Main Road',
//       category: 'Road & Traffic',
//       status: 'In-Progress',
//       priority: 'High',
//       location: 'Main Road, Downtown Area',
//       assignedDate: '2024-01-15',
//       deadline: '2024-01-25',
//       upvoteCount: 25,
//       mainPhoto: 'https://images.unsplash.com/photo-1561144257-e32e8c5d0a8a?w=400',
//       isBoosted: true,
//       reporter: {
//         name: 'John Citizen',
//         photo: 'https://ui-avatars.com/api/?name=John+Citizen&background=1f2937&color=10b981'
//       }
//     },
//     {
//       _id: '2',
//       title: 'Broken Street Light',
//       category: 'Streetlight',
//       status: 'Pending',
//       priority: 'Normal',
//       location: 'Maple Avenue, Sector 5',
//       assignedDate: '2024-01-16',
//       deadline: '2024-01-30',
//       upvoteCount: 15,
//       mainPhoto: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400',
//       isBoosted: false,
//       reporter: {
//         name: 'Sarah Smith',
//         photo: 'https://ui-avatars.com/api/?name=Sarah+Smith&background=1f2937&color=10b981'
//       }
//     },
//     {
//       _id: '3',
//       title: 'Water Pipe Leakage',
//       category: 'Water Supply',
//       status: 'Working',
//       priority: 'Critical',
//       location: 'River Road, Block C',
//       assignedDate: '2024-01-14',
//       deadline: '2024-01-20',
//       upvoteCount: 42,
//       mainPhoto: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400',
//       isBoosted: true,
//       reporter: {
//         name: 'Mike Johnson',
//         photo: 'https://ui-avatars.com/api/?name=Mike+Johnson&background=1f2937&color=10b981'
//       }
//     },
//     {
//       _id: '4',
//       title: 'Garbage Overflow',
//       category: 'Sanitation',
//       status: 'Resolved',
//       priority: 'Normal',
//       location: 'Park Lane, Sector 3',
//       assignedDate: '2024-01-10',
//       deadline: '2024-01-15',
//       upvoteCount: 8,
//       mainPhoto: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400',
//       isBoosted: false,
//       reporter: {
//         name: 'Emma Wilson',
//         photo: 'https://ui-avatars.com/api/?name=Emma+Wilson&background=1f2937&color=10b981'
//       }
//     },
//     {
//       _id: '5',
//       title: 'Damaged Footpath',
//       category: 'Footpath',
//       status: 'Closed',
//       priority: 'Low',
//       location: 'City Center, Zone A',
//       assignedDate: '2024-01-05',
//       deadline: '2024-01-12',
//       upvoteCount: 12,
//       mainPhoto: 'https://images.unsplash.com/photo-1541692641319-981cc79ee10a?w=400',
//       isBoosted: true,
//       reporter: {
//         name: 'David Brown',
//         photo: 'https://ui-avatars.com/api/?name=David+Brown&background=1f2937&color=10b981'
//       }
//     }
//   ];
console.log(role, assignedIssues)
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

  if (loading) {
  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-950 to-zinc-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-300">Loading your assigned issues...</p>
      </div>
    </div>
  );
  }
  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-950 to-zinc-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                Assigned <span className="bg-linear-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Issues</span>
              </h1>
              <p className="text-gray-400">Issues assigned to you for resolution</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-2xl">
                <span className="text-white font-bold">{assignedIssues.length}</span>
                <span className="text-gray-400 ml-2">Issues Assigned</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Issues Table */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 overflow-hidden">
          {/* Table Header */}
          <div className="p-6 border-b border-zinc-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">
                  Your Assigned Issues
                </h3>
                <p className="text-sm text-gray-400">
                  Click "Change Status" to update issue progress
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
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Status</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Priority</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Reporter</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Boosted</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assignedIssues.map((issue) => (
                  <tr key={issue._id} className="border-b border-zinc-700 hover:bg-zinc-800/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-14 h-14 rounded-xl overflow-hidden">
                            <img 
                              src={issue.mainPhoto} 
                              alt={issue.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-white mb-1 truncate">
                            {issue.title}
                          </div>
                          <div className="text-sm text-gray-400 flex items-center">
                            <MapPin className="w-3 h-3 mr-1 shrink-0" />
                            <span className="truncate">{issue.location}</span>
                          </div>
                          <div className="flex items-center space-x-4 mt-1">
                            <div className="text-sm text-gray-400 flex items-center">
                              <ThumbsUp className="w-3 h-3 mr-1" />
                              {issue.upvoteCount}
                            </div>
                            <div className="text-sm text-gray-400 flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(issue.assignedStaff.assignedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-medium">
                        {issue.category}
                      </span>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(issue.status)}`}>
                        {getStatusIcon(issue.status)}
                        <span>{issue.status}</span>
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(issue.priority)}`}>
                        {issue.priority}
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-zinc-600">
                          <img 
                            src={issue.reporter.photoURL || ''} 
                            alt={issue.reporter.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="text-white text-sm font-medium">
                            {issue.reporter.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      {issue.isBoosted ? (
                        <div className="flex items-center space-x-2">
                          <div className="p-2 bg-linear-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
                            <TrendingUp className="w-4 h-4 text-purple-400" />
                          </div>
                          <div className="text-white text-sm font-medium">Boosted</div>
                        </div>
                      ) : (
                        <div className="text-gray-400 text-sm italic">
                          Not Boosted
                        </div>
                      )}
                    </td>
                    
                    <td className="py-4 px-6">
                    <div className="relative">
                        <button
                        onClick={() => toggleStatusDropdown(issue._id)}
                        className="flex items-center space-x-2 px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 rounded-xl text-white font-bold hover:shadow-blue-500/50 transition-all"
                        >
                        <MoreVertical className="w-4 h-4" />
                        <span>Change Status</span>
                        </button>
                        
                        {/* FLOATING DROPDOWN MENU - Front এ show হবে */}
                        {statusDropdownOpen === issue._id && (
                        <>
                            {/* Backdrop শুধু click outside close করার জন্য */}
                          <div 
                            className="fixed inset-0 z-40"
                            onClick={() => setStatusDropdownOpen(null)}
                            />
                            
                            {/* Dropdown menu টা fixed position এ front এ */}
                            <div className="fixed z-50 mt-2 w-45 bg-zinc-800 border border-zinc-700 rounded-xl shadow-2xl">
                                <div className="py-1">
                                    <button className="w-full text-left px-4 py-3 text-gray-300 hover:bg-zinc-700 hover:text-white transition-colors flex items-center space-x-3">
                                    <AlertCircle className="w-4 h-4 text-blue-500" />
                                    <span>In-Progress</span>
                                    </button>
                                    
                                    <button className="w-full text-left px-4 py-3 text-gray-300 hover:bg-zinc-700 hover:text-white transition-colors flex items-center space-x-3">
                                    <AlertCircle className="w-4 h-4 text-purple-500" />
                                    <span>Working</span>
                                    </button>
                                    
                                    <button className="w-full text-left px-4 py-3 text-gray-300 hover:bg-zinc-700 hover:text-white transition-colors flex items-center space-x-3">
                                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                                    <span>Resolved</span>
                                    </button>
                                    
                                    <button className="w-full text-left px-4 py-3 text-gray-300 hover:bg-zinc-700 hover:text-white transition-colors flex items-center space-x-3">
                                    <XCircle className="w-4 h-4 text-gray-400" />
                                    <span>Closed</span>
                                    </button>
                                </div>
                            </div>
                        </>
                        )}
                    </div>
                    
                    {/* View Details Button */}
                    <div className="mt-2">
                        <Link 
                        to={`/issues/${issue._id}`}
                        className="flex items-center justify-center space-x-2 px-4 py-2 bg-zinc-700 rounded-xl text-gray-300 hover:text-white hover:bg-zinc-600 transition-colors"
                        >
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                        </Link>
                    </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignedIssues;