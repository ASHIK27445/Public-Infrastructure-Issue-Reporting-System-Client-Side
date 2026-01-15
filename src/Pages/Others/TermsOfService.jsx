import React, { useState } from 'react';
import { NavLink } from 'react-router';
import { 
  Shield, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Calendar, 
  User,
  Globe,
  Lock,
  Mail,
  Bell,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const TermsOfService = () => {
  const [openSections, setOpenSections] = useState({
    acceptance: false,
    userAccounts: false,
    content: false,
    privacy: false,
    termination: false,
    liability: false,
    changes: false
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const sections = [
    {
      id: 'acceptance',
      title: '1. Acceptance of Terms',
      icon: <CheckCircle className="w-6 h-6" />,
      content: `By accessing and using the Public Infrastructure Issue Reporting System ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions, you may not access or use our services. These terms apply to all visitors, users, and others who access or use the Service.`
    },
    {
      id: 'userAccounts',
      title: '2. User Accounts & Responsibilities',
      icon: <User className="w-6 h-6" />,
      content: `When you create an account with us, you must provide accurate, complete, and current information. You are responsible for safeguarding the password and for all activities that occur under your account. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account. Users must be at least 18 years old to use this Service.`
    },
    {
      id: 'content',
      title: '3. User-Generated Content',
      icon: <FileText className="w-6 h-6" />,
      content: `You retain ownership of any content you submit, post, or display on or through the Service. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and distribute such content. You agree not to post content that: (a) is illegal, threatening, or harassing; (b) infringes any intellectual property rights; (c) contains viruses or malicious code; (d) is false or misleading.`
    },
    {
      id: 'privacy',
      title: '4. Privacy & Data Protection',
      icon: <Lock className="w-6 h-6" />,
      content: `Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information. By using the Service, you agree to the collection and use of information in accordance with our Privacy Policy. We implement reasonable security measures but cannot guarantee absolute security.`
    },
    {
      id: 'termination',
      title: '5. Account Termination',
      icon: <X className="w-6 h-6" />,
      content: `We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service.`
    },
    {
      id: 'liability',
      title: '6. Limitation of Liability',
      icon: <AlertTriangle className="w-6 h-6" />,
      content: `In no event shall CommunityFix, its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.`
    },
    {
      id: 'changes',
      title: '7. Changes to Terms',
      icon: <Calendar className="w-6 h-6" />,
      content: `We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.`
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900 py-12 px-4">
      <title>CommunityFix - Terms of Service</title>
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-3xl border border-emerald-500/30 mb-6">
            <Shield className="w-10 h-10 text-emerald-400" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
            Terms of <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Service</span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Last updated: December 28, 2024
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-8">
              {/* Introduction */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-white mb-4">Welcome to CommunityFix</h2>
                <p className="text-gray-300 leading-relaxed">
                  These Terms of Service govern your use of the Public Infrastructure Issue Reporting System 
                  operated by CommunityFix. By accessing or using our Service, you agree to be bound by these Terms. 
                  If you disagree with any part of the terms, you may not access the Service.
                </p>
              </div>

              {/* Toggleable Sections */}
              <div className="space-y-4">
                {sections.map((section) => (
                  <div key={section.id} className="border border-zinc-700 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex items-center justify-between p-6 bg-zinc-800/50 hover:bg-zinc-800 transition-colors text-left"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-emerald-500">
                          {section.icon}
                        </div>
                        <h3 className="text-xl font-bold text-white">{section.title}</h3>
                      </div>
                      {openSections[section.id] ? (
                        <ChevronUp className="w-6 h-6 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-gray-400" />
                      )}
                    </button>
                    
                    {openSections[section.id] && (
                      <div className="p-6 border-t border-zinc-700 bg-zinc-900/50">
                        <p className="text-gray-300 leading-relaxed">{section.content}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Contact Information */}
              <div className="mt-12 pt-8 border-t border-zinc-700">
                <h3 className="text-2xl font-bold text-white mb-6">Contact Us</h3>
                <p className="text-gray-300 mb-6">
                  If you have any questions about these Terms, please contact us:
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-4 p-4 bg-zinc-800/50 rounded-2xl border border-zinc-700">
                    <Mail className="w-6 h-6 text-emerald-500" />
                    <div>
                      <p className="text-gray-400 text-sm">Email</p>
                      <p className="text-white font-medium">legal@communityfix.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-zinc-800/50 rounded-2xl border border-zinc-700">
                    <Globe className="w-6 h-6 text-emerald-500" />
                    <div>
                      <p className="text-gray-400 text-sm">Website</p>
                      <p className="text-white font-medium">www.communityfix.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Info */}
          <div className="lg:col-span-1">
            {/* Quick Summary Card */}
            <div className="sticky top-8">
              <div className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 rounded-3xl border border-emerald-500/30 p-6 mb-6">
                <h3 className="text-xl font-bold text-white mb-4">Quick Summary</h3>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <span>Report infrastructure issues responsibly</span>
                  </li>
                  <li className="flex items-center space-x-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <span>Provide accurate information</span>
                  </li>
                  <li className="flex items-center space-x-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <span>Respect community guidelines</span>
                  </li>
                  <li className="flex items-center space-x-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <span>Keep your account secure</span>
                  </li>
                </ul>
              </div>

              {/* Important Notes */}
              <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-6 mb-6">
                <h3 className="text-xl font-bold text-white mb-4">Important Notes</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white font-medium mb-1">Legal Compliance</p>
                      <p className="text-gray-400 text-sm">Users must comply with all applicable laws and regulations.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Bell className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white font-medium mb-1">Updates</p>
                      <p className="text-gray-400 text-sm">We may update these terms periodically.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white font-medium mb-1">Data Protection</p>
                      <p className="text-gray-400 text-sm">Your data is protected according to our Privacy Policy.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Related Links */}
              <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-6">
                <h3 className="text-xl font-bold text-white mb-4">Related Documents</h3>
                <div className="space-y-3">
                  <NavLink
                    to="/privacy"
                    className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-xl hover:bg-zinc-700/50 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <Lock className="w-5 h-5 text-emerald-500" />
                      <span className="text-gray-300 group-hover:text-white">Privacy Policy</span>
                    </div>
                    <ChevronDown className="w-5 h-5 text-gray-500 transform -rotate-90" />
                  </NavLink>
                  
                  <NavLink
                    to="/community-guidelines"
                    className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-xl hover:bg-zinc-700/50 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-emerald-500" />
                      <span className="text-gray-300 group-hover:text-white">Community Guidelines</span>
                    </div>
                    <ChevronDown className="w-5 h-5 text-gray-500 transform -rotate-90" />
                  </NavLink>
                  
                  <NavLink
                    to="/cookies"
                    className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-xl hover:bg-zinc-700/50 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5 text-emerald-500" />
                      <span className="text-gray-300 group-hover:text-white">Cookie Policy</span>
                    </div>
                    <ChevronDown className="w-5 h-5 text-gray-500 transform -rotate-90" />
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Acceptance Section */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-8 max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
              <h3 className="text-2xl font-bold text-white">Acceptance Acknowledgement</h3>
            </div>
            
            <p className="text-gray-300 mb-8 leading-relaxed">
              By accessing or using our Service, you acknowledge that you have read, understood, 
              and agree to be bound by these Terms of Service. If you do not agree to these Terms, 
              you must not use our Service.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NavLink
                to="/"
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl font-bold text-white hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105"
              >
                Return to Home
              </NavLink>
              
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-8 py-4 bg-zinc-700 border border-zinc-600 rounded-2xl font-bold text-white hover:bg-zinc-600 transition-colors"
              >
                Back to Top
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2024 CommunityFix. All rights reserved. These Terms of Service are effective as of December 28, 2024.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;