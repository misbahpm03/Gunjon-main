import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Layout } from './components/Layout';
import { CustomerLayout } from './components/CustomerLayout';

// Admin Pages
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';
import { Orders } from './pages/Orders';
import { POS } from './pages/POS';
import { Customers } from './pages/Customers';
import { Offers } from './pages/Offers';
import { Reports } from './pages/Reports';
import { Users } from './pages/Users';
import { Login } from './pages/Login';

// Customer Pages
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetails } from './pages/ProductDetails';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { OrderSuccess } from './pages/OrderSuccess';
import { Categories } from './pages/Categories';
import { Profile } from './pages/Profile';
import { About } from './pages/About';

import { CustomerOffers } from './pages/CustomerOffers';

// A simple wrapper to check roles and authentication
function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  const role = user.user_metadata?.role || 'cashier';
  
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  return <>{children}</>;
}

function AdminLayoutWrapper() {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }
  return <Layout />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Customer Facing Storefront */}
      <Route path="/" element={<CustomerLayout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="offers" element={<CustomerOffers />} />
        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="order-success" element={<OrderSuccess />} />
        <Route path="categories" element={<Categories />} />
        <Route path="profile" element={<Profile />} />
        <Route path="about" element={<About />} />
      </Route>

      {/* Admin Login */}
      <Route path="/admin/login" element={<Login />} />

      {/* Admin Panel */}
      <Route path="/admin" element={<AdminLayoutWrapper />}>
        <Route index element={<Dashboard />} />
        <Route path="pos" element={<POS />} />
        <Route path="orders" element={<Orders />} />
        <Route path="customers" element={<Customers />} />
        
        <Route path="products" element={
          <ProtectedRoute allowedRoles={['admin', 'manager']}>
            <Products />
          </ProtectedRoute>
        } />
        
        <Route path="offers" element={
          <ProtectedRoute allowedRoles={['admin', 'manager']}>
            <Offers />
          </ProtectedRoute>
        } />
        
        <Route path="reports" element={
          <ProtectedRoute allowedRoles={['admin', 'manager']}>
            <Reports />
          </ProtectedRoute>
        } />
        
        <Route path="users" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Users />
          </ProtectedRoute>
        } />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <AppRoutes />
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
