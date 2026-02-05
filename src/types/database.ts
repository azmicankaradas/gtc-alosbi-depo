// Database Types for GTC Endüstriyel Warehouse System

export type FloorType = 'floor_0' | 'floor_1'
export type ProductGroup = 'textile' | 'shoes'
export type TextileCategory = 'tulum' | 'kaban' | 'gomlek' | 'pantolon'
export type FabricType = 'nomex' | 'gtc'
export type ColorType = 'yesil' | 'turuncu'
export type ColumnLabel = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
export type MovementType = 'in' | 'out' | 'transfer' | 'adjustment'

// Location Interface
export interface Location {
    id: string
    floor: FloorType
    shelf: number
    column_label: ColumnLabel
    cell: number
    location_id: string
    description: string | null
    created_at: string
    updated_at: string
}

// Product Interface
export interface Product {
    id: string
    name: string
    product_group: ProductGroup
    category: TextileCategory | null
    fabric: FabricType | null
    brand: string | null
    model: string | null
    description: string | null
    is_active: boolean
    created_at: string
    updated_at: string
}

// Variant Interface
export interface Variant {
    id: string
    product_id: string
    sku: string
    size: string
    color: ColorType | null
    is_active: boolean
    created_at: string
    updated_at: string
}

// Stock Interface
export interface Stock {
    id: string
    variant_id: string
    location_id: string
    quantity: number
    min_quantity: number
    created_at: string
    updated_at: string
}

// Stock Movement Interface
export interface StockMovement {
    id: string
    stock_id: string | null
    variant_id: string
    location_id: string
    movement_type: MovementType
    quantity: number
    previous_quantity: number
    new_quantity: number
    notes: string | null
    user_id: string | null
    requester_name: string | null
    document_code: string | null
    created_at: string
}

// Extended types with relations
export interface VariantWithProduct extends Variant {
    product: Product
}

export interface StockWithDetails extends Stock {
    variant: VariantWithProduct
    location: Location
}

// View types
export interface StockFullView {
    stock_id: string
    quantity: number
    min_quantity: number
    low_stock: boolean
    variant_id: string
    sku: string
    size: string
    color: ColorType | null
    product_id: string
    product_name: string
    product_group: ProductGroup
    category: TextileCategory | null
    fabric: FabricType | null
    brand: string | null
    model: string | null
    location_id: string
    location_code: string
    floor: FloorType
    shelf: number
    column_label: ColumnLabel
    cell: number
    location_description: string
}

export interface StockSummary {
    product_id: string
    name: string
    product_group: ProductGroup
    brand: string | null
    category: TextileCategory | null
    variant_count: number
    total_quantity: number
    location_count: number
}

// Helper types
export type FloorName = {
    [key in FloorType]: string
}

export const FLOOR_NAMES: FloorName = {
    floor_0: 'Zemin Kat (Tekstil)',
    floor_1: '1. Kat (Ayakkabı)'
}

export const TEXTILE_CATEGORY_NAMES: Record<TextileCategory, string> = {
    tulum: 'Tulum',
    kaban: 'Kaban',
    gomlek: 'Gömlek',
    pantolon: 'Pantolon'
}

export const FABRIC_NAMES: Record<FabricType, string> = {
    nomex: 'Nomex',
    gtc: 'GTC'
}

export const COLOR_NAMES: Record<ColorType, string> = {
    yesil: 'Yeşil',
    turuncu: 'Turuncu'
}

export const TEXTILE_SIZES = ['2XS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']
export const SHOE_SIZES = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47']

// Requester options for Stock Out
export const REQUESTER_OPTIONS = [
    'Bahar Pekderin',
    'Esra Şahin',
    'Gülcan Ağırman',
    'Osman Çobalak'
] as const

