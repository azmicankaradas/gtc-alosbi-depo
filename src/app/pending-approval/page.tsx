'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, LogOut, Mail } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function PendingApprovalPage() {
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
                <div className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-1/2 -right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <Card className="w-full max-w-md relative bg-slate-800/50 backdrop-blur-xl border-slate-700/50 shadow-2xl">
                <CardHeader className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                        <Clock className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-bold text-white">
                            Onay Bekleniyor
                        </CardTitle>
                        <CardDescription className="text-slate-400 mt-2">
                            Hesabınız yönetici onayı bekliyor
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
                            Kaydınız başarıyla tamamlandı. Sisteme erişebilmeniz için bir yöneticinin
                            hesabınızı onaylaması gerekmektedir. Onay işlemi genellikle 24 saat içinde
                            tamamlanır.
                        </p>
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                        <p className="text-sm text-amber-200">
                            <strong>Not:</strong> Onay aldığınızda aynı e-posta ve şifre ile giriş yapabilirsiniz.
                        </p>
                    </div>

                    <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Çıkış Yap
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
