-- ============================================================
-- GTC Endüstriyel - Warehouse Stock Management System
-- Database Schema for Supabase (PostgreSQL)
-- ============================================================
-- Run this file in Supabase SQL Editor to set up the database
-- ============================================================

-- ============================================================
-- 1. CUSTOM ENUMS (Type Safety)
-- ============================================================

-- Floor types in warehouse
CREATE TYPE floor_type AS ENUM ('floor_0', 'floor_1');

-- Product groups (determines floor assignment)
CREATE TYPE product_group AS ENUM ('textile', 'shoes');

-- Textile categories
CREATE TYPE textile_category AS ENUM ('tulum', 'kaban', 'gomlek', 'pantolon');

-- Fabric types for textiles
CREATE TYPE fabric_type AS ENUM ('nomex', 'gtc');

-- Color options for textiles
CREATE TYPE color_type AS ENUM ('yesil', 'turuncu');

-- Column labels for shelves
CREATE TYPE column_label AS ENUM ('A', 'B', 'C', 'D', 'E');

-- ============================================================
-- 2. LOCATIONS TABLE (Warehouse Physical Grid)
-- ============================================================
-- 2 Floors × 6 Shelves × 5 Columns × 3 Cells = 180 locations

CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    floor floor_type NOT NULL,
    shelf INTEGER NOT NULL CHECK (shelf >= 1 AND shelf <= 6),
    column_label column_label NOT NULL,
    cell INTEGER NOT NULL CHECK (cell >= 1 AND cell <= 3),
    location_id VARCHAR(20) UNIQUE NOT NULL, -- e.g., "F0-R1-A-1"
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure unique location combination
    CONSTRAINT unique_location UNIQUE (floor, shelf, column_label, cell)
);

-- Index for fast location lookups
CREATE INDEX idx_locations_floor ON locations(floor);
CREATE INDEX idx_locations_location_id ON locations(location_id);

-- ============================================================
-- 3. PRODUCTS TABLE (Base Product Definitions)
-- ============================================================

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    product_group product_group NOT NULL,
    
    -- Textile-specific fields (NULL for shoes)
    category textile_category,
    fabric fabric_type,
    
    -- Shoes-specific fields (NULL for textiles)
    brand VARCHAR(100),
    model VARCHAR(100),
    
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Validate textile products have required fields
    CONSTRAINT textile_fields_check CHECK (
        product_group != 'textile' OR (category IS NOT NULL AND fabric IS NOT NULL)
    ),
    -- Validate shoe products have required fields
    CONSTRAINT shoes_fields_check CHECK (
        product_group != 'shoes' OR (brand IS NOT NULL AND model IS NOT NULL)
    )
);

-- Indexes for product queries
CREATE INDEX idx_products_group ON products(product_group);
CREATE INDEX idx_products_brand ON products(brand) WHERE brand IS NOT NULL;
CREATE INDEX idx_products_category ON products(category) WHERE category IS NOT NULL;

-- ============================================================
-- 4. VARIANTS TABLE (Specific SKUs with Size/Color)
-- ============================================================

CREATE TABLE variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(100) UNIQUE NOT NULL,
    
    -- Size (different ranges for textiles vs shoes)
    size VARCHAR(10) NOT NULL,
    
    -- Color (only for textiles)
    color color_type,
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for variant queries
CREATE INDEX idx_variants_product ON variants(product_id);
CREATE INDEX idx_variants_sku ON variants(sku);
CREATE INDEX idx_variants_size ON variants(size);

-- ============================================================
-- 5. STOCK TABLE (Inventory: Variant + Location + Quantity)
-- ============================================================

CREATE TABLE stock (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    variant_id UUID NOT NULL REFERENCES variants(id) ON DELETE CASCADE,
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    min_quantity INTEGER DEFAULT 5, -- Alert threshold
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- One variant per location
    CONSTRAINT unique_variant_location UNIQUE (variant_id, location_id)
);

