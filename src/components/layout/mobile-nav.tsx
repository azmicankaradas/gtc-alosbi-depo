'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Home,
    Plus,
    Search,
    Package,
    FileText
} from 'lucide-react'

const navItems = [
    { href: '/', icon: Home, label: 'Ana' },
    { href: '/stock/entry', icon: Plus, label: 'Giriş' },
    { href: '/search', icon: Search, label: 'Ara' },
    { href: '/products', icon: Package, label: 'Ürün' },
    { href: '/reports', icon: FileText, label: 'Rapor' },
]

export function MobileNav() {
    const pathname = usePathname()

    // Don't show on login page
    if (pathname === '/login') return null

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/50 safe-area-bottom">
            <div className="flex items-center justify-around py-2 px-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${isActive
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
