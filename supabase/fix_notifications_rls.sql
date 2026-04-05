-- ============================================================
-- Fix: Allow anyone (including guests) to INSERT notifications
-- This is needed so that guest checkouts trigger new order alerts
-- Run in: Supabase > SQL Editor > New Query
-- ============================================================

-- Allow public (anon) to insert notifications (e.g. from guest order placements)
DROP POLICY IF EXISTS "Anyone can insert notifications" ON notifications;
CREATE POLICY "Anyone can insert notifications"
  ON notifications FOR INSERT WITH CHECK (true);

-- Make sure authenticated users can still read and manage all notifications
DROP POLICY IF EXISTS "Authenticated users can manage notifications" ON notifications;
CREATE POLICY "Authenticated users can manage notifications"
  ON notifications FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
