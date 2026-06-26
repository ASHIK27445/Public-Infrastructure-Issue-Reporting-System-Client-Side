// ResolvedIssues.jsx - সম্পূর্ণ আপডেট
import React, { useEffect, useState } from 'react';
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
  const [galleryConfig, setGalleryConfig] = useState({
    height: 600,
    bend: 3,
    fontSize: 'bold 28px sans-serif',
    scrollSpeed: 2,
    scrollEase: 0.02,
    textSize: 0.25
  });

  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      console.log('Screen width:', width, 'height:', height);
      
      if (width < 480) {
        setGalleryConfig({
          height: Math.min(height * 0.6, 450), // 60% viewport height
          bend: 1.5,
          fontSize: 'bold 20px sans-serif',
          scrollSpeed: 3,
          scrollEase: 0.05,
          textSize: 0.3
        });
      } else if (width < 768) {
        setGalleryConfig({
          height: Math.min(height * 0.6, 500),
          bend: 2,
          fontSize: 'bold 22px sans-serif',
          scrollSpeed: 2.5,
          scrollEase: 0.04,
          textSize: 0.28
        });
      } else if (width < 1024) {
        setGalleryConfig({
          height: 550,
          bend: 2.5,
          fontSize: 'bold 26px sans-serif',
          scrollSpeed: 2,
          scrollEase: 0.03,
          textSize: 0.25
        });
      } else {
        setGalleryConfig({
          height: 600,
          bend: 3,
          fontSize: 'bold 28px sans-serif',
          scrollSpeed: 2,
          scrollEase: 0.02,
          textSize: 0.25
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <section className="py-8 md:py-16 lg:py-32 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-12 lg:mb-20">
          <div className="inline-block px-4 md:px-6 py-2 rounded-full bg-linear-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 mb-4 md:mb-6">
            <span className="text-emerald-400 font-semibold text-xs md:text-sm uppercase tracking-wider">
              Success Stories
            </span>
          </div>
          <h2 className="text-2xl md:text-4xl lg:text-7xl font-black text-white mb-4 md:mb-6">
            Latest <span className="bg-linear-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Resolved</span> Issues
          </h2>
          <p className="text-sm md:text-xl text-gray-400 max-w-2xl mx-auto px-4">
            Real problems, real solutions. See how we're transforming communities one issue at a time.
          </p>
        </div>

        <div 
          style={{ 
            height: `${galleryConfig.height}px`, 
            position: 'relative',
            width: '100%',
            maxWidth: '100%',
            overflow: 'hidden'
          }}
          className="rounded-xl md:rounded-2xl lg:rounded-3xl overflow-hidden"
        >
          <CircularGallery
            items={galleryItems}
            bend={galleryConfig.bend}
            textColor="#34d399"
            borderRadius={0.05}
            scrollEase={galleryConfig.scrollEase}
            scrollSpeed={galleryConfig.scrollSpeed}
            font={galleryConfig.fontSize}
            textSize={galleryConfig.textSize}
          />
        </div>

        <div className="text-center mt-8 md:mt-16">
          <Link
            to='/allissues'
            className="group inline-flex items-center space-x-2 md:space-x-3 px-6 md:px-10 py-3 md:py-5 bg-linear-to-r from-emerald-500 to-teal-500 rounded-xl md:rounded-2xl font-bold text-sm md:text-lg text-white shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105"
          >
            <span>Explore All Issues</span>
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ResolvedIssues;