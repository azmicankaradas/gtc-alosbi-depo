'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
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
    AlertTriangle,
    Package,
    MapPin,
    User,
    Check,
    Download,
    FileText,
    RotateCcw
} from 'lucide-react'
import { toast } from 'sonner'
import type { StockFullView } from '@/types/database'
import { REQUESTER_OPTIONS, COLOR_NAMES, TEXTILE_CATEGORY_NAMES, FABRIC_NAMES } from '@/types/database'
import { generateStockOutReceipt, downloadReceipt, type StockOutReceiptData } from '@/lib/pdf-generator'

// Document code generator
function generateDocumentCode(): string {
    const date = new Date()
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `STK-${dateStr}-${randomPart}`
}

// Transaction result type
interface TransactionResult {
    documentCode: string
    date: string
    requesterName: string
    productName: string
    brand: string | null
    model: string | null
    category: string | null
    fabric: string | null
    size: string
    color: string | null
    quantity: number
}

export default function StockOutPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [stockItems, setStockItems] = useState<StockFullView[]>([])
    const [selectedStock, setSelectedStock] = useState<StockFullView | null>(null)
    const [outputQuantity, setOutputQuantity] = useState('')
    const [requesterName, setRequesterName] = useState('')
    const [isSearching, setIsSearching] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Success state for showing download button
    const [transactionComplete, setTransactionComplete] = useState(false)
    const [lastTransaction, setLastTransaction] = useState<TransactionResult | null>(null)

    const supabase = createClient()

    // Search for stock items using existing view
    const handleSearch = async () => {
        if (!searchQuery.trim()) return

        setIsSearching(true)
        try {
            const { data, error } = await supabase
                .from('stock_full_view')
                .select('*')
                .or(`sku.ilike.%${searchQuery}%,product_name.ilike.%${searchQuery}%,brand.ilike.%${searchQuery}%,size.ilike.%${searchQuery}%,location_code.ilike.%${searchQuery}%`)
                .gt('quantity', 0)
                .limit(20)

            if (error) throw error
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
        setTransactionComplete(false)
        setLastTransaction(null)
    }

    // Handle stock output submission
    const handleOutput = async () => {
        if (!selectedStock || !outputQuantity || !requesterName) {
            toast.error('Lütfen tüm alanları doldurun')
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
            const documentCode = generateDocumentCode()
            const transactionDate = new Date().toLocaleDateString('tr-TR')

            // 1. Update stock quantity (this triggers automatic movement record creation)
            const { error: stockError } = await supabase
                .from('stock')
                .update({ quantity: newQuantity })
                .eq('id', selectedStock.stock_id)

            if (stockError) throw stockError

            // 2. Update the movement record created by the trigger to add requester info
            // Find the most recent movement for this stock
            const { error: movementError } = await supabase
                .from('stock_movements')
                .update({
                    requester_name: requesterName,
                    document_code: documentCode,
                    notes: `Talep eden: ${requesterName}`
                })
                .eq('stock_id', selectedStock.stock_id)
                .eq('new_quantity', newQuantity)
                .order('created_at', { ascending: false })
                .limit(1)

            if (movementError) throw movementError

            // Store transaction result for PDF generation
            setLastTransaction({
                documentCode,
                date: transactionDate,
                requesterName,
                productName: selectedStock.product_name,
                brand: selectedStock.brand,
                model: selectedStock.model,
                category: selectedStock.category,
                fabric: selectedStock.fabric,
                size: selectedStock.size,
                color: selectedStock.color,
                quantity: qty
            })

            setTransactionComplete(true)

            toast.success('Stok Çıkışı Tamamlandı', {
                description: `${qty} adet ${selectedStock.product_name} çıkışı yapıldı`
            })

        } catch (error: any) {
            console.error('Stock output error:', error)
            toast.error('Hata', {
                description: error.message || 'Stok çıkışı yapılırken hata oluştu'
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    // Handle PDF download
    const handleDownloadReceipt = () => {
        if (!lastTransaction) return

        // Build category/type string
        let categoryType = '-'
        if (lastTransaction.category) {
            categoryType = TEXTILE_CATEGORY_NAMES[lastTransaction.category as keyof typeof TEXTILE_CATEGORY_NAMES] || lastTransaction.category
            if (lastTransaction.fabric) {
                categoryType += ` / ${FABRIC_NAMES[lastTransaction.fabric as keyof typeof FABRIC_NAMES] || lastTransaction.fabric}`
            }
        }

        // Build size/color string
        let sizeColor = lastTransaction.size
        if (lastTransaction.color) {
            sizeColor += ` / ${COLOR_NAMES[lastTransaction.color as keyof typeof COLOR_NAMES] || lastTransaction.color}`
        }

        const receiptData: StockOutReceiptData = {
            documentCode: lastTransaction.documentCode,
            date: lastTransaction.date,
            requesterName: lastTransaction.requesterName,
            items: [{
                productName: lastTransaction.productName,
                brandModel: lastTransaction.brand && lastTransaction.model
                    ? `${lastTransaction.brand} / ${lastTransaction.model}`
                    : lastTransaction.brand || '-',
                categoryType,
                sizeColor,
                quantity: lastTransaction.quantity
            }],
            systemUser: 'Depo Yetkilisi'
        }

        const doc = generateStockOutReceipt(receiptData)
        downloadReceipt(doc, lastTransaction.documentCode)

        toast.success('PDF İndirildi', {
            description: `${lastTransaction.documentCode}.pdf`
        })
    }

    // Start new transaction
    const handleNewTransaction = () => {
        setSelectedStock(null)
        setOutputQuantity('')
        setRequesterName('')
        setStockItems([])
        setSearchQuery('')
        setTransactionComplete(false)
        setLastTransaction(null)
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
                            <p className="text-xs text-slate-400">Depodan ürün teslimi yap</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6 max-w-2xl">

                {/* Success State - Show after transaction complete */}
                {transactionComplete && lastTransaction && (
                    <Card className="bg-emerald-500/10 border-emerald-500/30 mb-6">
                        <CardHeader className="text-center pb-2">
                            <div className="mx-auto w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                                <Check className="w-8 h-8 text-emerald-400" />
                            </div>
                            <CardTitle className="text-white text-xl">İşlem Tamamlandı!</CardTitle>
                            <CardDescription className="text-slate-300">
                                Stok çıkışı başarıyla kaydedildi
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Transaction Summary */}
                            <div className="p-4 bg-slate-800/50 rounded-xl space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Fiş No:</span>
                                    <span className="font-mono text-emerald-400">{lastTransaction.documentCode}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Tarih:</span>
                                    <span className="text-white">{lastTransaction.date}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Talep Eden:</span>
                                    <span className="text-white">{lastTransaction.requesterName}</span>
                                </div>
                                <div className="border-t border-slate-700 pt-2 mt-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Ürün:</span>
                                        <span className="text-white">{lastTransaction.productName}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Beden:</span>
                                        <span className="text-white">{lastTransaction.size}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Adet:</span>
                                        <Badge className="bg-orange-500/20 text-orange-400">{lastTransaction.quantity} adet</Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-2 gap-3">
                                <Button
                                    onClick={handleDownloadReceipt}
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    PDF İndir
                                </Button>
                                <Button
                                    onClick={handleNewTransaction}
                                    variant="outline"
                                    className="border-slate-600 text-slate-300 hover:bg-slate-800"
                                >
                                    <RotateCcw className="mr-2 h-4 w-4" />
                                    Yeni İşlem
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Search Card - Hide when transaction complete */}
                {!transactionComplete && (
                    <Card className="bg-slate-800/50 border-slate-700/50 mb-6">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Search className="w-5 h-5 text-orange-400" />
                                Stok Ara
                            </CardTitle>
                            <CardDescription className="text-slate-400">
                                Çıkış yapılacak ürünü arayın (ürün adı, SKU, beden veya konum)
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
                )}

                {/* Stock List - Show when searched and no item selected */}
                {!transactionComplete && stockItems.length > 0 && !selectedStock && (
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

                {/* No results message */}
                {!transactionComplete && stockItems.length === 0 && searchQuery && !isSearching && (
                    <Card className="bg-slate-800/50 border-slate-700/50 mb-6">
                        <CardContent className="py-8 text-center">
                            <p className="text-slate-400">Sonuç bulunamadı</p>
                        </CardContent>
                    </Card>
                )}

                {/* Selected Stock Output Form */}
                {!transactionComplete && selectedStock && (
                    <Card className="bg-orange-500/5 border-orange-500/30">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-white flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-orange-400" />
                                    Stok Çıkış Formu
                                </CardTitle>
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
                                        {selectedStock.brand && (
                                            <p className="text-xs text-slate-500">Marka: {selectedStock.brand}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-5 h-5 text-blue-400" />
                                    <p className="text-sm text-slate-300">{selectedStock.location_code}</p>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                                    <span className="text-slate-400">Beden:</span>
                                    <span className="font-medium text-white">{selectedStock.size}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400">Mevcut Stok:</span>
                                    <span className="text-xl font-bold text-emerald-400">{selectedStock.quantity} adet</span>
                                </div>
                            </div>

                            {/* Requester Selection */}
                            <div className="space-y-2">
                                <Label className="text-slate-300 flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Talep Eden
                                </Label>
                                <Select value={requesterName} onValueChange={setRequesterName}>
                                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                                        <SelectValue placeholder="Talep eden kişiyi seçin..." />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-slate-700">
                                        {REQUESTER_OPTIONS.map((name) => (
                                            <SelectItem key={name} value={name} className="text-white hover:bg-slate-700">
                                                {name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Output Quantity */}
                            <div className="space-y-2">
                                <Label className="text-slate-300">Çıkış Miktarı</Label>
                                <Input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    value={outputQuantity}
                                    onChange={(e) => {
                                        const value = e.target.value
                                        // Only allow numeric input
                                        if (value === '' || /^\d+$/.test(value)) {
                                            setOutputQuantity(value)
                                        }
                                    }}
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
                            {outputQuantity && parseInt(outputQuantity) <= selectedStock.quantity && requesterName && (
                                <div className="p-3 bg-slate-700/30 rounded-lg space-y-1">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-400">Talep Eden:</span>
                                        <span className="font-medium text-white">{requesterName}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-400">Çıkış Adedi:</span>
                                        <span className="font-medium text-orange-400">{outputQuantity} adet</span>
                                    </div>
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
                                disabled={isSubmitting || !outputQuantity || !requesterName || parseInt(outputQuantity) > selectedStock.quantity}
                                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/25"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        İşleniyor...
                                    </>
                                ) : (
                                    <>
                                        <Check className="mr-2 h-4 w-4" />
                                        Stok Çıkışı Onayla
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
