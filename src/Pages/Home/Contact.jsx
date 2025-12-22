import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <section className="py-32 px-6 bg-gradient-to-b from-zinc-900 to-zinc-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 mb-6">
            <span className="text-emerald-400 font-semibold text-sm uppercase tracking-wider">Contact</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6">
            Get In <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Touch</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Have questions or need support? Our team is here to help you make a difference in your community.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="group bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl p-8 border border-zinc-700 hover:border-emerald-500/50 transition-all duration-500">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-500">
                  <Phone className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Call Us</h3>
                  <p className="text-gray-400 mb-2">Available 24/7 for emergency issues</p>
                  <a href="tel:+18001234567" className="text-emerald-400 text-xl font-bold hover:text-emerald-300 transition-colors">
                    +1 (800) 123-4567
                  </a>
                </div>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl p-8 border border-zinc-700 hover:border-emerald-500/50 transition-all duration-500">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-500">
                  <Mail className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Email Us</h3>
                  <p className="text-gray-400 mb-2">We'll respond within 2 hours</p>
                  <a href="mailto:support@communityfix.com" className="text-emerald-400 text-xl font-bold hover:text-emerald-300 transition-colors">
                    support@communityfix.com
                  </a>
                </div>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl p-8 border border-zinc-700 hover:border-emerald-500/50 transition-all duration-500">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-500">
                  <MapPin className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Visit Us</h3>
                  <p className="text-gray-400 mb-2">Monday - Friday, 9AM - 6PM</p>
                  <div className="text-gray-300">
                    123 Civic Center Drive<br />
                    Suite 500<br />
                    Your City, State 12345
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl p-8 border border-zinc-700 hover:border-emerald-500/50 transition-all duration-500">
            <h3 className="text-2xl font-bold text-white mb-6">Send us a message</h3>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 mb-2">First Name</label>
                  <input 
                    type="text" 
                    className="w-full px-6 py-4 bg-zinc-800 border border-zinc-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Last Name</label>
                  <input 
                    type="text" 
                    className="w-full px-6 py-4 bg-zinc-800 border border-zinc-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full px-6 py-4 bg-zinc-800 border border-zinc-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Message</label>
                <textarea 
                  rows="4"
                  className="w-full px-6 py-4 bg-zinc-800 border border-zinc-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                  placeholder="How can we help you improve your community?"
                />
              </div>
              <button 
                type="submit"
                className="w-full px-8 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl font-bold text-lg text-white hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-[1.02]"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;