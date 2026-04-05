-- ============================================================
-- Gunjon — Seed Data (Categories, Products, Banners, Offers)
-- Run this in: Supabase > SQL Editor > New Query
-- ============================================================

-- CLEAR EXISTING SEED DATA (Optional, to avoid duplicates)
-- Uncomment these if you want to wipe existing data first:
-- TRUNCATE TABLE products CASCADE;
-- TRUNCATE TABLE categories CASCADE;
-- TRUNCATE TABLE banners CASCADE;
-- TRUNCATE TABLE offers CASCADE;

-- ============================================================
-- 1. CATEGORIES
-- ============================================================
INSERT INTO categories (name, description, icon, image, color) VALUES
('Smartphones', 'Latest smartphones and mobile devices', 'Smartphone', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop', 'bg-blue-500'),
('Headphones', 'Premium audio and wireless earbuds', 'Headphones', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop', 'bg-purple-500'),
('Chargers', 'Fast chargers and power adapters', 'BatteryCharging', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=800&auto=format&fit=crop', 'bg-green-500'),
('Portable Chargers', 'Power banks and battery packs', 'Battery', 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?q=80&w=800&auto=format&fit=crop', 'bg-yellow-500'),
('Smartwatches', 'Wearables and fitness trackers', 'Watch', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop', 'bg-red-500');

-- ============================================================
-- 2. PRODUCTS
-- ============================================================
-- Smartphones
INSERT INTO products (name, brand, category, price, original_price, stock, status, image, images) VALUES
('Samsung Galaxy S24 Ultra', 'Samsung', 'Smartphones', 145000, 155000, 15, 'In Stock', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=800&auto=format&fit=crop', '["https://images.unsplash.com/photo-1610945265064-0e34e5519bbf"]'),
('Samsung Galaxy Z Fold5', 'Samsung', 'Smartphones', 185000, 200000, 8, 'Low Stock', 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?q=80&w=800&auto=format&fit=crop', '["https://images.unsplash.com/photo-1585060544812-6b45742d762f"]'),
('Samsung Galaxy A54 5G', 'Samsung', 'Smartphones', 45000, 50000, 25, 'In Stock', 'https://images.unsplash.com/photo-1649859398021-afbfe80e83b9?q=80&w=800&auto=format&fit=crop', '["https://images.unsplash.com/photo-1649859398021-afbfe80e83b9"]'),
('Apple iPhone 15 Pro Max', 'Apple', 'Smartphones', 165000, 175000, 10, 'In Stock', 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=800&auto=format&fit=crop', '["https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5"]');

-- Headphones
INSERT INTO products (name, brand, category, price, original_price, stock, status, image, images) VALUES
('Samsung Galaxy Buds2 Pro', 'Samsung', 'Headphones', 18000, 22000, 30, 'In Stock', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800&auto=format&fit=crop', '["https://images.unsplash.com/photo-1590658268037-6bf12165a8df"]'),
('Sony WH-1000XM5', 'Sony', 'Headphones', 35000, 38000, 12, 'In Stock', 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=800&auto=format&fit=crop', '["https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb"]'),
('Apple AirPods Pro (2nd Gen)', 'Apple', 'Headphones', 25000, 28000, 0, 'Out of Stock', 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=800&auto=format&fit=crop', '["https://images.unsplash.com/photo-1600294037681-c80b4cb5b434"]');

-- Chargers & Adapters
INSERT INTO products (name, brand, category, price, original_price, stock, status, image, images) VALUES
('Samsung 45W Power Adapter', 'Samsung', 'Chargers', 3500, 4500, 50, 'In Stock', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=800&auto=format&fit=crop', '["https://images.unsplash.com/photo-1583863788434-e58a36330cf0"]'),
('Anker 735 Charger (GaNPrime 65W)', 'Anker', 'Chargers', 6500, 7500, 20, 'In Stock', 'https://images.unsplash.com/photo-1615526659841-9fb93d191be8?q=80&w=800&auto=format&fit=crop', '["https://images.unsplash.com/photo-1615526659841-9fb93d191be8"]'),
('Apple 20W USB-C Power Adapter', 'Apple', 'Chargers', 2500, 3000, 40, 'In Stock', 'https://images.unsplash.com/photo-1554157140-6d0b67addd84?q=80&w=800&auto=format&fit=crop', '["https://images.unsplash.com/photo-1554157140-6d0b67addd84"]');

-- Portable Chargers
INSERT INTO products (name, brand, category, price, original_price, stock, status, image, images) VALUES
('Samsung 10000mAh Battery Pack', 'Samsung', 'Portable Chargers', 4500, 5500, 18, 'In Stock', 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?q=80&w=800&auto=format&fit=crop', '["https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5"]'),
('Anker PowerCore 10000', 'Anker', 'Portable Chargers', 3500, 4000, 25, 'In Stock', 'https://images.unsplash.com/photo-1615986200762-a1ed9610d3b1?q=80&w=800&auto=format&fit=crop', '["https://images.unsplash.com/photo-1615986200762-a1ed9610d3b1"]');

-- Smartwatches
INSERT INTO products (name, brand, category, price, original_price, stock, status, image, images) VALUES
('Samsung Galaxy Watch6 Classic', 'Samsung', 'Smartwatches', 35000, 40000, 10, 'In Stock', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop', '["https://images.unsplash.com/photo-1523275335684-37898b6baf30"]'),
('Apple Watch Series 9', 'Apple', 'Smartwatches', 45000, 48000, 15, 'In Stock', 'https://images.unsplash.com/photo-1434493789847-2f02b9dc58a0?q=80&w=800&auto=format&fit=crop', '["https://images.unsplash.com/photo-1434493789847-2f02b9dc58a0"]');


-- ============================================================
-- 3. BANNERS
-- ============================================================
INSERT INTO banners (title, subtitle, image, link) VALUES
('Samsung Galaxy S24 Ultra', 'The New Era of Mobile AI is here.', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=1200&auto=format&fit=crop', '/products'),
('Unleash Your Sound', 'Discover true noise cancellation with the latest headphones range.', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop', '/products'),
('Power On The Go', 'Never run out of battery with our 10,000mAh+ power banks.', 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?q=80&w=1200&auto=format&fit=crop', '/products');

-- ============================================================
-- 4. OFFERS
-- ============================================================
INSERT INTO offers (title, discount, status, start_date, end_date) VALUES
('Flash Sale: Chargers', 'Up to 20% OFF', 'Active', CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days'),
('Galaxy S24 Bonus', 'Buy S24 and get Buds2 Pro at 50% OFF', 'Active', CURRENT_DATE, CURRENT_DATE + INTERVAL '14 days'),
('Clearance: Old Models', 'Flat 10% OFF on all older stock', 'Active', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days');
