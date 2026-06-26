import React from 'react';
import { MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

const ResolvedIssuesold = () => {
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
    <section className="py-28 px-6">
    <div className="max-w-7xl mx-auto">

        <div className="text-center mb-16">
        <span className="inline-block px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold uppercase tracking-widest">
            Community Gallery
        </span>

        <h2 className="mt-6 text-5xl md:text-6xl font-black text-white">
            Before & After
        </h2>

        <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">
            Every resolved issue represents a cleaner, safer and stronger community.
        </p>
        </div>

        <div
        className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
        >
        {resolvedIssues.map((issue) => (
            <div
            key={issue.id}
            className="group relative overflow-hidden rounded-3xl break-inside-avoid bg-zinc-900"
            >
            <img
                src={issue.image}
                alt={issue.title}
                className="w-full object-cover transition duration-700 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-linear-to-t from-black via-black/10 to-transparent opacity-80" />

            <div className="absolute bottom-0 left-0 right-0 p-6">

                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white">
                <CheckCircle className="w-3 h-3"/>
                Resolved
                </span>

                <h3 className="mt-3 text-xl font-bold text-amber-100">
                {issue.title}
                </h3>

                <p className="mt-2 flex items-center gap-2 text-sm text-zinc-300">
                <MapPin className="w-4 h-4 text-emerald-400"/>
                {issue.location}
                </p>

                <p className="mt-2 text-xs text-zinc-400">
                {issue.resolvedDate}
                </p>

            </div>
            </div>
        ))}
        </div>

    </div>
    </section>
  );
};

export default ResolvedIssuesold;