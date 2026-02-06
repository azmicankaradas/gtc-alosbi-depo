'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                toast.error('Giriş Başarısız', {
                    description: error.message,
                })
                return
            }

            // Check approval status after successful authentication
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data: profile, error: profileError } = await supabase
                    .from('user_profiles')
                    .select('is_approved, status')
                    .eq('id', user.id)
                    .single()

                console.log('Profile query result:', { profile, profileError, userId: user.id })

                // If we can't fetch profile (RLS or other issue), still allow login and let middleware handle it
                if (profileError) {
                    console.error('Profile query error:', profileError)
                    // Continue to dashboard, middleware will handle the redirect
                    toast.success('Giriş Başarılı', {
                        description: 'Yönlendiriliyorsunuz...',
                    })
                    router.push('/')
                    router.refresh()
                    return
                }

                if (profile && (!profile.is_approved || profile.status === 'pending')) {
                    toast.info('Onay Bekleniyor', {
                        description: 'Hesabınız yönetici onayı bekliyor.',
                    })
                    router.push('/pending-approval')
                    router.refresh()
                    return
                }

                if (profile && profile.status === 'rejected') {
                    toast.error('Erişim Reddedildi', {
                        description: 'Hesabınız reddedilmiş.',
                    })
                    router.push('/access-denied')
                    router.refresh()
                    return
                }
            }

            toast.success('Giriş Başarılı', {
                description: 'Yönlendiriliyorsunuz...',
            })

            router.push('/')
            router.refresh()
        } catch (error) {
            toast.error('Bir hata oluştu', {
                description: 'Lütfen tekrar deneyin.',
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            toast.error('Şifreler Eşleşmiyor', {
                description: 'Lütfen şifreleri kontrol edin.',
            })
            return
        }

        if (password.length < 6) {
            toast.error('Şifre Çok Kısa', {
                description: 'Şifre en az 6 karakter olmalıdır.',
            })
            return
        }

        setIsLoading(true)

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: `${firstName} ${lastName}`.trim()
                    }
                }
            })

            if (error) {
                toast.error('Kayıt Başarısız', {
                    description: error.message,
                })
                return
            }

            toast.success('Kayıt Başarılı', {
                description: 'E-posta adresinizi doğrulayın.',
            })
        } catch (error) {
            toast.error('Bir hata oluştu', {
                description: 'Lütfen tekrar deneyin.',
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-1/2 -right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <Card className="w-full max-w-md relative bg-slate-800/50 backdrop-blur-xl border-slate-700/50 shadow-2xl">
                <CardHeader className="text-center space-y-4">
                    <div className="mx-auto">
                        <Image
                            src="/logo.png"
                            alt="GTC Endüstriyel Ürünler"
                            width={200}
                            height={80}
                            className="h-16 w-auto"
                            priority
                        />
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-bold text-white">
                            GTC Endüstriyel
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            Alosbi Depo Stok Yönetim Sistemi
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 bg-slate-700/50">
                            <TabsTrigger
                                value="login"
                                className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
                            >
                                Giriş Yap
                            </TabsTrigger>
                            <TabsTrigger
                                value="register"
                                className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
                            >
                                Kayıt Ol
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="login">
                            <form onSubmit={handleLogin} className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-slate-300">E-posta</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="ornek@gtcendustriyel.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-slate-300">Şifre</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20 pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/25 transition-all duration-300"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Giriş yapılıyor...
                                        </>
                                    ) : (
                                        'Giriş Yap'
                                    )}
                                </Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="register">
                            <form onSubmit={handleRegister} className="space-y-4 mt-4">
                                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 mb-4">
                                    <p className="text-xs text-amber-200">
                                        <strong>Not:</strong> Kayıt sonrası hesabınız yönetici onayına sunulacaktır.
                                        Onay alana kadar sisteme erişim sağlayamazsınız.
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName" className="text-slate-300">Ad</Label>
                                        <Input
                                            id="firstName"
                                            type="text"
                                            placeholder="Ahmet"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            required
                                            className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName" className="text-slate-300">Soyad</Label>
                                        <Input
                                            id="lastName"
                                            type="text"
                                            placeholder="Yılmaz"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            required
                                            className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="reg-email" className="text-slate-300">E-posta</Label>
                                    <Input
                                        id="reg-email"
                                        type="email"
                                        placeholder="ornek@gtcendustriyel.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="reg-password" className="text-slate-300">Şifre</Label>
                                    <Input
                                        id="reg-password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm-password" className="text-slate-300">Şifre Tekrar</Label>
                                    <Input
                                        id="confirm-password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/25 transition-all duration-300"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Kayıt yapılıyor...
                                        </>
                                    ) : (
                                        'Kayıt Ol'
                                    )}
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}
