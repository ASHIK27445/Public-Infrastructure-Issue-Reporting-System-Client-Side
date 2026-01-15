import React, { useState } from 'react';
import { NavLink } from 'react-router';
import { 
  Shield, 
  Lock, 
  Eye, 
  Database, 
  Key, 
  User,
  Mail,
  Globe,
  ShieldCheck,
  FileText,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Calendar,
  Trash2,
  Bell,
  Share2,
  Server,
  Cookie
} from 'lucide-react';

const PrivacyPolicy = () => {
  const [openSections, setOpenSections] = useState({
    collection: false,
    usage: false,
    sharing: false,
    security: false,
    rights: false,
    cookies: false,
    children: false
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const sections = [
    {
      id: 'collection',
      title: '1. Information We Collect',
      icon: <Database className="w-6 h-6" />,
      content: `We collect several different types of information for various purposes to provide and improve our Service to you.

### Personal Data
While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). This may include, but is not limited to:
- Email address
- First name and last name
- Phone number
- Address, City, ZIP/Postal code
- Profile picture
- Usage Data and cookies

### Usage Data
We may also collect information on how the Service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g., IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.`
    },
    {
      id: 'usage',
      title: '2. How We Use Your Information',
      icon: <Eye className="w-6 h-6" />,
      content: `CommunityFix uses the collected data for various purposes:
- To provide and maintain our Service
- To notify you about changes to our Service
- To allow you to participate in interactive features of our Service when you choose to do so
- To provide customer support
- To gather analysis or valuable information so that we can improve our Service
- To monitor the usage of our Service
- To detect, prevent and address technical issues
- To provide you with news, special offers and general information about other goods, services and events which we offer that are similar to those that you have already purchased or enquired about unless you have opted not to receive such information`
    },
    {
      id: 'sharing',
      title: '3. Data Sharing & Disclosure',
      icon: <Share2 className="w-6 h-6" />,
      content: `We may share your personal information in the following situations:

### With Service Providers
We may share your personal information with Service Providers to monitor and analyze the use of our Service, to contact you.

### For Business Transfers
We may share or transfer your personal information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.

### With Your Consent
We may disclose your personal information for any other purpose with your consent.

### Legal Requirements
CommunityFix may disclose your Personal Data in the good faith belief that such action is necessary to:
- To comply with a legal obligation
- To protect and defend the rights or property of CommunityFix
- To prevent or investigate possible wrongdoing in connection with the Service
- To protect the personal safety of users of the Service or the public
- To protect against legal liability`
    },
    {
      id: 'security',
      title: '4. Data Security',
      icon: <ShieldCheck className="w-6 h-6" />,
      content: `The security of your data is important to us but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.

### Security Measures
We implement appropriate technical and organizational security measures designed to protect your personal data against accidental or unlawful destruction, loss, alteration, unauthorized disclosure, or access. These measures include:
- Encryption of data in transit using SSL/TLS
- Secure storage with access controls
- Regular security assessments
- Employee training on data protection
- Incident response procedures`
    },
    {
      id: 'rights',
      title: '5. Your Data Protection Rights',
      icon: <Key className="w-6 h-6" />,
      content: `Depending on your location, you may have the following rights regarding your personal data:

### Right to Access
You have the right to request copies of your personal data.

### Right to Rectification
You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.

### Right to Erasure
You have the right to request that we erase your personal data, under certain conditions.

### Right to Restrict Processing
You have the right to request that we restrict the processing of your personal data, under certain conditions.

### Right to Object to Processing
You have the right to object to our processing of your personal data, under certain conditions.

### Right to Data Portability
You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.

To exercise any of these rights, please contact us at privacy@communityfix.com.`
    },
    {
      id: 'cookies',
      title: '6. Cookies & Tracking Technologies',
      icon: <Cookie className="w-6 h-6" />,
      content: `We use cookies and similar tracking technologies to track the activity on our Service and we hold certain information.

### What Are Cookies
Cookies are files with a small amount of data which may include an anonymous unique identifier. Cookies are sent to your browser from a website and stored on your device. Other tracking technologies are also used such as beacons, tags, and scripts to collect and track information and to improve and analyze our Service.

### Types of Cookies We Use
- **Essential Cookies:** Necessary for the website to function
- **Performance Cookies:** Help us understand how visitors interact with our website
- **Functionality Cookies:** Allow the website to remember choices you make
- **Advertising Cookies:** Used to deliver relevant advertisements

You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.`
    },
    {
      id: 'children',
      title: '7. Children\'s Privacy',
      icon: <User className="w-6 h-6" />,
      content: `Our Service does not address anyone under the age of 18 ("Children").

We do not knowingly collect personally identifiable information from anyone under the age of 18. If you are a parent or guardian and you are aware that your child has provided us with Personal Data, please contact us. If we become aware that we have collected Personal Data from children without verification of parental consent, we take steps to remove that information from our servers.

We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.`
    }
  ];

  const dataRetention = {
    activeAccounts: 'As long as account is active',
    inactiveAccounts: '2 years after last login',
    paymentInfo: '7 years for legal compliance',
    analyticsData: '3 years aggregated',
    supportRequests: '5 years',
    deletedAccounts: '30 days then permanent deletion'
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900 py-12 px-4">
      <title>CommunityFix - Privacy Policy</title>
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-3xl border border-blue-500/30 mb-6">
            <Lock className="w-10 h-10 text-blue-400" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
            Privacy <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">Policy</span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Last updated: December 28, 2024
          </p>
        </div>

        {/* Quick Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-3xl border border-blue-500/30 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <ShieldCheck className="w-8 h-8 text-blue-400" />
              <h3 className="text-xl font-bold text-white">Your Privacy Matters</h3>
            </div>
            <p className="text-gray-300">
              We are committed to protecting your personal information and being transparent about how we use it.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 rounded-3xl border border-emerald-500/30 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
              <h3 className="text-xl font-bold text-white">Transparent Practices</h3>
            </div>
            <p className="text-gray-300">
              We clearly explain what data we collect, why we collect it, and how you can control it.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-3xl border border-purple-500/30 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Key className="w-8 h-8 text-purple-400" />
              <h3 className="text-xl font-bold text-white">Your Control</h3>
            </div>
            <p className="text-gray-300">
              You have rights to access, correct, delete, and control how your data is used.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-8">
              {/* Introduction */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-white mb-4">Introduction</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  At CommunityFix ("we", "us", or "our"), we operate the Public Infrastructure Issue Reporting System (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  We use your data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this policy.
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
                        <div className="text-blue-500">
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
                        <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                          {section.content}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Data Retention Table */}
              <div className="mt-12 pt-8 border-t border-zinc-700">
                <h3 className="text-2xl font-bold text-white mb-6">Data Retention Periods</h3>
                <div className="bg-zinc-900/50 rounded-2xl border border-zinc-700 overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-zinc-700">
                        <th className="text-left py-4 px-6 text-gray-400 font-medium">Data Type</th>
                        <th className="text-left py-4 px-6 text-gray-400 font-medium">Retention Period</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(dataRetention).map(([key, value]) => (
                        <tr key={key} className="border-b border-zinc-700 last:border-b-0 hover:bg-zinc-800/50 transition-colors">
                          <td className="py-4 px-6 text-gray-300 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</td>
                          <td className="py-4 px-6 text-white font-medium">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Info */}
          <div className="lg:col-span-1">
            {/* Contact Card */}
            <div className="sticky top-8">
              <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-3xl border border-blue-500/30 p-6 mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Mail className="w-6 h-6 text-blue-400" />
                  <h3 className="text-xl font-bold text-white">Contact Our DPO</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  For privacy-related questions or to exercise your data rights:
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-blue-400" />
                    <span className="text-white">privacy@communityfix.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-blue-400" />
                    <span className="text-white">Data Protection Officer</span>
                  </div>
                </div>
              </div>

              {/* Your Rights */}
              <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-6 mb-6">
                <h3 className="text-xl font-bold text-white mb-4">Your Rights</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Eye className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white font-medium mb-1">Right to Access</p>
                      <p className="text-gray-400 text-sm">View what data we have about you</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <FileText className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white font-medium mb-1">Right to Rectify</p>
                      <p className="text-gray-400 text-sm">Correct inaccurate information</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Trash2 className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white font-medium mb-1">Right to Delete</p>
                      <p className="text-gray-400 text-sm">Request deletion of your data</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Bell className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white font-medium mb-1">Right to Object</p>
                      <p className="text-gray-400 text-sm">Opt-out of certain processing</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Related Links */}
              <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-6">
                <h3 className="text-xl font-bold text-white mb-4">Related Documents</h3>
                <div className="space-y-3">
                  <NavLink
                    to="/terms"
                    className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-xl hover:bg-zinc-700/50 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-emerald-500" />
                      <span className="text-gray-300 group-hover:text-white">Terms of Service</span>
                    </div>
                    <ChevronDown className="w-5 h-5 text-gray-500 transform -rotate-90" />
                  </NavLink>
                  
                  <NavLink
                    to="/cookies"
                    className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-xl hover:bg-zinc-700/50 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <Cookie className="w-5 h-5 text-amber-500" />
                      <span className="text-gray-300 group-hover:text-white">Cookie Policy</span>
                    </div>
                    <ChevronDown className="w-5 h-5 text-gray-500 transform -rotate-90" />
                  </NavLink>
                  
                  <NavLink
                    to="/security"
                    className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-xl hover:bg-zinc-700/50 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-blue-500" />
                      <span className="text-gray-300 group-hover:text-white">Security Policy</span>
                    </div>
                    <ChevronDown className="w-5 h-5 text-gray-500 transform -rotate-90" />
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Policy Updates */}
        <div className="mt-12">
          <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-8 max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <AlertTriangle className="w-8 h-8 text-amber-500" />
              <h3 className="text-2xl font-bold text-white">Policy Updates</h3>
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed text-center">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
            
            <div className="flex items-center justify-center space-x-4 text-gray-400">
              <Calendar className="w-5 h-5" />
              <span>You are advised to review this Privacy Policy periodically for any changes.</span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2024 CommunityFix. All rights reserved. This Privacy Policy complies with GDPR, CCPA, and other data protection regulations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;