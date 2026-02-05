-- ============================================================
-- Admin Onay Sistemi - Veritabanı Migration
-- Supabase SQL Editor'da çalıştırın
-- ============================================================

-- 1. Kullanıcı Profil Tablosu
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    is_approved BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    approved_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMPTZ,
    rejected_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. RLS (Row Level Security)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Herkes kendi profilini görebilir
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT TO authenticated USING (auth.uid() = id);

-- Adminler tüm profilleri görebilir
CREATE POLICY "Admins can view all profiles" ON user_profiles
    FOR SELECT TO authenticated 
    USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Adminler profilleri güncelleyebilir
CREATE POLICY "Admins can update profiles" ON user_profiles
    FOR UPDATE TO authenticated 
    USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Kullanıcılar kendi profilini güncelleyebilir (sadece full_name)
CREATE POLICY "Users can update own profile name" ON user_profiles
    FOR UPDATE TO authenticated 
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- 3. Updated_at Trigger
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. Yeni Kullanıcı Kaydolunca Otomatik Profil Oluştur
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger oluştur (eğer yoksa)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 5. Mevcut Kullanıcıları user_profiles Tablosuna Ekle
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

-- 6. Admin Kullanıcıyı Güncelle (zaten varsa)
UPDATE user_profiles 
SET is_approved = true, status = 'approved', role = 'admin'
WHERE email = 'azmicankaradas96@gmail.com';

-- ============================================================
-- TAMAMLANDI!
-- ============================================================
