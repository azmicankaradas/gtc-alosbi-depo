-- ============================================================
-- Admin Kullanıcı Ayarlama
-- Supabase SQL Editor'da çalıştırın
-- ============================================================

-- 1. Kullanıcı profilini oluştur (yoksa) ve admin yap
INSERT INTO user_profiles (id, email, is_approved, status, role)
SELECT id, email, true, 'approved', 'admin'
FROM auth.users
WHERE email = 'azmicankaradas96@gmail.com'
ON CONFLICT (id) DO UPDATE SET
    is_approved = true,
    status = 'approved',
    role = 'admin';

-- 2. Sonucu doğrula
SELECT id, email, is_approved, status, role 
FROM user_profiles 
WHERE email = 'azmicankaradas96@gmail.com';

-- ============================================================
-- TAMAMLANDI! Admin kullanıcı ayarlandı.
-- ============================================================
