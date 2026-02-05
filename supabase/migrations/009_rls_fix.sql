-- ============================================================
-- RLS Sonsuz Döngü Düzeltmesi
-- Supabase SQL Editor'da çalıştırın
-- ============================================================

-- Tüm mevcut politikaları kaldır
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'user_profiles') 
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON user_profiles';
    END LOOP;
END $$;

-- RLS'yi geçici olarak kapat
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Admin kullanıcıyı onayla
UPDATE user_profiles 
SET is_approved = true, status = 'approved', role = 'admin'
WHERE email = 'azmicankaradas96@gmail.com';

-- RLS'yi tekrar aç
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Helper fonksiyon (RLS bypass için)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() AND role = 'admin'
    );
$$;

-- Basit politikalar oluştur (recursion olmadan)
-- Tüm authenticated kullanıcılar kendi profilini görebilir
CREATE POLICY "Allow users to view own profile" ON user_profiles
    FOR SELECT TO authenticated 
    USING (auth.uid() = id);

-- Tüm authenticated kullanıcılar kendi profilini güncelleyebilir
CREATE POLICY "Allow users to update own profile" ON user_profiles
    FOR UPDATE TO authenticated 
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Adminler tüm profilleri görebilir
CREATE POLICY "Admins can view all profiles" ON user_profiles
    FOR SELECT TO authenticated 
    USING (public.is_admin());

-- Adminler tüm profilleri güncelleyebilir
CREATE POLICY "Admins can update all profiles" ON user_profiles
    FOR UPDATE TO authenticated 
    USING (public.is_admin());

-- Service role için tam erişim
CREATE POLICY "Service role full access" ON user_profiles
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- ============================================================
-- TAMAMLANDI!
-- ============================================================
