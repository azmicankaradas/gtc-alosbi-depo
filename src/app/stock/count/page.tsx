'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
    Loader2,
    ClipboardCheck,
    Play,
    CheckCircle2,
    AlertTriangle,
    ArrowUp,
    ArrowDown,
    Minus,
    Package,
    MapPin,
    FileText,
    RotateCcw
} from 'lucide-react'
import { toast } from 'sonner'
import { FLOOR_NAMES } from '@/types/database'
import type { FloorType } from '@/types/database'
import { useUserRole } from '@/lib/hooks/useUserRole'

// Step type for the wizard flow
type CountStep = 'setup' | 'counting' | 'review' | 'complete'

// Count item with stock details
interface CountItem {
    stock_id: string
    variant_id: string
    location_id: string
    product_name: string
    sku: string
    size: string
    location_code: string
    system_quantity: number
    counted_quantity: number | null
    brand: string | null
    model: string | null
}

export default function StockCountPage() {
    const router = useRouter()
    const { isAdmin, loading: roleLoading } = useUserRole()
    const [step, setStep] = useState<CountStep>('setup')
    const [isLoading, setIsLoading] = useState(false)

    // Setup state
    const [title, setTitle] = useState('')
    const [floorFilter, setFloorFilter] = useState<string>('all')
    const [shelfFilter, setShelfFilter] = useState<string>('all')

    // Count state
    const [countItems, setCountItems] = useState<CountItem[]>([])
    const [countId, setCountId] = useState<string | null>(null)

    // Summary
    const [summary, setSummary] = useState<{
        total: number
        counted: number
        matched: number
        surplus: number
        deficit: number
    }>({ total: 0, counted: 0, matched: 0, surplus: 0, deficit: 0 })

    const supabase = createClient()

    // Gözlemci kullanıcıları ana sayfaya yönlendir
    useEffect(() => {
        if (!roleLoading && !isAdmin) {
            router.push('/')
        }
    }, [isAdmin, roleLoading, router])

    // Start counting session
    const handleStartCount = async () => {
        if (!title.trim()) {
            toast.error('Lütfen sayım başlığı girin')
            return
        }

        setIsLoading(true)
        try {
            // Create count session
            const { data: { user } } = await supabase.auth.getUser()

            const { data: countData, error: countError } = await supabase
                .from('stock_counts')
                .insert({
                    title: title.trim(),
                    floor_filter: floorFilter !== 'all' ? floorFilter : null,
                    shelf_filter: shelfFilter !== 'all' ? parseInt(shelfFilter) : null,
                    started_by: user?.id || null,
                })
                .select()
                .single()

            if (countError) throw countError

            setCountId(countData.id)

            // Fetch stock items based on filters
            let query = supabase
                .from('stock_full_view')
                .select('*')
                .gt('quantity', 0)
                .order('location_code')

            if (floorFilter !== 'all') {
                query = query.eq('floor', floorFilter)
            }
            if (shelfFilter !== 'all') {
                query = query.eq('shelf', parseInt(shelfFilter))
            }

            const { data: stockData, error: stockError } = await query

            if (stockError) throw stockError

            const items: CountItem[] = (stockData || []).map((s: any) => ({
                stock_id: s.stock_id,
                variant_id: s.variant_id,
                location_id: s.location_id,
                product_name: s.product_name,
                sku: s.sku,
                size: s.size,
                location_code: s.location_code,
                system_quantity: s.quantity,
                counted_quantity: null,
                brand: s.brand,
                model: s.model,
            }))

            if (items.length === 0) {
                toast.error('Seçilen filtrelerde stok bulunamadı')
                // Clean up the empty count
                await supabase.from('stock_counts').delete().eq('id', countData.id)
                setIsLoading(false)
                return
            }

            // Insert count items
            const { error: itemsError } = await supabase
                .from('stock_count_items')
                .insert(items.map(item => ({
                    count_id: countData.id,
                    stock_id: item.stock_id,
                    variant_id: item.variant_id,
                    location_id: item.location_id,
                    system_quantity: item.system_quantity,
                    counted_quantity: null,
                    difference: null,
                })))

            if (itemsError) throw itemsError

            setCountItems(items)
            setStep('counting')
            toast.success(`Sayım başlatıldı: ${items.length} kalem`)
        } catch (error: any) {
            console.error('Start count error:', error)
            toast.error('Sayım başlatılırken hata', { description: error.message })
        } finally {
            setIsLoading(false)
        }
    }

    // Update counted quantity for an item
    const handleUpdateQuantity = (index: number, value: string) => {
        const updated = [...countItems]
        if (value === '') {
            updated[index].counted_quantity = null
        } else {
            const num = parseInt(value)
            if (!isNaN(num) && num >= 0) {
                updated[index].counted_quantity = num
            }
        }
        setCountItems(updated)
    }

    // Calculate summary
    const calculateSummary = () => {
        let counted = 0, matched = 0, surplus = 0, deficit = 0
        countItems.forEach(item => {
            if (item.counted_quantity !== null) {
                counted++
                const diff = item.counted_quantity - item.system_quantity
                if (diff === 0) matched++
                else if (diff > 0) surplus++
                else deficit++
            }
        })
        setSummary({
            total: countItems.length,
            counted,
            matched,
            surplus,
            deficit
        })
    }

    // Go to review step
    const handleReview = () => {
        const uncounted = countItems.filter(i => i.counted_quantity === null).length
        if (uncounted > 0) {
            const proceed = confirm(`${uncounted} kalem henüz sayılmadı. Devam etmek istiyor musunuz?`)
            if (!proceed) return
        }
        calculateSummary()
        setStep('review')
    }

    // Complete the count
    const handleComplete = async () => {
        if (!countId) return

        setIsLoading(true)
        try {
            // Update count items with counted quantities
            for (const item of countItems) {
                if (item.counted_quantity !== null) {
                    const diff = item.counted_quantity - item.system_quantity
                    await supabase
                        .from('stock_count_items')
                        .update({
                            counted_quantity: item.counted_quantity,
                            difference: diff,
                            counted_at: new Date().toISOString(),
                        })
                        .eq('count_id', countId)
                        .eq('stock_id', item.stock_id)
                }
            }

            // Mark count session as completed
            await supabase
                .from('stock_counts')
                .update({
                    status: 'completed',
                    completed_at: new Date().toISOString(),
                })
                .eq('id', countId)

            setStep('complete')
            toast.success('Sayım tamamlandı!')
        } catch (error: any) {
            toast.error('Sayım tamamlanırken hata', { description: error.message })
        } finally {
            setIsLoading(false)
        }
    }

    // Start new count
    const handleNewCount = () => {
        setStep('setup')
        setTitle('')
        setFloorFilter('all')
        setShelfFilter('all')
        setCountItems([])
        setCountId(null)
        setSummary({ total: 0, counted: 0, matched: 0, surplus: 0, deficit: 0 })
    }

    // Get difference badge
    const getDiffBadge = (item: CountItem) => {
        if (item.counted_quantity === null) {
            return <Badge className="bg-slate-500/20 text-slate-400">Sayılmadı</Badge>
        }
        const diff = item.counted_quantity - item.system_quantity
        if (diff === 0) {
            return <Badge className="bg-emerald-500/20 text-emerald-400"><Minus className="w-3 h-3 mr-1" />Eşit</Badge>
        }
        if (diff > 0) {
            return <Badge className="bg-blue-500/20 text-blue-400"><ArrowUp className="w-3 h-3 mr-1" />+{diff}</Badge>
        }
        return <Badge className="bg-red-500/20 text-red-400"><ArrowDown className="w-3 h-3 mr-1" />{diff}</Badge>
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
                        <div className="flex-1">
                            <h1 className="text-lg font-bold text-white">Stok Sayım</h1>
                            <p className="text-xs text-slate-400">Dönemsel envanter sayımı</p>
                        </div>
                        {/* Step indicator */}
                        <div className="flex items-center gap-1">
                            {(['setup', 'counting', 'review', 'complete'] as CountStep[]).map((s, i) => (
                                <div key={s} className={`w-2 h-2 rounded-full transition-colors ${s === step ? 'bg-indigo-400 w-4' :
                                        (['setup', 'counting', 'review', 'complete'].indexOf(step) > i ? 'bg-indigo-400/50' : 'bg-slate-600')
                                    }`} />
                            ))}
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6 max-w-2xl">

                {/* STEP 1: Setup */}
                {step === 'setup' && (
                    <div className="space-y-6">
                        <Card className="bg-indigo-500/5 border-indigo-500/20">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <ClipboardCheck className="w-5 h-5 text-indigo-400" />
                                    Yeni Sayım Başlat
                                </CardTitle>
                                <CardDescription className="text-slate-400">
                                    Sayım parametrelerini belirleyin ve başlatın
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Title */}
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Sayım Başlığı</Label>
                                    <Input
                                        type="text"
                                        placeholder="Örn: Mart 2026 Dönem Sonu Sayımı"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                                    />
                                </div>

                                {/* Floor filter */}
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Kat Filtresi</Label>
                                    <Select value={floorFilter} onValueChange={setFloorFilter}>
                                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-800 border-slate-700">
                                            <SelectItem value="all" className="text-white">Tüm Katlar</SelectItem>
                                            <SelectItem value="floor_0" className="text-white">Zemin Kat (Tekstil)</SelectItem>
                                            <SelectItem value="floor_1" className="text-white">1. Kat (Ayakkabı)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Shelf filter */}
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Raf Filtresi</Label>
                                    <Select value={shelfFilter} onValueChange={setShelfFilter}>
                                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-800 border-slate-700">
                                            <SelectItem value="all" className="text-white">Tüm Raflar</SelectItem>
                                            {[1, 2, 3, 4, 5, 6].map(n => (
                                                <SelectItem key={n} value={String(n)} className="text-white">
                                                    Raf {n}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Start Button */}
                                <Button
                                    onClick={handleStartCount}
                                    disabled={isLoading || !title.trim()}
                                    className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-lg shadow-indigo-500/25"
                                >
                                    {isLoading ? (
                                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Başlatılıyor...</>
                                    ) : (
                                        <><Play className="mr-2 h-4 w-4" /> Sayımı Başlat</>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* STEP 2: Counting */}
                {step === 'counting' && (
                    <div className="space-y-4">
                        {/* Progress */}
                        <Card className="bg-slate-800/50 border-slate-700/50">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-slate-400">İlerleme</span>
                                    <span className="text-sm font-medium text-white">
                                        {countItems.filter(i => i.counted_quantity !== null).length} / {countItems.length}
                                    </span>
                                </div>
                                <div className="w-full bg-slate-700 rounded-full h-2">
                                    <div
                                        className="bg-indigo-500 h-2 rounded-full transition-all"
                                        style={{
                                            width: `${countItems.length > 0 ? (countItems.filter(i => i.counted_quantity !== null).length / countItems.length) * 100 : 0}%`
                                        }}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Count Items */}
                        {countItems.map((item, index) => (
                            <Card key={item.stock_id} className={`border transition-colors ${item.counted_quantity !== null
                                    ? 'bg-emerald-500/5 border-emerald-500/20'
                                    : 'bg-slate-800/50 border-slate-700/50'
                                }`}>
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <MapPin className="w-3 h-3 text-blue-400 shrink-0" />
                                                <span className="text-xs font-mono text-blue-400">{item.location_code}</span>
                                            </div>
                                            <p className="font-medium text-white text-sm truncate">{item.product_name}</p>
                                            <p className="text-xs text-slate-400">
                                                {item.brand && `${item.brand} • `}Beden: {item.size}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1">
                                                Sistem: <span className="font-semibold text-slate-300">{item.system_quantity}</span> adet
                                            </p>
                                        </div>
                                        <div className="shrink-0 w-24">
                                            <Input
                                                type="text"
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                                placeholder="Fiili"
                                                value={item.counted_quantity !== null ? String(item.counted_quantity) : ''}
                                                onChange={(e) => {
                                                    const val = e.target.value
                                                    if (val === '' || /^\d+$/.test(val)) {
                                                        handleUpdateQuantity(index, val)
                                                    }
                                                }}
                                                className={`bg-slate-700/50 border-slate-600 text-white text-center h-10 ${item.counted_quantity !== null && item.counted_quantity !== item.system_quantity
                                                        ? 'border-amber-500/50'
                                                        : ''
                                                    }`}
                                            />
                                            {item.counted_quantity !== null && (
                                                <div className="mt-1 text-center">
                                                    {getDiffBadge(item)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {/* Review Button */}
                        <Card className="bg-slate-800/50 border-slate-700/50 sticky bottom-20 md:bottom-4">
                            <CardContent className="p-4">
                                <Button
                                    onClick={handleReview}
                                    className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white"
                                >
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Sayımı Gözden Geçir
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* STEP 3: Review */}
                {step === 'review' && (
                    <div className="space-y-4">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-2 gap-3">
                            <Card className="bg-slate-800/50 border-slate-700/50">
                                <CardContent className="p-3 text-center">
                                    <p className="text-2xl font-bold text-white">{summary.counted}</p>
                                    <p className="text-xs text-slate-400">Sayılan / {summary.total}</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-emerald-500/10 border-emerald-500/20">
                                <CardContent className="p-3 text-center">
                                    <p className="text-2xl font-bold text-emerald-400">{summary.matched}</p>
                                    <p className="text-xs text-slate-400">Eşleşen</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-blue-500/10 border-blue-500/20">
                                <CardContent className="p-3 text-center">
                                    <p className="text-2xl font-bold text-blue-400">{summary.surplus}</p>
                                    <p className="text-xs text-slate-400">Fazla</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-red-500/10 border-red-500/20">
                                <CardContent className="p-3 text-center">
                                    <p className="text-2xl font-bold text-red-400">{summary.deficit}</p>
                                    <p className="text-xs text-slate-400">Eksik</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Discrepancy List */}
                        <Card className="bg-slate-800/50 border-slate-700/50">
                            <CardHeader>
                                <CardTitle className="text-white text-base flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                                    Fark Raporu
                                </CardTitle>
                                <CardDescription className="text-slate-400">
                                    Sistem ile fiili miktar arasındaki farklar
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {countItems
                                    .filter(i => i.counted_quantity !== null && i.counted_quantity !== i.system_quantity)
                                    .map(item => (
                                        <div key={item.stock_id} className="flex items-center justify-between p-3 border border-slate-700/30 rounded-lg">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-white truncate">{item.product_name}</p>
                                                <p className="text-xs text-slate-400">
                                                    {item.location_code} • Beden: {item.size}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    Sistem: {item.system_quantity} → Fiili: {item.counted_quantity}
                                                </p>
                                            </div>
                                            <div className="shrink-0 ml-3">
                                                {getDiffBadge(item)}
                                            </div>
                                        </div>
                                    ))
                                }
                                {countItems.filter(i => i.counted_quantity !== null && i.counted_quantity !== i.system_quantity).length === 0 && (
                                    <div className="text-center py-6 text-slate-500">
                                        <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-emerald-400/50" />
                                        <p>Tüm sayımlar eşleşiyor!</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setStep('counting')}
                                className="border-slate-600 text-slate-300 hover:bg-slate-800"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Geri Dön
                            </Button>
                            <Button
                                onClick={handleComplete}
                                disabled={isLoading}
                                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
                            >
                                {isLoading ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Kaydediliyor...</>
                                ) : (
                                    <><CheckCircle2 className="mr-2 h-4 w-4" /> Sayımı Tamamla</>
                                )}
                            </Button>
                        </div>
                    </div>
                )}

                {/* STEP 4: Complete */}
                {step === 'complete' && (
                    <div className="space-y-6">
                        <Card className="bg-emerald-500/10 border-emerald-500/30">
                            <CardHeader className="text-center pb-2">
                                <div className="mx-auto w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                                </div>
                                <CardTitle className="text-white text-xl">Sayım Tamamlandı!</CardTitle>
                                <CardDescription className="text-slate-300">
                                    {title}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 bg-slate-800/50 rounded-xl space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Toplam Kalem:</span>
                                        <span className="text-white font-medium">{summary.total}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Sayılan:</span>
                                        <span className="text-white font-medium">{summary.counted}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Eşleşen:</span>
                                        <span className="text-emerald-400 font-medium">{summary.matched}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Fazla:</span>
                                        <span className="text-blue-400 font-medium">{summary.surplus}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Eksik:</span>
                                        <span className="text-red-400 font-medium">{summary.deficit}</span>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleNewCount}
                                    className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white"
                                >
                                    <RotateCcw className="mr-2 h-4 w-4" />
                                    Yeni Sayım Başlat
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </main>
        </div>
    )
}
