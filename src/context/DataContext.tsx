import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Product, Order, User, Customer, Banner, Offer, AppNotification, Category } from '../types';
import { supabase } from '../lib/supabaseClient';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

interface DataContextType {
  products: Product[];
  orders: Order[];
  users: User[];
  customers: Customer[];
  banners: Banner[];
  offers: Offer[];
  categories: Category[];
  cart: CartItem[];
  notifications: AppNotification[];
  
  api: {
    // Cart
    addToCart: (product: Product, quantity?: number) => void;
    removeFromCart: (productId: string) => void;
    updateCartQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    
    // Products
    getProducts: () => Promise<Product[]>;
    getProduct: (id: string) => Promise<Product | undefined>;
    addProduct: (product: Omit<Product, 'id'>) => Promise<Product>;
    updateProduct: (id: string, data: Partial<Product>) => Promise<Product>;
    deleteProduct: (id: string) => Promise<void>;
    
    // Orders
    getOrders: () => Promise<Order[]>;
    addOrder: (order: Omit<Order, 'id' | 'date'>) => Promise<Order>;
    updateOrder: (id: string, data: Partial<Order>) => Promise<Order>;
    
    // Customers
    getCustomers: () => Promise<Customer[]>;
    
    // Banners
    getBanners: () => Promise<Banner[]>;
    addBanner: (banner: Omit<Banner, 'id'>) => Promise<Banner>;
    updateBanner: (id: string, data: Partial<Banner>) => Promise<Banner>;
    deleteBanner: (id: string) => Promise<void>;
    
    // Offers
    getOffers: () => Promise<Offer[]>;
    addOffer: (offer: Omit<Offer, 'id'>) => Promise<Offer>;
    updateOffer: (id: string, data: Partial<Offer>) => Promise<Offer>;
    deleteOffer: (id: string) => Promise<void>;
    
    // Users
    getUsers: () => Promise<User[]>;
    addUser: (user: Omit<User, 'id'>) => Promise<User>;
    updateUser: (id: string, data: Partial<User>) => Promise<User>;

    // Notifications
    markNotificationAsRead: (id: string) => void;
    markAllNotificationsAsRead: () => void;
  };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// DataContext creation...

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const [
        { data: productsData },
        { data: ordersData },
        { data: bannersData },
        { data: offersData },
        { data: categoriesData },
        { data: customersData },
        { data: notificationsData }
      ] = await Promise.all([
        supabase.from('products').select('*'),
        supabase.from('orders').select('*, order_items(*)'),
        supabase.from('banners').select('*'),
        supabase.from('offers').select('*'),
        supabase.from('categories').select('*'),
        supabase.from('customers').select('*'),
        supabase.from('notifications').select('*').order('created_at', { ascending: false })
      ]);

