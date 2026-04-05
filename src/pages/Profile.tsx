import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { User, Package, MapPin, Heart, Phone, MessageCircle, LogOut, ChevronRight, Clock, CheckCircle2, Truck } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Link } from 'react-router-dom';

export function Profile() {
  const { userName, isAuthenticated, login, logout } = useAuth();
  const { orders, products } = useData();
  const [activeTab, setActiveTab] = useState('orders');

  // Mock user for storefront if not authenticated
  const user = isAuthenticated ? { name: userName, email: 'user@example.com', phone: '+1 234 567 8900' } : { name: 'Guest User', email: 'guest@example.com', phone: '' };

  // Mock wishlist
  const [wishlist, setWishlist] = useState([products[0], products[1]].filter(Boolean));

  // Mock addresses
  const [addresses, setAddresses] = useState([
    { id: 1, type: 'Home', address: '123 Main St, Apt 4B, New York, NY 10001' },
    { id: 2, type: 'Work', address: '456 Business Ave, Suite 100, New York, NY 10002' }
  ]);

  // Filter orders (mocking user orders)
  const myOrders = orders.slice(0, 3); // Just take first 3 for demo

  const handleRemoveWishlist = (id: string) => {
    setWishlist(prev => prev.filter(p => p.id !== id));
  };

  const handleDeleteAddress = (id: number) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Please log in</h1>
        <p className="text-gray-500 mb-8">You need to be logged in to view your profile.</p>
        <Button onClick={() => login('customer', 'John Doe')}>Log In as Demo User</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100 text-indigo-600 mb-4">
              <User className="h-10 w-10" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-500 text-sm mb-6">{user.email}</p>
            <Button variant="outline" className="w-full text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" /> Log Out
            </Button>
          </div>
          
          <nav className="space-y-2">
            <button onClick={() => setActiveTab('info')} className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === 'info' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
              <User className="h-5 w-5 mr-3" /> Personal Info
            </button>
            <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === 'orders' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
              <Package className="h-5 w-5 mr-3" /> My Orders
            </button>
            <button onClick={() => setActiveTab('wishlist')} className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === 'wishlist' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
              <Heart className="h-5 w-5 mr-3" /> Wishlist
            </button>
            <button onClick={() => setActiveTab('addresses')} className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === 'addresses' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
              <MapPin className="h-5 w-5 mr-3" /> Saved Addresses
            </button>
            <button onClick={() => setActiveTab('support')} className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === 'support' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
              <Phone className="h-5 w-5 mr-3" /> Support
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8">
            
            {activeTab === 'info' && (
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input type="text" className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500" defaultValue={user.name} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input type="email" className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500" defaultValue={user.email} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input type="tel" className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500" defaultValue={user.phone} placeholder="+1 (555) 000-0000" />
                  </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <Button>Save Changes</Button>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>
                <div className="space-y-6">
                  {myOrders.map(order => (
                    <div key={order.id} className="border border-gray-200 rounded-xl p-6">
                      <div className="flex flex-wrap justify-between items-start gap-4 mb-4 pb-4 border-b border-gray-100">
                        <div>
                          <p className="text-sm text-gray-500">Order ID</p>
                          <p className="font-bold text-gray-900">{order.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Date</p>
                          <p className="font-medium text-gray-900">{order.date}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Total Amount</p>
                          <p className="font-bold text-indigo-600">${order.total.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                            order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                            order.status === 'Shipped' ? 'bg-purple-100 text-purple-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-4 mb-6">
                        {order.itemsList?.map(item => (
                          <div key={item.id} className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                              <Package className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{item.name}</p>
                              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-medium text-gray-900">${(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                        ))}
                      </div>

                      {/* Order Timeline */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="text-sm font-bold text-gray-900 mb-4">Track Order</h4>
                        <div className="relative flex justify-between">
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full"></div>
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-600 rounded-full transition-all" style={{ width: order.status === 'Delivered' ? '100%' : order.status === 'Shipped' ? '66%' : order.status === 'Processing' ? '33%' : '0%' }}></div>
                          
                          <div className="relative z-10 flex flex-col items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${['Pending', 'Processing', 'Shipped', 'Delivered'].includes(order.status) ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                              <Clock size={16} />
                            </div>
                            <span className="text-xs font-medium text-gray-600">Pending</span>
                          </div>
                          <div className="relative z-10 flex flex-col items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${['Processing', 'Shipped', 'Delivered'].includes(order.status) ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                              <Package size={16} />
                            </div>
                            <span className="text-xs font-medium text-gray-600">Processing</span>
                          </div>
                          <div className="relative z-10 flex flex-col items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${['Shipped', 'Delivered'].includes(order.status) ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                              <Truck size={16} />
                            </div>
                            <span className="text-xs font-medium text-gray-600">Shipped</span>
                          </div>
                          <div className="relative z-10 flex flex-col items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${order.status === 'Delivered' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                              <CheckCircle2 size={16} />
                            </div>
                            <span className="text-xs font-medium text-gray-600">Delivered</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-6">My Wishlist</h1>
                {wishlist.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Your wishlist is empty.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {wishlist.map(product => (
                      <div key={product.id} className="border border-gray-200 rounded-xl p-4 flex gap-4">
                        <img src={product.image} alt={product.name} className="w-20 h-20 object-contain bg-gray-50 rounded-lg p-2" />
                        <div className="flex-1">
                          <Link to={`/product/${product.id}`} className="font-medium text-gray-900 hover:text-indigo-600 line-clamp-2">{product.name}</Link>
                          <p className="font-bold text-indigo-600 mt-1">${product.price.toLocaleString()}</p>
                          <button onClick={() => handleRemoveWishlist(product.id)} className="text-sm text-red-500 hover:text-red-700 mt-2 font-medium">Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">Saved Addresses</h1>
                  <Button variant="outline" size="sm">Add New</Button>
                </div>
                <div className="space-y-4">
                  {addresses.map(addr => (
                    <div key={addr.id} className="border border-gray-200 rounded-xl p-6 flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="h-5 w-5 text-indigo-600" />
                          <span className="font-bold text-gray-900">{addr.type}</span>
                        </div>
                        <p className="text-gray-600">{addr.address}</p>
                      </div>
                      <div className="flex gap-3">
                        <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">Edit</button>
                        <button onClick={() => handleDeleteAddress(addr.id)} className="text-sm text-red-500 hover:text-red-700 font-medium">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'support' && (
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Support</h1>
                <p className="text-gray-600 mb-8">Need help with your order or have a question? We're here for you.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <a href="tel:+1234567890" className="flex flex-col items-center justify-center p-8 border border-gray-200 rounded-2xl hover:border-indigo-600 hover:bg-indigo-50 transition-colors group">
                    <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Phone className="h-8 w-8" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">Call Us</h3>
                    <p className="text-gray-500 text-sm">+1 (234) 567-890</p>
                  </a>
                  
                  <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-8 border border-gray-200 rounded-2xl hover:border-emerald-600 hover:bg-emerald-50 transition-colors group">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <MessageCircle className="h-8 w-8" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">WhatsApp</h3>
                    <p className="text-gray-500 text-sm">Chat with our team</p>
                  </a>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
