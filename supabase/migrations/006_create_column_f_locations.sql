-- ============================================================
-- Migration Part 2: Create F column locations for Shelf 6
-- ============================================================
-- Run this AFTER 005_add_column_f_shelf6.sql is committed
-- ============================================================

DO $$
DECLARE
    f floor_type;
    cell_num INTEGER;
    floor_num INTEGER;
    loc_id VARCHAR(20);
    floor_name VARCHAR(50);
BEGIN
    FOR f IN SELECT unnest(enum_range(NULL::floor_type)) LOOP
        floor_num := CASE WHEN f = 'floor_0' THEN 0 ELSE 1 END;
        floor_name := CASE WHEN f = 'floor_0' THEN 'Zemin Kat - Tekstil' ELSE '1. Kat - Ayakkabı' END;
        
        -- Only shelf 6, only column F
        FOR cell_num IN 1..3 LOOP
            loc_id := 'F' || floor_num || '-R6-F-' || cell_num;
            
            INSERT INTO locations (floor, shelf, column_label, cell, location_id, description)
            VALUES (f, 6, 'F'::column_label, cell_num, loc_id, floor_name || ' / Raf 6 / Kolon F / Hücre ' || cell_num)
            ON CONFLICT (floor, shelf, column_label, cell) DO NOTHING;
        END LOOP;
    END LOOP;
END $$;

-- Verify the new locations
-- SELECT * FROM locations WHERE column_label = 'F' ORDER BY floor, cell;
