-- BuildTrack Pro Database Schema

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  budget_limit DECIMAL(12,2) DEFAULT 0,
  icon TEXT DEFAULT 'package',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT,
  payment_mode TEXT CHECK (payment_mode IN ('Cash', 'UPI', 'Bank')),
  contractor_name TEXT,
  receipt_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Progress Photos Table
CREATE TABLE IF NOT EXISTS progress_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  description TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_photos ENABLE ROW LEVEL SECURITY;

-- Create Policies (allow all for demo - in production, restrict to authenticated users)
CREATE POLICY "Allow all access to categories" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to transactions" ON transactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to progress_photos" ON progress_photos FOR ALL USING (true) WITH CHECK (true);

-- Storage Buckets (run in Supabase Dashboard > Storage)
-- Create bucket: 'receipts' - for expense receipts
-- Create bucket: 'progress-photos' - for site progress images

-- Seed Data
INSERT INTO categories (name, budget_limit, icon) VALUES
  ('Cement', 150000, 'hammer'),
  ('Dust', 100000, 'truck'),
  ('Labor', 200000, 'hard-hat'),
  ('Electrical', 80000, 'zap'),
  ('Plumbing', 75000, 'droplets'),
  ('Painting', 60000, 'package'),
  ('Tiles', 120000, 'package'),
  ('Steel', 180000, 'package'),
  ('Sand', 50000, 'package'),
  ('Bricks', 80000, 'package')
ON CONFLICT (name) DO NOTHING;
