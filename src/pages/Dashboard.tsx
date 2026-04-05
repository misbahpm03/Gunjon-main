import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { DollarSign, ShoppingBag, AlertTriangle, TrendingUp, Package, Star, X } from 'lucide-react';
import { useData } from '../context/DataContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

const salesData = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 2000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
];

const categoryData = [
  { name: 'Smartphones', value: 45 },
  { name: 'Accessories', value: 30 },
  { name: 'Tablets', value: 15 },
  { name: 'Wearables', value: 10 },
];

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

export function Dashboard() {
  const { role } = useAuth();
  const { orders, products } = useData();
  const [dateFilter, setDateFilter] = useState<'today' | 'weekly' | 'monthly'>('monthly');
  
  const [showNewOrderAlert, setShowNewOrderAlert] = useState(false);
  const [prevOrderCount, setPrevOrderCount] = useState(orders.length);

  useEffect(() => {
    if (orders.length > prevOrderCount) {
      setShowNewOrderAlert(true);
      setPrevOrderCount(orders.length);
      
      const timer = setTimeout(() => {
        setShowNewOrderAlert(false);
      }, 5000);
      return () => clearTimeout(timer);
    } else if (orders.length < prevOrderCount) {
      setPrevOrderCount(orders.length);
    }
  }, [orders.length, prevOrderCount]);
  
  // Cashier View Logic
  const todaysSales = orders.filter(o => o.date.startsWith('2026-04-01'));
  const todaysRevenue = todaysSales.reduce((acc, order) => acc + order.total, 0);

  if (role === 'cashier') {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Today's Overview</h1>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Today's Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${todaysRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Today's Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todaysSales.length}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todaysSales.map(order => (
                <div key={order.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{order.customerName}</p>
                    <p className="text-xs text-gray-500">{new Date(order.date).toLocaleTimeString()}</p>
                  </div>
                  <div className="font-medium text-sm">+${order.total.toLocaleString()}</div>
                </div>
              ))}
              {todaysSales.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No transactions today yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin/Manager View Logic
  const baseRevenue = orders.reduce((acc, order) => acc + order.total, 0);
  const baseOrders = orders.length;

  const multiplier = dateFilter === 'today' ? 1 : dateFilter === 'weekly' ? 7 : 30;
  
  const filteredRevenue = baseRevenue * multiplier;
  const filteredOrders = baseOrders * multiplier;

  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 10);
  const outOfStockProducts = products.filter(p => p.stock === 0);
  const topSellingProducts = [...products].sort((a, b) => b.popularity - a.popularity).slice(0, 5);

  return (
    <div className="space-y-6 relative">
      {showNewOrderAlert && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center shadow-lg animate-in slide-in-from-top-2">
          <span className="font-medium mr-2">New Order Received!</span>
          <button onClick={() => setShowNewOrderAlert(false)} className="text-green-700 hover:text-green-900">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        
        <div className="flex bg-white border border-gray-200 rounded-md p-1 shadow-sm">
          {(['today', 'weekly', 'monthly'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setDateFilter(filter)}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-sm capitalize transition-colors",
                dateFilter === filter 
                  ? "bg-indigo-50 text-indigo-700 shadow-sm" 
                  : "text-gray-500 hover:text-gray-900"
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      
      {/* Top Widgets */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${filteredRevenue.toLocaleString()}</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" /> +12.5% from previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredOrders}</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" /> +8.2% from previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Low Stock Alert</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{lowStockProducts.length + outOfStockProducts.length}</div>
            <p className="text-xs text-gray-500 mt-1">
              {outOfStockProducts.length} out of stock, {lowStockProducts.length} low stock
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Top Product</CardTitle>
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold truncate" title={topSellingProducts[0]?.name}>
              {topSellingProducts[0]?.name}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {topSellingProducts[0]?.category}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#F9FAFB' }}
                    itemStyle={{ color: '#F9FAFB' }}
                  />
                  <Line type="monotone" dataKey="sales" stroke="#4F46E5" strokeWidth={3} dot={{ r: 4, fill: '#4F46E5' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#F9FAFB' }}
                    itemStyle={{ color: '#F9FAFB' }}
                    formatter={(value: number) => [`${value}%`, 'Share']}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Latest Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.slice(0, 5).map(order => (
                <div key={order.id} className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{order.customerName}</p>
                    <div className="flex items-center text-xs text-gray-500 space-x-2">
                      <span>{order.id}</span>
                      <span>•</span>
                      <span>{new Date(order.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <div className="font-medium text-sm">${order.total.toLocaleString()}</div>
                    <span className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-medium",
                      order.status === 'Delivered' ? "bg-green-100 text-green-700" :
                      order.status === 'Confirmed' ? "bg-blue-100 text-blue-700" :
                      order.status === 'Pending' ? "bg-amber-100 text-amber-700" :
                      "bg-red-100 text-red-700"
                    )}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSellingProducts.map((product, index) => (
                <div key={product.id} className="flex items-center space-x-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-xs text-gray-500 truncate">{product.category}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium">${product.price}</span>
                    <span className="text-[10px] text-gray-500">{product.popularity} sales</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

