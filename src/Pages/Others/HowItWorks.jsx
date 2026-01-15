import React, { useState } from 'react';
import { NavLink } from 'react-router';
import {
  MapPin,
  AlertTriangle,
  Shield,
  Target,
  CheckCircle,
  Users,
  Clock,
  Bell,
  TrendingUp,
  Award,
  ArrowRight,
  PlayCircle,
  Download,
  FileText,
  Smartphone,
  Globe,
  Zap,
  Eye,
  MessageSquare,
  Star,
  ChevronRight,
  Heart
} from 'lucide-react';

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [videoPlaying, setVideoPlaying] = useState(false);

  const steps = [
    {
      number: '01',
      title: 'Report',
      description: 'Spot an issue in your community? Use our app to report it in under 60 seconds.',
      details: 'Take a photo, add a description, and drop a pin on the map. Our intelligent system categorizes and prioritizes your report automatically.',
      icon: <AlertTriangle className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-500',
      features: ['Photo upload', 'GPS location', 'Smart categorization', 'Priority detection']
    },
    {
      number: '02',
      title: 'Review',
      description: 'Our team reviews and verifies your submission within 24 hours.',
      details: 'Trained moderators verify the authenticity and urgency of each report before assigning it to the appropriate department.',
      icon: <Shield className="w-8 h-8" />,
      color: 'from-emerald-500 to-teal-500',
      features: ['24-hour verification', 'Spam detection', 'Priority assessment', 'Department routing']
    },
    {
      number: '03',
      title: 'Assign',
      description: 'The issue gets assigned to the right department or field staff.',
      details: 'Based on issue type and location, our system automatically assigns it to the most appropriate team for resolution.',
      icon: <Target className="w-8 h-8" />,
      color: 'from-purple-500 to-pink-500',
      features: ['Smart routing', 'Geolocation matching', 'Workload balancing', 'Expert assignment']
    },
    {
      number: '04',
      title: 'Resolve',
      description: 'Track real-time progress as the issue gets resolved.',
      details: 'Watch your report come to life with live updates, photos from the field, and estimated completion times.',
      icon: <CheckCircle className="w-8 h-8" />,
      color: 'from-amber-500 to-orange-500',
      features: ['Live updates', 'Field photos', 'Progress tracking', 'Completion estimates']
    }
  ];

  const features = [
    {
      icon: <Eye className="w-6 h-6" />,
      title: 'Complete Transparency',
      description: 'Track every step from report to resolution with real-time updates and photos.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Lightning Fast',
      description: 'Average issue resolution time is 72% faster than traditional reporting methods.',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Community Powered',
      description: 'Join 16,000+ active citizens making real change in their communities.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Data Driven',
      description: 'AI-powered analytics help prioritize critical issues for maximum impact.',
      color: 'from-amber-500 to-orange-500'
    }
  ];

  const testimonials = [
    {
      name: 'Michael Rodriguez',
      role: 'Community Leader',
      text: 'I reported a dangerous pothole and it was fixed within 48 hours. The transparency and updates were incredible.',
      issues: 24,
      resolved: 22,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael'
    },
    {
      name: 'Sarah Johnson',
      role: 'Local Business Owner',
      text: 'The real-time tracking feature kept me informed every step of the way. No more wondering when issues will be fixed.',
      issues: 12,
      resolved: 11,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
    }
  ];

  const stats = [
    { value: '24,891', label: 'Issues Resolved', icon: <CheckCircle className="w-6 h-6" /> },
    { value: '16,432', label: 'Active Citizens', icon: <Users className="w-6 h-6" /> },
    { value: '98.5%', label: 'Satisfaction Rate', icon: <Star className="w-6 h-6" /> },
    { value: '18hrs', label: 'Avg Response Time', icon: <Clock className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/20 via-teal-900/20 to-cyan-900/20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.15),transparent_50%)]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-full mb-6">
              <Zap className="w-5 h-5 text-emerald-400 mr-2" />
              <span className="text-emerald-400 font-semibold text-sm uppercase tracking-wider">
                Simple & Effective
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
              How <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">CommunityFix</span> Works
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
              From spotting an issue to seeing it resolved – our four-step process makes community improvement simple, transparent, and incredibly effective.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl font-bold text-lg text-white shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-3">
                <span>Start Reporting</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={() => setVideoPlaying(true)}
                className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl font-bold text-lg text-white hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-3"
              >
                <PlayCircle className="w-5 h-5" />
                <span>Watch Demo (2 min)</span>
              </button>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="bg-zinc-900/50 backdrop-blur-sm rounded-3xl p-6 border border-zinc-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl md:text-4xl font-black text-white">{stat.value}</div>
                  <div className="text-emerald-400">{stat.icon}</div>
                </div>
                <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
              The <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Four-Step</span> Process
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Simple, transparent, and designed to get results. Here's how we transform community issues into solutions.
            </p>
          </div>
          
          {/* Step Navigation */}
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            {steps.map((step, index) => (
              <button
                key={step.number}
                onClick={() => setActiveStep(index)}
                className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 flex items-center space-x-3 ${
                  activeStep === index
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                    : 'bg-zinc-800 text-gray-400 hover:text-white hover:bg-zinc-700'
                }`}
              >
                <span className="text-xl font-black">{step.number}</span>
                <span>{step.title}</span>
              </button>
            ))}
          </div>
          
          {/* Active Step Detail */}
          <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 overflow-hidden mb-16">
            <div className="grid lg:grid-cols-2">
              {/* Left Side - Step Details */}
              <div className="p-12">
                <div className="flex items-center space-x-4 mb-6">
                  <div className={`bg-gradient-to-r ${steps[activeStep].color} w-20 h-20 rounded-2xl flex items-center justify-center text-white`}>
                    {steps[activeStep].icon}
                  </div>
                  <div>
                    <div className="text-5xl font-black text-gray-600">{steps[activeStep].number}</div>
                    <div className="text-3xl font-black text-white">{steps[activeStep].title}</div>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">
                  {steps[activeStep].description}
                </h3>
                
                <p className="text-gray-300 mb-8 leading-relaxed">
                  {steps[activeStep].details}
                </p>
                
                <div className="space-y-3">
                  {steps[activeStep].features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 pt-8 border-t border-zinc-700">
                  <div className="flex items-center space-x-4">
                    <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-white font-medium hover:shadow-emerald-500/50 transition-all">
                      Try Step {activeStep + 1}
                    </button>
                    <span className="text-gray-400 text-sm">
                      {activeStep < steps.length - 1 ? (
                        <button 
                          onClick={() => setActiveStep(activeStep + 1)}
                          className="flex items-center text-emerald-400 hover:text-emerald-300 transition-colors"
                        >
                          Next: {steps[activeStep + 1].title}
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                      ) : (
                        <span className="text-emerald-400">✓ Process Complete</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Right Side - Visual */}
              <div className="relative bg-gradient-to-br from-zinc-900 to-black p-12 flex items-center justify-center">
                <div className="relative w-full max-w-md">
                  {/* Step-specific visualization */}
                  {activeStep === 0 && (
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl p-6 border border-blue-500/30">
                        <div className="flex items-center space-x-4 mb-4">
                          <Smartphone className="w-8 h-8 text-blue-400" />
                          <div>
                            <div className="text-white font-bold">Report Submission</div>
                            <div className="text-blue-300 text-sm">60-second process</div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300">Photo Upload</span>
                            <span className="text-emerald-400">✓</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300">Location Mapping</span>
                            <span className="text-emerald-400">✓</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300">Category Selection</span>
                            <span className="text-emerald-400">✓</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-center text-gray-400">
                        <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <div className="text-sm">Drop pin on map to mark location</div>
                      </div>
                    </div>
                  )}
                  
                  {activeStep === 1 && (
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl p-6 border border-emerald-500/30">
                        <div className="flex items-center space-x-4 mb-4">
                          <Shield className="w-8 h-8 text-emerald-400" />
                          <div>
                            <div className="text-white font-bold">Verification Dashboard</div>
                            <div className="text-emerald-300 text-sm">24-hour review</div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300">Authenticity Check</span>
                            <span className="text-emerald-400">In Progress</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300">Priority Assessment</span>
                            <span className="text-yellow-400">Pending</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300">Department Routing</span>
                            <span className="text-gray-400">Queued</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="inline-flex items-center px-4 py-2 bg-emerald-500/20 rounded-xl">
                          <Clock className="w-4 h-4 text-emerald-400 mr-2" />
                          <span className="text-emerald-300 text-sm">Average verification: 4.2 hours</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeStep === 2 && (
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-500/30">
                        <div className="flex items-center space-x-4 mb-4">
                          <Target className="w-8 h-8 text-purple-400" />
                          <div>
                            <div className="text-white font-bold">Assignment System</div>
                            <div className="text-purple-300 text-sm">Smart routing</div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="text-center">
                            <div className="text-3xl font-black text-white mb-1">3</div>
                            <div className="text-gray-300 text-sm">Available Teams</div>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            {['Roads Dept', 'Electricity', 'Sanitation'].map((dept, i) => (
                              <div key={i} className="text-center p-2 bg-zinc-800/50 rounded-lg">
                                <div className="text-xs text-gray-400">{dept}</div>
                                <div className="text-white font-bold">2 staff</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-400 text-sm">
                          <Globe className="w-5 h-5 inline mr-2" />
                          Geolocation matching ensures nearest team is assigned
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeStep === 3 && (
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl p-6 border border-amber-500/30">
                        <div className="flex items-center space-x-4 mb-4">
                          <CheckCircle className="w-8 h-8 text-amber-400" />
                          <div>
                            <div className="text-white font-bold">Resolution Progress</div>
                            <div className="text-amber-300 text-sm">Live tracking</div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm text-gray-300 mb-1">
                              <span>Work Completion</span>
                              <span>85%</span>
                            </div>
                            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500" style={{ width: '85%' }} />
                            </div>
                          </div>
                          <div className="text-center">
                            <Bell className="w-5 h-5 text-amber-400 inline mr-2" />
                            <span className="text-amber-300 text-sm">You'll be notified upon completion</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="inline-flex items-center px-4 py-2 bg-amber-500/20 rounded-xl">
                          <Clock className="w-4 h-4 text-amber-400 mr-2" />
                          <span className="text-amber-300 text-sm">Estimated completion: 2 hours</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Step Indicators */}
          <div className="flex justify-center space-x-8">
            {steps.map((step, index) => (
              <div key={step.number} className="text-center">
                <button
                  onClick={() => setActiveStep(index)}
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 transition-all duration-300 ${
                    activeStep === index
                      ? `bg-gradient-to-r ${step.color} text-white transform scale-110 shadow-xl`
                      : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700 hover:text-white'
                  }`}
                >
                  {step.icon}
                </button>
                <div className={`text-sm font-medium ${activeStep === index ? 'text-white' : 'text-gray-500'}`}>
                  {step.title}
                </div>
                <div className="text-xs text-gray-600 mt-1">Step {index + 1}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 px-6 bg-gradient-to-b from-zinc-900 to-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
              Why It <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our platform combines technology with community power to deliver unprecedented results.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl p-8 border border-zinc-700 hover:border-emerald-500/50 transition-all duration-500">
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-500`}>
                  {feature.icon}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
              Community <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Success</span> Stories
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              See how citizens are using CommunityFix to make real change in their neighborhoods.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-8">
                <div className="flex items-start space-x-4 mb-6">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-2xl border-2 border-emerald-500/50"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-white">{testimonial.name}</h3>
                    <p className="text-emerald-400 text-sm font-medium">{testimonial.role}</p>
                  </div>
                </div>
                
                <p className="text-gray-300 italic mb-8 leading-relaxed">
                  "{testimonial.text}"
                </p>
                
                <div className="flex items-center justify-between pt-6 border-t border-zinc-700">
                  <div className="text-center">
                    <div className="text-2xl font-black text-white">{testimonial.issues}</div>
                    <div className="text-gray-400 text-sm">Issues Reported</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black text-emerald-400">{testimonial.resolved}</div>
                    <div className="text-gray-400 text-sm">Resolved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black text-amber-400">
                      {Math.round((testimonial.resolved / testimonial.issues) * 100)}%
                    </div>
                    <div className="text-gray-400 text-sm">Success Rate</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl p-12 border border-zinc-700 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Ready to Make a Difference?
            </h2>
            
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Join thousands of citizens who are actively improving their communities. It takes just 60 seconds to report your first issue.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NavLink
                to="/report"
                className="group px-10 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl font-bold text-lg text-white shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-3"
              >
                <AlertTriangle className="w-5 h-5" />
                <span>Report Your First Issue</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </NavLink>
              
              <button className="px-10 py-5 bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl font-bold text-lg text-white hover:bg-white/20 transition-all duration-300">
                Download App
              </button>
            </div>
            
            <p className="text-gray-500 text-sm mt-6">
              Free forever • No credit card required • 24/7 support
            </p>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {videoPlaying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setVideoPlaying(false)}
          />
          
          <div className="relative bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-3xl border border-zinc-700 max-w-4xl w-full p-8 shadow-2xl">
            <button
              onClick={() => setVideoPlaying(false)}
              className="absolute -top-12 right-0 p-3 bg-zinc-800 rounded-xl text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
            
            <div className="aspect-video bg-black rounded-2xl overflow-hidden mb-6">
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-900/30 to-teal-900/30">
                <div className="text-center">
                  <PlayCircle className="w-20 h-20 text-white/50 mx-auto mb-4" />
                  <p className="text-gray-400">How CommunityFix Works - Demo Video</p>
                  <p className="text-gray-500 text-sm">(2 minute overview)</p>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="text-2xl font-black text-white mb-2">Quick Demo Video</h3>
              <p className="text-gray-400">
                See how easy it is to report and track community issues
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HowItWorks;