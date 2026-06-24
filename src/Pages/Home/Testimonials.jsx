import React from 'react';
import { Star, Quote, Users, CheckCircle, TrendingUp } from 'lucide-react';
import './testimonials.css';

const allTestimonials = [
  {
    name: "Robert Thompson",
    role: "Local Resident",
    text: "Reported a dangerous pothole and it was fixed within 48 hours. The transparency and real-time tracking are absolute game-changers!",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
    rating: 5,
  },
  {
    name: "Maria Garcia",
    role: "Community Leader",
    text: "Finally a system where we can see our tax dollars at work. Premium support is worth every penny for urgent community issues.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    rating: 5,
  },
  {
    name: "James Wilson",
    role: "Business Owner",
    text: "Infrastructure resolved quickly benefits everyone. This is exactly what modern cities need — professional, efficient, user-friendly.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
    rating: 5,
  },
  {
    name: "Priya Patel",
    role: "School Teacher",
    text: "The broken streetlights near our school were reported and fixed in days. Kids are safe now. This platform genuinely works.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    rating: 5,
  },
  {
    name: "David Kim",
    role: "Urban Planner",
    text: "From a professional standpoint, the issue categorisation and resolution workflow is impressively well-thought-out.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    rating: 5,
  },
  {
    name: "Aisha Rahman",
    role: "Volunteer Coordinator",
    text: "Organising community clean-ups has never been this easy. The event management tools are intuitive and powerful.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha",
    rating: 5,
  },
  {
    name: "Carlos Mendez",
    role: "Retired Engineer",
    text: "I've seen many civic apps come and go. This one actually listens and acts. Rare combination of simplicity and depth.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
    rating: 5,
  },
  {
    name: "Emily Chen",
    role: "Neighbourhood Watch",
    text: "Illegal dumping in our park was documented, assigned, and cleared in under a week. Remarkable coordination.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    rating: 5,
  },
];

// Split into two rows
const row1 = allTestimonials.slice(0, 4);
const row2 = allTestimonials.slice(4, 8);

const stats = [
  { value: '12,400+', label: 'Issues Resolved', icon: CheckCircle },
  { value: '98%',     label: 'Satisfaction Rate', icon: TrendingUp },
  { value: '3,200+',  label: 'Active Volunteers', icon: Users },
];

/* ---- Single card ---- */
const TestimonialCard = ({ testimonial }) => (
  <div className="testimonial-card">
    {/* Stars */}
    <div className="testimonial-stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < testimonial.rating
              ? 'fill-emerald-500 text-emerald-500'
              : 'text-zinc-700'
          }`}
        />
      ))}
    </div>

    {/* Quote body */}
    <p className="testimonial-body">"{testimonial.text}"</p>

    {/* Footer */}
    <div className="testimonial-footer">
      <div className="testimonial-avatar-ring">
        <img src={testimonial.avatar} alt={testimonial.name} />
      </div>
      <div>
        <div className="testimonial-name">{testimonial.name}</div>
        <div className="testimonial-role">{testimonial.role}</div>
      </div>
    </div>
  </div>
);

/* ---- Marquee row ---- */
const MarqueeRow = ({ items, reverse = false }) => {
  // Duplicate for seamless loop
  const doubled = [...items, ...items];

  return (
    <div className="testimonials-marquee-outer mb-6">
      <div
        className={`testimonials-marquee-track ${
          reverse ? 'testimonials-marquee-track--reverse' : ''
        }`}
      >
        {doubled.map((t, i) => (
          <TestimonialCard key={i} testimonial={t} />
        ))}
      </div>
    </div>
  );
};

/* ---- Main section ---- */
const Testimonials = () => (
  <section className="py-28 bg-zinc-900 overflow-hidden">
    {/* Header */}
    <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
      <div className="testimonials-badge">
        <Quote className="w-3.5 h-3.5 text-emerald-400" />
        <span>Testimonials</span>
      </div>

      <h2 className="text-5xl md:text-6xl font-black text-white leading-tight mb-4">
        Trusted by{' '}
        <span className="bg-linear-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
          Real Citizens
        </span>
      </h2>
      <p className="text-lg text-zinc-400 max-w-xl mx-auto">
        Thousands of communities are already using CommunityFix to make change happen.
      </p>
    </div>

    {/* Marquee rows */}
    <MarqueeRow items={row1} />
    <MarqueeRow items={row2} reverse />

    {/* Stats strip */}
    <div className="max-w-7xl mx-auto px-6">
      <div className="testimonials-stats">
        {stats.map(({ value, label, icon: Icon }) => (
          <div key={label} className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Icon className="w-4 h-4 text-emerald-500" />
              <div className="testimonials-stat-value">{value}</div>
            </div>
            <div className="testimonials-stat-label">{label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;