import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Product, Order, User, Customer, Banner, Offer, AppNotification, Category } from '../types';
import { supabase } from '../lib/supabaseClient';

// --- Mapping Utils (CamelCase frontend <-> Snake_case DB) ---
const mapProductToDB = (p: any) => {
  const data = { ...p };
  if ('originalPrice' in data) { data.original_price = data.originalPrice; delete data.originalPrice; }
  if ('isNew' in data) { data.is_new = data.isNew; delete data.isNew; }
  if ('keySpecs' in data) { data.key_specs = data.keySpecs; delete data.keySpecs; }
  if ('fullSpecs' in data) { data.full_specs = data.fullSpecs; delete data.fullSpecs; }
  return data;
};
const mapProductFromDB = (p: any) => {
  if (!p) return p;
  const data = { ...p };
  if ('original_price' in data) data.originalPrice = data.original_price;
  if ('is_new' in data) data.isNew = data.is_new;
  if ('key_specs' in data) data.keySpecs = data.key_specs || [];
  if ('full_specs' in data) data.fullSpecs = data.full_specs || {};
  return data as Product;
};

const mapOrderToDB = (o: any) => {
  const data = { ...o };
  if ('customerName' in data) { data.customer_name = data.customerName; delete data.customerName; }
  if ('customerPhone' in data) { data.customer_phone = data.customerPhone; delete data.customerPhone; }
  if ('customerEmail' in data) { data.customer_email = data.customerEmail; delete data.customerEmail; }
  if ('paymentMethod' in data) { data.payment_method = data.paymentMethod; delete data.paymentMethod; }
  if ('deliveryAddress' in data) { data.delivery_address = data.deliveryAddress; delete data.deliveryAddress; }
  if ('items' in data) delete data.items;
  return data;
};
const mapOrderFromDB = (o: any) => {
  if (!o) return o;
  const data = { ...o };
  if ('customer_name' in data) data.customerName = data.customer_name;
  if ('customer_phone' in data) data.customerPhone = data.customer_phone;
  if ('customer_email' in data) data.customerEmail = data.customer_email;
  if ('payment_method' in data) data.paymentMethod = data.payment_method;
  if ('delivery_address' in data) data.deliveryAddress = data.delivery_address;
  if ('order_items' in data) {
    data.itemsList = data.order_items.map((item: any) => {
       const mappedItem = { ...item };
       if ('product_id' in mappedItem) mappedItem.productId = mappedItem.product_id;
       return mappedItem;
    });
    data.items = data.order_items.length;
  } else if (!data.items) {
    data.items = 0;
  }
  return data as Order;
};

