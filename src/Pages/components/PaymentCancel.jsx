import { useNavigate } from 'react-router';
import { XCircle, ArrowLeft, CreditCard } from 'lucide-react';

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-10 min-h-screen bg-linear-to-b from-zinc-950 to-zinc-900 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-red-500/30 p-8 text-center">
        <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-12 h-12 text-red-500" />
        </div>
        
        <h1 className="text-3xl font-black text-white mb-4">Payment Cancelled</h1>
        
        <div className="bg-zinc-800/50 rounded-2xl p-6 mb-8">
          <p className="text-gray-300 mb-4">
            Your payment process was cancelled. No charges were made to your account.
          </p>
          
          <div className="text-sm text-gray-400 space-y-2">
            <p>• You can try again anytime</p>
            <p>• Contact support if you need help</p>
          </div>
        </div>

        <div className="space-y-4">
          
          <button
            onClick={() => navigate('/dashboard/dashboard/myProfile')}
            className="w-full px-6 py-3 bg-zinc-700 rounded-xl text-white font-medium hover:bg-zinc-600 transition-colors flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Profile</span>
          </button>
          
          <a
            href="mailto:support@piirs.com"
            className="inline-block text-sm text-blue-400 hover:text-blue-300 mt-4"
          >
            Need help? Contact support:mail only
          </a>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;