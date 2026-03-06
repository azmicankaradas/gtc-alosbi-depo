'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Users,
    Package,
    TrendingUp,
    MapPin,
    Activity,
    Loader2
} from 'lucide-react'

interface AdminStats {
    totalUsers: number
    totalProducts: number
    totalStock: number
    filledLocations: number
    totalLocations: number
}

export default function AdminDashboardPage() {
    const supabase = createClient()
    const [stats, setStats] = useState<AdminStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [recentUsers, setRecentUsers] = useState<any[]>([])

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // User stats
                const { count: totalUsers } = await supabase
                    .from('user_profiles')
                    .select('*', { count: 'exact', head: true })

                // Recent users
                const { data: recent } = await supabase
                    .from('user_profiles')
                    .select('id, email, full_name, created_at')
                    .order('created_at', { ascending: false })
                    .limit(5)

                setRecentUsers(recent || [])

                // Product stats
                const { count: productCount } = await supabase
                    .from('products')
                    .select('*', { count: 'exact', head: true })
                    .eq('is_active', true)

                // Stock stats
                const { data: stockData } = await supabase
                    .from('stock')
                    .select('quantity, location_id')
                    .gt('quantity', 0)

                const totalStock = stockData?.reduce((sum, s) => sum + s.quantity, 0) || 0
                const uniqueLocations = new Set(stockData?.map(s => s.location_id) || [])

                // Location count
                const { count: totalLocations } = await supabase
                    .from('locations')
                    .select('*', { count: 'exact', head: true })

                setStats({
                    totalUsers: totalUsers || 0,
                    totalProducts: productCount || 0,
                    totalStock,
                    filledLocations: uniqueLocations.size,
                    totalLocations: totalLocations || 180
                })
            } catch (error) {
                console.error('Stats fetch error:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [supabase])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
            </div>
        )
    }

    return (
        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">Yönetim Paneli</h1>
                <p className="text-slate-400">Sistem durumu ve istatistikler</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">Kullanıcılar</p>
                                <p className="text-2xl font-bold text-white">{stats?.totalUsers}</p>
                            </div>
                            <Users className="w-8 h-8 text-purple-400" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">Toplam Ürün</p>
                                <p className="text-2xl font-bold text-white">{stats?.totalProducts}</p>
                            </div>
                            <Package className="w-8 h-8 text-cyan-400" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">Toplam Stok</p>
                                <p className="text-2xl font-bold text-white">{stats?.totalStock}</p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-emerald-400" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">Dolu Konum</p>
                                <p className="text-2xl font-bold text-white">
                                    {stats?.filledLocations}/{stats?.totalLocations}
                                </p>
                            </div>
                            <MapPin className="w-8 h-8 text-blue-400" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Users */}
            <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Activity className="w-5 h-5 text-purple-400" />
                        Son Kayıt Olan Kullanıcılar
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                        En son kaydolan 5 kullanıcı
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {recentUsers.map((user) => (
                            <div
                                key={user.id}
                                className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
                            >
                                <div>
                                    <p className="text-white font-medium text-sm md:text-base truncate max-w-[180px] md:max-w-none">{user.email}</p>
                                    <p className="text-xs text-slate-400">
                                        {user.full_name || '-'} • {new Date(user.created_at).toLocaleDateString('tr-TR', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {recentUsers.length === 0 && (
                            <p className="text-center text-slate-500 py-4">Henüz kullanıcı yok</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
