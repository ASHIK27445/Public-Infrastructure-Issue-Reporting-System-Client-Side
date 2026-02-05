import React, { useState } from 'react';
import { 
  Zap, 
  Eye, 
  Users, 
  Shield, 
  TrendingUp, 
  Award,
  MapPin,
  Bell,
  Clock,
  FileText,
  BarChart,
  Lock,
  Smartphone,
  Globe,
  Target,
  Star,
  CheckCircle,
  Cloud,
  MessageSquare,
  Heart,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const Features = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Features', count: 12 },
    { id: 'reporting', name: 'Reporting', count: 4 },
    { id: 'tracking', name: 'Tracking', count: 3 },
    { id: 'community', name: 'Community', count: 3 },
    { id: 'security', name: 'Security', count: 2 }
  ];

  const features = [
    {
      id: 1,
      title: 'Lightning Fast Reporting',
      description: 'Submit issues in under 60 seconds with our intelligent form. Upload photos, tag locations, and describe problems with ease.',
      icon: <Zap className="w-10 h-10" />,
      category: 'reporting',
      color: 'from-yellow-500 to-amber-500',
      highlights: ['60-second submission', 'Photo upload', 'GPS tagging', 'Smart categorization']
    },
    {
      id: 2,
      title: 'Real-Time Tracking',
      description: 'Watch your reports come to life with live status updates, timestamps, and progress notifications at every stage.',
      icon: <Eye className="w-10 h-10" />,
      category: 'tracking',
      color: 'from-blue-500 to-cyan-500',
      highlights: ['Live updates', 'Progress photos', 'ETA estimates', 'Status history']
    },
    {
      id: 3,
      title: 'Community Powered',
      description: 'Join an active network of citizens, officials, and staff working together for infrastructure excellence.',
      icon: <Users className="w-10 h-10" />,
      category: 'community',
      color: 'from-purple-500 to-pink-500',
      highlights: ['16K+ citizens', 'Upvote system', 'Collaborative solving', 'Community score']
    },
    {
      id: 4,
      title: 'Bank-Level Security',
      description: '256-bit encryption and multi-layer verification ensure every report is authentic and your data is protected.',
      icon: <Shield className="w-10 h-10" />,
      category: 'security',
      color: 'from-emerald-500 to-teal-500',
      highlights: ['256-bit SSL', '2FA available', 'GDPR compliant', 'Privacy controls']
    },
    {
      id: 5,
      title: 'Smart Analytics',
      description: 'AI-powered insights help prioritize critical issues and optimize resource allocation for maximum impact.',
      icon: <TrendingUp className="w-10 h-10" />,
      category: 'tracking',
      color: 'from-indigo-500 to-purple-500',
      highlights: ['AI prioritization', 'Heat maps', 'Trend analysis', 'Predictive alerts']
    },
    {
      id: 6,
      title: 'Premium Priority',
      description: 'Upgrade for guaranteed response times, dedicated support, and priority resolution for urgent community issues.',
      icon: <Award className="w-10 h-10" />,
      category: 'reporting',
      color: 'from-amber-500 to-orange-500',
      highlights: ['Guaranteed response', 'Priority handling', 'Dedicated support', 'Unlimited reports']
    },
    {
      id: 7,
      title: 'Advanced Mapping',
      description: 'Interactive maps with heat layers, cluster views, and real-time issue density visualization.',
      icon: <MapPin className="w-10 h-10" />,
      category: 'tracking',
      color: 'from-red-500 to-pink-500',
      highlights: ['Heat maps', 'Cluster views', '3D visualization', 'Offline maps']
    },
    {
      id: 8,
      title: 'Smart Notifications',
      description: 'Customizable alerts for status changes, nearby issues, and community activity that matters to you.',
      icon: <Bell className="w-10 h-10" />,
      category: 'community',
      color: 'from-green-500 to-emerald-500',
      highlights: ['Custom alerts', 'Push notifications', 'Email digests', 'SMS updates']
    },
    {
      id: 9,
      title: 'Rapid Response',
      description: 'Average issue response time of 18 hours, with critical issues addressed within 48 hours.',
      icon: <Clock className="w-10 h-10" />,
      category: 'reporting',
      color: 'from-cyan-500 to-blue-500',
      highlights: ['18hr avg response', '48hr critical', '24/7 monitoring', 'Escalation system']
    },
    {
      id: 10,
      title: 'Detailed Reporting',
      description: 'Generate comprehensive reports with analytics, timelines, and resolution documentation.',
      icon: <FileText className="w-10 h-10" />,
      category: 'tracking',
      color: 'from-slate-500 to-gray-500',
      highlights: ['PDF exports', 'Timeline views', 'Performance metrics', 'Shareable reports']
    },
    {
      id: 11,
      title: 'Multi-Platform Access',
      description: 'Seamless experience across web, mobile apps (iOS/Android), and progressive web app.',
      icon: <Smartphone className="w-10 h-10" />,
      category: 'all',
      color: 'from-violet-500 to-purple-500',
      highlights: ['iOS app', 'Android app', 'PWA', 'Desktop optimized']
    },
    {
      id: 12,
      title: 'Global Infrastructure',
      description: 'Scalable cloud infrastructure ensuring 99.9% uptime and handling millions of reports globally.',
      icon: <Globe className="w-10 h-10" />,
      category: 'security',
      color: 'from-blue-600 to-indigo-600',
      highlights: ['99.9% uptime', 'Global CDN', 'Auto-scaling', 'Disaster recovery']
    }
  ];

  const stats = [
    { value: '60s', label: 'Average Report Time', icon: <Zap className="w-6 h-6" /> },
    { value: '98.5%', label: 'Resolution Rate', icon: <CheckCircle className="w-6 h-6" /> },
    { value: '18hrs', label: 'Avg. Response Time', icon: <Clock className="w-6 h-6" /> },
    { value: '16K+', label: 'Active Community', icon: <Users className="w-6 h-6" /> }
  ];

  const filteredFeatures = activeCategory === 'all' 
    ? features 
    : features.filter(feature => feature.category === activeCategory || feature.category === 'all');

  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-950 to-zinc-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-linear-to-r from-purple-900/20 via-pink-900/20 to-rose-900/20" />
          <div className="absolute inset-0 bg-[radial-linear(circle_at_30%_20%,rgba(168,85,247,0.15),transparent_50%)]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-2 bg-linear-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full mb-6">
              <Sparkles className="w-5 h-5 text-purple-400 mr-2" />
              <span className="text-purple-400 font-semibold text-sm uppercase tracking-wider">
                Powerful Features
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
              Everything You Need for <span className="bg-linear-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Community Impact</span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
              From lightning-fast reporting to AI-powered analytics – discover the features that make CommunityFix the most effective platform for community improvement.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center space-x-3 px-4 py-3 bg-white/5 backdrop-blur-sm rounded-2xl">
                  <div className="text-purple-400">{stat.icon}</div>
                  <div>
                    <div className="text-2xl font-black text-white">{stat.value}</div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="border-t border-zinc-800 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-5 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                  activeCategory === category.id
                    ? 'bg-linear-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-zinc-800 text-gray-400 hover:text-white hover:bg-zinc-700'
                }`}
              >
                <span>{category.name}</span>
                <span className={`px-2 py-1 text-xs rounded ${
                  activeCategory === category.id
                    ? 'bg-white/20'
                    : 'bg-zinc-700 text-gray-500'
                }`}>
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFeatures.map((feature) => (
              <div 
                key={feature.id} 
                className="group relative bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl p-8 border border-zinc-700 hover:border-purple-500/50 transition-all duration-500 hover:scale-105"
              >
                <div className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="px-3 py-1 bg-linear-to-r from-purple-500 to-pink-500 rounded-full text-white text-xs font-bold shadow-lg">
                    {feature.category.charAt(0).toUpperCase() + feature.category.slice(1)}
                  </div>
                </div>
                
                <div className={`relative w-20 h-20 bg-linear-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  {feature.icon}
                </div>
                
                <h3 className="relative text-2xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="relative text-gray-400 leading-relaxed mb-6">
                  {feature.description}
                </p>
                
                <div className="space-y-2">
                  {feature.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500/50" />
                      <span className="text-sm text-gray-300">{highlight}</span>
                    </div>
                  ))}
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-purple-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            ))}
          </div>
          
          {filteredFeatures.length === 0 && (
            <div className="text-center py-20">
              <Target className="w-16 h-16 text-gray-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-2">No features found</h3>
              <p className="text-gray-400">Try selecting a different category</p>
            </div>
          )}
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20 px-6 bg-linear-to-b from-zinc-900 to-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
              Why Choose <span className="bg-linear-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">CommunityFix</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Compare how we stack up against traditional reporting methods and other platforms.
            </p>
          </div>
          
          <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3">
              {/* Traditional Methods */}
              <div className="p-8 border-b md:border-b-0 md:border-r border-zinc-700">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-linear-to-br from-gray-500 to-slate-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Traditional Methods</h3>
                  <p className="text-gray-400">Phone calls, emails, paper forms</p>
                </div>
                
                <div className="space-y-4">
                  {[
                    { label: 'Response Time', value: '5-10 days', status: 'bad' },
                    { label: 'Transparency', value: 'Limited', status: 'bad' },
                    { label: 'Tracking', value: 'None', status: 'bad' },
                    { label: 'Success Rate', value: '65%', status: 'bad' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-xl">
                      <span className="text-gray-300">{item.label}</span>
                      <span className={`font-bold ${
                        item.status === 'bad' ? 'text-red-400' : 'text-emerald-400'
                      }`}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Other Platforms */}
              <div className="p-8 border-b md:border-b-0 md:border-r border-zinc-700">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Other Platforms</h3>
                  <p className="text-gray-400">Basic reporting apps</p>
                </div>
                
                <div className="space-y-4">
                  {[
                    { label: 'Response Time', value: '2-3 days', status: 'medium' },
                    { label: 'Transparency', value: 'Basic', status: 'medium' },
                    { label: 'Tracking', value: 'Limited', status: 'medium' },
                    { label: 'Success Rate', value: '78%', status: 'medium' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-xl">
                      <span className="text-gray-300">{item.label}</span>
                      <span className={`font-bold ${
                        item.status === 'medium' ? 'text-yellow-400' : 'text-emerald-400'
                      }`}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* CommunityFix */}
              <div className="p-8 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-linear-to-r from-purple-500/10 to-pink-500/10 rounded-full" />
                
                <div className="text-center mb-8 relative z-10">
                  <div className="w-16 h-16 bg-linear-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">CommunityFix</h3>
                  <p className="text-gray-400">Advanced community platform</p>
                </div>
                
                <div className="space-y-4 relative z-10">
                  {[
                    { label: 'Response Time', value: '18 hours', status: 'good' },
                    { label: 'Transparency', value: 'Complete', status: 'good' },
                    { label: 'Tracking', value: 'Real-time', status: 'good' },
                    { label: 'Success Rate', value: '98.5%', status: 'good' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                      <span className="text-white">{item.label}</span>
                      <span className="font-bold text-emerald-400">{item.value}</span>
                    </div>
                  ))}
                </div>
                
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-linear-to-r from-purple-500/10 to-pink-500/10 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Excellence */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
              Technical <span className="bg-linear-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Excellence</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Built with cutting-edge technology to ensure reliability, security, and performance.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Cloud className="w-10 h-10" />,
                title: 'Cloud Infrastructure',
                description: 'AWS-powered scalable infrastructure with 99.9% uptime guarantee',
                tech: ['AWS', 'Docker', 'Kubernetes', 'CDN']
              },
              {
                icon: <Lock className="w-10 h-10" />,
                title: 'Security Stack',
                description: 'Enterprise-grade security with regular penetration testing',
                tech: ['256-bit SSL', '2FA', 'GDPR', 'SOC2']
              },
              {
                icon: <BarChart className="w-10 h-10" />,
                title: 'AI & Analytics',
                description: 'Machine learning models for smart issue prioritization',
                tech: ['TensorFlow', 'BigQuery', 'Redis', 'Elasticsearch']
              },
              {
                icon: <MessageSquare className="w-10 h-10" />,
                title: 'Real-time Systems',
                description: 'WebSocket-powered live updates and notifications',
                tech: ['WebSockets', 'Redis Pub/Sub', 'Firebase', 'APNS']
              }
            ].map((tech, index) => (
              <div key={index} className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-6">
                <div className="w-16 h-16 bg-linear-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center text-purple-400 mb-4">
                  {tech.icon}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{tech.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{tech.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {tech.tech.map((item, i) => (
                    <span key={i} className="px-3 py-1 bg-zinc-700/50 rounded-lg text-gray-300 text-xs">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl p-12 border border-zinc-700 text-center">
            <div className="w-20 h-20 bg-linear-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Experience the Difference
            </h2>
            
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Join thousands of citizens who are transforming their communities with powerful features designed for real impact.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group px-10 py-5 bg-linear-to-r from-purple-500 to-pink-500 rounded-2xl font-bold text-lg text-white shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-3">
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="px-10 py-5 bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl font-bold text-lg text-white hover:bg-white/20 transition-all duration-300">
                Schedule Demo
              </button>
            </div>
            
            <p className="text-gray-500 text-sm mt-6">
              No credit card required • 14-day free trial • Full feature access
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;