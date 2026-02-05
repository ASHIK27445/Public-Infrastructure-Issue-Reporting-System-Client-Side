import React from 'react';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Robert Thompson",
      role: "Local Resident",
      text: "This platform has completely transformed how we interact with city services. I reported a dangerous pothole on my street and it was fixed within 48 hours. The transparency and tracking features are game-changers!",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
      rating: 5
    },
    {
      name: "Maria Garcia",
      role: "Community Leader",
      text: "Finally, a transparent system where we can actually see our tax dollars at work. The premium support is absolutely worth it for urgent community issues. Highly recommended for every citizen!",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
      rating: 5
    },
    {
      name: "James Wilson",
      role: "Business Owner",
      text: "As a business owner, seeing infrastructure issues resolved quickly benefits everyone in the area. This system is exactly what modern cities need. Professional, efficient, and incredibly user-friendly.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
      rating: 5
    }
  ];

  return (
    <section className="py-32 px-6 bg-zinc-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-block px-6 py-2 rounded-full bg-linear-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 mb-6">
            <span className="text-emerald-400 font-semibold text-sm uppercase tracking-wider">Testimonials</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6">
            What Citizens <span className="bg-linear-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Say</span>
          </h2>
          <p className="text-xl text-gray-400">Real feedback from real people making real change</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="group relative bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl p-8 border border-zinc-700 hover:border-emerald-500/50 transition-all duration-500 hover:scale-105">
              <div className="absolute -top-5 left-8 w-16 h-16 bg-linear-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-xl">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full"
                />
              </div>
              
              <div className="flex mb-4 mt-6">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 ${i < testimonial.rating ? 'fill-emerald-500 text-emerald-500' : 'text-gray-700'}`} 
                  />
                ))}
              </div>
              
              <p className="text-gray-300 mb-8 leading-relaxed italic">"{testimonial.text}"</p>
              
              <div className="border-t border-zinc-700 pt-6">
                <div className="text-white font-bold text-lg">{testimonial.name}</div>
                <div className="text-emerald-400 text-sm font-medium">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;