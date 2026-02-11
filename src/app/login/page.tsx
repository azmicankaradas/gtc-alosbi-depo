'use client'

export const dynamic = 'force-dynamic'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Eye, EyeOff, ShieldCheck, ShieldAlert } from 'lucide-react'
import { toast } from 'sonner'

// Şifre güvenlik kuralları
const passwordRules = [
    { test: (p: string) => p.length >= 8, label: 'En az 8 karakter' },
    { test: (p: string) => /[A-Z]/.test(p), label: 'En az 1 büyük harf' },
    { test: (p: string) => /[a-z]/.test(p), label: 'En az 1 küçük harf' },
    { test: (p: string) => /[0-9]/.test(p), label: 'En az 1 rakam' },
    { test: (p: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p), label: 'En az 1 özel karakter (!@#$%...)' },
]

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

    // Şifre gücü hesaplama
    const passwordStrength = useMemo(() => {
        const passed = passwordRules.filter(rule => rule.test(password))
        const score = passed.length
        const percent = (score / passwordRules.length) * 100
        let level: 'weak' | 'medium' | 'strong' | 'none' = 'none'
        let color = 'bg-slate-600'
        let text = ''
        if (password.length === 0) { level = 'none' }
        else if (score <= 2) { level = 'weak'; color = 'bg-red-500'; text = 'Zayıf' }
        else if (score <= 4) { level = 'medium'; color = 'bg-amber-500'; text = 'Orta' }
        else { level = 'strong'; color = 'bg-emerald-500'; text = 'Güçlü' }
        return { score, percent, level, color, text, rules: passwordRules.map(r => ({ ...r, passed: r.test(password) })) }
    }, [password])

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
                    description: 'E-posta veya şifre hatalı.',
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

                // Profile query logged server-side only

                // If we can't fetch profile (RLS or other issue), still allow login and let middleware handle it
                if (profileError) {
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

        const failedRules = passwordRules.filter(rule => !rule.test(password))
        if (failedRules.length > 0) {
            toast.error('Şifre Yeterince Güçlü Değil', {
                description: failedRules.map(r => r.label).join(', '),
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
                    description: 'Kayıt işlemi sırasında bir hata oluştu. Lütfen bilgilerinizi kontrol edin.',
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
                                    {/* Şifre gücü göstergesi */}
                                    {password.length > 0 && (
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full ${passwordStrength.color} rounded-full transition-all duration-300`}
                                                        style={{ width: `${passwordStrength.percent}%` }}
                                                    />
                                                </div>
                                                <span className={`text-xs font-medium ${passwordStrength.level === 'weak' ? 'text-red-400' :
                                                        passwordStrength.level === 'medium' ? 'text-amber-400' :
                                                            'text-emerald-400'
                                                    }`}>
                                                    {passwordStrength.text}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-1 gap-0.5">
                                                {passwordStrength.rules.map((rule, i) => (
                                                    <div key={i} className={`flex items-center gap-1.5 text-[10px] ${rule.passed ? 'text-emerald-400' : 'text-slate-500'
                                                        }`}>
                                                        {rule.passed ? (
                                                            <ShieldCheck className="w-3 h-3" />
                                                        ) : (
                                                            <ShieldAlert className="w-3 h-3" />
                                                        )}
                                                        {rule.label}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
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
