-- ============================================================
-- Migration Part 1: Add 'F' to column_label enum
-- ============================================================
-- Run this FIRST, then run 006_create_column_f_locations.sql
-- ============================================================

ALTER TYPE column_label ADD VALUE IF NOT EXISTS 'F';