-- Indexes for stock queries
CREATE INDEX idx_stock_variant ON stock(variant_id);
CREATE INDEX idx_stock_location ON stock(location_id);
CREATE INDEX idx_stock_low ON stock(quantity) WHERE quantity <= 5;

-- ============================================================
-- 6. STOCK MOVEMENTS TABLE (Audit Trail)
-- ============================================================

CREATE TABLE stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stock_id UUID REFERENCES stock(id) ON DELETE SET NULL,
    variant_id UUID NOT NULL REFERENCES variants(id) ON DELETE CASCADE,
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    movement_type VARCHAR(20) NOT NULL CHECK (movement_type IN ('in', 'out', 'transfer', 'adjustment')),
    quantity INTEGER NOT NULL,
    previous_quantity INTEGER NOT NULL,
    new_quantity INTEGER NOT NULL,
    notes TEXT,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for movement history queries
CREATE INDEX idx_movements_variant ON stock_movements(variant_id);
CREATE INDEX idx_movements_created ON stock_movements(created_at DESC);

-- ============================================================
-- 7. FUNCTIONS & TRIGGERS
-- ============================================================

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_locations_updated_at
    BEFORE UPDATE ON locations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_variants_updated_at
    BEFORE UPDATE ON variants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stock_updated_at
    BEFORE UPDATE ON stock
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 8. FLOOR RESTRICTION FUNCTION
-- ============================================================
-- Ensures textiles go to Floor 0, shoes go to Floor 1

CREATE OR REPLACE FUNCTION check_floor_restriction()
RETURNS TRIGGER AS $$
DECLARE
    v_product_group product_group;
    v_floor floor_type;
BEGIN
    -- Get product group from variant
    SELECT p.product_group INTO v_product_group
    FROM products p
    JOIN variants v ON v.product_id = p.id
    WHERE v.id = NEW.variant_id;
    
    -- Get floor from location
    SELECT floor INTO v_floor
    FROM locations
    WHERE id = NEW.location_id;
    
    -- Validate floor assignment
    IF v_product_group = 'textile' AND v_floor != 'floor_0' THEN
        RAISE EXCEPTION 'Textile products must be stored on Floor 0 (Zemin Kat)';
    END IF;
    
    IF v_product_group = 'shoes' AND v_floor != 'floor_1' THEN
        RAISE EXCEPTION 'Shoe products must be stored on Floor 1 (1. Kat)';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_floor_restriction
    BEFORE INSERT OR UPDATE ON stock
    FOR EACH ROW EXECUTE FUNCTION check_floor_restriction();

