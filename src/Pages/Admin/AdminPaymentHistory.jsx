import React, { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { 
  CreditCard, 
  Calendar, 
  Download,
  DollarSign,
  Receipt,
  TrendingUp,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Eye
} from 'lucide-react'
import useAxiosSecure from '../../Hooks/useAxiosSecure'
import { toast } from 'react-toastify'

const AdminPaymentHistory = () => {
  const axiosSecure = useAxiosSecure()
  
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20
  })
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    avgTransaction: 0
  })

  useEffect(() => {
    fetchPayments()
  }, [pagination.currentPage])

  const fetchPayments = async () => {
    setLoading(true)
    
    axiosSecure.get(`/admin/payment-history?page=${pagination.currentPage}`)
      .then(res => {
        setPayments(res.data.payments)
        setPagination(res.data.pagination)
        setAnalytics(res.data.analytics)
      })
      .catch(err => toast.error(err))
      .finally(() => setLoading(false))
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getTypeStyle = (type) => {
    const styles = {
      premium: 'bg-linear-to-r from-yellow-500/20 to-amber-500/10 text-yellow-400 border border-yellow-500/30',
      basic: 'bg-linear-to-r from-blue-500/20 to-cyan-500/10 text-blue-400 border border-blue-500/30',
      normal_boost: 'bg-linear-to-r from-purple-500/20 to-pink-500/10 text-purple-400 border border-purple-500/30',
      high_boost: 'bg-linear-to-r from-pink-500/20 to-rose-500/10 text-pink-400 border border-pink-500/30'
    }
    
    return styles[type] || 'bg-linear-to-r from-gray-500/20 to-slate-500/10 text-gray-400 border border-gray-500/30'
  }

  const getTypeText = (payment) => {
    const type = payment.data?.type || payment.actionType
    
    const types = {
      premium: 'Premium',
      basic: 'Basic',
      normal_boost: 'Normal Boost',
      high_boost: 'High Boost'
    }
    
    return types[type] || type
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-950 to-zinc-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white flex items-center space-x-3">
            <CreditCard className="w-8 h-8 text-emerald-500" />
            <span>Payment History</span>
          </h1>
          <p className="text-gray-400 mt-2">View all payment transactions across the platform</p>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-linear-to-r from-emerald-500 to-teal-500 rounded-xl">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Total Revenue</div>
                <div className="text-2xl font-bold text-white">
                  ৳ {analytics.totalRevenue}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-linear-to-r from-blue-500 to-indigo-500 rounded-xl">
                <Receipt className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Total Transactions</div>
                <div className="text-2xl font-bold text-white">
                  {analytics.totalTransactions}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-linear-to-r from-purple-500 to-violet-500 rounded-xl">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Avg Transaction</div>
                <div className="text-2xl font-bold text-white">
                  ৳ {Math.round(analytics.avgTransaction || 0)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Table */}
        <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
              <span className="ml-3 text-gray-300">Loading payments...</span>
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center py-16">
              <CreditCard className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No payments found</h3>
              <p className="text-gray-400">No payment history available</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-zinc-700">
                    <tr>
                      <th className="py-4 px-6 text-left text-gray-400 font-medium">User</th>
                      <th className="py-4 px-6 text-left text-gray-400 font-medium">Type</th>
                      <th className="py-4 px-6 text-left text-gray-400 font-medium">Date</th>
                      <th className="py-4 px-6 text-left text-gray-400 font-medium">Amount</th>
                      <th className="py-4 px-6 text-left text-gray-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr 
                        key={payment._id} 
                        className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div>
                            <div className="font-bold text-white">
                              {payment.performedBy?.name || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-400">
                              {payment.performedBy?.email || 'N/A'}
                            </div>
                          </div>
                        </td>
                        
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-3 py-1 rounded-xl text-sm font-medium ${getTypeStyle(payment.data?.type || payment.actionType)}`}>
                            {getTypeText(payment)}
                          </span>
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
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={()=> toast.info("Payment Reciept implementation will be soon.")}
                              title="Download Receipt"
                              className="p-2 bg-zinc-700 rounded-xl text-gray-300 hover:text-white hover:bg-zinc-600 transition-colors"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            
                            <Link
                              to={`/dashboard/payment-details/${payment._id}`}
                              className="flex items-center space-x-2 px-3 py-2 bg-emerald-500/20 text-emerald-400 rounded-xl hover:bg-emerald-500/30 transition-colors">
                              <Eye className="w-4 h-4" />
                              <span>View</span>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="border-t border-zinc-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
                    {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
                    {pagination.totalItems} entries
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                      disabled={pagination.currentPage === 1}
                      className={`p-2 rounded-xl transition-colors ${
                        pagination.currentPage === 1 
                          ? 'text-gray-600 bg-zinc-800 cursor-not-allowed' 
                          : 'text-gray-300 bg-zinc-700 hover:bg-zinc-600 hover:text-white'
                      }`}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-xl font-medium">
                        {pagination.currentPage}
                      </span>
                      <span className="text-gray-400">/</span>
                      <span className="text-gray-400">{pagination.totalPages}</span>
                    </div>
                    
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className={`p-2 rounded-xl transition-colors ${
                        pagination.currentPage === pagination.totalPages 
                          ? 'text-gray-600 bg-zinc-800 cursor-not-allowed' 
                          : 'text-gray-300 bg-zinc-700 hover:bg-zinc-600 hover:text-white'
                      }`}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
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

export default AdminPaymentHistory