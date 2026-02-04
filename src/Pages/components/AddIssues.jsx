import React, { useState, useEffect, useRef, useContext } from 'react';
import { 
  AlertTriangle, 
  MapPin, 
  Camera, 
  FileText, 
  Tag,
  Upload,
  X,
  Shield,
  CheckCircle,
  ArrowLeft,
  Loader2,
  Crown,
  Search,
  Navigation,
  Globe,
  Plus,
  Edit2,
  Satellite,
  Calendar,
  Clock,
  Pin,
  Image as ImageIcon,
  Target,
  Compass,
  Send,
  Info,
  CheckSquare,
  AlertCircle,
  Map,
  FileUp,
  Radio,
  Award,
  BarChart
} from 'lucide-react';
import axios from 'axios';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { AuthContext } from '../AuthProvider/AuthContext';
import { useNavigate, useOutletContext } from 'react-router';
import { toast } from 'react-toastify';
import { getSmartAddress } from '../Others/AddressFormatter';

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/dist/images/marker-shadow.png',
});

const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
        );
        const data = await response.json();
        
        onMapClick({
          lat,
          lng,
          address: data.display_name || `Location at ${lat.toFixed(6)}, ${lng.toFixed(6)}`
        });
      } catch (error) {
        console.error('Error getting address:', error);
        onMapClick({
          lat,
          lng,
          address: `Location at ${lat.toFixed(6)}, ${lng.toFixed(6)}`
        });
      }
    },
  });
  return null;
}

