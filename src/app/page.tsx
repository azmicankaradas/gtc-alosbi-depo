'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Warehouse,
  Package,
  Search,
  Plus,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  LogOut,
  Shirt,
  Footprints,
  Loader2,
  RefreshCw,
  Building2,
  LayoutGrid
} from 'lucide-react'
import { toast } from 'sonner'
import type { StockSummary, StockFullView } from '@/types/database'

interface DashboardStats {
  totalProducts: number
  totalVariants: number
  totalStock: number
  lowStockCount: number
  textileCount: number
  shoesCount: number
  locationsFilled: number
  totalLocations: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentStock, setRecentStock] = useState<StockFullView[]>([])
  const [lowStockItems, setLowStockItems] = useState<StockFullView[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const fetchDashboardData = useCallback(async () => {
    try {
      // Fetch products count
      const { count: productCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)

      // Fetch variants count
      const { count: variantCount } = await supabase
        .from('variants')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)

      // Fetch total stock quantity
      const { data: stockData } = await supabase
        .from('stock')
        .select('quantity')

      const totalStock = stockData?.reduce((sum, item) => sum + item.quantity, 0) || 0

      // Fetch low stock count
      const { data: lowStockData } = await supabase
        .from('stock')
        .select('quantity, min_quantity')

      const lowStockCount = lowStockData?.filter(item => item.quantity <= item.min_quantity).length || 0

      // Fetch textile vs shoes product counts
      const { count: textileCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('product_group', 'textile')

      const { count: shoesCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('product_group', 'shoes')

      // Fetch locations stats
      const { count: totalLocations } = await supabase
        .from('locations')
        .select('*', { count: 'exact', head: true })

      const { data: filledLocations } = await supabase
        .from('stock')
        .select('location_id')

      const uniqueFilledLocations = new Set(filledLocations?.map(s => s.location_id) || [])

      setStats({
        totalProducts: productCount || 0,
        totalVariants: variantCount || 0,
        totalStock,
        lowStockCount,
        textileCount: textileCount || 0,
        shoesCount: shoesCount || 0,
        locationsFilled: uniqueFilledLocations.size,
        totalLocations: totalLocations || 180
      })

      // Fetch recent stock entries from stock_full_view
      const { data: recent } = await supabase
        .from('stock_full_view')
        .select('*')
        .order('stock_id', { ascending: false })
        .limit(5)

      setRecentStock((recent as StockFullView[]) || [])

      // Fetch low stock items
      const { data: lowItems } = await supabase
        .from('stock_full_view')
        .select('*')
        .eq('low_stock', true)
        .limit(5)

      setLowStockItems((lowItems as StockFullView[]) || [])

    } catch (error) {
      console.error('Dashboard fetch error:', error)
      toast.error('Veri yüklenirken hata oluştu')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchDashboardData()
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-500 mx-auto mb-4" />
          <p className="text-slate-400">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Warehouse className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">GTC Endüstriyel</h1>
                <p className="text-xs text-slate-400">Alosbi Depo</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="text-slate-400 hover:text-white hover:bg-slate-700"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-slate-400 hover:text-white hover:bg-slate-700"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Link href="/stock/entry">
            <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20 hover:border-emerald-500/40 transition-all cursor-pointer group">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="font-semibold text-white">Stok Girişi</p>
                  <p className="text-xs text-slate-400">Yeni ürün ekle</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/search">
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20 hover:border-blue-500/40 transition-all cursor-pointer group">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Search className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-white">Stok Ara</p>
                  <p className="text-xs text-slate-400">Ürün bul</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/stock/output">
            <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20 hover:border-orange-500/40 transition-all cursor-pointer group">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingDown className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="font-semibold text-white">Stok Çıkışı</p>
                  <p className="text-xs text-slate-400">Ürün çıkar</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/products">
            <Card className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border-cyan-500/20 hover:border-cyan-500/40 transition-all cursor-pointer group">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Package className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="font-semibold text-white">Ürünler</p>
                  <p className="text-xs text-slate-400">Ürün yönetimi</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/locations">
            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer group">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <LayoutGrid className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="font-semibold text-white">Yerleşim</p>
                  <p className="text-xs text-slate-400">Raf görünümü</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Package className="w-5 h-5 text-slate-400" />
                <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                  Ürün
                </Badge>
              </div>
              <p className="text-2xl font-bold text-white">{stats?.totalProducts}</p>
              <p className="text-xs text-slate-400">{stats?.totalVariants} varyant</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400">
                  Stok
                </Badge>
              </div>
              <p className="text-2xl font-bold text-white">{stats?.totalStock}</p>
              <p className="text-xs text-slate-400">toplam adet</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Building2 className="w-5 h-5 text-blue-400" />
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                  Konum
                </Badge>
              </div>
              <p className="text-2xl font-bold text-white">{stats?.locationsFilled}/{stats?.totalLocations}</p>
              <p className="text-xs text-slate-400">dolu hücre</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                <Badge variant="secondary" className="bg-orange-500/20 text-orange-400">
                  Uyarı
                </Badge>
              </div>
              <p className="text-2xl font-bold text-white">{stats?.lowStockCount}</p>
              <p className="text-xs text-slate-400">düşük stok</p>
            </CardContent>
          </Card>
        </div>

        {/* Floor Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-emerald-500/5 to-emerald-600/10 border-emerald-500/20">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <Shirt className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <CardTitle className="text-white">Zemin Kat</CardTitle>
                  <CardDescription className="text-slate-400">Tekstil Ürünleri</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Ürün Sayısı</span>
                <span className="text-xl font-bold text-white">{stats?.textileCount}</span>
              </div>
              <Separator className="my-2 bg-slate-700" />
              <div className="flex gap-2 flex-wrap">
                <Badge className="bg-emerald-500/20 text-emerald-400 border-0">Tulum</Badge>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-0">Kaban</Badge>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-0">Gömlek</Badge>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-0">Pantolon</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/5 to-blue-600/10 border-blue-500/20">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Footprints className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-white">1. Kat</CardTitle>
                  <CardDescription className="text-slate-400">Ayakkabı & Bot</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Ürün Sayısı</span>
                <span className="text-xl font-bold text-white">{stats?.shoesCount}</span>
              </div>
              <Separator className="my-2 bg-slate-700" />
              <div className="flex gap-2 flex-wrap">
                <Badge className="bg-blue-500/20 text-blue-400 border-0">YDS</Badge>
                <Badge className="bg-blue-500/20 text-blue-400 border-0">Starline</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Stock and Low Stock */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Low Stock Alerts */}
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                Düşük Stok Uyarıları
              </CardTitle>
              <CardDescription className="text-slate-400">
                Minimum seviyenin altındaki ürünler
              </CardDescription>
            </CardHeader>
            <CardContent>
              {lowStockItems.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Düşük stoklu ürün yok</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {lowStockItems.map((item) => (
                    <div key={item.stock_id} className="flex items-center justify-between p-3 bg-orange-500/5 border border-orange-500/20 rounded-lg">
                      <div>
                        <p className="font-medium text-white">{item.product_name}</p>
                        <p className="text-xs text-slate-400">
                          {item.sku} • {item.location_code}
                        </p>
                      </div>
                      <Badge variant="destructive" className="bg-orange-500/20 text-orange-400 border-0">
                        {item.quantity}/{item.min_quantity}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Stock List */}
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-400" />
                Son Stok Kayıtları
              </CardTitle>
              <CardDescription className="text-slate-400">
                En son eklenen stoklar
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentStock.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Henüz stok kaydı yok</p>
                  <Link href="/stock/entry">
                    <Button variant="outline" size="sm" className="mt-4">
                      <Plus className="w-4 h-4 mr-2" />
                      İlk Stoğu Ekle
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentStock.map((item) => (
                    <div key={item.stock_id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <div>
                        <p className="font-medium text-white">{item.product_name}</p>
                        <p className="text-xs text-slate-400">
                          {item.size} • {item.location_code}
                        </p>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-0">
                        {item.quantity} adet
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
