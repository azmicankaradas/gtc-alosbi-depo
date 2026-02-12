'use client'

export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { XCircle, LogOut, Mail, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AccessDeniedPage() {
    const router = useRouter()
    const supabase = createClient()
    const [userEmail, setUserEmail] = useState<string | null>(null)

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUserEmail(user.email || null)
            }
        }
        getUser()
    }, [supabase.auth])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-1/2 -right-1/4 w-96 h-96 bg-slate-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <Card className="w-full max-w-md relative bg-slate-800/50 backdrop-blur-xl border-slate-700/50 shadow-2xl">
                <CardHeader className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/20">
                        <XCircle className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-bold text-white">
                            Erişim Reddedildi
                        </CardTitle>
                        <CardDescription className="text-slate-400 mt-2">
                            Hesabınız onaylanmadı
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="bg-slate-700/30 rounded-lg p-4 space-y-3">
                        <div className="flex items-center gap-3 text-slate-300">
                            <Mail className="w-5 h-5 text-slate-400" />
                            <span className="text-sm">{userEmail || 'Yükleniyor...'}</span>
                        </div>
                        <p className="text-sm text-slate-400">
                            Üzgünüz, kayıt talebiniz yönetici tarafından reddedilmiştir.
                            Bu durumun bir hata olduğunu düşünüyorsanız, lütfen sistem yöneticisi
                            ile iletişime geçin.
                        </p>
                    </div>

                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                        <p className="text-sm text-red-200">
                            <strong>Önemli:</strong> Bu hesapla sisteme erişim sağlayamazsınız.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            onClick={() => router.push('/login')}
                            variant="outline"
                            className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Giriş Sayfası
                        </Button>
                        <Button
                            onClick={handleLogout}
                            variant="outline"
                            className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Çıkış Yap
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
