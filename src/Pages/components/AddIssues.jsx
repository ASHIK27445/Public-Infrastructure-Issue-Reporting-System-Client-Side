import React, { use, useState, useEffect } from 'react';
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
  ArrowLeft,
  Loader2,
  Crown,
  Lock
} from 'lucide-react';
import axios from 'axios';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { AuthContext } from '../AuthProvider/AuthContext';
import { useNavigate, useOutletContext } from 'react-router';
import { toast } from 'react-toastify';

const AddIssue = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [titleLength, setTitleLength] = useState(0);
  const [descLength, setDescLength] = useState(0);
  
  const axiosSecure = useAxiosSecure();
  const { user } = use(AuthContext);
  const { citizen } = useOutletContext();
  const navigate = useNavigate();

  const categories = [
    'Road & Traffic',
    'Water Supply',
    'Electricity',
    'Sanitation',
    'Public Safety',
    'Parks & Recreation',
    'Building & Construction',
    'Streetlight',
    'Pothole',
    'Water Leak',
    'Garbage',
    'Footpath',
    'Other'
  ];

  // Calculate user limits
  const FREE_USER_LIMIT = 3;
  const isPremium = citizen?.isPremium || false;
  const issueCount = citizen?.issueCount || 0;
  const remainingIssues = Math.max(0, FREE_USER_LIMIT - issueCount);
  const canSubmit = isPremium || remainingIssues > 0;

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user can submit
    if (!canSubmit) {
      toast.error('You have reached your free issue limit. Please upgrade to Premium!');
      return;
    }

    // Validate image is selected
    if (!selectedImage) {
      toast.error('Please upload an image of the issue');
      return;
    }

    setUploading(true);

    try {
      // Get form data
      const title = e.target.title.value;
      const category = e.target.category.value;
      const location = e.target.location.value;
      const description = e.target.description.value;

      // Validate fields
      if (!title || !category || !location || !description) {
        toast.error('Please fill in all required fields');
        setUploading(false);
        return;
      }

      // Upload image to imgbb
      const formData = new FormData();
      formData.append('image', selectedImage);

      const imgbbResponse = await axios.post(
        `https://api.imgbb.com/1/upload?key=ca33ef6ed0c09fd575db21260a8a8185`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (imgbbResponse.data.success) {
        const mainPhoto = imgbbResponse.data.data.display_url;

        // Prepare issue data
        const issueData = {
          title,
          category,
          location,
          description,
          mainPhoto,
          citizenEmail: user?.email
        };

        // Submit issue to backend
        const response = await axiosSecure.post('/addissue', issueData);

        if (response.data) {
          toast.success('🎉 Issue reported successfully!');
          
          // Navigate to my issues page after short delay
          setTimeout(() => {
            navigate('/dashboard/my-issues');
          }, 1500);
        }
      } else {
        toast.error('Failed to upload image. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting issue:', error);
      toast.error('Failed to report issue. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
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

      {/* User Limit Banner - Free Users */}
      {!isPremium && canSubmit && (
        <div className="bg-gradient-to-r from-amber-900/30 to-yellow-900/30 border-b border-amber-500/30">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-amber-400" />
                <div>
                  <div className="text-white font-medium">Free Account Limit</div>
                  <div className="text-amber-300 text-sm">
                    You can report {remainingIssues} more issue{remainingIssues !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => navigate('/dashboard/profile')}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl text-white font-bold hover:shadow-yellow-500/50 transition-all"
              >
                <Crown className="w-4 h-4" />
                <span>Upgrade to Premium</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Limit Reached Banner - Free Users */}
      {!isPremium && !canSubmit && (
        <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 border-b border-red-500/30">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Lock className="w-5 h-5 text-red-400" />
                <div>
                  <div className="text-white font-medium">Issue Limit Reached</div>
                  <div className="text-red-300 text-sm">
                    You've used all {FREE_USER_LIMIT} free issue reports. Upgrade to continue!
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => navigate('/dashboard/profile')}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl text-white font-bold hover:shadow-yellow-500/50 transition-all"
              >
                <Crown className="w-4 h-4" />
                <span>Upgrade Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Premium Badge */}
      {isPremium && (
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
                name="title"
                placeholder="Briefly describe the issue (e.g., 'Broken Streetlight on Main Street')"
                className="w-full px-6 py-4 bg-zinc-800 border border-zinc-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                maxLength={100}
                required
                disabled={!canSubmit}
                onChange={(e) => setTitleLength(e.target.value.length)}
              />
              <div className="text-right text-xs text-gray-500">
                {titleLength}/100 characters
              </div>
            </div>

            {/* Category Field */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-white font-medium">
                <Tag className="w-5 h-5 text-emerald-500" />
                <span>Category *</span>
              </div>
              <div className="relative">
                <select 
                  name="category" 
                  className="w-full px-6 py-4 bg-zinc-800 border border-zinc-700 rounded-2xl text-white appearance-none focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                  disabled={!canSubmit}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <Tag className="w-5 h-5 text-gray-400" />
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
                name="location"
                type="text"
                placeholder="Enter exact location (e.g., 'Park Avenue near Central Market, Zone 3')"
                className="w-full px-6 py-4 bg-zinc-800 border border-zinc-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                required
                disabled={!canSubmit}
              />
            </div>

            {/* Description Field */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-white font-medium">
                <FileText className="w-5 h-5 text-emerald-500" />
                <span>Description *</span>
              </div>
              <textarea
                name="description"
                placeholder="Provide detailed description of the issue. Include any relevant details like when you noticed it, how it's affecting the community, safety concerns, etc."
                rows={6}
                className="w-full px-6 py-4 bg-zinc-800 border border-zinc-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                maxLength={500}
                required
                disabled={!canSubmit}
                onChange={(e) => setDescLength(e.target.value.length)}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Be as detailed as possible</span>
                <span>{descLength}/500 characters</span>
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-white font-medium">
                <Camera className="w-5 h-5 text-emerald-500" />
                <span>Upload Image *</span>
              </div>

              {!imagePreview ? (
                <label className={`block ${!canSubmit ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                  <div className="border-2 border-dashed border-zinc-700 rounded-2xl p-8 hover:border-emerald-500 transition-colors">
                    <div className="text-center">
                      <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-white font-medium mb-2">Click to upload image</p>
                      <p className="text-sm text-gray-400">PNG, JPG up to 5MB</p>
                    </div>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={!canSubmit}
                  />
                </label>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-zinc-700">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-4 right-4 p-2 bg-red-500/90 hover:bg-red-600 rounded-full text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              <div className="text-xs text-gray-500">
                Upload a clear photo of the issue. This helps us identify and resolve it faster.
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-zinc-700">
              {canSubmit ? (
                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl font-bold text-lg text-white hover:shadow-emerald-500/50 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Report Issue</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/profile')}
                  className="w-full py-4 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-2xl font-bold text-lg text-white hover:shadow-yellow-500/50 hover:scale-[1.02] transition-all flex items-center justify-center space-x-3"
                >
                  <Crown className="w-5 h-5" />
                  <span>Upgrade to Premium to Report More Issues</span>
                </button>
              )}
            </div>
          </form>

          {/* Form Tips */}
          <div className="mt-8 pt-8 border-t border-zinc-700">
            <h3 className="text-lg font-bold text-white mb-4">Tips for Better Reports:</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3 p-4 bg-zinc-800/50 rounded-2xl">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Camera className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="font-medium text-white mb-1">Clear Photos</div>
                  <div className="text-sm text-gray-400">Take photos from different angles</div>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-zinc-800/50 rounded-2xl">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="font-medium text-white mb-1">Exact Location</div>
                  <div className="text-sm text-gray-400">Include nearby landmarks</div>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-zinc-800/50 rounded-2xl">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="font-medium text-white mb-1">Safety Concerns</div>
                  <div className="text-sm text-gray-400">Mention any safety risks</div>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-zinc-800/50 rounded-2xl">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
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