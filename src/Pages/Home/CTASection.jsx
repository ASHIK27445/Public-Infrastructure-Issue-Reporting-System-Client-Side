import React, { use } from 'react';
import { ArrowRight, Star, CheckCircle } from 'lucide-react';
import { AuthContext } from '../AuthProvider/AuthContext';
import { NavLink, useNavigate } from 'react-router';



const CTASection = () => {
  const {role} = use(AuthContext)
  const navigate = useNavigate()
  const handleStaffReportIsse = () => {
        if(role === 'staff'){
          toast.error("staff can't report.")
          return;
        }else{
          navigate('dashboard/dashboard/addissues')
        }
  }
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-r from-emerald-600/20 to-teal-600/20" />
      <div className="absolute inset-0 backdrop-blur-3xl" />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="mb-8">
          <Star className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
        </div>
        
        <h2 className="text-5xl md:text-7xl font-black text-white mb-6">
          Ready to Make a <span className="bg-linear-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Difference?</span>
        </h2>
        
        <p className="text-xl text-gray-300 mb-12 leading-relaxed">
          Join over 16,000 active citizens working together to build better, safer, and more efficient communities.
        </p>
        
        <div  className="flex flex-col sm:flex-row gap-6 justify-center">
          <button onClick={handleStaffReportIsse} className="group px-10 py-5 bg-linear-to-r from-emerald-500 to-teal-500 rounded-2xl font-bold text-lg text-white shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-3">
            <span>Start Reporting Now</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <NavLink to='community-guidelines' className="px-10 py-5 bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl font-bold text-lg text-white hover:bg-white/20 transition-all duration-300">
            Learn More
          </NavLink>
        </div>

        <div className="mt-12 flex items-center justify-center space-x-8 text-gray-400">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            <span>No Credit Card</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            <span>Free Forever</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            <span>24/7 Support</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;