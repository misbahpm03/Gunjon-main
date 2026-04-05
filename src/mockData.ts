import { Product, Order, Customer, User, Offer, Banner, Category } from './types';

export const mockCategories: Category[] = [
  { id: 'CAT-1', name: 'Smartphones', description: 'The latest mobile devices', icon: 'Smartphone', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=400&auto=format&fit=crop', color: 'bg-blue-50 text-blue-600' },
  { id: 'CAT-2', name: 'Tablets', description: 'Powerful tablets for work & play', icon: 'Tablet', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=400&auto=format&fit=crop', color: 'bg-purple-50 text-purple-600' },
  { id: 'CAT-3', name: 'Accessories', description: 'Chargers, cases, and audio', icon: 'Headphones', image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=400&auto=format&fit=crop', color: 'bg-emerald-50 text-emerald-600' },
  { id: 'CAT-4', name: 'Wearables', description: 'Smartwatches and fitness trackers', icon: 'Watch', image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=400&auto=format&fit=crop', color: 'bg-orange-50 text-orange-600' }
];

export const mockBanners: Banner[] = [
  { id: 'BAN-1', title: 'iPhone 15 Pro', subtitle: 'Titanium. So strong. So light. So Pro.', image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=1200&auto=format&fit=crop', link: '/shop' },
  { id: 'BAN-2', title: 'Galaxy S24 Ultra', subtitle: 'Galaxy AI is here', image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=1200&auto=format&fit=crop', link: '/shop' }
];

export const mockProducts: Product[] = [
  { 
    id: 'PRD-001', name: 'iPhone 15 Pro Max', brand: 'Apple', category: 'Smartphones', price: 1199, originalPrice: 1299, stock: 45, status: 'In Stock', 
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=400&auto=format&fit=crop', 
    images: ['https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop'], 
    isNew: true, description: 'Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever.', 
    keySpecs: ['A17 Pro chip', 'Titanium design', '48MP Main camera', 'USB-C'], 
    fullSpecs: { 'Display': '6.7-inch Super Retina XDR', 'Processor': 'A17 Pro chip', 'Camera': '48MP Main | 12MP Ultra Wide | 12MP Telephoto', 'Battery': 'Up to 29 hours video playback' }, 
    warranty: '1 Year Apple Limited Warranty', storage: '256GB', popularity: 98 
  },
  { 
    id: 'PRD-002', name: 'Samsung Galaxy S24 Ultra', brand: 'Samsung', category: 'Smartphones', price: 1299, originalPrice: 1399, stock: 32, status: 'In Stock', 
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=400&auto=format&fit=crop', 
    images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=800&auto=format&fit=crop'], 
    isNew: true, description: 'Welcome to the era of mobile AI. With Galaxy S24 Ultra in your hands, you can unleash whole new levels of creativity, productivity and possibility.', 
    keySpecs: ['Snapdragon 8 Gen 3', 'Titanium exterior', '200MP camera', 'Built-in S Pen'], 
    fullSpecs: { 'Display': '6.8-inch Dynamic AMOLED 2X', 'Processor': 'Snapdragon 8 Gen 3', 'Camera': '200MP Wide | 50MP Telephoto | 12MP Ultra Wide', 'Battery': '5000mAh' }, 
    warranty: '1 Year Samsung Warranty', storage: '512GB', popularity: 95 
  },
  { 
    id: 'PRD-003', name: 'AirPods Pro (2nd Gen)', brand: 'Apple', category: 'Accessories', price: 249, stock: 120, status: 'In Stock', 
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=400&auto=format&fit=crop', 
    images: ['https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=800&auto=format&fit=crop'], 
    isNew: false, description: 'Rich, high-quality audio and voice. Up to 2x more Active Noise Cancellation than the previous generation.', 
    keySpecs: ['H2 chip', 'Active Noise Cancellation', 'Adaptive Transparency', 'MagSafe Charging Case'], 
    fullSpecs: { 'Audio': 'Custom high-excursion Apple driver', 'Chip': 'Apple H2 headphone chip', 'Battery': 'Up to 6 hours of listening time', 'Connectivity': 'Bluetooth 5.3' }, 
    warranty: '1 Year Apple Limited Warranty', popularity: 90 
  },
  { 
    id: 'PRD-004', name: 'MagSafe Charger', brand: 'Apple', category: 'Accessories', price: 39, originalPrice: 49, stock: 8, status: 'Low Stock', 
    image: 'https://images.unsplash.com/photo-1615526675159-e248c3021d3f?q=80&w=400&auto=format&fit=crop', 
    images: ['https://images.unsplash.com/photo-1615526675159-e248c3021d3f?q=80&w=800&auto=format&fit=crop'], 
    isNew: false, description: 'The MagSafe Charger makes wireless charging a snap. The perfectly aligned magnets attach to your iPhone.', 
    keySpecs: ['Up to 15W wireless charging', 'Magnetic alignment', 'USB-C compatible'], 
    fullSpecs: { 'Type': 'Wireless Charger', 'Output': 'Up to 15W', 'Connector': 'USB-C', 'Compatibility': 'iPhone 12 or later' }, 
    warranty: '1 Year Apple Limited Warranty', popularity: 85 
  },
  { 
    id: 'PRD-005', name: 'Google Pixel 8 Pro', brand: 'Google', category: 'Smartphones', price: 999, stock: 0, status: 'Out of Stock', 
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=400&auto=format&fit=crop', 
    images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=800&auto=format&fit=crop'], 
    isNew: true, description: 'The all-pro Google phone. Pixel 8 Pro is the all-pro phone engineered by Google. It’s sleek, sophisticated, powerful, and secure.', 
    keySpecs: ['Google Tensor G3', 'Pro-level cameras', 'Super Actua display', 'Thermometer sensor'], 
    fullSpecs: { 'Display': '6.7-inch Super Actua display', 'Processor': 'Google Tensor G3', 'Camera': '50MP Wide | 48MP Ultrawide | 48MP Telephoto', 'Battery': '5050mAh' }, 
    warranty: '1 Year Google Warranty', storage: '128GB', popularity: 88 
  },
  { 
    id: 'PRD-006', name: 'iPad Pro 12.9"', brand: 'Apple', category: 'Tablets', price: 1099, originalPrice: 1199, stock: 15, status: 'In Stock', 
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=400&auto=format&fit=crop', 
    images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800&auto=format&fit=crop'], 
    isNew: false, description: 'Astonishing performance. Incredibly advanced displays. Superfast wireless connectivity. Next-level Apple Pencil capabilities.', 
    keySpecs: ['M2 chip', 'Liquid Retina XDR display', 'ProMotion technology', 'Face ID'], 
    fullSpecs: { 'Display': '12.9-inch Liquid Retina XDR', 'Processor': 'Apple M2', 'Camera': '12MP Wide | 10MP Ultra Wide', 'Battery': 'Up to 10 hours' }, 
    warranty: '1 Year Apple Limited Warranty', storage: '256GB', popularity: 92 
  },
  { 
    id: 'PRD-007', name: 'Galaxy Tab S9 Ultra', brand: 'Samsung', category: 'Tablets', price: 1199, stock: 20, status: 'In Stock', 
    image: 'https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?q=80&w=400&auto=format&fit=crop', 
    images: ['https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?q=80&w=800&auto=format&fit=crop'], 
    isNew: true, description: 'The new standard of premium tablets. Our largest Dynamic AMOLED 2X display. More durable than ever and water resistant.', 
    keySpecs: ['14.6" AMOLED display', 'Snapdragon 8 Gen 2', 'S Pen included', 'IP68 rating'], 
    fullSpecs: { 'Display': '14.6-inch Dynamic AMOLED 2X', 'Processor': 'Snapdragon 8 Gen 2', 'Camera': '13MP Wide | 8MP Ultra Wide', 'Battery': '11200mAh' }, 
    warranty: '1 Year Samsung Warranty', storage: '256GB', popularity: 87 
  },
  { 
    id: 'PRD-008', name: 'Anker 737 Power Bank', brand: 'Anker', category: 'Accessories', price: 149, stock: 50, status: 'In Stock', 
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?q=80&w=400&auto=format&fit=crop', 
    images: ['https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?q=80&w=800&auto=format&fit=crop'], 
    isNew: false, description: 'PowerCore 24K. Ultra-Powerful Two-Way Charging. Equipped with the latest Power Delivery 3.1 and bi-directional technology.', 
    keySpecs: ['24,000mAh capacity', '140W Two-Way Fast Charging', 'Smart Digital Display', '3 Ports'], 
    fullSpecs: { 'Capacity': '24,000mAh', 'Output': '140W Max', 'Ports': '2x USB-C, 1x USB-A', 'Display': 'Smart Digital Display' }, 
    warranty: '18 Months Anker Warranty', popularity: 82 
  },
];

export const mockOrders: Order[] = [
  { 
    id: 'ORD-1024', 
    customerName: 'Alice Johnson', 
    customerPhone: '+1 555-0101',
    customerEmail: 'alice@example.com',
    date: '2026-04-01T10:30:00Z', 
    total: 1448, 
    status: 'Delivered', 
    items: 2,
    paymentMethod: 'Credit Card (Visa ending in 4242)',
    deliveryAddress: '123 Tech Avenue, Silicon Valley, CA 94025',
    itemsList: [
      { id: 'item-1', productId: 'PRD-001', name: 'iPhone 15 Pro Max', price: 1199, quantity: 1, image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=400&auto=format&fit=crop' },
      { id: 'item-2', productId: 'PRD-003', name: 'AirPods Pro (2nd Gen)', price: 249, quantity: 1, image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=400&auto=format&fit=crop' }
    ]
  },
  { 
    id: 'ORD-1025', 
    customerName: 'Bob Smith', 
    customerPhone: '+1 555-0102',
    customerEmail: 'bob@example.com',
    date: '2026-04-01T11:15:00Z', 
    total: 39, 
    status: 'Pending', 
    items: 1,
    paymentMethod: 'PayPal',
    deliveryAddress: '456 Startup Blvd, Austin, TX 78701',
    itemsList: [
      { id: 'item-3', productId: 'PRD-004', name: 'MagSafe Charger', price: 39, quantity: 1, image: 'https://images.unsplash.com/photo-1615526675159-e248c3021d3f?q=80&w=400&auto=format&fit=crop' }
    ]
  },
  { 
    id: 'ORD-1026', 
    customerName: 'Charlie Davis', 
    customerPhone: '+1 555-0103',
    customerEmail: 'charlie@example.com',
    date: '2026-04-01T12:05:00Z', 
    total: 1299, 
    status: 'Confirmed', 
    items: 1,
    paymentMethod: 'Apple Pay',
    deliveryAddress: '789 Innovation Drive, Seattle, WA 98109',
    itemsList: [
      { id: 'item-4', productId: 'PRD-002', name: 'Samsung Galaxy S24 Ultra', price: 1299, quantity: 1, image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=400&auto=format&fit=crop' }
    ]
  },
  { 
    id: 'ORD-1027', 
    customerName: 'Diana Prince', 
    customerPhone: '+1 555-0104',
    customerEmail: 'diana@example.com',
    date: '2026-04-01T13:45:00Z', 
    total: 249, 
    status: 'Cancelled', 
    items: 1,
    paymentMethod: 'Credit Card (Mastercard ending in 8899)',
    deliveryAddress: '321 Hero Street, New York, NY 10001',
    itemsList: [
      { id: 'item-5', productId: 'PRD-003', name: 'AirPods Pro (2nd Gen)', price: 249, quantity: 1, image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=400&auto=format&fit=crop' }
    ]
  },
  { 
    id: 'ORD-1028', 
    customerName: 'Evan Wright', 
    customerPhone: '+1 555-0105',
    customerEmail: 'evan@example.com',
    date: '2026-04-01T14:20:00Z', 
    total: 2298, 
    status: 'Pending', 
    items: 2,
    paymentMethod: 'Bank Transfer',
    deliveryAddress: '654 Maker Lane, Portland, OR 97204',
    itemsList: [
      { id: 'item-6', productId: 'PRD-006', name: 'iPad Pro 12.9"', price: 1099, quantity: 1, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=400&auto=format&fit=crop' },
      { id: 'item-7', productId: 'PRD-007', name: 'Galaxy Tab S9 Ultra', price: 1199, quantity: 1, image: 'https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?q=80&w=400&auto=format&fit=crop' }
    ]
  },
];

export const mockCustomers: Customer[] = [
  { id: 'CUS-001', name: 'Alice Johnson', email: 'alice@example.com', phone: '+1 555-0101', totalSpent: 3450, orders: 4 },
  { id: 'CUS-002', name: 'Bob Smith', email: 'bob@example.com', phone: '+1 555-0102', totalSpent: 120, orders: 2 },
  { id: 'CUS-003', name: 'Charlie Davis', email: 'charlie@example.com', phone: '+1 555-0103', totalSpent: 1299, orders: 1 },
  { id: 'CUS-004', name: 'Diana Prince', email: 'diana@example.com', phone: '+1 555-0104', totalSpent: 850, orders: 3 },
  { id: 'CUS-005', name: 'Evan Wright', email: 'evan@example.com', phone: '+1 555-0105', totalSpent: 2298, orders: 1 },
];

export const mockUsers: User[] = [
  { id: 'USR-001', name: 'Admin User', email: 'admin@mobileshop.com', role: 'admin', status: 'Active' },
  { id: 'USR-002', name: 'Store Manager', email: 'manager@mobileshop.com', role: 'manager', status: 'Active' },
  { id: 'USR-003', name: 'Cashier One', email: 'cashier1@mobileshop.com', role: 'cashier', status: 'Active' },
  { id: 'USR-004', name: 'Cashier Two', email: 'cashier2@mobileshop.com', role: 'cashier', status: 'Inactive' },
];

export const mockOffers: Offer[] = [
  { id: 'OFF-001', title: 'Summer Sale', discount: '15% OFF', status: 'Active', startDate: '2026-06-01', endDate: '2026-06-30', productIds: ['PRD-001', 'PRD-002', 'PRD-003'] },
  { id: 'OFF-002', title: 'Back to School', discount: '৳50 OFF Tablets', status: 'Scheduled', startDate: '2026-08-15', endDate: '2026-09-15', productIds: ['PRD-006', 'PRD-007'] },
  { id: 'OFF-003', title: 'Black Friday', discount: 'Up to 40% OFF', status: 'Expired', startDate: '2025-11-25', endDate: '2025-11-30', productIds: ['PRD-004', 'PRD-005', 'PRD-008'] },
];
