import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "react-toastify";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const PaymentBoostSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);
  const axiosSecure = useAxiosSecure();

  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;

    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      toast.error("No payment session found");
      navigate("/all-issues");
      return;
    }

    hasProcessed.current = true;

    axiosSecure
      .get(`/verify-boost-payment/${sessionId}`)
      .then((res) => {
        if (res.data.success && res.data.paid) {
          setPaymentData(res.data);
          toast.success("Boost payment verified successfully!");
        } else {
          setError(res.data.message || "Payment verification failed");
          toast.error(res.data.message || "Payment not verified");
        }
      })
      .catch((err) => {
        setError(err.message || "Payment verification failed");
        toast.error("Payment verification failed. Try again.");
      })
      .finally(() => setLoading(false));
  }, [searchParams, navigate, axiosSecure]);

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
      <div className="min-h-screen flex items-center justify-center bg-zinc-900">
        <div className="bg-zinc-800 rounded-xl p-8 text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl text-white font-bold mb-2">Payment Failed</h1>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => navigate("/dashboard/dashboard/all-issues")}
            className="px-6 py-2 bg-zinc-700 text-white rounded hover:bg-zinc-600 transition"
          >
            Back to Issues
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900">
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
