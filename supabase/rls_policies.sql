-- ============================================================
-- Gunjon — Supabase Row Level Security (RLS) Policies
-- Run this entire file in: Supabase > SQL Editor > New Query
-- ============================================================

-- Step 1: Enable RLS on all tables
ALTER TABLE categories     ENABLE ROW LEVEL SECURITY;
ALTER TABLE products       ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders         ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items    ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers      ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners        ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers         ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications  ENABLE ROW LEVEL SECURITY;
ALTER TABLE users          ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Step 2: Public READ access (Storefront — no login required)
-- ============================================================

CREATE POLICY "Public can read products"
  ON products FOR SELECT USING (true);

CREATE POLICY "Public can read categories"
  ON categories FOR SELECT USING (true);

CREATE POLICY "Public can read banners"
  ON banners FOR SELECT USING (true);

CREATE POLICY "Public can read offers"
  ON offers FOR SELECT USING (true);

-- ============================================================
-- Step 3: Authenticated WRITE access (Admin panel)
-- ============================================================

CREATE POLICY "Authenticated users can manage products"
  ON products FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage categories"
  ON categories FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage orders"
  ON orders FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage order_items"
  ON order_items FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage customers"
  ON customers FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage banners"
  ON banners FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage offers"
  ON offers FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage notifications"
  ON notifications FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage users"
  ON users FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can read users"
  ON users FOR SELECT USING (true);

-- ============================================================
-- Profile & Customer specific policies
-- ============================================================

ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own addresses"
  ON user_addresses FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================================
-- Step 4: Anonymous INSERT (Storefront — guest checkout)
-- ============================================================

CREATE POLICY "Anyone can place an order"
  ON orders FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can insert order items"
  ON order_items FOR INSERT WITH CHECK (true);

-- ============================================================
-- Step 5: Set user roles after creating users in Auth
-- Replace the email addresses with your actual admin emails.
-- ============================================================

-- UPDATE auth.users SET raw_user_meta_data = '{"role": "admin"}'   WHERE email = 'admin@your-domain.com';
-- UPDATE auth.users SET raw_user_meta_data = '{"role": "manager"}' WHERE email = 'manager@your-domain.com';
-- UPDATE auth.users SET raw_user_meta_data = '{"role": "cashier"}' WHERE email = 'cashier@your-domain.com';

-- ============================================================
-- Step 6: Storage Roles (Run these to fix image uploads)
-- ============================================================

-- Give public access to read any images from products and banners buckets
CREATE POLICY "Public can view products images"
  ON storage.objects FOR SELECT USING (bucket_id = 'products');

CREATE POLICY "Public can view banners images"
  ON storage.objects FOR SELECT USING (bucket_id = 'banners');

-- Allow authenticated admins to upload new images
CREATE POLICY "Admins can upload product images"
  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');
  
CREATE POLICY "Admins can upload banner images"
  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'banners' AND auth.role() = 'authenticated');

-- Allow authenticated admins to delete images
CREATE POLICY "Admins can delete product images"
  ON storage.objects FOR DELETE USING (bucket_id = 'products' AND auth.role() = 'authenticated');
  
CREATE POLICY "Admins can delete banner images"
  ON storage.objects FOR DELETE USING (bucket_id = 'banners' AND auth.role() = 'authenticated');
