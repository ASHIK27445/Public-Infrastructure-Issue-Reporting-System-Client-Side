import React from 'react';
import { Zap, Eye, Users, Shield, TrendingUp, Award } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Zap className="w-10 h-10" />,
      title: "Lightning Fast Reporting",
      description: "Submit issues in seconds with our intelligent form. Upload photos, tag locations, and describe problems with ease.",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: <Eye className="w-10 h-10" />,
      title: "Real-Time Visibility",
      description: "Watch your reports come to life with live status updates, timestamps, and progress notifications at every stage.",
      color: "from-teal-500 to-cyan-500"
    },
    {
      icon: <Users className="w-10 h-10" />,
      title: "Community Powered",
      description: "Join an active network of citizens, officials, and staff working together for infrastructure excellence.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Shield className="w-10 h-10" />,
      title: "Verified & Secure",
      description: "Bank-level encryption and multi-layer verification ensure every report is authentic and your data is protected.",
      color: "from-emerald-600 to-teal-600"
    },
    {
      icon: <TrendingUp className="w-10 h-10" />,
      title: "Smart Analytics",
      description: "AI-powered insights help prioritize critical issues and optimize resource allocation for maximum impact.",
      color: "from-cyan-500 to-blue-500"
    },
    {
      icon: <Award className="w-10 h-10" />,
      title: "Premium Priority",
      description: "Upgrade for guaranteed response times, dedicated support, and priority resolution for your urgent issues.",
      color: "from-teal-600 to-green-600"
    }
  ];

  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <title>CommunityFix - Why Choose Us</title>
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, #10b981 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-20">
          <div className="inline-block px-6 py-2 rounded-full bg-linear-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 mb-6">
            <span className="text-emerald-400 font-semibold text-sm uppercase tracking-wider">Why Choose Us</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6">
            Powerful <span className="bg-linear-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Features</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to report, track, and resolve infrastructure issues with unprecedented efficiency.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative bg-linear-to-br from-zinc-900 to-zinc-800 rounded-3xl p-8 border border-zinc-700 hover:border-emerald-500/50 transition-all duration-500 hover:scale-105"
            >
              <div className={`absolute inset-0 bg-linear-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`} />
              
              <div className={`relative w-20 h-20 bg-linear-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                {feature.icon}
              </div>
              
              <h3 className="relative text-2xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">
                {feature.title}
              </h3>
              
              <p className="relative text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;