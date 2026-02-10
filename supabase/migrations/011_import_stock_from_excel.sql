-- ============================================================
-- Stock Import Migration from depo-stok.xlsx
-- Generated: 2026-02-10T07:32:24.810Z
-- Total entries: 186
-- ============================================================

BEGIN;

-- ============================================================
-- 1. ENSURE ALL PRODUCT TYPES EXIST
-- ============================================================

-- Product: GTC Tulum Yeşil
INSERT INTO products (name, product_group, category, fabric, description)
SELECT 'GTC Tulum Yeşil', 'textile', 'tulum'::textile_category, 'gtc'::fabric_type, 'GTC kumaş iş tulum - Yeşil renk'
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE category = 'tulum'::textile_category AND fabric = 'gtc'::fabric_type
  AND name ILIKE '%Yeşil%'
);

-- Product: GTC Tulum Turuncu
INSERT INTO products (name, product_group, category, fabric, description)
SELECT 'GTC Tulum Turuncu', 'textile', 'tulum'::textile_category, 'gtc'::fabric_type, 'GTC kumaş iş tulum - Turuncu renk'
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE category = 'tulum'::textile_category AND fabric = 'gtc'::fabric_type
  AND name ILIKE '%Turuncu%'
);

-- Product: Nomex Tulum Turuncu
INSERT INTO products (name, product_group, category, fabric, description)
SELECT 'Nomex Tulum Turuncu', 'textile', 'tulum'::textile_category, 'nomex'::fabric_type, 'Nomex kumaş iş tulum - Turuncu renk'
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE category = 'tulum'::textile_category AND fabric = 'nomex'::fabric_type
  AND name ILIKE '%Turuncu%'
);

-- Product: Nomex Tulum Yeşil
INSERT INTO products (name, product_group, category, fabric, description)
SELECT 'Nomex Tulum Yeşil', 'textile', 'tulum'::textile_category, 'nomex'::fabric_type, 'Nomex kumaş iş tulum - Yeşil renk'
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE category = 'tulum'::textile_category AND fabric = 'nomex'::fabric_type
  AND name ILIKE '%Yeşil%'
);

-- Product: GTC Pantolon Yeşil
INSERT INTO products (name, product_group, category, fabric, description)
SELECT 'GTC Pantolon Yeşil', 'textile', 'pantolon'::textile_category, 'gtc'::fabric_type, 'GTC kumaş iş pantolon - Yeşil renk'
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE category = 'pantolon'::textile_category AND fabric = 'gtc'::fabric_type
  AND name ILIKE '%Yeşil%'
);

-- Product: GTC Gömlek Yeşil
INSERT INTO products (name, product_group, category, fabric, description)
SELECT 'GTC Gömlek Yeşil', 'textile', 'gomlek'::textile_category, 'gtc'::fabric_type, 'GTC kumaş iş gömlek - Yeşil renk'
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE category = 'gomlek'::textile_category AND fabric = 'gtc'::fabric_type
  AND name ILIKE '%Yeşil%'
);

-- Product: GTC Pantolon Turuncu
INSERT INTO products (name, product_group, category, fabric, description)
SELECT 'GTC Pantolon Turuncu', 'textile', 'pantolon'::textile_category, 'gtc'::fabric_type, 'GTC kumaş iş pantolon - Turuncu renk'
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE category = 'pantolon'::textile_category AND fabric = 'gtc'::fabric_type
  AND name ILIKE '%Turuncu%'
);

-- Product: GTC Kaban Turuncu
INSERT INTO products (name, product_group, category, fabric, description)
SELECT 'GTC Kaban Turuncu', 'textile', 'kaban'::textile_category, 'gtc'::fabric_type, 'GTC kumaş iş kaban - Turuncu renk'
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE category = 'kaban'::textile_category AND fabric = 'gtc'::fabric_type
  AND name ILIKE '%Turuncu%'
);

-- Product: GTC Gömlek Turuncu
INSERT INTO products (name, product_group, category, fabric, description)
SELECT 'GTC Gömlek Turuncu', 'textile', 'gomlek'::textile_category, 'gtc'::fabric_type, 'GTC kumaş iş gömlek - Turuncu renk'
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE category = 'gomlek'::textile_category AND fabric = 'gtc'::fabric_type
  AND name ILIKE '%Turuncu%'
);

-- Product: Nomex Gömlek Yeşil
INSERT INTO products (name, product_group, category, fabric, description)
SELECT 'Nomex Gömlek Yeşil', 'textile', 'gomlek'::textile_category, 'nomex'::fabric_type, 'Nomex kumaş iş gömlek - Yeşil renk'
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE category = 'gomlek'::textile_category AND fabric = 'nomex'::fabric_type
  AND name ILIKE '%Yeşil%'
);

-- Product: Nomex Kaban Turuncu
INSERT INTO products (name, product_group, category, fabric, description)
SELECT 'Nomex Kaban Turuncu', 'textile', 'kaban'::textile_category, 'nomex'::fabric_type, 'Nomex kumaş iş kaban - Turuncu renk'
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE category = 'kaban'::textile_category AND fabric = 'nomex'::fabric_type
  AND name ILIKE '%Turuncu%'
);

-- Product: Nomex Pantolon Yeşil
INSERT INTO products (name, product_group, category, fabric, description)
SELECT 'Nomex Pantolon Yeşil', 'textile', 'pantolon'::textile_category, 'nomex'::fabric_type, 'Nomex kumaş iş pantolon - Yeşil renk'
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE category = 'pantolon'::textile_category AND fabric = 'nomex'::fabric_type
  AND name ILIKE '%Yeşil%'
);

-- Product: GTC Kaban Yeşil
INSERT INTO products (name, product_group, category, fabric, description)
SELECT 'GTC Kaban Yeşil', 'textile', 'kaban'::textile_category, 'gtc'::fabric_type, 'GTC kumaş iş kaban - Yeşil renk'
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE category = 'kaban'::textile_category AND fabric = 'gtc'::fabric_type
  AND name ILIKE '%Yeşil%'
);

-- Product: Nomex Kaban Yeşil
INSERT INTO products (name, product_group, category, fabric, description)
SELECT 'Nomex Kaban Yeşil', 'textile', 'kaban'::textile_category, 'nomex'::fabric_type, 'Nomex kumaş iş kaban - Yeşil renk'
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE category = 'kaban'::textile_category AND fabric = 'nomex'::fabric_type
  AND name ILIKE '%Yeşil%'
);

