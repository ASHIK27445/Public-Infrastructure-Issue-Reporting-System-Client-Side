import React from 'react';
import { MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">CommunityFix</span>
            </div>
            <p className="text-gray-400 mb-6">
              Empowering citizens to build better communities through transparent, efficient infrastructure issue reporting.
            </p>
            <div className="flex space-x-4">
              {['twitter', 'facebook', 'instagram', 'linkedin'].map((social) => (
                <a 
                  key={social}
                  href="#" 
                  className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-emerald-500 hover:text-white transition-all duration-300"
                >
                  <div className="w-6 h-6">{social.charAt(0).toUpperCase()}</div>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-xl mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {['Home', 'Report Issue', 'Browse Issues', 'How It Works', 'Features'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-xl mb-6">Resources</h4>
            <ul className="space-y-4">
              {['Blog', 'Help Center', 'Community Guidelines', 'Privacy Policy', 'Terms of Service'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                    {item}
                  </a>
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
              <button className="px-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-r-2xl hover:shadow-emerald-500/50 transition-all duration-300">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 text-sm mb-4 md:mb-0">
            © 2024 CommunityFix. All rights reserved.
          </div>
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <span>Built with ❤️ for better communities</span>
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