import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  MapPin, 
  Store, 
  Truck, 
  CreditCard, 
  Banknote, 
  ShieldCheck, 
  Phone, 
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, Navigate } from 'react-router-dom';

export function Checkout() {
  const { cart, api } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  
  const [deliveryMethod, setDeliveryMethod] = useState<'home' | 'store'>('home');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online' | 'emi'>('online');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);

    // Pre-populate if logged in
    if (user) {
      if (!customerName) setCustomerName(user.user_metadata?.full_name || '');
      if (!customerPhone) setCustomerPhone(user.user_metadata?.phone || '');
      
      // Fetch saved addresses
      supabase.from('user_addresses').select('*').eq('user_id', user.id).then(({ data }) => {
        if (data && data.length > 0) {
          setSavedAddresses(data);
          // Auto select first address if empty
          if (!deliveryAddress) setDeliveryAddress(data[0].address);
        }
      });
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [user]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPlacingOrder(true);
    
    try {
      const newOrder = await api.addOrder({
        user_id: user?.id || null,
        customerName: customerName || 'Guest Customer',
        customerPhone: customerPhone || undefined,
        items: cart.length,
        itemsList: cart.map(item => ({
          id: `OI-৳{Date.now()}-৳{item.product.id}`,
          productId: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price
        })),
        total: total,
        status: 'Pending',
        paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod === 'online' ? 'Online Payment' : 'EMI',
        deliveryAddress: deliveryMethod === 'home' ? deliveryAddress : 'Store Pickup'
      });
      setIsOrderPlaced(true);
      api.clearCart();
      navigate('/order-success', { state: { orderId: newOrder.id } });
    } catch (error) {
      console.error('Failed to place order', error);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (cart.length === 0 && !isOrderPlaced) {
    return <Navigate to="/cart" replace />;
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] pb-safe">
      {/* Header */}
      <header className={`sticky top-0 z-30 bg-white/90 backdrop-blur-xl pt-safe-top transition-all duration-300 ৳{isScrolled ? 'shadow-sm border-b border-gray-200' : 'border-b border-gray-100'}`}>
        <div className="px-4 h-14 flex items-center relative max-w-[1200px] mx-auto">
          <button 
            onClick={() => navigate('/cart')}
            className="absolute left-4 p-2 -ml-2 text-gray-900 active:scale-95 transition-transform"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-bold text-gray-900 ml-10">Checkout</h1>
        </div>
      </header>

      <form onSubmit={handlePlaceOrder} className="max-w-[1200px] mx-auto px-4 py-8 space-y-8">
        
        {/* 1. Customer Info */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Contact Details</h2>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Full Name</label>
              <input 
                type="text" 
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Phone Number</label>
              <input 
                type="tel" 
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300 transition-all"
              />
            </div>
          </div>
        </section>

        {/* 2. Delivery Option */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Delivery Method</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setDeliveryMethod('home')}
              className={`p-4 rounded-2xl text-left transition-all ৳{
                deliveryMethod === 'home' 
                  ? 'bg-indigo-100 text-indigo-900 shadow-sm' 
                  : 'bg-white text-gray-700 shadow-sm hover:bg-gray-50'
              }`}
            >
              <Truck size={20} className={deliveryMethod === 'home' ? 'text-indigo-600' : 'text-gray-400'} />
              <div className="mt-3 font-bold text-sm">Home Delivery</div>
              <div className={`text-xs mt-1 font-medium ৳{deliveryMethod === 'home' ? 'text-indigo-700' : 'text-gray-500'}`}>2-3 business days</div>
            </button>
            <button
              type="button"
              onClick={() => setDeliveryMethod('store')}
              className={`p-4 rounded-2xl text-left transition-all ৳{
                deliveryMethod === 'store' 
                  ? 'bg-indigo-100 text-indigo-900 shadow-sm' 
                  : 'bg-white text-gray-700 shadow-sm hover:bg-gray-50'
              }`}
            >
              <Store size={20} className={deliveryMethod === 'store' ? 'text-indigo-600' : 'text-gray-400'} />
              <div className="mt-3 font-bold text-sm">Store Pickup</div>
              <div className={`text-xs mt-1 font-medium ৳{deliveryMethod === 'store' ? 'text-indigo-700' : 'text-gray-500'}`}>Available today</div>
            </button>
          </div>

          {deliveryMethod === 'home' && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mt-3"
            >
              <label className="block text-sm font-bold text-gray-700 mb-4 flex items-center gap-1.5">
                <MapPin size={16} className="text-indigo-600" /> Delivery Address
              </label>

              {user && savedAddresses.length > 0 && (
                <div className="mb-4">
                  <select
                    className="w-full rounded-2xl border-gray-200 bg-gray-50 py-3.5 px-4 focus:ring-indigo-500 font-medium text-gray-900 border-2"
                    onChange={(e) => {
                      if (e.target.value === 'custom') {
                        setDeliveryAddress('');
                      } else {
                        setDeliveryAddress(e.target.value);
                      }
                    }}
                  >
                    <option value="" disabled selected={!deliveryAddress}>Select a saved address...</option>
                    {savedAddresses.map((addr) => (
                      <option key={addr.id} value={addr.address}>
                        {addr.title} - {addr.address.substring(0, 30)}...
                      </option>
                    ))}
                    <option value="custom">+ Enter a new address manually</option>
                  </select>
                </div>
              )}

              <textarea 
                required
                rows={3}
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Enter your full delivery address..."
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl px-4 py-4 font-medium focus:outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all resize-none"
              />

              {!user && (
                <div className="mt-4 p-4 bg-indigo-50 rounded-2xl flex justify-between items-center">
                  <p className="text-sm font-bold text-indigo-900">Want to save addresses?</p>
                  <button type="button" onClick={() => navigate('/profile')} className="text-sm font-bold text-white bg-indigo-600 px-4 py-2 rounded-xl shadow-md active:scale-95 transition-transform">Sign Up / Log In</button>
                </div>
              )}
            </motion.div>
          )}
        </section>

        {/* 3. Payment Method */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Payment Method</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
            
            {/* Online Payment */}
            <label className="flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-center w-5 h-5 rounded-full border border-gray-300 mr-3 shrink-0">
                {paymentMethod === 'online' && <div className="w-3 h-3 bg-indigo-600 rounded-full" />}
              </div>
              <input 
                type="radio" 
                name="payment" 
                value="online" 
                checked={paymentMethod === 'online'}
                onChange={() => setPaymentMethod('online')}
                className="hidden"
              />
              <div className="flex-1">
                <div className="font-semibold text-sm text-gray-900">Online Payment</div>
                <div className="text-xs text-gray-500 mt-0.5">Credit/Debit Card, UPI, Wallets</div>
              </div>
              <CreditCard size={20} className="text-gray-400" />
            </label>

            {/* EMI */}
            <label className="flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-center w-5 h-5 rounded-full border border-gray-300 mr-3 shrink-0">
                {paymentMethod === 'emi' && <div className="w-3 h-3 bg-indigo-600 rounded-full" />}
              </div>
              <input 
                type="radio" 
                name="payment" 
                value="emi" 
                checked={paymentMethod === 'emi'}
                onChange={() => setPaymentMethod('emi')}
                className="hidden"
              />
              <div className="flex-1">
                <div className="font-semibold text-sm text-gray-900">EMI Options</div>
                <div className="text-xs text-emerald-600 mt-0.5 font-medium">From ৳{(total / 12).toFixed(2)}/mo</div>
              </div>
              <div className="flex gap-1">
                <div className="w-6 h-4 bg-gray-200 rounded-sm" />
                <div className="w-6 h-4 bg-gray-200 rounded-sm" />
              </div>
            </label>

            {/* COD */}
            <label className="flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-center w-5 h-5 rounded-full border border-gray-300 mr-3 shrink-0">
                {paymentMethod === 'cod' && <div className="w-3 h-3 bg-indigo-600 rounded-full" />}
              </div>
              <input 
                type="radio" 
                name="payment" 
                value="cod" 
                checked={paymentMethod === 'cod'}
                onChange={() => setPaymentMethod('cod')}
                className="hidden"
              />
              <div className="flex-1">
                <div className="font-semibold text-sm text-gray-900">Cash on Delivery</div>
                <div className="text-xs text-gray-500 mt-0.5">Pay when you receive</div>
              </div>
              <Banknote size={20} className="text-gray-400" />
            </label>

          </div>
        </section>

        {/* 4. Order Summary */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Order Summary</h2>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <div className="space-y-3">
              {cart.map(item => (
                <div key={item.id} className="flex gap-3 items-center">
                  <div className="w-12 h-12 bg-gray-50 rounded-lg p-1.5 shrink-0 flex items-center justify-center">
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain mix-blend-multiply" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{item.product.name}</div>
                    <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                  </div>
                  <div className="text-sm font-bold text-gray-900 shrink-0">
                    ৳{(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
              <span className="font-bold text-gray-900">Total to Pay</span>
              <span className="text-xl font-bold text-gray-900">৳{total.toFixed(2)}</span>
            </div>
          </div>
        </section>

        {/* 6. Trust Signals */}
        <section className="py-2">
          <div className="flex items-center justify-center gap-6 text-gray-400">
            <div className="flex flex-col items-center gap-1.5">
              <ShieldCheck size={20} />
              <span className="text-[10px] font-medium uppercase tracking-wider">Secure</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <CheckCircle2 size={20} />
              <span className="text-[10px] font-medium uppercase tracking-wider">Warranty</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <Phone size={20} />
              <span className="text-[10px] font-medium uppercase tracking-wider">Support</span>
            </div>
          </div>
        </section>

        {/* 5. Place Order Button (Sticky) */}
        <div className="sticky bottom-16 md:bottom-0 mt-8 -mx-4 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0_-8px_30px_rgba(0,0,0,0.04)] p-4 sm:p-6 z-40">
          <div className="max-w-[1200px] mx-auto">
            <button 
              type="submit"
              disabled={isPlacingOrder}
              className="w-full md:w-auto md:px-12 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold active:scale-[0.97] transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-70 disabled:active:scale-100 md:ml-auto"
            >
              {isPlacingOrder ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Processing...
                </>
              ) : (
                `Place Order • $${total.toFixed(2)}`
              )}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
