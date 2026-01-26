import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { 
  ArrowLeft,
  CheckCircle,
  CreditCard,
  Calendar,
  User,
  Hash,
  Globe,
  FileText,
  Copy,
  Download,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { toast } from 'react-toastify';

const PaymentDetails = () => {
  const { paymentId } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaymentDetails();
  }, [paymentId]);

  const fetchPaymentDetails = async () => {
      setLoading(true)
      axiosSecure.get(`/payment-details/${paymentId}`)
        .then(res=> {
          console.log(res.data)
          setPayment(res.data)
          setLoading(false)
        }).catch(err=> console.log(err))
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return {
        date: date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        time: date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      };
    } catch (error) {
      return { date: 'Invalid Date', time: '' };
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-zinc-950 to-zinc-900 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-3 border-zinc-700 border-t-emerald-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-300">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="min-h-screen bg-linear-to-b from-zinc-950 to-zinc-900 flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
            <FileText className="w-10 h-10 text-red-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-white">Payment Not Found</h2>
            <p className="text-gray-400">Transaction ID: {paymentId}</p>
          </div>
          <button
            onClick={() => navigate('/payment-history')}
            className="px-6 py-3 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Back to History
          </button>
        </div>
      </div>
    );
  }

  const { date, time } = formatDateTime(payment.paymentAt);

  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-950 to-zinc-900 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Payment Details</h1>
              <p className="text-gray-400">Transaction ID: {paymentId}</p>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="font-medium text-emerald-400">Payment Successful</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Amount Card */}
          <div className="bg-zinc-800/50 rounded-2xl border border-zinc-700 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-lg font-semibold text-white mb-2">Total Amount</h2>
                <p className="text-gray-400">{payment.description}</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-white">৳ {payment.data?.amount || 0}</div>
                <p className="text-gray-500 mt-1">{payment.data?.currency || 'BDT'}</p>
              </div>
            </div>
          </div>

          {/* Two Column Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Transaction Details */}
            <div className="bg-zinc-800/50 rounded-2xl border border-zinc-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-blue-500" />
                <span>Transaction</span>
              </h3>
              
              <div className="space-y-5">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Transaction ID</label>
                  <div className="flex items-center justify-between">
                    <code className="font-mono text-gray-300 bg-zinc-900 px-3 py-2 rounded-lg flex-1 mr-3 truncate">
                      {payment.data?.stripeSessionId}
                    </code>
                    <button
                      onClick={() => copyToClipboard(payment.data?.stripeSessionId)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Date</label>
                    <p className="font-medium text-white">{date}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Time</label>
                    <p className="font-medium text-white">{time}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Payment Method</label>
                  <p className="font-medium text-white">Credit/Debit Card</p>
                </div>
              </div>
            </div>

            {/* User Information */}
            <div className="bg-zinc-800/50 rounded-2xl border border-zinc-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                <User className="w-5 h-5 text-purple-500" />
                <span>User</span>
              </h3>
              
              <div className="space-y-5">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-zinc-700">
                    <img
                      src={payment.performedBy?.photoURL || 'https://via.placeholder.com/150'}
                      alt={payment.performedBy?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{payment.performedBy?.name}</p>
                    <p className="text-sm text-gray-400">{payment.performedBy?.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">User ID</label>
                    <p className="font-mono text-sm text-gray-300 truncate">{payment.userId}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Role</label>
                    <p className="font-medium text-white capitalize">{payment.performedBy?.role}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment System */}
            <div className="bg-zinc-800/50 rounded-2xl border border-zinc-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span>Payment System</span>
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-zinc-900/30 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-linear-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Stripe</p>
                    <p className="text-sm text-gray-400">Secure Payment Gateway</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Status</span>
                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded">Completed</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Security</span>
                    <span className="text-sm text-emerald-400">256-bit SSL</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-zinc-800/50 rounded-2xl border border-zinc-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                <Globe className="w-5 h-5 text-gray-400" />
                <span>Details</span>
              </h3>
              
              <div className="space-y-4">
                {payment.data?.customerEmail && (
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Customer Email</label>
                    <p className="font-medium text-white">{payment.data.customerEmail}</p>
                  </div>
                )}
                
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Payment Type</label>
                  <p className="font-medium text-white capitalize">{payment.data?.type || 'Standard'}</p>
                </div>
                
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Description</label>
                  <p className="text-gray-300">{payment.title}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-3 bg-zinc-800 border border-zinc-700 text-white font-medium rounded-lg hover:bg-zinc-700 transition-colors flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to History</span>
            </button>
            
            <button
              onClick={() => toast.info('Receipt download feature coming soon')}
              className="flex-1 px-6 py-3 bg-zinc-900 text-white font-medium rounded-lg hover:bg-zinc-800 transition-colors flex items-center justify-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Download Receipt</span>
            </button>
            
            <button
              onClick={() => toast.info('Support team will contact you')}
              className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Contact Support
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 pt-6 border-t border-zinc-700 text-center">
          <p className="text-sm text-gray-500">
            This is a secure payment processed through Stripe. For assistance, contact support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;