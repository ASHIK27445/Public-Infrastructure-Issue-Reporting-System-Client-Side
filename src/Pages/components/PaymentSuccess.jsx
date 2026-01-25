import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useOutletContext, useSearchParams } from "react-router";
import { toast } from "react-toastify";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);
  const axiosSecure = useAxiosSecure()
  const {refreshCitizen} = useOutletContext()

  const hasProcessed = useRef(false)

  useEffect(() => {
    if(hasProcessed.current) return;

    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      toast.error("No payment session found");
      navigate("/dashboard/dashboard/myProfile");
      return;
    }

    // Mark as processed
    hasProcessed.current = true
    
    axiosSecure.get(`/verify-payment/${sessionId}`)
      .then(res => {
        // console.log('Backend res:', res.data);
        
        if (res.data.success && res.data.paid) {
          setPaymentData(res.data);
          toast.success("Payment verified successfully!");
          refreshCitizen().then(() => {
            setTimeout(() => {
              navigate("/dashboard/dashboard/myProfile");
            }, 5000)
        })
        } else {
          setError(res.data.message || "Payment verification failed");
          toast.error(res.data.message || "Payment not verified");
        }
      })
      .catch(error => {
        setError(error.message || "Payment verification failed");
        toast.error("Payment verification failed. Try again.");
      })
      .finally(() => {
        setLoading(false);
      });


  }, [searchParams, navigate, axiosSecure]);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-zinc-950 to-zinc-900 flex items-center justify-center mt-15">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-emerald-500 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Verifying Payment...</h2>
          <p className="text-gray-400">Please wait while we confirm your payment</p>
          
          {/* Show session ID for debugging */}
          <div className="mt-4 p-3 bg-zinc-800 rounded-lg">
            <p className="text-sm text-gray-300">
              Session ID: <span className="font-mono text-emerald-400">
                {searchParams.get("session_id")?.substring(0, 20)}...
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-b from-zinc-950 to-zinc-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-red-500/30 p-8 text-center">
          <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-red-500" />
          </div>
          
          <h1 className="text-3xl font-black text-white mb-4">Payment Failed</h1>
          
          <div className="bg-zinc-800/50 rounded-2xl p-4 mb-6">
            <p className="text-gray-300 mb-3">{error}</p>
            <p className="text-sm text-gray-400">
              Please contact support if you believe this is an error.
            </p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => navigate("/dashboard/dashboard/myProfile")}
              className="w-full px-6 py-3 bg-zinc-700 rounded-xl text-white font-medium hover:bg-zinc-600 transition-colors"
            >
              Back to Profile
            </button>
            <button
              onClick={() => navigate("/support")}
              className="w-full px-6 py-3 bg-linear-to-r from-red-500 to-orange-500 rounded-xl text-white font-bold hover:shadow-red-500/50 transition-all"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-950 to-zinc-900 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-emerald-500/30 p-8 text-center">
        <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-emerald-500" />
        </div>
        
        <h1 className="text-3xl font-black text-white mb-4">Payment Successful! 🎉</h1>
        
        {/* Show payment details */}
        {paymentData && (
          <div className="bg-zinc-800/50 rounded-2xl p-4 mb-6 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Amount:</span>
              <span className="text-white font-bold">
                {paymentData.session?.amount || 0} BDT
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">User:</span>
              <span className="text-white">{paymentData.user?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Email:</span>
              <span className="text-emerald-400">{paymentData.user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Session ID:</span>
              <span className="text-gray-300 text-xs truncate ml-2">
                {paymentData.session?.id}
              </span>
            </div>
          </div>
        )}
        
        <p className="text-gray-300 mb-6">
          Your payment has been verified successfully. You will be redirected to your profile shortly.
        </p>
        
        <button
          onClick={() => navigate("/dashboard/dashboard/myProfile")}
          className="w-full px-6 py-3 bg-linear-to-r from-emerald-500 to-teal-500 rounded-xl text-white font-bold hover:shadow-emerald-500/50 transition-all"
        >
          Go to Profile Now
        </button>
        
        <p className="text-gray-400 text-sm mt-4">
          Redirecting in 5 seconds...
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;