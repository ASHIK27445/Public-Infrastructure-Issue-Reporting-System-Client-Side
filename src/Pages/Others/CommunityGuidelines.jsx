import React, { useState } from 'react';
import { NavLink } from 'react-router';
import { 
  Users, 
  Heart, 
  Flag, 
  MessageSquare,
  Shield,
  Star,
  ThumbsUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  HandHeart,
  Globe,
  Target,
  Award,
  Clock,
  Filter,
  ChevronDown,
  ChevronUp,
  Mail,
  Bell
} from 'lucide-react';

const CommunityGuidelines = () => {
  const [openSections, setOpenSections] = useState({
    respect: false,
    content: false,
    safety: false,
    reporting: false,
    moderation: false,
    consequences: false
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const guidelines = [
    {
      id: 'respect',
      title: '1. Respect & Civility',
      icon: <Heart className="w-6 h-6" />,
      color: 'from-pink-500 to-rose-500',
      points: [
        'Treat all community members with kindness and respect',
        'No hate speech, harassment, or discrimination of any kind',
        'Respect diverse opinions and engage in constructive dialogue',
        'Avoid personal attacks and focus on issues, not individuals',
        'Use inclusive language that welcomes all community members'
      ]
    },
    {
      id: 'content',
      title: '2. Quality Content',
      icon: <MessageSquare className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500',
      points: [
        'Provide accurate and verifiable information',
        'Include clear photos and specific location details',
        'Use descriptive titles and detailed descriptions',
        'One issue per report - avoid duplicate submissions',
        'Update progress and mark as resolved when appropriate'
      ]
    },
    {
      id: 'safety',
      title: '3. Safety & Legal Compliance',
      icon: <Shield className="w-6 h-6" />,
      color: 'from-emerald-500 to-teal-500',
      points: [
        'Do not post dangerous or illegal content',
        'Respect privacy - do not share personal information',
        'Follow all applicable laws and regulations',
        'Report emergencies to appropriate authorities first',
        'Do not interfere with ongoing repair work'
      ]
    },
    {
      id: 'reporting',
      title: '4. Responsible Reporting',
      icon: <Flag className="w-6 h-6" />,
      color: 'from-amber-500 to-orange-500',
      points: [
        'Verify information before reporting',
        'Provide constructive feedback, not complaints',
        'Use the correct categories for issues',
        'Be patient - resolution takes time',
        'Follow up appropriately without spamming'
      ]
    },
    {
      id: 'moderation',
      title: '5. Community Moderation',
      icon: <Users className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500',
      points: [
        'Upvote issues that matter to the community',
        'Provide helpful comments and suggestions',
        'Help verify information when possible',
        'Flag inappropriate content for review',
        'Support newcomers and guide them'
      ]
    }
  ];

  const prohibitedContent = [
    { type: 'False Information', icon: <XCircle className="w-5 h-5" />, description: 'Deliberately false or misleading reports' },
    { type: 'Spam', icon: <Filter className="w-5 h-5" />, description: 'Repeated identical or irrelevant content' },
    { type: 'Harassment', icon: <AlertTriangle className="w-5 h-5" />, description: 'Bullying, threats, or personal attacks' },
    { type: 'Discrimination', icon: <Globe className="w-5 h-5" />, description: 'Hate speech or exclusionary language' },
    { type: 'Privacy Violation', icon: <Shield className="w-5 h-5" />, description: 'Sharing others personal information' },
    { type: 'Commercial Content', icon: <TrendingUp className="w-5 h-5" />, description: 'Advertising or promotional material' }
  ];

  const positiveBehaviors = [
    { behavior: 'Helpful Comments', icon: <ThumbsUp className="w-5 h-5" />, impact: 'Guides others to better reporting' },
    { behavior: 'Issue Verification', icon: <CheckCircle className="w-5 h-5" />, impact: 'Improves report accuracy' },
    { behavior: 'Timely Updates', icon: <Clock className="w-5 h-5" />, impact: 'Keeps community informed' },
    { behavior: 'Welcoming New Users', icon: <HandHeart className="w-5 h-5" />, impact: 'Grows the community' },
    { behavior: 'Constructive Feedback', icon: <MessageSquare className="w-5 h-5" />, impact: 'Improves the platform' },
    { behavior: 'Issue Prioritization', icon: <Target className="w-5 h-5" />, impact: 'Focuses on urgent matters' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900 py-12 px-4">
      <title>CommunityFix - Community Guidelines</title>
      
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl border border-purple-500/30 mb-6">
            <Users className="w-12 h-12 text-purple-400" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
            Community <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Guidelines</span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Building a better community together through respect, responsibility, and collaboration
          </p>
        </div>

        {/* Core Principles */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-3xl border border-purple-500/30 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Heart className="w-8 h-8 text-purple-400" />
              <h3 className="text-xl font-bold text-white">Respect First</h3>
            </div>
            <p className="text-gray-300">
              Treat everyone with kindness and dignity. Our community thrives on mutual respect.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-3xl border border-blue-500/30 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-8 h-8 text-blue-400" />
              <h3 className="text-xl font-bold text-white">Safety & Trust</h3>
            </div>
            <p className="text-gray-300">
              A safe environment where everyone can participate without fear of harassment.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 rounded-3xl border border-emerald-500/30 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Target className="w-8 h-8 text-emerald-400" />
              <h3 className="text-xl font-bold text-white">Positive Impact</h3>
            </div>
            <p className="text-gray-300">
              Focus on constructive contributions that make our communities better.
            </p>
          </div>
        </div>

        {/* Main Guidelines */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column - Guidelines */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Our Community Standards</h2>
                <p className="text-gray-300 leading-relaxed">
                  These guidelines help us maintain a positive, productive environment where everyone can contribute to improving our communities. By participating, you agree to follow these standards.
                </p>
              </div>

              <div className="space-y-4">
                {guidelines.map((guideline) => (
                  <div key={guideline.id} className="border border-zinc-700 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => toggleSection(guideline.id)}
                      className="w-full flex items-center justify-between p-6 bg-zinc-800/50 hover:bg-zinc-800 transition-colors text-left"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`bg-gradient-to-r ${guideline.color} w-12 h-12 rounded-2xl flex items-center justify-center`}>
                          {guideline.icon}
                        </div>
                        <h3 className="text-xl font-bold text-white">{guideline.title}</h3>
                      </div>
                      {openSections[guideline.id] ? (
                        <ChevronUp className="w-6 h-6 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-gray-400" />
                      )}
                    </button>
                    
                    {openSections[guideline.id] && (
                      <div className="p-6 border-t border-zinc-700 bg-zinc-900/50">
                        <ul className="space-y-3">
                          {guideline.points.map((point, index) => (
                            <li key={index} className="flex items-start space-x-3">
                              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                              <span className="text-gray-300">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Prohibited Content */}
              <div className="mt-12 pt-8 border-t border-zinc-700">
                <h3 className="text-2xl font-bold text-white mb-6">Prohibited Content</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {prohibitedContent.map((item, index) => (
                    <div key={index} className="bg-zinc-800/50 rounded-2xl p-4 border border-zinc-700 hover:border-red-500/30 transition-colors">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="text-red-400">{item.icon}</div>
                        <h4 className="font-bold text-white">{item.type}</h4>
                      </div>
                      <p className="text-gray-400 text-sm">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Community Info */}
          <div className="lg:col-span-1">
            {/* Community Stats */}
            <div className="sticky top-8">
              <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-3xl border border-purple-500/30 p-6 mb-6">
                <h3 className="text-xl font-bold text-white mb-4">Community Impact</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Active Members</span>
                    <span className="text-white font-bold">16,432+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Issues Resolved</span>
                    <span className="text-white font-bold">24,891+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Community Score</span>
                    <span className="text-white font-bold">94% Positive</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Response Rate</span>
                    <span className="text-white font-bold">98.5%</span>
                  </div>
                </div>
              </div>

              {/* Positive Behaviors */}
              <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-6 mb-6">
                <h3 className="text-xl font-bold text-white mb-4">Positive Behaviors</h3>
                <div className="space-y-4">
                  {positiveBehaviors.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="text-emerald-500">{item.icon}</div>
                      <div>
                        <p className="text-white font-medium text-sm">{item.behavior}</p>
                        <p className="text-gray-400 text-xs">{item.impact}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recognition System */}
              <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 rounded-3xl border border-amber-500/30 p-6 mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Award className="w-6 h-6 text-amber-400" />
                  <h3 className="text-xl font-bold text-white">Recognition System</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Community Star</span>
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Rapid Responder</span>
                    <Clock className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Verified Helper</span>
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Community Leader</span>
                    <Users className="w-5 h-5 text-purple-500" />
                  </div>
                </div>
              </div>

              {/* Reporting & Support */}
              <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-6">
                <h3 className="text-xl font-bold text-white mb-4">Need Help?</h3>
                <div className="space-y-4">
                  <button className="w-full flex items-center justify-between p-3 bg-zinc-700/50 rounded-xl hover:bg-zinc-600/50 transition-colors group">
                    <div className="flex items-center space-x-3">
                      <Flag className="w-5 h-5 text-red-400" />
                      <span className="text-gray-300 group-hover:text-white">Report a Violation</span>
                    </div>
                    <ChevronDown className="w-5 h-5 text-gray-500 transform -rotate-90" />
                  </button>
                  
                  <button className="w-full flex items-center justify-between p-3 bg-zinc-700/50 rounded-xl hover:bg-zinc-600/50 transition-colors group">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-blue-400" />
                      <span className="text-gray-300 group-hover:text-white">Contact Moderators</span>
                    </div>
                    <ChevronDown className="w-5 h-5 text-gray-500 transform -rotate-90" />
                  </button>
                  
                  <NavLink
                    to="/faq"
                    className="w-full flex items-center justify-between p-3 bg-zinc-700/50 rounded-xl hover:bg-zinc-600/50 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <Bell className="w-5 h-5 text-amber-400" />
                      <span className="text-gray-300 group-hover:text-white">FAQs & Support</span>
                    </div>
                    <ChevronDown className="w-5 h-5 text-gray-500 transform -rotate-90" />
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enforcement & Consequences */}
        <div className="mb-12">
          <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <AlertTriangle className="w-8 h-8 text-amber-500" />
              <h2 className="text-2xl font-bold text-white">Enforcement & Consequences</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Our Process</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-400 text-sm font-bold">1</div>
                    <div>
                      <p className="text-white font-medium">Review</p>
                      <p className="text-gray-400 text-sm">Reported content is reviewed by moderators</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 text-sm font-bold">2</div>
                    <div>
                      <p className="text-white font-medium">Investigation</p>
                      <p className="text-gray-400 text-sm">Context and history are examined</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 text-sm font-bold">3</div>
                    <div>
                      <p className="text-white font-medium">Action</p>
                      <p className="text-gray-400 text-sm">Appropriate action is taken based on severity</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 text-sm font-bold">4</div>
                    <div>
                      <p className="text-white font-medium">Appeal</p>
                      <p className="text-gray-400 text-sm">Users can appeal decisions within 30 days</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Possible Actions</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-xl">
                    <span className="text-gray-300">Content Removal</span>
                    <span className="text-amber-400 font-bold">Minor</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-xl">
                    <span className="text-gray-300">Temporary Warning</span>
                    <span className="text-orange-400 font-bold">Moderate</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-xl">
                    <span className="text-gray-300">Account Suspension</span>
                    <span className="text-red-400 font-bold">Severe</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-xl">
                    <span className="text-gray-300">Permanent Ban</span>
                    <span className="text-red-500 font-bold">Repeated/Extreme</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Commitment Card */}
        <div className="mb-12">
          <div className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 rounded-3xl border border-emerald-500/30 p-8 max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <HandHeart className="w-8 h-8 text-emerald-400" />
              <h2 className="text-2xl font-bold text-white">Our Commitment to You</h2>
            </div>
            
            <p className="text-gray-300 mb-8 leading-relaxed text-center">
              We are committed to maintaining a welcoming, productive community where everyone can contribute to making our cities better. These guidelines exist to protect that vision and ensure CommunityFix remains a positive force for change.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NavLink
                to="/"
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl font-bold text-white hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105"
              >
                Return to Community
              </NavLink>
              
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-8 py-4 bg-zinc-700 border border-zinc-600 rounded-2xl font-bold text-white hover:bg-zinc-600 transition-colors"
              >
                Review Guidelines Again
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-2">
            © 2024 CommunityFix Community Guidelines
          </p>
          <p className="text-gray-600 text-xs">
            These guidelines are living documents and may be updated to better serve our community.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommunityGuidelines;