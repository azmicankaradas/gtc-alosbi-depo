-- ============================================================
-- Gözlemci (Observer) Okuma Erişimi Düzeltmesi
-- Supabase SQL Editor'da çalıştırın
-- ============================================================
-- Sorun: Önceki migration'larda FOR ALL policy'leri is_admin() 
-- kontrolü ile oluşturulmuş, bu da gözlemci kullanıcıların 
-- SELECT yapmasını engelliyor.
-- 
-- Çözüm: Tüm tablolara authenticated kullanıcılar için SELECT
-- policy ekle. Yazma işlemleri sadece admin'e açık kalacak.
-- ============================================================

-- Önce çakışan policy'leri temizle
-- PRODUCTS
DROP POLICY IF EXISTS "Admins can manage products" ON products;
DROP POLICY IF EXISTS "Approved users can view products" ON products;
DROP POLICY IF EXISTS "Approved users can insert products" ON products;
DROP POLICY IF EXISTS "Approved users can update products" ON products;
DROP POLICY IF EXISTS "Only admins can delete products" ON products;

-- VARIANTS
DROP POLICY IF EXISTS "Admins can manage variants" ON variants;
DROP POLICY IF EXISTS "Approved users can view variants" ON variants;
DROP POLICY IF EXISTS "Approved users can insert variants" ON variants;
DROP POLICY IF EXISTS "Approved users can update variants" ON variants;
DROP POLICY IF EXISTS "Only admins can delete variants" ON variants;

-- STOCK
DROP POLICY IF EXISTS "Admins can manage stock" ON stock;
DROP POLICY IF EXISTS "Approved users can view stock" ON stock;
DROP POLICY IF EXISTS "Approved users can insert stock" ON stock;
DROP POLICY IF EXISTS "Approved users can update stock" ON stock;
DROP POLICY IF EXISTS "Only admins can delete stock" ON stock;

-- STOCK_MOVEMENTS
DROP POLICY IF EXISTS "Admins can insert movements" ON stock_movements;
DROP POLICY IF EXISTS "Approved users can view movements" ON stock_movements;
DROP POLICY IF EXISTS "Approved users can insert movements" ON stock_movements;

-- LOCATIONS
DROP POLICY IF EXISTS "Approved users can view locations" ON locations;
DROP POLICY IF EXISTS "Only admins can manage locations" ON locations;

-- REQUESTERS
DROP POLICY IF EXISTS "Admins can manage requesters" ON requesters;

-- ============================================================
-- PRODUCTS: Herkes okuyabilir, Admin yazabilir
-- ============================================================
CREATE POLICY "All authenticated can view products" ON products
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Admins can insert products" ON products
    FOR INSERT TO authenticated
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update products" ON products
    FOR UPDATE TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete products" ON products
    FOR DELETE TO authenticated
    USING (public.is_admin());

-- ============================================================
-- VARIANTS: Herkes okuyabilir, Admin yazabilir
-- ============================================================
CREATE POLICY "All authenticated can view variants" ON variants
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Admins can insert variants" ON variants
    FOR INSERT TO authenticated
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update variants" ON variants
    FOR UPDATE TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete variants" ON variants
    FOR DELETE TO authenticated
    USING (public.is_admin());

-- ============================================================
-- STOCK: Herkes okuyabilir, Admin yazabilir
-- ============================================================
CREATE POLICY "All authenticated can view stock" ON stock
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Admins can insert stock" ON stock
    FOR INSERT TO authenticated
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update stock" ON stock
    FOR UPDATE TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete stock" ON stock
    FOR DELETE TO authenticated
    USING (public.is_admin());

-- ============================================================
-- STOCK_MOVEMENTS: Herkes okuyabilir, Admin ekleyebilir
-- ============================================================
CREATE POLICY "All authenticated can view movements" ON stock_movements
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Admins can insert movements" ON stock_movements
    FOR INSERT TO authenticated
    WITH CHECK (public.is_admin());

-- ============================================================
-- LOCATIONS: Herkes okuyabilir, Admin yönetebilir
-- ============================================================
CREATE POLICY "All authenticated can view locations" ON locations
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Admins can manage locations" ON locations
    FOR INSERT TO authenticated
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update locations" ON locations
    FOR UPDATE TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete locations" ON locations
    FOR DELETE TO authenticated
    USING (public.is_admin());

-- ============================================================
-- REQUESTERS: Herkes okuyabilir, Admin yönetebilir
-- ============================================================
CREATE POLICY "All authenticated can view requesters" ON requesters
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Admins can insert requesters" ON requesters
    FOR INSERT TO authenticated
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update requesters" ON requesters
    FOR UPDATE TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete requesters" ON requesters
    FOR DELETE TO authenticated
    USING (public.is_admin());

-- ============================================================
-- TAMAMLANDI!
-- ============================================================
-- Özet:
-- ✅ Tüm authenticated kullanıcılar (admin + gözlemci) tüm tabloları okuyabilir
-- ✅ Sadece admin kullanıcılar yazma/güncelleme/silme yapabilir
-- ✅ stock_movements hiç silinemez/güncellenemez (audit trail)
-- ✅ is_approved_user() kontrolü kaldırıldı - sadece is_admin() kullanılıyor
-- ============================================================
