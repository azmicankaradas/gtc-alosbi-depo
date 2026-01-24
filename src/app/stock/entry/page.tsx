'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
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
    Plus,
    Search,
    Check
} from 'lucide-react'
import { toast } from 'sonner'
import type { Product, Variant, Location, ProductGroup } from '@/types/database'
import { FLOOR_NAMES } from '@/types/database'

export default function StockEntryPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [variants, setVariants] = useState<Variant[]>([])
    const [locations, setLocations] = useState<Location[]>([])
    const [filteredLocations, setFilteredLocations] = useState<Location[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form state
    const [selectedProductGroup, setSelectedProductGroup] = useState<ProductGroup | ''>('')
    const [selectedProduct, setSelectedProduct] = useState('')
    const [selectedVariant, setSelectedVariant] = useState('')
    const [selectedLocation, setSelectedLocation] = useState('')
    const [quantity, setQuantity] = useState('')

    const router = useRouter()
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

    // Filter products by group
    const filteredProducts = products.filter(p =>
        !selectedProductGroup || p.product_group === selectedProductGroup
    )

    // Fetch variants when product changes
    useEffect(() => {
        const fetchVariants = async () => {
            if (!selectedProduct) {
                setVariants([])
                return
            }

            const { data } = await supabase
                .from('variants')
                .select('*')
                .eq('product_id', selectedProduct)
                .eq('is_active', true)
                .order('size')

            setVariants(data || [])
        }

        fetchVariants()
        setSelectedVariant('')
    }, [selectedProduct, supabase])

    // Filter locations based on product group (Floor restriction)
    useEffect(() => {
        if (!selectedProductGroup) {
            setFilteredLocations(locations)
            return
        }

        const targetFloor = selectedProductGroup === 'textile' ? 'floor_0' : 'floor_1'
        setFilteredLocations(locations.filter(l => l.floor === targetFloor))
        setSelectedLocation('')
    }, [selectedProductGroup, locations])

    // Handle product group change
    const handleProductGroupChange = (value: string) => {
        setSelectedProductGroup(value as ProductGroup)
        setSelectedProduct('')
        setSelectedVariant('')
        setSelectedLocation('')
    }

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!selectedVariant || !selectedLocation || !quantity) {
            toast.error('Lütfen tüm alanları doldurun')
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
                .eq('variant_id', selectedVariant)
                .eq('location_id', selectedLocation)
                .single()

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
                        variant_id: selectedVariant,
                        location_id: selectedLocation,
                        quantity: qty
                    })

                if (error) throw error

                toast.success('Stok Eklendi', {
                    description: `${qty} adet başarıyla kaydedildi`
                })
            }

            // Reset form
            setSelectedVariant('')
            setSelectedLocation('')
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

    const selectedProductData = products.find(p => p.id === selectedProduct)
    const selectedVariantData = variants.find(v => v.id === selectedVariant)
    const selectedLocationData = locations.find(l => l.id === selectedLocation)

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
                                    <div className="text-2xl mb-2">👔</div>
                                    <p className="font-semibold text-white">Tekstil</p>
                                    <p className="text-xs text-slate-400">Zemin Kat</p>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleProductGroupChange('shoes')}
                                    className={`p-4 rounded-xl border-2 transition-all ${selectedProductGroup === 'shoes'
                                        ? 'border-blue-500 bg-blue-500/10'
                                        : 'border-slate-600 hover:border-slate-500'
                                        }`}
                                >
                                    <div className="text-2xl mb-2">👞</div>
                                    <p className="font-semibold text-white">Ayakkabı</p>
                                    <p className="text-xs text-slate-400">1. Kat</p>
                                </button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Product & Variant Selection */}
                    {selectedProductGroup && (
                        <Card className="bg-slate-800/50 border-slate-700/50">
                            <CardHeader>
                                <CardTitle className="text-white">Ürün Detayları</CardTitle>
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
                                        <Label className="text-slate-300">Varyant (Beden/Renk)</Label>
                                        <Select value={selectedVariant} onValueChange={setSelectedVariant}>
                                            <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                                                <SelectValue placeholder="Varyant seçin..." />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-800 border-slate-700 max-h-60">
                                                {variants.map(variant => (
                                                    <SelectItem key={variant.id} value={variant.id} className="text-white hover:bg-slate-700">
                                                        {variant.size}
                                                        {variant.color && ` - ${variant.color === 'yesil' ? 'Yeşil' : 'Turuncu'}`}
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

                    {/* Location Selection */}
                    {selectedVariant && (
                        <Card className="bg-slate-800/50 border-slate-700/50">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-blue-400" />
                                    Konum
                                </CardTitle>
                                <CardDescription className="text-slate-400">
                                    {selectedProductGroup === 'textile' ? 'Zemin Kat' : '1. Kat'} konumları
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Raf Konumu</Label>
                                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                                            <SelectValue placeholder="Konum seçin..." />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-800 border-slate-700 max-h-60">
                                            {filteredLocations.map(location => (
                                                <SelectItem key={location.id} value={location.id} className="text-white hover:bg-slate-700">
                                                    {location.location_id} - Raf {location.shelf} / {location.column_label}{location.cell}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-slate-300">Miktar</Label>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        placeholder="Adet giriniz..."
                                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Summary & Submit */}
                    {selectedVariant && selectedLocation && quantity && (
                        <Card className="bg-emerald-500/10 border-emerald-500/30">
                            <CardContent className="pt-6">
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Ürün:</span>
                                        <span className="text-white font-medium">{selectedProductData?.name}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Varyant:</span>
                                        <span className="text-white font-medium">{selectedVariantData?.sku}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Konum:</span>
                                        <span className="text-white font-medium">{selectedLocationData?.location_id}</span>
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
