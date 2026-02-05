import React from 'react';
import { MapPinned, Shield, Target, CheckCircle, ArrowRight } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    { 
      number: "01", 
      title: "Report", 
      description: "Spot an issue? Snap a photo, drop a pin, and submit your report in under 60 seconds.",
      icon: <MapPinned className="w-8 h-8" />
    },
    { 
      number: "02", 
      title: "Review", 
      description: "Our admin team reviews your submission, verifies details, and assigns it to the right department.",
      icon: <Shield className="w-8 h-8" />
    },
    { 
      number: "03", 
      title: "Action", 
      description: "Field staff receive the assignment, verify on-site, and begin the resolution process immediately.",
      icon: <Target className="w-8 h-8" />
    },
    { 
      number: "04", 
      title: "Resolve", 
      description: "Track real-time updates from pending to resolved. Get notified when your issue is fixed and closed.",
      icon: <CheckCircle className="w-8 h-8" />
    }
  ];

  return (
    <section className="py-32 px-6 bg-linear-to-b from-zinc-950 to-zinc-900">
      <title>CommunityFix - How It Works</title>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-block px-6 py-2 rounded-full bg-linear-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 mb-6">
            <span className="text-emerald-400 font-semibold text-sm uppercase tracking-wider">Simple Process</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6">
            How It <span className="bg-linear-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            From report to resolution in four seamless steps. Simple, transparent, and incredibly effective.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              <div className="relative bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl p-8 border border-zinc-700 hover:border-emerald-500/50 transition-all duration-500 h-full">
                
                <div className="absolute -top-6 -left-6 w-16 h-16 bg-linear-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-2xl rotate-12 group-hover:rotate-0 transition-transform duration-500">
                  <span className="text-white font-black text-2xl">{step.number}</span>
                </div>

                <div className="w-16 h-16 bg-linear-to-br from-zinc-700 to-zinc-800 rounded-2xl flex items-center justify-center text-emerald-400 mb-6 mt-8 group-hover:scale-110 transition-transform duration-500">
                  {step.icon}
                </div>

                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">
                  {step.title}
                </h3>
                
                <p className="text-gray-400 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="w-8 h-8 text-emerald-500/50" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;