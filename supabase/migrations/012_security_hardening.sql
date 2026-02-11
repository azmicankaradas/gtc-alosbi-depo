-- ============================================================
-- Güvenlik Güçlendirme: RLS Politikalarını Sıkılaştırma
-- Supabase SQL Editor'da çalıştırın
-- ============================================================
-- Mevcut sorun: Herhangi bir oturum açmış kullanıcı tüm verileri
-- silebilir/değiştirebilir. Bu migration ile DELETE yetkisi sadece
-- admin kullanıcılara verilir.
-- ============================================================

-- Helper fonksiyon: Kullanıcının onaylı olup olmadığını kontrol et
CREATE OR REPLACE FUNCTION public.is_approved_user()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND is_approved = true 
        AND status = 'approved'
    );
$$;

-- ============================================================
-- PRODUCTS tablosu RLS düzeltmesi
-- ============================================================
-- Mevcut gevşek politikaları kaldır
DROP POLICY IF EXISTS "Authenticated users can view products" ON products;
DROP POLICY IF EXISTS "Authenticated users can manage products" ON products;

-- Yeni sıkı politikalar
-- SELECT: Onaylı kullanıcılar görebilir
CREATE POLICY "Approved users can view products" ON products
    FOR SELECT TO authenticated 
    USING (public.is_approved_user());

-- INSERT: Onaylı kullanıcılar ekleyebilir
CREATE POLICY "Approved users can insert products" ON products
    FOR INSERT TO authenticated 
    WITH CHECK (public.is_approved_user());

-- UPDATE: Onaylı kullanıcılar güncelleyebilir
CREATE POLICY "Approved users can update products" ON products
    FOR UPDATE TO authenticated 
    USING (public.is_approved_user())
    WITH CHECK (public.is_approved_user());

-- DELETE: Sadece adminler silebilir
CREATE POLICY "Only admins can delete products" ON products
    FOR DELETE TO authenticated 
    USING (public.is_admin());

-- ============================================================
-- VARIANTS tablosu RLS düzeltmesi
-- ============================================================
DROP POLICY IF EXISTS "Authenticated users can view variants" ON variants;
DROP POLICY IF EXISTS "Authenticated users can manage variants" ON variants;

CREATE POLICY "Approved users can view variants" ON variants
    FOR SELECT TO authenticated 
    USING (public.is_approved_user());

CREATE POLICY "Approved users can insert variants" ON variants
    FOR INSERT TO authenticated 
    WITH CHECK (public.is_approved_user());

CREATE POLICY "Approved users can update variants" ON variants
    FOR UPDATE TO authenticated 
    USING (public.is_approved_user())
    WITH CHECK (public.is_approved_user());

CREATE POLICY "Only admins can delete variants" ON variants
    FOR DELETE TO authenticated 
    USING (public.is_admin());

-- ============================================================
-- STOCK tablosu RLS düzeltmesi
-- ============================================================
DROP POLICY IF EXISTS "Authenticated users can view stock" ON stock;
DROP POLICY IF EXISTS "Authenticated users can manage stock" ON stock;

CREATE POLICY "Approved users can view stock" ON stock
    FOR SELECT TO authenticated 
    USING (public.is_approved_user());

CREATE POLICY "Approved users can insert stock" ON stock
    FOR INSERT TO authenticated 
    WITH CHECK (public.is_approved_user());

CREATE POLICY "Approved users can update stock" ON stock
    FOR UPDATE TO authenticated 
    USING (public.is_approved_user())
    WITH CHECK (public.is_approved_user());

CREATE POLICY "Only admins can delete stock" ON stock
    FOR DELETE TO authenticated 
    USING (public.is_admin());

-- ============================================================
-- STOCK_MOVEMENTS tablosu RLS düzeltmesi
-- ============================================================
DROP POLICY IF EXISTS "Authenticated users can view movements" ON stock_movements;
DROP POLICY IF EXISTS "Authenticated users can insert movements" ON stock_movements;

CREATE POLICY "Approved users can view movements" ON stock_movements
    FOR SELECT TO authenticated 
    USING (public.is_approved_user());

CREATE POLICY "Approved users can insert movements" ON stock_movements
    FOR INSERT TO authenticated 
    WITH CHECK (public.is_approved_user());

-- Hareket kayıtları silinemez ve güncellenemez (audit trail bütünlüğü)
-- DELETE ve UPDATE politikası YOK → kimse silip değiştiremez

-- ============================================================
-- LOCATIONS tablosu RLS düzeltmesi
-- ============================================================
DROP POLICY IF EXISTS "Authenticated users can view locations" ON locations;

CREATE POLICY "Approved users can view locations" ON locations
    FOR SELECT TO authenticated 
    USING (public.is_approved_user());

-- Lokasyonlar sadece admin tarafından yönetilebilir
CREATE POLICY "Only admins can manage locations" ON locations
    FOR ALL TO authenticated 
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ============================================================
-- TAMAMLANDI!
-- Artık:
-- ✅ Sadece onaylı kullanıcılar veri görebilir/ekleyebilir/güncelleyebilir
-- ✅ Sadece adminler veri silebilir
-- ✅ stock_movements hiç silinemez/güncellenemez (audit trail)
-- ✅ locations sadece admin tarafından yönetilebilir
-- ============================================================
