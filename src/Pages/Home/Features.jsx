import React from 'react';
import { Zap, Eye, Users, Shield, TrendingUp, Award } from 'lucide-react';
import CardSwap, { Card } from './CardSwap';

const features = [
  {
    icon: <Zap className="w-10 h-10" />,
    title: "Lightning Fast Reporting",
    description: "Submit issues in seconds with our intelligent form. Upload photos, tag locations, and describe problems with ease.",
    color: "from-emerald-500 to-teal-500",
    accent: "#10b981"
  },
  {
    icon: <Eye className="w-10 h-10" />,
    title: "Real-Time Visibility",
    description: "Watch your reports come to life with live status updates, timestamps, and progress notifications at every stage.",
    color: "from-teal-500 to-cyan-500",
    accent: "#14b8a6"
  },
  {
    icon: <Users className="w-10 h-10" />,
    title: "Community Powered",
    description: "Join an active network of citizens, officials, and staff working together for infrastructure excellence.",
    color: "from-green-500 to-emerald-500",
    accent: "#22c55e"
  },
  {
    icon: <Shield className="w-10 h-10" />,
    title: "Verified & Secure",
    description: "Bank-level encryption and multi-layer verification ensure every report is authentic and your data is protected.",
    color: "from-emerald-600 to-teal-600",
    accent: "#059669"
  },
  {
    icon: <TrendingUp className="w-10 h-10" />,
    title: "Smart Analytics",
    description: "AI-powered insights help prioritize critical issues and optimize resource allocation for maximum impact.",
    color: "from-cyan-500 to-blue-500",
    accent: "#06b6d4"
  },
  {
    icon: <Award className="w-10 h-10" />,
    title: "Premium Priority",
    description: "Upgrade for guaranteed response times, dedicated support, and priority resolution for your urgent issues.",
    color: "from-teal-600 to-green-600",
    accent: "#0d9488"
  }
];

const Features = () => {
  return (
    <section className="py-16 md:py-24 lg:py-32 px-4 md:px-6 relative overflow-hidden">
      <title>CommunityFix - Why Choose Us</title>

      <div className="max-w-7xl mx-auto relative">
        <div className="flex flex-col lg:flex-row items-center gap-12 md:gap-16 lg:gap-20">

          {/* Left: prose copy */}
          <div className="flex-1 w-full max-w-xl lg:max-w-xl">
            <div className="inline-block px-4 md:px-6 py-2 rounded-full bg-linear-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 mb-4 md:mb-6">
              <span className="text-emerald-400 font-semibold text-sm uppercase tracking-wider">Why Choose Us</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 md:mb-6 leading-tight">
              Powerful <span className="bg-linear-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Features</span>
            </h2>

            <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-4 md:mb-6">
              CommunityFix gives every citizen a direct line to the people responsible for fixing things. No calls, no queues — just a clear path from problem to resolution.
            </p>

            <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-8 md:mb-10">
              Built for real communities, our platform handles everything from issue intake to final sign-off. Reports are tracked transparently, priorities are set intelligently, and progress is visible to everyone involved.
            </p>

            <div className="flex items-center gap-3 sm:gap-4">
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-black text-emerald-400">10k+</p>
                <p className="text-gray-500 text-sm mt-1">Issues Resolved</p>
              </div>
              <div className="w-px h-10 sm:h-12 bg-zinc-700" />
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-black text-emerald-400">48h</p>
                <p className="text-gray-500 text-sm mt-1">Avg. Response Time</p>
              </div>
              <div className="w-px h-10 sm:h-12 bg-zinc-700" />
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-black text-emerald-400">200+</p>
                <p className="text-gray-500 text-sm mt-1">Communities</p>
              </div>
            </div>
          </div>

          {/* Right: CardSwap */}
          <div className="relative pt-5 md:pt-100 w-full max-w-sm sm:max-w-md md:max-w-lg lg:w-120 lg:max-w-none shrink-0">
            {/* Hide CardSwap on small screens, show static card grid */}
            <div className="block lg:hidden">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                {features.slice(0, 4).map((feature, index) => (
                  <div
                    key={index}
                    className="bg-zinc-950 rounded-2xl p-5 md:p-6 border"
                    style={{
                      borderColor: `${feature.accent}40`,
                      boxShadow: `0 0 32px ${feature.accent}20`
                    }}
                  >
                    <div className={`w-12 h-12 md:w-14 md:h-14 bg-linear-to-br ${feature.color} rounded-2xl flex items-center justify-center text-white shadow-lg mb-4 md:mb-5`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-white font-bold text-base md:text-xl mb-1 md:mb-2">{feature.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                    <div className={`mt-4 md:mt-5 h-0.5 w-10 md:w-12 bg-linear-to-r ${feature.color} rounded-full`} />
                  </div>
                ))}
              </div>
            </div>

            {/* CardSwap for larger screens */}
            <div className="hidden lg:block">
              <CardSwap
                width={380}
                height={260}
                cardDistance={55}
                verticalDistance={65}
                delay={3500}
                pauseOnHover={true}
                skewAmount={5}
                easing="elastic"
              >
                {features.map((feature, index) => (
                  <Card
                    key={index}
                    style={{
                      background: 'bg-zinc-950',
                      border: `1px solid ${feature.accent}40`,
                      boxShadow: `0 0 32px ${feature.accent}20`
                    }}
                  >
                    <div className="flex flex-col justify-between h-full p-6 md:p-7">
                      <div className={`w-12 h-12 md:w-14 md:h-14 bg-linear-to-br ${feature.color} rounded-2xl flex items-center justify-center text-white shadow-lg mb-4 md:mb-5`}>
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="text-white font-black text-lg md:text-xl mb-1 md:mb-2">{feature.title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                      </div>
                      <div className={`mt-4 md:mt-5 h-0.5 w-10 md:w-12 bg-linear-to-r ${feature.color} rounded-full`} />
                    </div>
                  </Card>
                ))}
              </CardSwap>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Features;