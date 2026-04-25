-- ============================================
-- NEXT GOAL — Schéma base de données Supabase
-- Exécuter dans : Supabase > SQL Editor
-- ============================================

-- 1. TABLE PROFILES (étend auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('player', 'recruiter', 'agent', 'club', 'admin')),
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABLE PLAYER_PROFILES
CREATE TABLE IF NOT EXISTS player_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  -- Identité
  nom TEXT,
  prenom TEXT,
  date_naissance DATE,
  age INTEGER,
  nationalite TEXT DEFAULT 'Française',
  -- Localisation
  ville TEXT,
  region TEXT,
  -- Physique
  taille TEXT,
  poids TEXT,
  pied_fort TEXT DEFAULT 'Droit',
  -- Sportif
  poste_principal TEXT,
  poste_secondaire TEXT,
  club_actuel TEXT,
  categorie TEXT,
  niveau_championnat TEXT,
  -- Stats
  matchs_joues INTEGER DEFAULT 0,
  buts INTEGER DEFAULT 0,
  passes_decisives INTEGER DEFAULT 0,
  clean_sheets INTEGER DEFAULT 0,
  -- Médias
  video_highlights TEXT,
  video_match TEXT,
  photo_url TEXT,
  -- Profil
  objectif TEXT,
  ouvert_opportunites BOOLEAN DEFAULT true,
  -- Contact
  whatsapp TEXT,
  instagram TEXT,
  tiktok TEXT,
  -- IA
  ai_description TEXT,
  ai_score INTEGER DEFAULT 0,
  -- Admin
  statut TEXT DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'publie', 'refuse')),
  -- Dates
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLE PRO_PROFILES
CREATE TABLE IF NOT EXISTS pro_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  nom TEXT,
  prenom TEXT,
  role_pro TEXT CHECK (role_pro IN ('recruiter', 'agent', 'club')),
  organisation TEXT,
  region_couverte TEXT,
  email_pro TEXT,
  whatsapp TEXT,
  postes_recherches TEXT,
  criteres TEXT,
  niveau_cible TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABLE MESSAGES
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  player_profile_id UUID REFERENCES player_profiles(id) ON DELETE SET NULL,
  subject TEXT,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pro_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "Profiles: lecture publique" ON profiles FOR SELECT USING (true);
CREATE POLICY "Profiles: insertion propre" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Profiles: modification propre" ON profiles FOR UPDATE USING (auth.uid() = id);

-- PLAYER_PROFILES: SELECT
CREATE POLICY "Players: lecture publie ou propre" ON player_profiles FOR SELECT
  USING (statut = 'publie' OR auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- PLAYER_PROFILES: INSERT
CREATE POLICY "Players: insertion propre" ON player_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- PLAYER_PROFILES: UPDATE
CREATE POLICY "Players: modification propre ou admin" ON player_profiles FOR UPDATE
  USING (auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- PRO_PROFILES
CREATE POLICY "Pro: lecture propre" ON pro_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Pro: insertion propre" ON pro_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Pro: modification propre" ON pro_profiles FOR UPDATE USING (auth.uid() = user_id);

-- MESSAGES
CREATE POLICY "Messages: lecture envoyés ou reçus" ON messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Messages: envoi propre" ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Messages: marquer lu" ON messages FOR UPDATE
  USING (auth.uid() = receiver_id);

-- ============================================
-- TRIGGER: updated_at automatique
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER player_profiles_updated_at
  BEFORE UPDATE ON player_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- TRIGGER: créer profil automatiquement
-- ============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, role, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'player'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- ADMIN : mettre à jour ton compte admin
-- Remplace TON_EMAIL par bakary.sy.sawane@gmail.com
-- ============================================
-- UPDATE profiles SET role = 'admin' WHERE id = (
--   SELECT id FROM auth.users WHERE email = 'bakary.sy.sawane@gmail.com'
-- );