-- ============================================================
-- 2. ENSURE ALL VARIANTS EXIST
-- ============================================================

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-TULUM-YESIL-S', 'S', 'yesil'::color_type
FROM products p
WHERE p.category = 'tulum'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-TULUM-YESIL-S'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-TULUM-YESIL-2XL', '2XL', 'yesil'::color_type
FROM products p
WHERE p.category = 'tulum'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-TULUM-YESIL-2XL'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-TULUM-TURUNCU-2XS', '2XS', 'turuncu'::color_type
FROM products p
WHERE p.category = 'tulum'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Turuncu%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-TULUM-TURUNCU-2XS'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-TULUM-YESIL-3XL', '3XL', 'yesil'::color_type
FROM products p
WHERE p.category = 'tulum'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-TULUM-YESIL-3XL'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-TULUM-YESIL-XL', 'XL', 'yesil'::color_type
FROM products p
WHERE p.category = 'tulum'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-TULUM-YESIL-XL'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-TULUM-TURUNCU-L', 'L', 'turuncu'::color_type
FROM products p
WHERE p.category = 'tulum'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Turuncu%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-TULUM-TURUNCU-L'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-TULUM-TURUNCU-XS', 'XS', 'turuncu'::color_type
FROM products p
WHERE p.category = 'tulum'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Turuncu%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-TULUM-TURUNCU-XS'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-TULUM-YESIL-M', 'M', 'yesil'::color_type
FROM products p
WHERE p.category = 'tulum'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-TULUM-YESIL-M'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-TULUM-TURUNCU-S', 'S', 'turuncu'::color_type
FROM products p
WHERE p.category = 'tulum'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Turuncu%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-TULUM-TURUNCU-S'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-TULUM-TURUNCU-XL', 'XL', 'turuncu'::color_type
FROM products p
WHERE p.category = 'tulum'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Turuncu%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-TULUM-TURUNCU-XL'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-TULUM-TURUNCU-M', 'M', 'turuncu'::color_type
FROM products p
WHERE p.category = 'tulum'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Turuncu%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-TULUM-TURUNCU-M'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-TULUM-YESIL-L', 'L', 'yesil'::color_type
FROM products p
WHERE p.category = 'tulum'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-TULUM-YESIL-L'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-TULUM-YESIL-2XS', '2XS', 'yesil'::color_type
FROM products p
WHERE p.category = 'tulum'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-TULUM-YESIL-2XS'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-TULUM-TURUNCU-2XL', '2XL', 'turuncu'::color_type
FROM products p
WHERE p.category = 'tulum'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Turuncu%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-TULUM-TURUNCU-2XL'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-TULUM-YESIL-XS', 'XS', 'yesil'::color_type
FROM products p
WHERE p.category = 'tulum'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-TULUM-YESIL-XS'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-TULUM-TURUNCU-3XL', '3XL', 'turuncu'::color_type
FROM products p
WHERE p.category = 'tulum'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Turuncu%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-TULUM-TURUNCU-3XL'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-TULUM-TURUNCU-4XL', '4XL', 'turuncu'::color_type
FROM products p
WHERE p.category = 'tulum'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Turuncu%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-TULUM-TURUNCU-4XL'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'NOMEX-TULUM-TURUNCU-2XS', '2XS', 'turuncu'::color_type
FROM products p
WHERE p.category = 'tulum'::textile_category 
  AND p.fabric = 'nomex'::fabric_type
  AND p.name ILIKE '%Turuncu%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'NOMEX-TULUM-TURUNCU-2XS'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'NOMEX-TULUM-TURUNCU-XS', 'XS', 'turuncu'::color_type
FROM products p
WHERE p.category = 'tulum'::textile_category 
  AND p.fabric = 'nomex'::fabric_type
  AND p.name ILIKE '%Turuncu%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'NOMEX-TULUM-TURUNCU-XS'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'NOMEX-TULUM-YESIL-2XS', '2XS', 'yesil'::color_type
FROM products p
WHERE p.category = 'tulum'::textile_category 
  AND p.fabric = 'nomex'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'NOMEX-TULUM-YESIL-2XS'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'NOMEX-TULUM-YESIL-M', 'M', 'yesil'::color_type
FROM products p
WHERE p.category = 'tulum'::textile_category 
  AND p.fabric = 'nomex'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'NOMEX-TULUM-YESIL-M'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'NOMEX-TULUM-TURUNCU-S', 'S', 'turuncu'::color_type
FROM products p
WHERE p.category = 'tulum'::textile_category 
  AND p.fabric = 'nomex'::fabric_type
  AND p.name ILIKE '%Turuncu%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'NOMEX-TULUM-TURUNCU-S'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'NOMEX-TULUM-TURUNCU-M', 'M', 'turuncu'::color_type
FROM products p
WHERE p.category = 'tulum'::textile_category 
  AND p.fabric = 'nomex'::fabric_type
  AND p.name ILIKE '%Turuncu%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'NOMEX-TULUM-TURUNCU-M'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'NOMEX-TULUM-YESIL-XS', 'XS', 'yesil'::color_type
FROM products p
WHERE p.category = 'tulum'::textile_category 
  AND p.fabric = 'nomex'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'NOMEX-TULUM-YESIL-XS'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'NOMEX-TULUM-YESIL-L', 'L', 'yesil'::color_type
FROM products p
WHERE p.category = 'tulum'::textile_category 
  AND p.fabric = 'nomex'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'NOMEX-TULUM-YESIL-L'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'NOMEX-TULUM-TURUNCU-L', 'L', 'turuncu'::color_type
FROM products p
WHERE p.category = 'tulum'::textile_category 
  AND p.fabric = 'nomex'::fabric_type
  AND p.name ILIKE '%Turuncu%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'NOMEX-TULUM-TURUNCU-L'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'NOMEX-TULUM-TURUNCU-XL', 'XL', 'turuncu'::color_type
FROM products p
WHERE p.category = 'tulum'::textile_category 
  AND p.fabric = 'nomex'::fabric_type
  AND p.name ILIKE '%Turuncu%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'NOMEX-TULUM-TURUNCU-XL'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'NOMEX-TULUM-YESIL-S', 'S', 'yesil'::color_type
FROM products p
WHERE p.category = 'tulum'::textile_category 
  AND p.fabric = 'nomex'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'NOMEX-TULUM-YESIL-S'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'NOMEX-TULUM-YESIL-XL', 'XL', 'yesil'::color_type
FROM products p
WHERE p.category = 'tulum'::textile_category 
  AND p.fabric = 'nomex'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'NOMEX-TULUM-YESIL-XL'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'NOMEX-TULUM-TURUNCU-2XL', '2XL', 'turuncu'::color_type
FROM products p
WHERE p.category = 'tulum'::textile_category 
  AND p.fabric = 'nomex'::fabric_type
  AND p.name ILIKE '%Turuncu%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'NOMEX-TULUM-TURUNCU-2XL'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'NOMEX-TULUM-TURUNCU-3XL', '3XL', 'turuncu'::color_type
FROM products p
WHERE p.category = 'tulum'::textile_category 
  AND p.fabric = 'nomex'::fabric_type
  AND p.name ILIKE '%Turuncu%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'NOMEX-TULUM-TURUNCU-3XL'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-PANTOLON-YESIL-XS', 'XS', 'yesil'::color_type
