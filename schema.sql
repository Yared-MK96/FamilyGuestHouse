-- Family Guest House - Supabase Schema
-- Run this in the Supabase SQL Editor to set up your database

-- Settings table (key-value store for all site settings)
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  badge TEXT,
  bed_type TEXT,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  amenities JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admins table (for multi-admin setups)
CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (optional, since we use API-level auth)
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public read access" ON settings FOR SELECT USING (true);
CREATE POLICY "Public read access" ON rooms FOR SELECT USING (true);
CREATE POLICY "Public read access" ON gallery FOR SELECT USING (true);

-- Allow admin full access (authenticated via API, not RLS)
-- We handle auth at the API level, so these are permissive:
CREATE POLICY "Full access for authenticated" ON settings USING (true) WITH CHECK (true);
CREATE POLICY "Full access for authenticated" ON rooms USING (true) WITH CHECK (true);
CREATE POLICY "Full access for authenticated" ON gallery USING (true) WITH CHECK (true);
CREATE POLICY "Full access for authenticated" ON admins USING (true) WITH CHECK (true);

-- Insert default settings
INSERT INTO settings (key, value) VALUES
  ('hero_title', 'Welcome to<br /><span class="hero-brand">Family Guest House</span>'),
  ('hero_subtitle', 'Comfort, safety, and affordable rooms for your stay'),
  ('hero_badge', 'Trusted by Guests Since 2010'),
  ('hero_stat1_label', 'Happy Guests'),
  ('hero_stat1_value', '500+'),
  ('hero_stat2_label', 'Room Types'),
  ('hero_stat2_value', '4'),
  ('hero_stat3_label', 'Support'),
  ('hero_stat3_value', '24/7'),
  ('features_title_1', 'Safe & Secure'),
  ('features_sub_1', '24/7 security'),
  ('features_title_2', 'Fresh Towels'),
  ('features_sub_2', 'Daily supply'),
  ('features_title_3', 'Free Wi-Fi'),
  ('features_sub_3', 'All rooms'),
  ('features_title_4', 'En-Suite Bathroom'),
  ('features_sub_4', 'Every room'),
  ('testimonial_1_text', 'Absolutely loved my stay! The staff was super friendly and the room was spotless.'),
  ('testimonial_1_author', '– Meron T.'),
  ('testimonial_2_text', 'Very affordable and comfortable. Will definitely come back again!'),
  ('testimonial_2_author', '– Yonas B.'),
  ('testimonial_3_text', 'The Deluxe room exceeded my expectations. Highly recommend for families.'),
  ('testimonial_3_author', '– Sara K.'),
  ('contact_title', 'Ready to Book?'),
  ('contact_subtitle', 'Contact us directly on Telegram for instant availability checks and reservations.'),
  ('contact_note', 'Contact us directly for availability and booking'),
  ('telegram_link', 'https://t.me/Jaredo_m'),
  ('phone_number', ''),
  ('location', 'Addis Ababa, Ethiopia'),
  ('checkin_time', '12:00 PM'),
  ('checkout_time', '11:00 AM'),
  ('hero_image', '/hotel_hero.png'),
  ('show_prices', 'true')
ON CONFLICT (key) DO NOTHING;

-- Insert default rooms
INSERT INTO rooms (name, description, price, badge, bed_type, is_featured, sort_order) VALUES
  ('Single Room', 'Perfect for solo travelers seeking a comfortable, clean, and budget-friendly place to rest. Includes a cozy single bed, private bathroom, and all essentials.', 49, 'Most Affordable', 'Single bed', false, 1),
  ('Standard Room', 'Our most popular choice — a spacious room with a queen-size bed, modern furnishings, and everything you need for a relaxing stay.', 79, 'Most Popular', 'Queen bed', true, 2),
  ('Double Bed Room', 'Ideal for couples or friends traveling together. Features a comfortable double bed, en-suite bathroom, high-speed Wi-Fi, and complete modern comfort.', 99, 'Great Value', 'Double bed', false, 3),
  ('Deluxe Room', 'Experience premium luxury in our spacious Deluxe suite — king-size bed, upscale decor, panoramic views, and top-tier amenities.', 149, 'Luxury Pick', 'King bed', false, 4)
ON CONFLICT DO NOTHING;
