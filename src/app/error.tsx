'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('Application Error:', error)
    }, [error])

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            <Card className="max-w-md w-full bg-slate-800/50 border-slate-700/50">
                <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle className="w-8 h-8 text-red-400" />
                    </div>
                    <CardTitle className="text-white text-xl">Bir Hata Oluştu</CardTitle>
                    <CardDescription className="text-slate-400">
                        Beklenmeyen bir hata meydana geldi. Lütfen tekrar deneyin.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {error.digest && (
                        <p className="text-xs text-slate-500 text-center font-mono">
                            Hata Kodu: {error.digest}
                        </p>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            onClick={reset}
                            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                        >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Tekrar Dene
                        </Button>
                        <Link href="/">
                            <Button
                                variant="outline"
                                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                            >
                                <Home className="mr-2 h-4 w-4" />
                                Ana Sayfa
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