FROM products p
WHERE p.category = 'pantolon'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-PANTOLON-YESIL-XS'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-GOMLEK-YESIL-2XS', '2XS', 'yesil'::color_type
FROM products p
WHERE p.category = 'gomlek'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-GOMLEK-YESIL-2XS'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-PANTOLON-TURUNCU-2XS', '2XS', 'turuncu'::color_type
FROM products p
WHERE p.category = 'pantolon'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Turuncu%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-PANTOLON-TURUNCU-2XS'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-KABAN-TURUNCU-L', 'L', 'turuncu'::color_type
FROM products p
WHERE p.category = 'kaban'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Turuncu%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-KABAN-TURUNCU-L'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-KABAN-TURUNCU-XS', 'XS', 'turuncu'::color_type
FROM products p
WHERE p.category = 'kaban'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Turuncu%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-KABAN-TURUNCU-XS'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-PANTOLON-YESIL-2XS', '2XS', 'yesil'::color_type
FROM products p
WHERE p.category = 'pantolon'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-PANTOLON-YESIL-2XS'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-PANTOLON-TURUNCU-XS', 'XS', 'turuncu'::color_type
FROM products p
WHERE p.category = 'pantolon'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Turuncu%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-PANTOLON-TURUNCU-XS'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-PANTOLON-TURUNCU-S', 'S', 'turuncu'::color_type
FROM products p
WHERE p.category = 'pantolon'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Turuncu%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-PANTOLON-TURUNCU-S'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-PANTOLON-TURUNCU-M', 'M', 'turuncu'::color_type
FROM products p
WHERE p.category = 'pantolon'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Turuncu%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-PANTOLON-TURUNCU-M'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-GOMLEK-YESIL-XS', 'XS', 'yesil'::color_type
FROM products p
WHERE p.category = 'gomlek'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-GOMLEK-YESIL-XS'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-PANTOLON-TURUNCU-L', 'L', 'turuncu'::color_type
FROM products p
WHERE p.category = 'pantolon'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Turuncu%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-PANTOLON-TURUNCU-L'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-GOMLEK-YESIL-S', 'S', 'yesil'::color_type
FROM products p
WHERE p.category = 'gomlek'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-GOMLEK-YESIL-S'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-GOMLEK-TURUNCU-2XS', '2XS', 'turuncu'::color_type
FROM products p
WHERE p.category = 'gomlek'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Turuncu%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-GOMLEK-TURUNCU-2XS'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-KABAN-TURUNCU-S', 'S', 'turuncu'::color_type
FROM products p
WHERE p.category = 'kaban'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Turuncu%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-KABAN-TURUNCU-S'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-PANTOLON-YESIL-S', 'S', 'yesil'::color_type
FROM products p
WHERE p.category = 'pantolon'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-PANTOLON-YESIL-S'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-KABAN-TURUNCU-XL', 'XL', 'turuncu'::color_type
FROM products p
WHERE p.category = 'kaban'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Turuncu%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-KABAN-TURUNCU-XL'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-KABAN-TURUNCU-2XS', '2XS', 'turuncu'::color_type
FROM products p
WHERE p.category = 'kaban'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Turuncu%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-KABAN-TURUNCU-2XS'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-GOMLEK-YESIL-M', 'M', 'yesil'::color_type
FROM products p
WHERE p.category = 'gomlek'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-GOMLEK-YESIL-M'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-GOMLEK-TURUNCU-XS', 'XS', 'turuncu'::color_type
FROM products p
WHERE p.category = 'gomlek'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Turuncu%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-GOMLEK-TURUNCU-XS'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-GOMLEK-YESIL-L', 'L', 'yesil'::color_type
FROM products p
WHERE p.category = 'gomlek'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-GOMLEK-YESIL-L'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-GOMLEK-TURUNCU-S', 'S', 'turuncu'::color_type
FROM products p
WHERE p.category = 'gomlek'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Turuncu%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-GOMLEK-TURUNCU-S'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-GOMLEK-TURUNCU-M', 'M', 'turuncu'::color_type
FROM products p
WHERE p.category = 'gomlek'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Turuncu%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-GOMLEK-TURUNCU-M'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-PANTOLON-YESIL-M', 'M', 'yesil'::color_type
FROM products p
WHERE p.category = 'pantolon'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-PANTOLON-YESIL-M'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-GOMLEK-TURUNCU-L', 'L', 'turuncu'::color_type
FROM products p
WHERE p.category = 'gomlek'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Turuncu%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-GOMLEK-TURUNCU-L'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-KABAN-TURUNCU-2XL', '2XL', 'turuncu'::color_type
FROM products p
WHERE p.category = 'kaban'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Turuncu%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-KABAN-TURUNCU-2XL'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-KABAN-TURUNCU-3XL', '3XL', 'turuncu'::color_type
FROM products p
WHERE p.category = 'kaban'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Turuncu%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-KABAN-TURUNCU-3XL'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-KABAN-TURUNCU-M', 'M', 'turuncu'::color_type
FROM products p
WHERE p.category = 'kaban'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Turuncu%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-KABAN-TURUNCU-M'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-GOMLEK-YESIL-XL', 'XL', 'yesil'::color_type
FROM products p
WHERE p.category = 'gomlek'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-GOMLEK-YESIL-XL'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-PANTOLON-YESIL-L', 'L', 'yesil'::color_type
FROM products p
WHERE p.category = 'pantolon'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-PANTOLON-YESIL-L'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-GOMLEK-TURUNCU-XL', 'XL', 'turuncu'::color_type
FROM products p
WHERE p.category = 'gomlek'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Turuncu%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-GOMLEK-TURUNCU-XL'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-PANTOLON-YESIL-XL', 'XL', 'yesil'::color_type
FROM products p
WHERE p.category = 'pantolon'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-PANTOLON-YESIL-XL'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-GOMLEK-TURUNCU-2XL', '2XL', 'turuncu'::color_type
FROM products p
WHERE p.category = 'gomlek'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Turuncu%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-GOMLEK-TURUNCU-2XL'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-PANTOLON-YESIL-2XL', '2XL', 'yesil'::color_type
FROM products p
WHERE p.category = 'pantolon'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-PANTOLON-YESIL-2XL'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-PANTOLON-TURUNCU-2XL', '2XL', 'turuncu'::color_type
FROM products p
WHERE p.category = 'pantolon'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Turuncu%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-PANTOLON-TURUNCU-2XL'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-GOMLEK-YESIL-2XL', '2XL', 'yesil'::color_type
FROM products p
WHERE p.category = 'gomlek'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-GOMLEK-YESIL-2XL'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-PANTOLON-TURUNCU-3XL', '3XL', 'turuncu'::color_type
FROM products p
WHERE p.category = 'pantolon'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Turuncu%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-PANTOLON-TURUNCU-3XL'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-GOMLEK-YESIL-3XL', '3XL', 'yesil'::color_type
FROM products p
WHERE p.category = 'gomlek'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-GOMLEK-YESIL-3XL'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-GOMLEK-TURUNCU-3XL', '3XL', 'turuncu'::color_type
FROM products p
WHERE p.category = 'gomlek'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Turuncu%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-GOMLEK-TURUNCU-3XL'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'NOMEX-GOMLEK-YESIL-2XS', '2XS', 'yesil'::color_type
FROM products p
WHERE p.category = 'gomlek'::textile_category 
  AND p.fabric = 'nomex'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'NOMEX-GOMLEK-YESIL-2XS'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'NOMEX-KABAN-TURUNCU-2XS', '2XS', 'turuncu'::color_type
FROM products p
WHERE p.category = 'kaban'::textile_category 
  AND p.fabric = 'nomex'::fabric_type
  AND p.name ILIKE '%Turuncu%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'NOMEX-KABAN-TURUNCU-2XS'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'NOMEX-KABAN-TURUNCU-L', 'L', 'turuncu'::color_type
FROM products p
WHERE p.category = 'kaban'::textile_category 
  AND p.fabric = 'nomex'::fabric_type
  AND p.name ILIKE '%Turuncu%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'NOMEX-KABAN-TURUNCU-L'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'NOMEX-PANTOLON-YESIL-XL', 'XL', 'yesil'::color_type
FROM products p
WHERE p.category = 'pantolon'::textile_category 
  AND p.fabric = 'nomex'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'NOMEX-PANTOLON-YESIL-XL'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'NOMEX-PANTOLON-YESIL-3XL', '3XL', 'yesil'::color_type
FROM products p
WHERE p.category = 'pantolon'::textile_category 
  AND p.fabric = 'nomex'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'NOMEX-PANTOLON-YESIL-3XL'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'NOMEX-PANTOLON-YESIL-2XS', '2XS', 'yesil'::color_type
FROM products p
WHERE p.category = 'pantolon'::textile_category 
  AND p.fabric = 'nomex'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'NOMEX-PANTOLON-YESIL-2XS'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-PANTOLON-TURUNCU-XL', 'XL', 'turuncu'::color_type
FROM products p
WHERE p.category = 'pantolon'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Turuncu%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-PANTOLON-TURUNCU-XL'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'NOMEX-GOMLEK-YESIL-S', 'S', 'yesil'::color_type
FROM products p
WHERE p.category = 'gomlek'::textile_category 
  AND p.fabric = 'nomex'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'NOMEX-GOMLEK-YESIL-S'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'NOMEX-PANTOLON-YESIL-M', 'M', 'yesil'::color_type
FROM products p
WHERE p.category = 'pantolon'::textile_category 
  AND p.fabric = 'nomex'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'NOMEX-PANTOLON-YESIL-M'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'NOMEX-KABAN-TURUNCU-XS', 'XS', 'turuncu'::color_type
FROM products p
WHERE p.category = 'kaban'::textile_category 
  AND p.fabric = 'nomex'::fabric_type
  AND p.name ILIKE '%Turuncu%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'NOMEX-KABAN-TURUNCU-XS'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'NOMEX-KABAN-TURUNCU-XL', 'XL', 'turuncu'::color_type
