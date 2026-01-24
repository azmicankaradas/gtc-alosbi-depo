'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useCallback } from 'react'
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
    Search,
    Loader2,
    Minus,
    AlertTriangle,
    Package,
    MapPin
} from 'lucide-react'
import { toast } from 'sonner'
import type { StockFullView } from '@/types/database'

export default function StockOutputPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [stockItems, setStockItems] = useState<StockFullView[]>([])
    const [selectedStock, setSelectedStock] = useState<StockFullView | null>(null)
    const [outputQuantity, setOutputQuantity] = useState('')
    const [isSearching, setIsSearching] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const supabase = createClient()

    // Search for stock items
    const handleSearch = async () => {
        if (!searchQuery.trim()) return

        setIsSearching(true)
        try {
            const { data } = await supabase
                .from('stock_full_view')
                .select('*')
                .or(`sku.ilike.%${searchQuery}%,product_name.ilike.%${searchQuery}%,brand.ilike.%${searchQuery}%,size.ilike.%${searchQuery}%,location_code.ilike.%${searchQuery}%`)
                .gt('quantity', 0)
                .limit(20)

            setStockItems((data as StockFullView[]) || [])
        } catch (error) {
            toast.error('Arama sırasında hata oluştu')
        } finally {
            setIsSearching(false)
        }
    }

    // Handle stock selection
    const handleSelectStock = (item: StockFullView) => {
        setSelectedStock(item)
        setOutputQuantity('')
    }

    // Handle stock output
    const handleOutput = async () => {
        if (!selectedStock || !outputQuantity) {
            toast.error('Lütfen miktar girin')
            return
        }

        const qty = parseInt(outputQuantity)
        if (isNaN(qty) || qty <= 0) {
            toast.error('Geçerli bir miktar girin')
            return
        }

        if (qty > selectedStock.quantity) {
            toast.error('Yetersiz stok', {
                description: `Mevcut stok: ${selectedStock.quantity} adet`
            })
            return
        }

        setIsSubmitting(true)

        try {
            const newQuantity = selectedStock.quantity - qty

            const { error } = await supabase
                .from('stock')
                .update({ quantity: newQuantity })
                .eq('id', selectedStock.stock_id)

            if (error) throw error

            toast.success('Stok Çıkışı Yapıldı', {
                description: `${qty} adet çıkartıldı. Kalan: ${newQuantity}`
            })

            // Reset form
            setSelectedStock(null)
            setOutputQuantity('')

            // Refresh stock list
            handleSearch()

        } catch (error: any) {
            toast.error('Hata', {
                description: error.message || 'Stok çıkışı yapılırken hata oluştu'
            })
        } finally {
            setIsSubmitting(false)
        }
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
                            <h1 className="text-lg font-bold text-white">Stok Çıkışı</h1>
                            <p className="text-xs text-slate-400">Depodan ürün çıkar</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6 max-w-2xl">
                {/* Search */}
                <Card className="bg-slate-800/50 border-slate-700/50 mb-6">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Search className="w-5 h-5 text-orange-400" />
                            Stok Ara
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            Çıkış yapılacak ürünü arayın
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2">
                            <Input
                                type="text"
                                placeholder="Ürün adı, SKU, beden veya konum..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                            />
                            <Button
                                onClick={handleSearch}
                                disabled={isSearching}
                                className="bg-orange-500 hover:bg-orange-600"
                            >
                                {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Stock List */}
                {stockItems.length > 0 && !selectedStock && (
                    <Card className="bg-slate-800/50 border-slate-700/50 mb-6">
                        <CardHeader>
                            <CardTitle className="text-white">Bulunan Stoklar</CardTitle>
                            <CardDescription className="text-slate-400">
                                Çıkış yapmak için bir stok seçin
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {stockItems.map((item) => (
                                <button
                                    key={item.stock_id}
                                    onClick={() => handleSelectStock(item)}
                                    className="w-full p-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg text-left transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-white">{item.product_name}</p>
                                            <p className="text-xs text-slate-400">
                                                {item.sku} • Beden: {item.size} • {item.location_code}
                                            </p>
                                        </div>
                                        <Badge className="bg-emerald-500/20 text-emerald-400">
                                            {item.quantity} adet
                                        </Badge>
                                    </div>
                                </button>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {/* Selected Stock Output Form */}
                {selectedStock && (
                    <Card className="bg-orange-500/5 border-orange-500/30">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-white">Stok Çıkışı</CardTitle>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedStock(null)}
                                    className="text-slate-400"
                                >
                                    İptal
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Stock Info */}
                            <div className="p-4 bg-slate-800/50 rounded-xl space-y-2">
                                <div className="flex items-start gap-3">
                                    <Package className="w-5 h-5 text-orange-400 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-white">{selectedStock.product_name}</p>
                                        <p className="text-sm text-slate-400">{selectedStock.sku}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-5 h-5 text-blue-400" />
                                    <p className="text-sm text-slate-300">{selectedStock.location_code}</p>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                                    <span className="text-slate-400">Mevcut Stok:</span>
                                    <span className="text-xl font-bold text-emerald-400">{selectedStock.quantity} adet</span>
                                </div>
                            </div>

                            {/* Output Quantity */}
                            <div className="space-y-2">
                                <Label className="text-slate-300">Çıkış Miktarı</Label>
                                <Input
                                    type="number"
                                    min="1"
                                    max={selectedStock.quantity}
                                    value={outputQuantity}
                                    onChange={(e) => setOutputQuantity(e.target.value)}
                                    placeholder="Kaç adet çıkış yapılacak?"
                                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                                />
                                {outputQuantity && parseInt(outputQuantity) > selectedStock.quantity && (
                                    <p className="text-xs text-red-400 flex items-center gap-1">
                                        <AlertTriangle className="w-3 h-3" />
                                        Mevcut stoktan fazla çıkış yapamazsınız
                                    </p>
                                )}
                            </div>

                            {/* Remaining Preview */}
                            {outputQuantity && parseInt(outputQuantity) <= selectedStock.quantity && (
                                <div className="p-3 bg-slate-700/30 rounded-lg">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-400">Çıkış sonrası kalan:</span>
                                        <span className="font-bold text-white">
                                            {selectedStock.quantity - parseInt(outputQuantity)} adet
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <Button
                                onClick={handleOutput}
                                disabled={isSubmitting || !outputQuantity || parseInt(outputQuantity) > selectedStock.quantity}
                                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        İşleniyor...
                                    </>
                                ) : (
                                    <>
                                        <Minus className="mr-2 h-4 w-4" />
                                        Stok Çıkışı Yap
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </main>
        </div>
    )
}
