import React, { use, useState } from 'react';
import { 
  Crown,
  CheckCircle,
  Zap,
  Shield,
  Infinity,
  Users,
  CreditCard,
  ArrowRight,
  Star,
  Clock,
  BarChart3,
  ShieldCheck,
  Gift,
  Rocket,
  Loader2
} from 'lucide-react';
import { AuthContext } from '../AuthProvider/AuthContext';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import useAxiosSecure from '../../Hooks/useAxiosSecure';

const LifetimePremium = () => {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const {user, mUser} = use(AuthContext)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const navigate = useNavigate()
  const axiosSecure = useAxiosSecure()

  const features = [
    {
      icon: <Infinity className="w-5 h-5" />,
      title: "Unlimited Reports",
      desc: "Submit as many issues as you want, forever"
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Priority Support",
      desc: "24/7 dedicated support team"
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: "Advanced Dashboard",
      desc: "Exclusive analytics and insights"
    },
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      title: "Verified Citizen",
      desc: "Premium badge and credibility"
    }
  ];

  const testimonials = [
    {
      name: "Rahim Ali",
      role: "Community Leader",
      text: "Bought lifetime premium during last year's offer. Best decision ever!",
      rating: 5
    },
    {
      name: "Tasnim Rahman",
      role: "Local Business Owner",
      text: "Unlimited reports helped me fix 15+ issues in my area.",
      rating: 5
    }
  ];

  const handleSubscribe = () => {
    if(!user){
      return navigate('/login')
    }
    if(mUser.isBlocked){
      toast.error('Citizen is blocked!')
      return
    }
    if(mUser.isPremium){
        toast.error('Citizen is Premium Member!')
        return
    }
    setPaymentLoading(true)
    axiosSecure.post('/create-checkout-session', {type: 'premium'})
      .then(res => {
        window.location.href = res.data.sessionURL
      }).catch(err=> console.log(err))
        .finally(()=> setPaymentLoading(false))
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-950 to-zinc-900">
      {/* Header */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <Crown className="w-6 h-6 text-yellow-500" />
            <span className="text-yellow-500 font-medium">Lifetime Premium</span>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-3">
            One-Time Payment, Lifetime Access
          </h1>
          <p className="text-gray-400">
            Last year ৳2000, now only ৳1000 - Limited time offer
          </p>
        </div>

        {/* Discount Banner */}
        <div className="bg-linear-to-r from-emerald-900/30 to-teal-900/30 border border-emerald-500/30 rounded-xl p-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Gift className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="text-white font-medium">50% OFF</div>
                <div className="text-emerald-300 text-sm">From last year's price</div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-gray-400 text-sm line-through">৳2000</div>
              <div className="text-2xl font-bold text-white">৳1000</div>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-zinc-800/30 border border-zinc-700 rounded-xl p-6 mb-8">
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-white mb-2">
              ৳1000
            </div>
            <div className="text-gray-400">
              One-time payment • Lifetime access
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                <div className="text-emerald-500">
                  {feature.icon}
                </div>
                <div>
                  <div className="text-white font-medium">{feature.title}</div>
                  <div className="text-gray-400 text-sm">{feature.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Upgrade Button */}
          <button 
            onClick={() => setIsPurchasing(true)}
            className="w-full py-3 bg-linear-to-r from-yellow-500 to-amber-500 rounded-lg text-white font-bold hover:shadow-lg transition-shadow flex items-center justify-center gap-2 cursor-pointer"
          >
            <CreditCard className="w-5 h-5" />
            Get Lifetime Premium
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* What You Get */}
        <div className="mb-8">
          <h3 className="text-white font-bold mb-4">Everything Included:</h3>
          
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-white">Unlimited issue submissions</span>
            </div>
            
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-white">24/7 priority support</span>
            </div>
            
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-white">Exclusive dashboard analytics</span>
            </div>
            
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-white">Premium citizen badge</span>
            </div>
            
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-white">Early access to new features</span>
            </div>
            
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-white">No renewal fees - ever</span>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-8">
          <h3 className="text-white font-bold mb-4">What Members Say:</h3>
          
          <div className="space-y-4">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-zinc-800/30 border border-zinc-700 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                
                <p className="text-gray-300 italic mb-3 text-sm">
                  "{testimonial.text}"
                </p>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-linear-to-r from-blue-500 to-cyan-500 rounded-full" />
                  <div>
                    <div className="text-white font-medium">{testimonial.name}</div>
                    <div className="text-gray-400 text-xs">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-8">
          <h3 className="text-white font-bold mb-4">Questions & Answers:</h3>
          
          <div className="space-y-3">
            <div className="border-b border-zinc-700 pb-3">
              <div className="text-white mb-1">Is this really lifetime?</div>
              <div className="text-gray-400 text-sm">Yes. One payment, access forever. No renewal fees.</div>
            </div>
            
            <div className="border-b border-zinc-700 pb-3">
              <div className="text-white mb-1">What happens to my existing reports?</div>
              <div className="text-gray-400 text-sm">All your existing reports stay. You can submit unlimited new ones.</div>
            </div>
            
            <div>
              <div className="text-white mb-1">How long is this price available?</div>
              <div className="text-gray-400 text-sm">Limited time offer. Price may increase in the future.</div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <div className="mb-4">
            <div className="text-white font-bold mb-1">Limited Time Offer</div>
            <div className="text-gray-400 text-sm">Last year: ৳2000 • Now: ৳1000</div>
          </div>
          
          <button 
            onClick={() => setIsPurchasing(true)}
            className="inline-flex items-center gap-2 px-8 py-3 bg-linear-to-r from-emerald-500 to-teal-500 rounded-lg text-white font-bold hover:shadow-lg transition-shadow mb-3 cursor-pointer"
          >
            <Rocket className="w-5 h-5" />
            Get Lifetime Access Now
          </button>
          
          <p className="text-gray-500 text-xs">
            One-time payment • Lifetime access • No hidden fees
          </p>
        </div>
      </div>

      {/* Payment Modal */}
      {isPurchasing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70">
          <div className="bg-linear-to-br from-zinc-900 to-zinc-800 rounded-xl border border-zinc-700 max-w-md w-full p-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Complete Payment</h3>
              <p className="text-gray-400">Pay once, get lifetime premium</p>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between mb-4">
                <span className="text-gray-400">Lifetime Premium</span>
                <span className="text-white font-bold">৳1000</span>
              </div>
              
              <div className="bg-zinc-800/50 rounded-lg p-4 mb-4">
                <div className="text-center text-emerald-400 font-medium mb-2">
                  50% OFF from last year
                </div>
                <div className="text-center text-sm text-gray-400">
                  Original price: <span className="line-through">৳2000</span>
                </div>
              </div>
            </div>
            
            <button 
            onClick={handleSubscribe}
            disabled={paymentLoading || mUser?.isPremium || mUser?.isBlocked}
            className=" flex items-center justify-center
             w-full py-3 bg-linear-to-r from-yellow-500 to-amber-500 rounded-lg
             text-white font-bold mb-4 disabled:cursor-not-allowed hover:opacity-90 cursor-pointer">
              {paymentLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Processing...</span>
                  </> ) : (
                  <>
                    <CreditCard className="w-6 h-6 pr-1.5" />
                    <span>Pay ৳1000 Now</span>
                  </>)}
            </button>
            
            <button 
              onClick={() => setIsPurchasing(false)}
              className="w-full py-3 border border-zinc-700 rounded-lg text-gray-400 hover:text-white transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LifetimePremium;