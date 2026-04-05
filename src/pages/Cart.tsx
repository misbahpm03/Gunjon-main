import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ShoppingCart, ArrowRight, Trash2, Plus, Minus } from 'lucide-react';
import { useData } from '../context/DataContext';

export function Cart() {
  const { cart, api } = useData();
  
  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-indigo-50 mb-6">
          <ShoppingCart className="h-10 w-10 text-indigo-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
        <p className="text-lg text-gray-500 mb-8 max-w-md mx-auto">
          Looks like you haven't added anything to your cart yet. Browse our products and find something you love.
        </p>
        <Link to="/shop">
          <Button size="lg" className="rounded-full px-8 h-14 text-lg">
            Continue Shopping <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left text-gray-900">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row items-center gap-6 bg-white p-6 rounded-2xl border border-gray-200">
              <img src={item.product.image} alt={item.product.name} className="w-24 h-24 object-contain" />
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg font-bold text-gray-900">{item.product.name}</h3>
                <p className="text-indigo-600 font-semibold mt-1">৳{item.product.price.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button 
                    onClick={() => api.updateCartQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button 
                    onClick={() => api.updateCartQuantity(item.product.id, Math.min(item.product.stock, item.quantity + 1))}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button 
                  onClick={() => api.removeFromCart(item.product.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div>
          <div className="bg-gray-50 rounded-2xl p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>৳{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-lg text-gray-900">
                <span>Total</span>
                <span>৳{subtotal.toLocaleString()}</span>
              </div>
            </div>
            <Link to="/checkout">
              <Button className="w-full h-14 text-lg rounded-xl">
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
