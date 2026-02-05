-- ============================================================
-- Admin Onay Sistemi - Eksik Sütunları Ekle
-- Supabase SQL Editor'da çalıştırın
-- ============================================================

-- 1. Eksik sütunları ekle (varsa hata vermez)
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS rejected_reason TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id);
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;

-- 2. Mevcut onaylı kullanıcıların status'unu güncelle
UPDATE user_profiles SET status = 'approved' WHERE is_approved = true;
UPDATE user_profiles SET status = 'pending' WHERE is_approved = false AND status IS NULL;

-- 3. Policy'leri sil ve yeniden oluştur
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile name" ON user_profiles;

CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON user_profiles
    FOR SELECT TO authenticated 
    USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins can update profiles" ON user_profiles
    FOR UPDATE TO authenticated 
    USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Users can update own profile name" ON user_profiles
    FOR UPDATE TO authenticated 
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- 4. Trigger'ları güncelle
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 5. Mevcut kullanıcıları ekle (tabloya henüz eklenmemişlerse)
INSERT INTO user_profiles (id, email, is_approved, status, role)
SELECT 
    id, 
    email, 
    true,
    'approved',
    CASE WHEN email = 'azmicankaradas96@gmail.com' THEN 'admin' ELSE 'user' END
FROM auth.users
WHERE id NOT IN (SELECT id FROM user_profiles)
ON CONFLICT (id) DO NOTHING;

-- 6. Admin kullanıcıyı güncelle
UPDATE user_profiles 
SET is_approved = true, status = 'approved', role = 'admin'
WHERE email = 'azmicankaradas96@gmail.com';

-- ============================================================
-- TAMAMLANDI!
-- ============================================================
