import React from 'react';
import { Link } from 'react-router';
import { Facebook, Instagram, Linkedin, MapPin, Twitter } from 'lucide-react';

const Footer = () => {
  // Social media links (external URLs)
  const socialMediaLinks = [
    { name: 'twitter', url: 'https://twitter.com', icon: Twitter },
    { name: 'facebook', url: 'https://facebook.com', icon: Facebook},
    { name: 'instagram', url: 'https://instagram.com', icon: Instagram },
    { name: 'linkedin', url: 'https://linkedin.com', icon: Linkedin }
  ];

  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-linear-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">CommunityFix</span>
            </Link>
            <p className="text-gray-400 mb-6">
              Empowering citizens to build better communities through transparent, efficient infrastructure issue reporting.
            </p>
            <div className="flex space-x-4">
              {socialMediaLinks.map(({ name, url, icon: Icon }) => {
                // Define different colors for each social media
                const colorMap = {
                  twitter: 'hover:bg-sky-500 hover:text-white',
                  facebook: 'hover:bg-blue-600 hover:text-white',
                  instagram: 'hover:bg-pink-600 hover:text-white',
                  linkedin: 'hover:bg-blue-700 hover:text-white'
                };
                
                return (
                  <a
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center text-gray-400 transition-all duration-300 ${colorMap[name]}`}
                  >
                    <Icon className="w-6 h-6" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-xl mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {[
                { name: 'Home', path: '/' },
                { name: 'Report Issue', path: 'dashboard/dashboard/addissues' },
                { name: 'Browse Issues', path: '/allissues' },
                { name: 'How It Works', path: '/how-it-works' },
                { name: 'Features', path: '/features' }
              ].map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.path} 
                    className="text-gray-400 hover:text-emerald-400 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-xl mb-6">Resources</h4>
            <ul className="space-y-4">
              {[
                { name: 'Blog', path: '/blog' },
                { name: 'Help Center', path: '/help-center' },
                { name: 'Community Guidelines', path: '/community-guidelines' },
                { name: 'Privacy Policy', path: '/privacy-policy' },
                { name: 'Terms of Service', path: '/terms-of-services' }
              ].map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.path} 
                    className="text-gray-400 hover:text-emerald-400 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-xl mb-6">Stay Updated</h4>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for the latest updates and community success stories.
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email"
                className="flex-1 px-6 py-4 bg-zinc-800 border border-zinc-700 rounded-l-2xl text-white placeholder-gray-500 focus:outline-none"
              />
              <button className="px-6 bg-linear-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-r-2xl hover:shadow-emerald-500/50 transition-all duration-300">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 text-sm mb-4 md:mb-0">
            © 2025 ASH. All rights reserved.
          </div>
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <span>Built by AI Ashik with ❤️ for better communities</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span>All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;