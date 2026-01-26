-- ============================================================
-- Migration: Add Requester Tracking to Stock Movements
-- ============================================================
-- This migration adds columns to track WHO requested stock items
-- and assigns unique document codes for PDF receipts
-- ============================================================

-- Add requester_name column (who requested the item)
ALTER TABLE stock_movements ADD COLUMN IF NOT EXISTS requester_name TEXT;

-- Add document_code column (unique ID for PDF receipts)
ALTER TABLE stock_movements ADD COLUMN IF NOT EXISTS document_code TEXT;

-- Create index for faster document code lookups
CREATE INDEX IF NOT EXISTS idx_movements_document_code ON stock_movements(document_code);

-- Create index for faster requester lookups
CREATE INDEX IF NOT EXISTS idx_movements_requester ON stock_movements(requester_name);

-- ============================================================
-- Migration Complete!
-- ============================================================
