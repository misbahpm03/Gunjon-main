import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Button } from '../components/ui/Button';
import { User, Package, MapPin, Heart, Phone, MessageCircle, LogOut, Loader2, CheckCircle2, Truck, Clock } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Link } from 'react-router-dom';
import { Order } from '../types';

export function Profile() {
  const { user, signOut } = useAuth();
  const { products } = useData();
  const isAuthenticated = !!user;

  const [activeTab, setActiveTab] = useState('info');
  
  // Auth Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Profile Data State
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // User Entities State
  const [addresses, setAddresses] = useState<any[]>([]);
  const [myOrders, setMyOrders] = useState<any[]>([]);
  
  // Address Form State
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddressType, setNewAddressType] = useState('Home');
  const [newAddressRaw, setNewAddressRaw] = useState('');

  const [wishlist, setWishlist] = useState([products[0], products[1]].filter(Boolean));

  // Initialize Data on Login
  useEffect(() => {
    if (user) {
      setProfileName(user.user_metadata?.full_name || '');
      setProfilePhone(user.user_metadata?.phone || '');
      fetchAddresses();
      fetchOrders();
    }
  }, [user]);

  const fetchAddresses = async () => {
    if (!user) return;
    const { data } = await supabase.from('user_addresses').select('*').eq('user_id', user.id);
    if (data) setAddresses(data);
  };

  const fetchOrders = async () => {
    if (!user) return;
    const { data } = await supabase.from('orders').select('*, order_items(*)').eq('user_id', user.id).order('created_at', { ascending: false });
    if (data) setMyOrders(data);
  };

  // Auth Handlers
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName }
          }
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      setAuthError(err.message || 'An error occurred during authentication.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Profile Handlers
  const handleUpdateProfile = async () => {
    setIsSavingProfile(true);
    try {
      await supabase.auth.updateUser({
        data: { full_name: profileName, phone: profilePhone }
      });
      alert('Profile updated successfully!');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Address Handlers
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const { error } = await supabase.from('user_addresses').insert({
      user_id: user.id,
      title: newAddressType,
      address: newAddressRaw
    });
    if (!error) {
      setIsAddingAddress(false);
      setNewAddressRaw('');
      fetchAddresses();
    }
  };

  const handleDeleteAddress = async (id: string) => {
    await supabase.from('user_addresses').delete().eq('id', id);
    fetchAddresses();
  };

  const handleRemoveWishlist = (id: string) => {
    setWishlist(prev => prev.filter(p => p.id !== id));
  };


  // ==========================================
  // VIEW: AUTHENTICATION (Logged Out)
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-24 flex justify-center text-left">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">
            {isSignUp ? 'Create an Account' : 'Welcome Back'}
          </h1>
          
          {authError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 font-medium">
              {authError}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium" 
                  placeholder="John Doe" 
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium" 
                placeholder="developer@example.com" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium" 
                placeholder="••••••••" 
              />
            </div>
            <Button type="submit" className="w-full h-12 text-lg rounded-xl mt-4 bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5 shadow-md transition-all font-bold" disabled={authLoading}>
              {authLoading ? <Loader2 className="animate-spin h-5 w-5" /> : (isSignUp ? 'Sign Up' : 'Sign In')}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500 font-medium">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button 
              onClick={() => { setIsSignUp(!isSignUp); setAuthError(''); }} 
              className="ml-2 font-bold text-indigo-600 hover:text-indigo-800"
            >
              {isSignUp ? 'Log in' : 'Create one'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: DASHBOARD (Logged In)
  // ==========================================
  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="bg-white border border-gray-200 shadow-sm rounded-3xl p-6 mb-6 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-indigo-100 text-indigo-600 mb-4 shadow-inner">
              <span className="text-3xl font-bold">{profileName.charAt(0) || 'U'}</span>
            </div>
            <h2 className="text-xl font-extrabold text-gray-900">{profileName || 'Customer'}</h2>
            <p className="text-gray-500 text-sm mb-6 font-medium">{user.email}</p>
            <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 rounded-xl" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" /> Secure Log Out
            </Button>
          </div>
          
          <nav className="space-y-2 bg-white rounded-3xl shadow-sm border border-gray-200 p-4">
            <button onClick={() => setActiveTab('info')} className={`w-full flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'info' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
              <User className="h-5 w-5 mr-3" /> Personal Info
            </button>
            <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'orders' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
              <Package className="h-5 w-5 mr-3" /> My Orders
            </button>
            <button onClick={() => setActiveTab('addresses')} className={`w-full flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'addresses' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
              <MapPin className="h-5 w-5 mr-3" /> Saved Addresses
            </button>
            <button onClick={() => setActiveTab('wishlist')} className={`w-full flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'wishlist' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
              <Heart className="h-5 w-5 mr-3" /> Wishlist
            </button>
            <button onClick={() => setActiveTab('support')} className={`w-full flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'support' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
              <Phone className="h-5 w-5 mr-3" /> Support Help
            </button>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          <div className="bg-white border border-gray-200 shadow-sm rounded-3xl p-6 md:p-10 relative overflow-hidden min-h-[500px]">
            
            {/* 1. Personal Info */}
            {activeTab === 'info' && (
              <div className="animate-in fade-in duration-300">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Personal Information</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Display Name</label>
                    <input 
                      type="text" 
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full border-gray-200 bg-gray-50 rounded-xl px-4 py-3 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500 transition-colors font-medium" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Account Email</label>
                    <input 
                      type="email" 
                      disabled
                      value={user.email} 
                      className="w-full border-gray-200 bg-gray-100 text-gray-500 rounded-xl px-4 py-3 cursor-not-allowed font-medium" 
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Contact Phone Number</label>
                    <input 
                      type="tel" 
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      className="w-full border-gray-200 bg-gray-50 rounded-xl px-4 py-3 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500 transition-colors font-medium" 
                      placeholder="+1 (555) 000-0000" 
                    />
                  </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-100">
                  <Button onClick={handleUpdateProfile} disabled={isSavingProfile} className="rounded-xl px-8 h-12 font-bold shadow-md">
                    {isSavingProfile ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            )}

            {/* 2. My Orders */}
            {activeTab === 'orders' && (
              <div className="animate-in fade-in duration-300">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8">My Orders</h1>
                {myOrders.length === 0 ? (
                  <div className="py-12 text-center bg-gray-50 rounded-2xl border border-gray-100">
                    <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">You haven't placed any orders yet.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {myOrders.map(order => (
                      <div key={order.id} className="border border-gray-200 shadow-sm rounded-2xl p-6 bg-white overflow-hidden">
                        <div className="flex flex-wrap justify-between items-start gap-4 mb-6 pb-6 border-b border-gray-100">
                          <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Order ID</p>
                            <p className="font-bold text-gray-900 text-sm">{order.id.split('-')[0]}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Date Placed</p>
                            <p className="font-bold text-gray-900 text-sm">{new Date(order.created_at || order.date).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Total</p>
                            <p className="font-extrabold text-indigo-600 text-lg">৳{order.total.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                              order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                              order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                              'bg-orange-100 text-orange-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          {order.order_items?.map((item: any) => (
                            <div key={item.id} className="flex items-center gap-4">
                              <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center">
                                {item.image ? <img src={item.image} className="w-10 h-10 object-contain mix-blend-multiply" /> : <Package className="h-6 w-6 text-gray-400" />}
                              </div>
                              <div className="flex-1">
                                <p className="font-bold text-gray-900">{item.name}</p>
                                <p className="text-sm font-medium text-gray-500">Qty: {item.quantity}</p>
                              </div>
                              <p className="font-bold text-gray-900">৳{(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. Saved Addresses */}
            {activeTab === 'addresses' && (
              <div className="animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                  <h1 className="text-3xl font-extrabold text-gray-900">Saved Addresses</h1>
                  {!isAddingAddress && (
                    <Button onClick={() => setIsAddingAddress(true)} className="rounded-xl shadow-md font-bold text-sm">
                      + Add New Address
                    </Button>
                  )}
                </div>

                {isAddingAddress && (
                  <form onSubmit={handleAddAddress} className="mb-8 bg-gray-50 p-6 rounded-2xl border border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-4">Add a new delivery address</h3>
                    <div className="space-y-4 max-w-xl">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Location Title</label>
                        <select 
                          value={newAddressType} 
                          onChange={e => setNewAddressType(e.target.value)}
                          className="w-full rounded-xl border-gray-200 bg-white py-3 focus:ring-indigo-500 font-medium"
                        >
                          <option>Home</option>
                          <option>Work</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Full Address</label>
                        <textarea 
                          required
                          value={newAddressRaw}
                          onChange={e => setNewAddressRaw(e.target.value)}
                          rows={3} 
                          className="w-full rounded-xl border-gray-200 bg-white p-3 focus:ring-indigo-500 resize-none font-medium text-sm text-gray-900"
                          placeholder="Street, Building, Apartment, City, Postal Code"
                        ></textarea>
                      </div>
                      <div className="flex gap-3">
                        <Button type="submit">Save Address</Button>
                        <Button type="button" variant="outline" onClick={() => setIsAddingAddress(false)}>Cancel</Button>
                      </div>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.length === 0 && !isAddingAddress && (
                    <div className="col-span-full py-10 text-center text-gray-500 font-medium bg-gray-50 rounded-2xl border border-gray-100">
                      You haven't saved any addresses yet.
                    </div>
                  )}
                  {addresses.map(addr => (
                    <div key={addr.id} className="border border-gray-200 shadow-sm rounded-2xl p-6 flex flex-col justify-between hover:border-indigo-300 transition-colors bg-white">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <MapPin className="h-5 w-5 text-indigo-600" />
                          <span className="font-extrabold text-gray-900">{addr.title}</span>
                        </div>
                        <p className="text-gray-600 font-medium text-sm leading-relaxed mb-6">{addr.address}</p>
                      </div>
                      <div className="flex justify-end pt-4 border-t border-gray-50">
                        <button onClick={() => handleDeleteAddress(addr.id)} className="text-sm font-bold text-red-500 hover:text-red-700 hover:underline">
                          Delete Address
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Support and Wishlist exist via raw mocks from earlier */}
            {activeTab === 'support' && (
              <div className="animate-in fade-in duration-300">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Support Help</h1>
                <p className="text-gray-600 font-medium mb-8">Need help with your order or have a question? We're here for you.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <a href="tel:+1234567890" className="flex flex-col items-center justify-center p-8 border border-gray-200 rounded-3xl hover:border-indigo-600 hover:shadow-md transition-all group">
                    <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Phone className="h-8 w-8" />
                    </div>
                    <h3 className="font-extrabold text-gray-900 mb-1">Call Us</h3>
                    <p className="text-gray-500 text-sm font-medium">+1 (234) 567-890</p>
                  </a>
                </div>
              </div>
            )}
            
            {activeTab === 'wishlist' && (
              <div className="animate-in fade-in duration-300">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-6">My Wishlist</h1>
                <p className="text-gray-500 font-medium">Wishlist syncing not available.</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