FROM products p
WHERE p.category = 'kaban'::textile_category 
  AND p.fabric = 'nomex'::fabric_type
  AND p.name ILIKE '%Turuncu%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'NOMEX-KABAN-TURUNCU-XL'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'NOMEX-GOMLEK-YESIL-L', 'L', 'yesil'::color_type
FROM products p
WHERE p.category = 'gomlek'::textile_category 
  AND p.fabric = 'nomex'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'NOMEX-GOMLEK-YESIL-L'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'NOMEX-KABAN-TURUNCU-S', 'S', 'turuncu'::color_type
FROM products p
WHERE p.category = 'kaban'::textile_category 
  AND p.fabric = 'nomex'::fabric_type
  AND p.name ILIKE '%Turuncu%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'NOMEX-KABAN-TURUNCU-S'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'NOMEX-PANTOLON-YESIL-L', 'L', 'yesil'::color_type
FROM products p
WHERE p.category = 'pantolon'::textile_category 
  AND p.fabric = 'nomex'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'NOMEX-PANTOLON-YESIL-L'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'NOMEX-GOMLEK-YESIL-2XL', '2XL', 'yesil'::color_type
FROM products p
WHERE p.category = 'gomlek'::textile_category 
  AND p.fabric = 'nomex'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'NOMEX-GOMLEK-YESIL-2XL'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'NOMEX-PANTOLON-YESIL-2XL', '2XL', 'yesil'::color_type
FROM products p
WHERE p.category = 'pantolon'::textile_category 
  AND p.fabric = 'nomex'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'NOMEX-PANTOLON-YESIL-2XL'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'NOMEX-GOMLEK-YESIL-3XL', '3XL', 'yesil'::color_type
FROM products p
WHERE p.category = 'gomlek'::textile_category 
  AND p.fabric = 'nomex'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'NOMEX-GOMLEK-YESIL-3XL'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'NOMEX-GOMLEK-YESIL-XS', 'XS', 'yesil'::color_type
FROM products p
WHERE p.category = 'gomlek'::textile_category 
  AND p.fabric = 'nomex'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'NOMEX-GOMLEK-YESIL-XS'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'NOMEX-PANTOLON-YESIL-XS', 'XS', 'yesil'::color_type
FROM products p
WHERE p.category = 'pantolon'::textile_category 
  AND p.fabric = 'nomex'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'NOMEX-PANTOLON-YESIL-XS'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'NOMEX-KABAN-TURUNCU-M', 'M', 'turuncu'::color_type
FROM products p
WHERE p.category = 'kaban'::textile_category 
  AND p.fabric = 'nomex'::fabric_type
  AND p.name ILIKE '%Turuncu%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'NOMEX-KABAN-TURUNCU-M'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'NOMEX-KABAN-TURUNCU-2XL', '2XL', 'turuncu'::color_type
FROM products p
WHERE p.category = 'kaban'::textile_category 
  AND p.fabric = 'nomex'::fabric_type
  AND p.name ILIKE '%Turuncu%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'NOMEX-KABAN-TURUNCU-2XL'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'NOMEX-KABAN-TURUNCU-3XL', '3XL', 'turuncu'::color_type
FROM products p
WHERE p.category = 'kaban'::textile_category 
  AND p.fabric = 'nomex'::fabric_type
  AND p.name ILIKE '%Turuncu%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'NOMEX-KABAN-TURUNCU-3XL'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'NOMEX-GOMLEK-YESIL-M', 'M', 'yesil'::color_type
FROM products p
WHERE p.category = 'gomlek'::textile_category 
  AND p.fabric = 'nomex'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'NOMEX-GOMLEK-YESIL-M'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'NOMEX-PANTOLON-YESIL-S', 'S', 'yesil'::color_type
FROM products p
WHERE p.category = 'pantolon'::textile_category 
  AND p.fabric = 'nomex'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'NOMEX-PANTOLON-YESIL-S'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'NOMEX-GOMLEK-YESIL-4XL', '4XL', 'yesil'::color_type
FROM products p
WHERE p.category = 'gomlek'::textile_category 
  AND p.fabric = 'nomex'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'NOMEX-GOMLEK-YESIL-4XL'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'NOMEX-GOMLEK-YESIL-XL', 'XL', 'yesil'::color_type
FROM products p
WHERE p.category = 'gomlek'::textile_category 
  AND p.fabric = 'nomex'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'NOMEX-GOMLEK-YESIL-XL'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-KABAN-YESIL-2XS', '2XS', 'yesil'::color_type
FROM products p
WHERE p.category = 'kaban'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-KABAN-YESIL-2XS'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-KABAN-YESIL-L', 'L', 'yesil'::color_type
FROM products p
WHERE p.category = 'kaban'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-KABAN-YESIL-L'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'NOMEX-KABAN-YESIL-2XS', '2XS', 'yesil'::color_type
FROM products p
WHERE p.category = 'kaban'::textile_category 
  AND p.fabric = 'nomex'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'NOMEX-KABAN-YESIL-2XS'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'NOMEX-KABAN-YESIL-S', 'S', 'yesil'::color_type
FROM products p
WHERE p.category = 'kaban'::textile_category 
  AND p.fabric = 'nomex'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'NOMEX-KABAN-YESIL-S'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-KABAN-YESIL-XS', 'XS', 'yesil'::color_type
FROM products p
WHERE p.category = 'kaban'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-KABAN-YESIL-XS'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-KABAN-YESIL-M', 'M', 'yesil'::color_type
FROM products p
WHERE p.category = 'kaban'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-KABAN-YESIL-M'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-KABAN-YESIL-XL', 'XL', 'yesil'::color_type
FROM products p
WHERE p.category = 'kaban'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-KABAN-YESIL-XL'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-KABAN-YESIL-2XL', '2XL', 'yesil'::color_type
FROM products p
WHERE p.category = 'kaban'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-KABAN-YESIL-2XL'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'NOMEX-KABAN-YESIL-XS', 'XS', 'yesil'::color_type
FROM products p
WHERE p.category = 'kaban'::textile_category 
  AND p.fabric = 'nomex'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'NOMEX-KABAN-YESIL-XS'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'NOMEX-KABAN-YESIL-M', 'M', 'yesil'::color_type
FROM products p
WHERE p.category = 'kaban'::textile_category 
  AND p.fabric = 'nomex'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'NOMEX-KABAN-YESIL-M'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'NOMEX-KABAN-YESIL-L', 'L', 'yesil'::color_type
FROM products p
WHERE p.category = 'kaban'::textile_category 
  AND p.fabric = 'nomex'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'NOMEX-KABAN-YESIL-L'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'NOMEX-KABAN-YESIL-XL', 'XL', 'yesil'::color_type
FROM products p
WHERE p.category = 'kaban'::textile_category 
  AND p.fabric = 'nomex'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'NOMEX-KABAN-YESIL-XL'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-KABAN-YESIL-3XL', '3XL', 'yesil'::color_type
FROM products p
WHERE p.category = 'kaban'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-KABAN-YESIL-3XL'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-KABAN-YESIL-S', 'S', 'yesil'::color_type
FROM products p
WHERE p.category = 'kaban'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-KABAN-YESIL-S'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'GTC-KABAN-YESIL-4XL', '4XL', 'yesil'::color_type
FROM products p
WHERE p.category = 'kaban'::textile_category 
  AND p.fabric = 'gtc'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'GTC-KABAN-YESIL-4XL'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'NOMEX-KABAN-YESIL-2XL', '2XL', 'yesil'::color_type
FROM products p
WHERE p.category = 'kaban'::textile_category 
  AND p.fabric = 'nomex'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'NOMEX-KABAN-YESIL-2XL'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'NOMEX-KABAN-YESIL-3XL', '3XL', 'yesil'::color_type
FROM products p
WHERE p.category = 'kaban'::textile_category 
  AND p.fabric = 'nomex'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'NOMEX-KABAN-YESIL-3XL'
  )
