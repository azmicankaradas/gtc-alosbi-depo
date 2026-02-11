-- ============================================================
-- Migration: Fix stock_full_view - Add created_at and updated_at
-- Dashboard "Son Stok Kayıtları" bölümünde en son eklenen/güncellenen
-- stokların doğru sıralanması için updated_at kolonu ekleniyor.
-- ============================================================

DROP VIEW IF EXISTS stock_full_view CASCADE;

CREATE VIEW stock_full_view AS
SELECT 
    s.id AS stock_id,
    s.quantity,
    s.min_quantity,
    s.created_at AS stock_created_at,
    s.updated_at AS stock_updated_at,
    -- Low stock logic: different thresholds per product group
    -- Only mark as low stock if quantity > 0 (not empty)
    CASE 
        WHEN s.quantity = 0 THEN FALSE
        WHEN p.product_group = 'textile' AND s.quantity < 60 THEN TRUE
        WHEN p.product_group = 'shoes' AND s.quantity < 30 THEN TRUE
        ELSE FALSE
    END AS low_stock,
    v.id AS variant_id,
    v.sku,
    v.size,
    v.color,
    p.id AS product_id,
    p.name AS product_name,
    p.product_group,
    p.category,
    p.fabric,
    p.brand,
    p.model,
    l.id AS location_id,
    l.location_id AS location_code,
    l.floor,
    l.shelf,
    l.column_label,
    l.cell,
    l.description AS location_description
FROM stock s
JOIN variants v ON s.variant_id = v.id
JOIN products p ON v.product_id = p.id
JOIN locations l ON s.location_id = l.id;
