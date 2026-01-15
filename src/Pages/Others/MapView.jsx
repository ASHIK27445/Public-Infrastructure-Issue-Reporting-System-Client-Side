import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { 
  AlertTriangle, 
  MapPin, 
  Filter, 
  Search, 
  Layers, 
  ZoomIn, 
  ZoomOut,
  Navigation,
  Eye,
  Info
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapView = () => {
  const mapRef = useRef(null);
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    category: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [mapCenter] = useState([23.8103, 90.4125]); // Dhaka, Bangladesh
  const [zoomLevel, setZoomLevel] = useState(12);
  const [viewMode, setViewMode] = useState('normal'); // normal, heatmap, clusters

  // Sample data - replace with API call
  const sampleIssues = [
    {
      id: 1,
      title: 'Broken Streetlight',
      description: 'Multiple streetlights not working in residential area',
      location: { lat: 23.811, lng: 90.415 },
      status: 'pending',
      priority: 'high',
      category: 'electricity',
      reportedBy: 'John Doe',
      date: '2024-12-18',
      upvotes: 12,
      image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&h=400&fit=crop'
    },
    {
      id: 2,
      title: 'Large Pothole',
      description: 'Deep pothole causing vehicle damage',
      location: { lat: 23.808, lng: 90.410 },
      status: 'in-progress',
      priority: 'critical',
      category: 'road',
      reportedBy: 'Emily Chen',
      date: '2024-12-17',
      upvotes: 24,
      image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop'
    },
    {
      id: 3,
      title: 'Water Leakage',
      description: 'Continuous water leakage affecting homes',
      location: { lat: 23.815, lng: 90.420 },
      status: 'resolved',
      priority: 'medium',
      category: 'water',
      reportedBy: 'Michael Brown',
      date: '2024-12-16',
      upvotes: 8,
      image: 'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?w=600&h=400&fit=crop'
    },
    {
      id: 4,
      title: 'Garbage Overflow',
      description: 'Overflowing bins causing health issues',
      location: { lat: 23.805, lng: 90.405 },
      status: 'pending',
      priority: 'medium',
      category: 'sanitation',
      reportedBy: 'Lisa Anderson',
      date: '2024-12-15',
      upvotes: 15,
      image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&h=400&fit=crop'
    },
    {
      id: 5,
      title: 'Damaged Footpath',
      description: 'Broken concrete tiles making footpath unusable',
      location: { lat: 23.812, lng: 90.418 },
      status: 'in-progress',
      priority: 'low',
      category: 'infrastructure',
      reportedBy: 'David Wilson',
      date: '2024-12-14',
      upvotes: 6,
      image: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=600&h=400&fit=crop'
    },
    {
      id: 6,
      title: 'Non-functional Traffic Signal',
      description: 'Traffic light malfunction at major intersection',
      location: { lat: 23.807, lng: 90.413 },
      status: 'pending',
      priority: 'critical',
      category: 'traffic',
      reportedBy: 'Anna Martinez',
      date: '2024-12-13',
      upvotes: 32,
      image: 'https://images.unsplash.com/photo-1502977249166-824b3a8a4d6d?w=600&h=400&fit=crop'
    },
    {
      id: 7,
      title: 'Broken Park Bench',
      description: 'Public park bench damaged and unsafe',
      location: { lat: 23.814, lng: 90.408 },
      status: 'resolved',
      priority: 'low',
      category: 'public-space',
      reportedBy: 'Robert Johnson',
      date: '2024-12-12',
      upvotes: 4,
      image: 'https://images.unsplash.com/photo-1519861531473-920034658307?w=600&h=400&fit=crop'
    },
    {
      id: 8,
      title: 'Blocked Drain',
      description: 'Drain blockage causing waterlogging',
      location: { lat: 23.809, lng: 90.422 },
      status: 'in-progress',
      priority: 'medium',
      category: 'drainage',
      reportedBy: 'Sarah Williams',
      date: '2024-12-11',
      upvotes: 11,
      image: 'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?w=600&h=400&fit=crop'
    }
  ];

  useEffect(() => {
    // In real app, fetch from API
    setIssues(sampleIssues);
    setFilteredIssues(sampleIssues);
  }, []);

  // Filter and search issues
  useEffect(() => {
    let result = [...issues];
    
    // Apply search
    if (searchTerm) {
      result = result.filter(issue => 
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply filters
    if (filters.status !== 'all') {
      result = result.filter(issue => issue.status === filters.status);
    }
    
    if (filters.priority !== 'all') {
      result = result.filter(issue => issue.priority === filters.priority);
    }
    
    if (filters.category !== 'all') {
      result = result.filter(issue => issue.category === filters.category);
    }
    
    setFilteredIssues(result);
  }, [searchTerm, filters, issues]);

  // Custom markers with different colors based on priority
  const getMarkerIcon = (priority) => {
    const iconSize = [32, 32];
    const iconAnchor = [16, 32];
    
    const priorityColors = {
      critical: '#ef4444', // red
      high: '#f97316', // orange
      medium: '#eab308', // yellow
      low: '#3b82f6' // blue
    };
    
    const color = priorityColors[priority] || '#6b7280'; // default gray
    
    return L.divIcon({
      html: `
        <div class="relative">
          <div class="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center" 
               style="background-color: ${color};">
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div class="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center border border-gray-300">
            <div class="w-2 h-2 rounded-full" style="background-color: ${color};"></div>
          </div>
        </div>
      `,
      iconSize: iconSize,
      iconAnchor: iconAnchor,
      className: 'custom-marker'
    });
  };

  // Status and priority badges
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-500/20 text-yellow-400', text: 'Pending' },
      'in-progress': { color: 'bg-blue-500/20 text-blue-400', text: 'In Progress' },
      resolved: { color: 'bg-emerald-500/20 text-emerald-400', text: 'Resolved' },
      closed: { color: 'bg-gray-500/20 text-gray-400', text: 'Closed' }
    };
    return statusConfig[status] || { color: 'bg-gray-500/20 text-gray-400', text: 'Unknown' };
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      critical: { color: 'bg-red-500/20 text-red-400', text: 'Critical' },
      high: { color: 'bg-orange-500/20 text-orange-400', text: 'High' },
      medium: { color: 'bg-yellow-500/20 text-yellow-400', text: 'Medium' },
      low: { color: 'bg-blue-500/20 text-blue-400', text: 'Low' }
    };
    return priorityConfig[priority] || { color: 'bg-gray-500/20 text-gray-400', text: 'Normal' };
  };

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.setZoom(mapRef.current.getZoom() + 1);
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.setZoom(mapRef.current.getZoom() - 1);
    }
  };

  const handleResetView = () => {
    if (mapRef.current) {
      mapRef.current.setView(mapCenter, zoomLevel);
    }
  };

  const handleLocateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (mapRef.current) {
            mapRef.current.setView([latitude, longitude], 15);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-950 to-zinc-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                Infrastructure <span className="bg-linear-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Map View</span>
              </h1>
              <p className="text-gray-400">Track and visualize public infrastructure issues in your city</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-2">
                <Search className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search issues..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent text-white placeholder-gray-500 focus:outline-none w-40 md:w-56"
                />
              </div>
              
              <div className="relative group">
                <button className="p-3 bg-zinc-800 border border-zinc-700 rounded-2xl text-gray-300 hover:text-white hover:bg-zinc-700 transition-colors">
                  <Filter className="w-5 h-5" />
                </button>
                
                {/* Filter Dropdown */}
                <div className="absolute right-0 top-full mt-2 w-64 bg-zinc-800/95 backdrop-blur-xl rounded-2xl border border-zinc-700 shadow-2xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <h3 className="text-white font-bold mb-3">Filter Issues</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Status</label>
                      <select
                        value={filters.status}
                        onChange={(e) => setFilters({...filters, status: e.target.value})}
                        className="w-full bg-zinc-700 border border-zinc-600 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Priority</label>
                      <select
                        value={filters.priority}
                        onChange={(e) => setFilters({...filters, priority: e.target.value})}
                        className="w-full bg-zinc-700 border border-zinc-600 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                      >
                        <option value="all">All Priority</option>
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Category</label>
                      <select
                        value={filters.category}
                        onChange={(e) => setFilters({...filters, category: e.target.value})}
                        className="w-full bg-zinc-700 border border-zinc-600 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                      >
                        <option value="all">All Categories</option>
                        <option value="road">Road</option>
                        <option value="electricity">Electricity</option>
                        <option value="water">Water</option>
                        <option value="sanitation">Sanitation</option>
                        <option value="traffic">Traffic</option>
                        <option value="public-space">Public Space</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Map */}
          <div className="lg:col-span-2">
            <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 overflow-hidden h-[600px] relative">
              {/* Map Controls */}
              <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
                <button
                  onClick={handleZoomIn}
                  className="p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white hover:bg-zinc-700 transition-colors shadow-lg"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white hover:bg-zinc-700 transition-colors shadow-lg"
                >
                  <ZoomOut className="w-5 h-5" />
                </button>
                <button
                  onClick={handleResetView}
                  className="p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white hover:bg-zinc-700 transition-colors shadow-lg"
                >
                  <Navigation className="w-5 h-5" />
                </button>
                <button
                  onClick={handleLocateUser}
                  className="p-3 bg-emerald-600 border border-emerald-500 rounded-xl text-white hover:bg-emerald-700 transition-colors shadow-lg"
                >
                  <MapPin className="w-5 h-5" />
                </button>
              </div>

              {/* Map Legend */}
              <div className="absolute bottom-4 left-4 z-10 bg-zinc-800/95 backdrop-blur-md rounded-2xl border border-zinc-700 p-4 shadow-lg">
                <h4 className="text-white font-bold mb-2 text-sm">Legend</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-gray-300 text-xs">Critical</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span className="text-gray-300 text-xs">High</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-gray-300 text-xs">Medium</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-gray-300 text-xs">Low</span>
                  </div>
                </div>
              </div>

              {/* Map Container */}
              <MapContainer
                center={mapCenter}
                zoom={zoomLevel}
                className="h-full w-full z-0"
                whenCreated={mapInstance => { mapRef.current = mapInstance; }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                {/* Markers for each issue */}
                {filteredIssues.map((issue) => (
                  <Marker
                    key={issue.id}
                    position={[issue.location.lat, issue.location.lng]}
                    icon={getMarkerIcon(issue.priority)}
                    eventHandlers={{
                      click: () => setSelectedIssue(issue),
                    }}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-bold text-gray-900 mb-1">{issue.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">{issue.description}</p>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`px-2 py-1 rounded text-xs ${getStatusBadge(issue.status).color}`}>
                            {getStatusBadge(issue.status).text}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${getPriorityBadge(issue.priority).color}`}>
                            {getPriorityBadge(issue.priority).text}
                          </span>
                        </div>
                        <button
                          onClick={() => setSelectedIssue(issue)}
                          className="w-full mt-2 px-3 py-1 bg-emerald-500 text-white text-xs rounded hover:bg-emerald-600 transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

          {/* Right Column - Issue List */}
          <div className="lg:col-span-1">
            <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 overflow-hidden h-[600px] flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-zinc-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">
                    Issues ({filteredIssues.length})
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400 text-sm">View:</span>
                    <select
                      value={viewMode}
                      onChange={(e) => setViewMode(e.target.value)}
                      className="bg-zinc-700 border border-zinc-600 rounded-xl px-3 py-1 text-white text-sm focus:outline-none focus:border-emerald-500"
                    >
                      <option value="normal">List</option>
                      <option value="compact">Compact</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Issue List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {filteredIssues.length === 0 ? (
                  <div className="text-center py-12">
                    <AlertTriangle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No issues found with current filters</p>
                  </div>
                ) : (
                  filteredIssues.map((issue) => (
                    <div
                      key={issue.id}
                      className={`bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-4 border border-zinc-700 hover:border-emerald-500/50 transition-all duration-300 cursor-pointer ${
                        selectedIssue?.id === issue.id ? 'border-emerald-500 bg-emerald-500/10' : ''
                      }`}
                      onClick={() => setSelectedIssue(issue)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-white text-sm line-clamp-1">{issue.title}</h4>
                        <span className={`px-2 py-1 rounded text-xs ${getPriorityBadge(issue.priority).color}`}>
                          {getPriorityBadge(issue.priority).text}
                        </span>
                      </div>
                      
                      <p className="text-gray-400 text-xs mb-3 line-clamp-2">{issue.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded text-xs ${getStatusBadge(issue.status).color}`}>
                            {getStatusBadge(issue.status).text}
                          </span>
                          <div className="flex items-center text-gray-500 text-xs">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span>{(issue.location.lat).toFixed(4)}, {(issue.location.lng).toFixed(4)}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-gray-400 text-xs">
                          <Eye className="w-3 h-3 mr-1" />
                          <span>{issue.upvotes}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Selected Issue Details Panel */}
        {selectedIssue && (
          <div className="mt-8 bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-white">{selectedIssue.title}</h3>
                <button
                  onClick={() => setSelectedIssue(null)}
                  className="p-2 rounded-xl bg-zinc-700 text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                {/* Left Column - Details */}
                <div className="md:col-span-2">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-zinc-800/50 rounded-2xl p-4 border border-zinc-700">
                      <p className="text-gray-400 text-sm mb-1">Status</p>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(selectedIssue.status).color}`}>
                        {getStatusBadge(selectedIssue.status).text}
                      </span>
                    </div>
                    
                    <div className="bg-zinc-800/50 rounded-2xl p-4 border border-zinc-700">
                      <p className="text-gray-400 text-sm mb-1">Priority</p>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityBadge(selectedIssue.priority).color}`}>
                        {getPriorityBadge(selectedIssue.priority).text}
                      </span>
                    </div>
                    
                    <div className="bg-zinc-800/50 rounded-2xl p-4 border border-zinc-700">
                      <p className="text-gray-400 text-sm mb-1">Upvotes</p>
                      <p className="text-white font-bold text-xl">{selectedIssue.upvotes}</p>
                    </div>
                    
                    <div className="bg-zinc-800/50 rounded-2xl p-4 border border-zinc-700">
                      <p className="text-gray-400 text-sm mb-1">Reported By</p>
                      <p className="text-white font-medium">{selectedIssue.reportedBy}</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-white font-bold mb-2">Description</h4>
                    <p className="text-gray-300">{selectedIssue.description}</p>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-white font-bold mb-2">Location Details</h4>
                    <div className="flex items-center text-gray-300">
                      <MapPin className="w-5 h-5 mr-2 text-emerald-500" />
                      <span>Latitude: {selectedIssue.location.lat.toFixed(6)}, Longitude: {selectedIssue.location.lng.toFixed(6)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Right Column - Image and Actions */}
                <div className="md:col-span-1">
                  <div className="mb-6">
                    <div className="rounded-2xl overflow-hidden border border-zinc-700 mb-4">
                      <img 
                        src={selectedIssue.image} 
                        alt={selectedIssue.title}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{selectedIssue.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Info className="w-4 h-4 mr-2" />
                        <span>ID: #{selectedIssue.id}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <button className="w-full px-4 py-3 bg-emerald-600 rounded-2xl text-white font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2">
                      <Eye className="w-5 h-5" />
                      <span>View Full Details</span>
                    </button>
                    
                    <button className="w-full px-4 py-3 bg-zinc-700 rounded-2xl text-white font-medium hover:bg-zinc-600 transition-colors">
                      Upvote Issue
                    </button>
                    
                    <button className="w-full px-4 py-3 bg-blue-600/20 border border-blue-500/30 rounded-2xl text-blue-400 font-medium hover:bg-blue-600/30 transition-colors">
                      Share Location
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapView;