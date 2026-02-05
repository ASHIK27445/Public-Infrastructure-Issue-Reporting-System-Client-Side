import React, { useState, use } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Edit,
  Save,
  X,
  Crown,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Shield,
  Loader2,
  CreditCard,
  Sparkles,
  FileText,
  TrendingUp
} from 'lucide-react';
import { AuthContext } from '../AuthProvider/AuthContext';
import { useOutletContext } from 'react-router';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { toast } from 'react-toastify';

const MyProfile = () => {
  const { user, role } = use(AuthContext);
  const { citizen } = useOutletContext();
  const axiosSecure = useAxiosSecure();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: citizen?.name || '',
    phone: citizen?.phone || '',
    address: citizen?.address || '',
  });


  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle profile update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosSecure.patch('/user/update', {
        name: formData.name,
        phone: formData.phone,
        address: formData.address
      });

      if (response.data) {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
        // Refresh page or update context
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      name: citizen?.name || '',
      phone: citizen?.phone || '',
      address: citizen?.address || '',
    });
  }

  const handleSubscribe = () => {
    if(!citizen._id || citizen.isPremium){
      toast('Citizen Not found/Premium!')
      return
    }
    setPaymentLoading(true)
    axiosSecure.post('/create-checkout-session', {type: 'premium'})
      .then(res => {
        // console.log(res.data)
        window.location.href = res.data.sessionURL
      }).catch(err=> {
        // console.log(err)
      })
        .finally(()=> setPaymentLoading(false))
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-950 to-zinc-900 p-6">
      <title>CommunityFix - Profile</title>
      <div className="max-w-5xl mx-auto">
        {/* Blocked User Warning */}
        {citizen?.isBlocked && (
          <div className="mb-6 bg-linear-to-r from-red-900/40 to-orange-900/40 border-2 border-red-500/50 rounded-3xl p-6 backdrop-blur-sm">
            <div className="flex items-start space-x-4">
              <div className="shrink-0">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-red-400 mb-2">
                  ⚠️ Account Blocked
                </h3>
                <p className="text-gray-300 mb-4">
                  Your account has been temporarily blocked by the administration. 
                  This may be due to violation of community guidelines or suspicious activity.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button className="px-6 py-2 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 font-medium hover:bg-red-500/30 transition-all flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>Contact Support</span>
                  </button>
                  <a 
                    href="mailto:support@piirs.com" 
                    className="px-6 py-2 bg-zinc-700/50 border border-zinc-600 rounded-xl text-gray-300 font-medium hover:bg-zinc-600/50 transition-all"
                  >
                    support@piirs.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 overflow-hidden mb-6">
          {/* Cover Photo */}
          <div className="h-40 relative overflow-hidden">
            {/* Admin Cover with Dark Theme */}
            {role === 'admin' ? (
              <div className="absolute inset-0">
                <img
                  src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                  alt="Admin Cover"
                  className="w-full h-full object-cover"/>
                <div className="absolute inset-0 bg-linear-to-r from-gray-900/70 via-gray-800/70 to-black/70"></div>
                {/* Grid Overlay for Tech Look */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] 
                bg-size-[20px_20px]"></div>
              </div>
            ) : role === 'staff' ? (
              /* Staff Cover with Blue Theme */
              <div className="absolute inset-0">
                <img
                  src="/wp51.jpg"
                  alt="Anime Dark Theme"
                  className="w-full h-full object-cover"/>
                <div className="absolute inset-0 bg-linear-to-r from-blue-900/60 via-indigo-900/60 to-purple-900/60"></div>
              </div>
            ) : citizen?.isPremium ? (
              /* Premium Citizen Cover */
              <div className="absolute inset-0">
                <img
                  src={"/wp12.jpg" || "https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"}
                  alt="Premium Cover"
                  className="w-full h-full object-cover"/>
                <div className="absolute inset-0 bg-linear-to-r from-purple-900/60 via-pink-900/60 to-blue-900/60"></div>
              </div>
            ) : (
              /* Default Citizen Cover */
              <div className="bg-linear-to-r from-emerald-600 via-teal-600 to-cyan-600 h-full">
                <div className="absolute inset-0 bg-black/20"></div>
                {/* Subtle Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_30%,#ffffff,transparent_50%)]"></div>
              </div>
            )}
            
            {/* Badges */}
            {role === 'admin' && (
              <div className="absolute top-4 right-4">
                <div className="bg-linear-to-r from-red-600 via-orange-500 to-amber-500 px-4 py-2 rounded-full flex items-center space-x-2 shadow-lg backdrop-blur-sm border border-amber-500/30">
                  <Shield className="w-5 h-5 text-white" />
                  <span className="text-white font-bold text-sm tracking-wider">ADMIN</span>
                </div>
              </div>
            )}
            
            {role === 'staff' && (
              <div className="absolute top-4 right-4">
                <div className="bg-linear-to-r from-blue-600 via-indigo-500 to-purple-500 px-4 py-2 rounded-full flex items-center space-x-2 shadow-lg backdrop-blur-sm border border-blue-400/30">
                  <User className="w-5 h-5 text-white" />
                  <span className="text-white font-bold text-sm tracking-wider">STAFF</span>
                </div>
              </div>
            )}
            
            {role === 'citizen' && citizen?.isPremium && (
              <div className="absolute top-4 right-4">
                <div className="bg-linear-to-r from-yellow-500 via-amber-500 to-orange-500 px-4 py-2 rounded-full flex items-center space-x-2 shadow-lg backdrop-blur-sm border border-yellow-400/30">
                  <Crown className="w-5 h-5 text-white" />
                  <span className="text-white font-bold text-sm tracking-wider">PREMIUM</span>
                </div>
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 mb-6">
              {/* Profile Picture */}
              <div className="relative mb-4 md:mb-0">
                <div className="w-32 h-32 rounded-3xl border-4 border-zinc-900 overflow-hidden bg-zinc-800 shadow-xl">
                  <img
                    src={citizen?.photoURL || user?.photoURL || 'https://via.placeholder.com/150'}
                    alt={citizen?.name || 'User'}
                    className="w-full h-full object-cover"
                  />
                </div>
                {citizen?.isPremium && (
                  <div className="absolute -bottom-2 -right-2 bg-linear-to-r from-yellow-500 to-amber-500 w-10 h-10 rounded-full flex items-center justify-center border-4 border-zinc-900 shadow-lg">
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>

              {/* Name and Actions */}
              <div className="flex-1 md:ml-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h1 className="text-3xl font-black text-white">
                        {citizen?.name || 'User Name'}
                      </h1>
                      {citizen?.isPremium && (
                        <div className="flex items-center space-x-1 px-3 py-1 bg-linear-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-full">
                          <Sparkles className="w-4 h-4 text-yellow-400" />
                          <span className="text-xs font-bold text-yellow-400">PRO</span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-400 flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      {citizen?.role || 'Citizen'}
                    </p>
                  </div>

                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="mt-4 md:mt-0 px-6 py-3 bg-linear-to-r from-emerald-500 to-teal-500 rounded-2xl text-white font-bold hover:shadow-emerald-500/50 transition-all flex items-center space-x-2"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit Profile</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">
                      {role === 'staff' ? 'Total Assigned Issue' : 'Total issues'}
                    </p>
                    <p className="text-2xl font-black text-white mt-1">
                      {role === 'staff' ? citizen?.assignIssued : citizen?.issueCount || 0}
                    </p>
                  </div>
                  <FileText className="w-8 h-8 text-emerald-500" />
                </div>
              </div>

              <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Member Since</p>
                    <p className="text-lg font-bold text-white mt-1">
                      {citizen?.createdAt 
                        ? new Date(citizen.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            year: 'numeric' 
                          })
                        : 'N/A'
                      }
                    </p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Account Status</p>
                    <p className="text-lg font-bold text-white mt-1">
                      {citizen?.isBlocked ? (
                        <span className="text-red-400">Blocked</span>
                      ) : citizen?.isPremium ? (
                        <span className="text-yellow-400">Premium</span>
                      ) : (
                        <span className="text-emerald-400">Active</span>
                      )}
                    </p>
                  </div>
                  {citizen?.isBlocked ? (
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                  ) : citizen?.isPremium ? (
                    <Crown className="w-8 h-8 text-yellow-500" />
                  ) : (
                    <CheckCircle className="w-8 h-8 text-emerald-500" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column - Profile Details */}
          <div className="md:col-span-2">
            <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-6">
              <h2 className="text-2xl font-black text-white mb-6">Profile Information</h2>

              {isEditing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                      required
                    />
                  </div>

                  {/* Email (Read-only) */}
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={citizen?.email || user?.email || ''}
                      className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-gray-400 cursor-not-allowed"
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+880 1XXX-XXXXXX"
                      className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter your full address"
                      rows="3"
                      className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-4 pt-4 border-t border-zinc-700">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-6 py-3 bg-linear-to-r from-emerald-500 to-teal-500 rounded-xl text-white font-bold hover:shadow-emerald-500/50 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={loading}
                      className="flex-1 px-6 py-3 bg-zinc-700 rounded-xl text-white font-medium hover:bg-zinc-600 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                    >
                      <X className="w-5 h-5" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700">
                    <User className="w-5 h-5 text-emerald-500" />
                    <div>
                      <p className="text-gray-400 text-sm">Full Name</p>
                      <p className="text-white font-medium">{citizen?.name || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700">
                    <Mail className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-gray-400 text-sm">Email</p>
                      <p className="text-white font-medium">{citizen?.email || user?.email || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700">
                    <Phone className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="text-gray-400 text-sm">Phone</p>
                      <p className="text-white font-medium">{citizen?.phone || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700">
                    <MapPin className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="text-gray-400 text-sm">Address</p>
                      <p className="text-white font-medium">{citizen?.address || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Premium Subscription */}
          <div className="md:col-span-1">
            {role === 'citizen' || role === 'admin' ? 
              (!citizen?.isPremium ? (
              <div className="bg-linear-to-br from-yellow-900/30 to-amber-900/30 rounded-3xl border-2 border-yellow-500/30 p-6 relative overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-yellow-500/10 to-transparent rounded-full blur-3xl"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-center w-16 h-16 bg-linear-to-r from-yellow-500 to-amber-500 rounded-2xl mb-4 shadow-lg">
                    <Crown className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-black text-white mb-2">
                    Upgrade to Premium
                  </h3>
                  <p className="text-gray-300 text-sm mb-6">
                    Unlock unlimited issue submissions and priority support!
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <p className="text-gray-300 text-sm">Unlimited issue submissions</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <p className="text-gray-300 text-sm">Priority issue resolution</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <p className="text-gray-300 text-sm">Premium badge on profile</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <p className="text-gray-300 text-sm">Advanced analytics</p>
                    </div>
                  </div>

                  <div className="bg-zinc-900/50 rounded-2xl p-4 mb-6 border border-zinc-700">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">One-time payment</p>
                        <p className="text-4xl font-black text-white">1000<span className="text-xl text-gray-400">৳</span></p>
                      </div>
                      <div className="text-right">
                        <p className="text-emerald-400 text-sm font-bold">Limited Offer!</p>
                        <p className="text-gray-500 text-xs line-through">2000৳</p>
                      </div>
                    </div>
                  </div>

                  <button
                      onClick={handleSubscribe}
                      disabled={paymentLoading || citizen?.isBlocked || citizen?.isPremium}
                      className="w-full px-6 py-4 bg-linear-to-r from-yellow-500 to-amber-500 rounded-2xl text-white font-black text-lg hover:shadow-yellow-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {paymentLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5" />
                          <span>Subscribe Now</span>
                        </>
                      )}
                  </button>

                  {citizen?.isBlocked && (
                    <p className="text-red-400 text-xs text-center mt-2">
                      Cannot subscribe while account is blocked
                    </p>
                  )}
                </div>
              </div>) : (
              <div className="bg-linear-to-br from-yellow-900/30 to-amber-900/30 rounded-3xl border-2 border-yellow-500/30 p-6">
                <div className="flex items-center justify-center w-16 h-16 bg-linear-to-r from-yellow-500 to-amber-500 rounded-2xl mb-4 shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl font-black text-white mb-2">
                  Premium Member
                </h3>
                <p className="text-gray-300 text-sm mb-6">
                  You're enjoying all premium benefits!
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-xl">
                    <span className="text-gray-400 text-sm">Issue Limit</span>
                    <span className="text-emerald-400 font-bold">∞ Unlimited</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-xl">
                    <span className="text-gray-400 text-sm">Priority Support</span>
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-xl">
                    <span className="text-gray-400 text-sm">Analytics</span>
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4">
                  <p className="text-emerald-400 text-sm text-center font-medium">
                    🎉 Thank you for being a Premium member!
                  </p>
                </div>
              </div>) ) : (
              <div className="bg-linear-to-br from-blue-900/30 to-purple-900/30 rounded-3xl border-2 border-blue-500/30 p-6">
                <div className="flex items-center justify-center w-16 h-16 bg-linear-to-r from-blue-500 to-purple-500 rounded-2xl mb-4 shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl font-black text-white mb-2">
                  Staff Account
                </h3>
                
                <div className="space-y-4 mb-6">
                  <div className="bg-zinc-900/50 rounded-2xl p-4 border border-zinc-700">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-400 text-sm">Account Type</span>
                      <span className="text-blue-400 font-bold">STAFF</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Access Level</span>
                      <span className="text-purple-400 font-bold">Full Access</span>
                    </div>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4">
                    <h4 className="text-blue-400 font-bold mb-2">Staff Benefits</h4>
                    <ul className="text-gray-300 text-sm space-y-2">
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-emerald-400 mr-2" />
                        Unlimited issue management
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-emerald-400 mr-2" />
                        Priority system access
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-emerald-400 mr-2" />
                        Direct admin tools
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-gray-400 text-xs">
                    Verified staff member since {citizen?.createdAt 
                      ? new Date(citizen.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          year: 'numeric' 
                        })
                      : 'N/A'
                    }
                  </p>
                </div>
              </div>)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;