-- ============================================================
-- 9. STOCK MOVEMENT TRACKING FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION track_stock_movement()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO stock_movements (stock_id, variant_id, location_id, movement_type, quantity, previous_quantity, new_quantity)
        VALUES (NEW.id, NEW.variant_id, NEW.location_id, 'in', NEW.quantity, 0, NEW.quantity);
    ELSIF TG_OP = 'UPDATE' AND OLD.quantity != NEW.quantity THEN
        INSERT INTO stock_movements (stock_id, variant_id, location_id, movement_type, quantity, previous_quantity, new_quantity)
        VALUES (
            NEW.id, 
            NEW.variant_id, 
            NEW.location_id, 
            CASE WHEN NEW.quantity > OLD.quantity THEN 'in' ELSE 'out' END,
            ABS(NEW.quantity - OLD.quantity),
            OLD.quantity,
            NEW.quantity
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER track_stock_changes
    AFTER INSERT OR UPDATE ON stock
    FOR EACH ROW EXECUTE FUNCTION track_stock_movement();

-- ============================================================
-- 10. ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;

-- Policies for authenticated users (full access)
CREATE POLICY "Authenticated users can view locations" ON locations
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can view products" ON products
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage products" ON products
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can view variants" ON variants
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage variants" ON variants
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can view stock" ON stock
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage stock" ON stock
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can view movements" ON stock_movements
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert movements" ON stock_movements
    FOR INSERT TO authenticated WITH CHECK (true);

-- ============================================================
-- 11. SEED DATA: GENERATE ALL 180 LOCATIONS
-- ============================================================

DO $$
DECLARE
    f floor_type;
    s INTEGER;
    c column_label;
    cell_num INTEGER;
    floor_num INTEGER;
    loc_id VARCHAR(20);
    floor_name VARCHAR(50);
BEGIN
    FOR f IN SELECT unnest(enum_range(NULL::floor_type)) LOOP
        floor_num := CASE WHEN f = 'floor_0' THEN 0 ELSE 1 END;
        floor_name := CASE WHEN f = 'floor_0' THEN 'Zemin Kat - Tekstil' ELSE '1. Kat - Ayakkabı' END;
        
        FOR s IN 1..6 LOOP
            FOR c IN SELECT unnest(enum_range(NULL::column_label)) LOOP
                FOR cell_num IN 1..3 LOOP
                    loc_id := 'F' || floor_num || '-R' || s || '-' || c || '-' || cell_num;
                    
                    INSERT INTO locations (floor, shelf, column_label, cell, location_id, description)
                    VALUES (f, s, c, cell_num, loc_id, floor_name || ' / Raf ' || s || ' / Kolon ' || c || ' / Hücre ' || cell_num);
                END LOOP;
            END LOOP;
        END LOOP;
    END LOOP;
END $$;

-- ============================================================
-- 12. SEED DATA: SAMPLE PRODUCTS
-- ============================================================

-- Textile Products (Floor 0)
INSERT INTO products (name, product_group, category, fabric, description) VALUES
    ('Nomex Tulum Yeşil', 'textile', 'tulum', 'nomex', 'Nomex kumaş iş tulumu - Yeşil renk'),
    ('Nomex Tulum Turuncu', 'textile', 'tulum', 'nomex', 'Nomex kumaş iş tulumu - Turuncu renk'),
    ('GTC Tulum Yeşil', 'textile', 'tulum', 'gtc', 'GTC kumaş iş tulumu - Yeşil renk'),
    ('GTC Tulum Turuncu', 'textile', 'tulum', 'gtc', 'GTC kumaş iş tulumu - Turuncu renk'),
    ('Nomex Kaban Yeşil', 'textile', 'kaban', 'nomex', 'Nomex kumaş iş kabani - Yeşil renk'),
    ('Nomex Kaban Turuncu', 'textile', 'kaban', 'nomex', 'Nomex kumaş iş kabani - Turuncu renk'),
    ('GTC Gömlek Yeşil', 'textile', 'gomlek', 'gtc', 'GTC kumaş iş gömleği - Yeşil renk'),
    ('GTC Pantolon Yeşil', 'textile', 'pantolon', 'gtc', 'GTC kumaş iş pantolonu - Yeşil renk');

-- Shoes Products (Floor 1)
INSERT INTO products (name, product_group, brand, model, description) VALUES
    ('YDS EL 170 S3', 'shoes', 'YDS', 'EL 170 S3', 'YDS marka güvenlik ayakkabısı - EL 170 S3 model'),
    ('YDS UL 110 S3', 'shoes', 'YDS', 'UL 110 S3', 'YDS marka güvenlik ayakkabısı - UL 110 S3 model'),
    ('Starline 9040B S3', 'shoes', 'Starline', '9040B S3', 'Starline marka güvenlik botu - 9040B S3 model'),
    ('Starline Standart S3', 'shoes', 'Starline', 'Standart S3', 'Starline marka standart güvenlik ayakkabısı');

-- ============================================================
-- 13. SEED DATA: SAMPLE VARIANTS
-- ============================================================

-- Textile Variants (sizes: 2XS, XS, S, M, L, XL, 2XL, 3XL, 4XL)
DO $$
DECLARE
    prod RECORD;
    sz TEXT;
    col color_type;
    sku_base TEXT;
    sizes TEXT[] := ARRAY['2XS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'];
BEGIN
    FOR prod IN SELECT * FROM products WHERE product_group = 'textile' LIMIT 4 LOOP
        -- Determine color from product name
        col := CASE WHEN prod.name LIKE '%Yeşil%' THEN 'yesil'::color_type ELSE 'turuncu'::color_type END;
        sku_base := UPPER(REPLACE(REPLACE(prod.fabric::text || '-' || prod.category::text, 'gomlek', 'GML'), 'pantolon', 'PNT'));
        
        FOREACH sz IN ARRAY sizes LOOP
            INSERT INTO variants (product_id, sku, size, color)
            VALUES (prod.id, sku_base || '-' || col || '-' || sz, sz, col)
            ON CONFLICT (sku) DO NOTHING;
        END LOOP;
    END LOOP;
END $$;

-- Shoe Variants (sizes: 36-47)
DO $$
DECLARE
    prod RECORD;
    sz INTEGER;
    sku_base TEXT;
BEGIN
    FOR prod IN SELECT * FROM products WHERE product_group = 'shoes' LOOP
        sku_base := UPPER(REPLACE(REPLACE(prod.brand || '-' || prod.model, ' ', ''), '.', ''));
        
        FOR sz IN 36..47 LOOP
            INSERT INTO variants (product_id, sku, size)
            VALUES (prod.id, sku_base || '-' || sz, sz::text)
            ON CONFLICT (sku) DO NOTHING;
        END LOOP;
    END LOOP;
END $$;

-- ============================================================
-- 14. HELPER VIEWS
-- ============================================================

-- View: Full stock information with all details
CREATE OR REPLACE VIEW stock_full_view AS
SELECT 
    s.id AS stock_id,
    s.quantity,
    s.min_quantity,
    s.quantity <= s.min_quantity AS low_stock,
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

-- View: Available locations by floor
CREATE OR REPLACE VIEW available_locations AS
SELECT 
    l.*,
    CASE WHEN l.floor = 'floor_0' THEN 'textile' ELSE 'shoes' END AS allowed_product_group
FROM locations l
ORDER BY l.floor, l.shelf, l.column_label, l.cell;

-- View: Stock summary by product
CREATE OR REPLACE VIEW stock_summary AS
SELECT 
    p.id AS product_id,
    p.name,
    p.product_group,
    p.brand,
    p.category,
    COUNT(DISTINCT v.id) AS variant_count,
    COALESCE(SUM(s.quantity), 0) AS total_quantity,
    COUNT(DISTINCT s.location_id) AS location_count
FROM products p
LEFT JOIN variants v ON v.product_id = p.id
LEFT JOIN stock s ON s.variant_id = v.id
GROUP BY p.id, p.name, p.product_group, p.brand, p.category;

-- ============================================================
-- 15. SEARCH FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION search_stock(search_term TEXT)
RETURNS TABLE (
    stock_id UUID,
    quantity INTEGER,
    sku VARCHAR,
    size VARCHAR,
    color color_type,
    product_name VARCHAR,
    brand VARCHAR,
    model VARCHAR,
    location_code VARCHAR,
    floor floor_type
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sv.stock_id,
        sv.quantity,
        sv.sku,
        sv.size,
        sv.color,
        sv.product_name,
        sv.brand,
        sv.model,
        sv.location_code,
        sv.floor
    FROM stock_full_view sv
    WHERE 
        sv.sku ILIKE '%' || search_term || '%'
        OR sv.product_name ILIKE '%' || search_term || '%'
        OR sv.brand ILIKE '%' || search_term || '%'
        OR sv.model ILIKE '%' || search_term || '%'
        OR sv.size ILIKE '%' || search_term || '%'
        OR sv.location_code ILIKE '%' || search_term || '%';
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- SCHEMA COMPLETE! 
-- ============================================================
-- 
-- Summary:
-- ✅ 5 Tables: locations, products, variants, stock, stock_movements
-- ✅ 180 Pre-generated location cells  
-- ✅ Floor restriction enforced (Textiles→Floor 0, Shoes→Floor 1)
-- ✅ Stock movement audit trail
-- ✅ Row Level Security enabled
-- ✅ Sample products and variants seeded
-- ✅ Helper views for common queries
-- ✅ Search function included
--
-- Next: Run this in Supabase SQL Editor to set up your database!
-- ============================================================
