'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
    LayoutDashboard,
    Users,
    Settings,
    Shield,
    ChevronLeft,
    LogOut,
    Warehouse,
    Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/users', label: 'Kullanıcılar', icon: Users },
]

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const pathname = usePathname()
    const supabase = createClient()
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
    const [userEmail, setUserEmail] = useState<string>('')
    const [error, setError] = useState<string | null>(null)

    // Hardcoded admin email as fallback
    const ADMIN_EMAIL = 'azmicankaradas96@gmail.com'

    useEffect(() => {
        const checkAdmin = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
                return
            }

            setUserEmail(user.email || '')

            // Try to get profile from database
            const { data: profile, error: profileError } = await supabase
                .from('user_profiles')
                .select('role')
                .eq('id', user.id)
                .single()

            // If profile exists and has admin role
            if (profile?.role === 'admin') {
                setIsAdmin(true)
                return
            }

            // Fallback: check if email matches hardcoded admin
            if (user.email === ADMIN_EMAIL) {
                setIsAdmin(true)
                return
            }

            // If profile query failed, show specific error
            if (profileError) {
                console.error('Profile error:', profileError)
                setError(`Veritabanı hatası: ${profileError.message}. Lütfen SQL migration'ları çalıştırdığınızdan emin olun.`)
                return
            }

            // User exists but is not admin
            setError('Bu sayfaya erişim yetkiniz yok. Admin rolüne sahip olmanız gerekiyor.')
        }
        checkAdmin()
    }, [supabase, router])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-slate-800/50 border border-red-500/30 rounded-xl p-6 text-center space-y-4">
                    <Shield className="w-12 h-12 text-red-400 mx-auto" />
                    <h1 className="text-xl font-bold text-white">Erişim Hatası</h1>
                    <p className="text-slate-400 text-sm">{error}</p>
                    <div className="flex gap-3 justify-center">
                        <Link href="/">
                            <Button variant="outline" className="border-slate-600 text-slate-300">
                                <Warehouse className="w-4 h-4 mr-2" />
                                Ana Sayfa
                            </Button>
                        </Link>
                        <Button onClick={handleLogout} variant="ghost" className="text-slate-400">
                            Çıkış Yap
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    if (isAdmin === null) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-800/50 border-r border-slate-700/50 flex flex-col">
                {/* Logo */}
                <div className="p-4 border-b border-slate-700/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-white">Admin Panel</h1>
                            <p className="text-xs text-slate-400">GTC Alosbi Depo</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link key={item.href} href={item.href}>
                                <div className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                                    isActive
                                        ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                                        : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                                )}>
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">{item.label}</span>
                                </div>
                            </Link>
                        )
                    })}
                </nav>

                {/* User Info & Actions */}
                <div className="p-4 border-t border-slate-700/50 space-y-3">
                    <div className="px-3 py-2 bg-slate-700/30 rounded-lg">
                        <p className="text-xs text-slate-400">Giriş yapan:</p>
                        <p className="text-sm text-white truncate">{userEmail}</p>
                    </div>
                    <Link href="/">
                        <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700">
                            <Warehouse className="w-4 h-4 mr-2" />
                            Ana Sayfaya Dön
                        </Button>
                    </Link>
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="w-full text-slate-400 hover:text-white hover:bg-slate-700"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Çıkış Yap
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    )
}
