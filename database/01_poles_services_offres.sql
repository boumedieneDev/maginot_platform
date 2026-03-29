-- ============================================
-- MAGINOT PLATFORM RESTRUCTURE MIGRATION
-- Adds 3-Level Hierarchy: Poles -> Services -> Offres
-- ============================================

-- 1. Create POLES Table
CREATE TABLE IF NOT EXISTS poles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Modify SERVICES Table
-- We add pole_id as a foreign key to link each service to a pole
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS pole_id UUID REFERENCES poles(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- 3. Create OFFRES Table
CREATE TABLE IF NOT EXISTS offres (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  price NUMERIC,
  currency TEXT DEFAULT 'DZD',
  badge TEXT,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create OFFRE_FEATURES Table
CREATE TABLE IF NOT EXISTS offre_features (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  offre_id UUID REFERENCES offres(id) ON DELETE CASCADE NOT NULL,
  feature_text TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================
-- ENABLE RLS & CREATE POLICIES
-- ============================================

ALTER TABLE poles ENABLE ROW LEVEL SECURITY;
ALTER TABLE offres ENABLE ROW LEVEL SECURITY;
ALTER TABLE offre_features ENABLE ROW LEVEL SECURITY;

-- Poles Policies
DROP POLICY IF EXISTS "Public can view poles" ON poles;
CREATE POLICY "Public can view poles" ON poles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage poles" ON poles;
CREATE POLICY "Authenticated users can manage poles" ON poles FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Offres Policies
DROP POLICY IF EXISTS "Public can view active offres" ON offres;
CREATE POLICY "Public can view active offres" ON offres FOR SELECT USING (status = 'Active');

DROP POLICY IF EXISTS "Authenticated users can manage offres" ON offres;
CREATE POLICY "Authenticated users can manage offres" ON offres FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Offre Features Policies
DROP POLICY IF EXISTS "Public can view offre features" ON offre_features;
CREATE POLICY "Public can view offre features" ON offre_features FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage offre features" ON offre_features;
CREATE POLICY "Authenticated users can manage offre features" ON offre_features FOR ALL TO authenticated USING (true) WITH CHECK (true);
