import React, { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Smartphone, 
  ShoppingCart, 
  Calculator, 
  Users, 
  Tag, 
  BarChart3, 
  Shield, 
  LogOut,
  Menu,
  Bell,
  Check,
  Package,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Role } from '../types';
import { cn } from '../lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface NavItem {
  title: string;
  path: string;
  icon: React.ElementType;
  roles: Role[];
}

const navItems: NavItem[] = [
  { title: 'Dashboard', path: '/admin', icon: LayoutDashboard, roles: ['admin', 'manager', 'cashier'] },
  { title: 'POS', path: '/admin/pos', icon: Calculator, roles: ['admin', 'manager', 'cashier'] },
  { title: 'Orders', path: '/admin/orders', icon: ShoppingCart, roles: ['admin', 'manager', 'cashier'] },
  { title: 'Products', path: '/admin/products', icon: Smartphone, roles: ['admin', 'manager'] },
  { title: 'Customers', path: '/admin/customers', icon: Users, roles: ['admin', 'manager', 'cashier'] },
  { title: 'Offers', path: '/admin/offers', icon: Tag, roles: ['admin', 'manager'] },
  { title: 'Reports', path: '/admin/reports', icon: BarChart3, roles: ['admin', 'manager'] },
  { title: 'Users', path: '/admin/users', icon: Shield, roles: ['admin'] },
];

export function Layout() {
  const { user, signOut, loading } = useAuth();
  const { notifications, api } = useData();
  
  if (loading || !user) return null;

  const role = (user.user_metadata?.role as Role) || 'cashier';
  const userName = user.user_metadata?.name || user.email || 'User';
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const filteredNavItems = navItems.filter(item => item.roles.includes(role));
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order': return <Package className="h-4 w-4 text-blue-500" />;
      case 'stock': return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="h-16 flex items-center px-4 border-b border-gray-200">
          <img src="/logo.png" alt="Gunjan Telecom" className="h-10 w-10 object-contain mr-2" />
          <span className="text-lg font-bold tracking-tight">Gunjan Telecom</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={cn(
                      "flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
                      isActive 
                        ? "bg-indigo-50 text-indigo-700" 
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    <Icon className={cn("mr-3 h-5 w-5", isActive ? "text-indigo-700" : "text-gray-400")} />
                    {item.title}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center mb-4">
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
              {userName.charAt(0)}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{userName}</p>
              <p className="text-xs text-gray-500 capitalize">{role}</p>
            </div>
          </div>
          <button 
            onClick={() => signOut()}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center md:hidden">
            <img src="/logo.png" alt="Gunjan Telecom" className="h-8 w-8 object-contain mr-2" />
            <span className="text-lg font-bold">Gunjan Telecom</span>
          </div>
          <div className="hidden md:flex items-center text-sm text-gray-500">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative" ref={notifRef}>
              <button 
                className="p-2 text-gray-400 hover:text-gray-500 relative focus:outline-none"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 ring-2 ring-white"></span>
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50 overflow-hidden">
                  <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                    {unreadCount > 0 && (
                      <button 
                        onClick={() => api.markAllNotificationsAsRead()}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                      >
                        <Check className="h-3 w-3 mr-1" /> Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-sm text-gray-500">
                        No notifications yet.
                      </div>
                    ) : (
                      <ul className="divide-y divide-gray-100">
                        {notifications.map((notif) => (
                          <li 
                            key={notif.id} 
                            className={cn(
                              "p-4 hover:bg-gray-50 transition-colors cursor-pointer",
                              !notif.read ? "bg-indigo-50/30" : ""
                            )}
                            onClick={() => {
                              api.markNotificationAsRead(notif.id);
                              setShowNotifications(false);
                            }}
                          >
                            {notif.link ? (
                              <Link to={notif.link} className="flex gap-3">
                                <div className={cn(
                                  "mt-0.5 flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center",
                                  notif.type === 'order' ? "bg-blue-100" : 
                                  notif.type === 'stock' ? "bg-amber-100" : "bg-gray-100"
                                )}>
                                  {getNotificationIcon(notif.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={cn("text-sm font-medium text-gray-900", !notif.read && "font-semibold")}>
                                    {notif.title}
                                  </p>
                                  <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">
                                    {notif.message}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {notif.createdAt ? formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true }) : '–'}
                                  </p>
                                </div>
                                {!notif.read && (
                                  <div className="flex-shrink-0 flex items-center justify-center">
                                    <span className="h-2 w-2 bg-indigo-600 rounded-full"></span>
                                  </div>
                                )}
                              </Link>
                            ) : (
                              <div className="flex gap-3">
                                <div className={cn(
                                  "mt-0.5 flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center",
                                  notif.type === 'order' ? "bg-blue-100" : 
                                  notif.type === 'stock' ? "bg-amber-100" : "bg-gray-100"
                                )}>
                                  {getNotificationIcon(notif.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={cn("text-sm font-medium text-gray-900", !notif.read && "font-semibold")}>
                                    {notif.title}
                                  </p>
                                  <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">
                                    {notif.message}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {notif.createdAt ? formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true }) : '–'}
                                  </p>
                                </div>
                                {!notif.read && (
                                  <div className="flex-shrink-0 flex items-center justify-center">
                                    <span className="h-2 w-2 bg-indigo-600 rounded-full"></span>
                                  </div>
                                )}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="md:hidden flex items-center">
               <button 
                 onClick={() => signOut()}
                 className="p-2 text-gray-400 hover:text-red-500"
               >
                 <LogOut className="h-5 w-5" />
               </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24 md:pb-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 pb-safe">
        <div className="flex justify-around items-center h-16">
          {filteredNavItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full space-y-1",
                  isActive ? "text-indigo-600" : "text-gray-500 hover:text-gray-900"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{item.title}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
