'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
    Calendar,
    User,
    Search,
    X,
    FileText,
    Package2
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
    requester_name: string | null
    document_code: string | null
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
    const [typeFilter, setTypeFilter] = useState<'all' | 'in' | 'out'>('all')
    const [userFilter, setUserFilter] = useState<string>('all')
    const [requesterFilter, setRequesterFilter] = useState<string>('all')
    const [productSearch, setProductSearch] = useState('')
    const [dateFrom, setDateFrom] = useState('')
    const [dateTo, setDateTo] = useState('')
    const [userProfiles, setUserProfiles] = useState<Record<string, string>>({})
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
                .limit(500)

            if (error) throw error
            setMovements(data || [])

            // Kullanıcı profillerini çek
            const userIds = [...new Set((data || []).map(m => m.user_id).filter(Boolean))] as string[]
            if (userIds.length > 0) {
                const { data: profiles } = await supabase
                    .from('user_profiles')
                    .select('id, email, full_name')
                    .in('id', userIds)
                const profileMap: Record<string, string> = {}
                profiles?.forEach(p => {
                    profileMap[p.id] = p.full_name || p.email || 'Bilinmeyen'
                })
                setUserProfiles(profileMap)
            }
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

    // Benzersiz talep edenleri al
    const uniqueRequesters = useMemo(() => {
        return [...new Set(movements.map(m => m.requester_name).filter(Boolean))] as string[]
    }, [movements])

    // Benzersiz kullanıcıları al (filtre için)
    const uniqueUsers = [...new Set(movements.map(m => m.user_id).filter(Boolean))] as string[]

    // Filtreleme mantığı
    const filteredMovements = useMemo(() => {
        const searchWords = productSearch.trim().toLowerCase().split(/\s+/).filter(Boolean)

        return movements.filter(m => {
            // Tür filtresi
            if (typeFilter !== 'all' && m.movement_type !== typeFilter) return false

            // Kullanıcı filtresi
            if (userFilter !== 'all' && m.user_id !== userFilter) return false

            // Talep eden filtresi
            if (requesterFilter !== 'all' && m.requester_name !== requesterFilter) return false

            // Tarih başlangıç
            if (dateFrom) {
                const movDate = new Date(m.created_at)
                const fromDate = new Date(dateFrom)
                fromDate.setHours(0, 0, 0, 0)
                if (movDate < fromDate) return false
            }

            // Tarih bitiş
            if (dateTo) {
                const movDate = new Date(m.created_at)
                const toDate = new Date(dateTo)
                toDate.setHours(23, 59, 59, 999)
                if (movDate > toDate) return false
            }

            // Ürün arama (kelime sırası bağımsız, AND mantığı)
            if (searchWords.length > 0) {
                const combined = [
                    m.variant?.sku,
                    m.variant?.product?.name,
                    m.variant?.size,
                    m.location?.location_id,
                    m.requester_name,
                    m.document_code,
                    m.notes
                ].filter(Boolean).join(' ').toLowerCase()

                return searchWords.every(word => combined.includes(word))
            }

            return true
        })
    }, [movements, typeFilter, userFilter, requesterFilter, dateFrom, dateTo, productSearch])

    // İstatistikler (tüm veri üzerinden)
    const totalIn = movements.filter(m => m.movement_type === 'in').reduce((sum, m) => sum + m.quantity, 0)
    const totalOut = movements.filter(m => m.movement_type === 'out').reduce((sum, m) => sum + m.quantity, 0)

    // Bu ayki istatistikler
    const now = new Date()
    const thisMonthMovements = movements.filter(m => {
        const d = new Date(m.created_at)
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
    const monthIn = thisMonthMovements.filter(m => m.movement_type === 'in').reduce((sum, m) => sum + m.quantity, 0)
    const monthOut = thisMonthMovements.filter(m => m.movement_type === 'out').reduce((sum, m) => sum + m.quantity, 0)

    const hasActiveFilters = typeFilter !== 'all' || userFilter !== 'all' || requesterFilter !== 'all' || dateFrom || dateTo || productSearch

    const clearFilters = () => {
        setTypeFilter('all')
        setUserFilter('all')
        setRequesterFilter('all')
        setDateFrom('')
        setDateTo('')
        setProductSearch('')
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
                            <h1 className="text-lg font-bold text-white">Stok Hareketleri</h1>
                            <p className="text-xs text-slate-400">Giriş ve çıkış geçmişi</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6 max-w-4xl">
                {/* Stats - 4 kart */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    <Card className="bg-emerald-500/10 border-emerald-500/20">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center shrink-0">
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
                            <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center shrink-0">
                                <TrendingDown className="w-5 h-5 text-red-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{totalOut}</p>
                                <p className="text-xs text-slate-400">Toplam Çıkış</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-blue-500/10 border-blue-500/20">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center shrink-0">
                                <TrendingUp className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{monthIn}</p>
                                <p className="text-xs text-slate-400">Bu Ay Giriş</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-orange-500/10 border-orange-500/20">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center shrink-0">
                                <TrendingDown className="w-5 h-5 text-orange-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{monthOut}</p>
                                <p className="text-xs text-slate-400">Bu Ay Çıkış</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="bg-slate-800/50 border-slate-700/50 mb-6">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-white text-base flex items-center gap-2">
                                <Search className="w-4 h-4 text-slate-400" />
                                Filtrele
                            </CardTitle>
                            {hasActiveFilters && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearFilters}
                                    className="text-slate-400 hover:text-white text-xs h-7"
                                >
                                    <X className="w-3 h-3 mr-1" />
                                    Temizle
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {/* Ürün Arama */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                type="text"
                                placeholder="Ürün adı, SKU, beden, fiş no veya talep eden ara..."
                                value={productSearch}
                                onChange={(e) => setProductSearch(e.target.value)}
                                className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Diğer filtreler */}
                        <div className="flex flex-wrap gap-3">
                            {/* Hareket türü */}
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-400 whitespace-nowrap">Tür:</span>
                                <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as 'all' | 'in' | 'out')}>
                                    <SelectTrigger className="w-36 bg-slate-700/50 border-slate-600 text-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-slate-700">
                                        <SelectItem value="all" className="text-white">Tümü</SelectItem>
                                        <SelectItem value="in" className="text-white">Sadece Giriş</SelectItem>
                                        <SelectItem value="out" className="text-white">Sadece Çıkış</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Kullanıcı */}
                            {uniqueUsers.length > 0 && (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-slate-400 whitespace-nowrap">Kullanıcı:</span>
                                    <Select value={userFilter} onValueChange={setUserFilter}>
                                        <SelectTrigger className="w-44 bg-slate-700/50 border-slate-600 text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-800 border-slate-700">
                                            <SelectItem value="all" className="text-white">Tüm Kullanıcılar</SelectItem>
                                            {uniqueUsers.map(uid => (
                                                <SelectItem key={uid} value={uid} className="text-white">
                                                    {userProfiles[uid] || uid.slice(0, 8)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {/* Talep eden */}
                            {uniqueRequesters.length > 0 && (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-slate-400 whitespace-nowrap">Talep Eden:</span>
                                    <Select value={requesterFilter} onValueChange={setRequesterFilter}>
                                        <SelectTrigger className="w-44 bg-slate-700/50 border-slate-600 text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-800 border-slate-700">
                                            <SelectItem value="all" className="text-white">Tümü</SelectItem>
                                            {uniqueRequesters.map(name => (
                                                <SelectItem key={name} value={name} className="text-white">
                                                    {name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>

                        {/* Tarih Aralığı */}
                        <div className="flex flex-wrap items-center gap-3">
                            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-400">Başlangıç:</span>
                                <input
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                    className="bg-slate-700/50 border border-slate-600 text-white rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-400">Bitiş:</span>
                                <input
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                    className="bg-slate-700/50 border border-slate-600 text-white rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="text-sm text-slate-500">
                            {filteredMovements.length} / {movements.length} hareket gösteriliyor
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
                            Son 500 stok hareketi
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {filteredMovements.length === 0 ? (
                            <div className="text-center py-12 text-slate-500">
                                <Package2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>Hareket bulunamadı</p>
                                <p className="text-xs mt-1">Filtrelerinizi değiştirmeyi deneyin</p>
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
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${movement.movement_type === 'in'
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

                                            <div className="text-right shrink-0">
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

                                        {/* Alt bilgi satırı */}
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 pt-3 border-t border-slate-700/50">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3 text-slate-500" />
                                                <span className="text-xs text-slate-500">
                                                    {formatDate(movement.created_at)}
                                                </span>
                                            </div>

                                            {movement.user_id && userProfiles[movement.user_id] && (
                                                <>
                                                    <span className="text-xs text-slate-600">•</span>
                                                    <div className="flex items-center gap-1">
                                                        <User className="w-3 h-3 text-slate-500" />
                                                        <span className="text-xs text-slate-400">
                                                            {userProfiles[movement.user_id]}
                                                        </span>
                                                    </div>
                                                </>
                                            )}

                                            {movement.requester_name && (
                                                <>
                                                    <span className="text-xs text-slate-600">•</span>
                                                    <div className="flex items-center gap-1">
                                                        <Package2 className="w-3 h-3 text-slate-500" />
                                                        <span className="text-xs text-blue-400">
                                                            Talep: {movement.requester_name}
                                                        </span>
                                                    </div>
                                                </>
                                            )}

                                            {movement.document_code && (
                                                <>
                                                    <span className="text-xs text-slate-600">•</span>
                                                    <div className="flex items-center gap-1">
                                                        <FileText className="w-3 h-3 text-slate-500" />
                                                        <span className="text-xs font-mono text-orange-400">
                                                            {movement.document_code}
                                                        </span>
                                                    </div>
                                                </>
                                            )}
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