      if (productsData) setProducts(productsData as Product[]);
      if (ordersData) setOrders(ordersData.map(o => ({ ...o, itemsList: o.order_items })) as Order[]);
      if (bannersData) setBanners(bannersData as Banner[]);
      if (offersData) setOffers(offersData as Offer[]);
      if (categoriesData) setCategories(categoriesData as Category[]);
      if (customersData) setCustomers(customersData as Customer[]);
      if (notificationsData) setNotifications(notificationsData as AppNotification[]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addNotification = useCallback(async (notification: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => {
    const { data, error } = await supabase.from('notifications').insert([{
      ...notification,
      read: false
    }]).select().single();

    if (data) {
      setNotifications(prev => [data as AppNotification, ...prev]);
    }
  }, []);

  const api = {
    // Cart
    addToCart: (product: Product, quantity = 1) => {
      if (product.stock <= 0) return;
      setCart(prev => {
        const existing = prev.find(item => item.product.id === product.id);
        if (existing) {
          const newQuantity = Math.min(existing.quantity + quantity, product.stock);
          return prev.map(item => 
            item.product.id === product.id 
              ? { ...item, quantity: newQuantity }
              : item
          );
        }
        return [...prev, { id: `cart-${Date.now()}`, product, quantity: Math.min(quantity, product.stock) }];
      });
    },
    removeFromCart: (productId: string) => {
      setCart(prev => prev.filter(item => item.product.id !== productId));
    },
    updateCartQuantity: (productId: string, quantity: number) => {
      setCart(prev => prev.map(item => {
        if (item.product.id === productId) {
          const currentProduct = products.find(p => p.id === productId) || item.product;
          return { ...item, quantity: Math.min(Math.max(1, quantity), currentProduct.stock) };
        }
        return item;
      }));
    },
    clearCart: () => setCart([]),

    // Products
    getProducts: async () => {
      const { data } = await supabase.from('products').select('*');
      return (data as Product[]) || [];
    },
    getProduct: async (id: string) => {
      const { data } = await supabase.from('products').select('*').eq('id', id).single();
      return data as Product;
    },
    addProduct: async (product: Omit<Product, 'id'>) => {
      const { data, error } = await supabase.from('products').insert([product]).select().single();
      if (error) throw error;
      setProducts(prev => [...prev, data as Product]);
      return data as Product;
    },
    updateProduct: async (id: string, data: Partial<Product>) => {
      const { data: updated, error } = await supabase.from('products').update(data).eq('id', id).select().single();
      if (error) throw error;
      
      setProducts(prev => prev.map(p => p.id === id ? updated as Product : p));
      
      if (data.stock !== undefined) {
        // Notification logic remains similar but could be triggered by Supabase functions
      }
      
      return updated as Product;
    },
    deleteProduct: async (id: string) => {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      setProducts(prev => prev.filter(p => p.id !== id));
    },

    // Orders
    getOrders: async () => {
      const { data } = await supabase.from('orders').select('*, order_items(*)');
      return (data?.map(o => ({ ...o, itemsList: o.order_items })) as Order[]) || [];
    },
    addOrder: async (order: Omit<Order, 'id' | 'date'>) => {
      const { itemsList, ...orderData } = order;
      const { data: newOrder, error: orderError } = await supabase.from('orders').insert([orderData]).select().single();
      
      if (orderError) throw orderError;

      if (itemsList && itemsList.length > 0) {
        const items = itemsList.map(item => ({
          ...item,
          order_id: newOrder.id,
          id: undefined // Let Supabase generate ID
        }));
        await supabase.from('order_items').insert(items);
      }

      setOrders(prev => [{ ...newOrder, itemsList } as Order, ...prev]);
      
      addNotification({
        title: 'New Order Received',
        message: `Order #${newOrder.id} has been placed.`,
        type: 'order',
        link: '/admin/orders'
      });
      
      return { ...newOrder, itemsList } as Order;
    },
    updateOrder: async (id: string, data: Partial<Order>) => {
      const { data: updated, error } = await supabase.from('orders').update(data).eq('id', id).select().single();
      if (error) throw error;
      setOrders(prev => prev.map(o => o.id === id ? { ...updated, itemsList: o.itemsList } as Order : o));
      return updated as Order;
    },

    // Customers
    getCustomers: async () => {
      const { data } = await supabase.from('customers').select('*');
      return (data as Customer[]) || [];
    },

    // Banners
    getBanners: async () => {
      const { data } = await supabase.from('banners').select('*');
      return (data as Banner[]) || [];
    },
    addBanner: async (banner: Omit<Banner, 'id'>) => {
      const { data, error } = await supabase.from('banners').insert([banner]).select().single();
      if (error) throw error;
      setBanners(prev => [...prev, data as Banner]);
      return data as Banner;
    },
    updateBanner: async (id: string, data: Partial<Banner>) => {
      const { data: updated, error } = await supabase.from('banners').update(data).eq('id', id).select().single();
      if (error) throw error;
      setBanners(prev => prev.map(b => b.id === id ? updated as Banner : b));
      return updated as Banner;
    },
    deleteBanner: async (id: string) => {
      const { error } = await supabase.from('banners').delete().eq('id', id);
      if (error) throw error;
      setBanners(prev => prev.filter(b => b.id !== id));
    },

    // Offers
    getOffers: async () => {
      const { data } = await supabase.from('offers').select('*');
      return (data as Offer[]) || [];
    },
    addOffer: async (offer: Omit<Offer, 'id'>) => {
      const { data, error } = await supabase.from('offers').insert([offer]).select().single();
      if (error) throw error;
      setOffers(prev => [...prev, data as Offer]);
      return data as Offer;
    },
    updateOffer: async (id: string, data: Partial<Offer>) => {
      const { data: updated, error } = await supabase.from('offers').update(data).eq('id', id).select().single();
      if (error) throw error;
      setOffers(prev => prev.map(o => o.id === id ? updated as Offer : o));
      return updated as Offer;
    },
    deleteOffer: async (id: string) => {
      const { error } = await supabase.from('offers').delete().eq('id', id);
      if (error) throw error;
      setOffers(prev => prev.filter(o => o.id !== id));
    },

    // Users (In Supabase, we use metadata for roles)
    getUsers: async () => {
        // This would typically involve Supabase Admin API or a custom table
        const { data } = await supabase.from('users').select('*');
        return (data as User[]) || [];
    },
    addUser: async (user: Omit<User, 'id'>) => {
        const { data, error } = await supabase.from('users').insert([user]).select().single();
        if (error) throw error;
        setUsers(prev => [...prev, data as User]);
        return data as User;
    },
    updateUser: async (id: string, data: Partial<User>) => {
        const { data: updated, error } = await supabase.from('users').update(data).eq('id', id).select().single();
        if (error) throw error;
        setUsers(prev => prev.map(u => u.id === id ? updated as User : u));
        return updated as User;
    },

    // Notifications
    markNotificationAsRead: async (id: string) => {
      await supabase.from('notifications').update({ read: true }).eq('id', id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    },
    markAllNotificationsAsRead: async () => {
      await supabase.from('notifications').update({ read: true }).eq('read', false);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  return (
    <DataContext.Provider value={{ products, orders, users, customers, banners, offers, categories, cart, notifications, api }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
