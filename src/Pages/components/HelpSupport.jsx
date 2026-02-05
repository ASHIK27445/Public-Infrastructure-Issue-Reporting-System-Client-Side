import React, { useState, useEffect, use } from 'react';
import { 
  Filter, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  XCircle,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  MapPin,
  Calendar,
  User,
  ChevronDown,
  Loader2,
  Shield,
  ArrowUpDown,
  RefreshCw,
  HelpCircle,
  MessageSquare,
  Phone,
  Mail,
  Globe,
  FileText,
  Video,
  BookOpen,
  Users,
  Zap,
  Star,
  Check,
  ArrowRight,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ExternalLink,
  X
} from 'lucide-react';
import { AuthContext } from '../AuthProvider/AuthContext';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { useOutletContext, useNavigate, Link } from 'react-router';
import { toast } from 'react-toastify';

const HelpSupport = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('faq');
  
  const faqCategories = [
    {
      id: 'general',
      title: 'General Questions',
      icon: <HelpCircle className="w-5 h-5" />,
      questions: [
        {
          q: 'What is CitySahar and what does it do?',
          a: 'CitySahar is a citizen engagement platform that allows residents to report municipal issues, track their resolution, and collaborate with local authorities. We connect citizens with government services to improve urban living.'
        },
        {
          q: 'Is CitySahar free to use?',
          a: 'Yes! CitySahar is completely free for all citizens. There are no hidden fees or subscription charges for basic issue reporting and tracking.'
        },
        {
          q: 'Which cities does CitySahar operate in?',
          a: 'We currently serve all major metropolitan areas in the country. Our coverage is expanding daily - check our coverage map to see if your area is included.'
        }
      ]
    },
    {
      id: 'reporting',
      title: 'Reporting Issues',
      icon: <FileText className="w-5 h-5" />,
      questions: [
        {
          q: 'How do I report a new issue?',
          a: 'Click the "Report Issue" button on the dashboard, select the issue category, add photos, provide location details, and submit. You can track progress in your profile.'
        },
        {
          q: 'What types of issues can I report?',
          a: 'You can report road problems, sanitation issues, water supply, streetlights, parks, public safety concerns, and other municipal services.'
        },
        {
          q: 'Do I need to provide my personal information?',
          a: 'Basic contact information helps us update you on issue resolution. Your privacy is protected under our strict data protection policy.'
        }
      ]
    },
    {
      id: 'tracking',
      title: 'Tracking & Updates',
      icon: <Clock className="w-5 h-5" />,
      questions: [
        {
          q: 'How can I track my reported issues?',
          a: 'All your reported issues appear in the "My Reports" section. You\'ll receive email/SMS updates at each status change.'
        },
        {
          q: 'What does each status mean?',
          a: 'Pending: Issue received, In-Progress: Assigned to department, Resolved: Issue fixed, Closed: Verified and completed.'
        },
        {
          q: 'How long does resolution usually take?',
          a: 'Resolution time varies by issue type and severity. Critical issues are prioritized and typically resolved within 24-48 hours.'
        }
      ]
    },
    {
      id: 'account',
      title: 'Account & Profile',
      icon: <Users className="w-5 h-5" />,
      questions: [
        {
          q: 'How do I create an account?',
          a: 'Click "Sign Up" and provide your email or phone number. Verify through OTP and complete your profile setup.'
        },
        {
          q: 'Can I change my email or phone number?',
          a: 'Yes, go to Profile Settings > Contact Information to update your details. Verification is required for security.'
        },
        {
          q: 'How do I delete my account?',
          a: 'Contact our support team with your account details. Note: This action is irreversible and removes all your data.'
        }
      ]
    },
    {
      id: 'features',
      title: 'Features & Tools',
      icon: <Zap className="w-5 h-5" />,
      questions: [
        {
          q: 'What is Issue Boosting?',
          a: 'Boosting prioritizes your issue for faster resolution using tokens. Boosted issues get higher visibility and priority handling.'
        },
        {
          q: 'How do Upvotes work?',
          a: 'Other users can upvote issues they care about. Issues with more upvotes get more attention from authorities.'
        },
        {
          q: 'What are Achievement Badges?',
          a: 'Badges reward active participation. Earn badges for reporting issues, helping others, and community engagement.'
        }
      ]
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      icon: <Shield className="w-5 h-5" />,
      questions: [
        {
          q: 'Is my personal data safe?',
          a: 'We use bank-level encryption and comply with data protection laws. Your personal information is never shared without consent.'
        },
        {
          q: 'Can I report anonymously?',
          a: 'Yes, you can report anonymously. However, you won\'t receive updates or earn rewards for anonymous reports.'
        },
        {
          q: 'Who can see my reports?',
          a: 'Issue details are public but your contact information is private. Only authorized officials can see reporter details.'
        }
      ]
    }
  ];

  const contactOptions = [
    {
      title: '24/7 Support Chat',
      description: 'Instant chat support with our AI assistant',
      icon: <MessageSquare className="w-6 h-6" />,
      response: 'Average response time: 2 minutes',
      link: '#chat',
      available: true
    },
    {
      title: 'Email Support',
      description: 'Detailed queries and documentation',
      icon: <Mail className="w-6 h-6" />,
      response: 'Response within 4-6 hours',
      link: 'mailto:support@citysahar.com',
      available: true
    },
    {
      title: 'Phone Support',
      description: 'Direct conversation with support agents',
      icon: <Phone className="w-6 h-6" />,
      response: 'Mon-Fri, 9AM-6PM',
      link: 'tel:+18005551234',
      available: true
    },
    {
      title: 'Community Forum',
      description: 'Connect with other users and experts',
      icon: <Users className="w-6 h-6" />,
      response: 'Active community 24/7',
      link: '#forum',
      available: true
    }
  ];

  const quickLinks = [
    { title: 'Report an Issue', icon: <FileText />, link: '/report' },
    { title: 'Check Service Status', icon: <Globe />, link: '/status' },
    { title: 'Download Mobile App', icon: <Zap />, link: '/app' },
    { title: 'Government Partners', icon: <Shield />, link: '/partners' },
    { title: 'Success Stories', icon: <Star />, link: '/stories' },
    { title: 'API Documentation', icon: <BookOpen />, link: '/api' }
  ];

  const tutorials = [
    {
      title: 'How to Report Issues Effectively',
      duration: '5 min',
      type: 'Video',
      icon: <Video className="w-4 h-4" />
    },
    {
      title: 'Understanding Issue Status',
      duration: '3 min',
      type: 'Article',
      icon: <FileText className="w-4 h-4" />
    },
    {
      title: 'Maximizing Your Impact',
      duration: '7 min',
      type: 'Video',
      icon: <Video className="w-4 h-4" />
    },
    {
      title: 'Privacy Settings Guide',
      duration: '4 min',
      type: 'Article',
      icon: <FileText className="w-4 h-4" />
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-950 to-zinc-900">
      <title>CommunityFix - Help Support</title>
      {/* Header - Same Theme */}
      <div className="sticky top-0 z-40 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                Help & <span className="bg-linear-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Support</span>
              </h1>
              <p className="text-gray-400">Find answers, get support, or contact our team</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="p-2 bg-zinc-800 border border-zinc-700 rounded-2xl text-gray-400 hover:text-white hover:bg-zinc-700 transition-colors"
                title="Back to top"
              >
                <ArrowUpDown className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-linear-to-r from-emerald-600/90 to-teal-500/90 text-white overflow-hidden">
        <div className="absolute inset-0 bg-zinc-900/50"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-20">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl mb-6">
              <HelpCircle className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              How can we help you today?
            </h1>
            <p className="text-xl text-emerald-100 mb-8">
              Find answers, get support, or contact our team
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for answers, features, or issues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder-emerald-100 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-emerald-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-emerald-600 transition-colors">
                  Search
                </button>
              </div>
              <p className="text-sm text-emerald-200 mt-3">
                Try: "How to boost an issue", "Track my report", "Change password"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-2xl p-6 hover:border-emerald-500/30 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Average Resolution Time</p>
                <p className="text-2xl font-bold text-white">18.5 hours</p>
              </div>
              <Clock className="w-8 h-8 text-emerald-500" />
            </div>
          </div>
          <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-2xl p-6 hover:border-emerald-500/30 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Issues Resolved</p>
                <p className="text-2xl font-bold text-white">284,592+</p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
          </div>
          <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-2xl p-6 hover:border-emerald-500/30 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">User Satisfaction</p>
                <p className="text-2xl font-bold text-white">96.4%</p>
              </div>
              <Star className="w-8 h-8 text-emerald-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Contact & Quick Links */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Options */}
            <div className="bg-linear-to-br from-zinc-800 to-zinc-900 border border-zinc-700 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Contact Support
              </h2>
              <div className="space-y-4">
                {contactOptions.map((option, index) => (
                  <a
                    key={index}
                    href={option.link}
                    className="block p-4 rounded-xl border border-zinc-700 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${option.available ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-700 text-gray-400'}`}>
                        {option.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-white group-hover:text-emerald-400">
                            {option.title}
                          </h3>
                          <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-emerald-400 rotate-270" />
                        </div>
                        <p className="text-sm text-gray-400 mt-1">{option.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Clock className="w-3 h-3 text-gray-500" />
                          <span className="text-xs text-gray-500">{option.response}</span>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-linear-to-br from-zinc-800 to-zinc-900 border border-zinc-700 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Quick Links</h2>
              <div className="grid grid-cols-2 gap-3">
                {quickLinks.map((link, index) => (
                  <Link
                    key={index}
                    to={link.link}
                    className="flex flex-col items-center justify-center p-4 rounded-xl border border-zinc-700 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-colors group"
                  >
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 mb-2 group-hover:bg-emerald-500/20 group-hover:text-emerald-300">
                      {link.icon}
                    </div>
                    <span className="text-sm font-medium text-white text-center group-hover:text-emerald-400">
                      {link.title}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Tutorials */}
            <div className="bg-linear-to-br from-zinc-800 to-zinc-900 border border-zinc-700 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Quick Tutorials</h2>
              <div className="space-y-3">
                {tutorials.map((tutorial, index) => (
                  <a
                    key={index}
                    href="#"
                    className="flex items-center justify-between p-3 rounded-lg border border-zinc-700 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded bg-zinc-700 text-gray-400 group-hover:bg-emerald-500/10 group-hover:text-emerald-400">
                        {tutorial.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-white group-hover:text-emerald-400">
                          {tutorial.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-500">{tutorial.type}</span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">{tutorial.duration}</span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-emerald-400" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - FAQ */}
          <div className="lg:col-span-2">
            <div className="bg-linear-to-br from-zinc-800 to-zinc-900 border border-zinc-700 rounded-2xl overflow-hidden">
              {/* FAQ Header */}
              <div className="border-b border-zinc-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
                    <p className="text-gray-400 mt-1">Find quick answers to common questions</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">Still need help?</span>
                    <a href="#contact" className="text-emerald-400 font-medium hover:text-emerald-300">
                      Contact us →
                    </a>
                  </div>
                </div>
                
                {/* FAQ Categories */}
                <div className="flex flex-wrap gap-2 mt-6">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 ${activeTab === 'all' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-zinc-700 text-gray-300 hover:bg-zinc-600 border border-zinc-600'}`}
                  >
                    All Questions
                  </button>
                  {faqCategories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setActiveTab(category.id)}
                      className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 ${activeTab === category.id ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-zinc-700 text-gray-300 hover:bg-zinc-600 border border-zinc-600'}`}
                    >
                      {category.icon}
                      {category.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* FAQ Content */}
              <div className="p-6">
                <div className="space-y-6">
                  {faqCategories
                    .filter(cat => activeTab === 'all' || activeTab === cat.id)
                    .map(category => (
                      <div key={category.id} className="space-y-4">
                        {activeTab === 'all' && (
                          <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            {category.icon}
                            {category.title}
                          </h3>
                        )}
                        <div className="space-y-4">
                          {category.questions.map((item, index) => (
                            <div key={index} className="border border-zinc-700 rounded-xl p-5 hover:border-emerald-500/50 bg-zinc-800/30 transition-colors">
                              <details className="group">
                                <summary className="flex justify-between items-center cursor-pointer list-none">
                                  <span className="text-lg font-semibold text-white group-open:text-emerald-400">
                                    {item.q}
                                  </span>
                                  <ChevronDown className="w-5 h-5 text-gray-500 transform group-open:rotate-180 transition-transform" />
                                </summary>
                                <div className="mt-4 text-gray-300 leading-relaxed border-t border-zinc-700 pt-4">
                                  {item.a}
                                </div>
                              </details>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>

                {/* Still Have Questions */}
                <div className="mt-8 p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">Still have questions?</h3>
                      <p className="text-gray-400 mt-1">Can't find the answer you're looking for? Our support team is here to help.</p>
                    </div>
                    <div className="flex gap-3">
                      <a
                        href="#chat"
                        className="px-6 py-3 bg-emerald-500 text-white font-medium rounded-xl hover:bg-emerald-600 transition-colors flex items-center gap-2"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Start Live Chat
                      </a>
                      <a
                        href="mailto:support@citysahar.com"
                        className="px-6 py-3 bg-transparent text-emerald-400 font-medium rounded-xl border border-emerald-500/50 hover:bg-emerald-500/10 transition-colors flex items-center gap-2"
                      >
                        <Mail className="w-4 h-4" />
                        Send Email
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social & Community */}
            <div className="mt-8 bg-linear-to-br from-zinc-800 to-zinc-900 border border-zinc-700 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Join Our Community</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                      <Users className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">Community Forum</h3>
                      <p className="text-gray-400 text-sm mt-1">Connect with 50,000+ users, share tips, and get community support</p>
                      <a href="#forum" className="inline-flex items-center gap-1 text-emerald-400 font-medium mt-3 hover:text-emerald-300">
                        Visit Forum <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="p-5 bg-zinc-800/50 border border-zinc-700 rounded-xl">
                  <h3 className="font-bold text-white mb-3">Follow Us</h3>
                  <div className="flex gap-3">
                    {[
                      { icon: Facebook, name: 'Facebook' },
                      { icon: Twitter, name: 'Twitter' },
                      { icon: Instagram, name: 'Instagram' },
                      { icon: Linkedin, name: 'LinkedIn' }
                    ].map((social, index) => (
                      <a
                        key={index}
                        href="#"
                        className="p-3 bg-zinc-700 rounded-lg border border-zinc-600 text-gray-400 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-colors"
                        title={social.name}
                      >
                        <social.icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 bg-linear-to-r from-zinc-900 to-black border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Need enterprise support or custom solutions?
              </h2>
              <p className="text-gray-400 mb-6">
                Our enterprise team provides dedicated support, custom integrations, and advanced analytics for government agencies and large organizations.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#enterprise"
                  className="px-6 py-3 bg-emerald-500 text-white font-medium rounded-xl hover:bg-emerald-600 transition-colors flex items-center gap-2"
                >
                  Enterprise Solutions
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#demo"
                  className="px-6 py-3 bg-transparent text-white font-medium rounded-xl border border-white/30 hover:bg-white/10 transition-colors"
                >
                  Schedule a Demo
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default HelpSupport