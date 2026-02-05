'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
    ArrowLeft,
    Package,
    MapPin,
    Loader2,
    Check,
    Shirt,
    Footprints
} from 'lucide-react'
import { toast } from 'sonner'
import type { Product, Variant, Location, ProductGroup, TextileCategory, FabricType, ColorType } from '@/types/database'
import { TEXTILE_CATEGORY_NAMES, FABRIC_NAMES, COLOR_NAMES, TEXTILE_SIZES } from '@/types/database'

export default function StockEntryPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [variants, setVariants] = useState<Variant[]>([])
    const [locations, setLocations] = useState<Location[]>([])
    const [filteredLocations, setFilteredLocations] = useState<Location[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form state
    const [selectedProductGroup, setSelectedProductGroup] = useState<ProductGroup | ''>('')

    // Textile specific filters
    const [selectedFabric, setSelectedFabric] = useState<FabricType | ''>('')
    const [selectedCategory, setSelectedCategory] = useState<TextileCategory | ''>('')
    const [selectedColor, setSelectedColor] = useState<ColorType | ''>('')
    const [selectedSize, setSelectedSize] = useState('')

    // Shoes specific
    const [selectedProduct, setSelectedProduct] = useState('')
    const [selectedVariant, setSelectedVariant] = useState('')

    // Common - Kademeli konum seçimi
    const [selectedShelf, setSelectedShelf] = useState<number | ''>('')
    const [selectedColumn, setSelectedColumn] = useState('')
    const [selectedCell, setSelectedCell] = useState<number | ''>('')
    const [quantity, setQuantity] = useState('')

    const supabase = createClient()

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, locationsRes] = await Promise.all([
                    supabase.from('products').select('*').eq('is_active', true).order('name'),
                    supabase.from('locations').select('*').order('floor').order('shelf').order('column_label').order('cell')
                ])

                setProducts(productsRes.data || [])
                setLocations(locationsRes.data || [])
            } catch (error) {
                toast.error('Veri yüklenirken hata oluştu')
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [supabase])

    // Filter products by group for shoes
    const filteredProducts = products.filter(p =>
        p.product_group === 'shoes'
    )

    // Find matching textile product based on filters (products have color in name)
    const getColorNameForSearch = (color: ColorType | ''): string => {
        if (color === 'yesil') return 'yeşil'
        if (color === 'turuncu') return 'turuncu'
        return ''
    }

    const matchingTextileProduct = products.find(p =>
        p.product_group === 'textile' &&
        p.fabric === selectedFabric &&
        p.category === selectedCategory &&
        (selectedColor ? p.name.toLowerCase().includes(getColorNameForSearch(selectedColor)) : true)
    )

    // Fetch variants when product changes (for shoes) or when textile filters are complete
    useEffect(() => {
        const fetchVariants = async () => {
            let productId = ''

            if (selectedProductGroup === 'shoes' && selectedProduct) {
                productId = selectedProduct
            } else if (selectedProductGroup === 'textile' && matchingTextileProduct) {
                productId = matchingTextileProduct.id
                console.log('Fetching variants for textile product:', matchingTextileProduct.name, matchingTextileProduct.id)
            }

            if (!productId) {
                console.log('No product ID, clearing variants')
                setVariants([])
                return
            }

            const { data, error } = await supabase
                .from('variants')
                .select('*')
                .eq('product_id', productId)
                .eq('is_active', true)
                .order('size')

            console.log('Variants fetched:', data?.length || 0, error?.message || 'no error')
            setVariants(data || [])
        }

        fetchVariants()
        setSelectedVariant('')
    }, [selectedProduct, matchingTextileProduct?.id, selectedProductGroup, supabase])

    // Filter locations based on product group (Floor restriction)
    useEffect(() => {
        if (!selectedProductGroup) {
            setFilteredLocations(locations)
            return
        }

        const targetFloor = selectedProductGroup === 'textile' ? 'floor_0' : 'floor_1'
        setFilteredLocations(locations.filter(l => l.floor === targetFloor))
        setSelectedShelf('')
        setSelectedColumn('')
        setSelectedCell('')
    }, [selectedProductGroup, locations])

    // Get unique shelves from filtered locations
    const availableShelves = [...new Set(filteredLocations.map(l => l.shelf))].sort((a, b) => a - b)

    // Get columns for selected shelf (F only for shelf 6)
    const getColumnsForShelf = (shelf: number): string[] => {
        if (shelf === 6) {
            return ['A', 'B', 'C', 'D', 'E', 'F']
        }
        return ['A', 'B', 'C', 'D', 'E']
    }

    // Get available columns based on selected shelf
    const availableColumns = selectedShelf ? getColumnsForShelf(selectedShelf) : []

    // Get available cells (always 1, 2, 3)
    const availableCells = [1, 2, 3]

    // Find the actual location based on selections
    const selectedLocation = filteredLocations.find(
        l => l.shelf === selectedShelf && l.column_label === selectedColumn && l.cell === selectedCell
    )

    // Handle product group change
    const handleProductGroupChange = (value: ProductGroup) => {
        setSelectedProductGroup(value)
        // Reset all selections
        setSelectedFabric('')
        setSelectedCategory('')
        setSelectedColor('')
        setSelectedSize('')
        setSelectedProduct('')
        setSelectedVariant('')
        setSelectedShelf('')
        setSelectedColumn('')
        setSelectedCell('')
        setQuantity('')
    }

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        let variantId = ''

        if (selectedProductGroup === 'shoes') {
            variantId = selectedVariant
        } else if (selectedProductGroup === 'textile') {
            console.log('Textile matching:', {
                variants: variants.length,
                selectedSize,
                selectedColor,
                matchingTextileProduct: matchingTextileProduct?.name
            })

            // Find variant matching size and color, or just size if color doesn't match
            let matchingVariant = variants.find(v =>
                v.size === selectedSize && v.color === selectedColor
            )
            // Fallback: try matching by size only if no color match
            if (!matchingVariant) {
                matchingVariant = variants.find(v => v.size === selectedSize)
            }
            if (matchingVariant) {
                variantId = matchingVariant.id
            }
        }

        // Better validation with specific error messages
        if (!variantId) {
            console.log('Variant not found:', { variantsCount: variants.length, selectedSize })
            toast.error('Ürün varyantı bulunamadı', {
                description: variants.length === 0
                    ? 'Bu ürün için varyant tanımlı değil'
                    : `${selectedSize} bedeni için varyant bulunamadı`
            })
            return
        }

        if (!selectedLocation?.id) {
            toast.error('Konum seçilmedi', {
                description: 'Lütfen raf, bölüm ve hücre seçin'
            })
            return
        }

        if (!quantity) {
            toast.error('Miktar girilmedi', {
                description: 'Lütfen adet giriniz'
            })
            return
        }

        const qty = parseInt(quantity)
        if (isNaN(qty) || qty <= 0) {
            toast.error('Geçerli bir miktar girin')
            return
        }

        setIsSubmitting(true)

        try {
            // Check if stock entry already exists
            const { data: existingStock } = await supabase
                .from('stock')
                .select('id, quantity')
                .eq('variant_id', variantId)
                .eq('location_id', selectedLocation.id)
                .maybeSingle()

            if (existingStock) {
                // Update existing stock
                const { error } = await supabase
                    .from('stock')
                    .update({ quantity: existingStock.quantity + qty })
                    .eq('id', existingStock.id)

                if (error) throw error

                toast.success('Stok Güncellendi', {
                    description: `${qty} adet eklendi. Yeni miktar: ${existingStock.quantity + qty}`
                })
            } else {
                // Create new stock entry
                const { error } = await supabase
                    .from('stock')
                    .insert({
                        variant_id: variantId,
                        location_id: selectedLocation.id,
                        quantity: qty
                    })

                if (error) throw error

                toast.success('Stok Eklendi', {
                    description: `${qty} adet başarıyla kaydedildi`
                })
            }

            setSelectedVariant('')
            setSelectedSize('')
            setSelectedShelf('')
            setSelectedColumn('')
            setSelectedCell('')
            setQuantity('')

        } catch (error: any) {
            console.error('Stock entry error:', error)
            toast.error('Hata', {
                description: error.message || 'Stok eklenirken bir hata oluştu'
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    // Get display location name (K0, K1 instead of F0, F1)
    const getLocationDisplay = (location: Location) => {
        const floorName = location.floor === 'floor_0' ? 'K0' : 'K1'
        return `${floorName}-R${location.shelf}-${location.column_label}-${location.cell}`
    }

    // Check if textile form is complete
    const isTextileFormComplete = selectedFabric && selectedCategory && selectedColor && selectedSize && selectedLocation && quantity

    // Check if shoes form is complete
    const isShoesFormComplete = selectedProduct && selectedVariant && selectedLocation && quantity

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-xl">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-lg font-bold text-white">Stok Girişi</h1>
                            <p className="text-xs text-slate-400">Depoya yeni ürün ekle</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6 max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Product Group Selection */}
                    <Card className="bg-slate-800/50 border-slate-700/50">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Package className="w-5 h-5 text-emerald-400" />
                                Ürün Türü
                            </CardTitle>
                            <CardDescription className="text-slate-400">
                                Önce ürün grubunu seçin (kat otomatik belirlenecek)
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => handleProductGroupChange('textile')}
                                    className={`p-4 rounded-xl border-2 transition-all ${selectedProductGroup === 'textile'
                                        ? 'border-emerald-500 bg-emerald-500/10'
                                        : 'border-slate-600 hover:border-slate-500'
                                        }`}
                                >
                                    <Shirt className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                                    <p className="font-semibold text-white">Tekstil</p>
                                    <p className="text-xs text-slate-400">Zemin Kat (K0)</p>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleProductGroupChange('shoes')}
                                    className={`p-4 rounded-xl border-2 transition-all ${selectedProductGroup === 'shoes'
                                        ? 'border-blue-500 bg-blue-500/10'
                                        : 'border-slate-600 hover:border-slate-500'
                                        }`}
                                >
                                    <Footprints className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                                    <p className="font-semibold text-white">Ayakkabı</p>
                                    <p className="text-xs text-slate-400">1. Kat (K1)</p>
                                </button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* TEXTILE: Step-by-step selection */}
                    {selectedProductGroup === 'textile' && (
                        <Card className="bg-slate-800/50 border-slate-700/50">
                            <CardHeader>
                                <CardTitle className="text-white">Tekstil Detayları</CardTitle>
                                <CardDescription className="text-slate-400">
                                    Kumaş tipi, ürün kategorisi, renk ve beden seçin
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Step 1: Fabric Type */}
                                <div className="space-y-2">
                                    <Label className="text-slate-300">1. Kumaş Tipi</Label>
                                    <Select value={selectedFabric} onValueChange={(v) => {
                                        setSelectedFabric(v as FabricType)
                                        setSelectedCategory('')
                                        setSelectedColor('')
                                        setSelectedSize('')
                                    }}>
                                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                                            <SelectValue placeholder="Kumaş tipi seçin..." />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-800 border-slate-700">
                                            {Object.entries(FABRIC_NAMES).map(([key, name]) => (
                                                <SelectItem key={key} value={key} className="text-white hover:bg-slate-700">
                                                    {name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Step 2: Category */}
                                {selectedFabric && (
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">2. Ürün Kategorisi</Label>
                                        <Select value={selectedCategory} onValueChange={(v) => {
                                            setSelectedCategory(v as TextileCategory)
                                            setSelectedColor('')
                                            setSelectedSize('')
                                        }}>
                                            <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                                                <SelectValue placeholder="Kategori seçin..." />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-800 border-slate-700">
                                                {Object.entries(TEXTILE_CATEGORY_NAMES).map(([key, name]) => (
                                                    <SelectItem key={key} value={key} className="text-white hover:bg-slate-700">
                                                        {name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                {/* Step 3: Color */}
                                {selectedCategory && (
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">3. Renk</Label>
                                        <Select value={selectedColor} onValueChange={(v) => {
                                            setSelectedColor(v as ColorType)
                                            setSelectedSize('')
                                        }}>
                                            <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                                                <SelectValue placeholder="Renk seçin..." />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-800 border-slate-700">
                                                {Object.entries(COLOR_NAMES).map(([key, name]) => (
                                                    <SelectItem key={key} value={key} className="text-white hover:bg-slate-700">
                                                        <span className="flex items-center gap-2">
                                                            <span className={`w-3 h-3 rounded-full ${key === 'yesil' ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                                                            {name}
                                                        </span>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                {/* Step 4: Size */}
                                {selectedColor && (
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">4. Beden</Label>
                                        <Select value={selectedSize} onValueChange={setSelectedSize}>
                                            <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                                                <SelectValue placeholder="Beden seçin..." />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-800 border-slate-700">
                                                {TEXTILE_SIZES.map((size) => (
                                                    <SelectItem key={size} value={size} className="text-white hover:bg-slate-700">
                                                        {size}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                {/* Show matched product info */}
                                {matchingTextileProduct && selectedSize && (
                                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                                        <p className="text-sm text-emerald-400 font-medium">Seçilen Ürün:</p>
                                        <p className="text-white">{matchingTextileProduct.name} - {selectedSize}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* SHOES: Product & Variant Selection */}
                    {selectedProductGroup === 'shoes' && (
                        <Card className="bg-slate-800/50 border-slate-700/50">
                            <CardHeader>
                                <CardTitle className="text-white">Ayakkabı Detayları</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Ürün</Label>
                                    <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                                            <SelectValue placeholder="Ürün seçin..." />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-800 border-slate-700">
                                            {filteredProducts.map(product => (
                                                <SelectItem key={product.id} value={product.id} className="text-white hover:bg-slate-700">
                                                    {product.name}
                                                    {product.brand && ` (${product.brand})`}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {selectedProduct && (
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">Numara</Label>
                                        <Select value={selectedVariant} onValueChange={setSelectedVariant}>
                                            <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                                                <SelectValue placeholder="Numara seçin..." />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-800 border-slate-700 max-h-60">
                                                {variants.map(variant => (
                                                    <SelectItem key={variant.id} value={variant.id} className="text-white hover:bg-slate-700">
                                                        {variant.size}
                                                        <span className="text-slate-400 ml-2 text-xs">({variant.sku})</span>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Location Selection - Show when product is selected */}
                    {((selectedProductGroup === 'textile' && selectedSize) || (selectedProductGroup === 'shoes' && selectedVariant)) && (
                        <Card className="bg-slate-800/50 border-slate-700/50">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-blue-400" />
                                    Konum Seçimi
                                </CardTitle>
                                <CardDescription className="text-slate-400">
                                    {selectedProductGroup === 'textile' ? 'Zemin Kat (K0)' : '1. Kat (K1)'} - Raf, bölüm ve hücre seçin
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Raf Seçimi */}
                                <div className="space-y-2">
                                    <Label className="text-slate-300">1. Raf</Label>
                                    <Select
                                        value={selectedShelf ? selectedShelf.toString() : ''}
                                        onValueChange={(v) => {
                                            setSelectedShelf(parseInt(v))
                                            setSelectedColumn('')
                                            setSelectedCell('')
                                        }}
                                    >
                                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                                            <SelectValue placeholder="Raf seçin..." />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-800 border-slate-700">
                                            {availableShelves.map(shelf => (
                                                <SelectItem key={shelf} value={shelf.toString()} className="text-white hover:bg-slate-700">
                                                    Raf {shelf}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Bölüm Seçimi */}
                                {selectedShelf && (
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">2. Bölüm (Kolon)</Label>
                                        <Select
                                            value={selectedColumn}
                                            onValueChange={(v) => {
                                                setSelectedColumn(v)
                                                setSelectedCell('')
                                            }}
                                        >
                                            <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                                                <SelectValue placeholder="Bölüm seçin..." />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-800 border-slate-700">
                                                {availableColumns.map(col => (
                                                    <SelectItem key={col} value={col} className="text-white hover:bg-slate-700">
                                                        {col} Bölümü
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                {/* Hücre Seçimi */}
                                {selectedColumn && (
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">3. Hücre</Label>
                                        <Select
                                            value={selectedCell ? selectedCell.toString() : ''}
                                            onValueChange={(v) => setSelectedCell(parseInt(v))}
                                        >
                                            <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                                                <SelectValue placeholder="Hücre seçin..." />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-800 border-slate-700">
                                                {availableCells.map(cell => (
                                                    <SelectItem key={cell} value={cell.toString()} className="text-white hover:bg-slate-700">
                                                        Hücre {cell}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                {/* Seçilen Konum Özeti */}
                                {selectedLocation && (
                                    <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                        <p className="text-sm text-blue-400 font-medium">Seçilen Konum:</p>
                                        <p className="text-white">{getLocationDisplay(selectedLocation)}</p>
                                    </div>
                                )}

                                {/* Miktar */}
                                {selectedLocation && (
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">4. Miktar</Label>
                                        <Input
                                            type="number"
                                            min="1"
                                            value={quantity}
                                            onChange={(e) => setQuantity(e.target.value)}
                                            onWheel={(e) => e.currentTarget.blur()}
                                            placeholder="Adet giriniz..."
                                            className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Summary & Submit */}
                    {((selectedProductGroup === 'textile' && isTextileFormComplete) || (selectedProductGroup === 'shoes' && isShoesFormComplete)) && (
                        <Card className="bg-emerald-500/10 border-emerald-500/30">
                            <CardContent className="pt-6">
                                <div className="space-y-2 mb-4">
                                    {selectedProductGroup === 'textile' && (
                                        <>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-400">Kumaş:</span>
                                                <span className="text-white font-medium">{FABRIC_NAMES[selectedFabric as FabricType]}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-400">Ürün:</span>
                                                <span className="text-white font-medium">{TEXTILE_CATEGORY_NAMES[selectedCategory as TextileCategory]}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-400">Renk:</span>
                                                <span className="text-white font-medium">{COLOR_NAMES[selectedColor as ColorType]}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-400">Beden:</span>
                                                <span className="text-white font-medium">{selectedSize}</span>
                                            </div>
                                        </>
                                    )}
                                    {selectedProductGroup === 'shoes' && (
                                        <>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-400">Ürün:</span>
                                                <span className="text-white font-medium">
                                                    {products.find(p => p.id === selectedProduct)?.name}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-400">Numara:</span>
                                                <span className="text-white font-medium">
                                                    {variants.find(v => v.id === selectedVariant)?.size}
                                                </span>
                                            </div>
                                        </>
                                    )}
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Konum:</span>
                                        <span className="text-white font-medium">
                                            {selectedLocation ? getLocationDisplay(selectedLocation) : ''}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Miktar:</span>
                                        <Badge className="bg-emerald-500/20 text-emerald-400">{quantity} adet</Badge>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/25"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Kaydediliyor...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="mr-2 h-4 w-4" />
                                            Stok Girişi Yap
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </form>
            </main>
        </div>
    )
}
