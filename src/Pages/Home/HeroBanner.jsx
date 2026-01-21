import React, { useState, useEffect, use } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { AuthContext } from '../AuthProvider/AuthContext';
import { toast } from 'react-toastify';

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const {role} = use(AuthContext)
  const navigate = useNavigate()
  const bannerSlides = [
    {
      title: "Transform Your City",
      subtitle: "Report infrastructure issues instantly. Track progress in real-time. Build better communities together.",
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&h=1080&fit=crop",
      accent: "from-emerald-500 to-teal-500"
    },
    {
      title: "Your Voice, Our Action",
      subtitle: "Join thousands of active citizens making real change happen. Every report matters, every solution counts.",
      image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1920&h=1080&fit=crop",
      accent: "from-green-500 to-emerald-500"
    },
    {
      title: "Transparent & Efficient",
      subtitle: "From submission to resolution, track every step with complete transparency and guaranteed accountability.",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=1080&fit=crop",
      accent: "from-teal-500 to-cyan-500"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleStaffReportIsse = () => {
    if(role === 'staff'){
      toast.error("staff can't report.")
      return;
    }else{
      navigate('dashboard/dashboard/addissues')
    }
  }
  return (
    //relative h-screen overflow-hidden
    <section className="relative min-h-[120vh] overflow-hidden"> 
      {bannerSlides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ${
            index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        >
          <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/50 to-zinc-950 z-10" />
          <img 
            src={slide.image} 
            alt={slide.title} 
            className="w-full h-full object-cover"
          />
          
          <div className="absolute inset-0 z-20 flex items-center">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
              <div className="max-w-4xl">
                <div className={`inline-block px-6 py-2 rounded-full bg-linear-to-r ${slide.accent} mb-6 text-white font-semibold text-sm`}>
                  🏙️ Building Better Communities
                </div>
                
                <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-tight">
                  {slide.title.split(' ').map((word, i) => (
                    <span key={i}>
                      {i === slide.title.split(' ').length - 1 ? (
                        <span className={`bg-linear-to-r ${slide.accent} bg-clip-text text-transparent`}>
                          {word}
                        </span>
                      ) : (
                        <span>{word} </span>
                      )}
                    </span>
                  ))}
                </h1>
                
                <p className="debug-test text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed max-w-3xl">
                  {slide.subtitle}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link onClick={handleStaffReportIsse} className={`group px-8 py-5 bg-linear-to-r ${slide.accent} rounded-2xl font-bold text-lg text-white shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-3`}>
                    <span>Report an Issue</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  
                  <Link to="/allissues" className="px-8 py-5 bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl font-bold text-lg text-white hover:bg-white/20 transition-all duration-300">
                    View All Issues
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-30 flex space-x-4">
        {bannerSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-500 rounded-full ${
              index === currentSlide 
                ? 'w-16 h-2 bg-linear-to-r from-emerald-500 to-teal-500' 
                : 'w-2 h-2 bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>

      <div className="absolute bottom-12 right-12 z-30 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-linear-to-b from-emerald-500 to-transparent rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;