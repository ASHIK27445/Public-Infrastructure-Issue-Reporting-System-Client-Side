import React, { useState } from 'react';
import { NavLink } from 'react-router';
import { 
  Search,
  MessageSquare,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  Users,
  FileText,
  Shield,
  Zap,
  AlertTriangle,
  BookOpen,
  Video,
  Download,
  Star,
  ChevronRight,
  ChevronDown,
  ThumbsUp,
  ThumbsDown,
  Globe,
  Target,
  Award,
  HelpCircle,
  ArrowRight,
  Lightbulb,
  Settings,
  User,
  MapPin,
  Bell,
  CreditCard,
  Lock,
  Eye
} from 'lucide-react';

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [activeTab, setActiveTab] = useState('faq');

  const categories = [
    { id: 'all', name: 'All Topics', icon: <BookOpen className="w-5 h-5" />, count: 45 },
    { id: 'getting-started', name: 'Getting Started', icon: <Zap className="w-5 h-5" />, count: 12 },
    { id: 'reporting', name: 'Reporting Issues', icon: <AlertTriangle className="w-5 h-5" />, count: 8 },
    { id: 'account', name: 'Account & Profile', icon: <User className="w-5 h-5" />, count: 6 },
    { id: 'premium', name: 'Premium Features', icon: <Star className="w-5 h-5" />, count: 5 },
    { id: 'community', name: 'Community', icon: <Users className="w-5 h-5" />, count: 7 },
    { id: 'technical', name: 'Technical Support', icon: <Settings className="w-5 h-5" />, count: 7 }
  ];

  const popularArticles = [
    { id: 1, title: 'How to Report an Issue Effectively', views: '2.4k', category: 'reporting' },
    { id: 2, title: 'Understanding Issue Statuses', views: '1.8k', category: 'getting-started' },
    { id: 3, title: 'Upgrading to Premium Account', views: '1.5k', category: 'premium' },
    { id: 4, title: 'Privacy and Data Security', views: '1.2k', category: 'account' },
    { id: 5, title: 'Using the Map View Feature', views: '1.1k', category: 'technical' },
    { id: 6, title: 'Community Guidelines Overview', views: '900', category: 'community' }
  ];

  const faqs = [
    {
      id: 1,
      question: 'How do I report an infrastructure issue?',
      answer: 'To report an issue, click the "Report Issue" button in the navigation bar. You\'ll be asked to provide details including the issue type, location (either by address or by dropping a pin on the map), description, and photos if available. Once submitted, our system will assign a tracking ID and notify the appropriate authorities.',
      category: 'reporting',
      helpful: 42,
      unhelpful: 3
    },
    {
      id: 2,
      question: 'What happens after I submit an issue?',
      answer: 'After submission, your issue goes through several stages: 1) Verification by our team (within 24 hours), 2) Assignment to relevant department, 3) Status updates from field staff, 4) Resolution confirmation. You\'ll receive notifications at each stage and can track progress in your dashboard.',
      category: 'getting-started',
      helpful: 38,
      unhelpful: 2
    },
    {
      id: 3,
      question: 'How long does it take to resolve issues?',
      answer: 'Resolution time varies based on issue severity and complexity. Critical issues (safety hazards) are typically addressed within 48 hours. High priority issues: 3-7 days. Medium priority: 1-2 weeks. Low priority: 2-4 weeks. Premium users get priority handling with guaranteed response times.',
      category: 'getting-started',
      helpful: 35,
      unhelpful: 5
    },
    {
      id: 4,
      question: 'Can I edit or delete my submitted issues?',
      answer: 'You can edit issues only while they are in "Pending" status. Once an issue is under review or in progress, it cannot be edited. You can delete issues only if they haven\'t been assigned to staff yet. Deleted issues are removed from public view but retained in our system for 30 days.',
      category: 'account',
      helpful: 28,
      unhelpful: 4
    },
    {
      id: 5,
      question: 'What are the benefits of Premium membership?',
      answer: 'Premium members enjoy: Unlimited issue submissions (free users limited to 3), Priority issue resolution, Advanced analytics dashboard, Verified citizen badge, 24/7 priority support, Early access to new features, and No advertisements.',
      category: 'premium',
      helpful: 45,
      unhelpful: 1
    },
    {
      id: 6,
      question: 'How is my personal information protected?',
      answer: 'We implement bank-level security: 256-bit SSL encryption, Regular security audits, GDPR compliance, Anonymous reporting option, Two-factor authentication, and Data minimization principles. Your personal information is never shared without consent except as required by law.',
      category: 'account',
      helpful: 40,
      unhelpful: 2
    }
  ];

  const supportChannels = [
    {
      name: 'Live Chat',
      icon: <MessageSquare className="w-8 h-8" />,
      description: 'Instant support from our team',
      responseTime: 'Typically replies in 2 minutes',
      availability: '24/7',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      name: 'Email Support',
      icon: <Mail className="w-8 h-8" />,
      description: 'Detailed issue assistance',
      responseTime: 'Within 2 hours',
      availability: '24/7',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Phone Support',
      icon: <Phone className="w-8 h-8" />,
      description: 'Direct conversation with experts',
      responseTime: 'Immediate',
      availability: '9AM-6PM (Local Time)',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const tutorials = [
    {
      title: 'Complete Reporting Guide',
      duration: '15 min',
      type: 'Video',
      icon: <Video className="w-6 h-6" />,
      description: 'Step-by-step guide to reporting issues effectively'
    },
    {
      title: 'Dashboard Walkthrough',
      duration: '10 min',
      type: 'Article',
      icon: <FileText className="w-6 h-6" />,
      description: 'Master your dashboard and track issues'
    },
    {
      title: 'Map Features Tutorial',
      duration: '12 min',
      type: 'Video',
      icon: <MapPin className="w-6 h-6" />,
      description: 'Learn to use advanced map features'
    },
    {
      title: 'Premium Features Demo',
      duration: '8 min',
      type: 'Video',
      icon: <Star className="w-6 h-6" />,
      description: 'See all premium features in action'
    }
  ];

  const filteredFaqs = selectedCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  const filteredArticles = selectedCategory === 'all'
    ? popularArticles
    : popularArticles.filter(article => article.category === selectedCategory);

  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-950 to-zinc-900">
      <title>CommunityFix - Help Center</title>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-linear-to-r from-blue-900/20 via-indigo-900/20 to-purple-900/20" />
          <div className="absolute inset-0 bg-[radial-linear(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%)]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-blue-500/20 to-indigo-500/20 rounded-3xl border border-blue-500/30 mb-6">
              <HelpCircle className="w-10 h-10 text-blue-400" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
              Help <span className="bg-linear-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">Center</span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
              Find answers, get support, and learn how to make the most of CommunityFix
            </p>
            
            {/* Search Bar */}
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What can we help you with? Search for answers..."
                  className="w-full pl-16 pr-6 py-5 bg-zinc-800/50 border border-zinc-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 backdrop-blur-sm text-lg"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 px-6 py-3 bg-linear-to-r from-blue-500 to-indigo-500 rounded-xl text-white font-medium hover:shadow-blue-500/50 transition-all">
                  Search
                </button>
              </div>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                <span className="text-gray-400 text-sm">Popular:</span>
                {['Report an issue', 'Premium features', 'Account settings', 'Privacy policy'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchQuery(term)}
                    className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-gray-300 hover:text-white text-sm transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Categories */}
      <section className="py-12 px-6 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black text-white mb-8 text-center">
            Browse by Category
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`group flex flex-col items-center p-4 rounded-2xl transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-linear-to-br from-blue-500/20 to-indigo-500/20 border-2 border-blue-500/50'
                    : 'bg-zinc-800 border border-zinc-700 hover:bg-zinc-700'
                }`}
              >
                <div className={`mb-3 p-3 rounded-xl ${
                  selectedCategory === category.id
                    ? 'bg-linear-to-r from-blue-500 to-indigo-500 text-white'
                    : 'bg-zinc-700 text-gray-400 group-hover:text-white'
                }`}>
                  {category.icon}
                </div>
                <span className={`text-sm font-medium mb-1 ${
                  selectedCategory === category.id ? 'text-white' : 'text-gray-400 group-hover:text-white'
                }`}>
                  {category.name}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  selectedCategory === category.id
                    ? 'bg-blue-500/30 text-blue-300'
                    : 'bg-zinc-700 text-gray-500'
                }`}>
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-6 bg-linear-to-b from-zinc-900 to-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - FAQ & Articles */}
            <div className="lg:col-span-2">
              {/* Tab Navigation */}
              <div className="flex border-b border-zinc-700 mb-8">
                {[
                  { id: 'faq', name: 'FAQs', icon: <HelpCircle className="w-5 h-5" /> },
                  { id: 'articles', name: 'Popular Articles', icon: <FileText className="w-5 h-5" /> },
                  { id: 'tutorials', name: 'Tutorials', icon: <Video className="w-5 h-5" /> }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-3 font-medium transition-colors relative ${
                      activeTab === tab.id
                        ? 'text-blue-400'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.name}</span>
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-blue-500 to-indigo-500" />
                    )}
                  </button>
                ))}
              </div>

              {/* FAQ Content */}
              {activeTab === 'faq' && (
                <div className="space-y-4">
                  {filteredFaqs.map((faq) => (
                    <div key={faq.id} className="border border-zinc-700 rounded-2xl overflow-hidden">
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                        className="w-full flex items-center justify-between p-6 bg-zinc-800/50 hover:bg-zinc-800 transition-colors text-left"
                      >
                        <div className="flex items-start space-x-4">
                          <HelpCircle className="w-6 h-6 text-blue-400 shrink-0" />
                          <div>
                            <h3 className="text-lg font-bold text-white mb-2">{faq.question}</h3>
                            <div className="flex items-center space-x-4">
                              <span className="px-3 py-1 bg-zinc-700 rounded-lg text-gray-400 text-sm">
                                {categories.find(c => c.id === faq.category)?.name}
                              </span>
                              <div className="flex items-center text-gray-500 text-sm">
                                <ThumbsUp className="w-4 h-4 mr-1" />
                                <span>{faq.helpful}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <ChevronDown className={`w-6 h-6 text-gray-400 transition-transform ${
                          expandedFaq === faq.id ? 'rotate-180' : ''
                        }`} />
                      </button>
                      
                      {expandedFaq === faq.id && (
                        <div className="p-6 border-t border-zinc-700 bg-zinc-900/50">
                          <p className="text-gray-300 mb-6 leading-relaxed">{faq.answer}</p>
                          
                          <div className="flex items-center justify-between pt-4 border-t border-zinc-700">
                            <div className="text-gray-500 text-sm">
                              Was this answer helpful?
                            </div>
                            <div className="flex items-center space-x-2">
                              <button className="flex items-center space-x-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 hover:bg-emerald-500/20 transition-colors">
                                <ThumbsUp className="w-4 h-4" />
                                <span>Yes ({faq.helpful})</span>
                              </button>
                              <button className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 hover:bg-red-500/20 transition-colors">
                                <ThumbsDown className="w-4 h-4" />
                                <span>No ({faq.unhelpful})</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Articles Content */}
              {activeTab === 'articles' && (
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredArticles.map((article) => (
                    <div key={article.id} className="group bg-linear-to-br from-zinc-800 to-zinc-900 rounded-2xl border border-zinc-700 p-6 hover:border-blue-500/50 transition-all duration-300">
                      <div className="flex items-center space-x-3 mb-4">
                        <FileText className="w-6 h-6 text-blue-400" />
                        <div>
                          <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-xs font-medium">
                            {categories.find(c => c.id === article.category)?.name}
                          </span>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                        {article.title}
                      </h3>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-zinc-700">
                        <div className="flex items-center text-gray-400 text-sm">
                          <Eye className="w-4 h-4 mr-1" />
                          <span>{article.views} views</span>
                        </div>
                        <button className="flex items-center text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors">
                          Read Article
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tutorials Content */}
              {activeTab === 'tutorials' && (
                <div className="grid md:grid-cols-2 gap-6">
                  {tutorials.map((tutorial, index) => (
                    <div key={index} className="group bg-linear-to-br from-zinc-800 to-zinc-900 rounded-2xl border border-zinc-700 p-6 hover:border-purple-500/50 transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl ${
                          tutorial.type === 'Video' 
                            ? 'bg-purple-500/20 text-purple-400' 
                            : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {tutorial.icon}
                        </div>
                        <span className="px-3 py-1 bg-zinc-700 rounded-lg text-gray-400 text-sm">
                          {tutorial.duration}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                        {tutorial.title}
                      </h3>
                      
                      <p className="text-gray-400 text-sm mb-4">
                        {tutorial.description}
                      </p>
                      
                      <button className="w-full py-3 bg-zinc-700 hover:bg-zinc-600 rounded-xl text-white font-medium transition-colors flex items-center justify-center space-x-2">
                        {tutorial.type === 'Video' ? (
                          <>
                            <Video className="w-5 h-5" />
                            <span>Watch Tutorial</span>
                          </>
                        ) : (
                          <>
                            <FileText className="w-5 h-5" />
                            <span>Read Guide</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Support & Resources */}
            <div className="lg:col-span-1">
              {/* Support Channels */}
              <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-6 mb-6">
                <div className="flex items-center space-x-3 mb-6">
                  <MessageSquare className="w-6 h-6 text-blue-400" />
                  <h3 className="text-xl font-bold text-white">Contact Support</h3>
                </div>
                
                <div className="space-y-4">
                  {supportChannels.map((channel, index) => (
                    <button
                      key={index}
                      className="group w-full flex items-center justify-between p-4 bg-zinc-800/50 hover:bg-zinc-800 rounded-xl border border-zinc-700 transition-all duration-300"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`bg-linear-to-r ${channel.color} w-12 h-12 rounded-xl flex items-center justify-center text-white`}>
                          {channel.icon}
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-white group-hover:text-blue-400">{channel.name}</div>
                          <div className="text-gray-400 text-sm">{channel.description}</div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-linear-to-br from-blue-900/30 to-indigo-900/30 rounded-3xl border border-blue-500/30 p-6 mb-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Target className="w-6 h-6 text-blue-400" />
                  <h3 className="text-xl font-bold text-white">Support Stats</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                      <span className="text-gray-300">Resolution Rate</span>
                    </div>
                    <span className="text-white font-bold">98.5%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-blue-400" />
                      <span className="text-gray-300">Avg. Response Time</span>
                    </div>
                    <span className="text-white font-bold">12 min</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-purple-400" />
                      <span className="text-gray-300">Happy Users</span>
                    </div>
                    <span className="text-white font-bold">24K+</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Award className="w-5 h-5 text-amber-400" />
                      <span className="text-gray-300">Support Rating</span>
                    </div>
                    <span className="text-white font-bold">4.9/5</span>
                  </div>
                </div>
              </div>

              {/* Useful Links */}
              <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Lightbulb className="w-6 h-6 text-amber-400" />
                  <h3 className="text-xl font-bold text-white">Useful Resources</h3>
                </div>
                
                <div className="space-y-3">
                  <NavLink
                    to="/community-guidelines"
                    className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-xl hover:bg-zinc-800 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-purple-400" />
                      <span className="text-gray-300 group-hover:text-white">Community Guidelines</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  </NavLink>
                  
                  <NavLink
                    to="/terms"
                    className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-xl hover:bg-zinc-800 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-blue-400" />
                      <span className="text-gray-300 group-hover:text-white">Terms of Service</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  </NavLink>
                  
                  <NavLink
                    to="/privacy"
                    className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-xl hover:bg-zinc-800 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-emerald-400" />
                      <span className="text-gray-300 group-hover:text-white">Privacy Policy</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  </NavLink>
                  
                  <button className="w-full flex items-center justify-between p-3 bg-zinc-800/50 rounded-xl hover:bg-zinc-800 transition-colors group">
                    <div className="flex items-center space-x-3">
                      <Download className="w-5 h-5 text-amber-400" />
                      <span className="text-gray-300 group-hover:text-white">Download Guides (PDF)</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl p-12 border border-zinc-700 text-center">
            <div className="w-20 h-20 bg-linear-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Still Need Help?
            </h2>
            
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Can't find what you're looking for? Our support team is ready to help you with any questions or issues.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group px-10 py-5 bg-linear-to-r from-blue-500 to-indigo-500 rounded-2xl font-bold text-lg text-white shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-3">
                <Mail className="w-5 h-5" />
                <span>Email Support</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="px-10 py-5 bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl font-bold text-lg text-white hover:bg-white/20 transition-all duration-300">
                Schedule a Call
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HelpCenter;