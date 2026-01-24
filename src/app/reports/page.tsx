'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
    ArrowLeft,
    Loader2,
    FileText,
    Download,
    Printer,
    Package,
    AlertTriangle,
    LayoutGrid
} from 'lucide-react'
import { toast } from 'sonner'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { StockFullView } from '@/types/database'

type ReportType = 'all_stock' | 'low_stock' | 'textile' | 'shoes' | 'by_location'

export default function ReportsPage() {
    const [stockData, setStockData] = useState<StockFullView[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isGenerating, setIsGenerating] = useState(false)
    const [reportType, setReportType] = useState<ReportType>('all_stock')
    const supabase = createClient()

    useEffect(() => {
        fetchStockData()
    }, [])

    const fetchStockData = async () => {
        try {
            const { data } = await supabase
                .from('stock_full_view')
                .select('*')
                .order('product_group')
                .order('product_name')
                .order('size')

            setStockData((data as StockFullView[]) || [])
        } catch (error) {
            toast.error('Veriler yüklenirken hata oluştu')
        } finally {
            setIsLoading(false)
        }
    }

    const getFilteredData = () => {
        switch (reportType) {
            case 'low_stock':
                return stockData.filter(s => s.low_stock)
            case 'textile':
                return stockData.filter(s => s.product_group === 'textile')
            case 'shoes':
                return stockData.filter(s => s.product_group === 'shoes')
            default:
                return stockData
        }
    }

    const generatePDF = () => {
        setIsGenerating(true)

        try {
            const doc = new jsPDF()
            const filteredData = getFilteredData()
            const now = new Date()
            const dateStr = now.toLocaleDateString('tr-TR')
            const timeStr = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })

            // Header
            doc.setFontSize(20)
            doc.setTextColor(16, 185, 129) // Emerald color
            doc.text('GTC Endustriyel', 14, 20)

            doc.setFontSize(12)
            doc.setTextColor(100)
            doc.text('Alosbi Depo Stok Raporu', 14, 28)

            doc.setFontSize(10)
            doc.setTextColor(150)
            doc.text(`Tarih: ${dateStr} ${timeStr}`, 14, 35)

            // Report title
            doc.setFontSize(14)
            doc.setTextColor(0)
            const reportTitles: Record<ReportType, string> = {
                'all_stock': 'Tum Stok Listesi',
                'low_stock': 'Dusuk Stok Raporu',
                'textile': 'Tekstil Urunleri',
                'shoes': 'Ayakkabi Urunleri',
                'by_location': 'Konuma Gore Stok'
            }
            doc.text(reportTitles[reportType], 14, 45)

            // Summary
            const totalItems = filteredData.length
            const totalQuantity = filteredData.reduce((sum, s) => sum + s.quantity, 0)
            const lowStockCount = filteredData.filter(s => s.low_stock).length

            doc.setFontSize(10)
            doc.setTextColor(100)
            doc.text(`Toplam Kayit: ${totalItems} | Toplam Adet: ${totalQuantity} | Dusuk Stok: ${lowStockCount}`, 14, 52)

            // Table data
            let tableData: (string | number)[][] = []

            if (reportType === 'by_location') {
                // Group by location
                const byLocation = filteredData.reduce((acc, item) => {
                    const loc = item.location_code
                    if (!acc[loc]) acc[loc] = []
                    acc[loc].push(item)
                    return acc
                }, {} as Record<string, StockFullView[]>)

                tableData = Object.entries(byLocation).flatMap(([loc, items]) =>
                    items.map((item, idx) => [
                        idx === 0 ? loc : '',
                        item.product_name,
                        item.sku,
                        item.size,
                        item.quantity,
                        item.low_stock ? 'DUSUK' : 'Normal'
                    ])
                )

                autoTable(doc, {
                    startY: 58,
                    head: [['Konum', 'Urun', 'SKU', 'Beden', 'Adet', 'Durum']],
                    body: tableData,
                    theme: 'striped',
                    headStyles: {
                        fillColor: [16, 185, 129],
                        textColor: [255, 255, 255]
                    },
                    alternateRowStyles: { fillColor: [245, 245, 245] },
                    styles: { fontSize: 8, cellPadding: 2 },
                    columnStyles: {
                        0: { fontStyle: 'bold' },
                        4: { halign: 'center' },
                        5: { halign: 'center' }
                    }
                })
            } else {
                tableData = filteredData.map(item => [
                    item.product_name,
                    item.sku,
                    item.size,
                    item.location_code,
                    item.quantity,
                    item.min_quantity,
                    item.low_stock ? 'DUSUK' : 'Normal'
                ])

                autoTable(doc, {
                    startY: 58,
                    head: [['Urun Adi', 'SKU', 'Beden', 'Konum', 'Adet', 'Min', 'Durum']],
                    body: tableData,
                    theme: 'striped',
                    headStyles: {
                        fillColor: [16, 185, 129],
                        textColor: [255, 255, 255]
                    },
                    alternateRowStyles: { fillColor: [245, 245, 245] },
                    styles: { fontSize: 8, cellPadding: 2 },
                    columnStyles: {
                        4: { halign: 'center' },
                        5: { halign: 'center' },
                        6: { halign: 'center' }
                    },
                    didParseCell: (data) => {
                        // Highlight low stock cells
                        if (data.column.index === 6 && data.cell.raw === 'DUSUK') {
                            data.cell.styles.textColor = [239, 68, 68]
                            data.cell.styles.fontStyle = 'bold'
                        }
                    }
                })
            }

            // Footer
            const pageCount = doc.getNumberOfPages()
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i)
                doc.setFontSize(8)
                doc.setTextColor(150)
                doc.text(
                    `Sayfa ${i} / ${pageCount} - GTC Endustriyel Alosbi Depo`,
                    doc.internal.pageSize.width / 2,
                    doc.internal.pageSize.height - 10,
                    { align: 'center' }
                )
            }

            // Save
            const fileName = `stok_raporu_${reportType}_${dateStr.replace(/\./g, '-')}.pdf`
            doc.save(fileName)

            toast.success('PDF Raporu Oluşturuldu', {
                description: fileName
            })
        } catch (error) {
            console.error('PDF generation error:', error)
            toast.error('PDF oluşturulurken hata oluştu')
        } finally {
            setIsGenerating(false)
        }
    }

    const reportOptions = [
        { value: 'all_stock', label: 'Tüm Stok Listesi', icon: Package, count: stockData.length },
        { value: 'low_stock', label: 'Düşük Stok Raporu', icon: AlertTriangle, count: stockData.filter(s => s.low_stock).length },
        { value: 'textile', label: 'Tekstil Ürünleri', icon: Package, count: stockData.filter(s => s.product_group === 'textile').length },
        { value: 'shoes', label: 'Ayakkabı Ürünleri', icon: Package, count: stockData.filter(s => s.product_group === 'shoes').length },
        { value: 'by_location', label: 'Konuma Göre Stok', icon: LayoutGrid, count: stockData.length },
    ]

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
                            <h1 className="text-lg font-bold text-white">Raporlar</h1>
                            <p className="text-xs text-slate-400">PDF rapor oluştur ve indir</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6 max-w-2xl">
                {/* Report Type Selection */}
                <Card className="bg-slate-800/50 border-slate-700/50 mb-6">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <FileText className="w-5 h-5 text-emerald-400" />
                            Rapor Türü Seçin
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            İndirmek istediğiniz rapor türünü seçin
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {reportOptions.map((option) => {
                            const Icon = option.icon
                            const isSelected = reportType === option.value

                            return (
                                <button
                                    key={option.value}
                                    onClick={() => setReportType(option.value as ReportType)}
                                    className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${isSelected
                                            ? 'border-emerald-500 bg-emerald-500/10'
                                            : 'border-slate-600 hover:border-slate-500 bg-slate-700/30'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon className={`w-5 h-5 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                                        <span className="font-medium text-white">{option.label}</span>
                                    </div>
                                    <span className={`text-sm ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`}>
                                        {option.count} kayıt
                                    </span>
                                </button>
                            )
                        })}
                    </CardContent>
                </Card>

                {/* Preview Info */}
                <Card className="bg-slate-800/50 border-slate-700/50 mb-6">
                    <CardHeader>
                        <CardTitle className="text-white text-sm">Rapor Önizleme</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="p-3 bg-slate-700/30 rounded-lg">
                                <p className="text-2xl font-bold text-white">{getFilteredData().length}</p>
                                <p className="text-xs text-slate-400">Kayıt</p>
                            </div>
                            <div className="p-3 bg-slate-700/30 rounded-lg">
                                <p className="text-2xl font-bold text-emerald-400">
                                    {getFilteredData().reduce((sum, s) => sum + s.quantity, 0)}
                                </p>
                                <p className="text-xs text-slate-400">Toplam Adet</p>
                            </div>
                            <div className="p-3 bg-slate-700/30 rounded-lg">
                                <p className="text-2xl font-bold text-orange-400">
                                    {getFilteredData().filter(s => s.low_stock).length}
                                </p>
                                <p className="text-xs text-slate-400">Düşük Stok</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Generate Button */}
                <Button
                    onClick={generatePDF}
                    disabled={isGenerating || getFilteredData().length === 0}
                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/25 py-6"
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            PDF Oluşturuluyor...
                        </>
                    ) : (
                        <>
                            <Download className="mr-2 h-5 w-5" />
                            PDF Rapor İndir
                        </>
                    )}
                </Button>

                {getFilteredData().length === 0 && (
                    <p className="text-center text-slate-500 text-sm mt-4">
                        Bu kategoride kayıt bulunamadı
                    </p>
                )}
            </main>
        </div>
    )
}
