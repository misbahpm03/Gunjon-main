import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Copy, Package, Phone, ArrowRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderId] = useState(location.state?.orderId || `ORD-${Math.floor(Math.random() * 1000000000)}`);
  const [copied, setCopied] = useState(false);

  // Calculate estimated delivery (e.g., 3 days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);
  const formattedDate = deliveryDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContinueShopping = () => {
    navigate('/shop');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      
      {/* Animated Checkmark */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.1 }}
        className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.3 }}
        >
          <Check size={48} strokeWidth={3} />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-500 text-sm mb-8">
          Thank you for your purchase. We've received your order and will begin processing it right away.
        </p>

        {/* Order Details Card */}
        <div className="bg-[#f9fafb] rounded-2xl p-5 mb-8 border border-gray-100 text-left space-y-4">
          
          {/* Order ID */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Order ID</p>
              <p className="font-mono font-bold text-gray-900">{orderId}</p>
            </div>
            <button 
              onClick={handleCopy}
              className="p-2 bg-white rounded-lg border border-gray-200 text-gray-600 active:scale-95 transition-all flex items-center gap-2"
            >
              {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
            </button>
          </div>

          {/* Delivery Estimate */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
              <Package size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Estimated Delivery</p>
              <p className="font-bold text-gray-900">By {formattedDate}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button 
            onClick={handleContinueShopping}
            className="w-full py-4 bg-black text-white rounded-xl font-bold active:scale-95 transition-transform flex items-center justify-center gap-2 shadow-lg shadow-black/10"
          >
            Continue Shopping
            <ArrowRight size={18} />
          </button>
          
          <button className="w-full py-4 bg-white text-gray-900 rounded-xl font-bold active:scale-95 transition-transform flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50">
            <Phone size={18} className="text-gray-400" />
            Contact Support
          </button>
        </div>
      </motion.div>

    </div>
  );
}
