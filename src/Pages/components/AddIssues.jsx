import React, { use, useState } from 'react';
import { 
  AlertTriangle, 
  MapPin, 
  Camera, 
  FileText, 
  Tag,
  Upload,
  X,
  Shield,
  Zap,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import axios from 'axios';
import useAxios from '../../Hooks/useAxios';
import { AuthContext } from '../AuthProvider/AuthContext';

const AddIssue = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const axiosInstance = useAxios()
  const {user} = use(AuthContext)

  const categories = [
    'Road & Traffic',
    'Water Supply',
    'Electricity',
    'Sanitation',
    'Public Safety',
    'Parks & Recreation',
    'Building & Construction',
    'Other'
  ];

  const userLimit = {
    isPremium: false,
    remainingIssues: 3,
    canSubmit: true
  };

  const handleSubmit = async (e) =>{
    e.preventDefault()
    const title = e.target.title.value
    const category = e.target.category.value
    const location = e.target.location.value
    const description = e.target.description.value
    const photoURL = e.target.photoURL
    const file = photoURL.files[0]

    const imgbb = await axios.post(`https://api.imgbb.com/1/upload?&key=ca33ef6ed0c09fd575db21260a8a8185`, {image:file}, {
          headers:{
            'Content-Type': 'multipart/form-data'
          }
    })

    const mainPhoto = imgbb.data.data.display_url

    const formData = {
        title,
        category, 
        location,
        description,
        mainPhoto,
        citizenEmail: user?.email
    }
    if(imgbb.data.success == true){
        axiosInstance.post('/addissue', formData)
            .then(res=>console.log(res.data))
            .catch(err=>console.log(err))
    }
console.log(formData)
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            
            <div className="text-center">
              <h1 className="text-3xl font-black text-white">
                Report <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">New Issue</span>
              </h1>
              <p className="text-sm text-gray-400 mt-1">Help us improve your community</p>
            </div>
            
            <div className="w-10"></div>
          </div>
        </div>
      </div>

      {/* User Limit Banner */}
      {!userLimit.isPremium && (
        <div className="bg-gradient-to-r from-amber-900/30 to-yellow-900/30 border-b border-amber-500/30">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-amber-400" />
                <div>
                  <div className="text-white font-medium">Free Account Limit</div>
                  <div className="text-amber-300 text-sm">
                    You can report {userLimit.remainingIssues} more issue{userLimit.remainingIssues !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
              
              {userLimit.remainingIssues === 0 && (
                <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-white font-bold hover:shadow-emerald-500/50 transition-all">
                  <Zap className="w-4 h-4" />
                  <span>Upgrade to Premium</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Premium Badge */}
      {userLimit.isPremium && (
        <div className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border-b border-emerald-500/30">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-300 font-medium">Premium Account • Unlimited Issue Reporting</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Form */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title Field */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-white font-medium">
                <AlertTriangle className="w-5 h-5 text-emerald-500" />
                <span>Issue Title *</span>
              </div>
              <input
                type="text"
                placeholder="Briefly describe the issue (e.g., 'Broken Streetlight on Main Street')"
                className="w-full px-6 py-4 bg-zinc-800 border border-zinc-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                maxLength={100}
                name='title'
              />
              <div className="text-right text-xs text-gray-500">
                0/100 characters
              </div>
            </div>

            {/* Category Field */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-white font-medium">
                <Tag className="w-5 h-5 text-emerald-500" />
                <span>Category *</span>
              </div>
              <div className="relative">
                <select name='category' className="w-full px-6 py-4 bg-zinc-800 border border-zinc-700 rounded-2xl text-white appearance-none focus:outline-none focus:border-emerald-500 transition-colors">
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <div className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Location Field */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-white font-medium">
                <MapPin className="w-5 h-5 text-emerald-500" />
                <span>Location *</span>
              </div>
              <input
              name='location'
                type="text"
                placeholder="Enter exact location (e.g., 'Park Avenue near Central Market, Zone 3')"
                className="w-full px-6 py-4 bg-zinc-800 border border-zinc-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            {/* Description Field */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-white font-medium">
                <FileText className="w-5 h-5 text-emerald-500" />
                <span>Description *</span>
              </div>
              <textarea
                placeholder="Provide detailed description of the issue. Include any relevant details like when you noticed it, how it's affecting the community, safety concerns, etc."
                rows={6}
                className="w-full px-6 py-4 bg-zinc-800 border border-zinc-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                maxLength={500}
                name='description'
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Be as detailed as possible</span>
                <span>0/500 characters</span>
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-3">
            <div>
                <label className="flex items-center space-x-2 text-white font-medium cursor-pointer">
                <Camera className="w-5 h-5 text-emerald-500" />
                <span>Upload Image *</span>
                <input 
                    type="file" 
                    className="hidden"
                    name="photoURL"
                    accept="image/*"
                    required 
                />
                </label>
            </div>
            
            <div className="text-xs text-gray-500">
                Upload a clear photo of the issue. This helps us identify and resolve it faster.
            </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-zinc-700">
              <button className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl font-bold text-lg text-white hover:shadow-emerald-500/50 hover:scale-[1.02] transition-all flex items-center justify-center space-x-3">
                <CheckCircle className="w-5 h-5" />
                <span>Report Issue</span>
              </button>
            </div>
          </form>

          {/* Form Tips */}
          <div className="mt-8 pt-8 border-t border-zinc-700">
            <h3 className="text-lg font-bold text-white mb-4">Tips for Better Reports:</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3 p-4 bg-zinc-800/50 rounded-2xl">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <Camera className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="font-medium text-white mb-1">Clear Photos</div>
                  <div className="text-sm text-gray-400">Take photos from different angles</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-4 bg-zinc-800/50 rounded-2xl">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="font-medium text-white mb-1">Exact Location</div>
                  <div className="text-sm text-gray-400">Include nearby landmarks</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-4 bg-zinc-800/50 rounded-2xl">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="font-medium text-white mb-1">Safety Concerns</div>
                  <div className="text-sm text-gray-400">Mention any safety risks</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-4 bg-zinc-800/50 rounded-2xl">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="font-medium text-white mb-1">Detailed Description</div>
                  <div className="text-sm text-gray-400">Explain how it affects daily life</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddIssue;