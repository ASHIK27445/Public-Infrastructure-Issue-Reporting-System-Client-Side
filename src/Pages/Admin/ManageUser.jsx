import React, { use, useEffect, useState } from 'react';
import { 
  Mail,
  Phone,
  User,
  Calendar,
  CreditCard,
  Lock,
  Unlock,
  Crown,
  ChessKing,
  ChessKnight,
  ChessBishop,
  Star
} from 'lucide-react';
import { AuthContext } from '../AuthProvider/AuthContext';
import useAxiosSecure from '../../Hooks/useAxiosSecure'
import Swal from 'sweetalert2'
const ManageUsers = () => {

  const [users, setUsers] = useState([])
  
  const axiosSecure = useAxiosSecure();
  useEffect(()=> {
    axiosSecure.get('/allusers')
      .then(res => setUsers(res.data))
      // .catch(err=> console.log(err))
  }, [axiosSecure])

  const handleUserStatus = async (email, isBlocked) => {
    const confirm = await Swal.fire({
      title: isBlocked ? "Block this user?" : "Unblock this user?",
      text: isBlocked
        ? "The user will not be able to access the system."
        : "The user will regain access.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: isBlocked ? "#dc2626" : "#16a34a",
      cancelButtonColor: "#6b7280",
      confirmButtonText: isBlocked ? "Block User" : "Unblock User",
      cancelButtonText: "Cancel",
      background: "#1a1a2e",
      color: "#e0e0e0",
      iconColor: isBlocked ? "#dc2626" : "#16a34a"
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axiosSecure.patch("/update/user/status", {
        email,
        isBlocked
      });

      if (res.data.modifiedCount > 0) {
        setUsers(prev =>
          prev.map(user =>
            user.email === email ? { ...user, isBlocked } : user
          )
        );

        Swal.fire({
          icon: "success",
          title: isBlocked ? "User Blocked" : "User Unblocked",
          timer: 1400,
          showConfirmButton: false,
          background: "#1a1a2e",
          color: "#e0e0e0",
          iconColor: isBlocked ? "#dc2626" : "#16a34a"
        });
      }
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: "Something went wrong",
        icon: "error",
        background: "#1a1a2e",
        color: "#e0e0e0",
        iconColor: "#dc2626"
      });
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-950 to-zinc-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
              Manage <span className="bg-linear-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Users</span>
            </h1>
            <p className="text-gray-400">View and manage all citizen users</p>
          </div>
          <div className="py-2.5 flex justify-between items-center">
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Crown className="w-4 h-4 text-yellow-500" />
                <span>Admin</span>
              </div>
              <div className="flex items-center gap-1">
                <ChessKnight className="w-4 h-4 text-red-500" />
                <span>Staff</span>
              </div>
              <div className="flex items-center gap-1">
                <ChessBishop className="w-4 h-4 text-blue-800" />
                <span>Citizen</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-600" />
                <span>Premium</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 overflow-hidden">
          {/* Table Header */}
          <div className="p-6 border-b border-zinc-700">
            <h3 className="text-xl font-bold text-white">
              Citizen Users ({users?.length})
            </h3>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-700">
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">User Profile</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Contact Info</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Subscription</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Status</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Activity</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-zinc-700 hover:bg-zinc-800/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-zinc-600">
                            <img 
                              src={user?.photoURL} 
                              alt={user.name}
                              className="w-full h-full object-cover"
                            />
                            {user?.isPremium === true && (
                              <div className="absolute -top-1 -left-1">
                                <Star className="w-6 h-6 text-yellow-500" fill="currentColor" color='white' strokeWidth={1} />
                              </div>
                            )}
                            {user?.role === 'staff' && (
                              <div className="absolute -top-1 -right-1">
                                <ChessKnight className="w-6 h-6 text-red-500" fill="currentColor" color='white' strokeWidth={1} />
                              </div>)}
                            {user?.role === 'citizen' && (
                              <div className="absolute -top-1 -right-1">
                                <ChessBishop className="w-6 h-6 text-blue-800" fill="currentColor" color='white' strokeWidth={1} />
                              </div>)}
                            {user?.role === 'admin' && (
                              <div className="absolute -top-1 -right-1">
                                <Crown className="w-6 h-6 text-yellow-600" fill="currentColor"  />
                              </div>)}
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-white mb-1">
                            {user?.name}
                          </div>
                          <div className="text-sm text-gray-400 flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(user?.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="space-y-2">
                        <div className="text-sm text-gray-300 flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-gray-500" />
                          {user?.email}
                        </div>
                        <div className="text-sm text-gray-400 flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-gray-500" />
                          {user?.role}
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${
                          user?.isPremium === true 
                            ? 'bg-linear-to-r from-yellow-500/20 to-amber-500/20 text-yellow-400'
                            : 'bg-gray-500/20 text-gray-400'}`}>
                          {user?.isPremium === true && <Crown className="w-3 h-3" />}
                          <span>{user?.isPremium ? 'Premium' : 'Free'}</span>
                        </div>
                        {/* {user?.isPremium === true && user.subscriptionEnd && (
                          <div className="text-xs text-gray-400">
                            Expires: {new Date(user.subscriptionEnd).toLocaleDateString()}
                          </div>
                        )} */}
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className={`text-xs flex items-center gap-1 ${
                          user.isBlocked ? 'text-red-400' : 'text-emerald-400'
                        }`}>
                          {user.isBlocked ? (
                            <>
                              <Lock className="w-3 h-3" />
                              Blocked
                            </>
                          ) : (
                            <>
                              <Unlock className="w-3 h-3" />
                              Active
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-300">
                          Reports: <span className="font-bold text-white">{user.totalReports}</span>
                        </div>
                        <div className="text-sm text-gray-400">
                          Upvotes: <span className="font-medium">{user.upvotes}</span>
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-2">
                        <button className="px-4 py-2 bg-zinc-700 rounded-xl text-white font-medium hover:bg-zinc-600 transition-colors">
                          View Details
                        </button>
                        
                        <button
                        onClick={() => handleUserStatus(user.email, !user.isBlocked)}
                        className={`px-4 py-2 rounded-xl font-medium ${
                          user.isBlocked
                            ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                            : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                        }`}>
                          {user.isBlocked ? 'Unblock' : 'Block'}
                        </button>
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

export default ManageUsers;