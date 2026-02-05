-- ============================================================
-- Admin Onay Sistemi - Basit Trigger (Hata Giderme)
-- Supabase SQL Editor'da çalıştırın
-- ============================================================

-- 1. Önce trigger'ı ve fonksiyonu kaldır
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- 2. Status sütunundaki constraint'i kontrol et ve düzelt
-- Mevcut constraint'i kaldır
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_status_check;

-- Yeni constraint ekle
ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_status_check 
    CHECK (status IS NULL OR status IN ('pending', 'approved', 'rejected'));

-- 3. Basit trigger fonksiyonu oluştur
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, is_approved, status, role)
    VALUES (NEW.id, NEW.email, false, 'pending', 'user')
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- Hata olursa bile kullanıcı oluşturulsun
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Trigger'ı oluştur
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW 
    EXECUTE FUNCTION handle_new_user();

-- 5. Fonksiyona gerekli izinleri ver
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.user_profiles TO postgres, anon, authenticated, service_role;

-- ============================================================
-- TAMAMLANDI!
-- ============================================================
