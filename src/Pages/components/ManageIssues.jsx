import React, { useState } from 'react';
import { 
  UserPlus, 
  Mail, 
  Phone, 
  User, 
  Shield, 
  Edit, 
  Trash2, 
  Calendar,
  Camera
} from 'lucide-react';

const ManageStaff = () => {
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);

  // Mock data
  const staffMembers = [
    {
      _id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      department: 'Road & Traffic',
      status: 'Active',
      photo: null,
      createdAt: '2024-01-15'
    },
    {
      _id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1234567891',
      department: 'Water Supply',
      status: 'Active',
      photo: null,
      createdAt: '2024-01-10'
    }
  ];

  const departments = [
    'Road & Traffic',
    'Water Supply',
    'Electricity',
    'Sanitation',
    'Public Safety',
    'Parks & Recreation',
    'Building & Construction'
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-950 to-zinc-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                Manage <span className="bg-linear-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Staff</span>
              </h1>
              <p className="text-gray-400">Add, edit, and manage staff members</p>
            </div>
            
            <button 
              onClick={() => setShowAddStaffModal(true)}
              className="px-6 py-3 bg-linear-to-r from-emerald-500 to-teal-500 rounded-2xl text-white font-bold hover:shadow-emerald-500/50 transition-all flex items-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              Add Staff
            </button>
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 overflow-hidden">
          {/* Table Header */}
          <div className="p-6 border-b border-zinc-700">
            <h3 className="text-xl font-bold text-white">
              Staff Members ({staffMembers.length})
            </h3>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-700">
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Staff Member</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Contact Info</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Department</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Status</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Joined</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staffMembers.map((staff) => (
                  <tr key={staff._id} className="border-b border-zinc-700 hover:bg-zinc-800/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-zinc-600">
                            <img 
                              src={staff.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(staff.name)}&background=1f2937&color=10b981&bold=true`} 
                              alt={staff.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-white mb-1">
                            {staff.name}
                          </div>
                          <div className="text-sm text-gray-400 flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            Staff ID: {staff._id}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="space-y-2">
                        <div className="text-sm text-gray-300 flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-gray-500" />
                          {staff.email}
                        </div>
                        <div className="text-sm text-gray-400 flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-gray-500" />
                          {staff.phone}
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-medium">
                        {staff.department}
                      </span>
                    </td>
                    
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold">
                        {staff.status}
                      </span>
                    </td>
                    
                    <td className="py-4 px-6 text-gray-300 text-sm">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                        {new Date(staff.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 bg-zinc-700 rounded-lg text-gray-400 hover:text-white hover:bg-zinc-600 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        
                        <button className="p-2 bg-zinc-700 rounded-lg text-gray-400 hover:text-red-400 hover:bg-zinc-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
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

      {/* Add Staff Modal */}
      {showAddStaffModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-linear-to-br from-zinc-800 to-zinc-900 border border-zinc-700 rounded-3xl max-w-2xl w-full">
            <div className="p-6 border-b border-zinc-700">
              <h3 className="text-2xl font-bold text-white">Add New Staff Member</h3>
            </div>
            
            <form className="p-6">
              <div className="space-y-6">
                {/* Profile Photo */}
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-zinc-600 bg-zinc-700">
                      <img 
                        src="https://ui-avatars.com/api/?name=New+Staff&background=1f2937&color=10b981&size=128"
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <label className="absolute bottom-0 right-0 p-2 bg-emerald-500 rounded-full cursor-pointer hover:bg-emerald-600 transition-colors">
                      <Camera className="w-4 h-4 text-white" />
                      <input 
                        type="file" 
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
                
                {/* Email */}
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    placeholder="staff@example.com"
                    className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
                
                {/* Phone */}
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <input 
                    type="tel" 
                    placeholder="+1234567890"
                    className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
                
                {/* Department */}
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    Department
                  </label>
                  <select 
                    className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                
                {/* Password */}
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    Password
                  </label>
                  <input 
                    type="password" 
                    placeholder="Set temporary password"
                    className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-4 mt-8 pt-6 border-t border-zinc-700">
                <button 
                  type="button" 
                  onClick={() => setShowAddStaffModal(false)}
                  className="flex-1 px-6 py-3 bg-zinc-700 rounded-xl text-white font-medium hover:bg-zinc-600 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  className="flex-1 px-6 py-3 bg-linear-to-r from-emerald-500 to-teal-500 rounded-xl text-white font-bold hover:shadow-emerald-500/50 transition-all"
                >
                  Create Staff Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStaff;