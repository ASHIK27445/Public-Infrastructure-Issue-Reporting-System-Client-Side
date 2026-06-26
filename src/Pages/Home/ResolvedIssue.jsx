import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import CircularGallery from './CircularGallery';

const galleryItems = [
  {
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop",
    text: "Broken Streetlight"
  },
  {
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop",
    text: "Pothole on Main St"
  },
  {
    image: "https://images.unsplash.com/photo-1584467541268-b040f83be3fd?w=800&h=600&fit=crop",
    text: "Water Leakage"
  },
  {
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&h=600&fit=crop",
    text: "Garbage Overflow"
  },
  {
    image: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=800&h=600&fit=crop",
    text: "Damaged Footpath"
  },
  {
    image: "https://images.unsplash.com/photo-1502977249166-824b3a8a4d6d?w=800&h=600&fit=crop",
    text: "Traffic Signal Fixed"
  }
];

const ResolvedIssues = () => {
  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-block px-6 py-2 rounded-full bg-linear-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 mb-6">
            <span className="text-emerald-400 font-semibold text-sm uppercase tracking-wider">Success Stories</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6">
            Latest <span className="bg-linear-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Resolved</span> Issues
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Real problems, real solutions. See how we're transforming communities one issue at a time.
          </p>
        </div>

        <div style={{ height: '600px', position: 'relative' }}>
          <CircularGallery
            items={galleryItems}
            bend={3}
            textColor="#34d399"
            borderRadius={0.05}
            scrollEase={0.02}
            scrollSpeed={2}
            font="bold 28px sans-serif"
          />
        </div>

        <div className="text-center mt-16">
          <Link
            to='/allissues'
            className="group inline-flex items-center space-x-3 px-10 py-5 bg-linear-to-r from-emerald-500 to-teal-500 rounded-2xl font-bold text-lg text-white shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105"
          >
            <span>Explore All Issues</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ResolvedIssues;