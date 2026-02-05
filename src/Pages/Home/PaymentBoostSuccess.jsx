import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "react-toastify";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { AuthContext } from "../AuthProvider/AuthContext";

const PaymentBoostSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const hasProcessed = useRef(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (hasProcessed.current) return;

    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      toast.error("No payment session found");
      navigate("/all-issues");
      return;
    }
    if(!user) return;
    

    hasProcessed.current = true;
    setLoading(true)
    axiosSecure
      .get(`/verify-boost-payment/${sessionId}`)
      .then((res) => {
        setInitialLoad(false);
        if (res.data.success && res.data.paid) {
          setPaymentData(res.data);
          setPaymentSuccess(res.data.success)
          toast.success("Boost payment verified successfully!");
          setLoading(false)
        } else {
          setError(res.data.message || "Payment verification failed");
          toast.error(res.data.message || "Payment not verified");
          setLoading(false)
        }
      })
      .catch((err) => {
        setInitialLoad(false);
        setError(err.message || "Payment verification failed");
        toast.error("Payment verification failed. Try again.");
        setLoading(false)
      })
  }, [searchParams, navigate, axiosSecure, user]);

  if (initialLoad) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-900">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-emerald-500 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white">Payment verifying processing, please wait...</h2>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-900">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-emerald-500 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white">Verifying Boost Payment...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        { paymentSuccess ? (
          <div className="min-h-screen flex items-center justify-center bg-zinc-900">
            <div className="bg-zinc-800 rounded-xl p-8 text-center">
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl text-white font-bold mb-2">Payment Failed</h1>
              <p className="text-gray-300 mb-4">{error}</p>
              <button
                onClick={() => navigate("/allissues")}
                className="px-6 py-2 bg-zinc-700 text-white rounded hover:bg-zinc-600 transition"
              >
                Back to Issues
              </button>
            </div>
          </div>) : (
            <div>
              payment Process running
            </div>
          )
        }
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900">
      <title>CommunityFix - Payment Boost Success</title>
      <div className="bg-zinc-800 rounded-xl p-8 text-center">
        <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
        <h1 className="text-2xl text-white font-bold mb-2">Payment Successful!</h1>
        <p className="text-gray-300 mb-4">Your boost payment has been verified.</p>
        <button
          onClick={() => navigate("/allissues")}
          className="px-6 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition"
        >
          Go to Issues
        </button>
      </div>
    </div>
  );
};

export default PaymentBoostSuccess;