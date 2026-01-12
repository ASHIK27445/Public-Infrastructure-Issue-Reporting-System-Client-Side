import React, { useState } from 'react';
import { 
  UserPlus, 
  Mail, 
  Phone, 
  X,
  User, 
  Shield, 
  Edit, 
  Trash2, 
  Calendar,
  Camera,
  CalendarSync,
  AlarmClock
} from 'lucide-react';
import { use } from 'react';
import { AuthContext } from '../AuthProvider/AuthContext';
import { GoEye, GoEyeClosed } from 'react-icons/go';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { toast } from 'react-toastify';
import { RotatingTriangles } from 'react-loader-spinner';
import axios from 'axios';
import { useEffect } from 'react';
import Swal from 'sweetalert2';
const ManageStaff = () => {
  const [staffMembers, setStaffMembers] = useState([])
  const [showAddStaffModal, setShowAddStaffModal] = useState(false)
  const [showEditStaffModal, setShowEditStaffModal] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [editDept, setEditDept] = useState('')
  const [showEditPassword, setShowEditPassword] = useState(false)
  const [selectDept, setSelectDept] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [photo, setPhoto] = useState('')
  const axiosSecure = useAxiosSecure()

  useEffect(()=> {
    axiosSecure.get('/allstaff')
        .then(res => setStaffMembers(res.data))
        .catch(err=> console.log(err))
  }, [axiosSecure])

//   console.log(staffMembers)
  const departments = [
    'Road & Traffic',
    'Water Supply',
    'Electricity',
    'Sanitation',
    'Public Safety',
    'Parks & Recreation',
    'Building & Construction'
  ];

  const handleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handlephotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);


    try {
      const res = await axios.post(
        'https://api.imgbb.com/1/upload?key=ca33ef6ed0c09fd575db21260a8a8185',
        formData
      );
      setPhoto(res.data.data.display_url);
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload photo");
    }
  }

  const handleAddStaff = async(e) => {
    e.preventDefault()
    const name = e.target.name.value
    const tel = e.target.tel.value
    // const photoURL = e.target.photoURL
    const email = e.target.email.value
    const password = e.target.password.value
    // const file = photoURL.files[0]
    // const imgbb = await axios.post(`https://api.imgbb.com/1/upload?&key=ca33ef6ed0c09fd575db21260a8a8185`, {image:file}, {
    //         headers:{
    //           'Content-Type': 'multipart/form-data'
    //         }
    // })
    // const mainPhoto = imgbb.data.data.display_url
    // setPhoto(mainPhoto)

    const e164Pattern = /^\+[1-9]\d{1,14}$/;
    if(!e164Pattern.test(tel)){
      toast.error("Invalid phone number! Must be like +1234567890")
      return;
    }
    if(!password || password.length < 8){
      toast.error("Password Must in 6 character!")
      return;
    }
    const isDuplicate = staffMembers.some(
      staff => staff.email === email || staff.tel === tel
    );
    if(isDuplicate){
      toast.error("Email or Phone number already exists!");
      return;
    }

    if(!photo){
      toast.error("Please upload a profile photo!");
      return;
    }

    const formData = {
        name,
        email,
        password,
        photoURL: photo,
        tel: tel,
        dept: selectDept
    }

    console.log(formData, "photo", photo)

    setLoading(true)
    axiosSecure.post('/addstaff', formData)
        .then(res => {
                    console.log(res.data)
                    setStaffMembers(prev=> [...prev, res.data])
                    toast.success("Success!")
                    e.target.reset()
                    setLoading(false)
                    setShowAddStaffModal(false)
      }).catch(err => {
                    toast.error(err)
                    setLoading(false)
      })

  }

  console.log(selectedStaff)

  const handleEditStaff = (e) => {
    e.preventDefault();

    const updateData = {
        name: e.target.editName.value,
        tel: e.target.editTel.value,
        dept: editDept,
        password: e.target.editPassword.value || selectedStaff?.password,
        uid: selectedStaff?.uid
    }

    console.log(updateData)

    axiosSecure.patch('/update/staff/info', updateData)
        .then(res => {
          setLoading(true)
          console.log(res.data)
        })
        .then(()=> {
            setLoading(false)
            toast.success("User Updated!")
        })
        .catch(err=> console.log(err))
    }

  if(loading){
      return (
        <div className="min-h-screen bg-linear-to-br from-zinc-950 to-zinc-900 flex justify-center items-center">
          <div className="text-center">
            <RotatingTriangles
              visible={true}
              height="80"
              width="80"
              color="#10b981"
              ariaLabel="rotating-triangles-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
            <p className="mt-6 text-lg text-emerald-400 font-semibold">Creating your account...</p>
          </div>
        </div>
      )
  }

  const handleDelete = async (staff) => {
    // Check if has assigned issues
    if (staff.assignIssued > 0) {
      await Swal.fire({
        title: "Cannot Delete",
        html: `
          <div class="text-center">
            <div class="w-20 h-20 mx-auto mb-4 rounded-xl overflow-hidden border-2 border-red-500/30">
              <img src="${staff.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(staff.name)}&background=dc2626&color=fff&bold=true`}" 
                  alt="${staff.name}" 
                  class="w-full h-full object-cover">
            </div>

            <div class="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-xl">
              <p class="text-red-300 font-medium">⚠️ ${staff.assignIssued} assigned issue(s) found</p>
              <p class="text-red-400/80 text-sm mt-1">Unassign all issues before deleting</p>
            </div>
          </div>
        `,
        icon: "error",
        confirmButtonColor: "#dc2626",
        confirmButtonText: "OK",
        background: "#1a1a2e",
        color: "#e0e0e0",
        iconColor: "#dc2626"
      });
      return;
    }

    // Confirmation
    const confirm = await Swal.fire({
      title: "Delete Staff?",
      html: `
        <div class="text-center">
          <div class="w-20 h-20 mx-auto mb-4 rounded-xl overflow-hidden border-2 border-red-500/50">
            <img src="${staff.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(staff.name)}&background=dc2626&color=fff&bold=true`}" 
                alt="${staff.name}" 
                class="w-full h-full object-cover">
          </div>
          <h3 class="text-xl font-bold text-white mb-2">${staff.name}</h3>
          <div class="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-xl">
            <p class="text-red-300 font-medium">⚠️ This action cannot be undone</p>
            <p class="text-red-400/80 text-sm mt-1">Staff will be permanently removed</p>
          </div>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      background: "#1a1a2e",
      color: "#e0e0e0",
      iconColor: "#dc2626"
    });

    if (!confirm.isConfirmed) return;

      // Delete API call
    axiosSecure.delete(`/delete/staff/${staff._id}`)
      .then(res =>{
        setStaffMembers(prev => prev.filter(s => s._id !== staff._id));
        // Success message
        Swal.fire({
          title: "Deleted!",
          html: `
            <div class="text-center">
              <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-900/20 flex items-center justify-center border border-red-500/30">
                <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 class="text-lg font-bold text-white">Staff Deleted</h3>
              <p class="text-gray-300">${staff.name} has been removed</p>
            </div>
          `,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          background: "#1a1a2e",
          color: "#e0e0e0",
          iconColor: "#dc2626"
        });
      }).catch(err=>{
        console.log(err)
        Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Failed to delete staff",
        icon: "error",
        confirmButtonColor: "#dc2626",
        confirmButtonText: "OK",
        background: "#1a1a2e",
        color: "#e0e0e0",
        iconColor: "#dc2626"
      });
      })

  };

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
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Last Updated</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staffMembers.map((staff) => (
                  <tr key={staff?._id} className="border-b border-zinc-700 hover:bg-zinc-800/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-zinc-600">
                            <img 
                              src={staff.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(staff.name)}&background=1f2937&color=10b981&bold=true`} 
                              alt={staff.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-white mb-1">
                            {staff.name}
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
                          {staff.tel}
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-medium">
                        {staff.dept}
                      </span>
                    </td>
                    
                    <td className="py-4 px-6">
                      <span 
                      className={`px-3 py-1 rounded-full text-xs font-bold ${staff?.isBlocked ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                        {staff.isBlocked ? 'blocked' : 'active'}
                      </span>
                    </td>
                    
                    <td className="py-4 px-6 text-gray-300 text-sm">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                        {new Date(staff.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    <td className="py-4 px-6 text-gray-300 text-sm">
                      <div className="flex items-center">
                        <CalendarSync className="w-4 h-4 mr-2 text-gray-500" />
                        {
                          staff?.updatedAt ? new Date(staff?.updatedAt).toLocaleDateString() : 'Not updated Yet'
                        }
                      </div>
                      <div className="flex items-center">
                        <AlarmClock className="w-4 h-4 mr-2 text-gray-500" />
                        {
                          staff?.updatedAt ? 
                          new Date(staff?.updatedAt).toLocaleTimeString([], {
                          hour: '2-digit', minute: '2-digit',hour12: true}) : 'None'
                        }
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => {
                            setSelectedStaff(staff);
                            setEditDept(staff.dept || '');
                            setShowEditStaffModal(true);
                        }}
                        className="p-2 bg-zinc-700 rounded-lg text-gray-400 hover:text-white hover:bg-zinc-600 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        
                        <button 
                          onClick={() => handleDelete(staff)}
                          className="p-2 bg-zinc-700 rounded-lg text-gray-400 hover:text-red-400 hover:bg-zinc-600 transition-colors"
                          title={staff.assignIssued > 0 ? "Has assigned issues" : "Delete staff"}
                        >
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
            
            <form className="p-6" onSubmit={handleAddStaff}>
              <div className="space-y-6">
                {/* Profile Photo */}
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-zinc-600 bg-zinc-700">
                      <img 
                        src={photo || "https://ui-avatars.com/api/?name=New+Staff&background=1f2937&color=10b981&size=128"}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <label className="absolute bottom-0 right-0 p-2 bg-emerald-500 rounded-full cursor-pointer hover:bg-emerald-600 transition-colors">
                      <Camera className="w-4 h-4 text-white" />
                      <input 
                        type="file" 
                        className="hidden"
                        name='photoURL'
                        onChange={handlephotoChange}
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
                    name='name'
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
                    name='email'
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
                    name='tel'
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
                    value={selectDept}
                    onChange={(e)=> {setSelectDept(e.target.value)}}
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept, index )=> (
                      <option key={index} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                
                {/* Password */}
                <div className='relative'>
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    Password
                  </label>
                  <input
                    name='password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Set temporary password"
                    className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <button 
                    type="button"
                    onClick={handleShowPassword}
                    className="absolute right-3 top-13/20 transform -translate-y-1/2 text-gray-400 hover:text-emerald-500 transition-colors p-2">
                    {showPassword ? <GoEyeClosed className="w-5 h-5" /> : 
                                    <GoEye className="w-5 h-5" />}
                  </button>
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
                  type="submit"
                  className="flex-1 px-6 py-3 bg-linear-to-r from-emerald-500 to-teal-500 rounded-xl text-white font-bold hover:shadow-emerald-500/50 transition-all"
                >
                  Create Staff Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

        {/* Edit Staff Modal */}
        {showEditStaffModal && selectedStaff && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl">
            {/* Header */}
            <div className="p-5 border-b border-zinc-800">
                <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-white">Edit Staff</h3>
                    <p className="text-sm text-gray-400 mt-0.5">{selectedStaff.name}</p>
                </div>
                <button 
                    onClick={() => setShowEditStaffModal(false)}
                    className="text-gray-400 hover:text-white transition-colors p-1"
                >
                    <X className="w-5 h-5" />
                </button>
                </div>
            </div>
            
            {/* Form */}
            <form onSubmit={handleEditStaff} className="p-5">
                <div className="space-y-4">
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Name
                    </label>
                    <input 
                    name="editName"
                    type="text"
                    defaultValue={selectedStaff.name}
                    required
                    className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    />
                </div>


                {/* Phone & Department - Same Row */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        Phone
                    </label>
                    <input 
                        name="editTel"
                        type="tel"
                        defaultValue={selectedStaff.tel}
                        required
                        className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    />
                    </div>
                    
                    <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        Department
                    </label>
                    <select 
                        value={editDept}
                        onChange={(e) => setEditDept(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 appearance-none"
                    >
                        <option value="">Select</option>
                        {departments.map((dept, index) => (
                        <option key={index} value={dept} className="bg-zinc-800">{dept}</option>
                        ))}
                    </select>
                    </div>
                </div>

                {/* Password */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Password <span className="text-xs text-gray-500 font-normal">(optional)</span>
                    </label>
                    <div className="relative">
                    <input 
                        name="editPassword"
                        type={showEditPassword ? "text" : "password"}
                        placeholder="New password"
                        className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 pr-10"
                    />
                    <button 
                        type="button"
                        onClick={() => setShowEditPassword(!showEditPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-500 transition-colors p-1"
                    >
                        {showEditPassword ? <GoEyeClosed className="w-4 h-4" /> : <GoEye className="w-4 h-4" />}
                    </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1.5">Leave empty to keep current password</p>
                </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6 pt-5 border-t border-zinc-800">
                <button 
                    type="button"
                    onClick={() => setShowEditStaffModal(false)}
                    className="flex-1 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-gray-300 rounded-lg text-sm font-medium transition-colors"
                >
                    Cancel
                </button>
                <button 
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                    Save Changes
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