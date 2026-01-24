'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
    ArrowLeft,
    Loader2,
    TrendingUp,
    TrendingDown,
    ArrowRightLeft,
    Settings,
    History,
    Calendar
} from 'lucide-react'
import { toast } from 'sonner'

interface StockMovement {
    id: string
    stock_id: string | null
    variant_id: string
    location_id: string
    movement_type: 'in' | 'out' | 'transfer' | 'adjustment'
    quantity: number
    previous_quantity: number
    new_quantity: number
    notes: string | null
    user_id: string | null
    created_at: string
    // Joined data
    variant?: {
        sku: string
        size: string
        product?: {
            name: string
            product_group: string
        }
    }
    location?: {
        location_id: string
        floor: string
    }
}

export default function MovementsPage() {
    const [movements, setMovements] = useState<StockMovement[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [filter, setFilter] = useState<'all' | 'in' | 'out'>('all')
    const supabase = createClient()

    useEffect(() => {
        fetchMovements()
    }, [])

    const fetchMovements = async () => {
        try {
            const { data, error } = await supabase
                .from('stock_movements')
                .select(`
          *,
          variant:variants(
            sku,
            size,
            product:products(name, product_group)
          ),
          location:locations(location_id, floor)
        `)
                .order('created_at', { ascending: false })
                .limit(100)

            if (error) throw error
            setMovements(data || [])
        } catch (error) {
            console.error('Error fetching movements:', error)
            toast.error('Hareketler yüklenirken hata oluştu')
        } finally {
            setIsLoading(false)
        }
    }

    const getMovementIcon = (type: string) => {
        switch (type) {
            case 'in': return <TrendingUp className="w-4 h-4 text-emerald-400" />
            case 'out': return <TrendingDown className="w-4 h-4 text-red-400" />
            case 'transfer': return <ArrowRightLeft className="w-4 h-4 text-blue-400" />
            case 'adjustment': return <Settings className="w-4 h-4 text-orange-400" />
            default: return <History className="w-4 h-4 text-slate-400" />
        }
    }

    const getMovementBadge = (type: string) => {
        switch (type) {
            case 'in': return <Badge className="bg-emerald-500/20 text-emerald-400 border-0">Giriş</Badge>
            case 'out': return <Badge className="bg-red-500/20 text-red-400 border-0">Çıkış</Badge>
            case 'transfer': return <Badge className="bg-blue-500/20 text-blue-400 border-0">Transfer</Badge>
            case 'adjustment': return <Badge className="bg-orange-500/20 text-orange-400 border-0">Düzeltme</Badge>
            default: return <Badge className="bg-slate-500/20 text-slate-400 border-0">{type}</Badge>
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const filteredMovements = movements.filter(m => {
        if (filter === 'all') return true
        return m.movement_type === filter
    })

    // Stats
    const totalIn = movements.filter(m => m.movement_type === 'in').reduce((sum, m) => sum + m.quantity, 0)
    const totalOut = movements.filter(m => m.movement_type === 'out').reduce((sum, m) => sum + m.quantity, 0)

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
                            <h1 className="text-lg font-bold text-white">Stok Hareketleri</h1>
                            <p className="text-xs text-slate-400">Giriş ve çıkış geçmişi</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6 max-w-4xl">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <Card className="bg-emerald-500/10 border-emerald-500/20">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{totalIn}</p>
                                <p className="text-xs text-slate-400">Toplam Giriş</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-red-500/10 border-red-500/20">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                                <TrendingDown className="w-5 h-5 text-red-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{totalOut}</p>
                                <p className="text-xs text-slate-400">Toplam Çıkış</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filter */}
                <Card className="bg-slate-800/50 border-slate-700/50 mb-6">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-slate-400">Filtre:</span>
                            <Select value={filter} onValueChange={(v) => setFilter(v as 'all' | 'in' | 'out')}>
                                <SelectTrigger className="w-40 bg-slate-700/50 border-slate-600 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-slate-700">
                                    <SelectItem value="all" className="text-white">Tümü</SelectItem>
                                    <SelectItem value="in" className="text-white">Sadece Giriş</SelectItem>
                                    <SelectItem value="out" className="text-white">Sadece Çıkış</SelectItem>
                                </SelectContent>
                            </Select>
                            <span className="text-sm text-slate-500 ml-auto">
                                {filteredMovements.length} hareket
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Movements List */}
                <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <History className="w-5 h-5 text-slate-400" />
                            Hareket Geçmişi
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            Son 100 stok hareketi
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {filteredMovements.length === 0 ? (
                            <div className="text-center py-12 text-slate-500">
                                <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>Henüz stok hareketi yok</p>
                                <p className="text-xs mt-1">Stok girişi veya çıkışı yaptığınızda burada görünecek</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filteredMovements.map((movement) => (
                                    <div
                                        key={movement.id}
                                        className={`p-4 rounded-lg border ${movement.movement_type === 'in'
                                                ? 'bg-emerald-500/5 border-emerald-500/20'
                                                : movement.movement_type === 'out'
                                                    ? 'bg-red-500/5 border-red-500/20'
                                                    : 'bg-slate-700/30 border-slate-600/30'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-start gap-3">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${movement.movement_type === 'in'
                                                        ? 'bg-emerald-500/20'
                                                        : movement.movement_type === 'out'
                                                            ? 'bg-red-500/20'
                                                            : 'bg-slate-600/50'
                                                    }`}>
                                                    {getMovementIcon(movement.movement_type)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white">
                                                        {movement.variant?.product?.name || 'Bilinmeyen Ürün'}
                                                    </p>
                                                    <p className="text-sm text-slate-400">
                                                        {movement.variant?.sku} • Beden: {movement.variant?.size}
                                                    </p>
                                                    <p className="text-xs text-slate-500 mt-1">
                                                        📍 {movement.location?.location_id || 'Bilinmeyen Konum'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                {getMovementBadge(movement.movement_type)}
                                                <p className={`text-lg font-bold mt-1 ${movement.movement_type === 'in'
                                                        ? 'text-emerald-400'
                                                        : movement.movement_type === 'out'
                                                            ? 'text-red-400'
                                                            : 'text-slate-300'
                                                    }`}>
                                                    {movement.movement_type === 'in' ? '+' : '-'}{movement.quantity}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {movement.previous_quantity} → {movement.new_quantity}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-700/50">
                                            <Calendar className="w-3 h-3 text-slate-500" />
                                            <span className="text-xs text-slate-500">
                                                {formatDate(movement.created_at)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