LIMIT 1;

INSERT INTO variants (product_id, sku, size, color)
SELECT p.id, 'NOMEX-KABAN-YESIL-4XL', '4XL', 'yesil'::color_type
FROM products p
WHERE p.category = 'kaban'::textile_category 
  AND p.fabric = 'nomex'::fabric_type
  AND p.name ILIKE '%Yeşil%'
  AND NOT EXISTS (
    SELECT 1 FROM variants WHERE sku = 'NOMEX-KABAN-YESIL-4XL'
  )
LIMIT 1;

-- ============================================================
-- 3. INSERT STOCK ENTRIES
-- ============================================================
-- For each entry: find variant by (fabric, category, color, size)
-- and location by location_id, then upsert stock
-- ============================================================

-- F0-R1-A-1: gtc tulum yesil S = 70 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 70
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R1-A-1'
WHERE v.sku = 'GTC-TULUM-YESIL-S'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R1-B-1: gtc tulum yesil 2XL = 30 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 30
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R1-B-1'
WHERE v.sku = 'GTC-TULUM-YESIL-2XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R1-C-1: gtc tulum yesil 2XL = 16 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 16
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R1-C-1'
WHERE v.sku = 'GTC-TULUM-YESIL-2XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R1-E-1: gtc tulum turuncu 2XS = 40 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 40
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R1-E-1'
WHERE v.sku = 'GTC-TULUM-TURUNCU-2XS'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R1-B-1: gtc tulum yesil 3XL = 32 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 32
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R1-B-1'
WHERE v.sku = 'GTC-TULUM-YESIL-3XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R1-A-2: gtc tulum yesil S = 40 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 40
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R1-A-2'
WHERE v.sku = 'GTC-TULUM-YESIL-S'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R1-B-2: gtc tulum yesil XL = 139 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 139
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R1-B-2'
WHERE v.sku = 'GTC-TULUM-YESIL-XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R1-C-2: gtc tulum yesil 2XL = 70 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 70
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R1-C-2'
WHERE v.sku = 'GTC-TULUM-YESIL-2XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R1-D-2: gtc tulum turuncu L = 60 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 60
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R1-D-2'
WHERE v.sku = 'GTC-TULUM-TURUNCU-L'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R1-E-2: gtc tulum turuncu XS = 10 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 10
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R1-E-2'
WHERE v.sku = 'GTC-TULUM-TURUNCU-XS'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R1-A-2: gtc tulum yesil M = 100 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 100
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R1-A-2'
WHERE v.sku = 'GTC-TULUM-YESIL-M'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R1-C-2: gtc tulum yesil 3XL = 58 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 58
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R1-C-2'
WHERE v.sku = 'GTC-TULUM-YESIL-3XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R1-D-2: gtc tulum turuncu S = 20 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 20
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R1-D-2'
WHERE v.sku = 'GTC-TULUM-TURUNCU-S'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R1-E-2: gtc tulum turuncu XL = 20 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 20
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R1-E-2'
WHERE v.sku = 'GTC-TULUM-TURUNCU-XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R1-E-2: gtc tulum turuncu M = 20 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 20
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R1-E-2'
WHERE v.sku = 'GTC-TULUM-TURUNCU-M'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R1-E-2: gtc tulum turuncu L = 23 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 23
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R1-E-2'
WHERE v.sku = 'GTC-TULUM-TURUNCU-L'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R1-C-2: gtc tulum yesil L = 10 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 10
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R1-C-2'
WHERE v.sku = 'GTC-TULUM-YESIL-L'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R1-D-2: gtc tulum turuncu M = 40 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 40
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R1-D-2'
WHERE v.sku = 'GTC-TULUM-TURUNCU-M'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R1-E-2: gtc tulum turuncu S = 37 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 37
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R1-E-2'
WHERE v.sku = 'GTC-TULUM-TURUNCU-S'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R1-A-3: gtc tulum yesil 2XS = 60 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 60
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R1-A-3'
WHERE v.sku = 'GTC-TULUM-YESIL-2XS'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R1-B-3: gtc tulum yesil XL = 160 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 160
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R1-B-3'
WHERE v.sku = 'GTC-TULUM-YESIL-XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R1-D-3: gtc tulum turuncu 2XL = 30 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 30
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R1-D-3'
WHERE v.sku = 'GTC-TULUM-TURUNCU-2XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R1-E-3: gtc tulum turuncu XL = 20 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 20
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R1-E-3'
WHERE v.sku = 'GTC-TULUM-TURUNCU-XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R1-A-3: gtc tulum yesil XS = 50 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 50
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R1-A-3'
WHERE v.sku = 'GTC-TULUM-YESIL-XS'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R1-D-3: gtc tulum turuncu 3XL = 50 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 50
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R1-D-3'
WHERE v.sku = 'GTC-TULUM-TURUNCU-3XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R1-E-3: gtc tulum turuncu 2XL = 70 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 70
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R1-E-3'
WHERE v.sku = 'GTC-TULUM-TURUNCU-2XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R1-E-3: gtc tulum turuncu M = 8 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 8
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R1-E-3'
WHERE v.sku = 'GTC-TULUM-TURUNCU-M'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R1-A-3: gtc tulum yesil S = 40 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 40
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R1-A-3'
WHERE v.sku = 'GTC-TULUM-YESIL-S'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R1-D-3: gtc tulum turuncu XL = 40 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 40
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R1-D-3'
WHERE v.sku = 'GTC-TULUM-TURUNCU-XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R1-E-3: gtc tulum turuncu 3XL = 50 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 50
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R1-E-3'
WHERE v.sku = 'GTC-TULUM-TURUNCU-3XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R1-A-3: gtc tulum yesil M = 10 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 10
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R1-A-3'
WHERE v.sku = 'GTC-TULUM-YESIL-M'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R1-C-3: gtc tulum yesil L = 160 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 160
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R1-C-3'
WHERE v.sku = 'GTC-TULUM-YESIL-L'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R1-E-3: gtc tulum turuncu 4XL = 10 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 10
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R1-E-3'
WHERE v.sku = 'GTC-TULUM-TURUNCU-4XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R2-C-1: nomex tulum turuncu 2XS = 40 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 40
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R2-C-1'
WHERE v.sku = 'NOMEX-TULUM-TURUNCU-2XS'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R2-C-1: nomex tulum turuncu XS = 25 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 25
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R2-C-1'
WHERE v.sku = 'NOMEX-TULUM-TURUNCU-XS'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R2-D-1: nomex tulum turuncu XS = 95 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 95
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R2-D-1'
WHERE v.sku = 'NOMEX-TULUM-TURUNCU-XS'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R2-A-2: nomex tulum yesil 2XS = 25 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 25
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R2-A-2'
WHERE v.sku = 'NOMEX-TULUM-YESIL-2XS'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R2-B-2: nomex tulum yesil M = 140 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 140
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R2-B-2'
WHERE v.sku = 'NOMEX-TULUM-YESIL-M'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R2-C-2: nomex tulum turuncu S = 160 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 160
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R2-C-2'
WHERE v.sku = 'NOMEX-TULUM-TURUNCU-S'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R2-D-2: nomex tulum turuncu M = 50 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 50
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R2-D-2'
WHERE v.sku = 'NOMEX-TULUM-TURUNCU-M'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R2-A-2: nomex tulum yesil XS = 50 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 50
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R2-A-2'
WHERE v.sku = 'NOMEX-TULUM-YESIL-XS'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R2-B-2: nomex tulum yesil L = 120 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 120
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R2-B-2'
WHERE v.sku = 'NOMEX-TULUM-YESIL-L'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R2-D-2: nomex tulum turuncu L = 100 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 100
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R2-D-2'
WHERE v.sku = 'NOMEX-TULUM-TURUNCU-L'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R2-D-2: nomex tulum turuncu XL = 90 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 90
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R2-D-2'
WHERE v.sku = 'NOMEX-TULUM-TURUNCU-XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R2-A-3: nomex tulum yesil S = 135 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 135
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R2-A-3'
WHERE v.sku = 'NOMEX-TULUM-YESIL-S'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R2-B-3: nomex tulum yesil XL = 140 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 140
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R2-B-3'
WHERE v.sku = 'NOMEX-TULUM-YESIL-XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R2-C-3: nomex tulum turuncu 2XL = 100 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 100
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R2-C-3'
WHERE v.sku = 'NOMEX-TULUM-TURUNCU-2XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R2-D-3: nomex tulum turuncu 2XL = 40 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 40
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R2-D-3'
WHERE v.sku = 'NOMEX-TULUM-TURUNCU-2XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R2-B-3: nomex tulum yesil L = 20 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 20
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R2-B-3'
WHERE v.sku = 'NOMEX-TULUM-YESIL-L'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R2-C-3: nomex tulum turuncu 3XL = 40 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 40
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R2-C-3'
WHERE v.sku = 'NOMEX-TULUM-TURUNCU-3XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R2-D-3: nomex tulum turuncu 3XL = 61 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 61
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R2-D-3'
WHERE v.sku = 'NOMEX-TULUM-TURUNCU-3XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-A-1: gtc pantolon yesil XS = 44 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 44
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-A-1'
WHERE v.sku = 'GTC-PANTOLON-YESIL-XS'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-B-1: gtc gomlek yesil 2XS = 27 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 27
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-B-1'
WHERE v.sku = 'GTC-GOMLEK-YESIL-2XS'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-C-1: gtc pantolon turuncu 2XS = 10 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 10
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-C-1'
WHERE v.sku = 'GTC-PANTOLON-TURUNCU-2XS'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-D-1: gtc kaban turuncu L = 55 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 55
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-D-1'
WHERE v.sku = 'GTC-KABAN-TURUNCU-L'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-E-1: gtc kaban turuncu XS = 45 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 45
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-E-1'
WHERE v.sku = 'GTC-KABAN-TURUNCU-XS'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-A-1: gtc pantolon yesil 2XS = 18 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 18
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-A-1'
WHERE v.sku = 'GTC-PANTOLON-YESIL-2XS'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-B-1: gtc pantolon yesil 2XS = 25 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 25
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-B-1'
WHERE v.sku = 'GTC-PANTOLON-YESIL-2XS'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-C-1: gtc pantolon turuncu XS = 10 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 10
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-C-1'
WHERE v.sku = 'GTC-PANTOLON-TURUNCU-XS'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-C-1: gtc pantolon turuncu S = 10 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 10
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-C-1'
WHERE v.sku = 'GTC-PANTOLON-TURUNCU-S'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-C-1: gtc pantolon turuncu M = 10 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 10
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-C-1'
WHERE v.sku = 'GTC-PANTOLON-TURUNCU-M'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-A-1: gtc gomlek yesil XS = 35 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 35
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-A-1'
WHERE v.sku = 'GTC-GOMLEK-YESIL-XS'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-C-1: gtc pantolon turuncu L = 10 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 10
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-C-1'
WHERE v.sku = 'GTC-PANTOLON-TURUNCU-L'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-A-2: gtc gomlek yesil XS = 40 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 40
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-A-2'
WHERE v.sku = 'GTC-GOMLEK-YESIL-XS'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-B-2: gtc gomlek yesil S = 100 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 100
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-B-2'
WHERE v.sku = 'GTC-GOMLEK-YESIL-S'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-C-2: gtc gomlek turuncu 2XS = 40 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 40
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-C-2'
WHERE v.sku = 'GTC-GOMLEK-TURUNCU-2XS'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-D-2: gtc kaban turuncu S = 10 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 10
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-D-2'
WHERE v.sku = 'GTC-KABAN-TURUNCU-S'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-E-2: gtc kaban turuncu XS = 45 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 45
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-E-2'
WHERE v.sku = 'GTC-KABAN-TURUNCU-XS'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-A-2: gtc gomlek yesil S = 93 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 93
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-A-2'
WHERE v.sku = 'GTC-GOMLEK-YESIL-S'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-B-2: gtc pantolon yesil S = 40 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 40
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-B-2'
WHERE v.sku = 'GTC-PANTOLON-YESIL-S'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-C-2: gtc pantolon turuncu 2XS = 40 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 40
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-C-2'
WHERE v.sku = 'GTC-PANTOLON-TURUNCU-2XS'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-D-2: gtc kaban turuncu XL = 65 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 65
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-D-2'
WHERE v.sku = 'GTC-KABAN-TURUNCU-XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-E-2: gtc kaban turuncu 2XS = 9 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 9
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-E-2'
WHERE v.sku = 'GTC-KABAN-TURUNCU-2XS'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-A-2: gtc gomlek yesil M = 80 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 80
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-A-2'
WHERE v.sku = 'GTC-GOMLEK-YESIL-M'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-B-2: gtc gomlek yesil M = 100 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 100
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-B-2'
WHERE v.sku = 'GTC-GOMLEK-YESIL-M'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-C-2: gtc gomlek turuncu XS = 40 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 40
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-C-2'
WHERE v.sku = 'GTC-GOMLEK-TURUNCU-XS'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-A-2: gtc gomlek yesil L = 75 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 75
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-A-2'
WHERE v.sku = 'GTC-GOMLEK-YESIL-L'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-C-2: gtc pantolon turuncu XS = 40 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 40
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-C-2'
WHERE v.sku = 'GTC-PANTOLON-TURUNCU-XS'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-C-2: gtc gomlek turuncu S = 40 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 40
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-C-2'
WHERE v.sku = 'GTC-GOMLEK-TURUNCU-S'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-C-2: gtc pantolon turuncu S = 40 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 40
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-C-2'
WHERE v.sku = 'GTC-PANTOLON-TURUNCU-S'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-C-2: gtc gomlek turuncu M = 40 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 40
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-C-2'
WHERE v.sku = 'GTC-GOMLEK-TURUNCU-M'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-C-2: gtc pantolon turuncu M = 40 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 40
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-C-2'
WHERE v.sku = 'GTC-PANTOLON-TURUNCU-M'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-A-3: gtc gomlek yesil 2XS = 19 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 19
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-A-3'
WHERE v.sku = 'GTC-GOMLEK-YESIL-2XS'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-B-3: gtc pantolon yesil M = 50 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 50
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-B-3'
WHERE v.sku = 'GTC-PANTOLON-YESIL-M'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-C-3: gtc gomlek turuncu L = 35 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 35
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-C-3'
WHERE v.sku = 'GTC-GOMLEK-TURUNCU-L'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-D-3: gtc kaban turuncu 2XL = 30 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 30
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-D-3'
WHERE v.sku = 'GTC-KABAN-TURUNCU-2XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-E-3: gtc kaban turuncu S = 45 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 45
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-E-3'
WHERE v.sku = 'GTC-KABAN-TURUNCU-S'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-A-3: gtc gomlek yesil XS = 9 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 9
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-A-3'
WHERE v.sku = 'GTC-GOMLEK-YESIL-XS'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-B-3: gtc gomlek yesil L = 10 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 10
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-B-3'
WHERE v.sku = 'GTC-GOMLEK-YESIL-L'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-C-3: gtc pantolon turuncu L = 34 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 34
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-C-3'
WHERE v.sku = 'GTC-PANTOLON-TURUNCU-L'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-D-3: gtc kaban turuncu 3XL = 29 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 29
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-D-3'
WHERE v.sku = 'GTC-KABAN-TURUNCU-3XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-E-3: gtc kaban turuncu M = 55 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 55
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-E-3'
WHERE v.sku = 'GTC-KABAN-TURUNCU-M'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-A-3: gtc gomlek yesil XL = 67 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 67
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-A-3'
WHERE v.sku = 'GTC-GOMLEK-YESIL-XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-B-3: gtc pantolon yesil L = 50 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 50
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-B-3'
WHERE v.sku = 'GTC-PANTOLON-YESIL-L'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-C-3: gtc gomlek turuncu XL = 80 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 80
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-C-3'
WHERE v.sku = 'GTC-GOMLEK-TURUNCU-XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-A-3: gtc pantolon yesil XL = 22 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 22
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-A-3'
WHERE v.sku = 'GTC-PANTOLON-YESIL-XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-B-3: gtc gomlek yesil XL = 10 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 10
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-B-3'
WHERE v.sku = 'GTC-GOMLEK-YESIL-XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-C-3: gtc gomlek turuncu 2XL = 35 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 35
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-C-3'
WHERE v.sku = 'GTC-GOMLEK-TURUNCU-2XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-A-3: gtc pantolon yesil 2XL = 13 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 13
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-A-3'
WHERE v.sku = 'GTC-PANTOLON-YESIL-2XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-B-3: gtc pantolon yesil XL = 40 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 40
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-B-3'
WHERE v.sku = 'GTC-PANTOLON-YESIL-XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-C-3: gtc pantolon turuncu 2XL = 40 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 40
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-C-3'
WHERE v.sku = 'GTC-PANTOLON-TURUNCU-2XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-A-3: gtc gomlek yesil 2XL = 57 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 57
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-A-3'
WHERE v.sku = 'GTC-GOMLEK-YESIL-2XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-B-3: gtc gomlek yesil 2XL = 50 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 50
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-B-3'
WHERE v.sku = 'GTC-GOMLEK-YESIL-2XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-C-3: gtc pantolon turuncu 3XL = 60 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 60
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-C-3'
WHERE v.sku = 'GTC-PANTOLON-TURUNCU-3XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-A-3: gtc gomlek yesil 3XL = 18 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 18
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-A-3'
WHERE v.sku = 'GTC-GOMLEK-YESIL-3XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-B-3: gtc pantolon yesil 2XL = 25 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 25
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-B-3'
WHERE v.sku = 'GTC-PANTOLON-YESIL-2XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R3-C-3: gtc gomlek turuncu 3XL = 57 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 57
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R3-C-3'
WHERE v.sku = 'GTC-GOMLEK-TURUNCU-3XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R4-A-1: nomex gomlek yesil 2XS = 28 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 28
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R4-A-1'
WHERE v.sku = 'NOMEX-GOMLEK-YESIL-2XS'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R4-B-1: gtc gomlek turuncu 2XS = 10 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 10
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R4-B-1'
WHERE v.sku = 'GTC-GOMLEK-TURUNCU-2XS'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R4-C-1: nomex kaban turuncu 2XS = 20 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 20
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R4-C-1'
WHERE v.sku = 'NOMEX-KABAN-TURUNCU-2XS'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R4-D-1: nomex kaban turuncu L = 60 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 60
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R4-D-1'
WHERE v.sku = 'NOMEX-KABAN-TURUNCU-L'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R4-A-1: nomex pantolon yesil XL = 20 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 20
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R4-A-1'
WHERE v.sku = 'NOMEX-PANTOLON-YESIL-XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R4-B-1: gtc gomlek turuncu XS = 10 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 10
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R4-B-1'
WHERE v.sku = 'GTC-GOMLEK-TURUNCU-XS'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R4-A-1: nomex pantolon yesil 3XL = 10 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 10
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R4-A-1'
WHERE v.sku = 'NOMEX-PANTOLON-YESIL-3XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R4-B-1: gtc gomlek turuncu S = 80 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 80
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R4-B-1'
WHERE v.sku = 'GTC-GOMLEK-TURUNCU-S'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R4-B-1: gtc gomlek turuncu M = 40 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 40
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R4-B-1'
WHERE v.sku = 'GTC-GOMLEK-TURUNCU-M'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R4-B-1: gtc gomlek turuncu L = 50 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 50
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R4-B-1'
WHERE v.sku = 'GTC-GOMLEK-TURUNCU-L'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R4-B-1: gtc pantolon turuncu S = 20 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 20
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R4-B-1'
WHERE v.sku = 'GTC-PANTOLON-TURUNCU-S'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R4-B-1: gtc pantolon turuncu L = 40 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 40
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R4-B-1'
WHERE v.sku = 'GTC-PANTOLON-TURUNCU-L'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R4-A-1: nomex pantolon yesil 2XS = 35 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 35
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R4-A-1'
WHERE v.sku = 'NOMEX-PANTOLON-YESIL-2XS'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R4-B-1: gtc pantolon turuncu XL = 20 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 20
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R4-B-1'
WHERE v.sku = 'GTC-PANTOLON-TURUNCU-XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R4-A-2: nomex gomlek yesil S = 40 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 40
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R4-A-2'
WHERE v.sku = 'NOMEX-GOMLEK-YESIL-S'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R4-C-2: nomex kaban turuncu 2XS = 5 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 5
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R4-C-2'
WHERE v.sku = 'NOMEX-KABAN-TURUNCU-2XS'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R4-D-2: nomex kaban turuncu L = 5 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 5
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R4-D-2'
WHERE v.sku = 'NOMEX-KABAN-TURUNCU-L'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R4-A-2: nomex pantolon yesil M = 50 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 50
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R4-A-2'
WHERE v.sku = 'NOMEX-PANTOLON-YESIL-M'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R4-C-2: nomex kaban turuncu XS = 45 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 45
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R4-C-2'
WHERE v.sku = 'NOMEX-KABAN-TURUNCU-XS'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R4-D-2: nomex kaban turuncu XL = 73 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 73
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R4-D-2'
WHERE v.sku = 'NOMEX-KABAN-TURUNCU-XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R4-A-2: nomex gomlek yesil L = 40 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 40
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R4-A-2'
WHERE v.sku = 'NOMEX-GOMLEK-YESIL-L'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R4-C-2: nomex kaban turuncu S = 10 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 10
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R4-C-2'
WHERE v.sku = 'NOMEX-KABAN-TURUNCU-S'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R4-A-2: nomex pantolon yesil L = 60 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 60
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R4-A-2'
WHERE v.sku = 'NOMEX-PANTOLON-YESIL-L'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R4-A-2: nomex gomlek yesil 2XL = 50 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 50
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R4-A-2'
WHERE v.sku = 'NOMEX-GOMLEK-YESIL-2XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R4-A-2: nomex pantolon yesil 2XL = 40 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 40
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R4-A-2'
WHERE v.sku = 'NOMEX-PANTOLON-YESIL-2XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R4-A-2: nomex gomlek yesil 3XL = 40 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 40
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R4-A-2'
WHERE v.sku = 'NOMEX-GOMLEK-YESIL-3XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R4-A-2: nomex pantolon yesil 3XL = 40 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 40
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R4-A-2'
WHERE v.sku = 'NOMEX-PANTOLON-YESIL-3XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R4-A-2: nomex pantolon yesil XL = 60 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 60
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R4-A-2'
WHERE v.sku = 'NOMEX-PANTOLON-YESIL-XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R4-A-3: nomex gomlek yesil XS = 100 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 100
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R4-A-3'
WHERE v.sku = 'NOMEX-GOMLEK-YESIL-XS'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R4-C-3: nomex kaban turuncu S = 104 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 104
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R4-C-3'
WHERE v.sku = 'NOMEX-KABAN-TURUNCU-S'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R4-D-3: nomex kaban turuncu L = 5 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 5
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R4-D-3'
WHERE v.sku = 'NOMEX-KABAN-TURUNCU-L'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R4-A-3: nomex pantolon yesil XS = 100 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 100
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R4-A-3'
WHERE v.sku = 'NOMEX-PANTOLON-YESIL-XS'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R4-C-3: nomex kaban turuncu M = 90 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 90
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R4-C-3'
WHERE v.sku = 'NOMEX-KABAN-TURUNCU-M'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R4-D-3: nomex kaban turuncu 2XL = 25 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 25
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R4-D-3'
WHERE v.sku = 'NOMEX-KABAN-TURUNCU-2XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R4-A-3: nomex gomlek yesil S = 60 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 60
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R4-A-3'
WHERE v.sku = 'NOMEX-GOMLEK-YESIL-S'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R4-D-3: nomex kaban turuncu 3XL = 61 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 61
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R4-D-3'
WHERE v.sku = 'NOMEX-KABAN-TURUNCU-3XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R4-A-3: nomex gomlek yesil 2XL = 50 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 50
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R4-A-3'
WHERE v.sku = 'NOMEX-GOMLEK-YESIL-2XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R4-A-3: nomex gomlek yesil M = 50 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 50
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R4-A-3'
WHERE v.sku = 'NOMEX-GOMLEK-YESIL-M'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R4-A-3: nomex gomlek yesil L = 60 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 60
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R4-A-3'
WHERE v.sku = 'NOMEX-GOMLEK-YESIL-L'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R4-A-3: nomex pantolon yesil S = 50 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 50
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R4-A-3'
WHERE v.sku = 'NOMEX-PANTOLON-YESIL-S'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R4-A-3: nomex gomlek yesil 4XL = 10 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 10
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R4-A-3'
WHERE v.sku = 'NOMEX-GOMLEK-YESIL-4XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R4-A-3: nomex gomlek yesil XL = 43 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 43
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R4-A-3'
WHERE v.sku = 'NOMEX-GOMLEK-YESIL-XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R5-A-1: gtc kaban yesil 2XS = 50 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 50
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R5-A-1'
WHERE v.sku = 'GTC-KABAN-YESIL-2XS'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R5-C-1: gtc kaban yesil L = 45 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 45
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R5-C-1'
WHERE v.sku = 'GTC-KABAN-YESIL-L'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R5-D-1: nomex kaban yesil 2XS = 60 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 60
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R5-D-1'
WHERE v.sku = 'NOMEX-KABAN-YESIL-2XS'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R5-E-1: nomex kaban yesil S = 60 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 60
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R5-E-1'
WHERE v.sku = 'NOMEX-KABAN-YESIL-S'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R5-A-1: gtc kaban yesil XS = 10 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 10
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R5-A-1'
WHERE v.sku = 'GTC-KABAN-YESIL-XS'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R5-A-2: gtc kaban yesil 2XS = 60 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 60
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R5-A-2'
WHERE v.sku = 'GTC-KABAN-YESIL-2XS'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R5-B-2: gtc kaban yesil M = 85 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 85
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R5-B-2'
WHERE v.sku = 'GTC-KABAN-YESIL-M'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R5-C-2: gtc kaban yesil XL = 92 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 92
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R5-C-2'
WHERE v.sku = 'GTC-KABAN-YESIL-XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R5-D-2: nomex kaban yesil 2XS = 60 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 60
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R5-D-2'
WHERE v.sku = 'NOMEX-KABAN-YESIL-2XS'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R5-E-2: nomex kaban yesil S = 140 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 140
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R5-E-2'
WHERE v.sku = 'NOMEX-KABAN-YESIL-S'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R5-A-2: gtc kaban yesil XS = 105 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 105
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R5-A-2'
WHERE v.sku = 'GTC-KABAN-YESIL-XS'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R5-B-2: gtc kaban yesil XL = 80 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 80
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R5-B-2'
WHERE v.sku = 'GTC-KABAN-YESIL-XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R5-C-2: gtc kaban yesil 2XL = 34 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 34
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R5-C-2'
WHERE v.sku = 'GTC-KABAN-YESIL-2XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R5-D-2: nomex kaban yesil XS = 60 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 60
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R5-D-2'
WHERE v.sku = 'NOMEX-KABAN-YESIL-XS'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R5-E-2: nomex kaban yesil M = 30 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 30
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R5-E-2'
WHERE v.sku = 'NOMEX-KABAN-YESIL-M'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R5-B-2: gtc kaban yesil 2XL = 10 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 10
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R5-B-2'
WHERE v.sku = 'GTC-KABAN-YESIL-2XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R5-E-2: nomex kaban yesil L = 15 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 15
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R5-E-2'
WHERE v.sku = 'NOMEX-KABAN-YESIL-L'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R5-E-2: nomex kaban yesil XL = 15 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 15
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R5-E-2'
WHERE v.sku = 'NOMEX-KABAN-YESIL-XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R5-A-3: gtc kaban yesil 2XS = 17 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 17
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R5-A-3'
WHERE v.sku = 'GTC-KABAN-YESIL-2XS'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R5-B-3: gtc kaban yesil 3XL = 50 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 50
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R5-B-3'
WHERE v.sku = 'GTC-KABAN-YESIL-3XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R5-C-3: gtc kaban yesil L = 120 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 120
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R5-C-3'
WHERE v.sku = 'GTC-KABAN-YESIL-L'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R5-D-3: nomex kaban yesil XS = 80 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 80
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R5-D-3'
WHERE v.sku = 'NOMEX-KABAN-YESIL-XS'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R5-E-3: nomex kaban yesil XL = 75 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 75
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R5-E-3'
WHERE v.sku = 'NOMEX-KABAN-YESIL-XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R5-A-3: gtc kaban yesil S = 113 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 113
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R5-A-3'
WHERE v.sku = 'GTC-KABAN-YESIL-S'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R5-B-3: gtc kaban yesil 4XL = 30 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 30
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R5-B-3'
WHERE v.sku = 'GTC-KABAN-YESIL-4XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R5-D-3: nomex kaban yesil S = 50 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 50
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R5-D-3'
WHERE v.sku = 'NOMEX-KABAN-YESIL-S'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R5-E-3: nomex kaban yesil 2XL = 48 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 48
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R5-E-3'
WHERE v.sku = 'NOMEX-KABAN-YESIL-2XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R5-A-3: gtc kaban yesil XS = 10 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 10
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R5-A-3'
WHERE v.sku = 'GTC-KABAN-YESIL-XS'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R5-B-3: gtc kaban yesil 2XL = 30 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 30
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R5-B-3'
WHERE v.sku = 'GTC-KABAN-YESIL-2XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R5-E-3: nomex kaban yesil 3XL = 70 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 70
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R5-E-3'
WHERE v.sku = 'NOMEX-KABAN-YESIL-3XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R6-F-1: nomex kaban yesil M = 85 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 85
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R6-F-1'
WHERE v.sku = 'NOMEX-KABAN-YESIL-M'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R6-F-1: nomex kaban yesil L = 85 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 85
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R6-F-1'
WHERE v.sku = 'NOMEX-KABAN-YESIL-L'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R6-F-1: nomex kaban yesil 2XL = 50 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 50
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R6-F-1'
WHERE v.sku = 'NOMEX-KABAN-YESIL-2XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- F0-R6-F-1: nomex kaban yesil 4XL = 10 adet
INSERT INTO stock (variant_id, location_id, quantity)
SELECT v.id, l.id, 10
FROM variants v
JOIN products p ON v.product_id = p.id
JOIN locations l ON l.location_id = 'F0-R6-F-1'
WHERE v.sku = 'NOMEX-KABAN-YESIL-4XL'
ON CONFLICT (variant_id, location_id) 
DO UPDATE SET quantity = EXCLUDED.quantity;

COMMIT;

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================
-- Run these after the import to verify:
-- SELECT COUNT(*) as total_stock_entries FROM stock WHERE location_id IN (SELECT id FROM locations WHERE floor = 'floor_0');
-- SELECT SUM(quantity) as total_items FROM stock WHERE location_id IN (SELECT id FROM locations WHERE floor = 'floor_0');
-- SELECT l.location_id, v.sku, s.quantity FROM stock s JOIN variants v ON s.variant_id = v.id JOIN locations l ON s.location_id = l.id WHERE l.floor = 'floor_0' ORDER BY l.location_id;