const mapOfferToDB = (o: any) => {
  const data = { ...o };
  if ('startDate' in data) { data.start_date = data.startDate; delete data.startDate; }
  if ('endDate' in data) { data.end_date = data.endDate; delete data.endDate; }
  if ('productIds' in data) { data.product_ids = data.productIds; delete data.productIds; }
  return data;
};
const mapOfferFromDB = (o: any) => {
  if (!o) return o;
  const data = { ...o };
  if ('start_date' in data) data.startDate = data.start_date;
  if ('end_date' in data) data.endDate = data.end_date;
  if ('product_ids' in data) data.productIds = data.product_ids || [];
  return data as Offer;
};
const mapCustomerFromDB = (c: any) => {
  if (!c) return c;
  const data = { ...c };
  if ('total_spent' in data) data.totalSpent = data.total_spent;
  if ('orders_count' in data) data.orders = data.orders_count;
  return data as Customer;
};
const mapNotificationFromDB = (n: any) => {
  if (!n) return n;
  const data = { ...n };
  if ('created_at' in data) data.createdAt = data.created_at;
  return data as AppNotification;
};
// --- End Mapping Utils ---

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
    
    // Categories
    addCategory: (category: Omit<Category, 'id'>) => Promise<Category>;
    updateCategory: (id: string, data: Partial<Category>) => Promise<Category>;
    deleteCategory: (id: string) => Promise<void>;
    
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

    // Storage
    uploadImage: (file: File, bucket: string) => Promise<string>;
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

      if (productsData) setProducts(productsData.map(mapProductFromDB));
      if (ordersData) setOrders(ordersData.map(mapOrderFromDB));
      if (bannersData) setBanners(bannersData as Banner[]);
      if (offersData) setOffers(offersData.map(mapOfferFromDB));
      if (categoriesData) setCategories(categoriesData as Category[]);
      if (customersData) setCustomers(customersData.map(mapCustomerFromDB));
      if (notificationsData) setNotifications(notificationsData.map(mapNotificationFromDB));
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
    try {
      const { data, error } = await supabase.from('notifications').insert([{
        ...notification,
        read: false
      }]).select().single();

      if (error) {
        console.warn('Could not save notification to DB (RLS or auth issue):', error.message);
        // Fallback: show in-memory notification so admin still sees it
        const fallback: AppNotification = {
          id: `local-${Date.now()}`,
          ...notification,
          read: false,
          createdAt: new Date().toISOString(),
        };
        setNotifications(prev => [fallback, ...prev]);
        return;
      }

      if (data) {
        setNotifications(prev => [mapNotificationFromDB(data), ...prev]);
      }
    } catch (err) {
      console.warn('addNotification failed silently:', err);
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
        return [...prev, { id: `cart-৳{Date.now()}`, product, quantity: Math.min(quantity, product.stock) }];
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
      return (data?.map(mapProductFromDB) || []) as Product[];
    },
    getProduct: async (id: string) => {
      const { data } = await supabase.from('products').select('*').eq('id', id).single();
      return mapProductFromDB(data);
    },
    addProduct: async (product: Omit<Product, 'id'>) => {
      const dbData = mapProductToDB(product);
      const { data, error } = await supabase.from('products').insert([dbData]).select().single();
      if (error) throw error;
      const newProduct = mapProductFromDB(data);
      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    },
    updateProduct: async (id: string, data: Partial<Product>) => {
      const dbData = mapProductToDB(data);
      const { data: updated, error } = await supabase.from('products').update(dbData).eq('id', id).select().single();
      if (error) throw error;
      
      const updatedProduct = mapProductFromDB(updated);
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
      
      if (data.stock !== undefined) {
        // Notification logic remains similar but could be triggered by Supabase functions
      }
      
      return updatedProduct;
    },
    deleteProduct: async (id: string) => {
      const { error, count } = await supabase.from('products').delete({ count: 'exact' }).eq('id', id);
      if (error) throw error;
      if (count === 0) throw new Error("Delete blocked (RLS) or product not found.");
      setProducts(prev => prev.filter(p => p.id !== id));
    },

    // Orders
    getOrders: async () => {
      const { data } = await supabase.from('orders').select('*, order_items(*)');
      return (data?.map(mapOrderFromDB) || []) as Order[];
    },
    addOrder: async (order: Omit<Order, 'id' | 'date'>) => {
      const { itemsList, ...orderData } = order;
      const dbOrder = mapOrderToDB(orderData);
      const { data: newOrderData, error: orderError } = await supabase.from('orders').insert([dbOrder]).select().single();
      
      if (orderError) throw orderError;

      const newOrder = mapOrderFromDB(newOrderData);

      if (itemsList && itemsList.length > 0) {
        const items = itemsList.map(item => {
          const newItem = { ...item, product_id: item.productId, order_id: newOrder.id };
          delete newItem.productId;
          delete newItem.id;
          return newItem;
        });
        const { error: itemsError } = await supabase.from('order_items').insert(items);
        if (itemsError) console.error('Failed to insert order items:', itemsError);
        newOrder.itemsList = itemsList;
      }

      setOrders(prev => [newOrder, ...prev]);
      
      addNotification({
        title: 'New Order Received',
        message: `Order #${newOrder.id} has been placed.`,
        type: 'order',
        link: '/admin/orders'
      });
      
      return newOrder;
    },
    updateOrder: async (id: string, data: Partial<Order>) => {
      const dbData = mapOrderToDB(data);
      const { data: updated, error } = await supabase.from('orders').update(dbData).eq('id', id).select().single();
      if (error) throw error;
      const updatedOrder = mapOrderFromDB(updated);
      setOrders(prev => prev.map(o => o.id === id ? { ...updatedOrder, itemsList: o.itemsList } : o));
      return updatedOrder;
    },

    // Customers
    getCustomers: async () => {
      const { data } = await supabase.from('customers').select('*');
      return (data?.map(mapCustomerFromDB) || []) as Customer[];
    },

    // Categories
    addCategory: async (category: Omit<Category, 'id'>) => {
      const { data, error } = await supabase.from('categories').insert([category]).select().single();
      if (error) throw error;
      setCategories(prev => [...prev, data as Category]);
      return data as Category;
    },
    updateCategory: async (id: string, data: Partial<Category>) => {
      const { data: updated, error } = await supabase.from('categories').update(data).eq('id', id).select().single();
      if (error) throw error;
      setCategories(prev => prev.map(c => c.id === id ? updated as Category : c));
      return updated as Category;
    },
    deleteCategory: async (id: string) => {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      setCategories(prev => prev.filter(c => c.id !== id));
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
      const { error, count } = await supabase.from('banners').delete({ count: 'exact' }).eq('id', id);
      if (error) throw error;
      if (count === 0) throw new Error("Delete blocked (RLS) or banner not found. Check if you are logged in properly!");
      setBanners(prev => prev.filter(b => b.id !== id));
    },

    // Offers
    getOffers: async () => {
      const { data } = await supabase.from('offers').select('*');
      return (data?.map(mapOfferFromDB) || []) as Offer[];
    },
    addOffer: async (offer: Omit<Offer, 'id'>) => {
      const dbData = mapOfferToDB(offer);
      const { data, error } = await supabase.from('offers').insert([dbData]).select().single();
      if (error) throw error;
      const newOffer = mapOfferFromDB(data);
      setOffers(prev => [...prev, newOffer]);
      return newOffer;
    },
    updateOffer: async (id: string, data: Partial<Offer>) => {
      const dbData = mapOfferToDB(data);
      const { data: updated, error } = await supabase.from('offers').update(dbData).eq('id', id).select().single();
      if (error) throw error;
      const updatedOffer = mapOfferFromDB(updated);
      setOffers(prev => prev.map(o => o.id === id ? updatedOffer : o));
      return updatedOffer;
    },
    deleteOffer: async (id: string) => {
      const { error, count } = await supabase.from('offers').delete({ count: 'exact' }).eq('id', id);
      if (error) throw error;
      if (count === 0) throw new Error("Delete blocked (RLS) or offer not found.");
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
    },

    // Storage
    uploadImage: async (file: File, bucket: string) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const { error } = await supabase.storage.from(bucket).upload(fileName, file);
      if (error) throw error;
      const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
      return data.publicUrl;
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
