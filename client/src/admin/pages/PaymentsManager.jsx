import { useEffect, useState } from 'react';
import { getPendingPayments, verifyPayment } from '../services/adminApi';
import toast from 'react-hot-toast';
import { FaSpinner, FaCheck, FaTimes, FaExternalLinkAlt } from 'react-icons/fa';

export default function PaymentsManager() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = () => {
    setLoading(true);
    getPendingPayments().then(setPayments).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleVerify = async (id, action) => {
    const isApprove = action === 'approve';
    if (!window.confirm(`Are you sure you want to ${isApprove ? 'APPROVE' : 'REJECT'} this payment?`)) return;
    
    try {
      await verifyPayment(id, action);
      toast.success(`Payment ${isApprove ? 'approved' : 'rejected'} successfully`);
      fetchPayments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error verifying payment');
    }
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Manual Payment Verification</h1>
      <p className="text-gray-500 mb-8">Review user-submitted transaction IDs and screenshots to approve bookings.</p>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <FaSpinner className="animate-spin text-blue-500 text-3xl" />
        </div>
      ) : payments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCheck size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">All Caught Up!</h2>
          <p className="text-gray-500">There are no pending manual payments requiring verification.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {payments.map((payment) => (
            <div key={payment._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              
              {/* Image Header */}
              <div className="h-48 bg-gray-100 relative group border-b border-gray-100">
                {payment.screenshot ? (
                  <>
                    <img 
                      src={`http://localhost:5000${payment.screenshot}`} 
                      alt="Payment Receipt" 
                      className="w-full h-full object-cover"
                    />
                    <a 
                      href={`http://localhost:5000${payment.screenshot}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm font-semibold gap-2"
                    >
                      <FaExternalLinkAlt /> View Full Image
                    </a>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <span className="text-xs font-semibold uppercase tracking-widest mt-2">No Screenshot Provided</span>
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Method</p>
                    <p className="text-sm font-bold text-gray-800 capitalize">{payment.method}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Amount Claimed</p>
                    <p className="text-lg font-black text-blue-600">{payment.amount} ETB</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 mb-6">
                  <p className="text-xs text-gray-500 font-semibold mb-1">Transaction ID:</p>
                  <p className="font-mono text-gray-800 font-bold select-all break-all">{payment.transactionId}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleVerify(payment._id, 'reject')}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2.5 rounded-lg flex justify-center items-center gap-2 transition-colors"
                  >
                    <FaTimes /> Reject
                  </button>
                  <button 
                    onClick={() => handleVerify(payment._id, 'approve')}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 rounded-lg flex justify-center items-center gap-2 shadow-md shadow-green-500/20 transition-colors"
                  >
                    <FaCheck /> Approve
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-between text-xs text-gray-500 font-medium">
                <span>User: {payment.user?.name}</span>
                <span>Booking: #{payment.booking?.bookingNumber}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
