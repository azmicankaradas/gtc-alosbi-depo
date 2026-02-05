'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    ArrowLeft,
    Loader2,
    Shirt,
    Footprints,
    Package,
    MapPin
} from 'lucide-react'
import { toast } from 'sonner'
import type { FloorType, Location, StockFullView } from '@/types/database'

interface LocationWithStock extends Location {
    stock_count: number
    total_quantity: number
    items: StockFullView[]
}

export default function LocationsPage() {
    const [locations, setLocations] = useState<LocationWithStock[]>([])
    const [stockData, setStockData] = useState<StockFullView[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedLocation, setSelectedLocation] = useState<LocationWithStock | null>(null)
    const [activeFloor, setActiveFloor] = useState<'floor_0' | 'floor_1'>('floor_0')
    const supabase = createClient()

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all locations
                const { data: locData } = await supabase
                    .from('locations')
                    .select('*')
                    .order('floor')
                    .order('shelf')
                    .order('column_label')
                    .order('cell')

                // Fetch stock data
                const { data: stockRes } = await supabase
                    .from('stock_full_view')
                    .select('*')

                const stock = (stockRes as StockFullView[]) || []
                setStockData(stock)

                // Merge locations with stock info (filter out zero quantity stocks)
                const locationsWithStock: LocationWithStock[] = (locData || []).map(loc => {
                    // Only include stocks with quantity > 0
                    const locStock = stock.filter(s => s.location_id === loc.id && s.quantity > 0)
                    return {
                        ...loc,
                        stock_count: locStock.length,
                        total_quantity: locStock.reduce((sum, s) => sum + s.quantity, 0),
                        items: locStock
                    }
                })

                setLocations(locationsWithStock)
            } catch (error) {
                console.error('Error fetching locations:', error)
                toast.error('Veri yüklenirken hata oluştu')
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [supabase])

    // Get locations for specific floor and shelf
    const getShelfLocations = (floor: FloorType, shelf: number) => {
        return locations.filter(l => l.floor === floor && l.shelf === shelf)
    }

    // Get cell color based on stock status
    const getCellStyle = (loc: LocationWithStock) => {
        if (loc.total_quantity === 0) {
            return 'bg-slate-700/30 border-slate-600/50 hover:bg-slate-700/50'
        }
        if (loc.items.some(i => i.low_stock)) {
            return 'bg-orange-500/20 border-orange-500/50 hover:bg-orange-500/30'
        }
        return 'bg-emerald-500/20 border-emerald-500/50 hover:bg-emerald-500/30'
    }

    // Raf 6 için F kolonu da var
    const getColumnsForShelf = (shelf: number): ('A' | 'B' | 'C' | 'D' | 'E' | 'F')[] => {
        if (shelf === 6) {
            return ['A', 'B', 'C', 'D', 'E', 'F']
        }
        return ['A', 'B', 'C', 'D', 'E']
    }
    const cells = [1, 2, 3]

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
                            <h1 className="text-lg font-bold text-white">Depo Yerleşim Planı</h1>
                            <p className="text-xs text-slate-400">Raf ve hücre görünümü</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6">
                {/* Floor Tabs */}
                <Tabs value={activeFloor} onValueChange={(v) => setActiveFloor(v as 'floor_0' | 'floor_1')}>
                    <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-slate-800/50 mb-6">
                        <TabsTrigger
                            value="floor_0"
                            className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white gap-2"
                        >
                            <Shirt className="w-4 h-4" />
                            Zemin Kat (Tekstil)
                        </TabsTrigger>
                        <TabsTrigger
                            value="floor_1"
                            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white gap-2"
                        >
                            <Footprints className="w-4 h-4" />
                            1. Kat (Ayakkabı)
                        </TabsTrigger>
                    </TabsList>

                    {/* Legend */}
                    <div className="flex flex-wrap justify-center gap-4 mb-6">
                        <div className="flex items-center gap-2 text-sm">
                            <div className="w-4 h-4 rounded bg-slate-700/50 border border-slate-600/50"></div>
                            <span className="text-slate-400">Boş</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <div className="w-4 h-4 rounded bg-emerald-500/30 border border-emerald-500/50"></div>
                            <span className="text-slate-400">Dolu</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <div className="w-4 h-4 rounded bg-orange-500/30 border border-orange-500/50"></div>
                            <span className="text-slate-400">Düşük Stok</span>
                        </div>
                    </div>

                    <TabsContent value="floor_0" className="space-y-6">
                        {/* Shelves for Floor 0 */}
                        {[1, 2, 3, 4, 5, 6].map(shelf => (
                            <ShelfGrid
                                key={`f0-s${shelf}`}
                                shelf={shelf}
                                locations={getShelfLocations('floor_0', shelf)}
                                columns={getColumnsForShelf(shelf)}
                                cells={cells}
                                getCellStyle={getCellStyle}
                                onCellClick={setSelectedLocation}
                                floorColor="emerald"
                            />
                        ))}
                    </TabsContent>

                    <TabsContent value="floor_1" className="space-y-6">
                        {/* Shelves for Floor 1 */}
                        {[1, 2, 3, 4, 5, 6].map(shelf => (
                            <ShelfGrid
                                key={`f1-s${shelf}`}
                                shelf={shelf}
                                locations={getShelfLocations('floor_1', shelf)}
                                columns={getColumnsForShelf(shelf)}
                                cells={cells}
                                getCellStyle={getCellStyle}
                                onCellClick={setSelectedLocation}
                                floorColor="blue"
                            />
                        ))}
                    </TabsContent>
                </Tabs>

                {/* Selected Location Details Modal */}
                {selectedLocation && (
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedLocation(null)}
                    >
                        <Card
                            className="w-full max-w-md bg-slate-800 border-slate-700"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <MapPin className="w-5 h-5 text-blue-400" />
                                        {selectedLocation.location_id}
                                    </CardTitle>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSelectedLocation(null)}
                                        className="text-slate-400"
                                    >
                                        ✕
                                    </Button>
                                </div>
                                <p className="text-sm text-slate-400">{selectedLocation.description}</p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {selectedLocation.items.length === 0 ? (
                                    <div className="text-center py-6 text-slate-500">
                                        <Package className="w-10 h-10 mx-auto mb-2 opacity-50" />
                                        <p>Bu hücrede ürün yok</p>
                                        <Link href="/stock/entry">
                                            <Button variant="outline" size="sm" className="mt-3">
                                                Stok Ekle
                                            </Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-400">Toplam Stok:</span>
                                            <Badge className="bg-emerald-500/20 text-emerald-400">
                                                {selectedLocation.total_quantity} adet
                                            </Badge>
                                        </div>
                                        <div className="border-t border-slate-700 pt-3 space-y-2">
                                            {selectedLocation.items.map(item => (
                                                <div
                                                    key={item.stock_id}
                                                    className={`p-3 rounded-lg ${item.low_stock ? 'bg-orange-500/10 border border-orange-500/30' : 'bg-slate-700/30'}`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="font-medium text-white text-sm">{item.product_name}</p>
                                                            <p className="text-xs text-slate-400">
                                                                {item.sku} • Beden: {item.size}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className={`font-bold ${item.low_stock ? 'text-orange-400' : 'text-emerald-400'}`}>
                                                                {item.quantity}
                                                            </p>
                                                            {item.low_stock && (
                                                                <span className="text-[10px] text-orange-400">Düşük</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}
            </main>
        </div>
    )
}

// Shelf Grid Component
interface ShelfGridProps {
    shelf: number
    locations: LocationWithStock[]
    columns: ('A' | 'B' | 'C' | 'D' | 'E' | 'F')[]
    cells: number[]
    getCellStyle: (loc: LocationWithStock) => string
    onCellClick: (loc: LocationWithStock) => void
    floorColor: 'emerald' | 'blue'
}

function ShelfGrid({ shelf, locations, columns, cells, getCellStyle, onCellClick, floorColor }: ShelfGridProps) {
    const getLocation = (col: string, cell: number) => {
        return locations.find(l => l.column_label === col && l.cell === cell)
    }

    const borderColor = floorColor === 'emerald' ? 'border-emerald-500/30' : 'border-blue-500/30'
    const bgColor = floorColor === 'emerald' ? 'bg-emerald-500/5' : 'bg-blue-500/5'
    const textColor = floorColor === 'emerald' ? 'text-emerald-400' : 'text-blue-400'

    return (
        <Card className={`${bgColor} ${borderColor} border`}>
            <CardHeader className="pb-2">
                <CardTitle className={`text-sm ${textColor}`}>
                    Raf {shelf}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[400px]">
                        <thead>
                            <tr>
                                <th className="w-12 text-xs text-slate-500 font-normal pb-2"></th>
                                {columns.map(col => (
                                    <th key={col} className="text-center text-xs text-slate-400 font-medium pb-2 px-1">
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {cells.map(cell => (
                                <tr key={cell}>
                                    <td className="text-xs text-slate-500 pr-2 py-1">{cell}</td>
                                    {columns.map(col => {
                                        const loc = getLocation(col, cell)
                                        if (!loc) return <td key={col}></td>

                                        return (
                                            <td key={col} className="p-0.5 sm:p-1">
                                                <button
                                                    onClick={() => onCellClick(loc)}
                                                    className={`w-full aspect-square min-w-[40px] sm:min-w-[50px] rounded-lg border-2 transition-all flex flex-col items-center justify-center ${getCellStyle(loc)}`}
                                                >
                                                    {loc.total_quantity > 0 ? (
                                                        <>
                                                            <span className="text-[10px] sm:text-xs font-bold text-white">{loc.total_quantity}</span>
                                                            <span className="text-[8px] sm:text-[9px] text-slate-400">adet</span>
                                                        </>
                                                    ) : (
                                                        <span className="text-[8px] sm:text-[10px] text-slate-500">boş</span>
                                                    )}
                                                </button>
                                            </td>
                                        )
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    )
}
