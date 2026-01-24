'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    ArrowLeft,
    Search as SearchIcon,
    Package,
    MapPin,
    Loader2,
    Shirt,
    Footprints
} from 'lucide-react'
import { toast } from 'sonner'
import type { StockFullView } from '@/types/database'

export default function SearchPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [results, setResults] = useState<StockFullView[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [hasSearched, setHasSearched] = useState(false)
    const supabase = createClient()

    // Debounced search function
    const handleSearch = useCallback(async () => {
        if (!searchQuery.trim()) {
            setResults([])
            setHasSearched(false)
            return
        }

        setIsSearching(true)
        setHasSearched(true)

        try {
            // Use the search_stock function we created in SQL
            const { data, error } = await supabase.rpc('search_stock', {
                search_term: searchQuery.trim()
            })

            if (error) throw error

            setResults(data || [])
        } catch (error) {
            console.error('Search error:', error)

            // Fallback to direct query if RPC fails
            try {
                const { data } = await supabase
                    .from('stock_full_view')
                    .select('*')
                    .or(`sku.ilike.%${searchQuery}%,product_name.ilike.%${searchQuery}%,brand.ilike.%${searchQuery}%,size.ilike.%${searchQuery}%,location_code.ilike.%${searchQuery}%`)
                    .limit(50)

                setResults((data as StockFullView[]) || [])
            } catch (fallbackError) {
                toast.error('Arama sırasında hata oluştu')
                setResults([])
            }
        } finally {
            setIsSearching(false)
        }
    }, [searchQuery, supabase])

    // Trigger search on enter or button click
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        handleSearch()
    }

    // Keyboard shortcut
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter' && searchQuery.trim()) {
                handleSearch()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [searchQuery, handleSearch])

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
                            <h1 className="text-lg font-bold text-white">Stok Arama</h1>
                            <p className="text-xs text-slate-400">Ürün ve konum ara</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6 max-w-3xl">
                {/* Search Form */}
                <Card className="bg-slate-800/50 border-slate-700/50 mb-6">
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="flex gap-2">
                            <div className="relative flex-1">
                                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    type="text"
                                    placeholder="Ürün, SKU, beden, marka veya konum ara..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
                                    autoFocus
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={isSearching || !searchQuery.trim()}
                                className="bg-blue-500 hover:bg-blue-600 text-white"
                            >
                                {isSearching ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <SearchIcon className="w-4 h-4" />
                                )}
                            </Button>
                        </form>

                        <div className="flex flex-wrap gap-2 mt-4">
                            <p className="text-xs text-slate-500 w-full mb-1">Örnek aramalar:</p>
                            <button
                                type="button"
                                onClick={() => { setSearchQuery('YDS 42'); handleSearch() }}
                                className="text-xs px-2 py-1 bg-slate-700/50 text-slate-400 rounded-md hover:bg-slate-700 hover:text-white transition-colors"
                            >
                                YDS 42
                            </button>
                            <button
                                type="button"
                                onClick={() => { setSearchQuery('Nomex M'); handleSearch() }}
                                className="text-xs px-2 py-1 bg-slate-700/50 text-slate-400 rounded-md hover:bg-slate-700 hover:text-white transition-colors"
                            >
                                Nomex M
                            </button>
                            <button
                                type="button"
                                onClick={() => { setSearchQuery('F0-R1'); handleSearch() }}
                                className="text-xs px-2 py-1 bg-slate-700/50 text-slate-400 rounded-md hover:bg-slate-700 hover:text-white transition-colors"
                            >
                                F0-R1
                            </button>
                            <button
                                type="button"
                                onClick={() => { setSearchQuery('Turuncu'); handleSearch() }}
                                className="text-xs px-2 py-1 bg-slate-700/50 text-slate-400 rounded-md hover:bg-slate-700 hover:text-white transition-colors"
                            >
                                Turuncu
                            </button>
                        </div>
                    </CardContent>
                </Card>

                {/* Results */}
                {isSearching ? (
                    <div className="text-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
                        <p className="text-slate-400">Aranıyor...</p>
                    </div>
                ) : hasSearched ? (
                    results.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                            <p className="text-slate-400">Sonuç bulunamadı</p>
                            <p className="text-xs text-slate-500 mt-1">
                                Farklı anahtar kelimeler deneyin
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between mb-4">
                                <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                                    {results.length} sonuç bulundu
                                </Badge>
                            </div>

                            {results.map((item) => (
                                <Card
                                    key={item.stock_id}
                                    className={`border transition-all hover:border-slate-600 ${item.low_stock
                                        ? 'bg-orange-500/5 border-orange-500/30'
                                        : 'bg-slate-800/50 border-slate-700/50'
                                        }`}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-start gap-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.product_group === 'textile'
                                                    ? 'bg-emerald-500/20'
                                                    : 'bg-blue-500/20'
                                                    }`}>
                                                    {item.product_group === 'textile' ? (
                                                        <Shirt className="w-5 h-5 text-emerald-400" />
                                                    ) : (
                                                        <Footprints className="w-5 h-5 text-blue-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-white">
                                                        {item.product_name}
                                                    </h3>
                                                    <p className="text-sm text-slate-400">
                                                        {item.sku}
                                                    </p>
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        <Badge variant="outline" className="border-slate-600 text-slate-300">
                                                            Beden: {item.size}
                                                        </Badge>
                                                        {item.color && (
                                                            <Badge
                                                                variant="outline"
                                                                className={
                                                                    item.color === 'yesil'
                                                                        ? 'border-green-500/50 text-green-400'
                                                                        : 'border-orange-500/50 text-orange-400'
                                                                }
                                                            >
                                                                {item.color === 'yesil' ? 'Yeşil' : 'Turuncu'}
                                                            </Badge>
                                                        )}
                                                        {item.brand && (
                                                            <Badge variant="outline" className="border-slate-600 text-slate-300">
                                                                {item.brand}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <div className={`text-2xl font-bold ${item.low_stock ? 'text-orange-400' : 'text-emerald-400'
                                                    }`}>
                                                    {item.quantity}
                                                </div>
                                                <p className="text-xs text-slate-500">adet</p>
                                                {item.low_stock && (
                                                    <Badge variant="destructive" className="mt-1 bg-orange-500/20 text-orange-400 border-0 text-xs">
                                                        Düşük Stok
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        {/* Location */}
                                        <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-slate-500" />
                                            <span className="text-sm text-slate-400">
                                                <span className="font-mono text-white">{item.location_code}</span>
                                                {' — '}
                                                {item.floor === 'floor_0' ? 'Zemin Kat' : '1. Kat'}
                                                {' / Raf '}{item.shelf}
                                                {' / '}{item.column_label}{item.cell}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )
                ) : (
                    <div className="text-center py-12">
                        <SearchIcon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-400">Aramak için yukarıdan bir terim girin</p>
                        <p className="text-xs text-slate-500 mt-1">
                            Ürün adı, SKU, beden, marka veya konum kodu arayabilirsiniz
                        </p>
                    </div>
                )}
            </main>
        </div>
    )
}
