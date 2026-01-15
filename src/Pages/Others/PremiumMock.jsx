import React, { useState } from 'react';
import { 
  Crown, 
  Zap, 
  Shield, 
  CheckCircle, 
  Star, 
  Award,
  TrendingUp,
  Users,
  Clock,
  FileText,
  Bell,
  MapPin,
  Target,
  BarChart3,
  Globe,
  ShieldCheck,
  Rocket,
  Sparkles,
  CreditCard,
  Calendar,
  HelpCircle,
  X,
  ArrowRight
} from 'lucide-react';

const PremiumMock = () => {
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly',
      price: 299,
      period: 'month',
      popular: false,
      features: [
        'Unlimited issue submissions',
        'Priority support',
        'Advanced analytics',
        'Premium badge'
      ]
    },
    {
      id: 'yearly',
      name: 'Yearly',
      price: 2999,
      period: 'year',
      popular: true,
      discount: 'Save 16%',
      features: [
        'Everything in Monthly',
        'Early access to new features',
        'Dedicated account manager',
        'Custom reports'
      ]
    },
    {
      id: 'lifetime',
      name: 'Lifetime',
      price: 9999,
      period: 'once',
      popular: false,
      discount: 'Best value',
      features: [
        'Lifetime premium access',
        'VIP community access',
        'Personalized dashboard',
        'Priority for new features'
      ]
    }
  ];

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Priority Resolution",
      description: "Your issues get 3x faster response and resolution times."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Verified Status",
      description: "Get verified citizen badge that increases credibility."
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Advanced Analytics",
      description: "Track issue trends and community impact with detailed insights."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community Influence",
      description: "Your votes carry 2x weight in community decisions."
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: "Real-time Notifications",
      description: "Instant alerts for issue updates and community activity."
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Heatmap Access",
      description: "View issue density maps and hotspot analysis."
    }
  ];

  const stats = [
    { value: "3x", label: "Faster Resolution", icon: <Clock className="w-5 h-5" /> },
    { value: "95%", label: "Success Rate", icon: <CheckCircle className="w-5 h-5" /> },
    { value: "24/7", label: "Priority Support", icon: <ShieldCheck className="w-5 h-5" /> },
    { value: "∞", label: "Issue Submissions", icon: <FileText className="w-5 h-5" /> }
  ];

  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Community Leader",
      text: "The premium features transformed how I engage with city services. Worth every penny!",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      rating: 5
    },
    {
      name: "Sarah Williams",
      role: "Business Owner",
      text: "Priority resolution helped get critical infrastructure fixed within 24 hours.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/20 via-teal-900/20 to-cyan-900/20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.15),transparent_50%)]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 py-24 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-full mb-6">
              <Crown className="w-5 h-5 text-yellow-400 mr-2" />
              <span className="text-yellow-400 font-semibold text-sm uppercase tracking-wider">
                Premium Membership
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
              Level Up Your <span className="bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 bg-clip-text text-transparent">Community Impact</span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
              Join thousands of proactive citizens who are accelerating change with premium tools and priority access.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-2xl font-bold text-lg text-white shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-3">
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl font-bold text-lg text-white hover:bg-white/20 transition-all duration-300">
                View Plans
              </button>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="bg-zinc-900/50 backdrop-blur-sm rounded-3xl p-6 border border-zinc-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl md:text-4xl font-black text-white">{stat.value}</div>
                  <div className="text-yellow-400">{stat.icon}</div>
                </div>
                <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
              Premium <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Features</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to maximize your community impact and get faster results.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl p-8 border border-zinc-700 hover:border-yellow-500/50 transition-all duration-500">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-2xl flex items-center justify-center text-yellow-400 mb-6 group-hover:scale-110 transition-transform duration-500">
                  {feature.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-yellow-400 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20 px-6 bg-gradient-to-b from-zinc-900 to-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 mb-6">
              <span className="text-yellow-400 font-semibold text-sm uppercase tracking-wider">
                Simple Pricing
              </span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
              Choose Your <span className="bg-gradient-to-r from-yellow-500 to-amber-500 bg-clip-text text-transparent">Plan</span>
            </h2>
            
            <div className="flex items-center justify-center space-x-4 mb-12">
              <button
                onClick={() => setSelectedPlan('monthly')}
                className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 ${
                  selectedPlan === 'monthly'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-zinc-800 text-gray-400 hover:text-white'
                }`}
              >
                Monthly
              </button>
              
              <button
                onClick={() => setSelectedPlan('yearly')}
                className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 ${
                  selectedPlan === 'yearly'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-zinc-800 text-gray-400 hover:text-white'
                }`}
              >
                Yearly
              </button>
              
              <button
                onClick={() => setSelectedPlan('lifetime')}
                className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 ${
                  selectedPlan === 'lifetime'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-zinc-800 text-gray-400 hover:text-white'
                }`}
              >
                Lifetime
              </button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-8 border-2 transition-all duration-500 hover:scale-105 ${
                  plan.popular
                    ? 'bg-gradient-to-br from-yellow-900/30 to-amber-900/30 border-yellow-500/50'
                    : 'bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full text-white font-bold text-sm shadow-lg">
                      MOST POPULAR
                    </div>
                  </div>
                )}
                
                <div className="mb-8">
                  <h3 className="text-2xl font-black text-white mb-2">{plan.name}</h3>
                  {plan.discount && (
                    <div className="inline-block px-3 py-1 bg-emerald-500/20 rounded-full text-emerald-400 text-xs font-bold mb-3">
                      {plan.discount}
                    </div>
                  )}
                  
                  <div className="flex items-baseline mb-2">
                    <span className="text-5xl font-black text-white">৳{plan.price}</span>
                    <span className="text-gray-400 ml-2">/{plan.period}</span>
                  </div>
                  
                  <p className="text-gray-400 text-sm">
                    Billed {plan.period === 'once' ? 'once' : `per ${plan.period}`}
                  </p>
                </div>
                
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white hover:shadow-yellow-500/50'
                      : 'bg-zinc-700 text-white hover:bg-zinc-600'
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
              Loved by <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Thousands</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              See what our premium members are saying about their experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl p-8 border border-zinc-700">
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500 mr-1" />
                  ))}
                </div>
                
                <p className="text-gray-300 italic mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>
                
                <div className="flex items-center space-x-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full border-2 border-yellow-500"
                  />
                  <div>
                    <div className="font-bold text-white">{testimonial.name}</div>
                    <div className="text-yellow-400 text-sm font-medium">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl p-12 border border-zinc-700">
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Rocket className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Ready to Make a Bigger Impact?
            </h2>
            
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Join thousands of citizens who are actively shaping their communities with premium tools.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setShowPaymentModal(true)}
                className="group px-10 py-5 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-2xl font-bold text-lg text-white shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-3"
              >
                <CreditCard className="w-5 h-5" />
                <span>Subscribe Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="px-10 py-5 bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl font-bold text-lg text-white hover:bg-white/20 transition-all duration-300">
                Start 7-Day Free Trial
              </button>
            </div>
            
            <p className="text-gray-500 text-sm mt-6">
              No credit card required for free trial. Cancel anytime.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 border-t border-zinc-800">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Frequently Asked <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Questions</span>
            </h2>
          </div>
          
          <div className="space-y-4">
            {[
              {
                q: "Can I cancel my subscription anytime?",
                a: "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period."
              },
              {
                q: "Is there a free trial?",
                a: "Yes! We offer a 7-day free trial with full access to all premium features. No credit card required."
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit/debit cards, mobile banking, and popular digital wallets."
              },
              {
                q: "Can I upgrade or downgrade my plan?",
                a: "Yes, you can change your plan at any time. Changes will be reflected in your next billing cycle."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">{faq.q}</h3>
                    <p className="text-gray-400">{faq.a}</p>
                  </div>
                  <HelpCircle className="w-6 h-6 text-emerald-500 shrink-0 ml-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowPaymentModal(false)}
          />
          
          <div className="relative bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-3xl border border-zinc-700 max-w-md w-full p-8 shadow-2xl">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-zinc-800 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-black text-white mb-2">Complete Your Subscription</h3>
              <p className="text-gray-400">Enter your payment details to get started</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm mb-2">CVC</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm mb-2">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                />
              </div>
              
              <div className="pt-4 border-t border-zinc-700">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400">Total</span>
                  <span className="text-2xl font-black text-white">৳2,999</span>
                </div>
                
                <button className="w-full py-4 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-2xl text-white font-bold text-lg hover:shadow-yellow-500/50 transition-all duration-300">
                  Pay ৳2,999
                </button>
                
                <p className="text-gray-500 text-xs text-center mt-4">
                  By subscribing, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PremiumMock;