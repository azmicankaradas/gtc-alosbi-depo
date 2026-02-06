-- ============================================================
-- Kullanıcı İsim Kaydı - Trigger Güncellemesi
-- Supabase SQL Editor'da çalıştırın
-- ============================================================

-- 1. Mevcut trigger'ı ve fonksiyonu kaldır
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- 2. Güncellenmiş trigger fonksiyonu (full_name dahil)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, is_approved, status, role)
    VALUES (
        NEW.id, 
        NEW.email, 
        NEW.raw_user_meta_data->>'full_name',  -- Kayıt formundan gelen isim
        false, 
        'pending', 
        'user'
    )
    ON CONFLICT (id) DO UPDATE 
    SET full_name = COALESCE(EXCLUDED.full_name, user_profiles.full_name);
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- Hata olursa bile kullanıcı oluşturulsun
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Trigger'ı oluştur
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW 
    EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- TAMAMLANDI!
-- ============================================================
