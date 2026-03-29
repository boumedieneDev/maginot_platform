-- Phase 1 Website Vitrine Database Schema
-- Run this SQL in your Supabase SQL Editor

-- ============================================
-- 1. CREATE TABLES
-- ============================================

-- Services Table
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  details TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Leads Table
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company_name TEXT,
  service_id UUID REFERENCES services(id),
  wilaya TEXT NOT NULL,
  budget TEXT,
  message TEXT,
  status TEXT DEFAULT 'Nouveau' CHECK (status IN ('Nouveau', 'Contacté', 'En attente')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================
-- 2. CREATE INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_service ON leads(service_id);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);

-- ============================================
-- 3. ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. CREATE RLS POLICIES
-- ============================================

-- Services Policies
-- Public can read active services
DROP POLICY IF EXISTS "Public can view active services" ON services;
CREATE POLICY "Public can view active services"
  ON services FOR SELECT
  USING (is_active = true);

-- Authenticated users (admins) can manage all services
DROP POLICY IF EXISTS "Authenticated users can manage services" ON services;
CREATE POLICY "Authenticated users can manage services"
  ON services FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Leads Policies
-- Anyone can insert leads (public registration)
DROP POLICY IF EXISTS "Anyone can insert leads" ON leads;
CREATE POLICY "Anyone can insert leads"
  ON leads FOR INSERT
  WITH CHECK (true);

-- Only authenticated users (admins) can read leads
DROP POLICY IF EXISTS "Authenticated users can view leads" ON leads;
CREATE POLICY "Authenticated users can view leads"
  ON leads FOR SELECT
  TO authenticated
  USING (true);

-- Only authenticated users can update leads
DROP POLICY IF EXISTS "Authenticated users can update leads" ON leads;
CREATE POLICY "Authenticated users can update leads"
  ON leads FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 5. INSERT SAMPLE DATA (Optional)
-- ============================================

-- Sample Services
INSERT INTO services (name, slug, description, details, is_active) VALUES
  (
    'Consultation Juridique',
    'consultation-juridique',
    'Conseil juridique professionnel pour votre entreprise',
    'Notre service de consultation juridique vous accompagne dans toutes vos démarches légales. Nous offrons des conseils d''experts pour sécuriser vos transactions et protéger vos intérêts.',
    true
  ),
  (
    'Création d''Entreprise',
    'creation-entreprise',
    'Accompagnement complet pour la création de votre société',
    'Nous vous accompagnons dans toutes les étapes de création de votre entreprise : choix de la structure juridique, rédaction des statuts, immatriculation, et démarches administratives.',
    true
  ),
  (
    'Gestion Comptable',
    'gestion-comptable',
    'Services comptables et fiscaux pour entreprises',
    'Un service complet de gestion comptable incluant la tenue de livres, déclarations fiscales, et conseils financiers pour optimiser votre gestion.',
    true
  )
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 6. VERIFICATION QUERIES
-- ============================================

-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('services', 'leads');

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('services', 'leads');

-- Check policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename IN ('services', 'leads');

-- View sample data
SELECT * FROM services;
SELECT COUNT(*) as total_leads FROM leads;
