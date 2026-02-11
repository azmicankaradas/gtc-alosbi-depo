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
    RotateCcw,
    Plus,
    ShoppingCart,
    Trash2,
    X
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

// Cart item type - a stock item with the quantity to withdraw
interface CartItem {
    stock: StockFullView
    outputQuantity: number
}

// Transaction result type for PDF
interface TransactionResult {
    documentCode: string
    date: string
    requesterName: string
    items: {
        productName: string
        brand: string | null
        model: string | null
        category: string | null
        fabric: string | null
        size: string
        color: string | null
        quantity: number
    }[]
}

export default function StockOutPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [stockItems, setStockItems] = useState<StockFullView[]>([])
    const [selectedStock, setSelectedStock] = useState<StockFullView | null>(null)
    const [outputQuantity, setOutputQuantity] = useState('')
    const [requesterName, setRequesterName] = useState('')
    const [isSearching, setIsSearching] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Cart state
    const [cartItems, setCartItems] = useState<CartItem[]>([])

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
    }

    // Add selected item to cart
    const handleAddToCart = () => {
        if (!selectedStock || !outputQuantity) {
            toast.error('Lütfen miktar girin')
            return
        }

        const qty = parseInt(outputQuantity)
        if (isNaN(qty) || qty <= 0) {
            toast.error('Geçerli bir miktar girin')
            return
        }

        // Calculate already-in-cart quantity for this same stock_id
        const existingCartQty = cartItems
            .filter(ci => ci.stock.stock_id === selectedStock.stock_id)
            .reduce((sum, ci) => sum + ci.outputQuantity, 0)

        const availableQty = selectedStock.quantity - existingCartQty

        if (qty > availableQty) {
            toast.error('Yetersiz stok', {
                description: existingCartQty > 0
                    ? `Mevcut: ${selectedStock.quantity}, sepette: ${existingCartQty}, kalan: ${availableQty}`
                    : `Mevcut stok: ${selectedStock.quantity} adet`
            })
            return
        }

        // Check if same stock_id already in cart - merge quantities
        const existingIndex = cartItems.findIndex(ci => ci.stock.stock_id === selectedStock.stock_id)
        if (existingIndex >= 0) {
            const updated = [...cartItems]
            updated[existingIndex] = {
                ...updated[existingIndex],
                outputQuantity: updated[existingIndex].outputQuantity + qty
            }
            setCartItems(updated)
        } else {
            setCartItems(prev => [...prev, { stock: selectedStock, outputQuantity: qty }])
        }

        toast.success('Sepete eklendi', {
            description: `${qty} adet ${selectedStock.product_name}`
        })

        // Reset selection
        setSelectedStock(null)
        setOutputQuantity('')
        setStockItems([])
        setSearchQuery('')
    }

    // Remove item from cart
    const handleRemoveFromCart = (index: number) => {
        setCartItems(prev => prev.filter((_, i) => i !== index))
    }

    // Handle stock output submission for all cart items
    const handleOutput = async () => {
        if (cartItems.length === 0) {
            toast.error('Sepet boş')
            return
        }

        if (!requesterName) {
            toast.error('Lütfen talep eden kişiyi seçin')
            return
        }

        setIsSubmitting(true)

        try {
            const documentCode = generateDocumentCode()
            const transactionDate = new Date().toLocaleDateString('tr-TR')
            const resultItems: TransactionResult['items'] = []

            // Process each cart item
            for (const cartItem of cartItems) {
                const newQuantity = cartItem.stock.quantity - cartItem.outputQuantity

                // 1. Update stock quantity
                const { error: stockError } = await supabase
                    .from('stock')
                    .update({ quantity: newQuantity })
                    .eq('id', cartItem.stock.stock_id)

                if (stockError) throw stockError

                // 2. Update the movement record created by the trigger
                const { error: movementError } = await supabase
                    .from('stock_movements')
                    .update({
                        requester_name: requesterName,
                        document_code: documentCode,
                        notes: `Talep eden: ${requesterName}`
                    })
                    .eq('stock_id', cartItem.stock.stock_id)
                    .eq('new_quantity', newQuantity)
                    .order('created_at', { ascending: false })
                    .limit(1)

                if (movementError) throw movementError

                resultItems.push({
                    productName: cartItem.stock.product_name,
                    brand: cartItem.stock.brand,
                    model: cartItem.stock.model,
                    category: cartItem.stock.category,
                    fabric: cartItem.stock.fabric,
                    size: cartItem.stock.size,
                    color: cartItem.stock.color,
                    quantity: cartItem.outputQuantity
                })
            }

            // Store transaction result for PDF generation
            setLastTransaction({
                documentCode,
                date: transactionDate,
                requesterName,
                items: resultItems
            })

            setTransactionComplete(true)

            const totalQty = cartItems.reduce((sum, ci) => sum + ci.outputQuantity, 0)
            toast.success('Stok Çıkışı Tamamlandı', {
                description: `${cartItems.length} kalem, toplam ${totalQty} adet çıkış yapıldı`
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

        const receiptItems = lastTransaction.items.map(item => {
            // Build category/type string
            let categoryType = '-'
            if (item.category) {
                categoryType = TEXTILE_CATEGORY_NAMES[item.category as keyof typeof TEXTILE_CATEGORY_NAMES] || item.category
                if (item.fabric) {
                    categoryType += ` / ${FABRIC_NAMES[item.fabric as keyof typeof FABRIC_NAMES] || item.fabric}`
                }
            }

            // Build size/color string
            let sizeColor = item.size
            if (item.color) {
                sizeColor += ` / ${COLOR_NAMES[item.color as keyof typeof COLOR_NAMES] || item.color}`
            }

            return {
                productName: item.productName,
                brandModel: item.brand && item.model
                    ? `${item.brand} / ${item.model}`
                    : item.brand || '-',
                categoryType,
                sizeColor,
                quantity: item.quantity
            }
        })

        const receiptData: StockOutReceiptData = {
            documentCode: lastTransaction.documentCode,
            date: lastTransaction.date,
            requesterName: lastTransaction.requesterName,
            items: receiptItems,
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
        setCartItems([])
        setTransactionComplete(false)
        setLastTransaction(null)
    }

    // Get available quantity considering cart
    const getAvailableQuantity = (stockId: string, currentQuantity: number): number => {
        const cartQty = cartItems
            .filter(ci => ci.stock.stock_id === stockId)
            .reduce((sum, ci) => sum + ci.outputQuantity, 0)
        return currentQuantity - cartQty
    }

    const totalCartQuantity = cartItems.reduce((sum, ci) => sum + ci.outputQuantity, 0)

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
                        <div className="flex-1">
                            <h1 className="text-lg font-bold text-white">Stok Çıkışı</h1>
                            <p className="text-xs text-slate-400">Depodan ürün teslimi yap</p>
                        </div>
                        {/* Cart badge in header */}
                        {cartItems.length > 0 && !transactionComplete && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/20 border border-orange-500/30 rounded-full">
                                <ShoppingCart className="w-4 h-4 text-orange-400" />
                                <span className="text-sm font-medium text-orange-400">
                                    {cartItems.length} kalem
                                </span>
                            </div>
                        )}
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
                                {lastTransaction.items.length} kalem stok çıkışı başarıyla kaydedildi
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
                                <div className="border-t border-slate-700 pt-2 mt-2 space-y-2">
                                    {lastTransaction.items.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between text-sm">
                                            <div>
                                                <span className="text-white">{item.productName}</span>
                                                <span className="text-slate-500 ml-2">Beden: {item.size}</span>
                                            </div>
                                            <Badge className="bg-orange-500/20 text-orange-400">{item.quantity} adet</Badge>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-slate-700 pt-2 mt-2">
                                    <div className="flex justify-between text-sm font-semibold">
                                        <span className="text-slate-300">Toplam:</span>
                                        <span className="text-orange-400">
                                            {lastTransaction.items.reduce((s, i) => s + i.quantity, 0)} adet
                                        </span>
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

                {/* Main Form - Hide when transaction complete */}
                {!transactionComplete && (
                    <>
                        {/* Step 1: Requester Selection */}
                        <Card className="bg-slate-800/50 border-slate-700/50 mb-6">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-white flex items-center gap-2 text-base">
                                    <User className="w-5 h-5 text-orange-400" />
                                    Talep Eden
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
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
                            </CardContent>
                        </Card>

                        {/* Cart Summary - Show when items in cart */}
                        {cartItems.length > 0 && (
                            <Card className="bg-orange-500/5 border-orange-500/30 mb-6">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-white flex items-center gap-2 text-base">
                                            <ShoppingCart className="w-5 h-5 text-orange-400" />
                                            Sepet
                                            <Badge className="bg-orange-500/20 text-orange-400 ml-1">
                                                {cartItems.length} kalem
                                            </Badge>
                                        </CardTitle>
                                        <span className="text-sm font-semibold text-orange-400">
                                            Toplam: {totalCartQuantity} adet
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {cartItems.map((cartItem, index) => (
                                        <div
                                            key={`${cartItem.stock.stock_id}-${index}`}
                                            className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-white text-sm truncate">
                                                    {cartItem.stock.product_name}
                                                </p>
                                                <p className="text-xs text-slate-400">
                                                    Beden: {cartItem.stock.size} • {cartItem.stock.location_code}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3 ml-3">
                                                <Badge className="bg-orange-500/20 text-orange-400 shrink-0">
                                                    {cartItem.outputQuantity} adet
                                                </Badge>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10 shrink-0"
                                                    onClick={() => handleRemoveFromCart(index)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Submit All Button */}
                                    <Button
                                        onClick={handleOutput}
                                        disabled={isSubmitting || !requesterName}
                                        className="w-full mt-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/25"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                İşleniyor...
                                            </>
                                        ) : (
                                            <>
                                                <Check className="mr-2 h-4 w-4" />
                                                Stok Çıkışını Tamamla ({cartItems.length} kalem)
                                            </>
                                        )}
                                    </Button>
                                    {!requesterName && (
                                        <p className="text-xs text-amber-400 text-center flex items-center justify-center gap-1">
                                            <AlertTriangle className="w-3 h-3" />
                                            Önce talep eden kişiyi seçin
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Search Card */}
                        {!selectedStock && (
                            <Card className="bg-slate-800/50 border-slate-700/50 mb-6">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <Search className="w-5 h-5 text-orange-400" />
                                        Ürün Ara
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
                        {stockItems.length > 0 && !selectedStock && (
                            <Card className="bg-slate-800/50 border-slate-700/50 mb-6">
                                <CardHeader>
                                    <CardTitle className="text-white">Bulunan Stoklar</CardTitle>
                                    <CardDescription className="text-slate-400">
                                        Çıkış yapmak için bir stok seçin
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {stockItems.map((item) => {
                                        const available = getAvailableQuantity(item.stock_id, item.quantity)
                                        const inCart = item.quantity - available
                                        return (
                                            <button
                                                key={item.stock_id}
                                                onClick={() => available > 0 && handleSelectStock(item)}
                                                disabled={available <= 0}
                                                className={`w-full p-3 rounded-lg text-left transition-colors ${available <= 0
                                                        ? 'bg-slate-700/10 opacity-50 cursor-not-allowed'
                                                        : 'bg-slate-700/30 hover:bg-slate-700/50'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-medium text-white">{item.product_name}</p>
                                                        <p className="text-xs text-slate-400">
                                                            {item.sku} • Beden: {item.size} • {item.location_code}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {inCart > 0 && (
                                                            <Badge className="bg-orange-500/20 text-orange-400 text-xs">
                                                                Sepette: {inCart}
                                                            </Badge>
                                                        )}
                                                        <Badge className={`${available <= 0 ? 'bg-slate-500/20 text-slate-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                                            {available} adet
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </button>
                                        )
                                    })}
                                </CardContent>
                            </Card>
                        )}

                        {/* No results message */}
                        {stockItems.length === 0 && searchQuery && !isSearching && !selectedStock && (
                            <Card className="bg-slate-800/50 border-slate-700/50 mb-6">
                                <CardContent className="py-8 text-center">
                                    <p className="text-slate-400">Sonuç bulunamadı</p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Selected Stock - Add to Cart Form */}
                        {selectedStock && (
                            <Card className="bg-orange-500/5 border-orange-500/30 mb-6">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-white flex items-center gap-2">
                                            <FileText className="w-5 h-5 text-orange-400" />
                                            Ürün Ekle
                                        </CardTitle>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setSelectedStock(null)
                                                setOutputQuantity('')
                                            }}
                                            className="text-slate-400"
                                        >
                                            <X className="w-4 h-4 mr-1" />
                                            Vazgeç
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
                                            <span className="text-xl font-bold text-emerald-400">
                                                {getAvailableQuantity(selectedStock.stock_id, selectedStock.quantity)} adet
                                            </span>
                                        </div>
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
                                                if (value === '' || /^\d+$/.test(value)) {
                                                    setOutputQuantity(value)
                                                }
                                            }}
                                            placeholder="Kaç adet çıkış yapılacak?"
                                            className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                                            autoFocus
                                        />
                                        {outputQuantity && parseInt(outputQuantity) > getAvailableQuantity(selectedStock.stock_id, selectedStock.quantity) && (
                                            <p className="text-xs text-red-400 flex items-center gap-1">
                                                <AlertTriangle className="w-3 h-3" />
                                                Mevcut stoktan fazla çıkış yapamazsınız
                                            </p>
                                        )}
                                    </div>

                                    {/* Add to Cart Button */}
                                    <Button
                                        onClick={handleAddToCart}
                                        disabled={!outputQuantity || parseInt(outputQuantity) > getAvailableQuantity(selectedStock.stock_id, selectedStock.quantity) || parseInt(outputQuantity) <= 0}
                                        className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/25"
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Sepete Ekle
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </>
                )}
            </main>
        </div>
    )
}
