import React from 'react';
import { 
  Mail,
  Phone,
  User,
  Calendar,
  CreditCard,
  Lock,
  Unlock,
  Crown
} from 'lucide-react';

const ManageUsers = () => {
  // Mock data
  const users = [
    {
      _id: '1',
      name: 'John Citizen',
      email: 'john@example.com',
      phone: '+1234567890',
      subscription: 'Premium',
      subscriptionEnd: '2024-12-31',
      status: 'Active',
      isBlocked: false,
      joined: '2023-01-15',
      totalReports: 12,
      upvotes: 45
    },
    {
      _id: '2',
      name: 'Jane Resident',
      email: 'jane@example.com',
      phone: '+1234567891',
      subscription: 'Free',
      subscriptionEnd: null,
      status: 'Active',
      isBlocked: false,
      joined: '2023-02-20',
      totalReports: 5,
      upvotes: 23
    },
    {
      _id: '3',
      name: 'Mike User',
      email: 'mike@example.com',
      phone: '+1234567892',
      subscription: 'Premium',
      subscriptionEnd: '2024-11-15',
      status: 'Active',
      isBlocked: true,
      joined: '2023-03-10',
      totalReports: 8,
      upvotes: 30
    },
    {
      _id: '4',
      name: 'Sarah Public',
      email: 'sarah@example.com',
      phone: '+1234567893',
      subscription: 'Free',
      subscriptionEnd: null,
      status: 'Inactive',
      isBlocked: false,
      joined: '2023-04-05',
      totalReports: 0,
      upvotes: 0
    }
  ];

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
        </div>
      </div>

      {/* Users Table */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 overflow-hidden">
          {/* Table Header */}
          <div className="p-6 border-b border-zinc-700">
            <h3 className="text-xl font-bold text-white">
              Citizen Users ({users.length})
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
                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=1f2937&color=10b981&bold=true`} 
                              alt={user.name}
                              className="w-full h-full object-cover"
                            />
                            {user.subscription === 'Premium' && (
                              <div className="absolute -top-1 -right-1">
                                <Crown className="w-6 h-6 text-yellow-500" fill="currentColor" />
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-white mb-1">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-400 flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(user.joined).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="space-y-2">
                        <div className="text-sm text-gray-300 flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-gray-500" />
                          {user.email}
                        </div>
                        <div className="text-sm text-gray-400 flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-gray-500" />
                          {user.phone}
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${
                          user.subscription === 'Premium' 
                            ? 'bg-linear-to-r from-yellow-500/20 to-amber-500/20 text-yellow-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {user.subscription === 'Premium' && <Crown className="w-3 h-3" />}
                          <span>{user.subscription}</span>
                        </div>
                        {user.subscription === 'Premium' && user.subscriptionEnd && (
                          <div className="text-xs text-gray-400">
                            Expires: {new Date(user.subscriptionEnd).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${
                          user.status === 'Active' 
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          <span>{user.status}</span>
                        </div>
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
                        
                        <button className={`px-4 py-2 rounded-xl font-medium ${
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