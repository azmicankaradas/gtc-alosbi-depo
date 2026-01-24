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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    ArrowLeft,
    Package,
    Loader2,
    Plus,
    Shirt,
    Footprints,
    Check
} from 'lucide-react'
import { toast } from 'sonner'
import type { Product, ProductGroup, TextileCategory, FabricType, ColorType } from '@/types/database'
import {
    TEXTILE_CATEGORY_NAMES,
    FABRIC_NAMES,
    COLOR_NAMES,
    TEXTILE_SIZES,
    SHOE_SIZES
} from '@/types/database'

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [activeTab, setActiveTab] = useState<'list' | 'add'>('list')

    // Form state for new product
    const [productGroup, setProductGroup] = useState<ProductGroup | ''>('')

    // Textile fields
    const [category, setCategory] = useState<TextileCategory | ''>('')
    const [fabric, setFabric] = useState<FabricType | ''>('')
    const [selectedColors, setSelectedColors] = useState<ColorType[]>([])
    const [selectedTextileSizes, setSelectedTextileSizes] = useState<string[]>([])

    // Shoes fields
    const [brand, setBrand] = useState('')
    const [model, setModel] = useState('')
    const [selectedShoeSizes, setSelectedShoeSizes] = useState<string[]>([])

    const supabase = createClient()

    // Fetch products
    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const { data } = await supabase
                .from('products')
                .select('*')
                .eq('is_active', true)
                .order('product_group')
                .order('name')

            setProducts(data || [])
        } catch (error) {
            toast.error('Ürünler yüklenirken hata oluştu')
        } finally {
            setIsLoading(false)
        }
    }

    // Toggle color selection
    const toggleColor = (color: ColorType) => {
        setSelectedColors(prev =>
            prev.includes(color)
                ? prev.filter(c => c !== color)
                : [...prev, color]
        )
    }

    // Toggle size selection
    const toggleTextileSize = (size: string) => {
        setSelectedTextileSizes(prev =>
            prev.includes(size)
                ? prev.filter(s => s !== size)
                : [...prev, size]
        )
    }

    const toggleShoeSize = (size: string) => {
        setSelectedShoeSizes(prev =>
            prev.includes(size)
                ? prev.filter(s => s !== size)
                : [...prev, size]
        )
    }

    // Select all sizes
    const selectAllTextileSizes = () => setSelectedTextileSizes([...TEXTILE_SIZES])
    const selectAllShoeSizes = () => setSelectedShoeSizes([...SHOE_SIZES])
    const clearTextileSizes = () => setSelectedTextileSizes([])
    const clearShoeSizes = () => setSelectedShoeSizes([])

    // Generate product name
    const generateProductName = () => {
        if (productGroup === 'textile' && category && fabric) {
            return `${FABRIC_NAMES[fabric]} ${TEXTILE_CATEGORY_NAMES[category]}`
        }
        if (productGroup === 'shoes' && brand && model) {
            return `${brand} ${model}`
        }
        return ''
    }

    // Reset form
    const resetForm = () => {
        setProductGroup('')
        setCategory('')
        setFabric('')
        setSelectedColors([])
        setSelectedTextileSizes([])
        setBrand('')
        setModel('')
        setSelectedShoeSizes([])
    }

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validation
        if (productGroup === 'textile') {
            if (!category || !fabric || selectedColors.length === 0 || selectedTextileSizes.length === 0) {
                toast.error('Lütfen tüm alanları doldurun')
                return
            }
        } else if (productGroup === 'shoes') {
            if (!brand || !model || selectedShoeSizes.length === 0) {
                toast.error('Lütfen tüm alanları doldurun')
                return
            }
        } else {
            toast.error('Ürün grubu seçin')
            return
        }

        setIsSubmitting(true)

        try {
            if (productGroup === 'textile') {
                // Create product for each color (since color affects the product identity)
                for (const color of selectedColors) {
                    const productName = `${FABRIC_NAMES[fabric as FabricType]} ${TEXTILE_CATEGORY_NAMES[category as TextileCategory]} ${COLOR_NAMES[color]}`

                    // Check if product already exists
                    const { data: existing } = await supabase
                        .from('products')
                        .select('id')
                        .eq('name', productName)
                        .single()

                    let productId: string

                    if (existing) {
                        productId = existing.id
                    } else {
                        // Create new product
                        const { data: newProduct, error: prodError } = await supabase
                            .from('products')
                            .insert({
                                name: productName,
                                product_group: 'textile',
                                category: category,
                                fabric: fabric,
                                description: `${FABRIC_NAMES[fabric as FabricType]} kumaş ${TEXTILE_CATEGORY_NAMES[category as TextileCategory].toLowerCase()} - ${COLOR_NAMES[color]} renk`
                            })
                            .select('id')
                            .single()

                        if (prodError) throw prodError
                        productId = newProduct.id
                    }

                    // Create variants for each size
                    for (const size of selectedTextileSizes) {
                        const sku = `${fabric.toUpperCase()}-${category.toUpperCase().substring(0, 3)}-${color.toUpperCase().substring(0, 3)}-${size}`

                        // Check if variant exists
                        const { data: existingVariant } = await supabase
                            .from('variants')
                            .select('id')
                            .eq('sku', sku)
                            .single()

                        if (!existingVariant) {
                            await supabase
                                .from('variants')
                                .insert({
                                    product_id: productId,
                                    sku: sku,
                                    size: size,
                                    color: color
                                })
                        }
                    }
                }

                toast.success('Tekstil ürünleri oluşturuldu', {
                    description: `${selectedColors.length} renk × ${selectedTextileSizes.length} beden = ${selectedColors.length * selectedTextileSizes.length} varyant`
                })

            } else if (productGroup === 'shoes') {
                const productName = `${brand} ${model}`

                // Check if product already exists
                const { data: existing } = await supabase
                    .from('products')
                    .select('id')
                    .eq('name', productName)
                    .single()

                let productId: string

                if (existing) {
                    productId = existing.id
                } else {
                    // Create new product
                    const { data: newProduct, error: prodError } = await supabase
                        .from('products')
                        .insert({
                            name: productName,
                            product_group: 'shoes',
                            brand: brand,
                            model: model,
                            description: `${brand} marka güvenlik ayakkabısı - ${model} model`
                        })
                        .select('id')
                        .single()

                    if (prodError) throw prodError
                    productId = newProduct.id
                }

                // Create variants for each size
                for (const size of selectedShoeSizes) {
                    const sku = `${brand.toUpperCase().replace(/\s/g, '')}-${model.toUpperCase().replace(/\s/g, '')}-${size}`

                    // Check if variant exists
                    const { data: existingVariant } = await supabase
                        .from('variants')
                        .select('id')
                        .eq('sku', sku)
                        .single()

                    if (!existingVariant) {
                        await supabase
                            .from('variants')
                            .insert({
                                product_id: productId,
                                sku: sku,
                                size: size
                            })
                    }
                }

                toast.success('Ayakkabı ürünleri oluşturuldu', {
                    description: `${selectedShoeSizes.length} beden varyantı`
                })
            }

            // Reset form and refresh list
            resetForm()
            fetchProducts()
            setActiveTab('list')

        } catch (error: any) {
            console.error('Product creation error:', error)
            toast.error('Hata', { description: error.message })
        } finally {
            setIsSubmitting(false)
        }
    }

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
                            <h1 className="text-lg font-bold text-white">Ürün Yönetimi</h1>
                            <p className="text-xs text-slate-400">Ürün ve varyant ekle/düzenle</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6 max-w-3xl">
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'list' | 'add')}>
                    <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 mb-6">
                        <TabsTrigger value="list" className="data-[state=active]:bg-emerald-500">
                            Ürün Listesi
                        </TabsTrigger>
                        <TabsTrigger value="add" className="data-[state=active]:bg-emerald-500">
                            <Plus className="w-4 h-4 mr-1" />
                            Yeni Ürün
                        </TabsTrigger>
                    </TabsList>

                    {/* Product List */}
                    <TabsContent value="list" className="space-y-4">
                        {/* Textile Products */}
                        <Card className="bg-emerald-500/5 border-emerald-500/20">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Shirt className="w-5 h-5 text-emerald-400" />
                                    Tekstil Ürünleri
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {products.filter(p => p.product_group === 'textile').length === 0 ? (
                                    <p className="text-slate-500 text-sm">Henüz tekstil ürünü yok</p>
                                ) : (
                                    products.filter(p => p.product_group === 'textile').map(product => (
                                        <div key={product.id} className="p-3 bg-slate-800/50 rounded-lg flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-white">{product.name}</p>
                                                <p className="text-xs text-slate-400">
                                                    {product.category && TEXTILE_CATEGORY_NAMES[product.category]} • {product.fabric && FABRIC_NAMES[product.fabric]}
                                                </p>
                                            </div>
                                            <Badge className="bg-emerald-500/20 text-emerald-400">Tekstil</Badge>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>

                        {/* Shoe Products */}
                        <Card className="bg-blue-500/5 border-blue-500/20">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Footprints className="w-5 h-5 text-blue-400" />
                                    Ayakkabı Ürünleri
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {products.filter(p => p.product_group === 'shoes').length === 0 ? (
                                    <p className="text-slate-500 text-sm">Henüz ayakkabı ürünü yok</p>
                                ) : (
                                    products.filter(p => p.product_group === 'shoes').map(product => (
                                        <div key={product.id} className="p-3 bg-slate-800/50 rounded-lg flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-white">{product.name}</p>
                                                <p className="text-xs text-slate-400">{product.brand} • {product.model}</p>
                                            </div>
                                            <Badge className="bg-blue-500/20 text-blue-400">Ayakkabı</Badge>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Add Product Form */}
                    <TabsContent value="add">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Product Group Selection */}
                            <Card className="bg-slate-800/50 border-slate-700/50">
                                <CardHeader>
                                    <CardTitle className="text-white">Ürün Türü</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => { setProductGroup('textile'); resetForm(); setProductGroup('textile'); }}
                                            className={`p-4 rounded-xl border-2 transition-all ${productGroup === 'textile'
                                                ? 'border-emerald-500 bg-emerald-500/10'
                                                : 'border-slate-600 hover:border-slate-500'
                                                }`}
                                        >
                                            <Shirt className={`w-8 h-8 mx-auto mb-2 ${productGroup === 'textile' ? 'text-emerald-400' : 'text-slate-400'}`} />
                                            <p className="font-semibold text-white">Tekstil</p>
                                            <p className="text-xs text-slate-400">Tulum, Kaban, Gömlek, Pantolon</p>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => { setProductGroup('shoes'); resetForm(); setProductGroup('shoes'); }}
                                            className={`p-4 rounded-xl border-2 transition-all ${productGroup === 'shoes'
                                                ? 'border-blue-500 bg-blue-500/10'
                                                : 'border-slate-600 hover:border-slate-500'
                                                }`}
                                        >
                                            <Footprints className={`w-8 h-8 mx-auto mb-2 ${productGroup === 'shoes' ? 'text-blue-400' : 'text-slate-400'}`} />
                                            <p className="font-semibold text-white">Ayakkabı</p>
                                            <p className="text-xs text-slate-400">YDS, Starline</p>
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Textile Form */}
                            {productGroup === 'textile' && (
                                <>
                                    <Card className="bg-slate-800/50 border-slate-700/50">
                                        <CardHeader>
                                            <CardTitle className="text-white">Tekstil Detayları</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {/* Category */}
                                            <div className="space-y-2">
                                                <Label className="text-slate-300">Kategori</Label>
                                                <Select value={category} onValueChange={(v) => setCategory(v as TextileCategory)}>
                                                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                                                        <SelectValue placeholder="Kategori seçin..." />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-slate-800 border-slate-700">
                                                        <SelectItem value="tulum" className="text-white">Tulum</SelectItem>
                                                        <SelectItem value="kaban" className="text-white">Kaban</SelectItem>
                                                        <SelectItem value="gomlek" className="text-white">Gömlek</SelectItem>
                                                        <SelectItem value="pantolon" className="text-white">Pantolon</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* Fabric */}
                                            <div className="space-y-2">
                                                <Label className="text-slate-300">Kumaş Tipi</Label>
                                                <Select value={fabric} onValueChange={(v) => setFabric(v as FabricType)}>
                                                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                                                        <SelectValue placeholder="Kumaş tipi seçin..." />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-slate-800 border-slate-700">
                                                        <SelectItem value="nomex" className="text-white">Nomex</SelectItem>
                                                        <SelectItem value="gtc" className="text-white">GTC</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* Colors */}
                                            <div className="space-y-2">
                                                <Label className="text-slate-300">Renkler</Label>
                                                <div className="flex gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleColor('yesil')}
                                                        className={`flex-1 p-3 rounded-xl border-2 transition-all ${selectedColors.includes('yesil')
                                                            ? 'border-green-500 bg-green-500/20'
                                                            : 'border-slate-600 hover:border-slate-500'
                                                            }`}
                                                    >
                                                        <div className="w-6 h-6 rounded-full bg-green-600 mx-auto mb-1"></div>
                                                        <p className="text-sm text-white">Yeşil</p>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleColor('turuncu')}
                                                        className={`flex-1 p-3 rounded-xl border-2 transition-all ${selectedColors.includes('turuncu')
                                                            ? 'border-orange-500 bg-orange-500/20'
                                                            : 'border-slate-600 hover:border-slate-500'
                                                            }`}
                                                    >
                                                        <div className="w-6 h-6 rounded-full bg-orange-500 mx-auto mb-1"></div>
                                                        <p className="text-sm text-white">Turuncu</p>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Sizes */}
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <Label className="text-slate-300">Bedenler</Label>
                                                    <div className="flex gap-2">
                                                        <button type="button" onClick={selectAllTextileSizes} className="text-xs text-emerald-400 hover:underline">
                                                            Tümünü Seç
                                                        </button>
                                                        <button type="button" onClick={clearTextileSizes} className="text-xs text-slate-400 hover:underline">
                                                            Temizle
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {TEXTILE_SIZES.map(size => (
                                                        <button
                                                            key={size}
                                                            type="button"
                                                            onClick={() => toggleTextileSize(size)}
                                                            className={`px-3 py-1.5 rounded-lg border text-sm transition-all ${selectedTextileSizes.includes(size)
                                                                ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                                                                : 'border-slate-600 text-slate-400 hover:border-slate-500'
                                                                }`}
                                                        >
                                                            {size}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </>
                            )}

                            {/* Shoes Form */}
                            {productGroup === 'shoes' && (
                                <Card className="bg-slate-800/50 border-slate-700/50">
                                    <CardHeader>
                                        <CardTitle className="text-white">Ayakkabı Detayları</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* Brand */}
                                        <div className="space-y-2">
                                            <Label className="text-slate-300">Marka</Label>
                                            <Select value={brand} onValueChange={setBrand}>
                                                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                                                    <SelectValue placeholder="Marka seçin..." />
                                                </SelectTrigger>
                                                <SelectContent className="bg-slate-800 border-slate-700">
                                                    <SelectItem value="YDS" className="text-white">YDS</SelectItem>
                                                    <SelectItem value="Starline" className="text-white">Starline</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Model */}
                                        <div className="space-y-2">
                                            <Label className="text-slate-300">Model</Label>
                                            <Input
                                                value={model}
                                                onChange={(e) => setModel(e.target.value)}
                                                placeholder="Örn: EL 170 S3, UL 110 S3, 9040B S3"
                                                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                                            />
                                        </div>

                                        {/* Sizes */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-slate-300">Bedenler</Label>
                                                <div className="flex gap-2">
                                                    <button type="button" onClick={selectAllShoeSizes} className="text-xs text-blue-400 hover:underline">
                                                        Tümünü Seç
                                                    </button>
                                                    <button type="button" onClick={clearShoeSizes} className="text-xs text-slate-400 hover:underline">
                                                        Temizle
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {SHOE_SIZES.map(size => (
                                                    <button
                                                        key={size}
                                                        type="button"
                                                        onClick={() => toggleShoeSize(size)}
                                                        className={`px-3 py-1.5 rounded-lg border text-sm transition-all ${selectedShoeSizes.includes(size)
                                                            ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                                                            : 'border-slate-600 text-slate-400 hover:border-slate-500'
                                                            }`}
                                                    >
                                                        {size}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Submit Button */}
                            {productGroup && (
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/25"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Oluşturuluyor...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="mr-2 h-4 w-4" />
                                            Ürün ve Varyantları Oluştur
                                        </>
                                    )}
                                </Button>
                            )}
                        </form>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    )
}