const AddIssue = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [titleLength, setTitleLength] = useState(0);
  const [descLength, setDescLength] = useState(0);
  const [showMap, setShowMap] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState({
    address: '',
    lat: null,
    lng: null,
    isManual: false
  });
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualAddress, setManualAddress] = useState('');
  const [mapPosition, setMapPosition] = useState([23.8103, 90.4125]);
  
  const [gettingLocation, setGettingLocation] = useState(false);
  const [gpsAccuracy, setGpsAccuracy] = useState(null);
  const [gpsHeading, setGpsHeading] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false)
  
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const { citizen } = useOutletContext();
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const debounceTimer = useRef(null);
  const gpsIntervalRef = useRef(null);
  const gpsWatchId = useRef(null);

  const DEFAULT_LAT = 23.8103;
  const DEFAULT_LNG = 90.4125;

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

  const FREE_USER_LIMIT = 3;
  const isPremium = citizen?.isPremium || false;
  const issueCount = citizen?.issueCount || 0;
  const remainingIssues = Math.max(0, FREE_USER_LIMIT - issueCount);
  const canSubmit = isPremium || remainingIssues > 0;
  const disabled = !canSubmit;

  useEffect(() => {
    return () => {
      if (gpsIntervalRef.current) {
        clearInterval(gpsIntervalRef.current);
      }
      if (gpsWatchId.current && navigator.geolocation) {
        navigator.geolocation.clearWatch(gpsWatchId.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    if (value.trim().length > 2) {
      debounceTimer.current = setTimeout(() => {
        performSearch(value);
      }, 500);
    } else {
      setSearchResults([]);
    }
  };

  const performSearch = async (query) => {
    if (!query.trim()) return;
    
    setSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1&countrycodes=bd`
      );
      
      if (response.ok) {
        const data = await response.json();
        
        if (data && data.length > 0) {
          const formattedResults = data.map(item => ({
            display_name: item.display_name,
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon)
          }));
          setSearchResults(formattedResults);
        } else {
          setSearchResults([]);
        }
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectLocation = (location) => {
    setSelectedLocation({
      address: location.display_name,
      lat: location.lat,
      lng: location.lon,
      isManual: false
    });
    setSearchQuery(location.display_name);
    setMapPosition([location.lat, location.lon]);
    setSearchResults([]);
    setShowManualInput(false);
  };

  const handleMapClick = (locationData) => {
    setSelectedLocation({
      address: locationData.address,
      lat: locationData.lat,
      lng: locationData.lng,
      isManual: false
    });
    setSearchQuery(locationData.address);
    setMapPosition([locationData.lat, locationData.lng]);
    setShowManualInput(false);
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation || disabled) {
      toast.error('Geolocation is not supported or you have reached your limit');
      return;
    }

    setGettingLocation(true);
    setGpsAccuracy(null);
    
    gpsIntervalRef.current = setInterval(() => {
      setGpsHeading(prev => (prev + 45) % 360);
    }, 100);

    gpsWatchId.current = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        
        if (gpsIntervalRef.current) {
          clearInterval(gpsIntervalRef.current);
          gpsIntervalRef.current = null;
        }
        
        if (gpsWatchId.current) {
          navigator.geolocation.clearWatch(gpsWatchId.current);
        }
        
        setGpsAccuracy(accuracy.toFixed(1));
        
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          const data = await response.json();
          
          const address = data.display_name || `Current Location (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`;
          
          setSelectedLocation({
            address: address,
            lat: latitude,
            lng: longitude,
            isManual: false
          });
          setSearchQuery(address);
          setMapPosition([latitude, longitude]);
          setShowManualInput(false);
          
          toast.success(`📍 Location found! Accuracy: ${accuracy.toFixed(0)} meters`);
          
        } catch (error) {
          console.error('Error getting address:', error);
          const address = `Current Location - Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`;
          setSelectedLocation({
            address: address,
            lat: latitude,
            lng: longitude,
            isManual: false
          });
          setSearchQuery(address);
          setMapPosition([latitude, longitude]);
          toast.success('📍 Location found using GPS coordinates');
        } finally {
          setGettingLocation(false);
          setGpsAccuracy(null);
        }
      },
      (error) => {
        if (gpsIntervalRef.current) {
          clearInterval(gpsIntervalRef.current);
          gpsIntervalRef.current = null;
        }
        
        setGettingLocation(false);
        setGpsAccuracy(null);
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            toast.error('Location access denied. Please enable location services in your browser settings.');
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error('Location information is unavailable. Please check your GPS connection.');
            break;
          case error.TIMEOUT:
            toast.error('Location request timed out. Please try again.');
            break;
          default:
            toast.error('Failed to get current location. Please try again.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );

    setTimeout(() => {
      if (gettingLocation) {
        if (gpsIntervalRef.current) {
          clearInterval(gpsIntervalRef.current);
          gpsIntervalRef.current = null;
        }
        if (gpsWatchId.current) {
          navigator.geolography.clearWatch(gpsWatchId.current);
        }
        setGettingLocation(false);
        toast.error('GPS signal weak. Please try again or use manual location.');
      }
    }, 15000);
  };

  const handleManualLocationSubmit = () => {
    if (!manualAddress.trim()) {
      toast.error('Please enter an address');
      return;
    }

    setSelectedLocation({
      address: manualAddress,
      lat: DEFAULT_LAT,
      lng: DEFAULT_LNG,
      isManual: true
    });
    setSearchQuery(manualAddress);
    setMapPosition([DEFAULT_LAT, DEFAULT_LNG]);
    setShowManualInput(false);
    toast.success('Manual location added!');
  };

  const handleResetLocation = () => {
    setSelectedLocation({
      address: '',
      lat: null,
      lng: null,
      isManual: false
    });
    setSearchQuery('');
    setManualAddress('');
    setShowManualInput(false);
    setSearchResults([]);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      setSelectedImage(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault()

    if(!user) return;

    if (!canSubmit) {
      toast.error('You have reached your free issue limit. Please upgrade to Premium!');
      return;
    }

    if (!selectedImage) {
      toast.error('Please upload an image of the issue');
      return;
    }

    if (!selectedLocation.address.trim()) {
      toast.error('Please enter a location');
      return;
    }

    setUploading(true);

    try {
      const title = e.target.title.value;
      const category = e.target.category.value;
      const description = e.target.description.value;

      if (!title || !category || !description) {
        toast.error('Please fill in all required fields');
        setUploading(false);
        return;
      }

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

      const shortlocation = getSmartAddress(selectedLocation?.address)
      const locationAt = {lat: selectedLocation.lat, lng:selectedLocation.lng}

      // console.log(locationAt)

      if (imgbbResponse.data.success) {
        const mainPhoto = imgbbResponse.data.data.display_url;

        const issueData = {
          title,
          category,
          description,
          mainPhoto,
          citizenEmail: user?.email,
          location: shortlocation,
          locationAt: locationAt
        };
        // console.log(issueData)
        // console.log(shortlocation)
        // console.log(locationAt)
        const response = await axiosSecure.post('/addissue', issueData);

        if (response.data) {
          toast.success('🎉 Issue reported successfully!');
          
          setTimeout(() => {
            navigate('/dashboard/dashboard/manageissues');
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


console.log(getSmartAddress(selectedLocation.address))

  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-950 to-zinc-900">
      {/* Top Header - Minimal */}
      <div className="sticky top-0 z-40 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                  Report <span className="bg-linear-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Issue</span>
                </h1>
                <p className="text-gray-400">Help improve your community</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-3 textarea-md text-gray-400">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
              </div>
              
              <div className={`px-4 py-2.5 rounded-2xl border ${isPremium ? 'bg-yellow-500/20 border-yellow-500/30' : 'bg-emerald-500/20 border-emerald-500/30'}`}>
                <div className="flex items-center space-x-2">
                  {isPremium ? (
                    <Crown className="w-5 h-5 text-yellow-400" />
                  ) : (
                    <Shield className="w-5 h-5 text-emerald-400" />
                  )}
                  <span className="text-white font-bold">
                    {isPremium ? 'Premium' : `${remainingIssues} left`}
                  </span>
                </div>
              </div>
              
              {!isPremium && (
                <button 
                  onClick={() => navigate('/dashboard/dashboard/myProfile')}
                  className="px-6 py-3 bg-linear-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 rounded-2xl text-white font-bold flex items-center space-x-2 transition-all"
                >
                  <Crown className="w-5 h-5" />
                  <span className="hidden sm:inline">Upgrade</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Progress Indicators */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-white font-semibold">Submission Progress</h2>
            <span className="text-emerald-400 textarea-md font-medium">
              {Math.round(((
                (titleLength > 0 ? 1 : 0) +
                (selectedLocation.address ? 1 : 0) +
                (descLength >= 60 ? 1 : 0) +
                (selectedImage ? 1 : 0)
              ) / 4) * 100)}% Complete
            </span>
          </div>
          
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className={`h-1 rounded-full ${titleLength > 0 ? 'bg-emerald-500' : 'bg-zinc-800'}`}></div>
            <div className={`h-1 rounded-full ${selectedLocation.address ? 'bg-emerald-500' : 'bg-zinc-800'}`}></div>
            <div className={`h-1 rounded-full ${descLength >= 60 ? 'bg-emerald-500' : 'bg-zinc-800'}`}></div>
            <div className={`h-1 rounded-full ${selectedImage ? 'bg-emerald-500' : 'bg-zinc-800'}`}></div>
          </div>
          
          <div className="grid grid-cols-4 gap-2 text-xs">
            <div className={`text-center ${titleLength > 0 ? 'text-emerald-400' : 'text-gray-500'}`}>
              <div className="font-medium">Title</div>
              <div>{titleLength > 0 ? '✓' : 'Required'}</div>
            </div>
            <div className={`text-center ${selectedLocation.address ? 'text-emerald-400' : 'text-gray-500'}`}>
              <div className="font-medium">Location</div>
              <div>{selectedLocation.address ? '✓' : 'Required'}</div>
            </div>
            <div className={`text-center ${descLength >= 60 ? 'text-emerald-400' : 'text-gray-500'}`}>
              <div className="font-medium">Description</div>
              <div>{descLength >= 60 ? '✓' : `${descLength}/60`}</div>
            </div>
            <div className={`text-center ${selectedImage ? 'text-emerald-400' : 'text-gray-500'}`}>
              <div className="font-medium">Photo</div>
              <div>{selectedImage ? '✓' : 'Required'}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Issue Form Card */}
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title & Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block textarea-md font-medium text-gray-300 mb-2">
                      Issue Title <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="title"
                        placeholder="e.g., Broken street light"
                        className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all disabled:opacity-50"
                        maxLength={100}
                        required
                        disabled={disabled}
                        onChange={(e) => setTitleLength(e.target.value.length)}
                      />
                      <div className="absolute right-3 top-3 text-xs text-gray-500">
                        {titleLength}/100
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block textarea-md font-medium text-gray-300 mb-2">
                      Category <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <select 
                        name="category" 
                        className="forthisonly w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500 *:bg-zinc-900/95  focus:border-transparent transition-all disabled:opacity-50"
                        required
                        disabled={disabled}

                      >
                        <option className='' value="">Select category</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <Tag className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block textarea-md font-medium text-gray-300">
                      Location <span className="text-rose-500">*</span>
                    </label>
                    {selectedLocation.address && (
                      <button
                        type="button"
                        onClick={handleResetLocation}
                        className="text-xs text-gray-400 hover:text-gray-300"
                      >
                        Change
                      </button>
                    )}
                  </div>

                  {!selectedLocation.address ? (
                    <>
                      {/* Search Bar */}
                      <div className="relative mb-3" ref={searchRef}>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            placeholder="Search location..."
                            className="w-full pl-10 pr-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                            disabled={disabled}
                          />
                          {searching && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                            </div>
                          )}
                        </div>

                        {/* Search Results */}
                        {searchResults.length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                            {searchResults.map((result, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => handleSelectLocation(result)}
                                className="w-full px-3 py-2 text-left hover:bg-zinc-800 transition-colors border-b border-zinc-800 last:border-b-0"
                              >
                                <div className="flex items-start gap-2">
                                  <MapPin className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                                  <span className="text-white textarea-md">{result.display_name}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Location Buttons */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                        <button
                          type="button"
                          onClick={handleGetCurrentLocation}
                          disabled={disabled || gettingLocation}
                          className="px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-blue-400 textarea-md flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                        >
                          {gettingLocation ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Navigation className="w-4 h-4" />
                          )}
                          <span>GPS</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowManualInput(true)}
                          disabled={disabled}
                          className="px-3 py-2 bg-zinc-800/50 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-gray-300 textarea-md flex items-center justify-center gap-2 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Manual</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowMap(!showMap)}
                          disabled={disabled}
                          className="px-3 py-2 bg-zinc-800/50 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-gray-300 textarea-md flex items-center justify-center gap-2 transition-colors"
                        >
                          <Map className="w-4 h-4" />
                          <span>Map</span>
                        </button>
                      </div>

                      {/* GPS Status */}
                      {gettingLocation && (
                        <div className="mb-3 p-3 bg-blue-900/20 border border-blue-800/30 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="relative">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping" />
                                <div className="absolute top-0 w-2 h-2 bg-blue-500 rounded-full" />
                              </div>
                              <span className="text-blue-300 textarea-md">
                                Getting location...
                              </span>
                            </div>
                            {gpsAccuracy && (
                              <span className="text-blue-400 text-xs">
                                ±{gpsAccuracy}m
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Manual Input */}
                      {showManualInput && (
                        <div className="mb-3 p-4 bg-amber-900/20 border border-amber-800/30 rounded-lg space-y-3">
                          <textarea
                            value={manualAddress}
                            onChange={(e) => setManualAddress(e.target.value)}
                            placeholder="Enter address..."
                            rows={2}
                            className="w-full px-3 py-2 bg-zinc-800/50 border border-amber-700/50 rounded text-white placeholder-white-400/50 focus:outline-none focus:border-amber-500 transition-colors"
                          />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={handleManualLocationSubmit}
                              className="flex-1 px-3 py-2 bg-amber-600 hover:bg-amber-700 rounded text-white textarea-md transition-colors"
                            >
                              Use Address
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowManualInput(false)}
                              className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded text-gray-300 textarea-md transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    /* Selected Location */
                    <div className="mb-3 p-4 bg-emerald-900/20 border border-emerald-800/30 rounded-lg">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                        <div className="flex-1">
                          <p className="text-white textarea-md font-medium mb-1">Selected Location</p>
                          <p className="text-gray-300 text-xs">{selectedLocation.address}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Map */}
                  {showMap && !disabled && !selectedLocation.address && (
                    <div className="mt-3 border border-zinc-700 rounded-lg overflow-hidden h-120">
                      <MapContainer
                        center={mapPosition}
                        zoom={15}
                        style={{ height: '100%', width: '100%' }}
                        scrollWheelZoom={true}
                      >
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <MapClickHandler onMapClick={handleMapClick} />
                      </MapContainer>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block textarea-md font-medium text-gray-300 mb-2">
                    Description <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    placeholder="Describe the issue in detail..."
                    rows={5}
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none disabled:opacity-50"
                    maxLength={500}
                    minLength={60}
                    required
                    disabled={disabled}
                    onChange={(e) => setDescLength(e.target.value.length)}
                  />
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>Minimum 60 characters</span>
                    <span>{descLength}/500</span>
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block textarea-md font-medium text-gray-300 mb-2">
                    Photo Evidence <span className="text-rose-500">*</span>
                  </label>
                  
                  {!imagePreview ? (
                    <label className={`block ${disabled ? 'opacity-50' : ''}`}>
                      <div className={`border-2 border-dashed border-zinc-700 rounded-lg p-8 text-center hover:border-emerald-500 hover:bg-zinc-800/30 transition-all ${!disabled ? 'cursor-pointer' : ''}`}>
                        <Upload className="w-8 h-8 text-gray-500 mx-auto mb-3" />
                        <p className="text-white textarea-md font-medium mb-1">Upload Photo</p>
                        <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={disabled}
                      />
                    </label>
                  ) : (
                    <div className="relative rounded-lg overflow-hidden border border-zinc-700">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-100 object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 p-1.5 bg-red-500/90 hover:bg-red-600 rounded text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-4 border-t border-zinc-800">
                  {canSubmit ? (
                    <button
                      type="submit"
                      disabled={uploading || !selectedLocation.address.trim() || !selectedImage}
                      className="w-full py-3 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-lg font-medium text-white hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Submit Report</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => navigate('/dashboard/profile')}
                      className="w-full py-3 bg-linear-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 rounded-lg font-medium text-white hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Crown className="w-5 h-5" />
                      <span>Upgrade to Report More Issues</span>
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Guidelines */}
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-5">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Reporting Tips
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <span className="text-emerald-400 text-xs">1</span>
                  </div>
                  <div>
                    <p className="text-white textarea-md font-medium">Be Specific</p>
                    <p className="text-gray-400 text-xs">Clear titles help faster resolution</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <span className="text-emerald-400 text-xs">2</span>
                  </div>
                  <div>
                    <p className="text-white textarea-md font-medium">Accurate Location</p>
                    <p className="text-gray-400 text-xs">Use GPS for exact pinning</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <span className="text-emerald-400 text-xs">3</span>
                  </div>
                  <div>
                    <p className="text-white textarea-md font-medium">Clear Photos</p>
                    <p className="text-gray-400 text-xs">Show the issue clearly</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <span className="text-emerald-400 text-xs">4</span>
                  </div>
                  <div>
                    <p className="text-white textarea-md font-medium">Detailed Description</p>
                    <p className="text-gray-400 text-xs">Include impact and urgency</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Overview */}
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-5">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <BarChart className="w-4 h-4 text-blue-400" />
                Status Overview
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 textarea-md">Account Type</span>
                  <span className={`textarea-md font-medium ${isPremium ? 'text-yellow-400' : 'text-emerald-400'}`}>
                    {isPremium ? 'Premium' : 'Free'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 textarea-md">Reports Remaining</span>
                  <span className="text-white font-medium">{isPremium ? 'Unlimited' : remainingIssues}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 textarea-md">Character Count</span>
                  <span className="text-white font-medium">{titleLength + descLength}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 textarea-md">Submission Ready</span>
                  <span className={`textarea-md font-medium ${canSubmit ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {canSubmit ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-5">
              <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
              
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleGetCurrentLocation}
                  disabled={disabled || gettingLocation}
                  className="w-full px-3 py-2.5 bg-zinc-800/50 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-white textarea-md flex items-center justify-between transition-colors disabled:opacity-50"
                >
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-blue-400" />
                    <span>Use Current Location</span>
                  </div>
                  <Navigation className="w-4 h-4 text-gray-400" />
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/dashboard/manageissues')}
                  className="w-full px-3 py-2.5 bg-zinc-800/50 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-white textarea-md flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span>View My Reports</span>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
                </button>
              </div>
            </div>

            {/* Warning Box */}
            {!canSubmit && (
              <div className="bg-amber-900/20 border border-amber-800/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5" />
                  <div>
                    <h4 className="text-amber-300 font-medium textarea-md mb-1">Limit Reached</h4>
                    <p className="text-amber-400/80 text-xs">
                      You've used all {FREE_USER_LIMIT} free reports. Upgrade to Premium for unlimited reports.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddIssue;