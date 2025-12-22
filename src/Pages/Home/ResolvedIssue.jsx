import React from 'react';
import { MapPin, CheckCircle, ArrowRight } from 'lucide-react';

const ResolvedIssues = () => {
  const resolvedIssues = [
    {
      id: 1,
      title: "Broken Streetlight on Park Avenue",
      description: "Multiple streetlights not working causing safety concerns in residential area",
      location: "Park Avenue, Block A",
      status: "Resolved",
      reportedBy: "John Doe",
      resolvedDate: "2024-12-18",
      priority: "High",
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&h=400&fit=crop"
    },
    {
      id: 2,
      title: "Large Pothole on Main Street",
      description: "Deep pothole causing vehicle damage and creating traffic hazards",
      location: "Main Street, Junction 5",
      status: "Resolved",
      reportedBy: "Emily Chen",
      resolvedDate: "2024-12-17",
      priority: "Critical",
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop"
    },
    {
      id: 3,
      title: "Water Leakage in Residential Area",
      description: "Continuous water leakage from underground pipe affecting multiple homes",
      location: "Green Valley, Sector 12",
      status: "Resolved",
      reportedBy: "Michael Brown",
      resolvedDate: "2024-12-16",
      priority: "High",
      image: "https://images.unsplash.com/photo-1584467541268-b040f83be3fd?w=600&h=400&fit=crop"
    },
    {
      id: 4,
      title: "Garbage Overflow Near Market",
      description: "Overflowing bins causing health and sanitation issues in commercial area",
      location: "Central Market, Zone 3",
      status: "Resolved",
      reportedBy: "Lisa Anderson",
      resolvedDate: "2024-12-15",
      priority: "Medium",
      image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&h=400&fit=crop"
    },
    {
      id: 5,
      title: "Damaged Footpath Construction",
      description: "Broken concrete tiles making footpath unusable for pedestrians",
      location: "Oak Street, Block C",
      status: "Resolved",
      reportedBy: "David Wilson",
      resolvedDate: "2024-12-14",
      priority: "Medium",
      image: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=600&h=400&fit=crop"
    },
    {
      id: 6,
      title: "Non-functional Traffic Signal",
      description: "Traffic light malfunction at major intersection causing safety concerns",
      location: "Highway Junction, Exit 7",
      status: "Resolved",
      reportedBy: "Anna Martinez",
      resolvedDate: "2024-12-13",
      priority: "Critical",
      image: "https://images.unsplash.com/photo-1502977249166-824b3a8a4d6d?w=600&h=400&fit=crop"
    }
  ];

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Critical': return 'from-red-500 to-orange-500';
      case 'High': return 'from-orange-500 to-yellow-500';
      case 'Medium': return 'from-blue-500 to-cyan-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 mb-6">
            <span className="text-emerald-400 font-semibold text-sm uppercase tracking-wider">Success Stories</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6">
            Latest <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Resolved</span> Issues
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Real problems, real solutions. See how we're transforming communities one issue at a time.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resolvedIssues.map((issue, index) => (
            <div 
              key={issue.id}
              className="group relative bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-3xl overflow-hidden border border-zinc-700 hover:border-emerald-500/50 transition-all duration-500 hover:scale-105"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={issue.image} 
                  alt={issue.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
                
                <div className="absolute top-4 right-4">
                  <div className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center space-x-2 shadow-lg">
                    <CheckCircle className="w-4 h-4 text-white" />
                    <span className="text-white font-bold text-xs">{issue.status}</span>
                  </div>
                </div>

                <div className="absolute top-4 left-4">
                  <div className={`px-4 py-2 bg-gradient-to-r ${getPriorityColor(issue.priority)} rounded-full shadow-lg`}>
                    <span className="text-white font-bold text-xs">{issue.priority}</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-3 line-clamp-2 group-hover:text-emerald-400 transition-colors">
                  {issue.title}
                </h3>
                
                <p className="text-gray-400 mb-4 line-clamp-2 text-sm leading-relaxed">
                  {issue.description}
                </p>
                
                <div className="flex items-center text-sm text-gray-500 mb-4 space-x-2">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  <span className="line-clamp-1">{issue.location}</span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-zinc-700">
                  <div className="text-xs text-gray-500">
                    <span className="text-emerald-500 font-semibold">{issue.resolvedDate}</span>
                  </div>
                  <button className="group/btn flex items-center space-x-2 text-emerald-500 font-bold text-sm hover:text-emerald-400 transition-colors">
                    <span>View Details</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/20 to-transparent" />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <button className="group px-10 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl font-bold text-lg text-white shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-3 mx-auto">
            <span>Explore All Issues</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ResolvedIssues;