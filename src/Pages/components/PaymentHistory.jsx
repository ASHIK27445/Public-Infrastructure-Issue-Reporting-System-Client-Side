import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { 
  CreditCard, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock,
  Download,
  Filter,
  Search,
  ArrowLeft,
  Loader2,
  Shield,
  Crown,
  TrendingUp
} from 'lucide-react';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { toast } from 'react-toastify';
import { useOutletContext } from 'react-router';

const PaymentHistory = () => {
  const { citizen } = useOutletContext();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPaymentHistory();
  }, [citizen?._id]);

  const fetchPaymentHistory = async () => {
    if (!citizen?._id) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    axiosSecure.get(`/user-payment-history/${citizen?._id}`)
        .then(res => {
            // console.log(res.data)
            setPayments(res.data)
        }).catch(err=> console.log(err))
        .finally(()=> {setLoading(false)})
  }

  const getStatusColor = () => {
    return 'bg-emerald-500/20 text-emerald-400'
  }

  const getStatusIcon = () => {
    return <CheckCircle className="w-5 h-5" />
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'premium':
      case 'Premium Subscription':
        return 'from-yellow-500 to-amber-500';
      case 'basic':
      case 'Basic Subscription':
        return 'from-blue-500 to-cyan-500';
      case 'normal_boost':
      case 'Priority Boost':
        return 'from-purple-500 to-pink-500';
      default: 
        return 'from-gray-500 to-slate-500';
    }
  }

  const getDisplayType = (payment) => {
    const type = payment.data?.type || payment.actionType;
    
    switch (type) {
      case 'premium':
        return 'Premium Subscription';
      case 'basic':
        return 'Basic Subscription';
      case 'normal_boost':
        return 'Priority Boost';
      default:
        return type || 'Payment';
    }
  }
  
  const getTypeIcon = (payment) => {
    const type = payment.data?.type || payment.actionType;
    
    switch (type) {
      case 'premium':
        return <Crown className="w-5 h-5 text-white" />;
      case 'normal_boost':
        return <TrendingUp className="w-5 h-5 text-white" />;
      default:
        return <CreditCard className="w-5 h-5 text-white" />;
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  }

  const handleDownloadReceipt = async (paymentId) => {
    toast.info('Receipt download feature coming soon!');
    // Implement PDF generation and download
  }

  
  const filteredPayments = payments.filter(payment => {
    if (filter !== 'all') {
      const paymentType = getDisplayType(payment).toLowerCase();
      if (paymentType !== filter) return false;
    }
    
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        (payment.data?.stripeSessionId?.toLowerCase() || '').includes(searchLower) ||
        (payment.description?.toLowerCase() || '').includes(searchLower) ||
        (payment.title?.toLowerCase() || '').includes(searchLower) ||
        (payment.data?.amount?.toString() || '').includes(searchLower)
      );
    }
    
    return true
  })

  const totalAmount = payments.reduce((sum, payment) => sum + (payment.data?.amount || 0), 0);

  const paymentTypes = ['all', ...new Set(payments.map(p => getDisplayType(p).toLowerCase()))];

  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-950 to-zinc-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <button
              onClick={() => navigate('/dashboard/dashboard/myProfile')}
              className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Profile</span>
            </button>
            
            <h1 className="text-3xl font-black text-white flex items-center space-x-3">
              <CreditCard className="w-8 h-8 text-emerald-500" />
              <span>Payment History</span>
            </h1>
            <p className="text-gray-400 mt-2">View all your payment transactions</p>
          </div>

          <div className="mt-4 md:mt-0">
            <div className="flex items-center space-x-4">
              <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-3">
                <div className="text-sm text-gray-400">Total Spent</div>
                <div className="text-2xl font-bold text-white">
                  ৳ {totalAmount}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div className="flex flex-wrap gap-2">
              {paymentTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 py-2 rounded-xl font-medium capitalize transition-all ${
                    filter === type
                      ? 'bg-emerald-500 text-white'
                      : 'bg-zinc-700 text-gray-300 hover:bg-zinc-600'
                  }`}
                >
                  {type === 'all' ? 'All' : type}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-zinc-700 border border-zinc-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 w-full md:w-64"
              />
            </div>
          </div>
        </div>

        {/* Payment History Table */}
        <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
              <span className="ml-3 text-gray-300">Loading payments...</span>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center py-16">
              <CreditCard className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No payments found</h3>
              <p className="text-gray-400">
                {filter !== 'all' 
                  ? `No ${filter} payments found` 
                  : 'You have no payment history yet'
                }
              </p>
              {filter !== 'all' && (
                <button
                  onClick={() => setFilter('all')}
                  className="mt-4 text-emerald-400 hover:text-emerald-300"
                >
                  View all payments
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-700">
                      <th className="text-left py-4 px-6 text-gray-400 font-medium">Payment</th>
                      <th className="text-left py-4 px-6 text-gray-400 font-medium">Date</th>
                      <th className="text-left py-4 px-6 text-gray-400 font-medium">Amount</th>
                      <th className="text-left py-4 px-6 text-gray-400 font-medium">Status</th>
                      <th className="text-left py-4 px-6 text-gray-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map((payment) => (
                      <tr 
                        key={payment._id} 
                        className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-xl bg-linear-to-r ${getTypeColor(getDisplayType(payment))} flex items-center justify-center`}>
                              {getTypeIcon(payment)}
                            </div>
                            <div>
                              <div className="font-bold text-white">
                                {getDisplayType(payment)}
                              </div>
                              <div className="text-sm text-gray-400">
                                {payment.data?.stripeSessionId?.substring(0, 8)}...
                              </div>
                              <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                                {payment.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-300">
                              {formatDate(payment.paymentAt)}
                            </span>
                          </div>
                        </td>
                        
                        <td className="py-4 px-6">
                          <div className="text-xl font-bold text-white">
                            ৳ {payment.data?.amount || 0}
                          </div>
                        </td>
                        
                        <td className="py-4 px-6">
                          <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor()}`}>
                            {getStatusIcon()}
                            <span className="capitalize font-medium">Success</span>
                          </div>
                        </td>
                        
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleDownloadReceipt(payment._id)}
                              className="p-2 bg-zinc-700 rounded-lg text-gray-300 hover:text-white hover:bg-zinc-600 transition-colors"
                              title="Download Receipt"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            
                            <Link
                              to={`/dashboard/payment-details/${payment?._id}`}
                              className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors text-sm"
                            >
                              Details
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary */}
              <div className="border-t border-zinc-700 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-zinc-800/50 rounded-2xl p-4">
                    <div className="text-gray-400 text-sm">Total Transactions</div>
                    <div className="text-2xl font-bold text-white">{filteredPayments.length}</div>
                  </div>
                  
                  <div className="bg-zinc-800/50 rounded-2xl p-4">
                    <div className="text-gray-400 text-sm">Filtered Amount</div>
                    <div className="text-2xl font-bold text-white">
                      ৳ {filteredPayments.reduce((sum, p) => sum + (p.data?.amount || 0), 0)}
                    </div>
                  </div>
                  
                  <div className="bg-zinc-800/50 rounded-2xl p-4">
                    <div className="text-gray-400 text-sm">Last Payment</div>
                    <div className="text-lg font-bold text-emerald-400">
                      {filteredPayments.length > 0 
                        ? formatDate(filteredPayments[0].paymentAt).split(',')[0]
                        : 'N/A'
                      }
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default PaymentHistory